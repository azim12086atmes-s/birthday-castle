"""Bridges sheet A: the Long Bridge (arch module, pier, railing, lamp standard, pavilion), the Lotus Pond
humpback bridge and the pink viaduct. Run: python3 sheet_a.py <round>  -> bridges-a-r<round>.svg"""
import math, sys, os, random
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bk import *
from parts import *

ROUND = int(sys.argv[1]) if len(sys.argv) > 1 else 1
W, H = 2400, 3420
S = Sheet(W, H, "Bridges A")
S.a(f'<rect width="{W}" height="{H}" fill="#0b0a1c"/>')


def header():
    S.L(f'<text x="30" y="58" font-size="42" fill="{C["gold_l"]}" font-weight="bold">BRIDGES — sheet A: the Long Bridge, the Lotus Pond humpback, the pink viaduct</text>')
    S.L(f'<text x="30" y="92" font-size="18" fill="{C["sub"]}">Night model sheet, round {ROUND}. Glossy pearl-white marble with gold fractal inlay; rose stone; neon footstep ripples (green → blue → purple → yellow → pink). '
        f'Figures are veiled and faceless; finials are stars or lotus buds. Metres throughout.</text>')
    x = 1720
    for i, (n, c) in enumerate([("pearl", C["pearl"]), ("rose", C["rose"]), ("rose d", C["rose_d"]), ("plum", C["plum"]), ("gold", C["gold"]),
                                ("amber", C["amber"]), ("teal", C["teal"])]):
        S.L(f'<rect x="{x+i*92}" y="108" width="30" height="16" fill="{c}" stroke="#000" stroke-width=".5"/><text x="{x+i*92+34}" y="121" font-size="13" fill="{C["sub"]}">{n}</text>')
    for i, c in enumerate(NEON):
        S.L(f'<circle cx="{40+i*26}" cy="116" r="9" fill="{c}"/>')
    S.L(f'<text x="180" y="121" font-size="14" fill="{C["sub"]}">footstep ripple colour cycle</text>')


def night_sky(V, x0, x1, h0, h1, seed=0, stars=60):
    g = S.vgrad("#120f30", "#2a1d52")
    V.rect(x0, x1, h0, h1, g)
    r = random.Random(seed)
    for _ in range(stars):
        V.circle(r.uniform(x0, x1), r.uniform(h0 + (h1 - h0) * .3, h1), (h1 - h0) * .0015 * (1 + r.random()), "#fff", op=.3 + r.random() * .5)


def water(V, x0, x1, h0, h1=0):
    g = S.vgrad("#1b2550", "#080c22")
    V.rect(x0, x1, h0, h1, g)


# ======================================================================= A1 Long Bridge arch module
def koch_rosette(V, x, h, r, lv=3, inner=True):
    V.circle(x, h, r * 1.08, "#efe3ec", C["gold_d"], r * .03)
    V.poly(koch(x, h, r, lv), "none", C["gold"], r * .025)
    if inner:
        V.poly(koch(x, h, r * .55, lv - 1, rot=-90), "none", C["gold"], r * .02)
        V.poly(star(x, h, r * .28, r * .14, 6), C["gold_l"])


def soffit_lace(V, x, h, ang, L, depth, sw):
    """fern/tree fractal (bridge-design §2: branching lace on soffits)"""
    if depth == 0 or L < .05:
        return
    x2, h2 = x + L * math.cos(ang), h + L * math.sin(ang)
    V.line(x, h, x2, h2, C["gold_l"], sw, .8)
    soffit_lace(V, x2, h2, ang, L * .72, depth - 1, sw * .8)
    soffit_lace(V, x + (x2 - x) * .5, h + (h2 - h) * .5, ang + .7, L * .45, depth - 1, sw * .7)
    soffit_lace(V, x + (x2 - x) * .5, h + (h2 - h) * .5, ang - .7, L * .45, depth - 1, sw * .7)


def long_bay(V, x0, detail=1):
    """one 20 m two-tier bay starting at pier centre x0 (U95, U138, U145, U401 two-tier arcade; U369 pilasters)"""
    xc = x0 + 10
    white = S.cyl(C["pearl"], "#ffffff", C["lilac"])
    # body of the bay (solid, arches are cut by drawing openings on top)
    V.rect(x0, x0 + 20, 0, 16, C["pearl"])
    # lower arch opening (cusped edge with gold piping) – soffit glow
    hole = cusped_d(xc, 16.4, -.1, 1.0, lobes=11, depth=.05)
    V.path(round_d(xc, 18.0, -.1, 1.0 + 9.0)[0], "#e9dbe6")
    # voussoir lines
    for i in range(1, 22):
        a = math.pi * i / 22
        V.line(xc - 8.2 * math.cos(a), 1.0 + 8.2 * math.sin(a), xc - 9.0 * math.cos(a), 1.0 + 9.0 * math.sin(a), C["white_d"], .05, .6)
    V.path(round_d(xc, 18.0, 1.0, 10.0)[0].replace(" Z", ""), st=C["gold"], sw=.09)
    sky = S.vgrad("#2a1d52", "#1a1a44")
    V.path(hole, sky)
    V.glow(xc, 7.6, 6.5, "#ff9fd0", .35)
    V.path(hole, st=C["gold"], sw=.08)
    # far-face soffit lace glimpsed
    if detail >= 1:
        soffit_lace(V, xc, 8.6, -math.pi / 2, 1.6, 5, .05)
    # band (string course) with corbels and gold piping
    V.rect(x0, x0 + 20, 10.0, 10.8, white)
    V.line(x0, 10.05, x0 + 20, 10.05, C["gold"], .06)
    V.line(x0, 10.75, x0 + 20, 10.75, C["gold"], .04)
    for i in range(20):
        V.rect(x0 + i + .35, x0 + i + .65, 10.15, 10.55, "#eadbe6", C["white_d"], .02)
    # upper tier: two cusped arches per bay, pilasters between
    for k in (0, 1):
        uc = x0 + 5 + 10 * k
        V.path(round_d(uc, 8.8, 10.8, 10.8 + 4.4 + 4.4 - 4.4)[0], "#e9dbe6")
        uh = cusped_d(uc, 8.0, 10.8, 10.8 + 0.0 + .01, lobes=7, depth=.08)
        V.path(uh, sky)
        V.glow(uc, 13.2, 3, "#ffd6a0", .35)
        V.path(uh, st=C["gold"], sw=.06)
        V.path(round_d(uc, 8.8, 10.8, 15.2)[0].replace(" Z", ""), st=C["gold"], sw=.05)
    # small 8-point stars on upper spandrels
    for sx in (x0 + 10,):
        V.poly(star(sx, 14.4, .55, .25, 8), "none", C["gold"], .04)
        V.circle(sx, 14.4, .7, "none", C["gold_d"], .03)
    # Koch rosettes in the lower spandrels (sit astride the pier)
    # cornice with dentils and girih frieze
    V.rect(x0, x0 + 20, 15.2, 16.0, white)
    for i in range(40):
        V.rect(x0 + i * .5 + .1, x0 + i * .5 + .3, 15.2, 15.45, "#e5d4e0")
    V.line(x0, 15.5, x0 + 20, 15.5, C["gold"], .05)
    if detail >= 1:
        for i in range(20):
            V.poly(star(x0 + i + .5, 15.73, .2, .1, 8), "none", C["gold"], .025)
    V.rect(x0 - .1, x0 + 20.1, 15.95, 16.1, "#ffffff", C["white_d"], .02)


def long_pier(V, x, detail=1):
    """pier with cutwater seen head-on, rising to a lotus-bud cap; lotus lanterns at water"""
    # stepped footing
    V.rect(x - 2.6, x + 2.6, -.3, .5, C["white_s"], C["white_d"], .04)
    V.rect(x - 2.2, x + 2.2, .5, .9, C["lilac"], C["white_d"], .04)
    # pier body (between the arches)
    V.rect(x - 1.8, x + 1.8, .9, 10.0, C["pearl"])
    # cutwater nose head-on: lit left facet, shaded right facet
    V.poly([(x - 1.5, .9), (x, .9), (x, 5.2), (x - 1.5, 4.9)], "#ffffff", C["white_d"], .03)
    V.poly([(x, .9), (x + 1.5, .9), (x + 1.5, 4.9), (x, 5.2)], C["lilac"], C["white_d"], .03)
    V.poly([(x - 1.5, 4.9), (x, 5.2), (x, 6.6)], "#fbf4f8", C["white_d"], .03)
    V.poly([(x, 5.2), (x + 1.5, 4.9), (x, 6.6)], "#dccbdc", C["white_d"], .03)
    for hh in (1.8, 2.7, 3.6, 4.4):
        V.line(x - 1.5, hh, x + 1.5, hh, C["white_d"], .03, .5)
    V.line(x - 1.5, 4.9, x, 5.2, C["gold"], .05)
    V.line(x + 1.5, 4.9, x, 5.2, C["gold"], .05)
    # lotus-bud finial
    V.path(f"M{pt(x-.35, 6.5)} Q{pt(x-.4, 7.1)} {pt(x, 7.6)} Q{pt(x+.4, 7.1)} {pt(x+.35, 6.5)} Z", C["gold"], C["gold_d"], .03)
    V.path(f"M{pt(x, 6.5)} Q{pt(x-.15, 7.0)} {pt(x, 7.5)}", st=C["gold_d"], sw=.03)
    # rosette above
    koch_rosette(V, x, 8.25, 1.25, 3 if detail else 2)
    # upper pilaster with glowing niche (U369 pilasters run to the parapet)
    V.rect(x - 1.0, x + 1.0, 10.8, 15.2, C["pearl"], C["white_d"], .03)
    nd, _ = pointed_d(x, .7, 11.6, 13.6, .8)
    V.glow(x, 12.6, 1.6, C["amber"], .7)
    V.path(nd, "#fff0d0", C["gold"], .05)
    lotus_lantern(V, x, 11.62, 1.0)
    # lotus lanterns floating at the pier foot
    for dx in (-3.6, -2.9, 2.9, 3.6, -4.4, 4.4):
        lotus_lantern(V, x + dx, .02, .55, "#ff9fd0" if dx < 0 else "#ffd6a0")


