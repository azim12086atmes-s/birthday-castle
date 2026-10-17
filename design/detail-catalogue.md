# Detail catalogue: every picture, one by one

The owner asked on 2026-10-11 for every reference picture to be gone through one at a time, with every pattern, carving, edge, material, object and light effect named and noted, and then used. This file holds that record for all 402 pictures (U01 to U402), in ID order.

Each picture has the same seven headings:
- **Patterns:** repeating ornament and layout rhythms.
- **Carvings & relief:** what is carved, and how deep (flat, shallow, deep, fully 3D).
- **Edges & profiles:** arch shapes, mouldings, cornices, silhouettes.
- **Surfaces & materials:** stone, glass, gilding, water, foliage, and how glossy each is.
- **Objects:** everything that can be placed as a prop.
- **Lighting/FX details:** glows, particles, reflections, sky.
- **Build components:** each usable piece, how it is made (Blender mesh, normal map, decal, shader, particles) and where it goes in the world.

The pieces are grouped and de-duplicated in [component-library.md](component-library.md), which is the file the build works from. Pictures are in [images/](images/) and indexed in [image-index.md](image-index.md).

**Swap rules for this game:** creatures have no eyes, statues and figure columns are veiled or faceless, dragon or animal heads become scrolls or lotus buds, and cross finials become stars.

**Note:** a few small items were judged from zoomed crops and may be a best guess. The worker that did U316 to U360 re-checked its blocks against the pictures and corrected U320, U336, U341 and U342.

### U01
- **Patterns:** stepped/terraced contour bands on hillsides (stacked strata ledges); scattered blossom-canopy clusters (pink sakura puffs) repeated in rows along terraces; columnar basalt-like rock pillars in background (vertical fluted rock).
- **Carvings & relief:** none architectural; distant rock spires with vertical fissures read as natural "fluting" (deep relief, natural). A small distant hut/shrine roof at lower-centre (fully 3D, tiny).
- **Edges & profiles:** terrace edges are rounded grass lips over vertical rock faces (bullnose grass overhang); rock pillars have chamfered, blocky stacked silhouettes; shoreline edges are soft with pale shallow-water fringe.
- **Surfaces & materials:** stylised matte grass (flat-shaded, slight gradient), grey-brown matte rock with chunky facets, turquoise shallow water with lighter sandbar fringes, pale pink foliage clumps.
- **Objects:** paraglider/kite wing (wood-and-cloth hang-glider, figure hanging below), sakura trees (pink round canopy), round green deciduous trees, yellow-green bushes, distant rock spires, floating/offshore rock islets, small hut, river/lagoon.
- **Lighting/FX details:** bright daylight, atmospheric blue haze on distance, soft rim light on canopies; no emissive.
- **Build components:**
  - Terraced rock ledge kit — Blender mesh (modular stepped cliff with rounded grass cap) — Glowwood slopes / castle base terraces.
  - Blossom-puff tree — Blender mesh + alpha-card canopy, pink emissive tint at night — Glowwood & courtyard gardens.
  - Basalt column spire — Blender mesh + vertical-crack normal map — distant skyline ring around the island.
  - Shallow-water fringe — shader (depth-based colour ramp, foam rim) — moat / lagoon around castle.
  - Hang-glider wing prop — Blender mesh (wooden ribs + cloth) — decorative on a tower balcony.

### U02
- **Patterns:** rough coursed rubble masonry on ruined walls; ivy/moss draping repeated; stepped stone terraces; flower clusters (orange, yellow) in drifts.
- **Carvings & relief:** distant square bell/clock tower with arched belfry openings, small corner pinnacles/finials at top parapet and a domed/conical cupola cap (crop U02a) — paired round-arched windows on each face (shallow-to-deep relief recesses); string course bands between storeys.
- **Edges & profiles:** round-arched belfry openings; corbelled parapet at tower top; crumbled, broken wall tops (irregular silhouettes); stone stair treads with rounded worn edges.
- **Surfaces & materials:** weathered grey-green stone, mossy; matte; lush grass; no gilding.
- **Objects:** ruined castle walls, bell tower with cupola, stone steps, flat stepping-stone path slabs, orange flower bushes (marigold-like), yellow wildflowers, broadleaf trees, ferns, stream with rocks, small birds (figures) in sky.
- **Lighting/FX details:** bright day, soft bloom on clouds, dappled foliage.
- **Build components:**
  - Ruined belfry tower with cupola & corner finials — Blender mesh — Glowwood ruin landmark / castle outer ward.
  - Overgrown rubble wall kit — Blender mesh + moss mask shader (top-down moss by world normal) — outer bailey ruins.
  - Ivy drape — alpha-card mesh / decal — castle walls, bridge piers.
  - Stepping-stone path slabs — Blender mesh instancer — garden paths.
  - Flower drift clumps (orange/yellow) — instanced cards — courtyard planting.

### U03
- **Patterns:** ashlar block masonry on ruined plinth/temple (crop U03a) with a carved horizontal frieze band of small repeating glyph/meander-like motifs (reads as a running Greek-key/fret band, blue-grey tint); sheet-white plaster flaking (crackle); geodesic/Voronoi-cell lattice on a mushroom-shaped dome canopy far right (crop U03b) — irregular hexagonal/voronoi openwork; flat square paving slabs in path (staggered).
- **Carvings & relief:** frieze band on ruin (shallow relief, ~1–2 cm); cornice step on ruin top; giant curved natural stone arch top-left with moss (fully 3D); crystal-like blue blade formations on rock outcrop (fully 3D, sharp).
- **Edges & profiles:** ruin has stepped cornice and plinth; white plaster cap with broken irregular edge; crystal blades have keen, glossy edges catching bright rim; rock strata squared ledges.
- **Surfaces & materials:** grey-blue ashlar (matte, weathered), white cracked plaster/marble skin, glossy iridescent blue crystal blades, red-lacquer/rusted metal spiky structure (far right), sandy red-earth path, white square pavers.
- **Objects:** ruined temple plinth, natural stone arch, giant pink-blossom twisted tree, conifers, round broadleaf trees, pink flowering shrubs, large-leaf ground plants (hosta/taro-like), fallen logs and roots, boulders, white paver path, Voronoi lattice dome on rock column, crashed red spiky ship/structure, mount figure.
- **Lighting/FX details:** soft daylight, glossy highlights on crystals, blue atmospheric depth.
- **Build components:**
  - Ruined frieze plinth (ashlar + meander band) — Blender mesh + frieze normal map — Glowwood ruins / castle undercroft.
  - Voronoi lattice dome canopy — Blender mesh (voronoi-cut shell) + emissive cell edges at night — garden pavilion / observatory.
  - Crystal blade cluster — Blender mesh + iridescent glass shader (fresnel hue shift) — Glowwood crystal grove, rock outcrops.
  - Twisted blossom tree — Blender mesh trunk + card canopy — Glowwood centrepiece.
  - Root-over-wall overlay — Blender mesh roots — ruined walls.
  - Square paver path with gaps — mesh instancer/decal — garden paths.

### U04
- **Patterns:** horizontal plank cladding on windmill towers; scalloped/curved red tile roof bands; footprint/pebble stipple on sand path; clumped stylised grass blades; leaf-cluster canopies.
- **Carvings & relief:** none carved; windmill towers have stacked tiered drums with flared skirt roofs (pagoda-like), railed balconies at each tier (crop U04a) — wooden balustrade rails (fully 3D). Timber longhouse with gable roof and lattice window band.
- **Edges & profiles:** flared tiered skirt roofs with upturned eaves; gable roof with overhang and bargeboards; mossy boulder tops with rounded bevels; sail blades thin with lattice frame.
- **Surfaces & materials:** weathered wood planks, red clay roof tiles, grey stone, warm beige sand, bright saturated foliage; all matte toon-ish.
- **Objects:** windmills (tiered drum type, 4-sail) on cliffs, waterfalls, village houses, orange-leaf maple trees, large round oaks, conifers, mossy boulders, sand path, white daisy-like wildflowers, ferns, zipline/rope cables between cliffs.
- **Lighting/FX details:** bright day, strong shadows; waterfalls with white foam streaks.
- **Build components:**
  - Tiered drum tower with flared skirt roofs and balcony rails — Blender mesh — castle windmill/lookout towers.
  - 4-sail lattice windmill rotor — Blender mesh + slow rotate script — hilltop accent.
  - Mossy boulder set — Blender mesh + moss-top shader — paths, Glowwood.
  - Waterfall ribbon — shader (scrolling foam UV) + mist particles — cliffs beneath the castle.
  - Orange maple tree — mesh + card canopy — courtyard.

### U05
- **Patterns:** coursed stone blocks on ruined arches; wooden lashed-pole fence.
- **Carvings & relief:** ruined round-arch gateway/aqueduct with pilasters and a broken entablature (crop U05a), recessed arch archivolt (shallow-deep relief); stacked moulded impost blocks; skull ornaments on fence posts (skip — use wood knobs instead).
- **Edges & profiles:** semicircular arches with stepped archivolt; cornice blocks crumbling; square pilasters with capitals.
- **Surfaces & materials:** weathered grey-tan stone, matte; dry grass; explosion fire.
- **Objects:** ruined arcade/aqueduct arches, lashed wooden fence/barricade, rock dome, fire explosion, falling debris, bow & arrow figure.
- **Lighting/FX details:** orange-red explosion with glowing streak particles (embers), heat glow on stone; dusty haze.
- **Build components:**
  - Ruined round-arch arcade with pilasters — Blender mesh — outer approach/aqueduct to castle.
  - Lashed pole fence — Blender mesh — Glowwood camp.
  - Ember streak burst — particle (additive streaks) — fireworks / magic FX.
  - Broken-edge cornice block — mesh variants — ruins kit.

### U06
- **Patterns:** thatch strands on roofs (horizontal layered thatch), timber ridge cross-poles (X-shaped ridge chigi); dense wildflower meadow stipple (red poppy, yellow, blue cornflower dots).
- **Carvings & relief:** none; thatched longhouses with decorative crossed ridge poles (fully 3D).
- **Edges & profiles:** thick rounded thatch eaves; gable crossed rafters at ridge ends; soft blob foliage silhouettes.
- **Surfaces & materials:** straw thatch, painterly grass, mossy grey rocks, red-ochre mountains.
- **Objects:** thatched huts/longhouses, sunflowers, poppies, cornflowers, daisies, tall grass, round deciduous trees, shrubs, boulders, mountain cliffs, floating pollen motes.
- **Lighting/FX details:** soft blue daylight, floating white pollen particles in air, bloom.
- **Build components:**
  - Crossed-ridge thatch roof — Blender mesh + thatch normal map — Glowwood huts / garden folly.
  - Wildflower meadow — instanced cards with colour variation — castle meadows.
  - Sunflower prop — Blender mesh — garden beds.
  - Pollen mote particles — particle (slow drifting points, warm glow at night as fireflies) — Glowwood.

### U07
- **Patterns:** glazed green and orange tile roofs with ridged rows (barrel/pantile rows); timber bracket arrays (dougong) under eaves; stone block terrace walls; circular stone medallion paving at plaza (crop U07a); hanging orange banners (diagonal streamers) from towers.
- **Carvings & relief:** paifang/torii-style gate pavilion with layered roofs and a gold circular emblem/medallion at ridge centre (fully 3D medallion, shallow relief inner design); ridge-end upturned finials; multi-tier pagodas with gilded ridge ornaments (crop U07b); arched bridge with railings.
- **Edges & profiles:** strongly upswept eave corners; layered stacked roofs; humpback arch bridge profile; terrace walls with battered (sloped) faces and coping.
- **Surfaces & materials:** glossy glazed roof tiles (green, orange), red-lacquered timber columns, grey stone, gold ornaments, turquoise water.
- **Objects:** pagodas, gate pavilion, humpback wooden bridge, piers/jetties, junk ship with battened sails, lighthouse towers with orange banner streamers, golden autumn trees, cliffs, waterfalls, stone stair, buoys/lantern floats in water, stone lantern posts.
- **Lighting/FX details:** bright day; glossy reflections on water; mist on cliff.
- **Build components:**
  - Gate pavilion with gold ridge medallion — Blender mesh + gold PBR — castle inner gate variant.
  - Glazed barrel-tile roof — normal map + tile-row mesh strip — tower roofs.
  - Humpback bridge with railings — Blender mesh — moat crossing.
  - Banner streamers from tower top — cloth sim / vertex shader sway — castle towers.
  - Circular stone medallion paving — decal + normal map — plaza in front of gate.
  - Water float lantern — mesh + emissive — moat.

### U08
- **Patterns:** organic tree-house platforms with radial ribs underneath (fan-like strut pattern) (crop U08a); hanging rope/liana loops; glowing magenta lily-pad or flower carpet on water (stippled pink); purple crystals.
- **Carvings & relief:** curved wooden/metal struts bracing mushroom-shaped platforms (fully 3D); domed pod roofs.
- **Edges & profiles:** saucer platforms with rolled rims; curved organic arch braces; rope bridges sagging catenary.
- **Surfaces & materials:** pink-red sandstone pillars, mossy, dark wood platform, glowing magenta water plants, purple glossy crystal.
- **Objects:** rock pillars, saucer platforms with domed pods, rope bridges, broadleaf jungle trees, vines/lianas, grass tufts, purple crystal cluster, glowing water, big moon/planet in sky.
- **Lighting/FX details:** large pale moon disc in sky; cyan-white rim glow along waterline; magenta emissive water flora; particle sparkles.
- **Build components:**
  - Saucer tree platform with radial struts & dome pod — Blender mesh — Glowwood treetop walkway nodes.
  - Rope bridge (catenary) — Blender curve mesh — Glowwood connections.
  - Glow lily carpet — instanced cards + emissive shader — Glowwood pools.
  - Purple crystal cluster — mesh + glass/emissive shader — Glowwood floor.
  - Giant moon backdrop — skybox sprite + bloom — night sky.

### U09
- **Patterns:** wooden lattice shoji screens (square grid kumiko) on shrine walls (crop U09a); green ceramic shingle roof (fish-scale-ish rows); stone flagstone steps (irregular crazy paving); split-rail fence.
- **Carvings & relief:** torii gate (two-crossbeam, fully 3D); stone lanterns (tōrō, stacked: base, shaft, firebox, cap) (fully 3D); small shrine with rope (shimenawa) and paper hanging lanterns.
- **Edges & profiles:** torii lintel with slightly upturned ends; shrine roof with flared eaves; stone steps with bevelled worn edges.
- **Surfaces & materials:** dark stained wood, teal glazed shingles, grey granite, paper (warm), red lacquer pot, iron cart wheel rims.
- **Objects:** torii gate, wooden shrine/stall on cart wheels, stone lanterns, hanging paper lanterns (cylindrical, warm), gourd lanterns on posts, wooden barrels/tubs, red ceramic jar, wooden ladder, split-rail fences, flagstone stair, sakura trees, pines, red maple, bamboo, bushes, white wildflowers, cliffs, river.
- **Lighting/FX details:** warm lantern glows (subtle in daylight), soft haze between cliffs.
- **Build components:**
  - Stone tōrō lantern — Blender mesh + emissive firebox — garden paths / bridge ends.
  - Lattice screen panel (kumiko grid) — Blender mesh or alpha-masked shader with backlight — pavilion walls (glow at night).
  - Hanging paper lantern string — mesh + emissive + sway shader — courtyard, ring walkways.
  - Torii-style gateway (re-styled as fantasy archway) — Blender mesh — Glowwood entrance.
  - Flagstone stair kit — mesh — garden slopes.
  - Cart-shrine stall — Blender mesh — market corner.

### U10
- **Patterns:** hanging paper scrolls with glyphic sigils (crop U10a: spirals, triangles, hatch marks — rune-like); chunky low-poly planking; perforated hex/circle-hole grate panels (orange, rows of circular holes) on floor right.
- **Carvings & relief:** large angular gate/arch head with stepped teeth (fully 3D, stylised); none classical.
- **Edges & profiles:** blocky chamfered low-poly edges; curved pipe arch; stair nosings orange.
- **Surfaces & materials:** wet reflective deck (mirror puddle), rusted orange metal, dark timber, parchment scrolls, cyan emissive tech panels on robot.
- **Objects:** scroll rack with hanging scrolls, workbench/forge machine, metal bowl, torn cloth ribbons/banners hanging from beams (teal, orange), curved pipe arch, perforated floor plates, crates, stairs, figures (skip).
- **Lighting/FX details:** dusk pink-violet sky, warm backlight through gate, cyan emissive dots, glossy wet-floor reflections.
- **Build components:**
  - Rune scroll rack — Blender mesh + decal glyph textures (emissive faint at night) — wizard library / tower study.
  - Wet-stone reflective floor — shader (roughness puddle mask + SSR/planar) — courtyard after-rain look.
  - Hanging ribbon streamers — cloth/vertex sway — ballroom rafters.
  - Perforated circle-grate floor plate — normal map/alpha — bridge deck vents.

### U11
- **Patterns:** collage of 8 game screenshots ("Color & Lighting" comparison). Usable patterns: posterised/cel-banded colour steps on grass and clouds (toon quantisation); in the bottom-left panel a circular fountain basin (crop U11a) whose rim carries a carved interlaced knotwork band (Celtic-knot-like linear strapwork) with 6 drop/teardrop-shaped bollards each holding a dome stud; concentric ring steps inside the basin; crazy-paving flagstones around it.
- **Carvings & relief:** fountain rim knotwork band (shallow relief, ~1 cm, engraved lines); teardrop bollard caps with hemispherical boss (fully 3D); central leaf-/petal-shaped crystal finial on a tiered pedestal (fully 3D). Wooden trailhead notice-board with a carved name plank (shallow relief lettering) in the middle-right panel. Distant fairy-tale castle with spires in the Zelda panel (crop not needed; tiny).
- **Edges & profiles:** fountain rim rounded bullnose with violet glowing outline; stepped concentric basin tiers; notice board with chamfered posts and gabled header plank; low-poly faceted rocks.
- **Surfaces & materials:** blue-grey polished stone fountain, teal water with lily pads, glowing blue/purple crystals in basin, cracked dark ground, golden-hour grass, painterly posterised skies.
- **Objects:** circular crystal fountain with bollards, crystal clusters (blue, violet), lily pads, trailhead notice board with pinned papers, pines/firs, birch, tall grass, bare dead trees, white flowering bushes, wooden scaffold/watchtower (Zelda panel), distant castle, rocks, deer-like figure (skip).
- **Lighting/FX details:** violet emissive halo outline around fountain basin; golden hour volumetric warmth; cool teal shade; posterised banded lighting look.
- **Build components:**
  - Knotwork-rim crystal fountain with teardrop bollards — Blender mesh + knotwork normal map + emissive crystal — castle courtyard centrepiece / ring-walkway plazas.
  - Basin rim glow outline — shader (fresnel/edge emissive, violet) — magical fountains and pools.
  - Wooden notice board with gabled header — Blender mesh + paper decals — Glowwood trailhead / village signage.
  - Toon colour-band grading — post-process shader (posterise LUT) — global art direction option.
  - Crystal cluster in water — mesh + glass/emissive shader — fountain and pond fill.

### U12
- **Patterns:** 3-panel screenshot collage; giant slanted rock blades/monoliths rising diagonally (repeated wedge shapes); spiky shell ridges on a creature (skip).
- **Carvings & relief:** none architectural visible; distant ruins/village silhouettes on left.
- **Edges & profiles:** long slanted wedge rocks with sharp leading edges; hazy layered silhouettes.
- **Surfaces & materials:** grey slate rock, golden dry dirt, sunlit grass; dust-burst FX.
- **Objects:** slanted rock monoliths, giant tree silhouette in fog, wood/rubble pile (resource heap), stone tablets/HUD, bushes, trees, figures.
- **Lighting/FX details:** heavy aerial fog and god-ray haze in top panel; yellow impact sparks/star-burst lines in middle panel.
- **Build components:**
  - Slanted monolith blade rock — Blender mesh + strata normal map — distant skyline / island edges.
  - Height fog bank — shader (exponential height fog) — valleys below castle at night.
  - Star-burst spark FX — particle (additive streak sprites, gold) — magic interactions / fireworks.

### U13
- **Patterns:** wildflower stipple in meadow (white clover-puffs, yellow dandelions, blue cornflowers); distant tree rows; layered rock mesas.
- **Carvings & relief:** a fully 3D wooden stable/tent with a red-and-cream striped canopy dome and a giant carved horse-head figurehead on top (crop U13a) — painted carved wooden head (fully 3D sculpture; for us: abstract heraldic head/no eyes); dark stone monolith shard at left (fully 3D).
- **Edges & profiles:** striped canopy with scalloped valance edge; soft rolling hills.
- **Surfaces & materials:** painted wood (red, orange, cream), striped canvas, saturated grass, grey rock.
- **Objects:** striped-canopy pavilion with carved head totem, black stone obelisk shard, round deciduous trees, lake, wooden bridge (far right), mountains, flowers, figure.
- **Lighting/FX details:** clear day; minor sky haze.
- **Build components:**
  - Striped canopy pavilion with scalloped valance — Blender mesh + cloth — birthday fairground / courtyard party tent.
  - Carved wooden totem topper (abstract, faceless) — Blender mesh — pavilion crown / gate marker.
  - Wildflower meadow scatter — instanced cards — castle lawns.
  - Black monolith shard — mesh + glossy obsidian shader — Glowwood waymarker.

### U14
- **Patterns:** same scene as U02 (wider crop). Coursed rubble and squared ashlar masonry; stepped terraces; vine curtains; flower drifts.
- **Carvings & relief:** crop U14a shows weathered statues in niches/on cliff tops (heavily eroded seated/standing figures, fully 3D — ours must be veiled/faceless), stepped pyramid-like ruined terraces, a stone bench/altar slab on two supports (post-and-lintel), lintel doorways. Bell tower with domed cupola and finials (as U02).
- **Edges & profiles:** post-and-lintel openings; crumbled parapet tops; square pier blocks with simple caps.
- **Surfaces & materials:** greenish weathered stone, moss/lichen, matte; lush grass.
- **Objects:** eroded statues, ruined terraces, stone slab tables/altars, bell tower, stone steps, orange flowering shrubs, yellow flowers, ferns, broadleaf trees, birds (figures), stream.
- **Lighting/FX details:** bright daylight, slight bloom.
- **Build components:**
  - Veiled eroded statue in niche — Blender sculpt (faceless, veil drape) + weathering normal map — Glowwood ruins / castle garden niches.
  - Post-and-lintel stone altar/bench — Blender mesh — garden seating.
  - Stepped ruined terrace kit — Blender mesh + moss shader — overgrown outer ward.
  - Cupola bell tower — Blender mesh — ruin landmark.

### U15
- **Patterns:** slanted rock blades repeated across horizon; dirt path ribbons through grass.
- **Carvings & relief:** none; distant wooden structures/bases.
- **Edges & profiles:** wedge rock monoliths; volcanic peak with glowing lava streaks (left).
- **Surfaces & materials:** grass, rock, lava emissive veins, sea.
- **Objects:** slanted rock blades, volcano with lava rivulets, giant tree silhouette (background), trees, boulders, dirt paths, coastline, figure riding mount, spear.
- **Lighting/FX details:** lava glow, atmospheric haze.
- **Build components:**
  - Emissive vein rock (lava→ magical blue for us) — shader (emissive mask in cracks) — Glowwood crystal cliffs.
  - Winding dirt path decal — decal/terrain splat — paths to castle.
  - Wedge monolith rocks — Blender mesh — skyline.

### U16
- **Patterns:** wooden split-rail fence (post and two rails) repeating; picket fence (white) left; clapboard siding on farmhouse.
- **Carvings & relief:** none.
- **Edges & profiles:** leaning utility pole (off-theme); clapboard lap edges.
- **Surfaces & materials:** red dirt, painted wood, rusted orange machinery (off-theme), lush grass, pink feathery flower spikes (celosia/astilbe-like).
- **Objects:** farmhouse, split-rail fence, white picket fence, tractors (off-theme), boulder, oak trees, pines, pink plume flowers, tall grasses, hay.
- **Lighting/FX details:** dramatic sunset backlight with violet clouds, long shadows, rim-lit grass.
- **Build components:**
  - Pink plume flower (astilbe-type) — instanced card mesh, emissive tips at night — Glowwood borders.
  - Split-rail fence — Blender mesh — meadow paths.
  - Sunset violet/peach sky gradient — skybox shader — dusk state before night.

### U17
- **Patterns:** half-timbering on cottage (dark timber frame over pink-white plaster, crop U17a); rope-lashed fence joints (figure-8 rope wraps at rail-post junctions, crop U17b); scattered leaf litter; pebble gravel.
- **Carvings & relief:** cottage door with round ring knocker/emblem (shallow relief); round-arched window with arched mullion; oculus/half-round vent in gable (shallow).
- **Edges & profiles:** steep gable with deep bargeboard and ridge cap; round-top arched window and door; rails with round section.
- **Surfaces & materials:** dark stained timber, plaster, gravel path, autumn leaves (orange/red) carpeting ground; matte.
- **Objects:** half-timbered cottage, rope-lashed rail fence, autumn maples/oaks (orange-red), firs, yellow flower beds, pink lupin-like flower spikes, leaf litter, distant chalet, fallen branches.
- **Lighting/FX details:** intense golden sunset glow, sun shafts through canopy, backlit translucent leaves.
- **Build components:**
  - Half-timbered cottage wall kit — Blender mesh + plaster/timber material — castle village/servant cottages.
  - Rope-lashed rail fence — Blender mesh (rope wrap detail) — Glowwood paths.
  - Arched window with radial muntins — Blender mesh — cottages and tower rooms.
  - Leaf-litter ground — decal/terrain texture — autumn garden.
  - Translucent leaf canopy — shader (subsurface/transmission) — trees around castle.

### U18
- **Patterns:** pink blossom tree canopies in a row along a road; wild grass.
- **Carvings & relief:** none.
- **Edges & profiles:** soft rounded canopy silhouettes.
- **Surfaces & materials:** pink foliage, asphalt road (off-theme), grass.
- **Objects:** pink cherry-blossom trees, road, mossy boulder, distant village houses, figure.
- **Lighting/FX details:** soft dusk pink light; low-res image.
- **Build components:**
  - Pink blossom avenue trees — instanced mesh + card canopy — tree-lined approach road to castle.
  - Blossom petal fall — particle — avenue.

### U19
- **Patterns:** wind-swept tall golden grass blades (dense, directional); layered mesas.
- **Carvings & relief:** none.
- **Edges & profiles:** mesa cliffs with vertical striations; rolling hill silhouettes.
- **Surfaces & materials:** dry golden grass, red-brown earth, grey rock; matte.
- **Objects:** baobab-like thick-trunk trees, small round trees, sparse windswept tree, hills, cliffs, round shield (spiral-ringed metal design), figures.
- **Lighting/FX details:** low sun with strong orange bloom, dust drifting across ground, atmospheric haze.
- **Build components:**
  - Wind-swept grass field — instanced blades + wind vertex shader — meadows.
  - Baobab-style fat trunk tree — Blender mesh — Glowwood edge.
  - Ground dust drift — particle/fog sheet — open fields at dusk.

### U20
- **Patterns:** mossy stacked stone blocks (rough ashlar) behind trees; golden leaf canopy clusters.
- **Carvings & relief:** none; ancient stone terrace walls (rough).
- **Edges & profiles:** soft rounded block edges with moss caps; massive smooth tree trunks with buttress roots.
- **Surfaces & materials:** pale grey-white bark with green moss patches, golden foliage, mossy stone.
- **Objects:** large pale-barked trees (ginkgo/aspen-like gold foliage), stone terrace blocks, blue flowers (gentian/delphinium-like), golden grass, construct figure (skip).
- **Lighting/FX details:** floating white sparkle motes in air, dappled sunlight, bright bloom.
- **Build components:**
  - Pale-bark gold-canopy tree — Blender mesh + bark normal map + gold card canopy — Glowwood (emissive gold at night).
  - Floating sparkle motes — particle — forests.
  - Moss-capped block wall — mesh + moss shader — terraces.
  - Blue gentian flowers — instanced cards — garden beds.

### U21
- **Patterns:** coursed square stone blocks with vine curtains (right ruins); floating island underside of layered rock strata.
- **Carvings & relief:** distant ruined gateway/colonnade with lintel (crop U21a — post-and-lintel portal silhouettes); large cylindrical drum column segments (right).
- **Edges & profiles:** blocky ruined parapets; floating islands with jagged hanging undersides and flat grassy tops.
- **Surfaces & materials:** sunlit sandstone, golden grass, golden-leaf trees.
- **Objects:** floating sky islands with ruins, ruined walls, column drums, gateway, golden trees, ivy, figure with shield.
- **Lighting/FX details:** strong backlight sun, volumetric glow, warm haze, clouds lit from behind.
- **Build components:**
  - Floating island with hanging strata underside — Blender mesh — sky around castle.
  - Ruined colonnade portal — Blender mesh — floating islands / Glowwood gate.
  - Back-lit cloud billboards — shader (silver-lining rim) — skybox.

### U22
- **Patterns:** stacked tiered jade-green device totems (crop U22a/U22b) with stepped rings, horizontal bands, a glowing cyan vertical light-strip core; chain/cable segments in green-glow beads; massive floating rock bottom with square-block masonry.
- **Carvings & relief:** totem pillars with stepped bell-shaped tiers and a spiral/swirl emblem disc (fully 3D, shallow engraved swirl); one construct has an eye (skip — use a plain glowing gem instead).
- **Edges & profiles:** stepped tiered silhouettes (pagoda-like rings); square-block floating fortress underside.
- **Surfaces & materials:** verdigris jade-green stone/metal, emissive teal light seams, white grey boulder, golden grass, gold-leaf trees.
- **Objects:** jade tiered beacon totem, glowing chain links, floating fortress, boulder, golden trees, stone blocks, figure.
- **Lighting/FX details:** emissive teal seam glow, bright day.
- **Build components:**
  - Jade tiered beacon pillar with emissive core — Blender mesh + emissive seams — ring walkway waypoint lamps.
  - Glowing chain links — mesh array + emissive — bridge railings / gate chains.
  - Swirl emblem disc — normal map/decal — pillar faces.

### U23
- **Patterns:** barding/saddle cloth on a mount (crop U23a) — segmented overlapping armour plates (lamellar scale rows) along the neck with light edge piping; zig-zag/triangle geometric border motif on dark cloth (chevron/sawtooth band); stitched leather saddle panels.
- **Carvings & relief:** distant dark fortress (crop U23b) — central spire with clustered pinnacles and stepped curtain walls, red glowing malice smoke; tall thin spire towers.
- **Edges & profiles:** plate segments with bright white edge piping (catches light like gold/silver trim); pointed spire silhouette.
- **Surfaces & materials:** dark green-black lacquer with pale metal edging, leather, wind-swept lime grass.
- **Objects:** armoured saddle and bridle (tack with rings and buckles), fortress, distant village, trees, figure.
- **Lighting/FX details:** dust clouds drifting across plain; red glow at castle base.
- **Build components:**
  - Lamellar scale-plate trim with silver edge piping — Blender mesh/normal map — castle door armour straps, gate panels.
  - Sawtooth/chevron border band — decal/texture — banners & tapestries.
  - Clustered pinnacle spire crown — Blender mesh — central castle keep top.
  - Dust drift — particle — plains.

### U24
- **Patterns:** carved spiral/scroll relief on a moss-covered mound/pedestal (crop U24a — swirling curls like acanthus/whorl motifs); stone wheel shapes.
- **Carvings & relief:** goddess-type statue on top of mound (fully 3D, worn; ours faceless/veiled); swirl carvings around plinth (deep relief); arched stone ruin (far right).
- **Edges & profiles:** rounded organic plinth with deep curls; ruined arch.
- **Surfaces & materials:** moss-covered grey stone, weathered; grass; green lens glow.
- **Objects:** shrine statue on carved mound, stone pillar stump (left), ruined arch, tree, horse with saddle (figure), fallen leaves, mountains.
- **Lighting/FX details:** green sacred glow/lens flare at statue.
- **Build components:**
  - Veiled statue on swirl-carved plinth — Blender sculpt + moss shader — Glowwood shrine / castle garden.
  - Whorl/scroll relief normal map — normal map — plinths, fountain bases.
  - Shrine aura glow — sprite/bloom — statue.

### U25
- **Patterns:** cattail/bulrush clusters repeated in marsh; ripple patterns on shallow water.
- **Carvings & relief:** none; distant castle with spire silhouette (right).
- **Edges & profiles:** rocky cliff with white-streaked faces; lone trees.
- **Surfaces & materials:** reflective shallow marsh water, grass, cliff.
- **Objects:** cattails, reeds, marsh pools, acacia-like trees, cliff, distant castle, figure on mount.
- **Lighting/FX details:** golden sunset reflections on water, sun glints/sparkles, warm haze.
- **Build components:**
  - Cattail reed clump — instanced mesh — moat edges.
  - Marsh water with sun glints — shader (planar reflection + sparkle) — moat / lakes.
  - Distant castle silhouette — billboard — skyline LOD.

### U26
- **Patterns:** red-and-white horizontal spiral stripes on a lighthouse tower (crop U26a); cracked plaster crackle; layered sandstone strata.
- **Carvings & relief:** lighthouse lantern room with domed red cap and spike finial, railed gallery balcony on corbelled ring (fully 3D); small square glowing windows; tower set on root-like legs.
- **Edges & profiles:** bulging, bent organic tower silhouette; corbelled gallery ring; domed cap with finial.
- **Surfaces & materials:** painted cracked plaster, red metal dome, glass lantern, orange sandstone, twisted dark wood.
- **Objects:** striped lighthouse, giant twisted tree arch, orange-canopy trees (stylised umbrella), skeletal bone remains (skip), sandstone rocks, snowy mountain, bird figure.
- **Lighting/FX details:** strong purple-blue atmospheric haze vs warm orange foreground; glowing warm windows; pink/magenta sky.
- **Build components:**
  - Crooked striped lighthouse tower with balcony gallery — Blender mesh — castle harbour / lake beacon.
  - Warm window glow cards — emissive material — tower windows.
  - Purple-to-orange atmospheric grade — fog/post shader — dusk mood.
  - Twisted arching tree — Blender mesh — Glowwood archway.

### U27
- **Patterns:** dark tech obelisk (crop U27a) with stacked rectangular slabs, glowing cyan zigzag glyph and concentric circle emblem; geometric zigzag/stepped key pattern on creature saddle (tribal fret, skip creature); red trees in rows.
- **Carvings & relief:** monolith tower with layered slab silhouette (fully 3D), emissive engraved glyph (shallow relief); dark gothic spire tower far left.
- **Edges & profiles:** stepped, broken vertical slab silhouettes; slanted rock blades; terraced grassy mesas.
- **Surfaces & materials:** dark slate/basalt with cyan emissive inlay, grass, snow, water.
- **Objects:** glyph obelisk tower, ruined gothic tower, red-leaf trees, slanted rock blades, mesas, waterfall, river, giant tree silhouette, flying mounts (figures).
- **Lighting/FX details:** cyan emissive glyphs, frosty breath-mist cloud, aerial haze.
- **Build components:**
  - Rune obelisk with emissive glyph inlay — Blender mesh + emissive mask — Glowwood waypoint / castle gate markers.
  - Stepped fret border (Greek-key variant) — decal — banners, floor inlays.
  - Red-leaf tree row — instanced mesh — distant forest colour accent.

### U28
- **Patterns:** pale lattice tower (crop U28a) with stacked rectangular elements and light beam; ruined square keep with crenellations (crop U28b); stone ring arch in water.
- **Carvings & relief:** ruined keep with merlons and arched window slots (fully 3D); stone ring/portal in lake (fully 3D); scattered standing stones.
- **Edges & profiles:** rectangular merlons (broken), arrow-slit windows; slim tapered tower with flared base.
- **Surfaces & materials:** grey stone, white sand beach, turquoise water, pink-purple blossom tree.
- **Objects:** beacon tower with light beam, ruined keep, stone ring portal, standing stones, purple blossom tree, natural rock arch bridge, river, conifers, mountains, flying mounts (figures).
- **Lighting/FX details:** vertical green light beam from tower, lens flare starburst, rainbow halo arc, sparkle/pixel particles.
- **Build components:**
  - Beacon light pillar — shader (additive vertical beam + flare) — castle tallest spire at night.
  - Stone ring portal in water — Blender mesh + emissive inner rim — lake/Glowwood gateway.
  - Ruined crenellated keep — Blender mesh — outer island ruin.
  - Rainbow halo arc — sprite — sky FX.
  - Violet blossom tree — mesh + emissive-tinted canopy — island accents.

### U29
- **Patterns:** red-and-white spiral stripe bands on crooked lighthouse (same family as U26); flowing pale root ribbons cascading down a giant tree-arch (vertical braided root "drapery"); stacked layered sandstone slabs; jade-green cactus/crystal spikes in rows on the left hill; spiral-coiled shrub mounds (dark green curled foliage, like rolled acanthus clumps).
- **Carvings & relief:** whimsical curling sculptural plant-tree with hanging red fruit/lantern bauble (crop U29a — fully 3D spiral S-curve trunk); small carved stone mushroom-shaped bollards/lantern caps on a mossy dome rock; layered slab altar of red sandstone; giant pale rib-like arching bones (skip as bones — reinterpret as white arching driftwood/roots).
- **Edges & profiles:** soft rounded mossy dome boulders; lighthouse with corbelled railed gallery and conical red cap; the tree-arch is a huge natural archway with root-buttress feet; stepping stones flush in grass.
- **Surfaces & materials:** moss, warm pink-red bark with white root veins, red sandstone, jade-green translucent spikes, painted plaster, grass with scattered red flower dots.
- **Objects:** striped lighthouse tower, giant root arch tree, curled S-trunk sapling with red bauble, layered stone altar, mossy dome rocks, mushroom-cap stone lanterns, spiral shrubs, jade spike plants, red flowers, stepping-stone path, pebbles, distant windmill-flower towers, rock mesas, pink spiral shells (lower right).
- **Lighting/FX details:** strong turquoise atmospheric haze, warm sun patches, soft bloom.
- **Build components:**
  - Root-drapery giant arch tree — Blender mesh + root normal map — Glowwood main entrance arch.
  - Curl-trunk sapling with hanging glowing bauble — Blender curve mesh + emissive orb — Glowwood path lights.
  - Mushroom-cap stone bollard lantern — Blender mesh + emissive under-cap — garden paths.
  - Jade crystal spike cluster — mesh + translucent shader — hillside accents.
  - Spiral shrub mound — mesh — garden beds.
  - Turquoise height fog — shader — Glowwood ambience.

### U30
- **Patterns:** jagged stacked rock pinnacles; drifting snowflake/ash particles; distant ruin silhouettes with broken vertical towers (crop U30a).
- **Carvings & relief:** distant ruined fortress/city with broken towers (fully 3D silhouette); a tall carved pole/totem with banner and hanging trinkets on rock outcrop (crop U30a — fully 3D).
- **Edges & profiles:** sharp crag spires; ruined jagged skyline.
- **Surfaces & materials:** frost-dusted granite, dry orange scrub, snow patches.
- **Objects:** rock spires, totem banner pole, snowy conifers, ruins on ridge, mountain ranges, figure.
- **Lighting/FX details:** pink-orange sunset sky with backlit clouds, valley fog layers, drifting snow motes catching light.
- **Build components:**
  - Banner totem pole with hanging charms — Blender mesh + cloth — path markers outside castle.
  - Drifting snow/petal motes — particle — winter/celebration variant.
  - Layered valley fog — shader planes — moat valley at night.

### U31
- **Patterns:** stylised tribal fret/maze engraving on a weapon panel (crop U31a — maroon interlocked labyrinth/key pattern on white enamel); striped woven bands (red/blue/cream) on textile; circular stamped rosette/medallion embossing on fabric (lower right); radial disc dish caps on giant towers.
- **Carvings & relief:** layered segmented spine tower with radial antenna fins and a saucer-disc head (fully 3D); weapon with enamelled engraved plate (shallow relief).
- **Edges & profiles:** saucer disc with bevelled lip; stacked vertebra-like plates; tilted red sandstone slabs.
- **Surfaces & materials:** white enamel with maroon inlay, weathered metal, leather, woven fabric, red sandstone, golden grass.
- **Objects:** saucer-headed spine towers, red rock slab outcrops, autumn trees, firs, bird flocks, mechanical creatures (skip), bow.
- **Lighting/FX details:** warm sunset backlight, haze, bird flock silhouettes.
- **Build components:**
  - Labyrinth fret inlay panel (maroon on white) — decal/normal map — castle door panels, floor borders.
  - Saucer-disc tower crown with radial fins — Blender mesh — observatory tower top.
  - Embossed rosette medallion — normal map — tapestry & leather props.
  - Bird flock silhouettes — particle (boids) — sky.

### U32
- **Patterns:** forested ruins in layered fog; patterned metal deck plates (geometric inset panels) on foreground dome.
- **Carvings & relief:** tall pointed steeple/spire overgrown with vines (crop U32a — Gothic steeple with octagonal spire, fully 3D); ruined towers.
- **Edges & profiles:** needle spire silhouette; jagged mountain ridges; curved dome rim with recessed seams.
- **Surfaces & materials:** dark stone overgrown with ivy, worn white metal dome with orange markings.
- **Objects:** overgrown steeple, ruined buildings, forest, mountains, water tower silhouette, figure.
- **Lighting/FX details:** pink-violet dusk sky, strong layered pink mist between trees (aerial perspective), rim light.
- **Build components:**
  - Ivy-wrapped Gothic needle spire — Blender mesh + ivy cards — castle chapel spire.
  - Pink-violet layered mist — shader fog planes — Glowwood valleys at dusk.
  - Recessed panel seam metal — normal map — airship/observatory dome.

### U33
- **Patterns:** settlement of domed tiered roundhouses with ribbed roof panels (radial rib pattern) (crop U33a); log palisade walls (vertical posts); timber crane/trestle frames with cross-bracing; layered red sandstone ledges.
- **Carvings & relief:** wooden trestle drawbridge/crane with A-frame struts and winch wheel (crop U33b, fully 3D); domed great hall with stepped tiers and spire finial; ruined stone tower.
- **Edges & profiles:** low saucer domes with stepped tiers and lantern finial; cross-braced trestles; stone arch bridge parts.
- **Surfaces & materials:** golden reflective metal/thatch domes, weathered timber, river water, red sandstone, autumn foliage (orange/red).
- **Objects:** domed roundhouses, great hall with spire, palisades, timber bridge with winch and cranes, river, ruined tower, autumn trees, cliffs, rope coil, figure.
- **Lighting/FX details:** god rays through valley haze, rising smoke columns, warm glints on domes.
- **Build components:**
  - Tiered saucer dome roof with radial ribs & lantern finial — Blender mesh — ballroom dome / gatehouse cupolas.
  - Timber trestle bridge with winch wheel — Blender mesh — moat drawbridge mechanism.
  - Cross-braced timber crane — Blender mesh — harbour/build-site prop.
  - Valley god-ray haze — volumetric/billboard shafts — castle approach.

### U34
- **Patterns:** rusted lattice girders (truss crossbars) overgrown; water lilies on still water; reed grass.
- **Carvings & relief:** none carved; collapsed truss arch skeleton (fully 3D).
- **Edges & profiles:** arching rusted truss silhouettes; moss-capped broken beams.
- **Surfaces & materials:** rust metal, moss, wet still water with reflections, decaying wood.
- **Objects:** overgrown girder arch, collapsed structures, water lilies with white flowers, reeds, ferns, broadleaf trees, wooden fences, figure with bow.
- **Lighting/FX details:** hazy morning backlight, mirror reflections.
- **Build components:**
  - Overgrown iron truss arch (re-themed as wrought iron) — Blender mesh + moss shader — Glowwood ruined gate.
  - Water lily pads with flowers — instanced mesh, emissive flowers at night — moat & ponds.
  - Still-water mirror — shader — ponds.

### U35
- **Patterns:** Joshua-tree spiky leaf clusters; barrel cactus with flower crowns; rounded boulder field.
- **Carvings & relief:** distant rearing tower/structure silhouette in desert (fully 3D).
- **Edges & profiles:** rounded granite boulders; spiky silhouettes.
- **Surfaces & materials:** granite, sand, pink cactus flowers.
- **Objects:** boulders, Joshua trees, cacti with pink blossoms, distant tower, dunes, figure.
- **Lighting/FX details:** low sun with vertical light pillar/streak, warm haze, sparkles on distant sands.
- **Build components:**
  - Granite boulder field — Blender mesh set — castle base rocks.
  - Pink-blossom cactus clump — mesh — succulent garden/greenhouse.
  - Sun pillar streak — sprite — sky FX.

### U36
- **Patterns:** overgrown arch ruins (crop U36a — sweeping concrete/stone arches wrapped in foliage, a viaduct/colonnade of repeated piers in background); palm fronds; lava flow ribbons.
- **Carvings & relief:** huge vine-wrapped arches (fully 3D); ruined colonnade (pier rhythm); scale/feather armour plates on costume (overlapping scallop plates — fish-scale motif).
- **Edges & profiles:** sweeping segmental arches; red-rock cliff with grass lip; lava channel edges.
- **Surfaces & materials:** moss-wrapped stone, red cliff earth, glowing molten lava, wet black rock.
- **Objects:** overgrown arches, colonnade ruins, palm trees, broadleaf jungle trees, ferns, yellow flowers, lava river, black rocks, figure.
- **Lighting/FX details:** lava emissive orange glow, floating embers/ash particles, misty distance.
- **Build components:**
  - Vine-wrapped sweeping arch — Blender mesh + ivy cards — Glowwood skyway arches.
  - Fish-scale overlapping plate pattern — normal map — tower roofs/armour door straps.
  - Emissive flowing channel (lava → glowing magic river for us) — shader (scrolling emissive) — moat magic stream.
  - Floating ember motes — particle — braziers.

### U37
- **Patterns:** 5-panel collage. Panel 4 (crop U37a): red spider-lily/poppy flower field (dense crimson carpet), torii gate silhouette on right. Panel 3: coastal town with rooftops (tiny). Others: modern suburban (off-theme), desert, canyon with sun shafts.
- **Carvings & relief:** torii gate (two-crossbeam, fully 3D); carved knotwork/rune breastplate on figure (panel 3 — shallow relief Norse knot).
- **Edges & profiles:** torii lintel with upswept ends.
- **Surfaces & materials:** red flower carpet, smoky skies, rock.
- **Objects:** torii gate, red flower field, trees, smoke column, coastal town, canyon, backpack figure, abandoned house & car (off-theme).
- **Lighting/FX details:** red/pink sunset haze, rising smoke plume, god rays in canyon panel.
- **Build components:**
  - Crimson flower field — instanced cards, faint emissive — Glowwood clearing.
  - Torii-style archway — Blender mesh — garden shrine entrance.
  - Canyon sun shafts — volumetric planes — gorges.

### U38
- **Patterns:** riveted rusted plate segments with spur gears, coil springs and concentric bolt-disc caps on a mechanical mount (crop U38a); blue umbel flowers (yarrow/Queen-Anne's-lace style flat-topped clusters, crop U38b); twisting serpentine tree trunk (helix spiral) in background.
- **Carvings & relief:** none stone; the mechanism shows concentric-ring discs (like rosette bosses) and toothed gear wheels (fully 3D).
- **Edges & profiles:** rolled plate edges with chipped paint catching light; red sandstone cliff blocks.
- **Surfaces & materials:** rusted iron with blue paint wear, brass bolts, red sandstone, pink blossom trees.
- **Objects:** mechanical mount with gears and springs, bedroll/pack, blue umbel flowers, pink blossom trees, helix-trunk giant tree, ruined concrete wall with stick fence, mountains.
- **Lighting/FX details:** bright sun, bloom, haze.
- **Build components:**
  - Gear-and-spring clockwork assembly — Blender mesh — clock tower interior / castle gate mechanism.
  - Concentric bolt-disc boss — normal map/mesh — gate studs, door hardware.
  - Blue umbel flower (emissive at night) — instanced cards — Glowwood ground cover.
  - Helix spiral tree — Blender mesh — Glowwood landmark.

### U39
- **Patterns:** polka-dot mushroom caps (white spots on blue and on orange-red, crop U39a); ivy curtains on cliff; columnar canyon walls.
- **Carvings & relief:** none.
- **Edges & profiles:** domed mushroom caps with frilled rims; stepped canyon ledges.
- **Surfaces & materials:** red sandstone, moss, glossy cap surfaces, waterfall.
- **Objects:** giant spotted mushrooms (blue, orange-red, small violet shelf mushroom), waterfall, canyon cliffs, broadleaf trees, ivy, ferns, figure.
- **Lighting/FX details:** dappled light, waterfall mist.
- **Build components:**
  - Giant spotted mushroom (blue/red variants, emissive spots) — Blender mesh + emissive dot mask — Glowwood platforms/lamps.
  - Shelf/bracket fungus on cliffs — mesh — cliff decoration.
  - Ivy curtain cliff — alpha cards — castle cliffs.

### U40
- **Patterns:** cobble/gravel-stippled dirt path; spiral-twisted giant tree trunk (helix coils).
- **Carvings & relief:** none.
- **Edges & profiles:** twisted serpentine silhouette.
- **Surfaces & materials:** grass, dirt, rusted containers (off-theme).
- **Objects:** helix-twisted mega tree, broadleaf trees, pylons and freight wagons (off-theme), bushes, figure.
- **Lighting/FX details:** sun flare, green lens glints.
- **Build components:**
  - Helix-twisted mega tree — Blender mesh — Glowwood centrepiece.
  - Gravel-stipple path — terrain texture — trails.

### U41
- **Patterns:** chunky polygonal fruit/bauble pods hanging in vines (crop U41a — golden faceted spheres with violet grape-like berry crowns); stick fence (wattle-like picket).
- **Carvings & relief:** none; thatched/plank hut on right with mossy roof.
- **Edges & profiles:** shaggy thatch edge; stumpy root-flared tree trunks.
- **Surfaces & materials:** rough planks, moss, dirt path with puddle, lush grass.
- **Objects:** glowing-looking golden fruit pods on vine, stick fence, hut, broad oaks, distant gazebo, figure.
- **Lighting/FX details:** warm sunset backlight, soft forest haze.
- **Build components:**
  - Hanging golden fruit-pod lantern with berry crown — Blender mesh + emissive — Glowwood vine lights.
  - Wattle stick fence — Blender mesh — garden/Glowwood.
  - Mossy plank hut — Blender mesh + moss shader — Glowwood dwellings.

### U42
- **Patterns:** plank boardwalk deck (staggered planks) with post-and-rail fence; cobble/brick path; reed and cattail clusters; timber village on stilts (crop U42b).
- **Carvings & relief:** wooden lamp post with two hooded cantilever arms each holding a hanging rectangular lantern (crop U42a, fully 3D); small shrine/obelisk with blue glowing orb on top (left, fully 3D); stilt village towers and arched footbridges.
- **Edges & profiles:** gabled lamp hoods (little roofs) over lanterns; arched footbridges; low stone walls.
- **Surfaces & materials:** weathered wood, golden glowing glass, clear stream water over pebbles, mossy stones.
- **Objects:** plank footbridge with railings, double-arm hooded lantern post, hanging box lanterns (warm yellow), blue orb shrine pillar, tree village with arched bridges and towers, giant redwood trees, pines, cattails, reeds, stream, stones, path.
- **Lighting/FX details:** warm yellow emissive lanterns, blue magical orb glow with sparkles, shallow caustic water, blue morning light.
- **Build components:**
  - Hooded double-arm lantern post — Blender mesh + emissive glass — ring walkways / bridge approaches.
  - Plank footbridge with post rail — Blender mesh modular — Glowwood streams.
  - Blue orb shrine pillar — Blender mesh + emissive orb + sparkle particles — waymarkers.
  - Arched stilt footbridge — Blender mesh — treetop village.
  - Clear pebble stream — shader (caustics, depth tint) — garden streams.

### U43
- **Patterns:** staggered plank decks on docks; pink-magenta columnar blossom trees (fastigiate, spire-shaped); woven wicker hull on boat (basketweave); cattails.
- **Carvings & relief:** none carved; small hip-roofed teahouse/cabin on stilts with railed stair (crop U43a).
- **Edges & profiles:** dock posts with chamfered tops; cabin hip roof with slight flare.
- **Surfaces & materials:** weathered wood, wicker, still blue water, granite boulders, green grass.
- **Objects:** wooden jetties/piers, wicker coracle/boat, wicker basket, cabin on stilts, pink columnar blossom trees, birches/deciduous trees, cattails, reeds, boulders, red flower shrubs, mountain, huge pale moon/planet disc in sky, robed figure.
- **Lighting/FX details:** large translucent moon disc in daylight sky, sun flare, sparkling water.
- **Build components:**
  - Wicker coracle boat — Blender mesh + basketweave normal map — moat/lake boats.
  - Modular jetty kit — Blender mesh — castle lake.
  - Columnar pink blossom tree — mesh + card canopy — lakeshore.
  - Giant translucent moon disc — skybox layer — night sky.

### U44
- **Patterns:** stacked-stone/plank watermill walls; spoke-and-paddle waterwheel (radial spoke pattern) (crop U44a); grass blades; pink blossom accents.
- **Carvings & relief:** waterwheel (fully 3D); easel with painting.
- **Edges & profiles:** steep pitched mill roof; round-roof pavilion (gazebo with hipped curved roof) in background.
- **Surfaces & materials:** dark weathered timber, rough stone, flowing water, grass.
- **Objects:** watermill with waterwheel, painter's easel with canvas, gazebo pavilion, wooden post, reeds, pink and violet blossom trees, purple wildflowers, stream.
- **Lighting/FX details:** dappled sunlight through canopy, rippled water reflections.
- **Build components:**
  - Waterwheel mill — Blender mesh + rotation — castle stream mill.
  - Painter's easel prop — Blender mesh — artist's studio/ballroom side room.
  - Round gazebo pavilion — Blender mesh — garden.

### U45
- **Patterns:** tall conifer trunks in rhythm (colonnade of pines); moss carpet.
- **Carvings & relief:** none.
- **Edges & profiles:** stylised low-poly pine silhouettes.
- **Surfaces & materials:** mossy rocks, grass.
- **Objects:** tall pines, young firs, mossy boulders, small white flowers, shield-carrying figure.
- **Lighting/FX details:** strong volumetric sun shafts through pines with warm orange haze, bloom.
- **Build components:**
  - Pine colonnade forest — instanced mesh — forest edge beyond Glowwood.
  - Forest god-ray shafts — volumetric/billboards — forest clearings (moonlight version at night).
  - Moss carpet ground — terrain shader — forest floor.

### U46
- **Patterns:** No architectural pattern. Natural repeats only: pinnate fern fronds (bracken/sword-fern rosettes), pinnate rowan/sumac-like leaflet sprays on the overhanging branches, serrated oval-leaf clusters in foreground, dappled leaf-shadow (gobo) pattern across the path and boulders, moss patches on the tops of rocks (top-down moss mask).
- **Carvings & relief:** None. Natural only: rounded granite tors stacked into a balanced-boulder pile (a huge tilted capstone on smaller boulders), fissures between slabs; flat stepping-slab rocks in the stream bed.
- **Edges & profiles:** Rounded, eroded boulder silhouettes with soft bevelled edges catching rim light; flat-topped slab edges along the path; the large boulder has a hard sunlit top edge and darker under-face.
- **Surfaces & materials:** Weathered matte grey granite with lichen/moss on upward faces (green-yellow), damp darker bases; reddish bark conifer trunks (pine/cedar), packed earth path with leaf litter; a small reflective puddle/stream at bottom.
- **Objects:** Giant balanced boulder, boulder pile, stepping stones, flat slabs, conifer trunks (redwood-like reddish bark), broadleaf saplings (birch/beech-like), ferns (bracken), low shrubs, tall grass tufts, red poppy-like and pink small flowers, yellow broad-leaf ground plants, fallen leaves, small stream/puddle.
- **Lighting/FX details:** Warm golden afternoon sun from upper right; strong dappled canopy shadows; translucent backlit leaves glowing yellow-green; atmospheric haze/aerial perspective deep in the clearing; specular glint on water.
- **Build components:**
  - Mossy granite boulder kit (5–6 rounded rocks + one tilted capstone) — Blender mesh + tiling rock normal map + world-up moss blend shader — Glowwood edges, castle approach path.
  - Stepping-stone stream bed — Blender mesh slabs + wet/puddle roughness shader decal — Glowwood brook.
  - Fern rosette card cluster — alpha-cutout leaf cards (Blender) with translucency shader — Glowwood understorey.
  - Dappled canopy shadow — projected light cookie/gobo texture or shader — forest paths at night under moonlight.
  - Wildflower tuft (red/pink) — instanced cards — meadow borders around ring walkways.

### U47
- **Patterns:** Natural only: fluted, braided root buttresses on the left tree (twisted rope-like trunk strands); clumped cloud-shaped canopy masses; orange-fruited shrub repeats.
- **Carvings & relief:** In the distance: a huge natural rock arch / stone bridge spanning between peaks, topped by a small white tower/spire structure that emits a thin vertical light beam; snow/frost on the arch top; the arch underside has hanging icicle-like drips. Rocky cliff right side made of stacked rectangular columnar blocks (basalt-like). Tree roots read as deep natural relief.
- **Edges & profiles:** Arch silhouette = thick rounded natural arc with a secondary smaller arch beneath (double arch); jagged frost-crusted top edge; columnar cliff blocks with crisp right-angled edges catching warm light.
- **Surfaces & materials:** Pale limestone/marble rock with snow dusting; mossy grass; gnarled grey-brown bark; figure in ornate metal armour (not to be built).
- **Objects:** Ancient gnarled tree with twisted multi-strand trunk and exposed sinuous roots, broad tropical leaf plants, orange-flowered/fruited bushes, columnar rock ledges, rounded green hills, sea of clouds, distant rock-arch bridge, shrine/tower atop arch, light beam, figure (back view).
- **Lighting/FX details:** Golden low sun from left, volumetric cloud banks wrapping hills (sea of mist), thin vertical light pillar from the shrine on the arch, soft rim light on foliage.
- **Build components:**
  - Twisted-strand ancient tree trunk with root flare — Blender sculpt mesh + bark normal map — Glowwood elder tree / castle courtyard heart tree.
  - Natural double rock arch bridge — Blender mesh, snow/frost top-mask shader — distant skyline landmark beyond the castle.
  - Shrine spire light beam — additive cylinder shader with noise scroll — atop distant peak / castle top beacon.
  - Columnar basalt cliff blocks — Blender modular mesh — cliffs under castle mound.
  - Sea-of-clouds layer — layered alpha planes / volumetric noise shader — valley under floating castle.

### U48
- **Patterns:** Steel truss lattice (Warren/Pratt cross-bracing X-pattern) on a ruined bridge in the distance; repeating rectangular cutouts on overgrown tower ruins; palm frond silhouettes.
- **Carvings & relief:** Left foreground: a weathered stone pillar/wall block with a cap slab and stacked broken-stone lumps; a rusted iron A-frame / tripod sculpture on top. Distant tall overgrown tower ruins (two) with vines hanging, rib-like structural frames.
- **Edges & profiles:** Square pillar with a projecting cap (simple cornice slab), chipped corners; lattice truss arch bridge with parallel chord silhouette; tall ruin silhouettes with jagged broken tops.
- **Surfaces & materials:** Weathered mossy concrete/stone, rust-red metal, jungle foliage, misty water/waterfall pool below the bridge.
- **Objects:** Ruined truss bridge, two overgrown skeletal towers, stone pillar with metal tripod, broad tropical leaves (banana/strelitzia-like), small gnarled bonsai-shaped tree, palms, distant birds (silhouettes), figure (back view) with bow.
- **Lighting/FX details:** Bright daylight, haze/mist pooling over water beneath bridge, soft atmospheric perspective.
- **Build components:**
  - Overgrown ruin pillar with vine drape — Blender mesh + moss mask shader + hanging vine cards — ruined outer wall / Glowwood ruins.
  - Lattice-truss bridge railing (reinterpret in wrought iron, X-bracing) — Blender mesh — secondary footbridges.
  - Broad tropical leaf cluster — alpha cards with translucency — Glowwood greenhouse/grotto.
  - Mist pool under bridge — particle/fog plane shader — bridge undersides.

### U49
- **Patterns:** Thatched roof texture (combed straw strands) on cottages; picket/post-and-rail fence rhythm (red-painted timber, diagonal braces); plank boardwalk path (parallel transverse planks); dense red flower carpet (spider-lily field) in rows.
- **Carvings & relief:** Timber gable frames with exposed king-post and diagonal braces on the cottage front (red-painted beams); no carving otherwise. Thatch ridges thick and rounded (deep 3D).
- **Edges & profiles:** Steep gable roofs with thick rounded thatch eaves; projecting purlin ends; fence rails with square posts; boardwalk planks with soft worn edges.
- **Surfaces & materials:** Weathered straw thatch, red-lacquered/painted timber, mud path, mossy grass, grey rock mountain with snow patches.
- **Objects:** Thatched timber cottages (open-front with red frame), storehouse sheds, market stall awnings (white cloth), wooden fences, wooden plank walkways, scarecrows/yellow-clothed figures, red maple trees, yellow ginkgo-like trees, conifers, spider-lily flower field, tall dry grass, utility pole/drying pole, figures (one wearing a large conical straw hat).
- **Lighting/FX details:** Clear autumn daylight, warm sidelight, crisp shadows, slight haze toward mountains.
- **Build components:**
  - Red-timber post-and-rail fence with diagonal brace — Blender modular mesh — garden plots around ring walkways.
  - Plank boardwalk segment — Blender mesh + wood normal map — marsh paths in Glowwood.
  - Thatch roof shell — Blender mesh + straw strand normal map — village/servants' cottages outside castle walls.
  - Red spider-lily flower carpet — instanced cards with emissive tip option (night glow) — magical garden beds.
  - Red maple tree — Blender mesh + leaf cards — autumn grove.

### U50
- **Patterns:** Hundreds of paper lanterns in a scattered grid floating on water (lantern field); vertical board-and-batten / picket palisade fence; stacked tiled-roof tiers on the castle (Japanese pagoda-castle hip-and-gable, irimoya); hongawara tile ridges (fine horizontal ribbing).
- **Carvings & relief:** Castle tenshu with flared eaves, gable (chidori-hafu) triangular pediments, ridge-end ornaments (shachihoko silhouettes) at roof ridges; stone retaining wall of rounded boulders (rubble masonry). Right: temple pavilion with wooden balcony railing.
- **Edges & profiles:** Upturned flared eaves with curved hip ends; sharp palisade fence top line of pointed staves; rough rounded boulder retaining wall silhouette; rock-lined pond edge.
- **Surfaces & materials:** Dark wood, charcoal roof tiles, rough grey granite boulders, mirror-still water with pink reflections, paper (washi) lantern shades — warm glowing translucent.
- **Objects:** Floating paper lanterns (square tōrō, open-top boxes on dark bases), multi-tier castle keep, temple pavilion, palisade fence, pine (bonsai-shaped Japanese black pine), maples, boulder rockery pond, red war banners (nobori) along the wall, drifting red leaves/petals, grass, figure with bow.
- **Lighting/FX details:** Magenta-pink twilight sky with red streaking clouds, warm orange point lights from every lantern with reflections on water, red smoke/mist haze over the pond, floating red petals/embers, strong backlight.
- **Build components:**
  - Floating paper lantern (square box, washi shade, dark base) — Blender low-poly + emissive translucent shader, GPU-instanced with bobbing vertex shader — castle moat / reflecting pool on birthday night.
  - Lantern reflection streaks — screen-space or planar reflection + additive streak decal — moat water.
  - Rounded-boulder retaining wall — Blender mesh kit + normal map — moat and pond banks.
  - Pointed palisade fence — Blender instanced staves — outer garden boundary.
  - Drifting ember/petal particles (red) — particle system — courtyard ambience.

### U51
- **Patterns:** Stacked roof tiers; horizontal plaster bands between tiers; star field in sky; battered stone castle base (ishigaki) with large block coursing; white plaster wall walkways with dark wood trim.
- **Carvings & relief:** Five-storey castle keep with multiple flared eaves, chidori-hafu gables, shachihoko ridge ornaments; corner turret (yagura) on stilts at right; wall-top gatehouses.
- **Edges & profiles:** Curved concave battered stone wall (fan-slope), flared eaves with upturned corners, ridge lines catching moonlight; crenellation-free wall caps (tiled coping).
- **Surfaces & materials:** Weathered grey stone, white/grey plaster, dark timber, charcoal tiles; red maple foliage; snowy/frosted rock patches.
- **Objects:** Castle keep, curtain wall with roofed coping, gatehouses, watchtower on stilts, red maple trees, cliffs, smoke plume, figure with conical hat, bow, arrows, katana.
- **Lighting/FX details:** Deep blue starry night, cool moonlight, rising white smoke/mist, scattered stars as sparkles; red leaves pop against blue.
- **Build components:**
  - Battered (concave-sloped) castle base wall — Blender mesh + block normal map — castle mound foundation.
  - Roofed wall coping (tile cap on curtain wall) — Blender modular — outer walls.
  - Stilted corner watchtower — Blender mesh — wall corners.
  - Night star-field sky dome with twinkle — shader — global sky.
  - Rising mist plume — particle/billboard smoke — cliff edges.

### U52
- **Patterns:** Patchwork rice paddies (grid of rectangular fields with green/gold alternation, chequer-like); stacked white castle tiers; tiled roofs of town; cherry blossom canopy; repeated lamellar plates on armour (not built).
- **Carvings & relief:** White multi-tier castle (Himeji type) with many chidori-hafu triangular and karahafu curved (bell-shaped, cusped) gables, small rectangular and round windows; stone walls with gatehouses; pagodas (5-storey) on far hill; torii gate (red) in a meadow; watchtowers on wooden scaffold stilts on the right cliff; covered bridge.
- **Edges & profiles:** Karahafu (curved cusped gable) profile; flared eaves; battered stone bases; river banks with stone revetments; arched wooden bridge.
- **Surfaces & materials:** White plaster, grey tiles, dark timber, mossy rocks, river water, cherry blossom pink, wet stone with spray.
- **Objects:** Castle keep complex, curtain walls, pagodas, torii gate, rice paddies, village houses with tiled/thatched roofs, river with boats (small rowing boats), wooden docks/piers, watchtowers, stilted timber buildings, cherry trees, pine bonsai branch, waterfall cascade at bottom, cliff, falling cherry petals, two figures.
- **Lighting/FX details:** Bright day with large cumulus clouds, drifting pink petals across frame, rising mist from valley, light lightning flicker far right, sunlight shafts.
- **Build components:**
  - Karahafu cusped gable dormer — Blender mesh — castle roof dormers (reinterpret as gilt-edged).
  - Patchwork garden-plot grid — terrain splat shader — lowland beneath floating castle.
  - Torii-style ceremonial gate (reinterpret as fantasy gateway) — Blender mesh — path entrances.
  - Falling cherry petal particles — particle system with flutter — courtyard and Glowwood.
  - Stilted timber lookout — Blender mesh — cliff edges.
  - Pier/dock with moored boats — Blender mesh — river/moat.

### U53
- **Patterns:** Japanese stone lantern (tōrō) roof grid; gravel/petal-strewn path; arched bridge railing with rectangular lattice (koshi grid) panels; pagoda tier repetition (5 tiers) with flared eaves and sōrin spire rings (nine rings).
- **Carvings & relief:** Pagoda with bracket sets (tokyō) under eaves (deep 3D), sōrin finial with stacked rings; wooden lantern on post with lattice window; red taiko drum bridge with grid lattice parapet.
- **Edges & profiles:** Strongly upturned pagoda eaves; humped arch bridge curve (taiko-bashi); post lantern with pyramidal hip roof; rocks edging path.
- **Surfaces & materials:** Dark wood and tile pagoda; red lacquer bridge; wooden lantern weathered; petal-covered path; moss; gnarled cherry bark.
- **Objects:** Five-storey pagoda, red arched bridge with lattice railing, wooden post lantern (tōrō style), cherry trees in bloom, pine bonsai, azalea shrubs (clipped mounds), rock edging, petals, figure.
- **Lighting/FX details:** Warm sun flare behind pagoda, falling petals, soft haze, backlit blossom canopy.
- **Build components:**
  - Humped arched bridge with lattice parapet — Blender mesh — Glowwood stream bridge.
  - Post lantern with lattice light window — Blender mesh + emissive panel — garden paths.
  - Multi-tier pagoda with bracket sets and ring spire — Blender mesh — far skyline tower / garden folly.
  - Cherry blossom tree with petal fall — mesh + leaf cards + particles — courtyard.
  - Clipped azalea mounds — Blender mesh blobs + leaf normal — garden borders.

### U54
- **Patterns:** Red brick running bond on wall left; slate shingle (fish-scale-like) roofing on mansard domes; repeating tiled roofs of town; clock face numerals; ribbed dome segments.
- **Carvings & relief:** Foreground: heavy stone cornice with multiple fascia layers and a carved console/bracket; a cast-iron S-scroll bracket on the brick pier; balustrade top with diagonal lattice iron railing. Right: ribbed dome with lantern cupola and spike finial; turned finials (urn/bulb) on roof corners; clock tower with domed top and finial.
- **Edges & profiles:** Stepped cornice (fascia + cymatium), chamfered stone edges catching warm rim light; segmental ribbed dome; dormers with arched windows.
- **Surfaces & materials:** Grey dressed stone (matte, slightly weathered), red brick, dark slate roofs, wrought iron, aged copper/lead dome.
- **Objects:** Stone parapet ledge, iron scroll bracket, lattice railing, clock tower, ribbed domes with cupolas, finials, dormers, tiled roofs, autumn maples and cherry trees, distant volcano, chimney smoke, figure.
- **Lighting/FX details:** Warm sunset haze, golden backlit trees, atmospheric perspective, sun disc.
- **Build components:**
  - Ribbed dome with lantern cupola and spike finial — Blender mesh — corner turret roofs.
  - Stepped stone cornice with console bracket — Blender profile sweep — castle wall tops.
  - Iron S-scroll wall bracket (lantern hanger) — Blender curve mesh — castle gate lamps.
  - Clock tower with domed cap — Blender mesh — birthday countdown clock in town square.
  - Turned roof finial (bulb/urn) — Blender lathe — roof corners.

### U55
- **Patterns:** Lamellar armour plate rows (not built). Landscape: yellow-leaf tree bands along ridges, pink flower field, white flower meadow, conifers.
- **Carvings & relief:** None architectural; white limestone outcrops/tors with sharp facets atop a hill.
- **Edges & profiles:** Jagged white rock crowns; conifer spire silhouettes; long curved blade gleam.
- **Surfaces & materials:** White chalky limestone, green conifer, golden ginkgo-like foliage, pink and white flower carpets, polished metal blade.
- **Objects:** Limestone outcrop hill, golden-leaf trees, conifer forest, pink flower field, white flower field, distant pavilion, black smoke column, steam vent, figure with bow, sword.
- **Lighting/FX details:** Clear deep-blue sky gradient, strong specular sweep on blade, steam wisps.
- **Build components:**
  - White limestone tor cluster — Blender mesh + crisp normal — hilltop above Glowwood.
  - Golden-canopy tree band — leaf-card trees with emissive-tinted leaves at night — ridge lines.
  - Pink/white flower carpet — instanced grass/flower shader — meadows around the castle.
  - Specular sword-gleam sweep — shader highlight — reuse for gilded edges/metal rails catching moonlight.

### U56
- **Patterns:** Japanese silver grass (susuki/pampas) plume field — feathery white plumes repeating across the slope; woven straw conical hat (radial weave); conifer silhouettes; long grass blades bending in one wind direction.
- **Carvings & relief:** None. A long low wooden trestle footbridge with simple post-and-rail parapet over a river; a lone wooden lookout platform on posts; a gnarled bonsai-shaped pine on a rock spur.
- **Edges & profiles:** Feathery plume edges glowing with backlight (rim lit); flat bridge deck silhouette with vertical balusters; conifer spires against bright sky.
- **Surfaces & materials:** Silky translucent grass plumes, dark green grass blades with glossy specular, weathered wood bridge, grey rocky outcrops, river water.
- **Objects:** Silver-grass meadow, long grass, wooden trestle bridge, lookout tower on stilts, gnarled pine on cliff, conifer forest, river, distant smoke column, small birds, figure with conical hat, quiver of arrows, bow.
- **Lighting/FX details:** Low sunrise/sunset sun with bloom and lens glow, pink streak clouds, god-ray haze through pines, mist over the river, dust motes/floating seeds, strongly backlit translucent plumes.
- **Build components:**
  - Silver-grass plume field with wind sway — instanced alpha cards + vertex wind shader + translucency (moonlit silver at night) — slopes below the castle, Glowwood edge.
  - Long trestle footbridge — Blender modular mesh — river crossing on the approach.
  - Gnarled cliff pine — Blender mesh + needle cards — rock spurs around castle.
  - Low-sun god-ray haze — volumetric/shader light shafts — forest edges at dawn scene.
  - Floating seed/mote particles — particle system — meadows.

### U57
- **Patterns:** Silver-grass plume wall in mid-ground; dense green grass; woven straw hat weave; spoked wheel; conifer row on horizon.
- **Carvings & relief:** A wrecked wooden cart/cannon carriage at right: iron-banded wooden wheel (felloes with metal tyre bands), barrel-like drum, two long black iron tubes (cannon barrels / logs) lying on the ground.
- **Edges & profiles:** Rounded wheel rim with banded edges catching warm light; tall thin pine silhouettes.
- **Surfaces & materials:** Dark iron, worn wood, wet muddy ground with puddle reflections, silky grass plumes.
- **Objects:** Broken cart with large wooden wheel, iron tubes/barrels, scattered planks/sticks, grass field, silver grass, pine row, distant signpost, figure with straw hat and cape.
- **Lighting/FX details:** Dramatic orange-pink sunset bloom, dark smoke column across sky, embers/sparkles top right, warm rim light on grass blades.
- **Build components:**
  - Iron-banded wooden wheel + cart wreck — Blender mesh + wood/iron normal — castle stables / supply yard.
  - Silver-grass wall — instanced cards — meadow edges.
  - Wet mud with puddle reflections — roughness/puddle mask shader — paths after rain.
  - Sunset bloom sky gradient — sky shader — dusk transition before night.

### U58
- **Patterns:** (Mirrored/cropped duplicate of U52.) Patchwork rice-paddy grid, castle tiers, cherry blossom canopy, tiled roofs.
- **Carvings & relief:** White multi-tier keep with chidori-hafu and karahafu gables, pagoda, torii gate, stilted lookout on cliff, stone river revetments.
- **Edges & profiles:** Flared eaves, battered stone bases, curving river banks.
- **Surfaces & materials:** White plaster, grey tile, timber, mossy rock, river water.
- **Objects:** Castle complex, village, paddies, river with boats and piers, pagoda, torii gate, cherry trees, pine branch, waterfall foam, cliff, petals, two figures.
- **Lighting/FX details:** Bright day, cumulus, drifting petals, valley mist.
- **Build components:**
  - (Same as U52) Karahafu gable dormer — Blender mesh — castle roofs.
  - Petal-fall particles — particles — courtyard.
  - Waterfall foam at cliff base — particle + flow-map shader — castle mound waterfall.

### U59
- **Patterns:** Torii gate (myōjin style: curved kasagi top beam with shimaki under, nuki tie beam, central gakuzuka strut); stone steps (stacked flat risers); cloud-shaped pine pads (niwaki pruned pine); gnarled root mass.
- **Carvings & relief:** Huge gnarled ancient tree root/stump bulging over rocks like a sculpted form (deep 3D); torii with upturned kasagi ends; carved stone steps descending; small shrine roofs in valley; village pagoda.
- **Edges & profiles:** Torii top beam with upswept ends; rough mossy boulder edges; stair risers with worn bullnose.
- **Surfaces & materials:** Weathered wood torii (faded red-brown), mossy granite, pale bleached root wood, dense green moss.
- **Objects:** Torii gate, stone stairway, giant root/stump, mossy boulders, cherry trees (pink), niwaki pines, valley village with temple, river, rice terraces, forested mountains.
- **Lighting/FX details:** Soft overcast haze, layered aerial perspective in valley.
- **Build components:**
  - Ceremonial gate with upswept top beam (reinterpret as gilded moon gate) — Blender mesh — entrance to Glowwood shrine path.
  - Mossy carved stone stairway — Blender modular steps + moss mask shader — cliff path up to castle.
  - Giant bleached root sculpture — Blender sculpt + normal map — Glowwood heart.
  - Cloud-pruned pine (niwaki) — Blender mesh pads + needle cards — courtyard gardens.

### U60
- **Patterns:** Perforated/pierced stone pier caps — rows of circular holes (dotted roundel pattern) on the upper blocks of gate pylons; latticed window grids (red-glowing shoji-like grids) in rows; tiled roof ribs; vertical plank boards; string of small hanging lamps.
- **Carvings & relief:** Massive gate with two square stone pylons; upper pylon blocks carved with circular medallion/roundel cut-outs in a scattered band (shallow-to-medium relief); a red embroidered hanging banner with circular emblem over the doorway; tiered fortress-temple with stacked balconies; wooden gantry/crane with diagonal braces at right; hanging painted lantern (rectangular paper box lantern with calligraphy) on a pole.
- **Edges & profiles:** Hipped roofs with strongly upturned corners; icicles along eaves; pylons stepped (base block, cap, upper block); snow drifts softening edges.
- **Surfaces & materials:** Pale snow-dusted stone blocks, dark timber, warm-lit paper windows, red fabric banners, ice.
- **Objects:** Fortress gate with pylons, banner, tiered temple-fortress, side pavilions with lit windows, bonfire (log tepee in a stone ring), wooden poles with rope lines of small lanterns, canvas awning/tarp, wooden gantry/frame, hanging box lantern, small cyan bird-shaped ornament, snow-laden pines, steps, figure.
- **Lighting/FX details:** Blue-violet snowy night, heavy falling snow (large flakes), warm orange bonfire with sparks, red/pink glow from window grids, small lamp string bulbs, cold rim light on snow.
- **Build components:**
  - Gate pylon with pierced roundel band — Blender mesh + normal/decal of circular cut-outs — castle main gate towers.
  - Hanging rectangular paper box lantern on pole — Blender mesh + emissive paper shader — gate approach.
  - String-light catenary between poles — Blender curve + emissive instanced bulbs — market/ring walkways.
  - Bonfire in stone ring — Blender logs + fire particle + flicker light — courtyard camp.
  - Snowfall + icicle eaves — particle snow + Blender icicle strips — winter variant of castle.
  - Red window-grid glow panels — emissive grid texture — castle tower windows at night.

### U61
- **Patterns:** Red maple leaf scatter on grass (palmate maple leaf decals); stepping stones in stream; lamellar armour (not built).
- **Carvings & relief:** Distant temple pavilion with hip roof, white plaster walls, open windows, stone stair leading up; stone stream-bank retaining wall.
- **Edges & profiles:** Hip roof with flared eaves; stone stairway risers; rounded river rocks.
- **Surfaces & materials:** Highly saturated grass, crimson maple canopy, river water with foam, mossy stone, plaster.
- **Objects:** Giant red maple tree, temple pavilion, stone staircase, river/stream with rapids, rocks, fallen maple leaves, pebble path, steam/mist plume, figures in armour.
- **Lighting/FX details:** Bright soft light, mist drifting from right, wet specular on stream, falling leaves.
- **Build components:**
  - Red maple tree with leaf-fall — mesh + cards + particles — autumn grove near Glowwood.
  - Maple-leaf scatter decal — decal atlas on terrain — paths and lawns.
  - Hilltop pavilion with stair — Blender mesh — garden folly.
  - Stream rapids with foam — flow-map water shader — Glowwood stream.

### U62
- **Patterns:** Bridge railing with repeating rectangular baluster panels (kōran) — top rail, mid rail, short square posts; plank deck; flagstone/irregular crazy paving ground; bamboo culm rhythm; dappled leaf-shadow on floor.
- **Carvings & relief:** Red arched bridge with giboshi (onion-shaped bronze post finials) on railing posts — turned, banded bulbs with a pointed tip (fully 3D, metal); moss-covered stone lantern (kasuga-style: base, shaft, firebox with window, umbrella cap, hōju jewel top); small raised wooden shrine (hokora) on stilts with crossed chigi (forked X roof finials) and katsuogi; moss on all upper surfaces.
- **Edges & profiles:** Gently arched deck; rounded rail edges; giboshi bulb silhouettes; X-shaped chigi silhouette; shrine eaves.
- **Surfaces & materials:** Red-lacquered wood (worn, sunlit), oxidised bronze/greenish giboshi with gold bands, mossy grey stone lantern, weathered wood shrine with heavy moss, irregular paving stones, pond water.
- **Objects:** Red arched bridge, giboshi post caps, stone lantern, mini shrine on stilts, bamboo clump, pond, background temple roof and white railing fence, cedar trunks, small iron kettle/teapot on ground, figures.
- **Lighting/FX details:** Strong dappled sunlight (leaf gobo) across bridge and paving, warm and green tones, light shafts in background forest.
- **Build components:**
  - Onion-bulb railing finial (giboshi) — Blender lathe mesh + gilded/bronze shader — bridge railing posts, ring walkway newels.
  - Arched bridge with panelled railing — Blender modular — moat bridges.
  - Mossy stone lantern (kasuga type) — Blender mesh + moss mask + emissive firebox — garden paths (glowing at night).
  - Stilted mini-shrine with crossed roof finials — Blender mesh — Glowwood waysides.
  - Crazy-paving flagstone — tiling texture + normal map — courtyard floors.
  - Bamboo clump — instanced culms + leaf cards — garden edges.

### U63
- **Patterns:** Thatched roofs with stepped thick eaves and ridge cap; crossed ridge-bars (X-shaped karasu-odori/ridge clamps) on top; stone lantern (ikekomi/yukimi type) with stacked tiers; fence rails; tall grass field rows.
- **Carvings & relief:** Stone lantern with curled roof corners (warabite scrolls) and jewel top (medium relief); farmhouse with multi-layer thatch (steep irimoya), small gable smoke vent, wooden lattice windows.
- **Edges & profiles:** Thick rounded layered thatch edges; X-bar ridge silhouette; lantern cap with upturned curled corners.
- **Surfaces & materials:** Weathered grey thatch, dark wood planks, grey stone lantern, golden-yellow grass, snowy far ground, lake water.
- **Objects:** Thatched farmhouse, smaller sheds, open pavilion, wooden fences, cart, stone lantern, hanging straw broom/bundle (talisman), firewood/crates, lake, pink-blossom forest hill, pines, mountain fort on peak, figure in armour.
- **Lighting/FX details:** Vivid daylight, smoke wisps from distant buildings, high saturation.
- **Build components:**
  - Layered thatch roof with X ridge bars — Blender mesh + straw normal map — village/stable roofs.
  - Stone lantern with curled cap corners — Blender mesh — garden paths.
  - Hanging straw talisman bundle — Blender mesh/cards — doorways.
  - Golden grass field — instanced grass shader — meadows.

### U64
- **Patterns:** Wooden split-rail fence (post-and-rail, two horizontal rails); dry-stone piers (stacked stones); wooden shingle roof with moss growth; climbing ivy on wall; flower beds.
- **Carvings & relief:** None carved. Small red-painted cottage/boathouse with shingle roof, ivy-covered gable, lean-to porch with shingle roof; stacked firewood/wood crates.
- **Edges & profiles:** Simple gable; shingled overhang; rustic rounded fence rails.
- **Surfaces & materials:** Red-painted weathered wood, moss-covered cedar shingles, grey dry stone, turquoise clear pond water, dirt path.
- **Objects:** Cottage with lean-to, wooden fence with dry-stone posts, pond/lake, pink-blossom flowering trees (crabapple/rhododendron), red geraniums/roses, purple wildflowers, white flower clusters, beehive-like crates, distant castle on hill, snowy mountains, tall grass, broadleaf trees.
- **Lighting/FX details:** Bright sunny day, saturated greens, soft dappled light.
- **Build components:**
  - Rustic post-and-rail fence with dry-stone pier — Blender modular — garden borders.
  - Moss-shingle roof — Blender mesh + moss mask shader — gardener's cottage.
  - Ivy climb on wall — alpha card decal/meshes — castle outer walls.
  - Flowering pink tree — leaf cards — garden.
  - Turquoise clear pond with shallow-depth colour — water shader with depth gradient — Glowwood pond.

### U65
- **Patterns:** Glowing red-orange calligraphic magic glyph ribbons (curling script-like swirls) in the air; blue sparkle trail; tall grass; puddle reflections.
- **Carvings & relief:** Distant tall lone tower/spire with root-like flared buttress base (like a stretched tree trunk) and thin antenna masts nearby.
- **Edges & profiles:** Tapered needle tower silhouette with splayed buttress legs.
- **Surfaces & materials:** Wet shallow water over grass and pebbles (reflective), glossy grass, mossy stones, glowing energy ribbons (emissive red with hot white core), blue crystalline sparkle blade.
- **Objects:** Meadow, shallow stream, stones, shrubs, distant spire tower, thin masts, figures (one airborne), sword.
- **Lighting/FX details:** Emissive glyph swirls with flickering ember edges, blue sparkle particles, specular water glints, daylight.
- **Build components:**
  - Floating rune-ribbon swirl — trail/ribbon mesh with scrolling emissive glyph texture — magic portals, birthday spell effects.
  - Sparkle trail particles (blue) — particle system — wand/fairy trails in Glowwood.
  - Root-buttressed needle spire — Blender mesh — distant mage tower silhouette.
  - Shallow puddle-over-grass — wet blend shader + reflections — marsh areas.

### U66
- **Patterns:** Pinnate fern fronds (sword fern) in clusters; stepped cascade tiers of a waterfall; vertical flower spikes on the trees above (foxglove/lupin-like magenta conical blossom spikes along tall thin trunks); rope twist strands.
- **Carvings & relief:** Natural cave mouth framing the view: massive overhanging rock lip, faceted granite boulders with chipped facets (deep natural relief). Wooden rope-post rig at right: crossed-pole A-frame (two poles lashed in an X) anchoring a taut hemp rope, plus a rough timber fence/boardwalk with diagonal braces.
- **Edges & profiles:** Cave-mouth silhouette (dark jagged frame vs bright sky); rounded mossy boulder rims catching sky light; rope catenary line catching sun.
- **Surfaces & materials:** Wet dark granite with moss and lichen speckle, damp glossy cave floor, weathered grey timber, twisted hemp rope, white aerated water.
- **Objects:** Cave mouth, multi-tier cascading waterfall, plunge pool with mist, ferns, mossy boulders, tall pink-flowering spike trees, X-pole rope anchor, wooden railing/boardwalk, rope line across chasm, sky.
- **Lighting/FX details:** Bright cyan sky light spilling into dark cave (strong contrast, high-dynamic framing), waterfall spray mist at base, sun-dappled rock top right, cool ambient in cave.
- **Build components:**
  - Cave-mouth frame rock shell — Blender sculpt + rock normal/moss mask — grotto under the castle / Glowwood hidden cave.
  - Tiered cascade waterfall — Blender stepped mesh + scrolling foam flow-map shader + mist particles — castle cliff falls.
  - X-pole rope anchor and rope line — Blender mesh + rope curve — rope bridge anchors over chasm.
  - Magenta flower-spike tree — trunk mesh + clustered petal cards with emissive night glow — Glowwood (magical "spire blossom" trees).
  - Fern cluster — alpha cards — cave floor and cliff edges.

### U67
- **Patterns:** Stylised layered cliff strata (vertical columnar limestone with horizontal bedding); stepping-stone slabs crossing a stream; oversized tropical leaves (monstera/banana); bird-of-paradise and heliconia flowers; turquoise canopy puffs on cliffs.
- **Carvings & relief:** Natural rock shelf/overhang shaped like a cantilevered wing ledge at left (mushroom-shelf rock); natural rock arch bridge in mid-distance spanning the gorge (with greenery on top); fallen log bridging stream.
- **Edges & profiles:** Smooth rounded stylised rock bevels with soft painterly highlights; flat-topped stepping slabs; ledge with tapering underside.
- **Surfaces & materials:** Cream/beige stylised stone, clear turquoise water with depth gradient and white-foam ripples, magenta-crimson tree canopy, orange/red tropical foliage, teal canopies.
- **Objects:** Multiple waterfalls (ribbon falls down cliffs), turquoise stream, stepping stones, rock ledge, natural arch bridge, fallen log, crimson-canopy tree with buttress trunk, teal trees, tropical plants (monstera, heliconia, bromeliads, ferns, palms), pink/purple flowers, orange leaf clusters.
- **Lighting/FX details:** Bright warm sun, haze between cliff layers, white foam rings at stones, saturated stylised palette.
- **Build components:**
  - Stylised stepping-stone ford — Blender mesh slabs + foam-ring shader around intersections — Glowwood stream crossing.
  - Cantilevered rock ledge (viewpoint shelf) — Blender mesh — cliff overlooks.
  - Ribbon waterfall on cliff — scrolling alpha strip shader — castle mound cliffs.
  - Crimson-canopy fantasy tree — mesh + leaf clusters, emissive tint at night — Glowwood accent trees.
  - Turquoise depth-gradient water — water shader — pools and moat.

### U68
- **Patterns:** Torii gate pair; stacked flagstone ledges (layered slate slabs); white pampas plume tufts; cosmos/daisy flower scatter; fluffy cloud-ball tree foliage (stylised); swirl ripple rings at waterfall base; lattice fence panels (vertical slat railing) on a deck at left.
- **Carvings & relief:** Red torii (myōjin type, curved kasagi + nuki) standing directly in front of a waterfall; small red hokora shrine (gabled with chigi X finials, raised on posts, open front); squat black stone lantern (yukimi-like with wide cap, short legs) on the rock ledge; slender post lanterns with orange glowing boxes; large shimenawa (thick twisted straw rope) wrapped round a giant tree trunk with white zigzag shide paper streamers hanging (top right); small dark stone/metal shrine box with red glowing slit windows at right.
- **Edges & profiles:** Layered slab ledges with chipped bevelled edges; torii top beam upswept; thick rope coil rounded profile; deck railing.
- **Surfaces & materials:** Stylised painterly stone (grey slate), red lacquered wood, vivid green grass, orange path dirt, white water, pink-leaved tree, coral-red maple, glowing warm lantern panels.
- **Objects:** Waterfall with torii pair in front, swirl pool, red maple tree (huge, sprawling), pink tree, red hokora shrine, stone lantern, post lanterns (glowing), wooden deck with railing, cottage with lit windows, dark shrine box with red glow, giant sacred tree with straw rope and paper streamers, pampas tufts, white/orange cosmos, grass clumps, flat stepping ledges, dirt path, falling petals, figure with spear.
- **Lighting/FX details:** Soft afternoon light, warm emissive lanterns, red glow slits, falling petals/leaf particles, foam rings and spray at the fall base.
- **Build components:**
  - Gate-in-front-of-waterfall set piece — Blender mesh gate + waterfall shader — entrance to Glowwood shrine.
  - Giant twisted rope with zigzag paper streamers around a tree — Blender curve rope + paper cards — Glowwood heart tree (birthday ribbon variant).
  - Glowing post lantern (box on slim pole) — Blender low-poly + emissive — path lighting.
  - Dark shrine box with glowing slit windows — Blender mesh + emissive red decal — wayside markers.
  - Layered slate ledge kit — Blender modular slabs + bevel normal — stream banks, stairs.
  - Swirl ripple rings — animated decal/shader — waterfall plunge pools.

### U69
- **Patterns:** Stylised clumped leaf canopies (hand-painted leaf masses); layered sedimentary rock blocks (stacked rectangular slabs with chiselled facets); conifer tiers; pink cherry canopy clouds.
- **Carvings & relief:** None man-made. Natural: an enormous fallen log forming a bridge over the river, its bark split into thick plates (deep relief), moss and leafy sapling growing on top, broken branch snag at end; huge ancient oak with twisting branches; river banks of blocky stratified rock.
- **Edges & profiles:** Hard stylised bevels on rock blocks with bright top-face highlights; strongly curving branch silhouettes; flat river banks.
- **Surfaces & materials:** Painterly stylised bark (dark brown), mossy log, reddish-pink stone blocks, blue water, lush green grass, lavender-violet distant cliffs.
- **Objects:** Ancient spreading oak, fallen-log bridge, river, rock-block banks, stepping rock in water, conifers, deciduous trees, giant pink blossom trees, floating/overhanging rock cliffs (purple), dirt path, shrubs, fern.
- **Lighting/FX details:** Sun from upper left, dappled path, bluish atmospheric haze deep in forest, light shafts in the distance, waterfall mist far back.
- **Build components:**
  - Fallen-log bridge with moss and sapling — Blender sculpt + stylised bark normal — Glowwood river crossing.
  - Stylised stratified rock block bank — Blender modular blocks — riverbanks.
  - Ancient sprawling oak — Blender mesh + leaf clumps — Glowwood landmark.
  - Floating rock overhangs (lavender) — Blender mesh — sky backdrop around floating castle.

### U70
- **Patterns:** Giant circular magic portal ring with swirling vortex of floating dark disc fragments (cellular/Voronoi-like disc pattern); lightning tendrils; stacked shelf fungus tiers (bracket fungi on trunks); umbrella-shaped purple canopy trees with fringed drooping tassels (willow-like); bioluminescent tulip/bulb lamps (glowing blue-white bulbs on stalks); red cup-shaped mushrooms in rows.
- **Carvings & relief:** Rock spire with treehouse platforms (mushroom-cap disc platforms ringing the pillar); floating rock islets inside the portal; a brass mechanical pylon/device with four curved claw legs and a glass cylinder core shooting a lightning beam upward; zipline cable between rock pillars.
- **Edges & profiles:** Perfect circular portal rim with sharp bright edge; tiered disc shelves; flat-topped mesas; jagged lightning.
- **Surfaces & materials:** Painted stylised rock, glowing violet energy, brass/gold machine with glass vial, bioluminescent blue fungi and bulbs, purple foliage, mist.
- **Objects:** Portal vortex, rock spire with fungus platforms, floating islets, brass beacon device, lightning column, glowing bulb plants, red mushroom groups, purple tassel-canopy trees, red layered mushroom trees, waterfall, river, mesas, rainbow arc (faint), zipline, cliffs, figure silhouette.
- **Lighting/FX details:** Violet/pink portal glow with flicker, electric blue lightning beam, bioluminescent cyan spots on the rock spire, pink-lilac sky haze, rainbow, floating particles.
- **Build components:**
  - Circular magic portal with orbiting shard vortex — ring mesh + emissive swirl shader + instanced orbiting disc particles — castle teleport gate / ballroom stage centrepiece.
  - Shelf-fungus platform tiers — Blender mesh discs — Glowwood tree trunks (glowing undersides).
  - Glowing bulb-lamp plants — Blender low-poly + emissive translucent shader — Glowwood paths (natural lanterns).
  - Brass claw-legged crystal beacon — Blender mesh + glass/emissive core + beam shader — tower top beacon / magic generator.
  - Fringed umbrella-canopy tree (purple) — Blender mesh + tassel cards — Glowwood canopy.
  - Lightning beam — animated strip shader — magic FX.

### U71
- **Patterns:** Window grid of small square glazed panes (multi-pane casement/sash windows, 4×6 grids); vertical drapery folds in curtains; ivy and creeper leaf mass; small white flower carpet.
- **Carvings & relief:** Ruined mansion interior with collapsed wall/roof: tall multi-pane windows with wooden frames; timber ceiling beams; a broken stone column/stone pier at left; collapsed masonry rubble; through the gap a cliff with a waterfall.
- **Edges & profiles:** Tall rectangular window frames with mullions/muntins; heavy curtain rods with valance; jagged broken roof edge.
- **Surfaces & materials:** Old warm-glazed glass (slightly frosted, green-yellow tinted from foliage outside), tattered golden-brown velvet curtains, dark wood panelling, mossy stone rubble, glossy ivy.
- **Objects:** Multi-pane windows, curtains/drapes, timber ceiling, broken wall, rubble blocks, ivy and hanging vines, dense groundcover with white flowers, waterfall on cliff, mossy rocks.
- **Lighting/FX details:** Strong skylight from ruined opening, warm bounced light through window panes, light haze/god rays, green bounce from vegetation.
- **Build components:**
  - Multi-pane wooden window with warm glow — Blender mesh + emissive glass shader — castle residential wings.
  - Heavy draped curtain with valance — Blender cloth-sim mesh + velvet sheen shader — ballroom / bedrooms.
  - Overgrown ruin interior (rubble + ivy) — Blender kit + moss/ivy cards — ruined chapel in Glowwood.
  - Hanging vine curtains — alpha cards with wind — ruin openings, castle walls.

### U72
- **Patterns:** Diamond lattice / quarry grid (wrought-metal diamond trellis) in the upper window/screen panels; Celtic/Norse knotwork interlace on a metal-and-stone door (interlaced S-curves in a central roundel cross with ring — knotwork ring-cross); Norse knotwork carving on side door panels; ashlar block coursing in walls and columns; irregular flagstone paving; Virginia creeper/Boston ivy cascades (lobed red leaves) hanging like curtains.
- **Carvings & relief:** Central pointed arched doorway (Gothic lancet/ogival arch with a carved scroll/foliage tympanum band and a carved hood-moulding), double door of greenish bronze/stone with knotwork interlace and central circular medallion with a cross bar (deep relief); side arched niches (round-headed) with knotwork-filled doors; square pilasters with stepped capitals and bases; heavy carved scroll console/corbel (volute bracket) high on a column at right (deep 3D); dentil-like cornice band above arches; a large urn/planter with banded relief at right; carved stone frieze bands (red-tinted).
- **Edges & profiles:** Pointed arch with multiple roll mouldings; round-arched niches with archivolts; stepped square capitals; cornice with fillets; chamfered column edges; broken toppled column drums and leaning slabs.
- **Surfaces & materials:** Weathered grey-blue stone, mossy patches, oxidised green bronze doors, red-painted trim on friezes, creeper foliage in crimson/scarlet, glowing amber lantern cages.
- **Objects:** Courtyard ruin entrance, knotwork door, side niche doors, pillars, broken column drums, toppled slabs, urn planter, standing lantern cages (organic root/antler-like rib cage lanterns on a stem with glowing amber lining — two in foreground), red creeper curtains, pink/red astilbe-like plume flowers, cactus-like columnar plant, bushes with big leaves (hosta/alocasia), orange grass tufts, flagstone path, ferns, roots.
- **Lighting/FX details:** Night with blue moonlit sky, red floating ember/firefly particles, warm amber lanterns casting pools of light, cool blue rim on stone, saturated red foliage pop.
- **Build components:**
  - Knotwork-roundel arched double door (bronze) — Blender mesh + knotwork normal map — castle inner keep door / Glowwood shrine door.
  - Pointed arched portal with carved tympanum and hood moulding — Blender mesh + normal — chapel entrance.
  - Diamond lattice wrought trellis panel — Blender mesh / alpha-masked decal — upper windows, garden screens.
  - Organic rib-cage standing lantern (amber) — Blender curve mesh + emissive inner shell — Glowwood paths, courtyard.
  - Crimson creeper curtain — alpha leaf cards draped over arches — castle courtyard walls (autumn/night).
  - Scroll volute corbel — Blender mesh — column capitals, balcony supports.
  - Floating ember/firefly particles (red) — particle system — courtyard ambience.
  - Knotwork-carved urn planter — Blender lathe + normal — courtyard.

### U73
- **Patterns:** Birch bark pattern (white bark with black horizontal lenticels and dark knots); crimson leaf canopy masses; blue flower sprays (forget-me-not/cornflower); dry orange grass mass; leaf-litter on path.
- **Carvings & relief:** None; natural: twisted low arching oak branch framing scene, moss-covered rock left.
- **Edges & profiles:** Strong arching branch silhouette forming a natural portal; white birch trunk verticals.
- **Surfaces & materials:** Papery white birch, dark bark, moss, glowing translucent red leaves, golden-orange grass, stone path.
- **Objects:** Birch grove, ancient arching tree, mossy boulders, blue wildflowers, red leaf fall, dry grass, stone path, rock cliff/overhang right.
- **Lighting/FX details:** Strong volumetric god rays through canopy, backlit translucent red leaves, falling leaf particles, haze, bloom.
- **Build components:**
  - White birch trunk with lenticel bark texture — Blender mesh + bark normal/albedo — Glowwood silver grove (could glow faintly at night).
  - Crimson canopy leaf cards with translucency — leaf card shader — autumn grove.
  - Volumetric god rays — light shaft shader/billboards — forest clearings (moonbeams at night).
  - Blue flower spray — instanced cards — path edges.
  - Arched branch portal — Blender mesh — Glowwood entrance.

### U74
- **Patterns:** Cobblestone path (rounded setts, irregular); golden grass; birch trunks; ribbed spine segments on a giant skeleton.
- **Carvings & relief:** Huge creature skeleton (ribcage arches, vertebrae spikes, skull) lying in a field — reads as a ribbed bone arch structure; tripod of poles with hanging cauldron over a campfire.
- **Edges & profiles:** Rib arch silhouettes against the sun; tripod triangle.
- **Surfaces & materials:** Bleached bone, golden dry grass, birch bark, cobbles, warm fire.
- **Objects:** Giant skeleton, campfire with tripod and cauldron, birch and oak trees, cobble path, logs, small figures and a grazing animal (silhouettes only), drifting leaves.
- **Lighting/FX details:** Low golden sunset sun with lens bloom directly behind skeleton, warm haze, floating leaves, backlit grass.
- **Build components:**
  - Tripod-and-cauldron campfire — Blender mesh + fire particles — camp in the Glowwood.
  - Ribbed arch tunnel (reinterpret as pale stone rib arcade instead of bones) — Blender modular — garden pergola/arcade.
  - Rounded cobblestone path — tiling texture + normal/parallax — village paths.
  - Golden backlit grass — instanced grass shader with translucency — meadows.

### U75
- **Patterns:** Wave/scroll border pattern (running wave scroll — "Vitruvian scroll"/spiral curl) in white along the edges of two hanging dark red cloth panels; rough hewn log roof slats; mushroom clusters (small pink caps) along path; autumn canopies.
- **Carvings & relief:** Rustic lean-to shelter of split logs with corner posts and diagonal roof logs; crude carved rune/glyph above the doorway (shallow).
- **Edges & profiles:** Log ends with rough cut, split timber, A-frame half-roof slope.
- **Surfaces & materials:** Weathered split timber, dark red woven fabric with white embroidery, mossy rocks, dirt path with flat stones, orange/red foliage, glowing small lamp.
- **Objects:** Log shelter with curtain banners, mossy boulders, standing torch/small lamp on post, flat mushroom cluster ring (pink caps), stones, autumn trees (red-orange), pines, tree stumps, shrubs, ferns, crossbow bolt/arrow trail.
- **Lighting/FX details:** Warm low sun shafts, haze, glow from a small lamp, firelight behind shelter.
- **Build components:**
  - Running-wave scroll embroidered banner — cloth mesh + decal/texture — castle hall banners, tent entrances.
  - Rustic split-log lean-to — Blender mesh — Glowwood ranger hut.
  - Pink mushroom ring — instanced caps with emissive undersides at night — fairy rings in Glowwood.
  - Post torch — Blender mesh + flame particle — trail markers.

### U76
- **Patterns:** Little architectural detail (game screenshot with HUD). Natural: chunky stylised grass blade clumps, puffball leaf clusters on trees, moss on boulder top.
- **Carvings & relief:** None. A colossal fallen/leaning tree trunk spanning the sky (giant branch arching overhead with leafy tufts), a single rounded mossy boulder.
- **Edges & profiles:** Huge pale trunk silhouette crossing the sky diagonally; soft rounded boulder.
- **Surfaces & materials:** Bright green stylised grass (glossy), pale grey bark, mossy granite.
- **Objects:** Giant sky-spanning tree trunk/branch, deciduous trees, oak-like trees, mossy boulder, tall grass meadow, hills, figure (back view). HUD elements (ignore).
- **Lighting/FX details:** Bright midday sun, blue sky with clouds, haze on distant trees, light bloom on grass tips, faint falling particle streaks.
- **Build components:**
  - Colossal sky-arching tree trunk — Blender mesh + bark normal — Glowwood "world tree" arch spanning a path.
  - Chunky stylised grass field — instanced grass shader with wind — meadows.
  - Moss-capped boulder — Blender mesh + world-up moss shader — fields.

### U77
- **Patterns:** Gothic tracery in fence panels — repeating pointed lancet arches each filled with a quatrefoil/roundel (circle with cusped foils) above twin lights; round rose-roundel bosses in the railing; flagstone ashlar paving laid in concentric rings around a circular plaza (radial/annular stone setts); concentric ring kerbs (three raised stone rings); glowing cyan magic sigil ring (arcane circle with interlocking spiral/scroll glyphs) on floor; red autumn maple-leaf scatter; ashlar coursing on walls; crockets in rows up the spires.
- **Carvings & relief:** Tall Gothic pinnacle/spire obelisks with crockets (thorn-like spikes up every arris), pointed-arch niche (gabled) at their bases, stone blocks visible (fully 3D); Gothic flying buttress arch (a big segmental flying arch leaping from a buttress pier at left); buttress pier with lancet-panel blind tracery; Gothic cathedral silhouettes in background with twin spires, lancet windows glowing yellow; a dark gothic lectern/pedestal of open tracery panels (pinnacled box with lancet openings) holding a glowing red open book; stone balustrade posts (square newels with caps); a gothic lantern tower at right with lancet openings glowing (vaulted interior ribs visible) on a bowl-shaped corbel bracket; wooden barrels, clay amphora/vases.
- **Edges & profiles:** Pointed lancet arches, crocketed spires catching warm light along their edges, square newel caps, raised ring kerbs with rounded bullnose edges reflecting light, flying-buttress arch soffit.
- **Surfaces & materials:** Warm sandstone/limestone (glowing orange in firelight), polished worn cobble/flag paving with glossy highlights (wet look), dark wrought-iron lamp posts, glowing glass lamp cages, red crystal formations (faceted glowing red crystals growing among trees), a translucent swirling energy dome (bubble shield with iridescent marbled surface), red-orange leaves.
- **Objects:** Circular ritual plaza, glowing book on Gothic lectern, magic floor sigil, Gothic tracery fence/railing, crocketed spire obelisks, flying buttress, cathedral backdrop, cast-iron lamp posts with lantern heads (hexagonal/octagonal cage lanterns with pointed caps), gothic bracket lantern tower, red crystal clusters, energy dome, wooden barrels, crates, clay vases/jugs (red glazed), bare twisting tree with red leaves, dry grass, rock piles, stairs, small glowing cyan sigil (left edge), falling leaves.
- **Lighting/FX details:** Warm red-orange ambient, yellow lamp glows, cyan rising sparkle particles from the sigil (vertical light streaks), emissive red crystals, warm glowing windows, glossy reflections on paving, chromatic aberration fringes.
- **Build components:**
  - Gothic tracery railing panel (lancet + quatrefoil roundel) with square newel posts — Blender mesh (or alpha-masked panel + normal map for LOD) — ring walkways, castle terraces, bridge railings.
  - Crocketed Gothic pinnacle spire — Blender mesh with instanced crockets — castle tower tops, gate piers, railing terminals.
  - Concentric-ring circular plaza with annular flagstones — Blender mesh + tiling radial paving texture + normal map — castle courtyard centre / ring walkway hub.
  - Glowing arcane floor sigil with rising sparkles — decal + emissive scrolling shader + particle — ballroom floor, portal spots, birthday reveal point.
  - Gothic lectern with glowing book — Blender mesh + emissive pages — library / ballroom reveal.
  - Cast-iron lamp post with cage lantern — Blender mesh + emissive glass — ring walkways, bridges.
  - Faceted glowing red crystal cluster — Blender mesh + emissive/refraction shader — Glowwood, crystal caves.
  - Iridescent energy dome shield — sphere + fresnel swirl shader — magic barrier around castle at night.

### U78
- **Patterns:** Concentric circle engravings (target rings/arcs) carved on stone pillars; diamond-shaped inset tiles (lozenge with stepped frame, set on point) on pillar faces and plinths; ashlar coursing; stepped crescent stairs (curved concentric steps); water-lily pads on the pool.
- **Carvings & relief:** Ruined stone gateway pillars, each with a deep-relief carved sculpted head (beast/lion-like mask — must be replaced with foliage or faceless boss for us) inside a concentric ring medallion; diamond lozenge plaque below; a winged red-hooded sculpted figure mounted on a pillar (statue — must be faceless/veiled); circular stone roundel/disc set into pillar sides (shallow drum relief, like an eye-disc); stepped cornice caps on pillars; large circular wheel-like relief disc on right wall.
- **Edges & profiles:** Square pillars with stepped caps and chamfered block edges; curved crescent stair steps with bullnose; broken jagged tops; pool rim stones.
- **Surfaces & materials:** Weathered sandstone with sun-bleached faces, aged bronze/metal discs, mossy edges, clear reflective pool, glowing violet-blue energy portal sheets (shimmering vertical plane with lightning-like veins).
- **Objects:** Three portal gateways (energy curtains between pillars), stone pillars, curved stairs, reflecting pool, lily pads, ivy and yellow-flowered creepers, autumn yellow trees, blue butterflies, boulders, rubble, driftwood branch, orange flowers.
- **Lighting/FX details:** Warm sunny day, glowing purple portal sheets with animated vein noise, golden particles floating, reflections in water, soft haze.
- **Build components:**
  - Energy portal curtain between pillars — plane + animated vein/noise emissive shader + distortion — castle teleport gates, Glowwood portal.
  - Pillar with concentric-ring medallion and lozenge plaque — Blender mesh + normal map (replace head with rosette/faceless motif) — gate piers.
  - Curved crescent stone steps — Blender mesh — terrace stairs down to pools.
  - Reflecting pool with lily pads — planar reflection water + instanced pads — palace gardens.
  - Blue butterfly particles — particle system (sprite/flap) — gardens (glowing at night as moth-lights).
  - Yellow-flower creeper drape — alpha cards — ruin walls.

### U79
- **Patterns:** Art-deco/Mayan-style stepped geometric fret patterns (stepped key/meander-like panels and rectilinear grooves) on bronze tower at right; vertical fluting and angular fins on the teal crystal tower; flagstone paving with incised square grid; stepped stairs; spiky yucca/agave rosettes.
- **Carvings & relief:** Teal faceted tower (Gothic-futurist): sharp angular buttress fins, pointed gables, overhanging shelf-like projections (stepped cornices), vertical ribbing; bronze machine-tower with stacked blocky tiers, rectilinear meander grooves, glyph plaques, glowing orange slots/vents (emissive inset channels); a stone obelisk-post topped by a big ring (keyhole/ankh-like ring finial); rope-swagged posts with hanging small lanterns (cyan glow); giant curved horns/tusks rising from ground; a horned animal skull (decor).
- **Edges & profiles:** Hard chamfered fins, stepped cornices, sharp spire silhouettes; ring finial silhouette; worn stair nosings.
- **Surfaces & materials:** Teal-cyan glazed stone/metal, oxidised bronze with gold edge piping, sun-baked red sandstone, cracked flagstones, glowing orange emissive channels, small cyan lamp lights.
- **Objects:** Teal spire tower, bronze glyph tower, ring-topped stone pillar, rope fence with lanterns, pillars, stone steps, flagstone plaza, bull skull, tusks/horns, yucca, agave, palms, cacti, rocks, mesa cliffs, clay pots, birds in sky.
- **Lighting/FX details:** Strong backlit sun flare and bloom, pink-violet clouds, orange emissive vents, cyan point lights, warm/cool split lighting.
- **Build components:**
  - Faceted teal spire with angular fins — Blender hard-surface mesh + glossy glazed shader — mage tower (night: emissive seams).
  - Bronze tower panel with stepped-fret grooves and emissive slots — Blender mesh + normal map + emissive channel mask — clockwork/arcane machinery room, gate mechanisms.
  - Ring-topped stone marker post — Blender mesh — path waymarkers, garden.
  - Rope-swag fence with hanging lanterns — Blender curve + instanced emissive lanterns — walkways, queue lines at fair.
  - Incised flagstone plaza — tiling texture + normal — plaza floors.

### U80
- **Patterns:** (Small, low-res image.) Heavy timber/stone portal frame with carved bracket clusters; vertical fluting on pillars; spiral brass armillary rings.
- **Carvings & relief:** Massive pillared pavilion/ruin with ornate carved brackets and capitals (deep relief, blurred), an elaborate brass armillary/orrery mechanism holding a large glowing green globe (fully 3D), staircases leading up to a tall tower beyond.
- **Edges & profiles:** Thick square posts with layered capitals, deep beams; curved armillary ring arcs.
- **Surfaces & materials:** Weathered dark stone/timber, brass, glowing green glass orb, purple-pink sky, pink-blossom trees.
- **Objects:** Pavilion gateway, armillary sphere with green globe, stairs, distant tower, ivy, pink trees, ruined fence, distant mountains, glowing blue plants at bottom right.
- **Lighting/FX details:** Dusk-violet sky, green emissive orb, rim light on pillars.
- **Build components:**
  - Brass armillary sphere with glowing orb — Blender mesh (rings) + emissive glass globe, rotating rings — castle observatory / courtyard centrepiece.
  - Heavy pillared pavilion with carved brackets — Blender mesh — garden gatehouse.
  - Pink-blossom tree band — leaf cards — backdrop.

### U81
- **Patterns:** Greek meander/key (Greek fret) border in a wide circular mosaic band on the floor (white on dark), with an inner coloured band of scroll/guilloche; large floor mosaic medallion with dark green tendril/scroll and lozenge motifs on cream marble; coffered ceiling (lacunaria) — square sunken coffers each with a central rosette, painted red/gold; Greek key band on wall pilaster borders; ivy growth.
- **Carvings & relief:** Classical columns (unfluted Tuscan/Doric shafts with torus bases on square plinths, weathered); entablature with architrave and frieze; Corinthian/composite capital with acanthus (right, deep relief); circular wreath/medallion relief (tondo) on the upper wall; draped classical statues on plinths (must be veiled/faceless) holding a lyre; an ornate Baroque standing mirror — oval frame with scroll cartouche crest and C-scroll sides on a circular dais (fully 3D); stone balustrade with turned balusters; wall niches with pedimented aedicule; broken stele with fluting at left.
- **Edges & profiles:** Square plinths with stepped mouldings, column base torus and scotia, ceiling beam grid, entablature fascias, curved circular dais step with polished edge.
- **Surfaces & materials:** Weathered marble (cream, blue-grey), red painted plaster with dark border, polished mosaic floor with sheen, bronze braziers, gilded mirror frame, glowing mirror glass (luminous portal surface showing a landscape), red fabric banners/sashes, chains.
- **Objects:** Magic portal mirror on circular dais, tripod braziers (bowl on three curved legs with fire), draped statues, columns, coffered ceiling, hanging chain lamp (chandelier-like bronze hanging lamp on long chain), red hanging banners/ribbons, balustrade, wall niches, broken stones/rubble chunks, ivy, distant classical temple portico through opening, iron cage/birdcage-like hanging lantern.
- **Lighting/FX details:** Warm sunlight beam through opening with dappled leaf shadows on floor, fire glow from braziers with embers, glowing white-blue mirror surface, dusty atmosphere, cool blue fill on stone.
- **Build components:**
  - Greek-key circular mosaic band floor medallion — floor texture + normal/roughness map (decal ring) — ballroom floor, rotunda.
  - Coffered ceiling with rosette coffers — Blender modular tile mesh + gilded rosette normal — ballroom / great hall ceilings.
  - Ornate oval portal mirror with scroll cartouche crest on dais — Blender mesh + emissive/reflective shader — ballroom magic mirror, birthday reveal.
  - Tripod brazier with curved legs — Blender mesh + fire particles + light — courtyard, hall.
  - Veiled draped statue on plinth — Blender sculpt (faceless veil) — hall niches, garden.
  - Long-chain hanging bronze lamp — Blender mesh + emissive — corridors.
  - Classical column with torus base + plinth — Blender mesh — colonnades.

### U82
- **Patterns:** Off-theme sci-fi desert city. Usable: ribbed onion domes, segmented dome panels (gored dome lines), radial spoke patterns on dome tops, palm frond silhouettes, spiky red coral-like ground plants.
- **Carvings & relief:** Domed towers with spike finials, flared bulbous domes (Mughal/Byzantine-like) with gold banding, cylindrical machinery pods with glowing cyan lenses.
- **Edges & profiles:** Onion dome silhouettes with pointed finials, banded cornice rings; pipes.
- **Surfaces & materials:** Warm terracotta/sandstone, gold-banded domes with green-turquoise tiles, metal pipes, cyan emissive lights.
- **Objects:** Onion-domed towers, pipes, cylindrical tanks, palms, red spiky plants, crates, holographic glowing cube (blue), bolts, figure. HUD.
- **Lighting/FX details:** Hot orange haze, cyan emissive accents, glow sprites.
- **Build components:**
  - Gored onion dome with gold bands and spike finial — Blender lathe mesh + tile normal — castle turret caps (night-blue/gold variant).
  - Glowing collectible cube/crystal — emissive mesh + bob/rotate — birthday collectible pickups.

### U83
- **Patterns:** Stylised interlocking tile/brick pattern — key-like interlocking T and L shaped stone blocks (puzzle masonry / Greek-key-like interlock) on a cylindrical tower wall; dashed line inlay on curved walkway rim; scattered yellow-green lichen patches; giant chain links.
- **Carvings & relief:** Big cylindrical stone keep with interlocking-block relief walls (medium relief, smooth stylised bevels) and a scroll/volute shaped bracket (spiral end like a violin scroll) at the walkway edge; a huge iron chain anchored with a pulley/winch drum; curved ring walkway around the tower with a stepped bevelled parapet edge and an orange metal trim band; arched supports below.
- **Edges & profiles:** Soft-bevelled stylised edges catching light; curved walkway with raised rim; spiral volute end; rounded crenel-free parapet.
- **Surfaces & materials:** Painterly terracotta/rust-orange stone, grey flagstone deck, yellow lichen decals, rusty iron chain.
- **Objects:** Cylindrical tower, ring walkway, giant chain, winch drum, stone platforms, thorny vines, pink coral-like trees, teal sky with spires in distance, figure.
- **Lighting/FX details:** Bright stylised daylight, teal sky, soft shadows.
- **Build components:**
  - Curved ring walkway segment with bevelled rim and trim band — Blender modular arc mesh — castle ring walkways (direct match).
  - Interlocking-block masonry relief — normal map / trim sheet — tower walls (stylised).
  - Giant chain with winch drum — Blender mesh (instanced links) — drawbridge, floating island tethers.
  - Spiral volute bracket — Blender mesh — walkway corbels and balcony ends.
  - Lichen patch decals — decal atlas — stone weathering everywhere.

### U84
- **Patterns:** Celtic/Norse knotwork interlace carved on a stele face and on small standing stones (ring-cross/knot roundels glowing cyan); vertical runic inscription channels (glowing cyan lines running down a carved stele); rosette/clock-face medallion; ashlar blocks; mossy flagstones; fern fronds; stepped arch mouldings.
- **Carvings & relief:** Large carved altar stele/monument: pointed-top tablet framed by two engaged columns with banded shafts and capitals, a central circular medallion (dial-like with spokes), a long vertical sword-like glowing inlay, foliage scroll panels and knot panels below (deep relief), heavily mossed; small leaning runestones with knotwork roundels inlaid with glowing cyan (shallow relief + emissive); ruined colonnade with arches; massive pointed/segmental arch with carved soffit at right on a pier with a carved capital block and a relief figure panel (make faceless); a pinecone/spiky seed sculpture on the ground; broken wooden beams and a bent ring.
- **Edges & profiles:** Pointed arch tablet top, stepped plinth, column capitals, broken arch springers, chamfered blocks; moss rounding all edges.
- **Surfaces & materials:** Dark weathered stone with thick green moss, glowing cyan inlays (emissive runes), rusty iron fittings, wet dark water pool, orange autumn leaves on path, ferns.
- **Objects:** Carved stele/altar, runestones, stone slab altar platform, ruined arches and colonnade, Gothic window tracery shells in background, broken timber, iron ring, spiky seed pod sculpture, autumn maple, ferns, moss, pool, falling motes, cyan crystal sign.
- **Lighting/FX details:** Strong volumetric god rays from upper left, floating dust motes/sparkles, cyan emissive rune glow, cool teal atmosphere with warm leaf accents.
- **Build components:**
  - Carved altar stele with glowing rune inlay — Blender mesh + normal + emissive mask — Glowwood shrine, castle chapel.
  - Knotwork runestone with emissive roundel — Blender mesh + emissive decal — Glowwood path markers.
  - Moss-overgrowth blend shader (world-up + cavity) — shader — all ruin stone.
  - Ruined arch kit (pier + carved capital + arch ring) — Blender modular — ruined abbey in Glowwood.
  - Volumetric god-ray shafts with dust motes — light shaft billboards + particles — forest ruin clearings.

### U85
- **Patterns:** Triskele/spiral-scroll carving (S-scroll and spiral pairs, Celtic spiral) on a stone bench/altar block at right; tangled root lattice forming organic arches; hanging moss curtains; balustrade with short balusters in background.
- **Carvings & relief:** Massive twisted tree-root columns forming archways (root-wrapped pillars with carved bands and segmented rings like carved wooden totems — deep relief); a stone block bench/altar with carved spirals (shallow relief); a teal glowing crystal obelisk/shard in the middle of a far clearing; white balustrade (turned balusters) ringing a terrace; clay urn/pot on the floor.
- **Edges & profiles:** Organic arch silhouettes of roots and vines; rounded bench slab with chamfered edge; balustrade rail line.
- **Surfaces & materials:** Dark gnarled wood with carved ring bands, teal-lit mist, emissive cyan crystal, bioluminescent white-gold coral-like plants (glowing feather/frond fans), violet glowing mushrooms (tiered caps), purple tiny flowers, terracotta pot, mossy ground.
- **Objects:** Root arch gateway, tree-root columns, hanging vines/moss curtains, glowing crystal obelisk, balustrade terrace, stone spiral-carved bench, clay urn/pot, glowing white fan-coral plants, violet tiered mushrooms, small purple flowers, mushrooms on floor, leaf litter, distant pink blossom.
- **Lighting/FX details:** Deep teal/cyan ambient, glowing crystal, purple point glow from mushrooms, white-gold glow from fan plants, soft volumetric fog, small sparkle motes.
- **Build components:**
  - Root-wrapped arch gateway — Blender sculpt mesh + bark normal — Glowwood entrance.
  - Glowing crystal obelisk shard — Blender mesh + emissive/refraction shader — Glowwood heart.
  - Bioluminescent fan-coral plant (white-gold) — Blender low-poly + emissive translucent shader — Glowwood floor.
  - Tiered violet glowing mushroom — Blender lathe caps + emissive — Glowwood.
  - Spiral-carved stone bench — Blender mesh + spiral normal map — garden seating, Glowwood.
  - Hanging moss curtain — alpha strand cards with wind — arch openings.

### U86
- **Patterns:** Rhythm of tall slender pointed (lancet) arches of decreasing height, Elvish/Art-Nouveau style — each arch frame split by inner curved tracery ribs (Y-tracery / intersecting curved mullions with a teardrop/vesica opening at top); free-standing slim posts/obelisk stubs in a row; stepping rocks in water.
- **Carvings & relief:** Free-standing gilded/pale-gold arch frames (no walls, just open tracery frames) built into a cave grotto — fully 3D thin profiles; broken column stubs; cave stalactite rock; little white sailboat-like shapes on water (candles or paper boats).
- **Edges & profiles:** Very slender lancet/ogival arches with flowing inner curves (Elvish Gothic), thin rounded profiles catching warm light; cave mouth framing.
- **Surfaces & materials:** Pale gold/ivory luminous arch frames (gilded or glowing), dark wet cave rock with moss, still dark-teal water, green foliage island.
- **Objects:** Grotto, arch-frame colonnade, mossy island, waterfall on left, stalactites, cave opening to sky, small floating candle boats / paper boats with flame-like glows, rocks, lily pad.
- **Lighting/FX details:** Soft golden glow from the arch frames, skylight shaft from cave opening, mist, reflections of arches in water.
- **Build components:**
  - Free-standing Elvish lancet arch frame with inner curved tracery — Blender curve-sweep mesh + gold emissive edge shader — Glowwood grotto, ballroom entrance arches, ring walkway gateways.
  - Floating candle paper boats — Blender low-poly + emissive flame + bobbing shader — grotto lake / moat on birthday night.
  - Cave grotto shell with sky opening — Blender sculpt — hidden lake under castle.
  - Mist plane over water — fog shader — grotto.

### U87
- **Patterns:** Multiple vertical curtain waterfalls (sheets) as a colonnade; concentric/gyroscopic ring structure (armillary-like interlocking rings) around a giant rock sculpture; scattered small glowing flame windows.
- **Carvings & relief:** A colossal carved stone head/statue (rounded, moss-covered — faceless for us) enclosed within giant interlocking metal/stone rings (gyroscope/armillary), with stairways and tiny lit openings; cave rock walls.
- **Edges & profiles:** Huge circular ring arcs; waterfall sheets as vertical columns; cave mouth frame.
- **Surfaces & materials:** Mossy stone, metal rings, cascading white water, turquoise pool with gold-orange reflections, glowing amber flame niches.
- **Objects:** Giant ring-encircled monument, many waterfalls, turquoise pool, small figures (silhouettes), lanterns/flame niches, lamp held by figure, cave walls, rocks.
- **Lighting/FX details:** Cyan skylight from above, warm orange flame lights, waterfall spray mist, reflections, painterly haze.
- **Build components:**
  - Giant armillary ring monument (interlocking rings around a mossy veiled stone core) — Blender mesh + slow rotation — castle courtyard centrepiece / Glowwood heart.
  - Waterfall curtain colonnade — scrolling alpha planes + mist particles — grotto hall.
  - Flame niche lights in rock — emissive decal + point lights — cave walls.

### U88
- **Patterns:** Dappled sunlight spots on forest floor (leaf gobo); bluebell/violet flower scatter; tall tree trunks rhythm.
- **Carvings & relief:** A small white stone shrine/mausoleum: square plan with a green copper dome (ribbed), corner piers with carved capitals, a pointed-arch (ogee/lancet) doorway with a carved hood and keystone emblem, cornice ring under the dome, moss and vines on roof edges (medium relief).
- **Edges & profiles:** Pointed arch doorway with moulded archivolt, projecting cornice, dome silhouette with finial; mossy softened edges.
- **Surfaces & materials:** White/ivory marble, green-patina copper dome, moss, dark forest greens, blue flowers, leaf litter.
- **Objects:** Domed forest shrine, giant forest trees (beech/oak trunks), ferns, blue/violet flowers, stones, path, figure with spear.
- **Lighting/FX details:** Strong god rays and dappled sun patches, green bounce light, blue flower accents glowing.
- **Build components:**
  - Domed marble forest shrine with pointed doorway and copper dome — Blender mesh + patina/moss shaders — Glowwood shrine / birthday wish shrine.
  - Dappled light patches — light cookie / decal — forest floor.
  - Blue flower scatter (emissive at night) — instanced cards — Glowwood floor.

### U89
- **Patterns:** Square stepped stone plinth/stair; hanging ivy strands; dentil-like jagged "fringe" under the lintel (a scalloped/dagged pelmet edge); stepping stones in meadow; yellow flower scatter.
- **Carvings & relief:** Open-sided stone pavilion/gazebo (four square pillars, heavy flat roof slab with moulded cornice blocks), a glowing magical fountain/spring in the centre — round basin with a dome-shaped water jet (bubble fountain/upward bell jet) glowing cyan; steps leading up.
- **Edges & profiles:** Flat heavy cornice with blocky modillions, pillars with simple capitals, scalloped hanging fringe of vines, round basin rim.
- **Surfaces & materials:** Dark weathered slate-grey stone, pale marble inner columns, glowing cyan-white water, green moss/ivy, grass.
- **Objects:** Pavilion, glowing bell fountain, basin, steps, ivy and hanging vines, white flowering vine sprays, bushes, yellow wildflowers, stepping stones, trees, distant cliffs.
- **Lighting/FX details:** Glowing cyan fountain with sparkles and droplets, soft evening light, bloom.
- **Build components:**
  - Glowing bell/dome fountain in round basin — Blender mesh + emissive animated water shader + sparkle particles — garden pavilion, Glowwood spring, courtyard centre.
  - Open four-pillar pavilion with heavy cornice — Blender mesh — garden folly over a spring.
  - Hanging ivy fringe — alpha strand cards — lintels and eaves.
  - Stepping stones in grass — Blender mesh — garden paths.

### U90
- **Patterns:** Layered sandstone slabs (stacked flat bedding plates) in foreground; meandering river braids; hand-painted leaf clumps; columnar cliff face texture with vertical jointing.
- **Carvings & relief:** None man-made. Natural: tall sheer cliff with vertical joints and a ribbon waterfall falling from its lip; twin rock towers (butte spires) on the right; foreground ledge of flat stacked stone slabs; flat-topped mesa plateau with trees.
- **Edges & profiles:** Sharp cliff lip catching sunlight; rounded painterly slab edges with warm top highlights and cool shadow undersides; spire silhouettes.
- **Surfaces & materials:** Warm tan sandstone, blue-grey cliff granite with moss tufts, turquoise river water, white water foam, green and golden foliage.
- **Objects:** Cliff waterfall, plunge pool with foam, foreground slab ledge, small trees (golden, green, blue-green, purple-leaf), mesa plateaus, twin rock spires, river delta, rolling hills, distant mountains, clouds, flying creatures (silhouettes) — dragons/winged creatures.
- **Lighting/FX details:** Bright daylight, waterfall spray mist with sparkles, aerial perspective haze, soft cloud shadows.
- **Build components:**
  - Stacked-slab rock ledge (overlook) — Blender modular slab kit + painted normal — castle terrace overlooks, Glowwood cliff.
  - Cliff-lip ribbon waterfall with mist base — scrolling alpha shader + particles — falls off the floating castle island.
  - Twin butte spires — Blender mesh — distant skyline.
  - Painterly multicoloured tree set (gold, teal, violet) — leaf clump meshes — Glowwood variety.
  - Distant flying silhouettes — animated billboards — sky ambience (lantern-birds at night).

### U91
- **Patterns:** none architectural; natural stratified/horizontal rock banding on the spires; rough flagstone stair treads repeating up the slope; scattered boulder field along the shoreline.
- **Carvings & relief:** single free-standing fluted column fragment (broken shaft, flutes clearly visible, no capital, snapped diagonal top) at the stair foot — fully 3D; stair cut into the hillside (rock-cut steps, shallow risers).
- **Edges & profiles:** jagged needle-spire silhouettes; natural rock arch (pierced sea-arch) under the overhanging plateau lip; stair edges slightly rounded/worn; soft painterly rim light on rock tops.
- **Surfaces & materials:** grey-violet weathered stone column (matte, worn fluting); ochre/golden grass (dry moss look); brown sandstone pinnacles; still turquoise-to-lavender water with mirror reflections.
- **Objects:** broken fluted column; rock-cut winding stair; natural rock arch; floating rock shards/levitating stones (6–8 tapered spindle shapes) above the spires; boulders; shallow tidal pools; distant snowy peaks.
- **Lighting/FX details:** low cloud bands wrapping spires; sea mist at the arch; soft diffuse daylight, hazy aerial perspective; glassy reflection of sky in water.
- **Build components:**
  - Broken fluted column ruin — Blender mesh (24-flute shaft, boolean snap) + weathering normal map — Glowwood edges / approach path ruins.
  - Levitating spindle rocks — Blender mesh (3 variants) + shader bob/rotate in vertex shader — sky above the castle island / floating islands.
  - Rock-cut winding stair — Blender mesh with worn tread bevels — cliff paths down to lake.
  - Natural rock arch — Blender sculpt + tri-planar rock shader — shoreline / moat.
  - Low cloud ring wrapping spires — billboard/particle fog sheets — around tall towers at night.

### U92
- **Patterns:** irregular flagstone path (crazy paving) in foreground; meadow wildflower scatter (white umbels, blue forget-me-not-like clusters, orange blooms).
- **Carvings & relief:** distant cliff-top citadel with many conical spires and a tiered keep on a needle peak — too small for carving; reads as stacked pinnacled towers (fully 3D massing).
- **Edges & profiles:** needle-spire roofs on citadel; flat-topped mesa cliffs; soft rounded grassy ridgelines; mossy stone slabs with rounded edges.
- **Surfaces & materials:** lush green grass (painterly, wind-swept); grey granite cliffs; mossy flagstones; pale stone citadel walls.
- **Objects:** umbrella/flat-topped acacia-like tree (gnarled leaning trunk); small round-crowned trees; mossy rock slabs; footpath; river meandering through valley; mountain citadel; waterfall-ish white specks; bird in flight; distant ruined tower on right peak; figure (walker with backpack).
- **Lighting/FX details:** bright day; cumulus clouds; light haze in valley; cloud bank partly occluding citadel.
- **Build components:**
  - Crazy-paving flagstone path — decal/tiling texture + normal map, Blender low-relief stones — garden paths in Glowwood / castle grounds.
  - Leaning umbrella tree — Blender mesh with alpha-card canopy — hilltops around the castle.
  - Wildflower clusters (blue/white/orange) — instanced alpha-card meshes — meadows, ring walkway planters.
  - Pinnacle citadel silhouette — low-poly far-distance mesh/impostor — skyline backdrop.

### U93
- **Patterns:** repeated tall lancet slit windows along the curtain wall; repeating crenellation rhythm on every tower top; vertical hanging banners in alternating magenta/red; banner emblem = stylised tree/trident sigil (a stem with three upward curled branches enclosed in a curved bowl) – repeat motif on banners.
- **Carvings & relief:** blind pointed arcading at wall bases (tall narrow pointed niches, shallow relief); large pointed gate arch with a deeply recessed arch ring (multiple order archivolt, deep relief); corbelled bartizans under crenellations (stepped corbel courses, deep relief).
- **Edges & profiles:** rectangular merlons with crenels; corbelled parapets projecting on stepped corbels (machicolation-like); pointed equilateral gate arch; buttress-like pilasters with sloped (weathered) tops; chamfered wall bases; strong sunlit edge highlights on corbel tiers.
- **Surfaces & materials:** blue-grey ashlar stone, matte, large blocks; fabric banners (felt/silk, magenta, crimson); worn cracked stone flag paving in the square with grass in joints; timber wagons.
- **Objects:** monumental gatehouse with twin towers; curtain wall; hanging long vertical banners with sigil; cage wagon (wooden barred crate on wheels) drawn by a horned beast; covered cart; spear/pole-arm figures; tall pennant staffs; market stall awning with poles (right); giant stone golem colossus (background); orange-magenta autumn tree; distant multi-tower keep; townhouses with gables seen through gate.
- **Lighting/FX details:** strong raking sunlight through the gate creating a light shaft on the paving; atmospheric bluish haze; floating petal/leaf particles; misty base to the colossus.
- **Build components:**
  - Corbelled crenellated parapet (stepped corbel table + rectangular merlons) — Blender mesh modular kit — castle gate towers, ring walls.
  - Deep-order pointed gate arch — Blender mesh with 3 receding arch rings — main castle gate.
  - Long vertical sigil banner — cloth mesh + vertex-shader wind + decal emblem (tree/trident sigil reworked as birthday crest) — gate towers, ballroom walls.
  - Blind lancet arcade wall panel — normal map + shallow mesh — lower curtain walls.
  - Cracked flag paving with grass joints — tiling texture + normal map + grass decals — courtyard / castle square.
  - Barred cage wagon / covered cart — Blender mesh props — market square dressing.

### U94
- **Patterns:** circular floor medallions (concentric ring inlays) set into stone paving; straight inlaid stone path strips crossing grass; terraced travertine pools (stacked rimstone basins); vertical ribbing on the cliff façade.
- **Carvings & relief:** cliff-carved temple façade with a giant ogee/lancet portal flanked by tall buttress-pilasters and a crowning pointed finial/gable (deep relief, rock-cut); small domed shrine/pavilion (left) with arched doorway, engaged columns, cornice and a stone orb on top (fully 3D); ruined shrine (right) with arched niche frame and orb finial; pointed gable hood over the portal with vertical fins.
- **Edges & profiles:** pointed/ogee portal with multiple recessed orders; cornice with projecting moulding on the shrine; broken jagged ruin edges; rounded rim lips on terraced pools catching light.
- **Surfaces & materials:** pale limestone/marble, weathered with moss in crevices; emerald moss carpet; turquoise milky pool water; red-leaf trees; green mossy boulders.
- **Objects:** cliff temple portal; domed shrine with stone orb; ruined orb shrine; floating/glowing orb; terraced rimstone pools; circular floor medallions (inlaid ring discs); red-canopy umbrella trees (flat crimson discs on thin trunks — like dragon trees); waterfalls; violet flower beds; mossy rocks; drifting red leaves.
- **Lighting/FX details:** intense blue-white star glow in the portal with a vertical light beam; magenta/violet magic beam arcing from the orb across to the portal with pink sparkle burst; drifting red petals; mist rising from waterfalls; god-light from clouded sky.
- **Build components:**
  - Concentric floor medallion inlay — decal + normal map (ring grooves) with optional emissive ring shader — ring walkways, plaza centres.
  - Terraced rimstone pools — Blender mesh stacked basins + water shader — Glowwood springs / garden fountain cascade.
  - Orb-topped shrine pavilion — Blender mesh (domed cell, arched door, cornice, orb finial) — Glowwood shrines, path waystations.
  - Magic beam + sparkle burst — shader (additive ribbon) + particle — orb-to-portal puzzle effect / gate activation.
  - Crimson disc-canopy trees — Blender mesh (layered flat canopies) — Glowwood accent trees.
  - Cliff-cut ogee portal with star glow — Blender mesh + emissive core shader — secret grotto entrance.

### U95
- **Patterns:** wood shingle roof cladding on conical turret roofs (overlapping shingles, curled tips); orange clay tile roofs on village; repeating round-arched viaduct bays; half-timbering on houses.
- **Carvings & relief:** very little carving; timber brackets/struts holding projecting jettied storeys (fully 3D); stone arch bridge with piers and cutwaters.
- **Edges & profiles:** flared conical "witch hat" turret roofs with upturned eaves; jettied overhanging upper floors; semicircular bridge arches; ragged eaves.
- **Surfaces & materials:** weathered brown timber; wood shingles; rough cobbled masonry; terracotta tiles; stone bridge; foaming waterfall water.
- **Objects:** cliff-edge timber castle with clustered turrets; chimneys with smoke; flagpole with small pennant; multi-arch stone viaduct bridge; village of gabled houses; spired church tower; boats on lake; small waterfront houses; waterfalls (background and foreground); cliffs, forest.
- **Lighting/FX details:** chimney smoke plumes; waterfall spray mist; soft blue haze; overcast diffuse light.
- **Build components:**
  - Witch-hat shingle turret roof — Blender mesh (flared cone, shingle normal map + curled-tip geometry rim) — small towers, Glowwood cottages.
  - Jettied timber storey kit — Blender mesh with brackets — village houses below the castle.
  - Multi-arch stone viaduct — Blender modular arch + pier with cutwater — bridge across the moat/lake.
  - Chimney smoke plume — particle/sprite — village rooftops.
  - Waterfall spray mist — particle + scrolling foam shader — cliff edges of the castle island.

### U96
- **Patterns:** teal glazed roof tiles (pan/lapped tile rows) on multi-tiered roofs; half-timbered panel grid on walls; repeating dock planks; giant lily-pad discs.
- **Carvings & relief:** carved crossed gable finials (horn-like crossed bargeboards at gable peaks, Norse/Japanese hybrid) — fully 3D; carved ridge spikes; timber brackets under eaves; stone sluice-gate arches in the dam base.
- **Edges & profiles:** steep multi-tiered gable roofs with slight upturn; crossed bargeboard tips; deep overhanging eaves; spire tops; chunky stone dam buttresses with sluices.
- **Surfaces & materials:** teal/turquoise glazed ceramic tile (slightly glossy); dark brown timber; cream plaster infill; grey stone; rushing water; peach-pink mushroom caps.
- **Objects:** multi-tier pagoda-style hall; covered timber bridges/walkways on stilts; windmill/turbine; stone dam with sluice gates; wooden jetty; giant mushrooms (peach caps); giant lily pads; tall reed/foxglove flowers; cypress trees; flying skiff with sail-wings (airship boat); dragonfly-like gliders/birds; massive tree on islet; distant pagoda spires; waterfalls everywhere.
- **Lighting/FX details:** heavy waterfall mist; cool blue-teal ambient; soft back light; white spray.
- **Build components:**
  - Crossed-gable finial roof module (teal tile) — Blender mesh + tile normal map — Glowwood lodges / boathouse.
  - Giant peach mushroom caps — Blender mesh with emissive gill underside shader (night) — Glowwood.
  - Giant lily-pad platforms — Blender mesh discs — lake / moat stepping stones.
  - Stone sluice dam with arches — Blender mesh — castle island waterfall edge.
  - Winged sky-skiff — Blender mesh with cloth wings — floating decoration around the castle.
  - Stilted covered walkway — Blender modular — ring walkways over water.

### U97
- **Patterns:** stepped tiers on the temple tower (stacked set-back storeys); repeating dark window/niche openings on tower stages; repeated column rows in ruined colonnade; vertical chain/rope swag between posts (right).
- **Carvings & relief:** Mesoamerican/Khmer-like stepped temple with arched openings and cornice bands (deep relief, crumbling); colossal statue figure (left, carved into cliff — must be veiled/faceless in our game); tall slender tower with balustraded balconies; ruined arch (two columns + lintel arch) foreground right; statue on pillar top (right).
- **Edges & profiles:** stepped set-back profile; heavy projecting cornice bands; broken ruin silhouettes; round arch remains.
- **Surfaces & materials:** grey-brown weathered stone, moss-covered; purple bougainvillea-like flowering vines hanging off ledges; mist-soaked surfaces.
- **Objects:** stepped temple tower; slender balconied tower; ruined colonnade/columns standing in water; broken arch gateway; colossal cliff statue; statue on plinth; waterfalls (multiple); palm fronds and tropical foliage; post-and-chain/rope railing; figure.
- **Lighting/FX details:** heavy mist rising off falls; soft greenish glow on distant city (right); cloud break light.
- **Build components:**
  - Stepped set-back ruin tower — Blender mesh modular stage blocks — Glowwood lost-temple.
  - Purple flowering vine drapes — alpha-card meshes / decals — castle walls, arches.
  - Ruined colonnade in water — Blender columns (broken variants) — lake shallows.
  - Veiled colossal statue — Blender sculpt (hooded/veiled, no face) — cliffside guardian.
  - Waterfall mist layer — particles + fog volume — cliff edges.

### U98
- **Patterns:** Mesoamerican glyph blocks (rounded square cartouche glyphs) in a ring around the stone platform; stepped-fret/Greek key-like meander (xicalcoliuhqui) carved panels on cliff walls; concentric sun disc petroglyph painted in magenta (wheel with radiating dots); blue painted arcs/concentric rings on cliffs; stepped pyramid with horizontal step bands.
- **Carvings & relief:** circular glyph frieze ring incised into platform top (shallow relief); totem post with carved face (must be faceless — use abstract mask); carved stele pillars with stacked glyph panels (deep relief); fret-carved gateway lintels/door frames in cliff (deep relief); stepped pyramid shrine with crenellated roof comb.
- **Edges & profiles:** cracked rounded plateau edge; carved post tops (rounded caps); sharpened log stakes; stepped pyramid silhouette.
- **Surfaces & materials:** warm pink-tan sandstone, cracked, mossy; painted pigments (magenta, cyan) on cliff; wooden stakes; liana vines; rope bridges with wooden planks.
- **Objects:** circular rock platform; carved totem posts; sharpened stake posts lashed with vines; rope suspension bridges (plank + rope, two styles: plank walkway and single rope); stepped pyramid shrine; carved stele pillars; cliff doorways; palm trees; tree ferns; bare dead tree; birds swarm; jungle bushes.
- **Lighting/FX details:** strong diagonal god-ray shaft from upper right; thick mist in the chasm; bird flock particles.
- **Build components:**
  - Glyph cartouche ring inlay — decal + normal map (swap glyphs for birthday runes) — plaza floor / magic circle.
  - Stepped-fret (Greek key) carved panel — normal map / trim sheet — door surrounds, plinths.
  - Rope-and-plank suspension bridge — Blender mesh + cloth/curve sag — Glowwood chasms.
  - Painted petroglyph discs (glow at night) — emissive decal shader — cliff faces.
  - Carved stele pillar — Blender mesh + normal map — path markers.
  - God-ray shaft — volumetric cone shader — Glowwood clearings.

### U99
- **Patterns:** none man-made; repeated hanging moss strands; root tangles.
- **Carvings & relief:** none; natural gnarled roots and a fallen mossy trunk arching across the scene.
- **Edges & profiles:** massive sinuous branches; flat rock ledge at pool edge; distant waterfall slot.
- **Surfaces & materials:** thick yellow-green moss on bark; dark wet bark; mirror-still black water; mossy ground cover.
- **Objects:** giant ancient trees with buttress roots; fallen arching trunk; still forest pool; distant waterfall; ferns; flat stepping stone slabs; possible wooden platform (left tree).
- **Lighting/FX details:** floating cyan glowing wisps/spores (soft bokeh orbs, some with soft halos) drifting over water; dim shaft of light at the waterfall; misty greenish atmosphere; reflections.
- **Build components:**
  - Cyan firefly/wisp spores — GPU particles with additive soft sprites — Glowwood pools.
  - Moss-draped giant tree with buttress roots — Blender mesh + moss tri-planar shader — Glowwood.
  - Black mirror pool — planar reflection water shader — Glowwood.
  - Hanging moss strands — alpha-card meshes with sway shader — branches, bridge undersides.

### U100
- **Patterns:** none architectural; dense red foliage texture on cliffs; marble-like swirls on the giant planet.
- **Carvings & relief:** distant monolithic spire tower (sci-fi, jagged silhouette) with a circular portal ring (lens-like frame with glowing pearl orb in centre) — fully 3D.
- **Edges & profiles:** jagged dark cliff edges; ring portal with thick bevelled rim catching light.
- **Surfaces & materials:** dark slate cliffs; crimson moss/foliage; glassy translucent ring; pearl-white glowing orb; red grass.
- **Objects:** ring portal with central orb; tall spire; red bonsai-like trees; hanging roots/vines; rover vehicle (off-theme); suited figure (off-theme); stream/shallow river; giant planet/moon in sky.
- **Lighting/FX details:** strong warm backlight from planet; pink mist in valley; rim light on foliage. Mostly off-theme (sci-fi); usable: ring portal + giant moon.
- **Build components:**
  - Glass ring portal with floating pearl orb — Blender mesh (torus + inner disc) + fresnel glass shader + emissive orb — castle gate magic seal / tower top.
  - Giant marbled moon backdrop — sky shader / large textured sphere — night sky.
  - Crimson bonsai trees — Blender alpha-card canopy — Glowwood accents.

### U101
- **Patterns:** repeating small amber point lights along balcony rails; vertical panel seams and slot windows on the twin pylons; regularly spaced red indicator dots up the pylons.
- **Carvings & relief:** none ornamental; monumental chamfered pylons framing a central doorway with a glowing chevron/triangular lintel window (sci-fi brutalist); cantilevered terraces cut into cavern walls.
- **Edges & profiles:** heavy chamfered/bevelled pylon edges catching cool rim light; angular sloped buttress beams; flat balcony slabs with thin railings.
- **Surfaces & materials:** smooth concrete-like grey stone, matte; dark rock; glowing cyan glyph panels; crimson weeping foliage.
- **Objects:** twin pylons and central gate; glowing triangular transom window; cyan glowing wall panels/shrine boxes; cliff terraces with lit windows, railings and lamps; weeping crimson trees (willow-like, drooping red leaves) — many; ground candle clusters/small campfire lights scattered on cavern floor; rocks; a crate/altar block with fire; figures (small); light-cable/zipline streak.
- **Lighting/FX details:** dense teal volumetric fog; cool top light; warm amber pinpoint lights contrasting; cyan emissive panels; blue light-streak trail.
- **Build components:**
  - Weeping crimson tree — Blender mesh with drooping alpha-card fronds + sway shader — Glowwood / ballroom garden atrium.
  - Ground candle cluster — instanced small mesh + emissive flicker shader — Glowwood paths, castle crypt.
  - Glowing chevron transom over gate — emissive shader on mesh — castle gate / inner sanctum door.
  - Teal volumetric fog layer — height-fog shader — Glowwood hollows.

### U102
- **Patterns:** vertical board-and-batten planking with diagonal cross-bracing (X/Z barn bracing) on sheds; wooden shingle roofs, deliberately warped; mullioned window grids; plank decking.
- **Carvings & relief:** round porthole windows with thick wood rims (deep relief); carved wooden sign board over shed door; crude dormer with arched hood; zig-zag (Z) brace frames.
- **Edges & profiles:** wonky, sagging gable roof lines; chunky bevelled plank ends; bowed planks; thick toon-like rounded edges with warm highlights.
- **Surfaces & materials:** stylised painted wood (orange-brown, red-painted barn boards), matte; brass fittings (lamp, horn, dial knobs); grey stone slabs; teal water.
- **Objects:** crane with orange arm and claw grabber; red barn/boathouse; small shed with sign; brass lamp post with bulb; brass gramophone-horn/speaker; winch/generator boxes; cable spool drum; tripod spotlight; wooden dock/pier with posts; picket fence; stilt platform balcony with railing; cubic-canopy trees (square leaf blocks); stylised pines with drooping layered tiers; rusted car; target-marked robot/scrap machine; reeds; floating planks; stone slab; stepping logs; gear wheel; signs; sticky notes.
- **Lighting/FX details:** warm golden sunset backlight; long shadows; atmospheric depth haze; shallow depth-of-field blur at edges.
- **Build components:**
  - Board-and-batten wall with X bracing — Blender modular + wood normal map — stables, boathouse by the lake.
  - Porthole window with thick wood rim — Blender mesh — boathouse, tower doors.
  - Brass lamp post with round bulb — Blender mesh + emissive bulb — docks, ring walkways.
  - Tiered drooping stylised pine — Blender low-poly mesh — forest edges.
  - Plank dock on posts — Blender modular — lake jetty.
  - Wonky shingle roof — Blender mesh with sculpted sag — village cottages.

### U103
- **Patterns:** striped awnings (orange/cream stripes) on shopfronts; cobblestone/flagstone square paving; half-timber framing; window boxes; scalloped awning edges.
- **Carvings & relief:** tall narrow gabled house with a pointed-arch (lancet) mullioned upper window and an arched door below; curved projecting balcony with wrought-iron railing; round oculus window; shop sign fascia board (lettering).
- **Edges & profiles:** steep pointed gables; flared tower roofs; scalloped awning valances; round arched doorways; stepped stairs.
- **Surfaces & materials:** coral/salmon plaster, teal painted wood, slate roofs, wrought iron, warm stone paving; moss blocks.
- **Objects:** striped awnings; produce crates (fruit stalls); round planters with shrubs; circular fountain pool; hanging lanterns/paper globe lights strung on wires; floating cloud-shaped lamps; cubic topiary trees; street lamps; stairway with railing; balcony flower boxes; hanging gondola/cable baskets; cart.
- **Lighting/FX details:** soft blue-teal ambient; warm interior window glow; hanging globe lights.
- **Build components:**
  - Scalloped striped awning — Blender mesh + stripe texture — market stalls in castle town.
  - Narrow lancet-window gable house — Blender modular — castle town streets.
  - Floating paper globe lanterns on wires — Blender mesh + emissive + gentle bob shader — festive birthday streets/courtyards.
  - Round stone fountain basin — Blender mesh + water shader — town square.

### U104
- **Patterns:** (panel 2) 8-pointed star/compass inlay in gold around the crystal plinth — interlocking gold arcs forming a sunburst/compass-rose frame on stone paving; concentric ring floor; (panel 3) circular segmented wheel floor with radial spokes and a ring of runes; (panel 4) cobbled paving; scalloped clay roof tiles; (panel 1) iron spike rows.
- **Carvings & relief:** (1) gothic stone arch with spiked iron gate, skull-like corbels on parapet (replace with faceless ornaments), blue-glowing candles on parapet; (2) ornate shopfronts with diamond panels and gold trim; (3) carved round wooden hatches; (4) tiered stone fountain with bowl and pedestal.
- **Edges & profiles:** gold edge piping on star inlay; chunky rounded hand-painted bevels; pointed arch; spiked railing tips; scalloped roof ridge.
- **Surfaces & materials:** violet glowing crystal cluster (translucent, glossy); polished pale stone with gold inlay; orange sandstone; dark blue stone; wrought iron; wood.
- **Objects:** amethyst crystal cluster on round plinth; wrought-iron gates; benches; banners; potted plants; street lamps; spiked iron fence; blue spirit candles; round wooden hatches/trapdoors; tiered stone fountain; cottage houses with dormers.
- **Lighting/FX details:** cyan candle flames; crystal glow; bright stylised daylight.
- **Build components:**
  - Gold-piped compass/star floor inlay around a crystal — decal + normal map + metallic gold shader — castle courtyard centrepiece / ballroom floor.
  - Amethyst crystal cluster on plinth — Blender mesh + translucent emissive crystal shader — courtyard, Glowwood.
  - Spiked wrought-iron fence with blue candles — Blender mesh + emissive flame — moat bridge railings.
  - Rune ring wheel floor — decal + emissive rune shader — magic circle / portal plaza.
  - Tiered stone fountain — Blender mesh + water — town square.

### U105
- **Patterns:** carved spiral/meander glyph disc (concentric maze-like relief) on round stone dais; ring of chunky stone blocks around dais; gold glowing runes on stone blocks.
- **Carvings & relief:** circular carved altar disc with swirling scroll/meander relief (shallow relief); ring portal of segmented stone voussoirs (fully 3D, floating blocks); Chinese-style pagoda shrine with upturned eaves (background); carved glyph stones.
- **Edges & profiles:** rounded pillowy stone block edges; circular voussoir ring; upturned pagoda eaves.
- **Surfaces & materials:** dark slate stone, worn; gold emissive rune inlay; mossy greenery through portal; roots creeping over dais.
- **Objects:** circular stone ring portal; carved disc dais; rune stones; pagoda shrine on floating rock; roots/vines; hanging ropes; floating island with green tree seen through portal.
- **Lighting/FX details:** warm sunset backlight through portal; gold rune emission; mist below.
- **Build components:**
  - Segmented-block ring portal (floating voussoirs) — Blender mesh + slow rotate shader — Glowwood portal / castle sky gate.
  - Carved meander disc dais — Blender mesh + normal map — teleport pad on ring walkways.
  - Gold glowing rune stones — mesh + emissive decal — path markers.
  - Upturned-eave pagoda shrine — Blender mesh — floating island far decor.

### U106
- **Patterns:** circular stone platform with faint concentric rings and radial cracks; dry-stone wall blocks; barrel staves and hoops.
- **Carvings & relief:** little; wooden timber-frame stalls with thick beams; arched plank doors.
- **Edges & profiles:** chunky rounded cartoon stone bevels; thick wooden beam ends; flat round platform rim.
- **Surfaces & materials:** warm sandstone cliffs; wood; pink crystal shard (glowing); glowing paper/hot-air balloon lanterns (pink, translucent); grass tufts.
- **Objects:** circular stone stage platform; floating glowing pink lantern-balloons (hot-air-balloon shaped, with gondola baskets); magenta crystal; small cabin with lit windows; workshop stall with roof garden; barrels; wooden benches; clay pots/jugs; lanterns on posts (orange); hanging lamps; blue-glowing orb device (robot-ish, off-theme); forge/oven glow; arched wooden door; stairs; distant village lights; moons/planets; snowy mountain; lake.
- **Lighting/FX details:** night sky with stars; warm orange window glow vs cool blue night; glowing balloons (pink inner light); blue orb glow; forge glow.
- **Build components:**
  - Glowing hot-air-balloon lanterns — Blender mesh + translucent emissive shader + drift — night sky above castle.
  - Circular stone stage with ring grooves — Blender mesh + normal map — ring walkways / party stage.
  - Lit wooden stall with roof garden — Blender mesh — Glowwood market.
  - Orange orb lantern on post — mesh + emissive — paths.
  - Barrel + clay pot prop set — Blender mesh — dressing everywhere.

### U107
- **Patterns:** stacked stone block masonry on mushroom-tower trunk; plank boardwalk; spiral of balconies.
- **Carvings & relief:** arched windows in tower trunk; wooden balcony rings with railings wrapping the tower (fully 3D).
- **Edges & profiles:** giant domed mushroom cap roof (violet) with gill underside; small mushroom-cap roofed side pods; rounded rock edges.
- **Surfaces & materials:** stone tower, violet mushroom caps (glossy), wood boardwalks, rope.
- **Objects:** giant mushroom-tower house; mushroom-capped balcony pods; hot-air/lantern balloons (orange/pink) floating; wooden plank bridge; ladders; rope lines; flowers (orange, red, purple puffballs); violet giant mushroom trees in distance; rock pillars; figure.
- **Lighting/FX details:** bright daylight, soft haze; floating balloons.
- **Build components:**
  - Mushroom-cap tower house — Blender mesh (stone trunk + violet cap with emissive gills at night) — Glowwood landmark.
  - Wraparound wooden balcony ring — Blender modular — tower exteriors.
  - Lantern balloons — mesh + emissive — sky.
  - Plank footbridge — Blender modular — Glowwood streams.

### U108
- **Patterns:** none geometric; layered petal/leaf clusters in canopy.
- **Carvings & relief:** none; organic hollow tree forming a circular window/moon-gate frame.
- **Edges & profiles:** huge circular opening through a twisted trunk (moon gate shape); jagged floating rock islands.
- **Surfaces & materials:** violet-purple bark; pink blossom foliage; glass dome (transparent bell jar) over floating island; green meadow beyond.
- **Objects:** giant arching tree with circular opening; hanging lanterns on long chains/strings (Japanese-style red lanterns with tassels); hanging pendant charm; floating island under glass dome with small tree; thin waterfall strings from island; rope bridges/lines between rock spires; seated figure; small waterfalls; glowing blue spore dots; crescent moon carved/marked on bark.
- **Lighting/FX details:** dusk purple-pink gradient; red lantern glows; soft rim light through opening; falling pink petals; blue sparkles at base.
- **Build components:**
  - Floating island in glass dome (terrarium) — Blender mesh + glass fresnel shader — castle tower top / ballroom centrepiece.
  - Hanging tasselled lanterns on long chains — Blender mesh + emissive — Glowwood branches, bridge undersides.
  - Moon-gate tree arch — Blender sculpt — Glowwood entrance.
  - Falling petal particles — GPU particles — Glowwood / courtyard.

### U109
- **Patterns:** fractal coral-like rock growth; swirling marbled strata; reticulated/wormy relief on cliffs (organic baroque rock).
- **Carvings & relief:** cliffs sculpted like huge flowing grotesque organic forms (deep relief); stacked flat mesa slab rock steps.
- **Edges & profiles:** spiky pinnacle crowns on rock; rounded pillow slab edges; dripping edges.
- **Surfaces & materials:** pastel pink/lavender stone; teal-blue rock; dark brown root-tangled pod stone; pink dust/powder.
- **Objects:** flying lighthouse tower with dangling root legs (lantern cage top, searchlight); root-wrapped floating pod stone; mesa steps; pink smoke; floating debris.
- **Lighting/FX details:** strong pink volumetric smoke/dust clouds; searchlight cone from lantern top; god rays; white sparkle motes; flying debris particles.
- **Build components:**
  - Searchlight lantern cone — volumetric cone shader — castle lighthouse tower on the lake.
  - Pink magic smoke plumes — particle/volumetric sprite — magical events, fireworks aftermath.
  - Swirl-strata rock surface — tri-planar procedural shader — Glowwood cliffs.
  - Floating root-wrapped boulder — Blender mesh — sky islands.

### U110
- **Patterns:** blocky cubist stone voussoirs on the arch with gold/rust tipped crowns; stepped stair; spiral scroll carved on a stone block (lower left).
- **Carvings & relief:** chunky stone arch gateway with jagged block crenellation (fully 3D); stone guardian/sentinel robots on plinths (mask-like, faceless-friendly — single eye lens); spiral carved block (shallow relief); broken boat/ship ribs.
- **Edges & profiles:** faceted, chipped cubist block edges with copper-orange top highlights.
- **Surfaces & materials:** pale blue-grey stone; rust-red ivy/creeper; red autumn foliage.
- **Objects:** ruined stone arch; stone stairway; sentinel statues on pedestals; red bushy trees; ship hull ribs/wreck; floating stone ruins in background; drifting leaves; crystalline sword/blade objects; figures.
- **Lighting/FX details:** lavender haze; drifting red leaves; soft back glow.
- **Build components:**
  - Faceted chunky-block arch with gilded tips — Blender mesh — Glowwood ruins / garden gates.
  - Red creeper ivy decal — alpha-card + decal — walls and arches.
  - Hooded/one-lens sentinel statue on plinth — Blender mesh (faceless) — bridge entrances.
  - Spiral-carved block — normal map — plinths.

### U111
- **Patterns:** swirling organic relief on cliffs (grotesque wave/scroll forms, deep relief); marbled terraced pools.
- **Carvings & relief:** giant baroque organic carvings in cliff (mask-like whorls — use as abstract scroll, no faces); lighthouse with mushroom-cap roof and gallery railing; twisted bonsai trees on ledges.
- **Edges & profiles:** railing ring on lighthouse gallery; lumpy pinnacle crests; terraced plateau edges.
- **Surfaces & materials:** violet/indigo rock; pink haze; teal pools; gold-bronze lighthouse cap; tree bark.
- **Objects:** mushroom-roof lighthouse on rock pedestal with gallery railing; floating stone basin/bowl (foreground); twisted bonsai trees; long cloud-shaped floating forest island; floating rock islands; terraced pools; coral twigs; chimney smoke from distant house.
- **Lighting/FX details:** huge yellow searchlight beam wedge; pink volumetric light flood and smoke; sparkle motes in water.
- **Build components:**
  - Mushroom-cap lighthouse with gallery railing — Blender mesh + rotating beam shader — lake lighthouse.
  - Swirl-relief cliff panels — sculpt + normal map — Glowwood canyon.
  - Twisted bonsai tree — Blender mesh — terraces.
  - Floating bronze basin — Blender mesh — fountain on ring walkway.

### U112
- **Patterns:** none architectural; ribbed scallop shells, spiral conch shells; palm fronds.
- **Carvings & relief:** none (UI overlay with icons — ignore).
- **Edges & profiles:** jagged rock spires; curving palm trunk.
- **Surfaces & materials:** pink sand beach; dark violet water with sparkle; glossy shells.
- **Objects:** scallop shells, conch/spiral shells, starfish, coral sprig, pink flowering shrubs, leaning palm tree, red toadstool trees, beached wooden rowboat, rocks, distant castle spires in haze, rainbow, giant shell-house islet, figures (UI portraits — ignore).
- **Lighting/FX details:** sunset backlight; rainbow; water glints; purple dusk palette.
- **Build components:**
  - Scallop/conch shell props — Blender mesh + iridescent nacre shader — lake shore, fountain trim.
  - Beached rowboat — Blender mesh — lake shore.
  - Rainbow arc — shader billboard — birthday sky event.

### U113
- **Patterns:** irregular flagstone/crazy-paving terrace floor; curling tendril scrollwork (wrought-iron-like vine curls) along terrace edges; rope swags between posts.
- **Carvings & relief:** carved stone pillars with bulbous turned bases, ring collars and flared capitals supporting a mushroom-shaped canopy (fully 3D); finial posts topped by bird-like weathervane silhouettes (use as abstract crest); vine-wrapped stone pedestal; distant gothic castle with lantern-crowned spire, onion/bell cupola, crenellated tower.
- **Edges & profiles:** baluster-like turned column profiles; stepped crenellations on distant tower; spire with finial and flag; rope catenaries.
- **Surfaces & materials:** dark slate stone, warm sunlit flagstones; moss patches; red-cap stalk mushrooms; pink/purple glowing flower buds.
- **Objects:** mushroom-canopy pavilion pillars; hanging tattered banners/pennants on poles; rope barrier swags; tall stalk mushrooms with red conical caps; carnivorous-plant-like bulb flower; fern fronds with red tips; glowing blue firefly orbs; distant castle with spires, onion domes; hanging lamp; figures (ignore).
- **Lighting/FX details:** warm sunset bloom backlight; violet ambient; small pink emissive flowers; blue-green fairy-light orbs.
- **Build components:**
  - Turned stone pillar with collar rings — Blender lathe mesh — terrace pavilions, ring walkway lamp posts.
  - Tendril scroll iron edging — Blender curve mesh / alpha decal — terrace and balcony edges.
  - Tall red-cap stalk mushrooms — Blender mesh + emissive spots — Glowwood.
  - Glowing bud flowers — instanced mesh + emissive — garden borders.
  - Rope swag barrier — curve mesh — viewing terraces.

### U114
- **Patterns:** wood-shingle / slate fish-scale-like roof cladding over thick rolled roofs; stonework of a gate bridge; bunches of conical spires.
- **Carvings & relief:** roofed bridge-gate with round arch passage (fully 3D); clusters of slender needle spires on tower tops; dormers.
- **Edges & profiles:** thick, eroded rounded "thatch-like" shingle roof edges glowing gold in sunlight; tall needle spire silhouettes; semicircular gate arch.
- **Surfaces & materials:** sunlit golden shingles; blue-shadowed stone; mossy green ground; ivy/vegetation on walls.
- **Objects:** gatehouse bridge over a gorge; conical roofed round hut/turret; distant fairy-tale castle spires; street lamp under arch; trees (pines/palms), grasses, mist river.
- **Lighting/FX details:** strong golden god rays from upper left; rising river mist; cool blue shadows vs gold highlights.
- **Build components:**
  - Rounded-eave shingle roof with gold rim light — Blender mesh + shingle normal map — village and gatehouse roofs.
  - Covered bridge-gate with arch — Blender mesh — gorge crossing to Glowwood.
  - Needle spire cluster — Blender mesh — castle roofline.
  - River mist ribbon — particle/fog card — gorge.

### U115
- **Patterns:** horizontal red/white bands on the lighthouse; swirling marbled strata relief on cliffs (spiral whorls); radiating ribs on the parasol lantern roof.
- **Carvings & relief:** lighthouse with parasol/umbrella-shaped striped roof and gallery railing (fully 3D); large weathered monolith heads/blocks (keep faceless); distant temple ruins with tall stelae/pillars and arched pavilion; twisted serpentine dead tree.
- **Edges & profiles:** railing ring; umbrella roof scalloped rim; blocky chipped monolith edges.
- **Surfaces & materials:** layered striated rock with swirl pattern; glossy translucent glass dome sphere (huge bubble shield); dry grass; blue snowy peak.
- **Objects:** striped lighthouse; giant transparent bubble dome; mushroom-canopy trees (flat tiered) on plateau; stone monoliths; distant pillar ruins; small domed hut; twisted tree with green glowing light on top; grass tufts.
- **Lighting/FX details:** sun bloom; lighthouse beam wedge; bubble refraction/fresnel; haze.
- **Build components:**
  - Giant fresnel bubble dome — sphere + fresnel/refraction shader — protective dome over castle island at night.
  - Striped lighthouse with parasol roof — Blender mesh — lake shore.
  - Swirl-strata rock — tri-planar shader — cliffs.
  - Twisted serpentine tree with glow — Blender mesh + emissive tip — Glowwood.

### U116
- **Patterns:** none detailed; layered sedimentary bands on rock pillars.
- **Carvings & relief:** distant castle/towers in pale cyan dissolving into fragments, rising toward an inverted dark floating island (fully 3D blocks); stone stairs/bridge path in foreground.
- **Edges & profiles:** fragmented, crumbling block silhouettes; slender towers with pointed roofs.
- **Surfaces & materials:** sandy orange rock; pale teal ghostly castle; dark rocky underside of floating island.
- **Objects:** floating inverted island; disintegrating castle blocks drifting upward; red comet/flare projectiles with trails; small red-roof cottages on rock pillars; windmill; waterfalls cascading off pillars; sea of clouds; stone causeway with debris; figure with staff.
- **Lighting/FX details:** bright cyan sky; cloud sea; flare trails; debris particles.
- **Build components:**
  - Disintegrating/levitating block tower — Blender fractured mesh + vertex animation — magic reveal sequence of castle.
  - Cloud sea — layered noise shader plane — under the floating castle island.
  - Comet trail flares — particle ribbons — firework/celebration sky.
  - Cottage-on-rock-pillar — Blender mesh — far scenery.

### U117
- **Patterns:** fish-scale overlapping scales on the giant floating fish (scallop/imbricate pattern) — usable as fish-scale roof tile motif; stacked block masonry in ruins.
- **Carvings & relief:** colossal ruined stone arches and trilithon-like pillars (fully 3D, painterly); broken round arch on right; monolithic pillars; small figurine/pawn statues on ground.
- **Edges & profiles:** chunky angular ruined edges with warm top lighting and cool shadow; semicircular arch.
- **Surfaces & materials:** warm ochre sandstone; violet shadowed stone; fluffy painterly clouds.
- **Objects:** giant floating fish (creature — skip face) with fish-scale body; small flying fish; arch ruins; pillars; tilted giant slab; rock monoliths; gravestone-like stelae; small white figurines; bird silhouettes; figures (ignore).
- **Lighting/FX details:** golden sun raking; cloud wisps trailing.
- **Build components:**
  - Fish-scale (imbricate) tile pattern — normal map / tile texture — tower roofs.
  - Ruined colossal round arch — Blender mesh — approach landscape.
  - Leaning monolith pillars — Blender mesh — sky island edges.

### U118
- **Patterns:** horizontal red bands on lighthouse; layered strata on cliffs.
- **Carvings & relief:** tapered round lighthouse with parasol cap and lantern gallery; distant temple pillars.
- **Edges & profiles:** cylindrical tower with gallery ring and umbrella roof; tall cliff pillars.
- **Surfaces & materials:** pink-tinged stone cliffs; blue sea; moss.
- **Objects:** lighthouse on cliff; floating parachute/umbrella flyers; giant orange coral/shell growth; mushroom trees; waterfall; islands; birds.
- **Lighting/FX details:** lighthouse searchlight beam; dawn haze; sparkle on sea.
- **Build components:**
  - Lighthouse beam (rotating volumetric cone) — shader — lake lighthouse.
  - Parasol flyer lanterns (drifting umbrella lights) — mesh + emissive + drift — sky.
  - Giant coral fan — Blender mesh — lake shore.

### U119
- **Patterns:** circular ring arches repeated in ruins (round O-shaped hoops on top of walls); terraced orange cliff layers.
- **Carvings & relief:** ruined temple wall with large circular ring openings (moon-gate rings) and arched windows (deep relief); floating rock chunks; stele pillars.
- **Edges & profiles:** full circle ring silhouettes; layered plateau lips with overhanging moss.
- **Surfaces & materials:** terracotta/orange stone; green moss; dark pine foliage.
- **Objects:** ring-arch ruins; umbrella pine/bonsai-like trees with flat leaf pads; glowing blue-violet crystal shrubs (sparkly); floating rock islands; terraced cliffs.
- **Lighting/FX details:** blue-violet glowing sparkle bushes; teal sky; soft haze.
- **Build components:**
  - Glowing crystal shrub — instanced mesh + emissive sparkle shader — Glowwood undergrowth.
  - Moon-gate ring ruin wall — Blender mesh — Glowwood ruins / garden.
  - Flat-pad umbrella pine — Blender mesh — terraces.

### U120
- **Patterns:** dense scales and spine ridges on the creature (fish-scale imbricate); ice/frost crust on rocks.
- **Carvings & relief:** none architectural (dragon creature — skip face; only usable as serpent-scale motif).
- **Edges & profiles:** jagged dorsal spines (sawtooth crest); sinuous antler-like horns.
- **Surfaces & materials:** wet dark rock; frost-whitened foliage; glowing turquoise river; glass sphere/bubble near figure.
- **Objects:** serpent dragon (skip); river canyon; snow-dusted trees; rocks; glass orb/bubble; figure (ignore).
- **Lighting/FX details:** strong cool blue god rays slanting through canopy; luminous turquoise water; mist.
- **Build components:**
  - Luminous turquoise river shader — water shader with emissive depth — Glowwood stream at night.
  - Slanting god-ray shafts — volumetric cone/billboard — Glowwood canopy.
  - Frost-dusted foliage — shader variant (top-facing white) — winter area / mountain path.

### U121
- **Patterns:** palm frond radial leaves; monstera split-leaf foliage; feathery red coral-like fern fronds (pinnate plumes) trailing across the beach; wave curl crests.
- **Carvings & relief:** none decorative; overgrown ruined steel tower/bridge pylon (rusty lattice girders draped with vines) — off-theme.
- **Edges & profiles:** towering sea-stack pillars with overhanging jungle tops; curling wave barrel with white foam lip.
- **Surfaces & materials:** white sand; turquoise translucent surf; green jungle; rusted metal; misty waterfalls off sea stacks.
- **Objects:** coconut palms; monstera/elephant-ear plants; magenta daisy-like flower clumps; red plume vines (coral-fern); sea stacks with waterfalls; ruined lattice tower; mechanical creatures (skip); figure (ignore); rocks.
- **Lighting/FX details:** bright tropical sun; spray mist; crisp wave foam.
- **Build components:**
  - Red plume fern vine (feathery coral fronds) — alpha-card mesh + subtle emissive at night — Glowwood ground cover / lakeside.
  - Sea-stack island with waterfalls — Blender sculpt + waterfall shader — lake islands around castle.
  - Magenta flower clumps — instanced cards — beds along ring walkways.
  - Breaking-wave foam — shader — lake shore (calm version).

### U122
- **Patterns:** stepped concentric semicircular stairs (amphitheatre steps) down to pool; organic pierced lattice/fretwork in carved stone (root-like openwork tracery, similar to Art Nouveau/organic jali); lily pads; vertical stacked ring stacks (carved "vertebra" columns at left edge).
- **Carvings & relief:** organic carved arches over cave doorways with pierced openwork (deep relief/fully 3D); tall carved stone spire-statue (totem obelisk with twisted rope/spiral fluting and bulbous figure — render faceless) (fully 3D); carved stone balustrade bowls holding yellow flowers (planters); stone ringed pool edge with rounded lip.
- **Edges & profiles:** rounded coping on reflecting pool; curving terrace kerbs; organic sinuous profiles everywhere; shallow semicircular step edges.
- **Surfaces & materials:** warm sandstone/sculpted tan stone, slightly glossy where wet; dark reflective pool water; green lawn; orange-yellow blooms; blue crystal/lupin-like flowers.
- **Objects:** reflecting pool with lily pads; semicircular stair; carved cave doorways; carved obelisk statue; flower urns/planters; blue spiky flowers (lupin/delphinium or crystal flowers); orange flowering shrubs; mossy rocks; trees; distant waterfall; distant tall rock spires; small bridge in distance.
- **Lighting/FX details:** soft daylight; mirror reflections in pool; atmospheric depth.
- **Build components:**
  - Organic pierced-stone arch (root openwork) — Blender sculpt + alpha-cut — Glowwood temple doors.
  - Reflecting pool with rounded coping + lily pads — Blender mesh + planar reflection shader — castle garden / ring walkway centre.
  - Semicircular amphitheatre steps — Blender mesh (array) — garden descents.
  - Spiral-fluted obelisk — Blender mesh — garden focal point.
  - Blue spiky crystal flowers — mesh + emissive — Glowwood beds.

### U123
- **Patterns:** flagstone path with terracotta/brick inlaid curving band (curvilinear brick strip outlining the stones); dry-stone rubble masonry on pillar and cliff wall; horizontal red bands on white towers; voussoir rings on ruined aqueduct arches.
- **Carvings & relief:** finial post sculpture: forged/carved stylised trident-tree crown with stacked chevron arrows (double inverted V chevrons) on a ringed shaft (fully 3D) atop a mossy rubble pillar; white domed watchtower with red bands and ribbed dome + finial; ruined round arches (viaduct/aqueduct) on left; temple complex with red tiled roofs atop rock crown; colonnade/statue pillars (figural columns — must be veiled); stone pavilion with pitched slab roof on columns; rock arch bridge (natural mushroom-topped pillar).
- **Edges & profiles:** jagged crown-shaped rock rim (like a broken eggshell) encircling a hidden temple; slender ribbed domes; semicircular arches; chunky flagstone edges with moss.
- **Surfaces & materials:** pale limestone/marble cliffs, weathered with moss; whitewashed towers with terracotta banding; rusted iron/bronze finial; terracotta brick inlay; autumn orange conifers; pines; mist.
- **Objects:** chevron finial post; rubble pillar; banded watchtower; ruined arches; hidden temple; columned pavilion; natural rock bridge; stone railings/balustrade on bridge; orange larch-like conifers; ferns; long grass; distant purple mesas; snowy peaks.
- **Lighting/FX details:** heavy valley mist; bright sky bloom; warm sun on rocks.
- **Build components:**
  - Chevron-crowned finial post (forged bronze) on rubble pillar — Blender mesh — castle path markers / ring walkway gates.
  - Flagstone path with curving brick inlay band — tiling texture + decal + normal map — castle approach path.
  - White ribbed-dome watchtower with red bands — Blender mesh — curtain wall corners.
  - Rubble dry-stone wall — normal map + displacement mesh — terrace walls.
  - Ruined aqueduct arches — Blender modular — valley backdrop.
  - Valley mist volume — fog card stack — below the castle island.

### U124
- **Patterns:** stacked stone block column bases; flute/carved twisted columns in rock-cut temple façade; flagstone path.
- **Carvings & relief:** rock-cut temple façade with round arched portal, engaged twisted (Solomonic) columns, entablature with carved corbels and cornice (deep relief) cut into cliff; sculpted guardian statues on stacked-stone pedestals (horned ram-like heads — replace with faceless veiled guardians); carved winged figure.
- **Edges & profiles:** semicircular arch with roll moulding; projecting entablature cornice; stacked block pedestals with chamfered courses.
- **Surfaces & materials:** honey sandstone; mossy edges; weathered stone statues; orange autumn conifers.
- **Objects:** guardian statues on pillars; rock-cut temple; arched doorway; orange cypress-like trees; flowering rhododendron bush (pink flowers); grass; stepping stones; floating rock pinnacles; magic purple beam from tower on distant peak; sparkle swarm in sky.
- **Lighting/FX details:** magenta/violet energy column with orange halo rising from distant peak; golden sparkles; sea of clouds.
- **Build components:**
  - Rock-cut façade with Solomonic twisted columns — Blender mesh — Glowwood cliff temple / castle crypt entry.
  - Veiled guardian statue on stacked-block pedestal — Blender sculpt — castle gate approaches.
  - Magic beacon beam (violet with warm halo) — volumetric shader + particles — tallest castle spire at night.
  - Orange flame-shaped conifer — Blender mesh — Glowwood edges.

### U125
- **Patterns:** carved panel bands along the huge fallen pillar/beam (rectangular coffered/framed panels with ribs) ; spiky ice crystal clusters (radial spikes).
- **Carvings & relief:** monumental fallen square pillar with carved banded panels and segmented collar bands (deep relief) spanning the canyon.
- **Edges & profiles:** needle-sharp ice shards; rounded snow lips; frozen river surface cracks.
- **Surfaces & materials:** frosted ice crystal (translucent, pinkish-white); snow; cracked frozen river (glossy, Voronoi crack pattern); terracotta stone beam.
- **Objects:** ice crystal spike clusters; fallen carved column beam (bridge); frozen river; snow banks; glowing particles/sparks in sky.
- **Lighting/FX details:** soft pink-warm bloom; drifting sparks; frosty sheen.
- **Build components:**
  - Ice crystal spike cluster — Blender mesh + translucent subsurface/frost shader — winter edge / castle crystal garden.
  - Cracked frozen lake — Voronoi crack shader — frozen moat variant.
  - Fallen carved pillar bridge — Blender mesh + panel normal map — canyon crossing.

### U126
- **Patterns:** none decorative visible; ship hull plank strakes and gunport rows visible inside ice; layered ice strata.
- **Carvings & relief:** galleon wreck embedded in giant ice spires — stern gallery windows, rails (fully 3D).
- **Edges & profiles:** tall jagged ice shards forming crown-like silhouette; frozen spray ridges.
- **Surfaces & materials:** translucent blue glacial ice with inner glow; dark wood; frozen sea surface; snowy mountains.
- **Objects:** frozen sailing ship in iceberg; ice shards; ice floes; frozen lake; mountains; bird flock.
- **Lighting/FX details:** inner blue glow in ice (cyan emissive core near hull); pink sunrise sky; mist at base.
- **Build components:**
  - Glowing glacial ice shards — Blender mesh + refractive emissive-core shader — ice palace wing / winter lake.
  - Frozen ship wreck — Blender mesh — lake landmark (frozen side).
  - Ice floe plates — Blender mesh + frost shader — winter moat.

### U127
- **Patterns:** none detailed; crenellation rhythm on keep; arched window row at top of tower.
- **Carvings & relief:** stone column/obelisk monument with cross-like top on stepped pedestal (deep relief); crenellated round towers.
- **Edges & profiles:** rounded drum towers with merlons; small round-arched windows row; stepped plinth.
- **Surfaces & materials:** dark snowy stone; snow; red banner.
- **Objects:** hilltop castle with drum towers; glowing orange round window (fire light); monument column; red banner on pole; lamp posts/torches with blue lights; ruined stone walls; snowy pine trees; scattered debris; figure (ignore).
- **Lighting/FX details:** aurora borealis ribbons (cyan-green) across sky; falling snow particles; orange warm window glow contrasting cold blue night.
- **Build components:**
  - Aurora ribbon sky — animated shader curtains — night sky above castle.
  - Falling snow particles — GPU particles — winter event.
  - Crenellated drum tower with arched window band — Blender mesh — curtain wall towers.
  - Stepped-plinth memorial column — Blender mesh — courtyard monument.

### U128
- **Patterns:** sweeping Art Nouveau curvilinear ironwork scrolls (whiplash curves) on the large tower wall; botanical incised vine-and-leaf engraving climbing a column (rose/leaf sprigs, shallow incised); heart-shaped tracery openings in the belvedere arches; floor of square flagstones with curving incised arabesque inlay; scroll-and-tendril railing panels (wavy S-scroll ironwork) around a round balcony; lancet blind arcading on lower tower; standing-seam/ribbed metal roof panels; ogival leaf-shaped (lancet/almond) tracery lights in the dome.
- **Carvings & relief:** column with incised climbing vines and leaf fronds, bud-capital ring mouldings and carved lily/fleur sprigs (shallow relief); belvedere crown: ring of pointed-ogee arch openings with heart cut-out tracery and S-scroll ironwork balustrades (fully 3D); bell-shaped ribbed dome with leaf-shaped dormer tracery; corbelled curved balcony with flared bell-like skirt roofs; curved stone bench with pierced scroll back (fully 3D); blind lancet arches on tower body.
- **Edges & profiles:** pointed/ogee lancet arches with flared, curling roof hoods (like bonnet canopies); bell-curved flared eave skirts with ribbed metal; roll mouldings and ring collars on column; thin curved iron balustrade top rail; crystal-shard spikes along walls catching rim light.
- **Surfaces & materials:** pale lavender-pink limestone (matte, slightly polished floor); dark slate-blue metal roofs; burnished violet wrought iron; frosted translucent crystal spikes (quartz); pink glowing glass behind arch openings; stained-glass panels (diamond/leaded small panes in balcony windows); pink blossom trees.
- **Objects:** round open balcony with scroll railing; ornate curved bench; Art Nouveau iron-strapped tower; vine-engraved column; heart-arched belvedere tower; bonnet-roofed balcony pods; giant crystal spikes; distant slender lighthouse/watchtower on peak; pink blossom trees; figures (seated — ignore).
- **Lighting/FX details:** pink-violet sunset sky; warm pink emission from inside windows; soft haze over mountains; rim-lit crystal edges.
- **Build components:**
  - Heart-tracery ogee belvedere crown — Blender mesh — birthday castle top tower (signature piece).
  - Art Nouveau whiplash iron straps on tower — Blender curve-to-mesh — castle keep walls, ballroom doors.
  - Vine-engraved column with ring collars — Blender mesh + normal map — ballroom colonnade, gate columns.
  - S-scroll iron balcony railing — Blender mesh / alpha-cut trim — ring walkways, balconies.
  - Pierced scroll-back curved bench — Blender mesh — terraces, gardens.
  - Bonnet-hood bell-flared balcony pod with stained glass — Blender mesh + emissive glass — tower bays.
  - Frosted crystal spike clusters along wall bases — mesh + translucent shader — castle plinth.
  - Arabesque incised floor inlay — decal + normal map — balcony and ballroom floors.

### U129
- **Patterns:** fish-scale / diamond slate roof tiles in blue-lilac on domes and roof slopes; Art Nouveau whiplash curvilinear ironwork on gates and arches (wavy interlaced scroll bands); lancet blind arcading on tower drums; scroll-and-tendril stair balustrade panels; star-trail concentric arcs in the sky (circular star trails).
- **Carvings & relief:** pointed-ogee crown lanterns (ring of tall lancet arches with flared petal hoods, each opening glowing pink) on many towers — fully 3D; onion/bell domes with finials; vine-wound turned column posts with collar rings and orb finials (fully 3D) carrying open iron arch canopies (pergola-gateway); grand central stair with carved stone side cheeks and scroll railing; gabled lancet window with tracery (bar tracery, multiple lights) in central bay; snowman figure (prop).
- **Edges & profiles:** ogee/lancet arches everywhere; flared bonnet hoods; bell-shaped domes; slender cylindrical turrets with ring string courses; thin curved iron rails; crystal spikes at bases with bright rim light.
- **Surfaces & materials:** pale pink-white stone (polished, snow-dusted); blue-violet slate/metal roofs; violet-bronze wrought iron; pink-glowing glass in crown lanterns; frosted crystal spikes (violet quartz); snow; twisted dark-bark tree with sparkling white blossoms.
- **Objects:** fairy-tale palace with multiple towers; crown-lantern turrets; iron arch pergola gate; grand stair; scroll balustrade fence; round fountain basin rim (lower right); snowman; snowballs; ivy draping walls; crystal clusters; twisted blossom tree with sparkles; hanging lantern under pergola.
- **Lighting/FX details:** pink emissive glow inside crown lanterns and archways; circular star-trail sky; soft violet ambient; snow sparkle; glints on tree blossoms; volumetric haze.
- **Build components:**
  - Crown-lantern turret (ring of glowing ogee arches under bell dome) — Blender mesh + emissive glass — every castle tower top (signature silhouette).
  - Whiplash iron arch pergola on vine-wound columns — Blender curve mesh + lathe columns — castle forecourt gate, ring walkway arches.
  - Fish-scale slate dome roofing — tiling normal map + metallic-roughness texture — all domes/cones.
  - Grand stair with scroll iron balustrade — Blender modular — castle entrance.
  - Star-trail sky — rotating sky shader — night sky over castle.
  - Twisted blossom tree with sparkle particles — mesh + particles — courtyard.

### U130
- **Patterns:** vertical column shafts with carved recessed niche strips (stacked rectangular dentil-like cutouts along shafts — a ladder/fret pattern); meander/key border on low terrace walls; geometric floor tiling.
- **Carvings & relief:** square-section pillars with carved panel strips and flat stepped capitals (Egyptian/Persian-Greek hybrid, deep relief); lintels on pillar pairs; ram/bull-like colossal statues (render as veiled animal forms or omit); stepped plinths; balcony with plants on right building.
- **Edges & profiles:** stepped block capitals; flat entablature; crisp chamfered edges with warm rim light.
- **Surfaces & materials:** warm sandstone (peach-orange in sunset); green hedges; white-blossom tree with gilded trunk.
- **Objects:** pillar pairs and trilithons; colossal animal statues (skip detail); white-blossom tree with glowing gold spiral ribbons around trunk; hedges with white flowers; cypress trees; planters; distant temple ruins and mountains; figure (ignore).
- **Lighting/FX details:** dusk violet sky; gold emissive ribbon wrapping the tree; warm light on stone.
- **Build components:**
  - Panel-carved square pillar with stepped capital — Blender mesh + normal map — garden pergolas, ballroom terrace.
  - Gold glowing spiral ribbon around a tree — emissive tube mesh + animated shader — courtyard birthday tree.
  - White-blossom canopy tree — Blender mesh with card canopy — gardens.
  - Meander key border on kerbs — trim normal map — terrace walls.

### U131
- **Patterns:** Greek key/meander? (none visible); acanthus-like carved pediment relief (scrolling foliage in tympanum); bands of cyma scroll/running-dog (Vitruvian wave) on column bases; lyre emblem on hanging banners; coffered dome rim with bead pattern; wave-scroll balustrade.
- **Carvings & relief:** Greek temple portico: four columns with ornate carved lower drums (decorated column bases with medallion/scroll relief), Ionic-ish capitals, entablature with frieze, triangular pediment with acanthus scroll relief (shallow-medium relief) and acroterion statue on apex; blue dome with colonnaded drum behind; golden lyre sculpture on pedestal (fully 3D); scroll-wave (Vitruvian scroll) carved stair cheek blocks; planter boxes; painted mural panel in portico.
- **Edges & profiles:** pediment raking cornice with dentils; column entasis; stepped stylobate; blue stair treads.
- **Surfaces & materials:** cream marble; blue-glazed dome; gold metal lyre; blue fabric banners with gold lyre emblem; fabric swag drape between columns; golden meadow with blue flowers; dark green cypress.
- **Objects:** temple; banners; swag drapery; lyre statue; stone planters with plants; potted plants/vases; urns; cypress trees; boulders; flagstone path; blue cornflower-like flowers; mural.
- **Lighting/FX details:** soft pastel dusk; warm sunlight on marble.
- **Build components:**
  - Pediment with acanthus scroll tympanum + dentil cornice — Blender mesh + normal map — ballroom façade / music pavilion.
  - Golden lyre sculpture on plinth — Blender mesh + gold PBR — music garden / ballroom.
  - Fabric swag drapery between columns — cloth mesh — festive decoration on ballroom portico.
  - Vitruvian-scroll carved stair cheek — normal map + mesh — stair ends.
  - Lyre-emblem banners — cloth + decal — castle music hall.

### U132
- **Patterns:** fluted column shafts; Corinthian capitals with gilded acanthus leaves; striped blue-gold mosaic band around dome (chevron/stripe); arch voussoirs; bead-like moulding at capitals.
- **Carvings & relief:** Roman triumphal-arch pavilion with paired Corinthian columns (gilded capitals, deep relief); entablature with blocks; statues atop columns (winged eagle/griffin figures and a standing figure — use faceless/veiled); rounded arches with recessed orders; gold-trimmed internal arches.
- **Edges & profiles:** semicircular arches; projecting entablature blocks over each column (ressauts); cornice; golden edge piping along arch intrados.
- **Surfaces & materials:** lilac-grey stone (matte); gilded capitals (glossy gold); blue enamel/lapis dome with gold band; ivy/vines draping; fire braziers inside.
- **Objects:** domed arch pavilion; winged statues; fire braziers/flames in arches; ivy vines; stone flower pots/planters; volcano with crystal pink lava; banner streamers; trees; rocks; distant mountains.
- **Lighting/FX details:** warm fire glow inside arches; pink-red glowing crystal volcano with smoke; bright day sky.
- **Build components:**
  - Gilded Corinthian capital column (fluted) — Blender mesh + gold PBR — ballroom colonnade, gate pavilion.
  - Lapis-and-gold banded dome — Blender mesh + enamel/metal shader — garden pavilion.
  - Ivy drape cascades — alpha-card meshes — pavilion walls.
  - Fire brazier in arch — mesh + flame shader/particles — gate niches.
  - Veiled winged statue on column-top — Blender sculpt — pavilion crowns.

### U133
- **Patterns:** large circular floor medallion mosaic with radial star/rosette (multi-pointed compass/sun rosette in red at centre) surrounded by blue-white lattice/diamond grid and a ring border of geometric key pattern — compass-rose floor; arcades of repeating round/pointed arches; flower clusters.
- **Carvings & relief:** multi-level arcades with clustered columns and pointed/rounded arches; corbel-supported balcony bowls (overhanging planter balconies with mouldings); grand arch gateway at end of courtyard; floating rock fragments/sculpture; carved stone benches/plinths.
- **Edges & profiles:** pointed arches with roll moulding; cornice ledges with flower planters; semicircular arcade.
- **Surfaces & materials:** pale pink-grey stone; deep blue painted arch soffits (blue recesses); terracotta; mosaic tile floor (blue, white, red); lush pink roses; screens (off-theme).
- **Objects:** pink climbing rose bushes; standard (lollipop) rose trees in planters; arcades; gateway arch; display panels/screens (off-theme, ignore); floating island rocks; balcony planters; figure (ignore).
- **Lighting/FX details:** bright daylight; soft haze down courtyard vista.
- **Build components:**
  - Compass-rose mosaic floor medallion (red rosette, blue lattice, key border) — decal/texture + normal map — castle courtyard / ballroom centre.
  - Standard rose topiary in planter — Blender mesh — courtyard and ring walkway.
  - Climbing rose drape — alpha cards — arcades.
  - Blue-soffit pointed arcade — Blender modular — inner courtyard galleries.

### U134
- **Patterns:** circular plaza with concentric ring paving and inlaid green-and-gold sweeping curved bands (art-deco/Celtic curves) around a central disc; stepped concentric semicircular stairs; floor tiles with carved meander/Greek-key and diamond-chequer borders (square panels with inset diamond & key fret); Celtic-knot interlace in openwork gilded crown atop the portal; balustrade of posts with ornate scroll iron panels and glowing finial lamps; chequer tile strips.
- **Carvings & relief:** waygate portal: two curved leaning pylons (stone with gold trim and emerald inlay strips) supporting an openwork gold Celtic knot crown/shield (fully 3D); gold curling horn-like ornaments emerging from the ring floor; balustrade posts with lantern finials; colossal veiled/hooded statue in background (standing robed figure with gold trims — faceless-friendly); aqueduct arches; carved floor panels with key fret (shallow relief).
- **Edges & profiles:** circular step nosings; balustrade with bevelled posts and capped tops; curved pylon silhouettes with gold edge piping; stone kerb with blue painted edge strip.
- **Surfaces & materials:** pale worn stone flags, cracked, with fallen leaves; gold metal trim; emerald/jade enamel inlay; dark iron railings; blue-painted wood carts; orange canvas tent.
- **Objects:** portal waygate; circular plaza; scroll balustrade with finial lamp posts; second circular platform; merchant wagon with blue canopy and hanging teal pennant; orange tents; hanging bronze bell/lantern; crates, barrels, pots; broadleaf oak trees; stairs; standing stones; colossal hooded statue; aqueduct; waterfalls; cloud sea.
- **Lighting/FX details:** dappled leaf shadows; clouds drifting through valley; soft daylight.
- **Build components:**
  - Celtic-knot gold-crowned waygate portal — Blender mesh + gold/jade enamel shader — teleport plaza on ring walkways.
  - Concentric plaza with gold/jade curve inlay — Blender mesh + decal — ring walkway nodes.
  - Key-fret + diamond tile panel floor — tiling texture + normal map — castle terraces.
  - Balustrade with lantern-finial posts — Blender modular — cliff-edge terraces, bridge railings.
  - Canopied merchant wagon with pennant — Blender mesh + cloth — market.
  - Hooded colossal statue (faceless) — Blender sculpt — valley guardian.

### U135
- **Patterns:** irregular crazy-paving flagstone plaza; carved concentric rings and segments on circular hearth platform (radial wheel); grooved tile roofs (Chinese/Japanese style); circular medallion boss on gate; hanging lattice lanterns.
- **Carvings & relief:** circular moon-gate arch (round opening in a wall, with a carved circular medallion boss above the arch — deep relief); bronze-coloured coiled serpent/root-like sculpted stone rim with gold vein lines encircling the fire pit (fully 3D); stone flame bowl (lotus-like); timber pavilions with carved round doorways; covered long walkway (colonnade) with tiled roof.
- **Edges & profiles:** curved roof ridges with upturned ends; round moon gate; tiered stepped platforms; stair with blue-trimmed side wall.
- **Surfaces & materials:** grey stone flags; dark grey roof tiles; brown timber; gold inlaid veins in stone; amber fire.
- **Objects:** moon gate; central fire pit/beacon with spiralling flame ribbons; coiled serpentine stone ring; tile-roof cottage/shop with round door; covered walkway; notice board with posters; hanging square paper lanterns; tall banner pole with long hanging banner; flowering shrubs; pines, broad trees; stairs; small creature figure (skip); figures (ignore); floating rocks in sky; birds.
- **Lighting/FX details:** golden fire with orbiting ember/light ribbons; warm sunlight bloom; leaf particles.
- **Build components:**
  - Moon-gate wall with medallion boss — Blender mesh — Glowwood entrance / garden wall.
  - Central fire beacon with orbiting light ribbons — mesh + flame shader + ribbon particles — birthday plaza centrepiece.
  - Carved concentric hearth platform — Blender mesh + normal map — plaza nodes.
  - Coiled stone ring with gold veins — Blender sculpt + emissive gold vein shader — fire-pit surround.
  - Hanging square paper lanterns — mesh + emissive — village eaves.
  - Upturned-ridge tile roof — Blender mesh + tile normal map — village houses.

### U136
- **Patterns:** concentric-ring flagstone paving (radial-cut sandstone slabs in 3–4 rings around a central dais); inner dais is a dark slate disc inlaid with a gold-wire **labyrinth / concentric-circle and arc** pattern, with green enamel channels following the curves; railing infill is a repeating **running scroll / C-scroll** ironwork band (wood-brown); Celtic-style **interlaced knot / open lattice** in the gold crest atop the twin pillars; stepped semicircular stair treads (concentric arcs).
- **Carvings & relief:** twin flared-top stone monolith pillars (gateway "portal" with no lintel) with gilded inset panels and a pointed openwork gold crest (Art-Nouveau/Celtic interlace, deep openwork, fully 3D); pillar bases split into root-like buttress "feet" (deep relief); small green-gold standing blades/runic stakes around the dais ring (fully 3D, ~8 of them); colossal statue of a robed figure on a rock spire with a gold antler/halo crown, gold serpentine sash spiralling down the robe (veiled-face version needed in our game; fully 3D, gold trim as raised piping); distant multi-arched aqueduct/viaduct (round arches, repeated).
- **Edges & profiles:** pillars widen at the top into a flared cavetto capital with chamfered edges; gold edge-piping runs along every pillar arris; square balustrade posts with stepped caps (plinth-shaft-cap); circular dais rim is a raised gold ring band; plaza edge stepped in 3 risers; railing rail has a rounded handrail on top.
- **Surfaces & materials:** warm cream sandstone slabs, matte, light wear and cracks; dark slate dais with polished gold inlay; green malachite/enamel channels (glossy); pillars in weathered grey stone with gilded bronze panels; railing in dark red-brown wood/iron; statue in pale blue-grey marble with polished gold.
- **Objects:** twin-pillar portal; circular overlook plaza; ring balustrade with square posts; post-top lanterns (small glass-cage lantern on a cup base, on every other post — ~10); statue colossus; aqueduct; deciduous broadleaf trees (framing canopy), conifers in valley, moss-capped karst rock pillars; wide stair down; flagstone path.
- **Lighting/FX details:** dappled leaf-shadow (gobo) over the plaza; a blue swirling ribbon of magic/wind wrapping around the rock spires (long translucent spiral trail); heavy valley mist/haze layering; warm lantern flames even in daylight.
- **Build components:**
  - Concentric Rune Dais — Blender mesh disc + gold-inlay labyrinth normal/emissive map — Starfall/ring-walkway centre, plaza in front of castle gate
  - Twin Monolith Portal with Interlace Crest — Blender mesh (flared pillars, gold openwork crest) — portal on the bridge approach or Glowwood clearing
  - Ring Balustrade with Post Lanterns — Blender mesh kit (post, rail segment, scroll infill, lantern) — ring walkways, overlook terraces
  - Radial Flagstone Paving — tileable radial texture + normal map — circular plazas
  - Spiral Magic Ribbon — shader (scrolling alpha ribbon on spline) — around floating islands / towers
  - Veiled Gilded Colossus — Blender mesh, gold serpent-sash trim — on a rock spire as landmark

### U137
- **Patterns:** cascading **Gothic pinnacle clusters** (rhythm of spires); rows of tall narrow lancet windows; rounded turret drums with ring string-courses; floating rock debris arranged in an arc/spiral around the castle.
- **Carvings & relief:** spires with crockets implied, pinnacles on every buttress (fully 3D); arched arcade on a lower wing; small ornate gatehouse finials in foreground bottom-left (pinnacled pavilion tops). Detail is soft/low-res.
- **Edges & profiles:** needle spires, conical turret roofs, pointed lancet openings, round towers with corbelled balconies; floating island underside is jagged inverted cone with hanging roots.
- **Surfaces & materials:** pale limestone, matte, misty; dark rock island base; glowing green ring.
- **Objects:** floating island castle; an enormous glowing **halo ring** with branching tendrils above the central spire; dozens of floating boulders/rock shards; waterfalls pouring off island edges; autumn trees (orange, golden larch-like conifers, red maples); hanging vines; distant floating islets with ruins.
- **Lighting/FX details:** emerald-green energy ring with lens-flare rainbow halo; god-ray haze; cloud sea below; floating debris particles.
- **Build components:**
  - Halo Crown Ring above central spire — emissive torus + shader with flowing noise — castle top
  - Orbiting Rock Debris — instanced low-poly rocks + slow orbit animation — around floating islands
  - Inverted-cone Island Base with hanging roots — Blender mesh + root cards — floating islands
  - Island Edge Waterfalls — scrolling alpha shader + mist particles — island rims
  - Gothic Pinnacle Cluster — Blender mesh kit — castle roofline

### U138
- **Patterns:** multi-span round-arched viaduct (repeating arches with tall piers); interlocking **Celtic trinity-knot/triquetra-like ring sigil** as a glowing emblem above the castle.
- **Carvings & relief:** castle with tall spires and arched openings (soft detail); viaduct piers with simple impost bands.
- **Edges & profiles:** round arches; needle spires; rocky cliff edges.
- **Surfaces & materials:** pale stone; mossy cliffs; glowing teal/cyan sky vortex.
- **Objects:** castle on a viaduct; floating boulder cluster in foreground; flock of floating rock shards in sky; conifer (spruce/fir) trees; red autumn maple; golden bush; ferns and moss on cliffs; river/road line in the valley.
- **Lighting/FX details:** swirling cyan-green portal vortex in sky; a glowing interlace ring-sigil (light-line emblem); pink-violet sunset haze; heavy mist.
- **Build components:**
  - Glowing Knot Sigil — emissive line mesh/decal — floating above the castle keep or gate
  - Sky Vortex — shader on sky dome (swirl UV distortion) — night sky above castle
  - Arched Viaduct — Blender modular arch span — bridge to the castle
  - Floating Boulder Cluster — instanced rocks — valley / approach

### U139
- **Patterns:** repeated **golden onion/bell domes with lantern finials** on spires; rows of dormer windows on mansard-like roofs; colonnade of tall slender columns lining an avenue; crenellated parapet with regular merlons on keep wall; balustrade on terraces.
- **Carvings & relief:** baroque/gothic tiered spires with gold domes and pointed finials (fully 3D); tall columns topped by statues (figures — faceless in ours) lining the avenue (fully 3D); pinnacles on corners of walls; arched loggias.
- **Edges & profiles:** square-merlon crenellation on keep; stepped tiered towers; dormers with pediments; hipped roofs with gold-orange tiles.
- **Surfaces & materials:** grey-beige stone, matte; gilded domes; warm golden roof tiles; dark paving.
- **Objects:** walled city avenue; column-statue avenue; golden-leaf trees (autumn, round crowns); red maple; tall cypress-like golden conifers; keep with square towers; a figure-like twisted tree/creature silhouette (treat as gnarled branch); terrace walls with balustrade; arch gateway.
- **Lighting/FX details:** golden-hour bloom, warm haze, sun flare behind keep; falling-leaf feel; overhead golden foliage frame.
- **Build components:**
  - Gilded Bell-Dome Spire — Blender mesh (tiered octagonal drum + gold dome + finial) — castle towers
  - Column-Statue Avenue — Blender column + veiled figure on top — approach boulevard to gate
  - Golden Autumn Tree — mesh + leaf cards, warm emissive rim — Glowwood edge
  - Dormer-and-Hip Roof Kit — Blender mesh + tile normal map — town buildings near the castle

### U140
- **Patterns:** rounded **cobble-stone / pebble shingle roofs** (irregular stone tiles, like fish-scale but chunky); half-timbering (vertical/diagonal timber framing) on walls; drystone rubble walls.
- **Carvings & relief:** witch-hat conical tower roofs with tall spire tips; round-arched gateway through a bridge-house; dormer with arched window; little stone wellhead/post in courtyard.
- **Edges & profiles:** bulging, sagging roof outlines (storybook); curved overhanging eaves; tall needle spires; arched passage.
- **Surfaces & materials:** colourful glazed stone roof shingles (terracotta, crimson, amber, blue); blue-washed plaster; dark timber; mossy stone; ivy.
- **Objects:** gatehouse bridge building; round tower with conical cobble roof; spiky cathedral silhouettes behind; crows on ridges; tall pines; ivy and red climbing plants; lamp/post; grass tufts; mossy boulders; a figure (hero).
- **Lighting/FX details:** strong volumetric god rays from upper left; ground mist pooling in ravine; warm orange vs. cool blue split lighting; rim light on roof stones.
- **Build components:**
  - Storybook Pebble-Shingle Roof — normal map + vertex-colour variation on a sagging cone mesh — Glowwood cottages, outer village
  - Witch-Hat Spire Turret — Blender mesh — small towers on the outer walls
  - Half-Timber Wall Panel — decal + normal map — village houses
  - Ravine Mist Pool — volumetric fog plane shader — moat / valley under bridge
  - God-Ray Shafts — additive cone mesh with soft gradient — forest edges

### U141
- **Patterns:** vertical **fluted glass-panel lattice** on cylindrical towers (rows of tall arched clerestory panes); repeating arched arcade (pointed horseshoe-like arches) on the gateway bridge; **feathered wing** pattern (layered pennae) on the central palace; ribbed cage domes; tracery of curved flying ribs around domes.
- **Carvings & relief:** colossal sculpted wings either side of the central bowl (deep relief / fully 3D feathers); bowl-shaped "chalice" balconies (corbelled saucers) on tower bases; ribbed cupolas topped with needle finials; slender buttress ribs arching over the domes; pinnacles at every arch springing; gate bridge with tall pointed arches and lantern-spire end posts.
- **Edges & profiles:** elegant Art-Nouveau/Elvish curved ribs; pointed lancet arches; saucer-shaped tiered balconies; striped melon-dome kiosks; thin gold piping along every rib.
- **Surfaces & materials:** ivory/white stone with pale gold trim; luminous frosted-blue glass panels; polished surfaces catching sunlight.
- **Objects:** elvish palace; twin glass-lantern towers; wing sculpture; arched bridge/gate screen; striped dome pavilions; river with reflection; broadleaf oak trees; purple wildflower meadow (lavender-like); boulders; flock of birds; snowy mountains; figure holding a flame orb.
- **Lighting/FX details:** soft daylight, glass glow; fireball/light orb in hand; still-water reflections.
- **Build components:**
  - Glass Lantern Tower (fluted glazed cylinder + saucer balcony) — Blender mesh + emissive frosted glass shader — ring-walkway towers, glowing at night
  - Sculpted Wing Pair — Blender mesh, feather normal map — above the castle gate / ballroom entrance
  - Arched Screen Bridge — Blender modular arch kit with spire posts — bridge over moat
  - Striped Melon-Dome Pavilion — Blender mesh — garden kiosks
  - Ribbed Cage Dome — Blender mesh (rib curves) — central keep crown

### U142
- **Patterns:** none distinct (painted overview); rows of spruce trees.
- **Carvings & relief:** castle with central spire and turrets; gothic keep on hill (soft).
- **Edges & profiles:** spiky turret silhouettes; winding dirt paths.
- **Surfaces & materials:** painted stylised; warm sunset tones.
- **Objects:** covered wagons (canvas hooped tops, wooden wheels); hot-air balloons (striped red/white envelopes with baskets); cottages with chimney smoke; orange autumn trees; conifers; cliff ledges; glowing blue and orange crystal-icon gems (UI); bird; distant castles; figure.
- **Lighting/FX details:** low sun with radiating rays; valley mist; chimney smoke plumes.
- **Build components:**
  - Floating Lantern Balloons (hot-air balloon shape) — Blender mesh + emissive basket — night sky drifting over castle
  - Chimney Smoke — particle sprite plume — cottages
  - Covered Wagon prop — Blender mesh — market/approach road

### U143
- **Patterns:** painted; layered pine silhouettes.
- **Carvings & relief:** none (natural); castle with clustered spires on crag.
- **Edges & profiles:** jagged peaks; spiky spire cluster.
- **Surfaces & materials:** rock with warm rim light; glowing blue crystal.
- **Objects:** blue crystal cluster growing from a rock (3–4 hexagonal prism shards, emissive); campfire; torch staff; waterfalls (multiple, from cliffs and the castle crag); river; pines; boulders; falling meteors/sparks; figure.
- **Lighting/FX details:** cyan crystal glow casting on rock; warm campfire; purple/orange sunset gradient; shooting stars streaks; waterfall mist.
- **Build components:**
  - Rock-Embedded Glow Crystal — Blender mesh (prism shards on boulder) + emissive shader + point light — Glowwood paths, castle grounds
  - Shooting Star streaks — particle/trail shader — night sky
  - Campfire — flame shader + embers particles — camp/rest spots

### U144
- **Patterns:** colonnade of repeated columns along a ridge (stoa); tiers of arched windows.
- **Carvings & relief:** white castle with tall central belfry tower and tiered setbacks (soft); colonnaded terrace (fully 3D columns).
- **Edges & profiles:** tall rectangular tower with small cap; spiky rock needles; ruined ramparts.
- **Surfaces & materials:** white/cream stone; rust-red rock; pink haze.
- **Objects:** castle on rock outcrop; colonnade; ruined towers; rock spikes; autumn shrubs; giant glowing golden tree/energy cloud (huge erupting light).
- **Lighting/FX details:** enormous golden light source (like a glowing world-tree); pink-red sky; thick low fog sea.
- **Build components:**
  - Ridge Colonnade (stoa) — Blender modular column + entablature — terrace along ring walkway
  - Low Fog Sea — fog plane shader — below castle/islands
  - Giant Light-Tree glow — billboard + bloom — horizon landmark

### U145
- **Patterns:** repeated pointed-and-round arch ruins (open arcade); tiered octagonal tower with stacked arcaded storeys; crenellation with pointed merlons.
- **Carvings & relief:** ruined arcade piers; crumbling tower with arched openings each tier; heater shield with central rib (fully 3D).
- **Edges & profiles:** broken arch silhouettes; pointed arches on right wall; jagged tower crown.
- **Surfaces & materials:** grey weathered stone, rough; dark cliffs.
- **Objects:** ruined arcade bridge; tall ruin tower; wooden crates/storage stacked; heater shield; armoured figure; bone/skull pile (skip); water bay.
- **Lighting/FX details:** starry night sky; faint rainbow streaks; warm sunrise glow behind tower; mist on water.
- **Build components:**
  - Ruined Arcade Section — Blender mesh with broken edges — distant ruins/Glowwood remnants
  - Starry Sky Dome with aurora streak — shader — night sky
  - Arcaded Tower Tier — Blender mesh — background tower

### U146
- **Patterns:** stacked tiers of small pointed gables/pinnacles forming a stepped "wedding-cake" crown on the towers; vertical buttress strips; ivy curtain.
- **Carvings & relief:** Gothic tower crown made of clustered pinnacle turrets with small domed caps and orb finials (fully 3D); vertical pilaster-buttresses running full height (deep relief); tall narrow lancet slits.
- **Edges & profiles:** stepped pyramidal tower crown, pinnacles with ball finials, flat buttress faces with chamfered corners.
- **Surfaces & materials:** pale grey limestone, matte, heavily overgrown with ivy/moss; granite cliff with moss; slate path.
- **Objects:** overgrown Gothic temple-castle (twin crowned towers); autumn maples (red, orange, gold); dark conifer; ferns; moss carpet; boulders and rock outcrops; fallen branch; flat stone path; small yellow fallen leaf.
- **Lighting/FX details:** emerald/cyan aurora vortex in sky with a bright flare at its centre over the right tower; soft overcast haze; light bloom through trees.
- **Build components:**
  - Pinnacle-Cluster Tower Crown — Blender mesh — top of castle keep towers
  - Ivy Curtain — alpha cards + vertex wind shader — overgrown outer walls, Glowwood ruins
  - Aurora Vortex — sky shader (green/cyan swirl) — night sky above the castle
  - Mossy Boulder set — Blender sculpt + moss-mask shader — Glowwood floor

### U147
- **Patterns:** cascading rock terraces; pool ripples; palm fronds radial.
- **Carvings & relief:** none (natural); distant single tall spire tower/castle silhouette.
- **Edges & profiles:** rounded mossy cascades, rock ledges.
- **Surfaces & materials:** turquoise translucent water with visible bed, white foam; moss; red sandstone cliffs; red-flower meadow carpets.
- **Objects:** terraced waterfall cascade into turquoise pool; palms; tree ferns; cycad/fern bushes; red flowering ground cover; boulders; dead branches; distant spire; a figure; a creature silhouette (skip).
- **Lighting/FX details:** waterfall spray, water caustics and depth tint; soft haze.
- **Build components:**
  - Cascading Pool Water — shader (depth-tinted turquoise, foam at edges, caustics) — garden fountains/Glowwood pools
  - Waterfall Step Cascade — scrolling alpha mesh + foam particles — garden rock cascades
  - Red Flower Carpet — instanced flower cards — garden beds

### U148
- **Patterns:** radial plank boardwalk; stepping-stone (flagstone) paths; split-rail fence rhythm.
- **Carvings & relief:** none ornate; cross-topped wooden posts and small headstone markers (omit in our world — replace with signposts).
- **Edges & profiles:** steep pitched cottage roofs; stacked rounded cliff stones (cubic rounded blocks).
- **Surfaces & materials:** stylised low-poly; rounded beige rock blocks; weathered wooden planks; dark navy water with white surf foam.
- **Objects:** two steep-roof cottages with glowing windows; wooden pier/boardwalk with steps; split-rail and picket fences; post lanterns (hanging lantern on a wooden post, warm); bushes; dark gnarled trees; lily pads/round stepping stones; small rowing boat; barrels/crates; signposts.
- **Lighting/FX details:** warm lantern pools of light on path; cool blue moonlit fog through the forest; white surf foam around rocks.
- **Build components:**
  - Wooden Post Lantern (shepherd's hook) — Blender mesh + point light — Glowwood trails, lakeside
  - Plank Boardwalk/Pier kit — Blender modular — lake edge, moat docks
  - Stylised Surf Foam ring — shader on shoreline — island shores
  - Split-Rail Fence — Blender modular — Glowwood paths

### U149
- **Patterns:** **fish-scale / scalloped slate roof shingles** (blue, green, purple); half-timbering with curved braces; rubble-stone plinths; round-pebble wall infill.
- **Carvings & relief:** curved, swooping overhanging gable bargeboards with carved upturned tips (horn-like, fully 3D); exposed rafter tails; corbel brackets under jetties; round curly chimney pots; small finial knobs at gable peaks.
- **Edges & profiles:** exaggerated jettied storeys (each floor overhanging), crooked gables, upswept eaves, pointed arched windows with glowing panes, stepped plinth.
- **Surfaces & materials:** blue-glazed scalloped slate, dark stained timber, cream plaster, river-stone plinth; warm glowing windows.
- **Objects:** crooked storybook houses; iron wall-bracket lanterns (glass box lanterns); weathervane/antenna poles; stovepipe chimneys with smoke; wooden crates; barrels; flower pot; mushroom; cobble path; banners/rag flags.
- **Lighting/FX details:** dusk blue sky with warm amber window glow; chimney smoke; lantern glow.
- **Build components:**
  - Fish-Scale Slate Roof — tileable normal + colour map with hue variation — village roofs, castle outbuildings
  - Swooping Bargeboard Gable — Blender mesh (curved timber with horn tips) — Glowwood cottages
  - Jettied Half-Timber Storey — Blender modular block — village street
  - Wall-Bracket Box Lantern — Blender mesh + emissive — village walls, castle courtyards
  - Warm Window Glow — emissive shader with flicker — all buildings at night

### U150
- **Patterns:** **rosettes / quatrefoil-in-circle medallions** (carved roundels with 4-lobed interlace) set in the spandrels above each arch; **spiral/vortex (triskele-like) relief** carved into circular stone dais floors; scrolled foliate fretwork inside the spiral discs; terracotta tiles with green **damask/floral** pattern on the stairs; repeating ogee-cusped arcade.
- **Carvings & relief:** arcade of cusped/ogee (Moorish-style trilobed) arches on Corinthian/composite columns with tall plinths (deep relief); spandrel roundels (shallow-medium relief); central triumphal round-arch gateway with coffered intrados and pilasters; serpent-dragon sculptures with scale texture flanking the plaza (fully 3D; we'd use as coiled serpentine form only); a giant glowing sword floating vertically above the gate with a gold crossguard.
- **Edges & profiles:** concentric circular stairs (stepped arcs) rising to a round dais; heavy cornice with simple flat fascia above arcade; bell-tower kiosks with round-arched openings and hipped tiled roofs.
- **Surfaces & materials:** warm sandstone/limestone, smooth, sunlit; terracotta orange tiles with green motif; dark grey-green carved stone discs; blue-glazed elements in background; bronze/green serpent statues.
- **Objects:** arcaded circular plaza; round dais with spiral relief; triumphal arch; floating glowing sword monument; serpent statues; bell towers (campanile kiosks); cypress trees; blue planters; figures.
- **Lighting/FX details:** bright beam/aura on the floating sword (blue-white light column into sky); strong daylight shadows.
- **Build components:**
  - Spandrel Rosette Medallion — decal + normal map (quatrefoil roundel) — arcades of ballroom courtyard / ring walkways
  - Spiral-Relief Dais Disc — normal map on cylinder — plaza focal points
  - Cusped Ogee Arcade — Blender modular (column + trilobed arch + spandrel) — courtyard cloister
  - Floating Light-Sword/Beacon — mesh + beam shader — monument over castle gate (birthday beacon)
  - Damask Stair Tiles — tileable texture — grand stairs
  - Campanile Kiosk — Blender mesh — wall corners

### U151
- **Patterns:** **concentric-circle / spiral roundel paving** (large circular ripple medallions repeated across the plaza floor, sand-and-rust colour); spandrel roundel rosettes (quatrefoil/flower-in-circle); repeating cusped arch rhythm.
- **Carvings & relief:** curved arcade of **multifoil / cusped Moorish arches** on round columns; rosette medallions in spandrels (shallow relief); tall white column-obelisk monument topped with a winged ornament and an emitted blue beam, glowing lantern ring midway (fully 3D); serpent statues flanking central steps; twin bell-tower kiosks with arched belfry openings; central round-arch gateway shrine.
- **Edges & profiles:** cornice with flat frieze over arcade; broad orange semicircular stairs; hipped terracotta roofs.
- **Surfaces & materials:** sandstone cream, terracotta stair treads, gold accents on serpents, white marble column.
- **Objects:** plaza; monument column with light beam; stairs; serpent statues; bell towers; cypress; blue awnings; figures.
- **Lighting/FX details:** blue light beam shooting up from the column top; bright midday light.
- **Build components:**
  - Concentric Ripple Paving Medallion — decal/texture tile — main castle forecourt
  - Beacon Column with Winged Top — Blender mesh + beam shader — centre of forecourt
  - Multifoil Arch Arcade — Blender modular — ring walkway arcades

### U152
- **Patterns:** **crazy-paving / irregular flagstone** (rounded polygonal stones) on paths; brick paving on bridge; **fish-scale roof** on green spire; striped awnings; terracotta **Roman pan-tile** roofs; checkered/zigzag tile pattern on the dome drum (Majolica tile banding); round **turned balusters**.
- **Carvings & relief:** baroque domes with lantern cupolas and finials, ribbed melon domes (fully 3D); campanile clock towers with round clock faces and arched belfries; tall gothic-arched window with tracery on the orange tower (bar tracery, simple Y); semicircular arched loggias with balusters; wrought-iron balconies; quoins at corners; pedestal piers with caps on bridge balustrade.
- **Edges & profiles:** humped arch bridge over canal; balustraded canal walls with square piers; curved stair flights; rounded smooth-cap parapets; overhanging tiled eaves with brackets.
- **Surfaces & materials:** stucco/plaster in pastel cream, rose, orange; exposed brick patches where plaster peeled; glossy canal water; painted green wood benches; terracotta pots.
- **Objects:** ornate cast-iron **lamp posts** (single lantern and triple-arm candelabra lanterns, black with gold glow) along canal; bridge; canal; benches; potted plants and flower boxes; circular flowerbed with tree (olive/umbrella pine); purple delphinium/lupin and pink roses; climbing ivy; cypresses; palms; striped awnings; clock towers; chimney pots; balconies.
- **Lighting/FX details:** blue-hour twilight; warm window and lamp glows; warm sunset accent on tower top; reflections in canal.
- **Build components:**
  - Cast-Iron Candelabra Lamp Post (1- and 3-head) — Blender mesh + emissive lantern glass — ring walkways, bridge, canal
  - Turned-Baluster Canal/Bridge Railing with square piers — Blender modular — moat railings, terraces
  - Humped Arch Footbridge — Blender mesh — garden canals
  - Crazy-Paving Flagstone — tileable texture + normal — paths
  - Majolica Tiled Dome — Blender dome + patterned tile texture — castle chapel/ballroom dome
  - Clock-Face Tower — Blender mesh + emissive dial — castle clock (birthday countdown)
  - Circular Flowerbed with Tree — prop group — courtyards

### U153
- **Patterns:** **herringbone brick paving**; balustrade with turned balusters; wrought-iron curlicue balcony railing; arched fanlight glazing bars.
- **Carvings & relief:** Art-Nouveau facade with sinuous whiplash curves over the door; carved swags; small statues on plinths (figures); fluted columns at entrance; bay window turret with domed glass conservatory roof.
- **Edges & profiles:** curved bow-front facade; round-arched entrance; mansard dormers; cornice with modillions.
- **Surfaces & materials:** cream and orange stucco, white trim; glass conservatory dome; wrought iron.
- **Objects:** party balloons; wreath on door; vintage car (period off-theme); wooden crates of produce; pumpkins; garden hedges; easel; ladder; birdcage; cushions; topiary; golden autumn tree; lamp post (globe); bench; hand cart; pails; teacups/table setup; leaves on ground.
- **Lighting/FX details:** warm late-afternoon sunlight, soft shadows.
- **Build components:**
  - Herringbone Brick Paving — tileable texture — kitchen garden/courtyards
  - Balloon Cluster — Blender mesh + soft shader — birthday decorations at castle gate
  - Glass Conservatory Dome — Blender mesh + glass shader — castle greenhouse
  - Door Wreath — Blender mesh — doors in celebration areas

### U154
- **Patterns:** inlaid **marble compass/circle-and-arc paving** (brown and cream bands forming a large circular rosette with arcs) on the terrace; border bands of rose and terracotta paving; arched stained-glass window with purple **diamond quarry / leaded** panes; garland swags.
- **Carvings & relief:** door canopy with a carved cartouche/shield crest and scrolled brackets (medium relief); white caryatid-style columns at door (figures — veiled in ours); bird statue on column top; garland of flowers over portico; window pediments; classical statue on plinth in park (figure).
- **Edges & profiles:** curved bay facade; cornices; Juliet balconies with wrought iron; pediment window heads.
- **Surfaces & materials:** honey sandstone facade; polished inlaid marble floor; painted wood door with glazed lights; wrought iron; stained glass.
- **Objects:** wooden planter box with seedlings; wheelbarrow; birdcage; white garden table and chair; garden hose on reel; potted shrubs; topiary cones; wrought-iron bench; lamp post (lantern); lion/figure statue on fountain; swing set; tulips; roses; hydrangea; flag on facade; door wreath; wall clock; lantern pedestal.
- **Lighting/FX details:** bright day, soft.
- **Build components:**
  - Inlaid Compass-Rosette Floor — texture + slight normal (marble inlay) — castle entrance terrace / ballroom floor
  - Cartouche Door Canopy — Blender mesh — castle side doors
  - Wrought-Iron Garden Bench — Blender mesh — gardens
  - Topiary Cone in pot — Blender mesh — terrace edges

### U155
- **Patterns:** **sett/cobble paving** (small square granite setts laid in bands with larger slab borders forming a grid); round manhole cover with radial floral rosette; balustrade with turned balusters along roof parapet; **acanthus scrollwork** cast-iron on lamp posts and bench ends; stained glass with geometric panes; circular louvred/ventilator rosette roundel on wall; lattice grille under the dome drum.
- **Carvings & relief:** baroque dome with ribbed drum, paired Corinthian columns around the drum, oculus dormers, and lantern finial (fully 3D); temple-front portico with Corinthian columns, clock in pediment; Atlas/telamon figure pillars (figures — veil or replace); angel statues on parapet (figures, fully 3D); equestrian monument on a baroque pedestal with scrolled corner volutes, cartouche plaque and a bronze relief panel (deep relief); lion-mask relief plaque on a gatepost pedestal (medium relief); urn on pier.
- **Edges & profiles:** balustraded parapet roofline; heavy modillion cornice; arched ground-floor windows; scrolled S-volutes on pedestal corners.
- **Surfaces & materials:** dusk-lit limestone; patinated bronze; cast-iron black with gold sheen; glossy frosted glass globes; slate paving; brass lamp fittings.
- **Objects:** **ornate cast-iron multi-arm globe lamp posts** (5+ frosted opal globes, acanthus-scroll arms, finial pinecone/artichoke top, Eiffel-like lattice tower base); wrought-iron scroll-end benches; planter boxes with curly iron feet; topiary hedges (incl. topiary animal shape); fir tree; fire hydrant; suitcases; bicycle; delivery van (off-theme); scaffolding; kite; bunch of balloons; owl and bat (animals — skip); chained gate railing; banners; stained glass windows; flag; telescope; weathervane rooftop; fireworks; constellation lines in sky.
- **Lighting/FX details:** warm glowing opal globe lamps; fireworks burst (white starburst); shooting star; constellation line-art overlay; soap bubbles (iridescent); warm window glow vs. violet dusk sky.
- **Build components:**
  - Acanthus Cast-Iron Globe Candelabra — Blender mesh (scroll arms, opal glass globes, emissive) — castle forecourt, ballroom terrace
  - Scroll-End Park Bench — Blender mesh — ring walkways/gardens
  - Baroque Monument Pedestal with Relief Plaque — Blender mesh + normal-map relief — courtyard centre (veiled statue on top)
  - Sett Cobble Grid Paving — tileable texture + normal — forecourt streets
  - Rosette Drain Cover / Medallion — decal + normal — paving accents
  - Constellation Line Overlay — sky shader (dot+line stars) — night sky
  - Firework Burst — particle system — celebration events over castle
  - Iridescent Bubble — thin-film shader sprite — magic garden ambient

### U156
- **Patterns:** **fanlight / sunburst glazing** (radiating glazing bars in round-arched window heads over square-pane grids); rusticated ashlar blocks with V-joints; dentil course under cornice; balcony railing of repeating C-scroll ironwork; striped awning.
- **Carvings & relief:** Beaux-Arts/Federal facade: arched windows with projecting archivolt mouldings and keystones (medium relief); pilasters with sunken panels (shallow relief); clock tower with round clock face and pediment-topped cupola; giant statue of a figure in coat (faceless in ours; fully 3D); dentilled cornice.
- **Edges & profiles:** heavy projecting cornice with dentils; arched window surrounds; pediment gable; iron balcony rail with finial posts.
- **Surfaces & materials:** off-white limestone, smooth; bronze statue; red/blue painted wood kiosks; iron.
- **Objects:** **airship/dirigible** (balloon envelope with hanging gondola cabin and propellers, flags); floating cargo cage gondolas on cables; floating city buildings in the sky; hot-dog cart stall (off-theme — reuse as sweet/cake stall); wooden benches; flowerbeds of red/orange flowers; lectern/pulpit stand; flags; clock tower; figures.
- **Lighting/FX details:** bright sky, sparkle particles near left, lens bloom; floating islands with buildings in the haze.
- **Build components:**
  - Sky Airship with Gondola — Blender mesh + bobbing animation — drifting over the castle at night with lanterns
  - Fanlight Arched Window — Blender mesh + glass shader — castle hall windows
  - Dentil Cornice — Blender profile sweep — castle wall tops
  - Market Stall Cart — Blender mesh — birthday fair (cake/sweet stall)

### U157
- **Patterns:** fan/arc patterned cobble paving (segmental arcs of setts) and square stone tiles laid diagonally in brick red/purple; diaper (diamond) brickwork; bay window strips.
- **Carvings & relief:** circular tiered fountain with a scalloped shell basin, lion/dolphin-head spouts at the four sides (deep relief, fully 3D) and a pedestal with a statue (figure — veiled in ours); carved stone sundial on a baluster pedestal; Gothic-Victorian buildings with oriel turrets, crow-stepped gables and pointed spires.
- **Edges & profiles:** round turret with conical roof; oriel bay windows; bargeboard gables; pointed lancet windows.
- **Surfaces & materials:** salmon/pink brick, sandstone fountain, terracotta and purple tile paving, slate roofs.
- **Objects:** tiered statue fountain; sundial pedestal; iron lamp posts (lantern type); red post box; scooter and car (off-theme); gazebo/pavilion kiosk in background; streets; banners strung across street; trees.
- **Lighting/FX details:** warm sun shafts from top right; soft haze.
- **Build components:**
  - Tiered Mask-Spout Fountain — Blender mesh + water shader — town square below the castle
  - Sundial Pedestal — Blender mesh — palace garden
  - Fan-Arc Cobble Paving — tileable texture + normal — plaza around fountain
  - Oriel Turret — Blender mesh — townhouses

### U158
- **Patterns:** **herringbone brick paving**; turned-baluster balcony; **Art-Nouveau whiplash curves** on the facade; radiating glazing (fanlight) in arched windows; scallop-shell carving over a window.
- **Carvings & relief:** carved scallop shell above shop window (medium relief); bird statue on cornice; Art-Nouveau balcony with sinuous stone balustrade; roundel medallions; urn finials on the roofline; arched portal with leaf ornament.
- **Edges & profiles:** curved bow frontage; arched window heads; pilaster strips; parapet with finials.
- **Surfaces & materials:** apricot/cream stucco; white trim; glass conservatory dome with iron ribs; wrought iron.
- **Objects:** (wider version of U153) party balloon bunch; door wreath; glass domed conservatory with plants; vintage car (off-theme); golden autumn tree; birdhouse on tree; garden table; easel with canvas; ladder; pumpkins; wooden crates; hedges; topiary cone; wheelbarrow; watering can; garden hose; garden tools; lamp post (double globe); stone basin; biplane in sky; pink-blossom tree; soap bubbles.
- **Lighting/FX details:** low golden sun, rim light on leaves; bubbles.
- **Build components:**
  - Scallop-Shell Window Hood — Blender mesh/normal map — castle garden pavilions
  - Iron-Ribbed Glass Conservatory Dome — Blender mesh + glass shader — castle greenhouse
  - Double-Globe Lamp Post — Blender mesh + emissive — garden walk
  - Birthday Balloon Bunch — Blender mesh — gate decoration

### U159
- **Patterns:** **ribbed quadripartite rib vaults** (Gothic groin vaulting with pronounced ribs springing from columns); stained glass in arched window heads (multicolour, geometric); rubble-stone wall (irregular blue-grey stone); diamond floor tiles in orange/ochre (patterned carpet/tile); book-spine rhythm.
- **Carvings & relief:** clustered colonnettes rising into vault ribs (deep relief); carved wooden cabinetry with brass handles; desk with inlaid panels and carved front; urn/umbrella stand with ribbed bands.
- **Edges & profiles:** pointed Gothic arch windows; rib vault edges catching warm light; bookshelf cornices.
- **Surfaces & materials:** blue-grey stone walls, cream plaster vault webs; dark polished mahogany; brass; lampshades of silk; stained glass.
- **Objects:** **multi-arm brass candle chandelier**; tall bookcases with ladder; carved writing desk; armchairs and sofa; table lamps with pleated shades; floor lamp; wall clock; framed portraits; potted palms; poinsettia/Christmas tree; garland and baubles; wrapped gifts with red ribbons; rugs; candles; brass tray; ceramic urn; scrolls/papers; antlers/horn on wall.
- **Lighting/FX details:** warm interior candlelight vs. cool daylight from windows; icicle string lights on window.
- **Build components:**
  - Rib-Vault Ceiling Module — Blender mesh — castle library/ballroom anterooms
  - Brass Candle Chandelier — Blender mesh + flicker emissive — castle library
  - Gothic Library Bookcase with ladder — Blender mesh + book-spine texture atlas — library
  - Wrapped Gift Box with ribbon — Blender mesh — birthday presents throughout castle
  - Stained-Glass Arched Window — Blender mesh + stained glass shader — library walls

### U160
- **Patterns:** **giant round wheel-window** (rose window) with radial spokes and a central sun roundel; each segment a different stained-glass scene (starry night swirl, sunbeams, waves, flowers) — split night/day colour scheme; moon-phase garland on wall; circular astrological/mandala chart on the wall; patchwork quilt.
- **Carvings & relief:** wooden rafters (A-frame attic); iron bedstead with scrolled head; wooden chest with brass straps.
- **Edges & profiles:** circular window with radial mullions; sloped attic ceiling.
- **Surfaces & materials:** warm wooden planks; stained glass (vivid, backlit); brass; ceramic; fabric.
- **Objects:** crystal ball on stand (purple glow); cauldron with green glow; open books, stacks of books; teapot and cups; candles; potted plants and hanging planters; easel with flower painting; birdcage; broom; stool; desk; chair; trunk; iron bed; tarot-like cards pinned on wall; dried herbs hanging; rug; cushions; scrolls; succulents.
- **Lighting/FX details:** colourful light projected from the rose window across the floor; purple orb glow; green cauldron glow; dust motes.
- **Build components:**
  - Night/Day Rose Wheel Window — Blender mesh + stained glass shader + coloured light cookie — tower room / ballroom end wall
  - Glowing Crystal Ball on stand — Blender mesh + emissive/refraction shader — wizard tower room
  - Bubbling Cauldron — mesh + emissive liquid shader + bubble particles — potion room
  - Moon-Phase Wall Garland — decal/mesh — tower rooms
  - Mandala Astrology Chart — decal — tower walls

### U161
- **Patterns:** **ribbed Gothic vault** with painted red rib lines on cream ceiling; striped kilim rugs (bands of red, cream, brown); stone ashlar walls; Christmas bunting (triangle pennants); diamond-paned windows.
- **Carvings & relief:** **iron ring candle chandeliers** (wagon-wheel ring with candles, scrolled arms and a central drop; one with an eagle-wings crest); wooden gallery balustrade with square balusters; carved wooden staircase newel and handrail; carved snowflake/star panel; heraldic shield banner; decorative plaster scroll ornament near vault springing.
- **Edges & profiles:** pointed arched windows and doorways; gallery mezzanine edge; sweeping banister.
- **Surfaces & materials:** grey fieldstone walls, cream vaults, dark varnished wood, brass, leather.
- **Objects:** ring candle chandeliers; brass luggage trolley; gramophone; leather suitcases; sofas; palm in pot; antlers; clocks (grandfather clock); fireplace; brass rope stanchions with red rope; floor lamps; snowshoes; telescope; globe; side tables; banners/pennants; sun-face wall ornament; Christmas garlands; easel sign; wicker hamper.
- **Lighting/FX details:** warm candle chandeliers; snowy cold light outside windows.
- **Build components:**
  - Iron Ring Candle Chandelier — Blender mesh + candle flame shader — great hall / castle corridors
  - Gallery Balustrade & Staircase — Blender modular — great hall mezzanine
  - Brass Stanchion with Velvet Rope — Blender mesh — ballroom entrance queue
  - Striped Kilim Rug — texture — lodge areas
  - Triangle Bunting — mesh strip + cloth wind shader — birthday decoration

### U162
- **Patterns:** **diamond lattice / trellis panels** (gold diagonal grid) in wall wainscot panels; boiserie panelling with gilt frames; tiered crystal-prism chandeliers (vertical prism strips); marble floor; quatrefoil/rosette ceiling medallions; damask rug.
- **Carvings & relief:** gilded picture frames; carved panel mouldings; mantel fireplace; heraldic shield with crossed swords (medium relief); bust on shelf (figure); trophies.
- **Edges & profiles:** crown moulding/cornice at ceiling with stepped coffer tray; raised-panel walls with bolection mouldings.
- **Surfaces & materials:** dark taupe painted panels with gold trim; polished white marble floor; amber crystal; dark wood.
- **Objects:** **tiered crystal drum chandeliers** (3 tiers of prisms); hanging gold star ornament; wreaths; Christmas tree; fireplace with fire; armchairs; teddy bear; gift boxes; balloons; lava lamp; round side table; fishbowl; silver urn/ice bucket; table lamp; gramophone; radio; bookcases with glass doors; stockings; garlands; "MERRY CHRISTMAS" letter banner (reuse as "HAPPY BIRTHDAY"); windows with frosted panes; modern AC unit and TV (off-theme, ignore).
- **Lighting/FX details:** warm amber chandelier glow; fire glow; cold snow light at windows.
- **Build components:**
  - Tiered Crystal-Prism Drum Chandelier — Blender mesh + refractive/emissive prism shader — ballroom side salons
  - Gilt Diamond-Lattice Wainscot Panel — normal map + gold trim mesh — ballroom walls
  - Hanging Star Ornament — Blender mesh + emissive — celebration halls
  - Letter Banner "HAPPY BIRTHDAY" — Blender mesh flags — ballroom
  - Marble Floor with Medallion — texture + reflection — salon floors

### U163
- **Patterns:** gear-shaped clock bezel; pinboard paper scatter; filing drawer grids; arched sash window with glazing bars; patterned rug with circular medallion.
- **Carvings & relief:** carved arched bookcase top (round-arch niche shelving); rivet-studded leather desk edge; pipe-built industrial lamp.
- **Edges & profiles:** round-headed arched window; riveted desk border.
- **Surfaces & materials:** dark green painted walls; brown leather; brass; dark wood floor; rain on glass.
- **Objects:** pipe-arm green banker's lamps; brass candlestick telephone; desk; leather chairs; green filing cabinets; arched bookcase; wall clock (gear bezel); framed certificate; cardboard boxes; corkboard map; curtains with tiebacks; potted plant; wire wastebasket; books; bottle; paper scraps. (Office, low theme fit.)
- **Lighting/FX details:** rain streaks on window; warm desk lamp pool vs. cool blue window light; volumetric haze.
- **Build components:**
  - Rain-on-Glass Window — shader (droplet normal scroll) — castle windows on storm nights
  - Arched Niche Bookcase — Blender mesh — study rooms
  - Gear-Bezel Wall Clock — Blender mesh — clock tower interior

### U164
- **Patterns:** vertical wood plank cladding; stone chimney column (rubble stone).
- **Carvings & relief:** none of note.
- **Edges & profiles:** simple shelves.
- **Surfaces & materials:** warm wood, mid-century; tripod lamp with fabric shade.
- **Objects:** record player; desk; desk lamp; tripod floor lamp; bookshelves; stool; fire extinguisher; vintage fridge; posters; cardboard boxes; rug; bottles. (Off-theme modern den.)
- **Lighting/FX details:** warm lamp glow, dim room.
- **Build components:**
  - Tripod Floor Lamp with drum shade — Blender mesh + emissive — cozy reading nook in a tower
  - Rubble-Stone Chimney Breast — normal map — tower rooms

### U165
- **Patterns:** **Voronoi cell / organic cellular lattice** façade on the tall tower (irregular polygon cells framed in white); grid of planter boxes (vertical garden); radial fanlight arched window; striped awning; checker floor tiles on balcony.
- **Carvings & relief:** Art-Deco clock tower (stepped massing, round clock "6 P.M.", cross-braced frame); arched glass entrance with radial mullions.
- **Edges & profiles:** stepped Deco setbacks; deep overhanging eaves on right building; rounded pod forms.
- **Surfaces & materials:** painted stylised; glass, pale concrete, ochre stucco, greenery.
- **Objects:** solar panels; wind turbine; planters; monorail; ATM/kiosk; produce crates; awnings; benches; drones; cypress topiary trees; vertical garden; trash/compost bins; hanging vines; figures and animals (skip). (Off-theme solarpunk city.)
- **Lighting/FX details:** bright day, painterly.
- **Build components (usable bits only):**
  - Voronoi Cell Lattice — shader/normal map (Voronoi edges with glow) — crystal tower glazing or Glowwood magic cage
  - Hanging Planter Boxes with trailing vines — Blender mesh — ring-walkway balconies
  - Radial Fanlight Arch — Blender mesh — castle doorways

### U166
- **Patterns:** **organic Voronoi / cellular lattice** on tower façades (irregular rounded polygons framed in white, filled with green); grid of vertical planters; solar panel grids; checkerboard terracotta floor on balcony; striped awning.
- **Carvings & relief:** none classical; rounded Art-Deco corner building; elevated skyway bridges.
- **Edges & profiles:** rounded building corners, deep cantilevered eaves, curved monorail tracks.
- **Surfaces & materials:** painterly stylised; glass curtain walls, pale stucco, terracotta, lush greenery.
- **Objects:** wind turbines; elevated monorail; robots/kiosks; benches; potted trees and cypress topiaries; planter boxes; street lamps; vending machines; mailbox; hanging vines; signage boards. (Off-theme solarpunk.)
- **Lighting/FX details:** bright midday, soft painterly bloom.
- **Build components (usable only):**
  - Voronoi Green-Cell Lattice — shader (Voronoi edges + inner gradient) — Glowwood canopy screens / crystal greenhouse glazing
  - Checker Terracotta Balcony Floor — tileable texture — tower balconies
  - Trailing-Vine Planter — Blender mesh + vine cards — ring walkway rails

### U167
- **Patterns:** fret/**Greek-key-like meander** motif carved on a tall pale wall panel (right, upper); cracked concrete slab grid; parallel rail lines.
- **Carvings & relief:** ruined columns (plain round shafts), broken overpass; key-fret relief panel (shallow relief).
- **Edges & profiles:** broken, jagged slab edges; snapped railings.
- **Surfaces & materials:** sun-bleached concrete, moss, water.
- **Objects:** collapsed overpass and columns; utility pole with cables and vines; street signs; metal guard railings; broken slabs as stepping stones; shallow flooded pond; lily pads; reeds; leafy shrubs; big shade trees; orange awning; distant ruined towers; figure. (Post-apocalyptic, low theme fit.)
- **Lighting/FX details:** golden backlight haze, warm-to-violet gradient, light leak glow.
- **Build components:**
  - Broken Slab Stepping Stones in shallow water — Blender mesh + water shader — Glowwood stream crossing
  - Meander Key-Fret Relief Panel — normal map — castle wall frieze
  - Vine-Wrapped Pole — mesh + vine cards — overgrown ruin area

### U168
- **Patterns:** cracked paving slabs with grass in joints; awning stripes; window grids; string-light catenaries.
- **Carvings & relief:** none ornamental (modern ruin); pixel-glyph signboards.
- **Edges & profiles:** blocky modern buildings, scalloped awning edges.
- **Surfaces & materials:** painterly; concrete, rusty metal, red canvas awnings, lush grass.
- **Objects:** giant spreading broadleaf tree (banyan/oak-like) arching over the street; smaller round trees; blue hydrangea-like shrub; street lamps; hanging festoon string lights (warm bulbs) under awning; signboards; AC units; water tanks; pipes; utility pole with vines; traffic signs; drain grates; red dumpster; scattered small glowing blue flowers/crystal flecks in grass; figures. (Off-theme modern-overgrown.)
- **Lighting/FX details:** strong warm sunlight from the end of street (bloom), dappled shadows, tiny cyan glowing flecks on ground.
- **Build components:**
  - Festoon String Lights — instanced bulb mesh along catenary + emissive — courtyard canopies, birthday fair
  - Giant Arching Tree — Blender mesh + leaf clumps — Glowwood centrepiece
  - Grass-in-Paving Cracks — decal/vertex-paint shader — ruined/old castle courtyards
  - Glowing Ground Flecks — particle/instanced emissive dots — Glowwood floor

### U169
- **Patterns:** chevron and stripe graphics; neon lettering; rings orbiting a tower.
- **Carvings & relief:** none.
- **Edges & profiles:** stylised cel-shaded outlines.
- **Surfaces & materials:** flat cel-shaded colours, neon.
- **Objects:** giant V-shaped twin spire tower with **floating orbital rings** around it; rails; pipes; billboards; pagoda-roof sign; city blocks; figure. (Off-theme neon city.)
- **Lighting/FX details:** bright day, ring halos.
- **Build components (usable only):**
  - Orbiting Halo Rings around a spire — torus meshes + rotation animation + emissive edge — castle central spire

### U170
- **Patterns:** vertical banners with chevron "V" logo; tile grid floor.
- **Carvings & relief:** giant robot statue (skip); wide stair with central ramp.
- **Edges & profiles:** grand frontal stairway with flanking low walls; hedges.
- **Surfaces & materials:** cel-shaded concrete; neon signs.
- **Objects:** grand stair; tall vertical banners on poles; street lamps; billboards; trimmed hedges; trees; figure. (Off-theme.)
- **Lighting/FX details:** bright neon, comic burst graphic.
- **Build components (usable only):**
  - Vertical Pole Banner pair — cloth mesh + wind shader — flanking castle grand stair
  - Grand Stair with central landing — Blender mesh — castle gate approach

### U171
- **Patterns:** **hexagonal / honeycomb-and-diamond lattice railing** (red tube rail with interlocking hex/diamond frames); window grids; tiled façades.
- **Carvings & relief:** none.
- **Edges & profiles:** tubular railing, overpass beams.
- **Surfaces & materials:** cel-shaded; red painted steel; concrete.
- **Objects:** elevated highway; red lattice railing; cars; buildings; billboards; figure grinding rail. (Off-theme.)
- **Lighting/FX details:** yellow speed streaks, cyan spark trail.
- **Build components (usable only):**
  - Hex-Diamond Lattice Railing — Blender modular tube mesh (recolour gold/bronze) — bridge railing / ring walkways
  - Spark Trail — particle ribbon — magical skating/flight trail

### U172
- **Patterns:** window grids, concentric-ring "target" graphic on a billboard (sunburst rings).
- **Carvings & relief:** none.
- **Edges & profiles:** cel outlines, chunky stacked blocks.
- **Surfaces & materials:** flat cel colours.
- **Objects:** drone; buildings; billboards; car; railings; figure. (Off-theme neon city.)
- **Lighting/FX details:** cyan impact burst.
- **Build components (usable only):**
  - Concentric Ring Sigil (target/sunburst) — decal/emissive — floor portal markings

### U173
- **Patterns:** string-lights over a park; tall vertical banners; ring-shaped hedges around a central plinth.
- **Carvings & relief:** central **armillary-style globe monument** — a large globe wrapped by sweeping golden rings/arcs on a glowing round plinth with lettered rim (fully 3D); twin-lantern lamp posts.
- **Edges & profiles:** circular stepped plinth with glowing rim; hedge rings; pointed-top market tents.
- **Surfaces & materials:** cel-shaded; gold, glowing yellow emissive plinth.
- **Objects:** globe monument; **double-headed lantern lamp posts** (warm, two globes on a crossbar); vertical banners; market tents (pyramidal canopies, blue/purple); round hedges; benches; balloons; roller coaster loops (skip); trees; billboards; figure. (Neon city, but the park plaza layout is useful.)
- **Lighting/FX details:** night with fireworks sparks; glowing plinth ring; warm lamp glows.
- **Build components:**
  - Armillary Globe Monument — Blender mesh (sphere + gold orbit rings) + emissive plinth — centre of castle garden / astronomy court
  - Twin-Head Lantern Lamp Post — Blender mesh + emissive — garden promenades
  - Pyramid-Canopy Market Tent — Blender mesh + cloth — birthday fair
  - Ring Hedge Parterre — Blender mesh — garden layout around fountain

### U174
- **Patterns:** cluster of conical spire turrets (rhythm of needle spires); stone-slab path; layered cliff strata.
- **Carvings & relief:** fairy-tale castle with many slender round towers topped by tall needle cones (pink stone, blue-violet roofs); pagoda tower (3 tiers, upturned eaves) on a cliff ledge; carved stone stair hugging a rock knoll.
- **Edges & profiles:** tall needle conical roofs; upswept pagoda eaves; terraced cliff ledges with grass caps; curving stairs.
- **Surfaces & materials:** painterly; pastel pink/lavender stone; mossy cliffs; flat stone path slabs.
- **Objects:** pastel fairy castle; pagoda; **candy-coloured trees** (orange flat-crowned umbrella/acacia-like tree on knoll, pink cherry-blossom trees, purple trees, lime trees); purple and pink shrubs; red foliage; rock pillars/cliffs; stone path; carved steps; figures; birds.
- **Lighting/FX details:** bright day with big cumulus clouds, colourful saturated palette, aerial perspective haze to blue.
- **Build components:**
  - Pastel Needle-Spire Turret Cluster — Blender modular (round tower + needle cone) — castle silhouette
  - Umbrella-Crown Glow Tree (orange/pink) — mesh + emissive leaf tint at night — Glowwood
  - Cliff-Hugging Stone Stair — Blender mesh — path up to tower/island
  - Grass-Capped Rock Ledge — sculpt + top-moss shader — cliffs around castle

### U175
- **Patterns:** fractured hexagonal plating on a giant floating structure; crumbling brick courses.
- **Carvings & relief:** ruined columns and broken lintel overhead (plain stone); collapsed buildings.
- **Edges & profiles:** broken jagged edges, overhanging slabs.
- **Surfaces & materials:** weathered stone with moss, lavender-tinted; sci-fi pale panels on the floating wolf-shaped craft.
- **Objects:** colossal floating wolf-head-shaped stone/craft (animal form — use only as abstract floating monolith); ruined pillars and slabs; overgrown meadow; vines; ferns; distant mountains; lamp post; small red butterfly; figure reaching with glowing hand.
- **Lighting/FX details:** blue-white magic glow burst from hand; light motes/sparkles; pink light beams shooting from floating structure; soft violet haze.
- **Build components:**
  - Hand-Cast Glow Burst — sprite + particles — player magic interaction
  - Floating Monolith with light beams — Blender mesh + beam shader — sky landmark
  - Overgrown Ruin Pillar — Blender mesh + moss shader — Glowwood ruins

### U176
- **Patterns:** **irregular cobblestone / sett paving** (rounded, worn, interlocking); Flemish/stretcher-bond brick walls; **toothed quoin strips** (rubble-stone quoins alternating long/short at building corners); **herringbone / chevron planked door** (diagonal boards meeting in V); iron window grilles (square grid bars); chevron red-white painted shutter.
- **Carvings & relief:** segmental-arched stone door surround with keystone-less smooth architrave (medium relief); balconies with turned-baluster stone parapets and corbelled bases; window aedicules with projecting sills and lintels; scrolled wrought-iron lantern brackets (spiral curl); arched window head with stone voussoirs.
- **Edges & profiles:** rounded worn edges everywhere (stylised bevels); balcony corbels; ribbed drainpipes; bollards linked by chain.
- **Surfaces & materials:** orange-red brick (stylised, with plaster patches), grey rubble quoins, weathered timber doors, verdigris/green and pink plaster on other houses; iron.
- **Objects:** **wall-bracket hanging lanterns** (hexagonal cage lantern on spiral scroll bracket, dark iron); balcony flower boxes and terracotta pots with geraniums; trailing ivy and hanging green vines; cast-iron drainpipes; tram/rail tracks set in cobbles; fire hydrant (swap for a stone well cap); milk-bottle crate; bollards with chain; flower pots on wall hooks; shutters; laundry balconies; graffiti (ignore).
- **Lighting/FX details:** warm late sun on brick, cool blue shade; crisp sky.
- **Build components:**
  - Scroll-Bracket Hanging Cage Lantern — Blender mesh + emissive — castle courtyard walls, village lanes
  - Rubble Quoin Corner Strip — Blender mesh/normal map — castle outbuildings
  - Chevron-Planked Arched Door — Blender mesh + wood normal — castle side doors
  - Baluster Balcony with Flower Box — Blender modular — castle residential wing
  - Worn Cobblestone Lane — tileable texture + parallax/normal — village streets
  - Bollard-and-Chain Edge — Blender mesh — moat edge / bridge approach

### U177
- **Patterns:** **Greek key / fret** relief bands on the totem headdress and edges; stone-block arch voussoirs with small carved glyph blocks (spiral and wave **glyphs**); chevron/arrowhead rune carvings on the sandstone pillars; checkered brown basket-weave/grid deck; Maya-style stepped fret on blue column bases.
- **Carvings & relief:** stylised **mask-head water spout** (stone idol face with spout mouth, gold side plumes; fully 3D — in our game use an abstract faceless urn spout instead); arched stone surround of carved blocks; turned **baluster-like bulbous columns** (blue with gold rings) under a balustrade; carved sandstone monolith pillars with incised runes (shallow relief).
- **Edges & profiles:** round arch of stepped stone blocks; balustrade with pear-shaped balusters; bevelled stylised pillar caps.
- **Surfaces & materials:** stylised sandstone, turquoise glazed tile/stone, gold; translucent blue water with white foam ripples.
- **Objects:** wall fountain with spout falling into a teal-rimmed pool; sandstone pillars; balustrade terrace; palms (fan/banana); ferns; cacti; boulders; wooden deck; dome-shaped earthen buildings.
- **Lighting/FX details:** bright desert sun; water caustic pattern; foam ring where water lands.
- **Build components:**
  - Arched Wall Fountain with spout and foam pool — Blender mesh + water shaders — castle courtyard walls (spout = urn, not a face)
  - Greek-Key Relief Band — normal map trim sheet — friezes on castle walls
  - Rune-Incised Monolith Pillar — Blender mesh + emissive rune decals — Glowwood standing stones
  - Bulbous Gold-Ringed Baluster — Blender lathe mesh — terrace balustrades

### U178
- **Patterns:** **Greek key / meander** border in two concentric rings around a giant circular disc door; ring of **spiral glyph tiles** (stepped-fret "G" shapes) between borders; inner circle of carved rune motifs around a round double door; large-format square stone floor slabs with dark joint lines; baluster rhythm.
- **Carvings & relief:** monumental **circular disc portal** (red-brown with cream fret inlay; shallow relief); round double door with incised geometric panels; flanking carved sandstone obelisk pillars with incised runes; balustrade with turned balusters; blue bulbous columns with gold bands; small carved totem bollards with lanterns (striped).
- **Edges & profiles:** circular portal frame with stepped rims; central stair rising to door; balustrade copings.
- **Surfaces & materials:** stylised sandstone, terracotta-red panel with cream inlay, turquoise tile, gold.
- **Objects:** disc portal temple gate; stair; pillars; balustrade; **post lanterns/braziers** (short drum-shaped striped lantern posts); palms; ferns; boulders; pools either side; flagstone forecourt.
- **Lighting/FX details:** bright daylight; long shadows.
- **Build components:**
  - Meander-Ring Disc Portal — Blender mesh + normal/emissive inlay (glowing at night) — castle ballroom grand door or secret garden gate
  - Large-Slab Forecourt Paving — tileable texture — castle forecourt
  - Striped Drum Lantern Post — Blender mesh + emissive — stair flanks
  - Turquoise Baluster Terrace — Blender modular — gate terrace

### U179
- **Patterns:** bands of triangle **pennant bunting**; **ikat/diamond-lozenge** woven textiles hanging over balconies; Moorish **jali lattice** screens in arched windows; green painted **arabesque vine scroll** stencil on the red wall; horseshoe-pointed arched windows; wooden slat pergola rhythm; layered sandstone strata on rock arches.
- **Carvings & relief:** pointed (ogee-ish) arched window niches with recessed frames (deep relief); round **oculus rosette window** (lattice roundel) on a building at right; domed rooftop kiosks; balustraded terraces; carved terracotta pots.
- **Edges & profiles:** flat-roofed terraces with parapets; overhanging timber canopies; rounded stylised rock arches.
- **Surfaces & materials:** red-ochre plaster with stencil; sand-coloured stone; weathered wood scaffolding; silk shade sails (saffron yellow, violet); brass pots; turquoise powder heaps.
- **Objects:** **draped shade sails / cloth canopies** strung between buildings; bunting; market stalls with awnings; wooden scaffolding/towers; ladders; crates; barrels; clay pots and vases; brass ewers and lamps; spice heaps (blue powder cone); woven rugs hung out; potted palms and ferns; cacti; flowering vines (pink); coral-like dry shrubs; sandstone arches; domes; a goat statue/animal (skip).
- **Lighting/FX details:** bright desert sun with warm dust haze; wisps of wind swirls (white curl streaks); sunlit dust in the street.
- **Build components:**
  - Draped Silk Shade Sails — cloth mesh + wind vertex shader — birthday fair/castle courtyard canopy (glow at night with lantern light)
  - Pennant Bunting Strings — instanced triangle mesh on catenary — festival streets, castle gate
  - Arabesque Vine Stencil — decal — plaster walls in courtyards
  - Jali Arched Window Screen — alpha-tested mesh/decal — garden pavilion windows
  - Wind Swirl Wisps — ribbon particle — atmospheric FX on towers/bridges
  - Brass Ewer & Pot set — Blender mesh — market/stall dressing

### U180
- **Patterns:** **Russian 'gingerbread' fretwork** — sawn-wood lacework friezes (pierced heart and scroll pattern bands, dentil drops, scalloped valances) along every eave and string course; **kokoshnik-shaped window nalichniki** (pointed pierced wooden window crowns with lace borders); **fish-scale roof shingles** (rose-red); jali/lattice screen panel bottom left; swirling wave/marbled pattern on a giant vase; diamond lattice on a lantern.
- **Carvings & relief:** carved wooden window surrounds (pierced/fretwork, medium relief, painted white-blue); **turned spindle columns / balusters** (long lathe-turned posts with bulbous and faceted sections) as decorative pilasters (fully 3D); carved scroll brackets under eaves; ogee-curved gable barge boards with fretwork; sunburst carved semicircular panel above an arched window; arched niche doorway; veiled/robed small statue (faceless-friendly).
- **Edges & profiles:** ogee/keel-shaped gables (onion-curve roof edges), spires with thin needle finials; layered stepped cornices with dentils and drops; scalloped valance edges; arched door niches.
- **Surfaces & materials:** salmon-pink stucco with peeling patches revealing lighter plaster; weathered white/blue painted wood fretwork with chipped paint; rose-red tile roof; glass with dark reflections; ceramic vases with glossy glaze patterns.
- **Objects:** gingerbread-trim manor; **festoon fairy lights** (teal-glowing bulbs on strings); hanging **pierced metal lantern** (Moroccan-style, cylindrical, lattice) on a bracket; tall bottle-neck vases/ewers; round lidded pots; jali screen chest; open wooden shutters; floating broken rock chunks in the sky; sand drifts; robed small statue.
- **Lighting/FX details:** dusk storm sky with floating debris; teal fairy light glows; warm string lights on distant building; soft ambient fill.
- **Build components:**
  - Gingerbread Fretwork Frieze — alpha-cut mesh strip / trim sheet with normal map — castle eaves, Glowwood cottages, ballroom balconies
  - Kokoshnik Window Crown (nalichnik) — Blender mesh with pierced fretwork — castle residential windows
  - Turned Spindle Pilaster — Blender lathe mesh — façade decoration, gallery posts
  - Ogee/Keel Gable with needle finial — Blender mesh — tower roofs
  - Pierced Lattice Hanging Lantern — Blender mesh + emissive with patterned light cookie — courtyards, ring walkways
  - Teal Fairy-Light Strings — instanced emissive bulbs — eaves and walkway rails at night
  - Peeling Plaster Shader — layered mask shader — aged walls
  - Glazed Marbled Vase set — Blender mesh + swirl texture — courtyard dressing

### U181
- **Patterns:** 8-point / 16-point girih star strapwork recessed in the dark indigo ceiling coffers (star-and-cross interlace in shallow raised gold-tan ribs on a deep blue-violet ground); blue zigzag/sawtooth (chevron "mountain") band painted round the base of every column; plain ashlar coursing on the parapet wall; large rectangular stone floor slabs in a running grid.
- **Carvings & relief:** column capitals are Indo-Islamic/Mughal-style bell capitals — stacked square abacus, cavetto collar and a band of tiny lotus-petal/leaf relief (shallow relief, ~1–2 cm); bulbous column bases with a moulded torus; octagonal coffer frames with cusped (lobed) edges around each ceiling star panel (medium relief); square pier with stepped impost blocks.
- **Edges & profiles:** four-centred / Tudor-like pointed arches with a heavy soffit roll moulding and a flat outer fascia; arches meet in groined vaults; ogee-tipped arch at the far niche; deep stepped cornice around coffers; parapet with flat coping and a slight overhang; sun catches the rounded roll moulding of each arch as a bright rim line, soffits in soft bounce light.
- **Surfaces & materials:** warm sandstone, smooth matte with soft painted AO; cobalt/indigo painted stucco in the coffers; light lavender-blue band strips (glazed tile look) around columns; polished floor slabs with faint reflection.
- **Objects:** colonnade of round columns; stone stair with low parapet (left); balustrade/parapet wall (right); niche shrine with small red/gold altar box at the far end; distant terraced building with palms and white blocks.
- **Lighting/FX details:** strong warm late-afternoon sun, long column shadows across floor, cool blue sky bounce in shadows, a violet-blue rim light on the inner arch edges (feels like magic glow).
- **Build components:**
  - Girih-star coffered ceiling panel — normal map + emissive gold line decal on indigo base — ballroom ceiling / castle cloister vaults
  - Mughal bell capital + torus base column — Blender mesh (lathe + leaf band normal map) — ring walkways colonnade
  - Four-centred arch with roll moulding — Blender mesh, modular bay — cloister / covered walkway
  - Chevron band column wrap — decal / tiling texture with slight glossy glaze — column bases throughout
  - Cusped octagonal coffer frame — Blender mesh — ceiling modules

### U182
- **Patterns:** stepped/chamfered "polygonal arch" outline repeated in nested layers around the doorway (concentric stepped frames); vertical panel seams in the wall cladding; terracotta planter coping.
- **Carvings & relief:** none figurative; door surround is a deep stepped multi-layer frame (each layer ~10–20 cm, deep relief) with an octagonal-topped (chamfered pointed) opening; inset ring collar on palm trunk (tech detail).
- **Edges & profiles:** stepped hexagonal-pointed arch (a "pointed arch drawn with straight chamfers"); thin inset metal channel lines running up the tower; rounded fillet edges on planters; the right-hand building has a lavender-blue inner trim stripe following the arch outline; bevels catch a crisp warm edge highlight.
- **Surfaces & materials:** smooth warm stucco/sandstone with soft gradients; dark bronze/brown metal door leaves with a gold-lit frame; terracotta red-brown plinths; cream concrete planters.
- **Objects:** tall double door (bronze); date palms in raised planters; floating white halo ring around a palm (hovering light ring); red-orange flowering shrubs (lily-like), ferns/cycad bushes; small potted plants by the door; low planter boxes stepping down to the sea; paved terrace.
- **Lighting/FX details:** pink-gold sunset sky, warm bounce on the wall, cool blue shadows, glowing halo ring.
- **Build components:**
  - Nested stepped-pointed door surround — Blender mesh (inset loops) — castle side doors / tower entrances
  - Floating halo light-ring around tree trunk — mesh torus + emissive shader + bob animation — Glowwood trees / courtyard palms
  - Raised stone planter with flower bed — Blender mesh + instanced flowers — ring walkways
  - Inset glowing channel lines on tower wall — emissive decal strips — tower exteriors

### U183
- **Patterns:** jali screen of 8-point stars and cross shapes (pierced star-and-cross lattice) in the dark canopy of the giant "tree" structure; large diamond-quarry lattice (rhombic grid with an inner rotated-square/star overlay) in tall glowing gold windows; honeycomb/hexagonal grid filling an ogee-arched window (centre building); lotus-petal outline inlaid in thin gold lines on the canopy underside; palm-frond rhythm.
- **Carvings & relief:** canopy edge with stepped profile; building cornice with deep corbelled crown (medium relief); pilasters with stepped bases; ogee-arched door frames with narrow gold trim; small onion-dome kiosks in the background.
- **Edges & profiles:** ogee (keel) arches on doors and windows; flat crowning cornice with stacked mouldings; gold edge piping following the lotus petal lines; canopy rim with thick bevel; windows framed by a broad flat border.
- **Surfaces & materials:** lilac-grey stone/stucco; dark charcoal-violet metal canopy with gold inlay; golden amber glass panels (frosted/backlit); white sci-fi pods.
- **Objects:** giant mushroom/tree-like canopy column (pierced parasol); hovering white pods/vehicles; date palms; lamp post with halo ring; planters; arched building entrances; signage panel; benches; tall glowing curtain-wall tower (left).
- **Lighting/FX details:** amber light glowing through diamond lattice windows; sun flare at the top left; light pools around doors; purple sky gradient.
- **Build components:**
  - Pierced star-and-cross jali canopy — Blender mesh with boolean cut-outs or alpha-masked shader — Glowwood gazebo / garden pavilion roof
  - Gold lotus-line inlay — emissive line decal on dark metal — ceiling undersides, ballroom dome
  - Glowing diamond-lattice window — mesh frame + emissive amber glass shader — castle great hall windows
  - Honeycomb-fill ogee window — alpha/normal map panel — tower windows
  - Giant parasol "tree" column — Blender mesh — plaza centrepiece

### U184
- **Patterns:** brick/ashlar stonework on the towers (normal map scale); vertical slat steel railing panels; yellow chevron road markings; city window grids (background).
- **Carvings & relief:** bridge towers with Gothic pointed lancet openings, twin nested pointed arches with a chamfered/recessed reveal (deep relief); bracket corbels/sconce housings on the piers; stepped pier capitals and corniced tops with projecting cap mouldings (medium relief).
- **Edges & profiles:** pointed lancet arches with multiple stepped orders; cornice cap blocks on each tower; chamfered pier corners; rounded parapet coping.
- **Surfaces & materials:** weathered blue-grey granite with soft stains; asphalt road; yellow-painted steel guard rail boxes; dark iron rail posts.
- **Objects:** suspension-bridge stone towers; streetlamps (modern cobra-head, warm-orange); wall-mounted lanterns in the arch openings; guard-rail barriers; sidewalks; distant skyscrapers (off-theme).
- **Lighting/FX details:** night scene, deep blue sky with stars, warm orange point lights in arches and on lamps, cool moonlit rim light on stone edges.
- **Build components:**
  - Gothic gate tower with nested lancet arches — Blender mesh — castle bridge gate towers
  - Wall sconce lantern in arch reveal — mesh + emissive point light — gatehouse passage
  - Weathered blue-grey ashlar — tiling normal/roughness texture — bridge/gate stonework
  - Stepped pier cap — Blender mesh — bridge piers

### U185
- **Patterns:** twisting stacked-cuboid tower (rotated prism stack, "helix of boxes"); steel lattice truss at the summit; terraced garden levels with clipped hedges; repeated domed bollard pylons along the dam.
- **Carvings & relief:** domed white pavilions/kiosks with onion-dome tops and spire finials (fully 3D); pilaster rails along the dam wall.
- **Edges & profiles:** soft rounded edges on terraces; onion-dome silhouette with lantern finial; curved balustrade wall with flat coping.
- **Surfaces & materials:** smooth white plaster; dark slate metal tower facets; water with soft reflections; green lawns.
- **Objects:** twisted megatower; small onion-domed gate pavilions; dam with mist-falling spillway; floating hover-airship; terraced island with palms, cypress-like columnar trees; car/vehicles; road bridge; lamp posts.
- **Lighting/FX details:** dusk violet-pink sky with stars, low sun glare, mist rising from the spillway/waterfalls, soft atmospheric haze.
- **Build components:**
  - Onion-dome gate pavilion with finial — Blender mesh (lathe) — bridge ends / ring walkway pylons
  - Twisted stacked-block spire — Blender mesh (array + rotate) — distant wizard tower silhouette
  - Waterfall mist curtain — particle + translucent card shader — moat spillways
  - Terraced hanging garden island — mesh + hedge instancing — floating islands

### U186
- **Patterns:** repeated eaves bands of a seven-storey pagoda; lattice window grids (orange paper-screen grid) on each storey; curved roof tile ribbing on wall copings (barrel tiles).
- **Carvings & relief:** upturned roof corners (flying eaves) with small ridge ornaments; carved wooden bracket sets (dougong-style) under eaves (medium relief); mast/spire finial (sorin) on top; carved plaques/sign brackets at the base.
- **Edges & profiles:** strongly curved upswept eave tips; tiered roofs diminishing upward; rounded tile ridge copings on garden walls.
- **Surfaces & materials:** dark slate roof tiles; lit amber paper windows (emissive); stucco base painted lavender; dark timber.
- **Objects:** pagoda tower; bonsai-like windswept pine; broadleaf trees; tiled wall top; background neon tower (off-theme); moon; temple gate roofs.
- **Lighting/FX details:** deep violet night with stars; big pale moon; warm orange window glow; cool blue up-lights on the pagoda base.
- **Build components:**
  - Tiered upswept-eave roof module — Blender mesh — Glowwood shrine / tea pavilion
  - Glowing paper-lattice window — emissive grid shader — pagoda/lantern houses
  - Windswept pine — Blender mesh/foliage cards — garden islands
  - Barrel-tile wall coping — Blender mesh array — garden walls

### U187
- **Patterns:** visually identical to U186 (same render, different file encoding): pagoda eaves rhythm, paper lattice windows, barrel tiles.
- **Carvings & relief:** as U186 — upswept eave tips, bracket sets, spire finial.
- **Edges & profiles:** as U186.
- **Surfaces & materials:** as U186.
- **Objects:** pagoda, windswept pine, moon, garden wall, broadleaf trees.
- **Lighting/FX details:** as U186 — moonlit violet night, warm windows.
- **Build components:**
  - (duplicate of U186) Upswept eave roof tier — Blender mesh — Glowwood shrine
  - Moonlit skydome with stars — shader — global night sky
  - Base up-light wash — spot light/decal — tower bases

### U188
- **Patterns:** stacked tiered Chinese roofs with gold edge lines; neon sign grids; glowing panel of a misty mountain landscape painting (shan-shui) on a giant vertical screen.
- **Carvings & relief:** roof ridge ornaments and upturned eaves, painted beams; arched covered bridge (moon bridge with pavilion) spanning between buildings.
- **Edges & profiles:** golden emissive piping along every eave edge and bridge curve; upturned roof hooks.
- **Surfaces & materials:** red lacquered timber; gold trim; emissive screens; glossy wet water surface.
- **Objects:** pagoda-style towers; covered arched footbridge; giant glowing scroll-painting monolith; waterfall-like glow beneath; red-blossom trees; arched golden walkway rail in the foreground; neon signs (off-theme).
- **Lighting/FX details:** strong gold glow column, volumetric halo, reflections on water, neon pinks/blues.
- **Build components:**
  - Gold emissive eave piping — emissive edge shader/tube mesh — every roofline at night
  - Glowing scroll monolith with painted landscape — emissive textured panel — magical portal / plaza centre
  - Covered pavilion bridge — Blender mesh — bridge between ring islands
  - Red-blossom tree — foliage cards — Glowwood

### U189
- **Patterns:** diamond/lozenge diaper brickwork in red and cream (right building upper storey); cobalt-blue tile cladding with small grid; herringbone/running-bond paving slabs; terracotta pantile roofs; striped barber-pole mooring posts (blue-white spiral); fish-scale effect on bell tower roof.
- **Carvings & relief:** octagonal Venetian well-head (vera da pozzo) with carved shield/scroll brackets at each corner and blind arches between (medium relief); Gothic triple-arched window with flower box; stone window frames with cornices; corbelled chimney pots (funnel-shaped Venetian chimneys); campanile with belfry arcade and pyramidal spire.
- **Edges & profiles:** strongly projecting stone eaves cornice; stone string courses; quoined door frame; scalloped awning edges.
- **Surfaces & materials:** red brick and pink stucco; Istrian white stone trim; glazed cobalt tile; teal canvas awnings; green wooden shutters; polished pale paving.
- **Objects:** stone well-head on stepped octagonal plinth; awnings; shutters; mooring poles; campanile; benches; lamp posts; flower boxes; chimneys; canal.
- **Lighting/FX details:** bright daylight, crisp shadows.
- **Build components:**
  - Octagonal carved well-head — Blender mesh — castle courtyard wishing well
  - Barber-pole mooring post — mesh + spiral stripe shader — moat boat docks
  - Diamond diaper brick wall — tiling texture + normal map — town houses below castle
  - Venetian funnel chimney — Blender mesh — rooftops
  - Scalloped canvas awning — Blender mesh/cloth — market stalls

### U190
- **Patterns:** wrought-iron balustrade railing with repeating loops and spear finials (Parisian scroll ironwork); stone baluster rows; mansard slate roofs; brick-and-stone quoined facades.
- **Carvings & relief:** turned stone balusters (vase-shaped) on stair railings (fully 3D); cast-iron wall bracket lantern with scroll arm (fully 3D); Morris column (advertising kiosk) with domed cap and finial; dormer windows with pediments; carved cornices; Eiffel-type lattice tower (truss pattern).
- **Edges & profiles:** stair balustrade with sloping handrail; rounded stone coping; mansard roof with curved hips; finial-topped kiosk domes.
- **Surfaces & materials:** cream limestone; dark green/black cast iron; brick red; slate; warm brass lantern glass.
- **Objects:** twin bracket wall lanterns (glass lanterns with glowing globes); Morris advertising column; ornate lamp post with lantern; vintage car; hot-air balloons; Eiffel tower; stone staircase with balusters; flowering planters; café sign.
- **Lighting/FX details:** hazy pink sunset haze, glowing lantern bulbs with bloom.
- **Build components:**
  - Scroll-arm wall bracket lantern — Blender mesh + emissive glass — castle walls, gatehouse
  - Wrought-iron loop railing with spear tops — Blender mesh/alpha card — ring walkways, bridges
  - Vase baluster staircase rail — Blender mesh — grand stairs
  - Domed kiosk / Morris column — Blender mesh — plaza notice column (with magic posters)
  - Hot-air balloon / floating lantern — mesh — sky dressing

### U191
- **Patterns:** fish-scale/diamond-scale texture on giant cable/hose ducts; fluted pilaster grooves (vertical reeding); arcade of circular oculus openings; row of tall Art Deco fin pylons.
- **Carvings & relief:** monumental Art-Deco-like facade with stepped fins and broken cornices; coffered arch hood (segmental arch with radiating fluted ribs, deep relief); stepped pilasters; round porthole windows in arcades.
- **Edges & profiles:** stepped vertical fins; segmental arches; broken, cracked edges; chamfered blocks.
- **Surfaces & materials:** sun-baked sandstone with cracks and chips; dark scaled hoses; red desert soil.
- **Objects:** collapsed facade ruins; serpentine cables; rubble blocks; camp table with crates, radio/antenna and screens; grass tufts; crumbled boulders.
- **Lighting/FX details:** low warm sun, dusty haze, long shadows.
- **Build components:**
  - Scale-textured serpentine vine/cable — Blender curve + scale normal map — overgrown ruins (as magical vines)
  - Fluted fin pylon wall — Blender mesh — outer castle walls (stylised)
  - Radiating fluted arch hood — Blender mesh — gate canopy
  - Broken-edge masonry rubble kit — Blender mesh — ruins zone

### U192
- **Patterns:** trefoil/three-lobed roundel (cusped oculus) set in a ring at the top of the arch; ashlar blocks with soft rounded edges (stylised); stepped slab stair.
- **Carvings & relief:** ruined Gothic-ish round arch with three stepped orders of roll mouldings (deep relief); two flanking pointed-gable niches (aedicules) with stepped frames, holding small broken column stubs/candles (medium-deep relief); trefoil plate tracery oculus (pierced, fully 3D).
- **Edges & profiles:** roll-moulded archivolt; pentagonal (gabled) niche heads with inset frame; rough broken wall tops; bevelled step edges catch sun.
- **Surfaces & materials:** grey stone with stylised soft bevels, ochre lichen patches on top surfaces; painted hand-made look.
- **Objects:** ruined archway; wall niches; candle/column stubs in niches; stone stair steps; flat path slabs; orange autumn grass; white daisies; blue butterfly-like flowers; autumn trees; drifting leaves.
- **Lighting/FX details:** bright day with dappled leaf shadows on the stone, falling leaf particles, wind streaks.
- **Build components:**
  - Trefoil oculus roundel — Blender mesh (boolean) — castle gables / ruins / chapel
  - Gabled niche with candle — Blender mesh + emissive candle — walkway walls, shrines
  - Stylised soft-bevel ashlar ruin wall — Blender mesh kit — Glowwood ruins
  - Falling leaf particles — particles — Glowwood
  - Dappled leaf shadow — light cookie/decal — forest paths

### U193
- **Patterns:** half-timbered framing with diagonal braces (St Andrew's cross / K-bracing) over brick infill; spiral swirl runes on bargeboard ends and door; overlapping thick timber shingle planks; curl-tipped fiddlehead vines.
- **Carvings & relief:** oversized chunky carved rafter ends and ridge cap with spiral emblems (fully 3D, cartoon); arched doorway with plank door and cross-bars; round arched window with timber arch; post-and-rail fence with notched joints.
- **Edges & profiles:** thick exaggerated bargeboards with rounded ends; curved door arch; overhanging jettied upper floor.
- **Surfaces & materials:** red-stained wood grain; cream brick; dark grey slate trim; glowing pink-white rune marks (emissive).
- **Objects:** cottage; ivy curtains; giant fiddlehead fern curls; wooden fences; dock with crates and fishing rod; rowing boat; mushrooms (multicoloured, toadstool); boulders; leafy trees; wildflowers (pink, purple); dirt path; mountains.
- **Lighting/FX details:** sunny day; glowing rune symbols on door and rafters.
- **Build components:**
  - Glowing spiral rune decal — emissive decal — doors, gate, Glowwood signposts
  - Giant fiddlehead fern curl — Blender curve mesh — Glowwood ground cover
  - Chunky timber post-and-rail fence — Blender mesh — garden paths
  - Toadstool cluster (glow variant) — Blender mesh + emissive cap shader — Glowwood
  - Ivy curtain — alpha cards — castle walls

### U194
- **Patterns:** half-timbering with diagonal braces, crossed X-braces and curved arch braces; grid of small square leaded-pane windows set in timber cassettes (row of repeating window boxes on the jettied storey); wavy hand-cut plank shingle roofs (purple-red slate/shingle, irregular); bunting triangles in alternating purple/white/blue; cobble/rubble stone wall infill.
- **Carvings & relief:** carved curved brackets (knee braces) supporting jetties (medium relief, fully 3D wood); hanging trade signs (tankard sign, boot sign, fish sign) in wooden frames with carved relief motifs (shallow relief); bargeboards with flared tips; tower with crenel-less timber belfry and conical/pyramidal spire.
- **Edges & profiles:** strongly overhanging jettied upper floors; swept roof eaves flaring outward; deep eave brackets; arched plank doors.
- **Surfaces & materials:** warm orange stained timber; plaster and fieldstone; purple slate; worn wood planks; ivy.
- **Objects:** watchtower with pennant flag; bunting garlands; hanging laundry (tunics); wooden handcart; crates of apples (red fruit); barrels; buckets; ladder; hanging signs; wagon wheel; chimney smoke; arrows stuck in post (foreground); green bushes; daisies on lawn; dirt road.
- **Lighting/FX details:** daytime, soft vignette, chimney smoke plume.
- **Build components:**
  - Jettied half-timber storey module with window cassettes — Blender mesh kit — town quarter below castle
  - Carved hanging shop sign with bracket — Blender mesh + painted decal — market lane
  - Bunting garland — curve + instanced pennant cards with wind shader — festival streets, birthday plaza
  - Apple crate / handcart props — Blender mesh — market
  - Chimney smoke — particle — rooftops

### U195
- **Patterns:** bunting of small green/purple square flags and lanterns strung across the street; half-timbering; purple fish-scale/shingle roofs; rounded stone bridge arch.
- **Carvings & relief:** round towers with conical caps and corbelled bands; arched gateway bridge linking two buildings (stone arch with timber gallery above); rounded doors with carved timber frames; scalloped-edge awnings on market stalls.
- **Edges & profiles:** rounded arch passage, turret corbel rings, steep gables with bargeboards.
- **Surfaces & materials:** cream plaster, warm timber, purple shingles, grey stone, golden autumn foliage.
- **Objects:** market stall with striped awning; pumpkins/produce crates; white picket fence; ivy and hanging vines; window flower boxes; autumn yellow trees; signboards; barrels; flowers.
- **Lighting/FX details:** warm bright daylight, gentle haze.
- **Build components:**
  - Arched skybridge passage between houses — Blender mesh — town gate over road
  - Hanging string of flags/lanterns — curve + instanced cards — birthday streets
  - Striped scalloped market awning — Blender mesh — market stalls
  - Round turret with conical cap — Blender mesh — town corners

### U196
- **Patterns:** stone quoins and broken plaster revealing brick patches; board-and-batten planking; swallow-tail flag; scalloped drape swag (purple fabric) along the shop porch.
- **Carvings & relief:** chunky stone corner piers in dark grey blocks; little gabled door canopy (hood) with blue tiled roof and gold ridge; small four-point star carved/painted in gable; carved balcony railing with turned balusters; wooden bargeboards sweeping in a dramatic concave curve (ogee-like roof).
- **Edges & profiles:** concave swooping roof line (S-curve gable), overhanging eaves with exposed beams; moss lips over roof edges.
- **Surfaces & materials:** terracotta-red painted wood, cream plaster, grey stone, mossy grass roof, brass fittings.
- **Objects:** cottage tucked under a giant leaning boulder; balcony; hanging birdhouses; hanging cage lantern; hanging diamond-shaped glass lanterns under swag (three, octahedral); "store" sign; barrels; clothesline with laundry; birch tree; flagpole with banner; chimney pots with smoke puffs; plank fence; stepping stones; lavender spikes.
- **Lighting/FX details:** bright blue sky, painterly; heart-shaped smoke puffs (whimsical).
- **Build components:**
  - Octahedral hanging glass lantern cluster under fabric swag — Blender mesh + emissive glass — ring walkway shops, Glowwood stalls
  - Gabled door hood with tiled mini-roof — Blender mesh — castle side doors
  - Swooping concave roof gable — Blender mesh — cottages
  - Hanging birdhouse / cage lantern — Blender mesh — trees in Glowwood
  - Scalloped fabric swag — cloth sim or mesh — stalls, ballroom drapes

### U197
- **Patterns:** black-and-white chequer floor tiles (marble); concentric ring mosaic (target/sunburst rings with dots) on round balcony floor; candy-stripe red-white curtains; balustrade of pierced arched openings (arcaded parapet).
- **Carvings & relief:** cusped/scalloped Moorish arch doorway with gold trim on the white building (multifoil arch, medium relief); twisted Solomonic gilded column holding the balcony; arched blind-arcade parapet; curved wrought balcony railing with gold rails.
- **Edges & profiles:** multifoil (scalloped) arch edge; horseshoe-like arch window; broken floor edges of the floating island.
- **Surfaces & materials:** polished chequer marble; white plaster; gold leaf trim; teal cloth; magenta velvet; aged wood.
- **Objects:** floating island diorama; spiral balcony; teal umbrella/awning; cushions (red, yellow); potted palms; fruit stall; crates; teal carpet runner/waterfall-like ribbon spilling off the edge; candles; baskets; broken boards; ivy.
- **Lighting/FX details:** warm interior glow, black background.
- **Build components:**
  - Multifoil gilded arch door frame — Blender mesh + gold shader — ballroom side doors
  - Chequer marble floor — tiling texture with roughness/reflection — ballroom/throne room floor
  - Concentric ring mosaic disc — decal — balcony floors
  - Gilded Solomonic twist column — Blender mesh (screw modifier) — balcony supports
  - Arcaded pierced parapet — Blender mesh — terrace edges

### U198
- **Patterns:** stained glass in a Gothic lancet window: two lights with red/green/blue/amber quarries, a cusped quatrefoil rosette (blue centre) in the head; Y-tracery/bar tracery; cobblestone floor; stacked books.
- **Carvings & relief:** bar tracery with two cusped lancets and a quatrefoil oculus (fully 3D, pierced); a carved wooden bookcase with a gabled scrolling pediment and a cross-quatrefoil cutout at top (medium relief); stone ruin wall blocks.
- **Edges & profiles:** pointed arch with heavy chunky stylised voussoirs; ogee-cusped pediment on bookcase; bevelled blocks.
- **Surfaces & materials:** blue-grey stone, warm wood, emissive stained glass, gold trims, coloured light pools on floor.
- **Objects:** bookshelf with books; scattered open books and scrolls; globe/orb on a stand; potion bottles; roses (red) and white flowers, ivy; pocket watch/clock; candle; small chest; gilded lectern.
- **Lighting/FX details:** coloured light shafts projecting stained-glass colour onto the floor (gobo caustic), floating dust sparkles, warm glow.
- **Build components:**
  - Gothic stained-glass lancet with quatrefoil head — Blender mesh tracery + emissive glass shader — chapel/library/castle hall windows
  - Coloured stained-glass floor projection — light cookie / projected decal — library floor
  - Gabled carved bookcase with quatrefoil cutout — Blender mesh — castle library
  - Floating dust motes — particles — library, ballroom light shafts
  - Ruin cobble floor patch — tiling texture — Glowwood ruins

### U199
- **Patterns:** blue-violet roof tiles (rectangular slate rows) with silver hip ribs; ruined stone ashlar; plank boardwalk spiral; lily pad clusters.
- **Carvings & relief:** small chapel/belfry with pilasters and round arches; cross finial on roof apex (avoid religious use — swap to star finial); pilasters with capitals; gothic arch opening in tower base.
- **Edges & profiles:** hipped roof with pale metal ridge caps; broken floating-island underside; rope railing.
- **Surfaces & materials:** lilac stone, blue tiles, warm wood, waterfall/foam.
- **Objects:** floating island; small belfry tower; wooden spiral stair with rope rail; wooden rowing boat on end; lantern hanging; blossom tree (pink/red flowers); lily pads and yellow flowers; rocks; ivy; pond with waterfall going off edge.
- **Lighting/FX details:** warm sun shaft, sparkles/floating petals, mist at the waterfall base.
- **Build components:**
  - Floating island base with falling-water edge — Blender mesh + particle waterfall — sky islands around castle
  - Hipped roof with silver ridge caps and star finial — Blender mesh — small towers
  - Rope-railed plank stair — Blender mesh + curve rope — island paths
  - Lily pad pond — mesh cards + water shader — Glowwood ponds
  - Blossom canopy tree — foliage — Glowwood

### U200
- **Patterns:** pixel/stepped "sawtooth" chequered stone edges; lattice frieze of triangles (zigzag truss/vandyke pattern) on the architrave of the ruined temple; stacked block stairs.
- **Carvings & relief:** classical post-and-lintel ruin with square columns; broken column with stylised capital; triangular-lattice frieze; small stone marker pedestals/lantern bases.
- **Edges & profiles:** blocky chamfered stones; broken pediment arch.
- **Surfaces & materials:** pale grey stone, moss; glowing blue water basin.
- **Objects:** ruined temple; fountain basin with glowing turquoise water running down steps (stair cascade rill); stone pedestals/markers; red flowers; dark forest trees; ivy.
- **Lighting/FX details:** dappled sunbeams, pools of light on grass, glowing water.
- **Build components:**
  - Stair cascade rill with glowing water — Blender mesh + emissive water shader — Glowwood shrine steps
  - Zigzag lattice frieze — normal map / mesh — temple ruins
  - Broken column set — Blender mesh — ruins
  - Dappled light pools — decal/light cookie — forest floor

### U201
- **Patterns:** castle curtain wall with regular rectangular crenellations and vertical buttress strips/pilaster panels; stylised geometric glyphs on the signpost arrows; carved geometric chevron/T-shape blocks on a stone totem plinth.
- **Carvings & relief:** carved stone pedestal/totem column with blocky geometric relief panels (deep relief), holding a floating crystal; standing stones/menhirs; wall pilasters with recessed panels; distant castle keep with spires.
- **Edges & profiles:** square merlons; broken breach in the wall with jagged edge; arrow-shaped signboards with pointed ends.
- **Surfaces & materials:** warm sandstone wall, purple distant castle, glowing white crystal, teal shrubs, red banners.
- **Objects:** wooden crossroads signpost with three arrow boards and a red gem on top; floating crystal shard above a totem pedestal (glowing, mint-white); red hanging banners on the wall (torn swallowtail); rubble; menhir stones; candle/torch staff stuck in the ground; white doves (figures) on path; teal glowing bushes; blossom petals on ground; gnarled tree.
- **Lighting/FX details:** sunset glow behind castle, light rays through the breach, dust smoke, rose-petal drift.
- **Build components:**
  - Crossroads signpost with glyph arrows and gem finial — Blender mesh + emissive decal glyphs — path junctions on ring walkways / Glowwood
  - Floating crystal over carved totem pedestal — mesh + emissive/refractive shader + bob/rotate — waypoint shrines
  - Torn swallowtail wall banner — cloth/vertex-wind shader — castle walls
  - Breach rubble kit — Blender mesh — ruined outer wall

### U202
- **Patterns:** carpet of pink/magenta wildflowers; conifer rows; layered clouds. Little architecture.
- **Carvings & relief:** none.
- **Edges & profiles:** jagged mountain peak silhouette; soft cumulus edges.
- **Surfaces & materials:** smooth birch-like pale trunks; painterly grass; snow on peak.
- **Objects:** figure seated in meadow (do not build); tall pale-barked trees; fir/spruce trees; distant valley with lake; mountain; flower meadow.
- **Lighting/FX details:** bright day, floating petals, soft aerial perspective haze.
- **Build components:**
  - Pink wildflower carpet — instanced cards/grass shader — meadows beneath castle
  - Pale-bark tall tree — Blender mesh — Glowwood edge (night variant with glow moss)
  - Distant mountain backdrop — skybox/backdrop card — horizon

### U203
- **Patterns:** thatched straw roofs (bundled thatch texture); clumped meadow grass with small white and red flowers.
- **Carvings & relief:** none.
- **Edges & profiles:** shaggy thatch eave edges; karst tower-peak silhouettes.
- **Surfaces & materials:** grass, granite boulders, thatch.
- **Objects:** thatched huts; round-canopy trees; boulders; poppies; daisies; karst mountains.
- **Lighting/FX details:** bright sun, deep blue sky with big cumulus.
- **Build components:**
  - Thatched-roof hut — Blender mesh + thatch normal map — farm hamlet
  - Rounded granite boulder — Blender mesh — meadows
  - Wind-swaying meadow grass — vertex shader — open fields

### U204
- **Patterns:** none significant; water lily pads, flower clusters.
- **Carvings & relief:** hooded/veiled statue of a figure (face hidden in hood — matches our faceless rule) with hands resting on a downward sword hilt, and a gold-trimmed mantle band across the shoulders (fully 3D statue, purple-grey stone with gold collar).
- **Edges & profiles:** soft cloak folds; deep hood shadow.
- **Surfaces & materials:** violet stone, gold trim; still pond water.
- **Objects:** hooded guardian statue; pond with red petal/leaf floats; tall trees; white flower patches; floating red leaves/petals; rocks.
- **Lighting/FX details:** pink sunset sky, drifting red leaves, soft light from left.
- **Build components:**
  - Hooded guardian statue with sword (faceless) — Blender sculpt — Glowwood clearing / castle gate flank
  - Gold-trim collar band on stone — gold shader mask — statue accents
  - Drifting oversized red leaves — particles — Glowwood clearing
  - Reflecting pond with petal floats — water shader + cards — garden

### U205
- **Patterns:** half-timbering with diagonal braces; terracotta plain-tile roofs; rubble stone ground floors; distant red roof clusters.
- **Carvings & relief:** none fine; hilltop castle with square keep, round corner towers with conical red roofs, slit windows, attached halls.
- **Edges & profiles:** conical turret roofs; steep gables; rubble stone plinths.
- **Surfaces & materials:** limestone render, dark timber, red tiles, rubble masonry.
- **Objects:** hilltop castle on crag; cottages with chimneys; round watchtower with conical roof; wooden fence posts; stone stepping-path; mountain range; village; sheep (animals—background only); blue flowers; winding road; mist at valley.
- **Lighting/FX details:** clear day, valley mist.
- **Build components:**
  - Conical-roof round tower — Blender mesh — castle corner towers
  - Hilltop switchback road — terrain spline — castle approach
  - Stepping-stone path — Blender mesh scatter — gardens
  - Valley mist layer — fog shader card — around castle base

### U206
- **Patterns:** half-timbering; cobble path stones; terracotta roof tiles; board planks.
- **Carvings & relief:** carved wooden shop sign on brackets; curved wooden arched footbridge with railing posts; cartwheel; round oculus window in gable (small rose); stepped stone stairs with balustrade.
- **Edges & profiles:** strongly jettied, top-heavy upper storeys; flared gable bargeboards; arched bridge curve.
- **Surfaces & materials:** white render, warm brown timber, grey fieldstone, red tiles.
- **Objects:** timber houses; humped wooden footbridge over stream; barrels; haycart; wagon wheel; flower boxes; pumpkins; market stall with red-white striped awning; balcony; potted flowers; distant arched bridge.
- **Lighting/FX details:** soft daylight haze.
- **Build components:**
  - Humped wooden footbridge with railings — Blender mesh — Glowwood streams
  - Top-heavy jettied townhouse — Blender mesh — town
  - Gable oculus window — Blender mesh — gables
  - Striped market stall — Blender mesh — plaza

### U207
- **Patterns:** half-timbering (vertical studs, cross-bracing); stepped stone paving path (crazy paving stepping stones); flower-box rows; picket fence.
- **Carvings & relief:** windmill tower atop a timber tower-house (sails); carved window frames; curved bracket supports.
- **Edges & profiles:** steep pointed gables with flared eaves; tall narrow tower silhouette.
- **Surfaces & materials:** orange-red tiles, cream render, dark timber.
- **Objects:** hot-air balloons (striped, multicolour); windmill tower; timber houses; chimneys with smoke; flower boxes (pink geraniums); wooden fences; winding path with flagstones; conifer hills.
- **Lighting/FX details:** sunbeam glare top-left, warm light.
- **Build components:**
  - Striped hot-air balloon / sky lantern — Blender mesh — sky dressing above castle
  - Windmill tower-house — Blender mesh + rotating sail animation — hill
  - Flower window box — Blender mesh + flower instances — house windows
  - Flagstone path ribbon — mesh decal — meadows

### U208
- **Patterns:** fish-scale/scalloped roof tiles on domed tower (left, orange); blue slate roofs; half-timbering; crazy-paving path; tiered pagoda-like cap roofs on the forge.
- **Carvings & relief:** distant pale cyan/white palace with many needle spires, triple pointed dormer gables, lantern cupola with finial (French château/fairy style); domed round tower with bunting swag and onion-shaped roof; ship's-wheel ornament on house; gilded crown-like ornament on forge roof (fully 3D).
- **Edges & profiles:** needle spires with ball finials; gabled dormers with white trim; flared tiled caps.
- **Surfaces & materials:** pastel blue/white palace with frosted glassy sheen; warm timber; copper/steel pipes; orange tiles.
- **Objects:** fairy palace; blacksmith forge with chimney pipes, anvil, crates; barrel-shaped tavern building with giant barrel; awning; chests; windmill; hanging sign on crane arm; flags; stone stairs; meadow path.
- **Lighting/FX details:** bright daylight, soft blue haze on the palace (aerial perspective).
- **Build components:**
  - Needle spire cluster with ball finials — Blender mesh — castle skyline
  - Triple pointed dormer gable — Blender mesh — palace roofline
  - Scalloped fish-scale dome roof — Blender mesh + normal map — round towers
  - Giant barrel tavern — Blender mesh — market/fun zone

### U209
- **Patterns:** stylised rubble/ashlar stone with rounded chunky blocks; terracotta pantile cone roofs; slate shingle; thatch (yellow straw fur); carved swirl relief on gable boards; brick steps; dripping moss/slime curtains.
- **Carvings & relief:** arched plank door with heavy iron strap hinges and ring knocker set in a voussoir stone arch (medium relief); glowing green rune circle with radiating spokes inscribed over a culvert arch (emissive line art); heraldic shield sign with glyph; castle with round machicolated towers and conical caps; pointed Gothic window in curtain wall; carved spiral scroll on bargeboards (shallow relief).
- **Edges & profiles:** crenellated round towers with corbel rings; swallowtail banners; chunky bevelled stone edges with bright rim highlights; rounded rope.
- **Surfaces & materials:** blue-grey stone, warm wood, green emissive windows, glowing turquoise water, ochre thatch.
- **Objects:** castle on top; stacked fantasy houses; windmill; banners (lilac, white, swallowtail); hanging shield sign; wooden flower tubs/barrels with flowering shrubs; rope coil and pulley hook; round porthole window; wall lantern (green glow); bucket; crate; vines/beanstalk; bees (creatures, ignore); small arched bridge over stream; waterfall; skywriting ring cloud.
- **Lighting/FX details:** glowing green windows and runes, luminous cyan water, crisp daylight.
- **Build components:**
  - Glowing rune circle on stone arch — emissive decal — moat culverts, castle portal arch
  - Iron-strap arched door with ring knocker — Blender mesh — castle side doors
  - Wooden flower tub with blooms — Blender mesh — walkways
  - Dripping moss curtain — alpha cards — wall tops in Glowwood
  - Swallowtail banner with notched tail — cloth/mesh — towers
  - Round machicolated tower top — Blender mesh — castle towers

### U210
- **Patterns:** fish-scale / scalloped wooden shingle roofs in slate blue and teal, each tile bulged; half-timbering with curved braces; circular radiating cobble paving (fan/segmental arcs) in plaza; rectangular cut-stone walkway with blue edging; dry-stone rubble infill under a timber frame; spiral rosette engraved on every beam end cap.
- **Carvings & relief:** square end-blocks on beam ends with carved spiral/whorl rosettes (shallow-medium relief, catch light); large curved timber brace arches (cruck-like) framing the gables; pointed lancet windows with timber tracery mullions (3–4 lights) glowing amber; dormers with ogee-swept gables; iron finial-topped chimney cowls (witch-hat chimneys with banded pipes); bird nest on roof peak.
- **Edges & profiles:** extremely swept, flared, warped rooflines (WoW-style); gables with crossed bargeboards extending past peak; jettied storeys on heavy brackets; blue-painted iron bands and corner brackets on posts and crates.
- **Surfaces & materials:** strongly grained hand-painted timber (purple-brown), cream lime plaster, blue-grey stone; dark iron with blue tint; amber emissive windows.
- **Objects:** hanging iron lantern on a bracket arm with chain (four-sided glass lantern); barrels with blue hoops; crates; crane/gallows beam with hook and rope at roof; stovepipe chimneys with smoke; orange mushrooms; tall grass tufts; spiked fence posts; chains; stone cones/spikes with iron caps; plank deck.
- **Lighting/FX details:** blue dusk with warm interior window glow, lantern glow, chimney smoke wisps, rim light on shingle bumps.
- **Build components:**
  - Bulged fish-scale wooden shingle roof — Blender mesh (instanced tiles) or normal map — Glowwood houses, castle outbuildings
  - Spiral-rosette beam end cap — Blender mesh + normal map — all timber framing ends
  - Hanging iron lantern on bracket arm with chain — Blender mesh + emissive — walkways, bridges
  - Radiating fan cobble paving — tiling texture/decal with normal map — plaza around fountain
  - Timber-traceried lancet window glowing amber — mesh + emissive — houses, chapel
  - Witch-hat chimney cowl with smoke — Blender mesh + particles — rooftops

### U211
- **Patterns:** strings of red diamond/rhombus lantern-lights across tower walls; scalloped teal fabric awnings; green-teal glazed tile roof under snow; gabled lattice frame stall.
- **Carvings & relief:** crescent-moon finial atop a stacked gold orb finial (bulb + ball + crescent, fully 3D); wooden posts topped with crescent hooks; square tower with hipped tiled roof, corbelled cornice band; arched glowing doorway with ogee-ish top.
- **Edges & profiles:** soft rounded snow caps on every edge; flared eaves; drooping garland catenaries.
- **Surfaces & materials:** blue-grey plaster, teal glazed tile, gold metal finials, red glass lanterns, pink fabric, snow.
- **Objects:** snowy hilltop lantern tower/shop; red hanging lanterns (teardrop and rhombus); fabric bunting and draped tent awnings; wreath decorations; wooden stall frame; pine trees with snow; distant white palace on a cliff; full moon; rope lines.
- **Lighting/FX details:** lavender winter dusk, warm red-orange lantern glow on snow, pink clouds, moon halo.
- **Build components:**
  - Crescent-and-orb gold finial — Blender mesh + gold shader — castle spire tops, lamp posts
  - Rhombus red glass lantern garland — instanced mesh along curve + emissive — festival strings on walkways
  - Snow-capped edge geometry — shader (top-facing mask) — winter variant
  - Draped tent awning between posts — cloth mesh — market stalls

### U212
- **Patterns:** dense half-timbering with diagonal braces on tall narrow townhouses; dormers in rows; plank decking; lattice wooden scaffold tower; slate shingle roofs.
- **Carvings & relief:** carved shop sign board ("Fyrestone"-like lettering) across fascia; gabled dormers; stone ground-floor arcades; giant crystal/glass spire in background (faceted).
- **Edges & profiles:** steep pointed gables; jettied storeys; ragged cliff edges; cable lines.
- **Surfaces & materials:** dark timber, cream plaster, grey stone, glowing glassy blue crystal spire, rusted metal.
- **Objects:** dirigible/blimp moored to a bare tree; gnarled leafless tree with nest; timber watch scaffold; waterfall pouring into a chasm; zip-line cables; winch wheel; wooden fences; boardwalk; lantern-lit doorway; flying ships (silhouettes); distant tower.
- **Lighting/FX details:** dusk purple-magenta sky; cold cyan glow rising from the chasm (volumetric fog); warm amber windows; waterfall mist.
- **Build components:**
  - Glowing chasm fog — volumetric/fog card shader (cyan) — moat gorge beneath castle bridges
  - Moored airship with balloon envelope — Blender mesh — sky dock at castle
  - Bare gnarled tree with nest — Blender mesh — Glowwood edge / spooky corner
  - Cable zip-line with winch wheel — mesh + curve — cliff crossings
  - Tall timber townhouse row — Blender modular kit — town

### U213
- **Patterns:** cracked flagstone plaza with glowing light lines in the cracks (irregular Voronoi-like plates); swallowtail pennant; bunting triangles; witch-hat spires everywhere.
- **Carvings & relief:** neon-like glowing rune door frames — a cyan trapezoid "portal" outline, a magenta crackling arch portal, violet glyph signs, green glyph shop sign; curled-horn roof finials; gabled dormers with round-top lit windows; towers with pointed conical spires and bracketed balconies.
- **Edges & profiles:** witch-hat conical roofs with slight concave flare; crooked leaning towers; round-arched gate passage.
- **Surfaces & materials:** desaturated stone and timber, emissive cyan/magenta/green runes, warm windows, red fabric awnings, orange autumn leaves on ground.
- **Objects:** glowing portal archways; market stall with red canopy and bunting; wooden barrels; cart/cannon-like wooden contraption; hanging shop signs (glowing anvil/hammer symbol); autumn tree (orange-gold); leaf litter; gate arch.
- **Lighting/FX details:** dreamy pink-lavender haze/fog, glowing emissive outline portals, floating firefly sparkles, crackling energy on the arch.
- **Build components:**
  - Glowing outline portal arch (cyan/magenta energy edge) — emissive tube mesh + animated noise shader — magic gates, ring walkway portals
  - Cracked plaza flagstones with glowing seams — Voronoi crackle shader + emissive mask — castle courtyard
  - Glowing glyph hanging shop sign — mesh + emissive decal — market lane
  - Witch-hat flared conical spire — Blender mesh — towers skyline
  - Firefly sparkle particles — particles — courtyard/Glowwood

### U214
- **Patterns:** terracotta barrel-tile roofs (Mediterranean); rope-wound columns (coiled rope texture); arcade of round-arch window openings on ruined brick hall; hydrangea clusters; graffiti (off-theme).
- **Carvings & relief:** classical round-arched brick arcade ruin (deep relief); wall-mounted wrought-iron scroll bracket lantern with bell-shaped glass shade; stair with chunky stone cheek walls.
- **Edges & profiles:** rounded stair noses with embedded glowing strips; pergola beam lashed with rope; tile roof edges with mortar.
- **Surfaces & materials:** sisal/jute rope wrap, rough stucco, worn stone steps, glowing yellow-green LED strips (off-theme but adaptable as magic glow), neon tubes (off-theme).
- **Objects:** rope-wrapped pergola pillars with hanging rope ball floats/lanterns; café umbrellas; round tables and bistro chairs; bracket wall lantern; blue hydrangea bushes; stone staircase; vending machine (off-theme); pipes (off-theme); neon signs (off-theme); distant hill town.
- **Lighting/FX details:** dusk lilac sky; warm orange lantern glow; green-yellow emissive step strips; birds silhouette.
- **Build components:**
  - Glowing step-edge inlay strip — emissive inset mesh/decal — castle stairs, ring walkway steps (use soft gold instead of lime)
  - Rope-wrapped pergola post with hanging rope-ball lanterns — Blender mesh + rope normal map — garden pergola / dock
  - Bell-shade scroll-bracket wall lantern — Blender mesh + emissive — town walls
  - Blue hydrangea bush — foliage mesh — stair borders, garden beds
  - Barrel-tile roof — normal map/instanced — town roofs

### U215
- **Patterns:** hexagonal floor tile grid with glowing seams on the terrace; vertical window grids on towers; chevron/diagonal bracing lines on skyscraper.
- **Carvings & relief:** none (modern cyberpunk, off-theme).
- **Edges & profiles:** slim glass/metal railing with angled posts; cantilevered balcony edge.
- **Surfaces & materials:** glossy dark floor, neon tubes (pink/cyan), glass.
- **Objects:** balcony terrace railing; neon signage; potted tropical leaves; figures (ignore).
- **Lighting/FX details:** heavy violet/blue neon glow, haze, reflections.
- **Usable details only:** hex-tile floor with glowing grout lines; violet atmospheric haze for night depth.
- **Build components:**
  - Hex-tile floor with glowing seams — shader (hex grid + emissive mask) — observatory/star terrace
  - Violet night haze — fog shader — global night atmosphere
  - Slim balcony railing — Blender mesh — upper castle balconies (with gothic finials added)

### U216
- **Patterns:** vertical banner signs, stacked shopfronts with awning bands; rain streaks; pixel-art reflections. (Off-theme modern city, pixel art.)
- **Carvings & relief:** none.
- **Edges & profiles:** shop awnings with flat fascia; vanishing-point row of lamp posts.
- **Surfaces & materials:** wet reflective asphalt mirror, glowing signs.
- **Objects:** rows of round globe street lamps (warm orange) receding into distance; umbrellas; hanging vertical signs; planters; figures (ignore).
- **Lighting/FX details:** rain, wet ground reflections of every light, purple-orange sunset.
- **Usable details only:** receding row of warm globe lamps reflected in wet paving.
- **Build components:**
  - Globe-top lamp post (repeating row) — Blender mesh + emissive — bridge approach / ring walkways
  - Wet-paving reflection shader — shader (roughness puddle mask + SSR/env) — courtyard after rain
  - Rain streak particles — particles — weather option

### U217
- **Patterns:** pixel-art city (off-theme): corrugated metal panel stripes, tiled shop walls in square grid, chequered pavement, drain grates.
- **Carvings & relief:** none.
- **Edges & profiles:** flat box signage, railing tubes.
- **Surfaces & materials:** glossy tiles, neon, metal.
- **Objects:** vending machines, A-frame sandwich board sign, traffic cones, bollards, lamp globes, overpass, signs, potted plant, small shelf stall. (Off-theme.)
- **Lighting/FX details:** night neon palette (red, magenta, blue).
- **Usable details only:** A-frame sandwich board (as a magic menu board), square glazed wall tile grid.
- **Build components:**
  - A-frame chalk/menu board — Blender mesh + decal — market stalls / café on walkway
  - Glazed square tile wall — tiling texture — kitchen / bathhouse
  - Globe lamp on post — Blender mesh + emissive — street lighting

### U218
- **Patterns:** curved pagoda roofline with upturned eave tips; repeating circular porthole windows and vertical slot windows glowing mint green; stacked red paper lanterns (strings).
- **Carvings & relief:** pagoda roof with ridge finial (pointed spire with ring); upturned corner hooks; vertical shop sign boards (off-theme script).
- **Edges & profiles:** concave sweeping roof with neon rim line along eave; flying-eave hooks.
- **Surfaces & materials:** dark metal/stone, neon cyan and pink tubes, red lantern paper.
- **Objects:** cyberpunk pagoda tower; red round paper lanterns hung in vertical strings of three; hover vehicles; cables; giant neon sign (off-theme); rail viaduct.
- **Lighting/FX details:** mint and cyan glows, pink neon, rain haze.
- **Usable details only:** pagoda eave with glowing rim line; vertical strings of round red lanterns; mint porthole windows.
- **Build components:**
  - Vertical string of round paper lanterns — instanced mesh + emissive — lantern festival walkway, tea pavilion
  - Glowing roof-rim line along curved eaves — emissive tube along edge — pavilions at night
  - Round porthole window cluster with mint glow — mesh + emissive — wizard tower

### U219
- **Patterns:** fish-scale slate-blue shingle roofs; radial fan/arc cobble paving in plaza (concentric segmental arcs); rubble-stone podium walls; half-timbering with curved braces.
- **Carvings & relief:** grand twin staircases with heavy blue-painted stone cheek walls/balustrades, ending in drum-shaped newel posts topped by stone cones/onion-shaped finial caps (fully 3D); central altar/plinth with glowing candles and a stone cross/gallows-like timber tower (lamp mast); tall white obelisk-lamps (slender shafts with lantern tops); gabled buildings with glowing lancet windows and lit gable peaks; carved bargeboards.
- **Edges & profiles:** swept witch-hat roofs, flared bargeboards, sloping balustrades with copings, conical finials.
- **Surfaces & materials:** dark stained wood, slate-blue stone, warm emissive glass, cobbles with soft reflection.
- **Objects:** twin stairs; newel drums with cone finials; crates; barrels; potted bushes; lamp obelisks; timber crane; candles; snow/ice-blue bags or tarps; wooden walls.
- **Lighting/FX details:** dusk violet sky, warm amber windows and candles, glowing gable peaks, sparkles.
- **Build components:**
  - Twin grand staircase with drum newels and cone finials — Blender mesh — castle main entrance stair / ballroom stair
  - Slender white obelisk lamp — Blender mesh + emissive top — plaza, bridge approach
  - Radial fan cobble plaza — tiling texture + normal map — castle forecourt
  - Lit gable peak window — mesh + emissive — town roofs

### U220
- **Patterns:** Norse/Celtic knotwork interlace bands (carved and lightly glowing blue) along the bargeboards of the longhouse; acanthus-like Urnes-style scroll carvings on the door frame panels; round shield boss with segmented rings; thatched roof bundles; rope lashings.
- **Carvings & relief:** carved dragon-headed gable finial (crossed bargeboards ending in a beast head — swap to a stylised scroll/fern head with no eyes for us) (fully 3D); Celtic knot bargeboard bands (shallow relief with blue paint/glow); interlaced scrollwork door panels (deep relief); round decorated shield on the facade; carved posts with rope rings; carved longship prow and stern scrolls.
- **Edges & profiles:** A-frame steep thatched roof; crossed gable boards; snow caps on rocks and trees.
- **Surfaces & materials:** dark wood with glowing indigo/blue inlay in knotwork, thatch, snow, ice-blue water, warm fire.
- **Objects:** longhouse; fire brazier (iron basket on post); wooden mooring posts with rope; plank dock; longship with torn glowing sail and pennant flag, shields along gunwale; snowy fir trees; waterfall; boulders; frost-dried shrubs; oars leaning on wall; aurora borealis.
- **Lighting/FX details:** green aurora ribbon in sky, warm fire glow from brazier and lit sail, ice-blue luminous water, snowflakes, stars.
- **Build components:**
  - Celtic knotwork carved band with blue glow inlay — normal map + emissive mask — castle gate frames, bridge beams, Glowwood lodges
  - Interlaced scroll door panel — Blender sculpt/normal map — castle doors
  - Iron basket brazier on post — Blender mesh + fire particle — docks, gate approach
  - Aurora ribbon — animated shader on sky ribbon mesh — night skydome
  - Glowing-sail boat — Blender mesh + emissive translucent sail — moat boats
  - Rope-wrapped mooring post — Blender mesh — docks

### U221
- **Patterns:** arcade of pointed/horseshoe arches in ruined walls; ribbed onion-dome surface (faint vertical ribs); balcony rings with railing.
- **Carvings & relief:** onion dome with pointed finial; minaret-like tower with balcony gallery and small cupola; spiral external stair wrapping the tower; Gothic tracery window (bar tracery with circle) below dome; blind arcading on drum; timber trestle scaffold.
- **Edges & profiles:** onion-dome silhouette; pointed horseshoe arches; corbelled balconies.
- **Surfaces & materials:** rose-red sandstone, weathered; pale glints on dome.
- **Objects:** desert palace with domes; minaret; spiral stair; ruined arches; stream; canyon walls; white birds (ignore); figure on camel (ignore); timber scaffold; rocks.
- **Lighting/FX details:** pink-lavender sunset, purple shadows, misty light shafts.
- **Build components:**
  - Onion dome with finial and drum arcade — Blender mesh (lathe) — castle side towers
  - External spiral stair around tower — Blender mesh (screw) — wizard tower
  - Ruined pointed-arch arcade — Blender mesh — outer ruins
  - Minaret balcony ring — Blender mesh — tall towers

### U222
- **Patterns:** steep dark shingle cone/tent roofs (huge pointed hipped roofs); dormer rows; half-timbering; rail fences.
- **Carvings & relief:** windmill sails on top of a huge pyramidal roof; small turrets with conical caps; lattice wooden watch scaffold.
- **Edges & profiles:** extremely tall tent-shaped roofs with flared base; white dormer gables.
- **Surfaces & materials:** dark slate, cream walls, red trim, grassy hill, giant stone arch rock formation.
- **Objects:** giant natural rock arch; big-roof manor with windmill; turret huts; wooden scaffold tower; fences; sheep (ignore); boulders; trees; path.
- **Lighting/FX details:** bright day with blue haze.
- **Build components:**
  - Giant natural rock arch — Blender mesh — landscape near Glowwood
  - Tall tent roof with flared eaves and dormers — Blender mesh — manor house
  - Wooden lattice watch scaffold — Blender mesh — lookouts

### U223
- **Patterns:** terracotta plain-tile roofs; small V/W truss (zigzag king-post lattice) running along the ridge gallery; half-timbering; exposed brick under broken plaster; Y-tracery (bifurcated mullion) in arched gable windows; bunting triangles (light blue/white); triangular triforce-like emblem painted on wall (avoid exact copy, use a 3-triangle tri-mark of our own).
- **Carvings & relief:** big sweeping curved bargeboards that cross at the apex and continue up as a pointed spike finial; winged/horned scrolled timber ornament flanking the central gable (two antler/wing-like carved arms curling outward — fully 3D, ~30 cm thick); arched gable windows with timber Y-tracery; ogee/onion-pointed gable hood over side entrance with small diamond finial; carved wooden sign board with runic letters on porch beam; porch posts with curved braces; weathervane/rotor finial on rooftop lantern; stone quoins at corners.
- **Edges & profiles:** strongly convex, swollen roof curves (bowed roof slopes); deep gable overhangs; rounded fat timber edges catching sun; pointed gothic arch window heads; stone plinth courses.
- **Surfaces & materials:** warm honey wood with painted grain, white lime plaster, red brick, orange tiles, grey stone blocks; pale blue cloth banners with white emblem.
- **Objects:** long vertical heraldic banners (pale blue, emblem of moon/wings); triangle bunting strings; ivy and climbing vines; window flower boxes; shutters; wooden fence; wooden signpost with arrow board; crates/boxes; small lanterns on posts; boulders; grass; white daisies; chimney.
- **Lighting/FX details:** warm sun, cool foliage shadows; strong rim on rounded timber.
- **Build components:**
  - Winged scroll gable ornament with crossed bargeboards and spike finial — Blender mesh — castle outbuildings, Glowwood lodge, ring walkway kiosks
  - Pointed arched gable window with Y-tracery — Blender mesh — houses, chapel
  - Long vertical heraldic banner with crescent emblem — cloth mesh + decal — castle facade, ballroom
  - Ridge zigzag truss gallery — Blender mesh — roof ridges
  - Ivy climber clusters — alpha foliage cards — walls
  - Runic carved porch sign — mesh + decal — shop entrances

### U224
- **Patterns:** blue fish-scale/scalloped slate shingles in very fine scale across huge sweeping roofs; triangular gable trusses with king-post and struts (timber sunburst-like gable infill); half-timbering.
- **Carvings & relief:** layered tower-mansion with stacked conical/witch-hat roofs, gable dormers with decorative truss infill, wooden balconies, moss/grass growing on roof ridges; covered wooden footbridge; waterwheel.
- **Edges & profiles:** stacked overlapping roof skirts, swept eaves, pointed turret caps.
- **Surfaces & materials:** deep cobalt slate, warm timber, cream plaster, green moss tufts.
- **Objects:** giant multi-storey tower house; covered wagon; arched wooden bridge over stream; fences; signpost; lamp posts; butterflies (yellow, ignore as creatures or keep as particles); boulders; pine and round trees; distant mountains; chimney; banners/flags.
- **Lighting/FX details:** bright daylight, valley mist/haze on right.
- **Build components:**
  - Stacked roof-skirt wizard tower house — Blender mesh — wizard tower / town landmark
  - Decorative gable truss infill (king-post with radiating struts) — Blender mesh — gables everywhere
  - Moss-tuft roof ridge — mesh scatter/decal — old roofs in Glowwood
  - Covered wagon — Blender mesh — market road
  - Fine blue fish-scale slate — normal map + tiling texture — castle roofs

### U225
- **Patterns:** coursed rubble stone on round towers; ivy drapery; arched aqueduct-like bridge.
- **Carvings & relief:** twin round towers with red conical roofs and small spike finials; a single-span arched stone bridge linking towers, covered in hanging ivy.
- **Edges & profiles:** conical roof with flared eaves; corbelled ring below roof; round-arch bridge.
- **Surfaces & materials:** grey stone, mossy, red tile cones.
- **Objects:** twin towers; arched skybridge; waterfall/river below; bushy trees; grass slope; mountains; red horn-like object in foreground (unclear, prop).
- **Lighting/FX details:** bright sun, valley mist.
- **Build components:**
  - Ivy-draped arched skybridge between towers — Blender mesh + alpha ivy cards — castle tower links
  - Round tower with red conical cap and corbel ring — Blender mesh — castle corner towers
  - Hanging ivy curtain — alpha cards — bridge undersides

### U226
- **Patterns:** reticulated / Voronoi-crackle net pattern on the red mushroom caps (cream veins over red, like a brain-coral net — very distinctive); fish-scale slate on the tower's conical roofs; coursed ashlar banding on the tower drum; crozier spirals (unfurling fern fiddleheads) repeated across the giant ferns; scattered daisy-like white flower carpets along the path.
- **Carvings & relief:** tower top storey has a projecting corbelled gallery band (row of small corbels under a parapet = mock machicolation), small dormer with pointed hood on the conical roof, spire finial; the tower shaft flares out like a tree root/ rock plinth (organic, carved-looking buttress roots) — deep relief/fully 3D. Hilltop building at far left: small cupola/lantern belfry with arched openings and balustraded terrace.
- **Edges & profiles:** conical "witch-hat" roofs with slight bellcast flare at eaves; bartizan (hanging corner turret) with inverted-cone corbel base; string courses ringing the drum; rounded arches on the left building's arcade; path edge soft, grass overhanging.
- **Surfaces & materials:** salmon/terracotta render and cream limestone on tower; dark slate roof; packed earth path with light-catching pebbles; tree bark heavily fissured; mushroom caps semi-glossy with subsurface red glow where sun hits.
- **Objects:** slender storybook tower on rock pinnacle; giant fly-agaric-style mushrooms (tall stalked, multiple sizes, clustered); giant ferns with fiddleheads; tree stumps (broken, hollow); bougainvillea-like purple flowering tree; broad canopy umbrella pines; dirt footpath; flower meadow; distant lake, snowy mountains; white moths/butterflies (decorative); far-left manor with cupola and arcade; drifting leaves.
- **Lighting/FX details:** large full rainbow arc (soft, translucent), god-ray haze on the left behind trees, warm rim light on fern edges, floating leaf/petal particles, atmospheric blue haze on distance.
- **Build components:**
  - Reticulated Glow-Mushroom — Blender mesh + Voronoi-vein emissive shader (veins glow cyan/gold at night) — Glowwood floor & path edges
  - Fiddlehead Fern — Blender mesh (curl via curve modifier), alpha-card fronds — Glowwood undergrowth, garden borders
  - Bartizan with inverted-cone corbel — Blender mesh — castle wall corners, ring-wall towers
  - Corbelled gallery band (mock machicolation) — Blender mesh strip, array modifier — tower tops
  - Root-flared tower plinth — sculpted mesh + rock normal map — towers rising from cliffs/islands
  - Rainbow / aurora arc — additive shader on large curved plane — sky (night version: moonbow)

### U227
- **Patterns:** fish-scale slate on two conical roofs; cornice of small dentils under eaves; blind arcade of small round-headed arches ringing the gallery (arcaded corbel table); coursed stone base; harlequin/diamond chequer on a figure's tunic (usable as a banner pattern: red/white lozenge chequer).
- **Carvings & relief:** projecting circular gallery supported by a corbel table of tiny arches with pendant corbels (Romanesque arched corbel table) — shallow-medium relief; pendant bartizan ending in an inverted cone drop finial; gabled dormer with small window and pointed hood; spire finial ball + spike; wooden scaffold/lift platform clinging to the shaft; stair spiralling around the rock base.
- **Edges & profiles:** bellcast conical roofs, crisp drip/cornice mouldings between storeys, roll moulding at the gallery base; balcony with simple railing at left; dry-stone wall edging along foreground terrace.
- **Surfaces & materials:** orange-terracotta render with cream stone bands; weathered limestone tower shaft with buttressing flutes; dark slate; dry-stone wall in honey limestone; tree stump top with growth rings.
- **Objects:** storybook tower (Rapunzel-like) on rock; wooden scaffold platforms with ladder; spiral stair around pinnacle; arched stone footbridge (mid-ground left); red giant mushrooms (clustered tall), giant red mushroom dome; large tree stump (viewing platform); flowering magenta shrubs; umbrella pines; distant village with clock-tower/bell-gable house; craggy limestone mountains; lake; figures (3).
- **Lighting/FX details:** rainbow beam landing on ground (vertical, glowing at its foot), sun bloom, saturated sky, rim light on foliage.
- **Build components:**
  - Arched corbel table gallery ring — Blender mesh (array around cylinder) — ring-tower crowns
  - Pendant bartizan with drop finial — Blender mesh — tower sides, gate towers
  - Spiral pinnacle stair — Blender mesh (screw modifier) — floating-island towers
  - Dry-stone terrace wall — Blender mesh kit + normal map — garden terraces, path borders
  - Lozenge-chequer banner fabric — texture/decal — banners on ring walkways
  - Rainbow "foot" light pillar — additive shader + particles — wishing spot / portal

### U228
- **Patterns:** stylised cobble outline pattern stamped into the dirt path (rounded flagstone outlines, decal-like); clumped grass blades; layered leaf clusters (stylised toon foliage) on trees.
- **Carvings & relief:** windmill towers with stacked octagonal storeys, wooden galleries/balconies ringing each storey; pagoda-like flared roof with red trim on the near windmill — medium relief wood framing.
- **Edges & profiles:** flared pagoda eaves with upturned corners; cliff faces with faceted, chamfered rock planes; mossy top edges on boulders.
- **Surfaces & materials:** hand-painted stylised textures: sandy path, grey faceted rock with green moss caps, plank timber, red-painted eave trims, white windmill sails.
- **Objects:** windmills (4+) on cliff tops and on hill; wooden village houses; twin waterfalls from cliff; rope/zipline bridges (white curving lines) spanning cliffs; maple-like orange trees; round green broadleaf trees; boulders; meadow with white flowers and yellow wildflowers; pond.
- **Lighting/FX details:** bright daylight, soft blue atmospheric perspective, waterfall mist white streaks.
- **Build components:**
  - Mossy faceted boulder set — Blender mesh + moss-top shader (world-normal blend) — Glowwood, cliff edges
  - Stamped flagstone path decal — decal/projected texture on terrain — garden paths
  - Octagonal tower with wrap gallery — Blender mesh — lookout towers on outer ring
  - Rope zipline/bridge — curve mesh — between floating islands
  - Autumn maple tree (glowing variant) — mesh + leaf cards with emissive tips — Glowwood accents

### U229
- **Patterns:** stained-glass leaded panes with lozenge/ vesica (pointed-oval) motifs in lilac/amber/teal on the bay window; shingle roof of irregular rounded tiles (wavy shingles) in magenta; half-timber framing grid; rounded fieldstone base course; stepping-stone path; small rose window (round porthole) under gable.
- **Carvings & relief:** carved arched front door with a star/sun medallion above (gilded rosette); twisted iron bracket holding hanging shop sign; deep timber posts with chamfered edges; porch railings of rough-hewn balusters; chimney pots.
- **Edges & profiles:** strongly curved, sagging (bowed) roof ridges with overhanging eaves — storybook "melted" silhouette; turret bay window is a faceted octagonal-lantern shape that bulges outward (barrel-shaped), capped with its own magenta roof and a crown finial; brass/gold edge piping along every glazing bar of the bay.
- **Surfaces & materials:** stylised hand-painted wood (rich brown), cream plaster, glossy magenta shingles, brass-gold window frames, multicolour stained glass; small glowing green potion orb in sign.
- **Objects:** cottage with barrel bay window; hanging potion-shop sign (wooden plaque with glowing green flask, chained from a spearhead bracket); wall sconce lanterns flanking door (lilac glow); wooden stair + porch; split-rail fence; wooden hand cart with spoked wheel; climbing ivy; glowing runestone (blue glyph) in distance; floating island with castle in sky; cherry-blossom sapling; poppies; stepping stones; washing line pole.
- **Lighting/FX details:** lilac interior glow through door lanterns, green emissive orb in sign, chimney smoke wisp, blue glowing glyph on stone.
- **Build components:**
  - Barrel bay window (faceted stained-glass lantern bay) — Blender mesh + stained-glass emissive shader with gold leading — castle shops, tower bays
  - Hanging potion/shop sign with glowing orb — mesh + emissive — ring walkway shopfronts
  - Bowed storybook roof with wavy shingles — Blender mesh (lattice deform) + shingle normal map — village houses, gatehouse
  - Sun-medallion door hood — mesh/decal (gold) — doors throughout
  - Glowing runestone — mesh + emissive glyph decal — path waymarkers in Glowwood

### U230
- **Patterns:** half-timber grid (vertical studs + diagonal braces, St Andrew's cross panels); clay tile roof in rows; ivy/moss mats draped over roof ridges; radial fan of light-coloured paving in plaza.
- **Carvings & relief:** carved bargeboards on steep gables, jettied (overhanging) upper storeys supported by brackets, wooden balconies with plank balustrades, dormers — medium relief.
- **Edges & profiles:** steep gabled roofs, multiple cross-gables, tall brick chimneys; crisp eaves with moss overhang.
- **Surfaces & materials:** cream render, dark oak timber, terracotta tiles, grey granite boulders, polished paving.
- **Objects:** large Tudor inn; classic black iron lamp posts with lantern heads (4-sided lantern on post); red patio parasols; picnic tables/benches; wooden plank bench (foreground); terracotta pots and planters; pink tulip flower bed; window boxes; autumn red trees; grey granite boulders lining plaza; barrels.
- **Lighting/FX details:** clear daylight, soft lamp highlights only.
- **Build components:**
  - Jettied half-timber facade kit — Blender modular meshes — inner village ring
  - Moss-draped roof ridge — mesh cards/shell — older buildings, gatehouse
  - Black iron post lantern — mesh + emissive panes — plazas, ring walkways
  - Plaza parasol + table set — mesh — café terrace near ballroom
  - Granite boulder border — mesh — plaza edges

### U231
- **Patterns:** carved runic inscriptions (vertical rune columns) on standing stones; radial sun/compass-wheel carving (spoked circle, like a solar wheel/ vegvisir) on a large stone at left; shattered-plate ice pattern (polygonal cracks) on frozen lake; stacked stone slab steps.
- **Carvings & relief:** monolith slabs with incised rune lines glowing cyan; hourglass "X" rune on near post; carved headstones/ tablets on cliff at left; giant split monolith (two leaning halves forming a V) with energy column — fully 3D stones with shallow incised relief.
- **Edges & profiles:** chamfered, chunky low-poly stone edges with highlight bevels; jagged ice shards ringing the stones.
- **Surfaces & materials:** dark slate standing stones; translucent icy blue ice with frosted cracks; snow; leafless red-brown dead tree; snow-dusted pines.
- **Objects:** rune monoliths/menhirs (ring), split twin monolith, frozen lake, ice floes, rune tablets, carved wheel stone, dead twisted tree (bonsai-like), pines, round floor glow pads/discs, snowy cliffs.
- **Lighting/FX details:** green-teal aurora curtains with orange/pink fringes; vertical cyan light beam/lightning column shooting from split monolith; ground fog/mist; glowing cyan runes; stars; soft glow pools on ice.
- **Build components:**
  - Glowing rune monolith — Blender mesh + emissive incised-glyph normal/emissive map — Glowwood stone circle, path waymarks
  - Split twin monolith with sky beam — mesh + additive beam shader + particles — portal / central focal point
  - Cracked-ice floor — shader (Voronoi crack + fresnel) — frozen moat or reflecting pool
  - Aurora curtain sky — animated shader on sky dome — night sky
  - Solar-wheel carved boulder — mesh + normal map — gate-side markers

### U232
- **Patterns:** Celtic interlace knotwork (Norse/Urnes style) carved along the bargeboards/roof ridge boards; tight scroll/ribbon interlace on door panels (Ringerike-style carving); thatch bundles; plank decking; shield boss with quatrefoil/cross segmentation (round shield divided into 4 with circular boss and spiral rivets).
- **Carvings & relief:** dragon-head gable finial (carved, stylised — treat as abstract scroll beast/foliate head without eyes for our game) — fully 3D; deep relief interlace scrollwork on the door surround panels; carved shields; oars stacked against wall; longship prow with curled scroll stem.
- **Edges & profiles:** A-frame steep gable with crossed bargeboards extending past ridge (forming X at top); rope-lashed posts; rounded worn plank edges catching warm light.
- **Surfaces & materials:** dark weathered wood (blue-grey in moonlight), warm brown where firelit; straw thatch; iron-banded shield with blue enamel; snow caps; turquoise translucent water with foam patches.
- **Objects:** Norse longhouse; dragon finial; round shield with spiral design; oars; iron fire brazier on tripod with glowing flames; mooring posts with rope; wooden dock planks; longship with tattered glowing sail and banner pennant; waterfall; snowy pines; boulders; frost shrubs.
- **Lighting/FX details:** emerald aurora ribbon; stars; warm orange firelight vs cool blue night (key contrast); sail glowing gold from within (backlit); snowflake particles; water caustic foam spots.
- **Build components:**
  - Interlace bargeboard (knotwork band) — normal map + trim sheet on mesh — gatehouse eaves, boathouse
  - Scroll-beast gable finial (no eyes) — Blender sculpt — boathouse / stable roofs
  - Iron cage brazier — mesh + emissive fire + ember particles — bridge approaches, gate
  - Rope-wrapped mooring post — mesh — lake dock
  - Backlit glowing sail boat — mesh + translucent emissive cloth shader — lake / moat boats
  - Enamelled round shield with spiral boss — mesh + decal — wall trophies in hall

### U233
- **Patterns:** fish-scale/ wavy shingle roofs (thick, stylised tiles, dark teal); spiral "snail-shell" carved end grain on every protruding beam end (swirl motif — signature detail); half-timber diagonal braces (X bracing around the clock); coursed blue-grey stone blocks at ground level; wood-grain carved into planks.
- **Carvings & relief:** spiral-carved beam ends (deep relief); clock face set in octagonal timber frame with Roman numerals; lancet gothic windows with wooden tracery (Y-tracery, 2 lights) in dormers; arched timber gateway (segmental arch of bent planks); crane/ hoist arm with hook on spire top.
- **Edges & profiles:** exaggerated, crooked steep gables with eaves crossing at peaks; segmental arch over passage; chunky beveled planks with rounded highlight edges; sagging roof ridge.
- **Surfaces & materials:** hand-painted wood (purple-brown), cream plaster panels, dark teal shingles, blue stone, iron straps and pulleys.
- **Objects:** clock tower facade; clock; dormer windows lit amber; pulley ropes and iron hoists; chimney with smoke; arched gateway to stone stair; small potted plants on stair; metal-capped beam brackets.
- **Lighting/FX details:** warm amber glow from lancet windows against twilight blue sky with swirling stylised clouds; lens flare.
- **Build components:**
  - Spiral-carved beam end cap — Blender mesh/normal map decal — every timber building, bridge beams
  - Twin-light lancet dormer — Blender mesh + emissive glass — castle roofline
  - Octagonal-framed clock face — mesh + texture (animated hands) — clock tower / ballroom midnight clock
  - Stylised thick wavy shingles — mesh tiles or normal map — village/turret roofs
  - Bent-plank segmental archway — mesh — passage gates in ring wall

### U234
- **Patterns:** fish-scale tiles (blue glossy) on roofs; X-cross (saltire) lattice wooden railing on bridge; flemish/running-bond red brick; voussoir stones ringing the bridge arch and gate arch; cobble/ flagstone quays; wrought-iron C-scroll and S-scroll bracket work; dentil cornice on stone tower.
- **Carvings & relief:** carved stone gate tower with arched corbel table below roof and round-arched portal with heavy voussoirs; stone balconies on scrolled consoles (corbels) with turned balusters; window surrounds with pediment-like cap; finial spikes on roof ridges (cresting); bakery sign with loaf; café sign (coffee cup medallion); wrought-iron scroll sign brackets.
- **Edges & profiles:** semicircular bridge arch with rusticated voussoirs; crenellated parapet suggestion; tall needle spires on distant castle; ridge cresting of small spikes; window boxes with moulded edges.
- **Surfaces & materials:** red brick, grey ashlar, glossy blue slate, oak timber, wrought iron (black), turquoise canal water.
- **Objects:** stone arched bridge with wooden lattice railing; canal; rowing boats (wooden); quayside iron railings with posts (balustrade fence); wall-mounted swan-neck lamps (wrought iron with globe/bell glass); post lanterns; barrels (stacked); hanging basket planters; window boxes; café chairs and tables behind brick-pillared low wall; awnings; hanging shop signs; bakery; gate tower; distant castle with spires; autumn trees; balcony plants.
- **Lighting/FX details:** sun glare, bright haze around castle, light reflections on water, warm side-light on stone.
- **Build components:**
  - Scrolled iron sign bracket + hanging medallion sign — mesh — shopfronts on ring walkways
  - Swan-neck wall lamp — mesh + emissive glass — walls of narrow lanes, bridge pillars
  - Arched canal bridge with saltire-lattice railing — mesh — moat/canal crossings
  - Quay iron railing with finials — mesh (array) — lake/moat edges
  - Stone balcony on scroll consoles — mesh — castle facades
  - Ridge cresting spikes — mesh array — roof ridges

### U235
- **Patterns:** bunting (triangular pennant flags) strung between buildings; red-and-white striped awning; half-timbering; mossy shingle roofs; vine/ivy drapes.
- **Carvings & relief:** tiered round fountain (2-tier basin on pedestal) in pond centre; wooden signboard on post; carved gable boards; windmill on roof.
- **Edges & profiles:** steep curved green roofs with deep eaves, bowed ridges; stepped terrace waterfalls under the house.
- **Surfaces & materials:** green glazed/moss roofs, wood, cream render, turquoise water, white stone fountain.
- **Objects:** tiered fountain; waterfalls cascading from house terrace; market stall with striped awning; crates/stacked bowls; wooden wheelbarrow/cart; signpost; bunting; ladder; windmill; distant giant tree on rock; mountain waterfall.
- **Lighting/FX details:** warm sun, cast shadows, water sparkle.
- **Build components:**
  - Two-tier pedestal fountain — mesh + water shader — plaza/garden centre
  - Bunting garland — curve mesh with flag cards — ring walkways, party areas
  - Striped market awning stall — mesh + cloth — festival market
  - Terrace cascade waterfall — mesh + flow shader — castle lower terraces

### U236
- **Patterns:** coursed rubble/ashlar on the round stone tower; plank decking laid radially around the circular terrace; overlapping terracotta pantile/ clay-shingle roofs; horizontal sandstone strata bands on the mesa cliff; ladder-rung rope bridge slats; hanging ivy curtains.
- **Carvings & relief:** round-headed arched windows (deeply recessed) on the stone tower; wooden arched door with curved timber frame (horseshoe-ish plank arch) into the hull section; carved curving ship-like ribs/ hull planks wrapping the building; crane boom (curved timber jib with lattice bracing) carrying a hanging lantern; ruined jagged top of tower with wooden lookout platform and curved balustrade — fully 3D.
- **Edges & profiles:** broken/ruined parapet silhouette; boat-hull curved walls with iron strap bands and portholes; balcony railings in thin turned wood; wrap-around boardwalk edge with simple post-and-rail.
- **Surfaces & materials:** warm limestone blocks, sun-bleached reddish wood planks, terracotta roofs, ivy, mossy rock; brass lantern.
- **Objects:** cliff-perched tower-house fused with an upturned ship hull; wooden crane with hanging iron lantern (ornate double-bracket cast-iron cage lantern with glowing glass); rope suspension bridges (3) with slatted decks; spiral wooden stairs; round terrace with rugs (red, olive), tea table and stool, potted plants, flower beds, barrels; cauldron with glowing teal-green liquid; easel/ map board with canvas awning; laundry/ cloth hanging; cart wheel on grass ledge; waterfalls off mesa; cypress trees; large broadleaf tree growing out of roof; birds (flock silhouettes); mesa with tiny village & chapel on top.
- **Lighting/FX details:** hanging lantern glow (warm yellow), cauldron emissive teal, waterfall mist, golden side light, haze between canyon walls.
- **Build components:**
  - Crane-jib hanging lantern — Blender mesh + emissive glass — castle walls, bridge ends, towers overhanging moat
  - Ornate cast-iron cage lantern (double-scroll top) — mesh + emissive — ring walkway, Glowwood paths
  - Slatted rope suspension bridge — curve-deformed mesh array — between floating islands / cliffs
  - Ring boardwalk around tower — mesh (array along circle) — ring walkways
  - Glowing cauldron — mesh + emissive liquid shader + bubble particles — wizard tower, Glowwood clearing
  - Ivy curtain cards — alpha cards — ruined tower, old walls

### U237
- **Patterns:** layered gabled roofs repeating along the hall; stepped cascading waterfalls; gnarled root braiding over rock.
- **Carvings & relief:** elven-style hall with tall steep gables, carved bargeboards and finials (Nordic/elven), many arched windows with warm glow — medium relief; enormous root mass embracing the rock island (organic sculpt).
- **Edges & profiles:** steep pointed gables with swept-up ridge ends; tiered rooflines.
- **Surfaces & materials:** golden-lit timber/stone hall, dark rock, red-magenta foliage canopy, still reflective lake.
- **Objects:** giant world-tree with crimson canopy sheltering a gabled hall; island rock base; wide multi-tier waterfalls; lake; figure with sword (silhouette only); stairs to hall.
- **Lighting/FX details:** warm interior glow from hall windows, mist rising from waterfalls, sunlit cloud.
- **Build components:**
  - Giant root-embraced island tree — Blender sculpt + bark normal map — Glowwood heart tree
  - Elven gabled hall roof kit — mesh — Glowwood lodge, castle annexes
  - Curtain waterfall — scrolling shader + mist particles — castle cliffs

### U238
- **Patterns:** voussoir ring on a giant arch bridge; terraced stone housing stacked on cliff (stepped facades); wooden plank railings; striped strata in red sandstone.
- **Carvings & relief:** massive single-span arch bridge with walkway and buildings on top; cliff-carved dwellings with rows of windows; wooden scaffold gateway (torii-like post-and-lintel frame) — fully 3D.
- **Edges & profiles:** semicircular arch profile with greenery along top edge; overhanging rock shelves.
- **Surfaces & materials:** red-orange sandstone, turquoise river, timber.
- **Objects:** colossal arch bridge; cliff city; small plank bridge across river; wooden gate frame; huts with awnings; barrels, red pots; fence; rainbow; birds.
- **Lighting/FX details:** faint rainbow, bright haze in canyon, light reflections on river.
- **Build components:**
  - Sky-arch bridge with inhabited deck — mesh — link between castle and outer ring
  - Cliff-cut dwelling facades — mesh/normal map — cliff faces under castle
  - Post-and-lintel timber gate — mesh — path entrances

### U239
- **Patterns:** shell/horn-shaped organic buildings; thatched/leaf roofing; plank boardwalk.
- **Carvings & relief:** buildings shaped like giant curling shells/horns and mushroom huts (organic architecture), wooden boat with carved curled prow — fully 3D.
- **Edges & profiles:** curling horn silhouettes with pink interiors; rope-lashed dock rails.
- **Surfaces & materials:** stylised painterly; turquoise lagoon, pink shell surfaces, green-yellow grass thatch.
- **Objects:** shell houses, treehouse platforms, docked boat with railing, dock, waterfall into lagoon, boulders, figure.
- **Lighting/FX details:** bright day, sparkling lagoon.
- **Build components:**
  - Spiral shell house — sculpted mesh + iridescent nacre shader — Glowwood fairy dwellings
  - Curled-prow boat — mesh — lake

### U240
- **Patterns:** none strong; layered rock strata; tree canopy clusters.
- **Carvings & relief:** natural ring/ arch window of rock topped by trees (giant ring arch) — fully 3D.
- **Edges & profiles:** perfectly circular natural arch outline framing the view.
- **Surfaces & materials:** red sandstone, green canopy, blue river pools.
- **Objects:** rock ring arch, mesas/spires, river, pools, figure with umbrella, small animal (figure).
- **Lighting/FX details:** bright clouds, haze.
- **Build components:**
  - Natural ring arch (moon gate of rock) — sculpted mesh — Glowwood entrance or island gateway
  - Tree-capped mesa — mesh — distant skyline

### U241
- **Patterns:** braided root networks; carved panels on the trunk (rectangular niches, arched openings).
- **Carvings & relief:** colossal tree whose trunk is carved into architecture: arched windows/doorways, ring bands, panel mouldings; roots spreading like flying buttresses — deep relief to fully 3D; carved glyph/script band at base (glowing green moss-like letters).
- **Edges & profiles:** arched openings with thick reveals; root edges rounded.
- **Surfaces & materials:** pale grey bark-stone hybrid; moss; turquoise glowing pool.
- **Objects:** tree-temple, waterfall falling through trunk hollow, rock stepping stones, pool, floating cyan light motes, figure in cape.
- **Lighting/FX details:** cyan bioluminescent motes around waterfall and pool, teal glow inside hollow, light spray.
- **Build components:**
  - Carved tree-temple trunk (arched windows in bark) — Blender sculpt + normal map — Glowwood heart tree
  - Root-buttress arches — mesh — Glowwood paths passing beneath
  - Bioluminescent firefly motes — particle system — around water in Glowwood
  - Turquoise glowing pool — shader (depth tint + emissive) — Glowwood spring

### U242
- **Patterns:** stacked pagoda tiers with upturned eaves; repeated round drum towers with bands; stone-flagged path.
- **Carvings & relief:** multi-tier pagodas with gilded roof edges and spire finial (ball + spike); fortress gate with round drum towers and arched portals; guardian statue (seated) at gate — fully 3D.
- **Edges & profiles:** strongly upswept corner eaves with gold trim; banded drums.
- **Surfaces & materials:** gold-glazed roofs, red-lacquered columns, grey stone; lush jungle.
- **Objects:** giant floating whale-like creature (off-theme, skip), pagodas, fort gate, waterfall, jungle, stone path, distant flying craft (sci-fi, skip), figures.
- **Lighting/FX details:** bright day, mist over waterfalls; small cyan glowing panels on creature (skip).
- **Build components:**
  - Upswept gilded eave trim — mesh trim — pagoda-style garden pavilion
  - Drum tower with banded courses — mesh — outer ring wall
  - Seated guardian statue (veiled, faceless) — mesh — gate flanking

### U243
- **Patterns:** stacked hut terraces; rope lines.
- **Carvings & relief:** floating rock island with tiered wooden settlement, prow-like curved beams/ horns projecting from sides — fully 3D.
- **Edges & profiles:** inverted-cone island underside; curved spar silhouettes.
- **Surfaces & materials:** warm rock, moss, timber, orange autumn tree on top.
- **Objects:** floating island with village, wooden cantilever platform with railing (left), boulders, stream, falling debris/rocks hanging, orange tree, yellow tree, figure.
- **Lighting/FX details:** strong backlight haze, floating leaves/ debris particles.
- **Build components:**
  - Floating island base (inverted rock cone) — sculpted mesh — sky islands around castle
  - Cantilever viewing platform — mesh — cliff edges
  - Drifting leaf particles — particle — Glowwood

### U244
- **Patterns:** vertical columnar cliff jointing; wave/foam flow lines.
- **Carvings & relief:** none man-made; natural rock arch at waterfall base.
- **Edges & profiles:** tall sheer cliffs, ledge lips with grass overhang.
- **Surfaces & materials:** slate-blue rock, white water, green meadow.
- **Objects:** twin tall waterfalls, distant wide falls, river, stepping stones, small trees, birds, figure.
- **Lighting/FX details:** mist at waterfall foot, sunny cloud backdrop.
- **Build components:**
  - Tall ribbon waterfall with mist base — shader + particles — castle cliff
  - Columnar cliff kit — mesh + normal map — island edges

### U245
- **Patterns:** trefoil (three-lobed) cutout in a roundel (oculus) above the arch — plate tracery; coursed ashlar blocks; stepping slab path.
- **Carvings & relief:** ruined gothic gateway: pointed (two-centred) arch with multiple recessed orders (stepped roll mouldings, 3 orders), trefoil oculus roundel on top; two pointed-arch shrine niches with gabled hood moulds, each holding melted candles — medium-deep relief.
- **Edges & profiles:** pointed arch with chamfered and roll-moulded orders; niche hoods in shouldered/pointed gable form; broken stepped silhouette of ruined wall; soft bevelled stone edges catching light on top faces, yellow lichen on top edges.
- **Surfaces & materials:** grey weathered limestone, matte, with ochre lichen patches; stone slabs.
- **Objects:** ruined arch gateway; wall niches with candles (shrine); stone slab steps; meadow of golden grass; blue flowers; white daisies; autumn bushes and forest; drifting leaves.
- **Lighting/FX details:** dappled leaf shadows across stone, wind-streak lines, falling orange leaves.
- **Build components:**
  - Trefoil oculus roundel — Blender mesh (boolean) — gate gables, chapel, ruin
  - Three-order pointed archway — mesh — castle gate, garden ruins
  - Candle shrine niche (pointed hood) — mesh + candle flame emissive — castle walls, paths at night
  - Lichen-top stone shader — shader (top-mask colour) — all stone walls
  - Blue flower cards — alpha cards — meadows

### U246
- *Note: off-theme sci-fi ruin; few usable details.*
- **Patterns:** vertical fluting on giant columns/ pilasters; streamlined rounded plinths.
- **Carvings & relief:** monumental fluted pilasters with rounded "streamline" bases — deep relief; broken slab.
- **Edges & profiles:** rounded bullnose base mouldings, cracked edges.
- **Surfaces & materials:** sandstone-like concrete, cracked; red dust.
- **Objects:** cables (skip), rubble, crates/machines (skip), weeds, rope coil.
- **Lighting/FX details:** low warm sun slanting through window as god rays; dusty air.
- **Build components:**
  - Fluted giant pilaster with bullnose base — mesh — ballroom walls
  - Slanting sunbeam/ moonbeam through window — volumetric cone shader — ballroom/ halls

### U247
- **Patterns:** Art Deco zigzag/ chevron and stepped arch motif on wrought-iron gates (layered stepped arches + parallel lines); fluted vertical setbacks on towers (Deco pilaster strips); iron palisade railing with spear tops; topiary spirals.
- **Carvings & relief:** gate piers with carved concentric "eye-ring" disc medallion and stepped caps; twin statues on scroll/wave plinths flanking entrance (figures — make veiled/faceless); entrance portal with red banners and gilded crest above door — deep relief/fully 3D; spiral topiaries.
- **Edges & profiles:** stepped setback skyline, pointed-arch slit windows, tall finial spikes (copper rods); curved swan-neck lamp masts arcing over the gate.
- **Surfaces & materials:** cream limestone, polished black iron, copper (horn-like trumpet horns), red carpet, red-crimson foliage.
- **Objects:** wrought-iron double gate; gate piers; curved arching mast lamps; multi-head lamp posts (candelabra lamp with 4–5 carriage-lantern heads); red carpet runner; spiral topiaries in square planters; clipped boxwood balls; crimson ornamental trees; cypresses; flower beds; iron railing fence; copper gramophone-horn sculptures; statues; banners.
- **Lighting/FX details:** warm yellow lantern glow; dramatic sky.
- **Build components:**
  - Art Deco stepped-arch iron gate — Blender mesh (curves → mesh) — castle main gate / garden gate
  - Candelabra lamp post (5 carriage lanterns) — mesh + emissive — castle forecourt
  - Ring-medallion gate pier — mesh — gate posts
  - Spiral topiary in planter — mesh (screw modifier + leaf shader) — formal garden
  - Red carpet runner — mesh/decal — ballroom approach
  - Veiled statue on wave plinth — sculpt — entrance flanking

### U248
- **Patterns:** Art Nouveau whiplash curves in the brass window mullions (tall pointed arch window split by sinuous bronze tracery); cogwheel (gear) silhouettes behind the window; tall bookcase grids; ornamental carpet border; mechanical panel engravings on a large wall-mounted machine (left).
- **Carvings & relief:** armillary sphere / orrery (brass sphere inside two crossed rings, suspended on a piston-and-gear column) — fully 3D; Nouveau ogee-shaped window frames with flowing tendrils; carved bookcases and a library ladder; ornamented console/ desk with scrolled bronze legs; tulip-shade desk lamp with gooseneck stem.
- **Edges & profiles:** tall ogee-pointed arched window heads with flowing bronze outlines; balcony railing outside window; scalloped (fluted) glass lamp shade edges.
- **Surfaces & materials:** polished reflective marble floor, brass/bronze (gold sheen), teal-painted plaster walls, wooden shelves, leather books, frosted ribbed glass lampshade.
- **Objects:** suspended armillary sphere machine; gear wall; library bookcases (multiple storeys) with sliding ladder; tulip desk lamp; stacked books; framed illustrated book/ panel; desk; globe; notice board with papers; rug; airship visible outside (skip/ maybe fantasy ship); balcony.
- **Lighting/FX details:** bright window backlight with bloom, glossy floor reflections, warm lamp glow, light dust motes.
- **Build components:**
  - Armillary sphere (crossed rings + sphere) — Blender mesh, slow rotating animation — wizard tower observatory / ballroom centrepiece
  - Art Nouveau whiplash window tracery — mesh from curves — library, tower windows
  - Tulip-shade gooseneck lamp — mesh + frosted emissive shade — study/ library desks
  - Library ladder + bookcase kit — mesh — castle library
  - Polished marble floor — shader (glossy + SSR/ planar reflection) — ballroom, halls

### U249
- *Note: sci-fi game interiors; borrow forms only.*
- **Patterns:** sweeping gold inlaid curvilinear lines on floors (flowing ribbon inlay); circuit-like glyph frieze in gold on back wall; concentric ring patterns.
- **Carvings & relief:** large suspended open rings (hoop sculptures) hanging from a vaulted ceiling; columns encrusted with rock/coral and gold moss; segmental-arched vault ribs with gold banding — deep relief.
- **Edges & profiles:** streamlined curved railings; arched vaults with gold edge piping; rounded plinths.
- **Surfaces & materials:** ivory/pearl stone, polished gold trims, teal emissive strips, violet glowing ceiling glass.
- **Objects:** hanging rings, glowing violet lamp-domes atop columns, floor ring platforms, balconies, crystal-white rocky pillars, figures (skip).
- **Lighting/FX details:** violet ceiling glow, teal light lines, light shafts through dusty air.
- **Build components:**
  - Suspended gilded hoops — Blender mesh (torus) + gold PBR — ballroom ceiling
  - Gold ribbon floor inlay — decal/ emissive trim texture — ballroom floor, ring walkways
  - Violet glowing column cap (light dome) — mesh + emissive — Glowwood pavilions

### U250
- **Patterns:** gold Art Nouveau/ Voronoi branching tracery dome (organic lattice of gold ribs with glazed cells); stained-glass floor with gold leading in curving cell pattern (teal and amber panes); radial compass-like floor rays.
- **Carvings & relief:** throne dais with tiered steps; floating glowing orb inside gold tripod frame on top; ornate brass console/ orrery desk (left) with dial rings; gold leaf-shaped wing panels — fully 3D.
- **Edges & profiles:** dome ribs as flowing branching curves; stepped dais edges with gold edge piping; ring-edged consoles with rivets.
- **Surfaces & materials:** polished gold/brass, glass floor (tinted teal, translucent), cream stone.
- **Objects:** gold-lattice dome observatory; orb pedestal on dais; brass control/ map table; oculus skylight at top; figures (skip).
- **Lighting/FX details:** bright sky through lattice, glowing blue-white orb, reflective glass floor.
- **Build components:**
  - Branching gold lattice dome — Blender mesh (Voronoi-derived ribs) + glass — ballroom roof, observatory, conservatory
  - Leaded stained-glass floor — shader (Voronoi cells, emissive under-glow) — ballroom dance floor
  - Orb on tripod pedestal — mesh + emissive + bloom — throne/ wish altar
  - Brass ring console table — mesh — map room

### U251
- **Patterns:** herringbone brick paving on plaza; red-white barber spiral on mooring poles (paline); brick bridge with stone quoins; terracotta roof tiles (Roman/ pantile); green louvered shutters in rows.
- **Carvings & relief:** round-arched windows with stone surrounds and keystones; quoined building corners; arched loggia (arcaded ground floor); stone cornices; little balconies with iron railings — shallow relief.
- **Edges & profiles:** stone bridge with segmental arch and stone coping; iron stair railings over bridge; rounded stone canal coping; overhanging tiled eaves.
- **Surfaces & materials:** salmon, yellow, cyan stucco; cream stone trim; brick; teal canal water; dark green iron.
- **Objects:** swan-neck double lamp post (curved arm hanging lantern + twin lantern cluster); canal; rowing boat with oars; striped mooring poles; brick arched bridge with iron railing; bicycle; potted plants (terracotta and wooden planters); wooden bench with iron ends; tree in plaza; striped café awning; sandwich board; wooden mooring pontoon/ crates; bell tower with green cupola; distant castle on mountain.
- **Lighting/FX details:** clear daylight, water specular.
- **Build components:**
  - Swan-neck hanging lantern post — mesh + emissive — canal/ moat edge, bridges
  - Striped mooring pole — mesh + spiral stripe shader — boat docks on lake
  - Herringbone brick paving — normal/albedo texture — plazas, ring walkways
  - Segmental brick bridge with iron rail — mesh — canal/ moat crossings
  - Keystone round-arch window surround — mesh trim — castle town facades

### U252
- **Patterns:** coursed ashlar with drafted margins; balustrade of turned balusters; tiled roof with dormers; window pediments repeated.
- **Carvings & relief:** Tuscan-order columns at the arched portico; arched loggia; pedimented window hoods (segmental and triangular alternating); corbelled cornices; rusticated pilasters; dormer windows with curved caps — shallow-medium relief.
- **Edges & profiles:** heavy crown cornice, string courses at each floor, round-arched openings with archivolt moulding, stone balustrade with plinth.
- **Surfaces & materials:** sandstone (cream), red and yellow stucco, blue slate roofs, stone paving.
- **Objects:** balustraded terrace, arcade, lamp posts (post lantern), doors (red panelled), well/ fountain rim (foreground, partial).
- **Lighting/FX details:** sun with soft shadows; lilac clouds.
- **Build components:**
  - Stone balustrade with turned balusters — mesh array — terraces, bridges, ring walkways
  - Tuscan column + arch arcade — mesh — courtyard cloister
  - Pedimented window hood set — mesh trims — castle wings

### U253
- **Patterns:** repeated round-headed arcades on two storeys; balustrades; round oeil-de-boeuf (bull's-eye) dormers along mansard roofs; chequered classical rhythm of pilasters.
- **Carvings & relief:** Baroque tower with stacked tiers of carved ornament and urns (left); central pavilion with triangular pediment, coupled columns, and two spirelets; balustraded double staircase; statues/ urn finials on parapets — medium-deep relief.
- **Edges & profiles:** mansard roofs with curved dormer caps; crisp cornices; arched loggias.
- **Surfaces & materials:** honey limestone, blue slate, pale paving.
- **Objects:** palace courtyard; grand double stair; terrace balustrades; lamp posts; circular basin (dark, foreground).
- **Lighting/FX details:** soft evening light, pink cloud.
- **Build components:**
  - Bull's-eye mansard dormer — mesh — castle roofline
  - Double-flight grand stair with balustrade — mesh — castle forecourt to ballroom
  - Baroque tiered lantern tower — mesh — castle palace wing

### U254
- **Patterns:** English bond red brick; dentil/ corbel block frieze under eaves (row of hanging stone brackets — corbel table); slate roof in rows; turned baluster balcony; cobble/ setts paving with granite kerb; rib segments on dome.
- **Carvings & relief:** ribbed dome (green copper panels between stone ribs) with lantern and spire finial; round-arched windows with stone archivolts and keystones; tall stone pilaster strips; console-supported balcony; Tuscan columns on curved porch with arcade; clock/ roundel tower with circular motif; fanlight over door (sunburst fan); gable spikes (finials) — medium relief.
- **Edges & profiles:** stepped gable copings; corbelled eaves; curved balustraded balcony sweeping around corner; window hood moulds with returns.
- **Surfaces & materials:** red brick (normal-mapped), grey dressed stone, verdigris copper dome, slate, teal glazing with small panes.
- **Objects:** curved portico; dome; balconies; green iron lamp posts (twin-head); park bench (green wood/iron); chimneys with pots; topiary cones; autumn tree; garden steps with brick piers; wall lanterns; smoke.
- **Lighting/FX details:** warm sunset clouds, chimney smoke, small lamp glows.
- **Build components:**
  - Ribbed copper dome with lantern — Blender mesh + verdigris shader — ballroom dome / tower caps
  - Hanging corbel-block eaves frieze — mesh array — all brick wings
  - Curved balustraded balcony over arcade — mesh — castle corner pavilion
  - Sunburst fanlight door — mesh + glass emissive — entrances
  - Twin-head green iron lamp post — mesh — plazas

### U255
- **Patterns:** Corinthian colonnades; coffered or stepped pediment; rows of arched windows; ribbon banners.
- **Carvings & relief:** classical temple facades with Corinthian capitals (acanthus) — deep relief; pediments with central statue/ acroterion; domed rotunda with arched windows; balustraded grand stair; tall columns in foreground with Corinthian/ composite capitals.
- **Edges & profiles:** triangular pediments, entablatures with architrave-frieze-cornice, rounded drum.
- **Surfaces & materials:** warm sandstone, terracotta-orange dome, weathered stone, orange silk banners.
- **Objects:** temple, rotunda, stairs, cypresses, potted shrubs, flowing orange banners hanging from colonnade, distant buildings.
- **Lighting/FX details:** warm hazy dusty light, sun flare.
- **Build components:**
  - Corinthian capital — Blender sculpt/mesh — ballroom columns
  - Flowing silk banner strip — cloth sim/ vertex shader wave — castle colonnade, ring walkway
  - Domed rotunda pavilion — mesh — garden folly

### U256
- **Patterns:** repeating round-arch arcades on two storeys; roundel/ medallion discs (rosette roundels) in the frieze band of the concave facade; Borromini-style stepped spiral lantern (helical ziggurat spire) topping the drum; grid-latticed (iron grille) window panes; large square stone flag floor in the loggia with polished sheen; groin-vault sequence.
- **Carvings & relief:** concave Baroque facade with giant-order pilasters, curved entablature, aedicule windows with pediments; balustrade crowning the cornice; corner lantern turrets with small domes and flame finials; urn/ pinecone finials on cornice; helical spiral spire with crown finial — deep relief/fully 3D. Right: long arcade (loggia) with square piers and pilaster capitals, red-plastered barrel/groin vaults, low balustrade with turned balusters.
- **Edges & profiles:** strong crown cornice following curved plan; archivolts around every arch; plinth courses; ring-topped stone bollards (cannon-like bollards with iron rings) in courtyard.
- **Surfaces & materials:** travertine (pitted cream), polished stone floors (reflective), terracotta-red plaster vault interiors, iron grilles, worn grass between pavers.
- **Objects:** courtyard of ring-top bollards; hanging lantern pendants in arcade (lantern on chain, Venetian-style); spiral-lantern church dome; balustrades; arched wooden doors; window grilles.
- **Lighting/FX details:** sun pools on polished floor down the arcade; warm hanging lanterns; deep shadowed vaults with warm bounce.
- **Build components:**
  - Helical spiral spire (Borromini lantern) — Blender mesh (screw modifier) — central castle tower crown
  - Arcade loggia with groin vaults + hanging chain lanterns — mesh + emissive — ring walkways (covered)
  - Ring-top stone bollard — mesh — courtyard/ bridge edges
  - Frieze rosette roundel — mesh/normal map decal — cornice bands
  - Concave Baroque facade module — mesh — ballroom entrance

### U257
- **Patterns:** fluted columns (cannelures) with gilded flutes; egg-and-dart and bead-and-reel on cornices; dentils; gilded modillion brackets under the ring cornice (gold block brackets in a row); coffered/ fluted inner dome ribs; acanthus rinceau (scrolled foliage) in the pendentives/ spandrels; sunburst fanlight windows (thermal lunettes with radiating mullions); compass-rose star inlay in the floor (8-point star in marble with gold border rings around a sunken central well); wave/ guilloche bands on dado; red marble radial floor.
- **Carvings & relief:** Corinthian capitals with gilding (paired columns) — fully 3D; large acanthus-scroll spandrel cartouches (deep relief) between the arches; arched lunette window bays with coffered soffits; balcony-like ring entablature with gold edge; carved relief frieze panels on the dado/ plinth (figurative — make abstract); marble sculptural group on plinth (figures — make veiled); bronze statues flanking (figures — make faceless); ornate carved table with scrolling C-scroll and acanthus aprons; tall arched windows with gold tracery roundel at top and ironwork circle-and-cross grilles on the balcony.
- **Edges & profiles:** stacked cornices with gold edge piping on every moulding lip, giving bright gold lines in light; round-arched windows with archivolts; curved drum.
- **Surfaces & materials:** white/ivory marble and plaster, extensive gilding, polished veined marble floor in red/coral with gold strips, sheer white curtains (silk drapes), bronze statues (dark patina), clear glass.
- **Objects:** rotunda hall; marble statue group on pedestal; bronze statues; chess table (carved) with stool (red velvet ottoman); sheer curtain swags at windows; circular balcony railings outside with rings; garden tempietto visible outside (columned round temple); trees.
- **Lighting/FX details:** strong god rays slanting through tall windows, dust motes, golden glints on gilt, soft bounce.
- **Build components:**
  - Gilded Corinthian column pair — Blender mesh (high detail, baked normals) + gold mask shader — ballroom
  - Acanthus spandrel cartouche — sculpted normal map / decal — ballroom arches, castle gate spandrels
  - Gold modillion ring cornice — mesh array — ballroom dome base
  - Sunburst lunette window — mesh + glass — upper ballroom/ tower clerestory
  - Compass-rose star floor inlay with sunken well — texture + decal + mesh — ballroom centre
  - Sheer curtain swag — cloth mesh + translucent shader — ballroom windows
  - Volumetric window shafts + dust motes — shader + particles — ballroom by day (moonlight version at night)

### U258
- **Patterns:** jali-like pierced/ carved panels on pilasters (dense arabesque filigree in tall rectangular panels — Indo-Saracenic/ Moorish carved stone); rosette medallions in spandrels; mosaic roundels (circular pebble/ tile mosaic medallion pads set into the paving at pool corners, radial pattern); border band of mosaic around the pool; ribbed dome with radial ribs and dormer lucarnes.
- **Carvings & relief:** deeply carved foliate capitals (composite with acanthus) on piers; carved archivolts; trefoil/ cusped arches in balconies; balustraded balconies with carved panels; distant palace with Baroque ribbed dome, lantern and spirelet, arched niches with statues, scrolled pediment portal — deep relief.
- **Edges & profiles:** round arches with richly carved archivolts; pool with curved, rounded stone coping and semicircular lobed bays; colossal arch framing view.
- **Surfaces & materials:** warm sandstone, carved filigree, dark still water, green ivy, bronze lanterns.
- **Objects:** reflecting pool; water lilies (pads + flowers); floating candles/ tea-light lanterns; hanging globe lanterns (pierced metal Moroccan-style); stone planters with tropical plants (banana/ strelitzia, palms); climbing ivy; balcony planters; low balustrade at palace; distant mountains.
- **Lighting/FX details:** warm dusk light, candle glow on water, mirror reflections.
- **Build components:**
  - Carved jali/ arabesque pilaster panel — normal map + alpha (or baked mesh) — castle courtyard piers
  - Lily-pad pool with floating candles — mesh instancing + emissive + reflection shader — palace reflecting pool
  - Mosaic medallion paving roundel — decal — pool corners, plaza nodes
  - Pierced metal globe lantern — mesh + emissive with cookie shadows — arcades
  - Lobed pool coping — mesh — garden pool

### U259
- **Patterns:** same courtyard at night: arabesque filigree panels on piers; carved rosette spandrels; ribbed dome with medallion panels between ribs; sunburst/ radial grate (iron fan-ray grille) in the foreground basin; mosaic roundels; scattered lily pads.
- **Carvings & relief:** foliate (acanthus) capitals with deep undercut; carved archivolt bands with arabesques; lacework arch soffits (intricate pierced vault); ornamented balustrade with circular rosette panel at the central stair; dome lantern with columns — deep relief.
- **Edges & profiles:** round arches lit from below, edges glowing amber; stepped dome base.
- **Surfaces & materials:** sandstone glowing warm under lamps; black mirror water; ivy dark green; bronze.
- **Objects:** floating candle-lanterns (glass cups in metal holders); white water lilies (open flowers); hanging globe lanterns; wall sconce candelabra (tall candelabrum torchère); planters with banana plants; palace with lit windows; floor lamps along stair; urn planters.
- **Lighting/FX details:** starry sky with Milky Way; snowy moonlit mountains; warm amber uplights grazing carved stone (shows relief brilliantly); candle points reflected in water; patterned light cast from pierced lanterns.
- **Build components:**
  - Floating candle lantern — mesh + emissive + point light pooling — lake, moat, palace pools
  - White water-lily flower + pad — mesh instancing — Glowwood pools, moat
  - Uplight grazing on carved stone — lighting setup (spot from below) — castle facade at night
  - Radial iron grille basin — mesh/decal — fountain drains, floor vents
  - Torchère candelabrum — mesh + flame particles — arcades, ballroom

### U260
- **Patterns:** arabesque filigree carved into pier faces (tall rectangular panels of interlaced scroll foliage); rosette medallions in spandrels; square carved panels (lozenge/ rosette in square) in the frieze above arches; pierced jali screens filling the side arches (overgrown with ivy); radial mosaic medallion pad in front of pool; lily pads.
- **Carvings & relief:** foliate composite capitals with deep undercutting; round arches with carved archivolts; inner arcade with slim columns and arched doorway; carved wall niches/ aedicules inside the loggia — deep relief.
- **Edges & profiles:** projecting entablature with blocky modillions; pool with lobed (semicircular) bay and raised stone curb; planter boxes with moulded tops.
- **Surfaces & materials:** warm honey sandstone, dark water, ivy; bronze hanging lantern.
- **Objects:** pendant lantern (bronze, faceted) hanging in central arch; reflecting pool with lilies and flowers; stone planter boxes with palms/ banana plants; urn planter on pedestal; ivy-covered jali; small sculpture in niche.
- **Lighting/FX details:** low warm evening light, soft reflections, dim interior with lantern glow.
- **Build components:**
  - Arabesque carved pier panel — normal/height map on pier mesh — courtyard, ring walkway piers
  - Ivy-clad jali arch screen — alpha-cut mesh + ivy cards — garden walls
  - Lobed pool with radial mosaic pad — mesh + decal — palace garden
  - Faceted bronze pendant lantern — mesh + emissive — arcades

### U261
- **Patterns:** turned balusters on curving terrace balustrades (two tiers); arched niches in a row (blind arcade) each with patterned panels (stained/ painted roundel motifs, looks like ornamental grilles); carved rosette roundels in spandrels; square paving slabs.
- **Carvings & relief:** semicircular grotto/ nymphaeum exedra: central round arch framing a bronze statue in a niche (figure — make veiled), flanked by Corinthian half-columns and side arched niches with urns; urn-topped pedestals (carved vase finials with foliage) flanking stairs; potted-urn finials on balustrade posts; small pedimented pavilion at the top — deep relief/fully 3D.
- **Edges & profiles:** curved terrace edges following exedra; cornice with modillions; stepped semicircular stair.
- **Surfaces & materials:** weathered limestone with dark staining and moss, bronze (dark), hanging greenery.
- **Objects:** exedra/ grotto facade, statue in niche, urn finials on pedestals, balustrade terraces, semicircular steps, mature trees (oak/ plane), clipped shrub balls, fallen leaves, stone paved avenue, side stairs.
- **Lighting/FX details:** dappled sunlight through canopy; soft green shade.
- **Build components:**
  - Exedra nymphaeum with central statue niche — Blender mesh — garden terminus / below castle terrace
  - Urn finial on pedestal — mesh — balustrade posts, stair ends
  - Two-tier curving balustrade terrace — mesh (curve array) — castle garden levels
  - Blind arcade niche wall — mesh + panel decals — garden walls

### U262
- **Patterns:** gilded rinceau/ acanthus scroll carving framing mirrors and window recesses (deep pierced gilt frames); tall vertical arabesque filigree panels; sunburst spiked mirror (sun mirror with radiating spikes, dark iron) at top; ornamental wrought-iron lace patterns on chairs (C-scrolls, fleur scrolls); square flagstone floor.
- **Carvings & relief:** gilt baroque mirror frames (deep relief, pierced); wall sconces: gilt candle girandole (two-arm candelabra with cartouche back-plate) — fully 3D; carved column shafts with twisting filigree (dark bronze-like); carved octagonal stone planter with relief panels; baseboard plinth mouldings.
- **Edges & profiles:** stepped recessed window reveals with bolection mouldings; mirror frame lip with gold edge highlights.
- **Surfaces & materials:** honey limestone wall (matte, slightly worn), gold leaf (warm specular), blackened cast iron, white marble tabletop, porcelain, polished brass vase.
- **Objects:** cast-iron bistro chairs (lacework backs) ×2; pedestal table with marble top and tripod scroll base; porcelain teapot, teacup, plate with cake slice; brass vase/ urn (gilded with motif bands); gold bowl of cherries; large wall mirror; wall sconces with candles; standing torchère (crown/ tulip-shaped pierced iron brazier on pole) with flame; hanging globe lanterns (pierced brass); potted palm in carved planter; sunburst mirror.
- **Lighting/FX details:** candlelight warmth, flame on torchère, reflections in mirror showing infinite arcade (mirror depth trick), soft shadows.
- **Build components:**
  - Gilt rinceau mirror frame — Blender sculpt → normal map + gold shader; mirror via cube-map/ planar reflection — ballroom walls, castle salons
  - Two-arm candle girandole sconce — mesh + flame emissive/ flicker — ballroom, corridors
  - Lacework cast-iron bistro set — mesh with alpha lace or modelled — café terrace, garden nooks
  - Crown torchère brazier — mesh + fire particles — arcades, entrance
  - Sunburst spiked mirror — mesh — salon focal point
  - Tea service props (teapot, cup, cake) — mesh — birthday party tables

### U263
- **Patterns:** argyle/ diamond lozenge floor tiling in teal-green and slate with thin cream lines (diamond grid pavement); arabesque gilt-carved filigree panels on piers (vertical scroll panels); trefoil-cusped arch soffit bands; ivy leaf mats.
- **Carvings & relief:** carved composite capitals with acanthus; segmental/ round arch with carved archivolt and keystone ornament; pierced arched gallery; ornate pilaster with gold arabesque inlay; carved cartouche/ scallop crest atop pier (shell motif) — deep relief.
- **Edges & profiles:** arched corridor sequence (enfilade), moulded plinths, rounded column bases.
- **Surfaces & materials:** limestone, gold-inlaid carving, polished teal tile (glossy reflections), glazed blue roof (distant), bronze fittings.
- **Objects:** hanging faceted brass lanterns (pendant, amber glass) in a row down corridor; incense burner stand (crescent-arm bronze stand holding a hanging censer bowl, smoking); small brass lantern on floor (Moroccan pierced lantern); torch stands; ivy-covered pillar; ferns, tropical plants; planters; distant palace facade with arched niches and statues; steps; fallen leaves.
- **Lighting/FX details:** sun patches on floor, rising incense smoke wisps, warm lantern glow, hazy depth.
- **Build components:**
  - Diamond lozenge tile floor — tiling texture + glossy shader — ring walkways (covered), arcades
  - Row of pendant faceted lanterns — mesh + emissive — corridors, ring walkway
  - Crescent-arm censer stand with smoke — mesh + smoke particle — shrine/ arcade
  - Gold-inlay arabesque pier panel — normal + gold mask — palace piers
  - Shell crest cartouche — sculpt/decal — pier tops, doors

### U264
- **Patterns:** wrought-iron balustrade panels with scroll/ C-scroll and circle motifs between stone posts; coffered dome with radial coffers; vertical arabesque relief bands on dark piers; rosette-patterned openwork (pierced cartouche) in a drum above an arch.
- **Carvings & relief:** grand staircase with massive stone handrail (sweeping, rounded) and panelled newel posts (square posts with recessed panels); carved dark piers with deep foliate relief; arched openings with coffered soffits; carved openwork oculus/ cartouche over central arch — deep relief.
- **Edges & profiles:** rounded bullnose handrail catching light along its top edge; stepped stair nosings; arch archivolts lit from below.
- **Surfaces & materials:** dark bronze-brown stone, gold accents, frosted glass globes, stone stairs.
- **Objects:** globe lamps on newel posts (opal glass spheres); hanging pendant lantern (ribbed ball lantern on chain); smaller globe pendants deeper in; palm; ironwork gate in arch.
- **Lighting/FX details:** low warm glow from globes, deep darkness, amber bounce on arches — moody night palace mood.
- **Build components:**
  - Grand stair with sweeping stone handrail + panelled newel + globe lamp — Blender mesh + emissive — castle entrance hall to ballroom
  - Scroll-iron balustrade panel — mesh/alpha — stair, gallery rails
  - Ribbed pendant ball lantern — mesh + emissive — halls
  - Coffered dome soffit — mesh/normal map — entrance hall ceiling

### U265
- **Patterns:** circular floor medallion (rosette/ compass mosaic) in centre of a marble floor laid in large black and cream geometric shapes (quatrefoil-cut corner cartouches around the medallion); coffered dome with oculus; gothic-tracery window (arched with reticulated mullions) behind throne; carved panelled pier shafts.
- **Carvings & relief:** massive dark columns with carved capitals (foliate, heavy abacus) and carved figural/ ornamental band on the shaft; arched recesses with carved archivolts; throne dais with steps; low iron/ bronze balustrade around the central floor area — deep relief.
- **Edges & profiles:** stepped dome rings; ring balustrade edges; dais stair edges.
- **Surfaces & materials:** polished black and cream marble (glossy), dark stone columns, red lacquered/ painted pilasters, bronze rails.
- **Objects:** throne on dais; floor medallion; balustrade railings; banners/ red wall hangings; hanging lamps; window with tracery.
- **Lighting/FX details:** god rays from dome oculus/ high windows, dusty air, floor reflections.
- **Build components:**
  - Central compass/ rosette floor medallion — texture + decal + glossy shader — ballroom/ throne room centre
  - Black-and-cream quatrefoil marble floor — tiling texture — throne hall
  - Throne dais with balustrade ring — mesh — throne room
  - Oculus god-ray — volumetric cone shader — rotunda halls

### U266
- **Patterns:** elongated hexagon/ octagon-and-dot coffered ceiling (stretched octagonal lattice with small square studs at intersections — "octagon and square" pattern); parquet floor in herringbone/ chevron strips with black-marble star inlays (8-point star made of kite/ diamond shapes around column bases); gold rope moulding (cable/ torus) running the length of the cornice; repeating gilt bracket-scroll modillions (large S-scroll consoles) along cornice on right; red damask panels with gold acanthus leaf-trail relief inside pilaster panels.
- **Carvings & relief:** fluted columns with gilded acanthus-leaf capitals (lotus/palm-leaf style Corinthian), gold collar rings at base, set on red marble plinths — fully 3D; gilded scroll consoles/ corbels at frieze; round-arched doorways with gold archivolt beading; carved door panels with gold mouldings; gilded vertical leaf garland panels in red recesses (window jambs) — deep relief; gilt-legged bench (red velvet seat, cabriole legs).
- **Edges & profiles:** gold bead moulding outlining arches; multi-step cornice; window splay with fine glazing bars.
- **Surfaces & materials:** grey veined marble (walls/columns), gold leaf, red velvet drapes, polished wood parquet (very glossy), black marble inlay.
- **Objects:** crystal-and-gilt chandelier (multi-tier with candle arms); red velvet curtains in arched doorways; red-upholstered gilt benches; columns; tall windows; doors.
- **Lighting/FX details:** strong window light casting mullion-shaped patterns across the parquet (window-grid shadows), golden glints, depth haze.
- **Build components:**
  - Octagon-and-square coffered ceiling — normal map + mesh trims — ballroom ceiling vault
  - Gilt-capital fluted column on red marble plinth — mesh — ballroom colonnade
  - Parquet floor with black star inlays — texture/ decal + glossy shader — ballroom floor
  - Gilt S-scroll console frieze — mesh array — ballroom cornice
  - Red velvet curtain in arch — mesh + fabric shader — ballroom alcoves
  - Window-mullion light pattern — light cookie/ projected texture — ballroom (moonlight)

### U267
- **Patterns:** painted ceiling (frescoed coffers framed in gold), chequered polished marble floor, arched windows in series.
- **Carvings & relief:** gilt Corinthian pilasters, carved gilded wall panels with frames (picture frames), crystal chandelier — deep relief.
- **Edges & profiles:** arched windows and doors, gilded cornice.
- **Surfaces & materials:** mirror-polished marble floor, gold leaf, red-gold fresco.
- **Objects:** chandeliers, paintings in frames, windows, side tables.
- **Lighting/FX details:** strong orange sunbeams with bloom/ lens glow, extreme floor reflections.
- **Build components:**
  - Mirror-polished marble floor with planar reflections — shader — ballroom
  - Fresco ceiling panels framed in gilt — texture + mesh frame — ballroom/ salon ceiling

### U268
- **Patterns:** gilded lattice balustrades (openwork gold grille) on upper galleries; ornamental rocaille (Rococo C-scroll) gold stucco on ceiling coves; arched windows with fanlight tracery; pink crystal/ blossom cornice ring around the ceiling opening.
- **Carvings & relief:** gilded pilasters with capitals, Rococo scroll mouldings around ceiling cove, carved gallery fronts, crystal chandelier (multi-tier, candle arms, cascading crystal drops) — fully 3D; wall-mounted crystal chandelier-sconces.
- **Edges & profiles:** coved ceiling opening onto a painted/ magical galaxy sky (ceiling as window to space); gold edge piping on gallery fronts; curved cornice.
- **Surfaces & materials:** gold, crystal (sparkling), pink silk drapes, polished dark wood/ marble floor (very reflective), pink blossoms.
- **Objects:** central crystal chandelier (huge, with candles); dozens of smaller crystal chandeliers and wall sconces; pink swagged curtains; flower arrangements (pink roses/ hydrangeas) on galleries and in urns; tea tables and chairs; pink upholstered settee; gilt side urn; pianoforte-like table; figures in ball gowns (figures only).
- **Lighting/FX details:** ceiling opens to a pink nebula/ starfield with a radiating burst; floating sparkles/ glitter particles; warm candle glow; light patches on floor; pink-violet ambient colour.
- **Build components:**
  - Crystal candle chandelier (tiered with drop strands) — Blender mesh + glass/ crystal shader + sparkle particles — ballroom centrepiece
  - Galaxy-sky ceiling opening with pink nebula — animated shader on dome — ballroom ceiling (signature birthday moment)
  - Pink crystal/ blossom cornice ring — mesh instancing + emissive — ballroom ceiling rim
  - Gilded lattice gallery balustrade — mesh/alpha — ballroom upper galleries
  - Floating glitter particles — particle system — ballroom dance floor
  - Flower urn arrangements (pink) — mesh — ballroom galleries, tables

### U269
- **Patterns:** fresco/ painted ceiling (cloudy, cracked); gilded rinceau bands on cornice friezes; panelled walls with carved frames; circular inlaid lines on polished floor (concentric ring inlay).
- **Carvings & relief:** carved bust/ caryatid-like sculptures above doors (figures with spiked sunburst crowns — make faceless/ veiled) set on scrolled consoles — fully 3D; heavy door surrounds with eared architraves; dark marble columns with gilded Corinthian capitals; arched coffered vault; ornate balustrade stair (left) with iron balusters.
- **Edges & profiles:** round arch framing distant rotunda; draped swag (fabric garlands) hanging from the arch apex; door pediments; deep plinths.
- **Surfaces & materials:** dark green/black marble columns, aged stone walls, gold, polished floor, candle wax.
- **Objects:** wall candelabra sconces (two- and three-arm, wrought scroll) with lit candles; crystal chandelier with candles in far rotunda; fabric swags; doors (tall panelled); stair with railing; distant statues in niches (rotunda); blue glowing windows; candles on floor/ ledges.
- **Lighting/FX details:** strong colour contrast: warm candlelight foreground vs blue moonlit far room; glossy floor reflections; dark vignette.
- **Build components:**
  - Scroll-arm candle sconce — mesh + flame emissive/ flicker — corridors, ballroom walls
  - Sunburst-crowned faceless bust on console — sculpt — over doors in castle halls
  - Fabric swag garland — mesh/ cloth — arches, ballroom entrance
  - Concentric ring floor inlay — decal/ texture — rotunda floors
  - Warm-near/ cool-far lighting setup — lighting guide — interior night scenes

### U270
- **Patterns:** large circular floor medallion (radial rosette/ compass with star points) in polished multicolour marble; arcades of round arches down a nave; coffered barrel vault; dome with lantern at end.
- **Carvings & relief:** massive piers with pilasters and gilded capitals; arched bays — deep relief.
- **Edges & profiles:** receding arch sequence; dome drum.
- **Surfaces & materials:** polished marble (glossy), gold, warm stone.
- **Objects:** red carpet runner down centre, arcades, distant windows.
- **Lighting/FX details:** heavy god rays from above, golden mist, bloom.
- **Build components:**
  - Radial star medallion floor — decal + glossy shader — ballroom/ entrance hall
  - Nave arcade module — mesh — long gallery to ballroom
  - Hazy volumetric haze layer — fog shader — interiors

### U271
- **Patterns:** wrought-iron arch-spandrel scrollwork of C- and S-scrolls with flame/tendril tips (art-nouveau whiplash) between columns; a rosette roundel (6–8 spoke wheel) at the crown of each iron arch; chequer floor of cream and pale-brown marble squares laid on the diagonal (diamond chequer); a row of pointed-arch blind arcade with trefoil-ish cusps on the throne dais frieze; a frieze of repeating gilt shield/leaf-shaped panels (palmette-like) below the dais; coffered/segmented panels on the vaulted ceiling (gored dome segments with ribs).
- **Carvings & relief:** throne back with a gilt central sunburst/star medallion over a stylised acanthus-leaf frond motif (deep relief, gilded on red); throne posts with ball finials and small turned urn finials; dais rail in gilded metal with scroll terminals; carved winged/foliate griffin-like pedestal sculptures at the foot of the staircase left and right (fully 3D, green-bronze and gilt — must become faceless foliage/wing forms); fluted pilasters with stacked block capitals on the left stone wall (shallow relief); stair-newel posts with square caps; arched niche/doorways under dais with roll-moulded frames (medium relief).
- **Edges & profiles:** semicircular iron arches on slim columns with ring capitals; curved bullnose stair nosings on a fan of semicircular steps (stairs widen downward, curved risers); polished brass handrails following stair curve and catching a hot specular line; cornice ring at the base of the dome with stepped moulding; dais top edge with a ribbon moulding; gilt piping along handrail edges.
- **Surfaces & materials:** polished cream marble steps with soft reflections; glossy marble floor; dark wrought iron/bronze; gilded brass; red velvet throne upholstery with gold embroidery; warm sandstone walls; pale plaster dome; large clear glass panes (window wall) letting hazy sunlight in.
- **Objects:** throne (tall-backed, canopy finials); dais/platform with curved rail; grand bifurcating fan staircase; brass handrails; newel posts; winged pedestal sculptures; iron-framed glazed pavilion/rotunda; background domed towers and arched aqueduct-bridge; side balcony railings.
- **Lighting/FX details:** strong back-light through windows, sun flare at column tops, haze/aerial perspective on distant city, gold specular glints on rails and throne, soft bounce light on marble.
- **Build components:**
  - Iron Whiplash Spandrel Panel — Blender mesh (curve-to-mesh scrolls) with roundel rosette — ballroom window wall / conservatory pavilion
  - Fan Staircase with Curved Bullnose Steps — Blender mesh — ballroom/throne-room entry
  - Gilded Throne with Sunburst Back — Blender mesh + normal map for embroidery — throne/birthday seat in ballroom
  - Diagonal Marble Chequer Floor — shader (procedural checker + roughness variation + reflection) — ballroom/halls
  - Curved Brass Handrail with Gold Piping — Blender mesh (curve) + metal shader — ring walkways, stairs
  - Gored Ribbed Ceiling Dome — Blender mesh + normal map — rotunda/pavilion

### U272
- **Patterns:** stone balustrade with repeating turned vase balusters (double-bellied, Tuscan profile); dentil course under the brick building's cornice; corbel-table / arched brick frieze along the right building's string course; round-arched arcade of the colosseum (stacked arcade tiers with engaged half-columns); terracotta pantile/Roman tile roofs (repeating barrel tiles); running-bond brickwork; louvered shutter slats (horizontal repetition); square stone floor flags; rhythmic pier colonnade (ruined, standing in water).
- **Carvings & relief:** loggia piers with moulded capitals (Doric/Tuscan-like stacked block capitals with abacus and echinus) and plinth bases (medium relief); entablature over loggia with architrave fasciae and a shallow frieze, plus a cornice with small modillions; window surrounds with keystone-arched brick heads; Venetian-style campanile with arched belfry openings and pyramidal spire; gothic cathedral-castle in background with dense pinnacles, flying buttresses and crocketed spires (fully 3D); arched stone bridge in distance.
- **Edges & profiles:** cornice with ogee/cyma recta crown and overhang casting hard shadow; chamfered/stepped pier bases; rounded handrail cap on balustrade (bullnose top rail) catching sunlight; round-arched window heads with brick voussoirs; tall spires with pointed silhouettes; balcony plinth.
- **Surfaces & materials:** weathered limestone with chips and edge wear; red/orange brick with mortar recesses and ivy/moss; terracotta roofs; stucco facades in cream, ochre; wooden shutters (stained brown); green canal water with ripples and reflections; wooden mooring poles (bricole) in water; worn stone stairs with scattered leaves.
- **Objects:** balustrade railing; loggia/portico; gondolas (2) with red seats; mooring poles; wall lantern on bracket (iron wall-mounted lantern on right building); campanile towers; colosseum-like amphitheatre; ruined colonnade quay; arched bridge; planters with shrubs at rooftop edge; chimney pots; rooftop wooden altana/terraces; fallen leaves.
- **Lighting/FX details:** low warm sun, striped shadows of balusters across water and steps, water reflections and specular glints, distant atmospheric haze on castle, soft blue sky.
- **Build components:**
  - Turned Vase Baluster + Bullnose Rail Kit — Blender mesh (lathe), instanced — bridge railing, ring walkways, terraces
  - Loggia Pier with Tuscan Capital & Entablature — Blender mesh — castle courtyard arcades
  - Brick Corbel-Table Frieze / Dentil Course — normal map + trim sheet — town houses, outer walls
  - Louvered Shutter Window with Keystone Arch — Blender mesh + decal — village houses near moat
  - Gondola & Mooring Poles — Blender mesh — canal/moat waterways
  - Iron Wall Bracket Lantern — Blender mesh + emissive — streets, walkways
  - Baluster Shadow-Stripe Water — shader (planar reflection + ripple normal) — moat/canals

### U273
- **Patterns:** stained-glass dome with a ring of tall pointed ogee/lancet "flame" motifs in red-orange inside blue (radiating petal/flame pattern, segmented by gilt ribs into gores); horizontal bands of small rectangular glass panes forming a drum ring; fish-scale/diamond slate tiling on the lower half-domes (fine diamond-shingle texture); gilt rib lines on half-domes; merlon rhythm on the crenellated wall-walk (square merlons); arcaded loggia windows on bell tower; terracotta roof tiles on surrounding city.
- **Carvings & relief:** bell-tower belfry with paired pointed-arch openings, colonnettes, and a moulded cornice band with blind arcading (medium relief); tower crowned by a fish-scale-tiled ogee/bell-shaped cupola with small finial spikes and ball finials at corners; dome crowned with a gilt lantern/oculus ring; tall lancet windows with tracery on tower base (bar tracery, shallow-deep); stepped buttress pilasters on rotunda drum.
- **Edges & profiles:** gilded ribs along every dome gore catching light (gold edge piping); scalloped/stepped dome base; crenellations with square merlons and plain crenels; cornice mouldings on bell tower; pointed apse half-domes ringing a central dome.
- **Surfaces & materials:** colourful stained/leaded glass (cobalt, turquoise, red, amber) with gold leading; dark grey slate shingles; cream limestone tower; gilt metal ribs and finials; bronze bell; sandstone wall-walk; canvas awnings.
- **Objects:** large bronze bell in belfry; stained-glass rotunda dome; small glass-domed gazebo/kiosk (blue glass canopy on gilded arches) at left of rotunda; market stall awnings (red/blue canvas); cypress trees and small leafy trees in planters; crenellated wall walk; bunting/banner strings across the plaza; stairs.
- **Lighting/FX details:** bright daylight; glass dome has saturated refraction colours; gilt ribs sparkle; slight haze over city.
- **Build components:**
  - Stained-Glass Flame Dome — Blender mesh (gored dome) + emissive stained-glass shader with gilt rib piping — ballroom crown dome (glows at night)
  - Diamond Slate Half-Dome Apse with Gold Ribs — Blender mesh + normal map — chapels around main dome
  - Glass-Canopy Gazebo Kiosk — Blender mesh + glass shader — gardens, plaza
  - Belfry Tower with Bell and Fish-Scale Cupola — Blender mesh — castle bell tower
  - Square-Merlon Wall Walk — modular mesh — castle curtain walls
  - Bunting Strings — mesh/particle cloth — plaza/festival decoration

### U274
- **Patterns:** sandstone block coursing; shallow balustrade parapet with small arched/vase-shaped openings on the domed tower; fringe/zigzag pattern on the red carpet rug (bottom right); palm-frond leaf repetition; banded stone courses on tower.
- **Carvings & relief:** domed tower (copper dome) with arched openings set between round columns with simple cushion capitals; small statues/figures on the dome's parapet corners (must become veiled/faceless or urn finials) (fully 3D); wall-mounted iron bracket lamps with curved arms; recessed doorway with multiple receding roll-moulded arch rings (archivolt) (deep relief); rectangular slit windows.
- **Edges & profiles:** round arches; heavy overhanging timber eaves at top right; projecting cornice slabs; chipped plaster edges revealing stone; crenellated rooftop walls in background (rounded-top merlons).
- **Surfaces & materials:** stylised hand-painted look; terracotta-orange plaster over sand stone with worn patches; polished copper dome (warm metallic); sandstone paving tiles; wooden crates; carpet textile.
- **Objects:** circular glowing portal/pool ring (purple emissive floor disc with stone rim); palm trees; wall bracket lamps; hanging lanterns on wires (rope with suspended orbs/lamps); wooden crates; small bench/table; clay pot; carpet runner; banner panel on wall; antenna masts; staircase.
- **Lighting/FX details:** purple glowing floor circle (emissive with soft rim); warm sunlight, deep shadows; bright sky.
- **Build components:**
  - Glowing Floor Portal Ring — Blender mesh rim + emissive animated shader — teleport circles on ring walkways / plaza centre
  - Receding Archivolt Doorway — Blender mesh — castle side doors
  - Copper Dome Pavilion with Parapet Urns — Blender mesh + metal shader — garden pavilion
  - Wire-Hung Lantern Strings — mesh + emissive — between towers/streets
  - Worn Plaster-over-Stone Wall — shader (vertex-paint mask) — village walls

### U275
- **Patterns:** repeated golden domes; crenellation runs on outer walls; window rows; rectangular courtyard grid; parapets with small merlons.
- **Carvings & relief:** little detail visible (low-res aerial): square corner towers with domed tops; flat-roofed blocks with arched windows; small chimneys/stubs on roof (stepped).
- **Edges & profiles:** crenellated parapets with square merlons; rounded gold domes on drum bases; straight cornice lines.
- **Surfaces & materials:** sandstone, ochre stucco, polished gold domes (high specular), sand ground.
- **Objects:** palm trees; fortified palace compound; towers; gate; courtyard.
- **Lighting/FX details:** warm sun, gold dome highlights.
- **Build components:**
  - Gold Dome Cap on Drum — Blender mesh + gold PBR — tower tops
  - Square Corner Tower with Merlon Parapet — modular mesh — outer wall corners
  - Walled Courtyard Layout — level blockout reference — castle inner ward

### U276
- **Patterns:** open pointed (lancet) arcade bays with a greenish glazed/teal-lit interior (no visible jali in the arches); a tall vertical panel of diagonal lattice trellis on the right side wall (with climbing plants); horizontal stone banding; crenellation with stepped merlons on the dome base; herringbone/rectangular stone paving in plaza; striated sandstone bands on the pyramids/cones in background.
- **Carvings & relief:** octagonal pavilion with pointed arches on round columns with bulbous turned bases and simple capitals (fully 3D); gold dome on drum with a ring of small merlons/pinnacles; pilasters between arches; cornice blocks; stepped pyramidal merlon caps.
- **Edges & profiles:** pointed (lancet / slightly horseshoe-pointed) arches; round arch bridge-gate (segmental brick arch) at left; stair ramp; flat cornice ledges; stepped/crenellated rooflines.
- **Surfaces & materials:** sandstone and pinkish stucco; polished gold dome; teal-tinted glass/water reflection at base of right building; worn stone tiles; climbing vines.
- **Objects:** octagonal domed pavilion; trellis panel with vines; palm (fan palm fronds) on wall; wooden crate; stairs; arch gateway; pyramids and cones in background.
- **Lighting/FX details:** warm golden light, sun bouncing off gold dome, soft shadows.
- **Build components:**
  - Pointed Lancet Arcade Bay with Teal-Lit Glazing — Blender mesh + emissive glass — pavilion windows
  - Octagonal Domed Pavilion with Turned Columns — Blender mesh — garden centrepiece
  - Diagonal Lattice Trellis with Vines — mesh + alpha leaf cards — garden walls, Glowwood edges
  - Stepped Merlon Ring (dome base) — mesh — dome drums

### U277
- **Patterns:** small sawtooth/stepped merlons (miniature crenellation) along roof edges; alternating red and cream striped bands (ablaq-style banding) on walls; blind arcade of small round-arched windows in dome drums; repeated small domes; geometric diamond/quatrefoil inlay roundels in panels; stained-glass rosette (round wheel window) in a gable; balustrade parapets.
- **Carvings & relief:** large terracotta domes on windowed drums with ribbed lantern finials and tall spike finials; minarets/towers with stacked cylindrical stages, balcony rings and onion caps; large pointed-horseshoe arch gable framing a carved tracery window (deep relief); arched niches with relief panels; corner pinnacles; cornice ledges.
- **Edges & profiles:** stepped cornice with tiny merlon crest; horseshoe and pointed arches; ring balconies on towers; ogee-ish onion domes in blue with gold finials.
- **Surfaces & materials:** terracotta/copper domes (matte warm orange); cream marble trim; red stucco; cobalt-blue domes with gold finials; green copper dome (verdigris) on tower to right; turquoise sea.
- **Objects:** airship/zeppelin with sails and fins (steampunk); small flying craft; domed palace; minarets; garden terrace with planters and hedges; fountain/pool in courtyard; palm trees; colonnaded halls; people figures; balcony rails; sailing ship in distance.
- **Lighting/FX details:** bright afternoon sun, soft cloud sky, sea sparkle.
- **Build components:**
  - Mini-Merlon Crest Cornice — trim mesh/normal map — roof edges throughout castle
  - Ablaq Striped Wall Banding — shader/trim texture — palace wing walls
  - Windowed Drum + Terracotta Dome + Spike Finial — Blender mesh — secondary domes
  - Floating Airship (sail-winged) — Blender mesh + animated — night sky ambient vehicle over castle
  - Blue Onion Dome with Gold Finial — mesh — small turrets

### U278
- **Patterns:** carved frieze bands of repeating panels along the fortress wall (rectangular cartouche panels with floral/arabesque fill); stone jali (pierced lattice) balustrade with geometric grid openings along the bridge railing; dense oriental carpets with medallion-and-border designs, boteh/paisley, diamond lozenges and guard stripes; bulbous onion domes repeated; small chhatri kiosks; arcaded aqueduct bridge with round arches; ribbed dome surfaces (lotus petal base on dome necks).
- **Carvings & relief:** onion domes with lotus-petal finial collars and tall spire finials (kalash); minarets with ring balconies on corbels (fully 3D); fortress gate with a deep pointed iwan arch framed by a rectangular alfiz panel (deep relief); arched niche blind arcades along the wall; corner chhatris (small domed kiosks with pillars); string courses of carved panels (shallow relief).
- **Edges & profiles:** pointed/four-centred Mughal arches; bulbous onion silhouettes; corbelled balconies; chamfered octagonal turrets; flat parapets with small pinnacle turrets.
- **Surfaces & materials:** warm sandstone (red/buff) and pale marble domes; textile canopy fabrics (rust red, orange) with scalloped/fringed valances; carpets; dusty earth plaza; trees.
- **Objects:** carpets hung over railing (6+); market tents with scalloped fringed canopies; camels with saddle blankets (animal—just "figures"); figures; trees (broad canopy, neem/banyan-like); pierced stone railing; aqueduct; minarets; chhatris; gate.
- **Lighting/FX details:** pink-violet dusk sky, sun glow left with bloom, haze/god-light softening domes, warm rim lighting.
- **Build components:**
  - Onion Dome with Lotus-Petal Collar & Kalash Finial — Blender mesh — tower tops, palace domes
  - Chhatri Kiosk Turret — Blender mesh — wall corners, roof edges
  - Pierced Stone Jali Balustrade — Blender mesh (instanced panel) or alpha cutout — bridge railing, ring walkways
  - Hanging Carpet / Tapestry Cards — plane mesh + cloth decal textures — market, walls, ballroom
  - Scalloped Fringed Canopy Tent — Blender mesh + cloth shader — festival stalls
  - Carved Cartouche Frieze Band — normal map trim sheet — curtain walls

### U279
- **Patterns:** huge ornamental UI mandala ring overlay — concentric bands: outer diamond/square chain border, Greek meander/key band, interlaced lozenge-and-cross band (strapwork); stone balustrade with balusters; small onion-dome pavilions.
- **Carvings & relief:** palace with central ribbed onion dome and spire, corner chhatris with pillared openings; foreground pavilion with cusped arches and shaped pillar capitals; balustraded ghat terraces; small water pavilion with dome (fully 3D).
- **Edges & profiles:** cusped and pointed arches, cornice ledges, parapet balustrades with square posts, onion dome silhouettes.
- **Surfaces & materials:** warm sandstone; gold domes; still water reflections; violet atmosphere.
- **Objects:** water palace; domed chhatri pavilions; balustraded bridge/terrace; lamp posts along balustrade; trees (cypress-like); figure jumping (ignore); setting sun.
- **Lighting/FX details:** violet/purple dusk palette, golden rim light on palace, large glowing golden mandala ring as a magic sigil behind the palace (very usable as sky effect), sun bloom.
- **Build components:**
  - Golden Meander Mandala Sigil — shader/decal (animated emissive ring, rotating bands) — sky above castle, magic circles at portals
  - Water Palace Ghat Terrace with Balustrade — Blender mesh — moat edge/lake
  - Pillared Chhatri with Ribbed Dome — Blender mesh — water pavilions
  - Purple Dusk Sky Grade — post/sky shader — night-time world palette

### U280
- **Patterns:** repeated teal/verdigris onion domes; rows of glowing arched windows; crenellated/scalloped parapets (small pointed merlons) along walls; arcaded galleries; balustrade with turned balusters on stair; star sparkle dots in sky.
- **Carvings & relief:** large arched iwan portal with radiating voussoir/sunburst fan pattern in its hood (deep relief); minarets with balcony rings and pinnacles; towers with lantern-like glowing upper stages; small gazebo with glazed glowing panels on the water; column capitals on water-gate pillars (fully 3D).
- **Edges & profiles:** onion-dome silhouettes with spire finials; pointed parapet merlons; round towers; drum cornices with dentil-like bands.
- **Surfaces & materials:** red-orange sandstone; verdigris copper domes; glossy dark water; warm-lit glass windows; wooden boats.
- **Objects:** palace; glowing waterside gazebo/pavilion; lantern-lit boat landing; gondola-like boats (several); glowing floating lanterns; staircase with balustrade down to water; trees; minarets; mooring posts with lamp tops.
- **Lighting/FX details:** magenta-purple clouds, warm amber window glow and reflections on water, floating sparkles/fireflies in sky, rim-lit domes, light pools on water.
- **Build components:**
  - Sunburst-Fan Iwan Portal — Blender mesh + normal map — main castle gate
  - Glowing Glazed Water Gazebo — Blender mesh + emissive panels — moat/lake pavilion
  - Verdigris Onion Dome — mesh + patina shader — minaret caps
  - Lamp-Topped Mooring Posts — mesh + emissive — boat landings
  - Floating Sparkle Particles — particle — night sky over water
  - Window Emissive Atlas — shader (randomised lit windows) — distant city towers

### U281
- **Patterns:** stacked wooden balcony galleries with repeated slender posts and fretwork railings (havelis-style jharokha balconies) on the right building; arched window rows; tangled overhead wires (catenary lines) across the canal; ripple rings on water.
- **Carvings & relief:** white temple tower with a gilded onion dome on a ring of small pillared kiosks (chhatri ring), multi-tier balconies; small white domed kiosk at canal edge; carved wooden brackets under balcony floors (medium relief); arched doorway with pointed arch on right.
- **Edges & profiles:** onion dome silhouette with spike finial; deep overhanging wooden eaves (left building); balcony cornices; quay edge step.
- **Surfaces & materials:** whitewashed stucco; gilt dome; dark weathered timber; reddish brick/plaster; still blue-grey water with reflections; wet stone quay.
- **Objects:** canal; small boats/skiffs; mooring posts; overhead wires; palm trees; lamp/lantern at left; kiosk; temple tower; distant towers.
- **Lighting/FX details:** low sun behind clouds at upper left (backlight bloom, pink-orange cloud sky), mist over water, warm reflections, sun flare on eave.
- **Build components:**
  - Jharokha Timber Balcony Stack with Fret Rail — Blender mesh — canal-side houses, town ring
  - Gilded Onion Dome on Chhatri Ring — Blender mesh — temple/clock tower
  - Canal Mist Layer — particle/fog plane shader — moat at night
  - Hanging Wire Lines — curve mesh — village streets (could carry lanterns)

### U282
- **Patterns:** merlon parapet with notched square merlons on tower top; small square windows grid; brick stair-side walls (running bond, soft red brick); dashed carved quatrefoil/cross-shaped small openings in tower walls; banded string course.
- **Carvings & relief:** low detail: blocky tower with stepped setbacks; arched door and small arched window (shallow); square brick pillars capped by planters at stair heads (fully 3D).
- **Edges & profiles:** crenellated top with square merlons; flat cornice slabs; simple bevelled stair treads; rounded-top doorway.
- **Surfaces & materials:** stylised sandstone stucco; red brick; grass; terracotta planter pots; red cloth awning/sail on tower top; dark rocks.
- **Objects:** square tower house; stone staircase with brick cheek walls; large square planters (empty/terracotta); palm trees; banana-leaf plant; boulders; stepping stones; small awning/canopy; wooden balcony rail.
- **Lighting/FX details:** soft warm late light, hazy dunes, low contrast.
- **Build components:**
  - Brick Cheek-Wall Stair with Pillar Planters — Blender mesh — garden terraces leading to castle
  - Square Tower with Notched Merlons — modular mesh — small watchtowers
  - Tall Square Terracotta Planter — mesh — walkways, terraces

### U283
- **Patterns:** painted/inlaid floral "tree of life" motifs on plastered wall panels (symmetrical vase-and-branch pietra-dura style flowering shrub) between arches; arabesque border bands framing cusped arches; pierced stone jali balustrade on upper terrace and lower parapet (grid/rosette lattice); scalloped/multi-foil (cusped, Mughal) arches; fluted (vertical reed) column shafts; lotus-petal fountain basin edge (scalloped lobed rim).
- **Carvings & relief:** cusped multifoil arches (engrailed arches) with relief spandrel scroll borders (shallow relief); columns with fluted shafts, bulbous vase-shaped bases (kumbha) and bracketed capitals with pendant lotus — "Shah Jahan" style pillars (deep relief, fully 3D); upper-floor balcony brackets (corbels) carrying a balustrade; small baluster colonnettes either side of wall niche; tiered fountain with lobed basin and finial spout (fully 3D).
- **Edges & profiles:** cusped/scalloped arch outlines; deep projecting chhajja eave on corbels (sloping eave stone); balustrade top rail; stepped stair treads; lobed fountain rim.
- **Surfaces & materials:** lime-plastered lilac/grey walls with faded painted floral inlay; sandstone columns (dark, weathered); marble fountain; terracotta paving; climbing bougainvillea vines (magenta).
- **Objects:** two-tier fountain (lotus basin with central pedestal); flower beds (red roses/marigold-like flowers); bougainvillea climbers on columns; leafy trees; potted plants; stone steps; colonnaded veranda; daybed/cushions at left; upper terrace balustrade; small air-conditioner-like box on wall (ignore).
- **Lighting/FX details:** soft cool dusk/dawn light, dark foreground silhouetted columns, gentle sky light, no strong glow.
- **Build components:**
  - Cusped Multifoil Arch with Arabesque Border — Blender mesh + normal map — courtyard arcades, ballroom side bays
  - Tree-of-Life Painted Wall Panel — decal (alpha) with slight emissive option — courtyard walls, Glowwood shrine
  - Fluted Column with Vase Base and Lotus Bracket Capital — Blender mesh — veranda/colonnades
  - Lobed Lotus Fountain — Blender mesh + water shader — courtyard centre
  - Chhajja Eave on Corbels — mesh — wall tops above arcades
  - Bougainvillea Climber — leaf-card mesh/particles — columns, walls

### U284
- **Patterns:** gilded geometric lattice screens (Islamic/Ottoman strapwork lattice: interlaced ogival cells with quatrefoil-like nodes, gold on dark ground) filling the arch bays; rococo C-scroll and acanthus cartouche frieze in gold across the arch lintel with a central blue oval medallion; "Turkish baroque" shell/fan cartouches on blue-and-white panels below the screens (palmette shell with blue rays); diamond-mesh/carved coffered ceiling (fine grid of small carved panels, wooden), ribbed pendentive vault; tall blue-framed window with dense small carved grille (rows of small rectangular openings); lancet tracery in the door's upper grille (row of pointed lancets) over a carpet-like woven arabesque lower panel; arabesque scroll painting on arch spandrels; crackled marble veining on columns and floor.
- **Carvings & relief:** composite-like capitals with gilded acanthus/stalactite (muqarnas-ish) blocks and gold astragal rings (deep relief); gilded bronze collars at column bases; door surround of white marble pilasters with gilt rococo crest (deep relief); carved ogee arch; gilded rococo scroll frieze (deep relief, gilt); blue-framed panel with a carved cartouche and rosette; bench backs with scalloped crest rails; fountain with carved arcaded/cusped stalactite rims on each tier, octagonal base, and a ball-and-onion finial with carved diamond surface.
- **Edges & profiles:** four-centred/pointed arches with marble rolls; gold piping on capitals and column bands; scalloped and lambrequin-edged fountain basin rims (dripping water from each scallop); octagonal pool kerb; deep eave beams with gilt edge.
- **Surfaces & materials:** veined cream/grey marble columns (polished, glossy); gilded metal lattice; cobalt-blue painted wood frames; white marble; carved dark wood ceiling; pink stone fountain; turquoise water; red velvet bench cushions; wood benches with gold geometric trellis backs; cracked marble paving.
- **Objects:** two benches (sofa-benches with red cushions and a trellis/ogee-pattern backrest); stone urn/waste bin (cylindrical planter); three-tier wall/pedestal fountain in an octagonal pool; lattice screens; carved door; columns; rose bushes (pink), cypress tree, frangipani/plumeria-like tree, hosta-like broad-leaf plants, ivy; colonnade in background.
- **Lighting/FX details:** warm sun striking gold lattice so it glows (backlit lattice), soft shade under portico, water sparkles, bright green garden bounce.
- **Build components:**
  - Gilded Strapwork Lattice Screen — Blender mesh (thin) or alpha-cutout panel with gold metal shader, backlit emissive at night — ballroom bays, throne room screens
  - Rococo Gilt Scroll Frieze with Medallion — Blender sculpt baked to normal map + gold shader — arch lintels in ballroom
  - Blue-Frame Shell Cartouche Dado Panel — decal + normal map — wainscot in palace halls
  - Three-Tier Scalloped Fountain with Onion Finial — Blender mesh + water particles — garden courtyard
  - Trellis-Back Garden Bench with Red Cushion — Blender mesh — gardens, ring walkways
  - Carved Wooden Coffer Ceiling — normal map/parallax — portico ceilings
  - Veined Marble Column with Gilt Rings — mesh + marble shader — portico/ballroom colonnade

### U285
- **Patterns:** terraced garden tiers with repeated arched niches and arcade bays at each level; stepped crenellation/merlon edging on top of terraces; ribbed fluted pilaster shafts; fluted bowl (gadrooned planter) at right; carved guilloche/rosette band on capital.
- **Carvings & relief:** pilaster/column with gadrooned (fluted) capital bowl planter on top and a carved rectangular block capital with rosette/geometric panels (medium relief); arcades of round arches with pilasters along terraces; stepped ziggurat-style tower with garden; colonnade ruins on distant left.
- **Edges & profiles:** round arches; stepped-back terraces; square merlons/crenels at edges; gadrooned bowl lip.
- **Surfaces & materials:** stylised pink/mauve sandstone; sand-gold column; turquoise water pool; lush greenery.
- **Objects:** hanging gardens; waterfalls/cascades spilling from terraces (several); pool; palm trees; ferns; bromeliad/red torch ginger flowers; flowering hanging baskets (red, pink, yellow); flying white birds (doves—ambient); stone steps; carved planter column.
- **Lighting/FX details:** bright morning light from upper left, haze, cascading water glints.
- **Build components:**
  - Terrace Cascade Waterfall — mesh + flow-map shader + mist particle — Glowwood terraces / castle gardens
  - Gadrooned Bowl Planter on Column — Blender mesh — ring walkways, terraces
  - Arched-Niche Terrace Wall — modular mesh — hanging garden tiers
  - Overflowing Flower Cascade — leaf-card mesh — planters and balconies

### U286
- **Patterns:** Chinese lattice railings (geometric fretwork with square/rectilinear "cracked-ice"/key-like lattice) along balcony; carpet with circular medallion and key-fret border on floor (dark blue); upturned-eave pagoda roofs repeated; roof tile ridges (barrel tiles); tassel fringes.
- **Carvings & relief:** carved wooden armchair with lattice back panel (medium relief); red lacquer columns; dragon sculpture in garden (silver/stone, fully 3D — avoid face, use as serpentine shape or omit); pagoda with stacked eaves and ridge ornaments; table with scroll-carved legs.
- **Edges & profiles:** swept-up flying eaves; red lacquered handrail; lattice baluster panels; roof ridge finials.
- **Surfaces & materials:** red lacquer wood (glossy), dark wood, silver/porcelain-blue metal (fruit stand), gold accents, purple silks, green garden.
- **Objects:** low red table; footed metal fruit stand (tazza) with fruit; ornate covered dish/porcelain box; tray of sweets; carved armchair; hanging cylindrical ornament/lantern with tassels; pagodas; garden dragon statue; seated figure; fireworks in sky; red railing.
- **Lighting/FX details:** sunset glow, fireworks bursts (white/pink), warm rim lights, purple sky.
- **Build components:**
  - Fretwork Lattice Railing Panel — Blender mesh/alpha — balcony railings (could be variant on ring walkways)
  - Firework Burst — particle system — night sky celebrations
  - Footed Tazza with Fruit — mesh — banquet tables in ballroom
  - Tasselled Hanging Lantern — mesh + cloth tassels — pavilion ceilings

### U287
- **Patterns:** strings of round red lanterns (string lights) along a gate lintel and across background; repeated upturned eave tiers on pagodas; rows of glowing arched/rectangular windows on each tier; cracked flagstone ground (Voronoi-like crack pattern); rope with paper streamers (shimenawa-like rope with zigzag paper strips) on fence.
- **Carvings & relief:** paifang/torii-style ceremonial gate with red lacquer pillars on stone bases, gold rings on columns, double-tier curved roof, gold ridge-end ornaments, central name plaque with gold frame (fully 3D); multi-tier pagoda tower (6 tiers) and 3-tier pavilion with railing balconies; floating crystal-like rock shards.
- **Edges & profiles:** swept flying eaves with sharp upturned corners; stone plinth bases; gold ring bands on columns.
- **Surfaces & materials:** dark slate roof tiles, red lacquer wood, gold trims, glowing orange paper windows, dark purple-red rock, cracked earth.
- **Objects:** ceremonial gate; pagodas; floating rocks/islets (sky islands); rubble/rock pile; stone lanterns (toro, with glowing yellow tops) along a fence; wooden fence rails; glowing tree with golden-yellow foliage (ginkgo-like); dead bare tree; lantern strings; moon.
- **Lighting/FX details:** red-tinted fire haze, glowing window emissives, floating ember particles, warm glow from stone lanterns, golden-glow tree.
- **Build components:**
  - Floating Rock Shard Islands — Blender mesh — sky around castle (floating islands)
  - Ceremonial Pillar Gate with Lantern String — Blender mesh + emissive orbs — entrance to Glowwood / festival grounds
  - Stone Post Lantern (glowing cap) — mesh + emissive — garden path edges
  - Golden-Glow Tree — mesh + emissive leaf shader — Glowwood accent trees
  - Ember Particles — particle — magical atmosphere

### U288
- **Patterns:** stacked hip-and-gable roofs with karahafu curved (cusped) gables; repeating small square lit windows; stylised swirl/scroll clouds; halftone dot texture in sky; scrolled foliage tree canopies (swirl brush shapes).
- **Carvings & relief:** Japanese castle keep (tenshu) with layered roofs, chidori triangular dormer gables and curved karahafu gables, shachihoko-like ridge-end ornaments (fully 3D); white plastered walls with dark base.
- **Edges & profiles:** upward-curving eave corners; triangular and bell-curve gables; tapered stone base walls (battered).
- **Surfaces & materials:** stylised pastel plaster, pink-lilac roofs, warm lit windows, purple foliage.
- **Objects:** two castle keeps; mountain (snow-capped volcano); trees with glowing lanterns hidden in canopy (round paper lanterns); sun.
- **Lighting/FX details:** violet dusk, golden sun behind keep, lanterns glowing amber within purple trees, halftone glow.
- **Build components:**
  - Swirl-Canopy Glow Tree with Hidden Lanterns — mesh + emissive orbs — Glowwood
  - Bell-Curve (karahafu) Gable Dormer — mesh — tower dormers variety
  - Lit Window Emissive Grid — shader — castle tower windows at night

### U289
- **Patterns:** shoji-style rectangular lattice windows (grid of small panes) on walls; round moon-window (circular opening) frame; bamboo trim border along top; cherry blossom (sakura) petal motif along bottom border; wooden floor planks; hanging scroll paintings.
- **Carvings & relief:** circular moon window with thick wooden ring frame (deep); exposed timber beams; low-relief nothing else.
- **Edges & profiles:** round-moulded circular window frame catching sunset glow on its inner edge; plank floor edges.
- **Surfaces & materials:** warm wood, rice-paper panes glowing, ceramic teapots (celadon, bronze), lacquered tray, silk cushions.
- **Objects:** red paper lanterns (cylindrical, hanging, glowing — at least 6); small standing floor lantern (andon); candle lantern; low round tea table; teapots and kettle; teacups; sushi tray; sake bottles and jars; potted cherry-blossom bonsai trees; flowering branches in vases; side tables/shelves; framed hanging scrolls; floor cushions (zabuton); small bonsai tree in window view; mountain; giant gnarled tree outside.
- **Lighting/FX details:** orange sunset streaming through moon window, lantern glows (warm orange), falling sakura petals in frame, soft interior haze.
- **Build components:**
  - Moon Window with Ring Frame — Blender mesh — tea room / reading nook in castle, ring walkway viewpoints
  - Cylindrical Paper Lantern Cluster — mesh + emissive — interiors, Glowwood
  - Tea Service Set (teapot, cups, kettle) — mesh — birthday tea party table
  - Potted Blossom Tree — mesh + leaf-card petals + petal particles — interiors, gardens
  - Falling Petal Particles — particle — gardens

### U290
- **Patterns:** irregular ashlar/rubble block masonry; voussoir-arched doorways (radiating wedge stones); blind arched niches (pair) on ruin top; stacked stepped temple roof; moss patches on stones; stepping-stone pads in water (circular).
- **Carvings & relief:** ruined arched gateways with engaged pilasters with simple block capitals and square pillars carved with vertical channel; horn-like broken roof crest blocks; stepped cornice tiers; small wooden shrine box (miniature house shrine) on ground.
- **Edges & profiles:** round arches of wedge voussoirs with keystone; chipped/eroded block edges; stepped tiers.
- **Surfaces & materials:** grey-brown weathered stone with moss and grass; clear blue water; wood.
- **Objects:** ruined jungle temple gates; waterfalls (small cascades); round stepping stones; boulders; ferns, monstera/broad-leaf plants, palm and tree-fern fronds, vines/lianas, jungle trees; tiny wooden shrine/lantern box; stone planters.
- **Lighting/FX details:** dappled jungle light, misty depth haze, water sparkles.
- **Build components:**
  - Mossy Ruined Arch Gate — Blender mesh + moss shader (top-facing mask) — Glowwood ancient ruins
  - Round Stepping Stone Pads — mesh — Glowwood streams
  - Small Wooden Spirit Shrine Box — mesh + emissive inside — Glowwood paths
  - Fern/Monstera Leaf Card Set — mesh — Glowwood undergrowth

### U291
- **Patterns:** glyph-panel relief — rectangular blocks covered in squared-spiral glyph cartouches (Mesoamerican-style blocky glyphs, stepped frets/"xicalcoliuhqui" step-fret spirals); stepped corbel-vault crest; repeating rectangular block masonry; vertical glyph columns on door jambs; carved serpent-scroll volute blocks along the pediment edge.
- **Carvings & relief:** temple door frame with deep-relief glyph-carved jambs and a central round medallion (spiral roundel) over the lintel; a stepped/trapezoid pediment of glyph tiles framed by rolled volute blocks ("cushion" scrolls) on both shoulders (deep relief); corner pilasters with stacked rectangular panels; side doorways with plain stepped frames; fallen stelae/slabs with grid carvings (deep relief); stepped pyramid-roof towers (prang-like).
- **Edges & profiles:** stepped corbelled outlines (ziggurat silhouette); rounded eroded block edges; stair with chamfered treads; plinth mouldings at jamb bases.
- **Surfaces & materials:** grey-green weathered stone heavily mossed; dark interiors; damp flagstones in red-grey; lianas.
- **Objects:** ruined temple; toppled carved slabs; stone steps; hanging vines and aerial roots; giant tree trunks framing; broad-leaf jungle plants (philodendron, banana), ferns, grasses; misty forest trees.
- **Lighting/FX details:** volumetric mist, soft cool god-light from above, green ambient, deep shadows in doorways.
- **Build components:**
  - Glyph-Carved Door Jamb & Medallion Lintel — Blender mesh + normal map (glyph tile atlas) — Glowwood ancient shrine
  - Volute-Shouldered Stepped Pediment — Blender mesh — ruin gateways
  - Toppled Carved Stele Slabs — mesh (3–4 variants) — Glowwood floor scatter
  - Hanging Liana Vines — curve mesh + leaf cards — Glowwood canopy
  - Moss-Top Stone Shader — shader (world-normal mask) — all ruins

### U292
- **Patterns:** honeycomb/hexagram lattice screens (interlocking hexagon-and-star cells — a hexagonal "star-and-hexagon" mashrabiya grid) in tall framed panels; diagonal diamond lattice (trellis) in the upper horseshoe-arch tympana; zellige-style dark green tile dado inside a niche; lily pads on pool; rubble stone (ashlar-ish) texture on piers above capitals; twisted/spiral (Solomonic) column shaft.
- **Carvings & relief:** horseshoe/Moorish arches with lobed/scalloped intrados (polylobed arches) springing from slim marble columns with block-impost capitals (cubic, Nasrid-style) and ring astragals (deep relief, fully 3D columns); one barley-twist (spiral fluted) column; arched wall niche with small basin/fountain spout; small brass lanterns on ledges.
- **Edges & profiles:** horseshoe arches with polylobed edges; square pier impost blocks; stair treads; pool kerb with rounded edge.
- **Surfaces & materials:** whitewashed/limestone rough stone; wooden lattice (weathered grey-brown); ochre/mustard cloth drapes; terracotta pots; brass metal lanterns; dark green glazed tiles; pool water with reflections; stone bowl.
- **Objects:** reflecting pool with pink lotus/water-lily flowers and lily pads; large fluted stone basin/shallow scalloped bowl fountain (shell-shaped) at pool edge; brass Moroccan lanterns (domed top, pierced) on the ground; terracotta jars and pots (amphora-like); round leather poufs/cushions; low wooden side tables; wooden ladder; hanging fabric drapes over arches; climbing jasmine (white flowers); monstera, cordyline, palms; wall niche fountain with basin.
- **Lighting/FX details:** warm side-light, soft sun through lattice making patterned shadows, water reflections, shallow depth-of-field.
- **Build components:**
  - Hexagram Mashrabiya Lattice Panel — Blender mesh (instanced cell) or alpha-cutout + shadow-casting — courtyard screens, ring walkway balustrade infill
  - Polylobed Horseshoe Arch on Cubic-Capital Column — Blender mesh — lily-pool courtyard arcade
  - Lotus Reflecting Pool — mesh + water shader + lily pad cards + lotus mesh (emissive petals at night) — garden courtyard/Glowwood ponds
  - Pierced Brass Domed Lantern (floor) — mesh + emissive with cookie projection — courtyards, ballroom terraces
  - Hanging Drape Cloth over Arch — cloth-sim baked mesh — courtyard arches
  - Scalloped Shell Basin — Blender mesh — pool fountains

### U293
- **Patterns:** ashlar sandstone coursing with irregular block sizes; vertical bar balcony railings (iron); timber trestle framing with diagonal braces (X/angled struts); paving of irregular flagstones (crazy paving); pantile awnings over doors.
- **Carvings & relief:** round-arched gate with radiating voussoirs and a projecting keystone, plus a carved relief crest/emblem above (shallow-medium relief, appears to be a crossed design); triple slender lancet windows (blind-ish lancets with blue-grey shutters) on wall; carved impost blocks; round tower with small lancet slit windows; arched iron grille gate on right with fan pattern.
- **Edges & profiles:** stepped/rounded arch rings; projecting stone cornice ledge with moulding; tiled lean-to pent roofs on brackets over doors; tower cornice band.
- **Surfaces & materials:** warm sandstone, mossy joints; purple-grey painted timber; wrought iron; terracotta pots.
- **Objects:** timber-stilted balconies with staircases; potted succulents/agave on balcony ledges and planter boxes; wooden crates; brick pile (stacked bricks); planks; tumbleweed/dry shrubs; agave plants; dry grasses; awning hoods; iron arch gate; banner/flag partially visible top.
- **Lighting/FX details:** warm daylight, crisp shadow stripes on steps, light haze.
- **Build components:**
  - Timber Stilt Balcony with Iron Bar Rail — Blender mesh — village houses beneath castle
  - Keystone Round-Arch Gate with Crest Relief — Blender mesh + normal map — secondary castle gates
  - Pent-Roof Door Hood on Brackets — mesh — doorways
  - Arched Iron Fan Grille Gate — mesh (curve) — garden entrances

### U294
- **Patterns:** mashrabiya wooden screen (bay window with fine turned-wood lattice) on upper façade; paired round-arch windows with colonnette (biforate window) on tower; ashlar stone coursing; stepped stair blocks.
- **Carvings & relief:** pointed (Fatimid/Mamluk-style) arched gateway with recessed arch rings (deep relief); biforate window; corbel brackets supporting projecting wooden bay; minaret top with tiered balcony and onion bulb at right background.
- **Edges & profiles:** pointed arch; projecting timber cornice; stair cheek walls with sloping copings.
- **Surfaces & materials:** weathered limestone with ivy; dark timber; dusty ground; canvas awning edge.
- **Objects:** wooden crates and boxes, planks, market table, stacked goods, palm tree, stairs (two flights), ivy, minaret, awning.
- **Lighting/FX details:** bright day, warm sun, deep shade under awning.
- **Build components:**
  - Projecting Mashrabiya Bay Window on Corbels — Blender mesh + alpha lattice — village/castle upper windows
  - Biforate Round-Arch Window with Colonnette — mesh — tower windows
  - Market Crate & Plank Prop Set — mesh — market/festival area

### U295
- **Patterns:** stepped/sawtooth merlons (Islamic-style stepped crenellation) along roof edge at upper left; round arches arcade; orange-and-white striped banner/awning; ribbed copper-ish dome segments in background; grille vents on tower.
- **Carvings & relief:** arcade with round arches on slim columns with lotus/vase capitals (medium); domed kiosks; arched doorway with heavy surround.
- **Edges & profiles:** stepped merlons, round arches, chunky cornices with bevelled edges; overhanging canopy.
- **Surfaces & materials:** stylised sandstone, terracotta plaster, metal machinery (industrial tower — off-theme), striped fabric.
- **Objects:** arcade; vertical banner; metal mechanical tower (sci-fi, ignore); wall lamps; crates; palm; stall canopy; ramps; planters. (Screenshot frame of window UI around image.)
- **Lighting/FX details:** bright daylight, flat.
- **Build components:**
  - Stepped (Islamic) Merlon Crest — modular mesh — castle parapets variant
  - Slim Lotus-Capital Arcade Column — mesh — courtyard arcade
  - Striped Hanging Banner — cloth mesh — festival streets

### U296
- **Patterns:** (off-theme modern city) only usable: autumn tree canopies (orange maple/ginkgo); striped shop awnings; rounded building corners with bands of windows.
- **Carvings & relief:** none of note; a giant mascot sculpture on roof (ignore/no face).
- **Edges & profiles:** rounded corner building with curved fascia bands; awning scallops.
- **Surfaces & materials:** stylised painted plaster, glass, neon signs.
- **Objects:** autumn trees; awnings; billboards (ignore); street lamps; cars.
- **Lighting/FX details:** bright daylight.
- **Build components:**
  - Stylised Autumn Canopy Tree (orange) — mesh + leaf cards — Glowwood seasonal variant
  - Scalloped Shop Awning — mesh — market stalls

### U297
- **Patterns:** (off-theme modern city) usable: honeycomb hexagon glowing panels (three hexagonal amber light tiles) and a dripping-honey edge profile; rounded-corner orange cladding.
- **Carvings & relief:** none relevant; signage cut-outs (bee — ignore).
- **Edges & profiles:** "dripping" wavy edge on canopy soffit (melted honey silhouette); rounded square frames.
- **Surfaces & materials:** glossy orange painted panels, dark metal frames, small inset LED strip lights.
- **Objects:** hexagonal light panels; signs; billboard; roof sculptures (ignore).
- **Lighting/FX details:** warm amber emissive hexes.
- **Build components:**
  - Glowing Honeycomb Hex Tiles — mesh + emissive — Glowwood fairy shop/bee hive props
  - Dripping-Edge Soffit Trim — mesh — sweet shop/candy stall canopies (birthday theme)

### U298
- **Patterns:** (off-theme neon city) usable: koi-shaped glowing holographic signs (pink/magenta); stacked window grids; purple night palette.
- **Carvings & relief:** none relevant.
- **Edges & profiles:** rounded tower corners; stepped skyline silhouettes.
- **Surfaces & materials:** neon emissives, glass, painted metal.
- **Objects:** neon fish holograms; trees; staircase; street lamp; cars (ignore); vending items.
- **Lighting/FX details:** strong magenta/purple night grade, glowing signage with bloom, light falloff.
- **Build components:**
  - Floating Glowing Koi Spirit — emissive mesh + bloom, animated swim path — night sky over moat / Glowwood ponds
  - Purple Night Bloom Grade — post-processing — overall night palette reference

### U299
- **Patterns:** (off-theme city plaza) usable: palm trees in long raised planter with curved coping; cylindrical planter column topped with shrubs; stripe kerb (red/white) edging.
- **Carvings & relief:** none of note; small kiosk with pyramid roof.
- **Edges & profiles:** rounded planter coping; cylindrical columns with flared tops.
- **Surfaces & materials:** stone, glass, emissive screens.
- **Objects:** palm trees; raised planters; kiosk/booth; columns with planter tops; road.
- **Lighting/FX details:** dusk sky, purple-blue grade, city lights.
- **Build components:**
  - Long Raised Planter with Curved Coping — mesh — ring walkways/plaza edges
  - Column-Top Planter (flared cap) — mesh — gate approach

### U300
- **Patterns:** (off-theme futuristic city) usable: curving elevated ribbon road with glowing light strips (light-trail lines); grid of lit windows.
- **Carvings & relief:** none.
- **Edges & profiles:** sweeping curved roadway edges with emissive edge lines; stepped tower setbacks.
- **Surfaces & materials:** cool blue-teal metal and glass, magenta and cyan emissives.
- **Objects:** elevated curved road; towers; dark shrub/bush in foreground; signs (ignore).
- **Lighting/FX details:** cyan/teal night, pink-orange light trails, glow fog.
- **Build components:**
  - Emissive Edge-Strip on Curved Walkway — shader (UV-scrolling glow line) — ring walkways at night
  - Light-Trail Ribbon — shader/particle trail — magical flow along bridges

### U301
- **Patterns:** (off-theme voxel neon city) usable: grids of small lit windows; stacked horizontal neon edge strips on rooftops.
- **Carvings & relief:** none.
- **Edges & profiles:** blocky stepped rooftops with emissive edge lines (cyan, orange).
- **Surfaces & materials:** dark matte blocks, neon emissives, low clouds with lights.
- **Objects:** flying car/vehicle; floating cloud banks below; billboards (ignore); rooftop platforms.
- **Lighting/FX details:** cloud layer lit from below, cyan searchlight beam rising from clouds, rain streaks, dark blue night.
- **Build components:**
  - Low Cloud Sea Below Castle — volumetric/billboard cloud shader — around floating castle base
  - Rising Light Beam from Clouds — shader (additive cone) — magical beacons

### U302
- **Patterns:** (off-theme voxel cyberpunk city) usable: regular lit-window grids (warm yellow + cyan), horizontal neon bands, rain streaks.
- **Carvings & relief:** none.
- **Edges & profiles:** blocky skyscraper setbacks with neon cap lines; elevated walkways/bridges.
- **Surfaces & materials:** dark matte voxel facades, glowing screens, wet surfaces.
- **Objects:** flying car; elevated sky bridge walkways with small trees; rooftop helipad; billboards (ignore); street lamps.
- **Lighting/FX details:** heavy rain, volumetric fog light shafts beside the flying car, cloudy night sky lit blue, neon bloom.
- **Build components:**
  - Rain Particle + Wet Sheen — particle + shader (optional weather) — whole world
  - Volumetric Light Shaft — shader (additive cone/plane) — lanterns through mist
  - Sky Bridge with Trees — layout reference — ring walkways between towers

### U303
- **Patterns:** (off-theme futuristic skyline) usable: searchlight beams fanning up into the sky; dense window grids; vertical emissive strips on towers.
- **Carvings & relief:** none.
- **Edges & profiles:** tall needle-like tower silhouettes.
- **Surfaces & materials:** dark glass, cyan-white emissive.
- **Objects:** towers; flying craft; billboards (ignore).
- **Lighting/FX details:** many vertical searchlight beams (cool white-blue), lens flare, deep blue night.
- **Build components:**
  - Sky Searchlight Beams — additive cone shader, slowly sweeping — birthday celebration beams from castle towers
  - Lens Flare/Bloom pass — post — lantern highlights

### U304
- **Patterns:** (off-theme cyberpunk city) usable: vertical neon edge lines down tower corners; glowing orb (sphere) on a tower top.
- **Carvings & relief:** none.
- **Edges & profiles:** stepped towers with lit edges.
- **Surfaces & materials:** dark blue glass, neon (pink, cyan, yellow), haze.
- **Objects:** glowing moon-like orb atop tower; towers; signs (ignore).
- **Lighting/FX details:** blue haze/fog layer, neon bloom, glowing orb.
- **Build components:**
  - Tower-Top Glowing Orb — mesh + emissive + bloom — spire finials of the castle
  - Height Fog Gradient — shader/post — night depth

### U305
- **Patterns:** curved wrought-iron fence of vertical bars with looped tops (hoop-top railing) following curved paths; tall narrow arched windows with small rectangular glazing bars (multi-pane); cloud-pruned topiary (niwaki/"pom-pom" trees with flat cloud pads); glowing edge strips on walkways; dome roofs with standing-seam ribs.
- **Carvings & relief:** large armillary sphere sculpture (nested iron rings around a glowing red-orange sun orb, with small planet spheres on rings) on a round plinth (fully 3D); art-nouveau/retro-future buildings with rounded corners, ribbed metal domes, finials; balcony brackets; tall arched window surrounds with mullions (medium relief).
- **Edges & profiles:** rounded bay towers with domed caps; curving railing top lines catching light; projecting cornice bands with emissive under-edges; grand stair.
- **Surfaces & materials:** brushed/painted metal domes (silver), brick-red and sage stucco, dark iron, emissive strips (cyan, orange), grass lawns.
- **Objects:** armillary sphere fountain/monument; curved iron fences enclosing lawns; cloud-pruned bonsai trees in large planters; street lamps (twin-globe lamp posts); street signpost; benches; bins; potted plants; café umbrella/parasol; hanging neon sign; flying ship (ignore); grand staircase; figures.
- **Lighting/FX details:** orange glowing core orb, soft overcast warm sky, neon accent strips under ledges.
- **Build components:**
  - Armillary Sphere with Glowing Sun Core — Blender mesh (rings + orb) + emissive, slow ring rotation — central plaza / castle courtyard centrepiece
  - Hoop-Top Curved Iron Railing — curve-array mesh — garden lawns, ring walkways
  - Cloud-Pruned Topiary Tree in Planter — mesh + leaf-pad clusters — courtyard/ballroom terrace
  - Twin-Globe Lamp Post — mesh + emissive — plaza, bridges
  - Under-Ledge Emissive Strip — shader — ledges at night

### U306
- **Patterns:** repeated stacked chevron/slat canopies (layered teal-glowing horizontal fins, pagoda-like) on pavilions; brick/stone block bases; concentric ring paving on round plaza with radial vents/grilles; ribbed onion/bell domes on towers; arched aqueduct-like overhead bridges.
- **Carvings & relief:** twin gate pavilions with green-bronze half-domes and red upswept torii-like beams spanning between them (fully 3D); glowing teal lanterns on posts and on tower tops; stepped stair with cheek walls.
- **Edges & profiles:** upswept beam ends (torii curve); layered louvre fins with glowing edges; circular plaza rim with bevel step.
- **Surfaces & materials:** bronze domes, red lacquer beams, teal emissive glass, stone, grass.
- **Objects:** circular landing pad/plaza (dial-like with segmented ring); gate pavilions; teal lantern posts (cube lanterns); shrubs and round topiary trees; stair; distant spires and domes, overhead walkways; character figure (ignore).
- **Lighting/FX details:** daylight with teal emissive accents; atmospheric blue haze on distant city.
- **Build components:**
  - Concentric Segmented Ring Plaza Floor — Blender mesh + emissive inlay — portal plaza / arrival pad at castle gate
  - Teal Glow Cube Lantern on Post — mesh + emissive — paths, stairs
  - Layered Glowing Fin Canopy — mesh + emissive edges — gate pavilions
  - Upswept Twin-Beam Gate — mesh — Glowwood entrance

### U307
- **Patterns:** tall narrow round-arched windows with blue stained/tinted vertical glazing (ribbed vertical lines); vertical garden (living wall) panels in cylindrical glass towers; layered stacked planters along terraces; lily pads on round pond.
- **Carvings & relief:** cylindrical pavilion with mushroom-cap/saucer roof, ribbed vertical fins framing green living-wall panels (fully 3D); arched portal openings with deep reveals; roof gardens with trees.
- **Edges & profiles:** soft rounded edges everywhere (bevelled); saucer-shaped domes with overhanging lips; deep arch reveals with warm inner glow.
- **Surfaces & materials:** white/cream plaster, blue-painted trims, frosted blue glass, polished metal domes, greenery.
- **Objects:** living-wall columns; saucer-domed kiosk; round lily pond; planters with hedges; street lamps (curved arm); van (ignore); trees on rooftops; stairs.
- **Lighting/FX details:** bright daylight, warm glow inside arch, blue window tint.
- **Build components:**
  - Living-Wall Pillar with Saucer Cap — Blender mesh + foliage texture — Glowwood transition, garden plaza
  - Tall Arched Blue Glazed Window with Vertical Ribs — mesh + glass shader (emissive at night) — castle tower windows
  - Round Lily Pond with Pads — mesh + water shader — gardens

### U308
- **Patterns:** fine trellis/lattice star-pattern (tiny diamond/girih-like grid) printed on the giant golden flower canopy; leaf/arch-shaped emerald ogee panels around the canopy's underside hub (ring of pointed-arch "petal" lights); tiled pantile roofs (terracotta, blue-tinted in night); triangular faceted glass panels (pink) on left building; mosaic tile walls (small square tesserae) on left; zellige blue patterned panels on the gate building; Moorish horseshoe arches; green glazed tile roofs on corner towers with crenel-points; pointed-arch slit windows.
- **Carvings & relief:** minaret with arched balcony stages, crenellated cornice, horseshoe-arched openings, stacked shafts (fully 3D); giant umbrella/flower canopy (inverted ribbed parasol on mast, like a 'Medina umbrella') with gilt ribs; gate building with flared, uplit sail-shaped buttresses with green ogee caps; large pointed horseshoe portal with muqarnas-like hood; monolith tower with circular orb studs and gold edge piping (sci-fi).
- **Edges & profiles:** ogee-pointed petal shapes at buttress tops; horseshoe arches; scalloped canopy rim between ribs (umbrella scallop); gold ribs catching light; flared buttress silhouettes.
- **Surfaces & materials:** gold fabric/metal canopy with warm uplighting; blue-green glazed tiles; warm stucco; glass; emissive panels; terracotta roofs.
- **Objects:** umbrella canopy on minaret; minaret; gate building; floating crescent rings / hoops in sky (two arc pieces); cyan light ribbon/zipline in sky; palm fronds; satellite dish (ignore); full moon with sparkly lacy surface; stars; tower with orb studs.
- **Lighting/FX details:** uplighting washing the flared buttresses (wall-wash cones), gold canopy glowing from beneath, cyan glowing ribbon streaks across the sky, star sparkle dots, luminous moon with soft halo, blue night grade.
- **Build components:**
  - Giant Golden Lotus/Umbrella Canopy on Mast — Blender mesh (ribbed, scalloped) + lattice normal map + underside emissive — top of ballroom tower / festival plaza centrepiece
  - Flared Uplit Sail Buttress with Ogee Cap — Blender mesh + wall-wash light cone decal — castle gate façade
  - Sky Light Ribbons — shader (scrolling emissive ribbon mesh) — magical lines linking towers over castle
  - Floating Crescent Ring Pieces — mesh + metallic shader, slow bob — sky decoration
  - Green Glazed Tile Turret Roof — mesh + tile normal map — corner turrets
  - Lacy Glowing Moon — sky shader (moon texture + halo) — skybox

### U309
- **Patterns:** French/Italian façade rhythm: pedimented window surrounds (alternating triangular and segmental), louvered shutters, wrought-iron balconettes with scroll bars, rusticated ground floor banding, dentil/modillion cornices; stone balustrades with turned balusters on balconies; curved cobblestone (fan pattern / sett paving) road with kerb; tiled planter edging.
- **Carvings & relief:** Morris column (advertising column) with domed cap, bands, and glowing poster panels (fully 3D); window aediculae with consoles and pediments (medium relief); arched shopfront with keystone and curved glazing; corner turret/rounded bay; scroll consoles under balconies (deep relief); cornice with modillions.
- **Edges & profiles:** ogee cornices, triangular/segmental pediments, rounded corner façade, balcony slab with moulded edges, curved kerb.
- **Surfaces & materials:** stucco in terracotta-red and apricot, cream stone trim, warm-lit shop glass, dark iron, cobbled road.
- **Objects:** illuminated advertising column; palm trees; planters; balustrade terrace with railing; iron balconies; shopfronts with lit displays; street lamps; stone seat; barricade panels; distant tower/beam.
- **Lighting/FX details:** warm evening shop glow pooling on cobbles, purple dusk sky, light beam in background.
- **Build components:**
  - Glowing Morris Column (poster column) — Blender mesh + emissive panels — castle town square (birthday posters/notices)
  - Pedimented Window Aedicule with Shutters & Balconette — modular mesh + normal map — town ring houses
  - Fan-Pattern Cobblestone — shader/normal map — streets/plaza
  - Scroll Console Balcony Bracket — mesh — balconies

### U310
- **Patterns:** Beaux-Arts façade: balustraded balconies with vase balusters; arched windows with keystones; repeating sculpted niches with figure statues; mansard dome tiles (fish-scale) on corner pavilions; wrought-iron glass marquee with pierced quatrefoil/diamond lattice frieze around its rim; rusticated bands; cornice with lit dentils.
- **Carvings & relief:** cartouches with oval medallions above the cornice flanking a clock/oculus (glowing round element, deep relief); figure statues in arched niches (fully 3D — must be veiled/faceless); corner domed pavilions with lanterns and finials; console brackets under balconies (deep relief); garlands and swags on the parapet; scrolled iron brackets supporting the marquee canopy.
- **Edges & profiles:** projecting cornice with uplit edge (cool blue-white light strip), round-arched windows, balcony slabs, canopy scalloped edge, sweeping grand staircase with balustrade at left building.
- **Surfaces & materials:** warm cream limestone uplit gold, dark iron and glass marquee, black slate/zinc domes, polished cars (ignore), red pavement.
- **Objects:** iron-and-glass marquee canopies over entrance (three segments); globe street lamp posts (double/single lantern on tall column); palm trees; potted topiary cones; planters; balustrade terraces; grand stair; vintage cars (ignore); corner domes with lanterns; arched glazed windows.
- **Lighting/FX details:** dramatic warm floodlighting from below (façade uplight), cool blue light along cornice, starry deep-blue sky, warm window glow.
- **Build components:**
  - Iron & Glass Marquee Canopy with Lattice Frieze — Blender mesh (curve brackets + alpha lattice) — ballroom entrance
  - Veiled Statue Niche with Shell Hood — Blender mesh (veiled faceless figure) — ballroom façade, grand staircase
  - Cartouche + Glowing Oculus Clock Crest — mesh + emissive — main façade crown
  - Façade Uplight Wash — light cookie/decal shader — castle walls at night
  - Globe Lantern Lamp Post — mesh + emissive — forecourt

### U311
- **Patterns:** fish-scale (scalloped) tiles with diamond-lozenge pattern on twin ovoid domes; balustrades of vase balusters along balconies and the left terrace; lattice/quatrefoil iron frieze along marquee canopy edge; rows of round-headed dormer windows (oeil-de-boeuf / arched dormers); sky with star field and Milky Way band.
- **Carvings & relief:** twin corner towers with ovoid fish-scale domes, spire finials and ball-and-spike tops; cartouche medallions (oval wreathed roundels) on tower drums (deep relief); central glowing clock/oculus flanked by winged figure sculptures (fully 3D — replace with faceless winged forms or urns); figure statues in tall niches either side of entrance (fully 3D, must be veiled); arched dormers with pediments; console-supported balconies; grand stair with balustraded cheek walls; arched gateway at lower left with rusticated voussoirs.
- **Edges & profiles:** strong horizontal cornices with lit edges; parapet with urns/finials; segmental and round arches; dome silhouettes (ovoid, tall finial); bevelled balcony slabs.
- **Surfaces & materials:** warm cream stone floodlit golden; slate/zinc domes with scale pattern; glass-and-iron marquee; dark asphalt road with red/white kerbs; shuttered pastel walls (right).
- **Objects:** casino-palace façade; marquee canopy; potted topiary (cone/ball shrubs) flanking entrance; street lamps (lantern on column); grand staircase; vintage cars; clock oculus; balustrade terrace; shutters.
- **Lighting/FX details:** deep blue starry night with Milky Way, façade uplighting, cool blue light on clock oculus, warm lamp glows, slight bloom.
- **Build components:**
  - Fish-Scale Ovoid Dome with Spike Finial — Blender mesh + scale-tile normal map — ballroom wing corner towers
  - Glowing Clock Oculus Crest with Winged (faceless) Flanks — mesh + emissive — ballroom façade crown
  - Wreathed Oval Cartouche Medallion — sculpt → normal map/decal — tower drums, over doors
  - Starfield + Milky Way Skybox — shader — night sky
  - Grand Balustraded Stair — modular mesh — ballroom approach

### U312
- **Patterns:** stone balustrade balconies (vase balusters) on rounded corner building; rusticated ground storey with arched openings; window aediculae with segmental pediments and consoles; pinstripe red/white kerb; cobble/sett street; zebra crossing (ignore).
- **Carvings & relief:** rounded corner tower block with stacked balconies on scroll consoles (deep relief); cartouche/escutcheon over central arched window (shallow-deep); arched shopfront openings with keystones; distant dome with lantern and finial; small gilded sculpture group atop a building at left (fully 3D—ignore figures); hanging lanterns at doors.
- **Edges & profiles:** curved façade, projecting balcony slabs, moulded cornices, arch keystones, rusticated quoins.
- **Surfaces & materials:** cream limestone and terracotta-red stucco; glass shopfronts lit warm; dark iron lamps; asphalt.
- **Objects:** cylindrical cypress-like topiary (columnar shrubs) in planters by shopfronts; palm trees; tall lantern lamp posts with glowing square lanterns; wall-bracket lanterns; banner on building; balustraded stair; planters; vehicles (ignore).
- **Lighting/FX details:** warm dusk/evening, lantern glows with bloom, warm interior light.
- **Build components:**
  - Rounded Corner Tower Block with Console Balconies — modular mesh — castle town ring
  - Columnar Topiary in Square Planter — mesh — door flanks, walkways
  - Square Lantern Lamp Post — mesh + emissive — streets, bridges
  - Rusticated Arched Ground Storey — normal map trim — town buildings

### U313
- **Patterns:** brick façade with corbelled brick cornice (dentil and corbel bands); round-arched window heads with brick hood moulds; bunting/pennant strings (triangular flags) across the street; striped awnings and parasols (red-white); picket/wooden fence; iron railings.
- **Carvings & relief:** Victorian-style building with heavy projecting cornice and frieze bands (medium relief); cast-iron shopfront columns; towering white castle-like building in background with turrets, pointed conical roofs and dormers (fully 3D); water tower on legs; smokestack/chimney.
- **Edges & profiles:** projecting cornice with stepped mouldings catching sun; arched windows; pitched roof dormers; conical turret caps.
- **Surfaces & materials:** grey-pink brick, cream stone trims, green-painted timber shopfronts, signage boards (wood, painted), sunlit haze.
- **Objects:** shop signs (hanging, painted wood); café parasols and round tables; street lamp posts (Victorian lantern on cast-iron post); trees (leafy); flowering hedge (orange/red flowers); bunting; water tower; wooden fence; benches.
- **Lighting/FX details:** strong sun from left with bloom and god-rays haze; dust motes; bright warm palette.
- **Build components:**
  - Victorian Cast-Iron Lantern Post — mesh + emissive — village streets, bridges
  - Corbelled Brick Cornice — trim mesh/normal map — town buildings
  - Triangle Bunting String — mesh/cloth — festival streets (birthday)
  - Café Parasol + Round Table Set — mesh — birthday garden party area
  - Hanging Painted Shop Sign on Bracket — mesh + decal — village shops

### U314
- **Patterns:** Portuguese pavement wave pattern (Copacabana black-and-white undulating stripes in calçada mosaic) along promenade; striped beach umbrellas; diagonal hatched grass verge edge; palm fronds.
- **Carvings & relief:** none ornate; small beach kiosk with pyramidal thatch/tiled roof.
- **Edges & profiles:** smooth curved kerb lines; sea shoreline curve.
- **Surfaces & materials:** stylised sand, mosaic paving, glass towers (off-theme), sea water with foam.
- **Objects:** palm trees; beach kiosk hut; beach umbrellas; deck chairs and towels; coolers; tents; cars (ignore); mountains (Sugarloaf-like); sea.
- **Lighting/FX details:** bright day, sea sparkles, light haze.
- **Build components:**
  - Wave-Pattern Mosaic Promenade — shader/texture (two-tone calçada waves) — ring walkway paving variant (could glow at night)
  - Small Pyramidal-Roof Kiosk — mesh — lakeside/festival booth

### U315
- **Patterns:** (off-theme modern colourful) usable: wave-crest/fan of curved blue ribbed fins (a stylised ocean-wave arch) above a shop entrance; vertical wooden slat cladding; triangular kites/sails overhead.
- **Carvings & relief:** wave-fin arch canopy (fully 3D); curving wooden-trimmed façade.
- **Edges & profiles:** sweeping curved edges, rounded fascias.
- **Surfaces & materials:** glossy painted plastic-like surfaces, wood slats, glass.
- **Objects:** palm trees; stairs with railings; tables with umbrellas; signage (ignore); giant sculpture (ignore); triangular kites.
- **Lighting/FX details:** bright daylight, saturated colours.
- **Build components:**
  - Ribbed Wave-Crest Arch Canopy — Blender mesh — mermaid/water pavilion entrance by the moat
  - Wooden Slat Cladding Trim — normal map — boathouse

### U316
- **Patterns:** pantile/kawara roof-tile ridges (repeating vertical channels with round end caps along eaves); vertical board-and-batten siding on upper storey; horizontal louvre slats on hanging sign panel; repeating rafter-end (taruki) rows under the deep eaves; row of fairy-light dots along roof hip edges (string lights); grid shoji lattice in shop windows (square kumiko grid); cherry-blossom foliage clusters (pink).
- **Carvings & relief:** karahafu (cusped, undulating "cat's back" bargeboard gable) over the left shopfront, twice stacked, with a carved gable plaque (gegyo) bearing a crest — deep relief; dark carved bracket arms (kumimono) under the red balcony pavilion — fully 3D; carved round crest/mon roundels on lanterns and plaques (shallow relief/painted); scalloped decorative cornice board with stepped zig-zag profile on the shop fascia.
- **Edges & profiles:** upswept eave corners (soribuki) with flared tips; ogee/cusped karahafu bargeboard curve; thick twisted straw rope (shimenawa) slung in a festoon under the gable; stepped "notched" fascia silhouette (step-up/step-down chevron fascia) with bevelled edges; chamfered square posts; thin emissive LED edge strips along roof hips and under-eave beams catching a cold blue line of light.
- **Surfaces & materials:** dark grey glazed clay roof tiles; warm honey-tan timber boards, weathered; red-lacquered timber pavilion posts and beams (semi-gloss); paper lanterns (translucent, emissive); brushed steel bollards; enamel-painted signboards; blue neon/LED strips (off-theme sci-fi).
- **Objects:** red chōchin paper lanterns (cylindrical, with crest), giant cylindrical paper lantern hanging from gable, large round ochre lantern, vertical hanging signboards with calligraphy, framed poster, red post-box (round pillar type), steel bollards, shop counter with shelves of bowls, hanging noren-like awning, cherry-blossom trees, wall lamp (globe), hovering disc lights (sci-fi), speaker cabinet, planter box with grass, small window with vertical bars, shelves of produce, raised walkway bridge with red railing.
- **Lighting/FX details:** warm orange lantern glow vs cool blue ambient; visible volumetric light shafts slanting from under the awning down onto the counter; small bokeh spot lights in fascia soffit; rim-light on roof hips; light haze.
- **Build components:**
  - Karahafu cusped gable bargeboard — Blender mesh (curved sweep) + normal map for carved crest — market stalls / Lantern Market gatehouses
  - Chōchin cylindrical paper lantern (ribbed) — Blender mesh + emissive shader with rib normal map — festival streets, ring walkways
  - Shimenawa twisted rope festoon — Blender curve with twist + rope normal map — shrine gate, bridge entrance
  - Fairy-light string along roof hips — instanced emissive spheres along curve — castle roof edges, gazebos
  - Volumetric shaft under awning — shader (additive cone cards) — shop interiors, ballroom windows
  - Stepped notched fascia board — Blender mesh, bevelled — shop/stall fronts

### U317
- **Patterns:** repeating rows of round red-orange silk lanterns along the gate lintel and up the posts (lantern ladder); grey stone flag paving in large rectangular slabs, running bond; distant repeating gate frames in perspective (gate colonnade); star-speckled night sky.
- **Carvings & relief:** paifang/pailou-style timber archway with a tiled hip roof, carved red-lacquered posts and double cross-beams — fully 3D; giant fish (koi/carp) lantern sculptures with fin scales — fully 3D; snail/conch-shell spiral lantern on the ground — fully 3D; floral lanterns hanging from beams (peony-shaped); lotus-shaped glowing base lanterns.
- **Edges & profiles:** upswept roof eaves on gate; layered cross-beams with plain bevelled ends; low kerb steps with rounded edge.
- **Surfaces & materials:** red-lacquered wood, dark grey roof tiles; smooth matte blue-grey stone paving; translucent glowing silk/paper lantern skins in gold-orange and coral.
- **Objects:** pailou gateway (multiple, in a series), round red lanterns (dozens), carp/koi lantern sculpture, spiral shell lantern, peony/flower hanging lanterns, bonsai-like potted tree on a pedestal, small pavilions, distant multi-storey pagoda buildings, street vendors' stalls, lamp post silhouette, flying sky lanterns/sparks.
- **Lighting/FX details:** strong warm orange emissive glow, bloom halos around each lantern; floating sky lanterns as small orange dots in the sky; blue moonlit sky contrasting.
- **Build components:**
  - Pailou lantern gate (posts + double beam + tiled roof) — Blender mesh — Lantern Market entrance, bridge ends
  - Lantern ladder (round lanterns stacked up post) — instanced mesh + emissive — gate posts, ballroom pillars
  - Koi fish giant lantern sculpture — Blender mesh + translucent emissive shader with scale normal map — moat / lake festival
  - Spiral shell ground lantern — Blender mesh + emissive — garden paths
  - Floating sky lanterns — particle (rising billboards) — skybox over castle

### U318
- **Patterns:** wet asphalt reflections; grid of window panes on buildings; vertical neon tube strips on gate posts.
- **Carvings & relief:** torii-like gateway with a curved, upswept top lintel (kasagi) and a tie-beam (nuki) — fully 3D; otherwise plain modern buildings.
- **Edges & profiles:** upturned lintel ends, flat tie-beam; neon strips as edge emitters on post corners.
- **Surfaces & materials:** dark wet road (glossy, mirror reflections); concrete; red neon; paper lanterns (small, round).
- **Objects:** torii-style gate, red round paper lanterns (row along building at right), hanging lanterns under gate, signboards, debris bags, kerbs, distant building facades. Off-theme (cyberpunk).
- **Lighting/FX details:** red/teal neon reflections in puddles; atmospheric haze; strong red glow on posts.
- **Build components:**
  - Torii gate with emissive post edges — Blender mesh + emissive strip shader — glowing shrine gate at Glowwood
  - Wet-stone reflective puddle decal — decal + roughness map — courtyard after rain
  - Row of round lanterns on wire — instanced emissive — street eaves

### U319
- **Patterns:** none distinctive (low resolution); rows of round red lanterns at right.
- **Carvings & relief:** a gate structure with upturned lintel (torii/paifang-like) spanning street; signboard above.
- **Edges & profiles:** upturned roof/lintel line.
- **Surfaces & materials:** wet asphalt, neon, car paint (off-theme).
- **Objects:** gateway, red round lanterns stacked vertically (lantern column), signs, cars, figure.
- **Lighting/FX details:** red/orange neon glow, cyan sky haze.
- **Build components:**
  - Vertical stack of red globe lanterns — instanced emissive — tower corners
  - Gate with hanging name plaque — Blender mesh — district entrances

### U320
- **Patterns:** dense grids of lit windows and billboard panels on towers; vertical ribbing of neon on cylindrical tower (concentric ring bands); zebra-crossing stripes; window grids.
- **Carvings & relief:** none — modern megastructure.
- **Edges & profiles:** curved streetlamp arm (swan-neck lamp post); stepped skyscraper silhouettes.
- **Surfaces & materials:** glass, steel, emissive billboards, magenta neon rings.
- **Objects:** swan-neck street lamp with long linear head, billboards, hanging round red lanterns (small rows), cars, road markings. Off-theme.
- **Lighting/FX details:** magenta/teal neon glow, light beam from streetlamp, haze.
- **Build components:**
  - Swan-neck lamp post with linear glow head — Blender mesh + emissive — reworked as a curved wrought-iron lamp on ring walkways
  - Ringed glowing tower bands — emissive shader on cylinder — magic spire

### U321
- **Patterns:** pink cherry-blossom canopy; tiled roofs with ridge lines; grid of tower windows.
- **Carvings & relief:** Japanese-style shopfront with gabled roofs and a small karahafu; red round lanterns along eaves.
- **Edges & profiles:** upswept eaves.
- **Surfaces & materials:** grey roof tile, white plaster, dark timber framing.
- **Objects:** cherry trees, lanterns, steps, signboards, tall tower. (Low-res thumbnail.)
- **Lighting/FX details:** daylight, soft.
- **Build components:**
  - Cherry tree with pink foliage cards — mesh + alpha leaf cards — Glowwood edge, courtyard
  - Small gable shopfront with lanterns — Blender mesh — market lanes

### U322
- **Patterns:** vertical banners with stacked calligraphy (vertical sign strips); repeating rows of small round bulbs under eaves (marquee bulb rows); window grids on tower; fanned diagonal ribbing on the central tower crown; dark tile roofs.
- **Carvings & relief:** central tower crown with a round clock-like medallion/rosette (emblem) — deep relief; arched door surround with keystone-like lamp; flanking hip-and-gable (irimoya) roofs with strongly upswept corners; columns flanking entrance with simple capitals; segmental arched entrance canopy with medallion lamp at crown.
- **Edges & profiles:** strongly upturned eaves; segmental arch; stepped tower setbacks; bulb-lined fascias.
- **Surfaces & materials:** red-lacquered/stucco walls, dark grey tiles, glowing amber windows, red emissive banners.
- **Objects:** vertical glowing banners (4), round medallion emblem, bulb marquee rows, wall lanterns, entrance columns, red pillar post, fountain plinth/stone planter at right, red tree (maple), circular paving inlay.
- **Lighting/FX details:** warm red-pink glow, amber windows, star-speckled blue sky, light-dots floating.
- **Build components:**
  - Vertical glowing banner panel — Blender plane + emissive decal — castle façade, ballroom entrance
  - Marquee bulb row under eaves — instanced emissive spheres — theatre-like gate, ring walkways
  - Crown medallion/rosette emblem — Blender mesh + normal map — clock tower / keep top
  - Segmental arched entrance with lamp at crown — Blender mesh — castle gate

### U323
- **Patterns:** cherry-blossom canopies; dark tile roofs; stone paving.
- **Carvings & relief:** multi-tier pagoda/castle tower (tenshu-like) with stacked hip roofs; red torii gate; tiled roof walls.
- **Edges & profiles:** stacked upswept eaves.
- **Surfaces & materials:** grey tiles, red lacquer, white plaster.
- **Objects:** pagoda tower, torii gate, cherry trees, roofs, stairs, courtyards. (Low-res aerial thumbnail.)
- **Lighting/FX details:** daylight.
- **Build components:**
  - Stacked-eave tower roof module — Blender mesh — secondary castle towers
  - Torii gate — Blender mesh — garden shrine

### U324
- **Patterns:** pink blossom trees; billboard grids. Off-theme.
- **Carvings & relief:** none.
- **Edges & profiles:** blocky stepped towers, cantilevered platforms.
- **Surfaces & materials:** emissive billboards, metal.
- **Objects:** pink blossom trees in planters, searchlight beams, billboards, round emblem sign, platforms.
- **Lighting/FX details:** searchlight beams (upward vertical light shafts) into purple sky, neon glow.
- **Build components:**
  - Searchlight sky beams — shader (cone, additive) — castle celebration night
  - Pink blossom tree in raised round planter — mesh — plazas

### U325
- **Patterns:** grid of glass panels; hazard stripes; repeating floor tile panels. Off-theme cyberpunk illustration.
- **Carvings & relief:** none.
- **Edges & profiles:** bevelled concrete balcony parapet with chamfered top.
- **Surfaces & materials:** concrete, glass, emissive screens.
- **Objects:** vending machines, shop fronts, screens, small rooftop tree in planter, staircase, floor light panels.
- **Lighting/FX details:** neon glow, holographic screens.
- **Build components:**
  - Chamfered parapet wall cap — Blender mesh (bevel) — ring walkway edge (in stone)
  - Inset glowing floor panels — emissive decal — magical floor runes on walkways

### U326
- **Patterns:** billboard grids, horizontal LED bands on building ledges, window grids. Off-theme neon city concept.
- **Carvings & relief:** none (a large holographic statue of a figure — skip).
- **Edges & profiles:** stepped tower setbacks; glowing cyan edge bands wrapping terrace ledges (rounded corners); cylindrical column tower with ring bands.
- **Surfaces & materials:** emissive screens, metal panels, glass.
- **Objects:** billboards, cylindrical totem tower with vertical sign, rooftop gardens/planters, walkways, bridges, holographic projection.
- **Lighting/FX details:** magenta/cyan neon glow, fog, holographic shimmer.
- **Build components:**
  - Glowing ledge edge band (rounded-corner emissive strip) — emissive shader on bevelled trim — ring walkway kerbs (soft magic glow)
  - Hologram/projection shimmer — shader (scanline + fresnel) — magic projection over castle fountain
  - Ringed cylindrical totem tower — Blender mesh + emissive rings — Glowwood beacon pillar

### U327
- **Patterns:** ashlar stone blocks in running bond with deep V-joints; repeating sash windows with stone surrounds; dormer window row on mansard roof.
- **Carvings & relief:** projecting corner bay (oriel tower) on a corbelled base — the bay is carried on a deep stepped corbel bracket above the door; window architraves with ears/lugs and keystone-shaped heads; string courses between storeys; statue on a tall plinth with cornice (green bronze — faceless/veiled in game) — fully 3D; plinth with panelled dado and moulded base; arched doorway with plain archivolt.
- **Edges & profiles:** heavy cornice with modillions under the roof; projecting string course at each floor; rounded corner tower (canted bay); arched door heads; rusticated ground storey with deep horizontal channels.
- **Surfaces & materials:** blue-grey limestone (matte, slightly weathered), slate mansard roof, verdigris green bronze statue, warm interior-lit glass, black iron lamp posts.
- **Objects:** cast-iron lamp post with lantern head (tapering hexagonal lantern), wall-bracket lanterns beside doors (two), statue on plinth/monument, vertical blade sign, shop signboard over door, tree (broadleaf), stone steps with iron handrail, phone/kiosk booth at left with glowing sign, distant Gothic spires.
- **Lighting/FX details:** warm amber lamp glow pooling on stone; cool blue dusk sky; interior windows glowing warm; rim light on cornices.
- **Build components:**
  - Corbelled corner oriel bay — Blender mesh — castle town houses / gatehouse corners
  - Rusticated ashlar wall with V-joints — normal map + tiling texture — castle lower walls
  - Window architrave with keystone head — Blender mesh (kit piece) — all town façades
  - Verdigris statue plinth with panelled dado — Blender mesh + verdigris shader (statue veiled) — central plaza
  - Hexagonal iron street lantern on post — Blender mesh + emissive — ring walkways, bridges

### U328
- **Patterns:** terracotta pantile roof (Roman tile, curved overlapping) with ridge tiles; cobblestone/setts paving with loose irregular stones; plastered walls with chipped corners; window boxes rows.
- **Carvings & relief:** little; plaster window surrounds; stylised round road sign with emblem; arched arcade under a red building in background (round arches on columns).
- **Edges & profiles:** thick soft-bevelled stylised roof edges (chunky, exaggerated eaves); rounded wall corners; worn step edges.
- **Surfaces & materials:** stylised cream plaster (matte), terracotta tiles, cobblestone, painted metal pipes, rusty industrial chimneys.
- **Objects:** street lamp (curved post), round road signs on post, clown-like mascot figure (skip face), car (off-theme), wooden bench, flower window boxes, wall-mounted street-name plaques, chimneys/smokestacks with steam, pipes, ivy climbing a pole, grass tufts between cobbles, fallen leaves, shop sign.
- **Lighting/FX details:** bright daylight, steam plumes, soft AO, leaves particles.
- **Build components:**
  - Chunky stylised pantile roof — Blender mesh (array) + normal map — village houses beneath castle
  - Cobblestone setts with grass tufts — tiling normal map + decal grass cards — village lanes
  - Ivy climbing a post — alpha-card mesh — lamp posts, castle walls
  - Wall street-name plaque — decal — town lanes

### U329
- **Patterns:** stucco walls with exposed brick patches (broken plaster revealing brick); iron window grille (diamond grid); terracotta roof tiles.
- **Carvings & relief:** none notable; simple timber balcony with brackets.
- **Edges & profiles:** rounded, soft stucco edges; stepped staircase with rounded nosings; low parapet walls.
- **Surfaces & materials:** lilac-tinted plaster (matte), brick, wood, fabric banner.
- **Objects:** scooter (off-theme), stairs, balconies, hanging fabric banner with emblem, small trees, orange flowers, potted plants, wall lamp, distant towers.
- **Lighting/FX details:** soft daylight, haze.
- **Build components:**
  - Broken-plaster-reveals-brick decal — decal + normal map — castle courtyard walls (aged look)
  - Hanging fabric banner on façade — Blender cloth-sim mesh — castle walls
  - Diamond iron window grille — Blender mesh/alpha — lower windows

### U330
- **Patterns:** sci-fi panel seams on floating pillars; layered rock strata.
- **Carvings & relief:** none (sci-fi monoliths).
- **Edges & profiles:** jagged rock spires; floating pillar bottoms broken off.
- **Surfaces & materials:** dark metal, weathered rock with moss on top, misty atmosphere.
- **Objects:** floating monolithic structures, rock spires/arches, mossy boulders, small flying craft (skip).
- **Lighting/FX details:** bright volumetric haze, light bloom, distant fog layers.
- **Build components:**
  - Floating broken rock/monolith — Blender mesh + bobbing shader — sky islands around castle
  - Mossy-topped rock spire — mesh + moss blend shader (top-facing) — cliffs below castle
  - Layered height fog — shader — valley

### U331
- **Patterns:** Art Deco chevron/zig-zag frieze bands with interlocking diamond-and-X centre motifs (on wall panels and over doors); arch soffit band with repeating chevron/arrowhead cartouches running round the great vault; tall arched windows with iron mullion grid and repeating small round-arch (arcaded) tracery bars at each horizontal register (mini-arcade rows); large radial sunburst floor inlay (alternating gold and cream rays from the centre kiosk) inside a circular border with a notched/stepped Deco outline (stepped scalloped ring); square floor tiles; ashlar blocks with fine joints; overlapping-arc (rainbow arcs) iron balustrade pattern; zig-zag panels on kiosk.
- **Carvings & relief:** massive piers with stepped Art Deco capitals (stylised stepped brackets with chevron relief) — deep relief; spiral/scroll (volute) relief in panels beside ticket windows (concentric C-scrolls) — shallow relief; door surrounds with stepped jambs; kiosk with pilasters, zig-zag frieze and wave-scroll grilles at base of windows — shallow relief; cornice on balconies.
- **Edges & profiles:** semicircular (round-headed) arched windows set in deep reveals; large barrel vault with moulded archivolt; stepped/ziggurat pier caps; cyma cornices; uplight slots on top of piers creating sharp light lines; rounded kiosk counter edge (torus moulding).
- **Surfaces & materials:** warm sandstone/limestone (matte with subtle polish on floor), polished marble floor with reflections, bronze/brass grilles and clock, dark green-bronze vault with painted sky ceiling (fresco), frosted glass shades.
- **Objects:** circular information kiosk with four-faced brass clock on top (globe clock), grand twin staircases, wrought-iron arc balustrades, wall sconces (trapezoidal box lanterns with frosted panels on bracket arms), uplight wash lights on piers, departure board, suitcases, benches, doorways, ticket windows with iron grilles.
- **Lighting/FX details:** warm amber uplight washes on piers (cone-shaped light pools on wall), cool blue daylight through windows, light haze, reflective glossy floor.
- **Build components:**
  - Radial sunburst floor inlay with stepped Deco ring border — decal / floor texture + normal map — ballroom floor, castle foyer
  - Arched window with iron grid + mini-arcade tracery bars — Blender mesh (alpha bars) — great hall windows
  - Overlapping-arc wrought-iron balustrade — Blender mesh (curves) — balconies, ring walkways
  - Chevron & diamond Deco frieze band — normal map + gilt decal — ballroom walls, door lintels
  - Circular kiosk with brass globe clock — Blender mesh — castle plaza info/clock pavilion
  - Trapezoid frosted-glass bracket sconce — Blender mesh + emissive — corridor walls
  - Pier uplight wash — light cookie/shader projected cone — great hall piers

### U332
- **Patterns:** coffered ceiling (square coffers with moulded frames) along the side ceilings; fan/sunburst stained glass lunette at top (radiating panes, half-wheel rose); round-arched windows in arcaded tiers (triple windows); pipe-organ-like vertical ribbing behind arcade (fluted panels); polished floor with a central compass/cross inlay line.
- **Carvings & relief:** classical Corinthian/composite-ish paired columns on pedestals flanking arcades — fully 3D; grand bifurcated (imperial) staircase with curved balustrades and newel posts — fully 3D; carved central arched niche with a glowing rose/sunburst disc; cartouche/medallion on arch crowns; balcony balustrades with turned balusters.
- **Edges & profiles:** round arches, entablatures with dentil-like rows, deep cornices, curved sweeping banisters with scrolling ends.
- **Surfaces & materials:** dark polished wood/bronze, gilded trim, mirror-polished marble floor (strong reflections), stained glass (teal/amber), glowing amber glass niche.
- **Objects:** imperial staircase, brass chandeliers/hanging lanterns (ornate spherical cage lanterns) suspended on chains, display cases/vitrines with framed exhibits, stanchion rope barriers (posts with ropes), side balconies, pendant lamps.
- **Lighting/FX details:** warm glowing niche at stair head, lunette backlit by moonlight/teal, reflections on floor, dusty haze, spotlights on exhibits.
- **Build components:**
  - Imperial bifurcated staircase with curved balustrade — Blender mesh — ballroom / castle great hall
  - Fan/sunburst stained-glass lunette — Blender mesh + stained glass shader (emissive transmission) — above grand doors
  - Coffered ceiling panel — Blender mesh kit / normal map — ballroom ceiling
  - Spherical cage chandelier on chain — Blender mesh + emissive — great hall
  - Mirror-polished marble floor — shader (SSR / planar reflection) — ballroom
  - Glowing sunburst niche disc — emissive shader — stair landing focal point

### U333
- **Patterns:** grid window mullions; orange trim bands outlining wall panels; gear-wheel (cog) motif on building; repeating bollard lights around a round platform.
- **Carvings & relief:** large cog-wheel emblem with spokes — deep relief / 3D; pedestal with stepped cylindrical tiers carrying a ringed planet orb sculpture (Saturn-like) — fully 3D; tentacle/pipe supports.
- **Edges & profiles:** circular stepped dais with rounded edges, orange-trimmed parapet coping, curved stair flights.
- **Surfaces & materials:** cream plaster, orange-red painted metal trim, glowing translucent orb (pink-peach), dark water.
- **Objects:** giant glowing ringed-planet orb on pedestal (fountain-like monument), circular island platform with stairs, short bollard lanterns with glowing heads (mushroom lamps) along curved rails, street lamp, cog-wheel, windows, water.
- **Lighting/FX details:** orb glow with ring halo trails (motion streaks around the orb), lamp reflections in water, soft sunset light.
- **Build components:**
  - Glowing ringed orb on stepped pedestal — Blender mesh + emissive/fresnel shader + orbiting ring particles — moat island / observatory
  - Circular dais island with radial stairs — Blender mesh — lake/fountain centre
  - Mushroom-cap bollard lamps along curved railing — instanced mesh + emissive — ring walkways
  - Orbiting light-trail rings — particle/trail shader — magic orbs

### U334
- **Patterns:** patterned carpet runner with a repeating medallion/rosette motif and gold border; marble floor with pale veining in large slabs; coffered ceiling with gilded rosette coffers; quatrefoil/rose motifs in vault; gilt scrollwork balustrade panels (left upper gallery).
- **Carvings & relief:** pointed Gothic arches (lancet) on clustered columns; ribbed vault arches; columns with gilded foliate (crocket-like) capitals — deep relief; gilded balustrade on bridge-like gallery; marble plinths with gold base mouldings; small gilded reliquary/shrine/pedestal box on altar block.
- **Edges & profiles:** pointed arches with roll mouldings; gilded edge piping on plinths and gallery parapets; stepped dais.
- **Surfaces & materials:** cream/white marble (polished), gold gilding, purple velvet banners, crimson fabric/foliage, frosted waterfall glow.
- **Objects:** giant gold ring chandelier (wagon-wheel/armillary ring with candle lamps), purple hanging banners with gold emblems, indoor waterfalls/cascades in arches, red ornamental plants (palm-like crimson), hanging flower basket lamps (crimson), central pedestal/altar with gold box, carpet runner, bridge gallery, raised planters.
- **Lighting/FX details:** strong god-rays from high windows (volumetric light shafts crossing hall), waterfall mist glow, warm chandelier points, soft bloom.
- **Build components:**
  - Gold ring chandelier with candle lights — Blender mesh + emissive — ballroom ceiling
  - Indoor arch waterfall — shader (scrolling water) + mist particles — ballroom side niches
  - Purple/gold heraldic banner — cloth mesh + decal — great hall pillars
  - Medallion-pattern carpet runner with gilt border — texture/decal — aisles & staircases
  - Gilt-edged marble plinth — Blender mesh + gold trim shader — ballroom planters/altar
  - Volumetric window god-rays — shader cards — ballroom

### U335
- **Patterns:** irregular flagstone/crazy paving with grass in joints; exposed brick patches behind cracked plaster (broken-plaster brick reveal); voussoir stones of round arch (radiating wedge stones); louvred shutters (green).
- **Carvings & relief:** round segmental arch bridging the alley made of stone voussoirs — deep relief; simple window surrounds.
- **Edges & profiles:** round arch with thick voussoirs; projecting balconies with brackets; little pitched hood over window (wooden canopy).
- **Surfaces & materials:** warm cracked plaster (ochre, grey-blue, pink), red brick, worn limestone paving, wood, terracotta pots, wrought iron.
- **Objects:** wrought-iron wall lantern on scroll bracket, wooden table and ladder-back chairs, easel with canvas, terracotta pots with flowering plants (lilies, geraniums, lavender), hanging ivy, climbing plants, window boxes, balcony with railing, shutters, overhead wires, drainpipes, distant arched doorway.
- **Lighting/FX details:** warm sunlight bouncing off walls, glowing distant arch.
- **Build components:**
  - Stone voussoir arch over alley — Blender mesh — castle town lanes / undercrofts
  - Crazy paving with grass joints — tiling texture + normal map — garden paths
  - Wrought-iron scroll wall lantern — Blender mesh + emissive — lanes, castle walls
  - Terracotta pot cluster with flowers — mesh + alpha cards — terraces/ring walkways
  - Cracked plaster revealing brick — decal — aged walls

### U336
- **Patterns:** smooth stone-slab pavement with a small dark mosaic band near the kerb (calçada-like); pastel façades with rows of identical sash windows; wrought-iron balcony railings with vertical bars and scroll tops; repeating sash windows with shutters; overhead tram wires web.
- **Carvings & relief:** window and door architraves with moulded heads; pilaster strips at building corners; cornices with simple brackets; arched ground-floor doors with fanlights.
- **Edges & profiles:** projecting cornice ledges, balcony slabs with moulded undersides, rounded arched doorways, pastel trim bands outlining storeys.
- **Surfaces & materials:** pastel painted stucco (yellow, pink, blue, red-brick), green-painted wooden doors, wrought iron, cobbles (cobble setts), stone kerbs.
- **Objects:** tram (yellow), iron bollards with chain, overhead wire junction rings, wall-mounted lamps, shop sign (round-cornered blade sign), green awning, flower pots on balconies, airship (sci-fi) with glowing round lamps.
- **Lighting/FX details:** bright daylight, sky reflections in windows; glowing amber lamps on the airship.
- **Build components:**
  - Pastel stucco town-house façade kit with iron balconies and cornices — Blender mesh kit — castle town lanes
  - Overhead wire web with junction rings — Blender curves — could become festival light-string web over streets
  - Wrought-iron balcony railing with scroll caps — Blender mesh — façades
  - Iron bollard with swagged chain — Blender mesh (instanced) — bridge approaches, plaza edges

### U337
- **Patterns:** green vertical gardens on façades in Voronoi/organic cell frames (tower at centre-right with Voronoi lattice of hedge panels); solar panel grids; chequer/diagonal checker floor tiles (brown/cream) at right; striped awning.
- **Carvings & relief:** none (stylised eco-city).
- **Edges & profiles:** rounded building corners, curved terraces with planted edges, stepped terraces.
- **Surfaces & materials:** cream plaster, green foliage, glass, teal metal, terracotta.
- **Objects:** wind turbines, vertical gardens, rooftop shrubs, trees in round planters, street lamps (curved post with hanging lamp), vending kiosks, benches, bins, postbox, small screens, potted plants, hanging vines, elevated monorail/bridge, balconies with planters.
- **Lighting/FX details:** bright daylight, soft teal ambient.
- **Build components:**
  - Voronoi lattice planted wall — Blender mesh (Voronoi cell frame) + hedge shader — Glowwood tower / garden wall
  - Round raised planter with tree — Blender mesh — plazas
  - Overhanging vine curtains from terraces — alpha-card meshes — ring walkways, castle terraces
  - Diagonal chequer paving — tiling texture — market square

### U338
- **Patterns:** marble floor inlay of interlaced circles (Celtic/Cosmatesque-style interlocking rings and arcs) in brown and gold veined marble set in a square field; border band of lozenge/diamond tiles (diamond-in-rectangle inlays) in a running row; pink stone border with herringbone/rectangular pavers; stained glass with interlaced circular/knotwork leading (purple/blue) in tall window; ashlar with fine joints; window box flower strips.
- **Carvings & relief:** large Rococo/Baroque cartouche with C- and S-scrolls crowning the porch hood (deep relief); atlas/telamon column (male figure supporting entablature — must be faceless/veiled) — fully 3D; grape-vine relief on the left column shaft — shallow relief; lion-mask keystone over door (convert to foliage medallion) — deep relief; sun-face medallion with rays over window (sunburst, make faceless) — deep relief; fleur-de-lis crowning pediment over arched window — deep relief; window architraves with shouldered ear moulding; animal relief panel on wall; gargoyle-like stone dragon spout (make foliage); curved semicircular porch hood with cornice.
- **Edges & profiles:** curved bay tower with belt-course cornice; round-arched windows with moulded archivolts and scrolled keystones; segmental cornices; plinth bases; cracked stone surface lines; Ionic-like column bases.
- **Surfaces & materials:** warm honey sandstone ashlar (matte, with cracks), white marble porch columns and cartouche, polished veined marble floor, glazed stained glass, mahogany door with glazed fanlight, brass house-number plaque, verdigris statue.
- **Objects:** string of coloured festoon bulbs (fairy lights) along porch, wreath on door, bell, wind chimes, brass clock on scroll bracket, hanging café sign on scroll bracket, birdcage on stand, mailbox on post, wooden pedestal with vintage camera, iron lantern on wooden pedestal, bistro table and bentwood chair, white lattice garden bench, pram, lace parasol, garden fountain (round basin), statue on plinth with sword (veiled in game), garden swing seat, birdhouse, cypress/topiary cones, rose bushes, tulips, wooden seed tray with seedlings, wicker basket of apples, watering can, violin, broom, kite, weathervane, flag, scooter, rope, distant mansard Haussmann-style buildings with dormers and chimneys.
- **Lighting/FX details:** bright sunlight with dappled leaf shadows on floor; sparkle glint on a window; soft fluffy clouds.
- **Build components:**
  - Interlaced-rings marble floor inlay with lozenge border — texture + normal map / decal — castle forecourt, ballroom centre
  - Rococo scroll cartouche crest — Blender sculpt → baked normal — over castle gate / doors
  - Veiled atlas/caryatid support column — Blender mesh (faceless, drapery) — grand entrance porch
  - Fleur-de-lis and sunburst window pediments — Blender mesh + normal map — tower windows
  - Interlaced-knot stained glass window — stained glass shader (emissive at night) — chapel/tower
  - Festoon bulb string — instanced emissive spheres on catenary — porches, garden
  - Curved bay tower with belt-course cornice — Blender mesh — castle corner towers
  - Scroll-bracket hanging sign / clock — Blender mesh (curves) — market lanes

### U339
- **Patterns:** acanthus leaf skirt around fountain base (repeating radial acanthus leaves); scallop-shell bowls; herringbone brick paving; rosette motifs on fountain stem; Art Nouveau whiplash curves on the house balcony (organic arch); triangular gable with scalloped fish-scale shingles at top left (orange); striped awnings.
- **Carvings & relief:** green-bronze tiered fountain: lower bowl with gadrooned/lobed rim, acanthus-leaf base, frog sculptures, dragonfly, rose, middle shell bowl, crown finial on top — fully 3D; Art Nouveau house with arched horseshoe-like entrance, scrolled cartouches, balconies with balustrades, garlands; finial (pinecone/egg-shaped) on roof — fully 3D; turret with conical roof.
- **Edges & profiles:** round pool kerb with moulded lip (bullnose); Art Nouveau curved door arch; bay windows; mansard and gable roofs.
- **Surfaces & materials:** verdigris/green patinated bronze with gold accents, warm ochre/orange stucco, terracotta, brass, glass conservatory dome (greenhouse), water.
- **Objects:** tiered bronze fountain with crown top, round pool, bench (park bench with iron ends), gazebo (octagonal with red roof), glass dome conservatory, water tower, vintage car, luggage pile, golf bag, ladder, paper boat, letter, lamp post globe, flags, airship, biplane, figures (skip), animals (skip).
- **Lighting/FX details:** stormy teal sky with warm sun on buildings; pool reflections.
- **Build components:**
  - Tiered verdigris fountain with acanthus base and crown finial — Blender mesh + patina shader — central castle courtyard
  - Gadrooned/lobed fountain bowl rim — Blender mesh — fountains, birdbaths
  - Octagonal gazebo with red ogee roof — Blender mesh — garden terraces
  - Fish-scale shingled gable — normal map / tiled mesh — tower roofs
  - Pinecone/egg roof finial — Blender mesh — roof peaks

### U340
- **Patterns:** glass canopy/greenhouse roof with iron ribs (arched truss); stone wall in random rubble/flagstone; herringbone/brick paving; revolving door with radial brass glazing bars; snowflake ornament.
- **Carvings & relief:** wooden revolving-door pavilion with carved gilt lettering frieze (curved); bracketed sign; wreath on wall.
- **Edges & profiles:** curved wooden cornice around rotunda entrance; iron canopy arch ribs; moulded door frames.
- **Surfaces & materials:** polished mahogany wood, brass, glass, grey stone, red brick.
- **Objects:** revolving door, double-globe lamp post (twin-arm lantern post), red fire hydrant, luggage trolley (brass birdcage cart), suitcases, steamer trunks, balloons, Christmas wreath, wall clock, signboards, bins, manhole cover, red scarf, snow-dusted mountains in background.
- **Lighting/FX details:** bright alpine daylight, reflections in glass.
- **Build components:**
  - Mahogany rotunda revolving door with gilt lettering band — Blender mesh — castle hotel/ballroom entrance
  - Iron-ribbed glass canopy — Blender mesh + glass shader — station/arrival hall, bridge cover
  - Brass birdcage luggage trolley — Blender mesh — arrival area prop
  - Twin-arm globe lamp post — Blender mesh + emissive — plazas

### U341
- **Patterns:** striped café chair upholstery (blue/cream stripes); cobblestone paving in fan/arc pattern; wrought-iron balcony scrolls; Haussmann-style repeating windows; scalloped awning valance edge.
- **Carvings & relief:** heraldic shield cartouche on corner building; carved bracket sign; corner building with rounded rotunda corner and stacked balconies; arcaded ground-floor arches; fountain/obelisk column at left with urn.
- **Edges & profiles:** curved corner façades, cornices with consoles, scalloped awning edges, mansard roofs with dormers.
- **Surfaces & materials:** cream limestone, green-painted shopfronts, brass, glass, porcelain.
- **Objects:** bistro table with teapot, teacup, candle lantern (hurricane lantern with candle), wine bottle and glass, café chairs, closed parasol, butterfly ornament, shop signs with gold lettering, hanging bracket signs, wall lantern, street lamp, vintage bus/tram, phone box, fruit cart with produce crates, red popcorn cart, bicycle, guitar, books pile, ice-cream sundae glass, weathervane, hot-air balloon, dove, cat (skip).
- **Lighting/FX details:** warm evening light, glowing windows, purple sunset sky, candle glow.
- **Build components:**
  - Hurricane candle lantern (glass chimney) — Blender mesh + emissive flicker shader — café tables, balconies
  - Scalloped awning with valance — Blender cloth mesh — market stalls
  - Fan-pattern cobblestone — tiling normal map — town square
  - Heraldic shield cartouche — normal map/decal — building corners

### U342
- **Patterns:** Indo-Saracenic/Mughal skyline: onion domes, chhatri (kiosk) minarets with fluted shafts; large round rose/clock window with radial spoke tracery on central façade; lattice screens; lattice dome shell (gridded arch); hydrangea clusters; scalloped awning; festoon light string.
- **Carvings & relief:** fluted minaret shafts with ringed bands and pointed finials — fully 3D; round radial rose window — deep relief; carved gilt frieze panels on balustrade terrace (foliage scroll); statue of elephant on plinth (animal statue — keep generic); horse head bust; peacock topiary; lattice arched gateway (garden arch); carved gilt clock face.
- **Edges & profiles:** onion domes, pointed ogee arches, crenellated parapets with small merlons, swagged red drapery between minarets.
- **Surfaces & materials:** cream/pink stone, gilded trim, verdigris copper domes and lamp post, red fabric, painted wood.
- **Objects:** green Victorian lamp post with scroll arm and lantern, gramophone horn, film camera on tripod, wooden barrel, easel, red mailbox, birdhouse on post, guitar, numbered crate, hot-air balloon, fountain (green), statues, picket fence (low iron hoop fence), hydrangea and lavender beds, string of bulbs, birds.
- **Lighting/FX details:** bright daylight, smoke plume.
- **Build components:**
  - Fluted minaret/chhatri with onion cap — Blender mesh — castle skyline accents
  - Radial-spoke rose window — Blender mesh + stained glass shader — palace façade
  - Victorian scroll-arm lamp post (verdigris) — Blender mesh + emissive — garden paths
  - Swagged drapery between towers — cloth mesh — festival decoration
  - Low iron hoop-loop garden fence — Blender mesh (array) — flower beds

### U343
- **Patterns:** ivy creeping across façade; red brick in running bond; hopscotch grid on pavement; radial ribbed lid on trash can (sunburst lid); manhole cover with concentric rings and grid; striped awnings; bunting pennant flags; diamond chequered taxi pattern sign; fluted and panelled lamp-post base.
- **Carvings & relief:** fleur-de-lis cast plaque on lamp post — shallow relief; octagonal panelled cast-iron lamp-post base with mouldings — fully 3D; ornate wrought-iron scroll sign bracket (C-scrolls, spiral volutes, arrow-tipped arm) — fully 3D; brass house number plaque with ogee-scalloped top edge; carved console brackets under balcony.
- **Edges & profiles:** stepped pilaster capitals on blue building; cornices; octagonal plinth base with ogee moulding.
- **Surfaces & materials:** cast iron (dark, painted, worn), brass, red brick, painted stucco (yellow, blue), ceramic planter, chrome, enamel signs.
- **Objects:** twin-lantern cast-iron lamp post with chained base, street clock on post, traffic light, megaphone/horn speaker, vertical blade signs, scissors-and-comb hanging iron sign, cross pharmacy sign, sandwich-board menu (chalkboard A-frame), cast-iron trash can, manhole cover, bicycle with basket, fire hydrant, traffic cone, bucket, mop, broom, newspaper rack/stand, easel with painting, wall postbox, umbrella, bench with blanket, ladder, side table, white ceramic urn planter with palm, wooden crate, ferris wheel (distant), hot-air balloon, palm trees, tram, vintage cars.
- **Lighting/FX details:** bright warm sun; strong cast shadows; scroll-sign shadow on blue wall.
- **Build components:**
  - Wrought-iron scroll sign bracket with hanging plaque — Blender mesh (curves) — market lanes, tavern
  - Twin-lantern cast-iron lamp post with octagonal base — Blender mesh + emissive — ring walkways, bridges
  - Post-mounted street clock — Blender mesh — plaza
  - Ogee-topped brass plaque — Blender mesh/decal — door numbers, signage
  - White pedestal urn planter — Blender mesh — terraces
  - Bunting pennant string — instanced mesh on curve — festival streets

### U344
- **Patterns:** bunting pennant flags (triangular, alternating colours) strung across square; recessed square panels with rosette/medallion carvings around the fountain basin wall (panelled frieze); radial flagstone pavers around basin (fan of slabs); half-timbered (Tudor) walls with diagonal braces; striped market awnings; crenellations on castle.
- **Carvings & relief:** large circular fountain basin with panelled frieze of square rosette panels — shallow relief; heroic statue (faceless/veiled) on top of a cylindrical water-curtain column — fully 3D; castle keep with round towers and crenellated parapets.
- **Edges & profiles:** basin with heavy rounded coping and moulded plinth; battlements with rectangular merlons; corbelled turrets; overhanging jettied upper storeys of timber houses.
- **Surfaces & materials:** grey-purple stone basin (matte), water curtain (blue translucent), timber framing with plaster, tiled roofs.
- **Objects:** cylindrical cascade fountain (water sheet falling around a statue), stone basin, bunting, market stalls with striped awnings, wooden lamp posts with lanterns, barrels, crates, tables, chimney smoke, castle keep, banners, ferns and plants.
- **Lighting/FX details:** mist at basin base (spray), warm lantern glow, dusk purple sky, chimney smoke.
- **Build components:**
  - Cylindrical water-curtain fountain — Blender mesh + scrolling water shader + mist particles — castle market square
  - Panelled rosette fountain basin — Blender mesh + normal map — courtyard fountains
  - Radial flagstone apron — Blender mesh — fountain base
  - Bunting pennant lines — instanced mesh — market square
  - Half-timbered jettied house — Blender mesh kit — castle village

### U345
- **Patterns:** herringbone brick paving; ivy and flowering vines draping arch; arched iron gate with vertical bars and decorative scroll top; stone voussoir archway.
- **Carvings & relief:** carved stone arched gateway with moulded archivolt and keystone — deep relief; wall fountain with carved basin (niche fountain) — deep relief; signpost with multiple arrows; ornate carved armchair.
- **Edges & profiles:** round arch with heavy moulding; kerb edges along canal.
- **Surfaces & materials:** cream stucco, stone, iron, brick, wood, brass.
- **Objects:** wrought-iron arched gate, wall-mounted lion-less niche fountain (basin with spout), bell on bracket, wreath, heart sign, letter sign "B", lamp post, signpost with arrows, trophy banner, barrel, suitcases, steamer trunks, kite, balloons, biplane, red armchair with luggage, fire hydrant, wall-hung tools/shields, sofa, hedge, river canal with distant buildings.
- **Lighting/FX details:** golden sunset backlight, warm glow.
- **Build components:**
  - Arched wrought-iron gate within stone archway — Blender mesh — castle garden gate
  - Wall niche fountain with basin — Blender mesh — courtyard walls, lanes
  - Multi-arrow wooden signpost — Blender mesh — path junctions
  - Ivy-draped arch — alpha cards — gateways

### U346
- **Patterns:** gilded openwork arabesque/filigree screens (pierced gold lattice of scrolls and palmettes) filling wall panels; Ottoman-style lattice (kafes/mashrabiya) behind arched niche; ceiling with small repeated lozenge/coffer tiles in brown-gold (diaper pattern); painted floral arabesque scrolls (lilac on cream) on vault and spandrels; rose/fan stained-glass lunette with trefoil and quatrefoil openings (half rose window, petals in pink/green/purple); calligraphy relief bands on pier faces; blue-and-cream bands with lobed (scalloped) outlines framing panels; laurel wreath motif; bunting.
- **Carvings & relief:** column capitals of muqarnas/stalactite type (honeycomb niches tiered in white marble) over gilded ring bands (annulets) — deep relief/3D; gilded serpent coiling around the column shaft — fully 3D; heraldic rampant lion relief in gold on spandrel (keep as heraldic silhouette) — deep relief; gilt lotus flower relief medallion; gilt lyre relief on pier; laurel wreath relief in silver on panel; crest/coat-of-arms shield in gold; lobed (cusped multifoil) ogee arch niche with red velvet curtain; infinity-symbol relief; marble bust on column pedestal (faceless in game); carved wooden bench with scrolled arms and red cushion.
- **Edges & profiles:** large pointed/segmental arches with gold-edge piping and blue bands; cusped multifoil niche arch; deep cornice with gilded mouldings; swagged lilac drapery under panel; stepped bases with gilt torus mouldings.
- **Surfaces & materials:** white marble (polished) and veined cream marble pavement, heavy gold gilding, lapis/cobalt blue enamel bands, lilac painted plaster with arabesques, stained glass, dark iron lamp post, bronze fountain.
- **Objects:** tiered stone fountain with scalloped bowl rims (cusped drip edges) and frog sculpture, square pool with blue water, brass stanchions with red velvet ropes, three-lantern iron lamp post (square carriage lanterns), post clock (single-face on tall post), wall lantern, wooden birdhouse/feeder, wind chimes/bells, wooden signpost, notice board with map, easel with painting, wooden bench, well with bucket on wrought-iron frame, ornamental pedestal, oud/lute, guitar case, books, glass bottle, straw boater hat, origami crane and boat, prayer beads, gloves, hat, camera on tripod, warning sign, eagle statue (bird) on finial, rose bushes, pomegranate tree, cypress, obelisk in distance, string of bulbs on cypress.
- **Lighting/FX details:** warm sun in pavilion, glowing stained-glass lunette, gold specular highlights on gilt filigree.
- **Build components:**
  - Gilded pierced arabesque filigree panel — alpha-cutout mesh + gold PBR — ballroom wall panels, throne niche
  - Muqarnas honeycomb capital with gilt annulets — Blender mesh — ballroom columns, palace portico
  - Half-rose stained-glass lunette (trefoil/quatrefoil petals) — Blender mesh + emissive glass shader — arch heads in castle chapel/ballroom
  - Cusped multifoil ogee niche with velvet curtain — Blender mesh + cloth — alcoves, stage
  - Scalloped-rim tiered fountain — Blender mesh — palace garden
  - Brass stanchions with velvet rope — Blender mesh (instanced) — ballroom VIP/throne areas
  - Painted lilac arabesque vault — tiling texture + subtle normal — pavilion ceilings
  - Triple carriage-lantern lamp post — Blender mesh + emissive — garden walks

### U347
- **Patterns:** terracotta Roman-tile roofs; rough ashlar and rubble stone walls; ivy and climbing roses; repeating round arches (arcade) on ground floor.
- **Carvings & relief:** Romanesque/Gothic-revival church/town hall façade: tall pointed lancet window with bar tracery (two lights + oculus), round oculus window above; corner bell tower with open belfry and pointed spire; portal with classical entablature on columns; small clock tower; arched portal with fanlight; corbel table under eaves.
- **Edges & profiles:** steep pyramid roofs, pointed spires with flag finials, deep eaves with brackets, round-arched arcades, buttress-like pilasters.
- **Surfaces & materials:** warm golden sandstone (sunlit, matte), terracotta roofs, white stucco houses, green wooden doors.
- **Objects:** bell tower, clock tower, pennant flags, café table with chairs, flower pots and sunflowers, stone steps, arched doorway with glowing lantern, figures (skip), pine trees, cypress, white birds, mountains.
- **Lighting/FX details:** warm late-sun, mist on wooded hills, drifting birds.
- **Build components:**
  - Pointed lancet window with bar tracery and oculus — Blender mesh — castle chapel façade
  - Open belfry tower with spire and pennant — Blender mesh + cloth flag — castle town tower
  - Round-arched ground arcade — Blender mesh kit — courtyard loggia
  - Terracotta Roman-tile roof — tiled mesh/normal map — village roofs

### U348
- **Patterns:** cobblestone path trails (irregular flags); timber framing; shingles; barrel-like building.
- **Carvings & relief:** stylised building set: white crenellated castle with conical orange turrets; blue ice/crystal cathedral with Gothic pinnacles and spires; domed orange palace with arched windows and round towers; walled gate with onion-capped turrets and archway; tavern with barrel body and foam mug sign; half-timbered house with blue roof and waterwheel-like wheel.
- **Edges & profiles:** chunky stylised silhouettes, conical turret roofs, crenellations, domes.
- **Surfaces & materials:** stylised painted textures; pastel blue crystal; orange tile.
- **Objects:** cherry-blossom tree (pink), wooden signboards, windmill, waterwheel, barrels, crates, carts, banners, distillery/brewing stills (copper), fences, pine trees.
- **Lighting/FX details:** daylight, painterly.
- **Build components:**
  - Ice/crystal Gothic spire cluster — Blender mesh + iridescent/translucent shader — magic castle top
  - Onion-capped wall turret with arched gateway — Blender mesh — outer wall
  - Barrel-shaped tavern/building — Blender mesh — village
  - Cherry tree with heavy blossom — mesh + alpha cards — Glowwood edge

### U349
- **Patterns:** Greek key / meander border running vertically on the shopfront pilaster (gold on black); striped green-and-white awnings with zig-zag pennant valance (red/green triangular bunting); cobblestone setts (blue-grey); wooden diagonal trellis lattice fence (diamond lattice); brick voussoir arches in radial pattern; rusticated Renaissance palazzo façades with rows of arched bifora windows; diagonal stained-glass shards in window.
- **Carvings & relief:** large carved acanthus/plume leaf relief (feather-like foliage spray) in white stone on wall — deep relief; Roman numeral plaque "VI"; cast house number plaque with ornate frame; carved stone statue (faceless) on plinth; balcony with stone balusters and console brackets; fish/dolphin fountain sculpture in distance; arched shopfront with brick voussoirs.
- **Edges & profiles:** round arches with brick rings, deep cornices on palazzi, rusticated quoins.
- **Surfaces & materials:** pink stucco, red brick, grey stone, blue cobble, green canvas, brass, bentwood chairs, marble tabletop.
- **Objects:** brass wall clock on bracket, wall lantern (glass cylindrical cage on swan-neck bracket), megaphone horn, bentwood bistro chairs (Thonet style) with red cushion, marble café table on cast-iron pedestal base, candle in brass candlestick, vase with peacock feather and roses, gift box with bow, cake, ice-cream sundae, teacup, pearls, newspaper, wreath of roses, thermometer, sandwich board with heart, phone booth, street signpost, mailbox, bell on bracket, rope coil, hat, coat, umbrella, suitcase, parcel, bin, broom, pinwheel, grape vine, cypress, potted topiary, kite, hot-air balloon, biplane, birds, campanile tower, flag.
- **Lighting/FX details:** warm sunrise light, glowing chandelier visible through window, steam from cup.
- **Build components:**
  - Greek key meander trim band — decal/normal map — ballroom pilasters, door frames
  - Striped awning with pennant valance — Blender cloth mesh — market stalls
  - Swan-neck bracket cage lantern — Blender mesh + emissive — walls along ring walkways
  - Carved acanthus plume wall relief — Blender sculpt → normal map/mesh — palace façades
  - Marble café table on cast-iron pedestal + bentwood chairs — Blender mesh — terrace café
  - Diamond trellis fence with climbing vines — alpha mesh — gardens

### U350
- **Patterns:** Greek key meander carved into wooden balustrade rail (deep relief); large square blue-grey stone floor slabs with a carved compass-rose/rosette medallion inlay in the paving; round-arch arcade cutouts in stone balustrade (blind arcade/arched railing); rattan lattice weave on drum stools (criss-cross wicker); pergola with grape vines; string lights on tree.
- **Carvings & relief:** stone balustrade with round-arched openings and square posts with caps — deep relief; meander-carved wooden gate; carved stone statue of figure holding urn (veiled) on pedestal — fully 3D; urn planter on pedestal.
- **Edges & profiles:** square chamfered post caps, rounded arch openings, flat coping.
- **Surfaces & materials:** blue-grey slate stone (matte, slightly weathered), rattan/wicker, warm wood, pink fabric, terracotta, iron.
- **Objects:** wooden pergola with vines and hanging lanterns, birdcage lantern, string lights, balloons, dining table with pink tablecloth and tea set, rattan chairs, wicker drum stools with cushions, deckchair, easel, garden hose, broom, flower pots (hydrangea, pink flowers), urns, café table, statue, kite, sailboat on sea, airplane, bubbles, scattered petals/leaves.
- **Lighting/FX details:** golden sunset glow, rim light on objects, floating bubbles, petals.
- **Build components:**
  - Arched-opening stone balustrade with capped posts — Blender mesh — ring walkway railings, terrace edges
  - Compass-rose floor medallion — decal/normal map — terrace floor
  - Grapevine pergola with hanging lanterns — Blender mesh + alpha leaves + emissive — garden terraces
  - Wicker drum stool / rattan chairs — Blender mesh + weave normal map — terrace furniture
  - Meander-carved wooden rail — normal map — gates/railings

### U351
- **Patterns:** stone balustrade with turned, bulbous (vase-shaped) balusters in a long run; formal parterre hedges with flower beds (curved box hedges); autumn leaves strewn; iron bench scrollwork (curled S-scrolls).
- **Carvings & relief:** classical baluster run with square pedestals and moulded rail — fully 3D; large stone urn with gadrooned body on pedestal holding flowers — fully 3D; French château with mansard roofs, dormers, central dome/clock; garden statues on pedestals (veiled); gazebo/belvedere.
- **Edges & profiles:** rounded rail coping, pedestal caps, mansard roof profiles, cupolas.
- **Surfaces & materials:** warm sandstone, green-painted wrought iron, slate roofs, wood slats.
- **Objects:** cast-iron bench with wood slats and scrolled ends, stone urn planters with yellow flowers and daisies, balustrade, wreath on rail, gloves, guitar, cello, book, ball, vase, garden lamp posts, white picket/iron fence, round gazebo, autumn trees (orange maple), hedges, tricycle, kite, birds.
- **Lighting/FX details:** warm sunset, long shadows, autumn tones.
- **Build components:**
  - Vase-baluster balustrade with pedestals — Blender mesh (array) — castle terraces, bridges
  - Gadrooned stone urn on pedestal — Blender mesh — terrace corners
  - Wrought-iron scroll bench with wooden slats — Blender mesh — ring walkways, gardens
  - Parterre hedge maze beds — Blender mesh / hedge shader — castle gardens

### U352
- **Patterns:** grey granite setts/cobbles in fan arcs on the lane; terracotta square floor tiles on the terrace; festoon string of teardrop bulbs in swags; striped table runner (red/cream bands); wrought-iron plant-stand scrolls.
- **Carvings & relief:** loggia arcade of round arches on columns with Corinthian/composite capitals (acanthus) — deep relief/3D; stucco-capped low parapet walls with curved (ramped) copings stepping down beside stairs; square plinth piers topped by lanterns.
- **Edges & profiles:** round arches; soft rounded parapet copings; square pier caps with a thin moulding; stair nosings.
- **Surfaces & materials:** warm cream stucco (matte), terracotta tile, grey cobbles, black iron lamps with frosted/clear glass, wax candles.
- **Objects:** black iron lamp posts with acorn/urn-shaped glass lanterns (tall post plus short pier-top versions), festoon bulb string, cluster of pillar candles on parapet and table, small dining table with striped runner and candles, wrought-iron plant stands with red flower pots, terracotta pots of marigolds, red roses, cone topiaries and box hedges, vintage car (off-theme), loggia doors.
- **Lighting/FX details:** warm amber pools of light from each lantern, candle flicker glow, deep blue dusk shadows, soft bloom.
- **Build components:**
  - Pier-top acorn lantern on square plinth — Blender mesh + emissive glass — stair and walkway piers
  - Festoon teardrop-bulb swag — instanced emissive on catenary curves — terraces, ring walkways
  - Ramped stucco parapet with rounded coping — Blender mesh — garden stairs
  - Candle cluster with flicker — mesh + emissive flicker shader — ballroom tables, window ledges
  - Corinthian-column loggia arcade — Blender mesh kit — castle courtyard

### U353
- **Patterns:** fish-scale/shingle roof made of small gold-yellow tiles laid in curving rows on a leaf-shaped roof; Art Nouveau stained-glass panes in flowing teardrop/flame shapes (teal, amber, coral) set between curving wooden mullions; hexagonal flagstone paving (bevelled hexagon slabs, blue-grey); wrought-iron gate with vertical scroll tracery; lily pads in pool.
- **Carvings & relief:** organic leaf/seed-pod building whose curved timber frame sweeps up into a pointed tip — fully 3D; carved rosebud finial on the frame; a pointed petal-shaped door canopy — fully 3D; twisting buttress roots of a large tree over a stone block.
- **Edges & profiles:** rounded, swelling Art Nouveau curves; soft bevels on hex slabs; raised planter kerbs with rounded edges.
- **Surfaces & materials:** warm copper/terracotta-tone wood (satin), gold tile shingles, coloured cathedral glass, pale wooden fence planks, blue-grey stone, still water.
- **Objects:** organic stained-glass pod house, tall plank wall with arched ironwork gate, bougainvillea cascade (magenta), palm trees, cacti, fruit trees (oranges, cocos-like fruit), gnarled tree with root buttresses, bromeliads and red cordylines, coral-like and tube-shaped alien plants (blue/purple), succulents, lily pond with water lilies, raised curved planters.
- **Lighting/FX details:** soft daylight; glass panes glow with transmitted colour; light haze over the garden.
- **Build components:**
  - Art Nouveau leaf-pod pavilion with stained glass — Blender mesh + stained-glass transmission shader (emissive at night) — Glowwood glade house
  - Gold fish-scale shingle roof — normal map + tiling texture — pavilion and turret roofs
  - Hexagonal flagstone paving — tiling mesh/normal map — Glowwood paths
  - Fantasy coral/tube plants with emissive tips — Blender mesh + emissive shader — Glowwood undergrowth
  - Lily pond with water lilies — water shader + instanced lily meshes — garden pools

### U354
- **Patterns:** blocky faceted cliff rock (chunky stylised cracked rock); crazy-paving rings around a circular stone plaza disc with a cracked radial pattern; stacked stone steps; wood plank and barrel staves.
- **Carvings & relief:** circular stone dais/teleport pad with a raised moulded rim — shallow relief; wooden huts with carved signs; stone hut with arched wooden door.
- **Edges & profiles:** rounded chunky rock edges; bevelled dais rim; arched hut doors.
- **Surfaces & materials:** stylised sandstone cliffs (warm lit), mossy tops, wood, glowing pink crystal, polished metal with blue glow (sci-fi pod — off-theme).
- **Objects:** pink glowing balloon-lanterns floating in sky (faceted, like hot-air lanterns), glowing pink crystal cluster, wooden stalls/huts with lit windows, barrels, crates, clay pots, benches, wall lantern (round orange), glowing potion lamp, furnace with fire, round stone plaza disc, lake, distant floating islands/rock spires with lit windows, moons/planets in sky, mountains, robot pod (skip).
- **Lighting/FX details:** night scene: pink-magenta emissive lanterns, warm window glow, starry sky, cool blue rim light on water, crystal glow.
- **Build components:**
  - Floating faceted balloon lanterns — Blender mesh + emissive gradient shader + bob animation — sky above castle at night
  - Glowing pink crystal cluster — Blender mesh + emissive/refraction shader — Glowwood, cave
  - Circular rune dais with raised rim — Blender mesh + emissive decal — portal/plaza
  - Cliff-side wooden market hut — Blender mesh — cliff paths

### U355
- **Patterns:** large floor inlay of interlocking flowing curved bands (gold ribbons dividing deep-blue lapis and pale-blue fields, Art Nouveau/Baroque swirl parquetry) on a mirror-gloss plaza; sunburst/fan rays relief in gold on the central pavilion pediment (radiating shell/fan); repeating arcade of round arches on paired columns; rondel medallion panels on side wings; scallop-shell finials on banner poles.
- **Carvings & relief:** central triumphal portal with stacked arches: semicircular hood with gold sunburst fan, deep coffered barrel-vault entrance, teal stained-glass door; two-storey loggia with paired Ionic/Corinthian columns and arched openings — deep relief/3D; corner towers with lantern-domed cupolas; balustraded rooflines; oval medallion reliefs on wall panels.
- **Edges & profiles:** round arches; scalloped shell crest; entablature bands with thin gold piping; segmental pediment silhouette.
- **Surfaces & materials:** white/cream marble with gold gilding; mirror-polished floor (strong reflections); glowing teal glass; translucent blue water/ice shapes.
- **Objects:** tall glowing translucent blue banners on poles topped by gold scallop shells, ice/water-crystal fountains (frozen cascade sculptures) flanking the steps, domed cupolas, arcaded side wings, a figure (skip).
- **Lighting/FX details:** glowing blue banners, reflective floor doubling the façade, crystal shimmer, bright sky.
- **Build components:**
  - Gold-ribbon swirl floor inlay (lapis/pale blue fields) — texture + normal map + glossy shader — ballroom floor, palace forecourt
  - Gold sunburst fan pediment — Blender mesh + gold shader — castle main portal
  - Glowing translucent banner with shell finial pole — mesh + emissive translucent shader — ring walkways, gate approach
  - Ice-crystal fountain sculpture — Blender mesh + refraction/emissive shader — palace forecourt
  - Paired-column arched loggia — Blender mesh kit — palace wings

### U356
- **Patterns:** large square stone floor slabs (warm cream) in grid; baluster runs; crystal spikes clustered behind the temple.
- **Carvings & relief:** distant domed temple/palace on grand stair with a crescent moon finial on the dome spire; pediment portico with columns; gilded crown-shaped lantern caps on tall white columns (gold open-crown cages); temple-front buildings with columns; red swagged drapery tied around columns.
- **Edges & profiles:** balustrade with turned balusters and flat coping; domes; stepped stair; drapery swags.
- **Surfaces & materials:** white marble, gold, red fabric, glowing cyan crystals, teal dome.
- **Objects:** tall columns with gold crown caps, red drapery swags, balustrades, planters of pink roses, grand staircase, cyan crystal spires, crescent moon finial, small sparkle.
- **Lighting/FX details:** night sky with stars, warm floor light, cyan crystal glow, sparkles.
- **Build components:**
  - Gold crown-cage column cap — Blender mesh + gold shader — gate pillars, bridge pillars
  - Crescent moon dome finial — Blender mesh + emissive — castle main dome
  - Cyan crystal spire cluster behind roofline — mesh + emissive translucent shader — castle crown
  - Red drapery swag around column — cloth mesh — ballroom festivities
  - Grand balustraded stair approach — Blender mesh — castle entrance

### U357
- **Patterns:** papel picado banners (cut-paper flags with pierced lace patterns in pink, blue, yellow, purple) strung in long swags; cobblestones; scrolled volute relief on fountain; orange-flower garlands spilling over arcades; Mexican tile-roof edges.
- **Carvings & relief:** two-tier stone fountain with C-scroll/volute-carved bowl rims, central urn-shaped stem and finial, water dripping in icicle-like strands — fully 3D; mission-style church façade with curvilinear gable, sunburst medallion and colourful painted relief; arched niches; sun relief on side wall; round arcades on columns. (Skull decorations in the reference — not used.)
- **Edges & profiles:** curvilinear (espadaña) gable; round arches; thick rounded stucco edges; heavy eave beams.
- **Surfaces & materials:** stylised dark-purple stone (night version), terracotta/stucco, painted wood, wax candles, paper.
- **Objects:** tiered fountain on a circular plinth ringed with candles and flowers, papel picado strings, cast-iron lamp posts with lantern heads, wall lanterns, cacti and agave in pots, potted rose bush, candles on the ground, flower garlands (marigold), arched windows, balconies with railings, neon sign (off-theme), wreath.
- **Lighting/FX details:** night blue haze with candle points; day version with strong god-rays through the archway and floating petal/dust particles.
- **Build components:**
  - Papel picado cut-paper banner strings — alpha-cutout plane instancing + subtle wind shader — festival streets, courtyard (use castle motifs instead of skulls)
  - Volute-carved two-tier fountain ringed with candles — Blender mesh + emissive candles — market square
  - Flower-garland arcade overhang — alpha-card mesh — courtyard arcades
  - God-rays with drifting petals — shader cards + particles — gateway arch

### U358
- **Patterns:** crazy/irregular flagstone paving with cracks; fluted Doric columns; stepped stylobate.
- **Carvings & relief:** small Greek temple fronts (pediment, Doric-like columns with plain capitals, simple entablature) — 3D; glowing orange-red interior doors.
- **Edges & profiles:** triangular pediments, stepped platforms, broken weathered edges.
- **Surfaces & materials:** stylised sandstone, moss, cracked stone.
- **Objects:** temple shrines, mossy boulders, cypress trees, stone steps, broken blocks, mountains.
- **Lighting/FX details:** glowing ember-orange doorways, bright sun.
- **Build components:**
  - Small columned temple shrine with glowing door — Blender mesh + emissive — Glowwood ruins
  - Cracked crazy-paving flagstones — tiling normal map — ruined paths
  - Mossy broken stone block — mesh + moss blend shader — ruins

### U359
- **Patterns:** irregular flagstones; column fluting; terraced stone walls.
- **Carvings & relief:** small temples with pediments and columns (Ionic-ish); short stone pillars topped by small amber flame bowls/lantern finials; stair flights.
- **Edges & profiles:** pediments; stepped terraces; rounded worn edges.
- **Surfaces & materials:** stylised sandstone, moss, green grass.
- **Objects:** temples, huge gnarled trees (baobab-like with umbrella canopies), stone pillars with glowing finials, stairs, boulders, distant cliffs with terraces.
- **Lighting/FX details:** bright sunlight, soft haze.
- **Build components:**
  - Gnarled umbrella-canopy tree — Blender mesh + leaf cards — Glowwood
  - Stone pillar with amber flame finial — Blender mesh + emissive — path markers
  - Pedimented temple shrine — Blender mesh — ruins

### U360
- **Patterns:** chevron/zig-zag bands in blue and gold on wall bases; repeating tall lancet-like windows with gold frames; blue slate roofs; diamond (rhombus) relief panels on terrace walls; formal parterre gardens; concentric ring fountains; rows of lamp posts.
- **Carvings & relief:** central clock/dome tower with gold Art Deco-Baroque framing, clock faces and gilded circular emblems, ribbed cupola dome with lantern — deep relief/3D; corner towers with small domes and pinnacles; giant armillary-sphere / astrolabe sculpture (gold rings and spokes) on a stepped gilded ziggurat platform — fully 3D; gazebo rotunda with blue dome; balustraded terraces.
- **Edges & profiles:** stepped terrace walls, gold edge piping on every frame, arched window heads, pinnacles, dome ribs.
- **Surfaces & materials:** white/cream stone, polished gold, cobalt-blue enamel inlays and roofs, glass, lawns.
- **Objects:** armillary sphere monument, clock towers, domed rotunda gazebo, street lamps (rows of globe lamps), banners (blue vertical), fountains, trees (conifers), hedges, figures (skip), birds.
- **Lighting/FX details:** daylight with light shafts from the top left; gold specular highlights.
- **Build components:**
  - Giant gold armillary-sphere monument on a stepped ziggurat — Blender mesh + gold shader (slow ring rotation) — central plaza / observatory
  - Gold-framed clock tower with blue enamel inlays — Blender mesh + emissive clock face — castle keep
  - Blue-and-gold chevron wall band — decal / normal map — palace plinths
  - Diamond relief terrace wall panel — normal map — terrace walls
  - Blue-domed rotunda gazebo — Blender mesh — gardens
  - Concentric ring fountain — Blender mesh + water shader — forecourt

### U361
- **Patterns:** vertical fluting/ribbing on the central white tower shaft; repeating arcade bays (round-arched windows) along the white curtain wall at left; repeated balustrade posts along the zig-zag switchback stair-road; serried spire pinnacles on the golden right-hand wing; wildflower scatter (pink/white/blue) as a meadow pattern.
- **Carvings & relief:** central tower is a flared "tulip/throne" form — a tall slab shaft splaying into a wide skirt with gold-edged scroll volutes at the flare (deep relief/fully 3D); two lozenge-shaped amethyst gem insets set vertically on the tower face (fully 3D inset); small domed rotunda/tholos tower with column ring at far left (fully 3D); domed pavilion behind left wing with arched openings; golden wing at right has tall pointed pinnacles/finials and buttress piers (deep relief); stair-road lined with square balustrade posts with cap stones.
- **Edges & profiles:** thin gold edge piping outlining every white panel of the main tower (catches warm light as bright line); flat parapet tops with small cornice on left wing; pointed spirelets on gold wing; switchback ramp with low parapet walls.
- **Surfaces & materials:** white polished marble with gold/brass trim; violet amethyst crystal insets with inner glow; sandstone-gold wing in warmer tone; grass terraces; pale stone road.
- **Objects:** castle with white main keep and gold side wing, domed rotunda, switchback causeway with posts, conifer trees (fir/spruce), deciduous round trees, boulders, wildflower meadows, a winding dirt path, figure with antlered headdress sitting in foreground (figure only), flying birds, cumulus clouds, distant mountains.
- **Lighting/FX details:** bright daylight, strong rim light on gold trims, soft glow on violet gems; cloud mass framing the castle. (Night conversion: gems become emissive beacons.)
- **Build components:**
  - Flared Throne Tower — Blender mesh (curved slab panels, gold piping bevel strips) — central castle keep spire.
  - Gold Edge Piping Trim — Blender mesh (thin bevelled curve along panel edges) + metallic shader — all castle white-marble panels.
  - Amethyst Lozenge Inset — Blender mesh + emissive gem shader — tower facades, gate keystone.
  - Switchback Balustraded Ramp — Blender mesh (modular ramp + post kit) — castle approach road.
  - Mini Tholos Turret — Blender mesh (column ring + dome) — corner turrets of curtain wall.
  - Meadow Flower Scatter — instanced particles — castle lawns / Glowwood edges.

### U362
- **Patterns:** column colonnades (peripteral rings) on the tiered rotunda; horizontal ring bands of tiers; stair-flight treads; tall rectangular niches/slots around the drum.
- **Carvings & relief:** stepped "wedding-cake" circular temple of 4–5 drums each with engaged columns (Doric-like, plain capitals) (deep relief); crowning eagle/bird statue on top (fully 3D — replace with abstract finial); free-standing ruined column pairs with architrave (trilithon/portico fragment) at left; distant hilltop temple with pediment, colonnade and central monumental stair (fully 3D); pink-stone column ruins on small floating islet with banner/cloth draped on top.
- **Edges & profiles:** stepped circular cornices at each tier; dramatic diagonal grand staircase with side cheek walls wrapping the base; broken column tops; floating rock islands with inverted-cone undersides.
- **Surfaces & materials:** warm sandstone/ochre stone (sunlit), white marble temple, pink-granite ruins; grassy cliff tops; waterfalls.
- **Objects:** tiered rotunda temple, ruined columns, hilltop temple with staircase, floating rock islets (small chunks), waterfalls off cliff edges, cypress/pine trees, mist clouds, flock of birds, sun with long light ray.
- **Lighting/FX details:** sun star-flare with diagonal light streak, waterfall spray mist at bases, soft atmospheric haze, birds as particles.
- **Build components:**
  - Tiered Colonnade Rotunda — Blender mesh (stacked drums + column arrays) — observatory/ring-walkway hub tower.
  - Floating Rock Islet — Blender mesh (inverted cone rock, sculpted) + slow bob animation — sky above castle moat.
  - Ruined Column Pair (trilithon) — Blender mesh — garden folly / Glowwood ruins.
  - Cliff Waterfall + Spray — shader (scrolling UV water) + particle mist — castle cliff edge.
  - Wrapping Grand Stair — Blender mesh — approach to ballroom tower.

### U363
- **Patterns:** tall paired lancet window bays (Gothic) on rock-tower faces; arcade of tall round/pointed arches along a cliff-top aqueduct/wall; village roof patterns (red and slate roofs); horizontal cloud-sea bands.
- **Carvings & relief:** monolithic rock-mesa towers carved into Gothic facades with tall pointed blind arches, small balcony/loggia at base (deep relief); stepped temple (stupa/pagoda-like tiered tower) on a floating rock at right with layered tiers (fully 3D); huge cathedral-like walls with buttress piers behind (deep relief).
- **Edges & profiles:** vertical pilaster strips, pointed arch tops, ruined broken parapets; tower tops overgrown with trees.
- **Surfaces & materials:** warm sandstone carved directly out of living rock (rock grading into masonry); moss and vines; grey slab boulders; cloud sea below.
- **Objects:** rock-carved tower-temples, hillside village with cottages, aqueduct/arched wall, floating tiered shrine, pine/cypress trees, broadleaf trees growing on tower tops, boulders, distant spires, cloud sea.
- **Lighting/FX details:** warm sunrise light, teal sky, soft volumetric haze, layered fog bands below the islands.
- **Build components:**
  - Rock-to-Masonry Blend Shader — shader (height-blended rock/ashlar textures) — castle foundation cliffs.
  - Carved Cliff Facade (paired lancets) — Blender mesh + normal map — cliff faces under the castle.
  - Cloud Sea Layer — shader (scrolling noise planes) — world below floating islands.
  - Tree-crowned Ruin Tower — Blender mesh + foliage cards — Glowwood ruins.
  - Tiered Shrine Islet — Blender mesh — floating island waypoint.

### U364
- **Patterns:** fluted column shafts (Ionic/Doric fluting) all round; running blue-and-orange ornamental band on the frieze of each pier (a meander/Greek key-like band in blue on gold-orange); gold "dentil/stepped" bead line above friezes; circular rosette medallions (red rings with radial spokes) set into the purple floor; concentric ring paving on the outer circular terrace; radial joint lines in paving; gold concentric bands on the dome top.
- **Carvings & relief:** composite piers made of paired fluted columns with gilt Ionic/composite capitals (deep relief); stepped multi-fascia architrave/entablature; tree-of-life/palmette emblem relief in gold on a white attic panel (shallow relief); winged statues (pegasus/griffin-like winged figures) crowning each pier corner (fully 3D — use faceless winged forms or abstract wings); domed rotunda with blue enamel bands and gold cap; cracked ruined pier wrapped in ivy; circular stone plinths with offerings (urn, small chest) on terrace; obelisk-like crystal on a round plinth (right).
- **Edges & profiles:** stacked stepped cornices with gold edge lines; semicircular arches between piers with red-orange inner reveal; rounded dome cornice ring; round plinth bevels; terrace edge with low rounded kerb; aqueduct arches under the ring path (left).
- **Surfaces & materials:** white weathered marble with gold leaf partially rubbed off (rusty-gold patina), sky-blue enamel paint bands, deep purple marble floor with red-gold inlay rings, mossy stone; cascading water.
- **Objects:** domed rotunda temple, winged statues, flowing blue silk banners hanging from piers (long ribbon banners), red rosette floor medallions, circular plinths/altars with urn and box, crystal obelisk on plinth, small round topiary trees, cypress trees, round reflecting pool (left), water channels running across the terrace, waterfall pouring from a crack, aqueduct arcade, cloud ring.
- **Lighting/FX details:** bright daylight, waterfalls with mist, cloud layer below; gilding catches sun.
- **Build components:**
  - Paired Fluted Pier w/ Gilt Capitals — Blender mesh + normal map (fluting) — ballroom portico, castle gate.
  - Blue Enamel Key Frieze — decal/trim sheet (meander band) — entablatures throughout castle.
  - Floor Rosette Medallion — decal + emissive shader rim — ballroom floor, ring walkway nodes.
  - Silk Ribbon Banner — Blender cloth-sim mesh + vertex wind shader — hung from castle piers.
  - Round Offering Plinth — Blender mesh — garden terraces.
  - Water Channel Inlay — shader (flowing water strip in paving) — ring walkways.
  - Worn Gilding Shader — shader (gold mask with edge wear) — all gilt trims.

### U365
- **Patterns:** repeated arched window arcade around tower drum; rainbow-striped awnings/canopies (pastel pink/blue/yellow/violet bands); pennant/bunting triangle flags strung in the sky; ring bands around the cylindrical tower; scalloped umbrella edges.
- **Carvings & relief:** cylindrical stacked tower built into giant tree trunk; ring balconies with balustrades and circular bands (deep relief); gothic-arched gateway building at base (deep relief); domed onion-like turrets (pink, peach) with finials (fully 3D); stacked lantern-tower/pagoda finial post near figure (fully 3D, layered discs).
- **Edges & profiles:** rounded projecting balconies, ring cornices, overhanging mushroom-cap platforms; pointed-arch doorways.
- **Surfaces & materials:** warm brown/terracotta stone, pastel painted fabric canopies, mossy tree-top canopies (flat-topped round foliage pads like bonsai), turquoise domes.
- **Objects:** giant tree with tower city, rainbow umbrella-canopy (giant parasol over table/stall), small red parasols, mushroom-cap pavilions, stacked lantern/pagoda posts, floating pennant flags (falling streamers), bonsai-like flat-topped trees, figure with bag (figure), path, grass, ferns in foreground.
- **Lighting/FX details:** dreamy pastel daylight, floating confetti/streamer particles, soft haze; stars visible at top.
- **Build components:**
  - Rainbow Stripe Parasol/Canopy — Blender mesh + stripe shader — birthday party stalls, plaza.
  - Floating Pennant Streamers — particle (sprite pennants drifting) — party sky over castle.
  - Tree-Trunk Ring Balcony — Blender mesh (curved balustrade ring) — Glowwood great tree.
  - Bonsai Canopy Pads — Blender mesh/foliage cards — Glowwood trees.
  - Stacked Lantern Pagoda Post — Blender mesh + emissive — Glowwood paths.

### U366
- **Patterns:** column ring arcade on dome drums; arched window bays around the drum; ribbed dome segments; small window band in dome base; rows of slender conical spike-turrets along the wall.
- **Carvings & relief:** large domed tempietto with arched openings between pilasters, attic ring with small windows, lantern cupola with tall spire (deep relief/fully 3D); second domed tholos with plain columns (peripteral ring); conical "bullet" turrets with ringed bases and band mouldings (fully 3D); low crenellated foreground walls with spike pinnacles.
- **Edges & profiles:** stacked cornices at drum and attic, pointed conical spires, rounded dome profiles, lantern finial.
- **Surfaces & materials:** blue-grey slate domes (glossy), pale grey stone, golden-yellow moss/lichen carpeting rocks; huge white boulders; swirling painterly clouds.
- **Objects:** domed rotundas, cone towers, boulders, walls with spike posts, distant spires, golden flowering moss patches.
- **Lighting/FX details:** warm diffuse light, swirling cloud vortex sky, golden glow on moss.
- **Build components:**
  - Domed Tempietto w/ Lantern Spire — Blender mesh — ballroom dome / observatory.
  - Bullet Cone Turret — Blender mesh (lathe profile with ring bands) — curtain wall corners, ring walkway pylons.
  - Spike Pinnacle Post — Blender mesh — wall parapets, bridge railings.
  - Golden Moss Carpet — shader (slope-mask yellow moss on rock) + glow at night — Glowwood rocks.
  - Swirl Cloud Sky — shader (domain-warped noise) — skybox.

### U367
- **Patterns:** stepped mass of blocky towers forming a pyramid silhouette; window slits in rows on tower faces.
- **Carvings & relief:** little detail — rectangular towers and keep, a tall pointed central spire cluster; flat curtain wall front with square towers.
- **Edges & profiles:** flat-topped square towers, stepped massing, curtain wall with corner towers.
- **Surfaces & materials:** warm lit stone vs. cool violet shadows; painterly snow/dune plain.
- **Objects:** citadel on a hill, rider on horse (figure), winding road, rocky cliff at right, flock of birds, big cumulus clouds.
- **Lighting/FX details:** golden hour key light on citadel, lavender ambient, rim-lit clouds.
- **Build components:**
  - Stepped Citadel Silhouette — Blender low-poly mesh (stacked block towers) — distant backdrop LOD.
  - Lavender Dusk Colour Grade — post-process shader — night-to-dusk transitions.
  - Winding Pale Road — decal/spline mesh — approach roads.

### U368
- **Patterns:** tall pointed Gothic arch windows (ruined, open) in the keep; arcade of large blind arches in the rock-cut base; crenellations on small towers.
- **Carvings & relief:** ruined cathedral-castle keep with giant lancet window openings and buttress piers (deep relief); cliff base carved with huge round arches (viaduct-like); small round towers with conical caps; lower round tower with grey slate roof.
- **Edges & profiles:** broken jagged parapets, square merlons on lower turrets, tall pointed arches, conical spire on a small tower.
- **Surfaces & materials:** grey-ochre weathered stone with moss, castle merging into a forested crag.
- **Objects:** castle on crag, forest, meadow, distant mountains, flock of birds, outlying tower ruin at right.
- **Lighting/FX details:** teal-green tint grade, golden cloud backlighting, atmospheric depth.
- **Build components:**
  - Ruined Lancet Window Wall — Blender mesh + broken-edge normal map — ruins in Glowwood.
  - Crag-Base Arch Viaduct — Blender mesh — castle foundation.
  - Moss-on-Stone Shader — shader (top-facing moss mask) — all old walls.

### U369
- **Patterns:** repeated arches of a stone bridge; tall vertical buttress/pier rhythm on the cathedral-castle; town roofs (red/brown tiles).
- **Carvings & relief:** massive Gothic keep with tall lancet window recesses, buttress piers and pinnacle spires (deep relief); slender spire tower connected by a flying arched bridge (fully 3D) — tower with conical red roof and needle spire; segmental-arch stone bridge with cutwaters (fully 3D); crowded town houses at the foot.
- **Edges & profiles:** needle spires, flying arch bridge between towers, steep gables, arched bridge spans with pointed cutwater piers.
- **Surfaces & materials:** grey basalt-like stone, red tile roofs, calm reflective lake water, mossy shores.
- **Objects:** castle-cathedral, town, flying bridge, spire tower, arched lake bridge, lake, trees, mountains, birds.
- **Lighting/FX details:** misty soft daylight, reflections on still lake, haze in valley.
- **Build components:**
  - Flying Arch Sky-Bridge — Blender mesh — link between castle towers / ring walkways.
  - Needle Spire Turret — Blender mesh — castle skyline.
  - Arched Lake Bridge w/ Cutwaters — Blender mesh — moat bridge.
  - Mirror Lake Water — shader (planar reflection + ripples) — moat/lake.

### U370
- **Patterns:** machicolation corbel rows under parapets (rows of small arches/corbels); square crenellations (merlons) on all walls; window slits; chevron/zig-zag gold pattern on great door and banners.
- **Carvings & relief:** monumental gatehouse with deep round-arched (slightly pointed) portal in recessed orders (deep relief), crest/badge above arch keystone; towers with orange conical/pyramidal roofs, dormer lucarnes (fully 3D); bartizans (corbelled turrets) on corners; inner gatehouse with portcullis (iron grid) and hanging gold banners; slender pinnacle posts along outer wall.
- **Edges & profiles:** corbelled machicolations, square merlons, pointed roofs with finials and flag poles, arch with layered voussoirs.
- **Surfaces & materials:** tan/grey ashlar, orange terracotta roof tiles, copper/orange great wooden door with gold chevron inlay, iron portcullis, gold-yellow fabric banners and pennant flags.
- **Objects:** castle, gatehouses, portcullis, great door, banners (hanging pendant banners with chevron), pennants streaming, flag poles, trees (broadleaf), shrubs, puddles/stream, path, figure in red (figure), distant snowy mountain.
- **Lighting/FX details:** daylight with soft haze, glowing door (warm), floating yellow streamers.
- **Build components:**
  - Machicolated Parapet Strip — Blender mesh (corbel + merlon modular) — castle walls.
  - Grand Arched Gate w/ Chevron Door — Blender mesh + normal map + gold inlay decal — castle main gate.
  - Portcullis Grille — Blender mesh (instanced bars) — gatehouse.
  - Chevron Pendant Banner — Blender cloth mesh + decal — gate towers.
  - Corbelled Bartizan Turret — Blender mesh — wall corners.
  - Conical Tile Roof w/ Dormer — Blender mesh + tile normal map — towers.

### U371
- **Patterns:** vertical buttress-and-pinnacle rhythm around the hilltop cathedral-castle; repeating conical spire roofs (terracotta and blue-slate) across the town; half-timbering (framed timber patterns) on town gables; repeated arches of the harbour bridge/quay; parapet merlons along the spiral ring wall.
- **Carvings & relief:** left castle: tall Gothic hall with a large arched stained-glass window (figural rose/lancet glass, warm colours) on the gable front; openwork tracery crown — a pierced gable/tower of slender pinnacle uprights carrying a gold onion finial (bar-tracery skeleton spire) (fully 3D); gold onion/bulb dome on a side tower; pinnacled buttresses all round the base (deep relief). Right castle: white wedding-cake castle with stacked cylindrical towers, conical terracotta and blue spires, an orange segmented dome, and a curving spiral ramp/wall wrapping the hill. Town: steep gables, dormers, chimneys.
- **Edges & profiles:** needle spires and pinnacles; spiral ring wall with parapet; arched sea-wall arcades at waterline; pointed roofs.
- **Surfaces & materials:** cream limestone and white plaster, gold-leaf domes/finials, terracotta tiles, slate-blue roof tiles, stained glass, sea water.
- **Objects:** two castles, dense hill town, harbour quay with arched bridge, sea, chimney smoke drifts, flowering yellow trees (lower right), forested hills, birds.
- **Lighting/FX details:** late-afternoon sun with soft blue haze; smoke/mist ribbons drifting through the town; stained glass window looks backlit.
- **Build components:**
  - Pierced Tracery Spire Crown — Blender mesh (open frame of pinnacle uprights + gold onion finial) — top of castle main tower.
  - Gable Stained-Glass Lancet Window — Blender mesh frame + emissive stained-glass shader — castle hall / ballroom facade.
  - Spiral Ring Wall Ramp — Blender mesh (spline-extruded parapet ramp) — ring walkways around castle hill.
  - Gold Onion Dome — Blender mesh + gold shader — side towers.
  - Town House Kit (half-timber gables) — Blender mesh + trim sheet — village below castle.
  - Drifting Smoke Ribbons — particle/billboard — town atmosphere.

### U372
- **Patterns:** few — stratified mesas, terraced waterfall steps (tiered cascades), meteor streaks.
- **Carvings & relief:** none (natural landscape).
- **Edges & profiles:** needle-like mountain spires, flat-topped mesas with waterfalls dropping off their edges, steep pinnacle crag with trees on top.
- **Surfaces & materials:** pale blue mountains, green plains, mist.
- **Objects:** giant moon/planet in sky, shooting stars/meteors (pink-violet streaks), mountain spires, mesas, waterfalls, river, plains, clouds, birds.
- **Lighting/FX details:** bright sun glow left, pink and violet cloud rims, meteor trails, haze layers.
- **Build components:**
  - Giant Moon Disc — shader (textured sky sprite with rim glow) — night skybox.
  - Shooting Star Streaks — particle (streak trails, pink/violet) — night sky above castle.
  - Mesa Waterfall Tiers — Blender mesh + water shader — distant backdrop.

### U373
- **Patterns:** spiky gothic spire cluster silhouettes; crystal shard clusters (vertical quartz-like spikes) at right.
- **Carvings & relief:** distant dark gothic castle with tall needle spire and lacy openwork silhouette (flying buttress-like arcs) — little resolvable detail.
- **Edges & profiles:** needle spires, jagged rock pinnacles, crystal spike silhouettes.
- **Surfaces & materials:** dark stone silhouettes; luminous pale-blue crystal spires; lake water; red-leaved shrubs/trees.
- **Objects:** gothic castle, setting sun, second moon, giant crystal spires, rock pinnacles, lake, red/magenta trees, lavender/wild flowers in foreground, birds.
- **Lighting/FX details:** strong sun glow pink-gold, mist on lake, crystals faintly glowing blue, reflection streak on water.
- **Build components:**
  - Giant Crystal Spire Cluster — Blender mesh + emissive/translucent crystal shader — Glowwood edges, castle crystal garden.
  - Lake Mist Layer — shader (low fog planes) — moat at night.
  - Red-Leaf Tree — foliage mesh — Glowwood accent trees.
  - Lavender Clump Scatter — instanced mesh — lakeside paths.

### U374
- **Patterns:** repeated arched arcade/viaduct (aqueduct with tall piers) running from the castle; rows of tall vertical windows on palace blocks.
- **Carvings & relief:** white palace-castle stacked on a cliff with multiple tall towers, a tall slender belfry-like tower with lantern, pointed spirelets (deep relief, low-res); ruined colonnade/viaduct stretching across fog.
- **Edges & profiles:** flat parapets, slender towers, broken rock pinnacles, viaduct of tall arches.
- **Surfaces & materials:** pale stone, rocky red-orange plateaus, autumn-coloured trees.
- **Objects:** castle, viaduct/aqueduct, rock spires, canyon cliffs, autumn trees, fog sea, glowing golden giant tree/energy cloud at right (huge bright light mass), distant ruined walls.
- **Lighting/FX details:** dusk pinks, huge golden glow source (like a world-tree of light) with bloom, thick ground fog.
- **Build components:**
  - Fog-Spanning Arched Viaduct — Blender mesh (modular arch bay) — bridge from castle to outer ring.
  - Golden Glow Tree Beacon — shader (additive glow volume) + particles — Glowwood centrepiece seen from distance.
  - Ground Fog Volume — shader — low valleys.

### U375
- **Patterns:** many gothic spires and pinnacles; arched bridge arcades; tiered pagoda-like towers (stacked rings with glowing windows).
- **Carvings & relief:** floating island citadels carrying cathedral-like towers, onion domes and a tiered pagoda tower (fully 3D, dark silhouettes); a slender arched bridge connecting islands; a statue of a mounted rider with lance on a round plinth (foreground, fully 3D — figure); floating rock fragments.
- **Edges & profiles:** jagged undersides of floating islands with hanging roots/rocks; needle spires; arched bridges.
- **Surfaces & materials:** dark slate stone, warm amber window light, violet and cyan magical light beams.
- **Objects:** floating islands, castles, bridge, statue on pedestal, waterfalls pouring off islands, giant crescent moon/planet, floating debris rocks, stone arch bridge in foreground, lanterns/fires.
- **Lighting/FX details:** cyan and violet energy beams shooting vertically from spire tips, glowing orbs at beam ends, amber windows, deep blue night palette with moon rim light, mist.
- **Build components:**
  - Spire Light-Beam Emitter — shader (additive vertical beam) + orb sprite — castle spire tips at night.
  - Floating Island Underside — Blender mesh (stalactite rock base) — sky islands.
  - Amber Window Glow Panels — emissive shader/decal — every castle window at night.
  - Island-Link Arch Bridge — Blender mesh — between floating islands.
  - Island Waterfall Ribbon — shader — island edges.

### U376
- **Patterns:** clustered spires/pinnacles; stepped tiers.
- **Carvings & relief:** distant cathedral-castle with tall central spire and many pinnacle towers (deep relief, misty); vine-covered ruined pillars at left; overgrown ruined bridge/causeway arches with a tree on top.
- **Edges & profiles:** soft spire silhouettes in haze, broken bridge edges.
- **Surfaces & materials:** pink-gold lit stone, mossy ruins, turquoise shallow water with foam.
- **Objects:** castle, waterfalls, jungle trees, palm-like trees, ruined causeway, boulders in water, distant ship/sailboat, small islands, glowing violet spark motes on the water.
- **Lighting/FX details:** sunrise backlight with god rays and haze, magenta sparkles on water, waterfall mist.
- **Build components:**
  - Overgrown Ruined Causeway — Blender mesh + moss shader — Glowwood lake.
  - Shallow Turquoise Water w/ Foam — shader — lake shore.
  - Magic Sparkle Motes (violet) — particle — water surface at night.

### U377
- **Patterns:** cluster of tall thin spires; drooping hanging vines (curtain of willow tendrils) at left.
- **Carvings & relief:** fairy castle of slender pointed towers built into cliff; arched gateway; little detail.
- **Edges & profiles:** needle spires, sharp rock pinnacles.
- **Surfaces & materials:** violet stone, glowing turquoise water, magenta flowering bushes.
- **Objects:** castle, waterfalls (multiple), lake, flowering azalea/rhododendron-like magenta shrubs, lone tree, hanging-vine tree, birds, purple mountains.
- **Lighting/FX details:** glowing cyan lake surface (bioluminescent), violet dusk sky, floating motes.
- **Build components:**
  - Bioluminescent Lake Shader — shader (emissive cyan with fresnel) — moat / Glowwood pond.
  - Magenta Blossom Shrub — foliage mesh + emissive tint — Glowwood.
  - Hanging Vine Curtain — alpha cards + wind shader — Glowwood tree edges.

### U378
- **Patterns:** forest of conical needle spires (dozens), rows of lit windows, crenellated parapets, arched bridge bays.
- **Carvings & relief:** gothic castle complex with tall round towers capped by tall conical spires, square keeps, a big pointed-roof keep with flag; multi-arched stone bridge connecting castle halves over a gorge (fully 3D); gatehouse at bridge end; lone slender watchtower in field.
- **Edges & profiles:** very steep conical roofs, crenellations, corbelled turret tops, round-arched bridge spans.
- **Surfaces & materials:** dark grey stone, warm yellow window light, blue-violet uplight washing walls, green terraced fields, dry-stone walls.
- **Objects:** castle, bridge, banners/flags, watchtower, fields with hedgerows/stone walls, wooden fence, rocky foreground path, snowy mountains, floating cliff.
- **Lighting/FX details:** blue-violet floodlighting on walls from below, warm window glows, dramatic dusk clouds with rose rim light.
- **Build components:**
  - Blue Facade Uplight — shader/light (coloured spotlights + light-cookie gradient on walls) — castle at night.
  - Needle Spire Cluster Kit — Blender mesh (round tower + tall cone roof variants) — castle skyline.
  - Gorge Arch Bridge w/ Gatehouse — Blender mesh — main bridge.
  - Lit Window Atlas — emissive texture/decal — towers.

### U379
- **Patterns:** stained-glass diamond/lancet panels in gilded frames on the grand gates (teal and amber leaded glass, lozenge and pointed-arch panes); fan/shell motif in gold above the palace's central window; trimmed hedge rows; paving inlay stripes in blue/purple with gold lines (processional carpet path); balustrade rows on staircases; ribbed blue domes.
- **Carvings & relief:** colossal gilded open gates (tall leaves with gold lattice framing, crest-topped finials); flanking statues of winged figures with sword/spear and halo crown (fully 3D — must be veiled/faceless in our game); palace facade with tall gold-framed pilasters ending in winged/arrow-shaped gold ornaments, central gold sword-like vertical ornament, pediment with gold bands; four domed corner turrets with lantern finials; round gold-columned pavilion/rotunda in front (gold colonnade with entablature); grand stairs with green-carpet stripes; lamp/lantern posts in plaza.
- **Edges & profiles:** pointed Gothic windows outlined with gold piping; cornice with gold strip; gate leaf edges with thick gold rails; stepped plinths.
- **Surfaces & materials:** white/cream marble, polished gold (strong specular), teal-blue stained glass, blue glazed domes, purple and blue polished floor stone, ivy.
- **Objects:** grand gates, winged statues, palace, domed turrets, gold rotunda pavilion, grand staircase, bronze lantern sconces (hexagonal lanterns at base of walls), hedges, ivy curtains, flower beds, airship (zeppelin) in sky, mountain behind, trees.
- **Lighting/FX details:** bright clean daylight, metallic gold reflections, glass translucency in gates.
- **Build components:**
  - Gilded Stained-Glass Grand Gate — Blender mesh + leaded-glass shader (emissive at night) — castle main gate.
  - Veiled Winged Guardian Statue — Blender mesh (hooded/veiled faceless figure with gilt wings and halo) — gate flanks.
  - Gold-Piped Lancet Window — Blender mesh + stained glass — gatehouse walls.
  - Processional Inlay Path — decal/texture (blue-purple stripes, gold lines) — castle approach, ballroom aisle.
  - Gold Colonnade Rotunda — Blender mesh — plaza pavilion / bandstand.
  - Hexagonal Bronze Ground Lantern — Blender mesh + emissive — wall bases, garden beds.
  - Airship Prop — Blender mesh — sky ambience.

### U380
- **Patterns:** art-deco fan/sunburst grilles (stylised fountain/arch motif in gold on teal glass doors); large astronomical clock rose window — concentric rings, spiral inner dial, gear-tooth outer ring, star-studded dial rim, gold Roman-style ring segments; square stone paving with inscribed corner lines (tile grid with hairline border); stepped ziggurat fountain base with gold edge bands; triangular teal crystal inlays; hanging banners with emblem (star/compass rose) and pointed swallowtail bottoms; diamond-quarry teal windows.
- **Carvings & relief:** giant round clock window set in a deep stepped arch (multiple recessed orders) with keystone cartouche (deep relief); curved projecting balcony with gold rim; armillary sphere sculpture — gold rings with teal enamel inlay channels, arrow-tipped ends and fin spikes orbiting a glowing water sphere, on a gold cup/chalice pedestal with teal crystals (fully 3D); stepped pyramid fountain plinth with gold-framed panels and incised spiral glyphs (shallow relief); small circular clock medallion on a gatehouse at right; arched bridges/aqueduct; semicircular barrel vaults.
- **Edges & profiles:** stepped arches, rounded rolls on archivolts, chamfered blocks, gold piping on every edge of the fountain, curved balcony edge, big flying arch rib sweeping across the sky.
- **Surfaces & materials:** pale limestone/ashlar, polished gold, teal enamel, glossy teal glass, glowing magical water, tinted lavender flower boxes.
- **Objects:** clock-window hall, armillary-sphere fountain, jet fountains (small vertical sprays in pool), circular pool basin with steps, banners, lamp posts, cypress trees, flower planters on rooftops, shopfront awnings in town, gold-armoured figure (figure), seagull (animal — skip), people (figures).
- **Lighting/FX details:** swirling water vortex inside the sphere with sparkles and light bubbles, bright glint where gold catches sun on fountain step, teal glow lines, light shafts in the plaza.
- **Build components:**
  - Astronomical Clock Rose Window — Blender mesh (rings, gears) + emissive glass shader + rotating hands — castle great hall facade / ballroom.
  - Armillary Sphere Fountain — Blender mesh (rotating gold rings w/ teal enamel channels) + swirling water shader + particles — central plaza / ring walkway hub.
  - Art-Deco Fan Door Grille — Blender mesh / normal map + gold decal — palace doors.
  - Stepped Fountain Plinth — Blender mesh + gold trim — fountain bases.
  - Swallowtail Emblem Banner — cloth mesh + decal — castle courtyard walls.
  - Inscribed Paving Tile — texture + normal map — plazas and ring walkways.
  - Stepped Archivolt Portal — Blender mesh — grand entrances.

### U381
- **Patterns:** three tall lancet windows of glowing teal-blue stained glass (vertical bar tracery in leaded panels); vertical organ-pipe cluster of fins/pilasters forming the crown of the central tower (bronze-gold and stone pipes of graded heights); colonnade of plain round columns in curved wings (crescent colonnade embracing the plaza); radial plaza paving with central star medallion; rows of vertical fountain jets around round basins; cypress trees in rows.
- **Carvings & relief:** central tower facade with rounded corner buttress drums and recessed arches framing the tall windows (deep relief); "organ-pipe" pinnacle crown (fully 3D); arched main door with teal glass and decorative arch hood; curved colonnade wings with flat entablature; round tower drums at ends with crenellated tops; plaza central statue (small, on plinth); lamp posts with gold finials lining the stair.
- **Edges & profiles:** rounded projecting drums, recessed stepped arches, flat cornices with soft bevels, bowl-shaped fountain rims.
- **Surfaces & materials:** pale grey-lavender stone, teal stained glass (emissive look), bronze/gold fins, water.
- **Objects:** palace, curved colonnades, circular fountain basins with jets (paired at either side), cypress trees, lamp posts, balustrades, flower beds (lavender), stairs, figures.
- **Lighting/FX details:** bright day; glass reads luminous teal; fountain spray.
- **Build components:**
  - Organ-Pipe Crown — Blender mesh (array of graded fins in bronze/stone) — top of ballroom/music tower.
  - Triple Lancet Teal Window Bay — Blender mesh + stained-glass emissive shader — palace facade.
  - Crescent Colonnade Wing — Blender mesh (curved column array) — enclosing castle forecourt.
  - Jet Fountain Basin — Blender mesh + water jet particles — forecourt.
  - Radial Star Plaza Paving — texture/decal — forecourt.

### U382
- **Patterns:** curling root/branch tangles (gnarled serpentine roots), spiral-twisted trunk; tiered tile roofs of village houses; mossy stone terrace walls.
- **Carvings & relief:** large celadon-green glazed ceramic jar/vase (ovoid with lid, raised mottled moss glaze) set in the tree roots (fully 3D); small lidded stone lantern/jar at base.
- **Edges & profiles:** flared eaves on village roofs, rounded mossy boulders.
- **Surfaces & materials:** jade/celadon glaze (glossy), brown twisted wood, mossy teal rocks, white plaster walls.
- **Objects:** ancient tree with blue-teal canopy, celadon jar, glowing blue orb/wisp in branches, white-blue magnolia-like flowers on branches (glowing lightly), small waterfall/stream under roots, ferns, village houses with tiered roofs, mountains, falling leaves.
- **Lighting/FX details:** blue orb glow, flower petals with faint glow, drifting leaf particles, overcast twilight.
- **Build components:**
  - Gnarled Root Throne Tree — Blender mesh (sculpted roots) + bark normal map — Glowwood centre.
  - Celadon Glazed Urn — Blender mesh + glossy crackle glaze shader — garden/Glowwood shrine.
  - Glowing Magnolia Blossom — mesh cards + emissive — Glowwood trees.
  - Wisp Orb — particle/emissive sprite — Glowwood ambient.

### U383
- **Patterns:** collage of four game screenshots (UI frame). Ring/halo motifs (giant circular hoop structures), radial light star.
- **Carvings & relief:** top-left: floating island town with a tall conical tower and a huge golden circular ring/halo arch structure, buildings on stilts with flared pagoda-like roofs (fully 3D); bottom-left: giant broken spiral ring portal over a stepped altar platform; bottom-right: thin white needle towers with saucer platforms and conical light skirts, a four-pointed star light in the sky.
- **Edges & profiles:** thin hoop arcs, spike needle towers, floating discs.
- **Surfaces & materials:** coral/terracotta rock, glowing gold, pale silver-white, warm magma glow in one panel.
- **Objects:** floating islands, ring portals, needle towers, saucer platforms, staircase altar, figures (ignore).
- **Lighting/FX details:** four-point star flare with horizontal streak, light cones under towers, lava/ember glow, floating motes.
- **Build components:**
  - Giant Halo Ring Arch — Blender mesh (torus segments) + emissive edge — sky-island portals / castle crown.
  - Needle Tower with Saucer Ring — Blender mesh + light-cone shader — distant beacon towers.
  - Star Flare Sprite (4-point) — shader/billboard — night sky "guiding star".
  - Spiral Ring Portal over Stair Altar — Blender mesh — Glowwood ritual site.

### U384
- **Patterns:** carved foliate/arabesque frieze panels (gold relief) on the capital blocks of the rotunda pillars; green-banded stripe bands (malachite/green enamel bands) on cornices and arches; large circular floor inlay with interlocking arcs and lozenge-shaped knots (engraved roundel pattern) in foreground; distant gothic arch-frames with gold-lined ogee/pointed arches.
- **Carvings & relief:** ruined circular tholos/rotunda with square pillars and block capitals carrying gold arabesque friezes (shallow relief), green-banded architrave; ruined arcade below with round arches outlined by green bands; small gilt stepped pediment/finial; a teal treasure chest with gold-rimmed arched lid; foreground bracket structure ending in volute scroll feet (double spiral scroll — Ionic volute-like) on a strut (fully 3D); diamond lozenge medallion on pier side; floating cathedral fragments with ribbed pointed-arch frames (right).
- **Edges & profiles:** broken cornices, rounded volute scrolls, stepped plinth edges, gilt edging on distant arches.
- **Surfaces & materials:** cream stone with gold relief, green enamel bands, blue-grey slate platform, mist.
- **Objects:** ruined rotunda, ruined arcade, pink cherry/sakura trees growing on ruins, teal treasure chest, sword planted in ground (glowing), volute-footed bracket/strut, floating rock islands with hanging stalactite shards, aqueduct/cathedral arches in mist, cloud sea, figure.
- **Lighting/FX details:** dense ground mist/cloud sea, soft pink blossom contrast, bright sky.
- **Build components:**
  - Ruined Tholos w/ Arabesque Capitals — Blender mesh + normal map + gold decal — Glowwood ruins / garden folly.
  - Volute-Scroll Bracket Strut — Blender mesh — bridge supports, railing ends.
  - Engraved Roundel Floor Inlay — normal map/decal — ring walkway platforms.
  - Sakura Ruin Tree — foliage mesh + petal particles — castle gardens.
  - Teal Gilded Treasure Chest — Blender mesh — interactive prop.
  - Green Enamel Band Trim — trim sheet — cornices.

### U385
- **Patterns:** wrought-iron scroll lattice (C- and S-scroll filigree) on the gate/arch; Baroque cartouche and swag relief (festoons) over the arcade arches; round medallions in spandrels; ribbon/streamer bunting with circular emblems; striped market awning; banners with heraldic sigils on lamp post.
- **Carvings & relief:** Baroque triple arcade gateway with deep carved scrollwork crest panels, medallion roundels (gold) in spandrels, ornate cresting (deep relief); domed tempietto/belvedere pavilions with columns and lanterns (left); tall paired bell towers/minarets with spires; colossal tower-city with stacked cylindrical towers and a giant gyroscope of orbiting rings around it (fully 3D); multi-arm cast-iron street lamp with four lanterns and scroll brackets (fully 3D).
- **Edges & profiles:** curved Baroque gables, scalloped draped valances, domes with lantern caps.
- **Surfaces & materials:** cream limestone, gilt medallions, black wrought iron, canvas, wood stalls, green copper roofs.
- **Objects:** four-lantern cast-iron lamp post with hanging banners, market umbrellas/parasols, canvas awnings, flower cart (green slatted cart), wooden barrels, crates, potted plants, lavender & yellow flowers, draped curtain swags and ribbon streamers, blue fabric drape tied back with gold cord (foreground), hanging lanterns (warm), trees on rooftops, cypress, figures.
- **Lighting/FX details:** bright sunlit clouds, luminous rings around tower.
- **Build components:**
  - Four-Arm Victorian Lamp Post w/ Banners — Blender mesh + emissive lanterns — castle town streets, bridges.
  - Baroque Scroll Arcade Gate — Blender mesh + normal map — market entrance.
  - Orbiting Gyro-Rings Around Tower — Blender mesh + rotation animation — castle main spire signature.
  - Market Stall Kit (parasol, cart, barrels, crates) — Blender mesh — birthday fair plaza.
  - Tied-Back Velvet Drape — cloth mesh — ballroom doorways.

### U386
- **Patterns:** gold diamond-lattice/rhombus stud pattern on the inner soffit (intrados) of the big round arches; red outer archivolt band; sunburst/radiant sun motif in gold relief on spandrels and wall panels; stepped gold Art-Deco brackets (zig-zag pyramidal brackets) at impost level; diamond lozenge (♦) studs on piers; zig-zag/diamond band frieze (lozenge chain) along terrace walls; cross-hatch diamond pattern on dark gold-framed panels with central sun emblem.
- **Carvings & relief:** monumental round arches (Roman triumphal-like), piers with gold stepped capitals (deep relief); star-shaped faceted lantern/stellated polyhedron atop a pillar (fully 3D, with glowing triangular windows); sun-emblem relief panels (shallow relief); arched window loggia building behind; armoured figure statue with spear (fully 3D — would need to be veiled); fringed draped valance.
- **Edges & profiles:** semicircular arches with thick red band and gold edge, stepped cornices, Art-Deco stepped brackets.
- **Surfaces & materials:** white/ivory marble, polished gold, deep red lacquer arch bands, black lacquer panels with gold, terracotta stone kerb.
- **Objects:** stellated star lantern on pillar, triumphal arches, palm trees/fan palms, cypress, potted spiky plants, gold-framed painting/screen on easel, gilded candle/lamp standards, tent stall, barrels, rugs rolls, black panels with sun emblem (folding screens), ceramic vase with gold band, wooden crate, garbage bag, full moon, figures.
- **Lighting/FX details:** strong sun; moon large; gold specular; glowing lantern triangles.
- **Build components:**
  - Stellated Star Lantern Finial — Blender mesh + emissive triangular panes — castle pier tops, gate posts.
  - Diamond-Lattice Arch Soffit — normal map/trim sheet — undersides of gate arches.
  - Red & Gold Triumphal Arch — Blender mesh — ring walkway entry arches.
  - Sun Emblem Relief Panel — decal + normal map — walls, folding screens.
  - Art-Deco Stepped Gold Bracket — Blender mesh — capitals/impost blocks.
  - Lozenge Chain Frieze — trim sheet — terrace parapets.

### U387
- **Patterns:** red vertical banner panels with gold sun/star medallion; diamond-in-square (lozenge) relief blocks; ochre-red arch band with inner gold edge and lattice soffit.
- **Carvings & relief:** large round arch gateway in white stone with red archivolt; stepped pilaster capitals with diamond inset (shallow relief); gold-framed pointed gable with red infill (left).
- **Edges & profiles:** semicircular arch with bold band; layered pilaster steps; inverted triangle gable.
- **Surfaces & materials:** white stone, red lacquer, gold; wet ground with puddle reflection; moss rocks.
- **Objects:** gateway arch, red sun banners, bonsai-shaped pine tree framed in the arch, lanterns on posts (small stone lanterns), climbing ivy, mossy boulders, autumn grasses, fallen leaves, large rain puddle.
- **Lighting/FX details:** mirror-like puddle reflection of gate (screen-space reflection), warm afternoon light.
- **Build components:**
  - Red-Banded Sun Gate Arch — Blender mesh — Glowwood entry / garden gate.
  - Sun-Medallion Banner — cloth mesh + decal — castle walls.
  - Puddle Reflection Decal — shader (masked planar reflection) — paths after rain / courtyard.
  - Framed Bonsai Pine — foliage mesh — courtyards.

### U388
- **Patterns:** coffered ceiling with stepped rectangular frames and ovals, filled with gold arabesque/scroll filigree (painted/relief vine scrolls); large oval ceiling medallion with concentric mouldings; floor of large chequered marble slabs (white/grey/charcoal) with inset square panels containing round medallions of acanthus/fleur scroll motifs in rust-red on sky-blue ground with gold borders; diamond and chevron inlays on the wall panels (triangle/diamond lattice in relief); leaded windows with frosted/textured glass in a stylised tree/branch pattern (Art Nouveau); balusters of the outer balcony (bulbous turned balusters); bronze railing with S-curved bars.
- **Carvings & relief:** Art Nouveau/Baroque horseshoe-ish round arches with multiple recessed rounded mouldings (soft rolled edges); columns with flared lotus/tulip-bell shafts (vase-shaped column sections) with blue-ringed collars and planter-cup bands; capitals with carved lotus/acanthus leaf crowns and green gem drops (deep relief); cross-shaped bracket wings on column shafts; carved horned/leaf corbels at arch springing; wall niches with planter shelves; balconies with bulbous baluster railings; a figure statue on a plinth (keep faceless).
- **Edges & profiles:** thick rounded roll mouldings outlining arches (stepped multi-roll architraves); cornice with rope bead; scalloped cresting along the cornice; window arches with round tops and cusp at springing.
- **Surfaces & materials:** warm cream/peach plaster and polished stone, gold leaf filigree on ceiling, polished marble floor (glossy reflections), cobalt blue painted bands, green enamel gems, crystal chandeliers, frosted glass.
- **Objects:** large tiered crystal chandeliers (candle arms with prismatic drops, several down the hall), wall sconces (globe lamps on brackets), urns/planters with ferns and flowering shrubs, footed bowl planters, blue-patterned porcelain planter pots, vases on floor, outdoor balconies with semicircular balcony bowls, bronze balcony railing, figures.
- **Lighting/FX details:** warm golden interior light, sparkles on chandelier crystals, night blue outside windows, glossy floor reflections.
- **Build components:**
  - Crystal Tiered Chandelier — Blender mesh (instanced drops) + refractive/sparkle shader + point light — ballroom.
  - Coffered Filigree Ceiling — Blender mesh (frames) + normal map + gold decal — ballroom ceiling.
  - Medallion Marble Floor Panel — texture + decal + glossy reflection — ballroom floor.
  - Lotus-Bell Column w/ Planter Collar — Blender mesh — ballroom arcade.
  - Multi-Roll Arch Surround — Blender mesh (swept profile) — ballroom windows/doors.
  - Art Nouveau Frosted Branch Window — texture/shader (frosted glass with lead lines) — ballroom windows.
  - Globe Wall Sconce — Blender mesh + emissive — corridor piers.
  - Bulbous Baluster Railing — Blender mesh (lathed baluster array) — balconies, ring walkways.

### U389
- **Patterns:** teal-glass barrel-vault and domed glass roofs (greenhouse/conservatory ribs — radial ribs on the glass dome); scalloped teal awnings/parasols; rows of tall teal arched windows with leaded panes; balustrade rows along terraces; long ribbon banners on the high wall; lavender planter rows.
- **Carvings & relief:** Beaux-Arts shopfront pavilions with gold ball/urn finials on pilaster tops, mansard roofs with dormers, ornate shaped gables with scroll volutes (deep relief); a clock face roundel set on a gate pier; rusticated archway passage (tunnel arch with voussoirs) at left with staircase; Baroque central niche with golden bell-shaped ornament above arched door; glass-domed rotunda kiosk with ribbed teal dome.
- **Edges & profiles:** curved mansard roofs, stepped cornices, arched windows with keystones, rounded balustrade terraces, grand stair flights with landings.
- **Surfaces & materials:** warm sandstone, slate-blue roofs, teal glass (translucent), gold finials, painted wall, lawn.
- **Objects:** shop pavilions, glass-domed kiosk, café umbrellas (teal round parasols), awnings, lamp posts with gold tops, cypress trees, lavender planters, yellow flowering shrubs, balustraded stairs, archway tunnel, banners, figures.
- **Lighting/FX details:** soft dusk/blue-hour ambient; glass reads cool; gold finials catch light.
- **Build components:**
  - Teal Glass Dome Kiosk — Blender mesh (ribbed dome) + transparent glass shader + interior emissive — castle town / ring walkway shops.
  - Beaux-Arts Shopfront Kit — Blender mesh (pilasters w/ ball finials, mansard, arched windows) — birthday fair street.
  - Scalloped Teal Parasol — Blender mesh — café terraces.
  - Clock Roundel Pier — Blender mesh + emissive dial — gate piers.
  - Lavender Planter Box — Blender mesh + instanced flowers — terraces/balustrades.

### U390
- **Patterns:** ribbed segmental domes (gores divided by gold ribs); blue-glazed dome with crackle/scale-like segment lines; arched window bands around drums; repeating corbel brackets under cornices; teal hip roofs with diamond pattern lines; paving with inset square panels.
- **Carvings & relief:** gilded ribbed dome with ring gallery of round openings (oculi) and lantern; tall gold crescent/hook finial (ring-and-crescent) on top; blue dome with gold crown of curved sweeping horn-like spikes (three tall swept gold blades rising from rim) — very distinctive; columned drum with arched windows edged in gold; pink/terracotta segmented dome; teal-roofed square towers; domed blue gazebo at lower left.
- **Edges & profiles:** saucer and bell domes, flared cornice skirts, gold edge piping along dome ribs and rims, sweeping blade finials.
- **Surfaces & materials:** polished gold (patchy, burnished), cobalt-teal glazed ceramic (glossy, with highlights), cream stone, terracotta.
- **Objects:** domed towers, gazebo, courtyard tree (large oak-like), cypress, paved plaza, steps, distant town, snowy mountains, ivy foliage foreground.
- **Lighting/FX details:** hazy cool daylight with lavender mountains; glossy dome specular highlights.
- **Build components:**
  - Swept-Blade Gold Dome Crown — Blender mesh — castle signature tower roofs.
  - Gilded Ribbed Dome w/ Oculus Gallery — Blender mesh + gold shader — ballroom dome.
  - Glazed Cobalt Dome Shader — shader (glossy ceramic with segment lines) — tower domes.
  - Crescent Ring Finial — Blender mesh — dome tops.
  - Domed Garden Gazebo — Blender mesh — castle gardens.

### U391
- **Patterns:** curved ribbed iron arches (pergola of hooked, crozier-like arches with scroll tips) in a row; crenellations and arched windows on the castle; stepping stone paving.
- **Carvings & relief:** fantasy stone citadel built against a mountain — round towers with domes, pointed gabled halls with rose-ish gable windows, ogee windows (deep relief); broken wall ruin at left; small kiosk with teal-glazed hip roof and gold cupola.
- **Edges & profiles:** shepherd's-crook/crozier-shaped arch posts (curved metal ribs with tear-drop scroll ends) on columnar stone bases; jagged mountain peaks.
- **Surfaces & materials:** cream stone, teal glazed roof tiles, dark iron/bronze ribs, giant blue faceted crystal (sapphire, with grooved strata), violet glowing crystals, pink crystal cluster.
- **Objects:** castle, crozier arch row (pergola remnants), giant blue crystal formation, purple glowing crystal clusters, cypress, broadleaf and autumn-gold trees, flat stepping slabs, dry grass, boulders, UI (ignore), figure.
- **Lighting/FX details:** crystals emit soft violet glow, daylight haze.
- **Build components:**
  - Crozier Scroll Arch Row — Blender mesh (curved metal rib + stone base) — Glowwood path / castle garden pergola.
  - Giant Faceted Sapphire Crystal — Blender mesh + crystal shader (emissive veins) — Glowwood landmarks.
  - Violet Crystal Cluster — Blender mesh + emissive — paths, walls.
  - Stepping Slab Path — Blender mesh/decal — garden paths.

### U392
- **Patterns:** irregular flagstone/crazy paving of rounded pale stones (cobbled courtyard), brick courses in a well arch, bunting triangles strung across a stall, tiled half-round roofing on the well arch (terracotta pantile edge).
- **Carvings & relief:** brick arched well-house with curved tiled cap (fully 3D); Moorish/Mediterranean tall arched windows with pointed tops on the background facade; small marble statue figure on pedestal at left (veil if used).
- **Edges & profiles:** rounded arch tops, pantile ridge, pointed arch windows.
- **Surfaces & materials:** warm terracotta brick, sandstone, cream paving; canvas awnings; wood crates.
- **Objects:** brick well arch with bucket and pulley rope, wooden market stall with fabric bunting, pumpkins/gourds, palm trees (date palm), flowering bougainvillea bushes (pink), wooden crates, rope lines, statue, figures (several, action scene — ignore).
- **Lighting/FX details:** warm sun haze, dust motes, falling leaves.
- **Build components:**
  - Brick Wellhouse Arch w/ Pantile Cap — Blender mesh — castle courtyard / village square.
  - Crazy-Paving Courtyard — texture + normal map — village plaza.
  - Bunting Market Stall — Blender mesh + cloth — birthday fair.

### U393
- **Patterns:** fish-scale/shingle slate roof (rounded-bottom shingles, very clear in foreground); recessed square coffer panels along the cornice frieze (blind panel band); balustrade with square posts and turned balusters; arched window with radial mullions (fanlight); scroll consoles (modillions) with acanthus face; ribbed dome cap.
- **Carvings & relief:** curved Beaux-Arts facade with giant scroll console/corbel (fully 3D, volute with acanthus leaf) at the corner (deep relief); panelled frieze of square recessed panels; round-arched windows with keystones and fanlight mullions; bell-tower/cupola with open arches and dome lantern; balustraded rooftop terrace with a tiered fountain (round cascading basin) and topiary in blue-flowered planters; arched gate with pediment behind; statues on plinths (faceless).
- **Edges & profiles:** rounded cornice with deep overhang, scroll brackets, cylindrical bow front.
- **Surfaces & materials:** pale stone in shadow (blue), golden sunset light, dark slate shingles, blue hydrangea-like flower masses.
- **Objects:** rooftop terrace, tiered fountain, blue flower planters on posts (urn planters), topiary cones, belvedere cupola, flagpole, distant lighthouse-like tower with hanging lantern, round temple, distant mountains.
- **Lighting/FX details:** strong sunset backlight with warm haze, long shadows; fountain water.
- **Build components:**
  - Fish-Scale Slate Roof — normal map/texture + mesh — castle tower roofs.
  - Acanthus Scroll Console — Blender mesh — cornice corners, balcony supports.
  - Panelled Frieze Band — trim sheet + normal map — ring walkway parapets.
  - Rooftop Tiered Fountain — Blender mesh + water shader — castle terraces.
  - Urn Planter w/ Blue Blooms — Blender mesh + foliage — balustrade posts.
  - Open-Arch Cupola Belvedere — Blender mesh — tower tops.

### U394
- **Patterns:** fluted/reeded pilasters on piers; triple vertical slot motif (III) on pedestal panels; diagonal striped (twisted bands) panels around a round dais; band of tiny lights along the ring gallery; glass-roof steel rib grid (transparent dome panels).
- **Carvings & relief:** massive Art-Deco/Neoclassical piers with layered pedestals, recessed rounded-top panels (shallow relief); arches with deep plain soffits; gallery ring supported by caryatid-like glowing pillars (figural lantern columns — use abstract); round central dais with chevron/diagonal panels, small square lamp windows, a glowing orb on top (fully 3D); stepped stairs to upper gallery.
- **Edges & profiles:** stepped plinths, tall round arches, curved ring gallery cornice with railing; glass roof ribs curving overhead.
- **Surfaces & materials:** bronze/brass-tinted stone, teal underwater ambient, glowing amber lamps, sand floor, shallow water pools, barnacled blue rocks with starfish shapes, glass roof.
- **Objects:** hanging tiered conical pendant lamps (stacked glowing rings — like layered lampshades), small square wall lamps (stepped sconces), central dais with orb, floating golden crystal cluster, stepping-stone rocks, stairs, glowing pillar lamps on gallery, railings.
- **Lighting/FX details:** caustic-like teal light, god rays through the glass dome, warm amber sconces against teal fog, water reflections on floor.
- **Build components:**
  - Tiered Ring Pendant Lamp — Blender mesh + emissive — ballroom/corridors, ring walkway arches.
  - Stepped Brass Wall Sconce — Blender mesh + emissive — piers.
  - Orb Dais Altar — Blender mesh + emissive orb — ring walkway hub / quest object.
  - Glass-Ribbed Dome Ceiling — Blender mesh + glass shader — conservatory / observatory.
  - Teal Underwater Fog + God Rays — shader/post — moat grotto beneath castle.
  - Barnacle Stepping Rocks — Blender mesh + normal map — water garden.

### U395
- **Patterns:** gold geometric frame inlays (diamonds, lozenges, triangles) on dark blue/indigo panels on the palace crown; ring-and-cross rosette (gold circular emblem) at gable apex; arched windows rows with gold frames; hedges; colonnade arcades.
- **Carvings & relief:** palace crown with a huge gold-and-indigo inverted triangular gable (gold armature, faceted) containing a central veiled/hooded statue figure; hanging tall indigo banners with gold frames down the pilaster towers; domed corner towers (indigo domes, white drums); building-scale relief/statue of a cloaked hooded figure with sword in a tall indigo niche on the right building (fully 3D — veiled figure works for our rules); gold-framed arched windows with pointed cusped tops; gold sconce lanterns on walls.
- **Edges & profiles:** sharp angular gold frames, pointed gable, onion/round domes with finial spikes, flat balustraded wall top.
- **Surfaces & materials:** white limestone, indigo/navy enamel, polished gold, deep blue glass, green lawns.
- **Objects:** palace, colossal hooded statue in niche, banners, cypress (columnar topiary), flower beds (orange/red flowers), hedges, lamp posts with lantern, stone gate pier caps, distant glass towers.
- **Lighting/FX details:** clear daylight, gold specular sparkle.
- **Build components:**
  - Colossal Hooded Statue in Niche — Blender mesh (faceless hood, sculpted drapery) — castle facade towers.
  - Gold-Framed Indigo Crown Gable — Blender mesh + enamel/gold shader — top of castle main block.
  - Indigo Pilaster Banner w/ Gold Frame — Blender mesh/decal — tower faces.
  - Columnar Topiary Cypress — foliage mesh — formal gardens.

### U396
- **Patterns:** long arcaded terrace wall with repeating tall arched bays separated by buttress piers (each pier topped with small pinnacle); balustrades; staircases radiating; ivy and teal foliage on walls; gold crossed-frame emblem on towers.
- **Carvings & relief:** wide view of the same palace: central crown with gold indigo gable and hooded statue; tall vertical spire-shrine at centre front with angelic winged statues and a gold clock/medallion disc (fully 3D); twin winged statues on pedestals at the gate (veiled); gate piers with gold pinnacles; tiered round fountain/basin terraces cascading down the central stair; rose window (gold) on the top tower; domed indigo corner turrets.
- **Edges & profiles:** stepped pyramidal massing, buttresses, pinnacle tips, curved fountain basins.
- **Surfaces & materials:** white stone, indigo, gold, teal ivy, terracotta-brick paving, water.
- **Objects:** palace, terrace arcades, central cascading fountain stair, gold medallion clock, winged statues, lamp posts, airship (zeppelin with propellers), rainbow in sky, mountain behind, glass skyscraper-like towers (stylised crystal towers) right, town houses left, trees.
- **Lighting/FX details:** rainbow arc, bright sky, water cascades.
- **Build components:**
  - Arcaded Buttress Terrace Wall — Blender mesh (modular bay) — castle lower ring walls.
  - Central Cascade Fountain Stair — Blender mesh + water shader — castle main approach.
  - Gold Medallion Clock Shrine — Blender mesh + emissive — forecourt centrepiece.
  - Rainbow Arc — shader (sky band) — post-birthday celebration sky.
  - Airship Prop — Blender mesh + idle animation — sky ambience.

### U397
- **Patterns:** Art-Deco sunburst/fan vertical fins in teal glass framed in gold (radiating stepped bars) above the great door; vertical gold mullion stripes on teal glass curtain walls; stepped Art-Deco setbacks; diamond-stud gold bands; geometric paving with gold inlay strips crossing marble plaza; formal hedge rows.
- **Carvings & relief:** monumental Art-Deco cathedral-palace: great door framed with stepped gold portal, inside a gilt eagle/phoenix emblem with spread wings holding a glowing blue gem (deep relief + emissive gem); tall stepped buttress towers with pinnacle spires and lantern tops; flying bridges between spires; stone urn/lamp bollards along plaza; green-glass Art-Deco panel (tall emerald panel with gold pattern) on a tower; small statues (gold figures) on plinths along the walks.
- **Edges & profiles:** stepped setbacks, chamfered pier corners, faceted gold frames, slim spires.
- **Surfaces & materials:** white polished stone, gold, teal and emerald stained glass (glossy), reflective pools (turquoise, glowing), polished marble pavers with gold inlay.
- **Objects:** palace, great door with phoenix emblem, waterfalls cascading from building terraces into pools, reflecting pools with sparkles, hedges, cypress/topiary rows, benches (wooden with metal legs), flower beds (pink/magenta), stone bollard lanterns, gold figure statues, figures.
- **Lighting/FX details:** sparkle glints on pool surface, waterfall mist, polished floor reflections, gem glow.
- **Build components:**
  - Art-Deco Sunburst Glass Fins — Blender mesh + stained glass shader — castle great door / ballroom entry.
  - Gilt Phoenix Emblem w/ Glowing Gem — Blender mesh + emissive gem — main gate centrepiece (birthday crest).
  - Gold-Inlay Marble Plaza — texture + emissive gold lines at night — forecourt.
  - Facade Waterfall Spill — shader + mist particles — castle terraces into moat.
  - Sparkling Reflecting Pool — shader (planar reflection + glints) — gardens.
  - Stone Bollard Lantern — Blender mesh + emissive — plaza walkways.

### U398
- **Patterns:** stepped ziggurat-like terraces of a vast city; repeating flat-roof cubic houses; rows of cypress; canal grid; parallel vertical ribs on monumental A-frame.
- **Carvings & relief:** colossal leaning A-frame/pylon monument of two inclined slab legs meeting at the top with a vertical fin (fully 3D, plain bevelled slabs); central acropolis citadel with a pyramidal cluster of spires (stepped Gothic-classical massing) and a vertical light beam from its peak; obelisk-like spires; distant giant tilted pylon/pillar in sky.
- **Edges & profiles:** sharp chamfered slab edges, stepped terraces, needle spires, causeway bridges over canals.
- **Surfaces & materials:** sun-bleached limestone, terracotta roofs, turquoise canals with sun glare.
- **Objects:** A-frame monument, citadel, city blocks, canal bridges, palms and cypress, plazas, terraced gardens, distant towers.
- **Lighting/FX details:** low sun with strong bloom on water, vertical light beam from citadel tip, golden haze.
- **Build components:**
  - Sky Light Beam (vertical) — shader (additive cylinder with noise) — castle main spire at night.
  - Leaning Pylon Monument — Blender mesh — distant landmark beyond moat.
  - Canal Grid w/ Causeways — Blender mesh + water shader — castle town backdrop.

### U399
- **Patterns:** cracked-marble vein lines (dark blue-grey veins) on tower ashlar; grilles on rooftop (square grid vent/lattice panel); stacked block terraces; avenue of paving squares; cypress rows.
- **Carvings & relief:** rooftop corners crowned by gilded leaping dolphin/fish sculptures (fully 3D — stylised fish is acceptable as ornament, or replace with gilt wave-scrolls); gold-rimmed rooftop flower bed with lavender around a central lattice grate; bronze brazier/fire bowl on a plinth (fully 3D) atop an obelisk-like plinth; temple door with a gold-framed lintel and inscribed panel; massive tapering obelisk/needle towers; avenue gateways (pylon gates) far left.
- **Edges & profiles:** crisp chamfers on monolithic blocks, gold edge strips along roof parapet, tapering obelisk.
- **Surfaces & materials:** white veined marble (weathered with moss streaks and ivy), gold, bronze, blue sea.
- **Objects:** marble towers, gilt fish sculptures, rooftop lavender beds, brazier fire bowl, obelisks, canals/river, palm trees, cypresses, olive/round trees, autumn red tree, ivy, distant tower in sea, bird (ignore), light beam.
- **Lighting/FX details:** sun bloom, vertical thin light beam, flame in brazier, sea glare.
- **Build components:**
  - Veined Marble Shader — shader (procedural veins + moss streaks) — castle walls / ring walkways.
  - Bronze Brazier on Plinth — Blender mesh + fire particle — gate posts, bridges.
  - Gilt Wave-Scroll Roof Corner Ornament — Blender mesh — tower roof corners.
  - Rooftop Garden Bed w/ Lattice Grate — Blender mesh + flowers — tower terraces.
  - Tapering Obelisk — Blender mesh — avenue markers.

### U400
- **Patterns:** stacked tiers of white blocks with green roof gardens; repeating arches on a long viaduct bridge; tall needle spires; cypress lines.
- **Carvings & relief:** gleaming white acropolis-castle with clusters of tall slender spires (fully 3D, low detail); long multi-arched bridge with towers across a canyon; giant floating/tilted crystal monolith (sky pylon) at right; figure statue-like silhouette.
- **Edges & profiles:** needle spires, arched viaduct, stepped terraces, cliff edges.
- **Surfaces & materials:** brilliant white marble, green terrace vegetation, turquoise water.
- **Objects:** citadel, viaduct bridge, canals, waterfalls, terrace gardens, cypresses, giant pylons, thin light beams from sky, figure in foreground (ignore).
- **Lighting/FX details:** hazy bright daylight, thin vertical light lines.
- **Build components:**
  - Long Multi-Arch Viaduct w/ Towers — Blender mesh — bridge linking castle to outer ring.
  - Terraced Roof-Garden Block — Blender mesh — castle hillside town.
  - White Marble Spire Cluster — Blender mesh — castle crown variant.

### U401
- **Patterns:** repeated aqueduct/viaduct arcades (multi-tiered round arches), tiers of arched windows, colonnade galleries, red-tile roofs with dormers; bands of round towers along terrace walls; wrought-stone pierced balustrade (flowing quatrefoil/arched openwork lattice) in foreground.
- **Carvings & relief:** cathedral-castle crown tower with stacked octagonal stages, arched belfry openings, pinnacles, tall pointed spire (deep relief/fully 3D); Byzantine-like domed tower (round dome on arcaded drum); many slender pointed conical spires; terrace walls with rounded bastion towers and arched windows; foreground pierced stone balustrade (openwork) with a black hooded/veiled statue (useful faceless figure precedent).
- **Edges & profiles:** stepped massing, pointed spires, round domes, arched viaduct spans, rounded bastions.
- **Surfaces & materials:** cream/ivory limestone, terracotta roof tiles, weathered stone; lake water.
- **Objects:** castle city, viaducts, domed towers, bastions, lake with small sailboats, stone bridge, golden-autumn trees, red flowering plants (poppies/geraniums) in a stone planter bed, hooded statue, foreground leafy branch, mountains.
- **Lighting/FX details:** soft daylight with dappled clouds, haze in distance.
- **Build components:**
  - Pierced Openwork Balustrade — Blender mesh (arched/quatrefoil cut-outs) — ring walkways, bridge railings.
  - Veiled Hooded Statue — Blender mesh — garden overlooks.
  - Stacked Octagonal Belfry Crown — Blender mesh — castle main tower.
  - Round Bastion Terrace Wall — Blender mesh — castle tiered walls.
  - Red Flower Planter Bed — Blender mesh + instanced flowers — terraces.

### U402
- **Patterns:** clusters of needle spires with violet conical roofs; banded vertical window strips (lit window stacks); voxel/block textures (Minecraft-style build — stylised).
- **Carvings & relief:** fairy-tale castle of slender white towers, each capped by violet-purple faceted spire roofs with spike finials; lantern-like upper belfry stages with glowing windows; arched bridge at right; low walled waterfront.
- **Edges & profiles:** tall pointed spires, flared roof skirts, layered tower stages.
- **Surfaces & materials:** white stone lit warm from inside, violet/amethyst roof material, glassy dark water; warm lantern lights along the shore.
- **Objects:** castle, full moon (bright, with halo), stars, lanterns along the shore (warm glow), trees, arched bridge, flower beds, lake.
- **Lighting/FX details:** night scene: castle uplit/backlit glowing white with purple tones, long shimmering water reflections of castle and moon, star sparkles, warm amber shore lights vs. cool violet sky — exactly our night palette.
- **Build components:**
  - Amethyst Faceted Spire Roof — Blender mesh + iridescent violet shader — castle tower tops.
  - Night Castle Self-Glow — shader (emissive window strips + facade bounce light) — castle at night.
  - Moon with Halo — shader/sprite — night skybox.
  - Shore Lantern String — Blender mesh + emissive + reflection — moat banks.
  - Rippled Night Reflection Water — shader (planar reflection + vertical stretch) — moat.

### U403
Added 2026-10-11. The owner sent it to show how much detail a castle front can carry, and how **clustered towers that bulge out from the walls** make the boundary instead of a plain wall. (Disney artwork: we use it only as a study of structure and ornament, with no logos, medallion numbers or characters.)
- **Patterns:** chevron and diamond (harlequin) bands in two blues on the steep keep roofs; a scalloped wave band painted round each tower's skirt roof; rows of square gold windows on the upper drums; gold crenellation rhythm (merlon, gap, merlon) on every parapet; swag garlands repeating between jewel drops; long pointed banners hung in rows on the curtain wall.
- **Carvings & relief:** a gold gothic portal with a deep moulded archivolt and slender gold shafts; a gold wimperg (pointed gable) above the gate holding a round medallion, flanked by gold pinnacles with crockets; a gold balcony with pierced balustrade over the gate; gold gablets (small pointed gables) ringing the lantern tower's open belfry; the main spire's base ringed by a gold arcade of lancets with pinnacles; gold leaf texture on the spire roofs with crockets up the edges.
- **Edges & profiles:** the round towers **corbel outward in stages**: plain shaft, then a projecting gold machicolation ring (brackets with small arches between), a wider drum, a sloped skirt roof, a set-back upper drum, a gold crenellated rim, then a tall cone. Each stage is wider than the shaft beneath it, so the towers "arch out" over the walls. Towers are set in **groups of two or three that overlap**, a smaller cone peeking behind a bigger one, at different heights and depths. Curtain walls step up and down between towers. The main tower is octagonal with gold vertical ribs running its full height and a corbelled gold gallery near the top, crowned by a cluster of one big and three small gold spires.
- **Surfaces & materials:** lavender-blue stone in shade, warm pink stone where lit from below; matte painted roofs; bright gold leaf on all trim (flecked, slightly rough, not mirror); teal and gold fabric in the swags and banners; a warm glowing interior seen through the gate with a chandelier and draped curtains.
- **Objects:** clustered drum towers with spiral-ribbon cone roofs and gold pennant finials; a gold gatehouse with balcony and clock medallion; a slender octagonal spire tower with gold spire cluster; a lantern tower with open gothic belfry and blue spire; tall keep roofs with gold dormers; a round forecourt planter of flowers with a tiered fountain and topiary at its centre; **twin curving ramps that sweep up on both sides with wrought-iron scroll balustrades**; ornate cast-iron lamp posts with hexagonal lanterns and cross-shaped tops (ours become stars); gothic iron arbour arches along the ramp; a pearl-white carriage drawn by white horses.
- **Lighting/FX details:** **gold ribbons spiral round every cone roof**, catching light; a trail of sparkle dust spirals round the main spire and drifts across the sky; warm uplight on the walls fading to cool lavender at the top; a full moon; lanterns glowing warm amber; fairy lights strung along the swags.
- **Build components:**
  - ★ Corbelled drum tower ("arching-out" tower) with stacked flaring stages — Blender mesh, instanced at several sizes — the castle's front boundary, in clusters of two or three.
  - ★ Gold spiral ribbon round cone roofs — Blender mesh (a thin twisted strip), emissive gold edge — every cone roof.
  - Machicolation ring (gold brackets and little arches) — Blender mesh, instanced round each tower stage.
  - Skirt roof with wave band — Blender mesh plus decal — tower middles.
  - Swag garlands with jewel drops and fairy lights — Blender mesh plus emissive points — tower drums and curtain wall tops.
  - Hanging pointed banners — cloth mesh with a wind shader — curtain walls between towers.
  - Gold-capped crenellations — trim sheet plus instanced merlon caps — every parapet.
  - ★ Gold gatehouse: gothic portal, balcony, wimperg with a round medallion (ours a clock or star rose), pinnacles — Blender mesh — the Great Gate.
  - Octagonal ribbed spire tower with a gold gallery and spire cluster — Blender mesh — the cone tower.
  - Lantern tower with open gothic belfry ringed by gablets — Blender mesh — a back tower.
  - Chevron or harlequin roof tiles — shader/texture — the keep roofs.
  - ★ Twin curving ramps with wrought-iron scroll balustrades, lamp posts and iron arbours — Blender mesh plus alpha cutout railing — the forecourt at the gate.
  - Round flower planter with a tiered fountain and topiary — Blender mesh — the gate landing.
  - Sparkle-dust spiral trail — particles — round the cone tower, rising at the midnight celebration.
