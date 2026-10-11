# Component library: every detailed piece from the 402 reference pictures, merged

This file lists the reusable building pieces found in the 402 reference pictures (U01 to U402), merged so that each piece appears once with every picture it came from. It is built from [detail-catalogue.md](detail-catalogue.md), where the full per-picture notes live; look a piece up there by its source IDs (for example `### U181`) before modelling it. Placements use the zone and room names in [world-layout.md](world-layout.md).

Build methods use these words: **Blender mesh** (carved, baked to game model), **Normal map** (relief baked onto flat surfaces), **Alpha cutout** (openwork cards), **Decal**, **Shader**, **Particles**, **Instanced prop**. Where two are joined with +, the piece needs both.

The game's swap rules are already applied to every entry: creatures have no eyes; statues and figure columns are veiled or faceless; dragon and animal heads become scrolls or lotus buds; cross finials become stars. Off-theme things in the pictures (sci-fi and neon signage, cars, guns, modern logos and street furniture) are dropped, and where a small detail was worth keeping only that detail is described. Pieces marked ★ are the strongest; the build thread should do them first, in the order below.

## Start here (★, in build order)

**Front wall and Great Gate**

1. ★ **Corbelled crenellated parapet** (U93): the 200 m front wall top and gate turrets.
2. ★ **Crocketed gothic pinnacle** (U77): one every 20 m on the front wall, and the 212 m gate turrets.
3. ★ **Gothic stained-glass lancet with quatrefoil head** (U159, U198, U223, U347): the tracery frame for every front-wall bay; fill with flowing multicolour glass.
4. ★ **Deep-order pointed gate arch** (U93, U245): the 100 m Great Gate frame.
5. ★ **Gilded stained-glass grand gate** (U379): the two 28 m gate leaves; recolour to fractured blue, yellow and purple.

**Towers and domes**

6. ★ **Crown-lantern turret** (U129): the cap module repeated on every tower.
7. ★ **Onion dome with lotus collar and kalash finial** (U82, U278): the 30 m radius dome on the central dome tower.
8. ★ **Amethyst faceted spire roof** (U402): the 88 m gothic cone on the cone tower.
9. ★ **Fish-scale slate roofing** (U36, U117, U129, U149, U224, U339, U393): the roof surface for every dome and cone.
10. ★ **Heart-tracery ogee belvedere crown** (U128): the birthday signature crown.
11. ★ **Pierced tracery spire crown** (U371): a back-tower crown and the Star Chapel.
12. ★ **Stained-glass flame dome** (U273): the Grand Ballroom dome, glowing at night.
13. ★ **Astronomical clock rose window** (U380): the facade rose above the gate or the ballroom end wall.

**Walkways, balcony and grand staircase**

14. ★ **Curved circular walkway segment** (U83): the three white ring walkways.
15. ★ **Gothic tracery railing panel** (U77): walkway and terrace railing.
16. ★ **Vase baluster balustrade** (U152, U176, U190, U252, U261, U272, U351): second walkway railing and stair balustrades.
17. ★ **S-scroll iron balcony railing** (U128): the Grand Balcony railing.
18. ★ **Mughal bell capital column** (U181): walkway colonnades and the balcony loggia.
19. ★ **Central cascade fountain stair** (U396): the chadar channel down the grand staircase.

**Long Bridge**

20. ★ **Multi-arch viaduct** (U95, U138, U368, U374, U400): the 800 m two-tier arcade.
21. ★ **Pierced openwork balustrade** (U401): the see-through bridge railing.
22. ★ **Pierced stone jali balustrade** (U278): the alternate bridge railing panel.
23. ★ **Celtic knotwork band with glowing inlay** (U220, U232): bridge beams and pier caps.
24. ★ **Floating faceted balloon lanterns** (U354): the sky over the bridge and Lantern Cove.

**Straight avenue and forecourt plaza**

25. ★ **Veiled column-statue avenue** (U139): both sides of the avenue.
26. ★ **Twin-lantern cast-iron lamp post** (U343): the avenue lamp rhythm.
27. ★ **Wrought-iron scroll sign bracket** (U234, U338, U343): shop and sign brackets along the avenue.
28. ★ **Gold-inlay marble plaza** (U397): the plaza floor.
29. ★ **Armillary sphere fountain** (U380): the plaza centrepiece.
30. ★ **Cylindrical water-curtain fountain** (U344): a second plaza or market fountain.
31. ★ **Whiplash iron arch pergola on vine-wound columns** (U129): the gateway arch from plaza to stair.
32. ★ **Giant gold armillary monument on ziggurat** (U360): the Baroque garden centrepiece behind the gate.

**Interiors**

33. ★ **Art Deco sunburst floor inlay** (U331): Great Hall floor.
34. ★ **Arched iron-grid window with mini-arcade bars** (U331): Great Hall windows.
35. ★ **Imperial bifurcated staircase** (U332): Twin-stair hall.
36. ★ **Crystal tiered chandelier** (U268, U388): Grand Ballroom and Great Hall.
37. ★ **Galaxy-sky ceiling** (U268): Grand Ballroom ceiling.
38. ★ **Coffered filigree ceiling** (U388): Grand Ballroom side ceilings.
39. ★ **Girih star coffered ceiling** (U181): Grand Balcony loggia and cloister vaults.
40. ★ **Gilded pierced arabesque filigree panel** (U346): ballroom and rotunda wall panels.
41. ★ **Muqarnas honeycomb capital with gilt annulets** (U284, U346): ballroom columns.
42. ★ **Gilded strapwork lattice screen** (U284): ballroom bays and throne screens.
43. ★ **Gold-ribbon swirl floor inlay** (U249, U355): Grand Ballroom floor.
44. ★ **Interlaced-rings marble floor** (U338): rotunda or forecourt floor.

**Grounds**

45. ★ **Art Nouveau leaf-pod pavilion** (U353): garden and Glowwood glade house.

## Contents

