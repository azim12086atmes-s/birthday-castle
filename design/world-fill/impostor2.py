"""Far-view picture cards for the layout GLBs: 8 views around each model (every 45 deg, 8 deg above the horizon),
transparent background, soft even light so the game can tint them for any hour. bpy python -- OUTDIR GLB [GLB ...]
Writes OUTDIR/<model>/v0..v7.png and OUTDIR/<model>/card.json (square frame size and where the base sits, in GLB units)."""
import bpy, sys, os, json, math
from mathutils import Vector
args = sys.argv[sys.argv.index('--') + 1:]
out, glbs = args[0], args[1:]
RES = 256

def setup():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.samples = 8; sc.cycles.use_denoising = True
    sc.render.resolution_x = sc.render.resolution_y = RES; sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'Standard'
    w = bpy.data.worlds.new('W'); sc.world = w; w.use_nodes = True
    w.node_tree.nodes['Background'].inputs['Color'].default_value = (0.85, 0.88, 0.95, 1)
    w.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.9
    sun = bpy.data.objects.new('sun', bpy.data.lights.new('sun', 'SUN')); sun.data.energy = 2.2; sun.data.angle = math.radians(20)
    sun.rotation_euler = (math.radians(40), 0, math.radians(30)); sc.collection.objects.link(sun)
    cam = bpy.data.objects.new('cam', bpy.data.cameras.new('cam')); cam.data.type = 'ORTHO'; cam.data.clip_end = 1e5
    sc.collection.objects.link(cam); sc.camera = cam
    return sc, cam, sun

for g in glbs:
    name = os.path.splitext(os.path.basename(g))[0]
    od = f'{out}/{name}'
    if os.path.exists(f'{od}/card.json'): continue
    os.makedirs(od, exist_ok=True)
    sc, cam, sun = setup()
    bpy.ops.import_scene.gltf(filepath=g)
    obs = [o for o in sc.objects if o.type == 'MESH']
    pts = [o.matrix_world @ Vector(c) for o in obs for c in o.bound_box]
    xs, ys, zs = [p.x for p in pts], [p.y for p in pts], [p.z for p in pts]
    cx, cy = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2
    z0, z1 = min(zs), max(zs); h = z1 - z0
    r = max(math.hypot(p.x - cx, p.y - cy) for p in pts)
    size = max(2 * r, h) * 1.04
    cam.data.ortho_scale = size
    centre = Vector((cx, cy, z0 + size / 2 - 0.02 * size))
    el = math.radians(8)
    for k in range(8):
        az = math.radians(45 * k)              # three.js: camera sits at (sin az, cos az) in (x, z) from the model; Blender y = -three.js z
        d = Vector((math.sin(az) * math.cos(el), -math.cos(az) * math.cos(el), math.sin(el)))
        cam.location = centre + d * (size * 3)
        cam.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
        sun.rotation_euler = (math.radians(40), 0, az + math.radians(35))   # light follows the view: every card is lit from the front-left
        sc.render.filepath = f'{od}/v{k}.png'
        bpy.ops.render.render(write_still=True)
    base_v = (centre.z - z0) / size            # base height below the frame centre, as a fraction of the frame
    json.dump(dict(model=name, frame=size, base_from_centre=base_v, height=h, radius=r,
                   views='three.js model space: view k is seen from direction (x, z) = (sin 45k, cos 45k); pick k = round(atan2(dx, dz) / 45 deg) mod 8 with (dx, dz) the camera offset in the model frame', elevation_deg=8),
              open(f'{od}/card.json', 'w'), indent=1)
    print('done', name, flush=True)
