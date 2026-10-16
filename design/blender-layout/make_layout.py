import bpy, bmesh, math, sys, os, numpy as np
from mathutils import Vector
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from layout_data import *
from terrain import derive, w2px
from scipy import ndimage as ndi
OUT = sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else '.'
os.makedirs(OUT, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene; sc.unit_settings.system='METRIC'
hf, land, mapim = derive()
mapa = np.asarray(mapim).astype(float)/255
H, W = hf.shape
STEP = 4
def wx(px): return (px - PX0) * MPP * S
def wy(py): return -(py - PZ0) * MPP * S            # map z (south +) -> Blender y (north +)

# ---- flatten palace platform
PAL_W, PAL_D, PAL_Z = 800*S, 680*S, 120.0
yy, xx = np.mgrid[0:H, 0:W]
X = wx(xx); Y = wy(yy)
dx = np.maximum(np.abs(X) - PAL_W/2, 0); dy = np.maximum(np.abs(Y) - PAL_D/2, 0)
dist = np.hypot(dx, dy); wgt = np.clip(1 - dist/600.0, 0, 1); wgt = wgt*wgt*(3-2*wgt)
hfl = np.where(land | (wgt > 0), hf, hf)
hfl = hf*(1-wgt) + PAL_Z*wgt
# gentle descent from the gate down the stair and causeway approach to the lake shore
sS = np.clip((-Y - PAL_D/2)/1100.0, 0, 1); sS = sS*sS*(3-2*sS)
cw = np.clip(1 - (np.abs(X) - 350)/450.0, 0, 1)*((Y < -PAL_D/2) & (Y > -4200))
tgt = PAL_Z*(1-sS) + np.minimum(hf, 30)*sS
hfl = hfl*(1-cw) + tgt*cw

# ---- materials
def mat(name, rgb, rough=0.6, emit=0.0, alpha=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*rgb, 1); b.inputs['Roughness'].default_value = rough
    if emit:
        b.inputs['Emission Color'].default_value = (*rgb, 1); b.inputs['Emission Strength'].default_value = emit
    return m
M = {k: mat(k, v, r, e) for k, v, r, e in [
 ('palace',(0.93,0.70,0.72),.5,0), ('dome',(0.45,0.20,0.55),.4,0), ('landmark',(0.85,0.80,0.70),.6,0),
 ('golden',(1.0,0.78,0.25),.3,0.6), ('path',(0.9,0.85,0.7),.8,0.15), ('boat',(0.7,0.9,1.0),.5,0.5),
 ('sky',(0.8,0.9,1.0),.5,0.3), ('kit',(1.0,0.2,0.8),.5,0.8), ('label',(0.02,0.02,0.08),.9,0.0), ('portal',(0.5,0.6,1.0),.5,1.0),
 ('rock',(0.45,0.42,0.40),.9,0)]}
sea = bpy.data.materials.new('sea'); sea.use_nodes=True
sb = sea.node_tree.nodes['Principled BSDF']; sb.inputs['Base Color'].default_value=(0.02,0.28,0.45,1); sb.inputs['Roughness'].default_value=0.15

colls = {}
for n in ['00_Terrain','01_Palace_B01','02_Landmarks','03_Routes','04_Sky_isles','05_Meshy_kit_markers','06_Labels']:
    c = bpy.data.collections.new(n); sc.collection.children.link(c); colls[n]=c
def link(o, cn):
    colls[cn].objects.link(o); return o
def box(name, cx, cy, w, d, h, z0, m, cn):
    mesh = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts: v.co.x*=w; v.co.y*=d; v.co.z=(v.co.z+0.5)*h
    bm.to_mesh(mesh); bm.free()
    o = bpy.data.objects.new(name, mesh); o.location=(cx,cy,z0); o.data.materials.append(m); return link(o, cn)
def cyl(name, cx, cy, r, h, z0, m, cn, top=None, seg=24):
    mesh = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=seg, radius1=r, radius2=(r if top is None else top), depth=h)
    for v in bm.verts: v.co.z += h/2
    bm.to_mesh(mesh); bm.free()
    o = bpy.data.objects.new(name, mesh); o.location=(cx,cy,z0); o.data.materials.append(m); return link(o, cn)
