import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
const b = await chromium.launch({ args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const p = await b.newPage({ viewport: { width: 960, height: 540 } }); p.on('pageerror', e => console.log('ERR', e.message));
let bytes=0, hd=0; p.on('response', async r => { const u=r.url(); if(u.includes('.glb')){ try{const l=(await r.body()).length; bytes+=l; if(u.includes('near-hd')) hd+=l;}catch{} } });
await p.goto(`http://localhost:8080/?quality=high&scenes=0&dusk=1&cam=${process.env.CAM||'-6400,200,2400,-6600,175,2145,60'}`, { waitUntil: 'load' });
for (let i=0;i<(+process.env.N||4);i++){ await p.waitForTimeout(25000);
const r = await p.evaluate(() => { const { scene } = window.__castle; const out={}; for (const c of scene.children){ let t=0,d=0; c.traverseVisible(o=>{ if(!o.isMesh||!o.geometry) return; const g=o.geometry; const n=(g.index?g.index.count:g.attributes.position.count)/3*(o.isInstancedMesh?o.count:1); t+=n; d++;}); out.all=(out.all||0)+t; if(c.isInstancedMesh) out.fill=(out.fill||0)+t; } out.all=Math.round(out.all/1e3)+'k'; out.fill=Math.round((out.fill||0)/1e3)+'k'; out.mem=JSON.stringify(window.__castle.renderer.info.memory); const L=[]; for (const c of scene.children) if(c.isInstancedMesh&&c.visible&&c.count){const g=c.geometry;L.push([Math.round((g.index?g.index.count:g.attributes.position.count)/3*c.count/1e3),c.count,(c.material.map&&c.material.map.image?c.material.map.image.width:0),c.material.name||c.material.type]);} L.sort((a,b)=>b[0]-a[0]); out.top=L.slice(0,12); return out; });
console.log((i+1)*25,'s glb MB',(bytes/1e6).toFixed(1),'hd',(hd/1e6).toFixed(1),JSON.stringify(r)); }
await b.close();
