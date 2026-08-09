# Feature Spec 15: Sub-Phase 2.1 — Zod Schemas & Domain Type Definitions

> **Spec ID:** `15-subphase-2.1-zod-schemas-domain-type-definitions`  
> **Target Sub-Phase / Branch:** Sub-Phase 2.1 (`Phase-2` branch)  
> **Status:** Approved & Complete  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent  

---

## Executive Summary

Sub-Phase 2.1 establishes the canonical **Zod-first validation and domain type foundation** for MUSCLEWORKS SUPPLEMENTS. Following our `/grill-me` design alignment session and `context/data-models.md`, all domain types across products, variants, authenticity metadata, store information, and customer inquiry lead forms will be derived strictly from Zod schemas using `z.infer<typeof Schema>`. This eliminates type drift and enforces runtime safety for Nepal phone formats, NPR pricing, stock status enums, and anti-bot security traps.

---

## 1. What We Are Going to Do

We will create four target validation files under `src/lib/validations/`:

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/lib/validations/common.ts` | **[NEW]** | Common primitives (`SEOMetadataSchema`, `NEPAL_PHONE_REGEX`, NPR price integers, pagination/sort query schemas). |
| 2 | `src/lib/validations/product.ts` | **[NEW]** | Canonical product schemas (`ProductSchema`, `ProductVariantSchema`, `NutritionFactsSchema`, `AuthenticityMetadataSchema`, `StockStatusEnum`). |
| 3 | `src/lib/validations/inquiry.ts` | **[NEW]** | Lead form schemas (`InquiryFormClientSchema`, `InquiryServerPayloadSchema`) with honeypot (`hp_field`) & timing traps (`_form_loaded_at`). |
| 4 | `src/lib/validations/store.ts` | **[NEW]** | Physical retail store schema (`StoreInfoSchema`) for Golfutar outlet, opening hours, landmarks, and `FAQItemSchema`. |

---

## 2. Why We Are Doing This

1. **Zero Runtime Drift:** TypeScript types are inferred directly from Zod schemas (`export type Product = z.infer<typeof ProductSchema>`).
2. **Nepali Market Validation:** Enforces Nepal phone number regex (`/^(?:\+977[- ]?)?(?:98\d{8}|97\d{8}|01\d{6,7})$/`) and positive integer NPR prices.
3. **Structured Authenticity Trust:** Structured object per product with `importerName` (e.g. Muscle House Nepal), `hasScratchCode`, `verificationMethod`, and `trustBadgeLabel`.
4. **Rich Inventory Tracking:** 4-state enum `stockStatus` (`'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER'`) per variant.
5. **Anti-Bot Defense:** Public form schemas validate hidden honeypots and submission timing.

---

## 3. How We Are Going to Implement It

### Step 1: `src/lib/validations/common.ts`
- Define `NEPAL_PHONE_REGEX` and `SEOMetadataSchema`.
- Define `NprPriceSchema` enforcing positive integers.
- Define `PaginationQuerySchema` and `SortOrderEnum`.

### Step 2: `src/lib/validations/product.ts`
- Define `StockStatusEnum = z.enum(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'PRE_ORDER'])`.
- Define `NutritionFactsSchema` (protein, carbs, fat, calories, servingsPerContainer).
- Define `AuthenticityMetadataSchema` (`importerName`, `hasScratchCode`, `verificationMethod`, `trustBadgeLabel`).
- Define `ProductVariantSchema` (`id`, `sku`, `sizeOrWeight`, `flavor`, `priceNpr`, `discountPriceNpr`, `stockStatus`, `inStockQuantity`).
- Define `ProductSchema` (`id`, `slug`, `name`, `brandId`, `categoryId`, `description`, `shortDescription`, `isFeatured`, `images`, `nutritionFacts`, `authenticityMetadata`, `variants`).
- Export inferred TypeScript types (`Product`, `ProductVariant`, `NutritionFacts`, `AuthenticityMetadata`, `StockStatus`).

### Step 3: `src/lib/validations/inquiry.ts`
- Define `InquiryTypeEnum` (`PRODUCT_INQUIRY`, `AUTHENTICITY_VERIFICATION`, `BULK_ORDER`, `GENERAL_HELP`).
- Define `InquiryFormClientSchema` (`fullName`, `phoneNumber`, `email`, `inquiryType`, `message`, `hp_field`, `_form_loaded_at`).
- Add Zod refinements checking `hp_field === ''` and `Date.now() - _form_loaded_at >= 2000`.

### Step 4: `src/lib/validations/store.ts`
- Define `OpeningHoursSchema` (dayOfWeek, openTime, closeTime, isClosed, note).
- Define `StoreInfoSchema` (id, name, address, city, area, postalCode, phone, mapCoordinates, landmarks, parkingAvailable, openingHours).
- Define `FAQItemSchema` (id, question, answer, category, priority).

---

## 4. When We Are Going to Do It

```text
Phase 1: Implement common.ts & product.ts Zod schemas
    │
    ▼
Phase 2: Implement inquiry.ts & store.ts Zod schemas
    │
    ▼
Phase 3: Export inferred TypeScript types
    │
    ▼
Phase 4: Run Zod parse unit assertions on mock objects
    │
    ▼
Phase 5: Execute npx tsc --noEmit check
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Nepal Phone Regex | `context/data-models.md` Section 2.3 | Form validation and WhatsApp payload verification |
| Importer Seal Schema | `context/data-models.md` Section 3.1 | Product authenticity trust badge validation |
| Golfutar Store Schema | `context/data-models.md` Section 5.1 | Store location data parsing |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Invalid Nepal Phone Parsing** | Unexpected space or dash formatting. | `NEPAL_PHONE_REGEX` allows optional dashes/spaces and leading `+977` or `01`/`98`/`97` prefixes. |
| **Float NPR Price Errors** | Division or discount calculations producing decimals. | Zod `z.number().int().positive()` prevents floats in datasets. |
| **Circular Type Dependencies** | Importing types across un-synced modules. | Consolidate all validation schemas cleanly in `src/lib/validations/`. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. Zod schema `.parse()` tests succeed on sample product and store records.
3. Registered spec in `context/feature-specs/README.md` and updated `context/progress-tracker.md`.
