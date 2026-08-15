# Feature Spec 45: Sub-Phase 6.3 — Featured Products Showcase Section

> **Spec ID:** `45-subphase-6.3-featured-products-showcase`  
> **Target Sub-Phase:** Sub-Phase 6.3 (`src/components/home/featured-products-section.tsx`, `src/app/page.tsx`)  
> **Status:** Approved  
> **Created Date:** 2026-08-12  
> **Author:** AI Pair Programmer (Antigravity)

---

## Executive Summary

Sub-Phase 6.3 implements Section 3 of the MuscleWorks homepage directly below the Authorized Brands Marquee Section (`brands-marquee.tsx`). It showcases the shop's top 4 best-selling supplement products (*BioTechUSA 100% Pure Whey*, *BPI Sports WHEY HD*, *ON Gold Standard 100% Isolate*, and *MuscleBlaze Biozyme Performance Whey*) in a high-impact 2x2 grid layout. Each banner card integrates raw studio photoshoot artwork compressed to lightweight WebP format (~70KB-135KB per image, saving >94% payload size) alongside hard-coded, web-verified nutritional specifications, custom brand accent lighting, feature pills, and direct WhatsApp conversion CTAs (≥48px touch height).

---

## 1. What We Are Going to Do

List of files to be created, modified, or updated:

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `context/feature-specs/45-subphase-6.3-featured-products-showcase.md` | **[NEW]** | Canonical technical specification blueprint for Sub-Phase 6.3. |
| 2 | `public/feature-products/*.webp` | **[NEW]** | 4 compressed WebP photoshoot images (`biotech-pure-whey.webp`, `bpi-whey-hd.webp`, `on-gold-isolate.webp`, `muscleblaze-biozyme.webp`). |
| 3 | `src/components/home/featured-products-section.tsx` | **[NEW]** | Responsive 2x2 featured products banner showcase component. |
| 4 | `src/app/(marketing)/page.tsx` | **[MODIFY]** | Mount `<FeaturedProductsSection />` into Section 3 of the homepage layout shell. |
| 5 | `context/progress-tracker.md` | **[MODIFY]** | Update sub-phase tracking status to `[IN PROGRESS]` and log task details. |
| 6 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 45 in the specification registry index. |

---

## 2. Why We Are Doing This

1. **Brand Conversion & Social Proof:** Showcasing the 4 top-selling authentic supplement products on the homepage drives immediate trust and direct WhatsApp conversions.
2. **SEO & Performance:** Hard-coding verified product specifications in semantic HTML rather than baking text into images ensures crisp rendering at all screen pixel densities, complete screen reader accessibility (WCAG AA), and full indexing by search engine crawlers.
3. **Mobile-First Luxury Aesthetic:** Mobile viewports (<640px) stack cards 1-by-1 (`grid-cols-1`), retaining 16:9 aspect ratios and conversion touch targets ($\ge 48\text{px}$) while desktop viewports ($\ge 1024\text{px}$) display a side-by-side 2x2 grid layout with glowing ambient spotlight accents.
4. **Verified Nutritional Data:** Specifications use web-verified nutritional metrics (protein per serving, BCAAs, patented absorption formulas, gluten/palm oil-free claims) to guarantee 100% data accuracy.

---

## 3. How We Are Going to Implement It

### Step 1: Image Processing & WebP Assets

Processed raw studio PNG assets using Node.js `sharp` with 82% lossy WebP compression:
- `pure-whey.png` (2.02 MB) -> `public/feature-products/biotech-pure-whey.webp` (74.3 KB, 96.4% reduction)
- `bpi-sports-whey-hd.png` (2.23 MB) -> `public/feature-products/bpi-whey-hd.webp` (125.0 KB, 94.5% reduction)
- `optimum-nutrition.png` (2.54 MB) -> `public/feature-products/on-gold-isolate.webp` (134.8 KB, 94.8% reduction)
- `muscleblaze.png` (2.07 MB) -> `public/feature-products/muscleblaze-biozyme.webp` (69.4 KB, 96.7% reduction)

### Step 2: Component Architecture (`src/components/home/featured-products-section.tsx`)

