"""Open-world terrain for the Starlight Coast (sheet 04 coast, x S = 2.75, about 20.7 km square).
Heights in world metres. Writes arrays to OUT for the painter and the Blender build."""
import sys, os, json, time, numpy as np
from scipy import ndimage as ndi
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'lay'))
from terrain import derive
from layout_data import LANDMARKS, PX0, PZ0, MPP
import flow
S = 2.75; MAPPX = 1254; WORLD = MAPPX * MPP * S          # 20,691 m
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'out')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(23)
t0 = time.time()
def log(*a): print(f'[{time.time()-t0:5.0f}s]', *a, flush=True)

def grid(N):
    p = (np.arange(N) + 0.5) * MAPPX / N
    X1 = (p - PX0) * MPP; Z1 = (p - PZ0) * MPP          # drawn (x1) metres; world = x1 * S
    return np.meshgrid(X1, Z1)                            # rows = z (south +), cols = x

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

def blob(X1, Z1, x, z, r): return np.exp(-((X1 - x) ** 2 + (Z1 - z) ** 2) / (2 * r * r))
def smooth(t): t = np.clip(t, 0, 1); return t * t * (3 - 2 * t)
def poly_dist(X1, Z1, pts):
    d = np.full(X1.shape, 1e9)
    for (ax, az), (bx, bz) in zip(pts[:-1], pts[1:]):
        vx, vz = bx - ax, bz - az; L = vx * vx + vz * vz
        t = np.clip(((X1 - ax) * vx + (Z1 - az) * vz) / L, 0, 1)
        d = np.minimum(d, np.hypot(X1 - ax - t * vx, Z1 - az - t * vz))
    return d

# ---------------------------------------------------------------- masks from the owner's map
hf0, land0, mapim = derive()
lab, n = ndi.label(~land0)
ocean0 = np.zeros_like(land0); lakes0 = np.zeros_like(land0)
for i in range(1, n + 1):
    m = lab == i; s = m.sum(); yy, xx = np.nonzero(m)
    border = yy.min() == 0 or xx.min() == 0 or yy.max() == MAPPX - 1 or xx.max() == MAPPX - 1
    if border: ocean0 |= m
    elif s > 3000: lakes0 |= m          # Lantern Lake (four pieces split by the causeway and islets)
    elif s > 180: lakes0 |= m           # tarns drawn on the map
# Lantern Lake: one body, the causeway becomes a bridge
big = ndi.binary_closing(lakes0, iterations=6) & ~ocean0
LANDMARK_LAND = np.zeros_like(land0)
yy, xx = np.mgrid[0:MAPPX, 0:MAPPX]
for c in ('B02', 'B03'):
    _, x, z, w, d = LANDMARKS[c]; px, py = PX0 + x / MPP, PZ0 + z / MPP
    LANDMARK_LAND |= (xx - px) ** 2 + (yy - py) ** 2 < (max(w, d) / 2 / MPP * 1.1) ** 2
lakes0 = (big | lakes0) & ~LANDMARK_LAND

def up(mask, N): return ndi.zoom(mask.astype(np.float32), N / MAPPX, order=1) > 0.5

