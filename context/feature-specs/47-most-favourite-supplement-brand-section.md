# Feature Spec 47: Most Favourite Supplement Brand Section

> **Spec ID:** `47-most-favourite-supplement-brand-section`  
> **Target Sub-Phase / Branch:** `section-6` / Sub-Phase 6.4 (Homepage Showcase Assembly)  
> **Status:** Approved  
> **Created Date:** 2026-08-15  
> **Author:** Antigravity AI

---

## Executive Summary

Build a high-performance, responsive "Most Favourite Supplement Brand" showcase section for the MuscleWorks homepage (`src/app/page.tsx`), mounted directly below the `<DealsSection />`.

The section establishes brand authority and social proof in Nepal. It features:
- Section 3 `/slice` style background with radial spotlight glow and glassmorphic steep tilted charcoal diagonal slice.
- Direct background content placement (no enclosing cards or artificial triangular clips).
- Bold display typography (`MOST FAVOURITE SUPPLEMENT BRAND`) and brand narrative highlighting the Golfutar, Kathmandu store, verified hologram seals, and nationwide delivery.
- Upward-animated numeric milestone counters with smooth scroll-triggered count-up (`15,000+ BOTTLES DELIVERED` and `5,000+ CUSTOMERS SERVED`).
- Creatively framed athlete photoshoot image with offset geometric layers, luxury glass border, subtle ambient vignette, and floating holographic trust badge pill (`/brand-feature/favorite-brand-new.webp`).

---

## 1. What We Are Going to Do

List of files created or modified:

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `public/brand-feature/favorite-brand-new.webp` | **[NEW]** | Optimized WebP gym photoshoot asset (1672x941, 206 KB). |
| 2 | `src/components/home/favorite-brand-section.tsx` | **[NEW]** | Interactive Client Component with upward animated counters, direct background placement, and creative image frame. |
| 3 | `src/app/page.tsx` | **[MODIFY]** | Mount `<FavoriteBrandSection />` directly below `<DealsSection />`. |
| 4 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 47 in the Feature Specification Registry index. |
| 5 | `context/progress-tracker.md` | **[MODIFY]** | Log implementation progress and session notes for Sub-Phase 6.4 assembly. |

---

## 2. Why We Are Doing This

1. **Direct Background Aesthetics:** Removes artificial framing/triangle cards to allow content and typography to breathe naturally against the background slice.
2. **Visual Consistency with Section 3:** Reuses the glassmorphic tilted charcoal slice and radial spotlight glow for a unified, modern luxury brand aesthetic across the homepage.
3. **Engaging Micro-Interactions:** Upward rising animation and smooth counter rolling (`0 -> 15,000+` and `0 -> 5,000+`) provide delightful feedback when the user scrolls into view.
4. **Creative Image Framing:** Adds multi-layered depth with an offset decorative gradient backdrop and glassmorphic trust badge.

---

## 3. How We Are Going to Implement It

### Step 1: Background Style & Grid Structure

```tsx
<section
  ref={sectionRef}
  className="w-full bg-white py-14 sm:py-20 lg:py-24 border-b border-slate-100 relative overflow-hidden"
>
  {/* Radial Spotlight */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(15,23,42,0.04),transparent)]" />

  {/* Glassmorphic Tilted Slice (Section 3 Style) */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
    <div className="absolute -top-64 -bottom-64 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] md:w-[850px] -skew-x-45 bg-gradient-to-b from-slate-900/8 via-slate-800/5 to-transparent backdrop-blur-[2px] border-x border-slate-900/10 shadow-2xs opacity-85" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      {/* Direct Content Placement (Left 6 Cols) */}
      <div className="lg:col-span-6 flex flex-col justify-center">...</div>

      {/* Creatively Styled Image Frame (Right 6 Cols) */}
      <div className="lg:col-span-6 relative">...</div>
    </div>
  </div>
</section>
```

### Step 2: Upward Animated Counters

```tsx
<div
  className={`transform transition-all duration-700 ease-out ${
    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  }`}
  style={{ transitionDelay: "150ms" }}
>
  <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#FF5500] tracking-tight leading-none">
    <AnimatedCounter end={15000} suffix="+" isInView={isInView} />
  </div>
  <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mt-2.5 block">
    BOTTLES DELIVERED
  </span>
</div>
```

---

## 4. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` passes cleanly.
3. Content and stats sit directly on the section canvas without enclosing cards.
4. Image is framed with multi-layered offset backdrop, luxury border, and trust badge pill.
5. Numbers rise from bottom to top and count up smoothly when scrolled into view.
6. Section uses Section 3 glassmorphic diagonal slice and radial spotlight glow.
