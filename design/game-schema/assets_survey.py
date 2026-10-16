"""Writes assets_survey.json: every opened model with where it goes and any rule fix (read by build_data.py)."""
import json, os, re
SC = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad'
plan = json.load(open(f'{SC}/fill/fill_plan.json')); todo = json.load(open(f'{SC}/survey/todo.json'))
stats = {os.path.basename(p)[:-5]: json.load(open(p)) for p in __import__('glob').glob(f'{SC}/survey/out/*.json')}
use = {}
for pl, items in plan['places'].items():
    for it in items: use.setdefault(it['m'], dict(places=set(), size=it['size']))['places'].add(pl)
for it in plan['scatter']: use.setdefault(it['m'], dict(places=set(), size=it['size']))['places'].add('wild')
FIX = {'cross_to_star': ['Abandoned_Chapel_Ha', 'Casa_Encantadora', 'Church', 'kleine_Dorfkirche', 'Karlskirche_Vienna', 'Realistic_Zocalo_Mexi', 'Vatican_Cityscape_Mod', 'Gothic_Cathedral'],
       'remove_eyes': ['Whiskerlynx', 'Elemental_Cube_Creatu'], 'veil_face': ['Stone_Face']}
SKIP = {'Skyscraper_Sentinel': 'modern tower', 'tokyo_skytree_pod_sli': 'modern tower', 'black_and_white_sketc': 'modern skyscraper', 'White_House_Ruin_X': 'real building',
        'Urban_Debris': 'city rubble', 'Vatican_Cityscape_Mod': 'real place, crosses', 'Realistic_Zocalo_Mexi': 'real cathedral, crosses', 'Karlskirche_Vienna': 'real church, crosses',
        'Desert_Colossus': 'sand worm with a toothed mouth; too scary as is', 'Genkis_Khan_army_Rook': 'chess-piece tower, off style'}
INTERIOR = {'An_extravagant_fairy': 'canopy bed, her chamber', 'Create_a_whimsical_3D': 'castle bed', 'Design_a_regal_prince': 'vanity, wardrobe room', 'Crystal_Blossom_Mirro': 'wardrobe mirror',
            'Bookshelf_Haven': 'library', 'Path_to_the_Heavens_P': 'folding screen', 'Golden_Rose_Teacup': 'tea table', 'A_very_detailed_and_e': 'rose in a golden egg, gift piece',
            'Object_Charmi': 'stained-glass arch', 'Object_Ornate': 'pink palace door', 'Object_decorative_wa': 'tall window', 'Baroque_Flourish': 'wall ornament', 'Gilded_Baroque_Flouri': 'wall ornament',
            'Golden_Fleur_de_lis': 'wall ornament', 'High_detail_wall_dec': 'rose wall ornament', 'Celestial_Gothic_Wall': 'palace wall panel', 'Gilded_Gothic_Wall_Ca': 'palace wall panel',
            'Wood_chair': 'organic throne', 'wood_chair': 'forest-spirit throne'}
SPECIAL = {'Royal_Carriage': 'her arrival carriage (rides.her_carriage)', 'A_colossal_floating_c': 'giant floating lotus: finale theatre centrepiece', 'Marble_Pavilion': 'floating theatre pavilions at the finale',
           'For_Diana_This_beauti': 'rose swing: a gift spot', 'Whiskerlynx': 'pet candidate once the eyes are removed', 'Subject_A_commemorat': 'the white waterfall gate', 'untitled': 'golden sun tower used as the lighthouse',
           'a_large_mountain_val': 'reference for the crescent caldera shape'}
def kind(n):
    s = n.lower()
    for k, ws in [('tree', ['tree', 'willow', 'mushroom', 'fantasy']), ('rock', ['rock', 'stone', 'peak', 'monolith', 'cliff', 'mesa', 'boulder', 'crystal', 'cryst', 'cave', 'rubble']),
                  ('terrain', ['terrain', 'mountain', 'erosion', 'riverbank', 'mosa']), ('creature', ['lynx', 'creatu', 'colossus']), ('vehicle', ['carriage'])]:
        if any(w in s for w in ws): return k
    return 'prop' if n in INTERIOR else 'building'
out = []
for n in sorted(set(stats) | set(use)):
    if n not in todo and n not in use: continue
    e = dict(id='m_' + re.sub(r'[^a-z0-9]+', '_', n.lower()).strip('_'), source='meshy_github' if n in todo else 'meshy_project', kind=kind(n))
    if n in todo: e['path'] = todo[n]['path']
    if n in use:
        e['near'] = f'art-references/world-fill/glb/{n}.glb'; e['sizeM'] = use[n]['size']
        e['places'] = sorted(p for p in use[n]['places'] if re.match(r'B\d\d$', p))
    if n in stats: e['tris'] = int(stats[n]['tris'])
    notes = [x for x in (SPECIAL.get(n), INTERIOR.get(n) and 'palace interior: ' + INTERIOR[n], SKIP.get(n) and 'not used: ' + SKIP[n], ('wild relic/rock scatter' if n in use and 'wild' in use[n]['places'] else None),
                         ('arrival' if n in use and 'ARRIVAL' in use[n]['places'] else None)) if x]
    if notes: e['notes'] = '; '.join(notes)
    fx = [k.replace('_', ' ') for k, v in FIX.items() if n in v]
    if fx: e['fix'] = fx
    out.append(e)
json.dump(out, open('assets_survey.json', 'w'), indent=1)
print(len(out), 'assets;', sum('places' in e and bool(e['places']) for e in out), 'placed at places;', sum('fix' in e for e in out), 'need fixes')
