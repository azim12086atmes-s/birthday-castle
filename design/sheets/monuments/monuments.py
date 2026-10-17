"""Monuments design sheets (A: gateways, columns, towers; B: pavilions, temples, ruins, statues, fountains).
Run: python3 monuments.py <round>  -> writes monuments-a.svg/.png and monuments-b.svg/.png (and -rN copies)."""
import sys, os, math, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mlib import *

OUT = os.path.dirname(os.path.abspath(__file__))
RENDER = "/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/v5/render.js"
ROUND = int(sys.argv[1]) if len(sys.argv) > 1 else 1


# =====================================================================================  SHEET A ITEMS
def great_gate_pylons(D):
    """Two leaning rose pylons (U398) joined by a gold interlace crest (U134/U136), star finial."""
    def edges(h, side):
        # left pylon (side=-1) outer/inner edge x at height h
        t = (h - 3) / 57.0
        outer = -31 + (-12.5 + 31) * t
        inner = -17 + (-6.5 + 17) * t
        if side == 1:
            return -inner, -outer
        return outer, inner
    for side in (-1, 1):
        sg = side
        # stepped plinth
        for i, (w, h0, h1) in enumerate([(24, 0, 1.0), (21, 1.0, 2.0), (18, 2.0, 3.0)]):
            c = sg * 24
            rect(D, c - w / 2, c + w / 2, h0, h1, [P["rose"], P["wall_shade"], P["wall"]][i], P["rose_d"], 0.08)
            line(D, c - w / 2, h1, c + w / 2, h1, P["gold"], 0.15)
        def slab(h0, h1, inset_o, inset_i, fill):
            a0, b0 = edges(h0, sg)
            a1, b1 = edges(h1, sg)
            if sg == -1:
                pts = [(a0 + inset_o, h0), (b0 - inset_i, h0), (b1 - inset_i, h1), (a1 + inset_o, h1)]
            else:
                pts = [(a0 + inset_i, h0), (b0 - inset_o, h0), (b1 - inset_o, h1), (a1 + inset_i, h1)]
            poly(D, pts, fill, P["rose_d"], 0.1)
            return pts
        slab(3, 58, 0, 0, hgrad(D, P["wall_shade"], P["rose"]) if sg == -1 else hgrad(D, P["rose"], P["wall_shade"]))
        slab(5, 56.5, 1.3, 1.3, P["wall"])
        fin = slab(8, 54, 3.4, 3.4, hgrad(D, P["wall_lit"], P["wall"]))
        # gold inlay lines along the fin
        line(D, fin[0][0], fin[0][1], fin[3][0], fin[3][1], P["gold"], 0.25)
        line(D, fin[1][0], fin[1][1], fin[2][0], fin[2][1], P["gold"], 0.25)
        # horizontal course joints
        for hh in range(6, 56, 4):
            a, b = edges(hh, sg)
            line(D, a + 1.3, hh, b - 1.3, hh, P["rose_d"], 0.06, 0.4)
        # pierced roundel band
        for hh in (31.0,):
            a, b = edges(hh, sg)
            for k in range(3):
                xx = a + (b - a) * (0.25 + 0.25 * k)
                glow(D, xx, hh, 2.2, color=P["pink_glow"], op=0.6)
                circ(D, xx, hh, 1.0, P["glass_d"], P["gold"], 0.25)
                circ(D, xx, hh, 0.6, "#ff9ccc", op=0.85)
        # glowing lancet slot
        a, b = edges(18, sg)
        cxs = (a + b) / 2
        glow(D, cxs, 18, 3, 7, P["amber"], 0.5)
        d, _ = pointed_arch_d(cxs, 1.2, 12, 24)
        path(D, d, fill="#ffd27a", st=P["gold"], sw=0.2)
        # notched cap
        a, b = edges(58, sg)
        rect(D, a - 0.8, b + 0.8, 58, 60, P["wall_lit"], P["rose_d"], 0.1)
        line(D, a - 0.8, 60, b + 0.8, 60, P["gold"], 0.25)
        rect(D, a + 0.6, b - 0.6, 60, 62.2, P["wall"], P["rose_d"], 0.1)
        poly(D, [(a + 1.2, 62.2), (b - 1.2, 62.2), ((a + b) / 2, 64.5)], P["roof"], P["gold"], 0.15)
        star(D, (a + b) / 2, 65.4, 0.9, glowc=P["gold_l"])
        # veiled statue at the foot
        veiled(D, sg * 36.5, 0, 6.0, halo=True)
        lamp_post(D, sg * 14.5, 3, 4.5)
    # interlace crest
    for col, w in ((P["ink"], 0.9), (P["gold"], 0.55), (P["gold_l"], 0.18)):
        path(D, f"M-8 {Y(53)} C-4 {Y(58)} -3 {Y(64)} 0 {Y(66)} C3 {Y(64)} 4 {Y(58)} 8 {Y(53)}", st=col, sw=w)
        path(D, f"M-7 {Y(57)} Q0 {Y(51)} 7 {Y(57)}", st=col, sw=w)
        path(D, f"M0 {Y(52)} C-3 {Y(55)} -3 {Y(60)} 0 {Y(62)} C3 {Y(60)} 3 {Y(55)} 0 {Y(52)}", st=col, sw=w)
        path(D, f"M-5 {Y(60)} Q0 {Y(56)} 5 {Y(60)}", st=col, sw=w)
    star(D, 0, 68.5, 1.6, glowc=P["gold_l"])
    # bridge deck parapet
    rect(D, -14, 14, 0, 1.1, P["wall_shade"], P["rose_d"], 0.08)
    for x in range(-13, 14, 2):
        rect(D, x - 0.3, x + 0.3, 1.1, 1.3, P["gold"])
    person(D, -10, 1.1)


