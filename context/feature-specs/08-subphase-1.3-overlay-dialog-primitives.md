# Feature Spec 08: Sub-Phase 1.3 — Overlay & Dialog Primitives (Radix Headless)

> **Spec ID:** `08-subphase-1.3-overlay-dialog-primitives`  
> **Target Sub-Phase / Branch:** `Phase 1 — Sub-Phase 1.3`  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification governs the implementation of **Sub-Phase 1.3: Overlay & Dialog Primitives (Radix Headless)** for the MuscleWorks Supplements platform. It establishes accessible, mobile-optimized overlay surfaces and hierarchical navigation primitives (`Dialog`, `Sheet`, `Toast`, and `Breadcrumb`). 

These primitives provide the structural foundation for modal dialogs (product quick view, authenticity scanner, stack consultation modals), directional slide-over panels (mobile navigation drawer, catalog filter sheets), dark athletic toast notifications (`sonner` wrappers), and accessible semantic breadcrumb paths (`<nav aria-label="breadcrumb">`).

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/components/ui/dialog.tsx` | **[NEW]** | Implement Radix UI `@radix-ui/react-dialog` primitive family (`Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`, `DialogClose`) with dark backdrop blur overlay, focus trapping, keyboard dismiss (`Escape`), and ≥44px touch targets for close actions. |
| 2 | `src/components/ui/sheet.tsx` | **[NEW]** | Implement accessible slide-over drawer built on Radix Dialog with CVA directional side variants (`top`, `bottom`, `left`, `right`), designed specifically for the mobile navigation drawer (slide from right/left) and mobile catalog filter sheet (slide from bottom). |
| 3 | `src/components/ui/toast.tsx` | **[NEW]** | Implement customized toast trigger helpers wrapping `sonner` (`toast.success`, `toast.error`, `toast.info`, `toast.warning`, `toast.message`, `showWhatsAppOrderToast`) styled with dark athletic theme tokens and high-contrast icons. |
| 4 | `src/components/ui/breadcrumb.tsx` | **[NEW]** | Implement semantic `<nav aria-label="breadcrumb">` component family (`Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`) with `ChevronRight` / `Slash` separators and accessible active page indicators (`aria-current="page"`). |

---

## 2. Why We Are Doing This

1. **Accessible Focus & Trapping on Overlays:** Supplement consultation modals, variant quick-views, and filter sheets require robust focus trapping and screen-reader announcements (WAI-ARIA `dialog` role) to ensure full accessibility. Radix UI headless primitives handle focus restoration and `Escape` key listeners natively.
2. **Mobile Navigation & Filter Drawers (Sheet):** Over 85% of traffic in Nepal is mobile. The `Sheet` primitive provides smooth sliding bottom-sheets for catalog filter sheets and side-drawers for the mobile menu navigation with touch-friendly dismiss buttons.
3. **Athletic Toast Feedback:** When users submit consultation requests, copy WhatsApp inquiry text, or encounter form errors, unified toast notifications provide non-intrusive, athletic-branded feedback.
4. **SEO & Navigation Hierarchy (Breadcrumbs):** Search engines (Google rich snippets) and users navigating deep catalog hierarchies (`Home > Proteins > Whey Protein Isolate > Optimum Nutrition Gold Standard 100% Whey`) require semantic, accessible breadcrumb structures.

---

## 3. How We Are Going to Implement It

### Step 1: `src/components/ui/dialog.tsx`
- **Primitives Exported:** `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`.
- **Overlay Styling:**
  - `fixed inset-0 z-50 bg-black/80 backdrop-blur-sm`
  - Open/Close animations: `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0`
- **Content Styling:**
  - Position: `fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-2xl duration-200 rounded-2xl`
  - Animations: `data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]`
  - Close button: `absolute right-4 top-4 rounded-xl opacity-70 ring-offset-background transition-opacity hover:opacity-100 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none h-11 w-11 flex items-center justify-center` with `X` icon and `sr-only` "Close".
- **Typography:** `DialogTitle` uses `font-heading font-bold text-lg sm:text-xl text-foreground`, `DialogDescription` uses `text-sm text-muted-foreground leading-relaxed`.

### Step 2: `src/components/ui/sheet.tsx`
- **Primitives Exported:** `Sheet`, `SheetTrigger`, `SheetClose`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetFooter`, `SheetTitle`, `SheetDescription`.
- **CVA Side Variants (`sheetVariants`):**
  - `top`: `inset-x-0 top-0 border-b border-border data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top`
  - `bottom`: `inset-x-0 bottom-0 border-t border-border rounded-t-2xl max-h-[90vh] overflow-y-auto data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom`
  - `left`: `inset-y-0 left-0 h-full w-3/4 max-w-sm border-r border-border data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-md`
  - `right`: `inset-y-0 right-0 h-full w-3/4 max-w-sm border-l border-border data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md`
