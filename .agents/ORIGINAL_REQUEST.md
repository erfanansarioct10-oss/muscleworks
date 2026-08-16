# Original User Request

## 2026-08-15T08:06:00Z

This is a single self-contained fix; keep it small and focused.

Remediate all identified medium and low priority audit findings (M-1 to M-4, L-1 to L-3) from the Comprehensive Codebase Audit for MuscleWorks Supplements, preserving all Next.js 16/React 19 invariants, and verify the fixes against the full testing harness.

Working directory: c:/nooridigital_assets/my-projects/muscleworks
Integrity mode: development

## Requirements

### R1. Navigation, Route & Copy Consistency (M-3, M-4, L-1, L-3)
- Fix the mobile navigation drawer in `src/components/layout/mobile-nav.tsx` so the "100% Authenticity Guarantee" navigation item routes to `/authenticity` instead of `/products`.
- Harmonize the free delivery threshold copy across `src/components/product/product-detail-view.tsx` and `src/app/shipping/page.tsx` to match the canonical NPR 5,000 threshold defined in `src/lib/constants.ts` (`DELIVERY_PROMISES.freeDeliveryThreshold`).
- Update outdated placeholder phone references in `src/app/(marketing)/contact/page.tsx` metadata description to use the canonical hotline `+977 981-9877070` (`STORE_PHONE`).
- Standardize OpenGraph `url` definitions in metadata across marketing, catalog, and brand routes (`contact`, `location`, `brands`, `categories`, `products`) to dynamically interpolate `SITE_URL` from `@/lib/constants`.

### R2. Performance & Image Loading Optimization (M-1, M-2)
- Remove `priority` (or ensure lazy loading) on below-the-fold banner images in `src/components/home/featured-products-section.tsx` to eliminate initial load bandwidth congestion and preload warnings.
- Optimize the promotional deal assets referenced by `src/components/home/deals-section.tsx` (`bpi-1-mr-vortex`, `hyper-mass`, `impact-whey`, `omega-3`), converting them to WebP format where appropriate and updating component references.

### R3. Orphaned Asset Cleanup (L-2)
- Safely remove unreferenced legacy `.png` files in `public/` that have been replaced by `.webp` assets, ensuring no active components or metadata references are broken.

### R4. Complete End-to-End Test Suite Verification
- Verify that the codebase builds with zero TypeScript errors (`npx tsc --noEmit`), zero ESLint warnings (`npm run lint`), and builds all static routes cleanly (`npm run build`).
- Execute all 12+ automated validation suites in `src/scripts/` to confirm 100% pass rate across catalog data accessors, server actions, rate limiting, notifications, WhatsApp URL builder, PDP components, adversarial stress testing, and dead code analysis.

## Acceptance Criteria

### Functionality & Consistency
- [ ] Mobile navigation "Authenticity Guarantee" links directly to `/authenticity`.
- [ ] Free delivery threshold consistently displays NPR 5,000 across PDP and Shipping policy pages.
- [ ] Contact page metadata description contains `+977 981-9877070`.
- [ ] OpenGraph metadata URLs reference canonical `SITE_URL`.
- [ ] Below-the-fold banners in `featured-products-section.tsx` do not have the `priority` attribute.
- [ ] Deals section assets load optimized image formats.
- [ ] Orphaned legacy PNG files in `public/` are purged without breaking any active asset references.

### Verification & Test Suite Gate
- [ ] `npx tsc --noEmit` exits with code 0 (0 type errors).
- [ ] `npm run lint` exits with code 0 (0 lint errors/warnings).
- [ ] `npm run build` succeeds and pre-renders all static pages without errors.
- [ ] `npx tsx src/scripts/validate-catalog-accessors.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-server-actions.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-security-ratelimit.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-notification-services.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-whatsapp-analytics.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-location-components.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-form-components.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-pdp-components.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-pdp-specs-components.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-adversarial-stress.ts` passes 100%.
- [ ] `npx tsx src/scripts/test-challenger-2.ts` passes 100%.
- [ ] `node src/scripts/check-dead-code.js` passes with zero unreferenced component files.

