import {createBiomes} from './biomes.mjs';
import {createForestHabitats} from './habitats.mjs';
// Pure geometry shared by the browser and audit. World X east, Z south, Y up.
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const mix=(a,b,t)=>a+(b-a)*t;
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
export const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
export function inside([x,z],polygon){let hit=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
 const [a,b]=polygon[i],[c,d]=polygon[j];if((b>z)!==(d>z)&&x<(c-a)*(z-b)/(d-b)+a)hit=!hit;
}return hit;}
export function segment(p,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz||1),0,1);return {d:distance(p,[a[0]+t*dx,a[1]+t*dz]),t};}
export function nearLine(p,points,levels){let best={d:Infinity};for(let i=1;i<points.length;i++){const v=segment(p,points[i-1],points[i]);if(v.d<best.d)best={...v,index:i-1,level:levels?mix(levels[i-1],levels[i],v.t):0};}return best;}
export const length=points=>points.slice(1).reduce((sum,p,i)=>sum+distance(points[i],p),0);
export function resample(points,step=25){const out=[points[0]];for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],n=Math.ceil(distance(a,b)/step);for(let j=1;j<=n;j++)out.push([mix(a[0],b[0],j/n),mix(a[1],b[1],j/n)]);}return out;}
export function irregularEllipse(cx,cz,rx,rz){return Array.from({length:48},(_,i)=>{const a=i/48*Math.PI*2,k=1+0.045*Math.sin(a*3)+0.025*Math.cos(a*5);return[cx+rx*k*Math.cos(a),cz+rz*k*Math.sin(a)];});}
export function createGeography(source,proposal){
 const shore=source.water_and_coast.mainland_shoreline_xz_m,shoreClosed=[...shore,shore[0]];
 const lakeInfo=source.water_and_coast.Lantern_Lake,lagoonInfo=source.water_and_coast.Moonwater_basin;
 const lake=irregularEllipse(...lakeInfo.centre_xz_m,...lakeInfo.approx_size_m.map(v=>v/2));
 const lagoon=irregularEllipse(...lagoonInfo.centre_xz_m,...lagoonInfo.approx_size_m.map(v=>v/2));
 const lakes=[{id:'S03',name:'Lantern Lake reserved cove',points:lake,level:proposal.lake_level_m}];
 const biomes=createBiomes(source,{inside,smooth,nearLine,distance});
 const regionMix=biomes.weights;
 let habitats=null;
 function raw(x,z){const p=[x,z],d=nearLine(p,shoreClosed).d;if(!inside(p,shore))return -8-0.025*Math.min(d,400);
  const hill=(cx,cz,rx,rz,h)=>h*Math.exp(-(((x-cx)/rx)**2+((z-cz)/rz)**2)*2);
  return (8+34*smooth(0,700,d)+7*Math.sin(x/700)*Math.cos(z/900)+hill(-2300,-2300,1500,1100,140)+hill(2550,-2050,1300,1200,170)+hill(2200,1950,1100,900,95)+biomes.relief(x,z))*smooth(0,90,d);
 }
 const pads=[...source.landmarks,...source.forest_cottages].filter(s=>s.id!=='B11').map(s=>({...s,level:proposal.pad_levels_m[s.id]??Math.max(14,Math.round(raw(s.x_m,s.z_m)))}));
 function padAt(x,z){return pads.find(s=>Math.abs(x-s.x_m)<=s.width_m/2+2&&Math.abs(z-s.z_m)<=s.depth_m/2+2);}
 function saltAt(x,z){const p=[x,z];if(padAt(x,z))return null;if(!inside(p,shore))return {id:'SEA',kind:'sea',level:0};if(inside(p,lagoon))return{id:'LAGOON',kind:'lagoon',level:0};
  for(const c of proposal.canals)if(nearLine(p,c.points).d<c.width_m/2)return{id:c.id,kind:'canal',level:0};return null;
 }
 function waterAt(x,z){const salt=saltAt(x,z);if(salt)return salt;if(padAt(x,z))return null;
  for(const l of lakes)if(inside([x,z],l.points))return{id:l.id,kind:'lake',level:l.level};
  let w=null;for(const r of proposal.river_proposals){const n=nearLine([x,z],r.points,r.levels);if(n.d<r.width_m/2&&(!w||n.d<w.distance))w={id:r.id,kind:'river',level:n.level,distance:n.d};}return w;
 }
 function height(x,z){let y=raw(x,z);const p=[x,z];
  const adjust=(poly,level,depth)=>{if(inside(p,poly)){y=level-depth;return;}const d=nearLine(p,[...poly,poly[0]]).d;if(d<100)y=mix(Math.max(y,level+2),y,smooth(0,100,d));};
  adjust(lagoon,0,8);adjust(lake,proposal.lake_level_m,6);
  for(const c of proposal.canals){const d=nearLine(p,c.points).d,w=c.width_m/2;if(d<w)y=Math.min(y,-4);else if(d<w+65)y=mix(2,y,smooth(w,w+65,d));}
  for(const r of proposal.river_proposals){const n=nearLine(p,r.points,r.levels),w=r.width_m/2;if(n.d<w)y=n.level-2;else if(n.d<w+60)y=mix(n.level+2,y,smooth(w,w+60,n.d));}
  for(const s of pads){const dx=Math.max(0,Math.abs(x-s.x_m)-s.width_m/2-2),dz=Math.max(0,Math.abs(z-s.z_m)-s.depth_m/2-2),d=Math.hypot(dx,dz);if(d<80)y=mix(s.level,y,smooth(0,80,d));}
  const water=waterAt(x,z);if(water)y=Math.min(y,water.level-(water.kind==='river'?2:4));
  return y;
 }
 const navigable=(x,z,radius=4)=>[[0,0],...Array.from({length:8},(_,i)=>[radius*Math.cos(i*Math.PI/4),radius*Math.sin(i*Math.PI/4)])].every(([dx,dz])=>!!saltAt(x+dx,z+dz));
 const cottage=source.forest_cottages.find(c=>c.id===proposal.forest_sample.source_cottage),f=proposal.forest_sample,datum=pads.find(p=>p.id===cottage.id).level-.4;
 function forestBase(x,z){let y=-0.006*z+0.12*Math.sin(x*0.04)*Math.cos(z*0.025);const d=Math.hypot(Math.max(0,Math.abs(x)-8),Math.max(0,Math.abs(z)-7));return mix(0.4,y,smooth(0,6,d))+(habitats?.relief(x,z)||0);}
 function forestWater(x,z){const p=f.pond,rr=Math.hypot((x-p.centre[0])/p.radii[0],(z-p.centre[1])/p.radii[1]);if(rr<1)return {kind:'pond',level:datum+p.level_relative_m};const n=nearLine([x,z],f.rill.points,f.rill.levels);if(n.d<f.rill.width_m/2)return {kind:'rill',level:datum+n.level};return null;}
 function bridgeContains(x,z,margin=0){const v=f.bridge,dx=x-v.centre[0],dz=z-v.centre[1],along=dx*v.direction[0]+dz*v.direction[1],across=-dx*v.direction[1]+dz*v.direction[0];return Math.abs(along)<=v.length_m/2-margin&&Math.abs(across)<=v.width_m/2-margin;}
 function forestHeight(x,z){let y=forestBase(x,z);const p=f.pond,r=Math.hypot((x-p.centre[0])/p.radii[0],(z-p.centre[1])/p.radii[1]);if(r<1)y=p.level_relative_m-1.2;else if(r<1.35)y=mix(p.level_relative_m+0.05,y,smooth(1,1.35,r));
  const n=nearLine([x,z],f.rill.points,f.rill.levels);if(n.d<2.5)y=mix(n.level-0.25,y,smooth(0.5,2.5,n.d));const local=datum+y,edge=smooth(70,75,Math.hypot(x,z));return edge?mix(local,height(cottage.x_m+x,cottage.z_m+z),edge):local;
 }
 function forestFloor(x,z){const b=f.bridge,dx=x-b.centre[0],dz=z-b.centre[1],along=Math.abs(dx*b.direction[0]+dz*b.direction[1]),across=Math.abs(-dx*b.direction[1]+dz*b.direction[0]);if(across<=b.width_m/2&&along>b.length_m/2&&along<b.length_m/2+b.ramp_length_m){const t=(along-b.length_m/2)/b.ramp_length_m;return mix(datum+b.deck_relative_m,forestHeight(x,z),smooth(0,1,t));}if(bridgeContains(x,z))return datum+f.bridge.deck_relative_m;if(Math.abs(x)<6&&Math.abs(z)<4.5)return datum+f.cottage.floor_relative_m;return forestHeight(x,z);}
 const bedroom=proposal.bedroom_sample,neck=bedroom.neck,b=bedroom.balcony;
 const inRect=(x,z,x0,x1,z0,z1)=>x>=x0&&x<=x1&&z>=z0&&z<=z1;
 function roomSurface(x,z){return inRect(x,z,-12,12,-9,9)||inRect(x,z,neck.xmin,neck.xmax,neck.zmin,neck.zmax)||distance([x,z],b.centre)<=b.rail_radius_m||inRect(x,z,-1.6,1.6,9,13);}
 const walls=[[-12,-9,12,-9],[12,-9,12,9],[-12,9,-1.2,9],[1.2,9,12,9],[-12,-9,-12,-5],[-12,3,-12,9]];
 function cottageWalls(x,z,r){const walls=[[-6,-4.5,6,-4.5],[-6,-4.5,-6,4.5],[6,-4.5,6,4.5],[-6,4.5,-1.2,4.5],[1.2,4.5,6,4.5]];return walls.some(([a,b,c,d])=>segment([x,z],[a,b],[c,d]).d<r);}
 function canWalk(mode,x,z,r=0.45){if(mode==='bedroom'){
   for(let i=0;i<16;i++){const a=i/16*Math.PI*2;if(!roomSurface(x+r*Math.cos(a),z+r*Math.sin(a)))return false;}
   if(walls.some(([a,b,c,d])=>segment([x,z],[a,b],[c,d]).d<r))return false;
   for(const bed of [bedroom.bed,...bedroom.furnishings])if(Math.hypot(Math.max(0,Math.abs(x-bed.centre[0])-bed.width_m/2),Math.max(0,Math.abs(z-bed.centre[1])-bed.depth_m/2))<r)return false;return true;
  }
  if(habitats?.blocked(x,z,r))return false;
  if(mode!=='forest'||Math.abs(x)>74-r||Math.abs(z)>74-r||cottageWalls(x,z,r))return false;
  for(const [dx,dz] of [[0,0],[r,0],[-r,0],[0,r],[0,-r]])if(forestWater(x+dx,z+dz)&&!bridgeContains(x+dx,z+dz))return false;
  const h=forestFloor(x,z);for(const [dx,dz] of [[r,0],[-r,0],[0,r],[0,-r]])if(Math.abs(forestFloor(x+dx,z+dz)-h)>0.55)return false;return true;
 }
 function routeReport(route){const ps=resample(route.points_xz_m,25),positions=ps.map(([x,z])=>({x,z,y:height(x,z),wet:waterAt(x,z)}));let maxGrade=0,wetSamples=0;const crossings=[];let start=-1;
  for(let i=0;i<positions.length;i++){const p=positions[i];if(p.wet)wetSamples++;if(p.wet&&start<0)start=i;if(start>=0&&(!p.wet||i===positions.length-1)){const end=p.wet?i:i-1;crossings.push({point:ps[Math.floor((start+end)/2)],water:positions[start].wet.id,length_m:25*(end-start+1),status:route.mode==='bridge'?'Bridge corridor; landing design pending':route.mode==='boat'?'Source boat line; compare new water-only route':'Crossing needs bridge/route grading'});start=-1;}
   if(i)maxGrade=Math.max(maxGrade,Math.abs(p.y-positions[i-1].y)/distance(ps[i],ps[i-1]));}
  const legCount=Math.max(1,Math.ceil(length(route.points_xz_m)/500));return {id:route.id,name:route.name,mode:route.mode,points:route.points_xz_m,length_m:length(route.points_xz_m),max_ground_grade:maxGrade,wet_samples:wetSamples,sample_count:positions.length,crossings,profiles:positions,local_leg_count_proposed:legCount,status:'Regional corridor, not validated navigation; use local legs and reviewed transfers'};
 }
 const api={source,proposal,shore,lake,lagoon,lakes,pads,padAt,raw,regionMix,biomes,height,waterAt,saltAt,navigable,forest:{origin:cottage,datum,base:forestBase,height:forestHeight,floor:forestFloor,water:forestWater,bridgeContains},bedroom:{walls,surface:roomSurface},canWalk,routeReport};
 habitats=createForestHabitats(api,proposal,{nearLine,distance,smooth});
 // Placement heights are evaluated after micro-relief is available.
 for(const o of habitats.objects)o.y=forestHeight(o.x,o.z);
 api.habitats=habitats;return api;
}
