# Feature Spec 19: Sub-Phase 2.5 — Store, FAQ & Content Accessor Layer

> **Spec ID:** `19-subphase-2.5-store-faq-content-accessor-layer`  
> **Target Sub-Phase / Branch:** Sub-Phase 2.5 (`Phase-2` branch)  
> **Status:** Completed  
> **Created Date:** 2026-08-10  
> **Author:** AI Assistant  

---

## Executive Summary

Sub-Phase 2.5 completes Phase 2 (**Static Datasets & Typed Data Access Layer**) by constructing the data accessors and validations for physical store metadata (`src/lib/data/store.ts`), FAQ knowledge base entries (`src/lib/data/faqs.ts`), and educational buying guides (`src/lib/data/guides.ts`). These gateways wrap static datasets (`data/store-info.json`, `data/faqs.json`, `data/guides.json`) with Zod schema verification at module initialization, providing async interfaces for Next.js 16 App Router Server Components, SSG prerendering, and schema structured data generators (`LocalBusiness`, `FAQPage`, `Article` JSON-LD).

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/lib/validations/guide.ts` | **[NEW]** | Implement `GuideFrontmatterSchema`, `GuideCategoryEnum`, and `GuideAuthorSchema` matching `data-models.md` section 7. |
| 2 | `data/guides.json` | **[NEW]** | Author canonical educational guide dataset covering supplement authenticity, protein buyer guides, and creatine timing. |
| 3 | `src/lib/data/store.ts` | **[NEW]** | Implement typed store accessors (`getStoreInfo`, `getOpeningHours`, `getDeliveryPolicy`, `getTodayOpeningHours`, `isStoreOpenNow`). |
| 4 | `src/lib/data/faqs.ts` | **[NEW]** | Implement typed FAQ accessors (`getFAQs`, `getFAQsByCategory`, `getFAQById`, `searchFAQs`, `getFeaturedFAQs`). |
| 5 | `src/lib/data/guides.ts` | **[NEW]** | Implement typed guide accessors (`getAllGuides`, `getGuideBySlug`, `getFeaturedGuides`, `getGuidesByCategory`, `getRelatedGuides`). |
| 6 | `src/scripts/validate-store-faq-guide-accessors.ts` | **[NEW]** | Validation runner script to exercise accessors and verify Zod compliance. |
| 7 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 19 in registry index. |
| 8 | `context/progress-tracker.md` | **[MODIFY]** | Mark Sub-Phase 2.5 as `[IN PROGRESS]` / Complete and log session change notes. |

---

## 2. Why We Are Doing This

1. **Architectural Encapsulation:** Isolates raw static JSON files (`data/store-info.json`, `data/faqs.json`, `data/guides.json`) behind typed gateway boundaries (`src/lib/data/*`).
2. **Zero-Drift Type Safety:** Validates datasets at module load time against Zod schemas (`StoreInfoSchema`, `FAQItemSchema`, `GuideFrontmatterSchema`), preventing broken properties during static site generation (SSG).
3. **Timezone & Store Operations Awareness:** Calculates physical store open/closed states using Nepal local time (`Asia/Kathmandu`), properly handling Saturday's "Contact Store" status per store policy.
4. **Future-Proof MDX Foundation:** Provides static JSON guide accessors now that seamlessly map to full MDX file parsing in Phase 6.

---

## 3. How We Are Going to Implement It

### Step 1: `src/lib/validations/guide.ts`
Define Zod schemas and TypeScript types:
- `GuideCategory`: `'buying_guide' | 'supplement_education' | 'authenticity_guide' | 'beginner_fitness' | 'nutrition_science'`
- `GuideAuthorSchema`: `name`, `role`, `avatar`, `bio`
- `GuideFrontmatterSchema`: `title`, `slug`, `excerpt`, `category`, `coverImage`, `author`, `publishedDate`, `updatedDate`, `readingTimeMinutes`, `isFeatured`, `relatedProductSlugs`, `relatedCategorySlugs`, `faqs`, `seo`

### Step 2: `data/guides.json`
Author static guide dataset featuring:
1. `how-to-verify-authentic-supplements-in-nepal`: Complete guide on authorized importer sticker verification, QR codes, and tamper seals.
2. `whey-protein-isolate-vs-concentrate-buying-guide`: Buying guide explaining lactose tolerance, filtration, and price-to-protein value.
3. `creatine-monohydrate-loading-vs-daily-dose-guide`: Science-backed guide on creatine dosage, timing, and hydration in Nepal.

### Step 3: `src/lib/data/store.ts`
Implement typed store gateway:
- Parse `data/store-info.json` using `StoreInfoSchema.parse(...)` on module execution.
- `getStoreInfo(): Promise<StoreInfo>`
- `getOpeningHours(): Promise<OpeningHourItem[]>`
- `getDeliveryPolicy(): Promise<DeliveryZonePolicy>`
- `getTodayOpeningHours(): Promise<OpeningHourItem | null>`
- `isStoreOpenNow(): Promise<{ isOpen: boolean; message: string }>` (evaluating `Asia/Kathmandu` current time & day; returning `isOpen: false` with `"Saturday hours vary. Please contact store before visiting Golfutar flagship."` on Saturdays or when `opens === "Contact Store"`).

### Step 4: `src/lib/data/faqs.ts`
Implement typed FAQ gateway:
- Parse `data/faqs.json` using `FAQItemSchema.array().parse(...)` on module execution.
- `getFAQs(): Promise<FAQItem[]>`
- `getFAQsByCategory(category: FAQCategory | string): Promise<FAQItem[]>`
- `getFAQById(id: string): Promise<FAQItem | null>`
- `searchFAQs(query: string): Promise<FAQItem[]>`
- `getFeaturedFAQs(limit = 4): Promise<FAQItem[]>`

### Step 5: `src/lib/data/guides.ts`
Implement typed guide gateway:
- Parse `data/guides.json` using `GuideFrontmatterSchema.array().parse(...)` on module execution.
- `getAllGuides(): Promise<GuideFrontmatter[]>`
- `getGuideBySlug(slug: string): Promise<GuideFrontmatter | null>`
- `getFeaturedGuides(limit = 3): Promise<GuideFrontmatter[]>`
- `getGuidesByCategory(category: GuideCategory): Promise<GuideFrontmatter[]>`
- `getRelatedGuides(slug: string, limit = 2): Promise<GuideFrontmatter[]>`

---

## 4. When We Are Going to Do It

```text
Step 1: Create Zod Schema (`src/lib/validations/guide.ts`)
    │
    ▼
Step 2: Create Canonical Guide Dataset (`data/guides.json`)
    │
    ▼
Step 3: Build Store Accessor (`src/lib/data/store.ts`)
    │
    ▼
Step 4: Build FAQ Accessor (`src/lib/data/faqs.ts`)
    │
    ▼
Step 5: Build Guide Accessor (`src/lib/data/guides.ts`)
    │
    ▼
Step 6: Validate with Test Script & Run Static Type Check (`npx tsc --noEmit`)
```

---

## 5. Verification & Definition of Done

1. `npx tsc --noEmit` compiles with 0 errors.
2. `src/scripts/validate-store-faq-guide-accessors.ts` executes successfully and prints 100% pass status.
3. All exported accessors return valid Zod-parsed entities.
4. Saturday store hours handle "Contact Store" status without runtime exceptions.
