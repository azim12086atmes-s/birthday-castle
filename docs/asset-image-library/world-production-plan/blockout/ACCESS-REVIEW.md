# Regional access feasibility and west crossing pilot

15 October 2026 · [Open the separate access review](access.html) · [World overview](review/access-world.png) · [West plan](review/access-west-plan.png) · [Crossing close-up](review/access-west-close-up.png) · [Browser return](review/access-west-return.png)

The saved 12 km layout, 2.5 km palace reservation, 34 anchors, eight cottages, source routes, water proposals and reference art are unchanged. This page adds **proposed connector geometry**, not finished architecture or an integrated world navigation mesh. No asset images, models or paid generations were created.

## What the audit found

All **14 wet crossing candidates and four flagged transition sections** now have selectable floor/ground profiles, dry-end evidence, footprint conflicts and measured headroom. A low longitudinal grade alone does not make a route suitable: several source-aligned approaches enter reserved buildings, require excessive elevated structures or cannot find dry endpoints within the 2 km search limit. Those alternatives remain red and explicitly rejected or alternative-needed.

The raised river banks and high terrain around the east/canyon routes produce particularly large elevation differences. These are evidence for revising local hydrology/terrain or routing, rather than instructions to construct 60–130 m high footbridges. A **25 m ground-to-floor rise** is an authored review trigger, not a universal engineering limit. Long lake/lagoon crossings also need a choice between an appropriate viaduct, shoreline detour or actual boat transfer.

The main geography page retains all original transition bands and orange crossing markers. No baseline failure has been erased by the access overlay.

## West pilot and TR02 alternative

**FT02-C1** keeps the river crossing near the saved point X −2800 / Z −650. Its proposed east approach bends south of the village reservation instead of running through B12. Dry tie-ins sit outside every building/cottage footprint. Small reported landing adjustments are proposed grading, not existing built landings or inferred doors.

**TR02** adds a separate woodland connector into that revised crossing. It replaces the access interpretation of the original steep section, while retaining that original biome transition band in the geography viewer. The two profiles share an alignment through the crossing; their precise merging junction, final landing grading and connection to the village entrance still need construction.

The west ramp option is about **1,008 m one way**, including approaches. Its full browser out-and-return is about **2,017 m**. At 6 m/s the one-way traverse takes roughly 2.8 minutes. This is a viable review option for a scenic route, not a decision to force a long ramp on the player. Next compare a shorter stair connection using the existing riser/landing contract, while retaining the ramp as an optional route if useful.

## Proposed technical contract

- 3.2 m total deck width, 2.8 m clear walking envelope, 1.1 m guard envelope.
- Maximum longitudinal grade 8%; 0.4 m proposed slab in raised portions.
- Minimum provisional water-to-soffit clearance 4.5 m. The builder adds a 0.25 m station-sampling margin; final boat height and support openings remain unknown.
- A 0.45 m body radius and 1.6 m eye height, with movement swept in substeps no greater than 0.1 m and a 0.2 m height-step bound.
- The confined walker cannot leave the clear strip or its ends. This containment is a collision envelope, not certification of the displayed sparse guard posts.

Profiles sample at no more than 2 m intervals and five points across the deck. The western pilot is independently checked at 0.5 m intervals, including the interpolated centre and both edges. This caught a roughly 4 cm clearance shortfall in an earlier prototype; the added margin corrects it. The reports do not certify every possible point between stations on every rejected alignment.

## Verification and controls

[Geometry results](access-verification.json) and [browser results](access-browser-verification.json) record source preservation, candidate coverage, grade/headroom samples, west footprint clearance, movement containment and complete return distance. Browser checks select all 18 entries, inspect a rejected alternative, render overhead/terrain/close-up views, move with real keyboard input, and traverse the whole west connector out and back on animation frames. Desktop and 390 px layout checks use Chromium with software WebGL. This is not production performance evidence.

