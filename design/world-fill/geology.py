"""Geology pass on the crescent: rivers carve valleys (stream power on a 1024 flow grid), slopes shed scree (thermal),
canyon, karst and sea-cliff walls get stepped strata, and the colour map gains gullies, ridges, scree, snow on ledges
and banded rock. Places keep their ground. Reads fill/terrain_v1, writes fill/terrain and fill/game (the web game's format)."""
import numpy as np, json, os, sys
from scipy import ndimage as ndi
from PIL import Image
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
sys.path.insert(0, f'{S}/ow')
from gen_noise import fbm, ridged
IN, OUT, GAME = f'{S}/fill/terrain_v1', f'{S}/fill/terrain', f'{S}/fill/game'
os.makedirs(GAME, exist_ok=True)
h0 = np.load(f'{IN}/terrain.npz')['h'].astype(np.float64); N = h0.shape[0]
b = np.load(f'{IN}/biome.npy'); col = np.load(f'{IN}/colour.npy').astype(np.float64)
mpp = 20691.0 / N
ii, jj = np.mgrid[0:N, 0:N].astype(np.float64)

# places keep their ground (same pads as crescent.py), soft edge
pos = json.load(open(f'{S}/schema/pos_raw.json')); new = json.load(open(f'{S}/schema/pos_new.json'))
P = [(float(p['x'].replace('−', '-')), float(p['z'].replace('−', '-'))) for p in pos.values()] + [tuple(p[:2]) for k, p in new.items() if k != 'B30']
P.append((0.0, 0.0))
keep = np.ones((N, N))
for x, z in P:
    j = (x / 6 + 670) * N / 1254; i = (z / 6 + 490) * N / 1254
    keep = np.minimum(keep, np.clip((np.hypot(ii - i, jj - j) * mpp - 450) / 600, 0, 1))
land = h0 > 2
keep = np.minimum(keep, 1 - ndi.gaussian_filter((b == 21).astype(float), 12).clip(0, 0.5) * 2)   # palace grounds stay as designed
mount = np.clip((h0 - 60) / 380, 0, 1) * keep * land          # how much a cell may be reshaped
mh = np.clip((h0 - 100) / 1100, 0, 1) * keep * land            # tall mountains get spurs and crests before the rivers cut them
w1 = fbm(N, 8, 3, 75) * 0.02; h0r = h0 + mh * (340 * (ridged(N, 22, 6, 73) - 0.5) + 110 * (ridged(N, 70, 3, 74) - 0.5))

# ---- 1. rivers carve valleys, slopes shed scree (1024 grid, ~20 m cells) ----
n = N // 2; d = 2 * mpp
hl = h0r.reshape(n, 2, n, 2).mean((1, 3)); ml = mount.reshape(n, 2, n, 2).mean((1, 3))
K8 = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]
D8 = [d * np.hypot(a, c) for a, c in K8]
def sh(a, di, dj, fill):                                       # value of the neighbour at (i+di, j+dj)
    o = np.full_like(a, fill)
    o[max(0, -di):n - max(0, di), max(0, -dj):n - max(0, dj)] = a[max(0, di):n - max(0, -di) or None, max(0, dj):n - max(0, -dj) or None]
    return o
def flow(h):
    drops = [np.maximum(0, (h - sh(h, a, c, 1e9)) / dd) for (a, c), dd in zip(K8, D8)]
    w = [x ** 1.1 for x in drops]; tot = sum(w) + 1e-12; w = [x / tot for x in w]
    A = np.ones_like(h)
    for _ in range(420):                                       # water arriving from uphill neighbours
        A = 1 + sum(sh(A * wk, -a, -c, 0) for (a, c), wk in zip(K8, w))
    return A, np.maximum.reduce(drops)
hs = hl.copy(); hm = np.clip(hl / 1200, 0, 1)
for rnd in range(16):
    A, slope = flow(hs)
    E = np.sqrt(A) * slope
    ref = np.percentile(E[ml > 0.5], 99.3)
    hs -= (10 + 30 * hm) * np.clip(E / ref, 0, 1.6) * ml
    for _ in range(12):                                        # talus: steeper than ~40 deg slides down
        moved = np.zeros_like(hs)
        for (a, c), dd in zip(K8, D8):
            ex = np.maximum(0, (hs - sh(hs, a, c, -1e9)) - 0.85 * dd) * 0.06 * ml
            moved -= ex; moved += sh(ex, -a, -c, 0)
        hs += moved
    print('round', rnd, 'max carve', float((hl - hs).max()), flush=True)
A, _ = flow(hs)
delta = ndi.zoom(hs - hl, 2, order=3)
Aup = ndi.zoom(np.log1p(A), 2, order=1)
h1 = h0r + delta * (mount > 0)

