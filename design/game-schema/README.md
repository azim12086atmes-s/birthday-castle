# Game schema

The single source of truth for what is in Birthday Quest. The game code, the design docs and every Claude session follow it.

| File | What it is |
| --- | --- |
| `game.schema.json` | The rules of the data: every kind of thing in the game, its fields and allowed values (JSON Schema 2020-12) |
| `game-data.json` | The game itself, filled in: 32 places, 35 characters, 42 creatures, 8 pets, 8 rides, the Mew, 8 game templates, weapons, outfits, the five acts, the clock to midnight, 10 cutscenes, captures, music, sky layers, assets, quality tiers |
| `build_data.py` | Rebuilds `game-data.json` from the story doc tables and checks it (schema valid, no broken ids) |

## How the pieces connect

```
place (B01-B32) ── head ──────────> character
      │ ├─ creatures[] ─────────> creature (eyes: false, always)
      │ ├─ boss ────────────────> creature (kind: boss)
      │ ├─ game / challenge ────> template (8) + params
      │ ├─ shard (1-32), schedule (night | week_before | optional), order on the night
      │ └─ assets[] ────────────> asset (Meshy model, web-pack tree, Golden Thread code, procedural)
player ── ride ──> ride      player ── pet ──> pet ── creature ──> creature
story.acts ── cutscenes ──> cutscene      clock.timeline ── phase ──> clock.phases
```

## Conventions

- **Ids:** lower case with underscores (`star_fox_pet`); places keep their B-codes (`B07`). Every link between things uses ids, never names.
- **World frame:** metres, origin at the palace (B01), x east, z south (north is −z), y up. Map distances are the sketch values ×2.75 (the 20 km map). Only the palace is enlarged; Meshy models keep their natural size.
- **Status** on places, characters, creatures and templates: `idea → designed → building → done`, so anyone can see what is left.
- **Rules** (`rules[]`) are checked by the schema where possible: creatures have `eyes: false`, outfits have `modest: true`, `female_only` outfits are never drawn for male accounts.
- **The night:** 14 places have `schedule: "night"` with an `order` (the Grand Path, ending at the palace); the other 18 open the week before. The owner can move places between the two.

## Still to fill (waiting on the owner)

`meta.honoreeName`, `players[]` (friends, their rides and pets), `mew.eyes`, music sources, and the B26-B32 map positions once the crescent terrain is made.
