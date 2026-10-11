# Architecture and Detail Catalogue

This catalogue covers every architecture style, building element, interior, landscape feature, prop and light fixture across the 401 reference images (U01–U401, full notes in [image-analysis.md](image-analysis.md)). For each one it says what it looks like in detail, how we would build it in the browser, and how close we can get. The world layout and build order are in [world-build-plan.md](world-build-plan.md).

**How it gets built**
- **CODE**: generated in Three.js (arches, domes, towers, stairs, lattice, rails). Clean, exact, light, and easy to change.
- **MODEL**: a 3D model file (Blender or a CC0 kit, exported as glTF). Needed for sculpted or organic shapes such as statues, chandeliers and furniture.
- **TEX**: textures, normal maps or decals that make carving, tiles, mosaics and wear read as 3D without extra polygons.
- **FX**: shaders and particles, used for glow, water, fog, beams and sky.

**How close we can get (in a laptop browser)**
- **A**: close to the reference, including up-close detail.
- **B**: the same design and materials, with a simpler surface finish.
- **C**: outline and mood only. The original is photoreal, or too heavy to run.

---

## 1. Architecture styles

| # | Style | Where it appears | Signature details seen in the images | Use in our world | Build | Match |
|---|---|---|---|---|---|---|
| S1 | **Mughal / Indo-Islamic** | U221, U278, U280, U281, U342, U279 | Bulbous onion domes on drums, slim minarets with balconies, chhatri kiosks, horseshoe and cusped arches, red-sandstone or white-marble walls, gold finials, reflecting pools | **The castle's main body**, lake palace at night | CODE domes, arches, minarets + TEX marble and inlay | **A** |
| S2 | **Moorish / Andalusian** | U292, U263, U260, U183 | Horseshoe arches filled with hexagon and star lattice, twisted columns, muqarnas hints, zellige tile dados, saffron drapes, brass lanterns, lotus pools | Inner court, arcades, lattice windows | CODE arches + TEX lattice (alpha) and zellige | **A** |
| S3 | **Ottoman garden pavilion** | U284, U346 | Gold-lattice screen walls, blue-and-gold Iznik tile panels, marble columns, red cushioned divans, tiered fountain, rose beds | **Courtyard garden** | CODE pavilion + TEX tiles + MODEL fountain | **A** |
| S4 | **Overwatch-stylized Islamic (Oasis, Morocco)** | U181–U183, U274–U276, U308 | Chunky bevelled sandstone, blue zigzag bands on capitals, nested stepped arches, star-lattice windows lit from behind, gold flower canopy on a minaret, uplit sails | Castle trim language, plazas, travel pads | CODE + TEX trim sheet | **A** (this style is built for modest PCs) |
| S5 | **Gothic** | U72, U77, U84, U144, U184, U369, U373, U378 | Pointed arches, tracery, rib vaults, quatrefoils, spires and pinnacles, buttresses, rose windows, iron railings | Secondary spires on the castle, gate towers, library, ruins | CODE pointed arches (already in castle.js), spires + TEX tracery | **A** |
| S6 | **Fairy-tale romantic castle** | U114, U129, U205, U224, U225, U361, U401 | White walls, blue or red cone roofs, stacked round towers, arched bridges, tiers rising to one tall spire | Castle silhouette, twin towers at the gate | CODE towers, cones, bridges | **A** |
| S7 | **Baroque / Classical palace** | U253, U256, U257, U266, U310, U311, U360 | Domes on drums, fluted columns with gold capitals, coffered ceilings, balustrades with urns, symmetric grand stairs, statues in niches | Forecourt, welcome hall, ballroom, balustrades | CODE columns, stairs, balustrades + MODEL statues, urns | **A** for structure, **B** for sculpture |
| S8 | **Infinity Nikki / Genshin Fontaine fantasy palace** | U355, U379–U381, U389, U395–U397 | Pale stone, very tall blue-glass windows with gold ribs, shell-ray crowns, cypress topiary, lavender, armillary centrepiece, terrace waterfalls | **Forecourt and approach**, gate | CODE + TEX glass and gold ribs + MODEL armillary | **A** |
| S9 | **Art Nouveau / Art Deco** | U128, U248, U271, U331, U339 | Iron curl canopies and railings, sunburst floors, round kiosks, curved balconies, arched lattice windows | Her seat (iron lattice window), party hall kiosk, railings | CODE curves (tube geometry) + TEX sunburst | **A** |
| S10 | **Storybook timber (Zelda / WoW / Moorland)** | C01, U102, U149, U193, U194, U209, U210, U223, U229, U233 | Exaggerated curved beams with carved ends, scalloped blue or purple shingles, pointed warm windows, stained-glass bay windows, ivy, bunting, swirl runes on doors | **Town houses** | CODE frame + MODEL hand-tuned house kit + TEX hand-painted | **A** |
| S11 | **Mediterranean hill town / Venice** | U152, U189, U251, U336, U347, U389 | Pastel plaster, terracotta roofs, green shutters, arch bridges over canals, striped mooring poles, bell towers, gold domes on the summit | **Town structure and canals** | CODE + TEX plaster and peeling-to-brick | **A** |
| S12 | **Desert bazaar** | U177–U179, U282, U392 | Chunky orange rock, sandstone terraces, arched windows, cloth canopies and bunting, carpets on rails, spout fountains, Greek-key or star roundels | Bazaar street, small island keep | CODE + FX cloth wind | **A** |
| S13 | **Persian courtyard** | U130, U258–U260 | Carved sandstone columns, pierced screens, glowing wish tree, long pool with candles | **Midnight courtyard** | CODE + TEX + FX candles | **A** |
| S14 | **Snow / Nordic** | U125–U127, U211, U220 | Carved longhouse with dragon-head gables, snow-heavy pines, crescent finials, lantern strings, ice crystals | Crystal Winter Isle | CODE + FX aurora and snow | **A** |
| S15 | **East Asian pagoda / Hanaoka** | U186, U287–U289, U316, U322 | Curved tiered roofs, red gates, paper lanterns, moon windows | **Moon window** and lantern rows only (keep the theme Islamic + gothic) | CODE | **A** |
| S16 | **Greek / Athenian classical and monumental** | U81, U131, U154, U255, U360, U362, U364, U398–U401, U136 | White marble colonnades with fluted columns, full entablatures, sculpted pediments, caryatids, colossal statues, monumental stairs and terraced acropolis plans. **See section 1A** | Acropolis terraces under the castle, temple island, propylaea gate, colonnaded avenues | CODE + TEX + MODEL sculpture | **A** architecture, **B** sculpture |
| S17 | **Neon / cyberpunk city** | U301–U304, U318–U320, U324–U326 | Neon, wet streets, ray-traced light | Off-theme | — | **C** |

