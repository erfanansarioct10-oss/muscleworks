# Feature Spec 21: Sub-Phase 3.2 — In-Memory Fuzzy Search Engine

> **Spec ID:** `21-subphase-3.2-in-memory-fuzzy-search-engine`  
> **Target Sub-Phase:** Sub-Phase 3.2 (Phase 3: Catalog, Search & Filtering)  
> **Status:** Approved / Complete  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI Assistant

---

## Executive Summary

Sub-Phase 3.2 implements an instant, client-side fuzzy search engine for the MuscleWorks Nepal supplement catalog. Using `fuse.js` (v7.1.0), it performs multi-field weighted indexing across product names, brand titles, categories, flavor variants, and fitness tags with a strict fuzzy threshold (`0.3`) to handle typos while preserving relevance.

It also introduces two interactive components:
1. `SearchBar` (`src/components/catalog/search-bar.tsx`): An inline search input with real-time dropdown previews.
2. `SearchModal` (`src/components/catalog/search-modal.tsx`): A full command palette / dialog search modal bound to `Cmd+K` / `Ctrl+K` keyboard shortcuts, supporting recent search persistence in `localStorage`, popular category quick shortcuts, and mobile-optimized full-screen views.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/lib/search.ts` | **[NEW]** | Fuse.js index builder, fuzzy search function (`searchProducts()`), recent search helpers (`getRecentSearches`, `addRecentSearch`, `clearRecentSearches`). |
| 2 | `src/components/catalog/search-bar.tsx` | **[NEW]** | Responsive search input component with live dropdown results preview, keyboard navigation, and modal trigger mode. |
| 3 | `src/components/catalog/search-modal.tsx` | **[NEW]** | Accessible search dialog overlay (`Cmd+K` shortcut listener, recent searches, zero-match state, mobile full-screen). |
| 4 | `src/components/layout/header.tsx` | **[MODIFY]** | Wire header search trigger button to open `SearchModal` on click or keypress. |

---

## 2. Why We Are Doing This

1. **Sub-Second Discovery:** Supplement buyers in Nepal often search by specific terms ("whey", "creatine", "gold standard", "iso 100", "gainer"). Client-side in-memory search delivers instant results in <10ms without network roundtrips.
2. **Typo Tolerance:** Buyers frequently misspell technical supplement names (e.g. "creatin", "optmum", "proten"). Fuse.js fuzzy matching with threshold `0.3` ensures buyers find the exact product.
3. **Keyboard Accessibility & UX:** Power users expect `Cmd+K` / `Ctrl+K` command palette shortcuts. Mobile users benefit from a full-screen search sheet with quick touch targets.

---

## 3. How We Are Going to Implement It

### Step 1: Search Engine Core (`src/lib/search.ts`)
- Instantiate a cached `Fuse<Product>` instance indexing `validatedProducts`:
  - `name` (weight: 0.4)
  - `brandId` / brand name (weight: 0.25)
  - `categoryId` / category name (weight: 0.2)
  - `variants.flavor` (weight: 0.1)
  - `tags` & `highlights` (weight: 0.05)
- Set `threshold: 0.3`, `minMatchCharLength: 2`, `ignoreLocation: true`.
- Export `searchProducts(query: string, limit = 10): SearchResult[]`.
- Export `localStorage` utility functions for recent searches (`MW_RECENT_SEARCHES` key, capped at 5 terms).

### Step 2: Live Search Bar Component (`src/components/catalog/search-bar.tsx`)
- Build `'use client'` component with input field, debounced search query (150ms), loading state, clear button, and dropdown results popover.
- Highlight product thumbnail, brand, name, NPR price, discount %, and stock status in result items.

### Step 3: Search Modal Component (`src/components/catalog/search-modal.tsx`)
- Build accessible modal using Radix UI `Dialog` primitive (`src/components/ui/dialog.tsx`).
- Listen for `keydown` events (`e.key === 'k' && (e.metaKey || e.ctrlKey)`).
- Render search input, recent searches pills, quick category shortcuts when empty, live result list, and zero-match state with recovery links.

### Step 4: Layout Header Integration (`src/components/layout/header.tsx`)
- Replace static `/products` Link on the header search icon with interactive `SearchModal` open state, maintaining a fallback `href="/products"` for SEO/no-JS.

---

## 4. When We Are Going to Do It

```text
Phase 1: Implement src/lib/search.ts (Fuse.js index & localStorage helpers)
    │
    ▼
Phase 2: Implement src/components/catalog/search-bar.tsx (Live search input & dropdown)
    │
    ▼
Phase 3: Implement src/components/catalog/search-modal.tsx (Cmd+K command palette modal)
    │
    ▼
Phase 4: Update src/components/layout/header.tsx (Wire search trigger)
    │
    ▼
Phase 5: Type check & Mobile Touch Target Audit (npx tsc --noEmit)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Product Catalog | `src/lib/data/products.ts` (`getProducts()`) | In-memory dataset for Fuse.js indexing |
| Categories Taxonomy | `src/lib/data/categories.ts` (`getCategories()`) | Quick search shortcut chips |
| Recent Searches | `localStorage` (`MW_RECENT_SEARCHES`) | Persisted search history |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **SSR / Hydration Mismatch** | Reading `localStorage` or `navigator` during initial Server Render. | Wrap `localStorage` access in `useEffect` and handle unmounted state cleanly. |
| **Keyboard Trap / Dialog Focus Shift** | Modal opening without autofocusing search input. | Set `autoFocus` on modal input and utilize Radix `DialogContent` focus management. |
| **Mobile Screen Overflow** | Dropdown results spilling off bottom of mobile screen. | Use `max-h-[60vh] overflow-y-auto` and full-screen dialog on `<640px` viewports. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` runs with 0 errors.
2. Pressing `Cmd+K` or `Ctrl+K` opens `SearchModal` on desktop.
3. Search queries like "whey", "creatin", "optimum" return accurate fuzzy results in <10ms.
4. Clicking a search result navigates to `/products/[slug]` and closes the modal.
5. Touch targets for recent search pills and result items are ≥44px.
