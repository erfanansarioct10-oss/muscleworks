# Feature Spec 22: Sub-Phase 3.3 — Desktop Filter Components & Active State

> **Spec ID:** `22-subphase-3.3-desktop-filter-components-active-state`  
> **Target Sub-Phase:** Sub-Phase 3.3 (Phase 3: Catalog, Search & Filtering)  
> **Status:** Approved / In Progress  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI Assistant

---

## Executive Summary

Sub-Phase 3.3 implements the core desktop filtering UI and active filter management system for the MuscleWorks Nepal supplement catalog. It enables buyers to narrow down the product selection across multiple facets (Category, Fitness Goal, Price Range in NPR, and In-Stock Availability) with instant feedback and bidirectional URL query synchronization.

It introduces three key components:
1. `CatalogFilters` (`src/components/catalog/catalog-filters.tsx`): Multi-facet desktop sidebar filter with collapsible accordions, category checkboxes, goal selectors, dual NPR price range inputs + preset price pills, and in-stock toggle.
2. `ActiveFilters` (`src/components/catalog/active-filters.tsx`): Active filter summary toolbar displaying total matching count, individual removable filter badge pills, and a single-click "Clear All" action button.
3. `CategoryChips` (`src/components/catalog/category-chips.tsx`): Horizontal scrollable quick-filter category chip bar with active highlighting and catalog shortcuts.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/catalog/catalog-filters.tsx` | **[NEW]** | Multi-facet filter sidebar component (categories, goals, NPR min/max inputs, preset price pills, in-stock toggle, URL searchParams sync). |
| 2 | `src/components/catalog/active-filters.tsx` | **[NEW]** | Active filter pills container with individual badge removal triggers, product match counter, and "Clear All" reset button. |
| 3 | `src/components/catalog/category-chips.tsx` | **[NEW]** | Horizontal scrollable category pill bar with active status indicators and quick catalog filtering shortcuts. |

---

## 2. Why We Are Doing This

1. **Precision Product Discovery:** Supplement buyers in Nepal search with varying intent (e.g., "whey protein under 10k NPR", "in-stock creatine for muscle gain"). Faceted sidebar filtering empowers users to find exact products matching their budget and fitness goals.
2. **Deep Linking & Shareable URLs:** Synchronizing filter states with Next.js URL query parameters (`/products?category=proteins,creatine&minPrice=3000&maxPrice=12000&inStock=true`) allows users to share filtered catalog links directly on WhatsApp or social media.
3. **Reduced Cognitive Load:** `ActiveFilters` provides high-visibility feedback on currently applied constraints, allowing users to remove individual filters instantly without resetting their entire search.

---

## 3. How We Are Going to Implement It

### Step 1: Desktop Filter Sidebar (`src/components/catalog/catalog-filters.tsx`)
- Build `'use client'` component consuming Next.js `useSearchParams` and `useRouter`.
- Implement facet sections:
  - **Category Facet:** Checkbox list derived from `getCategories()`. Supports multi-select with comma-separated URL params (`?category=proteins,creatine`).
  - **Fitness Goal Facet:** Checkbox list covering *Muscle Gain*, *Fat Loss*, *Strength & Power*, *Endurance & Energy*, *Wellness & Recovery*.
  - **Price Range Facet (NPR):** Dual number inputs (`minPrice`, `maxPrice`) with quick-select preset range pills:
    - *Under NPR 5,000*
    - *NPR 5,000 - 10,000*
    - *NPR 10,000 - 20,000*
    - *Above NPR 20,000*
  - **Availability Facet:** Switch/checkbox toggle for `inStock=true`.
- Helper function `updateFilter(key: string, value: string | null)` updating `searchParams` via `router.push(..., { scroll: false })`.

### Step 2: Active Filters Toolbar (`src/components/catalog/active-filters.tsx`)
- Parse active query parameters from `useSearchParams`.
- Render matching product count string (e.g. `Showing 12 products`).
- Render removable `Badge` pills for each active filter with an `X` close icon (touch target ≥44px).
- Render "Clear All" button when any filter (category, goal, brand, price, stock, search) is active.

### Step 3: Horizontal Category Chips (`src/components/catalog/category-chips.tsx`)
- Build horizontal scrollable pill bar showcasing category shortcuts (`All Products`, `Proteins`, `Creatine`, `Mass Gainers`, `Pre-Workout`, `Vitamins`, `Amino & BCAA`).
- Highlight active category chip with Jet Black / Metallic Gold luxury accent.
- Handle click event by setting or toggling the `category` URL search parameter.

---

## 4. When We Are Going to Do It

```text
Phase 1: Implement src/components/catalog/catalog-filters.tsx (Desktop Filter Sidebar)
    │
    ▼
Phase 2: Implement src/components/catalog/active-filters.tsx (Active Filter Pills & Reset)
    │
    ▼
Phase 3: Implement src/components/catalog/category-chips.tsx (Horizontal Scrollable Chips)
    │
    ▼
Phase 4: Verification Gate (npx tsc --noEmit, URL query sync, mobile touch targets)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Category Taxonomy | `src/lib/data/categories.ts` (`getCategories()`) | Category facet list and category chips |
| Product Catalog | `src/lib/data/products.ts` (`getProducts()`) | Calculating price bounds and matching count |
| Filter Types | `src/types/index.ts` (`FilterState`) | Filter interface definitions |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Page Jitter on Filter Change** | `router.push()` triggering default scroll-to-top behavior. | Pass `{ scroll: false }` to `router.push()` / `router.replace()`. |
| **Invalid Price Inputs** | Negative numbers or min > max price inputs. | Validate inputs before pushing URL params (`minPrice >= 0`, `maxPrice >= minPrice`). |
| **Touch Target Violations** | Small `X` icons on active filter pills. | Wrap close icons in flex containers with `min-h-11 min-w-11` (≥44px touch targets). |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` completes cleanly with 0 errors.
2. Checking a category checkbox updates the URL query string to `?category=slug`.
3. Selecting min/max prices or preset price pills updates `minPrice` and `maxPrice` query parameters.
4. `ActiveFilters` renders removable pills for active facets and clears filters on "Clear All" click.
5. `CategoryChips` allows horizontal touch scrolling and highlights active category selection.
