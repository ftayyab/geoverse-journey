"""Produce an honest, dependency-free *illustrative* browser preview, not a WebGL render."""
import json, math, random, html, pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'public/world-data.json').read_text())
random.seed(12)
W,H=1600,900

def xy(x,z,y=0):return (790+(x-z)*3.65, 398+(x+z)*1.3-y*5.8)
def pt(x,z,y=0):
 a,b=xy(x,z,y);return f'{a:.1f},{b:.1f}'
def polygon(coords,fill,cls='',stroke='none',width=1):return f'<polygon points="{coords}" fill="{fill}" stroke="{stroke}" stroke-width="{width}" class="{cls}"/>'
def circ(cx,cy,r,fill,opacity=1,stroke='none',sw=1):return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r}" fill="{fill}" opacity="{opacity}" stroke="{stroke}" stroke-width="{sw}"/>'
def pathLine(points,color,width,opacity=1,dash=''):
 ps=' '.join(f'{x:.1f},{y:.1f}' for x,y in points)
 return f'<polyline points="{ps}" fill="none" stroke="{color}" stroke-width="{width}" opacity="{opacity}" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="{dash}"/>'
def cube(x,z,w,d,h,col='#acc6bd',roof='#e2dbc8'):
 # 3D rectangular building using properly projected isometric faces, not a flat symbol
 base=[xy(x-w/2,z-d/2),xy(x+w/2,z-d/2),xy(x+w/2,z+d/2),xy(x-w/2,z+d/2)]
 top=[(a,b-h*5.8) for a,b in base]
 fmt=lambda arr:' '.join(f'{a:.1f},{b:.1f}' for a,b in arr)
 return (polygon(fmt([base[1],base[2],top[2],top[1]]),'#829b96')+
 polygon(fmt([base[2],base[3],top[3],top[2]]),'#7c958e')+
 polygon(fmt(top),roof,stroke='#f5ede0',width=.8))
svg=[]
svg.append('''<defs>
<linearGradient id="land" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#b1dbbd"/><stop offset=".52" stop-color="#85c9b0"/><stop offset="1" stop-color="#e7dca3"/></linearGradient>
<linearGradient id="sky" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fbfaf5"/><stop offset="1" stop-color="#cadcf2"/></linearGradient>
<filter id="drop"><feGaussianBlur stdDeviation="17"/></filter>
</defs>''')
rect=[(-125,-75),(125,-75),(125,75),(-125,75)]
def polypt(arr,dy=0):return ' '.join(f'{xy(x,z)[0]:.1f},{xy(x,z)[1]+dy:.1f}' for x,z in arr)
svg.append(polygon(polypt(rect,35),'#869d9c',stroke='#849b92',width=2))
svg.append(polygon(polypt(rect,23),'#d7a186',stroke='#a87878',width=1.5))
svg.append(polygon(polypt(rect),'url(#land)',stroke='#edf0cf',width=5))
# Friendly texture of low hills
blocked=[item['location'] for item in data['timeline']+data['domains']]
for i in range(260):
 x=random.uniform(-121,121);z=random.uniform(-68,68)
 if any(math.dist([x,z],loc)<8.4 for loc in blocked):continue
 a,b=xy(x,z)
 svg.append(f'<ellipse cx="{a:.1f}" cy="{b:.1f}" rx="{random.randint(3,12)}" ry="{random.randint(2,6)}" fill="{random.choice(["#ffe0ad","#69c2ab","#8accae","#f9d99a","#d6bbba"])}" opacity=".28"/>')
# little trees, pine and blossom shapes
for i in range(135):
 x=random.uniform(-119,119);z=random.uniform(-67,67)
 if any(math.dist([x,z],loc)<10.5 for loc in blocked):continue
 if math.dist([x,z],[3,-10])<10 or math.dist([x,z],[-67,-11])<16:continue
 a,b=xy(x,z)
 if random.random()<.68:
  svg.append(f'<path d="M{a:.1f} {b:.1f} l0 -15" stroke="#795f59" stroke-width="2"/>')
  svg.append(circ(a,b-17,8,random.choice(['#2dad97','#65c6a1','#ca8be0','#f39b76','#efc45b']),.95))
  svg.append(circ(a-3,b-19,4,'#ffffff',.12))
 else:
  svg.append(polygon(f'{a:.1f},{b-23:.1f} {a-7:.1f},{b-3:.1f} {a+7:.1f},{b-3:.1f}',random.choice(['#59958b','#73998e','#779f75'])))
