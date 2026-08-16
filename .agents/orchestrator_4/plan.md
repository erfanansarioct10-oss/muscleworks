# Master Remediation Plan — MUSCLEWORKS Audit Findings

## Project Architecture & Scope
Remediate all 20 findings from `AUDIT_REPORT.md` (MED-01..08, LOW-01..10, INFO-01..02) with strict Next.js 16.3.0, React 19, TypeScript strict typing, mobile-first touch targets, WCAG AA accessibility, zero direct JSON bypasses, and 100% passing test suites.

## Feature Inventory & Audit Mapping
| # | Finding ID | Description | Assigned Milestone | Affected Files |
|---|------------|-------------|-------------------|----------------|
| 1 | MED-01 | Boundary Violations (HomeFAQSection, BrandsMarquee, CatalogContainer, AuthenticityGuaranteeBox) | M1 & M2 | `src/app/page.tsx`, `src/components/home/home-faq-section.tsx`, `src/components/home/brands-marquee.tsx`, `src/components/catalog/catalog-container.tsx`, `src/components/product/authenticity-guarantee-box.tsx` |
| 2 | MED-02 | Client Component Hooks & Server Action Telemetry | M4 | `src/components/forms/inquiry-form.tsx`, `src/components/forms/contact-form.tsx` |
| 3 | MED-03 | Dynamic Route Async Constraints (`await params` / async pages) | M1 & M2 | `src/app/guides/page.tsx`, `src/app/products/[slug]/page.tsx`, `src/app/categories/[slug]/page.tsx`, `src/app/brands/[slug]/page.tsx` |
| 4 | MED-04 | Direct Raw JSON Imports Bypassing Data Access Layer | M1 | `src/components/home/customer-reviews-section.tsx`, `src/components/store/store-map-embed.tsx`, `src/app/guides/page.tsx` |
| 5 | MED-05 | Data Access Layer & Zod Validation Conformance | M1 | `src/lib/data/reviews.ts` (new), `src/lib/data/guides.ts` |
| 6 | MED-06 | Cache Tagging & SSG Data Access Consistency | M1 | All `src/lib/data/*.ts` accessors |
| 7 | MED-07 | HTML5 Accessibility Nesting Violations | M2 | `src/components/catalog/catalog-container.tsx`, `src/components/product/authenticity-guarantee-box.tsx` |
| 8 | MED-08 | Missing Custom Analytics Event Dispatches | M4 | `InquiryForm`, `ContactForm`, `ProductDetailView`, `SearchModal`, `CatalogContainer` |
| 9 | LOW-01 | Sub-standard Touch Targets (<44px / <48px) | M3 | `FeaturedProductsSection`, `CustomerReviewsSection`, `Footer` |
| 10 | LOW-02 | Missing ARIA attributes & Dialog Accessibility | M3 | `BrandFilter`, `CatalogFilters`, `MobileFilterDrawer`, `MobileNav` |
| 11 | LOW-03 | Form Field Accessibility Conformance | M3 | Form inputs & validation feedback |
| 12 | LOW-04 | Button Contrast & Focus States | M3 | `Button` component & interactive elements |
| 13 | LOW-05 | Dead Code in Constants | M4 | `src/lib/constants.ts` |
| 14 | LOW-06 | Dead Types & Unused Barrel | M4 | `src/types/actions.ts`, `src/types/index.ts` |
| 15 | LOW-07 | Legacy Aliases in Data Layer | M1 | `src/lib/data/guides.ts` |
| 16 | LOW-08 | Strict Sitemap Typing | M2 | `src/app/sitemap.ts` |
| 17 | LOW-09 | React 19 Concurrent Transitions | M3 | `src/components/search/search-modal.tsx` |
| 18 | LOW-10 | Test Harness Caller Detection Exclusion | M4 | `src/scripts/check-dead-code.js` |
| 19 | INFO-01 | Documentation & Progress Tracker Sync | M4 & Final | `context/progress-tracker.md`, `DEAD_ENDS.md` |
| 20 | INFO-02 | Codebase Knowledge Graph Sync | Final | `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md` |

## Milestones
| # | Milestone Name | Scope | Dependencies | Status |
|---|----------------|-------|--------------|--------|
| M1 | Data Access Layer & Direct JSON Import Remediation | MED-04, MED-05, MED-06, LOW-07, MED-01 (FAQ server fetch) | Survey Complete | IN_PROGRESS |
| M2 | Architectural Boundaries, Node Imports & HTML5 Nesting | MED-01 (Marquee Node fs), MED-03, MED-07, LOW-08 | M1 | PLANNED |
| M3 | Touch Targets, ARIA Attributes & Interaction States | LOW-01, LOW-02, LOW-03, LOW-04, LOW-09 | M2 | PLANNED |
| M4 | Analytics Dispatches, Dead Code Pruning & Test Harness | MED-02, MED-08, LOW-05, LOW-06, LOW-10, INFO-01 | M3 | PLANNED |
| M5 | Final E2E Suite Verification & Knowledge Graph Synchronization | 100% test suites in `src/scripts/`, `tsc`, `lint`, `/graphify --update` | M1..M4 | PLANNED |

## Interface Contracts & File Ownership
- **M1 Exclusive Write Files**: `src/lib/data/reviews.ts` (create), `src/components/home/customer-reviews-section.tsx`, `src/components/store/store-map-embed.tsx`, `src/app/guides/page.tsx`, `src/lib/data/guides.ts`, `src/app/page.tsx`, `src/components/home/home-faq-section.tsx`
- **M2 Exclusive Write Files**: `src/components/home/brands-marquee.tsx`, `src/components/catalog/catalog-container.tsx`, `src/components/product/authenticity-guarantee-box.tsx`, `src/app/sitemap.ts`
- **M3 Exclusive Write Files**: `src/components/home/featured-products-section.tsx`, `src/components/layout/footer.tsx`, `src/components/catalog/brand-filter.tsx`, `src/components/catalog/catalog-filters.tsx`, `src/components/catalog/mobile-filter-drawer.tsx`, `src/components/layout/mobile-nav.tsx`, `src/components/search/search-modal.tsx`
- **M4 Exclusive Write Files**: `src/components/forms/inquiry-form.tsx`, `src/components/forms/contact-form.tsx`, `src/components/product/product-detail-view.tsx`, `src/lib/constants.ts`, `src/types/actions.ts`, `src/types/index.ts` (delete), `src/scripts/check-dead-code.js`, `context/progress-tracker.md`
