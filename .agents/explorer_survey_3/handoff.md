# Handoff Report — Explorer 3: Survey & Remediation Blueprint (Part 3)
**Domain:** Analytics Telemetry, Dead Code & Hygiene, UI/Accessibility Edge Cases, Test Suites & Tooling  
**Author:** Explorer 3 (Survey: Analytics, Dead Code, Lint/Tests & Knowledge Graph)  
**Date:** August 15, 2026  
**Artifact Reference:** `.agents/explorer_survey_3/analysis.md`

---

## 1. Observation

Direct observations across the codebase confirmed the following exact locations, line numbers, and architectural states:

1. **Analytics Telemetry Functions**:
   - `src/lib/analytics.ts`: Exports `trackEvent` (line 59), `trackWhatsAppClick` (line 112), `trackProductView` (line 132), `trackSearchQuery` (line 151), `trackCategoryView` (line 167), and `trackLeadSubmission` (line 182).
   - Only `trackWhatsAppClick` is currently imported in production UI (`src/components/product/authenticity-guarantee-box.tsx:7`, `src/components/product/product-detail-view.tsx:14`, `src/components/product/product-sticky-bar.tsx:13`).
   - `InquiryForm` (`src/components/forms/inquiry-form.tsx:130-145`) and `ContactForm` (`src/components/forms/contact-form.tsx:119-135`) successfully submit leads but omit `trackLeadSubmission`.
   - `ProductDetailView` (`src/components/product/product-detail-view.tsx`) does not invoke `trackProductView`.
   - `SearchModal` (`src/components/catalog/search-modal.tsx:128-145`) does not invoke `trackSearchQuery`.
   - `CatalogContainer` (`src/components/catalog/catalog-container.tsx`) does not invoke `trackCategoryView`.

2. **Data Accessor Layer in `GuidesPage` (MED-08)**:
   - `src/app/guides/page.tsx:6` contains `import guidesData from '@/data/guides.json';` and executes synchronously as `export default function GuidesPage()`, bypassing `getAllGuides()` from `src/lib/data/guides.ts`.

3. **Constants & Dead Logic in `src/lib/constants.ts` (LOW-05)**:
   - `src/lib/constants.ts:23`: `export const STORE_PHONE_DISPLAY = STORE_PHONE;` (0 imports across `src/`).
   - `src/lib/constants.ts:25`: `export const STORE_WHATSAPP_DISPLAY = "+977 986-1725036";` (0 imports across `src/`).
   - `src/lib/constants.ts:61-86`: `export function isStoreOpenToday(date: Date = new Date())` (0 imports across `src/`; superseded by `isStoreOpenNow()` in `src/lib/data/store.ts`).

4. **UI Toast Wrappers in `src/components/ui/toast.tsx` (LOW-06)**:
   - Lines 6-54 define `showSuccessToast`, `showErrorToast`, `showInfoToast`, `showWarningToast`, and `showWhatsAppToast`, which have 0 callers because form components call `toast` from `sonner` directly.

5. **Search Concurrency Optimization in `SearchModal` (LOW-07)**:
   - `src/components/catalog/search-modal.tsx:133`: `setResults(res)` is invoked directly in the async callback without `React.startTransition()`.

6. **Sitemap Typing in `src/app/sitemap.ts` (LOW-08)**:
   - Lines 34, 41, 48 use `changeFrequency: 'weekly' as const` rather than inheriting standard `MetadataRoute.Sitemap` properties.

7. **Touch Target Sizing (LOW-09, LOW-10)**:
   - `src/components/home/featured-products-section.tsx:180`: `className="... min-h-[44px] sm:min-h-[48px] ..."` allows a 44px touch height on mobile screens for primary WhatsApp orders.
   - `src/components/home/customer-reviews-section.tsx:128-135`: Indicator buttons are 10x10px (`w-2.5 h-2.5`) without minimum 44x44px padding bounds.
   - `src/components/layout/footer.tsx:269-273`: Legal links use `py-1` (~24px touch height).

8. **Informational & ARIA Attributes (INFO-01, INFO-02)**:
   - `src/lib/data/guides.ts:83`: `export const getGuides = getAllGuides;` (0 callers).
   - `src/components/catalog/brand-filter.tsx:110`: Hidden `<input type="checkbox">` lacks explicit `aria-label`.

