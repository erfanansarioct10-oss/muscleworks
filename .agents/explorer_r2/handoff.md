# Domain 2 (R2) Handoff Report: Logic Bugs, Edge Cases & Data Integrity

**Author**: Domain 2 (R2) Explorer  
**Recipient**: Orchestrator (`dd68ad91-27b1-4222-87a6-bca82fbbe0ed`)  
**Date**: 2026-08-15  
**Working Directory**: `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_r2`  
**Full Report**: `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_r2\analysis.md`

---

## 1. Observation

Direct observations and evidence verified across the codebase:

1. **Category Route Filter Bug (`src/app/categories/[slug]/page.tsx:65-70`)**:
   ```tsx
   65:   const [products, categories, brands] = await Promise.all([
   66:     getProducts(),
   67:     getCategories(),
   68:     getBrands(),
   69:   ]);
   ```
   `getProducts()` is called instead of `getProductsByCategory(category.slug)`. When visiting `/categories/proteins`, all 15 products in the catalog are loaded.

2. **Telegram MarkdownV2 Over-Escaping (`src/lib/services/telegram.ts:27-30, 42, 57, 66`)**:
   ```ts
   42:     `📞 *Phone:* \`${escapeMarkdownV2(payload.phoneNumber)}\``,
   57:       pc.variantSku ? `🆔 *SKU:* \`${escapeMarkdownV2(pc.variantSku)}\`` : null,
   66:   const footer = `\n🆔 *Inquiry ID:* \`${escapeMarkdownV2(payload.inquiryId)}\`\n⏰ *Submitted:* ${escapeMarkdownV2(timestamp)}`;
   ```
   Running `npx tsx src/scripts/validate-notification-services.ts` outputs:
   `❌ [FAIL] Includes product SKU`
   Telegram output contains literal backslashes: `` `ON\-WHEY\-5LB\-CHOC` ``, `` `\+977 9801234567` ``, `` `INQ\-9901` ``.

3. **Referential Integrity & Missing Image Assets (`data/*.json` vs `public/`)**:
   Running automated disk integrity check reveals 35 referenced static image paths missing on disk:
   - 11 brand logos in `data/brands.json` (e.g. `/brands/muscletech.webp`, `/brands/dymatize.webp`) do not exist in `public/brands/` (only 5 brand logos exist).
   - 6 category hero images in `data/categories.json` (`/images/categories/*-hero.webp`) — directory `public/images/categories/` does not exist.
   - 15 product images in `data/products.json` (`/images/products/*.webp`) — directory `public/images/products/` does not exist.
   - 3 guide covers in `data/guides.json` (`/images/guides/*-cover.webp`) — directory `public/images/guides/` does not exist.
   - `src/components/product/product-card.tsx:53` references `/images/products/placeholder.jpg` which does not exist.

4. **Hardcoded Placeholder Contacts & Admin Reply Link in Emails**:
   - `src/emails/CustomerInquiryConfirmation.tsx:122`: `href="https://wa.me/9779801234567"` (fake dummy number).
   - `src/emails/CustomerInquiryConfirmation.tsx:143`: `Phone: +977 9801234567` (fake dummy number).
   - `src/emails/AdminInquiryAlert.tsx:47, 119`: `formattedPhoneDigits = phoneNumber.replace(/[^0-9]/g, '')` does not prepend country code `977` for 10-digit numbers (`9841234567`), producing `wa.me/9841234567`.

5. **Inlined WhatsApp Construction & Regex Bypass**:
   `src/app/error.tsx:24`, `src/app/not-found.tsx:27`, `src/components/layout/header.tsx:13`, `src/components/layout/mobile-nav.tsx:90`, `src/lib/constants.ts:142` all construct URLs with `https://wa.me/${STORE_WHATSAPP.replace(/\+/g, "")}?text=...`, bypassing `buildGeneralWhatsAppUrl()`.

6. **Nepal Phone Regex Rejection of Formatted Numbers (`src/lib/validations/common.ts:9`)**:
   `NEPAL_PHONE_REGEX = /^(?:\+977[- ]?)?(?:98\d{8}|97\d{8}|01[- ]?\d{6,7})$/` rejects valid formatted inputs like `981-9877070` or `+977 981-9877070`.

7. **Stale Hardcoded Phone Assertion in Validation Script (`src/scripts/validate-whatsapp-analytics.ts:32, 38, 56`)**:
   Asserts against `9779800000000` while `STORE_WHATSAPP` was updated to `+9779819877070`.

---

## 2. Logic Chain

1. **From Observation 1 to D2-01**:
   `CategoryArchivePage` passes the result of `getProducts()` into `CatalogContainer`. Because the category slug exists in route params (`params.slug`), `searchParams.category` is undefined, and `filterAndSortProducts` performs no filtering. Therefore, any visitor to `/categories/[slug]` sees all store products.

2. **From Observation 2 to D2-02**:
   Telegram MarkdownV2 grammar rules treat all characters inside single backticks (`` `...` ``) as literal code where only `` ` `` and `\` require escaping. `escapeMarkdownV2` transforms characters like `-` into `\-`, which Telegram displays literally as `\-` in the chat UI and breaks string matching assertions.

3. **From Observation 3 to D2-03**:
   `next/image` requires local image files referenced with absolute URLs (e.g., `/images/products/on-gold-standard-whey-choc.webp`) to exist under `public/`. Because 35 files/directories are absent, browsers receive 404 responses for images across catalog and PDP routes.

4. **From Observation 4 to D2-04**:
   `CustomerInquiryConfirmation.tsx` contains un-synced placeholder strings from early prototyping. In `AdminInquiryAlert.tsx`, `wa.me/` URLs require international format with country code (`97798...`). Stripping all non-digits from a 10-digit number without checking the country code prefix yields an invalid WhatsApp target.

5. **From Observation 5 & 6 to D2-05 & D2-06**:
   Using `.replace(/\+/g, "")` does not sanitize hyphens or spaces, meaning any formatting changes in `STORE_WHATSAPP` break all five inlined call sites. Similarly, `NEPAL_PHONE_REGEX` assumes unformatted 8-digit tails after `98`/`97`, causing user validation errors on formatted input.

---

## 3. Caveats

- Investigation is strictly read-only per agent constraints; no files in `src/` or `data/` were modified.
- For missing images (D2-03), whether the project owner intends to provide real asset files or use generated SVG placeholders was noted as a design decision for the implementer.
- No other logic bugs or integrity discrepancies were discovered across the remaining data accessors (`guides.ts`, `faqs.ts`, `brands.ts`, `store.ts`, `catalog.ts`, `search.ts`).

---

## 4. Conclusion

The audit identifies **1 Critical**, **3 Major**, **2 Minor**, and **1 Optimization** issue.
The most impactful actionable bugs are:
1. Fix `src/app/categories/[slug]/page.tsx` by replacing `getProducts()` with `getProductsByCategory(category.slug)`.
2. Fix `src/lib/services/telegram.ts` by adding `escapeMarkdownV2Code()` for code block variables.
3. Fix `src/emails/CustomerInquiryConfirmation.tsx` and `src/emails/AdminInquiryAlert.tsx` to use canonical constants and prepend `977` for 10-digit WhatsApp links.
4. Unify inlined WhatsApp URL calls via `buildGeneralWhatsAppUrl()`.

---

## 5. Verification Method

To independently verify all findings and fixes:

1. **Test Category Archive Route Filtering**:
   - Inspect `src/app/categories/[slug]/page.tsx:65-70`.
   - Run `npm run build` and check `/categories/proteins` data output.

2. **Test Telegram MarkdownV2 Formatting**:
   - Run: `npx tsx src/scripts/validate-notification-services.ts`
   - Verify that all 15 tests pass after applying the `escapeMarkdownV2Code` fix.

3. **Test WhatsApp URL & Analytics Suite**:
   - Run: `npx tsx src/scripts/validate-whatsapp-analytics.ts`

4. **Verify Image Asset Paths on Disk**:
   - Run: `node -e "const fs = require('fs'); const p = JSON.parse(fs.readFileSync('data/products.json')); console.log(p.filter(x => !fs.existsSync('public' + x.images[0].url)).length + ' missing');"`
