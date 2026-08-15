# Feature Spec 49: Homepage Contact Us Section ("GET IN TOUCH")

> **Spec ID:** `49-homepage-contact-us-section`  
> **Target Sub-Phase / Branch:** Sub-Phase 6.4 / Homepage Assembly  
> **Status:** Approved  
> **Created Date:** 2026-08-15  
> **Author:** AI Agent & Paired Engineer  

---

## Executive Summary

Build and integrate the final homepage section, the **Homepage Contact Us Section** (`<HomeContactSection />`), positioned directly after the `<CustomerReviewsSection />` on `src/app/page.tsx`.

Following explicit user design requirements and `/grill-me` alignment:
- **Dark Charcoal Background:** Renders the dark athletic charcoal background textures matching the Goals section (`/deals/charcoal-bg.webp` on desktop, `/deals/charcoal-bg-mobile.webp` on mobile, `bg-slate-950`).
- **Direct Background Placement (No Enclosing Boxes or Cards):** No card or container boxes are used. All headings, contact information, input fields, and action buttons are positioned directly on top of the textured background.
- **Divider Line Styling:** Employs clean, subtle line divider styling (`border-slate-800` / `divide-slate-800`) separating the store information column from the interactive form column on desktop, and separating the stacked columns on mobile.
- **2-Column Split Layout:**
  - **Left Column:** MuscleWorks physical retail store profile at **Golfutar, Budha-Nilkantha, Kathmandu (44500)**, direct telephone hotline link (`+977-9819877070`), WhatsApp direct consultation CTA button (`wa.me`), operating hours (Sunday–Friday 10:00 AM – 9:00 PM, Saturday advisory), and same-day Kathmandu delivery notice.
  - **Right Column:** Direct-on-background interactive inquiry & contact form with real-time Zod validation, Nepal phone regex (`+977-98...`), delivery city selector, contact method radio toggle (WhatsApp / Phone / Email), message input, anti-spam honeypot (`hp_field`), timing trap (`_form_loaded_at`), and glowing electric orange (`#FF5500`) submit button.
