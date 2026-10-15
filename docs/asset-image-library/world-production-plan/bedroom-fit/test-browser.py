"""Actual loaded bedroom preview, source views and complete collision-driven returns."""
import json,hashlib
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
errors=[];captures=[];walks={};observations={}
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 page=b.new_page(viewport={'width':1440,'height':960})
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m:errors.append(m.text) if m.type=='error' else None)
 page.on('response',lambda r:errors.append(f'{r.status} {r.url}') if r.status>=400 else None)
 page.goto('http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/bedroom-fit/',wait_until='networkidle')
 page.wait_for_function('window.bedroomReview?.ready',timeout=60000)
 assert not page.locator('#error').is_visible()
 def capture(path,canvas=False):
  page.locator('#scene').screenshot(path=str(ROOT/path)) if canvas else page.screenshot(path=str(ROOT/path),full_page=True)
  captures.append(path);obs=page.evaluate('bedroomReview.state');observations[path]={'triangles':obs['triangles'],'draw_calls':obs['draw_calls']}
  assert obs['triangles']<160000 and obs['draw_calls']<160,obs
 capture('review/dressed-bed.png');assert abs(page.evaluate('bedroomReview.ceilingHeight()')-18)<.00001
 assert page.evaluate('bedroomReview.model.items.length')==45
 for name in ['entry','balcony','cutaway','ceiling-up','ceiling-a','ceiling-b','corner-nw','corner-ne','corner-sw','corner-se']:
  page.evaluate('(n)=>bedroomReview.view(n)',name);capture('review/'+name+'.png',name.startswith(('ceiling','corner')))
 # Lower and reflected-ceiling plans use the actual geometry with separate pendant layers.
 page.click('#plan');assert not page.evaluate('bedroomReview.fixture.groups.pendants.visible')
 assert page.evaluate('bedroomReview.fixture.groups.walls.visible');capture('plans/lower-plan.png',True)
 page.click('#ceiling-plan');assert not page.evaluate('bedroomReview.fixture.groups.contents.visible')
 assert page.evaluate('bedroomReview.fixture.groups.pendants.visible');capture('plans/ceiling-plan.png',True)
 # Distant use rejects; the keyboard interaction moves the real lid and reveals the cavity.
 page.click('#walk');page.click('#interact');assert 'Move near' in page.locator('#interaction').inner_text()
 assert page.evaluate('bedroomReview.setPlayer(8,4.8)');page.locator('#scene').focus();page.keyboard.press('KeyE')
 page.wait_for_function('bedroomReview.model.casketOpen');assert page.evaluate("bedroomReview.fixture.objects.get('CASKET-LID').rotation.x")<-1.4
 page.select_option('#component','KEEPSAKE-CASKET');assert 'INT-BEDROOM-PROP-001-A01' in page.locator('#component-info').inner_text()
 capture('review/keepsake-open.png')
 page.locator('#contents').uncheck();assert page.evaluate('!bedroomReview.model.canStand(0,-6.5)')
 page.locator('#contents').check();page.locator('#flowers').uncheck()
 assert page.evaluate('!bedroomReview.model.canStand(-17.8,-6.2)');page.locator('#flowers').check()
 page.locator('#vault').uncheck();assert page.evaluate('bedroomReview.ceilingHeight()')>17.99
 page.locator('#vault').check()
 # Free keyboard movement and both complete animated returns on the final page.
 page.click('#walk');page.locator('#scene').focus();page.keyboard.down('KeyW')
 page.wait_for_function('bedroomReview.player.z<11.8',timeout=30000);page.keyboard.up('KeyW')
 page.set_viewport_size({'width':1024,'height':768})
 for name in ['bedroom','balcony']:
  page.select_option('#route',name);page.click('#run')
  page.wait_for_function("bedroomReview.state.run?.status!=='running'",timeout=150000)
  result=page.evaluate('bedroomReview.state.run');assert result['status']=='pass',result
  assert abs(result['travelled_m']-result['length_m'])<.00001
  assert abs(result['position']['x'])<.00001 and abs(result['position']['z']-12)<.00001
  walks[name]=result
 capture('review/balcony-return.png')
 assert page.evaluate('!bedroomReview.setPlayer(-32,-1)')
 assert page.evaluate('bedroomReview.setPlayer(-14,-1)')
 assert page.evaluate('bedroomReview.model.canStand(-12,-1)')
 page.set_viewport_size({'width':1440,'height':960});page.click('#bed');page.select_option('#palette','clay');capture('review/clay.png',True)
 page.select_option('#palette','source');page.set_viewport_size({'width':390,'height':844})
 assert page.evaluate('document.documentElement.scrollWidth<=innerWidth');assert page.locator('#interact').is_visible()
 capture('review/mobile.png');assert not errors,errors
 b.close()
report={'status':'pass','review_data_sha256':hashlib.sha256((ROOT/'review-data.json').read_bytes()).hexdigest(),'browser':'Chromium / Playwright / software WebGL2','viewports':['1440×960','1024×768 return checks','390×844'],'checks':['One dressed human-scale bed and saved asymmetrical room layout render without page/console errors','Actual substrate apex measures 18 m; centre-up, two opposed ceiling obliques and four 120-degree corners are saved','Grayscale lower/reflected-ceiling projections use actual meshes with separated pendant layer','Nearby E-key casket opens actual hinge; distant use rejects; named component selection displays source ID','Furniture/plant/ceiling visibility toggles preserve movement/collision contracts','Keyboard input and both complete bedroom/balcony returns pass; outer balcony edge blocks and level west passage stays open','Source/clay and 390 px review controls fit the viewport'],'walks':walks,'performance_observations':observations,'captures':captures,'page_errors':errors,'limits':'Procedural Function geometry only; source ornament, cloth, glass, final models, structural approval, game integration and production device performance remain pending'}
(ROOT/'browser-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
