"""The great crescent ridge (owner, Oct 17 12:53): the band the owner drew round the map, scaled up so the whole
20.7 km map sits inside it, with peaks of 7-8 km. Opens to the east like the drawing.
Writes ridge/out: outer.npz (40.96 km world at 20 m), inner.npz (the 20.7 km map with the ridge merged in),
colours, and the web game's files (game/: crescent-h.bin, crescent-colour.jpg, outer-h.bin, outer-colour.jpg, world.json)."""
import numpy as np, json, os, sys
from scipy import ndimage as ndi
from PIL import Image
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
sys.path.insert(0, f'{S}/ow')
from gen_noise import fbm, ridged
R = f'{S}/ridge'; OUT = f'{R}/out'; GAME = f'{OUT}/game'; os.makedirs(GAME, exist_ok=True)
MAPW = 20691.0                       # old map width, metres
CX, CZ = -709.5, 2260.5              # old map centre (three.js x, z)
G, L = 2048, 40960.0                 # outer world grid and width
K, WID, HC = 1.46, 2.2, 8900.0       # inner edge scale, band widening, crest height
ENC = dict(offset=500, scale=7)      # uint16 = (h + 500) * 7, so -500 m .. 8862 m

# ---- the drawn band in polar form (fractions of the old map width, angle counter-clockwise from east, north up)
band = np.load(f'{R}/band.npy'); n0 = band.shape[0]
yy, xx = np.nonzero(band)
th = (np.degrees(np.arctan2(-(yy - n0 / 2), xx - n0 / 2)) % 360).astype(int)
rr = np.hypot(xx - n0 / 2, yy - n0 / 2) / n0
ri = np.full(360, np.nan); ro = np.full(360, np.nan)
for t in range(360):
    s = th == t
    if s.sum() > 200: ri[t], ro[t] = np.percentile(rr[s], 1), np.percentile(rr[s], 99)
have = ~np.isnan(ri)
def csmooth(a, sig):
    v = np.where(have, a, 0.0); w = have.astype(float)
    v = ndi.gaussian_filter1d(np.tile(v, 3), sig)[360:720]; w = ndi.gaussian_filter1d(np.tile(w, 3), sig)[360:720]
    return v / np.maximum(w, 1e-6)
ri_s, ro_s = csmooth(ri, 3), csmooth(ro, 3)
ri2 = ri_s * K
# places must stay clear of the mountain foot: inner edge at least 1.4 km beyond any place in that direction
data = json.load(open(f'{S}/schema/game-data.json'))
pts = [(p['at']['x'], p['at']['z']) for p in data['places']] + [(-710, 12158)]
for x, z in pts:
    dx, dz = (x - CX) / MAPW, (z - CZ) / MAPW
    t0 = int(np.degrees(np.arctan2(-dz, dx)) % 360); r0 = np.hypot(dx, dz)
    for t in range(t0 - 8, t0 + 9):
        ri2[t % 360] = max(ri2[t % 360], r0 + 1400 / MAPW)
ro2 = ri2 + (ro_s - ri_s) * WID
print('inner edge km', round(ri2[have].min() * MAPW / 1000, 1), '-', round(ri2[have].max() * MAPW / 1000, 1),
      ' outer km', round(ro2[have].max() * MAPW / 1000, 1), ' band open at', [t for t in range(360) if not have[t]][:3], '...')

def ridge_height(X, Z, n, seed=0):
    """height of the great ridge at world points X, Z (arrays on an n x n grid)"""
    dx, dz = (X - CX) / MAPW, (Z - CZ) / MAPW
    tf = np.degrees(np.arctan2(-dz, dx)) % 360; r = np.hypot(dx, dz)
    t0 = np.floor(tf).astype(int) % 360; t1 = (t0 + 1) % 360; a = tf - np.floor(tf)
    lin = lambda arr: arr[t0] * (1 - a) + arr[t1] * a
    hv = lin(have.astype(float)); r_i = lin(np.nan_to_num(ri2)); r_o = lin(np.nan_to_num(ro2))
    wm = np.maximum((r_o - r_i) * MAPW, 1)
    u = (r - r_i) / np.maximum(r_o - r_i, 1e-6) + 0.10 * fbm(n, 9, 4, 351 + seed)
    u0 = 0.42
    prof = np.where(u < u0, np.clip(u / u0, 0, 1) ** 0.75, np.clip((1 - u) / (1 - u0), 0, 1) ** 0.85)
    inside = (u >= 0) & (u <= 1)
    dist_out = np.where(u < 0, (r_i - r) * MAPW, np.where(u > 1, (r - r_o) * MAPW, 0))
    foot = np.exp(-dist_out / 400) * 0.012 * (~inside)
    taper = np.clip(wm / 5200, 0.3, 1) * np.clip(hv * 1.6 - 0.3, 0, 1)
    crest = HC * (1 + 0.08 * fbm(n, 5, 3, 301 + seed))
    base = crest * taper * np.where(inside, prof, foot)
    # sharp crests, spurs and saddles
    rd = ridged(n, 11, 7, 311 + seed); rd2 = ridged(n, 34, 5, 321 + seed)
    peaks = np.clip(fbm(n, 7, 3, 361 + seed), 0, None) ** 1.5
    h = base * (0.50 + 0.55 * rd + 0.12 * peaks) + 0.14 * base * (rd2 - 0.5) * 2
    return h, base

