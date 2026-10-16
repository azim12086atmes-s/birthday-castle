import bpy, sys, os, json, math, numpy as np, mathutils
from scipy import ndimage as ndi
IN, OUTB, REN = sys.argv[sys.argv.index('--') + 1:][:3]
only = sys.argv[sys.argv.index('--') + 4:]
T = np.load(f'{IN}/terrain.npz'); J = json.load(open(f'{IN}/terrain.json'))
h = T['h'].astype(np.float64); N = h.shape[0]; dx = J['dx']; S = 2.75; MPP = 6.0; PX0, PZ0 = 670, 490
W = N * dx
cx = (627 - PX0) * MPP * S; cy = -(627 - PZ0) * MPP * S
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.unit_settings.system = 'METRIC'
bpy.ops.mesh.primitive_grid_add(x_subdivisions=N - 1, y_subdivisions=N - 1, size=W - dx, location=(cx, cy, 0))
to = bpy.context.object; to.name = 'terrain'
me = to.data; nv = len(me.vertices)
co = np.empty(nv * 3, np.float32); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
xw = co[:, 0] + cx; yw = co[:, 1] + cy
j = np.clip(np.rint((xw / S / MPP + PX0) * N / 1254 - 0.5), 0, N - 1).astype(int)
i = np.clip(np.rint((-yw / S / MPP + PZ0) * N / 1254 - 0.5), 0, N - 1).astype(int)
co[:, 2] = h[i, j]; me.vertices.foreach_set('co', co.ravel()); me.update()
me.polygons.foreach_set('use_smooth', np.ones(len(me.polygons), bool))
img = bpy.data.images.load(os.path.join(os.path.dirname(OUTB), 'terrain-colour-2048.png')); img.name = 'terrain-colour'
m = bpy.data.materials.new('terrain'); m.use_nodes = True; nt = m.node_tree; Nn = nt.nodes; L = nt.links
bs = Nn['Principled BSDF']; bs.inputs['Roughness'].default_value = 0.85
tx = Nn.new('ShaderNodeTexImage'); tx.image = img; tx.interpolation = 'Cubic'; tx.extension = 'EXTEND'
geo = Nn.new('ShaderNodeNewGeometry')
nz = Nn.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 0.02; nz.inputs['Detail'].default_value = 8
L.new(geo.outputs['Position'], nz.inputs['Vector'])
mix = Nn.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'OVERLAY'; mix.inputs['Factor'].default_value = 0.18
L.new(tx.outputs['Color'], mix.inputs['A']); L.new(nz.outputs['Color'], mix.inputs['B']); L.new(mix.outputs['Result'], bs.inputs['Base Color'])
bump = Nn.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.25
nz2 = Nn.new('ShaderNodeTexNoise'); nz2.inputs['Scale'].default_value = 0.15; nz2.inputs['Detail'].default_value = 10
L.new(geo.outputs['Position'], nz2.inputs['Vector']); L.new(nz2.outputs['Fac'], bump.inputs['Height']); L.new(bump.outputs['Normal'], bs.inputs['Normal'])
me.materials.append(m)
def water(name, rgb, trans):
    w = bpy.data.materials.new(name); w.use_nodes = True; b = w.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = 0.04; b.inputs['IOR'].default_value = 1.33
    b.inputs['Transmission Weight'].default_value = trans
    return w
def plane(name, x0, y0, x1, y1, z, mat):
    pm = bpy.data.meshes.new(name); pm.from_pydata([(x0, y0, z), (x1, y0, z), (x1, y1, z), (x0, y1, z)], [], [(0, 1, 2, 3)])
    o = bpy.data.objects.new(name, pm); sc.collection.objects.link(o); pm.materials.append(mat); return o
sea = water('sea', (0.06, 0.32, 0.42), 0.85); fresh = water('fresh', (0.08, 0.38, 0.45), 0.8)
R = 30000; plane('sea', cx - R, cy - R, cx + R, cy + R, 0.0, sea)
def g2w(ii, jj): return ((jj + 0.5) * 1254 / N - PX0) * MPP * S, -((ii + 0.5) * 1254 / N - PZ0) * MPP * S
def water_mesh(name, mask, level, mat, step=2):
    """Flat water only over the masked cells (half resolution), so no rectangle floats over dry land."""
    mk = ndi.binary_dilation(mask, iterations=2)[::step, ::step]; n0, n1 = mk.shape
    ii, jj = np.nonzero(mk)
    if not len(ii): return
    vid = -np.ones((n0 + 1, n1 + 1), np.int64); verts = []; faces = []
    def v(a, b):
        if vid[a, b] < 0:
            x, y = g2w(a * step - 0.5, b * step - 0.5); vid[a, b] = len(verts)
            verts.append((x, y, level if np.isscalar(level) else float(level[min(a * step, N - 1), min(b * step, N - 1)])))
        return vid[a, b]
    for a, b in zip(ii, jj): faces.append((v(a, b), v(a + 1, b), v(a + 1, b + 1), v(a, b + 1)))
    pm = bpy.data.meshes.new(name); pm.from_pydata(verts, [], faces); o = bpy.data.objects.new(name, pm)
    sc.collection.objects.link(o); pm.materials.append(mat)
