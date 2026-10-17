"""Fill pass 2 (owner, Oct 17 12:26 "it's looking very plain"): place the owner's new models densely across the map
and on the great ridge. Reads plan_new.json, the merged terrain (ridge/out), roads (fill/paths/paths.json),
the current placements (fill/world-placements.json) and the converted models (fill/glb2/*.json).
Writes ridge/out/world-placements.json (old items re-seated on the merged terrain + new items) and a map of what went where."""
import numpy as np, json, math, os
from scipy import ndimage as ndi
from PIL import Image, ImageDraw
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
R = f'{S}/ridge'; OUT = f'{R}/out'; F = f'{S}/fill'
MAPW, CX, CZ, L = 20691.0, -709.5, 2260.5, 40960.0
hi = np.load(f'{OUT}/inner.npz')['h'].astype(np.float64); N = hi.shape[0]
ho = np.load(f'{OUT}/outer.npz')['h'].astype(np.float64); G = ho.shape[0]
T0 = np.load(f'{F}/paths/terrain.npz')['h'].astype(np.float64)
B = np.load(f'{F}/terrain/biome.npy')
plan = json.load(open(f'{R}/plan_new.json'))
data = json.load(open(f'{S}/schema/game-data.json'))
PL = {p['id']: (p['at']['x'], p['at']['z']) for p in data['places']}
paths = json.load(open(f'{F}/paths/paths.json'))
wp = json.load(open(f'{F}/world-placements.json'))
dims = {}
for d_ in (f'{F}/glb', f'{F}/glb2'):
    for fn in os.listdir(d_):
        if fn.endswith('.json') and not fn.endswith('card.json'):
            try: j = json.load(open(f'{d_}/{fn}')); dims[j['name']] = j['dims']
            except Exception: pass
rng = np.random.default_rng(17)

def inner_ij(x, z): return (z - CZ + MAPW / 2) / MAPW * N - 0.5, (x - CX + MAPW / 2) / MAPW * N - 0.5
def outer_ij(x, z): return (z - CZ + L / 2) / L * G - 0.5, (x - CX + L / 2) / L * G - 0.5
def H(x, z):
    x, z = np.atleast_1d(x).astype(float), np.atleast_1d(z).astype(float)
    i, j = inner_ij(x, z); ins = (i >= 0) & (i <= N - 1) & (j >= 0) & (j <= N - 1)
    oi, oj = outer_ij(x, z)
    out = ndi.map_coordinates(ho, [oi, oj], order=1, mode='nearest')
    out[ins] = ndi.map_coordinates(hi, [i[ins], j[ins]], order=1)
    return out
def biome(x, z):
    i, j = inner_ij(x, z)
    if not (0 <= i < N and 0 <= j < N): return -1
    return int(B[int(round(i)), int(round(j))])
gyi, gxi = np.gradient(hi, MAPW / N); SLI = np.hypot(gxi, gyi)
gyo, gxo = np.gradient(ho, L / G); SLO = np.hypot(gxo, gyo)
def slope(x, z):
    i, j = inner_ij(x, z)
    if 0 <= i < N and 0 <= j < N: return float(SLI[int(round(i)), int(round(j))])
    oi, oj = outer_ij(x, z); return float(SLO[int(np.clip(round(oi), 0, G - 1)), int(np.clip(round(oj), 0, G - 1))])

# old items: re-seat on the merged terrain (only the corners and the map edge changed)
d_old = hi - T0
items = []
occupied = []   # x, z, radius
for it in wp['items']:
    i, j = inner_ij(it['x'], it['z'])
    dy = float(ndi.map_coordinates(d_old, [[i], [j]], order=1)[0]) if (0 <= i < N and 0 <= j < N) else 0.0
    it = dict(it); it['y'] = round(it['y'] + (dy if it['place'] not in ('B30', 'ARRIVAL') else 0), 2)
    items.append(it)
    dm = dims.get(it['m'], [10, 10, 10]); occupied.append((it['x'], it['z'], max(dm[0], dm[1]) * it['scale'] * 0.5))
