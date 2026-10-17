"""Stylised cliff rock (Genshin-like): tileable 1024 px colour + normal map. Horizontal sedimentary blocks with bevelled
faces, dark cracks, warm sandstone-grey with a faint rose and lilac cast, fine grain. Writes rock2.png, rock2-n.png."""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
N = 1024; rng = np.random.default_rng(5)
yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
def tnoise(f, seed):                                    # tileable value noise, f cells across
    g = np.random.default_rng(seed).uniform(0, 1, (f, f)); g = np.pad(g, 3, mode='wrap')
    return ndi.map_coordinates(g, [yy / N * f + 3, xx / N * f + 3], order=3, mode='wrap')
def fbm(f, seed, oct=5):
    s, a, t = 0, 1, 0
    for o in range(oct): s += a * tnoise(f * 2 ** o, seed + o); t += a; a *= 0.5
    return s / t
# blocks: jittered points on rows (strata), cells stretched horizontally
pts = []
rows = 9
for r in range(rows):
    yc = (r + 0.5) / rows * N
    n = rng.integers(3, 6); xs = np.sort(rng.uniform(0, N, n))
    for x in xs: pts.append((x, yc + rng.uniform(-0.28, 0.28) * N / rows))
pts = np.array(pts)
warp = (fbm(4, 11) - 0.5) * 70; warp2 = (fbm(4, 12) - 0.5) * 40
X, Y = xx + warp, yy + warp2
F1 = np.full((N, N), 1e9, np.float32); F2 = F1.copy(); ID = np.zeros((N, N), np.int32); DX = np.zeros((N, N), np.float32); DY = DX.copy()
for k, (px, py) in enumerate(pts):
    for ox in (-N, 0, N):
        for oy in (-N, 0, N):
            dx = (X - (px + ox)) * 0.45; dy = (Y - (py + oy)) * 1.5        # wide flat blocks
            d = np.hypot(dx, dy)
            m1 = d < F1; m2 = (d < F2) & ~m1
            F2 = np.where(m1, F1, np.where(m2, d, F2)); F1 = np.where(m1, d, F1)
            ID = np.where(m1, k, ID); DX = np.where(m1, dx, DX); DY = np.where(m1, dy, DY)
edge = F2 - F1
crack = (1 - np.clip(edge / 5.0, 0, 1) ** 0.6) * np.clip((fbm(6, 71) - 0.32) * 3.0, 0.15, 1)
# height: each block domed and tilted, cracks cut in, fine chipped detail
tilt = rng.uniform(-1, 1, (len(pts), 2)).astype(np.float32)
hgt = np.clip(edge / 26.0, 0, 1) ** 0.5 + 0.12 * (tilt[ID, 0] * DX + tilt[ID, 1] * DY) / 120
hgt += 0.25 * (fbm(16, 21) - 0.5) + 0.08 * (fbm(64, 31, 3) - 0.5)
hgt -= 0.5 * crack
# colour
base = np.array([0.70, 0.63, 0.59]); warm = np.array([0.80, 0.70, 0.60]); rose = np.array([0.76, 0.60, 0.60]); lilac = np.array([0.62, 0.58, 0.68]); dark = np.array([0.36, 0.31, 0.33])
pick = rng.uniform(0, 1, len(pts)); shade = rng.uniform(0.92, 1.06, len(pts))
cid = pick[ID][..., None]
col = np.where(cid < 0.5, base, np.where(cid < 0.8, warm, np.where(cid < 0.93, rose, lilac)))
col = 0.55 * col + 0.45 * (base * 0.6 + warm * 0.4)
col = col * shade[ID][..., None]
col *= (0.84 + 0.3 * fbm(8, 41))[..., None]
led = np.sin((yy + warp2 * 0.5) / N * 2 * np.pi * 27 + fbm(8, 81) * 6); col *= (0.96 + 0.06 * led)[..., None]
col *= (0.93 + 0.14 * fbm(48, 51, 3))[..., None]
# lit block tops, darker undersides (stylised bevel)
gy, gx = np.gradient(ndi.gaussian_filter(hgt, 1.5))
col *= np.clip(1 - 9 * gy, 0.75, 1.2)[..., None]
col = col * (1 - crack[..., None] * 0.65) + dark * crack[..., None] * 0.35
# faint vertical rain streaks
streak = tnoise(64, 61); streak = ndi.gaussian_filter1d(streak, 18, axis=0, mode='wrap')
col *= (0.95 + 0.1 * streak)[..., None]
Image.fromarray((np.clip(col, 0, 1) ** (1 / 1.0) * 255).astype(np.uint8)).save('rock2.png')
h2 = ndi.gaussian_filter(hgt, 1.0); gy, gx = np.gradient(h2); s = 6.0
n = np.dstack([-gx * s, gy * s, np.ones_like(gx)]); n /= np.linalg.norm(n, axis=2, keepdims=True)
Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8)).save('rock2-n.png')
Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)).resize((512, 512)).save('rock2-prev.png')
print('rock2 done')
