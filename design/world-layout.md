# World layout v2: a blended, uneven world around a monumental castle

This is the map-level design. It says where every area, castle, forest, bridge and monument goes, how high it sits, and how big it is.
- The look of each area is in [world-build-plan.md](world-build-plan.md).
- The build method for each element is in [architecture-catalogue.md](architecture-catalogue.md).
- **Where each idea came from:** every one of the 402 pictures was opened and studied on its own for its layout, terrain, monuments and props. The result is in [layout-sources.md](layout-sources.md), one row per picture, with the map area it feeds.

**Pictures:**
- [World plan v2](layout/world-plan-map-v2.png)
- [Castle south elevation v4](layout/castle-elevation-v4.png) (v3 kept for comparison)
- [Other buildings sheet](layout/architecture-sheet.png)

The SVG sources sit beside them in `layout/`. The first draft (v1, Atlantis rings) is kept as `world-plan-map.png` and `castle-elevation.png` for comparison only.

## 0. What changed from v1, and why

The owner asked for these changes on 2026-10-10:

| Owner's ask | What v2 does |
|---|---|
| Atlantis is an inspiration, not the layout; merge and blend many layouts | Atlantis now shapes only one district (Lagoon City). The map mixes the layouts the pictures actually show: valley-with-river (U52), cliff-top citadel (U51, U368), lake-front castle (U402, U377), axial palace approach (U360, U396), pillar archipelago (U98, U236), canyon (U179, U238), switchback hill towns (U205, U207) and scattered kingdoms (U142, U348). |
| Uneven and scattered, not only a central city; not too symmetric | There is no ring city. Areas are spread across valleys, cliffs, a canyon and a lake, joined by winding roads, rope bridges, viaducts and the long bridge. Plateaus have irregular cliff edges and differ in height. |
| 300 m rock pillars, 100 m giant trees | **Pillar Reach** (east) has 300 m pillars, some floating. Ten **100 m giant trees** rise out of the forest round the castle, plus a **140 m Mother Tree** on an island in the lake. |
| Dense, glowing forest round the castle, with a few cottages, canopy closing overhead | The **Glowwood** wraps the Castle Crag on every side but the lake. It has a closed canopy, bioluminescent speckles, fireflies and 12 scattered cottages. |
| Use every architecture style; check for misses | Section 8 lists all 21 styles in the pictures. v1 missed East-Asian (33 pictures), Desert/Moorish/Persian/Ottoman, Nordic, Steampunk, Art-nouveau, Roman, the ruins and the jungle temples. All are now placed. |
| Castle taller and broader; a 50 m entrance gate; asymmetric like a princess castle; giant gothic towers joined in the middle; domes alongside; follow the latest picture (U402) | Section 5: a castle 280 m wide and 258 m tall above the crag (348 m above the lake). It has an off-centre Grand Tower, a joined cluster of giant gothic towers in the middle, onion domes on both sides, and a **50 m pointed great gate**. v3 (Oct 11) enlarged this: a 100 m opening gate, a 200 m front wall, a dome of radius 30 m and towering levels from the stair foot. v4 (Oct 11, later) makes it taller and wider again: a 308 m front wall, 75 m and 80 m great windows, a 34 m dome and a 514 m cone tip (section 5). |
| Castle interiors, the large balcony, map everything in the pictures | Section 6 gives each interior picture a room. Section 7 designs the Grand Balcony from the balcony pictures. Section 9 places the props. |
| First-person view | This is passed to the build thread, which owns the camera. Section 10 lists what first person changes in the layout. |

## 1. The idea in one paragraph

You arrive at night in **Lantern Cove**, a stone dais in a cliff cove full of sky lanterns. Across a long, still lake you see a pink castle on a forested crag, reflected in the water as in U402. A curving bridge about 800 m long carries you over the lake, past the Moon Palace, an islet tower and a 140 m glowing Mother Tree. It ends at the Great Gate pylons at the foot of the crag. From there the **Giant-Tree Way** climbs through the dense glowing Glowwood to the foot of the castle's grand staircase, where the castle's towering levels begin and its 100 m gate stands above.

The rest of the world spreads out unevenly beyond the forest:
- a storybook valley of windmills and timber villages
- an East-Asian river valley with a misty tiered keep
- a Greek temple hill and colosseum
- a field of 300 m rock pillars hung with rope bridges
- a red canyon with a Moorish bazaar under a natural arch
- jungle temple ruins
- ruin meadows
- an aurora-lit frozen fjord
- floating islands overhead

