"""Cinematic scenes (owner, Oct 17: "I want the story to be cinematic and have scenes, from meeting people to other place visits").
Adds data['cinema'] (camera language and playback rules), scripted cutscenes with real shots, the reusable place-visit
scenes, a scene block per place (the local who greets you) and dialogue for every head. {her} is the honoree's name."""

# place: (local's name, local's greeting, head's plea from inside the grey glass, head's thanks when freed, farewell)
LINES = {
 'B01': ('Head Courtier', 'Welcome home, {her}. The whole palace has been waiting for you.',
         'The Hush is in the heart of the palace. Bring every shard home.',
         'You brought the light all the way home. Look up.',
         'Midnight is almost here. Go stand where the roof will open.'),
 'B02': ('A tide-child', 'The water stopped singing when the Hush came. Can you hear how quiet it is?',
         'Moonlight still answers you. Catch it for me.',
         'The lake remembers your laugh now. It will sing it back to you.',
         'We will sail the lanterns to the palace for your midnight.'),
 'B03': ('The youngest bell ringer', 'Our bells only ring in grey now. Will you help us find the tune?',
         'The rose window is dark. Only star beams can wake it.',
         'Listen. Every bell is ringing your name.',
         'We will ring you in at midnight, all of us at once.'),
 'B04': ('A squire', 'The Knight of Roses stood against the Thorn Golem alone. Now look at him.',
         'The thorns are around my heart. Cut them away, friends.',
         'Rise, friends of the Rose Keep. You fought like a story.',
         'The knights will ride ahead and keep the road clear for you.'),
 'B05': ('A young sage', 'Stay close to the lanterns. The mist forgets anyone who wanders.',
         'Bring the little light through the fog. Do not let it go out.',
         'The mist has lifted, and the mountain can see you.',
         'We will bring the clear sky with us to the palace.'),
 'B06': ('A lantern maker', 'We made a thousand lanterns for tonight, and every one went grey.',
         'Paint them again. Colour is stronger than shadow.',
         'Look how the sky fills. Every lantern carries a wish for you.',
         'Our lanterns will float above the palace at midnight.'),
 'B07': ('An echo keeper', 'These halls keep every kind word ever spoken here. The Hush is erasing them.',
         'Only someone who truly knows her can answer. Who knows her best?',
         'The echoes are back, and the loudest one says happy birthday.',
         'We will carry your echoes to the theatre tonight.'),
 'B08': ('The herald', 'Champions of every land have come to compete in your honour, {her}!',
         'The Shadow Champion wears my armour. Defeat it and set me free.',
         'Never has the arena seen such a team. The crowd is yours.',
         'Every champion will stand guard at your celebration.'),
 'B09': ('A gondolier', 'A hundred invitations, and no one to carry them. Hop in.',
         'The canals are still. Make the city move again.',
         'Every villa has its invitation. The whole city is coming.',
         'The gondolas will bring the whole city to the palace.'),
 'B10': ('A sun-child', 'The waterfalls turned to dust. The canyon is so thirsty.',
         'Turn the waters back to the canyon. It remembers the way.',
         'The canyon is singing with water again. The sun is pleased.',
         'We will bring the warmth of the canyon to your night.'),
 'B11': ('A cliff diver', 'Dare to jump? The sea is waiting below.',
         'The stone giant was our friend. Wake the friend inside it.',
         'The giant is smiling again. So is the sea.',
         'The giant will carry us to the palace on its shoulders.'),
 'B12': ('A baker', 'Flour everywhere and no cake! We need every hand.',
         'One layer from every land. Bake it together and it cannot crack.',
         'Smell that? That is the best cake layer ever baked.',
         'This layer goes straight to the palace. Do not peek.'),
 'B13': ('A miller', 'The wind still blows, but the sails refuse to turn.',
         'Turn the great sails together, all in time.',
         'Hear the sails creak? That is the windmill laughing.',
         'We will send the good wind ahead to carry you home.'),
 'B14': ('A sky builder', 'Our city hangs between the pillars, and the bridges are breaking.',
         'Build the bridge together. Every plank holds the next.',
         'You built something that will outlast us all.',
         'We will string bridges of light to the palace.'),
 'B15': ('A temple guardian', 'Four doors, four hands. The jungle only opens for friends.',
         'The vines obey those who trust each other.',
         'The jungle breathes again. Listen to the frogs sing.',
         'The jungle will bloom along your road home.'),
 'B16': ('A rower', 'Row with us! The Ice Serpent froze the fjord solid.',
         'Its heart is not ice. Find the warmth in it.',
         'The fjord is free and the whales are coming home.',
         'Our longboats will row the ice lanterns to your midnight.'),
 'B17': ('A little forest spirit', 'Shh. When night comes, the shadows come with it.',
         'Gather the fireflies. Hold the ruin until the dawn of colour.',
         'The fireflies remember you now. They will follow you anywhere.',
         'We will light the path to the palace with fireflies.'),
 'B18': ('A star fox', 'The great tree is sleeping, and its roots are thirsty.',
         'Bring the water spirits to my roots, little ones.',
         'I have stood for a thousand years, and I have never felt so loved.',
         'My blossoms will rain on your celebration.'),
 'B19': ('An otter', 'Mrrp! The shadow ship stole all our stars.',
         'Sail out and win back the harbour lights.',
         'The harbour sparkles again. The otters want to hold your hand.',
         'Every boat in the cove will sail to the palace tonight.'),
 'B20': ('A dove of light', 'Every step on this bridge used to make the water dance.',
         'Dance across the bridge. Wake the ripples.',
         'There. The water is dancing for you again.',
         'The bridge will light the way back to the palace.'),
 'B21': ('An apprentice astronomer', 'The shards fell all over the land. The telescope can show us where.',
         'Line up the lenses. The stars will point the way.',
         'Now the sky has a map, and every star on it leads to you.',
         'We will chart the midnight sky for your celebration.'),
 'B22': ('A seal', 'Arf! The lighthouse went dark and the ships are lost.',
         'Guide them through the storm. Be the light.',
         'The lighthouse shines again, brighter than it ever has.',
         'Our beam will cross the sky at midnight. Look for it.'),
 'B23': ('A pearl diver', 'The pearls of the sea pavilion hide when they are sad.',
         'Dive deep. The pearls rise for laughter.',
         'A string of pearls, one for every friend who dived.',
         'These pearls will shine at your midnight table.'),
 'B24': ('A reef child', 'Something huge is stirring beneath the coral.',
         'The Leviathan is in pain. Purify it and it will remember us.',
         'The reef glows again, and the Leviathan sings to you.',
         'The sea will come to the palace to watch your night.'),
 'B25': ('A glass gardener', 'Every flower in the conservatory turned to grey glass.',
         'Light makes glass bloom. Shine on my garden.',
         'Choose any flower you like. They all grew for you.',
         'The finest bouquet will wait for you at midnight.'),
 'B26': ('A dragon keeper', 'The Storm Dragon was our eldest, kindest dragon. Now it only roars.',
         'Ride the young dragons. Show the old one what joy looks like.',
         'Dragons never forget a friend, and now you have a hundred.',
         'At midnight, the dragons will paint the sky with fire for you.'),
 'B27': ('A bazaar trader', 'Welcome, travellers! Careful, the Hush hid our oasis in a mirage.',
         'Only true friends can see the real water. Find it together.',
         'The oasis flows again. Drink, rest, and take a lantern of sand.',
         'The desert will send its warmest stars to your celebration.'),
 'B28': ('An ice gardener', 'Snowball fight first, then work. That is the law here.',
         'Carve something beautiful together, and the frost will let go.',
         'The ice is clear as glass now, and it holds your reflection.',
         'We will carve the cake stand for your midnight.'),
 'B29': ('A crystal miner', 'Mind your heads! The caverns are humming the wrong tune.',
         'Find the true echo, and the crystals will sing it back.',
         'The caverns are glowing again. Take the brightest crystal.',
         'Our crystals will light the theatre at midnight.'),
 'B30': ('A cloud shepherd child', 'The baby sky whales are lost in the grey clouds.',
         'Guide the little ones home. They will follow kind voices.',
         'The whole sky is singing. The whales will never forget you.',
         'The sky whales will swim over the palace at midnight.'),
 'B31': ('A hummingbird', 'Bzzt! The meadow forgot its colours. Help us paint them back.',
         'Paint the field, and the flowers will wake.',
         'Every flower here is a little brighter because of you.',
         'The meadow will send a flower crown for your midnight.'),
 'B32': ('The ringmaster\'s assistant', 'Step right up! The fair is grey, but the fun is not over yet!',
         'Win the finals, and the fair will shine again.',
         'Ladies and gentlemen, the champions of the fair!',
         'The whole fair will march to the palace with music.'),
}

