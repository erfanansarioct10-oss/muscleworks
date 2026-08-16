# Comprehensive Investigation & Survey Report (Part 3)
## Focus: Analytics Telemetry, Dead Code & Hygiene, UI/Accessibility Edge Cases, Test Suites & Tooling

**Target Workspace:** `c:\nooridigital_assets\my-projects\muscleworks`  
**Investigator:** Explorer 3 (Survey: Analytics, Dead Code, Lint/Tests & Knowledge Graph)  
**Date:** August 15, 2026  
**Status:** Complete Investigation & Remediation Blueprint

---

## 1. Executive Summary

This investigation covers the architectural, telemetry, code hygiene, and tooling findings outlined in the Master Codebase Audit and Teamwork Directives, specifically:
- **MED-08 / MED-04**: Unwired GA4 / Meta Pixel telemetry dispatchers across core user journeys (`InquiryForm`, `ContactForm`, `ProductDetailView`, `SearchModal`, `CatalogContainer`) and raw JSON import bypass in `GuidesPage`.
- **LOW-05 through LOW-10**: Redundant constant aliases, dead opening hours calculations, unreferenced UI toast wrappers, client search concurrent transition optimizations, strict sitemap typing, and sub-standard touch targets on conversion and pagination elements.
- **INFO-01 & INFO-02**: Informational cleanups including legacy function aliases (`getGuides`) and hidden filter checkbox ARIA labelling (`BrandFilter`).
- **Dead Code Ledger (LOW-01 to LOW-04)**: Comprehensive review of unmounted modals, dead interfaces, unreferenced barrel files, and unused utility functions.
- **Test Suites, Tooling & Knowledge Graph**: Verification harness in `src/scripts/`, CI dead code detection script improvements in `src/scripts/check-dead-code.js`, `package.json` test scripts, and knowledge graph (`graphify-out/`) synchronization.

---

## 2. In-Depth Survey & Itemized Remediation Plans

---

### Finding 1: Unwired Analytics Telemetry Dispatches (Audit Finding MED-04 / Prompt MED-08)

#### Context & Current State
`src/lib/analytics.ts` provides a safe client-side event tracking dispatcher for Google Analytics 4 (`gtag`), Meta Pixel (`fbq`), and browser CustomEvents (`mw:analytics`).
Currently, only `trackWhatsAppClick` is imported and invoked in production components (`AuthenticityGuaranteeBox`, `ProductDetailView`, `ProductStickyBar`).
Four primary tracking functions are completely unwired in production views:
1. `trackLeadSubmission`: Not invoked in `InquiryForm` (`src/components/forms/inquiry-form.tsx`) or `ContactForm` (`src/components/forms/contact-form.tsx`).
2. `trackProductView`: Not invoked in `ProductDetailView` (`src/components/product/product-detail-view.tsx`).
3. `trackSearchQuery`: Not invoked in `SearchModal` (`src/components/catalog/search-modal.tsx`).
4. `trackCategoryView`: Not invoked in `CatalogContainer` (`src/components/catalog/catalog-container.tsx`).

#### Concrete Impact
- Zero conversion telemetry dispatched to GA4/Meta Pixel on lead form completions.
- Inability to measure search intent, search failure rates, or catalog category popularity.
- Product view eCommerce events (`view_item`) are not tracked.

#### Required Remediation Diffs

**A. `src/components/forms/inquiry-form.tsx`:**
```diff
--- a/src/components/forms/inquiry-form.tsx
+++ b/src/components/forms/inquiry-form.tsx
@@ -26,6 +26,7 @@ import { submitInquiryAction } from '@/actions/inquiry';
 import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
 import { formatNprPrice, cn } from '@/lib/utils';
+import { trackLeadSubmission } from '@/lib/analytics';
 
 import { Button } from '@/components/ui/button';
@@ -131,6 +132,12 @@ export function InquiryForm({
         const inquiryId = result.data.inquiryId;
         toast.success(result.message || 'Inquiry submitted successfully!');
         
+        trackLeadSubmission({
+          formName: 'InquiryForm',
+          city: finalPayload.deliveryCity,
+          inquiryType: values.inquiryType,
+        });
+
         setSubmittedReceipt({
           inquiryId,
           fullName: values.fullName,
```

