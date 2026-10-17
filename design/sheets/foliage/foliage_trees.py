#!/usr/bin/env python3
"""Foliage sheet A: TREE DESIGN SKETCH.  python3 foliage_trees.py <round>
Every view of a tree (day, night, silhouette, branch diagram, LODs) is drawn from ONE grown skeleton,
so the build thread can read the same structure in every view."""
import math, random, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from foliage_common import *
import foliage_common as C

ROUND = int(sys.argv[1]) if len(sys.argv) > 1 else 1
OUT = os.path.dirname(os.path.abspath(__file__))


def pick(v, o):
    return v[min(o, len(v) - 1)] if isinstance(v, (list, tuple)) else v


def U(rng, a, b):
    return rng.uniform(a, b)


# ----------------------------------------------------------------------------------------------
# skeleton growth
# ----------------------------------------------------------------------------------------------
def grow(sp, seed=1):
    rng = random.Random(seed)
    B, tips = [], []

    def br(x, y, a, L, r0, o):
        n = sp.get("seg", 10)
        pts, angs = [(x, y)], [a]
        cv, tro, tgt = pick(sp.get("curve", 0), o), pick(sp.get("trop", 0), o), pick(sp.get("tgt", 0), o)
        wig = pick(sp.get("wig", .12), o)
        side = 1 if a > 0.02 else (-1 if a < -0.02 else rng.choice([-1, 1]))
        for i in range(n):
            a += side * cv / n + rng.gauss(0, wig) / math.sqrt(n)
            if tro:
                a += (side * tgt - a) * tro / n
            x += L / n * math.sin(a)
            y += L / n * math.cos(a)
            pts.append((x, y))
            angs.append(a)
        r1 = r0 * pick(sp["taper"], o)
        b = dict(pts=pts, angs=angs, r0=r0, r1=r1, o=o, L=L)
        B.append(b)
        if o < sp["max_o"]:
            for (t, da, lf, rf) in sp["kids"](o, rng, b):
                i = min(n, max(0, int(round(t * n))))
                px, py = pts[i]
                rr = r0 + (r1 - r0) * i / n
                br(px, py, angs[i] + da, L * lf, rr * rf, o + 1)
        else:
            tips.append((x, y, a, r1, o))

    br(0, 0, sp.get("lean", 0), sp["L0"], sp["r0"], 0)

    # clumps at the tips, plus some interior fill clumps on the second-last order
    CL = []
    shape = sp.get("shape", "round")
    for (x, y, a, r, o) in tips:
        cr = sp["clump"] * U(rng, .75, 1.2)
        CL.append(dict(x=x + math.sin(a) * cr * .25, y=y + cr * .18, r=cr, seed=rng.random()))
    for b in B:
        if b["o"] == sp["max_o"] - 1 and rng.random() < sp.get("fill", 0):
            x, y = b["pts"][len(b["pts"]) // 2]
            cr = sp["clump"] * U(rng, .7, 1.0)
            CL.append(dict(x=x, y=y + cr * .2, r=cr, seed=rng.random()))
    # roots
    R = []
    for i in range(sp.get("roots", 0)):
        side = -1 if i % 2 == 0 else 1
        r0 = sp["r0"]
        h = r0 * U(rng, 1.2, 2.6) * sp.get("root_h", 1)
        d = r0 * U(rng, 1.0, 2.4) * sp.get("root_d", 1)
        drop = sp.get("root_drop", 0)
        x0, y0 = side * r0 * U(rng, .2, .7), h
        x2, y2 = side * (r0 + d), -drop * U(rng, .6, 1.0) - .3
        x1, y1 = side * (r0 + d * .55), h * .35 - drop * .2
        n = 10
        pts, angs = [], []
        for k in range(n + 1):
            t = k / n
            px = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * x1 + t * t * x2
            py = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * y1 + t * t * y2
            dx = 2 * (1 - t) * (x1 - x0) + 2 * t * (x2 - x1)
            dy = 2 * (1 - t) * (y1 - y0) + 2 * t * (y2 - y1)
            pts.append((px, py))
            angs.append(math.atan2(dx, dy))
        R.append(dict(pts=pts, angs=angs, r0=r0 * U(rng, .28, .42), r1=r0 * .05, o=0, L=d, root=True, front=(i % 3 != 0)))
    # normalise to the target height
    top = max([c["y"] + c["r"] * (.5 if shape == "pad" else .85) for c in CL] + [max(p[1] for b in B for p in b["pts"])])
    s = sp["H"] / top
    for b in B + R:
        b["pts"] = [(x * s, y * s) for x, y in b["pts"]]
        b["r0"] *= s
        b["r1"] *= s
    for c in CL:
        c["x"] *= s; c["y"] *= s; c["r"] *= s
    tips = [(x * s, y * s, a, r * s, o) for (x, y, a, r, o) in tips]
    xs = [c["x"] - c["r"] for c in CL] + [c["x"] + c["r"] for c in CL] + [p[0] for b in B + R for p in b["pts"]]
    ext = (min(xs), max(xs), sp["H"])
    return dict(B=B, R=R, CL=CL, tips=tips, ext=ext, sp=sp, s=s)


# kid rules ---------------------------------------------------------------------------------------
def forks(spec):
    """spec[o] = dict(n=fork count at the tip, spread, lf, rf, side=[(t, da, lf, rf)], jit)"""
    def k(o, rng, b):
        p = spec[min(o, len(spec) - 1)]
        n, out = p["n"], []
        for j in range(n):
            fr = (j - (n - 1) / 2) / max((n - 1) / 2, 1) if n > 1 else 0
            lf = p["lf"][j] if isinstance(p["lf"], (list, tuple)) else p["lf"]
            out.append((1.0, p["spread"] * fr + rng.gauss(0, p.get("jit", .12)) + p.get("bias", 0), lf * U(rng, .85, 1.12), p["rf"]))
        for (t, da, lf, rf) in p.get("side", []):
            sgn = rng.choice([-1, 1]) if da == "r" else 1
            dd = (U(rng, .8, 1.2) * sgn) if da == "r" else da
            out.append((t, dd, lf * U(rng, .85, 1.1), rf))
        return out
    return k


def whorls(n, a0, a1, lf0, lf1, sub=2):
    def k(o, rng, b):
        out = []
        if o == 0:
            for i in range(n):
                t = .1 + .88 * i / (n - 1)
                ang = a0 + (a1 - a0) * t
                lf = lf0 + (lf1 - lf0) * t
                for s in (-1, 1):
                    out.append((t, s * (ang + rng.gauss(0, .08)), lf * U(rng, .8, 1.1), .35))
        else:
            for j in range(sub):
                out.append((U(rng, .4, .9), rng.choice([-1, 1]) * .5, .4, .6))
        return out
    return k


# ----------------------------------------------------------------------------------------------
# species
# ----------------------------------------------------------------------------------------------
SP = {}
SP["giant"] = dict(
    name="Glowwood giant", H=100, L0=50, r0=6.6, max_o=3, taper=[.55, .55, .6, .6], flare=1.6,
    curve=[0, .25, .2, .15], trop=[0, .8, .4, 0], tgt=[0, .9, .9, 0], wig=[.05, .2, .25, .3], shape="pad", flat=.55,
    clump=7.5, fill=.5, roots=9, root_h=1.3, root_d=1.3, flute=True, moss=True,
    kids=forks([dict(n=4, spread=.8, lf=.56, rf=.6, side=[(.62, -1.15, .45, .45), (.8, 1.05, .42, .42)]),
                dict(n=3, spread=.55, lf=.6, rf=.66, side=[(.5, "r", .45, .5)]),
                dict(n=2, spread=.5, lf=.62, rf=.62)]),
    day=("#1f4a44", "#2f7a5e", "#6fbf7a", "#c8f0a0"), back="#173a36",
    night=("#0c1a26", "#14343e", "#4fe0cf", "#7ff5e6"), nback="#08121c",
    bark=("#5d5a64", "#8e8a90", "#c9c4bc"), nbark=("#1a1830", "#2c2846", "#5fc8c0"), moss="#9cc04a", nmoss="#3f7a5a",
    glow=["#7ff5e6", "#4fe0cf", "#b7ffcf", "#ffcf5a"])

SP["mother"] = dict(
    name="Mother Tree", H=140, L0=36, r0=11, max_o=3, taper=[.6, .5, .6, .6], flare=1.9,
    curve=[0, -.15, .2, .1], trop=[0, 1.4, .5, 0], tgt=[0, 1.28, 1.0, 0], wig=[.04, .12, .22, .3], shape="pad", flat=.42,
    clump=13, fill=.6, roots=11, root_h=1.0, root_d=1.6, root_drop=20, flute=True, moss=False,
    kids=forks([dict(n=3, spread=1.0, lf=[1.45, .95, 1.4], rf=.66, side=[(.78, -.45, 1.1, .5)]),
                dict(n=2, spread=.7, lf=.5, rf=.6, bias=-.2, side=[(.45, -.75, .45, .5), (.7, -.65, .42, .45)]),
                dict(n=3, spread=.55, lf=.6, rf=.6)]),
    day=("#5e1f4a", "#b23a7e", "#f080b4", "#ffd0e4"), back="#45163a",
    night=("#2a0c2a", "#5a1a50", "#ff7fd0", "#ffb3e0"), nback="#1a0820",
    bark=("#5c4650", "#8f747a", "#d6b8b8"), nbark=("#1e1226", "#3a2440", "#ff9fd0"), moss="#9cc04a", nmoss="#3f5a4a",
    glow=["#ff8cc8", "#ffd27a", "#ffb3e0", "#c79bff"])

SP["avenue"] = dict(
    name="Avenue tree", H=18, L0=4.6, r0=.48, max_o=3, taper=[.65, .6, .6, .6], flare=.5,
    curve=[0, .2, .2, .1], trop=[0, .3, 0, 0], tgt=[0, .5, 0, 0], wig=[.04, .15, .25, .3], shape="round", flat=.85,
    clump=2.5, fill=.8,
    kids=forks([dict(n=4, spread=.72, lf=1.05, rf=.66), dict(n=3, spread=.55, lf=.58, rf=.66), dict(n=2, spread=.5, lf=.55, rf=.6)]),
    day=("#24502e", "#3f8a3f", "#86c95a", "#d8f290"), back="#1b3d24",
    night=("#0c1a1c", "#173a2c", "#9fe0a0", "#ffd27a"), nback="#08121a",
    bark=("#5a4a44", "#86766a", "#c4b4a0"), nbark=("#1a1424", "#2e2538", "#ffc070"), moss="#8fb04a", nmoss="#2f5a3a",
    glow=["#ffd27a", "#ffe8a0", "#ffb070"])

SP["biolum"] = dict(
    name="Bioluminescent tree", H=14, L0=6, r0=.5, max_o=3, taper=[.6, .6, .6, .6], flare=.9,
    curve=[0, .5, .4, .3], trop=[0, .2, 0, 0], tgt=[0, .8, 0, 0], wig=[.35, .35, .3, .3], shape="swirl", flat=.8,
    clump=1.9, fill=.5,
    kids=forks([dict(n=3, spread=.75, lf=.75, rf=.66, side=[(.55, "r", .55, .5)]), dict(n=3, spread=.6, lf=.6, rf=.66),
                dict(n=2, spread=.55, lf=.55, rf=.6)]),
    day=("#3b2a6e", "#6b4ac0", "#a88aff", "#e0d0ff"), back="#2a1e52",
    night=("#140c2c", "#2a1a5a", "#5ff0e0", "#a0fff2"), nback="#0a0618",
    bark=("#3a2c4a", "#5c4870", "#9a86b0"), nbark=("#120c22", "#22183a", "#5ff0e0"),
    glow=["#5ff0e0", "#a0fff2", "#c79bff", "#ffd27a"])

SP["sakura"] = dict(
    name="Blossom tree", H=9, L0=2.8, r0=.42, lean=.3, max_o=3, taper=[.7, .6, .6, .6], flare=.6,
    curve=[.35, -.2, .3, .2], trop=[0, 1.6, .3, 0], tgt=[0, 1.3, .9, 0], wig=[.15, .2, .3, .3], shape="puff", flat=.7,
    clump=1.45, fill=.7,
    kids=forks([dict(n=3, spread=1.0, lf=[1.55, 1.0, 1.5], rf=.7),
                dict(n=2, spread=.5, lf=.5, rf=.62, bias=-.35, side=[(.4, -.7, .5, .55), (.7, -.6, .45, .5)]),
                dict(n=2, spread=.5, lf=.5, rf=.6)]),
    day=("#b25a82", "#e88cb4", "#ffc4dc", "#fff2f8"), back="#8f4468",
    night=("#3a1430", "#7a3a66", "#ffb3d6", "#ffe0ee"), nback="#22091e",
    bark=("#3e2a30", "#5e4248", "#a08088"), nbark=("#160c16", "#2a1a26", "#ffb3d6"),
    glow=["#ffc4dc", "#ffe0ee", "#ffd27a"])

SP["willow"] = dict(
    name="Lake willow", H=15, L0=4.2, r0=.62, lean=-.15, max_o=2, taper=[.62, .55, .6], flare=.8,
    curve=[0, .5, .3], trop=[0, .5, .2], tgt=[0, 1.1, 1.3], wig=[.12, .2, .25], shape="strand", flat=.8,
    clump=2.4, fill=.6,
    kids=forks([dict(n=4, spread=.85, lf=1.35, rf=.62), dict(n=3, spread=.6, lf=.55, rf=.6, side=[(.5, "r", .45, .5)])]),
    day=("#2a5444", "#4a8a62", "#94cc8a", "#d4f0b0"), back="#1f4034",
    night=("#0c1c22", "#163a3a", "#7fe8d0", "#c0fff0"), nback="#081418",
    bark=("#4a4038", "#6e6052", "#a8987e"), nbark=("#141420", "#26243a", "#7fe8d0"),
    glow=["#7fe8d0", "#c0fff0", "#ff9fd0"])

SP["maple"] = dict(
    name="Autumn maple", H=13, L0=3.6, r0=.4, max_o=3, taper=[.65, .6, .6, .6], flare=.5,
    curve=[0, .25, .2, .1], trop=[0, .3, 0, 0], tgt=[0, .7, 0, 0], wig=[.08, .2, .25, .3], shape="round", flat=.75,
    clump=1.9, fill=.7,
    kids=forks([dict(n=3, spread=.8, lf=1.1, rf=.66, side=[(.6, "r", .7, .5)]), dict(n=3, spread=.6, lf=.58, rf=.66),
                dict(n=2, spread=.5, lf=.55, rf=.6)]),
    day=("#7a1a22", "#c43a2a", "#f27a3a", "#ffc860"), back="#5a1218",
    night=("#260a12", "#4a1418", "#ff9a5a", "#ffd27a"), nback="#14060a",
    bark=("#4a3a34", "#6a5648", "#a89480"), nbark=("#181018", "#2a1e26", "#ffb070"),
    glow=["#ffb070", "#ffd27a"])

SP["birch"] = dict(
    name="Silver birch", H=16, L0=13, r0=.24, lean=.05, max_o=2, taper=[.3, .5, .6], flare=.4,
    curve=[0, .2, .1], trop=[0, .6, 0], tgt=[0, .7, 0], wig=[.08, .2, .25], shape="round", flat=.9,
    clump=1.2, fill=.9, birch=True,
    kids=forks([dict(n=2, spread=.4, lf=.25, rf=.7, side=[(.45, -.8, .3, .5), (.55, .8, .3, .5), (.68, -.7, .28, .5), (.78, .7, .26, .5), (.88, -.5, .2, .5)]),
                dict(n=2, spread=.5, lf=.5, rf=.6)]),
    day=("#8a1a26", "#d0403a", "#ff8a5a", "#ffd0a0"), back="#6a1420",
    night=("#260a12", "#4a1418", "#ff9a5a", "#ffd27a"), nback="#14060a",
    bark=("#bdb2ae", "#ece4dc", "#ffffff"), nbark=("#3a3448", "#6a6480", "#e8e0ff"),
    glow=["#ffb070"])

SP["pine"] = dict(
    name="Cliff pine", H=12, L0=6, r0=.45, lean=.5, max_o=2, taper=[.5, .55, .6], flare=.6,
    curve=[-.7, .3, .2], trop=[0, 1.2, .5], tgt=[0, 1.35, 1.3], wig=[.2, .25, .3], shape="pad", flat=.32,
    clump=2.3, fill=.4,
    kids=forks([dict(n=2, spread=.6, lf=.6, rf=.6, side=[(.5, -1.35, .8, .5), (.75, 1.15, .7, .45)]), dict(n=2, spread=.5, lf=.5, rf=.6)]),
    day=("#1c3a34", "#2f5f4a", "#6a9a6a", "#b0d090"), back="#142c28",
    night=("#0a1418", "#142a2a", "#8fd0c0", "#c0f0e0"), nback="#060c10",
    bark=("#4a3830", "#7a5a44", "#b88a64"), nbark=("#141018", "#262030", "#ffb070"),
    glow=["#c0f0e0"])

SP["fir"] = dict(
    name="Tiered fir", H=26, L0=26, r0=.55, max_o=1, taper=[.08, .4], flare=.7,
    curve=[0, -.2], trop=[0, .9], tgt=[0, 1.9], wig=[.02, .05], shape="tier", clump=0,
    kids=whorls(11, 2.0, 1.2, .3, .06), custom="fir",
    day=("#16322e", "#24504a", "#4e8a72", "#9ccaa8"), back="#10261f",
    night=("#081216", "#102428", "#6fd0c0", "#c0f0ff"), nback="#060c10",
    bark=("#4a3428", "#6a4a38", "#a07a5a"), nbark=("#141018", "#262030", "#8fd0c0"), glow=["#c0f0ff"])

SP["cypress"] = dict(
    name="Italian cypress", H=16, L0=15, r0=.3, max_o=0, taper=[.2], flare=.3, curve=[0], trop=[0], tgt=[0], wig=[.02],
    shape="flame", clump=0, kids=lambda o, r, b: [], custom="cypress",
    day=("#16362a", "#255a40", "#4e8a5e", "#9cc88a"), back="#102a20",
    night=("#081410", "#10261c", "#8fe0b0", "#d0ffe0"), nback="#060c0a",
    bark=("#4a3a30", "#6a5446", "#9a8070"), nbark=("#141018", "#262030", "#8fd0c0"), glow=["#ffd27a"])

SP["palm"] = dict(
    name="Lagoon palm", H=12, L0=11, r0=.32, lean=.25, max_o=0, taper=[.75], flare=.7,
    curve=[-.45], trop=[0], tgt=[0], wig=[.03], shape="palm", clump=0, kids=lambda o, r, b: [], custom="palm",
    day=("#1f5a3a", "#3f8f48", "#8cc860", "#d8f090"), back="#174630",
    night=("#0a1a18", "#14302a", "#7fe8d0", "#ffd27a"), nback="#06100e",
    bark=("#6a5040", "#9a7a5a", "#d0b088"), nbark=("#1a1420", "#2e2434", "#ffc070"), glow=["#ffd27a", "#ffb070"])

SP["palm2"] = dict(SP["palm"], lean=-.35, H=9, L0=8, curve=[.5], name="Lagoon palm (short)")


# ----------------------------------------------------------------------------------------------
# tree rendering (metre coordinates, y up; returned as SVG fragment list)
# ----------------------------------------------------------------------------------------------
def branch_edges(b, flare=0, rscale=1.0):
    pts, angs, n = b["pts"], b["angs"], len(b["pts"]) - 1
    Lft, Rgt, rad = [], [], []
    for i, (x, y) in enumerate(pts):
        a = angs[i]
        r = (b["r0"] + (b["r1"] - b["r0"]) * i / n) * rscale
        if b["o"] == 0 and not b.get("root"):
            r *= 1 + flare * math.exp(-i / n * 9)
        nx, ny = math.cos(a), -math.sin(a)
        Lft.append((x - nx * r, y - ny * r))
        Rgt.append((x + nx * r, y + ny * r))
        rad.append(r)
    return Lft, Rgt, rad


def offset_line(b, fr, flare=0):
    pts, angs, n = b["pts"], b["angs"], len(b["pts"]) - 1
    out = []
    for i, (x, y) in enumerate(pts):
        a = angs[i]
        r = b["r0"] + (b["r1"] - b["r0"]) * i / n
        if b["o"] == 0 and not b.get("root"):
            r *= 1 + flare * math.exp(-i / n * 9)
        out.append((x + math.cos(a) * r * fr, y - math.sin(a) * r * fr))
    return out


def draw_branch(G, b, cols, flare, mode, sp, rng):
    dk, md, lt = cols
    Lft, Rgt, rad = branch_edges(b, flare)
    G.append(f'<path d="{polyd(Lft + Rgt[::-1])}" fill="{dk}"/>')
    if mode in ("sil",):
        return
    mid = offset_line(b, -.05, flare)
    G.append(f'<path d="{polyd(Lft + mid[::-1])}" fill="{md}"/>')
    hl = offset_line(b, -.62, flare)
    G.append(f'<path d="{polyd(Lft + hl[::-1])}" fill="{lt}" opacity=".75"/>')
    if mode == "lod2":
        return
    r_avg = (b["r0"] + b["r1"]) / 2
    if sp.get("flute") and b["o"] <= 1 and mode in ("day", "night"):
        # rope-strand fluting (U241, U29): grooves + ridge highlights following the branch
        for k, fr in enumerate([-.78, -.5, -.22, .08, .36, .62, .85]):
            ln_ = offset_line(b, fr + .04 * math.sin(k * 2.3), flare)
            G.append(f'<path d="{smoothd(ln_)}" fill="none" stroke="{dk}" stroke-width="{f(r_avg*.07)}" opacity=".85"/>')
            ln2 = offset_line(b, fr - .07, flare)
            G.append(f'<path d="{smoothd(ln2)}" fill="none" stroke="{lt}" stroke-width="{f(r_avg*.035)}" opacity=".45"/>')
    if sp.get("birch") and b["o"] == 0 and mode in ("day", "night"):
        # black lenticel dashes and knots (U73)
        pts = b["pts"]
        for i in range(1, len(pts) - 1):
            for _ in range(2):
                x, y = pts[i]
                yy = y + U(rng, -.4, .4)
                r = b["r0"] + (b["r1"] - b["r0"]) * i / (len(pts) - 1)
                w = r * U(rng, .5, 1.4)
                xo = U(rng, -r * .7, r * .3)
                G.append(f'<rect x="{f(x+xo)}" y="{f(yy)}" width="{f(w)}" height="{f(r*.18)}" fill="#2a2228" opacity=".85"/>')
    if mode in ("day", "night") and b["o"] <= 1 and not b.get("root"):
        # bark furrow dashes
        for i in range(1, len(b["pts"]) - 1, 2):
            x, y = b["pts"][i]
            r = rad[i]
            G.append(f'<path d="M{f(x - r*.3)} {f(y)} q{f(r*.15)} {f(r*.6)} 0 {f(r*1.2)}" stroke="{dk}" stroke-width="{f(r*.05)}" fill="none" opacity=".5"/>')


def draw_moss(G, b, color, flare):
    """Moss sits only on the upper surfaces of leaning limbs (U99)."""
    pts, angs = b["pts"], b["angs"]
    n = len(pts) - 1
    run = []
    for i, (x, y) in enumerate(pts):
        a = angs[i]
        if abs(math.sin(a)) < .3:
            if len(run) > 1:
                G.append(f'<path d="{smoothd(run)}" fill="none" stroke="{color}" stroke-width="{f(b["r0"]*.32)}" opacity=".9"/>')
            run = []
            continue
        r = b["r0"] + (b["r1"] - b["r0"]) * i / n
        top = -1 if a > 0 else 1   # top side multiplier along the right normal
        run.append((x + math.cos(a) * r * .82 * top, y - math.sin(a) * r * .82 * top))
    if len(run) > 1:
        G.append(f'<path d="{smoothd(run)}" fill="none" stroke="{color}" stroke-width="{f(b["r0"]*.32)}" opacity=".9"/>')


def clump_circles(c, shape, flat, rng):
    cx, cy, r = c["x"], c["y"], c["r"]
    out = []
    if shape == "pad":
        k = 8
        for i in range(k):
            t = -0.15 + (math.pi + .3) * (i + .5) / k
            out.append((cx + r * .74 * math.cos(t), cy + r * .5 * flat * math.sin(t), r * U(rng, .3, .42), math.sin(t)))
        out.append((cx, cy + r * .22 * flat, r * .52, 1))
    else:
        k = 7
        for i in range(k):
            t = math.pi * 2 * i / k + U(rng, -.2, .2)
            out.append((cx + r * .55 * math.cos(t), cy + r * .5 * flat * math.sin(t), r * U(rng, .38, .5), math.sin(t)))
        out.append((cx, cy + r * .1, r * .6, 1))
    return out


def draw_clump(G, c, sp, mode, glow, back=False):
    rng = random.Random(int(c["seed"] * 1e6))
    shape = sp.get("shape", "round")
    flat = sp.get("flat", .8)
    r = c["r"]
    if shape == "strand":
        shape = "round"
    circles = clump_circles(c, "pad" if shape == "pad" else "round", flat, rng)
    if mode == "night":
        sh, md, rim, gl = sp["night"]
        lt = md
    else:
        sh, md, lt, hl = sp["day"]
    if back:
        col = sp["back"] if mode != "night" else sp["nback"]
        if mode == "sil":
            col = "#2a1f3a"
        for (x, y, rr, s) in circles:
            G.append(f'<circle cx="{f(x)}" cy="{f(y - r*.06)}" r="{f(rr*1.08)}" fill="{col}"/>')
        if shape == "pad":
            G.append(f'<ellipse cx="{f(c["x"])}" cy="{f(c["y"] - r*.08)}" rx="{f(r*.98)}" ry="{f(r*.22)}" fill="{col}"/>')
        return
    if mode == "sil":
        for (x, y, rr, s) in circles:
            G.append(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rr)}" fill="#2a1f3a"/>')
        return
    # 1 shadow mass (and the flat underside of a pad, U237)
    for (x, y, rr, s) in circles:
        G.append(f'<circle cx="{f(x)}" cy="{f(y - r*.07)}" r="{f(rr)}" fill="{sh}"/>')
    if shape == "pad":
        G.append(f'<ellipse cx="{f(c["x"])}" cy="{f(c["y"] - r*.06)}" rx="{f(r*.95)}" ry="{f(r*.2)}" fill="{sh}"/>')
    # 2 mid tone, upper part
    for (x, y, rr, s) in circles:
        if s > -.2:
            G.append(f'<circle cx="{f(x - r*.03)}" cy="{f(y + r*.04)}" r="{f(rr*.86)}" fill="{md}"/>')
    if mode == "night":
        # moon/glow rim on the top edges + emissive specks
        for (x, y, rr, s) in circles:
            if s > .3:
                a0, a1 = math.radians(40), math.radians(150)
                p0 = (x + rr * .86 * math.cos(a0), y + r * .04 + rr * .86 * math.sin(a0))
                p1 = (x + rr * .86 * math.cos(a1), y + r * .04 + rr * .86 * math.sin(a1))
                G.append(f'<path d="M{f(p0[0])} {f(p0[1])} A{f(rr*.86)} {f(rr*.86)} 0 0 1 {f(p1[0])} {f(p1[1])}" fill="none" stroke="{rim}" stroke-width="{f(r*.05)}" opacity=".7"/>')
        nsp = sp.get("specks", 5)
        for _ in range(nsp):
            a = U(rng, 0, math.tau)
            d = r * math.sqrt(rng.random()) * .8
            glow.append((c["x"] + d * math.cos(a), c["y"] + d * math.sin(a) * flat, r * U(rng, .035, .07), rng.choice(sp["glow"])))
        if shape == "swirl":
            # hidden lantern pod inside the swirl (U288)
            glow.append((c["x"] + r * .1, c["y"] - r * .15, r * .16, "#ffd27a"))
        return
    # 3 lit tops (light from upper left)
    for (x, y, rr, s) in circles:
        if s > .25:
            G.append(f'<circle cx="{f(x - rr*.22)}" cy="{f(y + rr*.28)}" r="{f(rr*.55)}" fill="{lt}"/>')
    if mode == "lod1" or mode == "lod2":
        return
    # 4 leaf scallops on the lit rim + highlight dabs
    for (x, y, rr, s) in circles:
        if s > .3:
            for j in range(5):
                a = math.radians(70 + j * 22 + U(rng, -8, 8))
                px, py = x - rr * .22 + rr * .55 * math.cos(a), y + rr * .28 + rr * .55 * math.sin(a)
                G.append(f'<ellipse cx="{f(px)}" cy="{f(py)}" rx="{f(rr*.13)}" ry="{f(rr*.07)}" fill="{hl}" opacity=".85" transform="rotate({f(-math.degrees(a)+90)} {f(px)} {f(py)})"/>')
    if shape == "swirl":
        # swirl strokes (U288 swirl canopy)
        x, y = c["x"], c["y"] + r * .1
        G.append(f'<path d="M{f(x - r*.5)} {f(y)} a{f(r*.5)} {f(r*.4)} 0 1 1 {f(r*.6)} {f(r*.3)} a{f(r*.28)} {f(r*.22)} 0 1 0 {f(-r*.25)} {f(-r*.25)}" fill="none" stroke="{hl}" stroke-width="{f(r*.06)}" opacity=".8"/>')
    if shape == "puff":
        # blossom florets: white dots + a few darker gaps (U53, U01)
        for _ in range(14):
            a = U(rng, 0, math.tau)
            d = r * math.sqrt(rng.random()) * .75
            G.append(f'<circle cx="{f(c["x"] + d*math.cos(a))}" cy="{f(c["y"] + r*.1 + d*math.sin(a)*flat)}" r="{f(r*.05)}" fill="{hl}"/>')
        for _ in range(4):
            a = U(rng, math.pi * 1.1, math.pi * 1.9)
            d = r * U(rng, .3, .6)
            G.append(f'<circle cx="{f(c["x"] + d*math.cos(a))}" cy="{f(c["y"] + d*math.sin(a)*flat)}" r="{f(r*.08)}" fill="{sh}" opacity=".9"/>')


