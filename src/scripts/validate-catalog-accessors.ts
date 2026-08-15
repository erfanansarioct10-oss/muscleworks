import {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  getProductsByBrand,
  getRelatedProducts,
  searchProductsInMemory,
} from '../lib/data/products';
import {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  getFeaturedCategories,
} from '../lib/data/categories';
import {
  getBrands,
  getBrandBySlug,
  getBrandById,
  getFeaturedBrands,
} from '../lib/data/brands';

async function runValidation() {
  console.log('🧪 Starting Catalog Data Accessor Gateways Validation...');

  // 1. Categories Accessors
  const categories = await getCategories();
  console.log(`✅ getCategories(): returned ${categories.length} categories.`);
  if (categories.length === 0) throw new Error('getCategories returned empty list');

  const firstCat = categories[0];
  const catBySlug = await getCategoryBySlug(firstCat.slug);
  if (!catBySlug || catBySlug.id !== firstCat.id) {
    throw new Error(`getCategoryBySlug failed for ${firstCat.slug}`);
  }
  console.log(`✅ getCategoryBySlug("${firstCat.slug}"): "${catBySlug.name}"`);

  const catById = await getCategoryById(firstCat.id);
  if (!catById || catById.slug !== firstCat.slug) {
    throw new Error(`getCategoryById failed for ${firstCat.id}`);
  }
  console.log(`✅ getCategoryById("${firstCat.id}"): "${catById.name}"`);

  const featuredCats = await getFeaturedCategories();
  console.log(`✅ getFeaturedCategories(): ${featuredCats.length} featured categories.`);

  // 2. Brands Accessors
  const brands = await getBrands();
  console.log(`✅ getBrands(): returned ${brands.length} brands.`);
  if (brands.length === 0) throw new Error('getBrands returned empty list');

  const firstBrand = brands[0];
  const brandBySlug = await getBrandBySlug(firstBrand.slug);
  if (!brandBySlug || brandBySlug.id !== firstBrand.id) {
    throw new Error(`getBrandBySlug failed for ${firstBrand.slug}`);
  }
  console.log(`✅ getBrandBySlug("${firstBrand.slug}"): "${brandBySlug.name}"`);

  const brandById = await getBrandById(firstBrand.id);
  if (!brandById || brandById.slug !== firstBrand.slug) {
    throw new Error(`getBrandById failed for ${firstBrand.id}`);
  }
  console.log(`✅ getBrandById("${firstBrand.id}"): "${brandById.name}"`);

  const featuredBrands = await getFeaturedBrands();
  console.log(`✅ getFeaturedBrands(): ${featuredBrands.length} featured brands.`);

  // 3. Products Accessors
  const products = await getProducts();
  console.log(`✅ getProducts(): returned ${products.length} products.`);
  if (products.length === 0) throw new Error('getProducts returned empty list');

  const sampleSlug = 'optimum-nutrition-gold-standard-100-whey';
  const productBySlug = await getProductBySlug(sampleSlug);
  if (!productBySlug) throw new Error(`getProductBySlug failed for ${sampleSlug}`);
  console.log(`✅ getProductBySlug("${sampleSlug}"): "${productBySlug.name}"`);

  const productById = await getProductById(productBySlug.id);
  if (!productById || productById.id !== productBySlug.id) {
    throw new Error(`getProductById failed or returned wrong ID for ${productBySlug.id}`);
  }
  console.log(`✅ getProductById("${productBySlug.id}"): "${productById.name}"`);

  const featuredProducts = await getFeaturedProducts();
  if (featuredProducts.length === 0) throw new Error('getFeaturedProducts returned 0 items');
  console.log(`✅ getFeaturedProducts(): ${featuredProducts.length} featured products.`);

  const catProducts = await getProductsByCategory('proteins');
  if (catProducts.length === 0) throw new Error('getProductsByCategory("proteins") returned 0 items');
  console.log(`✅ getProductsByCategory("proteins"): ${catProducts.length} products.`);

  const brandProducts = await getProductsByBrand('optimum-nutrition');
  if (brandProducts.length === 0) throw new Error('getProductsByBrand("optimum-nutrition") returned 0 items');
  console.log(`✅ getProductsByBrand("optimum-nutrition"): ${brandProducts.length} products.`);

  const related = await getRelatedProducts(productBySlug.id, 3);
  if (related.some((p) => p.id === productBySlug.id)) {
    throw new Error('getRelatedProducts returned source product');
  }
  console.log(`✅ getRelatedProducts("${productBySlug.name}", 3): ${related.length} related products.`);

  const emptySearch = await searchProductsInMemory('');
  if (emptySearch.length === 0) throw new Error('searchProductsInMemory("") failed to return full catalog');
  console.log(`✅ searchProductsInMemory(""): ${emptySearch.length} full catalog items returned.`);

  const brandSearch = await searchProductsInMemory('Optimum Nutrition');
  if (brandSearch.length === 0) throw new Error('searchProductsInMemory("Optimum Nutrition") display brand search failed');
  console.log(`✅ searchProductsInMemory("Optimum Nutrition"): ${brandSearch.length} matches found.`);

  const searchResults = await searchProductsInMemory('creatine');
  if (searchResults.length === 0) throw new Error('searchProductsInMemory("creatine") failed');
  console.log(`✅ searchProductsInMemory("creatine"): ${searchResults.length} matches found.`);

  // Uniqueness Validation Check
  function assertUnique<T>(items: T[], keyFn: (item: T) => string, label: string) {
    const seen = new Set<string>();
    for (const item of items) {
      const key = keyFn(item);
      if (seen.has(key)) {
        throw new Error(`Duplicate ${label} found: ${key}`);
      }
      seen.add(key);
    }
  }

  assertUnique(categories, (c) => c.id, 'category ID');
  assertUnique(categories, (c) => c.slug, 'category slug');
  assertUnique(brands, (b) => b.id, 'brand ID');
  assertUnique(brands, (b) => b.slug, 'brand slug');
  assertUnique(products, (p) => p.id, 'product ID');
  assertUnique(products, (p) => p.slug, 'product slug');
  console.log('✅ Uniqueness check: All category, brand, and product IDs and slugs are 100% unique.');

  console.log('\n🎉 ALL CATALOG DATA ACCESSOR TESTS PASSED CLEANLY!\n');
}


runValidation().catch((err) => {
  console.error('❌ Accessor Validation Error:', err);
  process.exit(1);
});
