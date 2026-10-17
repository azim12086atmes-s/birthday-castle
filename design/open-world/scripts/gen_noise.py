import numpy as np
from scipy import ndimage as ndi
def vnoise(N, cells, seed):
    r = np.random.default_rng(seed); g = r.standard_normal((cells + 4, cells + 4))
    f = N / cells; z = ndi.zoom(g, f, order=3, mode='wrap')
    o = int(f); z = z[o:o + N, o:o + N]
    return (z - z.mean()) / (z.std() + 1e-9)

def fbm(N, base, octv, seed, pers=0.5):
    s = np.zeros((N, N)); a = 1.0; tot = 0
    for o in range(octv):
        c = base * 2 ** o
        if c > N // 2: break
        s += a * vnoise(N, c, seed + o); tot += a; a *= pers
    return s / tot

def ridged(N, base, octv, seed, pers=0.5):
    s = np.zeros((N, N)); a = 1.0; w = np.ones((N, N)); tot = 0
    for o in range(octv):
        c = base * 2 ** o
        if c > N // 2: break
        n = np.clip(np.abs(vnoise(N, c, seed + 50 + o)) / 2.2, 0, 1)
        r = (1 - n) ** 2 * w
        s += a * r; tot += a; w = np.clip(r * 2, 0, 1); a *= pers
    return s / tot

