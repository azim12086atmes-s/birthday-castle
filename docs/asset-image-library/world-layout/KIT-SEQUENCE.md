# World kit production sequence and caps

This pass delivers the expanded12km world proposal with three forest districts, eight cottage clearings, and an allocation/source matrix. No new architecture, foliage, terrain or object kit is generated yet. [Per-location matrix](kit-plan.csv) · [25 location anchors](locations.csv) · [Regions/routes/coast](layout.json)

1. For the new exploration areas, audit **B12 Storybook Village** and sharedT05 forest references first. B12 retains2 sheets for packed shell/decor modules reused acrossFC01–FC08; no per-cottage sheets. Then continue with **B02 Moon Water Palace**, which connects the palace approach, southern basin and bridge. Inspect its original GEN-05 panel; separate structure, windows/domes/columns, paving/rails and decor already shown. Generate only missing3–4-section assemblies and10–20-item detail packs.
2. Continue to B03 Star Chapel and western village/harbor routes, then other districts. Keep each building's source palette and profile; do not recolour every location to palace rose.
3. Audit shared foliage per terrain region: canopy/understory/ground cover/planters first. Reuse existing species before creating variations.
4. Audit natural modules: ground joins, soil/sand/cliff/shore pieces, roots, rocks, reef/tidal edges, water surfaces and river transitions. Wave directions/foam are an intended appearance, not a simulation result.
5. Audit small site objects: benches, lights, railings, travel/wishing objects, signs and ornaments. Existing bridge kits and GEN-20/28/35 are reuse sources.

## Global allocation

| Owner | Final cap |
| --- | ---: |
| Palace |65 |
| Other-map buildings |55 |
| Terrain/water/planting |65 |
| Shared outdoor props/bridge |25 |
| Maps/magic/travel/birthday |20 |
| **Total, including original45 boards** |**230** |

Other-building allocation is **three existing composite boards plus52 dedicated slots** across24 building families. Each source-derived location has2 slots, with3 for B02/B10/B15/B25. Caps are allowances, not automatic generation requests. Source-only crops, rejected attempts and composition previews stay outside selected design slots under the saved counting rule.

## Terrain-region allowance

| Region | Reuse/source scope | Cap |
| --- | --- | ---: |
| T01 Royal terraces and rose gardens | GEN-08, GEN-13, GEN-14, GEN-15, GEN-16, GEN-35 | 12 |
| T02 Sheltered lakes and Moonwater gardens | GEN-10, GEN-11, GEN-12, GEN-14, GEN-18 | 6 |
| T03 Open coast sea and reefs | GEN-04, GEN-09, GEN-21, GEN-28 | 10 |
| T04 Jade jungle and wetlands | GEN-09, GEN-13, GEN-21 | 7 |
| T05 Glowwood storybook and Mother Tree forest | GEN-06, GEN-08, GEN-09, GEN-13, GEN-22 | 8 |
| T06 Local fjord highlands and misty ridges | GEN-04, GEN-09, GEN-21 | 7 |
| T07 Canyon and crescent-arch terrain | GEN-05, GEN-06, GEN-21 | 7 |
| T08 Sky-island substrates | GEN-04, GEN-22, GEN-23 | 8 |

These65 terrain slots include existing boards and palace-ground landscape. Regional foliage/natural objects use packed shared families, not a new image for every tree or shoreline instance. Placement quantity and world streaming/LOD/navigation remain implementation tasks.

The maps/placements subfamily is capped at4; GEN-04 and WLD-MAP-002 currently use2; WLD-MAP-001 is retired/preserved. World-selected slots total21/165, leaving144 unallocated world slots; palace65/65 remains. No new paid model service or runtime changes are authorized or performed by this planning pass.

## Cottage and forest reuse

[Forest plan](FOREST-EXPLORATION.md) details three districts and eight placements. Keep the existing8-sheetT05 forest allowance. Audit canopy/understory/ground cover, soil/path/stream transitions, rocks/roots and small trail objects before generating more. ReuseB12 cottage modules for gable/corner/porch variants; human-size cottage details remain independent of the giant palace scale.

## First world location kit pass

[West Lantern Forest and Storybook cottage pilot](../world-location-kits/west-lantern-forest/README.md) adds fourpackedreferenceboards and32componenttargets. Trees/plants/rocks/paving/lightsalreadyshownare reused. B12dedicated2/2, twoT05forestslots,230globalcapunchanged. References/roofendgeometryandallmodels/joinsstillpendingreview.
