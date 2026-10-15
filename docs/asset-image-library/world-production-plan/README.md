# Structured world production plan

15 October 2026 · Proposal for scope and sequence · [34-place matrix](location-coverage.csv) · [Full location coverage](location-coverage.json) · [Kit catalog](kit-catalog.json) · [Geography decisions](geography-decisions.json) · [Milestones](milestones.json) · [Gap backlog](gap-backlog.json)

**First geography blockout:** [Open the separate review page](blockout/index.html) · [Evidence and limitations](blockout/README.md). It preserves all source placements and adds proposed terrain, hydrology, route profiles and local movement tests. Regional crossings, ports, heights and final travel remain under review.

**Shared circulation fixture:** [Open the K09 fit test](kit-fit/index.html) · [Contracts and checks](kit-fit/README.md). Two copied flights, an open arch and independent parapet collision now have local engineering evidence; final kit acceptance remains pending.

**Regional terrain and biomes:** [Updated map and FC05 habitat pass](blockout/BIOMES-AND-TERRAIN.md) adds physical landforms, six transition profiles, six local ground zones and a complete local browser traversal. Four transition sections still need grading/crossing work; final flora/fauna models remain pending.

**West arrival connection:** [Inspect the stair/ramp alternatives](blockout/west.html) · [Route evidence](blockout/WEST-CONNECTION.md). The FC05 loop now has a proposed connection to a village-boundary gate; the first internal lane and court now have a separate prototype, with the rest of the village still unresolved.

**Village host update:** [B12 arrival lane and modular fixture](village-fit/index.html) · [Source decisions and checks](village-fit/README.md). Saved wall/roof dimensions now have actual openings, roof joins and three browser movement checks. The saved detail sheet adds **26 fitting specimens / 11 mounted types**, opening door/shutter controls and an isolated chimney pot pending its flue. [Fitting preview](village-fit/review/fittings-source-slots.png) · [Fit manifest](village-fit/fitting-review.json). These are Function prototypes; final carving, models and art acceptance remain pending.

**Roof construction update:** [Inspect the chimney / roof / valley variant](village-fit/roof-fit/index.html) · [Evidence](village-fit/roof-fit/README.md). Saved D09 now has a proposed shaft and real roof opening, with framing, flashing and a sloped valley to an inspection sump. Onward site drainage and final weather/structural details remain unresolved.

## Outcome and present state

Build a connected, explorable princess-castle world through small tested sections. Geography and route logic come first, shared kit contracts second, playable samples third, then regional destinations. New pictures are generated only for a demonstrated missing design or construction view. A 230-sheet ceiling is not a requirement to fill every slot before building.

The current reference library has **126 selected sheets saved, 212 selected/reserved, 86 queued and 18 unallocated**. It contains 700 logical model targets, all currently marked unregistered. This says nothing about the old game's procedural objects; it means this reference-driven redesign has no registered accepted model versions or validated world routes. The three rail/forest sheets saved immediately before planning are indexed in [their coverage report](../completion-pass/RAILS-FORESTS-PLAYABLE-PLAN.md).

This update pauses further image generation and proposes a production route. It does not change the existing map coordinates, castle silhouette, site dimensions or runtime. Source visibility, imagined layout and approved/built geometry remain separate.

## Sequence and completion gates

| Stage | Work | Required result before broadening |
| --- | --- | --- |
| P0 — Inventory and scope | Saved source IDs,34place matrix,16kit catalog, exclusions and current budget; distinguish references, models and runtime. | This plan provides the initial audit; source facts are preserved. |
| P1 — Geography and route blockout | Elevation/shore/water layers, site pads, crossing locations, regional transitions and travel graph. | All G01–G08 decisions resolved enough for first routes; concept polylines are not marked playable. |
| P2 — Shared kit and technical contracts | Units, pivots, seam profiles, opening standards, glass/material IDs, UV scale, collision, LOD/instancing and loading groups. | One floor/wall/opening/rail/path/water-edge example physically fits and survives actual player/camera tests. |
| P3 — Two playable samples | B01bedroom/balcony and F02one cottage/clearing/pond-edge loop; human furniture and one reusable interaction test. | Both load in real browser with correct collision, route, openings, return and measured performance. Reference approval before paid generation; no paid work is authorised by this planning document. |
| P4 — Regional route production | Execute W2–W6; for each place terrain/arrival first, structure second, selected interior/circulation third, ecology/decor fourth, behavior/effects last. | Complete the stated D2/D3/D4coverage; every place has evidence rather than a saved image count. |
| P5 — World integration | Connect routes, palace spine, bridges, land/sea/sky arrivals, state persistence and streaming transitions. | No orphan destination, underwater landing, inaccessible entrance, broken return or forced huge empty walk. |
| P6 — Polish and performance | Refine repeated materials/joins, foliage density, wildlife behavior, shadows, weather/waves and light/ambience. | Review final production camera and device measurements; runtime/deployment approval is separate from reference archive publication. |

