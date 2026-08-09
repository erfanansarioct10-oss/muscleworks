# Feature Spec 13: Minimal Premium Modern Luxury Theme Migration

> **Spec ID:** `13-minimal-premium-luxury-theme`  
> **Target Sub-Phase / Branch:** `Phase 1` Minimal Premium Luxury Theme Standard  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** AI Coding Agent (Antigravity IDE)

---

## Executive Summary

Based on direct user direction ("no funky color themes like green/blue; professional minimal premium modern luxury theme"), this specification establishes the **Minimal Premium Modern Luxury Design System** for MUSCLEWORKS SUPPLEMENTS.

All neon green, bright blue, and loud red colors are replaced with an ultra-sleek, minimal palette:
- **Jet Black (`#0B0B0B`):** Deep charcoal primary tone for high-impact typography, headers, and sleek conversion buttons.
- **Pure White (`#FFFFFF`):** Clean, crisp surfaces for elevated cards and canvas backgrounds.
- **Metallic Luxury Gold (`#D4AF37`):** Refined metallic gold accent for verified authenticity badges, star ratings, subtle hover glows, and focus rings.
- **Silver Gray (`#F5F5F5`):** Subtle silver fill for secondary controls, inputs, and muted fills.
- **Neutral Gray (`#2C2C2C` / `#666666`):** Balanced neutral tone for secondary text, metadata, and crisp borders (`#E5E5E5`).

---

## 1. What We Are Going to Do

| # | Target File | Action | Summary of Remediation |
|:---:|---|:---:|---|
| 1 | `src/app/globals.css` | **[MODIFY]** | Replace design tokens with Jet Black (`#0B0B0B`), Pure White (`#FFFFFF`), Metallic Gold (`#D4AF37`), Silver Gray (`#F5F5F5`), and Neutral Gray (`#2C2C2C`/`#E5E5E5`). |
| 2 | `src/components/ui/button.tsx` | **[MODIFY]** | Refactor `whatsapp` and `gold` variants to minimal luxury black/gold styling (eliminating neon green). |
| 3 | `src/components/ui/badge.tsx` | **[MODIFY]** | Refactor badge variants (`authentic`, `discount`, `stock`, `category`) to minimal black/gold/silver palette. |
| 4 | `src/app/page.tsx` | **[MODIFY]** | Update hero theme pill to "Minimal Premium Modern Luxury". |
| 5 | `AGENTS.md` | **[MODIFY]** | Update operating directive to enforce Minimal Premium Modern Luxury theme. |
| 6 | `context/coding-standards.md` | **[MODIFY]** | Update Section 5.1 design system standards with Minimal Premium color tokens. |
| 7 | `context/project-tech-stacks.md` | **[MODIFY]** | Update design stack definition to Minimal Premium Luxury Palette. |
| 8 | `context/feature-roadmap.md` | **[MODIFY]** | Update Sub-Phase 0.2 theme token descriptions. |
| 9 | `context/feature-specs/03-subphase-0.2-styling-system-tailwind-theme-engine.md` | **[MODIFY]** | Update CSS variables in Spec 03 to Minimal Premium palette. |
| 10 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 13 in Specification Registry Index. |
| 11 | `context/progress-tracker.md` | **[MODIFY]** | Log Spec 13 in Session Change Log. |

---

## 2. Why We Are Doing This

1. **Brand Luxury Positioning:** The fitness & sports nutrition market in Kathmandu values authentic premium quality. A minimal monochrome design anchored with Jet Black, Pure White, and Metallic Gold conveys maximum authority, authenticity, and luxury.
2. **Elimination of Distracting Colors:** Bright neon greens and blues cheapen the brand visual identity. Replacing them with sleek Jet Black and Metallic Gold accents creates a sophisticated aesthetic.
3. **WCAG AA Accessibility:** High contrast is preserved across all elements:
   - Jet Black text (`#0B0B0B`) on Pure White (`#FFFFFF`) > 18:1 contrast.
   - White text (`#FFFFFF`) on Jet Black (`#0B0B0B`) > 18:1 contrast.
   - Metallic Gold (`#D4AF37`) badge text on dark/light surfaces strictly satisfies contrast bounds.

---

## 3. How We Are Going to Implement It

### Step 1: Tailwind v4 Theme Directives (`src/app/globals.css`)
```css
@theme {
  --color-background: #fcfcfc;       /* Pure Off-White Canvas */
  --color-foreground: #0b0b0b;       /* Jet Black Premium Text */
  
  --color-card: #ffffff;             /* Pure White Surface */
  --color-card-foreground: #0b0b0b;  /* Card Text */
  
  --color-primary: #0b0b0b;          /* Jet Black Primary Action */
  --color-primary-hover: #2c2c2c;    /* Neutral Gray Hover */
  --color-primary-foreground: #ffffff;
  
  --color-secondary: #f5f5f5;        /* Silver Gray Secondary Fill */
  --color-secondary-foreground: #0b0b0b;
  
  --color-accent: #d4af37;           /* Metallic Luxury Gold */
  --color-accent-foreground: #0b0b0b;
  
  --color-success: #0b0b0b;          /* Jet Black Conversion Button */
  --color-success-foreground: #ffffff;
  
  --color-muted: #f5f5f5;            /* Silver Gray Muted Fill */
  --color-muted-foreground: #666666; /* Neutral Gray Muted Text */
  
  --color-border: #e5e5e5;           /* Crisp Silver Divider */
  --color-ring: #d4af37;             /* Metallic Luxury Gold Focus Ring */
}
```

### Step 2: Sleek Component Refactoring (`button.tsx` & `badge.tsx`)
- `whatsapp` variant: `min-h-12 min-w-12 bg-primary text-primary-foreground border border-accent/40 shadow-sm hover:bg-primary-hover hover:border-accent`
- `authentic` badge: `bg-amber-500/10 text-amber-700 border border-amber-500/30`

---

## 4. Verification & Definition of Done

1. `npx tsc --noEmit` compiles cleanly with **0 errors**.
2. `npm run lint` executes cleanly with **0 warnings/errors**.
3. `npm run build` succeeds with full static pre-rendering (SSG).
4. All UI surfaces reflect the **Minimal Premium Modern Luxury** color palette.
