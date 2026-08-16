# Milestone 3 Investigation Report: Touch Targets, ARIA Attributes & Dialog Accessibility (Catalog & Filter Components)

**Explorer ID:** Explorer 2 (`explorer_m3_2`)  
**Mission:** Forensic investigation of hidden filter inputs, filter button touch targets ($\ge 44\text{px}$ standard, $\ge 48\text{px}$ conversion CTAs), and dialog/drawer accessibility across catalog and filter components.  
**Investigated Components:**
1. `src/components/catalog/brand-filter.tsx`
2. `src/components/catalog/catalog-filters.tsx`
3. `src/components/catalog/mobile-filter-drawer.tsx`
4. `src/components/catalog/search-modal.tsx` & `src/components/catalog/search-bar.tsx`
5. `src/components/catalog/catalog-container.tsx`, `active-filters.tsx`, `category-chips.tsx`, `sort-select.tsx`
6. `src/components/ui/sheet.tsx`, `src/components/ui/dialog.tsx`, `src/components/layout/mobile-nav.tsx`

---

## 1. Observation

Direct observations and verbatim code references from source files:

### 1.1 `src/components/catalog/brand-filter.tsx`
- **Line 74–80 (Brand Search Input):**
  ```tsx
  <Input
    type="text"
    placeholder="Search brand..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="h-9 pl-8 pr-8 text-xs bg-neutral-50 border-neutral-200 focus-visible:ring-primary"
  />
  ```
  *Observation:* Contains `placeholder="Search brand..."` but lacks an explicit `aria-label="Search brands"`.
- **Line 82–90 (Clear Brand Search Button):**
  ```tsx
  <button
    type="button"
    onClick={() => setSearchQuery('')}
    className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 min-h-11 min-w-11 items-center justify-center text-neutral-400 hover:text-neutral-700"
    aria-label="Clear brand search"
  >
    <X className="h-3 w-3" />
  </button>
  ```
  *Observation:* Fully compliant with $\ge 44\text{px}$ touch target (`h-11 w-11 min-h-11 min-w-11` = $44\times 44\text{px}$) and contains `aria-label="Clear brand search"`.
- **Line 104–129 (Hidden Brand Checkbox Input):**
  ```tsx
  <label
    key={brand.id}
    className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group"
  >
    <div className="flex items-center gap-2.5 min-w-0 pr-2">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => onToggleBrand?.(brand.slug)}
        className="sr-only"
      />
  ```
  *Observation:* Label maintains $44\text{px}$ touch height (`min-h-11`), but the visually hidden checkbox (`className="sr-only"`) lacks an explicit `aria-label={`Filter by brand ${brand.name}`}` (Finding `INFO-02` in `AUDIT_REPORT.md`).

---

### 1.2 `src/components/catalog/catalog-filters.tsx`
- **Line 214–220 & 256–262 (Category and Fitness Goal sr-only Checkboxes):**
  ```tsx
  <input
    type="checkbox"
    checked={isChecked}
    onChange={() => handleToggleCategory(category.slug)}
    className="sr-only"
    aria-label={`Filter by category ${category.name}`}
  />
  ...
  <input
    type="checkbox"
    checked={isChecked}
    onChange={() => handleToggleGoal(goal.id)}
    className="sr-only"
    aria-label={`Filter by fitness goal ${goal.name}`}
  />
  ```
  *Observation:* Already fully equipped with explicit `aria-label` attributes and wrapped in `min-h-11` labels.
- **Line 323–340 (Numeric Min/Max Price Inputs):**
  ```tsx
  <Input
    type="number"
    placeholder="Min NPR"
    value={minPriceInput}
    onChange={(e) => setMinPriceInput(e.target.value)}
    className="h-10 text-xs"
    min={0}
  />
  <span className="text-neutral-400 text-xs">–</span>
  <Input
    type="number"
    placeholder="Max NPR"
    value={maxPriceInput}
    onChange={(e) => setMaxPriceInput(e.target.value)}
    className="h-10 text-xs"
    min={0}
  />
  ```
  *Observation:* Both inputs lack `<label>` associations or explicit `aria-label` attributes (`aria-label="Minimum price in NPR"`, `aria-label="Maximum price in NPR"`), relying solely on `placeholder` attributes (Finding `LOW-03`).
- **Line 303–316 & 342–348 (Price Preset Buttons & Submit Button):**
  *Observation:* All preset price buttons (`PRESET_PRICE_RANGES.map`) and the `Apply Price Range` submit button specify `min-h-11` ($44\text{px}$), fulfilling touch target standards.

