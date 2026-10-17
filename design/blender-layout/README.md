# Blender world layout, 20 km plan (2026-10-16)

A blockout of the whole Starlight Coast in Blender 5.2 (opens in recent Blender versions), at the owner's 20 km scale (S = 2.75): [castle-world-layout-20km.blend](castle-world-layout-20km.blend), 3.5 MB. Units are metres, north is +Y, the palace is at the origin facing south.

| Image | Shows |
|---|---|
| [compare-map-vs-layout.jpg](compare-map-vs-layout.jpg) | Your map (left) beside the layout plan view (right), same extent |
| [layout-plan.jpg](layout-plan.jpg) | Plan view |
| [layout-oblique_south.jpg](layout-oblique_south.jpg) | The whole island from the south |
| [layout-palace_south.jpg](layout-palace_south.jpg) | The palace massing from the causeway |

## What is in the file (collections)
- **00_Terrain:** coastline and relief traced from your map (sheet 04), coloured from the map; the sea plane.
- **01_Palace_B01:** massing only: 2200 × 1870 m footprint, four tiers, four corner towers, the great dome west of centre, three spires at 1100, 960 and 840 m, the cone pavilion, the gate and the cascade stair.
- **02_Landmarks:** B02 to B25 as footprint boxes at their map positions. Footprints come from the map's locations list × 2.75. **Heights are placeholders.**
- **03_Routes:** the golden causeway (70 m wide) from B20 to the gate, schematic secondary paths, the boat route, and the sky-portal lines.
- **04_Sky_isles:** I, II, IV and V floating at 1300 to 1900 m. Isle III is not on your map, so it is missing.
- **05_Meshy_kit_markers:** a magenta cube and pole per Meshy model, at its planned place and target size (see assets/meshy-2026-10-16/KITS.md). They are markers only; the models are not imported.
- **06_Labels:** names.
- Three cameras: plan, oblique_south, palace_south.

## Limits
- The coastline is read from the picture by colour, so it is ±150 m and some small islets and rivers are missing. Mountains and heights are rough guesses from the map's colours, not designed terrain.
- Paths join places in straight lines and ignore water and slope. The boat route is schematic.
- The Meshy models are not placed. They need the models imported at their target sizes.
- Rebuild with `make_layout.py` (needs the `bpy` module, numpy, scipy and pillow). It reads sheet 04 from the project folder.
