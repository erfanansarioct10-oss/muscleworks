# Handoff Report — Explorer 1 (Architecture & Data Access Survey)

**Agent ID:** Explorer 1 (`c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_survey_1`)  
**Parent Orchestrator:** `9e13bd04-d7a7-4bc1-a6f0-2e45323e13d0`  
**Date:** 2026-08-15  
**Handoff Type:** Hard (Survey Task Complete)  

---

## 1. Observation

Direct code inspections across `src/app/`, `src/components/`, `src/lib/`, `src/actions/`, and `data/` revealed the following exact references:

1. **Direct Raw JSON Imports Bypassing Data Layer:**
   - `src/components/home/customer-reviews-section.tsx:5`:
     ```typescript
     import reviewsData from "@/../data/reviews.json";
     import { ReviewItemSchema, type ReviewItem } from "@/lib/validations/review";
     const reviews: ReviewItem[] = ReviewItemSchema.array().parse(reviewsData);
     ```
   - `src/components/location/store-map-embed.tsx:3`:
     ```typescript
     import rawStoreData from '@/data/store-info.json';
     ```
   - `src/app/guides/page.tsx:6`:
     ```typescript
     import guidesData from '@/data/guides.json';
     ```

2. **Server vs. Client Boundary & Hardcoded Props:**
   - `src/components/home/home-faq-section.tsx:15-58`:
     `HomeFaqSection` hardcodes an inline array `HOMEPAGE_FAQS: FaqItem[]` inside a `'use client'` component.
   - `src/app/page.tsx:11-25`:
     `HomePage` is a synchronous Server Component that mounts `<HomeFaqSection />` without fetching or passing data from `src/lib/data/faqs.ts`.

3. **Node.js Filesystem Calls in Server Component:**
   - `src/components/home/brands-marquee.tsx:3-4, 16-21`:
     ```typescript
     import fs from 'fs';
     import path from 'path';
     ...
     const fullPath = path.join(process.cwd(), 'public', brand.logo.url);
     return fs.existsSync(fullPath);
     ```

4. **HTML5 Landmark & Interactive Element Nesting:**
   - `src/components/catalog/catalog-container.tsx:103`:
     `<main className="flex-1 min-w-0 w-full">` is rendered inside `layout.tsx`'s root `<main id="main-content">`.
   - `src/components/product/authenticity-guarantee-box.tsx:138-154`:
     `<a href={whatsappUrl}><Button ...>...</Button></a>` generates invalid nested `<a><button>` HTML.

5. **Unwired Telemetry in Form Submissions:**
   - `src/components/forms/inquiry-form.tsx:128-145` and `src/components/forms/contact-form.tsx:117-133`:
     `submitInquiryAction` and `submitContactAction` return `result.success`, but neither form invokes `trackLeadSubmission` (`src/lib/analytics.ts`).

6. **Next.js 16 Route Props Compliance:**
   - Dynamic pages (`/products/[slug]`, `/categories/[slug]`, `/brands/[slug]`, `/products`) properly `await props.params` and `await props.searchParams`.
   - `src/app/guides/page.tsx` is synchronous and directly consumes `guidesData.map()`.

---

## 2. Logic Chain

1. **Premise 1 (Data Access Layer Standard):** `context/file-map.md` Rule 4 requires that all data access pass through typed gateways in `src/lib/data/` validated by Zod schemas, with zero direct JSON imports in components or pages.
   - *Inference:* `customer-reviews-section.tsx`, `store-map-embed.tsx`, and `guides/page.tsx` directly violate this standard. Creating `src/lib/data/reviews.ts` and updating these 3 files restores 100% compliance.
2. **Premise 2 (Server vs Client Prop Flow):** In React Server Component architecture, data should be fetched at the page layer (Server Component) and passed down as serializable typed props to interactive Client Components.
   - *Inference:* Having `HomeFaqSection` hardcode 6 FAQs duplicates `data/faqs.json`. Refactoring `src/app/page.tsx` to `const faqs = await getFeaturedFAQs(6)` and passing `faqs={faqs}` to `<HomeFaqSection faqs={faqs} />` establishes the canonical boundary.
