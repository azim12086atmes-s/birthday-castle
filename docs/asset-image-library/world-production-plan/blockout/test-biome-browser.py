"""Biome layers and the complete FC05 loop in the real review-page movement solver."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/blockout/');parser.add_argument('--chromium',default='/usr/bin/chromium');args=parser.parse_args()
errors,failed,checks=[],[],[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    page=browser.new_page(viewport={'width':1440,'height':960})
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda e:errors.append(e.text) if e.type=='error' else None)
    page.on('response',lambda r:failed.append(f'{r.status} {r.url}') if r.status>=400 else None)
    page.goto(args.url,wait_until='networkidle');page.wait_for_function('window.blockout?.ready',timeout=60000)
    assert page.locator('#biome option').count()==9
    for region in ['T01','T02','T03','T04','T05','T06','T07','T08']:
        page.select_option('#biome',region);assert region in page.locator('#detail').inner_text()
    page.select_option('#transition','TR04');assert 'Grade/crossing intervention' in page.locator('#detail').inner_text();assert page.locator('#profile').is_visible();page.click('#reset');page.screenshot(path=str(ROOT/'review'/'biomes-world.png'))
    for mode in ['elevation','slope','wetness','substrate']:
        page.select_option('#display',mode);assert page.evaluate('window.blockout.state.display')==mode
    page.locator('[data-view="terrain"]').click();page.select_option('#vertical','4')
    assert 'lake 36 m' in page.locator('#readout').inner_text()
    page.select_option('#vertical','1')
    checks.append('All eight recipes, elevation/slope/water-edge displays and world vertical inspection scale work')
    page.locator('[data-area="forest"]').click();page.locator('[data-view="map"]').click()
    assert page.locator('#habitat option').count()==7
    assert page.evaluate('window.blockout.geo.habitats.objects.length')==94
    for zone in ['H01','H02','H03','H04','H05','H06']:
        page.select_option('#habitat',zone);assert zone in page.locator('#detail').inner_text()
    page.screenshot(path=str(ROOT/'review'/'FC05-habitat-plan.png'))
    page.locator('[data-view="terrain"]').click();page.screenshot(path=str(ROOT/'review'/'FC05-habitat-terrain.png'))
    page.uncheck('[data-layer="habitats"]');page.locator('[data-view="walk"]').click()
    assert not page.evaluate('(() => {const o=window.blockout.geo.habitats.objects.find(o=>o.block);return window.blockout.moveTo(o.x,o.z);})()')
    page.check('[data-layer="habitats"]')
    checks.append('Six FC05 ground zones and 94 placement envelopes inspect correctly; hidden crowns retain visible blocker collision')
    page.set_viewport_size({'width':1024,'height':768})
    page.click('#forest-run')
    page.wait_for_function("window.blockout.state.forest_run && window.blockout.state.forest_run.status !== 'running'",timeout=180000)
    result=page.evaluate('window.blockout.state.forest_run')
    assert result['status']=='pass',result
    assert abs(result['distance_m']-result['expected_m'])<.02
    assert result['return_position']=={'x':0,'z':7}
    assert 460<result['distance_m']<480
    page.screenshot(path=str(ROOT/'review'/'FC05-full-loop-return.png'))
    checks.append('Entire 370 m loop plus entrance/return spur passes using the same swept solver as manual walking')
    page.click('#forest-run');page.locator('[data-view="map"]').click()
    assert page.evaluate('window.blockout.state.forest_run.status')=='cancelled'
    assert page.locator('#forest-run').is_enabled()
    page.set_viewport_size({'width':390,'height':844});page.locator('[data-view="map"]').click()
    page.select_option('#habitat','H05');assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    checks.append('390 px biome/habitat controls fit without horizontal overflow')
    assert not errors,errors
    assert not failed,failed
    browser.close()
report={'status':'pass','browser':'Chromium / Playwright / software WebGL2','viewports':{'static_layers':'1440×960','full_loop':'1024×768','mobile_controls':'390×844'},'checks':checks,'complete_forest_run':result,'page_errors':errors,'failed_requests':failed,'limits':'Terrain and placement proposals; complete local loop checked, regional navigation and final flora/fauna models remain pending'}
(ROOT/'biome-browser-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
