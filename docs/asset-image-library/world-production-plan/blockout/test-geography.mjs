import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createGeography,inside,distance,length,resample} from './geography.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(dir,n),'utf8'));
const s=read('source.json'),p=read('proposal.json'),r=read('review-data.json'),g=createGeography(s,p),checks=[];
function check(name,fn){fn();checks.push(name);}
const canonicalBytes=fs.readFileSync(path.resolve(dir,s.provenance.file)),canonical=JSON.parse(canonicalBytes);
check('Canonical layout hash, all source geometry, 34 anchors and eight cottage placements preserved',()=>{
 assert.equal(createHash('sha256').update(canonicalBytes).digest('hex'),s.provenance.sha256);
 for(const key of Object.keys(s).filter(k=>k!=='provenance'))assert.deepEqual(s[key],canonical[key],key);
 assert.deepEqual(s.extent_m,[12000,12000]);assert.equal(r.anchors.length,34);assert.equal(r.cottages.length,8);
 const palace=s.landmarks.find(b=>b.id==='B01');assert.equal(palace.width_m,2500);assert.equal(palace.depth_m,2125);
 for(const c of s.forest_cottages)assert(s.forest_districts.some(f=>inside([c.x_m,c.z_m],f.polygon_xz_m)));
});
check('River outlets reach sea, descend monotonically and avoid every building pad',()=>{
 for(const river of p.river_proposals){assert(!inside(river.points.at(-1),g.shore));assert.equal(river.levels.at(-1),0);
  for(let i=1;i<river.levels.length;i++)assert(river.levels[i]<=river.levels[i-1]);
 }
 for(const channel of [...p.river_proposals,...p.canals])for(const [x,z]of resample(channel.points,5))for(const pad of g.pads){const dx=Math.max(0,Math.abs(x-pad.x_m)-pad.width_m/2-2),dz=Math.max(0,Math.abs(z-pad.z_m)-pad.depth_m/2-2);assert(Math.hypot(dx,dz)>=channel.width_m/2,`${channel.id} clips ${pad.id}`);}
});
check('All six boat legs have continuous saltwater, four-metre hull margin and submerged bed',()=>{
 assert.equal(g.pads.length,32);assert.equal(r.boat_legs.length,6);for(const leg of r.boat_legs){assert(leg.length_m>0);for(const [x,z]of resample(leg.points,5)){assert(g.navigable(x,z,4),`${leg.id}: ${x},${z}`);assert(g.height(x,z)<-2);}}
 for(let i=1;i<r.boat_legs.length;i++)assert.deepEqual(r.boat_legs[i-1].points.at(-1),r.boat_legs[i].points[0]);
 for(const pad of g.pads)for(const [a,b]of [[0,0],[-.49,-.49],[.49,.49],[-.49,.49],[.49,-.49]]){const x=pad.x_m+a*pad.width_m,z=pad.z_m+b*pad.depth_m;assert.equal(g.waterAt(x,z),null);assert(Math.abs(g.height(x,z)-pad.level)<1e-6);}
});
function walkPath(mode,points){const ps=resample(points,.15);for(let i=0;i<ps.length;i++){const [x,z]=ps[i];assert(g.canWalk(mode,x,z),`${mode} blocked at ${x}, ${z}`);if(i&&mode==='forest'){const d=distance(ps[i-1],ps[i]),rise=Math.abs(g.forest.floor(...ps[i])-g.forest.floor(...ps[i-1]));assert(rise<=.2+d*.6,`unwalkable step ${rise}`);}}return ps;}
check('FC05 loop, entrance and return are connected, contained and traversable',()=>{
 const f=p.forest_sample;assert(Math.abs(length(f.loop)-370)<1);assert(f.loop.every(v=>Math.hypot(...v)<70));
 assert.deepEqual([g.forest.origin.x_m,g.forest.origin.z_m],[-4000,-550]);assert(Math.abs(r.forest_sample.named_pond_distance_m-806.2258)<.01);
 walkPath('forest',[[0,0],...f.entry_spur,...f.loop,...[...f.entry_spur].reverse(),[0,0]]);
 assert(!g.canWalk('forest',35,22),'pond must block walking');assert(!g.canWalk('forest',6,0),'cottage wall');assert(!g.canWalk('forest',75,0),'sample edge');
 assert(g.canWalk('forest',...f.bridge.centre),'bridge over water');assert(g.canWalk('forest',0,4.5),'cottage entrance');
 const loop=resample(f.loop,.15);let maxGrade=0;for(let i=1;i<loop.length;i++)maxGrade=Math.max(maxGrade,Math.abs(g.forest.floor(...loop[i])-g.forest.floor(...loop[i-1]))/distance(loop[i],loop[i-1]));assert(maxGrade<.35,`local loop grade ${maxGrade}`);
});
check('Bedroom source dimensions, west opening, human bed and balcony return path',()=>{
 const b=p.bedroom_sample;assert.deepEqual([b.room.width_m,b.room.depth_m,b.room.apex_m],read(b.source).parts[0].dimensions_m_proposed);assert.deepEqual(b.room,{width_m:24,depth_m:18,apex_m:18});assert.equal(b.balcony.radius_m,9);assert.equal(b.west_opening.zmax-b.west_opening.zmin,8);assert.deepEqual(b.bed.centre,[0,-6.5]);assert.equal(b.bed.width_m,2.2);
 const path=[[0,11],[0,2],[-10,2],[-14,-1],[-23,-1],[-25,-1]];walkPath('bedroom',[...path,...[...path].reverse()]);
 for(const point of [[12,0],[0,-9],[0,-6.5],[-32,-1],[-14,-5.1]])assert(!g.canWalk('bedroom',...point),`bed/wall/rail containment ${point}`);
 assert(g.canWalk('bedroom',-12,-1),'west opening');assert(g.canWalk('bedroom',0,9),'south entry');
});
check('Finite ground, dry reservations, normalized smooth region blends and honest crossing reports',()=>{
 for(let z=-6000;z<=6000;z+=125)for(let x=-6000;x<=6000;x+=125){assert(Number.isFinite(g.height(x,z)));const wet=g.waterAt(x,z);if(wet)assert(g.height(x,z)<wet.level);const blend=g.regionMix(x,z);assert(Math.abs(blend.reduce((a,b)=>a+b.weight,0)-1)<1e-6);}
 for(const route of r.routes){assert(route.return_status);for(const leg of route.local_legs||[])assert(leg.length_m<=500.001);assert.equal(route.endpoints.length,2);}assert(r.crossing_candidates.length>0);assert(r.routes.some(v=>v.length_m>6000&&v.local_leg_count_proposed>10));assert(r.issues.some(i=>i.id==='D-ACCESS'));
});
const result={status:'pass',checks,locations:r.anchors.length,cottages:r.cottages.length,forest_loop_m:r.forest_sample.loop_length_m,boat_legs:r.boat_legs.length,crossing_candidates_pending:r.crossing_candidates.length,limits:'Analytical proposed geometry and local collision checks; not full-world navigation, accepted art or final game integration'};
fs.writeFileSync(path.join(dir,'geometry-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
