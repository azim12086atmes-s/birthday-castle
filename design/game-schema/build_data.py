"""Builds game-data.json from the story doc tables (places_raw.json, pos_raw.json) plus the design decisions below."""
import json, re, os
H = os.path.dirname(os.path.abspath(__file__))
P = json.load(open(f'{H}/places_raw.json')); POS = json.load(open(f'{H}/pos_raw.json')); NEWPOS = json.load(open(f'{H}/pos_new.json'))
S = 2.75
def slug(s): return re.sub(r'[^a-z0-9]+', '_', re.sub(r'\(.*?\)', '', s.lower())).strip('_')

# per place: biome, game template, challenge template, boss creature, schedule order on the night (None = week before)
T = {
 'B01': ('palace_grounds', 'party_game', 'boss_purification', 'the_hush', 14),
 'B02': ('lakes_rivers', 'race', 'harmony_puzzle', None, 3),
 'B03': ('lakes_rivers', 'harmony_puzzle', 'harmony_puzzle', None, None),
 'B04': ('blossom_groves', 'party_game', 'boss_purification', 'thorn_golem', 7),
 'B05': ('misty_moor', 'party_game', 'escort', None, None),
 'B06': ('blossom_groves', 'gather_build', 'arena_defence', None, 4),
 'B07': ('palace_grounds', 'heart_quiz', 'heart_quiz', None, 8),
 'B08': ('grassland_farms', 'race', 'boss_purification', 'shadow_champion', 10),
 'B09': ('lagoon_wetland', 'race', 'gather_build', None, None),
 'B10': ('red_canyon', 'race', 'harmony_puzzle', None, None),
 'B11': ('sea_cliffs', 'party_game', 'boss_purification', 'stone_giant', None),
 'B12': ('grassland_farms', 'party_game', 'gather_build', None, 5),
 'B13': ('grassland_farms', 'party_game', 'harmony_puzzle', None, None),
 'B14': ('karst_pillars', 'race', 'gather_build', None, None),
 'B15': ('jungle', 'race', 'harmony_puzzle', None, None),
 'B16': ('fjord_taiga', 'race', 'boss_purification', 'ice_serpent', None),
 'B17': ('glowwood', 'party_game', 'arena_defence', None, None),
 'B18': ('blossom_groves', 'race', 'escort', None, 6),
 'B19': ('sandy_beach', 'party_game', 'arena_defence', None, None),
 'B20': ('lakes_rivers', 'party_game', 'heart_quiz', None, 1),
 'B21': ('sea_cliffs', 'gather_build', 'harmony_puzzle', None, 2),
 'B22': ('sea_cliffs', 'party_game', 'escort', None, None),
 'B23': ('coral_reef', 'race', 'gather_build', None, None),
 'B24': ('coral_reef', 'race', 'boss_purification', 'leviathan', None),
 'B25': ('flower_meadow', 'gather_build', 'harmony_puzzle', None, 12),
 'B26': ('snow_glacier', 'race', 'boss_purification', 'storm_dragon', 11),
 'B27': ('dunes', 'race', 'harmony_puzzle', None, None),
 'B28': ('snow_glacier', 'party_game', 'gather_build', None, None),
 'B29': ('bare_rock', 'race', 'harmony_puzzle', None, None),
 'B30': ('sky', 'race', 'escort', None, 9),
 'B31': ('flower_meadow', 'race', 'harmony_puzzle', None, None),
 'B32': ('palace_grounds', 'party_game', 'party_game', None, 13),
}
CREATURE_KIND = {'seahorses': 'mount', 'dragons': 'mount', 'young_dragons': 'friend', 'sea_whales': 'giant', 'sky_whales': 'giant', 'griffins': 'mount', 'winged_unicorns': 'mount', 'glass_jellyfish': 'swarm', 'butterflies': 'swarm', 'crystal_butterflies': 'swarm', 'hummingbirds': 'swarm', 'lantern_moths': 'swarm', 'ice_moths': 'swarm', 'star_moths': 'swarm', 'cave_glow_worms': 'swarm', 'paper_cranes': 'ambient', 'doves_of_light': 'ambient'}
MOVES = lambda c: 'swim' if any(w in c for w in ('koi', 'turtle', 'ray', 'whale', 'otter', 'seal', 'seahorse', 'leviathan', 'serpent')) else 'fly' if any(w in c for w in ('bird', 'moth', 'fly', 'flies', 'crane', 'dove', 'eagle', 'dragon', 'griffin', 'unicorn', 'jellyfish', 'balloon', 'worm')) else 'hop' if any(w in c for w in ('frog', 'bunny')) else 'walk'

