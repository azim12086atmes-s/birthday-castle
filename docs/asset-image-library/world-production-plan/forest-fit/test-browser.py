"""Exercise the actual FC05 review page; one software-WebGL browser at a time."""
import hashlib,json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
errors=[];captures=[];walks={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':960})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
 page.goto('http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/forest-fit/',wait_until='networkidle')
 page.wait_for_function('window.forestReview?.ready',timeout=60000)
 assert not page.locator('#error').is_visible()
 def capture(path,canvas=False):
  page.locator('#scene').screenshot(path=str(ROOT/path)) if canvas else page.screenshot(path=str(ROOT/path),full_page=True)
  captures.append(path)
 capture('review/arrival.png');perf=page.evaluate('forestReview.state')
 assert perf['triangles']<100000 and perf['draw_calls']<100,perf
 assert page.evaluate('forestReview.model.vegetation.length')==94
 assert page.evaluate('forestReview.model.origin')=={'x':-4000,'y':49.15,'z':-550}
 page.click('#room');assert abs(page.evaluate('forestReview.ceilingDistance()')-2.45)<.00001
 assert page.evaluate('forestReview.fixture.groups.ceiling.visible')
 capture('review/sitting-room.png')
 page.locator('#room').blur();page.evaluate('forestReview.setPlayer(0,2)');before=page.evaluate('forestReview.model.room.rings')
 page.keyboard.press('KeyE');page.wait_for_function('(n)=>forestReview.model.room.rings===n+1',arg=before)
 assert 'Chime rung' in page.locator('#interaction').inner_text()
 page.click('#walk');page.click('#chime');assert 'closer' in page.locator('#interaction').inner_text()
 # Hiding geometry is strictly an inspection operation.
 page.locator('#furniture').uncheck();assert page.evaluate('!forestReview.model.canStand(-3.6,-1.8)')
 page.locator('#furniture').check();page.locator('#plants').uncheck()
 assert page.evaluate('(()=>{const o=forestReview.model.vegetation.find(o=>o.block);return !forestReview.model.canStand(o.x,o.z)})()')
 page.locator('#plants').check()
 # Door poses share the model's hinge transforms; a blocked traversal is observed live.
 page.click('#door');assert not page.evaluate('forestReview.model.doorOpen')
 assert page.evaluate('!forestReview.model.canStand(0,4.2)')
 page.select_option('#route','room');page.click('#run')
 page.wait_for_function("forestReview.state.run?.status==='blocked'",timeout=60000)
 blocked=page.evaluate('forestReview.state.run');assert blocked['position']['z']>4.5,blocked
 page.click('#arrival');page.click('#door');assert page.evaluate('forestReview.model.doorOpen')
 # Check free keyboard movement, then both complete collision-driven returns.
 page.click('#walk');page.locator('#scene').focus();page.keyboard.down('KeyW')
 page.wait_for_function('forestReview.player.z<6.9',timeout=30000);page.keyboard.up('KeyW')
 assert page.evaluate('forestReview.player.z')<7
 page.set_viewport_size({'width':1024,'height':768})
 for name in ['room','clearing']:
  page.select_option('#route',name);page.click('#run')
  page.wait_for_function("forestReview.state.run?.status!=='running'",timeout=180000)
  result=page.evaluate('forestReview.state.run');assert result['status']=='pass',result
  assert abs(result['travelled_m']-result['length_m'])<.00001,result
  assert abs(result['position']['x'])<.00001 and abs(result['position']['z']-7)<.00001
  walks[name]=result
 capture('review/clearing-return.png')
 page.set_viewport_size({'width':1440,'height':960});page.click('#clearing');capture('review/clearing.png')
 page.select_option('#specimen','FC05-BIRCH-1');assert 'F02-FLORA-001-A02' in page.locator('#specimen-info').inner_text();capture('review/birch-fit.png',True)
 page.click('#plan');assert not page.evaluate("forestReview.fixture.objects.get('ROOM-CHIME').visible")
 capture('plans/lower-plan.png',True)
 page.click('#ceiling');assert page.evaluate("forestReview.fixture.objects.get('ROOM-CHIME').visible")
 assert not page.evaluate("forestReview.fixture.objects.get('ROOM-BENCH').visible")
 capture('plans/ceiling-plan.png',True)
 page.click('#arrival');page.select_option('#palette','clay');capture('review/clay.png',True)
 page.select_option('#palette','source');page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('#door').is_visible()
 capture('review/mobile.png');assert not errors,errors
 b.close()
report={'status':'pass','review_data_sha256':hashlib.sha256((ROOT/'review-data.json').read_bytes()).hexdigest(),'browser':'Chromium / Playwright / software WebGL2','viewports':['1440×960','1024×768 full route','390×844'],'checks':['Source-family and clay views render; real ceiling underside is visible and measures 2.45 m','Keyboard walking and E-key proximity chime work; distant interaction rejects','Closed doors block the actual route; reopening restores passage; hinge geometry and collision agree','Furniture and all habitat blocker collision survive visibility toggles','Both complete room and clearing routes return to the same apron at full measured length','Actual-mesh lower and reflected-ceiling projections separate furnishings and pendant; named birch selection and mobile layout work'],'blocked_door':blocked,'walks':walks,'performance_observation':perf,'captures':captures,'page_errors':errors,'limits':'Procedural Function specimens only; no final foliage/carving fidelity, registered models, production performance or main-game integration'}
(ROOT/'browser-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
