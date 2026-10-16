"""Fill the 20 km crescent world with our models: landmarks at the 32 places, relics and rocks by biome, real trees from the web pack.
Writes world-placements.json (three.js frame) and renders aerial views.  Run: bpyenv/bin/python build_fill.py -- [cam names]"""
import bpy, sys, os, json, math, glob, numpy as np, mathutils
from scipy import ndimage as ndi
SC = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
F = f'{SC}/fill'; REN = f'{F}/ren'; os.makedirs(REN, exist_ok=True)
only = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
SAVE = os.environ.get('SAVE', '0') == '1'; SPP = int(os.environ.get('SPP', '24')); RES = json.loads(os.environ.get('RES', '[1600, 900]'))
T0 = np.load(f'{SC}/ow/out/terrain.npz'); J = json.load(open(f'{SC}/ow/out/terrain.json'))
h = np.load(f'{F}/terrain/terrain.npz')['h'].astype(np.float64); h_old = T0['h'].astype(np.float64)
B = np.load(f'{F}/terrain/biome.npy'); N = h.shape[0]; dx = J['dx']; S = 2.75; MPP = 6.0; PX0, PZ0 = 670, 490
CR = json.load(open(f'{F}/terrain/crescent.json'))
W = N * dx; cx = (627 - PX0) * MPP * S; cy = -(627 - PZ0) * MPP * S
rng = np.random.default_rng(7)
def ij(xb, yb):
    return (np.clip((-np.asarray(yb) / S / MPP + PZ0) * N / 1254 - 0.5, 0, N - 1.001), np.clip((np.asarray(xb) / S / MPP + PX0) * N / 1254 - 0.5, 0, N - 1.001))
def H(xb, yb):
    i, j = ij(xb, yb); return ndi.map_coordinates(h, [np.atleast_1d(i), np.atleast_1d(j)], order=1)
def BI(xb, yb):
    i, j = ij(xb, yb); return B[np.rint(np.atleast_1d(i)).astype(int), np.rint(np.atleast_1d(j)).astype(int)]
gy, gx = np.gradient(h, dx); SLOPE = np.hypot(gx, gy)
def SL(xb, yb):
    i, j = ij(xb, yb); return SLOPE[np.rint(np.atleast_1d(i)).astype(int), np.rint(np.atleast_1d(j)).astype(int)]
def P(x1, z1, hgt=0.0): return mathutils.Vector((x1 * S, -z1 * S, hgt))

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.unit_settings.system = 'METRIC'
# ---------------- terrain
bpy.ops.mesh.primitive_grid_add(x_subdivisions=N - 1, y_subdivisions=N - 1, size=W - dx, location=(cx, cy, 0))
to = bpy.context.object; to.name = 'terrain'; me = to.data; nv = len(me.vertices)
co = np.empty(nv * 3, np.float32); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
I_, J_ = ij(co[:, 0] + cx, co[:, 1] + cy)
co[:, 2] = h[np.rint(I_).astype(int), np.rint(J_).astype(int)]; me.vertices.foreach_set('co', co.ravel()); me.update()
me.polygons.foreach_set('use_smooth', np.ones(len(me.polygons), bool))
img = bpy.data.images.load(f'{F}/terrain/terrain-colour-2048.png')
m = bpy.data.materials.new('terrain'); m.use_nodes = True; nt = m.node_tree; Nn = nt.nodes; L = nt.links
bs = Nn['Principled BSDF']; bs.inputs['Roughness'].default_value = 0.88
tx = Nn.new('ShaderNodeTexImage'); tx.image = img; tx.interpolation = 'Cubic'; tx.extension = 'EXTEND'
geo = Nn.new('ShaderNodeNewGeometry'); nz = Nn.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.02; nz.inputs['Detail'].default_value = 8
L.new(geo.outputs['Position'], nz.inputs['Vector'])
mix = Nn.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'OVERLAY'; mix.inputs['Factor'].default_value = 0.22
hs_ = Nn.new('ShaderNodeHueSaturation'); hs_.inputs['Saturation'].default_value = 1.45; hs_.inputs['Value'].default_value = 0.82
L.new(tx.outputs['Color'], hs_.inputs['Color']); L.new(hs_.outputs['Color'], mix.inputs['A']); L.new(nz.outputs['Color'], mix.inputs['B']); L.new(mix.outputs['Result'], bs.inputs['Base Color'])
bump = Nn.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.3
nz2 = Nn.new('ShaderNodeTexNoise'); nz2.inputs['Scale'].default_value = 0.12; nz2.inputs['Detail'].default_value = 12
L.new(geo.outputs['Position'], nz2.inputs['Vector']); L.new(nz2.outputs['Fac'], bump.inputs['Height']); L.new(bump.outputs['Normal'], bs.inputs['Normal'])
me.materials.append(m)
# ---------------- water
def water(name, rgb, trans):
    w = bpy.data.materials.new(name); w.use_nodes = True; b = w.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = 0.04; b.inputs['IOR'].default_value = 1.33
    b.inputs['Transmission Weight'].default_value = trans; return w