## 2026-08-15T11:56:28Z

Conduct a comprehensive, forensic codebase audit of `muscleworks` to evaluate adherence to modern JavaScript/TypeScript standards, Next.js 16 / React 19 architecture, strict type safety, defensive validation, accessibility, and clean code hygiene, producing a master `AUDIT_REPORT.md`.

Working directory: `c:\nooridigital_assets\my-projects\muscleworks`  
Integrity mode: development

---

## Requirements

### R1. Knowledge Graph & Architectural Boundary Analysis
Inspect the codebase knowledge graph in `graphify-out/graph.json` and `graphify-out/GRAPH_REPORT.md`. Map cross-boundary connections between UI components (`src/components/`), Server Actions (`src/actions/`), Zod validation schemas (`src/lib/validations/`), static data accessors (`src/lib/data/`), and proxy edge middleware (`src/proxy.ts`). Trace key community clusters including WhatsApp Ordering Engine, Server Actions & Notifications, Rate Limiting & Security, and Authenticity Verification.

### R2. Modern JavaScript/TypeScript & Next.js 16 / React 19 Compliance
Audit the codebase against modern ECMAScript idioms (nullish coalescing `??`, optional chaining `?.`, `Object.entries()`, pure functional immutable transformations) and Next.js 16 breaking invariants:
- Ensure all route `params` and `searchParams` in `page.tsx` and `layout.tsx` are treated as Promises and properly `await`ed.
- Verify strict Server vs. Client component boundaries (`'use client'` strictly on leaf interactive components; zero secret leakage or fs imports in client bundles).
- Verify edge routing and custom header injection resides in `src/proxy.ts` (not `middleware.ts`).
- Enforce strict type safety: zero `any`, zero un-validated `unknown` casts, and end-to-end typing via `z.infer<typeof Schema>`.

### R3. Defensive Programming, Validation & Anti-Spam Security Traps
Audit all Server Actions (`src/actions/`) and form handlers:
- Validate that every Server Action enforces strict Zod schema parsing at its entry boundary.
- Confirm all Server Actions return the standardized `ActionResult<T>` envelope (`{ success, message, error, fieldErrors, data }`).
- Confirm all public form handlers enforce the `hp_field` honeypot and `_form_loaded_at` (minimum 2000ms submission threshold) anti-bot timing traps.

### R4. Accessibility, HTML Semantics & Touch Target Compliance (WCAG AA)
Audit all UI components and layouts for accessibility standards:
- Verify semantic HTML landmark structure (`<main>`, `<nav>`, `<header>`, `<article>`, `<section>`).
- Enforce touch target sizing: standard interactive elements >= 44x44px, conversion CTAs (WhatsApp, Phone Call, Primary Order triggers) >= 48x48px.
- Verify `aria-label`, `aria-expanded`, and `.sr-only` accessibility text on all icon-only buttons and modal dialog triggers.

### R5. Master Deliverable Compilation (`AUDIT_REPORT.md`)
Compile all findings into a structured `AUDIT_REPORT.md` at the project root (`c:\nooridigital_assets\my-projects\muscleworks\AUDIT_REPORT.md`) with the following mandatory sections:
1. **Executive Summary & Quality Scorecard**: Overall codebase health grade (A+ to C), total issues categorized by severity (High / Medium / Low), and orphan/dead code summary.
2. **Itemized Audit Findings (Ranked by Severity)**: Each finding must detail `File & Line`, `Graph Node / Community`, `Violation Description`, `Root Cause & Concrete Impact`, and a copy-paste ready fix diff.
3. **Dead Code & Orphan Node Ledger**: Complete listing of unused exports, abandoned helpers, or isolated graph nodes.
4. **Verification & Clean Build Confirmation**: Results of `npx tsc --noEmit` and `npm run lint`.

Do not apply destructive code changes directly during the audit; deliver the complete, verified report.

---

