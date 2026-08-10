# Technical Implementation Specification: Sub-Phase 5.4 — Interactive Form Components & Consultation Modal

> **Status:** Approved / Complete  
> **Sub-Phase:** `5.4`  
> **Target Files:**
> - `src/components/forms/inquiry-form.tsx` [NEW]
> - `src/components/forms/contact-form.tsx` [NEW]
> - `src/components/forms/consultation-modal.tsx` [NEW]
> **Dependencies:** `Sub-Phase 1.2`, `Sub-Phase 1.3`, `Sub-Phase 5.3`

---

## 1. Overview & Business Objectives

Sub-Phase 5.4 delivers the client-side interactive form component suite and consultation modal for MuscleWorks Supplements. It bridges the UI layer with the Server Actions Pipeline (`submitInquiryAction` in `src/actions/inquiry.ts` and `submitContactAction` in `src/actions/contact.ts`).

### Primary Goals:
1. Build `InquiryForm` using React Hook Form + `@hookform/resolvers/zod` + `InquiryFormClientSchema`.
2. Build `ContactForm` tailored for the `/contact` page using `submitContactAction`.
3. Build `ConsultationModal` utilizing Radix UI `Dialog` primitives for free expert supplement stack advice.
4. Integrate Nepal phone validation (`+977-98...`), Kathmandu Valley city select, anti-bot honeypot (`hp_field`), and timing trap (`_form_loaded_at`).
5. Render luxury inline success receipts with Inquiry ID & WhatsApp quick follow-up CTAs alongside Sonner toasts.

---

## 2. Key Architectural Decisions

- **Form Management Engine:** `react-hook-form` paired with `@hookform/resolvers/zod` enforcing `InquiryFormClientSchema` from `@/lib/validations/inquiry`.
- **Anti-Bot Security:** 
  - `_form_loaded_at`: Initialized via `useEffect` / state on component mount with `Date.now()`.
  - `hp_field`: Visually hidden offscreen input (`tabIndex={-1}`, `aria-hidden="true"`, `autoComplete="off"`).
- **Post-Submission Receipt UX:** Upon `ActionResult.success === true`, replace the form fields with an inline luxury receipt card showing the generated `inquiryId`, inquiry summary, direct WhatsApp call-to-action button, and trigger `toast.success()`.
- **Contextual Product Payload:** Accept optional `productContext?: InquiryProductContext`. When supplied, render a compact product summary preview pill and default `inquiryType` to `product_inquiry`.

---

## 3. Detailed Component Contracts

### 3.1 `InquiryForm` (`src/components/forms/inquiry-form.tsx`)
```tsx
export interface InquiryFormProps {
  productContext?: InquiryProductContext;
  defaultInquiryType?: InquiryType;
  onSuccess?: (inquiryId: string) => void;
  className?: string;
}
```

### 3.2 `ContactForm` (`src/components/forms/contact-form.tsx`)
```tsx
export interface ContactFormProps {
  className?: string;
  onSuccess?: (inquiryId: string) => void;
}
```

### 3.3 `ConsultationModal` (`src/components/forms/consultation-modal.tsx`)
```tsx
export interface ConsultationModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  productContext?: InquiryProductContext;
  trigger?: React.ReactNode;
}
```

---

## 4. Verification Plan

- `npx tsc --noEmit`: 0 errors.
- Component rendering tests & interactive input validation check.
