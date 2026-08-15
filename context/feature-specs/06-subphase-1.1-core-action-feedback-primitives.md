# Feature Spec 06: Sub-Phase 1.1 — Core Action & Feedback Primitives

> **Spec ID:** `06-subphase-1.1-core-action-feedback-primitives`  
> **Target Sub-Phase / Branch:** `Phase 1 — Sub-Phase 1.1`  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification governs the implementation of **Sub-Phase 1.1: Core Action & Feedback Primitives** for MuscleWorks Supplements. It creates the foundational atomic UI primitives (`Button`, `Badge`, `Separator`, and `Skeleton`) using Tailwind CSS v4 `@theme` design tokens, Radix UI primitives (`@radix-ui/react-slot`, `@radix-ui/react-separator`), and Class Variance Authority (`cva`). All components enforce mobile-first touch targets (≥44x44px standard, ≥48x48px for conversion CTAs), WCAG AA accessibility, and zero-layout-shift skeleton loaders.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/components/ui/button.tsx` | **[NEW]** | Implement polymorphic CVA `Button` component with athletic variants (`default`, `whatsapp`, `gold`, `secondary`, `outline`, `ghost`, `destructive`, `link`), 4-tier sizing scale (`sm`, `default` 44px, `lg` 48px, `xl` 56px, `icon` 44px), and Radix `Slot` `asChild` support. |
| 2 | `src/components/ui/badge.tsx` | **[NEW]** | Implement CVA `Badge` component with trust and commerce variants (`authentic` emerald, `discount` crimson, `stock` gold, `category` charcoal slate, `default`, `outline`). |
| 3 | `src/components/ui/separator.tsx` | **[NEW]** | Implement accessible WAI-ARIA `Separator` component wrapping `@radix-ui/react-separator` with dark slate styling and horizontal/vertical orientation support. |
| 4 | `src/components/ui/skeleton.tsx` | **[NEW]** | Implement pulsing dark athletic `Skeleton` loader placeholder for zero-CLS Suspense boundaries and streaming states. |

---

## 2. Why We Are Doing This

1. **High-Conversion Mobile Touch Targets:** Standard interactive elements require ≥44x44px touch targets; WhatsApp and direct-checkout conversion actions require ≥48x48px touch targets to maximize mobile conversions across Nepal's 4G/5G mobile-heavy audience.
2. **Polymorphic Next.js Routing (`asChild`):** Wrapping buttons with Radix `Slot` enables rendering semantic Next.js `<Link>` elements with all CVA button styles, eliminating invalid nested `<button>` inside `<a>` anti-patterns.
3. **Supplement Trust Indicators:** The `Badge` primitive provides standardized visual tags for 100% genuine importer seals (`authentic`), savings badges (`discount`), stock alerts (`stock`), and category chips (`category`).
4. **Zero Layout Shift (CLS < 0.05):** The `Skeleton` primitive provides deterministic placeholder geometry for product cards, prices, and galleries while static/server components stream.

---

## 3. How We Are Going to Implement It

### Step 1: `src/components/ui/button.tsx`
- Utilizes `cva` from `class-variance-authority` and `Slot` from `@radix-ui/react-slot`.
- **Variants:**
  - `default`: Electric Gym Crimson (`bg-primary text-primary-foreground shadow-md hover:bg-primary-hover hover:shadow-lg shadow-primary/20`)
  - `whatsapp`: Emerald Green Conversion (`bg-success text-success-foreground shadow-md hover:bg-emerald-600 hover:shadow-lg shadow-success/20`)
  - `gold`: Performance Gold Accent (`bg-accent text-accent-foreground shadow-md hover:bg-amber-400 hover:shadow-lg shadow-accent/20`)
  - `secondary`: Charcoal Slate Surface (`bg-secondary text-secondary-foreground hover:bg-secondary/80`)
  - `outline`: Subtle Obsidian Border (`border border-border bg-transparent text-foreground hover:bg-muted`)
  - `ghost`: Transparent Hover Fill (`text-foreground hover:bg-muted hover:text-foreground`)
  - `destructive`: Alert Red (`bg-destructive text-white shadow-md hover:bg-destructive/90`)
  - `link`: Primary Text Link (`text-primary underline-offset-4 hover:underline p-0 h-auto`)
- **Sizes:**
  - `sm`: `h-9 px-3.5 text-xs rounded-lg` (compact utility/filter actions)
  - `default`: `h-11 px-5 py-2.5 text-sm rounded-xl` (44px mobile touch target)
  - `lg`: `h-12 px-6 text-base rounded-xl` (48px conversion CTA standard)
  - `xl`: `h-14 px-8 text-lg font-bold rounded-2xl` (56px hero and sticky buy bar CTA)
  - `icon`: `h-11 w-11 rounded-xl p-0` (44x44px square touch target)

### Step 2: `src/components/ui/badge.tsx`
- Utilizes `cva` for consistent styling tokens.
- **Variants:**
  - `default`: Primary Crimson (`border-transparent bg-primary text-primary-foreground`)
  - `authentic`: Verified Emerald Green (`border-emerald-500/30 bg-emerald-500/10 text-emerald-400`)
  - `discount`: Savings Crimson (`border-primary/30 bg-primary/15 text-red-400 font-bold`)
  - `stock`: Inventory Gold (`border-amber-500/30 bg-amber-500/10 text-amber-400`)
  - `category`: Charcoal Slate (`border-border bg-secondary/80 text-muted-foreground`)
  - `secondary`: Charcoal Fill (`border-transparent bg-secondary text-secondary-foreground`)
  - `outline`: Border Only (`border-border text-foreground bg-transparent`)

### Step 3: `src/components/ui/separator.tsx`
- Wraps `@radix-ui/react-separator` with `forwardRef`.
- Applies `shrink-0 bg-border` with horizontal (`h-[1px] w-full`) and vertical (`h-full w-[1px]`) dimensions.
- Defaults to `decorative = true` for accessible WAI-ARIA separation.

### Step 4: `src/components/ui/skeleton.tsx`
- Applies `animate-pulse rounded-xl bg-muted/80` with customizable className for width, height, and border-radius.

---

## 4. When We Are Going to Do It

```text
1. Update Progress Tracker to mark 1.1 [IN PROGRESS]
    │
    ▼
