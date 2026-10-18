# How Arkenfall is built, and what we take from it

Studied on Oct 18, 2026 in the owner's Chrome: I loaded the game, measured it, and read how it's put together. The in-game screenshots timed out on that machine, so movement feel comes from the game's own tuning numbers rather than from playing hands-on. Everything here is technique. We rebuild it in our own code; none of Arkenfall's code or art is copied.

## The big picture
- **Everything is procedural.** There isn't a single model, texture or sound file; the only downloads are about 4 MB of JavaScript and a few painted loading pictures. Characters, trees, houses, rocks, the sky and the sound are all generated in code. That's why it all looks like one world: a single art direction runs through every piece.
- **The title and loading pictures are painted art**, not in-game frames. The real in-game target is the meadow behind the menu.
- **It's cheap to draw.** One frame of the menu meadow took about 160 draw calls and 1.6M triangles. Our meadow took 2,300 and 7.4M before PR #6, and about 570 and 3.2M after it.
- **Heavy work runs off the main thread.** Five web workers build terrain, vegetation, structures and sound.

## Camera and controls (why it looks cinematic)
- It's a **third-person** camera that sits **4.9 m behind** the player, with the pitch almost level (**about 5°** down). The pivot is at **1.36 m**, and the field of view is **55°**. Because the camera sits low and level, grass fills the bottom of the frame and the horizon sits mid-screen. That framing does a lot of the "AAA" look.
- The camera follows on a spring with look-ahead. Probe rays at ±0.44, ±0.8 and ±1.25 m stop it clipping into walls.
- Moods blend smoothly: sprint, combat, explore, boss, cave, swim and death each shift the camera. On top of that sit a trauma-based shake that decays, small kicks, and a breathing sway.
- Mouse sensitivity is 0.0045 / 0.003. It supports a PlayStation controller.

## Movement numbers
| Setting | Value |
|---|---|
| Walk / run / sprint | 1.55 / 5.6 / 8.4 m/s (matched to the animation clips) |
| Ground acceleration / deceleration | 36 / 30 (sprint deceleration 22) |
| Air acceleration / air drag | 2.4 / 0.25 |
| Jump speed | 8.7 m/s; gravity 26 × rise 1, cut 2 (early release), fall 1.4; max fall speed 42 |
| Coyote time / jump buffer | 0.13 s / 0.16 s |
| Mantle (climb up ledges) | 0.5–2.2 m |
| Stamina | regen 34/s after 0.75 s; sprint 13/s, dodge 18, hop 13 |
| Swimming | 2.5 m/s (sprint 4.1); enters at 1.18 m depth |
| Slopes | starts sliding past a normal Y of 0.74; friction 0.34, top speed 14 |
| Fall damage | from 14 m |
| Player body | radius 0.38 m, height 1.8 m, 100 health |

## Combat feel
- Each attack has its own data: duration 0.54 s, damage 12, stagger 8, knockback 2.5, reach 2.5 m, magnet 1.6 m (aim assist that pulls you onto the target), hit-stop 0.05 s, camera shake 0.13, and a FOV kick of −3°.
- A dodge in the last instant of a blow slows time. Some enemies (Knotguards) raise shields.
- Animation is procedural, with inverse kinematics (IK) for hands and feet. There are no motion-capture files.
- There are six enemy families plus a boss. Waystones are fast travel. Health and "mend burst" are shown on the HUD. The compass runs across the top of the screen.

## Grass and flowers (the biggest visual win)
- **The whole meadow is generated on the graphics card in one draw.** The CPU only sends the positions of the grass blocks near the camera. The graphics card works out each blade's spot from its instance number, reads the ground height from a height texture, and reads density and colour from a 256 m grass map.
- **Three layers:** full 3D blade clumps up close, sparser far fields, and flat cards furthest out. A depth-only pre-pass on the cards lets the graphics card skip pixels already covered by nearer grass.
- **Blocks are drawn nearest-first**, so the near grass hides the far grass early and cheaply.
- **Clumping and patches:** tussocks about 1.6 m across and stands about 5 m across. Lusher, taller, bluer patches sit beside thinner, yellower ones. Grass is cut to stubble along paths.
- **The colours are dark and saturated in linear space**, from moss through lush and meadow to sedge and dry straw, then brightened by the lighting and tone mapping. *Our grass is too light and lime; this is why.*
- **Interaction:** footsteps and attacks flatten the grass through a trail texture, and shock rings push it outward. The wind flicks each plant separately.
- **The flower mix is about 36% daisy, 27% poppy, 25% cornflower and 12% buttercup**, drawn in the same field system. There are no grass cards on the forest floor, where they "read as pasted stickers".

