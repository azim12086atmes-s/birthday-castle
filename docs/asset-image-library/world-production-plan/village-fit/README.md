# Storybook Village — arrival lane and structural fit

**Roof construction follow-up:** [Chimney, roof and valley variant](roof-fit/index.html) · [Decisions and evidence](roof-fit/README.md). The original fitting baseline below remains unchanged; D09 is mounted in the separate variant.

15 October 2026 · [Open the separate review](index.html) · [Street preview](review/arrival-source-slots.png) · [Actual lower plan](plans/lower-plan.png) · [Roof projection](plans/roof-plan.png) · [Ceiling projection](plans/ceiling-plan.png)

This is the first **B12 Function prototype**: a short arrival lane, eight attached/return house shells, a covered street connection, a small court and two testable ground rooms. The saved detail sheet now has **32 fitting specimens covering 11 of its 12 types**, plus an isolated chimney-pot specimen. It is not a completed village, final art assembly or a change to the main game. No new illustrated asset sheets, paid generation or registered asset models were added.

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

Ground rooms now have 2.45 m clear height beneath a 2.6 m storey. The 0.15 m slab spans Y 2.45–2.60; an upward ray against the rendered ceiling independently checks the datum. Floor and ceiling IDs are distinct. Upper storeys are **non-playable shells**; no invisible stairs or access is implied. One cottage sitting room now has furniture, lighting and a chime interaction; [room decisions and evidence](ROOM.md). Wider lane/garden dressing and final art remain pending.

## Inspecting the hosts

**Plan** offers three distinct projections. The lower plan intersects the actual wall triangles at 1.05 m and projects the resulting boundaries; it does not substitute diagram rectangles for the walls. Roof and reflected-ceiling projections use the actual roof and lining/ceiling meshes. Isolated canvas captures omit surrounding UI and labels.

**Arrival view**, **House entry** and **Roof join** show the assembled fixture. **Inspect placed host** highlights an evaluated mesh bound. **Isolated host** shows a wall, roof repeat, gable or valley without adjacent buildings; drag to inspect its depth. Selected examples are saved as [source door](elevations/source-door.png), [window bay](elevations/window-bay.png), [wide entry](elevations/wide-entry.png), [lane arch](elevations/lane-arch.png) and [open roof repeat](elevations/roof-repeat.png).

Monochrome is the engineering default. The material selector previews cream plaster, oak, slate and glass slots. Roof cutaway, palette and plan changes never change collision. WASD/arrows move freely; Shift runs; drag to look. Route checks use the same movement solver as keyboard input. Switching view cancels a running check.

## Saved fittings and interactions

[Fitting preview](review/fittings-source-slots.png) · [Named fit manifest](fitting-review.json) · [Geometry checks](details-verification.json) · [Browser checks](details-browser-verification.json)

Only **B12-DETAIL-001** was opened for this pass. The source image and component registry remain unchanged. The added geometry represents measurable fitting envelopes, cavities and pivots; its simple marks do not reproduce the source's leaf carving or final materials. The existing 126-sheet illustrated library count is unchanged. Review screenshots are engineering evidence, not extra asset-design sheets.

| Saved type | Fit demonstrated | Construction decision or gap |
| --- | --- | --- |
| D01 beam bracket | Two backs on the cottage wall, seats at Y 2.4 m | Proposed porch bearing rails rest above the seats |
| D02 bargeboard | Both front gable slopes | Each slope is 4.104 m: two 1.8 m stock pieces plus a **0.504 m** proposed short terminal; no stretching |
| D03 window insert | Ground/upper north cottage, two rear windows and opposite-facing south window | Complete 1.2 × 1.4 m insert fits inside the 0.3 m reveal; replaces duplicate preview glass at these five openings |
| D04 shutters | Five separately hinged pairs | Split one continuous round arch into half-leaves; 170° open pose. Independent full-round leaves shown in the reference would not close together |
| D05 oak door | Source 1 × 2.1 m cottage opening | Open 110° inward, close to block passage; swing guard protects the player. Wide public entry remains separate |
| D06 window box | Five empty troughs | Actual cavity, separated drain slats and rear supports. Existing plants can be added later |
| D07 tile strip | One patch on each roof slope | Normal aligns with the slope, underside meets the backing; no second decorative tile layer |
| D08 finial | One ridge socket at Y 8 m | Cottage-sized crest retained |
| D09 chimney pot | **Isolated only** | Through-bore present; mounting withheld until shaft, roof/flue opening and flashing exist |
| D10 foundation corner | Front/rear west exterior corners | L sections meet the exterior faces and floor; final straight plinth runs remain pending |
| D11 porch post | Two 2.4 m posts with foot/capital/brace | Proposed beam and canopy sit on their bearings; not final structural engineering |
| D12 crown sign | Wall plate, projecting arm, ring and disc | 0.65 m source side-profile width projects outward; plate/fixture thickness follows the wall. Lowest point is 2.1 m above the lane |

