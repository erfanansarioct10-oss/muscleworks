/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'feature-products');

const items = [
  { input: 'pure-whey.png', output: 'biotech-pure-whey.webp' },
  { input: 'bpi-sports-whey-hd.png', output: 'bpi-whey-hd.webp' },
  { input: 'optimum-nutrition.png', output: 'on-gold-isolate.webp' },
  { input: 'muscleblaze.png', output: 'muscleblaze-biozyme.webp' },
];

async function main() {
  console.log('Compressing feature product images to WebP...');
  for (const item of items) {
    const inputPath = path.join(dir, item.input);
    const outputPath = path.join(dir, item.output);

    if (fs.existsSync(inputPath)) {
      const inputStats = fs.statSync(inputPath);
      await sharp(inputPath)
        .webp({ quality: 82, effort: 6 })
        .toFile(outputPath);
      
      const outputStats = fs.statSync(outputPath);
      const savings = (((inputStats.size - outputStats.size) / inputStats.size) * 100).toFixed(1);
      console.log(`✓ ${item.input} (${(inputStats.size / 1024 / 1024).toFixed(2)} MB) -> ${item.output} (${(outputStats.size / 1024).toFixed(1)} KB) [Saved ${savings}%]`);
    } else {
      console.error(`File not found: ${inputPath}`);
    }
  }
}

main().catch(console.error);