The castle is the one thing you can see from everywhere.

## 2. Map areas

Coordinates are in metres. The castle is at (0, 0) and north is up (−z). Heights (y) are above the lake surface. The world is about 2.4 × 2.3 km inside a mountain rim.

| Area | Where | Height | Terrain | Architecture | Monuments and props | Main source pictures |
|---|---|---|---|---|---|---|
| **Lantern Cove** (spawn) | SW corner (−1000, +1150) | 4–20 | Cliff cove, round stone dais, small beach | Lit huts | Sky lanterns, crystals, lantern posts | U354, U106, U101 |
| **Long Lake and Bridge** | Curves SW → NE from the cove to the crag foot | water 0, deck 12–18 | Long, still mirror lake; islets | Arcaded bridge, Mughal water palace, islet tower | Mother Tree 140 m (U237), Moon Palace (U279), islet tower on a rock pedestal (U226, U227), orb monument (U333) | U402, U377, U369, U114, U95, U145 |
| **Castle Crag** | Centre (0, 0) | **90** | Irregular cliff plateau, about 500 × 400 m, with waterfalls to the lake | The Birthday Castle, Baroque terraced gardens, gothic forecourt | Armillary fountain, reflecting pools, statues (no faces), gate pylons | U402, U360, U396, U397, U381, U129, U51 |
| **Glowwood** | All round the crag, radius about 650 m | 20–90 slopes | Dense forest on rolling hills, creeks, root arches, grottoes, waterfall pools | 12 cottages, mossy shrines, small ruins | 100 m giant trees, glowing mushrooms, fireflies, lantern boardwalks | U46, U69, U73, U99, U29, U241, U168, U41, U42, U148, U193, U196 |
| **Lagoon City** | West lake shore (−820, +520) | 2–20 | Lagoon with **partial** canal arcs (no full rings) | Atlantis white blocks and roof gardens, Venetian campo and humpback bridges, Mughal domes | Lighthouse obelisk, canal bridges, water lanterns, festival gate | U398–U400, U189, U251, U272, U280, U281, U185 |
| **Storybook Valley** | NW (−760, −430) | 20–70 | River valley, switchback roads, hills | Half-timber villages, windmill towers, hill castles, a tower bridge | **Rose Keep** on a crag (−560, −600), market squares, a mill wheel | U04, U205, U207, U222, U224, U225, U234, U142, U348, U194, U195 |
| **Temple Hill** | N (140, −560) | 110 | Rounded hill with terraces | Greek temples, stoa, tholos; a **Roman colosseum** to the west | Aqueduct to the castle, triumphal arch avenue, pegasus pylons | U131, U255, U358, U359, U133, U272, U364, U134 |
| **Lantern River Valley** | NE (720, −560) | 30–160 | River, rice terraces, a misty crag | East-Asian tiered keep, pagodas, torii, shrine huts | Lantern pond (U50), waterfall torii shrine (U68), stone lanterns, red arched bridges | U51, U52, U07, U09, U50, U53, U59, U61, U68, U96, U321, U323 |
| **Pillar Reach** | E (760, +100) | pillars **to 300 m** | Ten giant sandstone pillars, some hovering; mist pools | Pavilions on pillar tops; a steampunk **Stargazer Observatory** | Rope bridges, colossal veiled goddess statue on a pillar (U136), glowing rune tower (U27) | U08, U98, U236, U136, U27, U39, U91, U121, U330, U363 |
| **Star Chapel** | East lake bank (270, +470) | 40 | Cliff edge | Gothic cathedral-castle, blue-violet rose windows | Ruined gothic arches nearby | U401, U371, U146, U192 |
| **Red Canyon** | SE (700, +720) | 0–120 | Red canyon with a river, a natural arch, mesas | Moorish/Persian bazaar under the arch, gold-domed walled compound, cliff dwellings | **Sky-arch bridge** (U238), domed **canyon palace** at the far end (U221), hanging gardens (U285) | U179, U221, U238, U274, U275, U276, U285, U33 |
| **Jungle ruins** | E gorge (980, +420) | 20–60 | Waterfall terraces, stepped pools | Stepped temple towers (Mesoamerican feel) | Colossal statue, glyph walls, totem pillars | U97, U98, U290, U291, U147 |
| **Ruin Meadows** | West plain (−1060, 0 to +600) | 10–40 | Golden grassland, natural arches, a crater | Ruined triumphal arches | Standing-stone circle, golden grove, ruined gothic arch | U05, U13, U19, U20, U23, U117, U192, U175 |
| **Frost Fjord** | Far NW (−1000, −880) | 0–60 | Frozen inlet, ice floes, frozen waterfall, aurora | Nordic longhouses | Rune monolith with a light beam (U231), dragon-prow ship | U220, U231, U232, U211, U127 |
| **Mountain rim** | N, E and W edges | 150–600 | Karst peaks, diagonal rock shards, a crater rim | Cliff-top white citadels (distant) | Lighthouse beams | U12, U15, U30, U38, U123, U366, U368, U374 |
| **Sky islands** | Over Pillar Reach, the north and the lake | 250–400 | Floating rocks with waterfalls | Floating chapel, terrace garden, floating citadel, mushroom tower | Chain bridges, halo ring | U21, U137, U199, U119, U107, U375, U362, U383 |

