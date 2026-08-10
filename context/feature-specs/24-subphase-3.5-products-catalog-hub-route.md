# Technical Specification: Sub-Phase 3.5 — Products Catalog Hub Route

> **Phase 3:** Catalog, Search & Filtering  
> **Sub-Phase:** `3.5` (Products Catalog Hub Route)  
> **Target File:** `src/app/products/page.tsx` [NEW], `src/components/catalog/sort-select.tsx` [NEW], `src/components/catalog/catalog-container.tsx` [NEW], `src/lib/catalog.ts` [NEW]  
> **Dependencies:** Sub-Phase 2.4 (Catalog Data Accessors), Sub-Phase 3.1 (Product Display Components), Sub-Phase 3.3 (Desktop Filter Components), Sub-Phase 3.4 (Mobile Filter Drawer)  
> **Status:** Draft / Pending Implementation

---

## 1. Executive Summary & Core Requirements

Sub-Phase 3.5 constructs the central `/products` Catalog Hub route for MuscleWorks Supplements. It unifies all filtering components (`CatalogFilters`, `BrandFilter`, `CategoryChips`, `ActiveFilters`, `MobileFilterDrawer`), product display grids (`ProductGrid`, `ProductCard`), and fuzzy search capability into a seamless, high-converting catalog browsing experience.

### Key Objectives
1. **Next.js 16 App Router Server Component Page:** Async `ProductsPage` awaiting `props.searchParams` and generating dynamic SEO metadata (`generateMetadata`).
2. **Filtering & Sorting Engine:** Build reusable `filterAndSortProducts()` helper supporting multi-category, multi-brand, fitness goals, price bounds, stock status, text query, and 5 sorting options (`featured`, `price-asc`, `price-desc`, `name-asc`, `newest`).
3. **Responsive 2-Column Layout:** Sticky desktop filter sidebar (`lg:w-64`), interactive top toolbar with sort select dropdown, category quick chips, active filter badge summary, and mobile filter sheet drawer.
4. **Zero-Match Recovery:** Context-aware `ProductGridEmpty` state with instant "Clear All Filters" trigger and popular category shortcuts.

---

## 2. File Targets & Architecture

### Files to Create
1. **`src/lib/catalog.ts`** [NEW]
   - Reusable catalog filter and sort logic parsing URL search parameters into structured filter criteria and returning filtered product arrays.
2. **`src/components/catalog/sort-select.tsx`** [NEW]
   - Styled Radix `Select` wrapper component for catalog sorting options (`featured`, `price-asc`, `price-desc`, `name-asc`, `newest`).
3. **`src/components/catalog/catalog-container.tsx`** [NEW]
   - Client interactive layout wrapper managing search params, filter execution, active filter pill display, sort updates, and responsive product grid rendering.
4. **`src/app/products/page.tsx`** [NEW]
   - Next.js 16 async Server Component fetching catalog datasets (`getProducts`, `getCategories`, `getBrands`), producing dynamic SEO metadata, and rendering `<CatalogContainer />`.

---

## 3. Data Schema & Filter Criteria Spec

```typescript
export interface CatalogFilterOptions {
  category?: string;    // Comma-separated category slugs/IDs
  brand?: string;       // Comma-separated brand slugs/IDs
  goal?: string;        // Comma-separated fitness goal IDs
  minPrice?: number;    // Minimum NPR price filter
  maxPrice?: number;    // Maximum NPR price filter
  inStock?: boolean;    // Stock availability filter
  search?: string;      // In-memory fuzzy text search query
  sort?: CatalogSortOption; // Sorting direction
}

export type CatalogSortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';
```

---

## 4. Verification Plan

1. **Type Safety:** Run `npx tsc --noEmit` with zero errors.
2. **Next.js Build:** Run `npm run build` to ensure static page prerendering and dynamic searchParams handling succeed without errors.
3. **URL Parameter Syncing:** Verify changing category, brand, price, or sort updates URL parameters (`/products?category=proteins&sort=price-asc`) and reflects matching product subset instantly.
4. **Responsive Layout Verification:** Confirm sticky desktop sidebar on `≥1024px` and drawer button trigger on `<1024px`.
