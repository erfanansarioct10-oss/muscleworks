# Domain 1 (R1) Audit Report: Concurrency, Race Conditions & State Inconsistencies

**Target Project:** MUSCLEWORKS SUPPLEMENTS (`muscleworks`)  
**Investigator:** Domain 1 (R1) Explorer Subagent  
**Scope:** Search Debouncing/Aborts, Form Submission Locking (Double Submit), Asia/Kathmandu Store Opening Hours & Hydration Inconsistencies, Shared Mutable State & Async Leaks.  
**Date:** 2026-08-15  

---

## Executive Summary

A comprehensive, line-by-line audit of the MUSCLEWORKS codebase across client components, Server Actions, data accessors, utility singletons, and cache handlers was conducted. 

A total of **10 distinct findings** were identified and verified against the live source code:
- **1 Critical finding**: Clock-skew false-positive race condition in the anti-spam timing trap (`src/lib/services/security.ts`) that silently drops legitimate customer inquiries from mobile devices in Nepal.
- **4 Major findings**:
  1. Form submission mutex race condition (double submit & concurrent triggering) in `contact-form.tsx` and `inquiry-form.tsx`.
  2. Search bar and Search modal Enter-key navigation failure and debounced loading indicator lag (`search-bar.tsx` & `search-modal.tsx`).
  3. Concurrent Promise race condition in search index initialization (`src/lib/search.ts`).
  4. Canonical store operating hours and delivery threshold discrepancies between `constants.ts`, `footer.tsx`, `mobile-nav.tsx`, and `store-info.json`.
- **4 Minor findings**:
  1. Midnight `hourCycle: 'h23'` ambiguity in `Intl.DateTimeFormat` (`src/lib/data/store.ts`).
  2. Cumulative Layout Shift (CLS) from client-side empty state hydration in `StoreHoursCard` (`store-hours-card.tsx`).
  3. Unbounded in-memory rate limiter cache map leak lacking TTL eviction (`src/lib/services/ratelimit.ts`).
  4. Deals section countdown timer client-side interval drift on backgrounded tabs (`deals-section.tsx`).
- **1 Optimization finding**:
  1. Redundant per-request `Redis.fromEnv()` and `Ratelimit` instance creation in `ratelimit.ts`.

---

## Severity-Ranked Detailed Findings

---

### [CRITICAL] Finding D1-01: Timing Trap Clock-Skew False-Positive & Silent Lead Dropping