Use **Cottage fittings**, the named fitting selector and **Isolate fitting** to inspect each specimen. **Close/Open cottage door** and the shutter toggle change geometry and the movement state. Hiding fittings never removes their colliders. Fittings also appear in the actual lower/roof projections. Door hardware projects beyond the nominal 0.1 m leaf thickness; shutter dimensions describe the closed pair, not its larger open footprint.

The three complete return checks remain **188.05 m**, **35.07 m** and **35.40 m**. A closed cottage door rejects its branch route; reopening it restores passage. Window glazing, planter boxes, porch posts, low canopy headroom and L-shaped corner blocks retain collision. Formal approvals remain pending.

Nominal door/window dimensions have **zero installation allowance**: rebates, hinge barrels, seals and fabrication tolerances still need construction review. The existing valley hosts are proposed drainage geometry; this pass does not resolve watertight valley/ridge intersections or rain performance. The separate roof variant covers the proposed chimney/flue and roof/weather joins; one usable ground sitting-room Function prototype is now tested. Final weather engineering and decorative model production remain pending.

## Host evidence

[Geometry verification](geometry-verification.json) independently checks source immutability, the shared west-gate interface, full returns, closed-window/party-wall collision, headroom and module dimensions. Rays pass all **49 actual mesh apertures**, while **121 solid-wall probes** hit substrate. Surrounds meet their declared front/back mounting faces. Roof-only rays reject unwanted end infill.

[Browser verification](browser-verification.json) records all three animated routes, keyboard input, host inspection, projections, material/cutaway invariance and 390 px layout. The prototype limits are **75,000 triangles / 120 draw calls**; the host and fitting browser reports record the observed counts for their actual views. These are software-WebGL inspection counts, not production-device performance or accepted model budgets.

[Opening masks](review/opening-masks.png) and [traced contours](cutters/provenance.json) are reproducible binary evidence. Every mask occupies a **6 × 6 m frame at 40 px/m**; the source window includes its 0.8 m sill. Upper instances translate that template vertically. The frame size is not an aperture size. `openings.json` records each instance's dimensions, wall, destination, facing and mask transform. The exact parametric geometry remains authoritative; raster contours are not approved final Boolean cutters.

`room-brief.json`, `room-layout.json`, `props.json`, `openings.json`, `milestone-reviews.json` and `final-report.json` form the project-local custom Function package. Formal Function, Form and Runtime approvals remain pending; tests do not grant approval. This pass does not submit paid assets, compose a final room, export or deploy anything.

## Rebuild and test

Serve the repository root with the existing static HTTP server; there is no frontend dependency install or application build step.

```sh
node docs/asset-image-library/world-production-plan/village-fit/build-review.mjs
node docs/asset-image-library/world-production-plan/village-fit/test-model.mjs
python docs/asset-image-library/world-production-plan/village-fit/test-browser.py
python docs/asset-image-library/world-production-plan/village-fit/build-masks.py
node docs/asset-image-library/world-production-plan/village-fit/test-details.mjs
python docs/asset-image-library/world-production-plan/village-fit/test-details-browser.py
node docs/asset-image-library/world-production-plan/village-fit/test-room.mjs
```

Python Playwright, Chromium and Pillow are used in the cloud environment. Optional mask tracing used the 3D-room skill's `trace_opening_mask.py`; its hash is recorded in `cutters/provenance.json`. OpenCV was installed only in a temporary tooling directory for that diagnostic, not added as an application dependency. Traces have pixel-resolution limits; they do not replace the exact opening parameters.

Keep circulation clear and retain the source/library distinction. Final arch engineering, drainage, roof/party-wall weather seals, final supports, carving/textures, populated interiors, production interactions and the remaining regional route conflicts are unresolved. The door/shutter controls are local prototype interactions, not integrated game behavior.
