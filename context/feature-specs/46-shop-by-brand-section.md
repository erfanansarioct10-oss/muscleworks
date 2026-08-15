# Feature Spec 46: Shop by Brand Section

> **Spec ID:** `46-shop-by-brand-section`  
> **Target Sub-Phase / Branch:** `section-4` / Sub-Phase 6.4 (Homepage Showcase Assembly)  
> **Status:** Approved  
> **Created Date:** 2026-08-12  
> **Author:** Antigravity AI

---

## Executive Summary

Build a high-performance, dark luxury "Shop by Brand" interactive horizontal showcase section for the MuscleWorks homepage (`src/app/page.tsx`), mounted directly below the `<FeaturedProductsSection />`.

The section showcases 5 premier supplement brands imported into Nepal (Optimum Nutrition, BioTech USA, Scitec Nutrition, BPI Sports, MuscleBlaze), styled with a premium dark luxury obsidian aesthetic (`bg-[#0B0B0B]`). It features top color-accent borders matching brand identity colors, blank image placeholders for future visual assets, brand display names, one-line taglines, thin dividers, dynamic product counts, and brand-tinted `Browse →` CTA navigation buttons.

---

## 1. What We Are Going to Do

List of files to be created or modified:

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/home/shop-by-brand-section.tsx` | **[NEW]** | Interactive Client Component for the horizontal brand card carousel with scroll sync pip dots. |
| 2 | `src/app/page.tsx` | **[MODIFY]** | Mount `<ShopByBrandSection />` directly below `<FeaturedProductsSection />`. |
| 3 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 46 in the Feature Specification Registry index. |
| 4 | `context/progress-tracker.md` | **[MODIFY]** | Log implementation progress and session notes for Sub-Phase 6.4 assembly. |

---

## 2. Why We Are Doing This

1. **Project Standards Alignment:** Fulfills homepage brand discovery requirements per [`context/project-overview.md`](../project-overview.md) and [`context/coding-standards.md`](../coding-standards.md), allowing customers to navigate directly to authorized importer brand archives (`/brands/[slug]`).
2. **Mobile-First & Touch Usability:** Ensures smooth horizontal swiping on mobile viewports (<640px) displaying 1.5 cards for intuitive swipe discovery, 3 cards on tablet (640px-1023px), and all 5 cards visible on desktop (≥1024px). All conversion CTAs meet minimum touch target standards (≥48x48px).
3. **Dark Luxury Aesthetics:** Matches MuscleWorks dark obsidian aesthetic (`bg-[#0B0B0B]`), gold eyebrow labels (`#C8A848`), 3px brand top borders, custom dynamic hover lifts (`translateY(-3px)`), and brand-tinted box-shadow glow effects.

---

## 3. How We Are Going to Implement It

### Step 1: Brand Data Definition & Color Map

Define canonical brand card specifications:

```typescript
export interface ShopBrandCard {
  id: string;
  name: string;
  slug: string;
  color: string;
  tagline: string;
  productCount: number;
}

const SHOP_BRANDS: ShopBrandCard[] = [
  {
    id: "brand_optimum_nutrition",
    name: "Optimum Nutrition",
    slug: "optimum-nutrition",
    color: "#C8A848",
    tagline: "World leader in sports nutrition & Gold Standard Whey",
    productCount: 3,
  },
  {
    id: "brand_biotech_usa",
    name: "BioTech USA",
    slug: "biotech-usa",
    color: "#E82020",
    tagline: "Premier European sports nutrition & Iso Whey Zero",
    productCount: 2,
  },
  {
    id: "brand_scitec_nutrition",
    name: "Scitec Nutrition",
    slug: "scitec-nutrition",
    color: "#F07A14",
    tagline: "European powerhouse famous for 100% Whey Professional",
    productCount: 2,
  },
  {
    id: "brand_bpi_sports",
    name: "BPI Sports",
    slug: "bpi-sports",
    color: "#3B82F6",
    tagline: "USA engineered Best BCAA & ISO HD formulas",
    productCount: 2,
  },
  {
    id: "brand_muscleblaze",
    name: "MuscleBlaze",
    slug: "muscleblaze",
    color: "#FF5C2A",
    tagline: "Lab-certified Biozyme Whey & high-potency formulas",
    productCount: 2,
  },
];
```

### Step 2: Scroll State & Interactive Pip Dots

Attach `onScroll` listener to horizontal scroll container `scrollRef`:
- Calculate active index: `Math.round(container.scrollLeft / (cardWidth + gap))`
- Provide `scrollToIndex(index)` helper allowing users to click pip dots to scroll smoothly.

### Step 3: Card Component Layout & Styling

- **Top Border:** `border-t-[3px]` styled dynamically with `brand.color`.
- **Blank Image Zone:** `h-36 sm:h-40 bg-slate-950/70 border-b border-slate-800/60 rounded-t-lg relative overflow-hidden flex items-center justify-center`.
- **Brand Title:** `font-heading font-black text-xl sm:text-2xl text-white uppercase tracking-tight`.
- **Tagline:** `text-xs text-slate-400 font-medium line-clamp-1`.
- **Divider:** `border-t border-slate-800/80 my-3 sm:my-4`.
- **Footer CTA:** Product count on left, `Browse →` link on right with text color matching `brand.color` and touch target ≥48px.
- **Hover State:** `hover:-translate-y-1 hover:shadow-xl` with brand color glow backdrop filter.

---

## 4. When We Are Going to Do It

```text
Phase 1: Component Scaffold & Brand Metadata Map
    │
    ▼
Phase 2: Interactive Client Component & Scroll Pip Engine
    │
    ▼
Phase 3: Homepage Integration & Layout Verification
    │
    ▼
Phase 4: Responsive Audit (360px, 390px, 768px, 1280px) & Touch Check
    │
    ▼
Phase 5: Type Check & Documentation Sync
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Brand Profiles & Slugs | `data/brands.json` | Slugs (`/brands/[slug]`), brand names |
| Brand Color Map | User Specification | Signature hex codes (`#C8A848`, `#E82020`, `#F07A14`, `#3B82F6`, `#FF5C2A`) |
| Product Catalog Accessor | `src/lib/data/products.ts` | Dynamic product count per brand |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Scroll Pip Out of Sync** | `scrollLeft` calculation drift on different screen widths. | Clamp active index between `0` and `4` and recalculate on scroll events with `requestAnimationFrame`. |
| **Touch Target Violation** | Small CTA link text (<44px height). | Wrap card link container or CTA link in `min-h-[48px] flex items-center`. |
| **Layout Shift on Image Drop-in** | Flexible image zone height. | Enforce fixed height `h-36 sm:h-40` for blank image zone container. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. Section header renders eyebrow `Browse our range`, title `Shop by Brand`, and subtitle `Premium brands · Official imports · Authenticated stock`.
3. Horizontal carousel displays 5 equal cards on desktop (lg), 3 cards on tablet (md), and 1.5 cards on mobile with touch swipe snapping.
4. Active scroll pip dot updates smoothly on horizontal scroll and responds to clicks.
5. Card top border and `Browse →` CTA use exact hex colors per brand map.
6. Hover state lifts card 3px with brand color border glow.
7. Mounted cleanly on `/` below `<FeaturedProductsSection />`.
