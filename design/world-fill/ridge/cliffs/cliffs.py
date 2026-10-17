"""The palace on tall cliffs (owner, Oct 17 14:41): "the palace on a tall cliff, joined plateaus supported by arching
pillars, some tall pillars directly rising from water".
The palace plateau and its three terraces become one sheer-sided mesa standing out of a ring of water (a moat that
opens into Lantern Lake in the south). Satellite plateaus stand in the moat at the palace's own level, joined to it and
to the outer land by arched viaducts (level decks at 110.5 m); roads coming down from the higher land reach the bridge
heads through notched ramps. A few great sea stacks rise straight from the water, taller than the palace mesa.
Writes: out/inner.npz, out/outer.npz (box region), game/crescent-h.bin, game/outer-h.bin, out/cliffs.json,
out/paths.json (bridges + new y), out/world-placements.json (re-seated; drowned items dropped)."""
import numpy as np, json, math, os, shutil
from scipy import ndimage as ndi
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
R = f'{S}/ridge'; OUT = f'{R}/out'; GAME = f'{OUT}/game'
MAPW, CX, CZ, L = 20691.0, -709.5, 2260.5, 40960.0
if not os.path.exists(f'{OUT}/inner-pre-cliffs.npz'):
    for n in ('inner', 'outer'): shutil.copy(f'{OUT}/{n}.npz', f'{OUT}/{n}-pre-cliffs.npz')
    shutil.copy(f'{OUT}/world-placements.json', f'{OUT}/world-placements-pre-cliffs.json')
h0 = np.load(f'{OUT}/inner-pre-cliffs.npz')['h'].astype(np.float64); N = h0.shape[0]; cs = MAPW / N
rng = np.random.default_rng(23)
DECK = 110.5          # palace plateau 40 drawn m x 2.75 = 110; decks sit just above
# window round the palace
c = CX - MAPW / 2 + (np.arange(N) + 0.5) * cs; r_ = CZ - MAPW / 2 + (np.arange(N) + 0.5) * cs
j0, j1 = np.searchsorted(c, -4300), np.searchsorted(c, 4300); i0, i1 = np.searchsorted(r_, -4300), np.searchsorted(r_, 4700)
X, Z = np.meshgrid(c[j0:j1], r_[i0:i1]); hw = h0[i0:i1, j0:j1].copy()
def vn(x, z, f, seed):    # smooth value noise in [-1, 1]
    g = np.random.default_rng(seed).uniform(-1, 1, (64, 64)); return ndi.map_coordinates(g, [(z * f) % 63, (x * f) % 63], order=3, mode='wrap')
def sstep(x, a, b): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def box_sd(x, z, x0, x1, z0, z1):
    dx = np.maximum(x0 - x, x - x1); dz = np.maximum(z0 - z, z - z1)
    return np.hypot(np.maximum(dx, 0), np.maximum(dz, 0)) + np.minimum(np.maximum(dx, dz), 0)
# --- the palace mesa: the plateau box and the three terraces, exactly as the game builds them (layout.js)
PIECES = [(-1169, 1292, -1155, 935, 109.6), (-1292, 1292, 935, 1540, 109.6), (-1430, 1430, 1540, 1980, 66.0), (-1540, 1540, 1980, 2420, 22.0)]
dP = np.full(X.shape, 1e9); topP = np.zeros(X.shape)
for x0, x1, z0, z1, t in PIECES:
    d = box_sd(X, Z, x0, x1, z0, z1); topP = np.where(d < dP, t, topP); dP = np.minimum(dP, d)
# --- satellite plateaus (two carry places: B25 Crystal Conservatory, B32 Starfall Fairground)
MESAS = [dict(id='B25', x=-1155, z=-1485, r=250), dict(id='B32', x=-1826, z=608, r=360),
         dict(id='north', x=60, z=-1700, r=250), dict(id='northeast', x=1680, z=-1470, r=210),
         dict(id='east', x=1840, z=160, r=290), dict(id='west-n', x=-1880, z=-520, r=210),
         dict(id='southeast', x=2180, z=1560, r=230), dict(id='southwest', x=-2140, z=1700, r=230)]
