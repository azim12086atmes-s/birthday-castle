import math
W=[];a=W.append
WALL="#e8b9c6";SHADE="#b0607e";ROOF="#9c3a68";PLUM="#6e2a5a";RG="#d99a8a";GOLD="#e0b040"
a('<svg xmlns="http://www.w3.org/2000/svg" viewBox="-262 -590 660 625" width="2112" height="2000" font-family="Georgia, serif">')
a(f'''<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d0f2a"/><stop offset=".7" stop-color="#2a2150"/><stop offset="1" stop-color="#4a2c5a"/></linearGradient>
<radialGradient id="glass" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#fff0c8"/><stop offset=".35" stop-color="#ffc2d6"/><stop offset=".7" stop-color="#e86a9a"/><stop offset="1" stop-color="#b02a6a"/></radialGradient>
<linearGradient id="lglass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0c060"/><stop offset=".25" stop-color="#e86a9a"/><stop offset=".6" stop-color="#ffc2d6"/><stop offset="1" stop-color="#b02a6a"/></linearGradient>
<linearGradient id="dome" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{PLUM}"/><stop offset=".45" stop-color="#c25488"/><stop offset="1" stop-color="{PLUM}"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{SHADE}"/><stop offset=".3" stop-color="{WALL}"/><stop offset=".7" stop-color="{WALL}"/><stop offset="1" stop-color="{SHADE}"/></linearGradient>
<radialGradient id="moonh"><stop offset="0" stop-color="#fff6f0"/><stop offset=".3" stop-color="#fff6f0"/><stop offset=".32" stop-color="#e8c8f0" stop-opacity=".5"/><stop offset="1" stop-color="#c8a0e0" stop-opacity="0"/></radialGradient>
<linearGradient id="flow" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f06aa0"/><stop offset=".2" stop-color="#ffd27a"/><stop offset=".4" stop-color="#5ad0c8"/><stop offset=".6" stop-color="#7a6ae8"/><stop offset=".8" stop-color="#e86ad0"/><stop offset="1" stop-color="#ffb07a"/></linearGradient>
<linearGradient id="flow2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7ad0ff"/><stop offset=".25" stop-color="#c07af0"/><stop offset=".5" stop-color="#ff8ab8"/><stop offset=".75" stop-color="#ffe07a"/><stop offset="1" stop-color="#6ae0b0"/></linearGradient>
<filter id="bl"><feGaussianBlur stdDeviation="1.2"/></filter>
<pattern id="girih" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="{RG}"/><path d="M2 0 L2.6 1.4 L4 2 L2.6 2.6 L2 4 L1.4 2.6 L0 2 L1.4 1.4 Z" fill="{GOLD}"/></pattern>
<pattern id="meander" width="4" height="2" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="{RG}"/><path d="M0 1.8 H3 V0.4 H1 V1.2 H2" fill="none" stroke="{GOLD}" stroke-width=".3"/></pattern>
</defs>''')
Y=lambda h:-h
a('<rect x="-262" y="-590" width="660" height="625" fill="url(#sky)"/>')
import random; random.seed(3)
for i in range(320):
    a(f'<circle cx="{random.uniform(-262,398):.1f}" cy="{random.uniform(-590,-200):.1f}" r="{random.uniform(.15,.5):.2f}" fill="#fff" opacity="{random.uniform(.4,1):.2f}"/>')
a('<circle cx="-215" cy="-470" r="24" fill="url(#moonh)"/>')
def rect(x0,x1,h0,h1,fill,st="none",sw=0.3,op=1):
    a(f'<rect x="{x0}" y="{Y(h1)}" width="{x1-x0}" height="{h1-h0}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}"/>')
def parch(cx,w,h0,h1,fill,st="#7a3a5a",sw=0.3):
    # pointed arch: straight sides to spring, then two arcs to apex
    r=w*0.9; spring=h1-w*0.8
    x0=cx-w/2;x1=cx+w/2
    a(f'<path d="M{x0} {Y(h0)} L{x0} {Y(spring)} A{r} {r} 0 0 1 {cx} {Y(h1)} A{r} {r} 0 0 1 {x1} {Y(spring)} L{x1} {Y(h0)} Z" fill="{fill}" stroke="{st}" stroke-width="{sw}"/>')
