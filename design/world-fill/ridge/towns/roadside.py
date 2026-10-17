"""Something every few hundred metres along the roads (Oct 17, after the owner's "a lot of flat land"): hamlets of 3-6 houses
facing the road, farms with a windmill, ruins with fallen pillars, rock outcrops, and small rocks along the verges.
python roadside.py   (reads/writes ridge/out world-placements.json; place 'roadside'; reads towns.json, paths.json, inner.npz)
Ground is not reshaped: each building sits at the lowest corner of its footprint so it never floats."""
import json, math, os, glob
import numpy as np
from scipy import ndimage as ndi
R = os.path.dirname(os.path.abspath(__file__)); O = f'{R}/out'
D = '/home/user/birthday-castle/design/world-fill'
MAPW, CX, CZ = 20691.0, -709.5, 2260.5
h = np.load(f'{O}/inner.npz')['h'].astype(np.float64); N = h.shape[0]; cs = MAPW / N
W = json.load(open(f'{O}/world-placements.json')); P = json.load(open(f'{O}/paths.json'))
TOWNS = json.load(open(f'{O}/towns.json'))
G = json.load(open('/home/user/birthday-castle/design/game-schema/game-data.json'))
AT = {q['id']: (q['at']['x'], q['at']['z']) for q in G['places']}
DIMS = {}
for f in glob.glob(f'{D}/glb/*.json') + glob.glob(f'{D}/glb2/*.json'):
    try: DIMS[os.path.basename(f)[:-5]] = json.load(open(f))['dims']
    except Exception: pass
TK = lambda m: m + '_town' if os.path.exists(f'{O}/townkit/{m}_town.glb') else m
def ij(x, z): return (np.asarray(z) - CZ + MAPW / 2) / cs - 0.5, (np.asarray(x) - CX + MAPW / 2) / cs - 0.5
def Hs(x, z): i, j = ij(x, z); return ndi.map_coordinates(h, [np.atleast_1d(i), np.atleast_1d(j)], order=1, mode='nearest')
rng = np.random.default_rng(1023)
# (model, size m, 'p' plan or 'h' height)
HAMLET = {
    'medieval': [('Medieval_Cottage', 11), ('A_modular_medieval_ho', 12), ('Enchanted_Thatch_Cott', 11), ('Rpg_house', 12), ('house', 12), ('An_english_country_co', 13)],
    'coastal': [('Mediterranean_Villa', 13), ('Olive_Grove_Cottage', 11), ('Tiki_Pavilion', 10), ('Desert_Dwelling', 10)],
    'forest': [('Whimsical_Hobbit_Dwel', 10), ('Mosswood_Teardrop_Hou', 10), ('Toadstool_Tavern', 9), ('Enchanted_Thatch_Cott', 11)],
    'mountain': [('Timberstone_Tower_Hou', 8), ('Medieval_Cottage', 11), ('A_modular_medieval_ho', 12), ('Watchtower_T1', 8)],
}
OUTCROP = [('Majestic_Rock_Formati', 24, 'p'), ('Elephant_Rock_Formati', 18, 'p'), ('rock', 11, 'p'), ('Rock_Formations_Colle_2', 13, 'p'),
           ('Pine_Trees_on_a_Rocky', 20, 'p'), ('Basalt_Arch', 22, 'p'), ('Rocky_Archway', 16, 'p')]
RUIN = [('Ancient_Gateway_Ruins', 14, 'p'), ('Mossy_Timber_Ruins', 12, 'p'), ('Ancient_Stone_Circle', 20, 'p'), ('Ancient_Archway', 9, 'h'),
        ('England_Mystic_Ston', 16, 'p'), ('Runestone_Altar', 5, 'p')]
DEBRIS = [('Fallen_Pillar', 5, 'p'), ('Rubble_Pile', 6, 'p'), ('Stone', 4.5, 'h'), ('Mossy_Monolith', 4.5, 'h'), ('A_big_menhir_with_anc', 5, 'h')]
VERGE = [('Rock_Formation_Collec', 4, 'p'), ('Meadow_Rocks', 5, 'p'), ('Stone', 2.5, 'h'), ('Rubble_Pile', 3.5, 'p')]
def scale_for(m, size, kind='p'):
    d = DIMS[m]; return round(size / max(d[2] if kind == 'h' else max(d[0], d[1]), 1e-3), 4)
