"""Illustrated world map: painted ground with hill shading, roads, trails, alleys, bridges, the 32 places and the gate."""
import numpy as np, json
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy import ndimage as ndi
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
D = f'{S}/fill/paths'
h = np.load(f'{D}/terrain.npz')['h'].astype(float); c = np.load(f'{D}/colour.npy'); N = h.shape[0]; mpp = 20691 / N
P = json.load(open(f'{D}/paths.json')); data = json.load(open(f'{S}/schema/game-data.json'))
gy, gx = np.gradient(ndi.gaussian_filter(h, 0.7), mpp)
n = np.dstack([-gx * 1.6, -gy * 1.6, np.ones_like(h)]); n /= np.linalg.norm(n, axis=2, keepdims=True)
L = np.array([-0.55, -0.6, 0.58]); L /= np.linalg.norm(L)
s = np.clip((n * L).sum(2), 0, 1)
img = np.clip(c * (0.45 + 0.75 * s)[..., None], 0, 1)
U = 3072; k = U / N
im = Image.fromarray((img * 255).astype(np.uint8)).resize((U, U), Image.LANCZOS).convert('RGBA')
def px(x, z): return ((x / 2.75 / 6 + 670) * U / 1254, (z / 2.75 / 6 + 490) * U / 1254)
lay = Image.new('RGBA', (U, U)); d = ImageDraw.Draw(lay)
style = {'trail': ((120, 90, 60, 220), 3), 'alley': ((235, 225, 205, 255), 3), 'road': ((246, 232, 200, 255), 6), 'royal': ((255, 214, 120, 255), 10)}
for kind in ('trail', 'alley', 'road', 'royal'):
    col, w = style[kind]
    for p in P['paths']:
        if p['kind'] != kind: continue
        pts = [px(a, b) for a, _, b in p['points']]
        if kind in ('road', 'royal'): d.line(pts, fill=(60, 45, 30, 200), width=w + 4, joint='curve')
        if kind == 'trail':
            for q in range(0, len(pts) - 1, 2): d.line(pts[q:q + 2], fill=col, width=w)
        else: d.line(pts, fill=col, width=w, joint='curve')
for b in P['bridges']:
    a, e = px(b['start'][0], b['start'][2]), px(b['end'][0], b['end'][2])
    d.line([a, e], fill=(70, 50, 35, 255), width=13); d.line([a, e], fill=(250, 245, 235, 255), width=7)
im = Image.alpha_composite(im, lay)
d = ImageDraw.Draw(im)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', 34)
small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf', 26)
big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf', 72)
boxes = []
for p in data['places']:
    x, y = px(p['at']['x'], p['at']['z'])
    night = p['schedule'] == 'night'
    r = 16 if night else 11
    d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 205, 90) if night else (255, 255, 255), outline=(60, 40, 30), width=4)
    label = p['name'] + (f"  {p['order']}" if night and p.get('order') else '')
    tw = d.textlength(label, font=font)
    for ox, oy in ((-tw / 2, r + 4), (-tw / 2, -r - 44), (r + 8, -20), (-tw - r - 8, -20)):   # first spot that doesn't overlap a label
        box = (x + ox - 6, y + oy - 4, x + ox + tw + 6, y + oy + 42)
        if not any(box[0] < q[2] and q[0] < box[2] and box[1] < q[3] and q[1] < box[3] for q in boxes): break
    boxes.append(box)
    d.text((x + ox, y + oy), label, font=font, fill=(255, 255, 255), stroke_width=5, stroke_fill=(40, 28, 20))
gx_, gy_ = px(-710, 11158)
d.text((gx_ - 120, gy_ + 30), 'Waterfall Gate', font=font, fill=(220, 240, 255), stroke_width=5, stroke_fill=(20, 30, 50))
d.text((80, 60), 'The Crescent', font=big, fill=(255, 236, 190), stroke_width=6, stroke_fill=(40, 28, 20))
leg = [('Royal road', (255, 214, 120)), ('Road', (246, 232, 200)), ('Village alley', (235, 225, 205)), ('Trail to a relic', (120, 90, 60)), ('Bridge', (250, 245, 235))]
for q, (t, cl) in enumerate(leg):
    y0 = U - 330 + q * 52
    d.line([(90, y0 + 18), (170, y0 + 18)], fill=cl, width=10); d.text((190, y0), t, font=small, fill=(255, 255, 255), stroke_width=4, stroke_fill=(40, 28, 20))
d.ellipse([90, U - 70, 120, U - 40], fill=(255, 205, 90), outline=(60, 40, 30), width=3)
d.text((135, U - 76), 'Places on the night, in order', font=small, fill=(255, 255, 255), stroke_width=4, stroke_fill=(40, 28, 20))
im.convert('RGB').save(f'{D}/world-map.jpg', quality=88)
im.convert('RGB').resize((1536, 1536), Image.LANCZOS).save(f'{D}/world-map-small.jpg', quality=86)
# a close crop around the palace and the southern villages
im.convert('RGB').crop((1000, 1150, 2200, 2350)).save(f'{D}/map-centre.jpg', quality=88)
print('ok')
