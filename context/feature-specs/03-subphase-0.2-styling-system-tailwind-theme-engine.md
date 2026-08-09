# Feature Spec 03: Sub-Phase 0.2 — Styling System & Tailwind CSS v4 Theme Engine

> **Spec ID:** `03-subphase-0.2-styling-system-tailwind-theme-engine`  
> **Target Sub-Phase / Branch:** `Phase 0 — Sub-Phase 0.2`  
> **Status:** Complete  
> **Created Date:** 2026-08-09  
> **Author:** Antigravity AI Agent

---

## Executive Summary

This specification defines the implementation of **Sub-Phase 0.2: Styling System & Tailwind CSS v4 Theme Engine** for MuscleWorks Supplements. It establishes the complete Tailwind CSS v4 design token engine, CSS custom properties, responsive typography scales, focus-visible states, athletic dark-mode foundations, and mobile touch reset utilities. The color system implements the approved **Option 1: Stealth Crimson & Obsidian** palette derived directly from the angular lightning "MW" brand logo.

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/app/globals.css` | **[NEW]** | Implement Tailwind CSS v4 `@theme` block with Option 1 athletic color tokens, font variable bindings, custom scrollbar styling, accessible focus rings, and mobile touch callout resets. |
| 2 | `postcss.config.mjs` | **[VERIFY/MODIFY]** | Ensure `@tailwindcss/postcss` plugin is configured correctly for Tailwind CSS v4 compilation. |
| 3 | `src/app/layout.tsx` & `src/app/page.tsx` | **[MIGRATE/NEW]** | Relocate root `app/` shell files into canonical `src/app/` directory according to [`context/file-map.md`](../file-map.md) and strict `@/*` path alias standards. |

---

## 2. Why We Are Doing This

1. **Brand Identity & Logo Harmony:** Option 1 (*Stealth Crimson & Obsidian*) translates the high-energy, athletic geometry of the lightning-arrow MW logo into a commanding dark-mode gym theme:
   - Deep Obsidian Canvas (`#09090b`) + Elevated Charcoal Card (`#121216`)
   - Electric Gym Crimson (`#dc2626`) for primary brand power
   - Dedicated WhatsApp & Trust Emerald (`#10b981`) for instant conversion in Nepal
   - Performance Amber Gold (`#f59e0b`) for star ratings and genuine import badges
2. **Next.js 16 & `src/` Directory Architecture:** The project specification ([`context/file-map.md`](../file-map.md)) mandates the `src/` directory convention with `@/*` mapping to `./src/*`. Moving from root `app/` to `src/app/` ensures 100% path alias consistency.
3. **Tailwind CSS v4 Engine:** Eliminates legacy `tailwind.config.js` in favor of native CSS `@theme` variables, ensuring zero runtime CSS overhead and optimal Turbopack build speeds.
4. **Accessibility (WCAG 2.1 AA):** Enforces high-contrast text ratios (`#f4f4f5` on `#09090b` > 14:1) and visible focus rings (`ring-2 ring-primary focus-visible:outline-none`).

---

## 3. How We Are Going to Implement It

### Step 1: Tailwind CSS v4 `@theme` Configuration in `src/app/globals.css`

Define all athletic tokens within the CSS `@theme` directive:

```css
@import "tailwindcss";

@theme {
  /* Font Family Bindings */
  --font-sans: var(--font-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-heading: var(--font-heading), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Minimal Premium Modern Luxury Palette */
  --color-background: #fcfcfc;       /* Pure Off-White Canvas */
  --color-foreground: #0b0b0b;       /* Jet Black Premium Text */
  
  --color-card: #ffffff;             /* Pure White Surface */
  --color-card-foreground: #0b0b0b;  /* Card Text */
  
  --color-primary: #0b0b0b;          /* Jet Black Primary Action */
  --color-primary-hover: #2c2c2c;    /* Neutral Gray Hover State */
  --color-primary-foreground: #ffffff;
  
  --color-secondary: #f5f5f5;        /* Silver Gray Secondary Light Surface */
  --color-secondary-foreground: #0b0b0b;
  
  --color-accent: #d4af37;           /* Metallic Luxury Gold */
  --color-accent-foreground: #0b0b0b;
  
  --color-success: #0b0b0b;          /* Jet Black Conversion CTA */
  --color-success-foreground: #ffffff;
  
  --color-muted: #f5f5f5;            /* Silver Gray Muted Element Fill */
  --color-muted-foreground: #666666; /* Neutral Gray Muted Secondary Text */
  
  --color-border: #e5e5e5;           /* Crisp Silver Divider */
  --color-ring: #d4af37;             /* Metallic Luxury Gold Focus Ring */
  
  /* Standardized Border Radii */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
}
```

### Step 2: Global Resets, Utilities & Scrollbar Styling

Add foundational base styles and utilities:
- `html` smooth scrolling and dark color-scheme declaration.
- Touch callout reset (`-webkit-touch-callout: none`) and tap highlight removal for mobile devices.
- Custom dark athletic scrollbar (`::-webkit-scrollbar` with `#18181b` track and `#27272a` thumb).
- Safe area inset padding helpers for mobile bottom bars (`env(safe-area-inset-bottom)`).