def foot(m, s): d = DIMS[m]; return 0.5 * math.hypot(d[0], d[1]) * s
def seat(x, z, r):
    pts = [(x, z)] + [(x + r * math.cos(a), z + r * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 8, endpoint=False)]
    return float(Hs([p[0] for p in pts], [p[1] for p in pts]).min())
def slope(x, z, r=20):
    hs = Hs([x - r, x + r, x, x], [z, z, z - r, z + r]); return max(abs(hs[1] - hs[0]), abs(hs[3] - hs[2])) / (2 * r)

W['items'] = [it for it in W['items'] if it['place'] != 'roadside']
roads = [p for p in P['paths'] if p['kind'] in ('road', 'royal')]
lines = [[(q[0], q[2]) for q in p['points']] for p in roads]
allpts = np.array([q for ln in lines for q in ln])
from scipy.spatial import cKDTree
road_tree = cKDTree(allpts)
item_tree = cKDTree(np.array([[it['x'], it['z']] for it in W['items']]))
def near_town(x, z, pad):
    for t in TOWNS.values():
        if math.hypot(x - t['x'], z - t['z']) < t['r'] + pad: return True
    return any(math.hypot(x - a, z - b) < 380 for a, b in AT.values())
def style_at(x, z, y):
    if y > 330: return 'mountain'
    if y < 25: return 'coastal'
    return 'forest' if rng.random() < 0.35 else 'medieval'

new = []; sites = []
def put(m, x, z, rot, s, tag, y=None):
    if m not in DIMS: return
    if y is None: y = seat(x, z, foot(m, s) * 0.7)
    new.append(dict(m=TK(m), place='roadside', x=round(x, 2), y=round(y, 2), z=round(z, 2), rotY=round(rot, 4), scale=s, new=True, town=tag))
def clear(x, z, r):
    d, _ = road_tree.query([x, z]); return d > r + 6 and not item_tree.query_ball_point([x, z], r + 4) and all(math.hypot(x - a, z - b) > r + q + 3 for a, b, q in placed)