# ---- 2. fine ridges and stepped strata ----
h1 += mount * 14 * (ridged(N, 120, 4, 71) - 0.45)
slope = np.hypot(*np.gradient(h1, mpp))
rocky = np.isin(b, [7, 14, 15]).astype(float)
strat = ndi.gaussian_filter(rocky * np.clip((slope - 0.35) / 0.4, 0, 1), 1.5) * keep * land
step = 34 + 8 * fbm(N, 6, 2, 81)
w = (h1 + 9 * fbm(N, 60, 3, 82)) / step
f = w - np.floor(w); g = np.clip((f - 0.5) / 0.5, 0, 1); g = g * g * (3 - 2 * g)
terr = (np.floor(w) + g) * step - 9 * fbm(N, 60, 3, 82)
h2 = h1 + (terr - h1) * strat * 0.8
h2 = np.where(land, np.maximum(h2, 3), h2)                    # nothing sinks into the sea
h2 = np.where(keep < 1e-6, h0, h2)
dd0 = h2 - h0

# ---- 3. repaint ----
slope = np.hypot(*np.gradient(h2, mpp))
lap = ndi.laplace(ndi.gaussian_filter(h2, 2))
ridge = np.clip(-lap / 6, 0, 1) * mount
gully = np.clip((Aup - 4.5) / 4, 0, 1) * mount
scree = np.clip(ndi.zoom(np.maximum(0, hs - hl), 2, order=1) / 6, 0, 1) * mount
c = col.copy()
c = c * (1 - 0.20 * gully[..., None]) + np.array([0.10, 0.20, 0.10]) * 0.35 * (gully * (h2 < 900))[..., None]
c = c + 0.10 * ridge[..., None]
rock = np.clip((slope - 0.5) / 0.5, 0, 1) * mh
tint = np.where(fbm(N, 10, 3, 95)[..., None] > 0, [0.60, 0.55, 0.50], [0.47, 0.50, 0.54])
c = c * (1 - 0.45 * rock[..., None]) + tint * (1 + 0.12 * fbm(N, 120, 3, 96))[..., None] * 0.45 * rock[..., None]
c = c * (1 - 0.25 * (gully * mh)[..., None])
c = c * (1 - 0.5 * scree[..., None]) + np.array([0.66, 0.63, 0.58]) * 0.5 * scree[..., None]
# banded rock on strata walls: canyon reds and creams, cool greys elsewhere
band = np.sin(2 * np.pi * (h2 + 12 * fbm(N, 40, 3, 91)) / 21)
warm = np.where(b[..., None] == 14, np.where(band[..., None] > 0, [0.74, 0.40, 0.27], [0.86, 0.70, 0.52]),
                np.where(band[..., None] > 0, [0.58, 0.55, 0.53], [0.70, 0.67, 0.62]))
sv = (strat * np.where(b == 14, 0.7, 0.25))[..., None]
c = c * (1 - sv) + warm * (1 + 0.08 * band[..., None]) * sv
# snow rests on ledges and gentle slopes; steep faces show rock
snowline = 1150 + 120 * fbm(N, 40, 3, 51)
snow = np.clip((h2 - snowline) / 120, 0, 1) * np.clip((0.95 - slope) / 0.4, 0, 1)
bare = np.clip((h2 - snowline) / 120, 0, 1) * (1 - snow)
c = c * (1 - snow[..., None]) + np.array([0.95, 0.96, 0.99]) * snow[..., None]
c = c * (1 - 0.6 * bare[..., None]) + np.array([0.52, 0.51, 0.52]) * 0.6 * bare[..., None]
green = np.clip((0.8 - slope) / 0.35, 0, 1) * np.clip((1000 - h2) / 250, 0, 1) * mh * (1 - snow)
gcol = np.where(fbm(N, 30, 3, 97)[..., None] > 0.1, [0.20, 0.36, 0.18], [0.13, 0.27, 0.17]) * (1 + 0.15 * fbm(N, 150, 3, 98))[..., None]
c = c * (1 - 0.8 * green[..., None]) + gcol * 0.8 * green[..., None]
c = np.clip(c, 0, 1)
mk = keep < 1e-6
c[mk] = col[mk]

# ---- write ----
np.savez_compressed(f'{OUT}/terrain.npz', h=h2.astype(np.float32))
np.save(f'{OUT}/colour.npy', c.astype(np.float32))
im = Image.fromarray((c * 255).astype(np.uint8)); im.save(f'{OUT}/terrain-colour-2048.png')
im.resize((768, 768)).save(f'{OUT}/crescent-map.jpg', quality=85)
up = ndi.zoom(h2, 4033 / N, order=1)[:4033, :4033]
q = np.clip((up + 250) / 1800 * 65535, 0, 65535).astype(np.uint16)
Image.fromarray(q).save(f'{OUT}/heightmap-crescent-4033-16bit.png'); q.tofile(f'{OUT}/heightmap-crescent-4033.r16')
# web game: 1024 grid, uint16 (h + 250) * 20, colour jpg 1024
hg = h2.reshape(N // 2, 2, N // 2, 2).mean((1, 3))
np.clip((hg + 250) * 20, 0, 65535).astype('<u2').tofile(f'{GAME}/crescent-h.bin')
im.resize((1024, 1024), Image.LANCZOS).save(f'{GAME}/crescent-colour.jpg', quality=88)
dd = h2 - h0
np.save(f'{S}/fill/geology-delta.npy', dd.astype(np.float32))
print(json.dumps(dict(changed_km2=float((np.abs(dd) > 3).sum() * mpp * mpp / 1e6), max_cut=float(-dd.min()), max_fill=float(dd.max()),
                      strata_km2=float((strat > 0.3).sum() * mpp * mpp / 1e6))))
