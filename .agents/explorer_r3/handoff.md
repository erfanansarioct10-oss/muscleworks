# Domain 3 (R3) Handoff Report: Security, Anti-Spam & Defensive Coding

## 1. Observation
- **Timing Trap & Clock Skew:**
  In `src/lib/services/security.ts:44`, `isTimingTrapTriggered` checks `elapsed < minDurationMs || elapsed < -5000 || formLoadedAt > now + 5000`.
  In `src/actions/inquiry.ts:50-53` and `src/actions/contact.ts:50-53`, triggering this returns `SILENT_SPAM_SUCCESS_RESPONSE`, dropping legitimate submissions from client devices whose clock is >5000ms ahead of the server clock without alert dispatch or database save.
- **Client IP Extraction:**
  In `src/lib/services/ratelimit.ts:23-29`, `getClientIp` reads `x-forwarded-for` and picks `ips[0]` before evaluating `x-real-ip` or `cf-connecting-ip`. On edge hosting (Vercel), `ips[0]` can be spoofed by an attacker supplying arbitrary `X-Forwarded-For` headers.
- **Security Headers & Proxy:**
  `src/proxy.ts` is absent despite being specified in `context/project-architecture.md#L20, L281-290` and `context/feature-roadmap.md#L657-668`. `next.config.ts` lacks security headers (`Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`).
- **In-Memory Rate Limiter:**
  In `src/lib/services/ratelimit.ts:13, 133-162`, `inMemoryCache` is an unbounded `Map<string, InMemoryLimitRecord>()` without periodic TTL cleanup or max-size limits.
- **HTML Sanitizer:**
  In `src/lib/services/security.ts:57`, `input.replace(/<[^>]*>/g, '')` strips text between `<` and `>` in a single non-recursive pass, corrupting valid strings like `<5kg whey and >30g protein` while failing on nested tags like `<<script>script>`.
- **Validation Pipeline Order:**
  In `src/actions/inquiry.ts:55-72` and `src/actions/contact.ts:55-72`, `checkRateLimit()` executes before `InquiryFormClientSchema.safeParse()`, consuming rate limit quota on syntax errors.
- **WhatsApp Link in Admin Alert:**
  In `src/emails/AdminInquiryAlert.tsx:47`, `phoneNumber.replace(/[^0-9]/g, '')` produces 10-digit numbers without Nepal's `977` prefix, breaking WhatsApp links.
- **Secret Isolation Verification:**
  Verified server secrets (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `UPSTASH_REDIS_REST_TOKEN`) are strictly confined to server-side code without `NEXT_PUBLIC_` prefixes.

## 2. Logic Chain
1. **Clock Skew False-Positive Data Loss:**
   - Client passes `_form_loaded_at: Date.now()` (client device time).
   - Server computes `now - formLoadedAt`.
   - If client clock is 6 seconds fast, `now - formLoadedAt = -6000ms < -5000ms`.
   - Result: `isTimingTrapTriggered` returns `true`.
   - Result: Action returns `SILENT_SPAM_SUCCESS_RESPONSE`.
   - Outcome: User sees success receipt, but no order is sent or logged. Lost revenue.
2. **IP Spoofing & Rate Limit Bypass:**
   - `getClientIp` takes `ips[0]` from `x-forwarded-for`.
   - Attacker injects `X-Forwarded-For: 10.0.0.1, 10.0.0.2...`.
   - Rate limiter creates key `ratelimit:inquiry:10.0.0.1`.
   - Outcome: 5 requests per hour limit is completely bypassed by rotating `X-Forwarded-For`.
3. **Missing Security Headers:**
   - Without `src/proxy.ts` or `next.config.ts` headers, responses omit `X-Frame-Options: DENY` and `Content-Security-Policy`.
   - Outcome: Website can be embedded in malicious iframes (clickjacking).
4. **Sanitizer Data Corruption:**
   - Regex `/<[^>]*>/g` interprets `<5kg whey and >` as an HTML tag.
   - Outcome: String is deleted, destroying legitimate customer inquiries.

## 3. Caveats
- Upstash Redis credentials (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`) are currently unset in local development, so testing relies on the in-memory fallback.
- Next.js 16 Proxy convention (`src/proxy.ts`) is designed for edge request gating; headers can also be configured natively in `next.config.ts#headers`.
- No active database persistence layer is currently implemented for inquiries; delivery relies 100% on Telegram and Resend email channels.

## 4. Conclusion
The MUSCLEWORKS security and defensive anti-spam architecture has solid foundations (isolated rate-limit buckets, honeypot fields, Telegram MarkdownV2 escaping, clean secret isolation), but contains **3 Major** and **5 Minor** issues that must be remediated:
1. Widen timing trap clock skew tolerance and avoid silent drops on fast/drifting device clocks.
2. Prioritize trusted reverse-proxy headers (`x-vercel-ip`, `cf-connecting-ip`, `x-real-ip`) in `getClientIp()`.
3. Implement `src/proxy.ts` and `next.config.ts` security headers.
4. Add LRU/max-entry bounding to the fallback rate-limiting cache.
5. Replace destructive regex tag stripping with HTML entity encoding.
6. Move Zod validation prior to rate-limit quota consumption.
7. Normalize phone numbers to include `977` country code in email WhatsApp buttons.
8. Support non-string honeypot payload detection.

## 5. Verification Method
1. Run `npx tsc --noEmit` to verify type safety across all files.
2. Execute validation test suites:
   - `npx tsx src/scripts/validate-security-ratelimit.ts`
   - `npx tsx src/scripts/validate-server-actions.ts`
3. Inspect `c:\nooridigital_assets\my-projects\muscleworks\.agents\explorer_r3\analysis.md` for full vulnerability descriptions, line numbers, impact, and copy-paste ready code diffs.