- **Backend Server Action Pipeline:** Directly connected to `submitContactAction` (`src/actions/contact.ts`), utilizing `@upstash/ratelimit`, Telegram MarkdownV2 alerts, and Resend customer confirmation emails.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/components/home/home-contact-section.tsx` | **[NEW]** | Client component rendering the boxless 2-column contact section on dark charcoal background. |
| 2 | `src/app/page.tsx` | **[MODIFY]** | Mount `<HomeContactSection />` directly below `<CustomerReviewsSection />`. |
| 3 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 49 in the Specification Registry Index. |
| 4 | `context/progress-tracker.md` | **[MODIFY]** | Update Phase 6 progress and log implementation entry. |

---

## 2. Why We Are Doing This

1. **Conversion & High-Touch Support (`context/project-overview.md`):** Supplements in Nepal are high-consideration purchases. Providing an easily accessible, boxless, non-intimidating contact channel directly on the homepage increases lead capture for stack advice, product inquiries, and Kathmandu same-day orders.
2. **Visual Contrast & Section Rhythm:** Placing a high-contrast dark charcoal background section after the light/white Customer Reviews and Favorite Brand sections creates a balanced visual rhythm on the homepage, matching the dark aesthetic of the Deals and Goals sections.
3. **Mobile-First Responsiveness:** Implements dedicated mobile vertical background texture (`charcoal-bg-mobile.webp`) with single-column vertical flow, full-width touch targets ($\ge 48\text{px}$), and seamless keyboard navigation.
4. **Anti-Bot Security & Zero Runtime Drift:** Enforces client and server Zod schemas (`InquiryFormClientSchema`), honeypot detection, timing traps, and sliding-window rate limiting.

---

## 3. How We Are Going to Implement It

### Step 1: Component Architecture & Layout (`src/components/home/home-contact-section.tsx`)

- **Root Section Container:**
  ```tsx
  <section className="relative w-full overflow-hidden bg-slate-950 py-16 sm:py-20 lg:py-24 border-t border-slate-800">
    {/* Responsive Dual Background Textures */}
    <Image
      src="/deals/charcoal-bg-mobile.webp"
      alt="Dark Charcoal Background Texture Mobile"
      fill
      sizes="(max-width: 640px) 100vw, 1px"
      className="object-cover object-center sm:hidden"
    />
    <Image
      src="/deals/charcoal-bg.webp"
      alt="Dark Charcoal Background Texture Desktop"
      fill
      sizes="(max-width: 640px) 1px, 100vw"
      className="object-cover object-center hidden sm:block"
    />
    {/* Vignette Overlay */}
    <div className="absolute inset-0 bg-slate-950/70 pointer-events-none" />
  ```

- **2-Column Grid with Line Divider:**
  ```tsx
  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      {/* Left Column (5 cols): Store Details & Direct Channels */}
      <div className="lg:col-span-5 flex flex-col justify-between">
        ...
      </div>

      {/* Right Column (7 cols): Direct-on-background Form */}
      <div className="lg:col-span-7 lg:pl-12 lg:border-l lg:border-slate-800/90 pt-10 lg:pt-0 border-t border-slate-800/90 lg:border-t-0">
        ...
      </div>
    </div>
  </div>
  ```

- **Input Styling (Direct on Background, No Boxes):**
  - Inputs use semi-transparent dark surfaces with clean border outlines: `bg-slate-900/60 border-slate-700/80 text-white placeholder-slate-400 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] rounded-xl px-4 py-3 min-h-[48px]`.
  - Submit Button: Full-width / primary CTA button `bg-[#FF5500] hover:bg-[#e04b00] text-white font-extrabold tracking-wide uppercase min-h-[48px] shadow-lg`.

### Step 2: Form State Management & Server Action Binding

- Wire form with `useForm<InquiryFormClientValues>` using `zodResolver(InquiryFormClientSchema)`.
- Enforce `hp_field` honeypot and `_form_loaded_at` timing trap on mount.
- Call `submitContactAction` on valid submit with double-submission mutex ref lock.
- Display instant luxury receipt card with Inquiry ID and direct WhatsApp follow-up action upon successful submission.

---

## 4. When We Are Going to Do It

```text
Phase 1: Component Implementation (src/components/home/home-contact-section.tsx)
    │
    ▼
Phase 2: Homepage Integration (src/app/page.tsx)
    │
    ▼
Phase 3: TypeScript Compilation & Lint Validation (npx tsc --noEmit, npm run lint)
    │
    ▼
Phase 4: Documentation & Progress Tracker Synchronization
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Background Textures | `public/deals/charcoal-bg.webp`, `public/deals/charcoal-bg-mobile.webp` | Responsive dark textured section backdrop |
| Store Details & Hotline | Golfutar, Budha-Nilkantha, Kathmandu · `+977 981-9877070` | Contact information, hotline links, opening hours |
| Form Validation Schema | `InquiryFormClientSchema` (`src/lib/validations/inquiry.ts`) | Strict client form validation |
| Server Action | `submitContactAction` (`src/actions/contact.ts`) | Server processing, rate limiting & notification dispatch |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Text Contrast on Dark Background** | Secondary labels becoming illegible against dark texture. | Use `text-slate-300` / `text-slate-400` with high-contrast `text-white` for primary headings and inputs. |
| **Mobile Form Focus Viewport Jump** | Missing explicit touch-target height or zoom triggers. | Ensure all inputs have `min-h-[48px]` and `text-base` font size on mobile to prevent iOS Safari auto-zoom. |
| **Server Action Double-Submit** | Rapid user taps on mobile submit button. | Use `isSubmittingLockRef` to guard against concurrent action dispatches. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with 0 TypeScript errors.
2. `npm run lint` completes with 0 errors.
3. Dark charcoal background textures render properly on both mobile and desktop viewports.
4. No box or card wrapper is rendered around the form or store info.
5. Line dividers cleanly separate store details and form fields.
6. Form validation works correctly on invalid phone numbers or empty messages.
7. Successful submissions trigger `submitContactAction` and render the receipt view.
