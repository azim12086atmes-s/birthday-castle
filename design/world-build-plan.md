# Castle of Starlight: World Build Plan

Every buildable style, element and interior is listed in [architecture-catalogue.md](architecture-catalogue.md). This plan is distilled from the 400 reference images (U01–U400, analysed in [image-analysis.md](image-analysis.md)). Each area below names the images it copies, what to build, its colours, how it is lit at day, dusk and midnight, and what it costs on a laptop. The build thread "Build the birthday castle game" owns the code; this file is the brief it builds from.

## 0. What the 400 images taught us

1. **They have real detail, and it is organised.** Owner's correction, 2026-10-10: the references are detailed and partly realistic (U381, U396, U401, U257, U388), not just simple shapes. Their detail is layered: a clear silhouette first, then rich ornament on the parts the eye lingers on (gates, domes, window frames, floor medallions, balustrades), then fine surface texture (stone blocks, tiles, moss, wear). Saturation stays between 0.4 and 0.7; grey frames (Palworld) were the ones that felt wrong.
2. **Light and atmosphere do most of the work.** Every beautiful frame has three depth layers (dark foreground, saturated middle, pale hazy distance), coloured fog, warm light against cool shadow, and one bright focal point. All of these are cheap in a browser.
3. **The owner's taste has a clear centre**: a **white or lilac palace with onion domes, minarets, gothic spires and Islamic lattice**, set among **pink blossom, roses, fountains and cypresses**, seen at **dusk and night** with **warm windows, lanterns, candles on water, aurora and a starry violet sky**. Floating islands, waterfalls off their edges and a cloud sea surround it.
4. **Recurring set pieces** across many batches: the round dais or portal ring (U81, U105, U134, U213, U231, U274), floating candles and lanterns (U50, U259, U317), the glowing armillary or planet centrepiece (U305, U333, U360, U380), and stained glass throwing coloured light (U160, U198, U273).

## 1. Honest scope

- **Detail is possible in the browser.** Genshin runs on phones, so a laptop browser can show similar detail if the assets are made efficiently. The limit is **making the assets**, not running them.
- **How we get the detail:**
  - **Real 3D models**, not code primitives, for the castle, gate, statues, fountains and interiors (Blender or CC0 kits), compressed (glTF + Draco/KTX2).
  - **Normal maps and PBR-stylized textures** for carved stone, tiles, lattice and gold trim, so ornament reads as 3D without extra polygons.
  - **Baked lighting and ambient occlusion** into the textures, which looks like real light for free.
  - **Levels of detail (LOD):** full detail within about 40 m, simpler versions further out, painted cards at the horizon.
  - **Detail density follows attention:** the most detail goes on the gate, the castle front, the welcome hall and her seat.
- **What still can't come across:** the very highest-end tech, such as ray-traced reflections, film-quality volumetric clouds and photoreal foliage (AC Odyssey's Atlantis, U398–U400). We fake those with cards and bloom.
- **The real constraint is time.** A detailed castle and grounds is a lot of model work before Oct 23, so it should start with the pieces seen most.
- **Budget per view on a laptop:** about 300k triangles, 150 draw calls, one shadow-casting light, no real-time reflections, at most a handful of transparent layers on screen.

## 2. World layout

**Superseded for map layout (Oct 10):** the map, the castle size and the interiors now follow [world-layout.md](world-layout.md) v2. It describes a blended, uneven world: a dense Glowwood round the castle crag, 300 m rock pillars, 100 m trees and an 800 m lake bridge. The castle is asymmetric after U402, with a 50 m gate. Every picture is mapped to its place in [layout-sources.md](layout-sources.md). The sketch below is the earlier version.

