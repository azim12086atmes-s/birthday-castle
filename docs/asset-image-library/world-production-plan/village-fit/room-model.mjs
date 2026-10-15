// A usable sitting-room Function specimen; source art/model registration remains separate.
export function createCottageRoom(base,details,options={}){
 const inheritedCanStand=details.canStand,house=base.houses.find(h=>h.id===(options.house_id||'H-N-18'));
 const items=[
  {id:'ROOM-BENCH',kind:'bench',reference_id:'B12-COURT-PROP-001-D05',position:[18.425,0,-12.6],rotation:Math.PI/2,dimensions:[1.4,.55,.85],attachment:'Feet on floor; back towards west wall',front:'East, toward conversation table',solid:true},
  {id:'ROOM-TABLE-P01',kind:'table',reference_id:null,position:[20.4,0,-12.6],rotation:0,dimensions:[1,.65,.72],attachment:'Four feet on floor',front:'North/south edges accessible',solid:true,proposal:'New plain cottage table fit specimen; indoor table design is a verified reference gap'},
  {id:'ROOM-CRATE',kind:'crate',reference_id:'B12-COURT-PROP-001-D09',position:[23.45,0,-14.4],rotation:0,dimensions:[.5,.4,.35],attachment:'Underside on floor',front:'Open top upward',solid:true},
  {id:'ROOM-BASKET',kind:'basket',reference_id:'B12-COURT-PROP-001-D03',position:[23.4,0,-7.1],rotation:0,dimensions:[.45,.35,.3],attachment:'Underside on floor',front:'Open top upward',solid:true},
  {id:'ROOM-MAT',kind:'mat',reference_id:'B12-COURT-PROP-001-D12',position:[19.5,0,-6.9],rotation:0,dimensions:[.8,.5,.02],attachment:'Broad underside flat on floor',front:'Pattern upward',walkable:true},
  {id:'ROOM-WATERING-POT',kind:'watering-pot',reference_id:'B12-COURT-PROP-001-D07',position:[20.4,.72,-12.6],rotation:0,dimensions:[.4,.2,.3],attachment:'Base on table top Y=0.72',front:'Spout east'},
  {id:'ROOM-CHIME',kind:'chime',reference_id:'B12-COURT-PROP-001-D06',position:[21,1.9,-7.5],rotation:0,dimensions:[.15,.15,.45],attachment:'Visible 0.10 m hanger to ceiling underside Y=2.45',front:'Suspended body downward',interaction:'Ring with E within 1.8 m'},
  ...[18.15,23.85].map((x,i)=>({id:'ROOM-LAMP-P01-'+i,kind:'lamp',reference_id:null,position:[x,1.95,i?-13.5:-10.1],rotation:i?-Math.PI/2:Math.PI/2,dimensions:[.18,.18,.3],attachment:'Flat rear plate on interior wall face',front:'Into room',proposal:'Functional test lamp, final cottage fixture design pending'}))
 ];
 for(const item of items)if(options.placements?.[item.id])Object.assign(item,options.placements[item.id]);
 const ceiling=base.floors.find(f=>f.id===house.id+'-CEILING'),clearHeight=ceiling.y-ceiling.thickness;
 let rings=0,lastRingAt=-Infinity;
 const mat=items.find(i=>i.kind==='mat');
 function inBox(p,x,z,pad=0){const dx=x-p.position[0],dz=z-p.position[2],c=Math.cos(p.rotation),s=Math.sin(p.rotation),u=c*dx-s*dz,v=s*dx+c*dz;return Math.abs(u)<=p.dimensions[0]/2+pad&&Math.abs(v)<=p.dimensions[1]/2+pad;}
 function surface(x,z){return inBox(mat,x,z)?mat.dimensions[2]:base.surface(x,z);}
 function canStand(x,z,r=base.contract.body_radius,height=base.contract.body_height){const floor=surface(x,z);if(floor===null||!inheritedCanStand(x,z,r,height+floor))return false;
  for(const p of items.filter(i=>i.solid)){const dx=x-p.position[0],dz=z-p.position[2],c=Math.cos(p.rotation),s=Math.sin(p.rotation),u=c*dx-s*dz,v=s*dx+c*dz;if(Math.hypot(Math.max(Math.abs(u)-p.dimensions[0]/2,0),Math.max(Math.abs(v)-p.dimensions[1]/2,0))<r-1e-8)return false;}
  return true;
 }
 function move(p,dx,dz){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.04));let distance=0;for(let i=0;i<n;i++){const x=p.x+dx/n,z=p.z+dz/n;if(canStand(x,z)&&Math.abs(surface(x,z)-surface(p.x,p.z))<=base.contract.max_step){distance+=Math.hypot(x-p.x,z-p.z);p.x=x;p.z=z;}}return distance;}
 function interact(player,now=Date.now()){
  const chime=items.find(i=>i.kind==='chime');if(Math.hypot(player.x-chime.position[0],player.z-chime.position[2])>1.8)return{ok:false,reason:'Move closer to the wind chime inside the doorway.'};
  if(!canStand(player.x,player.z))return{ok:false,reason:'Interaction position is obstructed.'};
  if(now-lastRingAt<800)return{ok:false,reason:'The chime is still ringing.'};rings++;lastRingAt=now;return{ok:true,kind:'wind-chime',rings,tones_hz:[523.25,659.25,783.99],source_id:chime.reference_id};
 }
 const route=options.route||[[14,0],[19.5,0],[19.5,-9],[21,-8.8],[19.25,-10.8],[19.25,-12.6],[19.25,-10.8],[22,-11],[22,-13.7],[22,-11],[19.5,-9],[19.5,0],[14,0]];
 return {id:options.id||'B12-COTTAGE-ROOM-FUNCTION-001',house,items,ceiling,clearHeight,canStand,move,surface,interact,route,get rings(){return rings;},
  lights:items.filter(i=>i.kind==='lamp').map((i,n)=>({id:n?'COTTAGE-LIGHT-E':'COTTAGE-LIGHT-W',position:[i.position[0]+Math.sin(i.rotation)*.105,i.position[1]+.145,i.position[2]+Math.cos(i.rotation)*.105],colour:n?'#ffe2b9':'#ffdbab',intensity:.12,distance:5.5,fixture:i.id})),
  exceptions:options.exceptions||['This is a village sitting-room prototype, not FC05 or the palace bedroom and not a finished location.',
   'Six saved cottage object designs are reused; the table and two lamp instances are explicitly proposed Function fixtures, not accepted new assets.',
   'The saved palace canopy bed is 2.8 m tall and is excluded from this 2.45 m room; cottage sleeping furniture remains a design gap.',
   'The 20 mm mat is a walkable step; collision and camera use its raised surface. Furniture and glass remain colliders when hidden.',
   'The chime is suspended with its lowest point at 1.90 m, outside the 1.75 m player head envelope. All source carvings, textiles and final materials remain pending.']};
}
