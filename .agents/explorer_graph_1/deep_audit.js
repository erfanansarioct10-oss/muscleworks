import fs from 'fs';
import path from 'path';

// Traverse directory recursively
function getAllFiles(dir, exts = ['.ts', '.tsx', '.js', '.jsx', '.json', '.md']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else if (exts.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  });
  return results;
}

const root = path.resolve('.');
const srcFiles = getAllFiles(path.join(root, 'src'));
const appFiles = getAllFiles(path.join(root, 'src', 'app'));
const componentFiles = getAllFiles(path.join(root, 'src', 'components'));
const libFiles = getAllFiles(path.join(root, 'src', 'lib'));
const dataFiles = getAllFiles(path.join(root, 'src', 'data'));
const contentFiles = getAllFiles(path.join(root, 'src', 'content'));
const scriptFiles = getAllFiles(path.join(root, 'src', 'scripts'));
const emailFiles = getAllFiles(path.join(root, 'src', 'emails'));
const typeFiles = getAllFiles(path.join(root, 'src', 'types'));

console.log(`Src files: ${srcFiles.length}`);
console.log(`App files: ${appFiles.length}`);
console.log(`Component files: ${componentFiles.length}`);
console.log(`Lib files: ${libFiles.length}`);
console.log(`Data files: ${dataFiles.length}`);
console.log(`Content files: ${contentFiles.length}`);
console.log(`Script files: ${scriptFiles.length}`);

// 1. Audit all export statements in src/
const allExports = []; // { file, name, kind, line }
srcFiles.forEach(file => {
  const relPath = path.relative(root, file).replace(/\\/g, '/');
  if (relPath.startsWith('src/scripts/')) return; // ignore scripts exports
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, idx) => {
    // export const / function / type / interface / enum / let / var
    const matchNamed = line.match(/^\s*export\s+(async\s+)?(function|const|let|var|type|interface|enum|class)\s+([A-Za-z0-9_]+)/);
    if (matchNamed) {
      allExports.push({
        file: relPath,
        name: matchNamed[3],
        kind: matchNamed[2],
        line: idx + 1
      });
    }

    // export { a, b, c }
    const matchBrackets = line.match(/^\s*export\s*\{\s*([^}]+)\s*\}/);
    if (matchBrackets) {
      const items = matchBrackets[1].split(',').map(s => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean);
      items.forEach(item => {
        if (item && !item.startsWith('type ')) {
          allExports.push({
            file: relPath,
            name: item.replace(/^type\s+/, ''),
            kind: 're-export',
            line: idx + 1
          });
        }
      });
    }
  });
});

console.log(`\nTotal declared exports: ${allExports.length}`);

// Check references for each export across all src/ and scripts/
const unreferencedExports = [];
const scriptOnlyExports = [];
const activeExports = [];

allExports.forEach(exp => {
  // Special Next.js / React exports that are invoked by framework conventions
  if (['default', 'generateMetadata', 'generateStaticParams', 'revalidate', 'dynamic', 'runtime', 'metadata', 'viewport'].includes(exp.name)) {
    return;
  }

  let srcRefs = 0;
  let scriptRefs = 0;

  srcFiles.forEach(otherFile => {
    const relOther = path.relative(root, otherFile).replace(/\\/g, '/');
    const isScript = relOther.startsWith('src/scripts/');
    const isSelf = relOther === exp.file;
    const content = fs.readFileSync(otherFile, 'utf8');

    // Count occurrences
    const regex = new RegExp(`\\b${exp.name}\\b`, 'g');
    const matches = content.match(regex);
    const count = matches ? matches.length : 0;

    if (isSelf) {
      // In self, if count > 1 it's referenced internally, but we want to check external references
    } else {
      if (count > 0) {
        if (isScript) scriptRefs += count;
        else srcRefs += count;
      }
    }
  });

  if (srcRefs === 0 && scriptRefs === 0) {
    unreferencedExports.push(exp);
  } else if (srcRefs === 0 && scriptRefs > 0) {
    scriptOnlyExports.push({ ...exp, scriptRefs });
  } else {
    activeExports.push({ ...exp, srcRefs, scriptRefs });
  }
});

console.log(`\n=== 1. UNREFERENCED EXPORTS (0 refs in src/, 0 refs in scripts/) === [${unreferencedExports.length}]`);
unreferencedExports.forEach(e => {
  console.log(`- [${e.file}:L${e.line}] (${e.kind}) ${e.name}`);
});

console.log(`\n=== 2. SCRIPT-ONLY EXPORTS (0 refs in production src/, only in test/validation scripts) === [${scriptOnlyExports.length}]`);
scriptOnlyExports.forEach(e => {
  console.log(`- [${e.file}:L${e.line}] (${e.kind}) ${e.name} (script refs: ${e.scriptRefs})`);
});

// 2. Audit JSON Data Files in src/data/
console.log(`\n=== 3. DATA FILE AUDIT (src/data/) ===`);
dataFiles.forEach(dataFile => {
  const relPath = path.relative(root, dataFile).replace(/\\/g, '/');
  const baseName = path.basename(dataFile);
  let refCount = 0;
  let referrers = [];
  srcFiles.forEach(f => {
    if (f === dataFile) return;
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes(baseName) || content.includes(baseName.replace('.json', ''))) {
      refCount++;
      referrers.push(path.relative(root, f).replace(/\\/g, '/'));
    }
  });
  console.log(`Data file ${relPath}: ${refCount} references (referrers: ${referrers.slice(0, 3).join(', ')})`);
});

// 3. Audit Content Files in src/content/
console.log(`\n=== 4. CONTENT FILE AUDIT (src/content/) ===`);
contentFiles.forEach(contentFile => {
  const relPath = path.relative(root, contentFile).replace(/\\/g, '/');
  console.log(`Content file: ${relPath}`);
});

// 4. Audit Proxy.ts
console.log(`\n=== 5. PROXY.TS AUDIT ===`);
const proxyPath = path.join(root, 'src', 'proxy.ts');
if (fs.existsSync(proxyPath)) {
  const proxyContent = fs.readFileSync(proxyPath, 'utf8');
  console.log(`src/proxy.ts exists! Lines: ${proxyContent.split('\n').length}`);
} else {
  console.log(`src/proxy.ts does NOT exist.`);
}
