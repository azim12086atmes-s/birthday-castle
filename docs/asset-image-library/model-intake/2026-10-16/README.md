# Uploaded Meshy models — intake review

[One-image-at-a-time gallery](index.html) · [Inventory and complete file status](inventory.json) · [Image library](../../README.md)

**58 attachments supplied. 17 archives downloaded; 3 are exact duplicate archives, leaving 14 distinct packages.** All fourteen ZIP CRCs pass and all fourteen FBX packages import in Blender 4.3.2 with textures available. Each has four saved inspection angles. The other **41 attachments exceed the tool's 32 MiB transfer limit** and could not be opened; their identities are not visually verified.

The two garden-panel packages share identical geometry fingerprints but different textures. There are therefore **13 measured geometry fingerprints across 14 candidate packages**. UV layouts were not fingerprinted, so shared-buffer/material swapping is not certified. Archive duplicates remain preserved.

## What is visible

The collection includes a pink domed canopy bed, two rose doors, a floral window, green/blue garden-panel variants, a stone lantern, a mountain-painted folding screen, a standing-stone circle, three shallow gold ornaments, a cathedral shell and a mossy stepped rock ledge. Friendly names below come from the rendered objects, not just truncated ZIP filenames. Proposed reuse is recorded per asset; no model is automatically assigned to an existing reference ID or map anchor.

| Candidate ID | Visually identified object | Triangles | Preview |
| --- | --- | ---: | --- |
| `UPL-48B60C2BFC69` | Pink domed canopy bed | 9,994 | [Four angles](previews/UPL-48B60C2BFC69.png) |
| `UPL-76DA8BB7D7CD` | Rose arched double door | 9,992 | [Four angles](previews/UPL-76DA8BB7D7CD.png) |
| `UPL-AD0FE58DF9FC` | Floral arched window panel | 9,992 | [Four angles](previews/UPL-AD0FE58DF9FC.png) |
| `UPL-98253A473847` | Rose single door with bird decor | 10,000 | [Four angles](previews/UPL-98253A473847.png) |
| `UPL-5B3AAB3E5537` | Green stained-glass garden panel | 9,993 | [Four angles](previews/UPL-5B3AAB3E5537.png) |
| `UPL-6F2ACB9A029D` | Blue rose garden door panel | 9,993 | [Four angles](previews/UPL-6F2ACB9A029D.png) |
| `UPL-AEB4347F477B` | Stone garden lantern | 212,061 | [Four angles](previews/UPL-AEB4347F477B.png) |
| `UPL-EC5831420311` | Mountain-painted folding screen | 108,504 | [Four angles](previews/UPL-EC5831420311.png) |
| `UPL-74F4D19C5CE3` | Mossy standing-stone circle | 447,406 | [Four angles](previews/UPL-74F4D19C5CE3.png) |
| `UPL-777518144B3A` | Horizontal gold foliate flourish | 208,304 | [Four angles](previews/UPL-777518144B3A.png) |
| `UPL-761E04C7346A` | Twin-spire Gothic cathedral shell | 29,669 | [Four angles](previews/UPL-761E04C7346A.png) |
| `UPL-C4FF909D561B` | Vertical gold foliate flourish | 243,317 | [Four angles](previews/UPL-C4FF909D561B.png) |
| `UPL-752BBF86A60F` | Gold fleur-de-lis relief | 126,131 | [Four angles](previews/UPL-752BBF86A60F.png) |
| `UPL-432F90D7091E` | Mossy stepped rock terrace | 556,829 | [Four angles](previews/UPL-432F90D7091E.png) |

## Important fit findings

- The imports are mostly normalized to roughly **two Blender units**. This is not an approved metre scale. The bed, cathedral, rock outcrop and tiny reliefs must not all retain the same world height. Preserve originals and normalize only a reviewed working copy against the relevant host contract.
- All fourteen imports contain **one named mesh object each**. Door leaves, frames, fabric and planted bases are not separate named editable/animated parts. One mesh object can still contain disconnected geometry; it does not prove one watertight solid.
- **Seven candidates exceed 100,000 triangles.** Small gold ornaments have 126k–243k triangles, the lantern 212k, the stone circle 447k and the rock ledge 557k. They need use-specific reduction/LODs and simple collision before repeated browser placement. The six palace bed/door/window candidates are around 10k each; the cathedral shell is about 30k. Counts are inspection measurements, not performance certification.
- Texture nodes, image availability, UV-layer count, non-manifold/boundary-edge counts, raw bounds and source hashes are saved in `audits/`. Some imported materials have only a base-colour image; a working transparent pane or full PBR response cannot be inferred from its appearance. Topology flags need interpretation for each intended shell or relief, not automatic rejection.
- Closed door artwork does not create an opening. A circle of stones must not get a single collision hull across its centre. The rock's apparent steps have no tested riser heights, navigation or terrain joins yet.
- These are user-supplied **intake candidates**, not accepted final game assets. No FBX/ZIP binary, edited model, paid service call or final GLB export was added to the repository. Original archives and extracted sources remain in the current cloud workspace. Technical inspection renders do not consume concept-sheet slots.

