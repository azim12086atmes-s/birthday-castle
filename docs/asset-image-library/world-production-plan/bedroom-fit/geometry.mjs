import * as THREE from '../../../../vendor/three.module.min.js';
import {vaultHeight,apertureOutline,apertureTop} from './model.mjs';
export {THREE};
const shape=ps=>{const s=new THREE.Shape();ps.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return s;};
export function wallGeometry(w,openings){
 const os=openings.filter(o=>o.wall_id===w.id),outline=[[w.start,0]];
 for(const o of os.filter(o=>o.sill===0).sort((a,b)=>a.centre-b.centre)){outline.push([o.centre-o.width/2,0]);for(let n=0;n<=64;n++){const u=o.centre-o.width/2+n/64*o.width;outline.push([u,apertureTop(o,u)]);}outline.push([o.centre+o.width/2,0]);}
 outline.push([w.end,0]);if(w.vault_end)for(let n=0;n<=128;n++){const u=w.end-(w.end-w.start)*n/128;outline.push([u,vaultHeight(u)]);}else outline.push([w.end,w.height],[w.start,w.height]);
 const s=shape(outline);for(const o of os.filter(o=>o.sill>0)){const p=new THREE.Path();apertureOutline(o).forEach(([x,y],i)=>i?p.lineTo(x,y):p.moveTo(x,y));p.closePath();s.holes.push(p);}
 const g=new THREE.ExtrudeGeometry(s,{depth:w.depth,bevelEnabled:false}),p=g.attributes.position;for(let n=0;n<p.count;n++){const u=p.getX(n),y=p.getY(n),d=p.getZ(n)-w.depth/2;if(w.axis==='x')p.setXYZ(n,u,y,w.at+d);else p.setXYZ(n,w.at+d,y,u);}if(w.axis==='z')g.setIndex(Array.from({length:p.count},(_,n)=>n%3===1?n+1:n%3===2?n-1:n));g.computeVertexNormals();return g;
}
function apertureGeometry(o,ring=0){const s=shape(apertureOutline(ring?{...o,width:o.width+2*ring,sill:o.sill-ring,height:o.height+2*ring,rise:o.rise+ring}:o));if(ring){const h=new THREE.Path();apertureOutline(o).forEach(([x,y],n)=>n?h.lineTo(x,y):h.moveTo(x,y));h.closePath();s.holes.push(h);}const g=new THREE.ExtrudeGeometry(s,{depth:ring?.1:.035,bevelEnabled:false}),p=g.attributes.position;for(let n=0;n<p.count;n++){const u=p.getX(n),y=p.getY(n),d=p.getZ(n),at=o.at+o.face_sign*(ring?.20:0);if(o.axis==='x')p.setXYZ(n,u,y,at+o.face_sign*d);else p.setXYZ(n,at+o.face_sign*d,y,u);}g.computeVertexNormals();return g;}

