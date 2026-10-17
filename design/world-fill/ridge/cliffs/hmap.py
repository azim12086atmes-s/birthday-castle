import numpy as np, sys
from PIL import Image
O = sys.argv[1]; h = np.load(f'{O}/inner.npz')['h'].astype(float); N = h.shape[0]; MAPW, CX, CZ = 20691.0, -709.5, 2260.5; cs = MAPW / N
c = CX - MAPW / 2 + (np.arange(N) + 0.5) * cs; r = CZ - MAPW / 2 + (np.arange(N) + 0.5) * cs
j0, j1 = np.searchsorted(c, -4300), np.searchsorted(c, 4300); i0, i1 = np.searchsorted(r, -4300), np.searchsorted(r, 12500)
a = h[i0:i1, j0:j1]; gz, gx = np.gradient(a, cs)
sh = np.clip(0.6 + (-gx * 0.6 - gz * 0.6 + 1) / np.sqrt(1 + gx ** 2 + gz ** 2) * 0.4 - 0.4, 0, 1)
t = np.clip(a / 1100, 0, 1); col = np.stack([0.35 + 0.6 * t, 0.45 + 0.4 * t, 0.3 + 0.5 * t], -1)
col = np.where((a < 0.5)[..., None], [0.1, 0.25, 0.45], col) * sh[..., None]
for lv in (90, 170, 340, 500, 640, 687.5, 742.5, 797.5): col[np.abs(a - lv) < 0.3] *= [1.0, 0.85, 0.85]
Image.fromarray((np.clip(col, 0, 1) * 255).astype(np.uint8)).save(sys.argv[2], quality=85)
