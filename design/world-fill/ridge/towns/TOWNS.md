# Dense towns (study thread, Oct 17 evening)

The owner said the world "looks very small" next to Golden Thread and has "a lot of flat land". GT is 3.5 × 2.8 km; our map is about 30× its area. Ours reads small because each place sat on a flat disc up to 825 m wide with a handful of models about 100 m apart. So the fix is density and relief, not more kilometres.

## What changed (data from `togame.py`)

Ten Grand Path places are now compact towns: B12, B20, B21, B02, B06, B18, B04, B07, B08 and B26.

- **Layout.** Each town has:
  - a plaza round its hero model, with stalls and the place's one-off models facing in;
  - main streets out to every road;
  - side lanes;
  - ring lanes 34 m apart;
  - 100 to 200 houses 2 to 6 m apart, facing the streets;
  - lanterns down the lanes.
- **Ground.** It is flat only out to the town edge (`towns.json` `r`, 136 to 225 m). Past that, terraced hills rise 15 to 80 m between the road exits. Roads and trails keep a 20 m clear strip.
- **Houses.** They use the place's own house models, or a style pool at natural size where a place had too few: medieval, asian, classical, coastal, forest or mountain.
- **Light copies.** `*_town` models are 14k-tri copies of the house set; `Stone_Lantern_town` is 2.5k. They have the same look, UVs and textures. They are in `data/world/near` with `tier: "landmark"`, so a whole town stays 3D models out to 450 m (cards only beyond that). They have 8-view cards in `data/world/cards`.
- **Item tags.** Town items carry `town: hero | plaza | house | lantern`.
- **Streets.** They are `paths.json` alleys with `from_ = place` and `to = main | lane | ring`, and they replace that place's old alleys. Plaza radii are in `plazas`.

## Along the roads (`roadside.py`, place `roadside`)

There is a feature about every 420 m along every road: 59 hamlets of 3 to 6 houses facing the road, 22 farms with a windmill, 36 ruins with fallen pillars and rubble, and 48 rock outcrops (none in the gate massif, tunnel, cloud platform or under the sky bridge). About 1,150 small rocks line the verges every 90 m. Items carry `town: hamlet | farm | ruin | outcrop | verge`. The rocks and ruins are 9k-tri `*_town` copies too. The ground is not reshaped; each building sits at the lowest corner of its footprint. Sites are listed in `roadside.json`.

## What the game code needs (Game logic owns this)

1. **Shrink the pads.** In `layout.js`, a place listed in `data/world/towns.json` must use that file's `r` and `e` (world metres) instead of `pad.r * S` and `pad.e * S`. Otherwise the old 550 to 825 m discs flatten the new hills again. The local test used:
   ```js
   const TOWN_PADS = { B12: { r: 195.2, e: 60 }, B20: { r: 215.8, e: 60 }, ... };  // from towns.json
   pad: { r: TOWN_PADS[k]?.r ?? s.pad.r * S, ..., e: TOWN_PADS[k]?.e ?? s.pad.e * S }
   ```
2. **Compress the town models.** Run them through the usual meshopt and WebP pass into near-hd. Keep `tier: "landmark"` so no house in a town is drawn as a flat card while you stand in or beside it (the owner noticed the cards at 300 m).
3. **Fix the street colour.** Town streets render near-black or dark blue at night and in the afternoon (the `alley` cobble material in `paths.js`). They should read as warm stone, like the roads.
4. **Low quality option.** On Low, consider drawing `town: house` items only within 150 m and skipping the verge rocks. There are about 1,300 town houses, 300 roadside houses and 1,250 verge rocks in all, though only one town is ever near.

`towns.json` per place: `x, z` centre, `r` pad radius, `e` blend, `y` town height, `plaza` radius, `houses`, `lanterns`, `style`, `exits_deg`.