places, chars, creatures = [], [], {}
for p in P:
    pid = p['id']; biome, g, c, boss, order = T[pid]
    head = slug(p['head']); cre = slug(p['creatures'])
    pl = dict(id=pid, name=p['name'], biome=biome)
    if pid in POS:
        x = float(POS[pid]['x'].replace('−', '-')); z = float(POS[pid]['z'].replace('−', '-'))
        pl['at'] = dict(x=round(x * S), z=round(z * S)); pl['setting'] = POS[pid]['where']
    if pid in NEWPOS:
        pl['at'] = dict(x=round(NEWPOS[pid][0] * S), z=round(NEWPOS[pid][1] * S)); pl['setting'] = 'Chosen on the crescent map (fill thread, Oct 16)' + (', floating about 380 m up' if pid == 'B30' else '')
    look, _, people = p['look'].rpartition(', ')
    pl.update(look=look or p['look'], people=people if look else '', head=head, creatures=[cre],
              game=dict(name=p['game'], template=g), challenge=dict(name=re.sub(r'^Boss: |^Final boss: ', '', p['challenge']), template=c),
              shard=int(pid[1:]), schedule='night' if order else 'week_before', status='designed')
    if not pl['people']: del pl['people']
    if boss: pl['boss'] = boss
    if order: pl['order'] = order
    places.append(pl)
    chars.append(dict(id=head, name=re.sub(r'\s*\(.*\)', '', p['head']), role='head', place=pid, face='soft_features',
                      lines=['Thank you for bringing back the light.'], status='designed'))
    creatures.setdefault(cre, dict(id=cre, name=p['creatures'], kind=CREATURE_KIND.get(cre, 'friend'), eyes=False, moves=MOVES(cre), places=[], render='instanced' if CREATURE_KIND.get(cre) in ('swarm', 'ambient') else 'skinned_mesh', status='idea'))
    creatures[cre]['places'].append(pid)
for b, n, pl_, mv, sz in [('the_hush', 'The Hush', 'B01', 'float', 'giant'), ('thorn_golem', 'Thorn Golem', 'B04', 'walk', 'giant'), ('shadow_champion', 'Shadow Champion', 'B08', 'walk', 'large'),
                          ('stone_giant', 'Arch Guardian, corrupted', 'B11', 'walk', 'colossal'), ('ice_serpent', 'Ice Serpent', 'B16', 'swim', 'colossal'), ('leviathan', 'Leviathan', 'B24', 'swim', 'colossal'), ('storm_dragon', 'Storm Dragon, corrupted', 'B26', 'fly', 'colossal')]:
    creatures[b] = dict(id=b, name=n, kind='boss', eyes=False, size=sz, moves=mv, places=[pl_], behaviour='Purify, never kill: weak spots glow, it shatters into light and returns to its true colours.', render='skinned_mesh', status='idea')
creatures['shadow_glass'] = dict(id='shadow_glass', name='Shadow-glass creatures', kind='enemy', eyes=False, size='medium', moves='walk', look='Smoky dark glass; shatter into light and petals', render='instanced', status='idea')
creatures['sky_whales']['look'] = 'Slow pods over the valley, aurora trailing from fins'; creatures['sky_whales']['moves'] = 'fly'
creatures['glass_jellyfish']['look'] = 'Glowing clusters drifting through the air at night'; creatures['glass_jellyfish']['moves'] = 'float'
for i, n, mv, look in [('sea_giant', 'Giant creatures rising from the sea', 'swim', 'Rise at dusk and at the finale'), ('lantern_fish', 'Lantern koi', 'swim', 'Glowing lake at night')]:
    creatures[i] = dict(id=i, name=n, kind='giant' if 'whale' in i or 'giant' in i else 'swarm', eyes=False, moves=mv, look=look, render='skinned_mesh' if 'whale' in i or 'giant' in i else 'particles', status='idea')