## Trees, rocks and props
- Each tree has 2 detailed models plus an impostor: views captured from several directions. Impostors blend only across the middle of each view sector. Trees crossfade between detail levels per tree. Anything within about 2 m of the camera dissolves, so you never see inside a crown.
- A per-vertex "flex" value drives the wind: 0 for a rigid trunk up to 1 for a leaf tip. Branches dip as they bend, so they keep their length. Rocks and logs skip wind entirely.
- Trees cast shadows through cheap proxy shapes when far away.
- Placement rules for every plant and rock: a minimum ground-normal Y (no steep slopes), clearance from roads, gaps from other objects, and distance from water. Special trees (a "hearth oak") stand at landmarks.
- Rocks carry moss on their upper ~60%, lichen rosettes and wet feet by the sea. Fine detail fades with on-screen size so it never sparkles.

## Terrain
- The terrain uses **CDLOD**, a level-of-detail quadtree where far patches smoothly morph into coarser ones, so there's no popping.
- Rock is textured from three sides at once (triplanar) on cliffs, and materials blend by height with noise. Several texture scales hide repetition from the air: about 5.7 m tiles up close and 29 m tiles past about 100 m.
- Forest litter (needles, ochre leaves) and stones are set into the grit. Terrain shadows are traced toward the sun over a height pyramid.
- Alpha cut-outs are kept off the terrain, because they disable early depth testing and cost about 40% more GPU time.

## Air, light and sky
- **Haze:** the village, woods and river stay crisp and saturated out to a few hundred metres. Blue aerial perspective belongs only to the far ridges, and the haze turns warmer toward the sun or moon. Ridges are hazed a touch darker and bluer than the sky's horizon so they read as layers.
- **Valley mist** lies in banks out in the valleys, never over the village or the path. Big banks about 10 km apart leave open blue lanes between them.
- **Cloud shadows** follow the real cloud clusters overhead.
- **Signature magic: "The Weft",** a glowing ribbon of woven cloth arching across the night sky. It is woven a little further through the night, with a warm shuttle glint at its front. One magical motif, tied to the story.

## Rendering pipeline and performance
- **A pixel budget instead of device pixel ratio:** about 1.0M pixels on low, 2.1M on medium and 2.4M on high. The resolution then steps down (1 → 0.87 → 0.75 → 0.62) whenever a frame runs over about 13 ms, which targets 75 fps.
- **Shadows only nearby:** a 1024/2048/3072 shadow map covering 130/200/220 m.
- **Post effects:** AgX tone mapping with a gentle punch, and anti-flicker bloom (3–5 levels). Volumetric light shafts render at ¼ resolution and ambient occlusion at ½, both upscaled with depth awareness. Then come FXAA, sharpening of 0.12–0.15, film grain of 0.012–0.014, and auto exposure metered on the land only. MSAA is off.
- **Water:** screen-space reflections against half-resolution depth, plus sun glitter.
- **No hitches:** every shader is pre-compiled during the loading bar (it stores timing for an accurate bar). Late shaders compile in the background. Draws are sorted by shader program, and visibility checks stop when their few-millisecond budget runs out.
- **Sound** is synthesised in workers, with reverb, 3D panning and filters. There are no audio files.

## Where we differ today
1. Our models are separate Meshy GLBs (the play site is 543 MB). They don't share one art style, so the "3D assets are out of place". Arkenfall has no models at all.
2. Our grass is CPU-placed clumps and too pale.
3. We render at device pixel ratio with no dynamic resolution, so weaker GPUs lag.
4. We're first-person by default. Arkenfall's low third-person camera is a big part of its look.
5. We have no shader warm-up, so the first look in each direction can hitch.

## Build plan (in order)
1. **Rendering core:** pixel budget with dynamic resolution, shader warm-up behind the loading bar, sorting by program, and short-range shadows. *This fixes the lag for everyone.*
2. **GPU meadow:** one-draw grass in three layers, dark linear colours, clumps and patches, trampling, and the flower mix.
3. **Camera:** Arkenfall-style low third-person (4.9 m, 5°, FOV 55) as an option or the default, plus springs, wall probes and shake.
4. **Movement:** their acceleration and jump model (coyote time, buffer, variable jump, mantle, stamina, slope slide).
5. **Look:** AgX tone mapping, anti-flicker bloom, ½-res AO, ¼-res light shafts, FXAA with sharpening and grain, auto exposure, valley mist banks, and cloud shadows from the real clouds.
6. **Our signature magic:** a golden thread ribbon that weaves across the night sky toward the Birthday Lantern, as the Weft does in theirs.
7. **One art direction:** replace the mixed Meshy props with procedural buildings in one style (Golden Thread's architecture code), keeping the palace.
