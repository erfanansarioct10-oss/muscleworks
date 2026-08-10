# Feature Spec 17: Sub-Phase 2.3 — Supplementary Datasets (Store Info & Comprehensive FAQs)

> **Spec ID:** `17-subphase-2.3-supplementary-datasets`  
> **Target Sub-Phase / Branch:** Sub-Phase 2.3 (`Phase-2` branch)  
> **Status:** Completed  
> **Created Date:** 2026-08-10  
> **Author:** AI Assistant  

---

## Executive Summary

Sub-Phase 2.3 authors the supplementary static JSON datasets (`data/store-info.json` and `data/faqs.json`) for the MUSCLEWORKS SUPPLEMENTS e-commerce application. These datasets provide the single physical store metadata at Golfutar, Budha-Nilkantha, Kathmandu (44500), along with a comprehensive FAQ repository covering authenticity verification, delivery options across Nepal, payment methods, and supplement usage guidance. Both JSON files strictly conform to the Zod validation schemas implemented in Sub-Phase 2.1 (`src/lib/validations/store.ts` and `src/lib/validations/common.ts`).

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `data/store-info.json` | **[NEW]** | Author canonical physical store dataset for Golfutar flagship location including coordinates, contact matrix, opening hours, landmarks, and delivery policy matching `StoreInfoSchema`. |
| 2 | `data/faqs.json` | **[NEW]** | Author 12+ comprehensive supplement, authenticity, delivery, and store FAQs matching `FAQItemSchema.array()`. |

---

## 2. Why We Are Doing This

1. **Physical Store Credibility:** MUSCLEWORKS SUPPLEMENTS operates a physical retail outlet in **Golfutar, Budha-Nilkantha, Kathmandu (44500)**. Structuring this data statically allows instant SSG rendering of location pages, footer details, contact cards, and Schema.org `LocalBusiness` JSON-LD data without dynamic database overhead.
2. **Customer Trust & Counterfeit Awareness:** Supplement buyers in Nepal frequently ask about scratch-off codes, official importer holographic stickers (e.g. Muscle House Nepal, Radiant Traders), and delivery reliability. Centralizing structured FAQs ensures consistency across website UI components, PDP dropdowns, and search features.
3. **Strict Saturday Store Hours Handling:** Per client specifications in `project-overview.md` and resolution in `Spec 10`, Saturday opening hours are explicitly labeled as unspecified ("Contact Store"), preventing inaccurate business hour display.

---

## 3. How We Are Going to Implement It

### Step 1: `data/store-info.json`
Author `data/store-info.json` matching `StoreInfoSchema`:
- `name`: `"MUSCLEWORKS SUPPLEMENTS"`
- `legalName`: `"MUSCLEWORKS SUPPLEMENTS"`
- `tagline`: `"Nepal's Premier Destination for 100% Authentic Sports Nutrition & Fitness Supplements"`
- `establishedYear`: `2026`
- `address`:
  - `streetAddress`: `"Golfutar Main Road"`
  - `area`: `"Golfutar"`
  - `municipality`: `"Budha-Nilkantha"`
  - `city`: `"Kathmandu"`
  - `district`: `"Kathmandu"`
  - `province`: `"Bagmati Province"`
  - `postalCode`: `"44500"`
  - `country`: `"Nepal"`
  - `landmark`: `"Near Golfutar Basketball Court & Main Chowk"`
- `coordinates`:
  - `latitude`: `27.7478`
  - `longitude`: `85.3533`
  - `googleMapsPlaceUrl`: `"https://maps.google.com/?q=27.7478,85.3533"`
  - `googleMapsEmbedUrl`: `"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.321!2d85.3533!3d27.7478!2m3!1f0!0f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjd8NDQnNTIuMSJOIDg1wrAyMShxMS45IkU!5e0!3m2!1sen!2snp!4v1600000000000"`
- `openingHours`: 7 days array (Sunday to Friday 10:00 AM - 09:00 PM; Saturday specifies `opens: "Contact Store"`, `closes: "Contact Store"`, `isClosed: false`, and `note: "Saturday hours vary — please contact store before visiting Golfutar flagship."`)
- `contacts`: Phone numbers (`+977-9800000000`), WhatsApp direct link (`9779800000000`), and official emails (`info@muscleworks.com.np`, `support@muscleworks.com.np`).
- `deliveryPolicy`: Coverage `"Nationwide Nepal"`, primary zones (Kathmandu Valley Same-Day/Next-Day, Outside Valley 2-4 Business Days), free delivery threshold NPR 10,000.
- `socialLinks`: Verified URL strings for Instagram, TikTok, Facebook.

### Step 2: `data/faqs.json`
Author 12+ structured FAQ items matching `FAQItemSchema`:
- **Authenticity (3 items):** How to verify importer holographic seals, scratch-and-verify codes, and handling of fake products in Nepal.
- **Ordering & Delivery (3 items):** WhatsApp ordering process, Kathmandu Valley delivery timelines, and Outside-Valley shipping (Pokhara, Chitwan, Butwal, Biratnagar).
- **Payment & Store (3 items):** Fonepay QR / Cash on Delivery payment options, physical store visiting hours, and parking/landmark details in Golfutar.
- **Supplements & Usage (3 items):** Whey isolate vs concentrate guide, Creatine monohydrate daily dosage, and mass gainer recommendations for hardgainers.

---

## 4. Required Data & Validation

Programmatically validate both JSON datasets in Node.js:
- `StoreInfoSchema.parse(storeInfoData)`
- `FAQItemSchema.array().parse(faqsData)`

---

## 5. Potential Risks & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Invalid Schema Literals** | `establishedYear` or `postalCode` not matching exact schema literals (`2026`, `'44500'`). | Verify literal fields strictly against `StoreInfoSchema`. |
| **URL Validation Errors** | Social links or Google Maps URLs missing `http://` or `https://`. | Ensure all URL strings are well-formed valid HTTP/HTTPS endpoints. |
| **Length Violations in FAQs** | FAQ answers exceeding 1000 characters or questions under 5 characters. | Keep questions between 5–200 characters and answers between 10–1000 characters. |

---

## 6. Verification & Definition of Done

1. `data/store-info.json` and `data/faqs.json` created in `data/`.
2. Programmatic validation passes cleanly with zero Zod errors.
3. `npx tsc --noEmit` passes with 0 errors.
4. Spec 17 and `context/progress-tracker.md` updated to mark Sub-Phase 2.3 complete `[x]`.
