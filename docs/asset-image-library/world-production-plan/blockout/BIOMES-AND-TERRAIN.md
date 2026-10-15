# Regional terrain and FC05 habitat pass

**[Open the updated geography page](index.html)** · [World biome review](review/biomes-world.png) · [FC05 habitat plan](review/FC05-habitat-plan.png) · [FC05 terrain envelopes](review/FC05-habitat-terrain.png) · [Complete loop return](review/FC05-full-loop-return.png)

This continues P1 geography with physical regional landform changes and a detailed local habitat layout. The 12 km envelope, 2.5 km palace reservation, 34 location anchors, eight cottages, source routes and named pond positions remain preserved. No final flora meshes, wildlife behavior, architectural models or new reference images were generated.

## Regional terrain and ecology

| Region | Implemented terrain proposal | Habitat recipe for later assets |
| --- | --- | --- |
| T01 Royal grounds | Gentle garden shoulders around the retained flat palace reservation | Garden loam/meadow, blossom, roses, hedges and cypress accents |
| T02 Lake and lagoon | Existing irregular freshwater/tidal boundaries, bank influence and separate water levels | Silt/gravel/damp meadow, willow, reeds, lilies; freshwater visitors |
| T03 Open coast | Low uneven dune packets along the irregular open coast | Wet/dry sand, salt meadow, coastal pine, reefs and coastal visitors |
| T04 Jungle | Humid hummocks and shallow swales near the existing temple | Damp litter, roots, fern/vine/palm families and jungle visitors |
| T05 Three forests | Low northern/western ridges and a distinct northeast woodland relief | Broadleaf/fern northern woods; mossy western storybook forest; birch/conifer mistwood |
| T06 Highlands | Localized ridge fingers and a northeast approach saddle | Scree, rocky meadow, heather and suitable woodland species |
| T07 Canyon | Eroded gully and dry shoulders in a localized southeast patch | Sandstone grit/strata, dry grass, sparse shrubs and dry-land visitors |
| T08 Sky | Separate recipe and retained horizontal projections | Island substrate, selected garden families; altitude and access remain unresolved |

Ground-region membership now uses the saved building-region assignments, actual forest polygons and wet/coastal influences. It replaces the earlier single-centroid colour blend. All 25 building anchors retain their source region as the dominant class. Sky recipes do not paint a ground biome or invent an altitude. Terrain and region boundaries are proposed, not a recovered survey.

The **six TR01–TR06 transition sections** have sampled height profiles and proposed blend-band widths. The new transition selector exposes their grade and wet crossings. Four sections exceed the provisional 12% review threshold: TR02, TR04, TR05 and TR06. They require grading, steps or crossing design before being treated as routes. TR01/TR03's gentler sampled grades do not approve their entrances or complete connections. The original **14 regional crossing candidates** remain visible.

The ground display offers biome/substrate, elevation, slope and water-edge proximity. Water-edge colour is a proximity guide, not a climate or flood model. The optional 4× world vertical display is for inspection only; numerical heights, geometry tests and local walking retain true metre units.

[terrain-ecology-report.json](terrain-ecology-report.json) records region recipes, 100 m sampled area estimates and six transition profiles. A dominant-class area estimate excludes water and is not an exact habitat boundary.

## FC05: terrain before dressing

The sample uses the existing 150 × 150 m tile and 70 m clearing. The retained loop is **370.13 m**; the entrance spur and return make the complete browser check **468.33 m**. FD02 remains **806.23 m** from the cottage and is a later destination. The small local test pond is separate.

The six ground zones are:

* **H01 Cottage yard:** firm ground, clear doorway and a readable approach.
* **H02 Trail and short verge:** a 3 m trail corridor, bridge deck and low verges.
* **H03 Shaded moss hollow:** mossy ground, bramble and fallen timber outside the route.
* **H04 Sunny clearing:** meadow and small flower/fruit clump placements.
* **H05 Pond/rill margins:** wet-bank ground, reeds and proposed pond-edge observation.
* **H06 Outer canopy belt:** broadleaf and birch envelopes with varied spacing and high crown bases.

