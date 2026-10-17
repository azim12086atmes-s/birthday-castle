"""cliffwall3: sharper sky-palace walls (cornice, undercut, triangular flutes, toothed crest), from cliffwall2.
Sheer rock walls for the palace cliffs, so the faces read vertical in the game (its terrain grid smooths them).
bpy python cliffwall.py -- cliffs.json OUTDIR rock.png
One GLB per cliff: the palace mesa (5 runs of constant top), each satellite plateau and each sea stack. A wall hangs
from a moss lip just inside the edge and leans out to the water like a Zhangjiajie pillar: fluted, layered in warm
strata, with glowing crystal veins. Local origin at the cliff's centre on the water (y=0); heights are absolute."""
import bpy, bmesh, sys, json, math, os, random
import numpy as np
a = sys.argv[sys.argv.index('--') + 1:]
C = json.load(open(a[0])); OUT = a[1]; TEX = a[2]; os.makedirs(OUT, exist_ok=True)
BOT = -12.0
LIP_IN = 16.0

def noise1(seed):
    g = np.random.default_rng(seed).uniform(-1, 1, 4096)
    def f(x):
        x = np.asarray(x, dtype=float) % 4095; i = np.floor(x).astype(int); t = x - i; t = t * t * (3 - 2 * t)
        return g[i] * (1 - t) + g[i + 1] * t
    return f
N1, N2, N3 = noise1(1), noise1(2), noise1(3)

def mats():
    def m(name, col, rough=0.8, emit=None, tex=False):
        mt = bpy.data.materials.new(name); mt.use_nodes = True; b = mt.node_tree.nodes['Principled BSDF']
        b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough
        if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = 5.0
        if tex:
            t = mt.node_tree.nodes.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(TEX); mt.node_tree.links.new(t.outputs['Color'], b.inputs['Base Color'])
            tn = mt.node_tree.nodes.new('ShaderNodeTexImage'); tn.image = bpy.data.images.load(TEX.replace('.png', '-n.png')); tn.image.colorspace_settings.name = 'Non-Color'
            nm = mt.node_tree.nodes.new('ShaderNodeNormalMap'); mt.node_tree.links.new(tn.outputs['Color'], nm.inputs['Color']); mt.node_tree.links.new(nm.outputs['Normal'], b.inputs['Normal'])
        return mt
    return dict(rock=m('rock', (1, 1, 1), tex=True), moss=m('moss', (0.30, 0.56, 0.30), 0.9), glow=m('glow', (0.5, 0.95, 1.0), 0.3, (0.40, 0.92, 1.0)),
                glow2=m('glow2', (0.8, 0.6, 1.0), 0.3, (0.72, 0.48, 1.0)))

def sstep_(x, a, b):
    t = min(1.0, max(0.0, (x - a) / (b - a))); return t * t * (3 - 2 * t)

