import json, sys, numpy as np, math
from PIL import Image, ImageDraw
O = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/ridge/out'
pid = sys.argv[1]; T = json.load(open(f'{O}/towns.json'))[pid]; W = json.load(open(f'{O}/world-placements.json')); P = json.load(open(f'{O}/paths.json'))
R = T['r'] + 500; sz = 1000; k = sz / (2 * R)
h = np.load(f'{O}/inner.npz')['h']; MAPW, CX, CZ = 20691.0, -709.5, 2260.5; cs = MAPW / h.shape[0]
xs = T['x'] - R + (np.arange(sz) + 0.5) / k; zs = T['z'] - R + (np.arange(sz) + 0.5) / k
ii = ((zs - CZ + MAPW / 2) / cs).astype(int); jj = ((xs - CX + MAPW / 2) / cs).astype(int)
a = h[np.ix_(ii, jj)]; gz, gx = np.gradient(a); sh = np.clip(0.7 - (gx + gz) * 0.08, 0.2, 1)
t = np.clip((a - a.min()) / (np.ptp(a) + 1), 0, 1)
img = (np.stack([0.4 + 0.5 * t, 0.55 + 0.3 * t, 0.35 + 0.3 * t], -1) * sh[..., None] * 255).astype(np.uint8)
im = Image.fromarray(img); d = ImageDraw.Draw(im)
f = lambda x, z: ((x - T['x'] + R) * k, (z - T['z'] + R) * k)
for p in P['paths']:
    if p.get('from_') == pid or p['kind'] in ('road', 'royal', 'trail'):
        pts = [f(q[0], q[2]) for q in p['points']]
        if any(0 <= x < sz and 0 <= y < sz for x, y in pts): d.line(pts, fill=(235, 220, 190), width=max(1, int(p['width'] * k)))
for it in W['items']:
    if it['place'] != pid: continue
    x, y = f(it['x'], it['z']); r = {'house': 5, 'lantern': 1, 'plaza': 4, 'hero': 9}.get(it.get('town'), 3)
    d.ellipse([x - r, y - r, x + r, y + r], fill={'house': (190, 80, 60), 'lantern': (255, 230, 120), 'plaza': (90, 120, 220), 'hero': (255, 255, 255)}.get(it.get('town'), (0, 0, 0)))
im.save(f'{O}/town-{pid}.jpg', quality=85)
