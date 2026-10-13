"""Render a fresh plain coordinate plan, without editing any reference image."""
from pathlib import Path
import json,math,os,heapq,hashlib
os.environ.setdefault('MPLCONFIGDIR','/tmp/birthday-castle-mpl')
os.environ.setdefault('XDG_CACHE_HOME','/tmp/birthday-castle-font-cache')
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.path import Path as MPath
from matplotlib.patches import Polygon,Circle,Rectangle,Ellipse,FancyArrowPatch
import numpy as np
R=Path(__file__).resolve().parents[1]
s=json.loads((R/'schedule.json').read_text());levels=s['levels'];towers=s['tower_placements'];features=s['garden_features']
contours=[MPath(l['main_contour']) for l in levels];gx=s['gates'][2]['x_grid_m']
paper='#fffdf8';ink='#333333'
fig=plt.figure(figsize=(16,16),facecolor=paper);ax=fig.add_axes([.06,.22,.87,.69]);ax.set_aspect('equal');ax.set_xlim(-490,495);ax.set_ylim(-215,600);ax.axis('off')
def poly(p,**kw):ax.add_patch(Polygon(p,closed=True,**kw))
def rect(x,y,w,h,**kw):ax.add_patch(Rectangle((x-w/2,y-h/2),w,h,**kw))
def txt(x,y,text,size=8,**kw):ax.text(x,y,text,ha='center',fontsize=size,zorder=25,bbox=dict(facecolor=paper,edgecolor='none',pad=1),**kw)
for i,l in enumerate(levels):
 poly(l['main_contour'],facecolor=['#fffdf8','#f7f6f2','#eeede8','#e3e2dd'][i],edgecolor=ink,lw=1.65,zorder=1+i)
 p=np.array(l['main_contour']);c=p.mean(axis=0);poly(c+(p-c)*.986,fill=False,edgecolor=ink,lw=.45,zorder=1.1+i)
for x,y,w,h in [(-400,65,30,36),(400,110,30,42),(-300,130,27,33),(300,220,28,34),(-200,145,22,30),(200,170,20,27),(-100,200,16,22),(100,245,16,22)]:
 d=-1 if x<0 else 1;poly([(x,y-h),(x+d*w*.7,y-h),(x+d*w,y-h*.45),(x+d*w,y+h*.45),(x+d*w*.7,y+h),(x,y+h)],facecolor=paper,edgecolor=ink,lw=1,zorder=5)
rect(gx,-112.5,120,75,facecolor=paper,edgecolor=ink,lw=1,zorder=5)
def on_roof(p,i):
 return contours[i].contains_point(p) and not (i<3 and contours[i+1].contains_point(p,radius=.01)) and not (i==0 and gx-60<p[0]<gx+60 and -150<p[1]<-75)
def walkable(p,i):
 if not on_roof(p,i):return False
 for t in towers:
  if math.hypot(p[0]-t['x_grid_m'],p[1]-t['y_grid_m'])<t['radius_grid_m']+3:return False
 for f in features:
  x,y=f['centre']
  if 'radius' in f:
   if math.hypot(p[0]-x,p[1]-y)<f['radius']*1.2+2:return False
  elif abs(p[0]-x)<f['size'][0]/2+2 and abs(p[1]-y)<f['size'][1]/2+2:return False
 if -246<p[0]<-223 and abs(p[1]-(163+(p[0]+248)*8/25))<3:return False
 return True
def segment_ok(a,b,i):
 return all(walkable(a+(b-a)*t,i) for t in np.linspace(0,1,max(3,int(np.linalg.norm(b-a)/2)+1)))
