"""Arched viaducts and sea pillars for the palace cliffs (owner, Oct 17 14:41).
bpy python viaduct.py -- cliffs.json OUTDIR marble.png
Each bridge in cliffs.json becomes one GLB: a two-tier arcade of tall rose-marble pillars standing in the water,
pointed lancet arches below and paired small arches above, a deck with balustrades, lanterns and crystal-topped
pinnacles over every pillar. Local frame: origin at the bridge's middle on the water (y=0), the deck runs along +X.
Also writes four sea-pillar GLBs (100 m tall at scale 1) and a preview render."""
import bpy, bmesh, sys, json, math, os
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
C = json.load(open(a[0])); OUT = a[1]; TEX = a[2]; os.makedirs(OUT, exist_ok=True)
DECK = C['deck_y']

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
def mat(name, col, metal=0.0, rough=0.5, emit=None, tex=False):
    m = bpy.data.materials.new(name); m.use_nodes = True; b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Metallic'].default_value = metal; b.inputs['Roughness'].default_value = rough
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = 4.0
    if tex:
        t = m.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(TEX)
        mx = m.node_tree.nodes.new('ShaderNodeMix'); mx.data_type = 'RGBA'; mx.blend_type = 'MULTIPLY'; mx.inputs['Factor'].default_value = 1.0
        mx.inputs['A'].default_value = (*col, 1)
        m.node_tree.links.new(t.outputs['Color'], mx.inputs['B']); m.node_tree.links.new(mx.outputs['Result'], b.inputs['Base Color'])
    return m
def mats():
    return dict(marble=mat('marble', (0.98, 0.90, 0.88), rough=0.35, tex=True), rose=mat('rose', (0.86, 0.58, 0.62), rough=0.45, tex=True),
                base=mat('base', (0.55, 0.46, 0.50), rough=0.7, tex=True), gold=mat('gold', (1.0, 0.76, 0.34), metal=0.9, rough=0.25),
                glow=mat('glow', (0.6, 0.95, 1.0), emit=(0.45, 0.95, 1.0)), moss=mat('moss', (0.20, 0.42, 0.30), rough=0.9),
                lamp=mat('lamp', (1.0, 0.85, 0.6), emit=(1.0, 0.78, 0.45)))

class Builder:
    """collects geometry per material in bmesh, one object per material at the end"""
    def __init__(self): self.bm = {}
    def get(self, k):
        if k not in self.bm: self.bm[k] = bmesh.new()
        return self.bm[k]
    def box(self, k, x0, x1, y0, y1, z0, z1):            # Blender axes: x along, y across, z up
        bm = self.get(k); r = bmesh.ops.create_cube(bm, size=1.0)
        for v in r['verts']:
            v.co = Vector(((x0 + x1) / 2 + v.co.x * (x1 - x0), (y0 + y1) / 2 + v.co.y * (y1 - y0), (z0 + z1) / 2 + v.co.z * (z1 - z0)))
    def cyl(self, k, x, y, z0, z1, r0, r1, seg=8):
        bm = self.get(k); r = bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r0, radius2=r1, depth=z1 - z0)
        for v in r['verts']: v.co += Vector((x, y, (z0 + z1) / 2))
    def sphere(self, k, x, y, z, r):
        bm = self.get(k); s = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=r)
        for v in s['verts']: v.co += Vector((x, y, z))
    def wall(self, k, outline, y0, y1):
        """a flat wall: closed 2D outline in (x, z), extruded across y0..y1"""
        bm = self.get(k)
        vs = [bm.verts.new((x, y0, z)) for x, z in outline]
        es = [bm.edges.new((vs[i], vs[(i + 1) % len(vs)])) for i in range(len(vs))]
        f = bmesh.ops.triangle_fill(bm, use_beauty=True, use_dissolve=False, edges=es)
        faces = [g for g in f['geom'] if isinstance(g, bmesh.types.BMFace)]
        ex = bmesh.ops.extrude_face_region(bm, geom=faces)
        moved = [g for g in ex['geom'] if isinstance(g, bmesh.types.BMVert)]
        for v in moved: v.co.y = y1
    def finish(self, M, name):
        objs = []
        for k, bm in self.bm.items():
            bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=0.01); bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
            me = bpy.data.meshes.new(f'{name}-{k}'); bm.to_mesh(me); bm.free()
            o = bpy.data.objects.new(f'{name}-{k}', me); bpy.context.scene.collection.objects.link(o); me.materials.append(M[k]); objs.append(o)
        self.bm = {}
        return objs

