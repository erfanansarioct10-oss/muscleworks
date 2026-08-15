**Actionable comments posted: 13**

> [!NOTE]
> Due to the large number of review comments, Critical, Major severity comments were prioritized as inline comments.

<details>
<summary>🟡 Minor comments (32)</summary><blockquote>

<details>
<summary>context/feature-specs/19-subphase-2.5-store-faq-content-accessor-layer.md-45-47 (1)</summary><blockquote>

`45-47`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Use one canonical guide-category type name.**

The schema section introduces `GuideCategoryEnum`, but `getGuidesByCategory()` uses `GuideCategory`. Define and export `GuideCategory`, or use `GuideCategoryEnum` consistently. The current specification names a type that it does not define.







Also applies to: 79-79

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/19-subphase-2.5-store-faq-content-accessor-layer.md`
around lines 45 - 47, The guide category type is inconsistently named between
GuideCategoryEnum and getGuidesByCategory(). Choose one canonical exported type
name, define it in the schema section, and update all references—including
getGuidesByCategory()—to use that same name.
```

</details>

<!-- cr-comment:v1:d8961ddd7f7f2c34a5e8e60f -->

</blockquote></details>
<details>
<summary>context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md-7-7 (1)</summary><blockquote>

`7-7`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Synchronize completed specification statuses.** Both specifications remain marked as pending even though `context/progress-tracker.md` records both sub-phases as implemented and verified.
- `context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md#L7-L7`: change the status from `Draft / Pending Implementation`.
- `context/feature-specs/25-subphase-3.6-category-brand-archive-routes.md#L7-L7`: change the status from `Draft / Pending Implementation`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md` at line
7, Synchronize both completed specification statuses with
context/progress-tracker.md: update the status at
context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md:7-7 and
context/feature-specs/25-subphase-3.6-category-brand-archive-routes.md:7-7 from
Draft / Pending Implementation to the appropriate implemented and verified
status.
```

</details>

<!-- cr-comment:v1:5e7c75b69d8fb9ceadace391 -->

</blockquote></details>
<details>
<summary>context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md-16-16 (1)</summary><blockquote>

`16-16`: _🚀 Performance & Scalability_ | _🟡 Minor_ | _⚡ Quick win_

**Remove the unsupported `0ms TTFB` guarantee.** Static generation does not guarantee zero network response time.
- `context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md#L16-L16`: describe static pre-rendering without a numeric TTFB promise.
- `context/feature-specs/25-subphase-3.6-category-brand-archive-routes.md#L16-L16`: describe static pre-rendering without a numeric TTFB promise.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md` at line
16, Remove the numeric “0ms TTFB” guarantee from the page descriptions in
context/feature-specs/24-subphase-3.5-products-catalog-hub-route.md:16-16 and
context/feature-specs/25-subphase-3.6-category-brand-archive-routes.md:16-16.
Describe static pre-rendering without promising a specific network response
time.
```

</details>

<!-- cr-comment:v1:8feed1601e6afb5be1c67051 -->

</blockquote></details>
<details>
<summary>context/feature-specs/26-subphase-4.1-whatsapp-url-engine-analytics-tracker.md-23-26 (1)</summary><blockquote>

`23-26`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Align the documented API names.**

The specification declares `ProductWhatsAppParams`, but `src/lib/whatsapp.ts` uses `ProductWhatsAppOptions`. It also names the search event `trackSearch` in Line 26 while the detailed dispatcher and progress tracker use `trackSearchQuery`. Choose one public name and update all references before consumers rely on different spellings.







