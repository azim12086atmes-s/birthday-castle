# Meshy models (owner, 2026-10-16)

Source zips stay in /mnt/project-files/ (about 250 MB, not in git). Each has a 2048 px colour atlas, normal, roughness, metallic and emission maps, and one FBX in roughly ±1 unit space (no real-world scale). Previews are rough point renders made by me, not proper 3D views, so check shapes in a real viewer.

| Model | Triangles | What it looks like | Likely place |
|---|---|---|---|
| Classical Sculpture C | 1,322,933 | A kit of 6 carved pieces on square plinths: 2 ornate urns, 2 round carved lids or medallions, 2 crouching lions. | Hero carvings: A010 lotus capital, A023 rail finials, courtyard urns. Check faces for the no-eyes rule. |
| Leafspire Cathedral | 104,874 | A leaf-shaped hall with a tall curved shell wall and a gold and teal leaf-pattern floor. | Glowwood Ruin B17 or Mother Tree area. |
| Mosswood Teardrop House | 87,362 | A teardrop dome house covered in moss with a wooden rib frame. | Storybook Village B12 or Glowwood cottages. |
| The Arcane Gateway | 1,831,098 | A mossy floating stone ruin with blue portal rings on top. | Sky portal gates. |

## For the web
- Budget is about 6k triangles per landmark at Low, so every model needs decimating: about 8k near, 2k far.
- Convert FBX to GLB with meshopt, and the atlases to KTX2. Keep the normal map so the carving survives.
- The two 1M+ meshes need an offline Blender decimate and a normal bake first.
- Three.js has no FBX loader vendored in the game yet.
