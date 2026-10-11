"""Reusable bridge parts drawn in metres into a View (railing panels, posts, lanterns, balusters, lotus)."""
import math
from bk import C, NEON, pt, f, koch, star, quatrefoil_d, pointed_d, round_d


def lake_bg(V, x0, x1, h0, h1, sparkle=True, seed=1):
    g = V.S.vgrad("#1d2a5c", "#0b1230")
    V.rect(x0, x1, h0, h1, g)
    if sparkle:
        import random
        r = random.Random(seed)
        n = int((x1 - x0) * (h1 - h0) * 6)
        for _ in range(min(n, 120)):
            x = r.uniform(x0, x1)
            h = r.uniform(h0, h1)
            V.circle(x, h, .006 + r.random() * .008, "#cfe0ff", op=.35 + r.random() * .4)


def tr_stroke(V, d, w, gold=False):
    """carved tracery bar: shadow, white bar, optional gold inlay line"""
    V.path(d, st=C["white_d"], sw=w * 1.25, extra='transform="translate(.012,.012)"')
    V.path(d, st=C["pearl"], sw=w)
    if gold:
        V.path(d, st=C["gold"], sw=w * .22)


def circ_d(x, h, r):
    return f"M{pt(x-r, h)} A{f(r)} {f(r)} 0 1 0 {pt(x+r, h)} A{f(r)} {f(r)} 0 1 0 {pt(x-r, h)} Z"


def poly_d(pts):
    return "M" + " L".join(pt(*p) for p in pts) + " Z"


def mouchette_d(x, h, s, flip=1, rot=0):
    """curved flame-shaped dagger (flamboyant mouchette), length s"""
    ca, sa = math.cos(math.radians(rot)), math.sin(math.radians(rot))

    def T(u, v):
        u *= flip
        return pt(x + (u * ca - v * sa) * s, h + (u * sa + v * ca) * s)
    return (f"M{T(0,0)} C{T(.18,.06)} {T(.42,.32)} {T(.5,.62)} C{T(.56,.86)} {T(.36,1.0)} {T(.24,.86)} "
            f"C{T(.14,.72)} {T(.26,.5)} {T(.2,.34)} C{T(.15,.2)} {T(.06,.08)} {T(0,0)} Z")