def long_railing_small(V, x0, x1, deck=16.0, lamps=(0, 20, 40), neon_at=None):
    for i, x in enumerate(range(int(x0), int(x1), 4)):
        nx = x + 2
        tracery_panel(V, x + .3, deck + .25, 3.4, 1.1, 0, neon=NEON[2] if (neon_at is not None and abs(nx - neon_at) < 3) else None)
        V.rect(x + .3, x + 3.7, deck, deck + .25, C["pearl"])
        V.rect(x + .3, x + 3.7, deck + 1.35, deck + 1.5, "#ffffff", C["white_d"], .03)
        V.line(x + .3, deck + 1.44, x + 3.7, deck + 1.44, C["gold"], .04)
    for x in range(int(x0), int(x1) + 1, 4):
        if x in lamps:
            lamp_standard(V, x, deck, s=1.0, detail=0)
        else:
            rail_post(V, x, deck, .6, 1.6, 0)


def panel_A1():
    x, y, w, h = 20, 140, 1500, 900
    cp = S.panel(x, y, w, h, "A1 · Long Bridge — two-tier arch module (side elevation, 2 of 40 bays) + deck plan",
                 "Sources: U95 U138 U145 U401 (two-tier round-arch arcade, piers, cutwaters) · U369 (pilasters to parapet) · U77 U401 (rail) · bridge-design.md §2–5",
                 "one 20 m bay = Blender mesh baked to ~400 tris + normal/AO; instanced ×40 (2 draw calls); reflection = mirrored low copy",
                 "bay 20 m · deck +16 m above lake · lower arch span 16.4 m · upper arches 8 m · pier 3.6 m thick, cutwater 1.5 m")
    s = 21.5
    V = View(S, x + 120, y + 560, s, cp)
    with V:
        ec = S.id("ec")
        S.d(f'<clipPath id="{ec}"><rect x="-6" y="-31" width="54" height="50"/></clipPath>')
        V.raw(f'<g clip-path="url(#{ec})">')
        night_sky(V, -6, 48, 0, 30, 3)
        water(V, -6, 48, -18, 0)
        gid = S.id("lb")
        V.raw(f'<g id="{gid}">')
        for b in (-1, 0, 1, 2):
            long_bay(V, b * 20, 1)
        for p in (-20, 0, 20, 40):
            long_pier(V, p, 1)
        long_railing_small(V, -12, 48, neon_at=26)
        V.raw('</g>')
        V.raw(f'<g clip-path="none" opacity=".26" transform="scale(1,-1)"><use href="#{gid}"/></g>')
        V.rect(-6, 48, -18, 0, S.vgrad("#1b2550", "#080c22", .35, .9))
        # neon ring dropped onto the lake below a panel
        V.ellipse(26, -.1, 2.6, .35, "none", NEON[2], .1, .9)
        V.ellipse(26, -.1, 4.4, .55, "none", NEON[2], .06, .5)
        V.figure(6, 16.0, 1.7)
        V.raw('</g>')
    # break the view at the panel's left/right edges of the drawing
    V.label(10, -3, "lotus lanterns ring every pier", 14, C["sub"], "middle")
    V.callout(0, 8.25, -4.5, 23, "Koch-snowflake rosette 2.6 m,|3 levels, gold line inlay", anchor="end")
    V.callout(0, 6.0, -5.5, 4.5, "cutwater with gold arris,|lotus-bud cap", anchor="end")
    V.callout(10, 9.0, 13, 24.5, "cusped intrados, gold piping;|soffit lace glimpsed", )
    V.callout(15, 13.0, 24, 26.5, "upper tier: 2 cusped arches per bay,|amber glow", )
    V.callout(20, 12.4, 33, 23.5, "pilaster niche with lotus lantern")
    V.callout(26, 17.0, 36, 28.5, "neon ripple climbs the tracery|and drops as a ring on the lake")
    V.callout(20, 20.5, 44, 27, "lamp standard every 5th post (A4)")
    V.dim_h(0, 20, -6, "20 m bay")
    V.dim_v(-5.2, 0, 16, "deck +16 m", side=-1)
    V.dim_v(45.5, 10.8, 15.2, "upper tier 4.4 m")
    V.dim_v(45.5, 0, 10.0, "lower tier 10 m")
    # deck plan (top view) at the right
    s2 = 21.5
    P = View(S, x + 1330, y + 120, s2, cp)
    with P:
        deck_plan(P)
    P.label(0, 0, "DECK PLAN (20 m)", 15, C["gold_l"], "middle", dy=-6)
    P.label(0, -21.4, "girih star fractal inlay;", 13, C["sub"], "middle", dy=0)
    P.label(0, -22.3, "5 footstep rings lighting it", 13, C["sub"], "middle", dy=0)


def girih_tile(V, cx, ch, r, sw, col, lv=2):
    V.poly(star(cx, ch, r, r * .55, 8, rot=22.5), "none", col, sw)
    if lv > 1:
        for i in range(8):
            a = math.radians(22.5 + 45 * i)
            girih_tile(V, cx + r * .78 * math.cos(a), ch + r * .78 * math.sin(a), r * .22, sw * .7, col, lv - 1)
        V.poly(star(cx, ch, r * .4, r * .22, 8, rot=22.5), "none", col, sw * .8)


def deck_plan(P):
    """plan coordinates: x across deck (-7..7), h along the bridge (0 at top, going down = -20)"""
    P.rect(-7.6, 7.6, -20, 0, "#2a2142")
    g = S.vgrad("#f7f2f4", "#e4d6e6")
    P.rect(-7, 7, -20, 0, g)
    for j in range(5):
        P.line(-7, -4 * j, 7, -4 * j, C["white_d"], .04, .6)
    for j in range(3):
        for i in (-1, 1):
            girih_tile(P, i * 3.4, -3.4 - 6.6 * j, 2.6, .05, C["gold_d"], 2)
    # footstep ripples (colour cycle), each lighting the fractal it crosses
    steps = [(-1.2, -2.0), (-.4, -6.2), (.6, -10.4), (1.2, -14.4), (.4, -18.2)]
    for i, (sx, sh) in enumerate(steps):
        c = NEON[i]
        age = (i + 1) * .7
        P.circle(sx, sh, age, "none", c, .12, .9)
        P.circle(sx, sh, age * .7, "none", c, .05, .4)
        P.glow(sx, sh, age * .8, c, .25)
        P.ellipse(sx, sh, .14, .3, "#cdb7e6")
    # railing posts and panels both sides
    for side in (-1, 1):
        P.rect(side * 7 - .3, side * 7 + .3, -20, 0, "#ffffff", C["white_d"], .03)
        for j in range(6):
            P.rect(side * 7 - .3, side * 7 + .3, -4 * j - .3, -4 * j + .3, C["lilac"], C["gold"], .05)
            P.glow(side * 7, -4 * j, .9, C["amber"], .7)


