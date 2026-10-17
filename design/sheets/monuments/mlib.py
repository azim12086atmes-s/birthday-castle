"""Drawing library for the monuments design sheets.
Units inside a panel group are metres; SVG y = -height. Labels and captions are drawn in pixel space."""
import math, random

P = dict(
    wall="#e8b9c6", wall_lit="#f6d2dc", wall_shade="#a9607f", rose="#b0607e", rose_d="#7e3a5a",
    roof="#9c3a68", roof_d="#6e2a5a", roof_l="#c25488", plum="#4a1f44",
    gold="#e6b450", gold_d="#a8782a", gold_l="#ffe3a0",
    white="#f6eef0", marble="#efe4ea", marble_s="#c9b3c4", marble_d="#9a8098",
    teal="#5fc8c0", teal_d="#2f8a8a", teal_l="#a8f0e6", violet="#a46cff", violet_d="#5a3c9a",
    amber="#ffb347", amber_l="#ffe0a0", pink_glow="#ff7fb8",
    glass_d="#3a1a40", sky0="#0b0d26", sky1="#1d1a45", sky2="#3a2358",
    ink="#2a1226", text="#ffe6ee", text2="#d9b8cc", text3="#b79ab0",
    sand="#e2b48a", sand_d="#b07e58", sand_l="#f3d2ae", terracotta="#c46a4a",
    lacquer="#b8324a", lacquer_d="#7a1f36", tile="#3e2a4a", tile_l="#5e4670",
    copper="#c8784a", copper_d="#8a4a2e", verdigris="#5fae9a",
    stone="#9c94a8", stone_d="#6a6278", stone_l="#c4bccc", moss="#6f8a52", moss_d="#4a6038",
    leaf_d="#2e4a3a", blossom="#f5a8c8", water="#7fd8f0", water_d="#2a6a9a",
)
FONT = "Georgia, 'DejaVu Serif', serif"


def Y(h):
    return -h


def f2(v):
    return f"{v:.2f}"


class Doc:
    def __init__(self, W, H):
        self.W, self.H = W, H
        self.els, self.defs, self.uid = [], [], 0
        self._grad_cache = {}

    def a(self, s):
        self.els.append(s)

    def d(self, s):
        self.defs.append(s)

    def id(self, p="g"):
        self.uid += 1
        return f"{p}{self.uid}"

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.W} {self.H}" width="{self.W}" height="{self.H}" '
                f'font-family="{FONT}"><defs>{"".join(self.defs)}</defs>{"".join(self.els)}</svg>')

    def save(self, path):
        open(path, "w").write(self.svg())


# ---------------------------------------------------------------- gradients
def vgrad(D, top, bot, mid=None):
    key = ("v", top, bot, mid)
    if key in D._grad_cache:
        return D._grad_cache[key]
    gid = D.id("vg")
    m = f'<stop offset=".5" stop-color="{mid}"/>' if mid else ""
    D.d(f'<linearGradient id="{gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{top}"/>{m}<stop offset="1" stop-color="{bot}"/></linearGradient>')
    D._grad_cache[key] = f"url(#{gid})"
    return D._grad_cache[key]


