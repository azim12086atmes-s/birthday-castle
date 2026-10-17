"""The sky palace (owner, Oct 17 19:29): "the plateau 500 m to 1000 m in height, along with the bridges ... a high
aerial bridge and a grand look, the bridge connecting to the end of the crescent mountains; the other side a large
circular platform surrounded in clouds and a large gate within the mountain that opens, with a marble floor; as you go
in the white light grows brighter, and when you come out the bridge continues with a waterfall gushing hard in front".
Owner chose the south waterfall gate (19:31). Also (19:17) sharper, curved plateaus, not flat blobs.
  palace mesa: plateau box + upper terrace 797.5 m (290 drawn), middle terrace 742.5 (270), lower terrace 687.5 (250);
  then terrace rings at 640, 500, 340, 170 m down to the moat; spurs and inlets on every ring;
  satellites: tops at 640 / 500 / 340 m, stepped down the same levels; tall sea stacks 350-700 m;
  the sky bridge: a level deck at 687.5 m from the lower terrace's south edge to a gate massif filling the old gap in
  the south wall, tunnelled through to a circular cloud platform on the outer side (spec in cliffs.json: sky).
Writes the same files as cliffs2.py."""
import numpy as np, json, math, os
from scipy import ndimage as ndi
import contourpy
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
R = f'{S}/ridge'; OUT = f'{R}/out'; GAME = f'{OUT}/game'
MAPW, CX, CZ, L = 20691.0, -709.5, 2260.5, 40960.0
h0 = np.load(f'{OUT}/inner-pre-cliffs.npz')['h'].astype(np.float64); N = h0.shape[0]; cs = MAPW / N
TOP, MID, LOW = 797.5, 742.5, 687.5
RINGS = [640.0, 500.0, 340.0, 170.0]; SHORE = [90.0, 170.0]; NEG = -1e3
SKY = LOW + 0.5                                               # the sky bridge deck
c = CX - MAPW / 2 + (np.arange(N) + 0.5) * cs; r_ = CZ - MAPW / 2 + (np.arange(N) + 0.5) * cs
j0, j1 = np.searchsorted(c, -4300), np.searchsorted(c, 4300); i0, i1 = np.searchsorted(r_, -4300), np.searchsorted(r_, 4700)
X, Z = np.meshgrid(c[j0:j1], r_[i0:i1]); hw = h0[i0:i1, j0:j1].copy()
def vn(x, z, f, seed):
    g = np.random.default_rng(seed).uniform(-1, 1, (64, 64)); return ndi.map_coordinates(g, [(z * f) % 63, (x * f) % 63], order=3, mode='wrap')
def sstep(x, a, b): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def box_sd(x, z, x0, x1, z0, z1):
    dx = np.maximum(x0 - x, x - x1); dz = np.maximum(z0 - z, z - z1)
    return np.hypot(np.maximum(dx, 0), np.maximum(dz, 0)) + np.minimum(np.maximum(dx, dz), 0)
# --- palace mesa
PIECES = [(-1169, 1292, -1155, 935, TOP), (-1292, 1292, 935, 1540, TOP), (-1430, 1430, 1540, 1980, MID), (-1540, 1540, 1980, 2420, LOW)]
dP = np.full(X.shape, 1e9); topP = np.zeros(X.shape)
for x0, x1, z0, z1, t in PIECES:
    d = box_sd(X, Z, x0, x1, z0, z1); topP = np.where(d < dP, t, topP); dP = np.minimum(dP, d)
def spur(seed, f=0.0035): return sstep(vn(X, Z, f, seed), 0.12, 0.65) ** 1.5                 # sharp lobes (prows) on a third of the rim
Hp = np.full(X.shape, NEG); acc = np.zeros(X.shape)
for k, lv in enumerate(RINGS):                                 # rings outward, each a step down
    acc = acc + 85 + 20 * vn(X, Z, 0.006, 31 + k) + 170 * spur(41 + k) - 45 * sstep(-vn(X, Z, 0.005, 51 + k), 0.2, 0.7)
    Hp = np.where((Hp == NEG) & (dP < acc), lv, Hp)
Hp = np.where(dP <= 0, topP, Hp)
# --- satellite plateaus: sharp-lobed outlines (spurs and inlets), tops 640 / 500 / 340
MESAS = [dict(id='B25', x=-1155, z=-1485, r=250, top=640.0), dict(id='B32', x=-1826, z=608, r=360, top=500.0),
         dict(id='north', x=60, z=-1700, r=250, top=640.0), dict(id='northeast', x=1680, z=-1470, r=210, top=500.0),
         dict(id='east', x=1840, z=160, r=290, top=640.0), dict(id='west-n', x=-1880, z=-520, r=210, top=500.0),
         dict(id='southeast', x=2180, z=1560, r=230, top=340.0), dict(id='southwest', x=-2140, z=1700, r=230, top=340.0)]
