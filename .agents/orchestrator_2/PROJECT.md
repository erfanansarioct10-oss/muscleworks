# Project: MUSCLEWORKS SUPPLEMENTS — Master Remediation & Verification

## Architecture
Next.js 16.3.0 App Router · React 19.2.8 · TypeScript 5 (Strict) · Tailwind CSS v4 · Vercel Edge/Serverless.
SSG-first static generation with isolated leaf Client Components, Server Actions for inquiries/contacts/orders, Upstash Redis rate limiting, Resend email pipeline, Telegram MarkdownV2 bot alerts, and WCAG AA mobile-first UI.

## Feature Inventory & Remediation Scope
| # | Finding ID | Severity | Description | Milestone | Target Files |
|---|------------|----------|-------------|-----------|--------------|
| 1 | CRIT-01 | Critical | Timing trap clock skew false positives dropping genuine leads | M1 (R1) | `src/lib/services/security.ts`, `src/actions/inquiry.ts`, `src/actions/contact.ts` |
| 2 | CRIT-02 | Critical | Category archive route displays entire store catalog | M1 (R1) | `src/app/categories/[slug]/page.tsx` |
| 3 | CRIT-03 | Critical | Non-semantic filter controls lacking keyboard a11y & ARIA | M2 (R2) | `src/components/catalog/catalog-filters.tsx`, `src/components/catalog/active-filters.tsx` |
| 4 | MAJ-01 | Major | Form submission mutex race condition (double-submit) | M1 (R1) | `src/components/forms/inquiry-form.tsx`, `src/components/forms/contact-form.tsx` |
| 5 | MAJ-02 | Major | Telegram Bot MarkdownV2 over-escaping in inline code | M1 (R1) | `src/lib/services/telegram.ts` |
| 6 | MAJ-03 | Major | Rate limit bypass via X-Forwarded-For header spoofing | M1 (R1) | `src/lib/services/ratelimit.ts` |
| 7 | MAJ-04 | Major | Missing Edge Request Proxy & HTTP Security Headers Gate | M3 (R3) | `src/proxy.ts`, `next.config.ts` |
| 8 | MAJ-05 | Major | Missing Dynamic XML Sitemap & Robots.txt SEO Generators | M3 (R3) | `src/app/sitemap.ts`, `src/app/robots.ts` |
| 9 | MAJ-06 | Major | Hardcoded dummy phone & WhatsApp country code omission in emails | M1 (R1) | `src/emails/inquiry-notification.tsx`, `src/emails/contact-notification.tsx`, `src/emails/order-confirmation.tsx` |
| 10 | MAJ-07 | Major | 35 Missing static media assets & broken fallback placeholders | M3 (R3) | `data/*.json`, `public/images/*`, `public/images/placeholders/*` |
| 11 | MAJ-08 | Major | Dead navigation links to unimplemented /guides & legal routes | M3 (R3) | `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/app/guides/page.tsx`, etc. |
| 12 | MAJ-09 | Major | Search Enter-key navigation failure & debounce spinner delay | M2 (R2) | `src/components/search/search-bar.tsx`, `src/components/search/search-modal.tsx` |
| 13 | MAJ-10 | Major | Excessive priority flags on 10+ below-the-fold images | M3 (R3) | `src/components/home/shop-by-goal-section.tsx`, etc. |
| 14 | MAJ-11 | Major | Canonical store hours & delivery threshold data discrepancies | M1 (R1) | `src/lib/constants.ts`, `data/store.json` |
| 15 | MAJ-12 | Major | Concurrent Promise race condition in search index initialization | M2 (R2) | `src/lib/search.ts` |
| 16 | MAJ-13 | Major | Invalid HTML element nesting (<button> in <a>) & duplicate main landmarks | M3 (R3) | `src/components/catalog/product-card.tsx`, etc. |
| 17 | MIN-01 | Minor | Nepal phone regex rejects formatted numbers with internal separators | M1 (R1) | `src/lib/validations/common.ts` |
| 18 | MIN-02 | Minor | Sub-44px mobile touch targets on active filter remove badges | M4 (R4) | `src/components/catalog/active-filters.tsx` |
| 19 | MIN-03 | Minor | Unbounded in-memory Map growth in rate limiter fallback | M1 (R1) | `src/lib/services/ratelimit.ts` |
| 20 | MIN-04 | Minor | Rate limit quota consumed by pre-validation user input typos | M1 (R1) | `src/actions/inquiry.ts`, `src/actions/contact.ts` |
| 21 | MIN-05 | Minor | Single-pass regex sanitizer tag evasion & text bracket deletion | M1 (R1) | `src/lib/services/security.ts` |
| 22 | MIN-06 | Minor | Cumulative Layout Shift (CLS) on StoreHoursCard empty state | M2 (R2) | `src/components/common/store-hours-card.tsx` |
| 23 | MIN-07 | Minor | Midnight hourCycle: 'h23' runtime ambiguity in Intl.DateTimeFormat | M2 (R2) | `src/data/store.ts` |
| 24 | MIN-08 | Minor | Deals section countdown timer tab-backgrounding interval drift | M4 (R4) | `src/components/home/deals-section.tsx` |
| 25 | MIN-09 | Minor | Fragile inlined WhatsApp URL construction bypassing central engine | M4 (R4) | `src/components/layout/header.tsx`, etc. |
| 26 | MIN-10 | Minor | Heading level skipping in homepage marketing sections | M4 (R4) | `src/components/home/shop-by-goal-section.tsx`, etc. |
| 27 | MIN-11 | Minor | Viewport metadata mismatch with light luxury theme palette | M3 (R3) | `src/app/layout.tsx` |
| 28 | MIN-12 | Minor | Non-string / object honeypot bypass at step 1 pre-check | M4 (R4) | `src/lib/services/security.ts`, `src/actions/*` |
| 29 | OPT-01 | Optimization | Redundant per-request Upstash Redis client re-instantiation | M4 (R4) | `src/lib/services/ratelimit.ts` |
| 30 | OPT-02 | Optimization | Redundant 'use client' directive on static StoreMapEmbed | M4 (R4) | `src/components/store/store-map-embed.tsx` |
| 31 | OPT-03 | Optimization | Outdated hardcoded phone number assertion in WhatsApp test suite | M4 (R4) | `src/scripts/validate-whatsapp-analytics.ts` |
| 32 | OPT-04 | Optimization | Honeypot input autofill defense hardening in form components | M4 (R4) | `src/components/forms/inquiry-form.tsx`, `src/components/forms/contact-form.tsx` |
| 33 | OPT-05 | Optimization | Missing sizes attribute on logo Image fill components | M4 (R4) | `src/components/layout/header.tsx`, `src/components/layout/footer.tsx` |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|--------------|--------|
| 1 | M1 (R1) | Security, Form Locking & Data Integrity Fixes (CRIT-01, CRIT-02, MAJ-01, MAJ-02, MAJ-03, MAJ-06, MAJ-11, MIN-01, MIN-03, MIN-04, MIN-05) | None | IN_PROGRESS |
| 2 | M2 (R2) | Catalog, Search, Filtering & Accessibility Fixes (CRIT-03, MAJ-09, MAJ-12, MIN-06, MIN-07) | None | PLANNED |
| 3 | M3 (R3) | Infrastructure, SEO, Routing & Media Asset Integrity Fixes (MAJ-04, MAJ-05, MAJ-07, MAJ-08, MAJ-10, MAJ-13, MIN-11) | None | PLANNED |
| 4 | M4 (R4) | WCAG AA Touch Targets & Defensive Optimizations (MIN-02, MIN-08, MIN-09, MIN-10, MIN-12, OPT-01, OPT-02, OPT-03, OPT-04, OPT-05) | M1, M2, M3 | PLANNED |
| 5 | M5 (Final) | End-to-End Project Acceptance & Verification (Typecheck, Lint, Next.js Build, All 5 validation scripts 100% pass) | M1, M2, M3, M4 | PLANNED |

## Code Layout & Boundaries
- Security & Rate Limiting: `src/lib/services/security.ts`, `src/lib/services/ratelimit.ts`, `src/lib/validations/common.ts`
- Server Actions & Forms: `src/actions/inquiry.ts`, `src/actions/contact.ts`, `src/components/forms/inquiry-form.tsx`, `src/components/forms/contact-form.tsx`
- Catalog & Search: `src/lib/search.ts`, `src/data/store.ts`, `src/components/catalog/*`, `src/components/search/*`, `src/app/categories/[slug]/page.tsx`
- Notifications & Emails: `src/lib/services/telegram.ts`, `src/emails/*`
- Routing, Infrastructure & SEO: `src/proxy.ts`, `next.config.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/layout.tsx`, `src/components/layout/*`, `src/components/home/*`, `src/components/store/*`
- Validation Scripts: `src/scripts/validate-*.ts`
