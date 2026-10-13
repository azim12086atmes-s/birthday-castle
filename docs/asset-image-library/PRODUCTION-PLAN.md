# Asset production plan and caps

The final library is capped at **230 selected sheets**, including the 45 original boards. **65 are reserved for the palace and interiors; 165 for other buildings and the world.** Existing shared designs count once. This is an allowance, not a target to fill with duplicates.

## Global allocation

| Scope | Cap | Currently selected | Remaining |
| --- | ---: | ---: | ---: |
| palace | 65 | 34 | 31 |
| other-map-buildings | 55 | 3 | 52 |
| terrain-water-and-planting | 65 | 7 | 58 |
| shared-outdoor-props-and-bridge | 25 | 3 | 22 |
| maps-magic-travel-and-birthday | 20 | 4 | 16 |

The 610-file archive contains crops, previews and historical experiments; it is not the final 230-sheet selection. Selected reference slots may still require visual review.

## Palace caps

| Structural/detail family | Cap | Existing selected |
| --- | ---: | ---: |
| Layout and envelope | 6 | 4 |
| Base, wall bodies and stepped wings | 10 | 1 |
| Tower bodies and roof assemblies | 9 | 3 |
| Glass, carvings, rails and architectural fittings | 18 | 13 |
| Stairs, fountains, terraces and courtyards | 10 | 7 |
| Interiors and furniture | 12 | 6 |

## Other map buildings and locations

Each ordinary named location gets **at most two dedicated sheets**; four larger sites get **at most three**. Three existing shared landmark boards occupy the remaining building slots. Packing and reuse are preferred to new designs.

| Location | Cap |
| --- | ---: |
| B02 Moon Water Palace | 3 |
| B03 Star Chapel | 2 |
| B04 Rose Keep | 2 |
| B05 Misty Lantern Palace | 2 |
| B06 Misty Pagoda | 2 |
| B07 Temple Hill | 2 |
| B08 Colosseum | 2 |
| B09 Lagoon Housing | 2 |
| B10 Canyon Palace | 3 |
| B11 Crescent Rock Arch | 2 |
| B12 Storybook Village | 2 |
| B13 Windmill | 2 |
| B14 Pillar Sky City | 2 |
| B15 Jade Jungle Temple | 3 |
| B16 Fjord Longhouse | 2 |
| B17 Glowwood Ruin Court | 2 |
| B18 Mother Tree | 2 |
| B19 Lantern Cove Gatehouse | 2 |
| B20 Glass Bridge Pavilion | 2 |
| B21 Tidal Observatory | 2 |
| B22 Pearl Lighthouse | 2 |
| B23 Sea Pavilion | 2 |
| B24 Reef Star Shrine | 2 |
| B25 Crystal Conservatory | 3 |

## Landscape and shared-world caps

| Location/family | Cap |
| --- | ---: |
| Palace grounds and rose gardens | 12 |
| Lantern Lake and pond habitats | 6 |
| Coast, open sea and reefs | 10 |
| Jade jungle and wetlands | 7 |
| Forest and Mother Tree environs | 8 |
| Fjord, highland and cliffs | 7 |
| Desert, canyon and crescent-arch terrain | 7 |
| Sky-island landscape substrates | 8 |
| Porcelain bridge and associated fittings | 4 |
| Garden and path furniture | 5 |
| Lighting and wayfinding | 4 |
| Monuments and guardian pieces | 5 |
| Docks, ramps and travel infrastructure | 3 |
| Water-garden fittings | 4 |
| Maps and placements | 4 |
| Sky and magical-place artifacts | 7 |
| Travel and wishing objects | 3 |
| Birthday celebration pieces | 6 |

## Execution order

1. Index the selected source panels and record what already exists.
2. Map each palace structure to its existing window, glass, cornice, railing, fountain, planting and ornament families.
3. Generate only verified missing large bodies/joins or packed small parts, reserving a slot before each call.
4. Review the result against its source; record proposed/hidden geometry and inaccuracies.
5. Keep IDs, revisions and model-reference hashes traceable; publish files and progress.
6. Complete the palace reference coverage matrix, then audit the next map locations under their local caps.

Current palace pass covers missing wing bodies, base/gate hosts, tower shafts, stair/cascade bodies and absent private-room furniture. Existing roof gardens, crowns, window/door assemblies and ornaments are reused. A later modelling pass will resolve dimensions and snap fits; this pass does not claim a completed palace model.

## Layer-by-layer palace references

The current requested pass is [four source-linked layer sheets](palace-layer-sheets/README.md), each with three assemblies and a proposed backward extension. The original front remains the authority; unseen rear depth is proposed. Generated sheets require visual review before modelling.

Four layer sheets now occupy four additional palace slots. There are 64 selected/reserved slots globally, 47 within the palace cap. These counts include unproduced reservations; they do not imply accepted sheets. Twelve proposed assembly IDs are indexed. Rear length, hidden tower joins, tracery parity and projection agreement remain review tasks.

## Continuous front and entrance correction

The owner reported tower, wing and five-arch adjacency inconsistencies in the layer sheets. Use the [whole-front and entrance correction](palace-front-correction/README.md) to resolve layout before splitting modules. The entrance constraints keep 150 grid m between the ground-facing front wall and gate wall, including 75 grid m of terrace after the stair top. Generated sheet parity remains pending.

The four inconsistent PAL-LAYER slots are now retired from final selection, with their files, IDs and attempt history retained. The two requested corrections replace them as layout studies. The ledger currently holds 62 selected/reserved slots globally and 45 for the palace; existing images and unproduced reservations remain distinct from approvals.