for m in MESAS: m['rt'] = m['r'] if m['id'] in ('B25', 'B32') else round(0.85 * m['r'])
def mesa_rr(m, a):
    p1, p2 = m['x'] * 0.01, m['z'] * 0.02
    return m['rt'] * (1 + 0.08 * np.sin(3 * a + p1) + 0.05 * np.sin(7 * a + p2) + 0.22 * np.maximum(np.sin(5 * a + p2), 0) ** 6
                      - 0.10 * np.maximum(np.sin(4 * a + p1 + 1.3), 0) ** 4)
Hs = np.full(X.shape, NEG); dM = np.full(X.shape, 1e9)
for k, m in enumerate(MESAS):
    a = np.arctan2(Z - m['z'], X - m['x']); q = np.hypot(X - m['x'], Z - m['z']); d = q - mesa_rr(m, a)
    hs = np.where(d <= 0, m['top'], NEG); acc = np.zeros(X.shape)
    for j, lv in enumerate([v for v in RINGS if v < m['top'] - 1]):
        acc = acc + 72 + 14 * vn(X, Z, 0.01, 60 + 7 * k + j) + 60 * np.maximum(vn(X, Z, 0.008, 90 + 7 * k + j), 0) ** 3
        hs = np.where((hs == NEG) & (d > 0) & (d < acc), lv, hs)
    Hs = np.maximum(Hs, hs); dM = np.minimum(dM, d)
STACKS = [dict(x=-700, z=-1750, r=110, h=560), dict(x=1250, z=-1700, r=95, h=470), dict(x=2500, z=-700, r=120, h=690),
          dict(x=-1750, z=-1250, r=85, h=420), dict(x=2550, z=900, r=100, h=520), dict(x=-2550, z=300, r=95, h=480),
          dict(x=-1250, z=2850, r=90, h=380), dict(x=1250, z=3000, r=100, h=450), dict(x=-2700, z=2400, r=110, h=360),
          dict(x=200, z=-2350, r=95, h=620), dict(x=-2350, z=-1500, r=90, h=430), dict(x=2300, z=-1900, r=85, h=590), dict(x=-2400, z=1100, r=80, h=400), dict(x=2450, z=-200, r=75, h=350)]
# --- the moat and the outer shore
ang = np.arctan2(Z, X)
Wm = 1000 + 200 * np.sin(2 * ang + 0.7) + 110 * np.sin(5 * ang + 2.1) + 80 * vn(X, Z, 0.004, 3)
south = sstep(Z, 900, 1300); Wm = Wm * (1 - south) + 950 * south
base = -16 - 12 * sstep(dP, 500, 700) * sstep(-(dP - Wm), 80, 260) + 4 * vn(X, Z, 0.01, 4)
def cliff(t, top, bot, lc):
    u = np.clip(t / lc, 0, 1); f = 1 - u ** 0.55; steps = np.round(f * 6) / 6; f = 0.65 * f + 0.35 * steps
    return bot + (top - bot) * f
t_out = dP - Wm
h = np.where(t_out < 0, base, hw)
b1 = 95 + 16 * vn(X, Z, 0.006, 61) + 80 * spur(63); b2 = b1 + 95 + 18 * vn(X, Z, 0.006, 62)
top2 = SHORE[1]
rise = np.maximum(np.minimum(hw, top2 + 0.22 * np.maximum(t_out - b2 - 60, 0) + 10 * vn(X, Z, 0.006, 9)), top2 * (1 - sstep(t_out, b2, b2 + 600)))
stepped_out = np.where(t_out < b1, SHORE[0], np.where(t_out < b2, SHORE[1], rise))
lco = 45 + 20 * (vn(X, Z, 0.02, 6) + 1)
old_out = np.where(t_out < lco, np.minimum(hw, cliff(lco - t_out, np.clip(hw, 3, 60), base, lco)), hw)
h = np.where(t_out >= 0, np.where(south < 0.5, stepped_out, old_out), h)
h = np.maximum(h, Hp); h = np.maximum(h, Hs); h = np.where(dP <= 0, topP, h)
for s in STACKS:
    q = np.hypot(X - s['x'], Z - s['z']); a = np.arctan2(Z - s['z'], X - s['x'])
    rr = s['r'] * (1 + 0.12 * np.sin(4 * a + s['x']) + 0.07 * np.sin(9 * a + s['z']) + 0.2 * np.maximum(np.sin(3 * a + s['z']), 0) ** 6)
    top = s['h'] + 10 * vn(X, Z, 0.03, 8)
    h = np.where(q <= rr, top, np.where(q < rr + 30, np.maximum(h, cliff(q - rr, top, base, 30)), h))
h_step = h.copy()
# --- sampling helpers
def H(hh, x, z):
    jj = (np.asarray(x, float) - X[0, 0]) / cs; ii = (np.asarray(z, float) - Z[0, 0]) / cs
    return ndi.map_coordinates(hh, [np.atleast_1d(ii), np.atleast_1d(jj)], order=1, mode='nearest')