chars += [dict(id='the_hush', name='The Hush', role='villain', face='none', look='A jealous shadow of fog and grey glass', lines=['Bring the light home before midnight, or the birthday will never come.']),
          dict(id='honoree', name='Princess', role='honoree', gender='female'),
          dict(id='mew', name='The Mew', role='mew', gender='none', look='Small pink celestial cat-like spirit with a long tail; original design')]

PETS = [('star_foxes', 'Star fox', 'find_hidden', 'trots at heel, sniffs out secrets', 'hides behind her and pops out'), ('bunny_cats', 'Bunny-cat', 'heal', 'hops at heel', 'steals her hat'),
        ('young_dragons', 'Baby dragon', 'carry_light', 'flies over the shoulder', 'sneezes sparkles'), ('cloud_koi', 'Cloud koi', 'speed', 'swims through the air beside her', 'blows bubbles in her face'),
        ('glow_frogs', 'Glow frog', 'scout', 'hops ahead and back', 'croaks a tune'), ('fennec_foxes', 'Fennec', 'find_hidden', 'trots ahead', 'digs up flowers'),
        ('griffins', 'Mini griffin', 'shield', 'perches on the shoulder', 'ruffles her hair'), ('crystal_hummingbirds', 'Crystal hummingbird', 'fetch', 'orbits her head', 'hovers in front of her nose')]
pets = []
for i, n, pw, f, t in PETS:
    if i not in creatures: creatures[i] = dict(id=i, name=n, kind='friend', eyes=False, size='small', moves=MOVES(i), render='skinned_mesh', status='idea')
    pets.append(dict(id=slug(n) + '_pet', creature=i, power=pw, follow=f, tease=t))

TEMPLATES = [
 ('harmony_puzzle', 'Harmony puzzle', 'Pressure pads, mirrors, bells or beams that need several players at once; more than 8 split into two teams with their own nodes', 'Nobody can do it alone; people have to talk', 2, 16, 'every node lit at the same time'),
 ('race', 'Race', 'On foot, on creatures, in vehicles or on the flying ship through rings', 'Quick fun with a winner, easy to join', 1, 16, 'first across the line; everyone who finishes gets the shard'),
 ('arena_defence', 'Arena defence', 'Waves of shadow-glass creatures; melee and ranged', 'Back-to-back teamwork, revive each other', 1, 16, 'survive all waves'),
 ('boss_purification', 'Boss purification', 'A big corrupted creature with weak spots and warning zones', 'The big shared win of each act', 2, 16, 'purify all weak spots'),
 ('party_game', 'Party game', 'Targets, bubble tag, hide-and-seek, snowball fights, kite battles', 'Laughter, no pressure', 2, 16, 'highest score after the timer'),
 ('escort', 'Escort', 'Carry or guide something fragile together (a lantern, spirits, baby whales)', 'Everyone protects the same thing', 1, 16, 'the escorted thing arrives with light left'),
 ('gather_build', 'Team gather and build', 'Collect pieces and build something together (a cake layer, a bridge, an ice sculpture)', 'Shared creation; each person adds a part', 2, 16, 'every slot filled'),
 ('heart_quiz', 'Heart quiz and memory', 'Questions about her and about each other, echo and photo memory games', 'Friends learn about each other; deeply personal', 2, 16, 'answer a set number right as a team'),
]
templates = [dict(id=i, name=n, how=h, why=w, players=dict(min=a, max=b), win=wn, status='designed') for i, n, h, w, a, b, wn in TEMPLATES]
templates[0]['params'] = {'type': 'object', 'properties': {'nodes': {'type': 'integer'}, 'kind': {'enum': ['pads', 'mirrors', 'bells', 'beams']}, 'timeLimitS': {'type': 'number'}}}
templates[1]['params'] = {'type': 'object', 'properties': {'vehicle': {'type': 'string'}, 'rings': {'type': 'integer'}, 'laps': {'type': 'integer'}}}
templates[2]['params'] = {'type': 'object', 'properties': {'waves': {'type': 'integer'}, 'enemy': {'type': 'string'}}}
templates[3]['params'] = {'type': 'object', 'properties': {'boss': {'type': 'string'}, 'weakSpots': {'type': 'integer'}, 'phases': {'type': 'integer'}}}

