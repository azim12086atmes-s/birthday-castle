"""Artifacts sheet A: outdoor props (lamps and lanterns, fountains, garden objects and statues, sitouts and planters).

Run:  python3 -B artifacts_a.py <round>   -> artifacts-a.svg (+ render to artifacts-a-r<round>.png)
"""
import sys, math, random
sys.path.insert(0, __file__.rsplit("/", 1)[0])
from artlib import *

ROUND = int(sys.argv[1]) if len(sys.argv) > 1 else 1
W, H = 2400, 3420
S = Sheet(W, H)


# =============================================================================================== shared parts
def octa_base(S, w=0.5, h0=0.12, h1=0.75, plinth=0.66, capw=0.6, gold_rim=True):
    """Octagonal panelled cast-iron pedestal (U343): plinth, three visible faces with sunk panels, ogee cap."""
    R(S, -plinth / 2, plinth / 2, 0, h0 * 0.55, P["iron_d"])
    PL(S, [(-plinth / 2, h0 * .55), (plinth / 2, h0 * .55), (w / 2 + .03, h0), (-w / 2 - .03, h0)], P["iron"])
    LN(S, -plinth / 2, h0 * .55, plinth / 2, h0 * .55, P["iron_l"], 1, .7)
    f = w * 0.2071  # half-width of the front face of an octagon of width w
    R(S, -w / 2, -f, h0, h1, "#241b2e")
    R(S, f, w / 2, h0, h1, "#1a1322")
    R(S, -f, f, h0, h1, "#3a2d48")
    for a, b, c in ((-w / 2, -f, "#120d18"), (-f, f, "#1d1526"), (f, w / 2, "#0e0a13")):
        m = (b - a) * 0.18
        R(S, a + m, b - m, h0 + .07, h1 - .07, c, P["iron_l"], .8, .9)
        R(S, a + m * 1.8, b - m * 1.8, h0 + .12, h1 - .12, "none", P["gold_d"] if gold_rim else P["iron_l"], .7, .7)
    LN(S, -f, h0, -f, h1, P["iron_l"], 1.1, .8)
    # ogee cap
    lathe(S, [(w / 2 + .02, h1), (capw / 2, h1 + .04), (capw / 2 - .01, h1 + .08), (w / 2 - .05, h1 + .12), (.16, h1 + .17), (.1, h1 + .22)], iron(S))
    if gold_rim:
        LN(S, -capw / 2, h1 + .06, capw / 2, h1 + .06, P["gold"], 1.4, .9)


def lantern_vase(S, x, h, s=1.0, col=None, halo=True):
    """Tall vase lantern (U343 heads, U403 tapered heads): glass widens upward, bell cap, star finial."""
    col = col or P["amber"]
    with Sub(S, x, h, sc=s):
        if halo:
            glow(S, 0, .33, .62, col, .45)
            glow(S, 0, .3, .28, P["warm"], .5)
        lathe(S, [(.012, -.13), (.03, -.09), (.045, -.03), (.085, .02), (.1, .07)], iron(S))
        PL(S, [(-.085, .08), (.085, .08), (.17, .55), (-.17, .55)], glass(S, col))
        E(S, 0, .24, .03, .07, P["warm"])
        for f in (-1, -.36, .36, 1):
            LN(S, f * .085, .08, f * .17, .55, P["iron"], 1.6)
        LN(S, -.13, .34, .13, .34, P["iron"], 1.1)
        R(S, -.19, .19, .55, .6, P["iron"])
        LN(S, -.19, .6, .19, .6, P["gold"], 1.2)
        lathe(S, [(.235, .6), (.2, .63), (.13, .67), (.105, .73), (.07, .81), (.03, .87), (.015, .96)], iron(S))
        PA(S, f"M{M(-.2,.63)} Q{M(0,.69)} {M(.2,.63)}", st=P["iron_l"], w=1, op=.8)
        star(S, 0, 1.0, .05, fill=P["gold_l"])


def lantern_hex(S, x, h, s=1.0, col=None, lattice=True):
    """Hexagonal lantern (U176, U234): three visible faces, flared hex hood with curl, tapered foot with drop.
    (x, h) is the hanging ring at the top."""
    col = col or P["amber"]
    with Sub(S, x, h, sc=s):
        glow(S, 0, -.38, .7, col, .4)
        # ring + finial curl
        C(S, 0, -.02, .03, "none", P["iron_l"], 1.4)
        scroll(S, .03, -.07, .035, 1.2, 180, False, P["iron_l"], 1.3, 1, .7, False)
        # hood
        PL(S, [(-.23, -.2), (0, -.06), (.23, -.2)], P["iron"])
        PL(S, [(-.23, -.2), (-.08, -.2), (0, -.06)], "#3a2d48")
        PL(S, [(-.08, -.2), (.08, -.2), (0, -.06)], P["iron_l"], op=.6)
        R(S, -.24, .24, -.235, -.2, P["iron"])
        LN(S, -.24, -.2, .24, -.2, P["gold"], 1.3)
        # body: centre face + two foreshortened faces
        R(S, -.2, -.1, -.6, -.235, glass(S, col), op=.8)
        R(S, .1, .2, -.6, -.235, glass(S, col), op=.7)
        R(S, -.1, .1, -.6, -.235, glass(S, col))
        E(S, 0, -.47, .035, .07, P["warm"])
        if lattice:
            for i in range(-3, 4):
                LN(S, -.1 + .05 * (i + 3) - .05, -.6, -.1 + .05 * (i + 3) + .1, -.235, P["iron"], .6, .55)
                LN(S, -.1 + .05 * (i + 3) + .1, -.6, -.1 + .05 * (i + 3) - .05, -.235, P["iron"], .6, .55)
            R(S, -.2, .2, -.6, -.235, "none", "none")
        for xx in (-.2, -.1, .1, .2):
            LN(S, xx, -.6, xx, -.235, P["iron"], 1.8)
        R(S, -.21, .21, -.63, -.6, P["iron"])
        PL(S, [(-.17, -.63), (.17, -.63), (.05, -.72), (-.05, -.72)], iron(S))
        lathe(S, [(.012, -.82), (.03, -.78), (.04, -.75), (.02, -.72)], P["gold"])


def light_pool(S, x, r, col=None, op=.45):
    E(S, x, 0, r, r * .09, rg(S, col or P["amber"], col or P["amber"], .9, 0), op=op)


# =============================================================================================== row 1: lights
def it_twin_post(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Twin-lantern cast-iron post", "U343 base, arm, plaque · U403 tall heads · U352 night glow",
                     ["Octagonal panelled base with ogee cap and a gold-traced sunk panel on every face; fluted post with three gold collars and a lotus-fleur plaque; "
                      "cross arm with down-curled scrolls carries two vase lanterns; star finials, no crosses.",
                      "Build: Blender mesh baked to a light model (~1.2k tris), glass = emissive shader, one shared point light per pair."],
                     "4.6 m tall · arm 1.4 m · base 0.66 m · every 20 m on the Long Bridge", 1)
    k = 118
    with G(S, x + 150, bot - 6, k):
        ground(S, -1.15, 1.5)
        light_pool(S, 0, 1.5)
        octa_base(S)
        lathe(S, [(.1, .97), (.13, 1.02), (.12, 1.1), (.08, 1.16)], iron(S))
        PL(S, [(-.075, 1.16), (.075, 1.16), (.05, 3.42), (-.05, 3.42)], iron(S))
        for i in (-2, -1, 0, 1, 2):
            LN(S, i * .022, 1.2, i * .015, 3.38, P["iron_d"], .7, .7)
        for hh, wd in ((1.18, .1), (2.3, .085), (3.05, .075)):
            R(S, -wd, wd, hh, hh + .05, goldf(S))
            LN(S, -wd, hh + .05, wd, hh + .05, P["gold_l"], .8)
        # lotus-fleur plaque
        PA(S, f"M{M(0,1.42)} Q{M(-.13,1.52)} {M(-.11,1.68)} Q{M(-.05,1.78)} {M(0,1.86)} Q{M(.05,1.78)} {M(.11,1.68)} Q{M(.13,1.52)} {M(0,1.42)} Z",
           goldf(S), P["gold_dd"], .8)
        PA(S, f"M{M(0,1.47)} Q{M(-.05,1.6)} {M(0,1.8)} Q{M(.05,1.6)} {M(0,1.47)}", P["gold_l"])
        PA(S, f"M{M(-.02,1.55)} Q{M(-.1,1.6)} {M(-.08,1.7)}", st=P["gold_dd"], w=1)
        PA(S, f"M{M(.02,1.55)} Q{M(.1,1.6)} {M(.08,1.7)}", st=P["gold_dd"], w=1)
        # cross arm
        R(S, -.7, .7, 3.4, 3.46, iron(S))
        LN(S, -.7, 3.46, .7, 3.46, P["iron_l"], 1)
        for sd in (-1, 1):
            PA(S, smooth([(sd * .05, 3.2), (sd * .25, 3.33), (sd * .48, 3.38), (sd * .6, 3.33), (sd * .62, 3.25)]), st=P["iron_l"], w=2.4)
            scroll(S, sd * .57, 3.27, .05, 1.3, 0 if sd > 0 else 180, sd > 0, P["iron_l"], 2.0, 1, .7)
            scroll(S, sd * .12, 3.27, .06, 1.2, 180 if sd > 0 else 0, sd < 0, P["iron_l"], 1.6, 1, .7)
            lathe(S, [(.03, 3.46), (.06, 3.49), (.07, 3.52)], P["iron"], x=sd * .66)
            lantern_vase(S, sd * .66, 3.55)
        lathe(S, [(.05, 3.46), (.09, 3.55), (.08, 3.68), (.04, 3.75), (.02, 3.95)], iron(S))
        star(S, 0, 4.0, .06, fill=P["gold_l"])
        figure(S, 1.15, 0)
    # inset: lantern head, 2.3x
    ix, iy = x + w - 70, top + 175
    S.a(f'<circle cx="{ix}" cy="{iy-60}" r="68" fill="#0d0a1c" stroke="{P["gold_d"]}" stroke-width="1"/>')
    with G(S, ix, iy, 118 * 1.9):
        lantern_vase(S, 0, 0.0, halo=False)
    T(S, ix, iy + 38, "head ×1.9", 12, P["ink3"], "middle", italic=True)
    T(S, ix, iy + 53, "diamond-leaded glass", 11, P["ink3"], "middle", italic=True)


def it_candelabra(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Acanthus globe candelabra", "U155 arms, globes, lattice base · U152 heads · U352 collars",
                     ["Tapered square base pierced with pointed arches over a gold lattice; vase knop on the shaft; an acanthus collar sends out four "
                      "S-scroll arms with leaf sheaths to five opal globes; gold lotus-bud finial instead of the pineapple.",
                      "Build: Blender mesh baked (~2k tris) + leaf normal map; globes = emissive opal shader (pink-to-amber fresnel)."],
                     "5.3 m tall · spread 1.9 m · forecourt, ballroom terrace", 2)
    k = 108
    with G(S, x + w / 2, bot - 6, k):
        ground(S, -1.6, 1.6)
        light_pool(S, 0, 1.6, P["amber"], .5)
        # pierced lattice base
        PL(S, [(-.48, 0), (.48, 0), (.48, .12), (-.48, .12)], P["iron_d"])
        base = [(-.42, .12), (.42, .12), (.21, 1.25), (-.21, 1.25)]
        PL(S, base, iron(S))
        for i in range(7):
            t0, t1 = i / 7, (i + 1) / 7
            ha, hb = .12 + t0 * 1.13, .12 + t1 * 1.13
            wa, wb = .42 - .21 * t0, .42 - .21 * t1
            LN(S, -wa, ha, wb, hb, P["gold_d"], .9, .8)
            LN(S, wa, ha, -wb, hb, P["gold_d"], .9, .8)
        d, _ = pointed_arch_d(0, .26, .2, .78)
        PA(S, d, "#0c0814", P["gold"], 1.2)
        glow(S, 0, .45, .16, P["amber"], .5)
        for sd in (-1, 1):
            LN(S, sd * .42, .12, sd * .21, 1.25, P["gold"], 1.6)
        R(S, -.27, .27, 1.25, 1.32, goldf(S))
        R(S, -.22, .22, 1.32, 1.38, iron(S))
        # shaft and knop
        PL(S, [(-.07, 1.38), (.07, 1.38), (.05, 2.95), (-.05, 2.95)], iron(S))
        lathe(S, [(.06, 1.95), (.15, 2.05), (.16, 2.15), (.1, 2.28), (.06, 2.32)], iron(S))
        R(S, -.1, .1, 2.0, 2.04, P["gold"])
        # acanthus collar
        for a in (100, 80, 120, 60, 140, 40):
            leaf(S, 0, 2.95, .34, a, .3, cyl(S, P["iron"], P["iron_l"], P["iron_d"]), P["gold_d"], .8)
        R(S, -.09, .09, 2.92, 2.98, P["gold"])
        # arms: lower pair and upper pair
        for sd in (-1, 1):
            pts = [(0, 3.05), (sd * .25, 3.0), (sd * .5, 3.15), (sd * .7, 3.45), (sd * .78, 3.65)]
            PA(S, smooth(pts), st=P["iron_l"], w=4.2)
            PA(S, smooth(pts), st=P["iron"], w=2.4)
            scroll(S, sd * .42, 2.9, .11, 1.3, 270, sd > 0, P["iron_l"], 2.4, 1, .75)
            for t, ang in ((.35, 60), (.6, 70)):
                xx, hh = pts[int(t * 4)]
                leaf(S, xx, hh, .2, 90 - sd * ang, .32, P["iron"], P["gold_d"], .7)
            pts2 = [(0, 3.4), (sd * .2, 3.5), (sd * .38, 3.75), (sd * .45, 4.05)]
            PA(S, smooth(pts2), st=P["iron_l"], w=3.6)
            PA(S, smooth(pts2), st=P["iron"], w=2.0)
            scroll(S, sd * .27, 3.36, .08, 1.3, 270, sd > 0, P["iron_l"], 2.0, 1, .75)
            for gx, gh in ((sd * .78, 3.65), (sd * .45, 4.05)):
                lathe(S, [(.03, gh - .02), (.08, gh + .04), (.1, gh + .08)], goldf(S), x=gx)
                glow(S, gx, gh + .3, .55, P["amber"], .45)
                C(S, gx, gh + .3, .22, glass_c(S, "#fff4dc", "#f2b38a"))
                C(S, gx - .07, gh + .37, .05, "#ffffff", op=.5)
        lathe(S, [(.05, 2.98), (.05, 4.2), (.09, 4.25), (.1, 4.3)], iron(S), sm=False)
        glow(S, 0, 4.55, .6, P["amber"], .45)
        C(S, 0, 4.55, .25, glass_c(S, "#fff4dc", "#f2b38a"))
        C(S, -.08, 4.63, .06, "#ffffff", op=.5)
        lathe(S, [(.03, 4.78), (.08, 4.84), (.1, 4.95), (.07, 5.08), (.02, 5.2), (.005, 5.28)], goldf(S))
        for hh in (4.88, 4.96, 5.04):
            PA(S, f"M{M(-.08,hh)} Q{M(0,hh+.05)} {M(.08,hh)}", st=P["gold_dd"], w=.8)
        figure(S, 1.3, 0)