def triumphal_arch(D):
    """Three-bay triumphal arch (U386 sun arches, U387, U255, U364)."""
    M, Ms, Ml = P["marble"], P["marble_s"], P["white"]
    # steps
    for i, (w, h0, h1) in enumerate([(31, 0, 0.4), (30, 0.4, 0.8), (29, 0.8, 1.2)]):
        rect(D, -w / 2, w / 2, h0, h1, [P["rose"], P["wall_shade"], P["wall"]][i], P["rose_d"], 0.04)
    # body
    rect(D, -14, 14, 1.2, 17.5, vgrad(D, Ml, M, Ms), P["marble_d"], 0.05)
    courses(D, -14, 14, 1.2, 17.5, 0.9, P["marble_d"], 0.03, 0.3)
    # openings
    glow(D, 0, 7, 7, 8, P["amber"], 0.45)
    path(D, round_arch_d(0, 9, 1.2, 9.5), fill=vgrad(D, "#3a1a4a", "#a0506a"))
    for sg in (-1, 1):
        path(D, round_arch_d(sg * 9.2, 3.6, 1.2, 5.2), fill=vgrad(D, "#3a1a4a", "#8a4060"))
        banner(D, sg * 9.2, 6.6, 1.4, 4.0, P["roof"], emblem="sun")
    # deep rose soffit band and gold archivolt (central)
    for r0, r1, col in ((4.5, 5.1, P["roof"]), (5.1, 5.9, P["gold"]), (5.9, 6.2, P["gold_d"])):
        path(D, f"M{-r1} {Y(9.5)} A{r1} {r1} 0 0 1 {r1} {Y(9.5)} L{r0} {Y(9.5)} A{r0} {r0} 0 0 0 {-r0} {Y(9.5)} Z", fill=col)
    for i in range(19):   # diamond pattern on the gold band
        a = math.pi * i / 18
        circ(D, -math.cos(a) * 5.5, 9.5 + math.sin(a) * 5.5, 0.16, P["roof_d"])
    for sg in (-1, 1):
        for r0, r1, col in ((1.8, 2.1, P["roof"]), (2.1, 2.5, P["gold"])):
            c = sg * 9.2
            path(D, f"M{c-r1} {Y(5.2)} A{r1} {r1} 0 0 1 {c+r1} {Y(5.2)} L{c+r0} {Y(5.2)} A{r0} {r0} 0 0 0 {c-r0} {Y(5.2)} Z", fill=col)
    # keystone with star
    poly(D, [(-0.8, 15.6), (0.8, 15.6), (0.6, 14.0), (-0.6, 14.0)], Ml, P["gold"], 0.08)
    star(D, 0, 14.9, 0.45, P["gold"])
    # impost blocks with gold triangles
    for sg in (-1, 1):
        rect(D, sg * 4.5 - 0.7, sg * 4.5 + 0.7, 9.0, 9.9, Ml, P["gold"], 0.08)
        poly(D, [(sg * 4.5 - 0.5, 9.1), (sg * 4.5 + 0.5, 9.1), (sg * 4.5, 9.8)], P["gold"])
    # spandrel sun reliefs
    for sg in (-1, 1):
        cx, cy = sg * 7.2, 14.0
        for i in range(16):
            a = i * math.pi / 8
            line(D, cx + math.cos(a) * 0.8, cy + math.sin(a) * 0.8, cx + math.cos(a) * 1.5, cy + math.sin(a) * 1.5, P["gold"], 0.14)
        circ(D, cx, cy, 0.75, P["gold"], P["gold_d"], 0.05)
        # roundel over side bay
        circ(D, sg * 9.2, 10.5, 1.1, P["roof_d"], P["gold"], 0.15)
        star(D, sg * 9.2, 10.5, 0.7, P["gold_l"])
    # paired engaged columns on pedestals
    for cx in (-12.7, -11.4, -5.9, -4.6 - 0.0, 4.6, 5.9, 11.4, 12.7):
        if abs(abs(cx) - 4.6) < 0.01:
            continue
        rect(D, cx - 0.75, cx + 0.75, 1.2, 3.4, Ml, P["marble_d"], 0.04)
        column(D, cx, 3.4, 17.5, 0.45, "corinthian", rings=[0.33])
    # entablature
    rect(D, -14.4, 14.4, 17.5, 18.3, Ml, P["marble_d"], 0.04)
    rect(D, -14.4, 14.4, 18.3, 19.0, P["roof"], P["gold"], 0.06)
    for x in [i * 0.8 - 14.0 for i in range(36)]:
        path(D, f"M{x} {Y(18.4)} l0 -0.45 l0.4 0 l0 0.3 l-0.2 0 ", st=P["gold"], sw=0.06)
    rect(D, -15, 15, 19.0, 19.6, Ml, P["marble_d"], 0.04)
    for x in [i * 0.5 - 14.8 for i in range(60)]:
        rect(D, x, x + 0.25, 18.95, 19.15, P["marble_s"])
    # attic
    rect(D, -13, 13, 19.6, 23.4, vgrad(D, Ml, M), P["marble_d"], 0.04)
    rect(D, -7, 7, 20.2, 22.8, P["roof_d"], P["gold"], 0.12)
    for (sx, sh) in [(-5, 21), (-3.2, 22.1), (-1.0, 20.9), (1.2, 22.2), (3.4, 21.2), (5.4, 21.9)]:
        star(D, sx, sh, 0.35, P["gold_l"], n=5)
    pline(D, [(-5, 21), (-3.2, 22.1), (-1.0, 20.9), (1.2, 22.2), (3.4, 21.2), (5.4, 21.9)], P["gold"], 0.05, 0.6)
    rect(D, -13.5, 13.5, 23.4, 24.0, Ml, P["gold"], 0.08)
    # statues on attic ends
    for sg in (-1, 1):
        rect(D, sg * 11 - 1.1, sg * 11 + 1.1, 24.0, 24.8, Ml, P["marble_d"], 0.04)
        veiled(D, sg * 11, 24.8, 3.2, halo=True)
    # stellated star lantern
    glow(D, 0, 26.8, 4.5, color=P["gold_l"], op=0.7)
    rect(D, -1.4, 1.4, 24.0, 24.9, P["gold"], P["gold_d"], 0.05)
    poly(D, [(0, 29.3), (1.2, 27.4), (2.2, 26.8), (1.2, 26.2), (0, 24.9), (-1.2, 26.2), (-2.2, 26.8), (-1.2, 27.4)], "#fff0c0", P["gold"], 0.12)
    for p_ in [(0, 29.3), (2.2, 26.8), (0, 24.9), (-2.2, 26.8)]:
        line(D, 0, 26.8, p_[0], p_[1], P["gold"], 0.08)
    person(D, -2.5, 1.2)


def lighthouse_obelisk(D, cx=0):
    """Lagoon City lighthouse obelisk (U151 spire with beam, U398 obelisk, U85 crystal obelisk)."""
    # beam
    D.a(f'<rect x="{cx-0.5}" y="{Y(120)}" width="1.0" height="74" fill="{vgrad(D, "#ffffff00", "#bff6ff")}" opacity="0.8"/>')
    glow(D, cx, 47, 2.5, 12, P["teal_l"], 0.5)
    for i, (w, h0, h1) in enumerate([(14, 0, 0.6), (11.5, 0.6, 1.2), (9, 1.2, 1.8)]):
        rect(D, cx - w / 2, cx + w / 2, h0, h1, [P["rose"], P["wall_shade"], P["wall"]][i], P["rose_d"], 0.05)
        line(D, cx - w / 2, h1, cx + w / 2, h1, P["gold"], 0.1)
    # plinth
    rect(D, cx - 2.8, cx + 2.8, 1.8, 2.4, P["white"], P["marble_d"], 0.04)
    rect(D, cx - 2.4, cx + 2.4, 2.4, 6.0, vgrad(D, P["white"], P["marble_s"]), P["marble_d"], 0.04)
    rect(D, cx - 1.6, cx + 1.6, 3.0, 5.4, P["roof_d"], P["gold"], 0.1)
    star(D, cx, 4.2, 0.9, P["gold"])
    rect(D, cx - 2.8, cx + 2.8, 6.0, 6.6, P["white"], P["gold"], 0.08)
    # scroll volutes at plinth sides (replace the serpent figures of U151)
    for sg in (-1, 1):
        path(D, f"M{cx+sg*2.4} {Y(5.6)} C{cx+sg*3.8} {Y(5.4)} {cx+sg*4.2} {Y(3.4)} {cx+sg*3.2} {Y(2.8)} C{cx+sg*2.7} {Y(2.5)} {cx+sg*2.6} {Y(3.3)} {cx+sg*3.1} {Y(3.4)}", st=P["gold"], sw=0.3)
    # shaft
    poly(D, [(cx - 1.6, 6.6), (cx + 1.6, 6.6), (cx + 0.95, 34), (cx - 0.95, 34)], hgrad(D, P["white"], P["marble_s"]), P["marble_d"], 0.05)
    line(D, cx, 6.6, cx, 34, P["gold"], 0.12)
    for hh in (12, 20, 28):
        w = 1.6 - (hh - 6.6) / 27.4 * 0.65
        rect(D, cx - w, cx + w, hh - 0.4, hh + 0.4, P["gold"])
        star(D, cx, hh, 0.32, P["roof_d"])
    # scale bulb
    path(D, onion_d(cx, 3.0, 34, 38.6, neck=0.6, belly=0.45), fill=hgrad(D, P["white"], P["marble_s"]), st=P["gold"], sw=0.08)
    for r in range(4):
        for k in range(-2, 3):
            circ(D, cx + k * 0.5 + (r % 2) * 0.25, 34.8 + r * 0.8, 0.22, "none", P["gold"], 0.06)
    # lantern cage
    glow(D, cx, 40, 4, color=P["amber"], op=0.85)
    rect(D, cx - 1.3, cx + 1.3, 38.4, 38.8, P["gold"])
    rect(D, cx - 1.0, cx + 1.0, 38.8, 41.4, "#ffe2a0")
    for xx in (-1.0, -0.33, 0.33, 1.0):
        line(D, cx + xx, 38.8, cx + xx, 41.4, P["gold_d"], 0.12)
    rect(D, cx - 1.3, cx + 1.3, 41.4, 41.8, P["gold"])
    # needle and winged star
    poly(D, [(cx - 0.4, 41.8), (cx + 0.4, 41.8), (cx, 46)], P["gold"])
    for sg in (-1, 1):
        path(D, f"M{cx} {Y(45.5)} Q{cx+sg*1.6} {Y(46.5)} {cx+sg*2.2} {Y(48)} Q{cx+sg*1.2} {Y(46.8)} {cx} {Y(46.2)} Z", fill=P["gold_l"])
    star(D, cx, 46.6, 0.7, glowc="#bff6ff")
    person(D, cx + 5.5, 0)