# ---- outer world
c = (np.arange(G) + 0.5) / G * L - L / 2
Xo, Zo = np.meshgrid(CX + c, CZ + c)
ho, base_o = ridge_height(Xo, Zo, G)
mpp = L / G
# rivers and scree on the mountains (stream power on a 1024 grid, a few rounds)
n = G // 2; d = 2 * mpp
K8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]; D8 = [d * np.hypot(a, b) for a, b in K8]
def sh(a, di, dj, fill):
    o = np.full_like(a, fill)
    o[max(0, -di):n - max(0, di), max(0, -dj):n - max(0, dj)] = a[max(0, di):n - max(0, -di) or None, max(0, dj):n - max(0, -dj) or None]
    return o
def flow(h):
    drops = [np.maximum(0, (h - sh(h, a, b, 1e9)) / dd) for (a, b), dd in zip(K8, D8)]
    w = [x ** 1.1 for x in drops]; tot = sum(w) + 1e-12; w = [x / tot for x in w]
    A = np.ones_like(h)
    for _ in range(300):
        A = 1 + sum(sh(A * wk, -a, -b, 0) for (a, b), wk in zip(K8, w))
    return A, np.maximum.reduce(drops)
hl = ho.reshape(n, 2, n, 2).mean((1, 3)); hs = hl.copy(); ml = (hl > 60).astype(float)
for rnd in range(12):
    A, slope = flow(hs); E = np.sqrt(A) * slope
    ref = np.percentile(E[ml > 0.5], 99.3)
    hs -= 230 * np.clip(E / ref, 0, 1.6) * ml * np.clip(hs / 1500, 0.3, 1)
    for _ in range(8):
        moved = np.zeros_like(hs)
        for (a, b), dd in zip(K8, D8):
            ex = np.maximum(0, (hs - sh(hs, a, b, -1e9)) - 1.6 * dd) * 0.05 * ml
            moved -= ex; moved += sh(ex, -a, -b, 0)
        hs += moved
    print('erosion round', rnd, flush=True)
A, _ = flow(hs)
ho = ho + ndi.zoom(hs - hl, 2, order=3) * (ho > 30)
Aup = ndi.zoom(np.log1p(A), 2, order=1)
sea = -60 + 25 * fbm(G, 12, 3, 331)
ho = np.where(ho > 8, ho, np.minimum(sea + ho * 4, ho))

# ---- the old map: ridge merged in (only where it rises above what is there), places untouched
T = np.load(f'{S}/fill/paths/terrain.npz')['h'].astype(np.float64); N = T.shape[0]
T = np.where(T > 2500, ndi.median_filter(T, 7), T)             # 14 edge spikes the geology pass left at the map border
ci = (np.arange(N) + 0.5) / N * MAPW - MAPW / 2
Xi, Zi = np.meshgrid(CX + ci, CZ + ci)
# sample the outer world at the inner grid (it has the same ridge, eroded)
gi = (Zi - CZ + L / 2) / mpp - 0.5; gj = (Xi - CX + L / 2) / mpp - 0.5
hr = ndi.map_coordinates(ho, [gi, gj], order=1)
w = np.clip((hr - 20) / 200, 0, 1)
hi = np.where(hr > T, T + (hr - T) * w, T)
# outer world shows the old map inside its box (so the two meet exactly)
inbox = (np.abs(Xo - CX) < MAPW / 2) & (np.abs(Zo - CZ) < MAPW / 2)
bi = (Zo - CZ + MAPW / 2) / MAPW * N - 0.5; bj = (Xo - CX + MAPW / 2) / MAPW * N - 0.5
ho_full = np.where(inbox, ndi.map_coordinates(hi, [np.clip(bi, 0, N - 1), np.clip(bj, 0, N - 1)], order=1), ho)

