import {THREE} from './geometry.mjs';
import {archPolygon} from './model.mjs';
const shape=ps=>{const s=new THREE.Shape();ps.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return s;};
const extrude=(ps,depth)=>new THREE.ExtrudeGeometry(shape(ps),{depth,bevelEnabled:false});
const arch=(w,h,r)=>archPolygon({centre:0,sill:0,width:w,height:h,arch_rise:r});
function clip(ps,min,max){for(const [edge,sign] of [[min,1],[max,-1]]){const out=[];for(let i=0;i<ps.length;i++){const a=ps[i],b=ps[(i+1)%ps.length],ia=(a[0]-edge)*sign>=-1e-9,ib=(b[0]-edge)*sign>=-1e-9;if(ia)out.push(a);if(ia!==ib){const t=(edge-a[0])/(b[0]-a[0]);out.push([edge,a[1]+t*(b[1]-a[1])]);}}ps=out;}return ps;}
// Geometry is in local X width, Y height, Z outward. All figures remain fit specimens.
export function fittingGeometry(item,state={doorOpen:true,shuttersOpen:true}){
 const group=new THREE.Group(),parts=[];
 const add=(g,slot='wood',parent=group)=>{g.userData.slot=slot;parts.push({g,slot,parent});return g;};
 const box=(x,y,z,w,h,d,slot='wood',parent=group)=>{const g=new THREE.BoxGeometry(w,h,d);g.translate(x,y+h/2,z+d/2);return add(g,slot,parent);};
 const beam=(a,b,w,d,slot='wood')=>{const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),g=new THREE.BoxGeometry(w,av.distanceTo(bv),d);g.applyMatrix4(new THREE.Matrix4().compose(av.clone().add(bv).multiplyScalar(.5),new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),bv.clone().sub(av).normalize()),new THREE.Vector3(1,1,1)));add(g,slot);};
 const ring=(w,h,r,t,depth,z=0)=>{const s=shape(arch(w,h,r)),p=new THREE.Path();arch(w-2*t,h-2*t,Math.max(.01,r-t)).forEach(([x,y],i)=>i?p.lineTo(x,y+t):p.moveTo(x,y+t));p.closePath();s.holes.push(p);const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:false});g.translate(0,0,z);return add(g);};
 switch(item.part){
 case 'D01':{
  const g=extrude([[0,0],[0,.5],[.4,.5],[.4,.42],[.31,.4],[.24,.32],[.18,.22],[.12,.06]],.22);
  const p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i);p.setXYZ(i,z-.11,y,x);}g.computeVertexNormals();add(g);break;}
 case 'D02':{const l=item.length??1.8;box(l/2,-.18,0,l,.18,.12);for(let x=.12;x<l-.06;x+=.24){const g=extrude([[x-.09,-.16],[x,-.18],[x+.09,-.16],[x,-.09]],.006);g.translate(0,0,.12);add(g,'gold');}break;}
 case 'D03':{
  // Whole insert, including its frame, stays inside the 1.2 x 1.4 aperture.
  ring(1.2,1.4,.6,.06,.12,-.12);const g=extrude(arch(1.08,1.28,.54),.015);g.translate(0,.06,-.06);add(g,'glass');
  box(0,0,-.12,1.2,.06,.12);box(0,.06,-.07,.025,1.25,.025,'gold');box(0,.55,-.07,1.08,.025,.025,'gold');break;}
 case 'D04':{
  for(const side of [-1,1]){const pivot=new THREE.Group();pivot.name=side<0?'left-leaf':'right-leaf';pivot.position.set(side*.6,0,.07);pivot.rotation.y=state.shuttersOpen?side*170*Math.PI/180:0;group.add(pivot);
   const ps=clip(arch(1.2,1.4,.6),side<0?-.6:0,side<0?0:.6).map(([x,y])=>[x-side*.6,y]),g=extrude(ps,.08);g.translate(0,0,-.04);add(g,'wood',pivot);
   for(const y of [.25,.7])box(-side*.24,y,.022,.48,.045,.018,'gold',pivot);
  }break;}
 case 'D05':{
  const pivot=new THREE.Group();pivot.name='door-leaf';pivot.rotation.y=state.doorOpen?110*Math.PI/180:0;group.add(pivot);
  const s=shape(arch(1,2.1,.5).map(([x,y])=>[x+.5,y])),hole=new THREE.Path();hole.absarc(.5,1.4,.12,0,Math.PI*2,true);s.holes.push(hole);
  const g=new THREE.ExtrudeGeometry(s,{depth:.1,bevelEnabled:false});g.translate(0,0,-.05);add(g,'wood',pivot);
  const glass=new THREE.CylinderGeometry(.12,.12,.018,32);glass.rotateX(Math.PI/2);glass.translate(.5,1.4,0);add(glass,'glass',pivot);
  box(.8,.9,.05,.06,.12,.025,'gold',pivot);for(const y of [.25,1.05])box(.2,y,.05,.4,.04,.025,'gold',pivot);break;}
 case 'D06':{
  // Top at sill; outside wall, with an actual empty cavity and separated drain slats.
  box(-.62,-.3,0,.06,.3,.35);box(.62,-.3,0,.06,.3,.35);box(0,-.3,0,1.18,.3,.045);box(0,-.3,.305,1.18,.3,.045);
  for(let x=-.54;x<=.55;x+=.18)box(x,-.3,.045,.14,.045,.26);
  for(const x of [-.4,.4])box(x,-.35,0,.1,.1,.3);break;}
 case 'D07':{
  // Width 1.2 m along slope, length .9 m along ridge; normal thickness .08 m.
  for(let row=0;row<3;row++)for(let col=0;col<4;col++){
   const x=-.6+col*.3,y=-.45+row*.3,ps=[[x,y+.3],[x+.3,y+.3],[x+.3,y+.08]];
   for(let i=0;i<=12;i++){const a=-i/12*Math.PI;ps.push([x+.15+.15*Math.cos(a),y+.08+.08*Math.sin(a)]);}
   ps.push([x,y+.3]);const g=extrude(ps,.045);const p=g.attributes.position;
   for(let i=0;i<p.count;i++){const u=p.getX(i),v=p.getY(i),n=p.getZ(i);p.setXYZ(i,u,n+row*.012,v);}g.computeVertexNormals();add(g,col%2?'roof':'glass');
  }break;}
 case 'D08':{
  box(0,0,-.09,.18,.05,.18,'gold');box(0,.05,-.035,.05,.23,.07,'gold');
  const g=extrude([[0,.55],[-.05,.4],[-.08,.42],[-.09,.34],[-.025,.29],[0,.2],[.025,.29],[.09,.34],[.08,.42],[.05,.4]],.025);g.translate(0,0,-.0125);add(g,'gold');break;}
 case 'D09':{
  const s=shape([[-.175,-.175],[.175,-.175],[.175,.175],[-.175,.175]]),h=new THREE.Path();h.moveTo(-.105,-.105);h.lineTo(-.105,.105);h.lineTo(.105,.105);h.lineTo(.105,-.105);h.closePath();s.holes.push(h);const g=new THREE.ExtrudeGeometry(s,{depth:.6,bevelEnabled:false});g.rotateX(-Math.PI/2);add(g,'stone');break;}
 case 'D10':{const g=extrude([[0,0],[.5,0],[.5,.15],[.15,.15],[.15,.5],[0,.5]],.3);g.rotateX(-Math.PI/2);add(g,'stone');break;}
 case 'D11':{
  box(0,0,-.225,.45,.12,.45,'stone');box(0,.12,-.09,.18,2.16,.18);box(0,2.28,-.225,.45,.12,.45);
  beam([0,1.8,0],[.225,2.28,0],.09,.1);break;}
 case 'D12':{
  box(0,0,0,.12,.65,.035,'gold');box(0,.6,0,.045,.05,.65,'gold');
  const ring=new THREE.TorusGeometry(.045,.009,6,20);ring.translate(0,.55,.4);add(ring,'gold');
  const disc=new THREE.CylinderGeometry(.23,.23,.04,32);disc.rotateZ(Math.PI/2);disc.translate(0,.27,.4);add(disc,'roof');
  const crown=extrude([[-.12,.18],[.12,.18],[.13,.34],[.06,.27],[0,.38],[-.06,.27],[-.13,.34]],.008);crown.rotateY(Math.PI/2);crown.translate(.021,0,.4);add(crown,'gold');break;}
 default:throw Error('Unknown fitting '+item.part);
 }
 return {group,parts};
}
export function placeFitting(item,state,material){const {group,parts}=fittingGeometry(item,state);
 // Batch each static material within its moving parent; leaves retain independent pivots.
 const buckets=new Map();for(const p of parts){if(!buckets.has(p.parent))buckets.set(p.parent,new Map());const map=buckets.get(p.parent);if(!map.has(p.slot))map.set(p.slot,[]);map.get(p.slot).push(p.g.index?p.g.toNonIndexed():p.g);}
 for(const[parent,map]of buckets)for(const[slot,geos]of map){const g=new THREE.BufferGeometry();for(const key of ['position','normal']){const data=geos.flatMap(g=>Array.from(g.attributes[key].array));g.setAttribute(key,new THREE.Float32BufferAttribute(data,3));}parent.add(new THREE.Mesh(g,material(slot)));for(const g of geos)g.dispose();}
 group.position.fromArray(item.position||[0,0,0]);group.rotation.set(...(item.rotation||[0,0,0]));group.userData.item=item;return group;
}
