# Owner sketches v5: the one buildable plan

On 2026-10-11 the owner drew 16 concept sheets and asked for them to be built exactly. The sheets don't all agree, so this page merges them into one plan. **Where two sheets differ, the rule is: the latest revision wins, a labelled number beats a measured drawing, and the world plan decides where things go.** Every default chosen is marked *(default)*.

The sheets are in [owner-sketches/](owner-sketches/), numbered 01 to 16. This page supersedes world-layout.md §2 (map) and §5 (castle v4) wherever they conflict. Anything this page leaves out stays as it is in world-layout.md.

## 1. The world: Starlight Coast (sheet 04)

- **Size:** a 7.5 × 7.5 km island coast, which is 3× the linear size of world v2 (2.4 km). The ocean surrounds it, with an uneven wave field, reefs, beaches, sea stacks and boat routes.
- **Origin:** the Princess Palace (B01) is at (0, 0), north is −z, and units are metres. The palace sits north of the map centre, so the envelope runs from x −4000 to +3500 and from z −2600 to +4900.
- **The golden route:** spawn at the B20 Bridge Pavilions on the south shore of Lantern Lake. From there, one straight causeway runs north for about 2.3 km across the lake to the palace gate, lined with the 100 m avenue trees (T02). The cove-and-winding-path entrance is replaced; the old path can stay as a secondary route.
- **Secondary paths** link every district. A dashed **boat route** runs from Lantern Cove past the Lighthouse to the Sea Pavilion. **Sky portals** reach the four sky isles.

Positions are read off sheet 04 at about 6 m per pixel. They are accurate to ±150 m, so nudge them to fit the terrain.

| Code | Name | x | z | Setting |
|---|---|---|---|---|
| B01 | Princess Palace | 0 | 0 | Raised centre, terraces down to the lake |
| B02 | Moon Water Palace | −630 | 1320 | Islet in Lantern Lake, west of the causeway, glass dome |
| B03 | Star Chapel | 750 | 1410 | Islet in the lake, east, gothic pink spires |
| B04 | Rose Keep | −960 | −540 | Pink keep on a crag, NW of the palace |
| B05 | Misty Keep | 1020 | −900 | Misty mountain crag, NE |
| B06 | Pagoda | 1050 | −420 | Tiered pagoda, east hills |
| B07 | Temple Rotundas | −30 | −1260 | Due north on the palace axis, domed rotundas and a terrace |
| B08 | Colosseum | −1020 | −1140 | North-west plateau |
| B09 | Lagoon City | −2460 | 1200 | West lagoon, canals and white blocks |
| B10 | Canyon Palace | 1560 | 1560 | Red canyon with waterfalls, SE of the lake |
| B11 | Crescent Arch | 2640 | 1920 | Natural rock arch on the east coast |
| B12 | Storybook Village | −2400 | 780 | West, half-timber village by canals |
| B13 | Windmill | −2190 | 240 | West hills |
| B14 | Pillar Sky City | 2220 | 240 | East, white spires on pillars with waterfalls and mist |
| B15 | Jungle Temple | 1860 | 2580 | SE jungle peninsula |
| B16 | Fjord Longhouse | −2280 | −1020 | NW fjord inlet |
| B17 | Glowwood Ruin | −2040 | −300 | West forest |
| B18 | Mother Tree | −1320 | 1800 | SW shore, giant pink-blossom tree |
| B19 | Lantern Cove | −1650 | 2280 | SW harbour with piers and boats |
| B20 | Bridge Pavilions | −60 | 2340 | South end of the causeway (**spawn**) |
| B21 | Tidal Observatory | −2580 | 2760 | SW headland, white domed observatory |
| B22 | Lighthouse | −1920 | 3180 | Rock islet off the south coast |
| B23 | Sea Pavilion | 1620 | 3480 | SE shore, piers out into the reef |
| B24 | Reef Shrine | 2940 | 3120 | SE reef, coral shallows |
| B25 | Crystal Conservatory | −420 | −540 | Just NW of the palace, a glass dome |

**Sky isles** float at 400 to 700 m *(default)* and are reached by sky portals:

| Isle | Name | Over |
|---|---|---|
| I | Crystal Garden | (1560, −1680) |
| II | Aurora Isle | (−3240, −1500) |
| IV | Unicorn Meadow | (2760, 4320) |
| V | Starfall Isle | (−180, −2280) |

Isle III is not drawn, so keep the existing third island as III.

