# Feature Spec 23: Sub-Phase 3.4 — Mobile Filter Drawer & Brand Facets

> **Spec ID:** `23-subphase-3.4-mobile-filter-drawer-brand-facets`  
> **Target Sub-Phase:** Sub-Phase 3.4 (Phase 3: Catalog, Search & Filtering)  
> **Status:** Approved / In Progress  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI Assistant

---

## Executive Summary

Sub-Phase 3.4 completes the catalog filtering system by delivering a mobile-optimized filter drawer (`MobileFilterDrawer`) and a standalone search-enabled brand filter facet (`BrandFilter`). It ensures mobile supplement shoppers in Nepal (<768px viewports) enjoy an ergonomic, single-handed bottom sheet filtering experience with staged state application and instant brand discovery across 10+ authorized global brands (ON, MuscleTech, Dymatize, Kevin Levrone, etc.).

It introduces two key components:
1. `MobileFilterDrawer` (`src/components/catalog/mobile-filter-drawer.tsx`): Bottom-sheet filter drawer built on the Radix `Sheet` primitive (`side="bottom"`, `max-h-[85vh]`). Features a top header with active filter counter, scrollable body containing all catalog facets, and a sticky bottom "Apply Filters" CTA button (≥48px height).
2. `BrandFilter` (`src/components/catalog/brand-filter.tsx`): Standalone brand facet component featuring a live search input, scrollable checkboxes, country of origin badges (USA, UK), and matching product count pills.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/catalog/brand-filter.tsx` | **[NEW]** | Searchable brand facet component with instant text filter, country of origin badges, multi-select checkboxes, and product count pills. |
| 2 | `src/components/catalog/mobile-filter-drawer.tsx` | **[NEW]** | Accessible bottom-sheet drawer (`Sheet side="bottom"`), staged filter state management, active counter, clear button, and sticky "Apply Filters" CTA. |

---

## 2. Why We Are Doing This

1. **Mobile UX & Ergonomics:** Over 75% of e-commerce traffic in Nepal originates from mobile devices. A bottom sheet layout (`max-h-[85vh]`) keeps interactive elements within natural thumb reach.
2. **Reduced URL Thrashing:** Staging filter updates locally within the drawer prevents unnecessary URL re-renders until the user explicitly taps "Apply Filters".
3. **Brand Authenticity & Filtering:** Supplement buyers in Nepal frequently filter by authorized international brands (e.g. Optimum Nutrition, MuscleTech). Providing a searchable brand list with country badges reinforces product authenticity.

---

## 3. How We Are Going to Implement It

### Step 1: Searchable Brand Facet Component (`src/components/catalog/brand-filter.tsx`)
- Build `'use client'` component consuming `brands: Brand[]` and `products: Product[]`.
- Include search input (`Input` primitive) filtering brand names in real-time.
- Calculate matching product counts per brand.
- Render checkboxes with brand title, country badge (e.g., USA, UK), and product count pill.
- Support multi-select brand filtering via comma-separated slugs/IDs.

### Step 2: Mobile Filter Drawer Component (`src/components/catalog/mobile-filter-drawer.tsx`)
- Build `'use client'` component using `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetTrigger` primitives.
- Open state trigger button displaying active filter count badge.
- Maintain staged local state (`stagedCategories`, `stagedBrands`, `stagedGoals`, `stagedMinPrice`, `stagedMaxPrice`, `stagedInStock`) initialized from `useSearchParams`.
- Sticky bottom footer containing:
  - "Clear" button (resets staged state).
  - "Apply Filters" CTA button (≥48px height, Jet Black & Metallic Gold accent) committing staged state to URL query params via `router.push(..., { scroll: false })` and closing drawer.

---

## 4. When We Are Going to Do It

```text
Phase 1: Implement src/components/catalog/brand-filter.tsx (Searchable Brand Facet)
    │
    ▼
Phase 2: Implement src/components/catalog/mobile-filter-drawer.tsx (Bottom Sheet Drawer)
    │
    ▼
Phase 3: Verification Gate (npx tsc --noEmit, mobile viewport touch targets >= 48px)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Brand Profiles | `src/lib/data/brands.ts` (`getBrands()`) | Populating brand search & filter list |
| Category Taxonomy | `src/lib/data/categories.ts` (`getCategories()`) | Rendering category facets in drawer |
| Product Catalog | `src/lib/data/products.ts` (`getProducts()`) | Calculating brand product counts |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Drawer Overflow on Small Phones** | Content height exceeding screen height on 360px devices. | Use `max-h-[85vh] flex flex-col` with `overflow-y-auto` body and fixed header/footer. |
| **State Desync on Re-opening** | Staged state preserving unapplied edits when drawer closes. | Re-sync staged state from `useSearchParams` whenever `open` state transitions to `true`. |
| **Touch Target Violations** | Small close buttons or small brand checkboxes. | Enforce minimum `h-11` (44px) touch heights on inputs and `h-12` (48px) on CTA buttons. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` runs with 0 errors.
2. Opening `MobileFilterDrawer` displays staged filters pre-populated from URL query params.
3. Typing in `BrandFilter` instantly filters the visible brand list.
4. Tapping "Apply Filters" updates URL parameters cleanly without page jump and closes the drawer.
5. All interactive buttons meet minimum touch target standards (≥44px / ≥48px CTAs).