SHOT_TYPES = ['establishing_aerial', 'flyover', 'crane_down', 'crane_up', 'orbit', 'dolly_in', 'dolly_out', 'tracking', 'two_shot',
              'close_up', 'over_shoulder', 'pov', 'wide', 'insert', 'title_card', 'whip_pan', 'fade']

CINEMA = {
 'look': 'Letterbox bars slide in (2.35:1), shallow depth of field, a warm grade, and soft film grain. Every scene is a live camera in the game world, never a video.',
 'sync': 'The host starts a scene for everyone at the same moment (net message "cutscene" with id, place and start time), so all friends see it together.',
 'players': 'Friends stand on marks around the subject; first-person players see the camera cut. Their pets and the Mew stay in frame.',
 'voices': 'Characters speak in soft musical babble with subtitles, each with their own pitch. The Mew only mews. No voice acting needed.',
 'skip': 'A reusable scene plays in full the first time and in its short version after that. Unique scenes can be skipped only by majority vote, except the finale.',
 'pacing': 'A full place visit has about 90 seconds of scenes inside roughly 10 minutes of play, so the story never stalls the fun.',
 'shotTypes': SHOT_TYPES,
}

def S(type, seconds, what, **kw):
    d = dict(type=type, seconds=seconds, what=what); d.update(kw); return d

