# Birthday Castle: design handout

This folder holds the whole art and world design for the game, as it stood on 2026-10-11. Read this page first. It says what exists, where it is, what has been decided, and what is still open.

## 1. The goal

The game is a magical multiplayer web game for a birthday. The celebration unlocks at 12 am on Oct 23, 2026, and friends can play before then.

- **Look:** a night-time fantasy world. A monumental pink castle (gothic with Islamic geometric patterns and stained glass), aurora, stardust, a glowing forest, winged unicorns, and gentle creatures with no eyes.
- **Quality target:** near-AAA stylised visuals, like Zelda BotW/TotK, Ghibli and Genshin.
- **Platform:** it must still run smoothly in a browser on an ordinary laptop (Three.js, about 300k triangles in view).

## 2. Where everything is

| File | What it is |
|---|---|
| [requirements.md](requirements.md) | **Every request the owner made, in one table**, with where it is answered and its status. Start here. |
| [image-index.md](image-index.md) | One row per reference picture (U01 to U403), with categories and a verdict. The pictures themselves are listed in section 5. |
| [image-analysis.md](image-analysis.md), [style-guide.md](style-guide.md), [reference-table.md](reference-table.md) | The first analysis of every picture: style, lighting, shaders and laptop cost. |
| [detail-catalogue.md](detail-catalogue.md) | **Every picture, one by one**: patterns, carvings, edges, materials, objects, light effects, and the buildable pieces. |
| [component-library.md](component-library.md) | Those pieces merged into **736 named components** in 24 groups, each with its source pictures, build method and place in the world. A ★ "Start here" list names the best 45. |
| [world-layout.md](world-layout.md) | The world map: areas, sizes, the entrance, the castle (section 5), interiors, the balcony and the budget. |
| [layout-sources.md](layout-sources.md) | Which picture fed which area of the map. |
| [architecture-catalogue.md](architecture-catalogue.md), [world-build-plan.md](world-build-plan.md) | Architecture styles and how each area is built and lit. |
| [bridge-design.md](bridge-design.md) | The magical bridge: glossy white, fractal inlays, neon footstep ripples, a carved see-through railing. |
| [detail-pipeline.md](detail-pipeline.md) | How heavy detail stays playable on the web: Blender bakes, trim sheets, cutouts, instancing, LODs, streaming, compression and quality settings. |
| [layout/](layout/) | World maps, castle elevations v1 to v4, and the sheet of the other buildings, with the scripts that draw them. |
| [blender/](blender/) | The first carved Blender module (the bridge railing), its render, and the script that builds it. |
| [sheets/](sheets/) | Design sheets drawn round by round (see section 4). |

## 3. Design versions so far

| Version | Date | What changed |
|---|---|---|
| World v1 | Oct 10 | Atlantis-style ring city. Rejected as too central and too symmetric. |
| World v2 | Oct 10 | A blended, uneven world: the Glowwood forest round the castle, 300 m rock pillars, 100 m giant trees, a long lake and bridge, and every architecture style placed. |
| Castle v2 | Oct 10 | Taller and asymmetric, with joined gothic towers, domes and a 50 m gate. |
| Castle v3 | Oct 11 | 100 m opening gate in fractured blue, yellow and purple glass. 200 m front wall. Dome of radius 30 m. Three levels from the stair foot with white ring walkways and sitouts. Cascade stair. |
| Castle v4 | Oct 11 | Taller and wider: 308 m front wall, four 75 m great windows, 80 m tower windows, cone tip at 514 m. Built in the game. |
| Castle front v5 | Oct 11 (in progress) | The plain front wall becomes **clusters of towers that bulge out from the walls**, after U403: corbelled "arching-out" towers, bartizans, varied crowns, and the detailed Rose Gate. |

## 4. Work in progress: the design sheets

The owner asked for every part to be designed on the drawing sheet, in rounds, compared with the pictures again and again, before any modelling.

- **[sheets/castle-front/](sheets/castle-front/):**
  - Rounds 1 to 3 of the front layout: three ideas, then the chosen "crescendo arms" layout refined twice.
  - The arching-out tower: corbel fan, swags, spiral ribbon.
  - The Rose Gate, rounds 1 to 3.
  - The windows sheet, rounds 1 and 2 (great window, wheel, twin lancets, heart lantern, dormer, drum window, jewel ogee).
- **First drafts (round 1 only, stopped when the usage limit ran low):** [bridges](sheets/bridges/), [artifacts](sheets/artifacts/), [monuments](sheets/monuments/) and [terrain](sheets/terrain/). The tree and foliage sheet had only started its scripts.

**Next steps:**
1. Finish the castle front: put the gate and windows into the full elevation, detail the levels, walls, banners and swags, and compare it with U403 again.
2. Take each world sheet through at least three compare-and-add rounds.
3. Add the tree and foliage sheets.
4. Write the final v5 spec into world-layout.md section 5 for the build.

## 5. The reference pictures

The 403 reference pictures the owner supplied (U01 to U403) are listed and described in [image-index.md](image-index.md) and [detail-catalogue.md](detail-catalogue.md). The image files themselves (623 MB) are in the project's shared files at `art-references/images/`. They are kept out of this public repository for now, because most of them are other artists' copyrighted work and the repository and its website are public.

## 6. Standing rules

- The game runs smoothly on ordinary laptops in a browser.
- Creatures have no eyes, and statues are veiled or faceless.
- Dresses stay modest.
- Colours: walls in blush and dusty rose, roofs in deep rose and plum, gold trim. The stained glass is multicolour.
- Celebration unlocks at 12 am on Oct 23.
- Her name and the welcome text are still to come (the placeholder is "Princess").
