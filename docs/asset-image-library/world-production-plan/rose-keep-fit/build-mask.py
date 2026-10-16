"""Technical aperture mask from the same sampled profile as the evaluated wall."""
import json, subprocess
from pathlib import Path
from PIL import Image, ImageDraw

root=Path(__file__).resolve().parent
code="""import fs from 'node:fs';import {createRose} from './model.mjs';
const h=JSON.parse(fs.readFileSync('../rose-keep/asset-handoff.json')),s=JSON.parse(fs.readFileSync('../kit-fit/contract.json')),m=createRose(h,s),o=m.doorway;
console.log(JSON.stringify({width:8,height:6,opening:o,outline:[[-o.width/2,0],[o.width/2,0],...Array.from({length:65},(_,i)=>{const x=o.x+o.width/2-i/64*o.width;return[x-o.x,m.archTop(x)-o.y];})]}));"""
data=json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=root,text=True))
# Black substrate, white empty passage. 100 pixels per metre, same profile samples as geometry.mjs.
mask=Image.new('L',(800,600),0);d=ImageDraw.Draw(mask)
d.polygon([(round(400+x*100),round(599-y*100)) for x,y in data['outline']],fill=255)
(root/'masks').mkdir(exist_ok=True);mask.save(root/'masks/entrance.png')
sheet=Image.new('RGB',(920,735),'white');sheet.paste(mask.convert('RGB'),(60,70));d=ImageDraw.Draw(sheet)
d.text((60,20),'B04-ENTRY-DOOR / WHITE = EMPTY PASSAGE / BLACK = WALL',fill='black')
d.text((60,685),'Clear 2.4 m | spring 3.2 m | apex 3.8 m | depth 0.6 m | world threshold Y=1.5 m',fill='black')
d.text((60,705),'Derived from the procedural wall profile; technical evidence, not new concept art.',fill='black')
sheet.save(root/'masks/opening-contact.png');(root/'masks/entrance.json').write_text(json.dumps(data,indent=2)+'\n')
print('Saved binary aperture mask and labelled contact sheet from the evaluated profile samples.')