def it_crystal_post(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Crystal lantern", "U129 crystal spikes · U354 pink crystals · U219 slim lamp",
                     ["A faceted rose crystal held in a gold claw of four curved prongs on a slim marble shaft wound with a gold ribbon; raw crystal cluster at the foot.",
                      "Build: mesh (~600 tris); crystal = refractive-look emissive shader with facet normals; sparkle particles."],
                     "3.3 m · Glowwood paths, Lantern Cove, stair flanks", 3)
    k = 118
    with G(S, x + w / 2 - 10, bot - 6, k):
        ground(S, -1.0, 1.05)
        light_pool(S, 0, 1.1, P["pink"], .55)
        # crystal cluster at foot
        for cx, hh, wd, c in ((-.32, .5, .1, P["violet"]), (-.2, .7, .12, P["pink"]), (.25, .55, .11, P["pink"]), (.36, .38, .08, P["violet"])):
            PL(S, [(cx - wd, 0), (cx - wd * .6, hh * .8), (cx, hh), (cx + wd * .6, hh * .8), (cx + wd, 0)], c, op=.85)
            PL(S, [(cx, 0), (cx, hh), (cx + wd * .6, hh * .8), (cx + wd, 0)], "#ffffff", op=.25)
        lathe(S, [(.24, 0), (.24, .1), (.18, .14), (.16, .24), (.1, .3), (.07, .36)], marblef(S))
        R(S, -.065, .065, .36, 2.28, marblef(S))
        for i in range(10):
            hh = .4 + i * .19
            PA(S, f"M{M(-.065,hh)} Q{M(0,hh+.06)} {M(.065,hh+.1)}", st=P["gold"], w=1.8)
        lathe(S, [(.07, 2.28), (.12, 2.32), (.13, 2.38), (.08, 2.42)], goldf(S))
        cx, c0, c1 = 0, 2.48, 3.22
        glow(S, 0, 2.85, 1.0, P["pink"], .5)
        glow(S, 0, 2.85, .45, "#ffd1ec", .55)
        # crystal: elongated hex bipyramid
        top_, bot_ = (0, c1), (0, c0)
        lft, rgt = (-.17, 2.95), (.17, 2.95)
        ml, mr = (-.07, 3.0), (.07, 3.0)
        PL(S, [bot_, lft, (-.17, 2.75)], "#c35aa8")
        PL(S, [bot_, (-.17, 2.75), lft, ml, (0, 2.62)], "#e98ccc")
        PL(S, [bot_, (0, 2.62), mr, rgt, (.17, 2.75)], "#ffb8e2")
        PL(S, [lft, top_, ml], "#9d5cc8")
        PL(S, [ml, top_, mr], "#ffd8f0")
        PL(S, [mr, top_, rgt], "#f39ad6")
        PL(S, [ml, mr, (0, 2.62)], "#fff0fa", op=.85)
        LN(S, 0, c0, 0, c1, "#ffffff", .8, .5)
        # claw prongs
        for sd in (-1, 1):
            PA(S, smooth([(sd * .07, 2.42), (sd * .2, 2.55), (sd * .21, 2.8), (sd * .14, 3.02)]), st=P["gold"], w=3.0)
            PA(S, smooth([(sd * .03, 2.42), (sd * .09, 2.6), (sd * .08, 2.82), (sd * .05, 3.0)]), st=P["gold_d"], w=2.0)
            C(S, sd * .14, 3.02, .018, P["gold_l"])
        star(S, 0, 3.32, .07, fill=P["gold_l"])
        for sx, sh, r in ((-.45, 3.1, .05), (.4, 2.6, .04), (.3, 3.3, .035), (-.35, 2.4, .03), (.5, 3.0, .03)):
            sparkle(S, sx, sh, r)
        figure(S, .78, 0)


def it_hex_bracket(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Hexagonal lantern on scroll bracket", "U176 hex lantern + curl · U343 arrow arm and spirals · U234 wall bracket",
                     ["Wall plate with curled ends; twisted arm ending in a spear tip, braced by an S-scroll above and a big spiral below filled with small curls; "
                      "the hex lantern hangs on a ring and chain, diamond-leaded glass, flared hood with a curl.",
                      "Build: bracket = alpha cutout card pair (or thin mesh), lantern = mesh ~400 tris, emissive glass."],
                     "arm 1.05 m · lantern 0.8 m · fixed at 3.2 m on castle walls, gatehouse, lanes", 4)
    k = 205
    ox, oy = x + 40, top + 40
    with G(S, ox, oy + 1.55 * k, k):
        # wall
        R(S, -.2, .0, -.2, 1.5, pinkf(S))
        for hh in (-.05, .3, .65, 1.0, 1.35):
            LN(S, -.2, hh, 0, hh, P["wall_d"], .8, .7)
        LN(S, 0, -.2, 0, 1.5, P["wall_dd"], 1.5)
        # wall plate
        R(S, .0, .045, .32, 1.32, iron(S))
        scroll(S, .1, 1.36, .06, 1.2, 180, True, P["iron_l"], 2.2)
        scroll(S, .1, .28, .06, 1.2, 180, False, P["iron_l"], 2.2)
        # arm
        R(S, .045, 1.04, 1.13, 1.165, iron(S))
        for i in range(18):
            xx = .08 + i * .053
            LN(S, xx, 1.13, xx + .02, 1.165, P["iron_l"], .7, .7)
        PL(S, [(1.04, 1.11), (1.12, 1.1475), (1.04, 1.185), (1.06, 1.1475)], P["iron_l"])
        C(S, 1.0, 1.1475, .02, P["gold"])
        # top S brace
        PA(S, smooth([(.045, 1.36), (.2, 1.38), (.38, 1.3), (.5, 1.2), (.58, 1.165)]), st=P["iron_l"], w=2.6)
        scroll(S, .25, 1.42, .05, 1.2, 0, False, P["iron_l"], 1.8)
        # big lower spiral + small curls
        PA(S, smooth([(.045, .45), (.15, .62), (.3, .85), (.5, 1.02), (.72, 1.12)]), st=P["iron_l"], w=2.6)
        scroll(S, .2, .85, .15, 1.6, 200, True, P["iron_l"], 2.2, 1, .85)
        for cx in (.42, .58, .74):
            scroll(S, cx, 1.06, .045, 1.3, 0, True, P["iron_l"], 1.6, 1, .8)
        # chain and lantern
        C(S, .86, 1.12, .022, "none", P["iron_l"], 1.6)
        chain(S, .86, 1.1, .86, .96, .035)
        lantern_hex(S, .86, .95)
        scale_bar(S, -.15, -.3, 1)
        TM(S, .35, -.42, "1 m", .07, P["ink3"])


def it_acorn(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Pier-top acorn lantern", "U352 pier lanterns · U397 bollard glow",
                     ["Pink stucco pier with soft rounded cap; iron plinth carries an acorn of ribbed opal glass under a fluted cap and gold knob.",
                      "Build: mesh ~300 tris, instanced on every stair and walkway pier."],
                     "pier 1.1 m · lantern 0.75 m", 5)
    k = 165
    with G(S, x + w / 2, bot - 6, k):
        ground(S, -.65, .65)
        R(S, -.26, .26, 0, .12, pinkf(S))
        R(S, -.22, .22, .12, .98, pinkf(S))
        R(S, -.14, .14, .3, .8, "none", P["wall_d"], 1, .8)
        PA(S, f"M{M(-.29,.98)} L{M(.29,.98)} Q{M(.31,1.06)} {M(.24,1.1)} L{M(-.24,1.1)} Q{M(-.31,1.06)} {M(-.29,.98)} Z", cyl(S, P["wall_lit"], P["white"], P["wall_d"]))
        R(S, -.11, .11, 1.1, 1.2, iron(S))
        LN(S, -.11, 1.2, .11, 1.2, P["gold"], 1.4)
        lathe(S, [(.06, 1.2), (.08, 1.24)], P["iron"], sm=False)
        glow(S, 0, 1.48, .6, P["amber"], .55)
        acorn = [(.06, 1.24), (.12, 1.3), (.155, 1.42), (.15, 1.55), (.12, 1.64), (.07, 1.69)]
        lathe(S, acorn, glass_c(S, "#fff1c9", "#f6b06a"))
        for f in (-.66, -.25, .25, .66):
            PA(S, smooth([(f * .06, 1.24), (f * .14, 1.36), (f * .15, 1.52), (f * .1, 1.66)]), st="#e89a5a", w=1, op=.7)
        lathe(S, [(.09, 1.68), (.13, 1.71), (.1, 1.76), (.05, 1.8), (.02, 1.86)], iron(S))
        C(S, 0, 1.88, .025, P["gold"])
        figure(S, .5, 0, op=.5)


