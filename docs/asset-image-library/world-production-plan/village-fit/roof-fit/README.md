# Cottage roof construction review

15 October 2026 · [Open the separate fixture](index.html) · [Assembly preview](review/assembly-source-slots.png) · [Roof plan](review/plan.png) · [Underside projection](review/underside.png) · [Manifest](review-data.json)

This extends the B12 fitting work with a **proposed two-house roof variant**. The saved **B12-DETAIL-001-D09** pot now has a shaft, support framing, an actual roof penetration, flashing and a crown seat. The valley has a slope, clear wall notches, a hollow downpipe and an open inspection sump. Source village coordinates, house footprints, windows, doorways, roof proportions, all world anchors and the main game are unchanged. The earlier [village fitting page](../index.html) remains a separate baseline; its isolated D09 is intentionally retained for comparison.

The fixture adds no illustrated asset sheets, paid generation, registered models, exports or final assembly. The reference library count is unchanged. Saved PNGs here are engineering captures. The source pot's cream/rose stone family and **0.35 × 0.35 × 0.60 m** dimensions are retained as a simple fitting specimen; fine carving, weathered materials and final art are pending.

## Interfaces and construction decisions

| Interface | Proposed connection | Evidence |
| --- | --- | --- |
| RF01 — shaft penetration | **0.65 m square** roof opening around a **0.55 m shaft**, giving 50 mm assembly clearance per side | Both adjacent 3 m roof repeats and their seam backer are actually cut |
| D09 seat and bore | Pot bottom **Y 8.10 m**, tip **Y 8.70 m**; continuous **0.21 m square bore** | Nine rays pass from above the pot into the unoccupied loft |
| Shaft bearing | Inclined base meets a framed collar on two upslope rafters; rafters connect to the eave and ridge | Evaluated mesh contacts, isolated shaft and support view |
| Flashing | Sloping apron bridges the clearance, overlaps the roof by 2 mm at its underside, and meets a 0.20 m upstand | Real aperture remains open; apron, shaft and flashing can be isolated |
| Repeat/ridge joins | Thin V-shaped backing straps at 3 m joints and folded ridge covers | No intermediate solid triangular closures; every cut roof repeat is a closed thin shell after welding |
| RF02 — valley | Open channel, **1% fall / 96 mm over 9.6 m** | Actual channel surface samples descend continuously |
| RF03 — wall returns | **0.70 m** front/rear notches through upper wall/gable corners; shared-wall cap at **Y 4.90 m** | Outlet rays pass the variant where the original wall blocked them |
| Downpipe and sump | Real **0.10 m bore**, inlet below the channel lip, visible wall standoffs and an open sump with a bottom | Ground is cut around the sump; no hidden floor covers its cavity |

All heights and coordinates are local to the preserved village origin. The six roof repeats retain **6 m span, 3 m repeat and 2.8 m rise**. Only local upper wall caps, gable corners and roof apertures change in this variant. Ground-floor entrances and their routes remain intact.

The saved source does not specify the hidden shaft or drainage construction. These pieces therefore use `P01` proposal IDs, separate from the registered source fitting ID. The shaft is treated as a **lightweight clad passive loft-air outlet** for this Function prototype. No fireplace, heating or combustion system has been built.

## Inspection and checks

Use **Assembly**, **Chimney**, **Valley outlet** and **Support frame** for fixed views. **Roof plan** and **Roof underside** project the actual meshes. **Cutaway** clips the chimney at its centre. Select a named part and use **Isolate selected part** to inspect its thickness and openings. The support camera frames the whole evaluated support assembly; unrelated weather strips and drain pieces are hidden in that view.

**Trace runoff** follows the roof surface, falls into the valley, passes its front edge, enters the downpipe and ends in the inspection sump. It resets to the assembly view so the complete trace is visible. Changing views or isolating a part cancels a running trace. The terminal marker and text explicitly identify the **unresolved onward site drain**. This animation is a geometric explanation, not a water simulation.

[Geometry verification](geometry-verification.json) covers real bores/cuts, mounting contacts, closed roof shells, wall/scupper clearance, channel fall and **1,799 vertical coverage probes** outside the source pot's open bore. All three original fitting-model returns still pass: **188.05 m**, **35.07 m** and **35.40 m**. Those checks also keep the new drain/sump envelope away from the existing paths. This roof page is an inspection bench, not a new walking game.

[Browser verification](browser-verification.json) records six views, a chimney section, seven isolated parts, trace completion/cancellation, current manifest parity and 390 px layout. The initial assembly measured **3,500 triangles / 76 draw calls** in software WebGL, within the fixture budget of 75,000 / 120. These measurements do not establish production-device performance.

## Remaining work

The onward site drain remains unresolved. The source open pot admits rain, so its rain/condensate arrangement still needs a design. Installation allowances, weather seals, drainage capacity and structural/fire specifications have not been validated. Coverage probes show where geometry exists; they do not prove waterproofing. Formal Function, Form and Runtime approvals remain pending in the parent review package.

Before furnishing, reconcile the parent fixture's ceiling datum: its movement model allows 2.45 m, while its current 0.15 m slab is drawn with its top at 2.45 m and underside at 2.30 m. Preserve the intended **2.45 m clear room height** when building the furnished sample. This roof bench has no ceiling slab and does not change that earlier room.

Next audit the saved shared furnishings against the cottage palette, then make **one usable furnished ground room** with human-scale furniture, lighting, door interaction and a complete return route. Keep these local construction gaps recorded while advancing the playable sample.

## Rebuild

Serve the repository root using the existing static server. No frontend build, new dependencies or paid services are needed.

```sh
node docs/asset-image-library/world-production-plan/village-fit/roof-fit/build-review.mjs
node docs/asset-image-library/world-production-plan/village-fit/roof-fit/test-model.mjs
python docs/asset-image-library/world-production-plan/village-fit/roof-fit/test-browser.py
```

Node, Python Playwright and Chromium are already available in the cloud environment. The saved manifest pins the reference image, canonical layout and all geometry/viewer source hashes. Run the builder before testing after changing any of those source files.