- **File Path (Relative):** `src/lib/services/security.ts`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\lib\services\security.ts`
- **Line Numbers:** Lines 32–45
- **Related Files:** `src/components/forms/contact-form.tsx` (Line 86), `src/components/forms/inquiry-form.tsx` (Line 101), `src/actions/contact.ts` (Lines 50–53), `src/actions/inquiry.ts` (Lines 50–53)
- **Severity:** Critical

#### Root Cause Analysis
The anti-spam timing trap is designed to prevent bot scripts from instantly submitting forms (< 2000ms). The client component records its local device timestamp via `setValue('_form_loaded_at', Date.now())` in `useEffect`. When the form is submitted to the Server Action (`submitContactAction` or `submitInquiryAction`), `isTimingTrapTriggered` compares the server's clock (`const now = Date.now()`) with the client's timestamp (`formLoadedAt`):

```typescript
export function isTimingTrapTriggered(
  formLoadedAt?: number,
  minDurationMs: number = 2000
): boolean {
  if (typeof formLoadedAt !== 'number' || isNaN(formLoadedAt) || formLoadedAt <= 0) {
    return true;
  }

  const now = Date.now();
  const elapsed = now - formLoadedAt;

  // Triggered if submitted faster than minDurationMs or if timestamp is in future (> 5s skew)
  return elapsed < minDurationMs || elapsed < -5000 || formLoadedAt > now + 5000;
}
```

Because `elapsed` is calculated as `now - formLoadedAt`:
1. If the customer's phone or computer clock is just 1 to 3 seconds ahead of standard NTP server time (a very common occurrence on mobile devices in Nepal where manual time offsets or carrier drifts occur), `formLoadedAt` is higher than `now` at page load.
2. If a customer takes 4 seconds to fill out the form, but their device clock was 3 seconds ahead, `now - formLoadedAt` evaluates to `1000ms`. Because `1000 < 2000` (`elapsed < minDurationMs`), the check returns `true`!
3. If the user's clock is 6 seconds ahead, `formLoadedAt > now + 5000` is immediately `true`.
4. When `isTimingTrapTriggered` returns `true`, the Server Action returns `SILENT_SPAM_SUCCESS_RESPONSE` (`inq_spambot_dropped`). The UI shows "Inquiry Received!" to the user, but neither Telegram nor Resend alerts are sent.

#### Concrete Impact
Legitimate human customers in Nepal submitting product inquiries or contact requests are silently discarded without any error or notification whenever their device clock has even minor forward drift.

#### Exact Fix Diff

```diff
--- a/src/lib/services/security.ts
+++ b/src/lib/services/security.ts
@@ -32,14 +32,23 @@
 export function isTimingTrapTriggered(
   formLoadedAt?: number,
   minDurationMs: number = 2000
 ): boolean {
   if (typeof formLoadedAt !== 'number' || isNaN(formLoadedAt) || formLoadedAt <= 0) {
     return true;
   }
 
   const now = Date.now();
   const elapsed = now - formLoadedAt;
 
-  // Triggered if submitted faster than minDurationMs or if timestamp is in future (> 5s skew)
-  return elapsed < minDurationMs || elapsed < -5000 || formLoadedAt > now + 5000;
+  // Max reasonable client clock skew tolerance (60 seconds)
+  const MAX_CLOCK_SKEW_MS = 60000;
+
+  // If timestamp is unreasonably far in the future (> 60s ahead of server time), flag as bot
+  if (formLoadedAt > now + MAX_CLOCK_SKEW_MS) {
+    return true;
+  }
+
+  // If elapsed time is positive, enforce minDurationMs. If negative but within clock skew window,
+  // allow submission to prevent false positives on slightly forward-drifted mobile devices.
+  if (elapsed >= 0 && elapsed < minDurationMs) {
+    return true;
+  }
+
+  return false;
 }
```

---

### [MAJOR] Finding D1-02: Form Submission Mutex Race Condition (Double-Submit Vulnerability)

- **File Path (Relative):** `src/components/forms/contact-form.tsx` and `src/components/forms/inquiry-form.tsx`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\components\forms\contact-form.tsx`, `c:\nooridigital_assets\my-projects\muscleworks\src\components\forms\inquiry-form.tsx`
- **Line Numbers:** `contact-form.tsx` Lines 69, 92–137, 391–406; `inquiry-form.tsx` Lines 80, 108–149, 447–462
- **Severity:** Major

#### Root Cause Analysis
Both `ContactForm` and `InquiryForm` rely exclusively on React Hook Form's `isSubmitting` flag to disable the `<Button type="submit">`. 

In React 19 / Next.js 16:
1. When a user double-clicks rapidly or spams the `Enter` key on a form field, multiple submit events can be fired before React batches and commits the `isSubmitting: true` state update to disable the DOM button.
2. Neither `onSubmit` handler contains an in-flight submission lock ref (`isSubmittingRef.current`).
3. As a result, two or three concurrent calls to `submitContactAction` or `submitInquiryAction` are sent to the server simultaneously.
4. Each concurrent request executes its own Telegram push notification and Resend email dispatch, generating duplicate alerts to store managers.
5. More critically, each duplicate request consumes an Upstash rate limit token (limit is 5 per hour), quickly blocking the user from submitting again.

#### Concrete Impact
Duplicate customer inquiry records in Telegram and admin email inboxes; customer rate-limit exhaustion from accidental double-clicks.

#### Exact Fix Diff (`src/components/forms/contact-form.tsx`)

