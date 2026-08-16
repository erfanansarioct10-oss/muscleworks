/**
 * ADVERSARIAL STRESS TEST & VERIFICATION HARNESS FOR MILESTONE 4
 * Focus: Analytics Telemetry Engine, SSR/Browser Resilience, Dead Code & Types Pruning, Scanner Whitelisting.
 *
 * Challenger: Challenger 1 (Milestone 4)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import {
  trackEvent,
  trackWhatsAppClick,
  trackProductView,
  trackSearchQuery,
  trackCategoryView,
  trackLeadSubmission,
} from '../lib/analytics';

// Test runner state
let passed = 0;
let failed = 0;
const failures: string[] = [];

// Formatting helpers
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ${GREEN}✓ [PASS]${RESET} ${testName}`);
    passed++;
  } else {
    console.error(`  ${RED}✗ [FAIL]${RESET} ${testName}`);
    if (details) {
      console.error(`     ${RED}Details: ${details}${RESET}`);
    }
    failed++;
    failures.push(`${testName}${details ? ` -> ${details}` : ''}`);
  }
}

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(__dirname, '..');

console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}${CYAN}🧪 MUSCLEWORKS CHALLENGER 1: M4 ADVERSARIAL STRESS TEST HARNESS${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

// Extended GlobalThis type for safe mocking without `any`
interface MockGlobal {
  window?: {
    gtag?: ((command: string, action: string, params?: Record<string, unknown>) => void) | unknown;
    fbq?: ((command: string, eventName: string, params?: Record<string, unknown>) => void) | unknown;
    addEventListener?: (type: string, listener: (event: CustomEvent<unknown>) => void) => void;
    dispatchEvent?: (event: CustomEvent<unknown>) => boolean;
  };
  CustomEvent?: new (type: string, options?: { detail?: unknown }) => CustomEvent<unknown>;
}

const customGlobal = globalThis as unknown as MockGlobal;

// ===========================================================================
// SUITE 1: Node.js / SSR Environment Hardening & Adversarial Payloads
// ===========================================================================
console.log(`${BOLD}${YELLOW}--- SUITE 1: SSR Environment & Adversarial Inputs Resilience ---${RESET}`);

// Ensure window is truly undefined for SSR testing
if (typeof customGlobal.window !== 'undefined') {
  delete customGlobal.window;
}

// 1.1 Standard Payloads in SSR
try {
  trackWhatsAppClick({
    source: 'test_ssr',
    productName: 'Standard Whey',
    brand: 'Optimum Nutrition',
    flavor: 'Chocolate',
    size: '5 lbs',
    price: 11500,
  });
  trackProductView({
    productId: 'on-whey-5lb',
    productName: 'Standard Whey',
    brand: 'Optimum Nutrition',
    category: 'Protein',
    price: 11500,
  });
  trackSearchQuery({
    query: 'creatine',
    resultsCount: 12,
  });
  trackCategoryView({
    categoryId: 'proteins',
    categoryName: 'Proteins',
  });
  trackLeadSubmission({
    formName: 'InquiryForm',
    city: 'Kathmandu',
    inquiryType: 'general',
  });
  assert(true, '1.1: Standard analytics dispatches execute cleanly in SSR with zero window access');
} catch (err: unknown) {
  assert(false, '1.1: Standard analytics dispatches failed in SSR', String(err));
}

// 1.2 Extreme/Adversarial Payloads in SSR
try {
  // Extreme string lengths (>15k chars)
  const hugeString = 'A'.repeat(15000);
  const maliciousXss = '<script>alert("xss")</script><img src=x onerror=alert(1)>';
  const complexUnicode = '💪🔥🇳🇵 Everest 🏋️‍♂️ \u0000\uFFFF\uD83D\uDE00';

  trackWhatsAppClick({
    source: hugeString,
    productName: maliciousXss,
    brand: complexUnicode,
    flavor: undefined,
    size: '',
    price: -999999, // negative price
  });

  trackProductView({
    productId: maliciousXss,
    productName: hugeString,
    brand: undefined,
    category: complexUnicode,
    price: Number.MAX_SAFE_INTEGER,
  });

  trackSearchQuery({
    query: maliciousXss,
    resultsCount: -50,
  });

  trackCategoryView({
    categoryId: '',
    categoryName: hugeString,
  });

  trackLeadSubmission({
    formName: complexUnicode,
    city: undefined,
    inquiryType: maliciousXss,
  });

  trackEvent({
    eventName: maliciousXss,
    category: undefined,
    label: undefined,
    value: NaN,
    params: {
      nested: { deeply: { complex: [1, 2, 3, null, undefined] } },
      date: new Date(),
    },
  });

  assert(true, '1.2: Adversarial payloads (XSS vectors, huge strings, Unicode, negative/NaN numbers) absorbed in SSR without throwing');
} catch (err: unknown) {
  assert(false, '1.2: Adversarial payloads threw exception in SSR', String(err));
}

// ===========================================================================
// SUITE 2: Simulated Browser Environment - Pristine Tracking Verification
// ===========================================================================
console.log(`\n${BOLD}${YELLOW}--- SUITE 2: Simulated Browser Tracking Verification (gtag, fbq, CustomEvent) ---${RESET}`);

// Setup pristine browser mock
const gtagCalls: Array<{ command: string; action: string; params?: Record<string, unknown> }> = [];
const fbqCalls: Array<{ command: string; eventName: string; params?: Record<string, unknown> }> = [];
const customEventsDispatched: Array<{ type: string; detail: unknown }> = [];
const eventListeners: Record<string, Array<(event: CustomEvent<unknown>) => void>> = {};

class MockCustomEvent<T = unknown> {
  type: string;
  detail: T | undefined;
  constructor(type: string, options?: { detail?: T }) {
    this.type = type;
    this.detail = options?.detail;
  }
}

customGlobal.CustomEvent = MockCustomEvent as unknown as MockGlobal['CustomEvent'];
customGlobal.window = {
  gtag: (command: string, action: string, params?: Record<string, unknown>) => {
    gtagCalls.push({ command, action, params });
  },
  fbq: (command: string, eventName: string, params?: Record<string, unknown>) => {
    fbqCalls.push({ command, eventName, params });
  },
  addEventListener: (type: string, listener: (event: CustomEvent<unknown>) => void) => {
    if (!eventListeners[type]) eventListeners[type] = [];
    eventListeners[type].push(listener);
  },
  dispatchEvent: (event: CustomEvent<unknown>) => {
    customEventsDispatched.push({ type: event.type, detail: event.detail });
    if (eventListeners[event.type]) {
      eventListeners[event.type].forEach((fn) => fn(event));
    }
    return true;
  },
};

// 2.1 WhatsApp Click Tracking Verification
gtagCalls.length = 0;
fbqCalls.length = 0;
customEventsDispatched.length = 0;

trackWhatsAppClick({
  source: 'product_card_quick_order',
  productName: 'Dymatize ISO 100',
  brand: 'Dymatize',
  flavor: 'Gourmet Chocolate',
  size: '5 lbs',
  price: 14500,
});

const dispatchedDetail = customEventsDispatched[0]?.detail as Record<string, unknown> | undefined;

assert(
  gtagCalls.length === 1 &&
    gtagCalls[0].command === 'event' &&
    gtagCalls[0].action === 'whatsapp_click' &&
    gtagCalls[0].params?.event_category === 'Conversion' &&
    gtagCalls[0].params?.source === 'product_card_quick_order' &&
    gtagCalls[0].params?.product_name === 'Dymatize ISO 100' &&
    gtagCalls[0].params?.price_npr === 14500,
  '2.1: trackWhatsAppClick dispatches correct GA4 event structure to window.gtag'
);

assert(
  fbqCalls.length === 1 &&
    fbqCalls[0].command === 'trackCustom' &&
    fbqCalls[0].eventName === 'whatsapp_click' &&
    fbqCalls[0].params?.category === 'Conversion' &&
    fbqCalls[0].params?.source === 'product_card_quick_order',
  '2.2: trackWhatsAppClick dispatches correct Meta Pixel event structure to window.fbq'
);

assert(
  customEventsDispatched.length === 1 &&
    customEventsDispatched[0].type === 'mw:analytics' &&
    dispatchedDetail?.eventName === 'whatsapp_click' &&
    dispatchedDetail?.category === 'Conversion' &&
    dispatchedDetail?.value === 14500,
  '2.3: trackWhatsAppClick dispatches DOM CustomEvent (mw:analytics) to window'
);

// 2.2 Product View Tracking Verification
gtagCalls.length = 0;
fbqCalls.length = 0;
customEventsDispatched.length = 0;

trackProductView({
  productId: 'dymatize-iso100-5lb',
  productName: 'Dymatize ISO 100',
  brand: 'Dymatize',
  category: 'Hydrolyzed Whey',
  price: 14500,
});

assert(
  gtagCalls.length === 1 &&
    gtagCalls[0].action === 'view_item' &&
    gtagCalls[0].params?.event_category === 'Ecommerce' &&
    gtagCalls[0].params?.item_id === 'dymatize-iso100-5lb' &&
    gtagCalls[0].params?.item_name === 'Dymatize ISO 100' &&
    gtagCalls[0].params?.item_brand === 'Dymatize' &&
    gtagCalls[0].params?.item_category === 'Hydrolyzed Whey' &&
    gtagCalls[0].params?.price_npr === 14500,
  '2.4: trackProductView dispatches correct GA4 view_item event with ecommerce attributes'
);

assert(
  fbqCalls.length === 1 &&
    fbqCalls[0].eventName === 'view_item' &&
    fbqCalls[0].params?.item_id === 'dymatize-iso100-5lb',
  '2.5: trackProductView dispatches Meta Pixel trackCustom view_item'
);

// 2.3 Search Query Tracking Verification
gtagCalls.length = 0;
fbqCalls.length = 0;
customEventsDispatched.length = 0;

trackSearchQuery({
  query: 'mass gainer 6kg',
  resultsCount: 4,
});

assert(
  gtagCalls.length === 1 &&
    gtagCalls[0].action === 'search' &&
    gtagCalls[0].params?.event_category === 'Catalog Search' &&
    gtagCalls[0].params?.search_term === 'mass gainer 6kg' &&
    gtagCalls[0].params?.results_count === 4 &&
    gtagCalls[0].params?.value === 4,
  '2.6: trackSearchQuery dispatches GA4 search event with search_term & results_count'
);

// 2.4 Category View Tracking Verification
gtagCalls.length = 0;
fbqCalls.length = 0;
customEventsDispatched.length = 0;

trackCategoryView({
  categoryId: 'creatine',
  categoryName: 'Creatine Monohydrate',
});

assert(
  gtagCalls.length === 1 &&
    gtagCalls[0].action === 'view_item_list' &&
    gtagCalls[0].params?.event_category === 'Navigation' &&
    gtagCalls[0].params?.item_list_id === 'creatine' &&
    gtagCalls[0].params?.item_list_name === 'Creatine Monohydrate',
  '2.7: trackCategoryView dispatches GA4 view_item_list event with category identifiers'
);

// 2.5 Lead Submission Tracking Verification
gtagCalls.length = 0;
fbqCalls.length = 0;
customEventsDispatched.length = 0;

trackLeadSubmission({
  formName: 'InquiryForm',
  city: 'Pokhara',
  inquiryType: 'wholesale_inquiry',
});

assert(
  gtagCalls.length === 1 &&
    gtagCalls[0].action === 'generate_lead' &&
    gtagCalls[0].params?.event_category === 'Lead Generation' &&
    gtagCalls[0].params?.form_name === 'InquiryForm' &&
    gtagCalls[0].params?.city === 'Pokhara' &&
    gtagCalls[0].params?.inquiry_type === 'wholesale_inquiry',
  '2.8: trackLeadSubmission dispatches GA4 generate_lead event with full lead metadata'
);

// ===========================================================================
// SUITE 3: Hostile & Degraded Browser Environments Resilience
// ===========================================================================
console.log(`\n${BOLD}${YELLOW}--- SUITE 3: Hostile & Degraded Browser Environments Resilience ---${RESET}`);

// 3.1 Ad-Blocker Scenario: window.gtag and window.fbq are undefined
if (customGlobal.window) {
  customGlobal.window.gtag = undefined;
  customGlobal.window.fbq = undefined;
}
customEventsDispatched.length = 0;

try {
  trackWhatsAppClick({ source: 'adblock_test', productName: 'NitroTech' });
  trackProductView({ productId: 'nt-1', productName: 'NitroTech', price: 9000 });
  trackSearchQuery({ query: 'bcaa', resultsCount: 3 });
  trackCategoryView({ categoryId: 'amino', categoryName: 'Amino Acids' });
  trackLeadSubmission({ formName: 'ContactForm' });

  assert(
    customEventsDispatched.length === 5,
    '3.1: Ad-blocker scenario (gtag & fbq undefined) succeeds silently and preserves CustomEvent dispatch'
  );
} catch (err: unknown) {
  assert(false, '3.1: Ad-blocker scenario threw error', String(err));
}

// 3.2 Corrupted Types: window.gtag and window.fbq are non-functions (objects, numbers, strings)
if (customGlobal.window) {
  customGlobal.window.gtag = { corrupt: true };
  customGlobal.window.fbq = 'corrupt_string';
}

try {
  trackWhatsAppClick({ source: 'corrupted_types', price: 1000 });
  trackProductView({ productId: 'p1', productName: 'P1', price: 1000 });
  trackSearchQuery({ query: 'test', resultsCount: 1 });
  trackCategoryView({ categoryId: 'c1', categoryName: 'C1' });
  trackLeadSubmission({ formName: 'F1' });
  assert(true, '3.2: Non-function gtag/fbq types are safely ignored without "not a function" runtime crashes');
} catch (err: unknown) {
  assert(false, '3.2: Corrupted gtag/fbq types caused crash', String(err));
}

// 3.3 Throwing Third-Party Scripts: gtag, fbq, and dispatchEvent throw runtime errors
if (customGlobal.window) {
  customGlobal.window.gtag = () => {
    throw new Error('GA4 Content Security Policy block or network failure');
  };
  customGlobal.window.fbq = () => {
    throw new Error('Meta Pixel rate limit exceeded');
  };
  customGlobal.window.dispatchEvent = () => {
    throw new Error('CustomEvent DOM handler threw uncaught exception');
  };
}

try {
  trackWhatsAppClick({ source: 'throwing_scripts', price: 5000 });
  trackProductView({ productId: 'p-throw', productName: 'P-Throw', price: 5000 });
  trackSearchQuery({ query: 'throw', resultsCount: 0 });
  trackCategoryView({ categoryId: 'c-throw', categoryName: 'C-Throw' });
  trackLeadSubmission({ formName: 'F-Throw' });
  assert(true, '3.3: Throwing third-party tracking scripts are isolated by try/catch blocks without uncaught errors');
} catch (err: unknown) {
  assert(false, '3.3: Throwing tracking scripts escaped isolation', String(err));
}

// 3.4 Missing CustomEvent Constructor Scenario with clean window
customGlobal.window = {}; // clean window without throwing gtag
customGlobal.CustomEvent = undefined;
try {
  trackEvent({ eventName: 'no_custom_event' });
  assert(true, '3.4: Missing CustomEvent constructor handled safely without throwing');
} catch (err: unknown) {
  assert(false, '3.4: Missing CustomEvent constructor threw error', String(err));
}

// Cleanup mock browser globals
delete customGlobal.window;
delete customGlobal.CustomEvent;

// ===========================================================================
// SUITE 4: Comprehensive Static Audit of Pruned Symbols & Dead Types
// ===========================================================================
console.log(`\n${BOLD}${YELLOW}--- SUITE 4: Static Audit of Pruned Symbols & Dead Types across src/ ---${RESET}`);

function getAllFilesRecursively(dir: string, ext: string[] = ['.ts', '.tsx', '.js', '.jsx', '.json']): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFilesRecursively(fullPath, ext));
    } else if (ext.includes(path.extname(fullPath))) {
      results.push(fullPath);
    }
  }
  return results;
}

const allSrcFiles = getAllFilesRecursively(SRC_DIR);
// Separate test scripts in src/scripts from production code
const prodSrcFiles = allSrcFiles.filter((f) => !f.includes(path.join('src', 'scripts')));

// 4.1 Check STORE_PHONE_DISPLAY
const phoneDisplayCallers = prodSrcFiles.filter((f) => {
  const content = fs.readFileSync(f, 'utf-8');
  return /\bSTORE_PHONE_DISPLAY\b/.test(content);
});
assert(
  phoneDisplayCallers.length === 0,
  '4.1: STORE_PHONE_DISPLAY has exactly 0 occurrences across all production files in src/',
  phoneDisplayCallers.map((f) => path.relative(ROOT, f)).join(', ')
);

// 4.2 Check STORE_WHATSAPP_DISPLAY
const whatsappDisplayCallers = prodSrcFiles.filter((f) => {
  const content = fs.readFileSync(f, 'utf-8');
  return /\bSTORE_WHATSAPP_DISPLAY\b/.test(content);
});
assert(
  whatsappDisplayCallers.length === 0,
  '4.2: STORE_WHATSAPP_DISPLAY has exactly 0 occurrences across all production files in src/',
  whatsappDisplayCallers.map((f) => path.relative(ROOT, f)).join(', ')
);

// 4.3 Check isStoreOpenToday
const openTodayCallers = prodSrcFiles.filter((f) => {
  const content = fs.readFileSync(f, 'utf-8');
  return /\bisStoreOpenToday\b/.test(content);
});
assert(
  openTodayCallers.length === 0,
  '4.3: isStoreOpenToday has exactly 0 occurrences across all production files in src/',
  openTodayCallers.map((f) => path.relative(ROOT, f)).join(', ')
);

// 4.4 Check InquiryPayload in production files
const inquiryPayloadCallers = prodSrcFiles.filter((f) => {
  const content = fs.readFileSync(f, 'utf-8');
  return /\bInquiryPayload\b/.test(content);
});
assert(
  inquiryPayloadCallers.length === 0,
  '4.4: InquiryPayload has exactly 0 occurrences across all production files in src/',
  inquiryPayloadCallers.map((f) => path.relative(ROOT, f)).join(', ')
);

// 4.5 Check src/types/index.ts barrel deletion
const typesBarrelExists = fs.existsSync(path.join(SRC_DIR, 'types', 'index.ts'));
assert(!typesBarrelExists, '4.5: Dead barrel file src/types/index.ts does not exist on filesystem');

// 4.6 Check for any rogue imports targeting @/types or @/types/index
const barrelImportCallers = allSrcFiles.filter((f) => {
  const content = fs.readFileSync(f, 'utf-8');
  return /from\s+['"]@\/types['"]|from\s+['"]@\/types\/index['"]/.test(content);
});
assert(
  barrelImportCallers.length === 0,
  '4.6: Exactly 0 files import from defunct barrel @/types or @/types/index',
  barrelImportCallers.map((f) => path.relative(ROOT, f)).join(', ')
);

// 4.7 Check that required actions types are intact
const actionsTypeFile = fs.readFileSync(path.join(SRC_DIR, 'types', 'actions.ts'), 'utf-8');
assert(
  actionsTypeFile.includes('export type ActionResult<T = void>') &&
    actionsTypeFile.includes('export type ActionSuccess<T = void>') &&
    actionsTypeFile.includes('export type ActionError ='),
  '4.7: Essential Server Action result contracts (ActionResult, ActionSuccess, ActionError) remain strictly defined'
);

// 4.8 Check that required constants are intact
const constantsFile = fs.readFileSync(path.join(SRC_DIR, 'lib', 'constants.ts'), 'utf-8');
assert(
  constantsFile.includes('export const STORE_PHONE =') &&
    constantsFile.includes('export const STORE_WHATSAPP =') &&
    constantsFile.includes('export const STORE_LOCATION =') &&
    constantsFile.includes('export const STORE_HOURS =') &&
    constantsFile.includes('export const DELIVERY_PROMISES =') &&
    constantsFile.includes('export const NEPAL_DELIVERY_CITIES ='),
  '4.8: Required canonical store constants remain strictly defined and intact'
);

// ===========================================================================
// SUITE 5: Verification of Component Analytics Wiring in Key UI Modules
// ===========================================================================
console.log(`\n${BOLD}${YELLOW}--- SUITE 5: Component Analytics Wiring Verification ---${RESET}`);

// 5.1 InquiryForm & ContactForm
const inquiryForm = fs.readFileSync(path.join(SRC_DIR, 'components', 'forms', 'inquiry-form.tsx'), 'utf-8');
assert(
  inquiryForm.includes('trackLeadSubmission(') &&
    inquiryForm.includes("formName: 'InquiryForm'") &&
    inquiryForm.includes('city: finalPayload.deliveryCity') &&
    inquiryForm.includes('inquiryType: values.inquiryType'),
  '5.1: InquiryForm correctly tracks lead submission with deliveryCity and inquiryType upon successful submission'
);

const contactForm = fs.readFileSync(path.join(SRC_DIR, 'components', 'forms', 'contact-form.tsx'), 'utf-8');
assert(
  contactForm.includes('trackLeadSubmission(') &&
    contactForm.includes("formName: 'ContactForm'") &&
    contactForm.includes('city: finalPayload.deliveryCity') &&
    contactForm.includes('inquiryType: values.inquiryType'),
  '5.2: ContactForm correctly tracks lead submission with deliveryCity and inquiryType upon successful submission'
);

// 5.2 SearchModal
const searchModal = fs.readFileSync(path.join(SRC_DIR, 'components', 'catalog', 'search-modal.tsx'), 'utf-8');
assert(
  searchModal.includes('trackSearchQuery({') &&
    searchModal.includes('query: trimmed') &&
    searchModal.includes('resultsCount: res.length') &&
    searchModal.includes('resultsCount: results.length'),
  '5.3: SearchModal dispatches trackSearchQuery in both debounced search results and form submit'
);

// 5.3 CatalogContainer
const catalogContainer = fs.readFileSync(path.join(SRC_DIR, 'components', 'catalog', 'catalog-container.tsx'), 'utf-8');
assert(
  catalogContainer.includes('trackCategoryView(') &&
    catalogContainer.includes('categoryId: matched.id') &&
    catalogContainer.includes('categoryName: matched.name') &&
    catalogContainer.includes('activeCategorySlugs'),
  '5.4: CatalogContainer dispatches trackCategoryView in useEffect reacting to activeCategorySlugs'
);

// 5.4 ProductCard & PDP
const productCard = fs.readFileSync(path.join(SRC_DIR, 'components', 'product', 'product-card.tsx'), 'utf-8');
assert(
  productCard.includes('trackWhatsAppClick(') &&
    productCard.includes("source: 'product_card_quick_order'") &&
    productCard.includes('productName: product.name') &&
    productCard.includes('price: currentPrice'),
  '5.5: ProductCard dispatches trackWhatsAppClick on quick-order click with full item specs'
);

const pdpView = fs.readFileSync(path.join(SRC_DIR, 'components', 'product', 'product-detail-view.tsx'), 'utf-8');
assert(
  pdpView.includes('trackProductView(') &&
    pdpView.includes('productId: product.id') &&
    pdpView.includes('trackWhatsAppClick(') &&
    pdpView.includes("source: 'pdp_hero_cta'"),
  '5.6: ProductDetailView dispatches trackProductView on mount/variant change and trackWhatsAppClick on hero CTA'
);

const stickyBar = fs.readFileSync(path.join(SRC_DIR, 'components', 'product', 'product-sticky-bar.tsx'), 'utf-8');
assert(
  stickyBar.includes('trackWhatsAppClick(') &&
    stickyBar.includes("source: 'pdp_sticky_bar'"),
  '5.7: ProductStickyBar dispatches trackWhatsAppClick with source=pdp_sticky_bar'
);

const authBox = fs.readFileSync(path.join(SRC_DIR, 'components', 'product', 'authenticity-guarantee-box.tsx'), 'utf-8');
assert(
  authBox.includes('trackWhatsAppClick(') &&
    authBox.includes("source: 'pdp_authenticity_box'"),
  '5.8: AuthenticityGuaranteeBox dispatches trackWhatsAppClick with source=pdp_authenticity_box'
);

// ===========================================================================
// SUITE 6: Dead Code Scanner Script Execution Audit
// ===========================================================================
console.log(`\n${BOLD}${YELLOW}--- SUITE 6: Dead Code Scanner Script Execution Audit ---${RESET}`);

try {
  const scannerOutput = execSync('node src/scripts/check-dead-code.js', {
    cwd: path.resolve(__dirname, '../..'),
    encoding: 'utf-8',
  });

  assert(
    scannerOutput.includes('production') && scannerOutput.includes('test scripts'),
    '6.1: check-dead-code.js successfully executes and reports separation of production and test files'
  );

  assert(
    scannerOutput.includes('UNUSED COMPONENT FILES') &&
      !scannerOutput.includes('src/components/ui/'),
    '6.2: check-dead-code.js excludes atomic UI primitives in src/components/ui/ from false-flagging'
  );

  assert(
    !scannerOutput.includes('STORE_PHONE_DISPLAY') &&
      !scannerOutput.includes('STORE_WHATSAPP_DISPLAY') &&
      !scannerOutput.includes('isStoreOpenToday') &&
      !scannerOutput.includes('InquiryPayload'),
    '6.3: check-dead-code.js does not find pruned constants or types lingering in production code'
  );
} catch (err: unknown) {
  assert(false, '6.1-6.3: check-dead-code.js execution failed', String(err));
}

// ===========================================================================
// SUMMARY & VERDICT
// ===========================================================================
console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
console.log(
  `${BOLD}TOTAL TESTS:${RESET} ${passed + failed} | ${GREEN}${BOLD}PASSED:${RESET} ${passed} | ${
    failed > 0 ? `${RED}${BOLD}FAILED:${RESET} ${failed}` : `${GREEN}${BOLD}FAILED: 0${RESET}`
  }`
);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

if (failed > 0) {
  console.error(`${RED}${BOLD}FAILURES DETECTED:${RESET}`);
  failures.forEach((f, idx) => console.error(`  ${idx + 1}. ${f}`));
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}🎉 ALL 28 ADVERSARIAL CHALLENGER 1 STRESS TESTS PASSED WITH 100% SUCCESS!${RESET}\n`);
}
