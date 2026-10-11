"""Shared drawing helpers for the foliage design sheets (trees + plants).
Pixel coordinates for the sheet; tree drawings use metre coordinates inside a flipped group (y up)."""
import math, random, textwrap

INK = "#f3e6ee"      # main text on the dark sheet
INK2 = "#c9b3cf"     # secondary text
PAPER = "#efe4da"    # day panel background
NIGHT0, NIGHT1 = "#0b0b22", "#251a46"
CARD = "#1d1832"
LINE = "#4a3d66"
GOLD = "#e6b450"
ROSE = "#e8b9c6"
ROSE_D = "#b0607e"
PLUM = "#6e2a5a"
MARBLE = "#f6eef0"


def f(x):
    return f"{x:.2f}"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


class Doc:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.e, self.d = [], []
        self.n = 0
        self.filters = {}

    def a(self, s):
        self.e.append(s)

    def uid(self, p="i"):
        self.n += 1
        return f"{p}{self.n}"

    def glow(self, std):
        k = round(std, 3)
        if k not in self.filters:
            fid = self.uid("gl")
            self.d.append(f'<filter id="{fid}" x="-150%" y="-150%" width="400%" height="400%"><feGaussianBlur stdDeviation="{k}"/></filter>')
            self.filters[k] = fid
        return self.filters[k]

    def lg(self, stops, x1=0, y1=0, x2=0, y2=1):
        gid = self.uid("lg")
        st = "".join(f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{op}"' if op is not None else "") + "/>"
                     for o, c, *rest in stops for op in [rest[0] if rest else None])
        self.d.append(f'<linearGradient id="{gid}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{st}</linearGradient>')
        return f"url(#{gid})"

    def rg(self, stops, cx=.5, cy=.5, r=.5):
        gid = self.uid("rg")
        st = "".join(f'<stop offset="{o}" stop-color="{c}"' + (f' stop-opacity="{op}"' if op is not None else "") + "/>"
                     for o, c, *rest in stops for op in [rest[0] if rest else None])
        self.d.append(f'<radialGradient id="{gid}" cx="{cx}" cy="{cy}" r="{r}">{st}</radialGradient>')
        return f"url(#{gid})"

    def clip_rect(self, x, y, w, h, rx=0):
        cid = self.uid("cp")
        self.d.append(f'<clipPath id="{cid}"><rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{rx}"/></clipPath>')
        return cid

    def clip_circle(self, cx, cy, r):
        cid = self.uid("cc")
        self.d.append(f'<clipPath id="{cid}"><circle cx="{f(cx)}" cy="{f(cy)}" r="{f(r)}"/></clipPath>')
        return cid

    def checker(self):
        if "checker" not in self.filters:
            self.d.append('<pattern id="checker" width="16" height="16" patternUnits="userSpaceOnUse">'
                          '<rect width="16" height="16" fill="#d8d0d8"/><rect width="8" height="8" fill="#f2eef2"/>'
                          '<rect x="8" y="8" width="8" height="8" fill="#f2eef2"/></pattern>')
            self.filters["checker"] = 1
        return "url(#checker)"

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}" '
                f'font-family="Georgia, \'Times New Roman\', serif"><defs>{"".join(self.d)}</defs>{"".join(self.e)}</svg>')


D = None


def set_doc(d):
    global D
    D = d


def A(s):
    D.a(s)


def T(x, y, s, size=16, fill=INK, anchor="start", weight="normal", italic=False, op=1):
    st = ' font-style="italic"' if italic else ""
    A(f'<text x="{f(x)}" y="{f(y)}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{weight}" opacity="{op}"{st}>{esc(s)}</text>')


def para(x, y, s, width, size=15, fill=INK2, lh=1.32, weight="normal"):
    chars = max(10, int(width / (size * 0.47)))
    for ln in textwrap.wrap(s, chars):
        T(x, y, ln, size, fill, weight=weight)
        y += size * lh
    return y


