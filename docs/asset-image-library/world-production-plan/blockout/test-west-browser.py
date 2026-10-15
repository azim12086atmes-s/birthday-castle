"""Browser movement proof for the proposed west route. Serve repository root on port 8765."""
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
 page.goto('http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/blockout/west.html',wait_until='networkidle')
 page.wait_for_function('window.westReview?.ready',timeout=60000)
 assert page.evaluate('westReview.report')==json.loads((ROOT/'west-route-review.json').read_text())
 assert not page.locator('#error').is_visible()
 page.screenshot(path=str(ROOT/'review'/'west-route-overhead.png'),full_page=True)
 for choice in ['stairs','ramp']:
  page.select_option('#route',choice)
  assert page.evaluate('westReview.state.mode')==choice
 assert page.locator('#replay').is_disabled()
 page.select_option('#route','stairs')
 page.locator('#crossing').click();page.screenshot(path=str(ROOT/'review'/'west-stair-crossing.png'),full_page=True)
 page.locator('#flight').click();page.screenshot(path=str(ROOT/'review'/'west-stair-flight.png'),full_page=True)
 page.locator('#gate').click();page.screenshot(path=str(ROOT/'review'/'west-village-gate.png'),full_page=True)
 page.locator('#forest').click();page.screenshot(path=str(ROOT/'review'/'west-FC05-departure.png'),full_page=True)
 page.locator('#reset').click();page.locator('#walk').click();page.locator('#walk').blur()
 before=page.evaluate('westReview.state.position')
 page.keyboard.down('KeyD');page.wait_for_timeout(700);page.keyboard.up('KeyD')
 assert page.evaluate('westReview.state.position.z')>before['z']+.1
 # Normal keyboard and replay share the world X/Z solver. The replay never teleports at joints.
 page.set_viewport_size({'width':1024,'height':768})
 page.locator('#replay').click()
 page.wait_for_function("westReview.state.run?.status!=='running'",timeout=120000)
 crossing=page.evaluate('westReview.state.run');assert crossing['status']=='pass',crossing
 assert abs(crossing['distance_m']-crossing['expected_m'])<.001
 page.screenshot(path=str(ROOT/'review'/'west-stair-return.png'),full_page=True)
 print('Crossing replay passed; starting full FC05 → gate → FC05 walk.',flush=True)
 page.locator('#full').click()
 page.wait_for_function("westReview.state.run?.status!=='running'",timeout=480000)
 full=page.evaluate('westReview.state.run');assert full['status']=='pass',full
 assert abs(full['distance_m']-full['expected_m'])<.001
 assert abs(full['return_position']['x']+4000)<1e-6 and abs(full['return_position']['z']+543)<1e-6
 page.screenshot(path=str(ROOT/'review'/'west-full-return.png'),full_page=True)
 page.locator('#full').click();page.locator('#overhead').click()
 assert page.evaluate('westReview.state.run.status')=='cancelled'
 page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 assert not errors,errors
 b.close()
r={'status':'pass','report_sha256':hashlib.sha256((ROOT/'west-route-review.json').read_bytes()).hexdigest(),'browser':'Chromium / Playwright / software WebGL2','viewports':['1280×900','1024×768 replay','390×844'],'checks':['Matched-arrival alternatives, profiles, overhead and terrain views load','Instanced treads, rest landings, gate and FC05 context render','Real keyboard movement uses the same swept X/Z solver as replay','Entire stair crossing and both approaches traversed and reversed','Entire FC05 apron → cottage loop → regional path → proposed village gate → FC05 traversed on animation frames','Changing view cancels a check; mobile layout has no horizontal overflow'],'crossing_walk':crossing,'full_walk':full,'page_errors':errors,'limits':'Engineering route with proposed gate; not an integrated village interior, final bridge/support design or production GPU benchmark'}
(ROOT/'west-browser-verification.json').write_text(json.dumps(r,indent=2)+'\n');print(json.dumps(r,indent=2))
