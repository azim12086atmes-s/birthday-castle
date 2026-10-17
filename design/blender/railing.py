import bpy, bmesh, math, os, sys
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else HERE
SAMPLES = int(sys.argv[sys.argv.index('--samples') + 1]) if '--samples' in sys.argv else 48

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# ---------------- materials ----------------
def mat_principled(name, color, rough=0.12, coat=1.0, metal=0.0, emit=None, estr=0.0, transmission=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Coat Roughness'].default_value = 0.05
    if transmission:
        b.inputs['Transmission Weight'].default_value = transmission
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = estr
    return m

def srgb(h):
    h = h.lstrip('#'); c = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c)

WHITE = mat_principled('GlossyWhite', srgb('#f7f2f4'), rough=0.14, coat=1.0)
GOLD = mat_principled('Gold', srgb('#e8b85a'), rough=0.25, coat=0.3, metal=1.0)
CRYSTAL = mat_principled('Crystal', srgb('#fff0e0'), rough=0.02, coat=1.0, emit=srgb('#ffd6a0'), estr=18.0)

# deck material: glossy white + fractal gold lines + neon ripple rings (emissive, masked by fractal)
def deck_material():
    m = bpy.data.materials.new('DeckFractalRipple'); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    b = N['Principled BSDF']
    b.inputs['Base Color'].default_value = (*srgb('#f7f2f4'), 1)
    b.inputs['Roughness'].default_value = 0.28
    b.inputs['Coat Weight'].default_value = 1.0
    tc = N.new('ShaderNodeTexCoord')
    mp = N.new('ShaderNodeMapping'); mp.inputs['Scale'].default_value = (1/7, 1/7, 1)  # 7 m tile
    L.new(tc.outputs['Object'], mp.inputs['Vector'])
    img = N.new('ShaderNodeTexImage')
    img.image = bpy.data.images.load(os.path.join(HERE, 'fractal_mask.png'))
    img.image.colorspace_settings.name = 'Non-Color'
    L.new(mp.outputs['Vector'], img.inputs['Vector'])
    # bump from mask (cut lines)
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.35; bump.invert = True
    L.new(img.outputs['Color'], bump.inputs['Height'])
    L.new(bump.outputs['Normal'], b.inputs['Normal'])
    # ripple rings: several steps, each a ring at radius r_i, colour c_i
    steps = [((-0.5, -13.0), 2.0, '#39ff88'), ((0.6, -10.5), 3.6, '#3ab0ff'), ((-0.4, -7.5), 1.3, '#b45cff'),
             ((0.5, -4.5), 2.8, '#ffe14a'), ((-0.6, -1.0), 1.9, '#ff4fb8')]
    acc = None
    for (sx, sy), r, col in steps:
        sep = N.new('ShaderNodeSeparateXYZ'); L.new(tc.outputs['Object'], sep.inputs['Vector'])
        dx = N.new('ShaderNodeMath'); dx.operation = 'SUBTRACT'; dx.inputs[1].default_value = sx; L.new(sep.outputs['X'], dx.inputs[0])
        dy = N.new('ShaderNodeMath'); dy.operation = 'SUBTRACT'; dy.inputs[1].default_value = sy; L.new(sep.outputs['Y'], dy.inputs[0])
        cmb = N.new('ShaderNodeCombineXYZ'); L.new(dx.outputs[0], cmb.inputs['X']); L.new(dy.outputs[0], cmb.inputs['Y'])
        ln = N.new('ShaderNodeVectorMath'); ln.operation = 'LENGTH'; L.new(cmb.outputs[0], ln.inputs[0])
        sub = N.new('ShaderNodeMath'); sub.operation = 'SUBTRACT'; sub.inputs[1].default_value = r; L.new(ln.outputs['Value'], sub.inputs[0])
        ab = N.new('ShaderNodeMath'); ab.operation = 'ABSOLUTE'; L.new(sub.outputs[0], ab.inputs[0])
        ring = N.new('ShaderNodeMapRange'); ring.inputs['From Min'].default_value = 0.7; ring.inputs['From Max'].default_value = 0.0
        L.new(ab.outputs[0], ring.inputs['Value'])
        rgb = N.new('ShaderNodeRGB'); rgb.outputs[0].default_value = (*srgb(col), 1)
        mul = N.new('ShaderNodeVectorMath'); mul.operation = 'SCALE'; L.new(rgb.outputs[0], mul.inputs[0]); L.new(ring.outputs[0], mul.inputs['Scale'])
        if acc is None: acc = mul
        else:
            add = N.new('ShaderNodeVectorMath'); add.operation = 'ADD'; L.new(acc.outputs[0], add.inputs[0]); L.new(mul.outputs[0], add.inputs[1]); acc = add
    # mask by fractal lines (+ a faint fill) and add a soft gold base glow on the lines
    maskmul = N.new('ShaderNodeVectorMath'); maskmul.operation = 'SCALE'
    L.new(acc.outputs[0], maskmul.inputs[0]); L.new(img.outputs['Color'], maskmul.inputs['Scale'])
    gold = N.new('ShaderNodeRGB'); gold.outputs[0].default_value = (*srgb('#f0c060'), 1)
    goldline = N.new('ShaderNodeVectorMath'); goldline.operation = 'SCALE'
    L.new(gold.outputs[0], goldline.inputs[0]); L.new(img.outputs['Color'], goldline.inputs['Scale'])
    gl2 = N.new('ShaderNodeVectorMath'); gl2.operation = 'SCALE'; gl2.inputs['Scale'].default_value = 0.025
    L.new(goldline.outputs[0], gl2.inputs[0])
    tot = N.new('ShaderNodeVectorMath'); tot.operation = 'ADD'
    L.new(maskmul.outputs[0], tot.inputs[0]); L.new(gl2.outputs[0], tot.inputs[1])
    L.new(tot.outputs[0], b.inputs['Emission Color'])
    b.inputs['Emission Strength'].default_value = 16.0
    return m

