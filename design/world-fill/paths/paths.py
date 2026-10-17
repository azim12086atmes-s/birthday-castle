"""Roads, trails, alleys and bridges for the crescent world (owner, Oct 17: "pathways, alleys, make it feel like an open world").
Roads are routed over the terrain (cheap along contours, dear up steep grades and over water, cheaper again on roads already
built, so routes merge into a network with junctions). Trails climb to the hilltop relics; alleys link the buildings of each
village to its plaza. The ground under roads is smoothed, paths are painted into the colour map, and paths.json holds every
path as a polyline for the game to draw as its own ribbon of paving. Reads fill/terrain (geology pass), writes fill/paths/."""
import numpy as np, json, os, heapq
from scipy import ndimage as ndi
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import dijkstra, minimum_spanning_tree
from PIL import Image
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
T, OUT = f'{S}/fill/terrain', f'{S}/fill/paths'
os.makedirs(OUT, exist_ok=True)
h2 = np.load(f'{T}/terrain.npz')['h'].astype(np.float64); N2 = h2.shape[0]
col = np.load(f'{T}/colour.npy').astype(np.float64)
data = json.load(open(f'{S}/schema/game-data.json'))
PL = {p['id']: (p['at']['x'], p['at']['z']) for p in data['places']}
NAME = {p['id']: p['name'] for p in data['places']}
items = json.load(open(f'{S}/fill/world-placements.json'))['items']
gate = (-710.0, 11158.0)

# ---- grid helpers (routing on 1024, ~20 m cells) ----
N = 1024; h = h2.reshape(N, 2, N, 2).mean((1, 3)); mpp = 20691.0 / N
def ij(x, z, n=N): return (z / 2.75 / 6 + 490) * n / 1254, (x / 2.75 / 6 + 670) * n / 1254
def xz(i, j, n=N): return (j * 1254 / n - 670) * 6 * 2.75, (i * 1254 / n - 490) * 6 * 2.75
def cell(x, z):
    i, j = ij(x, z); return int(round(i)), int(round(j))

# obstacles: placed models (not wild rocks on hilltops) cost more to cross
dims = {}
for f in os.listdir(f'{S}/fill/glb'):
    if f.endswith('.json'):
        try: dims[f[:-5]] = json.load(open(f'{S}/fill/glb/{f}'))['dims']
        except Exception: pass
block = np.zeros((N, N))
for it in items:
    if it['place'] in ('B30',): continue
    d = dims.get(it['m'], [1, 1, 1]); r = max(d[0], d[1]) * it['scale'] / 2
    i, j = ij(it['x'], it['z']); rr = max(1, int(r / mpp))
    i0, j0 = int(i), int(j)
    block[max(0, i0 - rr):i0 + rr + 1, max(0, j0 - rr):j0 + rr + 1] = 1
road = np.zeros((N, N))                                   # cells already carrying a path

K8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
idx = np.arange(N * N).reshape(N, N)
def graph():
    rows, cols, w = [], [], []
    for a, c in K8:
        s0 = (slice(max(0, -a), N - max(0, a)), slice(max(0, -c), N - max(0, c)))
        s1 = (slice(max(0, a), N - max(0, -a) or None), slice(max(0, c), N - max(0, -c) or None))
        d = mpp * np.hypot(a, c)
        g = np.abs(h[s1] - h[s0]) / d
        wet = np.maximum(h[s0] < 1.0, h[s1] < 1.0)
        deep = np.minimum(h[s0], h[s1]) < -10
        cost = d * (1 + 50 * g ** 2 + 600 * np.maximum(0, g - 0.22) ** 2)
        cost *= np.where(deep, 400, np.where(wet, 14, 1))
        cost *= 1 + 12 * np.maximum(block[s0], block[s1])
        cost *= np.where(np.minimum(road[s0], road[s1]) > 0, 0.45, 1)
        rows.append(idx[s0].ravel()); cols.append(idx[s1].ravel()); w.append(cost.ravel())
    return coo_matrix((np.concatenate(w), (np.concatenate(rows), np.concatenate(cols))), shape=(N * N, N * N)).tocsr()

def route(a, b, limit=np.inf):
    G = graph(); sa = idx[cell(*a)]; sb = idx[cell(*b)]
    dist, pred = dijkstra(G, indices=sa, return_predecessors=True, limit=limit)
    path = [sb]
    while path[-1] != sa and path[-1] >= 0: path.append(pred[path[-1]])
    if path[-1] < 0: path = [sa, sb]
    path = path[::-1]
    ii, jj = np.unravel_index(np.array(path), (N, N))
    return ii.astype(float), jj.astype(float)

def smooth_line(ii, jj, k=3):
    if len(ii) < 5: return ii, jj
    return ndi.gaussian_filter1d(ii, k, mode='nearest'), ndi.gaussian_filter1d(jj, k, mode='nearest')

