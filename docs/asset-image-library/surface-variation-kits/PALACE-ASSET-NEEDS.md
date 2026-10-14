# Palace asset needs and confidence

We have useful visible architecture/decor vocabulary, not a proven complete2km palace. Structural continuity, back/roof returns, full room furnishing, model joints and playable navigation remain unresolved. This checklist preserves20 candidate families, of which16 remain in scope and4 are excluded by the owner. Categories are not approvals or automatic new-image requests.

**Interior architecture coverage is partial.** [The interior audit](INTERIOR-COVERAGE-AUDIT.md) distinguishes existing room scenes/plans/sections and motif studies from missing coordinated room views, dome interiors and room-specific construction kits.

| Family | Objects/support still needed | Current evidence/status | Optional magical idea |
| --- | --- | --- | --- |
| Royal bedrooms | Beds, headboards, bedside cabinets, chests and bedding | missing supporting furniture references — GEN-24; PAL-INT-PROP-001 reservation | Canopy fabric with a quiet constellation glow |
| Dressing and jewellery rooms | Wardrobes, dressing tables, stools, jewellery stands and storage boxes | incomplete furniture kit — GEN-24 mirror/console | Small jewel cases and a rose-trimmed dressing mirror |
| Dining and tea salons | Dining tables, chairs, tea sets, dishes and serving cabinets | missing dedicated kit — GEN-24 side table only | Teacups, blossom place settings and an intimate tea pavilion |
| Curtains and hanging textiles | Curtain panels, tiebacks, canopies, tassels, tapestries and banners | curtain master and celebration swags/festoons now indexed; extra variants/joints still incomplete — GEN-24-A10; GEN-25-A06/A07; GEN-35 | Layered translucent rose curtains and embroidered star hangings |
| Carpets and soft furnishings | Area rugs, stair runners, cushions, bed throws and tablecloths | embroidered rug master indexed; runners/cushions/throws remain incomplete — GEN-24-A11; INT-C01 is hard-floor vocabulary only | Different woven motifs for quiet suites and grand halls |
| Portrait and memory galleries | Frames, display plinths, picture lights, albums and keepsake cabinets | new optional experience/supporting-prop kit — GEN-24 mirror/console partly reusable | A gallery of illustrated memories revealed through light |
| Enchanted library and archives | Books, writing desks, reading chairs, ladders, scroll cases and shelf props | hero/reference room exists; supporting kit incomplete — GEN-26 library; GEN-24 bookcase/lectern | A hidden rotating shelf and softly moving story pages |
| Celestial observatory | Telescopes, star charts, instrument desks, globes and viewing seats | armillary exists; rest optional/missing — GEN-28 armillary | A star chart that aligns with the palace night sky |
| Art and craft workshops | Easels, looms, embroidery stands, quills, paints and fabric rolls | new optional activity/furnishing kit — No dedicated selected kit | An atelier for gowns, mosaics and painted wishes |
| Conservatory planting and care | Planters, trellises, orchids, citrus, potting tables and hanging baskets | some foliage/planters exist; care-kit incomplete — GEN-09/13/35/36; PAL-CONSERV-SURF-001 | A fragrant moon-bloom collection with its own small paths |
| Aviaries and butterfly gardens | Perches, bird baths, habitat shelters and butterfly-friendly planting | new optional kit; creatures require separate audit — GEN-09/13 garden vocabulary | A small butterfly court beside the conservatory |
| Water and memory gardens | Pool benches, small rills, wall spouts, basin joins and water-side ornaments | fountain heroes exist; surrounding support kit incomplete — GEN-11/14/34/43 | Pools that reflect a different constellation after a wish |
| Hidden rooms and puzzle passages | Moving bookcases, sliding panels, keys, latches and secret-door fittings | new optional mechanics and dedicated parts — Existing door/arch styles support appearance only | A birthday trail of small discoveries; mechanics not implemented by this plan |
| Wishing and celebration stations | Existing wish lanterns, preparation/display surfaces, gift props and ceremony seating | eight major wishes/travel designs exist; supporting/interactivity audit needed — GEN-28/25/35; wishing-source-audit | Reuse the lantern for idle/lit/released states; add props only for a real interaction |
| Palace travel and viewing points | Existing portal rings/boats/docks, destination signs, lookout seats and vertical-travel fixtures | heroes exist; palace placement and vertical access unresolved — GEN-28; js/travel.js | A light travelling platform or star lift to make tall levels usable |
| Magical lighting and curiosities | Lanterns, flying lanterns, chandeliers, mobiles, enchanted clocks and small mirrors | base lights exist; variants/attachments/state integration incomplete — GEN-20/24/45; GEN-28 wish lantern | Petal lamps, quiet floating lights and a clock that blooms at celebrations |