Also applies to: 43-47, 69-75

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In
`@context/feature-specs/26-subphase-4.1-whatsapp-url-engine-analytics-tracker.md`
around lines 23 - 26, Align the public API names across the specification and
implementation: choose either ProductWhatsAppParams or ProductWhatsAppOptions,
and either trackSearch or trackSearchQuery, then update the WhatsApp API,
analytics dispatcher, progress tracker, and all documented references
consistently before consumer usage diverges.
```

</details>

<!-- cr-comment:v1:728ab7b9ece0e72c6e1b029f -->

</blockquote></details>
<details>
<summary>context/progress-tracker.md-3-9 (1)</summary><blockquote>

`3-9`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Reconcile the active-phase headings.**

The header says Phase 5 is active, but Section 1 says Phase 4 is the active phase. Line 27 also marks Phase 5 as `[IN PROGRESS]`. Keep one active-phase status so the next-subphase workflow is unambiguous.

As per coding guidelines, keep `context/progress-tracker.md` synchronized after each unit of work.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/progress-tracker.md` around lines 3 - 9, Reconcile the active-phase
headings in context/progress-tracker.md so they consistently identify Phase 5 as
the active phase and preserve 5.1 as the next sub-phase. Update the conflicting
Section 1 Phase 4 status and any stale Phase 5 progress marker, keeping the
tracker synchronized with the current workflow.
```

</details>

<!-- cr-comment:v1:3545e6f5f31a8dcedda33289 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>context/feature-specs/18-subphase-2.4-catalog-data-accessor-layer.md-80-81 (1)</summary><blockquote>

`80-81`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Choose one empty-query behavior.**

Line 81 allows either all products or an empty array. `searchProductsInMemory("")` needs one deterministic contract because catalog consumers can call it for an empty search. State the expected result and add an assertion to `src/scripts/validate-catalog-accessors.ts`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/18-subphase-2.4-catalog-data-accessor-layer.md` around
lines 80 - 81, Define one deterministic contract for empty or whitespace-only
queries in searchProductsInMemory, choosing either all products or an empty
array, and document that behavior in the feature specification. Update
src/scripts/validate-catalog-accessors.ts to assert the chosen result when
validating the accessor.
```

</details>

<!-- cr-comment:v1:4c74f6c8bfa682ecdefa81c4 -->

</blockquote></details>
<details>
<summary>context/feature-specs/18-subphase-2.4-catalog-data-accessor-layer.md-21-23 (1)</summary><blockquote>

`21-23`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Include `getProductById` in the target contract.**

The target-file table omits `getProductById`, but Line 42 declares it as a required export. Add it to the responsibility summary and validation checklist so implementation and verification do not treat it as optional.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/18-subphase-2.4-catalog-data-accessor-layer.md` around
lines 21 - 23, Update the target-file responsibility summary for
src/lib/data/products.ts to include the required getProductById accessor
alongside the other product retrieval functions. Also add getProductById to the
validation checklist so it is explicitly implemented and verified as a required
export.
```

</details>

<!-- cr-comment:v1:5fe5713fa77d6685201a2a9f -->

</blockquote></details>
<details>
<summary>context/feature-specs/17-subphase-2.3-supplementary-datasets.md-57-57 (1)</summary><blockquote>

`57-57`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Document the Saturday contract in both specifications.** In Spec 17, define `opens` and `closes` as `"Contact Store"`, `isClosed` as `false`, and the required `note`. In Spec 19, define Saturday `isStoreOpenNow()` as `{ isOpen: false, message: "Saturday hours vary. Please contact store before visiting Golfutar flagship." }`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/17-subphase-2.3-supplementary-datasets.md` at line 57,
Update the Saturday contract in
context/feature-specs/17-subphase-2.3-supplementary-datasets.md at lines 57-57
so openingHours specifies opens and closes as "Contact Store", isClosed as
false, and the required note. Also update the Saturday isStoreOpenNow() behavior
in context/feature-specs/19-subphase-2.5-store-faq-content-accessor-layer.md at
lines 61-62 to return isOpen false with the exact specified message.
```

</details>

<!-- cr-comment:v1:6a39e189b5b899abcd37707d -->

</blockquote></details>
<details>
<summary>src/app/brands/[slug]/page.tsx-111-114 (1)</summary><blockquote>

`111-114`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Do not default an unknown country to `USA`.**

`countryOfOrigin` is optional. The fallback displays a false country when the dataset omits this field. Hide the country badge or display an explicit unknown-value label.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/brands/`[slug]/page.tsx around lines 111 - 114, Update the country
badge rendering near the Globe icon so an absent brand.countryOfOrigin no longer
falls back to “USA”; hide the badge when the value is missing or display an
explicit unknown-value label, while preserving the existing display for provided
countries.
```

</details>

<!-- cr-comment:v1:79479139ad53e75b46b8a478 -->

</blockquote></details>
<details>
<summary>src/lib/validations/guide.ts-39-40 (1)</summary><blockquote>

`39-40`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Validate calendar dates.**

The regular expression accepts invalid dates such as `2026-02-31`. `getAllGuides` converts these values with `new Date()`, which normalizes some invalid dates and can sort a guide under the wrong publication date. Add a refinement that verifies the parsed UTC date round-trips to the original `YYYY-MM-DD` value.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/validations/guide.ts` around lines 39 - 40, Update the publishedDate
and updatedDate validators in the guide schema to refine the YYYY-MM-DD strings
by parsing them as UTC dates and verifying the resulting UTC year, month, and
day round-trip exactly to the original value. Preserve the existing format error
message and optionality of updatedDate while rejecting calendar-invalid values
such as 2026-02-31.
```

</details>

<!-- cr-comment:v1:bb6bf341a452cfac964f30fa -->

</blockquote></details>
<details>
<summary>src/components/catalog/active-filters.tsx-36-36 (1)</summary><blockquote>

`36-36`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Use the catalog search parameter consistently.**

`CatalogContainer` filters on `search`, but this component only reads and removes `q` and `searchQuery`. A `?search=` value changes results without an active pill or a removal action. Read and remove `search` here.







Also applies to: 138-148

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/active-filters.tsx` at line 36, Update the
active-filter search parameter handling in the component’s searchParam
derivation and removal logic to use the catalog’s `search` key consistently with
CatalogContainer. Preserve the existing active-pill and removal behavior while
replacing the `q`/`searchQuery` reads and deletes with `search`.
```

</details>

<!-- cr-comment:v1:cbab7da1b78237ac1e9a5a84 -->

</blockquote></details>
<details>
<summary>src/lib/search.ts-130-131 (1)</summary><blockquote>

`130-131`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Validate each stored recent-search value.**

`Array.isArray(parsed)` does not prove that every item is a string. This function can return objects, numbers, or `null` as `string[]`. A consumer can then fail when it renders a term or calls a string method.

<details>
<summary>Proposed fix</summary>

```diff
-    const parsed = JSON.parse(raw);
-    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT_SEARCHES) : [];
+    const parsed: unknown = JSON.parse(raw);
+    if (!Array.isArray(parsed)) return [];
+
+    return parsed
+      .filter((item): item is string => typeof item === 'string')
+      .map((item) => item.trim())
+      .filter(Boolean)
+      .slice(0, MAX_RECENT_SEARCHES);
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/search.ts` around lines 130 - 131, Update the recent-search parsing
logic around JSON.parse to filter parsed array entries to strings before
applying MAX_RECENT_SEARCHES and returning them, ensuring non-string values such
as objects, numbers, and null cannot be returned as string[].
```

</details>

<!-- cr-comment:v1:7a5c30dec318c743f913b6f9 -->

</blockquote></details>
<details>
<summary>src/components/catalog/search-bar.tsx-76-82 (1)</summary><blockquote>

`76-82`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Reset `selectedIndex` when the results change.**

`selectedIndex` persists across queries. After new results arrive, the highlighted row can point to an unrelated product, and Enter opens that product. Set `selectedIndex` back to `-1` whenever you store new results.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-bar.tsx` around lines 76 - 82, Reset
selectedIndex to -1 whenever new search results are stored, alongside the
results state update in the search-bar component. Preserve the existing keyboard
navigation behavior in the ArrowDown and ArrowUp handlers while ensuring each
results change starts without a stale highlighted product.
```

</details>

<!-- cr-comment:v1:240035ae07c040ffbf0d9f7c -->

</blockquote></details>
<details>
<summary>src/components/catalog/search-modal.tsx-61-82 (1)</summary><blockquote>

`61-82`: _🩺 Stability & Availability_ | _🟡 Minor_ | _⚡ Quick win_

**Fix the effect dependencies and clear the focus timer.**

Two problems exist in this block.

1. The shortcut effect at Lines 62-71 depends on `isOpen` only. It closes over `setOpen`, which closes over `externalOnOpenChange`. If the parent passes a new callback identity, the listener keeps calling the previous one. Wrap `setOpen` in `React.useCallback` and add it to the dependency array.
2. The `setTimeout` at Line 77 is never cleared. If the modal unmounts within 100ms, the callback still runs. Return a cleanup that calls `clearTimeout`.

ESLint also reports `react-hooks/set-state-in-effect` at Line 76.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-modal.tsx` around lines 61 - 82, Update the
setOpen callback used by the keyboard shortcut effect to be memoized with
React.useCallback and include setOpen in that effect’s dependencies, ensuring it
tracks externalOnOpenChange changes. In the modal-open effect, store the focus
setTimeout handle and return cleanup that clears it on dependency changes or
unmount; preserve the existing search reset behavior and address the reported
set-state-in-effect warning within this flow.
```

</details>

<!-- cr-comment:v1:5bf1804d70f33b2be2c724b7 -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>src/components/catalog/mobile-filter-drawer.tsx-422-430 (1)</summary><blockquote>

`422-430`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Remove the trailing space in the CTA label.**

`Apply Filters {totalCount !== undefined ? `(${totalCount} Products)` : ''}` renders `Apply Filters ` when `totalCount` is undefined. Build the label as one string.

<details>
<summary>🔧 Proposed fix</summary>

