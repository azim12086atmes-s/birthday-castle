"""Reproducible binary aperture evidence from the parametric opening schedule; no reference art is edited."""
import json,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent
(ROOT/'masks').mkdir(exist_ok=True)
openings=json.loads((ROOT/'openings.json').read_text())['openings']
names=[('H-N-18-ENTRY-door','source-door'),('H-N-18-WIN-window','window-bay'),('H-S-18-ENTRY-door','wide-entry'),('LANE-ARCH-42-door','lane-arch'),('WEST-GATE-door','west-gate')]
contact=Image.new('RGB',(600,1020),'white');draw=ImageDraw.Draw(contact);records=[]
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14)
for index,(id,name) in enumerate(names):
 o=next(o for o in openings if o['id']==id);points=[[-o['width']/2,0],[o['width']/2,0]]
 for i in range(65):
  a=i/64*math.pi;points.append([o['width']/2*math.cos(a),o['height']-o['arch_rise']+o['arch_rise']*math.sin(a)])
 pixels=[(round(120+x*40),round(240-(y+o['sill'])*40)) for x,y in points]
 image=Image.new('L',(241,241),0);ImageDraw.Draw(image).polygon(pixels,fill=255);image.save(ROOT/'masks'/f'{name}.png')
 col=index%2;row=index//2;x=col*300+30;y=row*340+50;contact.paste(image.convert('RGB'),(x,y));draw.text((x,y-35),name,font=font,fill='black');draw.text((x,y+245),f"{o['width']} × {o['height']} m / 40 px per m",font=font,fill='black')
 records.append({'id':id,'file':f'masks/{name}.png','pixels_per_metre':40,'origin_pixels':[120,240],'mask_frame_metres':[6,6],'trace_sill_metres':0,'outline_metres_relative_to_sill':points,'role':'Binary aperture evidence; original parametric schedule remains mesh authority'})
contact.save(ROOT/'review'/'opening-masks.png');(ROOT/'mask-metadata.json').write_text(json.dumps(records,indent=2)+'\n');print('Saved five aperture masks and contact sheet.')
