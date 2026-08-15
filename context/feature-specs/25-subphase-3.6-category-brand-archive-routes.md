# Technical Specification: Sub-Phase 3.6 — Category & Brand Dynamic Archive Routes

> **Phase 3:** Catalog, Search & Filtering  
> **Sub-Phase:** `3.6` (Category & Brand Dynamic Archive Routes)  
> **Target Files:** `src/app/categories/page.tsx` [NEW], `src/app/categories/[slug]/page.tsx` [NEW], `src/app/brands/page.tsx` [NEW], `src/app/brands/[slug]/page.tsx` [NEW]  
> **Dependencies:** Sub-Phase 2.4 (Catalog Data Accessors), Sub-Phase 3.5 (Products Catalog Hub Route)  
> **Status:** Approved

---

## 1. Executive Summary & Core Requirements

Sub-Phase 3.6 builds the category and brand archive routing hub for MuscleWorks Supplements. It delivers dedicated landing pages for supplement categories (`/categories`, `/categories/[slug]`) and authorized importer brands (`/brands`, `/brands/[slug]`).

### Key Objectives
1. **Static Site Generation (SSG):** Implement `generateStaticParams()` on `[slug]` routes to pre-render all category and brand archive pages at build time.
2. **Next.js 16 Compatibility:** Await `props.params` and `props.searchParams` across all page routes and metadata generators.
3. **Category Archive Experience:** Category hero banner, trust indicators, pre-filtered catalog grid (`CatalogContainer`), category FAQs, and WAI-ARIA breadcrumbs.
4. **Brand Archive Experience:** Brand logo/banner, country of origin badge (USA/UK), authorized importer authenticity guarantee seal, pre-filtered catalog grid, and WAI-ARIA breadcrumbs.
5. **Zero-Error Fallback:** Invoke `notFound()` for invalid category or brand slugs.

---

## 2. File Targets & Architecture

### Files to Create
1. **`src/app/categories/page.tsx`** [NEW]
   - Category index page displaying responsive grid of supplement category cards.
2. **`src/app/categories/[slug]/page.tsx`** [NEW]
   - Dynamic SSG category archive page with hero header, category FAQs, and pre-filtered catalog grid.
3. **`src/app/brands/page.tsx`** [NEW]
   - Brand index page displaying responsive grid of authorized importer brand cards.
4. **`src/app/brands/[slug]/page.tsx`** [NEW]
   - Dynamic SSG brand archive page with brand logo, country of origin, importer seal, and pre-filtered catalog grid.

---

## 3. Verification Plan

1. **Type Safety:** Run `npx tsc --noEmit` with zero errors.
2. **Next.js Production Build:** Run `npm run build` to verify static page pre-rendering for all categories and brands.
3. **404 Handling:** Verify invalid slugs (e.g. `/categories/invalid-slug`, `/brands/invalid-brand`) trigger the 404 recovery page.
