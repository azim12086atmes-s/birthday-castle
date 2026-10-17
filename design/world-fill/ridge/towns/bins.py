"""Re-bake the game's height bins from ridge/out/inner.npz after a terrain edit (towns, sky palace):
crescent-h.bin (1024 over the 20.7 km map) and the outer world's copy of the map region (outer-h.bin)."""
import numpy as np
from scipy import ndimage as ndi
O = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/ridge/out'
MAPW, CX, CZ, L = 20691.0, -709.5, 2260.5, 40960.0
hi = np.load(f'{O}/inner.npz')['h'].astype(np.float64); N = hi.shape[0]; cs = MAPW / N
ho = np.load(f'{O}/outer.npz')['h'].astype(np.float64); Gn = ho.shape[0]
co = CX - L / 2 + (np.arange(Gn) + 0.5) * L / Gn; ro = CZ - L / 2 + (np.arange(Gn) + 0.5) * L / Gn
m = 300                                                    # stay inside the map's own edge band, which the outer world owns
oj0, oj1 = np.searchsorted(co, CX - MAPW / 2 + m), np.searchsorted(co, CX + MAPW / 2 - m)
oi0, oi1 = np.searchsorted(ro, CZ - MAPW / 2 + m), np.searchsorted(ro, CZ + MAPW / 2 - m)
OX, OZ = np.meshgrid(co[oj0:oj1], ro[oi0:oi1])
new = ndi.map_coordinates(hi, [(OZ - CZ + MAPW / 2) / cs - 0.5, (OX - CX + MAPW / 2) / cs - 0.5], order=1)
old = ho[oi0:oi1, oj0:oj1]
ho[oi0:oi1, oj0:oj1] = np.where(np.abs(new - old) > 0.5, new, old)   # only where the map changed
np.savez_compressed(f'{O}/outer.npz', h=ho.astype(np.float32))
enc = lambda a: np.clip(np.rint((a + 500) * 7), 0, 65535).astype('<u2')
enc(hi.reshape(N // 2, 2, N // 2, 2).mean((1, 3))).tofile(f'{O}/game/crescent-h.bin')
enc(ho.reshape(Gn // 2, 2, Gn // 2, 2).mean((1, 3))).tofile(f'{O}/game/outer-h.bin')
print('bins baked')
