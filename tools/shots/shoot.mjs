// usage: node shoot.mjs <outprefix> [extra query]
import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const [,, out, extra = ''] = process.argv;
const CAMS = {
  bridge_on: '-640,698,10150,-300,690,6000,60',
  bridge_side: '900,620,8200,-500,640,7000,55',
  palace: '250,815,1700,0,860,0,55',
  pfar: '900,1050,5600,0,1150,0,50',
  town: '-6400,200,2400,-6600,175,2145,60',
  spawn_air: '-710,1100,13200,-300,650,5000,60',
  bsc: '-100,640,8300,-700,620,8800,60',
  deck: '-560,694,9000,-355,694,6420,60',
  up: '-560,694,9000,-355,2600,6420,70',
  bfar: '1800,900,7400,-500,600,6000,55',
  eye: '-6430,176,2320,-6600,176,2145,65',
  hills: '-3500,380,4800,-5200,150,2600,60',
  meadow: '-5200,200,3400,-6400,160,2000,62',
  walk: '-5600,185.8,3000,-6400,178,2000,70',
  // the beauty slice, heights above the ground (run with '&camh=1')
  s_eye: '-5600,1.7,3000,-6400,1.2,2000,60',
  s_back: '-6200,1.7,2450,-5400,4,3300,55',
  s_hill: '-5500,30,3150,-6300,0,2300,60',
  s_wood: '-5900,1.7,2700,-6300,3,2400,55',
  s_tarn: '-5975,2.2,2785,-6070,-1,2850,58',
  s_brook: '-5915,1.7,2580,-5950,0,2720,58',
  walk2: '-4500,104.6,3800,-3000,108,5000,70',
};
const only = process.env.ONLY ? process.env.ONLY.split(',') : Object.keys(CAMS);
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
for (const k of only) {
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 200)));
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 200)); });
  const url = `http://localhost:${process.env.PORT||8080}/?quality=${process.env.Q||'high'}&scenes=0&cam=${CAMS[k]}${extra}`;
  const t0 = Date.now();
  await p.goto(url, { waitUntil: 'load', timeout: 120000 });
  await p.waitForTimeout(+(process.env.WAIT || 25000));
  await p.evaluate(() => { for (const id of ['lobby','entry','overlay']) { const e = document.getElementById(id); if (e) e.style.display = 'none'; } document.querySelectorAll('.panel,.card,#ui,dialog').forEach(e => e.style.display='none'); });
  await p.waitForTimeout(1500);
  const ft = await p.evaluate(() => new Promise((res) => { const t0 = performance.now(); requestAnimationFrame(() => requestAnimationFrame(() => res(Math.round(performance.now() - t0)))); }));
  console.log(k, 'two frames ms', ft);
  await p.screenshot({ path: `${out}-${k}.jpg`, quality: 80, type: 'jpeg', timeout: 240000 });
  console.log(k, ((Date.now()-t0)/1000).toFixed(0)+'s', errs.slice(0,3).join(' | '));
  await p.close();
}
await b.close();
