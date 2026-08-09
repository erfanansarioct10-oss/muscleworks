# MUSCLEWORKS SUPPLEMENTS — CODING STANDARDS & ARCHITECTURAL GUIDELINES

**Document:** `coding-standards.md`  
**Purpose:** Canonical engineering rules, design system standards, component architecture patterns, TypeScript guidelines, mobile-first responsive architecture, security, and accessibility standards for all AI coding agents and human engineers.  
**Status:** Frozen & Approved for V1  
**Framework Baseline:** Next.js `16.3.0` (App Router) + React `19.2.8` + TypeScript `5.x` (Strict) + Tailwind CSS `v4.x`  
**Related Docs:** `project-overview.md`, `project-tech-stacks.md`, `project-architecture.md`, `data-models.md`, `file-map.md`, `progress-tracker.md`  

---

## 1. CORE ARCHITECTURAL PRINCIPLES

Every line of code written in the MuscleWorks Supplements codebase must strictly adhere to these five foundational pillars:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FIVE CORE ENGINEERING PILLARS                        │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│ 1. Mobile-First   │ Base styles apply │ Progressive enhancement with    │
│    Responsive     │ to mobile <640px  │ sm:, md:, lg:, xl: breakpoints  │
├───────────────────┼───────────────────┼─────────────────────────────────┤
│ 2. Server-First   │ React Server      │ 'use client' isolated strictly  │
│    Components     │ Components (RSC)  │ to interactive leaf nodes       │
├───────────────────┼───────────────────┼─────────────────────────────────┤
│ 3. Single Source  │ Zod schemas       │ TypeScript types inferred via   │
│    of Truth       │ validate data     │ z.infer<typeof Schema>          │
├───────────────────┼───────────────────┼─────────────────────────────────┤
│ 4. Defense in     │ Honeypot trap +   │ Standardized ActionResult       │
│    Depth          │ Upstash rate limit│ envelope on all Server Actions  │
├───────────────────┼───────────────────┼─────────────────────────────────┤
│ 5. Accessible &   │ WCAG 2.1 AA       │ Mobile Core Web Vitals:         │
│    Performant     │ WAI-ARIA standard │ LCP < 2.5s, INP < 200ms, CLS<0.1│
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

---

## 2. MOBILE-FIRST RESPONSIVE ARCHITECTURE

Nepal's fitness market is overwhelmingly mobile-driven (>85% of supplement browsing and WhatsApp inquiries occur on mobile smartphones over 4G/5G networks). All UI components, grid layouts, interactive funnels, and typography MUST be authored mobile-first.

### 2.1 Tailwind CSS v4 Breakpoint Hierarchy

Styling must ALWAYS start with base (unprefixed) classes for mobile viewports, layering responsive utility prefixes progressively:

| Breakpoint | Minimum Width | Target Device Class | Primary Layout Pattern |
|---|---|---|---|
| **Base** | `0px` (`<640px`) | Mobile smartphones (Portrait) | 1-column product cards, full-width buttons, collapsible accordions, slide-over navigation drawer, sticky bottom buy bar. |
| **`sm:`** | `640px` | Large phones (Landscape), Small tablets | 2-column product grids, compact 2-column forms. |
| **`md:`** | `768px` | Standard tablets, iPad portrait | 2-column or 3-column product grids, desktop top navigation bar appears, mobile sticky bar hides. |
| **`lg:`** | `1024px` | Laptops, Desktop displays | 3-column or 4-column product grids, persistent filter sidebars, expanded mega menus. |
| **`xl:`** | `1280px` | Large desktop monitors | 4-column product grids, max container constraints (`max-w-7xl`). |
| **`2xl:`** | `1536px` | Ultra-wide monitors | Centered container layouts with generous whitespace. |

### 2.2 Prohibited Responsive Anti-Patterns

- ❌ **NEVER author desktop styles first and override backwards** (e.g. do NOT use `max-sm:`, `max-md:`, `max-lg:` classes for core layouts; use mobile-first progressive overrides).
- ❌ **NEVER set fixed pixel widths on mobile containers** (e.g. `w-[360px]` or `w-[500px]` is prohibited; use `w-full max-w-sm` or `w-full max-w-md`).
- ❌ **NEVER hide critical conversion elements on mobile** (WhatsApp order buttons, direct phone call links, and product pricing must be immediately prominent on mobile screens).
- ❌ **NEVER use hover-dependent functionality** (all interactive states must work via touch taps and click events; hover styles should be enhancement-only via `hover:`).