def plane(name, x0, y0, x1, y1, z, mat):
    pm = bpy.data.meshes.new(name); pm.from_pydata([(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)], [], [(0, 1, 2, 3)])
    o = bpy.data.objects.new(name, pm); sc.collection.objects.link(o); pm.materials.append(mat); return o
sea = water('sea', (0.05, 0.30, 0.42), 0.85); fresh = water('fresh', (0.08, 0.38, 0.45), 0.8)
R = 90000; plane('sea', cx - R, cy - R, cx + R, cy + R, 0.0, sea)
def g2w(ii, jj): return ((jj + 0.5) * 1254 / N - PX0) * MPP * S, -((ii + 0.5) * 1254 / N - PZ0) * MPP * S
def water_mesh(name, mask, level, mat, step=2):
    mk = ndi.binary_dilation(mask, iterations=2)[::step, ::step]; n0, n1 = mk.shape; ii, jj = np.nonzero(mk)
    if not len(ii): return
    vid = -np.ones((n0 + 1, n1 + 1), np.int64); verts = []; faces = []
    def v(a, b):
        if vid[a, b] < 0:
            x, y = g2w(a * step - 0.5, b * step - 0.5); vid[a, b] = len(verts); verts.append((x, y, level))
        return vid[a, b]
    for a, b in zip(ii, jj): faces.append((v(a, b), v(a + 1, b), v(a + 1, b + 1), v(a, b + 1)))
    pm = bpy.data.meshes.new(name); pm.from_pydata(verts, [], faces); o = bpy.data.objects.new(name, pm)
    sc.collection.objects.link(o); pm.materials.append(mat)
water_mesh('lantern_lake', T0['lake'], J['lake_level'], fresh)
lab, n = ndi.label(T0['tarn']); fl = T0['fill']
for k in range(n):
    mk = lab == k + 1; water_mesh(f'tarn_{k}', mk, float(np.median(fl[mk])), fresh)
water_mesh('lagoon', (T0['R_lagoon'] > 0.5) & (T0['h'] < 0.25), 0.25, sea)
# ---------------- model library (layout GLBs)
lib = bpy.data.collections.new('library'); sc.collection.children.link(lib); lib.hide_render = True; lib.hide_viewport = True
MESH = {}
def load(name, path):
    if name in MESH: return MESH[name]
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]; ms = [o for o in new if o.type == 'MESH']
    if not ms: MESH[name] = None; return None
    for o in bpy.context.scene.objects: o.select_set(o in ms)
    bpy.context.view_layer.objects.active = ms[0]
    if len(ms) > 1: bpy.ops.object.join()
    ob = bpy.context.view_layer.objects.active; ob.parent = None
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    for o in new:
        if o != ob and o.name in bpy.data.objects: bpy.data.objects.remove(o)
    for c in ob.users_collection: c.objects.unlink(ob)
    lib.objects.link(ob); ob.name = 'lib_' + name
    bb = np.array([c[:] for c in ob.bound_box]); dims = bb.max(0) - bb.min(0)
    MESH[name] = (ob, float(dims.max()), float(bb.min(0)[2])); return MESH[name]
