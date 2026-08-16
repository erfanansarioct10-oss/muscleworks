import * as fs from 'node:fs';
import * as path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';

// ANSI color formatting
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';

let passed = 0;
let failed = 0;
let total = 0;

async function test(name: string, fn: () => void | Promise<void>) {
  total++;
  try {
    const res = fn();
    if (res instanceof Promise) {
      await res;
    }
    passed++;
    console.log(`  ${GREEN}✅ [PASS]${RESET} ${name}`);
  } catch (err: unknown) {
    failed++;
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`  ${RED}❌ [FAIL]${RESET} ${name}`);
    console.error(`     ${RED}Details: ${msg}${RESET}`);
  }
}

const ROOT = path.resolve(__dirname, '..');

function getSourceFile(relPath: string): { fileContent: string; sourceFile: ts.SourceFile; fullPath: string } {
  const fullPath = path.join(ROOT, relPath);
  assert.ok(fs.existsSync(fullPath), `Target file does not exist: ${fullPath}`);
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    fullPath,
    fileContent,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  return { fileContent, sourceFile, fullPath };
}

/**
 * Traverses an AST tree and finds all JSX elements matching a tag name
 */
function findJsxElements(node: ts.Node, tagName: string): ts.JsxElement[] {
  const elements: ts.JsxElement[] = [];
  function visitor(n: ts.Node) {
    if (ts.isJsxElement(n)) {
      const openTag = n.openingElement;
      if (openTag.tagName.getText() === tagName) {
        elements.push(n);
      }
    }
    ts.forEachChild(n, visitor);
  }
  visitor(node);
  return elements;
}

/**
 * Traverses an AST tree and finds all JSX self-closing elements matching a tag name
 */
function findJsxSelfClosingElements(node: ts.Node, tagName: string): ts.JsxSelfClosingElement[] {
  const elements: ts.JsxSelfClosingElement[] = [];
  function visitor(n: ts.Node) {
    if (ts.isJsxSelfClosingElement(n)) {
      if (n.tagName.getText() === tagName) {
        elements.push(n);
      }
    }
    ts.forEachChild(n, visitor);
  }
  visitor(node);
  return elements;
}

