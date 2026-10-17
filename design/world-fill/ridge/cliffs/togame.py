"""Fold the cliff kit (walls, viaducts, sea pillars) and the re-seated placements into a game checkout's data/world.
python togame.py GAME_DIR"""
import json, struct, sys, os, shutil, glob, math
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'; R = f'{S}/ridge/out'
G = sys.argv[1]; D = f'{G}/data/world'
def glb_dims(path):
    b = open(path, 'rb').read(); n = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + n])
    lo, hi = [1e9] * 3, [-1e9] * 3
    for m in j['meshes']:
        for p in m['primitives']:
            a = j['accessors'][p['attributes']['POSITION']]
            lo = [min(x, y) for x, y in zip(lo, a['min'])]; hi = [max(x, y) for x, y in zip(hi, a['max'])]
    dx, dy, dz = [h - l for h, l in zip(hi, lo)]          # gltf y-up -> [x, z, y] as the game's dims
    return [round(dx, 3), round(dz, 3), round(dy, 3)]
P = json.load(open(f'{D}/placements.json'))
kit = lambda m: m.startswith(('CliffWall_', 'Viaduct_', 'SeaPillar_', 'SkyBridge_', 'Gate', 'CloudPlatform'))
farflag = {(i[0], round(i[2], 1), round(i[4], 1)): i[7] for i in P['items'] if len(i) > 7}
for m in [m for m in P['models'] if kit(m)]: del P['models'][m]
for pat in ('CliffWall_', 'Viaduct_', 'SeaPillar_', 'SkyBridge_', 'Gate', 'CloudPlatform'):
    for f in glob.glob(f'{D}/near/{pat}*.glb'): os.remove(f)
W = json.load(open(f'{R}/world-placements.json'))['items']
items = []
for it in W:
    if it['m'] not in P['models']: continue
    row = [it['m'], it['place'], it['x'], it['y'], it['z'], it['rotY'], it['scale']]
    f = farflag.get((it['m'], round(it['x'], 1), round(it['z'], 1)))
    if f: row.append(f)
    items.append(row)
def add_model(name, src):
    shutil.copy(src, f'{D}/near/{name}.glb'); P['models'][name] = dict(tier='landmark', dims=glb_dims(src))
V = json.load(open(f'{R}/viaducts/viaducts.json')); C = json.load(open(f'{R}/cliffs.json'))
pads = []
for nm, v in V.items():
    add_model(nm, f'{R}/viaducts/{nm}.glb'); items.append([nm, 'cliffs', v['x'], 0.0, v['z'], v['rotY'], 1.0, 2])
    b = next(b for b in C['bridges'] if b['id'] == v['bridge'])
    pads.append(dict(name=nm, x=v['x'], z=v['z'], hw=round(v['length'] / 2, 2), hd=round(b['width'] / 2 - 1, 2), a=v['rotY'], y=v['deck']))
for k in ('SeaPillar_Basalt', 'SeaPillar_Column', 'SeaPillar_TwinArch', 'SeaPillar_CrystalSpire'): add_model(k, f'{R}/viaducts/{k}.glb')
for p in json.load(open(f'{R}/viaducts/pillars.json')): items.append([p['m'], 'cliffs', p['x'], 0.0, p['z'], p['rotY'], p['scale'], 2])
for w in json.load(open(f'{R}/walls2/cliffwalls.json')):
    add_model(w['m'], f'{R}/walls2/{w["m"]}.glb'); items.append([w['m'], 'cliffs', w['x'], 0.0, w['z'], 0.0, 1.0, 3])
SB = json.load(open(f'{R}/viaducts/skybridge.json')); add_model('SkyBridge_Segment', f'{R}/viaducts/SkyBridge_Segment.glb')
for it in SB['items']: items.append([it['m'], 'sky-bridge', it['x'], 0.0, it['z'], it['rotY'], 1.0, 3])   # always near: one instanced mesh
sk = C['sky']; (ax, az), (bx, bz) = sk['bridge']['a'], sk['bridge']['b']
pads.append(dict(name='SkyBridge', x=round((ax + bx) / 2, 2), z=round((az + bz) / 2, 2), hw=round(SB['length'] / 2 + 4, 2), hd=round(sk['bridge']['width'] / 2 - 1, 2), a=SB['rotY'], y=sk['deck']))
T = sk['tunnel']; pl = sk['platform']; z0, z1 = T['z0'] - 30, pl['z']
pads.append(dict(name='GateTunnel', x=T['x'], z=round((z0 + z1) / 2, 2), hw=round((z1 - z0) / 2, 2), hd=round(T['width'] / 2 - 1, 2), a=round(math.atan2(-1, 0), 5), y=sk['deck']))
for it in json.load(open(f'{R}/gatekit/gate-kit.json')):
    if it['m'] not in P['models']: add_model(it['m'], f'{R}/gatekit/{it["m"]}.glb')
    items.append([it['m'], 'gate', it['x'], it['y'], it['z'], it['rotY'], 1.0, 3])
P['items'] = items
json.dump(P, open(f'{D}/placements.json', 'w'), separators=(',', ':'))
json.dump(dict(note='walkable decks (study thread, ridge/cliffs3 sky palace): u runs along each bridge, a = rotY; y is each deck (satellite viaducts 340.5 / 500.5 / 640.5, sky bridge and gate tunnel 688)', pads=pads), open(f'{D}/viaducts.json', 'w'), indent=0)
shutil.copy(f'{R}/paths.json', f'{D}/paths.json')
for f in ('crescent-h.bin', 'outer-h.bin', 'crescent-colour.jpg', 'outer-colour.jpg'): shutil.copy(f'{R}/game/{f}', f'{D}/{f}')
print('items', len(items), 'viaducts', len(V), 'walls', len(json.load(open(f'{R}/walls2/cliffwalls.json'))))