# the reusable scenes every place visit goes through, in order
PLACE_VISIT = [
 dict(id='travel', name='Travelling to the next place', trigger='the group sets off from a freed place', audience='all', reusable=True, skippable=True,
      seconds=20, shortSeconds=6, music='adventure_theme', shots=[
   S('tracking', 6, 'The group rides out together; the ship or their rides lift off', subject='group'),
   S('flyover', 8, 'Aerial journey over the crescent; the Mew flies ahead and looks back', subject='route'),
   S('title_card', 6, 'The next place rises over the horizon; its name writes itself in gold light', subject='place')]),
 dict(id='enter_place', name='Arriving at a place', trigger='the group arrives at a place', audience='all', reusable=True, skippable=True,
      seconds=15, shortSeconds=5, shots=[
   S('establishing_aerial', 6, 'Slow orbit high over the place, drained to grey by the Hush', subject='place'),
   S('crane_down', 5, 'Camera sinks to the plaza; the creatures hide', subject='plaza'),
   S('wide', 4, 'The group lands; the local runs up to them', subject='group')]),
 dict(id='meet_people', name='Meeting the people', trigger='after arriving', audience='all', reusable=True,
      seconds=15, shortSeconds=8, shots=[
   S('two_shot', 8, 'The local greets her and the group', subject='local', line=dict(who='local', key='greet')),
   S('over_shoulder', 7, 'The local points to the frozen head', subject='head')]),
 dict(id='frozen_head', name='The frozen head', trigger='the group reaches the head', audience='all', reusable=True,
      seconds=12, shortSeconds=6, shots=[
   S('dolly_in', 7, 'Slow push in to the head, frozen in grey glass; a faint glow pulses inside', subject='head'),
   S('close_up', 5, 'The voice from inside the glass', subject='head', line=dict(who='head', key='plea'))]),
 dict(id='befriend', name='Befriending the creatures', trigger='a creature is befriended for the first time here', audience='all', reusable=True, skippable=True,
      seconds=8, shortSeconds=3, shots=[
   S('close_up', 4, 'The creature peeks out shyly, then comes closer', subject='creature'),
   S('orbit', 4, 'It circles her and settles beside the group; a capture is taken', subject='creature', vfx=['sparkles'])]),
 dict(id='boss_entrance', name='Boss entrance', trigger='a boss challenge starts', audience='all', reusable=True,
      seconds=12, music='battle_theme', shots=[
   S('wide', 4, 'The ground shakes; the sky darkens over the place', subject='place'),
   S('crane_up', 5, 'The boss rises to full height', subject='boss', vfx=['shadow_mist']),
   S('title_card', 3, "The boss's name slams onto the screen", subject='boss')]),
 dict(id='head_freed', name='The head is freed', trigger='the challenge is won', audience='all', reusable=True,
      seconds=15, shortSeconds=8, shots=[
   S('close_up', 3, 'Cracks of light run through the grey glass', subject='head'),
   S('wide', 4, 'The glass bursts into petals; colour washes outward over the whole place', subject='place', vfx=['petal_burst', 'colour_wave']),
   S('two_shot', 8, 'The head thanks her', subject='head', line=dict(who='head', key='freed'))]),
 dict(id='shard', name='The star shard', trigger='after the head is freed', audience='all', reusable=True,
      seconds=8, shortSeconds=4, shots=[
   S('crane_up', 4, 'A star shard rises out of the place and floats to her hands', subject='shard', vfx=['star_trail']),
   S('insert', 4, 'The shard flies up to the lantern in the sky; the count ticks up (5 of 32)', subject='sky_lantern')]),
 dict(id='farewell', name='Farewell', trigger='the group leaves', audience='all', reusable=True, skippable=True,
      seconds=8, shortSeconds=4, shots=[
   S('wide', 8, 'The head and the people set off towards the palace, waving', subject='people', line=dict(who='head', key='farewell'))]),
]

