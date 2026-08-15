/**
 * Programmatic Adversarial Stress Testing Script for MuscleWorks Supplements
 * Evaluates:
 * 1. Timing Trap under legitimate clock skews (+30s, +90s), extreme futures (+300s), and rapid submissions (<2s).
 * 2. Honeypot anti-spam trap with malicious evasion types (arrays, objects, numbers, booleans).
 * 3. Nepal phone number validation regex with domestic, international, spaced, hyphenated, and landline formats.
 * 4. Catalog & category archive product filtering resilience across valid and non-existent categories.
 */

import { isTimingTrapTriggered, isHoneypotTriggered, verifySecurityContext, SILENT_SPAM_SUCCESS_RESPONSE } from '../lib/services/security';
import { NEPAL_PHONE_REGEX } from '../lib/validations/common';
import { getCategories, getCategoryBySlug } from '../lib/data/categories';
import { getProducts, getProductsByCategory } from '../lib/data/products';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string): void {
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
    failed++;
  }
}

async function runAdversarialStressTests(): Promise<void> {
  console.log('======================================================');
  console.log('  MUSCLEWORKS SUPPLEMENTS — ADVERSARIAL STRESS TEST SUITE');
  console.log('======================================================\n');

  const now = Date.now();

  // --------------------------------------------------------------------------
  // 1. TIMING TRAP ADVERSARIAL CHALLENGES
  // --------------------------------------------------------------------------
  console.log('▶ Test Suite 1: Submission Timing Trap & Clock Skew Resilience');

  // Case 1.1: Legitimate Clock Skew (+30s ahead on client clock)
  const skew30s = now + 30000;
  assert(
    isTimingTrapTriggered(skew30s) === false,
    'Client clock skew +30s into future is permitted without dropping legitimate leads'
  );

  // Case 1.2: Legitimate Clock Skew (+90s ahead on client clock)
  const skew90s = now + 90000;
  assert(
    isTimingTrapTriggered(skew90s) === false,
    'Client clock skew +90s into future (within 120s tolerance) is permitted'
  );

  // Case 1.3: Spambot extreme future timestamp (+300s / 5 minutes ahead)
  const spambotFuture = now + 300000;
  assert(
    isTimingTrapTriggered(spambotFuture) === true,
    'Spambot future timestamp (+300s) exceeds 120s threshold and triggers timing trap'
  );

  // Case 1.4: Rapid automated bot submission (500ms elapsed)
  const rapidBot500ms = now - 500;
  assert(
    isTimingTrapTriggered(rapidBot500ms) === true,
    'Rapid automated submission (<2000ms: 500ms) triggers timing trap'
  );

  // Case 1.5: Rapid human fill-out attempt (1500ms elapsed)
  const rapidHuman1500ms = now - 1500;
  assert(
    isTimingTrapTriggered(rapidHuman1500ms) === true,
    'Sub-2-second submission (1500ms) triggers timing trap'
  );

  // Case 1.6: Genuine deliberate human submission (3500ms elapsed)
  const genuineSubmission = now - 3500;
  assert(
    isTimingTrapTriggered(genuineSubmission) === false,
    'Normal human submission (>2000ms: 3500ms) successfully passes timing check'
  );

  // Case 1.7: Corrupted / NaN / Negative timestamp payloads
  assert(
    isTimingTrapTriggered(NaN) === true,
    'NaN timestamp triggers timing trap'
  );
  assert(
    isTimingTrapTriggered(-5000) === true,
    'Negative timestamp triggers timing trap'
  );
  assert(
    isTimingTrapTriggered(undefined) === true,
    'Missing/undefined timestamp triggers timing trap'
  );

  // --------------------------------------------------------------------------
  // 2. HONEYPOT TRAP MALICIOUS EVASION CHALLENGES
  // --------------------------------------------------------------------------
  console.log('\n▶ Test Suite 2: Honeypot Protection (Type Evasion & Falsy Handling)');

  // Clean / human submissions
  assert(isHoneypotTriggered('') === false, 'Empty string honeypot passes');
  assert(isHoneypotTriggered(undefined) === false, 'Undefined honeypot passes');
  assert(isHoneypotTriggered(null) === false, 'Null honeypot passes');
  assert(isHoneypotTriggered('   ') === false, 'Whitespace-only honeypot is treated as empty');

  // Bot attempts with standard strings
  assert(isHoneypotTriggered('http://spam-link.com') === true, 'Standard string spam triggers honeypot');
  assert(isHoneypotTriggered('   bot_payload   ') === true, 'Padded string spam triggers honeypot');

  // Bot attempts with non-string type evasion payloads
  assert(isHoneypotTriggered(['spambot_array']) === true, 'Array type evasion triggers honeypot');
  assert(isHoneypotTriggered({ bot: true, attack: 'cve-test' }) === true, 'Object type evasion triggers honeypot');
  assert(isHoneypotTriggered(123456) === true, 'Numeric type evasion (number: 123456) triggers honeypot');
  assert(isHoneypotTriggered(0) === true, 'Numeric zero (0) triggers honeypot');
  assert(isHoneypotTriggered(true) === true, 'Boolean true triggers honeypot');
  assert(isHoneypotTriggered(false) === true, 'Boolean false triggers honeypot');

  // Combined verifySecurityContext
  const spamCtx = verifySecurityContext({ hp_field: ['array_attack'], _form_loaded_at: now - 5000 });
  assert(
    spamCtx.isSpam === true &&
      spamCtx.silentResponse?.success === true &&
      spamCtx.silentResponse.data.inquiryId === (SILENT_SPAM_SUCCESS_RESPONSE as { success: true; data: { inquiryId: string } }).data.inquiryId,
    'verifySecurityContext returns silent success response on array honeypot attack'
  );

  // --------------------------------------------------------------------------
  // 3. NEPAL PHONE NUMBER FORMAT & REGEX PERMUTATIONS
  // --------------------------------------------------------------------------
  console.log('\n▶ Test Suite 3: Nepal Phone Number Regex Permutations');

  const validPhones = [
    { num: '986-1725036', label: '986-1725036 (Hyphenated standard mobile)' },
    { num: '+977 9841234567', label: '+977 9841234567 (International prefix with space)' },
    { num: '9801234567', label: '9801234567 (10-digit unformatted Ncell)' },
    { num: '+977-9841234567', label: '+977-9841234567 (International prefix with hyphen)' },
    { num: '9741234567', label: '9741234567 (10-digit NTC GSM)' },
    { num: '+977 9741234567', label: '+977 9741234567 (International NTC GSM)' },
    { num: '984-123-4567', label: '984-123-4567 (Double hyphenated format)' },
    { num: '984 123 4567', label: '984 123 4567 (Double space separated format)' },
    { num: '01-4412345', label: '01-4412345 (Kathmandu landline with hyphen)' },
    { num: '014412345', label: '014412345 (Kathmandu landline unformatted)' },
    { num: '+977-01-4412345', label: '+977-01-4412345 (International Kathmandu landline)' },
  ];

  for (const item of validPhones) {
    const isMatch = NEPAL_PHONE_REGEX.test(item.num);
    assert(isMatch === true, `Valid phone accepted: ${item.label}`);
  }

  const invalidPhones = [
    { num: '12345', label: '12345 (Too short)' },
    { num: '+1-555-123-4567', label: '+1-555-123-4567 (US international format)' },
    { num: '9612345678', label: '9612345678 (Invalid prefix 96)' },
    { num: '984123456789', label: '984123456789 (Too many digits: 12 digits)' },
    { num: 'abcdefghij', label: 'abcdefghij (Alphabetic input)' },
    { num: '+977-98412-abc', label: '+977-98412-abc (Alphanumeric injection)' },
  ];

  for (const item of invalidPhones) {
    const isMatch = NEPAL_PHONE_REGEX.test(item.num);
    assert(isMatch === false, `Invalid phone rejected: ${item.label}`);
  }

  // --------------------------------------------------------------------------
  // 4. CATEGORY ARCHIVE PRODUCT FILTERING & ACCESSOR ROBUSTNESS
  // --------------------------------------------------------------------------
  console.log('\n▶ Test Suite 4: Category Archive Product Filtering & Accessor Robustness');

  const allProducts = await getProducts();
  const allCategories = await getCategories();

  assert(allProducts.length > 0, `Total catalog products loaded: ${allProducts.length}`);
  assert(allCategories.length > 0, `Total categories loaded: ${allCategories.length}`);

  // Test every canonical category slug
  for (const cat of allCategories) {
    const filteredBySlug = await getProductsByCategory(cat.slug);
    const filteredById = await getProductsByCategory(cat.id);

    assert(
      Array.isArray(filteredBySlug),
      `getProductsByCategory("${cat.slug}") returns valid array (count: ${filteredBySlug.length})`
    );
    assert(
      filteredBySlug.length === filteredById.length,
      `Slug "${cat.slug}" and ID "${cat.id}" return identical item counts (${filteredBySlug.length})`
    );
    assert(
      filteredBySlug.every((p) => p.categoryId === cat.id),
      `All items returned for "${cat.slug}" strictly match categoryId "${cat.id}"`
    );
  }

  // Test non-existent category slug
  const nonExistent = await getProductsByCategory('non-existent-category-slug');
  assert(
    Array.isArray(nonExistent) && nonExistent.length === 0,
    'getProductsByCategory("non-existent-category-slug") returns empty array without throwing'
  );

  // Test category slug resolution
  const resolvedCat = await getCategoryBySlug('proteins');
  assert(
    resolvedCat !== null && resolvedCat.id === 'cat_proteins',
    'getCategoryBySlug("proteins") resolves to id "cat_proteins"'
  );

  const missingCat = await getCategoryBySlug('fake-slug');
  assert(
    missingCat === null,
    'getCategoryBySlug("fake-slug") returns null gracefully'
  );

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log('\n======================================================');
  console.log(`  ADVERSARIAL STRESS TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAdversarialStressTests().catch((err) => {
  console.error('Fatal Error during stress test execution:', err);
  process.exit(1);
});
