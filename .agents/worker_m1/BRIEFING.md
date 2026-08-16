# BRIEFING — 2026-08-15T12:58:00Z

## Mission
Execute Milestone 1: Data Access Layer & Direct JSON Import Remediation. Build `src/lib/data/reviews.ts`, eliminate direct JSON imports in components, wire typed props into `src/app/page.tsx`, `GuidesPage`, `CustomerReviewsSection`, `StoreMapEmbed`, `HomeFAQSection`, and clean up `src/lib/data/guides.ts`.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa
- Working directory: c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_m1\
- Original parent: 9e13bd04-d7a7-4bc1-a6f0-2e45323e13d0
- Milestone: Milestone 1 (Data Access Layer & Direct JSON Import Remediation)

## 🔒 Key Constraints
- Exclusive write ownership files:
  - `src/lib/data/reviews.ts`
  - `src/components/home/customer-reviews-section.tsx`
  - `src/components/location/store-map-embed.tsx`
  - `src/app/guides/page.tsx`
  - `src/lib/data/guides.ts`
  - `src/app/page.tsx`
  - `src/components/home/home-faq-section.tsx`
- Do not touch other files outside assigned scope.
- Next.js 16 App Router invariants (async params, Server vs Client boundaries).
- Mobile touch targets (≥44px/48px).
- Zero `any` policy, strict TypeScript.
- All implementations genuine, no hardcoding.

## Current Parent
- Conversation ID: 9e13bd04-d7a7-4bc1-a6f0-2e45323e13d0
- Updated: 2026-08-15T12:58:00Z

## Task Summary
- **What to build**:
  1. `src/lib/data/reviews.ts` created with Zod validation (`ReviewItemSchema`) and async getters `getReviews`, `getFeaturedReviews`, `getReviewById`.
  2. Refactored `src/components/home/customer-reviews-section.tsx` to receive `reviews` prop and eliminate raw JSON import, with $\ge 44$px pagination touch targets.
  3. Refactored `src/components/location/store-map-embed.tsx` to eliminate raw JSON import, using typed constants (`STORE_LOCATION`) and optional `storeInfo` prop.
  4. Refactored `src/app/guides/page.tsx` to async Server Component consuming `await getAllGuides()` instead of raw JSON.
  5. Cleaned up `src/lib/data/guides.ts` by removing dead `getGuides` legacy alias.
  6. Refactored `src/components/home/home-faq-section.tsx` to receive typed `faqs` prop and removed hardcoded FAQs.
  7. Refactored `src/app/page.tsx` to async Server Component fetching `getFeaturedFAQs(6)` and `getFeaturedReviews(6)` in parallel via `Promise.all` and passing down as typed props.

## Change Tracker
- **Files modified**:
  - `src/lib/data/reviews.ts` (created) — Zod-validated customer reviews data access layer
  - `src/components/home/customer-reviews-section.tsx` — Accepts typed `reviews` prop, eliminates direct JSON import, adds $\ge 44$px touch targets
  - `src/components/location/store-map-embed.tsx` — Uses `STORE_LOCATION` constants and optional `storeInfo` prop, eliminates raw JSON import
  - `src/app/guides/page.tsx` — Converted to async Server Component using `getAllGuides()` and safe author avatar rendering
  - `src/lib/data/guides.ts` — Removed unused `getGuides` backward-compat alias
  - `src/components/home/home-faq-section.tsx` — Accepts typed `faqs` prop, eliminates inline hardcoded FAQ array
  - `src/app/page.tsx` — Converted to async Server Component fetching `getFeaturedFAQs(6)` and `getFeaturedReviews(6)` in parallel
- **Build status**: Pass (`npx tsc --noEmit` 0 errors, `npm run lint` 0 errors)
- **Pending issues**: none

## Quality Status
- **Build/test result**: Pass (All test suites pass)
- **Lint status**: 0 errors, 0 warnings in `src/`
- **Tests added/modified**: Verified against `validate-store-faq-guide-accessors.ts`, `validate-location-components.ts`, `validate-supplementary-datasets.ts`, and programmatic `reviews.ts` accessor test

## Key Decisions Made
- Used `Promise.all([getFeaturedFAQs(6), getFeaturedReviews(6)])` in `src/app/page.tsx` for optimal parallel execution during static generation.
- Added $\ge 44$px bounding box touch targets on mobile pagination indicators in `CustomerReviewsSection`.
- Handled optional `guide.author.avatar` with initial fallback badge to preserve strict TypeScript safety.

## Artifact Index
- `.agents/worker_m1/DISPATCH.md` — Assignment instructions
- `.agents/worker_m1/progress.md` — Progress tracker
- `.agents/worker_m1/handoff.md` — Final handoff report
