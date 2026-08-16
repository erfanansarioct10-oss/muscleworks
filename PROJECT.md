# Project: MUSCLEWORKS SUPPLEMENTS — Audit Remediation

## Architecture
- Next.js 16.3.0 App Router, React 19.2.8, Tailwind CSS v4, TypeScript 5 Strict.
- Data Access Layer via `src/lib/data/*.ts` with Zod schema validation (`src/lib/validations/*.ts`).
- Server Components by default with client leaf components.
- Mobile-first touch targets (≥44px standard, ≥48px conversion CTAs), WCAG AA accessibility, zero direct JSON bypasses.

## Feature Inventory
| # | Finding ID | Description | Milestone | Source | Status |
|---|------------|-------------|-----------|--------|--------|
| 1 | MED-01 | Boundary Violations (HomeFAQSection, BrandsMarquee, CatalogContainer, AuthenticityGuaranteeBox) | M1 & M2 | AUDIT_REPORT.md | RESOLVED |
| 2 | MED-02 | Client Component Hooks & Server Action Telemetry | M4 | AUDIT_REPORT.md | RESOLVED |
| 3 | MED-03 | Dynamic Route Async Constraints (`await params` / async pages) | M1 & M2 | AUDIT_REPORT.md | RESOLVED |
| 4 | MED-04 | Direct Raw JSON Imports Bypassing Data Access Layer | M1 | AUDIT_REPORT.md | RESOLVED |
| 5 | MED-05 | Data Access Layer & Zod Validation Conformance | M1 | AUDIT_REPORT.md | RESOLVED |
| 6 | MED-06 | Cache Tagging & SSG Data Access Consistency | M1 | AUDIT_REPORT.md | RESOLVED |
| 7 | MED-07 | HTML5 Accessibility Nesting Violations | M2 | AUDIT_REPORT.md | RESOLVED |
| 8 | MED-08 | Missing Custom Analytics Event Dispatches | M4 | AUDIT_REPORT.md | RESOLVED |
| 9 | LOW-01 | Sub-standard Touch Targets (<44px / <48px) | M3 | AUDIT_REPORT.md | RESOLVED |
| 10 | LOW-02 | Missing ARIA attributes & Dialog Accessibility | M3 | AUDIT_REPORT.md | RESOLVED |
| 11 | LOW-03 | Form Field Accessibility Conformance | M3 | AUDIT_REPORT.md | RESOLVED |
| 12 | LOW-04 | Button Contrast & Focus States | M3 | AUDIT_REPORT.md | RESOLVED |
| 13 | LOW-05 | Dead Code in Constants | M4 | AUDIT_REPORT.md | RESOLVED |
| 14 | LOW-06 | Dead Types & Unused Barrel | M4 | AUDIT_REPORT.md | RESOLVED |
| 15 | LOW-07 | Legacy Aliases in Data Layer | M1 | AUDIT_REPORT.md | RESOLVED |
| 16 | LOW-08 | Strict Sitemap Typing | M2 | AUDIT_REPORT.md | RESOLVED |
| 17 | LOW-09 | React 19 Concurrent Transitions | M3 | AUDIT_REPORT.md | RESOLVED |
| 18 | LOW-10 | Test Harness Caller Detection Exclusion | M4 | AUDIT_REPORT.md | RESOLVED |
| 19 | INFO-01 | Documentation & Progress Tracker Sync | M4 & M5 | AUDIT_REPORT.md | RESOLVED |
| 20 | INFO-02 | Codebase Knowledge Graph Sync | M5 | AUDIT_REPORT.md | RESOLVED |

## Milestones
| # | Milestone Name | Scope | Dependencies | Status |
|---|----------------|-------|--------------|--------|
| 1 | M1: Data Access Layer & Direct JSON Imports | MED-04, MED-05, MED-06, LOW-07, MED-01 (FAQ server fetch) | None | DONE |
| 2 | M2: Architectural Boundaries, Node Imports & HTML5 Nesting | MED-01 (Marquee fs), MED-03, MED-07, LOW-08 | M1 | DONE |
| 3 | M3: Touch Targets, ARIA Attributes & Interaction States | LOW-01, LOW-02, LOW-03, LOW-04, LOW-09 | M2 | DONE |
| 4 | M4: Analytics Dispatches, Dead Code Pruning & Test Harness | MED-02, MED-08, LOW-05, LOW-06, LOW-10, INFO-01 | M3 | DONE |
| 5 | M5: Verification & Knowledge Graph Synchronization | 100% test suites in `src/scripts/`, `tsc`, `lint`, `/graphify --update` | M1..M4 | DONE |