## 2A. The other buildings, drawn

Picture: [architecture-sheet.png](layout/architecture-sheet.png). It shows front elevations of the 14 landmark buildings at night, each panel at its own stated scale, with a height chart against the castle. Heights are above each building's own ground.

1. **Moon Palace** (55 m, about 76 m wide on the plinth): three-step marble plinth with water-level arches, standing in the lake. Two-storey cusped arcades, a tall pishtaq portal, corner towers and roof chhatris, a 20 m white onion dome on a drum, and a gold finial. White Mughal marble, girih and gold bands, warm jali glow, reflected in the lake. Refs: U279 (silhouette and lake setting), U280 (chhatris and lit arcades), U221, U277 (dome massing).
2. **Star Chapel** (90 m, on the 40 m east-bank cliff): west front with twin towers and 26 m slate spires, a central gable with gold flèche, a 17 m blue-violet rose window, three deep portals and a blind arcade. Flying buttresses run from pinnacle piers to the aisle walls, with a crenellated curtain wall and corner turrets for the "castle" half. Lavender ashlar, slate-violet roofs, blue-violet glass. Refs: U401 (spired massing), U371 (castle on a height), U146 (gothic towers in the landscape), U77 (gothic pinnacles at night).
3. **Rose Keep** (80 m, on the 70 m Storybook crag): a stacked round donjon with a corbelled upper tier and an 18 m plum cone, flanked by three pairs of round towers (28/40/50 m) and a crenellated curtain wall with a gate. Rose walls, plum cones, girih bands, gold flags, pink lancets. This is the closest match to the castle palette. Refs: U129 (stacked pointed turrets), U142 (hill castle silhouette), U224 (tall storybook roofs), U226 (slim tower with cone).
4. **Misty Keep and pagoda** (keep 70 m, pagoda 46 m): an 18 m battered ishigaki stone base, then four white plastered tiers with curved dark roofs and red undersides, chidori and kara gables, and gold ridge finials. Beside it stands a 5-tier pagoda with red posts and a gold sōrin. Stone lanterns. White plaster, red trim, dark plum-grey roofs, warm windows. Refs: U51 (keep on a misty crag at night), U52 (white tiered keep), U288 (stacked gables, pink-violet palette), U53 and U186 (pagoda profile, lit tiers).
5. **Temple Hill** (temple 23 m, tholos 24 m; hill 110 m): an octastyle temple with three-step stylobate, glowing cella, meander frieze, pediment and gold acroteria. Beside it, a round tholos with a ring of columns and a ribbed rose-gold dome with lantern. Both sit on terraced retaining walls with a central stair and cypresses. Rose-white marble, travertine terraces. Refs: U131 (temple front plus dome), U364 (domed white monument), U358 (stylised temple), U255 (tholos and terraces).
6. **Colosseum ruin** (48 m): an 88 m segment showing three arcade orders with engaged pilasters and an attic storey with windows. The right side breaks down in a stepped ruin profile with rubble. Lower arches glow with lanterns. Warm travertine. Ref: U272 (colosseum beside canals).
7. **Lagoon City block** (campanile 60 m): Atlantis-style white stepped blocks (15/24/32 m) with gold cornices, roof gardens, cypresses and three veiled gold statues (no faces). A rose-brick Venetian campanile with a lit belfry and green-copper spire. A Mughal pavilion with a teal onion dome and teal chhatris. Quay, mooring poles, humpback bridge, reflection. Refs: U399 and U400 (white terraced city with gold), U189 (campanile), U251 (canal campo and bridge), U280 (teal domes on water).
8. **Canyon Palace and bazaar** (palace 56 m, rock arch 82 m): a walled compound with stepped merlons, a horseshoe gate, a 16 m gold onion dome, twin 48 m minarets with balconies, and gold-domed corner towers. The bazaar sits under a natural red-rock arch: horseshoe-arched shops, coloured awnings, hanging cloths and a lantern string. Sandstone, red rock, gold. Refs: U221 (domed palace in a red canyon), U275 (gold-domed walled compound), U276 (horseshoe arcades, gold dome), U179 (market under a rock arch, cloths).
9. **Storybook village** (tower bridge 38 m): two half-timbered houses (19–20 m) with stone ground floors, jettied timber uppers, steep rose and plum tile roofs and dormers. A 30 m windmill tower house with lattice sails. A tower bridge with two round stone towers and red cones, an arched span over the river and a lit gallery. Refs: U04 (windmill on hills), U207 (tall timber tower house), U222 (big-roof windmill house), U225 (round towers with bridge), U194 (half-timber market houses).
10. **Pillar pavilion and Stargazer Observatory** (pillars 300 m and 240 m): sandstone pillars with grassy tops, joined by a sagging rope bridge. On top, a 14 m red-post pavilion with a sweeping rose roof and lanterns, and a 21 m brass drum carrying a 16 m glass dome with organic gold ribs and a telescope. The inset is at 4.5 px/m. Refs: U08 (pavilions on rock pillars), U236 (building on a mesa with rope stairs), U98 (rope bridges between pillars), U250 (gold-ribbed glass observatory).
11. **Jungle stepped temple** (40 m): four mossy stepped terraces with niches and a gold glyph band, a central stair, a sanctuary with a glowing doorway, and a broken roof comb. Waterfalls pour off the terrace sides into pools. Vines with pink blooms, a ruined lintel gateway and broken pillars. Moss grey-green stone. Refs: U97 (ruined towers and waterfalls), U291 (jungle temple facade), U290 (stepped pools and arches).
12. **Frost Fjord longhouse** (gable 16 m, monolith 19 m): gable end of a log hall. Snow on the roof edges, crossed bargeboards ending in stylised carved scroll finials (no animal heads), a carved door with gold-studded posts, a round shield disc and lanterns. A tilted rune monolith with glowing cyan runes sends a light beam up into an aurora. Snow pines and ice floes. Refs: U220 and U232 (carved gable hall at night, snow), U231 (rune monolith and beam).
13. **Glowwood cottage** (12 m): stone ground floor, timber-framed upper floor with flower boxes, and a swooping mossy plum roof with a round gable window and curling chimney. Round-top glowing door, hanging lanterns and lantern post, string lights, glowing mushrooms, and a giant trunk beside it. Refs: U193 (curved storybook roof), U196 (swooping mossy roof cottage), U153 (round windows), U41 (forest cottage setting).
14. **Mother Tree and islet tower** (tree 140 m, tower 60 m): a rock island with buttress roots spilling into the lake, and a gabled timber hall with lit windows at its foot. A thick trunk branches into a 145 m wide umbrella of glowing magenta foliage with petal lights. The islet tower stands on an eroded rock pedestal: spiral-stair band, wider top room, plum cone, giant mushrooms. Refs: U237 (pink giant tree over a hall on an island), U241 (root forms), U226 and U227 (tower on rock pedestal).