inwin = lambda x, z: X[0, 0] + 50 < x < X[0, -1] - 50 and Z[0, 0] + 50 < z < Z[-1, 0] - 50
def dP_at(x, z): return min(float(box_sd(np.array(x), np.array(z), *p[:4])) for p in PIECES)
def Wm_at(x, z):
    a = math.atan2(z, x); w = 1000 + 200 * math.sin(2 * a + 0.7) + 110 * math.sin(5 * a + 2.1)
    s_ = float(sstep(np.array(z), 900, 1300)); return w * (1 - s_) + 950 * s_
in_palace = lambda x, z: any(x0 <= x <= x1 and z0 <= z <= z1 for x0, x1, z0, z1, _ in PIECES)
# --- bridges: from the palace ring of the same level to each satellite top
def mesa_edge_point(x, z, towards):
    tx, tz = towards
    for k in range(1, 4000):
        u = k / 4000; px, pz = x + (tx - x) * u, z + (tz - z) * u
        if min(box_sd(np.array(px), np.array(pz), *p[:4]) for p in PIECES[:2]) > 0: return px, pz
    return x, z
bridges = []
for m in MESAS:
    ax, az = mesa_edge_point(0.35 * m['x'], 0.35 * m['z'], (m['x'], m['z']))
    d = math.hypot(m['x'] - ax, m['z'] - az); ux, uz = (m['x'] - ax) / d, (m['z'] - az) / d
    # walk out from the lip until the ground is at the satellite's level
    t = 0.0
    while t < d and abs(H(h, ax + ux * t, az + uz * t)[0] - m['top']) > 1.0: t += 5
    if t >= d - m['rt'] * 0.6: continue                         # (merged into the palace's own ring: no bridge needed)
    a_ = (ax + ux * (t + 25), az + uz * (t + 25))
    t2 = t + 30
    while t2 < d and abs(H(h, ax + ux * t2, az + uz * t2)[0] - m['top']) < 1.0: t2 += 5   # across the ring
    while t2 < d and abs(H(h, ax + ux * t2, az + uz * t2)[0] - m['top']) > 1.0: t2 += 5   # to the satellite's top
    if t2 - t < 120: continue                                  # the ring runs straight onto the top: walk across
    b_ = (ax + ux * (t2 + 25), az + uz * (t2 + 25))
    bridges.append(dict(id=f'palace-{m["id"]}', a=[round(a_[0], 1), round(a_[1], 1)], b=[round(b_[0], 1), round(b_[1], 1)], deck=m['top'] + 0.5, width=14))
for b in bridges: b['length'] = round(math.hypot(b['b'][0] - b['a'][0], b['b'][1] - b['a'][1]), 1)
# --- roads: the massif is reached by the sky bridge and the viaducts; roads that climbed onto it end at its foot
P = json.load(open(f'{S}/fill/paths/paths.json'))
def dense(pts, step=8.0):
    xs, zs, src = [], [], []
    for t in range(len(pts) - 1):
        a_, b_ = pts[t], pts[t + 1]; Ls = math.hypot(b_[0] - a_[0], b_[2] - a_[2]); k = max(1, int(Ls / step))
        for u in range(k): xs.append(a_[0] + (b_[0] - a_[0]) * u / k); zs.append(a_[2] + (b_[2] - a_[2]) * u / k); src.append(t + u / k)
    xs.append(pts[-1][0]); zs.append(pts[-1][2]); src.append(len(pts) - 1)
    return np.array(xs), np.array(zs), np.array(src)
dropped, newpaths = [], []
for p in P['paths']:
    pts = p['points']
    if not any(inwin(q[0], q[2]) for q in pts): newpaths.append(p); continue
    hn = np.array([H(h, q[0], q[2])[0] if inwin(q[0], q[2]) else -999 for q in pts])
    hold = np.array([H(hw, q[0], q[2])[0] if inwin(q[0], q[2]) else -999 for q in pts])
    bad = (hn - hold > 45) | ((hn < 1) & (hold >= 1)) | np.array([in_palace(q[0], q[2]) for q in pts])
    if (hn - hold > 45).all() and np.ptp(hn) < 2: p = dict(p); p['_runs'] = []; newpaths.append(p); continue   # all on one raised top: lifted whole
    if not bad.any(): p = dict(p); p['_runs'] = []; newpaths.append(p); continue
    # keep the longest clean stretch at either end (a road that ran onto the massif now stops at its foot)
    k0 = 0
    while k0 < len(pts) and not bad[k0]: k0 += 1
    k1 = len(pts) - 1
    while k1 >= 0 and not bad[k1]: k1 -= 1
    keep_a, keep_b = pts[:k0], pts[k1 + 1:]
    seg = keep_a if len(keep_a) >= len(keep_b) else keep_b
    if len(seg) >= 3:
        q = dict(p); q['points'] = seg; q['_runs'] = []; q['note'] = (p.get('note', '') + ' (ends at the sky massif, Oct 17)').strip(); newpaths.append(q)
    else: dropped.append((p['kind'], p.get('from_'), p.get('to')))