def tracery_panel(V, x0, h0, w=3.4, hg=1.1, detail=2, neon=None, seed=3):
    """pierced gothic+girih tracery panel; openings show the lake. U77 lancets+roundels, U401 interlace, U283/U284 star."""
    lake_bg(V, x0, x0 + w, h0, h0 + hg, sparkle=detail >= 1, seed=seed)
    bw = .055 if detail >= 2 else .09
    if neon:
        V.glow(x0 + w / 2, h0 + hg * .55, hg * 1.1, neon, .55)
    cx, cy = x0 + w / 2, h0 + .18 + (hg - .24) / 2
    if detail == 0:
        tr_stroke(V, f"M{pt(x0,h0)} H{f(x0+w)} V{f(-(h0+hg))} H{f(x0)} Z", bw)
        for k in (-1, 0, 1):
            tr_stroke(V, circ_d(cx + k * w * .32, cy, hg * .36), bw, gold=k == 0)
        tr_stroke(V, poly_d(star(cx, cy, hg * .3, hg * .18, 8)), bw * .7)
        return
    # interlaced arcade band (U401)
    step = .2
    u = x0
    d = ""
    while u < x0 + w - .39:
        d += f"M{pt(u, h0+.02)} A.2 .2 0 0 1 {pt(u+.4, h0+.02)} "
        u += step
    tr_stroke(V, d, bw * .55)
    tr_stroke(V, f"M{pt(x0, h0+.2)} H{f(x0+w)}", bw)
    # centre roundel with girih 8-point star (U283, U284 / castle girih)
    R = (hg - .24) / 2 * .98
    tr_stroke(V, circ_d(cx, cy, R), bw * 1.1, gold=True)
    tr_stroke(V, circ_d(cx, cy, R * .84), bw * .5)
    sq1 = [(cx + R * .8 * math.cos(math.radians(45 + 90 * i)), cy + R * .8 * math.sin(math.radians(45 + 90 * i))) for i in range(4)]
    sq2 = [(cx + R * .8 * math.cos(math.radians(90 * i)), cy + R * .8 * math.sin(math.radians(90 * i))) for i in range(4)]
    tr_stroke(V, poly_d(sq1), bw * .6)
    tr_stroke(V, poly_d(sq2), bw * .6)
    tr_stroke(V, circ_d(cx, cy, R * .3), bw * .55, gold=True)
    for i in range(8):
        a = math.radians(22.5 + 45 * i)
        tr_stroke(V, circ_d(cx + R * .55 * math.cos(a), cy + R * .55 * math.sin(a), R * .08), bw * .35)
    tr_stroke(V, poly_d(star(cx, cy, R * .22, R * .1, 8)), bw * .3)
    # two lancet groups (U77: twin lights + cusped roundel under an enclosing arch)
    gw = (w - 2 * R - .3) / 2
    for side in (-1, 1):
        gc = cx + side * (R + .12 + gw / 2)
        top = h0 + hg - .05
        dd, sp = pointed_d(gc, gw, h0 + .2, top, k=.8)
        tr_stroke(V, dd, bw)
        lw = gw * .36
        for j in (-1, 1):
            lc = gc + j * gw * .22
            d2, s2 = pointed_d(lc, lw, h0 + .2, h0 + .2 + (top - h0 - .2) * .62, k=.9)
            tr_stroke(V, d2, bw * .7)
            # trefoil cusp in the lancet head
            if detail >= 2:
                tr_stroke(V, quatrefoil_d(lc, s2 + lw * .25, lw * .42, lobes=3, rot=90), bw * .3)
        rc = h0 + .2 + (top - h0 - .2) * .8
        rr = gw * .19
        tr_stroke(V, circ_d(gc, rc, rr), bw * .7, gold=True)
        tr_stroke(V, quatrefoil_d(gc, rc, rr * .95), bw * .4)
        # mullion
        tr_stroke(V, f"M{pt(gc, h0+.2)} V{f(-(h0+.2+(top-h0-.2)*.55))}", bw * .6)
        # mouchettes in the spandrels (flamboyant)
        if detail >= 2:
            ox = gc + side * gw * .5
            tr_stroke(V, mouchette_d(ox - side * .02, h0 + hg * .55, hg * .36, flip=side, rot=0), bw * .35)
            tr_stroke(V, mouchette_d(gc - side * gw * .5 + side * .02, h0 + hg * .6, hg * .32, flip=-side, rot=0), bw * .35)
    # frame
    tr_stroke(V, f"M{pt(x0,h0)} H{f(x0+w)} V{f(-(h0+hg))} H{f(x0)} Z", bw * 1.4)


def crystal_lantern(V, x, h, s=1.0, glow=C["amber"]):
    """gold stem + dish + hexagonal crystal + pointed cap + star finial (Blender module lantern, U77 lantern posts)"""
    V.glow(x, h + .45 * s, .9 * s, glow, .8)
    V.rect(x - .02 * s, x + .02 * s, h, h + .25 * s, C["gold"])
    V.poly([(x - .14 * s, h + .25 * s), (x + .14 * s, h + .25 * s), (x + .08 * s, h + .3 * s), (x - .08 * s, h + .3 * s)], C["gold"], C["gold_d"], .01 * s)
    V.poly([(x - .09 * s, h + .3 * s), (x + .09 * s, h + .3 * s), (x + .11 * s, h + .45 * s), (x + .09 * s, h + .62 * s),
            (x - .09 * s, h + .62 * s), (x - .11 * s, h + .45 * s)], "#fff6e6", C["gold_d"], .012 * s)
    V.line(x, h + .3 * s, x, h + .62 * s, C["amber"], .012 * s)
    V.poly([(x - .13 * s, h + .62 * s), (x + .13 * s, h + .62 * s), (x, h + .8 * s)], C["gold"], C["gold_d"], .01 * s)
    V.poly(star(x, h + .86 * s, .06 * s, .025 * s, 4), C["gold_l"])


