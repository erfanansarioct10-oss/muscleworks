# Implementation & Feature Specifications Guide

> **Location:** `context/feature-specs/`  
> **Target Project:** MUSCLEWORKS SUPPLEMENTS (`muscleworks`)  
> **Framework:** Next.js 16.3.0 App Router · React 19.2.8 · TypeScript 5 (Strict) · Tailwind CSS v4

This directory contains structured, detailed technical specification documents for complex features, architectural refactoring, bug fixes, sub-phase deep-dives, and code review resolutions across the MUSCLEWORKS SUPPLEMENTS platform.

Every AI coding agent **MUST** follow the guidelines and specification template documented below whenever instructed to write a feature or implementation spec.

---

## 1. Purpose of Feature Specifications

Feature specifications serve as technical design blueprints before code execution. They ensure that:

- Every proposed change strictly adheres to project architecture ([`context/project-architecture.md`](../project-architecture.md)), data models ([`context/data-models.md`](../data-models.md)), coding standards ([`context/coding-standards.md`](../coding-standards.md)), file layout ([`context/file-map.md`](../file-map.md)), and operating workflow ([`context/ai-workflow.md`](../ai-workflow.md)).
- Architectural risks, edge cases, mobile touch requirements, and data sources are identified before mutating code.
- Human reviewers and future agents can evaluate the technical approach, rationale, and scope prior to implementation.

---

## 2. File Naming Convention

All specification files inside `context/feature-specs/` **MUST** follow a two-digit sequential prefix followed by a concise kebab-case title:

```text
context/feature-specs/
├── README.md
├── 01-[feature-or-subphase-name].md
├── 02-[feature-or-subphase-name].md
└── ...
```

- **Prefix:** `01-`, `02-`, `03-`, etc. (incremented sequentially).
- **Format:** `.md` (Markdown).

---

## 3. Mandatory Specification Template

Every implementation specification file **MUST** include the following sections and answer the core questions: **What, Why, How, When, Required Data, Risks & Mitigations, and Verification**.

Copy and adapt this standard markdown template when creating new specs:

````markdown
# Feature Spec [ID]: [Feature or Task Title]

> **Spec ID:** [01-kebab-case-title]  
> **Target Sub-Phase / Branch:** [e.g., Sub-Phase 3.2 or feature/branch-name]  
> **Status:** [Draft / Approved / In Progress / Complete]  
> **Created Date:** [YYYY-MM-DD]  
> **Author:** [AI Agent / Engineer Name]

---

## Executive Summary

Provide a brief, high-level summary of the task, background context, key objectives, and architectural scope.

---

## 1. What We Are Going to Do

List all files to be created, modified, or deleted in an itemized table:

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/lib/data/[file].ts` | **[NEW]** | Summary of new file responsibility. |
| 2 | `src/components/[dir]/[component].tsx` | **[MODIFY]** | Summary of modifications. |
| 3 | `src/types/[old-type].ts` | **[DELETE]** | Reason for deletion. |

---

## 2. Why We Are Doing This

Document the rationale, root causes, and architectural justification:

1. **Project Standards Alignment:** Reference specific sections from `context/project-architecture.md`, `context/coding-standards.md`, `context/data-models.md`, or `context/project-overview.md`.
2. **Mobile-First & Usability:** Mobile viewport optimization (<640px), touch target standards (≥44x44px, ≥48x48px for conversion CTAs), and zero layout shift.
3. **Data Integrity & Performance:** Zod-first type safety, SSG build-time pre-rendering (0ms TTFB), and client bundle optimization (<90kB).

---

## 3. How We Are Going to Implement It

Provide a step-by-step technical breakdown of the code changes:

### Step 1: Data Models, Types & Accessor Gateway

- Canonical Zod schemas (`src/lib/validations/`), inferred TypeScript types (`src/types/`), and typed data accessors (`src/lib/data/`).

### Step 2: Component Architecture & Layouts

- Server vs. Client component boundaries, CVA button/badge variants, responsive layouts, and Tailwind CSS v4 `@theme` classes.

### Step 3: Server Action / Route / Integration Layer

- Server Action pipeline (Honeypot + Upstash rate limit + Zod validation + Resend/Telegram dispatch) or Next.js 16 async route integration.

---

## 4. When We Are Going to Do It

Define a sequential execution timeline (phase flow):

```text
Phase 1: Schemas, Types & Core Utilities
    │
    ▼
Phase 2: UI Primitives & Interactive Components
    │
    ▼
Phase 3: Route Integration & Server Action Pipelines
    │
    ▼
Phase 4: Responsive Audit & Touch Target Check
    │
    ▼
