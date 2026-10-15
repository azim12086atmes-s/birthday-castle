"""Inspect the actual separate construction page; no second browser is needed."""
import json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
(ROOT/'review').mkdir(exist_ok=True)
errors=[];captures=[];observations=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':960})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
 page.goto('http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/village-fit/roof-fit/',wait_until='networkidle')
 page.wait_for_function('roofReview?.ready',timeout=60000)
 assert not page.locator('#error').is_visible()
 assert page.evaluate('roofReview.report')==json.loads((ROOT/'review-data.json').read_text())
 def capture(name,canvas=False):
  path='review/'+name+'.png'
  (page.locator('#scene') if canvas else page).screenshot(path=str(ROOT/path),**({} if canvas else {'full_page':True}));captures.append(path)
 capture('assembly-clay');observations.append(page.evaluate('roofReview.state'))
 page.select_option('#palette','source');capture('assembly-source-slots')
 for view in ['chimney','valley','support','plan','underside']:
  page.click('[data-view="'+view+'"]');assert page.evaluate('roofReview.state.mode')==view
  capture(view,view in ['plan','underside']);observations.append(page.evaluate('roofReview.state'))
  if view=='support':
   frame=page.evaluate('roofReview.frameBounds');assert frame['xmin']>-.95 and frame['xmax']<.95 and frame['ymin']>-.95 and frame['ymax']<.95,frame
 page.click('[data-view="chimney"]');page.locator('#section-toggle').check();capture('chimney-section');page.locator('#section-toggle').uncheck()
 for id in ['MOUNTED-D09','VENT-SHAFT-P01','VENT-FLASHING-APRON','H-N-18-ROOF-0','VALLEY-DRAIN-P01','DOWNPIPE-P01','SUMP-WALLS']:
  page.select_option('#part',id);page.click('#isolate');assert page.evaluate('roofReview.state.isolated')
  assert id in page.locator('#part-info').inner_text();capture('part-'+id,True)
 page.click('[data-view="assembly"]');page.click('#flow')
 page.wait_for_function("roofReview.state.run?.status==='pass'",timeout=20000)
 trace=page.evaluate('roofReview.state.run');assert trace['onward_connection']=='unresolved-site-drain'
 assert 'Onward site drain remains unresolved' in page.locator('#status').inner_text();capture('runoff-complete')
 page.click('#flow');page.click('[data-view="chimney"]');assert page.evaluate("roofReview.state.run.status")=="cancelled"
 page.click('#flow');page.click('#isolate');assert page.evaluate("roofReview.state.run.status")=="cancelled"
 page.click('[data-view="assembly"]')
 page.locator('#roof-toggle').uncheck();page.locator('#wall-toggle').uncheck();capture('construction-only')
 # Layer changes must not mutate the scheduled apertures or trace endpoints.
 assert page.evaluate('roofReview.model.penetration.clearance_m')==.05
 assert page.evaluate('roofReview.model.flow.at(-1)')==trace['end']
 page.locator('#roof-toggle').check();page.locator('#wall-toggle').check()
 page.set_viewport_size({'width':390,'height':844});page.click('[data-view="assembly"]')
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');capture('mobile')
 for observation in observations:
  assert observation['triangles']<=75000 and observation['draw_calls']<=120,observation
 assert not errors,errors
 b.close()
report={'status':'pass','review_sha256':hashlib.sha256((ROOT/'review-data.json').read_bytes()).hexdigest(),'browser':'Chromium / Playwright / software WebGL2','viewports':['1440×960','390×844'],'checks':['Assembly, chimney, valley, support, actual roof and underside projections render','Section/clay/source-slot controls and seven real-part isolations work; the complete support frame fits the viewport','Runoff trace reaches the actual sump endpoint and labels onward drain unresolved; changing view cancels a running trace','Layer controls preserve opening dimensions and drainage endpoints','Observed geometry/draw-call budgets and mobile horizontal layout pass'],'trace':trace,'performance_observations':observations,'captures':captures,'page_errors':errors,'limits':'Function geometry inspection only; trace is not fluid simulation or waterproofing/structure approval; no main-game integration'}
(ROOT/'browser-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
