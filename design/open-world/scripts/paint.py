"""Biomes, rock types, the painted map and the numbers."""
import sys, os, json, numpy as np
from scipy import ndimage as ndi
from PIL import Image, ImageDraw, ImageFont
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'lay'))
from layout_data import LANDMARKS, PX0, PZ0, MPP
from gen_noise import fbm
IN = sys.argv[1]; OUT = sys.argv[2]; os.makedirs(OUT, exist_ok=True)
T = dict(np.load(f'{IN}/terrain.npz')); J = json.load(open(f'{IN}/terrain.json'))
h = T['h'].astype(np.float64); sl = T['slope']; N = h.shape[0]; dx = J['dx']; S = 2.75
R = {k[2:]: T[k] for k in T if k.startswith('R_')}
ocean, lake, tarn, stream, river = T['ocean'], T['lake'], T['tarn'], T['stream'], T['river']
land = ~ocean
water_in = lake | tarn | river | (stream & (sl < 0.55))
BIOMES = [  # id order = legend order
 ('Deep ocean', (0.05, 0.18, 0.38)), ('Shallow sea', (0.08, 0.36, 0.52)), ('Coral reef shallows', (0.16, 0.64, 0.66)),
 ('Lakes and rivers', (0.11, 0.42, 0.64)), ('Lagoon and wetland', (0.36, 0.58, 0.50)), ('Sandy beach', (0.94, 0.86, 0.66)),
 ('Dunes', (0.86, 0.75, 0.52)), ('Sea cliffs and stacks', (0.50, 0.47, 0.46)), ('Flower meadow', (0.66, 0.77, 0.40)),
 ('Rolling grassland and farms', (0.55, 0.68, 0.31)), ('Temperate forest', (0.20, 0.42, 0.17)), ('Blossom groves', (0.93, 0.63, 0.75)),
 ('Glowwood forest', (0.12, 0.36, 0.42)), ('Jungle', (0.08, 0.36, 0.13)), ('Red sandstone canyon', (0.78, 0.40, 0.24)),
 ('Karst pillar forest', (0.38, 0.56, 0.38)), ('Fjord pine taiga', (0.15, 0.30, 0.22)), ('Misty highland moor', (0.52, 0.42, 0.55)),
 ('Alpine meadow', (0.60, 0.67, 0.46)), ('Bare rock and scree', (0.55, 0.53, 0.52)), ('Snow and glacier', (0.95, 0.96, 0.99)),
 ('Palace grounds and terraces', (0.93, 0.80, 0.83)),
]
ID = {n: i for i, (n, _) in enumerate(BIOMES)}
b = np.full((N, N), ID['Temperate forest'], np.int16)
e = 0.28 * fbm(N, 18, 4, 204)
m1 = fbm(N, 12, 5, 201); m2 = fbm(N, 20, 4, 202); m3 = fbm(N, 40, 3, 203)
riv_near = ndi.distance_transform_edt(~(river | lake)) * dx
moist = m1 + 0.8 * np.exp(-riv_near / 600)
b[(moist < -0.15)] = ID['Rolling grassland and farms']
b[(moist >= -0.15) & (moist < 0.15) & (m2 > 0.1)] = ID['Flower meadow']
snowline = 1250 + 110 * m3
alp = 850 + 70 * m3
def put(mask, name): b[mask & land] = ID[name]
put((R['westhill'] + e * np.clip(R['westhill'] * 4, 0, 1) > 0.35), 'Rolling grassland and farms'); put(((R['westhill'] + e * np.clip(R['westhill'] * 4, 0, 1) > 0.35)) & (m2 > 0.25), 'Flower meadow')
put((R['blossom'] + e * np.clip(R['blossom'] * 4, 0, 1) > 0.45), 'Blossom groves')
put((R['glow'] + e * np.clip(R['glow'] * 4, 0, 1) > 0.4), 'Glowwood forest')
put((R['misty'] + e * np.clip(R['misty'] * 4, 0, 1) > 0.3), 'Misty highland moor')
put(((R['fjord'] + e * np.clip(R['fjord'] * 4, 0, 1) > 0.35)) | ((R['spine'] > 0.35) & (h < alp)), 'Fjord pine taiga')
put((R['jungle'] + e * np.clip(R['jungle'] * 4, 0, 1) > 0.4), 'Jungle')
put((R['karst'] + e * np.clip(R['karst'] * 4, 0, 1) > 0.4), 'Karst pillar forest')
put((R['canyon'] + e * np.clip(R['canyon'] * 4, 0, 1) > 0.4), 'Red sandstone canyon')
put(h > alp, 'Alpine meadow')
put((h > alp + 120) & (sl > 0.45), 'Bare rock and scree')
put(h > snowline, 'Snow and glacier')
dco = T['dco']
put((dco < 90) & (h < 6) & (sl < 0.2), 'Sandy beach')
put((dco < 320) & (h < 16) & (sl < 0.12) & (R['spine'] < 0.2) & (T['cliffy'] < 0.3) & (m2 > 0.05) & (dco > 60), 'Dunes')
put((dco < 420) & (sl > 0.75) & (R['canyon'] < 0.4), 'Sea cliffs and stacks')
put((sl > 1.1) & (R['canyon'] < 0.4) & (R['karst'] < 0.4) & (dco >= 420), 'Bare rock and scree')
put(((R['lagoon'] + e * np.clip(R['lagoon'] * 4, 0, 1) > 0.25)) & (h < 4), 'Lagoon and wetland')
put(T['palace'], 'Palace grounds and terraces')
b[water_in & land] = ID['Lakes and rivers']
b[ocean] = ID['Shallow sea']; b[ocean & (h < -18)] = ID['Deep ocean']
b[ocean & (R['reef'] > 0.4) & (h > -9)] = ID['Coral reef shallows']
b[(R['lagoon'] > 0.5) & (h < 0.3)] = ID['Lagoon and wetland']
b[ocean & (h > 1.0)] = ID['Sea cliffs and stacks']
# rock types
GEO = [('Granite', (0.58, 0.56, 0.58)), ('Gneiss and schist', (0.50, 0.47, 0.52)), ('Slate', (0.33, 0.36, 0.40)),
       ('Red sandstone', (0.74, 0.39, 0.25)), ('Limestone (karst)', (0.60, 0.61, 0.56)), ('Rose marble', (0.88, 0.74, 0.74)),
       ('Basalt', (0.22, 0.22, 0.24)), ('Coral limestone', (0.86, 0.82, 0.70)), ('Alluvium and clay', (0.55, 0.45, 0.34)),
       ('Shale under soil', (0.45, 0.40, 0.34))]