def bullets(x, y, items, width, size=15, fill=INK2, lh=1.3, gap=4):
    """items: list of (label, text). Label drawn bold in ink colour."""
    chars = max(10, int(width / (size * 0.47)))
    for lab, s in items:
        full = (lab + " " if lab else "") + s
        lines = textwrap.wrap(full, chars)
        for i, ln in enumerate(lines):
            if i == 0 and lab and ln.startswith(lab):
                rest = ln[len(lab):]
                A(f'<text x="{f(x)}" y="{f(y)}" font-size="{size}" fill="{fill}"><tspan fill="{GOLD}" font-weight="bold">{esc(lab)}</tspan>{esc(rest)}</text>')
            else:
                T(x, y, ln, size, fill)
            y += size * lh
        y += gap
    return y


def rect(x, y, w, h, fill, st="none", sw=1, rx=0, op=1, extra=""):
    A(f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{rx}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}" {extra}/>')


def circ(x, y, r, fill, st="none", sw=1, op=1, extra=""):
    A(f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}" {extra}/>')


def ell(x, y, rx, ry, fill, st="none", sw=1, op=1, rot=0, extra=""):
    tr = f' transform="rotate({f(rot)} {f(x)} {f(y)})"' if rot else ""
    A(f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(rx)}" ry="{f(ry)}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}"{tr} {extra}/>')


def ln(x0, y0, x1, y1, st, sw=1, op=1, dash=None, cap="round"):
    da = f' stroke-dasharray="{dash}"' if dash else ""
    A(f'<line x1="{f(x0)}" y1="{f(y0)}" x2="{f(x1)}" y2="{f(y1)}" stroke="{st}" stroke-width="{sw}" opacity="{op}" stroke-linecap="{cap}"{da}/>')


def pth(d, fill="none", st="none", sw=1, op=1, extra=""):
    A(f'<path d="{d}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}" stroke-linecap="round" stroke-linejoin="round" {extra}/>')


def polyd(pts, close=True):
    s = "M" + " L".join(f"{f(x)} {f(y)}" for x, y in pts)
    return s + (" Z" if close else "")


def smoothd(pts, close=False):
    """Catmull-Rom through points -> cubic bezier path."""
    if len(pts) < 3:
        return polyd(pts, close)
    P = list(pts)
    if close:
        P = [P[-1]] + P + [P[0], P[1]]
    else:
        P = [P[0]] + P + [P[-1]]
    s = f"M{f(P[1][0])} {f(P[1][1])}"
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        s += f" C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}"
    return s + (" Z" if close else "")


def figure(x, y, h_px, col="#2a1f3a", op=1):
    """Faceless 1.7 m scale figure standing at (x, y) in px, h_px tall."""
    k = h_px / 1.7
    hd = 0.12 * k
    A(f'<g opacity="{op}"><circle cx="{f(x)}" cy="{f(y - 1.56 * k)}" r="{f(hd)}" fill="{col}"/>'
      f'<path d="M{f(x - .2 * k)} {f(y - 1.4 * k)} Q{f(x)} {f(y - 1.47 * k)} {f(x + .2 * k)} {f(y - 1.4 * k)} L{f(x + .24 * k)} {f(y - .02 * k)} '
      f'L{f(x - .24 * k)} {f(y - .02 * k)} Z" fill="{col}"/></g>')


def panel(x, y, w, h, title=None, kind="card", tsize=15):
    if kind == "day":
        rect(x, y, w, h, PAPER, LINE, 1.2, 6)
    elif kind == "night":
        rect(x, y, w, h, D.lg([(0, NIGHT0), (.7, NIGHT1), (1, "#3a2050")]), LINE, 1.2, 6)
    else:
        rect(x, y, w, h, CARD, LINE, 1.2, 6)
    if title:
        T(x + 10, y + tsize + 6, title, tsize, GOLD if kind != "day" else "#5a2c4a", weight="bold")


def scalebar(x, y, px_per_m, metres, col="#5a3c55", label=True):
    w = px_per_m * metres
    ln(x, y, x + w, y, col, 2)
    for i in range(5):
        xx = x + w * i / 4
        ln(xx, y - 4, xx, y + 4, col, 1.5)
    if label:
        T(x + w / 2, y + 16, f"{metres:g} m", 12, col, "middle")


def tri_icon_label(x, y, s, size=13, fill=INK2):
    T(x, y, s, size, fill, "middle")