**B. `src/components/forms/contact-form.tsx`:**
```diff
--- a/src/components/forms/contact-form.tsx
+++ b/src/components/forms/contact-form.tsx
@@ -23,6 +23,7 @@ import { submitContactAction } from '@/actions/contact';
 import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
 import { cn } from '@/lib/utils';
+import { trackLeadSubmission } from '@/lib/analytics';
 
 import { Button } from '@/components/ui/button';
@@ -121,6 +122,12 @@ export function ContactForm({ className, onSuccess }: ContactFormProps) {
         const inquiryId = result.data.inquiryId;
         toast.success(result.message || 'Contact message submitted successfully!');
 
+        trackLeadSubmission({
+          formName: 'ContactForm',
+          city: finalPayload.deliveryCity,
+          inquiryType: 'general_contact',
+        });
+
         setSubmittedReceipt({
           inquiryId,
           fullName: values.fullName,
```

**C. `src/components/product/product-detail-view.tsx`:**
```diff
--- a/src/components/product/product-detail-view.tsx
+++ b/src/components/product/product-detail-view.tsx
@@ -11,7 +11,7 @@ import Link from 'next/link';
 import { cn, formatNprPrice, calculateDiscountPercentage } from '@/lib/utils';
 import type { Product, ProductVariant, Category, Brand } from '@/lib/validations/product';
 import { buildProductWhatsAppUrl } from '@/lib/whatsapp';
-import { trackWhatsAppClick } from '@/lib/analytics';
+import { trackWhatsAppClick, trackProductView } from '@/lib/analytics';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
@@ -67,6 +67,17 @@ export function ProductDetailView({
     setSelectedVariant(defaultVariant);
   }
 
+  // Track product view on initial mount and when product changes
+  React.useEffect(() => {
+    trackProductView({
+      productId: product.id,
+      productName: product.name,
+      brand: brand?.name,
+      category: category?.name,
+      price: selectedVariant.discountPriceNpr || selectedVariant.priceNpr,
+    });
+  }, [product.id, product.name, brand?.name, category?.name, selectedVariant.priceNpr, selectedVariant.discountPriceNpr]);
+
   // Compute live price & discount
   const activePrice = selectedVariant.discountPriceNpr || selectedVariant.priceNpr;
```

**D. `src/components/catalog/search-modal.tsx`:**
```diff
--- a/src/components/catalog/search-modal.tsx
+++ b/src/components/catalog/search-modal.tsx
@@ -23,6 +23,7 @@ import {
 import { formatNprPrice, calculateDiscountPercentage } from "@/lib/utils";
 import { DEFAULT_PRODUCT_PLACEHOLDER } from "@/lib/constants";
 import { Badge } from "@/components/ui/badge";
+import { trackSearchQuery } from "@/lib/analytics";
 
 const POPULAR_CATEGORIES = [
@@ -133,6 +134,7 @@ export function SearchModal({
         const res = await searchProducts(trimmed, 8);
         if (cancelled) return;
         setResults(res);
+        trackSearchQuery({ query: trimmed, resultsCount: res.length });
       } catch (err) {
         if (cancelled) return;
```

**E. `src/components/catalog/catalog-container.tsx`:**
```diff
--- a/src/components/catalog/catalog-container.tsx
+++ b/src/components/catalog/catalog-container.tsx
@@ -4,6 +4,7 @@ import * as React from 'react';
 import { useSearchParams, useRouter, usePathname } from 'next/navigation';
 import type { Product, Category, Brand } from '@/lib/validations/product';
 import { filterAndSortProducts } from '@/lib/catalog';
+import { trackCategoryView } from '@/lib/analytics';
 import { CatalogFilters } from './catalog-filters';
 import { MobileFilterDrawer } from './mobile-filter-drawer';
@@ -52,6 +53,16 @@ export function CatalogContainer({
     return filterAndSortProducts(initialProducts, filterOptions, categories, brands);
   }, [initialProducts, filterOptions, categories, brands]);
 
+  // Track category view when category filter changes
+  React.useEffect(() => {
+    if (filterOptions.category) {
+      const matchedCat = categories.find((c) => c.slug === filterOptions.category || c.id === filterOptions.category);
+      if (matchedCat) {
+        trackCategoryView({ categoryId: matchedCat.id, categoryName: matchedCat.name });
+      }
+    }
+  }, [filterOptions.category, categories]);
+
   const handleResetFilters = React.useCallback(() => {
```

---

### Finding 2: Direct Raw JSON Import & Accessor Bypass in `GuidesPage` (Audit Finding MED-08)

