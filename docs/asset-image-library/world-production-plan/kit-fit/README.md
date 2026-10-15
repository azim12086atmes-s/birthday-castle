# Shared circulation fit test

**[Open the separate fixture](index.html)** · [Assembly](review/assembly.png) · [Same-mesh overhead](review/overhead.png) · [Material-slot preview](review/material-slots.png) · [Completed walk and return](review/walk-return.png)

This starts P2 with one reusable dimensional experiment. It tests how two stair instances, a turning landing, a floor bay, an arch opening and protective parapets fit a player. It is separate from the game and [P1 geography review](../blockout/README.md). No castle geometry, source placement, reference illustration, model registry or image allocation changes.

## What works

| Interface | Proposed contract |
| --- | --- |
| Coordinates | Metres; X east, Y up, Z south; module forward is local −Z |
| Stair flight | Ten actual treads; 150 mm risers / 300 mm goings; 1.5 m rise and 3 m run |
| Width | 2.8 m deck gives 2.4 m clear between 120 mm guards |
| Turning landing | 2.8 × 2.8 m; sockets remain open on both connected sides |
| Upper floor | 4 × 4 m at Y 3 m, with a real passage continuing beyond the wall |
| Arch opening | 2.4 m clear width, 3.2 m full-width headroom, 3.8 m apex and 300 mm wall depth |
| Parapet host | 1.1 m nominal guard above stair nosings; continuous collision independent of glass visibility |
| Player | Radius 450 mm, height 1.75 m, eye 1.6 m, maximum single step 200 mm |
| Seam tolerance | 1 mm proposed socket agreement; the intended 150 mm first riser is not a floor seam gap |

Both flights use the same family; the second rotates 90°. The **29.4 m out-and-back route** climbs twenty 150 mm risers, turns, passes through the arch, reaches the upper destination, descends and returns to its starting point. Stair collision follows the actual stepped surfaces rather than an invisible ramp. Swept movement uses substeps of at most 60 mm so a large input frame cannot jump through a guard or solid wall.

The closed wall profile is extruded around a true opening. Browser raycasts check the clear passage, solid side, wall face location and outward winding. This is an engineering substrate, not an accepted decorative arch, Blender Boolean audit or exported model. Simple beams and piers establish fixture supports; they are not a final architectural or structural-engineering design.

## Reuse before generating

The source audit reuses **PAL-STAIR-001**, **PAL-STAIR-VAR-001**, **WLD-PARAPET-JOINS-001** and **WLD-PARAPET-NEW-001**. Only the saved `rising-stair-rail.png` source panel was visually opened for this pass. Its rising rail, posts, infill and landing termination informed the host separation. Detailed star/flower repeats, capitals and gold appliqué remain existing reference work to attach later. The prototype has no claim to reproduce their decorative appearance.

[contract.json](contract.json) names the sources and hashes their schedules. Its dimensions are proposed technical values and do not overwrite any reference's dimensions or approval. Garden edging only 0.45 m high is explicitly **not** treated as protection for a raised drop.

The default is a monochrome assembly. The material toggle demonstrates ivory, rose, gold and blue/rose/green glass slots on the same geometry. These plain materials do not establish marble, UV, carving or stained-glass fidelity. Glass visibility and colour never remove the host's collision. Full parapet repeats stay exactly 1 m; short remainders are explicit end-infill hosts, so later decorative panels are not stretched to fill a join. No new reference images or paid meshes were generated.

## Inspect and test

Serve the repository root, then open `/docs/asset-image-library/world-production-plan/kit-fit/`:

```sh
python -m http.server 8765 --bind 0.0.0.0
```

Assembly mode orbits with dragging and zooms with the wheel. Overhead renders the same meshes through a top-down orthographic camera. The module selector inspects the assembled instance and highlights its bounds. Walk uses WASD/arrows, Shift to run and dragging to look; phone controls supply directional buttons. **Run return test** uses the same movement solver as keyboard input, and Reset returns to the lower apron.

From the repository root:

```sh
node docs/asset-image-library/world-production-plan/kit-fit/test-model.mjs
python docs/asset-image-library/world-production-plan/kit-fit/test-browser.py
```

The browser script requires the running server, Python Playwright, NumPy, Pillow and Chromium already present in this cloud environment. Optional `--url` and `--chromium` arguments support other setups. The page itself needs only the vendored Three.js module and native browser modules; no installation or build step is needed.

[Geometry verification](geometry-verification.json) covers socket agreement, every tread, full ascent/return, guards, headroom, boundary containment, long-frame movement and preserved source contracts. [Browser verification](browser-verification.json) covers the actual opening mesh, render budgets, a nonblank review capture, plan/assembly views, selection, glass toggles, keyboard movement, automatic return and 390 px on-screen controls. Software WebGL results are inspection evidence, not production hardware performance.

## What this does not approve

This fixture does not complete all P2 kit families or P3 playable rooms. Final decorative meshes, final Blender shells/Booleans, export tiers, materials/UVs, accessibility, full-game integration and world crossings remain separate work. A successful walk test does not approve the final visual design, authorize paid generation or deploy anything.

The local [room brief](room-brief.json), [opening schedule](openings.json), [review record](milestone-reviews.json) and [report](final-report.json) retain those distinctions. Human Function, Form and Runtime approvals remain pending; no production gate was crossed.

Next is a matching floor/wall/door/rail assembly for the cottage and bedroom samples. The 150 mm riser can also be tested against FC05's existing small threshold change; this does not move its cottage or named pond. Keep the fourteen P1 regional crossings and sky/dock access unresolved until their own geometry is designed and checked.