def it_mosque_lamps(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Hanging pierced & mosque lamps", "U263 arcade globes · U180 pierced lanterns · U258, U260 glass lamps",
                     ["Left: pierced brass globe throwing star-shaped light dots. Middle: faceted onion of teal and rose glass between brass ribs. "
                      "Right: enamelled glass mosque lamp hung by three chains from a ring.",
                      "Build: mesh ~300 tris each; light-cookie (gobo) texture on a spot for the dots; hung in rows in arcades and the cloister."],
                     "0.5–0.8 m bodies · chains 1–2 m", 6)
    k = 215
    gy = top + 20
    with G(S, x + w / 2, gy, k):
        R(S, -.75, .75, -.08, 0, pinkf(S))
        LN(S, -.75, -.08, .75, -.08, P["gold"], 1.2)
        # A: pierced globe
        ax = -.48
        chain(S, ax, -.08, ax, -.55, .04)
        rnd = random.Random(3)
        for i in range(40):
            dx, dh = rnd.uniform(-.27, .27), rnd.uniform(-1.7, -.5)
            if math.hypot(dx, dh + .9) > .3:
                star(S, ax + dx, dh, .012, 6, .5, P["amber"], op=.55)
        glow(S, ax, -.85, .45, P["amber"], .45)
        R(S, ax - .04, ax + .04, -.6, -.55, P["gold_d"])
        lathe(S, [(.02, -.55), (.09, -.6), (.12, -.64)], goldf(S), x=ax, sm=False)
        C(S, ax, -.86, .22, cyl(S, P["gold"], P["gold_l"], P["gold_dd"]))
        for r_, n in ((.0, 1), (.09, 6), (.17, 10)):
            for j in range(n):
                a = 2 * math.pi * j / n
                px_, ph = ax + r_ * math.cos(a) * .95, -.86 + r_ * math.sin(a)
                star(S, px_, ph, .022, 8, .5, "#fff3c4")
        LN(S, ax - .22, -.86, ax + .22, -.86, P["gold_dd"], 1)
        lathe(S, [(.0, -1.18), (.03, -1.12), (.06, -1.08), (.04, -1.06)], goldf(S), x=ax)
        for j in range(5):
            LN(S, ax - .03 + j * .015, -1.18, ax - .04 + j * .02, -1.32, P["rose"], 1.4)
        # B: faceted onion
        bx = 0.0
        chain(S, bx, -.08, bx, -.4, .04)
        glow(S, bx, -.75, .5, P["teal"], .35)
        onion = [(.02, -1.12), (.08, -1.05), (.17, -.9), (.18, -.75), (.12, -.6), (.05, -.5), (.02, -.42)]
        lathe(S, onion, P["gold_d"])
        for j, (a, b) in enumerate(((-1, -.6), (-.6, -.2), (-.2, .2), (.2, .6), (.6, 1))):
            col = P["teal"] if j % 2 == 0 else P["pink"]
            pts = [(a * r_, hh) for r_, hh in onion] + [(b * r_, hh) for r_, hh in reversed(onion)]
            PA(S, smooth(pts, True, .3), glass_c(S, "#ffffff", col), op=.9)
        for f in (-1, -.6, -.2, .2, .6, 1):
            PA(S, smooth([(f * r_, hh) for r_, hh in onion]), st=P["gold"], w=1.4)
        LN(S, -.18, -.78, .18, -.78, P["gold"], 1.6)
        star(S, bx, -1.18, .03, fill=P["gold_l"])
        # C: glass mosque lamp
        cx = .48
        R(S, cx - .02, cx + .02, -.3, -.08, P["gold_d"])
        C(S, cx, -.32, .03, "none", P["gold"], 1.4)
        for sd in (-1, 0, 1):
            LN(S, cx, -.34, cx + sd * .13, -.72, P["gold_d"], 1.0)
        glow(S, cx, -.95, .45, P["pink"], .4)
        lamp = [(.07, -1.25), (.1, -1.2), (.06, -1.16), (.09, -1.12), (.17, -1.02), (.18, -.92), (.11, -.85), (.1, -.8), (.15, -.72)]
        lathe(S, lamp, glass_c(S, "#fff4f8", "#f39cc4"), x=cx)
        R(S, cx - .105, cx + .105, -.84, -.8, P["gold"])
        R(S, cx - .17, cx + .17, -.99, -.94, P["gold"], op=.9)
        for j in range(6):
            C(S, cx - .13 + j * .052, -.965, .012, P["teal"])
        for sd in (-1, 1):
            C(S, cx + sd * .13, -.75, .018, "none", P["gold"], 1.2)
        E(S, cx, -1.02, .03, .05, P["warm"])


def it_paper_lanterns(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Paper, lotus & float lanterns", "U289 chochin · U317 lantern rows · U135 lotus · U07, U50 floats",
                     ["Ribbed rose-paper chochin with gold caps and a tassel; lotus float of three petal rings round a candle; washi box float on a dark base. "
                      "Floats bob and drift; reflections stretch on the water.",
                      "Build: chochin = lathe mesh ~200 tris + rib normal map; floats = instanced props (GPU instancing, 300+), emissive shader."],
                     "chochin 0.55 m · lotus 0.45 m · box 0.3 m", 7)
    k = 250
    with G(S, x + w / 2, top + 20, k):
        LN(S, -.75, -.03, .75, -.08, P["ink3"], 1.0, .7)
        for i, (lx, s, col) in enumerate(((-.48, 1.0, "#ff5f7e"), (.0, .85, "#ff7fa0"), (.45, 1.0, "#ff8a5c"))):
            hh = -.05 - abs(lx) * .03
            with Sub(S, lx, hh, sc=s):
                LN(S, 0, 0, 0, -.12, P["ink3"], 1)
                glow(S, 0, -.42, .5, col, .45)
                R(S, -.07, .07, -.17, -.12, goldf(S))
                prof = [(.07, -.7), (.15, -.66), (.2, -.55), (.21, -.42), (.2, -.3), (.15, -.2), (.07, -.17)]
                pts = [(r_, -1.0 * (-hh_) if False else hh_) for r_, hh_ in prof]
                lathe(S, [(r_, hh_) for r_, hh_ in prof], glass_c(S, "#fff0d0", col))
                for j in range(1, 8):
                    hh2 = -.17 - j * .066
                    ww = .2 * math.sin(math.pi * (j / 8)) + .05
                    PA(S, f"M{M(-ww,hh2)} Q{M(0,hh2-.025)} {M(ww,hh2)}", st="#a8324e", w=.9, op=.6)
                R(S, -.075, .075, -.75, -.7, goldf(S))
                LN(S, 0, -.75, 0, -.8, P["gold"], 1.5)
                for j in range(5):
                    LN(S, -.02 + j * .01, -.8, -.025 + j * .0125, -.95, P["gold"], 1.1)
    with G(S, x + w / 2, bot - 40, k):
        # water
        R(S, -.72, .72, -.12, .0, vg(S, "#1d3f66", "#0e1b38"))
        LN(S, -.72, 0, .72, 0, P["water"], 1, .6)
        # lotus float
        lx = -.28
        glow(S, lx, .1, .45, P["pink"], .5)
        E(S, lx, -.06, .05, .2, rg(S, P["pink"], P["pink"], .7, 0), op=.6)
        E(S, lx, .0, .26, .04, P["leaf"])
        for ring, (n, L, wd, col) in enumerate(((7, .2, .45, "#f58cc0"), (6, .16, .5, "#ffb0d6"), (5, .12, .5, "#ffe0f0"))):
            for j in range(n):
                a = 180 - (j + .5) * 180 / n
                leaf(S, lx, .02 + ring * .015, L, a, wd, col, "#c8508a", .7, .95)
        lathe(S, [(.02, .04), (.022, .1)], P["warm"], x=lx, sm=False)
        E(S, lx, .14, .012, .03, "#ffffff")
        # box float
        bx = .3
        glow(S, bx, .12, .4, P["amber"], .45)
        E(S, bx, -.07, .05, .18, rg(S, P["amber"], P["amber"], .7, 0), op=.6)
        R(S, bx - .12, bx + .12, -.0, .04, P["iron"])
        R(S, bx - .1, bx + .1, .04, .26, glass_c(S, "#fff4dc", "#f5b468"))
        for xx in (-.1, 0, .1):
            LN(S, bx + xx, .04, bx + xx, .26, "#5a3a2a", 1.2)
        LN(S, bx - .1, .15, bx + .1, .15, "#5a3a2a", .8)
        R(S, bx - .115, bx + .115, .26, .28, P["iron"])


# =============================================================================================== row 2: fountains
def ring_arc(S, cx, ch, rx, ry, rot, a0, a1, w=9, inlay=True, op=1, tip=None):
    pts = []
    n = 40
    cr, sr = math.cos(math.radians(rot)), math.sin(math.radians(rot))
    for i in range(n + 1):
        a = math.radians(a0 + (a1 - a0) * i / n)
        X, Hh = rx * math.cos(a), ry * math.sin(a)
        pts.append((cx + X * cr - Hh * sr, ch + X * sr + Hh * cr))
    d = smooth(pts)
    PA(S, d, st=P["gold_dd"], w=w + 2, op=op)
    PA(S, d, st=P["gold"], w=w, op=op)
    PA(S, d, st=P["gold_l"], w=w * .25, op=op * .7, extra='transform="translate(0 -0.04)"')
    if inlay:
        PA(S, d, st=P["teal"], w=w * .32, op=op)
    return pts


def arrow_tip(S, p0, p1, L=.5, col=None):
    col = col or P["gold"]
    dx, dh = p1[0] - p0[0], p1[1] - p0[1]
    n = math.hypot(dx, dh) or 1
    ux, uh = dx / n, dh / n
    px_, ph = -uh, ux
    t = (p1[0] + ux * L, p1[1] + uh * L)
    PL(S, [t, (p1[0] + px_ * L * .45, p1[1] + ph * L * .45), (p1[0] + ux * L * .25, p1[1] + uh * L * .25),
           (p1[0] - px_ * L * .45, p1[1] - ph * L * .45)], col, P["gold_dd"], 1)
    PL(S, [t, (p1[0] + ux * L * .25, p1[1] + uh * L * .25), (p1[0] + px_ * L * .45, p1[1] + ph * L * .45)], P["teal"], op=.7)


def it_armillary_fountain(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Armillary sphere fountain (forecourt centrepiece)", "U380 rings, sphere, chalice, ziggurat · U360 stepped gold platform",
                     ["Gold rings with teal enamel channels, arrow tips and fin spikes orbit a glowing water sphere on a gold chalice ringed with teal crystals; "
                      "three-tier ziggurat with gold edge bands, incised spiral glyphs and crystal shards; a sun-slot glows in tier two; jets in a round stepped pool.",
                      "Build: rings = Blender mesh (separate objects, slow rotation in JS); sphere = water shader with scrolling swirl normal + fresnel; "
                      "plinth baked to a light model; jets = particles. ~6k tris total."],
                     "9.4 m high · pool 15 m across · ziggurat 8.6 m", 8)
    k = 50
    cx0 = x + w / 2 - 30
    with G(S, cx0, bot - 30, k):
        # pool
        E(S, 0, 0, 7.4, .9, "#3a2f55")
        E(S, 0, .25, 7.0, .8, pinkf(S))
        E(S, 0, .55, 6.8, .78, P["wall_lit"])
        E(S, 0, .55, 6.4, .7, vg(S, "#5fd0e0", "#1e5a80"))
        for i in range(10):
            E(S, -5.5 + i * 1.2, .55 + (.2 if i % 2 else -.2), .35, .05, P["water_l"], op=.35)
        PA(S, arc_d(0, .25, 7.0, .8, 180, 360), st=P["gold"], w=1.2)
        # jets
        for jx in (-5.2, 5.2, -3.6, 3.6):
            PA(S, f"M{M(jx,.55)} Q{M(jx,2.2)} {M(jx+(.4 if jx>0 else -.4),1.0)}", st=P["water_l"], w=2.2, op=.8)
            PA(S, f"M{M(jx,.55)} L{M(jx,1.9)}", st="#ffffff", w=1.2, op=.8)
            E(S, jx, .6, .35, .07, "#ffffff", op=.5)
        # ziggurat tiers
        tiers = [(4.3, 4.0, .55, 1.6), (3.1, 2.85, 1.6, 2.55), (1.95, 1.75, 2.55, 3.25)]
        for i, (wb, wt, h0, h1) in enumerate(tiers):
            PL(S, [(-wb, h0), (wb, h0), (wt, h1), (-wt, h1)], cyl(S, P["marble"], P["white"], P["marble_dd"]))
            # chamfer faces at the sides
            PL(S, [(-wb, h0), (-wb * .72, h0), (-wt * .72, h1), (-wt, h1)], "#c9b5c8", op=.8)
            PL(S, [(wb * .72, h0), (wb, h0), (wt, h1), (wt * .72, h1)], "#9d87a4", op=.8)
            for f in (-1, -.72, -.36, 0, .36, .72, 1):
                LN(S, wb * f, h0, wt * f, h1, P["gold"], 2.2 if f in (-1, -.72, .72, 1) else 1.4)
            PA(S, f"M{M(-wt,h1)} L{M(wt,h1)}", st=P["gold_l"], w=3)
            PA(S, f"M{M(-wb,h0+.08)} L{M(wb,h0+.08)}", st=P["gold"], w=2)
            # spiral glyphs
            for f in (-.54, -.18, .18, .54):
                gx = (wb + wt) / 2 * f
                scroll(S, gx, (h0 + h1) / 2, .22 * (1 - i * .15), 1.6, 90, True, P["gold_d"], 1.3, .9, .85, False)
            # crystal shards at corners
            for sd in (-1, 1):
                bx = sd * wb * .86
                PL(S, [(bx - .18, h0 + .05), (bx + sd * .1, h0 + .9 - i * .1), (bx + .18, h0 + .05)], P["teal"], P["teal_d"] if "teal_d" in P else "#2a8a8a", .8)
                PL(S, [(bx, h0 + .05), (bx + sd * .1, h0 + .9 - i * .1), (bx + .18 * sd, h0 + .05)], "#c8fff6", op=.5)
        # sun slot
        glow(S, 0, 2.05, 1.4, P["amber"], .65, .6)
        R(S, -.5, .5, 1.85, 2.25, "#fff1c0")
        # chalice
        lathe(S, [(.9, 3.25), (.6, 3.4), (.32, 3.6), (.26, 4.0), (.38, 4.2), (.35, 4.35), (.55, 4.55), (1.15, 4.75), (1.3, 4.9)], goldf(S))
        for j in range(9):
            f = -1 + j * .25
            PL(S, [(f * 1.0 - .1, 4.68), (f * 1.18, 5.25 - abs(f) * .2), (f * 1.0 + .1, 4.68)], P["teal"], "#2a8a8a", .8)
        R(S, -.4, .4, 3.95, 4.05, P["teal"])
        LN(S, -1.3, 4.9, 1.3, 4.9, P["gold_l"], 2)
        # back halves of the rings
        cx, ch = 0, 6.6
        rings = [(3.4, 1.0, 14), (3.0, 1.35, -32), (2.6, 2.6, 70)]
        for rx, ry, rot in rings:
            ring_arc(S, cx, ch, rx, ry, rot, 10, 170, 7, True, .55)
        # water sphere
        glow(S, cx, ch, 3.2, P["teal"], .45)
        C(S, cx, ch, 1.85, rg(S, "#e9ffff", "#2c84b8", 1, 1, mid="#7fe0ee"), op=.9)
        for i, (a0, r_) in enumerate(((20, 1.4), (150, 1.1), (260, .8), (80, 1.6))):
            PA(S, smooth(spiral_pts(cx, ch, r_, .7, a0, i % 2 == 0, .6, 30)), st="#ffffff", w=2.4, op=.55)
        # crest knot in the core: a slow-turning gold star
        star(S, cx, ch, .5, 8, .5, P["gold_l"], op=.9)
        C(S, cx, ch, .16, "#fffbe8")
        C(S, cx - .6, ch + .7, .35, "#ffffff", op=.25)
        # front halves
        for i, (rx, ry, rot) in enumerate(rings):
            pts = ring_arc(S, cx, ch, rx, ry, rot, 190, 350, 9, True, 1)
            arrow_tip(S, pts[-2], pts[-1], .55)
            # fin spikes
            for t in (8, 20, 32):
                p0, p1 = pts[t], pts[t + 1]
                dx, dh = p1[0] - p0[0], p1[1] - p0[1]
                n = math.hypot(dx, dh)
                px_, ph = -dh / n, dx / n
                PL(S, [(p0[0] - px_ * .05, p0[1] - ph * .05), (p0[0] - px_ * .45 + dx * 2, p0[1] - ph * .45 + dh * 2), (p1[0], p1[1])], P["gold"], P["gold_dd"], .8)
            C(S, *pts[0], .12, P["gold"])
        figure(S, -6.4, 0)
    # plan inset
    px0, py0 = x + w - 90, top + 70
    S.a(f'<circle cx="{px0}" cy="{py0}" r="58" fill="#0d0a1c" stroke="{P["gold_d"]}"/>')
    S.a(f'<circle cx="{px0}" cy="{py0}" r="50" fill="#2d7fa0" stroke="{P["wall"]}" stroke-width="3"/>')
    for r_, c in ((29, P["marble"]), (21, P["marble_d"]), (14, P["marble"])):
        pts = " ".join(f"{px0 + r_ * math.cos(math.radians(22.5 + 45 * j)):.1f},{py0 + r_ * math.sin(math.radians(22.5 + 45 * j)):.1f}" for j in range(8))
        S.a(f'<polygon points="{pts}" fill="{c}" stroke="{P["gold"]}" stroke-width="1.2"/>')
    S.a(f'<circle cx="{px0}" cy="{py0}" r="9" fill="{P["teal"]}" stroke="{P["gold"]}" stroke-width="1.5"/>')
    for j in range(4):
        a = math.radians(45 + 90 * j)
        S.a(f'<circle cx="{px0 + 40*math.cos(a):.1f}" cy="{py0 + 40*math.sin(a):.1f}" r="2.5" fill="#ffffff"/>')
    T(S, px0, py0 + 74, "plan", 12, P["ink3"], "middle", italic=True)