def build(N):
    X1, Z1 = grid(N); dx = WORLD / N
    ocean = up(ocean0, N); lake = up(lakes0, N)
    # fractal coastline: perturb the signed distance so the map's smooth coast gets coves and points
    land = ~ocean
    sd = (ndi.distance_transform_edt(land) - ndi.distance_transform_edt(~land)) * dx
    sd = sd + fbm(N, 24, 5, 11) * 110 + fbm(N, 96, 3, 12) * 35
    ocean = sd < 0
    lab_, n_ = ndi.label(ocean); keep = lab_ == np.bincount(lab_.ravel())[1:].argmax() + 1
    small = ocean & ~keep; ocean = keep                     # stray sea pockets become land
    land = ~ocean
    dco = ndi.distance_transform_edt(land) * dx             # metres from the sea, inland
    dsea = ndi.distance_transform_edt(ocean) * dx            # metres from land, offshore
    dlake = ndi.distance_transform_edt(~lake) * dx
    dlakein = ndi.distance_transform_edt(lake) * dx
    # ----- regions (drawn coordinates, so they track the sheet)
    # region shapes are domain-warped so no district reads as a circle
    Xw_ = X1 + 260 * fbm(N, 5, 4, 301); Zw_ = Z1 + 260 * fbm(N, 5, 4, 302)
    X1o, Z1o = X1, Z1; X1, Z1 = Xw_, Zw_
    spine_pts = [(-3150, -1680), (-2500, -1760), (-1600, -1720), (-700, -1680), (300, -1720), (1100, -1650),
                 (1800, -1500), (2500, -1200)]
    west_pts = [(-3150, -1680), (-3350, -1100), (-3300, -400)]
    dsp = np.minimum(poly_dist(X1, Z1, spine_pts), poly_dist(X1, Z1, west_pts) * 1.15)
    R = dict(
        spine=np.exp(-(dsp / 450) ** 2),
        misty=blob(X1, Z1, 1060, -820, 470),
        easthill=blob(X1, Z1, 1050, -420, 520),
        westhill=blob(X1, Z1, -2190, 240, 650),
        canyon=smooth((780 - np.hypot(X1 - 1650, Z1 - 1700)) / 260),
        karst=smooth((640 - np.hypot(X1 - 2300, Z1 - 420)) / 220),
        jungle=smooth((700 - np.hypot(X1 - 1950, Z1 - 2650)) / 300),
        lagoon=smooth((380 - np.hypot((X1 + 2480) / 1.2, Z1 - 1180)) / 120),
        fjord=smooth((900 - np.hypot(X1 + 2600, Z1 + 1250)) / 350),
        glow=smooth((620 - np.hypot(X1 + 2000, Z1 + 250)) / 260),
        blossom=np.maximum(smooth((480 - np.hypot(X1 + 1320, Z1 - 1800)) / 200), smooth((150 - dlake / S) / 120) * 0.75),
        reef=smooth((900 - np.hypot(X1 - 2600, Z1 - 3250)) / 300),
        palace=smooth((900 - np.hypot(X1, Z1 + 80)) / 400),
    )
    X1, Z1 = X1o, Z1o
    # ----- base land
    inland = smooth(dco / 900)
    h = 5 + 75 * (1 - np.exp(-dco / 1800))
    h += (fbm(N, 8, 6, 21) * 0.5 + 0.5) * 110 * inland          # rolling country everywhere
    h += ridged(N, 22, 5, 25) * 120 * inland * (1 - smooth((1500 - dlake) / 1500) * 0.8)   # many hills
    peaks = 0.75 + 0.45 * fbm(N, 6, 3, 31)                     # some summits higher than others
    rid = ridged(N, 10, 7, 41)
    h += R['spine'] * (420 + 1750 * rid) * peaks * smooth(dco / 700)
    h += R['misty'] * (500 + 800 * ridged(N, 24, 6, 51)) * inland
    h += R['easthill'] * 230 * (0.6 + 0.4 * fbm(N, 20, 5, 61)) * inland
    h += R['westhill'] * 140 * (0.7 + 0.3 * fbm(N, 14, 4, 71)) * inland
    h += R['jungle'] * 110 * (0.5 + 0.5 * fbm(N, 28, 5, 81))
    # canyon plateau: a mesa block cut by winding gorges, stepped strata
    plate = 300 + 40 * fbm(N, 16, 4, 91)
    gorge = np.clip((0.22 - np.abs(fbm(N, 6, 4, 92))) / 0.22, 0, 1) ** 0.35
    mesa = plate - gorge * 230
    step = 32.0; frac = mesa / step; mesa = (np.floor(frac) + smooth((frac % 1 - 0.75) / 0.25)) * step
    h = h * (1 - R['canyon']) + np.maximum(mesa, h * 0.5) * R['canyon']
    # karst basin floor
    h = h * (1 - R['karst']) + (55 + 25 * fbm(N, 30, 4, 101)) * R['karst']
    # fjord: a deep glacial trough from the coast to the longhouse, steep walls
    fj = poly_dist(X1, Z1, [(-3900, -1250), (-3200, -1150), (-2600, -1080), (-2280, -1020)])
    trough = smooth((260 - fj) / 180)
    h = h * (1 - trough) - 25 * trough
    h += smooth((700 - fj) / 400) * (1 - trough) * 380 * (0.6 + 0.4 * rid)
    # Lantern Lake basin and shore
    lake_level = 3.0
    basin = smooth(dlake / 1400)                     # land slopes gently down to the lake instead of a wall
    h = np.where(dlake < 3000, (lake_level + 1.0) + (h - lake_level - 1.0) * (0.04 + 0.96 * basin), h)
    shore = np.where(dlake < 2500, np.maximum(h, lake_level + 0.8 + dlake * 0.006), h)
    h = np.where(lake, lake_level - np.minimum(0.6 + dlakein * 0.03, 28), shore)
    # lagoon: shallow water with sandbars
    h = h * (1 - R['lagoon']) + (-1.8 + 2.2 * fbm(N, 60, 3, 111)) * R['lagoon']
    # coast: cliffs on the north and east, gentle elsewhere
    cliffy = smooth((np.maximum(R['spine'], R['misty']) + smooth((X1 - 1800) / 900) * 0.8 + R['fjord'] * 0.6) - 0.15)
    cliffy *= (1 - R['jungle']) * (1 - R['reef'])
    h = np.where(land, h * (1 - cliffy * np.exp(-dco / 70)) + cliffy * smooth(dco / 90) * 70, h)
    # sea floor
    sea = -np.minimum(2.5 + dsea * 0.045, 140) * (1 - R['reef'] * 0.85) - R['reef'] * (1.0 + 3 * (fbm(N, 80, 3, 121) * 0.5 + 0.5))
    h = np.where(ocean, sea, h)
    hard = np.ones((N, N)) * (1 + 1.5 * R['canyon'] + 3 * R['karst'])   # sandstone mesas, karst resist
    return dict(N=N, dx=dx, X1=X1, Z1=Z1, h=h, ocean=ocean, lake=lake, land=land, dco=dco, dsea=dsea, R=R, hard=hard,
                trough=trough, lake_level=lake_level, cliffy=cliffy)

