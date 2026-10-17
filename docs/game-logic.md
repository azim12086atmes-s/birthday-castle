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
person. After the Hush the whole party boards together. The Mew takes no seat: it hovers
just off her right shoulder for the whole ride.

## Playing it (`js/game/progress.js`)

- First visit: a how-to-play card, then a companion to pick from the 8 schema pets (eyeless; it follows you on every screen).
- The quest panel always names the current goal: explore and win games before the Hush, the next Grand Path stop after it, the palace at the end. Before the Hush its arrow points to the nearest place not yet freed.
- Every win earns starlight (game 15, challenge 30, boss 45, replay 5) and levels: a steadier aim and a faster recovering light. A results card shows the time, stars and what's next.
- In fights the party has hearts (2 + players). Each time someone's light goes out one is lost; at none the game is lost and the head can be asked again.
- The story moves on with play: on other days the Hush falls 4 minutes after she arrives (or when she wins a shard), or after 3 shards if she isn't there; on the night at 21:10. The finale starts at midnight on the night, or on other days as soon as the Grand Path is done and someone is at the palace.

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
causeway and the district pads laid on top. The 3,138 placed models of the world fill
(`data/world/placements.json`) draw as one InstancedMesh per model. Each model has a near
copy (about a quarter of the layout triangles, 1024 px texture, `data/world/near/`) and,
further out, a picture card (`data/world/cards/`, 8 views round the model; the shader shows
the one facing the camera, half size on Low and Medium); both load as you come within range
(landmarks 450 m / 7 km, buildings 300 m / 3.5 km, props 140 m / 1.2 km, shorter on Low).
Sky isles, sky citadels and the far citadels on the great ridge keep their own height and
reach three times as far; while one has no card it draws its near copy from afar.
They are made from the layout GLBs with a position-welded simplify; the script is in the
thread's notes. Players can walk through the placed models for now.
- Her name, the friends list, the quiz questions about her, and the reveal line are in
  `js/config.js`.
- The white waterfall gate (`js/world/gate.js`, kit in `data/world/gate/`) stands under the
  arch in the south gap; its veil parts when someone comes within 400 m on the gate axis or
  the arrival scene reaches the falls. The docks and the finale's floating theatre are not
  built yet.

## Magic in the air (`js/world/magic.js`)

Following the study thread's plan (design/vfx/README.md on PR #1):
- **Sparkles:** small, sharp sparkles fill the air round the viewer. They come in six moods, and the land under the camera sets the mix: glitter everywhere, fireflies low over meadows at night, spores in glowwood, petals by blossom and the palace, seeds on grassland by day, and stardust high up at night.
- **Ribbons of light:** one instanced draw holds all of them, 24, 64 or 140 by quality tier.
  - Swift streaks and lazy drifts round the viewer.
  - Spirals up the palace spires and the light pillars of places within 1.5 km.
  - A pale gold orbit round the Mew, and small ones round pets.
  - A trail behind your sky ship.
- **Night glow:** at night, footsteps leave cyan-violet light rings. The teal-violet glowwood and the blossom meadows in the land colour map breathe light.
- **Events:**
  - Freeing a place sends a ring of colour 600 m out, with spirals climbing towards the lantern.
  - The Hush turns sparkles to grey ash and fades the ribbons.
  - The finale doubles the spire spirals and adds a meteor shower.
- **Great ridge:** on the outer ring the baked colour map leads; the game adds no rock or snow there.
