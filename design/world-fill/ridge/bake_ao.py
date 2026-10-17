"""Bake ambient occlusion for a terrain heightfield in Cycles (the light that reaches each spot from the open sky).
bpy python -- HEIGHT.npz WIDTH_M MESH_N OUT_RES DIST_M SAMPLES OUT.png [MODELS.json]
MODELS.json (optional): list of [glb, x, y, z, rotY, scale] in the same frame (x east, z south, origin at the grid centre),
so big buildings darken the ground under and around them."""
import bpy, sys, json, math, numpy as np
a = sys.argv[sys.argv.index('--') + 1:]
src, W, n, res, dist, spp, out = a[0], float(a[1]), int(a[2]), int(a[3]), float(a[4]), int(a[5]), a[6]
models = json.load(open(a[7])) if len(a) > 7 else []
h = np.load(src)['h'].astype(np.float32)
# resample to the mesh grid
from PIL import Image
hs = np.asarray(Image.fromarray(h, mode='F').resize((n, n), Image.BILINEAR))
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
bpy.ops.mesh.primitive_grid_add(x_subdivisions=n - 1, y_subdivisions=n - 1, size=W * (n - 1) / n, calc_uvs=True)
g = bpy.context.object; me = g.data
co = np.zeros(len(me.vertices) * 3); me.vertices.foreach_get('co', co); co = co.reshape(-1, 3)
ii = np.clip(np.rint((W / 2 - W / (2 * n) - co[:, 1]) / (W / n)).astype(int), 0, n - 1)
jj = np.clip(np.rint((co[:, 0] + W / 2 - W / (2 * n)) / (W / n)).astype(int), 0, n - 1)
co[:, 2] = np.maximum(hs[ii, jj], -40); me.vertices.foreach_set('co', co.ravel()); me.update()
img = bpy.data.images.new('ao', res, res, float_buffer=True)
m = bpy.data.materials.new('t'); m.use_nodes = True; tn = m.node_tree.nodes.new('ShaderNodeTexImage'); tn.image = img
m.node_tree.nodes.active = tn; g.data.materials.append(m)
cache = {}
for gl, x, y, z, rot, s in models:
    if gl not in cache:
        before = set(bpy.data.objects)
        try: bpy.ops.import_scene.gltf(filepath=gl)
        except Exception: cache[gl] = None; continue
        ms = [o for o in set(bpy.data.objects) - before if o.type == 'MESH']
        if not ms: cache[gl] = None; continue
        for o in bpy.data.objects: o.select_set(o in ms)
        bpy.context.view_layer.objects.active = ms[0]
        if len(ms) > 1: bpy.ops.object.join()
        src = bpy.context.view_layer.objects.active; src.parent = None
        bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
        for o in list(set(bpy.data.objects) - before):
            if o != src: bpy.data.objects.remove(o)
        cache[gl] = src; src.hide_render = True
    src = cache[gl]
    if src is None: continue
    o = bpy.data.objects.new('i', src.data); sc.collection.objects.link(o)
    o.location = (x, -z, y); o.rotation_euler = (0, 0, rot); o.scale = (s, s, s)
sc.render.engine = 'CYCLES'; sc.cycles.samples = spp; sc.cycles.device = 'CPU'
sc.world = bpy.data.worlds.new('W'); sc.world.light_settings.distance = dist
for o in sc.objects: o.select_set(o == g)
bpy.context.view_layer.objects.active = g
bpy.ops.object.bake(type='AO', margin=2)
px = np.array(img.pixels[:]).reshape(res, res, 4)[::-1, :, 0]     # image rows bottom-up -> top-down (north at the top)
Image.fromarray((np.clip(px, 0, 1) * 65535).astype(np.uint16)).save(out)
print('BAKED', out, float(px.mean()))
