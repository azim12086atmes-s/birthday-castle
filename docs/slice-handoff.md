# Handoff: the 600 m "beauty slice" (Oct 18, 2026)

Owner, Oct 18 11:14: the terrain, foliage, map vastness, water and grass still fall far short of Arkenfall. Stop patching symptoms and work the way a real game team does.
Full gap write-up (Claude Doc): https://claude.ai/code/artifact/283d22c7-b6ee-491f-b1fc-1afe514a8529
Arkenfall teardown: docs/arkenfall-study.md. Match its look with our own code only; never copy its source, shaders or assets.

## Gaps (root causes, not symptoms)
- **Terrain:** the height grid is ~20 m per cell (data/world/crescent-h.bin, 1024²) and the near tiles are 12 m cells (coast.js CHUNK 384 / CN 32). There's no walking-scale relief and no erosion; the mountains are smooth cones with painted streaks. Ground colour is vertex colour plus noise (ground.js), with no tiled ground sets or normal maps. Rocks were removed.
- **Grass:** blades are 8–17 mm wide at about 40/m², lit flat (a root-to-tip colour ramp only), and the ground under them doesn't match. Flowers are flat stars (meadow.js).
- **Trees:** near trees have castShadow=false (trees.js:218). There are no understory layers (shrubs, ferns, logs, rocks), colours are mixed at random, and crowns are blobby.
- **Water:** the sea is one flat plane (coast.js waterMesh) reflecting sky colour only, with no scene depth, refraction or world reflection, depth from a coarse 401² map, and no rivers.
- **Vastness and light:** the crescent wall is one smooth near surface, the middle distance is empty, and there's no layered recession. Light has no AO and no shafts, uses ACES not AgX, and has no auto exposure, so the dusk tint washes everything.

## Plan: finish one slice, then scale out
Slice: 600 × 600 m by the meadow below the crescent wall, around x −5600…−6200, z 2400…3000. Camera `walk` = `-5600,185.8,3000,-6400,178,2000,70`; `meadow` and `eye` are nearby. It holds a meadow, a wood edge, a stream into a small lake, and a hill with a palace view.
1. Target board: 6–8 Arkenfall eye-height frames from the owner (meadow, wood edge, water, far view, dusk, night), shot beside ours at the same angles every round.
2. Terrain: Python erosion at 4× resolution (affects roads, pads and placements, so coordinate with the study thread). Walking-scale detail noise identical in JS (terrainHeight in layout.js, used for collision and placement) and GLSL (the grass gHeight in meadow.js). A finer ring of tiles near the player. Five or six tiled ground sets with normal maps, blended by slope, height and erosion masks.
3. Grass: clumps (tussocks 1.6 m, stands 5 m), blades 2–5 cm wide and much denser up close, rounded normals, backlight glow, darker roots, ground matched beneath, tree shadows received, and real flower models in drifts.
4. Forest layers: a biome recipe of canopy, young trees, shrubs, ferns, logs and rocks, one palette per wood, with near-tree shadows on.
5. Water: depth and colour from the scene, clear shallows, soft shores, a mirror for the lake and moat, SSR for the sea, a stream along the erosion line.
6. Light: half-res AO, AgX, warm sun with cool shade, shafts, auto exposure, one grade.
7. Budget: ~1.6M triangles and ~160 draws a frame on a mid laptop.
8. When the owner signs off, roll out map-wide: erosion everywhere, biome recipes, rivers, layered far mountains.

## Where things are
- Code: Three.js r169. Branch flow: work on your branch, open a PR into `claude/game-logic-4d13do` (the Game logic thread merges it and refreshes the `play` branch, which serves https://azim12086atmes-s.github.io/birthday-castle/).
- Key files in js/world/: coast.js (land tiles, water, forests), ground.js (land shader), meadow.js (GPU grass), trees.js, layout.js (terrainHeight, TERRAIN_GRID), crescent.js (height maps), look.js (haze, mist, grade), fill.js (Meshy models, 3-step LOD), js/quality.js (pixel budget, FrameGovernor), js/main.js (renderer, shadows ±70 m).
- Test harness: tools/shots/. Serve the repo with `python3 -m http.server 8080` (it dies often; restart it). Then run `ONLY=walk,meadow WAIT=120000 node tools/shots/shoot.mjs out` (playwright at /opt/node-tools; swiftshader is slow, so models stream after about 75 s). perf2.mjs gives draws and triangles per group; fillchk.mjs gives fill triangles over time; net.mjs gives bytes.
- URL params: `?quality=high&scenes=0&dusk=1&cam=x,y,z,tx,ty,tz,fov` (also `&night=1`, `&debug=1`).
- Owner's Arkenfall screenshots go in: docs/arkenfall-ref/ (commit them; /mnt/project-files is full).
- The browser tools freeze on arkenfall.site and the container can't reach it, so the screenshots must come from the owner.
