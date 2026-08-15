# Domain 2 (R2) Audit Report: Logic Bugs, Edge Cases & Data Integrity

**Target Project**: MUSCLEWORKS SUPPLEMENTS (`muscleworks`)  
**Investigator**: Domain 2 (R2) Explorer  
**Audit Date**: 2026-08-15  
**Scope**: WhatsApp URL generation engine, Telegram Bot API integration & MarkdownV2 escaping, phone/pricing validations, and JSON dataset referential integrity.

---

## Executive Summary

The Domain 2 audit conducted a thorough, line-by-line inspection of the MUSCLEWORKS codebase across conversion channels, notification pipelines, data models, validation schemas, and static datasets (`data/*.json`).

### Summary of Audit Findings

| # | Issue Title | Target File | Line(s) | Severity | Category |
|---|---|---|---|---|---|
| **D2-01** | Category Archive Route Displays Entire Store Catalog | `src/app/categories/[slug]/page.tsx` | 65–70 | **Critical** | Route / Filter Logic Bug |
| **D2-02** | Telegram MarkdownV2 Over-Escaping in Inline Code Entities | `src/lib/services/telegram.ts` | 27–30, 42, 57, 66 | **Major** | API & Formatting Bug |
| **D2-03** | Missing Static Media Assets Referenced in JSON Datasets (35 Broken Paths) | `data/brands.json`, `data/categories.json`, `data/products.json`, `data/guides.json` | Global | **Major** | Data Integrity / Media |
| **D2-04** | Hardcoded Placeholder WhatsApp & Phone Numbers in Email Templates | `src/emails/CustomerInquiryConfirmation.tsx`, `src/emails/AdminInquiryAlert.tsx` | 31, 47, 119, 122, 143 | **Major** | Data Integrity & Formatting |
| **D2-05** | Fragile Inlined WhatsApp URL Construction Bypassing Central Engine | `src/app/error.tsx`, `src/app/not-found.tsx`, `src/components/layout/header.tsx`, `src/components/layout/mobile-nav.tsx`, `src/lib/constants.ts` | Multiple | **Minor** | Architecture & DRY Violation |
| **D2-06** | Nepal Phone Regex Rejects Formatted Numbers with Internal Separators | `src/lib/validations/common.ts` | 9 | **Minor** | Validation Edge Case |
| **D2-07** | Outdated Hardcoded Phone Number Assertion in Test Suite | `src/scripts/validate-whatsapp-analytics.ts` | 32, 38, 56 | **Optimization** | Test Suite Sync |

---

## Detailed Findings & Remediation

---

### Finding D2-01: Category Archive Route Displays Entire Store Catalog

- **Severity**: **Critical**
- **Relative Path**: `src/app/categories/[slug]/page.tsx`
- **Absolute Path**: `c:\nooridigital_assets\my-projects\muscleworks\src\app\categories\[slug]\page.tsx`
- **Lines**: 65–70

#### 1. Root Cause
In `CategoryArchivePage`, `initialProducts` is loaded via `getProducts()` (which returns all 15 products across all categories) instead of calling `getProductsByCategory(category.slug)`. Because the category identifier is present in the route path (`/categories/[slug]`) rather than in URL query parameters (`searchParams.category`), `CatalogContainer` receives `filterOptions.category === undefined` and displays the entire product database on every single category page.

#### 2. Concrete Impact
A customer navigating to `/categories/proteins` (or any other category like `/categories/creatine`, `/categories/mass-gainers`) sees all supplements in the store (pre-workouts, fish oil, animal pak, mass gainers, creatine) rather than proteins. This breaks customer navigation and catalog filtering.

#### 3. Copy-Paste Ready Fix Diff
```diff
--- a/src/app/categories/[slug]/page.tsx
+++ b/src/app/categories/[slug]/page.tsx
@@ -4,7 +4,7 @@
 import { notFound } from 'next/navigation';
 import { ShieldCheck, Dumbbell, HelpCircle } from 'lucide-react';
 import { getCategories, getCategoryBySlug } from '@/lib/data/categories';
-import { getProducts } from '@/lib/data/products';
+import { getProductsByCategory } from '@/lib/data/products';
 import { getBrands } from '@/lib/data/brands';
 import { CatalogContainer } from '@/components/catalog/catalog-container';
 import { Badge } from '@/components/ui/badge';
@@ -63,7 +63,7 @@
   }
 
   const [products, categories, brands] = await Promise.all([
-    getProducts(),
+    getProductsByCategory(category.slug),
     getCategories(),
     getBrands(),
   ]);
```

---

### Finding D2-02: Telegram MarkdownV2 Over-Escaping in Inline Code Entities