```diff
-            Apply Filters {totalCount !== undefined ? `(${totalCount} Products)` : ''}
+            {totalCount !== undefined
+              ? `Apply Filters (${totalCount} Products)`
+              : 'Apply Filters'}
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/mobile-filter-drawer.tsx` around lines 422 - 430,
Update the Button label in the mobile filter drawer so it constructs a single
string without a trailing space when totalCount is undefined, while preserving
the existing product-count suffix when totalCount is available.
```

</details>

<!-- cr-comment:v1:24fb76590db581db21d82ed5 -->

</blockquote></details>
<details>
<summary>src/components/catalog/category-chips.tsx-34-46 (1)</summary><blockquote>

`34-46`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Chip selection replaces the category list, but the sidebar appends.**

Line 44 calls `params.set('category', slug)`, which discards every other selected category. `CatalogFilters.handleToggleCategory` appends the slug instead. A user who selects two categories in the sidebar loses both when they tap one chip. The comment at Line 18 also states multi-select support.

Choose one semantic. If chips must append, apply this change.

<details>
<summary>🔧 Proposed fix for append semantics</summary>

```diff
         } else {
-          params.set('category', slug);
+          params.set('category', [...activeCategorySlugs, slug].join(','));
         }
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/category-chips.tsx` around lines 34 - 46, Update the
category-chip toggle logic in the category selection handler so selecting an
unselected slug appends it to the existing activeCategorySlugs list instead of
replacing the query value via params.set('category', slug). Preserve the
existing removal behavior and serialize the combined selected slugs consistently
with CatalogFilters.handleToggleCategory.
```

</details>

<!-- cr-comment:v1:855bf47b4fbc4b49c967efe4 -->

</blockquote></details>
<details>
<summary>src/components/catalog/brand-filter.tsx-82-90 (1)</summary><blockquote>

`82-90`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Increase the clear-search button touch target to 44×44px.**

The button sets `min-h-[28px] min-w-[28px]`. The coding guidelines require at least 44×44px for standard buttons. Keep the icon small and expand the hit area.

<details>
<summary>🔧 Proposed fix</summary>

```diff
-            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center min-h-[28px] min-w-[28px] text-neutral-400 hover:text-neutral-700"
+            className="absolute right-0 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center text-neutral-400 hover:text-neutral-700"
```
</details>

As per coding guidelines: "Ensure standard buttons and links have touch targets of at least 44×44px".

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/brand-filter.tsx` around lines 82 - 90, Update the
clear-search button in the brand filter’s search controls to use minimum height
and width of 44px instead of 28px, while keeping the X icon dimensions
unchanged.
```

</details>

<!-- cr-comment:v1:9ca5f78773bd01548772e896 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/components/catalog/catalog-container.tsx-70-72 (1)</summary><blockquote>

`70-72`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Pass `products` and `totalCount` to `MobileFilterDrawer`.**

`MobileFilterDrawer` declares optional `products` and `totalCount` props. This call site omits both. As a result, `BrandFilter` inside the drawer renders no per-brand counts, and the footer CTA renders `Apply Filters ` with a trailing space instead of the product count.

<details>
<summary>🔧 Proposed fix</summary>

```diff
           <div className="lg:hidden">
-            <MobileFilterDrawer categories={categories} brands={brands} />
+            <MobileFilterDrawer
+              categories={categories}
+              brands={brands}
+              products={initialProducts}
+              totalCount={filteredProducts.length}
+            />
           </div>
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/catalog-container.tsx` around lines 70 - 72, Update
the MobileFilterDrawer invocation in the catalog container to pass the available
products and totalCount values through its props. Preserve the existing
categories and brands props so BrandFilter receives product data for per-brand
counts and the footer CTA displays the correct count.
```

</details>

<!-- cr-comment:v1:6ea8e15f6c1d3d0e5870aac1 -->

</blockquote></details>
<details>
<summary>src/components/catalog/search-bar.tsx-148-160 (1)</summary><blockquote>

`148-160`: _🩺 Stability & Availability_ | _🟡 Minor_ | _⚡ Quick win_

**`defaultVariant` can be undefined.**

`product.variants.find(...) ?? product.variants[0]` returns `undefined` when `variants` is empty, and Line 153 then throws. The same pattern exists in `src/components/catalog/search-modal.tsx`. See the consolidated comment.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-bar.tsx` around lines 148 - 160, The product
rendering logic around defaultVariant in the search bar and search modal must
handle products with no variants before accessing variant fields or calculating
discounts. Add the existing appropriate empty-variant behavior or guard so
defaultVariant is validated before discountPct and other variant-dependent
logic, while preserving current selection for products with variants.
```

</details>

<!-- cr-comment:v1:171aa2972864fa73480429e9 -->

</blockquote></details>
<details>
<summary>src/components/catalog/search-modal.tsx-250-256 (1)</summary><blockquote>

`250-256`: _🩺 Stability & Availability_ | _🟡 Minor_ | _⚡ Quick win_

**`defaultVariant` can be undefined.**

`product.variants[0]` is `undefined` when `variants` is empty, and Line 256 then throws. See the consolidated comment.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-modal.tsx` around lines 250 - 256, Handle the
empty-variants case in the results mapping around defaultVariant before
accessing discountPriceNpr. Ensure products without a matching default variant
or fallback variant are skipped or handled safely, while preserving the existing
discount calculation for products with a valid variant.
```

</details>

<!-- cr-comment:v1:16aef817f2d7dc30627f7342 -->

</blockquote></details>
<details>
<summary>src/lib/data/store.ts-83-111 (1)</summary><blockquote>

`83-111`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Calculate store status from `todayHours`**

`data/store-info.json` stores `opens` and `closes` as 12-hour strings such as `10:00 AM` and `09:00 PM`. The schema also permits 24-hour strings. The current implementation compares hardcoded `10` and `21`, so dataset changes will not affect the status or message.

Parse both supported formats into minutes and compare them with the current Kathmandu time. Treat either `opens` or `closes` equal to `Contact Store` as contact-only hours. Use the dataset values in the returned messages. Replace the separate Saturday check with the sentinel handling. Keep the existing `todayHours.isClosed` check.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/data/store.ts` around lines 83 - 111, The store-status logic should
use todayHours.opens and todayHours.closes instead of hardcoded hours. Preserve
todayHours.isClosed, treat either time as Contact Store for contact-only
messaging, parse both 12-hour and 24-hour formats into minutes, and compare them
with the current Kathmandu time, including overnight ranges. Remove the separate
Saturday check and use the dataset values in the open/closed messages.
```

</details>

<!-- cr-comment:v1:1dc6e630b3abdcb52a075958 -->

</blockquote></details>
<details>
<summary>src/components/catalog/search-modal.tsx-129-133 (1)</summary><blockquote>

`129-133`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Use `DialogTrigger asChild` for the search button.**

The nested `Button` is keyboard operable, but the surrounding `<span>` is not registered with Radix. Render the single `children` element inside `Dialog` as `DialogTrigger asChild` to provide trigger state and focus restoration. Keep `children` constrained to one element because `asChild` cannot wrap arbitrary `ReactNode` values.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-modal.tsx` around lines 129 - 133, Update the
search modal trigger around the children render to use Radix DialogTrigger with
asChild instead of the surrounding clickable span, so the single child element
receives trigger state and focus restoration. Constrain children to exactly one
React element compatible with asChild, and preserve opening the Dialog through
that child.
```

</details>

<!-- cr-comment:v1:149b6e06362a943508b808d4 -->

</blockquote></details>
<details>
<summary>src/app/products/[slug]/page.tsx-114-117 (1)</summary><blockquote>

`114-117`: _🔒 Security & Privacy_ | _🟡 Minor_ | _⚡ Quick win_

**Escape the JSON-LD payload before injection.**

`JSON.stringify` does not escape `<`. If any product field contains `</script>`, the tag closes early and the remaining payload becomes markup. The data is repository-controlled today, so this is a hardening step, not an active exploit.

<details>
<summary>🔒 Proposed fix</summary>

```diff
       <script
         type="application/ld+json"
