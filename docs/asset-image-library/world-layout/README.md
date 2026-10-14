# WLD-MAP-001 — Starlight Coast world layout

[Open the labelled top-down planning image](WLD-MAP-001.png) · [One-image gallery](index.html) · [25 location IDs/coordinates](locations.csv) · [Per-location kit plan](kit-plan.csv) · [Layout/routes/terrain JSON](layout.json)

The plan retains the existing **7.5kmx7.5km expanded envelope**,25 B01–B25 landmark families and six S01–S06 sites. It adds8 terrain-kit region groups, primary/secondary routes, one principal curved bridge route with reused B20 pavilions, boat connections and a sky-boat/portal network. Open beaches/coves/sea replace a mountain enclosure; fjord/misty highlands stay localized. Calm Lantern Lake is separate from the southern tidal Moonwater basin. Uneven sea wave/foam appearance is a design direction, not a built water simulation.

B01 is a **working2.2x1.87km palace reservation**, not a new palace design. GEN-37 controls the facade; castle roof/wing/tower geometry remains unresolved. [Recorded source/coordinate conflicts](SOURCE-AUDIT.md) explain proposed B17/B18/B25/B11 relocations and preserve legacy placements unchanged.

The image is diagrammatic, not a measured plan. Its symbols and coastline are not proven to match JSON coordinates or sizes pixel-for-pixel; the palace's printed reservation size should not be measured from the drawing. Basic coordinate bounds/footprint-overlap checks cover only the proposed rectangular envelopes. Shore support, water levels, terrain grade, route clearance, altitude and collision remain unverified.

[Next production sequence and caps](KIT-SEQUENCE.md): B02 Moon Water Palace source audit first, then missing architecture modules and shared regional foliage/natural/object kits. Existing GEN-05/06 illustrate the other building families; those are partial references rather than complete model kits.

## Label inventory

| ID | Location | Region |
| --- | --- | --- |
| B01 | Princess Palace | T01 |
| B02 | Moon Palace | T02 |
| B03 | Star Chapel | T02 |
| B04 | Rose Keep | T01 |
| B05 | Misty Keep | T06 |
| B06 | Pagoda | T06 |
| B07 | Temple Hill | T06 |
| B08 | Colosseum | T06 |
| B09 | Lagoon City | T03 |
| B10 | Canyon Palace | T07 |
| B11 | Crescent Arch | T07 |
| B12 | Storybook Village | T05 |
| B13 | Windmill | T05 |
| B14 | Pillar City | T06 |
| B15 | Jungle Temple | T04 |
| B16 | Fjord Longhouse | T06 |
| B17 | Glowwood Ruins | T05 |
| B18 | Mother Tree | T05 |
| B19 | Lantern Cove | T03 |
| B20 | Bridge Pavilions | T02 |
| B21 | Tidal Observatory | T03 |
| B22 | Pearl Lighthouse | T03 |
| B23 | Sea Pavilion | T03 |
| B24 | Reef Shrine | T03 |
| B25 | Conservatory | T01 |

## Review and limits

R01 was an oblique panorama with standing buildings and inconsistent coordinate ticks. R02 replaces standing buildings with overhead site symbols, uses local hill contours, adds more low beaches and removes the erroneous grid. Both outputs are preserved.

B01–B25 and S01–S06 labels are visually present; T01–T08 are defined in region inventory/legend. This label review is not automated spatial/geometry validation.

The drawing remains diagrammatic: marker positions, footprint sizes, coastline and bridge-pavilion instance counts are not proven to match layout.json pixel-for-pixel. In particular, the B01 footprint drawing does not visibly establish its printed2.2x1.87km size relative to the whole envelope. Use that value as a proposed reservation, not as a measurement from this image.

The main palace reservation does not redefine GEN-37 facade, tower placement, height, stepped wings or roof courtyards. Legacy height/footprint mismatches are recorded; palace geometry remains unresolved separately.

Old coordinate conflicts are explicitly proposed relocations for B17/B18/B25/B11. Sky coordinates are horizontal projections only; S03 is an inland lake. No altitude/access/shoreline support geometry is validated.

Route lengths are proposed polyline arithmetic, not navigation/collision/terrain-grade or hydrological results. Sea waves are a design appearance, not a tested shader/simulation.

Existing GEN-05/06 boards cover other-building vocabulary; no complete architectural kit, foliage mesh, natural-object mesh or world build is produced here.

One additional selected map slot: **83 selected sheets saved,86/230 selected/reserved**. Palace remains65/65;21/165 world slots selected/reserved. No new model targets or 3D assets. Original source and rejected first draft remain archived.