def hgrad(D, a, b, c=None):
    key = ("h", a, b, c)
    if key in D._grad_cache:
        return D._grad_cache[key]
    gid = D.id("hg")
    if c:
        st = f'<stop offset="0" stop-color="{a}"/><stop offset=".45" stop-color="{b}"/><stop offset="1" stop-color="{c}"/>'
    else:
        st = f'<stop offset="0" stop-color="{a}"/><stop offset="1" stop-color="{b}"/>'
    D.d(f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="0">{st}</linearGradient>')
    D._grad_cache[key] = f"url(#{gid})"
    return D._grad_cache[key]


def cyl(D, base, lit, shade):
    """Horizontal gradient that makes a flat strip read as a lit cylinder."""
    key = ("c", base, lit, shade)
    if key in D._grad_cache:
        return D._grad_cache[key]
    gid = D.id("cy")
    D.d(f'<linearGradient id="{gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{shade}"/>'
        f'<stop offset=".3" stop-color="{lit}"/><stop offset=".6" stop-color="{base}"/><stop offset="1" stop-color="{shade}"/></linearGradient>')
    D._grad_cache[key] = f"url(#{gid})"
    return D._grad_cache[key]


def rgrad(D, color, op=1.0, mid=0.35):
    key = ("r", color, op, mid)
    if key in D._grad_cache:
        return D._grad_cache[key]
    gid = D.id("rg")
    D.d(f'<radialGradient id="{gid}"><stop offset="0" stop-color="{color}" stop-opacity="{op}"/>'
        f'<stop offset="{mid}" stop-color="{color}" stop-opacity="{op*0.45:.3f}"/><stop offset="1" stop-color="{color}" stop-opacity="0"/></radialGradient>')
    D._grad_cache[key] = f"url(#{gid})"
    return D._grad_cache[key]


def glow(D, cx, h, rx, ry=None, color="#ffb347", op=0.8, mid=0.3):
    ry = ry or rx
    D.a(f'<ellipse cx="{f2(cx)}" cy="{f2(Y(h))}" rx="{f2(rx)}" ry="{f2(ry)}" fill="{rgrad(D, color, op, mid)}"/>')


# ---------------------------------------------------------------- primitives (metres)
def rect(D, x0, x1, h0, h1, fill, st="none", sw=0.1, op=1, rx=0, extra=""):
    D.a(f'<rect x="{f2(min(x0,x1))}" y="{f2(Y(max(h0,h1)))}" width="{f2(abs(x1-x0))}" height="{f2(abs(h1-h0))}" rx="{rx}" '
        f'fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}" {extra}/>')


def poly(D, pts, fill, st="none", sw=0.1, op=1, extra=""):
    D.a(f'<polygon points="{" ".join(f"{f2(x)},{f2(Y(h))}" for x, h in pts)}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}" stroke-linejoin="round" {extra}/>')


def pline(D, pts, st, sw=0.1, op=1, fill="none", dash=None):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    D.a(f'<polyline points="{" ".join(f"{f2(x)},{f2(Y(h))}" for x, h in pts)}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}" stroke-linecap="round" stroke-linejoin="round"{da}/>')


def line(D, x0, h0, x1, h1, st, sw=0.1, op=1, dash=None, cap="round"):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    D.a(f'<line x1="{f2(x0)}" y1="{f2(Y(h0))}" x2="{f2(x1)}" y2="{f2(Y(h1))}" stroke="{st}" stroke-width="{sw}" opacity="{op}" stroke-linecap="{cap}"{da}/>')


def path(D, d, fill="none", st="none", sw=0.1, op=1, extra=""):
    D.a(f'<path d="{d}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}" stroke-linejoin="round" stroke-linecap="round" {extra}/>')


def circ(D, cx, h, r, fill, st="none", sw=0.1, op=1):
    D.a(f'<circle cx="{f2(cx)}" cy="{f2(Y(h))}" r="{f2(r)}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}"/>')


def ell(D, cx, h, rx, ry, fill, st="none", sw=0.1, op=1, rot=0):
    tr = f' transform="rotate({rot} {f2(cx)} {f2(Y(h))})"' if rot else ""
    D.a(f'<ellipse cx="{f2(cx)}" cy="{f2(Y(h))}" rx="{f2(rx)}" ry="{f2(ry)}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}"{tr}/>')


def smooth_d(pts, closed=True, k=1.0):
    """Catmull-Rom through points -> cubic Bezier path (metres in, SVG d out)."""
    n = len(pts)
    if n < 3:
        return "M" + " L".join(f"{f2(x)} {f2(Y(h))}" for x, h in pts)
    P_ = [(x, Y(h)) for x, h in pts]
    d = f"M{f2(P_[0][0])} {f2(P_[0][1])}"
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = P_[(i - 1) % n] if (closed or i > 0) else P_[0]
        p1 = P_[i]
        p2 = P_[(i + 1) % n]
        p3 = P_[(i + 2) % n] if (closed or i + 2 < n) else P_[-1]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6 * k, p1[1] + (p2[1] - p0[1]) / 6 * k)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6 * k, p2[1] - (p3[1] - p1[1]) / 6 * k)
        d += f" C{f2(c1[0])} {f2(c1[1])} {f2(c2[0])} {f2(c2[1])} {f2(p2[0])} {f2(p2[1])}"
    return d + (" Z" if closed else "")


def mirror(pts_right, cx=0):
    """Right-half outline from top to bottom -> full symmetric outline."""
    left = [(2 * cx - x, h) for x, h in reversed(pts_right)]
    return pts_right + left


def star_pts(cx, h, R, r, n=8, rot=90):
    pts = []
    for i in range(2 * n):
        a = math.radians(rot + i * 180 / n)
        rr = R if i % 2 == 0 else r
        pts.append((cx + rr * math.cos(a), h + rr * math.sin(a)))
    return pts


def star(D, cx, h, R, fill=None, n=8, r=None, glowc=None, st="none", sw=0.05):
    if glowc:
        glow(D, cx, h, R * 3.2, color=glowc, op=0.75)
    poly(D, star_pts(cx, h, R, r or R * 0.45, n), fill or P["gold_l"], st, sw)


