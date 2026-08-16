/**
 * Comprehensive Validation Test Script for Milestone 4:
 * Analytics Telemetry, Dead Code Pruning & Test Harness Scanner (MED-02, MED-08, LOW-05, LOW-06, LOW-10, INFO-01)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  trackWhatsAppClick,
  trackProductView,
  trackSearchQuery,
  trackCategoryView,
  trackLeadSubmission,
  type WhatsAppClickParams,
  type ProductViewParams,
  type SearchQueryParams,
  type CategoryViewParams,
  type LeadSubmissionParams,
} from '../lib/analytics';

// ANSI colors for clean test reporting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ${GREEN}✅ [PASS]${RESET} ${testName}`);
    passed++;
  } else {
    console.error(`  ${RED}❌ [FAIL]${RESET} ${testName}`);
    if (details) {
      console.error(`     ${RED}Details: ${details}${RESET}`);
    }
    failed++;
  }
}

const ROOT = path.resolve(__dirname, '..');

console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}${CYAN}📊 MUSCLEWORKS MILESTONE 4: ANALYTICS & DEAD CODE PRUNING VALIDATION${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

// ---------------------------------------------------------------------------
// SUITE 1: Analytics Dispatch Engine & Node SSR Safety
// ---------------------------------------------------------------------------
console.log(`${BOLD}--- SUITE 1: Analytics Dispatch Engine & SSR Safety (MED-02, MED-08) ---${RESET}`);

try {
  const waPayload: WhatsAppClickParams = {
    source: 'product_card_quick_order',
    productName: 'Optimum Nutrition Gold Standard 100% Whey',
    brand: 'Optimum Nutrition',
    flavor: 'Double Rich Chocolate',
    size: '5 lbs',
    price: 11500,
  };
  trackWhatsAppClick(waPayload);
  assert(true, '1.1: trackWhatsAppClick executes safely in Node.js environment without window errors');
} catch (err) {
  assert(false, '1.1: trackWhatsAppClick threw an error during SSR execution', String(err));
}

try {
  const pvPayload: ProductViewParams = {
    productId: 'on-gold-standard-whey-5lb',
    productName: 'Optimum Nutrition Gold Standard 100% Whey',
    brand: 'Optimum Nutrition',
    category: 'Whey Protein',
    price: 11500,
  };
  trackProductView(pvPayload);
  assert(true, '1.2: trackProductView executes safely in Node.js environment without window errors');
} catch (err) {
  assert(false, '1.2: trackProductView threw an error during SSR execution', String(err));
}

try {
  const sqPayload: SearchQueryParams = {
    query: 'creatine monohydrate',
    resultsCount: 8,
  };
  trackSearchQuery(sqPayload);
  assert(true, '1.3: trackSearchQuery executes safely in Node.js environment without window errors');
} catch (err) {
  assert(false, '1.3: trackSearchQuery threw an error during SSR execution', String(err));
}

try {
  const cvPayload: CategoryViewParams = {
    categoryId: 'proteins',
    categoryName: 'Proteins',
  };
  trackCategoryView(cvPayload);
  assert(true, '1.4: trackCategoryView executes safely in Node.js environment without window errors');
} catch (err) {
  assert(false, '1.4: trackCategoryView threw an error during SSR execution', String(err));
}

try {
  const leadPayload: LeadSubmissionParams = {
    formName: 'InquiryForm',
    city: 'Kathmandu (Inside Ring Road)',
    inquiryType: 'product_availability',
  };
  trackLeadSubmission(leadPayload);
  assert(true, '1.5: trackLeadSubmission executes safely in Node.js environment without window errors');
} catch (err) {
  assert(false, '1.5: trackLeadSubmission threw an error during SSR execution', String(err));
}

// ---------------------------------------------------------------------------
// SUITE 2: Client Component Analytics Wiring Verification
// ---------------------------------------------------------------------------
console.log(`\n${BOLD}--- SUITE 2: Client Component Telemetry Wiring Verification (MED-02, MED-08) ---${RESET}`);

// 2.1 SearchModal (debounced search completion & form submit)
const searchModalPath = path.join(ROOT, 'components/catalog/search-modal.tsx');
const searchModalContent = fs.readFileSync(searchModalPath, 'utf-8');

assert(
  searchModalContent.includes("import { trackSearchQuery } from '@/lib/analytics'") ||
  searchModalContent.includes('import { trackSearchQuery } from "@/lib/analytics"'),
  '2.1: SearchModal imports trackSearchQuery from @/lib/analytics'
);

assert(
  searchModalContent.includes('trackSearchQuery({') &&
  searchModalContent.includes('query: trimmed') &&
  searchModalContent.includes('resultsCount: res.length'),
  '2.2: SearchModal dispatches trackSearchQuery on debounced search success'
);

assert(
  searchModalContent.includes('handleSearchSubmit') &&
  searchModalContent.includes('resultsCount: results.length'),
  '2.3: SearchModal dispatches trackSearchQuery in handleSearchSubmit on enter/submit'
);

// 2.2 CatalogContainer (active category change telemetry)
const catalogContainerPath = path.join(ROOT, 'components/catalog/catalog-container.tsx');
const catalogContainerContent = fs.readFileSync(catalogContainerPath, 'utf-8');

assert(
  catalogContainerContent.includes("import { trackCategoryView } from '@/lib/analytics'") ||
  catalogContainerContent.includes('import { trackCategoryView } from "@/lib/analytics"'),
  '2.4: CatalogContainer imports trackCategoryView from @/lib/analytics'
);

assert(
  catalogContainerContent.includes('trackCategoryView({') &&
  catalogContainerContent.includes('categoryId: matched.id') &&
  catalogContainerContent.includes('categoryName: matched.name'),
  '2.5: CatalogContainer dispatches trackCategoryView in useEffect reacting to active category'
);

// 2.3 ProductCard (quick WhatsApp order conversion telemetry)
const productCardPath = path.join(ROOT, 'components/product/product-card.tsx');
const productCardContent = fs.readFileSync(productCardPath, 'utf-8');

assert(
  productCardContent.includes("import { trackWhatsAppClick } from '@/lib/analytics'") ||
  productCardContent.includes('import { trackWhatsAppClick } from "@/lib/analytics"'),
  '2.6: ProductCard imports trackWhatsAppClick from @/lib/analytics'
);

assert(
  productCardContent.includes('trackWhatsAppClick({') &&
  productCardContent.includes("source: 'product_card_quick_order'"),
  '2.7: ProductCard dispatches trackWhatsAppClick on quick-order click with source=product_card_quick_order'
);

// 2.4 Forms (InquiryForm & ContactForm lead submission telemetry)
const inquiryFormPath = path.join(ROOT, 'components/forms/inquiry-form.tsx');
const inquiryFormContent = fs.readFileSync(inquiryFormPath, 'utf-8');

assert(
  inquiryFormContent.includes('trackLeadSubmission({') &&
  inquiryFormContent.includes("formName: 'InquiryForm'"),
  '2.8: InquiryForm dispatches trackLeadSubmission with formName=InquiryForm upon server action success'
);

const contactFormPath = path.join(ROOT, 'components/forms/contact-form.tsx');
const contactFormContent = fs.readFileSync(contactFormPath, 'utf-8');

assert(
  contactFormContent.includes('trackLeadSubmission({') &&
  contactFormContent.includes("formName: 'ContactForm'"),
  '2.9: ContactForm dispatches trackLeadSubmission with formName=ContactForm upon server action success'
);

// 2.5 ProductDetailView (PDP view & WhatsApp CTA telemetry)
const pdpViewPath = path.join(ROOT, 'components/product/product-detail-view.tsx');
const pdpViewContent = fs.readFileSync(pdpViewPath, 'utf-8');

assert(
  pdpViewContent.includes('trackProductView({') &&
  pdpViewContent.includes('productId: product.id'),
  '2.10: ProductDetailView dispatches trackProductView in useEffect'
);

assert(
  pdpViewContent.includes('trackWhatsAppClick({') &&
  pdpViewContent.includes("source: 'pdp_hero_cta'"),
  '2.11: ProductDetailView dispatches trackWhatsAppClick on hero CTA order button'
);

// ---------------------------------------------------------------------------
// SUITE 3: Dead Code & Types Pruning Verification
// ---------------------------------------------------------------------------
console.log(`\n${BOLD}--- SUITE 3: Dead Code & Types Pruning Verification (LOW-05, LOW-06) ---${RESET}`);

// 3.1 Constants Pruning (src/lib/constants.ts)
const constantsPath = path.join(ROOT, 'lib/constants.ts');
const constantsContent = fs.readFileSync(constantsPath, 'utf-8');

assert(
  !constantsContent.includes('STORE_PHONE_DISPLAY'),
  '3.1: STORE_PHONE_DISPLAY is pruned from src/lib/constants.ts'
);

assert(
  !constantsContent.includes('STORE_WHATSAPP_DISPLAY'),
  '3.2: STORE_WHATSAPP_DISPLAY is pruned from src/lib/constants.ts'
);

assert(
  !constantsContent.includes('isStoreOpenToday'),
  '3.3: isStoreOpenToday is pruned from src/lib/constants.ts'
);

// 3.2 Actions Type Pruning (src/types/actions.ts)
const actionsTypePath = path.join(ROOT, 'types/actions.ts');
const actionsTypeContent = fs.readFileSync(actionsTypePath, 'utf-8');

assert(
  !actionsTypeContent.includes('InquiryPayload'),
  '3.4: InquiryPayload is pruned from src/types/actions.ts'
);

assert(
  actionsTypeContent.includes('ActionResult') &&
  actionsTypeContent.includes('ActionSuccess') &&
  actionsTypeContent.includes('ActionError'),
  '3.5: Essential Server Action result envelopes remain intact in src/types/actions.ts'
);

// 3.3 Dead Barrel Deletion (src/types/index.ts)
const barrelPath = path.join(ROOT, 'types/index.ts');
const barrelExists = fs.existsSync(barrelPath);

assert(
  !barrelExists,
  '3.6: Dead barrel file src/types/index.ts is completely removed from filesystem'
);

// ---------------------------------------------------------------------------
// SUITE 4: Dead Code Scanner Upgrades Verification
// ---------------------------------------------------------------------------
console.log(`\n${BOLD}--- SUITE 4: Dead Code Scanner Upgrades Verification (LOW-10) ---${RESET}`);

const scannerPath = path.join(ROOT, 'scripts/check-dead-code.js');
const scannerContent = fs.readFileSync(scannerPath, 'utf-8');

assert(
  scannerContent.includes("f.includes(path.join('src', 'scripts'))") &&
  scannerContent.includes('prodFiles'),
  '4.1: Scanner isolates production files from test harness scripts (src/scripts)'
);

assert(
  scannerContent.includes("!f.includes(path.join('src', 'components', 'ui'))"),
  '4.2: Scanner whitelists standard Radix UI primitives in src/components/ui/ from component scans'
);

assert(
  scannerContent.includes('NEXTJS_SPECIAL_EXPORTS') &&
  scannerContent.includes('generateMetadata') &&
  scannerContent.includes('generateStaticParams'),
  '4.3: Scanner includes Next.js framework special exports filter'
);

// ---------------------------------------------------------------------------
// SUITE 5: Progress Tracker Synchronization Verification
// ---------------------------------------------------------------------------
console.log(`\n${BOLD}--- SUITE 5: Progress Tracker Synchronization Verification (INFO-01) ---${RESET}`);

const trackerPath = path.join(ROOT, '../context/progress-tracker.md');
const trackerContent = fs.readFileSync(trackerPath, 'utf-8');

assert(
  trackerContent.includes('Master Audit Remediation — Milestone 4') &&
  trackerContent.includes('MED-02') &&
  trackerContent.includes('LOW-05') &&
  trackerContent.includes('LOW-06') &&
  trackerContent.includes('LOW-10') &&
  trackerContent.includes('INFO-01'),
  '5.1: Progress tracker contains comprehensive Milestone 4 audit remediation documentation'
);

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}TOTAL TESTS:${RESET} ${passed + failed} | ${GREEN}${BOLD}PASSED:${RESET} ${passed} | ${failed > 0 ? `${RED}${BOLD}FAILED:${RESET} ${failed}` : `${GREEN}${BOLD}FAILED: 0${RESET}`}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

if (failed > 0) {
  process.exit(1);
}
