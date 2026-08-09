# Progress Tracker

Update this file after every meaningful implementation change.

## Current Phase

- Phase 0: Project Setup, Tooling & Package Infrastructure

## Current Goal

- Execute Sub-Phase 0.1: Project Scaffold & Dependency Manifest (`package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`).

## In Progress

- Next up: Sub-Phase 0.1 (Project Scaffold & Dependency Manifest)

## Context Files Status

- [x] `context/project-overview.md` — Completed
- [x] `context/project-tech-stacks.md` — Completed
- [x] `context/progress-tracker.md` — Completed
- [x] `context/project-architecture.md` — Completed
- [x] `context/data-models.md` — Completed
- [x] `context/file-map.md` — Completed
- [x] `context/coding-standards.md` — Completed
- [x] `context/feature-roadmap.md` — Completed
- [x] `context/ai-workflow.md` — Completed
- [x] `context/feature-specs/README.md` — Completed

## Next Up

- **Sub-Phase 0.1:** Verify & lock Next.js 16.3.0, React 19.2.8, TypeScript 5, Tailwind CSS v4, Lucide React, Radix UI primitives, Zod, and Resend dependencies in `package.json`, configure strict path aliases (`@/*`, `@/data/*`, `@/content/*`) in `tsconfig.json`, configure image domains and compilation settings in `next.config.ts`.

## Architecture & Tech Decisions

- **Framework:** Next.js 16.3.0 App Router + React 19.2.8 + TypeScript 5 (Strict mode).
- **Directory Convention:** `src/` directory root with standardized `@/*`, `@/data/*`, and `@/content/*` path aliases.
- **Mobile-First Responsive Standard:** Base classes target mobile (<640px) with progressive enhancement (`sm:`, `md:`, `lg:`, `xl:`), min touch targets (≥44x44px, ≥48x48px for conversion CTAs), slide-over sheet navigation, and sticky bottom action bar on mobile viewports (<md).
- **Styling & Design:** Tailwind CSS v4 `@theme` design tokens (athletic obsidian/crimson/gold/emerald palette), PostCSS, Radix UI headless primitives (Shadcn-style), Lucide React icons, `cn()` utility (`clsx` + `tailwind-merge`), CVA component variants, Sonner toasts.
- **Rendering & Caching:** Full build-time Static Site Generation (SSG) with `generateStaticParams` for 0ms TTFB across catalog, brand, category, and guide pages; client interactivity isolated strictly to leaf `'use client'` components.
- **Data & Content Layer (V1):** Local JSON datasets in `data/` with Zod schema validation + typed accessors in `src/lib/data/` + Markdown/MDX for educational guides (zero database latency/cost, Git-versioned).
- **Search & Catalog State:** URL query sync (`nuqs` / Next.js navigation) + Fuse.js in-memory client fuzzy search.
- **Forms & Anti-Spam:** React Hook Form + Zod + Server Actions with Honeypot anti-bot trap field + `@upstash/ratelimit` rate limiting.
- **Notifications & Conversions:**
  - Context-aware WhatsApp direct ordering via dynamic reactive URL builder with variant/flavor metadata and GA4 event tracking.
  - Resend SDK + React Email for transactional customer confirmations & admin email alerts.
  - Native `fetch` Telegram Bot API for real-time instant admin push alerts.
- **SEO & Structured Data:** Next.js native `generateMetadata`, dynamic `app/sitemap.ts`, `app/robots.ts`, `schema-dts` JSON-LD structured data (Product, LocalBusiness, FAQ, Breadcrumbs, Article).
- **Security & Boundaries:** Hardened HTTP security headers (CSP, HSTS, X-Frame-Options) via Next.js 16 `proxy.ts` and `next.config.ts`, zero credential exposure, strict Server Action sanitization boundary, and compile-time data validation.
- **Performance Budgets (Mobile 4G):** LCP < 2.0s, INP < 150ms, CLS < 0.05, TTFB < 100ms, initial client JS < 90kB.

## Session Notes

- All 9 canonical context specification documents in `context/` are 100% complete and fully synchronized.
- [feature-roadmap.md](file:///c:/nooridigital_assets/my-projects/muscleworks/context/feature-roadmap.md) establishes an 8-Phase sequential milestone architecture broken down into 31 atomic, bite-sized sub-phases (Sub-Phases 0.1 through 7.4).
- [ai-workflow.md](file:///c:/nooridigital_assets/my-projects/muscleworks/context/ai-workflow.md) establishes the canonical document hierarchy, resolution for minor naming discrepancies across docs, protected invariants, and the 4-step synchronization protocol.
- Strict 4-step progress synchronization protocol is mandated for all coding agents:
  1. Pre-Flight Check: Read trackers, verify prerequisites, mark active sub-phase as `[IN PROGRESS]`
  2. Scoped Execution: Implement ONLY files listed in that sub-phase
  3. Verification: Run TypeScript check & sub-phase tests
  4. Post-Flight Hand-off: Mark `[x]` in both `progress-tracker.md` & `feature-roadmap.md`, document notes, and set next sub-phase to `[NEXT UP]`.
- Implementation is ready to proceed starting with **Sub-Phase 0.1: Project Scaffold & Dependency Manifest**.

## Completed

- Completed `context/project-overview.md`
- Completed `context/project-tech-stacks.md`
- Completed `context/progress-tracker.md`
- Completed `context/project-architecture.md`
- Completed `context/data-models.md`
- Completed `context/file-map.md`
- Completed `context/coding-standards.md`
- Completed `context/feature-roadmap.md`
- Completed `context/ai-workflow.md`
- Completed `context/feature-specs/README.md`