```diff
--- a/src/components/forms/contact-form.tsx
+++ b/src/components/forms/contact-form.tsx
@@ -1,6 +1,6 @@
 'use client';
 
-import React, { useState, useEffect } from 'react';
+import React, { useState, useEffect, useRef } from 'react';
 import { useForm, useWatch } from 'react-hook-form';
 import { zodResolver } from '@hookform/resolvers/zod';
 import { toast } from 'sonner';
@@ -62,6 +62,7 @@
   const [customCity, setCustomCity] = useState('');
+  const isSubmittingLockRef = useRef(false);
 
   const {
     register,
@@ -92,6 +93,8 @@
   const onSubmit = async (values: InquiryFormClientValues) => {
+    if (isSubmittingLockRef.current) return;
+    isSubmittingLockRef.current = true;
     try {
       // Validate cross-field email requirement when 'email' contact method is chosen
       if (values.preferredContactMethod === 'email' && !values.email?.trim()) {
@@ -135,6 +138,8 @@
     } catch (err) {
       console.error('[ContactForm Submit Error]:', err);
       toast.error('An unexpected error occurred. Please call or message us on WhatsApp.');
+    } finally {
+      isSubmittingLockRef.current = false;
     }
   };
```

*(Identical lock ref applied to `src/components/forms/inquiry-form.tsx`)*

---

### [MAJOR] Finding D1-03: Search Bar & Modal Enter-Key Navigation Defect & Debounce Indicator Delay

- **File Path (Relative):** `src/components/catalog/search-bar.tsx` and `src/components/catalog/search-modal.tsx`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\components\catalog\search-bar.tsx`, `c:\nooridigital_assets\my-projects\muscleworks\src\components\catalog\search-modal.tsx`
- **Line Numbers:** `search-bar.tsx` Lines 36–76, 90–108; `search-modal.tsx` Lines 108–144, 178–185
- **Severity:** Major

#### Root Cause Analysis
1. In `SearchBar.tsx` (`handleKeyDown`, lines 90–108), the Enter key is only handled if `selectedIndex >= 0`:
   ```typescript
   } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
     e.preventDefault();
     const target = results[selectedIndex];
     addRecentSearch(query);
     if (onSelectResult) onSelectResult();
     router.push(`/products/${target.product.slug}`);
   }
   ```
   If a user types "creatine" and presses `Enter` without using arrow keys, `selectedIndex` is `-1`. Nothing happens! The expected behavior is navigating to `/products?search=creatine`.
2. In `SearchModal.tsx`, the search input has **no `onKeyDown` listener**. Pressing Enter does not trigger catalog search navigation.
3. In both `search-bar.tsx` (line 53) and `search-modal.tsx` (line 124), `setIsLoading(true)` is invoked *inside* the 150ms `setTimeout`. During the 150ms debounce window while the user is actively typing, `isLoading` remains `false`. The spinner only flashes after the debounce timer expires.
4. In `search-bar.tsx` (lines 40–45), when `query` is cleared (`!trimmed`), an unnecessary `setTimeout(..., 0)` is scheduled instead of resetting state synchronously.

#### Concrete Impact
Users pressing Enter on search inputs cannot submit search queries. The search UI feels unresponsive while typing because the spinner is not displayed during the debounce wait.

#### Exact Fix Diff (`src/components/catalog/search-bar.tsx`)

```diff
--- a/src/components/catalog/search-bar.tsx
+++ b/src/components/catalog/search-bar.tsx
@@ -37,18 +37,13 @@
     let cancelled = false;
     const trimmed = query.trim();
     if (!trimmed) {
-      const timer = setTimeout(() => {
-        if (cancelled) return;
-        setResults([]);
-        setIsLoading(false);
-        setIsOpen(false);
-      }, 0);
-      return () => {
-        cancelled = true;
-        clearTimeout(timer);
-      };
+      setResults([]);
+      setIsLoading(false);
+      setIsOpen(false);
+      return;
     }
 
+    setIsLoading(true);
     const timer = setTimeout(async () => {
-      setIsLoading(true);
       try {
         const searchRes = await searchProducts(trimmed, 6);
@@ -101,6 +96,12 @@
     } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
       e.preventDefault();
       const target = results[selectedIndex];
       addRecentSearch(query);
       if (onSelectResult) onSelectResult();
       router.push(`/products/${target.product.slug}`);
+    } else if (e.key === "Enter" && query.trim()) {
+      e.preventDefault();
+      addRecentSearch(query.trim());
+      setIsOpen(false);
+      if (onSelectResult) onSelectResult();
+      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
     }
   };
