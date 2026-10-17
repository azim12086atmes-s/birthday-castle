"""Drawing library for the artifacts design sheets.

Sheet space is pixels (y down). Each item is drawn inside `with G(S, X, Y, k):` where X, Y is the item's
ground point in pixels and k is pixels per metre; inside, every function takes metres with h measured UP
from the ground (h -> -h). Stroke widths are given in PIXELS and converted with the current scale, so lines
stay crisp whatever the item's scale.
"""
import math

P = dict(
    # castle palette (brief)
    wall="#e8b9c6", wall_lit="#f6d2dc", wall_d="#b0607e", wall_dd="#7a3a5a",
    roof="#9c3a68", roof_d="#6e2a5a", roof_l="#c25488",
    gold="#e6b450", gold_d="#a8782a", gold_l="#ffe3a0", gold_dd="#6e4a1c",
    white="#f6eef0", marble="#efe4ea", marble_d="#b9a6b8", marble_dd="#7e6a86",
    # cast iron at night: plum-black with a cool rim light
    iron="#2c2236", iron_l="#6d5a82", iron_d="#150f1d",
    verd="#3f8a7e", verd_l="#7cc8b4", verd_d="#1f4a48",
    # glows
    amber="#ffcf7a", amber_d="#ff9a3c", pink="#ff8fc4", teal="#6fe7dc", violet="#b58cff", warm="#fff1c9",
    water="#7fd6e6", water_d="#2d6f8f", water_l="#d8fbff",
    leaf="#3f7a5a", leaf_l="#77b884", leaf_d="#1f4436", rose="#ff6fa8",
    # sheet
    bg0="#110d24", bg1="#1c1433", panel="#1a1430", panel2="#241a3e", edge="#4a3566",
    ink="#fbe7ef", ink2="#e7b6cc", ink3="#b79ac8", label="#ffe3a0",
    ground="#2b2142", ground_l="#4a3a66",
)


class Sheet:
    def __init__(self, w, h):
        self.W, self.H = w, h
        self.els, self.defs = [], []
        self.uid = 0
        self.k = 1.0
        self._gc = {}

    def a(self, s):
        self.els.append(s)

    def d(self, s):
        self.defs.append(s)

    def id(self, p="g"):
        self.uid += 1
        return f"{p}{self.uid}"

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.W} {self.H}" width="{self.W}" height="{self.H}" '
                f'font-family="DejaVu Serif, Georgia, serif"><defs>{"".join(self.defs)}</defs>{"".join(self.els)}</svg>')

    def save(self, path):
        open(path, "w").write(self.svg())


# ----------------------------------------------------------------------------------------------- px helpers
def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def T(S, x, y, s, size=15, fill=None, anchor="start", weight="normal", italic=False, op=1):
    st = ' font-style="italic"' if italic else ""
    S.a(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill or P["ink"]}" text-anchor="{anchor}" '
        f'font-weight="{weight}" opacity="{op}"{st}>{esc(s)}</text>')


def wrap(s, width, size):
    cw = size * 0.56
    n = max(8, int(width / cw))
    out, cur = [], ""
    for w in s.split():
        if len(cur) + len(w) + 1 > n and cur:
            out.append(cur)
            cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        out.append(cur)
    return out


def TW(S, x, y, s, width, size=13, fill=None, lh=1.3, **kw):
    """Wrapped text block; returns the y below it."""
    for ln in wrap(s, width, size):
        T(S, x, y, ln, size, fill, **kw)
        y += size * lh
    return y


# ----------------------------------------------------------------------------------------------- metre space
class G:
    """Enter metre space: origin at pixel (X, Y), k px per metre, optional mirror."""
    def __init__(self, S, X, Y, k, flip=False, op=1, extra=""):
        self.S, self.X, self.Y, self.k, self.flip, self.op, self.extra = S, X, Y, k, flip, op, extra

    def __enter__(self):
        self.prev = self.S.k
        self.S.k = self.k
        sx = -self.k if self.flip else self.k
        o = f' opacity="{self.op}"' if self.op != 1 else ""
        self.S.a(f'<g transform="translate({self.X:.2f} {self.Y:.2f}) scale({sx:.4f} {self.k:.4f})"{o} {self.extra}>')
        return self

    def __exit__(self, *a):
        self.S.a("</g>")
        self.S.k = self.prev