# --- ramps: every other stretch of road on the steps is cut and filled to a slope of at most 28 %
G = 0.28; RAMP = np.zeros(X.shape)
nramps = 0
for p in newpaths:
    pts = p['points']
    if p['kind'] == 'royal' or not any(inwin(q[0], q[2]) for q in pts): continue
    xs, zs, src = dense(pts)
    ok = np.array([inwin(x, z) for x, z in zip(xs, zs)])
    if ok.sum() < 3: continue
    bridged = np.zeros(len(xs), bool)
    for a, b, _ in p.get('_runs', []): bridged |= (src >= a - 0.01) & (src <= b + 1.01)   # the viaduct spans (and their heads)
    y = np.where(ok, H(h, np.clip(xs, X[0, 0], X[0, -1]), np.clip(zs, Z[0, 0], Z[-1, 0])), 0)
    sd = np.concatenate([[0], np.cumsum(np.hypot(np.diff(xs), np.diff(zs)))])
    lo = y.copy(); hi = y.copy()
    for i in range(1, len(y)): lo[i] = min(lo[i], lo[i - 1] + G * (sd[i] - sd[i - 1])); hi[i] = max(hi[i], hi[i - 1] - G * (sd[i] - sd[i - 1]))
    for i in range(len(y) - 2, -1, -1): lo[i] = min(lo[i], lo[i + 1] + G * (sd[i + 1] - sd[i])); hi[i] = max(hi[i], hi[i + 1] - G * (sd[i + 1] - sd[i]))
    tgt = 0.5 * (lo + hi)
    nearz = np.array([o and dP_at(x, z) < Wm_at(x, z) + 900 for o, x, z in zip(ok, xs, zs)])
    act = nearz & ~bridged & (np.abs(tgt - y) > 1.0) & (y >= 1) & (tgt >= 1) & ~np.array([in_palace(x, z) for x, z in zip(xs, zs)])
    if not act.any(): continue
    # widen the active set a little so the ramp ends blend
    act = ndi.binary_dilation(act, iterations=3) & nearz & ~bridged & (y >= 1)
    Wmax = np.zeros(X.shape); T = np.zeros(X.shape); hwid = p['width'] / 2
    for i in np.nonzero(act)[0]:
        ci, cj = int((zs[i] - Z[0, 0]) / cs), int((xs[i] - X[0, 0]) / cs); rad = int((hwid + 28) / cs) + 2
        a0, a1_, b0, b1_ = max(ci - rad, 0), min(ci + rad + 1, X.shape[0]), max(cj - rad, 0), min(cj + rad + 1, X.shape[1])
        q = np.hypot(X[a0:a1_, b0:b1_] - xs[i], Z[a0:a1_, b0:b1_] - zs[i]); w = 1 - sstep(q, hwid + 6, hwid + 28)
        sel = w > Wmax[a0:a1_, b0:b1_]
        Wmax[a0:a1_, b0:b1_] = np.where(sel, w, Wmax[a0:a1_, b0:b1_]); T[a0:a1_, b0:b1_] = np.where(sel, tgt[i], T[a0:a1_, b0:b1_])
    h = np.where(Wmax > 0, h * (1 - Wmax) + T * Wmax, h); RAMP = np.maximum(RAMP, Wmax); nramps += 1
# keep the palace top and terraces exact (the game draws them)
h = np.where(dP <= 0, topP, h)
# --- rock walls: contour runs on each level with per-vertex foot; none on ramps or where there is no real drop
def resample_line(P_, step=9.0):
    P_ = np.asarray(P_, float); seg = np.hypot(*np.diff(P_, axis=0).T); s = np.concatenate([[0], np.cumsum(seg)])
    if s[-1] < step * 3: return None
    n = int(s[-1] / step) + 1; t = np.linspace(0, s[-1], n)
    return np.stack([np.interp(t, s, P_[:, 0]), np.interp(t, s, P_[:, 1])], 1)
def smooth_line(P_, closed, it=2):
    for _ in range(it):
        if closed: P_ = 0.25 * np.roll(P_, 1, 0) + 0.5 * P_ + 0.25 * np.roll(P_, -1, 0)
        else: P_[1:-1] = 0.25 * P_[:-2] + 0.5 * P_[1:-1] + 0.25 * P_[2:]
    return P_
def foot_at(px, pz, nx, nz):
    return np.median(np.stack([H(h, px + nx * d, pz + nz * d) for d in (10, 18, 26)]), axis=0)
def owner_of(x, z):
    best, bd = 'palace', dP_at(x, z) - 60
    for m in MESAS:
        d = math.hypot(x - m['x'], z - m['z']) - m['rt']
        if d < bd: best, bd = m['id'], d
    if best == 'palace' and dP_at(x, z) > Wm_at(x, z) - 40:
        a = math.degrees(math.atan2(z - 600, x)) % 360; best = f'shore{int(a // 45)}'
    return best
