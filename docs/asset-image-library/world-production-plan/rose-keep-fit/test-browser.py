import asyncio, hashlib, json
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parent
URL='http://127.0.0.1:8765/docs/asset-image-library/world-production-plan/rose-keep-fit/'
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  page=await browser.new_page(viewport={'width':1440,'height':960});errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  await page.goto(URL);await page.wait_for_function('window.roseFit?.ready || window.roseError');assert not await page.evaluate('window.roseError')
  camera=await page.evaluate('window.roseFit.state.camera');expected_camera=json.loads((ROOT/'review-data.json').read_text())['camera']
  assert all(abs(a-b)<1e-6 for a,b in zip(camera['position'],expected_camera['location']))
  assert camera['vertical_fov']==expected_camera['verticalFovDegrees']
  captures=[];render_samples=[];(ROOT/'review').mkdir(exist_ok=True)
  async def capture(name):
   await page.screenshot(path=str(ROOT/'review'/f'{name}.png'),full_page=True)
   captures.append({'file':f'review/{name}.png','sha256':hashlib.sha256((ROOT/'review'/f'{name}.png').read_bytes()).hexdigest()})
   render_samples.append(await page.evaluate('window.roseFit.state.render'))
  await capture('assembly-clay')
  await page.locator('#palette').check();await capture('assembly-palette')
  await page.locator('[data-view="overhead"]').click();await page.locator('#palette').uncheck();await capture('overhead')
  await page.locator('#part').select_option('RETURN-FOOTING');assert await page.evaluate('window.roseFit.state.selected')=='RETURN-FOOTING';assert '0.8 m' in await page.locator('#detail').inner_text()
  await page.locator('#reset').click();await page.locator('#guards').uncheck();assert await page.evaluate('window.roseFit.model.canStand(.9,-4.4)') is False;assert await page.evaluate('window.roseFit.fixture.layers.guards.visible') is False;await page.locator('#guards').check()
  await page.locator('[data-view="walk"]').click();await page.keyboard.down('KeyW');await page.wait_for_function('window.roseFit.state.position.z < 1.8');await page.keyboard.up('KeyW');keyboard_end=await page.evaluate('window.roseFit.state.position');assert abs(keyboard_end['x'])<.001
  results=[]
  for index,name in enumerate(['entrance','terrace']):
   await page.locator('#route-choice').select_option(name);await page.locator('#run').click()
   await page.wait_for_function(f'window.roseFit.state.completed.length > {index} || document.querySelector("#result").className === "fail"',timeout=60000)
   completed=await page.evaluate('window.roseFit.state.completed');assert len(completed)>index,await page.locator('#result').inner_text()
   result=completed[index];assert result['status']=='pass' and result['return_error_m']<1e-6 and abs(result['max_floor_m']-1.5)<1e-6
   expected=await page.evaluate('(name)=>window.roseFit.model.auditRoute(window.roseFit.model.routes[name]).length_m',name);assert abs(result['travelled_m']-expected)<.01
   results.append(result)
  await capture('returned-apron')
  await page.locator('#reset').click();await page.locator('#palette').check();await page.locator('#part').select_option('ENTRANCE-WALL');await page.evaluate('window.roseFit.cameraPose([3.5,3.8,-5],[0,3.3,-11.5])');await capture('entrance')
  await page.locator('#reset').click();await page.set_viewport_size({'width':390,'height':844});await page.locator('[data-view="walk"]').click()
  button=page.get_by_role('button',name='Move forward',exact=True);await button.scroll_into_view_if_needed();box=await button.bounding_box();await page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2);await page.mouse.down();await page.wait_for_function('window.roseFit.state.position.z < 1.8');await page.mouse.up();touch_end=await page.evaluate('window.roseFit.state.position');await capture('mobile')
  assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth')
  assert not errors,errors
  report={'status':'pass','scope':'Separate local Function fixture; no final model acceptance, regional route or device-FPS claim','production_camera':camera,'keyboard_movement':keyboard_end,'pointer_control_movement':touch_end,'complete_browser_returns':results,'guard_visual_toggle_preserves_collision':True,'part_selection_works':True,'mobile_no_horizontal_overflow':True,'page_errors':errors,'render_samples':render_samples,'captures':captures,'sources':json.loads((ROOT/'review-data.json').read_text())['sources']}
  (ROOT/'browser-verification.json').write_text(json.dumps(report,indent=2)+'\n')
  print(json.dumps({'status':'pass','returns':results,'captures':len(captures),'page_errors':errors},indent=2))
  await browser.close()
asyncio.run(main())
