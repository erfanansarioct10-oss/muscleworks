# Technical Implementation Specification: Sub-Phase 5.5 — Contact & Store Locations Experience

> **Status:** Draft / Pending Implementation  
> **Sub-Phase:** `5.5`  
> **Target Files:**
> - `src/app/(marketing)/contact/page.tsx` [NEW]
> - `src/app/(marketing)/location/page.tsx` [NEW]
> - `src/components/location/store-map-embed.tsx` [NEW]
> - `src/components/location/store-hours-card.tsx` [NEW]
> **Dependencies:** `Sub-Phase 2.5`, `Sub-Phase 5.4`

---

## 1. Overview & Business Objectives

Sub-Phase 5.5 delivers the full `/contact` and `/location` marketing experience for MuscleWorks Supplements. It establishes trust by showcasing our physical retail outlet at Golfutar, Budha-Nilkantha, Kathmandu, while facilitating customer inquiries via direct WhatsApp, telephone, and the interactive `<ContactForm />`.

### Primary Goals:
1. Build `/contact` SSG page with split 2-column layout: Left column with direct phone/WhatsApp contacts & store hours preview; Right column with `<ContactForm />`.
2. Build `/location` SSG page featuring Google Maps embed (`store-map-embed.tsx`), landmark directions, parking details, opening hours table (`store-hours-card.tsx`), and Schema.org `LocalBusiness` JSON-LD.
3. Build `store-map-embed.tsx` with responsive iframe, landmark callout ("Near Golfutar Basketball Court"), and direct Google Maps app trigger button.
4. Build `store-hours-card.tsx` featuring real-time open status calculation (`isStoreOpenNow()`), current day highlighting, and Saturday contact note.

---

## 2. Key Architectural Decisions

- **Full Static Pre-rendering (SSG):** Both `/contact` and `/location` pages are pre-rendered at build time with 0ms TTFB.
- **Dynamic Store Accessors:** Fetch store metadata via `getStoreInfo()`, `getOpeningHours()`, `isStoreOpenNow()`, and `getTodayOpeningHours()` from `@/lib/data/store`.
- **SEO & Schema.org:** Inject `LocalBusiness` JSON-LD script on `/location` page for Google Maps & Local Search indexing.
- **Mobile Touch Targets:** All direct call links (`tel:+977-98...`), WhatsApp links (`wa.me`), and directions buttons enforce $\ge 48\text{px}$ touch targets on mobile.

---

## 3. Verification Plan

- `npx tsc --noEmit`: 0 errors.
- Programmatic validation script `src/scripts/validate-location-components.ts`.
- `npm run build`: Static compilation of `/contact` and `/location` routes.
