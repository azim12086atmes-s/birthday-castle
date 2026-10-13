"""Reserve and record missing-only reference sheets against the saved caps."""
import argparse
import hashlib
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
PLAN=ROOT/'production-budget.json'

def main():
    p=argparse.ArgumentParser()
    p.add_argument('action',choices=['reserve','attempt','record','status'])
    p.add_argument('--id');p.add_argument('--owner');p.add_argument('--family');p.add_argument('--title')
    p.add_argument('--file');p.add_argument('--reason');a=p.parse_args()
    d=json.loads(PLAN.read_text());slots=d['selected_slots']
    if a.action=='status':
        print(json.dumps({owner:{'cap':cap,'used_or_reserved':sum(s['owner']==owner for s in slots)} for owner,cap in d['global_caps'].items()},indent=2));return
    if not a.id:p.error('--id is required')
    slot=next((s for s in slots if s['sheet_id']==a.id),None)
    if a.action=='reserve':
        if slot:raise SystemExit('ID already selected or reserved: '+a.id)
        if a.owner not in d['global_caps']:raise SystemExit('Unknown budget owner')
        if sum(s['owner']==a.owner for s in slots)>=d['global_caps'][a.owner]:raise SystemExit('Owner cap exhausted')
        if len(slots)>=d['total_final_sheet_cap']:raise SystemExit('Global cap exhausted')
        if a.owner=='palace':
            family=next((f for f in d['palace_family_caps'] if f['family']==a.family),None)
            if not family:raise SystemExit('Palace family is required')
            used=len(family['existing_ids'])+sum(s.get('family')==a.family for s in slots)
            if used>=family['cap']:raise SystemExit('Palace family cap exhausted')
        slots.append({'sheet_id':a.id,'owner':a.owner,'family':a.family,'title':a.title,'status':'reserved-for-verified-gap','file':'','sha256':'','generation_attempts_in_this_pass':0})
    elif a.action=='attempt':
        if not slot:raise SystemExit('Reserve the slot first')
        if d.get('generation_paused') and a.id not in d.get('generation_resume_allowlist', []):
            raise SystemExit('Generation paused for source correspondence; record the resolved structural trace before resuming')
        n=slot.get('generation_attempts_in_this_pass',0)
        if n>=2:raise SystemExit('Two attempts already recorded; review before further generation')
        if n and not a.reason:raise SystemExit('A concrete rejection reason is required for a retry')
        slot['generation_attempts_in_this_pass']=n+1
        if a.reason:slot.setdefault('retry_reasons',[]).append(a.reason)
        slot['status']='generation-attempt-recorded'
    elif a.action=='record':
        if not slot or not a.file:raise SystemExit('Reserved ID and --file required')
        path=Path(a.file)
        if not path.is_file():raise SystemExit('Output file does not exist')
        slot.update(status='generated-pending-review',file=str(path),sha256=hashlib.sha256(path.read_bytes()).hexdigest())
    PLAN.write_text(json.dumps(d,indent=2)+'\n')
    print(a.action+': '+a.id)

if __name__=='__main__':main()
