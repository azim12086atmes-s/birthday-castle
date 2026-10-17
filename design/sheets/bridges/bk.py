"""Bridges design-sheet kit. Geometry is drawn in metres inside each panel (x right, h up; SVG y = -h),
labels are drawn in pixels on a top layer so they never scale."""
import math

C = dict(
    rose="#e8b9c6", rose_d="#b0607e", rose_l="#f6d2dc", plum="#6e2a5a", roof="#9c3a68", roof_l="#c25488",
    gold="#e6b450", gold_d="#a8782a", gold_l="#ffe3a0", white="#f6eef0", white_s="#d9c8d6", white_d="#a993b0",
    pearl="#f7f2f4", lilac="#f3e8f0", teal="#5fc8c0", teal_d="#2f8a8a", violet="#a46cff", amber="#ffd6a0",
    ink="#2a1630", water0="#0c1430", water1="#1b2550", sky0="#0d0f2a", sky1="#1f1a44", panel="#15132f",
    lake="#101a3a", text="#ffe6ef", sub="#d8c0e0", dim="#9fd8ff",
    n_green="#39ff88", n_blue="#3ab0ff", n_purple="#b45cff", n_yellow="#ffe14a", n_pink="#ff4fb8",
    wood="#8a5a3c", wood_d="#5a3826", wood_l="#c08a5c", rope="#d8b98a", sand="#c99a78", sand_d="#8a5e4a",
    verm="#d8483e", verm_d="#8e2a2a", leaf="#3f8a5a", leaf_d="#24563a", iron="#2a2238",
)
NEON = [C["n_green"], C["n_blue"], C["n_purple"], C["n_yellow"], C["n_pink"]]


def f(v):
    return f"{v:.3f}".rstrip("0").rstrip(".") if abs(v) < 1e6 else str(v)


def pt(x, h):
    return f"{f(x)},{f(-h)}"


class Sheet:
    def __init__(self, w, h, title):
        self.w, self.h = w, h
        self.els, self.defs, self.labels = [], [], []
        self.uid = 0
        self.glows = {}
        self.title = title

    def id(self, p="g"):
        self.uid += 1
        return f"{p}{self.uid}"

    def a(self, s):
        self.els.append(s)

    def d(self, s):
        self.defs.append(s)

    def L(self, s):
        self.labels.append(s)

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
                f'viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}" font-family="Georgia, \'Times New Roman\', serif">'
                f'<defs>{"".join(self.defs)}</defs>{"".join(self.els)}{"".join(self.labels)}</svg>')

    def save(self, path):
        open(path, "w").write(self.svg())

    # gradients -----------------------------------------------------------
    def vgrad(self, top, bot, op1=1, op2=1):
        g = self.id("vg")
        self.d(f'<linearGradient id="{g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}" stop-opacity="{op1}"/>'
               f'<stop offset="1" stop-color="{bot}" stop-opacity="{op2}"/></linearGradient>')
        return f"url(#{g})"

    def hgrad(self, stops):
        g = self.id("hg")
        s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
        self.d(f'<linearGradient id="{g}" x1="0" y1="0" x2="1" y2="0">{s}</linearGradient>')
        return f"url(#{g})"

    def cyl(self, base, lit, shade):
        return self.hgrad([(0, shade), (.3, lit), (.6, base), (1, shade)])

    def glow_id(self, color):
        if color not in self.glows:
            g = self.id("gl")
            self.d(f'<radialGradient id="{g}"><stop offset="0" stop-color="{color}" stop-opacity=".95"/>'
                   f'<stop offset=".25" stop-color="{color}" stop-opacity=".45"/><stop offset="1" stop-color="{color}" stop-opacity="0"/></radialGradient>')
            self.glows[color] = g
        return f"url(#{self.glows[color]})"

    # panel ----------------------------------------------------------------
    def panel(self, x, y, w, h, title, src="", build="", size=""):
        cp = self.id("cp")
        self.d(f'<clipPath id="{cp}"><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14"/></clipPath>')
        bg = self.vgrad("#1a1640", "#0f0e26")
        self.a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="{bg}" stroke="#5a3f6e" stroke-width="2"/>')
        self.L(f'<text x="{x+18}" y="{y+34}" font-size="25" fill="{C["gold_l"]}" font-weight="bold">{title}</text>')
        if src:
            self.L(f'<text x="{x+18}" y="{y+58}" font-size="15" fill="{C["sub"]}" font-style="italic">{src}</text>')
        yy = y + h - 14
        if build:
            self.L(f'<text x="{x+18}" y="{yy}" font-size="15" fill="{C["teal"]}">BUILD: {build}</text>')
            yy -= 21
        if size:
            self.L(f'<text x="{x+18}" y="{yy}" font-size="15" fill="{C["dim"]}">SIZE: {size}</text>')
        return cp


