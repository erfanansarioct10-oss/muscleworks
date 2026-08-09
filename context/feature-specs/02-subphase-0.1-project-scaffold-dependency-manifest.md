# Feature Spec 02: Sub-Phase 0.1 — Project Scaffold & Dependency Manifest

> **Spec ID:** `02-subphase-0.1-project-scaffold-dependency-manifest`  
> **Target Sub-Phase / Branch:** `Phase 0` / `Sub-Phase 0.1`  
> **Status:** Approved  
> **Created Date:** 2026-08-09  
> **Author:** AI Coding Agent (Antigravity IDE)

---

## Executive Summary

This feature specification defines the technical execution plan for **Sub-Phase 0.1: Project Scaffold & Dependency Manifest** of the MUSCLEWORKS SUPPLEMENTS e-commerce web platform.

In this sub-phase, we transition the repository from a bare Next.js starter into a fully configured, type-safe development environment ready for component and data architecture. We lock all canonical dependencies specified in [`context/project-tech-stacks.md`](../project-tech-stacks.md), configure strict TypeScript path aliases mapping to the `src/` directory convention, configure `next.config.ts` with remote image patterns and React optimizations, and establish robust `.gitignore` rules.

---

## 1. What We Are Going to Do

The following table itemizes all files to be modified in Sub-Phase 0.1:

| # | Target File | Action | Responsibility Summary |
|---|---|---|---|
| 1 | `package.json` | **[MODIFY]** | Add and lock all canonical dependencies (Radix UI, Lucide React, Zod, Sonner, React Hook Form, Upstash, Resend, etc.) with exact versions. |
| 2 | `tsconfig.json` | **[MODIFY]** | Configure strict path aliases (`@/*` -> `./src/*`, `@/data/*` -> `./data/*`, `@/content/*` -> `./content/*`, `@/public/*` -> `./public/*`) and strict compiler flags. |
| 3 | `next.config.ts` | **[MODIFY]** | Configure remote image domains (`images.unsplash.com`, `res.cloudinary.com`), SVG handling, and Next.js 16 compiler options. |
| 4 | `.gitignore` | **[MODIFY]** | Ensure all build caches, environment secrets (`.env*.local`), temporary artifacts, and OS files are ignored. |

---

## 2. Why We Are Doing This

1. **Framework & Package Invariant Alignment:** Per [`context/project-tech-stacks.md`](../project-tech-stacks.md), our stack is locked to Next.js 16.3.0, React 19.2.8, Tailwind CSS v4, Radix UI, and Zod. Installing them upfront in a single batch guarantees deterministic peer dependency resolution and eliminates runtime version mismatches.
2. **Strict Directory Architecture (`src/`):** Per [`context/file-map.md`](../file-map.md), all application source code must reside inside `src/`. Standardizing path aliases in `tsconfig.json` enables clean, modular imports across all subsequent sub-phases.
3. **Static Image & CDN Optimization:** Configuring remote image patterns in `next.config.ts` allows `next/image` to safely optimize external product images (e.g. Unsplash placeholders or Cloudinary CDN assets) with zero layout shift (CLS).
4. **Security & Credential Protection:** Hardened `.gitignore` guarantees server-side environment secrets (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, Upstash keys) are never inadvertently committed to source control.

---

## 3. How We Are Going to Implement It

### Step 1: Package Manifest Update (`package.json`)
Add locked production dependencies:
- **UI & Styling:** `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `sonner`, `@radix-ui/react-dialog`, `@radix-ui/react-accordion`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-select`, `@radix-ui/react-slot`
- **Data & Validation:** `zod`
- **Search & URL State:** `nuqs`, `fuse.js`
- **Forms & Validation:** `react-hook-form`, `@hookform/resolvers`
- **Rate Limiting & Security:** `@upstash/ratelimit`, `@upstash/redis`, `validator`
- **Integrations & SEO:** `resend`, `@react-email/components`, `schema-dts`, `@next/third-parties`, `@vercel/analytics`, `@vercel/speed-insights`

Add dev dependencies:
- `@types/validator`

Run `npm install` to generate the deterministic lockfile.

### Step 2: Strict Path Aliases & TypeScript Config (`tsconfig.json`)
Configure `compilerOptions.paths`:
```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@/data/*": ["./data/*"],
    "@/content/*": ["./content/*"],
    "@/public/*": ["./public/*"]
  }
}
```
Ensure `"strict": true`, `"resolveJsonModule": true`, `"moduleResolution": "bundler"`.

### Step 3: Next.js Configuration (`next.config.ts`)
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
```

### Step 4: Environment & Build Ignores (`.gitignore`)
Ensure coverage for:
- `.env`, `.env*.local`, `.env.production`
- `.next/`, `out/`, `build/`
- `.turbo/`, `node_modules/`
- `.DS_Store`, `Thumbs.db`

---

## 4. When We Are Going to Do It

```text
Step 1: Update package.json with locked dependencies & devDependencies
    │
    ▼
Step 2: Run npm install to generate deterministic package-lock.json
    │
    ▼
Step 3: Update tsconfig.json with path aliases & strict settings
    │
    ▼
Step 4: Update next.config.ts with image patterns & compiler settings
    │
    ▼
Step 5: Update .gitignore with hardened ignore rules
    │
    ▼
Step 6: Verification Gate (npm install & npx tsc --noEmit)
    │
    ▼
Step 7: Post-flight status update in progress-tracker.md & feature-roadmap.md
```

---

## 5. Required Data & Data Sources

| Requirement | Source Document | Purpose |
|---|---|---|
| Dependency Version Manifest | [`context/project-tech-stacks.md`](../project-tech-stacks.md) | Locked package names and major/minor version ranges |
| Directory Path Aliases | [`context/file-map.md`](../file-map.md) | Standardized `@/*`, `@/data/*`, `@/content/*` conventions |
| Image CDNs & Hostnames | [`context/project-architecture.md`](../project-architecture.md) | Allowed image hostnames for Next.js image optimization |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **React 19 Peer Dependency Warnings** | Certain UI packages still specifying `react: "^18"` peer ranges. | Install compatible modern versions; use standard `npm install` without legacy peer flags whenever possible. |
| **Path Alias Collision** | `@/*` conflicting with root files before moving to `src/`. | Configure all 4 specific aliases (`@/*`, `@/data/*`, `@/content/*`, `@/public/*`) explicitly in `tsconfig.json`. |
| **Accidental Secret Check-in** | `.env.local` not matched by loose gitignore rules. | Add explicit wildcards (`.env*.local`, `.env`) to `.gitignore`. |

---

## 7. Verification & Definition of Done

1. `npm install` executes cleanly with zero unresolvable conflicts.
2. `npx tsc --noEmit` runs without configuration or path alias errors.
3. `package.json` contains all production and dev dependencies declared in [`context/project-tech-stacks.md`](../project-tech-stacks.md).
4. `tsconfig.json` path aliases match [`context/file-map.md`](../file-map.md).
5. `next.config.ts` contains valid `remotePatterns` and `reactStrictMode`.
6. Progress trackers in [`context/progress-tracker.md`](../progress-tracker.md) and [`context/feature-roadmap.md`](../feature-roadmap.md) are updated.
