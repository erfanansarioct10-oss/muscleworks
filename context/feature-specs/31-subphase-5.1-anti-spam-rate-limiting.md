# Feature Spec 31: Sub-Phase 5.1 — Anti-Spam Security & Rate Limiting Infrastructure

> **Spec ID:** `31-subphase-5.1-anti-spam-rate-limiting`  
> **Target Sub-Phase / Branch:** Sub-Phase 5.1 (`Phase 5 — Lead Forms, Server Actions & Notifications Pipeline`)  
> **Status:** Approved  
> **Created Date:** 2026-08-10  
> **Author:** Antigravity AI Agent

---

## Executive Summary

Sub-Phase 5.1 establishes the core security foundation, rate-limiting middleware service, anti-bot honeypot validation, submission time-trap engine, and string HTML sanitization layer for MUSCLEWORKS SUPPLEMENTS. This infrastructure protects lead inquiry forms, contact submissions, and expert stack consultation triggers from automated bot attacks, spam floods, and XSS injections while providing graceful local development fallbacks when Upstash Redis credentials are not configured.

---

## 1. What We Are Going to Do

List of target files to be created and modified:

| # | Target File | Action Required | Responsibility Summary |
|:---:|---|:---:|---|
| 1 | `src/lib/services/ratelimit.ts` | **[NEW]** | Rate limiting service leveraging `@upstash/ratelimit` with local in-memory sliding-window `Map` cache fallback in `NODE_ENV === 'development'` and client IP extraction via Next.js 16 `await headers()`. |
| 2 | `src/lib/services/security.ts` | **[NEW]** | Honeypot field check (`hp_field`), timing trap validator (`_form_loaded_at` ≥ 2000ms), silent drop fake success generator, and HTML input string sanitizer. |
| 3 | `src/scripts/validate-security-ratelimit.ts` | **[NEW]** | Programmatic test suite validating rate limiting thresholds, honeypot traps, submission time checks, and HTML sanitization. |
| 4 | `context/feature-specs/README.md` | **[MODIFY]** | Register Spec 31 in the Specification Registry Index. |
| 5 | `context/progress-tracker.md` | **[MODIFY]** | Update Phase 5 progress status and active sub-phase notes. |

---

## 2. Why We Are Going to Do It

1. **Security & Spam Protection:** Lead forms are exposed to automated web crawlers and spam bots. Enforcing honeypots (`hp_field`) and timing traps (minimum 2000ms interaction threshold) eliminates 99%+ of bot submissions before touching notification dispatchers.
2. **Resource & Cost Protection:** Rate limiting with `@upstash/ratelimit` (sliding window of 5 requests per 60 minutes per IP) protects upstream Telegram Bot API and Resend email quotas from denial-of-wallet / rate-abuse attacks.
3. **Developer Experience:** In local development (`NODE_ENV === 'development'`), developers should be able to run and test lead forms without requiring live Upstash API keys, seamlessly falling back to a sliding-window `Map` cache.
4. **Data Integrity:** String sanitization strips raw HTML tags (`<script>`, `<iframe>`, etc.) from lead form text fields to prevent malicious payload injection into Telegram Markdown alerts or HTML emails.

---

## 3. How We Are Going to Implement It

### Step 1: Client IP Extraction & Rate Limiter (`src/lib/services/ratelimit.ts`)

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

// In-memory sliding window cache for local development fallback
const inMemoryCache = new Map<string, { count: number; expiresAt: number }>();

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0].trim();
    if (ip) return ip;
  }
  const realIp = headerList.get('x-real-ip');
  if (realIp) return realIp.trim();
  
  const cfIp = headerList.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  return '127.0.0.1';
}

