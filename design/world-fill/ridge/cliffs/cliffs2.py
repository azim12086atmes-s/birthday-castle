"""Stepped palace cliffs (owner, Oct 17 16:27: "when anything is on the cliffs, the cliffs do not become steps, it just
gives elevation"). Replaces the single-drop mesa of cliffs.py with broad rock terraces on shared levels:
  palace plateau 109.6 (set by the game) -> terrace ring at 70 -> terrace ring at 32 -> the moat;
  satellite plateaus (B25, B32 and six more) the same: a 110 top, a 70 ring, a 32 ring, then water;
  the outer shore north of the lake climbs back out of the moat by the same steps (32, 70) and then rises gently.
Where neighbouring rings meet they merge, so the plateaus join on their lower steps and the tops are joined by viaducts.
Roads that climb between steps get ramps cut and filled at <= 28 %; walls are not built across them.
Rock walls are extracted here as contour runs (per-vertex top and foot) and built by cliffwall2.py.
Writes: out/inner.npz, out/outer.npz, game/*.bin, out/cliffs.json (+ walls), out/paths.json, out/world-placements.json."""
import numpy as np, json, math, os
from scipy import ndimage as ndi
import contourpy
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
R = f'{S}/ridge'; OUT = f'{R}/out'; GAME = f'{OUT}/game'
MAPW, CX, CZ, L = 20691.0, -709.5, 2260.5, 40960.0
h0 = np.load(f'{OUT}/inner-pre-cliffs.npz')['h'].astype(np.float64); N = h0.shape[0]; cs = MAPW / N
DECK = 110.5; TOP = 109.6; SAT = DECK - 0.5; LV1, LV2 = 70.0, 32.0; NEG = -1e3
c = CX - MAPW / 2 + (np.arange(N) + 0.5) * cs; r_ = CZ - MAPW / 2 + (np.arange(N) + 0.5) * cs
j0, j1 = np.searchsorted(c, -4300), np.searchsorted(c, 4300); i0, i1 = np.searchsorted(r_, -4300), np.searchsorted(r_, 4700)
X, Z = np.meshgrid(c[j0:j1], r_[i0:i1]); hw = h0[i0:i1, j0:j1].copy()
def vn(x, z, f, seed):
    g = np.random.default_rng(seed).uniform(-1, 1, (64, 64)); return ndi.map_coordinates(g, [(z * f) % 63, (x * f) % 63], order=3, mode='wrap')
def sstep(x, a, b): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)
def box_sd(x, z, x0, x1, z0, z1):
    dx = np.maximum(x0 - x, x - x1); dz = np.maximum(z0 - z, z - z1)
    return np.hypot(np.maximum(dx, 0), np.maximum(dz, 0)) + np.minimum(np.maximum(dx, dz), 0)
# --- palace mesa (plateau box + upper terrace at 109.6, middle terrace 66, lower terrace 22: exactly the game's)
PIECES = [(-1169, 1292, -1155, 935, TOP), (-1292, 1292, 935, 1540, TOP), (-1430, 1430, 1540, 1980, 66.0), (-1540, 1540, 1980, 2420, 22.0)]
dP = np.full(X.shape, 1e9); topP = np.zeros(X.shape)
for x0, x1, z0, z1, t in PIECES:
    d = box_sd(X, Z, x0, x1, z0, z1); topP = np.where(d < dP, t, topP); dP = np.minimum(dP, d)
d110 = np.minimum(box_sd(X, Z, *PIECES[0][:4]), box_sd(X, Z, *PIECES[1][:4])); d66 = box_sd(X, Z, *PIECES[2][:4])
w1 = 92 + 18 * vn(X, Z, 0.008, 31); w2 = w1 + 86 + 16 * vn(X, Z, 0.008, 32)
Hp = np.full(X.shape, NEG)
north_of = Z < 1540                                            # rings beside the plateau and the upper terrace
Hp = np.where(north_of & (d110 < w2), LV2, Hp); Hp = np.where(north_of & (d110 < w1), LV1, Hp)
Hp = np.where((Z >= 1540) & (Z < 1980) & (d66 < 68 + 14 * vn(X, Z, 0.01, 33)), np.maximum(Hp, LV2), Hp)
Hp = np.where(dP <= 0, topP, Hp)
# --- satellite plateaus: same centres as before (B25 and B32 carry places, so they keep their full tops)
MESAS = [dict(id='B25', x=-1155, z=-1485, r=250), dict(id='B32', x=-1826, z=608, r=360),
         dict(id='north', x=60, z=-1700, r=250), dict(id='northeast', x=1680, z=-1470, r=210),
         dict(id='east', x=1840, z=160, r=290), dict(id='west-n', x=-1880, z=-520, r=210),
         dict(id='southeast', x=2180, z=1560, r=230), dict(id='southwest', x=-2140, z=1700, r=230)]