def lancet(x0, x1, zs, za, n=10):
    """pointed arch from (x0, zs) over the apex za to (x1, zs): two arcs whose centres sit inside the span"""
    w = x1 - x0; h = za - zs
    # each arc has radius R centred at (x1 - R, zs) for the left half, so that it reaches the apex at mid-span
    R = (h * h + (w / 2) ** 2) / w if w > 0 else 1
    R = max(R, w / 2 + 0.01)
    pts = []
    cxl = x0 + R
    for i in range(n + 1):
        t = i / n; ang = math.pi + t * (math.acos(max(-1, min(1, (x0 + w / 2 - cxl) / R))) - math.pi)
        pts.append((cxl + R * math.cos(ang), zs + R * math.sin(ang)))
    cxr = x1 - R
    right = []
    for i in range(n + 1):
        t = i / n; ang = t * math.acos(max(-1, min(1, (x0 + w / 2 - cxr) / R)))
        right.append((cxr + R * math.cos(ang), zs + R * math.sin(ang)))
    return pts + right[::-1][1:]

def viaduct(B, M, name, L, width):
    H = B.get('deck', DECK); n = max(2, round(L / 62)); span = L / n; pw = min(5.5, span * 0.09); dep = width - 2
    b = Builder(); x0 = -L / 2
    zs1, za1 = H * 0.40, H * 0.74                      # the tall lancets
    zs2, za2 = H * 0.80, H * 0.92                      # the small paired arches under the deck
    for i in range(n + 1):                             # pillars, plinths, capitals, cutwaters
        x = x0 + i * span
        b.box('base', x - pw * 1.5, x + pw * 1.5, -dep / 2 - 3, dep / 2 + 3, -10, 6)                 # wet plinth
        b.box('moss', x - pw * 1.55, x + pw * 1.55, -dep / 2 - 3.1, dep / 2 + 3.1, 0.2, 2.4)          # moss band at the water
        b.box('rose', x - pw, x + pw, -dep / 2 - 1.2, dep / 2 + 1.2, 6, H - 2)                     # shaft (buttressed)
        b.box('marble', x - pw * 1.25, x + pw * 1.25, -dep / 2 - 1.6, dep / 2 + 1.6, zs1 - 3, zs1)   # impost band
        b.box('gold', x - pw * 1.3, x + pw * 1.3, -dep / 2 - 1.7, dep / 2 + 1.7, zs1 - 3.6, zs1 - 3)
        b.box('marble', x - pw * 1.2, x + pw * 1.2, -dep / 2 - 1.5, dep / 2 + 1.5, zs2 - 2, zs2)
        # cutwater prow up and downstream
        for s in (-1, 1):
            b.cyl('base', x, s * (dep / 2 + 3), -10, 10, pw * 1.5, pw * 0.4, 4)
        # pinnacle over the pillar above the deck, crystal on top
        for s in (-1, 1):
            y = s * (width / 2 + 0.2)
            b.box('marble', x - 1.4, x + 1.4, y - 1.4, y + 1.4, H, H + 7)
            b.cyl('gold', x, y, H + 7, H + 12, 1.6, 0.15, 8)
            b.sphere('glow', x, y, H + 13, 0.9)
    for i in range(n):                                   # arch walls between pillars
        a0, a1 = x0 + i * span + pw, x0 + (i + 1) * span - pw
        low = lancet(a0, a1, zs1, za1)
        outline = low + [(a1, zs2 - 2), (a0, zs2 - 2)]
        b.wall('marble', outline, -dep / 2, dep / 2)
        # arch band in gold just proud of the face
        for s in (-1, 1):
            band = [(x, z + 0.0) for x, z in lancet(a0 - 0.9, a1 + 0.9, zs1, za1 + 1.4)] + [(x, z) for x, z in lancet(a0, a1, zs1, za1)][::-1]
            b.wall('gold', band, s * dep / 2, s * (dep / 2 + 0.4))
        # the paired small arches above
        mid = (a0 + a1) / 2; q = 1.6
        for c0, c1 in ((a0, mid - q), (mid + q, a1)):
            up = lancet(c0, c1, zs2, za2, 6)
            b.wall('rose', up + [(c1, H - 2), (c0, H - 2)], -dep / 2 + 0.6, dep / 2 - 0.6)
        b.box('marble', mid - q, mid + q, -dep / 2, dep / 2, zs2 - 2, H - 2)
    # deck slab, cornice, balustrade, lanterns
    b.box('marble', -L / 2 - 4, L / 2 + 4, -width / 2 - 0.6, width / 2 + 0.6, H - 2.2, H - 0.05)
    b.box('gold', -L / 2 - 4, L / 2 + 4, -width / 2 - 0.9, width / 2 + 0.9, H - 2.6, H - 2.2)
    for s in (-1, 1):
        y = s * (width / 2 - 0.3)
        b.box('marble', -L / 2, L / 2, y - 0.3, y + 0.3, H + 0.95, H + 1.2)            # rail
        k = 0; x = -L / 2
        while x <= L / 2:
            b.box('marble', x - 0.18, x + 0.18, y - 0.18, y + 0.18, H, H + 0.95)        # baluster
            if k % 14 == 7:
                b.cyl('base', x, y, H, H + 4.2, 0.14, 0.1, 6); b.sphere('lamp', x, y, H + 4.5, 0.45)
            x += 2.5; k += 1
    return b.finish(M, name)

