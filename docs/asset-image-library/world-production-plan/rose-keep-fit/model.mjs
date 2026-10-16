// Local Function geometry only. Canonical world placement and final art stay separate.
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const productionCamera={location:[8,10,14],target:[0,2,-6],verticalFovDegrees:55,viewport:[1440,960]};
export function sampleRoute(ps,spacing=.04){const out=[ps[0]];for(let i=1;i<ps.length;i++){const a=ps[i-1],b=ps[i],n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/spacing));for(let j=1;j<=n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}return out;}
export function createRose(handoff,shared){
 const asset=id=>handoff.assets.find(a=>a.asset_id===id),placement=id=>handoff.assembly_proposal.placements.find(p=>p.asset_id===id).position_xyz_m;
 const stair=asset('B04-STRUCT-001-S04'),wallAsset=asset('B04-STRUCT-001-S02'),terraceAsset=asset('B04-STRUCT-001-S03');
 const [sx,sy,sz]=placement(stair.asset_id),[tx,ty,tz]=placement(terraceAsset.asset_id),[wx,wy,wz]=placement(wallAsset.asset_id);
 const flight={id:stair.asset_id,x:sx,y:sy,z:sz,width:stair.dimensions_m_proposed[0],...stair.stairs};
 const rise=flight.risers*flight.rise_m,landingZ=sz-flight.run_m-flight.landing_side_m;
 const doorway={id:'B04-ENTRY-DOOR',kind:'door',asset_id:wallAsset.asset_id,x:wx+wallAsset.opening.centre_x_m,y:wy,zmin:wz,zmax:wz+wallAsset.opening.wall_thickness_m,width:wallAsset.opening.clear_width_m,spring:wallAsset.opening.spring_height_m,apex:wallAsset.opening.apex_height_m};
 const walls=[{id:'ENTRANCE-WALL',asset_id:wallAsset.asset_id,xmin:wx-4,xmax:wx+4,zmin:wz,zmax:wz+.6,y:wy,height:6,opening:doorway},{id:'WALL-RETURN',asset_id:wallAsset.asset_id,xmin:wx+3.4,xmax:wx+4,zmin:wz,zmax:wz+4,y:wy,height:6}];
 const decks=[
  {id:'LOWER-APRON',asset_id:'PROCEDURAL-APPROACH',xmin:-2,xmax:2,zmin:0,zmax:4,y:0,bottom:-.25},
  {id:'TOP-LANDING',asset_id:stair.asset_id,xmin:sx-flight.width/2,xmax:sx+flight.width/2,zmin:landingZ,zmax:sz-flight.run_m,y:sy+rise,bottom:sy-.25},
  {id:'TERRACE',asset_id:terraceAsset.asset_id,xmin:tx-terraceAsset.dimensions_m_proposed[0]/2,xmax:tx+terraceAsset.dimensions_m_proposed[0]/2,zmin:tz-terraceAsset.dimensions_m_proposed[1]/2,zmax:tz+terraceAsset.dimensions_m_proposed[1]/2,y:ty,bottom:ty-terraceAsset.dimensions_m_proposed[2]},
  {id:'COURT-STUB',asset_id:'PROCEDURAL-DESTINATION',xmin:wx-4,xmax:wx+4,zmin:wz-4,zmax:wz+.6,y:wy,bottom:-.25},
 ];
 const footprints=[...decks,{id:flight.id,xmin:sx-flight.width/2,xmax:sx+flight.width/2,zmin:sz-flight.run_m,zmax:sz}];
 const inside=(r,x,z,eps=1e-8)=>x>=r.xmin-eps&&x<=r.xmax+eps&&z>=r.zmin-eps&&z<=r.zmax+eps;
 function surface(x,z){const out=decks.filter(d=>inside(d,x,z)).map(d=>({id:d.id,y:d.y}));if(inside(footprints.at(-1),x,z)){const n=clamp(Math.floor((sz-z+1e-8)/flight.going_m)+1,1,flight.risers);out.push({id:flight.id,y:sy+n*flight.rise_m});}return out.sort((a,b)=>b.y-a.y)[0]||null;}
 const archTop=x=>{const u=Math.abs(x-doorway.x);return u>doorway.width/2+1e-8?-Infinity:doorway.y+doorway.spring+(doorway.apex-doorway.spring)*Math.pow(Math.max(0,1-u/(doorway.width/2)),.65);};
 const circleRect=(x,z,r,w)=>Math.hypot(x-clamp(x,w.xmin,w.xmax),z-clamp(z,w.zmin,w.zmax))<r-1e-8;
 const pointInWall=(x,z)=>walls.some(w=>inside(w,x,z,.02)&&(!w.opening||Math.abs(x-doorway.x)>doorway.width/2));
 const segmentDistance=(x,z,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],t=clamp(((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz),0,1);return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);};
 const xs=[...new Set(footprints.flatMap(r=>[r.xmin,r.xmax]))].sort((a,b)=>a-b),zs=[...new Set(footprints.flatMap(r=>[r.zmin,r.zmax]))].sort((a,b)=>a-b),guards=[];
 // Boundary extraction removes rails at joined sockets. The unused right landing outlet remains guarded.
 for(const r of footprints){const edges=[{a:[r.xmin,r.zmin],b:[r.xmax,r.zmin],inward:[0,1],cuts:xs},{a:[r.xmin,r.zmax],b:[r.xmax,r.zmax],inward:[0,-1],cuts:xs},{a:[r.xmin,r.zmin],b:[r.xmin,r.zmax],inward:[1,0],cuts:zs},{a:[r.xmax,r.zmin],b:[r.xmax,r.zmax],inward:[-1,0],cuts:zs}];
  for(const edge of edges){const axis=edge.a[1]===edge.b[1]?0:1,cuts=edge.cuts.filter(v=>v>=edge.a[axis]&&v<=edge.b[axis]);for(let i=1;i<cuts.length;i++){const a=[...edge.a],b=[...edge.b];a[axis]=cuts[i-1];b[axis]=cuts[i];const x=(a[0]+b[0])/2,z=(a[1]+b[1])/2;if(surface(x-edge.inward[0]*.001,z-edge.inward[1]*.001)||surface(x,z)?.y===0||pointInWall(x,z))continue;guards.push({id:`GUARD-${guards.length+1}`,a:a.map((v,j)=>v+edge.inward[j]*shared.parapet.edge_offset_m),b:b.map((v,j)=>v+edge.inward[j]*shared.parapet.edge_offset_m)});}}
 }
 const guardBase=(x,z)=>{if(inside(footprints.at(-1),x,z))return sy+Math.min(rise,(sz-z+flight.going_m)*flight.rise_m/flight.going_m);return surface(x,z)?.y??0;};
 function canStand(x,z,r=shared.player.radius_m,h=shared.player.height_m){const floor=surface(x,z);if(!floor)return false;for(let i=0;i<32;i++){const t=i/32*Math.PI*2;if(!surface(x+r*Math.cos(t),z+r*Math.sin(t)))return false;}if(guards.some(g=>segmentDistance(x,z,g.a,g.b)<r+shared.parapet.thickness_m/2-1e-8))return false;
  for(const w of walls){if(!circleRect(x,z,r,w))continue;if(!w.opening)return false;const u=Math.abs(x-doorway.x)+r;if(u>doorway.width/2+1e-8||floor.y+h>archTop(doorway.x+u)+1e-8)return false;}return true;
 }
 function move(p,dx,dz){let travel=0;const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.04));for(let i=0;i<n;i++)for(const[x,z]of[[p.x+dx/n,p.z+dz/n],[p.x+dx/n,p.z],[p.x,p.z+dz/n]]){const a=surface(p.x,p.z),b=surface(x,z);if(a&&b&&canStand(x,z)&&Math.abs(b.y-a.y)<=shared.player.max_step_m+1e-8){travel+=Math.hypot(x-p.x,z-p.z);p.x=x;p.z=z;break;}}return travel;}
 const routes={entrance:[[0,2.5],[0,-4.4],[0,-8.8],[0,-13.8],[-1.8,-13.8],[0,-13.8],[0,2.5]],terrace:[[0,2.5],[0,-4.4],[0,-6.5],[-2.5,-7],[-2.5,-9.5],[0,-9.5],[0,-13.8],[1.8,-13.8],[0,-13.8],[0,2.5]]};
 function auditRoute(ps){const p={x:ps[0][0],z:ps[0][1]},visited=new Set(),ys=[];let travelled=0,maxStep=0,previous=surface(p.x,p.z).y;for(const[x,z]of sampleRoute(ps).slice(1)){const want=Math.hypot(x-p.x,z-p.z),got=move(p,x-p.x,z-p.z);travelled+=got;const f=surface(p.x,p.z);visited.add(f?.id);maxStep=Math.max(maxStep,Math.abs((f?.y??0)-previous));previous=f?.y??previous;ys.push(previous);if(Math.abs(got-want)>1e-6||Math.hypot(x-p.x,z-p.z)>1e-6)return{status:'blocked',at:{...p},wanted:[x,z],travelled_m:travelled};}return{status:'pass',length_m:travelled,max_step_m:maxStep,max_floor_m:Math.max(...ys),visited:[...visited],end:p};}
 const footing={id:'RETURN-FOOTING',xmin:wx+3.3,xmax:wx+4.1,zmin:wz-.1,zmax:wz+4.1,bottom:-.25,y:wy};
 return{id:'B04-ENTRY-FIT-001',handoff,shared,flight,decks,footprints,walls,doorway,footing,guards,surface,archTop,guardBase,canStand,move,routes,auditRoute,
  scope:['Separate local Function specimen: no complete keep, final asset import, world placement, export or deployment.',
   'S04/S03/S02 dimensions and named ports come from the first-batch handoff. Source image proportions do not override the measured contract.',
   'The aligned door shifts the return 0.5 m outside the 8 m terrace. A named additional footing supports it without enlarging the reserved world footprint.',
   'The return/court footing and approach are engineering placeholders, not final cliff or drainage design. Load-bearing engineering remains unresolved.',
   'Only the straight landing outlet is active; the side outlet is visibly guarded until another supported route joins it.',
   'D05 rail and D07 arch are simple fit specimens, not accepted carvings. No turret, roof or hidden indoor floor plan is inferred here.',
   'Actual world B04/B25 arrival, grading, bridges and regional return remain unresolved. This fixture does not validate the 78 m pad or global R02 route.']};
}