P1 and P2 produce enough geography and shared conventions for the first two samples; they do not require finalising every distant island or modeling all sixteen kit families first. Resolve local sample elevations/water/access, keep far-region unknowns recorded, and refine those when their wave begins. Include one shared step/landing and vertical-access test before using elevated lighthouse or gallery routes.

A region is not finished at “art generated.” Each place follows the same dependency order:

**Local brief → terrain/water/arrival → structural kit → selected interior and circulation → flora/props → fauna/interaction/ambience → player and browser test → next place.**

If a seam, opening, slope or route fails, correct that shared kit before copying it across the map. Do not produce every shell first, all foliage much later, and only then discover that none of it fits a player.

## Geography coverage

Preserve the 12 × 12 km envelope, 2.5 km palace-width reservation and provisional 2.125 km palace depth. Humans, furniture and ordinary homes retain human dimensions; the palace multiplier is not a universal scale. GEN-37 remains palace-front authority. The existing world image is an inspiration/placement proposal, not an exact heightfield or survey.

**G01 — World scale and coordinate contract.** Keep12km square envelope, X east/Z south,2.5km palace width and provisional2.125km depth; do not uniformly scale humans, furniture or all source structures. Next: Confirm footprint interfaces/approach band; palace height and invisible depth remain source-led unresolved decisions.

**G02 — Land/sea and elevation.** Keep irregular coast with open horizons; use local ridges/fjord/canyon outcrops, no mountain ring. Next: Produce a simplified elevation/blockout and check gradients, land coverage, building pads and coastal continuity.

**G03 — Hydrology.** Separate calm Lantern Lake, ponds, streams, sheltered lagoon and open sea. Sea datum0 is a proposal, not an existing solved elevation. Next: Choose water levels, downhill river profiles, beds/banks and spill/outlet logic before detailed water assets. Resolve whether650x700m Lantern Lake reservation is a cove or full lake versus the older3.6x1.3km art.

**G04 — Regional transitions.** Use eight terrain families with overlap zones rather than hard biome walls. Next: Specify forest-to-meadow, lake-to-forest, dune-to-rock, jungle-to-cliff and canyon-to-coast transitions and their material blends.

**G05 — Travel and routes.** Existing polylines and bridge paths are concept routes, not walking/navigable geometry. Next: Connect route nodes to actual gate/door/landing ports; test grades, crossings, dead ends and return loops. At proposed4m/s, crossing2.5km takes10.4min and12km50min, so test shortcuts/travel early.

**G06 — Palace and site interfaces.** GEN-37 controls palace front architecture; garden/isometric references inspire components and do not override it. Next: Resolve palace outside-band joins, water basins and site setbacks without redrawing the whole castle as an unapproved replacement.

**G07 — Sky and vertical layers.** Sky XZ projections do not define altitude or ground-level collisions. Next: Specify arrival height, support/landing containment, view layers and return/fall behavior; no automatic flying mechanic or2000m tower policy.

**G08 — View and discovery structure.** Every named destination needs a readable approach, focal moment and return, with quieter space between dense groups. Next: Use walk tests for discovery spacing and optional path lengths; do not add unique props merely to cover all12km.

The first geography deliverable is a simplified terrain/route blockout with elevation, water, biome, site-footprint, access and view layers. Keep ground routes and sky projections separate. Record unknown elevations and ports explicitly. Revise the existing selected world-map sheet only if needed after the geometry is coherent; do not make another competing master layout now.

## Coverage depth

| Profile | What is authored |
| --- | --- |
| D0 — Distant background | Silhouette/low-detail shell, distant material and visibility bounds only. Unnamed filler, not the default for a named destination. |
| D2 — Explorable outdoor place | Approach, walk-around exterior/open pavilion or court, focal view, exit/return route, local plants/props/ambience and simplified collision. No automatic furnished sealed interior. |
| D3 — Explorable place plus selected interior/deck | D2 plus one useful room or upper/deck route, furnished focal zones and a reusable interaction/access pattern. Forests use the shared cottage interior family; not bespoke rooms for every building. |
| D4 — Hero hub | D3 plus authored connected multi-zone routes and full hero hierarchy. Palace prototype first, then ten selected zones; no complete simulation of all enormous wings. |

