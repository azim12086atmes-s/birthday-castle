# Populated world: what is placed, and from which sheet (Oct 16)

File: `castle-world-populated-20km.blend` (about 1.5 GB, exact meshes, instanced). Built by `world/build2.py` in the thread's scratch area; the renders use reduced copies so the cloud machine can draw them.

Positions come from sheet 04 (map) through `owner-sketch-spec.md` section 1; what goes where comes from sheets 05, 06, 07, 08/09, 10 to 15.

| Sheet panel | What the sheet shows | Meshy model used | Count | Size |
|---|---|---|---|---|
| 05 B03 Star Chapel | Gothic pink-navy chapel, 100 x 160 m x S | Gothic_Cathedral | 1 | 440 m |
| 06 B25 Crystal Conservatory | Glass dome, orchid planting | Leafspire_Cathedral (closest; dome missing) + Enchanted_Garden + 12 garden gates | 1 + 1 + 12 | 275 m, 60 m, 3 m |
| 06 B18 Mother Tree | Giant pink-blossom tree with bark windows | Ember_Tree (recolour pink), Mosswood teardrop house, small Leafspire | 1 + 1 + 1 | 120 m |
| 06 B21 Tidal Observatory | Bronze dome with star clock | Celestial_Armillary on the dome | 1 | 54 m |
| 06 B17 Glowwood Ruin Court | Moss-covered ruined arches | stone_henge, Stone_Portal | 1 + 1 | 40 m, 60 m |
| 05 B10 Canyon Moon Palace | Sandstone houses, teal domes, waterfalls | Vintage_Stone_Villa, Stone_Portal, Lantern_Gate | 8 + 1 + 1 | 25 m, 60 m, 30 m |
| 05 B09 Lagoon City | White blocks, teal domes, canals | Mediterranean_Villa | 34 | 18 m |
| 06 B12 Storybook Village | Half-timber, slate roofs | Medieval_Cottage, Mosswood | 40 + 10 | 12 m, 10 m |
| 05 B07 and 09 T02b | Temple hill, gold-leaf trees | Ember_Tree | 16 | 30 m |
| 09 T02e avenue trees | 100 m white-bark trees every 60 m | Ember_Tree scaled up (recolour white bark) | about 2 per 60 m of causeway | 100 m |
| 07 A023 bridge rail | Rail on the causeway and lake bridges | Gothic_Iron_Fence | one every 3 m, both edges, over water | 3 m |
| 10 W01 Lantern Lake | Arched bridges across the lake | Ancient_Stone_Arch_Br (causeway and spans to B02 and B03), Stone_Serenity_Bridge | many + 3 | 40 m, 30 m |
| 08 T01 royal rose-blossom tree | 25 m tree in a lotus planter | Copper_Cloud_Bonsai scaled up (pink) | 18 | 25 m |
| 07 A035 lotus fountain | 18 m fountain | Yuki scaled up | 8 | 18 m |
| 11 W02 ponds | Lily pond 14 x 9 m | Koi_Pond | 4 | 12 m |
| 04 sky isles and portals | Four isles, sky portals | Enchanted_Garden (isle top), The_Arcane_Gateway (portal) | 4 + 8 | 60 m, 247 m |

Not from the sheets: three English cottage clearings and one extra stone circle (forest clearings FC01 to FC08 are on the branch's 12 km plan only).

## Not covered (no Meshy model fits, stays a grey placeholder box)
B04 Rose Keep, B05 Misty Keep, B06 Pagoda, B07 rotundas, B08 Colosseum, B11 Crescent Arch, B13 Windmill, B14 Pillar Sky City, B15 Jungle Temple, B16 Longhouse, B19 Cove Gatehouse, B20 Bridge Pavilion, B22 Lighthouse, B23 Sea Pavilion, B24 Reef Shrine, B02 Moon Water Palace, and the palace B01 (our own builds from the B01 and B02 sheets).
Earlier today's first populated try put cathedrals on B04 to B08; the sheets show those are a pink keep, a lantern keep, a pagoda, rotundas and a colosseum, so they were removed.