def sphere(name, cx, cy, r, sz, z0, m, cn):
    mesh = bpy.data.meshes.new(name); bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=24, v_segments=12, radius=r)
    for v in bm.verts: v.co.z *= sz
    bm.to_mesh(mesh); bm.free()
    o = bpy.data.objects.new(name, mesh); o.location=(cx,cy,z0); o.data.materials.append(m); return link(o, cn)
def label(text, x, y, z, size, cn='06_Labels'):
    c = bpy.data.curves.new('t_'+text, 'FONT'); c.body = text; c.size = size; c.align_x='CENTER'; c.align_y='CENTER'
    o = bpy.data.objects.new('lbl_'+text.split()[0], c); o.location=(x,y,z); o.data.materials.append(M['label']); return link(o, cn)

# ---- terrain mesh (colours from the owner's map)
gi = np.arange(0, H, STEP); gj = np.arange(0, W, STEP)
Hs = ndi.gaussian_filter(hfl, 1.2)[np.ix_(gi, gj)]
ny, nx = len(gi), len(gj)
verts = np.zeros((ny, nx, 3)); verts[...,0]=wx(gj)[None,:]; verts[...,1]=wy(gi)[:,None]; verts[...,2]=Hs
faces = [(j*nx+i, j*nx+i+1, (j+1)*nx+i+1, (j+1)*nx+i) for j in range(ny-1) for i in range(nx-1)]
tm = bpy.data.meshes.new('terrain'); tm.from_pydata(verts.reshape(-1,3).tolist(), [], faces); tm.update()
blur = np.stack([ndi.gaussian_filter(mapa[...,k], 2.0) for k in range(3)], axis=2)
col = tm.color_attributes.new('Col', 'FLOAT_COLOR', 'POINT')
cs = blur[np.ix_(gi, gj)].reshape(-1,3)
lw = land[np.ix_(gi, gj)].reshape(-1)
water_rgb = np.array([0.03,0.22,0.38])
cs = np.where(lw[:,None], cs, water_rgb[None,:])
col.data.foreach_set('color', np.concatenate([cs, np.ones((len(cs),1))], axis=1).reshape(-1))
tmat = bpy.data.materials.new('terrain'); tmat.use_nodes=True
vc = tmat.node_tree.nodes.new('ShaderNodeVertexColor'); vc.layer_name='Col'
tmat.node_tree.links.new(vc.outputs['Color'], tmat.node_tree.nodes['Principled BSDF'].inputs['Base Color'])
tmat.node_tree.nodes['Principled BSDF'].inputs['Roughness'].default_value=0.9
to = bpy.data.objects.new('terrain', tm); to.data.materials.append(tmat); link(to, '00_Terrain')
for p in tm.polygons: p.use_smooth = True
# sea plane
sm = bpy.data.meshes.new('sea'); R = 16000
sm.from_pydata([(-R,-R,0),(R,-R,0),(R,R,0),(-R,R,0)], [], [(0,1,2,3)]); so = bpy.data.objects.new('sea', sm); so.data.materials.append(sea); link(so,'00_Terrain')

def height_at(x, y):
    px = x/(MPP*S) + PX0; py = -y/(MPP*S) + PZ0
    i = min(max(px/STEP, 0), nx-1.001); j = min(max(py/STEP, 0), ny-1.001)
    i0, j0 = int(i), int(j); fi, fj = i-i0, j-j0
    h = Hs
    return (h[j0,i0]*(1-fi)*(1-fj) + h[j0,i0+1]*fi*(1-fj) + h[j0+1,i0]*(1-fi)*fj + h[j0+1,i0+1]*fi*fj)

# ---- Palace B01 massing (drawn metres x S, base z = 120)
def pb(name, cx, cy, w, d, h, z0=0, m=None, cn='01_Palace_B01'):
    return box(name, cx*S, cy*S, w*S, d*S, h*S, PAL_Z + z0*S, m or M['palace'], cn)
pb('T1_front_podium', 0, 0, 800, 680, 110)
pb('T2', 0, 0, 700, 560, 154)
pb('T3', 0, 10, 560, 420, 186)
pb('T4_central_ward', 0, 0, 380, 280, 216)
for sx in (-1, 1):
    for sy in (-1, 1):
        cyl(f'corner_tower_{sx}{sy}', sx*367*S, sy*307*S, 33*S, 200*S, PAL_Z, M['palace'], '01_Palace_B01')
        cyl(f'corner_dome_{sx}{sy}', sx*367*S, sy*307*S, 33*S*1.05, 38*S, PAL_Z+200*S, M['dome'], '01_Palace_B01', top=4*S)