Every named destination gets at least an explorable outdoor route. Background fillers can use D0. D3 means a selected room or upper platform, not every floor. The palace gets ten selected connected zones; its immense remaining area is not automatically a fully furnished interior. Forest cottages use a shared kit and two compact interior templates: test one first, then reuse across the eight cottages with placement/dressing changes. Rustic furniture stays visually distinct from gilded palace pieces.

Near the player, surfaces, plants, trims and items need readable depth and contacts. At middle distance, clustered instances and reduced geometry carry the impression. Far backgrounds use low-detail silhouettes and LODs. Initial distance bands of roughly 0–20 m, 20–150 m and beyond 150 m are proposals to tune to the actual camera and device, not rigid guarantees.

Baths/spas, kitchens/bakeries, staff/service rooms and music/performance rooms remain excluded. Environmental sound such as water, wind and birds is separate from a music room. A framed open passage must genuinely lead somewhere; non-enterable shells must show closed boundaries rather than fake openings.

## Sixteen coordinated kit families

| ID | Kit | Coverage | Sharing rule |
| --- | --- | --- | --- |
| K01 | Landform and terrain | Heightfield/terrain substrate, slopes, saddles, terraces, clearing pads, banks, shore connections | Shared world plus regional variants |
| K02 | Geology and natural landmarks | Rock families, boulders, strata, cliff corners, overhangs, caves only if used, hero arch/pillar contacts | Shared rocks; local hero geology |
| K03 | Water systems | Ocean, sheltered lagoon, calm lake/pond, stream, cascade, wet/dry edges and water inlets/outlets | Shared shaders/meshes; local basin shape |
| K04 | Ground materials and paving | Soil, leaf litter, grass, moss, mud, sand, gravel, stone, cobble and region paving trims | Shared material library; local surface recipes |
| K05 | Flora and foliage | Canopy, saplings, shrubs, grass/fern clumps, flowers, vines, aquatic plants, fungi and deadwood | Regional habitat palettes; shared species |
| K06 | Fauna | Mammals, birds, insects, fish, reef life and selected magical animals | Shared species/rigs with habitat selection |
| K07 | House kit | Solid/window/door walls, inside/outside corners, floors, gables, roof pitches, dormers, chimney, porch, threshold and small interior divisions | Shared B12 house family plus local material variants |
| K08 | Landmark building kit | Site-specific walls, gates, arches, columns, buttresses, towers, dome/chapel roofs and wing junctions | Source-specific structural families |
| K09 | Circulation and infrastructure | Paths, steps, ramps, landings, bridges, bearing seats, parapets, fences, gates and vertical-travel arrivals | Shared dimension contracts with local finish |
| K10 | Settlement and outdoor furnishings | Courts, street/quay edges, drains, benches, wells, signs, baskets, wood racks, window boxes and lamps | Shared prop sets; local timber/stone style |
| K11 | Interior room architecture | Floor/wall/ceiling shells, door/window reveals, upper galleries, stairs, alcoves, vault/dome undersides and room connections | Hero/local room templates; excludes non-play service areas |
| K12 | Furniture and personal items | Beds/bedding, tables, chairs, storage, desks, books, albums, craft/personal objects and existing celebration items | Shared families; separate rustic versus royal styling |
| K13 | Decor, trim and glass | Cornices, base/capital collars, applique, carvings, tile/panel motifs, railing infill, glass palettes and curtains | Shared motif/profile families; local design/colour constraints |
| K14 | Interactions and readable elements | Doors, inspectable/usable items, existing wish lanterns, prompts, signs, route markers and persistence where needed | Shared behavior components plus authored local content |
| K15 | Ambience and effects | Wind, day/night lighting, local mist, water foam/ripples, small magical glows, birds/wind/water sound and weather accents | Shared effects with local settings; no music-room scope |
| K16 | Runtime and packaging | Pivots/units, named parts, LODs, simplified collision, material/texture slots, instancing, streaming groups and asset manifests | One shared technical contract for all kits |

