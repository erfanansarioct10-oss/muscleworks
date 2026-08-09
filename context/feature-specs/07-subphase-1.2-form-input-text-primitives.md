# Feature Spec 07: Sub-Phase 1.2 — Form Input & Text Primitives

> **Spec ID:** `07-subphase-1.2-form-input-text-primitives`  
> **Target Sub-Phase / Branch:** `Phase 1 — Sub-Phase 1.2`  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification governs the implementation of **Sub-Phase 1.2: Form Input & Text Primitives** for MuscleWorks Supplements. It establishes the form interaction and structured content primitives (`Input`, `Textarea`, `Select`, and `Card`) tailored for mobile-first supplement inquiries, stack consultation forms, checkout details, and catalog card surfaces. All components enforce mobile touch targets (≥44px height), WCAG AA contrast ratios, accessible focus and error rings, and dark athletic aesthetics.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/components/ui/input.tsx` | **[NEW]** | Implement dark athletic `Input` primitive with 44px mobile touch height (`h-11`), electric crimson focus ring, and `aria-invalid` error states. |
| 2 | `src/components/ui/textarea.tsx` | **[NEW]** | Implement dark athletic `Textarea` primitive with `min-h-[100px]`, flexible sizing, and matching focus/error rings. |
| 3 | `src/components/ui/select.tsx` | **[NEW]** | Implement full Radix UI `@radix-ui/react-select` component family (`Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`) with 44px touch trigger and dark popover surface. |
| 4 | `src/components/ui/card.tsx` | **[NEW]** | Implement `Card` compound family (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) with elevated slate surface (`bg-card`), heading typography (`font-heading`), and subtle obsidian borders. |

---

## 2. Why We Are Doing This

1. **Mobile-First Form Ergonomics:** Kathmandu gym inquiries and checkout forms are predominantly submitted on mobile devices. Standardizing on `h-11` (44px) eliminates zoom-in layout shifts on iOS Safari (font size ≥ 16px on mobile prevents automatic viewport zooming).
2. **Accessible Form Error Diagnostics:** Inputs, textareas, and selects natively bind to `aria-invalid` and `focus-visible` styling tokens, delivering immediate high-contrast visual feedback when validation errors occur in Server Action forms.
3. **Robust Radix Select Experience:** Utilizing `@radix-ui/react-select` ensures full keyboard navigation (arrows, space, enter, escape), screen-reader compatibility (WAI-ARIA `combobox` / `listbox`), and collision-free portaled popovers.
4. **Cohesive Athletic Card Family:** Provides the fundamental container surface for product cards, authenticity badges, store hours, and testimonial cards across the storefront.

---

## 3. How We Are Going to Implement It

### Step 1: `src/components/ui/input.tsx`
- Component: `React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>`
- Classes:
  - Base: `flex h-11 w-full rounded-xl border border-border bg-card px-4 py-2 text-base sm:text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-semibold placeholder:text-muted-foreground transition-colors`
  - Focus: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary`
  - Error: `aria-invalid:border-destructive aria-invalid:ring-destructive`
  - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`

### Step 2: `src/components/ui/textarea.tsx`
- Component: `React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>`
- Classes:
  - Base: `flex min-h-[100px] w-full rounded-xl border border-border bg-card px-4 py-3 text-base sm:text-sm text-foreground ring-offset-background placeholder:text-muted-foreground transition-colors`
  - Focus & Error: Same as `Input`.

### Step 3: `src/components/ui/select.tsx`
- Full Radix `@radix-ui/react-select` primitive exports:
  - `Select = SelectPrimitive.Root`
  - `SelectGroup = SelectPrimitive.Group`
  - `SelectValue = SelectPrimitive.Value`
  - `SelectTrigger`: `flex h-11 min-h-[44px] w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1` + `ChevronDown`
  - `SelectScrollUpButton`, `SelectScrollDownButton`
  - `SelectContent`: `relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95`
  - `SelectItem`: `relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-8 text-sm outline-none focus:bg-muted focus:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50` + `Check` icon
  - `SelectLabel`: `py-1.5 pl-3 pr-2 text-xs font-semibold uppercase text-muted-foreground`
  - `SelectSeparator`: `-mx-1 my-1 h-px bg-border`

### Step 4: `src/components/ui/card.tsx`
- `Card`: `rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm transition-all duration-200`
- `CardHeader`: `flex flex-col space-y-1.5 p-5 sm:p-6`
- `CardTitle`: `font-heading text-lg sm:text-xl font-bold leading-none tracking-tight text-foreground`
- `CardDescription`: `text-sm text-muted-foreground leading-relaxed`
- `CardContent`: `p-5 pt-0 sm:p-6 sm:pt-0`
- `CardFooter`: `flex items-center p-5 pt-0 sm:p-6 sm:pt-0`

---

## 4. When We Are Going to Do It

```text
1. Update Progress Tracker to mark 1.2 [IN PROGRESS]
    │
    ▼
2. Create src/components/ui/input.tsx
    │
    ▼
3. Create src/components/ui/textarea.tsx
    │
    ▼
4. Create src/components/ui/select.tsx
    │
    ▼
5. Create src/components/ui/card.tsx
    │
    ▼
6. Execute Verification Gate (tsc --noEmit, eslint, next build)
    │
    ▼
7. Update Progress Tracker & Roadmap to mark 1.2 [x] and promote 1.3
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| CSS Theme Variables | `src/app/globals.css` | `--color-card`, `--color-border`, `--color-ring`, `--font-heading` |
| Radix UI Select | `@radix-ui/react-select` | Accessible dropdown combobox primitive |
| Icons | `lucide-react` | `ChevronDown`, `ChevronUp`, `Check` |
| Utility Class Merger | `src/lib/utils.ts` | `cn()` helper |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **iOS Safari Viewport Zoom on Focus** | Setting input font size < 16px on mobile viewports. | Apply `text-base sm:text-sm` so inputs render at `16px` on mobile, preventing unwanted browser auto-zoom. |
| **Missing Select Client Directive** | Radix Select components using hooks without `'use client'`. | Place `'use client'` directive at the top of `src/components/ui/select.tsx`. |
| **Select Dropdown Clip Inside Modal/Card** | Missing portal container on `SelectContent`. | Wrap `SelectPrimitive.Content` with `SelectPrimitive.Portal` for collision-free overlay rendering. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` executes with zero errors and zero warnings.
3. `npm run build` succeeds without issues.
4. Input and Select touch targets meet minimum 44px standard (`h-11`).
5. Card typography and layout hierarchy render cleanly in dark athletic mode.
