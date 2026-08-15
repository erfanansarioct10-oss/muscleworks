# Feature Spec 04: Sub-Phase 0.3 — Core Utility Layer & Type Foundations

> **Spec ID:** `04-subphase-0.3-core-utility-layer-type-foundations`  
> **Target Sub-Phase / Branch:** `Phase 0 — Sub-Phase 0.3`  
> **Status:** Complete  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification governs the implementation of **Sub-Phase 0.3: Core Utility Layer & Type Foundations** for MuscleWorks Supplements. It establishes the shared helper functions, brand and store constants, shared navigational/UI types, and the standardized `ActionResult<T>` envelope for all Server Actions. All decisions incorporate the approved values from the user interview (NPR currency formatting, Golfutar physical store location, 24-hr Kathmandu delivery promise, and WhatsApp order phone constants).

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/lib/utils.ts` | **[NEW]** | Implement `cn()` class merger (`clsx` + `twMerge`), `formatNprPrice()`, `calculateDiscountPercentage()`, `slugify()`, and `truncateText()`. |
| 2 | `src/lib/constants.ts` | **[NEW]** | Define brand identity constants, physical store metadata (Golfutar, Budha-Nilkantha, Kathmandu 44500), WhatsApp & call numbers, operating hours, delivery promises, and social links. |
| 3 | `src/types/index.ts` | **[NEW]** | Define shared navigational links, breadcrumb items, filter state types, and badge color maps. |
| 4 | `src/types/actions.ts` | **[NEW]** | Define canonical `ActionResult<T>` type envelope for typed Server Action error/success responses. |

---

## 2. Why We Are Doing This

1. **Centralized Brand Ground Truth:** Eliminates hardcoded phone numbers, store addresses, or delivery promises across components by establishing a single source of truth in `src/lib/constants.ts`.
2. **Canonical Nepal Currency Formatting:** Standardizes `"NPR 5,500"` formatting across product cards, cart sheets, and WhatsApp pre-filled order messages via `formatNprPrice`.
3. **Safe Dynamic Tailwind Classes:** `cn()` prevents CSS specificity bugs by intelligently merging conflicting Tailwind CSS v4 class definitions.
4. **Standardized Server Action Responses:** The `ActionResult<T>` envelope ensures deterministic handling of form errors, validation field errors, and success states in React 19 / Next.js 16 Server Actions.

---

## 3. How We Are Going to Implement It

### Step 1: `src/lib/utils.ts`
- Implement `cn(...inputs: ClassValue[]): string` with `clsx` and `tailwind-merge`.
- Implement `formatNprPrice(price: number): string` formatting integers (e.g. `5500` ➔ `"NPR 5,500"` using `Intl.NumberFormat('en-NP')`).
- Implement `calculateDiscountPercentage(original: number, discounted: number): number` (returns integer discount rounded, e.g. `20`).
- Implement helper string utilities (`slugify`, `formatPhoneNumber`).

### Step 2: `src/lib/constants.ts`
- Store Identity:
  - `STORE_NAME = "MuscleWorks Supplements"`
  - `STORE_TAGLINE = "100% Genuine Sports Nutrition & Supplements in Nepal"`
  - `STORE_ADDRESS = { street: "Golfutar Main Road", landmark: "Near Budha-Nilkantha Highway", city: "Kathmandu", postalCode: "44500", country: "Nepal" }`
  - `STORE_COORDINATES = { lat: 27.7681, lng: 85.3524 }`
- Contact & WhatsApp:
  - `STORE_PHONE = "+977 980-0000000"`
  - `STORE_WHATSAPP = "+9779800000000"`
  - `STORE_WHATSAPP_DISPLAY = "+977 980-0000000"`
  - `STORE_EMAIL = "orders@muscleworksnepal.com"`
- Operational Hours:
  - `STORE_HOURS = "Sun - Fri: 10:00 AM - 8:00 PM | Saturday: 11:00 AM - 6:00 PM"`
- Delivery Promises:
  - `DELIVERY_PROMISE_VALLEY = "Same-Day / 24-Hour Delivery in Kathmandu Valley"`
  - `DELIVERY_PROMISE_NATIONWIDE = "2–4 Days Express Delivery Nationwide across Nepal"`
  - `FREE_DELIVERY_THRESHOLD = 5000` (Free Kathmandu delivery over NPR 5,000)

### Step 3: `src/types/index.ts`
- Nav items (`NavItem`), breadcrumbs (`BreadcrumbItem`), social links (`SocialLink`), delivery zones (`DeliveryZone`).

### Step 4: `src/types/actions.ts`
- Standard typed envelope:
  ```typescript
  export type ActionResult<T = void> =
    | { success: true; data: T; message?: string }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> };
  ```

---

## 4. When We Are Going to Do It

```text
1. Update Progress Tracker to mark 0.3 [IN PROGRESS]
    │
    ▼
2. Create src/lib/utils.ts
    │
    ▼
3. Create src/lib/constants.ts
    │
    ▼
4. Create src/types/index.ts & src/types/actions.ts
    │
    ▼
5. Execute Verification Gate (tsc --noEmit, unit assertion script, npm run build)
    │
    ▼
6. Update Progress Tracker & Roadmap to mark 0.3 [x] and promote 0.4
```

---

## 5. Required Data & Data Sources

| Constant / Utility | Origin | Value / Format |
|---|---|---|
| Address & Postal Code | Project Context / User Grill-Me | Golfutar, Budha-Nilkantha, Kathmandu (44500) |
| WhatsApp Number | User Grill-Me selection | `+977 980-0000000` / `9800000000` |
| Currency Format | User Grill-Me selection | `"NPR 5,500"` |
| Delivery Promise | User Grill-Me selection | Same-Day / 24-Hr in Kathmandu Valley, 2-4 Days Nationwide |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Float Rounding in Currency** | Inaccurate decimal calculations when formatting prices. | Enforce integer pricing (NPR is non-fractional in supplement retail) and use `Math.round`. |
| **Malformed WhatsApp URI** | Inconsistent '+' or hyphens in `wa.me` links. | Provide sanitized phone utility function (`digitsOnly`) specifically for `wa.me/<number>`. |
| **Unused TypeScript Imports** | Strict tsconfig `"noUnusedLocals": true`. | Ensure all exported types and utilities are clean and strictly typed. |

---

## 7. Verification & Definition of Done

1. [ ] `src/lib/utils.ts` exported and passes helper assertions (`formatNprPrice(5500) === "NPR 5,500"`).
2. [ ] `src/lib/constants.ts` contains all verified brand, store, phone, address, and delivery constants.
3. [ ] `src/types/index.ts` and `src/types/actions.ts` export strictly typed interfaces.
4. [ ] `npx tsc --noEmit` and `npm run build` pass with 0 errors.
5. [ ] `context/progress-tracker.md` and `context/feature-roadmap.md` updated.