dM = np.full(X.shape, 1e9)
for m in MESAS:
    a = np.arctan2(Z - m['z'], X - m['x']); q = np.hypot(X - m['x'], Z - m['z'])
    rr = m['r'] * (1 + 0.10 * np.sin(3 * a + m['x'] * 0.01) + 0.06 * np.sin(7 * a + m['z'] * 0.02))
    dM = np.minimum(dM, q - rr)
# --- great sea stacks: taller than the palace mesa, straight out of the water
STACKS = [dict(x=-700, z=-1750, r=110, h=235), dict(x=1250, z=-1700, r=95, h=200), dict(x=2500, z=-700, r=120, h=260),
          dict(x=-1750, z=-1250, r=85, h=180), dict(x=2550, z=900, r=100, h=215), dict(x=-2550, z=300, r=95, h=190),
          dict(x=-1250, z=2850, r=90, h=170), dict(x=1250, z=3000, r=100, h=205), dict(x=-2700, z=2400, r=110, h=150),
          dict(x=200, z=-2350, r=95, h=245), dict(x=-2350, z=-1500, r=90, h=170), dict(x=2300, z=-1900, r=85, h=230), dict(x=-2400, z=1100, r=80, h=160), dict(x=2450, z=-200, r=75, h=150)]
# --- the moat: water from the mesa's edge out to a wavy outer shore
ang = np.arctan2(Z, X)
Wm = 880 + 200 * np.sin(2 * ang + 0.7) + 110 * np.sin(5 * ang + 2.1) + 80 * vn(X, Z, 0.004, 3)
south = sstep(Z, 700, 1100)                                   # beside the terraces the moat runs into the lake
Wm = Wm * (1 - south) + 900 * south
base = -16 - 12 * sstep(dP, 80, 260) * sstep(-(dP - Wm), 80, 260) + 4 * vn(X, Z, 0.01, 4)    # water depth
inner_band = (dP > 0) & (dP < Wm)
def cliff(t, top, bot, lc):
    """sheer face with ledges: t = metres out from the edge (0 at the lip)"""
    u = np.clip(t / lc, 0, 1); f = 1 - u ** 0.55
    steps = np.round(f * 6) / 6; f = 0.65 * f + 0.35 * steps
    return bot + (top - bot) * f
h = hw.copy()
# palace mesa top (the game sets it exactly; this keeps colours and AO right) and its face
lc = 55 + 25 * (vn(X, Z, 0.02, 5) + 1)
h = np.where(dP <= 0, topP, h)
face = (dP > 0) & (dP < lc)
h = np.where(face, cliff(dP, topP, base, lc), h)
# open water out to the shore
h = np.where(inner_band & ~face, base, h)
# outer shore: the land drops sheer into the moat
t_out = dP - Wm                                               # >0 on land beyond the moat
lco = 45 + 20 * (vn(X, Z, 0.02, 6) + 1)
# beyond the moat the land is held below the palace mesa for a while, then climbs back to its own hills
cap = DECK - 8 + 0.22 * np.maximum(t_out - 250, 0) + 18 * vn(X, Z, 0.006, 9)
h = np.where(t_out >= 0, np.minimum(h, cap), h)
outer_face = (t_out > -lco) & (t_out < 0)
h = np.where(outer_face, np.minimum(hw, cliff(-t_out, np.clip(hw, 30, DECK - 8), base, lco)), h)
# satellite plateaus at deck level, sheer sides
lcm = 40 + 15 * (vn(X, Z, 0.03, 7) + 1)
h = np.where((dM > 0) & (dM < 190) & (dP > 0), np.minimum(h, np.where(dM < lcm + 120, base, cliff(190 - dM, np.maximum(hw, 30), base, 70))), h)
h = np.where(dM <= 0, DECK - 0.5, h)
mface = (dM > 0) & (dM < lcm)
h = np.where(mface, np.maximum(h, cliff(dM, DECK - 0.5, base, lcm)), h)
# sea stacks
for s in STACKS:
    q = np.hypot(X - s['x'], Z - s['z']); a = np.arctan2(Z - s['z'], X - s['x'])
    rr = s['r'] * (1 + 0.12 * np.sin(4 * a + s['x']) + 0.07 * np.sin(9 * a + s['z']))
    top = s['h'] + 6 * vn(X, Z, 0.03, 8)
    h = np.where(q <= rr, top, np.where(q < rr + 35, np.maximum(h, cliff(q - rr, top, base, 35)), h))