# ======================================================================= A2 pier, cutwater, lotus lanterns
def panel_A2():
    x, y, w, h = 1540, 140, 840, 900
    cp = S.panel(x, y, w, h, "A2 · Pier with cutwater + lotus lanterns",
                 "Sources: U95 U369 (pointed cutwaters) · U258 U259 (floating candles) · U283 (lotus-bud finials) · U29 U108 (branch lace)",
                 "pier = part of bay mesh; lotus lanterns = 1 instanced mesh (≈60 tris) + emissive, bob shader; rosette = normal map + line mask",
                 "pier 3.6 × 14 m + noses 3 m · cutwater to +5.2 m, cap to +7.6 m · lantern Ø0.9 m")
    # front (head-on) at larger scale
    s = 30
    V = View(S, x + 150, y + 470, s, cp)
    with V:
        night_sky(V, -4.5, 4.5, 0, 13, 7, 20)
        water(V, -4.5, 4.5, -2.5, 0)
        V.rect(-4.5, 4.5, 0, 12, C["pearl"])
        for side in (-1, 1):
            V.path(round_d(side * 11.8, 18.0, -.1, 10.0)[0], "#e9dbe6")
            V.path(cusped_d(side * 11.8, 16.4, -.1, 1.0, 11, .05), S.vgrad("#2a1d52", "#1a1a44"))
            V.path(cusped_d(side * 11.8, 16.4, -.1, 1.0, 11, .05), st=C["gold"], sw=.08)
        long_pier(V, 0, 2)
        V.rect(-4.5, 4.5, 10.0, 10.8, C["pearl"])
        V.line(-4.5, 10.05, 4.5, 10.05, C["gold"], .06)
        V.rect(-4.5, 4.5, 10.8, 12, C["pearl"])
        long_pier_upper = None
        V.rect(-1.0, 1.0, 10.8, 12, C["pearl"], C["white_d"], .03)
        V.figure(-3.2, .5, 1.7)
    V.label(0, 12.3, "FRONT (head-on)", 15, C["gold_l"], "middle", dy=-8)
    V.callout(0, 7.3, 2.4, 9.8, "gold lotus|bud cap")
    V.callout(-1.0, 3.0, -3.0, 6.6, "faceted nose,|courses 0.9 m", anchor="end")
    V.callout(3.3, .1, 3.0, -1.6, "floating lotus ring")
    # side profile of the cutwater (looking along the bridge)
    s3 = 18
    Q = View(S, x + 470, y + 470, s3, cp)
    with Q:
        water(Q, -1, 19, -2.5, 0)
        Q.rect(1.5, 18, .9, 10, C["lilac"], C["white_d"], .04)
        Q.rect(1.5, 18, 10, 10.8, C["pearl"])
        Q.rect(1.5, 18, 10.8, 16, C["pearl"])
        Q.rect(.8, 18.6, -.3, .9, C["white_s"], C["white_d"], .04)
        Q.poly([(1.5, .9), (-.0, .9), (-.0, 4.9), (1.5, 5.2)], "#ffffff", C["white_d"], .04)
        Q.poly([(-0, 4.9), (1.5, 5.2), (1.5, 6.6)], "#efe3ee", C["white_d"], .04)
        Q.path(f"M{pt(1.15, 6.5)} Q{pt(1.1, 7.1)} {pt(1.5, 7.6)} Q{pt(1.9, 7.1)} {pt(1.85, 6.5)} Z", C["gold"], C["gold_d"], .03)
        Q.line(0, 4.9, 1.5, 5.2, C["gold"], .06)
        for i in range(7):
            koch_rosette(Q, 4.0 + i * 2.2, 8.0, .8, 2, False) if False else None
        koch_rosette(Q, 9.7, 6.0, 3.0, 3)
        Q.rect(1.5, 18, 16, 17.5, "#2a2142")
        for i in range(5):
            rail_post(Q, 2 + i * 3.8, 16, .5, 1.6, 0, lantern=True)
        for i in range(-3, 4):
            lotus_lantern(Q, 9.7 + i * 2.8, 0, .6)
        lotus_lantern(Q, -1.0, 0, .6)
    Q.label(9.7, 18.6, "SIDE (14 m pier face, Koch rosette 6 m)", 15, C["gold_l"], "middle", dy=-4)
    # plan at water level with lotus ring
    s4 = 13
    R = View(S, x + 150, y + 690, s4, cp)
    with R:
        water(R, -2, 28, -5, 5.5)
        # pier plan horizontal: length along x
        pts = [(0, 0), (3, 1.8), (17, 1.8), (20, 0), (17, -1.8), (3, -1.8)]
        R.poly([(px_ + 3, ph) for px_, ph in pts], C["pearl"], C["white_d"], .08)
        R.poly([(px_ + 3, ph) for px_, ph in [(0, 0), (3, 1.8), (3, -1.8)]], C["lilac"], C["gold"], .06)
        R.poly([(px_ + 3, ph) for px_, ph in [(20, 0), (17, 1.8), (17, -1.8)]], C["lilac"], C["gold"], .06)
        R.line(6, 0, 20, 0, C["gold"], .06, .6, dash=".4 .3")
        for i in range(16):
            a = 2 * math.pi * i / 16
            lotus_lantern(R, 13 + 12.5 * math.cos(a), 3.6 * math.sin(a), .9, plan=True)
    R.label(13, 5.3, "PLAN at water: 16 lotus lanterns, drifting 0.2 m/s round the pier", 14, C["gold_l"], "middle", dy=-4)
    R.label(3, 0, "upstream nose", 12, C["sub"], "end", dx=-8, dy=4)
    # lotus lantern close-up + soffit lace swatch
    s5 = 110
    T = View(S, x + 680, y + 700, s5, cp)
    with T:
        water(T, -.9, .9, -.3, 0)
        lotus_lantern(T, 0, 0, 1.6)
    T.label(0, .85, "LOTUS LANTERN Ø0.9 m", 14, C["gold_l"], "middle")
    s6 = 22
    U = View(S, x + 680, y + 800, s6, cp)
    with U:
        U.rect(-4, 4, -2, 2.2, "#efe3ec", C["gold_d"], .05)
        for k in (-2.4, 0, 2.4):
            soffit_lace(U, k, -1.9, math.pi / 2, 1.5, 6, .06)
    U.label(0, 2.2, "SOFFIT LACE (fern fractal)", 13, C["gold_l"], "middle", dy=-5)


# ======================================================================= A3 railing module close-up
def panel_A3():
    x, y, w, h = 20, 1060, 1560, 760
    cp = S.panel(x, y, w, h, "A3 · Long Bridge railing module — pierced tracery panel + post (close-up, 4 m)",
                 "Sources: U77 (twin lancets + cusped roundels, square newels) · U401 (interlaced arcade) · U283 U284 (girih star roundel) · U261 U351 (plinth) · U128 (rail line)",
                 "Blender full-detail module (≈38k tris) baked to a ~300-tri card: alpha-cutout + normal + AO; instanced ×400 (3 draw calls)",
                 "post 0.6 × 0.6 × 1.5 m + lantern 0.8 m · panel 3.4 × 1.1 m, ≈65% open · plinth 0.25 m · rail 0.3 m wide")
    s = 210
    V = View(S, x + 90, y + 600, s, cp)
    with V:
        night_sky(V, -.4, 4.8, -.1, 2.6, 11, 30)
        V.rect(-.4, 4.8, -.25, 0, "#efe3ec")
        for i in range(12):
            V.line(-.4 + i * .5, -.25, -.4 + i * .5, 0, C["white_d"], .006)
        arcaded_plinth(V, .3, 3.7, 0)
        tracery_panel(V, .3, .25, 3.4, 1.1, 2, neon=None if ROUND < 2 else None)
        ogee_rail(V, .3, 3.7, 1.35)
        arcaded_plinth(V, 4.3, 4.8, 0)
        tracery_panel(V, 4.3, .25, .9, 1.1, 0)
        ogee_rail(V, 4.3, 4.8, 1.35)
        rail_post(V, 0, 0, .6, 1.65, 2)
        rail_post(V, 4, 0, .6, 1.65, 2)
        V.figure(-.25, -.25, 1.7) if False else None
    V.callout(2.0, .78, 2.6, 2.35, "girih 8-point star roundel, gold ring moulding")
    V.callout(.95, 1.25, 1.3, 2.05, "enclosing arch over twin lancets + quatrefoil (U77)")
    V.callout(1.55, .9, 1.0, 1.85, "flame mouchettes", anchor="end")
    V.callout(1.2, .12, -.25, -.08, "interlaced|arcade band (U401)", anchor="end")
    V.callout(3.2, .1, 4.2, -.15, "arcaded plinth + gold bead-and-reel")
    V.callout(3.0, 1.475, 3.4, 1.85, "ogee handrail, gold crown line = ripple track")
    V.callout(4.0, .75, 4.5, 2.2, "sunk panel: Koch rosette")
    V.callout(4.0, 1.55, 4.55, 1.95, "acanthus capital")
    V.callout(4.0, 2.35, 3.6, 2.5, "crystal lantern", anchor="end")
    V.dim_h(.3, 3.7, -.38, "3.4 m panel")
    V.dim_v(-.3, 0, 1.5, "1.5 m", side=-1)
    # section profile
    s2 = 210
    Q = View(S, x + 1280, y + 600, s2, cp)
    with Q:
        Q.rect(-.6, .6, -.25, 0, "#efe3ec")
        prof = [(-.12, 0), (-.12, .25), (-.06, .25), (-.06, 1.35), (-.15, 1.37), (-.15, 1.41), (-.1, 1.43), (-.13, 1.47), (-.06, 1.5),
                (.06, 1.5), (.13, 1.47), (.1, 1.43), (.15, 1.41), (.15, 1.37), (.06, 1.35), (.06, .25), (.12, .25), (.12, 0)]
        Q.poly(prof, C["pearl"], C["white_d"], .01)
        Q.circle(0, 1.5, .012, C["gold"])
        Q.line(-.06, .55, .06, .55, "#1a2450", .1)
        Q.line(-.06, 1.05, .06, 1.05, "#1a2450", .08)
        Q.line(-.6, 0, .6, 0, C["gold"], .01)
    Q.label(0, 1.62, "SECTION", 15, C["gold_l"], "middle")
    Q.callout(.15, 1.4, .35, 1.25, "ogee cap|0.3 m")
    Q.callout(.06, .8, .3, .7, "panel 0.12 m,|pierced")
    Q.callout(-.12, .12, -.3, .35, "plinth", anchor="end")
    # critique of the Blender render
    S.L(f'<rect x="{x+1010}" y="{y+80}" width="520" height="118" rx="8" fill="#22183c" stroke="{C["gold_d"]}"/>')
    for i, ln in enumerate(["vs Blender render (bridge_railing_render.png):",
                            "• render panel is ~35% open — solid slab with holes;",
                            "  carve thin bars (55 mm) so the lake reads through (65%)",
                            "• add the twin-lancet arches + mouchettes from U77",
                            "• lantern: keep crystal + gold cap, add star finial"]):
        S.L(f'<text x="{x+1022}" y="{y+104+i*21}" font-size="15" fill="{C["sub"] if i else C["gold_l"]}">{ln}</text>')


