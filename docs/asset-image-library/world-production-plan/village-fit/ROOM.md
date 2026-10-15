# Furnished cottage sitting-room prototype

15 October 2026 · [Open the review](index.html) and choose **Furnished room** · [Room preview](review/room-source-slots.png) · [Manifest](room-review.json) · [Geometry checks](room-verification.json) · [Browser checks](details-browser-verification.json)

One **B12 village ground room** now has a small human-scale sitting/arrival arrangement, wall lighting and an interactive wind chime. It retains the existing 6 × 9 m house footprint, source door/window positions and west village connection. It is distinct from FC05's 12 × 9 m forest cottage and the palace bedroom. This is a Function prototype with procedural fitting specimens; source carving, woven detail, final glass/materials and registered asset models remain pending.

## What is fitted

| Saved cottage design | Use | Nominal size, metres |
| --- | --- | --- |
| B12-COURT-PROP-001-D05 | West-wall bench facing the table | 1.4 × 0.55 × 0.85 |
| D09 | Open storage crate near the rear corner | 0.5 × 0.4 × 0.35 |
| D03 | Open wicker-basket specimen near the front window | 0.45 × 0.35 × 0.30 |
| D12 | Flat, walkable entrance mat | 0.8 × 0.5 × 0.02 |
| D07 | Watering pot supported by the table | 0.4 × 0.2 × 0.30 reserved envelope |
| D06 | Wind chime with visible ceiling hanger | 0.15 × 0.15 × 0.45 body, plus 0.10 m suspension |

The **1 × 0.65 × 0.72 m timber table** and two small wall lamps are named `P01` Function proposals because a matching cottage indoor-table/lamp design is absent. They are not accepted new reference assets. No new illustration or paid model job was generated. The saved 2.8 m palace canopy bed exceeds this cottage's clear height and is excluded; compact cottage sleeping furniture remains a separate design gap.

The saved D03 window inserts, D04 shutter pairs and D06 exterior planters from **B12-DETAIL-001** also fit the two rear windows visible from inside. The wider village fixture now has **32 fitting instances across five sample windows**, retaining the earlier source family and doorway. The base fixture still leaves its chimney isolated; [the separate roof variant](roof-fit/README.md) mounts it.

## Ceiling, contacts and circulation

The 0.15 m ceiling slab now spans **Y 2.45–2.60**, with **2.45 m actual clearance**. The earlier drawing placed its underside at 2.30 m while collision allowed 2.45 m. Both now agree, and an upward ray against the rendered slab verifies the result. House data no longer overwrites the distinct floor and ceiling IDs.

Bench, table, crate, basket and mat contact the floor. The watering pot rests on the table, both lamp backs meet the opposed wall faces, and the chime's short hanger reaches the slab underside with a small controlled inset. Its lowest point is 1.90 m above the floor, clear of the 1.75 m player. Lamps use one shared fixture/light manifest, modest emitter intensity and filmic tone mapping to preserve wall detail.

The **48.13 m furnished-room return** visits the chime approach, clear space in front of the bench and the rear room, then exits through the source doorway. The original **188.05 m**, **35.07 m** and **35.40 m** routes remain usable. Furniture and glazing continue to block movement when visually hidden. Long inputs are swept in small steps to prevent tunnelling through a table or bench. The mat raises the local floor/camera by 20 mm and reduces the available headroom accordingly.

## Interaction and evidence

Choose **Furnished room**, drag to look and use WASD/arrows to walk. Press **E** or the chime button within 1.8 m. A clear in-range position rings three soft user-triggered Web Audio tones; distant use is rejected and the chime has an 800 ms cooldown. No audio/network file is downloaded. Device speaker output is outside the automated check; proximity, keyboard input, state and sound scheduling are tested.

[Geometry evidence](room-verification.json) covers actual support bounds, cavities, unblocked window apertures, slab data, all four movement returns, furniture collision and chime reach/cooldown. [Browser evidence](details-browser-verification.json) independently measures the rendered ceiling, exercises E-key and out-of-range interactions, changes visible layers and completes all four animated returns. Source/model hashes pin the reviewed implementation. Current performance observations are saved in that report; this is software WebGL inspection, not production-device certification.

The underlying main game, canonical world layout, palace footprint and all location anchors remain unchanged. Formal Function/Form/Runtime approvals are pending. Final furnishing designs, source artwork fidelity, cottage sleeping furniture, fuller dressing and integration remain work to do.

Next apply these tested contracts to **FC05's forest cottage and clearing**, add a small source-led vegetation starter set, and test its local exploration/return. Then bring the palace bedroom/balcony to equivalent furnishing and interaction coverage.

## Rebuild

```sh
node docs/asset-image-library/world-production-plan/village-fit/build-review.mjs
node docs/asset-image-library/world-production-plan/village-fit/test-model.mjs
node docs/asset-image-library/world-production-plan/village-fit/test-details.mjs
node docs/asset-image-library/world-production-plan/village-fit/test-room.mjs
python docs/asset-image-library/world-production-plan/village-fit/test-details-browser.py
node docs/asset-image-library/world-production-plan/build-progress.mjs
```

Serve the repository root. Keep HTTP output redirected to a log so terminal/session disconnections do not break the preview server. Run software-rendered browser tests sequentially. The saved cloud startup draft records the tested server and validation workflow.
