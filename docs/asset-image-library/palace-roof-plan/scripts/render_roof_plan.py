"""Render a new engineering roof plan from coordinates; no source pixels are edited."""
from pathlib import Path
import json, math, os
os.environ.setdefault('MPLCONFIGDIR','/tmp/birthday-castle-mpl')
os.environ.setdefault('XDG_CACHE_HOME','/tmp/birthday-castle-font-cache')
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon, Circle, Rectangle, FancyArrowPatch
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
s=json.loads((ROOT/'schedule.json').read_text())
fig=plt.figure(figsize=(17,18),facecolor='#faf5e9')
ax=fig.add_axes([.055,.24,.87,.68]); ax.set_aspect('equal'); ax.set_xlim(-480,490);ax.set_ylim(-230,600);ax.axis('off')
ink='#493a42'; gold='#b38a44'; plum='#684072'
fills=['#eee3d4','#f0d7db','#e1b8c6','#c693b3']
# Continuous nested ward substrates, not disconnected blocks.
for i,l in enumerate(s['levels']):
 p=np.array(l['main_contour'])
 ax.add_patch(Polygon(p,closed=True,facecolor=fills[i],edgecolor=ink,lw=1.5,zorder=i+1))
 centre=p.mean(axis=0); inner=centre+(p-centre)*.984
 ax.add_patch(Polygon(inner,closed=True,fill=False,edgecolor=gold,lw=.7,zorder=i+1.1))
# Arrival notch masks the base roof; stairs, water and cheeks remain in this cutout.
gx=s['gates'][2]['x_grid_m']
ax.add_patch(Rectangle((gx-60,-150),120,75,facecolor='#faf5e9',edgecolor=ink,lw=1.2,zorder=5))
# Formal roof parterres show usable terrace bands without replacing ward geometry.
for x,ys,ww,hh in [(-350,[135,285,410],44,54),(350,[155,320,445],44,54),(-270,[330,390],35,34),(270,[355,405],35,34),(0,[487],110,27),(0,[325],75,21),(-195,[-40],90,24),(190,[-40],90,24)]:
 for y in ys:
  ax.add_patch(Rectangle((x-ww/2,y-hh/2),ww,hh,facecolor='#c6d5b4',edgecolor='#708362',lw=.6,zorder=4.8))
  ax.plot([x-ww/2,x+ww/2],[y,y],color='#f9ead9',lw=2,zorder=4.9)
  for px in np.linspace(x-ww/2+5,x+ww/2-5,5):
   for py in [y-hh/2+5,y+hh/2-5]:ax.add_patch(Circle((px,py),2.2,facecolor='#cd8fab',edgecolor='none',zorder=5))
# Attached chamfered/rounded ward returns are explicit same-level projections.
returns=[(-400,65,30,36,0), (400,110,30,42,0), (-300,130,27,33,1),
 (300,220,28,34,1),(-200,145,22,30,2),(200,170,20,27,2),(-100,200,16,22,3),(100,245,16,22,3)]
for x,y,w,h,lvl in returns:
 direction=-1 if x<0 else 1
 poly=[(x,y-h),(x+direction*w*.7,y-h),(x+direction*w,y-h*.45),(x+direction*w,y+h*.45),(x+direction*w*.7,y+h),(x,y+h)]
 ax.add_patch(Polygon(poly,closed=True,facecolor=fills[lvl],edgecolor=ink,lw=1.1,zorder=5))
# Plan-only roof-court planting and paths. Symbols do not declare fixture size.
for ci,c in enumerate(s['courtyards']):
 x,y=c['centre']; ww,hh=(145,130) if ci==0 else (78,75)
 ax.add_patch(Rectangle((x-ww/2,y-hh/2),ww,hh,facecolor='#f9eee2',edgecolor=gold,lw=.85,zorder=5))
 if ci:
  ax.add_patch(Circle((x,y),8,facecolor='#9ecdd8',edgecolor='#4c8197',lw=.8,zorder=6))
  ax.add_patch(Circle((x,y),3,facecolor='#f6ede3',edgecolor=gold,lw=.8,zorder=6))
 for yy in [y-hh/2+10,y+hh/2-10]:
  for xx in np.linspace(x-ww/2+10,x+ww/2-10,6):
   ax.add_patch(Circle((xx,yy),3.8,facecolor='#678d62',edgecolor='#456a4e',lw=.4,zorder=6))
   ax.add_patch(Circle((xx+1,yy+1),1.5,facecolor='#d895b6',edgecolor='none',zorder=7))
 if ci==0:
  for yy in [y-45,y+45]:
   ax.add_patch(Circle((x+42,yy),5,facecolor='#a8d5df',edgecolor='#4c8197',lw=.7,zorder=6))
 # Small named court key outside footprint clutter.
 ax.text(x,y-hh/2+2,c['id'],ha='center',va='bottom',fontsize=6.5,color=ink,zorder=18,
         bbox=dict(facecolor='#fff6e8',edgecolor='none',alpha=.9,pad=1))