occ = np.array(occupied)
# roads as points (keep 12 m + half the road width clear)
rp = []
for p in paths['paths']:
    for a, _, b in p['points']: rp.append((a, b, p['width'] / 2 + 12))
rp = np.array(rp)
plazas = [(q['x'], q['z'], q['radius']) for q in paths['plazas']]
from scipy.spatial import cKDTree
road_tree = cKDTree(rp[:, :2])
new_occ = []
def free(x, z, r):
    if len(occ) and np.any((occ[:, 0] - x) ** 2 + (occ[:, 1] - z) ** 2 < (occ[:, 2] + r) ** 2): return False
    for a, b, c in new_occ[-6000:]:
        if (a - x) ** 2 + (b - z) ** 2 < (c + r) ** 2: return False
    near = road_tree.query_ball_point([x, z], r + 30)
    return not any(np.hypot(rp[k, 0] - x, rp[k, 1] - z) < rp[k, 2] + r * 0.8 for k in near)
def near_place(x, z, r):
    return any((x - a) ** 2 + (z - b) ** 2 < r * r for a, b in PL.values())

def put(m, x, z, size, place, y=None, rot=None, sink=0.04):
    dm = dims[m]; k = size / max(dm)
    if y is None:
        fp = max(dm[0], dm[1]) * k * 0.35
        y = float(H([x, x + fp, x - fp, x, x], [z, z, z, z + fp, z - fp]).min()) - sink * dm[2] * k
    items.append(dict(m=m, place=place, x=round(float(x), 2), y=round(float(y), 2), z=round(float(z), 2),
                      rotY=round(float(rng.uniform(0, 2 * math.pi) if rot is None else rot), 4), scale=round(float(k), 5), new=True))
    new_occ.append((x, z, max(dm[0], dm[1]) * k * 0.5))
    return True