data = dict(
 meta=dict(title='Birthday Quest', version='0.1.0', celebrationAt='2026-10-23T00:00:00', timezone='local', honoreeName='Princess',
           docs=['https://claude.ai/code/artifact/c6b5a6dd-a5a1-46cb-b938-935cfdb0e0d4', 'https://claude.ai/code/artifact/3148a84a-3994-4423-af7c-4bdd4b823097']),
 rules=[
  dict(id='no_eyes', text='Creatures have no eyes (the Mew is waiting on the owner).', appliesTo=['creatures']),
  dict(id='faceless_statues', text='Statues and sculptures are faceless or veiled.', appliesTo=['statues', 'models']),
  dict(id='stars_not_crosses', text='Cross shapes become stars (finials, windows, decorations).', appliesTo=['symbols', 'models']),
  dict(id='modest_outfits', text='Every outfit is modest; hijab-friendly headwear exists.', appliesTo=['outfits']),
  dict(id='female_only_dresses', text='Women\'s party dresses are visible only to female accounts.', appliesTo=['outfits']),
  dict(id='no_gore', text='Combat is magical: enemies shatter into light and petals, no blood.', appliesTo=['combat']),
  dict(id='natural_size', text='Meshy models keep their natural size; only the palace is enlarged (x2.75).', appliesTo=['models']),
  dict(id='mew_secret', text='Only the owner is the Mew; it is not in the pet menu and its voice is hidden until the reveal.', appliesTo=['voice', 'characters']),
  dict(id='original_creatures', text='Creatures are original designs inspired by Pokemon, cartoons and myth, not copies.', appliesTo=['creatures'])],
 world=dict(sizeKm=20, scaleS=S, shape='A crescent ring of towering mountains rising from the ocean, the mainland cradled inside, the palace at the centre, open to the sea on one side.',
   heightmap='art-references/open-world/ (to be reshaped into the crescent)', biomeMap='art-references/web-pack/maps/biome-1024.png',
   arrival=[dict(id='docks', name='Horizon Docks', what='Players appear on a floating dock at sea facing the mountain wall'),
            dict(id='gate', name='White waterfall gate', what='A giant white marble gate carved into the cliff, veiled by a waterfall, parts for them'),
            dict(id='ride_through', name='Ride through the falls', what='Each friend sits in their own ride, first person, droplets on screen', cutscene='arrival'),
            dict(id='aerial', name='Aerial reveal', what='Camera rises over the whole valley', cutscene='arrival'),
            dict(id='bridge', name='Great marble bridge', what='The rides cross the long white bridge over the lake'),
            dict(id='doors', name='Palace doors', what='Players walk to the giant doors, which slowly open')]),
 places=places, characters=chars, creatures=list(creatures.values()), pets=pets,
 rides=[dict(id='her_carriage', name='Rose-gold carriage', kind='arrival', seats=2, drawnBy='winged unicorns', honoreeOnly=True),
        dict(id='swan_boat', name='Swan boat', kind='arrival', seats=2), dict(id='petal_carriage', name='Petal carriage', kind='arrival', seats=2),
        dict(id='cloud_chariot', name='Cloud chariot', kind='arrival', seats=2), dict(id='glass_sleigh', name='Glass sleigh', kind='arrival', seats=2),
        dict(id='lantern_gondola', name='Lantern gondola', kind='arrival', seats=2), dict(id='winged_carriage', name='Winged carriage', kind='arrival', seats=2),
        dict(id='flying_ship', name='The flying ship', kind='group', seats=18, look='Open deck everyone stands on; carries the group between places')],
 mew=dict(controlledBy='owner', eyes='none', voice='mew_sounds_only',
   view=dict(offsetDeg=[30, 50], distanceM=[1, 2], lagS=0.6, leashM=6, keepCentreClearDuring=['combat', 'race', 'cutscene', 'puzzle']),
   actions=[dict(id='upside_down', name='Float upside down', by='mew', what='At the top of her view, tail wagging'),
            dict(id='magic_blob', name='Throw a magic blob', by='mew', what='Bursts into petals and sparkles on her screen, harmless'),
            dict(id='circle', name='Happy circle', by='mew', what='When she does well, or laughs on voice'),
            dict(id='bubble_nap', name='Bubble nap', by='mew', what='Curls up in a bubble; she can carry it'),
            dict(id='point_way', name='Point the way', by='mew', what='Flies ahead to the next place and looks back'),
            dict(id='boop', name='Boop its nose', by='honoree'), dict(id='berry', name='Toss a glowing berry', by='honoree'), dict(id='tickle', name='Tickle', by='honoree', what='It spins')],
   reveal=dict(cutscene='finale', becomes="the owner's character")),
 players=[dict(id='honoree', displayName='{her}', gender='female', group='honoree', ride='her_carriage'),
          dict(id='owner', displayName='The Mew', gender='male', group='owner')]
         + [dict(id=f'friend_{k:02d}', slot=k, displayName=f'Friend {k}', gender='female' if k <= 7 else 'male', group='ladies' if k <= 7 else 'men') for k in range(1, 15)],
 templates=templates,
 weapons=[dict(id='starlight_sword', name='Starlight sword', **{'class': 'melee'}, vfx='ribbon trail'), dict(id='rapier', name='Starlight rapier', **{'class': 'melee'}, vfx='ribbon trail'),
          dict(id='petal_scythe', name='Petal scythe', **{'class': 'melee'}, vfx='petal arc'), dict(id='light_hammer', name='Hammer of light', **{'class': 'melee'}, vfx='shock ring'),
          dict(id='moon_bow', name='Bow of moonlight', **{'class': 'ranged'}, vfx='silver arrows'), dict(id='crystal_staff', name='Crystal staff', **{'class': 'ranged'}, vfx='prism bolts'),
          dict(id='glitter_blaster', name='Glitter blaster', **{'class': 'ranged'}, vfx='glitter bolts, homing star shards, bubbles or confetti'),
          dict(id='crystal_spikes', name='Crystal spikes', **{'class': 'ground_magic'}, vfx='spikes erupt in a line'), dict(id='luminous_roots', name='Luminous roots', **{'class': 'ground_magic'}, vfx='roots burst up in a ring'),
          dict(id='lotus_pillars', name='Lotus pillars', **{'class': 'ground_magic'}, vfx='pillars rise and trap'), dict(id='duo_burst', name='Team burst', **{'class': 'team'}, vfx='two friends on one enemy trigger a combined burst')],
 outfits=[dict(id='party_gown_rose', name='Rose party gown', slot='gown', audience='female_only', wearer='female', modest=True),
          dict(id='starlight_gown', name='Starlight gown', slot='gown', audience='female_only', wearer='female', modest=True),
          dict(id='silk_hijab', name='Silk hijab', slot='hijab', audience='all', wearer='female', modest=True),
          dict(id='flower_crown', name='Flower crown', slot='headwear', audience='all', wearer='any', modest=True),
          dict(id='royal_coat', name='Royal coat', slot='coat', audience='all', wearer='male', modest=True),
          dict(id='star_cape', name='Star cape', slot='cape', audience='all', wearer='any', modest=True),
          dict(id='knight_armour', name='Knight armour set', slot='armour', audience='all', wearer='any', modest=True)],
 story=dict(villain='the_hush', macguffin='The Great Birthday Lantern, cracked into 32 star shards', acts=[
  dict(id='act1', name='The ladies arrive', summary='Female friends ride in through the waterfall gate, cross the bridge, explore the palace and dress up.', skyPhase='morning', cutscenes=['arrival']),
  dict(id='act2', name='Her surprise', summary='She opens her link, rides in with the full aerial reveal, is welcomed with confetti, and the Mew bonds with her.', skyPhase='morning', cutscenes=['arrival', 'mew_bond']),
  dict(id='act3', name='The Hush falls', summary='The men arrive by flying ship; the Hush cracks the lantern into 32 shards and greys the land.', skyPhase='noon', cutscenes=['ship_docks', 'the_hush']),
  dict(id='act4', name='The 32 places', summary='Free each head, befriend creatures, play the game, beat the challenge, win the shard; saved people go to the palace.', skyPhase='afternoon', cutscenes=['enter_place', 'head_freed', 'boss_entrance', 'tournament']),
  dict(id='act5', name='Midnight', summary='Final boss, then the roof opens, the floating theatre forms, the cake, and the Mew becomes the owner.', skyPhase='night', cutscenes=['return_palace', 'finale'])]),
 clock=dict(mode='real_time_to_midnight', cycleMinutes=30, phases=[
  dict(id='morning', name='Morning', sunElevDeg=25, minutes=3), dict(id='noon', name='Day', sunElevDeg=60, minutes=10), dict(id='afternoon', name='Golden hour', sunElevDeg=12, minutes=4),
  dict(id='dusk', name='Dusk', sunElevDeg=-4, minutes=3), dict(id='night', name='Night', sunElevDeg=-30, minutes=10)],
  timeline=[dict(at='20:30', phase='morning', event='The ladies arrive, ride in, explore the palace and wardrobe', cutscene='arrival'),
            dict(at='20:45', phase='morning', event='She arrives: her ride, the aerial reveal, the welcome, the Mew bonds', cutscene='mew_bond'),
            dict(at='21:00', phase='noon', event='The men arrive by flying ship', cutscene='ship_docks'),
            dict(at='21:10', phase='noon', event='The Hush cracks the lantern; the quest begins', cutscene='the_hush'),
            dict(at='21:10', until='23:30', phase='afternoon', event='The Grand Path, the tournament, the bosses'),
            dict(at='23:30', until='23:50', phase='night', event='Final boss at the palace; everyone they saved gathers', cutscene='return_palace'),
            dict(at='00:00', phase='night', event='The roof opens, the floating theatre, the cake, the reveal', cutscene='finale')]),
 cutscenes=[dict(id='arrival', name='Arrival ride and aerial reveal', trigger='player joins', audience='joiner', seconds=60, skippable=True, shots=['docks', 'gate opens', 'ride through falls', 'aerial sweep', 'bridge', 'doors']),
            dict(id='mew_bond', name='The Mew bonds with her', trigger='honoree reaches the doors', audience='all', seconds=25),
            dict(id='ship_docks', name='Flying ship docks with the men', trigger='men join', audience='all', seconds=20),
            dict(id='the_hush', name='The Hush', trigger='21:10 or host start', audience='all', seconds=45, shots=['sky darkens', 'lantern cracks', '32 shards streak out', 'colour drains']),
            dict(id='enter_place', name='Entering a place', trigger='group arrives at a place', audience='all', seconds=8, reusable=True, skippable=True),
            dict(id='head_freed', name='A head is freed', trigger='challenge won', audience='all', seconds=10, reusable=True),
            dict(id='boss_entrance', name='Boss entrance', trigger='boss challenge starts', audience='all', seconds=12, reusable=True),
            dict(id='tournament', name='Tournament entrance', trigger='arrive at B08', audience='all', seconds=20),
            dict(id='return_palace', name='Return to the palace', trigger='last shard before the final boss', audience='all', seconds=30),
            dict(id='finale', name='Midnight finale and reveal', trigger='celebrationAt', audience='all', seconds=300, skippable=False, music='choir_theme',
                 shots=['roof opens', 'floor rises', 'pavilions and waterfalls form the theatre', 'jellyfish and dragons', 'cake cut by ribbons of light', 'slices float to guests', 'the Mew glows gold and becomes the owner'])],
 captures=[dict(id=i, when=w) for i, w in [('aerial_reveal', 'the aerial reveal'), ('head_freed', 'each head freed'), ('race_finish', 'every race finish'), ('boss_down', 'boss purified'),
            ('ship_group', 'group on the flying ship deck'), ('mew_nap', 'the Mew asleep in its bubble'), ('finale', 'the whole midnight finale')]],
 music=[dict(id='choir_theme', name='Choir theme', use='finale'), dict(id='palace_theme', name='Palace theme', use='palace and wardrobe'),
        dict(id='adventure_theme', name='Adventure theme', use='travel'), dict(id='battle_theme', name='Battle theme', use='bosses and arena'), dict(id='tournament_fanfare', name='Tournament fanfare', use='B08')],
 sky=dict(layers=[dict(id='aurora_drapes', what='Sky drapes / aurora curtains', render='long wavy additive strips', phases=['dusk', 'night'], texture='web-pack/fx/aurora.png'),
                  dict(id='ribbons', what='Magical streams and ribbons flowing through the air', render='scrolling additive ribbon meshes', texture='web-pack/fx/ribbon.png'),
                  dict(id='floating_stones', what='Mountain-size floating stones', render='few large meshes with image-card far LOD'),
                  dict(id='lanterns', what='Floating lanterns', render='instanced cards', phases=['dusk', 'night'], texture='web-pack/fx/lantern.png'),
                  dict(id='stardust', what='Air particles, fireflies, stardust', render='GPU points', texture='web-pack/fx/glow.png'),
                  dict(id='rainbow', what='Rainbows', render='one shader arc', phases=['noon', 'afternoon'])]),
 assets=[],
 quality=[dict(id='low', maxTris=600000, maxDrawCalls=250, shadows='none', nearRadiusM=60, particles=3000, bloom=False, pixelRatio=0.75, fullAvatars=6),
          dict(id='medium', maxTris=1500000, maxDrawCalls=500, shadows='sun_1024', nearRadiusM=120, particles=12000, bloom=True, pixelRatio=1, fullAvatars=10),
          dict(id='high', maxTris=4000000, maxDrawCalls=900, shadows='sun_2048', nearRadiusM=200, particles=40000, bloom=True, pixelRatio=1.5, fullAvatars=15)],
 net=dict(party=dict(friends=14, maxPlayers=16, voiceCallRangeM=60, stateHz=10,
   scaling='Boss health and wave size grow with the players present (base x (0.5 + 0.1 x players)); party hearts = 3 + players / 2; team games need at least half the party for every node or slot.'),
   messages=['join', 'state', 'emote', 'capture', 'activity_start', 'activity_result', 'shard', 'cutscene', 'mew_action'])
)
# web pack trees as assets
for n, sp in [('pine', 'fjord_taiga'), ('ancient_oak', 'temperate_forest'), ('ember', 'blossom_groves'), ('bonsai', 'blossom_groves'), ('wisteria', 'blossom_groves'), ('fern', 'temperate_forest')]:
    data['assets'].append(dict(id=f'tree_{n}', source='web_pack', kind='plant' if n == 'fern' else 'tree', near=f'web-pack/trees/{n}.glb', card=f'web-pack/trees/{n}-impostor.webp', biomes=[sp]))
