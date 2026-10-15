# Rail, glass and forest coverage — 15 October 2026

Three named sheets were added in this pass. The new rail sheet uses one previously unallocated shared-outdoor slot; both forest sheets already had reservations. The 230-sheet ceiling is unchanged: 126 selected sheets are saved, 212 selected/reserved, 86 queued and 18 unallocated. This pass makes references and a build sequence, not playable meshes or a terrain implementation.

## New rail and glass options

WLD-GLAZED-RAIL-002 contains four distinct straight module designs: lily-stem, diamond-bevel, fan-shell and ripple-ribbon. Proposed module bounds are 2.4 × 0.18 × 1.1 m. They retain ivory/rose marble and fine gilt profiles. Existing star, flower, vase/gallery, petal-lace, crescent, cherry-ribbon and garden-petal families remain available; they have not been replaced.

Twelve material IDs cover emerald, mint, aqua, teal, amber, champagne, opal, rose, peach, amethyst, lavender and sapphire. See [palette definitions](WLD-GLAZED-RAIL-002/glass-material-palette.json). These are proposed material colours, not twelve new meshes, gem assets or finished shader textures. Use the same panel geometry with separate frame/glass material slots. Existing window glass can use these tints while preserving its own tracery and shape.

Suggested controlled combinations: green/mint for garden/conservatory variants; rose/champagne/opal for private palace areas; aqua/teal for water-facing variants; amethyst/lavender/sapphire for chapel/gallery variants. These are proposals, not a replacement for a location's source colours. Forest cottage fittings stay timber, cream paint, slate-blue and restrained brass. Do not put marble palace parapets on every woodland path.

Existing return/corner/stair pieces supply construction ideas, but the new end profiles are not proven to fit them. Match post seats, handrail/sill height and glass grooves in the model. Build simple separate collision barriers. Choose and test an appropriate glass shader in the actual browser; swatch images do not implement transmission, reflection, sorting or performance.

## Forest coverage: keep three identities

| Location | Character and planting | Useful decor and landmarks |
| --- | --- | --- |
| F01 North Star Woodland | Mixed canopy, ferns, stream, meadow/blossom gaps | Quiet cottage clearings, log rests, small trail markers, a brook crossing and a distinct discovery landmark |
| F02 West Lantern Forest | Oak/beech/birch/hazel, moss, pond edge, coastal orchard/meadow pockets | Timber cottages, restrained lantern stops, bench, well, baskets, firewood, window boxes and a pond rest nook |
| F03 Northeast Mistwood | Birch/conifer clusters, misty glades, water and local ridges | Sparse cottage fittings, grey stone/wood trail edges, shoreline seats and a recognisable glade; no enclosing mountain ring |

F02 flora and mammal/bird/insect sheets and T05 conifers are already saved. Species and small-object references can be shared where habitat fits; an illustration is not an approved rig, living anatomy or density/performance plan. Reuse logs, roots, fungi, low plants, rocks and lanterns already indexed. Eight cottage instances do not need eight new architectural sheets.

The cottage exterior sheet now adds a well/winch, bucket, basket, window-box corner, porch bench, chime, watering can, firewood rack, crate, gate latch, hook and mat. Containers are empty so existing planting can be inserted separately. The terrain sheet adds a gentle slope, clearing edge, stream crossing approach and pond ledge. Its clear walking zones matter more than decorative root density. The 2.5 m bank annotation is a landing interface, not a measured stream span; a separate timber bridge and actual crossing still need construction.

## Saved image index

Open one image at a time; every entry has a stable ID.