```
                       ✦ aurora, two moons, star field (midnight: sky mandala) ✦
        [Rose Garden Isle]      [Crystal Winter Isle]      [Lantern Festival Isle]
               ╲ light bridge        │ beacon pillar             ╱ rope bridge
                 ╲                   │                         ╱
   cloud sea ── [ CASTLE on stepped terraces against a peak, waterfalls into canals ] ── cloud sea
                        │ forecourt: gold-blue swirl medallion + armillary
                        │ axial approach: cypress rows, twin fountains, lavender
                  [ GRAND GATE: gold-framed gates between winged unicorn statues ]
                        │ red carpet, lantern clusters
                  [ TOWN: terraced canal streets climbing the hill, bunting, bazaar ]
                        │ glowing gem path through the bioluminescent forest
                  [ SPAWN MEADOW: pink flower carpet, castle reveal through a tree arch ]
```

References: world plan U52, U205, U360, U396; floating ring U01, U21, U362, U375; overlook U142, U400.

## 3. Areas, in the order a player meets them

## 3.0 The castle scene (owner's target, U402)

![](images/U402.png)

**This is how the castle scene should look.** A many-spired white castle stands at the end of a still lake at night. Its pointed roofs are tinted violet-pink, and it glows from inside, with warm light pouring from every window and arch. The whole castle reflects in the mirror-calm water. A bright full moon is haloed by clouds, the violet sky is full of stars and soft lit clouds, and warm lanterns and lit houses line both shores, with dark trees framing the sides.

**Colour change requested by the owner (2026-10-10): the castle leans to darker pinks and pink tints.** U402 is measured at lilac `#88698b`, `#b18691` and pale peach `#dab0a9`. We push those toward deeper rose:

| Part | U402 measured | Our castle (darker pink) |
|---|---|---|
| Walls, lit | `#dab0a9` | blush pink `#e8b9c6` |
| Walls, shade | `#b18691` | dusty rose `#b0607e` |
| Roofs and spires | `#88698b` violet | deep rose `#9c3a68` → plum-magenta `#6e2a5a` at the base |
| Trim, finials | — | rose gold `#d99a8a` + gold `#e0b040` |
| Window glow | warm `#ffd9a0` | warm peach-pink `#ffc2a8` |
| Reflection in the lake | same, darker | same hues at 60% brightness, broken by gentle ripples |
| Sky | `#21244e` → `#5d4f7c` | indigo-violet, as in section 4 |
| Moon | white with a halo | white `#fff6f0` with a pink-lilac halo |

**How to build it:**
- The lake is a glossy dark plane with the castle mirrored below (a flipped copy, or one planar reflection only on high quality). Moon and window glints are sprites on the water.
- Interior glow comes from emissive windows and a warm gradient on the lower walls.
- The halo is an additive sprite. Shore lanterns are instanced, with a small bloom.
- The view is framed by dark tree silhouettes on both sides.


### 3.1 Spawn meadow (first view)
- **Copy:** U13 (open field), U202 (pink flower carpet framed by pale trunks), U108/U240 (dark arch framing the view).
- **Build:** a gentle bowl of grass. Within 25 m of the camera, dense grass blades and pink and violet flower specks; further out, flat colour. A **dark tree arch** frames the first view of the castle, islands and aurora.
- **Colours:** grass `#79b11e`→`#58ac84`; flowers `#e070c0`, `#f2a0b0`; distance fades to `#3b3570` at night.
- **Light:** dusk = low peach sun from behind the castle, purple sky (U16/U26). Night = moon-blue rim, flowers glow faintly.
- **Cost:** 🟢 instanced grass cards, one texture atlas.

### 3.2 Bioluminescent forest path
- **Copy:** U85 (teal grove), U42 (plank bridge over a glowing stream), U65/U77 (glowing calligraphy strokes on the ground), U200 (dark trunks, sun patches).
- **Build:** round leaf-card canopies, glowing cyan vein patterns on trunks, purple glowing mushrooms, white glow plants. **The path lights up in calligraphic strokes as the player walks** (the interactive pathway). One plank bridge over a glowing stream.
- **Colours:** teal `#42a4ad`, deep `#020200`, accent violet `#7040e0`, path glow `#60e0f0`.
- **Light:** almost no real light. Everything comes from emissive masks and fog in a single teal hue.
- **Cost:** 🟢

