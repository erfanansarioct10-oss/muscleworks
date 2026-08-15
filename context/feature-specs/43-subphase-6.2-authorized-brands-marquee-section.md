# Feature Spec 43: Sub-Phase 6.2 — Authorized Brands Marquee Section

> **Spec ID:** `43-subphase-6.2-authorized-brands-marquee-section`  
> **Target Sub-Phase:** Sub-Phase 6.2 (Homepage Authorized Brands Marquee)  
> **Status:** Approved  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI Agent  

---

## Executive Summary

This specification defines the technical implementation for **Sub-Phase 6.2: Authorized Brands Marquee Section** (`src/components/home/brands-marquee.tsx`) mounted directly below the `<HeroSection />` on the homepage (`src/app/page.tsx`). 

Following user feedback to replace the previously planned Trust Badges Bar & Category Showcase Grid (which overlaps with existing Hero visuals), this section focuses on establishing instant brand authority by showcasing official international supplement manufacturers (*Optimum Nutrition, MuscleTech, Dymatize, MyProtein, Kevin Levrone, Rule 1, Labrada, Cellucor, Universal, Scivation, Insane Labz, MusclePharm*) imported into Nepal with 100% authentic holographic security seals.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/home/brands-marquee.tsx` | **[NEW]** | Implement interactive authorized brands infinite marquee component with hover-to-pause and brand archive routing. |
| 2 | `src/app/globals.css` | **[MODIFY]** | Add CSS keyframe animation `@keyframes marquee` and `.animate-marquee` infinite scroll classes with `prefers-reduced-motion` safety. |
| 3 | `src/app/page.tsx` | **[MODIFY]** | Fetch static brand profiles via `getBrands()` and mount `<BrandsMarquee brands={brands} />` directly below `<HeroSection />`. |
| 4 | `context/progress-tracker.md` | **[MODIFY]** | Update Sub-Phase 6.2 status and log progress notes upon completion. |
| 5 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 43 in the specification registry index. |

---

## 2. Why We Are Doing This

1. **Brand Authority & Buyer Confidence:** Counterfeit supplements are a widespread concern in Nepal. Displaying authorized global brands with official importer holographic verification details immediately below the Hero reinforces authenticity.
2. **Seamless Navigation & UX:** Each brand pill in the marquee routes directly to `/brands/[slug]` pre-filtering authentic products from that brand.
3. **Mobile-First & Touch Target Compliance:** Minimum touch targets $\ge 44\text{px}$ for all interactive brand cards, ensuring effortless navigation on mobile devices (<640px).
4. **Performance & Lightweight Execution:** Infinite CSS keyframe animation ensures smooth 60fps scrolling with zero JavaScript overhead on the main thread.

---

## 3. How We Are Going to Implement It

### Step 1: CSS Marquee Animation (`src/app/globals.css`)
- Define keyframe animation `@keyframes marquee`:
  ```css
  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  ```
- Define utility class `.animate-marquee` with `animation: marquee 35s linear infinite` and `.animate-marquee:hover { animation-play-state: paused; }`.
- Add `@media (prefers-reduced-motion: reduce)` rule pausing animation for users preferring static UI.

### Step 2: Brands Marquee Component (`src/components/home/brands-marquee.tsx`)
- Server/Client hybrid leaf component accepting `brands: Brand[]` prop.
- Render modern luxury header:
  - Eyebrow pill: `100% AUTHENTIC IMPORTER SEALS`
  - Heading: `Authorized International Brands`
  - Subtitle: `Directly imported with official hologram verification seals from the world's premier sports nutrition pioneers.`
- Double the `brands` array (`[...brands, ...brands]`) to enable smooth continuous loop without gaps.
- Wrap track in overflow-hidden container with left/right gradient mask overlays (`from-background to-transparent`).
- Render brand cards with:
  - Brand name (e.g., *Optimum Nutrition*, *MuscleTech*, *Dymatize*)
  - Country of origin badge (e.g., *🇺🇸 USA*, *🇬🇧 UK*)
  - Interactive link to `/brands/[slug]` with `min-h-[44px]` touch target height.

### Step 3: Homepage Integration (`src/app/page.tsx`)
- Call `await getBrands()` from `@/lib/data/brands`.
- Render `<BrandsMarquee brands={brands} />` directly below `<HeroSection />`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Add CSS Keyframe Animation to src/app/globals.css
    │
    ▼
Phase 2: Build Interactive BrandsMarquee Component in src/components/home/brands-marquee.tsx
    │
    ▼
Phase 3: Mount BrandsMarquee in src/app/page.tsx
    │
    ▼
Phase 4: Run Type Checks (npx tsc --noEmit) & Static Build (npm run build)
    │
    ▼
Phase 5: Update Progress Tracker & Feature Specs Registry
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Authorized Brands List | `data/brands.json` via `src/lib/data/brands.ts` | Brand names, slugs, country of origin, logo references |
| Minimal Luxury Tokens | `src/app/globals.css` | Jet Black `#0B0B0B`, Metallic Gold, Silver Gray borders |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Marquee Stutter on Low-Power Devices** | Heavy CSS transitions or JS animations. | Use CSS hardware-accelerated `transform: translateX()` and `will-change: transform`. |
| **Touch Collision on Mobile Scroll** | Swiping vertical page triggers horizontal brand click. | Ensure touch target padding is $\ge 44\text{px}$ with clear tap boundaries. |
| **Animation Loop Seam / Jump** | Single track width doesn't match scroll percentage. | Duplicate track items exact 2x and set transform to `-50%`. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with 0 errors.
2. `npm run lint` completes with 0 errors.
3. Marquee scrolls smoothly at 60fps and pauses on hover.
4. Clicking a brand card navigates cleanly to `/brands/[slug]`.
5. `npm run build` succeeds with 0 errors.