class View:
    """A metric drawing area inside a panel: origin (ox, oy) in px is the point (x=0, h=0); s = px per metre."""

    def __init__(self, S, ox, oy, s, clip=None):
        self.S, self.ox, self.oy, self.s, self.clip = S, ox, oy, s, clip
        self.open = False

    def __enter__(self):
        c = f' clip-path="url(#{self.clip})"' if self.clip else ""
        self.S.a(f'<g{c}><g transform="translate({f(self.ox)},{f(self.oy)}) scale({f(self.s)})">')
        return self

    def __exit__(self, *a):
        self.S.a('</g></g>')

    def px(self, x, h):
        return self.ox + x * self.s, self.oy - h * self.s

    # primitives (metres) ----------------------------------------------------
    def rect(self, x0, x1, h0, h1, fill, st="none", sw=.05, op=1, rx=0):
        x0, x1 = min(x0, x1), max(x0, x1)
        h0, h1 = min(h0, h1), max(h0, h1)
        self.S.a(f'<rect x="{f(x0)}" y="{f(-h1)}" width="{f(x1-x0)}" height="{f(h1-h0)}" rx="{f(rx)}" fill="{fill}" stroke="{st}" stroke-width="{f(sw)}" opacity="{op}"/>')

    def poly(self, pts, fill, st="none", sw=.05, op=1, join="miter"):
        self.S.a(f'<polygon points="{" ".join(pt(x, h) for x, h in pts)}" fill="{fill}" stroke="{st}" stroke-width="{f(sw)}" opacity="{op}" stroke-linejoin="{join}"/>')

    def pline(self, pts, st, sw=.05, op=1, fill="none", dash=None, cap="round"):
        da = f' stroke-dasharray="{dash}"' if dash else ""
        self.S.a(f'<polyline points="{" ".join(pt(x, h) for x, h in pts)}" fill="{fill}" stroke="{st}" stroke-width="{f(sw)}" opacity="{op}" stroke-linecap="{cap}" stroke-linejoin="round"{da}/>')

    def line(self, x0, h0, x1, h1, st, sw=.05, op=1, dash=None):
        self.pline([(x0, h0), (x1, h1)], st, sw, op, dash=dash)

    def path(self, d, fill="none", st="none", sw=.05, op=1, extra=""):
        self.S.a(f'<path d="{d}" fill="{fill}" stroke="{st}" stroke-width="{f(sw)}" opacity="{op}" stroke-linejoin="round" stroke-linecap="round" {extra}/>')

    def circle(self, x, h, r, fill="none", st="none", sw=.05, op=1):
        self.S.a(f'<circle cx="{f(x)}" cy="{f(-h)}" r="{f(r)}" fill="{fill}" stroke="{st}" stroke-width="{f(sw)}" opacity="{op}"/>')

    def ellipse(self, x, h, rx, ry, fill="none", st="none", sw=.05, op=1):
        self.S.a(f'<ellipse cx="{f(x)}" cy="{f(-h)}" rx="{f(rx)}" ry="{f(ry)}" fill="{fill}" stroke="{st}" stroke-width="{f(sw)}" opacity="{op}"/>')

    def glow(self, x, h, r, color, op=1):
        self.S.a(f'<circle cx="{f(x)}" cy="{f(-h)}" r="{f(r)}" fill="{self.S.glow_id(color)}" opacity="{op}"/>')

    def raw(self, s):
        self.S.a(s)

    # labels (px, top layer) ----------------------------------------------------
    def label(self, x, h, s, size=16, fill=None, anchor="start", weight="normal", dx=0, dy=0, italic=False):
        X, Yp = self.px(x, h)
        st = ' font-style="italic"' if italic else ""
        self.S.L(f'<text x="{f(X+dx)}" y="{f(Yp+dy)}" font-size="{size}" fill="{fill or C["text"]}" text-anchor="{anchor}" font-weight="{weight}"{st}>{s}</text>')

    def callout(self, x, h, tx, th, s, size=15, fill=None, anchor=None):
        X0, Y0 = self.px(x, h)
        X1, Y1 = self.px(tx, th)
        anchor = anchor or ("start" if X1 >= X0 else "end")
        self.S.L(f'<line x1="{f(X0)}" y1="{f(Y0)}" x2="{f(X1)}" y2="{f(Y1)}" stroke="{C["gold_l"]}" stroke-width="1.2" opacity=".8"/>'
                 f'<circle cx="{f(X0)}" cy="{f(Y0)}" r="3" fill="{C["gold_l"]}"/>')
        lines = s.split("|")
        for i, ln in enumerate(lines):
            self.S.L(f'<text x="{f(X1 + (5 if anchor=="start" else -5))}" y="{f(Y1 + 5 + i*(size+3))}" font-size="{size}" fill="{fill or C["text"]}" text-anchor="{anchor}">{ln}</text>')

    def dim_h(self, x0, x1, h, s, size=14):
        """horizontal dimension line at height h"""
        X0, Yp = self.px(x0, h)
        X1, _ = self.px(x1, h)
        c = C["dim"]
        self.S.L(f'<line x1="{f(X0)}" y1="{f(Yp)}" x2="{f(X1)}" y2="{f(Yp)}" stroke="{c}" stroke-width="1"/>'
                 f'<line x1="{f(X0)}" y1="{f(Yp-6)}" x2="{f(X0)}" y2="{f(Yp+6)}" stroke="{c}" stroke-width="1"/>'
                 f'<line x1="{f(X1)}" y1="{f(Yp-6)}" x2="{f(X1)}" y2="{f(Yp+6)}" stroke="{c}" stroke-width="1"/>'
                 f'<text x="{f((X0+X1)/2)}" y="{f(Yp-5)}" font-size="{size}" fill="{c}" text-anchor="middle">{s}</text>')

    def dim_v(self, x, h0, h1, s, size=14, side=1):
        X, Y0 = self.px(x, h0)
        _, Y1 = self.px(x, h1)
        c = C["dim"]
        tx = X + 7 * side
        self.S.L(f'<line x1="{f(X)}" y1="{f(Y0)}" x2="{f(X)}" y2="{f(Y1)}" stroke="{c}" stroke-width="1"/>'
                 f'<line x1="{f(X-6)}" y1="{f(Y0)}" x2="{f(X+6)}" y2="{f(Y0)}" stroke="{c}" stroke-width="1"/>'
                 f'<line x1="{f(X-6)}" y1="{f(Y1)}" x2="{f(X+6)}" y2="{f(Y1)}" stroke="{c}" stroke-width="1"/>'
                 f'<text x="{f(tx)}" y="{f((Y0+Y1)/2+5)}" font-size="{size}" fill="{c}" text-anchor="{"start" if side>0 else "end"}">{s}</text>')

    def figure(self, x, h0=0, hgt=1.7, col="#cdb7e6"):
        """veiled, faceless scale figure (a hooded robe), hgt metres tall"""
        k = hgt / 1.7
        pts = [(-.28, 0), (-.24, .5), (-.2, 1.0), (-.22, 1.3), (-.16, 1.5), (-.1, 1.66), (0, 1.7), (.1, 1.66), (.16, 1.5),
               (.22, 1.3), (.2, 1.0), (.24, .5), (.28, 0)]
        self.poly([(x + px_ * k, h0 + ph * k) for px_, ph in pts], col, "#2a1630", .02 * k)
        self.path(f"M{pt(x-.1*k, h0+1.5*k)} Q{pt(x, h0+1.3*k)} {pt(x+.1*k, h0+1.5*k)}", st="#2a1630", sw=.02 * k, op=.5)
        self.line(x, h0 + 1.25 * k, x, h0 + .1 * k, "#2a1630", .015 * k, .35)


