# Milestone 4 Investigation Report: Dead Code & Types Pruning (LOW-05, LOW-06)

**Auditor/Agent:** Explorer M4-2 (`explorer_m4_2`)  
**Scope:** `src/lib/constants.ts`, `src/types/actions.ts`, `src/types/index.ts`  
**Related Audit Findings:** LOW-05, LOW-06  

---

## 1. Observation

Direct code inspections and codebase-wide grep searches across all 72 production source files, 7 static datasets, and 20 test scripts yielded the following empirical findings:

### 1.1 `src/lib/constants.ts` (LOW-05)
- **`STORE_PHONE_DISPLAY` (Line 23):**
  - Code content: `export const STORE_PHONE_DISPLAY = STORE_PHONE;`
  - Grep search `STORE_PHONE_DISPLAY` across `src/`: Exactly 1 match (defining file `src/lib/constants.ts:23`).
  - `src/emails/CustomerInquiryConfirmation.tsx` (Line 15, 145) directly imports and renders `STORE_PHONE`.
  - External callers across entire codebase: **0**.
- **`STORE_WHATSAPP_DISPLAY` (Line 25):**
  - Code content: `export const STORE_WHATSAPP_DISPLAY = "+977 986-1725036";`
  - Grep search `STORE_WHATSAPP_DISPLAY` across `src/`: Exactly 1 match (defining file `src/lib/constants.ts:25`).
  - WhatsApp URLs and CTAs consume `STORE_WHATSAPP` and `STORE_PHONE` directly.
  - External callers across entire codebase: **0**.
- **`isStoreOpenToday` (Lines 61-86):**
  - Code content: `export function isStoreOpenToday(date: Date = new Date()): boolean { ... }`
  - Grep search `isStoreOpenToday` across `src/`: Exactly 1 match (defining file `src/lib/constants.ts:61`).
  - Active store opening hours logic is handled dynamically by `isStoreOpenNow()` in `src/lib/data/store.ts` (consumed by `src/components/location/store-hours-card.tsx:6, 50` and test suites).
  - External callers across entire codebase: **0**.

### 1.2 `src/types/actions.ts` (LOW-06 / Dead Type)
- **`InquiryPayload` (Lines 20-34):**
  - Code content:
    ```typescript
    export interface InquiryPayload {
      name: string;
      phone: string;
      city: string;
      message?: string;
      productSlug?: string;
      productName?: string;
      variantName?: string;
      preferredContactMethod?: "whatsapp" | "phone";
      hp_field?: string; // Honeypot trap
      submissionTimestamp?: number;
    }
    ```
  - Grep search `InquiryPayload` across `src/`: Exactly 1 match in `src/types/actions.ts:23` (occurrences in `validate-server-actions.ts` are a variable name `validInquiryPayload` typed as `InquiryFormClientValues`).
  - Form components (`InquiryForm`, `ContactForm`) and Server Actions (`submitInquiryAction`, `submitContactAction`) consume Zod-inferred types `InquiryFormClientValues` from `@/lib/validations/inquiry` and `ContactFormValues` from `@/lib/validations/contact`.
  - Legacy field names (`name`, `phone`, `city`) directly conflict with canonical schema field names (`fullName`, `phoneNumber`, `deliveryCity`).
  - External callers across entire codebase: **0**.
- **`ActionResult<T>`, `ActionSuccess<T>`, `ActionError` (Lines 6-18):**
  - Actively imported and consumed by `src/actions/inquiry.ts:7`, `src/actions/contact.ts:7`, and `src/lib/services/security.ts:1`.
  - Must remain intact.

### 1.3 `src/types/index.ts` (LOW-06 / Dead Barrel File)
- **File Structure & Contents:** 66 lines defining `NavItem`, `BreadcrumbItem`, `SocialLink`, `TrustPillar`, `DeliveryCity`, `SortOption`, `FilterState`, `ProductBadgeVariant`.
- **Import Analysis:**
  - Grep search for `from '@/types'`, `from "@/types"`, `from '@/types/index'`, `from "@/types/index"`, `from '../types'`, `from './types'` across `src/`: **0 matches**.
  - All active domain types are imported from their canonical source modules:
    - Navigation items use `MAIN_NAV_ITEMS` in `@/lib/constants`.
    - `BreadcrumbItem` in UI views is imported from `@/components/ui/breadcrumb` as a React component.
    - Sorting options use `CatalogSortOption` from `@/lib/catalog`.
    - Filter state uses `CatalogFilterOptions` from `@/lib/catalog`.
    - Inquiry & Contact schemas use `@/lib/validations/inquiry` and `@/lib/validations/contact`.
    - Server Action envelopes use `@/types/actions`.
  - External callers across entire codebase: **0**.

---

## 2. Logic Chain

1. **Constants Cleanup Logic:**
   - Observations in 1.1 demonstrate that `STORE_PHONE_DISPLAY` and `STORE_WHATSAPP_DISPLAY` are redundant aliases of `STORE_PHONE` and have no consumers.
   - `isStoreOpenToday()` was superseded by `isStoreOpenNow()` in `src/lib/data/store.ts` when timezone-aware dynamic opening status checks were moved to the data layer.
   - Removing lines 23, 25, and 61-86 from `src/lib/constants.ts` eliminates dead code without breaking any AST dependencies.

2. **Actions Type Cleanup Logic:**
   - Observations in 1.2 demonstrate that `InquiryPayload` is pre-Zod scaffolding with outdated field names.
   - All server actions and client forms strictly typecheck against Zod-inferred types (`InquiryFormClientValues`).
   - Removing `InquiryPayload` from `src/types/actions.ts` leaves the essential `ActionResult<T>`, `ActionSuccess<T>`, and `ActionError` contracts clean and isolated.

