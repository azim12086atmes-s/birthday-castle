import bpy, sys, os, glob, json, time
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
a = sys.argv[sys.argv.index('--') + 1:]; SRC, n, OUT, TRIS = a[0], a[1], a[2], int(a[3])
t0 = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
fbx = [f for f in glob.glob(f'{SRC}/*.fbx')][0]
bpy.ops.import_scene.fbx(filepath=fbx)
ms = [o for o in bpy.data.objects if o.type == 'MESH']
for o in bpy.data.objects: o.select_set(o in ms)
bpy.context.view_layer.objects.active = ms[0]
if len(ms) > 1: bpy.ops.object.join()
ob = bpy.context.view_layer.objects.active; ob.parent = None
for o in list(bpy.data.objects):
    if o != ob: bpy.data.objects.remove(o)
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
t_in = sum(len(p.vertices) - 2 for p in ob.data.polygons)
if t_in > TRIS:
    md = ob.modifiers.new('d', 'DECIMATE'); md.ratio = TRIS / t_in; md.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier='d')
t_out = sum(len(p.vertices) - 2 for p in ob.data.polygons)
# base the model at the origin, y-up export handles axes
import mathutils
bb = [mathutils.Vector(c) for c in ob.bound_box]
mn = mathutils.Vector([min(v[i] for v in bb) for i in range(3)]); mx = mathutils.Vector([max(v[i] for v in bb) for i in range(3)])
ob.location = (-(mn.x + mx.x) / 2, -(mn.y + mx.y) / 2, -mn.z); bpy.ops.object.transform_apply(location=True)
tex = (glob.glob(f'{SRC}/*_texture.png') or glob.glob(f'{SRC}/*.png') or glob.glob(f'{SRC}/*.jpg'))
m = bpy.data.materials.new(n); m.use_nodes = True; bs = m.node_tree.nodes['Principled BSDF']; bs.inputs['Roughness'].default_value = 0.75
if tex:
    im = Image.open(tex[0]).convert('RGB')
    if im.size[0] > 2048: im = im.resize((2048, 2048), Image.LANCZOS)
    jp = f'{OUT}/{n}_tex.jpg'; im.save(jp, quality=86)
    img = bpy.data.images.load(jp); ti = m.node_tree.nodes.new('ShaderNodeTexImage'); ti.image = img
    m.node_tree.links.new(ti.outputs[0], bs.inputs['Base Color'])
ob.data.materials.clear(); ob.data.materials.append(m); ob.name = n
bpy.ops.export_scene.gltf(filepath=f'{OUT}/{n}.glb', export_format='GLB', export_image_format='JPEG', export_yup=True, use_selection=False, export_apply=True)
if tex: os.remove(jp)
dims = [round(x, 4) for x in (mx - mn)]
json.dump(dict(name=n, tris_in=t_in, tris=t_out, dims=dims, tex=bool(tex)), open(f'{OUT}/{n}.json', 'w'))
print('PREP', n, t_in, '->', t_out, round(time.time() - t0), 's', flush=True)