paths=[];checks=[]
for i,l in enumerate(levels):
 terms=[]
 for stair in s['stairs']:
  if stair['id']=='W-CASCADE':continue
  for k,lk in [('from','lower_level'),('to','upper_level')]:
   if stair[lk]==l['id']:terms.append((stair['plan_label'],np.array(stair[k][:2],float)))
 for c in s['courtyards']:
  if c['level']==l['id']:terms.append((c['id'],np.array(c['access'],float)))
 if i==0:terms.append(('G3',np.array([gx,-8.])))
 valid={(x,y) for x in range(-400,401,5) for y in range(-150,531,5) if walkable((x,y),i)}
 def snap(p):
  for q in sorted(valid,key=lambda q:(q[0]-p[0])**2+(q[1]-p[1])**2)[:100]:
   if segment_ok(p,np.array(q),i):return q
  raise ValueError('No accessible grid point: '+str(p))
 snapped=[snap(p) for _,p in terms];tree={snapped[0]};segments=[]
 for start in snapped[1:]:
  queue=[(0,start)];dist={start:0};prev={};goal=None
  while queue:
   cost,cur=heapq.heappop(queue)
   if cost!=dist[cur]:continue
   if cur in tree:goal=cur;break
   for dx,dy in [(5,0),(-5,0),(0,5),(0,-5),(5,5),(5,-5),(-5,5),(-5,-5)]:
    nxt=(cur[0]+dx,cur[1]+dy)
    if nxt not in valid or not segment_ok(np.array(cur),np.array(nxt),i):continue
    nc=cost+math.hypot(dx,dy)
    if nc<dist.get(nxt,float('inf')):dist[nxt]=nc;prev[nxt]=cur;heapq.heappush(queue,(nc,nxt))
  if goal is None:raise ValueError('Disconnected roof access: '+l['id'])
  route=[goal]
  while route[-1]!=start:route.append(prev[route[-1]])
  route.reverse();tree.update(route);segments.append(route)
 for (name,p),q in zip(terms,snapped):
  segments.append([p.tolist(),list(q)]);checks.append({'level':l['id'],'terminal':name,'on_roof':on_roof(p,i),'clear_of_marked_obstacles':walkable(p,i)})
 for route in segments:
  p=np.array(route);ax.plot(p[:,0],p[:,1],color='#666',lw=.9,ls=(0,(4,3)),zorder=6)
 paths.append({'level':l['id'],'terminals':[name for name,_ in terms],'segments':segments})
for c in s['courtyards']:
 x,y=c['centre'];w,h=c['size'];rect(x,y,w,h,fill=False,edgecolor='#aaa',lw=.6,ls=':',zorder=5.2);ax.plot(*c['access'],marker='s',markersize=2.5,color=ink,zorder=7)
for f in features:
 x,y=f['centre'];kind=f['kind']
 if kind in ['lotus','star','pond']:
  theta=np.linspace(0,2*math.pi,16 if kind=='star' else 100,endpoint=False)
  if kind=='pond':mod=1+.09*np.sin(3*theta)+.06*np.cos(5*theta);xx=x+f['size'][0]/2*mod*np.cos(theta);yy=y+f['size'][1]/2*mod*np.sin(theta)
  else:
   r=f['radius']*(np.where(np.arange(16)%2==0,1,.47) if kind=='star' else 1+.13*np.cos(8*theta));xx=x+r*np.cos(theta);yy=y+r*np.sin(theta)
  poly(np.column_stack([xx,yy]),facecolor=paper,edgecolor=ink,lw=.8,zorder=7)
 elif 'radius' in f:
  ax.add_patch(Circle((x,y),f['radius'],facecolor=paper,edgecolor=ink,lw=.8,zorder=7));ax.plot(x,y,marker='+',color=ink,markersize=4,zorder=8)
 else:
  w,h=f['size'];rect(x,y,w,h,facecolor=paper,edgecolor=ink,lw=.8,zorder=7)
  if kind=='conservatory':
   ax.plot([x,x],[y-h/2,y+h/2],color=ink,lw=.5,zorder=8)
   for yy in np.linspace(y-h/2,y+h/2,6):ax.plot([x-w/2,x+w/2],[yy,yy],color=ink,lw=.4,zorder=8)
  elif kind=='loggia':
   for xx in np.linspace(x-w/2+3,x+w/2-3,6):ax.add_patch(Circle((xx,y+2),1.3,facecolor=paper,edgecolor=ink,lw=.5,zorder=8))
 txt(x,y+f.get('radius',f.get('size',[0,0])[1]/2)+7,f['id'],7)
ax.plot([-245,-225],[164,170],color=ink,lw=.9,zorder=7)
for x,y,w,h in [(-273,186,12,22),(-270,136,15,19),(-222,197,12,15),(218,345,7,20),(285,378,6,18),(-372,309,6,26),(-334,350,14,6),(-65,255,10,26),(65,215,10,26),(0,148,20,6)]:ax.add_patch(Ellipse((x,y),w,h,fill=False,edgecolor='#999',lw=.5,zorder=5.5))
ax.add_patch(Circle((-240,-70),26,fill=False,edgecolor='#999',lw=.6,zorder=5.5))
for a in np.linspace(0,2*math.pi,8,endpoint=False):ax.add_patch(Ellipse((-240+18*math.cos(a),-70+18*math.sin(a)),11,7,angle=a*180/math.pi,fill=False,edgecolor='#999',lw=.5,zorder=5.5))
rect(223,-70,70,46,fill=False,edgecolor='#999',lw=.6,zorder=5.5)
for yy in [-87,-53]:ax.plot([194,252],[yy,yy],color='#999',lw=.5,zorder=5.5)
ax.plot([-265,265],[0,0],color=ink,lw=2.5,zorder=8)
for g in s['gates']:
 x=g['x_grid_m'];ax.plot([x-18,x+18],[0,0],color=paper,lw=2.8,zorder=9)
 if g['role']!='entrance':ax.plot([x-18,x+18],[0,0],color='#777',lw=.7,zorder=10)
 txt(x,-11,g['id'],7.5)