Coordinate interior room/wall/ceiling construction first, then prioritise bedroom/dining furniture, textiles, lighting and planting containers. Baths/spas, kitchens/bakeries, service rooms and music spaces are excluded by the owner. Keep humans and their furnishings readable within the monumental palace; a2km span needs authored zones and usable travel, not simply more unique ornament. Existing source motifs can repeat through normalized module profiles and region-specific material/trim families.

Tile/cornice/parapet repeats here have declared matching rules. Their illustrated pixels are not certified seamless UV textures, and no actual mesh/joint/collision check has been performed. Runtime will need instancing, tiled materials, level-of-detail and streaming/visibility control. This reference task does not implement those systems.

## Wishing objects

[Eight existing source panels](wishing-source-audit/index.html) show the boat, landing platform, ring, wish lantern, floating lotus candle, runestone, armillary and kiosk. Four lacked individual registry entries; those are indexed from existing art, without new generation. The runtime already lets players write/release a wish lantern at Lantern Lake (`js/minigames.js:createWishLanterns`, `js/main.js: wish-send`), using a procedural cylinder, glow sprite and dynamic text. A reviewed decorative lantern model is still needed for visual fidelity; idle/lit/released behaviour can share one model. There is no demonstrated need for a new wishing-object type just to support that existing interaction. New wish-token/altar mechanics are optional concepts, not existing requirements.

## Budget

65/65 palace slots are selected/reserved, including unproduced room/furniture reservations;85/230 total. Do not generate a separate image for each remaining category automatically. Consolidate these categories into10–20-part prop sheets, reuse original references and replace unproduced or superseded selections when warranted. Files remain preserved when a selection is retired.

## Structural core still to prove

Continuous wall/ward host bodies; roof and floor substrates; angled/curved wing returns; tower/wing/terrace mating seats; door/window apertures and their returns; landing and wet/dry stair junctions; roof/back drainage/edges; courtyard containment; collision and navigation/travel links. Their references partly exist, but physical assembled fit is unverified. These core systems precede filling the palace with more optional decor.

## Glazed water edges and parapets

[Source/material correction](GLAZED-EDGE-NOTES.md): GEN-36 water-edge pointed bays include blue/lilac/rose glass. Green stained glass in another parapet is a distinct owner-reported variant awaiting exact source identification. Frame/pane/backing material separation must be retained.

## First interior reference progress

[Ballroom multi-view and four-part structural kit](../interior-room-kits/README.md) are now drawn and indexed. These are source-compatible proposals; room/ceiling fixture parity and physical fit are unverified. Other rooms, dome interiors, per-room furnishing and missing decor remain outstanding.

## Celebration dressing next

[Nine existing decor/furnishing designs](../interior-celebration-dressing/README.md) are newly indexed from original GEN-24/25 art. Use them for a focal birthday display, small seating groups, curtains/rugs, floral swags and lantern festoons. No new cake/curtain/rug master is needed merely because it was unindexed. A dressed-room placement view and missing small furniture/tabletop/textile/mounting details remain to produce.

## Audited ballroom missing pieces

[Ten new reference candidates and eight existing extraction/reuse groups](../interior-celebration-dressing/MISSING-PIECES.md). New candidates are a celebration chair, tea/serving/place-setting pieces and an optional memory display. Cushions, candles, tassels, floral swags, mounts and textile motifs are already illustrated; isolate/fit those rather than redesigning them. No new images or selected slots are produced by this audit.

## Celebration props generated

[One ten-item labelled sheet](../interior-celebration-dressing/PAL-CELEBRATION-PROP-001/README.md) now covers the audited chair, tea/serving/place-setting pieces and optional birthday memory display. Source-compatible new shapes remain pending review; backs, mounts and actual fit unverified. Existing decor remains reused. Private furniture pack is deferred to keep65 palace slots; beds/wardrobes remain missing. No models or dressed-room placement view generated.

## Ballroom celebration placement preview

[The dressed ballroom](../interior-room-kits/INT-BALLROOM-DRESS-001/README.md) now shows birthday display, gifts, tea/seating groups, textiles, floral swags and festoons using existing source families. This is a composition preview: exact prop designs/scale, fixture parity, room clearances and physical fit are unverified. No new asset type or selected slot is added. Other interior/structural gaps remain.

## World phase begun

[Terrain/location plan and kit sequence](../world-layout/README.md) now map the other locations without changing palace architecture. Existing palace gaps remain tracked; this pass adds one world-map reference slot. Source/coordinate parity and all world geometry are unverified.