**Terrain:** mountain spine in the north and NW, with forest everywhere inland. Beaches in the coves. Cliffs, sea stacks and reefs on the coast. The Lantern Lake basin is in the south-centre.

## 2. The Princess Palace (sheets 01, 02, 03, 16)

Sheet 03 (Towering Garden Palace, revision 03) is the latest, so **its sizes win**. Sheet 01 gives the massing order and sheet 02 the ornament and palette.

**Size**

| Part | Size |
|---|---|
| South front | 800 m wide |
| Plan | 800 × 680 m |
| Tallest needle spire (central) | 1100 m |
| Two flanking spires | 960 m and 840 m |
| Central pavilion roof | 700 m |

**Massing (sheet 01)**
- A central pink pavilion with a pointed gate, great lancet windows and a gold onion dome.
- Tall needle spires rising out of the pavilion.
- Wings stepping down both sides to domed corner towers.
- An inner courtyard with gardens and fountains.
- Terraced cascades and a grand stair down the south side to the causeway.
- Sheet 01's side heights (800 / 660 / 760 m) belong to the earlier, smaller massing and are superseded.

**Revision 03 additions**
- Every roof level is a garden terrace, with fountains, glass conservatories and waterfalls spilling over the terrace edges.
- A rose-garland parapet runs along each terrace.
- Arch panels sit between the bays.

**Heights:** the owner chose the labelled heights. The B01 build sheet multiplies the drawn heights by 2.75 (`H_SCALE`).

**Gate and windows *(default)*:** scale the v4 rule up with the palace.

| Element | Size |
|---|---|
| Gate | 120 m wide × 220 m tall |
| Great lancets | at least 75% of the gate, so about 90 × 165 m |

The gate keeps its opening leaves and its fractured blue, yellow and purple glass.

**Ornament and palette (sheet 02)**
- Walls in ivory marble and rose marble, trim in muted gold, glass in indigo with multicolour accents.
- **Purple onion domes** with gold finials. Finials are stars, never crosses.
- Indigo banners with gold stars.
- Pink blossom trees on every terrace.
- Detail kit: girih panel, jali rail, lotus capital, crystal lantern (these match A013, A015, A010 and A027 in §4).

**Keep from the castle-front study:** the clusters of arching-out drum towers, bartizans and varied crowns (sheets/castle-front/) dress the 800 m front between the domed corner towers. They give the boundary feeling of U403.

### 2.1 Roof garden court G02 (sheet 16), which is the X01 Palace Roof Garden

- **Placement:** one court of about 120 × 90 m on the main roof terrace, at the foot of the central spires.
- **Edges:** ringed by small purple-domed kiosks and cypresses, with stairs down to the lower terraces on its south side.
- **Three parts:**

| Part | Where | Contents |
|---|---|---|
| West Rose Terrace | West | 18 m wide three-tier lotus fountain in an eight-lobed basin. Rose parterre in round beds. Pink blossom trees in raised planters. |
| North Fountain Loggia | North | Shaded arcade of 3 to 5 pointed arches draped in roses, with a wall fountain inside. Planted parapet. Stairs down to the conservatory. |
| East Conservatory Garden | East | **Mirror pool 30 × 12 m** with lotuses. A long glass barrel-vault conservatory with gold ribs and an orange grove inside. Planting terrace. |

- Walkways are 3 m clear throughout, paved in rose and ivory with **gold eight-point star inlays**.
- **Details to model:** lotus balustrade, flowering-tree stone planter, crystal hanging lantern (1.7 m), curved marble bench with carved back, conservatory gold rib joint (rosette boss), hanging rose garland.
- The sheet's drawn pool and fountain are bigger than their labels. **The labels win.**

## 3. Landmarks (sheets 05 and 06)

Each landmark B02 to B25 has its own elevation, isometric view, plan and swatches on sheets 05 (B02 to B10) and 06 (B11 to B25 plus X01). **Build each one from its own panel.** The world-layout.md §2A buildings with the same names are replaced by these. Keep each landmark within about 6k triangles at Low and bake its fine carving.

## 4. Hero artifacts for the palace (sheet 07)

"Sculpt high, bake low": model each one detailed in Blender, then bake it onto a low mesh.

