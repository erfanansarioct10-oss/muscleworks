# Feature Spec 01: CodeRabbit Review Comments Resolution & Context Synchronization

> **Spec ID:** `01-coderabbit-review-resolutions`  
> **Target Sub-Phase / Branch:** `Phase 0` Context Refinement / `initial`  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** AI Coding Agent (Antigravity IDE)

---

## Executive Summary

Following the initial repository commit `72e3a6d`, CodeRabbit automated review identified 15 actionable improvements and consistency reconciliations across the project documentation and configuration files:
- Repository-relative link formatting in `AGENTS.md`
- Unification of the `ActionResult<T>` Server Action return envelope across all context files
- Correct code fence labeling (`text`) for all ASCII architecture and hierarchy diagrams
- Alignment of `ProductSchema` examples and import paths in `context/coding-standards.md`
- Opt-in validation logic for authenticity metadata and price discount refinement in `context/data-models.md`
- Reconciling `context/feature-roadmap.md` with canonical single-location constraints (Golfutar only), 2–4 file sub-phase limits, canonical validation directories (`src/lib/validations/`), and URL routes
- Typed data accessor `src/lib/data/faqs.ts` integration in `context/file-map.md`
- Accurate document counting in `context/progress-tracker.md`
- Dynamic site URL references and Markdown table escaping in `context/project-architecture.md`
- Production fail-closed rate-limiting policy in `context/project-tech-stacks.md`
- Synchronizing root package name in `package-lock.json` to `muscleworks`

This specification details the exact line-by-line remediation for each affected document to establish 100% frozen canonical consistency before code execution starts.

---

## 1. What We Are Going to Do

The following table itemizes all files to be updated and their specific remediation targets:

| # | Target File | Action | Summary of Remediation |
|:---:|---|:---:|---|
| 1 | `AGENTS.md` | **[MODIFY]** | Replace workstation-specific `file:///c:/...` URLs with repository-relative Markdown links (`context/progress-tracker.md`, etc.). |
| 2 | `context/ai-workflow.md` | **[MODIFY]** | Unify `ActionResult<T>` type definition & export path (`src/types/actions.ts`), add `text` tag to ASCII diagram at line 132. |
| 3 | `context/data-models.md` | **[MODIFY]** | Make `AuthenticityMetadataSchema` claims opt-in, add discount price refinement to `ProductVariantSchema`, and standardize `ActionResultSchema` / `ActionResult<T>`. |
| 4 | `context/project-architecture.md` | **[MODIFY]** | Label ASCII fences with `text`, replace hardcoded domain in WhatsApp template with `{siteUrl}`, reference canonical `ActionResult`, and escape `\|` in schema table. |
| 5 | `context/coding-standards.md` | **[MODIFY]** | Label ASCII fences as `text`, fix `ProductSchema` example & paths to `src/lib/validations/`, fix `globals.css` path to `src/app/globals.css`, align Server Action envelope, and update 404 links to `/products`. |
| 6 | `context/feature-roadmap.md` | **[MODIFY]** | Remove unapproved second store & phone claims, use single Golfutar location, update `src/lib/validations/` paths, split 5-file sub-phases into compliant 2–4 file sub-phases, align canonical route names. |
| 7 | `context/file-map.md` | **[MODIFY]** | Label ASCII tree fence as `text`, update `/faq` route data flow to consume typed accessor `src/lib/data/faqs.ts`. |
| 8 | `context/progress-tracker.md` | **[MODIFY]** | Update context file count from 9 to 10 completed documents, record this spec. |
| 9 | `context/project-tech-stacks.md` | **[MODIFY]** | Update rate limiting specification to restrict in-memory fallback strictly to `NODE_ENV === 'development'` and fail-closed in production. |
| 10 | `package-lock.json` | **[MODIFY]** | Synchronize root package metadata `"name": "muscleworks"`. |
| 11 | `context/feature-specs/README.md` | **[MODIFY]** | Register `01-coderabbit-review-resolutions.md` in Specification Registry Index. |

---

## 2. Why We Are Doing This