### 3.3 The town at the castle's foot
- **Copy:** U152 (hillside dome town at blue hour), U251 (stylized canal), U179 (bazaar canopies), U180 (lace trim, fairy lights), U210/U233 (hand-painted timber houses at night), U344 (fountain square).
- **Build:** a modular kit of 6 house types, plus canals with arch bridges and stairs climbing toward the castle.
  - The houses have pastel plaster walls, blue scalloped or purple shingle roofs, white lace trim, warm windows, and flower boxes.
  - One bazaar street has yellow, purple and green cloth canopies and bunting.
  - A round fountain square at the bottom has a water curtain.
  - The town hall carries the **midnight countdown clock** (U233).
- **Colours:** walls `#f8ddd9` `#c9aca4` `#e4ccae`; roofs `#5879ab` `#7050a0`; windows `#ffc070`; fairy lights `#60e0c0`.
- **Light:** blue hour is the signature (U152): cool blue shadows, peach light only on the rooftops, warm windows.
- **Cost:** 🟢 one shared trim sheet; windows as an emissive mask.

### 3.4 Grand gate and red carpet
- **Copy:** U379 (gold-framed gates between winged statues), U178 (round patterned medallion over the door), U247 (red carpet between lantern clusters and round red trees), U225 (twin towers with a bridge).
- **Build:** two towers joined by a bridge, with tall gold-framed glass gates that swing open. A large round Islamic star medallion sits above the gates. **Winged unicorn statues** 🧱 stand on both sides. A red carpet runs straight to the castle between lantern clusters.
- **Cost:** 🟢 except the statues, which need a model.

### 3.5 Forecourt and axial approach
- **Copy:** U381/U396 (cypress rows, twin fountains, lavender), U355 (gold-and-blue swirl floor), U380 (golden armillary with a glowing core), U397 (terrace waterfalls into canals).
- **Build:** a long axis lined with cypress cones and lavender beds, with two round fountain basins. At the centre is a **huge gold-and-blue swirl medallion floor**. On it stands a **giant gold armillary sphere** with a glowing turquoise water core, slowly rotating. Waterfalls pour from the castle terraces into long reflecting canals on each side.
- **Colours:** stone `#f1edcc`; gold `#e0b040`; blue `#205472`; core `#40e0c0`.
- **Cost:** 🟢

### 3.6 The castle
- **Base:** a classical acropolis of three white marble terraces with stoas, a propylaea gate at the top of the grand stair, and aqueduct arcades carrying the waterfalls (U401, U360, U398–U400; details in architecture-catalogue.md section 1A).
- **Silhouette:** U221 (onion domes, minarets, horseshoe arches), U129 (white walls, blue roofs, turret tops glowing pink), U211 (crescent-moon finials), U356 (crescent over the main dome, crown of cyan crystal spikes), U141 (sculpted wings on the facade), U396 (set against a mountain peak).
- **Seen from the town:** U401 shows the target, with terraces stacking up to one tall spire and roses on a balustrade framing the view.
- **Massing:**
  - One central onion dome (gold ribs over blue tiles, U390) with a crescent finial and a ring of crystal spikes.
  - Four minarets.
  - Two gothic spire towers as secondary accents.
  - The whole castle sits on three stepped terraces.
  - A long white stair leads up, with roses along the balustrades and crowned gold pillars hung with red drapes.