-        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
+        dangerouslySetInnerHTML={{
+          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
+        }}
       />
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/products/`[slug]/page.tsx around lines 114 - 117, Update the JSON-LD
construction used by the page’s application/ld+json script to escape characters
that can terminate a script element, especially `<`, before assigning the
serialized payload to dangerouslySetInnerHTML. Preserve valid JSON-LD output
while ensuring product-controlled fields cannot inject a closing script tag.
```

</details>

<!-- cr-comment:v1:1680957bbc7e2f7007ae570b -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>context/feature-specs/28-subphase-4.3-product-specs-nutrition-trust.md-68-71 (1)</summary><blockquote>

`68-71`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Align the related-product selection rule with the accessor.**

Line 70 says every recommendation must share the category or brand. `getRelatedProducts` fills remaining slots with other catalog products when matches are fewer than the limit. State that category and brand matches are prioritized, or remove the fallback behavior.

Based on the supplied `src/lib/data/products.ts` accessor context, unrelated products can fill the remaining recommendation slots.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/28-subphase-4.3-product-specs-nutrition-trust.md`
around lines 68 - 71, Update the RelatedProducts data-fetching/filtering
specification to state that categoryId or brandId matches are prioritized, with
unrelated catalog products allowed to fill remaining slots up to the
four-product limit, consistent with getRelatedProducts.
```

</details>

<!-- cr-comment:v1:c56c2d784eb8f4959891994e -->

</blockquote></details>
<details>
<summary>context/feature-specs/29-subphase-4.4-product-detail-route-sticky-bar.md-59-69 (1)</summary><blockquote>

`59-69`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Align the documented `ProductDetailView` prop contract.**

Line 59 declares `relatedProducts: Product[]`. The supplied `src/app/products/[slug]/page.tsx` context passes `relatedProductsChildren` instead. Document the actual child prop, or change the route and component to use the documented data prop consistently.

Based on the supplied route context, `ProductDetailView` receives `relatedProductsChildren`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/29-subphase-4.4-product-detail-route-sticky-bar.md`
around lines 59 - 69, Update the ProductDetailView prop contract to use
relatedProductsChildren, matching the prop supplied by the products/[slug] route
context. Replace the documented relatedProducts: Product[] declaration and
related references with the actual child prop name, without changing unrelated
product-detail behavior.
```

</details>

<!-- cr-comment:v1:14f50cc033d944f8f302d403 -->

</blockquote></details>
<details>
<summary>src/components/product/product-card.tsx-199-207 (1)</summary><blockquote>

`199-207`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Increase the mobile WhatsApp touch target to 48px.**

Set the base `h-11 w-11 min-h-11 min-w-11` classes to `h-12 w-12 min-h-12 min-w-12`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-card.tsx` around lines 199 - 207, Update the
WhatsApp order button in the product card to use 48px base dimensions by
changing its h-11, w-11, min-h-11, and min-w-11 classes to h-12, w-12, min-h-12,
and min-w-12, while preserving the existing responsive classes and styling.
```

</details>

<!-- cr-comment:v1:47199e663c93c88dcd41f177 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/components/product/product-card.tsx-23-37 (1)</summary><blockquote>

`23-37`: _🗄️ Data Integrity & Integration_ | _🟡 Minor_ | _⚡ Quick win_

**Use the canonical WhatsApp builder and fix the CTA target.**

- Replace `buildQuickWhatsAppUrl` with `buildProductWhatsAppUrl({ product, selectedVariant: defaultVariant, brandName })`. The canonical builder includes brand, flavor, size/weight, delivery, authenticity, and sanitized-number fields.
- Move the WhatsApp `<button>` outside the product `<Link>` to avoid nested interactive controls.
- Use `min-h-12 min-w-12` at the mobile base size. The current `h-11 w-11` target is only 44px.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-card.tsx` around lines 23 - 37, Replace
buildQuickWhatsAppUrl with the canonical buildProductWhatsAppUrl({ product,
selectedVariant: defaultVariant, brandName }) flow, preserving the canonical
message and sanitized WhatsApp number fields. Move the WhatsApp button outside
the product Link to prevent nested interactive controls, and update its mobile
base sizing to min-h-12 min-w-12 instead of h-11 w-11.
```

</details>

<!-- cr-comment:v1:2d97b3556d9fef2f0d6a5db5 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/lib/catalog.ts-37-39 (1)</summary><blockquote>

`37-39`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Exclude `pre_order` variants from the in-stock filter.**

Line 38 treats `pre_order` as available inventory. A pre-order variant has future delivery, so it must not appear when the user selects the in-stock-only filter.

Return `true` only when at least one variant has an immediately available status, such as `in_stock` or `low_stock`.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/catalog.ts` around lines 37 - 39, Update isProductInStock to exclude
both out_of_stock and pre_order variants, returning true only when a variant has
an immediately available status such as in_stock or low_stock.
```

</details>

<!-- cr-comment:v1:a73b224978e3e8d40ab1a5b1 -->

</blockquote></details>
<details>
<summary>src/scripts/validate-pdp-specs-components.ts-38-43 (1)</summary><blockquote>

`38-43`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Validate the production related-product accessor.**

Lines 40-42 reproduce a simplified candidate filter. They do not call the related-product implementation. A regression in `getRelatedProducts` will not fail this validation script.