Phase 5: Type Check & Static Build Verification
```

---

## 5. Required Data & Data Sources

Detail all data requirements and their exact origins:

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Product Catalog | `data/products.json` via `src/lib/data/products.ts` | Rendering catalog cards, filters, and detail pages |
| Store Location & Hours | `data/store-info.json` via `src/lib/data/store.ts` | Golfutar address, maps embed, opening hours |
| WhatsApp URL Payload | `src/lib/whatsapp.ts` | Contextual `wa.me` direct order generator |
| Environmental Secrets | `.env.local` (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`) | Server-only notification dispatch |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

Identify technical risks, edge cases, and mitigation strategies:

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Next.js 16 Async Params Error** | Accessing `params.slug` synchronously in page/layout. | Always `await params` in all Next.js 16 Server Components. |
| **Mobile Touch Target Too Small** | Using default padding on mobile buttons/icons (<44px). | Apply `min-h-[44px]` (or `min-h-[48px]` for CTAs) and `min-w-[44px]`. |
| **Bot Spam on Inquiries** | Public form exposed to automated script submissions. | Enforce hidden `hp_field` honeypot + 2000ms timing trap in Server Action. |
| **Client Bundle Bloat** | Placing `'use client'` at the top of page or layout. | Keep `'use client'` strictly isolated to interactive leaf components. |

---

## 7. Verification & Definition of Done

