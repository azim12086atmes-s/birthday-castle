# West village–forest connection

15 October 2026 · [Open the comparison](west.html) · [Overview](review/west-route-overhead.png) · [Stair crossing](review/west-stair-crossing.png) · [Flight detail](review/west-stair-flight.png) · [Proposed gate](review/west-village-gate.png) · [FC05 departure](review/west-FC05-departure.png)

This separate review connects the existing FC05 entrance apron and cottage loop to a proposed west gate at the B12 village reservation. It compares a shorter stair/bridge route with the earlier ramp's useful reach, giving both options the same arrivals. The 12 km world, palace reservation, 34 anchors, eight cottages, water proposals, canonical routes, 94 habitat envelopes and reference art are unchanged. No final asset models or art sheets are generated.

## Route and comparison

The route starts at **FC05 X −4000 / Z −543**, the accepted entrance apron. It follows the existing spur and part of the 370 m loop, leaves through the unobstructed eastern clearing edge, then follows a proposed woodland road to WV01. The stair option crosses the high banks and river on a 70 m deck, then follows a short road to the village boundary. It enters a small arrival apron through a proposed 2.4 m opening at **X −2470 / Z −650**.

| Measure | Stair option | Ramp option |
| --- | ---: | ---: |
| Same-arrival route, one way | 1,680.74 m | 1,968.75 m |
| Out and return | 3,361.47 m | 3,937.49 m |
| Walking time at 6 m/s, one way | 4.67 min | 5.47 min |
| Difference | **288.01 m shorter / 14.6%** | Optional alternative |

The ramp now branches toward the gate before its old dead-end approach, which shortens that option too. The older standalone crossing page remains available as baseline evidence; it has different endpoints and should not be compared directly with these complete routes.

These are optional exploration distances. No fast travel, animal encounter or compulsory long walk has been implemented. The bridge ramp follows the earlier 8% design limit, but the **complete route includes the existing forest terrain and clearing transition**, with sampled grades around 20% in short sections. It is not a continuously accessible ramp route.

## Structural geometry and reuse

- Bridge host: **70 × 3.2 m**, deck Y **73.20 m**, proposed slab 0.4 m.
- West stair: **169 risers**, 95.5 m horizontal run, 16 rest landings.
- East stair: **176 risers**, 100.4 m horizontal run, 17 rest landings.
- Total: **35 flights and 33 landings**. Thirty-three flights use the unscaled K09 ten-riser module; two explicit terminal hosts have nine and six risers.
- Every riser remains **150 mm**, every tread **300 mm**; landings remain **2.8 m** long. Clear width is 2.4 m on stairs and 2.8 m on the bridge/road.
- Gate port: 2.4 m clear width, 3.2 m full-width headroom, 3.8 m apex, 0.3 m wall depth, matching the shared opening contract.

[Module placements](west-route-review.json) record positions, directions, family IDs, riser counts and floor datums. These are physical module hosts, not new reference image requests. Flat road ends and turn landings remove small unintended lips at joins. Terrain immediately under near-ground paving is trimmed in the review display; regional terrain and source geography are not rewritten.

The 345 treads, rail posts and other repeated boxes render through material batches and instancing. Guard lines are batched too. The logical guard envelope stays continuous regardless of the sparse engineering posts shown. This demonstrates reuse without claiming final marble, carvings, materials, supports or production performance.

## What the arrivals mean

**FC05:** existing loop geometry and habitat blocker positions are reused. The exit and the route's return are checked with the same human body radius. The named FD02 pond remains 806 m from the cottage and is not moved into this route.

**B12:** the gate is a **new proposed reservation-boundary port**, not a recovered door position from a sketch. Only a four-metre arrival apron extends inside the village reservation. No house is inferred or displaced. Streets beyond that apron, individual building doors and final gate architecture remain unresolved. Other building/cottage reservations are avoided.

The prototypes remain a separate review page. They do not modify the multiplayer game or supply full-world navigation, streaming, interactions or final bridge support engineering.

## Verification

[Geometry results](west-verification.json) check the unchanged canonical SHA, immutable inputs, module dimensions and sockets, 25 mm stair samples, ground/river clearance, body containment, gate headroom and complete returns for both options. Movement uses free **world X/Z**, swept in substeps no greater than 60 mm, with a 200 mm maximum height step. It is not confined to a chainage coordinate and cannot skip a failed joint. Both routes are traversed through the actual surface/collision functions.

The minimum independently sampled stair/bridge clearance above water to the soffit is approximately **4.83 m**. Actual risers stay at 150 mm. Guards block lateral escape, the human body passes the gate, and post-overlap / oversized-headroom probes fail as expected.

[Browser results](west-browser-verification.json) exercise both selectors, real keyboard motion, overhead/terrain views, a flight close-up and the two arrivals. The animated checks walk the complete stair crossing and return, then **FC05 apron → loop → regional road → proposed gate → FC05**, about 3.36 km at the declared 12 m/s running pace. The start reset happens before the check; no position jumps are used at joints. Switching view cancels a running check. Desktop and 390 px layout checks use software WebGL, not a production GPU benchmark.

Run from the repository root with the existing static server:

```sh
node docs/asset-image-library/world-production-plan/blockout/build-west.mjs
node docs/asset-image-library/world-production-plan/blockout/test-west.mjs
python docs/asset-image-library/world-production-plan/blockout/test-west-browser.py
```

The full browser walk takes several minutes. Run one software-rendered browser at a time.

## Next work

The west terrain and route now have a concrete local connection to review. Next, define the village's internal arrival lane and the first reusable village/cottage wall, opening and roof hosts using its saved references. Keep final dressing and flora meshes separate from the tested route envelope. The remaining high-lift / footprint-conflicting regional alternatives still need revised terrain or alignments before copying these hosts elsewhere. Supports, bank retention, drop protection details, final gate placement, shared terrain grading and material/LOD budgets remain proposed.
