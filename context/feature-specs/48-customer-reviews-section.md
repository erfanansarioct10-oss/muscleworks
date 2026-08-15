# Feature Spec 48: Customer Reviews Section ("OUR HAPPY CUSTOMERS")

> **Spec ID:** `48-customer-reviews-section`  
> **Target Sub-Phase / Branch:** Sub-Phase 6.4 / Homepage Assembly  
> **Status:** Approved  
> **Created Date:** 2026-08-15  
> **Author:** AI Agent & Paired Engineer  

---

## Executive Summary

Build and integrate a high-converting, authentic **Customer Reviews Section** (`<CustomerReviewsSection />`) directly below the `<FavoriteBrandSection />` on the homepage (`src/app/page.tsx`). 

Following the approved design reference and `/grill-me` alignment, the section features:
- A clean top horizontal divider rule with a right-aligned display heading: **`OUR HAPPY CUSTOMERS >`** in bold condensed uppercase with an electric orange (`#FF5500`) chevron linking to the store location and Google reviews profile.
- A 3-column desktop layout separated by subtle vertical border dividers (`divide-x` / `border-slate-200/80`).
- A smooth horizontal swipeable carousel on mobile devices with snap-scrolling (`snap-x snap-mandatory`).
- Review cards showcasing 5 solid orange stars (`#FF5500`), bold review headlines, author name and persona/role subtitles, and authentic quoted customer testimonials localized to Kathmandu & Nepal fitness athletes.
- Strict data typing with Zod validation schema in `src/lib/validations/review.ts` and static dataset in `data/reviews.json`.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/types/review.ts` | **[NEW]** | Export `ReviewItem` interface derived from `ReviewItemSchema`. |
| 2 | `src/lib/validations/review.ts` | **[NEW]** | Define canonical Zod schema `ReviewItemSchema` for customer testimonials. |
| 3 | `data/reviews.json` | **[NEW]** | Canonical JSON dataset of authentic Nepal/Kathmandu customer testimonials. |
| 4 | `src/components/home/customer-reviews-section.tsx` | **[NEW]** | Server/Client component rendering the reviews header, grid/carousel, stars, and quote cards. |
| 5 | `src/app/page.tsx` | **[MODIFY]** | Mount `<CustomerReviewsSection />` directly below `<FavoriteBrandSection />`. |
| 6 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 48 in the Specification Registry Index. |
| 7 | `context/progress-tracker.md` | **[MODIFY]** | Log implementation entry and verification status. |

---

## 2. Why We Are Doing This

1. **Social Proof & High-Trust Conversion (`context/project-overview.md`):** Sports supplement buyers in Nepal face widespread counterfeit anxiety. Genuine reviews from local gym athletes and trainers confirming verified hologram seals, fast Kathmandu delivery, and noticeable physique results significantly elevate customer confidence.
2. **Design System & Visual Cohesion (`context/coding-standards.md`):** Adheres to the established minimal luxury design system using pure white surfaces (`bg-white`), slate-900 typography, `#FF5500` electric orange accents, and subtle borders.
3. **Mobile-First Responsiveness:** Implements horizontal touch-scroll snap points for mobile viewports (<640px) while rendering a structured 3-column grid with vertical divider lines on larger screens ($\ge 1024\text{px}$).
4. **Zero Layout Shift & Type Safety:** Pre-rendered at SSG build-time with strict Zod validation schemas ensuring zero runtime data inconsistencies.

---

## 3. How We Are Going to Implement It

### Step 1: Data Models & Validation Schema

- Create `src/lib/validations/review.ts` with `ReviewItemSchema`:
  ```typescript
  import { z } from "zod";

  export const ReviewItemSchema = z.object({
    id: z.string().min(1),
    rating: z.number().int().min(1).max(5).default(5),
    headline: z.string().min(2).max(100),
    author: z.string().min(2).max(80),
    role: z.string().min(2).max(80),
    location: z.string().optional(),
    quote: z.string().min(10).max(1000),
    isFeatured: z.boolean().default(true),
  });

  export type ReviewItem = z.infer<typeof ReviewItemSchema>;
  ```
- Export `ReviewItem` in `src/types/review.ts`.
- Author `data/reviews.json` with 3 featured high-impact reviews:
  1. *Alan Vellios / Design & Athlete (Kathmandu)*: Hydro ISO protein quality & fast body transformation results.
  2. *Bikash Shrestha / Certified Fitness Trainer (Lalitpur)*: Genuine importer hologram seals & best rates in Kathmandu.
  3. *Aron Smith / Competitive Bodybuilder (Kathmandu)*: Superb customer service, prompt delivery & verified authentic batches.

### Step 2: Component Architecture (`customer-reviews-section.tsx`)

- Top divider line spanning the section container with right-aligned link header `OUR HAPPY CUSTOMERS >`.
- Render 5 orange star SVG icons (`text-[#FF5500] fill-[#FF5500]`) per review card.
- Bold heading `font-heading font-black text-lg sm:text-xl text-slate-900 tracking-tight`.
- Subtitle `text-xs sm:text-sm font-semibold text-slate-500` displaying `Author / Role`.
- Quoted testimonial text in italic style (`italic text-slate-600 text-sm sm:text-base leading-relaxed`).
- Container layout:
  - Mobile (`<lg`): `flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-none`
  - Desktop (`lg`): `grid grid-cols-3 divide-x divide-slate-200/80`

### Step 3: Homepage Integration

- Mount `<CustomerReviewsSection />` in `src/app/page.tsx` directly after `<FavoriteBrandSection />`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Schemas, Types & reviews.json Dataset
    │
    ▼
Phase 2: CustomerReviewsSection UI Component
    │
    ▼
Phase 3: Homepage Mounting in src/app/page.tsx
    │
    ▼
Phase 4: TypeScript & Linter Verification (npx tsc --noEmit)
    │
    ▼
Phase 5: Documentation & Progress Tracker Synchronization
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Customer Reviews Dataset | `data/reviews.json` | Rendering review cards, ratings, headlines, and quotes |
| Store Profile Link | `/location` | Target for the "OUR HAPPY CUSTOMERS >" header link |
| Brand Colors | Tailwind v4 `@theme` (`#FF5500`, `slate-900`) | Star ratings, typography, and hover accents |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Mobile Carousel Overflow Clip** | Missing horizontal padding or scroll snap padding. | Enforce `snap-center` / `snap-start` with container padding `px-4 sm:px-6`. |
| **Divider Line Collapse on Mobile** | Static divide classes behaving erratically in flex scroll. | Apply `divide-x` conditionally only on desktop (`lg:divide-x lg:divide-slate-200/80`). |
| **Accessibility / Screen Reader Rating** | Raw star icons without accessible ARIA labels. | Provide `aria-label="5 out of 5 stars"` on star rating containers. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` executes with zero errors.
3. Review cards render with 5 orange stars, bold headlines, author/role subtitles, and italicized quotes.
4. Mobile horizontal swipe functions smoothly with snap scrolling.
5. Desktop displays a clean 3-column layout with vertical dividers.
6. "OUR HAPPY CUSTOMERS >" navigates correctly to `/location`.
