import numpy as np, colorsys
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from layout_data import *
MAP='/mnt/project-files/art-references/owner-sketches/04-world-plan-starlight-coast.png'
def derive():
    im=Image.open(MAP).convert('RGB'); a=np.asarray(im).astype(float)/255
    r,g,b=a[...,0],a[...,1],a[...,2]
    mx=a.max(2); mn=a.min(2); sat=(mx-mn)/(mx+1e-6)
    # hue
    hue=np.zeros_like(mx); d=mx-mn+1e-6
    hue=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60
    wat=((b>r+0.07)&(b>=g-0.05)&(b>0.2)&(hue>165)&(hue<250)).astype(float)
    sea=ndi.gaussian_filter(wat,3)>0.5
    # drop thin rivers / ponds: keep only large water bodies
    sea=ndi.binary_opening(sea,iterations=4)
    lw_,nw=ndi.label(sea); wsz=ndi.sum(sea,lw_,range(1,nw+1))
    sea=np.isin(lw_,[i+1 for i,s_ in enumerate(wsz) if s_>3500])
    # paper-coloured, featureless pixels are the map margin, not land
    br=a.mean(2); m1=ndi.uniform_filter(br,7); m2=ndi.uniform_filter(br*br,7); sd=np.sqrt(np.maximum(m2-m1*m1,0))
    paper=(br>0.86)&(sat<0.18)&(sd<0.025)
    H,W=sea.shape
    excl=np.zeros_like(sea)
    for (x0,y0,x1,y1) in [(0,0,480,110),(1050,190,1254,410),(1060,0,1254,190),(0,1000,300,1254),(480,1165,780,1254),
                          (15,95,265,245),(535,0,740,140),(835,85,1030,225),(1030,1100,1254,1254),(0,0,1254,95),(1060,0,1254,330)]:
        excl[y0:y1,x0:x1]=True
    excl[:35,:]=True; excl[-35:,:]=True; excl[:,:35]=True; excl[:,-35:]=True
    land=(~sea)&(~excl)&(~paper)
    yy,xx=np.mgrid[0:H,0:W]
    for c,(n,x,z,w,dd) in LANDMARKS.items():
        px,py=PX0+x/MPP,PZ0+z/MPP; rad=max(6,max(w,dd)/2/MPP*0.8)
        land|=((xx-px)**2+(yy-py)**2)<rad**2
    land=ndi.binary_opening(land,iterations=2)
    lab,n=ndi.label(land); sizes=ndi.sum(land,lab,range(1,n+1))
    keep=np.isin(lab,[i+1 for i,s in enumerate(sizes) if s>80]); land=keep
    # water pixels inside the frame that are not land: sea/lake
    inland=ndi.distance_transform_edt(land); insea=ndi.distance_transform_edt(~land)
    gray=(sat<0.2)&(mx>0.22)&(mx<0.6)
    cliff=((hue>5)&(hue<35)&(sat>0.4))
    rough=ndi.gaussian_filter((gray&(inland>12)).astype(float),6)*1.0
    cl=ndi.gaussian_filter((cliff&(inland>8)).astype(float),5)
    h=(1-np.exp(-inland/22))*70 + rough*400 + cl*160
    h=ndi.gaussian_filter(h,2.5)
    depth=-np.minimum(3+insea*0.9,70)
    hf=np.where(land,np.maximum(h,2.0),depth)
    return hf,land,im
def w2px(x1,z1): return PX0+x1/MPP, PZ0+z1/MPP
if __name__=='__main__':
    hf,land,im=derive()
    out=Image.fromarray((land*255).astype('uint8')).convert('RGB'); d=ImageDraw.Draw(out)
    bad=[]
    for c,(n,x,z,w,dd) in LANDMARKS.items():
        px,py=w2px(x,z); on=land[int(py),int(px)]
        d.ellipse([px-6,py-6,px+6,py+6],fill=(255,60,60) if not on else (60,200,60)); d.text((px+8,py-5),c,fill=(255,255,0))
        if not on: bad.append(c)
    print('land fraction',land.mean().round(3),'landmarks not on land:',bad)
    px,py=w2px(0,0); d.ellipse([px-8,py-8,px+8,py+8],fill=(255,0,255))
    both=Image.new('RGB',(2*im.width,im.height)); both.paste(im,(0,0)); both.paste(out,(im.width,0))
    both.resize((1600,800)).save('mask-check.png')