# --- bridges: palace mesa to each plateau, then roads that now cross water
def mesa_edge_point(x, z, towards):
    """walk from (x, z) toward `towards` until leaving the palace mesa; return the lip point"""
    tx, tz = towards; L_ = math.hypot(tx - x, tz - z); best = (x, z)
    for k in range(1, 4000):
        u = k / 4000; px, pz = x + (tx - x) * u, z + (tz - z) * u
        if min(box_sd(np.array(px), np.array(pz), *p[:4]) for p in PIECES[:2]) > 0: return px, pz
    return best
bridges = []
for m in MESAS:
    if m['id'] in ('southeast', 'southwest'): continue        # these join the lower terrace side by the lake: reached by boat and from the shore
    # nearest lip of the plateau toward the mesa
    ax, az = mesa_edge_point(0.35 * m['x'], 0.35 * m['z'], (m['x'], m['z']))
    d = math.hypot(m['x'] - ax, m['z'] - az); ux, uz = (m['x'] - ax) / d, (m['z'] - az) / d
    bx, bz = m['x'] - ux * m['r'] * 0.82, m['z'] - uz * m['r'] * 0.82
    bridges.append(dict(id=f'palace-{m["id"]}', a=[round(ax - ux * 30, 1), round(az - uz * 30, 1)], b=[round(bx + ux * 30, 1), round(bz + uz * 30, 1)], deck=DECK, width=12))
# notched ramps and deck runs for roads, from the old paths
P = json.load(open(f'{S}/fill/paths/paths.json'))
def H(hh, x, z):
    jj = (np.asarray(x) - X[0, 0]) / cs; ii = (np.asarray(z) - Z[0, 0]) / cs
    return ndi.map_coordinates(hh, [np.atleast_1d(ii), np.atleast_1d(jj)], order=1, mode='nearest')
inwin = lambda x, z: X[0, 0] < x < X[0, -1] and Z[0, 0] < z < Z[-1, 0]
dropped, road_bridges = [], []
newpaths = []
for p in P['paths']:
    pts = p['points']
    if not any(inwin(q[0], q[2]) for q in pts) or p['kind'] == 'royal': newpaths.append(p); continue
    hn = np.array([H(h, q[0], q[2])[0] if inwin(q[0], q[2]) else 99 for q in pts])
    hold = np.array([H(hw, q[0], q[2])[0] if inwin(q[0], q[2]) else 99 for q in pts])
    wet = (hn < 1.0) & (hold >= 1.0)                         # only water the cliffs made
    if not wet.any(): newpaths.append(p); continue
    # contiguous wet runs
    runs, k = [], 0
    while k < len(pts):
        if wet[k]:
            s0 = k
            while k < len(pts) and wet[k]: k += 1
            runs.append((s0, k - 1))
        else: k += 1
    lens = [sum(math.hypot(pts[t + 1][0] - pts[t][0], pts[t + 1][2] - pts[t][2]) for t in range(a, b)) if b > a else 0 for a, b in runs]
    if p['kind'] != 'royal' and (max(lens) > 1100 or any(a == 0 or b == len(pts) - 1 for a, b in runs)):
        dropped.append((p['kind'], p.get('from_'), p.get('to'), round(max(lens)))); continue
    p = dict(p); p['_runs'] = runs; newpaths.append(p)
    for a, b in runs:
        A, B = pts[max(a - 1, 0)], pts[min(b + 1, len(pts) - 1)]
        road_bridges.append(dict(path=p, a=(A[0], A[2]), b=(B[0], B[2]), ia=max(a - 1, 0), ib=min(b + 1, len(pts) - 1)))