- **Close Button:** Integrated `h-11 w-11` touch button in top-right with `X` icon.

### Step 3: `src/components/ui/toast.tsx`
- **Re-exports:** Re-export `toast` from `sonner`.
- **Helper Functions:**
  - `showSuccessToast(message: string, description?: string)`
  - `showErrorToast(message: string, description?: string)`
  - `showInfoToast(message: string, description?: string)`
  - `showWhatsAppOrderToast(productName: string, whatsappUrl: string)`

### Step 4: `src/components/ui/breadcrumb.tsx`
- **Components Exported:**
  - `Breadcrumb`: `<nav aria-label="breadcrumb" />`
  - `BreadcrumbList`: `<ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5" />`
  - `BreadcrumbItem`: `<li className="inline-flex items-center gap-1.5" />`
  - `BreadcrumbLink`: Anchor or Radix `Slot` when `asChild=true` with `transition-colors hover:text-foreground`
  - `BreadcrumbPage`: `<span role="link" aria-disabled="true" aria-current="page" className="font-semibold text-foreground" />`
  - `BreadcrumbSeparator`: `<li role="presentation" aria-hidden="true">` rendering `ChevronRight` icon (or custom child)
  - `BreadcrumbEllipsis`: `<span role="presentation" aria-hidden="true">` with `MoreHorizontal` icon and `sr-only` "More".

---

## 4. When We Are Going to Do It

```text
1. Update context/progress-tracker.md to mark 1.3 [IN PROGRESS]
    │
    ▼
2. Author and register Spec 08 in context/feature-specs/
    │
    ▼
3. Implement src/components/ui/dialog.tsx
    │
    ▼
4. Implement src/components/ui/sheet.tsx
    │
    ▼
5. Implement src/components/ui/toast.tsx
    │
    ▼
6. Implement src/components/ui/breadcrumb.tsx
    │
    ▼
7. Run Verification Gate (tsc --noEmit, eslint, next build)
    │
    ▼
8. Update progress tracker & feature roadmap, generate walkthrough
```

---

## 5. Required Data & Dependencies

| Dependency / Component | Origin | Purpose |
|---|---|---|
| `@radix-ui/react-dialog` | `package.json` (`^1.1.6`) | Headless dialog engine, focus trap, portal, overlay |
| `@radix-ui/react-slot` | `package.json` (`^1.1.2`) | Polymorphic `asChild` delegation for breadcrumb links |
| `class-variance-authority` | `package.json` (`^0.7.1`) | CVA side variants for `Sheet` (`top`, `bottom`, `left`, `right`) |
| `lucide-react` | `package.json` (`^1.16.0`) | Icons (`X`, `ChevronRight`, `MoreHorizontal`, `CheckCircle2`, `AlertCircle`, `Info`, `MessageCircle`) |
| `sonner` | `package.json` (`^2.0.1`) | Toast notification engine configured in root layout |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **SSR / Hydration Mismatch with Portals** | Portaling dialogs without client component declaration. | Mark `dialog.tsx` and `sheet.tsx` with `"use client"` at file header. |
| **Touch Target on Close Button <44px** | Default tiny close icon button. | Standardize close button on `h-11 w-11` (44x44px) with rounded tap target. |
| **Body Scroll Lock Jump** | Radix Dialog removing scrollbar causing layout shift. | Handled automatically by Radix UI, but verified with global scrollbar styles. |
| **Breadcrumb Active Page Semantics** | Missing `aria-current="page"` on the current route breadcrumb item. | Explicitly attach `aria-current="page"` and `role="link"` to `BreadcrumbPage`. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
2. `npm run lint` executes with zero ESLint warnings or errors.
3. `npm run build` generates clean static bundles with 0ms TTFB prerendered routes.
4. Touch targets on dialog close buttons and sheet triggers meet ≥44px standard.
5. All components adhere to dark athletic theme tokens (`bg-card`, `border-border`, `text-foreground`, `text-muted-foreground`, `bg-primary`).
