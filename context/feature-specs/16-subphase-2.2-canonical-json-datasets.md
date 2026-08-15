# Feature Spec 16: Sub-Phase 2.2 — Canonical JSON Datasets (Products, Categories & Brands)

> **Spec ID:** `16-subphase-2.2-canonical-json-datasets`  
> **Target Sub-Phase / Branch:** Sub-Phase 2.2 (`Phase-2` branch)  
> **Status:** Completed  
> **Created Date:** 2026-08-09  
> **Author:** AI Assistant  

---

## Executive Summary

Sub-Phase 2.2 authors the primary static JSON datasets (`data/categories.json`, `data/brands.json`, `data/products.json`) for the MUSCLEWORKS SUPPLEMENTS e-commerce application. These canonical datasets form the physical product catalog available at the Golfutar, Budha-Nilkantha flagship retail store and online delivery across Nepal. Every JSON file strictly conforms to the Zod validation schemas implemented in Sub-Phase 2.1 (`src/lib/validations/product.ts` and `src/lib/validations/common.ts`).

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `data/categories.json` | **[NEW]** | Define 6 core categories (`proteins`, `creatine`, `mass-gainers`, `pre-workout`, `vitamins-health`, `amino-bcaa`) with Lucide icons, descriptions, FAQs, and SEO metadata. |
| 2 | `data/brands.json` | **[NEW]** | Define 10 authorized global supplement brands imported in Nepal with origin, official distributor info, verification guides, and SEO metadata. |
| 3 | `data/products.json` | **[NEW]** | Author 15+ authentic supplements with variants, integer NPR prices, 4-state stock statuses, full nutrition facts, authenticity metadata, FAQs, and SEO schemas. |

---

## 2. Why We Are Doing This

1. **Zero Runtime Drift & Zod Safety:** The static JSON data drives the static site generation (SSG) and accessor functions. Strict Zod compliance prevents build-time prerendering failures and client-side runtime errors.
2. **Authenticity Guarantee in Nepal Market:** Supplement buyers in Nepal are highly concerned with counterfeits. Each product and brand record includes explicit official importer information (e.g. Muscle House Nepal, Radiant Traders), scratch-code verification guides, and hologram seal descriptions.
3. **Realistic Nepal NPR Pricing & Stock:** Prices are positive integers denominated strictly in Nepalese Rupees (NPR) with realistic market values and variant options (e.g., 2 lbs, 5 lbs, 250g, 300g, 60 servings).

---

## 3. How We Are Going to Implement It

### Step 1: `data/categories.json`
Define 6 categories matching `CategorySchema`:
- `cat_proteins`: "Proteins & Whey" (`proteins`), icon: `Dumbbell`
- `cat_creatine`: "Creatine" (`creatine`), icon: `Zap`
- `cat_mass_gainers`: "Mass Gainers" (`mass-gainers`), icon: `Flame`
- `cat_pre_workout`: "Pre-Workout" (`pre-workout`), icon: `ShieldCheck`
- `cat_vitamins_health`: "Vitamins & Health" (`vitamins-health`), icon: `HeartPulse`
- `cat_amino_bcaa`: "Amino & BCAA" (`amino-bcaa`), icon: `Activity`

Each category contains display ordering, FAQs on dosage/usage, and full `SEOMetadata`.

### Step 2: `data/brands.json`
Define 10 authorized brands matching `BrandSchema`:
1. `brand_optimum_nutrition`: Optimum Nutrition (ON) (USA, Muscle House Nepal)
2. `brand_muscletech`: MuscleTech (USA, Radiant Traders)
3. `brand_dymatize`: Dymatize (USA, Muscle House Nepal)
4. `brand_myprotein`: MyProtein (UK, Authorized Nepal Importer)
5. `brand_kevin_levrone`: Kevin Levrone Signature Series (USA/EU, Radiant Traders)
6. `brand_rule_1`: Rule 1 Proteins (USA, Muscle House Nepal)
7. `brand_labrada`: Labrada Nutrition (USA, Radiant Traders)
8. `brand_cellucor`: Cellucor (USA, Authorized Nepal Importer)
9. `brand_universal_nutrition`: Universal Nutrition (USA, Authorized Nepal Importer)
10. `brand_scivation`: Scivation (USA, Authorized Nepal Importer)

### Step 3: `data/products.json`
Author 15 products matching `ProductSchema`:
- **Proteins:** ON Gold Standard 100% Whey, MuscleTech NitroTech, Dymatize ISO 100, MyProtein Impact Whey, Rule 1 R1 Protein.
- **Creatine:** Kevin Levrone Gold Creatine, MuscleTech Platinum Creatine, ON Micronized Creatine.
- **Mass Gainers:** ON Serious Mass, Labrada Muscle Mass Gainer.
- **Pre-Workout:** Cellucor C4 Original, Psychotic Gold Pre-Workout.
- **Vitamins & Health:** Universal Nutrition Animal Pak, MusclePharm Fish Oil.
- **Amino & BCAA:** Scivation Xtend BCAA.

Each product will have:
- Multiple variants (Flavors: Double Rich Chocolate, Vanilla Ice Cream, Strawberry, Unflavored; Sizes: 2 lbs, 5 lbs, 250g, 300g, 60 servings).
- Valid SKUs matching `/^[A-Z0-9_-]{3,30}$/`.
- Positive integer NPR pricing (`priceNpr`) and optional strictly-less `discountPriceNpr`.
- 4-state `stockStatus` (`in_stock`, `low_stock`, `out_of_stock`, `pre_order`).
- `nutritionFacts`, `authenticity` metadata with importer details.
- Valid `defaultVariantId` present in `variants`.
- Product level `faqs` and `seo` metadata.

---

## 4. Required Data & Validation

All JSON files will be validated in Node.js against the canonical Zod schemas:
- `CategorySchema.array().parse(categoriesData)`
- `BrandSchema.array().parse(brandsData)`
- `ProductSchema.array().parse(productsData)`

---

## 5. Potential Risks & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Zod Refinement Error (`defaultVariantId`)** | `defaultVariantId` doesn't match any variant `id` in `variants`. | Programmatically generate variant IDs and set `defaultVariantId` to the first variant's `id`. |
| **Discount Price Invalidation** | `discountPriceNpr` >= `priceNpr`. | Ensure `discountPriceNpr` is strictly less than `priceNpr` whenever present. |
| **SKU Regex Mismatch** | Using lower-case or special characters in SKU. | Enforce format like `ON-WHEY-5LB-CHOC` matching `/^[A-Z0-9_-]{3,30}$/`. |
| **Slug Regex Mismatch** | Using uppercase letters or underscores in slug. | Enforce strict kebab-case `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. |

---

## 6. Verification & Definition of Done

1. `data/categories.json`, `data/brands.json`, and `data/products.json` exist in root `data/`.
2. All three JSON datasets pass programmatic Zod schema array parsing.
3. `npx tsc --noEmit` returns zero errors.
4. Spec 16 status updated to `Completed` and Sub-Phase 2.2 checked off in `context/progress-tracker.md` and `context/feature-roadmap.md`.