# ======================================================================= A4 lamp standard
def lamp_standard(V, x, h0, s=1.0, detail=2):
    """4 m lamp standard on a bridge post: octagonal panelled base with ogee moulding (U343), fluted shaft with
    gold rings, acanthus collar (U155), twin scroll arms with crystal lanterns, tall centre lantern, star finial"""
    k = s
    if detail == 0:
        rail_post(V, x, h0, .6, 1.6, 0, lantern=False)
        b = h0 + 1.72
        V.rect(x - .09, x + .09, b, b + 3.4, C["pearl"])
        V.path(f"M{pt(x, b+3.0)} C{pt(x-.5, b+3.3)} {pt(x-.9, b+3.0)} {pt(x-.85, b+2.6)}", st=C["gold"], sw=.07)
        V.path(f"M{pt(x, b+3.0)} C{pt(x+.5, b+3.3)} {pt(x+.9, b+3.0)} {pt(x+.85, b+2.6)}", st=C["gold"], sw=.07)
        for lx, lh in ((-.85, b + 2.2), (.85, b + 2.2), (0, b + 3.4)):
            V.glow(x + lx, lh + .3, 1.3, "#ffd0e8", .9)
            V.rect(x + lx - .12, x + lx + .12, lh, lh + .45, "#fff0f6")
            V.poly([(x + lx - .16, lh + .45), (x + lx + .16, lh + .45), (x + lx, lh + .7)], C["gold"])
        return
    gr = V.S.cyl(C["pearl"], "#ffffff", C["white_s"])
    b = h0
    # octagonal plinth (3 faces visible)
    V.rect(x - .42, x + .42, b, b + .12, C["white_s"], C["white_d"], .01)
    V.rect(x - .38, x - .14, b + .12, b + .72, "#e4d6e4", C["white_d"], .01)
    V.rect(x - .14, x + .14, b + .12, b + .72, "#ffffff", C["white_d"], .01)
    V.rect(x + .14, x + .38, b + .12, b + .72, "#d6c4d8", C["white_d"], .01)
    for cx_ in (-.26, 0, .26):
        V.rect(x + cx_ - .08, x + cx_ + .08, b + .2, b + .62, "none", C["gold"], .008)
    # gilded lotus plaque (replaces U343 fleur-de-lis)
    V.path(f"M{pt(x, b+.28)} Q{pt(x-.09, b+.42)} {pt(x, b+.58)} Q{pt(x+.09, b+.42)} {pt(x, b+.28)} Z", C["gold"])
    V.path(f"M{pt(x, b+.28)} Q{pt(x-.12, b+.33)} {pt(x-.11, b+.47)} M{pt(x, b+.28)} Q{pt(x+.12, b+.33)} {pt(x+.11, b+.47)}", st=C["gold"], sw=.015)
    # ogee moulding to shaft
    V.path(f"M{pt(x-.4, b+.72)} L{pt(x+.4, b+.72)} C{pt(x+.4, b+.86)} {pt(x+.14, b+.82)} {pt(x+.13, b+.98)} L{pt(x-.13, b+.98)} "
           f"C{pt(x-.14, b+.82)} {pt(x-.4, b+.86)} {pt(x-.4, b+.72)} Z", gr, C["white_d"], .01)
    V.rect(x - .14, x + .14, b + .98, b + 1.04, C["gold"])
    # fluted shaft
    V.poly([(x - .1, b + 1.04), (x + .1, b + 1.04), (x + .075, b + 3.0), (x - .075, b + 3.0)], gr, C["white_d"], .008)
    for fx in (-.05, -.017, .017, .05):
        V.line(x + fx, b + 1.1, x + fx * .78, b + 2.95, C["white_d"], .006)
    for rh in (1.6, 2.3):
        V.rect(x - .095, x + .095, b + rh, b + rh + .04, C["gold"])
    # acanthus collar
    acanthus_row(V, x - .16, x + .16, b + 3.0, .16, 4)
    V.rect(x - .14, x + .14, b + 3.16, b + 3.2, C["gold"])
    # scroll arms
    for side in (-1, 1):
        V.path(f"M{pt(x, b+3.12)} C{pt(x+side*.35, b+3.0)} {pt(x+side*.7, b+3.3)} {pt(x+side*.72, b+3.55)} "
               f"C{pt(x+side*.73, b+3.75)} {pt(x+side*.52, b+3.78)} {pt(x+side*.5, b+3.62)}", st=C["gold"], sw=.035)
        V.path(f"M{pt(x+side*.08, b+2.85)} C{pt(x+side*.3, b+2.9)} {pt(x+side*.45, b+3.05)} {pt(x+side*.42, b+3.2)} "
               f"C{pt(x+side*.4, b+3.3)} {pt(x+side*.3, b+3.28)} {pt(x+side*.3, b+3.2)}", st=C["gold"], sw=.022)
        V.circle(x + side * .5, b + 3.62, .03, C["gold_l"])
        lx = x + side * .72
        V.line(lx, b + 3.55, lx, b + 3.38, C["gold"], .02)
        crystal_lantern(V, lx, b + 3.0, .55, "#ffc8e4")
    V.rect(x - .03, x + .03, b + 3.2, b + 3.5, C["gold"])
    crystal_lantern(V, x, b + 3.45, .8, "#ffd6f0")
    return b + 4.2


def panel_A4():
    x, y, w, h = 1600, 1060, 780, 760
    cp = S.panel(x, y, w, h, "A4 · Lamp standard (every 5th post)",
                 "Sources: U343 (panelled octagonal base, ogee moulding, plaque, twin arms) · U155 (acanthus candelabra) · U77 U403 (lantern heads) · bridge-design §4",
                 "Blender mesh ≈600 tris, 1 material + emissive crystal; instanced ≈100; real light only on every 4th, rest bloom",
                 "4 m above the 1.5 m post (5.7 m over the deck) · arms span 1.5 m · crystals pink-white #ffd6f0")
    s = 104
    V = View(S, x + 230, y + 690, s, cp)
    with V:
        night_sky(V, -2.2, 5.3, -.2, 6.4, 13, 30)
        V.rect(-2.2, 5.3, -.2, 0, "#efe3ec")
        rail_post(V, 0, 0, .6, 1.5, 2, lantern=False)
        lamp_standard(V, 0, 1.52, 1.0, 2)
        V.figure(-1.4, 0, 1.7)
        ogee_rail(V, .3, 1.8, 1.35)
        tracery_panel(V, .3, .25, 1.5, 1.1, 1)
    V.callout(0, 1.95, 1.5, 2.6, "octagonal panelled base,|gold lotus plaque (was fleur-de-lis)")
    V.callout(.12, 2.4, 1.5, 3.3, "ogee moulding, gold ring")
    V.callout(.08, 3.4, 1.5, 3.85, "fluted shaft, two gold bands")
    V.callout(.15, 4.6, 1.5, 4.45, "acanthus collar")
    V.callout(.6, 5.2, 1.5, 5.1, "C-scroll arms")
    V.callout(0, 5.95, 1.1, 6.15, "centre crystal, star finial")
    V.dim_v(-.75, 1.52, 5.7, "4.2 m", side=-1)


