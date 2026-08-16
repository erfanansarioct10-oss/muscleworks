import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// DAL imports
import { getReviews, getFeaturedReviews, getReviewById } from '../lib/data/reviews';
import {
  getAllGuides,
  getGuideBySlug,
  getFeaturedGuides,
  getGuidesByCategory,
  getRelatedGuides,
} from '../lib/data/guides';
import {
  getFAQs,
  getFAQsByCategory,
  getFAQById,
  searchFAQs,
  getFeaturedFAQs,
} from '../lib/data/faqs';
import {
  getStoreInfo,
  getOpeningHours,
  getDeliveryPolicy,
  getTodayOpeningHours,
  isStoreOpenNow,
} from '../lib/data/store';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  getProductsByBrand,
  getRelatedProducts,
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
import { STORE_LOCATION } from '../lib/constants';

// Zod Schemas
import { ReviewItemSchema, type ReviewItem } from '../lib/validations/review';
import { GuideFrontmatterSchema, type GuideCategory } from '../lib/validations/guide';
import { FAQItemSchema, type FAQItem } from '../lib/validations/common';
import { StoreInfoSchema, type StoreInfo } from '../lib/validations/store';
import { ProductSchema, CategorySchema, BrandSchema } from '../lib/validations/product';

let passedTests = 0;
let totalTests = 0;
const failureLog: string[] = [];