## Verification Resources
- Graph Database: `graphify-out/graph.json` and `graphify-out/GRAPH_REPORT.md`
- Canonical Specs: `context/` (`project-architecture.md`, `data-models.md`, `coding-standards.md`, `feature-roadmap.md`)
- TypeScript Compilation Check: `npx tsc --noEmit`
- Linter Check: `npm run lint`

---

## Acceptance Criteria

### Knowledge Graph & Dead Code Identification
- [ ] Analyzes `graphify-out/graph.json` isolated nodes to identify any dead exports, unreferenced functions, or orphaned files.
- [ ] Traces community call graphs for WhatsApp Ordering, Server Actions, Rate Limiting, and Catalog Data flow.

### Code Hygiene & Architecture Verification
- [ ] Verifies zero `any` types across all `src/` modules.
- [ ] Verifies that all `page.tsx` and `layout.tsx` files `await params` / `await searchParams` per Next.js 16 App Router rules.
- [ ] Verifies that all Server Actions in `src/actions/` parse inputs with Zod and return `ActionResult<T>`.
- [ ] Verifies anti-spam honeypot (`hp_field`) and timing verification traps on all public lead/contact forms.
- [ ] Verifies mobile-first minimum touch targets (>= 44px standard, >= 48px conversion CTAs) and WCAG AA aria attributes.

### Deliverable Completeness & Clean Build
- [ ] Generates a comprehensive `AUDIT_REPORT.md` at `c:\nooridigital_assets\my-projects\muscleworks\AUDIT_REPORT.md` adhering to the exact required 4-part structure.
- [ ] All itemized findings include copy-paste ready diffs and exact file/line references.
- [ ] Verifies clean execution of `npx tsc --noEmit` and `npm run lint`.

## 2026-08-15T12:37:49Z

# Teamwork Project Prompt — Launched

> Status: Launched  
> Goal: Multi-agent execution in progress via teamwork_preview  
> Requested team: [none — teamwork routes from the description]

Execute a comprehensive remediation of all 20 itemized findings from `AUDIT_REPORT.md` across `muscleworks`, resolving architectural boundary violations, direct raw JSON imports, HTML5 accessibility nesting, sub-standard touch targets, unwired analytics dispatches, and dead code while ensuring strict Next.js 16 / React 19 compliance and 100% passing test suites.

Working directory: `c:\nooridigital_assets\my-projects\muscleworks`  
Integrity mode: development

---

## Requirements

### R1. Data Access Layer Normalization & Boundary Alignment
- Implement canonical data accessor `src/lib/data/reviews.ts` (`getReviews()`, `getFeaturedReviews()`) and eliminate direct raw JSON imports in `src/components/home/customer-reviews-section.tsx`.
- Refactor `src/components/location/store-map-embed.tsx` to source location and map embed data from canonical constants (`STORE_LOCATION`) or `src/lib/data/store.ts` instead of raw `@/data/store-info.json`.
- Refactor `src/components/home/home-faq-section.tsx` and `src/app/page.tsx` so the async Server Component fetches featured FAQs via `getFeaturedFAQs()` and passes them down as typed props (`faqs={faqs}`) to the client accordion component, removing hardcoded duplicate arrays.
- Refactor `src/app/guides/page.tsx` to consume `getAllGuides()` from `src/lib/data/guides.ts` instead of importing raw `data/guides.json`.

### R2. Next.js 16 Runtime & Accessibility Compliance (WCAG AA)
- Remove Node.js `fs`/`path` filesystem checks in `src/components/home/brands-marquee.tsx` to ensure seamless execution in Edge / serverless environments without filesystem dependency.
- Fix HTML5 landmark and nesting violations: replace nested `<main>` in `src/components/catalog/catalog-container.tsx` with `<section aria-label="Supplement Catalog Products">`, and refactor `src/components/product/authenticity-guarantee-box.tsx` to use `<Button asChild>` around the `<a>` tag to prevent invalid `<a><button>` nesting.
- Enforce touch target standards: ensure primary WhatsApp conversion CTAs in `src/components/home/featured-products-section.tsx` maintain $\ge 48\text{px}$ touch targets across all viewports; increase review carousel pagination buttons and footer legal links to satisfy $\ge 44\text{px}$ interactive bounds.
- Add explicit `aria-label` to hidden filter inputs in `src/components/catalog/brand-filter.tsx`.

