# First geography blockout

15 October 2026 · **[Open the separate review page](index.html)** · [Overhead screenshot](review/world-overhead.png) · [Terrain screenshot](review/world-terrain.png) · [FC05 sample](review/forest-terrain.png) · [Bedroom sample](review/bedroom-terrain.png)

This is a proposed terrain and route review. It runs independently of the existing game and does not replace the palace architecture, move a saved location, generate art, register models or change the 230-sheet budget. GEN-37 remains the palace-front authority. Neither the main game nor multiplayer loads on this page.

**Regional terrain update:** [Biome and FC05 habitat evidence](BIOMES-AND-TERRAIN.md) adds physical landform proposals, six transition sections, six local ground zones and 94 placement envelopes. The complete forest loop and return are now tested in the browser.

**Access update:** [Separate crossing review](access.html) and [feasibility findings](ACCESS-REVIEW.md) profile all 14 wet candidates and four steep transitions. The west alternative includes a complete browser out-and-return test. Rejected alignments are retained as failures, not promoted to navigation.

**West route update:** [Stair/ramp comparison](west.html) connects FC05’s existing loop to a proposed B12 west gate. [Measurements and limits](WEST-CONNECTION.md) include whole-riser flights, landings, both arrival ports and complete return tests.

## Run and verify

Serve the **repository root**, rather than opening the HTML through `file://`:

```sh
python -m http.server 8765 --bind 0.0.0.0
```

Open `/docs/asset-image-library/world-production-plan/blockout/` on that server. The page uses the repository's vendored Three.js module, local JSON and native browser modules; there is no installation or build step for the preview. The server must be restarted after restoring a cloud environment.

From the repository root, rebuild the route evidence and run the geometry checks:

```sh
node docs/asset-image-library/world-production-plan/blockout/build-review.mjs
node docs/asset-image-library/world-production-plan/blockout/test-geography.mjs
```

With the server running, browser checks use the environment's Python Playwright and Chromium:

```sh
python docs/asset-image-library/world-production-plan/blockout/test-browser.py
```

The script accepts `--url` and `--chromium` for another server or browser executable. Chromium's software WebGL flags make the cloud inspection repeatable; these results are not production GPU measurements. No persistent environment configuration or new runtime dependency is required.

## What is preserved

| Source contract | Result |
| --- | --- |
| World envelope | 12,000 × 12,000 m, X east / Z south / browser Y up |
| B01 palace reservation | Unchanged centre and 2,500 × 2,125 m footprint; not a building mesh |
| Location anchors | All 25 buildings, six special sites and three forest districts retained |
| Forest cottages | All eight original placements and dimensions retained |
| Source routes and coastline | Retained for comparison; proposals live separately |
| Bedroom | 24 × 18 m, 18 m ceiling apex, north bed, south entry, three east windows, west open balcony |

[source.json](source.json) records the relevant canonical layout fields and its SHA-256. Tests compare every copied field to [the original layout](../../world-layout/layout.json), including all route points, footprints and cottage placements. Editing the original layout requires a deliberate snapshot revision, not silent drift.

## Proposed geography and connections

The coarse terrain has an irregular open coast, beach transitions, rolling ground and localized northwest/northeast ridges and southeast high ground. There is no enclosing mountain ring. Seven ground-region colour families blend continuously around existing destination clusters. These are substrate/transition proposals, not recovered biome boundaries; sky destinations remain separate horizontal projections with unresolved altitude.

Sea and lagoon use **0 m**, while the reserved Lantern Lake cove uses **36 m**, all proposed. Irregular lake/lagoon boundaries, channel beds, river beds and bank blends are inspectable. Flat pads cover 24 building reservations and eight cottages. B11's natural rock arch deliberately remains a tidal/coastal exception requiring contact design.

* **WV01:** extends through the lake drainage to the sea, routing around B17 and B12. Its descending freshwater reach is not a navigable sea-level canal.
* **WV02:** routes around B05/B06 and B24 foundations and continues to a sea outlet. Both river profiles descend monotonically.
* **Boat route:** nine proposed tidal channels connect seven offset landing points into six continuous, reversible saltwater legs, totalling approximately **12.47 km**. A* uses a 25 m grid with intermediate edge checks; saved paths are checked every 5 m with an eight-direction 4 m hull margin. This is an out-and-back route, not a newly implemented boat mechanic or a closed circuit. The original BO01 line remains available for comparison.
* **Regional walking:** original kilometres are preserved as optional exploration corridors. Each non-boat corridor now has explicit distance legs of at most 500 m, with selectable proposed stop positions. These do not implement rest stops, fast travel or graded paths. Route profiles expose wet crossings, grades and endpoint gaps rather than implying that concept polylines are playable.

