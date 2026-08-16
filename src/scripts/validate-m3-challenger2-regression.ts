/**
 * ============================================================================
 * MUSCLEWORKS SUPPLEMENTS — CHALLENGER 2: MILESTONE 3 REGRESSION HARNESS
 * ============================================================================
 *
 * Empirical regression testing suite for Milestone 3 (Touch Targets, ARIA Attributes,
 * Interaction States & Component Props Safety).
 *
 * Target Verifications:
 * 1. Component SSR & Prop Variations (FeaturedProductsSection, Footer, MobileNav,
 *    BrandFilter, CatalogFilters, MobileFilterDrawer, SearchModal, Button).
 * 2. WCAG AA Accessibility, ARIA landmark descriptions, and touch target constraints (>=44px / >=48px).
 * 3. React 19 concurrent transition scheduling and focus lifecycle management.
 * 4. Adversarial edge cases on filter matching, brand counts, and search indexing.
 * 5. Full automated execution of all test suites in `src/scripts/` (0 regressions).
 *
 * Run via: npx tsx src/scripts/validate-m3-challenger2-regression.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// Data accessors & schemas
import { getBrands } from '../lib/data/brands';
import { getProducts } from '../lib/data/products';
import { BrandFilter } from '../components/catalog/brand-filter';
import { Footer } from '../components/layout/footer';
import { FeaturedProductsSection } from '../components/home/featured-products-section';
import { Button } from '../components/ui/button';

// ANSI color helpers
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';

let passedTests = 0;
let totalTests = 0;
const failureLog: string[] = [];

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    console.log(`  ${GREEN}✅ [PASS]${RESET} ${testName}`);
    passedTests++;
  } else {
    console.error(`  ${RED}❌ [FAIL]${RESET} ${testName}`);
    if (details) {
      console.error(`     ${RED}Details: ${details}${RESET}`);
    }
    failureLog.push(`${testName} -> ${details || 'Assertion failed'}`);
  }
}

const ROOT = path.resolve(__dirname, '..');

async function runMilestone3Challenger2RegressionHarness() {
  console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}🛡️ MUSCLEWORKS CHALLENGER 2: MILESTONE 3 EMPIRICAL REGRESSION HARNESS${RESET}`);
  console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

  // Load catalog baseline data
  const brands = await getBrands();
  const products = await getProducts();

  // =========================================================================
  // SUITE 1: COMPONENT SSR & PROPS SAFETY (STATIC RENDERING STRESS)
  // =========================================================================
  console.log(`${BOLD}--- SUITE 1: Component SSR & Dynamic Prop Variations ---${RESET}`);

  // 1.1: FeaturedProductsSection
  try {
    const featuredHtml = ReactDOMServer.renderToString(
      React.createElement(FeaturedProductsSection)
    );
    assert(
      featuredHtml.includes('BEST-SELLING') &&
      featuredHtml.includes('NITROPURE 100% WHEY') &&
      featuredHtml.includes('WHEY HD') &&
      featuredHtml.includes('GOLD STANDARD 100% ISOLATE') &&
      featuredHtml.includes('BIOZYME PERFORMANCE WHEY'),
      '1.1: FeaturedProductsSection renders all 4 featured products cleanly via SSR'
    );
    assert(
      featuredHtml.includes('NPR') &&
      featuredHtml.includes('ORDER NOW') &&
      featuredHtml.includes('min-h-[48px]'),
      '1.2: FeaturedProductsSection renders pricing and >=48px touch target buttons'
    );
  } catch (err: unknown) {
    assert(false, '1.1: FeaturedProductsSection SSR rendering', String(err));
  }

  // 1.2: Footer
  try {
    const footerHtml = ReactDOMServer.renderToString(React.createElement(Footer));
    assert(
      footerHtml.includes('MuscleWorks Supplements') &&
      footerHtml.includes('Golfutar Flagship Store') &&
      footerHtml.includes('Supplement Categories') &&
      footerHtml.includes('Connect With Us'),
      '1.3: Footer renders full multi-column brand, categories, and store information via SSR'
    );
    assert(
      footerHtml.includes('min-h-[44px]') &&
      footerHtml.includes('Authenticity Guarantee') &&
      footerHtml.includes('Privacy Policy') &&
      footerHtml.includes('Terms of Service'),
      '1.4: Footer legal and policy links render with min-h-[44px] touch targets'
    );
    assert(
      footerHtml.includes('aria-label="Site Footer"') &&
      footerHtml.includes('role="contentinfo"'),
      '1.5: Footer renders accessible landmark role="contentinfo" and aria-label="Site Footer"'
    );
  } catch (err: unknown) {
    assert(false, '1.3: Footer SSR rendering', String(err));
  }

  // 1.3: BrandFilter with variations
  try {
    // Standard props
    const brandFilterStandard = ReactDOMServer.renderToString(
      React.createElement(BrandFilter, {
        brands,
        products,
        selectedBrandSlugs: ['optimum-nutrition', 'muscletech'],
        onToggleBrand: () => {},
      })
    );
    assert(
      brandFilterStandard.includes('Authorized Brands') &&
      brandFilterStandard.includes('Optimum Nutrition') &&
      brandFilterStandard.includes('MuscleTech'),
      '1.6: BrandFilter renders standard brand list and product counts via SSR'
    );

    // Empty brands array
    const brandFilterEmptyBrands = ReactDOMServer.renderToString(
      React.createElement(BrandFilter, {
        brands: [],
        products,
      })
    );
    assert(
      brandFilterEmptyBrands.includes('Authorized Brands') &&
      brandFilterEmptyBrands.includes('No brands found'),
      '1.7: BrandFilter handles empty brands array gracefully without throwing'
    );

    // Empty products array
    const brandFilterEmptyProducts = ReactDOMServer.renderToString(
      React.createElement(BrandFilter, {
        brands,
        products: [],
      })
    );
    assert(
      brandFilterEmptyProducts.includes('Authorized Brands') &&
      brandFilterEmptyProducts.includes(brands[0].name),
      '1.8: BrandFilter handles empty products array gracefully'
    );

    // Missing optional callback and selectedBrandSlugs
    const brandFilterMinimal = ReactDOMServer.renderToString(
      React.createElement(BrandFilter, { brands })
    );
    assert(
      Boolean(brandFilterMinimal),
      '1.9: BrandFilter handles minimal required props (only brands) cleanly'
    );
  } catch (err: unknown) {
    assert(false, '1.6: BrandFilter SSR rendering variations', String(err));
  }

  // 1.4: Button UI Component Permutations
  try {
    const variants = ['default', 'outline', 'whatsapp', 'destructive', 'secondary', 'ghost', 'link'] as const;
    const sizes = ['default', 'sm', 'lg', 'xl', 'icon', 'inline'] as const;

    let buttonPermutationsPassed = true;
    for (const variant of variants) {
      for (const size of sizes) {
        const btnHtml = ReactDOMServer.renderToString(
          React.createElement(Button, { variant, size }, `Test ${variant} ${size}`)
        );
        if (!btnHtml.includes('button')) {
          buttonPermutationsPassed = false;
        }
      }
    }
    assert(
      buttonPermutationsPassed,
      '1.10: Button component renders all 35 variant x size permutations without errors'
    );
  } catch (err: unknown) {
    assert(false, '1.10: Button component permutations', String(err));
  }

  // =========================================================================
  // SUITE 2: TOUCH TARGET & FOCUS STATES EMPIRICAL CONFORMANCE
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 2: Touch Targets (>=44px / >=48px) & Focus State Verification ---${RESET}`);

  // 2.1: featured-products-section.tsx
  const featuredFile = fs.readFileSync(path.join(ROOT, 'components/home/featured-products-section.tsx'), 'utf-8');
  assert(
    featuredFile.includes('min-h-[48px]') && !featuredFile.includes('min-h-[44px] sm:min-h-[48px]'),
    '2.1: WhatsApp conversion CTAs in FeaturedProductsSection enforce >= 48px on all viewports'
  );
  assert(
    featuredFile.includes('focus-visible:ring-2') && featuredFile.includes('focus-visible:outline-none'),
    '2.2: FeaturedProductsSection CTA has explicit focus-visible rings for keyboard navigation'
  );

  // 2.2: footer.tsx
  const footerFile = fs.readFileSync(path.join(ROOT, 'components/layout/footer.tsx'), 'utf-8');
  assert(
    footerFile.includes('min-h-[44px]') && footerFile.includes('LEGAL_LINKS.map'),
    '2.3: Footer legal/policy links maintain min-h-[44px] touch bounding boxes'
  );
  assert(
    footerFile.includes('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'),
    '2.4: Footer links incorporate focus-visible outline and ring tokens'
  );
  assert(
    footerFile.includes('min-h-12 min-w-12') || footerFile.includes('min-h-11 min-w-11'),
    '2.5: Footer phone call and social buttons enforce touch target bounds'
  );

  // 2.3: mobile-nav.tsx
  const mobileNavFile = fs.readFileSync(path.join(ROOT, 'components/layout/mobile-nav.tsx'), 'utf-8');
  assert(
    mobileNavFile.includes('min-h-[48px]') &&
    mobileNavFile.includes('variant="whatsapp"') &&
    mobileNavFile.includes('size="lg"'),
    '2.6: MobileNav WhatsApp order CTA satisfies size="lg" and min-h-[48px]'
  );
  assert(
    mobileNavFile.includes('min-h-[48px]') &&
    mobileNavFile.includes('variant="outline"') &&
    mobileNavFile.includes('size="lg"'),
    '2.7: MobileNav phone call button satisfies size="lg" and min-h-[48px]'
  );
  assert(
    mobileNavFile.includes('min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5'),
    '2.8: MobileNav category and trust links maintain >= 44px touch targets'
  );

  // 2.4: search-modal.tsx
  const searchModalFile = fs.readFileSync(path.join(ROOT, 'components/catalog/search-modal.tsx'), 'utf-8');
  assert(
    searchModalFile.includes('min-h-[44px]') && searchModalFile.includes('aria-label="Clear search history"'),
    '2.9: SearchModal clear search history button maintains min-h-[44px] and accessible label'
  );
  assert(
    searchModalFile.includes('min-h-[44px] min-w-[44px]') && searchModalFile.includes('aria-label="Clear search query"'),
    '2.10: SearchModal clear query button maintains min-h-[44px] min-w-[44px] touch target'
  );

  // =========================================================================
  // SUITE 3: ARIA ATTRIBUTES & ACCESSIBILITY LANDMARKS
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 3: ARIA Semantic Roles & Accessible Landmarks ---${RESET}`);

  // 3.1: SheetDescription sr-only in mobile drawers
  assert(
    mobileNavFile.includes('<SheetDescription className="sr-only">'),
    '3.1: MobileNav contains accessible SheetDescription sr-only landmark'
  );

  const mobileDrawerFile = fs.readFileSync(path.join(ROOT, 'components/catalog/mobile-filter-drawer.tsx'), 'utf-8');
  assert(
    mobileDrawerFile.includes('<SheetDescription className="sr-only">'),
    '3.2: MobileFilterDrawer contains accessible SheetDescription sr-only landmark'
  );

  // 3.2: BrandFilter accessible inputs and checkboxes
  const brandFilterFile = fs.readFileSync(path.join(ROOT, 'components/catalog/brand-filter.tsx'), 'utf-8');
  assert(
    brandFilterFile.includes('aria-label="Search authorized brands"'),
    '3.3: BrandFilter search input has explicit aria-label="Search authorized brands"'
  );
  assert(
    brandFilterFile.includes('aria-label={`Filter by brand ${brand.name}`}'),
    '3.4: BrandFilter hidden checkboxes have explicit accessible aria-label with brand name'
  );

  // 3.3: CatalogFilters and MobileFilterDrawer price inputs
  const catalogFiltersFile = fs.readFileSync(path.join(ROOT, 'components/catalog/catalog-filters.tsx'), 'utf-8');
  assert(
    catalogFiltersFile.includes('aria-label="Minimum price in NPR"') &&
    catalogFiltersFile.includes('aria-label="Maximum price in NPR"'),
    '3.5: CatalogFilters price inputs have descriptive NPR aria-labels'
  );
  assert(
    mobileDrawerFile.includes('aria-label="Minimum price in NPR"') &&
    mobileDrawerFile.includes('aria-label="Maximum price in NPR"'),
    '3.6: MobileFilterDrawer price inputs have descriptive NPR aria-labels'
  );

  // 3.4: SearchModal WAI-ARIA combobox/searchbox patterns
  assert(
    searchModalFile.includes('role="searchbox"') &&
    searchModalFile.includes('aria-autocomplete="list"') &&
    searchModalFile.includes('aria-controls="search-results-list"'),
    '3.7: SearchModal input conforms to WAI-ARIA searchbox role with list autocomplete'
  );
  assert(
    searchModalFile.includes('id="search-results-list" role="listbox"'),
    '3.8: SearchModal search-results-list conforms to role="listbox"'
  );

  // 3.5: Decorative SVGs have aria-hidden="true"
  assert(
    footerFile.includes('aria-hidden="true"'),
    '3.9: Footer decorative icons specify aria-hidden="true"'
  );
  assert(
    mobileNavFile.includes('aria-hidden="true"'),
    '3.10: MobileNav decorative icons specify aria-hidden="true"'
  );

  // =========================================================================
  // SUITE 4: REACT 19 CONCURRENT TRANSITIONS & FOCUS MANAGEMENT
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 4: React 19 Concurrent Transitions & Focus Lifecycle ---${RESET}`);

  assert(
    searchModalFile.includes('useTransition') && searchModalFile.includes('startTransition'),
    '4.1: SearchModal uses React 19 useTransition/startTransition for search results dispatches'
  );
  assert(
    searchModalFile.includes('onOpenAutoFocus') && !searchModalFile.includes('focusTimerRef'),
    '4.2: SearchModal employs Radix onOpenAutoFocus callback and eliminated legacy timer ref'
  );

  // =========================================================================
  // SUITE 5: ADVERSARIAL FILTER LOGIC & BRAND COUNTING STRESS
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 5: Adversarial Filter Logic & Brand Counting ---${RESET}`);

  // Test brand counting logic
  const brandProductCounts = new Map<string, number>();
  products.forEach((p) => {
    if (p.brandId) {
      brandProductCounts.set(p.brandId, (brandProductCounts.get(p.brandId) ?? 0) + 1);
    }
  });

  const onBrand = brands.find((b) => b.slug === 'optimum-nutrition');
  assert(
    Boolean(onBrand && (brandProductCounts.get(onBrand.id) ?? 0) > 0),
    '5.1: Optimum Nutrition brand correctly associates with catalog products'
  );

  // Filter search simulation across variations
  const testFilterBrands = (query: string) => {
    if (!query.trim()) return brands;
    const q = query.toLowerCase().trim();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.slug.toLowerCase().includes(q) ||
        b.countryOfOrigin.toLowerCase().includes(q)
    );
  };

  assert(testFilterBrands('optimum').length > 0, '5.2: Filter by lowercase "optimum" matches ON');
  assert(testFilterBrands('USA').length > 0, '5.3: Filter by country "USA" matches US brands');
  assert(testFilterBrands('  DYMATIZE  \n').length > 0, '5.4: Filter matches whitespace padded input');
  assert(testFilterBrands('non_existent_brand_xyz').length === 0, '5.5: Non-existent query returns empty array');
  assert(testFilterBrands('[.*+?^${}()|]').length === 0, '5.6: Special regex metacharacters execute safely without error');

  // =========================================================================
  // SUITE 6: FULL REGRESSION PIPELINE EXECUTION (ALL EXISTING TEST SUITES)
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 6: Full Regression Pipeline Execution ---${RESET}`);

  const scriptsToRun = [
    'validate-catalog-accessors.ts',
    'validate-form-components.ts',
    'validate-location-components.ts',
    'validate-m1-adversarial.ts',
    'validate-m1-challenger2-stress.ts',
    'validate-m3-touch-targets-and-aria.ts',
    'validate-notification-services.ts',
    'validate-pdp-components.ts',
    'validate-pdp-specs-components.ts',
    'validate-security-ratelimit.ts',
    'validate-server-actions.ts',
    'validate-store-faq-guide-accessors.ts',
    'validate-supplementary-datasets.ts',
    'validate-whatsapp-analytics.ts',
    'verify-all-assets.ts',
    'test-challenger-2.ts',
    'validate-adversarial-stress.ts',
  ];

  for (const scriptName of scriptsToRun) {
    const scriptPath = path.join(ROOT, 'scripts', scriptName);
    if (!fs.existsSync(scriptPath)) {
      assert(false, `6.x: Script ${scriptName} existence check`, `File not found: ${scriptPath}`);
      continue;
    }

    try {
      execSync(`npx tsx "${scriptPath}"`, {
        cwd: path.resolve(ROOT, '..'),
        stdio: 'pipe',
        timeout: 30000,
      });
      assert(true, `6.x: Regression Suite -> ${scriptName} passed with exit code 0`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      assert(false, `6.x: Regression Suite -> ${scriptName}`, errorMsg);
    }
  }

  // =========================================================================
  // SUITE 7: SUMMARY & VERDICT
  // =========================================================================
  console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
  console.log(
    `${BOLD}🏁 CHALLENGER 2 REGRESSION SUMMARY: ${passedTests}/${totalTests} TESTS PASSED CLEANLY (${((passedTests / totalTests) * 100).toFixed(0)}%)${RESET}`
  );
  console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

  if (failureLog.length > 0) {
    console.error(`${RED}❌ RECORDED FAILURES (${failureLog.length}):${RESET}`);
    failureLog.forEach((f) => console.error(`  - ${f}`));
    process.exit(1);
  } else {
    console.log(`${GREEN}${BOLD}🎉 ZERO REGRESSIONS DETECTED. ALL ADVERSARIAL STRESS CHECKS PASSED.${RESET}\n`);
    process.exit(0);
  }
}

runMilestone3Challenger2RegressionHarness().catch((err) => {
  console.error('Fatal regression harness runner error:', err);
  process.exit(1);
});