### R3. Analytics Telemetry & Dead Code Pruning
- Wire `trackLeadSubmission` into `InquiryForm` (`src/components/forms/inquiry-form.tsx`) and `ContactForm` (`src/components/forms/contact-form.tsx`) on successful submission receipts.
- Wire `trackProductView`, `trackSearchQuery`, and `trackCategoryView` into `ProductDetailView`, `SearchModal`, and `CatalogContainer`.
- Prune dead types and redundant declarations: remove legacy `InquiryPayload` from `src/types/actions.ts`, prune redundant constant aliases (`STORE_PHONE_DISPLAY`, `STORE_WHATSAPP_DISPLAY`, `isStoreOpenToday`) in `src/lib/constants.ts`, and prune unused alias `getGuides` in `src/lib/data/guides.ts`.
- Mount `<ConsultationModal />` as a secondary trigger in `src/components/home/hero-section.tsx` or retain cleanly as a documented interactive consultation trigger.

### R4. Verification Tooling & Knowledge Graph Synchronization
- Update `src/scripts/check-dead-code.js` to exclude `src/scripts/` test files from production caller searches and whitelist standard Radix UI primitives.
- Create or update validation test suites in `src/scripts/` to verify the new reviews data accessor and all updated components.
- Run `npx tsc --noEmit` and `npm run lint` to guarantee zero type errors or lint warnings.
- Run `/graphify --update` (or `node scripts/build-graph.js`) to synchronize the codebase knowledge graph in `graphify-out/`.
- Update `context/progress-tracker.md` with detailed session notes logging all applied fixes.

---

## Verification Resources
- Audit Findings: `AUDIT_REPORT.md` (itemized diffs for MED-01 through MED-08, LOW-01 through LOW-10, INFO-01, INFO-02)
- Canonical Specifications: `context/` (`file-map.md`, `coding-standards.md`, `project-architecture.md`, `data-models.md`)
- Automated Type & Linter Suites: `npx tsc --noEmit`, `npm run lint`
- Test Suites: `npx tsx src/scripts/validate-all.ts` (or individual test runners in `src/scripts/`)
- Codebase Knowledge Graph: `graphify-out/graph.json` and `graphify-out/GRAPH_REPORT.md`

---

## Acceptance Criteria

### Data Layer & Boundary Integrity
- [ ] Zero raw JSON imports in UI components (`src/components/`) and page routes (`src/app/`).
- [ ] `src/lib/data/reviews.ts` exports `getReviews()` and `getFeaturedReviews()` backed by `ReviewItemSchema` Zod validation.
- [ ] `HomePage` (`src/app/page.tsx`) passes `faqs` to `HomeFaqSection`, which accepts `faqs?: FAQItem[]` props.
- [ ] `StoreMapEmbed` and `GuidesPage` strictly use data accessors and typed constants.

### Accessibility & Runtime Compliance
- [ ] No nested `<main>` landmarks and no nested `<a><button>` interactive elements.
- [ ] Primary conversion CTAs satisfy $\ge 48\text{px}$ touch target height; secondary links and carousel controls satisfy $\ge 44\text{px}$.
- [ ] `BrandsMarquee` operates purely on static data contracts with zero runtime `fs` calls.

### Telemetry & Code Hygiene
- [ ] GA4/Pixel tracking functions are wired to form submissions, product views, and search queries.
- [ ] Dead types (`InquiryPayload`), unused constant aliases, and dead functions (`isStoreOpenToday`) are pruned.
- [ ] `check-dead-code.js` correctly filters out test harness files.

### Build Verification & Knowledge Graph
- [ ] `npx tsc --noEmit` exits with 0 errors.
- [ ] `npm run lint` exits with 0 warnings/errors.
- [ ] All test suites in `src/scripts/` pass with 100% success.
- [ ] Codebase knowledge graph in `graphify-out/` is updated and synchronized.
- [ ] `context/progress-tracker.md` is updated with complete audit remediation notes.