def draw_strands(G, c, sp, mode, glow, rng, ground=0.8):
    """Willow / weeping fronds (U101): beaded strands falling from the clump."""
    cols = sp["night"] if mode == "night" else sp["day"]
    r = c["r"]
    layers = [(cols[0], 14, .16), (cols[1], 12, .14), (cols[2] if mode != "night" else cols[1], 8, .12)]
    if mode == "lod1":
        layers = layers[:2]
    for li, (col, n, w) in enumerate(layers):
        for k in range(n):
            x0 = c["x"] + U(rng, -r, r)
            y0 = c["y"] + U(rng, -r * .2, r * .5)
            L = max(1.5, (y0 - ground) * U(rng, .55, .95))
            bend = U(rng, -.6, .6) + (x0 - c["x"]) * .15
            G.append(f'<path d="M{f(x0)} {f(y0)} q{f(bend)} {f(-L*.5)} {f(bend*1.6)} {f(-L)}" fill="none" stroke="{col}" stroke-width="{f(w*1.4)}" '
                     f'stroke-dasharray="{f(w*1.6)} {f(w*.7)}" opacity=".95"/>')
            if mode == "night" and li == 2 or (mode == "night" and rng.random() < .25):
                glow.append((x0 + bend * 1.6, y0 - L, .09, rng.choice(sp["glow"])))


