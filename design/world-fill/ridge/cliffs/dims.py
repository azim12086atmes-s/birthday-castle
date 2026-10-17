import bpy, sys, json, glob, os
d = sys.argv[sys.argv.index('--') + 1]
for f in sorted(glob.glob(f'{d}/*.glb')):
    bpy.ops.wm.read_factory_settings(use_empty=True); bpy.ops.import_scene.gltf(filepath=f)
    import mathutils
    pts = [o.matrix_world @ mathutils.Vector(c) for o in bpy.data.objects if o.type == 'MESH' for c in o.bound_box]
    tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in bpy.data.objects if o.type == 'MESH')
    mn = [min(p[i] for p in pts) for i in range(3)]; mx = [max(p[i] for p in pts) for i in range(3)]
    n = os.path.basename(f)[:-4]
    # Blender z-up: dims as [x, y(across), z(up)] like prep2
    json.dump(dict(name=n, dims=[round(mx[i] - mn[i], 3) for i in range(3)], tris=tris, source='ridge/viaduct.py (Oct 17 cliffs)'), open(f'{d}/{n}.json', 'w'))
    print('DIM', n, [round(mx[i] - mn[i], 1) for i in range(3)], tris)