# merge road crossings into the designed bridges when they share a gap; otherwise they become their own viaducts
def near(p, q, r): return math.hypot(p[0] - q[0], p[1] - q[1]) < r
for rb in road_bridges:
    p = rb['path']; pts = p['points']
    # notch ramps on the land ends so the road reaches the deck at DECK, climbing back at 12%
    for end, step in ((rb['ia'], -1), (rb['ib'], 1)):
        acc, k = 0.0, end
        while 0 <= k < len(pts):
            x, _, z = pts[k]
            if k != end: acc += math.hypot(pts[k][0] - pts[k - step][0], pts[k][2] - pts[k - step][2])
            target = DECK + 0.12 * acc
            hx = H(h, x, z)[0]
            if hx <= target + 0.5 and k != end: break
            q = np.hypot(X - x, Z - z); w = 1 - sstep(q, p['width'] / 2 + 10, p['width'] / 2 + 38)
            h = np.where(w > 0, np.minimum(h, h * (1 - w) + target * w), h)
            k += step
    bridges.append(dict(id=f'{p["kind"]}:{p.get("from_")}-{p.get("to")}', a=[round(rb['a'][0], 1), round(rb['a'][1], 1)], b=[round(rb['b'][0], 1), round(rb['b'][1], 1)], deck=DECK, width=max(8, p['width'] + 4)))
# drop duplicate viaducts (a road crossing along a palace-mesa bridge)
def ends_on(b, m): return any(math.hypot(q[0] - m['x'], q[1] - m['z']) < m['r'] + 150 for q in (b['a'], b['b']))
roadb = [b for b in bridges if not b['id'].startswith('palace-')]
bridges = [b for b in bridges if not (b['id'].startswith('palace-') and any(ends_on(r, m) and ends_on(b, m) and min(math.hypot(r['a'][0], r['a'][1]), math.hypot(r['b'][0], r['b'][1])) < 1800 for r in roadb for m in MESAS if b['id'][7:] == m['id']))]
uniq = []
for b in bridges:
    if any(near(b['a'], u['a'], 120) and near(b['b'], u['b'], 120) or near(b['a'], u['b'], 120) and near(b['b'], u['a'], 120) for u in uniq): continue
    uniq.append(b)