def it_curtain_fountain(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Water-curtain fountain", "U344 curtain column, rosette frieze, coping, flag apron · U89 glowing sheet",
                     ["A round sheet of water falls all round a drum from a gold-rimmed cap, lit teal from below; a veiled lamp-bearer stands on top. "
                      "Big round basin: frieze of square rosette panels, heavy rounded coping, moulded plinth, radial flagstone apron.",
                      "Build: basin baked mesh ~3k tris + rosette normal map; curtain = open cylinder with scrolling alpha water shader; mist particles."],
                     "6.4 m high · basin 8.4 m across · market square, circular walkway plaza", 9)
    k = 54
    with G(S, x + w / 2, bot - 34, k):
        # radial flag apron
        E(S, 0, -.15, 5.4, .75, "#3e3259")
        for j in range(18):
            a = math.radians(180 + j * 10)
            LN(S, 4.3 * math.cos(a), -.15 + .58 * math.sin(a), 5.4 * math.cos(a), -.15 + .75 * math.sin(a), "#241b38", 1.4)
        PA(S, arc_d(0, -.15, 5.4, .75, 180, 360), st=P["ground_l"], w=1)
        # plinth, wall, coping
        R(S, -4.35, 4.35, -.1, .18, P["wall_d"])
        LN(S, -4.35, .18, 4.35, .18, P["wall_lit"], 1, .6)
        R(S, -4.2, 4.2, .18, .82, pinkf(S))
        n = 11
        for j in range(n):
            a = math.radians(180 + (j + .5) * 180 / n)
            px_ = 4.2 * math.cos(a)
            wd = .55 * abs(math.sin(a)) + .05
            R(S, px_ - wd / 2, px_ + wd / 2, .28, .72, "#c27a96", P["wall_lit"], .8)
            E(S, px_, .5, wd * .3, .14, P["wall_lit"], P["wall_d"], .7)
            for q in range(8):
                aa = math.radians(q * 45)
                E(S, px_ + wd * .2 * math.cos(aa), .5 + .1 * math.sin(aa), wd * .07, .03, P["wall_d"], op=.7)
        PA(S, f"M{M(-4.4,.82)} L{M(4.4,.82)} Q{M(4.62,.95)} {M(4.4,1.08)} L{M(-4.4,1.08)} Q{M(-4.62,.95)} {M(-4.4,.82)} Z", cyl(S, P["wall_lit"], P["white"], P["wall_d"]))
        E(S, 0, 1.08, 4.4, .45, P["wall_lit"])
        E(S, 0, 1.08, 4.0, .38, vg(S, "#5fd0e0", "#1d4f78"))
        # curtain column
        glow(S, 0, 2.2, 2.6, P["teal"], .4)
        R(S, -.75, .75, 1.08, 3.3, P["wall_d"], op=.6)
        PL(S, [(-1.2, 3.25), (1.2, 3.25), (1.32, 1.12), (-1.32, 1.12)], vg(S, "#c8f4ff", "#4fc8dc", "#8fe4f0"), op=.72)
        rnd = random.Random(5)
        for j in range(26):
            fx = -1.15 + j * .092
            LN(S, fx, 3.2, fx * 1.1, 1.15, "#ffffff", rnd.uniform(.6, 1.6), rnd.uniform(.25, .7))
        E(S, 0, 1.15, 1.5, .22, "#ffffff", op=.7)
        for j in range(9):
            E(S, -1.6 + j * .4, 1.25 + rnd.uniform(0, .25), .35, .18, "#ffffff", op=.22)
        # cap
        PA(S, f"M{M(-1.3,3.25)} L{M(1.3,3.25)} Q{M(1.38,3.4)} {M(1.15,3.48)} L{M(-1.15,3.48)} Q{M(-1.38,3.4)} {M(-1.3,3.25)} Z", cyl(S, P["marble"], P["white"], P["marble_dd"]))
        LN(S, -1.3, 3.27, 1.3, 3.27, P["gold"], 2)
        R(S, -.55, .55, 3.48, 3.8, marblef(S))
        LN(S, -.55, 3.8, .55, 3.8, P["gold"], 1.6)
        veiled(S, 0, 3.8, 2.3, pose="lamp", hood_gold=True)
        figure(S, -5.0, 0)


def it_tier_fountain(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Tiered fountain with planter", "U284 cusped bowls, octagon, onion · U339 lobed rims · U346 tiers · U388 planter cups",
                     ["Octagonal pool; a rose planter cup rings the shaft; two cusped bowls drip a curtain from every scallop; diamond-faceted onion finial with a lotus-bud jet. Pink stone, gold lips.",
                      "Build: lathe meshes baked ~2.5k tris; drips = alpha strips with scrolling shader; roses = instanced cards."],
                     "4.3 m · pool 5 m · courtyards, Grand Balcony garden", 10)
    k = 70
    with G(S, x + w / 2, bot - 30, k):
        # octagonal pool kerb
        E(S, 0, 0, 2.7, .3, "#3a2f55")
        R(S, -2.55, 2.55, 0, .5, pinkf(S))
        for f in (-1, -.41, .41, 1):
            LN(S, 2.55 * f, 0, 2.55 * f, .5, P["wall_d"], 1.4)
        for a, b in ((-1, -.41), (-.41, .41), (.41, 1)):
            R(S, 2.55 * a + .12, 2.55 * b - .12, .1, .4, "none", P["wall_lit"], .9, .7)
        R(S, -2.65, 2.65, .5, .6, P["wall_lit"])
        LN(S, -2.65, .6, 2.65, .6, P["gold"], 1.6)
        E(S, 0, .6, 2.5, .26, vg(S, "#5fd0e0", "#1d4f78"))
        # shaft + planter cup
        lathe(S, [(.35, .6), (.3, .75), (.22, .85), (.2, 1.0)], pinkf(S))
        cup = [(.2, .95), (.45, 1.02), (.7, 1.18), (.82, 1.38), (.78, 1.45)]
        lathe(S, cup, pinkf(S))
        R(S, -.8, .8, 1.36, 1.43, P["teal"])
        LN(S, -.8, 1.43, .8, 1.43, P["gold"], 1.4)
        rnd = random.Random(2)
        for j in range(16):
            lx = -.75 + j * .1
            leaf(S, lx, 1.42, .25, 90 + rnd.uniform(-60, 60), .35, P["leaf"])
        for j in range(9):
            C(S, -.7 + j * .175, 1.55 + rnd.uniform(-.05, .08), .07, P["rose"], "#b03a6a", .7)
        for j in range(4):
            PA(S, smooth([(-.6 + j * .4, 1.4), (-.65 + j * .4, 1.2), (-.6 + j * .4, 1.0)]), st=P["leaf"], w=2)
        # shaft up to bowl 1
        lathe(S, [(.16, 1.5), (.14, 1.8), (.2, 1.95), (.15, 2.05)], pinkf(S))
        # bowl 1 with cusped rim and drips
        b1 = [(.15, 2.0), (.6, 2.05), (1.05, 2.18), (1.3, 2.32), (1.32, 2.38)]
        n = 11
        for j in range(n):
            fx = -1.25 + j * 2.5 / (n - 1)
            LN(S, fx, 2.2, fx * 1.03, .65, P["water_l"], 1.2, .55)
        lathe(S, b1, pinkf(S))
        PA(S, "M" + " ".join(f"{M(-1.32 + j*2.64/(2*n), 2.3 if j%2==0 else 2.2)}" for j in range(2 * n + 1)), st=P["gold"], w=1.6)
        for j in range(n):
            fx = -1.25 + j * 2.5 / (n - 1)
            PL(S, [(fx - .06, 2.26), (fx, 2.16), (fx + .06, 2.26)], P["wall_d"])
        E(S, 0, 2.38, 1.3, .1, P["water"], op=.8)
        # shaft 2 + bowl 2
        lathe(S, [(.12, 2.4), (.1, 2.7), (.16, 2.82), (.11, 2.9)], pinkf(S))
        b2 = [(.1, 2.88), (.4, 2.92), (.68, 3.04), (.72, 3.1)]
        for j in range(7):
            fx = -.66 + j * .22
            LN(S, fx, 3.0, fx * 1.05, 2.42, P["water_l"], 1.1, .55)
        lathe(S, b2, pinkf(S))
        PA(S, "M" + " ".join(f"{M(-.72 + j*1.44/14, 3.06 if j%2==0 else 2.98)}" for j in range(15)), st=P["gold"], w=1.4)
        E(S, 0, 3.1, .7, .06, P["water"], op=.8)
        # onion finial with diamond facets
        onion = [(.08, 3.1), (.2, 3.2), (.25, 3.35), (.2, 3.52), (.1, 3.66), (.04, 3.78)]
        lathe(S, onion, pinkf(S))
        for i in range(-3, 4):
            PA(S, f"M{M(i*.07-.12,3.18)} L{M(i*.07+.12,3.6)}", st=P["wall_d"], w=.7, op=.7)
            PA(S, f"M{M(i*.07+.12,3.18)} L{M(i*.07-.12,3.6)}", st=P["wall_d"], w=.7, op=.7)
        lathe(S, [(.03, 3.76), (.07, 3.84), (.06, 3.94), (.02, 4.02)], goldf(S))
        PA(S, f"M{M(0,4.02)} Q{M(-.1,4.4)} {M(-.35,4.1)}", st=P["water_l"], w=1.6, op=.8)
        PA(S, f"M{M(0,4.02)} Q{M(.1,4.4)} {M(.35,4.1)}", st=P["water_l"], w=1.6, op=.8)
        PA(S, f"M{M(0,4.02)} L{M(0,4.3)}", st="#ffffff", w=1.6, op=.9)
        figure(S, 2.95, 0)