# ---------------------------------------------------------------- arch outlines
def round_arch_d(cx, w, h0, spring):
    r = w / 2
    return (f"M{f2(cx-r)} {f2(Y(h0))} L{f2(cx-r)} {f2(Y(spring))} A{f2(r)} {f2(r)} 0 0 1 {f2(cx+r)} {f2(Y(spring))} "
            f"L{f2(cx+r)} {f2(Y(h0))} Z")


def pointed_arch_d(cx, w, h0, h1, k=0.85):
    r = w * k
    spring = h1 - math.sqrt(max(r * r - (r - w / 2) ** 2, 0))
    x0, x1 = cx - w / 2, cx + w / 2
    return (f"M{f2(x0)} {f2(Y(h0))} L{f2(x0)} {f2(Y(spring))} A{f2(r)} {f2(r)} 0 0 1 {f2(cx)} {f2(Y(h1))} "
            f"A{f2(r)} {f2(r)} 0 0 1 {f2(x1)} {f2(Y(spring))} L{f2(x1)} {f2(Y(h0))} Z"), spring


def horseshoe_d(cx, w, h0, spring, over=1.18):
    """Horseshoe arch: arc radius bigger than half the opening, so the arc returns inward below its widest point."""
    r = w / 2 * over
    # the circle centre sits above the springing so the arc meets the jambs inward
    dy = math.sqrt(r * r - (w / 2) ** 2)
    cyh = spring + dy
    return (f"M{f2(cx-w/2)} {f2(Y(h0))} L{f2(cx-w/2)} {f2(Y(spring))} A{f2(r)} {f2(r)} 0 1 1 {f2(cx+w/2)} {f2(Y(spring))} "
            f"L{f2(cx+w/2)} {f2(Y(h0))} Z"), cyh, r


def ogee_arch_d(cx, w, h0, spring, h1):
    """Ogee (S-curve) arch for East-Asian / Mughal openings."""
    x0, x1 = cx - w / 2, cx + w / 2
    m = (h1 - spring)
    return (f"M{f2(x0)} {f2(Y(h0))} L{f2(x0)} {f2(Y(spring))} C{f2(x0)} {f2(Y(spring+m*0.55))} {f2(cx-w*0.08)} {f2(Y(spring+m*0.5))} {f2(cx)} {f2(Y(h1))} "
            f"C{f2(cx+w*0.08)} {f2(Y(spring+m*0.5))} {f2(x1)} {f2(Y(spring+m*0.55))} {f2(x1)} {f2(Y(spring))} L{f2(x1)} {f2(Y(h0))} Z")


def dome_d(cx, w, h0, h1):
    return f"M{f2(cx-w/2)} {f2(Y(h0))} A{f2(w/2)} {f2(h1-h0)} 0 0 1 {f2(cx+w/2)} {f2(Y(h0))} Z"


def onion_d(cx, w, h0, h1, neck=0.7, belly=0.36):
    H = h1 - h0
    wn = w * neck
    hb = h0 + H * belly
    def side(sg):
        return [(cx + sg * wn / 2, h0), (cx + sg * (wn / 2 + (w - wn) * 0.55), h0 + H * 0.02), (cx + sg * w / 2, hb - H * 0.16), (cx + sg * w / 2, hb),
                (cx + sg * w / 2, hb + H * 0.22), (cx + sg * w * 0.06, h0 + H * 0.78), (cx, h1)]
    L, R = side(-1), side(1)
    def seg(s):
        return (f"M{f2(s[0][0])} {f2(Y(s[0][1]))} C{f2(s[1][0])} {f2(Y(s[1][1]))} {f2(s[2][0])} {f2(Y(s[2][1]))} {f2(s[3][0])} {f2(Y(s[3][1]))} "
                f"C{f2(s[4][0])} {f2(Y(s[4][1]))} {f2(s[5][0])} {f2(Y(s[5][1]))} {f2(s[6][0])} {f2(Y(s[6][1]))}")
    # left side forward, right side reversed
    r = R
    return (seg(L) + f" C{f2(r[5][0])} {f2(Y(r[5][1]))} {f2(r[4][0])} {f2(Y(r[4][1]))} {f2(r[3][0])} {f2(Y(r[3][1]))} "
            f"C{f2(r[2][0])} {f2(Y(r[2][1]))} {f2(r[1][0])} {f2(Y(r[1][1]))} {f2(r[0][0])} {f2(Y(r[0][1]))} Z")