def lancet(cx,w,h0,h1):
    parch(cx,w+0.8,h0-0.4,h1+0.6,RG,"none")
    parch(cx,w,h0,h1,"url(#lglass)")
    # lead lines
    a(f'<line x1="{cx}" y1="{Y(h0)}" x2="{cx}" y2="{Y(h1-1)}" stroke="#5a2040" stroke-width=".18"/>')
    for k in range(1,5):
        hh=h0+k*(h1-h0)/5.5
        a(f'<line x1="{cx-w/2}" y1="{Y(hh)}" x2="{cx+w/2}" y2="{Y(hh)}" stroke="#5a2040" stroke-width=".15"/>')
    a(f'<circle cx="{cx}" cy="{Y(h1-w*0.55)}" r="{w*0.22}" fill="#fff0c8" stroke="#5a2040" stroke-width=".15"/>')
def onion(cx,base,w,h,fill="url(#dome)",rib=True):
    r=w/2
    p=(f'M{cx-r*0.8} {Y(base)} C{cx-r*1.25} {Y(base+h*0.25)} {cx-r*1.2} {Y(base+h*0.55)} {cx-r*0.35} {Y(base+h*0.8)} '
       f'Q{cx-r*0.05} {Y(base+h*0.9)} {cx} {Y(base+h)} Q{cx+r*0.05} {Y(base+h*0.9)} {cx+r*0.35} {Y(base+h*0.8)} '
       f'C{cx+r*1.2} {Y(base+h*0.55)} {cx+r*1.25} {Y(base+h*0.25)} {cx+r*0.8} {Y(base)} Z')
    a(f'<path d="{p}" fill="{fill}" stroke="{GOLD}" stroke-width=".3"/>')
    if rib:
        for f in (-0.55,-0.2,0.2,0.55):
            a(f'<path d="M{cx+r*0.8*f} {Y(base)} Q{cx+r*1.25*f} {Y(base+h*0.45)} {cx} {Y(base+h)}" fill="none" stroke="{GOLD}" stroke-width=".25"/>')
    rect(cx-r*0.85,cx+r*0.85,base-0.8,base,GOLD)
def spire(cx,base,w,h,fill=PLUM,glow=False):
    a(f'<path d="M{cx-w/2} {Y(base)} L{cx} {Y(base+h)} L{cx+w/2} {Y(base)} Z" fill="{fill}" stroke="{GOLD}" stroke-width=".25"/>')
    for k in range(1,6):
        hh=base+k*h/6; ww=w/2*(1-k/6)
        a(f'<circle cx="{cx-ww}" cy="{Y(hh)}" r=".35" fill="{GOLD}"/><circle cx="{cx+ww}" cy="{Y(hh)}" r=".35" fill="{GOLD}"/>')
    if glow: a(f'<circle cx="{cx}" cy="{Y(base+h)}" r="1.4" fill="#ffd0e0" filter="url(#bl)"/>')
def cone(cx,base,w,h):
    a(f'<path d="M{cx-w/2-0.8} {Y(base)} L{cx} {Y(base+h)} L{cx+w/2+0.8} {Y(base)} Z" fill="{PLUM}" stroke="{GOLD}" stroke-width=".2"/>')
    a(f'<line x1="{cx}" y1="{Y(base+h)}" x2="{cx}" y2="{Y(base+h+4)}" stroke="{GOLD}" stroke-width=".3"/><path d="M{cx} {Y(base+h+4)} l2.5 .8 l-2.5 .8 z" fill="#e86a9a"/>')

WHITE="#f6eef0"
def flowlancet(cx,w,h0,h1,g="url(#flow)"):
    parch(cx,w+1,h0-0.5,h1+0.8,RG,"none")
    parch(cx,w,h0,h1,g)
    # flowing lead lines
    for k in range(3):
        y0=h0+(k+1)*(h1-h0)/4.5
        a(f'<path d="M{cx-w/2} {Y(y0)} q {w/4} {-w*0.5} {w/2} 0 t {w/2} 0" fill="none" stroke="#3a1a40" stroke-width=".2"/>')
    a(f'<line x1="{cx}" y1="{Y(h0)}" x2="{cx}" y2="{Y(h1-w*0.4)}" stroke="#3a1a40" stroke-width=".18"/>')
