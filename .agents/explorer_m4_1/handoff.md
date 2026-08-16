# Handoff Report — Milestone 4: Analytics Telemetry Investigation (MED-02, MED-08)

## 1. Observation

### 1.1 Analytics API Contracts & Signatures (`src/lib/analytics.ts`)
Direct inspection of `src/lib/analytics.ts` lines 23–55 & 110–193 reveals the following signatures:
- **`trackLeadSubmission(params: LeadSubmissionParams): void`** (lines 182–193)
  - Parameter interface:
    ```typescript
    export interface LeadSubmissionParams {
      formName: string;
      city?: string;
      inquiryType?: string;
    }
    ```
  - Dispatches GA4 event `'generate_lead'` with `{ form_name, city, inquiry_type }`, Meta Pixel `'generate_lead'`, and DOM CustomEvent `'mw:analytics'`.
- **`trackProductView(params: ProductViewParams): void`** (lines 132–146)
  - Parameter interface:
    ```typescript
    export interface ProductViewParams {
      productId: string;
      productName: string;
      brand?: string;
      category?: string;
      price: number;
    }
    ```
  - Dispatches GA4 event `'view_item'` with `{ item_id, item_name, item_brand, item_category, price_npr }`, Meta Pixel `'view_item'`, and DOM CustomEvent `'mw:analytics'`.
- **`trackSearchQuery(params: SearchQueryParams): void`** (lines 151–162)
  - Parameter interface:
    ```typescript
    export interface SearchQueryParams {
      query: string;
      resultsCount: number;
    }
    ```
  - Dispatches GA4 event `'search'` with `{ search_term, results_count }`, Meta Pixel `'search'`, and DOM CustomEvent `'mw:analytics'`.
- **`trackCategoryView(params: CategoryViewParams): void`** (lines 167–177)
  - Parameter interface:
    ```typescript
    export interface CategoryViewParams {
      categoryId: string;
      categoryName: string;
    }
    ```
  - Dispatches GA4 event `'view_item_list'` with `{ item_list_id, item_list_name }`, Meta Pixel `'view_item_list'`, and DOM CustomEvent `'mw:analytics'`.
- **`trackWhatsAppClick(params: WhatsAppClickParams): void`** (lines 112–127)
  - Parameter interface:
    ```typescript
    export interface WhatsAppClickParams {
      source: string;
      productName?: string;
      brand?: string;
      flavor?: string;
      size?: string;
      price?: number;
    }
    ```
  - Dispatches GA4 event `'whatsapp_click'` with `{ source, product_name, brand, flavor, size, price_npr }`, Meta Pixel `'whatsapp_click'`, and DOM CustomEvent `'mw:analytics'`.

### 1.2 Form Components State & Telemetry Status
- **`InquiryForm` (`src/components/forms/inquiry-form.tsx:28, 129–153`)**:
  - `trackLeadSubmission` is imported (line 28) and invoked at lines 133–137 upon Server Action success (`if (result.success && result.data?.inquiryId)`):
    ```typescript
    trackLeadSubmission({
      formName: 'InquiryForm',
      city: finalPayload.deliveryCity,
      inquiryType: values.inquiryType,
    });
    ```
- **`ContactForm` (`src/components/forms/contact-form.tsx:25, 120–139`)**:
  - `trackLeadSubmission` is imported (line 25) and invoked at lines 122–126 upon Server Action success (`if (result.success && result.data?.inquiryId)`):
    ```typescript
    trackLeadSubmission({
      formName: 'ContactForm',
      city: finalPayload.deliveryCity,
      inquiryType: values.inquiryType,
    });
    ```

### 1.3 Product Detail View Telemetry Status (`src/components/product/product-detail-view.tsx`)
- `trackProductView` is imported (line 14) and called inside `React.useEffect` (lines 70–78):
  ```typescript
  React.useEffect(() => {
    trackProductView({
      productId: product.id,
      productName: product.name,
      brand: brand?.name,
      category: category?.name,
      price: selectedVariant.discountPriceNpr || selectedVariant.priceNpr,
    });
  }, [product.id, product.name, brand?.name, category?.name, selectedVariant]);
  ```
- `trackWhatsAppClick` is invoked on the main hero CTA at lines 97–106 (`source: 'pdp_hero_cta'`).
- `ProductStickyBar` (`src/components/product/product-sticky-bar.tsx:52`) invokes `trackWhatsAppClick` with `source: 'pdp_sticky_bar'`.

### 1.4 Search Modal Telemetry Status (`src/components/catalog/search-modal.tsx`)
- Currently, `search-modal.tsx` does **not** import or dispatch `trackSearchQuery`.
- In `search-modal.tsx:118–137`, debounced search results are fetched via `const res = await searchProducts(trimmed, 8);`.
- In `search-modal.tsx:162–170`, form submission / Enter key navigates to `/products?search=${encodeURIComponent(trimmed)}`.

