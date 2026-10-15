// Function fit only. Saved W / D / H dimensions are retained; hidden joints are proposed.
export function createDetails(base, components) {
 const substrateCanStand=base.canStand;
 const instances=[], add=(part,id,host,position,rotation=[0,0,0],extra={})=>{
  const source=components.find(c=>c.asset_id.endsWith(part));
  instances.push({id,part,asset_id:source.asset_id,name:source.name,host,position,rotation,
   dimensions:source.dimensions_m_proposed,attachment_face:source.attachment_face,
   semantic_front:source.semantic_front,status:'Procedural fit specimen; carving and final model pending',...extra});
 };
 const windows=['H-N-18-WIN-window','H-N-18-UPPER-GABLE-window','H-S-18-WIN-window','H-N-18-BACK-0-0-window','H-N-18-BACK-0-1-window'];
 for(const id of windows){const o=base.openings.find(o=>o.id===id),rot=o.face_sign<0?Math.PI:0;
  for(const p of ['D03','D04','D06'])add(p,`${id}-${p}`,o.wall_id,[o.centre,o.sill,o.at+o.face_sign*.15],[0,rot,0],{opening_id:id,layer:o.base?'upper':'lower',support:'wall face / reveal',opening:o});
 }
 const door=base.openings.find(o=>o.id==='H-N-18-ENTRY-door');
 add('D05','COTTAGE-DOOR',door.wall_id,[door.centre-.5,0,door.at+.15],[0,0,0],{opening_id:door.id,layer:'lower',support:'Left jamb hinge axis; 110° inward when open',opening:door});
 for(const [i,x] of [18.65,20.35].entries()){
  add('D11',`PORCH-POST-${i}`,'PORCH-BEARING-RAIL-P01',[x,0,-4.65],[0,i?Math.PI:0,0],{layer:'lower',support:'Floor Y=0; top bearing Y=2.4'});
  add('D01',`PORCH-WALL-BRACKET-${i}`,'H-N-18-ENTRY',[x,1.9,-5.85],[0,0,0],{layer:'lower',support:'Flat back on wall; seat under porch rail Y=2.4'});
 }
 const slope=Math.hypot(3,2.8), angle=Math.atan2(2.8,3);
 for(const side of [0,1])for(let i=0;i<3;i++){
  const s=i*1.8,len=Math.min(1.8,slope-s),left=side===0;
  add('D02',`GABLE-TRIM-${side}-${i}`,'H-N-18-GABLE--6',
   [left?18+s*Math.cos(angle):24-s*Math.cos(angle),5.2+s*Math.sin(angle),-5.85],
   [0,0,left?angle:Math.PI-angle],{layer:'upper',length:len,terminal:len<1.8,support:'Terminal gable front face; square-cut repeats, proposed short terminal'});
 }
 for(const side of [0,1])add('D07',`TILE-PATCH-${side}`,'H-N-18-ROOF-1',
  [side?22.8:19.2,5.2+1.2/3*2.8,-10.5],[0,0,side?-angle:angle],
  {layer:'roof',support:'Underside on roof substrate; no second tile/material layer',slope_angle:angle});
 add('D08','RIDGE-FINIAL','H-N-18-ROOF-2',[21,8,-6.5],[0,0,0],{layer:'roof',support:'Flat socket underside at ridge Y=8'});
 for(const [i,z] of [-5.7,-15.3].entries())add('D10',`FOUNDATION-CORNER-${i}`,`H-N-18-SIDE-18-0-${i?0:2}`,[17.7,0,z],[0,i?-Math.PI/2:0,0],{layer:'lower',support:'L section hugs the two exterior faces; underside Y=0'});
 add('D12','CROWN-SIGN','H-N-18-ENTRY',[20.7,2.1,-5.85],[0,0,0],{layer:'lower',support:'Wall plate, arm and ring; lowest point 2.1 m above lane',dimensional_axes:'The 0.65 m source side-profile width projects outward from the wall; 0.15 m is the thickness along the wall.'});
 const unmounted=[{part:'D09',asset_id:components.find(c=>c.asset_id.endsWith('D09')).asset_id,name:'Chimney pot',reason:'Hollow pot has no shaft or scheduled roof/flue penetration. Inspect separately; do not place on an uncut roof.'}];
 let doorOpen=true,shuttersOpen=true;
 // These collision primitives match the physical fitting envelopes, independent of visibility.
 function hitBox(x,z,r,cx,cz,hx,hz,angle=0){const dx=x-cx,dz=z-cz,c=Math.cos(angle),s=Math.sin(angle),u=c*dx-s*dz,v=s*dx+c*dz;return Math.hypot(Math.max(Math.abs(u)-hx,0),Math.max(Math.abs(v)-hz,0))<r-1e-8;}
 function canStand(x,z,r=base.contract.body_radius,h=base.contract.body_height){
  if(!substrateCanStand(x,z,r,h))return false;
  const a=doorOpen?110*Math.PI/180:0,cx=19+.5*Math.cos(a),cz=-5.85-.5*Math.sin(a);
  if(hitBox(x,z,r,cx,cz,.5,.05,a))return false;
  for(const p of instances){if(p.part==='D11'&&hitBox(x,z,r,p.position[0],p.position[2],.225,.225))return false;
   if(p.part==='D06'&&p.position[1]-.35<h&&hitBox(x,z,r,p.position[0],p.position[2]+p.opening.face_sign*.175,.65,.175))return false;
   if(p.part==='D04'&&p.position[1]<h)for(const side of [-1,1]){
    const a=shuttersOpen?side*170*Math.PI/180:0,rotation=p.rotation[1],c=Math.cos(rotation),s=Math.sin(rotation),lx=side*.6-side*.3*Math.cos(a),lz=.07+side*.3*Math.sin(a);
    if(hitBox(x,z,r,p.position[0]+c*lx+s*lz,p.position[2]-s*lx+c*lz,.3,.04,a+rotation))return false;
   }
   if(p.part==='D10'){
    const a=p.rotation[1],c=Math.cos(a),s=Math.sin(a);for(const [lx,lz,hx,hz] of [[.25,-.075,.25,.075],[.075,-.25,.075,.25]])
     if(hitBox(x,z,r,p.position[0]+c*lx+s*lz,p.position[2]-s*lx+c*lz,hx,hz,a))return false;
   }
   if(p.part==='D12'&&h>2.1&&hitBox(x,z,r,p.position[0],p.position[2]+.325,.075,.325))return false;
  }
  if(h>2.4&&hitBox(x,z,r,19.5,-5.1375,1.075,.7125))return false;
  return true;
 }
 function move(state,dx,dz){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.04));let distance=0;for(let i=0;i<n;i++){const x=state.x+dx/n,z=state.z+dz/n;if(canStand(x,z)){distance+=Math.hypot(x-state.x,z-state.z);state.x=x;state.z=z;}}return distance;}
 function setDoor(open,player){if(open===doorOpen)return true;
  // Reserve the whole swept leaf region before changing state, not only its final pose.
  if(player)for(let i=0;i<=55;i++){
   const a=i*2*Math.PI/180;
   if(hitBox(player.x,player.z,base.contract.body_radius+.002,19+.5*Math.cos(a),-5.85-.5*Math.sin(a),.5,.05,a))return false;
  }
  doorOpen=open;return true;
 }
 return {instances,unmounted,components,windows,slope,angle,canStand,move,setDoor,
  get doorOpen(){return doorOpen;},get shuttersOpen(){return shuttersOpen;},
  setShutters(open){shuttersOpen=open;},
  exceptions:['D02 retains 1.8 m stock lengths plus a proposed short terminal; no stretch.',
   'D09 remains unmounted until a chimney shaft and weathered flue opening exist.',
   'Porch bearing rails and shallow canopy are proposed support geometry, not a new accepted design.',
   'D04 leaves are split from the shared round arch; independent full-round leaves in the sheet would not close together.',
   'Only five sample windows and one source doorway are fitted; public entry is not a stretched D05.',
   'Clay fitting envelopes establish joins and pivots; final carving, texture, seals, fasteners and drainage remain pending.']};
}
