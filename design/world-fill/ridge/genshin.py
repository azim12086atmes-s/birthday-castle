"""Repaint the land in the Genshin / Infinity Nikki manner (owner, Oct 17 14:12) and multiply in the light baked in Blender.
Clean painted colour fields instead of photo noise: sunny yellow-greens turning teal in hollows, pastel flower meadows,
pink blossom drifts, glowing teal-violet glowwood, layered warm cliffs with mossy tops, blue-lilac snow, turquoise shallows.
Baked: sky occlusion in valleys (Cycles AO, 700 m), contact shadow under buildings (Cycles AO, 50 m, with the placed models),
soft blue-violet tint in the occluded light, warm rims on crests. Writes ridge/out/game/crescent-colour.jpg, outer-colour.jpg."""
import numpy as np, json, sys, os
from scipy import ndimage as ndi
from PIL import Image, ImageDraw
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
sys.path.insert(0, f'{S}/ow')
from gen_noise import fbm
R = f'{S}/ridge'; OUT = f'{R}/out'; GAME = f'{OUT}/game'
MAPW, CX, CZ, L = 20691.0, -709.5, 2260.5, 40960.0
h = np.load(f'{OUT}/inner.npz')['h'].astype(np.float64); N = h.shape[0]; mpp = MAPW / N
B = np.load(f'{S}/fill/terrain/biome.npy')
orig = np.load(f'{OUT}/inner-colour.npy').astype(np.float64)
def ao(p, n):
    a = np.asarray(Image.open(p)).astype(np.float64) / 65535
    return np.asarray(Image.fromarray(a.astype(np.float32), mode='F').resize((n, n), Image.BILINEAR)).astype(np.float64)