- **Walls:** blush pink with dusty-rose shade and deep rose roofs (see 3.0, owner's choice); earlier white `#f0f0e8` is replaced with blue painted bands and zigzag trim on the column capitals (U181). **Eight-point star lattice windows glow from behind** (U183): gold at dusk, pink and cyan at night. A stained-glass dome glows like a lantern at night (U273).
- **Night lighting:** warm uplight at the base fading upward against deep violet (U310/U311), done as a gradient in the material rather than real lights. Rising embers (U280).
- **Cost:** 🟢 all built from code primitives (domes, arches, lattice, towers) plus one trim sheet. The wings 🧱 need a model.

### 3.7 Inside the castle
- **Welcome hall** (U257, U265, U334): a round columned hall with an opening in the dome that throws one beam onto a star-inlaid floor circle, where she appears. Violet banners and red flower urns line a patterned runner, with three thin waterfalls down the wall behind the dais.
- **Ballroom** (U268, U388): crystal chandeliers in a row, pink drapes, flower balconies, and floor medallions. **At midnight the ceiling dissolves into a pink galaxy.**
- **Her seat** (U271): a round stepped dais under an iron lattice window. The guest entrance is a pair of twin curved stairs rising to a glowing round door (U332).
- **Tea nook** (U262, U289): a table for two with tea and cake beside a round moon window.
- **Stained-glass light** on floors everywhere (U160, U198), done as decals.
- **Cost:** 🟢 except chandeliers 🧱 (or a simplified code version).

### 3.8 Courtyard garden (by day) and midnight courtyard
- **Day** (U284/U346, U292, U133): gold lattice screens, blue tile panels, red cushioned benches, a tiered fountain in a turquoise pool, massed pink rose beds, and an arcade with a geometric mosaic floor.
- **Midnight** (U259): the same court with a long black reflecting pool holding white lilies and dozens of **floating candles**, lit only by candles and lamps under the stars. This doubles as a Wish Lanterns spot.
- **Cost:** 🟢

### 3.9 Celebration plaza
- **Copy:** U106 (round dais, glowing balloons, planets), U333 (glowing ringed planet on a pedestal over water), U219 (twin stairs to a stage), U317 (lantern gate, lantern sculptures, sky lanterns), U155 (fireworks, constellation lines), U135 (fire ring for voice-chat gatherings).
- **Build:** a round lamp-ringed plaza on water with a glowing ringed planet in the centre. A stage with twin stairs stands on one side, and a gate hung with lanterns on the other. **Lantern sculptures** are shaped as a unicorn, a star and a crescent.
- **Cost:** 🟢

### 3.10 Floating islands (one small complete scene each, U197/U199)

| Island | Copy | Signature |
|---|---|---|
| **Rose Garden Isle** | U285, U284, U364 | Terraced walls dripping with greenery, domed temple with winged unicorn statues, roses, doves, waterfalls off the edge |
| **Blossom Ruin Isle** | U384, U199 | Broken rotunda with pink trees growing out of it, lilac temple, lily pond, pink-tinted cloud sea |
| **Crystal Winter Isle** | U220, U127, U125, U231 | Pink-lit snow with violet shadows, rune stone ring on an ice disc, teal aurora curtains |
| **Lantern Festival Isle** | U317, U106 | Lantern gate, balloons rising, the Wish Lanterns game |
| **Bioluminescent Isle** | U85, U119 | Glowing crystal shrubs, root arches, teal fog |
| **Sky Pavilion** | U250 | Gold lattice dome over a glass floor with a glowing orb |

- **Travel:** glowing arch outlines around a plaza, one colour per island (U213), or a ring of rune stones (U105, U231). Each destination is marked by a coloured light pillar (U124) and joined by rope or light bridges (U236).
- **Each island:** a flat top, a cliff skirt, hanging roots, rubble orbiting it (U137), and a waterfall pouring off the edge into mist (U96).
- **Cost:** 🟢

## 4. Sky and time of day

| Phase | When | Sky | Fog | Key light | Accents |
|---|---|---|---|---|---|
| **Day** | Before Oct 22 evening (optional) | Cyan `#00c5e1`, huge cumulus | Pale `#c3d5e1` | Warm sun | Pink and orange trees (U174) |
| **Dusk** | Last hours before midnight | Pink horizon → violet, stars fading in (U185) `#5a3a6a`→`#d89aa0` | Lilac `#9c81ac` | Low peach sun | Lanterns switching on |
| **Night** | Default in play | Indigo `#22244b`→`#47477c`, two moons (U373), star field, cyan ribbons (U308) | Indigo `#3b3570`, each island tinted | Moon-blue rim | Warm windows `#ffc070` only |
| **Midnight Oct 23** | The reveal | A **giant Islamic geometric mandala draws itself in the sky** (U279), aurora at full strength, searchlights (U303), fireworks, shooting stars, the bubble dome over the castle pops (U115), the ballroom ceiling opens to the galaxy | Brighter | — | Everything glows brighter |

## 5. Shared technical recipe

- **Shading:** a toon ramp (2–3 steps), shadows tinted by the sky (violet, never black), and a fresnel rim on hero objects (T2, T4).
- **Trees:** leaf-card canopies on sphere normals, backlit translucency (T1, T3).
- **Ornament:** one trim sheet for Islamic star bands, blue zigzag, gold ribs and lace trim. Lattice is alpha-cut; glow comes from emissive masks.
- **Water:** flat colour with a white foam streak and a slight emissive edge; no real reflections (T11).
- **Particles** (all instanced): stardust, embers, petals, balloons, sky lanterns, candles, wisps.
- **Post-processing:** bloom on emissives, one colour grade per phase. Skip screen-space reflections and real-time GI.
- **Quality levels:** grass density, shadow distance, particle count and draw distance scale with `?quality=`.


## 5A. Terrain: how it is generated

The terrain mixes a **hand-designed layout** with **generated natural detail**. The game already uses layered noise with flattened plazas (js/world/layout.js `terrainHeight`); this extends it.

1. **Designed shape first (the blueprint).** A few hand-placed shapes are blended into one height map: the lake basin in front of the castle (U402), the castle hill with three flat acropolis terraces, the town slope with stair-stepped streets, the spawn meadow bowl, and the river valley (U52, U205). Paths, plazas and terrace tops are kept perfectly flat.
2. **Natural variation on top.** Two or three layers of noise: big gentle rolls (20–60 m), medium bumps, and a little fine grain. The noise fades out on paths and plazas and grows stronger toward the island edges.
3. **Cliffs and rocks as separate meshes.** A height map cannot make vertical faces or overhangs, so the following are modelled pieces placed along steep edges:
   - Flat-planed stylized cliff walls (U07, U04).
   - Boulders and rock arches.
   - The undersides of the floating islands: rock skirts with hanging roots and waterfalls (U96, U364).
4. **Painted by slope and height.**
   - Flat ground gets grass, in big soft patches of two greens.
   - Steep ground gets rock, and lake edges get sand and wet dark soil.
   - Paths are worn to dirt or paved with flagstones, and flower drifts follow a noise mask.
   - Close up there is a stylized texture with a normal map; far away, flat colour.
5. **Scatter.** Grass blades and flowers within about 25 m, then shrubs, rocks and trees placed by masks (no trees on paths, cypress rows along the approach, blossom trees by the water). Density drops with distance and quality level.
6. **Water.** The lake is a still dark mirror reflecting the castle, moon and lanterns, with a soft foam line at the shore and gentle ripples (U402). Streams and falls are scrolling strips.
7. **Distance.** Far mountains are low meshes and painted cards in 3–4 haze layers that fade to the sky colour, with a sea of clouds below the islands.
8. **Light baked in.** Ambient occlusion and soft shadow are baked into vertex colours, so hollows and cliff bases read dark at no cost. Terrain is split into chunks with lower detail far away.

## 6. Build order (biggest visual gain first)

1. Castle silhouette (3.6) and the night sky (section 4), because this is the screenshot people remember.
2. Forecourt and axial approach (3.5), plus the gate and red carpet (3.4).
3. Midnight reveal sequence (section 4, last row) and the welcome hall (3.7).
4. Town on the hill (3.3).
5. Celebration plaza (3.9) and the Lantern Festival Isle.
6. Remaining islands, the courtyards, the ballroom, and the forest path.

## 7. Still open

Her name and the welcome cutscene text are still placeholders. The winged unicorn statues, castle wings and chandeliers need model files, either free CC0 kits or Blender-made models.
