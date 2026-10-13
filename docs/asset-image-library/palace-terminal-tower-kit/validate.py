"""Check source-crop provenance, labels, catalogue bindings and current sheet caps."""
from pathlib import Path
import json,csv,re,hashlib
from PIL import Image,ImageChops
ROOT=Path(__file__).resolve().parents[1];HERE=Path(__file__).resolve().parent
load=lambda f:json.loads(f.read_text())
sha=lambda f:hashlib.sha256(f.read_bytes()).hexdigest()
s=load(HERE/'schedule.json');m=load(ROOT/'manifest.json');a=load(ROOT/'asset-register.json');b=load(ROOT/'production-budget.json')
assert len(s['parts'])==4 and len(s['decor'])==16
assert abs(sum(x['relative_height'] for x in s['parts'])-100)<.001
assert s['assembly_order_bottom_to_top']==['S01','S02','S03','S04']
assert s['models_generated']==0
source=Image.open(ROOT/s['source_crop_file']).convert('RGB')
for x in s['parts']:
 actual=Image.open(ROOT/x['source_reference_file']).convert('RGB');expect=source.crop(x['source_box_xyxy_in_crop'])
 assert actual.size==expect.size and ImageChops.difference(actual,expect).getbbox() is None
 assert sha(ROOT/x['source_reference_file'])==x['source_reference_sha256']
for joint,ends in [('J1',['S01.top','S02.bottom']),('J2',['S02.top','S03.bottom']),('J3',['S03.top','S04.bottom'])]:
 assert s['joint_profiles'][joint]['matches']==ends
 assert s['joint_profiles'][joint]['faces']==8
ids=[x['asset_id'] for x in s['parts']+s['decor']];assert len(set(ids))==20
registry={x['asset_id']:x for x in a['assets']}
for id in ids:
 x=registry[id];assert x['model_status']=='unregistered' and x['model_file']==''
 assert sha(ROOT/x['reference_file'])==x['reference_sha256']
 for ref in x['reuse_component_ids']:assert ref in registry,ref
 assert all(target in ids for target in x['applies_to'])
assert len(m['images'])==m['distinct_image_count'] and len({e['id'] for e in m['images']})==len(m['images'])
for e in m['images']:
 f=ROOT/e['file'];assert f.exists(),e['id'];assert sha(f)==e['sha256'],e['id'];assert f.stat().st_size==e['bytes'],e['id']
assert m['total_bytes']==sum(e['bytes'] for e in m['images'])
assert all(any(e['id']==f'GEN-{i:02}' for e in m['images']) for i in range(1,46))
for filename in ['image-labels.csv','model-tracker.csv','batch-model-tracker.csv']:
 with (ROOT/filename).open(newline='') as f:rows=list(csv.DictReader(f))
 key='asset_id' if filename=='model-tracker.csv' else 'batch_id' if filename=='batch-model-tracker.csv' else 'id'
 assert len(set(x[key] for x in rows))==len(rows)
 if filename=='image-labels.csv':
  assert len(rows)==len(m['images'])
  images={x['id']:x for x in m['images']}
  for row in rows:assert row['sha256']==images[row['id']]['sha256']
 if filename=='model-tracker.csv':assert len(rows)==len(a['assets'])
assert b['total_final_sheet_cap']==230 and b['global_caps']['palace']==65
assert sum(x['cap'] for x in b['palace_family_caps'])==65
assert len(b['selected_slots'])<=230
for owner,cap in b['global_caps'].items():assert sum(x['owner']==owner for x in b['selected_slots'])<=cap
for family in b['palace_family_caps']:
 used=len(family['existing_ids'])+sum(x.get('family')==family['family'] for x in b['selected_slots'])
 assert used<=family['cap'],family['family']
for id in ['PAL-TOWER-001','PAL-TOWER-001-DECOR']:
 slot=next(x for x in b['selected_slots'] if x['sheet_id']==id);assert sha(ROOT/slot['file'])==slot['sha256']
for folder in [HERE,ROOT/'palace-wall-kits']:
 for link in re.findall(r'(?:href|src)="([^"]+)"',(folder/'index.html').read_text()):
  if not link.startswith(('https://','#')):assert (folder/link).exists(),link
out={'source_family':'Western terminal tower only','structural_sections':4,'detachable_details':16,'direct_source_section_crops':4,'direct_crops_match_source_pixels':True,'joint_target_count':3,'shared_octagonal_profiles_declared':True,'actual_3D_joint_fit_verified':False,'generated_meshes':0,'all_archive_hashes_verified':True,'archive_images':len(m['images']),'model_targets':len(a['assets']),'original45_boards_preserved':True,'selected_or_reserved_sheets':len(b['selected_slots']),'palace_selected_or_reserved':sum(x['owner']=='palace' for x in b['selected_slots']),'palace_cap':65,'global_cap':230,'review_status':'pending-user-reference-review','limits':'Illustrated proportions/backs are proposals; direct source cuts control visible proportions; no construction geometry validated.'}
(HERE/'verification.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out))