# custom species ------------------------------------------------------------------------------------
def draw_fir(G, T_, mode, glow, rng):
    sp = T_["sp"]
    cols = sp["night"] if mode == "night" else sp["day"]
    sh, md = cols[0], cols[1]
    lt = cols[2] if mode != "night" else cols[1]
    if mode == "sil":
        sh = md = lt = "#2a1f3a"
    trunk = T_["B"][0]
    tiers = sorted([b for b in T_["B"] if b["o"] == 1], key=lambda b: b["pts"][0][1])
    H = sp["H"]
    for b in tiers:
        bx, by = b["pts"][0]
        tx, ty = b["pts"][-1]
        side = 1 if tx > bx else -1
        span = abs(tx - bx)
        drop = .55 + span * .5
        top = [(bx, by + .5 + span * .25)] + b["pts"][2:]
        botn = 7
        bot = []
        for k in range(botn + 1):
            t = k / botn
            x = tx + (bx - tx) * t
            y = ty - drop * (1 - t) * .5 - drop * .9 * math.sin(math.pi * t) * .5 + (by - drop) * t * 0 - t * drop * .6
            if k % 2 == 1:
                y -= .45
            bot.append((x, y))
        shape = top + bot
        G.append(f'<path d="{polyd(shape)}" fill="{sh}"/>')
        if mode in ("sil", "lod2"):
            continue
        # mid layer: upper two thirds
        mid = [(x, y - .12) for x, y in top] + [(x, y + drop * .35) for x, y in bot]
        G.append(f'<path d="{polyd(mid)}" fill="{md}"/>')
        if mode == "night":
            G.append(f'<path d="{smoothd(top)}" fill="none" stroke="{cols[2]}" stroke-width=".09" opacity=".75"/>')
            if rng.random() < .5:
                glow.append((tx, ty - .3, .1, cols[3]))
        elif side < 0 or rng.random() < .4:
            # needle-tuft highlights along the lit upper edge
            for (x, y) in top[1::2]:
                G.append(f'<path d="M{f(x)} {f(y)} l{f(-.35*side)} {f(-.25)} m{f(.35*side)} {f(.25)} l{f(.1)} {f(-.4)}" stroke="{lt}" stroke-width=".1" fill="none"/>')
    # tip leader
    x, y = trunk["pts"][-1]
    G.append(f'<path d="M{f(x - .5)} {f(y - 1.4)} L{f(x)} {f(y + .3)} L{f(x + .5)} {f(y - 1.4)} Z" fill="{md}"/>')


