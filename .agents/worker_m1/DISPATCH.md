## 2026-08-15T12:47:22Z

You are Worker 1 (Milestone 1: Data Access Layer & Direct JSON Import Remediation).
Your working directory is: c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_m1\
Your parent orchestrator is: 9e13bd04-d7a7-4bc1-a6f0-2e45323e13d0

MANDATORY FIRST STEP: Read ORIGINAL_REQUEST.md at c:\nooridigital_assets\my-projects\muscleworks\.agents\ORIGINAL_REQUEST.md (or c:\nooridigital_assets\my-projects\muscleworks\ORIGINAL_REQUEST.md) and the Explorer analysis at c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_survey_1\analysis.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Exclusive Write Ownership Files:
- `src/lib/data/reviews.ts` (create)
- `src/components/home/customer-reviews-section.tsx`
- `src/components/store/store-map-embed.tsx`
- `src/app/guides/page.tsx`
- `src/lib/data/guides.ts`
- `src/app/page.tsx`
- `src/components/home/home-faq-section.tsx`

Tasks for Milestone 1:
1. Create `src/lib/data/reviews.ts`:
   - Import raw `@/data/reviews.json`.
   - Define/use Zod schema for Review validation matching `context/data-models.md`.
   - Export async `getReviews(): Promise<Review[]>` and async `getFeaturedReviews(limit?: number): Promise<Review[]>`.
2. Refactor `src/components/home/customer-reviews-section.tsx`:
   - Eliminate direct import of `@/data/reviews.json`.
   - Accept typed reviews prop: `interface CustomerReviewsSectionProps { reviews?: Review[] }` (falling back to initial reviews if needed, or passed from `src/app/page.tsx`).
   - In `src/app/page.tsx`, fetch `const reviews = await getFeaturedReviews(6)` and pass `reviews={reviews}` to `<CustomerReviewsSection reviews={reviews} />`.
3. Refactor `src/components/store/store-map-embed.tsx`:
   - Eliminate direct import of `@/data/store-info.json`.
   - Use `getStoreInfo()` from `@/lib/data/store` (or accept `storeInfo` prop if rendered from Server Component).
4. Refactor `src/app/guides/page.tsx`:
   - Convert to `export default async function GuidesPage()`.
   - Fetch `const guides = await getAllGuides()` from `@/lib/data/guides` instead of raw `@/data/guides.json`.
5. Clean up `src/lib/data/guides.ts`:
   - Remove unused legacy alias `getGuides` (ensure all callers use `getAllGuides()`).
6. Refactor `HomeFAQSection` & `src/app/page.tsx`:
   - In `src/app/page.tsx`, fetch `const faqs = await getFeaturedFAQs(6)` from `@/lib/data/faqs` and pass `faqs={faqs}` to `<HomeFAQSection faqs={faqs} />`.
   - In `src/components/home/home-faq-section.tsx`, remove hardcoded 6 FAQ objects and receive `faqs` as typed prop `interface HomeFAQSectionProps { faqs: FAQ[] }` (or `faqs?: FAQ[]`).

Verification:
- Run `npx tsc --noEmit` and check for 0 errors.
- Run `npm run lint` (or relevant lint scripts).
- Run existing test scripts in `src/scripts/` (e.g. `node src/scripts/test-data-contracts.js`).
- Document all modified files, diffs, and verification commands/results in `c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_m1\handoff.md`.

When complete, notify parent via send_message.
