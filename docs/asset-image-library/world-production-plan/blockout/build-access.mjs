import fs from 'node:fs';
import {createGeography} from './geography.mjs';
import {createAccessPlans,contract} from './access.mjs';
const root=new URL('./',import.meta.url),read=n=>JSON.parse(fs.readFileSync(new URL(n,root)));
const source=read('source.json'),proposal=read('proposal.json'),review=read('review-data.json'),ecology=read('terrain-ecology-report.json');
const plans=createAccessPlans(createGeography(source,proposal),source,review,ecology);
fs.writeFileSync(new URL('access-review.json',root),JSON.stringify({schema_version:1,source_sha256:review.source_sha256,contract,status:'Proposed connector profiles; source terrain, routes, anchors and reference art unchanged',plans})+'\n');
console.table(plans.map(p=>({id:p.id,length:p.length_m.toFixed(0),grade:(p.max_grade*100).toFixed(1),lift:p.max_lift_m.toFixed(1),clearance:p.min_soffit_clearance_m?.toFixed(1),ties:p.ties.every(t=>t.tied),sites:p.protected_sites.join(',')})));
