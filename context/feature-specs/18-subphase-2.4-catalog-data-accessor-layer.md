# Feature Spec 18: Sub-Phase 2.4 — Catalog Data Accessor Layer (Products, Categories & Brands)

> **Spec ID:** `18-subphase-2.4-catalog-data-accessor-layer`  
> **Target Sub-Phase / Branch:** Sub-Phase 2.4 (`Phase-2` branch)  
> **Status:** Completed  
> **Created Date:** 2026-08-10  
> **Author:** AI Assistant  

---

## Executive Summary

Sub-Phase 2.4 implements the typed catalog data accessor gateway layer (`src/lib/data/products.ts`, `src/lib/data/categories.ts`, and `src/lib/data/brands.ts`). These accessors serve as the exclusive single source of truth for all UI pages, catalog filter sidebars, search engines, and SSG `generateStaticParams()` routes across the application. Per project architecture rules ([`context/file-map.md`](../file-map.md)), UI components **must never** directly import raw JSON datasets from `@/data/`. All records are validated at runtime initialization against canonical Zod schemas (`ProductSchema`, `CategorySchema`, `BrandSchema`), guaranteeing zero-drift type safety and zero SSG prerendering failures.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/lib/data/products.ts` | **[NEW]** | Implement typed accessor functions for product retrieval (`getProducts`, `getProductBySlug`, `getProductById`, `getFeaturedProducts`, `getProductsByCategory`, `getProductsByBrand`, `getRelatedProducts`, `searchProductsInMemory`). |
| 2 | `src/lib/data/categories.ts` | **[NEW]** | Implement typed accessor functions for category taxonomy (`getCategories`, `getCategoryBySlug`, `getCategoryById`, `getFeaturedCategories`). |
| 3 | `src/lib/data/brands.ts` | **[NEW]** | Implement typed accessor functions for authorized brand profiles (`getBrands`, `getBrandBySlug`, `getBrandById`, `getFeaturedBrands`). |

---

## 2. Why We Are Doing This

1. **Security & Architectural Encapsulation:** Enforces strict boundary isolation between raw static data files (`data/*.json`) and consumer pages/components (`src/app/`, `src/components/`).
2. **Runtime Zod Validation at Initialization:** Validates static JSON data when the accessors load, preventing malformed dataset entries from breaking static generation or client rendering.
3. **SSG & Server Component Async API Alignment:** Provides async accessor interfaces (`async function getProducts(): Promise<Product[]>`) compatible with Next.js 16 App Router Server Components, `generateStaticParams()`, and dynamic metadata generators.

---

## 3. How We Are Going to Implement It

### Step 1: `src/lib/data/products.ts`
Implement typed product gateway:
- Parse `data/products.json` through `ProductSchema.array().parse(...)` on module execution.
- `getProducts(): Promise<Product[]>` — Returns all products.
- `getProductBySlug(slug: string): Promise<Product | null>` — Finds product by kebab-case slug.
- `getProductById(id: string): Promise<Product | null>` — Finds product by unique ID.
- `getFeaturedProducts(limit = 6): Promise<Product[]>` — Returns products where `isFeatured === true`.
- `getProductsByCategory(categorySlugOrId: string): Promise<Product[]>` — Returns products belonging to the given category.
- `getProductsByBrand(brandSlugOrId: string): Promise<Product[]>` — Returns products belonging to the given brand.
- `getRelatedProducts(product: Product, limit = 4): Promise<Product[]>` — Returns related products from the same category/brand excluding `product.id`.
- `searchProductsInMemory(query: string): Promise<Product[]>` — Substring/keyword fuzzy match across name, brand, category, tags, and highlights. Empty query string returns all products.

### Step 2: `src/lib/data/categories.ts`
Implement typed category gateway:
- Parse `data/categories.json` through `CategorySchema.array().parse(...)` on module execution.
- `getCategories(): Promise<Category[]>` — Returns all categories sorted by `displayOrder`.
- `getCategoryBySlug(slug: string): Promise<Category | null>` — Finds category by slug.
- `getCategoryById(id: string): Promise<Category | null>` — Finds category by unique ID.
- `getFeaturedCategories(): Promise<Category[]>` — Returns categories where `isFeatured === true`.

### Step 3: `src/lib/data/brands.ts`
Implement typed brand gateway:
- Parse `data/brands.json` through `BrandSchema.array().parse(...)` on module execution.
- `getBrands(): Promise<Brand[]>` — Returns all authorized brands.
- `getBrandBySlug(slug: string): Promise<Brand | null>` — Finds brand profile by slug.
- `getBrandById(id: string): Promise<Brand | null>` — Finds brand profile by unique ID.
- `getFeaturedBrands(): Promise<Brand[]>` — Returns brands where `isFeatured === true`.

---

## 4. Required Data & Validation

- `data/products.json` parsed via `ProductSchema.array()`
- `data/categories.json` parsed via `CategorySchema.array()`
- `data/brands.json` parsed via `BrandSchema.array()`
- Programmatic unit test script (`src/scripts/validate-catalog-accessors.ts`) verifying that accessor calls return accurate expected objects.

---

## 5. Potential Risks & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Category/Brand Slug vs. ID Resolution** | Products reference `brandId` and `categoryId` (e.g. `brand_optimum_nutrition`, `cat_proteins`), while URLs use slugs (`optimum-nutrition`, `proteins`). | Ensure `getProductsByCategory` and `getProductsByBrand` support matching against both `id` and `slug`. |
| **Empty Search Fallback** | Querying empty string returns `[]` or all products. | Handle empty or whitespace-only search queries gracefully by returning all products or empty array as expected. |

---

## 6. Verification & Definition of Done

1. `src/lib/data/products.ts`, `src/lib/data/categories.ts`, `src/lib/data/brands.ts` implemented with zero type errors.
2. Unit verification script passes all accessor test assertions.
3. `npx tsc --noEmit` returns zero errors.