def pillars(M):
    """four sea pillars, 100 m tall at scale 1, base at y=-10 (stands in water)"""
    out = {}
    # 1 basalt stack: faceted, leaning, moss and a tuft of trees on top
    b = Builder(); import random; rnd = random.Random(5)
    z = -10; r = 13
    while z < 92:
        h = rnd.uniform(6, 11); r2 = r * rnd.uniform(0.9, 1.02)
        b.cyl('base', rnd.uniform(-0.6, 0.6), rnd.uniform(-0.6, 0.6), z, z + h, r, r2, 7); z += h; r = r2
    b.cyl('moss', 0, 0, z, z + 3, r * 1.08, r * 0.95, 9)
    for k in range(5):
        a_ = k * 1.25; b.cyl('moss', math.cos(a_) * r * 0.45, math.sin(a_) * r * 0.45, z + 2, z + 11, 3.2, 0.2, 6)
    b.sphere('glow', 0, 0, z + 4, 1.3)
    out['SeaPillar_Basalt'] = b
    # 2 carved marble column with a gold capital and a floating crystal
    b = Builder()
    b.cyl('base', 0, 0, -10, 6, 12, 10, 12)
    b.cyl('rose', 0, 0, 6, 86, 7.5, 6.5, 16)
    for zz in range(14, 84, 14): b.cyl('gold', 0, 0, zz, zz + 0.8, 7.6, 7.6, 16)
    b.cyl('marble', 0, 0, 86, 92, 6.8, 10, 16); b.cyl('gold', 0, 0, 92, 94, 10.5, 10.5, 16)
    b.cyl('glow', 0, 0, 98, 106, 0.1, 2.6, 6); b.cyl('glow', 0, 0, 106, 112, 2.6, 0.1, 6)
    out['SeaPillar_Column'] = b
    # 3 twin columns joined by a lancet arch on top
    b = Builder()
    for s in (-1, 1):
        b.cyl('base', s * 14, 0, -10, 4, 6, 5, 10); b.cyl('rose', s * 14, 0, 4, 70, 3.8, 3.4, 12); b.cyl('gold', s * 14, 0, 70, 72, 4.4, 4.4, 12)
    b.wall('marble', lancet(-10.5, 10.5, 72, 88, 8) + [(17.5, 72), (17.5, 96), (-17.5, 96), (-17.5, 72)], -2.5, 2.5)
    b.sphere('glow', 0, 0, 99, 1.6)
    out['SeaPillar_TwinArch'] = b
    # 4 crystal spire rock: a slim tapering rock with glowing crystal veins
    b = Builder(); rnd = random.Random(9); z = -10; r = 9
    while z < 100:
        h = rnd.uniform(8, 14); r2 = max(1.2, r * 0.86)
        b.cyl('base', 0, 0, z, z + h, r, r2, 6); z += h; r = r2
    for k in range(9):
        zz = rnd.uniform(5, 90); a_ = rnd.uniform(0, 6.28); rr = 9 * (1 - zz / 120)
        b.cyl('glow', math.cos(a_) * rr, math.sin(a_) * rr, zz, zz + rnd.uniform(4, 9), 0.9, 0.05, 5)
    out['SeaPillar_CrystalSpire'] = b
    return out

def export(objs, path):
    for o in bpy.data.objects: o.select_set(o in objs)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=True, export_image_format='JPEG')

index = {}
for B in C['bridges']:
    reset(); M = mats()
    nm = 'Viaduct_' + ''.join(ch if ch.isalnum() else '_' for ch in B['id'])[:40]
    if nm in index: nm += f'_{sum(1 for k in index if k.startswith(nm)) + 1}'
    objs = viaduct(B, M, nm, B['length'] + 60, B['width'] + 2)        # 30 m into each cliff top
    export(objs, f'{OUT}/{nm}.glb')
    ax, az = B['a']; bx, bz = B['b']
    index[nm] = dict(bridge=B['id'], x=round((ax + bx) / 2, 2), z=round((az + bz) / 2, 2), y=0.0,
                     rotY=round(math.atan2(-(bz - az), bx - ax), 5), scale=1.0, length=B['length'] + 60, deck=B.get('deck', DECK))
reset(); M = mats()
for nm, b in pillars(M).items():
    for o in list(bpy.data.objects): bpy.data.objects.remove(o)
    objs = b.finish(M, nm); export(objs, f'{OUT}/{nm}.glb')
json.dump(index, open(f'{OUT}/viaducts.json', 'w'), indent=1)
print('VIADUCTS', len(index))
