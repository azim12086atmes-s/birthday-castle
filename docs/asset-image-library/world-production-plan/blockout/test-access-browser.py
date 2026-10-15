"""Focused browser proof; start repository-root HTTP server on 8765 first."""
import json
import hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
errors=[]
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1280,'height':900})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
 page.goto('http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/blockout/access.html',wait_until='networkidle')
 page.wait_for_function('window.accessReview?.ready',timeout=60000)
 assert page.evaluate('accessReview.report')==json.loads((ROOT/'access-review.json').read_text())
 assert page.locator('#connector option').count()==18
 for id in page.locator('#connector option').evaluate_all('(xs)=>xs.map(x=>x.value)'):
  page.select_option('#connector',id)
  assert page.evaluate('accessReview.state.id')==id
 page.select_option('#connector','R01-C1');assert 'Rejected' in page.locator('#detail').inner_text()
 page.locator('#all').check();page.screenshot(path=str(ROOT/'review'/'access-world.png'),full_page=True)
 page.locator('#all').uncheck();page.select_option('#connector','FT02-C1');assert 'Profile fits' in page.locator('#detail').inner_text()
 page.screenshot(path=str(ROOT/'review'/'access-west-plan.png'),full_page=True)
 page.locator('#terrain-view').click();assert page.locator('#terrain').is_visible()
 page.screenshot(path=str(ROOT/'review'/'access-west-terrain.png'),full_page=True)
 page.locator('#close-up').click();page.screenshot(path=str(ROOT/'review'/'access-west-close-up.png'),full_page=True)
 page.locator('#walk').click();page.locator('#walk').blur()
 before=page.evaluate('accessReview.state.walker.s')
 page.keyboard.down('KeyW');page.wait_for_timeout(1000);page.keyboard.up('KeyW')
 assert page.evaluate('accessReview.state.walker.s')>before+.1
 page.evaluate('accessReview.move(0,100)');assert page.evaluate('Math.abs(accessReview.state.walker.l)')<=.950001
 page.locator('#reset').click()
 # Replay uses the same swept solver as keyboard walking, on animation frames.
 page.set_viewport_size({'width':1024,'height':768})
 page.locator('#replay').click()
 page.wait_for_function("accessReview.state.run?.status!=='running'",timeout=300000)
 run=page.evaluate('accessReview.state.run');assert run['status']=='pass',run
 assert abs(run['distance_m']-run['expected_m'])<.001
 page.screenshot(path=str(ROOT/'review'/'access-west-return.png'),full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.locator('#overhead').click()
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors
 b.close()
r={'status':'pass','report_sha256':hashlib.sha256((ROOT/'access-review.json').read_bytes()).hexdigest(),'browser':'Chromium / Playwright / software WebGL2','viewports':['1280×900','1024×768 replay','390×844'],'checks':['All 18 connectors selectable; rejected footprint alignment visible','Overhead, whole-world overview, profile and terrain render','Real keyboard forward movement and swept lateral containment','Full west connector traversed out and back on animation frames','Mobile layout fits without horizontal overflow'],'west_walk':run,'page_errors':errors,'limits':'Confined connector exercise; not an integrated entrance, support simulation or complete-world navigation'}
(ROOT/'access-browser-verification.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
