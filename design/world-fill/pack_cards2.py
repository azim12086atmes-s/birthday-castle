"""Pack each model's 8 card views into one strip atlas (2048 x 256 WebP with alpha) and write cards/index.json."""
import json, glob, os
from PIL import Image
F = '/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/fill'
OUT = f'{F}/cards2-pack'; os.makedirs(OUT, exist_ok=True)
index = {}
for d in sorted(glob.glob(f'{F}/cards2/*/card.json')):
    c = json.load(open(d)); m = c['model']; src = os.path.dirname(d)
    W = Image.new('RGBA', (256 * 8, 256), (0, 0, 0, 0))
    for k in range(8): W.paste(Image.open(f'{src}/v{k}.png'), (256 * k, 0))
    W.save(f'{OUT}/{m}.webp', quality=86, method=6)
    index[m] = {k: round(v, 5) if isinstance(v, float) else v for k, v in c.items() if k not in ('model', 'views')}
json.dump(dict(views='strip of 8 frames of 256 px; frame k is seen from direction (x, z) = (sin 45k, cos 45k) in the model frame; pick k = round(atan2(dx, dz) / 45 deg) mod 8, dx dz = camera minus model rotated by -rotY',
               units='frame, height and radius are in GLB units: multiply by the placement scale. The card is a square of side frame; its centre sits base_from_centre * frame above the model base.',
               elevation_deg=8, cards=index), open(f'{OUT}/index.json', 'w'), indent=1)
print(len(index), sum(os.path.getsize(f'{OUT}/{m}.webp') for m in index) / 1e6, 'MB')
