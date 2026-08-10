# Feature Spec 20: Sub-Phase 3.1 — Product Display Components (Card, Grid & Badges)

> **Spec ID:** `20-subphase-3.1-product-display-components`  
> **Target Sub-Phase / Branch:** `Sub-Phase 3.1` (Phase 3 — Catalog, Search & Filtering)  
> **Status:** Approved  
> **Created Date:** 2026-08-10  
> **Author:** AI Agent (Antigravity)

---

## Executive Summary

Sub-Phase 3.1 builds the core visual product display system for MuscleWorks Supplements Nepal. It implements three reusable React Server / Client components:
1. `ProductAuthenticityBadge` (`src/components/product/product-authenticity-badge.tsx`): Polymorphic CVA component featuring 3 layout variants (`compact` overlay pill, `default` inline shield badge, `card` PDP trust box).
2. `ProductCard` (`src/components/product/product-card.tsx`): Minimal Premium Luxury catalog card featuring high-resolution image optimization, brand tag, title, NPR price formatting with strikethrough original price & discount %, variant count chip (`4 Flavors • 2 Sizes`), stock status pill, full-card navigation link to `/products/[slug]`, and direct stop-propagation WhatsApp quick-order CTA button (≥48px touch target).
3. `ProductGrid` (`src/components/product/product-grid.tsx`): Responsive product layout container (2 columns on mobile `<640px`, 3 columns on tablet `sm:`, 4 columns on desktop `lg:`), including `ProductGridSkeleton` skeleton loading state and `ProductGridEmpty` zero-match state.

---

## 1. What We Are Going to Do

List of files to create and modify:

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/product/product-authenticity-badge.tsx` | **[NEW]** | CVA badge component with `compact`, `default`, and `card` variants for 100% Genuine Importer Seals. |
| 2 | `src/components/product/product-card.tsx` | **[NEW]** | Interactive product card with Next.js image, pricing, badges, card navigation, and WhatsApp quick CTA. |
| 3 | `src/components/product/product-grid.tsx` | **[NEW]** | Responsive 2/3/4 column grid container with skeleton grid loader and customizable empty state. |
| 4 | `context/feature-specs/20-subphase-3.1-product-display-components.md` | **[NEW]** | Technical specification blueprint (this document). |
| 5 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 20 in specification registry index. |
| 6 | `context/progress-tracker.md` | **[MODIFY]** | Set Sub-Phase 3.1 status to `[IN PROGRESS]` and record session notes. |

---

## 2. Why We Are Doing This

1. **Project Architecture Alignment (`project-architecture.md` & `data-models.md`):**
   - Renders canonical `Product`, `ProductVariant`, and `AuthenticityMetadata` data models validated by Zod schemas (`src/lib/validations/product.ts`).
   - Integrates `formatNprPrice()` and `calculateDiscountPercentage()` helpers (`src/lib/utils.ts`).
2. **Mobile-First & Touch Compliance (`coding-standards.md`):**
   - Enforces 2-column mobile layout (`grid-cols-2` <640px) with touch-friendly spacing and zero horizontal overflow on 360px viewports.
   - Enforces ≥48x48px touch target for the inline WhatsApp quick-order CTA button on product cards (`min-h-12 min-w-12`).
3. **Design System & Theme Integration (`AGENTS.md` & Spec 13):**
   - Applies Minimal Premium Luxury theme tokens: Jet Black (`#0B0B0B`), Metallic Gold (`#D4AF37`), Pure White (`#FFFFFF`), Silver Gray (`#F5F5F5`), and Neutral Gray borders (`border-neutral-800`).

---

## 3. How We Are Going to Implement It

### Step 1: `ProductAuthenticityBadge` Component
- Location: `src/components/product/product-authenticity-badge.tsx`
- Polymorphic variants using Class Variance Authority (CVA):
  - `compact`: Small overlay pill for card images (`bg-black/80 backdrop-blur text-gold border border-gold/40 text-xs px-2 py-0.5`).
  - `default`: Standard inline badge with `ShieldCheck` icon (`bg-gold/10 text-gold-light border border-gold/30 rounded-md text-xs px-2.5 py-1`).
  - `card`: Full trust card for Product Detail Pages (PDP) with metallic gold gradient border, shield icon, manufacturer importer verification text, and scratch code hint.