Build `FeaturedProductsSection` as a Next.js Server Component featuring:
- **Header Section:** Eyebrow pill `"🔥 SHOP'S BEST-SELLERS"`, main heading `"FEATURED SUPPLEMENTS"`, and subtitle `"100% Genuine Importer Holograms • Verified Authentic Stock"`.
- **Responsive Grid:** `grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- **Banner Card Specs:**
  - **Card 1 (BioTechUSA 100% Pure Whey):**
    - Brand: `BIOTECHUSA NUTRITION`
    - Title: `NITROPURE 100% WHEY`
    - Subtitle: `21g Protein • 4.3g BCAAs • Enriched with Glutamine & Bromelain`
    - Badges: `GLUTEN FREE`, `PALM OIL FREE`, `PRESERVATIVE FREE`
    - Accent: Electric Cyan Spotlight (`from-cyan-950/40 to-black`)
    - CTA: Direct WhatsApp Order Link (`wa.me`) & Product Link `/products/biotech-100-pure-whey`.
  - **Card 2 (BPI Sports WHEY HD):**
    - Brand: `BPI SPORTS USA`
    - Title: `WHEY HD`
    - Subtitle: `25g Ultra-Premium Whey Matrix • 5g BCAAs • Chocolate Cookie`
    - Badges: `25G PROTEIN`, `CHOCOLATE COOKIE`, `ZERO AMINO SPIKING`
    - Accent: Amber & Electric Blue Spotlight (`from-amber-950/40 to-black`)
    - CTA: Direct WhatsApp Order Link & Product Link `/products/bpi-whey-hd`.
  - **Card 3 (ON Gold Standard 100% ISOLATE):**
    - Brand: `OPTIMUM NUTRITION`
    - Title: `GOLD STANDARD 100% ISOLATE`
    - Subtitle: `25g Pure Isolate • 5.5g BCAAs • Hydrolyzed & Ultra-Filtered`
    - Badges: `25G PURE ISOLATE`, `5.5G BCAAS`, `FAST ABSORPTION`
    - Accent: Metallic Gold Spotlight (`from-amber-900/30 via-slate-950 to-black`)
    - CTA: Direct WhatsApp Order Link & Product Link `/products/on-gold-standard-isolate`.
  - **Card 4 (MuscleBlaze Biozyme Performance Whey):**
    - Brand: `MUSCLEBLAZE INDIA`
    - Title: `BIOZYME PERFORMANCE WHEY`
    - Subtitle: `25g Protein • 5.51g BCAAs • Clinically Proven 50% Higher Absorption`
    - Badges: `PATENTED EAF™ FORMULA`, `INFORMED CHOICE TESTED`, `RICH CHOCOLATE`
    - Accent: Titanium & Platinum Spotlight (`from-slate-800/50 to-black`)
    - CTA: Direct WhatsApp Order Link & Product Link `/products/muscleblaze-biozyme-performance-whey`.

### Step 3: Homepage Integration (`src/app/(marketing)/page.tsx`)

Mount `<FeaturedProductsSection />` directly after `<BrandsMarquee />` in Section 3 of the homepage layout shell.

---

## 4. Required Data & Verification Sources

| Product Name | Verified Specifications Source | Key Claims Verified |
|---|---|---|
| BioTechUSA 100% Pure Whey | BioTechUSA Official & Labdoor | 21g Protein, 4.3g BCAAs, Bromelain, Gluten-Free, Palm Oil-Free |
| BPI Sports WHEY HD | BPI Sports Official & Sporter | 25g Protein, 5g BCAAs, Multi-Whey Matrix, Zero Amino Spiking |
| ON Gold Standard 100% Isolate | Optimum Nutrition Official | 25g Pure Isolate, 5.5g BCAAs, Hydrolyzed & Ultra-Filtered Whey Isolate |
| MuscleBlaze Biozyme Performance Whey | MuscleBlaze Official & Labdoor UK | 25g Protein, 5.51g BCAAs, Patented EAF™ 50% Higher Absorption |

---

## 5. Risk & Mitigation Plan

| Potential Risk | Prevention / Mitigation Strategy |
|---|---|
| **Text Overlap on Narrow Screens (<380px)** | Use responsive flex/grid layouts with `object-cover object-right` image positioning so text floats over gradient background space without obscuring tub artwork. |
| **Touch Target Violation on Buttons** | Enforce `min-h-[48px]` for conversion WhatsApp CTAs and `min-h-[44px]` for secondary navigation links. |
| **Image Loading Shifts (CLS)** | Use Next.js `<Image>` component with explicit `fill` and priority loading for above-the-fold assets. |

---

## 6. Verification Plan

1. **TypeScript Check:** Run `npx tsc --noEmit` to confirm 0 errors.
2. **Build Check:** Run `npm run build` to verify full SSG pre-rendering across all pages.
3. **Responsive Verification:** Audit viewports at 360px (mobile), 768px (tablet), and 1280px (desktop) ensuring zero layout overflow.
