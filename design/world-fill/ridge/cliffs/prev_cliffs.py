"""Preview of the palace cliffs: terrain window + viaducts + sea pillars, Cycles, two views."""
import bpy, sys, json, math, numpy as np
from mathutils import Vector
R = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/ridge/'
MAPW, CX, CZ = 20691.0, -709.5, 2260.5; N = 2048; cs = MAPW / N
h = np.load(R + 'out/inner.npz')['h'].astype(np.float32)
c = CX - MAPW / 2 + (np.arange(N) + 0.5) * cs; r = CZ - MAPW / 2 + (np.arange(N) + 0.5) * cs
j0, j1 = np.searchsorted(c, -4300), np.searchsorted(c, 4300); i0, i1 = np.searchsorted(r, -4300), np.searchsorted(r, 4700)
w = h[i0:i1, j0:j1]; xs = c[j0:j1]; zs = r[i0:i1]
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene
ny, nx = w.shape
verts = [(float(xs[j]), float(-zs[i]), float(max(w[i, j], -30))) for i in range(ny) for j in range(nx)]
faces = [(i * nx + j, i * nx + j + 1, (i + 1) * nx + j + 1, (i + 1) * nx + j) for i in range(ny - 1) for j in range(nx - 1)]
me = bpy.data.meshes.new('t'); me.from_pydata(verts, [], faces); me.update()
for p in me.polygons: p.use_smooth = True
t = bpy.data.objects.new('t', me); sc.collection.objects.link(t)
m = bpy.data.materials.new('land'); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
geo = nt.nodes.new('ShaderNodeNewGeometry'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(geo.outputs['Normal'], sep.inputs[0])
ramp = nt.nodes.new('ShaderNodeValToRGB'); nt.links.new(sep.outputs['Z'], ramp.inputs[0])
ramp.color_ramp.elements[0].position = 0.55; ramp.color_ramp.elements[0].color = (0.62, 0.52, 0.50, 1)
ramp.color_ramp.elements[1].position = 0.8; ramp.color_ramp.elements[1].color = (0.30, 0.58, 0.24, 1)
nt.links.new(ramp.outputs['Color'], b.inputs['Base Color']); b.inputs['Roughness'].default_value = 0.9
me.materials.append(m)
bpy.ops.mesh.primitive_plane_add(size=9000, location=(0, -200, 0.0)); wat = bpy.context.object
wm = bpy.data.materials.new('water'); wm.use_nodes = True; wb = wm.node_tree.nodes['Principled BSDF']
wb.inputs['Base Color'].default_value = (0.05, 0.35, 0.5, 1); wb.inputs['Roughness'].default_value = 0.08; wat.data.materials.append(wm)
def place(path, x, y, z, rot, s):
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=path)
    for o in set(bpy.data.objects) - before:
        if o.parent is None:
            o.location = (x, -z, y); o.rotation_euler = (0, 0, rot); o.scale = (s, s, s)
V = json.load(open(R + 'out/viaducts/viaducts.json'))
for nm, v in V.items(): place(R + f'out/viaducts/{nm}.glb', v['x'], v['y'], v['z'], v['rotY'], 1)
for p in json.load(open(R + 'out/viaducts/pillars.json')): place(R + f'out/viaducts/{p["m"]}.glb', p['x'], p['y'], p['z'], p['rotY'], p['scale'])
# palace stand-in block so the scale reads
bpy.ops.mesh.primitive_cube_add(location=(60, 300, 110 + 140)); pb = bpy.context.object; pb.scale = (700, 450, 140)
pm = bpy.data.materials.new('pal'); pm.use_nodes = True; pm.node_tree.nodes['Principled BSDF'].inputs['Base Color'].default_value = (0.95, 0.75, 0.8, 1); pb.data.materials.append(pm)
sc.world = bpy.data.worlds.new('w'); sc.world.use_nodes = True
sky = sc.world.node_tree.nodes.new('ShaderNodeTexSky'); sc.world.node_tree.links.new(sky.outputs[0], sc.world.node_tree.nodes['Background'].inputs[0]); sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0.25
sc.view_settings.view_transform = 'AgX'; sc.view_settings.exposure = -1.0
sc.render.engine = 'CYCLES'; sc.cycles.samples = 24; sc.cycles.use_denoising = True; sc.render.resolution_x, sc.render.resolution_y = 1280, 720
sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.data.energy = 4; sun.rotation_euler = (math.radians(50), 0, math.radians(35)); sc.collection.objects.link(sun)
cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); sc.collection.objects.link(cam); sc.camera = cam; cam.data.clip_end = 30000
def shot(pos, look, fn, lens=30):
    cam.location = Vector((pos[0], -pos[2], pos[1])); d = Vector((look[0], -look[2], look[1])) - cam.location
    cam.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); cam.data.lens = lens
    sc.render.filepath = fn; bpy.ops.render.render(write_still=True)
shot((3600, 1100, 4200), (0, 60, -200), R + 'out/cliffs-prev-a.png')
shot((-2300, 240, -2600), (-600, 130, -1300), R + 'out/cliffs-prev-b.png', 24)
print('PREVIEW done')