DECK = deck_material()

def obj_from_bm(name, bm, mat):
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    ob = bpy.data.objects.new(name, me); scene.collection.objects.link(ob)
    ob.data.materials.append(mat)
    return ob

def box(name, size, loc, mat):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts)
    bmesh.ops.translate(bm, vec=Vector(loc), verts=bm.verts)
    return obj_from_bm(name, bm, mat)

def bevel(ob, w=0.012, seg=3):
    md = ob.modifiers.new('bev', 'BEVEL'); md.width = w; md.segments = seg; md.limit_method = 'ANGLE'
    return md

def apply_all(ob):
    bpy.context.view_layer.objects.active = ob
    for md in list(ob.modifiers):
        with bpy.context.temp_override(object=ob, active_object=ob):
            bpy.ops.object.modifier_apply(modifier=md.name)

def prism_from_poly(name, pts2d, depth, y0=-0.2):
    """2D polygon in XZ plane, extruded along Y (thickness)."""
    bm = bmesh.new()
    vs = [bm.verts.new((x, y0, z)) for x, z in pts2d]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    nv = [g for g in ext['geom'] if isinstance(g, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, vec=Vector((0, depth, 0)), verts=nv)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return obj_from_bm(name, bm, WHITE)

def circle_pts(cx, cz, r, n=40):
    return [(cx + r * math.cos(2 * math.pi * i / n), cz + r * math.sin(2 * math.pi * i / n)) for i in range(n)]

def quatrefoil_pts(cx, cz, r, n=120):
    # r(t) = a + b*|cos(2t)| style lobes
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        rr = r * (0.62 + 0.38 * abs(math.cos(2 * t)) ** 0.6)
        pts.append((cx + rr * math.cos(t + math.pi / 4), cz + rr * math.sin(t + math.pi / 4)))
    return pts

def star_pts(cx, cz, r, k=8, inner=0.5):
    return [(cx + (r if i % 2 == 0 else r * inner) * math.cos(math.pi * i / k + math.pi / 2),
             cz + (r if i % 2 == 0 else r * inner) * math.sin(math.pi * i / k + math.pi / 2)) for i in range(2 * k)]

def mouchette_pts(cx, cz, s, ang, n=40):
    # flame/teardrop: point toward ang
    pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        x = s * (math.cos(t) * 0.55)
        z = s * (math.sin(t) * (0.35 + 0.65 * (1 - math.cos(t)) / 2))
        x += s * 0.35 * math.sin(t) ** 2 * (1 if math.sin(t) > 0 else 0.4)
        ca, sa = math.cos(ang), math.sin(ang)
        pts.append((cx + x * ca - z * sa, cz + x * sa + z * ca))
    return pts

# ---------------- railing module (post + pierced tracery panel + rails), 4 m long, x from 0 to 4 ----------------
MOD = []
PANEL_W, PANEL_H, PANEL_T = 3.4, 1.1, 0.12
px0 = 0.3  # panel starts after half post
panel = box('panel', (PANEL_W, PANEL_T, PANEL_H), (px0 + PANEL_W / 2, 0, 0.25 + PANEL_H / 2), WHITE)
cutters = []
bay_w = PANEL_W / 3
for b in range(3):
    cx = px0 + bay_w * (b + 0.5); cz = 0.25 + PANEL_H / 2
    R = 0.44
    if b == 1:
        cutters.append(prism_from_poly('c_star', star_pts(cx, cz, 0.36, 8, 0.55), 0.4))
        cutters.append(prism_from_poly('c_ring', circle_pts(cx, cz, 0.12, 24), 0.4))
    else:
        cutters.append(prism_from_poly('c_qf', quatrefoil_pts(cx, cz, 0.36), 0.4))
    # four corner mouchettes in the bay spandrels
    for sx, sz in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
        mx = cx + sx * bay_w * 0.36; mz = cz + sz * PANEL_H * 0.33
        ang = math.atan2(-sz, -sx)
        cutters.append(prism_from_poly('c_mo', mouchette_pts(mx, mz, 0.13, ang), 0.4))
    # small lancet slits between bays
    if b < 2:
        lx = px0 + bay_w * (b + 1)
        slit = [(lx - 0.035, cz - 0.38), (lx + 0.035, cz - 0.38), (lx + 0.035, cz + 0.3), (lx, cz + 0.4), (lx - 0.035, cz + 0.3)]
        cutters.append(prism_from_poly('c_sl', slit, 0.4))
# join cutters, one exact boolean
bpy.ops.object.select_all(action='DESELECT')
for c in cutters: c.select_set(True)
bpy.context.view_layer.objects.active = cutters[0]
bpy.ops.object.join()
cutter = cutters[0]
bm = bevel(panel, 0.006, 2)
boo = panel.modifiers.new('cut', 'BOOLEAN'); boo.operation = 'DIFFERENCE'; boo.object = cutter; boo.solver = 'EXACT'
panel.modifiers.move(1, 0)
apply_all(panel)
bpy.data.objects.remove(cutter, do_unlink=True)
# raised ring mouldings around each bay roundel (torus, both faces)
for b in range(3):
    cx = px0 + bay_w * (b + 0.5); cz = 0.25 + PANEL_H / 2
    for side in (-1, 1):
        bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.03, major_segments=64, minor_segments=10,
                                         location=(cx, side * PANEL_T / 2, cz), rotation=(math.pi / 2, 0, 0))
        t = bpy.context.active_object; t.data.materials.append(WHITE); MOD.append(t)
        bpy.ops.mesh.primitive_torus_add(major_radius=0.42, minor_radius=0.008, major_segments=64, minor_segments=6,
                                         location=(cx, side * (PANEL_T / 2 + 0.028), cz), rotation=(math.pi / 2, 0, 0))
        g = bpy.context.active_object; g.data.materials.append(GOLD); MOD.append(g)
