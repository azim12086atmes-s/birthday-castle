# Storybook Village — arrival lane and structural fit

15 October 2026 · [Open the separate review](index.html) · [Street preview](review/arrival-source-slots.png) · [Actual lower plan](plans/lower-plan.png) · [Roof projection](plans/roof-plan.png) · [Ceiling projection](plans/ceiling-plan.png)

This is the first **B12 Function prototype**: a short arrival lane, eight attached/return house shells, a covered street connection, a small court and two testable ground rooms. It is not a completed village, final art assembly or a change to the main game. No new illustrated asset sheets, paid generation or registered asset models were added.

## Source decisions

The original village crop shows attached plaster/timber houses, repeated high gables, a slate-coloured roof family and a true arch passage. The saved cottage sheets provide more explicit proposed interfaces. They cover a related forest-cottage subtype; they do not prove every village back, street or roof connection. [The source manifest](review-data.json) pins all three saved image hashes.

| Existing reference | Reused construction | Limits retained |
| --- | --- | --- |
| B12 village original | Attached rows, gable rhythm, real street passage, cream/oak/blue-violet vocabulary | Street coordinates and hidden connections are proposed |
| B12-STRUCT-001 S01/S02 | **3 m × 2.6 m × 0.3 m** wall bays; 1.2 × 1.4 m window, 0.8 m sill; **1 × 2.1 m** secondary doorway | Source dimensions are proposed, not recovered measurements; narrow door fit is explicit |
| B12-STRUCT-001 S03 | 6 m upper gable assembly: 2.6 m rectangular storey plus 2.8 m triangular closure, with a central upper window | Rectangular and triangular hosts are separated to avoid duplicate infill |
| B12-STRUCT-001 S04 | **6 m span / 3 m repeat / 2.8 m rise**, backed roof lining with open ends | Small reference end drawings are ambiguous; intermediate solid triangles are rejected |
| B12-DETAIL-001 | Source-compatible fitting sockets, wall/window/roof separation and restrained material slots | Existing decorative art remains unregistered; no carving fidelity claimed |

Side and party walls use the same 3 m repeats as the façades. Shared party walls are authored once. Roof closure pieces appear only at terminal gables, including the combined house/arch roof run. Valley and hidden roof joins are conservative engineering hosts, not new accepted designs. Source-sized pieces are never stretched to fit a street.

The **2.4 m public entry** is an explicitly proposed variant within an unchanged 3 m bay. The source **1 m cottage entry** is also retained and tested separately. It is a close-fit secondary doorway: the 1.75 m prototype body passes, while a 1.9 m body fails its arched headroom test. The primary village gate remains 2.4 m clear, with 3.2 m full-width headroom.

## Placement and arrival

Local coordinates are **X east / Y up / Z south**, with origin at **world X −2470, Y 44.05, Z −650**, matching the west route's proposed gate. Both review models accept the same interface points at the same floor datum. Local X 0–102 lies inside B12's unchanged 340 × 280 m reservation; the four-metre exterior apron overlaps the earlier route intentionally. All 34 anchors, eight cottage placements, palace reservation, canonical routes and water proposals remain untouched.

The lane is 6 m wide and narrows to a 4.8 m clear arch at the covered connection. The arrival loop passes through the gate, lane and covered passage to the court, then returns. Separate checks enter a wide public room and a source-sized cottage room. These are proposed first-site circulation paths, not a recovered full village layout.

| Browser check | Complete distance |
| --- | ---: |
| Gate → lane arch → court → gate | **188.05 m** |
| Public ground room and return | **35.07 m** |
| Source cottage doorway and return | **35.40 m** |

House ground rooms have approximately 2.45 m clear height beneath a 2.6 m storey. Upper storeys are **non-playable shells**; no invisible stairs or access is implied. Furnishings, lane dressing, garden placement and interactions remain to add after host review.

## Inspecting the hosts

**Plan** offers three distinct projections. The lower plan intersects the actual wall triangles at 1.05 m and projects the resulting boundaries; it does not substitute diagram rectangles for the walls. Roof and reflected-ceiling projections use the actual roof and lining/ceiling meshes. Isolated canvas captures omit surrounding UI and labels.

**Arrival view**, **House entry** and **Roof join** show the assembled fixture. **Inspect placed host** highlights an evaluated mesh bound. **Isolated host** shows a wall, roof repeat, gable or valley without adjacent buildings; drag to inspect its depth. Selected examples are saved as [source door](elevations/source-door.png), [window bay](elevations/window-bay.png), [wide entry](elevations/wide-entry.png), [lane arch](elevations/lane-arch.png) and [open roof repeat](elevations/roof-repeat.png).

Monochrome is the engineering default. The material selector previews cream plaster, oak, slate and glass slots. Roof cutaway, palette and plan changes never change collision. WASD/arrows move freely; Shift runs; drag to look. Route checks use the same movement solver as keyboard input. Switching view cancels a running check.

## Evidence

[Geometry verification](geometry-verification.json) independently checks source immutability, the shared west-gate interface, full returns, closed-window/party-wall collision, headroom and module dimensions. Rays pass all **49 actual mesh apertures**, while **121 solid-wall probes** hit substrate. Surrounds meet their declared front/back mounting faces. Roof-only rays reject unwanted end infill.

[Browser verification](browser-verification.json) records all three animated routes, keyboard input, host inspection, projections, material/cutaway invariance and 390 px layout. The observed full street view is about **37,060 triangles / 30 draw calls**, below the prototype's 75,000 / 120 limits. These are software-WebGL inspection counts, not production-device performance or accepted model budgets.

[Opening masks](review/opening-masks.png) and [traced contours](cutters/provenance.json) are reproducible binary evidence. Every mask occupies a **6 × 6 m frame at 40 px/m**; the source window includes its 0.8 m sill. Upper instances translate that template vertically. The frame size is not an aperture size. `openings.json` records each instance's dimensions, wall, destination, facing and mask transform. The exact parametric geometry remains authoritative; raster contours are not approved final Boolean cutters.

`room-brief.json`, `room-layout.json`, `props.json`, `openings.json`, `milestone-reviews.json` and `final-report.json` form the project-local custom Function package. Formal Function, Form and Runtime approvals remain pending; tests do not grant approval. This pass does not submit paid assets, compose a final room, export or deploy anything.

## Rebuild and test

Serve the repository root with the existing static HTTP server; there is no frontend dependency install or application build step.

```sh
node docs/asset-image-library/world-production-plan/village-fit/build-review.mjs
node docs/asset-image-library/world-production-plan/village-fit/test-model.mjs
python docs/asset-image-library/world-production-plan/village-fit/test-browser.py
python docs/asset-image-library/world-production-plan/village-fit/build-masks.py
```

Python Playwright, Chromium and Pillow are used in the cloud environment. Optional mask tracing used the 3D-room skill's `trace_opening_mask.py`; its hash is recorded in `cutters/provenance.json`. OpenCV was installed only in a temporary tooling directory for that diagnostic, not added as an application dependency. Traces have pixel-resolution limits; they do not replace the exact opening parameters.

Next fit the saved B12 door, window, porch and roof-trim fittings to these sockets, with roof-corner/valley checks before decorative assembly. Keep circulation clear and retain the source/library distinction. Final arch engineering, drainage, roof/party-wall weather seals, supports, textures, decoration, populated interiors, interactions and the remaining regional route conflicts are unresolved.