# ---------------------------------------------------------------- geometry helpers
def koch(cx, ch, r, level=2, rot=90):
    pts = [(cx + r * math.cos(math.radians(rot + 120 * i)), ch + r * math.sin(math.radians(rot + 120 * i))) for i in range(3)]
    for _ in range(level):
        new = []
        for i in range(len(pts)):
            (x0, y0), (x1, y1) = pts[i], pts[(i + 1) % len(pts)]
            dx, dy = (x1 - x0) / 3, (y1 - y0) / 3
            a = (x0 + dx, y0 + dy)
            b = (x0 + 2 * dx, y0 + 2 * dy)
            # outward bump (points go counter-clockwise -> outward is to the right of the edge)
            mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
            L = math.hypot(dx, dy) * math.sqrt(3) / 2
            nx, ny = dy / math.hypot(dx, dy), -dx / math.hypot(dx, dy)
            c = (mx + nx * L, my + ny * L)
            new += [(x0, y0), a, c, b]
        pts = new
    return pts


def star(cx, ch, r1, r2, n=8, rot=90):
    out = []
    for i in range(2 * n):
        r = r1 if i % 2 == 0 else r2
        a = math.radians(rot + i * 180 / n)
        out.append((cx + r * math.cos(a), ch + r * math.sin(a)))
    return out


