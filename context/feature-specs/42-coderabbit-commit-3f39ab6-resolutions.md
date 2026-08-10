# Feature Spec 42: CodeRabbit Commit 3f39ab6 Review Resolutions & Technical Synchronization

> **Spec ID:** 42-coderabbit-commit-3f39ab6-resolutions  
> **Target Sub-Phase / Branch:** Quality & Technical Cleanup (Commit `3f39ab6` Resolutions)  
> **Status:** Approved  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI Agent  

---

## Executive Summary

This specification addresses all 43 Major and Critical review findings from CodeRabbit commit `3f39ab6` ([`context/coderabbit-comments/from-commit- 3f39ab6.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/coderabbit-comments/from-commit-%203f39ab6.md)). 

Key issues resolved include:
1. Preventing silent lead loss in Server Actions (`submitInquiryAction`, `submitContactAction`) when all notification dispatches fail.
2. Fixing Telegram MarkdownV2 hyphen escaping (`-`) and adding `AbortController` timeouts to fetch calls.
3. Eliminating unsubstantiated authenticity claims on products with absent or partial authenticity metadata.
4. Eliminating the router navigation collision on the header search trigger button.
5. Fixing keyboard and WAI-ARIA accessibility on brand filter checkbox controls.
6. Integrating fuzzy text search in catalog filtering.
7. Guarding against stale asynchronous search response race conditions.
8. Reconciling brand ID mismatches in `data/products.json` and dangling product slugs in `data/guides.json`.
9. Unifying store delivery threshold rules across page components.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/actions/inquiry.ts` | **[MODIFY]** | Check `Promise.allSettled` results & return `success: false` if all notification channels fail. |
| 2 | `src/actions/contact.ts` | **[MODIFY]** | Return `success: false` if all notification channels fail. |
| 3 | `src/lib/services/telegram.ts` | **[MODIFY]** | Escape hyphens `-` in `escapeMarkdownV2` & add 8s `AbortController` timeout to `fetch()`. |
| 4 | `src/lib/services/resend.ts` | **[MODIFY]** | Redact customer email from dev console log output. |
| 5 | `src/components/product/product-authenticity-badge.tsx` | **[MODIFY]** | Remove fallback claim text defaults; render claims only when provided. |
| 6 | `src/components/product/product-gallery.tsx` | **[MODIFY]** | Gate `ProductAuthenticityBadge` rendering on `authenticity?.isGenuineGuarantee`. |
| 7 | `src/components/layout/header.tsx` | **[MODIFY]** | Render plain `<button type="button">` for search trigger to prevent navigation collision. |
| 8 | `src/components/catalog/brand-filter.tsx` | **[MODIFY]** | Use native keyboard-operable `<input type="checkbox">` elements bound to brand selection. |
| 9 | `src/lib/catalog.ts` | **[MODIFY]** | Integrate `searchProductsInMemory` fuzzy search prior to facet filtering. |
| 10 | `src/components/catalog/search-bar.tsx` | **[MODIFY]** | Add cancellation flag to search effect cleanup to prevent stale promise race conditions. |
| 11 | `src/components/catalog/search-modal.tsx` | **[MODIFY]** | Add cancellation flag to search effect cleanup. |
| 12 | `data/brands.json` | **[MODIFY]** | Add `brand_insane_labz` and `brand_musclepharm` entries. |
| 13 | `data/products.json` | **[MODIFY]** | Update `brandId` references for Insane Labz and MusclePharm products. |
| 14 | `data/guides.json` | **[MODIFY]** | Fix 4 dangling `relatedProductSlugs` entries to match `data/products.json`. |
| 15 | `src/app/(marketing)/location/page.tsx` | **[MODIFY]** | Align free delivery threshold text with canonical `STORE_LOCATION` / `NPR 5,000` rule. |
| 16 | `src/scripts/validate-notification-services.ts` | **[MODIFY]** | Assert that hyphen `-` is escaped in Telegram MarkdownV2 test suite. |
| 17 | `src/scripts/validate-datasets.ts` | **[MODIFY]** | Add uniqueness assertions for IDs and slugs across categories, brands, and products. |
| 18 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 42 in the specification index. |
| 19 | `context/progress-tracker.md` | **[MODIFY]** | Record Spec 42 resolution in session notes. |

---

## 2. Why We Are Doing This

1. **Lead Preservation & Data Integrity:** Returning `success: true` when both Telegram and Resend fail causes lost customer inquiries. Returning `success: false` lets users know to retry or contact via WhatsApp.
2. **Telegram Bot Reliability:** Unescaped hyphens in ISO dates cause Telegram API `400 Bad Request` rejection.
3. **Authenticity Trust Principle:** Showing default importer/hologram claims on un-verified products undermines MuscleWorks' key value proposition of 100% genuine products.
4. **WCAG AA Compliance:** Search modal triggers and brand filters must be accessible via keyboard and screen readers.

---

## 3. How We Are Going to Implement It

### Step 1: Server Actions & Notification Hardening
- In `src/actions/inquiry.ts` and `src/actions/contact.ts`, inspect `[telegramResult, emailResult]`. If Telegram is rejected/failed AND email is rejected or contains errors, return `{ success: false, error: '...' }`.
- In `src/lib/services/telegram.ts`, update `escapeMarkdownV2` regex to `/[-_*[\]()~`>#+=|{}.!\\]/g` and add `AbortSignal.timeout(8000)` to `fetch()`.

### Step 2: Component & Accessibility Fixes
- In `ProductAuthenticityBadge`, remove parameter default strings so fallback text is not rendered without metadata.
- In `ProductGallery`, wrap `ProductAuthenticityBadge` in `{authenticity?.isGenuineGuarantee && ...}`.
- In `Header`, render `<Button type="button" onClick={() => setIsSearchOpen(true)}...>` without wrapping `<Link href="/products">`.
- In `BrandFilter`, wrap brand options with native `<input type="checkbox" checked={isChecked} onChange={() => onToggleBrand(brand.slug)} />`.

### Step 3: Search Engine & Race Condition Fixes
- In `src/lib/catalog.ts`, call `searchProductsInMemory(options.search)` when query is present before applying facet filters.
- In `SearchBar` and `SearchModal`, add `let cancelled = false;` in `useEffect` and check `if (cancelled) return;` before updating state.

### Step 4: Dataset & Location Synchronization
- In `data/brands.json`, add official brand records for Insane Labz and MusclePharm.
- In `data/products.json`, set `brandId: "brand_insane_labz"` for Psychotic Gold and `brandId: "brand_musclepharm"` for Fish Oil.
- In `data/guides.json`, fix product slug typos to match existing products.
- In `/location/page.tsx`, update free delivery text to `NPR 5,000`.

---

## 4. Verification Plan

### Automated Tests & Verification
1. `npx tsc --noEmit` — 0 TypeScript errors.
2. `npx tsx src/scripts/validate-notification-services.ts` — Verify hyphen escaping test passes.
3. `npx tsx src/scripts/validate-datasets.ts` — Verify dataset uniqueness and slug resolution pass.
4. Run all 11 project validation scripts.
5. `npm run build` — Verify static build succeeds cleanly.