# ======================================================================= A5 domed pavilion
def panel_A5():
    x, y, w, h = 20, 1840, 1000, 820
    cp = S.panel(x, y, w, h, "A5 · Bridge pavilion (Photo Pavilion at 550 m)",
                 "Sources: U279 U280 (chhatri domes, chhajja eaves, lit arcades) · U283 (cusped arches) · U284 (gold ring columns, strapwork) · U292 (hexagram jali)",
                 "Blender mesh ≈3k tris; glass dome = transmissive-look emissive shader with gold rib mesh; jali = alpha-cutout cards; basin uses deck ripple shader",
                 "octagon 18 m across · columns 6 m · dome Ø10 m · finial tip +21 m above the deck")
    s = 27
    V = View(S, x + 330, y + 720, s, cp)
    with V:
        night_sky(V, -12, 13, -1.5, 23, 17, 40)
        V.rect(-12, 13, -1.5, 0, "#efe3ec")
        pavilion(V)
        V.figure(-1.5, .6, 1.7)
    V.callout(0, 15.5, 6.5, 19.5, "glass dome Ø10 m, 16 gold ribs,|violet-pink glow inside")
    V.callout(-7.5, 11.2, -10.5, 16.5, "corner chhatri (U279)", anchor="end")
    V.callout(-5.0, 8.0, -10.5, 12.5, "chhajja eave on brackets", anchor="end")
    V.callout(4.0, 3.0, 9.0, 6.5, "hexagram jali screen (U292)")
    V.callout(-2.5, 5.0, -10.5, 8.5, "cusped arch (U283)", anchor="end")
    V.callout(3.0, .9, 8.5, 1.5, "basin: neon ripple when touched")
    V.callout(-6.1, 3.2, -10.5, 4.5, "white column, gold rings|+ muqarnas capital (U284)", anchor="end")
    V.dim_h(-9, 9, -1.0, "18 m")
    V.dim_v(10.4, 0, 21, "21 m")
    # plan inset
    P = View(S, x + 860, y + 260, 7.5, cp)
    with P:
        oct_ = [(9 * math.cos(math.radians(22.5 + 45 * i)), 9 * math.sin(math.radians(22.5 + 45 * i))) for i in range(8)]
        P.rect(-14, 14, -7, 7, "#2a2142")
        P.rect(-14, 14, -6, 6, "#efe3ec")
        P.poly(oct_, "#f7f2f4", C["gold"], .2)
        for px_, ph in oct_:
            P.circle(px_, ph, .7, C["pearl"], C["gold"], .15)
        P.circle(0, 0, 5.6, "none", C["rose_d"], .5)
        P.circle(0, 0, 3.2, "#2a4f8a", C["gold"], .2)
        P.circle(0, 0, 1.6, "none", NEON[1], .15)
        P.circle(0, 0, 2.6, "none", NEON[4], .1)
        for i in (1, 2, 5, 6):
            a = math.radians(22.5 + 45 * i + 22.5)
            P.line(8.3 * math.cos(a - .35), 8.3 * math.sin(a - .35), 8.3 * math.cos(a + .35), 8.3 * math.sin(a + .35), C["teal"], .5)
    P.label(0, 9.5, "PLAN", 14, C["gold_l"], "middle", dy=-4)
    P.label(0, -9.5, "seat ring · basin · jali on 4 sides", 12, C["sub"], "middle", dy=14)


def pavilion(V):
    white = S.cyl(C["pearl"], "#ffffff", C["lilac"])
    # plinth steps
    V.rect(-9.4, 9.4, 0, .3, C["white_s"], C["white_d"], .05)
    V.rect(-9.0, 9.0, .3, .6, C["lilac"], C["white_d"], .05)
    # interior glow and basin
    V.rect(-8.2, 8.2, .6, 6.6, "#3a2350")
    V.glow(0, 3.5, 7, "#ff8fd0", .55)
    V.ellipse(0, 1.0, 3.2, .45, "#2a4f8a", C["gold"], .08)
    V.ellipse(0, 1.05, 2.0, .26, "none", NEON[1], .08)
    V.ellipse(0, 1.05, 2.8, .36, "none", NEON[4], .05)
    V.rect(-.25, .25, 1.0, 2.0, C["pearl"])
    V.ellipse(0, 2.0, .9, .15, C["pearl"], C["gold"], .05)
    # seat ring glimpsed
    V.rect(-5.6, -3.6, .6, 1.1, C["rose"])
    V.rect(3.6, 5.6, .6, 1.1, C["rose"])
    # columns at -8.2, -4.4(ish) ... 5 columns: -8, -4, 4, 8 + arch spans
    cols = [-8.0, -3.4, 3.4, 8.0]
    spans = [(-8.0, -3.4), (-3.4, 3.4), (3.4, 8.0)]
    # arch screen wall (spandrels) between columns, cusped pointed arches
    V.raw(f'<g>')
    for a, b in spans:
        cx, wd = (a + b) / 2, b - a - .9
        top = 6.4 if b - a > 5 else 5.9
        d, sp = cusped_pointed_d(cx, wd, .6, top, lobes=7 if b - a > 5 else 5)
        # spandrel panel = rect minus arch: draw rect, then 'cut' by drawing the opening in interior colour
        V.rect(a, b, sp - .2, 6.6, white)
        V.path(d, "#3a2350")
        V.path(d, st=C["gold"], sw=.07)
        # spandrel strapwork roundels (U284)
        for sx in (a + .55, b - .55):
            V.circle(sx, 6.05, .3, "none", C["gold"], .04)
            V.poly(star(sx, 6.05, .25, .12, 8), "none", C["gold"], .03)
        if b - a < 5:
            # hexagram jali in the lower part of side bays
            jali_hex(V, a + .45, b - .45, .6, 3.4, .32)
    V.glow(0, 3.5, 4, "#ffb0e0", .3)
    V.raw('</g>')
    for cx in cols:
        column(V, cx, .6, 6.0, .32)
    # entablature with girih band
    V.rect(-8.6, 8.6, 6.6, 7.6, white)
    for i in range(-8, 9):
        V.poly(star(i, 7.1, .3, .15, 8), "none", C["gold"], .04)
    V.line(-8.6, 6.65, 8.6, 6.65, C["gold"], .06)
    V.line(-8.6, 7.55, 8.6, 7.55, C["gold"], .06)
    # chhajja: sloping eave on brackets
    for bx in [i * 1.1 for i in range(-8, 9)]:
        V.poly([(bx - .12, 7.6), (bx + .12, 7.6), (bx + .12, 7.8), (bx - .12, 7.75)], C["white_s"])
    V.poly([(-9.8, 7.75), (9.8, 7.75), (8.8, 8.35), (-8.8, 8.35)], C["roof_l"], C["gold"], .06)
    V.line(-9.8, 7.75, 9.8, 7.75, C["gold"], .08)
    # parapet with kangura merlons
    V.rect(-8.8, 8.8, 8.35, 8.9, white)
    for i in range(-16, 17):
        mx = i * .53
        V.path(f"M{pt(mx-.2, 8.9)} L{pt(mx-.2, 9.15)} Q{pt(mx, 9.4)} {pt(mx+.2, 9.15)} L{pt(mx+.2, 8.9)} Z", C["pearl"], C["gold"], .03)
    # corner chhatris
    for side in (-1, 1):
        cx = side * 7.5
        V.rect(cx - 1.0, cx + 1.0, 8.9, 9.1, C["white_s"])
        for px_ in (-.8, 0, .8):
            V.rect(cx + px_ - .1, cx + px_ + .1, 9.1, 10.6, C["pearl"])
        V.rect(cx - .7, cx + .7, 9.1, 10.4, "#ffd6a0", op=.55)
        V.poly([(cx - 1.3, 10.6), (cx + 1.3, 10.6), (cx + 1.0, 10.9), (cx - 1.0, 10.9)], C["roof_l"], C["gold"], .04)
        V.path(f"M{pt(cx-.95, 10.9)} C{pt(cx-1.1, 11.8)} {pt(cx-.3, 12.0)} {pt(cx, 12.5)} C{pt(cx+.3, 12.0)} {pt(cx+1.1, 11.8)} {pt(cx+.95, 10.9)} Z",
               C["pearl"], C["gold"], .05)
        V.line(cx, 12.5, cx, 13.0, C["gold"], .06)
        V.poly(star(cx, 13.1, .18, .07, 4), C["gold_l"])
    # drum
    V.rect(-4.6, 4.6, 8.9, 11.5, white)
    for i in range(-3, 4):
        d, _ = pointed_d(i * 1.25, .6, 9.4, 11.0, .8)
        V.glow(i * 1.25, 10.2, .7, "#ff9fd0", .6)
        V.path(d, "#ffd0ec", C["gold"], .04)
    V.rect(-4.8, 4.8, 11.4, 11.7, C["pearl"], C["gold"], .05)
    # lotus-petal collar
    for i in range(-5, 6):
        V.path(f"M{pt(i*.9-.45, 11.7)} Q{pt(i*.9, 12.5)} {pt(i*.9+.45, 11.7)} Z", C["pearl"], C["gold"], .04)
    # glass dome
    gd = S.vgrad("#d9b0ff", "#ff8fd0", .85, .9)
    dome = (f"M{pt(-4.6, 11.8)} C{pt(-5.6, 14.0)} {pt(-4.2, 16.4)} {pt(-1.4, 17.2)} C{pt(-.5, 17.5)} {pt(-.2, 17.9)} {pt(0, 18.4)} "
            f"C{pt(.2, 17.9)} {pt(.5, 17.5)} {pt(1.4, 17.2)} C{pt(4.2, 16.4)} {pt(5.6, 14.0)} {pt(4.6, 11.8)} Z")
    V.glow(0, 14.5, 7, "#c58bff", .5)
    V.path(dome, gd, C["gold"], .08)
    # ribs
    for t in (-.8, -.55, -.3, 0, .3, .55, .8):
        xm = t * 5.1
        V.path(f"M{pt(t*4.6, 11.8)} Q{pt(xm*1.05, 15.6)} {pt(0, 18.3)}", st=C["gold"], sw=.07)
    for hh, ww in ((13.2, 5.0), (15.0, 4.3), (16.6, 2.6)):
        V.path(f"M{pt(-ww, hh)} Q{pt(0, hh-.35)} {pt(ww, hh)}", st=C["gold"], sw=.04, op=.8)
    # finial
    V.path(f"M{pt(-.3, 18.3)} Q{pt(-.45, 18.9)} {pt(0, 19.5)} Q{pt(.45, 18.9)} {pt(.3, 18.3)} Z", C["gold"], C["gold_d"], .03)
    V.rect(-.05, .05, 19.5, 20.5, C["gold"])
    for hh in (19.8, 20.1):
        V.circle(0, hh, .12, C["gold"])
    V.poly(star(0, 20.8, .35, .13, 8), C["gold_l"])