**Mix for the castle:** S1 (onion domes, minarets) + S4 (chunky trim and glowing star lattice) + S6 (romantic tower stacking) + S5 (secondary gothic spires) + S8 (blue-glass windows with gold ribs), finished in white, gold, blue and pink.

## 1A. Greek / Athenian classical and monumental architecture

The owner's references include true monumental classical work: AC Odyssey's Atlantis (U398–U400), the terraced cathedral city (U401), the classical hall with a Greek-key floor (U81), the caryatid portico (U154), Fenyx Rising's temples (U364, U362), the terraced palace (U360) and the colossal statue (U136). **The architecture in these can be built at an A match.** Marble columns, entablatures, stairs and terraces are regular, repeating geometry, which is ideal for code plus good textures. Only the photoreal lighting and foliage of Atlantis stay out of reach.

### What makes them monumental

1. **Scale cues.** Columns 10–20 m tall next to people 1.7 m tall, very wide stairs, and colossal statues (U136, U399 gold statues on towers). Without small human-scale details (doors, lamps, people) beside them, big buildings read as small.
2. **Repetition and rhythm.** Long colonnades and stoas, rows of identical arches (U401 aqueduct tiers), and avenues lined with statues or obelisk pylons (U398).
3. **Terraced acropolis plan.** Buildings stepped up a hill, with each terrace a pale horizontal band, rising to one crowning temple or spire (U401, U360, U400).
4. **Bright white marble with gold.** Marble in warm white `#f0ebdc` / cool white `#e9eef0`, shadow in pale blue-grey `#a7b4b8` (never black), gold accents `#d4a640` on capitals, statues and roof acroteria, and **purple wisteria and lavender** on terrace tops (U399).
5. **Landscape around it.** Cypress columns, olive trees, terrace gardens, water channels and harbours (U398–U400).

### Classical details to build (the "orders")