### 2.3 Touch Target & Sizing Standards

All interactive elements must meet or exceed accessible mobile touch target guidelines:

```typescript
// ✅ Minimum Touch Target Standard
// Standard interactive elements (links, icon buttons, pagination): >= 44x44px
// High-priority conversion CTAs (WhatsApp Order, Call, Buy Now): >= 48x48px

// Example: Standard Mobile Icon Button
<button
  type="button"
  aria-label="Open navigation menu"
  className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors active:scale-95"
>
  <Menu className="h-5 w-5" />
</button>

// Example: High-Priority WhatsApp Mobile CTA
<a
  href={whatsappUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 font-semibold text-white shadow-lg transition-all active:scale-[0.98] sm:w-auto"
>
  <WhatsAppIcon className="h-5 w-5" />
  <span>Order on WhatsApp</span>
</a>
```

### 2.4 Mobile Navigation & Conversion Patterns

1. **Slide-Over Sheet Navigation:**
   - On viewports `< md`, the desktop navigation bar collapses into an accessible slide-over sheet drawer (`@radix-ui/react-dialog`).
   - Drawer must provide full-width, touch-padded links (`py-3.5 px-4`), direct phone dial button, store hours, and category shortcuts.
2. **Sticky Bottom Conversion Bar (`sticky-cta-bar.tsx`):**
   - On Product Detail Pages (`/products/[slug]`) for viewports `< md`, a sticky bottom action bar anchors to the bottom of the screen.
   - It displays the selected product variant price, stock status badge, and an instant "Order via WhatsApp" button.
   - Must account for mobile safe areas: `pb-[calc(1rem+env(safe-area-inset-bottom))]`.
3. **Mobile Filter Drawer:**
   - Catalog filtering on viewports `< lg` opens inside an interactive bottom/side sheet with full touch target pills for categories, brands, and price sliders, rather than taking up vertical screen real estate.
4. **Touch-Friendly Variant Selectors:**
   - Flavors, sizes, and serving options must render as large clickable pills (`min-h-[44px] px-4 py-2.5`) with clear visual active/inactive/out-of-stock states.

---

## 3. TYPESCRIPT & SCHEMA INFERENCE STANDARDS

Strict type safety is mandatory. The codebase eliminates all runtime type ambiguities and prevents drift between data definitions and UI components.

### 3.1 Strict Compiler Settings

The project enforces strict TypeScript settings in `tsconfig.json`:
- `"strict": true`
- `"noImplicitAny": true`
- `"strictNullChecks": true`
- `"noUnusedLocals": true`
- `"noUnusedParameters": true`
- `"exactOptionalPropertyTypes": false` (compatible with Zod optional inference)

### 3.2 Zero `any` Policy

- ❌ `any` is strictly prohibited in all application code, tests, and data loaders.
- ❌ Type assertions using `as any` or `as unknown as SomeType` are prohibited without an explicit, documented invariant guard.
- ✅ When handling unknown external data, use `unknown` and validate with Zod (`schema.parse()` or `schema.safeParse()`) or type predicates:

```typescript
// ❌ PROHIBITED
function handleData(payload: any) {
  return payload.product.name;
}

// ✅ MANDATORY STANDARD
import { ProductSchema, type Product } from '@/lib/schemas/product.schema';

function handleData(rawPayload: unknown): Product {
  const result = ProductSchema.safeParse(rawPayload);
  if (!result.success) {
    throw new Error(`Invalid product payload: ${result.error.message}`);
  }
  return result.data;
}
```

### 3.3 Single Source of Truth via `z.infer`

Never write manual TypeScript interfaces for entities that have Zod schemas. Always infer types directly:

```typescript
// src/lib/schemas/product.schema.ts
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  shortDescription: z.string(),
  fullDescription: z.string(),
  images: z.array(z.string().url()).min(1),
  variants: z.array(ProductVariantSchema).min(1),
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  tags: z.array(z.string()),
  nutritionHighlights: z.array(z.string()).optional(),
  authenticityGuaranteed: z.boolean().default(true),
});

// ✅ Inferred Canonical TypeScript Type
export type Product = z.infer<typeof ProductSchema>;
```

