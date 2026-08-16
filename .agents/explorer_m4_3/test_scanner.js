import fs from 'fs';
import path from 'path';

function getAllFiles(dir, ext = ['.ts', '.tsx', '.js', '.jsx']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, ext));
    } else if (ext.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  });
  return results;
}

const srcDir = path.resolve('src');
const allFiles = getAllFiles(srcDir);

// Exclude test harness scripts in src/scripts from production caller scanning
const prodFiles = allFiles.filter(f => !f.includes(path.join('src', 'scripts')));
const testFiles = allFiles.filter(f => f.includes(path.join('src', 'scripts')));

console.log(`Total source files: ${allFiles.length} (${prodFiles.length} production, ${testFiles.length} test scripts)`);

// 1. Check if component files are imported in production code
// Exclude UI primitives directory (src/components/ui/) which contains standard atomic design system components
const componentFiles = prodFiles.filter(
  f => f.includes(path.join('src', 'components')) && !f.includes(path.join('src', 'components', 'ui'))
);

const unusedComponents = [];

componentFiles.forEach(compPath => {
  const baseName = path.basename(compPath, path.extname(compPath));
  let isImported = false;

  for (const file of prodFiles) {
    if (file === compPath) continue;
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes(baseName)) {
      isImported = true;
      break;
    }
  }

  if (!isImported) {
    unusedComponents.push(compPath);
  }
});

console.log('\n--- UNUSED COMPONENT FILES ---');
if (unusedComponents.length === 0) {
  console.log('None! All non-UI component files are referenced in production.');
} else {
  unusedComponents.forEach(c => console.log('UNREFERENCED:', path.relative(process.cwd(), c)));
}

// 2. Check for unused exports across production source files
// Whitelist Next.js framework exports
const NEXTJS_SPECIAL_EXPORTS = new Set([
  'default',
  'generateMetadata',
  'generateStaticParams',
  'metadata',
  'viewport',
  'dynamic',
  'dynamicParams',
  'revalidate',
  'fetchCache',
  'runtime',
  'preferredRegion',
  'maxDuration',
  'generateImageMetadata',
  'generateSitemaps',
]);

const exportsMap = []; // { name, file }

prodFiles.forEach(file => {
  // Whitelist standard Radix/shadcn atomic UI primitives in src/components/ui/
  if (file.includes(path.join('src', 'components', 'ui'))) return;

  const content = fs.readFileSync(file, 'utf8');

  // Match named exports
  const exportRegex = /export\ (?:async\ )?(?:function|const|let|var|type|interface|enum)\ ([A-Za-z0-9_]+)/g;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    const exportName = match[1];
    if (!NEXTJS_SPECIAL_EXPORTS.has(exportName)) {
      exportsMap.push({ name: exportName, file });
    }
  }
});

console.log(`\nTotal production exported identifiers evaluated: ${exportsMap.length}`);

const unusedExports = [];

exportsMap.forEach(({ name, file }) => {
  let isUsedElsewhere = false;
  for (const otherFile of prodFiles) {
    if (otherFile === file) continue;
    const content = fs.readFileSync(otherFile, 'utf8');
    const regex = new RegExp(`\\b${name}\\b`);
    if (regex.test(content)) {
      isUsedElsewhere = true;
      break;
    }
  }

  if (!isUsedElsewhere) {
    unusedExports.push({ name, file });
  }
});

console.log('\n--- UNUSED EXPORTS (Not referenced in production code outside their defining file) ---');
if (unusedExports.length === 0) {
  console.log('None! All exports are referenced outside their file.');
} else {
  unusedExports.forEach(e => console.log(`- ${e.name} in ${path.relative(process.cwd(), e.file)}`));
}