def wall(pts, nrm, top, closed, seed, foot=None):
    """pts: (n,2) outline in world x,z; nrm: (n,2) outward unit normals; foot: per-vertex ground at the wall's foot
    (None: the sea floor). Sky palace version (Oct 17 19:17 "real curved sharp look"): a jutting cornice under a toothed
    crest, an undercut below it, then the face sweeps out to the foot; deep triangular flutes and sharp strata steps.
    Returns rock verts/faces/uvs, moss lip, crystals"""
    n = len(pts); bot = np.full(n, BOT) if foot is None else np.asarray(foot, float) - 5.0
    top = np.broadcast_to(np.asarray(top, float), (n,))                # constant, or per vertex (the gate massif rim)
    Hv = top + 1.5 - bot; Ht = float(Hv.max())
    rows = max(6, min(36, int(Ht / 9))); s = np.concatenate([[0, 0.012, 0.03], np.linspace(0.06, 1, rows - 2)])
    reach = np.maximum(6.0, 0.16 * Hv) if foot is not None else max(36.0, 58.0 * Ht / 123.0)
    per = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(pts, axis=0).T))])
    ph = per / (30 + 12 * N2(per / 90 + seed * 7)) + 0.6 * N1(per / 140 + seed)
    tri = 2 * np.abs(ph % 1 - 0.5) * 2 - 1                                 # -1..1 triangle wave: sharp ridges and grooves
    amp = np.clip(0.05 * Hv, 2.0, 8.0)
    teeth = np.maximum(0, 2 * np.abs((per / 17 + 0.5 * N3(per / 50 + seed)) % 1 - 0.5) * 2 - 0.35) * 5.0 * (0.4 + 0.6 * (N1(per / 70 + seed * 3) > -0.2))
    V, UV = [], []
    for k in range(len(s)):
        sk = s[k]; z = top + 1.5 - sk * Hv
        if k == 0: z = top + 1.5 + teeth                                   # toothed crest
        cornice = 5.0 * min(1, sk / 0.012) * (1 - sstep_(sk, 0.03, 0.10)) - 3.5 * sstep_(sk, 0.03, 0.10) * (1 - sstep_(sk, 0.14, 0.4))
        off = -3 + cornice + reach * np.clip((sk - 0.1) / 0.9, 0, 1) ** 1.6
        fl = amp * tri * min(1, sk * 10) * (0.6 + 0.4 * sk)
        disp = fl + 1.6 * N1(per / 25 + seed * 50 + np.asarray(z) / 18)
        disp += 1.6 * (np.floor((z + 3 * N3(per / 60)) / 17) % 2) * (sk > 0.12)   # strata ledges
        o = off + disp
        zz = np.broadcast_to(z, (n,))
        for i in range(n):
            zi = float(zz[i]); V.append((pts[i, 0] + nrm[i, 0] * o[i], zi, pts[i, 1] + nrm[i, 1] * o[i]))
            UV.append((per[i] / 30.0, (zi - BOT) / 30.0))
    rows = len(s) - 1
    F = []
    cols = n if closed else n - 1
    for k in range(rows):
        for i in range(cols):
            j = (i + 1) % n
            F.append((k * n + i, k * n + j, (k + 1) * n + j, (k + 1) * n + i))
    # moss lip: from 8 m inside the edge, just over the top, out to the wall's first row
    LV, LF = [], []
    for i in range(n):
        LV.append((pts[i, 0] - nrm[i, 0] * LIP_IN, top[i] + 0.3, pts[i, 1] - nrm[i, 1] * LIP_IN))
        LV.append((pts[i, 0] - nrm[i, 0] * 3.2, top[i] + 1.8, pts[i, 1] - nrm[i, 1] * 3.2))
    for i in range(cols):
        j = (i + 1) % n; LF.append((2 * i, 2 * j, 2 * j + 1, 2 * i + 1))
    # crystal veins on the face
    rnd = random.Random(seed); cry = []
    for i in range(0, n, max(1, int(55 / max(1e-3, per[-1] / max(n - 1, 1))))):
        if rnd.random() < 0.55:
            kk = rnd.randint(4, rows - 1); z = top[i] + 1.5 - s[kk] * float(np.broadcast_to(Hv, (n,))[i]); off = -3 + float(np.broadcast_to(reach, (n,))[i]) * max(0, (s[kk] - 0.1) / 0.9) ** 1.6 + 1.5
            cry.append((pts[i, 0] + nrm[i, 0] * off, z, pts[i, 1] + nrm[i, 1] * off, nrm[i, 0], nrm[i, 1], rnd.uniform(2.5, 6), rnd.random() < 0.6))
    return V, UV, F, LV, LF, cry

def to_obj(name, V, UV, F, mat, cx, cz):
    me = bpy.data.meshes.new(name)
    me.from_pydata([(x - cx, -(z - cz), y) for x, y, z in V], [], F)        # Blender: x, -z, y
    if UV:
        uvl = me.uv_layers.new()
        for poly in me.polygons:
            for li in poly.loop_indices: uvl.data[li].uv = UV[me.loops[li].vertex_index]
    me.materials.append(mat); me.validate(); me.update()
    for p in me.polygons: p.use_smooth = True
    o = bpy.data.objects.new(name, me); bpy.context.scene.collection.objects.link(o); return o

def crystals(name, cry, M, cx, cz):
    out = []
    for key in ('glow', 'glow2'):
        bm = bmesh.new()
        for x, y, z, nx, nz, ln, c1 in cry:
            if (key == 'glow') != c1: continue
            r = bmesh.ops.create_cone(bm, cap_ends=True, segments=5, radius1=ln * 0.22, radius2=0.05, depth=ln)
            # point outward and a little up
            d = np.array([nx, nz, 0.6]); d /= np.linalg.norm(d)
            import mathutils
            q = mathutils.Vector((0, 0, 1)).rotation_difference(mathutils.Vector((d[0], -d[1], d[2])))
            for v in r['verts']:
                v.co = q @ (v.co + mathutils.Vector((0, 0, ln / 2))) + mathutils.Vector((x - cx, -(z - cz), y))
        if len(bm.verts):
            me = bpy.data.meshes.new(f'{name}-{key}'); bm.to_mesh(me); me.materials.append(M[key])
            o = bpy.data.objects.new(f'{name}-{key}', me); bpy.context.scene.collection.objects.link(o); out.append(o)
        bm.free()
    return out

def resample(poly, step, closed):
    P = np.array(poly + ([poly[0]] if closed else []), dtype=float); out = []
    for i in range(len(P) - 1):
        a_, b_ = P[i], P[i + 1]; L = np.hypot(*(b_ - a_)); k = max(1, int(L / step))
        for t in range(k): out.append(a_ + (b_ - a_) * t / k)
    if not closed: out.append(P[-1])
    return np.array(out)

