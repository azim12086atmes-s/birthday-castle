"""Terrain-only oblique views of the crescent (before vs after the geology pass). bpy python -- DIR OUT"""
import bpy, numpy as np, sys, math
d, out = sys.argv[-2], sys.argv[-1]
N = 2048; mpp = 20691 / N
h = np.load(f'{d}/terrain.npz')['h']; c = np.load(f'{d}/colour.npy')
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
def grid(r0, c0, sz, step, name):
    hh = h[r0:r0 + sz:step, c0:c0 + sz:step]; cc = c[r0:r0 + sz:step, c0:c0 + sz:step]
    n = hh.shape[0]; s = mpp * step
    ys, xs = np.mgrid[0:n, 0:n]
    V = np.stack([xs * s, -ys * s, np.maximum(hh, -30)], -1).reshape(-1, 3)
    q = (ys[:-1, :-1] * n + xs[:-1, :-1]).ravel()
    F = np.stack([q, q + 1, q + n + 1, q + n], -1)
    me = bpy.data.meshes.new(name); me.vertices.add(len(V)); me.vertices.foreach_set('co', V.ravel())
    me.loops.add(F.size); me.loops.foreach_set('vertex_index', F.ravel())
    me.polygons.add(len(F)); me.polygons.foreach_set('loop_start', np.arange(0, F.size, 4)); me.polygons.foreach_set('loop_total', np.full(len(F), 4))
    me.update()
    col = me.color_attributes.new('col', 'FLOAT_COLOR', 'POINT')
    rgba = np.concatenate([cc.reshape(-1, 3) ** 2.2, np.ones((n * n, 1))], 1)
    col.data.foreach_set('color', rgba.astype(np.float32).ravel())
    me.polygons.foreach_set('use_smooth', np.ones(len(F), bool))
    ob = bpy.data.objects.new(name, me); sc.collection.objects.link(ob)
    m = bpy.data.materials.new('t'); m.use_nodes = True
    nt = m.node_tree; a = nt.nodes.new('ShaderNodeAttribute'); a.attribute_name = 'col'
    bs = nt.nodes['Principled BSDF']; nt.links.new(a.outputs['Color'], bs.inputs['Base Color']); bs.inputs['Roughness'].default_value = 0.9
    me.materials.append(m)
    # sea plane
    bpy.ops.mesh.primitive_plane_add(size=n * s * 1.5, location=(n * s / 2, -n * s / 2, 0))
    w = bpy.context.object; wm = bpy.data.materials.new('w'); wm.use_nodes = True
    wb = wm.node_tree.nodes['Principled BSDF']; wb.inputs['Base Color'].default_value = (0.02, 0.10, 0.16, 1)
    wb.inputs['Roughness'].default_value = 0.08; wb.inputs['Alpha'].default_value = 0.75; w.data.materials.append(wm)
    return n * s
# south-east crescent wall and the gate canyon
span = grid(1480, 950, 560, 1, 'T')
world = bpy.data.worlds.new('W'); sc.world = world; world.use_nodes = True
bg = world.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (0.45, 0.6, 0.85, 1); bg.inputs['Strength'].default_value = 0.6
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.data.energy = 4.0; sun.data.angle = 0.05
sun.rotation_euler = (math.radians(58), 0, math.radians(-130)); sc.collection.objects.link(sun)
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); cam.data.lens = 28; cam.data.clip_end = 60000
sc.collection.objects.link(cam); sc.camera = cam
views = [((span * 0.15, -span * 1.15, 1300), (span * 0.55, -span * 0.45, 300)),
         ((span * 1.05, -span * 0.98, 900), (span * 0.35, -span * 0.35, 400))]
sc.render.engine = 'CYCLES'; sc.cycles.samples = 24; sc.cycles.use_denoising = True
sc.render.resolution_x, sc.render.resolution_y = 960, 540
sc.view_settings.view_transform = 'AgX'; sc.view_settings.exposure = -0.4
from mathutils import Vector
for k, (p, t) in enumerate(views):
    cam.location = p; cam.rotation_euler = (Vector(t) - Vector(p)).to_track_quat('-Z', 'Y').to_euler()
    sc.render.filepath = f'{out}-{k}.jpg'; sc.render.image_settings.file_format = 'JPEG'
    bpy.ops.render.render(write_still=True)