# ---------------------------------------------------------------- parts
def courses(D, x0, x1, h0, h1, dh, col, sw=0.05, op=0.35, stagger=True, bw=None):
    """Ashlar course lines with staggered joints."""
    bw = bw or dh * 2.2
    h = h0 + dh
    row = 0
    while h < h1 - 1e-6:
        line(D, x0, h, x1, h, col, sw, op)
        h += dh
    h = h0
    while h < h1 - 1e-6:
        off = (bw / 2) if (stagger and row % 2) else 0
        x = x0 + off + bw
        while x < x1 - 0.05:
            line(D, x, h, x, min(h + dh, h1), col, sw, op)
            x += bw
        h += dh
        row += 1


def column(D, cx, h0, h1, r, style="corinthian", fill=None, lit=None, shade=None, gold=None, flutes=5, rings=None, sw=0.05):
    fill = fill or P["marble"]
    lit = lit or P["white"]
    shade = shade or P["marble_d"]
    gold = gold or P["gold"]
    H = h1 - h0
    bh = max(r * 0.9, 0.12)            # base height
    ch = r * (2.6 if style == "corinthian" else 1.2 if style == "doric" else 1.8)
    # plinth and torus
    rect(D, cx - r * 1.45, cx + r * 1.45, h0, h0 + bh * 0.45, cyl(D, fill, lit, shade))
    rect(D, cx - r * 1.3, cx + r * 1.3, h0 + bh * 0.45, h0 + bh, cyl(D, fill, lit, shade), rx=r * 0.25)
    s0, s1 = h0 + bh, h1 - ch
    # shaft with slight entasis
    if style == "twisted":
        rect(D, cx - r, cx + r, s0, s1, cyl(D, fill, lit, shade))
        n = int((s1 - s0) / (r * 1.4)) + 1
        for i in range(n):
            a = s0 + i * (s1 - s0) / n
            b = a + (s1 - s0) / n
            path(D, f"M{f2(cx-r)} {f2(Y(a))} C{f2(cx-r*0.2)} {f2(Y(a+(b-a)*0.1))} {f2(cx+r*0.2)} {f2(Y(b-(b-a)*0.1))} {f2(cx+r)} {f2(Y(b))}", st=shade, sw=r * 0.18, op=0.8)
            path(D, f"M{f2(cx-r)} {f2(Y(a+(b-a)*0.2))} C{f2(cx-r*0.2)} {f2(Y(a+(b-a)*0.3))} {f2(cx+r*0.2)} {f2(Y(b-(b-a)*0.0))} {f2(cx+r*0.6)} {f2(Y(b+0.0))}", st=lit, sw=r * 0.1, op=0.7)
    else:
        poly(D, [(cx - r, s0), (cx + r, s0), (cx + r * 0.86, s1), (cx - r * 0.86, s1)], cyl(D, fill, lit, shade))
        for i in range(1, flutes):
            t = -1 + 2 * i / flutes
            xx0 = cx + t * r * 0.9
            xx1 = cx + t * r * 0.78
            line(D, xx0, s0 + 0.05, xx1, s1 - 0.05, shade, sw, 0.45)
    for rh in (rings or []):
        rect(D, cx - r * 1.05, cx + r * 1.05, s0 + (s1 - s0) * rh - r * 0.12, s0 + (s1 - s0) * rh + r * 0.12, gold)
    # capital
    if style == "corinthian":
        poly(D, [(cx - r * 0.86, s1), (cx + r * 0.86, s1), (cx + r * 1.35, h1 - ch * 0.22), (cx - r * 1.35, h1 - ch * 0.22)], gold)
        for k in range(3):   # acanthus leaf rows
            hh = s1 + ch * (0.12 + k * 0.22)
            for j in range(-2, 3):
                xx = cx + j * r * 0.5 * (1 + k * 0.12)
                path(D, f"M{f2(xx-r*0.22)} {f2(Y(hh))} Q{f2(xx)} {f2(Y(hh+ch*0.3))} {f2(xx+r*0.22)} {f2(Y(hh))}", fill=P["gold_l"] if k == 2 else P["gold_d"], op=0.85)
        # volutes
        for sg in (-1, 1):
            circ(D, cx + sg * r * 1.2, h1 - ch * 0.3, r * 0.22, P["gold_l"], P["gold_d"], sw)
        rect(D, cx - r * 1.5, cx + r * 1.5, h1 - ch * 0.22, h1, gold, P["gold_d"], sw)
    elif style == "doric":
        poly(D, [(cx - r * 0.86, s1), (cx + r * 0.86, s1), (cx + r * 1.25, s1 + ch * 0.55), (cx - r * 1.25, s1 + ch * 0.55)], cyl(D, fill, lit, shade))
        rect(D, cx - r * 1.35, cx + r * 1.35, s1 + ch * 0.55, h1, fill, shade, sw)
        rect(D, cx - r, cx + r, s1 - r * 0.25, s1, gold)
    elif style == "lotus":
        path(D, f"M{f2(cx-r*0.86)} {f2(Y(s1))} C{f2(cx-r*1.6)} {f2(Y(s1+ch*0.4))} {f2(cx-r*1.5)} {f2(Y(s1+ch*0.8))} {f2(cx-r*1.4)} {f2(Y(h1-ch*0.15))} "
                f"L{f2(cx+r*1.4)} {f2(Y(h1-ch*0.15))} C{f2(cx+r*1.5)} {f2(Y(s1+ch*0.8))} {f2(cx+r*1.6)} {f2(Y(s1+ch*0.4))} {f2(cx+r*0.86)} {f2(Y(s1))} Z", fill=gold)
        for j in range(-2, 3):
            xx = cx + j * r * 0.55
            path(D, f"M{f2(xx-r*0.25)} {f2(Y(s1+ch*0.1))} Q{f2(xx)} {f2(Y(s1+ch*0.85))} {f2(xx+r*0.25)} {f2(Y(s1+ch*0.1))}", st=P["gold_d"], sw=sw)
        rect(D, cx - r * 1.5, cx + r * 1.5, h1 - ch * 0.15, h1, fill, shade, sw)
    else:  # plain block capital
        rect(D, cx - r * 1.3, cx + r * 1.3, s1, h1, fill, shade, sw)
        rect(D, cx - r * 1.1, cx + r * 1.1, s1, s1 + ch * 0.3, gold)


