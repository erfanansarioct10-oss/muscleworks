# MUSCLEWORKS SUPPLEMENTS — PROJECT TECH STACKS

**Document:** `project-tech-stacks.md`  
**Purpose:** Canonical technical stack specification for all AI coding agents  
**Status:** Frozen & Approved for V1  
**Hosting Target:** Vercel  
**Related Docs:** `project-overview.md`, `project-architecture.md`, `data-models.md`, `coding-standards.md`  

---

## 1. CORE RUNTIME & FRAMEWORK

| Technology | Version | Purpose | Rationale |
|---|---|---|---|
| **Next.js** | `16.3.0` | Full-stack web framework (App Router) | High-performance Server Components, built-in SEO metadata API, dynamic OpenGraph/Sitemap generation, optimal Core Web Vitals on Vercel. |
| **React** | `19.2.8` | UI Library | Native support for Server Components, Actions, useOptimistic, and Suspense streaming. |
| **TypeScript** | `^5.x` (Strict Mode) | Language | End-to-end type safety across data schemas, components, Server Actions, and external API integrations. |
| **Node.js** | `>=20.x LTS` | Runtime Environment | Current Active LTS for Vercel builds and serverless execution. |

---

## 2. STYLING & DESIGN SYSTEM

| Technology | Package | Purpose | Notes |
|---|---|---|---|
| **Tailwind CSS** | `tailwindcss: ^4.x` | Utility-first CSS framework | Configured with `@tailwindcss/postcss` for lightning-fast compilation and CSS variable theming. |
| **PostCSS** | `@tailwindcss/postcss: ^4.x` | CSS processor | Handles modern CSS processing pipeline. |
| **Class Utilities** | `clsx: ^2.x`<br>`tailwind-merge: ^3.x` | Conditional class composition | Ensures conflict-free merging of dynamic utility classes in reusable components. |
| **Variant Authority** | `class-variance-authority: ^0.7.x` | Type-safe component variants | Standardized styling for buttons, badges, inputs, and cards. |
| **Typography & Fonts** | `next/font/google` | Font optimization | Zero layout shift (CLS), preloaded Google Fonts: **Plus Jakarta Sans** / **Inter** for UI + **Outfit** / **Barlow** for bold athletic headings. |

---

## 3. UI PRIMITIVES & ICONOGRAPHY

| Category | Package / Tool | Implementation Standard |
|---|---|---|
| **Icons** | `lucide-react: ^1.x` | Tree-shakeable SVG icons (gym, nutrition, contact, social, UI arrows, checks). Use explicit size/stroke props. |
| **Accessible Primitives** | `@radix-ui/react-*` (e.g. `dialog`, `accordion`, `dropdown-menu`, `select`, `slot`) | Headless, fully accessible (WAI-ARIA compliant) interactive UI primitives styled with Tailwind CSS (Shadcn UI architecture). |
| **Toast Notifications** | `sonner: ^2.x` | Lightweight, accessible, and performant toast notifications for form feedback and action confirmations. |

---

## 4. DATA LAYER & CONTENT MANAGEMENT (V1)

| Layer | Implementation | Details |
|---|---|---|
| **Product & Catalog Data** | Local JSON / TypeScript static datasets in `data/` (`products.json`, `categories.json`, `brands.json`, `store-info.json`) | Zero-latency, zero-cost, version-controlled in Git. Validated at compile time and runtime using Zod. Agency updates catalog via Git commits/pull requests. |
| **Schema Validation** | `zod: ^3.24.x` | Single source of truth for runtime validation of products, category taxonomies, brand schemas, and inquiry payloads. |
| **Educational & Article Content** | Markdown / MDX (`@next/mdx` or `gray-matter` + custom React components) | Static, SEO-optimized buying guides, supplement FAQs, and educational articles without heavy external CMS overhead. |

---

## 5. SEARCH, FILTERING & CATALOG STATE

| Feature | Technology | Rationale |
|---|---|---|
| **URL State Synchronization** | `nuqs: ^2.x` / `next/navigation` | Bidirectional synchronization of search terms, category filters, brand filters, and sorting parameters with URL query strings (`?category=protein&brand=optimum-nutrition`). Ensures all catalog views are shareable, bookmarkable, and SEO-crawlable. |
| **Fuzzy Search Engine** | `fuse.js: ^7.x` | Ultra-fast client/server fuzzy search index across product names, brands, categories, and tags with zero backend database latency. |

---

## 6. FORMS, SERVER ACTIONS & SECURITY

| Component | Technology | Rationale & Configuration |
|---|---|---|
| **Form Management** | `react-hook-form: ^7.x` | Performant, uncontrolled form state with minimal re-renders. |
| **Client/Server Form Validation** | `@hookform/resolvers/zod` + `zod` | Identical Zod schema applied on both client form submission and Server Action execution. |
| **Server Actions** | Next.js Native Server Actions | Direct server execution for inquiry submissions, rate limiting, and notification dispatch without public REST endpoint exposure. |
| **Spam Protection (Honeypot)** | Custom Honeypot Field + Timestamp Validation | Hidden anti-bot trap fields and minimum submission time checks to stop automated bot submissions without annoying user CAPTCHAs. |
| **Rate Limiting** | `@upstash/ratelimit: ^2.x` + `@upstash/redis: ^1.x` | IP-based sliding window rate limiter (e.g., max 5 inquiries per hour per IP) to prevent spam attacks and email flood. Graceful in-memory fallback if Redis credentials are not configured. |
| **Input Sanitization** | `validator: ^13.x` / custom sanitizers | Strict sanitization of all inquiry inputs before email and Telegram dispatch to prevent HTML/XSS injection. |

