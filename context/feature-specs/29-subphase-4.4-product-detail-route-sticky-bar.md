# Feature Spec 29: Sub-Phase 4.4 — Product Detail Route & Mobile Sticky Action Bar

> **Spec ID:** `29-subphase-4.4-product-detail-route-sticky-bar`  
> **Target Sub-Phase:** Sub-Phase 4.4 (`src/app/products/[slug]/page.tsx`, `src/components/product/product-detail-view.tsx`, `src/components/product/product-sticky-bar.tsx`)  
> **Status:** Approved (In Progress)  
> **Created Date:** 2026-08-10  
> **Author:** AI Agent (Pair Programming with User)

---

## Executive Summary

Sub-Phase 4.4 completes **Phase 4 (Product Detail Page & Dynamic WhatsApp Conversion Flow)** by integrating all product components into the SSG route `/products/[slug]` and building the **Mobile Sticky Action Bar**:

1. **`src/app/products/[slug]/page.tsx` (SSG Page & Route Handler):**
   - Implements `generateStaticParams()` pre-rendering all 15 product slugs at build time.
   - Implements `generateMetadata()` generating dynamic OpenGraph & Twitter card meta tags (title, description, price, product images, canonical URL).
   - Injects Schema.org `Product` & `Offer` JSON-LD structured data with price in NPR, stock availability, brand details, and Golfutar Kathmandu store physical location metadata.
   - Renders `notFound()` error boundary for invalid product slugs.
2. **`src/components/product/product-detail-view.tsx` (Interactive State Orchestrator Client Shell):**
   - Manages selected variant state (`selectedFlavor`, `selectedSize`, active price, active stock status).
   - Ensures 100% synchronized real-time updates across the `ProductGallery`, price displays, `ProductVariantSelector`, `ProductStockStatus`, main hero WhatsApp CTA, tabbed `ProductSpecs`, and `ProductStickyBar`.
3. **`src/components/product/product-sticky-bar.tsx` (Mobile Fixed Action Bar):**
   - Fixed bottom action bar visible exclusively on mobile viewports (`md:hidden`, `fixed bottom-0 left-0 right-0 z-40`).
   - Displays active product thumbnail image, selected flavor & size summary text, live formatted NPR price, stock status indicator, and full-width "Order via WhatsApp" conversion CTA (≥48px touch height).

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/app/products/[slug]/page.tsx` | **[NEW]** | SSG product detail route with `generateStaticParams`, dynamic metadata generation, Schema.org JSON-LD, breadcrumb navigation, and layout assembly. |
| 2 | `src/components/product/product-detail-view.tsx` | **[NEW]** | Interactive client component managing selected variant state and synchronizing gallery, pricing, stock badges, and sticky bottom bar. |
| 3 | `src/components/product/product-sticky-bar.tsx` | **[NEW]** | Mobile-only fixed bottom action bar with product preview, active variant pricing, and direct WhatsApp ordering CTA. |

---

## 2. Why We Are Doing This

1. **100% SSG & Zero-Latency Performance:** Pre-rendering all `/products/[slug]` routes with `generateStaticParams()` delivers 0ms TTFB for instant mobile page loads in Nepal.
2. **SEO & Structured Data Search Rich Snippets:** Google and search engines require valid Schema.org `Product` JSON-LD data (price in NPR, stock status, images) to display price badges and rich snippets in search results.
3. **Mobile-First Conversions (Kathmandu Market):** 85%+ of supplement buyers in Nepal browse on mobile devices. An always-visible bottom sticky action bar with a prominent WhatsApp CTA (≥48px touch height) significantly increases order conversion rates.
4. **Seamless Real-time State Synchronization:** When users select a different flavor (e.g. *Double Rich Chocolate* vs *Vanilla Ice Cream*) or size (*2 lbs* vs *5 lbs*), the price, stock status, images, and WhatsApp message payload must update instantly without page reloads.

---

## 3. How We Are Going to Implement It

### Step 1: `ProductStickyBar` Component (`src/components/product/product-sticky-bar.tsx`)
- **Props:** `product: Product`, `selectedVariant: ProductVariant`, `whatsappUrl: string`, `className?: string`
- **Visibility:** Mobile-only `md:hidden`, fixed at bottom (`fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border p-3 shadow-lg`).
- **Content:**
  - Left: 40x40px rounded product thumbnail image + active variant summary (e.g., "Chocolate • 5 lbs") + formatted NPR price & discount badge if applicable.
  - Right / CTA: Full-width or prominent WhatsApp CTA button (`variant="whatsapp"`, min-h-12 / 48px touch target) with WhatsApp icon and "Order on WhatsApp" text.
  - Pads page bottom with `pb-20 md:pb-0` on container to prevent sticky bar overlapping content.

### Step 2: `ProductDetailView` Client Shell (`src/components/product/product-detail-view.tsx`)
- **Props:** `product: Product`, `relatedProductsChildren?: React.ReactNode`, `category?: Category`, `brand?: Brand`
- **State Management:**
  - Maintains `selectedFlavor` (default: `product.defaultVariant.flavor` or `flavors[0]`) and `selectedSize` (default: `product.defaultVariant.sizeWeight`).
  - Computes `selectedVariant` dynamically from options or falls back to `defaultVariant`.
  - Generates real-time `whatsappUrl` via `buildProductWhatsAppUrl({ product, selectedVariant, customerCity: 'Kathmandu' })`.
- **Layout Assembly:**
  - Responsive 2-column grid on desktop (`lg:grid-cols-12 gap-8 lg:gap-12`).
  - Column 1 (`lg:col-span-7`): `ProductGallery` + `ProductSpecs` tabs.
  - Column 2 (`lg:col-span-5`): Title, Brand badge, Price & Discount, `ProductStockStatus`, `ProductVariantSelector`, Main WhatsApp CTA (`min-h-12`), Golfutar store availability callout, `AuthenticityGuaranteeBox`.
  - Below Grid: `RelatedProducts` section.
  - Bottom: Mounted `ProductStickyBar`.

### Step 3: SSG Route & Page (`src/app/products/[slug]/page.tsx`)
- **Params:** `params: Promise<{ slug: string }>` (Next.js 16 requirement: `await params`).
- **`generateStaticParams()`:** Fetches all products from `getProducts()`, mapping `{ slug: p.slug }`.
- **`generateMetadata()`:** Queries `getProductBySlug(slug)`. If not found, returns fallback title. Otherwise returns title `"Buy [Name] in Nepal | MuscleWorks Kathmandu"`, description, OpenGraph metadata with main image URL, NPR price, and canonical link.
- **Page Component:**
  - Awaits `params`.
  - Fetches product, category, brand, and related products via `getProducts()`, `getProductBySlug()`, `getRelatedProducts()`.
  - Calls `notFound()` if product is missing.
  - Injects `<script type="application/ld+json">` with Schema.org `Product` JSON-LD data.
  - Renders header breadcrumb, `<ProductDetailView />`, and category/brand trust badges.

---

## 4. Verification & Testing Strategy

1. **Static Typing & Compilation:**
   - Run `npx tsc --noEmit` to verify zero TypeScript errors across Next.js 16 async params, props, and client/server boundaries.
2. **SSG Build Verification:**
   - Run `npm run build` to confirm all 15 `/products/[slug]` routes are statically generated (`○  (Static) prerendered as static content`).
3. **Mobile Touch Targets & Accessibility:**
   - Verify all WhatsApp CTAs in `ProductStickyBar` and main hero satisfy `min-h-12` (≥48px) touch height.
   - Verify sticky bar has `z-40` and container has `pb-20` on mobile viewports.