paths = []
def add(kind, width, ii, jj, frm, to):
    ii, jj = smooth_line(ii, jj, 2 if kind in ('trail', 'alley') else 3)
    for a, c in zip(ii.round().astype(int), jj.round().astype(int)): road[np.clip(a, 0, N - 1), np.clip(c, 0, N - 1)] = 1
    paths.append(dict(kind=kind, width=width, frm=frm, to=to, ii=ii, jj=jj))

# ---- 1. roads between places: each place to its nearest neighbours, plus the royal road from the gate ----
ids = [k for k in PL if k != 'B30']                       # sky isles float: reached by air
P = np.array([PL[k] for k in ids])
D = np.hypot(P[:, None, 0] - P[None, :, 0], P[:, None, 1] - P[None, :, 1])
mst = minimum_spanning_tree(D).toarray()
edges = {(min(a, b), max(a, b)) for a, b in zip(*np.nonzero(mst))}
for a in range(len(ids)):                                 # a few loops so the map is a web, not a tree
    for b in np.argsort(D[a])[1:3]:
        if D[a, b] < 4200: edges.add((min(a, b), max(a, b)))
edges = sorted(edges, key=lambda e: D[e])
# arrivals come through the gate by water or air, so the royal road starts at Bridge Pavilions
add('royal', 10, *route(PL['B20'], PL['B01']), 'B20', 'B01')
for a, b in edges:
    if {ids[a], ids[b]} == {'B20', 'B01'}: continue
    add('road', 6, *route(PL[ids[a]], PL[ids[b]]), ids[a], ids[b])
    print('road', ids[a], ids[b], flush=True)

# ---- 2. trails to hilltop relics ----
MON = ('menhir', 'Obelisk', 'Stone_Circle', 'Ring_of_Stone', 'Monolith', 'Archway', 'Gateway_Ruins', 'Stone_Temples', 'Stone_Lantern')
mons = [it for it in items if it['place'] == 'wild' and any(m in it['m'] for m in MON)]
mons.sort(key=lambda it: -it['y'])
taken = []
for it in mons:
    if len(taken) >= 45: break
    if any(np.hypot(it['x'] - t['x'], it['z'] - t['z']) < 900 for t in taken): continue
    i, j = cell(it['x'], it['z'])
    rd = np.argwhere(road > 0); k = np.argmin(np.hypot(rd[:, 0] - i, rd[:, 1] - j))
    if np.hypot(*(rd[k] - (i, j))) * mpp > 2600: continue
    a = xz(*rd[k]); add('trail', 2.5, *route(a, (it['x'], it['z']), limit=60000), 'road', it['m']); taken.append(it)
print('trails', len(taken), flush=True)

# ---- 3. alleys inside villages (straight lanes between buildings and the plaza, on the fine grid) ----
plazas = []
for pid in ids:
    b = [it for it in items if it['place'] == pid]
    if len(b) < 8 or pid == 'B01': continue
    pts = np.array([[PL[pid][0], PL[pid][1]]] + [[it['x'], it['z']] for it in b])
    Dm = np.hypot(pts[:, None, 0] - pts[None, :, 0], pts[:, None, 1] - pts[None, :, 1])
    t = minimum_spanning_tree(Dm).toarray()
    for a, c in zip(*np.nonzero(t)):
        if Dm[a, c] > 450: continue
        n = max(2, int(Dm[a, c] / 8)); s = np.linspace(0, 1, n)
        bend = np.sin(np.pi * s) * (Dm[a, c] * 0.08) * (1 if (a + c) % 2 else -1)   # a gentle curve, like an old lane
        dx, dz = pts[c] - pts[a]; L = np.hypot(dx, dz) + 1e-9
        X = pts[a, 0] + dx * s + (-dz / L) * bend; Z = pts[a, 1] + dz * s + (dx / L) * bend
        i, j = ij(X, Z); add('alley', 3, i, j, pid, 'lane')
    plazas.append(dict(place=pid, x=PL[pid][0], z=PL[pid][1], radius=32 if len(b) > 30 else 22))
print('alleys', sum(p['kind'] == 'alley' for p in paths), flush=True)