def memorial_column(D, cx=0):
    """Stepped-plinth memorial column with a veiled figure (U127, U139 column-statue avenue, U81)."""
    for i, (w, h0, h1) in enumerate([(5.2, 0, 0.5), (4.4, 0.5, 1.0), (3.6, 1.0, 1.5)]):
        rect(D, cx - w / 2, cx + w / 2, h0, h1, [P["rose"], P["wall_shade"], P["wall"]][i], P["rose_d"], 0.04)
    rect(D, cx - 1.3, cx + 1.3, 1.5, 4.6, vgrad(D, P["white"], P["marble_s"]), P["marble_d"], 0.04)
    rect(D, cx - 0.9, cx + 0.9, 2.0, 4.1, P["roof_d"], P["gold"], 0.08)
    # lotus relief
    for k in (-1, 0, 1):
        path(D, f"M{cx+k*0.4-0.25} {Y(2.6)} Q{cx+k*0.4} {Y(3.6)} {cx+k*0.4+0.25} {Y(2.6)} Z", fill=P["gold"])
    rect(D, cx - 1.5, cx + 1.5, 4.6, 5.0, P["white"], P["gold"], 0.06)
    column(D, cx, 5.0, 17.2, 0.55, "corinthian", rings=[0.25, 0.75], flutes=6)
    rect(D, cx - 0.9, cx + 0.9, 17.2, 17.7, P["white"], P["gold"], 0.06)
    veiled(D, cx, 17.7, 2.9, halo=True)


def armillary(D):
    """Giant armillary monument on a stepped octagonal platform in a round pool (U360, U380, U248, U250, U333)."""
    # pool
    rect(D, -17, 17, 0, 0.8, P["wall_shade"], P["rose_d"], 0.05)
    line(D, -17, 0.8, 17, 0.8, P["gold"], 0.12)
    glow(D, 0, 0.9, 16, 1.2, P["teal"], 0.6)
    for x in (-14.5, -11, 11, 14.5):   # jets
        path(D, f"M{x} {Y(0.8)} Q{x+0.2} {Y(3.5)} {x+0.9} {Y(1.2)}", st=P["water"], sw=0.12, op=0.8)
        path(D, f"M{x} {Y(0.8)} Q{x-0.2} {Y(3.5)} {x-0.9} {Y(1.2)}", st=P["water"], sw=0.12, op=0.8)
    # stepped octagonal tiers (elevation shows three faces)
    tiers = [(28, 0.8, 2.4), (22, 2.4, 4.0), (16, 4.0, 5.6), (10, 5.6, 7.2)]
    for w, h0, h1 in tiers:
        f = w * 0.29  # chamfer face width
        rect(D, -w / 2, -w / 2 + f, h0, h1, P["gold_d"], P["rose_d"], 0.05)
        rect(D, w / 2 - f, w / 2, h0, h1, P["gold_d"], P["rose_d"], 0.05)
        rect(D, -w / 2 + f, w / 2 - f, h0, h1, vgrad(D, P["gold_l"], P["gold"]), P["rose_d"], 0.05)
        rect(D, -w / 2, w / 2, h1 - 0.25, h1, P["white"])
        # teal crystal inserts
        for xx in (-w / 2 + f, w / 2 - f):
            poly(D, [(xx - 0.4, h0), (xx + 0.4, h0), (xx, h0 + 1.2)], P["teal"], P["teal_l"], 0.04)
    # centre stair
    for i in range(8):
        rect(D, -1.6, 1.6, 0.8 + i * 0.8, 0.8 + i * 0.8 + 0.2, P["white"], op=0.6)
    # calyx pedestal
    rect(D, -0.6, 0.6, 7.2, 9.2, cyl(D, P["gold"], P["gold_l"], P["gold_d"]))
    path(D, f"M-0.6 {Y(9.2)} C-2.6 {Y(9.6)} -2.8 {Y(10.8)} -2.6 {Y(11.4)} L2.6 {Y(11.4)} C2.8 {Y(10.8)} 2.6 {Y(9.6)} 0.6 {Y(9.2)} Z", fill=P["gold"])
    for k in range(-3, 4):
        poly(D, [(k * 0.75 - 0.3, 9.6), (k * 0.75 + 0.3, 9.6), (k * 0.85, 11.6)], P["teal"], P["teal_l"], 0.04)
    C = 18.5
    # swirling water core
    glow(D, 0, C, 8, color=P["teal"], op=0.75)
    circ(D, 0, C, 3.2, rgrad(D, "#c8fff6", 1.0, 0.5))
    for k in range(4):
        a0 = k * 90
        path(D, f"M{3.0*math.cos(math.radians(a0)):.2f} {Y(C+3.0*math.sin(math.radians(a0))):.2f} "
                f"Q0 {Y(C):.2f} {-2.6*math.cos(math.radians(a0+60)):.2f} {Y(C-2.6*math.sin(math.radians(a0+60))):.2f}", st="#7af0ff", sw=0.25, op=0.8)
    # rings
    def ring(rx, ry, rot, w=0.38):
        ell(D, 0, C, rx, ry, "none", P["gold_d"], w + 0.15, rot=rot)
        ell(D, 0, C, rx, ry, "none", P["gold"], w, rot=rot)
        ell(D, 0, C, rx, ry, "none", P["teal_l"], 0.08, rot=rot)
    ring(1.8, 6.6, 0)
    ring(6.6, 2.0, -18)
    ring(6.6, 3.1, 32)
    # big outer swept ring with arrow points (U380)
    path(D, f"M-8.2 {Y(C+1)} A8.4 8.4 0 0 1 6.5 {Y(C+5.6)}", st=P["gold"], sw=0.5)
    poly(D, [(6.2, C + 6.4), (7.6, C + 5.0), (5.9, C + 4.9)], P["gold"])
    path(D, f"M7.9 {Y(C-2)} A8.4 8.4 0 0 1 -5.0 {Y(C-6.8)}", st=P["gold"], sw=0.5)
    poly(D, [(-5.7, C - 7.6), (-4.0, C - 7.5), (-5.0, C - 6.0)], P["gold"])
    # orrery arms with planet orbs (U360)
    for ang, rr, orb in ((20, 10.2, P["violet"]), (150, 9.6, P["pink_glow"]), (210, 9.8, P["teal"]), (330, 10.5, P["amber"]), (95, 9.0, P["gold_l"])):
        a = math.radians(ang)
        line(D, 0, C, rr * math.cos(a), C + rr * math.sin(a), P["gold_d"], 0.12)
        glow(D, rr * math.cos(a), C + rr * math.sin(a), 1.4, color=orb, op=0.6)
        circ(D, rr * math.cos(a), C + rr * math.sin(a), 0.55, orb, P["gold"], 0.1)
    circ(D, 0, C + 6.6, 0.4, P["gold"])
    star(D, 0, C + 7.6, 0.7, glowc=P["gold_l"])
    # banner poles and lamp posts on the corners
    for sg in (-1, 1):
        line(D, sg * 12.6, 2.4, sg * 12.6, 11.5, P["gold_d"], 0.15)
        banner(D, sg * 12.6 + sg * 0.0, 11.0, 1.1, 4.5, P["roof"], emblem="star")
        lamp_post(D, sg * 9.6, 4.0, 3.2)
        lamp_post(D, sg * 15.6, 0.8, 3.2)
    person(D, -5.5, 0.8)


