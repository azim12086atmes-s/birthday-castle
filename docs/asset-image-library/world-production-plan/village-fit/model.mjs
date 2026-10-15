// Local X east / Z south / Y up. Origin is the proposed B12 west gate.
export const contract={bay_width:3,storey:2.6,wall_depth:.3,house_width:6,house_depth:9,roof_rise:2.8,roof_repeat:3,roof_depth:.15,body_radius:.45,body_height:1.75,eye_height:1.6,max_step:.2};
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function archTop(o,u){const v=Math.abs(u-o.centre);if(v>o.width/2+1e-8)return -Infinity;return o.sill+o.height-o.arch_rise+o.arch_rise*Math.sqrt(Math.max(0,1-(v/(o.width/2))**2));}
export function archPolygon(o,n=32){const ps=[[o.centre-o.width/2,o.sill],[o.centre+o.width/2,o.sill]];for(let i=0;i<=n;i++){const a=i/n*Math.PI;ps.push([o.centre+o.width/2*Math.cos(a),o.sill+o.height-o.arch_rise+o.arch_rise*Math.sin(a)]);}return ps;}
export function createVillage(source,geo){
 const site=source.landmarks.find(s=>s.id==='B12'),origin={x:site.x_m-site.width_m/2,z:site.z_m,y:geo.pads.find(p=>p.id==='B12').level+.05},walls=[],houses=[],roofs=[],gables=[],openings=[],floors=[],modules=[],joints=[];
 function wall(id,axis,at,start,end,base,height,holes=[]){const w={id,axis,at,start,end,base,height,depth:contract.wall_depth,opening_ids:[]};for(const h of holes){const o={...h,id:`${id}-${h.kind}`,wall_id:id,axis,at,depth:w.depth,centre:start+1.5,base,threshold:0,...h};o.face_sign=axis==='x'?(id.includes('BACK')?Math.sign(at):-Math.sign(at)):(id==='LANE-ARCH-48'?1:-1);w.opening_ids.push(o.id);openings.push(o);}walls.push(w);modules.push({id,family:id==='WEST-GATE'?'B12-WEST-GATE-PORT-P01':id.startsWith('LANE-ARCH-')?'B12-LANE-ARCH-WALL-P01':end-start===6&&base===2.6?'B12-STRUCT-001-S03 / rectangular upper part':holes.length?holes[0].kind==='window'?'B12-STRUCT-001-S01':holes[0].width===1?'B12-STRUCT-001-S02':'B12-WIDE-ENTRY-P01':'B12-WALL-BLANK-P01',axis,at,start,end,base,height});return w;}
 function facade(id,z,x,base,kind,dest){const h=kind==='window'?{kind,width:1.2,sill:base+.8,height:1.4,arch_rise:.6,traversable:false,destination:dest}:kind==='door'?{kind,width:1,sill:base,height:2.1,arch_rise:.5,traversable:true,destination:dest,exception:'Secondary cottage doorway follows the 1 m source; human fit is narrow. Not the primary village arrival.'}:{kind:'door',width:2.4,sill:base,height:2.25,arch_rise:.15,traversable:true,destination:dest,exception:'Proposed public entry adaptation; 3 m wall bay and 2.6 m storey unchanged.'};return wall(id,'x',z,x,x+3,base,2.6,[h]);}
 // Two attached rows, with one separated return at the source-inspired covered passage.
 for(const side of[-1,1])for(const x of[18,24,30,42]){
  const id=`H-${side<0?'N':'S'}-${x}`,zfront=side*6,zback=side*15,zmin=Math.min(zfront,zback),zmax=Math.max(zfront,zback),h={id,xmin:x,xmax:x+6,zmin,zmax,front:zfront,side,public:side===1&&x===18};houses.push(h);
  floors.push({...h,id:`${id}-FLOOR`,y:0,thickness:.15});
  facade(`${id}-ENTRY`,zfront,x,0,h.public?'wide':'door',`${id} ground room`);
  facade(`${id}-WIN`,zfront,x+3,0,'window',`${id} ground room / lane`);
  if(x!==42)wall(`${id}-UPPER-GABLE`, 'x',zfront,x,x+6,2.6,2.6,[{kind:'window',centre:x+3,width:1.2,sill:3.4,height:1.4,arch_rise:.6,traversable:false,destination:`${id} non-playable upper shell / lane`}]);
  for(let b=0;b<2;b++)facade(`${id}-BACK-0-${b}`,zback,x+3*b,0,'window',`${id} room / exterior`);
  wall(`${id}-BACK-UPPER-GABLE`,'x',zback,x,x+6,2.6,2.6,[{kind:'window',centre:x+3,width:1.2,sill:3.4,height:1.4,arch_rise:.6,traversable:false,destination:`${id} upper shell / exterior`}]);
  // Shared party walls are authored once, with the solid wall variant at every storey.
  for(const xx of[x,x+6])for(const base of[0,2.6])for(let part=0;part<3;part++){const start=zmin+part*3,end=start+3;if(!walls.some(w=>w.axis==='z'&&w.at===xx&&w.start===start&&w.end===end&&w.base===base))wall(`${id}-SIDE-${xx}-${base}-${part}`,'z',xx,start,end,base,2.6);}
  floors.push({...h,id:`${id}-CEILING`,y:2.6,underside_y:2.45,thickness:.15,ceiling:true});
  for(let i=0;i<3;i++)roofs.push({id:`${id}-ROOF-${i}`,family:'B12-STRUCT-001-S04',x,z:zmin+i*3,length:3,span:6,eave:5.2,rise:2.8,thickness:.15,open_ends:true});
  for(const zz of[zmin,zmax].filter(zz=>x!==42||Math.abs(zz)!==6))gables.push({id:`${id}-GABLE-${zz}`,family:'B12-STRUCT-001-S03 / triangular end only',x,z:zz,span:6,base:5.2,rise:2.8,depth:.3});
 }
 // A covered street connection: real holes in both end walls, open at street level.
 for(const x of[42,48])wall(`LANE-ARCH-${x}`,'z',x,-6,6,0,5.2,[{kind:'door',centre:0,width:4.8,sill:0,height:4.1,arch_rise:.9,traversable:true,destination:x===42?'Covered lane to arrival court':'Arrival court and return lane',exception:'Proposed village connector geometry; 4.8 m lane aperture.'}]);
 // A separate 6 m roof span repeated along the connection; no end infill in intermediate repeats.
 for(let i=0;i<4;i++)roofs.push({id:`ARCH-ROOF-${i}`,family:'B12-STRUCT-001-S04',x:42,z:-6+i*3,length:3,span:6,eave:5.2,rise:2.8,thickness:.15,open_ends:true});
 for(const side of[-1,1])for(const x of[24,30])joints.push({id:`VALLEY-${side}-${x}`,family:'B12-VALLEY-HOST-P01',x,zmin:side<0?-15:6,zmax:side<0?-6:15,y:5.2,width:.24,depth:.12});
 const gate=wall('WEST-GATE','z',0,-2,2,0,4.2,[{kind:'door',centre:0,width:2.4,sill:0,height:3.8,arch_rise:.6,traversable:true,destination:'Village arrival lane',exception:'Primary arrival inherited from the west route; 2.4 m full width, spring 3.2 m.'}]);
 const bounds={xmin:-4,xmax:102,zmin:-22,zmax:22};
 const point=(w,u,v)=>w.axis==='x'?{x:u,y:v,z:w.at}:{x:w.at,y:v,z:u};
 function insideOpening(o,u,y,margin=0){return Math.abs(u-o.centre)<=o.width/2-margin+1e-8&&y>=o.sill-1e-8&&y<=archTop(o,u)-margin+1e-8;}
 function surface(x,z){if(x<bounds.xmin||x>bounds.xmax||z<bounds.zmin||z>bounds.zmax)return null;return 0;}
 function canStand(x,z,r=contract.body_radius,height=contract.body_height){if(x<bounds.xmin+r||x>bounds.xmax-r||z<bounds.zmin+r||z>bounds.zmax-r)return false;
  for(const w of walls){const across=w.axis==='x'?z:x,u=w.axis==='x'?x:z;if(Math.abs(across-w.at)>w.depth/2+r||u+r<w.start||u-r>w.end||height<=w.base||w.base+w.height<0)continue;
   const os=openings.filter(o=>o.wall_id===w.id&&o.traversable);
   if(!os.some(o=>u-r>=o.centre-o.width/2-1e-8&&u+r<=o.centre+o.width/2+1e-8&&o.sill<=.001&&Math.min(archTop(o,u-r),archTop(o,u+r))>=height-1e-8))return false;
  }
  for(const g of gables)if(Math.abs(z-g.z)<g.depth/2+r&&x+r>g.x&&x-r<g.x+g.span&&height>g.base)return false;
  if(houses.some(h=>x>h.xmin-r&&x<h.xmax+r&&z>h.zmin-r&&z<h.zmax+r)&&height>2.45+1e-8)return false;
  return true;
 }
 function move(state,dx,dz){const n=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06));let travelled=0;for(let i=0;i<n;i++){const x=state.x+dx/n,z=state.z+dz/n;if(canStand(x,z)){travelled+=Math.hypot(x-state.x,z-state.z);state.x=x;state.z=z;}}return travelled;}
 const arrival=[[-2,0],[14,0],[38,0],[45,0],[58,0],[80,0],[88,8],[78,12],[66,8],[58,0],[38,0],[14,0],[-2,0]];
 const publicRoom=[[14,0],[19.5,0],[19.5,8.5],[22,11],[19.5,8.5],[19.5,0],[14,0]];
 const cottageRoom=[[14,0],[19.5,0],[19.5,-9],[22,-11],[19.5,-9],[19.5,0],[14,0]];
 return {id:'B12-VILLAGE-FIT-001',contract,origin,site,bounds,houses,walls,roofs,gables,openings,floors,joints,modules,gate,point,insideOpening,surface,canStand,move,routes:{arrival,publicRoom,cottageRoom},start:{x:-2,z:0},viewTargets:{arrival:[6,3,0],arch:[45,3,0],publicRoom:[21,1.4,10],roof:[27,6.2,-10],court:[80,2,0]}};
}