### Step 2: `ProductCard` Component
- Location: `src/components/product/product-card.tsx`
- Props: `product: Product`, `priorityImage?: boolean`, `className?: string`.
- Structure:
  - **Container**: Card wrapped in `<Link href={`/products/${product.slug}`}>` with hover elevation (`hover:border-gold/50 transition-all duration-300`).
  - **Image Container**: Aspect ratio square (`aspect-square`), Next.js `<Image>` with `sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"`, smooth scale on hover (`group-hover:scale-105 transition-transform duration-500`).
  - **Top Badges**:
    - Top-Left: Bestseller / Genuine Importer Seal / Discount % badge (`badge.tsx`).
    - Top-Right: Stock status indicator (`in_stock` emerald dot, `low_stock` gold dot, `out_of_stock` gray dot).
  - **Content Body**:
    - Brand name uppercase text (`text-xs font-semibold tracking-wider text-neutral-400`).
    - Product title (`font-bold text-sm sm:text-base text-white line-clamp-2`).
    - Variant summary chip (`text-xs text-neutral-400 font-medium`: e.g. `4 Flavors • 2 Sizes`).
    - Pricing row: NPR formatted default variant price (`formatNprPrice(defaultVariant.discountPriceNpr || defaultVariant.priceNpr)`), original strikethrough price if discounted, and discount percentage badge.
  - **Quick Action CTA**:
    - WhatsApp Quick Order icon button at bottom-right (`min-h-12 min-w-12` / `48x48px`), using `buildProductWhatsAppUrl({ product })`.
    - Fires `e.stopPropagation()` and `e.preventDefault()` to open WhatsApp in a new tab without triggering card navigation.

### Step 3: `ProductGrid` & States
- Location: `src/components/product/product-grid.tsx`
- Grid container: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6`.
- Components:
  - `ProductGrid`: Maps list of products to `ProductCard`.
  - `ProductGridSkeleton`: Renders 4-8 skeleton loader cards (`skeleton.tsx`).
  - `ProductGridEmpty`: Displays sleek luxury zero-match fallback with search icon, "No products found", and clear filters CTA.

---

## 4. When We Are Going to Do It

```text
Step 1: Authored Spec 20 & Registered in Spec Index
    │
    ▼
Step 2: User Approval Gate (Mandatory Pause)
    │
    ▼
Step 3: Implement ProductAuthenticityBadge (src/components/product/product-authenticity-badge.tsx)
    │
    ▼
Step 4: Implement ProductCard (src/components/product/product-card.tsx)
    │
    ▼
Step 5: Implement ProductGrid & States (src/components/product/product-grid.tsx)
    │
    ▼
Step 6: Verification Gate (npx tsc --noEmit & Mobile Touch Check)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| `Product` & `ProductVariant` | `src/lib/validations/product.ts` | Type definitions for card props |
| Catalog Accessors | `src/lib/data/products.ts` | Product retrieval for page displays |
| Price & Discount Helpers | `src/lib/utils.ts` | `formatNprPrice`, `calculateDiscountPercentage` |
| WhatsApp URL Engine | `src/lib/constants.ts` & `wa.me` builder | Pre-filled quick WhatsApp order action |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Nested Link Navigation Bug** | Placing `<button>` or `<a>` inside parent `<Link>` triggers React DOM nesting error. | Use standard `<button>` with `e.preventDefault()` and `e.stopPropagation()` for WhatsApp CTA, calling `window.open(url, '_blank')`. |
| **Mobile Image Shift (CLS)** | Unsized dynamic images causing layout shift on grid render. | Enforce fixed `aspect-square` container with `fill` and optimized `sizes` prop on Next `<Image>`. |
| **Small Touch Target on WhatsApp CTA** | Icon button smaller than 48px on mobile viewports. | Set `min-h-12 min-w-12` (48x48px) explicitly on WhatsApp quick-action button. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero errors.
2. `ProductCard`, `ProductGrid`, and `ProductAuthenticityBadge` export properly without missing dependency or prop errors.
3. Mobile layout verified at 360px and 390px viewports (2 columns, zero horizontal scroll).
4. WhatsApp CTA button satisfies min touch target ≥48x48px and opens pre-filled order message without executing parent card navigation.
