"""Move every placed model's y by the ground change between the first crescent terrain (terrain_orig, which world-placements-v1 sits on) and the new one (paths/terrain)."""
import json, numpy as np
from scipy import ndimage as ndi
F = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/fill'
a = np.load(f'{F}/terrain_orig.npz')['h']; b = np.load(f'{F}/paths/terrain.npz')['h']; D = (b - a).astype(np.float64); N = D.shape[0]
d = json.load(open(f'{F}/world-placements-v1.json')); it = d['items']
xs = np.array([i['x'] for i in it]); zs = np.array([i['z'] for i in it])
dl = ndi.map_coordinates(D, [(zs / 2.75 / 6 + 490) * N / 1254 - 0.5, (xs / 2.75 / 6 + 670) * N / 1254 - 0.5], order=1)
moved = 0
for k, o in enumerate(it):
    if o['place'] in ('B30', 'ARRIVAL') or abs(dl[k]) < 0.3: continue
    o['y'] = round(o['y'] + float(dl[k]), 2); moved += 1
d['geology'] = 'Oct 17: y seated on design/world-fill/terrain (ring extended round the north with a sea mouth, geology, roads)'
json.dump(d, open(f'{F}/world-placements.json', 'w'), separators=(',', ':'))
print('reseated', moved, 'max', float(np.abs(dl).max()))