# Five bays belong to one wall; blue plan bars are glazing, centre is door threshold.
ax.plot([-265,265],[0,0],color=ink,lw=3,zorder=7)
for g in s['gates']:
 x=g['x_grid_m']
 ax.plot([x-18,x+18],[0,0],color='#faf5e9' if g['role']=='entrance' else '#82b7cd',lw=3.1,zorder=8)
 ax.text(x,-14,g['id'],ha='center',va='top',fontsize=7.5,fontweight='bold',color=ink,zorder=18)
# Original separate wet cascade and two dry flights through entrance notch.
ax.add_patch(Rectangle((gx-17.5,-150),35,75,facecolor='#87c4db',edgecolor='#4d849e',lw=1,zorder=6))
for y in np.linspace(-146,-79,7):ax.plot([gx-16,gx+16],[y,y],color='#f0fcff',lw=1,zorder=7)
for route in s['stairs']:
 if route['id']=='W-CASCADE':continue
 a=np.array(route['from'][:2],dtype=float);b=np.array(route['to'][:2],dtype=float);v=b-a;length=np.linalg.norm(v);n=np.array([-v[1],v[0]])/length
 width=22 if route['id'].startswith('S-FRONT') else 12
 poly=[a+n*width/2,b+n*width/2,b-n*width/2,a-n*width/2]
 col=route['route_color']
 ax.add_patch(Polygon(poly,closed=True,facecolor='#fcf1e6',edgecolor=col,lw=1.45,zorder=8))
 for t in np.linspace(.06,.94,13):
  q=a+t*v;ax.plot([q[0]-n[0]*width/2,q[0]+n[0]*width/2],[q[1]-n[1]*width/2,q[1]+n[1]*width/2],color='#9c8b8a',lw=.45,zorder=9)
 # Clear landings and two-way arrows connect the actual adjacent roof levels.
 for q in [a,b]:
  box=[q+n*(width/2+3)+v/length*5,q-n*(width/2+3)+v/length*5,q-n*(width/2+3)-v/length*5,q+n*(width/2+3)-v/length*5]
  ax.add_patch(Polygon(box,closed=True,facecolor='#fff4e2',edgecolor=col,lw=1,zorder=9.5))
 ax.add_patch(FancyArrowPatch(b-.18*v,a+.18*v,arrowstyle='<->',mutation_scale=9,color=col,lw=1.3,zorder=10))
 mid=(a+b)/2+n*(width/2+15)
 ax.text(mid[0],mid[1],route['plan_label']+' '+route['transition'],ha='center',va='center',fontsize=7.1,color=col,zorder=22,
         bbox=dict(facecolor='#faf5e9',edgecolor=col,lw=.65,pad=2.5))
ax.text(gx,-53,'75 m arrival terrace',ha='center',va='center',fontsize=6.5,color=ink,zorder=18)
# Route-garden paths are plan lines rather than new bridge networks.
for y in [-48,42,90,335,405,492]:
 if y<0:x0,x1=-270,270
 elif y<60:x0,x1=-280,280
 elif y<120:x0,x1=-180,180
 elif y<380:x0,x1=-170,170
 elif y<455:x0,x1=-255,255
 else:x0,x1=-350,350
 ax.plot([x0,x1],[y,y],color='#fff3e6',lw=3,zorder=5)
 ax.plot([x0,x1],[y,y],color='#baa3a4',lw=.35,zorder=5.1)