Each kit needs a short contract: function, dimensions, local style/source, variants, pivot/front/contact faces, matching profiles, materials, optional motion, collision and acceptance evidence. Separate structural host, insert and small decoration. Simple substrates and collision should be procedural. Three or four large sections can share a structure sheet; ten to twenty useful small parts can share a decor sheet. Colour-only variants share geometry. A whole illustrated board is not proof of separable meshes.

## What depth means for each asset family

Each place has a small design package, not an automatic pile of new images:

1. **Site/route plan:** footprint, arrival, levels, water edge, paths/stairs, focal features, access and return. Reuse existing maps/source views where sufficient.
2. **Structural coverage:** front, sides, visible back, roof/underside and the actual join sections needed to assemble its modules. Unseen design is explicitly proposed. A roof or doorway must have a real host and thickness.
3. **Detail coverage:** isolated carving, cornice, tile, glass, railing, light and attachment pieces only where not already in the library. Show backs/undersides, end profiles and material boundaries.
4. **Nature placement:** canopy/understory/ground and water-edge layers, local density clusters, clear walking space, species variation and permitted wildlife behavior.
5. **Selected interior:** plan, four room directions, ceiling underside/sections and a furnishing schedule for the stated D3/D4 scope. No full interior package for every decorative building.
6. **Model delivery:** stable asset/instance IDs, separated host/insert/decor, correct scale/front/pivot, UV/material slots, relevant open/closed/moving parts and optimized mesh/collision versions.
7. **Playable evidence:** actual loaded-game movement, camera, contact, interaction, water/edge containment, return path and device measurements.

Do not independently invent front, side and isometric geometry with separate image prompts and call them matched. Lock one structural blockout, compare it with the authoritative source, and derive its engineering views from that same geometry. Reference artwork suggests detail; physical assembly and actual projections establish fit. Correct an inadequate reference by a targeted revision, not by flooding the library with competing whole-building designs.

Use authoring/runtime coordinate frames deliberately: the world plan uses X/Z ground coordinates; authoring assets may use Z-up while the browser uses Y-up. Record and verify the export/import conversion once per asset family rather than swapping axes or rotating again by eye. Measure imported bounds and contact faces.

For the initial forest sample, a roughly 150 × 150 m area and a 300–500 m loop are starting proposals. Test walking pace and discovery stops before copying the same spacing to kilometre-scale routes. Keep the main bed/balcony sample compact so material, opening and collision issues can be diagnosed quickly.

## Regional production waves

Waves are a work order, not a change to geographical placement. Build temporary distant silhouettes when needed for vistas, then replace only the destinations currently in production.

| Wave | Locations | Dependencies | Exit evidence |
| --- | --- | --- | --- |
| W1 — Two playable samples | B01, F02 | Shared player/camera/collision conventions, material scale and provisional geography | One bedroom-to-balcony route and one forest-cottage route loaded in the real browser; reference images alone cannot pass. |
| W2 — Royal grounds and west woodland loop | B04, B12, B13, B18, B25, S03, F01, S06 | W1 validated plus path/water/vegetation starter kits | Village, palace garden edge, lake and woodland destinations connected; no long empty mandatory walks. |
| W3 — Lake, lagoon, harbour and open coast | B02, B03, B09, B19, B20, B21, B22, B23, B24 | Water levels, shoreline, bridge/jetty interfaces and measured glass/water budget | Dry routes, landings, selected interiors and tidal viewpoints usable; ocean visuals remain distinct from calm lake water. |
| W4 — Misty forest and local highlands | F03, B05, B06, B07, B08, B14, B16, B17 | W1 terrain conventions, W2 forest base and working vertical-route prototype | Ridge/forest loops and selected upper decks have safe physical access or clearly specified travel; local timber/stone styles retained. |
| W5 — Jungle and canyon landmarks | B10, B11, B15 | W3 wet/dry edge tests and W4 slopes/vertical circulation | Dense jungle and dry canyon each have a readable, performant route and source-specific landmark kit. |
| W6 — Sky destinations | S01, S02, S04, S05 | Tested arrival/return travel, containment, streaming and fall/reset behavior | Each island has a working arrival and return, explorable focal route and bounded content; no flight system is assumed. |

## All 34 places and their depth

The primary terrain-family ID refers to the existing eight-region catalog. Adjacent habitats can borrow compatible shared assets; they do not force one flora or marble style everywhere. Existing anchors and source observations are preserved in the JSON matrix. Route labels are not proof of continuous ground.

