/**
 * Deterministic, local sculpted terrain. No external elevation/imagery API.
 * Coordinates: X east/west, Z front/back, Y elevation, in stylized world units.
 * Station pads are blended into the heightfield to prevent floating structures.
 */
import {timeline, domains, archiveDestinations} from './data.js';

export const TERRAIN_WIDTH = 250;
export const TERRAIN_DEPTH = 150;
const sites=[...timeline, ...domains, ...archiveDestinations]
  .map(s=>({x:s.location[0], z:s.location[1]}))
  .concat([{x:3,z:-10},{x:-67,z:-11},{x:-111,z:66}]);
const gauss=(x,z,cx,cz,sx,sz)=>Math.exp(-(((x-cx)/sx)**2+((z-cz)/sz)**2));

function rawHeight(x,z){
  // Several overlapping ridge systems, an eroded interior and gentler foreground.
  const ridge =
    14.0*gauss(x,z,-95,-44,44,31)+
    20.5*gauss(x,z,-16,-51,57,26)+
    16.2*gauss(x,z,75,-42,43,27)+
    9.7*gauss(x,z,-118,6,28,27)+
    7.3*gauss(x,z,102,8,31,36)+
    5.6*gauss(x,z,18,17,46,37);
  const undulation=2.1*Math.sin(x*.084+Math.cos(z*.041)*1.3)*Math.cos(z*.082)
    +1.48*Math.sin((x+z)*.125)*Math.cos((x-z)*.085)
    +.72*Math.sin(x*.29+z*.15)*Math.cos(z*.24);
  const channel=4.3*gauss(x,z,18,17,12,28)+2.1*gauss(x,z,-67,8,17,35);
  return Math.max(1.4,2.9+ridge+undulation-channel);
}

export function terrainHeight(x,z){
  let height=rawHeight(x,z);
  // Smoothly blend toward a local, nearly level pad under each mini-world.
  // Local sites maintain DIFFERENT absolute elevations.
  let weight=0, plateau=0;
  for(const s of sites){
    const d=Math.hypot(x-s.x,z-s.z);
    if(d>=11.7)continue;
    const t=Math.min(1,Math.max(0,(11.7-d)/5.8));
    const strength=t*t*(3-2*t);
    if(strength>weight){weight=strength;plateau=rawHeight(s.x,s.z);}
  }
  return height*(1-weight)+plateau*weight;
}

export function terrainNormal(x,z){
  const e=.35;const dx=(terrainHeight(x+e,z)-terrainHeight(x-e,z))/(2*e);
  const dz=(terrainHeight(x,z+e)-terrainHeight(x,z-e))/(2*e);
  const n=[-dx,1,-dz],l=Math.hypot(...n);
  return n.map(v=>v/l);
}

export function heightRange(){
 let min=Infinity,max=-Infinity;
 for(let iz=0;iz<=75;iz++)for(let ix=0;ix<=125;ix++){
   const h=terrainHeight(-125+ix*2,-75+iz*2);
   min=Math.min(min,h);max=Math.max(max,h);
 }
 return {min,max};
}