def quatrefoil_d(cx, ch, r, lobes=4, rot=45):
    """foil shape: lobes bulging outward, cusps at radius r*0.62"""
    rr = r * .62
    n = lobes
    pts = [(cx + rr * math.cos(math.radians(rot + 360 * i / n)), ch + rr * math.sin(math.radians(rot + 360 * i / n))) for i in range(n)]
    lr = rr * math.sin(math.pi / n) * 1.25
    d = f"M{pt(*pts[0])} "
    for i in range(n):
        d += f"A{f(lr)} {f(lr)} 0 1 0 {pt(*pts[(i+1)%n])} "
    return d + "Z"


def pointed_d(cx, w, h0, h1, k=.9):
    r = w * k
    spring = h1 - math.sqrt(max(r * r - (r - w / 2) ** 2, 0))
    x0, x1 = cx - w / 2, cx + w / 2
    return (f"M{pt(x0, h0)} L{pt(x0, spring)} A{f(r)} {f(r)} 0 0 1 {pt(cx, h1)} A{f(r)} {f(r)} 0 0 1 {pt(x1, spring)} L{pt(x1, h0)} Z"), spring


def round_d(cx, w, h0, h1):
    r = w / 2
    spring = h1 - r
    return f"M{pt(cx-r, h0)} L{pt(cx-r, spring)} A{f(r)} {f(r)} 0 0 1 {pt(cx+r, spring)} L{pt(cx+r, h0)} Z", spring


def seg_d(x0, x1, h0, spring, rise):
    """segmental arch opening: jambs from h0 to spring, an arc of given rise"""
    w = x1 - x0
    r = (w * w / 4 + rise * rise) / (2 * rise)
    return f"M{pt(x0, h0)} L{pt(x0, spring)} A{f(r)} {f(r)} 0 0 1 {pt(x1, spring)} L{pt(x1, h0)} Z", r


def cusped_d(cx, w, h0, spring, lobes=7, depth=.12):
    """multifoil (cusped) round arch opening: semicircle of radius w/2 cut into lobes"""
    r = w / 2
    rin = r * (1 - depth)
    pts = [(cx - rin * math.cos(math.pi * i / lobes), spring + rin * math.sin(math.pi * i / lobes)) for i in range(lobes + 1)]
    pts[0] = (cx - r, spring)
    pts[-1] = (cx + r, spring)
    chord = math.hypot(pts[1][0] - pts[2][0], pts[1][1] - pts[2][1])
    lr = chord * .62
    d = f"M{pt(cx-r, h0)} L{pt(*pts[0])} "
    for i in range(lobes):
        d += f"A{f(lr)} {f(lr)} 0 0 1 {pt(*pts[i+1])} "
    return d + f"L{pt(cx+r, h0)} Z"


def cusped_pointed_d(cx, w, h0, h1, lobes=5, k=.85):
    """cusped pointed (Mughal) arch: points sampled along a pointed arch, joined by small outward lobes"""
    r = w * k
    spring = h1 - math.sqrt(max(r * r - (r - w / 2) ** 2, 0))
    x0 = cx - w / 2
    # left arc centre
    lc = (x0 + r, spring)
    rc = (cx + w / 2 - r, spring)
    a_end = math.atan2(h1 - spring, cx - lc[0])
    pts = []
    m = lobes // 2 + 1
    for i in range(m + 1):
        a = math.pi - (math.pi - a_end) * i / m
        rr = r if i in (0, m) else r * .93
        pts.append((lc[0] + rr * math.cos(a), lc[1] + rr * math.sin(a)))
    a2 = math.atan2(h1 - spring, cx - rc[0])
    for i in range(m - 1, -1, -1):
        a = a2 * i / m
        a = math.pi - a if False else a
        # mirror of left
        x, h = pts[i]
        pts.append((2 * cx - x, h))
    d = f"M{pt(x0, h0)} L{pt(*pts[0])} "
    for i in range(1, len(pts)):
        c = math.hypot(pts[i][0] - pts[i-1][0], pts[i][1] - pts[i-1][1])
        d += f"A{f(c*.6)} {f(c*.6)} 0 0 1 {pt(*pts[i])} "
    return d + f"L{pt(cx+w/2, h0)} Z", spring


def mirror_use(V, gid, axis_h=0, op=.3):
    """reflection of a <g id> about h=axis_h"""
    V.raw(f'<use xlink:href="#{gid}" href="#{gid}" transform="translate(0,{f(-2*axis_h)}) scale(1,-1)" opacity="{op}"/>')
