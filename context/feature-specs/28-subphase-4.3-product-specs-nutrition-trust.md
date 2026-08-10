# Feature Spec 28: Sub-Phase 4.3 — Product Specifications, Nutrition Facts & Trust Elements

> **Spec ID:** `28-subphase-4.3-product-specs-nutrition-trust`  
> **Target Sub-Phase:** Sub-Phase 4.3 (`src/components/product/product-specs.tsx`, `src/components/product/nutrition-table.tsx`, `src/components/product/authenticity-guarantee-box.tsx`, `src/components/product/related-products.tsx`)  
> **Status:** Approved (In Progress)  
> **Created Date:** 2026-08-10  
> **Author:** AI Agent (Pair Programming with User)

---

## Executive Summary

Sub-Phase 4.3 completes the core information architecture, supplement transparency, and authenticity trust suite for the **Product Detail Page (PDP)**:
1. **`NutritionTable` (`src/components/product/nutrition-table.tsx`):** Top macronutrient summary cards (Protein per scoop, Servings per container, Calories, BCAAs) coupled with a responsive detailed micro-nutrients & daily values breakdown table.
2. **`ProductSpecs` (`src/components/product/product-specs.tsx`):** A clean mobile-first Tabbed / Accordion interface organizing "Nutrition Facts", "Usage & Ingredients", and "Authenticity Guarantee" to maximize scannability without overwhelming vertical scroll length.
3. **`AuthenticityGuaranteeBox` (`src/components/product/authenticity-guarantee-box.tsx`):** Branded trust container showcasing official importer hologram verification, 100% money-back guarantee, scratch-code verification steps, and a direct "Verify Authenticity on WhatsApp" CTA button.
4. **`RelatedProducts` (`src/components/product/related-products.tsx`):** Intelligent cross-selling supplement carousel/grid prioritizing products from the same category or brand, complete with full `ProductCard` previews and direct WhatsApp quick-order actions.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/product/nutrition-table.tsx` | **[NEW]** | Displays macronutrient summary metric highlight cards and a detailed nutrition facts table for ingredients & daily values. |
| 2 | `src/components/product/product-specs.tsx` | **[NEW]** | Accessible Tabbed/Accordion container organizing Product Highlights, Nutrition Facts, Usage & Directions, Ingredients, and Authenticity Verification. |
| 3 | `src/components/product/authenticity-guarantee-box.tsx` | **[NEW]** | Interactive authenticity trust box detailing importer hologram seals, scratch code checks, money-back guarantee, and WhatsApp verification CTA. |
| 4 | `src/components/product/related-products.tsx` | **[NEW]** | Responsive recommendation engine rendering up to 4 related supplements matched by category or brand with WhatsApp order integration. |

---

## 2. Why We Are Doing This

1. **Supplement Transparency & Nutritional Accuracy:** Fitness enthusiasts in Nepal evaluate supplements based on protein yield per scoop, servings per tub, and amino acid profiles (BCAAs). Clear metric cards eliminate guesswork.
2. **Combatting Counterfeits in Nepal:** Fake supplements are a major concern in the local market. Providing detailed authenticity verification instructions, authorized Nepal importer hologram details, and a dedicated WhatsApp authenticity inquiry link creates immediate buyer trust.
3. **Enhanced Mobile Scannability:** Presenting dense nutritional tables and usage directions inside accessible tabs or accordion panels keeps the PDP UI compact, digestible, and fast on mobile devices.
4. **Increased Average Order Value (Cross-Selling):** Showing complementary products (e.g. Creatine or Pre-Workout alongside Whey Protein) encourages stack orders via WhatsApp.

---

## 3. How We Are Going to Implement It

### Step 1: `NutritionTable` Component (`src/components/product/nutrition-table.tsx`)
- **Props:** `nutritionFacts: NutritionFacts`, `className?: string`
- **Top Metric Cards:** 4-column responsive grid displaying key macro callouts:
  - **Protein per Serving:** e.g., `24g`
  - **Servings per Container:** e.g., `74`
  - **Calories per Serving:** e.g., `120 kcal`
  - **BCAAs / Leucine:** e.g., `5.5g`
- **Detailed Table:** Responsive, alternating row styling displaying `name`, `amountPerServing`, and optional `dailyValuePercentage` (e.g., Sodium 130mg [6% DV], Calcium 140mg [10% DV]).

### Step 2: `AuthenticityGuaranteeBox` Component (`src/components/product/authenticity-guarantee-box.tsx`)
- **Props:** `authenticity: AuthenticityMetadata`, `productName: string`, `className?: string`
- **Content & Layout:**
  - Shield / Checkmark icon in Metallic Gold & Emerald Green.
  - Heading: "100% Genuine & Authentic Guarantee".
  - Importer hologram seal information (e.g., *Authorized Nepal Importer Seal: Redington / ShapeUp / Universal*).
  - 3-step verification guide (1. Check Hologram Sticker -> 2. Scratch Unique Security Code -> 3. SMS/Web Verify).
  - "Verify Authenticity via WhatsApp" button with pre-filled message generator via `buildAuthenticityInquiryWhatsAppUrl`.

### Step 3: `ProductSpecs` Component (`src/components/product/product-specs.tsx`)
- **Props:** `product: Product`, `className?: string`
- **Tab / Accordion Layout:** Uses Radix Tabs or CVA tab switcher:
  - **Tab 1: Nutrition & Highlights:** Renders `<NutritionTable />` and bulleted product highlights list.
  - **Tab 2: Usage & Ingredients:** Detailed `directions` (e.g., *Mix 1 scoop with 200-250ml water*), `ingredients` list, and allergen callouts.
  - **Tab 3: Authenticity Trust:** Renders `<AuthenticityGuaranteeBox />`.

### Step 4: `RelatedProducts` Component (`src/components/product/related-products.tsx`)
- **Props:** `currentProduct: Product`, `className?: string`
- **Data Fetching / Filtering:** Filter dataset for products where `id !== currentProduct.id` and (`categoryId === currentProduct.categoryId` || `brandId === currentProduct.brandId`), sliced to top 4 products.
- **Rendering:** Section heading ("Complete Your Fitness Stack"), subhead, and responsive `<ProductGrid />` rendering `<ProductCard />` instances.

---

## 4. Execution Timeline & Validation

```text
Phase 1: Implement NutritionTable (src/components/product/nutrition-table.tsx)
    │
    ▼
Phase 2: Implement AuthenticityGuaranteeBox (src/components/product/authenticity-guarantee-box.tsx)
    │
    ▼
Phase 3: Implement ProductSpecs Tab Container (src/components/product/product-specs.tsx)
    │
    ▼
Phase 4: Implement RelatedProducts (src/components/product/related-products.tsx)
    │
    ▼
Phase 5: Programmatic Validation & TypeScript Check (`npx tsc --noEmit`)
```

---

## 5. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero errors.
2. Macro highlight cards display clearly across mobile (<640px) and desktop viewports.
3. Authenticity box WhatsApp button generates valid inquiry URLs using `buildAuthenticityInquiryWhatsAppUrl`.
4. Related products filter out the current product and correctly select category/brand matches.
5. All buttons and interactive tabs enforce ≥44px touch targets.
6. `npm run build` succeeds cleanly.