cyl('great_dome_drum', -170*S, -60*S, 47*S, 75*S, PAL_Z+155*S, M['palace'], '01_Palace_B01')
sphere('great_dome', -170*S, -60*S, 47*S, 1.4, PAL_Z+230*S, M['dome'], '01_Palace_B01')
cyl('great_dome_finial', -170*S, -60*S, 2.5*S, 55*S, PAL_Z+295*S, M['golden'], '01_Palace_B01')
for i, (sx, sy, hh) in enumerate([(40,40,400),(110,10,349),(-30,70,305)]):
    cyl(f'spire_{i}', sx*S, sy*S, 12*S, hh*S, PAL_Z, M['palace'], '01_Palace_B01', top=10*S)
    cyl(f'spire_{i}_tip', sx*S, sy*S, 10*S, 40*S, PAL_Z+hh*S, M['dome'], '01_Palace_B01', top=0.5*S)
cyl('cone_pavilion', 0, 230*S, 42*S, 160*S, PAL_Z, M['palace'], '01_Palace_B01')
cyl('cone_pavilion_roof', 0, 230*S, 46*S, 95*S, PAL_Z+160*S, M['dome'], '01_Palace_B01', top=1*S)
pb('gate_opening', 0, -340, 75, 24, 100, 0, M['golden'])
pb('cascade_stair', 0, -420, 60, 160, 6, -4, M['path'])
label('B01 Princess Palace  2200 x 1870 m', 0, -1500, PAL_Z + 700, 110)
label('spire 1100 m', 110*S, 10*S, PAL_Z + 400*S + 140, 70)

# ---- landmarks
LAND_POS = {}
for code, (nm, x1, z1, w1, d1) in LANDMARKS.items():
    x, y = x1*S, -z1*S; LAND_POS[code] = (x, y)
    h = HEIGHT_OVERRIDE.get(code, 0.6*min(w1, d1))*S
    z0 = max(height_at(x, y), 0.0)
    box(f'{code}_{nm}', x, y, w1*S, d1*S, h, z0, M['landmark'], '02_Landmarks')
    label(f'{code} {nm}', x, y - d1*S*0.6 - 140, z0 + h + 20, 150)
x, y = 0, 0; LAND_POS['B01'] = (0, 0)

# ---- routes
def strip(name, pts, width, mname, ymin=None, lift=1.0, cn='03_Routes'):
    pts = np.array(pts, float)
    # resample
    seg = np.hypot(*np.diff(pts[:, :2], axis=0).T); cum = np.r_[0, np.cumsum(seg)]; n = max(int(cum[-1]/60), 2)
    t = np.linspace(0, cum[-1], n); P = np.stack([np.interp(t, cum, pts[:,0]), np.interp(t, cum, pts[:,1])], axis=1)
    Z = np.array([max(height_at(*p), ymin if ymin is not None else -1e9) + lift for p in P])
    tang = np.gradient(P, axis=0); tang /= (np.hypot(tang[:,0], tang[:,1])[:,None] + 1e-9)
    nrm = np.stack([-tang[:,1], tang[:,0]], axis=1)
    L = P + nrm*width/2; Rr = P - nrm*width/2
    vs = [(*L[i], Z[i]) for i in range(n)] + [(*Rr[i], Z[i]) for i in range(n)]
    fs = [(i, i+1, n+i+1, n+i) for i in range(n-1)]
    me = bpy.data.meshes.new(name); me.from_pydata(vs, [], fs); o = bpy.data.objects.new(name, me); o.data.materials.append(M[mname]); return link(o, cn)
gate = (0, -340*S)
strip('golden_route', [(LAND_POS['B20'][0], LAND_POS['B20'][1]), (-30*S, -1700*S), (0, -1100*S), gate], 70, 'golden', ymin=14, lift=0.5)
# secondary paths: minimum spanning tree over palace + landmarks
nodes = {c: np.array(p) for c, p in LAND_POS.items()}
names = list(nodes); intree = {names[0]}; edges = []
while len(intree) < len(names):
    best = None
    for a in intree:
        for b in names:
            if b in intree: continue
            d = np.hypot(*(nodes[a]-nodes[b]))
            if best is None or d < best[0]: best = (d, a, b)
    intree.add(best[2]); edges.append(best)
