# Feature Spec 38: CodeRabbit Commit 82dc2d2 Review Resolutions & Technical Synchronization

> **Spec ID:** `38-coderabbit-commit-82dc2d2-resolutions`  
> **Target Sub-Phase / Branch:** `main` (Sub-Phase 5.4 & 5.5 Technical Cleanup)  
> **Status:** Approved / Complete  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification addresses and resolves all 10 review findings posted by CodeRabbit on commit `82dc2d2` (`context/coderabbit-comments/from-commit-82dc2d2.md`). 

The resolution fixes a modal trapping bug in `ConsultationModal`, eliminates SSG hydration mismatch risks in `StoreHoursCard`, enforces cross-field email and custom city validation in lead forms, adds proper WAI-ARIA radiogroup and label accessibility semantics, enforces touch target sizing (≥44px/≥48px), aligns store data accessors with `@/lib/data/store`, removes unnecessary client directives, and hardens JSON-LD script serialization.

---

## 1. What We Are Going to Do

List of files to modify or update:

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/forms/consultation-modal.tsx` | **[MODIFY]** | Fix `isControlled` logic so modal can close when controlled state lacks `onOpenChange`. |
| 2 | `src/components/location/store-hours-card.tsx` | **[MODIFY]** | Initialize day & store open status in client `useEffect`, refresh on timer, use `@/lib/data/store` accessors, and enforce ≥48px phone link. |
| 3 | `src/components/forms/inquiry-form.tsx` | **[MODIFY]** | Sync `customCity` input with `setValue('deliveryCity', ...)`, require custom city on 'Other', add ARIA `radiogroup` & control `id`/`htmlFor` attributes. |
| 4 | `src/components/forms/contact-form.tsx` | **[MODIFY]** | Require non-empty email when preferred method is `'email'`, sync `customCity`, add ARIA `radiogroup` & control `id`/`htmlFor` attributes. |
| 5 | `src/app/(marketing)/contact/page.tsx` | **[MODIFY]** | Import store data via `@/lib/data/store` accessors & enforce ≥44px touch targets on breadcrumbs and email link. |
| 6 | `src/app/(marketing)/location/page.tsx` | **[MODIFY]** | Import store data via `@/lib/data/store` accessors, render dynamic address heading, and escape `<` in JSON-LD script payload. |
| 7 | `src/components/location/store-map-embed.tsx` | **[MODIFY]** | Remove unnecessary top-level `'use client'` directive to keep component as a Server Component. |
| 8 | `src/scripts/validate-location-components.ts` | **[MODIFY]** | Move `process.env.NODE_ENV = 'test'` before component imports or use dynamic imports. |
| 9 | `src/scripts/validate-form-components.ts` | **[MODIFY]** | Move `process.env.NODE_ENV = 'test'` before component imports or use dynamic imports. |
| 10 | `context/feature-specs/36-subphase-5.4-interactive-form-components-consultation-modal.md` | **[MODIFY]** | Update status header to `Complete`. |
| 11 | `context/feature-specs/37-subphase-5.5-contact-store-locations-experience.md` | **[MODIFY]** | Update status header to `Complete` & replace LaTeX `$\ge 48\text{px}$` with `>= 48px`. |
| 12 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 38 in registry table. |
| 13 | `context/progress-tracker.md` | **[MODIFY]** | Record Spec 38 resolutions in session change log. |

---

## 2. Why We Are Doing This

1. **Bug Prevention & UX Quality:**
   - Preventing modals from getting stuck open when controlled props are partially provided.
   - Eliminating server-versus-client hydration mismatch errors on SSG pages by rendering time-dependent content (`currentKathmanduDay`) in client state post-mount.
   - Guarding against invalid form submissions (e.g. submitting string `"Other"` for city, or selecting email contact without supplying an email address).
2. **Accessibility & Standards (`AGENTS.md`):**
   - WAI-ARIA radio group semantics (`role="radiogroup"`, `role="radio"`, `aria-checked`) for custom contact method selection buttons.
   - Matching `htmlFor` and `id` pairs for all form controls and `aria-describedby` error bindings.
   - Enforcing minimum touch target dimensions: `min-h-[44px]` for general interactive links and `min-h-[48px]` for conversion telephone links.
3. **Architectural Cleanliness:**
   - Using `@/lib/data/store` accessor layer instead of direct JSON dataset imports in page routes and components.
   - Keeping Server Components by default by removing unnecessary `'use client'` from `StoreMapEmbed`.

---

## 3. How We Are Going to Implement It

### Step 1: Fix `ConsultationModal` Control State Logic
In `src/components/forms/consultation-modal.tsx`:
Update `isControlled` calculation:
```ts
const isControlled = controlledOpen !== undefined && setControlledOpen !== undefined;
```
This ensures that if `open` is passed without `setControlledOpen`, the component falls back to updating `uncontrolledOpen` so Escape, backdrop overlay click, and close button actions successfully dismiss the dialog.

### Step 2: Client Hydration & Accessors in `StoreHoursCard`
In `src/components/location/store-hours-card.tsx`:
1. Use `getOpeningHours()` and `getStoreInfo()` from `@/lib/data/store` instead of `rawStoreData`.
2. Move `currentKathmanduDay` calculation into client state (`const [currentDay, setCurrentDay] = useState<string>('')`), initialized inside `useEffect` after mount.
3. Set up a 60-second timer interval in `useEffect` to periodically re-verify `isStoreOpenNow()` and `currentDay`, clearing the interval on unmount.
4. Update the telephone link in the Saturday callout box with `inline-flex min-h-[48px] items-center px-1` to meet touch target requirements.

### Step 3: Form Synchronization, Validation & Accessibility
In `src/components/forms/inquiry-form.tsx` & `src/components/forms/contact-form.tsx`:
1. In `InquiryForm`: Update `customCity` input `onChange`:
   ```ts
   onChange={(e) => {
     const val = e.target.value;
     setCustomCity(val);
     setValue('deliveryCity', val ? val : 'Other', { shouldValidate: true });
   }}
   ```
2. In `InquiryForm` & `ContactForm`: Add validation check on submission preventing submission if `selectedDeliveryCity === 'Other'` and `customCity.trim()` is empty.
3. In `ContactForm`: Add cross-field validation requiring non-empty `email` when `selectedContactMethod === 'email'`.
4. Add WAI-ARIA radio group wrapper (`role="radiogroup"`, `aria-label="Preferred Response Method"`) and button roles (`role="radio"`, `aria-checked={selectedContactMethod === id}`) for preferred contact method buttons.
5. Connect all `<label>` elements with matching input `id`s (`fullName`, `phoneNumber`, `email`, `deliveryCity`, `customCity`, `message`) and `aria-describedby` error IDs.

### Step 4: Page Route Accessors & JSON-LD Hardening
In `src/app/(marketing)/contact/page.tsx` & `src/app/(marketing)/location/page.tsx`:
1. Replace direct `import rawStoreData from '@/data/store-info.json'` with accessor calls `getStoreInfo()` and `getContacts()`.
2. In `location/page.tsx`: Update address header to `{address.municipality}, {address.city} {address.postalCode}`.
3. In `location/page.tsx`: Harden JSON-LD script tag: `JSON.stringify(jsonLd).replace(/</g, '\\u003c')`.
4. In `contact/page.tsx`: Wrap breadcrumb and email support links in `inline-flex min-h-[44px] items-center`.

### Step 5: Optimization & Validator Scripts
1. In `src/components/location/store-map-embed.tsx`: Remove `'use client'`.
2. In `src/scripts/validate-location-components.ts` & `validate-form-components.ts`: Set `process.env.NODE_ENV = 'test'` before static imports or convert imports to dynamic `await import()`.

---

## 4. Required Data & Data Sources

| Requirement | Source | Usage |
|---|---|---|
| Store Information | `src/lib/data/store.ts` (`getStoreInfo`, `getOpeningHours`) | Replacing raw JSON imports across location & contact components |
| Form Schemas | `src/lib/validations/inquiry.ts` | Validating contact and inquiry form inputs |

---

## 5. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Prevention / Mitigation Strategy |
|---|---|
| **Form Custom City Overwritten on Select Change** | Reset `customCity` state to empty string when user selects a non-'Other' city from dropdown. |
| **Store Map Embed Breakage without `'use client'`** | `StoreMapEmbed` only renders an `<iframe>` with static props. Server rendering produces identical markup. |

---

## 6. Verification & Definition of Done

1. `npx tsc --noEmit` completes with zero errors.
2. `src/scripts/validate-location-components.ts` passes 100%.
3. `src/scripts/validate-form-components.ts` passes 100%.
4. `npm run build` succeeds with zero errors across all static pages.
