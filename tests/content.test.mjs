import assert from 'node:assert/strict';
import fs from 'node:fs';
import {timeline,domains,OWNER,LINKEDIN,qualifications,skillGroups,careerExtras,archiveDestinations,learningHighlights} from '../src/data.js';

assert.equal(OWNER,'Faizan Tayyab');
assert.equal(timeline.length,12,'Two education chapters and ten work chapters expected');
assert.equal(timeline.filter(x=>x.kind==='Education').length,2);
assert.equal(domains.length,6);
assert.equal(qualifications.length,18);
assert.equal(skillGroups.length,6);
assert.equal(archiveDestinations.length,2);
assert.equal(learningHighlights.length,4);
for (const items of [timeline,domains,archiveDestinations])assert.equal(new Set(items.map(x=>x.id)).size,items.length);
for(const item of timeline){
 assert.equal(item.location.length,2);assert.ok(item.company&&item.role&&item.story&&item.date&&item.achievements.length);
 assert.ok(careerExtras[item.id]?.responsibilities?.length,`${item.id}: responsibilities required`);
 for(const id of item.domainIds)assert.ok(domains.some(d=>d.id===id),`Unknown domain ${id}`);
}
const indexed=timeline.map(x=>x.id);
assert.ok(indexed.indexOf('education-bsc')<indexed.indexOf('education-msc'));
assert.ok(indexed.indexOf('education-msc')<indexed.indexOf('ordnance'));
assert.ok(indexed.indexOf('aramco')>indexed.indexOf('wood-data'));
assert.equal(timeline.find(x=>x.id==='verisk').date,'2021');
assert.match(LINKEDIN,/^https:\/\/www\.linkedin\.com\/in\/ftayyab\/?$/);
assert.ok(qualifications.some(x=>x.name==='Google Certified Generative AI Leader'));
assert.ok(qualifications.some(x=>x.name==='Kubernetes Developer Certification'));
assert.ok(skillGroups.some(x=>x.name==='Geospatial & GIS'));
const paths=['index.html','src/data.js','src/main.js','src/style.css','src/world.js'];
const publicSource=paths.map(p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8')).join('\n');
assert.ok(!/[A-Za-z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.[A-Za-z]{2,}/i.test(publicSource),'No personal email addresses in public source');
assert.ok(!/\b05\d{8}\b/.test(publicSource),'No personal mobile numbers in public source');
assert.ok(!/\bDahna\b/i.test(publicSource),'No residential street references');
for(const wanted of ['TELEPHONE','LONDON PHONE BOX','LinkedIn','archiveOverlay','archiveContent'])assert.ok(publicSource.includes(wanted),`Missing ${wanted}`);
assert.ok(publicSource.includes('TextGeometry'),'Extruded 3D owner name expected');
// Check each queried DOM ID is actually present in HTML.
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const allIDs=new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
const queried=[...js.matchAll(/\$\('([A-Za-z][A-Za-z\d]*)'\)/g)].map(m=>m[1]);
for(const id of queried)assert.ok(allIDs.has(id),`Queried missing DOM element: ${id}`);
console.log(`Passed: ${timeline.length} career and education chapters; ${qualifications.length} qualifications; ${skillGroups.length} skill groups; London phone box; CV roles; DOM IDs; privacy.`);