1. **Zero Discrepancy Invariant:** Our agent operating directives mandate that `context/` serves as the frozen source of truth. Conflicting definitions (such as different `ActionResult` shapes or mismatched validation paths) create agent hallucination risks during implementation.
2. **Strict Single Store Constraint:** MUSCLEWORKS operates a single physical retail store in **Golfutar, Budha-Nilkantha, Kathmandu (44500)**. Any roadmap references to multi-branch operations ("New Baneshwor & Jhamsikhel") contradict business reality.
3. **Data Integrity & Validation Correctness:** `discountPriceNpr` must logically be strictly less than `priceNpr`, and authenticity guarantees must be explicit and opt-in rather than silently defaulted.
4. **Tooling & Build Cleanliness:** Lockfile consistency and Markdown linting standards prevent CI/CD drift and broken link alerts across workstations.

---

## 3. How We Are Going to Implement It

### Step 1: Agent Directives & Link Targets (`AGENTS.md`)
- Update reference table links:
  - `[context/progress-tracker.md](context/progress-tracker.md)`
  - `[context/ai-workflow.md](context/ai-workflow.md)`
  - `[context/feature-roadmap.md](context/feature-roadmap.md)`
  - `[context/project-overview.md](context/project-overview.md)`
  - `[context/project-tech-stacks.md](context/project-tech-stacks.md)`
  - `[context/project-architecture.md](context/project-architecture.md)`
  - `[context/data-models.md](context/data-models.md)`
  - `[context/file-map.md](context/file-map.md)`
  - `[context/coding-standards.md](context/coding-standards.md)`
  - `[context/feature-specs/README.md](context/feature-specs/README.md)`

### Step 2: Server Action Envelope & Core Architecture Alignment
- **`context/ai-workflow.md`**: Specify canonical type location `src/types/actions.ts` (re-exported in `src/types/index.ts`):
  ```typescript
  export interface ActionResult<T = unknown> {
    success: boolean;
    message?: string;
    error?: string;
    fieldErrors?: Record<string, string[]>;
    data?: T;
  }
  ```
- **`context/project-architecture.md`**:
  - Update WhatsApp message template link line to: `🔗 Link: {siteUrl}/products/{slug}`
  - Escape pipe in Schema table: `availability: InStock \| OutOfStock`
  - Tag ASCII diagrams with `text` at lines 97 and 283.
- **`context/project-tech-stacks.md`**:
  - Update rate limiting section: "IP-based sliding window rate limiter (max 5 inquiries per 60 minutes per IP). In local development (`NODE_ENV === 'development'`), falls back to an in-memory cache if Upstash credentials are not provided. In production, requires valid Upstash credentials and fails closed."

### Step 3: Data Model Refinements (`context/data-models.md`)
- **`AuthenticityMetadataSchema`**:
  ```typescript
  export const AuthenticityMetadataSchema = z.object({
    isAuthenticGuarantee: z.boolean(),
    importerOrSource: z.string().min(2).optional(),
    verificationMethod: z.string().min(5).optional(),
    hologramDescription: z.string().optional(),
    batchTestingNote: z.string().optional(),
  });
  ```
- **`ProductVariantSchema`**:
  ```typescript
  export const ProductVariantSchema = z
    .object({
      id: z.string().min(1),
      sku: z.string().regex(/^[A-Z0-9_-]{3,30}$/, 'Invalid SKU format'),
      sizeOrWeight: z.string().min(1),
      flavor: z.string().default('Unflavored'),
      priceNpr: z.number().int().positive('Price must be a positive integer in NPR'),
      discountPriceNpr: z.number().int().positive().optional(),
      stockStatus: StockStatusEnum.default('in_stock'),
      image: ImageAssetSchema.optional(),
    })
    .refine(
      (data) => !data.discountPriceNpr || data.discountPriceNpr < data.priceNpr,
      {
        message: 'discountPriceNpr must be strictly less than priceNpr',
        path: ['discountPriceNpr'],
      }
    );
  ```
- **`ActionResultSchema` & `ActionResult<T>`**: Replace `ActionResponseSchema` with canonical `ActionResultSchema`.

### Step 4: Coding Standards Corrections (`context/coding-standards.md`)
- Update `ProductSchema` example in Section 3.3 to import from `@/lib/validations/product` and mirror the canonical schema fields.
- Update global CSS reference in Section 5.1 to `src/app/globals.css`.
- Update Section 6 Server Actions to import from `@/lib/validations/inquiry` and `@/types/actions`.
- Update Section 6.4 404 page description to reference `/products`, `/categories`, and `/`.
- Tag ASCII diagrams with `text` at lines 15, 263, and 473.