| Detail | What it is | Build | Match |
|---|---|---|---|
| **Stylobate** | 3 tall marble steps the temple sits on | CODE | **A** |
| **Doric column** | Plain cushion capital, 20 sharp flutes, **entasis** (slight swelling in the middle), no base | CODE lathe with a fluting normal map | **A** |
| **Ionic column** | Scroll (volute) capital, base with mouldings, 24 flutes | CODE shaft + MODEL capital (one small model, instanced) | **A** |
| **Corinthian column** | Acanthus-leaf capital, the most ornate | CODE shaft + MODEL capital | **A–B** |
| **Architrave** | Plain beam across the column tops, 3 stepped bands | CODE | **A** |
| **Frieze** | Band above it: Doric **triglyphs and metopes** (carved panels), or an Ionic continuous **relief** | CODE blocks + TEX normal-mapped relief | **A** |
| **Cornice** | Projecting top ledge with dentils (tooth blocks) and a lion-head gutter | CODE + TEX | **A** |
| **Pediment** | Triangular gable filled with sculpture; acroteria (gold ornaments) on the corners and tip | CODE triangle + TEX relief / MODEL figures | **A** frame, **B** sculpture |
| **Caryatids** | Female statues used as columns (U154). Ours wear modest draped robes | MODEL | **B** |
| **Coffered ceiling** | Grid of sunken square panels, often with gold rosettes | CODE + TEX | **A** |
| **Greek key (meander) band** | Running border on floors, friezes, trims (U81) | Trim TEX | **A** |
| **Egg-and-dart, bead-and-reel mouldings** | Small carved bands under the cornice | TEX normal map | **A** |
| **Propylaea gateway** | Monumental columned gate building at the top of a stair | CODE | **A** |
| **Stoa** | Long covered colonnade with a back wall | CODE, instanced columns | **A** |
| **Tholos (round temple)** | Ring of columns with a conical or domed roof (U364, U384, U131) | CODE | **A** |
| **Exedra** | Semicircular colonnaded bench niche | CODE | **A** |
| **Colossal statue** | 15–40 m figure on a plinth (U136, gold statues U399) | MODEL low-poly with clean silhouette | **B** |
| **Obelisk / pylon pairs** | Tall tapering stone markers at gates (U398) | CODE | **A** |
| **Aqueduct arcade tiers** | Two or three stacked arch rows (U401, U138) | CODE, instanced | **A** |
| **Marble surface** | Soft veining, slight wear, warm sun bounce | TEX (tiled marble + baked AO) | **A** |
| **Gold bronze** | Statues, capitals, acroteria | Metal-gold material with a soft rim | **A** |

### Where it goes in our world
- **The castle stands on a classical acropolis.** Three marble terraces with stoas along their edges, a propylaea-style gate at the top of the grand stair, and aqueduct arcades carrying the waterfalls into the canals (U401 + U360 + U397). The Islamic and fairy-tale castle crowns it.
- **Rose Garden Isle temple** = a tholos with gold acroteria and winged unicorn statues (U364).
- **Avenue of statues and pylons** from the town to the gate (U398), with lamp posts between them.
- **Welcome hall interior** = a coffered rotunda with Corinthian columns and a Greek-key floor (U81, U257).
- **Ruin island** = a broken Doric colonnade with blossom trees growing out of it (U384).

### Budget
One Ionic and one Corinthian capital model (about 2–4k triangles each), shared and instanced across the whole world. Columns, entablatures, stairs and terraces come from code with one marble texture set plus a trim sheet (meander, egg-and-dart, dentils). A colonnade of 40 columns is then a single draw call.


---

## 2. Building elements

### 2.1 Domes and roofs
| Element | Seen in | Detail | Build | Match |
|---|---|---|---|---|
| Onion dome with gold ribs over blue tiles | U221, U390, U280 | Lathe profile on a drum; 16–24 gold ribs; scale-tile pattern; curled or crescent finial | CODE lathe (onionGeometry already exists) + TEX tile normal map | **A** |
| Ribbed hemisphere dome on an arcade | U366, U254 | Ribs, round arcade drum, lantern on top | CODE | **A** |
| Stained-glass dome | U273 | Coloured segments in lead cames, glowing from inside at night | CODE + emissive TEX | **A** |
| Gold lattice dome | U250 | Curving gold ribs with star cut-outs over a glass floor | CODE tube ribs + alpha TEX | **A** |
| Cone roofs (red, blue) | U225, U224, U370 | Shingle normal map, pennant on the tip | CODE | **A** |
| Scalloped shingle roof (curved) | U149, U210, U233 | Curved ridgeline, fish-scale shingles | CODE bent plane + TEX | **A** |
| Crystal crown around a dome | U356, U129 | 8–12 tall faceted cyan crystals with emissive core | CODE + FX | **A** |
| Crescent-moon and curled finials | U211, U356, U390 | Gold crescent on a stack of spheres | CODE | **A** |

