"""Interaction and attachment inspection on the actual review page, one browser at a time."""
import json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
errors=[];captures=[];walks={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':960})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
 page.goto('http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/village-fit/',wait_until='networkidle')
 page.wait_for_function('villageReview?.ready',timeout=60000)
 assert not page.locator('#error').is_visible()
 assert page.evaluate('villageReview.details.instances.length')==26
 def capture(name,canvas=False):
  path='review/'+name+'.png';page.locator('#scene').screenshot(path=str(ROOT/path)) if canvas else page.screenshot(path=str(ROOT/path),full_page=True);captures.append(path)
 page.select_option('#palette','source');page.click('#fittings-view');capture('fittings-source-slots')
 perf=page.evaluate('villageReview.state');assert perf['triangles']<75000 and perf['draw_calls']<120,perf
 # Opposed window mounts, all fittings, open/closed pivots, hollow specimens and terminal trim.
 representatives={}
 for item in page.evaluate('villageReview.details.instances'):
  representatives.setdefault(item['part'],item['id'])
 representatives['D09']='D09'
 for part,id in sorted(representatives.items()):
  page.select_option('#fitting-select',id);page.click('#fitting-isolate');capture('fit-'+part,True)
  if part=='D09':assert 'shaft' in page.locator('#fitting-status').inner_text()
 page.select_option('#fitting-select','GABLE-TRIM-0-2');page.click('#fitting-isolate')
 assert 'Short terminal' in page.locator('#fitting-status').inner_text()
 # The door's visual state and the movement solver must agree.
 page.click('#fittings-view');page.click('#door-toggle');assert not page.evaluate('villageReview.details.doorOpen')
 assert page.evaluate('!villageReview.model.canStand(19.5,-6)')
 capture('fittings-door-closed')
 page.select_option('#route','cottageRoom');page.click('#run')
 page.wait_for_function("villageReview.state.run?.status==='blocked'",timeout=60000)
 blocked=page.evaluate('villageReview.state.run');assert blocked['position']['z']>-5.35,blocked
 # Hiding the furniture/fittings is a rendering operation, not a collision escape.
 page.locator('#fittings-toggle').uncheck();assert page.evaluate('!villageReview.model.canStand(19.5,-6)')
 page.locator('#fittings-toggle').check();page.click('#door-toggle');assert page.evaluate('villageReview.details.doorOpen')
 # Both shutter states retain glazing collision and independent leaf transforms.
 for opened in [False,True]:
  page.click('#shutter-toggle');assert page.evaluate('villageReview.details.shuttersOpen')==opened
  assert page.evaluate('!villageReview.model.canStand(22.5,-6)')
 page.click('#fittings-view');capture('fittings-open-return')
 # Full free-movement returns are replayed in the final fitted page, rather than assuming old evidence.
 for route in ['arrival','publicRoom','cottageRoom']:
  page.select_option('#route',route);page.click('#run')
  page.wait_for_function("villageReview.state.run?.status!=='running'",timeout=150000)
  result=page.evaluate('villageReview.state.run');assert result['status']=='pass',result;walks[route]=result
 page.click('#plan');page.select_option('#layer','lower');capture('fittings-lower-plan',True)
 page.select_option('#layer','roof');capture('fittings-roof-plan',True)
 page.select_option('#palette','source');page.click('#fittings-view')
 page.set_viewport_size({'width':390,'height':844});assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert page.locator('#door-toggle').is_visible();capture('fittings-mobile')
 assert not errors,errors
 b.close()
r={'status':'pass','fitting_review_sha256':hashlib.sha256((ROOT/'fitting-review.json').read_bytes()).hexdigest(),'browser':'Chromium / Playwright / software WebGL2','viewports':['1440×960','390×844'],'checks':['All 12 saved types isolate; D09 is visibly identified as unmounted','Door toggle blocks the actual cottage route; hiding fittings cannot bypass collision','Opening the door restores all three complete free-XZ return routes','Both shutter states preserve glazing collision','Actual fitted lower/roof projections, source slot preview and 390 px controls render'],'blocked_door':blocked,'walks':walks,'performance_observation':perf,'captures':captures,'page_errors':errors,'limits':'Procedural Function fitting specimens; not accepted decorative models, carving fidelity or production performance'}
(ROOT/'details-browser-verification.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