def cypress_outline(H, W, x0=0):
    L, R_ = [], []
    n = 22
    for i in range(n + 1):
        t = i / n
        w = W * (t ** .3) * ((1 - t) ** .55) * 1.25
        y = t * H
        L.append((x0 - w * (1 + .05 * math.sin(i * 2.1)), y))
        R_.append((x0 + w * (1 + .05 * math.cos(i * 1.7)), y))
    return L, R_


def draw_cypress(G, T_, mode, glow, rng):
    sp = T_["sp"]
    H = sp["H"]
    W = H * .12
    cols = sp["night"] if mode == "night" else sp["day"]
    sh, md, lt, hl = cols
    if mode == "sil":
        sh = md = "#2a1f3a"
    G.append(f'<rect x="-.25" y="0" width=".5" height="1.4" fill="{sp["bark"][0] if mode!="night" else sp["nbark"][0]}"/>')
    L, R_ = cypress_outline(H, W)
    G.append(f'<path d="{smoothd(L[::-1][:-1] + [(0, .7)] + R_[1:], close=True)}" fill="{sh}" transform="translate(0,.6)"/>')
    if mode in ("sil", "lod2"):
        return
    # flame tongues (U381, U395 columnar conifers)
    for k in range(60 if mode != "lod1" else 18):
        t = U(rng, .05, .95)
        w = W * (t ** .3) * ((1 - t) ** .55) * 1.25
        x = U(rng, -w * .9, w * .5)
        y = t * H + .6
        hgt = U(rng, .8, 1.6)
        col = md if x > -w * .3 else (lt if mode != "night" else md)
        G.append(f'<path d="M{f(x - .22)} {f(y)} Q{f(x - .1)} {f(y + hgt*.6)} {f(x + .05)} {f(y + hgt)} Q{f(x + .15)} {f(y + hgt*.4)} {f(x + .25)} {f(y)} Z" fill="{col}"/>')
    if mode == "night":
        Lr = [(x + .05, y + .6) for x, y in L]
        G.append(f'<path d="{smoothd(Lr)}" fill="none" stroke="{cols[2]}" stroke-width=".07" opacity=".6"/>')


def frond(G, x, y, phi, Lf, droop, col, w, rng, mode, flip=1):
    pts = []
    n = 14
    for i in range(n + 1):
        t = i / n
        px = x + math.sin(phi) * Lf * t
        py = y + math.cos(phi) * Lf * t - droop * Lf * t * t
        pts.append((px, py))
    G.append(f'<path d="{smoothd(pts)}" fill="none" stroke="{col}" stroke-width="{f(w)}"/>')
    if mode in ("lod2", "sil"):
        G.append(f'<path d="{smoothd(pts)}" fill="none" stroke="{col}" stroke-width="{f(w*7)}" opacity=".9"/>')
        return
    for i in range(2, n + 1):
        px, py = pts[i]
        qx, qy = pts[i - 1]
        a = math.atan2(px - qx, py - qy)
        ll = Lf * .2 * (1 - (i / n) ** 2) + .15
        for s in (-1, 1):
            b = a + s * 1.0 + .35 * (1 if math.sin(a) > 0 else -1) * 0
            ex = px + math.sin(b) * ll
            ey = py + math.cos(b) * ll - ll * .55
            G.append(f'<path d="M{f(px)} {f(py)} Q{f((px+ex)/2)} {f((py+ey)/2 + ll*.2)} {f(ex)} {f(ey)}" fill="none" stroke="{col}" stroke-width="{f(w*1.2)}"/>')


def draw_palm(G, T_, mode, glow, rng):
    sp = T_["sp"]
    cols = sp["night"] if mode == "night" else sp["day"]
    b = T_["B"][0]
    # ring scars on the trunk (U121, U182)
    if mode not in ("sil", "lod2"):
        Lft, Rgt, rad = branch_edges(b, sp.get("flare", 0))
        bk = sp["nbark"] if mode == "night" else sp["bark"]
        for i in range(len(Lft)):
            pass
        pts = b["pts"]
        n = len(pts) - 1
        for k in range(1, 34):
            t = k / 34
            i = min(n - 1, int(t * n))
            fr = t * n - i
            x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * fr
            y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * fr
            a = b["angs"][i]
            r = b["r0"] + (b["r1"] - b["r0"]) * t
            G.append(f'<path d="M{f(x - math.cos(a)*r)} {f(y + math.sin(a)*r)} Q{f(x)} {f(y - .12)} {f(x + math.cos(a)*r)} {f(y - math.sin(a)*r)}" fill="none" stroke="{bk[0]}" stroke-width=".05"/>')
    x, y = b["pts"][-1]
    sh, md, lt = cols[0], cols[1], cols[2] if mode != "night" else cols[1]
    if mode == "sil":
        sh = md = lt = "#2a1f3a"
    Lf = sp["H"] * .38
    fr_ = [(-2.3, .55, sh), (2.2, .55, sh), (-1.7, .5, sh), (1.75, .5, sh), (-.6, .25, md), (.5, .25, md),
           (-1.2, .42, md), (1.25, .42, md), (-2.6, .6, md), (2.65, .6, md), (0, .15, lt), (-.9, .35, lt), (.95, .35, lt)]
    # coconuts / dates under the crown
    for k in range(4):
        G.append(f'<circle cx="{f(x + (k-1.5)*.22)}" cy="{f(y - .35 - (k%2)*.15)}" r=".17" fill="{"#7a5a30" if mode!="night" else "#2a2030"}"/>')
    for phi, dr, col in fr_:
        frond(G, x, y, phi, Lf * U(rng, .85, 1.1), dr, col, .07, rng, mode)
    if mode == "night":
        glow.append((x, y - .5, .25, "#ffd27a"))


def draw_tree(G, T_, mode, glow, ground_y=0, lod_keep=1.0):
    sp = T_["sp"]
    rng = random.Random(7)
    flare = sp.get("flare", 0)
    bark = sp["nbark"] if mode == "night" else sp["bark"]
    if mode == "sil":
        bark = ("#2a1f3a",) * 3
    cust = sp.get("custom")
    # back roots
    for r in T_["R"]:
        if not r["front"]:
            draw_branch(G, r, (bark[0], bark[0], bark[1]), 0, mode, sp, rng)
    shape = sp.get("shape")
    CL = T_["CL"]
    if mode == "lod1":
        CL = [c for i, c in enumerate(CL) if i % 2 == 0]
        CL = [dict(c, r=c["r"] * 1.3) for c in CL]
    if mode == "lod2":
        CL = merge_clumps(T_["CL"], 5)
    if shape in ("pad", "round", "puff", "swirl") and not cust:
        for c in CL:
            draw_clump(G, c, sp, mode, glow, back=True)
    maxo = 1 if mode in ("lod1",) else (0 if mode == "lod2" else 9)
    Bs = sorted([b for b in T_["B"] if b["o"] <= maxo], key=lambda b: b["o"])
    if cust in ("cypress",):
        pass
    elif cust == "fir":
        draw_branch(G, Bs[0], bark, flare, mode, sp, rng)
    else:
        for b in Bs:
            draw_branch(G, b, bark, flare, mode, sp, rng)
            if sp.get("moss") and b["o"] <= 2 and mode in ("day", "night"):
                draw_moss(G, b, sp["moss"] if mode != "night" else sp["nmoss"], flare)
    for r in T_["R"]:
        if r["front"]:
            draw_branch(G, r, bark, 0, mode, sp, rng)
            if sp.get("moss") and mode in ("day", "night"):
                draw_moss(G, r, sp["moss"] if mode != "night" else sp["nmoss"], 0)
    if cust == "fir":
        draw_fir(G, T_, mode, glow, rng)
        return
    if cust == "cypress":
        draw_cypress(G, T_, mode, glow, rng)
        return
    if cust == "palm":
        draw_palm(G, T_, mode, glow, rng)
        return
    if shape == "strand":
        for c in CL:
            draw_clump(G, dict(c, r=c["r"] * .8), dict(sp, shape="round"), mode, glow, back=True)
        for c in sorted(CL, key=lambda c: -c["y"]):
            draw_clump(G, dict(c, r=c["r"] * .75), dict(sp, shape="round"), mode, glow)
        if mode != "lod2":
            for c in CL:
                draw_strands(G, c, sp, mode, glow, random.Random(int(c["seed"] * 1e5)))
        return
    for c in sorted(CL, key=lambda c: -c["y"]):
        draw_clump(G, c, sp, mode, glow)


