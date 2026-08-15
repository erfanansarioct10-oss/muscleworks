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

console.log(`Total source files: ${allFiles.length}`);

// 1. Check if component files are imported
const componentFiles = allFiles.filter(f => f.includes(path.join('src', 'components')));

const unusedComponents = [];

componentFiles.forEach(compPath => {
  const baseName = path.basename(compPath, path.extname(compPath));
  let isImported = false;

  for (const file of allFiles) {
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
  console.log('None! All component files are referenced.');
} else {
  unusedComponents.forEach(c => console.log('UNREFERENCED:', c));
}

// 2. Check for unused exports in lib, components, types, actions
const exportsMap = []; // { name, file, isType }

allFiles.forEach(file => {
  if (file.includes(path.join('src', 'scripts'))) return; // Skip scripts directory for export check
  const content = fs.readFileSync(file, 'utf8');

  // Match named exports
  const exportRegex = /export\ (?:async\ )?(?:function|const|let|var|type|interface|enum)\ ([A-Za-z0-9_]+)/g;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    const exportName = match[1];
    if (exportName !== 'default' && exportName !== 'generateMetadata' && exportName !== 'generateStaticParams') {
      exportsMap.push({ name: exportName, file });
    }
  }
});

console.log(`\nTotal exported identifiers found: ${exportsMap.length}`);

const unusedExports = [];

exportsMap.forEach(({ name, file }) => {
  let occurrences = 0;
  for (const otherFile of allFiles) {
    const content = fs.readFileSync(otherFile, 'utf8');
    // Simple word boundary regex match
    const regex = new RegExp(`\\b${name}\\b`, 'g');
    const matches = content.match(regex);
    if (matches) {
      occurrences += matches.length;
    }
    if (occurrences > 1 && otherFile !== file) {
      // Used in at least another file
      break;
    }
  }

  // Count occurrences inside source file
  const ownContent = fs.readFileSync(file, 'utf8');
  const ownMatches = (ownContent.match(new RegExp(`\\b${name}\\b`, 'g')) || []).length;

  if (occurrences <= ownMatches) {
    unusedExports.push({ name, file });
  }
});

console.log('\n--- UNUSED EXPORTS (Not referenced outside their own defining file) ---');
if (unusedExports.length === 0) {
  console.log('None! All exports are referenced outside their file.');
} else {
  unusedExports.forEach(e => console.log(`- ${e.name} in ${path.relative(process.cwd(), e.file)}`));
}
