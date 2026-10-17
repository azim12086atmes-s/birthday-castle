# World fill: the 20 km crescent world, filled with our models (Oct 16)

The 20 km map, reshaped into a crescent of sea mountains with the white waterfall gate in its south wall. 109 of our Meshy models are placed around the 32 places, relics and rocks are spread over the land by biome, and 150,000 trees come from the web pack.

| Path | What it is |
| --- | --- |
| `world-placements.json` | Every placed model: `m` (model), `place` (B-code, `ARRIVAL` or `wild`), `x, y, z` (three.js frame: metres, y up, origin at the palace, x east, z south), `rotY` (radians) and `scale` (multiplies the GLB). Also holds the gate and dock positions. |
| `glb/<model>.glb` | Layout copies: the exact Meshy model reduced to 150k triangles (landmarks), 50k (buildings) or 20k (props), with a 2048 px colour texture. The base sits at the origin and the model is at Meshy's own unit size, so `scale` makes it real size. |
| `glb/<model>.json` | Triangle counts and dimensions |
| `terrain/` | Crescent heights (`terrain.npz`, 2048 grid, about 10 m per cell), colour map, biome ids, `heightmap-crescent-4033-16bit.png` / `.r16` for Unreal with `heightmap-info.json`, and `crescent.json` (gate and docks) |
| `fill_plan.json` | What goes where, with natural sizes. Edit it and re-run `build_fill.py` to move things. |
| `crescent.py`, `prep.py`, `build_fill.py` | Terrain reshape, layout copies, and the Blender scene plus renders |
| `ren/fill-*.jpg`, `ren/fill-contact.jpg` | Preview renders |
| `crescent-world-filled.blend` | The whole Blender scene (about 700 MB); kept in the study thread's scratch area because project storage is full |

## For the web game

- Load `world-placements.json` once. Group the items by model and draw each group as one `InstancedMesh`, so 109 models make about 109 draw calls, not 1,500.
- Use the GLBs for close views only, within about 300 m for landmarks and 120 m for props. Beyond that, use a cheaper copy: decimate again to about 10% with gltf-transform (`simplify`), or use an image card. The layout copies are about 465 MB in total, which is too heavy to download all at once, so load them per 1 km tile like the trees.
- Trees: the web pack's `placements/*.bin` is still valid. Trees buried by the new crescent are skipped here; the game should skip any tree whose terrain height in `terrain/` is more than 20 m above its stored `y`.
- Biome ids in `terrain/biome.npy` follow the painter's order: 0 deep ocean, 1 shallow sea, 2 reef, 3 lakes, 4 lagoon, 5 beach, 6 dunes, 7 sea cliffs, 8 flower meadow, 9 grassland, 10 temperate forest, 11 blossom, 12 glowwood, 13 jungle, 14 red canyon, 15 karst, 16 fjord taiga, 17 misty moor, 18 alpine, 19 bare rock, 20 snow, 21 palace grounds.

## Rules kept

Meshy models keep their own proportions and are sized to real-world sizes; only the palace is enlarged. Churches with crosses, the Whiskerlynx (it has eyes) and the stone face are not placed.

## Geology pass (Oct 17)

`geology.py` reshaped the mountains (about 110 km², places and palace grounds untouched): rivers carved valleys and couloirs over 16 rounds on a 1024 flow grid, slopes steeper than about 40° shed scree, tall mountains gained crests and spurs, and canyon, karst and sea-cliff walls got stepped strata. The colour map gained dark gullies, light ridges, scree, warm and cool rock tints, green on gentle lower slopes, canyon bands, and snow that rests on ledges while steep faces stay rock. Before and after: `ren/geology-mountains.jpg`, `ren/geology-compare.jpg`, `ren/geology-map.jpg`.

- `terrain/` now holds the new heights and colours (same formats as before).
- `game/crescent-h.bin` and `game/crescent-colour.jpg` are ready for the web game: the same 1024 grid, `uint16 (h + 250) * 20`, as `data/world/` on the game branch. Drop them in.
- `world-placements.json`: 523 models on reshaped ground had their `y` moved by the height change. The sky-isle pieces (B30) float and were left alone.