Import `getRelatedProducts`, call it with `testProduct`, and assert that each returned product is distinct from the source product and satisfies the expected relation.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/scripts/validate-pdp-specs-components.ts` around lines 38 - 43, Replace
the inline relatedCandidates filter in the validation flow with the production
getRelatedProducts accessor, passing testProduct and the available product
context as required. Assert that every returned product has a different id from
testProduct and matches its categoryId or brandId, so regressions in
getRelatedProducts fail validation.
```

</details>

<!-- cr-comment:v1:83ab98b5ed4b21c278650c41 -->

</blockquote></details>
<details>
<summary>src/lib/catalog.ts-172-184 (1)</summary><blockquote>

`172-184`: _📐 Maintainability & Code Quality_ | _🟡 Minor_ | _⚡ Quick win_

**Scope declarations inside each switch case.**

Lines 174-177 and 181-184 declare `const` values directly in switch clauses. Biome reports `lint/correctness/noSwitchDeclarations` errors for these lines.

Wrap the `newest` and `featured` case bodies in braces.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/catalog.ts` around lines 172 - 184, Wrap the bodies of the newest and
featured switch cases in braces within the catalog sorting logic, so their const
declarations are scoped safely. Preserve the existing sorting comparisons and
return behavior.
```

</details>

<!-- cr-comment:v1:4fe4c62d06ad79440ffb719b -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>src/components/layout/header.tsx-43-52 (1)</summary><blockquote>

`43-52`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_

**Keep the `/products` navigation fallback.**

Line 43 replaces the catalog link with a button-only trigger. Users without working client JavaScript cannot reach the catalog from this control.

Render an anchor with `href="/products"` and enhance its click behavior to open `SearchModal` when JavaScript is available.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/layout/header.tsx` around lines 43 - 52, Update the
SearchModal trigger in the header to render an anchor with href="/products"
instead of a button-only control, preserving catalog navigation without client
JavaScript. Enhance the anchor’s click behavior to open SearchModal when
JavaScript is available, while retaining the existing styling, accessibility
label, and search icon.
```

</details>

<!-- cr-comment:v1:181b4b09add7b0a1239ef10e -->

</blockquote></details>
<details>
<summary>src/components/product/product-variant-selector.tsx-27-28 (1)</summary><blockquote>

`27-28`: _🩺 Stability & Availability_ | _🟡 Minor_ | _⚡ Quick win_

**Guard empty `variants` before dereferencing `activeVariant`.**

`ProductSchema` rejects empty variant arrays, but `ProductVariantSelectorProps` accepts them. An empty array makes `activeVariant` undefined and causes the property reads in the handlers and render to throw at runtime. Add an empty state or require a non-empty component prop. This is not a TypeScript strict-null error.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-variant-selector.tsx` around lines 27 - 28,
Handle an empty variants array in ProductVariantSelector before activeVariant is
dereferenced by its handlers or render logic. Add an appropriate empty state, or
change ProductVariantSelectorProps to require a non-empty variants collection,
while preserving the existing selected-variant behavior for non-empty arrays.
```

</details>

<!-- cr-comment:v1:3c89749c2e30883f0aa20779 -->

_Source: Coding guidelines_

</blockquote></details>

</blockquote></details>

<details>
<summary>🧹 Nitpick comments (15)</summary><blockquote>

<details>
<summary>context/feature-specs/19-subphase-2.5-store-faq-content-accessor-layer.md (1)</summary><blockquote>

`68-68`: _🎯 Functional Correctness_ | _🔵 Trivial_ | _⚡ Quick win_

**Verify the FAQ category type before finalizing this API.**

`getFAQsByCategory(category: string)` bypasses the canonical category type if `FAQItemSchema` constrains `category`. Check `src/lib/validations/common.ts`; if the field is an enum or union, use the inferred type instead of `string`.

As per coding guidelines, use the project’s canonical schemas and interfaces.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@context/feature-specs/19-subphase-2.5-store-faq-content-accessor-layer.md` at
line 68, Update the getFAQsByCategory API signature to use the canonical FAQ
category type inferred from FAQItemSchema in common.ts instead of string,
preserving the schema’s enum or union constraints.
```

</details>

<!-- cr-comment:v1:60e8ed0117e3cdac3483550b -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/components/catalog/search-bar.tsx (1)</summary><blockquote>

`83-89`: _🚀 Performance & Scalability_ | _🔵 Trivial_ | _⚡ Quick win_

**Use the Next.js router instead of `window.location.href`.**

Line 88 assigns `window.location.href`, which forces a full document reload and discards the client cache. Every other navigation in this component uses `next/link`. Use `useRouter().push` for the Enter key path.

<details>
<summary>♻️ Proposed refactor</summary>


```diff
+import { useRouter } from "next/navigation";
...
+  const router = useRouter();
...
-      window.location.href = `/products/${target.product.slug}`;
+      setIsOpen(false);
+      router.push(`/products/${target.product.slug}`);
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/search-bar.tsx` around lines 83 - 89, Update the
Enter-key selection branch in the search-bar component to obtain a Next.js
router via useRouter and replace the window.location.href assignment with
router.push using the same product slug path. Preserve the existing
recent-search and onSelectResult behavior.
```

</details>

<!-- cr-comment:v1:53e444e87dc15b36e72fa42c -->

</blockquote></details>
<details>
<summary>src/lib/data/faqs.ts (1)</summary><blockquote>

`10-24`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _💤 Low value_

**Extract the priority comparator.**

`getFAQs` and `getFAQsByCategory` repeat the same `(a.priority ?? 99) - (b.priority ?? 99)` comparator. Extract a module-level `byPriority` function and reuse it.

<details>
<summary>♻️ Proposed refactor</summary>

```diff
+const byPriority = (a: FAQItem, b: FAQItem) =>
+  (a.priority ?? 99) - (b.priority ?? 99);
+
 export async function getFAQs(): Promise<FAQItem[]> {
-  return [...parsedFaqs].sort(
-    (a, b) => (a.priority ?? 99) - (b.priority ?? 99)
-  );
+  return [...parsedFaqs].sort(byPriority);
 }
 
 export async function getFAQsByCategory(category: string): Promise<FAQItem[]> {
   const normalizedCat = category.toLowerCase().trim();
   return parsedFaqs
     .filter((faq) => faq.category?.toLowerCase() === normalizedCat)
-    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
+    .sort(byPriority);
 }
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/data/faqs.ts` around lines 10 - 24, Extract the duplicated priority
sort comparator into a module-level byPriority function, then reuse it in both
getFAQs and getFAQsByCategory while preserving the existing nullish priority
fallback and ascending order.
```

</details>

<!-- cr-comment:v1:0482f9390d136911669bb6a8 -->

</blockquote></details>
<details>
<summary>src/components/catalog/catalog-filters.tsx (1)</summary><blockquote>

`56-66`: _🚀 Performance & Scalability_ | _🔵 Trivial_ | _⚡ Quick win_

**Remove the two state-sync effects.**