def column(V, x, h0, hgt, r):
    g = S.cyl(C["pearl"], "#ffffff", C["white_s"])
    V.rect(x - r * 1.5, x + r * 1.5, h0, h0 + .3, C["pearl"], C["white_d"], .03)
    V.rect(x - r * 1.25, x + r * 1.25, h0 + .3, h0 + .55, C["gold"], C["gold_d"], .02)
    V.rect(x - r, x + r, h0 + .55, h0 + hgt - .8, g, C["white_d"], .02)
    V.rect(x - r * 1.05, x + r * 1.05, h0 + 1.8, h0 + 1.9, C["gold"])
    # muqarnas / acanthus capital
    V.rect(x - r * 1.1, x + r * 1.1, h0 + hgt - .8, h0 + hgt - .7, C["gold"])
    for row, (ww, hh) in enumerate(((1.1, .25), (1.35, .22), (1.6, .2))):
        hb = h0 + hgt - .7 + row * .22
        n = 3 + row
        for i in range(n):
            cx = x - r * ww + (2 * r * ww) * (i + .5) / n
            V.path(f"M{pt(cx-r*ww/n, hb)} L{pt(cx-r*ww/n, hb+hh*.5)} Q{pt(cx, hb+hh*1.1)} {pt(cx+r*ww/n, hb+hh*.5)} L{pt(cx+r*ww/n, hb)} Z",
                   C["gold"] if row % 2 == 0 else C["pearl"], C["gold_d"], .015)


def jali_hex(V, x0, x1, h0, h1, cell):
    """hexagram mashrabiya lattice (U292) inside a rectangle"""
    V.rect(x0, x1, h0, h1, "#ffd6a0", op=.9)
    V.glow((x0 + x1) / 2, (h0 + h1) / 2, (x1 - x0), "#ffb070", .6)
    j = 0
    hh = h0
    cid = S.id("jc")
    S.d(f'<clipPath id="{cid}"><rect x="{f(x0)}" y="{f(-h1)}" width="{f(x1-x0)}" height="{f(h1-h0)}"/></clipPath>')
    V.raw(f'<g clip-path="url(#{cid})">')
    while hh < h1 + cell:
        xx = x0 - (cell * .5 if j % 2 else 0)
        while xx < x1 + cell:
            V.poly(star(xx, hh, cell * .55, cell * .32, 6, rot=90), "none", C["pearl"], cell * .12)
            xx += cell
        hh += cell * .866
        j += 1
    V.raw('</g>')
    V.rect(x0, x1, h0, h1, "none", C["pearl"], cell * .25)


# ======================================================================= A6 Lotus Pond humpback
def panel_A6():
    x, y, w, h = 1040, 1840, 1340, 820
    cp = S.panel(x, y, w, h, "A6 · Lotus Pond humpback bridge (arrival, on the straight approach)",
                 "Sources: U53 U62 (humpback form, bud-capped posts) · U251 (archivolt, keystone, coping) · U152 (balustraded bridge) · U351 U261 (vase balusters) · U258 U259 U292 (lotus pond, candles)",
                 "Blender mesh ≈2.5k tris (arches+balustrade baked to normal map); balusters instanced; lotus + candles instanced emissive; pond = water shader",
                 "80 m long × 18 m wide · deck +2.5 m at the ends → +7.5 m at the crown over the pond (r 32 m) · main arch 22 m")
    s = 14.2
    V = View(S, x + 670, y + 400, s, cp)
    with V:
        night_sky(V, -46, 46, 0, 22, 23, 50)
        water(V, -46, 46, -7, 0)
        gid = S.id("hb")
        V.raw(f'<g id="{gid}">')
        humpback(V)
        V.raw('</g>')
        V.raw(f'<g opacity=".3" transform="scale(1,-1)"><use href="#{gid}"/></g>')
        V.rect(-46, 46, -7, 0, S.vgrad("#1b2550", "#080c22", .3, .9))
        r = random.Random(5)
        for i in range(26):
            px_ = r.uniform(-31, 31)
            if abs(px_) < 2:
                continue
            V.ellipse(px_, -.15 - r.random() * .4, .9, .12, C["leaf"], op=.9)
            if r.random() < .5:
                lotus_lantern(V, px_ + .2, -.1, .7, "#ff9fd0")
            else:
                V.glow(px_ + .5, 0, .8, C["amber"], .8)
                V.rect(px_ + .4, px_ + .6, 0, .2, "#fff3d0")
        V.figure(-6, humph(-6), 1.7)
    V.callout(0, 5.6, 6, 15, "ablaq voussoirs (rose/white), gold lotus keystone")
    V.callout(-15.5, 3.6, -22, 13, "pierced oculus, pink glow", anchor="end")
    V.callout(9, humph(9) + 1.0, 15, 14, "white vase balustrade, gold bullnose rail")
    V.callout(-40, 6.5, -42, 15.5, "end pylon: lotus-globe lamp", anchor="start")
    V.callout(24, humph(24) + 1.8, 30, 12, "newel with lotus-bud cap + lantern (U62 bud caps)")
    V.callout(20, -.1, 30, -4.5, "floating candles + glowing lotus")
    V.dim_h(-11, 11, -5.5, "main arch 22 m")
    V.dim_v(44, 0, 7.5, "+7.5 m")
    # plan
    P = View(S, x + 220, y + 640, 3.3, cp)
    with P:
        P.circle(0, 0, 34, C["pearl"], C["white_d"], .5)
        P.circle(0, 0, 32, "#1d2f5e")
        r = random.Random(9)
        for i in range(40):
            a = r.uniform(0, 6.28)
            d = 6 + math.sqrt(r.random()) * 24
            px_, ph = math.cos(a) * d, math.sin(a) * d
            if abs(px_) < 11:
                continue
            P.circle(px_, ph, 1 + r.random(), C["leaf"])
            if r.random() < .45:
                P.glow(px_, ph, 2.2, "#ff9fd0", .9)
        P.rect(-40, 40, -9, 9, C["pearl"], C["white_d"], .4)
        P.rect(-40, 40, -2.2, 2.2, "#d77fa6")
        P.line(-40, -2.4, 40, -2.4, C["gold"], .5)
        P.line(-40, 2.4, 40, 2.4, C["gold"], .5)
        for side in (-1, 1):
            P.line(-40, side * 9, 40, side * 9, C["white_d"], .8)
            for k in range(-4, 5):
                P.glow(k * 8, side * 9, 3, C["amber"], .9)
    P.label(-40, 34, "PLAN", 14, C["gold_l"], "start", dy=0)
    P.label(40, -2, "→ castle", 12, C["sub"], "start", dx=6)
    P.label(-40, -2, "dais ←", 12, C["sub"], "end", dx=-6)
    # balustrade detail
    B = View(S, x + 560, y + 720, 60, cp)
    with B:
        B.rect(-.2, 6.6, 0, .2, C["pearl"], C["white_d"], .02)
        for i in range(14):
            vase_baluster(B, .45 + i * .4, .2, .75, .16, gold=True)
        B.rect(-.2, 6.6, .95, 1.1, "#ffffff", C["white_d"], .02)
        B.line(-.2, 1.06, 6.6, 1.06, C["gold"], .03)
        B.rect(6.6, 7.2, 0, 1.3, C["pearl"], C["white_d"], .02)
        B.path(f"M{pt(6.65, 1.3)} Q{pt(6.6, 1.75)} {pt(6.9, 2.0)} Q{pt(7.2, 1.75)} {pt(7.15, 1.3)} Z", C["gold"], C["gold_d"], .02)
        B.glow(6.9, 1.7, .8, C["amber"], .6)
    B.label(3.3, 2.0, "BALUSTRADE + NEWEL (detail)", 13, C["gold_l"], "middle")
    B.label(3.3, -.3, "baluster 0.75 m, 0.4 m c/c", 12, C["sub"], "middle", dy=6)


def humph(xx):
    """deck height of the humpback (smooth hump from +2.5 at ±40 to +7.5 at 0)"""
    t = max(0, 1 - (xx / 40) ** 2)
    return 2.5 + 5 * t ** 1.4


