import {THREE,wallGeometry,roofGeometry,gableGeometry,openingGeometry,frameGeometry} from '../village-fit/geometry.mjs';
import {buildCottageRoom} from '../village-fit/room-geometry.mjs';
import {resample,nearLine} from '../blockout/geography.mjs';
export {THREE};
export function buildForestFixture(model,geo,proposal){
 const root=new THREE.Group(),groups={},materials=new Map(),objects=new Map(),batches=new Map();
 const colors={cream:'#dfd0ad',wood:'#76523a',blue:'#5269a0',gold:'#c6a052',mat:'#8b704b',glow:'#ffe3ad',roof:'#5265a0',bark:'#695640',birch:'#d6d3bf',leaf:'#527245',leaf2:'#72905a',rock:'#858477',flower:'#7072bc',berry:'#a9484f',water:'#6a9d9f',trail:'#b0a184'};
 for(const name of ['shell','upper','ceiling','furniture','vegetation','terrain','water','trail','bridge','doors']){groups[name]=new THREE.Group();groups[name].name=name;root.add(groups[name]);}
 function material(slot){if(!materials.has(slot))materials.set(slot,new THREE.MeshStandardMaterial({color:colors[slot]||slot,roughness:slot==='gold'?.45:.9,metalness:slot==='gold'?.35:0,side:THREE.DoubleSide,emissive:slot==='glow'?'#ffe3ad':'#000000',emissiveIntensity:slot==='glow'?.3:0}));return materials.get(slot);}
 function add(g,slot,group='shell') {const key=group+'|'+slot;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(g.index?g.toNonIndexed():g);}
 function box(x,y,z,w,h,d,slot='wood',group='shell'){const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y+h/2,z);add(g,slot,group);}
 function ellipsoid(x,y,z,rx,ry,rz,slot='leaf',group='vegetation'){const g=new THREE.IcosahedronGeometry(1,1);g.scale(rx,ry,rz);g.translate(x,y,z);add(g,slot,group);}
 function branch(a,b,r,slot='bark',group='vegetation'){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),v=B.clone().sub(A),g=new THREE.CylinderGeometry(r*.5,r,v.length(),7);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));g.translate(...A.add(B).multiplyScalar(.5).toArray());add(g,slot,group);}
 for(const w of model.walls)add(wallGeometry(w,model.openings),'cream',w.base?'upper':'shell');
 for(const g of model.gables)add(gableGeometry(g),'cream','upper');
 for(const r of model.roofs)add(roofGeometry(r),'roof','upper');
 for(const f of model.floors)box(0,f.y-f.thickness,0,12,f.thickness,9,'wood',f.ceiling?'ceiling':'shell');
 // Backed valley host prevents a background slit; its weather/drainage design is pending.
 box(0,4.9,0,.26,.3,9,'wood','upper');
 for(const o of model.openings){
  add(frameGeometry(o),'wood',o.sill>2?'upper':'shell');
  if(o.kind==='window')add(openingGeometry(o),'blue',o.sill>2?'upper':'shell');
 }
 // The arched cap is fixed glazing, leaving a measured 2.10 m rectangular passage below.
 const entry=model.openings.find(o=>o.kind==='door'),cap={...entry,sill:2.1,height:.15};add(openingGeometry(cap),'blue');
 for(const x of [-5.85,-3,0,3,5.85])for(const z of [-4.35,4.35]){
  if(x===0)continue;box(x-.065,0,z-.04,.13,2.6,.08,'wood');box(x-.065,2.6,z-.04,.13,2.6,.08,'wood','upper');
 }
 for(const z of [-4.35,4.35]){box(0,2.48,z,12,.12,.36,'wood');box(0,5.08,z,12,.12,.36,'wood','upper');}
 // Per-door groups retain real hinge transforms; geometry and collision share leaves().
 for(const l of model.leaves()){
  const pivot=new THREE.Group(),leaf=new THREE.Mesh(new THREE.BoxGeometry(1.2,2.1,.08),material('wood'));
  leaf.position.set(-l.sign*.6,1.05,0);pivot.add(leaf);pivot.position.set(...[l.hinge[0],0,l.hinge[1]]);pivot.rotation.y=l.angle;pivot.name=l.id;groups.doors.add(pivot);objects.set(l.id,pivot);
 }
 const room=buildCottageRoom(model.room,material);groups.furniture.add(room.root);for(const[id,o]of room.objects)objects.set(id,o);
 const y=(x,z)=>geo.forest.height(x,z)-model.origin.y;
 // Shared geography, 128 subdivisions (about 1.17 m samples); collider still evaluates the analytic surface.
 const terrain=new THREE.PlaneGeometry(150,150,128,128);terrain.rotateX(-Math.PI/2);const p=terrain.attributes.position,cs=[];
 for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,y(x,z));const c=new THREE.Color(geo.habitats.zoneAt(x,z).color);cs.push(c.r,c.g,c.b);}
 terrain.setAttribute('color',new THREE.Float32BufferAttribute(cs,3));terrain.computeVertexNormals();groups.terrain.add(new THREE.Mesh(terrain,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide})));
 function strip(points,width,height,slot,group){const ps=resample(points,.5),vs=[];for(let i=1;i<ps.length;i++){const a=ps[i-1],b=ps[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]),dx=-(b[1]-a[1])/len*width/2,dz=(b[0]-a[0])/len*width/2;const q=[[a[0]-dx,a[1]-dz],[a[0]+dx,a[1]+dz],[b[0]-dx,b[1]-dz],[b[0]+dx,b[1]+dz]];for(const j of [0,2,1,1,2,3]){const[x,z]=q[j];vs.push(x,height(x,z),z);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));g.computeVertexNormals();add(g,slot,group);
 }
 for(const ps of [proposal.forest_sample.loop,proposal.forest_sample.entry_spur])strip(ps,2.6,(x,z)=>geo.forest.floor(x,z)-model.origin.y+.012,'trail','trail');
 const f=proposal.forest_sample,pond=new THREE.CircleGeometry(1,64);pond.rotateX(-Math.PI/2);pond.scale(f.pond.radii[0],1,f.pond.radii[1]);pond.translate(f.pond.centre[0],geo.forest.datum+f.pond.level_relative_m-model.origin.y,f.pond.centre[1]);add(pond,'water','water');
 strip(f.rill.points,f.rill.width_m,(x,z)=>geo.forest.datum+nearLine([x,z],f.rill.points,f.rill.levels).level-model.origin.y+.008,'water','water');
 const b=f.bridge,c=b.centre,d=b.direction;
 strip([[c[0]-d[0]*(b.length_m/2+b.ramp_length_m),c[1]-d[1]*(b.length_m/2+b.ramp_length_m)],[c[0]+d[0]*(b.length_m/2+b.ramp_length_m),c[1]+d[1]*(b.length_m/2+b.ramp_length_m)]],b.width_m,(x,z)=>geo.forest.floor(x,z)-model.origin.y+.005,'wood','bridge');
 // Modest source-family silhouettes. Root contacts and trunk blockers retain the scatter contract.
 for(const o of model.vegetation){const{x,z,height:h,crown_radius:r}=o,Y=o.y;
  if(o.kind==='broadleaf'||o.kind==='birch'||o.kind==='sapling'){
   const slot=o.kind==='birch'?'birch':'bark';branch([x,Y,z],[x+.10,Y+h*.78,z],o.radius,slot);
   for(let i=0;i<6;i++){const a=i*Math.PI/3+o.x,dx=Math.cos(a)*r*.45,dz=Math.sin(a)*r*.45,cy=Y+h*(.56+(i%3)*.12);branch([x,Y+h*.42,z],[x+dx,cy,z+dz],o.radius*.5,slot);ellipsoid(x+dx,cy,z+dz,r*.5,h*.19,r*.5,i%2?'leaf':'leaf2');}
   ellipsoid(x,Y+h*.84,z,r*.65,h*.16,r*.65,'leaf');
   if(o.kind==='birch')for(let n=0;n<8;n++)box(x,Y+n*h*.065,z+o.radius*.8,o.radius*1.1,.06,.035,'bark','vegetation');
  }else if(o.kind==='deadwood'){branch([x-1.2,Y+o.height*.44,z],[x+1.2,Y+o.height*.44,z],o.height*.45);}
  else if(o.kind==='rock'){ellipsoid(x,Y+h*.45,z,o.radius*.8,h*.55,o.radius*.8,'rock');}
  else if(o.kind==='shrub'){for(let i=0;i<3;i++){const a=i*2.1;ellipsoid(x+Math.cos(a)*.17,Y+h*.5,z+Math.sin(a)*.17,o.radius*.65,h*.5,o.radius*.65,'leaf');}}
  else if(o.kind==='reed'){for(let i=0;i<5;i++){const a=i*2.4;branch([x+Math.cos(a)*.2,Y,z+Math.sin(a)*.2],[x+Math.cos(a)*.25,Y+h,z+Math.sin(a)*.25],.012,'leaf');}}
  else {for(let i=0;i<5;i++){const a=i*2.4,xx=x+Math.cos(a)*.1,zz=z+Math.sin(a)*.1;branch([xx,Y,zz],[xx+.025,Y+h*.82,zz],.009,'leaf');ellipsoid(xx+.025,Y+h*.85,zz,.045,h*.15,.045,o.kind==='bluebell'?'flower':'berry');}}
 }
 for(const[key,gs]of batches){const[group,slot]=key.split('|'),g=new THREE.BufferGeometry();for(const name of ['position','normal']){const data=gs.flatMap(g=>Array.from(g.attributes[name].array));g.setAttribute(name,new THREE.Float32BufferAttribute(data,3));}groups[group].add(new THREE.Mesh(g,material(slot)));for(const g of gs)g.dispose();}
 for(const light of model.room.lights){const point=new THREE.PointLight(light.colour,light.intensity,light.distance,2);point.position.fromArray(light.position);groups.furniture.add(point);}
 function setDoors(){for(const l of model.leaves())objects.get(l.id).rotation.y=l.angle;root.updateMatrixWorld(true);}
 root.updateMatrixWorld(true);return{root,groups,objects,materials,setDoors,material};
}
