# Original User Request

## Initial Request — 2026-08-15T08:51:17+05:45

You are the Project Orchestrator for the comprehensive code quality, concurrency, logic bug, security, and Next.js 16/WCAG audit of the MUSCLEWORKS SUPPLEMENTS Next.js 16 App Router codebase.

Working Directory: c:\nooridigital_assets\my-projects\muscleworks\.agents\orchestrator_1
User Request Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\ORIGINAL_REQUEST.md
Codebase Root: c:\nooridigital_assets\my-projects\muscleworks

Decompose and execute the full audit across all required domains:
1. R1: Concurrency, Race Conditions & State Inconsistencies (Search debouncing/aborts, form submission locking, Asia/Kathmandu store hours hydration mismatch)
2. R2: Logic Bugs, Edge Cases & Data Integrity (WhatsApp URL encoding/special characters, Telegram MarkdownV2 escaping/error swallowing, phone/price validations, JSON dataset referential integrity)
3. R3: Security, Anti-Spam & Defensive Coding (Honeypot autofill protection, timing trap validation, in-memory rate limiter leak checks, input sanitization/XSS)
4. R4: Next.js 16 App Router, TypeScript Strict & WCAG AA Standards (Awaited async params/searchParams, zero any/safe nullables, client/server module boundary separation, mobile touch targets >=44px / >=48px for CTAs, ARIA/contrast/keyboard navigation)
5. R5: Severity-Ranked Audit Report Delivery grouped strictly into Critical, Major, Minor, and Optimization/Nitpick with verified file paths, exact line references, root cause, impact, and copy-paste ready code diffs.

Coordinate specialist subagents as needed, maintain your plan.md and progress.md, verify all findings against actual codebase lines, and produce the comprehensive final deliverable. Report back when completed.

## Follow-up — 2026-08-15T09:21:00+05:45

Execute complete, production-ready remediation and automated verification for all 33 verified code quality, concurrency, bug, security, Next.js 16, and WCAG AA accessibility audit findings on the MUSCLEWORKS SUPPLEMENTS codebase as documented in `.agents/reviewer_1/analysis.md`.

Working directory: c:/nooridigital_assets/my-projects/muscleworks
Integrity mode: development
Requested team: Full multi-agent remediation team

## Background & Project Context
- Framework Baseline: Next.js 16.3.0 App Router, React 19.2.8, TypeScript 5 (Strict), Tailwind CSS v4.
- Architecture: Full Static Site Generation (SSG, 0ms TTFB) for catalog/PDP/brand/category routes with dynamic client leaves and Server Actions for form submissions.
- Ordering Channels: Direct WhatsApp (wa.me/9779819877070) and phone calls.
- Location: Golfutar, Budha-Nilkantha, Kathmandu, Nepal (Asia/Kathmandu timezone, NPR currency).
- Core Invariants:
  1. No server secrets (RESEND_API_KEY, TELEGRAM_BOT_TOKEN, UPSTASH_*) can have NEXT_PUBLIC_ prefix or be imported in client components.
  2. All server actions enforce anti-bot honeypot (hp_field), 2000ms timing trap (_form_loaded_at), rate limiting, and Zod validation.
  3. Mobile touch targets must be >= 44x44px (>= 48x48px for WhatsApp/Phone conversion CTAs).
  4. Next.js 16 async params: params and searchParams MUST be awaited in all pages/layouts.

## Requirements