for m in MESAS: m['rt'] = m['r'] if m['id'] in ('B25', 'B32') else round(0.85 * m['r'])
Hs = np.full(X.shape, NEG); dM = np.full(X.shape, 1e9)
def mesa_rr(m, a): return m['rt'] * (1 + 0.10 * np.sin(3 * a + m['x'] * 0.01) + 0.06 * np.sin(7 * a + m['z'] * 0.02))
for k, m in enumerate(MESAS):
    a = np.arctan2(Z - m['z'], X - m['x']); q = np.hypot(X - m['x'], Z - m['z']); d = q - mesa_rr(m, a)
    a1 = 66 + 12 * vn(X, Z, 0.01, 40 + k); a2 = a1 + 66 + 12 * vn(X, Z, 0.01, 50 + k)
    Hs = np.maximum(Hs, np.where(d <= 0, SAT, np.where(d < a1, LV1, np.where(d < a2, LV2, NEG)))); dM = np.minimum(dM, d)
STACKS = [dict(x=-700, z=-1750, r=110, h=235), dict(x=1250, z=-1700, r=95, h=200), dict(x=2500, z=-700, r=120, h=260),
          dict(x=-1750, z=-1250, r=85, h=180), dict(x=2550, z=900, r=100, h=215), dict(x=-2550, z=300, r=95, h=190),
          dict(x=-1250, z=2850, r=90, h=170), dict(x=1250, z=3000, r=100, h=205), dict(x=-2700, z=2400, r=110, h=150),
          dict(x=200, z=-2350, r=95, h=245), dict(x=-2350, z=-1500, r=90, h=170), dict(x=2300, z=-1900, r=85, h=230), dict(x=-2400, z=1100, r=80, h=160), dict(x=2450, z=-200, r=75, h=150)]
# --- the moat and the outer shore
ang = np.arctan2(Z, X)
Wm = 900 + 200 * np.sin(2 * ang + 0.7) + 110 * np.sin(5 * ang + 2.1) + 80 * vn(X, Z, 0.004, 3)
south = sstep(Z, 700, 1100); Wm = Wm * (1 - south) + 900 * south
base = -16 - 12 * sstep(dP, 300, 480) * sstep(-(dP - Wm), 80, 260) + 4 * vn(X, Z, 0.01, 4)
def cliff(t, top, bot, lc):
    u = np.clip(t / lc, 0, 1); f = 1 - u ** 0.55; steps = np.round(f * 6) / 6; f = 0.65 * f + 0.35 * steps
    return bot + (top - bot) * f
t_out = dP - Wm
h = np.where(t_out < 0, base, hw)
# north and side shores: stepped back up out of the water (32, 70), then a gentle rise to the hills
b1 = 92 + 16 * vn(X, Z, 0.006, 61); b2 = b1 + 92 + 18 * vn(X, Z, 0.006, 62)
rise = np.maximum(np.minimum(hw, LV1 + 0.22 * np.maximum(t_out - b2 - 60, 0) + 10 * vn(X, Z, 0.006, 9)), LV1 * (1 - sstep(t_out, b2, b2 + 380)))
stepped_out = np.where(t_out < b1, LV2, np.where(t_out < b2, LV1, rise))
# beside the lake (south) the old shore: land held under the deck, dropping sheer into the water
cap = DECK - 8 + 0.22 * np.maximum(t_out - 250, 0) + 18 * vn(X, Z, 0.006, 9)
lco = 45 + 20 * (vn(X, Z, 0.02, 6) + 1)
old_out = np.where(t_out < lco, np.minimum(hw, cliff(lco - t_out, np.clip(hw, 30, DECK - 8), base, lco)), np.minimum(hw, cap))
h = np.where(t_out >= 0, np.where(south < 0.5, stepped_out, old_out), h)
h = np.maximum(h, Hp); h = np.maximum(h, Hs); h = np.where(dP <= 0, topP, h)
for s in STACKS:
    q = np.hypot(X - s['x'], Z - s['z']); a = np.arctan2(Z - s['z'], X - s['x'])
    rr = s['r'] * (1 + 0.12 * np.sin(4 * a + s['x']) + 0.07 * np.sin(9 * a + s['z']))
    top = s['h'] + 6 * vn(X, Z, 0.03, 8)
    h = np.where(q <= rr, top, np.where(q < rr + 30, np.maximum(h, cliff(q - rr, top, base, 30)), h))
