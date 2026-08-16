# Execution Plan: Knowledge Graph & Dead Code Forensic Audit

## Objective
Analyze the codebase knowledge graph (`graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md`), trace community clusters and cross-boundary architecture, audit for dead/isolated/orphaned code and unused exports, verify static data integrity, and compile an itemized forensic report with copy-paste fix diffs.

## Phases
1. **Phase 1: Knowledge Graph Inspection & Cluster Mapping**
   - Read `graphify-out/GRAPH_REPORT.md` and parse `graphify-out/graph.json` structure.
   - Map key community clusters: WhatsApp Ordering Engine, Server Actions & Notifications, Rate Limiting & Security, Authenticity Verification, Static Catalog Data.
   - Map cross-boundary flows: UI components (`src/components/`) -> Server Actions (`src/actions/`) -> Zod validation (`src/lib/validations/`) -> static data accessors (`src/lib/data/`) -> proxy edge middleware (`src/proxy.ts`).

2. **Phase 2: Dead Code & Isolated Node Forensics**
   - Inspect isolated / low-degree / unreferenced nodes in `graphify-out/graph.json`.
   - Run and analyze `node src/scripts/check-dead-code.js` to assess component reference graph.
   - Scan all `src/` modules for unused exports, unreferenced helpers, orphaned components, and dead functions using code search & graph traversal.
   - Audit static data in `src/data/` and `src/content/` for unreferenced datasets, stale records, or broken references.

3. **Phase 3: Deep Dives & Finding Compilation**
   - Verify every suspected dead code or architectural boundary violation with direct file inspection (`view_file`).
   - Categorize severity (High, Medium, Low, Info) and determine root cause & concrete impact.
   - Draft exact unified diff fix proposals for each finding.

4. **Phase 4: Synthesis, Report & Handoff**
   - Compile full findings into `report.md`.
   - Author 5-component `handoff.md` (Observation, Logic Chain, Caveats, Conclusion, Verification Method).
   - Update `progress.md` and `BRIEFING.md`.
   - Send completion message to orchestrator.