| Place | Wave | Depth | Primary terrain | Selected access/interior coverage |
| --- | --- | --- | --- | --- |
| B01 — Birthday Castle | W1 | D4 | T01 | Ten selected connected zones: arrival/cascade, throne room, ballroom, dining salon, bedroom/balcony, library, conservatory, roof courtyard, one viewing tower and circulation spine. Rest of palace uses exterior shells/closed non-play spaces. |
| B02 — Moon Water Palace | W3 | D3 | T02 | One dome hall, courtyard arcade and water-steps route; no complete apartment simulation. |
| B03 — Star Chapel | W3 | D3 | T02 | One chapel nave and entrance/roof structure; decorative use, no music/performance room. |
| B04 — Rose Keep | W2 | D2 | T01 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B05 — Misty Lantern Keep | W4 | D3 | T06 | One open timber gallery and accessible upper landing; hidden interiors not invented from a map thumbnail. |
| B06 — Misty Pagoda | W4 | D3 | T06 | Entry and one selected upper gallery; other tiers remain visible architectural shells unless a route needs them. |
| B07 — Temple Hill Rotundas | W4 | D2 | T06 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B08 — Colosseum of Wishes | W4 | D2 | T06 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B09 — Lagoon City | W3 | D3 | T03 | One enterable house template plus street/quay/bridge routes; other facades reuse it or show closed doors. |
| B10 — Canyon Moon Palace | W5 | D3 | T07 | One moon-screen hall/court and terrace route; not every cliff-embedded chamber. |
| B11 — Crescent Rock Arch | W5 | D2 | T07 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B12 — Storybook Village | W2 | D3 | T05 | Reusable cottage interiors and one village passage/public room; house variants share modules. Eight forest cottages reuse this house family. |
| B13 — Storybook Windmill | W2 | D2 | T05 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B14 — Pillar Sky City | W4 | D3 | T06 | Selected open platform buildings and a connected ascent/bridge route; no rooms on every distant pillar. |
| B15 — Jade Jungle Temple | W5 | D3 | T04 | One entry/inner hall and stepped terrace route; no service/back-of-house complex. |
| B16 — Fjord Longhouse | W4 | D3 | T06 | One furnished main hall with porch; excluded kitchen/service/music spaces are not added. |
| B17 — Glowwood Ruin Court | W4 | D2 | T05 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B18 — Mother Tree Sanctuary | W2 | D3 | T05 | Root court plus one sheltered trunk/branch alcove; living tree is a hero form, not generic tree instancing. |
| B19 — Lantern Cove Gatehouse | W3 | D2 | T03 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B20 — Glass Bridge Pavilions | W3 | D2 | T02 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B21 — Tidal Observatory | W3 | D3 | T03 | One observatory/viewing chamber and deck; instruments limited to shared/focal needs. |
| B22 — Pearl Harbor Lighthouse | W3 | D3 | T03 | One selected lookout/lantern deck with a tested ascent or travel solution. Source spiral band is not assumed walkable. |
| B23 — Sea Pavilion | W3 | D2 | T03 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B24 — Reef Star Shrine | W3 | D2 | T03 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| B25 — Crystal Conservatory | W2 | D3 | T01 | One glazed plant hall, pond walkway and inner roof/rail interfaces. |
| S01 — Crystal Garden | W6 | D2 | T08 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| S02 — Aurora Isle | W6 | D2 | T08 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| S03 — Lantern Lake | W2 | D2 | T02 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| S04 — Unicorn Meadow | W6 | D2 | T08 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| S05 — Starfall Isle | W6 | D2 | T08 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| S06 — Coastal Meadow | W2 | D2 | T03 | Outdoor route, source-specific exterior/open court and focal landing only; sealed interior is not included by default. |
| F01 — North Star Woodland | W2 | D3 | T05 | Three cottage exteriors and reusable small cottage interiors; first common interior tested before copying. Stream/meadow exploration loop. |
| F02 — West Lantern Forest | W1 | D3 | T05 | Three cottage exteriors and reusable small cottage interiors; one is the initial playable sample. Pond/orchard/forest-edge loop. |
| F03 — Northeast Mistwood | W4 | D3 | T05 | Two cottage exteriors and reusable small cottage interiors; quiet glade and pond loop, not unique bespoke rooms for each cottage. |

## Nature and geography by region