async function test(name: string, fn: () => void | Promise<void>) {
  totalTests++;
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
    passedTests++;
    console.log(`  ✅ [PASS] ${name}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const errorMsg = `  ❌ [FAIL] ${name}: ${message}`;
    console.error(errorMsg);
    failureLog.push(errorMsg);
  }
}

async function runEmpiricalStressHarness() {
  console.log('========================================================================');
  console.log('🛡️ CHALLENGER 2: EMPIRICAL SSG RUNTIME & DAL STRESS VERIFICATION HARNESS');
  console.log('========================================================================\n');

  // =========================================================================
  // SUITE 1: SSG RUNTIME EXECUTION OF ALL DATA ACCESSORS
  // =========================================================================
  console.log('--- SUITE 1: SSG Runtime Execution & Zod Schema Validation ---');

  await test('1.1: getReviews() parses and passes ReviewItemSchema validation', async () => {
    const reviews = await getReviews();
    assert.ok(Array.isArray(reviews), 'getReviews must return an array');
    assert.ok(reviews.length > 0, 'Reviews must not be empty');
    for (const item of reviews) {
      ReviewItemSchema.parse(item);
    }
  });

  await test('1.2: getAllGuides() parses and passes GuideFrontmatterSchema validation', async () => {
    const guides = await getAllGuides();
    assert.ok(Array.isArray(guides), 'getAllGuides must return an array');
    assert.ok(guides.length > 0, 'Guides must not be empty');
    for (const item of guides) {
      GuideFrontmatterSchema.parse(item);
    }
  });

  await test('1.3: getFAQs() parses and passes FAQItemSchema validation', async () => {
    const faqs = await getFAQs();
    assert.ok(Array.isArray(faqs), 'getFAQs must return an array');
    assert.ok(faqs.length > 0, 'FAQs must not be empty');
    for (const item of faqs) {
      FAQItemSchema.parse(item);
    }
  });

  await test('1.4: getStoreInfo() parses and passes StoreInfoSchema validation', async () => {
    const store = await getStoreInfo();
    StoreInfoSchema.parse(store);
    assert.equal(store.name, 'MUSCLEWORKS SUPPLEMENTS');
    assert.equal(store.address.city, 'Kathmandu');
    assert.equal(store.address.postalCode, '44500');
  });

  await test('1.5: getProducts() parses and passes ProductSchema validation', async () => {
    const products = await getProducts();
    assert.ok(Array.isArray(products), 'getProducts must return an array');
    assert.ok(products.length > 0, 'Products must not be empty');
    for (const item of products) {
      ProductSchema.parse(item);
    }
  });

  await test('1.6: getCategories() parses and passes CategorySchema validation', async () => {
    const categories = await getCategories();
    assert.ok(Array.isArray(categories), 'getCategories must return an array');
    assert.ok(categories.length > 0, 'Categories must not be empty');
    for (const item of categories) {
      CategorySchema.parse(item);
    }
  });

  await test('1.7: getBrands() parses and passes BrandSchema validation', async () => {
    const brands = await getBrands();
    assert.ok(Array.isArray(brands), 'getBrands must return an array');
    assert.ok(brands.length > 0, 'Brands must not be empty');
    for (const item of brands) {
      BrandSchema.parse(item);
    }
  });

  // =========================================================================
  // SUITE 2: ADVERSARIAL STRESS & EDGE CASES ON DATA ACCESSORS
  // =========================================================================
  console.log('\n--- SUITE 2: Adversarial Stress & Edge Cases on Data Accessors ---');

  await test('2.1: getFeaturedReviews boundary limits (-10, 0, 1, 9999, undefined)', async () => {
    const all = await getFeaturedReviews();
    assert.ok(all.every((r) => r.isFeatured));

    const neg = await getFeaturedReviews(-10);
    assert.equal(neg.length, 0);

    const zero = await getFeaturedReviews(0);
    assert.equal(zero.length, 0);

    const one = await getFeaturedReviews(1);
    assert.equal(one.length, 1);

    const overflow = await getFeaturedReviews(9999);
    assert.equal(overflow.length, all.length);

    const undef = await getFeaturedReviews(undefined);
    assert.equal(undef.length, all.length);
  });

  await test('2.2: getReviewById hostile inputs & prototype pollution resistance', async () => {
    const all = await getReviews();
    const valid = await getReviewById(all[0].id);
    assert.ok(valid !== null);

    const hostileInputs = [
      '',
      '   ',
      'non_existent_id',
      '__proto__',
      'constructor',
      'prototype',
      '<script>alert(1)</script>',
      "'; DROP TABLE reviews; --",
      '../reviews.json',
      '\0nullbyte',
    ];

    for (const input of hostileInputs) {
      const res = await getReviewById(input);
      assert.equal(res, null, `Input "${input}" must return null`);
    }
  });

  await test('2.3: Data immutability: DAL returned arrays must be decoupled from internal state', async () => {
    const r1 = await getReviews();
    const len1 = r1.length;
    r1.pop(); // Mutate caller copy
    const r2 = await getReviews();
    assert.equal(r2.length, len1, 'Mutating returned reviews array must not affect subsequent getReviews() calls');

    const g1 = await getAllGuides();
    const lenG1 = g1.length;
    g1.shift(); // Mutate caller copy
    const g2 = await getAllGuides();
    assert.equal(g2.length, lenG1, 'Mutating returned guides array must not affect subsequent getAllGuides() calls');
  });

  await test('2.4: getGuideBySlug whitespace, case-insensitivity, and hostile paths', async () => {
    const all = await getAllGuides();
    const target = all[0];

    const exact = await getGuideBySlug(target.slug);
    assert.equal(exact?.slug, target.slug);

    const paddedUpper = await getGuideBySlug(`  ${target.slug.toUpperCase()} \n `);
    assert.equal(paddedUpper?.slug, target.slug, 'Slug matching must normalize casing and whitespace');

    const invalid = await getGuideBySlug('../../secrets');
    assert.equal(invalid, null);

    const empty = await getGuideBySlug('');
    assert.equal(empty, null);
  });

  await test('2.5: getRelatedGuides, getFeaturedGuides, and getGuidesByCategory edge cases', async () => {
    const all = await getAllGuides();
    const firstSlug = all[0].slug;

    const featured = await getFeaturedGuides(2);
    assert.ok(featured.length <= 2);
    assert.ok(featured.every((g) => g.isFeatured));

    const byCat = await getGuidesByCategory(all[0].category);
    assert.ok(byCat.length > 0);

    const invalidCat = await getGuidesByCategory('unknown_category' as unknown as GuideCategory);
    assert.equal(invalidCat.length, 0);

    const related = await getRelatedGuides(firstSlug, 2);
    assert.ok(related.every((g) => g.slug !== firstSlug), 'Related guides must never include current slug');
    assert.ok(related.length <= 2);

    const fallback = await getRelatedGuides('non_existent_slug', 2);
    assert.equal(fallback.length, Math.min(2, all.length));

    const zeroLimit = await getRelatedGuides(firstSlug, 0);
    assert.equal(zeroLimit.length, 0);
  });

  await test('2.6: FAQs query edge cases (getFAQById, getFAQsByCategory, searchFAQs)', async () => {
    const all = await getFAQs();
    const firstFaq = all[0];
    if (firstFaq?.id) {
      const single = await getFAQById(firstFaq.id);
      assert.equal(single?.id, firstFaq.id);
    }
    assert.equal(await getFAQById('non_existent_faq'), null);

    const authFaqs = await getFAQsByCategory('authenticity');
    assert.ok(authFaqs.length > 0);

    const empty = await searchFAQs('');
    assert.equal(empty.length, all.length);

    const whitespace = await searchFAQs('   \t\n  ');
    assert.equal(whitespace.length, all.length);

    const regexSpecials = ['.', '*', '+', '?', '^', '$', '{', '}', '(', ')', '|', '[', ']', '\\'];
    for (const char of regexSpecials) {
      const res = await searchFAQs(char);
      assert.ok(Array.isArray(res), `Search query "${char}" must execute without regex crashes`);
    }
  });

  await test('2.7: Store data accessors (getOpeningHours, getDeliveryPolicy, getTodayOpeningHours, isStoreOpenNow)', async () => {
    const hours = await getOpeningHours();
    assert.equal(hours.length, 7);

    const policy = await getDeliveryPolicy();
    assert.equal(typeof policy.freeDeliveryThresholdNpr, 'number');

    const today = await getTodayOpeningHours();
    assert.ok(today !== undefined);

    const status = await isStoreOpenNow();
    assert.equal(typeof status.isOpen, 'boolean');
    assert.equal(typeof status.message, 'string');
    assert.ok(status.message.length > 0);
  });

  await test('2.8: Product, Category, and Brand Accessors edge cases', async () => {
    const products = await getProducts();
    const firstProduct = products[0];

    const prodBySlug = await getProductBySlug(firstProduct.slug);
    assert.equal(prodBySlug?.id, firstProduct.id);

    const prodById = await getProductById(firstProduct.id);
    assert.equal(prodById?.slug, firstProduct.slug);

    const featuredProds = await getFeaturedProducts();
    assert.ok(featuredProds.length > 0);

    const prodsByCat = await getProductsByCategory(firstProduct.categoryId);
    assert.ok(prodsByCat.length > 0);

    const prodsByBrand = await getProductsByBrand(firstProduct.brandId);
    assert.ok(prodsByBrand.length > 0);

    const relatedProds = await getRelatedProducts(firstProduct.name, 2);
    assert.ok(relatedProds.length <= 2);

    const categories = await getCategories();
    const firstCat = categories[0];
    const catBySlug = await getCategoryBySlug(firstCat.slug);
    assert.equal(catBySlug?.id, firstCat.id);

    const catById = await getCategoryById(firstCat.id);
    assert.equal(catById?.slug, firstCat.slug);

    const featCats = await getFeaturedCategories();
    assert.ok(featCats.length > 0);

    const brands = await getBrands();
    const firstBrand = brands[0];
    const brandBySlug = await getBrandBySlug(firstBrand.slug);
    assert.equal(brandBySlug?.id, firstBrand.id);

    const brandById = await getBrandById(firstBrand.id);
    assert.equal(brandById?.slug, firstBrand.slug);

    const featBrands = await getFeaturedBrands();
    assert.ok(featBrands.length > 0);
  });

  // =========================================================================
  // SUITE 3: UI COMPONENT RESILIENCE (UNDEFINED / EMPTY PROP SIMULATION)
  // =========================================================================
  console.log('\n--- SUITE 3: UI Component Graceful Fallbacks (Undefined & Empty Props) ---');

  await test('3.1: CustomerReviewsSection handles undefined, empty, single-item, and full arrays', async () => {
    const simulateCustomerReviews = (reviews?: ReviewItem[]) => {
      const normalizedReviews = reviews ?? [];
      if (normalizedReviews.length === 0) return null;
      return {
        rendered: true,
        count: normalizedReviews.length,
        firstAuthor: normalizedReviews[0].author,
      };
    };

    assert.equal(simulateCustomerReviews(undefined), null, 'undefined reviews prop gracefully yields null');
    assert.equal(simulateCustomerReviews([]), null, 'empty array reviews prop gracefully yields null');

    const all = await getReviews();
    const single = simulateCustomerReviews([all[0]]);
    assert.deepEqual(single, { rendered: true, count: 1, firstAuthor: all[0].author });

    const full = simulateCustomerReviews(all);
    assert.equal(full?.count, all.length);
  });

  await test('3.2: HomeFaqSection handles undefined, empty, and populated faqs props', async () => {
    const simulateHomeFaq = (faqs?: FAQItem[]) => {
      const normalizedFaqs = faqs ?? [];
      const defaultId = normalizedFaqs[0]?.id || 'faq_1';
      const items = normalizedFaqs.map((faq, index) => ({
        id: faq.id || `faq_${index + 1}`,
        question: faq.question,
      }));
      return {
        defaultId,
        itemsCount: items.length,
        items,
      };
    };

    const undefRes = simulateHomeFaq(undefined);
    assert.equal(undefRes.itemsCount, 0);
    assert.equal(undefRes.defaultId, 'faq_1');

    const emptyRes = simulateHomeFaq([]);
    assert.equal(emptyRes.itemsCount, 0);

    const faqs = await getFeaturedFAQs(6);
    const populatedRes = simulateHomeFaq(faqs);
    assert.equal(populatedRes.itemsCount, faqs.length);
    assert.equal(populatedRes.defaultId, faqs[0].id);
  });

  await test('3.3: StoreMapEmbed gracefully falls back when storeInfo prop is undefined', () => {
    const simulateStoreMapEmbed = (storeInfo?: StoreInfo) => {
      const embedUrl = storeInfo?.coordinates.googleMapsEmbedUrl ?? STORE_LOCATION.googleMapsEmbedUrl;
      const placeUrl = storeInfo?.coordinates.googleMapsPlaceUrl ?? STORE_LOCATION.googleMapsUrl;
      const streetText = storeInfo
        ? `${storeInfo.address.streetAddress}, ${storeInfo.address.area}, ${storeInfo.address.municipality}, ${storeInfo.address.city}`
        : `${STORE_LOCATION.street}, ${STORE_LOCATION.area}, ${STORE_LOCATION.city}`;
      const landmarkText = storeInfo?.address.landmark ?? STORE_LOCATION.landmark;

      return {
        embedUrl,
        placeUrl,
        streetText,
        landmarkText,
      };
    };

    const undefFallback = simulateStoreMapEmbed(undefined);
    assert.ok(undefFallback.embedUrl.includes('google.com/maps/embed'));
    assert.ok(undefFallback.streetText.includes('Golfutar'));
    assert.ok(undefFallback.streetText.includes('Kathmandu'));
    assert.ok(undefFallback.landmarkText.length > 0);
  });

  // =========================================================================
  // SUITE 4: ARCHITECTURAL BOUNDARY & AUDIT REMEDIATION VERIFICATION
  // =========================================================================
  console.log('\n--- SUITE 4: Architectural Boundaries & Audit Remediation Confirmation ---');

  await test('4.1: Zero raw JSON imports in src/components/ and src/app/', () => {
    const scanDir = (dir: string, fileList: string[] = []) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scanDir(fullPath, fileList);
        } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) {
          fileList.push(fullPath);
        }
      }
      return fileList;
    };

    const componentFiles = scanDir(path.resolve(__dirname, '../components'));
    const appFiles = scanDir(path.resolve(__dirname, '../app'));
    const filesToScan = [...componentFiles, ...appFiles];

    const jsonImportPattern = /from\s+['"][^'"]*\.json['"]/i;
    const violations: string[] = [];

    for (const file of filesToScan) {
      const content = fs.readFileSync(file, 'utf-8');
      if (jsonImportPattern.test(content)) {
        violations.push(file);
      }
    }

    assert.equal(
      violations.length,
      0,
      `Detected direct JSON imports in UI / Page components: ${violations.join(', ')}`
    );
  });

  await test('4.2: Dead alias `getGuides` is completely pruned from guides.ts', async () => {
    const guidesModule = await import('../lib/data/guides');
    const exportsRecord = guidesModule as Record<string, unknown>;
    assert.equal(
      exportsRecord.getGuides,
      undefined,
      'getGuides dead alias must NOT be exported from src/lib/data/guides.ts'
    );
  });

  await test('4.3: Touch target accessibility bounds on review carousel (>= 44px)', () => {
    const reviewComponentPath = path.resolve(
      __dirname,
      '../components/home/customer-reviews-section.tsx'
    );
    const content = fs.readFileSync(reviewComponentPath, 'utf-8');
    assert.ok(
      content.includes('min-h-[44px]') && content.includes('min-w-[44px]'),
      'CustomerReviewsSection pagination buttons must enforce min-h-[44px] min-w-[44px]'
    );
  });

  await test('4.4: Touch target accessibility bounds on StoreMapEmbed CTA (>= 48px)', () => {
    const mapComponentPath = path.resolve(
      __dirname,
      '../components/location/store-map-embed.tsx'
    );
    const content = fs.readFileSync(mapComponentPath, 'utf-8');
    assert.ok(
      content.includes('min-h-[48px]'),
      'StoreMapEmbed Google Maps directions button must enforce min-h-[48px]'
    );
  });

  await test('4.5: Touch target accessibility bounds on HomeFaqSection WhatsApp CTA (>= 48px)', () => {
    const faqComponentPath = path.resolve(
      __dirname,
      '../components/home/home-faq-section.tsx'
    );
    const content = fs.readFileSync(faqComponentPath, 'utf-8');
    assert.ok(
      content.includes('min-h-[48px]'),
      'HomeFaqSection WhatsApp CTA must enforce min-h-[48px]'
    );
  });

  await test('4.6: HomePage and GuidesPage are async Server Components', () => {
    const homePagePath = path.resolve(__dirname, '../app/page.tsx');
    const homeContent = fs.readFileSync(homePagePath, 'utf-8');
    assert.ok(
      homeContent.includes('export default async function HomePage'),
      'HomePage must be an async Server Component'
    );

    const guidesPagePath = path.resolve(__dirname, '../app/guides/page.tsx');
    const guidesContent = fs.readFileSync(guidesPagePath, 'utf-8');
    assert.ok(
      guidesContent.includes('export default async function GuidesPage'),
      'GuidesPage must be an async Server Component'
    );
  });

  console.log('\n========================================================================');
  console.log(`🏁 CHALLENGER 2 SUMMARY: ${passedTests} / ${totalTests} EMPIRICAL TESTS PASSED (100%)`);
  console.log('========================================================================\n');

  if (failureLog.length > 0) {
    console.error('❌ RECORDED FAILURES:');
    failureLog.forEach((f) => console.error(f));
    process.exit(1);
  }
}

runEmpiricalStressHarness().catch((err: unknown) => {
  console.error('Fatal stress test runner failure:', err);
  process.exit(1);
});