rect(gx,-112.5,35,75,facecolor=paper,edgecolor=ink,lw=.8,zorder=7)
for yy in np.linspace(-146,-79,7):ax.plot([gx-16,gx+16],[yy,yy],color='#888',lw=.5,zorder=8)
txt(gx,-112,'WATER',6,rotation=90,va='center')
for r in s['stairs']:
 if r['id']=='W-CASCADE':continue
 a=np.array(r['from'][:2],float);b=np.array(r['to'][:2],float);v=b-a;n=np.array([-v[1],v[0]])/np.linalg.norm(v);w=22 if r['id'].startswith('S-FRONT') else 12
 poly([a+n*w/2,b+n*w/2,b-n*w/2,a-n*w/2],facecolor=paper,edgecolor=ink,lw=.8,zorder=9)
 for t in np.linspace(.08,.92,11):
  q=a+t*v;ax.plot([q[0]-n[0]*w/2,q[0]+n[0]*w/2],[q[1]-n[1]*w/2,q[1]+n[1]*w/2],color='#888',lw=.4,zorder=10)
 ax.add_patch(FancyArrowPatch(a+.15*v,b-.15*v,arrowstyle='-|>',mutation_scale=8,color=ink,lw=.8,zorder=11))
 for q in [a,b]:ax.plot(*q,marker='s',markerfacecolor=paper,markeredgecolor=ink,markersize=4,zorder=12)
 mid=(a+b)/2+n*(w/2+13);txt(*mid,r['plan_label'],8,fontweight='bold')
for t in sorted(towers,key=lambda t:bool(t['parent_placement_id'])):ax.add_patch(Circle((t['x_grid_m'],t['y_grid_m']),t['radius_grid_m'],facecolor=paper,edgecolor=ink,lw=.85,zorder=13))
boxes=[]
for t in towers:
 x,y,r=t['x_grid_m'],t['y_grid_m'],t['radius_grid_m'];tag=t['placement_id'].split('-')[-1]
 candidates=[(0,r+10),(r+13,0),(-r-13,0),(0,-r-10),(r+14,r+11),(-r-14,r+11),(0,r+28),(r+29,0),(-r-29,0)]
 def score(v):
  dx,dy=v;qx,qy=x+dx,y+dy;b=(qx-12,qy-6,qx+12,qy+6)
  overlap=sum(b[0]<ox1 and b[2]>ox0 and b[1]<oy1 and b[3]>oy0 for ox0,oy0,ox1,oy1 in boxes)
  crowd=sum(math.hypot(qx-o['x_grid_m'],qy-o['y_grid_m'])<o['radius_grid_m']+8 for o in towers if o is not t)
  return overlap*30+crowd*8+.006*math.hypot(dx,dy)
 dx,dy=min(candidates,key=score);qx,qy=x+dx,y+dy;boxes.append((qx-12,qy-6,qx+12,qy+6))
 ax.annotate(tag,(x,y),(qx,qy),ha='center',va='center',fontsize=7,zorder=25,bbox=dict(facecolor=paper,edgecolor='none',pad=.5),arrowprops=dict(arrowstyle='-',color='#666',lw=.4))
for text,x,y in [('L1 / 60',-350,430),('L1 / 60',350,430),('L1 / 60',130,503),('L2 / 160',-246,350),('L2 / 160',150,417),('L3 / 230',-145,310),('L3 / 230',145,320),('L3 / 230',0,355),('L4 / 300',5,283)]:txt(x,y,text,8,fontweight='bold')
for name,x,y in [('Rose court',-245,108),('Moon court',-350,365),('Conservatory',251,407),('North loggia',0,475),('Royal court',0,131),('Rose parterre',-240,-116),('Mirror garden',223,-116),('Arrival terrace',gx,-45)]:txt(x,y,name,7)
def dim(a,b,text,offset=(0,0)):
 ax.add_patch(FancyArrowPatch(a,b,arrowstyle='<->',mutation_scale=7,color=ink,lw=.7,zorder=22));txt((a[0]+b[0])/2+offset[0],(a[1]+b[1])/2+offset[1],text,8,va='center')
