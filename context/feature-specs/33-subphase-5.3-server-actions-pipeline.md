# Feature Spec 33: Sub-Phase 5.3 — Server Actions Pipeline (`src/actions/inquiry.ts`, `src/actions/contact.ts`)

> **Spec ID:** `33-subphase-5.3-server-actions-pipeline`  
> **Target Sub-Phase / Branch:** Sub-Phase 5.3 — Server Actions Pipeline  
> **Status:** Approved  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI  

---

## Executive Summary

Sub-Phase 5.3 delivers the defensive Next.js 16 Server Actions pipeline connecting client-side forms (`InquiryForm`, `ContactForm`, `ConsultationModal`) to our anti-spam security engine (`src/lib/services/security.ts`), Upstash / in-memory rate limiter (`src/lib/services/ratelimit.ts`), and multi-channel notification dispatchers (`src/lib/services/telegram.ts`, `src/lib/services/resend.ts`).

---

## 1. What We Are Going to Do

| # | Target File | Action Required | Responsibility Summary |
|---|---|---|---|
| 1 | `src/actions/inquiry.ts` | **[NEW]** | Implement `'use server'` `submitInquiryAction(values)` handler executing 7-step defensive security & dispatch pipeline with `ratelimit:inquiry` scope. |
| 2 | `src/actions/contact.ts` | **[NEW]** | Implement `'use server'` `submitContactAction(values)` handler executing 7-step defensive security & dispatch pipeline with `ratelimit:contact` scope. |
| 3 | `src/scripts/validate-server-actions.ts` | **[NEW]** | Programmatic test script validating standard submissions, honeypot drops, timing traps, Zod field errors, and scope-isolated rate limiting. |
| 4 | `context/feature-specs/33-subphase-5.3-server-actions-pipeline.md` | **[NEW]** | This feature specification document. |
| 5 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 33 in the specification registry table. |
| 6 | `context/progress-tracker.md` | **[MODIFY]** | Update active status to `[IN PROGRESS]` for 5.3 and log progress upon completion. |

---

## 2. Why We Are Doing This

1. **Defensive Anti-Spam Security:** Public lead forms in production are targets for automated spam bots. Enforcing honeypot traps (`hp_field`), submission duration minimums (≥ 2000ms), and HTML sanitization prevents spam without user friction (no CAPTCHA).
2. **Abuse Protection via Rate Limiting:** Sliding-window rate limiting (5 requests per 60 mins per IP) protects upstream Telegram Bot and Resend APIs from exhaustion. Isolated scopes (`ratelimit:inquiry` vs `ratelimit:contact`) ensure user form accessibility is not cross-contaminated.
3. **Resilient Notification Delivery:** Concurrent dispatch via `Promise.allSettled` ensures best-effort notification delivery to store managers and customers.

---

## 3. How We Are Going to Implement It

### 7-Step Defensive Server Action Pipeline

Both `submitInquiryAction` and `submitContactAction` invoke the canonical pipeline:

1. **Honeypot Trap Inspection:**
   ```ts
   if (isHoneypotTriggered(values.hp_field)) {
     return SILENT_SPAM_SUCCESS_RESPONSE;
   }
   ```
2. **Submission Timing Trap:**
   ```ts
   if (isTimingTrapTriggered(values._form_loaded_at)) {
     return SILENT_SPAM_SUCCESS_RESPONSE;
   }
   ```
3. **Rate Limiting Enforcement:**
   ```ts
   const rateLimit = await checkRateLimit(actionScope, 5, 3600);
   if (!rateLimit.success) {
     return {
       success: false,
       error: 'Too many requests. Please wait before submitting another inquiry.',
     };
   }
   ```
4. **Zod Input Schema Validation:**
   ```ts
   const parsed = InquiryFormClientSchema.safeParse(values);
   if (!parsed.success) {
     return {
       success: false,
       error: 'Please correct the highlighted errors.',
       fieldErrors: parsed.error.flatten().fieldErrors,
     };
   }
   ```
5. **Payload Sanitization:**
   ```ts
   const cleanValues = sanitizePayload(parsed.data);
   ```
6. **Concurrent Notification Dispatch:**
   ```ts
   const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
   
   const [telegramResult, emailResult] = await Promise.allSettled([
     sendTelegramAlert(telegramPayload),
     sendInquiryEmails(emailPayload),
   ]);
   ```
7. **Response Envelope:**
   ```ts
   return {
     success: true,
     message: 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
     data: { inquiryId },
   };
   ```

---

## 4. When We Are Going to Do It

```text
Step 1: Write Spec 33 & Register in README.md & progress-tracker.md
    │
    ▼
Step 2: Implement src/actions/inquiry.ts & src/actions/contact.ts
    │
    ▼
Step 3: Implement src/scripts/validate-server-actions.ts
    │
    ▼
Step 4: Execute Verification Gate (npx tsc --noEmit && npx tsx src/scripts/validate-server-actions.ts)
    │
    ▼
Step 5: Post-Flight Progress Synchronization
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Client Form Input | Client Form Payload (`InquiryFormClientValues`) | Validated by Zod, sanitized by `sanitizePayload` |
| Upstash Redis / Memory Rate Limit | `src/lib/services/ratelimit.ts` | Sliding window rate limit per IP |
| Anti-Spam Security Rules | `src/lib/services/security.ts` | Honeypot & timing trap inspection |
| Telegram Bot Alert | `src/lib/services/telegram.ts` | MarkdownV2 admin push notification |
| Resend Email Receipt | `src/lib/services/resend.ts` | Customer receipt & store admin alert |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Next.js 16 Header Context Missing** | Invoking `getClientIp()` outside Next.js request context in test scripts. | `getClientIp()` includes try/catch block returning `'127.0.0.1'` fallback. |
| **Notification Failure Blocks Submission** | External API network failure in Telegram/Resend. | `Promise.allSettled` ensures best-effort dispatch and non-blocking submission response. |
| **False Positive Spam Flagging** | Pre-rendered form cached with stale `_form_loaded_at`. | Form loaded timestamp populated on client component mount in Sub-Phase 5.4. |

---

## 7. Verification & Definition of Done

1. `npx tsc --noEmit` completes with 0 errors.
2. `npx tsx src/scripts/validate-server-actions.ts` runs 100% pass rate across all tests.
3. Sub-Phase 5.3 marked `[x]` in `context/progress-tracker.md` and `context/feature-roadmap.md`.
