# Feature Spec 09: Sub-Phase 1.4 — Global Navigation Shell & Header

> **Spec ID:** `09-subphase-1.4-global-navigation-shell-header`  
> **Target Sub-Phase / Branch:** `Phase 1 — Sub-Phase 1.4`  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification governs the implementation of **Sub-Phase 1.4: Global Navigation Shell & Header** for the MuscleWorks Supplements platform. It defines the global top-level navigation architecture consisting of a top announcement banner, a sticky desktop header with brand identity, primary navigation links, search & phone triggers, high-visibility emerald WhatsApp conversion CTA (`wa.me`), and an accessible slide-over mobile drawer (`Sheet` primitive) with categorized supplement shortcuts and store contact triggers.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/components/layout/header.tsx` | **[NEW]** | Implement top announcement bar + sticky main header container with brand logo, desktop navbar, right action cluster (search, phone, WhatsApp CTA), and mobile hamburger toggle. |
| 2 | `src/components/layout/navbar.tsx` | **[NEW]** | Implement semantic desktop navigation bar (`<nav aria-label="Main Navigation">`) with curated supplement category links, authenticity guarantee, store location, and nutrition guides. |
| 3 | `src/components/layout/mobile-nav.tsx` | **[NEW]** | Implement accessible slide-over mobile drawer using the `Sheet` primitive (`side="right"`) with supplement categories, store hours, direct phone dialing, and sticky WhatsApp order actions. |
| 4 | `src/app/layout.tsx` | **[MODIFY]** | Mount `<Header />` inside the root layout above `<main>` content so all pages inherit global navigation. |

---

## 2. Why We Are Doing This

1. **Brand Identity & Store Presence:** MuscleWorks operates a physical retail outlet in **Golfutar, Budha-Nilkantha, Kathmandu (44500)**. Displaying the store location and same-day delivery guarantees in the top announcement bar reinforces physical credibility and authentic importer status.
2. **Frictionless WhatsApp Conversion Engine:** Over 85% of supplement orders and consultation inquiries in Nepal occur via WhatsApp. Pinned high-contrast WhatsApp CTAs in both the desktop header and the mobile drawer reduce user friction and maximize conversion rates.
3. **Mobile-First Touch Ergonomics:** Mobile navigation is powered by the Radix-based `Sheet` primitive with minimum 44px touch targets (`h-11`), eliminating cramped mobile menus.
4. **Structured Category Access:** Allows gym-goers and fitness enthusiasts to immediately browse by product goal (Whey Protein, Creatine, Mass Gainers) or verify authenticity directly from the top navigation.

---

## 3. How We Are Going to Implement It

### Step 1: `src/components/layout/header.tsx`
- **Top Announcement Bar (`hidden sm:flex`):**
  - Dark obsidian background (`bg-card/90 border-b border-border/50 text-xs text-muted-foreground`).
  - Highlighting: `🇳🇵 100% Genuine Imported Supplements` • `📍 Golfutar Store Open (Sun-Fri 10AM-9PM)` • `⚡ Same-Day Kathmandu Delivery`.
  - Right: Store hotline link (`tel:+9779800000000`) with phone icon.
- **Main Header Container:**
  - `sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md transition-all`
  - Left: Brand Logo linking to `/` with optimized Next.js `<Image />` or stylized SVG text badge.
  - Center: `<Navbar />` (visible on `md:` and up).
  - Right:
    - Search trigger button (`min-h-[44px] min-w-[44px] rounded-xl hover:bg-muted text-foreground`).
    - Phone call link button (`hidden lg:flex`).
    - WhatsApp order CTA button (`<Button variant="whatsapp" size="default">`).
    - `<MobileNav />` hamburger toggle on mobile (`md:hidden`).

### Step 2: `src/components/layout/navbar.tsx`
- **Semantic Structure:** `<nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 lg:gap-2">`
- **Links List:**
  1. All Products (`/products`)
  2. Whey Protein (`/products?category=whey-protein`)
  3. Creatine (`/products?category=creatine`)
  4. Mass Gainers (`/products?category=mass-gainer`)
  5. Authenticity (`/authenticity`)
  6. Store Location (`/location`)
  7. Guides (`/guides`)