## 3. Terrain: uneven by design

- **No two plateaus match.** The Castle Crag is 90 m, Temple Hill 110 m, the Rose Keep crag 70 m, the Star Chapel cliff 40 m, and the misty keep crag in the east 160 m. Edges are broken cliff with ledges, as in U01, U51 and U92, never circles.
- **Pillar Reach:** ten pillars 180–300 m tall, 40–70 m thick, with grassy tops and trees on top (U121, U363). Three hover 20–60 m clear of their base stumps (U21, U116). Rope bridges link pillar tops less than 190 m apart.
- **Water runs downhill through everything:** waterfalls fall from the Castle Crag into the lake (U397, U95), from the mountain rim into the Storybook river (U04, U228), and down jungle terraces (U147, U290). The Red Canyon river leaves the map under the sky-arch.
- **Natural arches** stand at three points: a root arch in the Glowwood (U29), a valley gateway arch in the Ruin Meadows (U240) and the canyon arch over the bazaar (U179).
- **Method:** the same as world-build-plan 5A (designed heightmap, noise, cliff meshes, slope painting, scatter, baked AO). Pillars and arches are hand-placed rock meshes, not noise.

## 4. The entrance: cove, long bridge and Giant-Tree Way

| Part | Size | Design | Pictures |
|---|---|---|---|
| Lantern Cove dais | 30 m round | Stone stage between cliffs, rising sky lanterns, glowing huts | U354, U106 |
| **The Long Bridge** | **≈ 800 m**, gently curving, deck 14 m wide, about 40 arches | Two-tier arcade (aqueduct style) in pale marble with lantern posts every 20 m. Two domed **pavilions** sit on it (at about 300 m and 550 m), and a spur leads to the Moon Palace. | U369, U114, U95, U138, U145 |
| Mother Tree | 140 m tall, on a rock island beside the bridge | Giant magenta tree glowing at night, a long hall beneath, roots spilling into the lake | U237, U241 |
| Moon Palace | 55 m | Mughal water palace with chhatris, reflected in the lake | U279, U280 |
| Islet tower | 60 m | Round tower on an eroded rock pedestal with a spiral stair and giant mushrooms | U226, U227 |
| **Great Gate pylons** (bridge end) | 2 pylons 60 m tall | Leaning rose-marble pylons with gold lines (from U398) at the foot of the crag | U398 |
| **Giant-Tree Way** | About 420 m long, climbs 90 m with landings | Wide winding avenue up the crag. Lined with **100 m giant trees** whose canopy closes overhead into a glowing tunnel. Lantern posts, mushroom lamps (U113) and fountain landings. A star-lattice path glows ahead of the player. | U168, U18, U73, U108, U381, U397 |