# Tower crown footprints. All 33 are drawn, children overlay their parent roof.
drawn=[]
tower_order=sorted(s['tower_placements'],key=lambda t:(bool(t['parent_placement_id']),-t['radius_grid_m']))
for t in tower_order:
 x,y,r=t['x_grid_m'],t['y_grid_m'],t['radius_grid_m']
 if t['roof_kind']=='onion':
  ax.add_patch(Circle((x,y),r,facecolor=plum,edgecolor=gold,lw=1.1,zorder=12))
  ax.add_patch(Circle((x,y),r*.81,fill=False,edgecolor='#d0ac61',lw=.65,zorder=12.1))
  for angle in np.linspace(0,2*math.pi,10,endpoint=False):
   ax.plot([x,x+r*math.cos(angle)],[y,y+r*math.sin(angle)],color='#d0ac61',lw=.55,zorder=12.2)
 else:
  n=8;theta=np.linspace(0,2*math.pi,n,endpoint=False)+math.pi/8
  pts=np.column_stack([x+r*np.cos(theta),y+r*np.sin(theta)])
  ax.add_patch(Polygon(pts,closed=True,facecolor='#6c628c',edgecolor=gold,lw=1,zorder=12))
  for px,py in pts:ax.plot([x,px],[y,py],color='#c1a36b',lw=.45,zorder=12.2)
 ax.plot(x,y,marker='*',markersize=3.6,color='#edc976',zorder=13)
 drawn.append(t['placement_id'])
# Declutter the unique placement labels, with leaders to exact centres.
label_boxes=[]
for t in sorted(s['tower_placements'],key=lambda t:t['placement_id']):
 x,y,r=t['x_grid_m'],t['y_grid_m'],t['radius_grid_m'];tag=t['placement_id'].split('-')[-1]
 candidates=[(0,r+10),(r+15,0),(-r-15,0),(0,-r-10),(r+18,r+15),(-r-18,r+15),(r+18,-r-15),(-r-18,-r-15),(0,r+31),(r+35,0),(-r-35,0)]
 def score(dx,dy):
  qx,qy=x+dx,y+dy;box=(qx-12,qy-6,qx+12,qy+6);cost=0
  for ox0,oy0,ox1,oy1 in label_boxes:
   if box[0]<ox1 and box[2]>ox0 and box[1]<oy1 and box[3]>oy0:cost+=20
  for other in s['tower_placements']:
   if other['placement_id']==t['placement_id']:continue
   if math.hypot(qx-other['x_grid_m'],qy-other['y_grid_m'])<other['radius_grid_m']+8:cost+=5
  return cost+.006*math.hypot(dx,dy)
 dx,dy=min(candidates,key=lambda v:score(*v));qx,qy=x+dx,y+dy
 label_boxes.append((qx-12,qy-6,qx+12,qy+6))
 ax.annotate(tag,(x,y),(qx,qy),ha='center',va='center',fontsize=6.5,fontweight='bold',color=ink,zorder=20,
             bbox=dict(facecolor='#faf5e9',edgecolor='none',alpha=.97,pad=1.1),
             arrowprops=dict(arrowstyle='-',color='#685863',lw=.45))
# Exposed layer bands labelled on multiple sides; highest is central, not northern.
for label,x,y in [('L1 · 60',-350,355),('L1 · 60',350,365),('L1 · 60',0,500),
 ('L2 · 160',-255,320),('L2 · 160',255,355),('L2 · 160',-140,414),
 ('L3 · 230',-145,305),('L3 · 230',145,300),('L3 · 230',0,350),('L4 · 300',0,268)]:
 ax.text(x,y,label,ha='center',fontsize=7.4,fontweight='bold',color=ink,zorder=20,
         bbox=dict(facecolor='#fff5e5',edgecolor='#b7976b',lw=.5,pad=2))
# Correctly oriented dimensional gaps, outside the artwork.
def dim(a,b,text,offset=(0,0),fontsize=7):
 ax.add_patch(FancyArrowPatch(a,b,arrowstyle='<->',mutation_scale=7,color=ink,lw=.7,zorder=21))
 mx=(a[0]+b[0])/2+offset[0];my=(a[1]+b[1])/2+offset[1]
 ax.text(mx,my,text,ha='center',va='center',fontsize=fontsize,color=ink,zorder=22,
         bbox=dict(facecolor='#faf5e9',edgecolor='none',pad=1))
