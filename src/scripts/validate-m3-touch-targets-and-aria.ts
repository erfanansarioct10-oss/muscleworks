import * as fs from 'node:fs';
import * as path from 'node:path';

// ANSI color codes
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
console.log(`${BOLD}${CYAN}♿ MUSCLEWORKS MILESTONE 3: TOUCH TARGETS & ARIA VALIDATION HARNESS${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

// 1. featured-products-section.tsx
console.log(`${BOLD}--- SUITE 1: FeaturedProductsSection (Touch Targets & Focus Rings) ---${RESET}`);
const featuredPath = path.join(ROOT, 'components/home/featured-products-section.tsx');
const featuredContent = fs.readFileSync(featuredPath, 'utf-8');

assert(
  featuredContent.includes('min-h-[48px]') && !featuredContent.includes('min-h-[44px] sm:min-h-[48px]'),
  '1.1: WhatsApp CTA in featured-products-section maintains >= 48px touch target on all viewports',
  'Found min-h-[44px] or missing min-h-[48px]'
);

assert(
  featuredContent.includes('focus-visible:ring-2') && featuredContent.includes('focus-visible:outline-none'),
  '1.2: WhatsApp CTA in featured-products-section has accessible focus-visible ring styles'
);

// 2. footer.tsx
console.log(`\n${BOLD}--- SUITE 2: Footer (Legal Touch Targets, Focus Rings & SVG A11y) ---${RESET}`);
const footerPath = path.join(ROOT, 'components/layout/footer.tsx');
const footerContent = fs.readFileSync(footerPath, 'utf-8');

assert(
  footerContent.includes('min-h-[44px]') && footerContent.includes('LEGAL_LINKS.map'),
  '2.1: Footer legal/policy links maintain >= 44px touch targets (min-h-[44px])'
);

assert(
  footerContent.includes('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'),
  '2.2: Footer links include focus-visible:ring-2 keyboard navigation outlines'
);

assert(
  footerContent.includes('<ChevronRight') && footerContent.includes('aria-hidden="true"'),
  '2.3: Decorative icons in Footer have explicit aria-hidden="true"'
);

// 3. mobile-nav.tsx
console.log(`\n${BOLD}--- SUITE 3: MobileNav (Sheet Accessibility, CTA Sizes, Touch Targets) ---${RESET}`);
const mobileNavPath = path.join(ROOT, 'components/layout/mobile-nav.tsx');
const mobileNavContent = fs.readFileSync(mobileNavPath, 'utf-8');

assert(
  mobileNavContent.includes('SheetDescription') && mobileNavContent.includes('<SheetDescription className="sr-only">'),
  '3.1: MobileNav defines accessible SheetDescription sr-only'
);

assert(
  mobileNavContent.includes('variant="outline"') && mobileNavContent.includes('size="lg"') && mobileNavContent.includes('min-h-[48px]'),
  '3.2: MobileNav phone call button upgraded to size="lg" with min-h-[48px]'
);

assert(
  mobileNavContent.includes('variant="whatsapp"') && mobileNavContent.includes('size="lg"') && mobileNavContent.includes('min-h-[48px]'),
  '3.3: MobileNav WhatsApp order button has size="lg" with min-h-[48px]'
);

assert(
  mobileNavContent.includes('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'),
  '3.4: MobileNav navigation links and trigger have focus-visible keyboard rings'
);

assert(
  mobileNavContent.includes('<Menu className="h-5 w-5" aria-hidden="true" />') &&
  mobileNavContent.includes('<Phone className="h-4 w-4 text-foreground" aria-hidden="true" />'),
  '3.5: MobileNav icons have explicit aria-hidden="true"'
);

// 4. brand-filter.tsx
console.log(`\n${BOLD}--- SUITE 4: BrandFilter (Accessible Inputs & Checkbox Labels) ---${RESET}`);
const brandFilterPath = path.join(ROOT, 'components/catalog/brand-filter.tsx');
const brandFilterContent = fs.readFileSync(brandFilterPath, 'utf-8');

assert(
  brandFilterContent.includes('aria-label="Search authorized brands"'),
  '4.1: Brand search input contains explicit aria-label="Search authorized brands"'
);

assert(
  brandFilterContent.includes('aria-label={`Filter by brand ${brand.name}`}') ||
  brandFilterContent.includes('aria-label={`Filter by brand ${brand.name}'),
  '4.2: Brand hidden sr-only checkboxes contain explicit aria-label for screen readers'
);

// 5. catalog-filters.tsx
console.log(`\n${BOLD}--- SUITE 5: CatalogFilters (Price Input Accessible Names) ---${RESET}`);
const catalogFiltersPath = path.join(ROOT, 'components/catalog/catalog-filters.tsx');
const catalogFiltersContent = fs.readFileSync(catalogFiltersPath, 'utf-8');

assert(
  catalogFiltersContent.includes('aria-label="Minimum price in NPR"') &&
  catalogFiltersContent.includes('aria-label="Maximum price in NPR"'),
  '5.1: Numeric Min/Max price inputs contain explicit NPR aria-labels'
);

// 6. mobile-filter-drawer.tsx
console.log(`\n${BOLD}--- SUITE 6: MobileFilterDrawer (SheetDescription & Staged Price ARIA) ---${RESET}`);
const mobileFilterDrawerPath = path.join(ROOT, 'components/catalog/mobile-filter-drawer.tsx');
const mobileFilterDrawerContent = fs.readFileSync(mobileFilterDrawerPath, 'utf-8');

assert(
  mobileFilterDrawerContent.includes('SheetDescription') &&
  mobileFilterDrawerContent.includes('<SheetDescription className="sr-only">'),
  '6.1: MobileFilterDrawer contains accessible SheetDescription sr-only'
);

assert(
  mobileFilterDrawerContent.includes('aria-label="Minimum price in NPR"') &&
  mobileFilterDrawerContent.includes('aria-label="Maximum price in NPR"'),
  '6.2: Staged Min/Max price inputs in drawer contain explicit NPR aria-labels'
);

// 7. search-modal.tsx
console.log(`\n${BOLD}--- SUITE 7: SearchModal (Clear Button Touch Target, Transitions & A11y) ---${RESET}`);
const searchModalPath = path.join(ROOT, 'components/catalog/search-modal.tsx');
const searchModalContent = fs.readFileSync(searchModalPath, 'utf-8');

assert(
  searchModalContent.includes('min-h-[44px]') && searchModalContent.includes('aria-label="Clear search history"'),
  '7.1: Clear search history button has min-h-[44px] and aria-label="Clear search history"'
);

assert(
  searchModalContent.includes('useTransition') && searchModalContent.includes('startTransition'),
  '7.2: SearchModal wraps search query state updates in React 19 startTransition'
);

assert(
  searchModalContent.includes('onOpenAutoFocus') && !searchModalContent.includes('focusTimerRef'),
  '7.3: SearchModal uses native onOpenAutoFocus instead of manual timer delay'
);

assert(
  searchModalContent.includes('role="searchbox"') && searchModalContent.includes('id="search-results-list" role="listbox"'),
  '7.4: SearchModal searchbox and results listbox adhere to WAI-ARIA combobox/searchbox patterns'
);

console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
console.log(`${BOLD}🏁 SUMMARY: ${passed}/${passed + failed} TESTS PASSED CLEANLY (${((passed / (passed + failed)) * 100).toFixed(0)}%)${RESET}`);
console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
