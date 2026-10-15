import fs from 'node:fs';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import{createVillage}from '../model.mjs';import{createDetails}from '../details-model.mjs';import{createGeography}from '../../blockout/geography.mjs';import{createRoofStudy}from './model.mjs';import{THREE,buildRoofGeometry}from './geometry.mjs';import{wallGeometry}from '../geometry.mjs';
const root=new URL('./',import.meta.url),read=p=>JSON.parse(fs.readFileSync(new URL(p,root))),source=read('../../blockout/source.json'),proposal=read('../../blockout/proposal.json'),v=createVillage(source,createGeography(source,proposal)),original=JSON.stringify({source,proposal,v}),m=createRoofStudy(v),scene=buildRoofGeometry(m,()=>new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
const checks=[],pass=s=>checks.push(s),near=(a,b,t=3e-5)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`),obj=id=>{assert.ok(scene.objects.has(id),id);return scene.objects.get(id);},meshes=root=>{const a=[];root.traverse(o=>{if(o.isMesh)a.push(o);});return a;},ray=(objects,p,d)=>new THREE.Raycaster(new THREE.Vector3(...p),new THREE.Vector3(...d)).intersectObjects(objects.flatMap(o=>meshes(o))),bbox=id=>new THREE.Box3().setFromObject(obj(id));
const roofs=meshes(scene.groups.roof),construction=meshes(scene.groups.construction),pot=meshes(scene.groups.pot);
for(const dx of [-.08,0,.08])for(const dz of [-.08,0,.08])assert.equal(ray([...roofs,...construction,...pot],[m.shaft.x+dx,12,m.shaft.z+dz],[0,-1,0]).length,0);
near(bbox('MOUNTED-D09').min.y,8.1);near(bbox('MOUNTED-D09').max.y,8.7);near(bbox('MOUNTED-D09').max.x-bbox('MOUNTED-D09').min.x,.35);
for(const [dx,dz]of [[.15,0],[-.15,0],[0,.15],[0,-.15]])near(ray([obj('VENT-CROWN-SEAT')],[m.shaft.x+dx,8.1+.001,m.shaft.z+dz],[0,-1,0])[0].distance,.001);
pass('Saved D09 dimensions retained; pot underside touches crown seat; nine vertical probes pass through the real continuous 0.21 m pot/shaft bore into the loft');
for(const z of [-12.2,-12,-11.8]){
 for(const dx of [-.3,.3])assert.equal(ray(roofs,[m.shaft.x+dx,12,z],[0,-1,0]).length,0);
 for(const dx of [-.35,.35])assert.ok(ray(roofs,[m.shaft.x+dx,12,z],[0,-1,0]).length);
}
assert.equal(ray([obj('BACKER-18--12')],[m.shaft.x,12,m.shaft.z],[0,-1,0]).length,0);
pass('RF01 actually cuts both roof repeats and their seam backer; 50 mm shaft clearance remains open without hidden roof or backing infill');
// Compare evaluated surfaces at four shaft-bearing locations, independent of metadata bounds.
for(const [dx,dz]of [[.24,.20],[-.24,.20],[.20,-.24],[-.20,-.24]]){
 const x=m.shaft.x+dx,z=m.shaft.z+dz,top=ray([obj('VENT-BEARING-COLLAR')],[x,12,z],[0,-1,0])[0].point.y;
 const shaftHits=ray([obj('VENT-SHAFT-P01')],[x,12,z],[0,-1,0]);near(shaftHits.at(-1).point.y,top);
}
for(const r of m.rafters){const x=19.95,z=(r.zmin+r.zmax)/2,hits=ray([obj(r.id)],[x,12,z],[0,-1,0]);near(hits[0].point.y,m.roofY(x)-.15);near(hits.at(-1).point.y,m.roofY(x)-.35);}
pass('Inclined shaft bearing matches its support collar; two upslope rafters meet the roof underside and seat into existing eave/ridge support geometry');
// All cut roof shells must be closed after vertex welding, including notches at repeat boundaries.
function manifold(mesh){const g=mesh.geometry,p=g.attributes.position,index=g.index,edges=new Map(),vertex=i=>[p.getX(i),p.getY(i),p.getZ(i)].map(n=>Math.round(n*1e5)).join(',');for(let i=0;i<(index?index.count:p.count);i+=3){const ids=[0,1,2].map(k=>vertex(index?index.getX(i+k):i+k));for(let k=0;k<3;k++){const key=[ids[k],ids[(k+1)%3]].sort().join('|');edges.set(key,(edges.get(key)||0)+1);}}assert.ok([...edges.values()].every(n=>n===2),mesh.name);}
for(const r of roofs)manifold(r);
assert.equal(ray(roofs,[21,6.5,-16],[0,0,1]).length,0);pass('Every cut roof repeat is a closed thin shell after welding; thin repeat end bands do not become solid gable infill');
const walls=meshes(scene.groups.walls);for(const z of [-6,-15])assert.equal(ray(walls,[24.05,5.1,z-1],[0,0,1]).filter(h=>h.distance<2).length,0);
const baselineWall=v.walls.find(w=>w.id==='H-N-18-UPPER-GABLE'),baselineMesh=new THREE.Mesh(wallGeometry(baselineWall,v.openings),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));baselineMesh.updateMatrixWorld(true);assert.ok(ray([baselineMesh],[23.95,5.1,-7],[0,0,1]).length);
for(const w of m.walls.filter(w=>w.axis==='z'&&w.at===24&&w.base===2.6))near(w.base+w.height,4.9);
pass('RF03 cuts real front/rear wall and gable corners; shared party-wall caps stop below the valley instead of damming its outlet');
for(let i=0;i<=40;i++){const z=m.valley.rear+.00001+(m.valley.front-m.valley.rear-.00002)*i/40,hit=ray([obj(m.valley.id)],[24,10,z],[0,-1,0])[0];near(hit.point.y,m.valley.floorAt(z));assert.ok(hit.point.y-m.valley.thickness-4.9>.07);}
near(m.valley.floorAt(m.valley.rear)-m.valley.floorAt(m.valley.front),.096);
for(let i=1;i<m.flow.length;i++)assert.ok(m.flow[i][1]<=m.flow[i-1][1],JSON.stringify(m.flow[i]));
assert.equal(ray([obj(m.pipe.id)],[m.pipe.x,m.pipe.top+.1,m.pipe.z],[0,-1,0]).length,0);
assert.equal(ray([...meshes(scene.groups.ground),obj('SUMP-WALLS')],[24,1,m.pipe.z],[0,-1,0]).length,0);near(ray([obj('SUMP-BASE')],[24,1,m.pipe.z],[0,-1,0])[0].point.y,-.14);
assert.ok(m.pipe.top<m.valley.floorAt(m.valley.front));pass('Valley has 96 mm continuous fall and >70 mm soffit clearance over its wall cap; downpipe inlet has no raised lip, bore is open and the real sump cavity is not covered by ground');
// Coverage is measured against actual geometry. The open pot bore is intentionally excluded.
const weather=[...roofs,...[...scene.objects.entries()].filter(([id])=>/^(VENT-FLASHING|VENT-SHAFT|VENT-CROWN|RIDGE-CAP|BACKER)/.test(id)).flatMap(([,o])=>meshes(o)),...pot,...meshes(scene.groups.drain)];let rainProbes=0;
for(let x=18.1;x<30;x+=.2)for(let z=-14.9;z<-6;z+=.3){if(Math.abs(x-m.shaft.x)<.106&&Math.abs(z-m.shaft.z)<.106)continue;assert.ok(ray(weather,[x,12,z],[0,-1,0]).length,`Uncovered roof sample ${x},${z}`);rainProbes++;}
pass(`${rainProbes} vertical roof coverage probes hit geometry outside the declared open vent bore; this is geometric coverage, not waterproofing evidence`);
const d=createDetails(v,read('../../../world-location-kits/west-lantern-forest/B12-DETAIL-001/components.json').components),walks={};
for(const [name,points]of Object.entries(v.routes)){const p={x:points[0][0],z:points[0][1]};let distance=0;for(const q of points.slice(1)){const dx=q[0]-p.x,dz=q[1]-p.z,want=Math.hypot(dx,dz);near(d.move(p,dx,dz),want,1e-6);distance+=want;}walks[name]=distance;
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b[0]-a[0],dz=b[1]-a[1],len2=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((24-a[0])*dx+(m.pipe.z-a[1])*dz)/len2));assert.ok(Math.hypot(a[0]+dx*t-24,a[1]+dz*t-m.pipe.z)>.45+.25);}}
assert.equal(JSON.stringify({source,proposal,v}),original);pass('Source map, houses, windows, doors and route definitions unchanged; all three fitting-model returns pass and avoid the proposed sump/downpipe envelope');
const result={status:'pass',checks,rain_probes:rainProbes,walks,openings:[m.penetration.id,m.cuts[1].id,...m.scuppers.map(s=>s.id)],report_sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL('review-data.json',root))).digest('hex'),limits:m.exceptions};
fs.writeFileSync(new URL('geometry-verification.json',root),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