g = np.full((N, N), 9, np.int16)
X1 = ((np.arange(N) + 0.5) * 1254 / N - PX0) * MPP
g[(h < 25) & land] = 8; g[(riv_near < 250) & (h < 120)] = 8; g[R['lagoon'] > 0.2] = 8
g[(X1[None, :] > 1700) & (dco < 700) & (T['cliffy'] > 0.3)] = 6
g[(R['jungle'] > 0.3) | (R['reef'] > 0.3)] = 7
g[R['palace'] > 0.3] = 5
g[R['karst'] > 0.3] = 4
g[R['canyon'] > 0.3] = 3
g[R['fjord'] > 0.35] = 2
g[R['misty'] > 0.3] = 1
g[R['spine'] > 0.3] = 0
# ---------------------------------------------------------------- colour (for the 3D texture) and the map
pal = np.array([c for _, c in BIOMES]); gpal = np.array([c for _, c in GEO])
col = pal[b]
rock = np.clip((sl - 0.6) / 0.5, 0, 1)[..., None] * land[..., None] * (b != ID['Snow and glacier'])[..., None]
rock = np.maximum(rock, (ocean & (h > 1.0))[..., None].astype(float))
col = col * (1 - rock) + gpal[g] * rock
strata = (0.86 + 0.14 * np.sin(h / 9.0 + 2 * m3))[..., None]
col = np.where(((R['canyon'] > 0.35) & land)[..., None], col * strata, col)
col *= np.where(ocean, 0.97 + 0.03 * fbm(N, 64, 2, 211), 0.9 + 0.1 * fbm(N, 400, 2, 210))[..., None]
gloss = np.clip(1 - np.clip(-h, 0, 60) / 60, 0.35, 1)[..., None]
col = np.where(ocean[..., None], col * gloss, col)
# tree density per kind (trees per hectare-ish weight 0..1), for the 3D scatter
ok = land & ~water_in & (sl < 0.7) & ~T['palace']
TREES = {'broadleaf': {'Temperate forest': 1.0, 'Flower meadow': 0.06, 'Rolling grassland and farms': 0.05, 'Karst pillar forest': 0.5, 'Blossom groves': 0.15},
         'pine': {'Fjord pine taiga': 1.0, 'Alpine meadow': 0.25, 'Misty highland moor': 0.12, 'Sea cliffs and stacks': 0.05, 'Dunes': 0.04},
         'blossom': {'Blossom groves': 0.7, 'Flower meadow': 0.03},
         'glow': {'Glowwood forest': 1.0},
         'jungle': {'Jungle': 1.1, 'Lagoon and wetland': 0.3},
         'gold': {'Rolling grassland and farms': 0.02, 'Flower meadow': 0.02, 'Red sandstone canyon': 0.03}}
