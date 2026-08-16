## 2026-08-15T13:07:53Z

You are Worker 2 (Milestone 2: Architectural Boundaries, Node Imports & HTML5 Nesting).
Your working directory is: c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_m2\
Your parent orchestrator is: 9e13bd04-d7a7-4bc1-a6f0-2e45323e13d0

MANDATORY FIRST STEP: Read ORIGINAL_REQUEST.md at c:\nooridigital_assets\my-projects\muscleworks\.agents\ORIGINAL_REQUEST.md (or c:\nooridigital_assets\my-projects\muscleworks\ORIGINAL_REQUEST.md) and Explorer 1 & 2 surveys at c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_survey_1\analysis.md and c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_survey_2\analysis.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Your Exclusive Write Ownership Files:
- `src/components/home/brands-marquee.tsx`
- `src/components/catalog/catalog-container.tsx`
- `src/components/product/authenticity-guarantee-box.tsx`
- `src/app/sitemap.ts`

Tasks for Milestone 2:
1. `src/components/home/brands-marquee.tsx` (MED-01 finding):
   - Eliminate Node `fs` / `path` usage (`fs.existsSync(path.join(process.cwd(), ...))`) which violates Client Component boundaries and serverless edge execution.
   - Refactor to pure data contract verification: check `Boolean(brand.logo?.url)` (and non-empty string).
2. `src/components/catalog/catalog-container.tsx` (MED-01 & MED-07 finding):
   - Replace nested `<main>` landmark tag with `<section aria-label="Supplement Catalog Products">` or semantic wrapper to fix HTML5 landmark nesting violation (document main is already in layout/page).
3. `src/components/product/authenticity-guarantee-box.tsx` (MED-01 & MED-07 finding):
   - Fix nested interactive elements: change `<a ...><Button ...>...</a>` to `<Button asChild><a ...>...</a></Button>`.
4. `src/app/sitemap.ts` (LOW-08 finding):
   - Ensure strict TypeScript return typing `MetadataRoute.Sitemap` from Next.js `next`.

Verification:
- Run `npx tsc --noEmit` (ensure 0 errors).
- Run `npm run lint` (ensure 0 errors).
- Run validation test scripts in `src/scripts/`.
- Document all modified files, diffs, and verification commands/results in `c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_m2\handoff.md`.

When complete, notify parent via send_message.
