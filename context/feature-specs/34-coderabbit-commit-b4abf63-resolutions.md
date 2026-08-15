# Feature Spec 34: CodeRabbit Commit b4abf63 Review Resolutions & Technical Synchronization

> **Spec ID:** `34-coderabbit-commit-b4abf63-resolutions`  
> **Target Sub-Phase / Branch:** `Phase 5` Technical Cleanup & Context Synchronization (`Phase-5` branch)  
> **Status:** Approved  
> **Created Date:** 2026-08-10  
> **Author:** AI Coding Agent (Antigravity IDE)

---

## Executive Summary

Following commit `b4abf63` (Phase 5 Server Actions & Notification Pipeline completion audit), CodeRabbit performed an automated review across codebase implementation files, datasets, components, and context specifications, returning **42 review findings** (2 Critical runtime/API issues and 40 Minor functional, data, UX, and documentation items).

This specification details the complete technical remediation plan for all 42 findings across:
1. **Critical Runtime Bugs:** Telegram Bot API MarkdownV2 syntax error fix in `telegram.ts`; empty query catalog restoration and brand/category display name matching in `products.ts`; `parseInt` `NaN` parameter corruption prevention in `catalog-filters.tsx` and `mobile-filter-drawer.tsx`; `selectedIndex` clamping in `product-gallery.tsx`.
2. **Data & Schema Integrity:** Correction of `"Egg Creatine"` typo to `"Egg Albumin"` in `products.json`; Psychotic Gold serving weight math reconciliation in `products.json`; removal of hardcoded placeholder phone `+977 9800000000` from `faqs.json`; strict ISO datetime validation for `submittedAt` in `inquiry.ts`; schema validation for `opens`/`closes` in `store.ts`.
3. **UX, Touch Sizing & Accessibility:** Enforcing $\ge 44\text{px}$ touch targets for `SelectItem` in `select.tsx`; fixing size metric overrides on `<Button variant="link">` in `button.tsx`; preserving `0%` daily values in `nutrition-table.tsx`; marking thumbnail as decorative in `product-sticky-bar.tsx`; centralizing product placeholder image paths; removing overlap between search input controls and `DialogContent` close button in `search-modal.tsx`.
4. **Routing & Links:** Updating footer category slugs (`proteins`, `mass-gainers`) and legal routes (`/privacy-policy`, `/delivery-policy`) in `footer.tsx`; replacing unmapped `/authenticity` link in `navbar.tsx` and `mobile-nav.tsx`.
5. **Context & Documentation Sync:** Synchronizing sub-phase count totals and state matrix in `feature-roadmap.md`; updating project status in `project-overview.md`; replacing absolute Windows path links in `project-tech-stacks.md`; fixing closing summary tag in `from-commit-d8692fd.md`.

---

