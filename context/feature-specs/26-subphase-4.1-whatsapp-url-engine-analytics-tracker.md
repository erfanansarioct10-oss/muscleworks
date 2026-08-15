# Feature Spec 26: Sub-Phase 4.1 — WhatsApp URL Engine & Analytics Tracker

> **Spec ID:** `26-subphase-4.1-whatsapp-url-engine-analytics-tracker`  
> **Target Sub-Phase:** Sub-Phase 4.1 (`src/lib/whatsapp.ts`, `src/lib/analytics.ts`)  
> **Status:** Approved (Completed)  
> **Created Date:** 2026-08-10  
> **Author:** AI Agent (Pair Programming with User)

---

## Executive Summary

Sub-Phase 4.1 initiates **Phase 4 (Product Detail Page & Dynamic WhatsApp Conversion Flow)** by building the central conversion engine of the MuscleWorks Supplements platform: the **WhatsApp URL Engine** (`src/lib/whatsapp.ts`) and the **Analytics Event Tracker** (`src/lib/analytics.ts`). 

Since MuscleWorks operates primarily as a direct WhatsApp retail model in Kathmandu, Nepal, pre-filling high-converting, context-rich WhatsApp messages (with exact product title, flavor, size, NPR pricing, delivery city/zone, and authenticity guarantees) dramatically increases conversion rates and streamlines customer service. Simultaneously, `analytics.ts` provides a type-safe, resilient wrapper around Google Analytics 4 (`gtag`) and Meta Pixel (`fbq`) with development console logging to track conversion events across the storefront.

---

## 1. What We Are Going to Do

List of files to be created:

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/lib/whatsapp.ts` | **[NEW]** | High-converting WhatsApp URL generator supporting structured product order payloads, flavor/size variant specs, delivery city breakdown, authenticity verification inquiries, stack consultations, and store visit links. |
| 2 | `src/lib/analytics.ts` | **[NEW]** | Client-side analytics wrapper tracking `trackWhatsAppClick`, `trackProductView`, `trackSearchQuery`, `trackCategoryView`, and `trackLeadSubmission` across GA4 (`gtag`), Meta Pixel (`fbq`), and browser events with dev console fallbacks. |

---

## 2. Why We Are Doing This

1. **Direct Conversion Channel Optimization:** In Nepal's supplement ecosystem, WhatsApp is the #1 conversion channel. Providing structured pre-filled text eliminates customer friction and ensures accurate order fulfillment details.
2. **Contextual Order Transparency:** Including exact NPR prices, flavor/size specifications, Golfutar store location, and authenticity guarantees gives buyers immediate confidence.
3. **Data-Driven Insights:** Unified analytics tracking allows monitoring of product popularity, conversion drops, search queries, and high-converting categories without breaking if ad blockers or uninitialized SDKs are present.
4. **Strict Alignment with Project Standards:** Built using pure TypeScript utility standards, zero external npm bloat, and standard `wa.me/` encoding standards (`encodeURIComponent`).

---

## 3. How We Are Going to Implement It

### Step 1: WhatsApp URL Engine (`src/lib/whatsapp.ts`)

- Define `ProductWhatsAppOptions` interface:
  - `product`: `Product` domain object
  - `selectedVariant?`: `ProductVariant` optional object
  - `customerCity?`: string (e.g., "Kathmandu (Inside Ring Road)", "Pokhara")
  - `customerNote?`: string
- Build pre-filled message generator `buildProductWhatsAppUrl`:
  ```text
  Namaste MuscleWorks! I want to order:
  • Product: Optimum Nutrition Gold Standard 100% Whey
  • Flavor: Double Rich Chocolate
  • Size: 5 lbs
  • Price: NPR 11,500
  • Delivery Location: Kathmandu (Inside Ring Road)
  • Authentic Hologram Guarantee Requested

  Please confirm stock availability and delivery timeline.
  ```
- Export specialized helper functions:
  - `buildGeneralWhatsAppUrl(customGreeting?: string)`
  - `buildAuthenticityInquiryWhatsAppUrl(productName?: string)`
  - `buildStackConsultationWhatsAppUrl(fitnessGoal?: string)`
  - `buildStoreLocationWhatsAppUrl()`
- Sanitize and format phone numbers using `STORE_WHATSAPP` (`+9779800000000` -> `9779800000000`).

### Step 2: Analytics Event Tracker (`src/lib/analytics.ts`)

- Define standard event interfaces (`AnalyticsEvent`, `ProductViewEvent`, `WhatsAppClickEvent`, `SearchEvent`).
- Safely check for `window.gtag` and `window.fbq` presence before calling.
- Export key event dispatchers:
  - `trackWhatsAppClick({ source, productName, price, variant })`
  - `trackProductView({ productId, productName, category, price })`
  - `trackSearchQuery({ query, resultsCount })`
  - `trackLeadSubmission({ formName, city })`
- Include development mode console logging (`process.env.NODE_ENV !== 'production'`) for immediate developer feedback.

---

## 4. Execution Timeline

```text
Phase 1: Implement WhatsApp URL Generator & Helpers (src/lib/whatsapp.ts)
    │
    ▼
Phase 2: Implement Client Analytics Tracker (src/lib/analytics.ts)
    │
    ▼
Phase 3: Run Type Check (`npx tsc --noEmit`) & Build Verification (`npm run build`)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| WhatsApp Phone Number | `src/lib/constants.ts` (`STORE_WHATSAPP`) | Endpoint base URL `https://wa.me/9779800000000` |
| Product Details & Variants | `src/types/index.ts` (`Product`, `ProductVariant`) | Text message interpolation |
| Delivery Locations | `src/lib/constants.ts` (`NEPAL_DELIVERY_CITIES`) | Pre-filled city/zone delivery options |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Broken Line Breaks in WhatsApp App** | Unescaped `\n` characters in URL parameters. | Use `\n` formatted correctly inside standard `encodeURIComponent` string call. |
| **`window is not defined` in SSR** | Calling `window.gtag` or `window.fbq` inside Server Components. | Enforce `typeof window !== 'undefined'` checks before dereferencing browser globals. |
| **Phone Number Formatting Errors** | Including `+`, spaces, or hyphens in `wa.me` phone path. | Strip all non-numeric characters from `STORE_WHATSAPP` (`STORE_WHATSAPP.replace(/\D/g, '')`). |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles with 0 errors.
2. WhatsApp URLs properly encode product titles, variants, prices, and city notes.
3. Unit testing / script verification of URL generation and analytics dispatches.
4. `npm run build` succeeds cleanly.