1. [Geometric patterns & inlays](#1-geometric-patterns--inlays) (26)
2. [Carvings & relief](#2-carvings--relief) (24)
3. [Ironwork & metal ornament](#3-ironwork--metal-ornament) (6)
4. [Edges, mouldings & profiles](#4-edges-mouldings--profiles) (45)
5. [Walls, masonry & surface shaders](#5-walls-masonry--surface-shaders) (19)
6. [Windows & stained glass](#6-windows--stained-glass) (35)
7. [Domes, spires, roofs & finials](#7-domes-spires-roofs--finials) (76)
8. [Towers & tower bodies](#8-towers--tower-bodies) (24)
9. [Columns, capitals & piers](#9-columns-capitals--piers) (24)
10. [Railings, balustrades & screens](#10-railings-balustrades--screens) (28)
11. [Gates, doors & portals](#11-gates-doors--portals) (34)
12. [Stairs & bridges](#12-stairs--bridges) (31)
13. [Floors & paving](#13-floors--paving) (38)
14. [Ceilings, vaults & chandeliers](#14-ceilings-vaults--chandeliers) (16)
15. [Lanterns, lamps & light props](#15-lanterns-lamps--light-props) (55)
16. [Fountains & water features](#16-fountains--water-features) (44)
17. [Gardens, plants & trees](#17-gardens-plants--trees) (44)
18. [Furniture & sitouts](#18-furniture--sitouts) (19)
19. [Pavilions, kiosks & small buildings](#19-pavilions-kiosks--small-buildings) (30)
20. [Town & village building kits](#20-town--village-building-kits) (14)
21. [Terrain & rock kits](#21-terrain--rock-kits) (23)
22. [Sky, light & particle FX](#22-sky-light--particle-fx) (28)
23. [Creatures, statues & figures](#23-creatures-statues--figures) (12)
24. [Miscellaneous props](#24-miscellaneous-props) (41)

## 1. Geometric patterns & inlays

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Celtic knotwork band with glowing inlay** | Continuous over-under interlace band carved shallow in dark wood or stone, the grooves filled with faint blue (here rose-gold) emissive paint; also used as bargeboard edging | U220, U232 | Normal map + Shader | Great Gate frame, Long Bridge beams and pier caps, Frost Fjord longhouse bargeboards |
| **Greek key / meander relief band** | Square-spiral fret carved 1-2 cm deep as a running band; stepped-fret and labyrinth variants (maroon on white in U31); cut into kerbs, plinths, door surrounds and rails | U03, U27, U31, U98, U130, U167, U177, U349, U350 | Normal map | Terrace walls of the Baroque gardens, door frames and pilasters in the Great Hall, kerbs of the forecourt, Temple Hill friezes |
| **Blue enamel key frieze** | Meander band in gold lines on cobalt-blue enamel ground, run along entablatures with thin gold piping above and below | U364 | Decal + Normal map | Entablatures of the front wall arcades and Great Hall; Temple Hill temple frieze |
| **Knotwork runestone and roundel stone** | Upright slab carved with interlace and a central roundel that glows; altar stele variant with glowing rune inlay | U84 | Blender mesh + Shader | Glowwood shrines and path markers, Ruin Meadows stone circle |
| **Chevron column-base band** | Blue zigzag 'mountain' band painted round the foot of every column, slight glossy glaze, light lavender tile strips above and below | U181 | Decal | Column bases on the circular walkways and in the cloister walk |
| **Blue-and-gold chevron wall band** | Wide zigzag band alternating cobalt enamel and polished gold, run along plinths and wall bases | U360 | Decal + Normal map | Front wall plinth, Baroque garden terrace walls |
| **Art Deco chevron and diamond frieze** | Zigzag frieze with interlocking diamond-and-X centre motifs in gilt relief; repeats over doors and along arch soffits | U331 | Normal map + Decal | Great Hall walls and door lintels, Grand Ballroom |
| **Diamond lattice panel family** | Diagonal diamond grid in relief or as gilt strips; gilt diamond wainscot (U162), diaper brick (U189), diamond relief terrace panel (U360), lattice soffit under arches (U386) | U162, U189, U360, U386 | Normal map | Party salon wainscot, Baroque garden terrace walls, Great Gate arch soffit, Lagoon City brick walls |
| **Lozenge chain frieze** | Linked lozenges in a single running chain band, flat relief | U386 | Normal map | Terrace parapets on the circular walkways |
| **Ablaq striped wall banding** | Alternating pale and rose stone courses in horizontal stripes | U277 | Shader | Moon Palace and Red Canyon palace walls, castle side wings |
| **Voronoi cell lattice glazing** | Irregular Voronoi cell frames with glowing edges and gradient cell fill (green in U166); can be a cage or glazing | U165, U166 | Shader + Normal map | Crystal greenhouse glazing on the castle grounds, Glowwood magic screens |
| **Gold edge piping trim** | Thin bevelled gold half-round run along every panel edge, arris and frame on white marble | U361 | Blender mesh + Shader | All castle white-marble panels, gate frame, Long Bridge parapets |
| **Amethyst lozenge inset** | Faceted violet gem lozenge set flush into a stone panel, emissive core | U361 | Blender mesh + Shader | Tower facades and the Great Gate keystone |
| **Gilding shaders** | Gold mask whose edges wear through to stone on raised parts, plus a moving specular gleam that sweeps along gilt edges and rails in moonlight | U55, U364 | Shader | All gilt trim and metal rails, so gold does not look plastic |
| **Glowing edge and inlay lines** | Soft emissive strips set into trim: eave piping (U188), roof rim (U218), stair nosings (U214), walkway kerbs (U300, U326), under-ledge strips (U305), tower wall channels (U182), ringed tower bands (U320); use soft gold or rose, never neon lime | U182, U188, U214, U218, U300, U305, U320, U326 | Shader | Rooflines, stair nosings of the grand staircase, walkway kerbs at night |
| **Gold lotus-line inlay** | Continuous gold lotus outline line inlaid in dark metal or indigo | U183 | Decal + Shader | Dome undersides and Grand Ballroom ceiling |
| **Arabesque vine stencil** | Flat scrolling vine-and-leaf stencil on plaster, single colour | U179 | Decal | Plaster walls in the cloister courtyard and Red Canyon bazaar |
| **Tree-of-life painted panel** | Painted tree with symmetrical branching arabesque leaves inside an arched panel, slight emissive option | U283 | Decal | Cloister courtyard walls, Glowwood shrine |
| **Mandala astrology chart** | Circular chart of concentric rings and signs painted flat | U160 | Decal | Tower attic walls |
| **Damask stair tiles** | Repeating damask flower tile on risers and treads | U150 | Decal | Grand staircase risers, Twin-stair hall |
| **Running-wave scroll band** | Continuous wave scroll (Vitruvian) band, embroidered on cloth or carved on stair cheeks | U75, U131 | Decal + Normal map | Hall banners, stair ends |
| **Zigzag lattice frieze** | Band of zigzag lattice in relief | U200 | Normal map | Jungle ruins temple |
| **Chevron and sawtooth border band** | Sawtooth triangle border for textiles, plus lozenge-chequer fabric | U23, U227 | Decal | Banners and tapestries |
| **Spiral and whorl relief** | Carved spiral and scroll whorls on plinths, blocks and cliff panels, shallow to medium depth | U22, U24, U110, U111 | Normal map | Fountain bases, plinths, Red Canyon cliff panels |
| **Glowing spiral and rune decals** | Incised glyphs and spirals that glow faintly cyan or gold: spiral rune (U193), rune circle on arch (U209), petroglyph discs (U98) | U98, U193, U209 | Decal + Shader | Doors, gate arches, Glowwood signposts and cliff faces |
| **Hex tile with glowing seams** | Hexagonal tile grid with emissive mask in the joints; honeycomb variant with glowing cells | U215, U297 | Shader | Stargazer Observatory terrace, Glowwood fairy shop |

## 2. Carvings & relief

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Gilded pierced arabesque filigree panel** | Openwork gold lattice of scrolls and palmettes filling a tall rectangular wall panel, framed by blue enamel bands with lobed outlines and gold piping; backlit it reads as lace | U346 | Alpha cutout + Shader | Grand Ballroom wall panels, Throne and birthday rotunda niche |
| **Carved arabesque pier panel** | Tall rectangular panel of dense deep-cut arabesque filigree on a pier face, foliate capital above | U258, U260 | Normal map | Cloister courtyard piers, piers along the circular walkways |
| **Gold-inlay arabesque pier panel** | Arabesque pier panel with the raised scrolls picked out in gold, shell cartouche on top | U263 | Normal map + Shader | Moon Palace piers, Throne rotunda |
| **Acanthus spandrel cartouche** | Sculpted acanthus scrolls round an oval cartouche filling the triangle between arches | U257 | Normal map | Grand Ballroom arches, Great Gate spandrels |
| **Rococo gilt scroll frieze with medallion** | Gold C-scroll and acanthus frieze across an arch lintel with a central blue oval medallion, deep relief | U284 | Normal map + Shader | Arch lintels in the Grand Ballroom, Grand Balcony loggia |
| **Rococo scroll cartouche crest** | Large cartouche of C- and S-scrolls crowning a porch or door hood, deep relief, white marble | U338 | Normal map | Over the Great Gate and side doors |
| **Acanthus plume wall relief** | Tall feathery acanthus plume carved on a facade panel | U349 | Normal map | Lagoon City palazzi, Baroque garden walls |
| **Acanthus tympanum pediment** | Triangular pediment with acanthus scroll tympanum and a dentil cornice | U131 | Blender mesh + Normal map | Temple Hill temple, castle music pavilion |
| **Gilt rinceau mirror frame** | Rectangular mirror frame of gold running-vine rinceau, sculpted then baked | U262 | Normal map + Shader | Mirror gallery walls, castle salons |
| **Wreathed oval cartouche medallion** | Oval medallion ringed by a laurel wreath, deep relief | U311 | Normal map | Tower drums, over doors |
| **Shell cartouche dado panel** | Blue-framed panel with palmette shell rays in blue and white, set below screens | U284 | Decal + Normal map | Wainscot in the Grand Ballroom bays |
| **Carved cartouche frieze band** | String course of rectangular cartouche panels with floral fill | U278 | Normal map | Curtain walls, Moon Palace, Red Canyon walls |
| **Heraldic shield cartouche** | Shield-shaped cartouche with scroll edges, no animals | U341 | Normal map | Building corners in Lagoon City and Storybook Valley |
| **Glowing clock oculus crest** | Round glowing clock oculus in a cartouche at the top of a facade, flanked by faceless wings | U310, U311 | Blender mesh + Shader | Great Hall facade crown, Grand Ballroom facade |
| **Crown medallion emblem** | Round crown-and-rosette medallion in relief | U322 | Blender mesh + Normal map | Clock tower and keep tops |
| **Rosette medallion family** | Round carved rosettes: embossed (U31), quatrefoil spandrel roundel (U150), frieze roundel (U256), drain cover rosette (U155) | U31, U150, U155, U256 | Normal map + Decal | Arcade spandrels, cornice bands, paving accents |
| **Sun emblem relief panel** | Sunburst disc with straight rays on a square panel | U386 | Decal + Normal map | Walls, folding screens, Party salon |
| **Solar-wheel carved boulder** | Rounded boulder with a carved spoked wheel | U231 | Blender mesh + Normal map | Gate-side markers, Frost Fjord |
| **Sculpted wing pair** | Pair of spread wings with feather relief, no body or head | U141 | Blender mesh + Normal map | Above the Great Gate, ballroom entrance |
| **Winged emblem with glowing gem** | Gilt spread-wing emblem around a glowing blue gem in a stepped gold frame; wings only, head replaced by the gem | U397 | Blender mesh + Shader | Great Gate centrepiece crest |
| **Glyph-carved door jamb and medallion lintel** | Jamb blocks covered in square glyph tiles, round medallion on the lintel | U291 | Blender mesh + Normal map | Jungle ruins shrine |
| **Volute-shouldered stepped pediment** | Stepped pediment with scroll volutes at each shoulder | U291 | Blender mesh | Jungle ruins gateways |
| **Interlaced scroll door panel** | Deep-relief interlaced Urnes-style scrolls on wooden door panels | U220 | Normal map | Castle doors, Frost Fjord longhouse |
| **Spiral-rosette beam end cap** | Round spiral rosette carved on the end of each projecting timber | U210, U233 | Blender mesh + Normal map | All timber framing ends, bridge beams |

## 3. Ironwork & metal ornament

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Whiplash iron arch pergola on vine-wound columns** | Open iron arch canopies of wavy interlaced scrolls carried on turned columns with collar rings, wound with carved vines and topped by orb finials; a lantern hangs under the arch | U129 | Blender mesh | Forecourt gate at the top of the grand staircase, arches over the circular walkways |
| **Art Nouveau whiplash iron straps** | Sweeping whiplash curves of burnished violet wrought iron strapped across a tower wall, interlaced scroll bands | U128 | Blender mesh | Castle keep walls, Grand Ballroom doors |
| **Iron whiplash spandrel panel** | Curve-to-mesh scroll panel with a central roundel rosette, fills the spandrels of a window wall | U271 | Blender mesh | Grand Ballroom window wall, conservatory pavilion |
| **Tendril scroll iron edging** | Low continuous iron tendril scroll used as a border | U113 | Blender mesh | Terrace and balcony edges, Grand Balcony steps |
| **Overgrown wrought-iron truss arch** | Iron truss arch overgrown with moss | U34 | Blender mesh + Shader | Glowwood ruined gate |
| **Scroll volute iron bracket** | Flat iron arm of C-scrolls ending in spiral volutes, used to hang a sign or lamp | U54 | Blender mesh | Market lanes, castle gate lamps |

## 4. Edges, mouldings & profiles

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Deep-order pointed gate arch** | Equilateral pointed arch with three receding arch rings (multiple-order archivolt), chamfered jambs and a hood moulding | U93, U245 | Blender mesh | Great Gate frame (scaled to 100 m), Star Chapel portals |
| ★ **Corbelled crenellated parapet** | Rectangular merlons over a stepped corbel table that projects like machicolation; sunlit edges on each corbel tier | U93 | Blender mesh | Front wall top, Great Gate turrets, courtyard towers |
| **Four-centred arch with roll moulding** | Low Tudor-like pointed arch with a heavy soffit roll and a flat outer fascia; arches meet in groin vaults; the roll catches a bright rim line | U181 | Blender mesh | Cloister walk, Grand Balcony loggia, circular walkway arcades |
| **Cusped multifoil arch with arabesque border** | Pointed arch whose intrados is cut into five to nine lobes, framed by an arabesque border | U283 | Blender mesh + Normal map | Cloister courtyard arcades, Grand Ballroom side bays |
| **Multifoil arch arcade** | Repeating multifoil arches on slim columns | U151 | Blender mesh | Arcades on the circular walkways |
| **Cusped ogee trilobed arcade** | Column, trilobed ogee arch and spandrel roundel as one module | U150 | Blender mesh | Cloister courtyard |
| **Polylobed horseshoe arch on cubic capital** | Horseshoe arch with lobed intrados on a slim column with a cubic capital | U292 | Blender mesh | Lily-pool courtyard arcade, Red Canyon bazaar |
| **Cusped ogee niche with velvet curtain** | Multifoil ogee niche, gold piping on the edge, red velvet curtain hung inside | U346 | Blender mesh | Grand Ballroom alcoves, stage |
| **Elvish lancet arch frame** | Free-standing slender lancet frame with curved inner tracery and a gold emissive edge | U86 | Blender mesh + Shader | Glowwood grotto, ballroom entrance arches, walkway gateways |
| **Multi-roll arch surround** | Round arch outlined by several thick rounded roll mouldings, cusp at the springing | U388 | Blender mesh | Grand Ballroom windows and doors |
| **Faceted block arch with gilded tips** | Chunky faceted voussoir arch, each block tip gilded | U110 | Blender mesh | Glowwood ruins, garden gates |
| **Stone voussoir arch over alley** | Plain round arch of large voussoirs spanning a lane | U335 | Blender mesh | Storybook Valley lanes, castle undercrofts |
| **Bent-plank segmental archway** | Low segmental arch built from bent planks | U233 | Blender mesh | Passage gates in Storybook Valley |
| **Crozier scroll arch row** | Row of curved metal ribs that end in crozier scrolls, on stone bases | U391 | Blender mesh | Glowwood path, castle garden pergola |
| **Ribbed wave-crest arch canopy** | Arched canopy of ribs whose tops curl like a breaking wave | U315 | Blender mesh | Water pavilion entrance by the lake |
| **Radiating fluted arch hood** | Half-round hood with flutes radiating from the centre | U191 | Blender mesh | Gate canopy, side doors |
| **Ogee keel gable with needle finial** | Ogee-shaped gable that rises to a keel point and a needle finial | U180 | Blender mesh | Tower roofs, Storybook houses |
| **Blind lancet arcade panel** | Tall narrow pointed niches in shallow relief along a wall base | U93 | Normal map + Blender mesh | Lower front wall, curtain walls, tower drums |
| **Blind arcade niche wall** | Round-arched niches with panel decals in a garden wall | U261 | Blender mesh + Decal | Baroque garden walls |
| **Arched-niche terrace wall** | Retaining wall module with a row of arched niches | U285 | Blender mesh | Hanging garden tiers, Red Canyon |
| **Stepped cornice with console brackets** | Stepped stone cornice carried on console brackets, swept profile | U54 | Blender mesh | Castle wall tops |
| **Dentil cornice** | Row of small square dentils under a moulded cornice | U156 | Blender mesh | Castle wall tops, Temple Hill |
| **Gold modillion ring cornice** | Ring of gilt modillion brackets under a circular cornice | U257 | Blender mesh + Shader | Base of the Grand Ballroom dome, rotunda |
| **Gilt S-scroll console frieze** | Repeating gilt S-scroll consoles along a frieze | U266 | Blender mesh | Grand Ballroom cornice |
| **Corbel-table and dentil brick frieze** | Hanging corbel blocks or dentils in brick under eaves | U254, U272, U313 | Normal map + Blender mesh | Lagoon City and Storybook brick buildings, outer walls |
| **Mini-merlon crest cornice** | Tiny merlons as a cresting along a roof edge | U277 | Normal map + Blender mesh | Roof edges across the castle |
| **Panelled frieze band** | Run of sunk rectangular panels as a frieze | U393 | Normal map | Parapets on the circular walkways |
| **Green enamel band trim** | Flat band of green enamel in a gold frame | U384 | Decal | Cornices in interiors |
| **Chhajja eave on corbels** | Thin sloping stone eave slab on carved corbels, above arcades | U283 | Blender mesh | Moon Palace, Red Canyon palace |
| **Dripping-edge soffit trim** | Scalloped drip edge like icing along a canopy | U297 | Blender mesh | Party stalls, sweet shop on the birthday fair |
| **Gingerbread fretwork frieze** | Pierced wooden fretwork strip of scrolls and drops under eaves | U180 | Alpha cutout + Normal map | Glowwood cottages, balcony edges |
| **Stepped notched fascia board** | Bevelled fascia board with stepped notches | U316 | Blender mesh | Shop and stall fronts |
| **Chamfered parapet cap** | Parapet coping with a wide chamfer on both edges | U325 | Blender mesh | Walkway edges in stone |
| **Ramped stucco parapet** | Stucco parapet that ramps down a stair with rounded coping | U352 | Blender mesh | Garden stairs, Grand Balcony lower terrace |
| **Tile-capped wall coping** | Wall top with a small tiled roof cap (roofed coping, barrel-tile coping) | U51, U186 | Blender mesh | Outer walls, garden walls in Lantern River Valley |
| **Machicolated parapet strip** | Modular corbel-and-merlon strip with drop openings between corbels | U209, U370 | Blender mesh | Castle walls, Rose Keep curtain wall |
| **Corbelled gallery ring** | Arched corbel table run round a cylinder as a mock gallery | U226, U227 | Blender mesh | Tower tops of the courtyard towers and Rose Keep |
| **Square merlon wall walk** | Wall walk with plain square merlons and crenels | U273, U275, U282 | Blender mesh | Curtain walls, Star Chapel castle half |
| **Stepped merlon crest** | Islamic stepped merlons in a running crest, also as a ring at a dome base | U276, U295 | Blender mesh | Red Canyon walls, dome drums, castle parapet variant |
| **Scroll volute corbel** | Carved stone corbel ending in a scroll volute | U72, U83, U384 | Blender mesh | Column capitals, balcony supports, walkway corbels |
| **Acanthus scroll console** | Console bracket with acanthus leaf over a scroll | U393 | Blender mesh | Cornice corners, balcony supports |
| **Scroll console balcony** | Stone balcony slab carried on scroll consoles | U234, U309 | Blender mesh | Castle facades, Lagoon City |
| **Art Deco stepped gold bracket** | Stepped ziggurat bracket in gold, like the stepped pier capitals of U331 | U386 | Blender mesh | Capitals and impost blocks in the Great Hall |
| **Bartizan with inverted-cone corbel** | Small round corner turret on an inverted cone of corbel rings, with drop finial variant | U226, U227, U370 | Blender mesh | Front wall corners, courtyard towers, Rose Keep |
| **Corbelled oriel bay** | Projecting corner bay on corbels, glazed | U157, U327 | Blender mesh | Storybook Valley houses, gatehouse corners |

## 5. Walls, masonry & surface shaders

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| **Battered castle base wall** | Concave-sloped base wall of large blocks, block normal map | U51 | Blender mesh + Normal map | Foot of the front wall where it meets the crag, Lantern River keep |
| **Rusticated ashlar with V-joints** | Deep V-jointed rusticated blocks; rusticated arched ground storey variant | U312, U327 | Normal map | Lower castle walls, Lagoon City ground floors |
| **Weathered blue-grey ashlar** | Tiling ashlar with blue-grey weathering and roughness | U184 | Normal map | Long Bridge stonework, gatehouse |
| **Interlocking block masonry relief** | Stylised interlocking blocks as a trim sheet | U83 | Normal map | Tower walls |
| **Rubble and dry-stone walls** | Irregular rubble walls: dry-stone, rubble terrace walls, rubble quoin strips | U123, U176, U227 | Blender mesh + Normal map | Terrace walls, garden borders, outbuildings |
| **Rounded-boulder retaining wall** | Wall of rounded boulders stacked as a bank | U50 | Blender mesh | Lake and pond banks in Lantern River Valley |
| **Arcaded buttress terrace wall** | Long wall of tall arched bays between buttress piers, each pier topped by a small pinnacle | U396 | Blender mesh | Lower circular walkway levels of the castle |
| **Round bastion terrace wall** | Terrace wall with round bastion towers and arched windows | U401 | Blender mesh | Castle tiered walls |
| **Fluted fin pylon wall** | Wall of tall fluted fins | U191 | Blender mesh | Outer castle walls (stylised) |
| **Flared uplit sail buttress** | Buttress that flares out like a sail with an ogee cap, washed by an uplight | U308 | Blender mesh + Decal | Front wall either side of the Great Gate |
| **Veined marble shader** | Procedural cream marble veins with faint moss streaks | U399 | Shader | Castle walls, circular walkways |
| **Rock-to-masonry blend** | Height blend from raw cliff rock into ashlar so the castle grows out of the crag | U363 | Shader | Castle Crag foundation cliffs |
| **Aged plaster shaders** | Plaster that peels or breaks to show stone or brick (vertex-paint mask) | U180, U274, U329, U335 | Shader + Decal | Village walls, cloister courtyard walls |
| **Moss and lichen top-mask shader** | Moss or lichen on upward faces by world normal and cavity; golden moss variant glows faintly at night | U20, U83, U84, U245, U291, U366, U368 | Shader | All ruin stone, old walls, Glowwood rocks |
| **Night castle self-glow** | Emissive window strips plus warm bounce light on the facade | U402 | Shader | Castle at night |
| **Snow and frost top-mask** | White on upward faces of stone and foliage | U120, U211 | Shader | Frost Fjord, winter variant |
| **Glazed square tile wall** | Wall of glossy square glazed tiles | U217 | Shader | Kitchens, bathhouse |
| **Recessed panel seam metal** | Metal skin with recessed panel seams | U32 | Normal map | Observatory dome, airships |
| **Pastel stucco facade kit** | Town-house fronts in pastel stucco with iron balconies and cornices | U336 | Blender mesh | Lagoon City lanes |

## 6. Windows & stained glass

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Gothic stained-glass lancet with quatrefoil head** | Two cusped lancet lights under a pierced quatrefoil oculus (Y bar tracery), quarries in red, green, blue and amber, chunky voussoirs | U159, U198, U223, U347 | Blender mesh + Shader | Front wall bays (with flowing multicolour glass), Library, Star Chapel |
| ★ **Astronomical clock rose window** | Giant round window of concentric rings: spiral inner dial, gear-tooth outer ring, star-studded rim, gold ring segments, rotating hands; set in a deep stepped arch with keystone cartouche | U380 | Blender mesh + Shader | Great Hall facade above the gate, or the end wall of the Grand Ballroom |
| ★ **Arched iron-grid window with mini-arcade bars** | Tall round-headed window with an iron mullion grid; each horizontal register carries a row of small round-arch bars | U331 | Blender mesh + Alpha cutout | Great Hall windows |
| **Gable stained-glass lancet** | Large arched gable window of warm stained glass in a tracery frame | U371 | Blender mesh + Shader | Front wall gables, Grand Ballroom facade |
| **Gold-piped lancet window** | Pointed window outlined in thick gold piping, stained glass inside | U379 | Blender mesh + Shader | Gatehouse walls beside the Great Gate |
| **Triple lancet teal window bay** | Three tall lancets in one bay glazed in glowing teal stained glass | U276, U381 | Blender mesh + Shader | Palace facade, courtyard towers |
| **Twin-light lancet dormer** | Dormer with two lit lancet lights | U233 | Blender mesh + Shader | Castle roofline |
| **Timber-traceried lancet window** | Wooden tracery lancet glowing amber | U210 | Blender mesh + Shader | Storybook houses, chapel |
| **Night/day rose wheel window** | Huge circular wheel window divided into rainbow segments (pink for us), casts coloured light | U160 | Blender mesh + Shader | Tower attic, Grand Ballroom end wall |
| **Radial-spoke rose window** | Rose window of straight spokes from a central boss | U342 | Blender mesh + Shader | Moon Palace facade, Star Chapel |
| **Half-rose stained-glass lunette** | Half wheel with trefoil and quatrefoil petals in pink, green and purple | U346 | Blender mesh + Shader | Arch heads in the Grand Ballroom and Star Chapel |
| **Fan sunburst lunette** | Half-round window with panes radiating from the bottom centre | U254, U257, U332 | Blender mesh + Shader | Above grand doors, upper ballroom clerestory, Twin-stair hall |
| **Radial fanlight arched window** | Round-headed window or door with radial muntins in the head | U17, U156, U165 | Blender mesh | Castle doorways, hall windows, tower rooms |
| **Interlaced-knot stained glass** | Tall window whose leading forms interlaced circles and knots in purple and blue | U338 | Shader | Star Chapel, tower windows |
| **Art Nouveau whiplash window tracery** | Window bars bent into whiplash curves | U248 | Blender mesh | Library, tower windows |
| **Frosted branch window** | Frosted textured glass with lead lines in a stylised tree-branch pattern | U388 | Shader | Grand Ballroom windows |
| **Art Deco sunburst glass fins** | Vertical teal glass fins in gold frames radiating in stepped bars above a great door | U397 | Blender mesh + Shader | Over the Great Hall inner doors, ballroom entry |
| **Tall arched blue glazed window** | Tall arch with vertical ribs and blue glass, emissive at night | U307 | Blender mesh + Shader | Castle tower windows |
| **Glowing diamond-lattice window** | Window frame with diamond lattice and amber emissive glass | U183 | Blender mesh + Shader | Great Hall upper windows |
| **Honeycomb-fill ogee window** | Ogee window filled with a hexagon honeycomb grille | U183 | Alpha cutout + Normal map | Tower windows |
| **Faceted stained-glass bay window** | Barrel bay of faceted stained-glass panes with gold leading | U229 | Blender mesh + Shader | Castle shops, tower bays |
| **Bell-flared balcony pod with stained glass** | Corbelled round balcony with flared bell skirt roof, diamond-leaded glass | U128 | Blender mesh + Shader | Tower bays of the crown towers |
| **Moon window with ring frame** | Round opening with a thick ring frame | U289 | Blender mesh | Tea nook, walkway viewpoints |
| **Round porthole and oculus windows** | Porthole with thick wooden rim (U102), mint-glow cluster (U218), gable oculus (U206), bull's-eye mansard dormer (U253) | U102, U206, U218, U253 | Blender mesh | Boathouse, tower doors, gables, castle roofline |
| **Trefoil oculus roundel** | Round opening pierced as a trefoil | U192, U245 | Blender mesh | Gate gables, Star Chapel, ruins |
| **Biforate window with colonnette** | Two round-arched lights sharing a slim central column | U294 | Blender mesh | Tower windows |
| **Window hoods and surrounds** | Keystone round-arch surround (U251, U327), pedimented hoods (U252), aedicule with shutters (U309), fleur-de-lis and sunburst pediments (U338), scallop-shell hood (U158) | U158, U251, U252, U309, U327, U338 | Blender mesh | Castle wings, Lagoon City and Storybook facades, garden pavilions |
| **Kokoshnik window crown** | Onion-shaped window crown with pierced fretwork | U180 | Blender mesh | Castle residential windows |
| **Louvered shutter window** | Keystone arch window with louvered shutters | U272 | Blender mesh + Decal | Lagoon City houses |
| **Multi-pane wooden window** | Small-paned wooden window with warm glow | U71 | Blender mesh + Shader | Castle residential wings |
| **Mashrabiya bay window** | Projecting timber bay on corbels with lattice infill | U294 | Blender mesh + Alpha cutout | Red Canyon, Lagoon City upper windows |
| **Diamond iron window grille** | Diamond-pattern iron bars over a window | U329 | Alpha cutout | Lower windows |
| **Lit window glow atlas** | Emissive window texture with randomised lit panes and slight flicker (warm amber, grid, paper lattice) | U26, U60, U149, U186, U219, U280, U288, U375, U378 | Shader + Decal | Every window at night, distant towns |
| **Glowing chevron transom** | Emissive chevron panel over a door | U101 | Shader | Inner sanctum doors |
| **Rain-on-glass** | Droplet normal that scrolls down glass | U163 | Shader | Castle windows on storm nights |

## 7. Domes, spires, roofs & finials

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Crown-lantern turret** | Ring of tall pointed-ogee lancet openings with flared petal hoods, each glowing pink, under a bell dome with finial; sits on a slim cylindrical turret with ring string courses and lancet blind arcading | U129 | Blender mesh + Shader | Top of every castle tower and the courtyard towers; signature silhouette |
| ★ **Heart-tracery ogee belvedere crown** | Open belvedere: ring of pointed-ogee arches with heart-shaped cut-out tracery and S-scroll iron balustrades, under a bell-shaped ribbed dome with leaf-shaped dormer tracery and flared bonnet hoods | U128 | Blender mesh | Crown of the cone tower or a back tower; above the Grand Balcony |
| ★ **Stained-glass flame dome** | Gored dome whose glass shows a ring of tall red-orange ogee flame shapes inside blue, each gore split by gilt ribs; drum of small rectangular panes; gilt lantern ring at the top; diamond-slate half-domes round it | U273 | Blender mesh + Shader | Grand Ballroom crown dome, glowing at night |
| ★ **Pierced tracery spire crown** | Open spire of slender pinnacle uprights (bar-tracery skeleton) carrying a gold onion finial; pinnacled buttresses round the base | U371 | Blender mesh | Top of the castle main tower, Star Chapel |
| ★ **Amethyst faceted spire roof** | Tall faceted cone in iridescent violet, sharp facets catching moonlight | U402 | Blender mesh + Shader | Prominent gothic cone of the cone tower (tip 418 m), back towers |
| ★ **Crocketed gothic pinnacle** | Square pinnacle with crockets in rows up every arris, a gabled pointed niche at the base, visible stone blocks | U77 | Blender mesh | Every 20 m along the front wall, Great Gate turrets, railing terminals |
| ★ **Onion dome with lotus collar and kalash finial** | Bulbous onion with a lotus-petal collar at the neck and a tall kalash spire finial; gored lines and gold bands | U82, U278 | Blender mesh | The prominent 30 m radius dome on the central dome tower, 118 m courtyard tower, Moon Palace |
| ★ **Fish-scale slate roofing** | Overlapping round-ended scale tiles in blue-lilac slate laid in rows, slight hue variation per tile | U36, U117, U129, U149, U224, U339, U393 | Normal map | All castle domes, cones and turret roofs |
| **Diamond-slate half-dome apse** | Half-dome of fine diamond slate with gold ribs, ringing a main dome | U273 | Blender mesh + Normal map | Chapels round the flame dome |
| **Ice crystal spire cluster** | Cluster of translucent iridescent crystal spires behind or above a roofline | U348, U356, U373 | Blender mesh + Shader | Castle crown accents, castle crystal garden |
| **White marble spire cluster** | Group of slim white marble spires | U400 | Blender mesh | Castle crown variant, Lagoon City |
| **Gothic pinnacle cluster crown** | Tower crowned by a cluster of crocketed pinnacles around a central spire | U23, U137, U146 | Blender mesh | Tops of the castle keep towers, front wall roofline |
| **Spike pinnacle post** | Slim spike pinnacle on a square post | U366 | Blender mesh | Wall parapets, Long Bridge railings |
| **Needle spire turret cluster** | Round towers with very tall needle cones, often with ball finials; pastel variant | U114, U174, U208, U369, U378 | Blender mesh | Castle skyline, Rose Keep, Storybook Valley |
| **Ivy-wrapped gothic needle spire** | Needle spire with ivy cards climbing it | U32 | Blender mesh + Alpha cutout | Star Chapel, castle chapel spire |
| **Witch-hat cone roof** | Flared cone with shingle normal map and a curled tip at the rim | U95, U140, U213 | Blender mesh + Normal map | Witch-hat towers of the castle (150 m and 126 m courtyard towers), Glowwood cottages |
| **Conical-roof round tower** | Round tower with red or plum conical cap and a corbel ring | U195, U205, U225, U370 | Blender mesh | Back towers, Rose Keep, Storybook tower bridge |
| **Bullet cone turret** | Lathed bullet-shaped cone with ring bands | U366 | Blender mesh | Curtain wall corners, walkway pylons |
| **Flared throne tower** | Tower of curved slab panels flaring out at the top, edged with gold piping bevels | U361 | Blender mesh | Central keep spire variant |
| **Organ-pipe crown** | Array of graded fins in bronze and stone like organ pipes | U381 | Blender mesh | Top of a music tower beside the ballroom |
| **Helical spiral spire** | Spire whose lantern twists in a helix (Borromini lantern) | U256 | Blender mesh | A back tower crown |
| **Distant mage tower spires** | Twisted stacked-block spire (blocks rotated each layer) and a needle spire held up by root buttresses | U65, U185 | Blender mesh | Distant mage towers on the Mountain rim |
| **Faceted teal spire with fins** | Hard-surface faceted spire with angular fins, glossy glaze | U79 | Blender mesh + Shader | Pillar Reach rune tower |
| **Stacked octagonal belfry crown** | Stacked octagonal stages with arched belfry openings, pinnacles and a tall spire | U401 | Blender mesh | Castle main tower variant, Star Chapel |
| **Onion dome on drum arcade** | Onion dome with finial sitting on an arcaded drum | U221 | Blender mesh | Castle side towers, Red Canyon |
| **Gilded onion dome** | Gold onion dome, on a chhatri ring or a side tower | U281, U371 | Blender mesh + Shader | Small onion dome on the right back tower, Lagoon City clock tower |
| **Blue or verdigris onion dome** | Small onion dome in blue glaze or green patina with gold finial | U277, U280 | Blender mesh + Shader | Small turrets, minaret caps in Lagoon City |
| **Onion-dome gate pavilion** | Square pavilion on four piers with an onion dome and finial | U185 | Blender mesh | Long Bridge ends, walkway pylons |
| **Fluted minaret with onion cap** | Slim fluted minaret or chhatri with onion cap | U342 | Blender mesh | Castle skyline accents, Red Canyon |
| **Onion-capped wall turret** | Wall turret with onion cap over an arched gateway | U348 | Blender mesh | Outer wall |
| **Ribbed dome with lantern cupola** | Ribbed dome topped by a small lantern cupola and spike finial | U54 | Blender mesh | Corner turret roofs |
| **Ribbed copper dome with lantern** | Ribbed dome in copper with verdigris and a lantern | U254 | Blender mesh + Shader | Grand Ballroom dome alternative, tower caps |
| **Gilded ribbed dome with oculus gallery** | Gold ribbed dome with a gallery round an oculus | U390 | Blender mesh + Shader | Grand Ballroom dome |
| **Swept-blade gold dome crown** | Gold dome made of swept curved blades | U390 | Blender mesh | Signature tower roofs |
| **Glazed cobalt dome** | Glossy ceramic dome with segment lines | U390 | Shader | Tower domes |
| **Lapis and gold banded dome** | Dome in lapis enamel with gold horizontal bands | U132 | Blender mesh + Shader | Garden pavilions |
| **Majolica tiled dome** | Dome covered in patterned glazed tiles | U152 | Blender mesh + Shader | Castle chapel dome, Lagoon City |
| **Striped melon dome** | Melon dome with alternating coloured gores | U141 | Blender mesh | Garden kiosks |
| **Tiered saucer dome with radial ribs** | Stacked saucer-shaped dome tiers with radial ribs and a lantern finial | U33 | Blender mesh | Gatehouse cupolas |
| **White ribbed-dome watchtower** | White ribbed dome with red bands on a corner tower | U123 | Blender mesh | Curtain wall corners |
| **Windowed drum with terracotta dome** | Drum with windows under a terracotta dome and spike finial | U277 | Blender mesh | Secondary domes, Red Canyon |
| **Gold dome cap on drum** | Plain gold dome on a short drum | U275 | Blender mesh + Shader | Red Canyon walled compound, tower tops |
| **Fish-scale ovoid dome** | Egg-shaped dome covered in scale tiles with a spike finial | U208, U311 | Blender mesh + Normal map | Grand Ballroom wing corner towers |
| **Gilded bell-dome spire** | Tiered octagonal drum, gold bell dome and finial | U139 | Blender mesh | Castle towers |
| **Ribbed cage dome** | Open dome made only of curved ribs | U141 | Blender mesh | Central keep crown variant |
| **Branching gold lattice dome** | Glass dome held by organic branching gold ribs (Voronoi-derived) | U250 | Blender mesh + Shader | Stargazer Observatory, conservatory |
| **Voronoi lattice dome canopy** | Shell cut into Voronoi cells, cell edges glow at night | U03 | Blender mesh + Shader | Garden pavilion, observatory |
| **Iron-ribbed glass conservatory dome** | Glass dome on iron ribs | U153, U158 | Blender mesh + Shader | Castle greenhouse |
| **Domed tempietto with lantern spire** | Small round temple with dome and lantern spire | U366 | Blender mesh | Temple Hill tholos, observatory |
| **Crescent and orb finials** | Gold finial with orbs and a crescent or crescent ring on top (crosses become stars or crescents) | U211, U356, U390 | Blender mesh + Shader | Castle spire tops, main dome, lamp posts |
| **Stellated star lantern finial** | Faceted star with triangular emissive panes | U386 | Blender mesh + Shader | Castle pier tops, gate posts |
| **Tower-top glowing orb** | Glowing sphere at a spire tip with bloom | U304 | Blender mesh + Shader | Spire finials of the castle |
| **Turned bulb and urn finials** | Lathed bulb, urn or onion knob (giboshi) finials, bronze or gilt | U54, U62 | Blender mesh | Roof corners, railing posts, walkway newels |
| **Pinecone and egg finial** | Carved pinecone or egg shape on a short base | U339 | Blender mesh | Roof peaks |
| **Chevron-crowned finial post** | Forged bronze post with a chevron crown on a rubble pillar | U123 | Blender mesh | Path markers, walkway gates |
| **Gilt wave-scroll roof corner ornament** | Gold curling wave scroll at a roof corner | U399 | Blender mesh | Tower roof corners |
| **Ridge cresting spikes** | Row of small spikes along a roof ridge | U234 | Blender mesh | Roof ridges |
| **Gold fish-scale shingle** | Small gold-yellow scale tiles laid in curving rows | U353 | Normal map | Pavilion and turret roofs, Glowwood pavilion |
| **Bulged wooden shingle roof** | Fat curved wooden shingles, wavy or sagging, sometimes bowed | U102, U140, U210, U229, U233 | Blender mesh + Normal map | Glowwood cottages, Storybook houses, gatehouse |
| **Moss-shingle and moss-ridge roof** | Shingle roof with moss on the ridge and upper faces | U64, U224, U230 | Blender mesh + Shader | Gardener's cottage, old roofs in the Glowwood |
| **Barrel and pantile roof** | Glazed barrel tiles, chunky pantiles or terracotta Roman tiles in rows | U07, U214, U328, U347 | Normal map + Blender mesh | Lantern River Valley, Storybook and Lagoon City roofs |
| **Green glazed tile turret roof** | Turret roof of green glazed tiles | U308 | Blender mesh + Normal map | Corner turrets |
| **Thatch roof** | Thatch shell with straw strand normal, crossed ridge bars | U06, U49, U63, U203 | Blender mesh + Normal map | Storybook farm hamlet, Glowwood huts |
| **Upswept eave roof tier** | Tiered roof whose eaves curve up at the corners, gilded trim | U105, U135, U186, U187, U242, U323 | Blender mesh | Lantern River Valley shrines, tea pavilion, secondary towers |
| **Cusped karahafu gable** | Bell-curved cusped gable dormer with carved bargeboard crest | U52, U58, U288, U316 | Blender mesh | Misty Keep, castle dormers (gilt-edged), market gatehouses |
| **Crossed-gable finial roof** | Roof module with crossed gable boards at the ridge, teal tile | U62, U96 | Blender mesh | Glowwood lodges, boathouse |
| **Swooping concave gable** | Gable whose bargeboards swoop in a concave curve with horn tips | U149, U196 | Blender mesh | Glowwood cottages |
| **Winged scroll gable ornament** | Crossed bargeboards ending in carved scrolls (no animal heads, no eyes) with a spike finial | U223, U232 | Blender mesh | Frost Fjord longhouse, Glowwood lodge, walkway kiosks |
| **Tall tent roof with flared eaves** | Very tall roof with flared eaves and dormers | U222 | Blender mesh | Storybook manor and windmill house |
| **Stacked roof-skirt tower** | Tower with several flared roof skirts and balcony rails | U04, U224 | Blender mesh | Storybook wizard tower house |
| **Dormer and hip roof kit** | Hipped roofs with dormers, triple pointed dormer gable, silver ridge caps and star finial | U139, U199, U208 | Blender mesh | Lagoon City and castle roofline |
| **Gable truss infill** | King-post with radiating struts in a gable; ridge zigzag truss gallery | U223, U224 | Blender mesh | Gables in Storybook Valley |
| **Elven gabled hall roof** | Long steep gabled roof kit | U237 | Blender mesh | Hall under the Mother Tree, castle annexes |
| **Rounded-eave shingle roof** | Shingle roof with rounded eaves and a gold rim light | U114 | Blender mesh + Normal map | Gatehouse roofs, villages |
| **Open-arch cupola belvedere** | Small cupola of open arches on a tower top | U393 | Blender mesh | Tower tops, Baroque garden buildings |
| **Saucer-disc tower crown** | Disc-shaped crown with radial fins | U31 | Blender mesh | Observatory tower top |

## 8. Towers & tower bodies

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| **Crenellated drum tower** | Round tower with crenellations and a band of arched windows | U127, U242 | Blender mesh | Curtain wall towers, Rose Keep |
| **Gothic gate tower with nested lancets** | Square gate tower with nested lancet arches and pinnacles | U184 | Blender mesh | Gatehouse at the castle end of the Long Bridge |
| **Octagonal tower with wrap gallery** | Octagonal tower with a gallery running round it | U228 | Blender mesh | Lookout towers on the outer ring |
| **Minaret balcony ring** | Ring balcony on corbels round a tall tower | U221 | Blender mesh | Red Canyon minarets, tall castle towers |
| **Curved bay tower with belt course** | Rounded bay tower with a belt-course cornice | U338 | Blender mesh | Castle corner towers |
| **Rounded corner tower block** | Town block with a rounded corner and console balconies | U312 | Blender mesh | Lagoon City |
| **Stilted corner watchtower** | Small tower raised on posts at a wall corner | U51, U52 | Blender mesh | Lantern River Valley walls |
| **Belfry tower with bell and fish-scale cupola** | Square bell tower with paired pointed openings, colonnettes, blind arcaded cornice, ogee fish-scale cupola with ball finials | U273, U347 | Blender mesh | Castle bell tower, Lagoon City |
| **Ruined belfry with cupola** | Ruined square bell tower with corner finials and a domed cupola | U02, U14 | Blender mesh | Glowwood ruin landmark, Ruin Meadows |
| **Clock tower with domed cap** | Tower with clock faces and a domed cap; gold-framed version with blue enamel | U54, U152, U360 | Blender mesh + Shader | Birthday countdown clock: castle keep, Storybook square |
| **Campanile kiosk** | Small square tower kiosk with open belfry | U150 | Blender mesh | Wall corners |
| **Root-flared tower plinth** | Tower base that spreads into rock and roots | U226 | Blender mesh + Normal map | Islet tower, towers rising from cliffs |
| **Arcaded tower tier** | Tower stage made of arcades | U145 | Blender mesh | Background towers |
| **Baroque tiered lantern tower** | Stacked Baroque stages ending in a lantern | U253 | Blender mesh | Castle palace wing |
| **Tiered colonnade rotunda** | Stacked drums each ringed by columns | U362 | Blender mesh | Stargazer Observatory hub tower |
| **Glass lantern tower** | Fluted glazed cylinder with a saucer balcony, frosted glass glowing | U141 | Blender mesh + Shader | Towers on the circular walkways |
| **Lighthouse and beacon towers** | Striped or crooked lighthouse with gallery railing, parasol or mushroom cap; needle tower with a saucer ring and light cone | U26, U111, U115, U383 | Blender mesh | Lagoon City lighthouse obelisk, lake shore, Mountain rim beacons |
| **Mini tholos turret** | Ring of columns with a small dome | U361 | Blender mesh | Corner turrets of the curtain wall |
| **Stepped set-back ruin tower** | Tower of stacked stepped stages | U97 | Blender mesh | Jungle ruins temple |
| **Tree-crowned ruin tower** | Ruined tower with a tree growing out of the top | U363 | Blender mesh + Alpha cutout | Glowwood ruins |
| **Spiral stair tower** | Tower wrapped by an external spiral stair | U221, U227 | Blender mesh | Islet tower, sky-island towers |
| **Halo and gyro rings round a spire** | Gold or emissive rings that orbit or float around a spire | U137, U169, U385 | Blender mesh + Shader | Castle central spire signature |
| **Gold-framed indigo crown gable** | Huge inverted-triangle gable with gold faceted armature on indigo panels, gold diamonds and lozenges, ring rosette at the apex, a veiled figure inside | U395 | Blender mesh + Shader | Top of the castle main block above the gate |
| **Indigo pilaster banner with gold frame** | Tall indigo panel framed in gold hung down a pilaster | U395 | Blender mesh + Decal | Tower faces |

## 9. Columns, capitals & piers

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Mughal bell capital column** | Round column with a bell capital: stacked square abacus, cavetto collar and a band of tiny lotus-petal relief (1-2 cm); bulbous torus base | U181 | Blender mesh + Normal map | Colonnades on the circular walkways, cloister walk, Grand Balcony loggia |
| ★ **Muqarnas honeycomb capital with gilt annulets** | White marble capital of tiered honeycomb niches over gilded ring bands; composite variant with gilt acanthus and muqarnas blocks (U284) | U284, U346 | Blender mesh | Grand Ballroom columns, Moon Palace portico |
| **Gilded Corinthian column** | Fluted shaft with a gilded acanthus Corinthian capital; paired version for portals | U132, U255, U257 | Blender mesh + Shader | Grand Ballroom colonnade, Great Hall, gate pavilion, Temple Hill |
| **Gilt-capital fluted column on red marble plinth** | Fluted column with gilt capital standing on a red marble plinth | U266 | Blender mesh | Grand Ballroom colonnade |
| **Paired fluted pier with gilt capitals** | Two fluted square piers side by side under gilt capitals | U364 | Blender mesh + Normal map | Ballroom portico, Great Gate frame |
| **Vine-engraved column with ring collars** | Column with shallow incised climbing vines and leaf fronds, bud-capital ring mouldings and lily sprigs | U128 | Blender mesh + Normal map | Grand Ballroom colonnade, gate columns |
| **Lotus-bell column with planter collar** | Vase-shaped lotus or tulip-bell shaft sections with blue-ringed collars and a planter-cup band; leaf crown capital with green gem drops | U388 | Blender mesh | Grand Ballroom arcade |
| **Lotus-capital column** | Slim column with vase base and a lotus bracket capital; arcade version | U283, U295 | Blender mesh | Verandas, cloister, Moon Palace |
| **Solomonic twisted column** | Spiral twisted shaft, plain stone or gilded | U124, U197 | Blender mesh | Balcony supports, rock-cut cliff temple |
| **Classical column with torus base** | Plain round column on torus and square plinth; Tuscan pier with entablature | U81, U272 | Blender mesh | Colonnades, Colonnade mirror hall, loggias |
| **Veined marble column with gilt rings** | Polished cream-grey veined marble shaft with gilt rings at base and neck | U284 | Blender mesh + Shader | Portico, Grand Ballroom colonnade |
| **Turned stone pillar with collar rings** | Lathed pillar with stacked collar rings | U113 | Blender mesh | Terrace pavilions, walkway lamp posts |
| **Panel-carved square pillar** | Square pillar with sunk carved panels and a stepped capital | U130 | Blender mesh + Normal map | Garden pergolas, ballroom terrace |
| **Fluted giant pilaster** | Flat fluted pilaster with a bullnose base | U246 | Blender mesh | Grand Ballroom walls |
| **Turned spindle pilaster** | Lathed spindle half-column for timber facades | U180 | Blender mesh | Facades, gallery posts |
| **Pillar with ring medallion** | Pier carrying a concentric-ring medallion and lozenge plaque (rosette replaces any head); ring-medallion gate pier; clock roundel pier | U78, U247, U389 | Blender mesh + Normal map | Gate piers, forecourt |
| **Gold crown-cage column cap** | Open gold cage shaped like a crown on a column top | U356 | Blender mesh + Shader | Gate pillars, Long Bridge pillars |
| **Glowing column caps** | Violet light dome on a column; living-wall pillar with saucer cap | U249, U307 | Blender mesh + Shader | Glowwood pavilions, garden plaza |
| **Stepped pier cap** | Stepped block cap on a pier | U184 | Blender mesh | Long Bridge piers |
| **Broken fluted column ruin** | 24-flute column snapped off, weathered; set of broken pieces and trilithon pair | U91, U200, U362 | Blender mesh + Normal map | Ruin Meadows, Glowwood ruins, Temple Hill approach |
| **Overgrown ruin pillar** | Pillar with moss and vine drape | U48, U175 | Blender mesh + Shader | Glowwood ruins, ruined outer wall |
| **Ruined colonnade** | Row of columns, some broken, standing in water or as a portal | U21, U97 | Blender mesh | Long Lake shallows, sky islands |
| **Stepped-plinth memorial column** | Single column on a stepped plinth | U127 | Blender mesh | Courtyard monument |
| **Giant parasol tree column** | Column that opens at the top like a parasol | U183 | Blender mesh | Plaza centrepiece |

## 10. Railings, balustrades & screens

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Gothic tracery railing panel** | Panels of pointed lancets, twin lights each topped by a cusped quatrefoil roundel, rose bosses between, square newel posts with caps | U77 | Blender mesh + Alpha cutout | Circular walkways, castle terraces, Long Bridge railing |
| ★ **Pierced openwork balustrade** | Stone balustrade cut into a flowing lattice of arched and quatrefoil openings | U401 | Blender mesh + Alpha cutout | Long Bridge railing (lake shows through), circular walkways |
| ★ **Pierced stone jali balustrade** | Stone panels pierced with a geometric grid or star lattice, repeated between posts | U278 | Blender mesh + Alpha cutout | Long Bridge railing, walkways, Moon Palace |
| ★ **Gilded strapwork lattice screen** | Gold Ottoman strapwork lattice of interlaced ogival cells with quatrefoil-like nodes on a dark ground; backlit at night | U284 | Alpha cutout + Shader | Grand Ballroom bays, throne room screens, Grand Balcony garden |
| ★ **Vase baluster balustrade** | Turned vase balusters under a bullnose rail with square pedestals; curving two-tier version for terraces | U152, U176, U190, U252, U261, U272, U351 | Blender mesh + Instanced prop | Circular walkways, terraces, Long Bridge, grand stairs |
| ★ **S-scroll iron balcony railing** | Wavy S-scroll and tendril ironwork panels under a thin curved top rail, round balcony | U128 | Blender mesh + Alpha cutout | Grand Balcony, circular walkways |
| **Arched-opening stone balustrade** | Solid rail over a row of small arched openings between capped posts; arcaded pierced parapet variant | U197, U350 | Blender mesh | Walkway railings, terrace edges |
| **Hexagram mashrabiya lattice panel** | Six-point star lattice cells that cast patterned shadows | U292 | Blender mesh + Alpha cutout | Cloister screens, walkway balustrade infill |
| **Gilded lattice gallery balustrade** | Openwork gold grille along gallery fronts with gold edge piping | U268 | Alpha cutout + Shader | Grand Ballroom upper galleries |
| **Bulbous gold-ringed baluster** | Fat lathed baluster with gold rings, in a railing array; turquoise version | U177, U178, U388 | Blender mesh + Instanced prop | Balconies, terrace balustrades, gate terrace |
| **Balustrade with lantern posts** | Rail and scroll infill between posts that each carry a lantern | U134, U136 | Blender mesh | Cliff-edge terraces, walkways, Long Bridge |
| **Scroll-iron stair balustrade** | Iron scroll panels along a stair and gallery | U129, U161, U264 | Blender mesh + Alpha cutout | Grand staircase, Great Hall gallery |
| **Overlapping-arc iron balustrade** | Rows of overlapping semicircular iron arcs like rainbows | U331 | Blender mesh | Great Hall balconies, walkways |
| **Wrought-iron balcony with scroll caps** | Straight bars with scroll caps on each post | U336 | Blender mesh | Facades in Lagoon City |
| **Spear-top iron railing** | Iron loops or bars with spear tops; quay railing with finials; spiked fence with blue candles | U104, U190, U234 | Blender mesh | Walkways, Long Bridge approach, lake edges |
| **Hoop iron railing** | Low curved hoop-top railing or hoop-loop garden fence | U305, U342 | Blender mesh | Garden lawns, flower beds |
| **Hex-diamond lattice railing** | Tube railing of hexagon and diamond cells, recoloured gold | U171 | Blender mesh | Long Bridge railing variant, walkways |
| **Lattice-truss and saltire railing** | X-braced lattice rail in wrought iron | U48, U234 | Blender mesh | Secondary footbridges, canal bridges |
| **Fretwork lattice railing** | Pierced wooden or stone fret panels; jharokha fret rail | U281, U286 | Blender mesh + Alpha cutout | Balcony railings, Lagoon City balconies |
| **Curved brass handrail with gold piping** | Curved brass rail with a gold line | U271 | Blender mesh + Shader | Walkways, stairs |
| **Slim balcony railing** | Thin plain rail with gothic finials added | U215 | Blender mesh | Upper castle balconies |
| **Kumiko lattice screen** | Fine wooden grid screen, backlit glow | U09 | Blender mesh + Alpha cutout | Lantern River Valley pavilion walls |
| **Jali arched screen** | Arched pierced screen in a window or wall, ivy-clad garden version | U179, U260 | Alpha cutout | Garden pavilion windows, garden walls |
| **Pierced star-and-cross jali canopy** | Canopy roof pierced with eight-point stars and crosses | U183 | Blender mesh + Alpha cutout | Garden pavilion roof, Glowwood gazebo |
| **Lattice trellis panels** | Diamond or diagonal trellis with vines | U72, U276, U349 | Blender mesh + Alpha cutout | Upper windows, garden walls, Glowwood edges |
| **Rope swag barrier** | Rope hung in swags between short posts, with lanterns or bollards | U79, U113, U176, U336 | Blender mesh | Viewing terraces, queue lines |
| **Stanchion with velvet rope** | Brass posts with red velvet ropes | U161, U346 | Instanced prop | Grand Ballroom entrance, throne area |
| **Timber fences** | Split-rail, rope-lashed, wattle, palisade, red post-and-rail with brace, dry-stone pier fences | U05, U16, U17, U41, U49, U50, U64, U148, U193 | Blender mesh | Storybook meadows, Glowwood paths, Lantern River plots |

## 11. Gates, doors & portals

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Gilded stained-glass grand gate** | Colossal open gate leaves framed by thick gold rails and gold lattice, filled with leaded teal and amber glass in lozenge and pointed panes, crest-topped finials | U379 | Blender mesh + Shader | The 100 m Great Gate (glass recoloured to blue, yellow and purple fractured mosaic) |
| **Art Deco stepped-arch iron gate** | Iron gate whose top steps up in Deco arches, curves converted to mesh | U247 | Blender mesh | Red-carpet side avenue east gate, garden gates |
| **Grand arched gate with chevron door** | Round-arched gate with chevron planked doors and gold inlay; portcullis grille of instanced bars | U370 | Blender mesh + Decal | Rose Keep gate, gatehouse |
| **Sunburst-fan iwan portal** | Deep arched portal whose hood is a gold sunburst fan, inside a rectangular frame | U280, U355 | Blender mesh + Normal map | Moon Palace portal, castle main portal option |
| **Leaning pylon monument** | Pair of tall leaning rose-marble pylons with gold lines | U398 | Blender mesh | Great Gate pylons at the bridge end |
| **Gate pylon with pierced roundel band** | Pylon with a band of circular cut-outs | U60 | Blender mesh + Normal map | Castle gate towers |
| **Twin monolith portal with interlace crest** | Two flared pillars joined by a gold openwork interlace crest | U136 | Blender mesh | Long Bridge approach, Glowwood clearing |
| **Celtic-knot gold-crowned waygate** | Arch gate crowned with gold and jade knotwork | U134 | Blender mesh + Shader | Teleport plaza on the walkways |
| **Torii-style gateway** | Two posts with an upswept top beam and tie beam; glowing post edges variant; gate before a waterfall | U09, U37, U52, U59, U68, U306, U318, U323 | Blender mesh | Lantern River Valley shrines, Glowwood entrances |
| **Pailou lantern gate** | Posts with double beams and a tiled roof, lanterns hung below; name plaque variant | U317, U319 | Blender mesh | Lantern River market entrance, bridge ends |
| **Ceremonial pillar gate with lantern string** | Two pillars with glowing orbs strung between | U287 | Blender mesh + Shader | Entrance to the Glowwood, festival grounds |
| **Post-and-lintel timber gate** | Two posts and a lintel beam | U238 | Blender mesh | Path entrances |
| **Sun gate arches** | Red-banded sun gate arch; red and gold triumphal arch | U386, U387 | Blender mesh | Glowwood entry, walkway entry arches |
| **Moon-gate wall** | Wall pierced by a full round opening with a medallion boss; ruined ring version | U119, U135 | Blender mesh | Glowwood entrance, garden walls |
| **Gate pavilion with gold ridge medallion** | Roofed gate pavilion with a gold medallion on the ridge | U07 | Blender mesh + Shader | Inner gate variant |
| **Covered bridge-gate** | Roofed arched gate over a bridge | U114 | Blender mesh | Gorge crossing to the Glowwood |
| **Ruined arch gate** | Ruined arch kit of pier, carved capital and arch ring; mossy ruined arch gate; colossal round arch ruin | U84, U117, U290 | Blender mesh + Shader | Ruin Meadows, Glowwood ancient ruins |
| **Multifoil gilded arch door frame** | Door frame whose arch is cut into gilded lobes | U197 | Blender mesh + Shader | Grand Ballroom side doors |
| **Knotwork-roundel bronze double door** | Arched bronze double door with large knotwork roundels | U72 | Blender mesh + Normal map | Castle inner keep door, Glowwood shrine |
| **Pointed portal with carved tympanum** | Pointed arched portal with a carved tympanum and hood moulding | U72 | Blender mesh + Normal map | Star Chapel entrance |
| **Receding archivolt doorway** | Door set in several receding arch orders, stepped jambs | U182, U274, U380 | Blender mesh | Castle side doors, grand entrances |
| **Iron-strap arched door** | Planked arched door with iron straps and a ring knocker; chevron-planked variant | U176, U209 | Blender mesh | Castle side doors |
| **Art Deco fan door grille** | Gold fan and fountain motif grille on teal glass doors | U380 | Blender mesh + Decal | Palace doors, Great Hall doors |
| **Meander-ring disc portal** | Round disc door with a meander ring inlay that glows at night | U178 | Blender mesh + Shader | Ballroom grand door or secret garden gate |
| **Iron gates in stone arches** | Arched iron fan grille gate; wrought-iron gate in a stone archway | U293, U345 | Blender mesh | Garden entrances |
| **Keystone round-arch gate with crest** | Round-arch gate with keystone and crest relief | U293 | Blender mesh + Normal map | Secondary castle gates |
| **Baroque scroll arcade gate** | Arcade gate with Baroque scroll ornament | U385 | Blender mesh + Normal map | Market entrance |
| **Segmental arched entrance with crown lamp** | Segmental arch with a lamp hung at the crown | U322 | Blender mesh | Castle gate side entrances |
| **Door hoods** | Gabled tiled hood, pent roof on brackets, cartouche canopy, sun-medallion hood | U154, U196, U229, U293 | Blender mesh | Castle side doors, doorways |
| **Revolving rotunda door** | Mahogany revolving door with a gilt band (lettering dropped) | U340 | Blender mesh | Party salon entrance |
| **Cliff-cut ogee portal** | Ogee doorway cut into a cliff with star glow inside | U94 | Blender mesh + Shader | Secret grotto entrance |
| **Organic pierced-stone arch** | Arch of openwork roots in stone | U122 | Blender mesh + Alpha cutout | Glowwood temple doors |
| **Ring portal family** | Round portals: stone ring in water (U28), glass ring with pearl orb (U100), floating voussoir ring (U105), shard vortex (U70), energy curtain (U78), outline arch (U213), spiral ring over stair altar (U383), halo ring arch (U383) | U28, U70, U78, U100, U105, U213, U383 | Blender mesh + Shader | Glowwood portals, sky islands, castle sky gate |
| **Gold medallion clock shrine** | Tall spire shrine with a gold clock disc and veiled winged figures | U396 | Blender mesh + Shader | Forecourt centrepiece at the foot of the grand staircase |

## 12. Stairs & bridges

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Imperial bifurcated staircase** | One central flight that splits into two curved flights with curved balustrades, newel posts and scrolling banister ends; glowing sunburst niche on the landing | U332 | Blender mesh | Twin-stair hall, Great Hall |
| ★ **Curved circular walkway segment** | Arc deck module with a bevelled rim and a trim band, repeatable round the castle | U83 | Blender mesh | The three circular white walkways (direct match) |
| ★ **Multi-arch viaduct** | Repeating round-arch bays on piers with cutwaters; long version with towers | U95, U138, U368, U374, U400 | Blender mesh | The Long Bridge two-tier arcade, aqueduct to Temple Hill |
| **Twin grand staircase with drum newels** | Two straight flights with drum newels and cone finials | U219 | Blender mesh | Castle main entrance stair, ballroom stair |
| **Double-flight grand stair** | Two flights with balustrades meeting at a landing | U253 | Blender mesh | Forecourt to ballroom |
| **Grand balustraded stair** | Wide stair with a central landing, balustrades and flanking pole banners | U129, U170, U311, U356 | Blender mesh | Grand staircase flights |
| **Sweeping stone handrail stair** | Stone handrail that sweeps round, panelled newel topped by a globe lamp | U264 | Blender mesh + Shader | Entrance hall to ballroom |
| **Fan staircase with bullnose steps** | Steps that fan out with curved bullnose edges | U271 | Blender mesh | Ballroom and throne-room entry |
| **Wrapping grand stair** | Stair that wraps round a tower | U362 | Blender mesh | Approach to a ballroom tower |
| **Switchback balustraded ramp** | Ramp that zigzags with balustrade posts | U361 | Blender mesh | Castle approach road |
| **Spiral ring wall ramp** | Parapet ramp spiralling round a hill | U371 | Blender mesh | Circular walkways round the crag |
| **Brick cheek-wall stair** | Stair between brick cheek walls with pillar planters | U282 | Blender mesh | Garden terraces |
| **Crescent and amphitheatre steps** | Curved crescent steps or semicircular step rings | U78, U122 | Blender mesh | Terrace stairs to pools, garden descents |
| **Stone stair kits** | Flagstone, mossy carved, rock-cut winding and cliff-hugging stairs | U09, U59, U91, U174 | Blender mesh | Garden slopes, cliff paths |
| **Rope-railed plank stair** | Plank steps with rope rails | U199 | Blender mesh | Sky island paths, Pillar Reach |
| **Arched lake bridge with cutwaters** | Few-arch stone bridge with pointed cutwaters | U369 | Blender mesh | Lagoon City canals, Long Bridge spur to the Moon Palace |
| **Gorge arch bridge with gatehouse** | Arch bridge with a gatehouse on it | U378 | Blender mesh | Gorge crossings |
| **Sky-arch bridge with inhabited deck** | Natural-looking arch with buildings on the deck | U238 | Blender mesh | Red Canyon sky-arch |
| **Flying arch sky-bridge** | Thin arch bridge between towers | U369, U375 | Blender mesh | Links between castle towers |
| **Arched skybridge between buildings** | Covered arched passage between houses or towers, ivy-draped | U195, U225 | Blender mesh + Alpha cutout | Town gate over road, castle tower links |
| **Arched screen bridge with spire posts** | Arched bridge with screen panels and spire posts | U141 | Blender mesh | Courtyard garden canals, Lagoon City |
| **Covered pavilion bridge** | Bridge with a roofed pavilion on it | U188 | Blender mesh | Lantern River Valley, between islands |
| **Humpback bridges** | Humpback arch bridges with lattice, panelled, iron or brick railings | U07, U53, U62, U152, U206, U251 | Blender mesh | Lagoon City canals, Lantern River Valley streams, garden canals |
| **Rope and plank suspension bridge** | Sagging rope bridge with slats, with X-pole anchors | U08, U66, U98, U228, U236 | Blender mesh | Pillar Reach, sky islands, Glowwood chasms |
| **Plank and trestle footbridges** | Plank footbridges with post rails, arched stilt footbridge, long trestle, trestle with winch | U33, U42, U56, U107 | Blender mesh | Glowwood streams, river crossings |
| **Fallen log and pillar bridges** | Mossy fallen log or a fallen carved pillar used as a bridge | U69, U125 | Blender mesh | Glowwood rivers, canyon crossings |
| **Stepping stones** | Flat slabs, round pads or broken slabs through grass or shallow water, foam ring around each | U02, U46, U67, U89, U167, U205, U290, U391 | Blender mesh + Instanced prop | Glowwood streams, garden paths |
| **Stilted walkways and boardwalks** | Covered stilted walkway, ring boardwalk round a tower, marsh boardwalk | U49, U96, U236 | Blender mesh | Walkways over water, Glowwood marsh |
| **Overgrown ruined causeway** | Broken causeway with moss over water | U376 | Blender mesh + Shader | Glowwood lake |
| **Giant chain with winch drum** | Large instanced chain links over a winch drum | U83 | Blender mesh | Drawbridge, floating island tethers |
| **Glowing chain links** | Chain links with emissive glow | U22 | Blender mesh + Shader | Bridge railings, gate chains |

## 13. Floors & paving

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Art Deco sunburst floor inlay** | Alternating gold and cream rays radiating from a centre, inside a circular border with a stepped, notched Deco outline; square tiles beyond | U331 | Decal + Normal map | Great Hall floor round the clock kiosk, castle foyer |
| ★ **Gold-ribbon swirl floor inlay** | Interlocking flowing curved bands of gold ribbon dividing deep lapis and pale-blue fields, mirror-gloss | U249, U355 | Decal + Normal map + Shader | Grand Ballroom floor, palace forecourt |
| ★ **Interlaced-rings marble floor** | Interlocking circles and arcs in brown and gold veined marble in a square field, border of lozenge-in-rectangle tiles, pink herringbone border beyond | U338 | Decal + Normal map | Forecourt plaza, Grand Ballroom centre |
| ★ **Gold-inlay marble plaza** | Marble plaza crossed by gold inlay strips that glow at night | U397 | Decal + Shader | Forecourt plaza at the top of the avenue |
| **Processional inlay path** | Long path of blue and purple stripes divided by gold lines | U379 | Decal | The straight avenue to the Great Gate, ballroom aisle |
| **Compass-rose mosaic medallion** | Mosaic rose with red rosette, blue lattice and a key border; marble inlay version | U133, U154, U350 | Decal + Normal map | Castle courtyard, ballroom entrance terrace, Grand Balcony floor |
| **Star medallion floor with sunken well** | Radial star or compass inlay round a central sunken well or rosette | U257, U265, U270 | Decal + Blender mesh | Grand Ballroom centre, Throne rotunda, entrance hall |
| **Gold-piped star around a crystal** | Compass star in gold piping round a crystal set in the floor | U104 | Decal + Shader | Courtyard centrepiece, ballroom floor |
| **Medallion marble floor panel** | Large chequered slabs with inset square panels containing round acanthus medallions in rust-red on sky blue with gold borders | U162, U364, U388 | Decal + Shader | Grand Ballroom floor, Party salon |
| **Greek-key circular mosaic medallion** | Ring of Greek-key mosaic round a disc | U81 | Decal + Normal map | Colonnade mirror hall, rotunda |
| **Concentric ring plaza** | Paving laid in annular rings round a centre, raised ring kerbs with bullnose edges | U77, U94, U134, U151, U197, U269, U306 | Blender mesh + Normal map | Castle courtyard centre, walkway hubs, forecourt |
| **Concentric dais disc** | Raised round platform with ring grooves or a carved centre (meander, spiral, hearth, rune) | U105, U106, U135, U136, U150, U333, U354 | Blender mesh + Normal map | Lantern Cove stage, walkway teleport pads, plaza nodes |
| **Radial flagstone and fan cobble paving** | Slabs laid as a fan or radial star, setts laid in fan arcs | U136, U157, U210, U219, U309, U341, U344, U381 | Normal map | Plazas round fountains, forecourt, Lagoon City campo |
| **Chequer marble floor** | Square or diagonal chequer of white and dark marble with reflection; quatrefoil black-and-cream variant | U197, U265, U271, U337 | Shader | Throne rotunda, ballroom, halls, market square |
| **Parquet with black star inlays** | Wood parquet with small black star inlays | U266 | Decal + Shader | Grand Ballroom floor alternative |
| **Mirror-polished marble floor** | Glossy marble with planar or screen reflections | U248, U267, U332 | Shader | Grand Ballroom, Twin-stair hall, Library |
| **Leaded stained-glass floor** | Voronoi cells of coloured glass with an emissive glow from below | U250 | Shader | Grand Ballroom dance floor |
| **Inscribed paving tile** | Square paving with hairline inscribed border lines | U380 | Normal map | Plazas and walkways |
| **Wave mosaic promenade** | Two-tone calçada wave pattern | U314 | Shader | Walkway paving variant, Lagoon City quay |
| **Diamond lozenge tile floor** | Glossy diamond tiles in a lozenge grid | U263 | Shader | Covered walkways, cloister walk |
| **Key-fret and diamond tile floor** | Tile panel of key fret round diamonds | U134 | Normal map | Castle terraces |
| **Herringbone brick paving** | Bricks in herringbone | U153, U251 | Normal map | Kitchen garden, Lagoon City plazas |
| **Checker terracotta floor** | Terracotta tile checker | U166 | Shader | Tower balconies |
| **Hexagonal flagstone paving** | Bevelled blue-grey hexagon slabs | U353 | Normal map | Glowwood paths, around the leaf pavilion |
| **Crazy paving** | Irregular flagstones, sometimes cracked or with grass joints | U62, U92, U152, U335, U358, U392 | Normal map | Garden paths, village plazas, ruins |
| **Cracked flagstones with grass** | Square flags with cracks and grass in the joints | U93, U168, U328 | Normal map + Decal | Old courtyards, Storybook lanes |
| **Cracked flagstones with glowing seams** | Voronoi crack mask with emissive joints | U213 | Shader | Castle courtyard magic moment |
| **Cobbles and setts** | Rounded cobbles, worn lanes, sett grid | U74, U155, U176, U198 | Normal map | Storybook lanes, forecourt streets, ruins |
| **Large-slab forecourt paving** | Large rectangular slabs in a running grid | U79, U178 | Normal map | Castle forecourt |
| **Flagstone path with brick band** | Flag path with a curving brick inlay band down the middle | U123 | Normal map + Decal | Castle approach path |
| **Mosaic medallion roundels** | Round pebble or tile mosaic pads with radial pattern set into paving or a pool | U07, U258, U260 | Decal | Pool corners, plaza nodes |
| **Water channel inlay** | Narrow flowing water strip set into paving | U364 | Shader | Walkways, Moon Palace terraces |
| **Arabesque incised floor inlay** | Curving incised arabesque lines across square flags | U128 | Decal + Normal map | Grand Balcony and ballroom floors |
| **Iron grilles in floors** | Perforated circle grate plate, radial iron grille basin | U10, U259 | Normal map + Alpha cutout | Bridge deck vents, fountain drains |
| **Glowing floor sigils and runes** | Emissive circles of glyphs: arcane sigil (U77), rune wheel (U104), glyph ring (U98), concentric sunburst sigil (U172), portal ring (U274), inset panels (U325) | U77, U98, U104, U172, U274, U325, U384 | Decal + Shader + Particles | Ballroom reveal point, portal spots, walkway nodes |
| **Carpet runners** | Red carpet; medallion carpet with gilt border; striped kilim | U161, U247, U334 | Decal | Red-carpet side avenue, Great Hall aisles and stairs |
| **Wet stone and puddle reflections** | Roughness puddle mask with reflections | U10, U57, U65, U216, U318, U387 | Shader + Decal | Courtyards and lanes after rain |
| **Paths and roads on terrain** | Winding dirt, gravel and pale road splats, stamped flag decals, square pavers with gaps | U03, U15, U40, U207, U228, U367 | Decal | Approach roads, garden paths |

## 14. Ceilings, vaults & chandeliers

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Girih star coffered ceiling** | 8- and 16-point girih star strapwork in shallow raised gold-tan ribs on deep indigo, each star in a cusped octagonal coffer frame with a deep stepped cornice | U181 | Normal map + Decal + Blender mesh | Grand Balcony loggia ceiling, cloister vaults, Throne rotunda |
| ★ **Galaxy-sky ceiling** | Coved ceiling opening onto a pink nebula star field, ringed by pink crystal and blossom cornice, rococo gold C-scroll coves | U268 | Shader + Instanced prop | Grand Ballroom ceiling (birthday moment) |
| ★ **Coffered filigree ceiling** | Stepped rectangular and oval coffers filled with gold arabesque scroll filigree, large oval centre medallion with concentric mouldings | U388 | Blender mesh + Normal map + Decal | Grand Ballroom ceiling |
| ★ **Crystal tiered chandelier** | Tiered rings of candle arms with cascading crystal drops and prisms, sparkling | U268, U388 | Blender mesh + Shader + Particles | Grand Ballroom (several down the hall), Great Hall |
| **Coffered ceiling with rosettes** | Square coffers with moulded frames and gilded rosettes; octagon-and-square variant; dome soffit coffers | U81, U264, U266, U332 | Blender mesh + Normal map | Great Hall, Twin-stair hall, entrance hall |
| **Carved wooden coffer ceiling** | Fine grid of small carved wooden panels | U284 | Normal map | Portico ceilings, Grand Balcony pavilion |
| **Fresco ceiling panels in gilt frames** | Painted sky panels in gold frames | U267 | Decal + Blender mesh | Mirror gallery, Party salon |
| **Painted arabesque vault** | Lilac floral arabesques on a cream vault | U346 | Decal + Normal map | Pavilion ceilings, Moon Palace |
| **Rib vault module** | Gothic quadripartite rib vault bay | U159 | Blender mesh | Library, ballroom anterooms |
| **Gored ribbed ceiling dome** | Interior dome split into gores by ribs | U271 | Blender mesh + Normal map | Throne rotunda, pavilions |
| **Glass-ribbed dome ceiling** | Glass dome seen from inside with radial ribs | U394 | Blender mesh + Shader | Stargazer Observatory, Crystal water hall |
| **Suspended gilded hoops** | Gold rings hung from a ceiling at different heights | U249 | Blender mesh + Shader | Grand Ballroom ceiling |
| **Crystal prism drum chandelier** | Tiered drum of hanging prisms | U162 | Blender mesh + Shader | Party salon, ballroom side salons |
| **Ring candle chandeliers** | Gold or iron ring hung on chains carrying candles; brass candle chandelier | U159, U161, U334 | Blender mesh + Shader | Great Hall, Library, corridors |
| **Spherical cage chandelier** | Ornate spherical cage lantern hung on a chain | U332 | Blender mesh + Shader | Great Hall, Twin-stair hall |
| **Pendant ring and ball lamps** | Tiered ring pendant, ribbed ball pendant, long-chain bronze lamp | U81, U264, U394 | Blender mesh + Shader | Corridors, halls, walkway arches |

## 15. Lanterns, lamps & light props

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Floating faceted balloon lanterns** | Faceted pink lanterns shaped like small hot-air balloons, emissive gradient, slow bob | U354 | Blender mesh + Shader | Sky over the Long Bridge and Lantern Cove, midnight release |
| ★ **Twin-lantern cast-iron lamp post** | Cast-iron post with fluted, panelled octagonal base with ogee moulding and a fleur plaque, two lanterns on scroll arms | U343 | Blender mesh + Shader | The straight avenue, circular walkways, Long Bridge |
| **Hot-air balloon lanterns** | Glowing balloon-shaped lanterns with baskets, some striped, drifting | U106, U107, U142, U190, U207 | Blender mesh + Shader | Night sky above the castle and Storybook Valley |
| **Parasol flyer lanterns** | Drifting umbrella-shaped lights | U118 | Blender mesh + Shader | Sky over Lagoon City |
| **Floating paper box lantern** | Square washi lantern on a dark base, bobbing, instanced; small water float lantern variant | U07, U50 | Instanced prop + Shader | Reflecting-pool forecourt, Long Lake on birthday night |
| **Floating candles** | Small candle floats or paper boats with a flame, pooling light on water | U86, U258, U259 | Instanced prop + Shader | Reflecting-pool forecourt, Long Lake, Crystal water hall |
| **Paper globe lanterns on wires** | Round paper lanterns strung on wires, gentle bob | U103, U218, U317, U318, U319 | Blender mesh + Shader | Festive streets and courtyards |
| **Cast-iron candelabra lamp post** | One- and three-head candelabra post with lantern glass | U152 | Blender mesh + Shader | Walkways, Long Bridge, Lagoon City canals |
| **Acanthus globe candelabra** | Cast-iron candelabra with acanthus scroll arms and opal glass globes | U155 | Blender mesh + Shader | Forecourt, ballroom terrace |
| **Multi-lantern carriage lamp post** | Post carrying three to five carriage lanterns; four-arm version with banners | U247, U346, U385 | Blender mesh + Shader | Red-carpet side avenue, garden walks, Storybook streets |
| **Twin-head and double-globe lamp posts** | Two globes or two lanterns on a T or curved arms, green iron version | U158, U173, U254, U305, U340 | Blender mesh + Shader | Plazas, garden promenades, bridges |
| **Globe-top lamp post** | Single opal globe on a slim post, used in rows | U102, U216, U217, U310 | Blender mesh + Shader | Long Bridge approach, forecourt, walkways |
| **Victorian lantern posts** | Cast-iron posts with hexagonal, square or cage lantern heads, scroll-arm verdigris version | U77, U230, U312, U313, U327, U342 | Blender mesh + Shader | Storybook streets, bridges, garden paths |
| **Swan-neck lamp post** | Post that curves over like a swan neck to hang a lantern | U251, U320 | Blender mesh + Shader | Canal edges, walkways |
| **Hooded double-arm lantern post** | Post with two hooded lanterns | U42 | Blender mesh + Shader | Walkways, bridge approaches |
| **Slender obelisk lamp** | Thin white obelisk with a glowing top | U219 | Blender mesh + Shader | Plaza, Long Bridge approach |
| **Striped drum lantern post** | Post with a striped drum-shaped lantern | U178 | Blender mesh + Shader | Stair flanks |
| **Pier-top acorn lantern** | Acorn-shaped glass lantern on a square plinth on top of a pier | U352 | Blender mesh + Shader | Stair and walkway piers, grand staircase |
| **Stone bollard lantern** | Short stone bollard or urn with a glowing top | U397 | Blender mesh + Shader | Plaza walkways along the avenue |
| **Mushroom-cap bollard lamp** | Stone or metal bollard with a mushroom cap that glows underneath | U29, U333 | Instanced prop + Shader | Garden paths, curved railings on walkways, Giant-Tree Way |
| **Japanese stone lanterns** | Toro, kasuga with moss, curled-cap and glowing-cap stone lanterns with fireboxes | U09, U62, U63, U287 | Blender mesh + Shader | Lantern River Valley paths and bridge ends |
| **Wooden post lanterns** | Box lantern on slim pole, lattice window post lantern, shepherd's hook, paper box on pole | U53, U60, U68, U148 | Blender mesh + Shader | Glowwood trails, Lantern River paths |
| **Glowing cube and orb post lanterns** | Teal cube or orange orb on a post; stacked lantern pagoda post | U106, U306, U365 | Blender mesh + Shader | Paths, stairs, Glowwood |
| **Scroll-bracket wall lantern** | Lantern hung from an iron scroll or swan-neck bracket on a wall | U149, U176, U190, U214, U234, U272, U335, U349 | Blender mesh + Shader | Castle walls, gatehouse, Storybook lanes |
| **Hanging iron lantern on bracket arm with chain** | Iron lantern on a bracket arm hung by chain; crane-jib version over water | U210, U236 | Blender mesh + Shader | Walkways, bridges, towers over the Long Lake |
| **Ornate cast-iron cage lantern** | Cage lantern with double-scroll top | U236 | Blender mesh + Shader | Walkways, Glowwood paths |
| **Wall sconce in arch reveal** | Small lantern set in the side of an arch passage | U184 | Blender mesh + Shader | Gatehouse passage, Great Gate reveal |
| **Candle sconces** | Two-arm girandole and scroll-arm candle sconces with flicker | U262, U269 | Blender mesh + Shader | Mirror gallery, ballroom walls, corridors |
| **Frosted bracket sconces** | Trapezoid frosted glass box sconce, globe sconce, stepped brass sconce | U331, U388, U394 | Blender mesh + Shader | Great Hall corridors, piers |
| **Pierced metal pendant lanterns** | Pierced globe or faceted bronze lanterns casting patterned light; rows of them in arcades | U180, U258, U260, U263 | Blender mesh + Shader | Arcades, cloister walk, Moon Palace |
| **Pierced brass domed floor lantern** | Floor lantern with a pierced brass dome, shadow cookie | U292 | Blender mesh + Shader | Courtyards, ballroom terraces |
| **Hexagonal bronze ground lantern** | Low hexagonal bronze lantern | U379 | Blender mesh + Shader | Wall bases of the gatehouse, garden beds |
| **Tasselled hanging lanterns** | Lanterns on long chains with cloth tassels | U108, U286 | Blender mesh | Pavilion ceilings, Glowwood branches |
| **Octahedral glass lantern cluster** | Cluster of octahedral glass lanterns under a fabric swag | U196 | Blender mesh + Shader | Walkway shops, Glowwood stalls |
| **Paper lanterns** | Cylindrical chochin with ribs, square paper lanterns, lantern strings | U09, U135, U289, U316 | Blender mesh + Shader | Lantern River Valley, Tea nook, festival streets |
| **Hurricane candle lantern** | Candle under a glass chimney | U341 | Blender mesh + Shader | Café tables, balconies |
| **Candle clusters** | Groups of pillar candles with flicker | U101, U352 | Instanced prop + Shader | Ballroom tables, window ledges, Glowwood paths |
| **Candle shrine niche** | Gabled or pointed niche with a candle | U192, U245 | Blender mesh + Shader | Walkway walls, shrines |
| **Braziers** | Tripod brazier with curved legs, iron basket on post, iron cage, bronze on plinth, crown torchère, brazier in arch | U81, U132, U220, U232, U262, U399 | Blender mesh + Particles | Temple Hill, Long Bridge approaches, gate posts, balconies |
| **Torchère candelabrum** | Tall standing candelabrum | U259 | Blender mesh + Particles | Arcades, ballroom |
| **Fires** | Bonfire in stone ring, tripod campfire, campfire, post torch | U60, U74, U75, U143 | Blender mesh + Particles | Glowwood camps, Frost Fjord |
| **Stone pillar with flame finial** | Pillar topped by an amber flame | U87, U359 | Blender mesh + Shader | Path markers, Temple Hill |
| **Festoon bulb strings** | Bulbs on a catenary, teardrop variant | U60, U168, U338, U352 | Instanced prop + Shader | Courtyard canopies, Grand Balcony, porches |
| **Fairy-light strings** | Tiny emissive spheres along roof hips, eaves and rails | U180, U316 | Instanced prop + Shader | Castle roof edges, gazebos, walkway rails |
| **Marquee bulb row** | Row of round bulbs under an eave | U322 | Instanced prop + Shader | Gate arches, walkways |
| **Lantern garland strings** | Wire-hung lantern strings, rhombus red glass garland, shore lantern string, overhead wire web | U211, U274, U281, U336, U402 | Instanced prop + Shader | Between towers, Lagoon City streets, lake banks |
| **Organic glowing lanterns** | Golden fruit-pod with berry crown, rib-cage amber lantern, sapling with bauble, bulb-lamp plants, spiral shell ground lantern | U29, U41, U70, U72, U317 | Blender mesh + Shader | Glowwood vines and paths |
| **Rope-ball lanterns on pergola** | Rope-wrapped post with hanging rope-ball lanterns | U214 | Blender mesh + Shader | Garden pergola, docks |
| **Beacon pillars** | Jade tiered pillar with glowing core, blue orb shrine pillar, ringed totem tower | U22, U42, U326 | Blender mesh + Shader | Walkway waypoints, Glowwood |
| **Brass claw crystal beacon** | Brass claw legs holding a glowing crystal core with a beam | U70 | Blender mesh + Shader | Tower-top beacon |
| **Beacon column with winged top** | Column topped by wings (no figure) and a light beam; floating light-sword beacon | U150, U151 | Blender mesh + Shader | Centre of the forecourt |
| **Central fire beacon with light ribbons** | Flame on a pedestal with orbiting light ribbons, coiled stone ring with gold veins | U135 | Blender mesh + Particles | Birthday plaza centrepiece |
| **Glowing Morris column** | Round poster column with glowing panels and domed top | U190, U309 | Blender mesh + Shader | Storybook town square notices, plaza |
| **Uplight and facade wash** | Spots from below graze carved stone; coloured facade washes; pier slots | U187, U259, U310, U331, U378 | Shader | Castle facade, Great Hall piers, tower bases |
| **Interior lighting recipe** | Warm light near, cool far, for night interiors | U269 | Shader | All interiors |

## 16. Fountains & water features

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Armillary sphere fountain** | Gold rings with teal enamel inlay channels, arrow tips and fin spikes orbiting a glowing water sphere, on a gold chalice pedestal with teal crystals, above a stepped gold-framed ziggurat plinth with incised spiral glyphs; small jets in a round stepped pool | U380 | Blender mesh + Shader + Particles | Forecourt plaza centre at the top of the avenue |
| ★ **Cylindrical water-curtain fountain** | Round water sheet falling all round a column topped by a veiled figure, into a big round basin with a frieze of square rosette panels, heavy rounded coping and moulded plinth, radial flag apron | U344 | Blender mesh + Shader + Particles | Storybook market square, plaza on the circular walkway |
| ★ **Central cascade fountain stair** | Tiered round basins cascading down the middle of a grand stair | U396 | Blender mesh + Shader | Chadar water channel down the grand staircase, jets at every 15 m landing |
| **Tiered verdigris fountain** | Tiered bowls on an acanthus base with a crown finial, green patina; gadrooned lobed rims | U339 | Blender mesh + Shader | Central castle courtyard |
| **Three-tier scalloped fountain** | Three tiers with cusped stalactite rims dripping from each scallop, octagonal base, ball-and-onion finial with diamond surface | U284, U346 | Blender mesh + Particles | Grand Balcony garden court, Moon Palace |
| **Two-tier pedestal fountain** | Round basin with a central pedestal and two bowls | U103, U104, U235 | Blender mesh + Shader | Plazas, village squares |
| **Volute two-tier fountain ringed with candles** | Two-tier fountain with volute carving and candles round the rim | U357 | Blender mesh + Shader | Storybook market square |
| **Tiered spout fountain** | Tiered fountain whose spouts are urns, not faces | U157 | Blender mesh + Shader | Town square below the castle |
| **Lobed lotus fountain** | Lotus-shaped lobed basin with a central jet | U283 | Blender mesh + Shader | Cloister courtyard centre |
| **Glowing bell dome fountain** | Water sheeting over a glowing bell-shaped dome in a round basin, sparkles | U89 | Blender mesh + Shader + Particles | Garden pavilion, Glowwood spring |
| **Knotwork-rim crystal fountain** | Basin with a knotwork rim, teardrop bollards, glowing crystal in the water, violet rim glow | U11 | Blender mesh + Shader | Courtyard centrepiece, walkway plazas |
| **Ice-crystal fountain sculpture** | Frozen cascade of translucent blue crystal shapes | U355 | Blender mesh + Shader | Palace forecourt, flanking the Great Gate steps |
| **Rooftop tiered fountain** | Tiered fountain on a roof terrace | U393 | Blender mesh + Shader | Grand Balcony rooftop fountain court |
| **Concentric ring fountain** | Fountain made of concentric ring basins | U360 | Blender mesh + Shader | Forecourt, Baroque gardens |
| **Jet fountain basin** | Round basin with vertical water jets | U381 | Blender mesh + Particles | Forecourt |
| **Scalloped shell basin** | Shell-shaped basin | U292 | Blender mesh | Pool fountains |
| **Wall fountains** | Arched wall fountain with urn spout and foam pool; wall niche fountain | U177, U345 | Blender mesh + Shader | Courtyard walls, lanes |
| **Well-heads** | Octagonal carved well-head; brick wellhouse arch with pantile cap | U189, U392 | Blender mesh | Courtyard wishing well, village square |
| **Floating bronze basin** | Bronze bowl hovering above the floor | U111 | Blender mesh | Fountain on the walkway |
| **Reflecting pool with lily pads** | Still pool with rounded coping and pads, lotus with emissive petals | U78, U122, U199, U204, U292, U307, U353 | Blender mesh + Shader | Reflecting-pool forecourt, castle gardens, Moon Palace |
| **Lobed pool coping** | Pool kerb with semicircular lobed bays | U258 | Blender mesh | Garden pools |
| **Sparkling reflecting pool** | Planar reflection with glints | U397 | Shader | Gardens |
| **Terrace cascade waterfall** | Water stepping down terraces into pools | U66, U147, U235, U285 | Blender mesh + Shader + Particles | Castle lower terraces, hanging gardens |
| **Stair cascade rill** | Glowing water running down steps | U200 | Blender mesh + Shader | Glowwood shrine steps |
| **Indoor arch waterfall** | Water falling inside an arched niche | U334 | Shader + Particles | Grand Ballroom side niches |
| **Facade waterfall spill** | Water spilling off a facade terrace | U397 | Shader + Particles | Castle terraces into the lake |
| **Waterfall curtain colonnade** | Columns with water sheets between them | U87 | Shader + Particles | Crystal water hall, grotto |
| **Ribbon waterfall** | Scrolling alpha strip falling off a cliff with mist at the base | U04, U67, U90, U137, U237, U244, U362, U375 | Shader + Particles | Castle Crag cliffs, sky islands |
| **Waterfall foam and mist** | Foam at the plunge and rising mist | U51, U58, U95, U97, U185 | Particles + Shader | Cliff bases |
| **Swirl ripple rings** | Animated rings on the plunge pool | U68 | Decal + Shader | Waterfall pools |
| **Terraced rimstone pools** | Stacked natural basins | U94 | Blender mesh + Shader | Glowwood springs, jungle ruins |
| **Water palace ghat terrace** | Steps down to water with a balustrade | U279 | Blender mesh | Moon Palace, Long Lake edge |
| **Sluice dam with arches** | Stone dam with arched spillways | U96 | Blender mesh | Castle Crag waterfall edge |
| **Waterwheel mill** | Wheel turning in a stream | U44 | Blender mesh | Storybook mill |
| **Mirror lake water** | Planar reflection with ripples and vertical stretch of lights | U25, U34, U99, U369, U402 | Shader | Long Lake under the bridge |
| **Lantern reflection streaks** | Additive streaks of lantern light on water | U50 | Shader + Decal | Long Lake and reflecting pool |
| **Turquoise depth water** | Depth colour ramp from pale to deep turquoise with foam rim | U01, U42, U64, U67, U147, U376 | Shader | Shallows, pools, lake shore |
| **Bioluminescent water** | Emissive cyan water with fresnel | U120, U241, U377 | Shader | Glowwood springs and pools |
| **Flowing magic channel** | Scrolling emissive stream | U36 | Shader | Magic stream near the castle |
| **Stream rapids and foam** | Flow-map water with foam | U61 | Shader | Glowwood streams |
| **Shore foam** | Breaking wave and surf foam ring | U121, U148 | Shader | Island shores |
| **Baluster shadow-stripe water** | Reflection with stripes from a railing | U272 | Shader | Canals in Lagoon City |
| **Frozen water** | Cracked ice and ice floes | U125, U126, U231 | Shader + Blender mesh | Frost Fjord |
| **Canal grid with causeways** | Water grid with causeways | U398 | Blender mesh + Shader | Lagoon City backdrop |

## 17. Gardens, plants & trees

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| **Giant arching tree** | Tree trunk that arches over a path; colossal world-tree arch | U76, U168 | Blender mesh | Giant-Tree Way canopy tunnel |
| **Root-drapery arch tree** | Giant tree whose roots drape into an arch | U29, U73, U85, U108, U241 | Blender mesh + Normal map | Glowwood main entrance |
| **Root-embraced island tree** | Giant tree with roots spilling over rock into water | U237 | Blender mesh | Mother Tree |
| **Carved tree-temple trunk** | Huge trunk with arched windows cut into the bark | U241 | Blender mesh + Normal map | Glowwood heart tree |
| **Twisted ancient trunk** | Twisted-strand trunk with root flare, helix tree variants, gnarled root throne | U38, U40, U47, U382 | Blender mesh + Normal map | Glowwood elder trees, courtyard heart tree |
| **Moss-draped buttress tree** | Giant tree with buttress roots and moss | U99 | Blender mesh + Shader | Glowwood |
| **Giant oak** | Sprawling ancient oak | U69 | Blender mesh | Glowwood landmark |
| **Blossom canopy tree** | Pink or white blossom puff canopy, twisted trunk, sparkle or petal variants | U01, U03, U53, U64, U129, U130, U199, U321, U348, U384 | Blender mesh + Alpha cutout | Glowwood, courtyard gardens, Baroque gardens |
| **Pink blossom avenue tree** | Columnar pink blossom tree planted in rows | U18, U43, U80 | Instanced prop | Tree-lined straight avenue, lakeshore |
| **Weeping crimson tree** | Drooping crimson fronds that sway | U101 | Blender mesh + Alpha cutout | Glowwood, ballroom garden atrium |
| **Glowing canopy trees** | Gold, crimson, magenta, violet, orange-pink canopies that glow at night; a golden glow tree doubles as a beacon seen from far | U20, U28, U55, U66, U67, U139, U144, U174, U228, U287, U374 | Blender mesh + Shader | Glowwood accents, horizon landmark |
| **Swirl-canopy tree with hidden lanterns** | Swirled canopy with lanterns inside | U288 | Blender mesh + Shader | Glowwood |
| **Umbrella and fringed canopy trees** | Flat umbrella crown, fringed purple tassel canopy, gnarled umbrella tree | U70, U92, U359 | Blender mesh + Alpha cutout | Hilltops, Glowwood |
| **Autumn maples and red trees** | Orange or red maple with leaf fall | U04, U27, U49, U61, U188, U296, U373 | Blender mesh + Alpha cutout + Particles | Lantern River Valley, autumn grove |
| **Birch and pale-bark trees** | White birch with lenticel bark; tall pale trees | U73, U202 | Blender mesh + Normal map | Glowwood silver grove |
| **Crimson leaf cards** | Translucent crimson leaf cards | U17, U73 | Alpha cutout + Shader | Autumn grove |
| **Painterly multicolour trees** | Trees in gold, teal and violet clumps; layered disc canopies | U90, U94 | Blender mesh | Glowwood variety |
| **Pines and conifers** | Cliff pine, windswept pine, tiered drooping pine, pine colonnade, flame conifer, cypress | U45, U56, U102, U124, U186 | Blender mesh + Alpha cutout | Rock spurs, forest edge |
| **Niwaki and bonsai** | Cloud-pruned pine pads, twisted bonsai, crimson bonsai, framed bonsai, bonsai canopy pads | U59, U100, U111, U119, U305, U365, U387 | Blender mesh | Courtyard gardens, Lantern River Valley |
| **Topiary** | Spiral, cone, columnar cypress and standard rose topiary in planters | U133, U154, U247, U312, U395 | Blender mesh | Formal gardens, terrace edges, door flanks |
| **Parterre hedge beds** | Low clipped hedges in patterns and ring parterres | U173, U351 | Blender mesh | Baroque terraced gardens |
| **Other trees** | Baobab, twisted arching tree, serpentine glowing tree, bare gnarled tree, golden glow tree, red-blossom tree | U19, U26, U115, U212 | Blender mesh | Glowwood edge |
| **Ivy and moss curtains** | Green ivy climbers and hanging curtains of ivy, moss and vine strands with wind sway | U02, U39, U64, U71, U85, U89, U99, U132, U146, U193, U209, U223, U225, U236, U291, U328, U337, U377 | Alpha cutout | Castle walls, arches, ruins, bridge undersides |
| **Flowering climbers** | Crimson creeper, purple and yellow flowering vines, climbing roses and magenta bougainvillea draped over arches and walls | U72, U78, U97, U110, U133, U283 | Alpha cutout | Cloister arcades, castle courtyard walls, ruins |
| **Vine-wrapped arches and poles** | Sweeping arch or pole wrapped in ivy cards | U36, U167, U345 | Blender mesh + Alpha cutout | Glowwood skyway arches, gateways |
| **Scale-textured serpentine vine** | Thick curving vine with a scale normal map, like a cable | U191 | Blender mesh + Normal map | Overgrown ruins as magic vines |
| **Tree light ribbons and halo rings** | Gold glowing spiral tube wound round a trunk, or a floating emissive ring that bobs round it | U130, U182 | Blender mesh + Shader | Courtyard birthday tree, Glowwood trees |
| **Flower drifts** | Wildflower meadows, red, pink, magenta, blue, crimson flower carpets, spider lilies | U02, U06, U13, U37, U46, U49, U55, U92, U121, U147, U202, U361 | Instanced prop | Meadows, beds along walkways |
| **Glowing flowers** | Plume flowers with glowing tips, glowing buds, blue umbels, magnolia, crystal flowers | U16, U38, U88, U113, U122, U382 | Instanced prop + Shader | Glowwood borders, garden borders |
| **Single flowers and shrubs** | Sunflower, gentian, blue sprays, hydrangea, azalea mounds, spiral shrub, magenta shrub, lavender | U06, U20, U29, U53, U73, U214, U245, U373, U377 | Instanced prop | Garden beds |
| **Grass fields** | Wind-swept, silver plume, golden backlit and chunky stylised grass | U19, U56, U57, U63, U74, U76, U203 | Instanced prop + Shader | Meadows, slopes below the crag |
| **Ferns and broad leaves** | Fern rosettes, fiddleheads, tropical and monstera leaves | U46, U48, U66, U193, U226, U290 | Alpha cutout | Glowwood understorey |
| **Glowing mushrooms** | Spotted, tiered, peach, stalk, reticulated-vein and ring mushrooms with glowing undersides | U39, U75, U85, U96, U113, U193, U226 | Blender mesh + Shader | Glowwood floor, Giant-Tree Way |
| **Shelf fungus** | Bracket fungus tiers on trunks or cliffs, glowing undersides | U39, U70 | Blender mesh | Glowwood trunks, cliffs |
| **Glowing fantasy plants** | Fan coral, coral tubes, red plume fern, crystal shrub | U85, U119, U121, U353 | Blender mesh + Shader | Glowwood floor, lakeside |
| **Water plants** | Lily pads, white water lily, glowing lily carpet, cattail reeds, giant lily platforms | U08, U25, U34, U96, U259 | Instanced prop | Ponds, Long Lake edges |
| **Bamboo and cactus** | Bamboo clump, pink-blossom cactus | U35, U62 | Instanced prop | Lantern River gardens, greenhouse |
| **Ground cover** | Moss carpet, leaf litter, maple scatter, glowing flecks | U17, U45, U61, U168 | Shader + Decal | Forest floor |
| **Planters** | Raised stone, long curved, round with tree, column-top, gadrooned bowl, tall terracotta, hanging and trailing-vine planters, flower tubs and window boxes | U152, U165, U166, U182, U207, U209, U282, U285, U299, U324, U337, U389, U399, U401 | Blender mesh | Walkways, terraces, plazas |
| **Urns** | Knotwork urn, gadrooned urn on pedestal, white pedestal urn, celadon urn, urn finial, urn with blue blooms | U72, U261, U343, U351, U382, U393 | Blender mesh | Balustrade posts, terrace corners, Glowwood shrine |
| **Flower cascades and pot clusters** | Overflowing flower cascades, terracotta pot clusters | U285, U335 | Blender mesh + Alpha cutout | Planters, balconies, terraces |
| **Pergolas and planted walls** | Grapevine pergola with lanterns, Voronoi planted wall, flower-garland arcade overhang, rope-wrapped pergola | U337, U350, U357 | Blender mesh + Alpha cutout | Garden terraces, Grand Balcony |
| **Potted blossom tree** | Small blossom tree in a pot with petal fall | U289 | Blender mesh + Particles | Tea nook, interiors |
| **Flower urn arrangements** | Pink rose and hydrangea arrangements in urns | U268 | Blender mesh | Ballroom galleries, tables |

## 18. Furniture & sitouts

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| **Pierced scroll-back curved bench** | Curved stone bench whose back is pierced with scrolls | U128 | Blender mesh | Sitouts on the circular walkways, Grand Balcony |
| **Wrought-iron scroll bench** | Iron scroll ends with wooden slats; scroll-end park bench | U154, U155, U351 | Blender mesh | Walkways, gardens |
| **Trellis-back garden bench with red cushion** | Bench with a gold geometric trellis back, scalloped crest rail and red cushion | U284 | Blender mesh | Grand Balcony garden, walkway sitouts |
| **Stone benches** | Post-and-lintel stone bench, spiral-carved bench | U14, U85 | Blender mesh | Garden seating, Glowwood |
| **Café table sets** | Marble table on cast-iron pedestal with bentwood chairs; lace cast-iron bistro set; parasol table set | U230, U262, U313, U349 | Blender mesh | Sitouts every 14 m on the circular walkways, terrace café |
| **Parasols** | Rainbow-striped or scalloped teal parasols | U365, U389 | Blender mesh | Party stalls, café sitouts on the walkways |
| **Wicker and rattan seats** | Wicker drum stool and rattan chairs | U350 | Blender mesh + Normal map | Terrace furniture |
| **Gilded throne with sunburst back** | Gold throne with a sunburst back and embroidered seat | U271 | Blender mesh + Normal map | Throne and birthday rotunda |
| **Throne dais with balustrade ring** | Raised round dais ringed by a balustrade | U265 | Blender mesh | Throne rotunda |
| **Curtains and drapes** | Heavy velvet curtain with valance, sheer swag, red velvet in arch, tied-back drape | U71, U257, U266, U385 | Blender mesh + Shader | Ballroom windows and alcoves, bedrooms |
| **Fabric swags and garlands** | Swagged fabric between columns or towers, around columns, scalloped swags | U131, U196, U269, U292, U342, U356 | Blender mesh | Ballroom portico, festival decoration |
| **Gilt mirrors** | Oval portal mirror with scroll cartouche crest on a dais; sunburst spiked mirror | U81, U262 | Blender mesh + Shader | Colonnade mirror hall, Party salon |
| **Library bookcases** | Gothic bookcase with ladder, gabled carved bookcase with quatrefoil cut-out, arched niche bookcase | U159, U163, U198, U248 | Blender mesh | Library, studies |
| **Gothic lectern with glowing book** | Open-tracery pinnacled lectern holding a glowing book | U77 | Blender mesh + Shader | Library, ballroom reveal |
| **Study lamps** | Tulip-shade gooseneck lamp, tripod floor lamp with drum shade | U164, U248 | Blender mesh + Shader | Library desks, tower reading nook |
| **Clocks** | Gear-bezel wall clock, octagonal-framed clock face, post-mounted street clock, kiosk with four-faced brass globe clock | U163, U233, U331, U343 | Blender mesh | Clock tower, ballroom midnight clock, plaza, Great Hall |
| **Brass ring console table** | Round console table on brass rings | U250 | Blender mesh | Map room in the observatory |
| **Gilt-edged marble plinth** | Marble plinth with gold trim | U334 | Blender mesh | Ballroom planters, altar |
| **Wainscot and chimney breast** | Gilt diamond lattice wainscot, rubble chimney breast | U164 | Normal map | Party salon, tower rooms |

## 19. Pavilions, kiosks & small buildings

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Art Nouveau leaf-pod pavilion** | Leaf or seed-pod building whose curved copper-toned timber frame sweeps up to a pointed tip with a rosebud finial, gold scale shingles, flowing teardrop stained-glass panes in teal, amber and coral, petal-shaped door canopy | U353 | Blender mesh + Shader | Glowwood glade house, castle gardens |
| **Domed rotunda gazebo** | Open round pavilion of columns under a dome (blue, copper, gold colonnade variants) | U44, U255, U360, U379, U390 | Blender mesh | Baroque gardens, plaza bandstand |
| **Octagonal domed pavilion** | Octagonal pavilion with turned columns and dome; red ogee roof gazebo | U276, U339 | Blender mesh | Garden centrepiece, garden terraces |
| **Copper dome pavilion with parapet urns** | Square pavilion with a copper dome and urns on the parapet | U274 | Blender mesh + Shader | Garden pavilion |
| **Glass-canopy gazebo kiosk** | Blue glass canopy on gilded arches | U273 | Blender mesh + Shader | Gardens, plaza |
| **Teal glass dome kiosk** | Ribbed teal glass dome with glow inside | U389 | Blender mesh + Shader | Walkway shops |
| **Glowing glazed water gazebo** | Pavilion of glowing glass panels on water | U280 | Blender mesh + Shader | Long Lake pavilion |
| **Chhatri kiosk** | Small domed kiosk on pillars; ribbed-dome water pavilion | U278, U279 | Blender mesh | Wall corners, roof edges, Moon Palace |
| **Open four-pillar pavilion** | Four pillars and a heavy cornice over a spring; pillared pavilion with carved brackets | U80, U89 | Blender mesh | Garden folly, gatehouse |
| **Domed marble forest shrine** | Small marble shrine with pointed door and copper dome; orb-topped shrine | U88, U94 | Blender mesh + Shader | Glowwood shrines |
| **Columned temple shrine** | Small columned or pedimented temple with glowing door | U358, U359 | Blender mesh + Shader | Glowwood ruins, Temple Hill |
| **Ruined tholos with arabesque capitals** | Ring of columns with arabesque capitals, gold decal | U384 | Blender mesh + Normal map | Glowwood ruins, garden folly |
| **Exedra nymphaeum** | Curved wall with a central statue niche (veiled) | U261 | Blender mesh | Baroque garden terminus |
| **Crescent colonnade wing** | Curved column array enclosing a court | U381 | Blender mesh | Enclosing the forecourt plaza |
| **Ridge colonnade stoa** | Long column row with entablature | U144 | Blender mesh | Temple Hill, terrace along a walkway |
| **Colonnade arcades and loggias** | Round-arched loggia on Tuscan, Corinthian or paired columns; groin-vault arcade with chain lanterns; nave arcade; blue-soffit pointed arcade | U133, U252, U256, U270, U347, U352, U355 | Blender mesh | Cloister walk, courtyard loggias, circular walkway arcades |
| **Pale stone rib arcade tunnel** | Tunnel of close-set pale stone ribs (replaces a bone tunnel) | U74 | Blender mesh | Garden pergola walk |
| **Ruined arcades** | Ruined round or pointed arcades and aqueduct arches with broken edges, pilasters between bays | U05, U123, U145, U221 | Blender mesh | Ruin Meadows, Glowwood, valley backdrop |
| **Concave Baroque facade module** | Curved inward Baroque front | U256 | Blender mesh | Ballroom entrance |
| **Curved balustraded balcony over arcade** | Rounded balcony on top of an arcade | U254 | Blender mesh | Castle corner pavilion |
| **Iron and glass marquee canopy** | Glass canopy on curved iron brackets with a lattice frieze | U310, U340 | Blender mesh + Alpha cutout | Ballroom entrance, Long Bridge cover |
| **Giant golden lotus canopy on mast** | Ribbed scalloped umbrella on a mast with lattice and glowing underside | U308 | Blender mesh + Normal map | Festival plaza centrepiece |
| **Layered glowing fin canopy** | Stacked fins with glowing edges | U306 | Blender mesh + Shader | Gate pavilions |
| **Hilltop pavilions** | Pavilion with stair, saucer tree platform, upturned-eave shrine | U08, U61 | Blender mesh | Garden folly, Pillar Reach |
| **Pagoda** | Multi-tier pagoda with bracket sets and ring spire | U53 | Blender mesh | Lantern River Valley |
| **Shrine boxes** | Stilted mini-shrine, dark box with glowing slits, spirit shrine box | U68, U290 | Blender mesh + Shader | Glowwood waysides |
| **Mushroom-cap tower house** | Stone trunk with a violet mushroom cap roof and glowing gills | U107 | Blender mesh + Shader | Glowwood landmark, islet tower |
| **Spiral shell house** | Sculpted spiral shell with nacre shader | U239 | Blender mesh + Shader | Glowwood fairy dwellings |
| **Wraparound balconies** | Wooden balcony ring round a tower, ring balcony round a trunk | U107, U365 | Blender mesh | Tower exteriors, Mother Tree |
| **Stepped fountain plinth and pedestals** | Round offering plinth, monument pedestal with relief plaque, verdigris statue plinth | U155, U327, U364 | Blender mesh + Normal map | Garden terraces, courtyard centre |

## 20. Town & village building kits

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Wrought-iron scroll sign bracket** | C-scrolls, spiral volutes and an arrow-tipped arm carrying a hanging plaque | U234, U338, U343 | Blender mesh | Shops along the straight avenue, Storybook lanes |
| **Half-timber and jettied storey kit** | Stone ground floor with jettied timber upper storeys, brackets and window cassettes | U17, U95, U140, U149, U194, U206, U212, U230, U344, U371 | Blender mesh | Storybook Valley, castle village |
| **Glowwood cottages and huts** | Mossy plank hut, log lean-to, thatched hut, lit stalls with roof garden | U41, U75, U106, U354 | Blender mesh | Glowwood |
| **Gable shopfronts** | Narrow lancet gable house, small gable shopfront with lanterns, Beaux-Arts shopfront | U103, U321, U389 | Blender mesh | Storybook streets, birthday fair street |
| **Board-and-batten wall** | Planks with X bracing | U102, U315 | Blender mesh | Stables, boathouse |
| **Windmill tower house** | Tower house with lattice sails that rotate | U04, U207 | Blender mesh | Storybook hills |
| **Barrel buildings** | Giant barrel tavern | U208, U348 | Blender mesh | Storybook fun zone |
| **Balconies on houses** | Timber stilt balcony with iron rail, baluster balcony with flower box | U293 | Blender mesh | Storybook and Lagoon City houses |
| **Terraced roof-garden block** | White stepped block with roof garden | U400 | Blender mesh | Lagoon City |
| **Cliff-cut facades** | Dwellings carved into cliffs, paired lancet cliff facade, rock-cut facade with twisted columns | U238, U363 | Blender mesh + Normal map | Red Canyon, cliffs under the castle |
| **Chimneys** | Funnel chimney, witch-hat cowl with smoke | U189, U210 | Blender mesh + Particles | Rooftops |
| **Market stalls and awnings** | Striped scalloped awnings, stalls, canopy tents, silk shade sails | U13, U103, U173, U179, U189, U195, U206, U211, U235, U278, U296, U314, U341, U349, U385, U392 | Blender mesh | Birthday fair, Red Canyon bazaar |
| **Shop signs** | Hanging carved signs, glowing glyph sign, porch sign, plaques, notice board, A-frame board | U11, U194, U213, U217, U223, U229, U313, U328, U343 | Blender mesh + Decal | Storybook lanes, walkway shops |
| **Signposts** | Crossroads signpost with glyph arrows and gem finial, multi-arrow signpost | U201, U345 | Blender mesh + Decal | Path junctions |

## 21. Terrain & rock kits

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| **Terraced rock ledge kit** | Stepped cliff with rounded grass caps over vertical rock; stacked slab and slate ledges | U01, U68, U69, U90, U174 | Blender mesh | Castle Crag terraces, Glowwood slopes |
| **Columnar basalt** | Vertical fluted rock columns and cliff blocks | U01, U47, U244 | Blender mesh + Normal map | Mountain rim, island edges |
| **Monolith and blade rocks** | Slanted blades, wedges, leaning pillars, obsidian shards | U12, U13, U15, U117 | Blender mesh | Mountain rim skyline, sky island edges |
| **Mossy boulder sets** | Rounded or faceted boulders with moss tops, granite fields, borders | U04, U35, U46, U76, U146, U203, U228, U230, U358 | Blender mesh + Shader | Glowwood, approach paths |
| **Limestone tor** | White rounded rock cluster | U55 | Blender mesh | Hilltop above the Glowwood |
| **Natural rock arches** | Double arch bridge, giant arch, ring arch (rock moon gate) | U47, U91, U222, U240 | Blender mesh | Ruin Meadows, Red Canyon, Glowwood |
| **Cantilevered ledges and platforms** | Viewing shelf, cantilever platform | U67, U243 | Blender mesh | Cliff overlooks |
| **Cave and grotto shells** | Cave mouth frame, grotto with sky opening | U66, U86 | Blender mesh | Grotto under the castle, Crystal water hall approach |
| **Swirl-strata rock** | Rock faces with swirling strata | U109, U115 | Shader | Red Canyon, Glowwood cliffs |
| **Emissive vein rock** | Rock with glowing cracks (magic blue) | U15 | Shader | Glowwood crystal cliffs |
| **Floating islands** | Inverted rock cones with hanging strata, roots, stalactites and waterfall edges | U21, U137, U185, U199, U243, U362, U363, U375 | Blender mesh | Sky islands |
| **Floating rocks and debris** | Spindle rocks, boulders, shards, orbiting debris, monoliths that bob | U69, U91, U109, U137, U138, U175, U287, U330 | Blender mesh + Shader | Sky above Pillar Reach and the lake |
| **Rock pillars and mesas** | Twin butte spires, sea stacks with waterfalls, tree-capped mesa, mesa waterfall tiers, mossy rock spire, cottage on rock pillar | U90, U116, U121, U240, U330, U372 | Blender mesh | Pillar Reach, Long Lake islets, distant backdrop |
| **Root sculptures** | Giant bleached root, root over wall | U03, U59 | Blender mesh | Glowwood heart |
| **Crystal clusters** | Blade, spike, faceted, amethyst, pink, sapphire and violet crystals, on rock or plinth | U03, U08, U29, U77, U104, U128, U143, U354, U391 | Blender mesh + Shader | Glowwood crystal grove, Lantern Cove, castle crystal garden |
| **Ice crystals and glacial shards** | Translucent ice spikes with glowing cores | U125, U126 | Blender mesh + Shader | Frost Fjord |
| **Glowing crystal obelisk** | Tall crystal shard | U85 | Blender mesh + Shader | Glowwood heart |
| **Ruin kits** | Rubble wall, ruined terrace, breach rubble, broken cornice blocks, frieze plinth, ruined lancet wall, ruin interior | U02, U03, U05, U14, U71, U191, U192, U201, U368 | Blender mesh + Shader | Ruin Meadows, Glowwood ruins |
| **Toppled stele slabs** | Fallen carved slabs | U291 | Blender mesh | Jungle ruins floor |
| **Ruined keep and causeway** | Crenellated ruined keep | U28 | Blender mesh | Outer island ruin |
| **Distant silhouettes** | Citadel, castle and pinnacle silhouettes as far impostors, mountain backdrop | U25, U92, U202, U367 | Blender mesh | Mountain rim |
| **Switchback road** | Spline road climbing a hill | U205 | Decal | Storybook Valley |
| **Patchwork garden-plot grid** | Field grid splat | U52 | Shader | Lowlands |

## 22. Sky, light & particle FX

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| **Night sky dome** | Star field with twinkle, Milky Way, star trails, constellation lines | U51, U129, U155, U187, U311 | Shader | Global night sky |
| **Giant moon** | Large moon disc with halo or lace texture | U08, U43, U100, U308, U372, U402 | Shader | Skybox |
| **Aurora** | Animated ribbon curtains in green and cyan, vortex variant | U127, U145, U146, U220, U231 | Shader | Frost Fjord sky, night sky |
| **Sky vortex and swirl clouds** | Swirled sky dome; domain-warped clouds | U138, U366 | Shader | Sky above the castle |
| **Back-lit clouds and cloud sea** | Silver-lined cloud billboards; cloud and fog sea below; low cloud rings wrapping tall spires | U21, U47, U91, U116, U301, U363 | Shader | Skybox, below Pillar Reach, round the crown towers |
| **Height fog, mist and haze layers** | Exponential height fog, valley mist planes, coloured fog (violet, turquoise, teal), soft interior haze | U12, U29, U30, U32, U48, U86, U101, U114, U123, U140, U144, U205, U212, U215, U270, U281, U304, U330, U373, U374 | Shader | Valleys, Long Lake, Glowwood hollows |
| **God rays and light shafts** | Volumetric cones through canopy, windows and oculi, with dust motes | U33, U37, U45, U56, U73, U84, U98, U120, U140, U246, U257, U265, U302, U316, U334, U357, U394 | Shader + Particles | Glowwood clearings, Grand Ballroom, rotunda |
| **Dappled light cookies** | Leaf shadow patterns on the ground | U46, U88, U192, U200 | Shader + Decal | Forest paths |
| **Stained-glass light projection** | Coloured window pattern projected on the floor | U198, U266 | Shader | Library, Grand Ballroom |
| **Sky light beams** | Vertical beams from spires and monoliths, sweeping searchlights | U28, U47, U109, U118, U124, U231, U301, U303, U324, U375, U398 | Shader | Castle spires at night, celebration |
| **Rainbow and moonbow arcs** | Arc band in the sky | U28, U112, U226, U227, U396 | Shader | Birthday sky event |
| **Sky ribbons and magic trails** | Light ribbons linking towers, spiral magic ribbons, rune ribbons | U65, U136, U300, U308 | Shader | Over the castle |
| **Glowing sigils in the sky** | Knot sigil, meander mandala | U138, U279 | Shader | Above the gate |
| **Fireworks and sparks** | Ember streaks, gold star bursts, comet trails, shooting stars | U05, U12, U116, U143, U155, U286, U372 | Particles | Midnight over the Long Lake |
| **Fireflies, motes and wisps** | Cyan and violet motes, sparkle dust, glitter | U06, U20, U56, U99, U198, U213, U241, U268, U280, U376, U382 | Particles | Glowwood, water at night, ballroom |
| **Petal and leaf fall** | Cherry petals, leaves, red embers, drifting leaves | U18, U50, U52, U58, U108, U192, U204, U243, U289 | Particles | Courtyards, Glowwood |
| **Snow, rain and dust** | Snow, rain streaks, dust drift | U19, U23, U30, U60, U127, U216, U302 | Particles | Weather options, Frost Fjord |
| **Ember motes and smoke** | Floating embers, chimney smoke, magic smoke, smoke ribbons | U36, U72, U95, U109, U142, U194, U287, U371 | Particles | Braziers, rooftops |
| **Magic bursts and beams** | Sparkle trail, hand glow burst, beam and sparkle, lightning | U65, U70, U94, U171, U175, U179 | Particles + Shader | Player magic, gate activation |
| **Levitating block reveal** | Tower that breaks into floating blocks and reassembles (fractured mesh, vertex animation) | U116 | Blender mesh + Shader | Castle reveal at midnight |
| **Floating crescent ring pieces** | Metal crescent fragments that bob slowly in the sky | U308 | Blender mesh + Shader | Sky decoration over the castle |
| **Shrine aura glow** | Soft bloom sprite around a statue or shrine | U24 | Shader | Glowwood shrines |
| **Rising sky lanterns** | Billboards that rise slowly into the sky | U317 | Particles | Midnight release over Lantern Cove and the castle |
| **Energy domes and bubbles** | Iridescent dome shield, bubble dome, iridescent bubbles, hologram shimmer | U77, U115, U155, U326 | Shader | Magic barrier, garden |
| **Flying silhouettes** | Bird flocks (no eyes), distant flyers | U31, U90 | Particles | Sky ambience |
| **Star flare sprite** | Four-point guiding star | U35, U383 | Shader | Night sky |
| **Colour grades** | Dusk violet-peach, purple-orange, lavender, purple bloom, toon bands, lens flare | U11, U16, U26, U57, U279, U298, U303, U367 | Shader | Global art direction |
| **Floating pennants** | Drifting pennant sprites | U365 | Particles | Party sky |

## 23. Creatures, statues & figures

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Veiled column-statue avenue** | Rows of columns each carrying a veiled faceless figure | U139 | Blender mesh | Both sides of the straight avenue to the Great Gate |
| **Veiled winged guardian statue** | Hooded faceless figure with gilt wings and halo crown, on a stepped plinth | U132, U379 | Blender mesh | Great Gate flanks, column tops |
| **Colossal hooded statue** | Building-scale cloaked hooded figure, no face, in a tall niche or on a cliff | U97, U134, U136, U395 | Blender mesh | Castle facade towers, Pillar Reach goddess |
| **Veiled draped statue on plinth** | Faceless veiled figure on a plinth or in a niche, shell hood niche version | U14, U24, U81, U124, U247, U310, U401 | Blender mesh | Hall niches, gardens, ballroom facade |
| **Hooded guardian statues** | Hooded figures with sword, seated guardians, sentinel on plinth (all faceless) | U110, U204, U242 | Blender mesh | Gate flanks, Long Bridge entrances |
| **Veiled atlas column** | Faceless draped figure carrying an entablature | U338 | Blender mesh | Grand entrance porch |
| **Faceless bust with sunburst crown** | Bust with no face crowned by a sunburst, on a console | U269 | Blender mesh | Over doors in the halls |
| **Carved totem topper** | Abstract faceless carved wooden topper | U13 | Blender mesh | Pavilion crown, gate marker |
| **Gold collar band on stone** | Gold trim band masked onto a stone statue or plinth | U204 | Shader | Statue and plinth accents |
| **Glowing koi spirit** | Emissive koi swimming through the air, no eyes | U298 | Blender mesh + Shader | Over the reflecting pool, Glowwood ponds |
| **Koi lantern sculpture** | Giant translucent fish lantern with scale normal, no eyes | U317 | Blender mesh + Shader | Lantern River festival |
| **Butterflies** | Blue butterflies that glow as moth-lights at night | U78 | Particles | Gardens |

## 24. Miscellaneous props

| Name | What it looks like | Sources | Build method | Where it goes |
|---|---|---|---|---|
| ★ **Giant gold armillary monument on ziggurat** | Huge gold rings and spokes on a stepped gilded ziggurat platform | U360 | Blender mesh + Shader | Baroque terraced gardens |
| **Armillary sphere** | Crossed gold or brass rings round a glowing orb, rings rotate slowly | U80, U248, U305 | Blender mesh | Stargazer Observatory, Baroque gardens, plaza |
| **Armillary globe and ring monument** | Sphere with gold orbit rings on an emissive plinth; interlocking rings round a veiled mossy core | U87, U173 | Blender mesh | Astronomy court, Glowwood heart |
| **Glowing ringed orb on stepped pedestal** | Orb with rings on a stepped pedestal, orbiting trails | U333 | Blender mesh + Particles | Orb monument in the lake |
| **Orb on pedestal** | Glowing orb on a tripod or dais altar | U250, U394 | Blender mesh + Shader | Throne, Crystal water hall |
| **Sundial pedestal** | Sundial plate on a carved pedestal | U157 | Blender mesh | Baroque terraced gardens |
| **Crescent-arm censer stand** | Stand with crescent arms holding a smoking censer | U263 | Blender mesh + Particles | Cloister walk, shrines |
| **Crystal ball and cauldron** | Crystal ball on stand, bubbling cauldrons | U160, U236 | Blender mesh + Shader + Particles | Tower attic, Glowwood clearing |
| **Floating crystal over totem** | Crystal bobbing above a carved pedestal | U201 | Blender mesh + Shader | Waypoint shrines |
| **Rune monoliths and obelisks** | Rune obelisk, rune monolith, split twin monolith, carved stele pillar, ring-topped marker post | U27, U79, U98, U105, U177, U229, U231 | Blender mesh + Shader | Frost Fjord, Glowwood stone circle, path markers |
| **Obelisks** | Spiral-fluted obelisk, tapering obelisk | U122, U399 | Blender mesh | Garden focal point, avenue markers |
| **Bollards** | Ring-top stone bollard, iron bollard with chain | U256 | Blender mesh | Courtyard and bridge edges |
| **Long vertical crest banner** | Tall narrow cloth banner with a central emblem (tree or trident sigil reworked as the birthday crest; lyre, crescent or sun medallion variants), gold frame border, vertex wind sway | U93, U131, U170, U223, U295, U329, U334, U387 | Blender mesh + Shader | Great Gate towers, front wall, Great Hall pillars, Temple Hill |
| **Swallowtail and pendant banners** | Banner with a notched swallowtail or chevron-pointed bottom, star or compass emblem, torn variant for ruins | U201, U209, U370, U380 | Blender mesh + Decal | Courtyard towers, gate towers, castle walls |
| **Silk ribbon streamers** | Long thin silk strips that ripple from tower tops, rafters and piers | U07, U10, U255, U364 | Blender mesh + Shader | Crown towers, Grand Ballroom rafters, colonnades |
| **Glowing translucent banner** | Emissive translucent blue cloth on a pole topped by a gold scallop shell | U322, U355 | Blender mesh + Shader | Circular walkways, Great Gate approach |
| **Cut-paper banner strings** | Papel picado sheets with cut castle motifs (no skulls) on strings, light wind | U357 | Alpha cutout + Shader | Festival streets, cloister courtyard |
| **Bunting** | Triangle pennant strings and letter banner | U161, U162, U179, U194, U195, U235, U273, U313, U343, U344 | Instanced prop | Festival streets, castle gate, plaza |
| **Birthday decorations** | Balloon clusters, door wreath, gift boxes, hanging star ornaments, moon garland | U153, U158, U159, U160, U162 | Blender mesh | Gate, Party salon, celebration halls |
| **Tea and banquet props** | Tea service, footed tazza with fruit | U262, U286, U289 | Blender mesh | Birthday party tables, Tea nook |
| **Treasure chest** | Teal chest with gilt trim | U384 | Blender mesh | Interactive prop |
| **Golden lyre sculpture** | Gold lyre on a plinth | U131 | Blender mesh | Music garden, ballroom |
| **Floating island terrarium** | Floating island inside a glass dome | U108 | Blender mesh + Shader | Ballroom centrepiece, tower top |
| **Glowing collectible cube** | Bobbing glowing cube or crystal | U82 | Blender mesh + Shader | Birthday collectible pickups |
| **Glowing scroll monolith** | Panel with a painted glowing landscape | U188 | Blender mesh + Shader | Plaza centre |
| **Clockwork assembly** | Gears and springs; bronze fret panel with glowing slots | U38, U79 | Blender mesh | Clock tower interior, gate mechanism |
| **Bolt-disc boss** | Concentric bolt disc for doors | U38 | Normal map | Gate studs |
| **Scale-plate trim** | Lamellar scale plates with silver piping | U23 | Normal map | Door straps, gate panels |
| **Shields and talismans** | Enamelled spiral shield, straw talisman, shimenawa rope festoon, giant rope with paper streamers | U63, U68, U232, U316 | Blender mesh | Hall trophies, doorways, shrine gates |
| **Boats** | Coracle, rowboat, gondola, curled-prow boat, glowing-sail boat, moored boats, frozen wreck | U43, U52, U112, U126, U220, U232, U239, U272 | Blender mesh | Long Lake, Lagoon City canals, Frost Fjord |
| **Airships and sky skiffs** | Airship with gondola, sail-winged airship, winged skiff, hang-glider wing | U01, U96, U156, U212, U277, U379, U396 | Blender mesh | Sky ambience |
| **Docks and moorings** | Jetty kit, plank dock, boardwalk pier, mooring poles (striped, rope-wrapped, lamp-topped) | U43, U102, U148, U189, U220, U232, U251, U280 | Blender mesh | Lake docks, Lagoon City |
| **Shells and coral** | Scallop shells, coral fans, barnacle rocks | U112, U118, U394 | Blender mesh + Shader | Lake shore, fountain trim |
| **Market dressing** | Barrels, pots, crates, carts, wagons, ewers, vases | U09, U57, U93, U106, U134, U142, U156, U179, U180, U194, U224, U294 | Blender mesh | Markets everywhere |
| **Carpets and tapestries** | Hanging carpet cards | U278 | Blender mesh | Market, walls, ballroom |
| **Workshop props** | Easel, crane, zipline with winch, lattice scaffold | U33, U44, U212, U222 | Blender mesh | Studio, cliffs, lookouts |
| **Rune scroll rack** | Rack of scrolls with faint glyphs | U10 | Blender mesh + Decal | Library |
| **Hanging birdhouse lantern** | Small hanging house or cage | U196 | Blender mesh | Glowwood trees |
| **Banner totem pole** | Pole with hanging charms | U30 | Blender mesh | Path markers |
| **Brass birdcage trolley** | Brass trolley shaped like a birdcage | U340 | Blender mesh | Arrival area |
| **Layout blockout references** | Not props: a walled inner-ward courtyard plan (U275) and a planted sky bridge with trees between towers (U302), used as blockout guides | U275, U302 | Blender mesh | Castle inner ward and links between crown towers |

## Coverage note

- **Entries:** 736 in 24 sections, of which 45 are marked ★.
- **Raw lines:** all 1744 lines of the catalogue's build-component lists (components-raw.tsv) are assigned to at least one entry.
- **Image IDs:** a Python check over this file confirms every ID from U01 to U402 appears as a source at least once (402 of 402). Pure landscape and sky pictures are covered under Terrain & rock kits and Sky, light & particle FX.
- **Off-theme pictures:** the sci-fi, neon and modern pictures still appear as sources, but only for their reusable details (for example the onion dome shape from U82, the lamp post, sign bracket and clock from U343).
