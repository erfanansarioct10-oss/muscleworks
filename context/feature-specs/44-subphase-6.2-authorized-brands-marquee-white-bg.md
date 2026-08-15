# Specification 44: Sub-Phase 6.2 — Authorized Brands Marquee Section (White BG)

> **Status:** Approved & Active  
> **Sub-Phase:** `6.2`  
> **Target Files:**
> - `public/brands/*` [RENAME & COMPRESS]
> - `data/brands.json` [MODIFY]
> - `src/components/home/brands-marquee.tsx` [NEW]
> - `src/app/globals.css` [MODIFY]
> - `src/app/page.tsx` [MODIFY]
> - `context/progress-tracker.md` [MODIFY]
> - `context/feature-roadmap.md` [MODIFY]

---

## 1. Executive Summary & Business Intent

Sub-Phase 6.2 delivers the **Authorized Brands Marquee Section** (`src/components/home/brands-marquee.tsx`) mounted directly below the Hero Section on the homepage (`src/app/page.tsx`). 

The section presents all world-class supplement brands authorized and stocked at MuscleWorks Nepal (Optimum Nutrition, MuscleTech, Dymatize, MyProtein, BioTech USA, Scitec Nutrition, BPI Sports, MuscleBlaze, Kevin Levrone, Rule 1, Labrada, Cellucor, Universal, Scivation, Insane Labz, MusclePharm) in an infinite horizontal loop marquee animation with a crisp, clean white background.

---

## 2. Technical Requirements & Design Standards

### 2.1 Asset Optimization & Renaming
- **Raw Input Assets:** `public/brands/`
  - `BioTechUSA_logo.png`
  - `SCITEC_NUTRITION_acf79f8d-1afd-4b1a-b644-76be301f9660.webp`
  - `bpi.webp`
  - `muscleblaze.png`
  - `optimumnutrition.webp`
- **Output Target Assets:** Compressed WebP files stored at `public/brands/<slug>.webp`:
  - `biotech-usa.webp`
  - `scitec-nutrition.webp`
  - `bpi-sports.webp`
  - `muscleblaze.webp`
  - `optimum-nutrition.webp`
- **Quality & Compression Target:** 80–85% WebP quality, transparent background preserved where applicable, file size under 30 KB per logo. Raw uncompressed files removed.

### 2.2 Component Hierarchy & Layout Structure
- **Container:** Pure white section (`bg-white py-12 md:py-16 border-y border-slate-200/80 relative overflow-hidden`).
- **Header:**
  - Eyebrow line framing: `— OFFICIAL STOCKED BRANDS —` rendered with amber/gold lines on left & right.
  - Subtitle: *"Every product sealed, verified, and imported directly"*.
- **Marquee Loop Animation:**
  - Continuous CSS keyframe loop (`@keyframes marquee`) running horizontally across the section.
  - Mouse hover state pauses loop (`hover:[animation-play-state:paused]`).
- **Brand Cards:**
  - Rounded container (`bg-white border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-500/50 rounded-xl md:rounded-2xl p-4 sm:p-6 flex items-center justify-center min-w-[160px] sm:min-w-[200px] h-[90px] sm:h-[100px] transition-all duration-300`).
  - Next.js `<Image>` primitive with `src="/brands/[slug].webp"` and fallback text badge if logo loading.
- **Trust Pillars Footer:**
  - Bottom summary bar: `• 100% Authentic  |  • Official Importer Seals  |  • Verified Holograms  |  • No Fakes. Ever.`

---

## 3. Verification Plan

### 3.1 Static Type Check & Build Validation
- Run `npx tsc --noEmit` to confirm 0 TypeScript errors.
- Run `npm run build` to ensure static page pre-rendering succeeds.

### 3.2 Visual & Interaction Check
- Verify smooth marquee animation, white background, crisp WebP images, hover pause effect, and mobile responsiveness.