```

---

### [MAJOR] Finding D1-04: Concurrent Promise Race Condition in Search Index Initialization

- **File Path (Relative):** `src/lib/search.ts`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\lib\search.ts`
- **Line Numbers:** Lines 31–46, 94–96
- **Severity:** Major

#### Root Cause Analysis
In `src/lib/search.ts`:
```typescript
let fuseInstance: Fuse<SearchableProductItem> | null = null;
let searchableItemsCache: SearchableProductItem[] | null = null;

export async function getSearchIndex(): Promise<Fuse<SearchableProductItem>> {
  if (fuseInstance && searchableItemsCache) {
    return fuseInstance;
  }

  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ]);
  // ... maps items and creates new Fuse(searchableItemsCache, fuseOptions)
  fuseInstance = new Fuse(searchableItemsCache ?? [], fuseOptions);
  return fuseInstance;
}
```
When multiple components mount or multiple user keystrokes fire search queries concurrently before the first `Promise.all` resolves, `fuseInstance` is still `null`. Every in-flight call bypasses the guard check, executes redundant `Promise.all` data fetches, maps the entire catalog items array multiple times, and instantiates separate `Fuse` search index objects in memory.

#### Concrete Impact
Redundant heap allocations, duplicate index build computation, and possible GC churn during initial search initialization.

#### Exact Fix Diff

```diff
--- a/src/lib/search.ts
+++ b/src/lib/search.ts
@@ -31,14 +31,18 @@
 let fuseInstance: Fuse<SearchableProductItem> | null = null;
 let searchableItemsCache: SearchableProductItem[] | null = null;
+let fuseInitPromise: Promise<Fuse<SearchableProductItem>> | null = null;
 
 /**
  * Build or return the cached Fuse.js search index across products, brands, categories, flavors, and tags.
  */
 export async function getSearchIndex(): Promise<Fuse<SearchableProductItem>> {
   if (fuseInstance && searchableItemsCache) {
     return fuseInstance;
   }
 
+  if (fuseInitPromise) {
+    return fuseInitPromise;
+  }
+
+  fuseInitPromise = (async () => {
   const [products, brands, categories] = await Promise.all([
     getProducts(),
     getBrands(),
@@ -94,4 +98,7 @@
   fuseInstance = new Fuse(searchableItemsCache ?? [], fuseOptions);
   return fuseInstance;
+  })();
+
+  return fuseInitPromise;
 }
```

---

### [MAJOR] Finding D1-05: Canonical Store Hours & Delivery Threshold Data Inconsistencies

- **File Path (Relative):** `src/lib/constants.ts`, `src/components/layout/footer.tsx`, `src/components/layout/mobile-nav.tsx`, `data/store-info.json`, `src/lib/data/store.ts`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\lib\constants.ts`, `c:\nooridigital_assets\my-projects\muscleworks\data\store-info.json`
- **Line Numbers:** `constants.ts` Lines 48–84, 95; `footer.tsx` Lines 158–160; `data/store-info.json` Lines 23–74, 90
- **Severity:** Major

#### Root Cause Analysis
There is a direct data conflict between `src/lib/constants.ts` and the canonical dataset `data/store-info.json`:
1. `src/lib/constants.ts` defines:
   - `STORE_HOURS.weekdays`: `"Sunday – Friday: 10:00 AM – 8:00 PM"` (8:00 PM close).
   - `STORE_HOURS.closingTime`: `"20:00"`.
   - `isStoreOpenToday()`: checks `hour >= 10 && hour < 20` (8:00 PM close).
   - `DELIVERY_PROMISES.freeDeliveryThreshold`: `5000` (NPR 5,000).
2. However, the canonical `data/store-info.json`, `src/lib/data/store.ts`, `src/components/forms/contact-form.tsx` (line 385), and `src/emails/CustomerInquiryConfirmation.tsx` define:
   - `openingHours`: Sunday – Friday `10:00 AM – 09:00 PM` (`21:00`).
   - `freeDeliveryThresholdNpr`: `10000` (NPR 10,000).
3. Between 8:00 PM and 9:00 PM Nepal time, `footer.tsx` and `mobile-nav.tsx` state the store is closed, whereas `StoreHoursCard` on `/location` and `contact-form.tsx` state the store is open until 9:00 PM.

#### Concrete Impact
Customer confusion over closing time (8:00 PM vs 9:00 PM) and free delivery threshold (NPR 5,000 vs NPR 10,000), causing lost evening orders in Kathmandu.

#### Exact Fix Diff (`src/lib/constants.ts`)

```diff
--- a/src/lib/constants.ts
+++ b/src/lib/constants.ts
@@ -48,8 +48,8 @@
 // Operating Hours
 export const STORE_HOURS = {
-  weekdays: "Sunday – Friday: 10:00 AM – 8:00 PM",
+  weekdays: "Sunday – Friday: 10:00 AM – 9:00 PM",
   saturday: "Saturday: Contact for store hours / delivery",
-  displayShort: "Sun – Fri: 10AM – 8PM | Sat: Contact Required",
+  displayShort: "Sun – Fri: 10AM – 9PM | Sat: Contact Required",
   openingTime: "10:00",
-  closingTime: "20:00",
+  closingTime: "21:00",
 } as const;
