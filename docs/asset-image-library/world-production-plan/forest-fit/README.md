# FC05 cottage and clearing Function fixture

[Open the separate review](index.html) · [Arrival](review/arrival.png) · [Inside](review/sitting-room.png) · [Clearing](review/clearing.png) · [Geometry checks](geometry-verification.json) · [Browser checks](browser-verification.json) · [Source hashes and decisions](review-data.json) · [Named capture index](review/index.json)

This extends the existing FC05 sample with a usable ground sitting room and simplified natural-object geometry. It preserves FC05 at world **X −4000, Z −550**, its **12 × 9 m reservation**, **8 m roof ridge**, **70 m clearing**, all **94 deterministic natural placements** and the **370.13 m loop**. FD02 remains a separate destination **806.23 m** away. The canonical world layout, 34 anchors, eight cottages and main game are unchanged.

## Reuse and proposed changes

The cottage uses the saved 3 m wall pitch, 300 mm wall thickness, 1.2 × 1.4 m window apertures and six unscaled **6 × 3 m roof repeats**. Two adjacent gables cover the 12 m width. This is a proposed application of the village kit to FC05; the source sheets do not establish an exact FC05 elevation. Thick wall substrates stay inside the reservation; surrounds and timber trim project slightly beyond it. The gable substrate overlaps below the roof underside; the roof valley has a backing host, with final drainage/weathering/framing unresolved. The loft is not playable.

The coarse blockout proposed a **2.6 m high doorway**, while the reused room has a **2.45 m ceiling underside**. This fixture explicitly proposes a **2.4 × 2.25 m arched aperture**, with a fixed fanlight above **2.10 m clear passage** and two 1.2 m door leaves. The canonical proposal is preserved so the discrepancy remains reviewable. Door geometry and collision use the same hinges and poses; a sweep guard refuses to move leaves through the player.

The sitting room reuses six saved cottage designs at their original human dimensions: bench, basket, crate, mat, watering pot and hanging chime. The table and two wall lamps are declared Function fixtures pending final source designs. Furniture contacts the floor/table; both lamp backs meet the inner wall; the chime hangs from the actual **2.45 m** ceiling. No palace bed has been shrunk into the cottage: compact sleeping furniture remains a verified reference gap.

| Saved sheet | Use here | Status |
| --- | --- | --- |
| [B12-STRUCT-001](../../world-location-kits/west-lantern-forest/B12-STRUCT-001/B12-STRUCT-001.png) | Wall/window, gable and roof dimensions | Existing proposed source; arrangement is new |
| [B12-COURT-PROP-001](../../completion-pass/B12-COURT-PROP-001/B12-COURT-PROP-001.png) | Six reused object designs | Procedural fit geometry, no registered final models |
| [F02-FLORA-001](../../world-location-kits/west-lantern-forest/ecology/F02-FLORA-001/F02-FLORA-001.png) | 15 oak-family and nine birch-family silhouettes | Heights/crowns retain existing local placement envelopes; smaller fit variants, not exact source models |
| [F02-NATURE-001](../../world-location-kits/west-lantern-forest/F02-NATURE-001/F02-NATURE-001.png) | Bramble, bluebell, strawberry and fallen-log families | Simplified fit silhouettes; leaf, flower and bark detail pending |
| Existing habitat placements | Saplings, rocks and reeds | Exact design identity remains unresolved; explicitly marked specimens |

Source images were inspected individually. No new illustrated sheet, paid job or registered final model is added. All 94 existing blockers/placements remain in force; the visuals make their presence inspectable. This is neither finished forest dressing nor a validated botanical reconstruction. Wind, animal models/behavior, final bark/leaf materials, LODs and streaming remain to build.

## Inspect and play

Arrival and Clearing orbit around the actual geometry. Inside and Walk use a **1.75 m body / 0.45 m radius / 1.6 m eye**. WASD or arrows move, Shift runs and dragging looks around. Press **E** near the chime to hear it; distance and cooldown apply. Doors can be closed, reopened and inspected. Hiding plants or furniture affects only rendering, never collision. Named vegetation selection shows the exact instance and source identity or unresolved status.

Floor and reflected-ceiling plans are grayscale orthographic projections of the actual meshes, with labels and metadata outside the image. Lower plans hide the suspended chime; ceiling plans hide floor objects and show the actual slab underside and suspension. Every opening, furnishing, light, hinge, plant placement, water feature, bridge and route is indexed in [room-layout.json](room-layout.json).

Two complete collision-driven returns are tested:

| Check | Distance | What it covers |
| --- | ---: | --- |
| Ground room | **38.44 m** | Apron, 150 mm threshold, door, chime position, bench approach, rear room and return |
| Clearing | **468.33 m** | Existing entrance spur, full 370.13 m loop, stream bridge and return to the same apron |

The departure/return port **local (0, 7)** matches the existing west-village connection. This page does not silently extend navigation to FD02 or integrate a new regional road. Water blocks walking except at the existing bridge. Rendered route ground/deck heights are checked against the analytic movement surface within 12 cm; this coarse terrain tolerance is not a claim of final surface fidelity. Bridge rails and detailed bank/approach engineering remain pending.

## Rebuild and test

Serve the repository root with the saved static-server workflow; no npm install or main-game build is required.

```sh
node docs/asset-image-library/world-production-plan/forest-fit/build-review.mjs
node docs/asset-image-library/world-production-plan/forest-fit/test-model.mjs
python docs/asset-image-library/world-production-plan/forest-fit/test-browser.py
node docs/asset-image-library/world-production-plan/forest-fit/index-review.mjs
```

Node tests check canonical hashes, reservation and roof dimensions, 13 mesh apertures, ceiling/furniture contacts, collision, both full returns, route surface agreement, door sweep and chime reach/cooldown. Playwright exercises the loaded page, complete routes, keyboard input, both door states, visibility/collision invariance, specimen selection, source/clay and actual-mesh plan views, and 390 px layout. Browser observations target **100,000 triangles / 100 draws** for this prototype; software WebGL evidence does not establish final device frame rates.

The brief, props, layout, opening schedule, milestone reviews and final report form a custom Function evidence package. Formal Function, Form and Runtime approvals remain pending. Final source fidelity, Blender Booleans/composition, paid generation, runtime export and deployment are separate steps.

Next: furnish and light the accepted **palace bedroom and west balcony** sample, preserving its room, raised ceiling, balcony connection and human-scale furnishing dimensions; then continue the regional production waves.