#### Context & Current State
`src/app/guides/page.tsx:6` directly imports `guidesData` from `@/data/guides.json`:
```typescript
import guidesData from '@/data/guides.json';
```
And executes synchronously without invoking `getAllGuides()` from `src/lib/data/guides.ts`.

#### Concrete Impact
- Violates `context/file-map.md` Rule 4 (*"Components must never directly import raw JSON files from `@/data/`"*).
- Bypasses runtime Zod validation (`GuideFrontmatterSchema.array().parse(...)`) in the data accessor layer.
- Fails to leverage the sorting logic (newest published date first) implemented in `getAllGuides()`.

#### Required Remediation Diff
```diff
--- a/src/app/guides/page.tsx
+++ b/src/app/guides/page.tsx
@@ -3,7 +3,7 @@ import Image from 'next/image';
 import Link from 'next/link';
 import { BookOpen, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
 import { STORE_NAME, SITE_URL } from '@/lib/constants';
-import guidesData from '@/data/guides.json';
+import { getAllGuides } from '@/lib/data/guides';
 import { Badge } from '@/components/ui/badge';
 import { Button } from '@/components/ui/button';
 
@@ -17,7 +17,8 @@ export const metadata: Metadata = {
   },
 };
 
-export default function GuidesPage() {
+export default async function GuidesPage() {
+  const guidesData = await getAllGuides();
   return (
     <div className="w-full bg-background py-8 sm:py-12 lg:py-16">
       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
```

---

### Finding 3: Redundant Constants & Dead Opening Hours Function in `src/lib/constants.ts` (Audit Finding LOW-05)

#### Context & Current State
`src/lib/constants.ts` defines:
- `STORE_PHONE_DISPLAY = STORE_PHONE;` (Line 23)
- `STORE_WHATSAPP_DISPLAY = "+977 986-1725036";` (Line 25)
- `isStoreOpenToday(date: Date)` (Lines 61-86)

Grep search confirms:
- Zero references across `src/` for `STORE_PHONE_DISPLAY` and `STORE_WHATSAPP_DISPLAY`.
- `isStoreOpenToday` is superseded by `isStoreOpenNow()` in `src/lib/data/store.ts` which handles opening hour sentinels, minute calculation, and timezone conversion cleanly.

#### Required Remediation Diff
```diff
--- a/src/lib/constants.ts
+++ b/src/lib/constants.ts
@@ -20,9 +20,7 @@ export const DEFAULT_PRODUCT_PLACEHOLDER = "/brnding-assets/logo.webp";
 // Contact & Ordering Details
 export const STORE_PHONE = "+977 986-1725036";
 export const STORE_PHONE_RAW = "+9779861725036";
-export const STORE_PHONE_DISPLAY = STORE_PHONE;
 export const STORE_WHATSAPP = "+9779861725036";
-export const STORE_WHATSAPP_DISPLAY = "+977 986-1725036";
 export const STORE_EMAIL = "orders@muscleworksnepal.com";
 export const STORE_SUPPORT_EMAIL = "support@muscleworksnepal.com";
 
@@ -58,31 +56,6 @@ export const STORE_HOURS = {
   closingTime: "20:00",
 } as const;
 
-/**
- * Dynamic calculation of whether the Golfutar store is open today at request time in Asia/Kathmandu.
- */
-export function isStoreOpenToday(date: Date = new Date()): boolean {
-  try {
-    const formatter = new Intl.DateTimeFormat("en-US", {
-      timeZone: "Asia/Kathmandu",
-      weekday: "short",
-      hour: "numeric",
-      hour12: false,
-    });
-    const parts = formatter.formatToParts(date);
-    let weekday = "";
-    let hour = 0;
-    
-    for (const part of parts) {
-      if (part.type === "weekday") weekday = part.value;
-      if (part.type === "hour") hour = parseInt(part.value, 10);
-    }
-    
-    // Saturday: contact required / closed for regular retail walk-ins
-    if (weekday === "Sat") return false;
-    
-    // Sun - Fri: 10:00 AM (10) - 8:00 PM (20)
-    return hour >= 10 && hour < 20;
-  } catch {
-    return false;
-  }
-}
-
 // Delivery Promises & Rules for Nepal
 export const DELIVERY_PROMISES = {
```

---

### Finding 4: Unused Toast Wrapper Functions in `src/components/ui/toast.tsx` (Audit Finding LOW-06)

#### Context & Current State
`src/components/ui/toast.tsx` exports:
- `toast` (re-export of `sonnerToast`)
- `showSuccessToast`, `showErrorToast`, `showInfoToast`, `showWarningToast`, `showWhatsAppToast`

