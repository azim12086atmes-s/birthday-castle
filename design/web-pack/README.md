# Web pack: nature and magic assets for the browser game

Made by the study thread on 2026-10-16 for the one-day magic pass (plan: https://claude.ai/code/artifact/3148a84a-3994-4423-af7c-4bdd4b823097).
Everything here is small and meant to be loaded directly by the Three.js game.

## trees/ (8 trees and plants)

Near models exist for 6: pine, ancient oak, ember, bonsai, wisteria, fern. The broadleaf `Tree` and the lilac bush are image-card only (their leaves are thousands of loose pieces that cannot be thinned without looking broken), so `tree.bin` and `bush.bin` plants always use their card.

| File | What it is |
| --- | --- |
| `<model>.glb` | Near version of the Meshy model: about 8,000 triangles, 1024 px colour texture, base at the origin, real size in metres (y up) |
| `<model>-impostor.webp` | Image card atlas, 2048 x 1024, 8 views of the full-detail tree taken every 45 degrees around it (row 1: views 0-3, row 2: views 4-7), transparent background |

Suggested use: draw the GLB with `InstancedMesh` for plants within about 120 m of the camera, and the image card beyond that.
For the card, use one camera-facing quad per plant (instanced), pick the view from the angle between the camera and the plant minus the plant's rotation (`view = round(angle / 45deg) mod 8`), and use alpha test about 0.4. The quad is as tall as the tree; its width equals its height.

## placements/

`index.json` lists each species, the model it uses, its count and its 1 km tiles. `<species>.bin` is a flat Float32 array, 5 numbers per plant: `x, y, z, scale, rotY` (metres, y up, same world frame as the open-world map: x east, z south, origin at the map's (670, 490) pixel). Plants are sorted by tile, and `tiles["tx,tz"] = [first, count]`, so a tile can be loaded or culled as one slice.

Counts: ancient oak 25,697 · broadleaf tree 20,906 · pine 11,702 · wisteria 6,915 · bonsai 3,849 · ember 909 · fern 20,332 · bush 20,522 (110,832 in total, 2.2 MB). Placed from the biome densities; water, rivers, the palace and slopes steeper than 0.9 are kept clear.

## maps/

- `biome-1024.png`: biome index per pixel (0-21, the 22 biomes in art-references/open-world/OPEN-WORLD.md), for tinting grass and choosing flowers in the shader.
- `grass-1024.png`: where grass cards go (white = dense meadow, black = none), lighter under forests.

## fx/ (procedural textures, white so the shader tints them)

| File | Use |
| --- | --- |
| `ribbon.png` | Magic ribbons: strip texture, bright core across, shimmer and sparkles along; scroll U over time, additive blending |
| `aurora.png` | Sky drapes: curtain streaks, teal bottom edge fading to violet; put on long wavy strips, additive |
| `glow.png` | Fireflies, wisps, star points, lantern halos (soft round sprite) |
| `sparkle.png` | Four-point twinkles on ribbons, her stardust trail, the midnight sky |
| `lantern.png` | Floating lantern card (already warm-coloured) |
| `petal.png` | Falling petals in the blossom valley and the midnight finale |
| `grass-atlas.png` | 2 x 2 grass card atlas, dark base to light tip; tint by biome, bend tips with a wind wave |
| `flower-atlas.png` | 2 x 2 flower cards with a bright centre for the glow |

## Rules kept

Creatures have no eyes, statues are faceless, outfits are modest, crosses become stars. Meshy models keep their natural size; only the palace is enlarged.
