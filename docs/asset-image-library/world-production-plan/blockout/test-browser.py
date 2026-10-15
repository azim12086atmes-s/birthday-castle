"""Run against a repository-root HTTP server. Requires Python Playwright and Chromium."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
parser = argparse.ArgumentParser()
parser.add_argument('--url', default='http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/blockout/')
parser.add_argument('--chromium', default='/usr/bin/chromium')
args = parser.parse_args()
(ROOT / 'review').mkdir(exist_ok=True)
errors, failed_requests, checks = [], [], []
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=args.chromium, headless=True, args=['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
    page = browser.new_page(viewport={'width':1440,'height':960}, device_scale_factor=1)
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.on('console', lambda e: errors.append(e.text) if e.type == 'error' else None)
    page.on('response', lambda r: failed_requests.append(f'{r.status} {r.url}') if r.status >= 400 else None)
    page.on('requestfailed', lambda r: failed_requests.append(r.url))
    page.goto(args.url, wait_until='networkidle')
    page.wait_for_function('window.blockout?.ready', timeout=60000)
    assert page.locator('#site option').count() == 43
    assert page.locator('#route option').count() == 16
    assert not page.locator('#error').is_visible()
    assert page.locator('[data-view="walk"]').is_disabled()
    page.screenshot(path=str(ROOT/'review'/'world-overhead.png'), full_page=True)
    checks.append('World overhead loads with 34 anchors, eight cottages and 15 source/proposed routes')
    page.select_option('#site','B01')
    assert '2500 × 2125' in page.locator('#detail').inner_text()
    page.select_option('#route','FT02')
    assert '6.22 km' in page.locator('#detail').inner_text()
    assert page.locator('#profile').is_visible()
    assert page.locator('#leg option').count() > 10
    page.select_option('#leg','FT02-L2')
    page.select_option('#route','')
    assert not page.locator('#profile').is_visible()
    assert not page.locator('#leg').is_visible()
    page.select_option('#route','FT02')
    for layer in ['regions','water','sites','forests','routes','boats','issues']:
        page.locator(f'[data-layer="{layer}"]').uncheck()
        page.locator(f'[data-layer="{layer}"]').check()
    page.get_by_role('button',name='Reset view',exact=True).click()
    page.get_by_role('button',name='Terrain',exact=True).click()
    assert page.locator('#terrain').is_visible()
    assert page.evaluate("!!document.getElementById('terrain').getContext('webgl2')")
    page.screenshot(path=str(ROOT/'review'/'world-terrain.png'),full_page=True)
    checks.append('Selectable site footprint, route profile, local legs, all layers and WebGL2 terrain work')
    for area in ['forest','bedroom']:
        page.locator(f'[data-area="{area}"]').click()
        page.locator('[data-view="map"]').click()
        if area=='forest':
            assert 'pond −0.7 m' in page.locator('#readout').inner_text()
        page.locator('[data-view="terrain"]').click()
        page.screenshot(path=str(ROOT/'review'/f'{area}-terrain.png'),full_page=True)
        page.locator('[data-view="walk"]').click()
        initial=page.evaluate('window.blockout.state.position')
        page.keyboard.down('KeyW');page.wait_for_timeout(700);page.keyboard.up('KeyW')
        moved=page.evaluate('window.blockout.state.position')
        assert moved['z'] < initial['z']-.15, (area,initial,moved)
        if area=='forest':
            assert not page.evaluate('window.blockout.moveTo(35,22)')
            assert not page.evaluate('window.blockout.moveTo(6,0)')
            assert page.evaluate('window.blockout.moveTo(-3.488372093,-58.372093023)')
        else:
            assert not page.evaluate('window.blockout.moveTo(0,-6.5)')
            assert not page.evaluate('window.blockout.moveTo(-32,-1)')
            assert page.evaluate('window.blockout.moveTo(-23,-1)')
            # Start west of the opening, then use actual keyboard motion toward the room.
            assert page.evaluate('window.blockout.moveTo(-14,-1)')
            page.keyboard.down('KeyD');page.wait_for_timeout(800);page.keyboard.up('KeyD')
            assert page.evaluate('window.blockout.state.position.x') > -12
        page.get_by_role('button',name='Return to entrance',exact=True).click()
        assert page.evaluate('window.blockout.state.position') == initial
        checks.append(f'{area}: overhead, terrain, real keyboard movement, collision and entrance reset pass')
    page.select_option('#site','FC05')
    assert page.evaluate('window.blockout.state.area') == 'world'
    assert page.locator('#site').input_value() == 'FC05'
    page.set_viewport_size({'width':390,'height':844})
    page.locator('[data-view="map"]').click()
    page.get_by_role('button',name='Reset view',exact=True).click()
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
    page.locator('[data-area="bedroom"]').click()
    assert page.locator('#map').bounding_box()['width'] <= 390
    checks.append('390 px mobile layout fits without horizontal overflow; cross-area selection stays consistent')
    assert not errors, errors
    assert not failed_requests, failed_requests
    browser.close()
result={'status':'pass','browser':'Chromium / Playwright / software WebGL2','viewports':['1440×960','390×844'],'checks':checks,'page_errors':errors,'failed_requests':failed_requests,'limits':'Software-rendered inspection and local keyboard/collision tests; not production GPU performance, mobile touch walking or full-world game navigation'}
(ROOT/'browser-verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