The geometry audit finds **14 walking crossing candidates**. They appear in orange by default and remain unresolved bridge, landing or grading work. Some source routes are named “loops” but have different start/end points; their missing return joins are explicitly reported. Building entrance positions beyond the samples, dock access, sky arrivals and regional transfers remain design work.

## FC05 clearing sample

The cottage remains at **X −4,000 / Z −550 m**, 12 × 9 m, inside its existing 70 m clearing. The closed local loop is **370.13 m**, with maximum vertex radius **67.27 m**; straight segments remain inside the convex clearing circle. An entrance spur joins the cottage doorway to the loop and works in both directions.

A small proposed test pond and rill provide a water crossing test. A 5 × 3 m bridge has separate collision surface and 2 m approaches; the loop, doorway and return have been checked at 0.15 m sampling. The loop's maximum sampled ground/deck grade is checked against 35%, with the runtime step limit checked separately. This does not declare a wheelchair-accessible or fully engineered route.

**FD02 is still 806.23 m away.** The local test pond is explicitly different; the named pond has not been moved into the sample. The cottage shell, ground and bridge are engineering placeholders, with no foliage dressing or completed house kit.

## Bedroom and west balcony sample

The source interior plan uses X east / Y north / Z up. Conversion is **browser X = source X, browser Y = source Z, browser Z = −source Y**. The accepted 24 × 18 m room has a ceiling apex at 18 m, a west opening 8 m clear and 12 m high, and an 8 × 4 m neck to the full circular balcony, diameter 18 m. No rail blocks the room-to-balcony connection.

The canopy bed frame is **2.2 × 2.7 × 2.8 m**. Six plainly marked dimensional furnishing volumes represent two balcony seats, a table, small fountain, reading chaise and console. They use human dimensions, have collision and keep the main passage clear. These are layout volumes, not new design assets. The south entrance is proposed at 2.4 m clear. Wall, bed, furniture, balcony edge and water boundary checks use a 0.45 m player radius and 1.6 m eye height.

The source is [INT-R02's saved schedule](../../completion-pass/INT-R02/schedule.json). Room placement within a palace wing, structural balcony supports, complete window/wall collision geometry and finished furnishings are not resolved here. The current local room test has a level floor; it does not settle the larger palace's vertical circulation.

## Inspect the page

* **World / FC05 clearing / Bedroom + balcony:** switch review areas.
* **Overhead:** pan by dragging, zoom with the wheel; choose a marker or location selector to inspect coordinates and dimensions.
* **Terrain:** orbit by dragging, zoom with the wheel. Site selection focuses the world camera.
* **Routes:** inspect length, raw elevation profile, wet samples, endpoint gaps, return status and proposed local legs. Orange points identify crossing work, rather than built bridges.
* **Layers:** compare water, regional substrate blends, reservations, forests, original corridors and proposed boat legs. World-only layers are disabled in the local samples.
* **Walk sample:** WASD/arrows, Shift to run, drag to look; “Return to entrance” resets the sample. Movement is 6 m/s, running 12 m/s, matching the current game's configured pace. Local samples have basic collision; the whole world does not have navigation or boat controls on this page. Touch walking controls are not supplied.

## Evidence and limits

[Geometry verification](geometry-verification.json) covers unchanged source fields, footprint/pad clearance, continuous proposed boat water, descending river outlets, finite terrain, blended regions, local loop slopes, openings, collisions and return paths. [Browser verification](browser-verification.json) records real Chromium checks at 1440 × 960 and 390 × 844, all three areas, 2D/3D views, selection/layers, keyboard movement and resets, with no page errors or failed requests.

The world display uses a coarse **50 m terrain mesh**, whereas the local forest uses **0.75 m terrain cells** and analytical collision. Narrow channels are checked using the analytical model and appear in overhead/route evidence; some banks need a denser final terrain mesh. River/channel and shoreline design still needs visual review. Heights are proposed, the old larger-lake illustration conflicts with the current cove reservation, and no final ocean waves, detailed buildings, foliage, wildlife, furniture art or gameplay interactions were added.

This is a reviewable **P1 blockout**, with preliminary local movement checks. It does not approve P2 shared kit contracts, P3 finished playable rooms or global route completion.

## Files

* [proposal.json](proposal.json): reversible heights, river/channel paths, landing offsets, samples and open decisions.
* [geography.mjs](geography.mjs): shared analytical ground, water, pads and local collision.
* [build-review.mjs](build-review.mjs): reproducible boat routing, walking profiles, local distance legs and connection reports.
* [review-data.json](review-data.json): generated evidence consumed by the page.
* [viewer.mjs](viewer.mjs), [index.html](index.html), [style.css](style.css): independent browser review.
* [test-geography.mjs](test-geography.mjs), [test-browser.py](test-browser.py): reproducible checks and saved reports/screenshots.
