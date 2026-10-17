"""Sea pillars standing in the moat, clear of bridges and stacks (writes out/viaducts/pillars.json)."""
import numpy as np, json, math
from scipy import ndimage as ndi
R='/tmp/claude-0/-home-user-birthday-castle/f3b68e88-f85d-5620-80ca-50941bbc5e5b/scratchpad/ridge/'
MAPW, CX, CZ = 20691.0, -709.5, 2260.5; N=2048; cs=MAPW/N
h=np.load(R+'out/inner.npz')['h']; C=json.load(open(R+'out/cliffs.json'))
def H(x,z): return float(ndi.map_coordinates(h,[[(z-CZ+MAPW/2)/cs-.5],[(x-CX+MAPW/2)/cs-.5]],order=1)[0])
def segd(px,pz,a,b):
    ax,az=a; bx,bz=b; dx,dz=bx-ax,bz-az; t=max(0,min(1,((px-ax)*dx+(pz-az)*dz)/(dx*dx+dz*dz))); return math.hypot(px-ax-t*dx,pz-az-t*dz)
rng=np.random.default_rng(31); kinds=['SeaPillar_Basalt','SeaPillar_Column','SeaPillar_TwinArch','SeaPillar_CrystalSpire']
out=[]; tries=0
while len(out)<48 and tries<20000:
    tries+=1; a=rng.uniform(0,2*math.pi); d=rng.uniform(1300,3300); x,z=d*math.cos(a)*1.0, d*math.sin(a)*1.25+300
    if H(x,z) > -6 or min(H(x+40,z),H(x-40,z),H(x,z+40),H(x,z-40)) > -2: continue
    if max(H(x+45,z),H(x-45,z),H(x,z+45),H(x,z-45)) > 0: continue     # keep clear of the steps
    if abs(x)<140 and z>2300: continue
    if any(segd(x,z,b['a'],b['b'])<70 for b in C['bridges']): continue
    if any(math.hypot(x-s['x'],z-s['z'])<s['r']+60 for s in C['stacks']): continue
    if any(math.hypot(x-p['x'],z-p['z'])<90 for p in out): continue
    k=kinds[rng.choice(4,p=[0.35,0.3,0.15,0.2])]; sc=float(rng.uniform(0.7,1.9))
    out.append(dict(m=k,x=round(x,1),z=round(z,1),y=0.0,rotY=round(float(rng.uniform(0,6.28)),3),scale=round(sc,3)))
json.dump(out,open(R+'out/viaducts/pillars.json','w'),indent=0); print('pillars',len(out))