dens = {}
for k, tab in TREES.items():
    dmap = np.zeros(b.shape, np.float32)
    for nm, v in tab.items(): dmap[b == ID[nm]] = v
    dens[k] = (dmap * ok * np.clip(0.55 + 0.6 * fbm(N, 48, 3, 300 + len(dens)), 0, 1)).astype(np.float32)
np.savez_compressed(f'{IN}/trees.npz', **dens)
np.save(f'{IN}/colour.npy', col.astype(np.float32)); np.save(f'{IN}/biome.npy', b); np.save(f'{IN}/geo.npy', g)
Image.fromarray((np.clip(col, 0, 1) ** (1 / 1.0) * 255).astype(np.uint8)).save(f'{IN}/terrain-colour-2048.png')
# hillshade from two lights
gy, gx = np.gradient(np.maximum(h, 0) * 3.0, dx)   # relief exaggerated x3 for the flat map
def shade(az, alt):
    az, alt = np.radians(az), np.radians(alt)
    nrm = np.sqrt(1 + gx ** 2 + gy ** 2)
    return np.clip((np.sin(alt) + np.cos(alt) * (-gx * np.sin(az) + gy * np.cos(az))) / nrm, 0, 1)
hs = 0.65 * shade(315, 40) + 0.35 * shade(200, 55)
mapc = col * (0.25 + 1.0 * hs[..., None]) * np.where(land, 1, 1)[..., None]
mapc = np.where(ocean[..., None], col * (0.85 + 0.15 * hs[..., None]), mapc)
img = Image.fromarray((np.clip(mapc, 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(img)
try: fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22); fs = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17)
except Exception: fnt = fs = ImageFont.load_default()
def w2g(x1, z1): return (x1 / MPP + PX0) * N / 1254, (z1 / MPP + PZ0) * N / 1254
for c, (nm, x, z, w, dd) in LANDMARKS.items():
    gx_, gy_ = w2g(x, z); d.ellipse([gx_ - 6, gy_ - 6, gx_ + 6, gy_ + 6], fill=(255, 235, 120), outline=(40, 20, 40), width=2)
    d.text((gx_ + 9, gy_ - 12), f'{c} {nm}', font=fs, fill=(255, 255, 255), stroke_width=3, stroke_fill=(30, 20, 40))
gx_, gy_ = w2g(0, 0); d.rectangle([gx_ - 9, gy_ - 9, gx_ + 9, gy_ + 9], fill=(255, 150, 200), outline=(40, 20, 40), width=3)
d.text((gx_ + 12, gy_ - 14), 'B01 Princess Palace', font=fnt, fill=(255, 255, 255), stroke_width=3, stroke_fill=(30, 20, 40))
px2km = 1000 / dx; x0, y0 = 60, N - 70
d.rectangle([x0, y0, x0 + 5 * px2km, y0 + 12], fill=(255, 255, 255), outline=(0, 0, 0), width=2)
for k in range(5):
    if k % 2: d.rectangle([x0 + k * px2km, y0, x0 + (k + 1) * px2km, y0 + 12], fill=(30, 30, 30))
d.text((x0, y0 - 30), '0        1        2        3        4        5 km', font=fs, fill=(255, 255, 255), stroke_width=3, stroke_fill=(0, 0, 0))
d.text((N - 120, 40), 'N  ^', font=fnt, fill=(255, 255, 255), stroke_width=3, stroke_fill=(0, 0, 0))
img.save(f'{OUT}/open-world-map.jpg', quality=90)
# biome-only map and geology map (flat colours)
Image.fromarray((pal[b] * 255).astype(np.uint8)).resize((1024, 1024), Image.NEAREST).save(f'{OUT}/biome-map.png')
gm = np.where(land[..., None], gpal[g], pal[b]); Image.fromarray((gm * 255).astype(np.uint8)).resize((1024, 1024), Image.NEAREST).save(f'{OUT}/geology-map.png')
# ---------------------------------------------------------------- numbers
cell = dx * dx / 1e6
landkm = float(land.sum() * cell)
stats = dict(world_km=round(J['world_m'] / 1000, 2), map_km2=round(N * N * cell, 1), land_km2=round(landkm, 1),
             walkable_km2=round(float((land & (sl < 0.6) & ~water_in).sum() * cell), 1))
stats['biomes'] = {n: dict(km2=round(float((b == i).sum() * cell), 2), pct_land=round(float(((b == i) & land).sum() * cell / landkm * 100), 1))
                   for i, (n, _) in enumerate(BIOMES)}
stats['geology_land_km2'] = {n: round(float(((g == i) & land).sum() * cell), 1) for i, (n, _) in enumerate(GEO)}
mx = ndi.maximum_filter(h, size=int(1200 / dx)) == h
pk = mx & (h > 250) & land
lab_pk, npk = ndi.label(ndi.binary_dilation(pk, iterations=3))
ph = np.sort(ndi.maximum(h, lab_pk, range(1, npk + 1)))[::-1] if npk else np.array([])
pk = np.zeros_like(pk); pk[tuple(np.array(ndi.maximum_position(h, lab_pk, range(1, npk + 1))).T)] = True
stats['peaks'] = dict(highest_m=round(float(h.max())), over_1000m=int((ph > 1000).sum()), over_700m=int((ph > 700).sum()),
                      over_400m=int((ph > 400).sum()), summits_250m_plus=int(len(ph)), top10_m=[round(float(v)) for v in ph[:10]])
hm = (ndi.maximum_filter(h, size=int(700 / dx)) == h) & (h - ndi.minimum_filter(h, size=int(1400 / dx)) > 35)
stats['hills_40_250m'] = int(ndi.label(ndi.binary_dilation(hm & (h > 40) & (h <= 250) & land & ~T['palace'], iterations=3))[1])
stats['peaks']['summits_prominent_250m_plus'] = int((pk & (h - ndi.minimum_filter(h, size=int(2400 / dx)) > 120)).sum())
lab, nl = ndi.label(tarn)
stats['water'] = dict(lantern_lake_km2=round(float(lake.sum() * cell), 2), tarns=int(nl), tarns_km2=round(float(tarn.sum() * cell), 2),
                      river_km=round(float(ndi.binary_erosion(river).sum() * dx / 1000 + (river.sum() - ndi.binary_erosion(river).sum()) * dx / 3000), 1),
                      stream_km=round(float(stream.sum() * dx / 1000 * 0.85), 1), waterfalls=J['waterfalls'],
                      coast_km=round(float((land ^ ndi.binary_erosion(land)).sum() * dx / 1000 * 0.8), 1),
                      lagoon_km2=round(float(((R['lagoon'] > 0.5) & (h < 0.3)).sum() * cell), 2),
                      reef_km2=stats['biomes']['Coral reef shallows']['km2'])
stats['features'] = dict(karst_pillars=J['pillars'], sea_stacks=J['stacks'], cliffs_km2=round(float((land & (sl > 1.0)).sum() * cell), 2),
                         canyon_gorges_km2=round(float(((R['canyon'] > 0.4) & (sl > 0.8)).sum() * cell), 2), fjord_km=7.2,
                         beaches_km2=stats['biomes']['Sandy beach']['km2'], landmarks=len(LANDMARKS) + 1, sky_isles=4)
stats['pads_m'] = J['pads']
json.dump(stats, open(f'{OUT}/open-world-numbers.json', 'w'), indent=1)
print(json.dumps({k: v for k, v in stats.items() if k not in ('biomes', 'pads_m')}, indent=0))
print({n: v['km2'] for n, v in stats['biomes'].items()})
