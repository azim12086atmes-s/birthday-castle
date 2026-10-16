# Meshy models grouped into kits (owner, 2026-10-16)

**What this is.** The owner's 25 Meshy zips (21 distinct models) sorted into five kits for terrain, monumental relics, bridges and walls, trees, and buildings. The owner said recolouring and tweaking is fine, so each row says which direction to recolour. Kits are for **Unreal Engine 5** (the owner's 08:38 direction), so the old web triangle limits do not apply: Nanite takes the heavy meshes as they are.

**Read this first**
- My previews are rough point renders at two angles ([contact sheets 1 to 3](contact-sheet-1.png)). What each model is below is my best reading, marked *(unsure)* where a preview was unclear. Check in a real viewer before use.
- Duplicates: `Classical_Sculpture_C` zips ×2 and `Gothic_Cathedral` zips ×2 have identical checksums. `Gothic_Cathedral` also matches the earlier intake item UPL-761E04C7346A on the image-library branch. `stone_henge` has the same triangle count (447,406) as that intake's UPL-74F4D19C5CE3, so it is probably the same.
- All models are normalised to about 2 units across, with no real scale. Scale each one on import so its longest side matches the "target size" column. Sizes marked *(default)* are my guesses; the rest come from the map's `locations.csv` or the cottage plan.
- **Map mismatch to settle.** The image-library branch has a 12 km world with the palace 2.5 km wide (that is the 800 × 680 m drawing at 3.125×). My plan has about 20 km and 2.2 km wide (2.75×). The B-codes match in both, but the coordinates do not. This catalogue uses B-codes only.
- **Eyes rule.** Koi and the sculpture lions may have painted or carved eyes. Check and recolour or veil before use.

## Kit 1: Terrain and garden ground

| Model | Triangles | What it is | Where it goes | Recolour or tweak |
|---|---:|---|---|---|
| Stone_Portal | 2,620,044 | Mossy rock mass with a hollow top | Cliff and outcrop pieces for T06 fjord ridges and T07 canyon, near B10 and B11 | Sand-rose for the canyon, blue-grey for the fjord |
| Lantern_Gate_to_the_S | 914,312 | Dark rock mound with a stair and lantern gate *(unsure)* | B19 Lantern Cove gatehouse, or B16 Fjord Longhouse | Lighten the rock; keep the lantern glow |
| Koi_Pond_with_Stone_B | 1,344,698 | Rock-edged koi pond with a small wooden bridge | Water garden at B02, the palace lower terrace (G04) and Moonwater gardens, about 12 m *(default)* | Lotus pink instead of orange; check koi eyes |
| Enchanted_Garden_with | 1,937,902 | Round garden disc with pink trees, a path and a pond | Base for Sky Isle I Crystal Garden, or G03 Rose Court | Palace rose and ivory paving |
| An_english_country_co | 1,223,968 | Cottage garden on a mossy rounded island, with a pond | Forest clearing FC01 to FC08, or the base of Sky Isle IV Unicorn Meadow | Plum and cream, pink blossoms |
| Enchanted_Garden_Gate | 94,960 | Round mass of leaves and pink and purple flowers *(unsure: a garden gate or hedge)* | Planting kit G01 hedge and meadow drift, copied many times | Rose and cream flowers |

## Kit 2: Monumental relics

| Model | Triangles | What it is | Where it goes | Recolour or tweak |
|---|---:|---|---|---|
| stone_henge | 447,406 | Standing-stone circle | Ruin Meadows, B17 Glowwood Ruins; about 40 m across *(default)* | Warm grey-pink; keep the moss |
| Celestial_Armillary | 1,287,765 | Gold armillary sphere with a purple and blue crystal inside | The palace court monument, B21 Tidal Observatory; about 18 m across *(default)* | Rose-gold rings, moon-blue crystal |
| The_Arcane_Gateway | 1,831,098 | Mossy floating ruin with blue portal rings on top | Sky portal gates to the four sky isles | Blue rings to palace cobalt |
| Classical_Sculpture_C | 1,322,933 | Six carved pieces: 2 urns, 2 round carved lids, 2 crouching lions | Court urns, A010 and A023 finials, gate guardians. Split into six parts on import | Rose marble; **veil or remove faces** |
| Yuki | 301,621 | Flat white lotus with dark gems in the centre | Lotus dais under A035 fountains, lotus sky boat landing | Nacre pink with gold |

## Kit 3: Bridges, walls and rails

| Model | Triangles | What it is | Where it goes | Recolour or tweak |
|---|---:|---|---|---|
| Stone_Serenity_Bridge | 910,856 | Mossy stone bridge with columns and a curved parapet | Lake bridges and canal bridges at B09 and B12 | White glossy marble with fractal inlay (the owner's bridge spec) |
| Ancient_Stone_Arch_Br | 230,461 | Long low mossy stone span | Long causeway segments, aqueduct-style runs | Same white marble |
| Gothic_Iron_Fence | 528,648 | Three flat gothic iron panels | Terrace and garden fences, G04 | Gold and white, to match A015 and A023 |

## Kit 4: Trees

| Model | Triangles | What it is | Where it goes | Recolour or tweak |
|---|---:|---|---|---|
| Ember_Tree | 1,584,730 | Twisted trunk with a gold-orange canopy | T02b gold-leaf tree (30 m), temple hill and gardens | Keep gold; lighten |
| Copper_Cloud_Bonsai | 791,540 | Cloud-pruned bonsai with an orange canopy | Terrace planters, B06 pagoda and B05 keep gardens | **Pink blossom** for the royal terraces |

## Kit 5: Buildings

| Model | Triangles | What it is | Where it goes | Recolour or tweak |
|---|---:|---|---|---|
| Medieval_Cottage | 1,650,197 | Timber-framed house with an orange tile roof | B12 Storybook Village and the forest cottages, 12 × 9 m footprint (from the cottage plan) | Plum roof, cream plaster |
| Mosswood_Teardrop_Hou | 87,362 | Teardrop dome house covered in moss | B12 and Glowwood cottages | Keep |
| Mediterranean_Villa | 1,451,172 | Villa with an orange roof and yellow walls *(unsure: roof layers overlap)* | B09 Lagoon City houses | Cream walls, teal roof |
| Vintage_Stone_Villa | 4,306,720 | Brick villa with a planted roof | Canyon or village outskirts, B10 | Heavy; use one |
| Gothic_Cathedral | 29,669 | Twin-spire gothic shell | **B03 Star Chapel** (100 × 160 m) | Navy slate roofs, violet glass |
| Cathedral_Render | 4,694,288 | Grey stone cathedral on a half-disc base | Alternative for B03, or the temple hill | Rose-grey stone |
| Leafspire_Cathedral | 104,874 | Leaf-shaped hall with a curved shell wall and gold and teal floor | B17 Glowwood Ruins or B25 Crystal Conservatory *(unsure)* | Pink and gold |

## In Unreal
- Import the FBX at the target size (Unreal counts in centimetres). Turn on Nanite for the heavy statics, and use simple collision, not the render mesh.
- Each zip has a 2048 px colour atlas plus normal, roughness, metallic and emission maps. Make one master material with a hue and saturation control, so each recolour is a material instance, not a new texture.
- Hold the owner's rules: no eyes, veiled or faceless statues, modest dresses.
- Files: this folder; stats in [stats.json](stats.json). Zips stay in `/mnt/project-files/`.
