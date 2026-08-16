# Challenge Plan — Challenger 2 (Sections 3 & 4 Verification)

## Objective
Empirically challenge, verify, and validate Section 3 (Dead Code & Orphan Node Ledger) and Section 4 (Verification & Clean Build Confirmation) of `AUDIT_REPORT.md`.

## Methodology & Execution Steps

1. **Step 1: Item-by-Item Empirical Verification of Section 3 Dead Code Ledger (Items 1-22)**
   - Item 1: `ConsultationModal` (`src/components/forms/consultation-modal.tsx:25-88`)
   - Item 2: `InquiryPayload` (`src/types/actions.ts:23-34`)
   - Item 3: `src/types/index.ts` (`src/types/index.ts:1-66`)
   - Item 4: `slugify` (`src/lib/utils.ts:49-59`)
   - Item 5: `formatPhoneNumber` (`src/lib/utils.ts:72-78`)
   - Item 6: `truncateText` (`src/lib/utils.ts:83-86`)
   - Item 7: `isStoreOpenToday` (`src/lib/constants.ts:61-86`)
   - Item 8: `STORE_LEGAL_NAME` (`src/lib/constants.ts:7`)
   - Item 9: `STORE_SHORT_TAGLINE` (`src/lib/constants.ts:10`)
   - Item 10: `STORE_PHONE_DISPLAY` (`src/lib/constants.ts:23`)
   - Item 11: `STORE_WHATSAPP_DISPLAY` (`src/lib/constants.ts:25`)
   - Item 12: `STORE_SUPPORT_EMAIL` (`src/lib/constants.ts:27`)
   - Item 13: `getGuides` (`src/lib/data/guides.ts:83`)
   - Item 14-18: `showSuccessToast`, `showErrorToast`, `showInfoToast`, `showWarningToast`, `showWhatsAppToast` (`src/components/ui/toast.tsx:6-54`)
   - Item 19-20: `SortOrderEnum` / `SortOrder`, `PaginationQuerySchema` (`src/lib/validations/common.ts:64-84`)
   - Item 21-22: `InquiryServerPayloadSchema`, `ActionResultSchema` (`src/lib/validations/inquiry.ts:82-99`)
   - For each item: Check production references in `src/app/`, `src/components/`, `src/actions/`, `src/lib/`, `src/proxy.ts`, `src/types/`. Note any test harness references in `src/scripts/`.

2. **Step 2: Verification of Clean Build & Tooling (Section 4)**
   - Run `npx tsc --noEmit` and capture exact exit code and stderr/stdout.
   - Run `npm run lint` and capture exact output.
   - Run `npm run build` and verify pre-rendered SSG route counts and output.
   - Run test scripts (`npx tsx src/scripts/test-challenger-2.ts`, `node src/scripts/check-dead-code.js`, etc.).
   - Check git status / diff to ensure zero destructive modifications were made to production source.

3. **Step 3: Synthesis & Report Generation**
   - Author `c:\nooridigital_assets\my-projects\muscleworks\.agents\challenger_audit_2\report.md` detailing all empirical test results, observations, logic chain, and verdict.
   - Author `c:\nooridigital_assets\my-projects\muscleworks\.agents\challenger_audit_2\handoff.md`.
   - Update `progress.md` and `BRIEFING.md`.

4. **Step 4: Dispatch Verdict Message to Orchestrator**
   - Send structured communication to conversation ID `49f0852d-311b-43b9-b2a1-ead6d5860704`.