### 2.2 Arches, doors and gates
| Element | Seen in | Detail | Build | Match |
|---|---|---|---|---|
| Pointed (gothic) arch | many | Moulded frame, keystone, tracery infill | CODE (pointedArchShape exists) | **A** |
| Horseshoe / cusped arch | U221, U292, U183 | Multi-lobed intrados, carved spandrels | CODE shape + TEX | **A** |
| Nested stepped arch doorway | U182 | 3–4 receding arch frames | CODE | **A** |
| Gold-framed glass gates | U379 | Tall leaves with gold frame, leaded glass, swing open | CODE | **A** |
| Round medallion over a gate | U178 | Big carved disc, star pattern, glowing at night | CODE disc + TEX | **A** |
| Glowing round door at the top of stairs | U332 | Circular door, fan window above | CODE + FX | **A** |
| Arch outlined in neon as a portal | U213 | Emissive tube along the arch | CODE + FX | **A** |
| Moon gate / moon window | U135, U289 | Circular opening framing a tree | CODE | **A** |
| Broken wall breach reveal | U201 | Wall with a jagged gap | CODE | **A** |

### 2.3 Windows
| Element | Seen in | Build | Match |
|---|---|---|---|
| Eight-point star lattice window glowing from behind | U183, U260 | TEX alpha + emissive | **A** |
| Tall blue-glass windows with gold vertical ribs | U381, U355 | CODE + TEX | **A** |
| Round rose / rainbow stained-glass window + coloured light on the floor | U160, U198 | TEX + floor decal | **A** |
| Heart-shaped windows glowing pink | U128 | CODE shape + emissive | **A** |
| Stained-glass bay window | U229 | CODE + TEX | **A** |
| Arched lattice windows (Art Deco) | U331, U307 | CODE + TEX | **A** |

### 2.4 Towers and verticals
| Element | Seen in | Build | Match |
|---|---|---|---|
| Minaret with balconies and a lantern top | U221, U278, U280 | CODE stacked lathe | **A** |
| Stacked round towers with cone roofs | U224, U129 | CODE | **A** |
| Gothic spire with pinnacles | U373, U401 | CODE | **A** |
| Twin towers joined by an arched bridge | U225 | CODE | **A** |
| Tower with a ring of orbiting rings / rubble | U385, U137 | CODE + animation | **A** |
| Clock tower (countdown) | U233, U380 | CODE + a real clock texture | **A** |
| Light spire with a beam | U151 | CODE + FX | **A** |

### 2.5 Columns, walls and trim
| Element | Seen in | Build | Match |
|---|---|---|---|
| Fluted columns with gold capitals | U257, U266 | CODE lathe + normal map; capital as MODEL | **A** |
| Capitals with blue painted zigzag bands | U181 | CODE + trim TEX | **A** |
| Twisted columns | U292 | CODE (twisted lathe) | **A** |
| Carved pierced-lattice pilasters | U258, U263 | TEX alpha | **A** |
| Chunky bevelled stone with metal inlay lines | U83, U84 | CODE bevel + emissive TEX lines | **A** |
| Stone quoins, cornices, balustrades with urns | U176, U252, U351 | CODE + MODEL urns | **A** |
| White carved lace trim on eaves | U180 | TEX alpha strips | **A** |
| Islamic geometric frieze bands | U03, C01, U181 | Trim TEX (one shared sheet) | **A** |
| Peeling plaster revealing brick | U335 | TEX | **A** |
| Facade wings (sculpted) | U141 | MODEL | **B** |
| Statues in niches | U81, U395 | MODEL | **B** |