class Sub:
    """Nested transform inside metre space (translate in metres, rotate in degrees, scale, mirror)."""
    def __init__(self, S, x=0, h=0, rot=0, sc=1, flip=False, op=1, sy=None):
        self.S, self.s = S, S
        sy = sc if sy is None else sy
        sx = -sc if flip else sc
        o = f' opacity="{op}"' if op != 1 else ""
        self.open = f'<g transform="translate({x:.3f} {-h:.3f}) rotate({-rot:.2f}) scale({sx:.4f} {sy:.4f})"{o}>'
        self.sc = sc

    def __enter__(self):
        self.prev = self.S.k
        self.S.k = self.S.k * abs(self.sc)
        self.S.a(self.open)
        return self

    def __exit__(self, *a):
        self.S.a("</g>")
        self.S.k = self.prev


def sw(S, p):
    return p / S.k


def M(x, h):
    return f"{x:.3f} {-h:.3f}"


def _st(S, st, w, op, extra=""):
    s = f'fill="none"' if False else ""
    return s


def R(S, x0, x1, h0, h1, fill, st="none", w=1.0, op=1, rx=0, extra=""):
    S.a(f'<rect x="{min(x0,x1):.3f}" y="{-max(h0,h1):.3f}" width="{abs(x1-x0):.3f}" height="{abs(h1-h0):.3f}" rx="{rx}" '
        f'fill="{fill}" stroke="{st}" stroke-width="{sw(S,w):.4f}" opacity="{op}" {extra}/>')


def PL(S, pts, fill, st="none", w=1.0, op=1, extra=""):
    S.a(f'<polygon points="{" ".join(f"{x:.3f},{-h:.3f}" for x, h in pts)}" fill="{fill}" stroke="{st}" '
        f'stroke-width="{sw(S,w):.4f}" stroke-linejoin="round" opacity="{op}" {extra}/>')


def PLN(S, pts, st, w=1.0, op=1, dash=None, fill="none"):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    S.a(f'<polyline points="{" ".join(f"{x:.3f},{-h:.3f}" for x, h in pts)}" fill="{fill}" stroke="{st}" '
        f'stroke-width="{sw(S,w):.4f}" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"{da}/>')


def LN(S, x0, h0, x1, h1, st, w=1.0, op=1, dash=None, cap="round"):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    S.a(f'<line x1="{x0:.3f}" y1="{-h0:.3f}" x2="{x1:.3f}" y2="{-h1:.3f}" stroke="{st}" stroke-width="{sw(S,w):.4f}" '
        f'stroke-linecap="{cap}" opacity="{op}"{da}/>')


def PA(S, d, fill="none", st="none", w=1.0, op=1, extra=""):
    S.a(f'<path d="{d}" fill="{fill}" stroke="{st}" stroke-width="{sw(S,w):.4f}" stroke-linecap="round" '
        f'stroke-linejoin="round" opacity="{op}" {extra}/>')


def C(S, x, h, r, fill, st="none", w=1.0, op=1, extra=""):
    S.a(f'<circle cx="{x:.3f}" cy="{-h:.3f}" r="{r:.3f}" fill="{fill}" stroke="{st}" stroke-width="{sw(S,w):.4f}" opacity="{op}" {extra}/>')


def E(S, x, h, rx, ry, fill, st="none", w=1.0, op=1, extra=""):
    S.a(f'<ellipse cx="{x:.3f}" cy="{-h:.3f}" rx="{rx:.3f}" ry="{ry:.3f}" fill="{fill}" stroke="{st}" stroke-width="{sw(S,w):.4f}" opacity="{op}" {extra}/>')


def arc_d(x, h, rx, ry, a0, a1, n=24):
    """Polyline d for an elliptical arc, angles in degrees (0 = +x, 90 = up)."""
    pts = []
    for i in range(n + 1):
        a = math.radians(a0 + (a1 - a0) * i / n)
        pts.append((x + rx * math.cos(a), h + ry * math.sin(a)))
    return "M" + " L".join(M(*p) for p in pts)


def smooth(pts, closed=False, t=0.5):
    """Catmull-Rom through points -> cubic bezier path d (metre space)."""
    if len(pts) < 3:
        return "M" + " L".join(M(*p) for p in pts)
    p = list(pts)
    if closed:
        p = [p[-1]] + p + [p[0], p[1]]
    else:
        p = [p[0]] + p + [p[-1]]
    d = "M" + M(*p[1])
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) * t / 3, p1[1] + (p2[1] - p0[1]) * t / 3)
        c2 = (p2[0] - (p3[0] - p1[0]) * t / 3, p2[1] - (p3[1] - p1[1]) * t / 3)
        d += f" C{M(*c1)} {M(*c2)} {M(*p2)}"
    if closed:
        d += " Z"
    return d