h_step = h.copy()
# --- sampling helpers
def H(hh, x, z):
    jj = (np.asarray(x, float) - X[0, 0]) / cs; ii = (np.asarray(z, float) - Z[0, 0]) / cs
    return ndi.map_coordinates(hh, [np.atleast_1d(ii), np.atleast_1d(jj)], order=1, mode='nearest')
inwin = lambda x, z: X[0, 0] + 50 < x < X[0, -1] - 50 and Z[0, 0] + 50 < z < Z[-1, 0] - 50
def dP_at(x, z): return min(float(box_sd(np.array(x), np.array(z), *p[:4])) for p in PIECES)
def Wm_at(x, z):
    a = math.atan2(z, x); w = 900 + 200 * math.sin(2 * a + 0.7) + 110 * math.sin(5 * a + 2.1)
    s_ = float(sstep(np.array(z), 700, 1100)); return w * (1 - s_) + 900 * s_
in_palace = lambda x, z: any(x0 <= x <= x1 and z0 <= z <= z1 for x0, x1, z0, z1, _ in PIECES)
# --- bridges: palace top to the satellite tops (over the steps and the channel)
def mesa_edge_point(x, z, towards):
    tx, tz = towards
    for k in range(1, 4000):
        u = k / 4000; px, pz = x + (tx - x) * u, z + (tz - z) * u
        if min(box_sd(np.array(px), np.array(pz), *p[:4]) for p in PIECES[:2]) > 0: return px, pz
    return x, z
bridges = []
for m in MESAS:
    if m['id'] in ('southeast', 'southwest'): continue
    ax, az = mesa_edge_point(0.35 * m['x'], 0.35 * m['z'], (m['x'], m['z']))
    d = math.hypot(m['x'] - ax, m['z'] - az); ux, uz = (m['x'] - ax) / d, (m['z'] - az) / d
    bx, bz = m['x'] - ux * m['rt'] * 0.82, m['z'] - uz * m['rt'] * 0.82
    bridges.append(dict(id=f'palace-{m["id"]}', a=[round(ax - ux * 30, 1), round(az - uz * 30, 1)], b=[round(bx + ux * 30, 1), round(bz + uz * 30, 1)], deck=DECK, width=12))
# --- roads: spans that the steps dropped below the deck become viaducts (both ends must be high ground)
P = json.load(open(f'{S}/fill/paths/paths.json'))
def dense(pts, step=8.0):
    xs, zs, src = [], [], []
    for t in range(len(pts) - 1):
        a_, b_ = pts[t], pts[t + 1]; Ls = math.hypot(b_[0] - a_[0], b_[2] - a_[2]); k = max(1, int(Ls / step))
        for u in range(k): xs.append(a_[0] + (b_[0] - a_[0]) * u / k); zs.append(a_[2] + (b_[2] - a_[2]) * u / k); src.append(t + u / k)
    xs.append(pts[-1][0]); zs.append(pts[-1][2]); src.append(len(pts) - 1)
    return np.array(xs), np.array(zs), np.array(src)
dropped, road_bridges, newpaths = [], [], []
for p in P['paths']:
    pts = p['points']
    if not any(inwin(q[0], q[2]) for q in pts) or p['kind'] == 'royal': newpaths.append(p); continue
    near = [inwin(q[0], q[2]) and dP_at(q[0], q[2]) < Wm_at(q[0], q[2]) + 300 for q in pts]
    hn = np.array([H(h, q[0], q[2])[0] if inwin(q[0], q[2]) else 999 for q in pts])
    hold = np.array([H(hw, q[0], q[2])[0] if inwin(q[0], q[2]) else 999 for q in pts])
    wet = np.array(near) & (hn < 1) & (hold >= 1)
    runs, k = [], 0
    while k < len(pts):
        if wet[k]:
            s0 = k
            while k < len(pts) and wet[k]: k += 1
            runs.append((s0, k - 1))
        else: k += 1
    keep_runs, bad = [], False
    for a, b in runs:
        got = None
        for deck in (DECK, LV1 + 0.5, LV2 + 0.5):                # a level deck from step to step: the highest that fits
            a2, b2 = a, b
            while a2 - 1 >= 0 and hn[a2 - 1] < deck - 6: a2 -= 1
            while b2 + 1 < len(pts) and hn[b2 + 1] < deck - 6: b2 += 1
            if a2 == 0 or b2 == len(pts) - 1: continue
            Ls = sum(math.hypot(pts[t + 1][0] - pts[t][0], pts[t + 1][2] - pts[t][2]) for t in range(a2 - 1, b2 + 1))
            if Ls <= 1200: got = (a2, b2, deck); break
        if got is None: bad = True
        elif got not in keep_runs: keep_runs.append(got)
    if bad: dropped.append((p['kind'], p.get('from_'), p.get('to'))); continue
    p = dict(p); p['_runs'] = keep_runs; newpaths.append(p)
    for a, b, deck in keep_runs:
        ia, ib = a - 1, b + 1
        road_bridges.append(dict(path=p, a=(pts[ia][0], pts[ia][2]), b=(pts[ib][0], pts[ib][2]), ia=ia, ib=ib, deck=deck))
