"""The gate massif kit (owner, Oct 17 19:29): "a large gate within the mountain that opens and has a flooring of marble,
as you go in the white light seen brighter and when you come out the bridge continues with a waterfall in front".
bpy python gate.py -- cliffs.json inner.npz OUTDIR marble.png rock2.png
  GateTunnel     marble floor, lancet vault with gold ribs, white light panels brightening toward the middle,
                 rock plug filling the terrain slot above it up to the crest. Origin (sky.tunnel.x, 0, z0); runs to +z.
  GatePortalNorth  carved marble frame round the north mouth, facing -z (origin at the mouth, y = 0, heights absolute).
  GateDoor       one leaf of the great south doors (the game mirrors it and swings both open); hinge at local x = 0.
  CloudPlatform  round marble platform at the deck with inlaid rings, balustrade, lantern pillars, a star mosaic
                 and a fluted rock column down to the sea. Origin at its centre, y = 0."""
import bpy, bmesh, sys, json, math, os
import numpy as np
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
C = json.load(open(a[0])); hi = np.load(a[1])['h']; OUT = a[2]; MT, RT = a[3], a[4]; os.makedirs(OUT, exist_ok=True)
SK = C['sky']; T = SK['tunnel']; Y = SK['deck']; MAPW, CX, CZ = 20691.0, -709.5, 2260.5; N = hi.shape[0]; cs = MAPW / N
def Hat(x, z): return float(hi[int((z - CZ + MAPW / 2) / cs), int((x - CX + MAPW / 2) / cs)])
def reset(): bpy.ops.wm.read_factory_settings(use_empty=True)
def mat(name, col, metal=0.0, rough=0.5, emit=None, es=4.0, tex=None, scale=None):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    if tex:
        t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(tex)
        m.node_tree.links.new(t.outputs['Color'], b.inputs['Base Color'])
    return m
def mats():
    return dict(marble=mat('marble', (0.97, 0.94, 0.92), rough=0.25, tex=MT), rose=mat('rose', (0.88, 0.66, 0.70), rough=0.4),
                gold=mat('gold', (1.0, 0.78, 0.36), metal=0.9, rough=0.22), rock=mat('rock', (1, 1, 1), rough=0.85, tex=RT),
                glow=mat('glow', (0.65, 0.95, 1.0), emit=(0.5, 0.95, 1.0)), lamp=mat('lamp', (1.0, 0.88, 0.65), emit=(1.0, 0.8, 0.5)),
                light1=mat('light1', (1, 1, 1), emit=(1, 1, 1), es=2.0), light2=mat('light2', (1, 1, 1), emit=(1, 1, 1), es=5.0),
                light3=mat('light3', (1, 1, 1), emit=(1, 1, 1), es=10.0), moss=mat('moss', (0.25, 0.5, 0.3), rough=0.9))
class B:
    def __init__(s): s.bm = {}
    def g(s, k): return s.bm.setdefault(k, bmesh.new())
    def box(s, k, x0, x1, y0, y1, z0, z1):
        r = bmesh.ops.create_cube(s.g(k), size=1.0)
        for v in r['verts']: v.co = Vector(((x0 + x1) / 2 + v.co.x * (x1 - x0), (y0 + y1) / 2 + v.co.y * (y1 - y0), (z0 + z1) / 2 + v.co.z * (z1 - z0)))
    def cyl(s, k, x, y, z0, z1, r0, r1, seg=12):
        r = bmesh.ops.create_cone(s.g(k), cap_ends=True, segments=seg, radius1=r0, radius2=r1, depth=z1 - z0)
        for v in r['verts']: v.co += Vector((x, y, (z0 + z1) / 2))
    def sph(s, k, x, y, z, r):
        r_ = bmesh.ops.create_icosphere(s.g(k), subdivisions=1, radius=r)
        for v in r_['verts']: v.co += Vector((x, y, z))
    def prism(s, k, outline, y0, y1):          # outline in (x, z), extruded along Blender y
        bm = s.g(k); vs = [bm.verts.new((x, y0, z)) for x, z in outline]
        es = [bm.edges.new((vs[i], vs[(i + 1) % len(vs)])) for i in range(len(vs))]
        f = bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=es)
        ex = bmesh.ops.extrude_face_region(bm, geom=[g for g in f['geom'] if isinstance(g, bmesh.types.BMFace)])
        for v in [g for g in ex['geom'] if isinstance(g, bmesh.types.BMVert)]: v.co.y = y1
    def finish(s, M, name):
        objs = []
        for k, bm in s.bm.items():
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.01); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            me = bpy.data.meshes.new(f'{name}-{k}'); bm.to_mesh(me); bm.free(); me.materials.append(M[k])
            if k in ('marble', 'rock'):                 # box-project UVs so the textures tile at ~12 m (marble) / 30 m (rock)
                uv = me.uv_layers.new(); sc_ = 12.0 if k == 'marble' else 30.0
                for p in me.polygons:
                    nx, ny, nz = (abs(c) for c in p.normal)
                    for li in p.loop_indices:
                        co = me.vertices[me.loops[li].vertex_index].co
                        uv.data[li].uv = ((co.x, co.y) if nz >= max(nx, ny) else (co.x, co.z) if ny >= nx else (co.y, co.z))
                        uv.data[li].uv = (uv.data[li].uv[0] / sc_, uv.data[li].uv[1] / sc_)
            o = bpy.data.objects.new(f'{name}-{k}', me); bpy.context.scene.collection.objects.link(o); objs.append(o)
        s.bm = {}; return objs
