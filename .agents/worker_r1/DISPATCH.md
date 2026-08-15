## 2026-08-15T09:22:24Z

You are Worker R1 (teamwork_preview_worker) responsible for Milestone R1: Security, Form Locking & Data Integrity Fixes.

Working Directory: c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_r1
Original Request Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\ORIGINAL_REQUEST.md
Audit Analysis Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\reviewer_1\analysis.md
Codebase Root: c:\nooridigital_assets\my-projects\muscleworks

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Assigned Findings to Remediate:
1. CRIT-01: Timing trap clock-skew false positives & silent order dropping
   - Files: `src/lib/services/security.ts`, `src/actions/inquiry.ts`, `src/actions/contact.ts`
   - Implement `isTimingTrapTriggered` with `MAX_CLOCK_SKEW_MS = 120000` tolerance.
2. CRIT-02: Category archive route displays entire store catalog
   - File: `src/app/categories/[slug]/page.tsx`
   - Use `getProductsByCategory(category.slug)` instead of `getProducts()`.
3. MAJ-01: Form submission mutex race condition (double-submit vulnerability)
   - Files: `src/components/forms/inquiry-form.tsx`, `src/components/forms/contact-form.tsx`
   - Add `isSubmittingRef = useRef(false)` mutex lock synchronously before `startTransition`.
4. MAJ-02: Telegram Bot MarkdownV2 over-escaping in inline code entities
   - File: `src/lib/services/telegram.ts`
   - Separate `escapeMarkdownV2` (full text escaping) from inline code escaping (only `\` and `` ` ``).
5. MAJ-03: Rate limit bypass via `X-Forwarded-For` client header spoofing
   - File: `src/lib/services/ratelimit.ts`
   - Use rightmost/trusted IP extraction from `x-forwarded-for` (e.g. `headers.get('x-real-ip') || forwardedFor.split(',').pop()?.trim()`).
6. MAJ-06: Hardcoded dummy phone & WhatsApp link country code omission in emails
   - Files: `src/emails/inquiry-notification.tsx`, `src/emails/contact-notification.tsx`, `src/emails/order-confirmation.tsx`
   - Import canonical phone from `@/lib/constants` and normalize customer phone with `977` prefix for WhatsApp links (`https://wa.me/977...`).
7. MAJ-11: Canonical store hours & delivery threshold data discrepancies
   - Files: `src/lib/constants.ts`, `data/store.json`
   - Align store closing hours to 8:00 PM (20:00) and free delivery threshold to NPR 5,000 across all constants and store.json.
8. MIN-01: Nepal phone regex rejects formatted numbers with internal separators
   - File: `src/lib/validations/common.ts`
   - Strip spaces and hyphens with `.replace(/[\s-]/g, '')` before validating Nepal phone regex `^(?:\+?977[- ]?)?9[78]\d{8}$`.
9. MIN-03: Unbounded in-memory Map memory growth in rate limiter fallback
   - File: `src/lib/services/ratelimit.ts`
   - Add periodic eviction / LRU cap (e.g., max 10,000 entries and sweep expired timestamps).
10. MIN-04: Rate limit quota consumed by pre-validation user input typos
   - Files: `src/actions/inquiry.ts`, `src/actions/contact.ts`
   - Move honeypot & Zod schema validation BEFORE consuming the rate limit token.
11. MIN-05: Single-pass regex sanitizer tag evasion & text bracket deletion
   - File: `src/lib/services/security.ts`
   - Use iterative loop regex stripping or character entity replacement that preserves legitimate `<` / `>` comparisons while neutralizing HTML tags.

Exclusive File Ownership:
- `src/lib/services/security.ts`
- `src/actions/inquiry.ts`
- `src/actions/contact.ts`
- `src/app/categories/[slug]/page.tsx`
- `src/components/forms/inquiry-form.tsx`
- `src/components/forms/contact-form.tsx`
- `src/lib/services/telegram.ts`
- `src/lib/services/ratelimit.ts`
- `src/emails/inquiry-notification.tsx`
- `src/emails/contact-notification.tsx`
- `src/emails/order-confirmation.tsx`
- `src/lib/constants.ts`
- `data/store.json`
- `src/lib/validations/common.ts`