MOD.append(panel)

# bottom plinth with arcaded openings
plinth = box('plinth', (4.0, 0.3, 0.25), (2.0, 0, 0.125), WHITE)
arc_cut = []
for i in range(16):
    x = 0.25 + i * 0.25
    pts = [(x - 0.07, 0.03), (x + 0.07, 0.03), (x + 0.07, 0.12)] + [(x + 0.07 * math.cos(a), 0.12 + 0.07 * math.sin(a)) for a in [math.pi * k / 10 for k in range(1, 10)]] + [(x - 0.07, 0.12)]
    arc_cut.append(prism_from_poly('ac', pts, 0.6, -0.3))
bpy.ops.object.select_all(action='DESELECT')
for c in arc_cut: c.select_set(True)
bpy.context.view_layer.objects.active = arc_cut[0]; bpy.ops.object.join()
boo = plinth.modifiers.new('cut', 'BOOLEAN'); boo.operation = 'DIFFERENCE'; boo.object = arc_cut[0]; boo.solver = 'EXACT'
bevel(plinth, 0.01, 2); apply_all(plinth); bpy.data.objects.remove(arc_cut[0], do_unlink=True)
MOD.append(plinth)
# bead-and-reel strip on plinth top
for i in range(80):
    x = 0.05 + i * 0.05
    if i % 2 == 0:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.018, segments=10, ring_count=6, location=(x, 0.155, 0.25))
    else:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.01, depth=0.03, vertices=8, location=(x, 0.155, 0.25), rotation=(0, math.pi / 2, 0))
    o = bpy.context.active_object; o.data.materials.append(GOLD); MOD.append(o)