for rb in road_bridges:
    p = rb['path']; pts = p['points']
    for end, step in ((rb['ia'], -1), (rb['ib'], 1)):          # notch the land ends down to the deck at 12 %
        acc, k = 0.0, end
        while 0 <= k < len(pts):
            x, _, z = pts[k]
            if k != end: acc += math.hypot(pts[k][0] - pts[k - step][0], pts[k][2] - pts[k - step][2])
            target = rb['deck'] + 0.12 * acc
            if H(h, x, z)[0] <= target + 0.5 and k != end: break
            q = np.hypot(X - x, Z - z); w = 1 - sstep(q, p['width'] / 2 + 10, p['width'] / 2 + 38)
            h = np.where(w > 0, np.minimum(h, h * (1 - w) + target * w), h)
            k += step
    bridges.append(dict(id=f'{p["kind"]}:{p.get("from_")}-{p.get("to")}', a=[round(rb['a'][0], 1), round(rb['a'][1], 1)], b=[round(rb['b'][0], 1), round(rb['b'][1], 1)], deck=rb['deck'], width=max(8, p['width'] + 4)))
def ends_on(b, m): return any(math.hypot(q[0] - m['x'], q[1] - m['z']) < m['rt'] + 150 for q in (b['a'], b['b']))
roadb = [b for b in bridges if not b['id'].startswith('palace-')]
bridges = [b for b in bridges if not (b['id'].startswith('palace-') and any(ends_on(r, m) and ends_on(b, m) and min(math.hypot(r['a'][0], r['a'][1]), math.hypot(r['b'][0], r['b'][1])) < 1800 for r in roadb for m in MESAS if b['id'][7:] == m['id']))]
def nearp(p, q, r): return math.hypot(p[0] - q[0], p[1] - q[1]) < r
uniq = []
for b in bridges:
    if any(nearp(b['a'], u['a'], 120) and nearp(b['b'], u['b'], 120) or nearp(b['a'], u['b'], 120) and nearp(b['b'], u['a'], 120) for u in uniq): continue
    uniq.append(b)