### Step 5: Roadmap & File Map Reconciliations
- **`context/file-map.md`**:
  - Add `text` tag at line 30.
  - Update `src/app/(marketing)/faq/page.tsx` data accessor column to `getFAQs()` from `src/lib/data/faqs.ts`.
- **`context/feature-roadmap.md`**:
  - Remove mock phone numbers/unapproved claims in Sub-Phase 0.3.
  - Replace "New Baneshwor & Jhamsikhel" with single **Golfutar** store in Sub-Phases 1.5, 2.3, 5.5, 6.1, 6.2.
  - Rename validation target paths from `src/lib/validators/` to `src/lib/validations/`.
  - Split 5-file sub-phases into 2–4 file sub-phases:
    - Split Sub-Phase 3.3 (Filters) into Sub-Phase 3.3 (Desktop Filter Components: `catalog-filters.tsx`, `active-filters.tsx`, `category-chips.tsx`) and Sub-Phase 3.4 (Mobile Drawer & Brand Filter: `mobile-filter-drawer.tsx`, `brand-filter.tsx`).
    - Split Archive Hubs into Sub-Phase 3.5 (Products Catalog Page: `src/app/products/page.tsx`) and Sub-Phase 3.6 (Category & Brand Dynamic Hubs: `src/app/categories/page.tsx`, `src/app/categories/[slug]/page.tsx`, `src/app/brands/page.tsx`, `src/app/brands/[slug]/page.tsx`).
    - Adjust sequential numbering of subsequent sub-phases accordingly.
  - Use canonical route paths: `/contact`, `/location`, `/privacy-policy`, `/terms`, `/delivery-policy`, `/faq`.

### Step 6: Progress Tracker & Lockfile Updates
- **`context/progress-tracker.md`**: Update completed document count from 9 to 10 context docs.
- **`package-lock.json`**: Update `"name": "my-app"` on lines 2 and 8 to `"name": "muscleworks"`.
- **`context/feature-specs/README.md`**: Register Spec 01 in the index table.

---

## 4. When We Are Going to Do It

```text
Step 1: Core Governance & Action Result Types (AGENTS.md, ai-workflow.md, data-models.md)
    │
    ▼
Step 2: Architecture & Coding Standards (project-architecture.md, coding-standards.md, project-tech-stacks.md)
    │
    ▼
Step 3: Roadmap & File Map Reconciliations (file-map.md, feature-roadmap.md)
    │
    ▼
Step 4: Meta & Package Lockfile Synchronization (progress-tracker.md, package-lock.json, feature-specs/README.md)
    │
    ▼
Step 5: Full Consistency Verification
```

---

## 5. Required Data & Data Sources

| Configuration / Data Item | Canonical Source | Applied Location |
|---|---|---|
| Single Store Address | `context/project-overview.md` | Golfutar, Budha-Nilkantha, Kathmandu (44500) |
| Server Action Envelope | `src/types/actions.ts` | `ActionResult<T = unknown>` |
| Site URL Env Variable | `process.env.NEXT_PUBLIC_SITE_URL` | Dynamic WhatsApp URL generator |
| Validation Folder Alias | `src/lib/validations/` | Zod schema modules |
| App Router Global Styles | `src/app/globals.css` | Tailwind CSS v4 `@theme` definitions |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Sub-Phase Number Drift** | Splitting sub-phases changes IDs in roadmap. | Update all references in `feature-roadmap.md` and keep numbering strict and sequential. |
| **Lockfile Invalidation** | Manual edit to `package-lock.json` name field. | Only edit the top-level `"name"` keys (lines 2 & 8) without touching resolved package hashes. |
| **Broken Markdown Links** | Relative paths formatted incorrectly. | Test and verify relative paths against workspace root directory. |

---

## 7. Verification & Definition of Done

1. All 15 CodeRabbit review comments verified and addressed across the specified files.
2. All ASCII and tree fences in markdown files labeled with `text`.
3. Zero references to outdated "New Baneshwor" / "Jhamsikhel" in roadmap or specs.
4. Validation schemas and paths consistently use `src/lib/validations/`.
5. `package.json` and `package-lock.json` both reflect `"name": "muscleworks"`.
6. Progress tracker and feature spec README index updated and synchronized.