export function buildBedroom(model){
 const root=new THREE.Group(),groups={},objects=new Map(),materials=new Map(),colours={ivory:'#f1e3d0',rose:'#cfa2a5',pink:'#d695ad',navy:'#303b75',gold:'#c7a15b',white:'#faf1e5',wood:'#a68274',glow:'#ffe2b2',blue:'#6fa7cb',glasspink:'#d5a1c7',green:'#53704d',flower:'#d785a5',water:'#83bfcb'};
 for(const name of ['floor','walls','ceiling','rail','garden','contents','pendants']){groups[name]=new THREE.Group();root.add(groups[name]);}
 const material=slot=>{if(!materials.has(slot))materials.set(slot,new THREE.MeshStandardMaterial({color:colours[slot]||slot,roughness:slot==='gold'?.35:.68,metalness:slot==='gold'?.45:0,side:THREE.DoubleSide,emissive:slot==='glow'?'#ffd69a':'#000000',emissiveIntensity:slot==='glow'?.35:0}));return materials.get(slot);};
 function kit(parent){const batches=new Map();const add=(g,slot='ivory')=>{if(!batches.has(slot))batches.set(slot,[]);batches.get(slot).push(g.index?g.toNonIndexed():g);};
  const box=(x,y,z,w,h,d,slot='ivory')=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y+h/2,z);add(g,slot);};
  const cylinder=(x,y,z,rt,rb,h,slot='gold',n=16)=>{const g=new THREE.CylinderGeometry(rt,rb,h,n);g.translate(x,y+h/2,z);add(g,slot);};
  const ball=(x,y,z,rx,ry,rz,slot='pink')=>{const g=new THREE.SphereGeometry(1,10,8);g.scale(rx,ry,rz);g.translate(x,y,z);add(g,slot);};
  const tube=(ps,r=.025,slot='gold')=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ps.map(p=>new THREE.Vector3(...p))),Math.max(8,ps.length*2),r,6,false),slot);
  const star=(x,y,z,r,slot='gold',rotation=0)=>{const ps=Array.from({length:16},(_,i)=>{const a=i*Math.PI/8+rotation,rr=i%2?r*.33:r;return[Math.sin(a)*rr,Math.cos(a)*rr];}),g=new THREE.ExtrudeGeometry(shape(ps),{depth:.012,bevelEnabled:false});g.translate(x,y,z);add(g,slot);};
  const flush=()=>{for(const[slot,geos]of batches){const g=new THREE.BufferGeometry();for(const name of ['position','normal']){const size=geos.reduce((n,g)=>n+g.attributes[name].array.length,0),data=new Float32Array(size);let offset=0;for(const g of geos){data.set(g.attributes[name].array,offset);offset+=g.attributes[name].array.length;}g.setAttribute(name,new THREE.Float32BufferAttribute(data,3));}parent.add(new THREE.Mesh(g,material(slot)));for(const g of geos)g.dispose();}batches.clear();};
  return{add,box,cylinder,ball,tube,star,flush};
 }
 const floor=kit(groups.floor),walls=kit(groups.walls),ceiling=kit(groups.ceiling),rail=kit(groups.rail),garden=kit(groups.garden);
 floor.box(0,-.6,0,24.8,.6,18.8);floor.box(-14,-.6,-1,4,.6,8);floor.box(0,-.6,11,3.2,.6,4);
 // Four quarter discs have flat mating faces. Top and rim are a single generated substrate.
 const quarter=shape([[0,0],...Array.from({length:33},(_,n)=>[9*Math.cos(n/32*Math.PI/2),9*Math.sin(n/32*Math.PI/2)])]);
 const sector=new THREE.ExtrudeGeometry(quarter,{depth:.6,bevelEnabled:false});sector.rotateX(Math.PI/2);
 for(let n=0;n<4;n++){const g=sector.clone();g.rotateY(-n*Math.PI/2);g.translate(-23,0,-1);floor.add(g,'ivory');}sector.dispose();
 // Decorative floor inlays are thin, separately attached surfaces at Y=1 mm.
 for(const[x,z,r]of [[0,0,3.8],[-23,-1,7.8]]){
  const torus=new THREE.TorusGeometry(r,.05,5,96);torus.rotateX(Math.PI/2);torus.scale(1,.04,1);torus.translate(x,.001,z);floor.add(torus,'gold');
  const inner=new THREE.TorusGeometry(r-.22,.06,5,96);inner.rotateX(Math.PI/2);inner.scale(1,.04,1);inner.translate(x,.001,z);floor.add(inner,'navy');
  for(let i=0;i<16;i++){const a=i*Math.PI/8,g=new THREE.BoxGeometry(.045,.002,r*.65);g.rotateY(a);g.translate(x+Math.sin(a)*r*.39,.001,z+Math.cos(a)*r*.39);floor.add(g,i%2?'rose':'gold');}
 }
 // Subtle rose veins are geometry inspection motifs, not seamless production textures.
 for(let n=-5;n<=5;n++){const ps=Array.from({length:7},(_,i)=>[-11.6+i*3.85,.002,n*1.5+.15*Math.sin(i*1.7+n)]);floor.tube(ps,.0015,'rose');}
 for(const w of model.walls){walls.add(wallGeometry(w,model.openings),w.axis==='z'?'ivory':'rose');
  // Cornices and plinths stop at real openings rather than crossing through them.
  const os=model.openings.filter(o=>o.wall_id===w.id),face=w.at-Math.sign(w.at)*.23;
  for(const [y,h,slot]of [[0,.16,'rose'],[4.45,.12,'gold'],[8.94,.12,'gold']].filter(([y])=>y<(w.height||18)))for(let u=w.start;u<w.end;u+=.2){const mid=u+.1;if(os.some(o=>mid>o.centre-o.width/2-.1&&mid<o.centre+o.width/2+.1&&y+h>o.sill&&y<apertureTop(o,mid)))continue;if(w.axis==='x')walls.box(mid,y,face,.202,h,.10,slot);else walls.box(face,y,mid,.10,h,.202,slot);}
 }
 walls.box(0,5.8,-8.4,4.8,.2,1.2,'ivory');
 for(const o of model.openings){walls.add(apertureGeometry(o,o.id==='W-BALCONY'?.6:.16),'gold');
  if(o.kind==='window'){
   walls.add(apertureGeometry(o),'blue');
   for(const y of [2.2,4.4,6.6,8.0]){const vs=[];for(const [yy,z]of [[y-.45,o.centre],[y,o.centre+.65],[y+.45,o.centre],[y+.45,o.centre],[y,o.centre-.65],[y-.45,o.centre]])vs.push(o.at-.036,yy,z);const d=new THREE.BufferGeometry();d.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));d.computeVertexNormals();walls.add(d,'glasspink');}
   for(let y=o.sill+.4;y<o.sill+o.height-.3;y+=1.1){const ps=[[o.at-.225,y,o.centre],[o.at-.225,y+.5,o.centre+.7],[o.at-.225,y+1,o.centre],[o.at-.225,y+.5,o.centre-.7],[o.at-.225,y,o.centre]];if(y+1<apertureTop(o,o.centre+.7))walls.tube(ps,.025,'gold');}
   for(const dz of [-.7,.7])walls.box(o.at-.23,o.sill,o.centre+dz,.025,6.5,.025,'gold');
  }
 }
 // Vault shell: sealed ends and side edges, with three indigo bays on its underside.
 const xs=Array.from({length:129},(_,i)=>-12.4+i/128*24.8),profile=[...xs.map(x=>[x,vaultHeight(x)]),...xs.slice().reverse().map(x=>[x,vaultHeight(x)+.25])],vault=new THREE.ExtrudeGeometry(shape(profile),{depth:18.8,bevelEnabled:false});vault.translate(0,0,-9.4);const vaultMesh=new THREE.Mesh(vault,material('ivory'));vaultMesh.name='VAULT-SUBSTRATE';groups.ceiling.add(vaultMesh);
 for(const z of [-6,0,6]){
  const vs=[];for(let i=1;i<xs.length;i++){const a=xs[i-1],b=xs[i];for(const[x,zz]of [[a,z-2.6],[b,z-2.6],[a,z+2.6],[a,z+2.6],[b,z-2.6],[b,z+2.6]])vs.push(x,vaultHeight(x)-.002,zz);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));g.computeVertexNormals();ceiling.add(g,'navy');
  for(const x of [-9,-6,-3,0,3,6,9])for(const dz of [-1.3,1.3]){const y=vaultHeight(x)-.035,normal=new THREE.Vector3(-(vaultHeight(x+.01)-vaultHeight(x-.01))/.02,1,0).normalize(),g=new THREE.SphereGeometry(.07,8,6);g.scale(1,.15,1);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),normal));g.translate(x,y,z+dz);ceiling.add(g,'gold');}
 }
 for(const z of [-9,-3,3,9])ceiling.tube(xs.map(x=>[x,vaultHeight(x)-.035,z]),.07,'gold');
 for(const z of [-6,0,6])for(const sign of [-1,1])ceiling.tube(Array.from({length:49},(_,i)=>{const x=-12+i*.5;return[x,vaultHeight(x)-.05,z+sign*(Math.abs(x)/12*3)];}),.045,'ivory');
 // Continuous rail with an intentional opening where circle and neck overlap.
 const arc=model.rail_arc;
 for(const y of [.16,1.06])rail.tube(arc.map(([x,z])=>[x,y,z]),.06,y<.2?'ivory':'gold');
 for(let i=0;i<arc.length;i+=3){const[x,z]=arc[i];rail.cylinder(x,0,z,.045,.055,1.1,'ivory');}
 for(const l of model.rails.filter(l=>l.kind==='straight')){for(const y of [.16,1.06])rail.tube([[l.a[0],y,l.a[1]],[l.b[0],y,l.b[1]]],.06,y<.2?'ivory':'gold');for(let i=0;i<5;i++){const t=i/4;rail.cylinder(l.a[0]*(1-t)+l.b[0]*t,0,l.a[1],.045,.055,1.1,'ivory');}}
 for(let i=0;i<arc.length-6;i+=6){const a=arc[i],b=arc[i+6],mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];rail.tube([[a[0],.25,a[1]],[mid[0],.88,mid[1]],[b[0],.25,b[1]]],.025,'gold');}
 // Modest exterior flower rhythm leaves the opening and the room architecture visible.
 for(const planter of model.rail_planters){const[x,,z]=planter.rail_anchor,[xx,,zz]=planter.pot_base;garden.tube([[x,1.06,z],[x,.40,z],[xx,.40,zz]],.022,'gold');garden.box(xx,.40,zz,.24,.02,.24,'gold');garden.cylinder(xx,.42,zz,.17,.12,.18,'rose');garden.ball(xx,.66,zz,.19,.15,.19,'green');for(let n=0;n<3;n++)garden.ball(xx+Math.cos(n*2.1)*.12,.80,zz+Math.sin(n*2.1)*.12,.065,.065,.065,'flower');}

 // A plain source-sized curtain rail, repeated and trimmed at exposed ends.
 walls.box(-11.89,12.22,-1,.08,.08,8,'gold');for(const z of [-5,-2,1,3])walls.box(-11.98,12.18,z,.16,.15,.08,'gold');
 for(const item of model.items){const object=new THREE.Group();object.name=item.id;objects.set(item.id,object);(item.layer==='ceiling'?groups.pendants:item.kind==='rose-urn'?groups.garden:groups.contents).add(object);const k=kit(object),{box,cylinder,ball,tube,star}=k,[W,D,H]=item.dimensions;
  function legs(w,d,h){for(const x of [-w/2+.07,w/2-.07])for(const z of [-d/2+.07,d/2-.07]){cylinder(x,0,z,.035,.055,h,'gold');ball(x,.06,z,.06,.06,.06,'ivory');}}
  switch(item.kind){
   case 'bed':
    for(const x of [-1.03,1.03])for(const z of [-1.28,1.28]){cylinder(x,0,z,.045,.055,2.68,'ivory');for(const y of [.12,.55,1.9,2.6])cylinder(x,y,z,.065,.065,.05,'gold');ball(x,2.73,z,.055,.07,.055,'gold');}
    for(const x of [-1.04,1.04])box(x,.32,0,.10,.16,2.6,'rose');for(const z of [-1.3,1.3])box(0,.32,z,2.1,.16,.10,'rose');
    for(let n=0;n<12;n++)box(0,.43,-1.2+n*.215,2.05,.05,.10,'wood');
    for(const x of [-1.05,1.05])box(x,2.60,0,.08,.07,2.6,'gold');for(const z of [-1.3,1.3])box(0,2.60,z,2.1,.07,.08,'gold');
    for(let x=-.9;x<=.9;x+=.18){ball(x,2.64,1.31,.055,.04,.03,'green');ball(x,2.69,1.33,.04,.04,.04,'flower');}
    {const o={centre:0,width:1.8,sill:.5,height:1.35,rise:.8},g=new THREE.ExtrudeGeometry(shape(apertureOutline(o)),{depth:.10,bevelEnabled:false});g.translate(0,0,-1.30);k.add(g,'navy');star(0,1.25,-1.18,.20);ball(0,.85,-1.18,.55,.30,.04,'pink');}break;
   case 'mattress':box(0,0,0,W,H,D,'white');break;
   case 'sheet':
    box(0,.28,0,2,.01,2.2,'white');for(const x of [-.995,.995])box(x,0,0,.01,.28,2.2,'white');for(const z of [-1.095,1.095])box(0,0,z,2,.28,.01,'white');break;
   case 'duvet':
    box(0,0,0,2,.08,2.5,'pink');for(const sign of [-1,1]){const vs=[sign*1,0,-1.25,sign*1.10,-.17,-1.25,sign*1,0,1.25,sign*1,0,1.25,sign*1.10,-.17,-1.25,sign*1.10,-.17,1.25],g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));g.computeVertexNormals();k.add(g,'pink');}
    for(const x of [-.7,0,.7])tube([[x,.081,-1.2],[x,.081,1.2]],.005,'gold');break;
   case 'pillow':ball(0,H/2,0,W/2,H/2,D/2,'white');break;
   case 'canopy-curtain':{
    const side=Math.sign(item.position[0]),point=(u,v)=>{const y=v*2.3,spread=.10+.10*Math.abs((y-1)/1.3),width=.10+.26*Math.min(1,Math.abs(y-1)/1.2);return[-side*spread+(u-.5)*width,y,.025*Math.sin(u*Math.PI*10)];},vs=[];
    for(let j=0;j<32;j++)for(let n=0;n<20;n++)for(const[u,v]of [[n/20,j/32],[(n+1)/20,j/32],[n/20,(j+1)/32],[n/20,(j+1)/32],[(n+1)/20,j/32],[(n+1)/20,(j+1)/32]])vs.push(...point(u,v));
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));g.computeVertexNormals();k.add(g,'pink');
    tube(Array.from({length:21},(_,n)=>point(n/20,.02)),.006,'gold');
    for(const u of [.15,.5,.85]){const q=point(u,1);tube([q,[0,2.45,0]],.006,'gold');}
    const ring=new THREE.TorusGeometry(.07,.008,5,16);ring.rotateX(Math.PI/2);ring.translate(-side*.10,1,0);k.add(ring,'gold');break;}
   case 'valance':box(0,0,0,W,.32,.035,'navy');for(let x=-W/2+.18;x<W/2;x+=.30)star(x,.16,.025,.055);break;
   case 'skirt':for(let x=-W/2+.025;x<W/2;x+=.05)box(x,0,.012*Math.sin(x*30),.05,H,.02,'pink');break;
   case 'runner':box(0,0,0,2,.015,.55,'navy');for(const sign of [-1,1])box(sign*1.02,-.12,0,.015,.135,.55,'navy');for(const x of [-.7,0,.7]){const g=new THREE.TorusGeometry(.06,.008,4,12);g.rotateX(Math.PI/2);g.translate(x,.017,0);k.add(g,'gold');}break;
   case 'cabinet':legs(W,D,.15);box(0,.13,0,W-.03,.57,D-.03);box(0,.70,0,W,.05,D,'rose');for(const x of [-.155,.155]){box(x,.2,D/2+.001,.285,.32,.015,'navy');star(x,.36,D/2+.02,.07);}break;
   case 'wardrobe':legs(W,D,.12);box(0,.1,0,W,.12,D,'rose');box(0,.22,0,W-.06,2.12,D-.04);for(const x of [-.39,.39]){box(x,.28,D/2,.72,1.83,.025,'navy');for(const y of [.6,1.1,1.6])star(x,y,D/2+.03,.12);}box(0,2.34,0,W,.06,D,'gold');break;
   case 'dressing-table':case 'console':case 'table':
    legs(W,D,H-.08);box(0,H-.16,0,W-.08,.10,D-.06);box(0,H-.06,0,W,.06,D,'rose');break;
   case 'chair':
    legs(W,D,.43);box(0,.40,0,W,.1,D,'pink');box(0,.50,-D/2+.07,W,.55,.10);ball(0,.77,-D/2+.13,W*.36,.22,.035,'pink');for(const x of [-W/2+.04,W/2-.04])box(x,.65,0,.06,.06,D,'gold');break;
   case 'chaise':legs(W,D,.35);box(0,.30,0,W,.12,D);ball(0,.48,0,W/2,.14,D/2,'pink');box(0,.5,D/2-.06,W,.30,.10,'pink');break;
   case 'mirror':box(0,0,0,.9,1.2,.08,'gold');ball(0,.6,.06,.40,.53,.015,'blue');break;
   case 'casket':{
    box(0,0,0,.28,.025,.18,'rose');for(const x of [-.13,.13])box(x,.025,0,.02,.09,.18);for(const z of [-.08,.08])box(0,.025,z,.24,.09,.02);const hinge=new THREE.Group();hinge.name='CASKET-LID';hinge.position.set(0,.115,-.09);object.add(hinge);const lid=new THREE.Mesh(new THREE.BoxGeometry(.28,.04,.18),material('rose'));lid.position.set(0,.02,.09);hinge.add(lid);objects.set('CASKET-LID',hinge);break;}
   case 'locket':ball(0,.004,0,.0175,.004,.0225,'gold');ball(0,.007,0,.010,.001,.015,'pink');break;
   case 'gift':box(0,0,0,W,H,D,'pink');box(0,H*.98,0,W*.12,H*.02,D,'gold');box(0,H*.98,0,W,H*.02,D*.12,'gold');box(0,0,D/2-.005,W*.12,H,.01,'gold');break;
   case 'bottle':cylinder(0,0,0,.03,.03,.1,'blue');cylinder(0,.10,0,.012,.012,.025);ball(0,.14,0,.025,.02,.025,'gold');break;
   case 'rug':box(0,0,0,W,.012,D,'pink');for(const x of [-W/2+.08,W/2-.08])box(x,.011,0,.045,.001,D-.10,'navy');for(const z of [-D/2+.08,D/2-.08])box(0,.011,z,W-.10,.001,.045,'navy');break;
   case 'privacy-curtain':{
    const point=(u,v)=>{const y=v*12.1,width=.16+.32*Math.min(1,Math.abs(y-1.2)/3);return[.025*Math.sin(u*Math.PI*12),y,(u-.5)*width];},vs=[];
    for(let j=0;j<48;j++)for(let n=0;n<20;n++)for(const[u,v]of [[n/20,j/48],[(n+1)/20,j/48],[n/20,(j+1)/48],[n/20,(j+1)/48],[(n+1)/20,j/48],[(n+1)/20,(j+1)/48]])vs.push(...point(u,v));
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));g.computeVertexNormals();k.add(g,'pink');box(0,12.1,0,.06,.03,.5,'gold');break;}
   case 'rose-urn':cylinder(0,0,0,.23,.26,.12,'ivory');cylinder(0,.12,0,.15,.20,.45,'rose');cylinder(0,.57,0,.28,.14,.18,'ivory');ball(0,.83,0,.32,.20,.32,'green');for(let n=0;n<7;n++){const a=n*Math.PI*2/7;ball(Math.cos(a)*.23,1.05+Math.sin(a)*.06,Math.sin(a)*.23,.10,.10,.10,'flower');}break;
   case 'fountain':cylinder(0,0,0,.6,.6,.10,'ivory');cylinder(0,.10,0,.58,.52,.12,'rose');cylinder(0,.21,0,.49,.49,.015,'water');cylinder(0,.15,0,.06,.12,.62,'gold');cylinder(0,.65,0,.26,.18,.10,'ivory');tube([[0,.75,0],[0,1.1,0],[.18,.50,0]],.012,'water');break;
   case 'chandelier':
    cylinder(0,.3,0,.04,.05,2.1);for(let n=0;n<8;n++){const a=n*Math.PI/4,x=Math.cos(a)*1.05,z=Math.sin(a)*1.05;tube([[0,1.2,0],[x*.6,.6,z*.6],[x,.9,z]],.035);cylinder(x,.9,z,.05,.05,.25,'white');ball(x,1.2,z,.055,.08,.055,'glow');ball(x,.50,z,.055,.15,.055,'blue');}ball(0,.12,0,.1,.12,.1,'blue');tube([[0,2.4,0],[0,13.2,0]],.022);break;
   case 'sconce':box(0,0,.015,.22,.65,.03,'gold');tube([[0,.12,.03],[0,.20,.25],[0,.40,.25]],.025);cylinder(0,.4,.25,.045,.045,.15,'white');ball(0,.6,.25,.04,.05,.04,'glow');break;
  }
  k.flush();object.position.fromArray(item.position);object.rotation.y=item.rotation;
 }
 for(const k of [floor,walls,ceiling,rail,garden])k.flush();
 for(const light of model.lights){const point=new THREE.PointLight(light.colour,light.intensity,light.distance,2);point.position.fromArray(light.position);root.add(point);}
 const setCasket=()=>{objects.get('CASKET-LID').rotation.x=model.casketOpen?-Math.PI*.48:0;root.updateMatrixWorld(true);};
 root.updateMatrixWorld(true);return{root,groups,objects,materials,setCasket,vaultMesh};
}
