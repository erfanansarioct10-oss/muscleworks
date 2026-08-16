# Plan: Next.js 16 / React 19 & TypeScript Forensic Audit

## Objective
Audit the MuscleWorks codebase for Next.js 16 / React 19 compliance, edge proxy architecture, strict TypeScript typing (zero `any`), and modern ECMAScript idioms, delivering an itemized forensic report with copy-paste diffs and AST graph node mappings.

## Phases
1. **Context & Graph Inspection**: Inspect `graphify-out/GRAPH_REPORT.md` and `graphify-out/graph.json` to understand communities, node mappings, and architecture.
2. **Next.js 16 App Router & Route Params Audit**:
   - Inspect every `page.tsx`, `layout.tsx`, `template.tsx`, `route.ts` in `src/app/`.
   - Verify `params` and `searchParams` Promise handling (Next.js 16 breaking change: `PageProps` has `params: Promise<...>`, `searchParams: Promise<...>`).
3. **Server vs. Client Boundary & Secret Leakage Audit**:
   - Check all `'use client'` directives across `src/components/`, `src/app/`, `src/lib/`.
   - Ensure `'use client'` is only on interactive leaf components.
   - Verify zero server secret usage (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `UPSTASH_*`, `process.env.*`) or Node-only APIs (`fs`, `path`, `crypto`) in client-side modules.
4. **Edge Routing & Proxy Audit**:
   - Check `src/proxy.ts` implementation, security headers, routing logic, export conventions.
   - Verify absence of legacy `middleware.ts`.
5. **Strict TypeScript & Type Safety Audit**:
   - Grep for `any`, `as unknown as`, unvalidated `as`, and type assertions.
   - Check validation with Zod schemas (`z.infer<typeof ...>`) across data accessors, actions, and UI props.
   - Run type check `npx tsc --noEmit` if needed.
6. **Modern ECMAScript & React 19 Idioms Audit**:
   - Check for optional chaining `?.`, nullish coalescing `??`, immutable array methods (`toSorted`, `toReversed`, `filter`, `map`, `reduce`, `Object.entries`).
   - Check for legacy mutable loops, `var`, `==` loose equality, or outdated React 18 patterns.
7. **Report Compilation & Handoff**:
   - Generate `report.md` with complete findings, graph node IDs, communities, severity, root cause/impact, and unified diff fixes.
   - Write 5-component `handoff.md`.