aov = ao(f'{OUT}/ao-inner-valley.png', N)
aoc = ao(f'{OUT}/ao-inner-contact.png', N) if os.path.exists(f'{OUT}/ao-inner-contact.png') else np.ones_like(aov)
C = lambda *v: np.array(v, dtype=np.float64)
def mix(a, b, t): return a * (1 - t[..., None]) + b * t[..., None]
def sstep(x, a, b): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def paint(h, B, mpp, n, seed=0, outer=False):
    sl = np.hypot(*np.gradient(ndi.gaussian_filter(h, 0.8), mpp))
    f1 = fbm(n, 6, 3, 401 + seed); f2 = fbm(n, 18, 3, 402 + seed); f3 = fbm(n, 60, 2, 403 + seed)
    blot = sstep(f2 + 0.4 * f3, 0.15, 0.55)                      # painted colour patches ~300 m
    # biome edges: warped by noise and feathered so regions melt into each other like brushwork
    wi = np.clip(np.arange(n)[:, None] + 7 * fbm(n, 24, 3, 404 + seed), 0, n - 1).astype(int)
    wj = np.clip(np.arange(n)[None, :] + 7 * fbm(n, 24, 3, 405 + seed), 0, n - 1).astype(int)
    Bw = B[wi, wj] if not outer else B
    def M(*ks): return ndi.gaussian_filter(np.isin(Bw, ks).astype(float), 2.0)
    # ---- grass family by default (fresh Mondstadt greens, teal in the hollows)
    sunny, lush, teal = C(0.52, 0.74, 0.30), C(0.33, 0.62, 0.25), C(0.20, 0.50, 0.38)
    hollow = sstep(-ndi.laplace(ndi.gaussian_filter(h, 4)), -0.6, 0.6)     # 0 in hollows, 1 on rises
    col = mix(mix(teal, lush, sstep(f1, -0.6, 0.4)), sunny, 0.45 * hollow + 0.2 * blot)
    def where(mask, c):
        nonlocal col; col = mix(col, c, mask)
    mead = mix(C(0.58, 0.80, 0.42), C(0.97, 0.74, 0.84), sstep(f3, 0.25, 0.7) * 0.65)
    mead = mix(mead, C(0.78, 0.70, 0.97), sstep(-f3, 0.35, 0.8) * 0.55); mead = mix(mead, C(0.98, 0.92, 0.62), sstep(f2, 0.5, 0.9) * 0.45)
    where(M(8), mead)
    where(M(9), mix(C(0.58, 0.76, 0.34), C(0.80, 0.78, 0.44), blot * 0.5))                  # rolling farms, gold patches
    where(M(10), mix(C(0.22, 0.47, 0.24), C(0.31, 0.57, 0.26), sstep(f1, -0.3, 0.5)))        # forest floor
    where(M(11), mix(C(0.56, 0.78, 0.46), C(0.97, 0.72, 0.82), 0.3 + 0.45 * blot))           # blossom drifts
    glow = mix(C(0.20, 0.42, 0.42), C(0.28, 0.44, 0.60), sstep(f1, -0.4, 0.6))
    glow = mix(glow, C(0.46, 0.90, 0.92), sstep(fbm(n, 140, 2, 406 + seed), 0.45, 0.85) * 0.5); glow = mix(glow, C(0.70, 0.52, 0.95), sstep(fbm(n, 140, 2, 407 + seed), 0.45, 0.85) * 0.45)
    where(M(12), glow)
    where(M(13), mix(C(0.18, 0.52, 0.20), C(0.30, 0.64, 0.22), blot))                         # jungle
    strata = np.sin(2 * np.pi * (h + 14 * f2) / 26)
    where(M(14), mix(C(0.82, 0.54, 0.38), C(0.94, 0.78, 0.60), sstep(strata, -0.2, 0.4)))      # canyon bands
    where(M(15), mix(C(0.56, 0.70, 0.60), C(0.72, 0.82, 0.72), blot))                         # karst jade mist
    where(M(16), mix(C(0.21, 0.42, 0.31), C(0.29, 0.52, 0.35), sstep(f1, -0.3, 0.5)))        # taiga
    where(M(17), mix(C(0.55, 0.55, 0.68), C(0.68, 0.60, 0.78), blot))                         # lavender moor
    where(M(18), mix(C(0.54, 0.74, 0.46), C(0.84, 0.82, 0.96), sstep(f3, 0.4, 0.8) * 0.5))    # alpine meadow
    where(M(5, 6) * (0.55 + 0.45 * sstep(f3, -0.4, 0.3)), mix(C(0.97, 0.91, 0.74), C(0.99, 0.95, 0.84), blot))                       # beach, dunes
    where(M(4), C(0.32, 0.64, 0.50))                                                           # lagoon wetland
    if outer:   # the great ridge: green foothills, lilac-grey alpine rock, then snow
        alp = mix(C(0.50, 0.56, 0.52), C(0.66, 0.62, 0.74), sstep(f2, -0.3, 0.6))
        col = mix(col, alp, sstep(h, 900 + 300 * f1, 1700 + 300 * f1))
    # cliffs: warm layered stone, light top edges, moss on the gentle tops
    band = np.sin(2 * np.pi * (h + 8 * f2) / (18 if not outer else 140))
    stone = mix(C(0.60, 0.56, 0.54), C(0.80, 0.76, 0.70), sstep(band, -0.1, 0.5))
    stone = mix(stone, C(0.56, 0.60, 0.68), sstep(f1, 0.2, 0.7) * 0.5)
    r0, r1 = (0.55, 0.95) if not outer else (1.2, 2.4)
    col = mix(col, stone, sstep(sl, r0, r1) * (B != 21))
    # snow: blue-white, lilac in the steep parts; on the ridge only the sheerest faces stay bare
    if not outer:
        snowline = 1050 + 120 * f1; s0, s1 = 1.0, 1.6
    else:
        snowline = 2300 + 400 * f1 + 250 * f3; s0, s1 = 4.6, 7.5
    sn = sstep(h, snowline - 80, snowline + 220) * (1 - sstep(sl, s0, s1))
    col = mix(col, mix(C(0.95, 0.97, 1.0), C(0.80, 0.80, 0.96), sstep(sl, 0.4, 1.4)), sn)
    where(M(20), mix(C(0.93, 0.96, 1.0), C(0.80, 0.82, 0.97), sstep(sl, 0.4, 1.0)))
    # water: turquoise shallows to sapphire deep, by depth only (the game's water plane sits on top)
    sea = mix(C(0.32, 0.82, 0.80), C(0.05, 0.24, 0.50), sstep(-h, 1, 25))
    sea = mix(sea, C(0.30, 0.86, 0.84), M(2) * 0.6)                                            # reefs
    col = mix(col, sea, sstep(-h, -0.3, 1.2))
    col = mix(col, mix(C(0.34, 0.84, 0.82), C(0.16, 0.56, 0.74), sstep(-h, 0, 6)), M(3) * sstep(-ndi.gaussian_filter(h, 3), -3.5, -0.5))   # lake shallows read as clear water
    return col, sl

