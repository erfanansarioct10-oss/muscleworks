# ARCHITECTURE & DATA ACCESS INVESTIGATION REPORT (MED-01 TO MED-06)

**Target Codebase:** MUSCLEWORKS SUPPLEMENTS (`c:\nooridigital_assets\my-projects\muscleworks`)  
**Framework Stack:** Next.js 16.3.0 App Router · React 19.2.8 · TypeScript 5 (Strict) · Tailwind CSS v4 · Zod 3.24.2  
**Investigation Date:** 2026-08-15  
**Investigator:** Explorer 1 (Survey: Architecture & Data Access)  
**Parent Orchestrator:** `9e13bd04-d7a7-4bc1-a6f0-2e45323e13d0`  

---

## Executive Summary

This forensic investigation analyzes the architecture, Server/Client component boundaries, Next.js 16 breaking invariants, data access layers, and Zod validation across `src/app/`, `src/components/`, `src/lib/`, `src/actions/`, and `data/`.

### Key Findings Summary

1. **MED-01: Architectural Boundary Violations & Prop Passing**
   - `HomeFaqSection` (`src/components/home/home-faq-section.tsx`) hardcodes an inline array of 6 FAQ items inside a `'use client'` component, while `HomePage` (`src/app/page.tsx`) renders `<HomeFaqSection />` without passing server-fetched FAQs via props.
   - `BrandsMarquee` (`src/components/home/brands-marquee.tsx`) uses Node.js `fs.existsSync(path.join(process.cwd(), ...))` inside a Server Component, violating serverless/edge runtime compatibility.
   - `CustomerReviewsSection` (`src/components/home/customer-reviews-section.tsx`) directly inlines raw JSON imports and Zod schema execution in a client bundle.
   - HTML5 boundary violations exist in `CatalogContainer` (nested `<main>` landmark) and `AuthenticityGuaranteeBox` (nested `<a><button>`).

2. **MED-02: Client Component Hooks / Server Action Interactions**
   - Server Actions (`src/actions/inquiry.ts` and `src/actions/contact.ts`) implement the 7-step security pipeline (`hp_field`, timing trap $\ge 2000$ms, Upstash rate limiting, Zod parsing, HTML sanitization, multi-channel dispatch, `ActionResult<T>`).
   - Client components (`InquiryForm`, `ContactForm`) invoke Server Actions correctly, but fail to fire marketing analytics conversion tracking (`trackLeadSubmission`) upon receipt of successful action responses.
   - `ConsultationModal` (`src/components/forms/consultation-modal.tsx`) is an unmounted modal component across all active page routes.

3. **MED-03: Dynamic SEO Params / Metadata Generation in Next.js 16 (`await params`)**
   - Dynamic page routes (`/products/[slug]`, `/categories/[slug]`, `/brands/[slug]`) and catalog search pages (`/products`) fully comply with Next.js 16 async route props: `await props.params` and `await props.searchParams`.
   - `src/app/guides/page.tsx` is currently synchronous and needs to be converted to `async` when consuming `await getAllGuides()`.

4. **MED-04: Direct Raw JSON Imports Bypassing Data Access Layer**
   - 3 component/page files bypass the `src/lib/data/` accessor layer with direct raw JSON imports:
     1. `src/components/home/customer-reviews-section.tsx:5` (`import reviewsData from "@/../data/reviews.json"`)
     2. `src/components/location/store-map-embed.tsx:3` (`import rawStoreData from '@/data/store-info.json'`)
     3. `src/app/guides/page.tsx:6` (`import guidesData from '@/data/guides.json'`)

5. **MED-05: Data Access Layer & Zod Validation Schema Conformance**
   - Canonical accessors exist for products, categories, brands, store, faqs, and guides.
   - `src/lib/data/reviews.ts` is missing and must be created to provide `getReviews()` and `getFeaturedReviews()` backed by `ReviewItemSchema`.
   - Dead interface `InquiryPayload` in `src/types/actions.ts` and unused alias `getGuides` in `src/lib/data/guides.ts` should be pruned.

6. **MED-06: Cache Tagging & Data Access Consistency**
   - The application relies on Full Static Site Generation (SSG, 0ms TTFB) with `generateStaticParams()` across all dynamic slug routes.
   - Data accessors parse static JSON at module initialization and return Promises uniformly.
   - Dynamic mutation rate limiting is cached via Upstash Redis sliding window with local in-memory fallback.

---

## Detailed Itemized Investigations

---

### MED-01: Architectural Boundary Violations & Component Layering