def acanthus_row(V, x0, x1, h, hgt, n, col=C["pearl"], edge=C["white_d"]):
    w = (x1 - x0) / n
    for i in range(n):
        a = x0 + i * w
        V.path(f"M{pt(a, h)} C{pt(a+w*.05, h+hgt*.6)} {pt(a+w*.3, h+hgt*1.05)} {pt(a+w*.5, h+hgt)} "
               f"C{pt(a+w*.7, h+hgt*1.05)} {pt(a+w*.95, h+hgt*.6)} {pt(a+w, h)} Z", col, edge, hgt * .06)
        V.line(a + w * .5, h + hgt * .1, a + w * .5, h + hgt * .85, edge, hgt * .05)


def rail_post(V, x, h0=0, w=.6, hgt=1.5, detail=2, lantern=True):
    """square pier post with sunk Koch-rosette panel, acanthus capital, crystal lantern (bridge-design §4)"""
    if detail == 0:
        V.rect(x - w / 2, x + w / 2, h0, h0 + hgt, C["pearl"], C["white_d"], .04)
        V.rect(x - w * .6, x + w * .6, h0 + hgt, h0 + hgt + .12, C["pearl"], C["white_d"], .04)
        if lantern:
            V.glow(x, h0 + hgt + .5, .9, C["amber"], .8)
            V.rect(x - .1, x + .1, h0 + hgt + .2, h0 + hgt + .6, "#fff3dc")
            V.poly([(x - .14, h0 + hgt + .6), (x + .14, h0 + hgt + .6), (x, h0 + hgt + .8)], C["gold"])
        return
    gr = V.S.cyl(C["pearl"], "#ffffff", C["white_s"])
    V.rect(x - w * .62, x + w * .62, h0, h0 + .1, C["white_s"], C["white_d"], .01)
    V.rect(x - w * .56, x + w * .56, h0 + .1, h0 + .25, gr, C["white_d"], .01)
    V.line(x - w * .56, h0 + .22, x + w * .56, h0 + .22, C["gold"], .012)
    V.rect(x - w / 2, x + w / 2, h0 + .25, h0 + hgt - .2, gr, C["white_d"], .012)
    # sunk panel
    V.rect(x - w * .36, x + w * .36, h0 + .38, h0 + hgt - .32, C["white_s"], C["white_d"], .01)
    V.rect(x - w * .32, x + w * .32, h0 + .42, h0 + hgt - .36, "#efe4ec", C["gold"], .008)
    kc = h0 + (hgt - .1) / 2 + .1
    V.poly(koch(x, kc, w * .26, 3), "none", C["gold"], .007)
    V.poly(koch(x, kc, w * .15, 2, rot=-90), "none", C["gold_d"], .006)
    V.circle(x, kc, w * .04, C["gold"])
    # capital: astragal, acanthus, abacus
    hc = h0 + hgt - .2
    V.rect(x - w * .52, x + w * .52, hc, hc + .03, C["gold"])
    acanthus_row(V, x - w * .62, x + w * .62, hc + .03, .14, 5)
    V.rect(x - w * .66, x + w * .66, hc + .15, hc + .22, gr, C["white_d"], .01)
    V.line(x - w * .66, hc + .185, x + w * .66, hc + .185, C["gold"], .01)
    if lantern:
        crystal_lantern(V, x, hc + .22, .9)


def ogee_rail(V, x0, x1, h, detail=2):
    """ogee handrail cap 0.15 tall with gold crown line"""
    V.rect(x0, x1, h, h + .04, C["white_s"], C["white_d"], .008)
    V.rect(x0, x1, h + .04, h + .1, "#ffffff", C["white_d"], .008)
    V.rect(x0, x1, h + .1, h + .15, C["pearl"], C["white_d"], .008)
    V.line(x0, h + .125, x1, h + .125, C["gold"], .014)


