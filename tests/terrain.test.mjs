import assert from 'node:assert/strict';
import fs from 'node:fs';
import {terrainHeight,heightRange,TERRAIN_WIDTH,TERRAIN_DEPTH} from '../src/terrain.js';
import {timeline,domains,archiveDestinations} from '../src/data.js';
const {min,max}=heightRange();
assert.ok(max-min>16,'Terrain should have substantial relief, not a flat plane');
assert.ok(min>=0,'Exposed terrain should not fall below the island floor');
const all=[...timeline,...domains,...archiveDestinations];
const levels=all.map(x=>terrainHeight(...x.location));
assert.ok(Math.max(...levels)-Math.min(...levels)>10,'Different stations should have different elevations');
for(const x of all){
  const [a,b]=x.location;
  assert.ok(Number.isFinite(terrainHeight(a,b)),x.id);
  assert.ok(Math.abs(terrainHeight(a,b)-terrainHeight(a+2,b))<2.5,`Pad smoothness: ${x.id}`);
}
assert.equal(TERRAIN_WIDTH,250);assert.equal(TERRAIN_DEPTH,150);
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const world=fs.readFileSync(new URL('../src/world.js',import.meta.url),'utf8');
const terrain=fs.readFileSync(new URL('../src/terrain-mesh.js',import.meta.url),'utf8');
assert.match(html,/id="bootLoader"/);assert.match(html,/role="progressbar"/);
assert.match(source,/renderer\.compileAsync\(scene,camera\)/);
assert.match(source,/terrainHeight\(position\.x,position\.z\)/);
assert.match(world,/makeSculptedTerrain\(world\)/);
assert.match(terrain,/Marching squares/);
console.log(`Passed: 3D topographic relief ${min.toFixed(1)}–${max.toFixed(1)}; ${all.length} elevated landmarks; contours; terrain-aware travel; loading screen.`);
