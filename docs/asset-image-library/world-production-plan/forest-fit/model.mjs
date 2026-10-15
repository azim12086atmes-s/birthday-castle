import {contract,archTop} from '../village-fit/model.mjs';
import {createCottageRoom} from '../village-fit/room-model.mjs';
import {length,resample} from '../blockout/geography.mjs';

// Separate Function fixture. Canonical geography and deterministic placements are never edited.
export function createForestCottage(source,proposal,geo){
 const f=proposal.forest_sample,site=geo.forest.origin,floorWorld=geo.forest.datum+f.cottage.floor_relative_m;
 const walls=[],openings=[],roofs=[],gables=[],house={id:'FC05',xmin:-6,xmax:6,zmin:-4.5,zmax:4.5};
 function wall(id,axis,at,start,end,base=0,height=2.6,hole=null){
  const w={id,axis,at,start,end,base,height,depth:.3,opening_ids:[]};
  if(hole){const o={id:id+'-OPEN',wall_id:id,axis,at,centre:(start+end)/2,depth:.3,face_sign:Math.sign(at),threshold:0,...hole};openings.push(o);w.opening_ids.push(o.id);}
  walls.push(w);
 }
 // Four front/rear bays; paired centre front bays share one generous primary aperture.
 for(const at of [-4.5,4.5])for(const [a,b] of (at>0?[[-6,-3],[-3,3],[3,6]]:[[-6,-3],[-3,0],[0,3],[3,6]])){
  const door=at>0&&a===-3;
  wall(`FC05-${at>0?'S':'N'}-${a}`,'x',Math.sign(at)*4.35,a,b,0,2.6,door?
   {kind:'door',width:2.4,height:2.25,sill:0,arch_rise:.15,traversable:true,destination:'FC05 ground sitting room / clearing apron',reference_id:null,proposal:'Wide entry adaptation; fixed arched fanlight leaves 2.10 m through headroom'}:
   {kind:'window',width:1.2,height:1.4,sill:.8,arch_rise:.6,traversable:false,destination:'Ground room / forest',reference_id:'B12-STRUCT-001-S01'});
 }
 for(const x of [-6,6])for(let z=-4.5;z<4.5;z+=3)wall(`FC05-SIDE-${x}-${z}`,'z',Math.sign(x)*5.85,z,z+3,0,2.6,z===-1.5?
  {kind:'window',width:1.2,height:1.4,sill:.8,arch_rise:.6,traversable:false,destination:'Ground room / forest',reference_id:'B12-STRUCT-001-S01'}:null);
 for(const at of [-4.5,4.5])for(const x of [-6,0]){
  wall(`FC05-UPPER-${at}-${x}`,'x',Math.sign(at)*4.35,x,x+6,2.6,2.6,{kind:'window',width:1.2,height:1.4,sill:3.4,arch_rise:.6,traversable:false,destination:'Non-playable loft / exterior',reference_id:'B12-STRUCT-001-S03'});
  gables.push({id:`GABLE-${at}-${x}`,x,z:Math.sign(at)*4.35,base:5.05,rise:2.8,span:6,depth:.3});
 }
 for(const x of [-6,6])wall(`UPPER-SIDE-${x}`,'z',Math.sign(x)*5.85,-4.5,4.5,2.6,2.6);
 for(const x of [-6,0])for(let n=0;n<3;n++)roofs.push({id:`ROOF-${x}-${n}`,x,z:-4.5+3*n,length:3,span:6,eave:5.2,rise:2.8,thickness:.15,reference_id:'B12-STRUCT-001-S04'});
 const floors=[{...house,id:'FC05-FLOOR',y:0,thickness:.15},{...house,id:'FC05-CEILING',y:2.6,underside_y:2.45,thickness:.15,ceiling:true}];
 let doorOpen=true;
 function leaves(angle=doorOpen?110:0){return[-1,1].map(sign=>({id:`ENTRY-LEAF-${sign}`,hinge:[sign*1.2,4.20],angle:sign*angle*Math.PI/180,sign,width:1.2,depth:.08,height:2.1}));}
 function doorBlocks(x,z,r=.45,angle=doorOpen?110:0){return leaves(angle).some(l=>{
  const dx=x-l.hinge[0],dz=z-l.hinge[1],c=Math.cos(l.angle),s=Math.sin(l.angle),u=dx*c-dz*s,v=dx*s+dz*c;
  return Math.hypot(Math.max(0,Math.abs(u+l.sign*.6)-.6),Math.max(0,Math.abs(v)-.04))<r-1e-8;
 });}
 function setDoor(open,player){
  if(player&&open!==doorOpen)for(let a=0;a<=110;a+=2)if(doorBlocks(player.x,player.z,contract.body_radius,a))return{ok:false,reason:'Step clear of both door swing arcs.'};
  doorOpen=open;return{ok:true,open};
 }
 const surface=(x,z)=>Math.abs(x)<6&&Math.abs(z)<4.5?0:geo.forest.floor(x,z)-floorWorld;
 function shellCanStand(x,z,r=.45,top=1.75){
  if(!geo.canWalk('forest',x,z,r))return false;
  for(const w of walls){const across=w.axis==='x'?z:x,u=w.axis==='x'?x:z;
   if(Math.abs(across-w.at)>w.depth/2+r||u+r<w.start||u-r>w.end||top<=w.base)continue;
   if(!w.opening_ids.some(id=>{const o=openings.find(o=>o.id===id);return o.traversable&&u-r>=o.centre-o.width/2&&u+r<=o.centre+o.width/2&&Math.min(archTop(o,u-r),archTop(o,u+r),2.1)>=top;}))return false;
  }
  if(Math.abs(x)<6+r&&Math.abs(z)<4.5+r&&top>2.45+1e-8)return false;
  return !doorBlocks(x,z,r);
 }
 const entry=[[0,7],[0,2],[0,0],[-4.62,0],[-4.62,-1.8],[-4.62,0],[3,0],[3,-2.8],[3,0],[0,0],[0,2],[0,7]];
 const base={contract,houses:[house],floors,surface,canStand:shellCanStand};
 const placements={
  'ROOM-BENCH':{position:[-5.425,0,-1.8]},
  'ROOM-TABLE-P01':{position:[-3.6,0,-1.8]},
  'ROOM-CRATE':{position:[5.45,0,-3.9]},
  'ROOM-BASKET':{position:[5.4,0,2.7]},
  'ROOM-MAT':{position:[0,0,3.6]},
  'ROOM-WATERING-POT':{position:[-3.6,.72,-1.8]},
  'ROOM-CHIME':{position:[0,1.9,2]},
  'ROOM-LAMP-P01-0':{position:[-5.70,1.95,1.6]},
  'ROOM-LAMP-P01-1':{position:[5.70,1.95,-1.8]}
 };
 const room=createCottageRoom(base,{canStand:shellCanStand},{id:'FC05-ROOM-FUNCTION-001',house_id:'FC05',placements,route:entry,exceptions:['FC05 ground sitting-room Function prototype; no finished overnight-cottage claim.','Six saved designs are reused at human dimensions; final table, wall lamp and cottage sleeping references remain pending.']});
 const fullLoop=[[0,7],...f.entry_spur.slice(1),...f.loop.slice(1),...f.entry_spur.slice(1,-1).reverse(),[0,7]];
 // Keep all existing occupancy envelopes. Source-audited trees are visual fit variants,
 // not a change to the source flora dimensions or the canonical habitat scatter.
 const refs={broadleaf:'F02-FLORA-001-A01',birch:'F02-FLORA-001-A02',sapling:null,shrub:'F02-NATURE-001-A09',bluebell:'F02-NATURE-001-A10',strawberry:'F02-NATURE-001-A11',deadwood:'F02-NATURE-001-A01',rock:null,reed:null};
 const vegetation=geo.habitats.objects.map(o=>({...o,y:o.y-floorWorld,reference_id:refs[o.kind],status:refs[o.kind]?'Procedural source-family fit variant; final art pending':'Explicit unaccepted placement specimen; exact source design unresolved'}));
 const routes={room:entry,clearing:fullLoop},auditRoute=ps=>{
  const p={x:ps[0][0],z:ps[0][1]};let travelled=0;
  for(const [x,z]of resample(ps,.15).slice(1)){const want=Math.hypot(x-p.x,z-p.z),got=room.move(p,x-p.x,z-p.z);if(Math.abs(got-want)>1e-6)return{status:'blocked',position:{...p},expected:[x,z],travelled_m:travelled};travelled+=got;}
  return{status:'pass',travelled_m:travelled,length_m:length(ps),position:p};
 };
 return{id:'FC05-FOREST-FIT-001',contract,site,origin:{x:site.x_m,y:floorWorld,z:site.z_m},walls,openings,roofs,gables,floors,house,room,vegetation,routes,auditRoute,canStand:room.canStand,move:room.move,surface:room.surface,leaves,setDoor,get doorOpen(){return doorOpen;},
  loop_length_m:length(f.loop),named_pond_distance_m:Math.hypot(site.x_m+4800,site.z_m+650),
  limits:['Separate Function fixture; no accepted decorative models, Blender composition or main-game integration.',
   'The canonical 2.6 m coarse doorway conflicts with the 2.45 m ceiling. This fixture proposes a 2.25 m arched aperture with fixed fanlight and 2.10 m through clearance; canonical proposal is unchanged.',
   'Two adjacent saved 6 m roof spans preserve the 12 × 9 m reservation and 8 m ridge. Twin-gable arrangement is proposed, not recovered FC05 architecture.',
   'The centre roof valley is a backed inspection host only. Roof drainage/weatherproofing, loft access and final framing remain unresolved.',
   '94 existing placement envelopes are retained. Oak/birch and four nature families receive simplified fit geometry; sapling, rock and reed identity remains unresolved. Not final leaf/bark art, wind, fauna behavior or production ecology.',
   'Compact sleeping furniture remains a reference gap. This is a sitting room, not a finished overnight cottage.',
   'FD02 is a later 806 m destination; the small local test pond is separate. Regional village travel remains on its existing review page.']};
}