### 2.6 Stairs, terraces and bridges
| Element | Seen in | Build | Match |
|---|---|---|---|
| Grand symmetric stair | U311, U356 | CODE | **A** |
| Twin curved staircases | U332, U219 | CODE (spiral sweep) | **A** |
| Round stepped dais | U81, U134, U271 | CODE | **A** |
| Stepped terraces with falls into canals | U397, U360 | CODE + FX water | **A** |
| Stone arch bridge | U114, U251 | CODE | **A** |
| Rope / plank bridges | U42, U236 | CODE (catenary) | **A** |
| Natural rock arch bridge with a town | U238 | MODEL rocks | **B** |
| Glowing step edges | U214 | Emissive strips | **A** |

### 2.7 Floors
| Element | Seen in | Build | Match |
|---|---|---|---|
| Gold-and-blue swirl medallion | U355 | One large TEX with slight gloss | **A** |
| Star-inlaid floor circle | U257, U265 | TEX decal | **A** |
| Sunburst medallion | U331 | TEX decal | **A** |
| Teal diamond mosaic / zellige | U263 | Tiling TEX | **A** |
| Concentric floor rings | U151 | TEX decal | **A** |
| Black-and-white checker | U197 | TEX | **A** |
| Hexagon paving | U353 | Tiling TEX | **A** |
| Wave-pattern mosaic promenade | U314 | Tiling TEX | **A** |

---

## 3. Interiors

| Room | Copy | Detail to reproduce | Build | Match |
|---|---|---|---|---|
| **Welcome hall (rotunda)** | U257, U265, U334, U270 | Ring of fluted columns, coffered dome with oculus beam, star floor circle, patterned runner, violet banners, flower urns, three indoor waterfalls | CODE structure + TEX coffers and floor + FX beam and falls + MODEL urns | **A** |
| **Ballroom / gallery** | U268, U388, U266 | Row of crystal chandeliers, pink drapes, flower balconies, floor medallions, window light stripes, galaxy ceiling at midnight | CODE + TEX + MODEL chandeliers + FX ceiling | **A** (structure), **B** (chandeliers) |
| **Throne / her seat** | U271, U265 | Round stepped dais, curved stairs with gold rails, iron lattice window onto domes | CODE | **A** |
| **Grand entrance hall** | U332, U264 | Twin curved stairs, fan stained glass, hanging lanterns, globe lamps on newels | CODE | **A** |
| **Party hall (Grand Central)** | U331 | Three tall lattice windows, round kiosk (cake or gift table), sunburst floor, warm wall uplights | CODE + TEX | **A** |
| **Tea nook** | U262, U289 | Table for two, tea and cake, gold mirror frames, candle sconces, round moon window | CODE + MODEL tea set | **B** |
| **Library** | U159, U248 | Rib vault, shelves, armchairs, hanging armillary, gift boxes | CODE + TEX book spines + MODEL chairs | **B** |
| **Cosy attic / her room** | U160 | Round rainbow window throwing coloured light, cushions, plants, crystal ball | CODE + TEX + MODEL | **B** |
| **Portal room** | U394, U81 | Round flooded hall, glowing orb on a gold pedestal, light shafts / mirror portal on a patterned dais | CODE + FX | **A** |
| **Blue night hall** | U269 | Fabric swags looping to a chandelier, candle sconces | CODE curves + MODEL | **B** |
| Realistic hotel and house interiors | U161–U164, U261–U267 | Lighting ideas only (warm lamp vs blue window) | — | **C** |

---

## 4. Landscape and water features

| Feature | Copy | Build | Match |
|---|---|---|---|
| Floating islands with cliff skirts, hanging roots, waterfalls off the edge | U96, U199, U364, U384 | CODE terrain + FX | **A** |
| Inverted floating mass with falls | U116 | CODE + FX | **A** |
| Sea of clouds (pink-tinted base) | U363, U384 | FX layered cards | **A** |
| Tiered fountain / water curtain fountain | U284, U344 | MODEL basin + FX water | **A** |
| Long reflecting pool with floating candles and lilies | U258, U259 | CODE + FX | **A** |
| Lotus / lily pool | U292, U199 | CODE + instanced pads | **A** |
| Stepped turquoise pools | U147 | CODE + FX | **A** |
| Canals with arch bridges | U251 | CODE | **A** |
| World tree (spiral / root spring / tower inside) | U40, U241, U365, U382 | MODEL trunk + leaf cards | **B** |
| Bioluminescent forest (glowing veins, mushrooms, coral plants) | U85 | CODE + emissive TEX | **A** |
| Rose beds, lavender beds, hydrangeas, bougainvillea | U284, U381, U342, U283 | Instanced cards | **A** |
| Cypress topiary rows | U381, U395 | CODE cones + leaf TEX | **A** |
| Pink blossom trees growing out of ruins | U384, U18 | Leaf-card canopies | **A** |
| Crystal shrubs and ice spikes | U119, U125 | CODE faceted + FX | **A** |
| Rune stone ring | U105, U231 | CODE + emissive TEX | **A** |