# ---- colour
def paint(h, Aup_, seed, under=None):
    n_ = h.shape[0]; m_ = h.shape[0] and (L / n_ if under is None else MAPW / n_)
    sl = np.hypot(*np.gradient(h, m_))
    lap = ndi.laplace(ndi.gaussian_filter(h, 1.5))
    rock = np.where(fbm(n_, 10, 3, 341 + seed)[..., None] > 0, [0.50, 0.46, 0.43], [0.40, 0.42, 0.46]) * (1 + 0.12 * fbm(n_, 90, 3, 342 + seed))[..., None]
    strata = np.sin(2 * np.pi * (h + 60 * fbm(n_, 30, 3, 343 + seed)) / 140)
    col = rock * (1 + 0.05 * strata[..., None])
    col = col * (1 + np.clip(-lap / 30, -0.15, 0.25)[..., None])
    gully = np.clip((Aup_ - 4.5) / 4, 0, 1)
    col = col * (1 - 0.22 * gully[..., None])
    green = np.clip((0.9 - sl) / 0.4, 0, 1) * np.clip((1400 - h) / 500, 0, 1) * (h > 3)
    gcol = np.where(fbm(n_, 25, 3, 344 + seed)[..., None] > 0.1, [0.20, 0.36, 0.18], [0.12, 0.27, 0.17])
    col = col * (1 - 0.85 * green[..., None]) + gcol * 0.85 * green[..., None]
    snowline = 2600 + 350 * fbm(n_, 20, 3, 345 + seed)
    snow = np.clip((h - snowline) / 400, 0, 1) * np.clip((2.8 - sl) / 1.0, 0, 1) + np.clip((h - 4200) / 900, 0, 1) * 0.75
    snow = np.clip(snow, 0, 1)
    col = col * (1 - snow[..., None]) + np.array([0.95, 0.96, 0.99]) * snow[..., None]
    col = col * (1 - 0.15 * np.clip((h - 5500) / 1500, 0, 1))[..., None] + 0.15 * np.clip((h - 5500) / 1500, 0, 1)[..., None] * np.array([0.85, 0.88, 0.95])
    seac = SEA * (1 + 0.06 * fbm(n_, 20, 2, 346 + seed))[..., None]
    beach = np.clip((h + 2) / 4, 0, 1) * np.clip((10 - h) / 8, 0, 1)
    col = np.where((h < 0)[..., None], seac * np.clip(1.25 + h / 240, 1, 1.25)[..., None], col)
    col = col * (1 - beach[..., None]) + np.array([0.78, 0.72, 0.58]) * beach[..., None]
    return np.clip(col, 0, 1)
cin_old = np.load(f'{S}/fill/paths/colour.npy').astype(np.float64)
edge = np.concatenate([cin_old[:4].reshape(-1, 3), cin_old[-4:].reshape(-1, 3), cin_old[:, :4].reshape(-1, 3), cin_old[:, -4:].reshape(-1, 3)])
eh = np.concatenate([T[:4].ravel(), T[-4:].ravel(), T[:, :4].ravel(), T[:, -4:].ravel()])
SEA = np.median(edge[eh < -5], 0); print('map sea colour', SEA)
co = paint(ho, Aup, 0)
Aup_i = ndi.map_coordinates(Aup, [gi, gj], order=1)
cin_r = paint(np.where(hr > 3, hr, -50.0), Aup_i, 0, under=True)
wi = np.clip((hi - T) / 120, 0, 1)[..., None]
cin = cin_old * (1 - wi) + cin_r * wi
co_full = np.where(inbox[..., None], np.stack([ndi.map_coordinates(cin[..., k], [np.clip(bi, 0, N - 1), np.clip(bj, 0, N - 1)], order=1) for k in range(3)], -1), co)

# ---- write
np.savez_compressed(f'{OUT}/outer.npz', h=ho_full.astype(np.float32))
np.savez_compressed(f'{OUT}/inner.npz', h=hi.astype(np.float32)); np.save(f'{OUT}/inner-colour.npy', cin.astype(np.float32))
Image.fromarray((co_full * 255).astype(np.uint8)).save(f'{OUT}/outer-colour-2048.png')
enc = lambda h: np.clip((h + ENC['offset']) * ENC['scale'], 0, 65535).astype('<u2')
hg = hi.reshape(N // 2, 2, N // 2, 2).mean((1, 3)); enc(hg).tofile(f'{GAME}/crescent-h.bin')
Image.fromarray((cin * 255).astype(np.uint8)).resize((1024, 1024), Image.LANCZOS).save(f'{GAME}/crescent-colour.jpg', quality=88)
og = ho_full.reshape(G // 2, 2, G // 2, 2).mean((1, 3)); enc(og).tofile(f'{GAME}/outer-h.bin')
Image.fromarray((co_full * 255).astype(np.uint8)).resize((1024, 1024), Image.LANCZOS).save(f'{GAME}/outer-colour.jpg', quality=88)
json.dump(dict(
    encoding='uint16 little-endian, height_m = value / 7 - 500 (both files; the old crescent-h.bin was value / 20 - 250)',
    inner=dict(file='crescent-h.bin', colour='crescent-colour.jpg', grid=1024, centre=[CX, CZ], width_m=MAPW, note='the playable map, unchanged except where the great ridge rises at its corners'),
    outer=dict(file='outer-h.bin', colour='outer-colour.jpg', grid=1024, centre=[CX, CZ], width_m=L, note='the great crescent ridge round the map; inside the inner box it repeats the inner heights, so draw it only outside that box (or under it) and they meet exactly'),
    ridge=dict(crest_m=HC, peak_m=float(ho.max()), opens='east', inner_edge_km=[round(float(ri2[have].min() * MAPW / 1000), 1), round(float(ri2[have].max() * MAPW / 1000), 1)]),
    frame='three.js metres: origin palace B01, x east, z south, y up'), open(f'{GAME}/world.json', 'w'), indent=1)
print('peak', float(ho.max()), 'inner max', float(hi.max()), 'inner changed cells', int((hi - T > 1).sum()))
