import * as THREE from 'three';
import {terrainHeight, TERRAIN_WIDTH, TERRAIN_DEPTH} from './terrain.js';

const NX=180, NZ=112;
const PALETTE=[
  [0.00,'#3a9c96'],[0.15,'#5baaa3'],[0.32,'#89b59a'],
  [0.48,'#bcbf91'],[0.66,'#d6bb86'],[0.83,'#e8c990'],[1.0,'#fff1bb']
];
const mix=(value)=>{
 const t=THREE.MathUtils.clamp(value,0,1);
 let j=1;while(j<PALETTE.length-1 && PALETTE[j][0]<t)j++;
 const [a,ac]=PALETTE[j-1],[b,bc]=PALETTE[j];
 return new THREE.Color(ac).lerp(new THREE.Color(bc),(t-a)/(b-a));
};

/** Creates a real heightfield mesh and marching-squares contour lines. */
export function makeSculptedTerrain(parent){
 const ground=new THREE.Group();parent.add(ground);
 const geometry=new THREE.PlaneGeometry(TERRAIN_WIDTH,TERRAIN_DEPTH,NX,NZ);
 geometry.rotateX(-Math.PI/2);
 const positions=geometry.getAttribute('position');
 const heights=new Float32Array((NX+1)*(NZ+1));
 let hMin=Infinity,hMax=-Infinity;
 const ncol=positions.count, colors=new Float32Array(ncol*3);
 for(let i=0;i<ncol;i++){
  const x=positions.getX(i),z=positions.getZ(i);
  const h=terrainHeight(x,z);
  positions.setY(i,h);
  heights[i]=h;
  hMin=Math.min(hMin,h);hMax=Math.max(hMax,h);
 }
 for(let i=0;i<ncol;i++){
  const x=positions.getX(i),z=positions.getZ(i),h=positions.getY(i);
  const dx=terrainHeight(x+.42,z)-terrainHeight(x-.42,z);
  const dz=terrainHeight(x,z+.42)-terrainHeight(x,z-.42);
  const slope=Math.hypot(dx,dz);
  const t=THREE.MathUtils.clamp((h-1)/(31-1),0,1);
  const shade=mix(t).lerp(new THREE.Color('#bf9d80'),Math.min(.23,slope*.052));
  colors[i*3]=shade.r;colors[i*3+1]=shade.g;colors[i*3+2]=shade.b;
 }
 positions.needsUpdate=true;
 geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
 geometry.computeVertexNormals();
 const terrain=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({vertexColors:true,roughness:.96,metalness:0,side:THREE.DoubleSide}));
 terrain.receiveShadow=true;terrain.castShadow=false;ground.add(terrain);
 // Vertical geological edge walls make the terrain feel like an extracted GIS model.
 const sideVerts=[],sideColors=[],sideIndex=[];
 const edgePoints=[];
 for(let i=0;i<=NX;i++)edgePoints.push([-125+i*TERRAIN_WIDTH/NX,-75]);
 for(let j=1;j<=NZ;j++)edgePoints.push([125,-75+j*TERRAIN_DEPTH/NZ]);
 for(let i=NX-1;i>=0;i--)edgePoints.push([-125+i*TERRAIN_WIDTH/NX,75]);
 for(let j=NZ-1;j>0;j--)edgePoints.push([-125, -75+j*TERRAIN_DEPTH/NZ]);
 edgePoints.forEach(([x,z],i)=>{
  const h=terrainHeight(x,z),bottom=-10;
  sideVerts.push(x,h,z,x,bottom,z);
  const t=(h-1)/30,top=mix(t).lerp(new THREE.Color('#8a6e73'),.27);
  const bot=new THREE.Color('#344a59');
  sideColors.push(top.r,top.g,top.b,bot.r,bot.g,bot.b);
  const next=(i+1)%edgePoints.length;
  sideIndex.push(i*2,i*2+1,next*2,next*2,i*2+1,next*2+1);
 });
 const sideGeo=new THREE.BufferGeometry();sideGeo.setAttribute('position',new THREE.Float32BufferAttribute(sideVerts,3));sideGeo.setAttribute('color',new THREE.Float32BufferAttribute(sideColors,3));sideGeo.setIndex(sideIndex);sideGeo.computeVertexNormals();
 const walls=new THREE.Mesh(sideGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));
 walls.receiveShadow=true;ground.add(walls);
 // Marching squares elevation isolines follow the *actual* 3D geometry.
 const contourPoints=[];const contourColors=[];
 const levels=[];for(let h=3;h<=33;h+=2.5)levels.push(h);
 const col=new THREE.Color('#f7e9c4');
 const addIso=(a,b,c,d,level)=>{
  const edges=[];const crossing=(p,q)=>{
   if((p[2]-level)*(q[2]-level)>=0 || p[2]===q[2])return;
   const t=(level-p[2])/(q[2]-p[2]);
   edges.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);
  };
  crossing(a,b);crossing(b,c);crossing(c,d);crossing(d,a);
  for(let k=0;k+1<edges.length;k+=2){
   const [p,q]=[edges[k],edges[k+1]];
   contourPoints.push(p[0],level+.095,p[1],q[0],level+.095,q[1]);
   for(let n=0;n<2;n++)contourColors.push(col.r,col.g,col.b);
  }
 };
 const sx=TERRAIN_WIDTH/NX,sz=TERRAIN_DEPTH/NZ;
 // Access height by actual X/Z, avoiding vertex attribute row-flip details.
 const elevation=(x,z)=>terrainHeight(x,z);
 for(let iz=0;iz<NZ;iz++)for(let ix=0;ix<NX;ix++){
  const x=-125+ix*sx,z=-75+iz*sz;
  const a=[x,z,elevation(x,z)],b=[x+sx,z,elevation(x+sx,z)];
  const c=[x+sx,z+sz,elevation(x+sx,z+sz)],d=[x,z+sz,elevation(x,z+sz)];
  const min=Math.min(a[2],b[2],c[2],d[2]),max=Math.max(a[2],b[2],c[2],d[2]);
  for(const level of levels){if(level>min && level<max)addIso(a,b,c,d,level);}
 }
 const isoGeo=new THREE.BufferGeometry();isoGeo.setAttribute('position',new THREE.Float32BufferAttribute(contourPoints,3));
 isoGeo.setAttribute('color',new THREE.Float32BufferAttribute(contourColors,3));
 const isolines=new THREE.LineSegments(isoGeo,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.52,depthWrite:false}));
 isolines.renderOrder=1;ground.add(isolines);
 // Sparse elevation markers, recalling annotated terrain survey maps.
 for(const [x,z,color] of [[-98,-41,'#ffe29d'],[-5,-50,'#8bdaed'],[79,-42,'#ff9aa8']]){
  const h=terrainHeight(x,z);const sg=new THREE.Group();sg.position.set(x,h,z);ground.add(sg);
  const m=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.82});
  for(const r of [1.5,2.8]){
   const ring=new THREE.Mesh(new THREE.TorusGeometry(r,.065,5,48),m);ring.rotation.x=-Math.PI/2;ring.position.y=.2;sg.add(ring);
  }
  const stalk=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,6,5),m);stalk.position.y=3.2;sg.add(stalk);
  const dot=new THREE.Mesh(new THREE.SphereGeometry(.24,7,7),m);dot.position.y=6.2;sg.add(dot);
 }
 return {terrain,isolines,heightMin:hMin,heightMax:hMax,contourSegments:contourPoints.length/6};
}