runs_out = []
def add_runs(pts, nrm, top, closed, push=20.0, lip=40.0):
    """split a resampled line into runs with a real drop, off the ramps; store (pts, nrm, top, foot)"""
    pts = pts + nrm * push                                     # the face stands clear of the terrain's step (its data is 20 m a cell)
    foot = foot_at(pts[:, 0], pts[:, 1], nrm[:, 0], nrm[:, 1])
    ramp = H(RAMP, pts[:, 0], pts[:, 1]) > 0.25
    good = ndi.binary_closing((top - foot >= 6) & ~ramp, np.ones(7, bool)) & ~ramp
    good[:3] |= (top - foot[:3] >= 6) & ~ramp[:3]; good[-3:] |= (top - foot[-3:] >= 6) & ~ramp[-3:]
    if closed and good.all():
        runs_out.append(dict(pts=pts, nrm=nrm, top=top, foot=foot, closed=True, lip=lip)); return
    idx = np.nonzero(good)[0]
    if not len(idx): return
    if closed and good[0] and good[-1]:                        # rotate so a run does not wrap the seam
        first_bad = np.nonzero(~good)[0][0]; order = np.roll(np.arange(len(pts)), -first_bad)
        pts, nrm, foot, good = pts[order], nrm[order], foot[order], good[order]
    k = 0
    while k < len(pts):
        if good[k]:
            s0 = k
            while k < len(pts) and good[k]: k += 1
            if k - s0 >= 3: runs_out.append(dict(pts=pts[s0:k], nrm=nrm[s0:k], top=top, foot=foot[s0:k], closed=False, lip=lip))
        else: k += 1
# palace mesa: the exact box outlines of the plateau and the terraces (the game's own edges)
def box_runs():
    def inside(q): return any(x0 - 0.5 <= q[0] <= x1 + 0.5 and z0 - 0.5 <= q[1] <= z1 + 0.5 for x0, x1, z0, z1, _ in PIECES)
    out = []
    for poly, top in (([(-1292, 1546), (-1292, 935), (-1169, 935), (-1169, -1155), (1292, -1155), (1292, 1546)], TOP),
                      ([(1286, 1540), (1430, 1540), (1430, 1986)], MID), ([(1424, 1980), (1540, 1980), (1540, 2420), (-1540, 2420), (-1540, 1980), (-1424, 1980)], LOW),
                      ([(-1286, 1540), (-1430, 1540), (-1430, 1986)], MID)):
        pts = resample_line(np.array(poly, float), 8.0); n = len(pts); nrm = np.zeros((n, 2))
        for i in range(n):
            a_, b_ = pts[max(i - 1, 0)], pts[min(i + 1, n - 1)]; d = b_ - a_; d /= np.hypot(*d) + 1e-9; nn = np.array([d[1], -d[0]])
            if inside(pts[i] + nn * 4): nn = -nn
            nrm[i] = nn
        for _ in range(3):
            nrm = np.vstack([nrm[:1], nrm[:-2] + 2 * nrm[1:-1] + nrm[2:], nrm[-1:]]); nrm /= np.linalg.norm(nrm, axis=1, keepdims=True)
        out.append((pts, nrm, top))
    return out
for pts, nrm, top in box_runs(): add_runs(pts, nrm, top, False, push=18.0, lip=26.0)   # the game blends its plateau 16 m past the box
# the steps and satellite tops: contours of each level, kept only where the ground just inside is flat at that level
gx, gz = X[0, :], Z[:, 0]
for lvl, thr in [(v, v - 0.25) for v in sorted(set(RINGS + SHORE + [m['top'] for m in MESAS]), reverse=True)]:
    F = ndi.gaussian_filter((h >= thr).astype(float), 1.0)
    gzF, gxF = np.gradient(F, cs)
    for ln in contourpy.contour_generator(gx, gz, F).lines(0.5):
        closed = len(ln) > 3 and np.hypot(*(ln[0] - ln[-1])) < 1e-6
        P_ = resample_line(ln, 9.0)
        if P_ is None: continue
        P_ = smooth_line(P_, closed)
        ii = (P_[:, 1] - gz[0]) / cs; jj = (P_[:, 0] - gx[0]) / cs
        nx_ = -ndi.map_coordinates(gxF, [ii, jj], order=1); nz_ = -ndi.map_coordinates(gzF, [ii, jj], order=1)
        nn = np.hypot(nx_, nz_) + 1e-9; nrm = np.stack([nx_ / nn, nz_ / nn], 1)
        for _ in range(2): nrm = 0.25 * np.roll(nrm, 1, 0) + 0.5 * nrm + 0.25 * np.roll(nrm, -1, 0) if closed else nrm; nrm /= np.linalg.norm(nrm, axis=1, keepdims=True)
        flat = (np.abs(H(h, P_[:, 0] - nrm[:, 0] * 10, P_[:, 1] - nrm[:, 1] * 10) - lvl) < 1.2) | (np.abs(H(h, P_[:, 0] - nrm[:, 0] * 22, P_[:, 1] - nrm[:, 1] * 22) - lvl) < 1.2)
        nopal = ~np.array([dP_at(x, z) < 40 for x, z in P_])     # the palace's own edges come from the boxes
        keep = ndi.binary_closing(flat, np.ones(9, bool)) & nopal   # bridge short breaks (narrow ledges, spurs)
        keep[:4] |= flat[:4] & nopal[:4]; keep[-4:] |= flat[-4:] & nopal[-4:]
        if keep.sum() < 3: continue
        # cut at the unkept vertices
        k = 0
        if closed and keep.all(): add_runs(P_, nrm, lvl, True); continue
        while k < len(P_):
            if keep[k]:
                s0 = k
                while k < len(P_) and keep[k]: k += 1
                if k - s0 >= 3: add_runs(P_[s0:k], nrm[s0:k], lvl, False)
            else: k += 1