All forms across the application import `toast` from `sonner` directly (`toast.success()`, `toast.error()`).

#### Assessment & Remediation Options
- **Option A (Recommended)**: Retain `toast` re-export from `src/components/ui/toast.tsx` and mark custom helpers as optional utilities or prune to minimize unused exports.

---

### Finding 5: Client Search Concurrent State Transition in `SearchModal` (Audit Finding LOW-07)

#### Context & Current State
In `src/components/catalog/search-modal.tsx:133`, when async search results resolve:
```typescript
const res = await searchProducts(trimmed, 8);
if (cancelled) return;
setResults(res);
```
During rapid keyboard strokes, directly setting state can lead to input lag on lower-tier mobile CPU threads.

#### Required Remediation Diff
```diff
--- a/src/components/catalog/search-modal.tsx
+++ b/src/components/catalog/search-modal.tsx
@@ -132,7 +132,9 @@ export function SearchModal({
       try {
         const res = await searchProducts(trimmed, 8);
         if (cancelled) return;
-        setResults(res);
+        React.startTransition(() => {
+          setResults(res);
+        });
       } catch (err) {
         if (cancelled) return;
```

---

### Finding 6: Strict MetadataRoute Type Annotation in `src/app/sitemap.ts` (Audit Finding LOW-08)

#### Context & Current State
In `src/app/sitemap.ts:34, 41, 48`, `changeFrequency` uses `'weekly' as const` without inheriting the explicit `MetadataRoute.Sitemap` element type.

#### Required Remediation Diff
```diff
--- a/src/app/sitemap.ts
+++ b/src/app/sitemap.ts
@@ -33,7 +33,7 @@ export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
     url: `${baseUrl}/products/${product.slug}`,
     lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
-    changeFrequency: 'weekly' as const,
+    changeFrequency: 'weekly',
     priority: 0.8,
   }));
 
@@ -40,7 +40,7 @@ export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
     url: `${baseUrl}/categories/${category.slug}`,
     lastModified: new Date(),
-    changeFrequency: 'weekly' as const,
+    changeFrequency: 'weekly',
     priority: 0.7,
   }));
 
@@ -47,7 +47,7 @@ export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
   const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
     url: `${baseUrl}/brands/${brand.slug}`,
     lastModified: new Date(),
-    changeFrequency: 'weekly' as const,
+    changeFrequency: 'weekly',
     priority: 0.7,
   }));
```

---

### Finding 7: Mobile Conversion CTA Touch Target Below 48px in `FeaturedProductsSection` (Audit Finding LOW-09)

#### Context & Current State
`src/components/home/featured-products-section.tsx:180` specifies:
```tsx
className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[44px] sm:min-h-[48px] ${banner.buttonClass}`}
```
On mobile viewports (<640px), the button defaults to `min-h-[44px]`, violating AGENTS.md Invariant 5 (*"conversion CTAs (WhatsApp/Call) must be $\ge 48\text{x}48\text{px}$"*).

#### Required Remediation Diff
```diff
--- a/src/components/home/featured-products-section.tsx
+++ b/src/components/home/featured-products-section.tsx
@@ -177,7 +177,7 @@ export function FeaturedProductsSection() {
                     <a
                       href={whatsappUrl}
                       target="_blank"
                       rel="noopener noreferrer"
-                      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[44px] sm:min-h-[48px] ${banner.buttonClass}`}
+                      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[48px] ${banner.buttonClass}`}
                       aria-label={`Order ${banner.title} via WhatsApp`}
                     >
                       ORDER NOW
```

---

### Finding 8: Sub-44px Touch Targets on Carousel Dots & Footer Legal Links (Audit Finding LOW-10)

#### Context & Current State
1. `src/components/home/customer-reviews-section.tsx:124-136`: The mobile review carousel indicator buttons are 10x10px (`w-2.5 h-2.5`) without an interactive touch padding wrapper.
2. `src/components/layout/footer.tsx:269-273`: Footer legal links (`LEGAL_LINKS`) have only `py-1` padding (~24px touch height).

#### Required Remediation Diffs

**A. `src/components/home/customer-reviews-section.tsx`:**
```diff
--- a/src/components/home/customer-reviews-section.tsx
+++ b/src/components/home/customer-reviews-section.tsx
@@ -124,13 +124,15 @@ export function CustomerReviewsSection() {
             <button
               key={i}
               type="button"
               onClick={() => scrollToCard(i)}
-              className={`transition-all duration-300 rounded-full cursor-pointer ${
-                activeIndex === i
-                  ? "w-6 h-2.5 bg-slate-900"
-                  : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
-              }`}
+              className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
               aria-label={`Go to review ${i + 1}`}
               aria-current={activeIndex === i ? "true" : undefined}
-            />
+            >
+              <span
+                className={`transition-all duration-300 rounded-full ${
+                  activeIndex === i
+                    ? "w-6 h-2.5 bg-slate-900"
+                    : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
+                }`}
+              />
+            </button>
           ))}