def person(D, x, h0=0, H=1.7, fill="#ffe6ee", op=0.9):
    """Scale figure 1.7 m: simple silhouette."""
    s = H / 1.7
    pts = [(0, 1.70), (0.09, 1.66), (0.11, 1.56), (0.08, 1.47), (0.22, 1.40), (0.25, 1.05), (0.20, 0.85), (0.15, 0.95), (0.14, 0.50), (0.12, 0.0),
           (0.03, 0.0), (0.0, 0.45)]
    full = [(x + px * s, h0 + ph * s) for px, ph in pts] + [(x - px * s, h0 + ph * s) for px, ph in reversed(pts[1:-1])]
    poly(D, full, fill, op=op)


def banner(D, x, h_top, w, L, fill, trim=None, emblem=None, swallow=True):
    trim = trim or P["gold"]
    pts = [(x - w / 2, h_top), (x + w / 2, h_top), (x + w / 2, h_top - L)]
    if swallow:
        pts += [(x, h_top - L + w * 0.45), (x - w / 2, h_top - L)]
    else:
        pts += [(x, h_top - L - w * 0.3), (x - w / 2, h_top - L)]
    poly(D, pts, fill, trim, w * 0.06)
    line(D, x - w * 0.6, h_top, x + w * 0.6, h_top, trim, w * 0.12)
    if emblem == "sun":
        cy = h_top - L * 0.35
        for i in range(12):
            a = i * math.pi / 6
            line(D, x + math.cos(a) * w * 0.14, cy + math.sin(a) * w * 0.14, x + math.cos(a) * w * 0.3, cy + math.sin(a) * w * 0.3, trim, w * 0.05)
        circ(D, x, cy, w * 0.12, trim)
    elif emblem == "star":
        star(D, x, h_top - L * 0.35, w * 0.28, trim)


def lantern_cyl(D, x, h_top, w, hgt, body="#ff5a4a", glowc="#ffb347", trim=None, tassel=True):
    """Chinese cylinder lantern hanging from h_top."""
    trim = trim or P["gold"]
    line(D, x, h_top, x, h_top - hgt * 0.15, trim, w * 0.06)
    glow(D, x, h_top - hgt * 0.55, w * 1.6, hgt * 1.0, glowc, 0.55)
    rect(D, x - w / 2, x + w / 2, h_top - hgt * 0.9, h_top - hgt * 0.2, body, rx=w * 0.3)
    rect(D, x - w * 0.3, x + w * 0.3, h_top - hgt * 0.85, h_top - hgt * 0.25, "#ffd27a", op=0.55, rx=w * 0.2)
    rect(D, x - w * 0.42, x + w * 0.42, h_top - hgt * 0.22, h_top - hgt * 0.15, trim)
    rect(D, x - w * 0.42, x + w * 0.42, h_top - hgt * 0.95, h_top - hgt * 0.88, trim)
    if tassel:
        line(D, x, h_top - hgt * 0.95, x, h_top - hgt * 1.25, trim, w * 0.08)


