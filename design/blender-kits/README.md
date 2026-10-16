# Blender kits: the exact Meshy models, placed at world size (Oct 16)

Built in the cloud Blender (bpy 5.2, Cycles CPU). Full triangle counts, nothing decimated.
Each `.blend` holds every model of one kit at its target size (sizes from `../assets/meshy-2026-10-16/KITS.md`, drawn sizes of 90 m or more times S = 2.75), side by side on a ground plane, textures from the original files.

| File | Models |
|---|---|
| kit-1-terrain.blend (456 MB) | Stone_Portal 60 m, Lantern_Gate 30 m, Koi_Pond 12 m, Enchanted_Garden 60 m, English_Country 385 m, Garden_Gate 3 m |
| kit-2-relics.blend (254 MB) | stone_henge 40 m, Armillary 18 m, Arcane_Gateway 247 m, Classical_Sculpture 3 m, Yuki 6 m |
| kit-3-bridges.blend (100 MB) | Serenity_Bridge 30 m, Arch_Bridge 40 m, Iron_Fence 3 m |
| kit-4-trees.blend (129 MB) | Ember_Tree 30 m, Copper_Bonsai 6 m |
| kit-5-buildings.blend (584 MB) | Medieval_Cottage 12 m, Mosswood 10 m, Mediterranean_Villa 18 m, Vintage_Stone_Villa 25 m, Gothic_Cathedral 440 m, Cathedral_Render 330 m, Leafspire 275 m |

Previews: `kit-N-*.jpg` shows true relative size, `kit-N-*-sheet.jpg` shows every model at the same height, `kit-contact-sheet.jpg` stacks the five sheets.
The full-detail source files are in `../assets/meshy-2026-10-16/models/<Name>/` (FBX plus maps). The .blend files are too large for GitHub; only previews and this note are in the repo.
Open on a machine with enough memory (kit 5 alone is about 13 million triangles).
Still to do: recolour pass, koi and lion eye check, split Classical_Sculpture into its six parts, snap kits onto the 20 km layout markers.
