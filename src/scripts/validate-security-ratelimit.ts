import {
  checkRateLimit,
  clearInMemoryRateLimitCache,
} from '../lib/services/ratelimit';
import {
  isHoneypotTriggered,
  isTimingTrapTriggered,
  sanitizeTextInput,
  sanitizePayload,
  verifySecurityContext,
  SILENT_SPAM_SUCCESS_RESPONSE,
} from '../lib/services/security';

// Mock Next.js headers for standalone node execution
(process.env as Record<string, string>).NODE_ENV = 'development';

async function runValidation() {
  console.log('----------------------------------------------------');
  console.log('🧪 MUSCLEWORKS SUB-PHASE 5.1 VALIDATION SUITE');
  console.log('----------------------------------------------------\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // TEST SUITE 1: Honeypot Validation
  console.log('▶ Test Group 1: Honeypot Protection');
  assert(isHoneypotTriggered('bot_value') === true, 'Populated hp_field triggers honeypot');
  assert(isHoneypotTriggered('   spam   ') === true, 'Whitespace padded hp_field triggers honeypot');
  assert(isHoneypotTriggered('') === false, 'Empty hp_field passes honeypot');
  assert(isHoneypotTriggered(undefined) === false, 'Undefined hp_field passes honeypot');
  assert(isHoneypotTriggered(null) === false, 'Null hp_field passes honeypot');
  assert(isHoneypotTriggered(['bot_array']) === true, 'Array payload triggers honeypot');
  assert(isHoneypotTriggered({ bot: true }) === true, 'Object payload triggers honeypot');
  assert(isHoneypotTriggered(123) === true, 'Numeric payload triggers honeypot');

  // TEST SUITE 2: Submission Timing Trap
  console.log('\n▶ Test Group 2: Submission Timing Trap');
  const now = Date.now();
  assert(isTimingTrapTriggered(now - 100) === true, 'Submission in 100ms triggers timing trap (<2000ms)');
  assert(isTimingTrapTriggered(now - 1500) === true, 'Submission in 1500ms triggers timing trap (<2000ms)');
  assert(isTimingTrapTriggered(now - 2500) === false, 'Submission in 2500ms passes timing trap');
  assert(isTimingTrapTriggered(now + 10000) === false, 'Submission within 120s clock skew tolerance passes timing trap');
  assert(isTimingTrapTriggered(now + 130000) === true, 'Extreme future submission timestamp (>120s skew) triggers timing trap');
  assert(isTimingTrapTriggered(undefined) === true, 'Missing _form_loaded_at triggers timing trap');

  // TEST SUITE 3: Combined Security Context Verification
  console.log('\n▶ Test Group 3: Combined Security Context Verification');
  const cleanContext = verifySecurityContext({ hp_field: '', _form_loaded_at: now - 3000 });
  assert(cleanContext.isSpam === false, 'Clean submission returns isSpam: false');
  assert(cleanContext.silentResponse === undefined, 'Clean submission has no silentResponse');

  const botContext = verifySecurityContext({ hp_field: 'http://spam.bot', _form_loaded_at: now - 5000 });
  assert(botContext.isSpam === true, 'Honeypot bot submission returns isSpam: true');
  assert(botContext.silentResponse === SILENT_SPAM_SUCCESS_RESPONSE, 'Honeypot bot returns silent success response');

  // TEST SUITE 4: Input HTML Sanitization
  console.log('\n▶ Test Group 4: HTML & Input Sanitization');
  const rawHtml = '<script>alert("xss")</script>Hello <b>World</b>';
  const cleanHtml = sanitizeTextInput(rawHtml);
  assert(cleanHtml === 'alert("xss")Hello World', 'Sanitizer strips script and html tags');

  const dangerousPayload = {
    name: 'John <script>bad()</script> Doe',
    message: '<b onerror=alert(1)>Authentic Supplements</b> Inquiry',
    nested: {
      field: 'Clean text <iframe src="bad.com"></iframe>',
    },
  };
  const sanitizedPayload = sanitizePayload(dangerousPayload);
  assert((sanitizedPayload.name as string) === 'John bad() Doe', 'Payload sanitization strips tags from top-level string');
  assert(
    ((sanitizedPayload.nested as Record<string, unknown>).field as string) === 'Clean text',
    'Payload sanitization strips tags from nested objects'
  );

  // TEST SUITE 5: In-Memory Rate Limiting Engine
  console.log('\n▶ Test Group 5: In-Memory Rate Limiter (Dev Fallback)');
  clearInMemoryRateLimitCache();
  
  // Note: getClientIp inside checkRateLimit calls headers() which will default to 127.0.0.1 outside Next request context
  const req1 = await checkRateLimit('test_inquiry', 3, 3600);
  assert(req1.success === true && req1.remaining === 2, 'Rate limit request #1 succeeds with 2 remaining');

  const req2 = await checkRateLimit('test_inquiry', 3, 3600);
  assert(req2.success === true && req2.remaining === 1, 'Rate limit request #2 succeeds with 1 remaining');

  const req3 = await checkRateLimit('test_inquiry', 3, 3600);
  assert(req3.success === true && req3.remaining === 0, 'Rate limit request #3 succeeds with 0 remaining');

  const req4 = await checkRateLimit('test_inquiry', 3, 3600);
  assert(req4.success === false && req4.remaining === 0, 'Rate limit request #4 is rejected (exceeded 3 limit)');

  console.log('\n----------------------------------------------------');
  console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed.`);
  console.log('----------------------------------------------------');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runValidation().catch((err) => {
  console.error('Validation script execution failed:', err);
  process.exit(1);
});
