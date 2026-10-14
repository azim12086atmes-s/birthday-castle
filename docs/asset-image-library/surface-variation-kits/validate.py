"""Check source pixels, file/ID integrity and caps; not image fidelity or physical fit."""
from pathlib import Path
import json,csv,re,hashlib,collections
from PIL import Image,ImageChops
P=Path(__file__).resolve().parent;R=P.parent
load=lambda p:json.loads(p.read_text());sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
m=load(R/'manifest.json');a=load(R/'asset-register.json');b=load(R/'production-budget.json');plan=load(P/'plan.json');aliases=load(P/'model-id-aliases.json')
images={x['id']:x for x in m['images']};assets={x['asset_id']:x for x in a['assets']};batches={x['batch_id']:x for x in a['generation_batches']}
assert len(images)==m['distinct_image_count']==len(m['images']);assert len(assets)==len(a['assets']);assert len(batches)==len(a['generation_batches'])
assert len({x['sha256'] for x in m['images']})==len(m['images'])
for e in m['images']:
 f=R/e['file'];assert f.is_file() and sha(f)==e['sha256'] and f.stat().st_size==e['bytes'],e['id']
assert m['total_bytes']==sum(x['bytes'] for x in m['images'])
assert m['categories']==dict(sorted(collections.Counter(x['category'] for x in m['images']).items()))
assert all(f'GEN-{i:02}' in images for i in range(1,46))
panels=load(P/'source-panels/index.json')['panels'];wish=load(P/'wishing-source-audit/index.json')['objects']
for x in panels+wish:
 source=Image.open(R/x['source_file']).convert('RGB');actual=Image.open(R/x['file']).convert('RGB');expected=source.crop(x['source_box_xyxy']);assert actual.size==expected.size and ImageChops.difference(actual,expected).getbbox() is None,x['file'];assert sha(R/x['source_file'])==x['source_sha256'];assert sha(R/x['file'])==x['sha256']
assert len(plan['planned_sheets'])==7 and len(wish)==8
ids=[]
for entry in plan['planned_sheets']:
 sid=entry['sheet_id'];s=load(P/sid/'schedule.json');assert s['models_generated']==0 and not s['actual_geometry_or_texture_seams_verified'];assert len(s['parts'])==(4 if sid=='PAL-STAIR-VAR-001' else 16);assert len(s['outputs'])==1
 assert sha(R/s['source_reference_file'])==s['source_reference_sha256'];out=s['outputs'][0];assert sha(R/out['file'])==out['sha256'];assert sha(R/out['actual_input_file'])==out['actual_input_sha256'];assert sha(Path(out['original_file']))==out['sha256'] if Path(out['original_file']).exists() else True
 slot=next(x for x in b['selected_slots'] if x['sheet_id']==sid);assert slot['sha256']==out['sha256'] and slot['file']==out['file'];assert slot['generation_attempts_in_this_pass']<=2
 for part in s['parts']:
  id=part['asset_id'];ids.append(id);x=assets[id];assert x['model_status']=='unregistered' and not x['model_file'];assert x['reference_sha256']==images[sid]['sha256'];assert x['source_reference_id'] in images;assert all(i in assets for i in x['reuse_component_ids']);assert all(d>0 for d in x['dimensions_m_proposed']);assert x['attachment_face'] and x['semantic_front']
 assert batches[sid]['expected_component_ids']==[x['asset_id'] for x in s['parts']]
 for old in s.get('previous_attempts',[]):assert sha(R/old['file'])==old['sha256']
assert len(ids)==len(set(ids))==100
for alias,canonical in aliases.items():assert canonical in assets and alias not in assets and alias in assets[canonical]['alias_ids']
assert len(aliases)==16
for x in wish:assert x['asset_id'] in assets and assets[x['asset_id']]['model_status']=='unregistered'
assert len({x['category_id'] for x in load(P/'palace-needs.json')['categories']})==20
assert b['total_final_sheet_cap']==230 and sum(b['global_caps'].values())==230 and sum(f['cap'] for f in b['palace_family_caps'])==b['global_caps']['palace']
assert len(b['selected_slots'])<=230
for owner,cap in b['global_caps'].items():assert sum(x['owner']==owner for x in b['selected_slots'])<=cap
for f in b['palace_family_caps']:assert len(f['existing_ids'])+sum(x.get('family')==f['family'] for x in b['selected_slots'])<=f['cap']
assert not any(x['sheet_id'] in plan['parked_sheet_ids'] for x in b['selected_slots'])
assert any(x['sheet_id']=='PAL-FRONT-001' for x in b['retired_slots'])
for name,key,lookup in [('image-labels.csv','id',images),('model-tracker.csv','asset_id',assets),('batch-model-tracker.csv','batch_id',batches)]:
 with (R/name).open(newline='') as f:rows=list(csv.DictReader(f))
 assert len(rows)==len(lookup)==len({x[key] for x in rows})
 for row in rows:
  field='sha256' if key=='id' else 'reference_sha256';assert row[field]==lookup[row[key]][field]
for f in P.rglob('index.html'):
 for link in re.findall(r'(?:href|src)="([^"]+)"',f.read_text()):
  if not link.startswith(('https://','#')):assert (f.parent/link).exists(),(f,link)
assert not list(P.rglob('*.glb')) and not list(P.rglob('*.blend'))
out={'active_sheets':7,'active_component_targets':100,'direct_source_panels':len(panels)+len(wish),'exact_source_crop_pixels_verified':True,'archive_hashes_verified':True,'archive_images':len(images),'model_targets':len(assets),'existing_wish_designs':8,'new_wish_designs_generated':0,'newly_registered_existing_wish_designs':4,'future_palace_categories':20,'parked_generated_map_studies':1,'map_studies_in_active_selection':0,'palace_selected_or_reserved':sum(x['owner']=='palace' for x in b['selected_slots']),'selected_or_reserved':len(b['selected_slots']),'palace_cap':b['global_caps']['palace'],'global_cap':230,'generated_models_this_pass':0,'physical_join_fit_verified':False,'seamless_UV_textures_verified':False,'review_status':'pending-user-reference-review','limits':'Provenance/contract checks do not establish image fidelity, model fit, full2km room coverage or runtime readiness.'}
(P/'verification.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out))
