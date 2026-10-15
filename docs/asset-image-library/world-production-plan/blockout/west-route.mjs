import {distance,nearLine,resample,mix,smooth,segment,length} from './geography.mjs';

// Engineering alternatives: all source anchors, terrain and reference art stay immutable.
export function createWestRoute(geo,source,proposal,kit,access){
 const cottage=source.forest_cottages.find(c=>c.id==='FC05'),village=source.landmarks.find(c=>c.id==='B12');
 const z=-650,gate={x:village.x_m-village.width_m/2,z,width:kit.opening.clear_width_m,depth:kit.opening.wall_thickness_m,clear_height:kit.opening.clear_height_m,apex:kit.opening.apex_m,y:geo.pads.find(p=>p.id==='B12').level+.05,status:'Proposed west gate at reservation boundary; village streets and final architecture unresolved'};
 const local=p=>[p[0]-cottage.x_m,p[1]-cottage.z_m];
 function ground(x,z){const p=local([x,z]);return Math.hypot(...p)<75?geo.forest.floor(...p):geo.height(x,z);}
 const fullWidth=kit.flight.width_m,clearWidth=kit.flight.clear_width_m,body=kit.player.radius_m,modules=[];
 const bridge={id:'WEST-BRIDGE',xmin:-2840,xmax:-2770,zmin:z-1.6,zmax:z+1.6};
 let required=0;for(let x=bridge.xmin;x<=bridge.xmax;x+=.25)for(const dz of [-1.6,0,1.6]){const w=geo.waterAt(x,z+dz);required=Math.max(required,ground(x,z+dz)+.05,w?w.level+access.contract.slab_m+access.contract.water_headroom_m+.25:-Infinity);}
 bridge.y=Math.ceil(required/kit.flight.rise_m)*kit.flight.rise_m;
 function makeStairs(top,direction,id){
  let chosen;
  // Largest whole-riser flight arrangement whose foot clears all underlying ground.
  for(let risers=1;risers<350;risers++){
   const landings=Math.floor((risers-1)/kit.flight.risers),run=risers*kit.flight.going_m+landings*kit.landing.size_m[0],foot=top-direction*run,base=bridge.y-risers*kit.flight.rise_m;
   const maxGround=Math.max(...[-fullWidth/2,0,fullWidth/2].map(dz=>ground(foot,z+dz)));
   if(base>=maxGround+.03&&base-maxGround<1)chosen={risers,landings,run,foot,base};
  }
  if(!chosen)throw Error(`${id}: no whole-riser landing fit`);
  let x=chosen.foot,y=chosen.base,remaining=chosen.risers,n=0;
  while(remaining){const count=Math.min(kit.flight.risers,remaining),run=count*kit.flight.going_m;
   modules.push({id:`${id}-F${++n}`,kind:'flight',family:count===kit.flight.risers?kit.flight.id:`K09-FLIGHT-${count}-END`,risers:count,going:kit.flight.going_m,rise:kit.flight.rise_m,x,z,y,direction,run,width:fullWidth,clear_width:clearWidth});
   x+=direction*run;y+=count*kit.flight.rise_m;remaining-=count;
   if(remaining){const run=kit.landing.size_m[0];modules.push({id:`${id}-L${n}`,kind:'landing',family:kit.landing.id,x,z,y,direction,run,width:fullWidth,clear_width:clearWidth});x+=direction*run;}
  }
  return {...chosen,top,direction,id};
 }
 const west=makeStairs(bridge.xmin,1,'WEST'),east=makeStairs(bridge.xmax,-1,'EAST');
 const forestLocal=[[0,7],[0,10],[-45,20],[-15,55],[45,45],[60,10],[78,13]];
 const forestPoints=forestLocal.map(([x,z])=>[cottage.x_m+x,cottage.z_m+z]);
 const forestRoad=[...forestPoints,[-3700,-550],[-3350,-650],[west.foot,-650]];
 const departure={xmin:cottage.x_m-1.6,xmax:cottage.x_m+1.6,zmin:cottage.z_m+5.4,zmax:cottage.z_m+8.6,y:ground(cottage.x_m,cottage.z_m+7)+.05,id:'FC05-ENTRY-APRON'};
 const arrival={xmin:gate.x-3,xmax:gate.x+4,zmin:z-2,zmax:z+2,y:gate.y,id:'VILLAGE-ARRIVAL'};
 const eastRoad=[[east.foot,z],[gate.x-3,z]];
 const oldRamp=access.plans.find(p=>p.id==='FT02-C1');
 // Leave the optional ramp before its old dead-end approach, then turn toward the gate.
 const cutX=-2510,cutIndex=oldRamp.profiles.findIndex(p=>p.x>=cutX),a=oldRamp.profiles[cutIndex-1],b=oldRamp.profiles[cutIndex],cutY=mix(a.y,b.y,(cutX-a.x)/(b.x-a.x)),rampProfiles=[...oldRamp.profiles.slice(0,cutIndex).map(p=>({...p})),{x:cutX,z:-460,y:cutY}];
 const rampTurn={xmin:cutX-1.6,xmax:cutX+1.6,zmin:-461.6,zmax:-458.4,y:cutY,id:'RAMP-TURN-LANDING'};
 for(const p of rampProfiles){const left=cutX-p.x;if(left<10)p.y=mix(cutY,p.y,smooth(2,10,left));}
 function path(id,points,startY=null,endY=null){const ps=resample(points,.5);let s=0;return {id,points,profiles:ps.map(([x,z],i)=>{
  if(i)s+=distance(ps[i-1],ps[i]);let y=ground(x,z)+.05;
  if(id==='FOREST-ROAD'||id==='RAMP-FOREST-JOIN')y=mix(departure.y,y,smooth(2,10,s));
  if(startY!==null)y=mix(startY,y,smooth(2,10,s));
  const left=length(points)-s;if(endY!==null)y=mix(endY,y,smooth(2,10,left));
  return{x,z,y,s};}),width:3.2,clear_width:2.8};}
 const paths=[path('FOREST-ROAD',forestRoad,null,west.base),path('VILLAGE-ROAD',eastRoad,east.base,gate.y)];
 const rampPaths=[path('RAMP-FOREST-JOIN',[...forestPoints,[-3700,-550],[-3350,-650],[oldRamp.profiles[0].x,oldRamp.profiles[0].z]],null,oldRamp.profiles[0].y),
 {id:'EXISTING-RAMP-OPTION',points:rampProfiles.map(p=>[p.x,p.z]),profiles:rampProfiles,width:3.2,clear_width:2.8},
 path('RAMP-VILLAGE-JOIN',[[cutX,-460],[cutX,-650],[gate.x-3,z]],cutY,gate.y)];
 const stairWaypoints=[...forestRoad,[bridge.xmin,z],[bridge.xmax,z],[east.foot,z],[gate.x-3,z],[gate.x+2,z]];
 const rampWaypoints=[...rampPaths.flatMap(p=>p.points),[gate.x+2,z]].filter((p,i,ps)=>!i||distance(p,ps[i-1])>1e-7);
 const matches=(m,x,z,margin=0)=>Math.abs(z-m.z)<=m.width/2-margin&&Math.min(m.x,m.x+m.direction*m.run)-1e-8<=x&&x<=Math.max(m.x,m.x+m.direction*m.run)+1e-8;
 function prepare(p){p.pointS=[0];p.profileS=[0];for(let i=1;i<p.points.length;i++)p.pointS.push(p.pointS.at(-1)+distance(p.points[i-1],p.points[i]));for(let i=1;i<p.profiles.length;i++)p.profileS.push(p.profileS.at(-1)+distance([p.profiles[i-1].x,p.profiles[i-1].z],[p.profiles[i].x,p.profiles[i].z]));p.bounds={xmin:Math.min(...p.points.map(q=>q[0]))-2,xmax:Math.max(...p.points.map(q=>q[0]))+2,zmin:Math.min(...p.points.map(q=>q[1]))-2,zmax:Math.max(...p.points.map(q=>q[1]))+2};}
 // Remove collinear profile points only; exact corner-adjacent vertices remain.
 const rp=rampPaths[1];rp.points=rp.points.filter((p,i,ps)=>{if(!i||i===ps.length-1)return true;const a=ps[i-1],b=ps[i+1];return Math.abs((p[0]-a[0])*(b[1]-p[1])-(p[1]-a[1])*(b[0]-p[0]))>1e-7;});
 for(const p of [...paths,...rampPaths])prepare(p);
 function pathSurface(p,x,z){const b=p.bounds;if(x<b.xmin||x>b.xmax||z<b.zmin||z>b.zmax)return null;const n=nearLine([x,z],p.points);if(n.d>p.width/2)return null;
  const first=p.points[0],next=p.points[1],last=p.points.at(-1),before=p.points.at(-2);
  if(n.index===0&&n.t===0&&(x-first[0])*(next[0]-first[0])+(z-first[1])*(next[1]-first[1]) < -1e-7)return null;
  if(n.index===p.points.length-2&&n.t===1&&(x-last[0])*(last[0]-before[0])+(z-last[1])*(last[1]-before[1]) > 1e-7)return null;
  const s=mix(p.pointS[n.index],p.pointS[n.index+1],n.t),ss=p.profileS;let lo=0,hi=ss.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(ss[mid]<=s)lo=mid;else hi=mid;}const t=Math.max(0,Math.min(1,(s-ss[lo])/(ss[hi]-ss[lo])));
  return {id:p.id,y:mix(p.profiles[lo].y,p.profiles[hi].y,t),clear_width:p.clear_width,d:n.d};
 }
 function surface(mode,x,z){const found=[];if(x>=departure.xmin&&x<=departure.xmax&&z>=departure.zmin&&z<=departure.zmax)found.push({id:departure.id,y:departure.y,d:0,clear_width:3.2});
  if(x>=arrival.xmin&&x<=arrival.xmax&&z>=arrival.zmin&&z<=arrival.zmax)found.push({id:arrival.id,y:arrival.y,d:Math.abs(z+650),clear_width:3.6});
  if(mode==='ramp'&&x>=rampTurn.xmin&&x<=rampTurn.xmax&&z>=rampTurn.zmin&&z<=rampTurn.zmax)found.push({id:rampTurn.id,y:rampTurn.y,d:0,clear_width:3.2});
  if(mode==='stairs'){
   if(x>=bridge.xmin&&x<=bridge.xmax&&z>=bridge.zmin&&z<=bridge.zmax)found.push({id:bridge.id,y:bridge.y,d:Math.abs(z+650),clear_width:2.8});
   for(const m of modules)if(matches(m,x,z)){const along=(x-m.x)*m.direction,step=Math.min(m.risers||0,Math.max(1,Math.floor((along+1e-8)/kit.flight.going_m)+1));found.push({id:m.id,y:m.kind==='flight'?m.y+step*kit.flight.rise_m:m.y,d:Math.abs(z-m.z),clear_width:m.clear_width});}
  }
  for(const p of mode==='stairs'?paths:rampPaths){const q=pathSurface(p,x,z);if(q)found.push(q);}
  // Coplanar joins use the interior surface rather than treating another strip's edge as a guard.
  return found.sort((a,b)=>Math.abs(a.y-b.y)<1e-6?a.d-b.d:b.y-a.y)[0]||null;
 }
 function canStand(mode,x,z,height=kit.player.height_m){const floor=surface(mode,x,z);if(!floor||floor.d>floor.clear_width/2-body+1e-7)return false;
  // Circle containment tests outside of the guard envelope prevent corner/endpoint escape.
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;if(!surface(mode,x+body*Math.cos(a),z+body*Math.sin(a)))return false;}
  const p=local([x,z]);if(Math.hypot(...p)<75&&(geo.habitats.blocked(...p,body)||geo.forest.water(...p)&&!geo.forest.bridgeContains(...p)))return false;
  if(Math.abs(x-gate.x)<gate.depth/2+body&&Math.abs(z-gate.z)<kit.opening.wall_width_m/2+body&&Math.abs(z-gate.z)>gate.width/2-body+1e-8)return false;
  if(Math.abs(x-gate.x)<gate.depth/2+body&&Math.abs(z-gate.z)<kit.opening.wall_width_m/2+body){const u=Math.abs(z-gate.z)+body,headroom=gate.apex-u*(gate.apex-gate.clear_height)/(gate.width/2);if(floor.y+height>gate.y+headroom)return false;}
  return true;
 }
 function move(mode,state,dx,dz){const count=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06));let travelled=0;for(let i=0;i<count;i++){
  const x=state.x+dx/count,z=state.z+dz/count,a=surface(mode,state.x,state.z),b=surface(mode,x,z);
  if(a&&b&&canStand(mode,x,z)&&Math.abs(a.y-b.y)<=kit.player.max_step_m+1e-7){travelled+=Math.hypot(x-state.x,z-state.z);state.x=x;state.z=z;}
 }return travelled;}
 const start={x:forestPoints[0][0],z:forestPoints[0][1]},end={x:gate.x+2,z:gate.z};
 return {id:'WEST-STAIR-001',kit,bridge,west,east,modules,paths,rampPaths,rampTurn,arrival,departure,gate,start,end,ground,surface,canStand,move,waypoints:{stairs:stairWaypoints,ramp:rampWaypoints},lengths:{stairs:length(stairWaypoints),ramp:length(rampWaypoints)},crossing_waypoints:[[west.foot-6,z],[bridge.xmin,z],[bridge.xmax,z],[east.foot+6,z]],limits:['Proposed B12 west gate is a reservation-boundary port; individual village doors/streets remain unresolved.','Confined route surface and bank landing geometry; supports, final architecture and full-world navigation remain pending.','Terminal flights use explicit partial-riser hosts; full K09 flights keep their 10 risers and are never stretched.']};
}