```

**B. `src/components/layout/footer.tsx`:**
```diff
--- a/src/components/layout/footer.tsx
+++ b/src/components/layout/footer.tsx
@@ -265,7 +265,7 @@ export function Footer() {
             {LEGAL_LINKS.map((legal) => (
               <Link
                 key={legal.href}
                 href={legal.href}
-                className="inline-flex py-1 items-center transition-colors hover:text-foreground"
+                className="inline-flex min-h-[44px] items-center py-2 px-1 text-xs transition-colors hover:text-foreground"
               >
                 {legal.label}
               </Link>
```

---

### Finding 9: Legacy Compatibility Alias `getGuides` in `src/lib/data/guides.ts` (Audit Finding INFO-01)

#### Context & Current State
`src/lib/data/guides.ts:83` exports:
```typescript
export const getGuides = getAllGuides;
```
It is unreferenced across the codebase.

#### Required Remediation Diff
```diff
--- a/src/lib/data/guides.ts
+++ b/src/lib/data/guides.ts
@@ -79,6 +79,2 @@ export async function getRelatedGuides(
   return [...sameCategory, ...remaining].slice(0, limit);
 }
-
-/**
- * Backward compatibility alias for getAllGuides.
- */
-export const getGuides = getAllGuides;
```

---

### Finding 10: Explicit `aria-label` on Hidden Filter Checkbox in `BrandFilter` (Audit Finding INFO-02)

#### Context & Current State
`src/components/catalog/brand-filter.tsx:110` renders:
```tsx
<input
  type="checkbox"
  checked={isChecked}
  onChange={() => onToggleBrand?.(brand.slug)}
  className="sr-only"
/>
```
Lacks an explicit `aria-label` attribute, unlike `catalog-filters.tsx`.

#### Required Remediation Diff
```diff
--- a/src/components/catalog/brand-filter.tsx
+++ b/src/components/catalog/brand-filter.tsx
@@ -107,6 +107,7 @@ export function BrandFilter({
               <input
                 type="checkbox"
                 checked={isChecked}
                 onChange={() => onToggleBrand?.(brand.slug)}
+                aria-label={`Filter by brand ${brand.name}`}
                 className="sr-only"
               />
```

---

### Finding 11: CI Dead Code Script Test Harness Filtering (Audit Finding MED-05)

#### Context & Current State
`src/scripts/check-dead-code.js` performs two primary checks:
1. Verifies if component files are referenced across `allFiles`. However, `allFiles` includes `src/scripts/`, causing test harness imports to count as production usage.
2. Checks for unreferenced exports across all files, flagging standard shadcn/Radix atomic primitives (`SheetClose`, `DialogPortal`, `BreadcrumbEllipsis`) as dead code.

#### Required Remediation Diff
```diff
--- a/src/scripts/check-dead-code.js
+++ b/src/scripts/check-dead-code.js
@@ -20,6 +20,7 @@ function getAllFiles(dir, ext = ['.ts', '.tsx', '.js', '.jsx']) {
 const srcDir = path.resolve('src');
 const allFiles = getAllFiles(srcDir);
+const prodFiles = allFiles.filter(f => !f.includes(path.join('src', 'scripts')));
 
 console.log(`Total source files: ${allFiles.length}`);
 
@@ -32,7 +33,7 @@ componentFiles.forEach(compPath => {
   const baseName = path.basename(compPath, path.extname(compPath));
   let isImported = false;
 
-  for (const file of allFiles) {
+  for (const file of prodFiles) {
     if (file === compPath) continue;
     const content = fs.readFileSync(file, 'utf8');
     if (content.includes(baseName)) {
```

---

## 3. Comprehensive Dead Code & Type Gap Ledger

| # | Entity Name | Type | Location | Recommended Action |
|:---:|---|---|---|---|
| **1** | `ConsultationModal` | Component | `src/components/forms/consultation-modal.tsx` | Mount in `HeroSection` or `ProductsPage` as interactive Stack Consultation trigger. |
| **2** | `InquiryPayload` | Interface | `src/types/actions.ts:23-34` | Prune dead interface (superseded by Zod-inferred `InquiryFormClientValues`). |
| **3** | `src/types/index.ts` | Barrel File | `src/types/index.ts:1-66` | Re-export canonical Zod types or prune unused file. |
| **4** | `slugify`, `formatPhoneNumber`, `truncateText` | Functions | `src/lib/utils.ts:49-59, 72-78, 83-86` | Retain as documented internal utility helpers or prune. |
| **5** | `STORE_PHONE_DISPLAY`, `STORE_WHATSAPP_DISPLAY` | Constants | `src/lib/constants.ts:23, 25` | Prune redundant aliases (`= STORE_PHONE`). |
| **6** | `isStoreOpenToday` | Function | `src/lib/constants.ts:61-86` | Prune (superseded by `isStoreOpenNow()` in `src/lib/data/store.ts`). |
| **7** | `getGuides` | Function Alias | `src/lib/data/guides.ts:83` | Prune unused backward compatibility alias. |
| **8** | `showSuccessToast` .. `showWhatsAppToast` | Functions | `src/components/ui/toast.tsx:6-54` | Retain as optional custom styling wrappers or prune. |
| **9** | `InquiryServerPayloadSchema`, `ActionResultSchema` | Zod Schemas | `src/lib/validations/inquiry.ts:82-99` | Prune unused schemas. |

---

## 4. Test Suites, Tooling & Verification Matrix

### 4.1 Test Harness Catalog in `src/scripts/`

The codebase contains 15 automated validation test suites:
1. `check-dead-code.js`: AST / source string analysis for unreferenced files & exports.
2. `test-challenger-2.ts`: Edge proxy security headers, fuzzy search, Telegram escaping, sitemap & robots verification.
3. `validate-adversarial-stress.ts`: Input sanitization, XSS protection, anti-bot timing attacks, rate limiting stress.
4. `validate-catalog-accessors.ts`: Products, brands, and categories static data accessors.
5. `validate-form-components.ts`: React Hook Form rendering, Zod schemas, honeypot fields.
6. `validate-location-components.ts`: Store metadata, hours calculation, Google Maps embed URLs.
7. `validate-notification-services.ts`: Telegram alerts, Resend email dispatching, template formatting.
8. `validate-pdp-components.ts`: ProductDetailView variant switches, pricing, discounts.
9. `validate-pdp-specs-components.ts`: Nutrition tables, allergen badges, authenticity guarantee box.
10. `validate-security-ratelimit.ts`: Upstash Redis rate limiter & in-memory sliding window fallback.
11. `validate-server-actions.ts`: 7-step defensive server action execution pipeline.
12. `validate-store-faq-guide-accessors.ts`: Store, FAQ, and Guide data accessors.
13. `validate-supplementary-datasets.ts`: Schema validation for `store-info.json` and `faqs.json`.
14. `validate-whatsapp-analytics.ts`: WhatsApp URL builder & analytics event dispatchers.
15. `verify-all-assets.ts`: Static asset disk validation across `public/`.

### 4.2 Proposed Tooling & `package.json` Enhancements
Add explicit script entries to `package.json`:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "typecheck": "tsc --noEmit",
  "test": "node src/scripts/check-dead-code.js",
  "test:all": "npx tsx src/scripts/validate-catalog-accessors.ts && npx tsx src/scripts/validate-server-actions.ts && npx tsx src/scripts/validate-security-ratelimit.ts && npx tsx src/scripts/validate-whatsapp-analytics.ts && npx tsx src/scripts/test-challenger-2.ts"
}
```

### 4.3 Knowledge Graph Synchronization
After implementing the changes:
1. Ensure the AST dependency graph in `graphify-out/` is re-indexed.
2. Verify all nodes in `graphify-out/graph.json` and report in `graphify-out/GRAPH_REPORT.md` reflect zero broken imports or invalid boundaries.

---

## 5. Verification Commands

To verify all findings and proposed remediations:
```bash
# 1. Type check gate
npx tsc --noEmit

# 2. Lint check gate
npm run lint

# 3. Dead code check gate
node src/scripts/check-dead-code.js

# 4. WhatsApp & Analytics Test Suite
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

# 6. Static Site Generation Build
npm run build
```