def gtower(x,w,h,cap,sp=0,gl="url(#flow)"):
    rect(x-w/2,x+w/2,BASE,h,"url(#wall)")
    for f in (-0.5,0.5): rect(x+f*w-0.8,x+f*w+0.8,BASE,h,SHADE)
    hh=BASE+12
    while hh+26<h-6:
        n=max(1,int(w//9))
        for k in range(n):
            cx=x-w/2+(k+0.5)*w/n
            flowlancet(cx,min(3.6,w/n*0.45),hh,hh+22,gl if k%2==0 else "url(#flow2)")
        hh+=34
    rect(x-w/2-1.5,x+w/2+1.5,h-3,h,"url(#girih)")
    for f in (-0.5,0.5): spire(x+f*w,h,3,13,ROOF)
    if cap=="cone": spire(x,h,w*0.92,sp,PLUM,True)
    elif cap=="onion":
        rect(x-w*0.36,x+w*0.36,h,h+8,"url(#wall)"); onion(x,h+8,w*0.9,w*1.05); spire(x,h+8+w*1.05,1.4,sp,GOLD,True)
    elif cap=="witch": cone(x,h,w,sp)
TR="#4a1a3a"
def greatwin(cx,w,h0,h1,g="url(#flow)"):
    """A great window: flowing glass in a pointed arch, split into two lancet lights under a rose, gold trim."""
    parch(cx,w+3,h0-1.5,h1+2.4,RG,"none")
    parch(cx,w,h0,h1,g,GOLD,.6)
    lw=w*0.42; spring=h1-w*0.8
    for s in (-1,1):
        lx=cx+s*w*0.24
        parch(lx,lw*0.82,h0+1.5,spring+lw*0.35,"none",TR,.5)
    a(f'<line x1="{cx}" y1="{Y(h0)}" x2="{cx}" y2="{Y(spring+w*0.18)}" stroke="{TR}" stroke-width=".9"/>')
    rr=w*0.24; ry=spring+w*0.38
    a(f'<circle cx="{cx}" cy="{Y(ry)}" r="{rr}" fill="none" stroke="{TR}" stroke-width=".6"/>')
    for k in range(8):
        import math
        an=k*math.pi/4
        a(f'<circle cx="{cx+math.cos(an)*rr*0.55:.2f}" cy="{Y(ry)+math.sin(an)*rr*0.55:.2f}" r="{rr*0.36:.2f}" fill="none" stroke="{TR}" stroke-width=".35"/>')
    a(f'<circle cx="{cx}" cy="{Y(ry)}" r="{rr*0.25}" fill="#fff0c8" stroke="{TR}" stroke-width=".35"/>')
    for k in range(1,7):   # transoms on the lights
        hh=h0+k*(spring-h0)/7
        a(f'<line x1="{cx-w/2+1}" y1="{Y(hh)}" x2="{cx+w/2-1}" y2="{Y(hh)}" stroke="{TR}" stroke-width=".3"/>')
    a(f'<ellipse cx="{cx}" cy="{Y((h0+h1)/2)}" rx="{w*0.35}" ry="{(h1-h0)*0.4}" fill="#fff6d0" opacity=".14" filter="url(#bl)"/>')
def tower(x,w,base,h,cap,capH,skip=None,lh=22,gl="url(#flow)"):
    rect(x-w/2,x+w/2,base,h,"url(#wall)")
    for f in (-0.5,0.5): rect(x+f*w-0.8,x+f*w+0.8,base,h,SHADE)
    hh=base+10
    while hh+lh<h-8:
        if not (skip and hh+lh>skip[0] and hh<skip[1]):
            n=max(1,int(w//10))
            for k in range(n):
                cx=x-w/2+(k+0.5)*w/n
                flowlancet(cx,min(3.6,w/n*0.42),hh,hh+lh,gl if k%2==0 else "url(#flow2)")
        hh+=lh+12
    # machicolation band and parapet
    rect(x-w/2-1.4,x+w/2+1.4,h-6,h-3,WHITE)
    for k in range(int(x-w/2),int(x+w/2)+1,3): parch(k+1.5,2.2,h-6,h-4.6,"#5a2a4a","none")
    rect(x-w/2-1.5,x+w/2+1.5,h-3,h,"url(#girih)")
    if cap=="gothic":
        for f in (-0.5,0.5): spire(x+f*w,h,w*0.12+1,capH*0.3,ROOF)
        spire(x,h,w*1.0,capH,PLUM,True)
        a(f'<line x1="{x}" y1="{Y(h+capH)}" x2="{x}" y2="{Y(h+capH*1.18+3)}" stroke="{GOLD}" stroke-width=".8"/>')
    elif cap=="onion":
        onion(x,h+1,w*1.15,capH); a(f'<line x1="{x}" y1="{Y(h+1+capH)}" x2="{x}" y2="{Y(h+capH*1.18+4)}" stroke="{GOLD}" stroke-width=".7"/>')
    elif cap=="witch": cone(x,h,w,capH)
# ---- ground, lake, forest ----
rect(-262,398,-35,0,"#22284e")
import random as R
R.seed(9)
for i in range(40):
    x=R.uniform(-260,390); y=R.uniform(-30,-3)
    a(f'<line x1="{x:.1f}" y1="{y:.1f}" x2="{x+R.uniform(4,14):.1f}" y2="{y:.1f}" stroke="#ffc2d6" stroke-width=".4" opacity=".5"/>')
R.seed(5)
for i in range(110):
    x=R.choice([R.uniform(-262,-228),R.uniform(232,262)])
    h=R.uniform(20,80)
    a(f'<path d="M{x-h*0.4:.1f} 0 Q{x:.1f} {-h*1.4:.1f} {x+h*0.4:.1f} 0 Z" fill="#14281e"/>')
    if R.random()<.5: a(f'<circle cx="{x:.1f}" cy="{-h*0.6:.1f}" r="1" fill="{R.choice(["#ff9ed0","#9ef0ff"])}"/>')
# ---- back towers first (furthest) ----
tower(-136,40,90,258,"witch",50)
tower(134,38,90,266,"gothic",58)
tower(150,30,90,240,"onion",36)
tower(-98,32,90,240,"onion",40)
# ---- hall mass tying the crown together, 290 m wide, to 222 m ----
rect(-145,145,90,222,"url(#wall)"); rect(-147,147,222,225,"url(#girih)")
for (dx,r) in [(-66,11),(112,10),(-90,12),(20,9)]:
    rect(dx-r,dx+r,225,237,"url(#wall)"); onion(dx,237,r*2.1,r*2.4)
# ---- central DOME tower (wider, 96 m) with three 80 m windows ----
DX=-14
tower(DX,96,90,326,"none",0,skip=(226,322))
for k in (-1,0,1): greatwin(DX+k*31,24,232,312,"url(#flow2)" if k else "url(#flow)")
rect(DX-50,DX+50,326,330,GOLD)
rect(DX-36,DX+36,330,348,"url(#wall)")
for i in range(-4,5): parch(DX+i*7.6,3.8,333,345,"url(#flow2)","#3a1a40",.2)
rect(DX-38,DX+38,346,349,"url(#girih)")
onion(DX,349,68,84)          # dome radius 34 m
spire(DX,433,3,27,GOLD,True)
a(f'<circle cx="{DX}" cy="{Y(445)}" r="2.6" fill="{GOLD}"/>')
# ---- the taller CONE tower (56 m wide) with an 80 m window ----
tower(66,56,90,402,"gothic",112,skip=(226,322))
greatwin(66,26,236,316,"url(#flow)")
# ---- courtyard towers rising from the stair foot (back pair first) ----
for (x,w,H,cap,cf) in [(-199,22,150,"onion",.22),(204,28,215,"gothic",.25),(-206,26,190,"witch",.24),(220,22,160,"witch",.24)]:
    capH=H*cf; h=H-capH-1
    tower(x,w,0,h,cap,capH)
    for hb in (h*0.38,h*0.66):
        rect(x-w/2-5,x+w/2+5,hb-1.2,hb,WHITE)
        for k in range(int(x-w/2-5),int(x+w/2+6),2): rect(k-.15,k+.15,hb,hb+2.6,WHITE)
# ---- tiered base: three levels with ring walkways ----
for (h0,h1,hw) in [(0,30,184),(30,60,178),(60,90,172)]:
    rect(-hw,hw,h0,h1,"url(#wall)")
    for k in range(int(-hw)+6,int(hw)-5,9):
        if abs(k)<36: continue
        parch(k,5,h0+3,h1-8,"#ffc2a8","#7a3a5a",.25)
    a(f'<path d="M{-hw-6} {Y(h1)} Q 0 {Y(h1)+5} {hw+6} {Y(h1)} L{hw+6} {Y(h1)-2.4} Q 0 {Y(h1)+2.6} {-hw-6} {Y(h1)-2.4} Z" fill="{WHITE}" stroke="#d8c8d0" stroke-width=".3"/>')
    for k in range(int(-hw)-4,int(hw)+5,3):
        dy=5*(1-(k/(hw+6))**2)
        a(f'<line x1="{k}" y1="{Y(h1)+dy-2.4:.2f}" x2="{k}" y2="{Y(h1)+dy-5.2:.2f}" stroke="{WHITE}" stroke-width=".5"/>')
    a(f'<path d="M{-hw-6} {Y(h1)-5.4} Q 0 {Y(h1)-0.4} {hw+6} {Y(h1)-5.4}" fill="none" stroke="{WHITE}" stroke-width=".7"/>')
    for k in range(int(-hw)+4,int(hw)-3,14):
        if abs(k)<38: continue
        dy=5*(1-(k/(hw+6))**2); yb=Y(h1)+dy-2.4
        a(f'<circle cx="{k}" cy="{yb-5:.1f}" r="4.2" fill="#2f6a44"/><circle cx="{k+3}" cy="{yb-7:.1f}" r="3" fill="#3f8a54"/><circle cx="{k+1}" cy="{yb-7:.1f}" r=".7" fill="#ff9ed0"/>')
        tx=k+7
        a(f'<rect x="{tx-1.6}" y="{yb-2.6:.1f}" width="3.2" height=".5" fill="#f0e0c0"/><line x1="{tx}" y1="{yb-2.1:.1f}" x2="{tx}" y2="{yb:.1f}" stroke="#f0e0c0" stroke-width=".3"/>')
        for s in (-1,1): a(f'<path d="M{tx+s*2.6} {yb-3.4:.1f} l0 3.4 M{tx+s*2.6} {yb-1.4:.1f} l{-s*1.2} 0 l0 1.4" fill="none" stroke="#e0c090" stroke-width=".3"/>')
# ---- grand stair with the water channel ----
for k in range(18):
    hh=k*5; wd=34-k*0.33
    rect(-wd,wd,hh,hh+5,"#f3e6ea","#c8b0bc",.2)
rect(-3,3,0,90,"#9fd8ff",op=.9)
for k in range(1,6):
    hh=k*15; rect(-7,7,hh-1,hh,"#bfe8ff")
    for j in (-4,0,4): a(f'<path d="M{j} {Y(hh)} q -1.5 -5 0 -7 q 1.5 2 0 7" fill="#dff4ff" opacity=".85"/>')
a('<ellipse cx="0" cy="-1" rx="16" ry="2.5" fill="#9fd8ff"/>')
# ---- front wall: 308 m long, 90 -> 215 m, four 42 x 75 m great windows ----
rect(-154,-40,90,215,"url(#wall)"); rect(40,154,90,215,"url(#wall)")
for s in (-1,1):
    x0,x1=sorted((s*40,s*154))
    rect(x0,x1,100,102.4,"url(#girih)"); rect(x0,x1,189,191.4,"url(#girih)")
    rect(x0-0.5,x1+0.5,215,218,"#d8b0c0")
    xx=55
    while xx<=154.01:
        spire(s*xx,218,4.4,18,ROOF); xx+=18.3
    for wx in (74,126): greatwin(s*wx,42,108,183,"url(#flow)" if wx==74 else "url(#flow2)")
    # small lancets between the great windows and beside the frame
    for lx in (47,100,149): flowlancet(s*lx,3,112,150,"url(#flow2)")
# corner towers closing the wall
tower(-162,17,90,240,"onion",30)
tower(162,17,90,240,"gothic",46)
# ---- gate frame: gable to 262 m, pinnacle turrets to 286 m ----
a(f'<path d="M-40 {Y(90)} L-40 {Y(235)} L0 {Y(262)} L40 {Y(235)} L40 {Y(90)} Z" fill="#f8e2ea" stroke="{GOLD}" stroke-width="1.4"/>')
parch(0,20,200,232,"url(#glass)",GOLD,.6)   # rose-glass lunette in the gable
a(f'<circle cx="0" cy="{Y(244)}" r="6" fill="url(#flow2)" stroke="{GOLD}" stroke-width=".6"/>')
for x in (-44,44):
    tower(x,11,90,258,"gothic",28,lh=14)
cx,w,h0,h1=0,56,90,190
r=w*0.9; spring=h1-w*0.8
arch=f"M{cx-w/2} {Y(h0)} L{cx-w/2} {Y(spring)} A{r} {r} 0 0 1 {cx} {Y(h1)} A{r} {r} 0 0 1 {cx+w/2} {Y(spring)} L{cx+w/2} {Y(h0)} Z"
a(f'<clipPath id="gateclip"><path d="{arch}"/></clipPath><path d="{arch}" fill="#2a1a3a"/><g clip-path="url(#gateclip)">')
pal=["#2f5ad8","#4a8af0","#f2c84b","#ffe08a","#7a3ad0","#a86af0","#3a3ab0","#e8b030","#5a2a9a"]
R.seed(42); step=4.2
ys=[h0+i*step for i in range(int((h1-h0)/step)+2)]; xs=[cx-w/2+i*step for i in range(int(w/step)+2)]
J={(i,j):(xv+R.uniform(-1.6,1.6),yv+R.uniform(-1.6,1.6)) for i,yv in enumerate(ys) for j,xv in enumerate(xs)}
for i in range(len(ys)-1):
    for j in range(len(xs)-1):
        p00,p01,p10,p11=J[(i,j)],J[(i,j+1)],J[(i+1,j)],J[(i+1,j+1)]
        for tri in ((p00,p01,p11),(p00,p11,p10)) if R.random()<.5 else ((p00,p01,p10),(p01,p11,p10)):
            a(f'<polygon points="{" ".join(f"{x:.2f},{Y(yv):.2f}" for x,yv in tri)}" fill="{R.choice(pal)}" stroke="#1a1028" stroke-width=".35"/>')
a(f'<ellipse cx="0" cy="{Y(140)}" rx="24" ry="44" fill="#fff6d0" opacity=".18" filter="url(#bl)"/></g>')
a(f'<path d="{arch}" fill="none" stroke="{GOLD}" stroke-width="1.6"/><line x1="0" y1="{Y(90)}" x2="0" y2="{Y(189)}" stroke="{GOLD}" stroke-width="1.2"/>')
for hh in (110,130,150,170): a(f'<line x1="{-w/2}" y1="{Y(hh)}" x2="{w/2}" y2="{Y(hh)}" stroke="{GOLD}" stroke-width=".5"/>')
# ---- window-size callout ----
def bracket(x,y0,y1,label,side=1):
    a(f'<path d="M{x} {Y(y0)} h{side*3} V{Y(y1)} h{-side*3}" fill="none" stroke="#fff" stroke-width=".5"/><text x="{x+side*5}" y="{Y((y0+y1)/2)+1.5}" font-size="4.4" fill="#fff" text-anchor="{"start" if side>0 else "end"}">{label}</text>')
bracket(84,236,316,"80 m",1)
# dims
def dim(h,label):
    a(f'<line x1="268" y1="{Y(h)}" x2="274" y2="{Y(h)}" stroke="#ffe0ea" stroke-width=".4"/><text x="277" y="{Y(h)+1.6}" font-size="5.2" fill="#ffe0ea">{label}</text>')
a(f'<line x1="271" y1="0" x2="271" y2="{Y(514)}" stroke="#ffe0ea" stroke-width=".35"/>')
for h,l in [(0,"0 stair foot"),(30,"30 ring walk 1"),(60,"60 ring walk 2"),(90,"90 ring walk 3, gate sill"),(108,"108 great window sills (42 x 75 m)"),(190,"190 gate apex (100 m)"),(215,"215 front wall top"),(262,"262 gate gable"),(326,"326 dome tower"),(432,"432 dome top, r 34 m"),(402,"402 cone tower"),(514,"514 cone tip")]:
    dim(h,l)
a('<text x="-255" y="-572" font-size="12" fill="#ffe0ea" font-weight="bold">Birthday Castle v4 · south elevation</text>')
a('<text x="-255" y="-560" font-size="5.6" fill="#e0c8e0">taller and wider than v3 · 308 m front wall, 125 m tall · four 75 m great windows · 80 m windows on the dome and cone towers · cone tip 514 m</text>')
a('<rect x="-235" y="-1.7" width=".5" height="1.7" fill="#fff"/><text x="-250" y="-4" font-size="4" fill="#fff">player 1.7 m</text>')
a('<line x1="-255" y1="24" x2="-155" y2="24" stroke="#fff" stroke-width=".7"/><text x="-217" y="20" font-size="5" fill="#fff">100 m</text>')
a('</svg>')
open('castle-elevation-v4.svg','w').write("\n".join(W))
