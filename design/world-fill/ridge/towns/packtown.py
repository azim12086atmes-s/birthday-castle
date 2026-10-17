"""Far cards for the town copies: reuse the original model's card where there is one, else pack the new renders
(out/towncards/<m>_town/v0..v7.png) into 2048x256 strips. Writes out/towncards-pack/<m>_town.webp + index.json."""
import json, glob, os, shutil
from PIL import Image
O = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/ridge/out'
C = '/home/user/birthday-castle/design/world-fill/cards'; OUT = f'{O}/towncards-pack'; os.makedirs(OUT, exist_ok=True)
J = json.load(open(f'{C}/index.json'))['cards']; idx = {}
for f in sorted(glob.glob(f'{O}/townkit/*_town.glb')):
    tm = os.path.basename(f)[:-4]; m = tm[:-5]
    if m in J and os.path.exists(f'{C}/{m}.webp'): shutil.copy(f'{C}/{m}.webp', f'{OUT}/{tm}.webp'); idx[tm] = J[m]; continue
    d = f'{O}/towncards/{tm}'
    if not os.path.exists(f'{d}/card.json'): continue
    c = json.load(open(f'{d}/card.json')); W = Image.new('RGBA', (2048, 256), (0, 0, 0, 0))
    for k in range(8): W.paste(Image.open(f'{d}/v{k}.png'), (256 * k, 0))
    W.save(f'{OUT}/{tm}.webp', quality=86, method=6)
    idx[tm] = {k: round(v, 5) if isinstance(v, float) else v for k, v in c.items() if k not in ('model', 'views')}
json.dump(idx, open(f'{OUT}/index.json', 'w'), indent=0); print('town cards', len(idx))
