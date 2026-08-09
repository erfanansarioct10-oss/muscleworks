# Feature Spec 05: Sub-Phase 0.4 — Root Layout Shell, Font Engine & Global Metadata

> **Spec ID:** `05-subphase-0.4-root-layout-font-engine-metadata`  
> **Target Sub-Phase / Branch:** `Phase 0 — Sub-Phase 0.4`  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification governs the implementation of **Sub-Phase 0.4: Next.js 16 App Root Layout Shell, Google Font Engine & Global Metadata** for MuscleWorks Supplements. It establishes the global HTML shell, preloaded variable Google Fonts (`Outfit` for display headings and `Plus Jakarta Sans` for body typography), full SEO metadata configuration with OpenGraph defaults targeting Nepal's sports nutrition market, an athletic dark-mode 404 Not Found recovery page with category jump links, and resilient error boundaries (`error.tsx` and `global-error.tsx`) with instant recovery mechanisms.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/app/layout.tsx` | **[MODIFY]** | Configure Google Fonts (`Outfit` + `Plus_Jakarta_Sans`), root SEO metadata with OpenGraph and Twitter cards, canonical `metadataBase`, viewport dark theme tokens, accessible skip-to-content link, and global dark `<Toaster />` container. |
| 2 | `src/app/not-found.tsx` | **[NEW]** | Dark athletic 404 Not Found recovery page with brand graphic, direct catalog CTA, instant WhatsApp inquiry trigger, home shortcut, and quick-jump category navigation pills. |
| 3 | `src/app/error.tsx` | **[NEW]** | Client Component error boundary catching unhandled runtime exceptions with `reset()` trigger, automated dev-mode logging, and pre-formatted direct WhatsApp issue reporting. |
| 4 | `src/app/global-error.tsx` | **[NEW]** | Root layout error fallback component rendering an isolated `<html>` and `<body>` shell with recovery action. |

---

## 2. Why We Are Doing This

1. **Zero Layout Shift (CLS < 0.05):** Loading `Outfit` and `Plus_Jakarta_Sans` via `next/font/google` with `display: 'swap'` and CSS variable injection (`--font-heading`, `--font-sans`) eliminates Flash of Unstyled Text (FOUT) and font-driven layout shifts.
2. **SEO & Search Dominance in Nepal:** Comprehensive root metadata with title templates (`%s | MuscleWorks Supplements Nepal`), geographic localization (`en_US`/`en_NP`), descriptive sports nutrition keywords, and OpenGraph defaults ensures rich link previews and high search engine ranking for Kathmandu whey/creatine searches.
3. **High-Conversion 404 Recovery:** Rather than a dead-end default 404 screen, an athletic supplement-themed 404 page provides high-priority conversion CTAs and category shortcuts, reclaiming lost mobile shoppers back into the catalog funnel.
4. **Resilient UX & Fast Recovery:** `error.tsx` and `global-error.tsx` gracefully capture unexpected rendering exceptions, allowing users to re-attempt execution or report issues directly to the Golfutar team via WhatsApp.
5. **Accessibility & WCAG AA Compliance:** Implements an accessible skip-to-content anchor (`#main-content`) and high-contrast dark athletic UI with minimum touch targets (≥48px on conversion buttons).

---

## 3. How We Are Going to Implement It

### Step 1: `src/app/layout.tsx`
- **Font Optimization:**
  ```typescript
  import { Outfit, Plus_Jakarta_Sans } from "next/font/google";

  const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
    weight: ["600", "700", "800", "900"],
  });

  const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
    weight: ["400", "500", "600", "700"],
  });
  ```
- **Metadata Configuration:**
  - `metadataBase: new URL(SITE_URL)`
  - `title: { default: "MuscleWorks Supplements | 100% Genuine Sports Nutrition Nepal", template: "%s | MuscleWorks Supplements Nepal" }`
  - `description: STORE_DESCRIPTION`
  - `keywords: ["Whey Protein Nepal", "Creatine Monohydrate Kathmandu", "Authentic Supplements Nepal", "MuscleWorks Golfutar", ...]`
  - `openGraph: { type: "website", locale: "en_US", url: SITE_URL, siteName: STORE_NAME, title: ..., description: ..., images: [...] }`
  - `twitter: { card: "summary_large_image", title: ..., description: ..., images: [...] }`
  - `robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } }`
