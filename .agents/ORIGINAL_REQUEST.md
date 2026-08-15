# Original User Request

## 2026-08-15T08:06:00Z

This is a single self-contained fix; keep it small and focused.

Remediate all identified medium and low priority audit findings (M-1 to M-4, L-1 to L-3) from the Comprehensive Codebase Audit for MuscleWorks Supplements, preserving all Next.js 16/React 19 invariants, and verify the fixes against the full testing harness.

Working directory: c:/nooridigital_assets/my-projects/muscleworks
Integrity mode: development

## Requirements

### R1. Navigation, Route & Copy Consistency (M-3, M-4, L-1, L-3)
- Fix the mobile navigation drawer in `src/components/layout/mobile-nav.tsx` so the "100% Authenticity Guarantee" navigation item routes to `/authenticity` instead of `/products`.
- Harmonize the free delivery threshold copy across `src/components/product/product-detail-view.tsx` and `src/app/shipping/page.tsx` to match the canonical NPR 5,000 threshold defined in `src/lib/constants.ts` (`DELIVERY_PROMISES.freeDeliveryThreshold`).
- Update outdated placeholder phone references in `src/app/(marketing)/contact/page.tsx` metadata description to use the canonical hotline `+977 981-9877070` (`STORE_PHONE`).
- Standardize OpenGraph `url` definitions in metadata across marketing, catalog, and brand routes (`contact`, `location`, `brands`, `categories`, `products`) to dynamically interpolate `SITE_URL` from `@/lib/constants`.

### R2. Performance & Image Loading Optimization (M-1, M-2)
- Remove `priority` (or ensure lazy loading) on below-the-fold banner images in `src/components/home/featured-products-section.tsx` to eliminate initial load bandwidth congestion and preload warnings.
- Optimize the promotional deal assets referenced by `src/components/home/deals-section.tsx` (`bpi-1-mr-vortex`, `hyper-mass`, `impact-whey`, `omega-3`), converting them to WebP format where appropriate and updating component references.

### R3. Orphaned Asset Cleanup (L-2)
- Safely remove unreferenced legacy `.png` files in `public/` that have been replaced by `.webp` assets, ensuring no active components or metadata references are broken.

### R4. Complete End-to-End Test Suite Verification
- Verify that the codebase builds with zero TypeScript errors (`npx tsc --noEmit`), zero ESLint warnings (`npm run lint`), and builds all static routes cleanly (`npm run build`).
- Execute all 12+ automated validation suites in `src/scripts/` to confirm 100% pass rate across catalog data accessors, server actions, rate limiting, notifications, WhatsApp URL builder, PDP components, adversarial stress testing, and dead code analysis.

## Acceptance Criteria

### Functionality & Consistency
- [ ] Mobile navigation "Authenticity Guarantee" links directly to `/authenticity`.
- [ ] Free delivery threshold consistently displays NPR 5,000 across PDP and Shipping policy pages.
- [ ] Contact page metadata description contains `+977 981-9877070`.
- [ ] OpenGraph metadata URLs reference canonical `SITE_URL`.
- [ ] Below-the-fold banners in `featured-products-section.tsx` do not have the `priority` attribute.
- [ ] Deals section assets load optimized image formats.
- [ ] Orphaned legacy PNG files in `public/` are purged without breaking any active asset references.

### Verification & Test Suite Gate
- [ ] `npx tsc --noEmit` exits with code 0 (0 type errors).
- [ ] `npm run lint` exits with code 0 (0 lint errors/warnings).
- [ ] `npm run build` succeeds and pre-renders all static pages without errors.
- [ ] `npx tsx src/scripts/validate-catalog-accessors.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-server-actions.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-security-ratelimit.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-notification-services.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-whatsapp-analytics.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-location-components.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-form-components.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-pdp-components.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-pdp-specs-components.ts` passes 100%.
- [ ] `npx tsx src/scripts/validate-adversarial-stress.ts` passes 100%.
- [ ] `npx tsx src/scripts/test-challenger-2.ts` passes 100%.
- [ ] `node src/scripts/check-dead-code.js` passes with zero unreferenced component files.