#### 1.1 HomeFaqSection vs HomePage Server-Client Boundary
- **Files:** `src/components/home/home-faq-section.tsx:15-58` & `src/app/page.tsx:11-25`
- **Issue:** `HomeFaqSection` is a `'use client'` component containing a hardcoded static array of FAQs (`HOMEPAGE_FAQS: FaqItem[]`). `HomePage` is a Server Component that simply mounts `<HomeFaqSection />` without passing data.
- **Impact:** Duplicates FAQ data from `data/faqs.json`, causing state divergence with Schema.org JSON-LD structured data. Direct client calling of `getFeaturedFAQs()` would evaluate a Promise in the client bundle.
- **Architectural Solution:**
  - `src/app/page.tsx` becomes `async default function HomePage()`, calls `const faqs = await getFeaturedFAQs(6)`, and passes `faqs={faqs}` to `<HomeFaqSection faqs={faqs} />`.
  - `HomeFaqSection` accepts `{ faqs = [] }: { faqs?: FAQItem[] }` and iterates over the prop.

```diff
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -8,6 +8,7 @@ import { CustomerReviewsSection } from "@/components/home/customer-reviews-section";
 import { HomeContactSection } from "@/components/home/home-contact-section";
 import { HomeFaqSection } from "@/components/home/home-faq-section";
+import { getFeaturedFAQs } from "@/lib/data/faqs";
 
-export default function HomePage() {
+export default async function HomePage() {
+  const faqs = await getFeaturedFAQs(6);
   return (
     <div className="w-full flex-1 bg-background">
       <HeroSection />
@@ -20,7 +21,7 @@ export default function HomePage() {
       <FavoriteBrandSection />
       <CustomerReviewsSection />
       <HomeContactSection />
-      <HomeFaqSection />
+      <HomeFaqSection faqs={faqs} />
     </div>
   );
 }
```

```diff
--- a/src/components/home/home-faq-section.tsx
+++ b/src/components/home/home-faq-section.tsx
@@ -11,48 +11,7 @@ import {
 } from "@/components/ui/accordion";
 import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
 import { STORE_PHONE, STORE_PHONE_RAW } from "@/lib/constants";
-
-interface FaqItem {
-  id: string;
-  question: string;
-  answer: string;
-}
-
-const HOMEPAGE_FAQS: FaqItem[] = [
-  ...
-];
+import type { FAQItem } from "@/lib/validations/common";
 
-export function HomeFaqSection() {
+export function HomeFaqSection({ faqs = [] }: { faqs?: FAQItem[] }) {
   const directWhatsAppUrl = buildGeneralWhatsAppUrl(
@@ -141,3 +100,3 @@ export function HomeFaqSection({ faqs = [] }: { faqs?: FAQItem[] }) {
-              {HOMEPAGE_FAQS.map((faq) => (
+              {faqs.map((faq) => (
                 <AccordionItem
```

---

#### 1.2 Node.js `fs`/`path` in `BrandsMarquee` Server Component
- **File:** `src/components/home/brands-marquee.tsx:3-4, 16-21`
- **Issue:** `BrandsMarquee` imports `fs` and `path` to check `fs.existsSync(path.join(process.cwd(), 'public', brand.logo.url))`.
- **Impact:** Breaks edge and serverless environments where `process.cwd()` is not mapped to static assets or `fs` is unavailable.
- **Architectural Solution:** Filter brands based purely on data contracts (`Boolean(brand.logo?.url)`), removing `fs` and `path` imports.

```diff
--- a/src/components/home/brands-marquee.tsx
+++ b/src/components/home/brands-marquee.tsx
@@ -1,7 +1,5 @@
 import Link from "next/link";
 import Image from "next/image";
-import fs from "fs";
-import path from "path";
 import { getBrands } from "@/lib/data/brands";
 import { ShieldCheck } from "lucide-react";
 
@@ -16,8 +14,6 @@ export async function BrandsMarquee() {
   const logoBrands = allBrands.filter((brand) => {
     if (!brand.logo?.url) return false;
     if (brand.logo.url.endsWith('.svg')) return false;
-    const fullPath = path.join(process.cwd(), 'public', brand.logo.url);
-    return fs.existsSync(fullPath);
+    return true;
   });
```

---

#### 1.3 HTML5 Landmark & Interactive Element Nesting
- **Files:** `src/components/catalog/catalog-container.tsx:103` & `src/components/product/authenticity-guarantee-box.tsx:138-154`
- **Issues:**
  1. `CatalogContainer` renders a `<main className="flex-1 min-w-0 w-full">` inside the layout's root `<main id="main-content">` landmark.
  2. `AuthenticityGuaranteeBox` wraps `<Button>` inside `<a>` without `asChild`, producing invalid HTML: `<a><button type="button">...</button></a>`.
- **Architectural Solution:**
  1. Replace nested `<main>` with `<section aria-label="Supplement Catalog Products" className="flex-1 min-w-0 w-full">`.
  2. Use `<Button asChild>` around the `<a>` tag in `AuthenticityGuaranteeBox`.

---

