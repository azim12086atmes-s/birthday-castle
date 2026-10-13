> **Paused / unapproved:** The owner reported inaccurate corners and wings, then redirected work to reusable components. This is an archived layout study, not a construction master. GEN-37 remains the front authority.

# Plain, centrally nested palace roof plan

Revision R03 follows the owner's request for simple symbols. Before drawing it, the original roof-garden, terrace and courtyard boards GEN-16, GEN-15 and GEN-14 were inspected individually, together with GEN-03. The [source review](GARDEN-SOURCE-REVIEW.md) records what each contributes and where the previous generic court boxes departed from them.

Circles mark towers, simple outlines mark wings and garden zones, F/P/H symbols mark fountains/water/covered structures, and tread strips mark stairs. The drawing has no rendered tower crowns, marble textures or decorative facade art. It is a new coordinate diagram, not an alteration of the supplied reference.

The owner rejected the earlier plan's rear-biased stacking and requested the whole palace from above, including towers, stairs and wings. This replacement shows **high central wards with terraces stepping down and outward**. It is a roof-layout proposal, not a registered 3D model.

The outer L1 base surrounds L2; L2 surrounds L3; L3 surrounds the central L4 court. Roof heights remain **60, 160, 230 and 300 grid m**. These heights are not reversed. Looking outward from L4, the exposed terrace sequence descends **300 → 230 → 160 → 60**. The central court must not touch the outer rear perimeter or become the last band of a rearward staircase.

## Dimensions and proposed envelope

- Successive west/east main-wall faces: **100 grid m** apart.
- Successive rear main-wall faces: **75 grid m** apart.
- Ground-facing front wall to gate wall: **150 grid m**.
- Stair top to gate wall: **75 grid m**.
- L2→L3 front setback: **60 grid m**.

To make a concrete complete plan, this study uses a **proposed 800 × 680 grid m working envelope**, informed by the earlier illustrative multi-view board's proportions. It is not a measured or owner-confirmed overall footprint. The L3→L4 front setback is provisionally **60 grid m**, keeping the previously unresolved value explicitly proposed.

The main contours are L1: X ±400, Y −150…530; L2: X ±300, Y 0…455; L3: X ±200, Y 60…380; L4: X ±100, Y 120…305. All have softened/chamfered returns. The L4 centre Y=212.5 is near the full-envelope centre Y=190, rather than at the outer north edge. Ward/tower projections can extend beyond these main-face contours; the numeric setbacks are not net walking widths.

## Tower inventory and placement IDs

The [tower placement table](tower-placements.csv) records **33 inventoried tower instances**, including three attached child turrets. IDs **PAL-PLAN-T01…PAL-PLAN-T33** are placement IDs, not 33 new mesh assets. They do not replace the unrelated T-number aliases on earlier crop sheets.

The seven principal lateral anchors are approximately tied to GEN-37: western terminal, western needle, broad western onion pavilion, royal needle group, eastern belvedere, eastern chapel-spire group and eastern terminal. Minor lateral anchors are interpolated in the previous inventory's order and require source comparison. All depth positions are **new proposals** for the centred plan; historical inferred Y values are not promoted to fact. This inventory is not a claim to count every decorative pinnacle visible in the source.

The royal needle group occupies the central roof court. The broad western onion pavilion remains on the western wing. The eastern belvedere stays near the front and the larger eastern spire cluster stays on its lower attached wing; upper wall insets do not drag those towers into the central core. Parent/child turret relationships are recorded separately from independent ward towers.

## Connected wings, circulation and roof courts

The five large south bays G1–G5 stay on one gate wall: four glazed bays beside the central entrance. Paired dry stairs flank the original separate wet cascade, ending 75 grid m before the gate on the L1 arrival terrace. They are not moved to the rear.

The schedule records eleven dry stair routes and a separate wet cascade. The [stair connection table](stair-connections.csv) records both landings for each route. **W0/E0** join ground to L1. **W1/E1/N1** join L1 to L2; **W2/E2/N2** join L2 to L3; **W3/E3/N3** join L3 to L4. Tread strips and arrows point toward the higher landing. New side/rear stairs are proposals; individual treads, switchbacks, door clearances and final collision geometry remain unresolved.

Seven garden zones now distinguish the royal roof court, western rose/lotus court, eastern conservatory garden, northern fountain loggia, lower western Moon Courtyard, circular west approach parterre and rectangular east approach mirror garden. The lotus/star water connection, irregular moon pond and east conservatory come from existing sources. Their fitting coordinates are proposals, not traced footprints. The [garden placement register](garden-placements.csv) labels every F/P/H marker and cites its existing source.

Dashed same-level paths connect stair landings, court access points and the G3 approach. The [path register](path-connections.json) stores a connected path tree on each roof, avoiding the main upper-ward footprints and marked tower/water/building obstacles. This is a schematic circulation check, not a final architectural clearance or stair structure check. Paths may be refined into smoother walks without changing their connectivity. Fixture symbols are enlarged for readability; local garden dimensions on the source boards are not automatically multiplied by the palace massing scale.

The source [GEN-37 front](../images/illustrated-boards/GEN-37.png) remains the visual and tower-identity master. The technical [side/rear sections](../palace-side-rear/PAL-RETURN-SETBACK-001.png) still govern the 100/75 m gaps. Earlier generated appearance views are not registered placement masters. The attached rejected plan remains archived as a failed proposal.

## Catalogue allowance and review

This is one complete sheet. One unused wall-body allowance is transferred to layout/envelope, changing those family caps from 10/6 to 9/7 while keeping the palace total **65** and global total **230**. All 45 original boards remain included.

The final sheet is a **coordinate-authored engineering drawing**, rendered from the [schedule](schedule.json) with the [plain-plan renderer](scripts/render_plain_roof_plan.py). It uses no source-image pixels. The painted attempt was rejected for its oblique camera, changed crowns and duplicated IDs. The earlier ornamental engineering plan and its data remain in [superseded/R02](superseded/R02/PAL-ROOF-PLAN-001.png). R03 replaces the same selected sheet allowance; no new palace allowance is consumed.

The renderer fixes all 33 footprint labels and 11 stair connections to their declared coordinates and checks all 28 roof access terminals. This verifies the drawing against its proposal; it does not make proposed contours, depths or dimensions measured facts. Review remains necessary before a shared Blender layout or mesh generation.
