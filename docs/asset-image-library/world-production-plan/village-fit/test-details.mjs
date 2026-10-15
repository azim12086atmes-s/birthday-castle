import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {createVillage}from './model.mjs';import{createGeography}from '../blockout/geography.mjs';
import{createDetails}from './details-model.mjs';import{placeFitting}from './details-geometry.mjs';import{THREE,wallGeometry}from './geometry.mjs';
const root=new URL('./',import.meta.url),read=n=>JSON.parse(fs.readFileSync(new URL(n,root))),source=read('../blockout/source.json'),proposal=read('../blockout/proposal.json'),components=read('../../world-location-kits/west-lantern-forest/B12-DETAIL-001/components.json').components;
const base=createVillage(source,createGeography(source,proposal)),original=JSON.stringify({source,proposal,base}),d=createDetails(base,components),mat=()=>new THREE.MeshBasicMaterial({side:THREE.DoubleSide}),render=(p,state)=>{const g=placeFitting(p,state,mat);g.updateMatrixWorld(true);return g;},bounds=g=>new THREE.Box3().setFromObject(g),epsilon=2e-5,near=(a,b,t=epsilon)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function meshes(g){const a=[];g.traverse(o=>{if(o.isMesh)a.push(o);});return a;}
const all=d.instances.map(p=>({p,g:render(p,{doorOpen:true,shuttersOpen:true})})),ray=(g,from,dir)=>new THREE.Raycaster(new THREE.Vector3(...from),new THREE.Vector3(...dir)).intersectObjects(meshes(g),false);
const checks=[],pass=s=>checks.push(s);
assert.equal(new Set(d.instances.map(p=>p.part)).size,11);assert.equal(d.unmounted[0].part,'D09');
assert.ok(!d.instances.some(p=>p.part==='D09'));pass('11 fitting types mounted; hollow D09 explicitly withheld pending shaft and roof/flue opening');
for(const {p,g}of all){const b=bounds(g);assert.ok(Number.isFinite(b.min.x)&&b.max.y>b.min.y);if(p.part==='D03'){
 const o=p.opening;near(b.min.x,o.centre-.6);near(b.max.x,o.centre+.6);near(b.min.y,o.sill);near(b.max.y,o.sill+1.4);
 // Back-to-front insert remains entirely within the 0.3 m wall reveal on both facings.
 const n=o.face_sign;const distances=[b.min.z,b.max.z].map(z=>(z-o.at)*n);assert.ok(Math.min(...distances)>=-.15-epsilon&&Math.max(...distances)<=.15+epsilon);
 const wall=base.walls.find(w=>w.id===p.host),wm=new THREE.Mesh(wallGeometry(wall,base.openings),mat());wm.updateMatrixWorld(true);
 assert.equal(ray(wm,[o.centre,o.sill+.5,o.at+n], [0,0,-n]).length,0);assert.ok(ray(g,[o.centre+.2,o.sill+.5,o.at+n],[0,0,-n]).length>0);
 }if(['D01','D06','D12'].includes(p.part)){
  const n=p.opening?.face_sign||1,normalDistances=[b.min.z,b.max.z].map(z=>(z-p.position[2])*n);near(Math.min(...normalDistances),0);
 }if(p.part==='D11'){near(b.min.y,0);near(b.max.y,2.4);}
 if(p.part==='D08')near(b.min.y,8);
 if(p.part==='D10')near(b.min.y,0);
 if(p.part==='D07'){
  const slope=p.id.endsWith('0')?2.8/3:-2.8/3;let min=Infinity,max=-Infinity;
  for(const m of meshes(g)){const a=m.geometry.attributes.position;for(let i=0;i<a.count;i++){const v=new THREE.Vector3().fromBufferAttribute(a,i).applyMatrix4(m.matrixWorld),plane=p.position[1]+slope*(v.x-p.position[0]),offset=(v.y-plane)/Math.sqrt(1+slope*slope);min=Math.min(min,offset);max=Math.max(max,offset);}}
  near(min,0);assert.ok(max<=.08+epsilon); // Normal mounting, not a horizontal patch on a slope.
 }
}
pass('Evaluated meshes: window extents/reveals and opposite-facing mounts, wall backs, floor/post bearings, ridge socket and both tile-slope contacts pass');
for(const side of [0,1]){const pieces=d.instances.filter(p=>p.id.startsWith(`GABLE-TRIM-${side}-`));near(pieces.reduce((s,p)=>s+p.length,0),Math.hypot(3,2.8));assert.deepEqual(pieces.slice(0,2).map(p=>p.length),[1.8,1.8]);assert.ok(pieces[2].terminal);}
pass('Each gable slope uses 2 × 1.8 m stock and one exact short terminal; no scaling or duplicate roof end closure');
for(const {p,g}of all.filter(p=>p.p.part==='D02'))near(bounds(g).min.z,-5.85);
for(const rear of [false,true]){
 const g=all.find(p=>p.p.id===`FOUNDATION-CORNER-${rear?1:0}`).g;
 const front=ray(g,[18.05,.15,rear?-15.1:-5.9],[0,0,rear?-1:1]);assert.ok(front.length);near(front[0].distance,.05);
 const side=ray(g,[18,.15,rear?-14.95:-6.05],[-1,0,0]);assert.ok(side.length);near(side[0].distance,.15);
}
pass('Actual bargeboard backs meet the terminal gable face; both L-shaped foundation corners meet each of their two exterior wall faces');
// Shutter halves share one continuous outer arch when shut, while retaining separate hinge parents.
const shutter=d.instances.find(p=>p.part==='D04'),closed=render(shutter,{shuttersOpen:false}),cb=bounds(closed);near(cb.max.x-cb.min.x,1.2);assert.ok(closed.getObjectByName('left-leaf')&&closed.getObjectByName('right-leaf'));
for(const x of [22.05,22.95])assert.ok(ray(closed,[x,1.1,-4],[0,0,-1]).length>0);
const planter=all.find(p=>p.p.part==='D06'&&p.p.layer==='lower'),centre=planter.p.position;assert.equal(ray(planter.g,[centre[0]+.09,centre[1]+.2,centre[2]+.175],[0,-1,0]).length,0); // Central drain gap traverses the trough.
assert.ok(ray(planter.g,[centre[0],centre[1]+.2,centre[2]+.175],[0,-1,0]).length>0);
const pot=render({part:'D09'}),hits=ray(pot,[0,1,0],[0,-1,0]);assert.equal(hits.length,0);assert.ok(ray(pot,[.14,1,0],[0,-1,0]).length>0);
pass('Shutters are two hinged half-arch leaves; planter has cavity/drain gaps; isolated chimney has a through-bore');
const walks={};for(const[name,ps]of Object.entries(base.routes)){const state={x:ps[0][0],z:ps[0][1]};let distance=0;for(const q of ps.slice(1)){const dx=q[0]-state.x,dz=q[1]-state.z,want=Math.hypot(dx,dz),got=d.move(state,dx,dz);near(got,want,1e-6);distance+=got;}near(state.x,ps[0][0]);near(state.z,ps[0][1]);walks[name]=distance;}
assert.equal(d.canStand(19.5,-6),true);assert.equal(d.setDoor(false,{x:19.5,z:-6}),false);assert.equal(d.doorOpen,true);
assert.equal(d.setDoor(false,{x:14,z:0}),true);assert.equal(d.canStand(19.5,-6),false);const stopped={x:19.5,z:0};d.move(stopped,0,-9);assert.ok(stopped.z>-5.35);d.setDoor(true);
assert.equal(d.setDoor(false),true);assert.equal(d.setDoor(true,{x:19.5,z:-5.33197894736842}),true); // Safe front-of-leaf interaction, previously rejected by a 20 mm guard margin.
assert.equal(d.canStand(18.65,-4.65),false);assert.equal(d.canStand(22.5,-5.5),false);assert.equal(d.canStand(22.5,5.5),false);
assert.equal(d.canStand(19.5,-6,.45,1.9),false);assert.equal(d.canStand(0,0),true);
pass('All three complete free-XZ returns pass with open door and fittings; closed door, porch posts, both planters and narrow-door headroom block movement; swing guard rejects closing on player');
assert.equal(JSON.stringify({source,proposal,base}),original);pass('Canonical geography, source components, source model, wide entry and primary arrival remain unchanged');
const report={status:'pass',source_sheet_sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL('../../world-location-kits/west-lantern-forest/B12-DETAIL-001/B12-DETAIL-001.png',root))).digest('hex'),instances:d.instances.length,mounted_types:11,unmounted:d.unmounted,checks,walks,exceptions:d.exceptions,limits:'Function fit specimens only, not final art/carving, Blender Form acceptance or production performance'};
fs.writeFileSync(new URL('details-verification.json',root),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