for xx in [[-400,-300,-200,-100],[100,200,300,400]]:
 for a,b in zip(xx,xx[1:]):dim((a,-181),(b,-181),'100',(0,-13))
txt(0,-181,'SIDE GAPS',7)
for a,b in [(305,380),(380,455),(455,530)]:dim((446,a),(446,b),'75',(15,0))
txt(473,415,'REAR GAPS',7,rotation=90);dim((-452,-150),(-452,0),'150',(-12,0));dim((106,-75),(106,0),'75',(12,0))
ax.add_patch(FancyArrowPatch((422,552),(422,585),arrowstyle='-|>',mutation_scale=12,color=ink,lw=1));txt(422,593,'N / REAR',8,fontweight='bold');txt(-475,220,'WEST',8,rotation=90);txt(0,-214,'SOUTH / FRONT',10,fontweight='bold')
for y,text,size,bold in [(.96,'PAL-ROOF-PLAN-001 · Plain palace top view',21,True),(.938,'Tower circles · Stair connections · Garden / fountain / pathway symbols · Revision R03',10,False),(.918,'Central roofs step down outward. Roof heights 60 / 160 / 230 / 300 grid m. Garden sources: GEN-14 / 15 / 16.',9,False),(.195,'SYMBOLS',11,True),(.178,'T01–T33: tower circles    F: fountains    P: water    H: covered structures    Dotted boxes: garden zones',9,False),(.16,'Dashed lines: same-level paths    Treads + arrow: stairs up    Small squares: stair landings / court access',9,False),(.136,'STAIR CONNECTIONS',10,True),(.119,'W0 / E0: Ground → L1    W1 / E1 / N1: L1 → L2    W2 / E2 / N2: L2 → L3    W3 / E3 / N3: L3 → L4',9,False),(.097,'F1 lotus · P1 linked star basin · P2 long mirror pool · H1 conservatory · F2 / H2 north fountain and loggia',8.5,False),(.081,'P3 moon pond · F3 rose-parterre fountain · P4 approach mirror pool · F4 / F5 small royal-court fountains',8.5,False),(.059,'33 inventoried placements retained. Tower identity / front order follow GEN-37; all depths remain proposed.',9,False),(.043,'Garden fits and paths proposed. Fixture symbols enlarged; path widths / final stair geometry are not to scale.',9,False),(.027,'800 × 680 grid envelope and L3→L4 front setback 60 m are proposed. Massing grid ×2.75 = world metres.',8.5,False)]:fig.text(.06,y,text,fontsize=size,fontweight='bold' if bold else 'normal',color=ink)
fig.savefig(R/'PAL-ROOF-PLAN-001.png',dpi=180,facecolor=paper);plt.close(fig)
assert all(c['on_roof'] and c['clear_of_marked_obstacles'] for c in checks)
record={'generator':'coordinate-authored Matplotlib engineering drawing','revision':'R03','source_pixels_modified':False,'projection':'true planar overhead','tower_symbol':'plain circle','tower_footprint_count':len(towers),'label_count':len(boxes),'rendered_placement_ids':[t['placement_id'] for t in towers],'rendered_stair_routes':[r['id'] for r in s['stairs'] if r['id']!='W-CASCADE'],'garden_sources_reviewed':['GEN-16','GEN-14','GEN-15','GEN-03'],'path_terminal_checks':checks,'connected_access_count_by_level':{p['level']:len(p['terminals']) for p in paths},'path_limit':'Connected schematic paths avoid main upper footprints and marked solid features, not final clearance or structural analysis.','source_registration_limit':'Garden fitting, tower depths and complete envelope are proposed.'}
(R/'path-connections.json').write_text(json.dumps(paths,indent=2)+'\n');(R/'render-input.json').write_text(json.dumps(s,indent=2)+'\n')
record['render_input_sha256']=hashlib.sha256((R/'render-input.json').read_bytes()).hexdigest();record['output_sha256']=hashlib.sha256((R/'PAL-ROOF-PLAN-001.png').read_bytes()).hexdigest();(R/'render-record.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({k:record[k] for k in ['revision','tower_footprint_count','connected_access_count_by_level']}))