| Family | Landscape and water | Flora/fauna coverage | Prop/architecture rule |
| --- | --- | --- | --- |
| T01 Royal gardens | Built terraces, courts, stepped beds and small rills | Rose/blossom/cypress, hedges, climbers and garden visitors | Rose/ivory/gold where supported; retain palace layered wings and human-scale garden dressing |
| T02 Lake and water gardens | Calm lake/pond, raised shore pads, bank/ghat and inlet/outlet joins | Willow/reeds/lotus/lilies, freshwater fish, ducks/frogs/insects | Water-palace/chapel/pavilion grammar stays local; no ocean waves in a pond |
| T03 Coast and reefs | Uneven coves/headlands/beaches/dunes, lagoon, tidal shelves, open sea | Salt plants/coastal pine, palms/citrus where shown, seagrass, reef life/seabirds | Marine stone/timber/brass by site; broken varied waves and sheltered pockets, not equal foam rings |
| T04 Jungle | Wet roots, small streams, broken stone/soil terraces | Broadleaf canopy, palms, ferns, vines/epiphytes, suitable birds/geckos/insects | Jade/local stone, dense shoulders but readable path; no royal marble transplanted everywhere |
| T05 Woodland | Mixed forests, meadow gaps, cottage clearings, ponds/streams | Oak/beech/birch/hazel, selective conifers, ferns/bluebells/fungi, woodland wildlife | Timber cottages, rustic furniture and restrained lantern/bench clusters; three forest identities retained |
| T06 Local highlands | Fjord shores, selected ridges/rock pillars, misty valleys | Local conifers/birch, moss/heather candidates and sparse appropriate wildlife | Cedar/teal gallery/pagoda/stone styles from source; cliffs stay local, not a world border |
| T07 Canyon | Apricot sandstone, gullies, crescent arch and sheltered water courts | Dry grasses/shrubs, oasis planting, lizards and small dry-habitat fauna | Warm local stone and gold/teal details by source; erosion and usable terraces before ornament |
| T08 Sky | Separate island substrate/arrival/edge-containment layers | Selective meadow/blossom/frost-like candidates and limited magical fauna | Preserve each island focal identity; altitude, travel and fall handling resolved before dense dressing |

Fauna needs anatomy/rig/animation and behavior review. More static species pictures do not make wildlife playable. Start with a few appropriate shared creatures, then expand only when needed. Foliage and loose props should be instanced; branches/leaves and tiny ornaments do not each need complex collision. The living Mother Tree, crescent arch and major cliff pillars are hero forms, not generic scaled props.

## Budget discipline

| Reference allocation | Cap | Selected/reserved | Saved |
| --- | ---: | ---: | ---: |
| palace | 83 | 83 | 83 |
| other-map-buildings | 58 | 58 | 10 |
| terrain-water-and-planting | 57 | 45 | 19 |
| shared-outdoor-props-and-bridge | 22 | 17 | 9 |
| maps-magic-travel-and-birthday | 10 | 9 | 5 |

The cap includes the original 45 boards. Saved archive crops and rejected/revised drafts are preserved, but do not create extra selected slots. Regional site caps are ceilings, not promises of unique sheets for every room or cottage. The authoritative current caps remain production-budget.json; old caps printed in historical map/audit files are not a new allocation.

The 18 unallocated slots are contingency, not a new asset-generation batch. Candidate gaps include rustic interior references, special terrain connections, nocturnal fauna or a genuinely missing mechanical/hero detail. Audit existing references and simple procedural solutions first. A new reservation must fit both total and category/site caps, with any reallocation recorded. No additional slots are reserved by this planning document.

## Playable acceptance and priorities

For the first samples, test a real controller and camera with continuous ground, doorway/threshold, steps/slope, balcony or stream edge, safe reset/return and one clearly specified interaction. Measure scene loading, texture memory, frame time and transitions in the actual browser. A provisional desktop aim is 60 fps, with a tested 30 fps fallback where appropriate; final device targets, quality tiers and hard budgets need measurement and user/device context. Do not claim these frame rates are achieved.

At a proposed 4 m/s walking speed, the palace width alone is about 10.4 minutes and a world-width crossing about 50 minutes. Prioritise short authored loops, visible goals and a tested travel graph over dense decoration along every kilometre. Keep empty relief areas intentional. Portal/sky-boat appearance does not prove a working endpoint or flight mechanic.

The immediate next work is P1: resolve the simplified geography and route blockout, then P2 contracts and the two P3 samples. No further image generation is needed just to complete this plan. No paid model service, Blender composition, runtime export or deployment is performed/approved by it. Future paid/image-to-3D and final composition/runtime gates use their required per-asset/layout review; publishing this reference archive is not deploying a game.