---

## 5. Props and furnishings

| Prop | Copy | Build | Match |
|---|---|---|---|
| Golden armillary sphere with glowing core | U305, U360, U380 | CODE rings + FX core | **A** |
| Glowing ringed planet on a pedestal | U333 | CODE + FX | **A** |
| Winged unicorn statues | U364 (winged horses), U379 (angels) | MODEL | **B** |
| Lantern sculptures (unicorn, star, crescent) | U317 | MODEL low-poly + emissive | **A** |
| Crystal chandeliers | U162, U268, U388 | MODEL (or a CODE ring of crystals) | **B** |
| Ring candle chandeliers | U161 | CODE | **A** |
| Brass hanging lanterns, paper lanterns, globe lamp posts | U292, U316, U155 | CODE / small MODEL, instanced | **A** |
| Cloth canopies, bunting, cut-paper flags, banners with gold finials | U179, U357, U355 | CODE + FX wind | **A** |
| Carpets hung on balustrades | U278 | CODE + TEX | **A** |
| Red cushioned benches, iron benches | U284, U155 | MODEL | **B** |
| Party table with tablecloth, cake, gifts with bows, balloons | U350, U159, U153 | MODEL + instanced balloons | **B** |
| Ferris wheel | U343 | CODE | **A** |
| Hot-air balloons, airship | U142, U207, U156 | MODEL low-poly | **A** |
| Fire ring / fire bowls | U135, U81 | CODE + FX | **A** |
| Clock face for the countdown | U233 | CODE + TEX | **A** |

---

## 6. Light fixtures and effects (what makes the detail glow)

| Effect | Copy | Build | Match |
|---|---|---|---|
| Warm facade uplight against a violet sky | U310, U311 | Gradient in the material | **A** |
| Star-lattice windows glowing from behind | U183 | Emissive TEX | **A** |
| Oculus beam / god rays | U257, U334 | Additive cones | **A** |
| Stained-glass colour on floors | U160, U198 | Decals | **A** |
| Floating candles, sky lanterns, balloons rising | U259, U317, U106 | Instanced particles | **A** |
| Aurora curtains and ribbons, star trails, two moons | U127, U231, U308, U129, U373 | Sky shaders | **A** |
| Sky mandala reveal | U279 | Animated additive texture | **A** |
| Beacon pillars, searchlights | U124, U303 | Additive cones | **A** |
| Rising embers, wisps, petals | U280, U99 | Particles | **A** |
| Coloured fog per island | U109–U111 | Fog colour per zone | **A** |
| Real reflections, ray tracing, volumetric clouds | U267, U387, U398 | Faked with gloss and cards | **C** |

---

## 7. What we can build: summary

- **Most of the 401 pictures can be built at an A match.** That covers the architecture (domes, arches, towers, lattice, stairs, bridges, terraces), the floors, the water, the plants and all the lighting. These come from code plus good textures, so the castle and grounds can be detailed and exact.
- **B match (needs model files):** statues and winged unicorns, facade wings, chandeliers, furniture, and the world-tree trunk. They will look right, but less finely sculpted than in the pictures. Getting closer means time in Blender or good CC0 kits.
- **Greek / Athenian monumental architecture** (section 1A) is an **A match** for the marble architecture itself, including columns, entablatures, pediments, stoas, terraces and aqueducts. Sculpture (caryatids, colossal statues, pediment figures) is **B**.
- **C match (mood only):** the neon and cyberpunk cities, realistic hotel rooms, Atlantis's photoreal lighting and foliage, and ray-traced reflections.
- **Already in the game code:** pointed arches, arch frames and onion domes (js/world/castle.js), gardens and lanterns (garden.js), islands (islands.js), sky and atmosphere. The catalogue extends these rather than starting over.