# ogee handrail: profile swept along X
prof = [(-0.15, 0.0), (0.15, 0.0), (0.15, 0.03), (0.12, 0.05), (0.11, 0.09), (0.06, 0.13), (0.0, 0.14), (-0.06, 0.13), (-0.11, 0.09), (-0.12, 0.05), (-0.15, 0.03)]
bmr = bmesh.new()
v0 = [bmr.verts.new((0.0, y, 1.35 + z)) for y, z in prof]
f = bmr.faces.new(v0)
ext = bmesh.ops.extrude_face_region(bmr, geom=[f])
bmesh.ops.translate(bmr, vec=Vector((4.0, 0, 0)), verts=[g for g in ext['geom'] if isinstance(g, bmesh.types.BMVert)])
bmesh.ops.recalc_face_normals(bmr, faces=bmr.faces)
rail = obj_from_bm('handrail', bmr, WHITE); bevel(rail, 0.005, 2); MOD.append(rail)
bpy.ops.mesh.primitive_cylinder_add(radius=0.012, depth=4.0, vertices=12, location=(2.0, 0, 1.49), rotation=(0, math.pi / 2, 0))
g = bpy.context.active_object; g.data.materials.append(GOLD); MOD.append(g)

# post at x=0 (shared between modules): shaft, sunk rosette panel, acanthus-like capital, crystal lantern
post = box('post', (0.6, 0.6, 1.35), (0.0, 0, 0.675), WHITE)
pc = []
for side in (-1, 1):
    pc.append(box('sunk', (0.36, 0.1, 0.8), (0.0, side * 0.3, 0.7), WHITE))
bpy.ops.object.select_all(action='DESELECT')
for c in pc: c.select_set(True)
bpy.context.view_layer.objects.active = pc[0]; bpy.ops.object.join()
boo = post.modifiers.new('cut', 'BOOLEAN'); boo.operation = 'DIFFERENCE'; boo.object = pc[0]; boo.solver = 'EXACT'
bevel(post, 0.015, 3); apply_all(post); bpy.data.objects.remove(pc[0], do_unlink=True)
MOD.append(post)
# rosette in the sunk panels: 12 petals + gold boss
for side in (-1, 1):
    for k in range(12):
        a = 2 * math.pi * k / 12
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.06, segments=12, ring_count=8,
                                             location=(0.11 * math.cos(a), side * 0.27, 0.7 + 0.11 * math.sin(a)))
        p = bpy.context.active_object; p.scale = (1.0, 0.35, 0.45); p.rotation_euler = (0, -a, 0)
        p.data.materials.append(WHITE); MOD.append(p)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.045, segments=16, ring_count=8, location=(0, side * 0.27, 0.7))
    o = bpy.context.active_object; o.data.materials.append(GOLD); MOD.append(o)
# capital: flared ring of leaves
bpy.ops.mesh.primitive_cylinder_add(radius=0.34, depth=0.08, vertices=32, location=(0, 0, 1.39)); o = bpy.context.active_object; o.data.materials.append(WHITE); MOD.append(o)
for k in range(16):
    a = 2 * math.pi * k / 16
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, segments=12, ring_count=8, location=(0.3 * math.cos(a), 0.3 * math.sin(a), 1.47))
    leaf = bpy.context.active_object; leaf.scale = (0.45, 0.25, 0.9); leaf.rotation_euler = (0, 0.5, a)
    leaf.data.materials.append(WHITE); MOD.append(leaf)
bpy.ops.mesh.primitive_cylinder_add(radius=0.36, depth=0.06, vertices=32, location=(0, 0, 1.58)); o = bpy.context.active_object; o.data.materials.append(GOLD); MOD.append(o)
# lantern stem + crystal
bpy.ops.mesh.primitive_cylinder_add(radius=0.03, depth=0.35, vertices=12, location=(0, 0, 1.78)); o = bpy.context.active_object; o.data.materials.append(GOLD); MOD.append(o)
bpy.ops.mesh.primitive_ico_sphere_add(radius=0.16, subdivisions=1, location=(0, 0, 2.05)); c = bpy.context.active_object
c.scale = (0.8, 0.8, 1.5); c.data.materials.append(CRYSTAL); MOD.append(c)
bpy.ops.mesh.primitive_cone_add(radius1=0.14, radius2=0.0, depth=0.18, vertices=8, location=(0, 0, 2.36)); o = bpy.context.active_object; o.data.materials.append(GOLD); MOD.append(o)

# join module into one object, export glb
bpy.ops.object.select_all(action='DESELECT')
for o in MOD: o.select_set(True)
bpy.context.view_layer.objects.active = post
bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
bpy.ops.object.join()
module = bpy.context.active_object; module.name = 'BridgeRailingModule'
bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35))
tris = sum(len(p.vertices) - 2 for p in module.data.polygons)
print('MODULE_TRIS', tris)
os.makedirs(OUT, exist_ok=True)
bpy.ops.object.select_all(action='DESELECT'); module.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, 'bridge_railing_module.glb'), use_selection=True, export_format='GLB')

