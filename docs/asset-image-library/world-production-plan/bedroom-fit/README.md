# Princess bedroom and west flower balcony

[Open the separate review](index.html) · [Dressed bed](review/dressed-bed.png) · [Balcony view](review/balcony.png) · [Cutaway](review/cutaway.png) · [Named capture index](review/index.json) · [Geometry checks](geometry-verification.json) · [Browser checks](browser-verification.json)

This is the next **Function prototype** after FC05. It brings the saved bedroom/balcony sample to furnishing, lighting, material-family and local interaction coverage. It does not rebuild the complete palace or modify the main game, world layout, palace reservation, location anchors or cottage placements.

## Dimensions and source corrections

| Contract | Retained value |
| --- | --- |
| Room interior | **24 × 18 m** |
| Structural ceiling apex | **18 m**; decorative ribs lie below the substrate |
| North bed frame | **2.2 × 2.7 m**, **2.8 m** overall; centre X 0, Z −6.5 |
| East windows | Exactly three, preserving Z −5, 0, +5 |
| West open arch | **8 m wide × 12 m high**; no glass, door or railing across it |
| Level threshold neck | **8 m wide × 4 m long**, X −16 to −12, Z −5 to +3 |
| Open circular balcony | **18 m diameter**, centre X −23, Z −1 |
| Perimeter rail | **1.1 m high**, radius **8.8 m**, trimmed at the neck |

The saved INT-R02 schedule corrects three printed/image discrepancies: the neck is **8 × 4 m**, the canopy frame is **2.8 m** high, and the perspective foreground railing must not close the balcony connection. Those saved corrections control this fixture. A smaller older suite doorway is not stretched to make the revised portal.

The room retains the accepted envelope while proposing **400 mm structural walls**, a **12.6 m vault springline**, a **250 mm ceiling shell**, three **3 × 9 m east apertures** and a continuous pointed vault profile. These hidden construction choices are explicit proposals. Walls extend outward from the accepted interior faces. Palace-wing placement, altitude, the full palace shell and supports below the balcony remain unresolved.

## Reused components

| Existing reference | Application |
| --- | --- |
| [INT-R02](../../completion-pass/INT-R02/INT-R02.png) | Room orientation, rose/ivory marble, indigo/gold vault, rose/blue glass, asymmetric furniture zones and flower balcony |
| [INT-SUITE-FURN-001](../../completion-pass/INT-SUITE-FURN-001/INT-SUITE-FURN-001.png) | One four-post frame, two bedside cabinets, northwest wardrobe and dressing table at their saved dimensions |
| [INT-BED-DRESS-001](../../completion-pass/INT-BED-DRESS-001/INT-BED-DRESS-001.png) | Mattress, hollow fitted sheet, blush duvet, two pillows, four gathered curtains, short/long valances, skirts and foot runner |
| [INT-SUITE-SHELL-001](../../completion-pass/INT-SUITE-SHELL-001/INT-SUITE-SHELL-001.png) | A **4.8 × 1.2 × 6 m** bed-head host, using a proposed backed recess with complete returns and cap |
| [INT-BALCONY-JOIN-001](../../completion-pass/INT-BALCONY-JOIN-001/INT-BALCONY-JOIN-001.png) | Four radius-9 m quarter discs, level neck and flower-rail/portal vocabulary |
| [INT-BEDROOM-PROP-001](../../completion-pass/INT-BEDROOM-PROP-001/INT-BEDROOM-PROP-001.png) | Rose casket, separate locket and small perfume bottle |
| GEN-24 / GEN-25 | Existing console, chaise, mirror, side table, chandelier, rug, curtain and birthday-gift families |

There are **45 furnishing/component instances**, plus an indexed group of rail-mounted flower pots. Both bedside cabinets and all textiles remain ordinary human scale. The large room is not filled by enlarging furniture. Flat textile dimensions are preserved in metadata; gathered curtains and draped duvet/runner shapes are proposed poses. Fitted-sheet geometry is a hollow shell, not a second solid mattress. The bedside frame has exactly four posts and the bed has exactly two sleeping pillows.