def humpback(V):
    xs = [i * .5 for i in range(-80, 81)]
    deck = [(xx, humph(xx)) for xx in xs]
    rose = S.vgrad("#f2c6d4", "#c97f9c")
    V.poly([(-40, -1)] + deck + [(40, -1)], rose, C["rose_d"], .06)
    # coursed stone lines
    for hh in (1.0, 2.0, 3.0, 4.0, 5.0):
        pts = [(xx, hh) for xx in xs if humph(xx) - .9 > hh]
        if pts:
            V.pline(pts, C["rose_d"], .04, .45)
    # arches: main 22 m segmental + two 9 m flood arches
    for (x0, x1, spring, rise, lobes) in ((-11, 11, -.3, 5.6, 0), (-24, -15, -.3, 3.0, 0), (15, 24, -.3, 3.0, 0)):
        d, r = seg_d(x0, x1, -1, spring, rise)
        cx = (x0 + x1) / 2
        # voussoir ring (ablaq)
        R2 = r + 1.0
        n = 23 if x1 - x0 > 15 else 13
        cy = spring + rise - r
        a0 = math.asin((x1 - x0) / 2 / r)
        for i in range(n):
            t0 = -a0 + 2 * a0 * i / n
            t1 = -a0 + 2 * a0 * (i + 1) / n
            p = [(cx + r * math.sin(t0), cy + r * math.cos(t0)), (cx + R2 * math.sin(t0), cy + R2 * math.cos(t0)),
                 (cx + R2 * math.sin(t1), cy + R2 * math.cos(t1)), (cx + r * math.sin(t1), cy + r * math.cos(t1))]
            V.poly(p, C["pearl"] if i % 2 == 0 else C["rose_l"], C["white_d"], .03)
        V.path(d, S.vgrad("#2b1f55", "#141a3e"))
        V.glow(cx, spring + rise * .7, (x1 - x0) * .45, "#ff9fd0", .45)
        # gold archivolt line
        V.path(f"M{pt(cx-R2*math.sin(a0), cy+R2*math.cos(a0))} A{f(R2)} {f(R2)} 0 0 1 {pt(cx+R2*math.sin(a0), cy+R2*math.cos(a0))}", st=C["gold"], sw=.1)
        # keystone with lotus
        V.poly([(cx - .55, spring + rise - .1), (cx + .55, spring + rise - .1), (cx + .75, spring + rise + 1.25), (cx - .75, spring + rise + 1.25)], C["gold"], C["gold_d"], .04)
        V.path(f"M{pt(cx, spring+rise+.15)} Q{pt(cx-.35, spring+rise+.6)} {pt(cx, spring+rise+1.05)} Q{pt(cx+.35, spring+rise+.6)} {pt(cx, spring+rise+.15)} Z", C["gold_l"])
    # oculi in the spandrels
    for ox in (-13.0, 13.0, -27.5, 27.5):
        oh = min(humph(ox) - 1.9, 3.6)
        V.circle(ox, oh, .95, C["pearl"], C["gold"], .06)
        V.glow(ox, oh, 1.6, "#ff9fd0", .7)
        V.circle(ox, oh, .7, "#ffc4e0")
        V.poly(star(ox, oh, .6, .3, 8), "none", C["gold"], .05)
    # string course + coping
    V.pline([(xx, hh - .45) for xx, hh in deck], C["pearl"], .3)
    V.pline([(xx, hh - .32) for xx, hh in deck], C["gold"], .06)
    # balustrade following the hump
    for i in range(-96, 97):
        xx = i * .4
        if abs(xx) > 39:
            continue
        hb = humph(xx)
        vase_baluster(V, xx, hb, .8, .14)
    V.pline([(xx, humph(xx) + .85) for xx in xs if abs(xx) <= 39.5], "#ffffff", .2)
    V.pline([(xx, humph(xx) + .88) for xx in xs if abs(xx) <= 39.5], C["gold"], .05)
    # newels with lotus-bud caps and lanterns
    for nx in (-32, -24, -16, -8, 8, 16, 24, 32):
        hb = humph(nx)
        V.rect(nx - .3, nx + .3, hb, hb + 1.25, C["pearl"], C["white_d"], .04)
        V.line(nx - .3, hb + 1.1, nx + .3, hb + 1.1, C["gold"], .05)
        V.path(f"M{pt(nx-.28, hb+1.25)} Q{pt(nx-.35, hb+1.65)} {pt(nx, hb+2.0)} Q{pt(nx+.35, hb+1.65)} {pt(nx+.28, hb+1.25)} Z", C["gold"], C["gold_d"], .03)
        V.glow(nx, hb + 1.7, 1.4, C["amber"], .8)
    # end pylons with lotus globe lamps
    for side in (-1, 1):
        px_ = side * 40.5
        V.rect(px_ - .9, px_ + .9, -1, 4.6, C["pearl"], C["white_d"], .05)
        V.rect(px_ - 1.1, px_ + 1.1, 4.6, 5.0, C["white_s"], C["gold"], .05)
        V.rect(px_ - .6, px_ + .6, 1.4, 3.6, "#efe3ec", C["gold"], .04)
        V.poly(koch(px_, 2.5, .45, 2), "none", C["gold"], .03)
        V.rect(px_ - .12, px_ + .12, 5.0, 6.6, C["gold"])
        for k in range(6):
            a = math.radians(-60 + k * 24)
            V.path(f"M{pt(px_, 6.6)} Q{pt(px_+.9*math.sin(a)-.2, 6.6+.5)} {pt(px_+.9*math.sin(a), 6.6+.9*math.cos(a)*.8+.2)} "
                   f"Q{pt(px_+.9*math.sin(a)+.2, 6.6+.5)} {pt(px_, 6.6)} Z", "#ffd6ea", C["gold"], .03)
        V.glow(px_, 7.3, 2.8, "#ffe2b0", .9)
        V.circle(px_, 7.3, .5, "#fff3dc")
        V.poly(star(px_, 8.1, .3, .12, 4), C["gold_l"])


# ======================================================================= A7 pink viaduct
def panel_A7():
    x, y, w, h = 20, 2680, 2360, 720
    cp = S.panel(x, y, w, h, "A7 · Pink arched viaduct — Grand Approach over the lake to the stair-foot pool",
                 "Sources: U278 (rose Mughal viaduct: arches in rectangular frames, jali parapet) · U280 U279 (guldasta turrets, chhatri tops) · U283 (cusped arches) · U401 (two-tier arcade) · U95 (piers in water)",
                 "bay = Blender mesh ≈900 tris + normal map, lower piers stretch with ground height; jali parapet alpha-cutout; 1 warm glow card under each arch",
                 "26 m bays × ~23 bays · 18 m wide · deck rises +34 → +90 m over 600 m (9.4%) · gallery tier 7 m constant, lower arches grow")
    s = 11.5
    V = View(S, x + 70, y + 560, s, cp)
    D0, sl = 27.0, .094
    with V:
        night_sky(V, -4, 96, 0, 44, 31, 70)
        water(V, -4, 96, -8, 0)
        gid = S.id("vd")
        V.raw(f'<g id="{gid}">')
        for b in range(4):
            viaduct_bay(V, b * 26, D0, sl)
        V.raw('</g>')
        V.raw(f'<g opacity=".28" transform="scale(1,-1)"><use href="#{gid}"/></g>')
        V.rect(-4, 96, -8, 0, S.vgrad("#1b2550", "#080c22", .3, .9))
        V.figure(40, D0 + sl * 40, 1.7)
    V.callout(13, 14, 6, 40, "tall cusped Mughal arch in a rectangular|white-framed panel (alfiz), U278", anchor="start")
    V.callout(26, 33.5, 31, 41.5, "guldasta turret with lotus dome on every pier")
    V.callout(47, D0 + sl * 47 - 4.0, 56, 41.5, "gallery tier: 3 cusped arches per bay (U278)")
    V.callout(70, D0 + sl * 70 + .6, 80, 40, "jali parapet (U278) + iron lamp every 13 m")
    V.callout(13, 6, 21, 4, "warm glow under each arch")
    V.dim_h(0, 26, -6, "26 m bay")
    # detail of one arch frame + parapet module at larger scale
    s2 = 21
    Q = View(S, x + 1370, y + 600, s2, cp)
    with Q:
        night_sky(Q, -3, 29, -1, 23, 37, 20)
        viaduct_detail(Q)
        Q.figure(20.5, 16.0 + 0.05, 1.7)
    Q.label(13, 22.6, "DETAIL · gallery arch, spandrel, cornice, jali parapet, guldasta", 15, C["gold_l"], "middle")
    Q.callout(2, 20.5, -2.2, 21.3, "lotus dome + star", anchor="start")
    Q.callout(8, 12.4, 4, 7.0, "cusped arch, gold line", anchor="end")
    Q.callout(13.5, 15.2, 18, 9.0, "girih star frieze")
    Q.callout(24, 16.8, 27.5, 12.5, "jali parapet panel|1.2 m, square posts")
    # longitudinal profile key
    K = View(S, x + 2020, y + 140, .5, cp)
    with K:
        K.rect(-10, 640, -5, 120, "#1b1736")
        K.line(0, 0, 640, 0, "#3a5aa0", 1.4)
        K.line(0, 34, 595, 90, C["rose"], 2.5)
        for i in range(24):
            xx = i * 26
            K.line(xx, 0, xx, 34 + (90 - 34) * xx / 595, C["rose_d"], 1.0)
        K.rect(595, 640, 0, 90, "#5a3f6e")
    K.label(0, 120, "PROFILE (600 m)", 13, C["gold_l"], "start", dy=-4)
    K.label(0, 34, "+34 pond end", 11, C["sub"], "start", dy=-6)
    K.label(595, 90, "+90 stair foot", 11, C["sub"], "end", dy=-6)


