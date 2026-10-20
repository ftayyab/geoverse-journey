"""Illustrated terrain-height render only. Not a screenshot of the WebGL app."""
import json, math, random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
ROOT=Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'tools/terrain-preview-data.json').read_text())
W,H=1600,920
random.seed(90)
img=Image.new('RGB',(W,H),'#0d3340');d=ImageDraw.Draw(img)
for y in range(H):
 t=y/H;d.line((0,y,W,y),fill=(int(9+31*t),int(39+24*t),int(51+31*t)))
# stars - deliberately restrained
for _ in range(950):
 x=random.randrange(W);y=random.randrange(0,700);r=random.choice([0.5,0.5,0.7,1.2]);c=random.choice(['#52787c','#73999b','#a5cac3','#d1d4aa'])
 d.ellipse((x-r,y-r,x+r,y+r),fill=c)
# hazy terrain halo
halo=Image.new('RGBA',(W,H));hd=ImageDraw.Draw(halo)
hd.ellipse((90,90,1540,940),fill=(65,193,175,32));halo=halo.filter(ImageFilter.GaussianBlur(140));img=Image.alpha_composite(img.convert('RGBA'),halo);d=ImageDraw.Draw(img)

def iso(x,z,y=0):return (820+(x-z)*3.0,479+(x+z)*1.04-y*7.7)
NX,NZ=data['NX'],data['NZ'];heights=data['heights']
# smooth height-coded color palette
palette=[(0,(53,140,140)),(.16,(86,167,158)),(.32,(131,180,150)),(.50,(170,179,141)),(.68,(209,194,146)),(.83,(237,216,168)),(1,(250,235,190))]
def color(h,light):
 t=max(0,min(1,(h-1)/30)); idx=next((i for i in range(1,len(palette)) if palette[i][0]>=t),len(palette)-1)
 a,ac=palette[idx-1];b,bc=palette[idx];q=(t-a)/(b-a)
 c=[ac[k]*(1-q)+bc[k]*q for k in range(3)]
 return tuple(max(0,min(255,int(v*light))) for v in c)
# Sidewalls silhouette. The surface covers it on top.
front=[iso(-125+i*250/NX,75,heights[-1][i]) for i in range(NX+1)]
back=[iso(-125+i*250/NX,75,-10) for i in range(NX+1)]
d.polygon(front+list(reversed(back)),fill='#4a626a')
edge=[iso(125,-75+j*150/NZ,heights[j][-1]) for j in range(NZ+1)]
low=[iso(125,-75+j*150/NZ,-10) for j in range(NZ+1)]
d.polygon(edge+list(reversed(low)),fill='#38535a')
# Painter's ordering for the triangulated surface.
triangles=[]
for iz in range(NZ):
 for ix in range(NX):
  x=-125+ix*250/NX;z=-75+iz*150/NZ;dx=250/NX;dz=150/NZ
  a=(x,z,heights[iz][ix]);b=(x+dx,z,heights[iz][ix+1]);c=(x+dx,z+dz,heights[iz+1][ix+1]);e=(x,z+dz,heights[iz+1][ix]);
  h=sum([a[2],b[2],c[2],e[2]])/4
  light=1.0+.10*math.sin(ix*.13)+.09*math.cos(iz*.17)
  triangles.append((x+z+dx+dz, (iso(*a),iso(*b),iso(*c),iso(*e)),color(h,light)))
triangles.sort(key=lambda it:it[0])
for _,quad,col in triangles:d.polygon(quad,fill=col)
# Pale hand-drawn elevation lines, extracted from exactly the same height grid.
for level in [4,7,10,13,16,19,22,25,28]:
 for iz in range(NZ):
  for ix in range(NX):
   x=-125+ix*250/NX;z=-75+iz*150/NZ;dx=250/NX;dz=150/NZ
   pts=[(x,z,heights[iz][ix]),(x+dx,z,heights[iz][ix+1]),(x+dx,z+dz,heights[iz+1][ix+1]),(x,z+dz,heights[iz+1][ix])]
   crossings=[]
   for j in range(4):
    p,q=pts[j],pts[(j+1)%4]
    if (p[2]-level)*(q[2]-level)>=0 or p[2]==q[2]:continue
    t=(level-p[2])/(q[2]-p[2]);crossings.append(iso(p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t,level+.16))
   if len(crossings)>=2:
    for j in range(0,len(crossings)-1,2):d.line((crossings[j],crossings[j+1]),fill=(234,232,191,185),width=1)

fpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
fbold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f24=ImageFont.truetype(fbold,24);f17=ImageFont.truetype(fbold,17);f13=ImageFont.truetype(fpath,13);f12=ImageFont.truetype(fpath,12)
# GPS / mission pins: visual sample of physical site altitudes.
colors={'Education':'#eccf8e','Career':'#98e1cf','Secondment':'#d2adf6','Current chapter':'#e8a1ce'}
for i,item in enumerate(data['timeline']):
 x,z=item['location'];j=max(0,min(NZ,round((z+75)*NZ/150)));k=max(0,min(NX,round((x+125)*NX/250)))
 y=heights[j][k];px,py=iso(x,z,y);c=colors.get(item['kind'],'#d7ebc6');r=6
 d.ellipse((px-15,py-5,px+15,py+5),outline=c,width=2)
 d.line((px,py-2,px,py-24),fill=c,width=2)
 d.ellipse((px-r,py-30-r,px+r,py-30+r),fill=c)
 # Show representative company labels; avoid unreadable overlapping microtext.
 if i in (0,2,3,5,7,8,9,11):
  name=item['company'].replace('University of Nottingham','Nottingham')
  bbox=d.textbbox((0,0),name,font=f12);tw=bbox[2]-bbox[0];tx=px-tw/2-8;ty=py-57
  d.rounded_rectangle((tx,ty,tx+tw+16,ty+24),radius=7,fill='#143e4c',outline=c,width=1)
  d.text((tx+8,ty+5),name,font=f12,fill='#f5f3da')
# Domain elevations: vivid but restrained.
for it in data['domains']:
 x,z=it['location'];j=max(0,min(NZ,round((z+75)*NZ/150)));k=max(0,min(NX,round((x+125)*NX/250)))
 px,py=iso(x,z,heights[j][k]);c=it['color'];
 d.ellipse((px-9,py-9,px+9,py+9),outline=c,width=3)
 d.line((px,py-9,px,py-23),fill=c,width=2)
 d.ellipse((px-4,py-28,px+4,py-20),fill=c)
# Header/bottom plate UI
d.rounded_rectangle((40,34,550,156),radius=18,fill='#123c48',outline='#60988f',width=2)
d.text((61,54),'FAIZAN TAYYAB  /  GEOVERSE JOURNEY',font=f17,fill='#e5edda')
d.text((61,89),'THE TOPOGRAPHY EDITION',font=f24,fill='#f2d7a5')
d.text((62,124),'Real heightfield  •  contour lines  •  elevated mini-worlds',font=f12,fill='#a8d6c9')
d.rounded_rectangle((1080,45,1550,139),radius=17,fill='#113a47',outline='#699e9f',width=2)
d.text((1100,62),'SCULPTED 3D TERRAIN',font=f17,fill='#f2e2c0')
d.text((1100,92),'Each career station sits at its own elevation.',font=f13,fill='#bde0d0')
d.text((1100,113),'Loading bar prepares shaders and first frame.',font=f12,fill='#9ecac3')
d.rounded_rectangle((40,825,1560,885),radius=18,fill='#153f4b',outline='#5e8f8f',width=2)
d.text((60,843),'12 EDUCATION & CAREER CHAPTERS     /     6 DOMAIN WORLDS     /     CERTIFICATIONS & SKILLS     /     LONDON PHONE BOX → LINKEDIN',font=f13,fill='#eef0db')
img.convert('RGB').save(ROOT/'terrain-topography-preview.png',optimize=True)
print('Illustrative terrain preview saved')