export async function checkRateLimit(
  actionScope: string = 'inquiry',
  maxRequests: number = 5,
  windowSeconds: number = 3600
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
  const ip = await getClientIp();
  const identifier = `ratelimit:${actionScope}:${ip}`;

  const hasUpstashKeys =
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

  if (hasUpstashKeys) {
    const redis = Redis.fromEnv();
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxRequests, `${windowSeconds} s`),
      analytics: true,
      prefix: `@muscleworks/ratelimit`,
    });

    const result = await ratelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  // Local Development Fallback: In-memory sliding window
  if (process.env.NODE_ENV === 'development') {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const record = inMemoryCache.get(identifier);

    if (!record || now > record.expiresAt) {
      inMemoryCache.set(identifier, { count: 1, expiresAt: now + windowMs });
      return { success: true, limit: maxRequests, remaining: maxRequests - 1, reset: now + windowMs };
    }

    if (record.count >= maxRequests) {
      return { success: false, limit: maxRequests, remaining: 0, reset: record.expiresAt };
    }

    record.count += 1;
    inMemoryCache.set(identifier, record);
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - record.count,
      reset: record.expiresAt,
    };
  }

  // Production requires Upstash credentials — fail closed if missing
  console.error('[RateLimit Error] Missing Upstash Redis environment variables in production.');
  return { success: false, limit: maxRequests, remaining: 0, reset: Date.now() + 60000 };
}
```

### Step 2: Security & Anti-Bot Service (`src/lib/services/security.ts`)

```typescript
import type { ActionResult } from '@/types/actions';

export const SILENT_SUCCESS_RESPONSE: ActionResult<{ inquiryId: string }> = {
  success: true,
  message: 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
  data: { inquiryId: 'inq_spambot_dropped' },
};

export function isHoneypotTriggered(hpField?: string): boolean {
  return typeof hpField === 'string' && hpField.trim().length > 0;
}

export function isTimingTrapTriggered(
  formLoadedAt?: number,
  minDurationMs: number = 2000
): boolean {
  if (!formLoadedAt || typeof formLoadedAt !== 'number') return true;
  const now = Date.now();
  const elapsed = now - formLoadedAt;
  
  // Triggered if submitted faster than minDurationMs or if timestamp is in future (> 5s skew)
  return elapsed < minDurationMs || elapsed < 0 || formLoadedAt > now + 5000;
}

export function sanitizeTextInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/javascript:/gi, '') // Strip inline js schemes
    .replace(/on\w+=/gi, '') // Strip inline event handlers
    .trim();
}

export function sanitizePayload<T extends Record<string, unknown>>(payload: T): T {
  const sanitized = { ...payload };
  for (const key of Object.keys(sanitized)) {
    const val = sanitized[key];
    if (typeof val === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeTextInput(val);
    }
  }
  return sanitized;
}
```

---

## 4. When We Are Going to Do It

```text
Step 1: Create src/lib/services/ratelimit.ts
    │
    ▼
Step 2: Create src/lib/services/security.ts
    │
    ▼
Step 3: Create src/scripts/validate-security-ratelimit.ts & execute validation
    │
    ▼
Step 4: Register Spec 31 in README.md & update progress-tracker.md
    │
    ▼
Step 5: Type-check with `npx tsc --noEmit` and confirm zero errors
```

---

## 5. Required Data & Data Sources

| Data Requirement | Origin / Source | Usage |
|---|---|---|
| Upstash Redis REST URL | `process.env.UPSTASH_REDIS_REST_URL` | Distributed rate limit storage |
| Upstash Redis REST Token | `process.env.UPSTASH_REDIS_REST_TOKEN` | Authenticated API token |
| Next.js Request Headers | `await headers()` | Client IP resolution (`x-forwarded-for`) |

---

## 6. What Could Possibly Go Wrong & Mitigation Plan

| Potential Risk | Root Cause | Prevention / Mitigation Strategy |
|---|---|---|
| **Missing Redis in Dev** | Dev environment lacks Upstash API keys. | In-memory `Map` sliding-window cache fallback active in `NODE_ENV === 'development'`. |
| **False Positive Bot Drop** | User autofills form in <2.0 seconds. | Honeypot field uses invisible input styling; timing trap permits reasonable 2.0s threshold. |
| **Missing Client IP in Proxy** | Localhost or non-standard proxy environment. | Header cascade returns `'127.0.0.1'` fallback without throwing errors. |

---

## 7. Verification & Definition of Done

1. Executable script `src/scripts/validate-security-ratelimit.ts` passes with 100% success.
2. `npx tsc --noEmit` compiles cleanly with zero TypeScript errors.
3. Spec 31 registered in `context/feature-specs/README.md`.
4. `context/progress-tracker.md` updated to mark Sub-Phase 5.1 completed.