def lancet(x0, x1, zs, za, n=10):
    w = x1 - x0; h = za - zs; R = max((h * h + (w / 2) ** 2) / w, w / 2 + 0.01); out = []
    cl = x0 + R; e = math.acos(max(-1, min(1, (x0 + w / 2 - cl) / R)))
    for i in range(n + 1): t = math.pi + i / n * (e - math.pi); out.append((cl + R * math.cos(t), zs + R * math.sin(t)))
    cr = x1 - R; e2 = math.acos(max(-1, min(1, (x0 + w / 2 - cr) / R)))
    out += [(cr + R * math.cos(i / n * e2), zs + R * math.sin(i / n * e2)) for i in range(n, -1, -1)][1:]
    return out
def export(objs, path):
    for o in bpy.data.objects: o.select_set(o in objs)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=True, export_image_format='JPEG')
items = []
W, Ht, Lt = T['width'], T['height'], T['z1'] - T['z0']; SW = T['slot_width']
# --- tunnel (Blender: x = east, -y = south (game +z), z = up; length runs along -y)
reset(); M = mats(); b = B()
seg = 40.0; ns = int(round(Lt / seg)); half = W / 2; spring = Y + Ht * 0.42
inner = lancet(-half, half, spring, Y + Ht); outer = lancet(-half - 6, half + 6, spring, Y + Ht + 8)
for i in range(ns):
    y0, y1 = -i * seg, -(i + 1) * seg; mid = abs((i + 0.5) / ns - 0.5) * 2         # 0 in the middle, 1 at the mouths
    b.box('marble', -half, half, y1, y0, Y - 1.2, Y)                               # the marble floor
    b.box('gold', -0.6, 0.6, y1, y0, Y, Y + 0.05)                                  # a gold line down the middle
    for s_ in (-1, 1):
        b.box('rose', s_ * half, s_ * (half + 6), y1, y0, Y - 1.2, spring)          # walls
        b.box('gold', s_ * (half - 0.2), s_ * (half + 0.4), y1, y0, Y, Y + 0.8)     # skirting
        lk = 'light3' if mid < 0.3 else 'light2' if mid < 0.65 else 'light1'
        b.box(lk, s_ * (half - 0.4), s_ * (half - 0.1), y1 + 8, y0 - 8, Y + 6, spring - 4)   # tall white light panels
    b.prism('marble', outer + inner[::-1], y1, y0)                                 # the vault
    rib = lancet(-half - 1, half + 1, spring, Y + Ht + 1.2) + lancet(-half + 1, half - 1, spring, Y + Ht - 1.2)[::-1]
    b.prism('gold', rib, y0 - 1.2, y0)                                             # a gold rib every 40 m
    b.sph('lamp' if mid > 0.3 else 'light3', 0, (y0 + y1) / 2, Y + Ht - 3, 1.4)
    # the rock plug over the vault, up to the crest on either side of the slot
    zc = T['z0'] + (i + 0.5) * seg; top = min(Hat(T['x'] - SW / 2 - 8, zc), Hat(T['x'] + SW / 2 + 8, zc)) - 3    # never above the slot's own shoulders
    if top > Y + Ht + 12: b.box('rock', -SW / 2 - 6, SW / 2 + 6, y1 - 0.5, y0 + 0.5, Y + Ht + 6, top)
    for s_ in (-1, 1): b.box('rock', s_ * (half + 6), s_ * (SW / 2 + 6), y1 - 0.5, y0 + 0.5, Y - 2, Y + Ht + 8)
o = b.finish(M, 'GateTunnel'); export(o, f'{OUT}/GateTunnel.glb')
items.append(dict(m='GateTunnel', place='gate', x=T['x'], y=0.0, z=T['z0'], rotY=0.0, scale=1.0, new=True))
# --- north portal: a carved frame round the mouth (faces north = Blender +y)
reset(); M = mats(); b = B(); fw, fh = W + 30, Ht + 34
frame = [(-fw / 2, Y - 2)] + lancet(-fw / 2, fw / 2, Y + fh * 0.45, Y + fh) + [(fw / 2, Y - 2), (half, Y - 2)] + lancet(-half, half, spring, Y + Ht)[::-1] + [(-half, Y - 2)]
b.prism('marble', frame, 0, 8)
b.prism('gold', [(x * 1.0, z) for x, z in lancet(-fw / 2 + 3, fw / 2 - 3, Y + fh * 0.45, Y + fh - 3)] + lancet(-fw / 2 + 5, fw / 2 - 5, Y + fh * 0.45, Y + fh - 5)[::-1], 8, 8.6)
b.prism('glow', lancet(-half - 3, half + 3, spring, Y + Ht + 3) + lancet(-half - 1.5, half + 1.5, spring, Y + Ht + 1.5)[::-1], 8, 8.5)
for s_ in (-1, 1):
    b.cyl('rose', s_ * (fw / 2 + 6), 4, Y - 2, Y + fh * 0.7, 5, 4, 16); b.cyl('gold', s_ * (fw / 2 + 6), 4, Y + fh * 0.7, Y + fh * 0.7 + 14, 5.5, 0.3, 16)
    b.sph('glow', s_ * (fw / 2 + 6), 4, Y + fh * 0.7 + 16, 2.2)
