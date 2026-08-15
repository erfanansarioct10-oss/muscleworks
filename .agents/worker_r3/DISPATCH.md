# Worker R3 Dispatch

## 2026-08-15T09:22:24Z

You are Worker R3 (teamwork_preview_worker) responsible for Milestone R3: Infrastructure, SEO, Routing & Media Asset Integrity Fixes.

Working Directory: c:\nooridigital_assets\my-projects\muscleworks\.agents\worker_r3
Original Request Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\ORIGINAL_REQUEST.md
Audit Analysis Reference: c:\nooridigital_assets\my-projects\muscleworks\.agents\reviewer_1\analysis.md
Codebase Root: c:\nooridigital_assets\my-projects\muscleworks

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Assigned Findings to Remediate:
1. MAJ-04: Missing Edge Request Proxy & HTTP Security Headers Gate
   - Files: `src/proxy.ts`, `next.config.ts`
   - Create Next.js 16 compliant `src/proxy.ts` (exporting `proxy` function) applying CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and automated malicious probe blocking (.env, .git, etc.). Update `next.config.ts` if needed.
2. MAJ-05: Missing Dynamic XML Sitemap & Robots.txt SEO Generators
   - Files: `src/app/sitemap.ts`, `src/app/robots.ts`
   - Create `src/app/sitemap.ts` (generating static routes + all dynamic product/category/brand URLs with changefreq and priority) and `src/app/robots.ts` pointing to `/sitemap.xml`.
3. MAJ-07: 35 Missing Static Media Assets & Broken Fallback Placeholders
   - Files: `data/*.json`, `public/images/*`, `public/images/placeholders/*`
   - Verify and generate/fix valid SVG/PNG placeholder assets for all 35 missing media references so no 404s occur in product galleries, brands, or categories.
4. MAJ-08: Dead Navigation Links to Unimplemented `/guides` & Policy Routes
   - Files: `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/app/guides/page.tsx`, `src/app/privacy/page.tsx`, `src/app/terms/page.tsx`, `src/app/shipping/page.tsx`, `src/app/returns/page.tsx`, `src/app/authenticity/page.tsx`
   - Ensure all navbar and footer links point to valid implemented routes (create clean, compliant static page content for any missing policy/guides routes).
5. MAJ-10: Excessive `priority` flags on 10+ below-the-fold images
   - Files: `src/components/home/shop-by-goal-section.tsx`, `src/components/home/featured-categories.tsx`, `src/components/catalog/product-card.tsx`
   - Remove `priority` from below-the-fold image instances to prevent LCP regression and bandwidth waste.
6. MAJ-13: Invalid HTML element nesting (`<button>` inside `<a>`) & duplicate `<main>` landmarks
   - Files: `src/components/catalog/product-card.tsx`, `src/app/layout.tsx`, and relevant page components
   - Fix nested `<button>` inside `<Link>` / `<a>` by using separate sibling buttons or event stopPropagation on action buttons; ensure single `<main id="main-content">` landmark.
7. MIN-11: Viewport metadata mismatch with light luxury theme palette
   - File: `src/app/layout.tsx`
   - Set viewport `themeColor: '#FAFAFA'` (or appropriate light theme background token) in `layout.tsx` export.

Exclusive File Ownership:
- `src/proxy.ts`
- `next.config.ts`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/layout/navbar.tsx`
- `src/components/layout/footer.tsx`
- `src/app/guides/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/shipping/page.tsx`
- `src/app/returns/page.tsx`
- `src/app/authenticity/page.tsx`
- `src/components/home/shop-by-goal-section.tsx`
- `src/components/home/featured-categories.tsx`
- `src/components/catalog/product-card.tsx`
- `src/app/layout.tsx`
- `public/images/**/*`