| Reference | Saved image |
| --- | --- |
| WLD-GLAZED-RAIL-002 | [Glazed parapet designs and twelve-colour glass palette](../completion-pass/WLD-GLAZED-RAIL-002/WLD-GLAZED-RAIL-002.png) |
| B12-COURT-PROP-001 | [Cottage and village exterior small objects](../completion-pass/B12-COURT-PROP-001/B12-COURT-PROP-001.png) |
| T05-FOREST-JOIN-001 | [Forest clearing terrain connections](../completion-pass/T05-FOREST-JOIN-001/T05-FOREST-JOIN-001.png) |
| B12-STRUCT-001 | [Storybook cottage — joinable structure](../world-location-kits/west-lantern-forest/B12-STRUCT-001/B12-STRUCT-001.png) |
| B12-DETAIL-001 | [Storybook cottage — fittings and finish kit](../world-location-kits/west-lantern-forest/B12-DETAIL-001/B12-DETAIL-001.png) |
| F02-TRAIL-001 | [West Lantern Forest — woodland trail sections](../world-location-kits/west-lantern-forest/F02-TRAIL-001/F02-TRAIL-001.png) |
| F02-NATURE-001 | [West Lantern Forest — missing natural objects and wild plants](../world-location-kits/west-lantern-forest/F02-NATURE-001/F02-NATURE-001.png) |
| F02-FLORA-001 | [West Lantern Forest — woodland canopy flora](../world-location-kits/west-lantern-forest/ecology/F02-FLORA-001/F02-FLORA-001.png) |
| F02-FAUNA-001 | [West Lantern Forest — woodland mammals](../world-location-kits/west-lantern-forest/ecology/F02-FAUNA-001/F02-FAUNA-001.png) |
| F02-FAUNA-002 | [West Lantern Forest — birds and insects](../world-location-kits/west-lantern-forest/ecology/F02-FAUNA-002/F02-FAUNA-002.png) |
| T05-CONIFER-001 | [Mistwood and woodland evergreen trees](../completion-pass/T05-CONIFER-001/T05-CONIFER-001.png) |

## Other places also need their own kits

| Area | Architecture and paving | Nature, objects and atmosphere |
| --- | --- | --- |
| Lantern Lake / Moon Water Palace | Existing pearl/ivory palace, local courtyard, dock/steps and water-edge fittings | Willow/reeds/lotus, bank transitions, boat mooring, fish and shore birds |
| Coast / lagoon / harbour | Source-specific houses, pavilion/lighthouse pieces, docks and salt-worn path edges | Uneven beaches, tidal rocks, dunes, palms/citrus where supported, driftwood, coral and sea life |
| Jade jungle / temple | Jade temple and timber/stone joins from that site's references | Broadleaf canopy, vines, understory, wet roots, moss, streams and suitable small wildlife |
| Fjord / highland | Local timber/stone buildings and paths | Birch/conifer patches, cliff/shore transitions, sparse hardy planting and local natural landmarks |
| Canyon / dry cliffs | Apricot/sandstone palace/shrine details and dry paving | Eroded rocks, sand/gravel, sheltered oasis plants and dry-habitat wildlife |
| Sky / moon gardens | Existing island/portal/observatory grammar and supporting structural pieces | Island substrates, selective meadow flora, edge planting, light/mist effects and small site-specific artifacts |

The 34 location briefs and [coverage queue](coverage.csv) already track these families. Many source-specific architecture, flora and terrain sheets are still queued; this update does not claim they are built. Shared water/rock/soil/plant families receive local placement/material choices. No new large master map or all-images-at-once review is needed to proceed.

## Make one forest route playable

After the bedroom/balcony prototype, use F02 for a second compact build: one cottage, a short loop, a clearing, a pond edge and a small crossing. A roughly 150 × 150 m test area is a proposal, not a changed world-map reservation. Preserve the existing 12 km world layout and 2.5 km palace reservation.

1. Build simple terrain and cottage substrates, real doorway, floors and thresholds; model the ground slopes and bridge bearing seats from explicit dimensions. Treat illustrated tiles as design guides, not rigid scenic blocks to upload blindly to a model generator.
2. Make a small reusable mesh set: cottage modules, timber bridge, rail/gate, a few trees, fern/grass clumps, log/rock, bench and lamp. Use simple procedural geometry for terrain, bridge planks, walls and collision; isolate named reference parts for complex decoration.
3. Test the player route before dense decoration: ground contact, walking slope, camera clearance, doorway, crossing, water boundary and return path. Leave 3 m proposed trail clear where illustrated; final clearances depend on the actual controller.
4. Add instanced vegetation and cottage props in meaningful groups. Give trees/props sensible LODs and simple collision; avoid colliding with every leaf or chime tube. Give animals spawn/animation budgets before placing them.
5. Load the real browser game and measure frame time, memory, texture load, shadows, glass sorting and water cost. Test one existing interaction, or separately specify a new cottage interaction. Screenshots are not evidence of working movement or controls.

No paid Meshy work, Blender composition or runtime export was performed here. Reference sheets remain pending per-asset approval and geometry/fit checks before a model-generation or final-composition gate. A running forest test is the next practical proof; completing every optional colour or prop image is not a prerequisite to that prototype.
