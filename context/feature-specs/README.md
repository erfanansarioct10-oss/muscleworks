# Implementation & Feature Specifications Guide

> **Location:** `context/feature-specs/`  
> **Target Project:** MUSCLEWORKS SUPPLEMENTS (`muscleworks`)  
> **Framework:** Next.js 16.3.0 App Router · React 19.2.8 · TypeScript 5 (Strict) · Tailwind CSS v4

This directory contains structured, detailed technical specification documents for complex features, architectural refactoring, bug fixes, sub-phase deep-dives, and code review resolutions across the MUSCLEWORKS SUPPLEMENTS platform.

Every AI coding agent **MUST** follow the guidelines and specification template documented below whenever instructed to write a feature or implementation spec.

---

## 1. Purpose of Feature Specifications

Feature specifications serve as technical design blueprints before code execution. They ensure that:

- Every proposed change strictly adheres to project architecture ([`context/project-architecture.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/project-architecture.md)), data models ([`context/data-models.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/data-models.md)), coding standards ([`context/coding-standards.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/coding-standards.md)), file layout ([`context/file-map.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/file-map.md)), and operating workflow ([`context/ai-workflow.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/ai-workflow.md)).
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
| *No feature specs authored yet. New specs will be registered here sequentially.* | | | | |
