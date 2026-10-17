# The Long Bridge: magical glossy white, fractal patterns, neon ripples, carved see-through railing

The owner asked for this on 2026-10-11. The bridge is the 800 m curving entrance from Lantern Cove to the castle, and its position and size are set in [world-layout.md](world-layout.md) §4. This file designs its look, its detail and its magic.

**Blender render (2026-10-11):** [bridge_railing_render.png](blender/bridge_railing_render.png) shows the first carved railing module repeated along a glossy white fractal deck, with five neon footstep ripples lighting the fractal lines.
- **Files:** the model is [bridge_railing_module.glb](blender/bridge_railing_module.glb), the scene is [bridge_railing.blend](blender/bridge_railing.blend), and the script that builds both is [railing.py](blender/railing.py). They were made with Blender 5.2 running headless in the cloud.
- **Detail:** the module is carved at full detail, about 38k triangles. It has:
  - pierced quatrefoil and 8-point-star roundels with gold ring mouldings
  - flame-shaped corner openings
  - an arcaded plinth with a bead-and-reel strip
  - an ogee handrail with a gold line
  - a post with a 12-petal rosette and a ring of acanthus leaves
  - a crystal lantern
- **Next step:** bake this full-detail module onto the light game version described in §4.

## 1. Look in one line

The bridge is pearl-white and glossy like wet porcelain, with gold-white fractal lacework set into every surface. Its stone railing is carved so finely that it reads as lace, and the lake shows through it. Each footstep sends a ring of neon colour racing along the fractal lines and out across the water.

## 2. Material: glossy white with fractal patterns

- **Base:** white marble with a porcelain sheen.
  - Colour `#f7f2f4` with a faint pink-lilac tint `#f3e8f0` in shade.
  - Low roughness (0.12) with clear-coat, so the moon, lanterns and castle glow make long soft highlights on the deck.
  - In the game this is MeshPhysicalMaterial with clearcoat 1 and roughness 0.12. Real-time reflection is not used. The highlights come from a small baked environment map of the night sky, the castle and the moon, which costs almost nothing.
- **Fractal inlay:** fine gold-white lines (`#fff1d0`, very slightly emissive) cut into the deck, the parapet tops and the arch faces. Three patterns are used, each with its own origin in the pictures:
  - **Girih star fractal** on the deck: 8-point and 10-point stars, each subdivided into smaller stars twice, as on the castle girih bands (U181, U274, U283).
  - **Koch-snowflake rosettes** on every pier face, about 6 m across, three levels deep (crystal and ice motifs from U125 and U126, rose windows from U160 and U198).
  - **Branching lace** on the arch soffits, a fern-like tree fractal that looks like frost on the underside (root and branch forms from U29, U108 and U241).
- **How it is made:** each pattern is one tiling texture with three maps:
  - **height/normal**, so the lines are really cut in and catch the light
  - **line mask**, used by the ripple effect
  - **gold tint**

  They are made once, procedurally (Blender or a script), and tiled along the bridge.

## 3. Neon ripples when you step

- **What you see:** every footstep on the deck releases a glowing ring that spreads from the foot.
  - The ring lights only the cut fractal lines it passes over, so the pattern flashes into colour and fades.
  - Each step uses the next colour in a cycle: neon green `#39ff88` → blue `#3ab0ff` → purple `#b45cff` → yellow `#ffe14a` → pink `#ff4fb8`.
  - Rings spread at 6 m/s, last 1.8 s and fade from the inside out.
  - Where a ring reaches the railing it climbs the carved tracery and runs off the rail, then drops as a matching ring onto the lake below.
- **Everyone's steps ripple.** With several friends on the bridge, the deck becomes a moving light show. During the midnight celebration the whole bridge can pulse in slow waves on its own.
- **How it works (cheap):**
  - The deck shader keeps the last 24 step positions and times, sent in as uniforms.
  - For each pixel it draws a ring where (distance from the step) is close to (speed × age).
  - That ring is multiplied by the fractal line mask and added as emissive.
  - The lake shader uses the same list to draw rings on the water and bend the reflection slightly.
  - There are no extra lights or particles. Bloom does the glow.
  - A few tiny sparkle particles per step are optional on Medium and High.
- **Sound:** a soft glassy chime per step, its pitch following the colour cycle.

## 4. The railing: intricate, see-through, classically carved

The railing is a pierced stone balustrade, so most of it is open and the lake is always visible between the carvings.

| Part | Size | Carving | Sources |
|---|---|---|---|
| **Pier post** every 4 m | 0.6 × 0.6 × 1.5 m | Square post with a sunk panel carrying a fractal rosette; acanthus-leaf capital; on top, a small crystal lantern on a gold stem (every 5th post a taller 4 m lamp standard) | U154, U155, U338 (lamp posts), U81 (capitals) |
| **Pierced tracery panel** between posts | 3.4 m × 1.1 m | Openwork panel: a row of quatrefoils in circles, flamboyant mouchettes (flame-shaped) between them, and an 8-point star at the centre. About 65% open. | U72, U77, U84, U192 (gothic tracery); U283, U284 (jali screens) |
| **Bottom rail / plinth** | 0.25 m high | Bead-and-reel moulding with a run of small arches (arcading) cut through it, so light passes at deck level too | U261, U351 (balustrade bases) |
| **Handrail** | 0.3 m wide | Ogee-profiled cap, glossy white with a fine gold line along its crown; the neon ripples travel along this line | U128 (scroll ironwork), U190 |
| **Pavilion screens** at the two pavilions | 3 m tall | Full-height jali screens (hexagram lattice) and cusped arches | U283, U292, U274 |

**How it is built:**
- One railing module (post plus panel) is carved in **Blender** at full detail. That model is baked down to a light game model:
  - a few hundred triangles
  - an **alpha-cutout** mask for the openwork, so it stays see-through
  - normal and AO maps that carry the carving depth
- It is instanced about 400 times along both sides, roughly 3 draw calls.
- Near the player the panels are real cut geometry. Further away they become the baked cutout card.

## 5. Arches, piers and lamps

- About **40 arches** of 20 m each, in two tiers like an aqueduct.
- Arch faces carry a cusped (lobed) edge with a gold piping line.
- Spandrels have Koch rosettes, and soffits the branching lace.
- **Piers** have cutwaters (pointed noses) on the upstream side. At water level each has a ring of floating lotus lanterns.
- **Lighting:** crystal lanterns on every post glow warm `#ffd6a0`; the lamp standards are pink-white.
- **Underneath:** the arches glow softly from below by reflected light. They are reflected in the lake together with the castle, using the same mirrored low-detail copy as the castle reflection.

## 6. Pavilions on the bridge

These are the two domed pavilions from world-layout §4.
- **Columns:** white with gold acanthus capitals.
- **Dome:** a glass dome with gold ribs.
- **Sides:** jali side screens and a seat ring.
- **Centre:** a water basin in the middle, whose surface ripples in neon when touched.
- **First pavilion** (about 300 m): the side spur to the Moon Palace.
- **Second pavilion** (about 550 m): the best photo spot for the castle and its reflection.

## 7. Laptop budget for the bridge

| Item | Triangles | Draw calls |
|---|---|---|
| Deck and arches (one arch module × 40) | 16k | 2 |
| Railing (module × 400, LOD) | 12k near | 3 |
| Lanterns and lamp standards | 4k | 2 |
| Two pavilions | 6k | 2 |
| **Total** | **≈ 38k** | **9** |

This is about 18k more than the 20k set in world-layout §11, taken from the "other areas" share while the player is on the bridge, since those areas sit in fog then. The ripple effect is a shader cost only, with no extra draw calls.
