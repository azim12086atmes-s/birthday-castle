# Build sheet B02: the Moon Water Palace

**Build 2.** The source is the B02 panel on owner sheet 05 (Landmark Studies A). Magnified crops are in [B02-crops/](B02-crops/):

| Crop | Shows |
|---|---|
| 01 | Front elevation |
| 02 | Isometric |
| 03 | Plan |
| 04 | Material swatches |

**Where:** on its own island in Lantern Lake, west of the golden causeway at about (−630, 1320), facing south. It is joined to the causeway by a lake bridge with A023 rails.

**Scale:** the sheet gives no sizes, so these are measured from the drawing with the outer minarets set 200 m apart. That keeps it clearly smaller than the Princess Palace. **All sizes below are ×1. Multiply every size and its position by the world scale S = 2.75** (owner, 18:42): outer minarets about 550 m apart, finial about 550 m, island centre about (−1730, 3630). Trees, lotuses, rails and lamps stay human-scale.

## 1. Shape (crops 01 to 03)

- **Plan (crop 03):** a cross-shaped (four-lobed) marble platform on the water.
  - The palace stands at the centre on a round court.
  - A long axial water channel runs south from the front.
  - Turquoise pools fill the corners.
  - The whole island edge is a white balustrade.
- **Front, from the water up:**

| # | Part | Size (drawn) | Exact detail from the sheet | Reference pictures |
|---|---|---|---|---|
| 1 | **Water arcade plinth** | 16 m high | Five small round arches at water level, with **one fountain jet** in the centre arch. A white balustrade terrace on top, with gold urns and small lamps on every post. | U279, U283 |
| 2 | **Main block** | about 150 m wide, 70 m to the roofline | White marble. A gold ornamental cresting along the roof with little gold finials. Gold vertical bands frame each bay. | U279, U278 |
| 3 | **Central iwan** (pishtaq) | arch 34 m wide × 51 m tall | A tall rectangular frame with a gold girih border. Inside, a **cusped pointed arch** with a gold, layered hood, and a glowing gold doorway at the back. Gold drops hang at the arch head. | U283, U284 |
| 4 | **Side bays** (2 each side) | arch about 20 m wide | Smaller cusped pointed arches with warm-lit interiors and gold surrounds. Single height. | U283 |
| 5 | **Great dome** | bulb 71 m across, top at 160 m, finial at 200 m | A pearl-white **bulb dome with faint vertical gores**. At its base, a **gold crown of pointed lotus petals with blue jewel insets**. On top, a gold lotus collar and neck, then a tall gold finial ending in a **crescent moon** (it is the Moon palace; drawn as a crescent). Below it, a drum with a gold frieze band and small arched niches. | U279, U390 |
| 6 | **Chhatri domes** (×4) | 27 m across | Small white bulb domes with gold finials on open octagonal drums with arched openings. Two flank the great dome, and two sit on the outer corners. | U279 |
| 7 | **Inner minarets** (×2) | 160 m | Slim white round shafts with 2 balcony galleries on gold brackets and a small bulb cap with a gold finial. | U280 |
| 8 | **Outer minarets** (×2 at the front corners, plus 2 at the back) | 190 m | Like the inner ones but taller, with **3 balcony galleries**. | U278, U280 |

## 2. Water and planting

- **Reflecting pool** in front, about 200 × 120 m *(default)*.
  - Clear turquoise with **pink lotus flowers and lily pads** along both edges, and a fountain in the middle.
  - A gold-trimmed marble edge.
  - Use the W02 lily pond and the G01 lotus cluster and lily pads.
- **Along the pool and terrace:** dark **cypresses** (T02a) in pairs and **palm trees** in planters.

## 3. Materials (crop 04, left to right)

| Swatch | Use |
|---|---|
| Pearl-white marble | Walls, domes, minarets |
| Turquoise water and tile | Pools, channel lining |
| White jali lattice | Balustrades and window screens (A015, about 65% open) |
| Gold girih | Iwan border, friezes |
| Veined grey-white marble | Paving |
| Pink lotus | Water planting |

At night, the arches glow warm gold, and the dome reflects in the pool.

## 4. How to model it

- **Lathe:** the dome, the chhatris and the minaret stages are all lathe (revolve) profiles. One profile each, instanced.
- **Petal crown and cresting:** one gold petal and one cresting unit, repeated round the dome and along the roof.
- **Baked into a trim sheet:** iwan borders, jali and girih.
- **Budget:** about 25k triangles near, 4k mid, an impostor far. The reflection comes from the existing lake mirror.

## 5. Check against the sheet

Compare a front render with crop 01:
- The crescent finial is the highest point, and the outer minarets come next.
- The chhatri count, the five plinth arches with the centre jet, and the lotuses along the pool.