@@ -79,3 +79,3 @@
-    // Sun - Fri: 10:00 AM (10) - 8:00 PM (20)
-    return hour >= 10 && hour < 20;
+    // Sun - Fri: 10:00 AM (10) - 9:00 PM (21)
+    return hour >= 10 && hour < 21;
   } catch {
@@ -92,3 +92,3 @@
-  freeDeliveryThreshold: 5000,
+  freeDeliveryThreshold: 10000,
   standardValleyRate: 150,
   standardNationwideRate: 250,
-  freeDeliveryText: "Free Kathmandu delivery on orders above NPR 5,000",
+  freeDeliveryText: "Free Kathmandu delivery on orders above NPR 10,000",
```

---

### [MINOR] Finding D1-06: Midnight `hourCycle: 'h23'` Ambiguity in `Intl.DateTimeFormat`

- **File Path (Relative):** `src/lib/data/store.ts`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\lib\data\store.ts`
- **Line Numbers:** Lines 126–135
- **Severity:** Minor

#### Root Cause Analysis
In `isStoreOpenNow()`:
```typescript
const kathmanduTimeParts = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Kathmandu',
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
}).formatToParts(now);
```
In JavaScript's `Intl.DateTimeFormat`, using `hour12: false` with the `en-US` locale can resolve to the `h24` hour cycle in certain JS engine implementations (e.g. older V8 or specific Safari/WebKit builds), formatting midnight as `"24"` instead of `"0"`. `parseInt("24", 10) * 60` calculates `1440` minutes past midnight instead of `0`.

#### Concrete Impact
Potential edge-case calculation bugs at exactly midnight (00:00–00:59) in Kathmandu.

#### Exact Fix Diff

```diff
--- a/src/lib/data/store.ts
+++ b/src/lib/data/store.ts
@@ -129,3 +129,3 @@
       hour: 'numeric',
       minute: 'numeric',
-      hour12: false,
+      hourCycle: 'h23',
     }).formatToParts(now);
```

---

### [MINOR] Finding D1-07: `StoreHoursCard` Empty State Hydration Layout Shift (CLS)

- **File Path (Relative):** `src/components/location/store-hours-card.tsx`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\components\location\store-hours-card.tsx`
- **Line Numbers:** Lines 21–29
- **Severity:** Minor

#### Root Cause Analysis
`StoreHoursCard` initializes `openingHours` to `[]` and only fetches `getOpeningHours()` inside `useEffect`. Because `getOpeningHours()` is a synchronous in-memory read wrapped in a Promise, the SSR HTML renders an empty schedule table with 0 height, and client-side JavaScript then renders 7 rows after mount. This creates a Cumulative Layout Shift (CLS).

#### Concrete Impact
Page layout shifts downwards on `/location` and contact pages upon hydration.

#### Exact Fix Diff

```diff
--- a/src/components/location/store-hours-card.tsx
+++ b/src/components/location/store-hours-card.tsx
@@ -10,8 +10,12 @@
 export interface StoreHoursCardProps {
   className?: string;
   compact?: boolean;
+  initialOpeningHours?: OpeningHourItem[];
+  initialContacts?: StoreContactMatrix | null;
 }
 
-export function StoreHoursCard({ className, compact = false }: StoreHoursCardProps) {
+export function StoreHoursCard({ className, compact = false, initialOpeningHours = [], initialContacts = null }: StoreHoursCardProps) {
   const [storeStatus, setStoreStatus] = useState<{
     isOpen: boolean;
     message: string;
   } | null>(null);
 
   const [currentKathmanduDay, setCurrentKathmanduDay] = useState<string>('');
-  const [openingHours, setOpeningHours] = useState<OpeningHourItem[]>([]);
-  const [contacts, setContacts] = useState<StoreContactMatrix | null>(null);
+  const [openingHours, setOpeningHours] = useState<OpeningHourItem[]>(initialOpeningHours);
+  const [contacts, setContacts] = useState<StoreContactMatrix | null>(initialContacts);
```

---

### [MINOR] Finding D1-08: In-Memory Rate Limiter Unbounded Memory Growth

- **File Path (Relative):** `src/lib/services/ratelimit.ts`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\lib\services\ratelimit.ts`
- **Line Numbers:** Lines 13, 125–163
- **Severity:** Minor

#### Root Cause Analysis
`const inMemoryCache = new Map<string, InMemoryLimitRecord>()` stores rate limit counts for development and testing. Records are only overwritten when the exact same IP key is requested after expiry. Keys from unique IPs or test scripts remain in the `Map` indefinitely without TTL eviction.

#### Concrete Impact
Memory footprint of the Node.js process grows over time in long-running development or CI test environments.

#### Exact Fix Diff

```diff
--- a/src/lib/services/ratelimit.ts
+++ b/src/lib/services/ratelimit.ts
@@ -131,5 +131,14 @@
   const windowMs = windowSeconds * 1000;
+  
+  // Periodic cleanup if cache size exceeds 1000 entries
+  if (inMemoryCache.size > 1000) {
+    for (const [key, val] of inMemoryCache.entries()) {
+      if (now > val.expiresAt) inMemoryCache.delete(key);
+    }
+  }
+
   const record = inMemoryCache.get(identifier);
```

---

### [OPTIMIZATION] Finding D1-09: Redundant Per-Request Upstash Redis Client Construction

- **File Path (Relative):** `src/lib/services/ratelimit.ts`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\lib\services\ratelimit.ts`
- **Line Numbers:** Lines 78–87
- **Severity:** Optimization

#### Root Cause Analysis
In `checkRateLimit`, `Redis.fromEnv()` and `new Ratelimit({...})` are instantiated on every function execution instead of being reused across serverless invocations.

#### Concrete Impact
Unnecessary object creation overhead and lost HTTP keep-alive connection pooling to Upstash Redis.

#### Exact Fix Diff

```diff
--- a/src/lib/services/ratelimit.ts
+++ b/src/lib/services/ratelimit.ts
@@ -14,2 +14,5 @@
 const inMemoryCache = new Map<string, InMemoryLimitRecord>();
+let cachedRedis: Redis | null = null;
+let cachedRatelimit: Ratelimit | null = null;
@@ -79,7 +82,10 @@
     try {
-      const redis = Redis.fromEnv();
-      const ratelimit = new Ratelimit({
-        redis,
-        limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
-        analytics: true,
-        prefix: `@muscleworks/ratelimit`,
-      });
+      if (!cachedRedis) cachedRedis = Redis.fromEnv();
+      if (!cachedRatelimit) {
+        cachedRatelimit = new Ratelimit({
+          redis: cachedRedis,
+          limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
+          analytics: true,
+          prefix: `@muscleworks/ratelimit`,
+        });
+      }
+      const ratelimit = cachedRatelimit;
```

---

### [MINOR] Finding D1-10: Deals Section Countdown Timer Client Drift in Background Tabs

- **File Path (Relative):** `src/components/home/deals-section.tsx`
- **File Path (Absolute):** `c:\nooridigital_assets\my-projects\muscleworks\src\components\home\deals-section.tsx`
- **Line Numbers:** Lines 71–95
- **Severity:** Minor

#### Root Cause Analysis
The countdown timer in `DealsSection` decrements its state counter on each 1-second `setInterval` tick (`prev.seconds - 1`). When the browser tab is minimized or placed in the background on mobile devices, browsers throttle `setInterval` executions to once per minute or pause them entirely. When the user returns to the tab, the timer has only advanced by the throttled number of ticks instead of real elapsed time.

#### Concrete Impact
The deals timer falls out of sync with real time when users switch tabs.

#### Exact Fix Diff

```diff
--- a/src/components/home/deals-section.tsx
+++ b/src/components/home/deals-section.tsx
@@ -70,26 +70,30 @@
 export function DealsSection() {
-  // Live dynamic countdown timer state (30 Days, 23 Hours, 58 Minutes, 50 Seconds baseline)
-  const [timeLeft, setTimeLeft] = useState({
-    days: 30,
-    hours: 23,
-    minutes: 58,
-    seconds: 50,
-  });
+  // Calculate remaining time against target epoch timestamp to prevent tab-throttling drift
+  const [targetTimestamp] = useState(() => Date.now() + (30 * 86400 + 23 * 3600 + 58 * 60 + 50) * 1000);
+  const [timeLeft, setTimeLeft] = useState({ days: 30, hours: 23, minutes: 58, seconds: 50 });
 
   useEffect(() => {
-    const timer = setInterval(() => {
-      setTimeLeft((prev) => {
-        if (prev.seconds > 0) {
-          return { ...prev, seconds: prev.seconds - 1 };
-        } else if (prev.minutes > 0) {
-          return { ...prev, minutes: 59, seconds: 59 };
-        } else if (prev.hours > 0) {
-          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
-        } else if (prev.days > 0) {
-          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
-        }
-        return prev;
-      });
-    }, 1000);
+    const updateTimer = () => {
+      const remainingMs = Math.max(0, targetTimestamp - Date.now());
+      const totalSecs = Math.floor(remainingMs / 1000);
+      const days = Math.floor(totalSecs / 86400);
+      const hours = Math.floor((totalSecs % 86400) / 3600);
+      const minutes = Math.floor((totalSecs % 3600) / 60);
+      const seconds = totalSecs % 60;
+      setTimeLeft({ days, hours, minutes, seconds });
+    };
+
+    updateTimer();
+    const timer = setInterval(updateTimer, 1000);
     return () => clearInterval(timer);
-  }, []);
+  }, [targetTimestamp]);
```

---

## Synthesis & Risk Assessment Summary

| Finding ID | Scope / Component | Severity | Primary Risk |
|:---|:---|:---:|:---|
| **D1-01** | `src/lib/services/security.ts` | **Critical** | Silent loss of valid customer inquiries due to device clock skew in Nepal |
| **D1-02** | `src/components/forms/*` | **Major** | Duplicate orders, duplicated notifications, and rate-limit lockouts |
| **D1-03** | `src/components/catalog/search-*` | **Major** | Broken Enter-key search submission & lag in typing loading indicators |
| **D1-04** | `src/lib/search.ts` | **Major** | Duplicate Fuse.js index construction across concurrent search calls |
| **D1-05** | `src/lib/constants.ts` vs datasets | **Major** | Conflicting store hours (8 PM vs 9 PM) causing lost evening sales |
| **D1-06** | `src/lib/data/store.ts` | **Minor** | Midnight `hourCycle: 'h23'` runtime ambiguity in `Intl.DateTimeFormat` |
| **D1-07** | `store-hours-card.tsx` | **Minor** | Cumulative Layout Shift (CLS) on initial load due to empty initial state |
| **D1-08** | `src/lib/services/ratelimit.ts` | **Minor** | Unbounded memory growth in dev/test sliding window cache |
| **D1-09** | `src/lib/services/ratelimit.ts` | **Optimization** | Redundant Redis client instantiations per rate limit check |
| **D1-10** | `src/components/home/deals-section.tsx` | **Minor** | Countdown timer drift when user switches away from browser tab |

---