def arcaded_plinth(V, x0, x1, h, hgt=.25):
    V.rect(x0, x1, h, h + hgt, C["pearl"], C["white_d"], .008)
    n = int((x1 - x0) / .17)
    step = (x1 - x0) / n
    for i in range(n):
        cx = x0 + step * (i + .5)
        d, _ = round_d(cx, step * .55, h + .02, h + .16)
        V.path(d, "#1a2450")
    y = h + hgt - .04
    u = x0 + .03
    while u < x1 - .03:
        V.ellipse(u, y, .018, .012, C["gold"])
        V.rect(u + .03, u + .06, y - .004, y + .004, C["gold"])
        u += .09
    V.line(x0, h + hgt, x1, h + hgt, C["white_d"], .01)


def lotus_lantern(V, x, h, s=1.0, col="#ff9fd0", plan=False):
    """floating lotus lantern: pad, two rings of petals, candle glow (U258/U259 floating candles, lotus pond)"""
    if plan:
        V.glow(x, h, .9 * s, col, .7)
        V.circle(x, h, .42 * s, C["leaf"], C["leaf_d"], .02 * s)
        for i in range(8):
            a = math.radians(i * 45)
            V.ellipse(x + .18 * s * math.cos(a), h + .18 * s * math.sin(a), .12 * s, .12 * s, "#ffd6ea", op=.95)
        V.circle(x, h, .1 * s, "#fff3c0")
        return
    V.glow(x, h + .2 * s, 1.0 * s, col, .8)
    V.ellipse(x, h, .45 * s, .06 * s, C["leaf"], C["leaf_d"], .015 * s)
    petals = [(-.32, .08, -50), (-.2, .14, -28), (0, .18, 0), (.2, .14, 28), (.32, .08, 50)]
    for px_, ph, rot in petals:
        V.path(f"M{pt(x+px_*s*.5, h+.02*s)} Q{pt(x+px_*s*1.1-.06*s, h+ph*s*1.3)} {pt(x+px_*s, h+(ph+.18)*s)} "
               f"Q{pt(x+px_*s*1.1+.06*s, h+ph*s*1.3)} {pt(x+px_*s*.5, h+.02*s)} Z", "#ffc4e0", "#c25488", .012 * s)
    for px_ in (-.12, .12):
        V.path(f"M{pt(x, h+.03*s)} Q{pt(x+px_*s*1.6, h+.2*s)} {pt(x+px_*s, h+.36*s)} Q{pt(x+px_*s*.2, h+.2*s)} {pt(x, h+.03*s)} Z", "#ffe0f0", "#c25488", .01 * s)
    V.ellipse(x, h + .22 * s, .05 * s, .09 * s, "#fff6c0")


def vase_baluster(V, x, h0, hgt, w, col=C["pearl"], edge=C["white_d"], gold=False):
    """turned vase baluster (U351, U261): square foot, bulb, neck, cap"""
    k = hgt
    prof = [(.5, 0), (.5, .08), (.36, .1), (.38, .14), (.46, .22), (.5, .36), (.42, .5), (.26, .62), (.18, .7), (.2, .74),
            (.3, .78), (.18, .82), (.24, .86), (.4, .9), (.5, .92), (.5, 1.0)]
    L = [(x - p * w, h0 + q * k) for p, q in prof]
    R = [(x + p * w, h0 + q * k) for p, q in reversed(prof)]
    V.poly(L + R, col, edge, w * .05)
    if gold:
        V.line(x - .2 * w, h0 + .76 * k, x + .2 * w, h0 + .76 * k, C["gold"], w * .08)


def figure_note(V, x, h0, hgt=1.7):
    V.figure(x, h0, hgt)
    V.label(x, h0 + hgt, "1.7 m", 12, C["sub"], "middle", dy=-6)
