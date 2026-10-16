import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {createRose,sampleRoute} from './model.mjs';
import {THREE,buildRose} from './geometry.mjs';
const dir=new URL('./',import.meta.url),read=p=>JSON.parse(fs.readFileSync(new URL(p,dir))),handoff=read('../rose-keep/asset-handoff.json'),shared=read('../kit-fit/contract.json'),snapshot=JSON.stringify({handoff,shared}),m=createRose(handoff,shared),f=buildRose(m),checks=[];
const pass=s=>checks.push(s),near=(a,b,t=4e-5)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`),bounds=id=>new THREE.Box3().setFromObject(f.objects.get(id));
f.root.updateMatrixWorld(true);
const ray=(group,from,direction,far=20)=>new THREE.Raycaster(new THREE.Vector3(...from),new THREE.Vector3(...direction),0,far).intersectObject(group,true);
f.root.traverse(o=>{if(o.isMesh)for(const name of['position','normal'])assert.ok(o.geometry.attributes[name].array.every(Number.isFinite),`${o.name} / ${name}`);});
const budget=f.counts();assert.ok(budget.triangles<20000&&budget.mesh_draws<100);pass('All mesh positions/normals are finite; complete fixture below 20000 triangles and 100 mesh draws');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../../world-layout/layout.json',dir))).digest('hex'),handoff.preservation.world_layout_sha256);
const treadBounds=Array.from({length:10},(_,i)=>bounds(`TREAD-${i+1}`));assert.equal([...f.objects.keys()].filter(k=>k.startsWith('TREAD-')).length,10);
for(let i=0;i<10;i++){const b=treadBounds[i];near(b.max.y,(i+1)*.15);near(b.max.z,-i*.3);near(b.min.z,-(i+1)*.3);near(b.max.x-b.min.x,2.8);if(i)near(b.max.z,treadBounds[i-1].min.z,1e-6);}
near(bounds('TOP-LANDING').min.z,-5.8);near(bounds('TOP-LANDING').max.z,-3);near(bounds('TERRACE').max.y,1.5);near(bounds('TERRACE').min.y,0);near(bounds('ENTRANCE-WALL').max.y,7.5);pass('Ten actual 0.15 m risers and 0.30 m treads match K09; landing, terrace and wall sizes match the handoff');
for(const x of[-.7,0,.7])for(const h of[.2,1.6,3])assert.equal(ray(f.layers.walls,[x,1.5+h,-10.5],[0,0,-1],2).length,0,`Infill at aperture ${x},${h}`);
const solid=ray(f.layers.walls,[2,3.1,-10.5],[0,0,-1],2);assert.ok(solid.length);near(solid[0].point.z,-11.2);assert.ok(solid[0].face.normal.z>.99);assert.ok(ray(f.layers.walls,[0,5.4,-10.5],[0,0,-1],2).length);
assert.equal(m.canStand(0,-11.5),true);assert.equal(m.canStand(0,-11.5,1.25),false);assert.equal(m.canStand(0,-11.5,.45,4),false);pass('Wall and both separate arch specimens have a real through-aperture; side wall/lintel remain solid, and oversized bodies cannot pass');
// Contact ray excludes the wall itself, so a hidden floating return cannot satisfy support.
const contact=ray(f.layers.supports,[4.3,1.51,-9.8],[0,-1,0],.1);assert.ok(contact.length);near(contact[0].point.y,1.5);assert.ok(bounds('RETURN-FOOTING').max.x>=bounds('WALL-RETURN').max.x);near(bounds('TERRACE-BASE').max.y,bounds('TERRACE').min.y);pass('Return wall has physical footing coverage beyond the terrace; deck underside meets the separate base');
const routes=Object.fromEntries(Object.entries(m.routes).map(([k,ps])=>[k,m.auditRoute(ps)]));for(const r of Object.values(routes)){assert.equal(r.status,'pass',JSON.stringify(r));near(r.max_floor_m,1.5);assert.ok(r.max_step_m<=.15+1e-6);near(r.end.x,0);near(r.end.z,2.5);}
let floorProbes=0;for(const ps of Object.values(m.routes))for(const[x,z]of sampleRoute(ps,.10)){const floor=m.surface(x,z);assert.ok(m.canStand(x,z));
 // At an exact riser, canonical Float64 coordinates and Float32 mesh edges can select opposite sides by <1 micrometre.
 // Probe 10 micrometres into the declared upper tread; seam endpoints are separately checked above to 1 micrometre.
 const atRiser=z<=0&&z>=-3&&Math.abs(z/.3-Math.round(z/.3))<1e-6,probeZ=atRiser?z-.00001:z;
 const hits=ray(f.layers.floors,[x,floor.y+.2,probeZ],[0,-1,0],.5);assert.ok(hits.length,`Missing drawn floor ${x},${z}`);near(hits[0].point.y,floor.y,.002);floorProbes++;}pass('Both full returns pass the swept controller; every route sample has matching drawn floor support, with exact-riser probes displaced 10 micrometres into the upper tread');
assert.equal(m.canStand(1.4,-4.4),false);assert.equal(m.canStand(.9,-4.4),false);assert.equal(m.canStand(0,-5.8),true);assert.equal(m.canStand(0,-11.5),true);
const p={x:2,z:-10};m.move(p,0,-50);assert.ok(p.z>-10.76);const q={x:2,z:-9};m.move(q,50,0);assert.ok(q.x<3.46);const edge={x:0,z:-4.4};m.move(edge,50,0);assert.ok(edge.x<.76);
f.layers.guards.visible=false;assert.equal(m.canStand(.9,-4.4),false);f.layers.guards.visible=true;pass('Inactive side outlet, wall returns and raised edges block large-delta movement; hiding guard art leaves containment intact');
assert.equal(JSON.stringify({handoff,shared}),snapshot);pass('Canonical input objects and the world-layout hash remain unchanged');
const report={status:'pass',checks,routes,floor_ray_probes:floorProbes,complete_geometry:budget,opening:{width_m:m.doorway.width,depth_m:m.doorway.zmax-m.doorway.zmin,spring_m:m.doorway.spring,apex_m:m.doorway.apex},world_layout_unchanged:true,scope:m.scope};fs.writeFileSync(new URL('geometry-verification.json',dir),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,routes,floor_ray_probes:floorProbes,budget},null,2));