At about 7 m/s the bridge takes roughly 2 minutes to cross, which is long enough to feel the scale in first person. Swan-boat or winged-unicorn rides can be added for friends in a hurry.

## 5. The Birthday Castle v4

Picture: [castle-elevation-v4.png](layout/castle-elevation-v4.png). The owner asked on 2026-10-11 for the castle to be **even taller and wider, with large windows at least 75% of the gate's size**. The gate is 100 m tall, so every great window is at least 75 m tall. v4 keeps everything v3 introduced (the levels from the stair foot, the ring walkways, the cascade, the 100 m opening gate) and scales the crown up round it. The numbers match what the build thread has started putting into the game (`CROWN` in castle.js, `TERRACES` and `COURT_TOWERS` in layout.js), so there is one spec. v3 is kept as [castle-elevation-v3.png](layout/castle-elevation-v3.png) for comparison.

Heights are measured from the **foot of the grand staircase**, where the castle begins, about 20 m above the lake.

**v3 against v4:**

| | v3 | v4 |
|---|---|---|
| Front wall | 200 m long, 90 → 165 m (75 m tall) | **308 m long, 90 → 215 m (125 m tall)** |
| Great windows | 46 m lancets | **four 42 × 75 m great windows** in the front wall, plus **80 m windows** on the dome and cone towers |
| Levels at the base | 350, 290, 230 m wide | **368, 356, 344 m wide** |
| Overall width | about 350 m | **about 470 m**, courtyard tower to courtyard tower |
| Central dome | radius 30 m, top 349 m, finial 377 m | **radius 34 m, top 432 m, finial about 460 m** |
| Cone tower | 46 m wide, tip 418 m | **56 m wide, tip 514 m** |
| Gate frame | gable 222 m | **gable 262 m**, pinnacle turrets to 286 m |

**1. The castle begins at the bottom of the stairs.** Three towering levels climb the crag face, 0–30, 30–60 and 60–90 m, now 368, 356 and 344 m wide. Each level is a long arcade of pink-lit arches crowned by a **circular white walkway**: a balustraded ring terrace carrying sitouts (classic white tables and chairs about every 14 m), blossom planting and lantern posts (U352, U261, U190, U284, U154).

**2. The grand staircase and its water channel.** 68 m wide at the bottom and 56 m at the top, climbing 90 m to the gate sill in 18 flights. A Mughal chadar cascade runs down its centre with **fountain jets at every 15 m landing**, falling into a round pool at the foot (U397, U258, U283, U277).

**3. Towering courtyard structures**, rising from the stair foot and all different:
- left: 190 m with a witch-hat cone, and 150 m with an onion dome
- right: 215 m with a gothic cone, and 160 m with a witch-hat cone