b.box('marble', -fw / 2 - 12, fw / 2 + 12, 0, 30, Y - 1.2, Y)                      # landing where the bridge meets the mouth
o = b.finish(M, 'GatePortalNorth'); export(o, f'{OUT}/GatePortalNorth.glb')
items.append(dict(m='GatePortalNorth', place='gate', x=T['x'], y=0.0, z=T['z0'], rotY=0.0, scale=1.0, new=True))
# --- one leaf of the great south doors: hinge at local x = 0, leaf to +x, 20 m wide, 56 m tall
reset(); M = mats(); b = B(); lw = W / 2
b.prism('marble', [(0, 0), (lw, 0)] + [(x, z) for x, z in lancet(-lw, lw, Ht * 0.42, Ht)[10:]] + [(0, Ht)], -1.2, 1.2)
for zz in (8, 20, 32): b.box('gold', 1.5, lw - 1.5, -1.5, 1.5, zz, zz + 0.8)
b.cyl('glow', lw * 0.55, -1.6, Ht * 0.55, Ht * 0.55 + 0.4, 4.5, 4.5, 24); b.sph('glow', lw * 0.55, -1.8, Ht * 0.55, 1.6)
o = b.finish(M, 'GateDoor'); export(o, f'{OUT}/GateDoor.glb')
items.append(dict(m='GateDoor', place='gate', x=T['x'] - W / 2, y=Y, z=T['z1'] - 2, rotY=0.0, scale=1.0, new=True, door='west leaf; mirror for the east leaf (scale x -1 at x + width), swing open 100 degrees'))
# --- the cloud platform
reset(); M = mats(); b = B(); P = SK['platform']; r = P['r']
b.cyl('marble', 0, 0, Y - 3, Y, r, r, 96)
for rr, w in ((r - 6, 1.2), (r * 0.62, 1.0), (r * 0.3, 0.8)): b.cyl('gold', 0, 0, Y, Y + 0.06, rr + w, rr + w, 96); b.cyl('marble', 0, 0, Y, Y + 0.08, rr, rr, 96)
for k in range(8):                                                                # star mosaic
    an = k * math.pi / 4
    tri = [(0, 0), (math.cos(an + 0.13) * 13, math.sin(an + 0.13) * 13), (math.cos(an) * 36, math.sin(an) * 36), (math.cos(an - 0.13) * 13, math.sin(an - 0.13) * 13)]
    bm = b.g('glow'); vs = [bm.verts.new((x, y, Y + 0.12)) for x, y in tri]; bm.faces.new(vs)
nb = int(2 * math.pi * r / 2.6)
for k in range(nb):                                                               # balustrade, open to the north for the gate
    an = 2 * math.pi * k / nb
    if abs(math.degrees(an) - 90) < 16: continue
    x, y = math.cos(an) * (r - 1), math.sin(an) * (r - 1)
    b.box('marble', x - 0.22, x + 0.22, y - 0.22, y + 0.22, Y, Y + 1.1)
    if k % 18 == 0:
        b.cyl('rose', x, y, Y, Y + 9, 1.2, 0.9, 10); b.cyl('gold', x, y, Y + 9, Y + 12, 1.4, 0.2, 10); b.sph('lamp', x, y, Y + 12.8, 0.9)
# rock column under the platform: fluted, widening a little toward the sea
rng = np.random.default_rng(4); bm = b.g('rock'); rows = 24; nseg = 72; vs = []
for i in range(rows + 1):
    z = Y - 3 - i * (Y + 30) / rows; rowv = []
    for j in range(nseg):
        an = 2 * math.pi * j / nseg; fl = 4.5 * (2 * abs((j / 3.0) % 1 - 0.5) * 2 - 1)
        rr = r * (1.0 + 0.10 * i / rows) + fl + rng.uniform(-1.5, 1.5) - (6 if i == 0 else 0)
        rowv.append(bm.verts.new((math.cos(an) * rr, math.sin(an) * rr, z)))
    vs.append(rowv)
for i in range(rows):
    for j in range(nseg): bm.faces.new((vs[i][j], vs[i][(j + 1) % nseg], vs[i + 1][(j + 1) % nseg], vs[i + 1][j]))
o = b.finish(M, 'CloudPlatform'); export(o, f'{OUT}/CloudPlatform.glb')
items.append(dict(m='CloudPlatform', place='gate', x=P['x'], y=0.0, z=P['z'], rotY=0.0, scale=1.0, new=True))
json.dump(items, open(f'{OUT}/gate-kit.json', 'w'), indent=0); print('GATE', len(items))
