# Dispatch Assignment: Domain 4 (R4) — Next.js 16 App Router, TypeScript Strict & WCAG AA Standards

## Target Scope
Inspect the MUSCLEWORKS Next.js 16 codebase at `c:\nooridigital_assets\my-projects\muscleworks` for:
1. **Next.js 16 App Router Breaking Changes & Invariants**:
   - Check all pages, layouts, route handlers, error boundaries: are `params` and `searchParams` properly typed as Promises and `await`ed? (`await params`, `await searchParams`).
   - Check routing proxying: does the project use `src/proxy.ts` according to Next.js 16 conventions instead of legacy `middleware.ts`?
   - Check Client vs Server component boundaries: are `'use client'` directives placed strictly on interactive leaf components? Are heavy server-only utilities or node modules leaking into client bundles?
   - Check image optimization: `next/image` usage, `sizes`, `priority` on LCP elements, width/height aspect ratios.
2. **TypeScript Strict Compliance**:
   - Zero `any` policy: check for explicit or implicit `any`, unsafe type assertions (`as any`, `as unknown as ...`), unhandled null/undefined values.
   - Check type definitions vs canonical Zod schemas in `context/data-models.md`.
3. **Accessibility (WCAG 2.1 AA) & Mobile UI Standards**:
   - Touch targets: standard interactive elements >= 44x44px; primary conversion CTAs (WhatsApp, Call, Submit) >= 48x48px.
   - ARIA attributes: `aria-expanded`, `aria-label` on icon-only buttons, modal dialog labeling (`aria-modal`, `aria-labelledby`, focus trapping).
   - Color contrast ratios (text vs background >= 4.5:1 for normal text, 3:1 for large text / graphical UI components).
   - Keyboard navigability: visible focus rings (`focus-visible:ring-...`), logical tab order, skip links if applicable.
   - Semantic HTML: proper heading hierarchies (`<h1>` -> `<h2>` -> `<h3>`), `<main>`, `<nav>`, `<header>`, `<footer>`, form field labeling with `<label htmlFor="...">`.

## Output Requirements
Write your detailed findings to `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_r4\analysis.md` and complete with `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_r4\handoff.md`.
For every finding:
- File path (relative and absolute)
- Exact line numbers
- Severity (Critical, Major, Minor, Optimization)
- Issue summary & Root cause
- Concrete impact analysis
- Copy-paste ready fix diff