### MED-02: Client Component Hooks / Server Action Interactions

#### 2.1 Server Action Defense-in-Depth Pipeline Conformance
- **Files:** `src/actions/inquiry.ts` and `src/actions/contact.ts`
- **Analysis:**
  - Both actions strictly declare `'use server'`.
  - Both actions follow the 7-step pipeline:
    1. Honeypot check: `isHoneypotTriggered(values.hp_field)` $\rightarrow$ `SILENT_SPAM_SUCCESS_RESPONSE`.
    2. Timing trap check: `isTimingTrapTriggered(values._form_loaded_at)` (minimum 2000ms).
    3. Zod validation: `InquiryFormClientSchema.safeParse(values)`.
    4. Rate limiting: `checkRateLimit('inquiry', 5, 3600)` and `checkRateLimit('contact', 5, 3600)`.
    5. Payload sanitization: `sanitizePayload(parsed.data)` (strips HTML tags).
    6. Multi-channel dispatch: `Promise.allSettled([sendTelegramAlert(...), sendInquiryEmails(...)])`.
    7. Standard envelope return: `ActionResult<{ inquiryId: string }>`.

#### 2.2 Telemetry Event Wiring on Successful Submissions
- **Files:** `src/components/forms/inquiry-form.tsx:130-145` & `src/components/forms/contact-form.tsx:119-133`
- **Issue:** Neither form dispatches `trackLeadSubmission` (`src/lib/analytics.ts`) upon receiving a successful `result.success` response from the Server Action.
- **Architectural Solution:**
  - Import `trackLeadSubmission` from `@/lib/analytics`.
  - In `InquiryForm.onSubmit`:
    ```typescript
    trackLeadSubmission({
      formName: 'InquiryForm',
      city: finalPayload.deliveryCity,
      inquiryType: values.inquiryType,
    });
    ```
  - In `ContactForm.onSubmit`:
    ```typescript
    trackLeadSubmission({
      formName: 'ContactForm',
      city: finalPayload.deliveryCity,
      inquiryType: 'contact',
    });
    ```

---

### MED-03: Dynamic SEO Params & Next.js 16 Route Props

#### 3.1 Next.js 16 Promise Params Audit
In Next.js 16 App Router, `params` and `searchParams` passed to pages and layouts are Promises.

| File Path | Function / Export | Pattern Used | Compliance |
|---|---|---|:---:|
| `src/app/products/page.tsx` | `generateMetadata` | `const searchParams = await props.searchParams;` | ✅ Compliant |
| `src/app/products/page.tsx` | `ProductsPage` | `await props.searchParams;` | ✅ Compliant |
| `src/app/products/[slug]/page.tsx` | `generateStaticParams` | `const products = await getProducts(); return products.map(...)` | ✅ Compliant |
| `src/app/products/[slug]/page.tsx` | `generateMetadata` | `const { slug } = await props.params;` | ✅ Compliant |
| `src/app/products/[slug]/page.tsx` | `ProductDetailPage` | `const { slug } = await props.params;` | ✅ Compliant |
| `src/app/categories/[slug]/page.tsx` | `generateStaticParams` | `const categories = await getCategories(); return categories.map(...)` | ✅ Compliant |
| `src/app/categories/[slug]/page.tsx` | `generateMetadata` | `const { slug } = await props.params;` | ✅ Compliant |
| `src/app/categories/[slug]/page.tsx` | `CategoryArchivePage` | `const { slug } = await props.params;` | ✅ Compliant |
| `src/app/brands/[slug]/page.tsx` | `generateStaticParams` | `const brands = await getBrands(); return brands.map(...)` | ✅ Compliant |
| `src/app/brands/[slug]/page.tsx` | `generateMetadata` | `const { slug } = await props.params;` | ✅ Compliant |
| `src/app/brands/[slug]/page.tsx` | `BrandArchivePage` | `const { slug } = await props.params;` | ✅ Compliant |
| `src/app/guides/page.tsx` | `GuidesPage` | Needs `export default async function GuidesPage()` | ⚠️ Refactor required |

---

### MED-04: Direct Raw JSON Imports Bypassing Data Access Layer

#### 4.1 Audit of All Raw JSON Imports
`context/file-map.md` Rule 4 states: *"Components must never directly import raw JSON files from `@/data/`"*.

1. **`src/components/home/customer-reviews-section.tsx:5`**
   - **Current:** `import reviewsData from "@/../data/reviews.json";` + `ReviewItemSchema.array().parse(reviewsData);`
   - **Remediation:** Import `getFeaturedReviews` from `@/lib/data/reviews`.
2. **`src/components/location/store-map-embed.tsx:3`**
   - **Current:** `import rawStoreData from '@/data/store-info.json';`
   - **Remediation:** Import `STORE_LOCATION` from `@/lib/constants` (or `getStoreInfo` from `@/lib/data/store`).
