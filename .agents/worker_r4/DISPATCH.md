## 2026-08-15T03:49:42Z
You are Worker R4 (teamwork_preview_worker) responsible for Milestone R4: WCAG AA Touch Targets & Defensive Optimizations.

Working Directory: c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_r4
Original Request Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\ORIGINAL_REQUEST.md
Audit Analysis Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\reviewer_1\analysis.md
Codebase Root: c:\nooridigital_assets\my-projects\muscleworks

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Assigned Findings to Remediate:
1. MIN-08: Deals section countdown timer tab-backgrounding interval drift
   - File: `src/components/home/deals-section.tsx`
   - Calculate remaining time from absolute target timestamp (`targetTimestamp - Date.now()`) on each tick and on `visibilitychange` event rather than decrementing internal counter state by 1 second.
2. MIN-09: Fragile inlined WhatsApp URL construction bypassing central engine
   - Files: `src/components/layout/header.tsx`, `src/components/home/deals-section.tsx`, `src/components/product/product-card.tsx` (and any other inlined wa.me links)
   - Replace manual `https://wa.me/...` string concatenations with calls to canonical `buildGeneralWhatsAppUrl()`, `buildProductInquiryWhatsAppUrl()`, or `buildDealInquiryWhatsAppUrl()` from `@/lib/services/whatsapp` (or `@/lib/whatsapp`).
3. MIN-10: Heading level skipping in homepage marketing sections
   - Files: `src/components/home/shop-by-goal-section.tsx`, `src/components/home/featured-categories.tsx`, `src/components/home/deals-section.tsx`, `src/components/home/hero-section.tsx`
   - Ensure proper sequential heading hierarchy (`h1` -> `h2` -> `h3` -> `h4`) without skipping levels (e.g. do not jump from `h2` directly to `h4`).
4. MIN-12: Non-string / object honeypot bypass at step 1 pre-check
   - Files: `src/lib/services/security.ts`, `src/actions/inquiry.ts`, `src/actions/contact.ts`
   - Check `typeof honeypotValue !== 'string' || honeypotValue.trim().length > 0` (or `isHoneypotTriggered(rawField)`) ensuring arrays, numbers, or objects passed as honeypots are caught immediately.
5. OPT-01: Redundant per-request Upstash Redis client re-instantiation
   - File: `src/lib/services/ratelimit.ts`
   - Create and cache a module-level singleton `Redis` instance when credentials exist (`let redisClient: Redis | null = null;`) so HTTP keep-alive connection pooling is preserved.
6. OPT-02: Redundant `'use client'` directive on static `StoreMapEmbed`
   - File: `src/components/location/store-map-embed.tsx` (or `src/components/store/store-map-embed.tsx`)
   - Remove `'use client'` if component is purely static iframe markup with no React hooks.
7. OPT-03: Outdated hardcoded phone number assertion in WhatsApp test suite
   - File: `src/scripts/validate-whatsapp-analytics.ts`
   - Align expected store phone number assertion with canonical `STORE_PHONE_WHATSAPP` / `STORE_PHONE` constant (`9779819877070`).
8. OPT-04: Honeypot input autofill defense hardening in form components
   - Files: `src/components/forms/inquiry-form.tsx`, `src/components/forms/contact-form.tsx`
   - Add `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`, and standard off-screen positioning styles to honeypot `<input name="hp_field">` to prevent accidental browser autofill.
9. OPT-05: Missing `sizes` attribute on logo `<Image fill>` components
   - Files: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `src/components/layout/navbar.tsx`
   - Add explicit `sizes="(max-width: 768px) 140px, 180px"` (or appropriate container dimensions) on fill/logo `<Image>` elements.
