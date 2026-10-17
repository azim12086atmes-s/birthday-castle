# Magic effects plan (owner, Oct 17 14:40)

The owner asked for scenes that feel magical: bioluminescence, magical particles, and colourful ribbons
of light moving through the air (some swift, some spiralling). We should study Golden Thread and take
all of its assets and VFX. The game should be more cinematic than Golden Thread in models, story,
cutscenes, events, riding, animal movement, landscapes and luminous, dynamic scenery.

This file is the plan. The game code (PR #2, `js/world/effects.js` and friends) implements it. The
Golden Thread source is read-only. Its modules are TypeScript for Three.js 0.186, so port them to
plain JS. Its paths are on branch `3d-builds` of azim12086atmes-s/Golden-Thread.

## 1. What the screenshots show today (design/world-fill/ren/game-2026-10-17c/)

- The stardust motes are big, soft bokeh balls that cover the view, worst at night. They read as a
  dirty lens, not magic. Genshin and Infinity Nikki use **small, sharp sparkles** with a tight halo.
  Make motes 70-80% smaller: a 2-6 px core plus a small halo, fewer within 15 m of the camera, and a
  twinkle.
- The air has no ribbons yet, apart from the static aurora. The ground and plants do not glow at night.
- The great ridge reads brown from the air because the game's own rock shading covers the baked
  colour map, which has snow above 2.5 km. Please let the baked colour lead on the outer ring.

## 2. Look rules

- **Palette**: gold `#ffd27a`, cyan `#6fe8ff`, rose `#ff9bd6`, lilac `#b89bff`, mint `#8dffcf`,
  pearl `#fff4e6`. Each system picks 2-3 of these. Light in shade is blue-violet.
- **Additive blending, depthWrite off, toneMapped off.** Only magic is brighter than 1.0, so bloom picks
  it out: bloom threshold about 0.85, strength about 0.6, radius about 0.4.
- **Nothing has eyes**: no eyes on any creature, ribbon creature, kite or spirit.
- **Everything moves on the GPU**: one draw per system, and the CPU only respawns.

## 3. Systems

### A. Ribbons of light (new; the owner's main ask)
One `InstancedBufferGeometry` holds a strip of 48-64 segments. Each instance is one ribbon. The vertex
shader computes the centre line from the ribbon's kind and time, then turns the strip edge-on to the
camera around the tangent. Width tapers at head and tail. A colour gradient runs along the length,
with a slow hue drift (iridescence) and a scrolling sparkle noise.

Instance data: `kind, seed, centre (vec3), radius, height, speed, length, width, colourA, colourB`.

| kind | motion | where |
|---|---|---|
| `swift` | fast swooping S-curves that dart, bank and loop, like an Anemo streak; 6-14 s life, then respawn | open meadows, over the lake, behind sky ships |
| `spiral` | helix rising round an axis, radius shrinking upward, the GT sky-isle idea but animated | palace spires, sea pillars, sky isles, the great tree, light pillars of freed places |
| `drift` | lazy sine-wave flow along the wind (`wind.ts` direction) | valleys, glowwood, the moat between the palace cliffs |
| `braid` | 2-3 ribbons twisting round one path | royal road at night, the arch bridges |
| `orbit` | circles a moving target at 1-3 m | Mew (always one pale-gold ribbon), her avatar after the reveal, each player's pet |
| `trail` | follows a ride's last 2 s of motion | every flying ride, the sky ship, dragons and sky whales |
| `aurora` | tall curtains (GT `Sky.ts` `auroraMaterial`) | night sky over the ridge |

Budget per tier (Low / Medium / High): 24 / 64 / 140 ribbons, all in one draw. The 1-3 nearest
spawners get ribbons; far spawners fade out by 1.5 km.

### B. Bioluminescence (Avatar's Pandora by night)
- **Glow by night**: plants in glowwood, blossom and flower meadows get an emissive mask that pulses
  slowly (0.2-0.5 Hz, phase from world position). Their strength follows the clock's `night`, 0 at day.
- **Footstep light**: at night, every player, pet and creature leaves soft cyan-violet rings on the
  ground. Each ring spreads to 1.5 m and fades in 2 s, like Pandora's moss. Draw the rings as a
  ring-buffer decal (one quad pool), not one light per step.
- **Glowing moss and veins**: cyan moss on the palace cliffs and arch bridges, and faint gold veins in
  the stone, from the emissive channel of the new cliff/arch kit.
- **Living water**: plankton sparkles where waves meet the shore and in the wake of boats, rides and
  swimmers, plus glowing water lilies and lotus (GT `Water.ts` `lotusSpots`).
- **Fungi and flowers**: glowing mushrooms in glowwood, and flowers that open and light up at dusk.

### C. Particles (one GPU points system, several modes)
Base it on GT `Atmos.ts` (motes with `uMode`: spores, glitter, embers) and the motion kinds in
`PartyAir.ts` (fall, flutter, rise, drift, rain, swirl, hover). Each biome blends its own mix:

| mode | look and motion | biomes |
|---|---|---|
| fireflies | warm dots low over grass, blinking (GT `atmosphere.ts`) | meadows, forest edges, after dusk |
| spores | cyan/violet motes rising slowly, swaying | glowwood, jungle, the moat |
| glitter | fine white sparkles that twinkle near the player | everywhere, very light |
| petals | pink and white, fluttering down and drifting | blossom, palace gardens, the arrival |
| seeds | dandelion fluff floating on the wind (Infinity Nikki) | grassland, alpine meadow |
| bubbles | iridescent soap bubbles rising and popping | near water, lagoons, fountains |
| crystalflies | tiny darting lights that flee when you come close (Genshin) | cliffs, ruins, relics |
| stardust | slow falling star specks at night | open sky, sky isles |
| embers | gold sparks above lanterns and braziers | villages, royal road |
| butterflies and dragonflies | GT `Atmos.ts` instanced wings; no eyes | meadows by day, water by day |

Counts (Low / Medium / High): 1.5k / 4k / 9k points round the viewer, wrapped as now.

### D. Light and the cinematic camera
- **God rays**: GT `Atmos.ts` beams (`BEAM_VERT` / `BEAM_FRAG`), through clouds, forest gaps and the
  palace's glass roof.
- **Halos**: on lanterns and lamps, and a lens flare on the sun and moon (GT `SkyFX.ts` halo sprite).
- **Grading**: per act: warm gold for the arrival; the Hush desaturates to grey-blue with ash
  particles; freeing a place pushes saturation up; the finale brings night violet with gold highlights.
- **Cutscene camera**: depth of field, gentle vignette, letterbox bars, and camera paths with ease-in
  and ease-out. Hold each shot long enough to read.

### E. Sky magic
Port these from GT:
- aurora curtains (`Sky.ts` `auroraMaterial`);
- the rainbow ribbon (`Sky.ts` `rainbowGeometry` / `rainbowMaterial`);
- constellations (`SkyOrnaments.ts`);
- shooting stars and fireworks (`SkyFX.ts`);
- the nebula glow over the sky isles (`skies.ts`);
- sky lanterns (`SkyLanterns.ts`).

Go beyond GT in three ways:
- **At midnight** the constellations draw a heart and her initial, then dissolve into a meteor shower.
- **Rising lanterns** leave tiny ember trails.
- **Sky whales and jellyfish** leave `trail` ribbons.

### F. Water
- From GT, take the foam crests just over the bloom threshold (`Water.ts`), the river flow
  material, and waterfalls and fountains (`flowWater.ts`).
- Add more:
  - glowing spray at the white waterfall gate;
  - ripple rings under rides that skim the water;
  - fog banks at night that drift through the moat round the palace cliffs.

### G. Dynamic scene events
| event | what happens |
|---|---|
| arrival | a petal storm as the waterfall curtain parts; swift ribbons stream through the gate with the camera |
| place freed | a **restoration wave**: a ring of colour spreads 600 m from the head, the grass and flowers re-grow and light up, and a burst of spiral ribbons climbs the light pillar to the Great Lantern |
| the Hush | colour drains outward from the lantern; particles turn to grey ash; ribbons slow, fade and fall |
| starfall (23:00) | stardust thickens; crystalflies gather at the palace |
| finale (00:00) | aurora surge, 1,000 lanterns, ribbons spiral up every palace spire, the glass roof opens, fireworks, then the constellation heart and the meteor shower |
| weather | GT `Weather.ts`: a light rain with glowing drops and a morning mist over the lake; never at the finale |

### H. Creatures and riding (beyond Golden Thread)
- **Flyers**: bank into turns, beat their wings faster while climbing, glide when descending, flare
  their wings to land.
- **Walkers**: a procedural gait with leg phase from speed. The head turns toward the player (no eyes,
  just head direction). The tail and ears follow on a spring.
- **Flocks**: birds, jellyfish, fish and butterflies flock (boids), as one instanced draw per flock.
- **Rides** carry momentum and drift. Flyers glide, dive and boost.
  - **Speed effects**: a `trail` ribbon, wind streaks and a small FOV kick.
  - **Landing effects**: dust, splash or petals.
  - **Glow**: each mount's glow pulses with its speed.
- **GT modules to start from**:
  - `event/Dragon.ts` (saddles);
  - `creatures/Dragons.ts` and `dragonKit.ts` (circling dragons);
  - `animals/behaviour.ts` (day and night animals);
  - `traffic/creatures.ts` (piece motion about a pivot);
  - `vehicles/vehicles.ts`.

## 4. Port list from Golden Thread (`3d-builds`)
| GT file | take |
|---|---|
| `src/world/Atmos.ts` | motes with modes, god-ray beams, butterflies, dragonflies, fireflies |
| `src/world/atmosphere.ts` | which air lives where, as data |
| `src/world/PartyAir.ts` | the 7 particle motion kinds |
| `src/world/RegionFX.ts` | per-region particles, and the night colour that switches to glow |
| `src/world/Sky.ts` | sky dome, stars, aurora and rainbow ribbon materials |
| `src/world/SkyFX.ts` | fireworks, shooting stars, halo, night dome, light beams |
| `src/world/SkyOrnaments.ts` | constellations |
| `src/world/SkyLanterns.ts`, `lanterns.ts` | sky lanterns and lantern designs |
| `src/world/FestivalAir.ts` | streamers and kites; the sky-isle light ribbons (make them animated) |
| `src/world/Weather.ts` | rain, mist, flurries |
| `src/world/wind.ts` | `WIND_GLSL` and `swayMaterial` for grass, trees and ribbons |
| `src/world/Water.ts`, `flowWater.ts` | water, foam, lotus, waterfalls, fountains |
| `src/world/Meadow.ts` | grass, flowers and crystal cells near the player |
| `src/creatures/*`, `src/event/Dragon.ts`, `src/animals/behaviour.ts`, `src/traffic/creatures.ts` | creature and ride motion |
| `src/story/CakeScene.ts` | the cake for the finale |

## 5. Order of work
1. Shrink and sharpen the motes (quick win), then the ribbon system A, starting with `orbit` round Mew and `spiral` round the palace spires.
2. Night bioluminescence B: emissive pulse, footstep rings, shore plankton.
3. Particle modes C per biome.
4. Events G: restoration wave, Hush, then the finale.
5. Light D and sky E, then the creature and ride motion H.

Performance: at most 8 extra draws for all VFX on High. Everything is distance-culled; Low keeps
ribbons, motes and the finale only.