## Verified duplicate archives

These files have the same SHA-256 as their counterpart, not merely similar filenames:

- Meshy_AI_Baroque_Flourish_1016063642_texture_fbx.zip → `UPL-C4FF909D561B`
- Meshy_AI_Gothic_Cathedral_1016063629_texture_fbx.zip → `UPL-761E04C7346A`
- Meshy_AI_Gilded_Baroque_Flouri_1016063604_texture_fbx.zip → `UPL-777518144B3A`

## Files blocked by transfer size

To inspect these, provide files under **32 MiB each**: for example, extract the ZIP and upload its FBX and textures separately, or provide a smaller textured GLB. No asset regeneration is required. The `.crdownload` attachment may be unfinished; its contents have not been inspected.

- Meshy_AI_Royal_Carriage_1016070936_texture_fbx.zip
- Unconfirmed 198147.crdownload
- Meshy_AI_Golden_Rose_Teacup_1016064856_texture_fbx.zip
- Meshy_AI_High_detail_wall_dec_1016065830_texture_fbx.zip
- Meshy_AI_Create_a_whimsical_3D_1016070851_texture_fbx.zip
- Meshy_AI_A_very_detailed_and_e_1016065906_texture_fbx.zip
- Meshy_AI_For_Diana_This_beauti_1016065910_texture_fbx.zip
- Meshy_AI_A_modular_medieval_ho_1016065704_texture_fbx.zip
- Meshy_AI_Design_a_regal_prince_1016065928_texture_fbx.zip
- Meshy_AI_Verdant_Ring_of_Stone_1016064743_texture_fbx.zip
- Meshy_AI_Crystal_Blossom_Mirro_1016065020_texture_fbx.zip
- Meshy_AI_Luminous_Paper_Flower_1016064832_texture_fbx.zip
- Meshy_AI_Enchanted_Forest_Thro_1016065037_texture_fbx.zip
- Meshy_AI_Emberkeep_Turret_1016064647_texture_fbx.zip
- Meshy_AI_Enchanted_Lantern_Tre_1016065228_texture_fbx.zip
- Meshy_AI_Verdant_Cascade_Fount_1016064122_texture_fbx.zip
- Meshy_AI_Magenta_Bonsai_Tree_1016064843_texture_fbx.zip
- Meshy_AI_White_Lotus_1016065159_texture_fbx.zip
- Meshy_AI_Casa_Encantadora_1016064528_texture_fbx.zip
- Meshy_AI_Celestial_Armillary_1016053624_texture_fbx.zip
- Meshy_AI_An_english_country_co_1016064115_texture_fbx.zip
- Meshy_AI_Yuki_1016065151_texture_fbx.zip
- Meshy_AI_Gothic_Iron_Fence_1016065031_texture_fbx.zip
- Meshy_AI_Copper_Cloud_Bonsai_1016064823_texture_fbx.zip
- Meshy_AI_Enchanted_Thatch_Cott_1016064146_texture_fbx.zip
- Meshy_AI_Stone_Portal_1015064937_texture_fbx.zip
- Meshy_AI_Medieval_Cottage_1016064205_texture_fbx.zip
- Meshy_AI_Mediterranean_Villa_1016064215_texture_fbx.zip
- Meshy_AI_Stone_Serenity_Bridge_1016064055_texture_fbx.zip
- Meshy_AI_Koi_Pond_with_Stone_B_1016063804_texture_fbx.zip
- Meshy_AI_Vintage_Stone_Villa_1016063859_texture_fbx.zip
- Meshy_AI_Cathedral_Render_1016063636_texture_fbx.zip
- Meshy_AI_Ancient_Stone_Arch_Br_1016064107_texture_fbx.zip
- Meshy_AI_Mosswood_Teardrop_Hou_1016064039_texture_fbx.zip
- Meshy_AI_Leafspire_Cathedral_1016063813_texture_fbx.zip
- Meshy_AI_The_Arcane_Gateway_1016063724_texture_fbx.zip
- Meshy_AI_Classical_Sculpture_C_1016063618_texture_fbx.zip
- Meshy_AI_Lantern_Gate_to_the_S_1016062118_texture_fbx.zip
- Meshy_AI_Enchanted_Garden_Gate_1016062236_texture_fbx.zip
- Meshy_AI_Enchanted_Garden_with_1016062214_texture_fbx.zip
- Meshy_AI_Ember_Tree_1016061713_texture_fbx.zip

## Suggested first usable batch

Fit the lower-density bed/door/window candidates individually to their intended host, resolving pivots, glass/door parts, scale and simple collision. Keep the two garden-panel textures as possible variants. Optimize the gold details, lantern and rock ledge before using them repeatedly. Retain the cathedral as a shell candidate until its source/style, true entrance and interior scope are agreed. This intake does not change the accepted palace layout or the 34 world anchors.