### 1.5 Catalog Container Telemetry Status (`src/components/catalog/catalog-container.tsx`)
- Currently, `catalog-container.tsx` does **not** import or dispatch `trackCategoryView`.
- Category filtering is accessed either via URL parameter `?category=...` or route segment `/categories/[slug]`.
- Active categories list is present in props (`categories: Category[]`).

### 1.6 Additional Conversion Telemetry in `ProductCard` (`src/components/product/product-card.tsx`)
- `ProductCard` (lines 77–81) has a quick WhatsApp order button that triggers `window.open(whatsappUrl, '_blank', 'noopener,noreferrer')` without invoking `trackWhatsAppClick`.

---

## 2. Logic Chain

1. **Safety & SSR Hydration Invariant**: All telemetry dispatches in `src/lib/analytics.ts` check `typeof window === 'undefined'` before dispatching. However, calling analytics during React render phase could lead to duplicate dispatches or hydration issues. Therefore, event triggers must occur strictly within **`useEffect` lifecycle hooks** (for view events: `trackProductView`, `trackCategoryView`) or **user event handlers** (for interactive events: `trackSearchQuery`, `trackWhatsAppClick`, `trackLeadSubmission`).

2. **Lead Form Telemetry**: Both `InquiryForm` and `ContactForm` already invoke `trackLeadSubmission` directly within the asynchronous `onSubmit` handler after `result.success && result.data?.inquiryId` evaluates to `true`. Both forms pass canonical fields (`formName`, `city`, `inquiryType`) matching `LeadSubmissionParams`.

3. **Search Query Telemetry in `SearchModal`**:
   - When a user performs a search, `search-modal.tsx` executes debounced queries via `searchProducts(trimmed, 8)`.
   - Adding `trackSearchQuery({ query: trimmed, resultsCount: res.length })` immediately after resolving results captures search intent and result density.
   - Adding `trackSearchQuery({ query: trimmed, resultsCount: results.length })` inside `handleSearchSubmit` captures explicit Enter/Submit transitions.

4. **Category View Telemetry in `CatalogContainer`**:
   - `CatalogContainer` is mounted on `/products` (where categories are selected via query params or chips) and on `/categories/[slug]` (where category slug is in the route path).
   - By inspecting `searchParams.get('category')` and `pathname.startsWith('/categories/')`, `CatalogContainer` can determine the active category slug(s).
   - A `useEffect` hook listening to `[activeCategorySlugs, categories]` dispatches `trackCategoryView({ categoryId: matched.id, categoryName: matched.name })` safely upon client mount or category navigation.

5. **WhatsApp Click Telemetry in `ProductCard`**:
   - Quick-ordering via the WhatsApp icon on catalog cards should dispatch `trackWhatsAppClick({ source: 'product_card_quick_order', productName, brand, flavor, size, price })` prior to `window.open(...)`.

---

## 3. Caveats

1. **Browser Ad-Blockers**: Client-side blockers (e.g. uBlock Origin) may block `window.gtag` or `window.fbq`. `src/lib/analytics.ts` uses safe try-catch and optional chaining so no runtime errors occur.
2. **Pre-rendering / SSG**: Static site generation pre-renders pages at build time where `window` is undefined. `trackCategoryView` and `trackProductView` in `useEffect` do not execute during SSR/SSG.
3. **Multi-category selection**: If multiple category slugs are comma-separated in search params (`?category=proteins,creatine`), `trackCategoryView` should iterate over each selected category to record views accurately.

---

## 4. Conclusion & Copy-Paste Ready Code Diffs

### 4.1 Diff 1: Wire `trackSearchQuery` in `src/components/catalog/search-modal.tsx`

```diff
--- a/src/components/catalog/search-modal.tsx
+++ b/src/components/catalog/search-modal.tsx
@@ -23,6 +23,7 @@ import {
   type SearchResult,
 } from "@/lib/search";
 import { formatNprPrice, calculateDiscountPercentage } from "@/lib/utils";
 import { DEFAULT_PRODUCT_PLACEHOLDER } from "@/lib/constants";
 import { Badge } from "@/components/ui/badge";
+import { trackSearchQuery } from "@/lib/analytics";
 
 const POPULAR_CATEGORIES = [
@@ -124,6 +125,10 @@ export function SearchModal({
         startTransition(() => {
           setResults(res);
         });
+        trackSearchQuery({
+          query: trimmed,
+          resultsCount: res.length,
+        });
       } catch (err) {
         if (cancelled) return;
@@ -165,6 +170,10 @@ export function SearchModal({
     const trimmed = query.trim();
     if (trimmed) {
       addRecentSearch(trimmed);
+      trackSearchQuery({
+        query: trimmed,
+        resultsCount: results.length,
+      });
       handleOpenChange(false);
       router.push(`/products?search=${encodeURIComponent(trimmed)}`);
     }
```