Each has white **sitout balconies** at about two-fifths and two-thirds of its height. Courtyard gardens with fountains and lily pools lie between them (U283, U292, U260).

**4. The front wall** is **308 m long and 125 m tall** (90 → 215 m), closed at each end by a 150 m corner tower (onion cap on the left, gothic cone on the right).
- **Four great windows, each 42 m wide and 75 m tall** (sills at 108 m, tops at 183 m), two on each side of the gate, centred 74 m and 126 m from the middle. Each is a pointed arch of **flowing multicolour glass** (rose, gold, teal, violet and blue melting together, wavy lead lines) divided into **two lancet lights under an eight-foil rose**, with seven transoms, a gold trim moulding and a deep rose-gold reveal. Tracery from U72, U77, U160, U198; the reveal and trim from U379 and U338.
- Narrow 38 m lancets sit between the great windows and beside the gate frame.
- Girih bands run at 101 m and 190 m, and a pinnacle stands every 18 m along the top.

**5. The 100 m Great Gate is a full opening gate.** Unchanged from v3:
- The pointed arch is **100 m tall (90 → 190 m) and 56 m wide**, and all of it is door: **two leaves, each 28 m wide, swing inward**. When she arrives at midnight they open slowly, light pours out and the Great Hall appears behind.
- The leaves are filled with **fractured stained glass in blue, yellow and purple**: a broken-glass mosaic of triangles with dark lead lines, brightest at the centre.
- **The frame** is now taller: a pale gable 80 m wide rising to **262 m**, with a rose-glass lunette and a round flowing-glass oculus in it, and two pinnacle turrets beside it reaching 286 m.

**6. The princess-castle crown (asymmetric):**

| Tower | Position | Height | Cap and windows |
|---|---|---|---|
| **Central dome tower** (the wider one) | 14 m left of centre, **96 m wide** | body to 326 m | **Three 80 m windows** (24 m wide, 232 → 312 m) across its face. A windowed drum, then the **prominent onion dome, radius 34 m** (68 m across, 84 m tall, top at 432 m), gold ribs and a gold finial to about 460 m. |
| **Cone tower** (the taller one) | 66 m right of centre, **56 m wide** | body to 402 m | **One 80 m window** (26 m wide, 236 → 316 m). The **prominent gothic cone**, 112 m tall, tip at **514 m**, glowing at the top, with corner pinnacles |
| Left back towers | 136 and 98 m left | 258 and 240 m | Witch-hat cone (to 308 m) and onion dome (to 280 m) |
| Right back towers | 134 and 150 m right | 266 and 240 m | Gothic cone (to 324 m) and onion dome (to 276 m) |
| Hall mass | 290 m wide, behind the front wall | to 222 m | Ties the towers together; four small onion domes on its roof |

The outline still rises unevenly from the low left turrets, peaks at the cone tower right of centre, and steps down to the right. The dome and the cone are the two landmarks seen from anywhere on the map.

**7. Colours:** walls blush and dusty rose, roofs deep rose and plum, trim rose gold and gold, walkways white marble. The glass breaks from the pink palette on purpose: the gate is blue, yellow and purple, and every other window is flowing multicolour.

**8. How the big windows stay cheap:** the eight great windows share three tracery meshes (one per size, made once in Blender and instanced) over a single glass plane with an emissive flowing-glass texture. Bloom makes them glow at night. They add about 6k triangles and 2 draw calls in total. The rest of the castle is repeats of one module each, so it stays within its share of the budget (section 11), and the walkway furniture and planting are instanced. [detail-pipeline.md](detail-pipeline.md) explains how the carved detail from the component library is added without slowing the game.

**Castle grounds:**
- On the crag top behind the gate: **Baroque terraced gardens** with parterres, fountains and an armillary (U360, U155), and a **cloister courtyard** (U283, U263).
- The **reflecting-pool forecourt** with floating candles (U258, U259) sits at the stair foot round the cascade pool.
- The **red-carpet side avenue** (U247) goes to the east gate.
- An aqueduct leaves north to Temple Hill (U134, U278).

## 6. Castle interiors: every interior picture has a room

The interiors run roughly in order from the gate inward and upward.

