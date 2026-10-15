import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createGeography} from './geography.mjs';
import {profileAt,moveAccess,contract} from './access.mjs';
const root=new URL('./',import.meta.url),read=n=>JSON.parse(fs.readFileSync(new URL(n,root))),report=read('access-review.json'),source=read('source.json'),proposal=read('proposal.json'),review=read('review-data.json'),geo=createGeography(source,proposal),checks=[];
assert.equal(crypto.createHash('sha256').update(fs.readFileSync(new URL('../../world-layout/layout.json',root))).digest('hex'),report.source_sha256);
assert.equal(report.plans.length,18);assert.equal(new Set(report.plans.map(p=>p.id)).size,18);
for(const c of review.crossing_candidates)assert(report.plans.some(p=>p.id===c.id));
assert.deepEqual(report.plans.filter(p=>p.kind==='transition').map(p=>p.id),['TR02','TR04','TR05','TR06']);
checks.push('Canonical map SHA unchanged; all 14 crossings and four flagged transitions have separate feasibility profiles');
let wet=0;for(const p of report.plans){for(let i=0;i<p.profiles.length;i++){const q=p.profiles[i];assert([q.s,q.x,q.z,q.y,q.ground].every(Number.isFinite));assert(q.y>=q.edge_ground+.049999);if(i){const a=p.profiles[i-1];assert(Math.abs(q.y-a.y)/(q.s-a.s)<=contract.max_grade+1e-8);}for(const v of [-1.6,-.8,0,.8,1.6]){const x=q.x+q.normal[0]*v,z=q.z+q.normal[1]*v,w=geo.waterAt(x,z);if(w){assert(q.y-contract.slab_m-w.level>=contract.water_headroom_m-1e-8);wet++;}assert(q.y>=geo.height(x,z)+.049999);}}if(p.protected_sites.length)assert(p.status.startsWith('Rejected'));if(!p.ties.every(t=>t.tied))assert(p.status.startsWith('Rejected'));}
checks.push(`Every profile checked at ≤2 m chainage and five transverse samples: ≤8% grade, ground clearance and ≥4.5 m provisional water headroom (${wet} wet samples)`);
const pilot=report.plans.find(p=>p.id==='FT02-C1');assert.deepEqual(pilot.protected_sites,[]);assert(pilot.ties.every(t=>t.tied));assert(pilot.max_lift_m<=25);assert(pilot.profiles.some(q=>q.water_ids.includes('WV01')));
for(let s=pilot.profiles[0].s;s<pilot.profiles.at(-1).s;s+=.5)for(const l of [-1.6,0,1.6]){const q=profileAt(pilot,s,l),w=geo.waterAt(q.x,q.z);assert(q.y>=geo.height(q.x,q.z)-.01,`Pilot intersects ground at ${s}, ${l}`);if(w)assert(q.y-contract.slab_m-w.level>=contract.water_headroom_m-1e-5);}
checks.push('West floor interpolation independently sampled every 0.5 m at centre and both deck edges');
const state={s:pilot.profiles[0].s,l:0},end=pilot.profiles.at(-1).s;let walked=0;for(const direction of [1,-1]){const goal=direction===1?end:pilot.profiles[0].s;while(Math.abs(goal-state.s)>1e-6){const ds=direction*Math.min(1,Math.abs(goal-state.s));assert(moveAccess(pilot,state,ds,0)>.99*Math.abs(ds));walked+=Math.abs(ds);}}
assert(Math.abs(walked-pilot.length_m*2)<1e-6);assert.equal(state.s,pilot.profiles[0].s);const y=profileAt(pilot,state.s).y;assert.equal(moveAccess(pilot,state,-100,0),0);moveAccess(pilot,state,0,100);assert(Math.abs(state.l)<=.950001);assert.equal(profileAt(pilot,state.s,state.l).y,y);
checks.push(`West alternate avoids every protected pad; swept 0.1 m body checks traverse ${walked.toFixed(1)} m out-and-return; deck guards and endpoint caps block escape`);
const rejected=report.plans.filter(p=>p.status.startsWith('Rejected')||p.status.startsWith('Alternative needed'));
assert(rejected.length>0);checks.push(`${rejected.length} unsuitable profiles remain visibly rejected or alternative-needed; source corridors are not marked playable`);
const result={status:'pass',checks,pilot:{id:pilot.id,length_m:pilot.length_m,return_distance_m:walked,max_grade:pilot.max_grade,max_lift_m:pilot.max_lift_m,min_soffit_clearance_m:pilot.min_soffit_clearance_m,landing_adjustments_m:pilot.ties.map(t=>t.landing_grading_m)},not_certified:'Between-station extrema, support engineering, final boat dimensions, deck joints, regional junctions, building entrances and complete world navigation remain pending'};
fs.writeFileSync(new URL('access-verification.json',root),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
