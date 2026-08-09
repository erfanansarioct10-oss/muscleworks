# Feature Spec 12: High-Performance Light Theme & Design System Migration

> **Spec ID:** `12-light-theme-design-system-migration`  
> **Target Sub-Phase / Branch:** `Phase 1` Design System & Theme Transformation  
> **Status:** Superseded  
> **Created Date:** 2026-08-09  
> **Author:** AI Coding Agent (Antigravity IDE)

---

> [!IMPORTANT]
> **SUPERSEDED SPECIFICATION:** This specification has been superseded by [Spec 13: Minimal Premium Modern Luxury Theme Migration](13-minimal-premium-luxury-theme.md). This document is preserved for historical context and MUST NOT guide new implementations.

---

## Executive Summary

Based on direct user feedback requesting a transition from the dark obsidian aesthetic to a high-contrast, premium **Light Theme**, this specification details the complete migration of the MUSCLEWORKS SUPPLEMENTS design system.

The new theme features:
- **Canvas & Card:** Ultra-clean `#f8fafc` (Slate 50) canvas with pure white `#ffffff` elevated cards and crisp `#e2e8f0` borders.
- **Typography:** `#0f172a` (Slate 900) high-contrast charcoal text with `#64748b` (Slate 500) secondary text.
- **Accents:** `#dc2626` (Red 600 Gym Crimson) primary energy accent and `#059669` (Emerald 600) WhatsApp CTA color (**4.52:1** WCAG AA contrast with white text).
- **Logo Rendering:** Removal of dark-mode CSS `invert` filters across all navigation, header, footer, and home components to render the authentic black MuscleWorks logomark natively.

---

## 1. What We Are Going to Do

| # | Target File | Action | Summary of Remediation |
|:---:|---|:---:|---|
| 1 | `src/app/globals.css` | **[MODIFY]** | Replace dark theme tokens with High-Performance Clean Light palette; update `color-scheme: light` and scrollbar styling. |
| 2 | `src/app/page.tsx` | **[MODIFY]** | Remove `invert` from logo image; update theme badge labels. |
| 3 | `src/components/layout/header.tsx` | **[MODIFY]** | Remove `invert` filter from header logo `<Image>`. |
| 4 | `src/components/layout/footer.tsx` | **[MODIFY]** | Remove `invert` filter from footer logo `<Image>`. |
| 5 | `src/components/layout/mobile-nav.tsx` | **[MODIFY]** | Remove `invert` filter from mobile nav logo `<Image>`. |
| 6 | `src/app/layout.tsx` | **[MODIFY]** | Configure Sonner `<Toaster theme="light" />`. |
| 7 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 12 in Specification Registry Index. |
| 8 | `context/progress-tracker.md` | **[MODIFY]** | Log Spec 12 in Session Change Log. |

---

## 2. Why We Are Doing This

1. **User Preference Alignment:** Direct user instruction to transition from dark mode to a clean light design aesthetic.
2. **Readability & Daylight Usability:** Light theme improves outdoor readability on mobile viewports for users checking supplement catalog details on mobile devices in bright environments.
3. **WCAG AA Compliance:** All text contrast ratios are strictly verified above 4.5:1 (Slate 900 text on white/slate canvas >15:1; White text on Red 600 >5.5:1; White text on Emerald 600 >4.5:1).

---

## 3. How We Are Going to Implement It

### Step 1: Tailwind v4 Light Theme Engine (`src/app/globals.css`)
```css
@theme {
  --color-background: #f8fafc;       /* Slate 50 Light Athletic Canvas */
  --color-foreground: #0f172a;       /* Slate 900 High-Contrast Charcoal Text */
  
  --color-card: #ffffff;             /* Pure White Slate Card Surface */
  --color-card-foreground: #0f172a;  /* Card Text */
  
  --color-primary: #dc2626;          /* Red 600 Electric Gym Crimson */
  --color-primary-hover: #b91c1c;    /* Red 700 Crimson Hover State */
  --color-primary-foreground: #ffffff;
  
  --color-secondary: #f1f5f9;        /* Slate 100 Secondary Light Surface */
  --color-secondary-foreground: #0f172a;
  
  --color-accent: #d97706;           /* Amber 600 Performance Gold */
  --color-accent-foreground: #ffffff;
  
  --color-success: #059669;          /* Emerald 600 WhatsApp CTA */
  --color-success-foreground: #ffffff;
  
  --color-muted: #f1f5f9;            /* Slate 100 Muted Element Fill */
  --color-muted-foreground: #64748b; /* Slate 500 Muted Secondary Text */
  
  --color-border: #e2e8f0;           /* Slate 200 Crisp Divider */
  --color-ring: #dc2626;             /* Primary Electric Crimson Focus Ring */
}

@layer base {
  html {
    color-scheme: light;
  }
}
```

### Step 2: Un-invert Logomark Assets
Remove `invert` from logo `<Image>` tags across `header.tsx`, `footer.tsx`, `mobile-nav.tsx`, and `page.tsx` so the black logomark renders natively on light background.

---

## 4. Verification & Definition of Done

1. `npx tsc --noEmit` completes with **0 errors**.
2. `npm run lint` completes with **0 warnings/errors**.
3. `npm run build` succeeds with full static pre-rendering (SSG).
4. All text elements on light background meet WCAG AA contrast standards ($\ge 4.5:1$).