Off-route micro-relief adds low mounds and a shaded hollow. It is zero within 5 m of the original trail/spur and near the threshold. The yard datum now agrees with the world FC05 pad; the cottage floor is **one 150 mm riser higher**. Local terrain blends to the world heightfield between radius 70 and 75 m, and all square tile edges agree with the world terrain. This checks future tile seams without claiming that streaming is implemented.

The high-resolution local mesh uses **0.75 m cells**. The rill has a visible water ribbon with its declared 1.1 m width and descending proposed water profile. Pond/rill levels are static review surfaces, not fluid simulation or a complete world drainage connection.

There are **94 deterministic placement envelopes**, using a saved seed:

| Placement family | Count | Current representation |
| --- | --- | --- |
| Broadleaf canopy / birch | 15 / 9 | Trunks and wire crown envelopes |
| Saplings | 10 | Trunks and small crown envelopes |
| Bramble | 16 | Conservative blocking envelopes |
| Rock | 10 | Plain blocking volumes |
| Bluebell / wild strawberry | 10 / 8 | Small nonblocking clump envelopes |
| Fallen log | 4 | Plain 3 m log hosts with conservative collision |
| Reeds | 12 | Wet-bank placement envelopes |

Trunks, rocks, bramble and deadwood have collision. Full crowns and ground-cover envelopes can be hidden for inspection while the blocking stems/volumes remain visible. Large canopy bases are above 2.6 m; saplings and other low forms stay outside the route envelope. The three OBS markers are walkable positions on the existing loop with proposed fauna focal areas. They are not spawned animals or implemented interactions.

## Existing asset reuse

Only **F02-NATURE-001** was visually opened in this pass. Its source board already supplies the fallen log **A01**, bramble **A09**, bluebell **A10** and wild strawberry **A11** used as named placement references. Logs, stumps, branches, bark, fungi and acorn scatter on the same board can be placed later without generating another sheet.

[The reference audit](biome-reference-audit.json) indexes five saved forest sheets and preserves their schedule hashes and existing review status. Canopy/rock/reed model identity still needs confirmation. References and placement envelopes do not register accepted models or satisfy rig/animation requirements. The reference-image budget is unchanged.

## Validation and next work

Run from the repository root with the existing static server running:

```sh
node docs/asset-image-library/world-production-plan/blockout/build-review.mjs
node docs/asset-image-library/world-production-plan/blockout/build-biome-report.mjs
node docs/asset-image-library/world-production-plan/blockout/test-geography.mjs
node docs/asset-image-library/world-production-plan/blockout/test-biomes.mjs
python docs/asset-image-library/world-production-plan/blockout/test-browser.py
python docs/asset-image-library/world-production-plan/blockout/test-biome-browser.py
```

[Biome geometry checks](biome-verification.json) cover source region membership, continuous blends, distinct relief, tile edges, threshold alignment, seeded placement, clear water/entrance/path envelopes and walkable observation points. [Browser evidence](biome-browser-verification.json) covers all recipe/ground controls, transition inspection, obstacle collision, desktop/phone widths and the complete local loop plus return using the same swept solver as manual movement. The full-loop software-rendering check uses a 1024 × 768 viewport; static layer inspection uses 1440 × 960 and narrow controls use 390 × 844. The inspection run uses the existing 12 m/s running pace; manual walking remains 6 m/s. Movement uses substeps of at most 150 mm, including when slow frames require a longer frame delta; canvas buffers resize only when the viewport changes.

An earlier full-loop software-rendering run at 1440 × 960 exceeded its time limit. Diagnosis showed long rendered frames advancing the simulation through an overly short time cap. Conditional canvas resizing and swept integration of longer frame deltas corrected that behavior; the final complete-loop check passes at its declared 1024 × 768 viewport. This does not establish production GPU performance.

Next: resolve the flagged transition grades and a selected regional crossing, then expand local terrain/habitat placement along the west woodland and lake approaches. Detailed terrain textures, accepted flora models, fauna rigs/behavior, final banks, waves, docks, entrances and sky travel remain later work. These tests do not approve full-world navigation or production GPU performance.