ESLint reports `react-hooks/set-state-in-effect` at Line 61 and Line 65. Each URL change triggers a render, then a state update, then a second render. Derive the input values during render instead, and track the last committed URL value.

<details>
<summary>♻️ Proposed refactor</summary>

```diff
-  // Local state for Min/Max inputs before committing
-  const [minPriceInput, setMinPriceInput] = React.useState(activeMinPrice);
-  const [maxPriceInput, setMaxPriceInput] = React.useState(activeMaxPrice);
-
-  // Synchronize local input state with URL changes
-  React.useEffect(() => {
-    setMinPriceInput(activeMinPrice);
-  }, [activeMinPrice]);
-
-  React.useEffect(() => {
-    setMaxPriceInput(activeMaxPrice);
-  }, [activeMaxPrice]);
+  // Local state for Min/Max inputs before committing.
+  // Reset during render when the URL values change.
+  const [minPriceInput, setMinPriceInput] = React.useState(activeMinPrice);
+  const [maxPriceInput, setMaxPriceInput] = React.useState(activeMaxPrice);
+  const [syncedPrices, setSyncedPrices] = React.useState({
+    min: activeMinPrice,
+    max: activeMaxPrice,
+  });
+
+  if (syncedPrices.min !== activeMinPrice || syncedPrices.max !== activeMaxPrice) {
+    setSyncedPrices({ min: activeMinPrice, max: activeMaxPrice });
+    setMinPriceInput(activeMinPrice);
+    setMaxPriceInput(activeMaxPrice);
+  }
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/catalog-filters.tsx` around lines 56 - 66, Remove the
`React.useEffect` synchronization blocks for `minPriceInput` and
`maxPriceInput`; derive displayed input values from `activeMinPrice` and
`activeMaxPrice` during render, while preserving editable local state and
tracking each field’s last committed URL value so URL changes update inputs
without setState-in-effect or an extra render.
```

</details>

<!-- cr-comment:v1:52ca5ce45537c1bdbe616ac5 -->

_Source: Linters/SAST tools_

</blockquote></details>
<details>
<summary>src/components/catalog/sort-select.tsx (1)</summary><blockquote>

`32-32`: _🎯 Functional Correctness_ | _🔵 Trivial_ | _💤 Low value_

**Validate the `sort` parameter instead of casting it.**

The cast accepts any string. A URL such as `?sort=foo` produces a `Select` value that matches no `SelectItem`, so the trigger falls back to the placeholder while the list stays in the default order. Check the value against `SORT_OPTIONS`.

<details>
<summary>♻️ Proposed refactor</summary>

```diff
-  const currentSort = (searchParams.get('sort') as CatalogSortOption) || 'featured';
+  const rawSort = searchParams.get('sort');
+  const currentSort: CatalogSortOption =
+    SORT_OPTIONS.find((opt) => opt.value === rawSort)?.value ?? 'featured';
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/sort-select.tsx` at line 32, Update the currentSort
initialization in the sort-select component to validate the URL sort value
against SORT_OPTIONS rather than casting it to CatalogSortOption. Use the
validated option when present and fall back to 'featured' for missing or
unsupported values, keeping the Select value synchronized with the displayed
sort.
```

</details>

<!-- cr-comment:v1:035163513751cbedd17fbf77 -->

</blockquote></details>
<details>
<summary>src/components/catalog/brand-filter.tsx (1)</summary><blockquote>

`37-45`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _💤 Low value_

**The product count lookup can never match the slug fallback.**

`brandProductCounts` is keyed only by `p.brandId` at Line 41. The `brandProductCounts.get(brand.slug)` fallback at Line 101 is therefore dead unless `brandId` stores slugs. Either populate both keys, or drop the fallback.

<details>
<summary>♻️ Proposed simplification</summary>

```diff
-            const count = brandProductCounts.get(brand.id) ?? brandProductCounts.get(brand.slug) ?? 0;
+            const count = brandProductCounts.get(brand.id) ?? 0;
```
</details>





Also applies to: 98-101

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/brand-filter.tsx` around lines 37 - 45, Update the
brand count lookup around brandProductCounts and the brand rendering logic to
use one consistent key: either populate counts by both brandId and slug, or
remove the brand.slug fallback and rely solely on brandId. Prefer removing the
unreachable fallback unless brandId is explicitly documented to contain slugs.
```

</details>

<!-- cr-comment:v1:aad616ba35a4a3be2b5d8521 -->

</blockquote></details>
<details>
<summary>src/components/catalog/mobile-filter-drawer.tsx (1)</summary><blockquote>

`95-113`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Reset the staged state in the open handler, not in an effect.**

ESLint reports `react-hooks/set-state-in-effect` at Line 98. Opening the drawer currently renders once, then sets six states, then renders again. Move the reset into the `onOpenChange` handler so the state is set from the event.

<details>
<summary>♻️ Proposed refactor</summary>

```diff
-  // Re-sync staged state whenever drawer opens
-  React.useEffect(() => {
-    if (isOpen) {
-      setStagedCategories(activeCategoryList);
-      setStagedBrands(activeBrandList);
-      setStagedGoals(activeGoalList);
-      setStagedMinPrice(activeMinPrice);
-      setStagedMaxPrice(activeMaxPrice);
-      setStagedInStock(activeInStock);
-    }
-  }, [
-    isOpen,
-    activeCategoryList,
-    activeBrandList,
-    activeGoalList,
-    activeMinPrice,
-    activeMaxPrice,
-    activeInStock,
-  ]);
+  // Re-sync staged state whenever the drawer opens
+  const handleOpenChange = (open: boolean) => {
+    if (open) {
+      setStagedCategories(activeCategoryList);
+      setStagedBrands(activeBrandList);
+      setStagedGoals(activeGoalList);
+      setStagedMinPrice(activeMinPrice);
+      setStagedMaxPrice(activeMaxPrice);
+      setStagedInStock(activeInStock);
+    }
+    setIsOpen(open);
+  };
```

Then pass the handler to the sheet:

```diff
-    <Sheet open={isOpen} onOpenChange={setIsOpen}>
+    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
```
</details>

Based on the retrieved learning that lint issues must be fixed at the verification gate.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/catalog/mobile-filter-drawer.tsx` around lines 95 - 113,
Remove the state-resetting React.useEffect and move its six staged-state
assignments into the drawer’s onOpenChange handler, applying them when the
handler receives the open state. Pass that handler to the sheet while preserving
the existing open/close behavior and active filter values.
```

</details>

<!-- cr-comment:v1:bbd7ec6e0ceaeb09c671bb7c -->

_Sources: Learnings, Linters/SAST tools_

</blockquote></details>
<details>
<summary>src/lib/analytics.ts (1)</summary><blockquote>

`59-68`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _💤 Low value_

**Consider a structured logger or a debug flag for the development log.**

