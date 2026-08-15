# Specification 39: Sub-Phase 6.1 — Homepage Hero Section

> **Status:** Approved & Active  
> **Sub-Phase:** `6.1`  
> **Target Files:**
> - `src/components/home/hero-section.tsx` [NEW]
> - `src/app/page.tsx` [MODIFY]
> - `public/hero/hero-image.webp` [NEW - Compressed Asset]
> - `context/progress-tracker.md` [MODIFY]
> - `context/feature-roadmap.md` [MODIFY]

---

## 1. Executive Summary & Business Intent

Sub-Phase 6.1 delivers the **Homepage Hero Section** (`src/components/home/hero-section.tsx`), serving as the primary visual and conversion anchor for MuscleWorks Supplements Nepal. 

The Hero section addresses the core customer problem in Nepal: **fear of fake supplements and delayed delivery**. It instantly builds trust by highlighting:
1. **100% Genuine Importer Hologram Guarantee** (Neucrad, Authorised Importer Stickers).
2. **Physical Flagship Store Outlet in Golfutar, Budha-Nilkantha, Kathmandu**.
3. **Kathmandu Same-Day Express Delivery Guarantee**.
4. **Direct WhatsApp Ordering Channel** with pre-filled order payloads.

---

## 2. Technical Requirements & Design Standards

### 2.1 Background Image & Compression
- **Source Asset:** `public/hero/hero-image.png` (2,129,145 bytes)
- **Compressed Asset:** `public/hero/hero-image.webp` (167,528 bytes — **92.1% reduction**)
- **Implementation:** Rendered via Next.js `<Image>` primitive with `fill`, `priority`, `quality={85}`, `sizes="100vw"`, and layered under multi-stage linear gradients for WCAG AA text legibility.

### 2.2 Component Hierarchy & Layout Structure
- **Container:** Full-width responsive Hero section with dynamic min-height (`min-h-[580px] sm:min-h-[640px] lg:min-h-[700px]`).
- **Gradient Overlays:**
  - Dark luxury gradient overlay: `bg-gradient-to-r from-background via-background/90 to-background/50` (ensures text readability regardless of viewport scaling).
- **Typography Engine:**
  - Font Heading: `font-heading` (`Outfit` font family).
  - Main Headline: *"Kathmandu's Premier Destination for 100% Genuine Sports Nutrition"*
  - Subheading: Clear summary of authenticity guarantee, Golfutar physical store location, and same-day delivery.
- **Conversion CTAs (≥48px Touch Target Height):**
  - **Primary WhatsApp CTA:** Direct link via `buildGeneralWhatsAppUrl()`, `min-h-[48px] px-6 text-base font-bold shadow-lg`.
  - **Catalog Browse CTA:** `<Link href="/products">` wrapped button, `variant="outline"`, `min-h-[48px] px-6`.
  - **Consultation Modal Trigger:** `<ConsultationModal />` for free supplement stack advice.
- **Trust Stat Pills (Hero Footer Bar):**
  - **100% Genuine:** Importer Hologram Stickers
  - **Physical Store:** Golfutar, Budha-Nilkantha
  - **Express Delivery:** Kathmandu Valley Same-Day

---

## 3. Verification Plan

### 3.1 Static Type Check & Build Validation
- Run `npx tsc --noEmit` to confirm 0 TypeScript errors.
- Run `npm run build` to ensure static page pre-rendering succeeds.

### 3.2 Mobile Touch & Accessibility Audit
- Verify minimum CTA button touch target dimensions $\ge 48\text{px} \times 48\text{px}$.
- Verify WCAG AA 4.5:1 color contrast ratio over dark gradient overlay.

---

## 4. Post-Flight Hand-off Protocol
- Update `context/progress-tracker.md` to set `6.1` to `[x]` (Completed) and `6.2` to `[NEXT UP]`.
- Update `context/feature-roadmap.md` matrix for `6.1`.