GLB = lambda n: f'{F}/glb/{n}.glb'
# ---------------- placements
plan = json.load(open(f'{F}/fill_plan.json'))
pos = json.load(open(f'{SC}/schema/pos_raw.json')); new = json.load(open(f'{SC}/schema/pos_new.json'))
CEN = {k: (float(v['x'].replace('−', '-')), float(v['z'].replace('−', '-'))) for k, v in pos.items()}
CEN.update({k: (v[0], v[1]) for k, v in new.items()}); CEN['B01'] = (0.0, 0.0)
CEN['ARRIVAL'] = tuple(CR['gate_drawn'])
PADS = J['pads']
placed = []          # (model, xb, yb, zb, rot, scale, place)
occupied = []        # (xb, yb, radius)
def free(x, y, r):
    return all((x - a) ** 2 + (y - b) ** 2 > (r + c) ** 2 for a, b, c in occupied[-4000:])
def ground(x, y, size, water_ok):
    o = np.array([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) * size * 0.35
    z = float(H(x + o[:, 0], y + o[:, 1]).min())
    if water_ok: z = max(z, 0.3)
    return z
def put(mn, x, y, z, rot, size, place):
    lm = load(mn, GLB(mn)) if os.path.exists(GLB(mn)) else None
    if not lm: return False
    ob, dmax, zmin = lm; k = size / dmax
    placed.append((mn, x, y, z - zmin * k, rot, k, place)); occupied.append((x, y, size * 0.5)); return True
for place, items in plan['places'].items():
    if place not in CEN: print('no centre', place); continue
    px, pz = CEN[place]; X0, Y0 = px * S, -pz * S
    for it in items:
        mn, size, lay = it['m'], it['size'], it['layout']; nn = it.get('n', 1); r = it.get('r', 0); wat = it.get('water', False)
        off = it.get('off', [0, 0])
        if lay == 'center':
            x, y = X0 + off[0], Y0 - off[1]
            for _ in range(4):
                if wat or off == [0, 0] or H(x, y)[0] >= 1.5: break
                x, y = (x + X0) / 2, (y + Y0) / 2
            z = PADS.get(place, None) if place in PADS and off == [0, 0] else None
            z = ground(x, y, size, wat) if z is None else max(float(z), ground(x, y, size, wat))
            rot = math.atan2(-(0 - y), -(0 - x)) if place == 'ARRIVAL' else rng.uniform(0, 6.283) * (place not in ('B01',))
            if place == 'ARRIVAL': rot = 0.0
            put(mn, x, y, z, rot, size, place)
        elif lay == 'ring':
            a0 = rng.uniform(0, 6.283)
            for q in range(nn):
                a = a0 + q * 6.283 / nn; x, y = X0 + r * math.cos(a), Y0 + r * math.sin(a)
                if not wat and H(x, y)[0] < 1.0: continue
                put(mn, x, y, ground(x, y, size, wat), a + math.pi / 2, size, place)
        elif lay == 'cluster':
            got = 0; tries = 0
            while got < nn and tries < nn * 60:
                tries += 1; a = rng.uniform(0, 6.283); d = r * math.sqrt(rng.uniform(0.04, 1)); x, y = X0 + d * math.cos(a), Y0 + d * math.sin(a)
                if (H(x, y)[0] < 1.5 and not wat) or SL(x, y)[0] > 0.55 or not free(x, y, size * 0.55): continue
                if put(mn, x, y, ground(x, y, size, wat), rng.uniform(0, 6.283), size, place): got += 1
        elif lay == 'float':
            base = new.get(place, [0, 0, 0])[2] if place == 'B30' else None
            for q in range(nn):
                a = rng.uniform(0, 6.283); d = r * math.sqrt(rng.uniform(0, 1)); x, y = X0 + d * math.cos(a), Y0 + d * math.sin(a)
                z = (base + rng.uniform(-90, 120) + it.get('dy', 0)) if base is not None else float(H(x, y)[0]) + it.get('dy', 100)
                put(mn, x, y, z, rng.uniform(0, 6.283), size * rng.uniform(0.8, 1.25), place)
print('landmarks', len(placed), flush=True)
# scatter by biome; hilltop items prefer local maxima
hmax = ndi.maximum_filter(h, size=31)
for it in plan['scatter']:
    mn, size, nn = it['m'], it['size'], it['n']; bio = set(it['biomes']); got = 0; tries = 0
    if not os.path.exists(GLB(mn)): continue
    while got < nn and tries < nn * 400:
        tries += 1; x, y = rng.uniform(-10000, 9500), rng.uniform(-12400, 8000)
        if int(BI(x, y)[0]) not in bio or H(x, y)[0] < 2 or SL(x, y)[0] > 0.7: continue
        if it.get('hilltop'):
            i, j = ij(x, y); i, j = int(round(float(i))), int(round(float(j)))
            if h[i, j] < hmax[i, j] - 6: continue
        if any((x - CEN[p][0] * S) ** 2 + (y + CEN[p][1] * S) ** 2 < 260 ** 2 for p in CEN): continue
        if not free(x, y, size * 0.6): continue
        if put(mn, x, y, ground(x, y, size, False), rng.uniform(0, 6.283), size * rng.uniform(0.75, 1.3), 'wild'): got += 1
print('with scatter', len(placed), flush=True)
# objects (linked duplicates share one mesh)
col = bpy.data.collections.new('world_models'); sc.collection.children.link(col)
for q, (mn, x, y, z, rot, k, place) in enumerate(placed):
    src = MESH[mn][0]; o = bpy.data.objects.new(f'{place}_{mn}_{q}', src.data); col.objects.link(o)
    o.location = (x, y, z); o.rotation_euler = (0, 0, rot); o.scale = (k, k, k)
# white waterfall veil in front of the gate
for mn, x, y, z, rot, k, place in placed:
    if place != 'ARRIVAL': continue
    ob = MESH[mn][0]; bb = np.array([c[:] for c in ob.bound_box]) * k; wdt, hgt = np.ptp(bb[:, 0]) * 1.05, bb[:, 2].max()
    yf = y + bb[:, 1].min() - 6
    vm = bpy.data.meshes.new('falls'); vm.from_pydata([(x - wdt / 2, yf, hgt * 1.02), (x + wdt / 2, yf, hgt * 1.02), (x + wdt / 2, yf - 25, 0.2), (x - wdt / 2, yf - 25, 0.2)], [], [(0, 1, 2, 3)])
    vm.uv_layers.new(); vo = bpy.data.objects.new('waterfall_veil', vm); sc.collection.objects.link(vo)
    wm = bpy.data.materials.new('falls'); wm.use_nodes = True; wn = wm.node_tree.nodes; wl = wm.node_tree.links; out = wn['Material Output']
    tr = wn.new('ShaderNodeBsdfTransparent'); em = wn.new('ShaderNodeEmission'); em.inputs['Strength'].default_value = 1.6; em.inputs['Color'].default_value = (0.92, 0.97, 1, 1)
    tc_ = wn.new('ShaderNodeTexCoord'); mp = wn.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (40, 1.5, 1)
    wv = wn.new('ShaderNodeTexNoise'); wv.inputs['Scale'].default_value = 3; wv.inputs['Detail'].default_value = 6
    wl.new(tc_.outputs['UV'], mp.inputs[0]); wl.new(mp.outputs[0], wv.inputs['Vector'])
    ramp = wn.new('ShaderNodeValToRGB'); ramp.color_ramp.elements[0].position = 0.42; ramp.color_ramp.elements[1].position = 0.7
    wl.new(wv.outputs['Fac'], ramp.inputs[0]); mx = wn.new('ShaderNodeMixShader'); wl.new(ramp.outputs[0], mx.inputs[0])
    wl.new(tr.outputs[0], mx.inputs[1]); wl.new(em.outputs[0], mx.inputs[2]); wl.new(mx.outputs[0], out.inputs['Surface'])
    vm.materials.append(wm)
json.dump(dict(frame='three.js y-up metres: origin palace B01, x east, z south; rotY radians; scale multiplies the layout GLB (glb/<model>.glb)',
               gate=CR, models=sorted(MESH), items=[dict(m=mn, place=pl, x=round(x, 2), y=round(z, 2), z=round(-y, 2), rotY=round(rot, 4), scale=round(k, 5))
                                                     for mn, x, y, z, rot, k, pl in placed]), open(f'{F}/world-placements.json', 'w'))
# ---------------- trees from the web pack (instanced with geometry nodes)
TREE = {'ancient_oak': 'A_towering_ancient_oa', 'tree': 'A_towering_ancient_oa', 'pine': 'Pin_tree', 'wisteria': 'Enchanted_Wisteria_Tr', 'bonsai': 'Copper_Cloud_Bonsai', 'ember': 'Ember_Tree'}
idx = json.load(open(f'{SC}/web/placements/index.json'))
def scatter_obj(name, pts, scl, rot, inst):
    pm = bpy.data.meshes.new(name); pm.from_pydata([tuple(p) for p in pts], [], [])
    a = pm.attributes.new('s', 'FLOAT', 'POINT'); a.data.foreach_set('value', scl.astype(np.float32))
    a = pm.attributes.new('r', 'FLOAT', 'POINT'); a.data.foreach_set('value', rot.astype(np.float32))
    o = bpy.data.objects.new(name, pm); sc.collection.objects.link(o)
    g = bpy.data.node_groups.new(name, 'GeometryNodeTree')
    g.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry'); g.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
    G = g.nodes; GL = g.links; gi = G.new('NodeGroupInput'); go = G.new('NodeGroupOutput')
    ip = G.new('GeometryNodeInstanceOnPoints'); oi = G.new('GeometryNodeObjectInfo'); oi.inputs['Object'].default_value = inst
    ns = G.new('GeometryNodeInputNamedAttribute'); ns.data_type = 'FLOAT'; ns.inputs['Name'].default_value = 's'
    nr = G.new('GeometryNodeInputNamedAttribute'); nr.data_type = 'FLOAT'; nr.inputs['Name'].default_value = 'r'
    cz = G.new('ShaderNodeCombineXYZ'); GL.new(nr.outputs['Attribute'], cz.inputs['Z'])
    try:
        er = G.new('FunctionNodeEulerToRotation'); GL.new(cz.outputs[0], er.inputs[0]); GL.new(er.outputs[0], ip.inputs['Rotation'])
    except Exception:
        GL.new(cz.outputs[0], ip.inputs['Rotation'])
    GL.new(gi.outputs[0], ip.inputs['Points']); GL.new(oi.outputs['Geometry'], ip.inputs['Instance']); GL.new(ns.outputs['Attribute'], ip.inputs['Scale'])
    GL.new(ip.outputs['Instances'], go.inputs[0])
    md = o.modifiers.new(name, 'NODES'); md.node_group = g; return o
ntree = 0
for sp, mdl in TREE.items():
    arr = np.fromfile(f'{SC}/web/placements/{sp}.bin', np.float32).reshape(-1, 5)
    xb, yb, sc_, rt = arr[:, 0], -arr[:, 2], arr[:, 3], arr[:, 4]
    zb = H(xb, yb); oldz = arr[:, 1]
    keep = (zb - oldz) < 20                      # drop trees buried by the new crescent
    lm = load('tree_' + sp, f'{SC}/web/trees/{mdl}.glb')
    if not lm: continue
    k = 1.0 if sp != 'tree' else 0.8
    scatter_obj('trees_' + sp, np.c_[xb, yb, zb - 0.5][keep], (sc_ * k)[keep], rt[keep], lm[0]); ntree += int(keep.sum())
# pines on the new crescent slopes
cand = np.argwhere((B == 16) & ((h - h_old) > 25) & (SLOPE < 0.8))
if len(cand):
    sel = cand[rng.choice(len(cand), min(len(cand), 45000), replace=False)]
    xs, ys = g2w(sel[:, 0] + rng.uniform(-0.5, 0.5, len(sel)), sel[:, 1] + rng.uniform(-0.5, 0.5, len(sel)))
    lm = load('tree_pine', f'{SC}/web/trees/Pin_tree.glb')
    scatter_obj('trees_crescent_pine', np.c_[xs, ys, H(xs, ys) - 0.5], rng.uniform(0.8, 1.5, len(sel)), rng.uniform(0, 6.283, len(sel)), lm[0]); ntree += len(sel)
print('trees', ntree, flush=True)
# ---------------- palace massing from the layout file
try:
    with bpy.data.libraries.load(f'{F}/layout.blend', link=False) as (src, dst): dst.collections = ['01_Palace_B01']
    pc = dst.collections[0]; sc.collection.children.link(pc)
    zmin = min((o.matrix_world @ mathutils.Vector(c)).z for o in pc.objects if o.type == 'MESH' for c in o.bound_box)
    base = float(H(0, 0)[0])
    for o in pc.objects:
        if o.parent is None: o.location.z += base - zmin
except Exception as e: print('palace not loaded', e)
# ---------------- sky, sun, render
w = bpy.data.worlds.new('sky'); w.use_nodes = True; sc.world = w
sky = w.node_tree.nodes.new('ShaderNodeTexSky')
try: sky.sky_type = 'NISHITA'
except Exception: pass
try: sky.sun_elevation = math.radians(16); sky.sun_rotation = math.radians(215); sky.altitude = 500; sky.air_density = 1.2; sky.dust_density = 1.0
except Exception: pass
w.node_tree.links.new(sky.outputs['Color'], w.node_tree.nodes['Background'].inputs['Color']); w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.25
sl_ = bpy.data.lights.new('sun', 'SUN'); sl_.energy = 3.4; sl_.angle = math.radians(1.5); sl_.color = (1.0, 0.88, 0.76)
so = bpy.data.objects.new('sun', sl_); sc.collection.objects.link(so); so.rotation_euler = (math.radians(74), 0, math.radians(125))
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = SPP; sc.cycles.use_denoising = True
sc.cycles.max_bounces = 4; sc.cycles.transmission_bounces = 3
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'; sc.view_settings.exposure = -0.85
sc.render.resolution_x, sc.render.resolution_y = RES
sc.render.image_settings.file_format = 'JPEG'; sc.render.image_settings.quality = 90
def place_cam(p, dist, hgt, az, lens=30, look_up=0.0):
    x, z = CEN[p]; tgt = P(x, z, float(H(x * S, -z * S)[0]) + look_up)
    a = math.radians(az); loc = tgt + mathutils.Vector((math.sin(a) * dist, -math.cos(a) * dist, hgt)); return loc, tgt, lens
gx_, gz_ = CR['gate_drawn']
CAMS = {
 'crescent_overview': (P(-250, 7600, 10500), P(-200, 1300, 0), 22),
 'arrival_gate': (P(gx_, gz_ + 520, 70), P(gx_, gz_, 380), 24),
 'lake_to_palace': (P(-200, 3300, 900), P(0, 200, 100), 30),
 'B06_pagoda': place_cam('B06', 700, 260, 200), 'B10_canyon': place_cam('B10', 900, 300, 160), 'B27_oasis': place_cam('B27', 650, 220, 150),
 'B12_village': place_cam('B12', 520, 170, 210, 32), 'B17_glowwood': place_cam('B17', 420, 120, 190, 32), 'B14_karst': place_cam('B14', 1300, 380, 170),
 'B30_sky_isles': place_cam('B30', 1500, 40, 165, 26, look_up=330), 'B26_dragon_roost': place_cam('B26', 1300, 350, 200), 'B02_moon_water': place_cam('B02', 700, 180, 170),
}
for name, (loc, tgt, lens) in CAMS.items():
    cd = bpy.data.cameras.new(name); cd.lens = lens; cd.clip_start = 2; cd.clip_end = 90000
    co_ = bpy.data.objects.new('cam_' + name, cd); sc.collection.objects.link(co_)
    loc = loc.copy(); loc.z = max(loc.z, float(H(loc.x, loc.y)[0]) + 40)
    co_.location = loc; co_.rotation_euler = (tgt - loc).to_track_quat('-Z', 'Y').to_euler()
if SAVE:
    img.filepath = '//terrain/terrain-colour-2048.png'; bpy.ops.wm.save_as_mainfile(filepath=f'{F}/crescent-world-filled.blend'); print('SAVED', flush=True)
for name in CAMS:
    if only and name not in only: continue
    sc.camera = bpy.data.objects['cam_' + name]; sc.render.filepath = f'{REN}/fill-{name}.jpg'
    bpy.ops.render.render(write_still=True); print('RENDER', name, flush=True)
print('DONE', flush=True)