SCRIPTED = [
 dict(id='arrival', name='Arrival ride and aerial reveal', trigger='a player joins', audience='joiner', seconds=60, shortSeconds=20, skippable=True,
      music='palace_theme', shots=[
   S('wide', 6, 'Dawn at the sea docks outside the crescent; her ride waits, sparkling', subject='docks'),
   S('tracking', 8, 'The ride sets off across the water towards the white waterfall wall', subject='ride'),
   S('close_up', 5, 'The waterfall veil parts like curtains; light pours through', subject='gate', vfx=['mist', 'rainbow']),
   S('pov', 6, 'Riding through the falls; spray, sparkles, then sudden calm', subject='gate'),
   S('establishing_aerial', 14, 'The camera soars up: the crescent of mountains, 32 places, the palace glowing in the middle', subject='crescent'),
   S('flyover', 9, 'Down along the long marble bridge; each step ripples in neon colours', subject='bridge'),
   S('crane_up', 7, 'Up the palace facade, gold petal arch, purple domes', subject='palace'),
   S('dolly_in', 5, 'The giant doors swing open', subject='palace_doors')]),
 dict(id='her_welcome', name='Her welcome', trigger='the honoree reaches the palace doors', audience='all', seconds=25, skippable=False,
      music='palace_theme', shots=[
   S('wide', 6, 'The great hall: her friends waiting in their party outfits', subject='hall'),
   S('close_up', 4, 'Her friends turn and cheer', subject='friends'),
   S('crane_up', 7, 'Confetti, petals and lanterns fill the hall; the banner reads Happy Birthday {her}', subject='hall', vfx=['confetti', 'petals']),
   S('two_shot', 8, 'The Head Courtier bows', subject='courtier', line=dict(who='palace_steward', text='Welcome, {her}. Tonight, this whole world is yours.'))]),
 dict(id='mew_bond', name='The Mew bonds with her', trigger='after her welcome', audience='all', seconds=25,
      shots=[
   S('insert', 4, 'A small pink glow tumbles down from the chandelier', subject='mew'),
   S('close_up', 6, 'The Mew, eyeless and smiling, floats upside down in front of her, tail wagging', subject='mew'),
   S('two_shot', 7, 'It boops her nose and mews', subject='mew', line=dict(who='mew', text='Mew!')),
   S('orbit', 8, 'It circles her once, and a ribbon of light ties them together', subject='mew', vfx=['bond_ribbon'])]),
 dict(id='ship_docks', name='The flying ship docks with the men', trigger='the men join', audience='all', seconds=20,
      music='adventure_theme', shots=[
   S('wide', 5, 'A shadow passes over the palace terrace', subject='sky'),
   S('crane_up', 8, 'The flying ship sails out of the clouds, sails glowing', subject='flying_ship'),
   S('tracking', 7, 'It docks at the terrace; the men step down the gangway', subject='flying_ship')]),
 dict(id='the_hush', name='The Hush falls', trigger='21:10 or the host starts it', audience='all', seconds=45, skippable=False,
      shots=[
   S('wide', 6, 'Everyone gathers under the Great Birthday Lantern', subject='lantern'),
   S('crane_up', 6, 'The sky darkens; a cold grey fog rolls over the mountains', subject='sky', vfx=['grey_fog']),
   S('close_up', 6, 'A crack runs across the lantern', subject='lantern'),
   S('wide', 8, 'The lantern shatters into 32 star shards that streak out across the world', subject='sky', vfx=['star_trails']),
   S('establishing_aerial', 8, 'Colour drains from the land, place by place', subject='crescent', vfx=['colour_drain']),
   S('close_up', 6, 'The Hush, a jealous shadow of fog and grey glass, speaks', subject='the_hush', line=dict(who='the_hush')),
   S('two_shot', 5, 'The Mew tugs her sleeve and points to the first place', subject='mew')]),
 dict(id='tournament', name='The Birthday Tournament', trigger='arrival at B08', audience='all', seconds=20, music='tournament_fanfare',
      shots=[
   S('establishing_aerial', 6, 'The colosseum, banners in every colour', subject='B08'),
   S('tracking', 8, 'The friends walk out into the arena; griffins fly overhead', subject='group'),
   S('title_card', 6, 'The herald announces the champions', subject='B08', line=dict(who='local', key='greet'))]),
 dict(id='return_palace', name='Return to the palace', trigger='the last shard before the final boss', audience='all', seconds=30, music='adventure_theme',
      shots=[
   S('establishing_aerial', 10, 'Night falls; every freed people travels to the palace in long lines of light', subject='crescent'),
   S('flyover', 10, 'Gondolas, longboats, dragons, sky whales and lanterns converge on the palace', subject='palace'),
   S('wide', 10, 'The Hush waits in the heart of the palace', subject='the_hush')]),
 dict(id='finale', name='Midnight finale and the reveal', trigger='celebrationAt', audience='all', seconds=300, skippable=False, music='choir_theme',
      shots=[
   S('wide', 20, 'The clock strikes midnight; the choir begins', subject='hall'),
   S('crane_up', 30, 'The glass roof opens like a flower', subject='palace_roof'),
   S('tracking', 40, 'The floor rises into the sky; pavilions and waterfalls form a floating theatre', subject='theatre'),
   S('flyover', 40, 'Jellyfish swarms, sky whales and dragons breathing flame light the sky', subject='sky', vfx=['jellyfish', 'dragon_fire', 'fireworks']),
   S('close_up', 30, 'The Mew cuts the giant cake with ribbons of light', subject='cake'),
   S('wide', 30, 'Slices float to every guest by magic', subject='guests'),
   S('two_shot', 40, 'The Mew glows gold and grows into the owner\'s human avatar', subject='mew', vfx=['gold_glow']),
   S('close_up', 30, 'He calls her name', subject='owner', line=dict(who='owner', text='Happy birthday, {her}.')),
   S('crane_up', 40, 'Everyone she saved fills the theatre and cheers', subject='theatre', vfx=['confetti', 'petals', 'fireworks'])]),
]

def apply(data):
    data['cinema'] = CINEMA
    data['cutscenes'] = SCRIPTED + PLACE_VISIT
    C = {c['id']: c for c in data['characters']}
    for p in data['places']:
        local, greet, plea, freed, farewell = LINES[p['id']]
        visit = ['travel', 'enter_place', 'meet_people', 'frozen_head', 'befriend']
        if p.get('boss'): visit.append('boss_entrance')
        visit += ['head_freed', 'shard', 'farewell']
        if p['id'] == 'B08': visit.insert(1, 'tournament')
        if p['id'] == 'B01': visit = ['return_palace', 'boss_entrance', 'head_freed', 'finale']
        p['scene'] = dict(local=local, greet=greet, sequence=visit)
        h = C[p['head']]
        h['dialogue'] = dict(plea=plea, freed=freed, farewell=farewell)
        h['lines'] = [freed]
    for a in data['story']['acts']:
        if a['id'] == 'act2': a['cutscenes'] = ['arrival', 'her_welcome', 'mew_bond']
        if a['id'] == 'act4': a['cutscenes'] = [c['id'] for c in PLACE_VISIT] + ['tournament']
    return data
