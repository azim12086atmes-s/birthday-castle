# Sky palace, sky bridge and gate massif (study thread, Oct 17 evening)

The owner asked for this at 19:29: "plateau 500 m to 1000 m in height, along with the bridges ... a high aerial bridge and a grand look, the bridge connecting to the end of the crescent mountains, the other side a large circular platform surrounded in clouds and a large gate within the mountain that opens, with a marble floor; as you go in the white light grows brighter, and when you come out the bridge continues with a waterfall gushing hard in front". The owner chose the south waterfall gate. The owner also asked for sharper, curved plateaus (19:17) and for cliffs on the mountains too.

All numbers below are world metres in the three.js frame (x east, z south, y up, palace at the origin).

## What the data now holds (`data/world` drop-ins from `togame.py`)

### Terrain (`crescent-h.bin`, `outer-h.bin`)

- **Palace mesa**
  - Plateau and upper terrace at 797.5.
  - Middle terrace at 742.5.
  - Lower terrace at 687.5.
- **Rings down to the moat:** 640, 500, 340 and 170. They have lobed spurs and inlets, and in places a ring runs straight down to the water as a 500 m wall.
- **Satellite plateaus**
  - B25, north and east at 640.
  - B32, northeast and west-n at 500.
  - Southeast and southwest at 340.
  - Each one steps down on the same ring levels.
- **Sea stacks:** 350 to 690 m.
- **North shore:** steps at 90 and 170.
- **Gate massif:** it fills the old south gorge. Its crest is about 1090, with snow above 1000.
  - North face at z 10420; south face at z 11880.
  - A 100 m slot is cut through it at y 688 along x = -710.
- **Cloud platform:** a round top at y 688, r 140, centre (-710, 12020), with a sheer rock column down to the sea.

### Placements (`placements.json`)

- **Walls (flag 3):** `CliffWall_*` are sharper now. Each has a jutting cornice under a toothed crest, an undercut, and triangular flutes.
- **Viaducts (flag 2):** `Viaduct_palace_*` are stacked tiered arcades with decks at 640.5, 500.5 or 340.5.
- **Sky bridge:** `SkyBridge_Segment` is placed 34 times end to end, place `sky-bridge`. It runs from the lower terrace's south edge (0, 2420) to the north portal (-710, 10420). The deck is at 688, 24 m wide. Piers rise from y -40.
- **Gate kit (place `gate`, flag 3):**
  - `GateTunnel`: marble floor, lancet vault with gold ribs, and white light panels in three emissive strengths. They are brightest in the middle third.
  - `GatePortalNorth`: the carved frame and landing at the north mouth.
  - `GateDoor`: one leaf of the great south doors.
  - `CloudPlatform`.
- **The old arrival arch** (`Subject_A_commemorat`) moved to the south portal: (-710, 688, 11880), with its back set into the rock as the great gate.

### Walkable pads (`viaducts.json`)

- The satellite viaduct decks are included.
- `SkyBridge` is one long pad at 688.
- `GateTunnel` runs from the north mouth to the platform centre at 688.
- The game's `y0 = y - 10.5` rule still applies.

### Roads (`paths.json`)

- Roads that climbed onto the massif now end at its foot. B32's alleys were lifted whole onto its top.
- New royal entries: `B01 → GATE` is the sky bridge; `GATE → CLOUD` runs through the tunnel.

`cliffs.json` → `sky` has every position: bridge, massif, portals, tunnel, platform, waterfall.

## What the game code needs (Game logic owns this)

1. **Raise the palace.** `palace-raise.patch` (layout.js) sets the following:
   - `PAL1.y` 40 → 290 drawn (797.5 world).
   - Terraces 290 / 270 / 250 drawn.
   - Stairs to match.
   - Lantern Lake carving skipped where the heightmap is above 60 m, because the lake carve was eating the south rings.

   Everything derived from `PAL.y` follows: gate, cascade, portals, palace roofs. B25's pad already follows `crescentH`.
2. **Causeway.** It used to climb to the lower terrace, which is now a 690 m cliff.
   - Suggested: start it at the foot of the south cliff (z0 ≈ 2915, which is 1060 drawn × S) at lake level.
   - Make `causewayY` start at `CAUSEWAY.y` instead of `TERRACES[2].y`.
   - The B02 and B03 branches stay as they are.
3. **Spawn and arrival.** Move `SPAWN` to the cloud platform at (-710, 688, 12020). The arrival scene:
   1. An aerial shot of the platform in its cloud ring.
   2. The great doors swing open: two `GateDoor` leaves, the second mirrored, hinged at x = -710 ± 20.
   3. The walk through the tunnel, with the white light brightening.
   4. Out through the north portal into the waterfall.
   5. The sky bridge to the palace.
4. **Waterfall.** Move the gate.js veil to in front of the north portal.
   - Centre (-710, 520, 10380), facing -z, width 70, from y 1040 down to 0, gushing hard (faster scroll).
   - It parts around the bridge deck when a player is within 150 m.
   - Optional side falls off the north face at about (-1010, 10380) and (-410, 10380), top about 950.
   - The old veil position (z 11250) is now inside the massif: remove it.
5. **Clouds.** Add a ring of mist sprites round the platform: radius 160 to 420, y 560 to 720, drifting slowly, with a few below the deck.
6. **Ships.** The south sea gorge is closed. Ships and sky whales use the north sea mouth.
7. **Sizes.** The new GLBs are uncompressed. Run them through the usual meshopt and WebP pass. `CliffWall_palace_mesa_e` is the largest, at about 12 MB raw.