## 1. Itemized Remediation Plan

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/lib/services/telegram.ts` | **[MODIFY]** | Escape hyphens in `*--- Product Context ---*` to `*Product Context*` to prevent Telegram API MarkdownV2 parsing errors. |
| 2 | `src/lib/data/products.ts` | **[MODIFY]** | Return full catalog when `query` is empty; search against resolved brand and category display names in addition to IDs. |
| 3 | `src/lib/validations/inquiry.ts` | **[MODIFY]** | Enforce ISO datetime format on `submittedAt` field using `z.string().datetime()`. |
| 4 | `src/lib/validations/store.ts` | **[MODIFY]** | Restrain `opens` and `closes` to valid 12-hour/24-hour time formats or `"Contact Store"`. |
| 5 | `data/products.json` | **[MODIFY]** | Fix ON Serious Mass ingredient typo (`"Egg Creatine"` -> `"Egg Albumin"`); reconcile Psychotic Gold scoop weight ($6.67\text{g}$) / container weight ($200\text{g}$). |
| 6 | `data/faqs.json` | **[MODIFY]** | Remove hardcoded `+977 9800000000` placeholder phone from Saturday store hours answer. |
| 7 | `src/components/layout/footer.tsx` | **[MODIFY]** | Align footer category query slugs (`proteins`, `mass-gainers`) and legal routes (`/privacy-policy`, `/delivery-policy`). |
| 8 | `src/components/layout/navbar.tsx` | **[MODIFY]** | Remove or replace unmapped `/authenticity` navigation link with an approved active route. |
| 9 | `src/components/layout/mobile-nav.tsx` | **[MODIFY]** | Remove or replace unmapped `/authenticity` mobile drawer link to match desktop navigation. |
| 10 | `src/components/ui/select.tsx` | **[MODIFY]** | Enforce minimum $44\text{px}$ touch target height (`min-h-11`) on `SelectItem` rows. |
| 11 | `src/components/ui/button.tsx` | **[MODIFY]** | Prevent `default` size metrics (`h-11 px-5`) from overriding `p-0 h-auto` on `link` variant. |
| 12 | `src/components/ui/badge.tsx` | **[MODIFY]** | Adjust `authentic` and `stock` amber badge styling to ensure WCAG AA contrast over dark surfaces. |
| 13 | `src/components/product/nutrition-table.tsx` | **[MODIFY]** | Use nullish coalescing (`??`) for `dailyValuePercentage` to preserve valid `0%` entries. |
| 14 | `src/components/product/product-sticky-bar.tsx` | **[MODIFY]** | Set `alt=""` on thumbnail image to mark decorative; centralize placeholder image path. |
| 15 | `src/components/product/product-gallery.tsx` | **[MODIFY]** | Clamp `selectedIndex` against `normalizedImages.length` to prevent stale out-of-bounds indices when product changes. |
| 16 | `src/components/product/product-card.tsx` | **[MODIFY]** | Use centralized product placeholder image path constant. |
| 17 | `src/components/catalog/catalog-filters.tsx` | **[MODIFY]** | Guard `parseInt` with `Number.isFinite` to prevent writing `"NaN"` into URL query parameters. |
| 18 | `src/components/catalog/mobile-filter-drawer.tsx` | **[MODIFY]** | Validate and clamp staged price inputs; handle non-numeric input and min > max swapping. |
| 19 | `src/components/catalog/active-filters.tsx` | **[MODIFY]** | Read only canonical `search` parameter key; remove unhonored `q` and `searchQuery` alias handlers. |
| 20 | `src/components/catalog/search-modal.tsx` | **[MODIFY]** | Add right padding to search input bar to prevent overlap with `DialogContent` close button; use centralized placeholder path. |
| 21 | `src/scripts/validate-catalog-accessors.ts` | **[MODIFY]** | Add explicit identity and filter assertions for catalog accessors before reporting test success. |
| 22 | `src/scripts/validate-pdp-components.ts` | **[MODIFY]** | Render product components via `react-dom/server` static output assertions before reporting validation success. |
| 23 | `context/feature-roadmap.md` | **[MODIFY]** | Synchronize sub-phase count totals and state matrix with detailed phase sections. |
| 24 | `context/project-overview.md` | **[MODIFY]** | Update "CURRENT PROJECT STATUS" section to reflect active Phase 5 status. |
| 25 | `context/project-tech-stacks.md` | **[MODIFY]** | Replace absolute Windows path link (`file:///c:/...`) with repository-relative link (`../AGENTS.md`). |
| 26 | `context/coderabbit-comments/from-commit-d8692fd.md` | **[MODIFY]** | Fix malformed closing `summary` tag on line 1108 (`</parameter>` -> `</summary>`). |
| 27 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 34 in specification index. |
| 28 | `context/progress-tracker.md` | **[MODIFY]** | Record Spec 34 authoring and commit `b4abf63` resolution progress. |

---

## 2. Technical Remediation Details

### Step 1: Telegram MarkdownV2 Fix & Accessor Engine Hardening

- **`src/lib/services/telegram.ts`:**
  Replace `productDetails = "\n*--- Product Context ---\n" + lines.join("\n");` with `productDetails = "\n*Product Context*\n" + lines.join("\n");`. This eliminates unescaped hyphens (`-`) which trigger Telegram API HTTP 400 Bad Request errors.
- **`src/lib/data/products.ts`:**
  Update `searchProductsInMemory(query)`:
  ```ts
  export async function searchProductsInMemory(query: string): Promise<Product[]> {
    if (!query || !query.trim()) return validatedProducts;

    const normalized = query.trim().toLowerCase();

    return validatedProducts.filter((product) => {
      const brand = getBrandById(product.brandId);
      const category = getCategoryById(product.categoryId);

      const nameMatch = product.name.toLowerCase().includes(normalized);
      const brandIdMatch = product.brandId.toLowerCase().includes(normalized);
      const brandNameMatch = brand?.name.toLowerCase().includes(normalized) ?? false;
      const catIdMatch = product.categoryId.toLowerCase().includes(normalized);
      const catNameMatch = category?.name.toLowerCase().includes(normalized) ?? false;
      const tagMatch = product.tags.some((tag) => tag.toLowerCase().includes(normalized));
      const highlightMatch = product.highlights.some((h) => h.toLowerCase().includes(normalized));
      const flavorMatch = product.variants.some((v) => v.flavor.toLowerCase().includes(normalized));

      return (
        nameMatch ||
        brandIdMatch ||
        brandNameMatch ||
        catIdMatch ||
        catNameMatch ||
        tagMatch ||
        highlightMatch ||
        flavorMatch
      );
    });
  }
  ```

