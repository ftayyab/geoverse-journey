import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { timeline, domains, OWNER, LINKEDIN, escapeText, careerById, domainById, careerExtras, qualifications, skillGroups, learningHighlights, archiveDestinations } from './data.js';
import { makeWorld } from './world.js';
import {terrainHeight} from './terrain.js';
import './style.css';

const $=id=>document.getElementById(id);
function loadingProgress(value,message){
 const bar=$('bootFill'),number=$('bootPercent'),detail=$('bootDetail');
 if(bar)bar.style.width=`${value}%`;
 $('bootProgress')?.setAttribute('aria-valuenow',String(value));
 if(number)number.textContent=`${value}%`;
 if(detail)detail.textContent=message;
}
loadingProgress(12,'Preparing the Three.js scene');

const sceneHost=$('scene'), app=$('app');
const screen={started:false,atlas:false,tour:false,details:null,currentIndex:0,travel:null,toastTimeout:null,help:false,archive:false};
const clock=new THREE.Clock();
const scene=new THREE.Scene();scene.background=new THREE.Color('#103b44');scene.fog=new THREE.FogExp2('#2b5761',.00120);
const camera=new THREE.PerspectiveCamera(43,innerWidth/innerHeight,.15,700);
camera.position.set(70,150,215);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,matchMedia('(pointer:coarse)').matches?1.2:1.75));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.31;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.domElement.setAttribute('tabindex','0');
sceneHost.appendChild(renderer.domElement);
const orbit=new OrbitControls(camera,renderer.domElement);
orbit.enableDamping=true;orbit.dampingFactor=.065;orbit.minDistance=14;orbit.maxDistance=335;
orbit.maxPolarAngle=Math.PI*.465;orbit.minPolarAngle=.08;orbit.target.set(0,0,0);
orbit.enablePan=true;orbit.screenSpacePanning=false;
scene.add(new THREE.HemisphereLight('#fff1d1','#39767e',2.1));
const sun=new THREE.DirectionalLight('#ffe4a9',3.5);sun.position.set(-70,145,85);sun.castShadow=true;sun.shadow.mapSize.set(matchMedia('(pointer:coarse)').matches?1024:2048,matchMedia('(pointer:coarse)').matches?1024:2048);
sun.shadow.camera.left=-140;sun.shadow.camera.right=140;sun.shadow.camera.top=112;sun.shadow.camera.bottom=-112;
sun.shadow.camera.near=1;sun.shadow.camera.far=320;sun.shadow.bias=-.00032;sun.shadow.normalBias=.025;scene.add(sun);
const rim=new THREE.DirectionalLight('#76c4c5',2.15);rim.position.set(40,65,-120);scene.add(rim);

// Deterministic, tiny celestial points behind the landscape.
{
 const points=[];let seed=11323;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<620;i++){
  const x=(random()-.5)*610,z=-210+random()*415,y=45+random()*190;
  if(x*x+z*z<12000)continue;
  points.push(x,y,z);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
 const stars=new THREE.Points(g,new THREE.PointsMaterial({color:'#d3f7e9',size:.32,transparent:true,opacity:.71,depthWrite:false}));scene.add(stars);
}
loadingProgress(32,'Building the sculpted elevation model');
let world;
try{world=makeWorld(scene);}
catch(error){console.error('World generation failed:',error);$('webglFallback').hidden=false;throw error;}