def it_wall_fountain(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Wall fountain", "U345 niche + bowl · U177 spout into pool · U292 scallop basin",
                     ["Pointed niche with gold cusped trim and a star-tile back; an urn on a console pours (no mask) into a scallop basin, which spills into a trough.",
                      "Build: mesh ~1.2k tris; tile = decal; water = alpha strips."],
                     "2.8 m high · 1.6 m wide", 11)
    k = 98
    with G(S, x + w / 2, bot - 8, k):
        R(S, -1.0, 1.0, 0, 2.95, pinkf(S))
        for hh in (.45, .9, 1.35, 1.8, 2.25, 2.7):
            LN(S, -1.0, hh, 1.0, hh, P["wall_d"], .7, .5)
        d, sp = pointed_arch_d(0, 1.15, .55, 2.75)
        PA(S, d, "#3a1f45")
        # star tiles
        for r_ in range(6):
            for c_ in range(5):
                tx, th = -.46 + c_ * .23, .7 + r_ * .27
                if abs(tx) < .5 and th < sp + .2:
                    star(S, tx, th, .07, 8, .55, "#5a3a78")
                    C(S, tx, th, .025, P["teal"], op=.6)
        PA(S, d, "none", P["gold"], 2.4)
        d2, _ = pointed_arch_d(0, 1.35, .55, 2.88)
        PA(S, d2, "none", P["gold_d"], 1.4)
        for sd in (-1, 1):
            R(S, sd * .66 - .06, sd * .66 + .06, .55, sp, P["wall_lit"])
        star(S, 0, 2.95, .1, fill=P["gold_l"])
        # console + urn spout
        PL(S, [(-.16, 1.75), (.16, 1.75), (.08, 1.55), (-.08, 1.55)], marblef(S))
        lathe(S, [(.07, 1.75), (.12, 1.8), (.17, 1.9), (.16, 2.02), (.1, 2.1), (.12, 2.16)], goldf(S))
        PA(S, f"M{M(.12,2.12)} Q{M(.3,2.1)} {M(.22,1.6)} L{M(.12,1.15)}", st=P["water_l"], w=3, op=.8)
        PA(S, f"M{M(.12,2.12)} Q{M(.3,2.1)} {M(.22,1.6)} L{M(.12,1.15)}", st="#ffffff", w=1.2, op=.8)
        # scallop basin
        PA(S, f"M{M(-.45,1.2)} Q{M(-.4,.85)} {M(0,.8)} Q{M(.4,.85)} {M(.45,1.2)} Z", marblef(S))
        for j in range(7):
            f = -.38 + j * .127
            LN(S, f * .3, .82, f, 1.18, P["marble_dd"], 1, .7)
        PA(S, "M" + " ".join(f"{M(-.45 + j*.9/12, 1.2 + (.035 if j%2 else 0))}" for j in range(13)), st=P["gold"], w=1.4)
        for f in (-.3, 0, .3):
            LN(S, f, .82, f * 1.1, .48, P["water_l"], 1.4, .6)
        # trough
        R(S, -.85, .85, 0, .5, cyl(S, P["wall_lit"], P["white"], P["wall_d"]))
        R(S, -.9, .9, .5, .58, P["white"])
        LN(S, -.9, .58, .9, .58, P["gold"], 1.4)
        R(S, -.75, .75, .38, .48, P["water"], op=.7)
        E(S, 0, .5, .3, .04, "#ffffff", op=.6)


def it_chadar(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Chadar cascade & lotus spout", "U396 central cascade stair · world-layout grand-stair channel · U292 lotus",
                     ["Front: a lotus-bud spout on each landing feeds a cusped weir; water slides down a slab carved in chevrons so the sheet sparkles, "
                      "over little lamp niches (chini khana), into a lobed pool. Right: section of one 15 m flight.",
                      "Build: slab = mesh with chevron normal map; water = thin sheet mesh, flow-map shader; niche lamps = emissive cards."],
                     "channel 3 m wide · slab 30° · one per landing (18)", 12)
    k = 62
    with G(S, x + 130, bot - 12, k):
        # niche wall at bottom
        R(S, -1.9, 1.9, 0, 1.25, pinkf(S))
        for j in range(5):
            nx = -1.4 + j * .7
            d, _ = pointed_arch_d(nx, .32, .2, .85)
            PA(S, d, "#2a1530")
            glow(S, nx, .4, .25, P["amber"], .8)
            C(S, nx, .35, .04, P["warm"])
        # chadar slab
        PL(S, [(-1.6, 1.25), (1.6, 1.25), (1.5, 4.0), (-1.5, 4.0)], P["wall_d"])
        rows = 12
        for r_ in range(rows):
            h0 = 1.3 + r_ * .22
            for c_ in range(8):
                cx = -1.4 + c_ * .4
                PA(S, f"M{M(cx-.18,h0)} L{M(cx,h0+.12)} L{M(cx+.18,h0)}", st="#ffd6e6", w=1, op=.5)
        PL(S, [(-1.5, 1.25), (1.5, 1.25), (1.45, 4.0), (-1.45, 4.0)], vg(S, "#bff3ff", "#6fd4e6"), op=.45)
        for j in range(16):
            fx = -1.4 + j * .187
            LN(S, fx, 4.0, fx * 1.04, 1.25, "#ffffff", 1, .35)
        for j in range(30):
            rnd = random.Random(j)
            sparkle(S, rnd.uniform(-1.4, 1.4), rnd.uniform(1.4, 3.9), .05, "#ffffff", .8)
        # side walls with gold trim
        for sd in (-1, 1):
            PL(S, [(sd * 1.6, 1.25), (sd * 1.9, 1.25), (sd * 1.8, 4.1), (sd * 1.5, 4.0)], P["wall_lit"])
            LN(S, sd * 1.6, 1.25, sd * 1.5, 4.0, P["gold"], 1.6)
        # weir lip and upper landing
        R(S, -1.9, 1.9, 4.0, 4.2, P["white"])
        PA(S, "M" + " ".join(f"{M(-1.5 + j*3/16, 4.0 if j%2==0 else 3.92)}" for j in range(17)), st=P["gold"], w=1.6)
        R(S, -1.9, 1.9, 4.2, 4.3, P["wall_lit"])
        # lotus spout
        glow(S, 0, 5.0, 1.0, P["teal"], .3)
        lathe(S, [(.25, 4.3), (.18, 4.4), (.1, 4.5), (.08, 4.7)], marblef(S))
        for j in range(7):
            a = 180 - (j + .5) * 180 / 7
            leaf(S, 0, 4.7, .45, a, .4, "#f7b8d4", "#b0607e", .8)
        lathe(S, [(.05, 4.72), (.13, 4.85), (.12, 5.0), (.03, 5.12)], "#ffd2e6")
        PA(S, f"M{M(0,5.12)} L{M(0,5.9)}", st="#ffffff", w=2.2, op=.9)
        for sd in (-1, 1):
            PA(S, f"M{M(0,5.8)} Q{M(sd*.6,6.0)} {M(sd*.9,4.35)}", st=P["water_l"], w=1.6, op=.75)
        # lobed pool at foot
        E(S, 0, -.05, 2.3, .28, vg(S, "#5fd0e0", "#1d4f78"))
        PA(S, smooth([(-2.3, 0), (-1.6, -.25), (-.8, -.15), (0, -.3), (.8, -.15), (1.6, -.25), (2.3, 0)]), st=P["wall_lit"], w=2.4)
        figure(S, 2.4, 0)
    # section
    sx0, sy0 = x + w - 175, bot - 40
    k2 = 9.5
    with G(S, sx0, sy0, k2):
        pts = [(0, 0)]
        xx, hh = 0, 0
        for f in range(3):
            pts += [(xx + 2.5, hh), (xx + 2.5 + 2.6, hh + 1.5 * 1.0), ]
            xx, hh = xx + 5.1, hh + 1.5
        PLN(S, [(0, 0), (2.5, 0), (2.5 + 2.6 * 1.73, 2.6 * 1.0), (2.5 + 2.6 * 1.73 + 2.5, 2.6), (2.5 + 5.2 * 1.73 + 2.5, 5.2)], P["wall_lit"], 2)
        for i in range(10):
            t = (i + .5) / 10
            bx, bh = 2.5 + 2.6 * 1.73 * t, 2.6 * t
            PA(S, f"M{M(bx,bh+.05)} l .25 -.3 l .25 .3", st="#ffd6e6", w=1, op=.8)
        PLN(S, [(2.5, .35), (2.5 + 2.6 * 1.73, 2.95)], P["water_l"], 1.6)
        C(S, 2.5 + 2.6 * 1.73 + 1.2, 2.6, .25, P["teal"])
        LN(S, 2.5 + 2.6 * 1.73 + 1.2, 2.6, 2.5 + 2.6 * 1.73 + 1.2, 5.0, "#ffffff", 1.5)
        PLN(S, [(0, 0), (2.5 + 5.2 * 1.73 + 2.5, 0)], P["ink3"], .8, dash="0.4 0.4")
    T(S, sx0 + 10, sy0 - 80, "section: weir, 30° chevron slab,", 11.5, P["ink3"], italic=True)
    T(S, sx0 + 10, sy0 - 65, "jet on each landing", 11.5, P["ink3"], italic=True)


# =============================================================================================== row 3: garden objects & statues
def it_clock_post(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Clock post", "U343 bracket clock + finial · U346 crested housing · U331",
                     ["Panelled base, gold collars, a two-faced clock in a crested drum with scroll brackets and a star; hands stop at one minute to midnight.",
                      "Build: mesh ~900 tris; face = decal; hands animated (real local time)."],
                     "3.9 m · plaza, avenue, Storybook square", 13)
    k = 128
    with G(S, x + w / 2, bot - 6, k):
        ground(S, -.85, .85)
        octa_base(S, .44, .1, .65, .58, .52)
        PL(S, [(-.06, .85), (.06, .85), (.045, 2.9), (-.045, 2.9)], iron(S))
        for hh in (1.0, 1.9, 2.75):
            R(S, -.075, .075, hh, hh + .045, goldf(S))
        for sd in (-1, 1):
            PA(S, smooth([(sd * .04, 2.75), (sd * .18, 2.85), (sd * .28, 3.0), (sd * .26, 3.12)]), st=P["iron_l"], w=2.2)
            scroll(S, sd * .2, 2.86, .05, 1.2, 270, sd > 0, P["iron_l"], 1.6)
        cx, ch = 0, 3.3
        C(S, cx, ch, .34, iron(S))
        C(S, cx, ch, .3, goldf(S))
        glow(S, cx, ch, .5, P["warm"], .35)
        C(S, cx, ch, .26, "#fff6e0")
        for j in range(12):
            a = math.radians(90 - j * 30)
            LN(S, cx + .21 * math.cos(a), ch + .21 * math.sin(a), cx + .245 * math.cos(a), ch + .245 * math.sin(a), P["iron"], 1.6 if j % 3 == 0 else .9)
        star(S, cx, ch + .16, .025, fill=P["gold_d"])
        LN(S, cx, ch, cx - .02, ch + .2, P["iron"], 2)
        LN(S, cx, ch, cx - .04, ch + .14, P["iron"], 2.6)
        C(S, cx, ch, .02, P["gold"])
        PA(S, f"M{M(-.3,3.52)} Q{M(-.2,3.62)} {M(-.08,3.62)} Q{M(0,3.75)} {M(0,3.82)} Q{M(0,3.75)} {M(.08,3.62)} Q{M(.2,3.62)} {M(.3,3.52)}", st=P["gold"], w=2.0)
        star(S, 0, 3.9, .07, fill=P["gold_l"])
        figure(S, .65, 0, op=.6)


