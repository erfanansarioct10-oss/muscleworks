# Plan — Audit Report Remediation (Worker 2)

## Goal
Integrate the 6 corrective findings and metric updates into `c:\nooridigital_assets\my-projects\muscleworks\AUDIT_REPORT.md` with complete precision, verified against the actual codebase.

## Steps
1. **Context & Review Ingestion**:
   - Read `c:\nooridigital_assets\my-projects\muscleworks\.agents\ORIGINAL_REQUEST.md`.
   - Read `c:\nooridigital_assets\my-projects\muscleworks\.agents\challenger_audit_1\report.md`.
   - Read `c:\nooridigital_assets\my-projects\muscleworks\.agents\reviewer_audit_2\report.md`.
   - Read `c:\nooridigital_assets\my-projects\muscleworks\AUDIT_REPORT.md`.

2. **Codebase Verification**:
   - Inspect `src/app/page.tsx` and `src/components/home/HomeFaqSection.tsx`.
   - Inspect `src/app/guides/page.tsx` and `src/lib/data/guides.ts`.
   - Inspect `src/components/home/FeaturedProductsSection.tsx`.
   - Inspect `src/components/home/CustomerReviewsSection.tsx`.
   - Inspect `src/components/catalog/BrandFilter.tsx`.

3. **Remediation & Diff Crafting**:
   - Update Section 1: Executive Summary & Metrics (Total 20: 0 High, 8 Medium, 10 Low, 2 Info).
   - Update Section 2: Detailed Findings:
     - Fix MED-03 diff (Server prop passing in `src/app/page.tsx` + `HomeFaqSection.tsx`).
     - Insert MED-08 finding (Direct JSON import bypass in `src/app/guides/page.tsx`).
     - Fix LOW-09 diff (Target actual `<a>` tag with min 48px conversion CTA).
     - Fix LOW-10 diff (Preserve scrollToCard(i) & theme tokens with 44x44px hitbox).
     - Fix INFO-02 diff (Preserve brand.slug toggling with aria-label).
   - Update Section 3: Prioritized Remediation Roadmap & Summary Table to include MED-08 and reflect 20 findings.
   - Update Section 4: Architecture & Quality Verification (remove `/guides/[slug]` from Section 4.3 route table, verify all sections).

4. **Self-Critique & Verification**:
   - Verify all 20 findings are present and correctly categorized.
   - Verify every diff matches actual source files.
   - Verify markdown formatting and structure.

5. **Reporting & Handoff**:
   - Write `handoff.md` with 5 required sections.
   - Send notification message to parent agent.