3. **Premise 3 (Serverless/Edge Runtime Safety):** Production deployments on Vercel Edge / Lambda workers may not expose a Node.js local filesystem at `process.cwd()`.
   - *Inference:* Removing `fs.existsSync` from `BrandsMarquee` and relying on the validated brand data schema ensures safe execution across all runtime targets.
4. **Premise 4 (Accessibility & HTML Semantics):** WCAG AA and HTML5 specs disallow nested `<main>` landmarks and nested interactive elements (`<a><button>`).
   - *Inference:* Replacing nested `<main>` with `<section aria-label="...">` and wrapping `<Button asChild>` around `<a>` in `AuthenticityGuaranteeBox` resolves both semantic errors without visual changes.
5. **Premise 5 (Analytics Completeness):** Lead conversion metrics in GA4 / Meta Pixel require dispatching events upon verified lead submission.
   - *Inference:* Calling `trackLeadSubmission` inside the successful submit handlers of `InquiryForm` and `ContactForm` restores conversion telemetry.

---

## 3. Caveats

- **Scope Boundary:** This survey focused on architectural boundaries, Server Action interactions, SEO params, data access layer conformance, raw JSON imports, and cache tagging (Findings MED-01 to MED-06). UI visual styling and asset cleanup (M-1, M-2, L-2) are scoped to other workers.
- **Read-Only Invariant:** Per Teamwork explorer directives, no source code outside `.agents/explorer_survey_1/` was modified during this survey. Complete copy-paste ready diffs and remediation plans are provided in `analysis.md`.
- **SSG Runtime Assumption:** All catalog data accessors operate over static in-memory JSON records pre-rendered at build time. No dynamic database or external CMS connections are present in V1.

---

## 4. Conclusion

The architecture of `muscleworks` is robust with 0 circular dependencies, zero `any` types, and strong defense-in-depth Server Actions. The identified defects (MED-01 through MED-06) are concentrated in:
1. 3 direct raw JSON imports (`CustomerReviewsSection`, `StoreMapEmbed`, `GuidesPage`).
2. 1 missing data accessor module (`src/lib/data/reviews.ts`).
3. 1 Server Component Node `fs` disk check (`BrandsMarquee`).
4. 1 hardcoded Client Component dataset (`HomeFaqSection` FAQ list).
5. 2 HTML semantic violations (nested `<main>` in `CatalogContainer`, nested `<a><button>` in `AuthenticityGuaranteeBox`).
6. Unwired telemetry calls (`trackLeadSubmission` in forms).

Remediation requires 1 new file (`src/lib/data/reviews.ts`) and surgical edits to 9 existing files, all documented with exact diffs in `analysis.md`.

---

## 5. Verification Method

Independent verification of the surveyed findings and future remediation can be conducted using:

1. **TypeScript Compilation:**
   ```powershell
   npx tsc --noEmit
   ```
   *Expected: Exit code 0, 0 type errors.*

2. **Linter Verification:**
   ```powershell
   npm run lint
   ```
   *Expected: Exit code 0, 0 ESLint warnings/errors.*

3. **Data Accessor Validation Suites:**
   ```powershell
   npx tsx src/scripts/validate-catalog-accessors.ts
   npx tsx src/scripts/validate-store-faq-guide-accessors.ts
   npx tsx src/scripts/validate-supplementary-datasets.ts
   ```
   *Expected: 100% pass rate.*

4. **Server Action & Form Validation:**
   ```powershell
   npx tsx src/scripts/validate-server-actions.ts
   npx tsx src/scripts/validate-form-components.ts
   npx tsx src/scripts/validate-whatsapp-analytics.ts
   ```
   *Expected: 100% pass rate.*

5. **Dead Code Check:**
   ```powershell
   node src/scripts/check-dead-code.js
   ```
   *Expected: Zero unreferenced component files.*
