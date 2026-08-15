# Feature Spec 27: Sub-Phase 4.2 — Product Gallery & Interactive Variant Selectors

> **Spec ID:** `27-subphase-4.2-product-gallery-variant-selector`  
> **Target Sub-Phase:** Sub-Phase 4.2 (`src/components/product/product-gallery.tsx`, `src/components/product/product-variant-selector.tsx`, `src/components/product/product-stock-status.tsx`)  
> **Status:** Approved (Completed)  
> **Created Date:** 2026-08-10  
> **Author:** AI Agent (Pair Programming with User)

---

## Executive Summary

Sub-Phase 4.2 builds the core interactive UI components for the **Product Detail Page (PDP)**:
1. **`ProductGallery` (`src/components/product/product-gallery.tsx`):** Responsive image gallery featuring an aspect-square main image view, thumbnail navigation grid/carousel, authentic importer hologram seal overlay, and an accessible full-screen image Lightbox modal built on Radix Dialog.
2. **`ProductVariantSelector` (`src/components/product/product-variant-selector.tsx`):** Interactive flavor chip pills and size/weight option cards that dynamically update active price, discount percentage savings, SKU, and stock availability.
3. **`ProductStockStatus` (`src/components/product/product-stock-status.tsx`):** Multi-state stock badge (`in_stock`, `low_stock`, `out_of_stock`, `pre_order`) highlighting Golfutar flagship outlet inventory availability and low-stock urgency counters.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/product/product-gallery.tsx` | **[NEW]** | Interactive product image gallery with main preview, thumbnail selection, importer seal overlay, and Radix Dialog lightbox zoom modal. |
| 2 | `src/components/product/product-variant-selector.tsx` | **[NEW]** | Flavor & size variant selector UI with price updates, savings callouts, and out-of-stock disabled states. |
| 3 | `src/components/product/product-stock-status.tsx` | **[NEW]** | Multi-state inventory status indicator pill with animated status pulse and Golfutar flagship store location copy. |

---

## 2. Why We Are Doing This

1. **High Visual Confidence & Authenticity:** Supplement buyers in Nepal want to inspect packaging details, importer hologram seals, and original seals. A high-res gallery with lightbox zoom provides 100% transparency.
2. **Dynamic Variant Conversion:** Products like Whey Protein come in multiple flavors (Double Rich Chocolate, Vanilla, Extreme Milk Chocolate) and sizes (2 lbs, 5 lbs). Clear, responsive selectors prevent ordering errors and allow buyers to compare prices per size easily.
3. **Store Location Trust:** Highlighting stock availability at our physical **Golfutar, Budha-Nilkantha** store reassures local buyers who prefer store pick-up or fast same-day delivery.

---

## 3. How We Are Going to Implement It

### Step 1: `ProductGallery` Component (`src/components/product/product-gallery.tsx`)
- Props: `images: ImageAsset[]`, `productName: string`, `authenticity: AuthenticityMetadata`
- State: `selectedIndex: number`, `isLightboxOpen: boolean`
- Features:
  - Main image container with `aspect-square`, `relative`, `rounded-2xl`, overflow hidden, and sleek metallic border.
  - Authentic Importer Hologram Seal overlay pill at top-left (`ProductAuthenticityBadge` variant="compact").
  - Zoom trigger button overlay at top-right allowing full-screen modal view.
  - Horizontal thumbnail row with active gold/obsidian focus ring and `min-h-[44px]` touch target per thumbnail.
  - Lightbox modal using Radix `Dialog` with previous/next controls, image counter ("1 of 4"), and close button.

### Step 2: `ProductVariantSelector` Component (`src/components/product/product-variant-selector.tsx`)
- Props:
  - `variants: ProductVariant[]`
  - `selectedVariantId: string`
  - `onVariantChange: (variant: ProductVariant) => void`
- Group variants by unique `flavor` and unique `sizeOrWeight`.
- Render:
  1. **Flavor Selector:** Horizontal scroll/wrap of flavor chip pills (e.g., *Double Rich Chocolate*, *Vanilla Ice Cream*). Out-of-stock flavors visually dimmed with strikethrough.
  2. **Size / Weight Selector:** Card buttons displaying container size (e.g., *5 lbs / 2.27 kg*), active price (`formatNprPrice(priceNpr)`), and discount badge (`Save 12%`).
- Touch targets: All variant chips and cards enforce `min-h-[44px]` touch targets.

### Step 3: `ProductStockStatus` Component (`src/components/product/product-stock-status.tsx`)
- Props: `stockStatus: StockStatus`, `inStockQuantity?: number`, `className?: string`
- Status mappings:
  - `in_stock`: Emerald green pulsing indicator dot + "In Stock at Golfutar Store & Kathmandu Warehouse"
  - `low_stock`: Amber gold pulsing dot + "Low Stock: Only X left at Golfutar store"
  - `out_of_stock`: Rose red dot + "Out of Stock — Pre-Order via WhatsApp"
  - `pre_order`: Sky blue dot + "Pre-Order — Express delivery in 5–7 days"

---

## 4. Execution Timeline

```text
Phase 1: Implement ProductStockStatus (src/components/product/product-stock-status.tsx)
    │
    ▼
Phase 2: Implement ProductVariantSelector (src/components/product/product-variant-selector.tsx)
    │
    ▼
Phase 3: Implement ProductGallery with Radix Lightbox (src/components/product/product-gallery.tsx)
    │
    ▼
Phase 4: Programmatic Validation & TypeScript Check (`npx tsc --noEmit`)
```

---

## 5. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero errors.
2. Mobile touch targets for all flavor pills and size cards meet ≥44px height.
3. Radix Dialog Lightbox opens smoothly and closes on `Escape` or backdrop click.
4. Stock status correctly reflects all 4 inventory states (`in_stock`, `low_stock`, `out_of_stock`, `pre_order`).
5. `npm run build` succeeds cleanly.
