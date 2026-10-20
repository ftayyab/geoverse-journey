"""Create an editorial still from the clearly labelled illustrated preview, not from WebGL."""
import pathlib,re,io
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import cairosvg
root=pathlib.Path(__file__).resolve().parents[1]
html=(root/'illustrative-preview.html').read_text()
svg=re.search(r'(<svg viewBox="0 0 1600 900".*?</svg>)',html,re.S).group(1)
svg=svg.replace('<svg viewBox','<svg xmlns="http://www.w3.org/2000/svg" viewBox',1)
svg=svg.replace('role="img"','')
png=cairosvg.svg2png(bytestring=svg.encode('utf-8'),output_width=1600,output_height=900)
scene=Image.open(io.BytesIO(png)).convert('RGBA')
canvas=Image.new('RGBA',(1600,900));grad=Image.new('RGBA',(1600,900));px=grad.load()
for y in range(900):
 for x in range(1600):
  t=y/900*0.6+x/1600*.4
  px[x,y]=(int(249*(1-t)+210*t),int(249*(1-t)+221*t),int(253*(1-t)+240*t),255)
canvas.alpha_composite(grad);canvas.alpha_composite(scene)
fg=Image.new('RGBA',canvas.size,(0,0,0,0));draw=ImageDraw.Draw(fg)
def font(size,bold=False):
 name='/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold.ttf' if bold else '.ttf')
 return ImageFont.truetype(name,size)
def text(x,y,s,size=18,color='#294750',bold=False):draw.text((x,y),s,font=font(size,bold),fill=color)
def rr(a,fill,outline=None,r=14,width=1):draw.rounded_rectangle(a,radius=r,fill=fill,outline=outline,width=width)
# headers
rr((28,21,313,86),'#fffdf0ed',r=15)
rr((39,32,88,77),'#c5ebdd',r=12);text(54,35,'G',29,'#6859ae',True)
text(101,33,'GEOVERSE',21,'#38476f',True);text(102,61,'THE CAREER JOURNEY',10,'#829c92',True)
rr((1190,24,1575,75),'#fffcf0eb',r=14)
text(1207,42,'ILLUSTRATIVE CONCEPT PREVIEW',14,'#8a9e98',True)
# Intro hero left overlay
text(35,186,'THE INTERACTIVE CAREER UNIVERSE',13,'#6ca18c',True)
text(34,222,'A colorful career.',37,'#263f47',True);text(34,277,'Many worlds.',45,'#a07ad2',True)
text(35,341,'Where GIS, engineering, cloud,',15,'#6b8786')
text(35,366,'data and GeoAI become places',15,'#6b8786')
text(35,391,'you can explore.',15,'#6b8786')
rr((35,445,244,501),'#6b69bb',r=28);text(60,464,'START JOURNEY  →',15,'#fff8eb',True)
# connect button
rr((1325,116,1574,170),'#c92439ef',r=14);text(1344,133,'☎  LONDON PHONE BOX ↗',15,'white',True)
# bottom dock
rr((27,737,1574,878),'#fffdf4f5',r=17)
text(49,751,'✳  CAREER TIMELINE',15,'#42645f',True)
text(1339,751,'12 CHAPTERS   /   6 WORLDS',12,'#7b938a',True)
import json
data=json.loads((root/'public/world-data.json').read_text())
entries=data['timeline']
start=39;space=127
for i,e in enumerate(entries):
 x=start+i*space
 fill='#615d9b' if i==0 else '#f1f1fc'
 rr((x,790,x+121,853),fill,r=9)
 yr=e['years']; nm=e['company']
 if len(nm)>18:nm=nm[:15]+'...'
 text(x+9,801,yr,11,'#dfc19b' if i==0 else '#869f94',True)
 text(x+9,825,nm,10,'#fefaff' if i==0 else '#536e6b',True)
# simple footer
text(50,891,'GEOVERSE JOURNEY  •  THREE.JS SOURCE INCLUDED',8,'#849f96',True)
canvas.alpha_composite(fg)
canvas.convert('RGB').save(root/'concept-overview.png',quality=94)
print('Wrote concept-overview.png')
