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
kit = lambda m: m.startswith(('CliffWall_', 'Viaduct_', 'SeaPillar_'))
farflag = {(i[0], round(i[2], 1), round(i[4], 1)): i[7] for i in P['items'] if len(i) > 7}
for m in [m for m in P['models'] if kit(m)]: del P['models'][m]
for f in glob.glob(f'{D}/near/CliffWall_*.glb') + glob.glob(f'{D}/near/Viaduct_*.glb') + glob.glob(f'{D}/near/SeaPillar_*.glb'): os.remove(f)
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
P['items'] = items
json.dump(P, open(f'{D}/placements.json', 'w'), separators=(',', ':'))
json.dump(dict(note='walkable viaduct decks (study thread, ridge/cliffs2): u runs along each bridge, a = rotY; y is each deck (110.5 top tier, 70.5 middle step)', pads=pads), open(f'{D}/viaducts.json', 'w'), indent=0)
shutil.copy(f'{R}/paths.json', f'{D}/paths.json')
for f in ('crescent-h.bin', 'outer-h.bin', 'crescent-colour.jpg', 'outer-colour.jpg'): shutil.copy(f'{R}/game/{f}', f'{D}/{f}')
print('items', len(items), 'viaducts', len(V), 'walls', len(json.load(open(f'{R}/walls2/cliffwalls.json'))))