### 3.4 Naming Conventions

| Identifier Type | Case Convention | Examples |
|---|---|---|
| **Components & UI Primitives** | `PascalCase` | `ProductCard`, `WhatsAppButton`, `StickyCtaBar`, `SheetDrawer` |
| **TypeScript Types & Interfaces** | `PascalCase` | `Product`, `ProductVariant`, `InquiryPayload`, `ActionResult<T>` |
| **Zod Schemas** | `PascalCase` with `Schema` suffix | `ProductSchema`, `InquiryFormSchema`, `StoreInfoSchema` |
| **Functions, Hooks & Methods** | `camelCase` | `formatNepaliRupees`, `submitInquiryAction`, `useVariantSelector` |
| **Variables & Object Keys** | `camelCase` | `selectedVariant`, `whatsappUrl`, `filterParams` |
| **Constants & Configs** | `UPPER_SNAKE_CASE` | `STORE_PHONE_NUMBER`, `DEFAULT_PAGE_SIZE`, `NEPAL_DELIVERY_ZONES` |
| **Files & Directories** | `kebab-case` | `product-card.tsx`, `whatsapp-builder.ts`, `inquiry-actions.ts` |

### 3.5 Import Sorting & Path Aliasing

All internal files must use the `@/*` path alias. Imports must be organized in strict grouped order with a single blank line separating groups:

```typescript
// 1. React & Next.js built-in modules
import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

// 2. Third-party packages & UI primitives
import { LucideIcon, ShoppingBag, ShieldCheck, PhoneCall } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { toast } from 'sonner';

// 3. Internal schemas & types
import { Product, ProductVariant } from '@/lib/schemas/product.schema';
import { ActionResult } from '@/types/actions';

// 4. Internal utilities, helpers & data accessors
import { cn } from '@/lib/utils';
import { formatNepaliRupees } from '@/lib/formatters';
import { getProductBySlug } from '@/lib/data/products';
import { generateWhatsAppOrderUrl } from '@/lib/whatsapp';

// 5. Internal components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductVariantPicker } from '@/components/catalog/product-variant-picker';
```

---

## 4. NEXT.JS 16 & REACT 19 COMPONENT ARCHITECTURE

### 4.1 Server Components (RSC) by Default

- Every page (`page.tsx`), layout (`layout.tsx`), and data-fetching component is an **async React Server Component**.
- Static data loading, JSON reading, MDX compilation, metadata generation, and structured data injection happen exclusively on the server.
- Zero client JavaScript bundle is shipped for static headers, footers, educational articles, product grids, and store info.

```typescript
// src/app/products/[slug]/page.tsx
// ✅ Async Server Component with Next.js 16 Promise Params
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProductSlugs } from '@/lib/data/products';
import { ProductDetailView } from '@/components/catalog/product-detail-view';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params; // Next.js 16 requires awaiting params
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}
```

### 4.2 Isolated Leaf `'use client'` Directives

- Push `'use client'` exclusively to the outermost interactive leaf nodes in the component tree.
- Never place `'use client'` at the top of a page route or layout file.
- Keep Client Component bundles minimal: only import the state, event listeners, and hooks necessary for that specific widget.

```
Component Tree Architecture:
┌─────────────────────────────────────────────────────────┐
│ Page (Server Component)                                 │
│  ├── Header (Server Component)                          │
│  │    └── MobileMenuDrawer ('use client' Leaf)          │
│  ├── ProductGrid (Server Component)                     │
│  │    ├── ProductCard (Server Component)                │
│  │    └── FilterBar ('use client' Leaf)                 │
│  └── Footer (Server Component)                          │
└─────────────────────────────────────────────────────────┘
```

### 4.3 Next.js 16 Conventions & Async Parameters

Next.js 16 introduces breaking API changes from earlier versions:
- `params` and `searchParams` passed to pages and layouts are **Promises** and must be `await`ed before accessing properties.
- Server Actions must declare `'use server'` at the file header or top of the exported function.
- Route Handlers receive `request: Request` and `context: { params: Promise<Record<string, string>> }`.