3. **`src/app/guides/page.tsx:6`**
   - **Current:** `import guidesData from '@/data/guides.json';`
   - **Remediation:** Import `getAllGuides` from `@/lib/data/guides` and call `await getAllGuides()` in an async Server Component.

---

### MED-05: Data Access Layer & Zod Validation Conformance

#### 5.1 Missing Data Accessor: `src/lib/data/reviews.ts`
To normalize data access for reviews, create `src/lib/data/reviews.ts`:

```typescript
import rawReviewsData from '@/data/reviews.json';
import { ReviewItem, ReviewItemSchema } from '@/lib/validations/review';

/**
 * Validated in-memory cache of customer reviews
 */
const parsedReviews: ReviewItem[] = ReviewItemSchema.array().parse(rawReviewsData);

/**
 * Returns all verified customer reviews.
 */
export function getReviews(): ReviewItem[] {
  return parsedReviews;
}

/**
 * Returns featured reviews for homepage carousel display.
 */
export function getFeaturedReviews(): ReviewItem[] {
  return parsedReviews.filter((r) => r.isFeatured);
}
```

#### 5.2 Dead Code & Orphan Type Pruning
1. **`src/types/actions.ts:23-34`:** `InquiryPayload` is outdated (uses `name`, `phone`, `city`) and unreferenced; remove it.
2. **`src/lib/data/guides.ts:83`:** `export const getGuides = getAllGuides;` is an unused backward compatibility alias; remove it.
3. **`src/lib/constants.ts:61-86`:** `isStoreOpenToday()` is unreferenced (superseded by dynamic `isStoreOpenNow()` in `src/lib/data/store.ts`); remove it.
4. **`src/scripts/check-dead-code.js`:** Update production filter so it does not treat test files in `src/scripts/` as production callers.

---

### MED-06: Cache Tagging & Data Access Consistency

#### 6.1 Static Site Generation (SSG) Caching Invariants
- All catalog routes (`/products/[slug]`, `/categories/[slug]`, `/brands/[slug]`) use `generateStaticParams()` to pre-render static HTML and JSON manifests during `next build`.
- Page routes and SEO metadata generators share the same in-memory validated datasets (`validatedProducts`, `validatedCategories`, etc.).
- There is no dynamic runtime database querying for catalog items; static data is pre-validated at module evaluation time.
- All accessor functions in `src/lib/data/` consistently return Promises (`Promise<Product[]>`, `Promise<Category | null>`, etc.) to ensure uniform `async/await` syntax in Server Components.

---

## Action Plan for Implementation Agents

| Step | Target File | Action | Finding ID |
|---|---|---|---|
| **1** | `src/lib/data/reviews.ts` | **Create** new accessor module exporting `getReviews()` and `getFeaturedReviews()` | MED-04, MED-05 |
| **2** | `src/components/home/customer-reviews-section.tsx` | Replace raw JSON import with `getFeaturedReviews()` and fix touch targets | MED-01, MED-04 |
| **3** | `src/components/location/store-map-embed.tsx` | Replace raw JSON import with `STORE_LOCATION` from `@/lib/constants` | MED-04 |
| **4** | `src/app/page.tsx` & `src/components/home/home-faq-section.tsx` | Fetch `getFeaturedFAQs(6)` in `HomePage` and pass `faqs={faqs}` to `HomeFaqSection` | MED-01 |
| **5** | `src/app/guides/page.tsx` | Convert `GuidesPage` to async Server Component and fetch `await getAllGuides()` | MED-03, MED-04 |
| **6** | `src/components/home/brands-marquee.tsx` | Remove `fs`/`path` imports and disk check; filter on `Boolean(brand.logo?.url)` | MED-01 |
| **7** | `src/components/catalog/catalog-container.tsx` | Change nested `<main>` to `<section aria-label="Supplement Catalog Products">` | MED-01 |
| **8** | `src/components/product/authenticity-guarantee-box.tsx` | Fix nested `<a><button>` by using `<Button asChild>` around `<a>` | MED-01 |
| **9** | `src/components/forms/inquiry-form.tsx` & `contact-form.tsx` | Wire `trackLeadSubmission` to successful submissions | MED-02 |
| **10** | `src/types/actions.ts`, `src/lib/constants.ts`, `src/lib/data/guides.ts` | Prune dead types (`InquiryPayload`), aliases (`getGuides`, `STORE_PHONE_DISPLAY`), and dead functions (`isStoreOpenToday`) | MED-05 |
| **11** | `src/scripts/check-dead-code.js` | Exclude `src/scripts/` test files from production caller searches | MED-05 |
| **12** | Test Harness | Verify clean execution of `npx tsc --noEmit`, `npm run lint`, and all 15 automated test scripts in `src/scripts/` | All |