def it_armillary(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Armillary sphere", "U80, U248 brass rings · U305 orb on plinth · U173 ring monument",
                     ["Pink marble baluster; three gold scroll feet hold meridian, horizon, equator and a wide star-ticked ecliptic band round a glowing orb; tilted axis with star tips.",
                      "Build: rings = separate meshes, slow turn; orb = emissive; ~1.5k tris."],
                     "2.5 m · observatory, Baroque gardens, plaza", 14)
    k = 140
    with G(S, x + w / 2, bot - 6, k):
        ground(S, -1.0, 1.0)
        R(S, -.32, .32, 0, .14, pinkf(S))
        lathe(S, [(.24, .14), (.24, .2), (.14, .3), (.12, .45), (.2, .68), (.19, .85), (.11, .98), (.17, 1.04), (.24, 1.1)], pinkf(S))
        R(S, -.26, .26, 1.1, 1.16, P["wall_lit"])
        LN(S, -.26, 1.16, .26, 1.16, P["gold"], 1.4)
        for sd in (-1, 0, 1):
            PA(S, smooth([(sd * .18, 1.16), (sd * .26, 1.3), (sd * .14, 1.42), (sd * .04, 1.48)]), st=P["gold"], w=2.4)
        cx, ch, r_ = 0, 1.98, .5
        glow(S, cx, ch, .7, P["pink"], .45)
        E(S, cx, ch, r_, r_ * .22, "none", P["gold_d"], 3, .6)
        C(S, cx, ch, .15, glass_c(S, "#ffffff", P["pink"]))
        C(S, cx, ch, r_, "none", P["gold"], 4)
        C(S, cx, ch, r_, "none", P["gold_l"], 1, .7)
        with Sub(S, cx, ch, rot=23):
            E(S, 0, 0, r_ * .97, r_ * .3, "none", P["gold"], 3.2)
            PA(S, arc_d(0, 0, r_ * .97, r_ * .3, 180, 360), st=P["teal"], w=1.2)
            E(S, 0, r_ * .55, r_ * .8, r_ * .2, "none", P["gold_d"], 1.6)
            E(S, 0, -r_ * .55, r_ * .8, r_ * .2, "none", P["gold_d"], 1.6)
            LN(S, 0, -r_ * 1.25, 0, r_ * 1.25, P["gold"], 2)
            star(S, 0, r_ * 1.3, .06, fill=P["gold_l"])
            C(S, 0, -r_ * 1.27, .03, P["gold"])
        with Sub(S, cx, ch, rot=-18):
            E(S, 0, 0, r_ * .99, r_ * .4, "none", P["gold"], 6)
            for j in range(12):
                a = math.radians(190 + j * 14)
                star(S, r_ * .99 * math.cos(a), r_ * .4 * math.sin(a), .022, 4, .3, P["warm"])
        figure(S, .75, 0, op=.6)


def it_sundial(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Sundial", "U157 dial plate on carved pedestal",
                     ["Twisted pink baluster on a square step; bronze dial with star rose and hour marks; scroll-cut gold gnomon. Plan view above.",
                      "Build: mesh ~500 tris + dial decal; moon-dial shadow shader at night."],
                     "1.15 m · Baroque terraced gardens", 15)
    k = 190
    with G(S, x + w / 2 - 20, bot - 6, k):
        ground(S, -.55, .65)
        R(S, -.3, .3, 0, .08, pinkf(S))
        R(S, -.24, .24, .08, .14, P["wall_lit"])
        lathe(S, [(.16, .14), (.12, .2), (.09, .3), (.12, .55), (.09, .8), (.12, .86), (.2, .92)], pinkf(S))
        for i in range(8):
            hh = .24 + i * .07
            PA(S, f"M{M(-.11,hh)} Q{M(0,hh+.06)} {M(.11,hh+.1)}", st=P["wall_d"], w=1.3, op=.8)
        R(S, -.27, .27, .92, .97, cyl(S, "#b9874a", "#e6b870", "#6e4a1c"))
        PL(S, [(-.18, .97), (.2, .97), (-.18, 1.2)], goldf(S))
        PA(S, f"M{M(-.1,1.0)} Q{M(-.02,1.05)} {M(-.12,1.12)}", st=P["gold_dd"], w=1.4)
        figure(S, .5, 0, op=.5)
    cx, cy, r_ = x + w - 62, top + 70, 48
    S.a(f'<circle cx="{cx}" cy="{cy}" r="{r_}" fill="#a87a42" stroke="{P["gold"]}" stroke-width="2"/>')
    S.a(f'<circle cx="{cx}" cy="{cy}" r="{r_-9}" fill="none" stroke="{P["gold_dd"]}" stroke-width="1"/>')
    for j in range(24):
        a = math.radians(j * 15)
        L = 8 if j % 2 == 0 else 4
        S.a(f'<line x1="{cx + (r_-9)*math.cos(a):.1f}" y1="{cy + (r_-9)*math.sin(a):.1f}" x2="{cx + (r_-9-L)*math.cos(a):.1f}" y2="{cy + (r_-9-L)*math.sin(a):.1f}" stroke="{P["gold_dd"]}" stroke-width="1.2"/>')
    pts = " ".join(f"{cx + (22 if j%2==0 else 9)*math.cos(math.radians(j*22.5)):.1f},{cy + (22 if j%2==0 else 9)*math.sin(math.radians(j*22.5)):.1f}" for j in range(16))
    S.a(f'<polygon points="{pts}" fill="{P["gold_l"]}" opacity=".9"/>')
    S.a(f'<line x1="{cx}" y1="{cy}" x2="{cx}" y2="{cy-r_+4}" stroke="{P["gold"]}" stroke-width="3"/>')
    T(S, cx, cy + r_ + 15, "dial plan", 11, P["ink3"], "middle", italic=True)


def it_well(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Wishing well", "U189 octagonal well-head with blind arches & volutes · U392 wellhouse arch · U129 iron arch canopy",
                     ["Two-step octagonal base; carved well-head with a blind arch on each face and a volute at every corner; whiplash iron canopy with "
                      "a pulley, rope and bucket, a hanging star lantern; teal glow and rising sparkles from the water.",
                      "Build: stone baked mesh ~1.5k tris; canopy alpha card or thin mesh; sparkle particles on a coin toss."],
                     "3.3 m with canopy · well-head 2 m across · courtyard, village square", 16)
    k = 120
    with G(S, x + w / 2 - 20, bot - 6, k):
        ground(S, -1.4, 1.5)
        R(S, -1.25, 1.25, 0, .12, P["wall_d"])
        R(S, -1.1, 1.1, .12, .25, P["wall"])
        LN(S, -1.1, .25, 1.1, .25, P["wall_lit"], 1, .7)
        f = .95 * .4142
        R(S, -.95, -f, .25, .98, cyl(S, P["wall"], P["wall_lit"], P["wall_d"]))
        R(S, f, .95, .25, .98, P["wall_d"])
        R(S, -f, f, .25, .98, P["wall"])
        for a, b, c in ((-.95, -f, "#a65577"), (-f, f, "#8a3e62"), (f, .95, "#6e2f50")):
            m = (a + b) / 2
            d, _ = pointed_arch_d(m, (b - a) * .55, .38, .86)
            PA(S, d, c, P["wall_lit"], .9)
        for xx in (-.95, -f, f, .95):
            scroll(S, xx, .88, .07, 1.3, 90, xx < 0, P["wall_lit"], 2.2)
        PA(S, f"M{M(-1.02,.98)} L{M(1.02,.98)} L{M(1.0,1.08)} L{M(-1.0,1.08)} Z", P["wall_lit"])
        LN(S, -1.02, 1.0, 1.02, 1.0, P["gold"], 1.4)
        glow(S, 0, 1.1, .8, P["teal"], .55, .25)
        # canopy
        for sd in (-1, 1):
            R(S, sd * .86 - .035, sd * .86 + .035, 1.08, 2.35, iron(S))
            PA(S, smooth([(sd * .86, 2.35), (sd * .8, 2.6), (sd * .5, 2.75), (sd * .2, 2.9), (0, 3.15)]), st=P["iron_l"], w=2.6)
            scroll(S, sd * .62, 2.42, .12, 1.4, 90 if sd > 0 else 90, sd < 0, P["iron_l"], 2.0)
            scroll(S, sd * .3, 2.62, .08, 1.3, 270, sd > 0, P["iron_l"], 1.6)
        star(S, 0, 3.25, .1, fill=P["gold_l"])
        LN(S, -.86, 2.25, .86, 2.25, P["iron"], 3)
        C(S, 0, 2.25, .13, "none", P["iron_l"], 2.4)
        for j in range(6):
            a = math.radians(j * 60)
            LN(S, 0, 2.25, .12 * math.cos(a), 2.25 + .12 * math.sin(a), P["iron_l"], 1)
        LN(S, .12, 2.25, .12, 1.55, "#b8946a", 1.4)
        PL(S, [(.0, 1.55), (.24, 1.55), (.21, 1.35), (.03, 1.35)], cyl(S, "#7a4a3a", "#a86c52", "#3e2420"))
        LN(S, .0, 1.5, .24, 1.5, P["gold"], 1)
        chain(S, -.4, 2.68, -.4, 2.45, .04)
        lantern_vase(S, -.4, 2.12, .55)
        for j in range(7):
            rnd = random.Random(j + 40)
            sparkle(S, rnd.uniform(-.6, .6), rnd.uniform(1.2, 2.0), .04, P["teal"], .9)
        figure(S, 1.3, 0)


def it_signs(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Signpost & sign bracket", "U346 finger signpost · U343 arrow-arm bracket, scalloped plaque · U349, U224",
                     ["Finger post with three gold-edged boards naming the zones and a small lantern on top. Wall bracket: spear-tipped arm, C-scrolls and spirals, "
                      "a hanging plaque with an ogee-scalloped top (cake emblem for the party salon).",
                      "Build: post mesh ~500 tris, board text = decal; bracket = alpha card, plaque mesh swings gently."],
                     "post 3.0 m · boards 0.8 m · bracket arm 0.9 m", 17)
    k = 118
    with G(S, x + 105, bot - 6, k):
        ground(S, -.75, .9)
        octa_base(S, .32, .08, .45, .42, .38)
        R(S, -.04, .04, .6, 2.5, iron(S))
        for hh in (.7, 2.45):
            R(S, -.055, .055, hh, hh + .04, goldf(S))
        for hh, sd, txt in ((2.2, 1, "Castle"), (1.95, -1, "Lantern Cove"), (1.7, 1, "Glowwood")):
            x0, x1 = (0.04, .82) if sd > 0 else (-.82, -.04)
            tip = x1 + .1 if sd > 0 else x0 - .1
            pts = [(x0, hh - .08), (x1, hh - .08), (tip, hh), (x1, hh + .08), (x0, hh + .08)] if sd > 0 else \
                  [(x1, hh - .08), (x0, hh - .08), (tip, hh), (x0, hh + .08), (x1, hh + .08)]
            PL(S, pts, cyl(S, "#f0dfe6", "#ffffff", "#b9a6b8"), P["gold"], 1.4)
            TM(S, (x0 + x1) / 2, hh - .035, txt, .095, P["roof_d"], weight="bold")
        lantern_vase(S, 0, 2.55, .55)
    # bracket
    with G(S, x + w - 205, top + 130, k * 1.15):
        R(S, -.12, 0, -.95, .35, pinkf(S))
        LN(S, 0, -.95, 0, .35, P["wall_dd"], 1.4)
        R(S, 0, .03, -.55, .25, iron(S))
        R(S, .03, .9, 0, .03, iron(S))
        PL(S, [(.9, -.02), (.98, .015), (.9, .05), (.92, .015)], P["iron_l"])
        PA(S, smooth([(.03, .22), (.15, .2), (.25, .12), (.35, .05), (.45, .03)]), st=P["iron_l"], w=2.2)
        scroll(S, .13, -.25, .14, 1.6, 180, True, P["iron_l"], 2.2, 1, .85)
        PA(S, smooth([(.03, -.5), (.12, -.4), (.3, -.15), (.5, -.02)]), st=P["iron_l"], w=2.2)
        for cx in (.4, .55, .7):
            scroll(S, cx, .08, .04, 1.3, 0, False, P["iron_l"], 1.4)
        for sx in (.4, .78):
            LN(S, sx, 0, sx, -.12, P["iron_l"], 1.4)
            C(S, sx, -.12, .015, "none", P["iron_l"], 1.2)
        plaque = f"M{M(.32,-.14)} Q{M(.42,-.1)} {M(.5,-.16)} Q{M(.59,-.08)} {M(.68,-.16)} Q{M(.76,-.1)} {M(.86,-.14)} L{M(.86,-.62)} L{M(.32,-.62)} Z"
        PA(S, plaque, cyl(S, P["roof"], P["roof_l"], P["roof_d"]), P["gold"], 2)
        R(S, .46, .72, -.5, -.38, P["white"])
        R(S, .5, .68, -.38, -.3, P["wall_lit"])
        LN(S, .59, -.3, .59, -.24, P["warm"], 1.4)
        glow(S, .59, -.22, .05, P["amber"], .9)
        PA(S, f"M{M(.46,-.44)} Q{M(.52,-.41)} {M(.59,-.44)} Q{M(.66,-.41)} {M(.72,-.44)}", st=P["rose"], w=1.4)