---

### 1.3 `src/components/catalog/mobile-filter-drawer.tsx`
- **Line 232–260 (Drawer Header & Radix Dialog Accessibility):**
  ```tsx
  <SheetContent
    side="bottom"
    className="max-h-[85vh] h-[85vh] rounded-t-2xl p-0 flex flex-col bg-white overflow-hidden shadow-2xl border-t border-neutral-200"
  >
    <SheetHeader className="p-4 border-b border-neutral-200 flex flex-row items-center justify-between space-y-0 shrink-0">
      <div className="flex items-center gap-2">
        <SheetTitle className="text-base font-semibold text-neutral-900 font-heading">
          Filter Catalog
        </SheetTitle>
        {stagedCount > 0 && (
          <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-700">
            {stagedCount} selected
          </Badge>
        )}
      </div>
  ```
  *Observation:* Uses `SheetTitle` inside `SheetHeader`, but lacks `SheetDescription` or an `aria-describedby` reference. In `@radix-ui/react-dialog`, omitting `DialogDescription` triggers accessibility warnings in the developer console (Finding `LOW-02`).
- **Line 383–401 (Staged Min/Max Price Inputs in Drawer):**
  *Observation:* Lacks explicit `aria-label` attributes (`aria-label="Minimum price in NPR"`, `aria-label="Maximum price in NPR"`).
- **Line 408–431 (Staged In-Stock Toggle Button):**
  ```tsx
  <button
    type="button"
    onClick={() => setStagedInStock(!stagedInStock)}
    aria-pressed={stagedInStock}
    className="flex items-center justify-between w-full py-2 px-2.5 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
  >
  ```
  *Observation:* Meets $44\text{px}$ touch target (`min-h-11`) and provides `aria-pressed={stagedInStock}`. Adding `aria-label="Filter in-stock supplements only"` and ensuring the visual toggle switch has `aria-hidden="true"` guarantees uniform accessibility with desktop.

---

### 1.4 `src/components/catalog/search-modal.tsx`
- **Line 188–195 (Dialog Header & Accessibility):**
  ```tsx
  <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden sm:max-w-2xl bg-card border-border shadow-2xl">
    <DialogHeader className="sr-only">
      <DialogTitle>Search Supplement Catalog</DialogTitle>
      <DialogDescription>
        Search authentic supplements, brands, categories, and flavors in Nepal.
      </DialogDescription>
    </DialogHeader>
  ```
  *Observation:* Implements `DialogHeader` with both `DialogTitle` and `DialogDescription` wrapped with `sr-only`.
- **Line 240–248 (Recent Search "Clear" Button):**
  ```tsx
  <button
    type="button"
    onClick={handleClearHistory}
    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none"
  >
    <Trash2 className="h-3 w-3" />
    <span>Clear</span>
  </button>
  ```
  *Observation:* Lacks padding and min-height bounding box, yielding an interactive touch target of $\approx 16\text{px} \times 40\text{px}$, below the $44\text{px}$ minimum standard (Finding `LOW-01`).
- **Line 128–144 (Search Query State Dispatch - React 19 Transition):**
  *Observation:* `setResults(res)` is dispatched synchronously inside `setTimeout` without `React.startTransition()` (Finding `LOW-07` / `LOW-09`).

---

### 1.5 `src/components/layout/mobile-nav.tsx`
- **Line 111–125 (Mobile Navigation Drawer):**
  *Observation:* Contains `SheetTitle className="sr-only"` but lacks `SheetDescription` (Radix Dialog accessibility gap).

---

## 2. Logic Chain

1. **Accessibility Standards (WCAG 2.1 AA SC 4.1.2 & SC 1.3.1):**
   - When inputs are hidden using `.sr-only` and nested in complex `<label>` elements alongside other decorative and badge elements, an explicit `aria-label` on the `<input>` guarantees that assistive technologies announce the exact semantic purpose without synthesizing noisy string concatenations from child nodes.
   - Adding `aria-label={`Filter by brand ${brand.name}`}` in `brand-filter.tsx:113` resolves this discrepancy.
2. **Form Field Accessible Names (WCAG 2.1 AA SC 3.3.2):**
   - Text/numeric `<input>` elements with only `placeholder` text fail when assistive devices do not treat placeholders as accessible names or when input values replace the placeholder.
   - Providing `aria-label="Minimum price in NPR"` and `aria-label="Maximum price in NPR"` in `catalog-filters.tsx` and `mobile-filter-drawer.tsx` satisfies accessible naming rules.