| Code | Artifact | Where it goes |
|---|---|---|
| A001 | Great Lancet window | Palace front, the main windows |
| A003 | Gate archivolt | The palace gate |
| A010 | Lotus capital | All palace columns and loggia |
| A013 | Girih panel | Wall panels, spandrels |
| A015 | Jali screen (65% open) | Balconies, terrace rails |
| A023 | Bridge rail | The causeway and every lake bridge |
| A027 | Crystal post lamp | Along the golden route and terraces |
| A035 | Lotus fountain | Courts (the same 18 m design as W02) |
| A039 | Scroll bench | Terraces, gardens |
| A043 | Crystal chandelier | Throne hall, loggia |
| A046 | Princess throne | Throne hall (welcome cutscene) |
| A058 | Lotus sky boat | Sky portal transport, lake rides |

## 5. Trees (sheets 08, 09)

| Code | Tree | Height | Canopy | Use |
|---|---|---|---|---|
| T01 | Royal rose-blossom tree | 25 m | 18 m | Courts and terraces, in a carved lotus planter |
| T02a | Cypress | 18 m | narrow | Terrace edges, roof garden |
| T02b | Gold-leaf (ginkgo) | 30 m | wide | Temple hill, gardens |
| T02c | Lake willow | 22 m | weeping | Lantern Lake shore, the lower terrace grove |
| T02d | Coastal pine | 28 m | flat-topped | Headlands, the coast |
| T02e | Avenue tree, white bark | 100 m | wide | Both sides of the golden causeway, about every 60 m *(default)* |

## 6. Water (sheets 10, 11, 12)

- **W01 Lantern Lake**
  - Size: 3.6 km east–west × 1.3 km, 12 m deep at most, south of the palace. B02 and B03 stand on islands.
  - Arched bridges, lotus ghats (stepped landings) at the shore, and floating lanterns at night.
  - The golden causeway crosses the middle.
- **W02 ponds**

| Pond | Size | Edge |
|---|---|---|
| Lotus fountain | 18 × 18 m, 8 m tall | 1.2 m basin wall |
| Mirror pool | 30 × 12 m, 0.65 m deep | |
| Lily pond | 14 × 9 m, 1.5 m deep | 0.2 m edge |

- **W03 open sea and uneven shore**
  - Rolling ocean with the uneven wave profile from the sheet.
  - A beach section running wet sand, dry sand, dunes, then grass.
  - Rock coves.
  - Shore module kit A to F: sandy beach, pebble beach, rock shelf, cliff, reef shallows, harbour wall *(default names; use the drawn modules)*. Tile the coast from these six.

## 7. Gardens (sheets 13, 14, 15)

- **G01 planting kit**, 12 instanced pieces:

| Piece | Size | Piece | Size |
|---|---|---|---|
| Rose bush | 1.2 m | Cream shrub | 1 m |
| Hedge corner | 1 m | Rose garland | 2 m |
| Lotus cluster | 3 m | Lily pads | 1.5 m |
| Reeds | 1.8 m | Fern bank | 1 m |
| Meadow drift | 4 m | Shoreline stones | 2 m |
| Root bank | 3 m | Petals | scatter |

- **G03 Rose Court and Moon Courtyard:** the two inner courts of the palace, with 3 m clear paths, as drawn.
- **G04 terraces and grand approach**, from the palace down to the lake:

| Terrace | Contents |
|---|---|
| Upper | Rose parterre and mirror pool |
| Middle | Fragrant gardens and arcades |
| Lower | Lake ghats and willow grove |

  - Then the Lantern Lake shoreline.
  - Walks are 3 to 6 m clear. Bed edging is 600 mm. Use the paving patterns from the sheet.

## 8. Keeping a 7.5 km world playable on a laptop

- **Stream by district.** Only the district you stand in, plus its neighbours, gets full detail. Everything else is a low far mesh or a billboard impostor.
- **The palace is visible from everywhere,** so it needs three levels of detail:

| Distance | What is drawn |
|---|---|
| Up to 300 m | Full detail |
| 300 to 1500 m | A 20k-triangle massing with baked normals |
| Over 1500 m | A 2k impostor |

- **Same budget as today:** about 300k triangles in view at Low.
- **Instance** every tree, plant and lamp.
- **Fog and atmosphere** hide the far coast.
- **Sky boat (A058) and portal travel** between far districts, so walking 7 km is never required.
- Build order *(default)*:
  1. Terrain, sea and lake at the new scale.
  2. Palace massing at the new size with the golden causeway.
  3. G04 terraces and the G02 roof court.
  4. Hero artifacts.
  5. Landmarks, one district at a time, starting with the lake islands B02 and B03.
  6. The coast kit and the sky isles.
