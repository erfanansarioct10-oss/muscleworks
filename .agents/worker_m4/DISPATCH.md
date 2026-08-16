## 2026-08-15T13:55:00Z
Implement the remediations for Milestone 4 across the following files:
1. `src/components/catalog/search-modal.tsx`: Wire `trackSearchQuery` in debounced search completion and form submit.
2. `src/components/catalog/catalog-container.tsx`: Wire `trackCategoryView` in a `useEffect` responding to active category changes.
3. `src/components/product/product-card.tsx`: Wire `trackWhatsAppClick` on the quick-order WhatsApp action.
4. `src/lib/constants.ts`: Prune dead/unused constants (`STORE_PHONE_DISPLAY`, `STORE_WHATSAPP_DISPLAY`, `isStoreOpenToday`).
5. `src/types/actions.ts`: Prune dead type `InquiryPayload`.
6. `src/types/index.ts`: Remove the unused barrel file.
7. `src/scripts/check-dead-code.js`: Exclude `src/scripts/` test files from production caller scanning, whitelist `src/components/ui/` primitives, and add Next.js framework export filter.
8. `context/progress-tracker.md`: Update with comprehensive audit remediation notes across all milestones.

Read the handoff reports from the 3 Explorers:
- `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_m4_1\handoff.md`
- `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_m4_2\handoff.md`
- `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_m4_3\handoff.md`
- Also read `ORIGINAL_REQUEST.md` and `PROJECT.md`.

Verification:
- Run `npx tsc --noEmit` and `npm run lint`.
- Run `node src/scripts/check-dead-code.js`.
- Run all test scripts in `src/scripts/` to confirm 100% pass rate.
- Add a new validation test script `src/scripts/validate-m4-analytics-and-dead-code.ts` testing the analytics contracts and dead code pruning.

Document all changes, files touched, and test outputs in `c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_m4\handoff.md` and send a message when complete.