col, sl = paint(h, B, mpp, N)
# roads and plazas: warm cream, royal road gold; palace grounds keep their designed colours
paths = json.load(open(f'{OUT}/paths.json'))
U = N * 2; rimg = Image.new('L', (U, U)); d = ImageDraw.Draw(rimg); gimg = Image.new('L', (U, U)); dg = ImageDraw.Draw(gimg)
def px(x, z): return ((x - CX + MAPW / 2) / MAPW * U, (z - CZ + MAPW / 2) / MAPW * U)
for p in paths['paths']:
    w = max(2, int(p['width'] / MAPW * U)); dd = dg if p['kind'] == 'royal' else d
    for (a0, _, c0), (a1, _, c1) in zip(p['points'], p['points'][1:]):    # no paint across water (decks and the causeway carry it)
        ii_, jj_ = (np.array([c0, c1]) - CZ + MAPW / 2) / mpp - 0.5, (np.array([a0, a1]) - CX + MAPW / 2) / mpp - 0.5
        if (ndi.map_coordinates(h, [ii_, jj_], order=1) < 0.5).any(): continue
        dd.line([px(a0, c0), px(a1, c1)], fill=255, width=w)
for q in paths['plazas']:
    x, y = px(q['x'], q['z']); r = q['radius'] / MAPW * U; d.ellipse([x - r, y - r, x + r, y + r], fill=255)
road = np.asarray(rimg.resize((N, N), Image.BILINEAR)) / 255.0; royal = np.asarray(gimg.resize((N, N), Image.BILINEAR)) / 255.0
col = mix(col, C(0.93, 0.86, 0.70), np.clip(road * 1.4, 0, 1)); col = mix(col, C(0.99, 0.88, 0.60), np.clip(royal * 1.4, 0, 1))
pal = ndi.gaussian_filter((B == 21).astype(float), 1.5)
col = mix(col, orig, pal)
# a whisper of the old texture for grain, then the baked light
lum = orig.mean(2); grain = (lum - ndi.gaussian_filter(lum, 2)) * 0.6
col = col * (1 + grain[..., None])
def light(col, aov, aoc, h, mpp):
    occ = np.clip(aov, 0, 1) ** 1.3 * (0.55 + 0.45 * np.clip(aoc, 0, 1) ** 1.6)
    tint = C(0.72, 0.80, 1.06)                                   # shadowed light is sky-blue / violet, like the games
    lit = col * (0.42 + 0.58 * occ[..., None])
    lit = mix(lit, lit * tint, (1 - occ) * 0.8)
    crest = sstep(-ndi.laplace(ndi.gaussian_filter(h, 2)), 0.5, 3.0)
    lit = lit + crest[..., None] * C(0.07, 0.05, 0.02)
    # gentle overall vibrance: lift saturation a touch
    g = lit.mean(2, keepdims=True); lit = g + (lit - g) * 1.12
    return np.clip(lit, 0, 1)
inner = light(col, aov, aoc, h, mpp)
inner = mix(inner, orig, pal * 0.6)
Image.fromarray((inner * 255).astype(np.uint8)).save(f'{OUT}/genshin-inner-2048.png')
Image.fromarray((inner * 255).astype(np.uint8)).resize((1024, 1024), Image.LANCZOS).save(f'{GAME}/crescent-colour.jpg', quality=90)
# ---- the great ridge and the outer sea
ho = np.load(f'{OUT}/outer.npz')['h'].astype(np.float64); G = ho.shape[0]; mo = L / G
Bo = np.full((G, G), 16, dtype=np.int16)                                  # foothills read as taiga, then rock and snow above
Bo[ho < 2] = 1
co_, _ = paint(ho, Bo, mo, G, seed=7, outer=True)
aoo = ao(f'{OUT}/ao-outer.png', G)
outer = light(co_, aoo, np.ones_like(aoo), ho, mo)
c = (np.arange(G) + 0.5) / G * L - L / 2
Xo, Zo = np.meshgrid(CX + c, CZ + c)
inbox = (np.abs(Xo - CX) < MAPW / 2) & (np.abs(Zo - CZ) < MAPW / 2)
bi = np.clip((Zo - CZ + MAPW / 2) / MAPW * N - 0.5, 0, N - 1); bj = np.clip((Xo - CX + MAPW / 2) / MAPW * N - 0.5, 0, N - 1)
edge = np.minimum(MAPW / 2 - np.abs(Xo - CX), MAPW / 2 - np.abs(Zo - CZ)); wbox = sstep(edge, 0, 1800) * inbox
for k in range(3): outer[..., k] = outer[..., k] * (1 - wbox) + ndi.map_coordinates(inner[..., k], [bi, bj], order=1) * wbox
Image.fromarray((outer * 255).astype(np.uint8)).save(f'{OUT}/genshin-outer-2048.png')
Image.fromarray((outer * 255).astype(np.uint8)).resize((1024, 1024), Image.LANCZOS).save(f'{GAME}/outer-colour.jpg', quality=90)
print('painted')