| Room | Where in the castle | Design taken from | Pictures |
|---|---|---|---|
| **Great Hall** | Straight through the 100 m gate | Monumental hall, tall arched grid windows, central clock kiosk, galleries, globe lamps | U331, U264, U161 |
| **Twin-stair hall** | Beyond the Great Hall | Two curving staircases rising to a rose window, chandeliers | U332, U271 |
| **Throne and birthday rotunda** | Heart of the castle, under the left dome | Coffered dome, radial floor, statue group (veiled), dais, rose window | U257, U265, U334, U271 |
| **Grand Ballroom** (her birthday party room) | Main floor, south side, opening onto the Grand Balcony | Pink ballroom, starry ceiling, crystal chandeliers, coffered ceiling, marble inlay floor | U268, U266, U388 |
| **Mirror gallery** | Linking the ballroom and the rotunda | Mirrors in gilt frames, painted vault, candle sconces | U262, U267 |
| **Vaulted halls** | Side wings | Swagged arches, blue vault with stars, mosaic disc floor | U269, U270 |
| **Colonnade mirror hall** | Lower floor | Ring of columns round a magic mirror, braziers, Greek-key floor | U81 |
| **Library** | Left turrets | Gothic rib vault, leaded windows; a garden corner with a stained window casting coloured light | U159, U198 |
| **Tower attic** | Top of a left turret | Huge circular rainbow (here pink) rose window, crystal ball, hanging plants | U160 |
| **Stargazer Observatory** | Grand Tower crown, 200 m up | Glass-ribbed dome, radial floor, armillary orb, brass dials | U250, U248 |
| **Cloister walk** | Round the north courtyard | Arcades, lanterns, tiled floor | U263 |
| **Tea nook** | Off the cloister | Round moon window framing a blossom tree, paper lanterns | U289 |
| **Crystal water hall** | Beneath the castle | Round colonnade standing in shallow water, central dais with a glowing orb | U394 |
| **Party salon** | Next to the ballroom | Fireplace, gifts, tree, balloons, crystal chandeliers | U162 |

## 7. The Grand Balcony

The Grand Balcony projects from the front wall at 106 m, west of the gate, just under the sills of the two western 75 m great windows, so the windows rise behind it like a wall of coloured light. It looks straight down the avenue to the lake and the bridge. It opens from the Grand Ballroom.

- **Shape.** It is 44 m long with a semicircular centre that projects 12 m, like the terraces in U261 and U350.
- **Railing.** A gold balustrade with scroll ironwork and urns on the posts (U128, U261, U351).
- **Behind it.** A pointed-arch loggia (U181) at balcony level whose doors are **heart-shaped windows** in pink glass (U128), with the two great windows rising above it.
- **Lights.** Strings of lanterns, potted roses, and lamp-lined steps down to a lower terrace (U352, U113).
- **Garden corner.** A rooftop fountain court at one end (U393) and a pavilion garden with blue-gold tile panels (U284).
- **Midnight.** At 12 am on Oct 23 this is where the honoree stands for the welcome. Fireworks rise over the lake below (U286), and lanterns lift off the lake.

The balcony pictures cover a few smaller terraces as well. The cliff terrace with lights (U350) goes on the Rose Keep. The terrace stairs (U190) and the balustrade promenade (U351) go on the Baroque gardens' edge.

## 8. Architecture check: every style in the pictures has a place

| Style (pictures) | Where it goes |
|---|---|
| Fairy-tale (37) | Castle turrets and silhouette, Rose Keep, the cottages |
| Baroque (37) | Castle gardens, interiors (ballroom, mirror gallery), Lagoon City palazzi |
| Timber storybook (38) | Storybook Valley, Glowwood cottages |
| East-Asian (33) | Lantern River Valley (keep, pagodas, torii, terraces, lantern pond) |
| Gothic (31) | Castle towers, Star Chapel, ruined arches, library |
| Ruins (46) | Ruin Meadows, Glowwood shrines, jungle ruins, sky islands |
| Mediterranean (24) | Lagoon City campo and stairs, Temple Hill town |
| Fantasy palace (19) | Castle forecourt and glass bays, Moon Palace |
| Desert (16), Moorish (6), Persian (2), Ottoman (2) | Red Canyon bazaar, canyon palace, walled compound |
| Islamic stylized (14), Mughal (8) | Castle domes, girih and jali, Moon Palace, Lagoon City domes |
| Greek classical (13), Roman (6) | Temple Hill, colosseum, aqueduct, triumphal arches |
| Art nouveau / deco (10) | Castle ironwork, red-carpet avenue (U247), armillary plaza fountain (U380) |
| Steampunk (6) | Stargazer Observatory, the workshop village on pilings in Storybook Valley (U102), orb monument in the lake (U333) |
| Nordic snow (5) | Frost Fjord |
| Sci-fi / neon (19), Modern (14) | **Not used.** Only lantern rhythm and light-beam ideas carry over |
| No architecture (54) | Terrain, forest and sky references, used across the Glowwood, Pillar Reach and the rim |