def viaduct_bay(V, x0, D0, sl):
    """one 26 m bay starting at pier centre x0"""
    xc = x0 + 13
    Dc = D0 + sl * xc
    rose = S.vgrad("#f3c3d1", "#c27a97")
    top_l, top_r = D0 + sl * x0, D0 + sl * (x0 + 26)
    V.poly([(x0, -1), (x0 + 26, -1), (x0 + 26, top_r - 2.6), (x0, top_l - 2.6)], rose)
    # lower arch: tall cusped pointed arch in an alfiz frame
    apex = Dc - 10.6
    fr0, fr1 = x0 + 3.2, x0 + 22.8
    V.rect(fr0 - .5, fr1 + .5, -1, apex + 1.4, C["pearl"])
    V.rect(fr0, fr1, -1, apex + .9, "#e7a9c0")
    V.line(fr0 - .25, apex + 1.15, fr1 + .25, apex + 1.15, C["gold"], .12)
    d, sp = cusped_pointed_d(xc, 18.4, -1, apex, lobes=9, k=.85)
    V.path(d, S.vgrad("#2b1f55", "#141a3e"))
    V.glow(xc, sp + 3, 10, "#ffb070", .4)
    V.path(d, st=C["gold"], sw=.12)
    # spandrel roundels (gold arabesque)
    for sx in (fr0 + 1.9, fr1 - 1.9):
        V.circle(sx, apex - 1.2, 1.2, C["rose_l"], C["gold"], .1)
        V.poly(star(sx, apex - 1.2, 1.0, .45, 8), "none", C["gold"], .08)
    # band
    bnd = Dc - 9.6
    V.rect(x0, x0 + 26, bnd, bnd + .7, C["pearl"])
    V.line(x0, bnd + .35, x0 + 26, bnd + .35, C["gold"], .1)
    # gallery: 3 cusped arches
    for k in range(3):
        gc = x0 + 4.8 + k * 8.2
        gd = cusped_d(gc, 5.6, bnd + .7, bnd + 2.6, 7, .07)
        V.path(round_d(gc, 6.4, bnd + .7, bnd + 2.6 + 3.2)[0], "#f6d2dc")
        V.path(gd, S.vgrad("#3a2350", "#1d1840"))
        V.glow(gc, bnd + 3.5, 3.2, "#ffd6a0", .5)
        V.path(gd, st=C["gold"], sw=.08)
    # cornice (sloped) with girih frieze
    V.poly([(x0, top_l - 2.6), (x0 + 26, top_r - 2.6), (x0 + 26, top_r), (x0, top_l)], C["pearl"])
    V.line(x0, top_l - 2.0, x0 + 26, top_r - 2.0, C["gold"], .08)
    for i in range(26):
        V.poly(star(x0 + i + .5, D0 + sl * (x0 + i + .5) - 1.2, .4, .2, 8), "none", C["gold"], .06)
    V.line(x0, top_l - .4, x0 + 26, top_r - .4, C["gold"], .08)
    # jali parapet
    for i in range(13):
        a = x0 + i * 2
        ha, hb_ = D0 + sl * a, D0 + sl * (a + 2)
        V.poly([(a + .2, ha), (a + 1.8, hb_ - .16), (a + 1.8, hb_ + 1.04), (a + .2, ha + 1.2)], "#f3e2ea", C["white_d"], .04)
        for gx in range(5):
            for gy in range(3):
                xx = a + .45 + gx * .3
                hh = D0 + sl * xx + .25 + gy * .3
                V.rect(xx - .09, xx + .09, hh - .09, hh + .09, "#2a2050")
        V.rect(a - .2, a + .2, ha, ha + 1.45, C["pearl"], C["white_d"], .04)
    V.pline([(x0, top_l + 1.2), (x0 + 26, top_r + 1.2)], "#ffffff", .2)
    # lamps
    for lx in (x0 + 6.5, x0 + 19.5):
        lh = D0 + sl * lx
        V.rect(lx - .1, lx + .1, lh + 1.2, lh + 5.3, C["iron"])
        V.glow(lx, lh + 5.6, 2.2, C["amber"], .9)
        V.circle(lx, lh + 5.6, .4, "#ffe8c0")
    # pier with guldasta turret
    for px_ in (x0,):
        guldasta(V, px_, -1, D0 + sl * px_ + 3.6)


def guldasta(V, x, h0, h1):
    g = S.cyl(C["rose"], C["rose_l"], C["rose_d"])
    V.rect(x - 1.9, x + 1.9, h0, h0 + 2.2, C["rose_d"])
    V.rect(x - .9, x + .9, h0, h1 - 1.6, g, C["rose_d"], .05)
    hh = h0 + 4
    while hh < h1 - 3:
        V.rect(x - 1.0, x + 1.0, hh, hh + .25, C["pearl"])
        V.line(x - 1.0, hh + .12, x + 1.0, hh + .12, C["gold"], .06)
        hh += 6
    # open kiosk top
    V.rect(x - 1.1, x + 1.1, h1 - 1.6, h1 - 1.4, C["pearl"], C["gold"], .04)
    for px_ in (-.8, 0, .8):
        V.rect(x + px_ - .12, x + px_ + .12, h1 - 1.4, h1 - .2, C["pearl"])
    V.glow(x, h1 - .8, 1.6, C["amber"], .7)
    V.poly([(x - 1.3, h1 - .2), (x + 1.3, h1 - .2), (x + 1.0, h1 + .1), (x - 1.0, h1 + .1)], C["roof_l"], C["gold"], .04)
    V.path(f"M{pt(x-.9, h1+.1)} C{pt(x-1.1, h1+1.0)} {pt(x-.3, h1+1.2)} {pt(x, h1+1.8)} C{pt(x+.3, h1+1.2)} {pt(x+1.1, h1+1.0)} {pt(x+.9, h1+.1)} Z", C["pearl"], C["gold"], .05)
    V.line(x, h1 + 1.8, x, h1 + 2.3, C["gold"], .08)
    V.poly(star(x, h1 + 2.45, .25, .1, 4), C["gold_l"])


def viaduct_detail(Q):
    D = 16.0
    rose = S.vgrad("#f3c3d1", "#c27a97")
    Q.rect(0, 26, -1, D, rose)
    bnd = D - 9.6 + 2.6
    Q.rect(0, 26, bnd, bnd + .7, C["pearl"])
    Q.line(0, bnd + .35, 26, bnd + .35, C["gold"], .1)
    for k in range(3):
        gc = 4.8 + k * 8.2
        Q.path(round_d(gc, 6.4, bnd + .7, bnd + 2.6 + 3.2)[0], "#f6d2dc")
        Q.path(round_d(gc, 6.4, bnd + .7, bnd + 2.6 + 3.2)[0].replace(" Z", ""), st=C["gold_d"], sw=.06)
        gd = cusped_d(gc, 5.6, bnd + .7, bnd + 2.6, 7, .07)
        Q.path(gd, S.vgrad("#3a2350", "#1d1840"))
        Q.glow(gc, bnd + 3.5, 3.2, "#ffd6a0", .6)
        Q.path(gd, st=C["gold"], sw=.08)
        Q.rect(gc - 1.2, gc + 1.2, bnd + .7, bnd + 1.6, "#f3e2ea", C["white_d"], .03)
        for gx in range(6):
            Q.rect(gc - 1.05 + gx * .38, gc - .85 + gx * .38, bnd + .9, bnd + 1.4, "#2a2050")
    for sx in (8.9, 17.1):
        Q.circle(sx, bnd + 5.0, .9, C["rose_l"], C["gold"], .08)
        Q.poly(star(sx, bnd + 5.0, .75, .35, 8), "none", C["gold"], .06)
        Q.poly(star(sx, bnd + 5.0, .3, .15, 8), C["gold"])
    Q.rect(0, 26, D - 2.6, D, C["pearl"])
    Q.line(0, D - 2.0, 26, D - 2.0, C["gold"], .08)
    for i in range(26):
        Q.poly(star(i + .5, D - 1.2, .4, .2, 8), "none", C["gold"], .06)
        Q.circle(i + .5, D - 1.2, .08, C["gold"])
    Q.line(0, D - .4, 26, D - .4, C["gold"], .08)
    for i in range(13):
        a = i * 2
        Q.rect(a + .2, a + 1.8, D, D + 1.2, "#f3e2ea", C["white_d"], .04)
        for gx in range(5):
            for gy in range(3):
                xx = a + .45 + gx * .3
                hh = D + .25 + gy * .3
                Q.rect(xx - .09, xx + .09, hh - .09, hh + .09, "#2a2050")
        Q.rect(a - .2, a + .2, D, D + 1.45, C["pearl"], C["white_d"], .04)
    Q.rect(0, 26, D + 1.2, D + 1.4, "#ffffff")
    guldasta(Q, 2, -1, D + 3.6)
    guldasta(Q, 26 + 2, -1, D + 3.6)


header()
panel_A1()
panel_A2()
panel_A3()
panel_A4()
panel_A5()
panel_A6()
panel_A7()
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), f"bridges-a-r{ROUND}.svg")
S.save(out)
print(out, W, H)