function shape(color){return new THREE.MeshStandardMaterial({color,flatShading:true,roughness:.78});}
function unitBox(parent,s,material,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(...s),shape(material));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function unitSphere(parent,r,material,x,y,z){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),shape(material));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;}
function createWalker(){
 const root=new THREE.Group();scene.add(root);
 // Charming little cartographer with backpack. It indicates where the visitor is in the world.
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(1.35,16),new THREE.MeshBasicMaterial({color:'#294b4a',transparent:true,opacity:.19,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.04;root.add(shadow);
 const body=new THREE.Group();root.add(body);
 unitBox(body,[.9,1.45,.62],'#507e80',0,1.6,0);unitBox(body,[.83,.85,.32],'#bb916f',0,1.5,-.5);
 unitSphere(body,.62,'#ebc9a7',0,2.72,0);const cap=unitSphere(body,.68,'#375660',0,3.06,0);cap.scale.set(1.1,.35,1.0);
 unitBox(body,[.7,.12,.65],'#315c65',0,2.96,.44);
 const l=unitBox(body,[.32,.87,.33],'#283f49',-.28,.61,0);const r=unitBox(body,[.32,.87,.33],'#283f49',.28,.61,0);
 unitBox(body,[.37,.2,.57],'#edd4ae',-.28,.17,.18);unitBox(body,[.37,.2,.57],'#edd4ae',.28,.17,.18);
 const armL=unitBox(body,[.24,.98,.29],'#5e9691',-.68,1.75,0);const armR=unitBox(body,[.24,.98,.29],'#5e9691',.68,1.75,0);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.55,.075,6,48),new THREE.MeshBasicMaterial({color:'#f0d4a1',transparent:true,opacity:.75}));ring.rotation.x=Math.PI/2;ring.position.y=.12;root.add(ring);
 const point=new THREE.Mesh(new THREE.OctahedronGeometry(.27),new THREE.MeshStandardMaterial({color:'#ffd39f',emissive:'#ffce87',emissiveIntensity:1.1}));point.position.set(0,4.25,0);root.add(point);
 root.position.set(-103,terrainHeight(-103,43)+.65,43);
 return {root,body,shadow,armL,armR,l,r,point};
}
const walker=createWalker();
loadingProgress(70,'Positioning miniature worlds and landmarks');const keys=new Set();
const visited=new Set();const connectionGroup=new THREE.Group();scene.add(connectionGroup);
const connectionParticles=[];let finaleShown=false;
function clearConnections(){for(const o of [...connectionGroup.children]){connectionGroup.remove(o);o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();}connectionParticles.length=0;}
function showConnections(kind,item){
 clearConnections();if(kind==='contact')return;
 const roleSites=kind==='career'?[item]:timeline.filter(c=>c.domainIds.includes(item.id));
 const pairs=[];
 for(const role of roleSites){
  const related=kind==='career'?role.domainIds:[item.id];
  for(const id of related){const d=domainById(id);if(d)pairs.push({from:role.location,to:d.location,color:d.color});}
 }
 // Illuminate relevant disciplines with a flowing, elevated thread of expertise.
 for(const pair of pairs.slice(0,9)){
  const [ax,az]=pair.from,[bx,bz]=pair.to;
  const height=9+Math.hypot(ax-bx,az-bz)*.18;
  const curve=new THREE.QuadraticBezierCurve3(
   new THREE.Vector3(ax,terrainHeight(ax,az)+4,az),new THREE.Vector3((ax+bx)*.5,Math.max(terrainHeight(ax,az),terrainHeight(bx,bz))+height,(az+bz)*.5),new THREE.Vector3(bx,terrainHeight(bx,bz)+4,bz));
  const material=new THREE.MeshBasicMaterial({color:pair.color,transparent:true,opacity:.75,depthWrite:false,blending:THREE.AdditiveBlending});
  const line=new THREE.Mesh(new THREE.TubeGeometry(curve,46,.085,5,false),material);line.renderOrder=3;connectionGroup.add(line);
  const particle=new THREE.Mesh(new THREE.IcosahedronGeometry(.25,1),new THREE.MeshBasicMaterial({color:'#fff1ca',transparent:true,opacity:.95,depthWrite:false}));particle.renderOrder=4;connectionGroup.add(particle);
  connectionParticles.push({curve,particle,offset:Math.random(),speed:.075+Math.random()*.09});
 }
}