# Road ribbons, navigation timeline
p=[xy(*c['location']) for c in data['timeline']]
svg.append(pathLine([(x+3,y+9) for x,y in p],'#6a7775',19,.2))
svg.append(pathLine(p,'#cd9d86',18))
svg.append(pathLine(p,'#fff0d1',13))
svg.append(pathLine(p,'#f8e4c6',1.7,.92,'3,10'))
# Decorative pads / individual subworlds
for i,d in enumerate(data['domains']):
 x,z=d['location'];a,b=xy(x,z);c=d['color']
 svg.append(f'<ellipse cx="{a:.1f}" cy="{b+3:.1f}" rx="39" ry="18" fill="#586c72" opacity=".15"/>')
 svg.append(f'<ellipse cx="{a:.1f}" cy="{b:.1f}" rx="42" ry="19" fill="#f9e2c5" stroke="{c}" stroke-width="3"/>')
 svg.append(f'<ellipse cx="{a:.1f}" cy="{b-3:.1f}" rx="35" ry="13" fill="#d4e4ce"/>')
 # Magic gateway and complex unique structure
 svg.append(cube(x-3,z+3,4,3,random.uniform(2.7,4.2),c))
 svg.append(cube(x+3,z-2,3.4,4,random.uniform(3.1,5.0),'#779c9c'))
 svg.append(pathLine([xy(x-4,z-6,6),xy(x,z-7,8.7),xy(x+4,z-6,6)],c,3,.88))
 svg.append(circ(a,b-57,6,c))
 # world name banner small
 svg.append(f'<rect x="{a-48:.1f}" y="{b-82:.1f}" rx="8" width="96" height="23" fill="#f9f7ee" stroke="{c}" stroke-width="1.2"/>')
 svg.append(f'<text x="{a:.1f}" y="{b-66:.1f}" text-anchor="middle" font-size="11" font-weight="800" fill="#2c4c52">{html.escape(d["name"][:15])}</text>')
# timeline stops company mini-dioramas
for i,t in enumerate(data['timeline']):
 x,z=t['location'];a,b=xy(x,z);c=t['color']
 svg.append(f'<ellipse cx="{a:.1f}" cy="{b+7:.1f}" rx="40" ry="20" fill="#273e43" opacity=".14"/>')
 svg.append(f'<ellipse cx="{a:.1f}" cy="{b:.1f}" rx="36" ry="16" fill="#efdbc0" stroke="{c}" stroke-width="3"/>')
 svg.append(cube(x-1,z-1,6.5,6,random.uniform(3.5,5.2),c,'#e5e4d5'))
 if i%3==0:
  svg.append(cube(x+3,z-2,2.7,3.4,4,'#8facaa','#f8dfb8'))
 elif i%3==1:
  svg.append(circ(a+10,b-36,10,c,.7))
 else:
  svg.append(pathLine([xy(x+4,z+1,0),xy(x+4,z+1,5)],'#fff5d6',3))
 svg.append(f'<rect x="{a-43:.1f}" y="{b-78:.1f}" width="86" height="23" rx="7" fill="#2c4650" stroke="#f4e6d0" stroke-width="1"/>')
 name=t['company'].replace('University of Nottingham','Nottingham').replace('Wood Mackenzie','Wood Mackenzie')
 if len(name)>16:name=name[:15]+'…'
 svg.append(f'<text x="{a:.1f}" y="{b-62:.1f}" text-anchor="middle" font-size="11" font-weight="800" fill="#fffaf1">{html.escape(name)}</text>')
 svg.append(circ(a+34,b-82,11,'#fff0d3',1,'#bba587',1))
 svg.append(f'<text x="{a+34:.1f}" y="{b-78:.1f}" text-anchor="middle" font-size="10" font-weight="900" fill="#35585b">{i+1:02d}</text>')
# two visitable professional collections
for archive in data.get('archiveDestinations',[]):
 x,z=archive['location'];a,b=xy(x,z);c=archive['color']
 svg.append(f'<ellipse cx="{a:.1f}" cy="{b:.1f}" rx="40" ry="16" fill="#fff3e1" stroke="{c}" stroke-width="3"/>')
 svg.append(cube(x,z,6.2,5,6,c,'#fff7e1'))
 svg.append(f'<rect x="{a-47:.1f}" y="{b-80:.1f}" width="94" height="22" rx="7" fill="#fff8ea" stroke="{c}"/>')
 svg.append(f'<text x="{a:.1f}" y="{b-65:.1f}" text-anchor="middle" font-size="10" font-weight="900" fill="#43526a">{html.escape(archive["name"][:18])}</text>')
