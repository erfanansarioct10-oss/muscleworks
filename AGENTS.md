<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# MUSCLEWORKS SUPPLEMENTS — AGENT OPERATING DIRECTIVES

> **Target Project:** MUSCLEWORKS SUPPLEMENTS (`muscleworks`)  
> **Framework:** Next.js 16.3.0 App Router · React 19.2.8 · TypeScript 5 (Strict) · Tailwind CSS v4  
> **Hosting Target:** Vercel (Edge CDN + Serverless Functions)  
> **Primary Ordering Channel:** Direct WhatsApp (`wa.me`) / Phone Inquiry

---

## ⚠️ MANDATORY FIRST STEP FOR ALL AI AGENTS

**DO NOT WRITE OR MODIFY ANY CODE BEFORE READING THE SPECIFICATION FILES IN `context/`.**

The `context/` directory contains the **canonical, frozen specifications** for this entire project. Every data schema, UI component, URL route, styling token, and Server Action has an explicit contract. 

- **Do not guess or infer behavior.**
- **Do not invent data fields, store branches, or product features.**
- **Always read the relevant context file before writing code.**

---

## Context Files Map & Authority Index

Every agent **MUST** inspect the context files below according to their responsibilities:

| # | Context Document | Purpose & When to Read |
| :---: | :--- | :--- |
| **1** | [`context/progress-tracker.md`](context/progress-tracker.md) | **READ FIRST ON EVERY TURN.** Real-time project state, active sub-phase, next-up goals, and session notes. Update after completing any unit of work. |
| **2** | [`context/ai-workflow.md`](context/ai-workflow.md) | **Operating Workflow Manual.** Document authority hierarchy, discrepancy resolutions, protected invariants, and the 4-step progress synchronization protocol. |
| **3** | [`context/feature-roadmap.md`](context/feature-roadmap.md) | **Implementation Blueprint.** 8-Phase sequential milestone architecture broken down into 31 atomic, bite-sized sub-phases (0.1–7.4) with file targets and verification checklists. |
| **4** | [`context/project-overview.md`](context/project-overview.md) | **Business Context & Non-Goals.** Brand identity, single physical store at **Golfutar, Budha-Nilkantha, Kathmandu (44500)**, customer concerns, authenticity guarantees, and V1 non-goals. |
| **5** | [`context/project-tech-stacks.md`](context/project-tech-stacks.md) | **Locked Tech Stack.** Next.js 16.3.0, React 19.2.8, Tailwind CSS v4, Radix UI primitives, Lucide React, Zod, Resend, Telegram Bot API, Upstash rate limiting, and banned packages. |
| **6** | [`context/project-architecture.md`](context/project-architecture.md) | **System Architecture.** Full Static Site Generation (SSG, 0ms TTFB), Server vs. Client component boundaries, WhatsApp URL engine, Server Action pipeline, SEO schemas, and `src/proxy.ts`. |
| **7** | [`context/data-models.md`](context/data-models.md) | **Canonical Data Schemas.** Zod validation schemas, TypeScript interfaces, Nepal phone number regex (`+977-98...`), integer NPR pricing, authenticity metadata, and honeypot field (`hp_field`). |
| **8** | [`context/file-map.md`](context/file-map.md) | **Canonical Directory Layout.** File locations, module responsibilities, strict `src/` directory convention, path aliases (`@/*`, `@/data/*`, `@/content/*`), and import rules. |
| **9** | [`context/coding-standards.md`](context/coding-standards.md) | **Engineering Standards.** Mobile-first Tailwind v4 classes, CVA component variants, touch targets (≥44px, ≥48px for conversion CTAs), zero `any` policy, Next.js 16 async params, and WCAG AA accessibility. |
| **10** | [`context/feature-specs/README.md`](context/feature-specs/README.md) | **Feature Specifications Guide.** Mandatory template and approval workflow for authoring technical implementation specs for complex features before writing code. |
| **11** | [`graphify-out/graph.json`](graphify-out/graph.json) & [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md) | **Codebase Knowledge Graph & Dependency Network.** 2,000+ nodes mapping all AST code calls, imports, schema dependencies, and spec connections. Inspect before refactoring or building new modules. |

---

## Core Execution Rules for AI Agents

1. **Strict Sub-Phase Scoping:**
   - Work on **strictly ONE atomic sub-phase at a time** as defined in [`context/feature-roadmap.md`](context/feature-roadmap.md).
   - Touch only the 2–4 target files declared in that sub-phase.
2. **Mandatory 4-Step Progress Protocol:**
   - **Pre-Flight:** Read [`context/progress-tracker.md`](context/progress-tracker.md), check the codebase knowledge graph in [`graphify-out/`](graphify-out/) (or run `/graphify query` / `/graphify path`) to verify existing callers, types, and helpers to prevent duplicate utilities, mark active sub-phase as `[IN PROGRESS]`, and announce targets to user.
   - **Scoped Implementation:** Implement files adhering to [`context/file-map.md`](context/file-map.md) and [`context/coding-standards.md`](context/coding-standards.md).
   - **Verification Gate:** Run `npx tsc --noEmit`, verify mobile touch targets (≥44px/48px), and fix any lints.
   - **Post-Flight Hand-off:** Run `graphify --update` (or `/graphify --update`) if code or specs were added/modified to keep the knowledge graph synchronized, mark `[x]` in [`context/progress-tracker.md`](context/progress-tracker.md) and [`context/feature-roadmap.md`](context/feature-roadmap.md), log notes, promote next sub-phase to `[NEXT UP]`, and stop.
3. **Knowledge Graph First (Automatic GraphRAG Invariant):**
   - Whenever an agent needs to understand the architecture, trace data flow, find callers of a component, or verify how a module connects across boundaries, it **MUST** consult [`graphify-out/graph.json`](graphify-out/graph.json), [`graphify-out/GRAPH_REPORT.md`](graphify-out/GRAPH_REPORT.md), or run `/graphify query "<feature>"` / `/graphify path "A" "B"`.
   - Never guess whether a utility, Zod schema, or component exists — check the graph first.
4. **Next.js 16 Breaking Invariants:**
   - In all pages and layouts, `params` and `searchParams` are Promises: **must `await params`**.
   - Network proxying and headers use `src/proxy.ts` (not `middleware.ts`).
   - Server Components by default; push `'use client'` strictly to interactive leaf components.
5. **Design & Mobile-First Standards:**
   - All styling must be mobile-first (base classes `<640px` with progressive `sm:`, `md:`, `lg:` enhancements).
   - Minimum touch target for standard buttons/links is **44x44px**; conversion CTAs (WhatsApp/Call) must be **≥48x48px**.
   - Minimal premium modern luxury theme tokens defined with Tailwind v4 `@theme` in `src/app/globals.css`.
6. **Security & Secrets:**
   - Never prefix server secrets (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `UPSTASH_*`) with `NEXT_PUBLIC_`.
   - All public forms must enforce the `hp_field` honeypot and 2000ms timing trap in Server Actions.