The `console.log` runs on every event in development. This is acceptable. If the volume becomes noisy, gate it behind an explicit `NEXT_PUBLIC_ANALYTICS_DEBUG` flag.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/lib/analytics.ts` around lines 59 - 68, Gate the development-only
console.log in trackEvent behind the explicit NEXT_PUBLIC_ANALYTICS_DEBUG flag,
while preserving the existing non-production check and event payload logging
when debugging is enabled.
```

</details>

<!-- cr-comment:v1:0f2b9cc59f61ff4d96e14adf -->

</blockquote></details>
<details>
<summary>src/components/product/product-sticky-bar.tsx (2)</summary><blockquote>

`52-57`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Add safe-area padding for devices with a home indicator.**

The bar is fixed to `bottom-0`. On iOS devices with a home indicator, the system gesture area overlaps the CTA. Add `pb-[env(safe-area-inset-bottom)]` or an equivalent utility.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-sticky-bar.tsx` around lines 52 - 57, Update
the fixed container in the product sticky bar’s className to include bottom
padding based on env(safe-area-inset-bottom), such as the equivalent safe-area
utility, while preserving the existing spacing and responsive behavior.
```

</details>

<!-- cr-comment:v1:b606d297f1b498d751de42c7 -->

---

`3-7`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Correct the breakpoint comment and extract the shared price derivation.**

The comment states "<640px / md:hidden", but `md:hidden` hides the bar at 768px and above, not 640px. Update the comment to `<768px`.

Lines 30-34 duplicate the active price and discount derivation from `src/components/product/product-detail-view.tsx` Lines 64-70 and `src/app/products/[slug]/page.tsx` Lines 33-36. Extract one helper, for example `resolveVariantPricing(variant)`, and reuse it.





Also applies to: 30-34

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-sticky-bar.tsx` around lines 3 - 7, Update the
header comment in the mobile sticky action bar to state the breakpoint as
<768px. Extract the duplicated active-price and discount derivation from the
sticky bar into a shared resolveVariantPricing(variant) helper, then reuse that
helper in product-sticky-bar.tsx, product-detail-view.tsx, and the product page
while preserving the existing pricing behavior.
```

</details>

<!-- cr-comment:v1:3edc33cbc98381c6e91025d1 -->

</blockquote></details>
<details>
<summary>src/components/product/product-stock-status.tsx (1)</summary><blockquote>

`1-1`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _💤 Low value_

**Remove the `'use client'` directive.**

This component renders static markup. It has no state, no effects, and no event handlers. The coding guidelines require Server Components by default and `'use client'` only on interactive leaf components. Removing the directive keeps the component out of the client bundle when a Server Component renders it.

Note: `src/components/product/product-detail-view.tsx` is a Client Component, so this component is still bundled for the client when rendered from there. The directive is still unnecessary.

As per coding guidelines: "Use Server Components by default and add `'use client'` only to interactive leaf components".

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-stock-status.tsx` at line 1, Remove the 'use
client' directive from the product stock status component so it remains a Server
Component by default; leave its static markup implementation unchanged.
```

</details>

<!-- cr-comment:v1:cbd27a60596cdd56285049c4 -->

_Source: Coding guidelines_

</blockquote></details>
<details>
<summary>src/components/product/product-detail-view.tsx (1)</summary><blockquote>

`56-61`: _🎯 Functional Correctness_ | _🔵 Trivial_ | _⚡ Quick win_

**State does not resynchronize when `product` changes.**

`selectedVariant` is initialized once. If Next.js reuses this component instance across two product routes, the previous variant persists and the price, gallery, and WhatsApp URL become wrong for the new product. Add a key on the component at the route level, or reset the state when `product.id` changes.

<details>
<summary>♻️ Proposed fix</summary>

```diff
   const [selectedVariant, setSelectedVariant] =
     React.useState<ProductVariant>(defaultVariant);
+
+  // Reset the selection when the rendered product changes.
+  const [renderedProductId, setRenderedProductId] = React.useState(product.id);
+  if (renderedProductId !== product.id) {
+    setRenderedProductId(product.id);
+    setSelectedVariant(defaultVariant);
+  }
```
</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-detail-view.tsx` around lines 56 - 61, Ensure
selectedVariant is resynchronized when the product changes by resetting it to
the new product’s default variant whenever product.id changes, or by supplying a
route-level key that remounts the component per product. Update the
selectedVariant state flow while preserving the existing defaultVariant
selection behavior.
```

</details>

<!-- cr-comment:v1:226953fa865168555fbfa7e4 -->

</blockquote></details>
<details>
<summary>src/components/product/product-specs.tsx (1)</summary><blockquote>

`24-69`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Add ARIA tab semantics to the tab navigation.**

The buttons implement a tab pattern, but they miss `role="tab"`, `aria-selected`, and `aria-controls`. The panels at Lines 75, 102, and 138 miss `role="tabpanel"`. Screen reader users cannot perceive the tab relationship. Add `role="tablist"` on the `nav`, and pair each button with its panel.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-specs.tsx` around lines 24 - 69, Add ARIA tab
semantics in the product specs tab navigation: set the nav role to tablist, give
each tab button role="tab", aria-selected based on activeTab, and a unique
aria-controls value. Update the corresponding panels in the active-tab content
sections to role="tabpanel" with matching IDs, preserving the existing
tab-to-panel relationships for nutrition, usage, and authenticity.
```

</details>

<!-- cr-comment:v1:9b5635a934439975846d005b -->

</blockquote></details>
<details>
<summary>src/app/products/[slug]/page.tsx (1)</summary><blockquote>

`33-37`: _🩺 Stability & Availability_ | _🔵 Trivial_ | _⚡ Quick win_

**Reuse the shared NPR formatter.**

`ProductSchema` guarantees a non-empty `variants` array and a matching `defaultVariantId`, so no variant guard is needed.

Use `formatNprPrice(activePrice)` instead of duplicating `toLocaleString` formatting. This preserves the canonical NPR formatting and rounding behavior.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/app/products/`[slug]/page.tsx around lines 33 - 37, In the product price
calculation, keep the existing defaultVariant selection and activePrice logic,
then replace the local NPR template using toLocaleString with the shared
formatNprPrice(activePrice) helper. Rely on ProductSchema’s guaranteed matching
variant without adding a guard.
```

</details>

<!-- cr-comment:v1:ca26cc3bc219a2455b6ec26c -->

</blockquote></details>
<details>
<summary>src/components/product/product-authenticity-badge.tsx (1)</summary><blockquote>

`1-1`: _📐 Maintainability & Code Quality_ | _🔵 Trivial_ | _⚡ Quick win_

**Remove the unnecessary client boundary.**

`ProductAuthenticityBadge` uses no client-only APIs. Its current consumers already define client boundaries. Remove `'use client'` to keep this component server-compatible by default.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