Legacy GEN-24/25 pieces lack measured dimensions. Their preserved blockout reservations or new fit dimensions are explicitly marked proposals. Procedural silhouettes and colour slots are not accepted fine-carving, embroidery, cloth-simulation or final material models. No new illustrated reference sheet, paid job or registered model is added.

## Physical connections and interaction

The bed niche is an actual backed recess with sides and a top. The primary entry and west portal are actual holes in thick substrates. The east windows have real apertures with blue/rose infill and separate gold tracery. Cornices stop at openings. The single chandelier has a visible chain to the actual vault underside; sconces, mirror, furniture, mattress, sheet, pillows, perfume and casket meet their supports.

The balcony uses four source-size quarter-disc meshes. The nominal rectangular neck overlaps the circle at the join; the walking plane stays level and seam rays check coverage. Final Boolean trimming, underside framing, moisture/drainage and structural acceptance are still required. The curved rail stops at its calculated intersection with both neck edges and continues as straight edge rails to the room. Flower pots sit on bracket plates attached to the rail. There is no rail across the approach. The south entry is an open inspection aperture; final double-door leaves and their mechanisms remain to build.

Use **Walk**, WASD/arrows, Shift and drag to inspect at a **1.75 m body / 0.45 m radius / 1.6 m eye**. Press **E** near the southeast console to open or close the keepsake casket and reveal its separate locket. Distant or rapid repeated use rejects. Furniture, glass, rail, plant and ceiling constraints remain active when their visual layers are hidden. The optional component selector shows each source ID, dimensions and attachment.

| Full return check | Length |
| --- | ---: |
| South entry → bedside approach → keepsake console → entry | **53.12 m** |
| South entry → west neck → balcony seating approach → entry | **76.23 m** |

Both checks use swept collision-driven movement and return to local **(0, 12)**. The balcony perimeter blocks movement beyond the railing and no stair/step is inserted at the west threshold. These are local review routes, not new world-travel connections or completed palace navigation.

## Review evidence

Saved views include the bed, entrance, balcony, cutaway, four **120-degree** room corners, a centre-up ceiling view, two opposed ceiling obliques, opened keepsake, source/clay geometry and a **390 px** layout. Lower and reflected-ceiling plans use the actual meshes, with ceiling/pendant and floor furnishings in separate layers. The ceiling plan looks upward and uses reflected handedness; the balcony remains open to sky. Labels and semantic data are kept in the UI and [room-layout.json](room-layout.json).

```sh
node docs/asset-image-library/world-production-plan/bedroom-fit/build-review.mjs
node docs/asset-image-library/world-production-plan/bedroom-fit/test-model.mjs
python docs/asset-image-library/world-production-plan/bedroom-fit/test-browser.py
node docs/asset-image-library/world-production-plan/bedroom-fit/index-review.mjs
```

Serve the repository root using the existing static review server. No application dependency install or main-game build is required. Node checks source immutability, finite mesh positions/normals, all six aperture substrates, room/bed scale, support contacts, ceiling/chain contact, hollow sheet and casket, balcony seam/edge/rail geometry, interaction reach/cooldown and both complete returns. Playwright exercises the loaded page, free keyboard motion, actual lid transform, visibility invariance, named selection, views, plans, both animated returns and mobile layout. The prototype inspection budget is **160,000 triangles / 160 draws**; software-WebGL counts do not establish production-device frame rates.

The room package was scaffolded with the 3D-room skill's `create_room.py`. Formal Function, Form and Runtime approvals remain pending. No final Blender composition, paid generation, export, deployment or completed-location claim is implied by a passing prototype.

Next: start the **W2 royal-ground route sample**, using the existing **Rose Keep (B04)** and **Crystal Conservatory (B25)** anchors and saved local kits. Resolve their terrain/arrival/return first, then fit architecture, planting and interactions. Remaining regional geography conflicts stay explicit.
