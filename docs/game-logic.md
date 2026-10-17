# Game logic

The quest, the Mew, the mini-games, the sky ship and the clock-driven sky. Everything
reads `data/game-data.json`, a copy of the game schema (`design/game-schema/game-data.json`
on the design branch). When the schema changes, copy the new file over this one.

## The story, as the game runs it

| Act | What happens | How it starts |
| --- | --- | --- |
| 1 The ladies arrive | Friends explore, dress up, play any place's game | Opening the game |
| 2 Her surprise | Her grand welcome; the Mew appears and follows her | She joins with `?key=` |
| 4 The 32 places | The Hush cracks the Great Lantern over the palace into 32 shards, the world greys, every pillar turns grey and the Grand Path lights its first stop gold | 21:10 on the night (automatic), or the owner presses Shift+H |
| 5 Midnight | All 14 Grand Path shards are home: back to the palace | Last Grand Path place freed, midnight, or Shift+F |

At each place, walk up to its head (the veiled figure under the label) and press **E**.
The place's game starts for everyone; win it, then its challenge, and the head is freed:
the shard flies to the Great Lantern and some colour comes back to the world. Shards won
during the week count on the night. A freed place can be replayed for fun.

Light pillars mark all 32 places from far away: blue before the Hush, grey after it,
gold for the next Grand Path stop, pink while a game runs there, mint once freed.

**M** (or ⛵) opens the map. The sky ship lifts you onto its deck and sails there, first
person. After the Hush the whole party boards together.

## Cinematic scenes (`js/game/cinema.js`)

All 17 schema cutscenes play as live camera moves in the world (letterbox, subtitles, a soft
babbling voice per speaker; the Mew only mews). Each shot type in `cinema.shotTypes` is one
camera move round its subject. A reusable scene plays in full the first time on a device and
in its short version after that; `Skip` ends a reusable scene for you, while unique scenes
need a majority vote and the finale cannot be skipped (except by the director).

| When | Scenes |
| --- | --- |
| Opening the game (not the Mew) | arrival: docks, waterfall gate, aerial reveal, bridge, palace doors |
| She opens the game | arrival, then her welcome, then mew_bond for everyone |
| A gentleman joins once she is here | ship_docks: a sky ship brings him to the palace |
| The Hush | the_hush |
| Reaching a place (by ship or on foot) | travel while sailing, then enter_place (tournament at B08) and, after the Hush, meet_people with a villager speaking the place's greet line |
| A place's game starts (after the Hush) | frozen_head with the head's plea |
| A boss challenge starts | boss_entrance |
| A head is freed (you are nearby) | head_freed, shard, farewell, using the head's dialogue |
| Every Grand Path shard home | return_palace |
| Midnight (Shift+F) | finale; its gold-glow shot reveals the owner if he is online |

`?scenes=0` turns scenes off, `?scenespeed=4` plays them faster for testing.

## The eight templates (`js/game/activities.js`)

| Template | In the game |
| --- | --- |
| harmony_puzzle | Glowing pads round the head; all must be lit at once. Each stays lit a few seconds after you step off (longer when you are fewer) |
| race | Eight rings round the place in order, then back through the first |
| arena_defence | Three waves of eyeless shadow-glass creatures spiralling in; the last wave has a big one |
| boss_purification | The boss floats over the place; shoot its orbiting weak spots through two phases, step out of red circles before they burst |
| party_game | Bubbles rise; pop enough as a team before the timer (gold ones count three) |
| escort | A lantern spirit crosses the place; shoot the wisps before they drink its light |
| gather_build | Pick up the glowing pieces and carry them to the golden circle; each one adds a layer |
| heart_quiz | Questions on screen for everyone; anyone answers. Questions live in `js/config.js` (`quiz`) |

Weapons: click to loose starlight (ranged), Q to swing the sword (melee). Taking hits dims
your light; at zero it comes back after three seconds.

## The Mew (`js/game/mew.js`)

The owner joins with `?mew=<mewKey>` (see `js/config.js`) and flies the Mew: WASD, Space
up, C down, Shift faster. 1 upside down with tail wagging, 2 magic blob (petals burst on
her screen), 3 happy circle, 4 bubble nap (press 4 again or move to wake), 5 point the way,
X mew. Let go of the keys and it follows her by itself, 30-50 degrees off the centre of her
view and 1-2 m away, never more than 6 m. During games it moves wider so it never blocks
her aim. Without the owner online it does all of this on its own. Its eyes are closed and
smiling, it only makes mew sounds, its name shows as Mew, and the owner's microphone is off.

She can click it or press F to boop its nose, G to toss it a berry, H to tickle it, and E to
carry it while it naps in its bubble. The owner sees a note each time.

At midnight (or after Shift+F) the owner presses **Shift+R**: the Mew spins up in light and
the owner's own avatar stands there instead.

## The clock (`js/game/clock.js`)

On the night (from 20:30 on the 22nd, local time) the sun follows the schema timeline:
morning at 20:30, high day from 21:00, a long golden afternoon, dusk at 23:30, night from
23:45, the celebration at midnight. On every other day the sky runs a 30 minute day/night
loop so friends exploring early see it all.

## Owner keys (the Mew, or anyone with `?director=1`)

Shift+H the Hush now · Shift+N win the running game · Shift+F midnight finale ·
Shift+0 reset the quest.

## Testing

`?phase=noon|morning|afternoon|dusk|night` pins the sky, `?time=21:40` pretends it is that
time on the night, `?act=4` starts in that act (no Hush cutscene), `?mewtest=1` shows an
AI Mew following you, `?quality=low` for weak machines.

## Waiting on the owner and the study thread

- All 32 places take their positions from the schema.

## The crescent world (`js/world/crescent.js`, `js/world/fill.js`)

The ground is the study thread's crescent terrain (`data/world/crescent-h.bin`, 1024 x 1024,
about 20 m a cell, and its painted colour map), with Lantern Lake, the palace terraces, the
causeway and the district pads laid on top. The 1,521 placed models of the world fill
(`data/world/placements.json`) draw as one InstancedMesh per model. Each model has a near
copy (about a quarter of the layout triangles, 1024 px texture, `data/world/near/`) and a
far copy (about 4%, 256 px, `data/world/far/`); copies load as you come within range
(landmarks 450 m / 7 km, buildings 300 m / 3.5 km, props 140 m / 1.2 km, shorter on Low).
They are made from the layout GLBs with a position-welded simplify; the script is in the
thread's notes. Players can walk through the placed models for now.
- Her name, the friends list, the quiz questions about her, and the reveal line are in
  `js/config.js`.
- The real arrival (docks, waterfall gate, aerial reveal) and the finale's floating
  theatre are not built yet; the existing welcome cutscene and celebration stand in.