In `@src/components/product/product-authenticity-badge.tsx` at line 1, Remove the
unnecessary 'use client' directive from ProductAuthenticityBadge so the
component remains server-compatible by default; leave its component
implementation and existing consumer boundaries unchanged.
```

</details>

<!-- cr-comment:v1:2411909e100ed25fbe6b64d5 -->

_Source: Coding guidelines_

</blockquote></details>

</blockquote></details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->



> [!CAUTION]
> Some comments are outside the diff and can’t be posted inline due to platform limitations.
> 
> 
> 
> <details>
> <summary>⚠️ Outside diff range comments (2)</summary><blockquote>
> 
> <details>
> <summary>src/components/catalog/search-bar.tsx (1)</summary><blockquote>
> 
> `132-139`: _🎯 Functional Correctness_ | _🟡 Minor_ | _⚡ Quick win_
> 
> **Keep all interactive controls at least 44×44px.**
> 
> The clear button removes its minimum size at `sm` and above. The view-all link has a 36px content-and-padding height.
> 
> - `src/components/catalog/search-bar.tsx#L132-L139`: remove `sm:min-h-0 sm:min-w-0` so the clear button remains 44×44px.
> - `src/components/catalog/search-bar.tsx#L218-L225`: add `min-h-11` and align the link content within that height.
> 
> As per coding guidelines, standard buttons and links must have minimum 44×44px touch targets.
> 
> <details>
> <summary>🤖 Prompt for AI Agents</summary>
> 
> ```
> Verify each finding against current code. Fix only still-valid issues, skip the
> rest with a brief reason, keep changes minimal, and validate.
> 
> In `@src/components/catalog/search-bar.tsx` around lines 132 - 139, Keep both
> interactive controls in search-bar.tsx at the required 44×44px touch target: in
> the clear button near lines 132-139, remove sm:min-h-0 sm:min-w-0 so its minimum
> dimensions remain active at larger breakpoints; in the view-all link near lines
> 218-225, add min-h-11 and align its content within that height.
> ```
> 
> </details>
> 
> <!-- cr-comment:v1:43be5d7a6f82c31cd1d7b24b -->
> 
> _Source: Coding guidelines_
> 
> </blockquote></details>
> <details>
> <summary>src/components/catalog/mobile-filter-drawer.tsx (1)</summary><blockquote>
> 
> `256-274`: _🎯 Functional Correctness_ | _🟠 Major_ | _⚡ Quick win_
> 
> **Use keyboard-operable controls for staged filters.**
> 
> These `label` elements do not contain or reference native inputs. Their `onClick` handlers only support pointer interaction. Keyboard users cannot select categories, goals, or the in-stock filter.
> 
> - `src/components/catalog/mobile-filter-drawer.tsx#L256-L274`: use a controlled checkbox or a `button` with `aria-pressed` for each category.
> - `src/components/catalog/mobile-filter-drawer.tsx#L301-L319`: use a controlled checkbox or a `button` with `aria-pressed` for each fitness goal.
> - `src/components/catalog/mobile-filter-drawer.tsx#L388-L408`: use a native checkbox or switch control for `stagedInStock`.
> 
> <details>
> <summary>🤖 Prompt for AI Agents</summary>
> 
> ```
> Verify each finding against current code. Fix only still-valid issues, skip the
> rest with a brief reason, keep changes minimal, and validate.
> 
> In `@src/components/catalog/mobile-filter-drawer.tsx` around lines 256 - 274,
> Replace the non-interactive label controls in the category filter at
> src/components/catalog/mobile-filter-drawer.tsx#L256-L274 and fitness-goal
> filter at `#L301-L319` with controlled checkbox inputs or buttons using
> aria-pressed, preserving their existing staged toggle handlers and checked
> states. Replace the stagedInStock control at `#L388-L408` with a native checkbox
> or switch control so all three filters support keyboard interaction.
> ```
> 
> </details>
> 
> <!-- cr-comment:v1:289a2ddc371b8796a64ea6df -->
> 
> </blockquote></details>
> 
> </blockquote></details>

<details>
<summary>🤖 Prompt for all review comments with AI agents</summary>

```
Verify each finding against current code. Fix only still-valid issues, skip the
rest with a brief reason, keep changes minimal, and validate.

Outside diff comments:
In `@src/components/catalog/mobile-filter-drawer.tsx`:
- Around line 256-274: Replace the non-interactive label controls in the
category filter at src/components/catalog/mobile-filter-drawer.tsx#L256-L274 and
fitness-goal filter at `#L301-L319` with controlled checkbox inputs or buttons
using aria-pressed, preserving their existing staged toggle handlers and checked
states. Replace the stagedInStock control at `#L388-L408` with a native checkbox
or switch control so all three filters support keyboard interaction.

In `@src/components/catalog/search-bar.tsx`:
- Around line 132-139: Keep both interactive controls in search-bar.tsx at the
required 44×44px touch target: in the clear button near lines 132-139, remove
sm:min-h-0 sm:min-w-0 so its minimum dimensions remain active at larger
breakpoints; in the view-all link near lines 218-225, add min-h-11 and align its
content within that height.
```

</details>

---

<details>
<summary>ℹ️ Review info</summary>

<details>
<summary>⚙️ Run configuration</summary>

**Configuration used**: defaults

**Review profile**: CHILL

**Plan**: Pro Plus

**Run ID**: `0be48521-985a-46b3-b33b-3acc7169565a`

</details>

<details>
<summary>📥 Commits</summary>

Reviewing files that changed from the base of the PR and between faab3c993a2819db95883506f672a0bfeec75850 and d8692fde453c6d033d04eca09b9b924609916164.

</details>

<details>
<summary>📒 Files selected for processing (10)</summary>

* `src/app/categories/page.tsx`
* `src/app/products/page.tsx`
* `src/components/catalog/catalog-filters.tsx`
* `src/components/catalog/mobile-filter-drawer.tsx`
* `src/components/catalog/search-bar.tsx`
* `src/components/catalog/search-modal.tsx`
* `src/components/product/authenticity-guarantee-box.tsx`
* `src/components/product/product-card.tsx`
* `src/components/product/product-detail-view.tsx`
* `src/components/product/product-sticky-bar.tsx`

</details>

<details>
<summary>💤 Files with no reviewable changes (1)</summary>

* src/app/categories/page.tsx

</details>

<details>
<summary>🚧 Files skipped from review as they are similar to previous changes (7)</summary>

* src/app/products/page.tsx
* src/components/product/product-sticky-bar.tsx
* src/components/product/product-detail-view.tsx
* src/components/product/authenticity-guarantee-box.tsx
* src/components/product/product-card.tsx
* src/components/catalog/catalog-filters.tsx
* src/components/catalog/search-modal.tsx

</details>

</details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->