bridges = uniq
for b in bridges: b['length'] = round(math.hypot(b['b'][0] - b['a'][0], b['b'][1] - b['a'][1]), 1)
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
    good = (top - foot >= 6) & ~ramp
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
                      ([(1286, 1540), (1430, 1540), (1430, 1986)], 66.0), ([(1424, 1980), (1540, 1980), (1540, 2412)], 22.0),
                      ([(-1286, 1540), (-1430, 1540), (-1430, 1986)], 66.0), ([(-1424, 1980), (-1540, 1980), (-1540, 2412)], 22.0)):
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
for lvl, thr in ((SAT, SAT - 0.2), (LV1, LV1 - 0.25), (LV2, LV2 - 0.25)):
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
        flat = (np.abs(H(h, P_[:, 0] - nrm[:, 0] * 10, P_[:, 1] - nrm[:, 1] * 10) - lvl) < 1.2) & (np.abs(H(h, P_[:, 0] - nrm[:, 0] * 22, P_[:, 1] - nrm[:, 1] * 22) - lvl) < 1.2)
        nopal = ~np.array([dP_at(x, z) < 40 for x, z in P_])     # the palace's own edges come from the boxes
        keep = flat & nopal
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
np.savez_compressed(f'{OUT}/inner.npz', h=hi.astype(np.float32))
ho = np.load(f'{OUT}/outer-pre-cliffs.npz')['h'].astype(np.float64); Gn = ho.shape[0]
co = CX - L / 2 + (np.arange(Gn) + 0.5) * L / Gn; ro = CZ - L / 2 + (np.arange(Gn) + 0.5) * L / Gn
oj0, oj1 = np.searchsorted(co, -4300), np.searchsorted(co, 4300); oi0, oi1 = np.searchsorted(ro, -4300), np.searchsorted(ro, 4700)
OX, OZ = np.meshgrid(co[oj0:oj1], ro[oi0:oi1])
ii = (OZ - CZ + MAPW / 2) / cs - 0.5; jj = (OX - CX + MAPW / 2) / cs - 0.5
ho[oi0:oi1, oj0:oj1] = ndi.map_coordinates(hi, [ii, jj], order=1)
np.savez_compressed(f'{OUT}/outer.npz', h=ho.astype(np.float32))
enc = lambda a: np.clip(np.rint((a + 500) * 7), 0, 65535).astype('<u2')
enc(hi.reshape(N // 2, 2, N // 2, 2).mean((1, 3))).tofile(f'{GAME}/crescent-h.bin')
enc(ho.reshape(Gn // 2, 2, Gn // 2, 2).mean((1, 3))).tofile(f'{GAME}/outer-h.bin')
# --- paths: new y; deck height on the viaduct spans; promenades over the palace bridges
dH = hi - h0
def dh_at(x, z):
    i = (z - CZ + MAPW / 2) / cs - 0.5; j = (x - CX + MAPW / 2) / cs - 0.5
    return float(ndi.map_coordinates(dH, [[i], [j]], order=1)[0]) if 0 <= i < N and 0 <= j < N else 0.0
for p in newpaths:
    runs = p.pop('_runs', []); wetk = {k: dk for a, b, dk in runs for k in range(a, b + 1)}
    p['points'] = [[q[0], wetk[k] if k in wetk else round(q[1] + dh_at(q[0], q[2]), 1), q[2]] for k, q in enumerate(p['points'])]
for b in bridges:
    if not b['id'].startswith('palace-'): continue
    n = max(2, int(b['length'] // 20))
    pts = [[round(b['a'][0] + (b['b'][0] - b['a'][0]) * k / n, 1), DECK, round(b['a'][1] + (b['b'][1] - b['a'][1]) * k / n, 1)] for k in range(n + 1)]
    newpaths.append(dict(kind='road', width=8, from_='B01', to=b['id'][7:], length_m=b['length'], points=pts, note='promenade over an arched viaduct (cliffs, Oct 17)'))
P2 = dict(P); P2['paths'] = newpaths
old_b = [b for b in P['bridges'] if not (inwin(b['start'][0], b['start'][2]) and H(h, b['start'][0], b['start'][2])[0] < 1 and H(hw, b['start'][0], b['start'][2])[0] > 1)]
P2['bridges'] = old_b + [dict(on=b['id'], kind='viaduct', start=[b['a'][0], b['deck'], b['a'][1]], end=[b['b'][0], b['deck'], b['b'][1]], width=b['width']) for b in bridges]
P2['frame'] = P['frame'] + '; Oct 17 cliffs: bridges of kind viaduct are level decks at y=110.5 on arched pillars (cliffs.json)'
json.dump(P2, open(f'{OUT}/paths.json', 'w'))
wp = json.load(open(f'{OUT}/world-placements-pre-cliffs.json'))
keep, drowned = [], 0
for it in wp['items']:
    x, z = it['x'], it['z']
    if inwin(x, z) and it['place'] not in ('sky', 'sea', 'B30', 'ARRIVAL') and not it['place'].startswith('B01'):
        hn = H(h, x, z)[0]; ho_ = H(hw, x, z)[0]
        if hn < 1.0 and ho_ >= 1.0: drowned += 1; continue
        it = dict(it); it['y'] = round(it['y'] + (hn - ho_), 2)
    keep.append(it)
wp['items'] = keep; wp['cliffs'] = 'Oct 17 16:27: re-seated on the stepped palace cliffs (ridge/cliffs2.py)'
json.dump(wp, open(f'{OUT}/world-placements.json', 'w'))
json.dump(dict(frame='three.js metres, origin palace, x east, z south, y up', deck_y=DECK, water_y=0, levels=[SAT, LV1, LV2],
               palace_mesa=dict(pieces=[dict(x0=a, x1=b, z0=c_, z1=d, top=t) for a, b, c_, d, t in PIECES], note='stepped: top, a 70 m terrace ring, a 32 m ring, then the moat'),
               mesas=[dict(m, top=SAT) for m in MESAS], stacks=STACKS, bridges=bridges, dropped_paths=dropped, walls=walls),
          open(f'{OUT}/cliffs.json', 'w'))
print('bridges', len(bridges), [(b['id'], b['length'], b['deck']) for b in bridges])
print('dropped paths', dropped, 'ramped paths', nramps); print('drowned items', drowned, 'kept', len(keep))
print('wall groups', {w['id']: (len(w['runs']), sum(len(r['pts']) for r in w['runs'])) for w in walls})