- **Styling:** `px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/60 rounded-lg`.

### Step 3: `src/components/layout/mobile-nav.tsx`
- **Client Component (`"use client"`):**
- Built on `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`.
- **Trigger Button:** `h-11 w-11 flex items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted active:scale-95`.
- **Drawer Content (`side="right"`):**
  - Brand header with 100% Authentic Importer badge.
  - Supplement categories with icon indicators (Whey Protein, Creatine, Mass Gainer, Pre-Workout, Fat Burners, Multivitamins).
  - Informational links: Authenticity Guarantee, Store Location & Hours, Nutrition Guides, Contact Us.
  - Pinned bottom actions: Direct Phone Call trigger (`tel:...`) + WhatsApp Instant Order button (`wa.me`).

### Step 4: `src/app/layout.tsx`
- Import `<Header />` from `@/components/layout/header`.
- Place `<Header />` before `<main id="main-content">`.

---

## 4. When We Are Going to Do It

```text
1. Update context/progress-tracker.md to mark 1.4 [IN PROGRESS]
    │
    ▼
2. Author and register Spec 09 in context/feature-specs/
    │
    ▼
3. Implement src/components/layout/navbar.tsx
    │
    ▼
4. Implement src/components/layout/mobile-nav.tsx
    │
    ▼
5. Implement src/components/layout/header.tsx
    │
    ▼
6. Update src/app/layout.tsx to mount Header
    │
    ▼
7. Run Verification Gate (tsc --noEmit, eslint, next build)
    │
    ▼
8. Update progress tracker & feature roadmap, generate walkthrough
```

---

## 5. Required Data & Dependencies

| Dependency / Constant | Origin | Purpose |
|---|---|---|
| `STORE_NAME`, `STORE_PHONE_DISPLAY`, `STORE_PHONE_INTL`, `OFFICIAL_WHATSAPP_NUMBER`, `STORE_ADDRESS` | `src/lib/constants.ts` | Brand constants, store phone & WhatsApp order numbers |
| `Button` | `src/components/ui/button.tsx` | WhatsApp & CTA button primitives |
| `Badge` | `src/components/ui/badge.tsx` | Authentic importer status pills |
| `Sheet`, `SheetContent`, `SheetTrigger` | `src/components/ui/sheet.tsx` | Mobile slide-over navigation drawer |
| `lucide-react` | `package.json` | Icons (`Menu`, `Phone`, `Search`, `MessageCircle`, `ShieldCheck`, `MapPin`, `Flame`, `Dumbbell`, `Zap`, `BookOpen`) |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Hydration Mismatch on Mobile Drawer** | Drawer open/close state differing on client/server. | Encapsulate state inside `"use client"` leaf component (`mobile-nav.tsx`). |
| **Touch Target on Mobile Menu Button <44px** | Using unpadded icon without minimum height constraint. | Explicitly enforce `h-11 w-11 min-h-[44px] min-w-[44px]` on hamburger trigger. |
| **Layout Shift on Sticky Header Scroll** | Dynamic header height changes. | Enforce fixed height classes (`h-16 sm:h-20`) with content centering. |
| **Missing Accessibility Attributes** | Hamburger button missing label or `aria-expanded`. | Provide explicit `aria-label="Open navigation menu"` and Radix-managed `aria-expanded`. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` executes with zero ESLint warnings or errors.
3. `npm run build` generates clean static bundles with 0ms TTFB prerendered routes.
4. Mobile hamburger toggle opens slide-over drawer smoothly on `<768px` viewports.
5. Header remains sticky on scroll with backdrop blur styling.
6. WhatsApp and phone call triggers link to canonical numbers from `src/lib/constants.ts`.
