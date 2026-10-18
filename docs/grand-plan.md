# Castle: gap analysis and grand modular plan

As of Oct 18, 2026, 14:15 UTC. The celebration unlocks at 00:00 on Oct 23, about 4.4 days away.
Measured against the `play` branch (the live site) and the newest visual branch `claude/world-slice-qsc3ua` (PR #11/#12).
This builds on the world gap doc (https://claude.ai/code/artifact/283d22c7-b6ee-491f-b1fc-1afe514a8529) and `docs/arkenfall-study.md`; it does not repeat their terrain, grass, tree and water detail.

## 1. Verdict

Our world is being rebuilt to a real standard, but the game around it is not. The two things every player looks at every second, **their own character and the feel of moving**, are years behind all four references, and nobody owns them. The world also has **no single art direction**: realistic Meshy models, code-built toon palace and Golden Thread trees sit side by side, which is the first thing that makes a game look cheap.

The five biggest gaps, in order of what a player notices first:

1. **Characters.** Ours are lathe shapes with sine-swung limbs (`js/avatar.js`, 12 KB). Genshin and Infinity Nikki are character games first; Golden Thread already has a far better character in code (`src/characters/CharacterModel.ts`, 1,200 lines: body under cloth, swinging hems, painted fabric, wings, modesty rules) that we are allowed to reuse.
2. **One look.** 264 Meshy models in different styles (realistic PBR, stylised, sandstone, cathedral) next to a hand-coded toon palace. Arkenfall, Golden Thread, Genshin and Nikki each have exactly one art direction applied to every object. Ours ships 547 MB to get a mixed look; Arkenfall ships 4 MB and Golden Thread 2.2 MB to get a unified one.
3. **Feel.** First person by default, 6 / 12 m/s walk and run with no acceleration curve, no glide, no climb, no camera spring. Genshin and Nikki make movement itself the joy (glide, climb, float-jump, swim). In a dress-up game the player also never sees her own dress in first person.
4. **Heart: music, sound, signature magic.** We have no music and only a few synthesised blips. Genshin and Nikki carry half their emotion in the score. We also have no one signature motif (Arkenfall's "Weft"); we have many small effects.
5. **The night itself.** 16 players over PeerJS with mesh voice and a 547 MB download has never been tested with real people. If the night fails technically, none of the beauty matters.

## 2. Where our build stands (measured)

| Area | Ours today | Evidence |
|---|---|---|
| Download | 547 MB on `play` (368 MB `near-hd`, 151 MB `near`, 17 MB cards) | `git ls-tree -l origin/play` |
| Draws / triangles at the meadow | about 574 draws, 3.2M tris (was 2,295 / 7.4M) | look-pass round 3 notes |
| Renderer | Three.js r169, ACES tone mapping, bloom + grade composer, PCF soft shadows ±70 m, pixel budget + dynamic resolution | `js/main.js:57-76`, `js/quality.js` |
| Missing in pipeline | AO, AgX, SMAA/FXAA, screen-space reflection, worker threads, full shader warm-up | grep of `js/` |
| Characters | lathe-profile gowns and coats, sphere head, faceless; arms and legs rotate on a sine | `js/avatar.js:113-120` |
| Movement | walk 6 m/s, run 12 m/s, instant velocity, first person default, follow camera lerp | `js/controls.js:17,119,178` |
| World | 20.7 km map, slice being rebuilt (woods as stands, relief, tarn, brook) | PR #11, `docs/slice-handoff.md` |
| Fill | 3,138 placed Meshy models from 264 kinds, GLB near, 8-view cards far | `js/world/fill.js` |
| Palace | 148 KB of code: tiers, domes, spires, glass, gardens | `js/world/palace.js` |
| Creatures | unicorns, a light-fury-style dragon, deer, jellyfish, birds, simple rigs | `js/world/creatures.js` |
| Game | 32 places with heads, shards, Hush, finale, 8 templates, party games, 8 pets, sky ship, cutscenes as camera moves | PR #2, #10 |
| Audio | voice chat plus a few oscillator blips; no music, no ambience | `js/voice.js`, `js/game/mew.js:44` |
| Network | PeerJS public cloud, host relay, proximity voice within 60 m; never tested with 16 people | `js/net.js`, `js/voice.js` |

## 3. What each reference does well, and what we take

### Arkenfall (measured in the owner's Chrome; see `docs/arkenfall-study.md`)
- **Strength:** one procedural art direction, one shared fog/light pass in every material, a GPU meadow in one draw, 160 draws and 1.6M triangles, AgX, half-res AO, quarter-res shafts, SSR water, shaders compiled behind the loading bar, five workers.
- **Feel:** low third-person camera (4.9 m back, 5° pitch, FOV 55) on a spring with wall probes; tuned acceleration, coyote time, jump buffer, mantle, stamina.
- **Magic:** one signature motif, the Weft, tied to the story.
- **Take:** the render pipeline, the camera and movement numbers, the signature-motif idea. The world thread already takes the terrain and foliage methods.

### Golden Thread (the owner's repo, branch `3d-builds`, read-only)
- **Strength:** everything is built in code from a kit (`src/world/kit.ts`, a GeoBuilder that merges a land into a few draws; budgets of 150k tris per landmark). One art bible (`docs/ART_BIBLE.md`): soft low-poly, warm, saturated, "light is the hero", silhouette over detail.
- **3D models, judged as a game artist:** its 19 monument lands (`art/monument-renders/*.png` on `codex/3d-model-renders`) read clearly by roofline from far away: Taj-style Mughal court, Hawa Mahal honeycomb, pagodas, stave church. They are diorama-clean but low in surface detail and flat-lit. The best pieces for us are not buildings but the **character** (`CharacterModel.ts`: body under cloth, cloth that sways vertex by vertex, painted fabric with glowing motifs, 50+ modest outfits across 19 cultures in `outfits*.ts`, `modesty.ts`, `wings.ts`), the **dragon kit** (`creatures/dragonKit.ts`, 52 KB), **detailed animals** (`animals/detailed.ts`), **townsfolk and crowds** (`npc/`), the **cake scene** (`story/CakeScene.ts`) and the **sky systems** (`SkyFX.ts`, `SkyOrnaments.ts`, `SkyLanterns.ts`, `FestivalAir.ts`).
- **Weakness:** flat shading and simple lighting; it would look plain next to Genshin.
- **Take:** characters, outfits, wings, dragons, animals, townsfolk, cake scene, sky lanterns. Port them through our shading, not as they look in GT.

### Genshin Impact (public knowledge of the game, not measured here)
- **Strength:** anime toon rendering with ramp lighting, rim light and outlines on characters; faces lit by a hand-authored shadow map; painterly skies; a world built so every 30 seconds of walking reveals a new landmark ("weenie" layout); stamina-based glide, climb and swim; elemental VFX that read instantly; a full orchestral score per region; cutscenes with acting characters.
- **Take:** character toon shader (ramp + rim + outline), landmark-led layout of the Grand Path, glide from high points (the palace at 797 m begs for it), elemental-style readable VFX for the boss fights, a music theme per region.

### Infinity Nikki (public knowledge of the game, not measured here)
- **Strength:** the outfit is the game. Layered garments with real cloth and hair physics, outfit "abilities" (float, glide, purify) tied to clothes, a wardrobe UI with a lit 3D preview, a photo mode with poses, filters and frames, soft pastel lighting with bloom and sparkles, whimsical movement (float-jump, glide on a dress).
- **Take:** wardrobe with a lit 3D preview and turntable, outfit sets that grant a small power (Nikki's idea fits our pets and starlight), a photo mode (perfect for a birthday: friends take pictures with her), pastel sparkle trims on gowns, float-jump.

## 4. Gap matrix: exactly where ours lacks

Severity: 5 = players notice in the first minute; 1 = only an expert notices.

| Discipline | Best reference | Ours today | Gap | Sev |
|---|---|---|---|---|
| Player character model | Nikki, Genshin | lathe shapes, sphere head | no body under cloth, no hair, no hands, no layering | 5 |
| Character animation | Genshin, Arkenfall (procedural IK) | sine swing of four limbs | no gait, no weight, no turn lean, no idle, no emotes | 5 |
| Cloth and hair motion | Nikki | skirt rotates as one piece | hems do not swing, no hair motion | 4 |
| Character shading | Genshin | generic toon | no ramp, rim light or outline; reads as plastic | 4 |
| Camera | Arkenfall, Genshin | first person, lerp follow | no low cinematic third person, no spring, no wall probes, no shake | 5 |
| Movement | Arkenfall, Genshin, Nikki | instant 6/12 m/s | no acceleration, coyote, glide, climb, float-jump, swim | 5 |
| Art direction | all four | Meshy realism + code toon + GT trees | no art bible, no shared palette, mixed texel density | 5 |
| Download and load | Arkenfall 4 MB, GT 2.2 MB | 547 MB | 100x heavier; weak laptops and phones stall | 5 |
| Terrain, grass, trees, water | Arkenfall | being rebuilt in the slice | owned by the slice thread | 4 |
| Palace (the finale stage) | Genshin hero cities | big code massing, repeated textures | no interior hall for the cake, stained glass not lit from within, repeated tiles | 4 |
| Lighting pipeline | Arkenfall | ACES, bloom, grade | no AO, AgX, shafts, auto exposure, SMAA | 3 |
| Signature magic | Arkenfall's Weft | many small effects | no one motif tied to the story | 3 |
| Life in the world | GT townsfolk, Genshin NPCs | towns of 100-200 empty houses | no people, few animals moving | 4 |
| Creatures | Genshin, GT dragon kit | simple rigs | no flight cycles or banking; dragon reads as toy | 3 |
| Music and sound | Genshin, Nikki | none | no score, no ambience, no footsteps | 5 |
| UI and wardrobe | Nikki | HTML panels | no 3D preview, no photo mode, no polish pass | 4 |
| Cutscenes | Genshin | camera moves over static scenes | characters do not act; no music cues | 4 |
| Multiplayer reliability | any shipped game | untested with 16 | no rehearsal, no fallback if voice fails | 5 |
| Shader hitches | Arkenfall | partial compile | first look in a direction can stall | 3 |

## 5. The modules

Each module is sized for one fresh thread. Every module opens a PR into `claude/game-logic-4d13do`; the Game logic thread merges and refreshes `play`. Every module ends with in-game shots at eye height (tools/shots) and a perf line (draws, triangles, ms) on the Low tier.

### M1. Characters (port Golden Thread's traveller)
- **Why:** gap 1. Every player stares at characters all night; she will look at her own dress.
- **Scope:** replace `js/avatar.js` with a port of GT `CharacterModel.ts`, `fabric.ts`, `outfits.ts`, `outfits-extended.ts`, `modesty.ts`, `wings.ts` (esbuild bundle like `js/world/gt/gt-trees.js`). Keep our rules: faceless, no eyes, party gowns visible only to women (`visibleOutfit`). Map our 12 outfits onto GT's garments and add 8 more from GT's 19 cultures.
- **Method:** bundle GT TypeScript to one ES module with three external; wrap it in our `Avatar` API (`animate(dt, speed, t)`, name tag). Instance-friendly: one merged mesh per cloth, as GT does.
- **Budget:** about 8k triangles a character at High, 3k at Low (drop sewn trims); 16 characters under 130k triangles.
- **Done when:** a woman in a ballgown walks, runs and idles with swinging hems at 60 fps on Medium; a man sees her modest outfit.

### M2. Character shading and animation
- **Depends on:** M1.
- **Scope:** a character toon material (two-step ramp lit by the sun, cool shade, warm rim light, inverted-hull outline at 1.5 px, sparkle trims from Nikki), and a procedural animation layer: gait with hip sway and heel strike, turn lean, idle breathing, 6 emotes (wave, twirl, bow, clap, heart, dance) on number keys, float-jump pose, glide pose.
- **Done when:** side by side with a Genshin screenshot at the same camera, our character reads as the same family of rendering.

### M3. Camera and movement feel
- **Scope:** in `js/controls.js`: Arkenfall numbers (walk 1.55, run 5.6, sprint 8.4 m/s; accel 36, decel 30; coyote 0.13 s; buffer 0.16 s; variable jump), stamina, a Nikki float-jump (hold Space to drift), a glide from any height over 6 m (Genshin), a low cinematic third-person camera (4.9 m, 5°, FOV 55) on a spring with wall probes and gentle shake on landing.
- **Owner decision kept:** first person stays the default (owner's card). Third person switches on automatically in the wardrobe, emotes, photo mode and glide, and V still toggles. The plan recommends asking the owner once more whether third person should be the default, because a dress-up game is seen in third person.
- **Done when:** jumping off the palace terrace and gliding to the meadow feels like Genshin.

### M4. Art bible and the great cull
- **Why:** gap 2 and the 547 MB download.
- **Scope:** write `docs/ART_BIBLE.md` for Castle (palette swatches for dusk and night, three materials families: ivory stone, rose-gold metal, glowing glass; texel density; silhouette rules; what may glow). Then audit all 264 Meshy kinds against it with a contact sheet of in-game cards: keep (fits after regrade), regrade (shader tint and roughness), or replace with code-built kit pieces (GT `kit.ts` style). Expected result: keep about 40 hero models, regrade 60, replace or drop the rest.
- **Download target:** under 120 MB total, under 25 MB before the first frame. Convert kept textures to KTX2 (Basis), drop `near-hd` on Low and Medium.
- **Done when:** a 360° shot from the meadow, the gate and the palace terrace shows no object that looks like it came from another game.

### M5. World slice and rollout (already running)
- **Owner:** the "World slice to Arkenfall standard" thread. Terrain relief, ground sets, grass, forest layers, water, far ridges. This plan only adds two asks: use the M4 palette, and roll out along the 14-place Grand Path first, since that is where the party walks.

### M6. Render pipeline
- **Scope:** AgX tone mapping, half-res SAO/GTAO, quarter-res sun shafts, SMAA, auto exposure metered on land, full shader warm-up behind the loading bar (`renderer.compileAsync` per material on every tier), sort by program, shadow range per tier (Low none, Medium 130 m, High 200 m). Chunk building moved to a worker.
- **Done when:** no hitch over 50 ms in a 3-minute flight on the sky ship, Low tier holds 45 fps on an integrated GPU.

### M7. The palace as a hero stage
- **Why:** the finale happens here and it is the first thing seen from the gate.
- **Scope:** stained glass lit from within at night (emissive rose windows with Islamic star patterns, animated gently), break the repeated textures with a world-space variation layer and edge wear, gold trim catching the sun, banners that move, and a real **Great Hall interior** under the glass roof for the cake scene: floor of patterned marble, 16 seats, the cake plinth, the roof that opens (port GT `CakeScene.ts` staging).
- **Done when:** the gate-to-palace reveal shot and the cake shot both hold up as screenshots she would keep.

### M8. Signature magic: the Golden Thread
- **Scope:** one luminous golden ribbon of woven light that runs from the arrival gate along the Grand Path to the palace, brightening and weaving further as shards are returned, and at midnight it ties itself into the Great Birthday Lantern. It replaces the scattered ribbons as the one motif. Particles and motes are restyled to serve it (small sharp sparkles, gold and bioluminescent blue only).
- **Done when:** a new player understands where to go by following the thread, without the arrow.

### M9. Music, ambience and sound
- **Scope:** a small score: one main theme (she will hear it at the welcome and the finale), one calm exploration loop, one boss loop, one night loop. Source: royalty-free tracks the owner picks, or procedural Web Audio pads in a worker (Arkenfall-style) as a fallback. Ambience by biome (wind, water near the brook, birds by day, crickets at night), footsteps by surface, UI clicks, shard chime, a sting for each cutscene. Voice chat ducks the music.
- **Owner input needed:** whether he has a song that means something to them for the finale.
- **Done when:** muting the game makes it feel empty.

### M10. Wardrobe, photo mode and UI polish (Nikki)
- **Depends on:** M1, M2.
- **Scope:** wardrobe as a lit 3D stage (turntable, soft key light, bloom), outfit sets with a small power (glide trail, pet sparkle, starlight colour), a **photo mode** (free camera, poses from M2 emotes, depth of field, three filters, a birthday frame, save PNG), and one UI style pass (one font pair, gold-on-night panels, consistent icons) across lobby, HUD, map and results.
- **Done when:** she can dress, pose with friends and save a framed picture in under a minute.

### M11. Life in the world
- **Scope:** port GT `npc/Townsfolk.ts`, `npc/Crowd.ts` and `animals/detailed.ts` through M1 and M2 shading. Each of the 10 towns gets 20-40 townsfolk walking lanes, a few at stalls, cheering when players pass. Animals graze in the meadow slice. The dragon and unicorns get the GT dragon kit's flight cycle with banking and wing beats. All eyeless.
- **Budget:** townsfolk instanced, 300 visible at most on High, 80 on Low.

### M12. Cinematics that act
- **Depends on:** M1, M2, M9.
- **Scope:** rework the three cutscenes that matter most: her **welcome** (friends lined up, petals, the thread lights, her theme), **the Hush** (the corruption spreads, music drops), and the **finale** (glass roof opens, Mew morphs into the owner, cake). Characters move to marks and play emotes; music cues per shot; skippable.
- **Done when:** the welcome makes the owner emotional when he watches it.

### M13. Night readiness: network, load, rehearsal
- **Why:** gap 5. This is the module that decides whether the night works.
- **Scope:** a 16-player load test (16 headless browsers in the container for positions and events; then a real rehearsal with 5-6 friends on their own machines). Add a TURN fallback, host migration check, voice fallback (push-to-talk if the mesh struggles), reconnect on drop, a status panel for the owner. Measure first-load time on a 20 Mbps line and a phone.
- **Done when:** a rehearsal of the whole storyline with friends runs end to end without a reload.

### M14. Polish and bug bash
- **Scope:** a full play-through on each tier, a list of every glitch (floating models, z-fighting, collision holes, popping), fixed in order of how often a player sees it. Her name, the friends list with genders, the quiz questions and the reveal line go in (`js/config.js`).

## 6. Order of work to Oct 23, tiers, and how threads pick modules up

### Waves (most visible first)

| Wave | When (UTC) | Modules | Why first |
|---|---|---|---|
| 1 | Oct 18 evening - Oct 19 | M1 Characters, M3 Feel, M4 Art bible and cull, M13 first load test | seen every second; the cull cuts the download; the load test finds the scary problems early |
| 2 | Oct 19 - Oct 20 | M2 Shading and animation, M7 Palace stage, M9 Music, M6 Render pipeline | builds on wave 1; palace and music carry the finale |
| 3 | Oct 20 - Oct 21 | M10 Wardrobe and photo, M8 Golden Thread, M11 Life, M12 Cinematics | the Nikki and story layer on top of finished characters |
| 4 | Oct 21 - Oct 22 | M13 rehearsal with friends, M14 bug bash, M5 rollout finish | freeze features at Oct 22 12:00 UTC; only fixes after |

M5 (world) runs alongside all waves in its own thread. Honest cut line: if the account's usage limits slow work, cut M11 then M8 to their smallest form; never cut M1, M3, M9, M12 or M13.

### Quality tiers

| Setting | Low (integrated GPU, phone) | Medium (most laptops) | High (gaming GPU) |
|---|---|---|---|
| Pixel budget | 1.0M | 2.1M | 2.4M |
| Character detail | 3k tris, no trims, outline off | 6k tris, trims | 8k tris, trims, cloth sway on all |
| Shadows | none (blob shadows) | 1024, 130 m | 2048, 200 m |
| AO / shafts / SSR | off / off / off | half-res AO / off / off | half-res AO / quarter-res shafts / water SSR |
| Model textures | 512 KTX2, no `near-hd` | 1024 KTX2 | 2048 KTX2 |
| Townsfolk visible | 80 | 180 | 300 |
| Grass | far cards, short near band | full three layers | full three layers, denser |
| Target | 45 fps | 60 fps | 60 fps |

### How a thread picks up a module
1. Start a fresh thread named after the module (for example "M1 Characters").
2. Read this file, `docs/slice-handoff.md` and the module's section; branch from `claude/game-logic-4d13do`.
3. Build, shoot eye-height shots at the module's done-when, record the Low-tier perf line.
4. Open a PR into `claude/game-logic-4d13do` and ask Game logic to merge and refresh `play`.

### What only the owner can give
- Her name confirmed (Golden Thread says Syeda Fathima), the 14 friends with genders, quiz questions, the reveal line.
- A song for the finale, if he has one (M9).
- Whether third person becomes the default (M3).
- A rehearsal slot with 5-6 friends on Oct 21 or 22 (M13).

## Sources
- Our code: `play` branch and `claude/world-slice-qsc3ua` in this repo.
- Arkenfall teardown: `docs/arkenfall-study.md` (measured in the owner's Chrome, Oct 18).
- Golden Thread: https://github.com/azim12086atmes-s/Golden-Thread branches `3d-builds` and `codex/3d-model-renders`, read-only.
- Genshin Impact and Infinity Nikki: described from public knowledge of the shipped games; nothing measured here.
