# Rose Keep entrance — local fit review

[Open the separate review page](index.html) · [First model batch](../rose-keep/README.md) · [Geometry checks](geometry-verification.json) · [Browser checks](browser-verification.json) · [Source hashes](review-data.json)

One **S04 stair/landing**, one **S03 terrace** and one **S02 entrance/return wall** now join a supported court stub in a separate interactive Function specimen. It uses the proposed dimensions from the labelled Rose Keep handoff. The page provides assembly, overhead and human-eye views, selectable parts, palette/layer controls, two complete returns and mobile movement buttons.

This is simple construction geometry. It does not replace the illustrated keep, accept detailed carvings, build the whole landmark, or place it into the main game.

## Dimensions and resolved joins

| Part | Tested geometry |
| --- | --- |
| S04 flight | Ten 0.15 m risers, 0.30 m tread going, 3 m run, 2.8 m overall width / 2.4 m clear |
| S04 landing | 2.8 m square at Y = 1.5 m; straight exit active, unused side exit guarded |
| S03 terrace | 8 × 6 × 1.5 m; top at Y = 1.5 m, underside at Y = 0 |
| S02 front wall | 8 m wide, 6 m high, 0.6 m thick; top at Y = 7.5 m |
| True doorway | 2.4 m clear, 3.2 m spring / 3.8 m apex above its floor; an actual void through wall thickness |
| Right return | 4 m depth, with a separate named footing under the 0.5 m portion extending past the terrace |
| Guards | 1.1 m above the nosing reference; one-metre host repeats and explicit short infill |

The court, approach and return footing are named test substrates. Their supports reach the local ground datum; drainage and load-bearing engineering remain unresolved. The additional footing solves the visible local contact gap without silently widening a source module or changing the canonical world reservation.

The D07 arch band uses the same opening profile as the wall. There are separate court and arrival instances; neither supplies a wall cutout by decoration alone. D05 guards are plain host specimens. Detailed rose carvings and final material fidelity remain pending.

## Validation evidence

- **36.20 m** approach/gate/court/return and **40.75 m** terrace visit/gate/court/return pass the same swept controller used by keyboard and mobile controls.
- Both browser runs climb to **1.5 m** and return to the apron with zero reported position error. No page errors were reported.
- **773 floor ray probes** check that drawn substrates meet the movement surfaces. At exact risers, probes move ten micrometres into the upper tread to avoid Float32/Float64 side ambiguity; adjacent actual tread bounds separately match within one micrometre.
- Ray checks find empty space through the portal and solid material beside/above it. Oversize bodies, large-delta wall/edge movement and the inactive side outlet remain blocked.
- Hiding guard art leaves the independent containment checks active. Mobile controls, no horizontal overflow, part selection and the fixed production camera were checked in Chromium with software WebGL.
- Complete generated geometry: **2,316 triangles / 68 mesh objects**, below this fixture's 20,000-triangle / 100-draw starting allowance. This is not a device-FPS benchmark or a final art budget.

The source illustration is not used as a measured heightfield. Original layout hash and all B04/B25 world anchors remain unchanged. No new illustrated reference sheets or accepted model records were added by this fit test.

## Captures

Open one at a time: [clay assembly](review/assembly-clay.png) · [palette assembly](review/assembly-palette.png) · [actual overhead](review/overhead.png) · [portal close view](review/entrance.png) · [returned apron](review/returned-apron.png) · [mobile](review/mobile.png). [Capture index and hashes](review/index.json).

Overhead uses these same assembled meshes and shows the full lintel. It is not a surveyed keep plan or an approved horizontal section. The [binary entrance mask](masks/entrance.png) and [labelled contact sheet](masks/opening-contact.png) come from the same arch-profile samples as the wall; they are technical evidence, not additional concept-art slots.

## Scope and next work

The first-batch handoff's separate turret, window and roof specimen is still pending. This fixture validates only the entrance chain. The guard corner art, cliff substrate, weathering, flora, interactions, structural loads and detailed reference fidelity still need work. Open-air scope has no ceiling or invented indoor rooms.

Next resolve the actual B04/B25 approach and return at their existing **78 m / 60 m** pads. A successful local climb does not establish the regional grade, R02 route, crossing or whole-keep entrance placement. Keep the 12 km world, 2.5 km palace reservation and existing location/cottage anchors intact.

Function, Form and Runtime approval records remain pending. Machine passes are evidence for review, not approval. This task publishes source and review artifacts only; it performs no paid mesh generation, final model export or game deployment.

## Reproduce

From the repository root, with the saved static server on port 8765:

```sh
node docs/asset-image-library/world-production-plan/rose-keep-fit/build-review.mjs
node docs/asset-image-library/world-production-plan/rose-keep-fit/test-model.mjs
python docs/asset-image-library/world-production-plan/rose-keep-fit/build-mask.py
python docs/asset-image-library/world-production-plan/rose-keep-fit/test-browser.py
node docs/asset-image-library/world-production-plan/rose-keep-fit/index-review.mjs
```

The mask builder needs Pillow; browser checks need Python Playwright and `/usr/bin/chromium`. The static server must serve the repository root so the vendored Three module resolves. Tests make no remote service calls.