def armillary_plan(D):
    """Plan of the armillary platform (metres)."""
    import math as m
    circ(D, 0, 0, 17, P["water_d"], P["gold"], 0.25)
    circ(D, 0, 0, 16.2, "none", P["teal"], 0.12, 0.7)
    for w, col in ((28, P["gold_d"]), (22, P["gold"]), (16, P["gold_d"]), (10, P["gold"])):
        r = w / 2 / m.cos(m.pi / 8)
        pts = [(r * m.cos(m.pi / 8 + k * m.pi / 4), r * m.sin(m.pi / 8 + k * m.pi / 4)) for k in range(8)]
        poly(D, pts, col, P["rose_d"], 0.15)
    for k in range(4):
        a = k * m.pi / 2
        poly(D, [(m.cos(a) * 5 - m.sin(a) * 1.6, m.sin(a) * 5 + m.cos(a) * 1.6), (m.cos(a) * 14 - m.sin(a) * 1.6, m.sin(a) * 14 + m.cos(a) * 1.6),
                 (m.cos(a) * 14 + m.sin(a) * 1.6, m.sin(a) * 14 - m.cos(a) * 1.6), (m.cos(a) * 5 + m.sin(a) * 1.6, m.sin(a) * 5 - m.cos(a) * 1.6)], P["white"], op=0.85)
    circ(D, 0, 0, 2.6, P["teal"], P["gold"], 0.2)
    circ(D, 0, 0, 6.6, "none", P["gold_l"], 0.25, 0.8)
    for k in range(8):
        a = m.pi / 8 + k * m.pi / 4
        circ(D, 15.6 * m.cos(a), 15.6 * m.sin(a), 0.5, "#fff2c8")


def clock_tower(D):
    """Clock tower (U360 clock tower crop, U310 glowing clock, U54 brick clock tower, U233 clock over arch, U396)."""
    # base
    rect(D, -4.3, 4.3, 0, 10, vgrad(D, P["wall"], P["rose"]), P["rose_d"], 0.06)
    courses(D, -4.3, 4.3, 0, 10, 0.8, P["rose_d"], 0.04, 0.5)
    glow(D, 0, 3, 3.5, 4, P["amber"], 0.6)
    d, _ = pointed_arch_d(0, 3.0, 0, 6.2)
    path(D, d, fill="#ffcf7a", st=P["gold"], sw=0.2)
    rect(D, -4.6, 4.6, 10, 10.6, P["white"], P["gold"], 0.08)
    # shaft
    rect(D, -3.5, 3.5, 10.6, 31, vgrad(D, P["white"], P["marble"]), P["marble_d"], 0.05)
    for sg in (-1, 1):   # gold pilaster panels
        rect(D, sg * 3.5 - sg * 0.0 - (0.9 if sg > 0 else 0), sg * 3.5 + (0.9 if sg < 0 else 0), 10.6, 31, P["gold"], P["gold_d"], 0.05)
    for hh in (13, 17.5):
        d, _ = pointed_arch_d(0, 1.0, hh, hh + 3.0)
        path(D, d, fill="#ffd890", st=P["gold"], sw=0.1)
    # pendulum weights
    for xx, top in ((-0.9, 21.5), (0, 20.6), (0.9, 21.5)):
        line(D, xx, 24.6, xx, top, P["gold_d"], 0.08)
        poly(D, [(xx - 0.3, top), (xx + 0.3, top), (xx + 0.22, top - 1.0), (xx, top - 1.3), (xx - 0.22, top - 1.0)], P["gold"])
    # clock face
    C = 27.3
    glow(D, 0, C, 4.6, color=P["teal"], op=0.6)
    circ(D, 0, C, 2.9, P["gold"], P["gold_d"], 0.1)
    circ(D, 0, C, 2.45, rgrad(D, "#7fe0ff", 1, 0.6))
    circ(D, 0, C, 2.45, "none", P["violet_d"], 0.15)
    for k in range(12):
        a = math.radians(90 - k * 30)
        star(D, 2.1 * math.cos(a), C + 2.1 * math.sin(a), 0.18, P["gold_l"], n=4)
    line(D, 0, C, 1.3, C + 0.6, P["ink"], 0.14)
    line(D, 0, C, -0.3, C + 1.8, P["ink"], 0.1)
    star(D, -0.3, C + 1.85, 0.2, P["gold_l"], n=4)
    # cornice with urns
    rect(D, -4.2, 4.2, 31, 31.8, P["white"], P["gold"], 0.08)
    for sg in (-1, 1):
        path(D, onion_d(sg * 3.8, 0.7, 31.8, 33.0, 0.5, 0.5), fill=P["gold"])
    # belfry
    rect(D, -3.4, 3.4, 31.8, 37, P["marble"], P["marble_d"], 0.05)
    glow(D, 0, 34, 3, 2.4, P["amber"], 0.5)
    for xx in (-2.1, 0, 2.1):
        path(D, round_arch_d(xx, 1.3, 32.6, 35.6), fill="#3a1a40", st=P["gold"], sw=0.1)
    path(D, f"M-0.45 {Y(33.4)} Q-0.45 {Y(35.2)} 0 {Y(35.3)} Q0.45 {Y(35.2)} 0.45 {Y(33.4)} Z", fill=P["gold"])
    rect(D, -3.4, 3.4, 32.4, 32.6, P["gold"])
    # roof
    poly(D, [(-4.0, 37), (4.0, 37), (1.0, 42.4), (-1.0, 42.4)], vgrad(D, P["roof"], P["roof_d"]), P["gold"], 0.12)
    for sg in (-1, 1):
        poly(D, [(sg * 1.0 - 0.6, 38.2), (sg * 1.0 + 0.6, 38.2), (sg * 1.0, 39.6)], P["white"], P["gold"], 0.06)
    rect(D, -1.0, 1.0, 42.4, 43.0, P["gold"])
    circ(D, 0, 43.6, 0.6, P["gold"])
    star(D, 0, 44.9, 0.6, glowc=P["gold_l"])
    person(D, 5.6, 0)


