# Feature Spec 40: Responsive Layout Overflow & Breakpoint Fixes

> **Spec ID:** `40-responsive-layout-overflow-fixes`  
> **Target Sub-Phase / Area:** Global Layout, Header & Responsive Breakpoint Hardening  
> **Status:** Approved & Complete  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI  

---

## Executive Summary

This specification documents the root cause analysis, technical design, file changes, and verification plan for resolving horizontal layout overflow and breakpoint collisions across mobile, tablet (`md: 768px`), and desktop viewports.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/layout/header.tsx` | **[MODIFY]** | Align `<Navbar />` to `lg:flex`, set `<MobileNav />` to `lg:hidden`, make WhatsApp CTA responsive (`hidden lg:inline-flex`), and scale logo (`w-44 sm:w-52 lg:w-72`). |
| 2 | `src/app/layout.tsx` | **[MODIFY]** | Enforce `max-w-full overflow-x-hidden` on `html`, `body`, and `<main>` containers to prevent document scrollbar expansion. |
| 3 | `src/components/home/hero-section.tsx` | **[MODIFY]** | Replace non-standard `xs:text-3xl` class with standard Tailwind v4 responsive typography breakpoints. |
| 4 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 40 in the specification index registry table. |
| 5 | `context/progress-tracker.md` | **[MODIFY]** | Update session notes with Spec 40 authorization and resolution. |

---

## 2. Why We Are Doing This

1. **Eliminate 768px (`md:`) Tablet Layout Break:**
   At 768px viewport width, the header flex container currently attempts to fit a 288px logo + 330px desktop navigation + 44px search button + 170px WhatsApp CTA = ~864px inside a 720px available container. This causes a ~144px horizontal overflow, creating a large white empty column on the right side of the screen.
2. **Adhere to Touch Target & Mobile Standards:**
   Enforce minimum touch targets ($\ge 44\text{px}$) and clear responsive transitions between drawer navigation (`<lg`) and inline navigation ($\ge\text{lg}$).
3. **Prevent Document Canvas Leakage:**
   Adding strict overflow guards (`overflow-x-hidden`) ensures zero horizontal scrollbars across all device breakpoints.

---

## 3. How We Are Going to Implement It

### Step 1: Responsive Header Sizing & Navigation Transitions (`header.tsx`)
- Adjust Logo container sizing:
  - Base (`<640px`): `h-10 w-44` (176px width)
  - `sm:` (`640px-1023px`): `h-12 w-52` (208px width)
  - `lg:` (`≥1024px`): `h-14 w-72` (288px width)
- Set `<Navbar />` breakpoint to `hidden lg:flex` (renders on 1024px+ desktop viewports where $\ge 960\text{px}$ container space is available).
- Set `<MobileNav />` drawer trigger to `lg:hidden` (provides tablet users 768px–1023px with a clean, un-cluttered touch drawer).
- Set WhatsApp Header CTA button to `hidden lg:inline-flex` (or icon button on `md:`).

### Step 2: Root Viewport Clipping (`layout.tsx`)
- Add `max-w-full overflow-x-hidden` to `<html>`, `<body>`, and `<main id="main-content">` elements.

### Step 3: Clean Hero Section Typography (`hero-section.tsx`)
- Remove `xs:text-3xl` and standardize heading text sizing: `text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Draft & Author Spec 40 (Complete)
    │
    ▼
Phase 2: Obtain Explicit User Approval (Mandatory Pause)
    │
    ▼
Phase 3: Implement Layout Fixes in header.tsx, layout.tsx & hero-section.tsx
    │
    ▼
Phase 4: Run Type Checker & Verification Build (npx tsc --noEmit, npm run build)
    │
    ▼
Phase 5: Update Progress Tracker & Feature Specs Registry
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Breakpoint Contract | Tailwind CSS v4 defaults (`sm: 640px`, `md: 768px`, `lg: 1024px`) | Layout breakpoint boundaries |
| Header Links | `NAV_LINKS` in `src/components/layout/navbar.tsx` | Main navigation routing |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Mobile Drawer Missing on Tablet** | Hiding `<MobileNav />` at `md:` while hiding `<Navbar />` at `lg:`. | Ensure `<MobileNav />` uses `lg:hidden` so it remains accessible on tablet screens (768px-1023px). |
| **Sticky Header Blur Clipping** | `overflow-hidden` on sticky container breaking backdrop blur. | Apply `overflow-x-hidden` on document layout containers, not on the backdrop filter container. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` completes with **0 errors**.
2. Viewport testing at **360px, 640px, 768px, 1024px, and 1280px** shows **0 horizontal overflow**.
3. Desktop header navigation displays cleanly on $\ge 1024\text{px}$ without wrapping or overflow.
4. Mobile/Tablet drawer menu opens smoothly on viewports $< 1024\text{px}$.
5. `npm run build` succeeds cleanly.
