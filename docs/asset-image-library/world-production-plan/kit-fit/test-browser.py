"""Start a repository-root HTTP server, then run this script with Python Playwright."""
import argparse
import json
from pathlib import Path
import numpy as np
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parent
parser=argparse.ArgumentParser()
parser.add_argument('--url',default='http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/kit-fit/')
parser.add_argument('--chromium',default='/usr/bin/chromium')
args=parser.parse_args()
(ROOT/'review').mkdir(exist_ok=True)
errors,failed,checks=[],[],[]
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=args.chromium,headless=True,args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    page=browser.new_page(viewport={'width':1440,'height':960})
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda e:errors.append(e.text) if e.type=='error' else None)
    page.on('response',lambda r:failed.append(f'{r.status} {r.url}') if r.status>=400 else None)
    page.on('requestfailed',lambda r:failed.append(r.url))
    page.goto(args.url,wait_until='networkidle');page.wait_for_function('window.kitFit?.ready',timeout=30000)
    geometry=page.evaluate('window.kitFit.geometryChecks()')
    assert geometry['actual_arch_passage_clear'] and geometry['actual_wall_side_solid']
    assert abs(geometry['front_face_distance_m']-1.25)<.001 and geometry['front_face_normal_x']<-.99
    assert geometry['triangles']<=geometry['budget']['prototype_triangle_budget']
    assert geometry['draw_calls']<=geometry['budget']['prototype_draw_call_budget']
    assert page.locator('#part option').count()==28
    page.wait_for_timeout(200)
    page.screenshot(path=str(ROOT/'review'/'assembly.png'))
    # Guard against a technically loaded WebGL scene whose saved review frame is blank.
    pixels=np.array(Image.open(ROOT/'review'/'assembly.png').convert('RGB'))[250:850,150:1000].astype(int)
    nonbackground=np.count_nonzero(np.max(np.abs(pixels-np.array([227,231,223])),axis=2)>20)
    assert nonbackground>5000, f'Blank review frame: {nonbackground} geometry pixels'
    checks.append('Real arch raycasts, outward winding, rendered geometry and triangle/draw-call budgets pass')
    page.locator('[data-view="plan"]').click();page.wait_for_timeout(150);page.screenshot(path=str(ROOT/'review'/'overhead.png'))
    page.select_option('#part','FLIGHT-B');assert '90°' in page.locator('#detail').inner_text()
    page.locator('[data-view="orbit"]').click();page.check('#palette');page.select_option('#glass-color','green')
    page.uncheck('#glass');assert not page.evaluate('window.kitFit.kit.canStand(1.1,-1.5)')
    page.check('#glass');page.select_option('#part','');page.click('#reset');page.wait_for_timeout(150)
    page.screenshot(path=str(ROOT/'review'/'material-slots.png'))
    checks.append('Same-mesh overhead, module selection and material variants work; hidden glass retains collision')
    page.locator('[data-view="walk"]').click();initial=page.evaluate('window.kitFit.state.position')
    page.keyboard.down('KeyW');page.wait_for_timeout(550);page.keyboard.up('KeyW')
    assert page.evaluate('window.kitFit.state.position.z') < initial['z']-.2
    page.click('#reset');page.click('#run');page.wait_for_function("document.getElementById('result').classList.contains('pass')",timeout=90000)
    state=page.evaluate('window.kitFit.state')
    assert state['visited']==[1,2,3,4] and state['max_y']==3
    assert abs(state['walked_m']-29.4)<.01 and state['position']==initial and state['floor_y']==0
    page.screenshot(path=str(ROOT/'review'/'walk-return.png'))
    # Switching out of continuous walking must leave a stable, nonblank static review frame.
    page.locator('[data-view="orbit"]').click();page.wait_for_timeout(200)
    assert page.evaluate('document.documentElement.scrollHeight<=innerHeight+1')
    checks.append('Real keyboard movement and the shared swept solver climb 20 risers, pass the arch and return 29.4 m')
    page.set_viewport_size({'width':390,'height':844});page.locator('[data-view="walk"]').click()
    page.click('#reset');button=page.locator('[data-key="KeyW"]');box=button.bounding_box()
    page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);page.mouse.down();page.wait_for_timeout(350);page.mouse.up()
    assert page.evaluate('window.kitFit.state.position.z')<2.9
    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    checks.append('390 px mobile layout and on-screen movement controls work without horizontal overflow')
    assert not errors,errors
    assert not failed,failed
    browser.close()
result={'status':'pass','browser':'Chromium / Playwright / software WebGL2','viewports':['1440×960','390×844'],'checks':checks,'geometry':geometry,'return_test':state,'page_errors':errors,'failed_requests':failed,'limits':'Separate proposed fixture; software rendering is not production GPU performance, accepted decorative meshes or game integration'}
(ROOT/'browser-verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
