"""Copy the sky palace kit (cliffs3: terrain, walls, viaducts, sky bridge, gate kit) and the re-seated world into the repo's design/world-fill."""
import json, glob, os, shutil, struct
S = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'; R = f'{S}/ridge'; O = f'{R}/out'
D = '/home/user/birthday-castle/design/world-fill'
def glb_dims(path):
    b = open(path, 'rb').read(); n = struct.unpack('<I', b[12:16])[0]; j = json.loads(b[20:20 + n])
    lo, hi = [1e9] * 3, [-1e9] * 3; tris = 0
    for m in j['meshes']:
        for p in m['primitives']:
            a = j['accessors'][p['attributes']['POSITION']]
            lo = [min(x, y) for x, y in zip(lo, a['min'])]; hi = [max(x, y) for x, y in zip(hi, a['max'])]
            if 'indices' in p: tris += j['accessors'][p['indices']]['count'] // 3
    dx, dy, dz = [h - l for h, l in zip(hi, lo)]
    return [round(dx, 3), round(dz, 3), round(dy, 3)], tris
KIT = ('CliffWall_', 'Viaduct_', 'SeaPillar_', 'SkyBridge_', 'Gate', 'CloudPlatform')
kit = lambda m: m.startswith(KIT)
for pat in KIT:
    for f in glob.glob(f'{D}/glb2/{pat}*'): os.remove(f)
W = json.load(open(f'{D}/world-placements.json')); new = json.load(open(f'{O}/world-placements.json'))
items = [it for it in new['items'] if not kit(it['m'])]
models = [m for m in W['models'] if not kit(m)]
def add(name, src, note):
    shutil.copy(src, f'{D}/glb2/{name}.glb'); dims, tris = glb_dims(src)
    json.dump(dict(name=name, dims=dims, tris=tris, source=note), open(f'{D}/glb2/{name}.json', 'w'))
    if name not in models: models.append(name)
V = json.load(open(f'{O}/viaducts/viaducts.json'))
for nm, v in V.items():
    add(nm, f'{O}/viaducts/{nm}.glb', 'ridge/cliffs/viaduct.py (Oct 17 sky palace)')
    items.append(dict(m=nm, place='cliffs', x=v['x'], y=0.0, z=v['z'], rotY=v['rotY'], scale=1.0, new=True, deck=v['deck']))
for k in ('SeaPillar_Basalt', 'SeaPillar_Column', 'SeaPillar_TwinArch', 'SeaPillar_CrystalSpire'): add(k, f'{O}/viaducts/{k}.glb', 'ridge/cliffs/viaduct.py (Oct 17 cliffs)')
for p in json.load(open(f'{O}/viaducts/pillars.json')): items.append(dict(p, place='cliffs', new=True))
for w in json.load(open(f'{O}/walls2/cliffwalls.json')):
    add(w['m'], f'{O}/walls2/{w["m"]}.glb', 'ridge/cliffs/cliffwall3.py (Oct 17 sky palace)'); items.append(w)
add('SkyBridge_Segment', f'{O}/viaducts/SkyBridge_Segment.glb', 'ridge/cliffs/viaduct.py (Oct 17 sky bridge)')
for it in json.load(open(f'{O}/viaducts/skybridge.json'))['items']: items.append(dict(it, place='sky-bridge', new=True))
for it in json.load(open(f'{O}/gatekit/gate-kit.json')):
    add(it['m'], f'{O}/gatekit/{it["m"]}.glb', 'ridge/cliffs/gate.py (Oct 17 gate massif)'); items.append(it)
W['items'] = items; W['models'] = models
W['cliffs'] = 'Oct 17 19:29: sky palace (ridge/cliffs/cliffs3.py): palace at 797.5 m, rings 640 / 500 / 340 / 170 to the moat; walls, viaducts, sea pillars are place "cliffs"; the 688 m sky bridge is "sky-bridge"; tunnel, portal, doors and cloud platform are "gate"'
json.dump(W, open(f'{D}/world-placements.json', 'w'))
C = f'{D}/ridge/cliffs'
shutil.copy(f'{O}/cliffs.json', f'{C}/cliffs.json'); shutil.copy(f'{O}/viaducts/viaducts.json', f'{C}/viaducts.json')
shutil.copy(f'{O}/viaducts/pillars.json', f'{C}/pillars.json'); shutil.copy(f'{O}/walls2/cliffwalls.json', f'{C}/cliffwalls.json')
for f in ('viaducts/skybridge.json', 'gatekit/gate-kit.json', 'palace-raise.patch', 'cliffs3-map.jpg'): shutil.copy(f'{O}/{f}', f'{C}/{os.path.basename(f)}')
for f in ('cliffs3.py', 'cliffwall3.py', 'gate.py', 'hmap.py', 'genshin.py', 'cliffs2.py', 'cliffwall2.py', 'viaduct.py', 'pillars.py', 'rocktex.py', 'togame.py', 'torepo.py', 'rock2.png', 'rock2-n.png'): shutil.copy(f'{R}/{f}', f'{C}/{f}')
for f in ('crescent-h.bin', 'outer-h.bin', 'crescent-colour.jpg', 'outer-colour.jpg'): shutil.copy(f'{O}/game/{f}', f'{D}/ridge/game/{f}')
shutil.copy(f'{O}/paths.json', f'{D}/paths/paths.json')
print('items', len(items), 'models', len(models))