def it_statues(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Veiled statues (faceless)", "U139 column statues · U350 urn bearer · U132, U379 winged guardian · U14, U401 veils",
                     ["Column statue: slender shaft with gold rings and leaf capital, veiled figure with gilt hood edge (avenue rows). Urn bearer on a panelled pedestal. "
                      "Winged guardian on a stepped plinth with gold feather wings and a star halo. Every hood is an empty soft-shadowed oval, no face.",
                      "Build: one sculpted veiled body baked to ~2k tris + normal map, reused with three props; column = instanced."],
                     "column statue 7.8 m · urn bearer 3 m · guardian 3.4 m", 18)
    k = 66
    gy = bot - 6
    with G(S, x + 120, gy, k):
        ground(S, -1.4, 1.4)
        R(S, -.55, .55, 0, .8, pinkf(S))
        R(S, -.45, .45, .2, .65, "none", P["wall_d"], 1)
        lathe(S, [(.42, .8), (.42, .9), (.32, .98), (.3, 1.05)], P["wall_lit"])
        PL(S, [(-.26, 1.05), (.26, 1.05), (.21, 5.2), (-.21, 5.2)], marblef(S))
        for i in range(-2, 3):
            LN(S, i * .09, 1.1, i * .075, 5.15, P["marble_dd"], .8, .6)
        for hh in (1.6, 3.2, 4.6):
            R(S, -.25, .25, hh, hh + .08, goldf(S))
        lathe(S, [(.21, 5.2), (.3, 5.35), (.4, 5.55), (.46, 5.65)], marblef(S))
        for a in (70, 90, 110, 50, 130):
            leaf(S, 0, 5.2, .5, a, .3, P["marble"], P["marble_dd"], .8)
        R(S, -.5, .5, 5.65, 5.78, P["white"])
        LN(S, -.5, 5.78, .5, 5.78, P["gold"], 1.4)
        veiled(S, 0, 5.78, 2.0, hood_gold=True)
    with G(S, x + 320, gy, k):
        ground(S, -1.0, 1.0)
        R(S, -.6, .6, 0, .15, pinkf(S))
        R(S, -.48, .48, .15, 1.0, pinkf(S))
        R(S, -.36, .36, .3, .85, "none", P["wall_lit"], 1)
        R(S, -.58, .58, 1.0, 1.12, P["wall_lit"])
        LN(S, -.58, 1.12, .58, 1.12, P["gold"], 1.4)
        veiled(S, 0, 1.12, 1.9, pose="urn")
        for j in range(7):
            C(S, -.55 + j * .18, .18, .08, P["rose"] if j % 2 else "#ffb0cf")
    with G(S, x + 520, gy, k):
        ground(S, -1.3, 1.3)
        for i, (wd, h0, h1) in enumerate(((1.0, 0, .3), (.82, .3, .6), (.64, .6, .95))):
            R(S, -wd, wd, h0, h1, pinkf(S))
            LN(S, -wd, h1, wd, h1, P["gold"] if i == 2 else P["wall_lit"], 1.2)
        # wings behind
        for sd in (-1, 1):
            for j in range(6):
                L = 1.5 - j * .18
                leaf(S, sd * .18, 2.35 - j * .05, L, 90 - sd * (25 + j * 12), .16, goldf(S), P["gold_dd"], .9)
        veiled(S, 0, .95, 2.15, hood_gold=True)
        C(S, 0, 3.2, .38, "none", P["gold"], 2.4)
        for j in range(8):
            a = math.radians(90 + (j - 3.5) * 22)
            star(S, .45 * math.cos(a), 2.95 + .45 * math.sin(a), .05, fill=P["gold_l"])
        figure(S, 1.6, 0)


# =============================================================================================== row 4: sitouts & planters
def it_stone_bench(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Curved scroll-back stone bench", "U128 pierced scroll back · U85 carved stone bench · U14",
                     ["Seat follows the walkway curve; the back is pierced with S-scroll cut-outs between gold-lined rails; volute ends and scroll-foot supports. White marble.",
                      "Build: mesh ~1.4k tris; piercing via alpha-tested normal map on the back slab."],
                     "2.6 m long · seat 0.45 m · back 0.95 m", 19)
    k = 118
    with G(S, x + w / 2, bot - 10, k):
        ground(S, -1.4, 1.4)
        back_top = [(-1.25, .98), (-.6, .9), (0, .88), (.6, .9), (1.25, .98)]
        back_bot = [(1.2, .52), (.6, .48), (0, .47), (-.6, .48), (-1.2, .52)]
        PA(S, smooth(back_top) + " L" + M(1.2, .52) + " " + smooth(back_bot)[1:] + " Z", marblef(S))
        for j in range(9):
            cx = -1.0 + j * .25
            hh = .7 - .02 * math.cos(cx)
            scroll(S, cx - .05, hh + .05, .06, 1.2, 0, True, "#3a2846", 2.6)
            scroll(S, cx + .05, hh - .05, .06, 1.2, 180, True, "#3a2846", 2.6)
        PA(S, smooth(back_top), st=P["gold"], w=1.6)
        PA(S, smooth([(-1.2, .55), (0, .5), (1.2, .55)]), st=P["gold"], w=1.2)
        seat = [(-1.35, .48), (0, .4), (1.35, .48)]
        PA(S, smooth([(-1.35, .48), (0, .4), (1.35, .48)]) + f" L{M(1.35,.4)} " + smooth([(1.35, .4), (0, .32), (-1.35, .4)])[1:] + " Z", cyl(S, P["white"], "#ffffff", P["marble_d"]))
        for sx in (-1.05, 0, 1.05):
            hh = .34 if sx == 0 else .38
            PA(S, f"M{M(sx-.14,hh)} Q{M(sx-.2,.15)} {M(sx-.12,0)} L{M(sx+.12,0)} Q{M(sx+.2,.15)} {M(sx+.14,hh)} Z", marblef(S))
            scroll(S, sx - .1, .08, .06, 1.2, 180, False, P["marble_dd"], 1.6)
            scroll(S, sx + .1, .08, .06, 1.2, 0, True, P["marble_dd"], 1.6)
        for sd in (-1, 1):
            scroll(S, sd * 1.3, .85, .12, 1.5, 90, sd < 0, P["marble"], 5)
            scroll(S, sd * 1.3, .85, .12, 1.5, 90, sd < 0, P["marble_dd"], 1.4)
        figure(S, -1.3, 0, op=.35)


def it_iron_bench(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Wrought-iron scroll bench", "U155 scroll ends + slats · U154 park bench · U351",
                     ["Rose-wood slats on cast-iron ends; the end frame (right, side view) is a lyre of C-scrolls with a curled arm and scroll feet.",
                      "Build: slats mesh + end frame alpha card (two instances); ~400 tris."],
                     "1.8 m long · 0.85 m high", 20)
    k = 125
    with G(S, x + 120, bot - 10, k):
        ground(S, -.9, .9)
        wood = cyl(S, "#8a4a5a", "#b8707e", "#4a2433")
        for i in range(4):
            hh = .55 + i * .1
            R(S, -.85, .85, hh, hh + .065, wood)
        for i in range(2):
            R(S, -.85, .85, .38 + i * .06, .42 + i * .06, wood)
        for sd in (-1, 1):
            R(S, sd * .8 - .035, sd * .8 + .035, 0, .9, iron(S))
            PA(S, smooth([(sd * .8, .55), (sd * .88, .6), (sd * .92, .52)]), st=P["iron_l"], w=2.4)
        figure(S, .55, 0, op=.35)
    with G(S, x + w - 95, bot - 10, k * 1.25):
        LN(S, -.35, 0, .35, 0, P["ground_l"], 1.2)
        PA(S, smooth([(-.28, 0), (-.22, .2), (-.2, .4), (-.24, .62), (-.3, .9)]), st=P["iron_l"], w=3)
        PA(S, smooth([(.26, 0), (.18, .2), (.16, .4)]), st=P["iron_l"], w=3)
        PA(S, smooth([(-.2, .42), (0, .4), (.2, .42), (.32, .5), (.28, .58)]), st=P["iron_l"], w=3)
        scroll(S, .26, .53, .05, 1.3, 0, False, P["iron_l"], 2.2)
        scroll(S, -.3, .82, .07, 1.4, 180, True, P["iron_l"], 2.2)
        scroll(S, -.05, .25, .1, 1.5, 90, True, P["iron_l"], 1.8)
        scroll(S, .08, .18, .07, 1.4, 270, False, P["iron_l"], 1.8)
        scroll(S, -.12, .6, .07, 1.3, 0, True, P["iron_l"], 1.6)
        for xx in (-.28, .26):
            scroll(S, xx + (.05 if xx < 0 else -.05), .03, .04, 1.2, 180 if xx < 0 else 0, xx > 0, P["iron_l"], 1.8)
        for i in range(3):
            R(S, -.22 + i * .12, -.16 + i * .12, .4, .44, "#8a4a5a")
        for i in range(4):
            E(S, -.24 - i * .015, .5 + i * .1, .025, .03, "#8a4a5a")
        T(S, 0, 0, "", 1)


def it_trellis_bench(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Trellis-back bench with cushion", "U284 gold trellis, scalloped crest, red cushion · U388 lotus crests",
                     ["Rose-gold frame, a gold ogee-lattice back under a scalloped crest rail with a lotus crest, plum velvet cushion with gold piping, turned legs, scrolled arms.",
                      "Build: mesh ~900 tris; lattice = alpha cutout; cushion = soft baked normal."],
                     "1.9 m long · 1.05 m high", 21)
    k = 128
    with G(S, x + w / 2, bot - 10, k):
        ground(S, -1.2, 1.2)
        frame = cyl(S, "#c98a6a", "#f0b890", "#7a4a3a")
        R(S, -.92, .92, .5, .9, "#2a1832")
        for i in range(-9, 10):
            xx = i * .1
            PA(S, f"M{M(xx-.05,.5)} Q{M(xx+.06,.6)} {M(xx-.05,.7)} Q{M(xx+.06,.8)} {M(xx-.05,.9)}", st=P["gold"], w=1.3)
            PA(S, f"M{M(xx+.05,.5)} Q{M(xx-.06,.6)} {M(xx+.05,.7)} Q{M(xx-.06,.8)} {M(xx+.05,.9)}", st=P["gold"], w=1.3)
        R(S, -.92, .92, .5, .9, "none", frame, 4)
        crest = smooth([(-.95, .9), (-.7, .96), (-.45, .93), (-.2, .99), (0, 1.03), (.2, .99), (.45, .93), (.7, .96), (.95, .9)])
        PA(S, crest + f" L{M(.95,.88)} L{M(-.95,.88)} Z", frame)
        for j in range(5):
            a = 180 - (j + .5) * 36
            leaf(S, 0, 1.0, .1, a, .45, P["gold"], P["gold_dd"], .6)
        R(S, -.95, .95, .4, .5, frame)
        PA(S, f"M{M(-.92,.5)} Q{M(-.94,.6)} {M(-.85,.62)} L{M(.85,.62)} Q{M(.94,.6)} {M(.92,.5)} Z", cyl(S, P["roof"], P["roof_l"], P["roof_d"]))
        LN(S, -.9, .53, .9, .53, P["gold"], 1.2)
        for sd in (-1, 1):
            lathe(S, [(.04, 0), (.05, .1), (.03, .2), (.05, .3), (.04, .4)], frame, x=sd * .88)
            PA(S, smooth([(sd * .95, .5), (sd * 1.02, .62), (sd * .98, .72), (sd * .9, .7)]), st=frame, w=4)
            scroll(S, sd * .97, .7, .04, 1.2, 90, sd < 0, P["gold"], 1.6)
        figure(S, 1.1, 0, op=.35)


