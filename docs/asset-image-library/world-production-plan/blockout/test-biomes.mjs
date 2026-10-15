import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createGeography,inside,nearLine,distance,resample,length} from './geography.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const read=n=>JSON.parse(fs.readFileSync(path.join(dir,n)));
const s=read('source.json'),p=read('proposal.json'),g=createGeography(s,p),report=read('terrain-ecology-report.json'),checks=[];
function check(name,fn){fn();checks.push(name);}
check('Seven ground regions and separate sky recipe respect source anchor region assignments',()=>{
 assert.equal(report.location_assignments.length,34);assert.equal(new Set(report.location_assignments.map(p=>p.id)).size,34);assert.equal(g.biomes.regions.length,8);for(const b of s.landmarks)assert.equal(g.regionMix(b.x_m,b.z_m)[0].id,b.terrain_region_id,b.id);
 for(const f of s.forest_districts){const [x,z]=f.polygon_xz_m.reduce((a,b)=>[a[0]+b[0]/f.polygon_xz_m.length,a[1]+b[1]/f.polygon_xz_m.length],[0,0]);assert.equal(g.regionMix(x,z)[0].id,'T05');}
 for(const r of g.biomes.regions){assert(r.ground.length&&r.flora.length&&r.fauna.length&&r.source_ids.length);}
 for(let z=-5000;z<5000;z+=333)for(let x=-5000;x<5000;x+=333){const a=g.regionMix(x,z),b=g.regionMix(x+1,z);assert.equal(a.length,7);assert(!a.some(v=>v.id==='T08'));assert(Math.abs(a.reduce((a,b)=>a+b.weight,0)-1)<1e-8);for(const r of a)assert(Math.abs(r.weight-b.find(v=>v.id===r.id).weight)<.02);}
});
check('Regional terrain adds distinct ridges, saddle and gully while retaining finite heights and source dimensions',()=>{
 assert(g.biomes.relief(-300,-4100)>15);assert(g.biomes.relief(3900,-3700)>25);assert(g.biomes.relief(2100,2150)<0);
 assert.equal(g.biomes.transitions.length,6);assert.equal(report.transition_sections.length,6);
 assert(report.land_area_estimate_km2>0&&report.land_area_estimate_km2<144);assert.equal(report.world_m[0],12000);
 for(const t of report.transition_sections)assert(t.width_m>0&&t.profile.every(v=>Number.isFinite(v.height_m)));
});
check('FC05 micro-relief retains the loop, aligns a 150 mm threshold and matches world terrain at tile edges',()=>{
 for(const [x,z]of resample(p.forest_sample.loop,.25)){assert(Math.abs(g.habitats.relief(x,z))<1e-12);assert(g.canWalk('forest',x,z));}
 assert(g.habitats.relief(30,-20)>.3);assert(Math.abs(g.habitats.relief(0,4.5))<1e-12);
 assert(Math.abs(g.forest.floor(0,0)-g.height(g.forest.origin.x_m,g.forest.origin.z_m)-.15)<1e-8);for(const [x,z]of [[75,0],[-75,0],[0,75],[0,-75],[75,75],[-75,-75]])assert(Math.abs(g.forest.height(x,z)-g.height(g.forest.origin.x_m+x,g.forest.origin.z_m+z))<1e-8);assert.equal(g.habitats.zoneAt(0,0).id,'H01');assert.equal(g.habitats.zoneAt(35,22).id,'H05');assert.equal(g.habitats.zoneAt(-30,-15).id,'H03');
 assert.equal(g.habitats.zoneAt(26,-20).id,'H04');assert.equal(g.habitats.zoneAt(-60,0).id,'H06');
 assert(Math.abs(length(p.forest_sample.loop)-370)<1);assert(Math.abs(report.FC05.named_pond_distance_m-806.2258)<.01);
});
check('Seeded placement envelopes keep water, entrance and walk envelope clear with actual blocker collision',()=>{
 const duplicate=createGeography(s,p);assert.deepEqual(g.habitats.objects,duplicate.habitats.objects);assert.equal(g.habitats.objects.length,94);
 for(const o of g.habitats.objects){assert.equal(o.y,g.forest.height(o.x,o.z));if(o.kind!=='reed'){assert(!g.forest.water(o.x,o.z));assert(g.habitats.pathDistance(o.x,o.z)>=2.3+o.radius);}
  if(o.block)assert(!g.canWalk('forest',o.x,o.z));if(['broadleaf','birch'].includes(o.kind))assert(o.crown_base_m>=2.6);
 }
 for(const station of g.habitats.faunaStations){assert(g.canWalk('forest',...station.point));assert(g.habitats.pathDistance(...station.point)<1e-6);}
});
const result={status:'pass',checks,regions:8,ground_regions:7,transitions:6,placement_envelopes:g.habitats.objects.length,fauna_observation_markers:g.habitats.faunaStations.length,limits:'Proposed biome/terrain and placement geometry; no accepted flora meshes, fauna simulation, final navigation or ecological certification'};
fs.writeFileSync(path.join(dir,'biome-verification.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
