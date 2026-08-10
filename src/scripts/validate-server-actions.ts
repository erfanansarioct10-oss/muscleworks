/**
 * Programmatic Validation Script for Server Actions Pipeline (`src/actions/inquiry.ts`, `src/actions/contact.ts`)
 * Run via: npx tsx src/scripts/validate-server-actions.ts
 */

Object.assign(process.env, { NODE_ENV: 'test' });

import { submitInquiryAction } from '../actions/inquiry';
import { submitContactAction } from '../actions/contact';
import { clearInMemoryRateLimitCache } from '../lib/services/ratelimit';
import type { InquiryFormClientValues } from '../lib/validations/inquiry';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string): void {
  if (condition) {
    console.log(`  ✓ PASSED: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
    failed++;
  }
}

async function runServerActionsValidation(): Promise<void> {
  console.log('\n======================================================');
  console.log('  MUSCLEWORKS SUPPLEMENTS — SERVER ACTIONS VALIDATOR');
  console.log('======================================================\n');

  clearInMemoryRateLimitCache();

  // Test 1: Valid Inquiry Action Submission
  console.log('Test Suite 1: submitInquiryAction Valid Flow');
  const validInquiryPayload: InquiryFormClientValues = {
    fullName: 'Ramesh Sharma',
    phoneNumber: '+977-9841234567',
    email: 'ramesh@example.com',
    inquiryType: 'product_inquiry',
    message: 'Hello MuscleWorks! Is ON Gold Standard Whey 5lbs Double Rich Chocolate currently in stock at Golfutar store?',
    preferredContactMethod: 'whatsapp',
    deliveryCity: 'Kathmandu',
    productContext: {
      productId: 'prod_on_gold_standard_whey',
      productName: 'Optimum Nutrition Gold Standard 100% Whey',
      productSlug: 'optimum-nutrition-gold-standard-100-whey',
      variantSku: 'ON-GSW-5LB-CHO',
      variantLabel: 'Double Rich Chocolate / 5 lbs',
      priceNpr: 11500,
    },
    hp_field: '',
    _form_loaded_at: Date.now() - 3000, // 3 seconds ago (valid timing)
  };

  const inquiryRes = await submitInquiryAction(validInquiryPayload);
  assert(inquiryRes.success === true, 'Valid inquiry returns success: true');
  assert(
    Boolean(inquiryRes.success && inquiryRes.data?.inquiryId.startsWith('inq_')),
    'Valid inquiry returns inquiryId starting with inq_'
  );

  // Test 2: Honeypot Anti-Spam Trap
  console.log('\nTest Suite 2: Honeypot Trap (hp_field)');
  const honeypotPayload: InquiryFormClientValues = {
    ...validInquiryPayload,
    hp_field: 'http://spam-link.com',
  };

  const hpRes = await submitInquiryAction(honeypotPayload);
  assert(hpRes.success === true, 'Honeypot trigger returns silent success response');
  assert(
    hpRes.success && hpRes.data?.inquiryId === 'inq_spambot_dropped',
    'Honeypot returns inq_spambot_dropped sentinel ID'
  );

  // Test 3: Submission Timing Trap (< 2000ms)
  console.log('\nTest Suite 3: Submission Timing Trap');
  const fastPayload: InquiryFormClientValues = {
    ...validInquiryPayload,
    _form_loaded_at: Date.now() - 500, // Submitted in 500ms (too fast)
  };

  const fastRes = await submitInquiryAction(fastPayload);
  assert(fastRes.success === true, 'Timing trap returns silent success response');
  assert(
    fastRes.success && fastRes.data?.inquiryId === 'inq_spambot_dropped',
    'Timing trap returns inq_spambot_dropped sentinel ID'
  );

  // Test 4: Zod Validation Failure
  console.log('\nTest Suite 4: Zod Input Validation');
  const invalidPayload: InquiryFormClientValues = {
    fullName: 'A', // Too short (< 2 chars)
    phoneNumber: '12345', // Invalid Nepal phone
    email: 'not-an-email',
    inquiryType: 'general',
    message: 'Short', // Too short (< 10 chars)
    preferredContactMethod: 'phone',
    hp_field: '',
    _form_loaded_at: Date.now() - 4000,
  };

  const invalidRes = await submitInquiryAction(invalidPayload);
  assert(invalidRes.success === false, 'Invalid inputs return success: false');
  assert(
    invalidRes.success === false && Boolean(invalidRes.fieldErrors?.fullName),
    'Invalid input returns fieldErrors for fullName'
  );
  assert(
    invalidRes.success === false && Boolean(invalidRes.fieldErrors?.phoneNumber),
    'Invalid input returns fieldErrors for phoneNumber'
  );
  assert(
    invalidRes.success === false && Boolean(invalidRes.fieldErrors?.message),
    'Invalid input returns fieldErrors for message'
  );

  // Test 5: submitContactAction Valid Submission & Scope Isolation
  console.log('\nTest Suite 5: submitContactAction Valid Submission');
  const validContactPayload: InquiryFormClientValues = {
    fullName: 'Sita Adhikari',
    phoneNumber: '9801234567',
    email: 'sita@example.com',
    inquiryType: 'general',
    message: 'What are your flagship store opening hours on Saturday in Golfutar, Kathmandu?',
    preferredContactMethod: 'phone',
    deliveryCity: 'Lalitpur',
    hp_field: '',
    _form_loaded_at: Date.now() - 5000,
  };

  const contactRes = await submitContactAction(validContactPayload);
  assert(contactRes.success === true, 'Contact action returns success: true');
  assert(
    Boolean(contactRes.success && contactRes.data?.inquiryId.startsWith('inq_contact_')),
    'Contact action returns inquiryId starting with inq_contact_'
  );

  // Test 6: Rate Limit Enforcement & Scope Isolation
  console.log('\nTest Suite 6: Scope-Isolated Rate Limiting Enforcement');
  clearInMemoryRateLimitCache();

  // Exhaust 5 allowed inquiries for 'inquiry' scope
  for (let i = 0; i < 5; i++) {
    await submitInquiryAction(validInquiryPayload);
  }

  // 6th inquiry should hit rate limit
  const rateLimitedInquiryRes = await submitInquiryAction(validInquiryPayload);
  assert(
    rateLimitedInquiryRes.success === false,
    '6th submission to inquiry action is blocked by rate limit'
  );
  assert(
    rateLimitedInquiryRes.success === false &&
      rateLimitedInquiryRes.error.includes('Too many inquiry requests'),
    'Rate limit error message returned correctly'
  );

  // Contact action should STILL succeed because it uses isolated scope 'contact'
  const isolatedContactRes = await submitContactAction(validContactPayload);
  assert(
    isolatedContactRes.success === true,
    'Contact action succeeds under isolated rate limit scope even when inquiry scope is exhausted'
  );

  // Summary Report
  console.log('\n======================================================');
  console.log(`  TEST RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runServerActionsValidation().catch((err) => {
  console.error('Fatal Validation Error:', err);
  process.exit(1);
});
