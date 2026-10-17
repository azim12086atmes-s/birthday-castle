"""Sky palace update (Oct 17 19:29): tall tiered arcades for decks at 340-640 m and the 688 m sky bridge (repeat segment).
Arched viaducts and sea pillars for the palace cliffs (owner, Oct 17 14:41).
bpy python viaduct.py -- cliffs.json OUTDIR marble.png
Each bridge in cliffs.json becomes one GLB: a two-tier arcade of tall rose-marble pillars standing in the water,
pointed lancet arches below and paired small arches above, a deck with balustrades, lanterns and crystal-topped
pinnacles over every pillar. Local frame: origin at the bridge's middle on the water (y=0), the deck runs along +X.
Also writes four sea-pillar GLBs (100 m tall at scale 1) and a preview render."""
import bpy, bmesh, sys, json, math, os
from mathutils import Vector
a = sys.argv[sys.argv.index('--') + 1:]
C = json.load(open(a[0])); OUT = a[1]; TEX = a[2]; os.makedirs(OUT, exist_ok=True)
DECK = C.get('deck_y', 110.5)

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

def tiered(b, L, H, width, span, base=-12.0, x0=None, ends=True):
    """a Pont-du-Gard style arcade: stacked tiers of lancet arches, piers widening and deepening towards the foot,
    from base up to the deck at H. Tiers ~150 m tall; the top tier carries paired small arches under the deck."""
    x0 = -L / 2 if x0 is None else x0; n = max(1, round(L / span)); sp = L / n
    tot = H - base; nt = max(1, round(tot / 150)); th = tot / nt; dep0 = width - 2
    for t in range(nt):
        z0, z1 = base + t * th, base + (t + 1) * th; u = (nt - 1 - t) / max(1, nt - 1)        # u = 1 at the foot
        pw = min(sp * 0.16, 4.0 + 0.045 * sp + 6.0 * u); dep = dep0 + 2 + 16 * u
        top_t = t == nt - 1
        for i in range(n + 1):
            x = x0 + i * sp
            b.box('rose', x - pw, x + pw, -dep / 2, dep / 2, z0, z1 - (2 if top_t else 0))
            for s_ in (-1, 1):                                                               # buttress fins up the pier
                b.box('rose', x - pw * 0.45, x + pw * 0.45, s_ * dep / 2, s_ * (dep / 2 + 2.5 + 4 * u), z0, z1 - th * 0.35)
                b.cyl('gold', x, s_ * (dep / 2 + 2.5 + 4 * u), z1 - th * 0.35, z1 - th * 0.35 + 9, 1.9, 0.12, 6)
                b.sphere('glow', x, s_ * (dep / 2 + 2.5 + 4 * u), z1 - th * 0.35 + 10, 1.0)
            if t == 0:
                b.box('base', x - pw * 1.4, x + pw * 1.4, -dep / 2 - 3, dep / 2 + 3, base, base + 18)
                b.box('moss', x - pw * 1.45, x + pw * 1.45, -dep / 2 - 3.1, dep / 2 + 3.1, 0.2, 2.6)
            b.box('marble', x - pw * 1.15, x + pw * 1.15, -dep / 2 - 0.8, dep / 2 + 0.8, z1 - 5, z1 - 1.5)        # string course
            b.box('gold', x - pw * 1.2, x + pw * 1.2, -dep / 2 - 1.0, dep / 2 + 1.0, z1 - 5.6, z1 - 5)
        for i in range(n):
            a0, a1 = x0 + i * sp + pw, x0 + (i + 1) * sp - pw
            wdep = dep0 + 8 * u
            if top_t:
                zs, za = z0 + th * 0.18, z0 + th * 0.62
                b.wall('marble', lancet(a0, a1, zs, za) + [(a1, z1 - th * 0.22), (a0, z1 - th * 0.22)], -wdep / 2, wdep / 2)
                mid = (a0 + a1) / 2; q = 1.8
                for c0, c1 in ((a0, mid - q), (mid + q, a1)):
                    b.wall('rose', lancet(c0, c1, z1 - th * 0.22, z1 - th * 0.08, 6) + [(c1, H - 2), (c0, H - 2)], -wdep / 2 + 0.6, wdep / 2 - 0.6)
                b.box('marble', mid - q, mid + q, -wdep / 2, wdep / 2, z1 - th * 0.22, H - 2)
            else:
                zs, za = z0 + th * 0.10, z1 - th * 0.12
                b.wall('marble', lancet(a0, a1, zs, za) + [(a1, z1), (a0, z1)], -wdep / 2, wdep / 2)
            for s_ in (-1, 1):
                band = lancet(a0 - 1.2, a1 + 1.2, zs, za + 2.0) + lancet(a0, a1, zs, za)[::-1]
                b.wall('gold', band, s_ * wdep / 2, s_ * (wdep / 2 + 0.5))
    # deck slab, cornice, balustrade, lanterns, pinnacles over each pier
    b.box('marble', x0 - (4 if ends else 0), x0 + L + (4 if ends else 0), -width / 2 - 0.6, width / 2 + 0.6, H - 2.2, H - 0.05)
    b.box('gold', x0 - (4 if ends else 0), x0 + L + (4 if ends else 0), -width / 2 - 1.0, width / 2 + 1.0, H - 2.8, H - 2.2)
    for s_ in (-1, 1):
        y = s_ * (width / 2 - 0.3)
        b.box('marble', x0, x0 + L, y - 0.35, y + 0.35, H + 1.0, H + 1.3)
        k = 0; x = x0 + 1.25
        while x <= x0 + L:
            b.box('marble', x - 0.2, x + 0.2, y - 0.2, y + 0.2, H, H + 1.0)
            if k % 12 == 6: b.cyl('base', x, y, H, H + 4.6, 0.16, 0.11, 6); b.sphere('lamp', x, y, H + 4.9, 0.5)
            x += 2.5; k += 1
        for i in range(n + 1):
            x = x0 + i * sp; yy = s_ * (width / 2 + 0.4)
            b.box('marble', x - 1.6, x + 1.6, yy - 1.6, yy + 1.6, H, H + 8); b.cyl('gold', x, yy, H + 8, H + 14, 1.8, 0.15, 8); b.sphere('glow', x, yy, H + 15, 1.0)