---

## 7. NOTIFICATION & EXTERNAL INTEGRATIONS

| Integration | Technology | Architecture & Workflow |
|---|---|---|
| **WhatsApp Direct Ordering** | Native dynamic URL builder (`wa.me`) | Client-side URL generator formatting product details, variant, flavor, size, price, and pre-written order message into a direct WhatsApp chat link. |
| **Email Service** | `resend: ^4.x` | Transactional email provider sending HTML confirmation emails to customers and instant alert emails to store admins. |
| **Email Templating** | `@react-email/components: ^0.0.x` | React-based email templates ensuring consistent branding, responsive layout, and type safety across all email clients. |
| **Admin Telegram Alerts** | Native `fetch` to Telegram Bot API | Zero-dependency HTTP calls to `https://api.telegram.org/bot<TOKEN>/sendMessage` with MarkdownV2 formatting for instant push notifications to store managers. |

---

## 8. TECHNICAL SEO, STRUCTURED DATA & ANALYTICS

| Domain | Technology / Tool | Specification |
|---|---|---|
| **Metadata API** | Next.js Native `generateMetadata` | Dynamic titles, meta descriptions, canonical tags, OpenGraph images, and Twitter cards for every product, category, and brand page. |
| **Structured Data (JSON-LD)** | `schema-dts: ^1.x` | Type-safe JSON-LD schemas embedded directly into Server Components: `Product`, `Offer`, `Organization`, `LocalBusiness`, `FAQPage`, `BreadcrumbList`. |
| **Sitemap & Robots** | `app/sitemap.ts` + `app/robots.ts` | Dynamic XML sitemap automatically indexing all active products, categories, brands, static pages, and educational guides. |
| **Analytics & Core Web Vitals** | `@next/third-parties/google` (GA4) + `@vercel/analytics` + `@vercel/speed-insights` | Asynchronous Google Analytics 4 integration with zero CLS impact. Custom event tracking for: `whatsapp_order_click`, `phone_call_click`, `inquiry_submit`, and `product_filter_apply`. |

---

## 9. CODE QUALITY, TESTING & BUILD TOOLS

| Tool | Configuration / Version | Purpose |
|---|---|---|
| **Linter** | `eslint: ^9.x` + `eslint-config-next: 16.3.0` | Strict code hygiene, accessibility warnings, and Next.js best practice enforcement. |
| **Type Checker** | `tsc --noEmit` | Strict type validation verifying all interfaces, props, and Zod inference. |
| **Package Manager** | `npm` (with locked `package-lock.json`) | Deterministic dependency management. |

---

## 10. HOSTING, INFRASTRUCTURE & ENVIRONMENT

- **Platform:** Vercel Serverless / Edge Network
- **Environment Variables Required:**
  ```env
  # App
  NEXT_PUBLIC_SITE_URL=https://muscleworksnepal.com
  NEXT_PUBLIC_WHATSAPP_NUMBER=97798XXXXXXXX
  NEXT_PUBLIC_PHONE_NUMBER=+977-98XXXXXXXX
  NEXT_PUBLIC_STORE_EMAIL=info@muscleworksnepal.com

  # Resend (Email)
  RESEND_API_KEY=re_...
  RESEND_FROM_EMAIL=inquiries@muscleworksnepal.com
  ADMIN_NOTIFICATION_EMAIL=orders@muscleworksnepal.com

  # Telegram (Admin Alerts)
  TELEGRAM_BOT_TOKEN=...
  TELEGRAM_ADMIN_CHAT_ID=...

  # Upstash (Rate Limiting - Optional / Fallback to In-Memory)
  UPSTASH_REDIS_REST_URL=...
  UPSTASH_REDIS_REST_TOKEN=...

  # Analytics
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
  ```

---

## 11. STRICT ANTI-BLOAT & SECURITY RULES FOR AI AGENTS

1. **No Out-of-Scope Dependencies:** Do not install heavy state libraries (Redux, MobX), client-side database libraries, payment SDKs (Stripe, eSewa, Khalti), or heavy UI kits (MUI, Chakra, AntD).
2. **Zero Credentials in Client Code:** `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_ADMIN_CHAT_ID`, and Upstash keys must **NEVER** be prefixed with `NEXT_PUBLIC_` or imported into `'use client'` files.
3. **Keep Client Bundles Minimal:** Maximize use of React Server Components. Client components (`'use client'`) are strictly restricted to interactive leaf nodes (e.g. search input, variant selectors, mobile menu drawer, inquiry form, toast triggers).
4. **Adhere to Next.js 16 Rules:** Follow all Next.js 16 breaking conventions and rules as outlined in [AGENTS.md](file:///c:/nooridigital_assets/my-projects/muscleworks/AGENTS.md).