def moorish_gate(D):
    """Moorish horseshoe gate for the canyon bazaar (U292, U276, U221, U275, U278)."""
    S, Sd, Sl = P["sand"], P["sand_d"], P["sand_l"]
    # flanking towers
    for sg in (-1, 1):
        c = sg * 11.5
        poly(D, [(c - 2.8, 0), (c + 2.8, 0), (c + 2.5, 18), (c - 2.5, 18)], hgrad(D, Sl, Sd) if sg < 0 else hgrad(D, S, Sd), Sd, 0.06)
        courses(D, c - 2.6, c + 2.6, 0, 18, 1.0, Sd, 0.04, 0.4)
        for hh in (6, 12):
            rect(D, c - 2.7, c + 2.7, hh, hh + 0.4, P["teal_d"])
        for hh in (8.0, 13.6):
            d, cyh, r = horseshoe_d(c, 1.1, hh, hh + 1.4)
            path(D, d, fill="#ffcf80", st=P["gold"], sw=0.08)
        # merlons
        for k in range(-2, 3):
            poly(D, [(c + k * 1.0 - 0.4, 18), (c + k * 1.0 + 0.4, 18), (c + k * 1.0 + 0.4, 18.5), (c + k * 1.0 + 0.2, 18.5), (c + k * 1.0, 19.1), (c + k * 1.0 - 0.2, 18.5), (c + k * 1.0 - 0.4, 18.5)], S, Sd, 0.04)
        # gold dome cap
        path(D, dome_d(c, 3.8, 18.0, 21.0), fill=cyl(D, P["gold"], P["gold_l"], P["gold_d"]))
        star(D, c, 21.8, 0.45, glowc=P["gold_l"])
        # drape
        path(D, f"M{c-sg*2.6} {Y(12.6)} Q{c-sg*4.5} {Y(10)} {c-sg*4.2} {Y(5.5)} L{c-sg*3.0} {Y(6.4)} Q{c-sg*3.2} {Y(10)} {c-sg*2.5} {Y(11.4)} Z", fill=P["roof"], op=0.95)
    # gate block
    rect(D, -8.7, 8.7, 0, 15, vgrad(D, Sl, S), Sd, 0.06)
    courses(D, -8.7, 8.7, 0, 15, 0.9, Sd, 0.04, 0.35)
    # alfiz frame
    rect(D, -5.6, 5.6, 0, 12.2, "none", P["teal_d"], 0.5)
    rect(D, -5.6, 5.6, 0, 12.2, "none", P["gold"], 0.15)
    # horseshoe opening with voussoirs
    d, cyh, r = horseshoe_d(0, 6.2, 0, 6.4, 1.2)
    glow(D, 0, 4, 5, 5, P["amber"], 0.6)
    path(D, d, fill=vgrad(D, "#ffd790", "#c06a4a"))
    n = 21
    a0, a1 = -math.asin((6.4 - cyh) / r) if False else math.atan2(6.4 - cyh, -3.1), math.atan2(6.4 - cyh, 3.1)
    a0 = math.atan2(6.4 - cyh, -3.1)
    a1 = math.atan2(6.4 - cyh, 3.1) + 2 * math.pi if math.atan2(6.4 - cyh, 3.1) < 0 else math.atan2(6.4 - cyh, 3.1)
    # sweep from left springing over the top to the right springing (decreasing angle from a0 to a1-2pi)
    start = a0
    end = math.atan2(6.4 - cyh, 3.1)
    tot = (start - end) % (2 * math.pi)
    tot = 2 * math.pi - tot if tot < math.pi else tot
    for i in range(n):
        t0 = start - tot * i / n * -1
    angs = [a0 + (2 * math.pi - (a0 - end)) * 0 for _ in range(1)]
    # simpler: walk angle from a0 downwards (clockwise in metre space means decreasing) -- use explicit list
    A0 = math.degrees(a0)
    A1 = math.degrees(end)
    span = (A0 - A1) % 360
    span = 360 - span if span < 180 else span
    for i in range(n):
        u0 = math.radians(A0 - span * i / n)
        u1 = math.radians(A0 - span * (i + 1) / n)
        R0, R1 = r, r + 1.3
        pts = [(R0 * math.cos(u0), cyh + R0 * math.sin(u0)), (R1 * math.cos(u0), cyh + R1 * math.sin(u0)), (R1 * math.cos(u1), cyh + R1 * math.sin(u1)), (R0 * math.cos(u1), cyh + R0 * math.sin(u1))]
        poly(D, pts, P["roof"] if i % 2 == 0 else Sl, Sd, 0.04)
    # twisted jamb columns
    for sg in (-1, 1):
        column(D, sg * 3.6, 0, 6.3, 0.28, "twisted", fill=Sl, lit="#fff0dc", shade=Sd, gold=P["gold"])
    # brass lantern
    line(D, 0, cyh + r - 0.2, 0, 7.6, P["gold_d"], 0.06)
    glow(D, 0, 7.0, 1.6, color=P["amber"], op=0.9)
    poly(D, [(-0.35, 7.6), (0.35, 7.6), (0.45, 7.0), (0, 6.3), (-0.45, 7.0)], P["gold"], P["gold_d"], 0.04)
    # lattice windows above
    for xx in (-3.4, 0, 3.4):
        d2, _, _ = horseshoe_d(xx, 1.5, 12.8, 13.8, 1.15)
        path(D, d2, fill="#ffcf80", st=P["gold"], sw=0.08)
        for k in range(-1, 2):
            line(D, xx + k * 0.35, 12.8, xx + k * 0.35, 14.4, Sd, 0.05)
    # stepped merlons
    for k in range(-8, 9):
        x = k * 1.0
        poly(D, [(x - 0.45, 15), (x + 0.45, 15), (x + 0.45, 15.5), (x + 0.22, 15.5), (x + 0.22, 16.0), (x - 0.22, 16.0), (x - 0.22, 15.5), (x - 0.45, 15.5)], Sl, Sd, 0.04)
    person(D, -6.6, 0)


def pailou(D):
    """Three-bay pailou lantern gate (U317 Lantern Rite gate, U323 gate, U50 lanterns, U68)."""
    L, Ld = P["lacquer"], P["lacquer_d"]
    posts = [(-10, 9.6), (-3.5, 11.0), (3.5, 11.0), (10, 9.6)]
    for x, top in posts:
        rect(D, x - 0.8, x + 0.8, 0, 1.2, P["stone_l"], P["stone_d"], 0.05, rx=0.15)
        rect(D, x - 0.42, x + 0.42, 1.2, top, cyl(D, L, "#e0505a", Ld))
        for hh in (2.0, top - 1.0):
            rect(D, x - 0.46, x + 0.46, hh, hh + 0.3, P["gold"])
    def roof(cx, half, h0, h1, over):
        # eave curve upswept at the ends
        x0, x1 = cx - half - over, cx + half + over
        d = (f"M{x0} {Y(h0+0.9)} Q{x0+over*0.9} {Y(h0)} {cx-half} {Y(h0+0.15)} L{cx+half} {Y(h0+0.15)} Q{x1-over*0.9} {Y(h0)} {x1} {Y(h0+0.9)} "
             f"L{x1-over*0.5} {Y(h0+0.7)} Q{cx+half*0.6} {Y(h1-0.4)} {cx+half*0.35} {Y(h1)} L{cx-half*0.35} {Y(h1)} Q{cx-half*0.6} {Y(h1-0.4)} {x0+over*0.5} {Y(h0+0.7)} Z")
        path(D, d, fill=vgrad(D, P["tile_l"], P["tile"]), st=P["gold"], sw=0.1)
        for k in range(-int(half) - 1, int(half) + 2):
            xx = cx + k * 0.55
            line(D, xx, h0 + 0.3, xx * 0.97 + cx * 0.03, h1 - 0.2, P["plum"], 0.08, 0.6)
        rect(D, cx - half * 0.35, cx + half * 0.35, h1, h1 + 0.35, P["tile"], P["gold"], 0.06)
        for sg in (-1, 1):
            xx = cx + sg * half * 0.35
            path(D, f"M{xx} {Y(h1+0.35)} q{sg*0.6} 0 {sg*0.6} -0.6 q0 -0.4 {-sg*0.35} -0.3", st=P["gold"], sw=0.15)
    # beams and plaque
    for (xa, xb, hb) in ((-3.5, 3.5, 7.5), (-3.5, 3.5, 9.6), (-10, -3.5, 6.6), (3.5, 10, 6.6), (-10, -3.5, 8.3), (3.5, 10, 8.3)):
        rect(D, xa - 0.6, xb + 0.6, hb, hb + 0.55, cyl(D, L, "#d8485a", Ld), P["gold"], 0.05)
        rect(D, xa + 0.4, xb - 0.4, hb + 0.2, hb + 0.35, P["gold"], op=0.8)
    rect(D, -1.4, 1.4, 8.05, 9.6, P["gold"], P["gold_d"], 0.1)
    rect(D, -1.1, 1.1, 8.25, 9.4, P["roof_d"])
    star(D, 0, 8.8, 0.4, P["gold_l"])
    # bracket sets
    for xa, xb, hb in ((-3.5, 3.5, 10.15), (-10, -3.5, 8.85), (3.5, 10, 8.85)):
        n = int((xb - xa) / 0.8)
        for k in range(n + 1):
            x = xa + k * (xb - xa) / n
            rect(D, x - 0.25, x + 0.25, hb, hb + 0.3, P["teal_d"])
            rect(D, x - 0.35, x + 0.35, hb + 0.3, hb + 0.55, P["gold_d"])
    roof(0, 3.6, 10.7, 13.6, 2.2)
    roof(-6.75, 3.3, 9.4, 11.6, 1.6)
    roof(6.75, 3.3, 9.4, 11.6, 1.6)
    glow(D, 0, 13.9, 0.9, color=P["gold_l"], op=0.8)
    circ(D, 0, 13.95, 0.35, P["gold_l"])
    # lanterns
    for x in (-2.4, -1.2, 0, 1.2, 2.4):
        lantern_cyl(D, x, 7.5, 0.7, 1.3)
    for c in (-6.75, 6.75):
        for x in (c - 1.6, c, c + 1.6):
            lantern_cyl(D, x, 6.6, 0.65, 1.2)
    for x in (-10, 10):
        for k in range(4):
            lantern_cyl(D, x + (0.8 if x > 0 else -0.8), 9.2 - k * 1.6, 0.55, 1.1)
    person(D, 6.0, 0)