def viaduct(B, M, name, L, width):
    H = B.get('deck', DECK); b = Builder()
    tiered(b, L, H, width, span=min(90.0, max(55.0, L / max(1, round(L / 75)))))
    return b.finish(M, name)

def sky_segment(M, name, L, H, width):
    """one repeat of the sky bridge: two great spans, piers from the valley floor (y -40) to the deck at H"""
    b = Builder(); tiered(b, L, H, width, span=L / 2, base=-40.0, ends=False)
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
SK = C.get('sky')
if SK:
    (ax, az), (bx, bz) = SK['bridge']['a'], SK['bridge']['b']; Ls = math.hypot(bx - ax, bz - az); ns = math.ceil(Ls / 240.0); SEG = Ls / ns
    ry = round(math.atan2(-(bz - az), bx - ax), 5)
    reset(); M = mats()
    objs = sky_segment(M, 'SkyBridge_Segment', SEG, SK['deck'], SK['bridge']['width']); export(objs, f'{OUT}/SkyBridge_Segment.glb')
    segs = [dict(m='SkyBridge_Segment', x=round(ax + (bx - ax) * (k + 0.5) / ns, 2), z=round(az + (bz - az) * (k + 0.5) / ns, 2), y=0.0, rotY=ry, scale=1.0) for k in range(ns)]
    json.dump(dict(segment=round(SEG, 3), deck=SK['deck'], length=round(Ls, 1), rotY=ry, items=segs, note=f'{ns} copies of one segment end to end along the line'), open(f'{OUT}/skybridge.json', 'w'), indent=0)
    print('SKY SEGMENTS', ns)
json.dump(index, open(f'{OUT}/viaducts.json', 'w'), indent=1)
print('VIADUCTS', len(index))
