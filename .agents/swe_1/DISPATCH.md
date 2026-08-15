## 2026-08-15T08:06:15Z
<USER_REQUEST>
You are the SWE Light orchestrator dispatched to remediate all identified medium and low priority audit findings (M-1 to M-4, L-1 to L-3) from the Comprehensive Codebase Audit for MuscleWorks Supplements.

Working directory for your metadata: c:/nooridigital_assets/my-projects/muscleworks/.agents/swe_1
Original User Request: c:/nooridigital_assets/my-projects/muscleworks/.agents/ORIGINAL_REQUEST.md
Project Root: c:/nooridigital_assets/my-projects/muscleworks

Requirements Summary:
1. Navigation, Route & Copy Consistency (M-3, M-4, L-1, L-3):
   - Fix mobile navigation drawer in `src/components/layout/mobile-nav.tsx` to link "100% Authenticity Guarantee" to `/authenticity`.
   - Harmonize free delivery threshold copy across `src/components/product/product-detail-view.tsx` and `src/app/shipping/page.tsx` to NPR 5,000 (`DELIVERY_PROMISES.freeDeliveryThreshold`).
   - Update contact page metadata description in `src/app/(marketing)/contact/page.tsx` to hotline `+977 981-9877070`.
   - Standardize OpenGraph `url` in metadata across routes (`contact`, `location`, `brands`, `categories`, `products`) with dynamic `SITE_URL`.
2. Performance & Image Loading Optimization (M-1, M-2):
   - Remove `priority` (or ensure lazy loading) on below-the-fold banner images in `src/components/home/featured-products-section.tsx`.
   - Optimize promotional deal assets referenced by `src/components/home/deals-section.tsx` (`bpi-1-mr-vortex`, `hyper-mass`, `impact-whey`, `omega-3`), converting to WebP format where appropriate and updating component references.
3. Orphaned Asset Cleanup (L-2):
   - Safely remove unreferenced legacy `.png` files in `public/` replaced by `.webp` assets.
4. Complete Test Suite Verification:
   - Zero TypeScript errors (`npx tsc --noEmit`), zero ESLint warnings (`npm run lint`), successful static build (`npm run build`).
   - All 12+ scripts in `src/scripts/` passing 100%.

Run the SWE Light loop, ensure full verification, write progress.md and handoff.md in your directory, and notify parent upon completion.
</USER_REQUEST>
