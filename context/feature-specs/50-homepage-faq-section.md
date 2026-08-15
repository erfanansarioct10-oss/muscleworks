# Feature Spec 50: Homepage Frequently Asked Questions (FAQ) Section

> **Spec ID:** `50-homepage-faq-section`  
> **Target Sub-Phase / Branch:** Homepage Showcase Assembly (`src/components/home/home-faq-section.tsx`, `src/app/page.tsx`)  
> **Status:** Complete  
> **Created Date:** 2026-08-15  
> **Author:** AI Agent / Antigravity  

---

## Executive Summary

This feature adds a high-converting, mobile-optimized **Frequently Asked Questions (FAQ)** section directly below the `<HomeContactSection />` and above the global `<Footer />` on the homepage (`/`). 

Designed with a responsive **2-Column Split Layout** over the platform's signature dark athletic charcoal background textures, the section addresses top pre-purchase friction points (100% genuine authenticity verification, scratch-and-verify hologram seals, same-day Kathmandu Valley delivery, nationwide Nepal courier shipping, instant WhatsApp ordering, and COD/Fonepay payment methods). Built using accessible Radix UI Accordion primitives (`@radix-ui/react-accordion`) with electric orange (`#FF5500`) highlights and direct WhatsApp consultation action cards ($\ge 48\text{px}$ touch target).

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/ui/accordion.tsx` | **[NEW]** | Accessible, headless Radix UI Accordion primitive with smooth height animation and chevron rotation styling. |
| 2 | `src/components/home/home-faq-section.tsx` | **[NEW]** | Homepage FAQ section component with 2-column split layout, background textures, left assistance CTA card, and right accordion items. |
| 3 | `src/app/page.tsx` | **[MODIFY]** | Mount `<HomeFaqSection />` directly below `<HomeContactSection />`. |

---

## 2. Why We Are Doing This

1. **Pre-Purchase Friction Elimination:** Supplements in Nepal face widespread counterfeit concerns. Positioning clear, authoritative answers regarding official importer holographic seals, money-back guarantees, and Kathmandu same-day delivery right before the footer builds high customer confidence.
2. **Design System & Theme Consistency:** Continues the dark athletic charcoal texture aesthetic (`charcoal-bg.webp` desktop / `charcoal-bg-mobile.webp` mobile) with `bg-black/60` dark overlay established across the Deals, Goals, and Contact sections.
3. **Mobile-First Touch Ergonomics:** Accordion question triggers provide generous touch areas ($\ge 48\text{px}$ height) with full mobile responsiveness, zero layout shift, and smooth height animations.
4. **Instant WhatsApp Escalation:** The left column provides a direct 1-tap WhatsApp consultation CTA button for questions not covered in the FAQ list.

---

## 3. How We Are Going to Implement It

### Step 1: Radix UI Accordion Primitive (`src/components/ui/accordion.tsx`)
- Implement accessible `Accordion`, `AccordionItem`, `AccordionTrigger`, and `AccordionContent` components wrapping `@radix-ui/react-accordion`.
- Style with Tailwind CSS v4 `@theme` tokens, smooth chevron rotation (`group-data-[state=open]:rotate-180`), and fluid height transitions (`data-[state=open]:animate-accordion-down`, `data-[state=closed]:animate-accordion-up`).

### Step 2: Homepage FAQ Section Component (`src/components/home/home-faq-section.tsx`)
- **Background Layer:** Responsive dual charcoal background textures (`charcoal-bg-mobile.webp` on `< 640px`, `charcoal-bg.webp` on `≥ 640px`) with `bg-black/60` dark overlay.
- **Left Column (`lg:col-span-5`):**
  - Section title: `FREQUENTLY ASKED <span className="text-[#FF5500]">QUESTIONS</span>` (matching the display style of other homepage sections).
  - Subtitle: "Find clear answers about 100% genuine authenticity, importer seals, Kathmandu delivery, and ordering."
  - Quick Assistance Card: Dark glassmorphic card with WhatsApp icon, hotline number (`+977 986-1725036`), and emerald green **"Chat on WhatsApp"** button ($\ge 48\text{px}$ height).
- **Right Column (`lg:col-span-7`):**
  - Curated top 6 essential FAQs:
    1. *How can I verify that supplements bought from MUSCLEWORKS Nepal are 100% genuine?*
    2. *What authorized importer holographic seals should I look for?*
    3. *How quickly do you deliver within Kathmandu Valley?*
    4. *Do you ship outside Kathmandu Valley to Pokhara, Chitwan, or Butwal?*
    5. *How does ordering via WhatsApp work?*
    6. *What payment methods do you accept?*
  - Single-item collapsible accordion with Question 1 (Authenticity Verification) open by default (`defaultValue="faq_authenticity_1"`).

### Step 3: Page Integration (`src/app/page.tsx`)
- Mount `<HomeFaqSection />` directly below `<HomeContactSection />`.

---

## 4. When We Are Going to Do It

```text
Phase 1: Implement Radix Accordion Primitive (src/components/ui/accordion.tsx)
    │
    ▼
Phase 2: Build Homepage FAQ Section Component (src/components/home/home-faq-section.tsx)
    │
    ▼
Phase 3: Mount HomeFaqSection in Homepage (src/app/page.tsx)
    │
    ▼
Phase 4: Mobile & Responsive Viewport Audit (<640px, 768px, 1024px, 1280px)
    │
    ▼
Phase 5: Automated Verification Gate (tsc --noEmit, npm run lint)
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Curated FAQ Items | `data/faqs.json` / `src/lib/data/faqs.ts` | Authenticity, delivery, WhatsApp, payment questions & answers |
| Store Hotline & WhatsApp | `src/lib/constants.ts` (`STORE_PHONE`, `STORE_PHONE_RAW`) | Phone link & display |
| WhatsApp Direct URL | `src/lib/whatsapp.ts` (`buildGeneralWhatsAppUrl`) | Pre-filled stack advice & support link |
| Background Assets | `public/deals/charcoal-bg.webp`, `charcoal-bg-mobile.webp` | Responsive dark textured background |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Mobile Accordion Jump / Layout Shift** | Dynamic content expanding without smooth height transitions. | Use Radix UI accordion state transitions with CSS grid/overflow animation. |
| **Touch Target Violation on Mobile** | Trigger headers having inadequate padding (<44px). | Ensure `AccordionTrigger` has `min-h-[48px]` and `py-4 sm:py-5 px-5` touch area. |
| **Excessive Vertical Page Length** | Displaying all 12 FAQs simultaneously creating long scroll. | Curate top 6 highest-intent questions and use single-expand accordion mode. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` executes with zero ESLint errors.
3. Mobile viewport tested at 360px, 390px, 768px, and 1280px with zero horizontal scroll.
4. All conversion buttons and accordion triggers meet $\ge 48\text{px}$ touch height standard.
5. First question is open by default and clicking another question smoothly transitions open state.