### Step 2: Schema & Data Integrity Hardening

- **`src/lib/validations/inquiry.ts`:**
  Change `submittedAt: z.string()` to `submittedAt: z.string().datetime()`.
- **`src/lib/validations/store.ts`:**
  Update `OpeningHourItemSchema`:
  ```ts
  const timeRegex = /^(?:1[0-2]|0?[1-9]):[0-5][0-9]\s*(?:AM|PM)$|^(?:[01]?[0-9]|2[0-3]):[0-5][0-9]$/i;
  export const OpeningHourItemSchema = z.object({
    day: z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
    opens: z.string().refine((val) => val === 'Contact Store' || timeRegex.test(val), {
      message: 'Must be a valid time or "Contact Store"',
    }),
    closes: z.string().refine((val) => val === 'Contact Store' || timeRegex.test(val), {
      message: 'Must be a valid time or "Contact Store"',
    }),
    isClosed: z.boolean(),
  });
  ```
- **`data/products.json`:**
  - Replace `"Egg Creatine"` with `"Egg Albumin"` in ON Serious Mass ingredients string (line 670).
  - Update Psychotic Gold `nutritionFacts.servingSize` to `"1 Scoop (6.67g)"` so $6.67\text{g}$ serving size (rounded representation of $200\text{g} / 30 = 6.666...\text{g}$) aligns with `sizeOrWeight: "200g (30 Servings)"`.
- **`data/faqs.json`:**
  - Remove hardcoded `+977 9800000000` text from `faq_payment_store_3` answer.

### Step 3: Component Sizing, Accessibility & UX Hardening

- **`src/components/ui/select.tsx`:**
  Add `min-h-11` to `SelectItem` class string to guarantee $\ge 44\text{px}$ touch target height.
- **`src/components/ui/button.tsx`:**
  Add `inline: "h-auto p-0"` size variant to `buttonVariants` and configure `link` variant with `inline` size.
- **`src/components/product/nutrition-table.tsx`:**
  Change `{item.dailyValuePercentage ? item.dailyValuePercentage : '†'}` to `{item.dailyValuePercentage ?? '†'}`.
- **`src/components/product/product-gallery.tsx`:**
  Add `React.useEffect` to clamp `selectedIndex`:
  ```ts
  React.useEffect(() => {
    if (selectedIndex >= normalizedImages.length) {
      setSelectedIndex(Math.max(0, normalizedImages.length - 1));
    }
  }, [normalizedImages.length, selectedIndex]);
  ```
- **`src/components/catalog/catalog-filters.tsx`:**
  Safely parse prices:
  ```ts
  const parsePrice = (raw: string): number | null => {
    if (!raw) return null;
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
  };
  ```
- **`src/components/layout/footer.tsx`:**
  Update category hrefs:
  - `"Whey Protein"` -> `/products?category=proteins`
  - `"Mass Gainers"` -> `/products?category=mass-gainers`
  Update legal hrefs:
  - `"Privacy Policy"` -> `/privacy-policy`
  - `"Delivery & Returns"` -> `/delivery-policy`
- **`src/components/layout/navbar.tsx` & `mobile-nav.tsx`:**
  Remove `{ label: "Authenticity", href: "/authenticity" }` from navigation arrays until an official route is established.

---

## 3. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| **Breaking Search behavior** | Validate `searchProductsInMemory` with empty and brand display name queries using `validate-catalog-accessors.ts`. |
| **Telegram alert regression** | Test Telegram alert dispatcher payload formatting with product context via `validate-notification-services.ts`. |
| **Link regression** | Verify footer and navbar links resolve to active SSG routes during `npm run build`. |

---

## 4. Verification Plan

1. **Type Check:** `npx tsc --noEmit` returns 0 errors.
2. **Validation Suite:** Run project validation scripts:
   - `npx tsx src/scripts/validate-supplementary-datasets.ts`
   - `npx tsx src/scripts/validate-catalog-accessors.ts`
   - `npx tsx src/scripts/validate-notification-services.ts`
   - `npx tsx src/scripts/validate-server-actions.ts`
3. **Build Check:** `npm run build` completes successfully with full static pre-rendering.