### 4.4 Image Optimization Standards (`next/image`)

All image assets must use Next.js `<Image />` with strict configuration:

```typescript
// ✅ Standard Responsive Product Image
<div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
  <Image
    src={product.images[0]}
    alt={`${product.name} supplement container`}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    priority={isAboveTheFoldHero} // Only true for hero LCP image
    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
  />
</div>
```

**Image Optimization Rules:**
1. **Mandatory `alt` Text:** Must be descriptive and context-rich (never use generic words like "image", "photo", "pic").
2. **Mandatory `sizes` Attribute:** When using `fill`, always provide accurate viewport `sizes` so Next.js serves correctly scaled WebP/AVIF images to mobile devices.
3. **`priority` Flag:** Apply `priority` ONLY to the primary hero image or the first LCP image above the fold. Never apply `priority` to product grid cards below the fold.
4. **Zero Layout Shift (CLS):** Always enforce aspect ratio containers (`aspect-square`, `aspect-[4/3]`, or explicit `width` & `height`).

### 4.5 Font Loading & Zero Layout Shift

Fonts are preloaded and configured using `next/font/google` in `src/app/layout.tsx`:

```typescript
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const headingFont = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['600', '700', '800', '900'],
});
```

---

## 5. STYLING, CSS TOKENS & DESIGN SYSTEM PATTERNS

### 5.1 Athletic Brand Identity & Color Tokens

MuscleWorks Supplements utilizes a high-energy, athletic design system with a dark-mode-first aesthetic (commanding charcoal/slate foundations accented by electric gym crimson, performance gold, and verified emerald).

Defined in `src/styles/globals.css` using Tailwind CSS v4 `@theme`:

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-sans), system-ui, -apple-system, sans-serif;
  --font-heading: var(--font-heading), system-ui, -apple-system, sans-serif;

  /* Athletic Color Palette Tokens */
  --color-background: #09090b;       /* Zinc 950 Deep Obsidian */
  --color-foreground: #f4f4f5;       /* Zinc 100 Crisp White */
  
  --color-card: #121215;             /* Elevated Slate Card Surface */
  --color-card-foreground: #f4f4f5;
  
  --color-primary: #dc2626;          /* Red 600 Electric Gym Crimson */
  --color-primary-hover: #b91c1c;    /* Red 700 Crimson Hover */
  --color-primary-foreground: #ffffff;
  
  --color-secondary: #27272a;        /* Zinc 800 Charcoal Secondary */
  --color-secondary-foreground: #fafafa;
  
  --color-accent: #f59e0b;           /* Amber 500 Performance Gold */
  --color-accent-foreground: #09090b;
  
  --color-success: #10b981;          /* Emerald 500 WhatsApp / Verified */
  --color-success-foreground: #ffffff;
  
  --color-muted: #18181b;            /* Zinc 900 Muted Background */
  --color-muted-foreground: #a1a1aa; /* Zinc 400 Muted Text */
  
  --color-border: #27272a;           /* Zinc 800 Subtle Divider */
  --color-ring: #dc2626;             /* Primary Focus Ring */
  
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
}
```

### 5.2 Class Composition Utility (`cn`)

All dynamic and conditional class composition MUST pass through the canonical `cn()` utility (`src/lib/utils.ts`):

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### 5.3 Type-Safe Component Variants via CVA

All reusable UI primitives (Buttons, Badges, Inputs, Cards) must define their variants with `class-variance-authority`:

```typescript
// src/components/ui/button.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-md hover:bg-primary-hover hover:shadow-lg',
        whatsapp: 'bg-emerald-600 text-white shadow-md hover:bg-emerald-500 hover:shadow-lg',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'border border-border bg-transparent text-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-muted hover:text-foreground',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 rounded-lg px-3.5 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base',
        xl: 'h-14 rounded-2xl px-8 text-lg font-bold',
        icon: 'h-11 w-11 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