# ---------------------------------------------------------------- pass 1: shape + erosion at 1024
A = build(1024); log('base 1024 built, max', A['h'].max().round())
sink = A['ocean'] | A['lake'] | (A['R']['lagoon'] > 0.5)
he = flow.erode(A['h'].copy(), sink, A['dx'], iters=28, kdt=0.0026, hard=A['hard'])
delta = he - A['h']; log('eroded, cut min', delta.min().round(), 'max', he.max().round())

# ---------------------------------------------------------------- pass 2: final 2048 with detail
N = 2048
B = build(N)
h = B['h'] + ndi.zoom(delta, 2, order=3)
h += fbm(N, 256, 3, 131) * 3.0 * B['land'] * smooth(B['dco'] / 200)          # small lumps
X1, Z1, dx = B['X1'], B['Z1'], B['dx']
# karst pillars (rasterised after erosion so they stay sheer)
pillars = []
pr = np.random.default_rng(7)
for k in range(900):
    x = 2300 + pr.uniform(-640, 640); z = 420 + pr.uniform(-640, 640)
    if np.hypot(x - 2300, z - 420) > 600: continue
    rad = pr.uniform(14, 46) / S; hh = pr.uniform(120, 430) * (0.6 + 0.4 * (1 - np.hypot(x - 2300, z - 420) / 640))
    if any(np.hypot(x - a, z - b) < (rad + r2) * 1.6 for a, b, r2, _ in pillars): continue
    pillars.append((x, z, rad, hh))
    if len(pillars) >= 150: break
stacks = []
coast = B['ocean'] & (B['dsea'] < 260) & (B['dsea'] > 40) & (B['cliffy'] > 0.2)
cy, cx = np.nonzero(coast)
for k in pr.choice(len(cy), size=min(400, len(cy)), replace=False):
    x, z = X1[cy[k], cx[k]], Z1[cy[k], cx[k]]
    if any(np.hypot(x - a, z - b) < 120 for a, b, _, _ in stacks): continue
    stacks.append((x, z, pr.uniform(10, 30) / S, pr.uniform(25, 90)))
    if len(stacks) >= 45: break
