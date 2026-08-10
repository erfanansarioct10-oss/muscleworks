# Feature Spec 41: Dual Responsive Mobile/Desktop Hero Background & Layout

> **Spec ID:** `41-mobile-hero-background-layout`  
> **Target Sub-Phase / Area:** Sub-Phase 6.1 — Homepage Hero Section (`src/components/home/hero-section.tsx`)  
> **Status:** Approved & Complete  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI  

---

## Executive Summary

This specification defines the technical implementation for introducing dedicated dual background images and responsive layout structure in `<HeroSection />`. It incorporates a vertically optimized mobile hero image (`public/hero/mobile-hero-bg.webp`, compressed from `mobile-viewpoint-hero.png` by 94.3%) on viewports `< md` (0px–767px) while preserving the horizontal hero background (`public/hero/hero-bg.webp`) on desktop viewports (`md:` $\ge 768\text{px}$).

On mobile viewports, the text content (headings, subtitle, trust badges, and CTA buttons) is aligned within the upper ~70% empty area to leave the bottom ~30% supplement visual showcase unobstructed.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `public/hero/mobile-hero-bg.webp` | **[NEW]** | Optimized WebP mobile hero background image (127 KB, 853x1844 px). |
| 2 | `src/components/home/hero-section.tsx` | **[MODIFY]** | Implement responsive background image switching (`md:hidden` vs `hidden md:block`) and top-aligned mobile spacing to constrain text to upper 70% zone. |
| 3 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 41 in the specification registry index table. |
| 4 | `context/progress-tracker.md` | **[MODIFY]** | Update progress tracker session notes with Spec 41 status. |

---

## 2. Why We Are Doing This

1. **Optimized Mobile Viewport Aesthetics:**
   Desktop horizontal background images (`hero-bg.webp`) crop awkwardly when squished onto vertical portrait smartphone screens (360px–430px). The dedicated `mobile-hero-bg.webp` asset features a vertical composition custom-tailored for mobile displays.
2. **Clear Visual Hierarchy & Unobstructed Artwork:**
   Positioning text elements inside the top 70% empty region prevents headings and CTA buttons from obscuring the product visuals displayed in the lower 30% of the mobile hero asset.
3. **High Performance & Fast LCP:**
   Compressing `mobile-viewpoint-hero.png` (2.23 MB) to `mobile-hero-bg.webp` (127 KB) achieves a 94.3% payload reduction, ensuring rapid 4G/5G mobile rendering over Nepal cellular networks.

---

## 3. How We Are Going to Implement It

### Step 1: Responsive Background Layering
In `src/components/home/hero-section.tsx`:
```tsx
{/* Mobile Hero Background (< md) */}
<div className="absolute inset-0 z-0 md:hidden">
  <Image
    src="/hero/mobile-hero-bg.webp"
    alt="MuscleWorks Supplements Mobile Hero Background"
    fill
    priority
    sizes="100vw"
    className="object-cover object-top"
  />
  <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-transparent pointer-events-none" />
</div>

{/* Desktop Hero Background (>= md) */}
<div className="absolute inset-0 z-0 hidden md:block">
  <Image
    src="/hero/hero-bg.webp"
    alt="MuscleWorks Supplements Desktop Hero Background"
    fill
    priority
    sizes="100vw"
    className="object-cover object-center"
  />
  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent pointer-events-none" />
</div>
```

### Step 2: Mobile Upper-Zone Content Alignment
Adjust padding and flex layout on the container:
- Mobile (`< md`): `flex flex-col justify-start pt-6 sm:pt-8 pb-48 sm:pb-56 min-h-[calc(100dvh-4rem)]`
- Desktop (`md:` $\ge 768\text{px}$): `md:flex-row md:items-center md:pt-12 md:pb-12 md:min-h-[calc(100dvh-5rem)]`
- Text content is contained within the upper 70% zone on mobile, with trust badges in 2-column or stacked layout and high-contrast text drop shadows.

---

## 4. When We Are Going to Do It

```text
Phase 1: Draft Spec 41 & Compress Assets (Complete)
    │
    ▼
Phase 2: Obtain Explicit User Approval (Mandatory Pause)
    │
    ▼
Phase 3: Implement Dual Hero Background & Spacing in hero-section.tsx
    │
    ▼
Phase 4: Run Type Checker & Build Verification (npx tsc --noEmit, npm run build)
    │
    ▼
Phase 5: Update Progress Tracker & Feature Specs Registry
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Mobile Hero Asset | `public/hero/mobile-hero-bg.webp` (127 KB) | Portrait mobile background image |
| Desktop Hero Asset | `public/hero/hero-bg.webp` (186 KB) | Landscape desktop background image |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Text Overlaps Products on Short Phones** | Viewport height `< 667px` causing text box to extend down. | Use `object-top` positioning, tight vertical spacing (`space-y-4`), and generous bottom padding (`pb-48 sm:pb-56`) to keep lower 30% clear. |
| **Double Image Download** | Browser fetching both images simultaneously. | Next.js `<Image>` with standard Tailwind `md:hidden` / `hidden md:block` rules. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` completes with **0 errors**.
2. Mobile viewports (`360px`, `390px`, `430px`) render `mobile-hero-bg.webp` with text in the upper 70% zone.
3. Desktop viewports (`768px`, `1024px`, `1280px`) render `hero-bg.webp` with left-aligned desktop layout.
4. `npm run build` succeeds with full static pre-rendering.