for n, sp in [('tree', 'temperate_forest'), ('bush', 'flower_meadow')]:
    data['assets'].append(dict(id=f'tree_{n}', source='web_pack', kind='tree' if n == 'tree' else 'plant', card=f'web-pack/trees/{n}-impostor.webp', biomes=[sp], notes='image card only'))
extra = f'{H}/assets_survey.json'
if os.path.exists(extra): data['assets'] += json.load(open(extra))
place_assets = {}
for a in data['assets']:
    for pid in a.get('places', []): place_assets.setdefault(pid, []).append(a['id'])
for pl in data['places']:
    if pl['id'] in place_assets: pl['assets'] = place_assets[pl['id']]
data['world']['arrival'][1]['at'] = dict(x=-710, z=11158); data['world']['arrival'][0]['at'] = dict(x=-710, z=12158)
data['world']['heightmap'] = 'art-references/world-fill/terrain/ (crescent version, Oct 16)'
import scenes; scenes.apply(data)
json.dump(data, open(f'{H}/game-data.json', 'w'), indent=1, ensure_ascii=False)
import jsonschema
jsonschema.validate(data, json.load(open(f'{H}/game.schema.json')))
ids = {c['id'] for c in data['creatures']}; cids = {c['id'] for c in data['characters']}; tids = {t['id'] for t in templates}
bad = [(p['id'], x) for p in places for x in p['creatures'] + [p.get('boss')] if x and x not in ids] + [(p['id'], p['head']) for p in places if p['head'] not in cids] + [(p['id'], a['template']) for p in places for a in (p['game'], p['challenge']) if a['template'] not in tids]
print('valid;', len(places), 'places,', len(chars), 'characters,', len(data['creatures']), 'creatures,', len(data['assets']), 'assets; night path', sum(1 for p in places if p['schedule'] == 'night'), '; broken refs', bad)
