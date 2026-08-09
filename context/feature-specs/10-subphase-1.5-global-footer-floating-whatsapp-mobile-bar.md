# Feature Spec 10: Sub-Phase 1.5 — Global Footer Layout

> **Spec ID:** `10-subphase-1.5-global-footer-floating-whatsapp-mobile-bar`  
> **Target Sub-Phase / Branch:** `Phase 1 — Sub-Phase 1.5`  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification governs the implementation of **Sub-Phase 1.5: Global Footer** for the MuscleWorks Supplements platform. It completes **Phase 1: Core Design System & Shared UI Primitives** by delivering:
1. A streamlined, 3-column semantic global footer (`footer.tsx`) containing the brand manifesto, authorized importer seal, supplement categories, Golfutar flagship store location, opening hours, contact matrix, and clean copyright bar.
2. Global root integration in `src/app/layout.tsx`.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/components/layout/footer.tsx` | **[NEW]** | Implement semantic 3-column footer (`<footer role="contentinfo">`) featuring brand manifesto, genuine importer seal, Golfutar store address, opening hours, quick category links, and clean copyright. |
| 2 | `src/app/layout.tsx` | **[MODIFY]** | Mount `<Footer />` into the global root shell. |

---

## 2. Why We Are Doing This

1. **Physical Credibility & Local Trust in Nepal:** Supplement buyers in Nepal frequently worry about counterfeit products. Displaying our physical flagship retail outlet at **Golfutar Main Road, Budha-Nilkantha, Kathmandu (44500)** along with official importer hologram verification badges and clear business hours builds decisive trust before a user decides to purchase.
2. **Streamlined Footer Information Architecture:** Focuses the footer on the core essentials: brand authenticity & socials, supplement category discovery, and physical store contacts.
3. **Clean Design Aesthetic:** Clean, uncluttered dark athletic layout without intrusive desktop floating badges or persistent mobile overlays.

---

## 3. How We Are Going to Implement It

### Step 1: `src/components/layout/footer.tsx` (Server Component)
- **Container Styling:** `border-t border-border bg-card/80 pt-12 pb-8 text-sm text-muted-foreground`
- **Grid Layout:** Responsive 3-column layout (`grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12`)
  - **Column 1: Brand & Authenticity Manifesto**
    - Brand Logo (`/brnding-assets/new-logo.png`) & name `MUSCLEWORKS SUPPLEMENTS`
    - Tagline: `100% Genuine Sports Nutrition & Fitness Supplements in Nepal`
    - Authentic Importer Seal badge (`<Badge variant="authentic">Authorized Importer Partner</Badge>`)
    - Social links (WhatsApp, Instagram, Facebook, TikTok) with accessible labels and `aria-label`
  - **Column 2: Quick Links & Categories**
    - Whey Protein, Creatine Monohydrate, Mass Gainers, Pre-Workout, BCAA & Essential Aminos, Vitamins & Fish Oil, All Supplements
  - **Column 3: Golfutar Flagship Store & Operating Hours**
    - Address: `Golfutar Main Road, Budha-Nilkantha, Kathmandu (44500), Nepal`
    - Landmark: `Near Golfutar Basketball Court / Budha-Nilkantha Highway`
    - Store Hours: `Sun – Fri: 10:00 AM – 8:00 PM` • `Sat: 11:00 AM – 6:00 PM`
    - Store Hotline: `+977 980-0000000` (clickable `tel:` link)
    - Store Email: `orders@muscleworksnepal.com`
    - Google Maps link (`STORE_LOCATION.googleMapsUrl`)
- **Bottom Bar:**
  - Separator line (`<Separator />`)
  - Copyright statement: `© 2026 MuscleWorks Supplements. All rights reserved.`
  - Legal links: Privacy Policy (`/privacy`), Terms of Service (`/terms`), Delivery & Returns (`/delivery-returns`), Disclaimer (`/disclaimer`)

### Step 2: `src/app/layout.tsx`
- Import and mount `<Footer />` below `<main>`.

---

## 4. Verification Checklist & Gate Criteria

- [x] `npx tsc --noEmit` passes with 0 type errors.
- [x] `npm run lint` / ESLint passes with 0 warnings/errors.
- [x] `npm run build` succeeds with full SSG static prerendering.
- [x] Footer renders clean 3-column layout with Golfutar store address, opening hours, and copyright.