let followCamera=false;let lastWalkerPosition=walker.root.position.clone();let movementActive=false;let tourDelay=0;let lastMinimap=0;
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');clearTimeout(screen.toastTimeout);screen.toastTimeout=setTimeout(()=>el.classList.remove('show'),3000);}
function setStatus(title,desc,symbol='✦'){$('statusName').textContent=title;$('statusYear').textContent=desc;$('statusIcon').textContent=symbol;}
function updateRail(){for(const button of $('chapterRail').children){const active=Number(button.dataset.index)===screen.currentIndex;button.classList.toggle('active',active);button.setAttribute('aria-current',active?'step':'false');if(active&&screen.started)button.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'});}}
function buildNavigation(){
 const rail=$('chapterRail');
 timeline.forEach((item,index)=>{
  const btn=document.createElement('button');btn.className='chapter';btn.dataset.index=String(index);btn.title=`${item.company}: ${item.role} (${item.date})`;
  btn.innerHTML=`<span class="ch-dot"></span><span class="ch-year">${escapeText(item.years)}</span><span class="ch-name">${escapeText(item.company)}</span>`;
  btn.addEventListener('click',()=>visitCareer(index));rail.appendChild(btn);
 });
 $('dockCount').textContent=`${timeline.length} CHAPTERS`;
 const worlds=$('worldButtons');
 domains.forEach(dom=>{
  const btn=document.createElement('button');btn.className='world-button';btn.dataset.id=dom.id;
  btn.style.setProperty('--world',dom.color);btn.style.setProperty('--world-soft',`${dom.color}33`);
  btn.title=`Enter ${dom.name}`;btn.innerHTML=`<span>${escapeText(dom.symbol)}</span><strong>${escapeText(dom.name)}</strong>`;
  btn.addEventListener('click',()=>visitDomain(dom.id));worlds.appendChild(btn);
 });
 updateRail();
}
buildNavigation();
function updateWorldButtons(id){document.querySelectorAll('.world-button').forEach(x=>x.classList.toggle('active',x.dataset.id===id));}
function hideCard(){$('storyCard').hidden=true;app.classList.remove('story-open');screen.details=null;}
function showCard(kind,item){
 if(!item)return;
 screen.details={kind,id:item.id};
 showConnections(kind,item);
 if(kind==='career'){
  visited.add(item.id);
  document.querySelectorAll('.chapter').forEach((button,index)=>button.classList.toggle('visited',visited.has(timeline[index].id)));
  $('statusKicker').textContent=`${String(visited.size).padStart(2,'0')} / ${timeline.length} CHAPTERS DISCOVERED`;
  if(visited.size===timeline.length&&!finaleShown){finaleShown=true;toast('✦ All chapters discovered! The whole GeoVerse is now connected.');}
 }

 $('storyCard').hidden=false;app.classList.add('story-open');
 $('storyCategory').textContent=kind==='career'?(item.kind==='Education'?'THE BEGINNING':item.kind==='Secondment'?'CONSULTING CHAPTER':item.kind==='Current chapter'?'THE CURRENT CHAPTER':'CAREER MILESTONE'):kind==='domain'?'THEMATIC SUB-WORLD':'A PLACE TO CONNECT';
 $('storyCounter').textContent=kind==='career'?`CHAPTER ${String(screen.currentIndex+1).padStart(2,'0')} / ${timeline.length}`:kind==='domain'?'ONE OF SIX CONNECTED DISCIPLINES':'A LITTLE CONVERSATION CORNER';
 $('storyTitle').textContent=kind==='contact'?'The LinkedIn Phone Booth':kind==='career'?item.company:item.name;
 $('storyRole').textContent=kind==='contact'?'The best conversations start with a hello.':kind==='career'?item.role:item.sub;
 $('storyPeriod').textContent=kind==='career'?item.date:kind==='domain'?'CONNECTED CAREER DOMAIN':'GET IN TOUCH';
 $('storyDescription').textContent=kind==='contact'?'You found the iconic red London telephone box. Step inside for a direct connection to Faizan’s public LinkedIn profile. This is the only contact destination in GeoVerse.':kind==='career'?item.story:item.description;
 const resp=kind==='career'?(careerExtras[item.id]?.responsibilities||[]):[];
 $('storyResponsibilitiesLabel').hidden=kind!=='career';
 $('storyResponsibilities').hidden=kind!=='career';
 $('storyResponsibilities').innerHTML=resp.map(x=>`<li>${escapeText(x)}</li>`).join('');
 const notes=kind==='career'?(careerExtras[item.id]?.roleNotes||[]):[];
 $('storyRoleNotes').hidden=!notes.length;
 $('storyRoleNotes').innerHTML=notes.map(x=>`<div>ⓘ ${escapeText(x)}</div>`).join('');
 const bulletItems=kind==='contact'?['Explore professional updates and shared interests','Connect through the public LinkedIn profile','Return to the journey whenever you like']:kind==='career'?item.achievements:item.highlights;
 $('storyBullets').innerHTML=bulletItems.map(s=>`<li>${escapeText(s)}</li>`).join('');
 const d=$('storyDomains');d.innerHTML='';
 if(kind==='contact'){
   const a=document.createElement('a');a.href=LINKEDIN;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Open LinkedIn profile ↗';a.style.cssText='display:inline-flex;align-items:center;background:#0a66c2;color:white;border-radius:9px;padding:11px 14px;font-size:12px;font-weight:800;text-decoration:none';d.append(a);
 }else{
  const ds=kind==='career'?item.domainIds:timeline.filter(c=>c.domainIds.includes(item.id)).map(c=>c.id);
  if(kind==='career'){
   for(const id of ds){const domain=domainById(id);if(!domain)continue;const b=document.createElement('button');b.textContent=`${domain.symbol} ${domain.name}`;b.addEventListener('click',()=>visitDomain(id));d.append(b);}
  }else{
   for(const id of ds){const career=careerById(id);if(!career)continue;const b=document.createElement('button');b.textContent=`${career.company} · ${career.years}`;b.addEventListener('click',()=>visitCareer(timeline.indexOf(career)));d.append(b);}
  }
 }
 $('storyTools').innerHTML=(kind==='contact'?['LinkedIn','Professional networking']:item.technologies).map(x=>`<span>${escapeText(x)}</span>`).join('');
 $('storyPrev').textContent=kind==='career'?'← Previous chapter':'← Back to journey';
 $('storyNext').textContent=kind==='career'?'Next chapter →':kind==='contact'?'Return to timeline →':'Visit next world →';
 $('storyPrev').disabled=kind==='career'&&screen.currentIndex===0;
 $('storyNext').disabled=kind==='career'&&screen.currentIndex===timeline.length-1;
 $('storyCard').scrollTop=0;
}
// CV VAULT — navigable education, certifications, skills and knowledge displays.
const archiveTabButtons=[...document.querySelectorAll('[data-archive-tab]')];
let archiveTab='experience';
const cvItem=(name,body,accent='')=>`<article class="cv-entry" style="--item-accent:${escapeText(accent||'#77b8a6')}"><h3>${escapeText(name)}</h3>${body}</article>`;
function archiveMarkup(tab){
 if(tab==='experience'){
  const entries=timeline.filter(x=>x.kind!=='Education');
  return `<div class="vault-lede"><span>01 / EXPERIENCE</span><h3>Every company is its own mini-world.</h3><p>This collection summarizes the professional chapters in the GeoVerse. Each card links directly to the matching 3D company world on the main timeline.</p></div><div class="cv-grid experience-cards">${entries.map(x=>{const extra=careerExtras[x.id]||{responsibilities:[]};return cvItem(x.company,`<span class="entry-meta">${escapeText(x.role)} · ${escapeText(x.date)}</span><p>${escapeText(x.story)}</p><p><strong style="font-size:11px;color:#486072">Key responsibilities:</strong> ${escapeText((extra.responsibilities||[]).slice(0,3).join(' · '))}</p><button class="archive-visit" data-visit-career="${escapeText(x.id)}">Visit company world ↗</button>`,x.color)}).join('')}</div>`;
 }
 if(tab==='education'){
  const entries=timeline.filter(x=>x.kind==='Education');
  return `<div class="vault-lede"><span>02 / EDUCATION</span><h3>The foundations of the journey.</h3><p>Two qualifications at the University of Nottingham — click one to travel to its 3D campus stop.</p></div><div class="cv-grid education-cards">${entries.map(x=>cvItem(x.role,`<span class="entry-meta">${escapeText(x.company)} · ${escapeText(x.date)}</span><p>${escapeText(x.story)}</p><button class="archive-visit" data-visit-career="${escapeText(x.id)}">Explore campus stop ↗</button>`,x.color)).join('')}</div>`;
 }
 if(tab==='certifications'){
  const groups=[...new Set(qualifications.map(x=>x.group))];
  return `<div class="vault-lede"><span>03 / CERTIFICATIONS</span><h3>Always learning. Always building.</h3><p>${qualifications.length} CV-listed professional certifications, nanodegrees and courses. Dates appear only where the CV specifies them; these entries are not independently verified with issuing bodies.</p></div>`+
   groups.map((name,i)=>`<section class="credential-group"><div class="credential-heading"><i style="background:${['#c58bef','#68bfd0','#f0b663','#80c6a7','#e79c8a'][i%5]}"></i><h4>${escapeText(name)}</h4><span>${qualifications.filter(x=>x.group===name).length} entries</span></div><div class="cert-list">${qualifications.filter(x=>x.group===name).map(x=>`<article><strong>${escapeText(x.name)}</strong><span>${escapeText(x.issuer)} · ${escapeText(x.year)}</span></article>`).join('')}</div></section>`).join('');
 }
 if(tab==='skills'){
  return `<div class="vault-lede"><span>04 / SKILLSET</span><h3>A toolkit spanning worlds.</h3><p>Grouped selections from the CV’s programming, GIS, cloud, data, AI and project delivery technologies. These are listed skills, not claims of equal proficiency.</p></div><div class="cv-grid skill-cards">${skillGroups.map(g=>cvItem(g.name,`<div class="skills-cloud">${g.skills.map(sk=>`<span>${escapeText(sk)}</span>`).join('')}</div>`,g.color)).join('')}</div>`;
 }
 return `<div class="vault-lede"><span>05 / KNOWLEDGE & IMPACT</span><h3>Knowledge is more valuable shared.</h3><p>A few chapters that happened beyond a company title: teaching, industry presentations, academic achievement, and professional recognition.</p></div><div class="cv-grid impact-cards">${learningHighlights.map((x,i)=>cvItem(x.title,`<p>${escapeText(x.description)}</p>`,['#86b7dd','#82c8b3','#efae76','#c39be6'][i])).join('')}</div>`;
}
function renderArchive(tab){
 archiveTab=tab;
 archiveTabButtons.forEach(b=>{const selected=b.dataset.archiveTab===tab;b.classList.toggle('selected',selected);b.setAttribute('aria-selected',String(selected));});
 $('archiveContent').innerHTML=archiveMarkup(tab);
 $('archiveContent').scrollTop=0;
}
function openArchive(tab='education'){
 ensureStarted();stopTour(true);screen.travel=null;hideCard();screen.archive=true;
 $('archiveOverlay').hidden=false;renderArchive(tab);
}
function closeArchive(){screen.archive=false;$('archiveOverlay').hidden=true;}
archiveTabButtons.forEach(b=>b.addEventListener('click',()=>renderArchive(b.dataset.archiveTab)));
$('archiveBtn').addEventListener('click',()=>openArchive('experience'));
$('vaultShortcut').addEventListener('click',()=>openArchive('experience'));
$('archiveClose').addEventListener('click',closeArchive);
$('archiveDone').addEventListener('click',closeArchive);
$('archiveOverlay').addEventListener('click',event=>{if(event.target===$('archiveOverlay'))closeArchive();});
$('archiveContent').addEventListener('click',event=>{const b=event.target.closest('[data-visit-career]');if(b){const i=timeline.findIndex(x=>x.id===b.dataset.visitCareer);closeArchive();if(i>=0)visitCareer(i);}});
function stopTour(silent=false){if(!screen.tour)return;screen.tour=false;$('tourBtn').classList.remove('active');$('tourBtn').innerHTML='<span class="nav-icon">◉</span> Guided tour';if(!silent)toast('Guided tour paused. You’re in control.');}
function ensureStarted(){if(screen.started)return;screen.started=true;app.classList.add('started');$('welcomeOverlay').classList.add('dismissed');}
function travelTo(kind,item,opts={}){
 if(!item)return;closeArchive();ensureStarted();if(!opts.fromTour)stopTour(true);
 if(screen.atlas)setAtlas(false);
 const [x,z]=kind==='contact'?[3,-10]:item.location;
 const goal=new THREE.Vector3(x,terrainHeight(x,z+11)+.65,z+11);
 const origin=walker.root.position.clone();const distance=origin.distanceTo(goal);
 const pts=[origin.clone()];
 // Visit subsequent stations along the promenade when advancing in narrative order.
 if(kind==='career'&&opts.fromIndex!=null&&Math.abs(opts.fromIndex-timeline.indexOf(item))>1){
   const dest=timeline.indexOf(item),dir=dest>opts.fromIndex?1:-1;
   for(let i=opts.fromIndex+dir;dir>0?i<dest:i>dest;i+=dir){const p=timeline[i].location;pts.push(new THREE.Vector3(p[0],terrainHeight(p[0],p[1]+11)+.65,p[1]+11));}
 }
 pts.push(goal);
 screen.travel={kind,item,curve:new THREE.CatmullRomCurve3(pts,false,'centripetal'),elapsed:0,duration:Math.max(1.15,Math.min(5.6,distance/30+.7)),fromTour:!!opts.fromTour};
 followCamera=true;hideCard();clearConnections();
 if(kind==='career'){
   screen.currentIndex=timeline.indexOf(item);updateRail();setStatus(item.company,item.date,'◈');updateWorldButtons(null);
 } else if(kind==='domain'){setStatus(item.name,'DOMAIN WORLD',item.symbol);updateWorldButtons(item.id);}
 else if(kind==='archive'){setStatus(item.name,'EXPLORE THE CV VAULT',item.symbol);updateWorldButtons(null);}
 else{setStatus('London Phone Box','Come say hello','☎');updateWorldButtons(null);}
}
function arrive(kind,item){
 if(kind==='archive'){openArchive(item.id);toast(`Welcome to the ${item.name}`);return;}
 showCard(kind,item);
 if(kind==='career')toast(`${item.company} · ${item.years}`);
 else if(kind==='domain')toast(`Welcome to ${item.sub}`);
 else toast('☎ London calling! Find your LinkedIn connection inside.');
 if(screen.tour)tourDelay=6.7;
}
function visitCareer(index,options={}){
 const last=screen.currentIndex;const next=Math.max(0,Math.min(timeline.length-1,index));
 travelTo('career',timeline[next],{...options,fromIndex:last});
}
function visitDomain(id){const d=domainById(id);if(d)travelTo('domain',d);}
function visitContact(){travelTo('contact',{id:'contact'});}
function visitArchive(id){const dest=archiveDestinations.find(x=>x.id===id);if(dest)travelTo('archive',dest);}
function chapterDelta(delta){visitCareer((screen.currentIndex+delta+timeline.length)%timeline.length);}
function setAtlas(force){
 const next=typeof force==='boolean'?force:!screen.atlas;if(next===screen.atlas)return;
 screen.atlas=next;const b=$('mapModeBtn');b.classList.toggle('active',next);
 if(next){followCamera=false;camera.position.set(0,218,1);orbit.target.set(0,0,0);orbit.update();toast('Atlas view: click a landmark or use the timeline to visit it.');}
 else{camera.position.set(walker.root.position.x+19,walker.root.position.y+40,walker.root.position.z+57);orbit.target.copy(walker.root.position).add(new THREE.Vector3(0,3,0));orbit.update();followCamera=true;}
}
function teleportHome(){closeArchive();stopTour(true);ensureStarted();screen.travel=null;hideCard();clearConnections();walker.root.position.set(-103,terrainHeight(-103,43)+.65,43);followCamera=false;camera.position.set(25,108,170);orbit.target.set(0,0,0);orbit.update();screen.atlas=false;updateWorldButtons(null);setStatus('The Welcome Plaza','Choose a chapter to begin','◎');toast('Back at the welcome plaza.');}
function beginTour(){ensureStarted();screen.tour=true;screen.currentIndex=0;$('tourBtn').classList.add('active');$('tourBtn').innerHTML='<span class="nav-icon">Ⅱ</span> Pause tour';visitCareer(0,{fromTour:true});toast('Your guided journey is underway.');}
function toggleTour(){if(screen.tour)stopTour();else beginTour();}
function showHelp(){closeArchive();stopTour(true);$('helpOverlay').hidden=false;screen.help=true;}
function closeHelp(){$('helpOverlay').hidden=true;screen.help=false;}

$('beginExplore').addEventListener('click',()=>{ensureStarted();visitCareer(0);});
$('beginTour').addEventListener('click',beginTour);
$('startBtn').addEventListener('click',()=>visitCareer(0));
$('tourBtn').addEventListener('click',toggleTour);
$('mapModeBtn').addEventListener('click',()=>setAtlas());
$('showWorldsBtn').addEventListener('click',()=>{ensureStarted();$('worldSelector').classList.add('focused');setTimeout(()=>$('worldSelector').classList.remove('focused'),1500);visitDomain('gis');});
$('headerContactBtn').addEventListener('click',visitContact);
$('prevBtn').addEventListener('click',()=>chapterDelta(-1));
$('nextBtn').addEventListener('click',()=>chapterDelta(+1));
$('storyPrev').addEventListener('click',()=>screen.details?.kind==='career'?visitCareer(screen.currentIndex-1):visitCareer(screen.currentIndex));
$('storyNext').addEventListener('click',()=>screen.details?.kind==='career'?visitCareer(screen.currentIndex+1):screen.details?.kind==='domain'?visitDomain(domains[(domains.findIndex(d=>d.id===screen.details.id)+1)%domains.length].id):visitCareer(0));
$('closeStory').addEventListener('click',hideCard);
$('expandMap').addEventListener('click',()=>setAtlas());
$('homeBtn').addEventListener('click',teleportHome);
$('zoomInBtn').addEventListener('click',()=>{camera.position.lerp(orbit.target,.2);});
$('zoomOutBtn').addEventListener('click',()=>{camera.position.add(camera.position.clone().sub(orbit.target).multiplyScalar(.25));});
$('resetCameraBtn').addEventListener('click',()=>setAtlas(screen.atlas?false:true));
$('helpBtn').addEventListener('click',showHelp);
$('helpClose').addEventListener('click',closeHelp);
$('helpDone').addEventListener('click',closeHelp);
$('menuBtn').addEventListener('click',()=>{const menu=$('mobileMenu');menu.hidden=!menu.hidden;$('menuBtn').setAttribute('aria-expanded',String(!menu.hidden));});
$('mobileMenu').addEventListener('click',e=>{const btn=e.target.closest('[data-mobile]');if(!btn)return;$('mobileMenu').hidden=true;$('menuBtn').setAttribute('aria-expanded','false');({tour:toggleTour,atlas:()=>setAtlas(),worlds:()=>visitDomain('gis'),archive:()=>openArchive('experience'),connect:visitContact})[btn.dataset.mobile]?.();});

// Ray-cast the actual Three.js landmark volumes; orbit dragging does not count as a click.
const caster=new THREE.Raycaster();const mouse=new THREE.Vector2();let pointerDown=null;
renderer.domElement.addEventListener('pointerdown',e=>{pointerDown={x:e.clientX,y:e.clientY};});
renderer.domElement.addEventListener('pointerup',e=>{
 if(!pointerDown||Math.hypot(e.clientX-pointerDown.x,e.clientY-pointerDown.y)>7||screen.help)return;
 pointerDown=null;const rect=renderer.domElement.getBoundingClientRect();mouse.x=(e.clientX-rect.left)/rect.width*2-1;mouse.y=-((e.clientY-rect.top)/rect.height*2-1);
 caster.setFromCamera(mouse,camera);const intersects=caster.intersectObjects(world.targets,false);
 if(intersects.length){const data=intersects[0].object.userData;
  if(data.kind==='career')visitCareer(timeline.findIndex(x=>x.id===data.id));
  else if(data.kind==='domain')visitDomain(data.id);
  else if(data.kind==='archive')visitArchive(data.id);
  else visitContact();}
});
// Dragging to rotate remains OrbitControls' responsibility.
renderer.domElement.addEventListener('pointermove',e=>{
 if(pointerDown)return;
 const rect=renderer.domElement.getBoundingClientRect();mouse.x=(e.clientX-rect.left)/rect.width*2-1;mouse.y=-((e.clientY-rect.top)/rect.height*2-1);
 caster.setFromCamera(mouse,camera);renderer.domElement.style.cursor=caster.intersectObjects(world.targets,false).length?'pointer':'grab';
});
window.addEventListener('keydown',event=>{
 if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName))return;
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(event.key))event.preventDefault();
 if(event.repeat&&['m','M','e','E','Escape','ArrowLeft','ArrowRight'].includes(event.key))return;
 const key=event.key.toLowerCase();keys.add(key);
 if(screen.archive){if(key==='escape')closeArchive();return;}
 if(screen.help){if(key==='escape')closeHelp();return;}
 if(!screen.started&&['w','a','s','d','arrowright','arrowleft'].includes(key))ensureStarted();
 if(key==='arrowleft')chapterDelta(-1);
 else if(key==='arrowright')chapterDelta(1);
 else if(key==='m')setAtlas();
 else if(key==='e'&&Math.hypot(walker.root.position.x-3,walker.root.position.z-1)<17)arrive('contact',{id:'contact'});
 else if(key==='escape'){stopTour(true);hideCard();}
});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>keys.clear());