Choose an entry to inspect it. **Overhead** shows the saved route and proposed connector; **Whole-world overview** compares all alternatives. **Terrain** fits the connector, while **Crossing close-up** focuses its wet portion. Drag to orbit and scroll to zoom. **Walk connector** uses W/S or up/down along the route, A/D or left/right across it; Shift runs. **Walk out and return** uses the same swept solver. Reset, changing entries or switching views cancels a running check.

Serve the repository root with the existing static HTTP server. Rebuild and verify:

```sh
node docs/asset-image-library/world-production-plan/blockout/build-access.mjs
node docs/asset-image-library/world-production-plan/blockout/test-access.mjs
python docs/asset-image-library/world-production-plan/blockout/test-access-browser.py
```

The browser test checks the loaded report against the saved report and records its SHA-256. A full return takes several minutes at the declared 12 m/s running pace. Only one software-rendered browser should run at a time.

## Remaining work in sequence

1. Compare the west ramp with a shorter stair route; build the selected bank landings and the TR02 junction, then connect actual village/forest entrances and test the complete return.
2. Revise TR04, TR05 and TR06 around protected footprints and more suitable contours. Resolve the high river-bank transitions before selecting east/canyon bridges.
3. Choose shore detours, viaducts or boat transfers for the long lake/lagoon gaps. Design supports outside defined navigation openings after boat dimensions are established.
4. Verify complete inter-connector routes, source-route return joins and entrances. Then extend terrain and habitat placement using existing reference kits.

The bedroom, FC05 habitat sample and root game are not rebuilt here. Supports, load/span engineering, final bridge architecture, accessible rest landings, local earthworks, between-station extrema on rejected routes, wildlife and final foliage remain pending.

## Candidate measurements

The generated table below is a feasibility audit. “Fits limits” means only the declared sampled geometry constraints; it is not final structural or artistic approval.

<!-- ACCESS-TABLE -->

| ID | Length with approaches | Maximum lift | Reserved footprints | Outcome |
| --- | ---: | ---: | --- | --- |
| R01-C1 | 2080 m | 73.9 m | B01 | Rejected alignment: footprint conflict |
| R02-C1 | 514 m | 12.9 m | B12 | Rejected alignment: footprint conflict |
| R02-C2 | 1416 m | 31.9 m | B09 | Rejected alignment: footprint conflict |
| R02-C3 | 840 m | 33.2 m | B09, B18 | Rejected alignment: footprint conflict |
| R03-C1 | 1636 m | 29.0 m | B05, B06 | Rejected alignment: footprint conflict |
| R03-C2 | 2594 m | 126.9 m | B10, B15 | Rejected alignment: footprint conflict |
| R03-C3 | 1714 m | 118.6 m | B10, B11 | Rejected alignment: footprint conflict |
| R03-C4 | 592 m | 61.8 m | B24 | Rejected alignment: footprint conflict |
| R03-C5 | 868 m | 66.8 m | B03 | Rejected alignment: footprint conflict |
| R04-C1 | 512 m | 13.2 m | B12 | Rejected alignment: footprint conflict |
| R04-C2 | 844 m | 11.5 m | None | Profile fits proposed limits; structural and entrance design pending |
| R04-C3 | 4124 m | 50.7 m | B02, B18 | Rejected alignment: footprint conflict |
| FT02-C1 | 1008 m | 20.6 m | None | Profile fits proposed limits; structural and entrance design pending |
| FT03-C1 | 194 m | 61.6 m | None | Alternative needed: excessive deck elevation |
| TR02 | 1483 m | 20.6 m | None | Profile fits proposed limits; structural and entrance design pending |
| TR04 | 4604 m | 131.0 m | B15 | Rejected alignment: footprint conflict |
| TR05 | 903 m | 12.6 m | B21 | Rejected alignment: footprint conflict |
| TR06 | 4961 m | 58.6 m | B01, B05 | Rejected alignment: footprint conflict |