water_mesh('lantern_lake', T['lake'], J['lake_level'], fresh)
lab, n = ndi.label(T['tarn']); f = T['fill']
for k in range(n):
    mk = lab == k + 1; water_mesh(f'tarn_{k}', mk, float(np.median(f[mk])), fresh)
water_mesh('lagoon', (T['R_lagoon'] > 0.5) & (T['h'] < 0.25), 0.25, sea)
# ---- forests: one Geometry Nodes scatter per tree kind, density from the biome painter
D = np.load(f'{IN}/trees.npz')
tc = bpy.data.collections.new('tree_masters'); sc.collection.children.link(tc)
def tmat(name, rgb, emit=0.0):
    t = bpy.data.materials.new(name); t.use_nodes = True; nt_ = t.node_tree; b_ = nt_.nodes['Principled BSDF']
    oi = nt_.nodes.new('ShaderNodeObjectInfo'); hs = nt_.nodes.new('ShaderNodeHueSaturation')
    hs.inputs['Color'].default_value = (*rgb, 1)
    mr = nt_.nodes.new('ShaderNodeMapRange'); mr.inputs['To Min'].default_value = 0.75; mr.inputs['To Max'].default_value = 1.2
    nt_.links.new(oi.outputs['Random'], mr.inputs['Value']); nt_.links.new(mr.outputs['Result'], hs.inputs['Value'])
    nt_.links.new(hs.outputs['Color'], b_.inputs['Base Color']); b_.inputs['Roughness'].default_value = 0.8
    if emit: b_.inputs['Emission Color'].default_value = (*rgb, 1); b_.inputs['Emission Strength'].default_value = emit
    return t
trunk = tmat('trunk', (0.25, 0.17, 0.11))
def master(name, kind, rgb, emit=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=6, radius=0.6, depth=6, location=(0, 0, 3)); tr = bpy.context.object
    tr.data.materials.append(trunk)
    if kind == 'cone': bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=4.2, depth=17, location=(0, 0, 11))
    elif kind == 'flat': bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=7, location=(0, 0, 10)); bpy.context.object.scale = (1, 1, 0.55)
    else: bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=6, location=(0, 0, 10)); bpy.context.object.scale = (1, 1, 0.85)
    cr = bpy.context.object; cr.data.materials.append(tmat(name, rgb, emit))
    for o in (tr, cr): o.select_set(True)
    bpy.context.view_layer.objects.active = cr; bpy.ops.object.join(); bpy.ops.object.transform_apply(scale=True)
    m_ = bpy.context.object; m_.name = 'tree_' + name
    for c in m_.users_collection: c.objects.unlink(m_)
    tc.objects.link(m_); return m_
MASTERS = {'broadleaf': master('broadleaf', 'ball', (0.16, 0.36, 0.12)), 'pine': master('pine', 'cone', (0.08, 0.22, 0.13)),
           'blossom': master('blossom', 'ball', (0.95, 0.55, 0.72)), 'glow': master('glow', 'ball', (0.10, 0.55, 0.60), 0.6),
           'jungle': master('jungle', 'flat', (0.06, 0.30, 0.08)), 'gold': master('gold', 'ball', (0.90, 0.62, 0.15), 0.15)}
tc.hide_render = True; tc.hide_viewport = True
# per-vertex density attributes on the terrain
for k in MASTERS:
    a_ = me.attributes.new('d_' + k, 'FLOAT', 'POINT'); a_.data.foreach_set('value', D[k][i, j].astype(np.float32))