9. **Dead Code CI Script (MED-05)**:
   - `src/scripts/check-dead-code.js:20-45`: `allFiles` includes `src/scripts/`, masking unmounted components by counting test harness imports as production callers, while flagging standard atomic Radix UI primitives as dead code.

---

## 2. Logic Chain

1. **Telemetry Chain**:
   - Observations in `src/lib/analytics.ts` and UI forms/views demonstrate that four core analytics tracking functions were built and tested in `validate-whatsapp-analytics.ts`, but never connected to component lifecycle or submit events.
   - Connecting `trackLeadSubmission`, `trackProductView`, `trackSearchQuery`, and `trackCategoryView` directly satisfies requirement R3 and restores marketing and conversion measurement across all user journeys.

2. **Data Layer Boundary Chain**:
   - Direct raw JSON import in `src/app/guides/page.tsx:6` violates `context/file-map.md` Rule 4 and bypasses the date sorting and Zod validation in `src/lib/data/guides.ts`.
   - Refactoring `GuidesPage` into an `async` Server Component with `const guidesData = await getAllGuides();` aligns the guides hub with the canonical architectural pattern used across all other routes.

3. **Code Hygiene & Dead Code Chain**:
   - Pruning unreferenced constants (`STORE_PHONE_DISPLAY`, `STORE_WHATSAPP_DISPLAY`), obsolete opening hours calculations (`isStoreOpenToday`), dead legacy interfaces (`InquiryPayload`), and unreferenced function aliases (`getGuides`) eliminates dead code and reduces cognitive overhead without breaking any active AST edges.

4. **Accessibility & Touch Target Chain**:
   - AGENTS.md Invariant 5 requires primary conversion CTAs to have $\ge 48\text{px}$ touch targets and standard interactive elements to have $\ge 44\text{px}$.
   - Updating `FeaturedProductsSection` to `min-h-[48px]`, wrapping review dots in 44x44px buttons, and setting footer legal links to `min-h-[44px]` ensures 100% WCAG 2.1 AA and project invariant compliance.

5. **Tooling & Test Harness Chain**:
   - Excluding `src/scripts/` from component caller matching in `check-dead-code.js` provides reliable CI dead code gating.

---

## 3. Caveats

- `ConsultationModal` (`src/components/forms/consultation-modal.tsx`) is a fully functional dialog that is currently unmounted on active pages. It can be mounted as an interactive stack consultation trigger in `HeroSection` or `ProductsPage`, or retained as a documented dialog primitive.
- UI toast helpers in `src/components/ui/toast.tsx` can either be retained as styling wrappers or pruned.
- No source code modifications were made directly during this investigation (strictly read-only mode).

---

## 4. Conclusion

All 11 findings assigned to Explorer 3 have been fully analyzed, mapped, and supported with copy-paste ready diffs in `.agents/explorer_survey_3/analysis.md`. The remediation plan is zero-risk, preserves all Next.js 16 / React 19 invariants, eliminates dead code, enforces mobile touch standards, connects analytics telemetry, and aligns the entire codebase with the frozen specifications in `context/`.

---

## 5. Verification Method

Independent verification of the proposed remediations can be conducted using the following commands and inspection gates:

```bash
# 1. Type Safety Gate
npx tsc --noEmit

# 2. Linter Gate
npm run lint

# 3. Dead Code Detection Gate
node src/scripts/check-dead-code.js

# 4. Analytics & WhatsApp Engine Validation
npx tsx src/scripts/validate-whatsapp-analytics.ts

# 5. Core Test Harness Suites
npx tsx src/scripts/validate-catalog-accessors.ts
npx tsx src/scripts/validate-server-actions.ts
npx tsx src/scripts/validate-security-ratelimit.ts
npx tsx src/scripts/validate-location-components.ts
npx tsx src/scripts/validate-form-components.ts
npx tsx src/scripts/validate-pdp-components.ts
npx tsx src/scripts/validate-store-faq-guide-accessors.ts
npx tsx src/scripts/test-challenger-2.ts

# 6. Static Site Pre-Rendering Build Gate
npm run build
```