### Step 3: Migration to Canonical `src/app/`

- Create `src/app/globals.css`.
- Relocate and adapt `app/layout.tsx`, `app/page.tsx`, and `app/favicon.ico` into `src/app/`.
- Clean up legacy root `app/` directory to prevent Next.js routing collisions.

---

## 4. When We Are Going to Do It

```text
1. Draft Spec 03 (THIS SPEC) & Update Progress Tracker
    │
    ▼
2. User Approval Gate (Review & Confirm)
    │
    ▼
3. Create `src/app/globals.css` with `@theme` Tokens & Base Utilities
    │
    ▼
4. Migrate root `app/` files to `src/app/`
    │
    ▼
5. Execute Verification Gate (`npx tsc --noEmit` & `npm run build`)
    │
    ▼
6. Post-Flight Hand-off: Mark Sub-Phase 0.2 Complete & Promote Sub-Phase 0.3
```

---

## 5. Required Data & Design Assets

| Asset / Source | Path / Origin | Purpose |
|---|---|---|
| Master Logo Mark | `public/brnding-assets/logo.png` | Visual anchor for dark contrast & athletic red accent |
| Coding Standards | `context/coding-standards.md` §5 | Canonical color tokens, CSS variables, and CVA contracts |
| File Map | `context/file-map.md` §2 | Canonical `src/app/` directory standard |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Root `app/` vs `src/app/` Collision** | Next.js throws error if both `./app` and `./src/app` exist simultaneously. | Migrate all files into `src/app/` and remove root `app/` in a single atomic step. |
| **Tailwind v4 Font Fallback Flash** | Custom font variables (`--font-sans`, `--font-heading`) not yet injected by `next/font/google` until Sub-Phase 0.4. | Provide complete system font fallback chain (`system-ui, -apple-system, sans-serif`) in `@theme` definition. |
| **Purge / Unused Token Warnings** | Tailwind v4 uses CSS-first scanning; obsolete v3 directives trigger warnings. | Use pure `@import "tailwindcss";` and `@theme` without legacy `@tailwind` directives. |

---

## 7. Verification & Definition of Done

1. [ ] `src/app/globals.css` is populated with all Option 1 `@theme` tokens and athletic resets.
2. [ ] Root `app/` is cleanly migrated to `src/app/` with zero file remnants.
3. [ ] `npx tsc --noEmit` compiles with **0 errors**.
4. [ ] `npm run build` succeeds with static page generation.
5. [ ] [`context/progress-tracker.md`](../progress-tracker.md) and [`context/feature-roadmap.md`](../feature-roadmap.md) updated with Sub-Phase 0.2 marked `[x]`.

---

## 8. Specification Sign-Off

- **Target Execution Sub-Phase:** Sub-Phase 0.2
- **Next Sub-Phase After Completion:** Sub-Phase 0.3 (Core Utility Layer & Type Foundations)
