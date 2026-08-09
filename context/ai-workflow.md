# AI Workflow Rules & Context Operating Manual

> **Target Project:** MUSCLEWORKS SUPPLEMENTS (`muscleworks`)  
> **Framework:** Next.js 16.3.0 App Router · React 19.2.8 · TypeScript 5 (Strict) · Tailwind CSS v4  
> **Primary Purpose:** Canonical operating workflow for all AI coding agents working in this codebase.

---

## 1. Approach & Development Philosophy

Build this project incrementally using a **spec-driven, phase-by-phase workflow**.

- The `context/` folder files are the **canonical specifications** that define what to build, how to build it, where files belong, and the current progress state.
- **Never infer or invent behavior from scratch.** Every data schema, UI component, URL route, styling token, and Server Action has an explicit contract defined in the context files.
- All implementation changes must proceed strictly through the atomic sub-phases defined in [feature-roadmap.md](file:///c:/nooridigital_assets/my-projects/muscleworks/context/feature-roadmap.md) and tracked in [progress-tracker.md](file:///c:/nooridigital_assets/my-projects/muscleworks/context/progress-tracker.md).

---

## 2. Context Files Hierarchy & Authority Matrix

Before starting any task, agents must know which context file to consult. If any inconsistency is encountered, the document hierarchy below dictates the single source of truth:

| Priority | Context Document | Core Purpose & Scope | When to Read | Authority Level |
| :---: | :--- | :--- | :--- | :--- |
| **1** | [`project-overview.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/project-overview.md) | Business identity, Golfutar location, target market, trust rules, WhatsApp conversion goals, V1 non-goals. | Start of project, clarifying business rules or catalog boundaries. | **Highest** on business identity, store location, and non-goals. |
| **2** | [`data-models.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/data-models.md) | Canonical Zod schemas, TypeScript types, Nepal phone regex, pricing (NPR), authenticity metadata, honeypot fields. | Writing schemas, types, validation logic, or JSON datasets. | **Highest** on data structures, schemas, field names, and regex. |
| **3** | [`file-map.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/file-map.md) | Full directory layout, file paths, import rules, component boundaries (`src/` root, `src/lib/validations/`, `src/types/`). | Creating new files, imports, or verifying component responsibilities. | **Highest** on file locations, module paths, and routing structure. |
| **4** | [`project-architecture.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/project-architecture.md) | System architecture, SSG rendering, Server vs. Client boundaries, WhatsApp URL engine, Server Action pipeline, SEO schemas, `proxy.ts`. | Designing page rendering, Server Actions, SEO, or security boundaries. | **Highest** on architectural patterns and security flows. |
| **5** | [`coding-standards.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/coding-standards.md) | Mobile-first CSS, Tailwind v4 tokens, CVA variants, touch targets (≥44px/48px), zero `any`, Next.js 16 async params, a11y, Core Web Vitals. | Writing or refactoring any code, component, action, or CSS. | **Highest** on code quality, styling rules, and TypeScript patterns. |
| **6** | [`project-tech-stacks.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/project-tech-stacks.md) | Approved runtime packages, exact versions, allowed dependencies, environment variable declarations. | Modifying `package.json`, installing libraries, or configuring environment variables. | **Highest** on package versions and dependency restrictions. |
| **7** | [`feature-roadmap.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/feature-roadmap.md) | 8-Phase sequential milestone blueprint broken into 31 atomic sub-phases (0.1–7.4) with file targets and verification gates. | Planning next implementation turn and checking off sub-phases. | **Highest** on implementation sequencing and verification criteria. |
| **8** | [`progress-tracker.md`](file:///c:/nooridigital_assets/my-projects/muscleworks/context/progress-tracker.md) | Real-time task completion, active sub-phase indicator, next-up pointer, session notes, and architectural decisions. | **Must read first** on every agent turn, and update upon completing a sub-phase. | **Active state tracker** for the entire project. |

---

## 3. Canonical Discrepancy Resolutions

To eliminate agent confusion from minor naming variations across documents, adhere to these canonical resolutions:

1. **Schema & Type Directory Paths:**
   - **Canonical Path:** `src/lib/validations/` for Zod schemas (`product.ts`, `taxonomy.ts`, `inquiry.ts`, `store.ts`, `guide.ts`, `common.ts`).
   - **Canonical Path:** `src/types/` for TypeScript types inferred via `z.infer` (`index.ts`, `product.ts`, `taxonomy.ts`, `inquiry.ts`, `store.ts`, `guide.ts`, `common.ts`).
   - **Canonical Path:** `src/lib/data/` for typed data accessors (`products.ts`, `categories.ts`, `brands.ts`, `store.ts`, `guides.ts`).
   - *Do not create `src/lib/validators/` or `src/lib/schemas/`.*

2. **Store Location & Business Address:**
   - **Single Canonical Location:** Golfutar, Budha-Nilkantha, Kathmandu, Nepal (Postal Code: 44500).
   - **Store Hours:** Sunday–Friday: 10:00 AM – 9:00 PM. Saturday hours are not yet specified (do not fabricate Saturday hours).
   - *Ignore mentions of "New Baneshwor & Jhamsikhel" in roadmap descriptions; the real store is in Golfutar.*

3. **Server Action Result Envelope:**
   - **Canonical Type:** Use `ActionResult<T = unknown>` exported from `src/types/actions.ts` (re-exported via `src/types/index.ts`):
     ```typescript
     export interface ActionResult<T = unknown> {
       success: boolean;
       message?: string;
       error?: string;
       fieldErrors?: Record<string, string[]>;
       data?: T;
     }
     ```

4. **Directory Root Standard (`src/`):**
   - All application code resides in `src/` (`src/app/`, `src/components/`, `src/lib/`, `src/types/`, `src/actions/`, `src/emails/`, `src/proxy.ts`).
   - `tsconfig.json` path alias `@/*` must point to `./src/*`.
   - Data files reside in `./data/` (`@/data/*`), MDX guides in `./content/` (`@/content/*`), and static assets in `./public/` (`@/public/*`).

5. **Anti-Spam Honeypot Field:**
   - **Canonical Field Name:** `hp_field` (hidden string, max length 0).
   - **Submission Time Trap:** `_form_loaded_at` (minimum duration 2000ms).

6. **URL Route Naming Standards:**
   - `/products` & `/products/[slug]`
   - `/categories` & `/categories/[slug]`
   - `/brands` & `/brands/[slug]`
   - `/guides` & `/guides/[slug]`
   - `/about`, `/contact`, `/location`, `/faq`, `/privacy-policy`, `/terms`, `/delivery-policy`

---

## 4. Scoping & Execution Rules

- **Work on strictly ONE atomic sub-phase at a time** (e.g. Sub-Phase 0.1, then Sub-Phase 0.2).
- **Limit edits to the 2–4 target files** declared in that sub-phase.
- **Prefer small, verifiable increments** over large speculative changes.
- **Do not combine unrelated boundaries** in a single turn (e.g. do not mix UI primitives with data loading or Server Actions).
- **Never implement ahead of the active phase** (e.g. do not build product page components before Phase 2 data models and Phase 1 UI primitives are complete).

---

## 5. When to Split Work

Split an implementation step into smaller atomic actions if it combines:
- UI component changes + Server Action / API logic.
- Multiple unrelated route pages.
- Database/JSON schema changes + UI rendering.
- Any change that cannot be verified end-to-end with `npx tsc --noEmit` and visual testing quickly.

If a sub-phase feels too broad, complete the core primitives first, verify them, and document the remaining pieces.

---

## 6. Handling Missing Requirements & Ambiguity

- **Do not invent product features, pricing formulas, or medical/health claims** not defined in the context files.
- If a requirement is ambiguous, check `data-models.md` and `project-overview.md` first.
- If a requirement is truly missing or unspecified (e.g., Saturday hours, custom delivery fees outside valley), record it as an open question in `progress-tracker.md` under `## Session Notes` and implement the safe default / fallback.

---

## 7. Protected Files & Architectural Invariants

Do not modify or violate the following unless explicitly instructed:

1. **`AGENTS.md`:** Contains Next.js 16 breaking change rules. Must never be deleted or altered.
2. **Next.js 16 Async Params:** In `page.tsx` and `layout.tsx`, `params` and `searchParams` are Promises and must always be `await`ed:
   ```typescript
   export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params;
   }
   ```
3. **Tailwind CSS v4 `@theme` Architecture:** All tokens live in `src/app/globals.css` using `@theme`. Do not create a legacy `tailwind.config.js` or `tailwind.config.ts`.
4. **Server Component Default:** All layouts and pages are Server Components. Push `'use client'` strictly to interactive leaf nodes (search input, variant picker, drawer toggle, inquiry form, toast provider).
5. **No Secret Leaks:** Private keys (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `UPSTASH_*`) must **never** have the `NEXT_PUBLIC_` prefix and must never be imported into client components.

---

## 8. Mandatory 4-Step Progress Synchronization Protocol

Every AI agent turn must follow this exact execution cycle:

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. PRE-FLIGHT CHECK                                         │
│    • Read progress-tracker.md & feature-roadmap.md          │
│    • Identify active sub-phase & mark [IN PROGRESS]         │
│    • Announce sub-phase ID & target files to user           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. SCOPED IMPLEMENTATION                                    │
│    • Implement ONLY the files declared in the sub-phase     │
│    • Adhere strictly to file-map.md & coding-standards.md   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. VERIFICATION GATE                                        │
│    • Run npx tsc --noEmit (zero errors mandatory)           │
│    • Verify responsive touch targets (>=44px, >=48px CTAs)  │
│    • Verify component exports and imports                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. POST-FLIGHT HAND-OFF                                     │
│    • Mark [x] in progress-tracker.md & feature-roadmap.md   │
│    • Update Session Notes with key decisions                │
│    • Promote next sub-phase to [NEXT UP]                    │
│    • Summarize completed work and stop                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Keeping Docs in Sync

Update the relevant context file whenever implementation reveals new details or requires adjustments:
- **`progress-tracker.md`**: Updated on **every** turn (Current Goal, In Progress, Session Notes, Completed).
- **`feature-roadmap.md`**: Checked off `[x]` as sub-phases finish.
- **`data-models.md`**: Updated if a new field, variant property, or validation regex is added.
- **`file-map.md`**: Updated if a new component or utility file is introduced.

---

## 10. Sub-Phase Completion Gate (Definition of Done)

Before declaring any sub-phase complete and moving to the next:

1. [ ] **TypeScript Check:** `npx tsc --noEmit` runs with 0 errors.
2. [ ] **Scope Check:** Only files assigned to this sub-phase were modified.
3. [ ] **Coding Standards Check:** No `any` types, mobile-first CSS, proper touch targets (≥44px/48px), proper Server/Client boundaries.
4. [ ] **Progress Synchronized:** Both `progress-tracker.md` and `feature-roadmap.md` reflect the completed sub-phase.
5. [ ] **Build Validation (Major Phase Gates):** `npm run build` succeeds with static generation for all declared routes.