async function runMilestone3Challenger1StressTests() {
  console.log(`${BOLD}${CYAN}========================================================================${RESET}`);
  console.log(`${BOLD}${CYAN}🥊 MUSCLEWORKS CHALLENGER 1: MILESTONE 3 ADVERSARIAL STRESS TEST SUITE${RESET}`);
  console.log(`${BOLD}${CYAN}   Focus: Touch Targets (≥44px/48px), ARIA Labels, Sheet A11y & Transitions${RESET}`);
  console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

  // =========================================================================
  // SUITE 1: AST & Semantic Analysis of All 7 Modified Milestone 3 Files
  // =========================================================================
  console.log(`${BOLD}--- SUITE 1: Touch Target Bounding Box Validation (≥44px / ≥48px) ---${RESET}`);

  await test('1.1: featured-products-section.tsx — WhatsApp Order CTA is unconditionally ≥48px with focus ring', () => {
    const { fileContent, sourceFile } = getSourceFile('components/home/featured-products-section.tsx');
    assert.ok(sourceFile, 'AST source file parsed successfully');

    // WhatsApp CTA must have min-h-[48px] and must NOT have responsive downgrade on mobile (<640px)
    assert.ok(
      fileContent.includes('min-h-[48px]'),
      'Must contain min-h-[48px] class on CTA'
    );
    assert.ok(
      !fileContent.includes('min-h-[44px] sm:min-h-[48px]'),
      'Must NOT restrict 48px to sm: breakpoint; must be ≥48px on mobile base classes'
    );
    assert.ok(
      fileContent.includes('focus-visible:ring-2') && fileContent.includes('focus-visible:outline-none'),
      'Must define explicit focus-visible keyboard ring styling'
    );
    assert.ok(
      fileContent.includes('aria-label={`Order ${banner.title} via WhatsApp`}'),
      'WhatsApp CTA must have explicit accessible name (aria-label)'
    );
  });

  await test('1.2: footer.tsx — Legal links, social buttons, and store contacts satisfy touch bounds', () => {
    const { fileContent } = getSourceFile('components/layout/footer.tsx');

    // Legal links touch target (WCAG 2.1 SC 2.5.8 >= 44px)
    assert.ok(
      fileContent.includes('min-h-[44px]') && fileContent.includes('LEGAL_LINKS.map'),
      'Legal and policy links must maintain min-h-[44px] touch bounding box'
    );

    // Social icon links
    assert.ok(
      fileContent.includes('min-h-11 min-w-11') || fileContent.includes('min-h-[44px] min-w-[44px]'),
      'Social channel buttons must maintain min 44x44px touch targets'
    );

    // Category navigation links
    assert.ok(
      fileContent.includes('min-h-11') && fileContent.includes('SUPPLEMENT_CATEGORIES.map'),
      'Category navigation links must maintain min-h-11 (44px) touch target'
    );

    // Direct phone link
    assert.ok(
      fileContent.includes('min-h-12') && fileContent.includes('STORE_PHONE_RAW'),
      'Direct phone call link must maintain min-h-12 (48px) conversion touch target'
    );

    // Keyboard focus rings on all interactive links
    assert.ok(
      fileContent.includes('focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'),
      'All footer interactive links must enforce focus-visible:ring-2'
    );

    // Decorative icons have aria-hidden
    assert.ok(
      fileContent.includes('<ChevronRight') && fileContent.includes('aria-hidden="true"'),
      'ChevronRight decorative icons must specify aria-hidden="true"'
    );
  });

  await test('1.3: mobile-nav.tsx — Hamburger trigger, links, and conversion CTAs meet touch targets', () => {
    const { fileContent } = getSourceFile('components/layout/mobile-nav.tsx');

    // Hamburger trigger
    assert.ok(
      fileContent.includes('min-h-[44px] min-w-[44px]') || fileContent.includes('h-11 w-11 min-h-[44px]'),
      'Hamburger button must enforce min 44x44px touch bounding box'
    );

    // Category navigation items
    assert.ok(
      fileContent.includes('min-h-[44px]') && fileContent.includes('CATEGORY_ITEMS.map'),
      'Category drawer links must maintain min-h-[44px]'
    );

    // Trust navigation items
    assert.ok(
      fileContent.includes('min-h-[44px]') && fileContent.includes('TRUST_NAV_ITEMS.map'),
      'Trust & store navigation links must maintain min-h-[44px]'
    );

    // Primary WhatsApp conversion button (48px)
    assert.ok(
      fileContent.includes('variant="whatsapp"') &&
      fileContent.includes('size="lg"') &&
      fileContent.includes('min-h-[48px]'),
      'WhatsApp drawer CTA must specify size="lg" and min-h-[48px]'
    );

    // Call store phone conversion button (48px)
    assert.ok(
      fileContent.includes('size="lg"') &&
      fileContent.includes('min-h-[48px]') &&
      fileContent.includes('STORE_PHONE_RAW'),
      'Phone call drawer CTA must specify size="lg" and min-h-[48px]'
    );
  });

  await test('1.4: brand-filter.tsx — Clear button and brand checkbox rows satisfy ≥44px touch targets', () => {
    const { fileContent } = getSourceFile('components/catalog/brand-filter.tsx');

    // Clear search button
    assert.ok(
      fileContent.includes('min-h-11 min-w-11') && fileContent.includes('Clear brand search'),
      'Clear brand search button must enforce min 44x44px touch target'
    );

    // Checkbox item labels
    assert.ok(
      fileContent.includes('min-h-11') && fileContent.includes('touch-manipulation'),
      'Brand checkbox label container must enforce min-h-11 (44px) and touch-manipulation'
    );
  });

  await test('1.5: catalog-filters.tsx — Preset price pills, facet labels & inputs meet ≥44px touch targets', () => {
    const { fileContent } = getSourceFile('components/catalog/catalog-filters.tsx');

    // Preset price range pills
    assert.ok(
      fileContent.includes('min-h-11') && fileContent.includes('PRESET_PRICE_RANGES.map'),
      'Preset price buttons must enforce min-h-11 (44px)'
    );

    // Category and goal checkbox labels
    assert.ok(
      fileContent.includes('min-h-11') && fileContent.includes('touch-manipulation'),
      'Facet checkbox rows must enforce min-h-11 and touch-manipulation'
    );

    // Apply price range submit button
    assert.ok(
      fileContent.includes('min-h-11') && fileContent.includes('Apply Price Range'),
      'Apply Price Range button must enforce min-h-11'
    );
  });

  await test('1.6: mobile-filter-drawer.tsx — Filter trigger, options & sticky CTA satisfy touch targets', () => {
    const { fileContent } = getSourceFile('components/catalog/mobile-filter-drawer.tsx');

    // Filter catalog trigger button
    assert.ok(
      fileContent.includes('min-h-11') && fileContent.includes('Filter Catalog'),
      'Drawer trigger button must have min-h-11'
    );

    // Staged category and goal buttons
    assert.ok(
      fileContent.includes('min-h-11') && fileContent.includes('handleToggleStagedCategory'),
      'Staged category buttons must have min-h-11'
    );

    // Price preset buttons
    assert.ok(
      fileContent.includes('min-h-11') && fileContent.includes('PRESET_PRICE_RANGES.map'),
      'Staged price preset buttons must have min-h-11'
    );

    // Sticky apply CTA (≥48px)
    assert.ok(
      fileContent.includes('min-h-12') && fileContent.includes('Apply Filters'),
      'Sticky Apply Filters button in drawer must enforce min-h-12 (48px)'
    );
  });

  await test('1.7: search-modal.tsx — Clear buttons, search chips, and category cards satisfy ≥44px', () => {
    const { fileContent } = getSourceFile('components/catalog/search-modal.tsx');

    // Clear query button
    assert.ok(
      fileContent.includes('min-h-[44px] min-w-[44px]') && fileContent.includes('Clear search query'),
      'Clear query button must have min 44x44px touch target'
    );

    // Clear history button
    assert.ok(
      fileContent.includes('min-h-[44px] min-w-[44px]') && fileContent.includes('Clear search history'),
      'Clear search history button must have min 44x44px touch target'
    );

    // Recent search history pills
    assert.ok(
      fileContent.includes('min-h-[44px] min-w-[44px]') && fileContent.includes('recentSearches.map'),
      'Recent search chip buttons must have min 44x44px'
    );

    // Popular category links
    assert.ok(
      fileContent.includes('min-h-[44px] min-w-[44px]') && fileContent.includes('POPULAR_CATEGORIES.map'),
      'Popular category links must have min 44x44px'
    );
  });

  // =========================================================================
  // SUITE 2: ARIA Labels & Accessible Names AST Analysis
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 2: ARIA Labels & Accessible Names AST Verification ---${RESET}`);

  await test('2.1: brand-filter.tsx — All <input> and <Input> elements possess explicit aria-label attributes', () => {
    const { sourceFile } = getSourceFile('components/catalog/brand-filter.tsx');
    const selfClosingInputs = findJsxSelfClosingElements(sourceFile, 'input').concat(
      findJsxSelfClosingElements(sourceFile, 'Input')
    );
    const standardInputs = findJsxElements(sourceFile, 'input').concat(
      findJsxElements(sourceFile, 'Input')
    );
    const allInputNodes = [...selfClosingInputs, ...standardInputs];

    assert.ok(allInputNodes.length >= 2, `Expected at least 2 input elements in brand-filter, found ${allInputNodes.length}`);

    for (const node of allInputNodes) {
      const attributes = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
      const ariaLabelAttr = attributes.properties.find(
        (p) => p.name?.getText() === 'aria-label'
      );
      assert.ok(
        ariaLabelAttr !== undefined,
        `Input in brand-filter.tsx at line ${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1} is missing an aria-label attribute`
      );
    }
  });

  await test('2.2: catalog-filters.tsx — All <input> and <Input> elements possess explicit aria-label attributes', () => {
    const { sourceFile } = getSourceFile('components/catalog/catalog-filters.tsx');
    const selfClosingInputs = findJsxSelfClosingElements(sourceFile, 'input').concat(
      findJsxSelfClosingElements(sourceFile, 'Input')
    );
    const standardInputs = findJsxElements(sourceFile, 'input').concat(
      findJsxElements(sourceFile, 'Input')
    );
    const allInputNodes = [...selfClosingInputs, ...standardInputs];

    assert.ok(allInputNodes.length >= 5, `Expected at least 5 input elements in catalog-filters, found ${allInputNodes.length}`);

    for (const node of allInputNodes) {
      const attributes = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
      const ariaLabelAttr = attributes.properties.find(
        (p) => p.name?.getText() === 'aria-label'
      );
      assert.ok(
        ariaLabelAttr !== undefined,
        `Input in catalog-filters.tsx at line ${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1} is missing an aria-label attribute`
      );
    }
  });

  await test('2.3: mobile-filter-drawer.tsx — All <input> and <Input> elements possess explicit aria-label attributes', () => {
    const { sourceFile } = getSourceFile('components/catalog/mobile-filter-drawer.tsx');
    const selfClosingInputs = findJsxSelfClosingElements(sourceFile, 'input').concat(
      findJsxSelfClosingElements(sourceFile, 'Input')
    );
    const standardInputs = findJsxElements(sourceFile, 'input').concat(
      findJsxElements(sourceFile, 'Input')
    );
    const allInputNodes = [...selfClosingInputs, ...standardInputs];

    assert.ok(allInputNodes.length >= 2, `Expected at least 2 input elements in mobile-filter-drawer, found ${allInputNodes.length}`);

    for (const node of allInputNodes) {
      const attributes = ts.isJsxElement(node) ? node.openingElement.attributes : node.attributes;
      const ariaLabelAttr = attributes.properties.find(
        (p) => p.name?.getText() === 'aria-label'
      );
      assert.ok(
        ariaLabelAttr !== undefined,
        `Input in mobile-filter-drawer.tsx at line ${sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1} is missing an aria-label attribute`
      );
    }
  });

  await test('2.4: search-modal.tsx — Search input includes role="searchbox" and accessible aria attributes', () => {
    const { sourceFile } = getSourceFile('components/catalog/search-modal.tsx');
    const selfClosingInputs = findJsxSelfClosingElements(sourceFile, 'input');
    const standardInputs = findJsxElements(sourceFile, 'input');
    const allInputs = [...selfClosingInputs, ...standardInputs];

    assert.ok(allInputs.length >= 1, 'Search modal must contain an input element');
    const searchInput = allInputs[0];
    const attributes = ts.isJsxElement(searchInput) ? searchInput.openingElement.attributes : searchInput.attributes;

    const ariaLabel = attributes.properties.find((p) => p.name?.getText() === 'aria-label');
    const roleAttr = attributes.properties.find((p) => p.name?.getText() === 'role');
    const ariaAutocomplete = attributes.properties.find((p) => p.name?.getText() === 'aria-autocomplete');
    const ariaControls = attributes.properties.find((p) => p.name?.getText() === 'aria-controls');

    assert.ok(ariaLabel !== undefined, 'Search input must have aria-label');
    assert.ok(roleAttr?.getText().includes('searchbox'), 'Search input must have role="searchbox"');
    assert.ok(ariaAutocomplete?.getText().includes('list'), 'Search input must have aria-autocomplete="list"');
    assert.ok(ariaControls?.getText().includes('search-results-list'), 'Search input must have aria-controls="search-results-list"');

    // Disallow aria-expanded on searchbox per W3C / jsx-a11y rules
    const ariaExpanded = attributes.properties.find((p) => p.name?.getText() === 'aria-expanded');
    assert.equal(
      ariaExpanded,
      undefined,
      'aria-expanded must NOT be set on role="searchbox" (violates jsx-a11y/role-supports-aria-props)'
    );
  });

  // =========================================================================
  // SUITE 3: Sheet & Dialog Accessibility Landmarks
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 3: Sheet & Dialog Accessibility Landmarks ---${RESET}`);

  await test('3.1: mobile-nav.tsx — Defines SheetDescription with sr-only class for Radix Dialog landmark', () => {
    const { fileContent, sourceFile } = getSourceFile('components/layout/mobile-nav.tsx');

    // Import verification
    assert.ok(
      fileContent.includes('SheetDescription') && fileContent.includes('@/components/ui/sheet'),
      'Must import SheetDescription from ui/sheet'
    );

    // JSX element presence
    const sheetDescElements = findJsxElements(sourceFile, 'SheetDescription');
    assert.ok(
      sheetDescElements.length >= 1,
      'Must render <SheetDescription> inside SheetHeader'
    );

    const descNode = sheetDescElements[0];
    const classProp = descNode.openingElement.attributes.properties.find(
      (p) => p.name?.getText() === 'className'
    );
    assert.ok(
      classProp?.getText().includes('sr-only'),
      'SheetDescription must include className="sr-only"'
    );
  });

  await test('3.2: mobile-filter-drawer.tsx — Defines SheetDescription with sr-only class for Radix Dialog landmark', () => {
    const { fileContent, sourceFile } = getSourceFile('components/catalog/mobile-filter-drawer.tsx');

    assert.ok(
      fileContent.includes('SheetDescription') && fileContent.includes('@/components/ui/sheet'),
      'Must import SheetDescription from ui/sheet'
    );

    const sheetDescElements = findJsxElements(sourceFile, 'SheetDescription');
    assert.ok(
      sheetDescElements.length >= 1,
      'Must render <SheetDescription> inside SheetHeader'
    );

    const descNode = sheetDescElements[0];
    const classProp = descNode.openingElement.attributes.properties.find(
      (p) => p.name?.getText() === 'className'
    );
    assert.ok(
      classProp?.getText().includes('sr-only'),
      'SheetDescription must include className="sr-only"'
    );
  });

  await test('3.3: search-modal.tsx — Defines DialogDescription inside DialogHeader', () => {
    const { fileContent, sourceFile } = getSourceFile('components/catalog/search-modal.tsx');

    assert.ok(
      fileContent.includes('DialogDescription') && fileContent.includes('@/components/ui/dialog'),
      'Must import DialogDescription from ui/dialog'
    );

    const dialogDescElements = findJsxElements(sourceFile, 'DialogDescription');
    assert.ok(
      dialogDescElements.length >= 1,
      'Must render <DialogDescription> inside DialogHeader'
    );
  });

  // =========================================================================
  // SUITE 4: React 19 Concurrent Transitions & State Updates in search-modal.tsx
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 4: React 19 Concurrent Transitions in search-modal.tsx ---${RESET}`);

  await test('4.1: search-modal.tsx — Declares and uses React 19 useTransition hook', () => {
    const { fileContent } = getSourceFile('components/catalog/search-modal.tsx');
    assert.ok(
      fileContent.includes('React.useTransition()') || fileContent.includes('useTransition()'),
      'Must call useTransition to obtain startTransition'
    );
    assert.ok(
      fileContent.includes('startTransition'),
      'Must define startTransition identifier'
    );
  });

  await test('4.2: search-modal.tsx — All setResults state dispatches are wrapped in startTransition', () => {
    const { sourceFile } = getSourceFile('components/catalog/search-modal.tsx');

    // Find all call expressions to setResults
    const setResultsCalls: ts.CallExpression[] = [];
    function visitor(n: ts.Node) {
      if (ts.isCallExpression(n) && n.expression.getText() === 'setResults') {
        setResultsCalls.push(n);
      }
      ts.forEachChild(n, visitor);
    }
    visitor(sourceFile);

    assert.ok(
      setResultsCalls.length >= 3,
      `Expected at least 3 setResults call sites (empty, success, error), found ${setResultsCalls.length}`
    );

    // Verify every setResults call is inside a startTransition callback
    for (const call of setResultsCalls) {
      let current: ts.Node = call;
      let wrappedInTransition = false;
      while (current.parent) {
        current = current.parent;
        if (
          ts.isCallExpression(current) &&
          current.expression.getText() === 'startTransition'
        ) {
          wrappedInTransition = true;
          break;
        }
      }
      assert.ok(
        wrappedInTransition,
        `setResults call at line ${sourceFile.getLineAndCharacterOfPosition(call.getStart()).line + 1} is NOT wrapped in startTransition`
      );
    }
  });

  await test('4.3: search-modal.tsx — Uses onOpenAutoFocus without setTimeout race conditions', () => {
    const { fileContent } = getSourceFile('components/catalog/search-modal.tsx');
    assert.ok(
      fileContent.includes('onOpenAutoFocus='),
      'Must use Radix onOpenAutoFocus for input focus'
    );
    assert.ok(
      !fileContent.includes('focusTimerRef'),
      'Must NOT contain legacy focusTimerRef'
    );
  });

  // =========================================================================
  // SUITE 5: Extended Product Touch Targets (ProductCard, PDP Sticky Bar, Review Dots)
  // =========================================================================
  console.log(`\n${BOLD}--- SUITE 5: Extended Product & Review Interaction Touch Targets ---${RESET}`);

  await test('5.1: customer-reviews-section.tsx — Mobile pagination indicator buttons satisfy ≥44px touch targets', () => {
    const { fileContent } = getSourceFile('components/home/customer-reviews-section.tsx');
    assert.ok(
      fileContent.includes('min-h-[44px] min-w-[44px]'),
      'Review carousel indicator buttons must maintain min 44x44px touch targets'
    );
    assert.ok(
      fileContent.includes('aria-label={`Go to review ${i + 1}`}'),
      'Review pagination buttons must have descriptive aria-labels'
    );
  });

  await test('5.2: product-card.tsx — Quick WhatsApp order button satisfies ≥48px touch target', () => {
    const { fileContent } = getSourceFile('components/product/product-card.tsx');
    assert.ok(
      fileContent.includes('h-12 w-12 min-h-12 min-w-12') || fileContent.includes('min-h-12 min-w-12'),
      'Product card WhatsApp quick-order button must maintain 48x48px touch target'
    );
    assert.ok(
      fileContent.includes('aria-label={`Order ${product.name} via WhatsApp`}'),
      'Product card WhatsApp button must have descriptive aria-label'
    );
  });

  await test('5.3: product-sticky-bar.tsx — Mobile sticky bottom CTA satisfies ≥48px touch target', () => {
    const { fileContent } = getSourceFile('components/product/product-sticky-bar.tsx');
    assert.ok(
      fileContent.includes('min-h-12'),
      'Sticky bottom bar order CTA must maintain min-h-12 (48px)'
    );
  });

  console.log(`\n${BOLD}${CYAN}========================================================================${RESET}`);
  console.log(`${BOLD}🏁 CHALLENGER 1 SUMMARY: ${passed}/${total} TESTS PASSED CLEANLY (${((passed / total) * 100).toFixed(0)}%)${RESET}`);
  console.log(`${BOLD}${CYAN}========================================================================${RESET}\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runMilestone3Challenger1StressTests().catch((err) => {
  console.error('\n❌ TEST HARNESS CRASHED UNEXPECTEDLY:', err);
  process.exit(1);
});