# ---------------- scene for the render ----------------
# repeat modules along both sides of a deck strip (bridge runs along +Y in the scene; rotate module)
module.rotation_euler = (0, 0, math.pi / 2)
module.location = (3.4, -4, 0)
inst = []
for side_x, rot in ((3.4, math.pi / 2), (-3.4, -math.pi / 2)):
    for i in range(8):
        o = module.copy(); o.data = module.data; scene.collection.objects.link(o)
        o.rotation_euler = (0, 0, rot)
        o.location = (side_x, -4 + i * 4 if rot > 0 else -4 + (i + 1) * 4, 0)
        inst.append(o)
bpy.data.objects.remove(module, do_unlink=True)
for o in inst:
    bpy.ops.object.light_add(type='POINT', location=(o.location.x, o.location.y, 2.05))
    L_ = bpy.context.active_object; L_.data.energy = 120; L_.data.color = srgb('#ffd6a0'); L_.data.shadow_soft_size = 0.15
# deck
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 12, 0.005)); deck = bpy.context.active_object
deck.scale = (7.0, 34, 1)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
deck.data.materials.append(DECK)
# deck edge slab
box('deckslab', (7.4, 34, 0.6), (0, 12, -0.3), WHITE)
# lake far below
water = bpy.data.materials.new('Lake'); water.use_nodes = True
wb = water.node_tree.nodes['Principled BSDF']; wb.inputs['Base Color'].default_value = (*srgb('#141a3a'), 1)
wb.inputs['Roughness'].default_value = 0.03; wb.inputs['Coat Weight'].default_value = 0.0
bpy.ops.mesh.primitive_plane_add(size=600, location=(0, 0, -12)); lk = bpy.context.active_object; lk.data.materials.append(water)
# ripple rings on the lake (thin emissive tori) under the railing
for (x, y, r, col) in [(-9, 6, 3.0, '#b45cff'), (-12, 14, 5.0, '#39ff88'), (9, 10, 4.0, '#ff4fb8')]:
    m = mat_principled('ring' + col, (0, 0, 0), emit=srgb(col), estr=6.0)
    bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=0.06, location=(x, y, -11.95)); t = bpy.context.active_object
    t.scale = (1, 1, 0.2); t.data.materials.append(m)
# far shore glow (castle lights on the horizon) so the lake reads through the railing
hz = mat_principled('Horizon', (0,0,0), emit=srgb('#ff8fc0'), estr=2.5)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 500, 0)); h_ = bpy.context.active_object
h_.scale = (900, 1, 22); h_.rotation_euler = (math.pi/2, 0, 0); h_.data.materials.append(hz)
# moon
moon = mat_principled('Moon', srgb('#fff6f0'), emit=srgb('#fff6f0'), estr=12.0)
bpy.ops.mesh.primitive_uv_sphere_add(radius=14, location=(-60, 400, 70)); bpy.context.active_object.data.materials.append(moon)
# world: night sky gradient
world = bpy.data.worlds.new('Night'); scene.world = world; world.use_nodes = True
bg = world.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (*srgb('#1a1640'), 1); bg.inputs['Strength'].default_value = 1.4
# moon light + warm fill
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(62), 0, math.radians(200))); sun = bpy.context.active_object
sun.data.energy = 2.2; sun.data.color = srgb('#dcd8ff'); sun.data.angle = math.radians(1.5)
bpy.ops.object.light_add(type='AREA', location=(0, 30, 8)); ar = bpy.context.active_object
ar.data.energy = 2500; ar.data.size = 30; ar.data.color = srgb('#ffc8de'); ar.rotation_euler = (math.radians(55), 0, math.radians(180))
# camera: low, looking along the bridge, railing in front-left
bpy.ops.object.camera_add(location=(-2.2, -3.0, 1.7))
cam = bpy.context.active_object; scene.camera = cam; cam.data.lens = 24
bpy.ops.object.empty_add(location=(3.0, 6.0, 0.9)); tgt = bpy.context.active_object
tc_ = cam.constraints.new('TRACK_TO'); tc_.target = tgt; tc_.track_axis = 'TRACK_NEGATIVE_Z'; tc_.up_axis = 'UP_Y'
# render settings
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.render.resolution_x = 1600; scene.render.resolution_y = 900
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.render.filepath = os.path.join(OUT, 'bridge_railing_render.png')
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'bridge_railing.blend'))
bpy.ops.render.render(write_still=True)
print('DONE')
