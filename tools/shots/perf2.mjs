import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const CAMS = { walk: '-5600,185.8,3000,-6400,178,2000,70', pfar: '900,1050,5600,0,1150,0,50', deck: '-560,694,9000,-355,694,6420,60', town: '-6400,200,2400,-6600,175,2145,60' };
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
for (const k of (process.env.ONLY||'walk,pfar,deck').split(',')) {
  const p = await b.newPage({ viewport: { width: 960, height: 540 } });
  await p.goto(`http://localhost:8080/?quality=high&scenes=0&dusk=1&cam=${CAMS[k]}`, { waitUntil: 'load' });
  await p.waitForTimeout(+(process.env.WAIT||50000));
  const r = await p.evaluate(() => {
    const { scene, renderer } = window.__castle, info = renderer.info.render;
    const by = {};
    const top = (o) => { let n = o, path = []; while (n.parent && n.parent !== scene) { path.push(n.parent.name||''); n = n.parent; } return (n.name || n.type) + '/' + path.slice(-2).join('>') + '/' + (o.name || '').slice(0, 18) + '/' + (o.material && (o.material.type||'')) + (o.isInstancedMesh?'/I':''); };
    scene.traverseVisible((o) => {
      if (!o.isMesh && !o.isPoints) return;
      const g = o.geometry; if (!g) return;
      const tri = (g.index ? g.index.count : (g.attributes.position?.count || 0)) / 3;
      const inst = o.isInstancedMesh ? o.count : 1;
      if (!inst) return;
      const key = top(o).replace(/\d+/g, '#');
      const e = by[key] || (by[key] = { draws: 0, tris: 0 });
      e.draws++; e.tris += tri * inst;
    });
    const list = Object.entries(by).sort((a, b) => b[1].tris - a[1].tris).slice(0, 18).map(([k, v]) => `${k}: ${v.draws} draws, ${(v.tris / 1e6).toFixed(2)}M tri`);
    const tot = Object.values(by).reduce((a, v) => [a[0] + v.draws, a[1] + v.tris], [0, 0]);
    return { calls: info.calls, tris: info.triangles, est: tot, list, px: renderer.getPixelRatio(), mem: renderer.info.memory };
  });
  console.log('==', k, JSON.stringify({ calls: r.calls, tris: r.tris, est: r.est, px: r.px, mem: r.mem }));
  console.log(r.list.join('\n'));
  await p.close();
}
await b.close();