def it_sitout(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Sitout table, lace chairs & parasol", "U262 lace chairs, marble table · U230, U313 café sets · U389 scalloped parasol · U341 hurricane",
                     ["Round marble top on a cast-iron pedestal with three scroll feet; two lace-back chairs (oval pierced backs, cabriole legs, rose cushions); "
                      "rose-and-cream parasol with scalloped valance and star finial; hurricane candle on the table.",
                      "Build: set = one baked mesh ~2.5k tris; lace = alpha cutout; candle flicker shader. A set every 14 m on the circular walkways."],
                     "table 0.8 m Ø · parasol 2.6 m Ø, 2.5 m high", 22)
    k = 112
    with G(S, x + w / 2, bot - 10, k):
        ground(S, -2.0, 2.0)
        # parasol
        LN(S, 0, .8, 0, 2.5, P["gold_d"], 2.4)
        can = [(-1.35, 1.95), (0, 2.45), (1.35, 1.95)]
        for j in range(8):
            a0, a1 = -1.35 + j * .3375, -1.35 + (j + 1) * .3375
            col = P["wall_lit"] if j % 2 == 0 else P["roof"]
            ha = 1.95 + .5 * (1 - abs(a0) / 1.35)
            hb = 1.95 + .5 * (1 - abs(a1) / 1.35)
            PL(S, [(0, 2.45), (a0, 1.95 if abs(a0) > 1.3 else 1.95 + 0), (a1, 1.95)], col)
        PA(S, "M" + " ".join(f"{M(-1.35 + j*2.7/16, 1.95 - (.1 if j%2 else 0))}" for j in range(17)), st=P["gold"], w=1.4)
        for j in range(8):
            cx = -1.35 + (j + .5) * .3375
            PA(S, f"M{M(cx-.16,1.95)} Q{M(cx,1.78)} {M(cx+.16,1.95)} Z", P["wall_lit"] if j % 2 else P["roof"])
        star(S, 0, 2.55, .07, fill=P["gold_l"])
        # table
        lathe(S, [(.03, .02), (.06, .2), (.04, .5), (.08, .68)], iron(S))
        for sd in (-1, 0, 1):
            PA(S, smooth([(0, .2), (sd * .2, .1), (sd * .3, .02)]), st=P["iron_l"], w=2.4)
            scroll(S, sd * .3 + (.03 if sd >= 0 else -.03), .05, .035, 1.2, 90, sd < 0, P["iron_l"], 1.4)
        E(S, 0, .76, .42, .07, P["white"])
        R(S, -.42, .42, .7, .76, marblef(S))
        LN(S, -.42, .7, .42, .7, P["gold"], 1.2)
        glow(S, 0, .95, .4, P["amber"], .6)
        lathe(S, [(.06, .78), (.08, .82), (.09, .95), (.06, 1.05), (.07, 1.1)], "#fff5e6", op=.7)
        E(S, 0, .9, .012, .03, P["warm"])
        # chairs
        for sd in (-1, 1):
            cx = sd * 1.0
            E(S, cx - sd * .02, .46, .24, .05, P["rose"])
            R(S, cx - .24, cx + .24, .42, .46, P["roof"])
            for lx in (-.2, .2):
                PA(S, smooth([(cx + lx, .42), (cx + lx * 1.15, .25), (cx + lx * .95, .1), (cx + lx * 1.2, 0)]), st=P["iron_l"], w=2.2)
            bx = cx + sd * .22
            E(S, bx, .78, .17, .26, "none", P["iron_l"], 2.4)
            for r_ in (.1, .05):
                E(S, bx, .78, r_ * .9, r_ * 1.5, "none", P["iron_l"], 1)
            scroll(S, bx - .06, .9, .05, 1.2, 0, True, P["iron_l"], 1.2)
            scroll(S, bx + .06, .66, .05, 1.2, 180, True, P["iron_l"], 1.2)
            LN(S, bx, .46, bx, .52, P["iron_l"], 2)
        figure(S, -1.7, 0, op=.4)


def it_planters(S, x, y, w, h):
    top, bot = panel(S, x, y, w, h, "Planters, urns & topiary pots", "U350 urn · U343 goblet bowl · U388 planter cups · U154, U403, U310 topiary",
                     ["Gadrooned urn with scroll handles on a panelled pedestal; white goblet bowl; column with teal-collared planter cups; spiral cone in a Versailles box "
                      "with gold ball finials; ball topiary in a gold-banded pot; three-ball topiary strung with fairy lights.",
                      "Build: pots = lathe meshes ~300 tris, instanced; topiary = clipped leaf-card spheres with a leaf normal map; lights = instanced emissive dots."],
                     "urn 1.7 m · goblet 0.9 m · planter column 2.3 m · topiaries 1.2–2.2 m", 23)
    k = 120
    gy = bot - 10
    with G(S, x + 25, gy, k):
        ground(S, -.1, 6.9)
        # 1 urn on pedestal
        ux = .5
        R(S, ux - .3, ux + .3, 0, .1, pinkf(S))
        R(S, ux - .24, ux + .24, .1, .8, pinkf(S))
        R(S, ux - .16, ux + .16, .2, .7, "none", P["wall_d"], 1)
        R(S, ux - .28, ux + .28, .8, .88, P["wall_lit"])
        urn = [(.1, .88), (.14, .92), (.09, 1.0), (.12, 1.06), (.28, 1.2), (.3, 1.36), (.26, 1.44), (.32, 1.48)]
        lathe(S, urn, marblef(S), x=ux)
        for f in (-.8, -.5, -.2, .1, .4, .7):
            PA(S, f"M{M(ux+f*.22,1.08)} Q{M(ux+f*.3,1.22)} {M(ux+f*.26,1.36)}", st=P["marble_dd"], w=1, op=.8)
        for sd in (-1, 1):
            scroll(S, ux + sd * .34, 1.32, .06, 1.2, 90, sd < 0, P["marble_dd"], 2)
        for j in range(9):
            C(S, ux - .3 + j * .075, 1.52 + .04 * math.sin(j), .06, P["rose"] if j % 2 else "#ffb0cf")
        for j in range(5):
            PA(S, smooth([(ux - .3 + j * .15, 1.48), (ux - .38 + j * .17, 1.25), (ux - .4 + j * .18, 1.0)]), st=P["leaf"], w=2)
        # 2 goblet bowl
        gx = 1.5
        lathe(S, [(.2, 0), (.18, .06), (.08, .2), (.06, .35), (.14, .45), (.35, .55), (.45, .7), (.43, .76)], cyl(S, P["white"], "#ffffff", P["marble_d"]), x=gx)
        for j in range(9):
            leaf(S, gx, .74, .45, 90 + (j - 4) * 18, .18, P["leaf_l"] if j % 2 else P["leaf"])
        # 3 planter column
        cx = 2.55
        R(S, cx - .2, cx + .2, 0, .12, pinkf(S))
        lathe(S, [(.12, .12), (.1, .6), (.14, .7), (.1, .8), (.1, 1.3)], pinkf(S), x=cx)
        for hh, r_ in ((.95, .26), (1.75, .34)):
            lathe(S, [(.1, hh), (.22, hh + .1), (r_, hh + .25), (r_ + .02, hh + .32)], pinkf(S), x=cx)
            R(S, cx - r_ - .02, cx + r_ + .02, hh + .25, hh + .3, P["teal"])
            LN(S, cx - r_ - .02, hh + .32, cx + r_ + .02, hh + .32, P["gold"], 1.2)
            for j in range(7):
                leaf(S, cx, hh + .3, .35 * (r_ / .3), 90 + (j - 3) * 24, .3, P["leaf"])
            for j in range(4):
                C(S, cx - r_ * .7 + j * r_ * .45, hh + .45, .045, P["violet"])
        lathe(S, [(.1, 1.3), (.09, 1.75)], pinkf(S), x=cx, sm=False)
        # 4 spiral topiary in versailles box
        vx = 3.75
        R(S, vx - .32, vx + .32, 0, .55, cyl(S, P["roof"], P["roof_l"], P["roof_d"]))
        for xx in (-.16, 0, .16):
            LN(S, vx + xx, .05, vx + xx, .5, P["roof_d"], 1.2)
        R(S, vx - .34, vx + .34, .55, .6, P["gold"])
        for sd in (-1, 1):
            C(S, vx + sd * .32, .66, .05, P["gold_l"])
        R(S, vx - .025, vx + .025, .6, .7, "#5a3a2a")
        for i in range(6):
            r_ = .32 * (1 - i / 6.5)
            hh = .75 + i * .25
            E(S, vx, hh, r_, .13, P["leaf"] if i % 2 == 0 else "#2f6a4e")
            PA(S, f"M{M(vx-r_,hh)} Q{M(vx,hh-.12)} {M(vx+r_,hh+.06)}", st=P["leaf_l"], w=1.2, op=.7)
        star(S, vx, 2.25, .06, fill=P["gold_l"])
        # 5 ball topiary
        bx = 4.85
        lathe(S, [(.16, 0), (.2, .05), (.26, .4), (.28, .45)], cyl(S, P["wall"], P["wall_lit"], P["wall_d"]), x=bx)
        R(S, bx - .27, bx + .27, .32, .37, P["gold"])
        R(S, bx - .02, bx + .02, .45, 1.0, "#5a3a2a")
        C(S, bx, 1.2, .3, cyl(S, P["leaf"], P["leaf_l"], P["leaf_d"]))
        for j in range(12):
            rnd = random.Random(j + 7)
            C(S, bx + rnd.uniform(-.24, .24), 1.2 + rnd.uniform(-.22, .22), .03, P["leaf_l"], op=.6)
        # 6 three-ball topiary with fairy lights
        tx = 6.0
        lathe(S, [(.22, 0), (.26, .06), (.3, .45), (.33, .5)], cyl(S, P["white"], "#ffffff", P["marble_d"]), x=tx)
        LN(S, tx - .3, .2, tx + .3, .2, P["gold"], 1.2)
        R(S, tx - .02, tx + .02, .5, 2.05, "#5a3a2a")
        for hh, r_ in ((.85, .3), (1.45, .24), (1.95, .17)):
            C(S, tx, hh, r_, cyl(S, P["leaf"], P["leaf_l"], P["leaf_d"]))
            for j in range(7):
                a = math.radians(200 + j * 20)
                C(S, tx + r_ * .9 * math.cos(a), hh + r_ * .5 * math.sin(a) + .05, .022, P["warm"])
                glow(S, tx + r_ * .9 * math.cos(a), hh + r_ * .5 * math.sin(a) + .05, .06, P["amber"], .6)
        star(S, tx, 2.2, .06, fill=P["gold_l"])
        figure(S, 6.6, 0, op=.45)


# =============================================================================================== layout
def header(S):
    gid = S.id("bg")
    S.d(f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{P["bg0"]}"/><stop offset="1" stop-color="{P["bg1"]}"/></linearGradient>')
    S.a(f'<rect width="{W}" height="{H}" fill="url(#{gid})"/>')
    rnd = random.Random(1)
    for i in range(160):
        S.a(f'<circle cx="{rnd.uniform(0,W):.0f}" cy="{rnd.uniform(0,H):.0f}" r="{rnd.uniform(.4,1.4):.1f}" fill="#ffffff" opacity="{rnd.uniform(.1,.45):.2f}"/>')
    T(S, 24, 52, "ARTIFACTS · A · OUTDOOR PROPS", 36, P["label"], weight="bold")
    T(S, 24, 82, f"Lamp posts & lanterns, fountains, garden objects & veiled statues, sitouts & planters for the Birthday Castle world  ·  round {ROUND}", 17, P["ink2"])
    T(S, 24, 106, "Each item: our own blend of the reference pictures named under its title (U-ids), night look, 1.7 m figure for scale, size and a web build note.  "
      "Rules: no eyes, faceless veiled figures, stars instead of crosses, no modern things.", 13.5, P["ink3"])
    chips = [("rose stone", P["wall"]), ("deep rose", P["wall_d"]), ("plum roof", P["roof"]), ("roof shade", P["roof_d"]), ("gold", P["gold"]),
             ("marble", P["white"]), ("cast iron", P["iron_l"]), ("amber glow", P["amber"]), ("pink glow", P["pink"]), ("teal glow", P["teal"]), ("violet", P["violet"])]
    cx = 1560
    for i, (n, c) in enumerate(chips):
        xx = cx + (i % 6) * 135
        yy = 30 + (i // 6) * 38
        S.a(f'<rect x="{xx}" y="{yy}" width="26" height="26" rx="5" fill="{c}" stroke="{P["edge"]}"/>')
        T(S, xx + 33, yy + 18, n, 13, P["ink2"])


def row_title(S, y, s, sub=""):
    T(S, 24, y, s, 22, P["gold"], weight="bold")
    if sub:
        T(S, 24 + len(s) * 14.2 + 18, y, sub, 14, P["ink3"], italic=True)
    S.a(f'<line x1="24" y1="{y+8}" x2="{W-24}" y2="{y+8}" stroke="{P["gold_d"]}" stroke-width="1" opacity=".6"/>')


def row(S, y, h, items, x0=14, gap=12):
    total = sum(wd for _, wd in items) + gap * (len(items) - 1)
    scale = (W - 2 * x0) / total
    x = x0
    for fn, wd in items:
        ww = wd * scale
        fn(S, x, y, ww, h)
        x += ww + gap


header(S)
y = 150
row_title(S, y, "LAMP POSTS & LANTERNS", "warm amber on the avenue and bridge, pink and teal in gardens and Glowwood")
row(S, y + 22, 840, [(it_twin_post, 380), (it_candelabra, 360), (it_crystal_post, 270), (it_hex_bracket, 330), (it_acorn, 220), (it_mosque_lamps, 330), (it_paper_lanterns, 360)])
y += 890
row_title(S, y, "FOUNTAINS & WATER", "rose stone and gold, water lit teal from below")
row(S, y + 22, 900, [(it_armillary_fountain, 660), (it_curtain_fountain, 540), (it_tier_fountain, 430), (it_wall_fountain, 290), (it_chadar, 460)])
y += 950
row_title(S, y, "GARDEN OBJECTS & STATUES", "clock, armillary, sundial, wishing well, signs; every figure veiled and faceless")
row(S, y + 22, 760, [(it_clock_post, 240), (it_armillary, 300), (it_sundial, 260), (it_well, 380), (it_signs, 420), (it_statues, 680)])
y += 810
row_title(S, y, "SITOUTS & PLANTERS", "benches, café set, urns and topiary for walkways, terraces and courtyards")
row(S, y + 22, 600, [(it_stone_bench, 340), (it_iron_bench, 340), (it_trellis_bench, 330), (it_sitout, 480), (it_planters, 860)])

out = __file__.rsplit("/", 1)[0] + "/artifacts-a.svg"
S.save(out)
print(out, y + 22 + 600)
