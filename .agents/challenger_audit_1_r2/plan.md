# Challenger 1 Round 2 Verification Plan

## Objective
Verify that all 6 defects identified in Round 1 on `c:\nooridigital_assets\my-projects\muscleworks\AUDIT_REPORT.md` have been correctly remediated by Worker 2, re-evaluate the entire report for any remaining regressions or inconsistencies, run build/typecheck verification, and deliver the final verdict.

## Verification Checklist

1. **Defect 1: MED-03 Diff (Server Component prop passing pattern for `faqs`)**
   - Check if `AUDIT_REPORT.md` MED-03 has been rewritten to either pass `faqs` from `src/app/page.tsx` async Server Component or use a safe synchronous data access pattern.
   - Verify diff syntax and AST against `src/app/page.tsx` and `src/components/home/home-faq-section.tsx`.

2. **Defect 2: MED-08 Finding (`src/app/guides/page.tsx:6` direct `@/data/guides.json` import)**
   - Check if MED-08 is properly documented in Section 2 as a Medium severity finding.
   - Verify that line references, graph node, root cause, and proposed diff using `getAllGuides()` from `@/lib/data/guides` are accurate.

3. **Defect 3: LOW-09 Diff (Targeting actual `<a>` tag with `min-h-[48px]`)**
   - Check if the diff matches the actual AST in `src/components/home/featured-products-section.tsx` lines ~177-185 without hallucinating `<Button asChild>`.

4. **Defect 4: LOW-10 Diff (Preserving `scrollToCard(i)` and design system styling while wrapping dots in 44x44px hit-box)**
   - Check if `src/components/home/customer-reviews-section.tsx` diff preserves `scrollToCard(i)`, wraps indicator in 44x44 hit-box, and retains slate color classes (`bg-slate-900`/`bg-slate-300`).
   - Check if `src/components/layout/footer.tsx` diff uses correct variable name (`legal.href`/`legal.label`).

5. **Defect 5: INFO-02 Diff (Preserving `brand.slug` filter toggling with aria-label)**
   - Check if `src/components/catalog/brand-filter.tsx` diff preserves `onChange={() => onToggleBrand?.(brand.slug)}` and adds `aria-label`.

6. **Defect 6: Section 4.3 Route Table (Removed `/guides/[slug]`)**
   - Check if Section 4.3 route table lists `/guides` accurately without the non-existent `/guides/[slug]` route.

7. **Holistic Audit Report Check:**
   - Executive Summary metrics & counts (Scorecard numbers, total issues, severity counts).
   - Dead Code & Orphan Node Ledger accuracy.
   - TypeScript compilation (`npx tsc --noEmit`) and linter (`npm run lint`).
   - Test suites verification.

8. **Final Deliverable & Handoff:**
   - Write comprehensive evaluation in `report.md`.
   - Write 5-component `handoff.md`.
   - Send completion message to parent orchestrator.