def lathe_pts(prof, x=0):
    right = [(x + r, h) for r, h in prof]
    left = [(x - r, h) for r, h in reversed(prof)]
    return right + left


def lathe(S, prof, fill, st="none", w=1.0, x=0, op=1, sm=True):
    """A turned object (urn, baluster, bowl) from a profile [(radius, height), ...] bottom to top."""
    if sm:
        d = smooth(lathe_pts(prof, x), closed=True, t=0.35)
    else:
        d = "M" + " L".join(M(*p) for p in lathe_pts(prof, x)) + " Z"
    PA(S, d, fill, st, w, op)


# ----------------------------------------------------------------------------------------------- gradients
def cyl(S, base, lit=None, shade=None, key=None):
    key = ("cyl", base, lit, shade)
    if key in S._gc:
        return S._gc[key]
    gid = S.id("cy")
    lit = lit or base
    shade = shade or base
    S.d(f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{shade}"/>'
        f'<stop offset=".3" stop-color="{lit}"/><stop offset=".58" stop-color="{base}"/><stop offset="1" stop-color="{shade}"/></linearGradient>')
    S._gc[key] = f"url(#{gid})"
    return S._gc[key]


def vg(S, top, bot, mid=None):
    key = ("vg", top, bot, mid)
    if key in S._gc:
        return S._gc[key]
    gid = S.id("vg")
    m = f'<stop offset=".5" stop-color="{mid}"/>' if mid else ""
    S.d(f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/>{m}<stop offset="1" stop-color="{bot}"/></linearGradient>')
    S._gc[key] = f"url(#{gid})"
    return S._gc[key]


def hg(S, a, b):
    key = ("hg", a, b)
    if key in S._gc:
        return S._gc[key]
    gid = S.id("hg")
    S.d(f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/></linearGradient>')
    S._gc[key] = f"url(#{gid})"
    return S._gc[key]


def rg(S, inner, outer, o_in=1, o_out=0, mid=None):
    key = ("rg", inner, outer, o_in, o_out, mid)
    if key in S._gc:
        return S._gc[key]
    gid = S.id("rg")
    m = f'<stop offset=".45" stop-color="{mid}" stop-opacity="{(o_in+o_out)/2:.2f}"/>' if mid else ""
    S.d(f'<radialGradient id="{gid}"><stop offset="0" stop-color="{inner}" stop-opacity="{o_in}"/>{m}'
        f'<stop offset="1" stop-color="{outer}" stop-opacity="{o_out}"/></radialGradient>')
    S._gc[key] = f"url(#{gid})"
    return S._gc[key]


def glow(S, x, h, r, col, op=0.85, ry=None):
    """Soft additive-looking light halo."""
    E(S, x, h, r, ry or r, rg(S, col, col, 1, 0), op=op)


def glass(S, col=None):
    """Lit lantern glass: hot near the flame (bottom centre), warm at the rim."""
    col = col or P["amber"]
    key = ("glass", col)
    if key in S._gc:
        return S._gc[key]
    gid = S.id("gl")
    S.d(f'<radialGradient id="{gid}" cx=".5" cy=".62" r=".65"><stop offset="0" stop-color="#fffbe8"/>'
        f'<stop offset=".35" stop-color="{col}"/><stop offset="1" stop-color="{P["amber_d"]}"/></radialGradient>')
    S._gc[key] = f"url(#{gid})"
    return S._gc[key]


def glass_c(S, core, rim):
    key = ("glassc", core, rim)
    if key in S._gc:
        return S._gc[key]
    gid = S.id("gc")
    S.d(f'<radialGradient id="{gid}" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#ffffff"/>'
        f'<stop offset=".3" stop-color="{core}"/><stop offset="1" stop-color="{rim}"/></radialGradient>')
    S._gc[key] = f"url(#{gid})"
    return S._gc[key]


def blur_filter(S, std):
    key = ("blur", std)
    if key in S._gc:
        return S._gc[key]
    fid = S.id("bl")
    S.d(f'<filter id="{fid}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="{std}"/></filter>')
    S._gc[key] = f'filter="url(#{fid})"'
    return S._gc[key]


# ----------------------------------------------------------------------------------------------- ornaments
def spiral_pts(x, h, r, turns=1.5, a0=0.0, cw=True, shrink=0.55, n=40):
    """Points of a scroll (logarithmic-ish spiral) starting at radius r, angle a0 (deg), winding inwards."""
    pts = []
    sgn = -1 if cw else 1
    for i in range(n + 1):
        t = i / n
        a = math.radians(a0) + sgn * t * turns * 2 * math.pi
        rr = r * (1 - shrink * t) ** 1.6 if shrink < 1 else r * (1 - t)
        pts.append((x + rr * math.cos(a), h + rr * math.sin(a)))
    return pts


def scroll(S, x, h, r, turns=1.4, a0=0, cw=True, col=None, w=2.0, op=1, shrink=0.8, bead=True):
    """A C-scroll volute: spiral curl centred near (x, h)."""
    col = col or P["gold"]
    pts = spiral_pts(x, h, r, turns, a0, cw, shrink)
    PA(S, smooth(pts), st=col, w=w, op=op)
    if bead:
        ex, eh = pts[-1]
        C(S, ex, eh, r * 0.16, col, op=op)
    return pts


def s_scroll(S, x0, h0, x1, h1, r, col=None, w=2.0, op=1):
    """An S-scroll from (x0,h0) to (x1,h1) with a curl at each end."""
    col = col or P["gold"]
    mx, mh = (x0 + x1) / 2, (h0 + h1) / 2
    PA(S, smooth([(x0, h0), (x0 + (mx - x0) * .6, h0 + (mh - h0) * 1.1), (mx, mh), (x1 - (x1 - mx) * .6, h1 - (h1 - mh) * 1.1), (x1, h1)]), st=col, w=w, op=op)
    scroll(S, x0 + r * 0.9 * (1 if x1 > x0 else -1), h0, r, 1.2, 180 if x1 > x0 else 0, x1 > x0, col, w * .85, op)
    scroll(S, x1 - r * 0.9 * (1 if x1 > x0 else -1), h1, r, 1.2, 0 if x1 > x0 else 180, x1 > x0, col, w * .85, op)


def star(S, x, h, r, n=5, inner=0.45, fill=None, rot=90, st="none", w=1, op=1):
    pts = []
    for i in range(2 * n):
        a = math.radians(rot + i * 180 / n)
        rr = r if i % 2 == 0 else r * inner
        pts.append((x + rr * math.cos(a), h + rr * math.sin(a)))
    PL(S, pts, fill or P["gold_l"], st, w, op)


def sparkle(S, x, h, r, col="#ffffff", op=0.9):
    star(S, x, h, r, 4, 0.18, col, 90, op=op)


def leaf(S, x, h, L, ang, wd=0.35, fill=None, st="none", w=1.0, op=1):
    """A pointed leaf (acanthus lobe) from base (x,h) pointing at angle ang (deg)."""
    a = math.radians(ang)
    ux, uh = math.cos(a), math.sin(a)
    px, ph = -uh, ux
    tip = (x + ux * L, h + uh * L)
    c1 = (x + ux * L * .35 + px * L * wd, h + uh * L * .35 + ph * L * wd)
    c2 = (x + ux * L * .35 - px * L * wd, h + uh * L * .35 - ph * L * wd)
    d = f"M{M(x,h)} Q{M(*c1)} {M(*tip)} Q{M(*c2)} {M(x,h)} Z"
    PA(S, d, fill or P["leaf"], st, w, op)


def chain(S, x0, h0, x1, h1, link=0.05, col=None, w=1.0):
    col = col or P["iron_l"]
    L = math.hypot(x1 - x0, h1 - h0)
    n = max(2, int(L / link))
    for i in range(n):
        t = (i + 0.5) / n
        x, h = x0 + (x1 - x0) * t, h0 + (h1 - h0) * t
        if i % 2 == 0:
            E(S, x, h, link * 0.22, link * 0.55, "none", col, w)
        else:
            LN(S, x, h - link * .5, x, h + link * .5, col, w)


def catenary(x0, h0, x1, h1, sag, n=24):
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append((x0 + (x1 - x0) * t, h0 + (h1 - h0) * t - sag * 4 * t * (1 - t)))
    return pts


# ----------------------------------------------------------------------------------------------- figures
def figure(S, x, h=0, col="#8f7fb0", op=0.9, H=1.7):
    """1.7 m scale figure: a soft faceless silhouette in a long coat."""
    k = H / 1.7
    with Sub(S, x, h, sc=k):
        d = (f"M{M(-0.22,0)} L{M(-0.2,0.9)} Q{M(-0.24,1.3)} {M(-0.2,1.42)} Q{M(-0.12,1.47)} {M(0,1.47)} "
             f"Q{M(0.12,1.47)} {M(0.2,1.42)} Q{M(0.24,1.3)} {M(0.2,0.9)} L{M(0.22,0)} Z")
        PA(S, d, col, op=op)
        C(S, 0, 1.58, 0.11, col, op=op)
        LN(S, 0, 0.02, 0, 0.75, P["bg0"], 1.0, op * 0.6)
    T_m = None
    return T_m


def scale_bar(S, x, h, m=1.0, col=None):
    col = col or P["ink3"]
    LN(S, x, h, x + m, h, col, 1.2)
    for i in range(int(m) + 1):
        LN(S, x + i, h - 0.04, x + i, h + 0.04, col, 1.2)


def veiled(S, x, h0, H, stone=None, shade=None, lit=None, pose="hands", hood_gold=False):
    """A faceless veiled figure standing on h0, height H. Hood falls forward over an empty, softly shadowed oval;
    drapery falls in long folds to the plinth. pose: 'hands' (folded), 'urn' (urn on shoulder), 'lamp' (holds a lamp up)."""
    stone = stone or P["marble"]
    shade = shade or P["marble_dd"]
    lit = lit or P["white"]
    k = H / 1.9
    with Sub(S, x, h0, sc=k):
        fill = cyl(S, stone, lit, shade)
        # cloak silhouette: wide hem, narrow shoulders, hood peak
        body = [(-0.42, 0), (-0.36, 0.5), (-0.3, 1.0), (-0.27, 1.3), (-0.25, 1.48), (-0.17, 1.62), (-0.13, 1.8), (0, 1.9),
                (0.13, 1.8), (0.17, 1.62), (0.25, 1.48), (0.27, 1.3), (0.3, 1.0), (0.36, 0.5), (0.42, 0)]
        PA(S, smooth(body) + " Z", fill)
        # hood opening: empty soft-shadowed oval (no face)
        E(S, 0.0, 1.66, 0.085, 0.12, vg(S, shade, stone), op=0.9)
        PA(S, f"M{M(-0.11,1.58)} Q{M(0,1.86)} {M(0.11,1.58)}", st=lit, w=1.2, op=0.8)
        # veil hem across the chest, and long drapery folds
        PA(S, f"M{M(-0.26,1.4)} Q{M(0,1.25)} {M(0.26,1.4)}", st=shade, w=1.2, op=0.8)
        for fx, top in ((-0.22, 1.2), (-0.12, 1.15), (-0.03, 1.05), (0.07, 1.1), (0.17, 1.2), (0.26, 1.0)):
            PA(S, f"M{M(fx,top)} Q{M(fx*1.25+0.02,top*0.5)} {M(fx*1.45,0.02)}", st=shade, w=1.0, op=0.55)
        # hem scallops
        PA(S, smooth([(-0.42, 0.0), (-0.3, 0.05), (-0.18, 0.0), (-0.06, 0.05), (0.06, 0.0), (0.18, 0.05), (0.3, 0.0), (0.42, 0.04)]), st=shade, w=1.0, op=0.7)
        if pose == "hands":
            E(S, 0, 1.02, 0.11, 0.07, stone, shade, 0.8)
            PA(S, f"M{M(-0.26,1.36)} Q{M(-0.2,1.05)} {M(-0.05,1.0)}", st=shade, w=1.0, op=0.8)
            PA(S, f"M{M(0.26,1.36)} Q{M(0.2,1.05)} {M(0.05,1.0)}", st=shade, w=1.0, op=0.8)
        elif pose == "urn":
            lathe(S, [(0.07, 1.62), (0.13, 1.7), (0.16, 1.82), (0.12, 1.94), (0.08, 1.97), (0.11, 2.02)], cyl(S, stone, lit, shade), x=0.24)
            PA(S, f"M{M(0.26,1.4)} Q{M(0.36,1.55)} {M(0.3,1.68)}", st=shade, w=1.2)
            PA(S, f"M{M(-0.26,1.36)} Q{M(-0.15,1.1)} {M(0.0,1.05)}", st=shade, w=1.0, op=0.8)
        elif pose == "lamp":
            PA(S, f"M{M(0.24,1.45)} Q{M(0.36,1.75)} {M(0.32,2.05)}", st=stone, w=3.0)
            glow(S, 0.32, 2.14, 0.35, P["amber"], 0.6)
            lathe(S, [(0.03, 2.03), (0.07, 2.07), (0.09, 2.14), (0.06, 2.2), (0.02, 2.24)], P["gold"], x=0.32)
            C(S, 0.32, 2.15, 0.035, P["warm"])
        if hood_gold:
            PA(S, f"M{M(-0.17,1.62)} Q{M(-0.13,1.86)} {M(0,1.9)} Q{M(0.13,1.86)} {M(0.17,1.62)}", st=P["gold"], w=1.6)


def panel(S, x, y, w, h, title, src, notes=(), size_txt="", num=None):
    """Item frame: dark night tile, gold hairline, title + sources at top, size + build note at bottom."""
    gid = S.id("pn")
    S.d(f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151131"/>'
        f'<stop offset=".7" stop-color="#21173c"/><stop offset="1" stop-color="#2a1b43"/></linearGradient>')
    S.a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="url(#{gid})" stroke="{P["edge"]}" stroke-width="1.5"/>')
    S.a(f'<rect x="{x+4}" y="{y+4}" width="{w-8}" height="{h-8}" rx="8" fill="none" stroke="{P["gold_d"]}" stroke-width="0.6" opacity=".6"/>')
    tx = x + 14
    if num is not None:
        S.a(f'<circle cx="{x+24}" cy="{y+24}" r="13" fill="{P["gold"]}"/>')
        T(S, x + 24, y + 29.5, str(num), 15, P["bg0"], "middle", "bold")
        tx = x + 44
    T(S, tx, y + 30, title, 18, P["label"], weight="bold")
    T(S, tx, y + 50, src, 13, P["ink2"], italic=True)
    yy = y + h - 14 - 15.6 * (sum(len(wrap(n, w - 28, 13)) for n in notes)) - (18 if size_txt else 0)
    if size_txt:
        T(S, x + 14, yy + 13, size_txt, 13.5, P["teal"], weight="bold")
        yy += 18
    for n in notes:
        yy = TW(S, x + 14, yy + 13, n, w - 28, 13, P["ink"], 1.2) - 13
    return y + 60, y + h - 14 - 15.6 * (sum(len(wrap(n, w - 28, 13)) for n in notes)) - (18 if size_txt else 0)


def ground(S, x0, x1, h=0, depth=0.25, col=None, line=None):
    R(S, x0, x1, h - depth, h, col or P["ground"])
    LN(S, x0, h, x1, h, line or P["ground_l"], 1.2)


def callout(S, cx, cy, r, label=None):
    """px space: a gold ring marking a detail area."""
    S.a(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{P["gold_l"]}" stroke-width="1.4" stroke-dasharray="4 3"/>')
    if label:
        T(S, cx, cy - r - 6, label, 12, P["gold_l"], "middle")


def leader(S, x0, y0, x1, y1):
    S.a(f'<line x1="{x0}" y1="{y0}" x2="{x1}" y2="{y1}" stroke="{P["gold_l"]}" stroke-width="1" stroke-dasharray="3 3" opacity=".8"/>')


def note(S, x, y, s, size=12, col=None, anchor="start"):
    T(S, x, y, s, size, col or P["ink3"], anchor, italic=True)


def TM(S, x, h, s, size, fill=None, anchor="middle", weight="normal", op=1):
    """Text inside metre space (size in metres)."""
    S.a(f'<text x="{x:.3f}" y="{-h:.3f}" font-size="{size:.3f}" fill="{fill or P["ink"]}" text-anchor="{anchor}" '
        f'font-weight="{weight}" opacity="{op}">{esc(s)}</text>')


def iron(S):
    return cyl(S, P["iron"], P["iron_l"], P["iron_d"])


def goldf(S):
    return cyl(S, P["gold"], P["gold_l"], P["gold_d"])


def marblef(S):
    return cyl(S, P["marble"], P["white"], P["marble_dd"])


def pinkf(S):
    return cyl(S, P["wall"], P["wall_lit"], P["wall_d"])


def pointed_arch_d(cx, w, h0, h1, k=0.9):
    """Pointed arch outline in metre space: jambs to the springing, two arcs to the apex. Returns (d, springing)."""
    r = w * k
    spring = h1 - math.sqrt(max(r * r - (r - w / 2) ** 2, 0))
    x0, x1 = cx - w / 2, cx + w / 2
    return (f"M{M(x0,h0)} L{M(x0,spring)} A{r:.3f} {r:.3f} 0 0 1 {M(cx,h1)} A{r:.3f} {r:.3f} 0 0 1 {M(x1,spring)} L{M(x1,h0)} Z"), spring