# ---- 4. ground under roads: smooth along the path, flatten across it; mark bridges ----
H = h2.copy(); bridges = []
ii2, jj2 = np.mgrid[0:N2, 0:N2]
corr = np.zeros((N2, N2)); target = np.zeros((N2, N2)); wsum = np.zeros((N2, N2))
out = []
for p in paths:
    I, J = p['ii'] * 2, p['jj'] * 2                         # to the 2048 grid
    X, Z = xz(I, J, N2)
    y = ndi.map_coordinates(h2, [I, J], order=1)
    wet = y < 1.0
    ys = ndi.gaussian_filter1d(np.where(wet, np.nan_to_num(np.maximum(y, 1.5)), y), 6 if p['kind'] != 'alley' else 3, mode='nearest')
    if wet.any():                                          # bridge decks span the wet runs between their banks
        lab, nlab = ndi.label(wet)
        for k in range(1, nlab + 1):
            s = np.nonzero(lab == k)[0]; a, b = max(0, s[0] - 1), min(len(y) - 1, s[-1] + 1)
            deck = max(y[a], y[b], 2.0) + 3.0
            ys[a:b + 1] = np.linspace(max(y[a], 2), max(y[b], 2), b - a + 1) * 0 + deck
            bridges.append(dict(on=f"{p['frm']}-{p['to']}", kind=p['kind'], start=[round(X[a], 1), round(deck, 1), round(Z[a], 1)],
                                end=[round(X[b], 1), round(deck, 1), round(Z[b], 1)], width=p['width'] + 2))
    if p['kind'] != 'alley':
        half = (p['width'] / 2 + 6) / (mpp / 2)              # flatten band, in 2048 cells
        for k in range(0, len(I), 2):
            if wet[k]: continue
            i0, j0 = int(I[k]), int(J[k]); r = int(np.ceil(half + 2))
            sl = (slice(max(0, i0 - r), i0 + r + 1), slice(max(0, j0 - r), j0 + r + 1))
            d = np.hypot(ii2[sl] - I[k], jj2[sl] - J[k])
            wgt = np.clip(1 - (d - half) / 3, 0, 1)
            target[sl] += wgt * ys[k]; wsum[sl] += wgt
    pts = [[round(float(a), 1), round(float(c), 1), round(float(b), 1)] for a, b, c in zip(X[::2], Z[::2], ys[::2])]
    if len(pts) < 2: pts = [[round(float(X[0]), 1), round(float(ys[0]), 1), round(float(Z[0]), 1)], [round(float(X[-1]), 1), round(float(ys[-1]), 1), round(float(Z[-1]), 1)]]
    out.append(dict(kind=p['kind'], width=p['width'], from_=p['frm'], to=p['to'], length_m=round(float(np.sum(np.hypot(np.diff(X), np.diff(Z)))), 1), points=pts))
m = wsum > 0
blend = np.clip(wsum, 0, 1)
H = np.where(m & (h2 > 1), h2 * (1 - blend) + (target / np.maximum(wsum, 1e-9)) * blend, h2)

# ---- 5. paint ----
paint = {'royal': ([0.93, 0.88, 0.80], 16), 'road': ([0.78, 0.70, 0.56], 12), 'trail': ([0.62, 0.52, 0.40], 8), 'alley': ([0.80, 0.74, 0.66], 7)}
c2 = col.copy()
for kind in ('trail', 'road', 'alley', 'royal'):
    rgb, w = paint[kind]
    mask = np.zeros((N2, N2), bool)
    for p in paths:
        if p['kind'] != kind: continue
        I, J = np.interp(np.arange(0, len(p['ii']) - 1, 0.25), np.arange(len(p['ii'])), p['ii']) * 2, np.interp(np.arange(0, len(p['jj']) - 1, 0.25), np.arange(len(p['jj'])), p['jj']) * 2
        mask[np.clip(I.round().astype(int), 0, N2 - 1), np.clip(J.round().astype(int), 0, N2 - 1)] = True
    a = ndi.gaussian_filter(ndi.binary_dilation(mask, iterations=max(1, int(w / 2 / (mpp / 2)))).astype(float) if w > 10 else mask.astype(float), 0.8)
    a = np.clip(a * 1.6, 0, 1) * (H > 1)
    c2 = c2 * (1 - 0.85 * a[..., None]) + np.array(rgb) * 0.85 * a[..., None]
for pz in plazas:
    i, j = ij(pz['x'], pz['z'], N2); d = np.hypot(ii2 - i, jj2 - j) * mpp / 2
    a = np.clip((pz['radius'] - d) / 6, 0, 1)
    c2 = c2 * (1 - 0.8 * a[..., None]) + np.array([0.85, 0.80, 0.72]) * 0.8 * a[..., None]

np.savez_compressed(f'{OUT}/terrain.npz', h=H.astype(np.float32)); np.save(f'{OUT}/colour.npy', c2.astype(np.float32))
json.dump(dict(frame='three.js metres: origin palace, x east, z south, y up; points are [x, y, z] along the centre line, y = smoothed ground or bridge deck',
               kinds=dict(royal='10 m, pale stone, lanterns every 40 m: gate to Bridge Pavilions to the palace', road='6 m, packed earth with stone edges, between places',
                          trail='2.5 m, footpath up to hilltop relics', alley='3 m, cobbles, inside villages'),
               paths=out, bridges=bridges, plazas=plazas), open(f'{OUT}/paths.json', 'w'), separators=(',', ':'))
tot = {}
for o in out: tot[o['kind']] = tot.get(o['kind'], 0) + o['length_m']
print(json.dumps({k: round(v / 1000, 1) for k, v in tot.items()}), 'km;', len(bridges), 'bridges;', len(plazas), 'plazas')