def torii(D, cx=0):
    """Vermilion torii with shimenawa (U68 waterfall torii, U59, U09)."""
    L, Ld = "#d8422e", "#8a2a20"
    for sg in (-1, 1):
        x0, x1 = cx + sg * 3.3, cx + sg * 3.0
        poly(D, [(x0 - 0.38, 0), (x0 + 0.38, 0), (x1 + 0.32, 8.0), (x1 - 0.32, 8.0)], cyl(D, L, "#f06a4a", Ld))
        rect(D, x0 - 0.45, x0 + 0.45, 0, 0.9, P["ink"])
    rect(D, cx - 4.4, cx + 4.4, 6.3, 6.8, cyl(D, L, "#f06a4a", Ld))
    rect(D, cx - 0.3, cx + 0.3, 6.8, 7.7, L)
    d = (f"M{cx-5.6} {Y(8.5)} Q{cx-4.5} {Y(7.6)} {cx-3} {Y(7.7)} L{cx+3} {Y(7.7)} Q{cx+4.5} {Y(7.6)} {cx+5.6} {Y(8.5)} "
         f"L{cx+5.7} {Y(9.0)} Q{cx+4.5} {Y(8.3)} {cx+3} {Y(8.4)} L{cx-3} {Y(8.4)} Q{cx-4.5} {Y(8.3)} {cx-5.7} {Y(9.0)} Z")
    path(D, d, fill=L, st=Ld, sw=0.05)
    path(D, (f"M{cx-5.7} {Y(9.0)} Q{cx-4.5} {Y(8.3)} {cx-3} {Y(8.4)} L{cx+3} {Y(8.4)} Q{cx+4.5} {Y(8.3)} {cx+5.7} {Y(9.0)} "
             f"L{cx+5.75} {Y(9.25)} Q{cx+4.5} {Y(8.6)} {cx+3} {Y(8.7)} L{cx-3} {Y(8.7)} Q{cx-4.5} {Y(8.6)} {cx-5.75} {Y(9.25)} Z"), fill=P["ink"])
    rect(D, cx - 0.45, cx + 0.45, 6.95, 7.55, P["gold"])
    # shimenawa rope and shide
    path(D, f"M{cx-3.0} {Y(5.8)} Q{cx} {Y(5.0)} {cx+3.0} {Y(5.8)}", st="#e8d49a", sw=0.32)
    for k in range(-2, 3):
        x = cx + k * 1.1
        hh = 5.35 + abs(k) * 0.12
        pline(D, [(x, hh), (x + 0.15, hh - 0.25), (x - 0.1, hh - 0.45), (x + 0.15, hh - 0.7)], P["white"], 0.12)


def stone_lantern(D, x, s=1.0):
    rect(D, x - 0.45 * s, x + 0.45 * s, 0, 0.25 * s, P["stone"], P["stone_d"], 0.03)
    rect(D, x - 0.15 * s, x + 0.15 * s, 0.25 * s, 1.0 * s, P["stone_l"], P["stone_d"], 0.03)
    rect(D, x - 0.4 * s, x + 0.4 * s, 1.0 * s, 1.15 * s, P["stone"], P["stone_d"], 0.03)
    glow(D, x, 1.4 * s, 0.9 * s, color=P["amber"], op=0.8)
    rect(D, x - 0.3 * s, x + 0.3 * s, 1.15 * s, 1.65 * s, P["stone_l"], P["stone_d"], 0.03)
    rect(D, x - 0.15 * s, x + 0.15 * s, 1.25 * s, 1.55 * s, "#ffd27a")
    poly(D, [(x - 0.6 * s, 1.65 * s), (x + 0.6 * s, 1.65 * s), (x + 0.2 * s, 1.95 * s), (x - 0.2 * s, 1.95 * s)], P["stone"], P["stone_d"], 0.03)
    circ(D, x, 2.05 * s, 0.12 * s, P["stone_l"])


def waygate(D, cx=0):
    """Twin flared monolith waygate with gold interlace crest on an inlaid ring dais (U134, U136)."""
    ell(D, cx, 0.2, 4.6, 0.7, P["stone_d"], P["gold"], 0.08)
    ell(D, cx, 0.32, 3.6, 0.5, "none", P["gold_l"], 0.08)
    glow(D, cx, 0.3, 4, 0.8, P["gold_l"], 0.5)
    for sg in (-1, 1):
        c = cx + sg * 1.6
        d = (f"M{c-0.8} {Y(0.3)} C{c-0.4} {Y(1.2)} {c-0.4} {Y(5)} {c-0.95} {Y(7.4)} L{c+0.95} {Y(7.4)} C{c+0.4} {Y(5)} {c+0.4} {Y(1.2)} {c+0.8} {Y(0.3)} Z")
        path(D, d, fill=hgrad(D, P["marble"], P["marble_s"]), st=P["gold"], sw=0.08)
        path(D, f"M{c-sg*0.05} {Y(0.6)} C{c+sg*0.25} {Y(2)} {c+sg*0.2} {Y(5)} {c+sg*0.5} {Y(7.2)}", st=P["teal"], sw=0.14)
        rect(D, c - 1.1, c + 1.1, 7.4, 7.8, P["gold"], P["gold_d"], 0.05)
        rect(D, c - 0.6, c + 0.6, 1.0, 1.3, P["gold"])
    for col, w in ((P["ink"], 0.28), (P["gold"], 0.17)):
        path(D, f"M{cx-1.4} {Y(7.8)} C{cx-1.6} {Y(9.4)} {cx-0.4} {Y(10.0)} {cx} {Y(9.0)} C{cx+0.4} {Y(10.0)} {cx+1.6} {Y(9.4)} {cx+1.4} {Y(7.8)}", st=col, sw=w)
        path(D, f"M{cx-0.9} {Y(8.0)} L{cx} {Y(9.2)} L{cx+0.9} {Y(8.0)} L{cx} {Y(6.6)} Z", st=col, sw=w)
    glow(D, cx, 4, 1.6, 3.2, P["teal_l"], 0.35)


