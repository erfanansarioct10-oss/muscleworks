import fs from 'fs';
import path from 'path';
import { CategorySchema, BrandSchema, ProductSchema } from '../src/lib/validations/product';

const rootDir = path.resolve(__dirname, '..');

console.log('Validating dataset JSON files against Zod schemas...\n');

// 1. Categories
const categoriesPath = path.join(rootDir, 'data', 'categories.json');
const categoriesRaw = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
const categoriesResult = CategorySchema.array().safeParse(categoriesRaw);

if (!categoriesResult.success) {
  console.error('❌ categories.json Validation Failed:');
  console.error(JSON.stringify(categoriesResult.error.format(), null, 2));
  process.exit(1);
} else {
  console.log(`✅ categories.json Validated successfully (${categoriesResult.data.length} categories)`);
}

// 2. Brands
const brandsPath = path.join(rootDir, 'data', 'brands.json');
const brandsRaw = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
const brandsResult = BrandSchema.array().safeParse(brandsRaw);

if (!brandsResult.success) {
  console.error('❌ brands.json Validation Failed:');
  console.error(JSON.stringify(brandsResult.error.format(), null, 2));
  process.exit(1);
} else {
  console.log(`✅ brands.json Validated successfully (${brandsResult.data.length} brands)`);
}

// 3. Products
const productsPath = path.join(rootDir, 'data', 'products.json');
const productsRaw = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const productsResult = ProductSchema.array().safeParse(productsRaw);

if (!productsResult.success) {
  console.error('❌ products.json Validation Failed:');
  console.error(JSON.stringify(productsResult.error.format(), null, 2));
  process.exit(1);
} else {
  console.log(`✅ products.json Validated successfully (${productsResult.data.length} products)`);
}

// Extra cross-checks: brandId and categoryId references
const categoryIds = new Set(categoriesResult.data.map(c => c.id));
const brandIds = new Set(brandsResult.data.map(b => b.id));

for (const prod of productsResult.data) {
  if (!categoryIds.has(prod.categoryId)) {
    console.error(`❌ Product ${prod.id} references non-existent categoryId: ${prod.categoryId}`);
    process.exit(1);
  }
  if (!brandIds.has(prod.brandId)) {
    console.error(`❌ Product ${prod.id} references non-existent brandId: ${prod.brandId}`);
    process.exit(1);
  }
}

console.log('✅ All relational reference checks passed!\n');