def normals(pts, closed, inside):
    n = len(pts); N_ = np.zeros((n, 2))
    for i in range(n):
        a_ = pts[(i - 1) % n] if (closed or i > 0) else pts[i]; b_ = pts[(i + 1) % n] if (closed or i < n - 1) else pts[i]
        d = b_ - a_; d /= (np.hypot(*d) + 1e-9); nn = np.array([d[1], -d[0]])
        if inside(pts[i] + nn * 4): nn = -nn
        N_[i] = nn
    # smooth the normals a little so corners fan out instead of tearing
    for _ in range(3):
        N_ = (np.roll(N_, 1, 0) + 2 * N_ + np.roll(N_, -1, 0)) if closed else np.vstack([N_[:1], N_[:-2] + 2 * N_[1:-1] + N_[2:], N_[-1:]])
        N_ /= np.linalg.norm(N_, axis=1, keepdims=True)
    return N_

def export(objs, path):
    for o in bpy.data.objects: o.select_set(o in objs)
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_yup=True, export_apply=True, export_image_format='JPEG')

items = []
def build(name, runs, closed, seed):
    """runs: list of (outline points, top, inside-test)"""
    bpy.ops.wm.read_factory_settings(use_empty=True); M = mats(); objs = []
    allp = np.vstack([resample(r[0], 8, closed) for r in runs]); cx, cz = float(allp[:, 0].mean()), float(allp[:, 1].mean())
    for k, (poly, top, inside) in enumerate(runs):
        pts = resample(poly, 8 if not closed else 9, closed); nrm = normals(pts, closed, inside)
        V, UV, F, LV, LF, cry = wall(pts, nrm, top, closed, seed + k)
        objs.append(to_obj(f'{name}-rock{k}', V, UV, F, M['rock'], cx, cz))
        objs.append(to_obj(f'{name}-lip{k}', LV, [], LF, M['moss'], cx, cz))
        objs += crystals(f'{name}-cry{k}', cry, M, cx, cz)
    export(objs, f'{OUT}/{name}.glb')
    items.append(dict(m=name, place='cliffs', x=round(cx, 2), y=0.0, z=round(cz, 2), rotY=0.0, scale=1.0, new=True))

def build_runs(name, runs, seed):
    """runs from cliffs.json: dict(pts, nrm, top, foot, closed) already resampled, world x,z"""
    bpy.ops.wm.read_factory_settings(use_empty=True); M = mats(); objs = []
    allp = np.vstack([np.array(r['pts']) for r in runs]); cx, cz = float(allp[:, 0].mean()), float(allp[:, 1].mean())
    for k, r in enumerate(runs):
        pts, nrm = np.array(r['pts']), np.array(r['nrm'])
        global LIP_IN; LIP_IN = r.get('lip', 40.0)
        V, UV, F, LV, LF, cry = wall(pts, nrm, r.get('tops', r['top']), r['closed'], seed + k, r['foot'])
        objs.append(to_obj(f'{name}-rock{k}', V, UV, F, M['rock'], cx, cz))
        objs.append(to_obj(f'{name}-lip{k}', LV, [], LF, M['moss'], cx, cz))
        objs += crystals(f'{name}-cry{k}', cry, M, cx, cz)
    export(objs, f'{OUT}/{name}.glb')
    items.append(dict(m=name, place='cliffs', x=round(cx, 2), y=0.0, z=round(cz, 2), rotY=0.0, scale=1.0, new=True))
def polar(cx, cz, rfun, step=9):
    n = max(24, int(2 * math.pi * 300 / step)); out = []
    for i in range(n):
        an = 2 * math.pi * i / n; r = rfun(an); out.append((cx + r * math.cos(an), cz + r * math.sin(an)))
    return out
for k, g in enumerate(C['walls']):
    nm = 'CliffWall_' + ('palace_mesa' if g['id'] == 'palace' else 'gate_massif' if g['id'] == 'gate' else 'plateau_' + g['id'].replace('-', '_'))
    if g['id'] == 'palace' and len(g['runs']) > 8:              # the palace's walls in two halves (west, east) to keep files small
        W = [r for r in g['runs'] if np.mean(np.array(r['pts'])[:, 0]) < 0]; E = [r for r in g['runs'] if np.mean(np.array(r['pts'])[:, 0]) >= 0]
        build_runs(nm + '_w', W, 11); build_runs(nm + '_e', E, 31)
    else: build_runs(nm, g['runs'], 100 + 10 * k)
LIP_IN = 12.0
for k, s_ in enumerate(C['stacks']):
    rf = lambda an, s_=s_: s_['r'] * (1 + 0.12 * math.sin(4 * an + s_['x']) + 0.07 * math.sin(9 * an + s_['z']))
    poly = polar(s_['x'], s_['z'], rf); poly = poly[::max(1, len(poly) // max(24, int(2 * math.pi * s_['r'] / 9)))]
    build(f'CliffWall_stack_{k:02d}', [(poly, s_['h'] + 4, lambda q, s_=s_, rf=rf: math.hypot(q[0] - s_['x'], q[1] - s_['z']) < rf(math.atan2(q[1] - s_['z'], q[0] - s_['x'])))], True, 200 + k)
json.dump(items, open(f'{OUT}/cliffwalls.json', 'w'), indent=0)
print('WALLS', len(items))