placed = []
counts = dict(hamlet=0, farm=0, ruin=0, outcrop=0, verge=0)
for ln in lines:
    L = np.concatenate([[0], np.cumsum([math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(ln[:-1], ln[1:])])])
    if L[-1] < 50: continue
    def at(t):
        k = min(int(np.searchsorted(L, t, side='right')) - 1, len(ln) - 2); (ax, az), (bx, bz) = ln[k], ln[k + 1]
        dl = math.hypot(bx - ax, bz - az) + 1e-9; u = (t - L[k]) / dl
        return ax + (bx - ax) * u, az + (bz - az) * u, (bx - ax) / dl, (bz - az) / dl
    # small rocks on the verges, every ~90 m, alternating sides
    for t in np.arange(rng.uniform(20, 90), L[-1], 90.0):
        px, pz, tx, tz = at(t); side = 1 if rng.random() < 0.5 else -1
        m, size, kd = VERGE[rng.integers(len(VERGE))]; s = scale_for(m, size * rng.uniform(0.6, 1.4), kd); r = foot(m, s)
        x, z = px - tz * side * (9 + r + rng.uniform(0, 8)), pz + tx * side * (9 + r + rng.uniform(0, 8))
        if Hs(x, z)[0] > 1.5 and not near_town(x, z, 20) and clear(x, z, r):
            put(m, x, z, rng.uniform(0, 6.28), s, 'verge'); placed.append((x, z, r)); counts['verge'] += 1
    # a feature every ~420 m
    for t in np.arange(rng.uniform(120, 300), L[-1] - 60, 420.0):
        t = t + rng.uniform(-80, 80)
        if not 0 < t < L[-1]: continue
        px, pz, tx, tz = at(t); y0 = float(Hs(px, pz)[0])
        if y0 < 2 or near_town(px, pz, 150) or any(math.hypot(px - a, pz - b) < 300 for a, b in sites): continue
        sl = slope(px, pz); side = 1 if rng.random() < 0.5 else -1; nx, nz = -tz * side, tx * side
        roll = rng.random()
        kind = ('hamlet' if roll < 0.42 else 'farm' if roll < 0.55 else 'ruin' if roll < 0.78 else 'outcrop') if sl < 0.22 and y0 < 600 else ('ruin' if roll < 0.35 else 'outcrop')
        sites.append((px, pz))
        if kind in ('hamlet', 'farm'):
            pool = HAMLET[style_at(px, pz, y0)]; n = int(rng.integers(3, 7)) if kind == 'hamlet' else 2; k = 0
            for j in range(12):
                if k >= n: break
                tt = t + (j - 5) * 22 + rng.uniform(-4, 4)
                if not 0 < tt < L[-1]: continue
                qx, qz, ux, uz = at(tt); sd = side if j % 3 else -side; mx, mz = -uz * sd, ux * sd
                m, size = pool[rng.integers(len(pool))]; s = scale_for(m, size * rng.uniform(0.92, 1.08)); r = foot(m, s) * 0.8
                x, z = qx + mx * (8 + r), qz + mz * (8 + r)
                if Hs(x, z)[0] > 1.5 and clear(x, z, r):
                    put(m, x, z, math.atan2(-mx, -mz), s, kind); placed.append((x, z, r)); k += 1
            if k:
                extras = [('Windmill_Haven', 14, 'h'), ('Herbal_Harvest', 7, 'p'), ('Farmers_Market_Cart', 4, 'p')] if kind == 'farm' else [('Rustic_Market_Stall', 4, 'p'), ('Stone_Lantern', 2.8, 'h'), ('Stone_Lantern', 2.8, 'h')]
                for e, (m, size, kd) in enumerate(extras):
                    if m not in DIMS: continue
                    s = scale_for(m, size, kd); r = foot(m, s) * 0.8
                    for _ in range(6):
                        x, z = px + nx * (10 + r + rng.uniform(0, 30)) + tx * rng.uniform(-40, 40), pz + nz * (10 + r + rng.uniform(0, 30)) + tz * rng.uniform(-40, 40)
                        if Hs(x, z)[0] > 1.5 and clear(x, z, r): put(m, x, z, math.atan2(-nx, -nz), s, kind); placed.append((x, z, r)); break
                counts[kind] += 1
        else:
            m, size, kd = (RUIN if kind == 'ruin' else OUTCROP)[rng.integers(len(RUIN if kind == 'ruin' else OUTCROP))]
            s = scale_for(m, size * rng.uniform(0.85, 1.25), kd); r = foot(m, s) * 0.8
            for _ in range(5):
                off = 14 + r + rng.uniform(0, 30); x, z = px + nx * off, pz + nz * off
                if Hs(x, z)[0] > 1.5 and clear(x, z, r): break
            else: continue
            put(m, x, z, rng.uniform(0, 6.28), s, kind, seat(x, z, r) - 0.6); placed.append((x, z, r)); counts[kind] += 1
            for _ in range(int(rng.integers(2, 5))):
                dm, dsz, dk = (DEBRIS if kind == 'ruin' else VERGE)[rng.integers(len(DEBRIS if kind == 'ruin' else VERGE))]
                ds = scale_for(dm, dsz * rng.uniform(0.8, 1.6), dk); dr = foot(dm, ds); a = rng.uniform(0, 6.28); rr = r + dr + rng.uniform(2, 14)
                qx, qz = x + rr * math.cos(a), z + rr * math.sin(a)
                if Hs(qx, qz)[0] > 1.5 and clear(qx, qz, dr): put(dm, qx, qz, rng.uniform(0, 6.28), ds, kind); placed.append((qx, qz, dr))
W['items'] += new
json.dump(W, open(f'{O}/world-placements.json', 'w'))
json.dump(dict(counts=counts, items=len(new), sites=[[round(a, 1), round(b, 1)] for a, b in sites]), open(f'{O}/roadside.json', 'w'))
print(counts, 'items', len(new), 'models', sorted(set(it['m'] for it in new)))