# phonebooth, place at (3,-10)
x,z=3,-10;a,b=xy(x,z)
svg.append(f'<ellipse cx="{a:.1f}" cy="{b+12:.1f}" rx="31" ry="15" fill="#526c72" opacity=".18"/>')
svg.append(cube(x,z,4.4,4.1,8,'#c9253f','#ea7f7d'))
svg.append(f'<rect x="{a-22:.1f}" y="{b-62:.1f}" width="44" height="13" rx="2" fill="#f9dcc5"/>')
svg.append(f'<text x="{a:.1f}" y="{b-53:.1f}" text-anchor="middle" font-size="8" font-weight="900" fill="#914e4e">TELEPHONE</text>')
svg.append(f'<rect x="{a-13:.1f}" y="{b-44:.1f}" width="25" height="28" fill="#8bc3c3" stroke="#e9c3b9" stroke-width="2"/>')
svg.append(circ(a,b-31,7,'#1477ba'))
svg.append(f'<text x="{a:.1f}" y="{b-28:.1f}" text-anchor="middle" font-size="9" font-weight="900" fill="white">in</text>')
# 3d name plaza: shows name as a physical stage sign in full Three source, flat mock only
x,z=-67,-11;a,b=xy(x,z)
svg.append(f'<ellipse cx="{a:.1f}" cy="{b+9:.1f}" rx="76" ry="31" fill="#e9d9c2" stroke="#b79881" stroke-width="3"/>')
svg.append(f'<rect x="{a-93:.1f}" y="{b-84:.1f}" width="186" height="47" rx="7" fill="#344c55" stroke="#ffe2b6" stroke-width="3"/>')
svg.append(f'<text x="{a:.1f}" y="{b-64:.1f}" text-anchor="middle" font-size="17" font-weight="900" letter-spacing=".9" fill="#f9e8ce">FAIZAN TAYYAB</text>')
svg.append(f'<text x="{a:.1f}" y="{b-48:.1f}" text-anchor="middle" font-size="9" font-weight="700" letter-spacing="1.2" fill="#9fcebb">THE GEOVERSE JOURNEY</text>')
svg=''.join(svg)
# functional preview allows station selection and LinkedIn access, but uses flat illustrator representation
preview=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GeoVerse Journey — Illustrated Preview</title><style>
*{{box-sizing:border-box}}body{{margin:0;font:500 13px system-ui,sans-serif;background:#d8e9de;color:#2d474e;overflow:hidden}}.canvas{{position:relative;width:100vw;height:100dvh;min-height:580px;background:linear-gradient(145deg,#f8f8e8,#cfdfdc);overflow:hidden}}svg{{position:absolute;width:100%;height:100%;inset:0;object-fit:contain}}header{{position:absolute;z-index:5;top:21px;left:30px;right:30px;display:flex;justify-content:space-between;align-items:center}}.logo{{font-weight:900;letter-spacing:.14em;color:#2a5156;font-size:19px}}.logo b{{color:#65a993}}.flag{{border:1px solid #d0ddce;background:#ffffffdb;border-radius:12px;padding:12px 15px;color:#71938c;font-weight:750;font-size:10px;letter-spacing:.11em}}.hero{{position:absolute;z-index:3;left:38px;top:165px;width:305px;pointer-events:none}}.hero span{{font-size:10px;color:#639e8f;letter-spacing:.16em;font-weight:900}}.hero h1{{font-size:54px;line-height:.99;letter-spacing:-.065em;margin:19px 0 22px}}.hero h1 em{{font-style:normal;color:#76a68e}}.hero p{{line-height:1.75;color:#76908b}}.rail{{position:absolute;z-index:5;bottom:20px;left:30px;right:30px;background:#fffef3e8;border:1px solid white;border-radius:18px;padding:15px;box-shadow:0 14px 45px #355e6240}}.rail-header{{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;font-size:10px;font-weight:900;letter-spacing:.15em;color:#598a81}}.items{{display:flex;gap:6px;overflow-x:auto;padding-bottom:5px}}.items button{{min-width:109px;flex:1;background:#f1f3e9;border:0;border-radius:9px;text-align:left;padding:12px;font-size:10px;font-weight:800;color:#5b7775;cursor:pointer}}.items button b{{display:block;color:#99ada5;font-size:9px;margin-bottom:6px}}.items button.active{{background:#355a5e;color:#fff}}.card{{position:absolute;z-index:8;top:125px;right:32px;width:322px;padding:23px;background:#fffcf0fa;border-radius:18px;box-shadow:0 20px 50px #3b5e5e44;max-height:calc(100dvh - 325px);overflow-y:auto;display:none}}.card.show{{display:block}}.card small{{color:#62a08d;letter-spacing:.16em;font-weight:900;font-size:10px}}.card h2{{font-size:26px;line-height:1.15;margin:12px 0 6px}}.card p{{color:#678885;line-height:1.65}}.card ul{{padding-left:19px;color:#567570;line-height:1.6}}.card button{{background:#31575a;color:#fff;border:0;border-radius:8px;padding:11px 16px;cursor:pointer}}.note{{position:absolute;left:36px;bottom:161px;font-size:10px;font-weight:900;color:#819e96;letter-spacing:.1em}}.booth{{position:absolute;z-index:4;right:35px;top:88px;background:#c92439;color:#fff;border:0;border-radius:10px;padding:12px 18px;font-weight:800;cursor:pointer}}.legend{{position:absolute;right:38px;bottom:159px;color:#51766c;font-size:11px;font-weight:800}}.info{{position:absolute;top:82px;left:38px;background:#fff8ede3;padding:10px;border-radius:7px;font-size:10px;color:#8e817c}}@media(max-width:780px){{.hero{{top:110px;width:190px}}.hero h1{{font-size:35px}}.hero p{{font-size:11px}}.flag{{display:none}}.booth{{right:14px;top:78px}}.card{{top:145px;right:15px;left:15px;width:auto;max-height:44dvh}}.rail{{left:10px;right:10px;bottom:8px}}.note,.legend{{display:none}}}} </style></head><body><main class="canvas">
<svg viewBox="0 0 {W} {H}" role="img" aria-label="Illustrative isometric view of the GeoVerse's timeline and six domain mini-worlds"><rect width="{W}" height="{H}" fill="transparent"/>{svg}</svg>
<header><div class="logo">✳ <b>GEO</b>VERSE / FAIZAN TAYYAB</div><div class="flag">ILLUSTRATIVE CONCEPT PREVIEW · FULL 3D IN SOURCE CODE</div></header>
<div class="hero"><span>THE INTERACTIVE CAREER UNIVERSE</span><h1>A colorful career.<br><em>Many worlds.</em></h1><p>A playful, premium diorama where every chapter becomes a place and every discipline becomes its own world.</p></div>
<button class="booth" id="booth">☎ London phone box ↗</button>
<div class="card" id="card"><small id="tag"></small><h2 id="name"></h2><b id="role"></b><p id="desc"></p><ul id="bullets"></ul><button onclick="document.getElementById('card').classList.remove('show')">Close</button></div>
<div class="note">✧ GIS → ENGINEERING → CLOUD → DATA → GEOAI · CERTIFICATIONS &amp; SKILLS INCLUDED</div><div class="legend">✦ 12 CAREER & EDUCATION CHAPTERS · 6 WORLDS</div>
<div class="rail"><div class="rail-header"><span>✳ THE CAREER TIMELINE</span><span>CLICK A STOP TO DISCOVER ITS STORY</span></div><div class="items" id="items"></div></div>
</main><script type="module">
const chapters={json.dumps(data['timeline'],ensure_ascii=False)};
const container=document.getElementById('items');const card=document.getElementById('card');let active=-1;
function show(i){{active=i;const d=chapters[i];document.querySelectorAll('.items button').forEach((b,j)=>b.classList.toggle('active',i===j));document.getElementById('tag').textContent=`${{String(i+1).padStart(2,'0')}} / ${{chapters.length}} · ${{d.date}}`;document.getElementById('name').textContent=d.company;document.getElementById('role').textContent=d.role;document.getElementById('desc').textContent=d.story;document.getElementById('bullets').innerHTML=d.achievements.map(a=>'<li>'+a.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</li>').join('');card.classList.add('show');}}
chapters.forEach((d,i)=>{{const b=document.createElement('button');b.innerHTML=`<b>${{d.years}}</b>${{d.company}}`;b.onclick=()=>show(i);container.appendChild(b);}});
document.getElementById('booth').onclick=()=>{{card.classList.add('show');document.getElementById('tag').textContent='LET’S CONNECT';document.getElementById('name').textContent='The LinkedIn Phone Booth';document.getElementById('role').textContent='Open a door to conversation.';document.getElementById('desc').innerHTML='<a href="https://www.linkedin.com/in/ftayyab" target="_blank" rel="noopener noreferrer" style="font-weight:800;color:#0a66c2">Connect with Faizan Tayyab on LinkedIn ↗</a>';document.getElementById('bullets').innerHTML='';}}
</script></body></html>'''
(ROOT/'illustrative-preview.html').write_text(preview,encoding='utf-8')
print('Wrote illustrative-preview.html')