### R1. Critical & Major Security, Form Locking & Data Integrity Fixes
- CRIT-01 (src/lib/services/security.ts): Fix anti-spam timing trap clock-skew false positive by adding clock-skew tolerance (allow skew up to 120s in future, require elapsed >= 2000ms).
- CRIT-02 (src/app/categories/[slug]/page.tsx): Pass category-filtered products from getProductsByCategory() instead of all products to CatalogContainer.
- MAJ-01 (src/components/forms/*): Implement double-submit mutex ref (isSubmittingRef) across InquiryForm, ContactForm, and ConsultationModal to prevent rapid duplicate server action dispatches.
- MAJ-02 (src/lib/services/telegram.ts): Properly escape all special characters (backticks, underscores, asterisks, brackets) in Telegram MarkdownV2 message formatting and code blocks.
- MAJ-03 (src/lib/services/ratelimit.ts): Extract trusted client IP from x-vercel-ip / cf-connecting-ip with fallback to x-forwarded-for to prevent rate-limit bypass.
- MAJ-06 (src/components/emails/*): Fix WhatsApp URL encoding and product URL links in CustomerInquiryConfirmation.tsx and AdminInquiryAlert.tsx.
- MAJ-11 (src/lib/constants.ts): Standardize STORE_HOURS Saturday contact text and opening calculations in Asia/Kathmandu.
- MIN-01 (src/lib/validations/inquiry.ts): Enhance Nepal phone regex to validate all Nepal telecom prefixes (+977-98..., +977-97...).
- MIN-03 & MIN-04 (src/lib/services/ratelimit.ts): Implement periodic TTL map eviction to prevent memory leaks, and place rate limit verification before heavy computation.
- MIN-05 (src/lib/services/notifications.ts): Sanitize HTML entities in notification payloads.

### R2. Catalog, Search, Filtering & Accessibility Fixes
- CRIT-03 (src/components/catalog/catalog-filters.tsx): Upgrade filter controls to accessible <input type="checkbox"> elements with full keyboard navigation, focus rings, and proper ARIA states.
- MAJ-09 (src/components/catalog/search-bar.tsx & search-modal.tsx): Fix Enter-key navigation and debounce loading indicator state synchronization.
- MAJ-12 (src/lib/search.ts): Cache Fuse.js index instances in memory and reuse search promises.
- MIN-06 (src/components/catalog/mobile-filter-drawer.tsx): Synchronize drawer filter state with URL search params on unmount / dismiss.
- MIN-07 (src/components/catalog/search-modal.tsx): Ensure proper focus trapping and escape key listener cleanup on unmount.

### R3. Infrastructure, SEO, Routing & Media Asset Integrity Fixes
- MAJ-04 (src/proxy.ts & next.config.ts): Implement src/proxy.ts and attach security response headers (CSP, HSTS, X-Frame-Options, Permissions-Policy).
- MAJ-05 (src/app/sitemap.ts & src/app/robots.ts): Generate dynamic XML sitemap for all products, categories, and brands, plus robots.txt.
- MAJ-07 (src/components/product/product-card.tsx): Replace missing /images/products/placeholder.jpg with /brnding-assets/logo.webp and add graceful image fallbacks.
- MAJ-08 (src/components/layout/*): Update dead navigation links (/guides, legal policies) across navbar.tsx, mobile-nav.tsx, and footer.tsx to active routes (/location, /contact).
- MAJ-10 (src/components/*): Remove redundant priority attribute on below-the-fold images across PDP and catalog components.
- MAJ-13 (src/app/*): Fix semantic HTML landmarks (remove duplicate <main> tags and fix heading hierarchy).
- MIN-11 (src/app/layout.tsx): Export separate viewport configuration per Next.js 16 requirements.

### R4. WCAG AA Touch Targets & Defensive Optimizations
- MIN-02: Enforce >= 44x44px for all standard buttons/links and >= 48x48px for WhatsApp/Phone conversion CTAs.
- MIN-08: Calculate store hours countdown with epoch timestamps to prevent client clock skew.
- MIN-09 & MIN-10: Fix text contrast and heading level progression.
- MIN-12: Add explicit width/height and aspect ratios to prevent Cumulative Layout Shift (CLS).
- OPT-01 - OPT-05: Reuse Upstash Redis singleton, remove redundant 'use client' directives, update test script phone numbers in validate-whatsapp-analytics.ts, add data-lpignore="true" to honeypots, and add responsive sizes to logo images.

## Acceptance Criteria

### Type Safety & Build Integrity
- [ ] npx tsc --noEmit passes with 0 errors.
- [ ] npm run lint passes with 0 warnings or errors.
- [ ] npm run build succeeds, generating all static routes (SSG) with 0 errors.

### Verification Scripts
- [ ] npx tsx src/scripts/validate-server-actions.ts passes 100% of checks.
- [ ] npx tsx src/scripts/validate-security-ratelimit.ts passes 100% of checks.
- [ ] npx tsx src/scripts/validate-catalog-accessors.ts passes 100% of checks.
- [ ] npx tsx src/scripts/validate-whatsapp-analytics.ts passes 100% of checks.
- [ ] npx tsx src/scripts/validate-form-components.ts passes 100% of checks.
