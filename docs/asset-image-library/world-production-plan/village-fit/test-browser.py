"""Run with repository root served on 8765; no installed frontend build needed."""
import json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
errors=[];walks={};performance=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':960})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
 page.goto('http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/village-fit/',wait_until='networkidle')
 page.wait_for_function('villageReview?.ready',timeout=60000)
 assert not page.locator('#error').is_visible()
 assert page.evaluate('villageReview.report')==json.loads((ROOT/'review-data.json').read_text())
 for layer in ['lower','roof','ceiling']:
  page.select_option('#layer',layer);(ROOT/'plans').mkdir(exist_ok=True);page.locator('#scene').screenshot(path=str(ROOT/'plans'/f'{layer}-plan.png'));page.screenshot(path=str(ROOT/'review'/f'plan-{layer}.png'),full_page=True)
 page.locator('#arrival').click();page.screenshot(path=str(ROOT/'review'/'arrival-clay.png'),full_page=True)
 page.select_option('#palette','source');page.screenshot(path=str(ROOT/'review'/'arrival-source-slots.png'),full_page=True)
 performance.append(page.evaluate('villageReview.state'))
 assert performance[-1]['triangles']<=75000,performance[-1]
 assert performance[-1]['draw_calls']<=120,performance[-1]
 page.locator('#house').click();page.screenshot(path=str(ROOT/'review'/'house-opening.png'),full_page=True)
 page.locator('#roof').click();page.screenshot(path=str(ROOT/'review'/'roof-join.png'),full_page=True)
 page.select_option('#palette','clay')
 (ROOT/'elevations').mkdir(exist_ok=True)
 for id,name in [('H-N-18-ENTRY','source-door'),('H-N-18-WIN','window-bay'),('H-S-18-ENTRY','wide-entry'),('LANE-ARCH-42','lane-arch')]:
  page.select_option('#inspect',id);page.locator('#host').click();assert page.evaluate('villageReview.state.mode')=='host';page.locator('#scene').screenshot(path=str(ROOT/'elevations'/f'{name}.png'))
 page.select_option('#inspect','H-N-18-ENTRY');assert 'B12-STRUCT-001-S02' in page.locator('#detail').inner_text()
 for route in ['arrival','publicRoom','cottageRoom']:
  page.select_option('#route',route);page.locator('#run').click()
  page.wait_for_function("villageReview.state.run?.status!=='running'",timeout=120000)
  result=page.evaluate('villageReview.state.run');assert result['status']=='pass',result;walks[route]=result
  page.screenshot(path=str(ROOT/'review'/f'return-{route}.png'),full_page=True)
 page.locator('#walk').click();page.locator('#walk').blur();start=page.evaluate('villageReview.state.position')
 page.keyboard.down('KeyW')
 try:page.wait_for_function('(x)=>villageReview.state.position.x>x+.2',arg=start['x'],timeout=15000)
 finally:page.keyboard.up('KeyW')
 assert page.evaluate('villageReview.state.position.x')>start['x']+.2
 blocked=page.evaluate('!villageReview.model.canStand(22.5,6)');assert blocked
 page.locator('#roof-toggle').uncheck();assert page.evaluate('!villageReview.model.canStand(22.5,6)')
 page.locator('#run').click();page.locator('#plan').click();assert page.evaluate('villageReview.state.run.status')=='cancelled'
 page.set_viewport_size({'width':390,'height':844});page.locator('#plan').click()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors
 b.close()
r={'status':'pass','report_sha256':hashlib.sha256((ROOT/'review-data.json').read_bytes()).hexdigest(),'browser':'Chromium / Playwright / software WebGL2','viewports':['1440×960','390×844'],'checks':['Actual wall-section, roof and ceiling projections load','Source material slots, host selection, real openings and roof joins render','Three complete animated routes and real keyboard movement pass','Glazing collision survives palette/roof changes; view switching cancels checks','Measured prototype triangle/draw-call limits pass; mobile layout fits'],'walks':walks,'performance_observations':performance,'page_errors':errors,'limits':'Separate Function fixture, software-rendered inspection only; not formal art/Form approval or production-game performance'}
(ROOT/'browser-verification.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
