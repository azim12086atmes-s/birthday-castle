"""Dense towns (owner, Oct 17 20:15: the game looks small and flat next to Golden Thread).
Each listed place stops being a dozen houses scattered over a 550-825 m flat disc and becomes a compact town:
a paved plaza with the place's hero model, market stalls round it, radial streets out along the roads that leave
the town, ring lanes, and houses packed 2-4 m apart along every street, facing it, with lanterns down the lanes.
Outside the town the land climbs in terraced hills (between the road exits), so the town sits in a bowl.
python town.py PLACE [PLACE ...]   (reads/writes ridge/out: inner.npz, world-placements.json, paths.json; writes towns.json)
The game's pads must shrink to towns.json's r / e (world metres) or it will flatten the hills again."""
import json, math, sys, glob, os
import numpy as np
from scipy import ndimage as ndi
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'; O = f'{S}/ridge/out'
D = '/home/user/birthday-castle/design/world-fill'
MAPW, CX, CZ = 20691.0, -709.5, 2260.5
h = np.load(f'{O}/inner.npz')['h'].astype(np.float64); N = h.shape[0]; cs = MAPW / N
W = json.load(open(f'{O}/world-placements.json')); P = json.load(open(f'{O}/paths.json'))
G = json.load(open('/home/user/birthday-castle/design/game-schema/game-data.json'))
AT = {q['id']: (q['at']['x'], q['at']['z']) for q in G['places']}
DIMS = {}
for f in glob.glob(f'{D}/glb/*.json') + glob.glob(f'{D}/glb2/*.json'):
    try: DIMS[os.path.basename(f)[:-5]] = json.load(open(f))['dims']
    except Exception: pass
TJ = f'{O}/towns.json'; TOWNS = json.load(open(TJ)) if os.path.exists(TJ) else {}
HOUSEY = ('house', 'cottage', 'cott', 'dwel', 'hut', 'home', 'tavern', 'inn', 'manor', 'chalet', 'cabin', 'villa', 'shop', 'longhouse', 'ho')
STALLS = ['Rustic_Market_Stall', 'Farmers_Market_Cart']
LANTERN = 'Stone_Lantern'
TOWNKIT = f'{O}/townkit'
def TK(m): return m + '_town' if os.path.exists(f'{TOWNKIT}/{m}_town.glb') else m      # the light town copy when there is one

def SEED(pid): return sum((k + 1) * ord(ch) for k, ch in enumerate(pid)) * 7919
# house pools by style, (model, plan size in metres); a place with fewer than 15 houses of its own borrows its style's pool
STYLE_POOL = {
    'medieval': [('Medieval_Cottage', 11), ('A_modular_medieval_ho', 12), ('Timbered_Market_House', 12), ('Enchanted_Thatch_Cott', 11), ('Rpg_house', 12),
                 ('Timberstone_Tower_Hou', 7), ('house', 12), ('Toadstool_Tavern', 9), ('Watchtower_T1', 8)],
    'asian': [('Enchanted_Blossom_Tea', 12), ('Shrine', 8), ('Kalliope_House_Comple', 14), ('Marble_Pavilion', 9), ('Enchanted_Thatch_Cott', 11)],
    'classical': [('Mediterranean_Villa', 14), ('Olive_Grove_Cottage', 12), ('Vintage_Stone_Villa', 15), ('Marble_Pavilion', 9), ('Kalliope_House_Comple', 14)],
    'coastal': [('Mediterranean_Villa', 13), ('Olive_Grove_Cottage', 11), ('Tiki_Pavilion', 10), ('Desert_Dwelling', 10), ('Marble_Pavilion', 8)],
    'forest': [('Whimsical_Hobbit_Dwel', 10), ('Mosswood_Teardrop_Hou', 10), ('Toadstool_Tavern', 9), ('Enchanted_Thatch_Cott', 11), ('Elven_tower_base_Circ', 9)],
    'mountain': [('Timberstone_Tower_Hou', 8), ('Ornate_Watchtower', 10), ('Watchtower_T1', 8), ('Medieval_Cottage', 11), ('A_modular_medieval_ho', 12), ('Windmill_Haven', 12)],
}
PLAN = {'B12': ('medieval', 200), 'B20': ('coastal', 120), 'B21': ('coastal', 110), 'B02': ('asian', 120), 'B06': ('asian', 130), 'B18': ('forest', 130),
        'B04': ('medieval', 150), 'B07': ('classical', 120), 'B08': ('classical', 140), 'B26': ('mountain', 100)}