const map=$('mapCanvas'),ctx=map.getContext('2d');
function mapCoords(x,z){return [(x+126)/252*map.width,(z+76)/152*map.height];}
function renderMap(){
 const w=map.width,h=map.height;ctx.clearRect(0,0,w,h);
 ctx.fillStyle='#c4d7bf';ctx.fillRect(0,0,w,h);
 ctx.globalAlpha=.22;ctx.fillStyle='#a2cbb8';for(let i=0;i<7;i++){ctx.beginPath();ctx.ellipse((i*95+32)%w,(i*59+32)%h,25+i%3*9,12,0,0,Math.PI*2);ctx.fill();}
 ctx.globalAlpha=1;ctx.strokeStyle='#e2b99e';ctx.lineWidth=8;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();timeline.forEach((t,i)=>{const [x,y]=mapCoords(...t.location);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();ctx.strokeStyle='#fbefe1';ctx.lineWidth=3;ctx.stroke();
 for(const d of domains){const [x,y]=mapCoords(...d.location);ctx.beginPath();ctx.fillStyle=d.color;ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ecf8ee';ctx.lineWidth=2;ctx.stroke();}
 timeline.forEach((p,i)=>{const [x,y]=mapCoords(...p.location);ctx.beginPath();ctx.arc(x,y,i===screen.currentIndex?7:4.3,0,Math.PI*2);ctx.fillStyle=i===screen.currentIndex?'#f2ce87':'#735f64';ctx.fill();ctx.lineWidth=1.5;ctx.strokeStyle='white';ctx.stroke();});
 for(const a of archiveDestinations){const [ax,ay]=mapCoords(...a.location);ctx.fillStyle=a.color;ctx.fillRect(ax-4,ay-4,8,8);}
 const [bx,by]=mapCoords(3,-10);ctx.fillStyle='#cb273e';ctx.fillRect(bx-5,by-5,10,10);
 const [px,py]=mapCoords(walker.root.position.x,walker.root.position.z);ctx.beginPath();ctx.arc(px,py,6.1,0,Math.PI*2);ctx.fillStyle='#e4665d';ctx.fill();ctx.lineWidth=2.2;ctx.strokeStyle='#fff8e7';ctx.stroke();
}
map.addEventListener('click',e=>{
 ensureStarted();const rect=map.getBoundingClientRect();const wx=(e.clientX-rect.left)/rect.width*252-126,wz=(e.clientY-rect.top)/rect.height*152-76;
 const destinations=[...timeline.map((v,index)=>({kind:'career',index,location:v.location})),...domains.map(d=>({kind:'domain',id:d.id,location:d.location})),...archiveDestinations.map(d=>({kind:'archive',id:d.id,location:d.location})),{kind:'contact',location:[3,-10]}];
 destinations.sort((a,b)=>Math.hypot(a.location[0]-wx,a.location[1]-wz)-Math.hypot(b.location[0]-wx,b.location[1]-wz));
 const d=destinations[0];if(!d)return;
 if(d.kind==='career')visitCareer(d.index);else if(d.kind==='domain')visitDomain(d.id);else if(d.kind==='archive')visitArchive(d.id);else visitContact();
});

const forward=new THREE.Vector3(),right=new THREE.Vector3(),desired=new THREE.Vector3();const temp=new THREE.Vector3();
function updateWalker(delta,now){
 movementActive=false;
 if(screen.travel){
  const journey=screen.travel;journey.elapsed+=delta;
  let t=Math.min(1,journey.elapsed/journey.duration);t=t*t*(3-2*t);
  const position=journey.curve.getPoint(t);position.y=terrainHeight(position.x,position.z)+.65;walker.root.position.copy(position);
  const tangent=journey.curve.getTangent(Math.min(.999,t));if(tangent.lengthSq()>0.01)walker.root.rotation.y=Math.atan2(tangent.x,tangent.z);
  movementActive=true;
  if(journey.elapsed>=journey.duration){screen.travel=null;arrive(journey.kind,journey.item);}
 }else if(!screen.help&&!screen.archive&&screen.started&&!screen.atlas){
   const f=Number(keys.has('w'))-Number(keys.has('s')),r=Number(keys.has('d'))-Number(keys.has('a'));
   if(f||r){stopTour(true);hideCard();camera.getWorldDirection(forward);forward.y=0;forward.normalize();right.set(forward.z,0,-forward.x);
     desired.copy(forward).multiplyScalar(f).addScaledVector(right,r).normalize();
     walker.root.position.addScaledVector(desired,delta*12.2);
     walker.root.position.x=THREE.MathUtils.clamp(walker.root.position.x,-121,121);
     walker.root.position.z=THREE.MathUtils.clamp(walker.root.position.z,-71,71);
     walker.root.position.y=terrainHeight(walker.root.position.x,walker.root.position.z)+.65;
     walker.root.rotation.y=Math.atan2(desired.x,desired.z);followCamera=true;movementActive=true;
     setStatus('Free exploration','Walking through the GeoVerse','✦');
   }
 }
 const stride=movementActive?Math.sin(now*12)*.37:0;
 walker.l.rotation.x=stride;walker.r.rotation.x=-stride;walker.armL.rotation.x=-stride*.6;walker.armR.rotation.x=stride*.6;
 walker.body.position.y=(movementActive?Math.abs(Math.sin(now*12))*.12:Math.sin(now*2)*.04);
 walker.point.position.y=4.35+Math.sin(now*2.1)*.23;
 if(followCamera&&!screen.atlas){
  const offset=walker.root.position.clone().sub(lastWalkerPosition);
  camera.position.add(offset);orbit.target.add(offset);
  // Smooth, intimate follow mode, with freedom to orbit or scroll at any moment.
  const wanted=walker.root.position.clone().add(new THREE.Vector3(0,3,0));
  const old=orbit.target.clone();orbit.target.lerp(wanted,Math.min(1,delta*2.8));camera.position.add(orbit.target.clone().sub(old));
 }
 if(!screen.travel)walker.root.position.y=terrainHeight(walker.root.position.x,walker.root.position.z)+.65;
 lastWalkerPosition.copy(walker.root.position);
}
function animateScene(delta,time){
 for(const link of connectionParticles){link.particle.position.copy(link.curve.getPoint((time*link.speed+link.offset)%1));}
 for(const object of world.animated){
  if(object.kind==='gem'){object.group.position.y=object.base+Math.sin(time*1.7)*.28;object.group.rotation.y+=delta*.25;}
  if(object.kind==='rotate')object.group.rotation.y+=delta*.23;
  if(object.kind==='balloon'){
    object.group.position.y=object.base+Math.sin(time*.6+object.offset)*.65;
    object.group.position.x+=Math.sin(time*.4+object.offset)*delta*.09;
  }
 }
 if(screen.tour&&!screen.travel&&screen.details?.kind==='career'){tourDelay-=delta;if(tourDelay<=0){if(screen.currentIndex>=timeline.length-1){stopTour(true);toast('You explored the full career journey! Find the phone booth to connect.');visitContact();}else visitCareer(screen.currentIndex+1,{fromTour:true});}}
}
function loop(){
 const delta=Math.min(clock.getDelta(),.075),elapsed=clock.elapsedTime;
 updateWalker(delta,elapsed);animateScene(delta,elapsed);
 if(elapsed-lastMinimap>.1){renderMap();lastMinimap=elapsed;}
 orbit.update();renderer.render(scene,camera);requestAnimationFrame(loop);
}
// Count actual initialization milestones: geometry creation, shader compilation,
// first GPU draw, and browser font readiness. No artificial timed percentage.
loadingProgress(82,'Compiling terrain and landmark materials');
async function releaseLoader(){
 try{
  await renderer.compileAsync(scene,camera);
  loadingProgress(93,'Completing first 3D frame');
  orbit.update();renderer.render(scene,camera);
  if(document.fonts?.ready)await document.fonts.ready;
  await new Promise(resolve=>requestAnimationFrame(resolve));
  loadingProgress(100,'GeoVerse is ready to explore');
  $('bootLoader')?.classList.add('complete');
  $('bootLoader')?.setAttribute('aria-hidden','true');
  requestAnimationFrame(loop);
 }catch(error){
  console.error('GeoVerse initialization failed:',error);
  const errorLabel=$('bootDetail');if(errorLabel)errorLabel.textContent='Unable to initialize 3D graphics. Please check WebGL support.';
  const fallback=$('webglFallback');if(fallback)fallback.hidden=false;
 }
}
void releaseLoader();
function resize(){const w=sceneHost.clientWidth,h=sceneHost.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}
window.addEventListener('resize',resize);
window.addEventListener('contextmenu',e=>{if(sceneHost.contains(e.target))e.preventDefault();});
setStatus('The Welcome Plaza','A colorful world of connected ideas','◎');
