import fs from 'fs';
import path from 'path';

const graphPath = path.resolve('graphify-out/graph.json');
const graph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

console.log(`Total nodes: ${graph.nodes.length}`);
console.log(`Total links: ${graph.links ? graph.links.length : (graph.edges ? graph.edges.length : 0)}`);

const links = graph.links || graph.edges || [];

// Calculate degree for each node
const degreeMap = new Map();
const edgeTargetSourceMap = new Map();

graph.nodes.forEach(n => {
  degreeMap.set(n.id, 0);
  edgeTargetSourceMap.set(n.id, { in: [], out: [] });
});

links.forEach(l => {
  const s = typeof l.source === 'object' ? l.source.id : l.source;
  const t = typeof l.target === 'object' ? l.target.id : l.target;
  
  degreeMap.set(s, (degreeMap.get(s) || 0) + 1);
  degreeMap.set(t, (degreeMap.get(t) || 0) + 1);

  if (edgeTargetSourceMap.has(s)) edgeTargetSourceMap.get(s).out.push({ target: t, kind: l.kind || l.type || 'edge' });
  if (edgeTargetSourceMap.has(t)) edgeTargetSourceMap.get(t).in.push({ source: s, kind: l.kind || l.type || 'edge' });
});

// Filter nodes by directory
const codeNodes = graph.nodes.filter(n => n.source_file && n.source_file.startsWith('src/'));
console.log(`Total src/ code nodes: ${codeNodes.length}`);

// Isolated code nodes (degree <= 1)
const isolatedCodeNodes = codeNodes.filter(n => (degreeMap.get(n.id) || 0) === 0);
const lowDegreeCodeNodes = codeNodes.filter(n => (degreeMap.get(n.id) || 0) === 1);

console.log(`Degree 0 src/ nodes: ${isolatedCodeNodes.length}`);
console.log(`Degree 1 src/ nodes: ${lowDegreeCodeNodes.length}`);

console.log('\n--- ZERO DEGREE SRC NODES ---');
isolatedCodeNodes.forEach(n => {
  console.log(`[${n.source_file}:${n.source_location || ''}] ${n.label} (id: ${n.id})`);
});

console.log('\n--- DEGREE 1 SRC NODES (sample 30) ---');
lowDegreeCodeNodes.slice(0, 30).forEach(n => {
  console.log(`[${n.source_file}:${n.source_location || ''}] ${n.label} (id: ${n.id})`);
});

// Community analysis of src/ nodes
const communityGroups = new Map();
codeNodes.forEach(n => {
  const comm = n.community !== undefined ? n.community : 'unknown';
  if (!communityGroups.has(comm)) communityGroups.set(comm, []);
  communityGroups.get(comm).push(n);
});

console.log(`\n--- COMMUNITIES CONTAINING SRC/ NODES (${communityGroups.size} communities) ---`);
for (const [comm, nodes] of communityGroups.entries()) {
  if (nodes.length > 3) {
    console.log(`Community ${comm}: ${nodes.length} src nodes (e.g. ${nodes.slice(0, 5).map(x => x.label).join(', ')})`);
  }
}

// Cross-boundary connections
console.log('\n--- CROSS BOUNDARY EDGES ---');
const boundaries = {
  components: 'src/components/',
  actions: 'src/actions/',
  validations: 'src/lib/validations/',
  data_accessors: 'src/lib/data/',
  proxy: 'src/proxy.ts',
  services: 'src/lib/services/',
  catalog_lib: 'src/lib/catalog.ts',
  whatsapp_lib: 'src/lib/whatsapp.ts',
  constants: 'src/lib/constants.ts',
  data_json: 'src/data/'
};

const boundaryCounts = {};
links.forEach(l => {
  const s = typeof l.source === 'object' ? l.source.id : l.source;
  const t = typeof l.target === 'object' ? l.target.id : l.target;
  const sNode = graph.nodes.find(n => n.id === s);
  const tNode = graph.nodes.find(n => n.id === t);
  if (!sNode || !tNode) return;
  
  let sBound = 'other';
  let tBound = 'other';
  for (const [bName, bPrefix] of Object.entries(boundaries)) {
    if (sNode.source_file && sNode.source_file.startsWith(bPrefix)) sBound = bName;
    if (tNode.source_file && tNode.source_file.startsWith(bPrefix)) tBound = bName;
  }
  
  if (sBound !== 'other' && tBound !== 'other' && sBound !== tBound) {
    const key = `${sBound} <-> ${tBound}`;
    boundaryCounts[key] = (boundaryCounts[key] || 0) + 1;
  }
});

for (const [bEdge, count] of Object.entries(boundaryCounts)) {
  console.log(`${bEdge}: ${count} edges`);
}
