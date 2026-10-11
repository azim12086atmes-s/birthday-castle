# Detail pipeline: rich carving that still runs in a browser

The owner asked on 2026-10-11 for the palace and the rest of the game to have the detail of the reference pictures "and yet playable on web". This file explains how. The short answer: **detail is carved once at full resolution in Blender, then baked into textures**, so the game draws few triangles that look deeply carved. Geometry is spent only where the silhouette or see-through openings need it.

The detail itself is named, picture by picture, in [detail-catalogue.md](detail-catalogue.md) and grouped into buildable pieces in [component-library.md](component-library.md). The bridge railing in [blender/](blender/) is the first worked example (38k triangles carved, to be baked to a few hundred).

## 1. Seven techniques, and what each one buys

| Technique | Used for | What it saves |
|---|---|---|
| **Normal and AO bake** | Carvings, acanthus, rosettes, girih and arabesque relief, mouldings, ashlar joints | A 40k-triangle carved panel becomes a 2-triangle quad with a 1024 px normal map. It still catches the light from every angle. |
| **Trim sheets** | Cornices, string courses, bead-and-reel, egg-and-dart, dentils, cusping, gold piping | One 2048 px strip holds about 12 moulding profiles. Every building in the world shares it, so one texture serves thousands of metres of moulding. |
| **Alpha cutout** | Tracery windows, jali screens, pierced railings, ironwork, leaf canopies | Openwork becomes a flat card with holes, so the lake and sky show through. Real cut geometry is used only within about 15 m of the player. |
| **Instancing** | Pinnacles, windows, railing modules, lanterns, chairs and tables, trees, flowers | One draw call draws hundreds of copies. The castle's 8 great windows, 60 pinnacles and 400 railing modules each cost one call per material. |
| **Levels of detail (LOD)** | Every module | Three versions each (full, half, quarter), plus a flat picture (impostor) for far towers. The far castle is one merged low version. |
| **Area streaming** | The outer areas (Lagoon City, Temple Hill, Pillar Reach and the rest) | Only the area you are in loads at full detail. The others sit as low silhouettes in fog until you come near. |
| **Shaders instead of geometry** | Flowing glass, fractured gate glass, bridge ripples, glowing paths, water, aurora | The magic is maths on the graphics card. It adds no triangles and no extra lights; bloom does the glow. |

Two more cost savers sit under all of these:
- **Baked light.** Ambient occlusion and soft light are baked into textures or vertex colours for static pieces. The scene keeps one moonlight with shadows and a handful of real lights; lanterns are emissive and glow through bloom.
- **Merged static meshes.** Static parts are merged into one mesh per material, as castle.js already does, so draw calls stay near 80.

## 2. From Blender to the game

1. **Carve the full-detail module in Blender** (headless Blender 5.2 runs in the cloud, so nothing is installed on the owner's computer).
2. **Make the game version:** a low mesh that keeps the outline, with real holes only where you see through.
3. **Bake** the full module onto the low one: normal map, AO map, and an alpha mask for openwork.
4. **Export as glTF** (`.glb`).
5. **Compress** with gltf-transform: meshopt for the mesh, KTX2 (Basis) for the textures. KTX2 textures stay compressed on the graphics card, so they use 4 to 6 times less video memory than PNGs. The cloud copy of Blender cannot compress meshes itself, so this step runs after export.
6. **Load in Three.js** with `GLTFLoader`, `KTX2Loader` and `MeshoptDecoder` from `three/addons`, then instance and merge as above.

**Size per module:** about 300 to 3,000 triangles in the game version, and a 1024 px texture set (512 px on Low) or a share of a trim sheet.

## 3. Quality settings

| Setting | Who it is for | Screen resolution | Shadows | Real cut openwork | LOD distances | Bloom and particles |
|---|---|---|---|---|---|---|
| **Low** | Ordinary laptops (the default) | 0.75 to 1 times | Moonlight only, 1024 px | Within 8 m | Shorter; far castle and forest switch early | Bloom at half resolution, few sparkles |
| **Medium** | Laptops with better graphics | 1 times | 2048 px | Within 15 m | Normal | Full bloom, normal sparkles |
| **High** | Desktop graphics cards | Up to 1.5 times | 2048 px, softer | Within 30 m | Long | Full bloom, more sparkles and fireflies |

**Targets:** 60 frames a second on Medium with ordinary laptop graphics, never below 30 on Low. About 300k triangles and 80 draw calls in view, and about 300 MB of video memory on Low. A small on-screen counter (frames per second, triangles, draw calls, from `renderer.info`) helps check each new area against these numbers.

## 4. What gets the full treatment first

These are the pieces the player sees closest and longest, in order:
1. **Castle front:** great-window tracery (three sizes), the gate frame and its gold trim, girih bands, pinnacles, corner tower caps.
2. **Bridge:** the carved railing module (already carved in Blender), deck fractal inlay, lamp posts.
3. **Avenue and plaza:** lamp posts, benches, fountain, paving pattern, tree bark.
4. **Ring walkways:** balustrade, tables and chairs, planters, lanterns.
5. **Interiors:** Great Hall floor inlay and chandeliers, ballroom ceiling, twin stair.

The ★ "Start here" list in [component-library.md](component-library.md) names the exact components and the pictures they come from.