def lamp_post(D, x, h0, H, glowc="#ffcf80", cap=None):
    cap = cap or P["gold"]
    rect(D, x - H * 0.03, x + H * 0.03, h0, h0 + H * 0.12, cap)
    rect(D, x - H * 0.012, x + H * 0.012, h0, h0 + H * 0.85, P["ink"])
    glow(D, x, h0 + H * 0.92, H * 0.35, color=glowc, op=0.7)
    circ(D, x, h0 + H * 0.92, H * 0.07, "#fff2c8")
    poly(D, [(x - H * 0.05, h0 + H * 0.98), (x + H * 0.05, h0 + H * 0.98), (x, h0 + H * 1.06)], cap)


def wing(D, root, span, ang, n=9, fill="#f6eef0", edge=None, shade=None, sw=0.03, flip=False, droop=0.0):
    """Raised feathered wing: layered feathers hanging off a curved leading edge.
    root=(x,h); ang in degrees (90 = straight up); flip mirrors left/right."""
    edge = edge or P["gold"]
    shade = shade or P["marble_s"]
    sg = -1 if flip else 1
    rx, rh = root
    a = math.radians(ang)
    tip = (rx + sg * span * math.cos(a), rh + span * math.sin(a))
    ctrl = (rx + sg * span * 0.15 * math.cos(a) - sg * span * 0.35 * math.sin(a) * 0.3, rh + span * 0.75 * math.sin(a) + span * 0.12)
    def qb(t):
        return ((1 - t) ** 2 * rx + 2 * (1 - t) * t * ctrl[0] + t * t * tip[0],
                (1 - t) ** 2 * rh + 2 * (1 - t) * t * ctrl[1] + t * t * tip[1])
    # feathers: drawn from root outward so tips overlap the inner ones
    for layer, (L0, L1, col) in enumerate([(span * 0.55, span * 0.75, shade), (span * 0.32, span * 0.42, fill)]):
        for i in range(n):
            t = 0.15 + 0.85 * i / (n - 1)
            bx, bh = qb(t)
            L = (L0 + (L1 - L0) * t) * (1.0 if layer == 0 else 0.9)
            # feathers point away from the body and downwards
            fa = math.radians(-100 + 55 * t + droop) if True else 0
            dx, dh = sg * math.cos(fa) * -1, math.sin(fa)
            dx = -sg * 0.25 + sg * 0.55 * t
            dh = -1.0
            nrm = math.hypot(dx, dh)
            dx, dh = dx / nrm, dh / nrm
            ex, eh = bx + dx * L, bh + dh * L
            w = span * 0.075
            px, ph = -dh * w, dx * w
            pts = [(bx + px, bh + ph), (bx + dx * L * 0.6 + px * 1.1, bh + dh * L * 0.6 + ph * 1.1), (ex, eh), (bx + dx * L * 0.6 - px * 0.9, bh + dh * L * 0.6 - ph * 0.9), (bx - px, bh - ph)]
            path(D, smooth_d(pts), fill=col, st=edge if layer == 0 else P["marble_s"], sw=sw)
    # leading edge (gilded)
    pts = [qb(t / 10) for t in range(11)]
    pline(D, pts, edge, span * 0.06)
    return tip