gn = bpy.data.node_groups.new('forests', 'GeometryNodeTree')
gn.interface.new_socket('Geometry', in_out='INPUT', socket_type='NodeSocketGeometry')
gn.interface.new_socket('Geometry', in_out='OUTPUT', socket_type='NodeSocketGeometry')
G = gn.nodes; GL = gn.links
gi = G.new('NodeGroupInput'); go = G.new('NodeGroupOutput'); join = G.new('GeometryNodeJoinGeometry')
GL.new(gi.outputs[0], join.inputs[0])
PER_M2 = 1 / 260.0
for k, mo in MASTERS.items():
    na = G.new('GeometryNodeInputNamedAttribute'); na.data_type = 'FLOAT'; na.inputs['Name'].default_value = 'd_' + k
    mul = G.new('ShaderNodeMath'); mul.operation = 'MULTIPLY'; mul.inputs[1].default_value = PER_M2
    GL.new(na.outputs['Attribute'], mul.inputs[0])
    ds = G.new('GeometryNodeDistributePointsOnFaces'); ds.distribute_method = 'RANDOM'
    ds.inputs['Seed'].default_value = hash(k) % 1000
    GL.new(gi.outputs[0], ds.inputs['Mesh']); GL.new(mul.outputs[0], ds.inputs['Density'])
    oi = G.new('GeometryNodeObjectInfo'); oi.inputs['Object'].default_value = mo
    ip = G.new('GeometryNodeInstanceOnPoints')
    GL.new(ds.outputs['Points'], ip.inputs['Points']); GL.new(oi.outputs['Geometry'], ip.inputs['Instance'])
    rs = G.new('FunctionNodeRandomValue'); rs.data_type = 'FLOAT'; rs.inputs['Min'].default_value = 0.6; rs.inputs['Max'].default_value = 1.5
    rs.inputs['Seed'].default_value = 7 + len(k)
    GL.new(rs.outputs['Value'], ip.inputs['Scale'])
    rr = G.new('FunctionNodeRandomValue'); rr.data_type = 'FLOAT_VECTOR'; rr.inputs['Max'].default_value = (0, 0, 6.283)
    GL.new(rr.outputs['Value'], ip.inputs['Rotation'])
    GL.new(ip.outputs['Instances'], join.inputs[0])
GL.new(join.outputs[0], go.inputs[0])
md = to.modifiers.new('forests', 'NODES'); md.node_group = gn
# sky and sun
w = bpy.data.worlds.new('sky'); w.use_nodes = True; sc.world = w
sky = w.node_tree.nodes.new('ShaderNodeTexSky')
try: sky.sky_type = 'NISHITA'
except Exception: pass
try: sky.sun_elevation = math.radians(18); sky.sun_rotation = math.radians(215); sky.altitude = 500; sky.air_density = 1.0; sky.dust_density = 0.6
except Exception: pass
w.node_tree.links.new(sky.outputs['Color'], w.node_tree.nodes['Background'].inputs['Color'])
w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.22
sl_ = bpy.data.lights.new('sun', 'SUN'); sl_.energy = 3.2; sl_.angle = math.radians(1.5); sl_.color = (1.0, 0.9, 0.8)
so = bpy.data.objects.new('sun', sl_); sc.collection.objects.link(so); so.rotation_euler = (math.radians(72), 0, math.radians(215 - 180 + 90))
sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = 48; sc.cycles.use_denoising = True
sc.cycles.max_bounces = 4; sc.cycles.transmission_bounces = 3
sc.view_settings.view_transform = 'Standard'; sc.view_settings.exposure = -0.7
sc.render.resolution_x, sc.render.resolution_y = 1600, 900
sc.render.image_settings.file_format = 'JPEG'; sc.render.image_settings.quality = 90
# light ground mist via volume would be costly; use a thin world fog by colour in compositing later if needed
def P(x1, z1, hgt): return mathutils.Vector((x1 * S, -z1 * S, hgt))
CAMS = {
 'overview_south': (P(-200, 5600, 7200), P(-150, 400, 0), 28),
 'lake_to_palace': (P(-200, 3300, 900), P(0, 200, 100), 30),
 'misty_mountains': (P(2700, 400, 1200), P(1060, -880, 700), 32),
 'north_range': (P(-600, -300, 900), P(-900, -1750, 900), 26),
 'red_canyon': (P(2500, 2600, 650), P(1620, 1650, 180), 30),
 'pillar_karst': (P(3300, 1200, 380), P(2250, 380, 200), 32),
 'fjord_nw': (P(-3900, -600, 420), P(-2400, -1050, 150), 30),
}
for name, (loc, tgt, lens) in CAMS.items():
    cd = bpy.data.cameras.new(name); cd.lens = lens; cd.clip_start = 5; cd.clip_end = 80000
    co_ = bpy.data.objects.new('cam_' + name, cd); sc.collection.objects.link(co_)
    hh = h[min(max(int(((-loc.y / S) / MPP + PZ0) * N / 1254), 0), N - 1), min(max(int(((loc.x / S) / MPP + PX0) * N / 1254), 0), N - 1)]
    loc = loc.copy(); loc.z = max(loc.z, hh + 60)
    co_.location = loc; co_.rotation_euler = (tgt - loc).to_track_quat('-Z', 'Y').to_euler()
os.makedirs(os.path.dirname(OUTB), exist_ok=True)
img.filepath = '//terrain-colour-2048.png'; bpy.ops.wm.save_as_mainfile(filepath=OUTB)
print('SAVED', OUTB, flush=True)
for name in CAMS:
    if only and name not in only: continue
    sc.camera = bpy.data.objects['cam_' + name]; sc.render.filepath = f'{REN}/ow-{name}.jpg'
    bpy.ops.render.render(write_still=True); print('RENDER', name, flush=True)
print('DONE', flush=True)