for d, a, b in edges:
    strip(f'path_{a}_{b}', [tuple(nodes[a]), tuple(nodes[b])], 14, 'path', ymin=3, lift=1.5)
boat = [LAND_POS['B19'], (-2000*S, -2900*S), LAND_POS['B22'], (-500*S, -3900*S), LAND_POS['B23'], (2500*S, -3500*S), LAND_POS['B24']]
strip('boat_route', boat, 12, 'boat', ymin=0, lift=2.0)

# ---- sky isles and portal routes
for nm, (x1, z1, hz) in SKY.items():
    x, y = x1*S, -z1*S
    cyl('sky_'+nm, x, y, 600, 90, hz, M['sky'], '04_Sky_isles', top=500)
    cyl('sky_under_'+nm, x, y, 500, 260, hz-260, M['rock'], '04_Sky_isles', top=60) .rotation_euler = (math.pi, 0, 0)
    label('Sky Isle '+nm, x, y, hz+160, 120, '04_Sky_isles')
    cu = bpy.data.curves.new('portal_'+nm, 'CURVE'); cu.dimensions='3D'; cu.bevel_depth=3
    sp = cu.splines.new('POLY'); sp.points.add(2)
    sp.points[0].co = (0, 0, PAL_Z+1000, 1); sp.points[1].co = (x/2, y/2, hz+700, 1); sp.points[2].co = (x, y, hz, 1)
    o = bpy.data.objects.new('portal_route_'+nm, cu); o.data.materials.append(M['portal']); link(o, '03_Routes')

# ---- Meshy kit markers
for model, (code, size, ox, oz) in KITS.items():
    nm, x1, z1, w1, d1 = LANDMARKS.get(code, ('Princess Palace', 0, 0, 800, 680))
    x = (x1 + ox*w1)*S; y = -(z1 + oz*d1)*S
    s = size*(S if size >= 90 else 1)
    z0 = max(height_at(x, y), 0.0)
    box('kit_'+model, x, y, s, s, s, z0, M['kit'], '05_Meshy_kit_markers')
    box('pole_'+model, x, y, 5, 5, 200, z0, M['kit'], '05_Meshy_kit_markers')
    label(model, x, y, z0 + s + 215, 45, '05_Meshy_kit_markers')

# ---- sun, world, cameras
sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 1.4; so2 = bpy.data.objects.new('sun', sun)
so2.rotation_euler = (math.radians(50), 0, math.radians(35)); sc.collection.objects.link(so2)
w = bpy.data.worlds.new('w'); w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.55,0.68,0.85,1); w.node_tree.nodes['Background'].inputs[1].default_value = 0.45
sc.world = w
def cam(name, loc, target, ortho=None, lens=35):
    c = bpy.data.cameras.new(name); c.clip_end = 60000
    if ortho: c.type='ORTHO'; c.ortho_scale = ortho
    else: c.lens = lens
    o = bpy.data.objects.new(name, c); o.location = loc; sc.collection.objects.link(o)
    d = Vector(target) - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); return o
cams = {
 'plan': cam('plan', (-710, -2260, 20000), (-710, -2260, 0), ortho=20700),
 'oblique_south': cam('oblique_south', (0, -17000, 8500), (0, 400, 150), lens=30),
 'palace_south': cam('palace_south', (0, -4600, 1100), (0, 0, 420), lens=24),
}
sc.render.engine = 'CYCLES'; sc.cycles.samples = 16; sc.cycles.use_denoising = True; sc.cycles.device='CPU'
sc.render.film_transparent = False
sc.view_settings.view_transform = 'Standard'
for k, (rx, ry) in {'plan': (1254,1254), 'oblique_south': (1700,1000), 'palace_south': (1700,900)}.items():
    sc.camera = cams[k]; sc.render.resolution_x = rx; sc.render.resolution_y = ry
    sc.render.filepath = os.path.join(OUT, f'layout-{k}.png'); bpy.ops.render.render(write_still=True)
sc.camera = cams['oblique_south']
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'castle-world-layout-20km.blend'), compress=True)
print('DONE', len(bpy.data.objects), 'objects')