bridges = uniq
for b in bridges: b['length'] = round(math.hypot(b['b'][0] - b['a'][0], b['b'][1] - b['a'][1]), 1)
# --- write the terrain back
hi = h0.copy(); hi[i0:i1, j0:j1] = h
np.savez_compressed(f'{OUT}/inner.npz', h=hi.astype(np.float32))
ho = np.load(f'{OUT}/outer-pre-cliffs.npz')['h'].astype(np.float64); G = ho.shape[0]
co = CX - L / 2 + (np.arange(G) + 0.5) * L / G; ro = CZ - L / 2 + (np.arange(G) + 0.5) * L / G
oj0, oj1 = np.searchsorted(co, -4300), np.searchsorted(co, 4300); oi0, oi1 = np.searchsorted(ro, -4300), np.searchsorted(ro, 4700)
OX, OZ = np.meshgrid(co[oj0:oj1], ro[oi0:oi1])
ii = (OZ - CZ + MAPW / 2) / cs - 0.5; jj = (OX - CX + MAPW / 2) / cs - 0.5
ho[oi0:oi1, oj0:oj1] = ndi.map_coordinates(hi, [ii, jj], order=1)
np.savez_compressed(f'{OUT}/outer.npz', h=ho.astype(np.float32))
enc = lambda a: np.clip(np.rint((a + 500) * 7), 0, 65535).astype('<u2')
enc(hi.reshape(N // 2, 2, N // 2, 2).mean((1, 3))).tofile(f'{GAME}/crescent-h.bin')
enc(ho.reshape(G // 2, 2, G // 2, 2).mean((1, 3))).tofile(f'{GAME}/outer-h.bin')
# --- paths: new y on land, deck height across the water, bridge list
dH = hi - h0
def dh_at(x, z):
    i = (z - CZ + MAPW / 2) / cs - 0.5; j = (x - CX + MAPW / 2) / cs - 0.5
    return float(ndi.map_coordinates(dH, [[i], [j]], order=1)[0]) if 0 <= i < N and 0 <= j < N else 0.0
for p in newpaths:
    runs = p.pop('_runs', [])
    wetk = set(k for a, b in runs for k in range(a, b + 1))
    p['points'] = [[q[0], DECK if k in wetk else round(q[1] + dh_at(q[0], q[2]), 1), q[2]] for k, q in enumerate(p['points'])]
# promenades across the palace bridges (walkable decks), so every plateau is reachable
for b in bridges:
    if not b['id'].startswith('palace-'): continue
    n = max(2, int(b['length'] // 20))
    pts = [[round(b['a'][0] + (b['b'][0] - b['a'][0]) * k / n, 1), DECK, round(b['a'][1] + (b['b'][1] - b['a'][1]) * k / n, 1)] for k in range(n + 1)]
    newpaths.append(dict(kind='road', width=8, from_='B01', to=b['id'][7:], length_m=b['length'], points=pts, note='promenade over an arched viaduct (cliffs, Oct 17)'))
P2 = dict(P); P2['paths'] = newpaths
old_b = [b for b in P['bridges'] if not any(inwin(*q) and H(h, *q)[0] < 1 and H(h0[i0:i1, j0:j1], *q)[0] > 1 for q in [(b['start'][0], b['start'][2])])]
P2['bridges'] = old_b + [dict(on=b['id'], kind='viaduct', start=[b['a'][0], DECK, b['a'][1]], end=[b['b'][0], DECK, b['b'][1]], width=b['width']) for b in bridges]
P2['frame'] = P['frame'] + '; Oct 17 cliffs: bridges of kind viaduct are level decks at y=110.5 on arched pillars (cliffs.json)'
json.dump(P2, open(f'{OUT}/paths.json', 'w'))
# --- placements: re-seat on the new ground, drop what drowned
wp = json.load(open(f'{OUT}/world-placements-pre-cliffs.json'))
keep, drowned = [], 0
for it in wp['items']:
    x, z = it['x'], it['z']
    if inwin(x, z) and it['place'] not in ('sky', 'sea', 'B30', 'ARRIVAL') and not it['place'].startswith('B01'):
        hn = H(h, x, z)[0]; ho_ = H(hw, x, z)[0]
        if hn < 1.0 and ho_ >= 1.0: drowned += 1; continue
        it = dict(it); it['y'] = round(it['y'] + (hn - ho_), 2)
    keep.append(it)
wp['items'] = keep; wp['cliffs'] = 'Oct 17 14:41: re-seated on the palace cliffs and moat (ridge/cliffs.py)'
json.dump(wp, open(f'{OUT}/world-placements.json', 'w'))
json.dump(dict(frame='three.js metres, origin palace, x east, z south, y up', deck_y=DECK, water_y=0,
               palace_mesa=dict(pieces=[dict(x0=a, x1=b, z0=c_, z1=d, top=t) for a, b, c_, d, t in PIECES], note='sheer faces 55-105 m wide from the lip to the water'),
               mesas=[dict(m, top=DECK - 0.5) for m in MESAS], stacks=STACKS, bridges=bridges, dropped_paths=dropped),
          open(f'{OUT}/cliffs.json', 'w'), indent=1)
print('bridges', len(bridges), [(b['id'], b['length']) for b in bridges])
print('dropped paths', dropped); print('drowned items', drowned, 'kept', len(keep))