def ij(x, z): return (np.asarray(z) - CZ + MAPW / 2) / cs - 0.5, (np.asarray(x) - CX + MAPW / 2) / cs - 0.5
def Hs(x, z): i, j = ij(x, z); return ndi.map_coordinates(h, [np.atleast_1d(i), np.atleast_1d(j)], order=1, mode='nearest')
def foot(m, s): d = DIMS.get(m, [8, 8, 8]); return 0.5 * math.hypot(d[0], d[1]) * s * 0.82      # plan radius, corners trimmed
def tall(m, s): d = DIMS.get(m, [8, 8, 8]); return d[2] * s
def seg_dist(px, pz, line):
    best = 1e9
    for (ax, az), (bx, bz) in zip(line[:-1], line[1:]):
        dx, dz = bx - ax, bz - az; t = max(0.0, min(1.0, ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz + 1e-9)))
        best = min(best, math.hypot(px - ax - t * dx, pz - az - t * dz))
    return best

def build(pid):
    cx, cz = AT[pid]; rng = np.random.default_rng(SEED(pid))
    mine = [it for it in W['items'] if it['place'] == pid]
    rest = [it for it in W['items'] if it['place'] != pid]
    from collections import Counter
    cnt = Counter(it['m'] for it in mine); sc = {it['m']: it['scale'] for it in mine}
    hero = max(mine, key=lambda it: tall(it['m'], it['scale']) * (3 if cnt[it['m']] == 1 else 1))
    houses = [m for m in cnt if m != hero['m'] and (cnt[m] >= 2 or any(k in m.lower() for k in HOUSEY)) and foot(m, sc[m]) < 22]
    specials = [it for it in mine if it is not hero and it['m'] not in houses]
    nh_old = sum(cnt[m] for m in houses)
    style, n_target = PLAN.get(pid, ('medieval', int(1.4 * nh_old)))
    if nh_old < 15:                                                # too few of its own: the style's pool at natural size
        for m, size in STYLE_POOL[style]:
            if m in DIMS and m not in houses: houses.append(m); cnt[m] = 3; sc[m] = round(size / max(DIMS[m][0], DIMS[m][1]), 3)
        specials = [it for it in specials if it['m'] not in houses]
    weights = np.array([cnt[m] for m in houses], float); weights /= weights.sum()
    # town size: room for n_target houses at their pitch (42 % of the disc is built), 120-260 m
    mean_f = float(np.mean([foot(m, sc[m]) for m in houses])) if houses else 6
    Rt = max(120.0, min(260.0, math.sqrt(n_target * (2 * mean_f + 4.5) ** 2 / (math.pi * 0.42))))
    hf = foot(hero['m'], hero['scale'])
    Rp = max(30.0 + 0.04 * Rt, hf + 14)                            # the plaza wraps the hero, however big
    Rt = Rt + max(0.0, Rp - 30.0 - 0.04 * Rt)
    hc = float(Hs(cx, cz)[0])
    # road exits: where each road or trail crosses the circle Rt + 120 round the town
    exits = []
    for p in P['paths']:
        if p['kind'] not in ('road', 'royal', 'trail'): continue
        pts = p['points']
        for a, b in zip(pts[:-1], pts[1:]):
            da, db = math.hypot(a[0] - cx, a[2] - cz), math.hypot(b[0] - cx, b[2] - cz)
            R0 = Rt + 120
            if (da - R0) * (db - R0) <= 0:
                t = (R0 - da) / (db - da + 1e-9); x, z = a[0] + (b[0] - a[0]) * t, a[2] + (b[2] - a[2]) * t
                exits.append(math.atan2(z - cz, x - cx))
    ang = []
    for e in sorted(exits):
        if all(abs((e - a + math.pi) % (2 * math.pi) - math.pi) > math.radians(25) for a in ang): ang.append(e)
    main = list(ang)
    # fill gaps wider than 65 degrees with extra radial streets
    full = sorted(ang) if ang else [rng.uniform(-math.pi, math.pi)]
    k = 0
    while k < len(full):
        a, b = full[k], full[(k + 1) % len(full)] + (2 * math.pi if k + 1 == len(full) else 0)
        gap = b - a if len(full) > 1 else 2 * math.pi
        n_add = int(gap // math.radians(65))
        for j in range(1, n_add + 1): full.insert(k + j, a + gap * j / (n_add + 1))
        k += n_add + 1
    streets = []                                                    # (polyline, half width, kind)
    for a in full:
        is_main = any(abs((a - m + math.pi) % (2 * math.pi) - math.pi) < 1e-6 for m in main)
        r1 = Rt + (110 if is_main else 6); wob = rng.uniform(-0.08, 0.08)
        line = [(cx + r * math.cos(a + wob * math.sin(r / 45)), cz + r * math.sin(a + wob * math.sin(r / 45))) for r in np.arange(Rp - 2, r1, 8)]
        streets.append((line, 4.0 if is_main else 3.0, 'main' if is_main else 'lane'))
    rings = [r for r in np.arange(Rp + 24, Rt - 8, 34)]
    for r in rings:
        n = int(2 * math.pi * r / 8); ph = rng.uniform(0, 6.28)
        line = [(cx + r * (1 + 0.03 * math.sin(3 * t + ph)) * math.cos(t), cz + r * (1 + 0.03 * math.sin(3 * t + ph)) * math.sin(t)) for t in np.linspace(0, 2 * math.pi, n + 1)]
        streets.append((line, 2.8, 'ring'))
    lines = [s_[0] for s_ in streets]; hws = [s_[1] for s_ in streets]
    def clear_of_streets(x, z, r):
        return all(seg_dist(x, z, ln) > hw + r + 0.8 for ln, hw in zip(lines, hws))
    placed = []                                                     # (x, z, r)
    def free(x, z, r): return all(math.hypot(x - a, z - b) > r + q + 2.2 for a, b, q in placed)
    new = []
    def put(m, x, z, rot, s, tag=None):
        y = float(Hs(x, z)[0]); it = dict(m=m, place=pid, x=round(x, 2), y=round(y, 2), z=round(z, 2), rotY=round(rot, 4), scale=s, new=True)
        if tag: it['town'] = tag
        new.append(it)
    put(hero['m'], cx, cz, hero['rotY'], hero['scale'], 'hero')
    placed.append((cx, cz, hf))
    # market stalls and the old one-off models round the plaza, facing in
    ring_items = [(m, sc.get(m, 1.0)) for m in [it['m'] for it in specials]] + [(STALLS[k % 2], None) for k in range(8)]
    for k, (m, s) in enumerate(ring_items):
        if m not in DIMS: continue
        if s is None: s = 3.2 / max(DIMS[m][2], 1e-3)                # stalls ~3.2 m tall
        a = 2 * math.pi * k / len(ring_items) + 0.2; rr = Rp - 4 - foot(m, s) * 0.5 if foot(m, s) < 8 else Rp + foot(m, s) + 6
        x, z = cx + rr * math.cos(a), cz + rr * math.sin(a)
        if free(x, z, foot(m, s)): put(TK(m), x, z, math.atan2(cx - x, cz - z), s, 'plaza'); placed.append((x, z, foot(m, s)))
    # houses along every street, both sides, facing it; slots fill from the plaza outwards so the town stays compact
    pool = list(houses); nh = 0; hc0 = float(Hs(cx, cz)[0]); cands = []
    for ln, hw, kind in streets:
        L = np.concatenate([[0], np.cumsum([math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(ln[:-1], ln[1:])])])
        for side in (-1, 1):
            for t in np.arange(rng.uniform(0, 4), L[-1], 4.0):
                k = min(int(np.searchsorted(L, t, side='right')) - 1, len(ln) - 2)
                (ax, az), (bx, bz) = ln[k], ln[k + 1]; dl = math.hypot(bx - ax, bz - az) + 1e-9; u = (t - L[k]) / dl
                px, pz = ax + (bx - ax) * u, az + (bz - az) * u; nx, nz = -(bz - az) / dl * side, (bx - ax) / dl * side
                dc = math.hypot(px - cx, pz - cz)
                if Rp < dc < Rt + 6: cands.append((dc + rng.uniform(0, 6), px, pz, nx, nz, hw))
    cands.sort()
    for dc_, px, pz, nx, nz, hw in cands:
        if nh >= n_target or not pool: break
        m = pool[rng.choice(len(pool), p=weights)]
        s = sc[m] * rng.uniform(0.92, 1.08); r = foot(m, s)
        off = hw + 1.6 + r; x, z = px + nx * off, pz + nz * off
        dc = math.hypot(x - cx, z - cz)
        if Rp + r < dc < Rt + 6 and free(x, z, r) and clear_of_streets(x, z, r * 0.9) and (hc0 > 0.8 or Hs(x, z)[0] > 0.8):
            put(TK(m), x, z, math.atan2(-nx, -nz), round(s, 3), 'house'); placed.append((x, z, r)); nh += 1
    # the town ends where its houses end: drop empty outer rings, trim side lanes, keep the main streets out to the roads
    hd = [math.hypot(it['x'] - cx, it['z'] - cz) for it in new if it.get('town') == 'house']
    Rt = max(Rp + 30, (max(hd) if hd else Rp + 30) + 10)
    keep = []
    for ln, hw, kind in streets:
        if kind == 'ring':
            if math.hypot(ln[0][0] - cx, ln[0][1] - cz) < Rt: keep.append((ln, hw, kind))
        elif kind == 'lane': keep.append(([q for q in ln if math.hypot(q[0] - cx, q[1] - cz) < Rt + 6], hw, kind))
        else: keep.append(([q for q in ln if math.hypot(q[0] - cx, q[1] - cz) < Rt + 110], hw, kind))
    streets = [s_ for s_ in keep if len(s_[0]) >= 2]
    lines = [s_[0] for s_ in streets]; hws = [s_[1] for s_ in streets]
    # lanterns down the streets
    nl = 0
    if LANTERN in DIMS:
        ls_ = 2.8 / max(DIMS[LANTERN][2], 1e-3)
        for ln, hw, kind in streets:
            for k in range(0, len(ln) - 1, 4):
                (ax, az), (bx, bz) = ln[k], ln[k + 1]; dl = math.hypot(bx - ax, bz - az) + 1e-9; side = 1 if (k // 3) % 2 else -1
                x, z = ax - (bz - az) / dl * side * (hw + 0.9), az + (bx - ax) / dl * side * (hw + 0.9)
                if nl < max(30, n_target // 3) and math.hypot(x - cx, z - cz) < Rt + 4 and free(x, z, 0.6): put(TK(LANTERN), x, z, 0.0, round(ls_, 3), 'lantern'); placed.append((x, z, 0.6)); nl += 1
    W['items'] = rest + new
    # streets and the plaza as paths (they replace this place's old alleys and plaza)
    P['paths'] = [p for p in P['paths'] if not (p['kind'] == 'alley' and p.get('from_') == pid)]
    for ln, hw, kind in streets:
        ys = Hs([q[0] for q in ln], [q[1] for q in ln])
        P['paths'].append(dict(kind='alley', width=round(2 * hw, 1), from_=pid, to=kind, length_m=round(sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(ln[:-1], ln[1:])), 1),
                               points=[[round(q[0], 1), round(float(y), 1), round(q[1], 1)] for q, y in zip(ln, ys)], note='town street (town.py, Oct 17)'))
    P['plazas'] = [z for z in P['plazas'] if z['place'] != pid] + [dict(place=pid, x=cx, z=cz, radius=round(Rp, 1))]
    TOWNS[pid] = dict(x=cx, z=cz, r=round(Rt + 14, 1), e=60.0, y=round(hc, 2), plaza=round(Rp, 1), houses=nh, houses_before=nh_old, style=style, lanterns=nl,
                      exits_deg=[round(math.degrees(a), 1) for a in main])
    return Rt, hc, main

def landform(pid, Rt, hc, exits):
    """flat town core, then terraced hills rising between the road exits (the roads keep a gentle valley)"""
    global h
    cx, cz = AT[pid]; R = Rt + 700
    i0, j0 = [int(v) for v in ij(cx - R, cz - R)]; i1, j1 = [int(v) + 2 for v in ij(cx + R, cz + R)]
    i0, j0 = max(i0, 0), max(j0, 0); i1, j1 = min(i1, N), min(j1, N)
    zs = CZ - MAPW / 2 + (np.arange(i0, i1) + 0.5) * cs; xs = CX - MAPW / 2 + (np.arange(j0, j1) + 0.5) * cs
    X, Z = np.meshgrid(xs, zs); d = np.hypot(X - cx, Z - cz); a = np.arctan2(Z - cz, X - cx)
    sub = h[i0:i1, j0:j1]
    # how far each direction is from a road exit (0 on the road, 1 well away)
    away = np.ones_like(d)
    for e in exits: away = np.minimum(away, np.clip((np.abs((a - e + np.pi) % (2 * np.pi) - np.pi) - 0.10) / 0.35, 0, 1))
    g = np.random.default_rng(SEED(pid) + 7).uniform(-1, 1, (32, 32))
    nz = ndi.map_coordinates(g, [(Z * 0.006) % 31, (X * 0.006) % 31], order=3, mode='wrap')
    lobes = 0.55 + 0.45 * np.sin(5 * a + 1.3 * nz) * np.cos(3 * a + 0.7)
    rise = (35 + 45 * lobes) * (0.6 + 0.4 * nz) * away                       # 15-80 m hills round the bowl
    # keep every road and trail in its own ground: no hill within 20 m of a road, blending out by 70 m
    roadm = np.zeros(d.shape, bool)
    for p in P['paths']:
        if p['kind'] not in ('road', 'royal', 'trail') or p.get('from_') == pid: continue
        for q0, q1 in zip(p['points'][:-1], p['points'][1:]):
            n_ = max(1, int(math.hypot(q1[0] - q0[0], q1[2] - q0[2]) / (cs * 0.5)))
            for u in np.linspace(0, 1, n_ + 1):
                x_, z_ = q0[0] + (q1[0] - q0[0]) * u, q0[2] + (q1[2] - q0[2]) * u
                ii_, jj_ = int((z_ - zs[0]) / cs + 0.5), int((x_ - xs[0]) / cs + 0.5)
                if 0 <= ii_ < d.shape[0] and 0 <= jj_ < d.shape[1]: roadm[ii_, jj_] = True
    rd = ndi.distance_transform_edt(~roadm) * cs
    away = away * np.clip((rd - 20) / 50, 0, 1)
    prof = np.clip((d - Rt - 25) / 260, 0, 1)
    terr = np.floor(prof * 5) / 5; prof = 0.55 * prof + 0.45 * terr               # terraced steps on the slopes
    fade = 1 - np.clip((d - Rt - 380) / 300, 0, 1)
    target = hc + rise * prof * fade
    core = np.clip((d - Rt - 12) / 40, 0, 1)                                       # 0 in the town, 1 outside
    outside = np.maximum(sub, target)
    new = np.where(d < Rt + 12, hc, np.where(d < Rt + 52, hc * (1 - core) + outside * core, outside))
    wet = sub < 0.5
    res = np.where(wet & (d > Rt + 12), sub, new)
    dH = res - sub; h[i0:i1, j0:j1] = res
    # everything else standing in this window rides the new ground
    for it in W['items']:
        if it['place'] == pid or not (xs[0] <= it['x'] <= xs[-1] and zs[0] <= it['z'] <= zs[-1]): continue
        di = ndi.map_coordinates(dH, [[(it['z'] - zs[0]) / cs], [(it['x'] - xs[0]) / cs]], order=1)[0]
        if abs(di) > 0.05: it['y'] = round(it['y'] + float(di), 2)

ids = sys.argv[1:]
for pid in ids:
    Rt, hc, ex = build(pid)
    landform(pid, Rt, hc, ex if ex else [0.0])
    # re-seat this town's items on the reshaped ground
    for it in W['items']:
        if it['place'] == pid: it['y'] = round(float(Hs(it['x'], it['z'])[0]), 2)
    print(pid, TOWNS[pid])
np.savez_compressed(f'{O}/inner.npz', h=h.astype(np.float32))
json.dump(W, open(f'{O}/world-placements.json', 'w')); json.dump(P, open(f'{O}/paths.json', 'w')); json.dump(TOWNS, open(TJ, 'w'), indent=1)
