# Orchestration Plan: MUSCLEWORKS Full Codebase Audit

## Scope & Target Domains
1. **R1: Concurrency, Race Conditions & State Inconsistencies**
   - Search input debouncing, stale network responses, AbortController handling
   - Form submission double-submit locking & pending state handling
   - `Asia/Kathmandu` store opening hours / status hydration mismatch between server and client
   - Shared mutable state in server actions or client hooks

2. **R2: Logic Bugs, Edge Cases & Data Integrity**
   - WhatsApp URL generator (`wa.me`) query parameter encoding, special characters handling, newlines, phone prefix formatting
   - Telegram Bot API integration: MarkdownV2 escaping completeness, error handling/silent swallowing, network timeouts
   - Phone number regex validation (`+977...`), pricing arithmetic, currency formatting
   - JSON datasets (`src/data/` or similar): referential integrity, duplicate IDs, missing fields, schema mismatches

3. **R3: Security, Anti-Spam & Defensive Coding**
   - Honeypot (`hp_field`) implementation & browser autofill protection
   - Timing trap (e.g. 2000ms minimum threshold) validation & spoofability
   - In-memory rate limiting: memory leaks, IP spoofing (`x-forwarded-for`), edge/serverless ephemeral instance behavior
   - Input sanitization, XSS vectors in user inputs, dangerous HTML rendering, environment variable exposure (`NEXT_PUBLIC_` leaks)

4. **R4: Next.js 16 App Router, TypeScript Strict & WCAG AA Standards**
   - Next.js 16 breaking changes: `await params` and `await searchParams` in dynamic pages/layouts
   - `src/proxy.ts` routing/proxying conventions vs legacy `middleware.ts`
   - TypeScript strict compliance: zero `any`, safe nullable handling, exhaustive switch/union checks
   - Client vs Server Component separation (`'use client'` boundary cleanliness)
   - Accessibility (WCAG AA): Mobile touch targets >=44x44px (>=48x48px for conversion CTAs), color contrast, ARIA labels, form labeling, keyboard navigability

5. **R5: Severity-Ranked Final Deliverable**
   - Ranked strictly into Critical, Major, Minor, and Optimization/Nitpick
   - Each finding includes: File path, exact line references, Root cause, Impact analysis, Copy-paste ready code diff.

## Execution Topology
- **Phase 1: Parallel Exploration (4 Domain Explorers)**
  - Explorer 1: R1 Concurrency & State Inconsistencies
  - Explorer 2: R2 Logic Bugs, Edge Cases & Data Integrity
  - Explorer 3: R3 Security, Anti-Spam & Defensive Coding
  - Explorer 4: R4 Next.js 16 App Router, TypeScript & WCAG AA
- **Phase 2: Review & Verification**
  - Reviewer / Challenger checks findings for false positives, line accuracy, and diff correctness
- **Phase 3: Synthesis & Final Deliverable**
  - Synthesize findings into structured master audit document and notify caller