- **Accessibility & Shell:**
  - Accessible skip-to-content link: `<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-white rounded-lg">Skip to main content</a>`
  - Mount `<Toaster richColors theme="dark" position="top-right" />` from `sonner`.
  - Wrap `{children}` in semantic `<main id="main-content" className="flex-1 flex flex-col">`.

### Step 2: `src/app/not-found.tsx`
- Branded Server Component rendering an athletic 404 container.
- High-contrast visual header with athletic icon (`Dumbbell` / `SearchX` from `lucide-react`).
- Clean heading: `"404 — Workout Route Not Found"` and helpful description explaining the page may have moved or been updated.
- Primary Action Button: `"Explore Supplement Catalog"` (`/products`) with right arrow icon (`≥48px` touch target).
- Secondary Action Button: `"Inquire on WhatsApp"` (`wa.me` URL with pre-filled message).
- Tertiary Action: `"Return Home"` (`/`).
- Quick-Jump Navigation Pills:
  - *Whey Proteins* (`/categories/proteins`)
  - *Creatine* (`/categories/creatine`)
  - *Mass Gainers* (`/categories/mass-gainers`)
  - *Pre-Workouts* (`/categories/pre-workouts`)
  - *Flagship Store* (`/location`)

### Step 3: `src/app/error.tsx`
- Client Component (`'use client'`).
- Props: `{ error: Error & { digest?: string }, reset: () => void }`.
- Logs error safely via `useEffect(() => { console.error("[APP_ERROR]", error); }, [error])`.
- Athletic error card with warning indicator (`AlertTriangle`), user-friendly message, and development error digest if present.
- Interactive recovery actions:
  - Primary `"Try Again"` button invoking `reset()`.
  - Secondary `"WhatsApp Support"` button initiating contact with error details.
  - Tertiary `"Return to Home"` link.

### Step 4: `src/app/global-error.tsx`
- Client Component (`'use client'`).
- Minimal standalone fallback with `<html>` and `<body>` tags ensuring styling is applied even if the root layout fails.
- Provides `"Reload Application"` and `"Return Home"` recovery triggers.

---

## 4. When We Are Going to Do It

```text
1. Update Progress Tracker to mark 0.4 [IN PROGRESS]
    │
    ▼
2. Modify src/app/layout.tsx (Fonts, Metadata, Viewport, Toaster, Skip Link)
    │
    ▼
3. Create src/app/not-found.tsx (404 Shell, Dual CTAs, Category Pills)
    │
    ▼
4. Create src/app/error.tsx & src/app/global-error.tsx (Error Boundaries)
    │
    ▼
5. Execute Verification Gate (tsc --noEmit, eslint, next build)
    │
    ▼
6. Update Progress Tracker & Roadmap to mark Phase 0 Complete (4/4) and promote Phase 1
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Brand Constants & Copy | `src/lib/constants.ts` | Meta titles, descriptions, WhatsApp link, address, category shortcuts |
| CSS Theme Variables | `src/app/globals.css` | `--font-heading`, `--font-sans`, `--color-background`, `--color-primary` |
| Font Packages | `next/font/google` | Zero-layout-shift Google Font loading |
| Toast Notifications | `sonner` | Global notification alerts container in root layout |
| Icons | `lucide-react` | Navigation and recovery action icons |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Font Loading CLS Shift** | Missing `display: 'swap'` or mismatched font variable names. | Explicitly specify `display: 'swap'` and bind `--font-heading` and `--font-sans` variables matching `src/app/globals.css`. |
| **Missing Metadata Base Warning** | Relative OpenGraph images without `metadataBase`. | Set `metadataBase: new URL(SITE_URL)` in `src/app/layout.tsx`. |
| **Error Boundary Client Hook Crash** | Missing `'use client'` on `error.tsx` or `global-error.tsx`. | Mark both error files with `'use client'` at line 1. |
| **Global Error Boundary HTML Missing** | `global-error.tsx` omitting `<html>` and `<body>`. | Explicitly define `<html>` and `<body>` in `global-error.tsx` as mandated by Next.js App Router rules. |
| **Mobile Touch Target < 44px** | 404 / Error CTA buttons too small on mobile screens. | Apply `h-12 min-h-[48px] px-6 text-base w-full sm:w-auto` to all primary and secondary action buttons. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` executes with zero errors.
3. `npm run build` succeeds with static generation across all routes.
4. Fonts `Outfit` and `Plus_Jakarta_Sans` are properly injected on `<html>`.
5. 404 page renders cleanly with working navigation links and WhatsApp inquiry.
6. Error boundary renders athletic fallback card with functional reset trigger.