for xs in [[-400,-300,-200,-100],[100,200,300,400]]:
 for a,b in zip(xs,xs[1:]):
  dim((a,-187),(b,-187),'100',(0,-13))
  ax.plot([a,a],[-178,-196],color=ink,lw=.65)
 ax.plot([xs[-1],xs[-1]],[-178,-196],color=ink,lw=.65)
ax.text(0,-188,'side wall gaps',ha='center',fontsize=7,color=ink)
for a,b in [(305,380),(380,455),(455,530)]:
 dim((445,a),(445,b),'75',(17,0))
 ax.plot([405,450],[a,a],color=ink,lw=.5)
ax.plot([405,450],[530,530],color=ink,lw=.5)
ax.text(470,415,'rear wall gaps',rotation=90,ha='center',fontsize=7,color=ink)
dim((-451,-150),(-451,0),'150',(-11,0))
dim((106,-75),(106,0),'75',(12,0))
ax.text(-455,-172,'front',ha='center',fontsize=7,color=ink)
ax.add_patch(FancyArrowPatch((420,550),(420,588),arrowstyle='-|>',mutation_scale=14,color=ink,lw=1.2))
ax.text(420,594,'N / REAR',ha='center',fontsize=8,fontweight='bold',color=ink)
ax.text(-470,220,'WEST',rotation=90,ha='center',va='center',fontsize=8,fontweight='bold',color=ink)
ax.text(0,-220,'SOUTH / FRONT',ha='center',fontsize=9,fontweight='bold',color=ink)
fig.text(.055,.966,'PAL-ROOF-PLAN-001  ·  Complete palace roof and stair plan',fontsize=20,fontweight='bold',color=ink)
fig.text(.055,.941,'True overhead  ·  Centre high → outer low  ·  33 inventoried tower footprints  ·  Proposed layout',fontsize=10,color=ink)
fig.text(.055,.916,'Roof heights: L1 60 / L2 160 / L3 230 / L4 300 grid m. Main-wall gaps: sides 100 each, rear 75.',fontsize=9,color=ink)
# Complete tower index: placement IDs are instance names, not 33 newly generated meshes.
fig.text(.055,.222,'Stair links (two-way; landings shown)',fontsize=11,fontweight='bold',color=ink)
for x,text,col in [(.055,'W0 / E0: ground ↔ L1','#395f8a'),(.285,'W1 / E1 / N1: L1 ↔ L2','#327f71'),(.52,'W2 / E2 / N2: L2 ↔ L3','#b07835'),(.76,'W3 / E3 / N3: L3 ↔ L4','#805a97')]:
 fig.text(x,.205,text,fontsize=8.5,fontweight='bold',color=col)
fig.text(.055,.184,'Tower placement key (PAL-PLAN-Tnn)',fontsize=11,fontweight='bold',color=ink)
for idx,t in enumerate(s['tower_placements']):
 col=idx//11;row=idx%11
 name=t['name'].replace('west ','W ').replace('east ','E ').replace('middle ','mid ')
 if t['parent_placement_id']:name+=' [attached]'
 fig.text(.055+.30*col,.169-.0105*row,t['placement_id'].split('-')[-1]+'  '+name,fontsize=7.6,color=ink)
fig.text(.055,.04,'Placement proposals: major X anchors follow GEN-37 approximately; minor X and all depths require review. Stair flights are schematic.',fontsize=8,color=ink)
fig.text(.055,.025,'Envelope 800 × 680 grid m and L3→L4 front setback 60 m are proposed. Grid ×2.75 = world metres. Original front remains master.',fontsize=8,color=ink)
fig.savefig(ROOT/'PAL-ROOF-PLAN-001.png',dpi=180,facecolor=fig.get_facecolor())
plt.close(fig)
assert len(drawn)==33 and len(set(drawn))==33
record={'generator':'coordinate-authored Matplotlib engineering drawing','source_pixels_modified':False,'rendered_placement_ids':sorted(drawn),'tower_footprint_count':len(drawn),'label_count':len(label_boxes),'rendered_stair_routes':[r['id'] for r in s['stairs'] if r['id']!='W-CASCADE'],'stair_connections':[(r['plan_label'],r['transition']) for r in s['stairs'] if r['id']!='W-CASCADE'],'coordinates_match_schedule':True,'projection':'true planar orthographic; no perspective transform','scope':'Proposed roof layout; not full palace mesh or original geometry trace'}
(ROOT/'render-record.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps(record))

