"""Town copies of the house and prop models (Oct 17 dense towns): the same model and texture, collapse-decimated
to a fixed triangle budget with UV seams kept, so a town of 200+ houses stays within a friend's GPU.
bpy python decimate.py -- OUTDIR TARGET_TRIS name=src.glb ...   -> OUTDIR/<name>_town.glb + .json (dims, tris)"""
import bpy, sys, json, os
a = sys.argv[sys.argv.index('--') + 1:]; OUT = a[0]; TGT = int(a[1]); os.makedirs(OUT, exist_ok=True)
for spec in a[2:]:
    name, src = spec.split('=', 1)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=src)
    meshes = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    tris = sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in meshes)
    ratio = min(1.0, TGT / max(tris, 1))
    for o in meshes:
        if ratio < 0.999:
            m = o.modifiers.new('dec', 'DECIMATE'); m.decimate_type = 'COLLAPSE'; m.ratio = ratio; m.use_collapse_triangulate = True
            m.delimit = {'UV', 'SEAM'}
    bpy.context.view_layer.update()
    dg = bpy.context.evaluated_depsgraph_get()
    out_tris = sum(len(o.evaluated_get(dg).data.loop_triangles) for o in meshes) if meshes else 0
    for o in bpy.data.objects: o.select_set(o.type == 'MESH')
    bpy.ops.export_scene.gltf(filepath=f'{OUT}/{name}_town.glb', export_format='GLB', use_selection=True, export_apply=True, export_yup=True, export_image_format='JPEG')
    print('DEC', name, tris, '->', out_tris)