### 4.2 Diff 2: Wire `trackCategoryView` in `src/components/catalog/catalog-container.tsx`

```diff
--- a/src/components/catalog/catalog-container.tsx
+++ b/src/components/catalog/catalog-container.tsx
@@ -7,6 +7,7 @@ import { filterAndSortProducts } from '@/lib/catalog';
 import { CatalogFilters } from './catalog-filters';
 import { MobileFilterDrawer } from './mobile-filter-drawer';
 import { ActiveFilters } from './active-filters';
 import { CategoryChips } from './category-chips';
 import { SortSelect } from './sort-select';
 import { ProductGrid } from '@/components/product/product-grid';
+import { trackCategoryView } from '@/lib/analytics';
 
 export interface CatalogContainerProps {
   initialProducts: Product[];
@@ -52,6 +53,30 @@ export function CatalogContainer({
   const filteredProducts = React.useMemo(() => {
     return filterAndSortProducts(initialProducts, filterOptions, categories, brands);
   }, [initialProducts, filterOptions, categories, brands]);
 
+  // Resolve active category slug(s) from search params or route pathname
+  const activeCategorySlugs = React.useMemo(() => {
+    const fromQuery = searchParams.get('category');
+    if (fromQuery) {
+      return fromQuery.split(',').filter(Boolean);
+    }
+    if (pathname.startsWith('/categories/')) {
+      const segment = pathname.replace('/categories/', '').split('/')[0];
+      return segment ? [segment] : [];
+    }
+    return [];
+  }, [searchParams, pathname]);
+
+  // Dispatch category view telemetry when active categories change
+  React.useEffect(() => {
+    if (activeCategorySlugs.length > 0) {
+      activeCategorySlugs.forEach((slug) => {
+        const matched = categories.find((c) => c.slug === slug);
+        if (matched) {
+          trackCategoryView({
+            categoryId: matched.id,
+            categoryName: matched.name,
+          });
+        }
+      });
+    }
+  }, [activeCategorySlugs, categories]);
+
   const handleResetFilters = React.useCallback(() => {
     router.push(pathname, { scroll: false });
   }, [router, pathname]);
```

### 4.3 Diff 3: Wire `trackWhatsAppClick` in `src/components/product/product-card.tsx`

```diff
--- a/src/components/product/product-card.tsx
+++ b/src/components/product/product-card.tsx
@@ -10,6 +10,7 @@ import { ProductAuthenticityBadge } from './product-authenticity-badge';
 import { Badge } from '@/components/ui/badge';
 
 import { buildProductWhatsAppUrl } from '@/lib/whatsapp';
 import { DEFAULT_PRODUCT_PLACEHOLDER } from '@/lib/constants';
+import { trackWhatsAppClick } from '@/lib/analytics';
 
 export interface ProductCardProps {
   product: Product;
@@ -78,6 +79,14 @@ export function ProductCard({
   const handleWhatsAppClick = (e: React.MouseEvent<HTMLButtonElement>) => {
     e.preventDefault();
     e.stopPropagation();
+    trackWhatsAppClick({
+      source: 'product_card_quick_order',
+      productName: product.name,
+      brand: brandName,
+      flavor: defaultVariant?.flavor,
+      size: defaultVariant?.sizeOrWeight,
+      price: currentPrice,
+    });
     window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
   };
```

### 4.4 Verification of Existing Telemetry in `InquiryForm`, `ContactForm`, and `ProductDetailView`
- **`InquiryForm`**: Fully wired with `trackLeadSubmission` at `src/components/forms/inquiry-form.tsx:133–137`.
- **`ContactForm`**: Fully wired with `trackLeadSubmission` at `src/components/forms/contact-form.tsx:122–126`.
- **`ProductDetailView`**: Fully wired with `trackProductView` at `src/components/product/product-detail-view.tsx:71–77` and `trackWhatsAppClick` at line 98.

---

## 5. Verification Method

1. **TypeScript Compiler Check**:
   ```bash
   npx tsc --noEmit
   ```
   Ensures all imported telemetry functions have matching parameter types without type errors.

2. **Automated Analytics Validation Suite**:
   ```bash
   npx ts-node --project tsconfig.json src/scripts/validate-whatsapp-analytics.ts
   ```
   Verifies SSR safety and runtime execution of all tracking functions in `src/lib/analytics.ts`.

3. **DOM CustomEvent Invalidation & Verification**:
   In browser DevTools console on `/products`, `/categories/proteins`, `/products/[slug]`, and in `SearchModal`:
   ```javascript
   window.addEventListener('mw:analytics', (e) => console.log('MW Event:', e.detail));
   ```
   - Opening search and typing `whey` → logs `eventName: "search"`.
   - Navigating to `/categories/proteins` or clicking category chip → logs `eventName: "view_item_list"`.
   - Clicking quick order on product card → logs `eventName: "whatsapp_click"`.
   - Submitting inquiry form → logs `eventName: "generate_lead"`.