def veiled(D, cx, h0, H, fill=None, shade=None, lit=None, trim=None, halo=False, sword=False, crossed=True, face=None):
    """Veiled faceless standing figure (game rule: no faces). Height H to top of hood."""
    fill = fill or P["marble"]
    shade = shade or P["marble_s"]
    lit = lit or P["white"]
    trim = trim or P["gold"]
    face = face or P["marble_d"]
    R = [(0.0, 1.0), (0.06, 0.99), (0.105, 0.955), (0.12, 0.905), (0.115, 0.86), (0.15, 0.83), (0.215, 0.80), (0.245, 0.745), (0.25, 0.64),
         (0.235, 0.53), (0.215, 0.46), (0.22, 0.32), (0.245, 0.14), (0.29, 0.03), (0.275, 0.0)]
    pts = [(cx + x * H, h0 + h * H) for x, h in mirror(R)]
    if halo:
        circ(D, cx, h0 + 0.93 * H, 0.2 * H, "none", trim, 0.025 * H)
        for i in range(16):
            a = math.pi * i / 15
            line(D, cx + math.cos(a) * 0.21 * H, h0 + 0.93 * H + math.sin(a) * 0.21 * H, cx + math.cos(a) * 0.29 * H, h0 + 0.93 * H + math.sin(a) * 0.29 * H, trim, 0.012 * H)
    path(D, smooth_d(pts, k=0.9), fill=hgrad(D, shade, lit, fill), st=P["marble_d"], sw=0.006 * H)
    # hood opening: smooth veil, no features
    ell(D, cx, h0 + 0.905 * H, 0.068 * H, 0.062 * H, face, op=0.85)
    ell(D, cx + 0.012 * H, h0 + 0.91 * H, 0.04 * H, 0.04 * H, shade, op=0.35)
    # hood edge trim
    path(D, f"M{f2(cx-0.085*H)} {f2(Y(h0+0.86*H))} Q{f2(cx)} {f2(Y(h0+1.02*H))} {f2(cx+0.085*H)} {f2(Y(h0+0.86*H))}", st=trim, sw=0.012 * H)
    # drapery folds
    for fx, a, b in [(-0.13, 0.05, 0.42), (-0.06, 0.03, 0.45), (0.02, 0.02, 0.44), (0.10, 0.04, 0.43), (0.17, 0.06, 0.4)]:
        path(D, f"M{f2(cx+fx*H)} {f2(Y(h0+b*H))} Q{f2(cx+(fx+0.02)*H)} {f2(Y(h0+(a+b)/2*H))} {f2(cx+(fx-0.01+fx*0.25)*H)} {f2(Y(h0+a*H))}", st=shade, sw=0.01 * H, op=0.8)
    # folded sleeves meeting at the front
    path(D, f"M{f2(cx-0.235*H)} {f2(Y(h0+0.6*H))} Q{f2(cx)} {f2(Y(h0+0.47*H))} {f2(cx+0.235*H)} {f2(Y(h0+0.6*H))}", st=P["marble_d"], sw=0.01 * H)
    path(D, f"M{f2(cx-0.2*H)} {f2(Y(h0+0.64*H))} Q{f2(cx)} {f2(Y(h0+0.53*H))} {f2(cx+0.2*H)} {f2(Y(h0+0.64*H))}", st=lit, sw=0.008 * H, op=0.7)
    if crossed:
        line(D, cx - 0.17 * H, h0 + 0.80 * H, cx + 0.12 * H, h0 + 0.56 * H, trim, 0.012 * H)
        line(D, cx + 0.17 * H, h0 + 0.80 * H, cx - 0.12 * H, h0 + 0.56 * H, trim, 0.012 * H)
    # hem band
    path(D, f"M{f2(cx-0.285*H)} {f2(Y(h0+0.03*H))} Q{f2(cx)} {f2(Y(h0-0.01*H))} {f2(cx+0.285*H)} {f2(Y(h0+0.03*H))}", st=trim, sw=0.02 * H)
    if sword:
        line(D, cx, h0 + 0.5 * H, cx, h0 + 0.02 * H, P["white"], 0.02 * H)
        line(D, cx - 0.06 * H, h0 + 0.5 * H, cx + 0.06 * H, h0 + 0.5 * H, trim, 0.02 * H)


def stars_bg(D, x0, y0, w, h, n, seed=1):
    rnd = random.Random(seed)
    s = []
    for _ in range(n):
        x = x0 + rnd.random() * w
        y = y0 + rnd.random() * h
        r = rnd.choice([0.6, 0.8, 1.0, 1.0, 1.4])
        op = rnd.uniform(0.3, 0.9)
        s.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="#fff4fa" opacity="{op:.2f}"/>')
    D.a("".join(s))


def wrap(text, size, width):
    cw = size * 0.5
    maxc = max(10, int(width / cw))
    out, cur = [], ""
    for w in text.split(" "):
        if len(cur) + len(w) + 1 > maxc:
            out.append(cur)
            cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        out.append(cur)
    return out


