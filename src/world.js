import * as THREE from 'three';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json';
import { OWNER, timeline, domains, archiveDestinations } from './data.js';
import {terrainHeight} from './terrain.js';
import {makeSculptedTerrain} from './terrain-mesh.js';

const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.76,metalness:.04,...extra});
const palette={grass:'#7fc69f',pale:'#d9dfa4',sand:'#f7c785',cliff:'#db9a82',cliffDark:'#7c5d7a',gold:'#ffd26f',ink:'#253f55',stone:'#fde8cd',white:'#fff6e5'};
const rand=(()=>{let s=942;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};})();
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const v=(x,y,z)=>new THREE.Vector3(x,y,z);
function mesh(geometry,material, parent, x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(parent,w,h,d,color,x=0,y=0,z=0,opts={}){return mesh(new THREE.BoxGeometry(w,h,d),typeof color==='string'?mat(color):color,parent,x,y,z);}
function sphere(parent,r,color,x=0,y=0,z=0,segments=12){return mesh(new THREE.IcosahedronGeometry(r,segments===1?1:2),typeof color==='string'?mat(color):color,parent,x,y,z);}
function cylinder(parent,r0,r1,h,color,x=0,y=0,z=0,n=12){return mesh(new THREE.CylinderGeometry(r0,r1,h,n),typeof color==='string'?mat(color):color,parent,x,y,z);}
function cone(parent,r,h,color,x=0,y=0,z=0,n=6){return mesh(new THREE.ConeGeometry(r,h,n),typeof color==='string'?mat(color):color,parent,x,y,z);}
function torus(parent,R,r,color,x=0,y=0,z=0,rotationX=0){const t=mesh(new THREE.TorusGeometry(R,r,7,44),typeof color==='string'?mat(color):color,parent,x,y,z);t.rotation.x=rotationX;return t;}
function segment(parent,a,b,r,color,seg=7){a= new THREE.Vector3(...a);b=new THREE.Vector3(...b);const line=mesh(new THREE.CylinderGeometry(r,r,a.distanceTo(b),seg),typeof color==='string'?mat(color):color,parent);line.position.copy(a.clone().add(b).multiplyScalar(.5));line.quaternion.setFromUnitVectors(v(0,1,0),b.clone().sub(a).normalize());return line;}
function makeLabelTexture(label, fill='#24343f', accent='#9fd8c8', small='') {
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;const g=canvas.getContext('2d');
 g.fillStyle='#cd935a';g.beginPath();g.roundRect(6,6,1012,244,22);g.fill();g.fillStyle=fill;g.beginPath();g.roundRect(18,18,988,220,18);g.fill();
 g.fillStyle=accent;g.fillRect(24,30,8,192);
 g.textAlign='center';g.fillStyle='#f9f7f0';g.font='bold 74px system-ui, Arial';
 let font=74;while(g.measureText(label).width>920 && font>34){font-=2;g.font=`bold ${font}px system-ui, Arial`;}
 g.fillText(label,525,small?130:154);
 if(small){g.font='600 33px system-ui, Arial';g.fillStyle='#c3cfd3';g.fillText(small,525,204);}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;return texture;
}
function board(parent,text,subtitle,width=12,y=8,accent='#a5ded0',z=0){
 const holder=new THREE.Group();parent.add(holder);holder.position.set(0,y,z);
 const back=box(holder,width+.35,3.28,.3,'#233542',0,0,-.05);
 back.castShadow=true;
 const tx=makeLabelTexture(text,'#233542',accent,subtitle);
 const face=mesh(new THREE.PlaneGeometry(width,3.06),new THREE.MeshBasicMaterial({map:tx,transparent:false,side:THREE.DoubleSide}),holder,0,0,.18);face.castShadow=false;
 segment(holder,[-width/2+.7,-1.66,0],[-width/2+.7,-3.15,0],.13,'#655e59');
 segment(holder,[width/2-.7,-1.66,0],[width/2-.7,-3.15,0],.13,'#655e59');
 return holder;
}
function led(parent,color,x,y,z,r=.1){const m=sphere(parent,r,new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:2,roughness:.28}),x,y,z,1);m.castShadow=false;return m;}
function tree(parent,x,z,scale=1, color='#669c83',fluffy=false){
 const g=new THREE.Group();parent.add(g);g.position.set(x,0,z);g.scale.setScalar(scale);
 cylinder(g,.18,.23,2.3,'#826b60',0,1.15,0,7);
 if(fluffy){sphere(g,1.38,color,-.3,3,0,1);sphere(g,1.2,color,.55,2.92,.24,1);sphere(g,1.09,'#9ac8a8',-.1,3.4,-.25,1);}
 else{cone(g,1.5,3.6,color,0,3.3,0,6);cone(g,1.17,2.7,'#8dbd9d',0,4.45,0,6);}
 return g;
}
function flower(parent,x,z,color){cylinder(parent,.035,.035,.42,'#658d64',x,.3,z,5);sphere(parent,.18,color,x,.58,z,1);}
function tower(parent,height,accent,x=0,z=0){
 cylinder(parent,.85,1.13,.45,'#455568',x,.45,z,8);box(parent,1.6,height,1.6,'#e6e1d6',x,height/2+.7,z);
 for(let k=0;k<3;k++)box(parent,1.75,.15,1.75,'#52687b',x,1.5+k*(height-1)/3,z);
 led(parent,accent,x,height+.8,z,.25);
}
function makeRibbon(parent,points,width,color,y=.16){
 const curve=new THREE.CatmullRomCurve3(points.map(p=>v(p[0],terrainHeight(p[0],p[1])+y,p[1])),false,'centripetal',.35);
 const samples=Math.max(45,points.length*27);const verts=[],uv=[],idx=[];
 for(let i=0;i<=samples;i++){const t=i/samples;const p=curve.getPoint(t);const tangent=curve.getTangent(t).normalize();const n=v(-tangent.z,0,tangent.x);for(const side of [-1,1]){const q=p.clone().addScaledVector(n,side*width*.5);q.y=terrainHeight(q.x,q.z)+y;verts.push(q.x,q.y,q.z);uv.push((side+1)/2,i/9);}if(i<samples){const j=i*2;idx.push(j,j+1,j+2,j+1,j+3,j+2);}}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();
 const material=mat(color,{side:THREE.DoubleSide,roughness:.95});const ribbon=mesh(geo,material,parent);ribbon.castShadow=false;ribbon.receiveShadow=true;
 return {curve,ribbon};
}
function addBuildings(group,style,accent,animated){
 const white='#f9e6cb', slate='#354a58', pale='#d8ebcf';
 // 11 wholly different miniature stage-sets rather than generic labelled boxes.
 if(style==='campus'){
   box(group,8,3.6,5.2,white,0,2.3,0);
   const roof=cone(group,5.8,3.4,'#8eb5a2',0,6.1,0,4);roof.rotation.y=Math.PI/4;roof.scale.z=.56;
   for(let x of [-2.8,-1,1,2.8]){cylinder(group,.23,.27,3.15,'#fdfaf0',x,2.2,2.6,8);}
   cylinder(group,1.2,1.5,1.4,'#e4d6b8',-5,1.0,1.1,8);cone(group,.8,1.8,accent,-5,2.6,1.1,6);
   box(group,2.1,.26,2.6,'#f9d38c',4,.95,3.2);box(group,2.1,.28,2.6,'#7ca4a4',4,1.27,3.2);
 }
 else if(style==='survey'){
   box(group,7,.6,6.2,white,0,1.1,0);box(group,6.2,4.2,3.6,'#8aaf9e',.5,3.2,-1.1);
   for(const x of [-3.8,3.9])cylinder(group,.16,.16,5.8,slate,x,3.0,2.2,7);
   box(group,7.8,.4,.5,'#354b58',0,5.9,2.2);
   for(let i=-2;i<=2;i++){segment(group,[-2+i,1.85,3.0],[-2+i*.55,4.35,3],.09,'#3c5661');}
   cylinder(group,.4,.58,.9,'#c6a96e',-4,2.2,-2,8);cone(group,.3,1.0,accent,-4,3.1,-2,8);
 }
 else if(style==='industrial'){
   for(let i=-1;i<=1;i++){cylinder(group,1.35,1.35,2.6,'#dde3d9',i*2.85,2,0,12);torus(group,1.36,.14,'#9ea6a2',i*2.85,3.2,0,Math.PI/2);}
   segment(group,[-4.4,1.5,2.8],[4.4,1.5,2.8],.37,'#d88c64');
   box(group,3.1,3.9,2.6,'#718d91',-4,2.85,-2.5);cone(group,2.5,1.6,'#eab77f',-4,5.6,-2.5,4).rotation.y=.78;
 }
 else if(style==='planning'){
   box(group,7.4,.45,5.1,'#d7b68b',0,1.7,0);box(group,6.8,.07,4.5,'#e8f0e6',0,1.98,0);
   for(let i=-3;i<4;i++)segment(group,[i,2.03,-1.8],[i,2.03,1.8],.02,'#7bb3ae');
   for(let i=-2;i<3;i++)segment(group,[-2.9,2.035,i],[2.9,2.035,i],.02,'#7bb3ae');
   cylinder(group,.2,.24,5.4,'#556c72',3.8,3.15,-2.4,9);sphere(group,.67,accent,3.8,6.1,-2.4,1);
   box(group,2.5,3.2,1.1,'#607c89',-4.8,2.25,-2.8);
 }
 else if(style==='globe'){
   cylinder(group,3.1,3.5,1.1,'#e9d8b6',0,1.05,0,12);
   const globe=sphere(group,3.1,new THREE.MeshStandardMaterial({color:'#74aeb1',metalness:.13,roughness:.45}),0,5.25,0,2);
   const wire=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(3.12,1)),new THREE.LineBasicMaterial({color:'#e9e5d4',transparent:true,opacity:.7}));wire.position.set(0,5.25,0);group.add(wire);
   torus(group,3.42,.12,'#e7bd83',0,5.25,0,.45);animated.push({group:globe,kind:'rotate',base:0});
   for(let k=0;k<3;k++){const a=k*Math.PI*2/3;box(group,.9,2.6,1.0,slate,Math.cos(a)*5,1.9,Math.sin(a)*4);}
 }
 else if(style==='utilities'){
   for(let i of [-2.6,2.6]){
     segment(group,[i-1.0,.7,0],[i,7.3,0],.18,'#647980');segment(group,[i+1,.7,0],[i,7.3,0],.18,'#647980');
     segment(group,[i-1,3.0,0],[i+1,3,0],.11,'#647980');segment(group,[i-1,5.3,0],[i+1,5.3,0],.11,'#647980');
     box(group,3.6,.22,.2,'#f6dbaa',i,7.18,0);
   }
   for(let x=-2.6;x<=2.6;x+=1.3)segment(group,[x,7.2,0],[x,6.8,-3.1],.06,'#d2bca0');
   box(group,3.4,2.4,3.2,'#a3c0bd',0,1.8,3);
 }
 else if(style==='software'){
   for(let i=0;i<4;i++){const x=(i-1.5)*2.0;box(group,1.5,2.5+i*.7,1.6,'#708ca0',x,1.8+i*.35,-.8);box(group,1.65,1.6,1.75,'#324650',x,2.0+i*.55,.1);for(let j=0;j<3;j++)led(group,j===i%3?accent:'#67bdc2',x-.4+j*.4,2+i*.55+(j%2)*.3,1,.13);}
   box(group,7,.35,4.4,'#f4e6d0',0,.85,3.2);torus(group,1.2,.22,accent,0,4.9,-1.9,Math.PI/2);
 }
 else if(style==='cloudtower'){
   tower(group,4.6,accent,-3,0);tower(group,6.3,accent,0,-1);tower(group,3.9,accent,3,0);
   for(let x=-3;x<=3;x+=3)segment(group,[x,4.9,-.2],[0,7.7,-1],.06,'#91bee2');
   sphere(group,1.45,'#f3eef1',0,9,-1,1);sphere(group,1.02,'#f3eef1',-1.2,8.8,-1,1);sphere(group,1.12,'#f3eef1',1.3,8.8,-1,1);
 }
 else if(style==='processor'){
   box(group,8,1.2,5.9,'#526879',0,1.35,0);for(let i=0;i<3;i++){const x=(i-1)*2.5;torus(group,1.38,.29,'#ddd8c8',x,3.2,0,Math.PI/2);torus(group,.72,.12,accent,x,3.2,0,Math.PI/2);led(group,accent,x,3.2,0,.3);}
   segment(group,[-4,1.7,2.4],[4,1.7,2.4],.16,'#d4b28a');
 }
 else if(style==='datatower'){
   for(let i=0;i<5;i++){const x=(i-2)*1.55;const h=2.8+(i%3)*1.7;box(group,1.25,h,2.2,i%2?'#7f9fa5':'#9fb5ac',x,h/2+.75,0);box(group,1.3,.24,2.3,accent,x,h+.87,0);}
   box(group,9,.34,4.8,'#ebd7bc',0,.65,0);for(let i=0;i<6;i++)led(group,accent,-4+i*1.6,1.1,2.42,.15);
 }
 else if(style==='geolab'){
   cylinder(group,3.5,4,1.2,'#d4c5cf',0,1.0,0,12);
   const gem=sphere(group,3.1,new THREE.MeshStandardMaterial({color:accent,metalness:.18,roughness:.17,emissive:accent,emissiveIntensity:.22,flatShading:true}),0,5.7,0,1);
   gem.userData.float=true;torus(group,4,.1,'#f7e4c9',0,5.5,0,.6);torus(group,3.7,.09,'#9dcae3',0,5.5,0,Math.PI/2);
   for(let k=0;k<5;k++){const a=k*2*Math.PI/5;led(group,accent,Math.sin(a)*4.4,1.8,Math.cos(a)*4.4,.22);}
 }
}
function decorateStage(group,accent,idx){
 const disk=cylinder(group,8.5,9.1,.6,['#fff0d6','#d0ede5','#ffe2c6','#e7dbf6','#d3ebf5','#fbe6b7'][idx%6],0,.27,0,12);disk.castShadow=false;
 const ring=torus(group,8.55,.10,accent,0,.63,0,Math.PI/2);ring.material.transparent=true;ring.material.opacity=.7;
 for(let i=0;i<5;i++){const angle=i*2*Math.PI/5+.1;const x=Math.sin(angle)*7.55,z=Math.cos(angle)*7.55;flower(group,x,z,i%2?'#f2c1a0':'#f6deaa');}
 for(let i of [-1,1]){cylinder(group,.14,.15,1.9,'#48616b',i*6.7,1.42,5.2,8);led(group,'#ffdeaa',i*6.7,2.5,5.2,.3);}
 // Colorful pennant bunting, elegant enough for an editorial miniature city.
 segment(group,[-7,5.6,-5],[7,5.6,-5],.034,'#ffffff');
 for(let n=0;n<9;n++){
   const flag=mesh(new THREE.ConeGeometry(.43,1.05,3),mat(['#f49a70','#f3c66a','#81cfc0','#ba98e1'][n%4],{side:THREE.DoubleSide}),group,-6.25+n*1.55,5.08,-5);
   flag.rotation.z=Math.PI;flag.castShadow=false;
 }
 // Small complementary lanterns and planter pots.
 for(const x of [-5.5,5.5]){cylinder(group,.55,.66,.74,'#f1bb86',x,.8,5.0,8);sphere(group,.7,idx%2?'#76bfa2':'#db94b4',x,1.65,5.0,1);}

}
function makeCareer(parent,item,index,targets,animated){
 const group=new THREE.Group();parent.add(group);group.position.set(item.location[0],terrainHeight(...item.location),item.location[1]);
 decorateStage(group,item.color,index);addBuildings(group,item.style,item.color,animated);
 board(group,item.company,item.years,13,10.6,item.color,0);
 const hit=mesh(new THREE.CylinderGeometry(9,9,14,12),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),group,0,7,0);hit.castShadow=false;hit.userData={kind:'career',id:item.id};targets.push(hit);
 const nboard=new THREE.Group();group.add(nboard);nboard.position.set(-6.7,2.8,5.25);
 const circle=cylinder(nboard,.9,1,.23,'#293d48',0,0,0,12);circle.rotation.x=Math.PI/2;
 const text=board(nboard,String(index+1).padStart(2,'0'),'',3,1.6,item.color,.3);text.scale.setScalar(.56);
 animated.push({group,kind:'career',id:item.id,base:0,ring:group.children[1]});return group;
}
function makeDomain(parent,dom,index,targets,animated){
 const group=new THREE.Group();parent.add(group);group.position.set(dom.location[0],terrainHeight(...dom.location),dom.location[1]);
 cylinder(group,10.2,10.8,.6,'#e4d3bc',0,.3,0,10);
 torus(group,10,.17,dom.color,0,.65,0,Math.PI/2);
 if(dom.style==='gis'){
   const slab=box(group,9,.3,6,'#a5c9b5',0,1.65,0);slab.rotation.y=.12;
   for(let k=0;k<5;k++){const l=k*1.0-2.1;const pts=[];for(let i=0;i<15;i++){let x=-4+i*.56;pts.push(v(x,1.87,l+Math.sin(x*1.2+k*.34)*.27));}const tube=mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.032,4,false),mat('#4d897f'),group);tube.castShadow=false;}
   cylinder(group,.15,.22,5.2,'#495d62',3.9,3.7,-2,9);sphere(group,.6,dom.color,3.9,6.5,-2,1);
 }
 else if(dom.style==='code'){
   for(let i=0;i<4;i++){box(group,1.7,4.1+i*.7,2.2,'#486174',(i-1.5)*2.15,2.8+i*.35,0);for(let k=0;k<3;k++)led(group,dom.color,(i-1.5)*2.15-.35+k*.35,3+i*.3,.0+1.16,.12);}
   torus(group,3.3,.12,dom.color,0,6,0,.85);
 }
 else if(dom.style==='cloud'){
   for(let i=0;i<4;i++)tower(group,2.9+i*.83,dom.color,(i-1.5)*2.3,0);
   for(let i=0;i<6;i++)sphere(group,.9+i%2*.35,'#eee9ef',-3.5+i*1.35,8.2+Math.sin(i)*.55,0,1);
 }
 else if(dom.style==='data'){
   for(let i=0;i<5;i++){const h=2.2+i*.8;cylinder(group,.7,.7,h,i%2?'#8fabb2':'#c8bcb4',(i-2)*1.65,h/2+.9,0,9);}
   for(let i=0;i<4;i++)segment(group,[-3+i*1.65,5,0],[-1.35+i*1.65,5.7,0],.08,dom.color);
 }
 else if(dom.style==='ai'){
   const gem=sphere(group,3.15,new THREE.MeshStandardMaterial({color:'#ba9bcb',emissive:dom.color,emissiveIntensity:.45,metalness:.24,roughness:.18,flatShading:true}),0,5.5,0,1);gem.userData.spin=true;torus(group,4.3,.1,dom.color,0,5.5,0,.4);torus(group,3.5,.1,'#e9dfff',0,5.5,0,Math.PI/2);
   animated.push({group:gem,kind:'gem',base:5.5});
 }
 else if(dom.style==='leadership'){
   cylinder(group,5.4,5.5,.8,'#d6c5a6',0,1.1,0,12);box(group,3.8,1.3,1.5,'#698887',0,2.1,0);
   for(let i=0;i<6;i++){const a=i*2*Math.PI/6;box(group,1,1,1,'#b8a48d',Math.sin(a)*4,1.4,Math.cos(a)*4);}
   segment(group,[0,2.5,0],[0,6.5,0],.17,'#5c6364');sphere(group,.65,dom.color,0,6.7,0,1);
 }
 board(group,dom.name,'DOMAIN WORLD',14,9.3,dom.color,.3);
 const hit=mesh(new THREE.CylinderGeometry(10.5,10.5,13,12),new THREE.MeshBasicMaterial({opacity:0,transparent:true,depthWrite:false}),group,0,6,0);hit.castShadow=false;hit.userData={kind:'domain',id:dom.id};targets.push(hit);
 return group;
}
function telephoneSignTexture(){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=180;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#fff7e9';ctx.fillRect(0,0,768,180);
 ctx.strokeStyle='#b89164';ctx.lineWidth=7;ctx.strokeRect(6,6,756,168);
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 91px Georgia, serif';ctx.fillStyle='#242a2b';ctx.fillText('TELEPHONE',384,98);
 const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function booth(parent,targets,animated){
 const group=new THREE.Group();parent.add(group);group.position.set(3,terrainHeight(3,-10),-10);
 // K6-inspired classic red London telephone kiosk, with gridded glazing,
 // a domed roof, illuminated TELEPHONE sign and brass detailing.
 const red='#c92439',redDark='#981d31',metal='#efc882',ivory='#fff7e5';
 cylinder(group,8.55,9.1,.55,'#d9d1d0',0,.26,0,12);
 torus(group,8.5,.17,'#eeae76',0,.55,0,Math.PI/2);
 for(const x of [-4.5,0,4.5])for(const z of [-4.5,0,4.5]){
   const tile=box(group,4,.04,4,(Math.round((x+z)/4.5)%2)?'#f8e4da':'#efcfca',x,.57,z);tile.castShadow=false;
 }
 // Telephone pedestal and familiar sculptural K6 proportions.
 box(group,5.35,.4,4.95,redDark,0,.92,0);
 for(const x of [-2.33,2.33])for(const z of [-2.12,2.12]){
  box(group,.49,7.25,.49,red,x,4.61,z);
  box(group,.13,7.2,.13,metal,x+(x<0?.24:-.24),4.62,z+(z<0?.22:-.22));
 }
 // Solid rear and front-door lower panels.
 box(group,4.4,2.05,.22,red,0,2.1,-2.06);
 box(group,4.15,1.25,.18,red,0,1.55,2.18);
 box(group,5.5,.67,5.12,red,0,8.15,0);
 box(group,5.1,.24,4.78,metal,0,8.55,0);
 const dome=mesh(new THREE.SphereGeometry(3.18,16,10,0,Math.PI*2,0,Math.PI*.54),mat(red,{metalness:.16,roughness:.52}),group,0,8.42,0);
 dome.scale.set(1,.43,.94);dome.castShadow=true;
 box(group,4.65,.16,4.4,metal,0,8.77,0);
 // Four cream TELEPHONE panels. Texture is on both sides.
 const signTexture=telephoneSignTexture();
 const signMaterial=new THREE.MeshBasicMaterial({map:signTexture,side:THREE.DoubleSide});
 const front=mesh(new THREE.PlaneGeometry(4.28,.84),signMaterial,group,0,7.70,2.45);front.castShadow=false;
 const back=mesh(new THREE.PlaneGeometry(4.28,.84),signMaterial,group,0,7.70,-2.45);back.rotation.y=Math.PI;back.castShadow=false;
 for(const side of [-1,1]){const sign=mesh(new THREE.PlaneGeometry(4.05,.84),signMaterial,group,side*2.55,7.7,0);sign.rotation.y=side*Math.PI/2;sign.castShadow=false;}
 // Six-by-three grid, dark blue glazing with glossy highlights.
 const glass=mat('#9bd8e8',{transparent:true,opacity:.38,roughness:.12,metalness:.12,depthWrite:false,side:THREE.DoubleSide});
 for(let col=0;col<3;col++)for(let row=0;row<3;row++){
   const x=-1.45+col*1.45,y=3.25+row*1.27;
   const pane=box(group,1.26,1.10,.055,glass,x,y,2.23);pane.castShadow=false;
 }
 for(const x of [-2.10,-.71,.71,2.10])box(group,.12,4.07,.19,red,x,4.53,2.25);
 for(const y of [2.62,3.87,5.14,6.40])box(group,4.40,.11,.17,red,0,y,2.27);
 for(const side of [-1,1]){
  for(let col=0;col<2;col++)for(let row=0;row<3;row++){
   const z=-.92+col*1.86,y=3.25+row*1.27;
   const pane=box(group,.054,1.10,1.56,glass,side*2.24,y,z);pane.castShadow=false;
  }
  for(const z of [-1.85,0,1.85])box(group,.16,4.09,.15,red,side*2.27,4.5,z);
  for(const y of [2.62,3.87,5.14,6.40])box(group,.13,.12,4.20,red,side*2.28,y,0);
 }
 // Inside handset, mounted board and LinkedIn sign, visible through front door.
 box(group,2.16,3,.33,'#324b63',0,3.9,-1.45);
 box(group,1.7,1.0,.14,'#f5e1ca',0,4.55,-1.19);
 segment(group,[-.46,4.45,-.90],[.46,4.45,-.90],.16,'#243246');
 for(let n=0;n<12;n++)led(group,ivory,-.52+(n%3)*.52,3.74-Math.floor(n/3)*.30,-1.15,.075);
 const linkedinLogo=makeLabelTexture('in','#0a66c2','#fff6e5','LINKEDIN');
 mesh(new THREE.PlaneGeometry(2.15,1.08),new THREE.MeshBasicMaterial({map:linkedinLogo}),group,0,2.20,2.32).castShadow=false;
 sphere(group,.18,metal,1.86,2.8,2.39,1);
 led(group,'#ffe1ab',0,9.1,0,.34);
 board(group,'LONDON PHONE BOX','CONNECT ON LINKEDIN',15,11.4,'#edaf8e',0);
 const hit=mesh(new THREE.CylinderGeometry(6.2,6.2,16.5,10),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),group,0,6.6,0);
 hit.castShadow=false;hit.userData={kind:'contact',id:'contact'};targets.push(hit);
 animated.push({group,kind:'booth',base:0});return group;
}
function makeArchiveLandmark(parent,archive,targets){
 const group=new THREE.Group();parent.add(group);group.position.set(archive.location[0],terrainHeight(...archive.location),archive.location[1]);
 const c=archive.color;
 cylinder(group,9.1,9.7,.6,'#f1e7d9',0,.28,0,12);
 torus(group,8.95,.18,c,0,.65,0,Math.PI/2);
 for(let i=0;i<10;i++){const a=i*Math.PI*2/10;flower(group,Math.cos(a)*8,Math.sin(a)*8,['#f3a986','#f7cd75','#a3b1e5'][i%3]);}
 if(archive.id==='certifications'){
  // A circular gallery of medals, credentials and illuminated award plinths.
  for(let i=0;i<5;i++){
   const a=i*2*Math.PI/5;const x=Math.cos(a)*5,z=Math.sin(a)*4.1;
   cylinder(group,1.25,1.4,2.2,'#e1d6ca',x,1.6,z,8);
   torus(group,.92,.20,i%2?'#f2b96c':'#b89de8',x,3.7,z,0);
   sphere(group,.28,'#f8e2a4',x,3.7,z,.5);
  }
  cylinder(group,2.5,2.9,1.6,'#e1b275',0,1.0,0,12);
  const star=mesh(new THREE.OctahedronGeometry(2.1),mat('#ffc65f',{metalness:.42,roughness:.25}),group,0,5.8,0);star.rotation.z=.24;
 }else{
  // A skill-building studio: modular colorful tool towers and floating glyphs.
  for(let i=0;i<6;i++){
   const a=i*Math.PI*2/6;const x=Math.cos(a)*5,z=Math.sin(a)*4;
   const h=2.1+(i%3)*1.2;
   box(group,1.75,h,1.75,['#72c7c1','#f9bb82','#b3a4e9'][i%3],x,h/2+.85,z);
   box(group,1.9,.28,1.9,'#fff7e7',x,h+.97,z);
  }
  const core=sphere(group,2.6,'#9b86dc',0,5.6,0,1);core.scale.y=1.28;
  torus(group,3.6,.14,'#ffdda2',0,5.6,0,Math.PI/2);
 }
 board(group,archive.name,archive.id==='skills'?'EXPLORE YOUR TECH STACK':'EXPLORE CERTIFICATIONS',16,10.6,c,.1);
 const hit=mesh(new THREE.CylinderGeometry(9,9,15,12),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),group,0,7,0);
 hit.castShadow=false;hit.userData={kind:'archive',id:archive.id};targets.push(hit);
 return group;
}
function originSign(parent){
 const g=new THREE.Group();parent.add(g);g.position.set(-67,terrainHeight(-67,-11),-11);
 cylinder(g,16,16.6,.72,'#e6d7c2',0,.37,0,20);
 torus(g,15.8,.15,'#b78b77',0,.76,0,Math.PI/2);
 for(let i=-1;i<=1;i++)box(g,17.9,.45,.75,'#d1bba1',0,1.15+i*.38,-4.5-i*.15);
 const font=new Font(helvetiker);
 // The owner's name is genuine extruded 3D typography, not just a flat UI label.
 const textGeo=new TextGeometry(OWNER.toUpperCase(),{font,size:2.2,depth:.36,curveSegments:5,bevelEnabled:true,bevelThickness:.11,bevelSize:.09,bevelSegments:2});
 textGeo.computeBoundingBox();const wid=textGeo.boundingBox.max.x-textGeo.boundingBox.min.x;
 const textMesh=mesh(textGeo,mat('#fbf2df',{metalness:.16,roughness:.48}),g,-wid/2,2.4,-4);textMesh.rotation.x=0;textMesh.castShadow=true;
 const sub=makeLabelTexture('THE GEOVERSE JOURNEY','#293d47','#e5bf86','A CAREER YOU CAN WALK THROUGH');
 mesh(new THREE.PlaneGeometry(25.2,6.25),new THREE.MeshBasicMaterial({map:sub,transparent:true}),g,0,8.1,-4.2);
 cylinder(g,.15,.18,5.2,'#866f62',-10.5,5,-4.5);cylinder(g,.15,.18,5.2,'#866f62',10.5,5,-4.5);
 for(let i=0;i<8;i++){const a=i*2*Math.PI/8;flower(g,Math.sin(a)*13,Math.cos(a)*12, i%2?'#d2a4b4':'#f5db92');}
 return g;
}
function makeIsland(parent){
 const shape=new THREE.Shape();const x=-125,z=-75,w=250,h=150,r=10;
 shape.moveTo(x+r,z);shape.lineTo(x+w-r,z);shape.quadraticCurveTo(x+w,z,x+w,z+r);shape.lineTo(x+w,z+h-r);shape.quadraticCurveTo(x+w,z+h,x+w-r,z+h);shape.lineTo(x+r,z+h);shape.quadraticCurveTo(x,z+h,x,z+h-r);shape.lineTo(x,z+r);shape.quadraticCurveTo(x,z,x+r,z);
 const cliff=mesh(new THREE.ExtrudeGeometry(shape,{depth:7.2,bevelEnabled:true,bevelSegments:2,steps:1,bevelThickness:.6,bevelSize:.8,curveSegments:5}),[mat('#e0ab8b'),mat('#a87876')],parent);
 cliff.rotation.x=-Math.PI/2;cliff.position.y=-7;cliff.castShadow=true;
 const surface=mesh(new THREE.ShapeGeometry(shape,16),mat('#86c79f',{roughness:1,side:THREE.DoubleSide}),parent,0,.43,0);surface.rotation.x=-Math.PI/2;surface.castShadow=false;
 const border=mesh(new THREE.ShapeGeometry(shape,16),mat('#dbe5a5',{side:THREE.DoubleSide}),parent,0,.38,0);border.rotation.x=-Math.PI/2;
 return {surface,cliff};
}
function pond(parent,x,z,rx,rz){
 const s=new THREE.Group();parent.add(s);s.position.set(x,terrainHeight(x,z)+.06,z);
 const ellipse=new THREE.Shape();ellipse.absellipse(0,0,rx,rz,0,Math.PI*2,false,0);
 const water=mesh(new THREE.ShapeGeometry(ellipse,50),new THREE.MeshStandardMaterial({color:'#48bfd0',roughness:.12,metalness:.28,transparent:true,opacity:.94,side:THREE.DoubleSide}),s,0,.51,0);water.rotation.x=-Math.PI/2;water.castShadow=false;
 const shore=new THREE.Group();s.add(shore);
 for(let i=0;i<55;i++){const a=i/55*Math.PI*2;const r=1+.05*Math.sin(i*2.2);const xx=Math.cos(a)*rx*r,zz=Math.sin(a)*rz*r;
 const p=sphere(shore,.36+i%3*.09,i%5===0?'#ffdec0':'#9fbcb4',xx,.48,zz,1);p.scale.set(1.8,.45,1.2);}
 return s;
}
function addGarden(parent,blocked){
 // Warm irregular meadow patches and tiny foliage define the crafted diorama look.
 for(let i=0;i<22;i++){
   const x=-119+rand()*238,z=-68+rand()*135;
   if(blocked.some(p=>Math.hypot(p[0]-x,p[1]-z)<13)||Math.hypot(x-3,z+10)<13||Math.hypot(x+67,z+11)<18)continue;
   const mound=sphere(parent,2.8+rand()*2.8, i%2?'#9fdcc0':'#d7d99e',x,terrainHeight(x,z)+.17,z,1);mound.scale.set(1,.18,.73);
 }
 for(let i=0;i<95;i++){
   const x=-119+rand()*238,z=-67+rand()*134;
   if(blocked.some(p=>Math.hypot(p[0]-x,p[1]-z)<10.5)||Math.hypot(x-3,z+10)<11||Math.hypot(x+67,z+11)<18)continue;
   if(x>5&&x<29&&z>-2&&z<13)continue;
   if(rand()<.5){const foliage=['#ff8f7b','#f7c05a','#b680ef','#ff9ecb','#39b7a5','#f06a55','#8ed37e'];const elevated=new THREE.Group();elevated.position.set(x,terrainHeight(x,z),z);parent.add(elevated);tree(elevated,0,0,.52+rand()*.38,foliage[Math.floor(rand()*foliage.length)],rand()<.7);}
   else {for(let j=0;j<4;j++){const fx=x+rand()*.9,fz=z+rand()*.9;const plot=new THREE.Group();plot.position.set(fx,terrainHeight(fx,fz),fz);parent.add(plot);flower(plot,0,0,rand()<.5?'#ffbd7d':'#f4a6d0');}}
 }
 // Stone pavers and benches dotted along the edge.
 for(let i=0;i<12;i++){const x=-114+i*20;const z=(i%2?64:-64);
   if(Math.abs(x)>106)continue;
   const y=terrainHeight(x,z);const b=box(parent,3,.25,1.2,'#f9e6d0',x,y+.72,z);b.rotation.y=rand()*.2-.1;
   box(parent,.2,.95,1.1,'#9a8a78',x-1.15,y+.26,z);box(parent,.2,.95,1.1,'#9a8a78',x+1.15,y+.26,z);
 }
}
export function makeWorld(scene){
 const world=new THREE.Group();scene.add(world);const targets=[],animated=[];
 const terrain=makeSculptedTerrain(world);
 // Main boardwalk has two chapters and a gentle turn at Verisk.
 const routePoints=timeline.map(x=>x.location);
 const route=makeRibbon(world,routePoints,3.9,'#fff0d1',.63);
 const verge=makeRibbon(world,routePoints,4.6,'#daaf92',.54);verge.ribbon.renderOrder=-1;
 // Lane dots lead to the next chapter and are intentionally spaced by distance.
 for(let i=0;i<115;i++){const p=route.curve.getPoint(i/114);const m=box(world,.33,.055,.7,'#ecab76',p.x,p.y+.075,p.z);m.castShadow=false;}
 const blocked=[...timeline.map(x=>x.location),...domains.map(x=>x.location),...archiveDestinations.map(x=>x.location)];
 addGarden(world,blocked);
 pond(world,14,14,8.8,5.2);
 for(const [i,item] of timeline.entries())makeCareer(world,item,i,targets,animated);
 for(const [i,dom] of domains.entries())makeDomain(world,dom,i,targets,animated);
 for(const destination of archiveDestinations)makeArchiveLandmark(world,destination,targets);
 // Short stone footbridges tie the domain world into the main island promenade.
 const connectors=[[[ -101,30],[-98,-53]], [[-53,32],[-59,-53]], [[47,31],[-20,-53]], [[75,-8],[19,-53]], [[48,-9],[58,-53]], [[22,30],[97,-53]]];
 // These are symbolic only, not full-width paths traversing the other zones.
 const portalLines=[];
 for(const [a,b] of connectors){const points=[v(a[0],terrainHeight(...a)+3,a[1]),v((a[0]+b[0])*.5,Math.max(terrainHeight(...a),terrainHeight(...b))+16,(a[1]+b[1])*.5),v(b[0],terrainHeight(...b)+3,b[1])];
   const g=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),42,.053,5,false);
   const m=new THREE.LineBasicMaterial({color:'#9bb4ae',transparent:true,opacity:.22});
   const line=mesh(g,mat('#c2b2ba',{transparent:true,opacity:.35,emissive:'#c9baab',emissiveIntensity:.13}),world);line.castShadow=false;portalLines.push(line);
 }
 booth(world,targets,animated);
 originSign(world);
 // Floating cartographic observation balloons lend a subtle sense of motion.
 for(let i=0;i<5;i++){
   const balloon=new THREE.Group();world.add(balloon);
   const x=-89+i*46,z=-28+(i%3)*26;
   balloon.position.set(x,terrainHeight(x,z)+21+i%2*3,z);
   const balloonColor=['#ffa888','#f5d576','#c5abfa','#8ad9bb','#f4a4c8'][i];
   const body=sphere(balloon,1.7,balloonColor,0,0,0,1);body.scale.set(1.12,1.4,1.08);
   for(let j=0;j<4;j++)segment(balloon,[Math.sin(j*Math.PI/2)*1.0,-1.6,Math.cos(j*Math.PI/2)*1.0],[Math.sin(j*Math.PI/2)*.45,-3.1,Math.cos(j*Math.PI/2)*.45],.024,'#a7938e');
   box(balloon,.95,.65,.95,'#b58a76',0,-3.45,0);
   animated.push({group:balloon,kind:'balloon',base:terrainHeight(x,z)+21+i%2*3,offset:i*1.4});
 }

 // Small story gateway with a clear destination sign.
 const gateway=new THREE.Group();world.add(gateway);gateway.position.set(-111,terrainHeight(-111,66),66);
 for(let x of [-6,6]){cylinder(gateway,.43,.57,6.2,'#ccb6a0',x,3.5,0,8);sphere(gateway,.55,'#ffe7b6',x,7.1,0,1);}
 box(gateway,14,1.2,.9,'#394e59',0,6.45,0);
 board(gateway,'START HERE','01 · EDUCATION',13,9.3,'#9aceba',0);
 // Layer islands texture: avoid huge featureless grass slabs.
 for(let i=0;i<48;i++){const x=-121+rand()*241,z=-70+rand()*140;
   if(blocked.some(p=>Math.hypot(p[0]-x,p[1]-z)<10)||Math.hypot(x-3,z+10)<10||Math.hypot(x+67,z+11)<17)continue;
   const p=mesh(new THREE.CircleGeometry(.22+rand()*.6,5),mat(i%2?'#86b29b':'#d6d0ac',{side:THREE.DoubleSide}),world,x,terrainHeight(x,z)+.05,z);p.rotation.x=-Math.PI/2;p.castShadow=false;
 }
 return {world,targets,animated,route:route.curve,portalLines,terrain};
}