def merge_clumps(CL, n):
    s = sorted(CL, key=lambda c: c["x"])
    k = max(1, len(s) // n)
    out = []
    for i in range(0, len(s), k):
        g = s[i:i + k]
        cx = sum(c["x"] for c in g) / len(g)
        cy = sum(c["y"] for c in g) / len(g)
        r = max(math.hypot(c["x"] - cx, c["y"] - cy) * .7 + c["r"] for c in g)
        out.append(dict(x=cx, y=cy, r=r * .85, seed=g[0]["seed"]))
    return out


def tree_extras(G, T_, mode, glow, which):
    """Species-specific dressing: hanging moss, lanterns, shelf fungi, root arch, petal lights..."""
    sp = T_["sp"]
    rng = random.Random(11)
    H = sp["H"]
    if which in ("giant", "mother"):
        limbs = [b for b in T_["B"] if b["o"] in (1, 2)]
        # hanging moss curtains (U99, U02) and chain lanterns (U108)
        for b in limbs:
            for _ in range(2 if which == "giant" else 1):
                i = rng.randint(3, len(b["pts"]) - 2)
                x, y = b["pts"][i]
                L = U(rng, H * .04, H * .1)
                col = (sp["moss"] if mode != "night" else sp["nmoss"]) if which == "giant" else ("#8f5a7a" if mode != "night" else "#5a2a50")
                G.append(f'<path d="M{f(x)} {f(y)} q{f(U(rng,-1,1))} {f(-L*.5)} {f(U(rng,-1.5,1.5))} {f(-L)}" fill="none" stroke="{col}" stroke-width="{f(H*.004)}" stroke-dasharray="{f(H*.006)} {f(H*.003)}" opacity=".85"/>')
                if mode == "night" and rng.random() < .5:
                    glow.append((x, y - L, H * .002, sp["glow"][0]))
        for b in rng.sample(limbs, min(len(limbs), 7 if which == "mother" else 5)):
            i = rng.randint(4, len(b["pts"]) - 1)
            x, y = b["pts"][i]
            L = U(rng, H * .05, H * .14)
            G.append(f'<line x1="{f(x)}" y1="{f(y)}" x2="{f(x)}" y2="{f(y - L)}" stroke="{"#3a2a30" if mode!="night" else "#8a7060"}" stroke-width="{f(H*.0015)}"/>')
            lw = H * .008
            G.append(f'<path d="M{f(x - lw)} {f(y - L)} L{f(x + lw)} {f(y - L)} L{f(x + lw*.8)} {f(y - L - lw*2.2)} L{f(x - lw*.8)} {f(y - L - lw*2.2)} Z" fill="{"#c88a3a" if mode!="night" else "#ffd27a"}"/>')
            G.append(f'<path d="M{f(x - lw*1.3)} {f(y - L)} L{f(x)} {f(y - L + lw*1.2)} L{f(x + lw*1.3)} {f(y - L)} Z" fill="{"#6e2a5a"}"/>')
            if mode == "night":
                glow.append((x, y - L - lw, lw * 1.8, "#ffd27a"))
    if which == "giant":
        tr = T_["B"][0]
        # shelf fungus tiers on the trunk (U39, U70) with glowing undersides at night
        for k in range(6):
            t = .12 + k * .09
            i = int(t * (len(tr["pts"]) - 1))
            x, y = tr["pts"][i]
            r = tr["r0"] + (tr["r1"] - tr["r0"]) * t
            side = -1 if k % 2 else 1
            x += side * r * .85
            w = H * U(rng, .02, .032)
            G.append(f'<path d="M{f(x)} {f(y)} q{f(side*w)} {f(w*.5)} {f(side*w*1.6)} {f(-w*.1)} q{f(-side*w*.7)} {f(-w*.3)} {f(-side*w*1.6)} {f(w*.1)} Z" fill="{"#e8c8a0" if mode!="night" else "#3a3048"}"/>')
            if mode == "night":
                G.append(f'<path d="M{f(x)} {f(y - w*.05)} q{f(side*w*.9)} {f(-w*.22)} {f(side*w*1.55)} {f(-w*.12)}" stroke="#7ff5e6" stroke-width="{f(w*.12)}" fill="none"/>')
                glow.append((x + side * w * .8, y - w * .2, w * .5, "#4fe0cf"))
        # root-arch doorway between the front roots (U29, U241, U108): glowing teal cave
        aw, ah = tr["r0"] * 1.15, tr["r0"] * 2.0
        d = f'M{f(-aw/2)} 0 L{f(-aw/2)} {f(ah*.55)} Q{f(-aw/2)} {f(ah)} 0 {f(ah)} Q{f(aw/2)} {f(ah)} {f(aw/2)} {f(ah*.55)} L{f(aw/2)} 0 Z'
        G.append(f'<path d="{d}" fill="{"#1c3a40" if mode!="night" else "#0c4a50"}"/>')
        G.append(f'<path d="{d}" fill="none" stroke="{"#c9c4bc" if mode!="night" else "#4fe0cf"}" stroke-width="{f(aw*.06)}" opacity=".8"/>')
        if mode == "night":
            glow.append((0, ah * .35, aw * .45, "#4fe0cf"))
            glow.append((0, ah * .2, aw * .2, "#b7ffcf"))
        # glow mushrooms at the root feet
        for k in range(10):
            x = U(rng, -tr["r0"] * 3, tr["r0"] * 3)
            h = U(rng, .5, 1.6)
            G.append(f'<rect x="{f(x - .1)}" y="0" width=".2" height="{f(h)}" fill="#e8dcd0"/>')
            G.append(f'<ellipse cx="{f(x)}" cy="{f(h)}" rx="{f(h*.45)}" ry="{f(h*.22)}" fill="{"#d0507a" if mode!="night" else "#7ff5e6"}"/>')
            if mode == "night":
                glow.append((x, h - .1, h * .5, "#7ff5e6"))
    if which == "mother":
        if mode == "night":
            # canopy underside glow (petal lights, magenta haze)
            for c in T_["CL"]:
                if rng.random() < .6:
                    glow.append((c["x"], c["y"] - c["r"] * .3, c["r"] * .35, "#ff5fb0"))
        # carved arch window in the trunk (U241 tree-temple trunk)
        tr = T_["B"][0]
        x, y = tr["pts"][4]
        aw, ah = tr["r0"] * .5, tr["r0"] * .9
        d = f'M{f(x - aw/2)} {f(y)} L{f(x - aw/2)} {f(y + ah*.6)} Q{f(x - aw/2)} {f(y + ah)} {f(x)} {f(y + ah*1.05)} Q{f(x + aw/2)} {f(y + ah)} {f(x + aw/2)} {f(y + ah*.6)} L{f(x + aw/2)} {f(y)} Z'
        G.append(f'<path d="{d}" fill="{"#2a1830" if mode!="night" else "#ffb35a"}" stroke="{"#e6b450"}" stroke-width=".5"/>')
        if mode == "night":
            glow.append((x, y + ah * .5, aw * .7, "#ffd27a"))


def ground_mother(G, mode, ext):
    """Rock island + lake + gabled hall under the Mother Tree (U237)."""
    rock = "#4a3a44" if mode != "night" else "#1a1424"
    rock_l = "#7a6470" if mode != "night" else "#3a2c48"
    pts = [(-62, -20), (-50, -10), (-40, -6), (-30, -1), (-14, 1), (0, .5), (16, 1), (30, -2), (44, -7), (56, -12), (66, -20)]
    G.append(f'<path d="{smoothd(pts)} Z" fill="{rock}"/>')
    pts2 = [(-50, -10), (-40, -6), (-30, -1), (-14, 1), (-5, .3), (-14, -4), (-34, -9)]
    G.append(f'<path d="{smoothd(pts2, close=True)}" fill="{rock_l}" opacity=".8"/>')
    # gabled hall to the right under the canopy
    hx = 20
    wall = "#d8b090" if mode != "night" else "#3a2a3a"
    G.append(f'<rect x="{hx}" y="-.5" width="30" height="9" fill="{wall}"/>')
    for k in range(4):
        gx = hx + 2 + k * 7.5
        G.append(f'<path d="M{gx - 1} 8.5 L{gx + 3} 15.5 L{gx + 7} 8.5 Z" fill="{"#7a3a4a" if mode!="night" else "#2a1430"}"/>')
        G.append(f'<rect x="{gx + 1.8}" y="2" width="2.4" height="4" rx="1.2" fill="{"#e8b060" if mode!="night" else "#ffd27a"}"/>')
    # water
    wcol = "#3a5a6a" if mode != "night" else "#0a1830"
    G.append(f'<rect x="{ext[0] - 30}" y="-40" width="{ext[1] - ext[0] + 60}" height="20" fill="{wcol}"/>')
    for k in range(10):
        G.append(f'<line x1="{-50 + k*11}" y1="{-22 - (k%3)*4}" x2="{-44 + k*11}" y2="{-22 - (k%3)*4}" stroke="{"#9ac0c8" if mode!="night" else "#ff7fd0"}" stroke-width=".4" opacity=".6"/>')


# ----------------------------------------------------------------------------------------------
# panels
# ----------------------------------------------------------------------------------------------
def place(trees, gap=2.0):
    """Lay several grown trees side by side; returns list of (tree, dx) and extents."""
    out, x = [], 0
    for t in trees:
        x0, x1, H = t["ext"]
        dx = x - x0
        out.append((t, dx))
        x += (x1 - x0) + gap
    xmin = 0
    xmax = x - gap
    H = max(t["ext"][2] for t in trees)
    return out, (xmin, xmax, H)


def render_group(trees, box, mode, which=None, below=0, pad=18, figure_at=None, extra=None, k_force=None):
    x, y, w, h = box
    gap = max(t["ext"][2] for t in trees) * .08
    lay, (x0, x1, H) = place(trees, gap)
    k = min((w - 2 * pad) / (x1 - x0), (h - 2 * pad - 14) / (H + below))
    if k_force:
        k = k_force
    gx = x + w / 2 - (x0 + x1) / 2 * k
    gy = y + h - pad - below * k
    G, glow = [], []
    if extra == "mother":
        ground_mother(G, mode, (x0, x1))
    for t, dx in lay:
        G.append(f'<g transform="translate({f(dx)},0)">')
        draw_tree(G, t, mode, glow)
        if which:
            gl2 = []
            tree_extras(G, t, mode, gl2, which)
            glow += [(a + dx, b, c, d) for a, b, c, d in gl2]
        G.append("</g>")
    glow = [(a + (lay[0][1] if False else 0), b, c, d) for a, b, c, d in glow]
    # glow layer (blurred halo + crisp core)
    if glow:
        std = max(H * .004, .06)
        fid = C.D.glow(round(std, 3))
        G.append(f'<g filter="url(#{fid})">' + "".join(f'<circle cx="{f(a)}" cy="{f(b)}" r="{f(c*2.6)}" fill="{d}" opacity=".85"/>' for a, b, c, d in glow) + "</g>")
        G.append("".join(f'<circle cx="{f(a)}" cy="{f(b)}" r="{f(c*.6)}" fill="#fffaf0" opacity=".9"/>' for a, b, c, d in glow))
    A(f'<g transform="translate({f(gx)},{f(gy)}) scale({f(k)},{f(-k)})">' + "".join(G) + "</g>")
    return k, gx, gy, lay


def day_panel(row, box):
    x, y, w, h = box
    panel(x, y, w, h, "Elevation — day / silhouette read", "day")
    trees = row["trees"]
    below = row.get("below", 0)
    k, gx, gy, lay = render_group(trees, (x, y + 26, w, h - 26), "day", row.get("which"), below, extra=row.get("which"))
    # ground line + figure + scale
    ln(x + 8, gy, x + w - 8, gy, "#8a6a70", 1.5)
    fh = 1.7 * k
    fx = x + w - 30
    figure(fx, gy, max(fh, 2), "#2a1f3a")
    if fh < 8:
        T(fx, gy - max(fh, 2) - 4, "1.7 m", 11, "#5a3c55", "middle")
    H = max(t["ext"][2] for t in trees)
    step = 10 if H > 40 else (5 if H > 12 else 2)
    # height ruler
    rx = x + 14
    ln(rx, gy, rx, gy - H * k, "#8a6a70", 1)
    for hh in range(0, int(H) + 1, step):
        ln(rx, gy - hh * k, rx + 6, gy - hh * k, "#8a6a70", 1)
        if hh % (step * 2) == 0 or H < 20:
            T(rx + 9, gy - hh * k + 4, f"{hh}", 11, "#6a4a5a")
    T(rx + 9, gy - H * k - 6, f"{H:g} m", 12, "#5a2c4a", weight="bold")
    return k


def night_panel(row, box):
    x, y, w, h = box
    panel(x, y, w, h, "Night glow version", "night")
    below = row.get("below", 0)
    k, gx, gy, lay = render_group(row["trees"], (x, y + 26, w, h - 26), "night", row.get("which"), below, extra=row.get("which"))
    # ground glow + fireflies
    rng = random.Random(len(row["name"]))
    gcol = row.get("nground", "#4fe0cf")
    fid = C.D.glow(6)
    A(f'<ellipse cx="{f(x + w/2)}" cy="{f(gy)}" rx="{f(w*.38)}" ry="10" fill="{gcol}" opacity=".35" filter="url(#{fid})"/>')
    ln(x + 8, gy, x + w - 8, gy, "#3a3060", 1.2)
    fid2 = C.D.glow(1.5)
    for _ in range(18):
        fx, fy = U(rng, x + 12, x + w - 12), U(rng, y + 40, gy - 4)
        circ(fx, fy, 2.2, rng.choice(["#ffe08a", "#7ff5e6", "#ffb3e0"]), op=.9, extra=f'filter="url(#{fid2})"')
        circ(fx, fy, .8, "#ffffff")


def skel_panel(row, box):
    x, y, w, h = box
    panel(x, y, w, h, "Branch structure + silhouette", "card")
    t = row["trees"][0]
    sp = t["sp"]
    # silhouette thumbnail (top-right)
    sw_, sh_ = w * .4, h * .3
    render_group([t], (x + w - sw_ - 6, y + 28, sw_, sh_), "sil", pad=4)
    # skeleton
    x0, x1, H = t["ext"]
    bx, by, bw, bh = x + 8, y + 30 + sh_ * .4, w - 16, h - 60 - sh_ * .4
    k = min((bw - 10) / (x1 - x0), (bh - 10) / H)
    gx = bx + bw / 2 - (x0 + x1) / 2 * k
    gy = by + bh
    oc = ["#e6b450", "#ff8cb8", "#5fc8c0", "#b49ac8"]
    G = []
    for b in t["R"]:
        G.append(f'<path d="{smoothd(b["pts"])}" fill="none" stroke="#a8782a" stroke-width="{f(max(b["r0"]*.9, 1.4/k))}" stroke-dasharray="{f(3/k)} {f(2/k)}"/>')
    for b in sorted(t["B"], key=lambda b: b["o"]):
        G.append(f'<path d="{smoothd(b["pts"])}" fill="none" stroke="{oc[min(b["o"],3)]}" stroke-width="{f(max(b["r0"]*1.2, 1.2/k))}"/>')
    for c in t["CL"]:
        G.append(f'<circle cx="{f(c["x"])}" cy="{f(c["y"])}" r="{f(c["r"]*.75)}" fill="none" stroke="#9ab0a0" stroke-width="{f(.9/k)}" stroke-dasharray="{f(2/k)} {f(2/k)}" opacity=".7"/>')
        G.append(f'<circle cx="{f(c["x"])}" cy="{f(c["y"])}" r="{f(1.6/k)}" fill="#cfe8c0"/>')
    A(f'<g transform="translate({f(gx)},{f(gy)}) scale({f(k)},{f(-k)})">' + "".join(G) + "</g>")
    # legend
    ly = y + h - 12
    labels = ["trunk", "limb", "branch", "twig"]
    for i in range(min(sp["max_o"] + 1, 4)):
        lx = x + 10 + i * (w - 20) / 4
        ln(lx, ly - 4, lx + 14, ly - 4, oc[i], 4)
        T(lx + 18, ly, labels[i], 11, INK2)
    T(x + w - 8, y + 28 + sh_ + 14, f"{len(t['CL'])} clump anchors", 11, "#cfe8c0", "end")


# ---- leaf-clump detail callouts (px) -------------------------------------------------------------
def leaf(cx, cy, L, W, rot, fill, vein, op=1):
    A(f'<g transform="translate({f(cx)},{f(cy)}) rotate({f(rot)})" opacity="{op}">'
      f'<path d="M0 0 Q{f(W)} {f(-L*.45)} 0 {f(-L)} Q{f(-W)} {f(-L*.45)} 0 0 Z" fill="{fill}"/>'
      f'<path d="M0 0 L0 {f(-L*.92)}" stroke="{vein}" stroke-width="1"/></g>')


def maple_leaf(cx, cy, s, rot, fill, vein):
    pts = []
    for i in range(10):
        a = math.pi / 2 + i * math.pi / 5 * 1.0
        rr = s if i % 2 == 0 else s * .45
        pts.append((cx + rr * math.cos(a + math.radians(rot)), cy - rr * math.sin(a + math.radians(rot))))
    A(f'<path d="{polyd(pts)}" fill="{fill}"/>')
    for i in range(0, 10, 2):
        a = math.pi / 2 + i * math.pi / 5 + math.radians(rot)
        ln(cx, cy, cx + s * .8 * math.cos(a), cy - s * .8 * math.sin(a), vein, 1)


def blossom(cx, cy, s, fill, centre, op=1):
    for i in range(5):
        a = math.radians(i * 72 - 90)
        px, py = cx + s * .55 * math.cos(a), cy + s * .55 * math.sin(a)
        A(f'<g transform="translate({f(px)},{f(py)}) rotate({f(math.degrees(a)+90)})" opacity="{op}"><path d="M0 {f(s*.5)} Q{f(s*.5)} 0 {f(s*.18)} {f(-s*.5)} L0 {f(-s*.32)} L{f(-s*.18)} {f(-s*.5)} Q{f(-s*.5)} 0 0 {f(s*.5)} Z" fill="{fill}"/></g>')
    circ(cx, cy, s * .18, centre)


def leaf_callout(kind, sp, box):
    x, y, w, h = box
    panel(x, y, w, h, "Leaf clump + alpha card", "card")
    R = min(w * .44, h * .3)
    cx, cy = x + w / 2, y + 34 + R
    cid = C.D.clip_circle(cx, cy, R)
    sh, md, lt, hl = sp["day"]
    rng = random.Random(hash(kind) % 1000)
    A(f'<g clip-path="url(#{cid})">')
    rect(cx - R, cy - R, 2 * R, 2 * R, sp["back"])
    if kind in ("broad", "pad", "magenta", "round"):
        for layer, col in enumerate([sh, md, lt]):
            for _ in range(26):
                a = U(rng, 0, 360)
                px, py = cx + U(rng, -R, R), cy + U(rng, -R, R) - layer * 6
                Lh = R * U(rng, .28, .4) * (1.15 if kind == "magenta" else 1)
                leaf(px, py, Lh, Lh * (.5 if kind != "pad" else .42), a, col, sh if layer else md)
        if kind == "magenta":
            for _ in range(10):
                circ(cx + U(rng, -R, R), cy + U(rng, -R, R), 3, "#ffd27a")
    elif kind == "blossom":
        for _ in range(9):
            px, py = cx + U(rng, -R, R), cy + U(rng, -R, R)
            ln(px - 30, py + 20, px, py, "#5e4248", 3)
            leaf(px - 12, py + 6, 18, 8, U(rng, 180, 260), "#7aa060", "#4a7040")
        for layer, col in enumerate([sh, md, lt, hl]):
            for _ in range(12):
                blossom(cx + U(rng, -R, R), cy + U(rng, -R, R), R * U(rng, .14, .2), col, "#c0305a" if layer < 3 else "#e6b450")
    elif kind == "maple":
        for layer, col in enumerate([sh, md, lt]):
            for _ in range(20):
                maple_leaf(cx + U(rng, -R, R), cy + U(rng, -R, R), R * U(rng, .14, .22), U(rng, -40, 40), col, sh)
    elif kind == "needle":
        for _ in range(9):
            px, py = cx + U(rng, -R, R * .8), cy + U(rng, -R * .8, R)
            a = U(rng, -.6, .2)
            ex, ey = px + R * .9 * math.cos(a), py + R * .9 * math.sin(a)
            ln(px, py, ex, ey, "#5a3a2a", 3)
            for j in range(16):
                t = j / 16
                qx, qy = px + (ex - px) * t, py + (ey - py) * t
                for s in (-1, 1):
                    col = rng.choice([md, lt, sh])
                    ln(qx, qy, qx + 14 * math.cos(a + s * 1.0), qy + 14 * math.sin(a + s * 1.0) + 4, col, 1.6)
    elif kind == "willow":
        for _ in range(14):
            px = cx + U(rng, -R, R)
            ln(px, cy - R, px + U(rng, -8, 8), cy + R, "#6a7a4a", 1.4)
            for j in range(9):
                qy = cy - R + j * R * .24
                for s in (-1, 1):
                    leaf(px + s * 2, qy, R * .2, 3.5, 180 + s * 25, rng.choice([md, lt, sh]), sh)
    elif kind == "palm":
        ln(cx - R, cy + R * .3, cx + R, cy - R * .2, "#8a6a3a", 4)
        for j in range(22):
            t = j / 22
            px, py = cx - R + 2 * R * t, cy + R * .3 - R * .5 * t
            for s in (-1, 1):
                leaf(px, py, R * .55, 5, 90 + s * 55 + (180 if s < 0 else 0), rng.choice([md, lt]), sh)
    elif kind == "swirl":
        for layer, col in enumerate([sh, md, lt]):
            for _ in range(18):
                px, py = cx + U(rng, -R, R), cy + U(rng, -R, R)
                Lh = R * U(rng, .3, .42)
                A(f'<g transform="translate({f(px)},{f(py)}) rotate({f(U(rng,0,360))})"><path d="M0 0 C{f(Lh*.6)} {f(-Lh*.2)} {f(Lh*.6)} {f(-Lh)} 0 {f(-Lh*.75)} C{f(-Lh*.6)} {f(-Lh)} {f(-Lh*.6)} {f(-Lh*.2)} 0 0 Z" fill="{col}"/>'
                  f'<path d="M0 0 L0 {f(-Lh*.7)}" stroke="#5ff0e0" stroke-width="1.6" opacity=".9"/></g>')
        circ(cx + R * .2, cy + R * .1, R * .16, "#ffd27a")
        circ(cx + R * .2, cy + R * .1, R * .08, "#fff4d0")
    elif kind == "clipped":
        for _ in range(240):
            px, py = cx + U(rng, -R, R), cy + U(rng, -R, R)
            col = lt if (px - cx) + (py - cy) < -R * .3 else (md if (px - cx) + (py - cy) < R * .5 else sh)
            leaf(px, py, 9, 4, U(rng, 0, 360), col, sh)
        for _ in range(14):
            blossom(cx + U(rng, -R, R), cy + U(rng, -R, R), 7, "#ff8cb8", "#e6b450")
    A("</g>")
    circ(cx, cy, R, "none", GOLD, 2)
    # alpha card (checkerboard = transparent) showing one clump card of the atlas
    cw = min(w * .42, h * .26)
    ax, ay = x + 12, cy + R + 16
    rect(ax, ay, cw, cw, C.D.checker(), "#8a7a90", 1)
    rng2 = random.Random(3)
    for _ in range(26):
        a = U(rng2, 0, math.tau)
        d = cw * .36 * math.sqrt(rng2.random())
        if kind == "blossom":
            blossom(ax + cw / 2 + d * math.cos(a), ay + cw / 2 + d * math.sin(a), cw * .09, rng2.choice([md, lt, hl]), "#c0305a")
        elif kind == "needle":
            ln(ax + cw / 2, ay + cw / 2, ax + cw / 2 + d * math.cos(a), ay + cw / 2 + d * math.sin(a), rng2.choice([md, lt]), 2)
        else:
            leaf(ax + cw / 2 + d * math.cos(a), ay + cw / 2 + d * math.sin(a), cw * .2, cw * .08, math.degrees(a) + 90, rng2.choice([sh, md, lt]), sh)
    rect(ax, ay, cw, cw, "none", GOLD, 1.2, extra='stroke-dasharray="5 3"')
    T(ax + cw / 2, ay + cw + 14, "alpha card 512²", 11, INK2, "middle")
    # card cluster diagram: three crossed quads
    qx, qy = ax + cw + 18 + (w - cw - 30) / 2, ay + cw / 2
    s = (w - cw - 40) / 2.2
    for i, ang in enumerate([0, 60, 120]):
        a = math.radians(ang)
        dx, dy = s * math.cos(a), s * .35 * math.sin(a)
        A(f'<path d="M{f(qx - dx)} {f(qy - dy - s*.55)} L{f(qx + dx)} {f(qy + dy - s*.55)} L{f(qx + dx)} {f(qy + dy + s*.55)} L{f(qx - dx)} {f(qy - dy + s*.55)} Z" '
          f'fill="{[sh, md, lt][i]}" opacity=".55" stroke="{GOLD}" stroke-width="1"/>')
    T(qx, ay + cw + 14, "3 crossed cards", 11, INK2, "middle")
    T(qx, ay + cw + 27, "= 1 clump", 11, INK2, "middle")


# ---- bark close-ups (px) -------------------------------------------------------------------------
def bark_swatch(kind, sp, box):
    x, y, w, h = box
    panel(x, y, w, h, "Bark close-up", "card")
    bx, by, bw, bh = x + 10, y + 30, w - 20, h - 40
    cid = C.D.clip_rect(bx, by, bw, bh, 4)
    dk, md, lt = sp["bark"]
    rng = random.Random(hash(kind) % 997)
    A(f'<g clip-path="url(#{cid})">')
    rect(bx, by, bw, bh, md)
    if kind in ("fluted", "mother"):
        # interlaced rope strands (U241, U29) with grooves
        n = 7
        for i in range(n):
            pts = []
            for j in range(13):
                t = j / 12
                xx = bx + bw * (i + .5) / n + math.sin(t * 5 + i * 1.7) * bw * .06
                pts.append((xx, by + bh * t))
            pth(smoothd(pts), "none", dk, bw / n * .9)
            pth(smoothd(pts), "none", md, bw / n * .62)
            pth(smoothd([(px - bw / n * .14, py) for px, py in pts]), "none", lt, bw / n * .16, .8)
        if kind == "fluted":
            # moss patch on top-facing ridges and glowing lichen dots
            for _ in range(5):
                ell(bx + U(rng, 0, bw), by + U(rng, 0, bh * .7), U(rng, 10, 22), U(rng, 4, 8), sp["moss"], op=.9)
            for _ in range(16):
                circ(bx + U(rng, 0, bw), by + U(rng, 0, bh), 2.2, "#7ff5e6")
        else:
            for _ in range(10):
                circ(bx + U(rng, 0, bw), by + U(rng, 0, bh), 2.5, "#ff9fd0")
            # carved arch niche (U241)
            nx, ny = bx + bw * .5, by + bh * .62
            pth(f"M{nx-16} {ny+30} L{nx-16} {ny} Q{nx-16} {ny-22} {nx} {ny-26} Q{nx+16} {ny-22} {nx+16} {ny} L{nx+16} {ny+30} Z", "#2a1830", GOLD, 2)
    elif kind == "smooth":
        for i in range(9):
            pts = [(bx + bw * (i + .5) / 9 + math.sin(j * .9 + i) * 4, by + bh * j / 8) for j in range(9)]
            pth(smoothd(pts), "none", dk, 1.5, .5)
            pth(smoothd([(a + 3, b) for a, b in pts]), "none", lt, 1, .5)
        for _ in range(4):
            ell(bx + U(rng, 0, bw), by + U(rng, 0, bh), 14, 6, sp.get("moss", "#8fb04a"), op=.7)
    elif kind == "birch":
        rect(bx, by, bw, bh, lt)
        for _ in range(26):
            rect(bx + U(rng, -10, bw), by + U(rng, 0, bh), U(rng, 10, 40), U(rng, 2, 5), "#2a2228", op=.9)
        for _ in range(3):
            xx, yy = bx + U(rng, 0, bw), by + U(rng, 0, bh)
            pth(f"M{xx-10} {yy} Q{xx} {yy-10} {xx+10} {yy} Q{xx} {yy+6} {xx-10} {yy} Z", "#2a2228")
    elif kind == "sakura":
        rect(bx, by, bw, bh, dk)
        for _ in range(30):
            rect(bx + U(rng, -5, bw), by + U(rng, 0, bh), U(rng, 8, 20), 2.5, lt, op=.7)
        for i in range(4):
            pts = [(bx + bw * (i + .5) / 4 + math.sin(j * .7 + i) * 8, by + bh * j / 8) for j in range(9)]
            pth(smoothd(pts), "none", md, 3, .7)
    elif kind == "plated":
        for row_ in range(9):
            yy = by + row_ * bh / 8
            xx = bx - U(rng, 0, 20)
            while xx < bx + bw:
                pw = U(rng, 14, 30)
                rect(xx + 1.5, yy + 1.5, pw - 3, bh / 8 - 3, rng.choice([md, lt]), dk, 1.5, 3)
                xx += pw
    elif kind == "palm":
        rect(bx, by, bw, bh, md)
        for row_ in range(12):
            yy = by + row_ * bh / 11
            for k in range(6):
                xx = bx + k * bw / 5 + (row_ % 2) * bw / 10
                pth(f"M{xx-14} {yy} L{xx} {yy-8} L{xx+14} {yy} L{xx} {yy+8} Z", lt, dk, 1.2)
    elif kind == "biolum":
        rect(bx, by, bw, bh, dk)
        for i in range(6):
            pts = [(bx + bw * (i + .5) / 6 + math.sin(j * .8 + i * 2) * 10, by + bh * j / 10) for j in range(11)]
            pth(smoothd(pts), "none", md, 6)
            pth(smoothd(pts), "none", "#5ff0e0", 1.6, .9)
    elif kind == "willow":
        for i in range(12):
            pts = [(bx + bw * i / 11 + math.sin(j * 1.3 + i) * 6, by + bh * j / 10) for j in range(11)]
            pth(smoothd(pts), "none", dk, 4)
            pth(smoothd([(a + 3, b) for a, b in pts]), "none", lt, 1.4, .7)
    elif kind == "clipped":
        for _ in range(300):
            leaf(bx + U(rng, 0, bw), by + U(rng, 0, bh), 8, 3.5, U(rng, 0, 360), rng.choice(sp["day"][:3]), sp["day"][0])
    A("</g>")
    rect(bx, by, bw, bh, "none", "#8a7a90", 1, 4)


# ---- LOD block (px) ------------------------------------------------------------------------------
def lod_block(row, box):
    x, y, w, h = box
    panel(x, y, w, h, "Web build: LODs + billboard", "card")
    t = row["trees"][0]
    info = row["lod"]
    cw, chh = (w - 30) / 2, (h - 50) / 2
    cells = [("LOD0", "day", info[0]), ("LOD1", "lod1", info[1]), ("LOD2", "lod2", info[2]), ("Billboard", "sil", info[3])]
    for i, (lab, mode, note) in enumerate(cells):
        cx = x + 10 + (i % 2) * (cw + 10)
        cy = y + 30 + (i // 2) * (chh + 6)
        rect(cx, cy, cw, chh, "#2a2444", "#4a3d66", 1, 4)
        if lab == "Billboard":
            # impostor: 2 crossed quads with the baked silhouette
            rect(cx + cw * .2, cy + 6, cw * .6, chh - 34, C.D.checker(), GOLD, 1, extra='stroke-dasharray="4 3"')
            render_group([t], (cx + cw * .2, cy + 6, cw * .6, chh - 34), "day", pad=3)
        else:
            render_group([t], (cx + 4, cy + 4, cw - 8, chh - 30), mode, pad=4)
        T(cx + 6, cy + chh - 16, lab, 12, GOLD, weight="bold")
        T(cx + 6, cy + chh - 4, note, 10.5, INK2)


# ----------------------------------------------------------------------------------------------
# rows
# ----------------------------------------------------------------------------------------------
def tree_row(row, y, h, hero=False):
    W = 2400
    rect(10, y, W - 20, h, "#171329", "#3a3058", 1.5, 10)
    # text column
    tx = 26
    T(tx, y + 36, row["name"], 26, ROSE, weight="bold")
    T(tx, y + 60, row["size"], 16, GOLD)
    yy = y + 88
    yy = bullets(tx, yy, row["notes"], 320 if not hero else 330, 14.5)
    if hero:
        cols = dict(day=(360, y + 12, 840, h - 24), skel=(1212, y + 12, 300, h * .5 - 18), leaf=(1212, y + h * .5, 300, h * .5 - 12),
                    bark=(1524, y + 12, 200, h * .5 - 18), night=(1736, y + 12, 650, h * .62), lod=(1524, y + h * .62 + 22, 862, h * .38 - 34))
    else:
        cols = dict(day=(360, y + 12, 560, h - 24), skel=(930, y + 12, 270, h - 24), leaf=(1210, y + 12, 250, h - 24),
                    bark=(1470, y + 12, 150, h - 24), night=(1630, y + 12, 390, h - 24), lod=(2030, y + 12, 356, h - 24))
    day_panel(row, cols["day"])
    skel_panel(row, cols["skel"])
    leaf_callout(row["leaf"], row["trees"][0]["sp"], cols["leaf"])
    bark_swatch(row["bark"], row["trees"][0]["sp"], cols["bark"])
    night_panel(row, cols["night"])
    if hero:
        # hero LOD block: lay the four cells in one strip
        x, yb, w, hb = cols["lod"]
        panel(x, yb, w, hb, "Web build: hero trunk mesh + alpha-card canopy clumps, 3 LODs + far billboard", "card")
        t = row["trees"][0]
        cw = (w - 50) / 4
        for i, (lab, mode, note) in enumerate(zip(["LOD0", "LOD1", "LOD2", "Billboard"], ["day", "lod1", "lod2", "sil"], row["lod"])):
            cx = x + 10 + i * (cw + 10)
            cy = yb + 30
            rect(cx, cy, cw, hb - 40, "#2a2444", "#4a3d66", 1, 4)
            if mode == "sil":
                rect(cx + cw * .15, cy + 6, cw * .7, hb - 90, C.D.checker(), GOLD, 1, extra='stroke-dasharray="4 3"')
                render_group([t], (cx + cw * .15, cy + 6, cw * .7, hb - 90), "day", pad=3)
            else:
                render_group([t], (cx + 4, cy + 4, cw - 8, hb - 80), mode, pad=4)
            T(cx + 6, cy + hb - 62, lab, 13, GOLD, weight="bold")
            para(cx + 6, cy + hb - 47, note, cw - 12, 11.5, INK2, 1.25)
    else:
        lod_block(row, cols["lod"])


def header(y):
    T(30, y + 52, "FOLIAGE — TREE DESIGN SKETCH", 46, ROSE, weight="bold")
    T(30, y + 84, f"Birthday Castle world · sheet A of 2 (trees) · round {ROUND} · every view below is drawn from one grown skeleton per tree", 18, INK2)
    # palette chips
    chips = [("rose stone", ROSE), ("deep rose", ROSE_D), ("plum", PLUM), ("gold trim", GOLD), ("marble", MARBLE),
             ("glow teal", "#4fe0cf"), ("glow pink", "#ff8cc8"), ("glow amber", "#ffd27a"), ("glow violet", "#a46cff")]
    for i, (n, c) in enumerate(chips):
        cx = 1300 + i * 120
        rect(cx, y + 26, 34, 34, c, "#ffffff", 1, 4)
        T(cx + 17, y + 76, n, 11, INK2, "middle")
    para(30, y + 112, "How to read a row: text notes · day elevation with height ruler and a 1.7 m figure · branch skeleton (gold trunk, rose limbs, teal branches, violet twigs; dashed circles = canopy clump anchors) with a flat silhouette · leaf clump close-up and the alpha card it bakes to · bark close-up · night version · how the web build cuts it into LODs. Rules: no eyes, nothing modern, glows only warm amber, pink, teal and violet.", 2340, 15, INK2)


def build_rows():
    t_giant = grow(SP["giant"], 4)
    t_mother = grow(SP["mother"], 9)
    rows = []
    rows.append(dict(name="Glowwood giant tree", size="100 m tall · trunk Ø 13 m · canopy ≈ 80 m · ×10 round the crag",
                     trees=[t_giant], which="giant", leaf="pad", bark="fluted", nground="#4fe0cf",
                     notes=[("U241", "rope-strand roots and fluted bark, carved arch cave, teal pool glow"),
                            ("U29", "arching root ribs over the path; pale strands down the trunk"),
                            ("U99", "moss only on the TOP of limbs, cyan motes, moss curtains"),
                            ("U168 / U73", "chunky lush clumps with dark gaps; long clear trunk"),
                            ("U39 / U70", "shelf fungus tiers with glowing undersides"),
                            ("U108", "lanterns hung on long chains from the limbs"),
                            ("Ours:", "straight 50 m column, 4-way crown fork + 2 side limbs, layered green pads, root-arch doorway the path can pass through, teal speckle glow."),
                            ("Build:", "1 hero trunk mesh (sculpt → bake normal + AO) instanced ×10 with 3 rotations; canopy = 40-60 clump cards; moss = top-facing-normal shader mask; glow = emissive speck texture + firefly particles.")],
                     lod=["25k tris · 0-120 m · full clumps, moss, fungi", "9k · 120-350 m · ½ clumps ×1.3, limbs only", "2k · 350-900 m · 5 blobs + trunk", "8-angle impostor 512² · beyond 900 m"]))
    rows.append(dict(name="Mother Tree", size="140 m tall · canopy ≈ 150 m wide · on an 18 m rock island in the lake",
                     trees=[t_mother], which="mother", leaf="magenta", bark="mother", below=22, nground="#ff7fd0",
                     notes=[("U237", "short colossal trunk splitting into 3 near-horizontal sweeping limbs; stacked flat-bottomed cloud pads, lit tops and dark undersides; roots braided over the rock; gabled hall at its foot"),
                            ("U241", "roots as fluted tendons; arch window carved in the trunk"),
                            ("U108", "magenta leaf masses, chain lanterns, blue/pink glow dots on bark"),
                            ("U66 / U67", "magenta canopy over teal water"),
                            ("Ours:", "magenta pads, gold-framed arch window, roots spill 20 m into the lake, petal lights + pink underside haze at night."),
                            ("Build:", "single hero mesh (≈25k) with bark normal; 70 pad clumps as alpha-card shells; underside emissive gradient; petal-light particles; reflection in the lake plane.")],
                     lod=["25k tris · 0-200 m · full pads + lanterns", "10k · 200-600 m · ½ pads, no lanterns", "3k · 600-1500 m · 5 big pads", "impostor 1024² · horizon landmark, always on"]))
    return rows


def regular_rows():
    rows = []
    rows.append(dict(name="Avenue tree", size="18 m · canopy 14 m · every 12 m along the straight approach", trees=[grow(SP["avenue"], 3)],
                     leaf="broad", bark="smooth", nground="#ffd27a",
                     notes=[("U168", "huge spreading lush broadleaf, chunky light clumps, dark gaps"),
                            ("U18 / U80", "rounded canopies planted in a regular row"),
                            ("U02 / U292", "bright fresh greens"),
                            ("Ours:", "4-way fork at 4.6 m so the canopy arches over the walk; night: warm fairy lights in the canopy from the lantern posts."),
                            ("Build:", "instanced, 2 trunk variants × 3 canopy seeds.")],
                     lod=["6k · 0-60 m", "2k · 60-150 m", "600 · 150-400 m", "impostor 256²"]))
    rows.append(dict(name="Bioluminescent tree", size="14 m · serpentine trunk · Glowwood accent (1 in 8)", trees=[grow(SP["biolum"], 5)],
                     leaf="swirl", bark="biolum", nground="#5ff0e0",
                     notes=[("U288", "swirl-pattern canopy with lanterns hidden inside"),
                            ("U108", "violet bark, glowing dots"),
                            ("U20 / U28 / U174", "glowing canopy colours (gold, violet, magenta)"),
                            ("U85", "teal underglow"),
                            ("Ours:", "violet swirl clumps, teal glowing leaf veins and bark veins, amber pods inside."),
                            ("Build:", "trunk mesh + emissive vein mask; clump cards with vein emissive channel.")],
                     lod=["5k · 0-60 m", "2k", "500", "impostor (emissive baked)"]))
    rows.append(dict(name="Blossom (sakura) tree", size="9 m · canopy 12 m wide · courtyards, lakeshore, tea gardens", trees=[grow(SP["sakura"], 2)],
                     leaf="blossom", bark="sakura", nground="#ffb3d6",
                     notes=[("U53", "gnarled leaning trunk, wide horizontal limbs, petals on the path"),
                            ("U01 / U18 / U03", "pink puff canopies"),
                            ("U130", "white blossom tree with a gold glowing spiral ribbon (birthday tree variant)"),
                            ("U289", "small potted blossom tree"),
                            ("Ours:", "pink puffs with white florets; night: soft pink self-glow + petal particles."),
                            ("Build:", "trunk mesh, puff cards; petal-fall particles.")],
                     lod=["4k · 0-60 m", "1.5k", "400", "impostor 256²"]))
    rows.append(dict(name="Lake willow", size="15 m · fronds hang to 1 m · Long Lake shore", trees=[grow(SP["willow"], 6)],
                     leaf="willow", bark="willow", nground="#7fe8d0",
                     notes=[("U101", "weeping crimson trees: dome + vertical hanging fronds"),
                            ("U99", "hanging strands, reflections in still water"),
                            ("U377 / U402", "lake-front planting"),
                            ("Ours:", "green-teal fronds (crimson variant for the ballroom atrium); frond tips glow at night."),
                            ("Build:", "trunk mesh + 30-40 long strip cards with vertex-colour sway.")],
                     lod=["5k · 0-60 m", "2k", "500", "impostor 256²"]))
    rows.append(dict(name="Pines and firs", size="fir 26 m · cliff pine 12 m · cypress 16 m", trees=[grow(SP["fir"], 1), grow(SP["pine"], 8), grow(SP["cypress"], 1)],
                     leaf="needle", bark="plated", nground="#8fd0c0",
                     notes=[("U102 / U186", "stylised tiered firs with drooping skirts"),
                            ("U45 / U56", "tall pines, backlit trunks"),
                            ("U359 / U59 / U124", "windswept pine with flat cloud pads"),
                            ("U381 / U395 / U399", "columnar cypress flanking avenues"),
                            ("Build:", "fir = trunk + 11 tier skirt cards; pine = pads; cypress = one lathe mesh + flame normal map.")],
                     lod=["fir 3k · pine 3k · cypress 800", "1k / 1k / 300", "300 / 300 / 120", "impostor 256²"]))
    rows.append(dict(name="Lagoon City palms", size="12 m and 9 m · quays, roof gardens, oasis planters", trees=[grow(SP["palm"], 1), grow(SP["palm2"], 2)],
                     leaf="palm", bark="palm", nground="#ffd27a",
                     notes=[("U121", "curved ringed trunks, arching pinnate fronds"),
                            ("U182 / U285", "palms in raised planters with orange flowers"),
                            ("U185 / U399", "palms on white stepped terraces"),
                            ("Ours:", "curved trunk with ring scars, 13 fronds in 3 tones, date cluster; night: warm uplight from the planter."),
                            ("Build:", "trunk tube mesh, 13 frond cards (1 atlas), wind bend in vertex shader.")],
                     lod=["2.5k · 0-60 m", "900", "200 (6 cross fronds)", "impostor 256²"]))
    rows.append(dict(name="Autumn grove: maple + birch", size="maple 13 m · birch 16 m · Lantern River Valley", trees=[grow(SP["maple"], 4), grow(SP["birch"], 2), grow(dict(SP["birch"], H=13, lean=-.08), 5)],
                     leaf="maple", bark="birch", nground="#ffb070",
                     notes=[("U73", "white birch with black lenticels under red leaf clouds, blue bellflowers"),
                            ("U75 / U373 / U49", "orange-red clumped maples, leaf fall"),
                            ("U61 / U188", "red maple over water"),
                            ("Ours:", "orange-red maples, pale birches; night: warm lantern underglow, drifting leaf particles."),
                            ("Build:", "shared trunk kit; leaf-fall particles; leaf-litter decal.")],
                     lod=["4k · 0-60 m", "1.5k", "400", "impostor 256²"]))
    return rows


def main():
    rows = build_rows()
    reg = regular_rows()
    HH = 150 + 2 * 1020 + len(reg) * 560 + 40 + 700
    d = Doc(2400, HH)
    set_doc(d)
    rect(0, 0, 2400, HH, "#100d20")
    header(0)
    y = 160
    for r in rows:
        tree_row(r, y, 1000, hero=True)
        y += 1020
    for r in reg:
        tree_row(r, y, 540)
        y += 560
    import foliage_topiary
    foliage_topiary.topiary_row(y, 680, ROUND)
    y += 700
    d.h = y + 20
    path = os.path.join(OUT, "foliage-trees.svg")
    open(path, "w").write(d.svg())
    print(path, d.w, d.h)


if __name__ == "__main__":
    main()