3. **Touch Target Size Standards (WCAG 2.1 AA SC 2.5.8 & Project Invariant 5):**
   - Project specifications require standard interactive elements to provide $\ge 44\times 44\text{px}$ touch targets, and primary conversion CTAs to provide $\ge 48\times 48\text{px}$.
   - All primary filter checkboxes, category chips, filter pills, preset buttons, and drawer triggers have already adopted `min-h-11` ($44\text{px}$).
   - The "Clear" recent searches button in `search-modal.tsx:240` was the single sub-standard interactive element in search/filter components.
4. **Radix Dialog Accessible Description (`@radix-ui/react-dialog`):**
   - Radix Dialog contents require an accessible description (via `DialogDescription` / `SheetDescription` or `aria-describedby={undefined}`).
   - Adding `SheetDescription className="sr-only"` in `mobile-filter-drawer.tsx` and `mobile-nav.tsx` resolves developer console warnings and improves screen reader landmark navigation.
5. **React 19 Concurrent Transitions (Finding LOW-07 / LOW-09):**
   - Wrapping search result state updates in `React.startTransition(() => { setResults(res); })` allows React 19 to treat search results rendering as non-blocking, maintaining immediate input responsiveness.

---

## 3. Concrete Remediation Plan (Copy-Paste Ready Diffs)

### Fix 1: `src/components/catalog/brand-filter.tsx`
```diff
--- a/src/components/catalog/brand-filter.tsx
+++ b/src/components/catalog/brand-filter.tsx
@@ -75,6 +75,7 @@ export function BrandFilter({
           type="text"
           placeholder="Search brand..."
           value={searchQuery}
           onChange={(e) => setSearchQuery(e.target.value)}
+          aria-label="Search authorized brands"
           className="h-9 pl-8 pr-8 text-xs bg-neutral-50 border-neutral-200 focus-visible:ring-primary"
         />
@@ -110,6 +111,7 @@ export function BrandFilter({
                   <input
                     type="checkbox"
                     checked={isChecked}
                     onChange={() => onToggleBrand?.(brand.slug)}
+                    aria-label={`Filter by brand ${brand.name}`}
                     className="sr-only"
                   />
```

### Fix 2: `src/components/catalog/catalog-filters.tsx`
```diff
--- a/src/components/catalog/catalog-filters.tsx
+++ b/src/components/catalog/catalog-filters.tsx
@@ -327,6 +327,7 @@ export function CatalogFilters({ categories, className }: CatalogFiltersProps) {
               value={minPriceInput}
               onChange={(e) => setMinPriceInput(e.target.value)}
               className="h-10 text-xs"
+              aria-label="Minimum price in NPR"
               min={0}
             />
             <span className="text-neutral-400 text-xs">–</span>
@@ -336,6 +337,7 @@ export function CatalogFilters({ categories, className }: CatalogFiltersProps) {
               value={maxPriceInput}
               onChange={(e) => setMaxPriceInput(e.target.value)}
               className="h-10 text-xs"
+              aria-label="Maximum price in NPR"
               min={0}
             />
```

### Fix 3: `src/components/catalog/mobile-filter-drawer.tsx`
```diff
--- a/src/components/catalog/mobile-filter-drawer.tsx
+++ b/src/components/catalog/mobile-filter-drawer.tsx
@@ -15,6 +15,7 @@ import {
   SheetContent,
   SheetHeader,
   SheetTitle,
+  SheetDescription,
   SheetTrigger,
 } from '@/components/ui/sheet';
@@ -242,6 +243,9 @@ export function MobileFilterDrawer({
             <SheetTitle className="text-base font-semibold text-neutral-900 font-heading">
               Filter Catalog
             </SheetTitle>
+            <SheetDescription className="sr-only">
+              Filter supplements by category, brand, fitness goal, and price range.
+            </SheetDescription>
             {stagedCount > 0 && (
               <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-700">
                 {stagedCount} selected
@@ -387,6 +391,7 @@ export function MobileFilterDrawer({
                 value={stagedMinPrice}
                 onChange={(e) => setStagedMinPrice(e.target.value)}
                 className="h-10 text-xs"
+                aria-label="Minimum price in NPR"
                 min={0}
               />
               <span className="text-neutral-400 text-xs">–</span>
@@ -396,6 +401,7 @@ export function MobileFilterDrawer({
                 value={stagedMaxPrice}
                 onChange={(e) => setStagedMaxPrice(e.target.value)}
                 className="h-10 text-xs"
+                aria-label="Maximum price in NPR"
                 min={0}
               />
```