```

---

## 6. SERVER ACTIONS, DEFENSIVE SECURITY & ERROR HANDLING

### 6.1 Standardized Action Result Envelope

All Next.js Server Actions must return a typed, predictable result object. Never throw unhandled exceptions to the client:

```typescript
// src/types/actions.ts
export type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};
```

### 6.2 Server Action Defense-in-Depth Pipeline

Every mutating Server Action (such as inquiry submission or contact request) must execute this sequential defense pipeline:

```
┌────────────────────────────────────────────────────────┐
│             SERVER ACTION DEFENSE PIPELINE             │
├────────────────────────────────────────────────────────┤
│ 1. Rate Limiting Check (Upstash Redis / In-Memory)     │
│    └── Rejects IP if >5 requests / hour                │
├────────────────────────────────────────────────────────┤
│ 2. Anti-Bot Honeypot & Timestamp Check                 │
│    ├── Hidden field (_hp_company) must be EMPTY        │
│    └── Form completion time must be >= 2.0 seconds     │
├────────────────────────────────────────────────────────┤
│ 3. Zod Input Schema Validation                         │
│    └── Returns fieldErrors map on invalid fields       │
├────────────────────────────────────────────────────────┤
│ 4. Business Logic & External Dispatch                  │
│    ├── Resend Email notification                       │
│    └── Telegram Admin alert dispatch                   │
├────────────────────────────────────────────────────────┤
│ 5. Graceful Sanitized Result Envelope                  │
│    └── Returns { success: true, data: { id } }         │
└────────────────────────────────────────────────────────┘
```

### 6.3 Canonical Server Action Implementation

```typescript
// src/app/actions/inquiry-actions.ts
'use server';

import { headers } from 'next/headers';
import { InquiryFormSchema, type InquiryFormValues } from '@/lib/schemas/inquiry.schema';
import { checkRateLimit } from '@/lib/security/rate-limiter';
import { verifyHoneypot } from '@/lib/security/honeypot';
import { sendCustomerInquiryEmail, sendAdminInquiryAlert } from '@/lib/email/resend-service';
import { sendTelegramAlert } from '@/lib/telegram/bot';
import { ActionResult } from '@/types/actions';

export async function submitInquiryAction(
  formData: unknown
): Promise<ActionResult<{ inquiryId: string }>> {
  try {
    // 1. IP-Based Rate Limiting
    const headerList = await headers();
    const clientIp = headerList.get('x-forwarded-for') || '127.0.0.1';
    const rateLimitResult = await checkRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: 'Too many inquiries submitted. Please wait a while before trying again.',
      };
    }

    // 2. Anti-Bot Honeypot Verification
    const honeypotCheck = verifyHoneypot(formData);
    if (!honeypotCheck.valid) {
      console.warn(`[SECURITY:HONEYPOT_BLOCKED] Bot detected from IP: ${clientIp}`);
      // Silent success return to confuse bots without dispatching notifications
      return { success: true, data: { inquiryId: 'bot-filtered' } };
    }

    // 3. Zod Schema Validation
    const validationResult = InquiryFormSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return {
        success: false,
        error: 'Please correct the highlighted errors in the form.',
        fieldErrors,
      };
    }

    const payload = validationResult.data;
    const inquiryId = `INQ-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // 4. Dispatch Email & Telegram Notifications concurrently
    await Promise.allSettled([
      sendCustomerInquiryEmail({ ...payload, inquiryId }),
      sendAdminInquiryAlert({ ...payload, inquiryId }),
      sendTelegramAlert({ ...payload, inquiryId }),
    ]);

    console.info(`[INQUIRY:SUCCESS] Created inquiry ${inquiryId} for ${payload.customerName}`);

    return {
      success: true,
      data: { inquiryId },
    };
  } catch (err: unknown) {
    console.error('[INQUIRY:ERROR]', err);
    return {
      success: false,
      error: 'An unexpected server error occurred. Please call or WhatsApp us directly.',
    };
  }
}
```

### 6.4 Error Boundaries & Not-Found Standards

- **`src/app/not-found.tsx`**: Renders an athletic branded 404 page with direct links to `/catalog`, `/categories`, and home.
- **`src/app/error.tsx`**: Client Component error boundary catching unhandled rendering crashes with a "Try Again" recovery trigger.
- **`src/app/global-error.tsx`**: Minimal HTML fallback for root layout failures.

---

## 7. ACCESSIBILITY (A11Y) & SEMANTIC HTML STANDARDS

MuscleWorks is committed to WCAG 2.1 Level AA accessibility across all pages and interactive components.