# =====================================================================================  SHEET A LAYOUT
def sheet_a():
    W, H = 2400, 3300
    D = Doc(W, H)
    D.a(f'<rect width="{W}" height="{H}" fill="#0c0a1e"/>')
    ptext(D, 24, 52, "Monuments A · gateways, columns, towers", 38, P["text"], weight="bold")
    ptext(D, 24, 86, f"Landmark monuments for the scene points (world-layout §2, §2A, §9) · night look · each panel at its own scale, 1.7 m figure and scale bar in every panel · round {ROUND}", 17, P["text2"])
    ptext(D, 24, 110, "Game rules applied: statues veiled and faceless, no eyes on any creature, crosses become stars, animal heads become scrolls or lotus buds, nothing modern.", 15, P["text3"], italic=True)

    # Row 1
    y = 130
    p = Panel(D, 16, y, 820, 1060, "Great Gate pylons", 1, 11.0, 410, 880, cap_h=120, seed=3)
    p.sub("bridge end at the crag foot (≈ +250, +330) · leaning rose pylons, gold interlace crest")
    p.begin(); great_gate_pylons(D); p.end()
    p.note(-24, 31, "pierced roundel band|(U60), pink glass", -200, -120)
    p.note(0, 60, "gold openwork interlace|crest (U134 waygate)", 150, -110)
    p.note(-20, 18, "glowing lancet slot", -160, 80)
    p.note(-36.5, 4, "veiled guardian 6 m", 30, 60)
    p.note(-13, 30, "3 layered slabs, gold inlay|leaning 14° (U398)", 120, 60)
    p.scalebar(10)
    p.caption("62 m pylons (66 m with star), 72 m across the plinths; 10 m gap at the crest; 6 m statues.",
              "U398 leaning A-frame pylons with stepped slabs and notched caps; U134/U136 gold interlace crest; U60 pierced roundel band; U379 gate statues with halo.",
              "Blender mesh, one pylon mirrored; slabs share a rose-marble trim sheet + gold inlay emissive mask; crest as a low-poly tube mesh; ~4k tris total. Statues instanced.")

    p = Panel(D, 852, y, 860, 1060, "Triumphal arch (sun arch)", 2, 24.0, 430, 880, cap_h=120, seed=5)
    p.sub("Temple Hill avenue (and ruined copies in the Ruin Meadows) · white marble, deep-rose soffits, gold suns")
    p.begin(); triumphal_arch(D); p.end()
    p.note(0, 27, "stellated star lantern|finial (U386)", 140, -40)
    p.note(7.2, 14, "gold sun relief|in spandrel (U386)", 160, -60)
    p.note(-5, 21.5, "attic relief: constellation|on plum ground", -170, -90)
    p.note(-9.2, 4, "hanging rose banner|with gold sun (U387)", -140, 100)
    p.note(5.0, 13, "deep-rose soffit +|gold diamond archivolt", 220, 30)
    p.note(-11, 26, "veiled statue on attic", -60, -50)
    p.scalebar(5)
    p.caption("28 m wide, 24 m to the attic, 29.3 m to the star; central arch 9 × 14 m, side arches 3.6 × 7 m; 4.6 m deep.",
              "U386 white arches with red soffits, gold sun reliefs, faceted gold impost blocks and star lantern; U387 red-banded arch + sun banners; U255 ribbon banners; U364 paired fluted columns.",
              "Blender mesh baked to a light model (AO + light bake in vertex colour); gold as emissive-tinted metal; banners as alpha cards with cloth sway shader. Ruin variant = same mesh with broken attic.")

    p = Panel(D, 1728, y, 656, 1060, "Lighthouse obelisk + memorial column", 3, 15.0, 230, 880, cap_h=120, seed=7)
    p.sub("Lagoon City quay (obelisk) · avenue and courtyard (column)")
    p.begin(); lighthouse_obelisk(D, 0); memorial_column(D, 21.5); p.end()
    p.note(0, 40, "amber lantern cage|+ teal beam", 120, -60)
    p.note(0, 36, "scale bulb (U151)", -110, 30)
    p.note(0, 20, "gold girih rings|every 8 m", -120, 30)
    p.note(21.5, 19, "veiled figure|with halo", -40, -90)
    p.note(2.8, 3.5, "scroll volutes replace|U151 serpents", 60, 50)
    p.scalebar(5)
    p.caption("Obelisk 46 m (48 m with winged star), 14 m dais; column 20.6 m on a 5.2 m stepped plinth.",
              "U151 white spire with scale bulb, gold collar and beam on a stepped dais; U398 obelisk; U85 crystal obelisk glow; U127 stepped-plinth monument; U139 column-statue avenue; U81 statues.",
              "Obelisk: lathe/extrude mesh + beam as additive cone shader. Column: lathe mesh, instanced along the avenue (12×) with the veiled statue as a shared mesh.")

    # Row 2
    y = 1206
    p = Panel(D, 16, y, 1000, 1000, "Giant armillary monument", 4, 22.0, 420, 820, cap_h=120, seed=9)
    p.sub("castle forecourt plaza at the foot of the grand stair · gold rings round a swirling water core")
    p.begin(); armillary(D); p.end()
    p.note(0, 18.5, "swirling water core|(teal + violet light)", 210, -80)
    p.note(-8.0, 20, "swept outer ring with|arrow tips (U380)", -40, -120)
    p.note(9.9, 21.9, "orrery arms + planet orbs|(U360)", 60, -50)
    p.note(0, 10.5, "gold calyx cup with|teal glass petals", 170, 30)
    p.note(-11.0, 3.2, "gold-faced octagonal tiers|+ teal crystal inserts", -40, 100)
    p.note(14.5, 1.5, "round fountain pool|with jets", 60, 70)
    # plan inset
    cx, cy = 16 + 860, y + 230
    D.a(f'<rect x="{cx-125}" y="{cy-140}" width="250" height="290" rx="6" fill="#16122e" stroke="#6a4a6a"/>')
    ptext(D, cx, cy - 118, "plan", 14, P["gold_l"], "middle")
    D.a(f'<g transform="translate({cx},{cy+12}) scale(6.2)">'); armillary_plan(D); D.a('</g>')
    p.scalebar(5)
    p.caption("28.6 m tall (sphere Ø 13 m, centre at 18.5 m); platform 28 m across the flats on a Ø 34 m pool.",
              "U360 golden armillary + orrery arms on a stepped gold plinth with banners and lamp posts; U380 armillary with swirling water core, teal crystal plinth, arrow-tipped rings; U248 hanging gyroscope; U250 orb on pedestal.",
              "Rings: Blender torus meshes, slow rotation animated in three.js; core = sphere with scrolling noise shader + point light; tiers: low-poly mesh baked; jets = particle sprites.")

    p = Panel(D, 1032, y, 560, 1000, "Clock tower", 5, 16.0, 280, 820, cap_h=120, seed=11)
    p.sub("Lagoon City campo and Storybook square")
    p.begin(); clock_tower(D); p.end()
    p.note(0, 27.3, "teal-glass clock face,|star hour marks", 80, -40)
    p.note(0.9, 21, "hanging pendulum|weights (U360)", 100, 40)
    p.note(0, 34.5, "lit belfry", -110, -30)
    p.note(-3.0, 20, "gold pilaster strips", -60, 60)
    p.scalebar(5)
    p.caption("45 m to the star, 8.6 m base square, 7 m shaft.",
              "U360 clock tower with gold pilasters, blue clock and pendulum drops; U310 glowing blue clock; U54 brick clock tower; U233 clock over an arch; U396 gold clock medallion.",
              "Blender mesh baked to a light model; clock face = emissive texture with rotating hand meshes; belfry glow = emissive card.")

    p = Panel(D, 1608, y, 776, 1000, "Moorish horseshoe gate", 6, 24.0, 388, 820, cap_h=120, ground_col="#3a2030", seed=13)
    p.sub("Red Canyon bazaar entrance · sandstone, polychrome voussoirs, gold domes")
    p.begin(); moorish_gate(D); p.end()
    p.note(-3.8, 9.5, "polychrome voussoirs|rose + cream", -150, -40)
    p.note(0, 13.4, "hex-lattice windows|(U292)", 150, -90)
    p.note(3.6, 3, "twisted jamb columns", 150, 40)
    p.note(11.5, 20.2, "gold dome caps (U275)", 30, -50)
    p.note(-14.5, 8, "rose drapes", -20, 60)
    p.scalebar(5)
    p.caption("Gate block 17.4 × 16 m, opening 6.2 × 9.5 m; towers 5.6 m wide, 22 m with domes; 28.6 m overall.",
              "U292 horseshoe arches, hex lattice, twisted columns, drapes, brass lanterns; U276 gold-domed pavilion with stepped crenellation; U221 horseshoe arches in the rose canyon; U275 gold dome caps; U278 Mughal gate.",
              "Blender mesh baked; lattice as alpha-cutout cards with warm emissive behind; voussoirs vertex-coloured; drapes as alpha cloth cards.")

    # Row 3
    y = 2222
    p = Panel(D, 16, y, 900, 900, "Pailou lantern gate", 7, 36.0, 450, 720, cap_h=120, seed=15)
    p.sub("Lantern River market entrance and bridge ends · red lacquer, plum tiles, rows of lanterns")
    p.begin(); pailou(D); p.end()
    p.note(0, 8.8, "blank gold name plaque|with star", 150, -230)
    p.note(-2.4, 6.6, "row of red-gold cylinder|lanterns (U317)", -170, 90)
    p.note(3.0, 13.4, "scroll ridge ends|(no dragon heads)", 150, -40)
    p.note(-3.0, 10.4, "teal + gold bracket sets", -150, -70)
    p.scalebar(2)
    p.caption("22 m wide over the roofs, 14 m to the ridge pearl; centre bay 7 m clear, 7.5 m to the beam.",
              "U317 huge red gate with rows of glowing lanterns along beams and stacked on posts; U323 red gate and dark tiled roofs; U50 lantern glow; U68 red lacquer and stone bases.",
              "Blender mesh baked; lanterns instanced (≈40) with emissive + sway in vertex shader; roof tiles as normal map on a curved shell.")

    p = Panel(D, 932, y, 720, 900, "Torii shrine gate + waygate", 8, 40.0, 250, 720, cap_h=120, seed=17)
    p.sub("Lantern River waterfall shrine (torii) · Glowwood clearing and Long Bridge approach (waygate)")
    p.begin(); torii(D, 0); stone_lantern(D, -6.2); stone_lantern(D, 6.2); waygate(D, 10.8); p.end()
    p.note(0, 5.4, "shimenawa rope +|paper streamers", -200, -170)
    p.note(5.6, 9.0, "upswept kasagi beam|black cap", 30, -80)
    p.note(6.2, 1.4, "stone lantern", 40, 80)
    p.note(10.8, 9.0, "gold + jade interlace crest|(U134)", -40, -60)
    p.note(12.4, 3.2, "flared marble monolith|teal inlay", 30, 50)
    p.scalebar(2)
    p.caption("Torii 9.3 m tall, 11.4 m beam; stone lanterns 2.2 m. Waygate 10 m to the crest, 4.6 m wide on a Ø 9 m dais.",
              "U68 vermilion torii before a waterfall, stone lanterns; U59 torii on an overlook; U09 shrine torii; U134 / U136 twin flared monoliths with gold-jade knot crest on a ring dais.",
              "Torii: 10-box Blender mesh, vertex colour. Waygate: mesh + emissive inlay; dais ring = emissive decal. Both instanced props.")

    p = Panel(D, 1668, y, 716, 900, "Ornament callouts", 9, 1.0, 0, 760, cap_h=120, sky=False, ground_col="#120f2a")
    p.sub("close-ups of the parts the build thread will model or bake")
    def c_sun(D):
        for r0, r1, col in ((2.0, 2.5, P["roof"]), (2.5, 3.4, P["gold"]), (3.4, 3.6, P["gold_d"])):
            path(D, f"M{-r1} 0 A{r1} {r1} 0 0 1 {r1} 0 L{r0} 0 A{r0} {r0} 0 0 0 {-r0} 0 Z", fill=col)
        for i in range(13):
            a = math.pi * i / 12
            poly(D, [(-math.cos(a) * 2.95, math.sin(a) * 2.95 + 0.18), (-math.cos(a) * 2.95 + 0.15, math.sin(a) * 2.95), (-math.cos(a) * 2.95, math.sin(a) * 2.95 - 0.18), (-math.cos(a) * 2.95 - 0.15, math.sin(a) * 2.95)], P["roof_d"])
        cx, cy = 3.5, 3.0
        for i in range(16):
            a = i * math.pi / 8
            line(D, cx + math.cos(a) * 0.8, cy + math.sin(a) * 0.8, cx + math.cos(a) * 1.5, cy + math.sin(a) * 1.5, P["gold"], 0.14)
        circ(D, cx, cy, 0.75, P["gold"], P["gold_d"], 0.05)
    callout(D, 1668 + 180, y + 230, 145, "sun relief + diamond archivolt (U386)", c_sun, 38, 1.0, 1.5)
    def c_knot(D):
        for col, w in ((P["ink"], 0.5), (P["gold"], 0.32), (P["gold_l"], 0.1)):
            path(D, f"M-3 -2 C-1.5 0 -1 2 0 3 C1 2 1.5 0 3 -2", st=col, sw=w)
            path(D, f"M-2.6 0 Q0 -2 2.6 0", st=col, sw=w)
            path(D, f"M0 -2.2 C-1.1 -1 -1.1 1 0 1.8 C1.1 1 1.1 -1 0 -2.2", st=col, sw=w)
        path(D, f"M-2.6 -2.6 L-1.6 -1.2", st=P["teal"], sw=0.3)
    callout(D, 1668 + 530, y + 230, 145, "interlace crest knot (U134)", c_knot, 40, 0, 0.3)
    def c_lat(D):
        rect(D, -4, 4, -4, 4, P["sand_l"])
        for i in range(-5, 6):
            for j in range(-5, 6):
                x = i * 0.9 + (j % 2) * 0.45
                hh = j * 0.78
                pts = [(x + 0.42 * math.cos(math.radians(30 + 60 * k)), hh + 0.42 * math.sin(math.radians(30 + 60 * k))) for k in range(6)]
                poly(D, pts, "#ffcf80", P["sand_d"], 0.12)
    callout(D, 1668 + 180, y + 560, 145, "hex-lattice screen (U292)", c_lat, 36, 0, 0)
    def c_lan(D):
        glow(D, 0, 0, 4, color=P["gold_l"], op=0.7)
        poly(D, [(0, 2.4), (1.2, 0.5), (2.2, 0), (1.2, -0.6), (0, -2.0), (-1.2, -0.6), (-2.2, 0), (-1.2, 0.5)], "#fff0c0", P["gold"], 0.12)
        for p_ in [(0, 2.4), (2.2, 0), (0, -2.0), (-2.2, 0), (1.2, 0.5), (-1.2, 0.5), (1.2, -0.6), (-1.2, -0.6)]:
            line(D, 0, 0, p_[0], p_[1], P["gold"], 0.08)
    callout(D, 1668 + 530, y + 560, 145, "stellated star lantern (U386)", c_lan, 48, 0, 0)
    p.caption("Callouts drawn at 36–48 px/m.", "U386, U134, U292.", "Ornament reliefs as normal maps; lattice as alpha-cutout; star lantern as emissive faceted mesh.")

    # footer legend
    fy = 3150
    ptext(D, 24, fy, "Palette", 18, P["gold_l"], weight="bold")
    sw_ = [("rose stone", P["wall"]), ("rose shade", P["rose"]), ("plum roof", P["roof"]), ("deep plum", P["roof_d"]), ("gold trim", P["gold"]),
           ("white marble", P["white"]), ("teal glow", P["teal"]), ("amber glow", P["amber"]), ("violet glow", P["violet"]), ("canyon sand", P["sand"]),
           ("lacquer red", P["lacquer"]), ("tile plum-grey", P["tile"])]
    for i, (n, c) in enumerate(sw_):
        x = 24 + i * 196
        D.a(f'<rect x="{x}" y="{fy+14}" width="34" height="22" rx="3" fill="{c}" stroke="#6a4a6a"/>')
        ptext(D, x + 42, fy + 31, n, 14, P["text"])
    ptext(D, 24, fy + 70, "Sheet B: pavilions, temples, ruins, statues and fountains. Notes per item in monuments.md.", 15, P["text3"], italic=True)
    return D


# =====================================================================================  SHEET B (filled in below)
def sheet_b():
    return None


def render(D, name):
    svg = os.path.join(OUT, f"{name}.svg")
    png = os.path.join(OUT, f"{name}.png")
    D.save(svg)
    subprocess.run(["node", RENDER, svg, png, str(D.W), str(D.H)], check=True)
    import shutil
    shutil.copy(png, os.path.join(OUT, f"{name}-r{ROUND}.png"))
    print("wrote", png)


if __name__ == "__main__":
    which = sys.argv[2] if len(sys.argv) > 2 else "ab"
    if "a" in which:
        render(sheet_a(), "monuments-a")
    if "b" in which:
        Db = sheet_b()
        if Db:
            render(Db, "monuments-b")
