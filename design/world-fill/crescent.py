"""Raise a crescent ring of towering sea mountains around the mainland (open to the north, where the mainland range already stands),
cut the white waterfall gate through its south wall, and repaint the new slopes. Writes fill/terrain/ (h, colour, biome, gate info)."""
import numpy as np, json, os, sys
from scipy import ndimage as ndi
sys.path.insert(0, '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/ow')
from gen_noise import fbm, ridged
from PIL import Image
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'; OUT = f'{S}/fill/terrain'; os.makedirs(OUT, exist_ok=True)
T = np.load(f'{S}/ow/out/terrain.npz'); h = T['h'].astype(np.float64); N = h.shape[0]
col = np.load(f'{S}/ow/out/colour.npy').astype(np.float64); b = np.load(f'{S}/ow/out/biome.npy')
mpp = 20691.0 / N
ii, jj = np.mgrid[0:N, 0:N].astype(np.float64)
u, v = jj / N, ii / N                       # 0..1 image coords, v down = south
# crescent centre line: lower part of an ellipse around the island
cx, cy, rx, ry = 0.50, 0.43, 0.455, 0.50
ryn = 0.385                                  # the ring wraps around the back (north) just off the north coast (owner, Oct 17)
nb = np.clip((cy - v) / 0.18, 0, 1); nb = nb * nb * (3 - 2 * nb)          # 0 in the south half, easing to 1 towards the back
du, dv = (u - cx) / rx, (v - cy) / np.where(v < cy, ryn, ry)
r = np.hypot(du, dv); th = np.degrees(np.arctan2(dv, du))   # th 90 = due south
dist_m = np.abs(r - 1.0) * (min(rx, ry) + (ryn - min(rx, ry)) * nb) * 20691.0   # distance from the ridge line, metres
# the ring runs all the way round except a wide mouth to the open ocean, centred due north (th -90)
mouth = np.abs(((th + 90) + 180) % 360 - 180)
arc = np.clip((mouth - 20) / 14, 0, 1)
arc *= 1 - 0.2 * nb                                     # the back wall is a little lower than the front
width = (650 + 250 * fbm(N, 6, 4, 11)) * (1 - 0.3 * nb)
prof = np.exp(-(dist_m / width) ** 2)
peaks = (0.35 + 0.65 * np.clip(ridged(N, 9, 7, 21), 0, None)) ** 1.3
H = (1500 + 450 * fbm(N, 5, 3, 31)) * peaks * prof * arc
# keep places and their surroundings clear
pos = json.load(open(f'{S}/schema/pos_raw.json')); new = json.load(open(f'{S}/schema/pos_new.json'))
P = [(float(p['x'].replace('−', '-')), float(p['z'].replace('−', '-'))) for p in pos.values()] + [tuple(p[:2]) for k, p in new.items() if k != 'B30']
keep = np.ones((N, N))
for x, z in P:
    j = (x / 6 + 670) * N / 1254; i = (z / 6 + 490) * N / 1254
    d = np.hypot(ii - i, jj - j) * mpp
    keep = np.minimum(keep, np.clip((d - 700) / 900, 0, 1))
H *= keep
# the gate: a notch through the south wall, due south of Lantern Lake
gth = 90.0
gu, gv = cx + rx * np.cos(np.radians(gth)), cy + ry * np.sin(np.radians(gth))
gi, gj = gv * N, gu * N
along = np.abs((jj - gj)) * mpp                                  # east-west distance from the gate axis
edge = 75 + 40 * fbm(N, 80, 4, 61)
notch = np.clip((along - edge) / (520 + 200 * fbm(N, 20, 3, 62)), 0, 1) ** 1.4
near_gate = np.hypot(ii - gi, jj - gj) * mpp < 2600
H = np.where(near_gate, H * notch, H)
h2 = np.maximum(h, np.where(H > 30, H - 40 + np.minimum(h, 0) * 0.15, h))
h2 = np.where(near_gate & (along < edge) & (prof * arc > 0.05), np.minimum(h, -6), h2)   # sea channel through the gate
raised = (h2 - h) > 25
# repaint new slopes: sea cliff foot, alpine green, bare rock, snow caps
pal = {7: (0.50, 0.47, 0.46), 18: (0.60, 0.67, 0.46), 19: (0.55, 0.53, 0.52), 20: (0.95, 0.96, 0.99), 16: (0.15, 0.30, 0.22)}
nb = np.where(h2 > 1150 + 120 * fbm(N, 40, 3, 51), 20, np.where(h2 > 450 + 150 * fbm(N, 30, 3, 52), 19, np.where(h2 > 120, 16, np.where(h2 > 40, 18, 7))))
slope = np.hypot(*np.gradient(h2, mpp))
nb = np.where((slope > 0.9) & (nb != 20), 19, nb)
b2 = np.where(raised, nb, b)
grain = 0.10 * fbm(N, 96, 5, 41)[..., None] + 0.06 * fbm(N, 24, 3, 42)[..., None]
newcol = np.stack([np.choose(np.searchsorted(sorted(pal), nb.clip(7)), [np.full((N, N), pal[k][c]) for k in sorted(pal)]) for c in range(3)], -1)
shade = 1 - 0.35 * np.clip(slope, 0, 1.5)[..., None] / 1.5
blend = np.clip((h2 - h - 25) / 120, 0, 1)[..., None]
col2 = col * (1 - blend) + np.clip(newcol * shade + grain, 0, 1) * blend
np.savez_compressed(f'{OUT}/terrain.npz', h=h2.astype(np.float32))
np.save(f'{OUT}/biome.npy', b2.astype(b.dtype)); np.save(f'{OUT}/colour.npy', col2.astype(np.float32))
Image.fromarray((np.clip(col2, 0, 1) * 255).astype(np.uint8)).save(f'{OUT}/terrain-colour-2048.png')
Image.fromarray((np.clip(col2, 0, 1) * 255).astype(np.uint8)).resize((768, 768)).save(f'{OUT}/crescent-map.jpg', quality=85)
gx, gz = (gu * 1254 - 670) * 6, (gv * 1254 - 490) * 6           # drawn units
json.dump(dict(gate_drawn=[round(gx), round(gz)], gate_world=[round(gx * 2.75), round(gz * 2.75)], docks_world=[round(gx * 2.75), round(gz * 2.75 + 1000)],
               ridge_max=float(H.max()), raised_km2=float(raised.sum() * mpp * mpp / 1e6)), open(f'{OUT}/crescent.json', 'w'), indent=1)
print(open(f'{OUT}/crescent.json').read())