groups = {}
for r in runs_out:
    m = r['pts'][len(r['pts']) // 2]; groups.setdefault(owner_of(m[0], m[1]), []).append(r)
walls = [dict(id=g, runs=[dict(top=r['top'], closed=r['closed'], lip=r['lip'], pts=np.round(r['pts'], 1).tolist(), nrm=np.round(r['nrm'], 3).tolist(), foot=np.round(r['foot'], 1).tolist()) for r in rs]) for g, rs in groups.items()]
# --- write the terrain back
hi = h0.copy(); hi[i0:i1, j0:j1] = h
# --- the gate massif: fills the old waterfall gap in the south wall. A slot at the sky deck runs through it (the game roofs
# it with the marble tunnel); the south portal opens onto a round cloud platform over the outer sea.
GX = -710.0; NPZ, SPZ = 10420.0, 11880.0; PLAT = dict(x=GX, z=12020.0, r=140.0, y=SKY)
mi0, mi1 = np.searchsorted(r_, 9700), np.searchsorted(r_, 12500); mj0, mj1 = np.searchsorted(c, -1800), np.searchsorted(c, 400)
MX, MZ = np.meshgrid(c[mj0:mj1], r_[mi0:mi1]); hm = hi[mi0:mi1, mj0:mj1].copy(); hm_old = hm.copy()
ga = np.arctan2(MZ - 11150, MX - GX)
grr = np.hypot((MX - GX) / 640, (MZ - 11150) / 730) / (1 + 0.05 * np.sin(5 * ga + 1.1) + 0.04 * np.sin(9 * ga) + 0.03 * vn(MX, MZ, 0.01, 71))
crest = 1090 + 45 * vn(MX, MZ, 0.004, 72) + 70 * np.maximum(vn(MX, MZ, 0.012, 73), 0) ** 3 - 160 * sstep(grr, 0.55, 1.0) ** 2
fall = np.clip((grr - 1) * 730 / 60, 0, 1)                    # sheer: 60 m from the lip to the foot
mass = np.where(grr <= 1, crest, crest * (1 - fall ** 0.6) + hm_old * fall ** 0.6)
hm = np.where(grr < 1.0 + 60 / 730, np.maximum(hm, mass), hm)
slot = (np.abs(MX - GX) < 50) & (MZ > NPZ - 30) & (MZ < SPZ + 30)
hm = np.where(slot, SKY, hm)
q = np.hypot(MX - PLAT['x'], MZ - PLAT['z'])
hm = np.where(q <= PLAT['r'], SKY, np.where(q < PLAT['r'] + 40, np.maximum(hm, cliff(q - PLAT['r'], SKY, hm_old, 40)), hm))
hi[mi0:mi1, mj0:mj1] = hm
# rim walls round the massif (owner 19:29: "use the cliffs to also attach to mountains"): per-vertex top = the crest just inside
gzm, gxm = MZ[:, 0], MX[0, :]
def Hm(px, pz): return ndi.map_coordinates(hm, [(np.asarray(pz) - gzm[0]) / cs, (np.asarray(px) - gxm[0]) / cs], order=1, mode='nearest')
Fm = ndi.gaussian_filter((grr <= 1.0).astype(float), 1.0); gzF, gxF = np.gradient(Fm, cs); gate_runs = []
for ln in contourpy.contour_generator(gxm, gzm, Fm).lines(0.5):
    P_ = resample_line(ln, 9.0)
    if P_ is None or len(P_) < 20: continue
    ii = (P_[:, 1] - gzm[0]) / cs; jj = (P_[:, 0] - gxm[0]) / cs
    nx_ = -ndi.map_coordinates(gxF, [ii, jj], order=1); nz_ = -ndi.map_coordinates(gzF, [ii, jj], order=1)
    nn = np.hypot(nx_, nz_) + 1e-9; nrm = np.stack([nx_ / nn, nz_ / nn], 1)
    pts = P_ + nrm * 14
    tops = Hm(P_[:, 0] - nrm[:, 0] * 18, P_[:, 1] - nrm[:, 1] * 18) - 2
    foot = np.median(np.stack([Hm(pts[:, 0] + nrm[:, 0] * d, pts[:, 1] + nrm[:, 1] * d) for d in (20, 40, 60)]), axis=0)
    good = (tops - foot > 25) & ~((np.abs(pts[:, 0] - GX) < 80) & ((np.abs(pts[:, 1] - NPZ) < 80) | (np.abs(pts[:, 1] - SPZ) < 80)))
    good = ndi.binary_opening(good, np.ones(3, bool))
    k = 0
    while k < len(pts):
        if good[k]:
            s0 = k
            while k < len(pts) and good[k]: k += 1
            if k - s0 >= 4: gate_runs.append(dict(top=float(tops[s0:k].max()), tops=np.round(tops[s0:k], 1).tolist(), closed=False, lip=12.0,
                                                  pts=np.round(pts[s0:k], 1).tolist(), nrm=np.round(nrm[s0:k], 3).tolist(), foot=np.round(foot[s0:k], 1).tolist()))
        else: k += 1
if gate_runs: walls.append(dict(id='gate', runs=gate_runs))
print('gate rim runs', len(gate_runs), sum(len(r['pts']) for r in gate_runs))
np.savez_compressed(f'{OUT}/inner.npz', h=hi.astype(np.float32))
ho = np.load(f'{OUT}/outer-pre-cliffs.npz')['h'].astype(np.float64); Gn = ho.shape[0]
co = CX - L / 2 + (np.arange(Gn) + 0.5) * L / Gn; ro = CZ - L / 2 + (np.arange(Gn) + 0.5) * L / Gn
for (xa, xb, za, zb) in ((-4300, 4300, -4300, 4700), (-1800, 400, 9700, 12500)):
    oj0, oj1 = np.searchsorted(co, xa), np.searchsorted(co, xb); oi0, oi1 = np.searchsorted(ro, za), np.searchsorted(ro, zb)
    OX, OZ = np.meshgrid(co[oj0:oj1], ro[oi0:oi1])
    ii = (OZ - CZ + MAPW / 2) / cs - 0.5; jj = (OX - CX + MAPW / 2) / cs - 0.5
    ho[oi0:oi1, oj0:oj1] = ndi.map_coordinates(hi, [ii, jj], order=1)
np.savez_compressed(f'{OUT}/outer.npz', h=ho.astype(np.float32))
enc = lambda a: np.clip(np.rint((a + 500) * 7), 0, 65535).astype('<u2')
enc(hi.reshape(N // 2, 2, N // 2, 2).mean((1, 3))).tofile(f'{GAME}/crescent-h.bin')
enc(ho.reshape(Gn // 2, 2, Gn // 2, 2).mean((1, 3))).tofile(f'{GAME}/outer-h.bin')
# --- paths: new y; roads that climbed onto the gate massif end at its foot; promenades over the viaducts; the sky way
dH = hi - h0
def dh_at(x, z):
    i = (z - CZ + MAPW / 2) / cs - 0.5; j = (x - CX + MAPW / 2) / cs - 0.5
    return float(ndi.map_coordinates(dH, [[i], [j]], order=1)[0]) if 0 <= i < N and 0 <= j < N else 0.0
in_mass = lambda x, z: -1800 < x < 400 and 9700 < z < 12500
out_paths = []
for p in newpaths:
    p.pop('_runs', None)
    pts = [[q[0], round(q[1] + dh_at(q[0], q[2]), 1), q[2]] for q in p['points']]
    bad = [in_mass(q[0], q[2]) and dh_at(q[0], q[2]) > 45 for q in p['points']]
    if any(bad):
        k0 = bad.index(True); k1 = len(bad) - 1 - bad[::-1].index(True)
        seg = pts[:k0] if k0 >= len(pts) - 1 - k1 else pts[k1 + 1:]
        if len(seg) < 3: dropped.append((p['kind'], p.get('from_'), p.get('to'))); continue
        pts = seg; p = dict(p); p['note'] = (p.get('note', '') + ' (ends at the gate massif, Oct 17)').strip()
    p['points'] = pts; out_paths.append(p)
newpaths = out_paths
def line(a, b, y, step=20.0):
    n = max(2, int(math.hypot(b[0] - a[0], b[1] - a[1]) // step))
    return [[round(a[0] + (b[0] - a[0]) * k / n, 1), y, round(a[1] + (b[1] - a[1]) * k / n, 1)] for k in range(n + 1)]
for b in bridges:
    newpaths.append(dict(kind='road', width=8, from_='B01', to=b['id'][7:], length_m=b['length'], points=line(b['a'], b['b'], b['deck']),
                         note='promenade over an arched viaduct (sky palace, Oct 17)'))
SKYA, SKYB = (0.0, 2420.0), (GX, NPZ)
sky_len = round(math.hypot(SKYB[0] - SKYA[0], SKYB[1] - SKYA[1]), 1)
newpaths.append(dict(kind='royal', width=20, from_='B01', to='GATE', length_m=sky_len, points=line(SKYA, SKYB, SKY, 40.0),
                     note='the sky bridge: a level deck at 688 m from the lower terrace to the gate massif (Oct 17)'))
newpaths.append(dict(kind='royal', width=20, from_='GATE', to='CLOUD', length_m=SPZ - NPZ + PLAT['r'], points=line((GX, NPZ), (GX, PLAT['z']), SKY, 20.0),
                     note='through the marble tunnel to the cloud platform (Oct 17)'))
P2 = dict(P); P2['paths'] = newpaths
old_b = [b for b in P['bridges'] if not ((inwin(b['start'][0], b['start'][2]) and H(h, b['start'][0], b['start'][2])[0] < 1 and H(hw, b['start'][0], b['start'][2])[0] > 1)
                                         or in_palace(b['start'][0], b['start'][2]) or (in_mass(b['start'][0], b['start'][2]) and dh_at(b['start'][0], b['start'][2]) > 45))]
P2['bridges'] = old_b + [dict(on=b['id'], kind='viaduct', start=[b['a'][0], b['deck'], b['a'][1]], end=[b['b'][0], b['deck'], b['b'][1]], width=b['width']) for b in bridges] \
    + [dict(on='sky', kind='sky', start=[SKYA[0], SKY, SKYA[1]], end=[SKYB[0], SKY, SKYB[1]], width=24)]
P2['frame'] = P['frame'] + '; Oct 17 sky palace: bridges of kind viaduct / sky are level decks at their start y on arched piers (cliffs.json)'
json.dump(P2, open(f'{OUT}/paths.json', 'w'))
wp = json.load(open(f'{OUT}/world-placements-pre-cliffs.json'))
keep, drowned, buried = [], 0, []
for it in wp['items']:
    x, z = it['x'], it['z']
    if inwin(x, z) and it['place'] not in ('sky', 'sea', 'B30', 'ARRIVAL') and not it['place'].startswith('B01'):
        hn = H(h, x, z)[0]; ho_ = H(hw, x, z)[0]
        if hn < 1.0 and ho_ >= 1.0: drowned += 1; continue
        it = dict(it); it['y'] = round(it['y'] + (hn - ho_), 2)
    elif in_mass(x, z) and it['place'] != 'sky':
        d_ = dh_at(x, z)
        if it['m'] == 'Subject_A_commemorat':                    # the old arrival arch becomes the great gate: set into the south face at the deck
            it = dict(it); it['x'], it['y'], it['z'] = GX, SKY, SPZ; it['note'] = 'south portal of the gate massif (Oct 17)'; keep.append(it); continue
        if d_ > 30: buried.append((it['place'], it['m'])); continue
        it = dict(it); it['y'] = round(it['y'] + d_, 2)
    keep.append(it)
wp['items'] = keep; wp['cliffs'] = 'Oct 17 19:29: re-seated on the sky palace massif (ridge/cliffs3.py)'
json.dump(wp, open(f'{OUT}/world-placements.json', 'w'))
sky = dict(deck=SKY, bridge=dict(a=list(SKYA), b=list(SKYB), length=sky_len, width=24, pier_every=240, note='level deck; piers rise from the valley floor'),
           massif=dict(x=GX, z=11150.0, rx=640, rz=730, crest=1090, note='fills the old waterfall gap; north face at z 10420, south face at z 11880'),
           north_portal=dict(x=GX, y=SKY, z=NPZ, faces='north', width=40, height=56),
           tunnel=dict(x=GX, z0=NPZ, z1=SPZ, y=SKY, width=40, height=56, slot_width=100, floor='white marble', light='white, brighter toward the middle',
                       note='the terrain is cut to a 100 m slot at the deck; the tunnel model roofs it and rock fills up to the crest'),
           south_portal=dict(x=GX, y=SKY, z=SPZ, faces='south', width=40, height=56, note='the great gate that opens'),
           platform=dict(PLAT, note='round marble platform ringed in clouds; spawn here'),
           waterfall=dict(x=GX, z=NPZ - 40, top=1040.0, bottom=0.0, width=70, note='gushes hard from a notch above the north portal, in front of the bridge'),
           buried=buried)
json.dump(dict(frame='three.js metres, origin palace, x east, z south, y up', water_y=0, levels=dict(top=TOP, mid=MID, low=LOW, rings=RINGS, shore=SHORE),
               palace_mesa=dict(pieces=[dict(x0=a, x1=b, z0=c_, z1=d, top=t) for a, b, c_, d, t in PIECES], note='sky palace: top 797.5, terraces 742.5 / 687.5, rings 640 / 500 / 340 / 170 to the moat'),
               mesas=MESAS, stacks=STACKS, bridges=bridges, dropped_paths=dropped, walls=walls, sky=sky),
          open(f'{OUT}/cliffs.json', 'w'))
print('bridges', len(bridges), [(b['id'], b['length'], b['deck']) for b in bridges])
print('dropped paths', dropped, 'ramped paths', nramps); print('drowned items', drowned, 'kept', len(keep), 'buried', buried)
print('wall groups', {w['id']: (len(w['runs']), sum(len(r['pts']) for r in w['runs'])) for w in walls})
