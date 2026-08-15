import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const errors: { relPath: string; sourceFile: string; fullPath: string }[] = [];
let totalChecked = 0;

function checkFile(relPath: string, sourceFile: string) {
  // Only check paths ending in image extensions
  if (!/\.(webp|png|jpg|jpeg|svg|ico|gif)$/i.test(relPath)) return;
  totalChecked++;
  const fullPath = path.join(publicDir, relPath);
  if (!fs.existsSync(fullPath)) {
    errors.push({ relPath, sourceFile, fullPath });
  }
}

// 1. Check data JSON files
const dataFiles = [
  'brands.json',
  'categories.json',
  'products.json',
  'guides.json',
  'reviews.json',
  'store-info.json',
  'faqs.json',
];

for (const file of dataFiles) {
  const filePath = path.resolve('data', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const regex = /"(\/[^"]+\.(?:webp|png|jpg|jpeg|svg|ico|gif))"/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      checkFile(match[1], `data/${file}`);
    }
  }
}

// 2. Scan all ts and tsx files in src/
function scanDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(full);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf-8');
      const regex = /['"](\/[^'"]+\.(?:webp|png|jpg|jpeg|svg|ico|gif))['"]/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        checkFile(match[1], path.relative(process.cwd(), full));
      }
    }
  }
}

scanDir(path.resolve('src'));

console.log('Total image asset references checked:', totalChecked);
if (errors.length > 0) {
  console.error('❌ BROKEN ASSET REFERENCES FOUND:', JSON.stringify(errors, null, 2));
  process.exit(1);
} else {
  console.log('✅ ALL ASSET REFERENCES EXIST AND ARE VALID! 0 broken references.');
}