hmax_i = ndi.maximum_filter(hi, size=25)
counts = {}
for e in plan['items']:
    m = e['m']
    if m not in dims: print('missing', m); continue
    kind, n, size = e['where'], e.get('n', 1), e['size']
    got = 0; tries = 0
    def jit(): return size * rng.uniform(0.85, 1.15) if e.get('vary', True) else size
    while got < n and tries < n * 600:
        tries += 1; sz = jit(); r = sz * 0.55
        if kind == 'place':                    # round a place, outside its own centre
            cx, cz = PL[e['place']]; a = rng.uniform(0, 2 * math.pi); d = e.get('r0', 160) + (e['r'] - e.get('r0', 160)) * math.sqrt(rng.uniform(0, 1))
            x, z = cx + d * math.cos(a), cz + d * math.sin(a)
            h = H(x, z)[0]
            if h < 1.5 or slope(x, z) > 0.45 or not free(x, z, r): continue
            put(m, x, z, sz, e['place']); got += 1
        elif kind in ('hilltop', 'biome', 'coast', 'wild'):
            x, z = rng.uniform(CX - MAPW / 2 + 300, CX + MAPW / 2 - 300), rng.uniform(CZ - MAPW / 2 + 300, CZ + MAPW / 2 - 300)
            h = H(x, z)[0]; bi = biome(x, z)
            if 'biomes' in e and bi not in e['biomes']: continue
            if bi == 21 or math.hypot(x, z) < 1700: continue        # the palace grounds stay as designed
            if kind == 'coast' and not (1.5 < h < 14): continue
            if kind != 'coast' and h < 3: continue
            if h > e.get('hmax', 1400) or slope(x, z) > e.get('smax', 0.5): continue
            if kind == 'hilltop':
                i, j = inner_ij(x, z)
                if hi[int(round(i)), int(round(j))] < hmax_i[int(round(i)), int(round(j))] - 4: continue
            if near_place(x, z, e.get('away', 350)) or not free(x, z, r): continue
            put(m, x, z, sz, 'wild'); got += 1
        elif kind == 'roadside':
            p = paths['paths'][rng.integers(len(paths['paths']))]
            if p['kind'] not in e.get('kinds', ['road', 'royal']): continue
            pts = p['points']; q = rng.integers(len(pts) - 1)
            (x0, _, z0), (x1, _, z1) = pts[q], pts[q + 1]
            dx, dz = x1 - x0, z1 - z0; ln = math.hypot(dx, dz) or 1
            side = rng.choice([-1, 1]); off = p['width'] / 2 + 14 + r
            x, z = x0 + dx * 0.5 - dz / ln * off * side, z0 + dz * 0.5 + dx / ln * off * side
            if H(x, z)[0] < 2 or slope(x, z) > 0.4 or near_place(x, z, 200) or not free(x, z, r * 0.9): continue
            put(m, x, z, sz, 'road', rot=math.atan2(dx, dz) + (math.pi / 2) * side); got += 1
        elif kind == 'plaza':
            if not plazas: break
            cx, cz, pr = plazas[rng.integers(len(plazas))]; a = rng.uniform(0, 2 * math.pi); d = pr + 6 + rng.uniform(0, 40)
            x, z = cx + d * math.cos(a), cz + d * math.sin(a)
            if H(x, z)[0] < 1.5 or not free(x, z, r): continue
            put(m, x, z, sz, 'plaza', rot=a + math.pi); got += 1
        elif kind == 'sky':                    # floats above the land, between alt0 and alt1 over the ground
            cx, cz = e.get('centre', [CX, CZ]); a = rng.uniform(0, 2 * math.pi); d = e['r'] * math.sqrt(rng.uniform(0.05, 1))
            x, z = cx + d * math.cos(a), cz + d * math.sin(a)
            if not free(x, z, r * 0.7): continue
            y = max(H(x, z)[0], 0) + rng.uniform(*e['alt'])
            put(m, x, z, sz, e.get('place', 'sky'), y=y); got += 1
        elif kind == 'sea':                    # ships at anchor in sheltered water
            x, z = rng.uniform(CX - MAPW / 2 + 500, CX + MAPW / 2 - 500), rng.uniform(CZ - MAPW / 2 + 500, CZ + MAPW / 2 - 500)
            h = H(x, z)[0]
            if not (-80 < h < -6) or not free(x, z, r): continue
            d_land = np.min(H(x + np.array([300, -300, 0, 0]), z + np.array([0, 0, 300, -300])))
            if d_land > 0: continue
            put(m, x, z, sz, 'sea', y=-0.25 * dims[m][2] * sz / max(dims[m])); got += 1
        elif kind == 'ridge':                  # the great ridge: foothills, spurs and high ledges outside the map
            a = rng.uniform(0, 2 * math.pi); d = rng.uniform(10500, 19000)
            x, z = CX + d * math.cos(a), CZ + d * math.sin(a)
            h = H(x, z)[0]
            if not (e.get('hmin', 150) < h < e.get('hmax', 2500)) or slope(x, z) > e.get('smax', 0.55) or not free(x, z, r): continue
            put(m, x, z, sz, 'ridge'); got += 1
    counts[m] = counts.get(m, 0) + got
    if got < n: print('short', m, kind, got, '/', n)
models = sorted({it['m'] for it in items})
wp2 = dict(wp); wp2['items'] = items; wp2['models'] = models
wp2['ridge'] = 'Oct 17 13:00: y seated on ridge/out (the great crescent ridge merged at the map corners); items with new=true come from the owner\'s Oct 17 models (fill/glb2)'
json.dump(wp2, open(f'{OUT}/world-placements.json', 'w'))
print('items', len(items), 'new', sum(1 for i in items if i.get('new')), 'models', len(models))
json.dump(counts, open(f'{OUT}/new-counts.json', 'w'), indent=0)
# map of the new items over the outer hillshade
im = Image.open(f'{OUT}/outer-hillshade.jpg').convert('RGB'); U = im.size[0]; d = ImageDraw.Draw(im)
for it in items:
    if not it.get('new'): continue
    px, pz = (it['x'] - CX + L / 2) / L * U, (it['z'] - CZ + L / 2) / L * U
    c = (255, 210, 80) if it['place'] == 'sky' else (255, 90, 160) if it['place'] == 'ridge' else (255, 255, 255)
    d.ellipse([px - 2, pz - 2, px + 2, pz + 2], fill=c)
im.save(f'{OUT}/new-items-map.jpg', quality=88)