### 7.1 Semantic HTML Structure

- Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>` appropriately.
- Strictly adhere to a single `<h1>` per page.
- Maintain a strict heading hierarchy (`h1` → `h2` → `h3` → `h4`); never skip heading levels for visual styling (use Tailwind classes to adjust text size).

### 7.2 Accessible Names & Icon Buttons

Every interactive icon or button without visible text MUST include an accessible label:

```typescript
// ❌ PROHIBITED
<button onClick={toggleMenu}><Menu /></button>

// ✅ MANDATORY STANDARD
<button
  type="button"
  aria-label="Open mobile navigation menu"
  aria-expanded={isOpen}
  aria-controls="mobile-drawer"
  onClick={toggleMenu}
>
  <Menu className="h-5 w-5" aria-hidden="true" />
</button>
```

### 7.3 Focus Indicators & Keyboard Navigation

- All interactive controls must display clear, high-contrast focus rings on keyboard navigation (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
- Never set `outline: none` without providing an equivalent `focus-visible` replacement.
- Modals, drawers, and dialogs must trap focus, close on `Escape`, and return focus to the triggering element upon dismissal (handled natively via `@radix-ui/react-dialog`).

---

## 8. PERFORMANCE BUDGETS & CORE WEB VITALS

The MuscleWorks website must load and become interactive instantly, even on mobile devices over standard 4G cellular networks in Nepal.

### 8.1 Performance Targets

| Metric | Target Budget | Optimization Strategy |
|---|---|---|
| **LCP (Largest Contentful Paint)** | `< 2.0s` (4G Mobile) | Pre-rendered static HTML (SSG), `<Image priority>` on hero image, responsive `sizes`, WebP/AVIF format. |
| **INP (Interaction to Next Paint)** | `< 150ms` | Minimal client JS, uncontrolled forms with React Hook Form, zero heavy animation loops on main thread. |
| **CLS (Cumulative Layout Shift)** | `< 0.05` (Target 0.0) | `next/font/google` with `display: swap`, explicit aspect-ratio image containers, reserved skeleton placeholders. |
| **TTFB (Time to First Byte)** | `< 100ms` | Static Site Generation (SSG) cached at Vercel Edge CDN nodes. |
| **Total Client JS Bundle** | `< 90kB` (Initial load) | Server Components by default, dynamic import (`next/dynamic`) for non-critical modals and heavy components. |

### 8.2 Prohibited Performance Anti-Patterns

- ❌ **No heavy runtime styling frameworks** (Emotion, styled-components).
- ❌ **No heavy date/utility libraries** (no `moment.js` or `lodash`; use native `Intl` and lightweight helpers).
- ❌ **No unoptimized third-party scripts** (Google Analytics must load asynchronously via `@next/third-parties/google`).

---

## 9. CODE REVIEW CHECKLIST FOR AI AGENTS

Before completing any task or writing any component, verify against this 10-point checklist:

- [ ] **1. Mobile-First Styling:** Are base Tailwind styles written for mobile (<640px) with progressive `sm:`, `md:`, `lg:` enhancements?
- [ ] **2. Touch Targets:** Are all mobile buttons and interactive items sized ≥44x44px (≥48x48px for WhatsApp/Phone CTAs)?
- [ ] **3. Server Component Default:** Is the component a Server Component unless it strictly requires client hooks or browser events?
- [ ] **4. Leaf `'use client'`:** If `'use client'` is used, is it confined to the smallest possible leaf component?
- [ ] **5. Next.js 16 Async Params:** Are `params` and `searchParams` properly `await`ed in pages/layouts?
- [ ] **6. Strict Types:** Are all types derived from Zod schemas via `z.infer` with zero `any`?
- [ ] **7. Image Optimization:** Does every `<Image />` have descriptive `alt`, aspect-ratio container, and accurate `sizes`?
- [ ] **8. Server Action Security:** Does the Server Action implement Rate Limiting, Honeypot check, Zod parsing, and return `ActionResult`?
- [ ] **9. Accessibility:** Do icon buttons have `aria-label` and `aria-hidden="true"` on icons? Is heading hierarchy strict?
- [ ] **10. Zero Layout Shift:** Are fonts loaded via `next/font/google` and skeletons used for streaming Suspense boundaries?
