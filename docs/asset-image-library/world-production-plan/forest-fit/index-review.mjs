import fs from 'node:fs';import crypto from 'node:crypto';
const root=new URL('./',import.meta.url),records=[
 ['FC05-REVIEW-ARRIVAL','review/arrival.png','Proposed cottage exterior and clearing arrival'],
 ['FC05-REVIEW-ROOM','review/sitting-room.png','Human-scale ground sitting room and ceiling'],
 ['FC05-REVIEW-CLEARING','review/clearing.png','Existing loop, water, cottage and natural-object placements'],
 ['FC05-REVIEW-RETURN','review/clearing-return.png','Completed full clearing return to apron'],
 ['FC05-REVIEW-BIRCH','review/birch-fit.png','Selected source-family birch fit specimen'],
 ['FC05-PLAN-LOWER','plans/lower-plan.png','Actual-mesh grayscale floor projection'],
 ['FC05-PLAN-CEILING','plans/ceiling-plan.png','Actual-mesh reflected-ceiling projection'],
 ['FC05-REVIEW-CLAY','review/clay.png','Geometry inspection without source material slots'],
 ['FC05-REVIEW-MOBILE','review/mobile.png','390 px review controls and layout']
];
const images=records.map(([id,file,description])=>{const bytes=fs.readFileSync(new URL(file,root));return{id,file,description,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),status:'Engineering review capture; not a new illustrated asset sheet or accepted model reference'};});
const browser=JSON.parse(fs.readFileSync(new URL('browser-verification.json',root))),review=fs.readFileSync(new URL('review-data.json',root));
if(browser.review_data_sha256!==crypto.createHash('sha256').update(review).digest('hex'))throw Error('Browser evidence does not match current review manifest');
fs.writeFileSync(new URL('review/index.json',root),JSON.stringify({id:'FC05-REVIEW-INDEX-001',coordinate_origin:'See ../review-data.json',paths_relative_to:'forest-fit/',new_asset_sheet_count:0,images},null,2)+'\n');
console.log(`Indexed ${images.length} saved review captures; browser manifest hash matches.`);
