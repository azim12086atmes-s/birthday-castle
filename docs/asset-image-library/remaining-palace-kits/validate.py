"""Verify file integrity/provenance and tracking; does not certify image or mesh geometry."""
from pathlib import Path
import json,csv,hashlib,re,collections
from PIL import Image,ImageChops
P=Path(__file__).resolve().parent;R=P.parent
load=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
batch=load(P/'batch.json');manifest=load(R/'manifest.json');register=load(R/'asset-register.json');budget=load(R/'production-budget.json')
images={e['id']:e for e in manifest['images']};assets={a['asset_id']:a for a in register['assets']};batches={b['batch_id']:b for b in register['generation_batches']}
assert len(images)==manifest['distinct_image_count']==len(manifest['images'])
assert len(assets)==len(register['assets']) and len(batches)==len(register['generation_batches'])
for e in images.values():
 f=R/e['file'];assert f.is_file() and sha(f)==e['sha256'],e['id'];assert f.stat().st_size==e['bytes']
assert len(set(e['sha256'] for e in images.values()))==len(images),'Duplicate image bytes should be stored once'
assert manifest['total_bytes']==sum(e['bytes'] for e in images.values())
assert manifest['categories']==dict(sorted(collections.Counter(e['category'] for e in images.values()).items()))
assert all(f'GEN-{i:02}' in images for i in range(1,46))
sections=details=crops=outputs=0;allids=[]
for family in batch['families']:
 s=load(R/family['schedule']);assert s['models_generated']==0 and s['actual_3D_joint_fit_verified'] is False
 assert len(s['parts'])==4 and len(s['decor']) in (0,16)
 source=Image.open(R/s['source_reference_file']).convert('RGB');assert sha(R/s['source_reference_file'])==s['source_reference_sha256']
 for part in s['parts']:
  f=R/part['source_reference_file'];actual=Image.open(f).convert('RGB');expected=source.crop(part['source_box_xyxy']);assert actual.size==expected.size and ImageChops.difference(actual,expected).getbbox() is None,part['asset_id'];assert sha(f)==part['source_reference_sha256'];crops+=1
 items=s['parts']+s['decor']+s.get('extra_structure',{}).get('parts',[])
 for item in items:
  id=item['asset_id'];assert id in assets;allids.append(id);a=assets[id];assert a['model_status']=='unregistered' and not a['model_file'];assert a['reference_image_id'] in images and a['source_reference_id'] in images;assert a['reference_sha256']==sha(R/a['reference_file']);assert all(x in assets for x in a['reuse_component_ids']);assert all(x in assets for x in a['applies_to'])
  sections+=a['kind']=='structural-section';details+=a['kind']=='detachable-detail'
 for out in s['outputs']:
  outputs+=1;assert out['sheet_id'] in images;assert sha(R/out['file'])==out['sha256'];assert sha(R/out['actual_generation_input_file'])==out['actual_generation_input_sha256'];assert out['prompt_key'] in s['prompts'];assert batches[out['sheet_id']]['expected_component_ids']==images[out['sheet_id']]['component_ids'];slot=next(x for x in budget['selected_slots'] if x['sheet_id']==out['sheet_id']);assert slot['sha256']==out['sha256'] and slot['file']==out['file'];assert slot['generation_attempts_in_this_pass']<=2
  if Path(out['original_file']).exists():assert sha(Path(out['original_file']))==out['sha256']
 for old in s.get('previous_attempts',[]):assert sha(R/old['file'])==old['sha256'] and images['DRAFT-'+old['sheet_id']+'-R01']['review_status']=='superseded'
assert (outputs,sections,details,crops)==(12,32,64,28)
assert len(set(allids))==96
for name,key,expected in [('image-labels.csv','id',images),('model-tracker.csv','asset_id',assets),('batch-model-tracker.csv','batch_id',batches)]:
 with (R/name).open(newline='') as f:rows=list(csv.DictReader(f))
 assert len(rows)==len(expected)==len(set(x[key] for x in rows)),name
 for row in rows:
  field='sha256' if key=='id' else 'reference_sha256';assert row[field]==expected[row[key]][field]
assert budget['total_final_sheet_cap']==230 and budget['global_caps']['palace']==65
assert sum(f['cap'] for f in budget['palace_family_caps'])==65
assert len(budget['selected_slots'])<=230
for owner,cap in budget['global_caps'].items():assert sum(s['owner']==owner for s in budget['selected_slots'])<=cap
for family in budget['palace_family_caps']:assert len(family['existing_ids'])+sum(s.get('family')==family['family'] for s in budget['selected_slots'])<=family['cap']
for file in P.rglob('index.html'):
 content=file.read_text()
 for link in re.findall(r'(?:href|src)="([^"]+)"',content):
  if not link.startswith(('https://','#')):assert (file.parent/link).exists(),(file,link)
 assert 'data-src=' in content or file==P/'index.html'
assert not list(P.rglob('*.glb')) and not list(P.rglob('*.blend')) and not list(P.rglob('*.gltf'))
report={'new_sheets':outputs,'structural_targets':sections,'detail_targets':details,'source_section_crops':crops,'direct_crops_match_original_pixels':True,'source_and_output_hashes_verified':True,'archive_hashes_verified':True,'all45_original_boards_preserved':True,'archive_images':len(images),'model_targets':len(assets),'generated_models_this_pass':0,'selected_or_reserved':len(budget['selected_slots']),'palace_selected_or_reserved':sum(x['owner']=='palace' for x in budget['selected_slots']),'global_cap':230,'palace_cap':65,'actual_3D_join_fit_verified':False,'review_status':'pending-user-reference-review','limitations':'Integrity checks do not establish geometric fidelity. Independent illustration scales, hidden profiles, stair turn and listed source differences still need review.'}
(P/'verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