### Fix 4: `src/components/catalog/search-modal.tsx`
```diff
--- a/src/components/catalog/search-modal.tsx
+++ b/src/components/catalog/search-modal.tsx
@@ -131,7 +131,9 @@ export function SearchModal({
       try {
         const res = await searchProducts(trimmed, 8);
         if (cancelled) return;
-        setResults(res);
+        React.startTransition(() => {
+          setResults(res);
+        });
       } catch (err) {
         if (cancelled) return;
@@ -241,7 +243,8 @@ export function SearchModal({
                       <button
                         type="button"
                         onClick={handleClearHistory}
-                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none"
+                        className="inline-flex items-center gap-1 px-2 py-1 min-h-[44px] text-xs text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-md"
+                        aria-label="Clear search history"
                       >
                         <Trash2 className="h-3 w-3" />
                         <span>Clear</span>
```

### Fix 5: `src/components/layout/mobile-nav.tsx`
```diff
--- a/src/components/layout/mobile-nav.tsx
+++ b/src/components/layout/mobile-nav.tsx
@@ -23,6 +23,7 @@ import {
   SheetContent,
   SheetHeader,
   SheetTitle,
+  SheetDescription,
   SheetTrigger,
 } from "@/components/ui/sheet";
@@ -123,6 +124,9 @@ export function MobileNav() {
             </div>
           </div>
           <SheetTitle className="sr-only">{STORE_NAME} Navigation</SheetTitle>
+          <SheetDescription className="sr-only">
+            Mobile navigation menu with supplement categories, store information, and guides.
+          </SheetDescription>
         </SheetHeader>
```

---

## 4. Caveats

1. **Brand Filter Multi-Select Integration in Desktop Sidebar:**
   - In `catalog-container.tsx`, `<CatalogFilters categories={categories} brands={brands} />` passes `brands` into `CatalogFilters`, but `CatalogFilters` currently renders Category, Fitness Goal, Price Range, and In-Stock facets. `BrandFilter` is currently rendered directly inside `MobileFilterDrawer`.
   - The implementer can optionally embed `<BrandFilter brands={brands} ... />` inside `CatalogFilters` if a full brand facet in desktop sidebar is desired, or keep the existing layout. The ARIA and touch target fixes in `brand-filter.tsx` work seamlessly in either location.
2. **Read-Only Investigation Compliance:**
   - No source code files in `src/` were edited by Explorer 2. All diffs above are ready for atomic execution by the Milestone 3 implementer / worker.

---

## 5. Conclusion

1. **Hidden Filter Inputs:** Adding `aria-label={`Filter by brand ${brand.name}`}` in `brand-filter.tsx` and explicit `aria-label` attributes on numeric Min/Max price inputs across `catalog-filters.tsx` and `mobile-filter-drawer.tsx` completes form input accessibility.
2. **Touch Targets:** The catalog filters, mobile drawer items, and category chips all strictly comply with $\ge 44\text{px}$ touch targets (`min-h-11`). The single identified sub-standard touch target in `search-modal.tsx` (the "Clear" history button) is remediated with `min-h-[44px] px-2 py-1`.
3. **Dialog & Sheet Accessibility:** Adding `<SheetDescription className="sr-only">` to `mobile-filter-drawer.tsx` and `mobile-nav.tsx` eliminates Radix Dialog console warnings and achieves WCAG 2.1 AA dialog compliance.

---

## 6. Verification Method

To independently verify after implementation:
1. **Static Type Check:**
   ```powershell
   npx tsc --noEmit
   ```
2. **ESLint & Accessibility Linting:**
   ```powershell
   npm run lint
   ```
3. **Automated Component Inspection:**
   Inspect DOM nodes using automated test scripts in `src/scripts/` (e.g. `node src/scripts/validate-form-components.ts`) or browser accessibility trees to confirm:
   - Checkboxes in `BrandFilter` contain `aria-label="Filter by brand ..."`
   - Price inputs contain `aria-label="Minimum price in NPR"` and `aria-label="Maximum price in NPR"`
   - Dialog/Sheet components include accessible `SheetTitle` and `SheetDescription`
   - Interactive buttons have minimum dimensions $\ge 44\text{px} \times 44\text{px}$