## 9. Props and artifacts, and where they go

| Prop | Where | Pictures |
|---|---|---|
| Armillary spheres | Baroque gardens, observatory, Lagoon City plaza | U87, U250, U305, U360, U380 |
| Fountains (tiered, statue, glowing) | Forecourt, cloister, village squares | U89, U283, U284, U338, U339, U344 |
| Floating candles and lantern boats | Reflecting pool, Long Lake | U50, U86, U258 |
| Sky lanterns | Lantern Cove, midnight release | U106, U354 |
| Stone lanterns, torii, paper lanterns | Lantern River Valley | U53, U62, U68, U317 |
| Mushroom lamps, glowing mushrooms | Giant-Tree Way, Glowwood | U75, U113, U226 |
| Crystals and orbs on pedestals | Glowwood grottoes, crystal hall | U85, U94, U104, U394 |
| Statues (veiled or stylised, no faces) | Gate, gardens, pillar goddess | U136, U154, U155, U379 |
| Obelisks and rune monoliths | Lagoon City lighthouse, Frost Fjord | U151, U231, U398 |
| Banners and pennants | Gatehouses, towers | U93, U131, U370 |
| Braziers and urns | Temple Hill, balconies | U81, U178, U261 |
| Rope bridges | Pillar Reach | U08, U98, U236 |
| Windmills and a mill wheel | Storybook Valley | U04, U44, U207 |
| Market stalls and bunting | Canyon bazaar, village squares | U179, U194, U195 |

## 10. First person: what it changes

- **Eye height 1.6 m:** the 100 m gate, the 100 m trees and the 300 m pillars read at their true scale. Near details matter most: bark, paving, railings, flowers, and lantern glow at arm's length.
- **The castle is the compass:** sight lines keep it visible through forest gaps at about 10 chosen viewpoints (cove, bridge pavilions, Temple Hill steps, pillar tops, the canyon arch).
- **Canopy:** under the Glowwood the sky is mostly hidden, so light comes from glowing fungi, fireflies and lanterns. That costs little and looks rich.
- **Travel:** the world is about 2.4 km across. Waystones or rides between areas keep walking pleasant.

## 11. Laptop budget

| Item | Triangles | Draw calls | How |
|---|---|---|---|
| Birthday Castle v4 (near) | 126k | 26 | Modular gothic kit (tower bay, lancet, spire, dome, gate), instanced; 8 great windows add 6k and 2 draw calls; carving comes from normal maps (detail-pipeline.md) |
| Glowwood (about 4,000 trees) | 70k | 10 | Instanced, 3 LODs; the far canopy is one lumpy "canopy blanket" mesh with leaf texture; billboards beyond 150 m |
| Giant trees (10 + Mother Tree) | 25k | 4 | One hero model, instanced |
| Pillar Reach | 20k | 5 | 3 pillar meshes reused, rotated and scaled |
| Other areas (only the one you are in at full detail) | 50k | 30 | Each area streams in; others sit as low-detail silhouettes in fog |
| Bridge, lake, reflection copy | 20k | 6 | One arch instanced 40 times; mirrored low-detail castle under the water |
| **Total in view** | **≈ 311k** | **≈ 81** | About 4% over the 300k line; the Low setting uses the castle's far version beyond 600 m and drops far forest to billboards sooner, which brings it back under |

## 12. Build order

1. Blockout of the whole map at real sizes: crag, lake, bridge, forest volume, pillars and the far areas as grey shapes. Walk it in first person.
2. Castle silhouette at full size, with the 100 m opening gate, the tiered base and the stair cascade.
3. Lake, bridge and reflection: the U402 shot from the cove.
4. Glowwood and the Giant-Tree Way.
5. Castle interiors (Great Hall, ballroom, Grand Balcony first).
6. Outer areas one at a time: Lagoon City, Storybook Valley, Temple Hill, Pillar Reach, Lantern River Valley, Red Canyon, the rest.
7. Detail pass: normal maps, glass, patterns, props.
