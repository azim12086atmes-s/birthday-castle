# Starlight Coast open world: terrain, biomes and numbers (Oct 16)

Built on the sheet 04 coastline and the B01 to B25 positions (x S = 2.75), with new relief: a mountain range along the north coast and down the west, the Misty Keep massif in the NE, hills everywhere inland, rivers, waterfalls, a fjord, a red canyon, a karst pillar forest and a reef.

Files in this folder (art-references/open-world in the project files; previews, numbers and scripts also in design/open-world on GitHub):
- `open-world-map.jpg`: the painted map with labels (2048 px, relief shading exaggerated x3).
- `biome-map.png`, `geology-map.png`: flat colour maps.
- `open-world-terrain-20km.blend`: the 3D terrain (2048 x 2048 grid, about 10 m per cell) with sea, Lantern Lake, mountain tarns and the lagoon as water. Renders: `ow-*.jpg`.
- `heightmap-4033-16bit.png` and `.r16`: for Unreal Landscape later. Scales are in `heightmap-info.json`.
- `open-world-numbers.json`: every number below.

## The numbers
| | |
|---|---|
| Map | 20.7 x 20.7 km (428 km²) |
| Land | 208.5 km², of which 169.2 km² can be walked (slope under 31°) |
| Highest point | 1,517 m (Misty Keep massif); three summits about 1,500 m |
| Summits over 250 m | 19 (11 over 400 m, 4 over 700 m, 3 over 1,000 m) |
| Hills 40 to 250 m | 46 distinct hills |
| Lantern Lake | 11.0 km² |
| Mountain tarns | 5 (0.7 km²) |
| Rivers / streams | 20 km of river, 61 km of streams |
| Waterfalls | 36 |
| Coastline | about 210 km |
| Cliffs | 13 km² of cliff faces; 45 sea stacks |
| Karst pillars | 150 (120 to 430 m tall) at the Pillar Sky City |
| Fjord | 7.2 km long, NW, ends at the Fjord Longhouse |
| Reef | 5.9 km² coral shallows, SE |
| Lagoon | 1.0 km² open water plus 2.6 km² wetland |
| Landmarks | 25 (B01 to B25, each on a flattened pad), 4 sky isles |

## 22 biomes
| Biome | km² | % of land |
|---|---|---|
| Temperate forest | 54.7 | 26.2 |
| Rolling grassland and farms | 33.4 | 16.0 |
| Fjord pine taiga | 17.2 | 8.2 |
| Flower meadow | 12.7 | 6.1 |
| Lakes and rivers | 12.6 | 6.1 |
| Blossom groves | 12.1 | 5.8 |
| Red sandstone canyon | 11.0 | 5.3 |
| Sea cliffs and stacks | 8.3 | 4.0 |
| Karst pillar forest | 9.1 | 4.3 |
| Bare rock and scree | 6.1 | 2.9 |
| Palace grounds and terraces | 7.2 | 3.4 |
| Glowwood forest | 6.2 | 3.0 |
| Jungle | 4.3 | 2.1 |
| Sandy beach | 3.7 | 1.8 |
| Dunes | 3.8 | 1.8 |
| Misty highland moor | 2.7 | 1.3 |
| Lagoon and wetland | 2.6 | 1.0 |
| Alpine meadow | 0.8 | 0.4 |
| Snow and glacier | 0.6 | 0.3 |
| Coral reef shallows | 5.9 | sea |
| Shallow sea | 75.9 | sea |
| Deep ocean | 137.4 | sea |

## 10 rock types (land km²)
Shale under soil 70.3, alluvium and clay 48.4, granite 24.6 (north range), rose marble 13.9 (palace hill), red sandstone 11.8 (canyon), limestone karst 10.6 (pillars), gneiss and schist 8.2 (Misty massif), basalt 8.2 (east sea cliffs), coral limestone 7.9 (SE), slate 4.7 (fjord).

## What we have for each biome, and what to find
Our 21 Meshy models cover the built places well and the wild land poorly. **Biggest gap: trees and ground plants.** Temperate forest, taiga and grassland are half the land and we have no oak, pine, birch, fern or bush model.

| Biome | We have | Find (Meshy or a pack) |
|---|---|---|
| Temperate forest | Mosswood house, Ember tree (recolour) | 3 to 4 broadleaf trees (oak, beech, maple, birch), bushes, ferns, fallen logs, mushrooms |
| Grassland and farms | Medieval cottage, English cottage | windmill (B13), barn, fences, hay bales, crop patches, field stones |
| Fjord taiga | none | pine and spruce (2 to 3), mossy boulders, longhouse (B16), wooden pier |
| Flower meadow | Garden gate | wildflower clumps (3 colours), tall grass, small stone walls |
| Lakes and rivers | Koi pond, two bridges, Yuki lotus dais | lily pads, lotus, reeds, willow (T02c), river stones, waterfall foam |
| Blossom groves | Bonsai and Ember (pink recolours) | 2 cherry-blossom trees, petal carpet, lanterns |
| Red canyon | Vintage stone villa, Stone portal, Lantern gate | rock arch, hoodoos, desert shrubs, rope bridge |
| Cliffs and stacks | Stone portal, Lantern gate (cave) | cliff wall modules, basalt column set, sea-stack rocks |
| Karst pillars | none (pillars are built from terrain) | cliff pines, hanging vines, mist cards, white spire buildings (B14) |
| Bare rock, scree | stone_henge (15 stones, can be split) | boulder and scree pack |
| Glowwood | stone_henge, Stone portal | glowing mushrooms, bioluminescent tree, glowing ferns |
| Jungle | none | palm, banyan, giant leaves, vines, temple ruin (B15) |
| Beach and dunes | none | coastal pine (T02d) or palm, dune grass, driftwood, shells |
| Misty moor | stone_henge | heather, crag rocks, keep (B05) |
| Alpine, snow | none | alpine flowers, snowy rocks, ice chunks |
| Lagoon, wetland | Mediterranean villa | mangroves, reeds, boardwalk, canal walls |
| Reef, sea | none | coral clusters, shells, small boats, eyeless sea creatures |
| Palace grounds | urns, iron fence, armillary, Yuki, garden gate, bonsai, garden island | palace itself (our own build) |

Count: 6 biomes are well covered, 6 partly, 10 have nothing yet. A shopping list of about 40 models (12 trees and plants first) would cover every biome.
