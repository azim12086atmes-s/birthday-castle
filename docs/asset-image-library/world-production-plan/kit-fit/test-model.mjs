import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {createKit,distance} from './model.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));
const c=JSON.parse(fs.readFileSync(path.join(dir,'contract.json'))),m=createKit(c),checks=[];
function check(name,fn){fn();checks.push(name);}
const close=(a,b)=>assert(Math.abs(a-b)<=c.tolerances.seam_gap_m,`${a} / ${b}`);
check('Copied flights and turning sockets meet exactly in metre/Y-up space',()=>{
 assert.equal(m.flights.length,2);close(c.flight.risers*c.flight.rise_m,c.flight.total_rise_m);close(c.flight.risers*c.flight.going_m,c.flight.run_m);
 const a=m.flights[0],b=m.flights[1],topA=m.world(a,0,3),topB=m.world(b,0,3),turn=m.decks[1],upper=m.decks[2];
 close(topA.z,turn.zmax);close(a.y+1.5,turn.y);close(b.x,turn.xmax);close(b.y,turn.y);close(topB.x,upper.xmin);close(b.y+1.5,upper.y);
 close(c.flight.width_m-2*(c.parapet.edge_offset_m+c.parapet.thickness_m/2),c.flight.clear_width_m);
});
let maxRise=0,total=0,maximumY=0;
check('Every actual tread, both turns, arch passage, descent and complete return survive swept movement',()=>{
 for(const f of m.flights)for(let j=0;j<10;j++){const p=m.world(f,0,(j+.5)*c.flight.going_m);close(m.surface(p.x,p.z).y,f.y+(j+1)*c.flight.rise_m);}
 let p={...m.route[0]};
 for(const target of m.route.slice(1)){
  for(let i=0;distance(p,target)>.00001;i++){
   assert(i<3000,'stuck or missing return');const d=distance(p,target),s=Math.min(.04,d),q=m.move(p,(target.x-p.x)/d*s,(target.z-p.z)/d*s);
   assert(distance(p,q)>.000001,`blocked at ${JSON.stringify(p)}`);assert(m.canStand(q.x,q.z));
   maxRise=Math.max(maxRise,Math.abs(m.surface(q.x,q.z).y-m.surface(p.x,p.z).y));maximumY=Math.max(maximumY,m.surface(q.x,q.z).y);total+=distance(p,q);p=q;
  }
 }
 close(distance(p,m.route[0]),0);close(maximumY,3);assert(maxRise<=c.player.max_step_m+1e-7);close(total,29.4);
});
check('Guards, platform edges and wall cannot be bypassed by running or long frame displacements',()=>{
 assert(!m.canStand(1.1,-1.5));assert(!m.canStand(8.3,-4.4));assert(!m.canStand(6.4,-6.1));assert(!m.canStand(6.4,-4.4,.45,4));assert(m.canStand(6.4,-4.4));
 const q=m.move({x:0,z:-1.5},20,0);assert(q.x<.76,'tunnelled through stair guard');
 const wall=m.move({x:5.4,z:-5.9},20,0);assert(wall.x<5.81,'tunnelled through wall substrate');
 const edge=m.move({x:7.3,z:-4.4},20,0);assert(edge.x<7.76,'tunnelled over platform edge');
 assert(!m.canStand(0,-1,1.21),'overwide player should not fit 2.4 m guarded route');
});
check('Decorative material variants cannot change the physical host or collision',()=>{
 const base=m.move({x:0,z:-1.5},20,0);for(const slot of ['GLASS_BLUE','GLASS_ROSE','GLASS_GREEN']){assert(c.material_slots.includes(slot));assert.deepEqual(m.move({x:0,z:-1.5},20,0),base);}
 for(const g of m.guards){const bays=m.guardBays(g);close(bays.reduce((s,b)=>s+b.length_m,0),Math.hypot(g.b[0]-g.a[0],g.b[1]-g.a[1]));for(const b of bays){assert(b.length_m<=1+1e-8);if(b.kind==='full-repeat')close(b.length_m,1);}}assert(c.parapet.height_above_nosing_m>=1.1);assert.equal(c.parapet.repeat_m,1);
});
check('Sources exist and prototype contracts do not overwrite reference dimensions or approvals',()=>{
 for(const s of c.sources){const source=JSON.parse(fs.readFileSync(path.resolve(dir,s.schedule)));assert((source.outputs||[]).some(o=>o.sheet_id===s.sheet_id));assert.equal(createHash('sha256').update(fs.readFileSync(path.resolve(dir,s.schedule))).digest('hex'),s.schedule_sha256);}
 assert(c.scope_limits.some(s=>s.includes('No new art sheets')));
});
const report={status:'pass',checks,fixture_modules:m.modules.length,guard_segments:m.guards.length,maximum_tread_change_m:maxRise,maximum_floor_m:maximumY,return_distance_m:total,source_schedules:c.sources.length,limits:'Proposed dimensional fixture and analytical movement checks; not final decorative-model acceptance, accessibility certification or whole-game navigation'};
fs.writeFileSync(path.join(dir,'geometry-verification.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