- **Severity**: **Major**
- **Relative Path**: `src/lib/services/telegram.ts`
- **Absolute Path**: `c:\nooridigital_assets\my-projects\muscleworks\src\lib\services\telegram.ts`
- **Lines**: 27–30, 42, 57, 66

#### 1. Root Cause
The official Telegram Bot API MarkdownV2 specification explicitly mandates:
> *“Inside pre and code entities, all '`' and '\' characters must be escaped with a preceding '\' character.”*

The current implementation passes phone numbers (`` `\+977 9801234567` ``), product SKUs (`` `ON\-WHEY\-5LB\-CHOC` ``), and inquiry IDs (`` `inq\_1723289400000\_a8f9b` ``) through `escapeMarkdownV2()`, which escapes `-`, `+`, `_`, `.`, etc. Because Telegram does not strip escapes inside code blocks, these backslashes are rendered literally to store managers and cause `validate-notification-services.ts` assertion failures (`❌ [FAIL] Includes product SKU`).

#### 2. Concrete Impact
1. Telegram push notifications delivered to store admins display unsightly backslash escapes (`\+977 9801234567`, `ON\-WHEY\-5LB\-CHOC`, `INQ\-9901`).
2. Tapping the phone number to call or copy on mobile includes stray `\` characters.
3. Test suite assertion failure in `src/scripts/validate-notification-services.ts`.

#### 3. Copy-Paste Ready Fix Diff
```diff
--- a/src/lib/services/telegram.ts
+++ b/src/lib/services/telegram.ts
@@ -27,6 +27,15 @@
 export function escapeMarkdownV2(text: string): string {
   if (!text) return '';
   return text.replace(/[-_*[\]()~`>#+=|{}.!\\]/g, '\\$&');
 }
 
+/**
+ * Escapes reserved Telegram MarkdownV2 characters inside `code` and `pre` entities.
+ * According to Telegram Bot API specification, only ` and \ need to be escaped in code blocks.
+ */
+export function escapeMarkdownV2Code(text: string): string {
+  if (!text) return '';
+  return text.replace(/[`\\]/g, '\\$&');
+}
+
 /**
  * Formats structured MarkdownV2 message payload for Telegram admin notification.
  */
@@ -39,7 +48,7 @@
   
   const customerDetails = [
     `👤 *Name:* ${escapeMarkdownV2(payload.fullName)}`,
-    `📞 *Phone:* \`${escapeMarkdownV2(payload.phoneNumber)}\``,
+    `📞 *Phone:* \`${escapeMarkdownV2Code(payload.phoneNumber)}\``,
     payload.email ? `📧 *Email:* ${escapeMarkdownV2(payload.email)}` : null,
     `📍 *Delivery City:* ${escapeMarkdownV2(payload.deliveryCity || 'Kathmandu')}`,
     `💬 *Contact Method:* ${escapeMarkdownV2(payload.preferredContactMethod || 'whatsapp')}`,
@@ -54,7 +63,7 @@
     const lines = [
       `📦 *Product:* ${escapeMarkdownV2(pc.productName)}`,
       pc.variantLabel ? `⚖️ *Variant:* ${escapeMarkdownV2(pc.variantLabel)}` : null,
-      pc.variantSku ? `🆔 *SKU:* \`${escapeMarkdownV2(pc.variantSku)}\`` : null,
+      pc.variantSku ? `🆔 *SKU:* \`${escapeMarkdownV2Code(pc.variantSku)}\`` : null,
       pc.priceNpr ? `💰 *Price:* ${escapeMarkdownV2(formatNprPrice(pc.priceNpr))}` : null,
     ].filter(Boolean);
 
@@ -63,7 +72,7 @@
   
   const messageSection = `\n📝 *Customer Message:*\n"${escapeMarkdownV2(payload.message)}"`;
   
-  const footer = `\n🆔 *Inquiry ID:* \`${escapeMarkdownV2(payload.inquiryId)}\`\n⏰ *Submitted:* ${escapeMarkdownV2(timestamp)}`;
+  const footer = `\n🆔 *Inquiry ID:* \`${escapeMarkdownV2Code(payload.inquiryId)}\`\n⏰ *Submitted:* ${escapeMarkdownV2(timestamp)}`;
 
   return `${header}\n\n${customerDetails}${productDetails}\n${messageSection}\n${footer}`;
 }
```

---

### Finding D2-03: Missing Static Media Assets Referenced in JSON Datasets (35 Broken Paths)

- **Severity**: **Major**
- **Relative Path**: `data/brands.json`, `data/categories.json`, `data/products.json`, `data/guides.json`, `src/components/product/product-card.tsx`
- **Absolute Path**: `c:\nooridigital_assets\my-projects\muscleworks\data\`
- **Lines**: Global across dataset files

#### 1. Root Cause
The static datasets declare 35 local static image paths that do not exist in `public/`:
1. **11 Brand Logos**: `public/brands/` only contains 5 images (`biotech-usa.webp`, `bpi-sports.webp`, `muscleblaze.webp`, `optimum-nutrition.webp`, `scitec-nutrition.webp`). The remaining 11 brands (e.g. `muscletech.webp`, `dymatize.webp`, `myprotein.webp`, `kevin-levrone.webp`, `rule-1.webp`, `labrada.webp`, `cellucor.webp`, `universal-nutrition.webp`, `scivation.webp`, `insane-labz.webp`, `musclepharm.webp`) are missing on disk.
2. **6 Category Hero Images**: `public/images/categories/` directory does not exist on disk (`proteins-hero.webp`, `creatine-hero.webp`, etc.).
3. **15 Product Images**: `public/images/products/` directory does not exist on disk (`on-gold-standard-whey-choc.webp`, etc.).
4. **3 Guide Covers**: `public/images/guides/` directory does not exist on disk (`authenticity-guide-cover.webp`, etc.).
5. **Product Card Fallback Placeholder**: Line 53 of `src/components/product/product-card.tsx` points to `/images/products/placeholder.jpg`, which also does not exist on disk.

#### 2. Concrete Impact
Next.js `<Image>` components attempting to load these local paths will trigger 404 HTTP errors in the browser, showing broken image icons or failing image optimization requests on PDP galleries, catalog grids, and brand archive pages.

#### 3. Recommended Remediation
1. Provide valid placeholder images or generate default WebP placeholders in `public/images/products/`, `public/images/categories/`, `public/images/guides/`, and `public/brands/`.
2. Add graceful SVG/CSS fallback placeholders in `ProductCard`, `ProductGallery`, and `BrandsMarquee` when image files fail to load.

---

### Finding D2-04: Hardcoded Placeholder Contact & WhatsApp Numbers in Email Templates

- **Severity**: **Major**
- **Relative Path**: `src/emails/CustomerInquiryConfirmation.tsx`, `src/emails/AdminInquiryAlert.tsx`
- **Absolute Path**: `c:\nooridigital_assets\my-projects\muscleworks\src\emails\`
- **Lines**: `CustomerInquiryConfirmation.tsx` (31, 122, 143), `AdminInquiryAlert.tsx` (34, 47, 119)

#### 1. Root Cause
1. `CustomerInquiryConfirmation.tsx` hardcodes the dummy phone number `9779801234567` and link `https://wa.me/9779801234567` rather than using the canonical `STORE_WHATSAPP` (`+9779819877070`) and `STORE_PHONE` from `@/lib/constants`.
2. In `AdminInquiryAlert.tsx`: Line 47 performs `const formattedPhoneDigits = phoneNumber.replace(/[^0-9]/g, '');`. If a customer submits a standard Nepal mobile number `9841234567` (10 digits), `formattedPhoneDigits` becomes `9841234567` without country code `977`. The WhatsApp button `href="https://wa.me/9841234567?..."` fails to route to Nepal (`+977`) and instead opens Iran (`+98`) or errors.

#### 2. Concrete Impact
- Customers receiving automated confirmation emails click on a fake WhatsApp link (`9779801234567`) and cannot reach store support.
- Store managers clicking the WhatsApp quick-reply button in admin notification emails get redirected to an invalid international destination if the lead entered a 10-digit number.

#### 3. Copy-Paste Ready Fix Diff

**Part A: `src/emails/CustomerInquiryConfirmation.tsx`**
```diff
--- a/src/emails/CustomerInquiryConfirmation.tsx
+++ b/src/emails/CustomerInquiryConfirmation.tsx
@@ -14,6 +14,7 @@
   Button,
   Preview,
 } from '@react-email/components';
+import { STORE_PHONE_DISPLAY, STORE_WHATSAPP } from '../lib/constants';
 
 export interface CustomerInquiryConfirmationProps {
   inquiryId: string;
@@ -28,7 +29,7 @@
 export const CustomerInquiryConfirmation = ({
   inquiryId = 'INQ-1001',
   fullName = 'Valued Customer',
-  phoneNumber = '+977 9801234567',
+  phoneNumber = '+977 981-9877070',
   inquiryType = 'general',
   message = 'I would like to check stock availability and delivery to Golfutar.',
   deliveryCity = 'Kathmandu',
@@ -37,6 +38,7 @@
   priceFormatted,
 }: CustomerInquiryConfirmationProps) => {
   const previewText = `Namaste ${fullName}! Your inquiry #${inquiryId} has been received by MUSCLEWORKS SUPPLEMENTS Nepal.`;
+  const sanitizedWhatsApp = STORE_WHATSAPP.replace(/\D/g, '');
 
   return (
     <Html lang="en">
@@ -119,7 +121,7 @@
           {/* Quick Action Button */}
           <Section style={actionSectionStyle}>
             <Button
-              href="https://wa.me/9779801234567"
+              href={`https://wa.me/${sanitizedWhatsApp}`}
               style={whatsappButtonStyle}
             >
               💬 Need Urgent Help? Chat via WhatsApp
@@ -140,7 +142,7 @@
               Opening Hours: Sun–Fri 10:00 AM – 9:00 PM | Sat: Contact Store
             </Text>
             <Text style={footerSubtextStyle}>
-              Phone: +977 9801234567 | Web: {' '}
+              Phone: {STORE_PHONE_DISPLAY} | Web: {' '}
               <Link href="https://muscleworksnepal.com" style={linkStyle}>
                 muscleworksnepal.com
               </Link>
```

**Part B: `src/emails/AdminInquiryAlert.tsx`**
```diff
--- a/src/emails/AdminInquiryAlert.tsx
+++ b/src/emails/AdminInquiryAlert.tsx
@@ -44,7 +44,8 @@
 }: AdminInquiryAlertProps) => {
   const previewText = `🚨 ADMIN ALERT: New Inquiry #${inquiryId} from ${fullName} (${deliveryCity})`;
 
-  const formattedPhoneDigits = phoneNumber.replace(/[^0-9]/g, '');
+  const rawDigits = phoneNumber.replace(/[^0-9]/g, '');
+  const formattedPhoneDigits = rawDigits.startsWith('977') ? rawDigits : rawDigits.length === 10 ? `977${rawDigits}` : rawDigits;
 
   return (
     <Html lang="en">
```

---

### Finding D2-05: Fragile Inlined WhatsApp URL Construction Bypassing Central Engine

- **Severity**: **Minor**
- **Relative Path**: `src/app/error.tsx`, `src/app/not-found.tsx`, `src/components/layout/header.tsx`, `src/components/layout/mobile-nav.tsx`, `src/lib/constants.ts`
- **Absolute Path**: `c:\nooridigital_assets\my-projects\muscleworks\`
- **Lines**: `error.tsx` (24), `not-found.tsx` (27), `header.tsx` (13), `mobile-nav.tsx` (90), `constants.ts` (142)

#### 1. Root Cause
These 5 components bypass the canonical `buildGeneralWhatsAppUrl()` or `getBaseWhatsAppUrl()` helper from `src/lib/whatsapp.ts`. Instead, they construct the URL manually using `STORE_WHATSAPP.replace(/\+/g, "")`. If `STORE_WHATSAPP` contains spaces or hyphens, this regex only strips the `+` character, producing invalid URLs like `https://wa.me/977 981-9877070`.

#### 2. Concrete Impact
Violates the Single Source of Truth architectural rule and creates fragile URL generation that will fail if `STORE_WHATSAPP` formatting is adjusted.

#### 3. Copy-Paste Ready Fix Diff
```diff
--- a/src/components/layout/header.tsx
+++ b/src/components/layout/header.tsx
@@ -5,14 +5,14 @@
 import { Navbar } from "@/components/layout/navbar";
 import { MobileNav } from "@/components/layout/mobile-nav";
 import { Button } from "@/components/ui/button";
-import { STORE_NAME, STORE_WHATSAPP } from "@/lib/constants";
+import { STORE_NAME } from "@/lib/constants";
+import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
 
 import { SearchModal } from "@/components/catalog/search-modal";
 
 export function Header() {
-  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\+/g, "")}?text=${encodeURIComponent(
-    "Hello MuscleWorks Nepal! I'd like to order authentic supplements / check product stock."
-  )}`;
+  const whatsappUrl = buildGeneralWhatsAppUrl(
+    "Hello MuscleWorks Nepal! I'd like to order authentic supplements / check product stock."
+  );
 
   return (
```

*(Identical refactoring applies to `src/app/error.tsx`, `src/app/not-found.tsx`, and `src/components/layout/mobile-nav.tsx`)*

---

### Finding D2-06: Nepal Phone Regex Rejects Formatted Numbers with Internal Separators

- **Severity**: **Minor**
- **Relative Path**: `src/lib/validations/common.ts`
- **Absolute Path**: `c:\nooridigital_assets\my-projects\muscleworks\src\lib\validations\common.ts`
- **Line**: 9

#### 1. Root Cause
`NEPAL_PHONE_REGEX` is defined as:
```ts
/^(?:\+977[- ]?)?(?:98\d{8}|97\d{8}|01[- ]?\d{6,7})$/
```
While this correctly handles `+977 9841234567` or `9841234567`, it fails if a user formats the 10-digit number with standard blocks like `981-9877070`, `984-1234567`, `984 123 4567`, or `+977 981-9877070`.

#### 2. Concrete Impact
Legitimate human customers entering formatted telephone numbers copied from contacts or formatted by mobile keyboards are blocked by client-side form validation.

#### 3. Copy-Paste Ready Fix Diff
```diff
--- a/src/lib/validations/common.ts
+++ b/src/lib/validations/common.ts
@@ -6,7 +6,7 @@
  * - GSM Mobile (Ncell/NTC): +977-98XXXXXXXX, 98XXXXXXXX, +977-97XXXXXXXX, 97XXXXXXXX
  * - Kathmandu Landline: 01-XXXXXXX, +977-01-XXXXXXX
  */
-export const NEPAL_PHONE_REGEX = /^(?:\+977[- ]?)?(?:98\d{8}|97\d{8}|01[- ]?\d{6,7})$/;
+export const NEPAL_PHONE_REGEX = /^(?:\+977[- ]?)?(?:9[78]\d{8}|9[78]\d{1,2}[- ]?\d{3}[- ]?\d{3,4}|01[- ]?\d{6,7})$/;
 export const NepalPhoneRegex = NEPAL_PHONE_REGEX;
```

---

### Finding D2-07: Outdated Hardcoded Phone Number Assertion in Test Suite

- **Severity**: **Optimization**
- **Relative Path**: `src/scripts/validate-whatsapp-analytics.ts`
- **Absolute Path**: `c:\nooridigital_assets\my-projects\muscleworks\src\scripts\validate-whatsapp-analytics.ts`
- **Lines**: 32, 38, 56

#### 1. Root Cause
`validate-whatsapp-analytics.ts` asserts against a stale dummy number `9779800000000`. When `src/lib/constants.ts` was updated with the confirmed store number `+9779819877070`, the script failed with:
`Error: Sanitized phone number mismatch! Expected 9779800000000, got 9779819877070`.

#### 2. Concrete Impact
Executing `npx tsx src/scripts/validate-whatsapp-analytics.ts` yields a false-positive test failure.

#### 3. Copy-Paste Ready Fix Diff
```diff
--- a/src/scripts/validate-whatsapp-analytics.ts
+++ b/src/scripts/validate-whatsapp-analytics.ts
@@ -5,6 +5,7 @@
 import {
   getSanitizedWhatsAppNumber,
   getBaseWhatsAppUrl,
+  buildProductWhatsAppUrl,
   buildGeneralWhatsAppUrl,
   buildAuthenticityInquiryWhatsAppUrl,
   buildStackConsultationWhatsAppUrl,
@@ -12,6 +13,7 @@
 } from '../lib/whatsapp';
+import { STORE_WHATSAPP } from '../lib/constants';
 import {
   trackWhatsAppClick,
   trackProductView,
@@ -30,13 +32,14 @@
   // Test 1: Sanitized Phone Number
   const sanitized = getSanitizedWhatsAppNumber();
   console.log(`✓ Sanitized Phone Number: ${sanitized}`);
-  if (sanitized !== '9779800000000') {
-    throw new Error(`Sanitized phone number mismatch! Expected 9779800000000, got ${sanitized}`);
+  const expectedSanitized = STORE_WHATSAPP.replace(/\D/g, '');
+  if (sanitized !== expectedSanitized) {
+    throw new Error(`Sanitized phone number mismatch! Expected ${expectedSanitized}, got ${sanitized}`);
   }
 
   // Test 2: Base WhatsApp URL
   const baseUrl = getBaseWhatsAppUrl();
-  if (baseUrl !== 'https://wa.me/9779800000000') {
-    throw new Error(`Base URL mismatch! Expected https://wa.me/9779800000000, got ${baseUrl}`);
+  if (baseUrl !== `https://wa.me/${expectedSanitized}`) {
+    throw new Error(`Base URL mismatch! Expected https://wa.me/${expectedSanitized}, got ${baseUrl}`);
   }
```

---

## Conclusion & Next Steps

All 7 findings have been verified against the codebase with line references, root cause analysis, and validated diffs. The highest priority fix is **D2-01** (unfiltered category catalog bug), followed by **D2-02** (Telegram MarkdownV2 over-escaping) and **D2-04** (email WhatsApp number link fixes).