State explicit conditions required for completion:

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` executes with zero errors.
3. Mobile viewport verified at 360px, 390px, 768px, and 1280px with zero horizontal scroll.
4. All conversion CTAs meet minimum touch target standards (≥48x48px).
5. `npm run build` succeeds with full static pre-rendering.

---

## 8. Agent Workflow Integration

> [!IMPORTANT]
> **Mandatory User Approval Rule:** After drafting an implementation spec in `context/feature-specs/` and updating `context/progress-tracker.md`, AI agents MUST **NOT** immediately start coding. Agents MUST present the spec summary to the user and obtain explicit approval before making any code changes.

When writing or executing a feature spec:

1. **Load Context:** Read `AGENTS.md`, `context/ai-workflow.md`, `context/progress-tracker.md`, and relevant context docs.
2. **Draft Spec:** Create `context/feature-specs/XX-[spec-name].md` using the template above.
3. **Update Progress Tracker:** Record the spec reference in `context/progress-tracker.md`.
4. **Obtain Approval (Mandatory Pause):** Present the plan to the user and wait for explicit approval.
5. **Execute & Validate:** Implement strictly within the approved scope, run `npx tsc --noEmit` and `npm run build`, then update trackers upon completion.
````

---

## 4. Specification Registry Index

| Spec ID | Title | Status | Target Area | Created Date |
|:--- |:--- |:---: |:--- |:--- |
| `01-coderabbit-review-resolutions` | [CodeRabbit Review Comments Resolution & Context Synchronization](01-coderabbit-review-resolutions.md) | **Approved** | Context Specs & Architecture | 2026-08-09 |
| `02-subphase-0.1-project-scaffold-dependency-manifest` | [Sub-Phase 0.1 — Project Scaffold & Dependency Manifest](02-subphase-0.1-project-scaffold-dependency-manifest.md) | **Approved** | Tooling & Infrastructure | 2026-08-09 |
| `03-subphase-0.2-styling-system-tailwind-theme-engine` | [Sub-Phase 0.2 — Styling System & Tailwind CSS v4 Theme Engine](03-subphase-0.2-styling-system-tailwind-theme-engine.md) | **Approved** | Styling & Theme Engine | 2026-08-09 |
| `04-subphase-0.3-core-utility-layer-type-foundations` | [Sub-Phase 0.3 — Core Utility Layer & Type Foundations](04-subphase-0.3-core-utility-layer-type-foundations.md) | **Approved** | Core Utilities & Types | 2026-08-09 |
| `05-subphase-0.4-root-layout-font-engine-metadata` | [Sub-Phase 0.4 — Root Layout Shell, Font Engine & Global Metadata](05-subphase-0.4-root-layout-font-engine-metadata.md) | **Approved** | Root Layout & SEO Metadata | 2026-08-09 |
| `06-subphase-1.1-core-action-feedback-primitives` | [Sub-Phase 1.1 — Core Action & Feedback Primitives](06-subphase-1.1-core-action-feedback-primitives.md) | **Approved** | Design System & UI Primitives | 2026-08-09 |
| `07-subphase-1.2-form-input-text-primitives` | [Sub-Phase 1.2 — Form Input & Text Primitives](07-subphase-1.2-form-input-text-primitives.md) | **Approved** | Design System & UI Primitives | 2026-08-09 |
| `08-subphase-1.3-overlay-dialog-primitives` | [Sub-Phase 1.3 — Overlay & Dialog Primitives (Radix Headless)](08-subphase-1.3-overlay-dialog-primitives.md) | **Approved** | Design System & UI Primitives | 2026-08-09 |
| `09-subphase-1.4-global-navigation-shell-header` | [Sub-Phase 1.4 — Global Navigation Shell & Header](09-subphase-1.4-global-navigation-shell-header.md) | **Approved** | Global Layout & Navigation | 2026-08-09 |
| `10-subphase-1.5-global-footer-floating-whatsapp-mobile-bar` | [Sub-Phase 1.5 — Global Footer, Floating WhatsApp & Mobile Action Bar](10-subphase-1.5-global-footer-floating-whatsapp-mobile-bar.md) | **Approved** | Global Layout & Conversions | 2026-08-09 |
| `11-coderabbit-commit-8b6772d-resolutions` | [CodeRabbit Commit 8b6772d Review Resolutions & Technical Synchronization](11-coderabbit-commit-8b6772d-resolutions.md) | **Approved** | Quality & Technical Cleanup | 2026-08-09 |
| `12-light-theme-design-system-migration` | [High-Performance Light Theme & Design System Migration](12-light-theme-design-system-migration.md) | **Superseded** | Styling & Theme Engine | 2026-08-09 |
| `13-minimal-premium-luxury-theme` | [Minimal Premium Modern Luxury Theme Migration](13-minimal-premium-luxury-theme.md) | **Approved** | Minimal Premium Design System | 2026-08-09 |
| `14-coderabbit-commit-227be71-resolutions` | [CodeRabbit Commit 227be71 Review Resolutions & Technical Synchronization](14-coderabbit-commit-227be71-resolutions.md) | **Approved** | Quality & Technical Cleanup | 2026-08-09 |
| `15-subphase-2.1-zod-schemas-domain-type-definitions` | [Sub-Phase 2.1 — Zod Schemas & Domain Type Definitions](15-subphase-2.1-zod-schemas-domain-type-definitions.md) | **Approved** | Static Datasets & Data Layer | 2026-08-09 |
| `16-subphase-2.2-canonical-json-datasets` | [Sub-Phase 2.2 — Canonical JSON Datasets (Products, Categories & Brands)](16-subphase-2.2-canonical-json-datasets.md) | **Approved** | Static Datasets & Data Layer | 2026-08-09 |
| `17-subphase-2.3-supplementary-datasets` | [Sub-Phase 2.3 — Supplementary Datasets (Store Info & Comprehensive FAQs)](17-subphase-2.3-supplementary-datasets.md) | **Approved** | Static Datasets & Data Layer | 2026-08-10 |
| `18-subphase-2.4-catalog-data-accessor-layer` | [Sub-Phase 2.4 — Catalog Data Accessor Layer (Products, Categories & Brands)](18-subphase-2.4-catalog-data-accessor-layer.md) | **Approved** | Static Datasets & Data Layer | 2026-08-10 |
| `19-subphase-2.5-store-faq-content-accessor-layer` | [Sub-Phase 2.5 — Store, FAQ & Content Accessor Layer](19-subphase-2.5-store-faq-content-accessor-layer.md) | **Approved** | Static Datasets & Data Layer | 2026-08-10 |
| `20-subphase-3.1-product-display-components` | [Sub-Phase 3.1 — Product Display Components (Card, Grid & Badges)](20-subphase-3.1-product-display-components.md) | **Approved** | Catalog, Search & Filtering | 2026-08-10 |
| `21-subphase-3.2-in-memory-fuzzy-search-engine` | [Sub-Phase 3.2 — In-Memory Fuzzy Search Engine](21-subphase-3.2-in-memory-fuzzy-search-engine.md) | **Approved** | Catalog, Search & Filtering | 2026-08-10 |
| `22-subphase-3.3-desktop-filter-components-active-state` | [Sub-Phase 3.3 — Desktop Filter Components & Active State](22-subphase-3.3-desktop-filter-components-active-state.md) | **Approved** | Catalog, Search & Filtering | 2026-08-10 |
| `23-subphase-3.4-mobile-filter-drawer-brand-facets` | [Sub-Phase 3.4 — Mobile Filter Drawer & Brand Facets](23-subphase-3.4-mobile-filter-drawer-brand-facets.md) | **Approved** | Catalog, Search & Filtering | 2026-08-10 |
| `24-subphase-3.5-products-catalog-hub-route` | [Sub-Phase 3.5 — Products Catalog Hub Route](24-subphase-3.5-products-catalog-hub-route.md) | **Approved** | Catalog, Search & Filtering | 2026-08-10 |
| `25-subphase-3.6-category-brand-archive-routes` | [Sub-Phase 3.6 — Category & Brand Dynamic Archive Routes](25-subphase-3.6-category-brand-archive-routes.md) | **Approved** | Catalog, Search & Filtering | 2026-08-10 |
| `26-subphase-4.1-whatsapp-url-engine-analytics-tracker` | [Sub-Phase 4.1 — WhatsApp URL Engine & Analytics Tracker](26-subphase-4.1-whatsapp-url-engine-analytics-tracker.md) | **Approved** | Product Detail & WhatsApp Engine | 2026-08-10 |
| `27-subphase-4.2-product-gallery-variant-selector` | [Sub-Phase 4.2 — Product Gallery & Interactive Variant Selectors](27-subphase-4.2-product-gallery-variant-selector.md) | **Approved** | Product Detail & WhatsApp Engine | 2026-08-10 |
| `28-subphase-4.3-product-specs-nutrition-trust` | [Sub-Phase 4.3 — Product Specifications, Nutrition Facts & Trust Elements](28-subphase-4.3-product-specs-nutrition-trust.md) | **Approved** | Product Detail & WhatsApp Engine | 2026-08-10 |
| `29-subphase-4.4-product-detail-route-sticky-bar` | [Sub-Phase 4.4 — Product Detail Route & Mobile Sticky Action Bar](29-subphase-4.4-product-detail-route-sticky-bar.md) | **Approved** | Product Detail & WhatsApp Engine | 2026-08-10 |
| `30-coderabbit-commit-d8692fd-resolutions` | [CodeRabbit Commit d8692fd Review Resolutions & Technical Synchronization](30-coderabbit-commit-d8692fd-resolutions.md) | **Approved** | Quality & Technical Cleanup | 2026-08-10 |
| `31-subphase-5.1-anti-spam-rate-limiting` | [Sub-Phase 5.1 — Anti-Spam Security & Rate Limiting Infrastructure](31-subphase-5.1-anti-spam-rate-limiting.md) | **Approved** | Lead Forms & Notifications | 2026-08-10 |
| `32-subphase-5.2-notification-dispatchers` | [Sub-Phase 5.2 — Multi-Channel Notification Dispatchers](32-subphase-5.2-notification-dispatchers.md) | **Approved** | Lead Forms & Notifications | 2026-08-10 |
| `33-subphase-5.3-server-actions-pipeline` | [Sub-Phase 5.3 — Server Actions Pipeline](33-subphase-5.3-server-actions-pipeline.md) | **Approved** | Lead Forms & Notifications | 2026-08-10 |
| `34-coderabbit-commit-b4abf63-resolutions` | [CodeRabbit Commit b4abf63 Review Resolutions & Technical Synchronization](34-coderabbit-commit-b4abf63-resolutions.md) | **Approved** | Quality & Technical Cleanup | 2026-08-10 |
| `35-coderabbit-commit-27de917-resolutions` | [CodeRabbit Commit 27de917 Review Resolutions & Technical Synchronization](35-coderabbit-commit-27de917-resolutions.md) | **Approved** | Quality & Technical Cleanup | 2026-08-10 |
| `36-subphase-5.4-interactive-form-components-consultation-modal` | [Sub-Phase 5.4 — Interactive Form Components & Consultation Modal](36-subphase-5.4-interactive-form-components-consultation-modal.md) | **Approved** | Lead Forms & Notifications | 2026-08-10 |
| `37-subphase-5.5-contact-store-locations-experience` | [Sub-Phase 5.5 — Contact & Store Locations Experience](37-subphase-5.5-contact-store-locations-experience.md) | **Approved** | Lead Forms & Notifications | 2026-08-10 |
| `38-coderabbit-commit-82dc2d2-resolutions` | [CodeRabbit Commit 82dc2d2 Review Resolutions & Technical Synchronization](38-coderabbit-commit-82dc2d2-resolutions.md) | **Approved** | Quality & Technical Cleanup | 2026-08-10 |
| `39-subphase-6.1-homepage-hero-section` | [Sub-Phase 6.1 — Homepage Hero Section](39-subphase-6.1-homepage-hero-section.md) | **Approved** | Trust, Educational & Legal Pages | 2026-08-10 |
| `40-responsive-layout-overflow-fixes` | [Responsive Layout Overflow & Breakpoint Fixes](40-responsive-layout-overflow-fixes.md) | **Approved** | Global Layout, Header & Responsive Breakpoints | 2026-08-10 |
| `41-mobile-hero-background-layout` | [Dual Responsive Mobile/Desktop Hero Background & Layout](41-mobile-hero-background-layout.md) | **Approved** | Sub-Phase 6.1 — Hero Section | 2026-08-10 |