3. **Types Barrel File Elimination Logic:**
   - Observations in 1.3 demonstrate that `src/types/index.ts` is never imported anywhere in the project.
   - Path mapping in `tsconfig.json` (`"@/*": ["./src/*"]`) allows `@/types/actions` to resolve directly to `src/types/actions.ts` without requiring a barrel file.
   - Deleting `src/types/index.ts` eliminates duplicate type declarations and prevents developers from importing outdated types.

---

## 3. Caveats

- `src/types/actions.ts` must NOT be deleted, only edited to remove `InquiryPayload`, because `ActionResult` is actively imported by `src/actions/inquiry.ts`, `src/actions/contact.ts`, and `src/lib/services/security.ts`.
- `src/types/review.ts` is an existing small file in `src/types/`; deleting `src/types/index.ts` does not affect `src/types/review.ts` or `src/types/actions.ts`.
- `STORE_LEGAL_NAME`, `STORE_SHORT_TAGLINE`, and `STORE_SUPPORT_EMAIL` in `src/lib/constants.ts` are brand identity constants; retaining them causes no harm, but `STORE_PHONE_DISPLAY`, `STORE_WHATSAPP_DISPLAY`, and `isStoreOpenToday` are the specific targets identified in the audit.

---

## 4. Conclusion & Actionable Instructions

### 4.1 Target 1: `src/lib/constants.ts`
**Action:** Remove `STORE_PHONE_DISPLAY`, `STORE_WHATSAPP_DISPLAY`, and `isStoreOpenToday()`.

```diff
--- a/src/lib/constants.ts
+++ b/src/lib/constants.ts
@@ -20,9 +20,7 @@ export const DEFAULT_PRODUCT_PLACEHOLDER = "/brnding-assets/logo.webp";
 // Contact & Ordering Details
 export const STORE_PHONE = "+977 986-1725036";
 export const STORE_PHONE_RAW = "+9779861725036";
-export const STORE_PHONE_DISPLAY = STORE_PHONE;
 export const STORE_WHATSAPP = "+9779861725036";
-export const STORE_WHATSAPP_DISPLAY = "+977 986-1725036";
 export const STORE_EMAIL = "orders@muscleworksnepal.com";
 export const STORE_SUPPORT_EMAIL = "support@muscleworksnepal.com";
 
@@ -58,30 +56,5 @@ export const STORE_HOURS = {
   closingTime: "20:00",
 } as const;
 
-/**
- * Dynamic calculation of whether the Golfutar store is open today at request time in Asia/Kathmandu.
- */
-export function isStoreOpenToday(date: Date = new Date()): boolean {
-  try {
-    const formatter = new Intl.DateTimeFormat("en-US", {
-      timeZone: "Asia/Kathmandu",
-      weekday: "short",
-      hour: "numeric",
-      hour12: false,
-    });
-    const parts = formatter.formatToParts(date);
-    let weekday = "";
-    let hour = 0;
-    
-    for (const part of parts) {
-      if (part.type === "weekday") weekday = part.value;
-      if (part.type === "hour") hour = parseInt(part.value, 10);
-    }
-    
-    // Saturday: contact required / closed for regular retail walk-ins
-    if (weekday === "Sat") return false;
-    
-    // Sun - Fri: 10:00 AM (10) - 8:00 PM (20)
-    return hour >= 10 && hour < 20;
-  } catch {
-    return false;
-  }
-}
-
 // Delivery Promises & Rules for Nepal
```

### 4.2 Target 2: `src/types/actions.ts`
**Action:** Remove dead `InquiryPayload` interface and JSDoc.

```diff
--- a/src/types/actions.ts
+++ b/src/types/actions.ts
@@ -18,17 +18,3 @@ export type ActionError = {
 
 export type ActionResult<T = void> = ActionSuccess<T> | ActionError;
-
-/**
- * Standard payload for contact & product consultation inquiries.
- */
-export interface InquiryPayload {
-  name: string;
-  phone: string;
-  city: string;
-  message?: string;
-  productSlug?: string;
-  productName?: string;
-  variantName?: string;
-  preferredContactMethod?: "whatsapp" | "phone";
-  hp_field?: string; // Honeypot trap
-  submissionTimestamp?: number;
-}
```

### 4.3 Target 3: `src/types/index.ts`
**Action:** Delete `src/types/index.ts` entirely.
- Powershell command: `Remove-Item -Path "src/types/index.ts" -Force`
- Or standard filesystem deletion.

---

## 5. Verification Method

To independently verify these changes:

1. **Verify 0 Import Usages Before/After Deletion:**
   ```powershell
   # Check constants
   Select-String -Path "src\**\*.ts", "src\**\*.tsx" -Pattern "STORE_PHONE_DISPLAY|STORE_WHATSAPP_DISPLAY|isStoreOpenToday"
   
   # Check InquiryPayload
   Select-String -Path "src\**\*.ts", "src\**\*.tsx" -Pattern "\bInquiryPayload\b"
   
   # Check types barrel imports
   Select-String -Path "src\**\*.ts", "src\**\*.tsx" -Pattern "from ['\"].*types['\"]"
   ```
   *Expected result: Zero occurrences found outside the defining modules.*

2. **TypeScript Strict Typecheck:**
   ```powershell
   npx tsc --noEmit
   ```
   *Expected result: No type errors caused by constants, actions types, or missing barrel imports.*

3. **Dead Code Scanner:**
   ```powershell
   node src/scripts/check-dead-code.js
   ```
   *Expected result: `STORE_PHONE_DISPLAY`, `STORE_WHATSAPP_DISPLAY`, `isStoreOpenToday`, `InquiryPayload`, and `src/types/index.ts` are eliminated from the unreferenced exports report.*