2. Create src/components/ui/button.tsx
    │
    ▼
3. Create src/components/ui/badge.tsx
    │
    ▼
4. Create src/components/ui/separator.tsx
    │
    ▼
5. Create src/components/ui/skeleton.tsx
    │
    ▼
6. Execute Verification Gate (tsc --noEmit, eslint, next build)
    │
    ▼
7. Update Progress Tracker & Roadmap to mark 1.1 [x] and promote 1.2
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| CSS Theme Tokens | `src/app/globals.css` | `--color-primary`, `--color-success`, `--color-accent`, `--color-card`, `--color-border` |
| Class Merger | `src/lib/utils.ts` | `cn()` helper combining `clsx` and `tailwind-merge` |
| Radix UI Primitives | `@radix-ui/react-slot`, `@radix-ui/react-separator` | Polymorphic rendering and accessible separator |
| CVA | `class-variance-authority` | Type-safe variant configuration and prop types |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Mobile Touch Target < 44px** | Overriding button padding with compact utility styles on mobile. | Enforce `min-h-[44px]` (or `min-h-[48px]` for `lg`/`xl`) and `min-w-[44px]` in `buttonVariants`. |
| **Radix Slot Children Error** | Passing multiple root elements to `<Button asChild>`. | Document invariant that `asChild` requires exactly one direct React child element (e.g. `<Link>`). |
| **Missing Accessible Focus Ring** | Removing focus outline for visual styling. | Enforce `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` in base CVA. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` executes with zero errors and warnings.
3. `npm run build` succeeds without issues.
4. All button variants satisfy min touch target requirements (≥44px standard, ≥48px for conversion CTAs).
5. All badge variants render expected dark athletic color contracts.
