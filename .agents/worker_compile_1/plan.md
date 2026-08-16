# Compilation & Verification Plan

## Step 1: Read Source Context & Reports
- Read `.agents/ORIGINAL_REQUEST.md` (## 2026-08-15T11:56:28Z)
- Read Explorer 1 Report (`.agents/explorer_graph_1/report.md`)
- Read Explorer 2 Report (`.agents/explorer_nextjs_1/report.md`)
- Read Explorer 3 Report (`.agents/explorer_security_a11y_1/report.md`)

## Step 2: Live Verification Execution
- Run `npx tsc --noEmit` using `run_command` in `c:\nooridigital_assets\my-projects\muscleworks`
- Run `npm run lint` using `run_command` in `c:\nooridigital_assets\my-projects\muscleworks`
- Record exact outputs, execution time, and exit codes

## Step 3: Verify and Cross-Reference Findings
- Verify finding IDs, files, lines, and AST node identifiers against code files and graph
- Structure findings into High, Medium, Low, Info categories
- Ensure unified diffs are exact and copy-paste ready

## Step 4: Synthesize Master AUDIT_REPORT.md
- Section 1: Executive Summary & Quality Scorecard (Grade, 6-pillar matrix, issue breakdown, graph stats)
- Section 2: Itemized Audit Findings (Ranked High -> Med -> Low -> Info with detailed unified diffs)
- Section 3: Dead Code & Orphan Node Ledger (Isolated nodes, unreferenced exports, legacy types)
- Section 4: Verification & Clean Build Confirmation (Live terminal logs, exit codes, non-destructive audit guarantee)

## Step 5: Handoff & Orchestrator Notification
- Write `.agents/worker_compile_1/handoff.md` (Observation, Logic Chain, Caveats, Conclusion, Verification Method)
- Send completion message to parent orchestrator (`49f0852d-311b-43b9-b2a1-ead6d5860704`)
