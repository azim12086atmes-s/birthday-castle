"""Tileable waterfall veil texture (RGBA, scroll V over time) and a mist puff sprite for the arrival gate."""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
O = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/fill/gate'
rng = np.random.default_rng(7); W, H = 512, 1024
x = np.arange(W)[None, :]; y = np.arange(H)[:, None]
a = np.zeros((H, W))
for k in range(60):
    f = rng.integers(4, 48); ph = rng.random() * 2 * np.pi; amp = rng.random() ** 2
    fy = rng.integers(1, 6); phy = rng.random() * 2 * np.pi
    a += amp * (0.5 + 0.5 * np.sin(2 * np.pi * f * x / W + ph)) ** 6 * (0.6 + 0.4 * np.sin(2 * np.pi * fy * y / H + phy))
a = (a - a.min()) / (a.max() - a.min())
n = ndi.gaussian_filter(rng.random((H, W)), (14, 3), mode='wrap'); n = (n - n.min()) / (n.max() - n.min())
alpha = np.clip(0.42 + 0.75 * a ** 1.3 + 0.45 * (n - 0.5), 0, 1)
col = np.stack([0.80 + 0.2 * a, 0.90 + 0.1 * a, np.ones_like(a)], -1)
Image.fromarray((np.dstack([col, alpha[..., None]]) * 255).astype(np.uint8), 'RGBA').save(f'{O}/waterfall-512x1024.png')
bg = np.zeros((H, W, 3)); bg[:] = [0.1, 0.2, 0.35]
Image.fromarray(((bg * (1 - alpha[..., None]) + col * alpha[..., None]) * 255).astype(np.uint8)).resize((256, 512)).save(f'{O}/preview.jpg')
R = 256; yy, xx = np.mgrid[0:R, 0:R]; r = np.hypot(xx - R / 2, yy - R / 2) / (R / 2)
nz = ndi.gaussian_filter(rng.random((R, R)), 6); nz = (nz - nz.min()) / (nz.max() - nz.min())
al = (np.clip(1 - r, 0, 1) ** 2 * (0.6 + 0.6 * nz)).clip(0, 1)
Image.fromarray((np.dstack([np.ones((R, R, 3)), al[..., None]]) * 255).astype(np.uint8), 'RGBA').save(f'{O}/mist-256.png')