def rasterise(h, cols, base_mode):
    for x, z, rad, hh in cols:
        r = np.hypot(X1 - x, Z1 - z); m = r < rad * 1.4
        if not m.any(): continue
        prof = smooth((rad * 1.25 - r[m]) / (rad * 0.5)) ** 0.25 * (1 + 0.04 * np.cos(r[m] * 0.9))
        base = 0 if base_mode == 'sea' else h[m].min()
        h[m] = np.maximum(h[m], base + hh * prof)
    return h
h = rasterise(h, pillars, 'land'); h = rasterise(h, stacks, 'sea')
# landmark pads, palace platform and the golden approach
pads = {}
for c, (nm, x, z, w, d) in LANDMARKS.items():
    r = max(w, d) / 2 * 1.15; ring = r * 1.7
    rr = np.hypot(X1 - x, Z1 - z); m = rr < r
    local = h[m]
    tgt = np.percentile(local, 70 if c in ('B05', 'B04', 'B06') else 50)
    if c in ('B02', 'B03'): tgt = B['lake_level'] + 5
    if c in ('B22', 'B24', 'B23', 'B19', 'B20', 'B21'): tgt = max(tgt, 6)
    if c == 'B09': tgt = 1.5
    if c == 'B14': continue                         # the pillars are the city
    wgt = smooth((ring - rr) / (ring - r))
    h = h * (1 - wgt) + tgt * wgt; pads[c] = round(float(tgt), 1)
PAL_W, PAL_D, PAL_Z = 800 * S, 680 * S, 120.0
Xw, Yw = X1 * S, Z1 * S
ddx = np.maximum(np.abs(Xw) - PAL_W / 2, 0); ddy = np.maximum(np.abs(Yw) - PAL_D / 2, 0)
wg = smooth(1 - np.hypot(ddx, ddy) / 700.0)
h = h * (1 - wg) + PAL_Z * wg
sS = smooth((Yw - PAL_D / 2) / 1200.0)
cw = smooth(1 - (np.abs(Xw) - 300) / 400.0) * ((Yw > PAL_D / 2) & ~B['lake'])
h = h * (1 - cw) + (PAL_Z * (1 - sS) + np.minimum(h, 20) * sS) * cw
palace_mask = wg > 0.5
log('final heights, max', h.max().round(), 'min', h.min().round())

# ---------------------------------------------------------------- rivers, tarns, waterfalls
sink = B['ocean'] | B['lake'] | (B['R']['lagoon'] > 0.5)
f, rcv, dist, Acc = flow.flow(h, sink, dx)
tarn = (f - h > 3.0) & B['land'] & ~B['lake']
lab_, n_ = ndi.label(tarn); sizes = ndi.sum(tarn, lab_, range(1, n_ + 1))
tarn = np.isin(lab_, 1 + np.nonzero(sizes * dx * dx > 60000)[0])
stream = (Acc > 5e5) & B['land'] & ~B['lake'] & ~tarn
river = (Acc > 4e6) & B['land'] & ~B['lake'] & ~tarn
riverw = ndi.binary_dilation(river, iterations=1) & B['land'] & ~B['lake']
h = np.where(riverw, h - 3, np.where(stream, h - 1.2, h))
gy, gx = np.gradient(h, dx); slope = np.hypot(gx, gy)
fall = stream & (slope > 0.55)
lab_f, nfall = ndi.label(ndi.binary_dilation(fall, iterations=2))
np.savez_compressed(f'{OUT}/terrain.npz', h=h.astype(np.float32), slope=slope.astype(np.float32), ocean=B['ocean'], lake=B['lake'],
                    tarn=tarn, stream=stream, river=riverw, fall=fall, palace=palace_mask, dco=B['dco'].astype(np.float32),
                    dsea=B['dsea'].astype(np.float32), fill=f.astype(np.float32), cliffy=B['cliffy'].astype(np.float32),
                    trough=B['trough'].astype(np.float32), **{'R_' + k: v.astype(np.float32) for k, v in B['R'].items()})
json.dump(dict(world_m=WORLD, N=N, dx=dx, pads=pads, pillars=len(pillars), stacks=len(stacks), waterfalls=int(nfall),
               lake_level=B['lake_level'], pillar_list=pillars, stack_list=stacks), open(f'{OUT}/terrain.json', 'w'))
log('saved', len(pillars), 'pillars', len(stacks), 'stacks', nfall, 'waterfalls')
