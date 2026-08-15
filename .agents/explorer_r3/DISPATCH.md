# Dispatch Assignment: Domain 3 (R3) — Security, Anti-Spam & Defensive Coding

## Target Scope
Inspect the MUSCLEWORKS Next.js 16 codebase at `c:\nooridigital_assets\my-projects\muscleworks` for:
1. **Honeypot & Anti-Bot Protection**:
   - Check `hp_field` (or similar honeypot fields) across all forms and Server Actions.
   - Check autocomplete protection: `tabIndex={-1}`, `aria-hidden="true"`, off-screen CSS vs `display: none` (which might be ignored or autofilled by password managers/browsers).
   - Server-side rejection logic if honeypot is populated.
2. **Timing Trap Validation**:
   - Check form submission timestamp traps (e.g. 2000ms minimum submission duration).
   - Check if timestamp is client-supplied (spoofable) vs server-encrypted/signed, or if clock skew causes false positives.
   - Check if valid fast users (or automated password managers) are improperly blocked or if bots can bypass it.
3. **Rate Limiting & Memory Leaks**:
   - Check in-memory rate limiting structures (e.g. `Map` / token buckets).
   - Check for memory leaks (unbounded Maps without TTL/cleanup, growing on unique IPs).
   - Check client IP extraction: reliance on `x-forwarded-for` (spoofable without proper proxy/edge configuration vs `req.ip` / Vercel headers).
   - Multi-tenant / Serverless behavior: in-memory state resetting per lambda invocation vs Upstash Redis integration.
4. **Input Sanitization, Injection & Secret Exposure**:
   - Check for XSS vectors, `dangerouslySetInnerHTML`, unescaped user reflections in DOM or meta tags.
   - Check environment variable safety: ensuring no server secrets (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `UPSTASH_*`) are prefixed with `NEXT_PUBLIC_` or bundled in client JS.
   - Check CORS, CSP, security headers in `src/proxy.ts` or `next.config.ts`.

## 2026-08-15T03:07:26Z
Received dispatch from parent orchestrator for Domain 3 (R3) Security, Anti-Spam & Defensive Coding audit.
Executing full investigation of honeypot traps, timing traps, rate limiter memory leaks, IP extraction, input sanitization, XSS, secret exposure, and security headers.
