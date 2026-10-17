# Reference link log

Status of every link the owner shared (as of 2026-10-10). Feeds [reference-table.md](reference-table.md).

**Why no images yet:** the cloud machine's network allowlist blocks every one of these sites and their image CDNs, and the in-session web reader returns text only (it cannot see pixels). Image URLs were collected into [image-manifest.tsv](image-manifest.tsv) (104 images). Running `python download_images.py` in `projects/castle-references` on the owner's computer saves them to `images/`, after which each can be viewed and the table upgraded to basis "image".

## Read (text, captions, image URLs)

| Page | Status | Rows |
|---|---|---|
| exp-points: Julia Cui, Magic Moorland | read, 42 image URLs | S1 S4 S5 T8 F3 F4 B5 B6 O4 O6 C2 C3 |
| kidswithsticks: Ghibli in UE4 | read, ~40 image URLs | A2 S2 S5 T2 F1 F2 F6 C5 P6 |
| exp-points: Pedro Damasceno | read, 10 image URLs | A2 S2 T6 P1 |
| gamesartist.co.uk: Remains | read, no image URLs exposed | S4 F4 F5 B1 C6 |
| 80.lv: vast landscapes | read, cover only | S6 T3 T4 T7 F7 F8 |
| 80.lv: lost civilization | read, cover only | B2 O1 O2 O3 P8 |
| 80.lv: stylized trend | read, cover only | C1 C4 P2 |
| 80.lv: stylized VR world | read, cover only | B5 B13 P2 P3 P7 |
| 80.lv: concept 2D to 3D | read, cover only | (workflow only) |
| 80.lv: Stray art dump | read, captions only | (cyberpunk, low relevance) |
| 80.lv: Catalonia town | read, video only | B3 B4 B5 B6 F9 T4 |
| 80.lv: twisting reality | read, cover only | S7 B8 O5 C7 |
| 80.lv: painterly 3D world (from WebFetch test) | read, cover only | S4 C2 C4 C7 |
| creativebloq: Blender cinematic tricks | read, 15 image URLs | T9 B7 C1 |
| creativebloq: Hyper Light Breaker | read, 13 image URLs | A4 F1 |
| creativebloq: Halo landscape | read, 2 image URLs | S6 |
| Inspiration Grid: 15 most beautiful games 2025 | read, ~100 image URLs (subset in manifest) | A5–A9 |
| naokotakamoto.com/magic (Keeper) | read, 53 image URLs | A5 |
| ArtStation: Jan Golmic, OWL Studio, Roberto Ricci, AAA Game Art Studio, LuoYuewen, Pear Lili, Gliulian, OK Productions, HS Choi | read via project data, all image URLs | A11 T2 T5 B9 B11 C1 |
| zeldadungeon: games that defined Switch ("clouds are good") | read, 11 image URLs | A1 S1 |
| gameluster: Zelda U concept | read, 2 image URLs | A1 T1 |
| artofdesignonline: BotW | read, images missing on page | A1 T1 |
| Epic Games Store: Split Fiction | read, 5 image URLs (not yet in manifest) | A9 |
| Medium: Genshin design | read, thumbnail only | A3 |
| PC Gamer: Biomutant review | read, no image URLs | A12 F10 |
| vsquad: 2D environment | read, 26 image URLs | B10 B11 B12 |
| argentics: environment concept art | read, 9 image URLs | (in manifest) |
| 300mind: environment design | read | (general principles) |
| pinglestudio, wingfox, ilogos, meliorgames, retrostylegames best art style | read | A10 |
| stockvault: game concept art | read, 10 image URLs | (in manifest) |
| cghero: 2D buildings | read, only cover image | none |

## Blocked

| Page | Reason |
|---|---|
| All reddit.com threads (FFXVI, Palworld, MMORPG, BotW, TotK x2, Biomutant, Satisfactory, Avowed, gaming, DigitalArt) | site blocks automated reading |
| pcmag: Blade & Soul NEO | blocked |
| japan-forward: TotK as art | blocked |
| YouTube _jLGxlsVvos and 7lci5iNxu-Q | reader rate-limited; thumbnails are in the manifest |
| behance (gallery + search), instagram, facebook, pinterest | blocked or login-only |

## Not read yet (lower visual value)

Pages still to try: creativebloq "what is concept art", creativebloq "combine software", creativebloq "strange character design", artstation blogs (pixune, vertex school), aaagameartstudio 3D/2D, juegostudio cohesive worlds, retrostylegames modeling, lugher3d, unrealengine tech blog, vertexschool trends, pngtree, vecteezy, dribbble gaming UI, resetera pixel art, artbully shop, inspirationtuts.

## Skipped as not visual

The Rookies school rankings (x2), Academy of Art pages (x2), theartcareerproject, Escape Studios, SAE careers, Independent (esports drug testing), gamedevmentors listing, reddit job/hire posts (x3), cgspectrum art vs design, uxdesign.cc, esquiresg AI games, Unreal forum level-design question, Adobe/Shutterstock search pages, polycount services, questfox and retrostylegames outsourcing pages, juegostudio UX.