def ptext(D, x, y, s, size=14, fill=None, anchor="start", weight="normal", italic=False):
    fill = fill or P["text"]
    st = ' font-style="italic"' if italic else ""
    s = s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    D.a(f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{weight}"{st}>{s}</text>')


class Panel:
    """A framed panel. Drawing inside begin()/end() is in metres with origin (ox,oy) px and scale s px/m."""
    def __init__(self, D, x, y, w, h, title, num, s, ox, ground, cap_h=96, sky=True, ground_col=None, seed=0):
        self.D, self.x, self.y, self.w, self.h, self.s = D, x, y, w, h, s
        self.ox = x + ox
        self.oy = y + ground
        self.cap_h = cap_h
        gid = D.id("clip")
        D.d(f'<clipPath id="{gid}"><rect x="{x}" y="{y}" width="{w}" height="{h - cap_h}"/></clipPath>')
        self.clip = gid
        D.a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="#120f2a" stroke="#6a4a6a" stroke-width="1.5"/>')
        D.a(f'<g clip-path="url(#{gid})">')
        if sky:
            D.a(f'<rect x="{x}" y="{y}" width="{w}" height="{h - cap_h}" fill="{vgrad(D, P["sky0"], P["sky2"], P["sky1"])}"/>')
            stars_bg(D, x, y, w, (ground - 10), int(w * ground / 9000), seed=seed + num)
        gc = ground_col or "#24183a"
        D.a(f'<rect x="{x}" y="{self.oy}" width="{w}" height="{h - cap_h - ground}" fill="{gc}"/>')
        D.a('</g>')
        ptext(D, x + 16, y + 30, f"{num} · {title}", 22, P["text"], weight="bold")
        self.open = False

    def begin(self, clip=True):
        c = f' clip-path="url(#{self.clip})"' if clip else ""
        self.D.a(f'<g{c}><g transform="translate({self.ox:.1f},{self.oy:.1f}) scale({self.s})">')

    def end(self):
        self.D.a('</g></g>')

    def P(self, x, h):
        return self.ox + x * self.s, self.oy - h * self.s

    def sub(self, s):
        ptext(self.D, self.x + 16, self.y + 52, s, 14, P["text2"], italic=True)

    def note(self, x, h, s, dx, dy, size=13, col=None):
        px, py = self.P(x, h)
        tx, ty = px + dx, py + dy
        col = col or P["gold_l"]
        self.D.a(f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{tx:.1f}" y2="{ty:.1f}" stroke="{col}" stroke-width="0.9" opacity="0.8"/>'
                 f'<circle cx="{px:.1f}" cy="{py:.1f}" r="2.2" fill="{col}"/>')
        anchor = "start" if dx >= 0 else "end"
        lines = s.split("|")
        for i, ln in enumerate(lines):
            ptext(self.D, tx + (4 if dx >= 0 else -4), ty + 4 + i * (size + 2), ln, size, P["text"], anchor)

    def caption(self, size, refs, build):
        D = self.D
        y = self.y + self.h - self.cap_h + 18
        D.a(f'<line x1="{self.x+12}" y1="{y-14}" x2="{self.x+self.w-12}" y2="{y-14}" stroke="#6a4a6a" stroke-width="1"/>')
        rows = [("Size", size, P["gold_l"]), ("Refs", refs, P["text2"]), ("Build", build, P["teal_l"])]
        for k, v, c in rows:
            lines = wrap(v, 13, self.w - 80)
            ptext(D, self.x + 14, y, k, 13, c, weight="bold")
            for i, ln in enumerate(lines):
                ptext(D, self.x + 62, y + i * 15, ln, 13, P["text"])
            y += 15 * len(lines) + 2

    def scalebar(self, metres, x_px=None, y_px=None):
        D = self.D
        x_px = x_px if x_px is not None else self.x + self.w - 20 - metres * self.s
        y_px = y_px if y_px is not None else self.y + self.h - self.cap_h - 14
        L = metres * self.s
        D.a(f'<line x1="{x_px:.1f}" y1="{y_px:.1f}" x2="{x_px+L:.1f}" y2="{y_px:.1f}" stroke="#ffe6ee" stroke-width="2.5"/>'
            f'<line x1="{x_px:.1f}" y1="{y_px-5:.1f}" x2="{x_px:.1f}" y2="{y_px+5:.1f}" stroke="#ffe6ee" stroke-width="1.5"/>'
            f'<line x1="{x_px+L:.1f}" y1="{y_px-5:.1f}" x2="{x_px+L:.1f}" y2="{y_px+5:.1f}" stroke="#ffe6ee" stroke-width="1.5"/>')
        ptext(D, x_px + L / 2, y_px - 7, f"{metres} m", 12, P["text"], "middle")


def callout(D, cx, cy, r, title, draw, s, ox_m=0, oh_m=0):
    """Round magnified callout at px centre (cx,cy), radius r px. draw(D) draws in metres around (ox_m, oh_m) at scale s px/m."""
    gid = D.id("cc")
    D.d(f'<clipPath id="{gid}"><circle cx="{cx}" cy="{cy}" r="{r}"/></clipPath>')
    D.a(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#1a1436"/>')
    D.a(f'<g clip-path="url(#{gid})"><g transform="translate({cx - ox_m*s:.1f},{cy + oh_m*s:.1f}) scale({s})">')
    draw(D)
    D.a('</g></g>')
    D.a(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{P["gold"]}" stroke-width="2"/>')
    ptext(D, cx, cy + r + 18, title, 13, P["gold_l"], "middle")
