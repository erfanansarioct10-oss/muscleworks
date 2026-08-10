import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { headers } from 'next/headers';

/**
 * In-memory sliding window cache record type for local development fallback
 */
interface InMemoryLimitRecord {
  count: number;
  expiresAt: number;
}

const inMemoryCache = new Map<string, InMemoryLimitRecord>();

/**
 * Helper to extract client IP address from Next.js request headers.
 * Resolves x-forwarded-for (first IP), x-real-ip, cf-connecting-ip, or defaults to 127.0.0.1.
 */
export async function getClientIp(): Promise<string> {
  try {
    const headerList = await headers();
    
    const forwardedFor = headerList.get('x-forwarded-for');
    if (forwardedFor) {
      const ips = forwardedFor.split(',').map((ip) => ip.trim());
      if (ips.length > 0 && ips[0]) {
        return ips[0];
      }
    }

    const realIp = headerList.get('x-real-ip');
    if (realIp && realIp.trim()) {
      return realIp.trim();
    }

    const cfIp = headerList.get('cf-connecting-ip');
    if (cfIp && cfIp.trim()) {
      return cfIp.trim();
    }
  } catch {
    // Called outside Next.js request scope (e.g. standalone scripts or test suite)
  }

  return '127.0.0.1';
}

/**
 * Result structure returned by checkRateLimit
 */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Core rate limiting function.
 * Uses @upstash/ratelimit with Redis in production or when Upstash credentials are present.
 * Falls back to an in-memory sliding-window Map cache in NODE_ENV === 'development'.
 *
 * @param actionScope Scope identifier for the rate limit (e.g. 'inquiry', 'contact', 'consultation')
 * @param maxRequests Maximum requests permitted within the window (default: 5)
 * @param windowSeconds Duration of the rate limit window in seconds (default: 3600 — 1 hour)
 */
export async function checkRateLimit(
  actionScope: string = 'inquiry',
  maxRequests: number = 5,
  windowSeconds: number = 3600
): Promise<RateLimitResult> {
  const ip = await getClientIp();
  const identifier = `ratelimit:${actionScope}:${ip}`;

  const hasUpstashKeys =
    Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
    Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

  if (hasUpstashKeys) {
    try {
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
    } catch (err) {
      console.error('[RateLimit Service Error] Upstash Redis call failed:', err);
      // In development, fall back to in-memory if Redis call fails
      if (process.env.NODE_ENV !== 'production') {
        return checkInMemoryRateLimit(identifier, maxRequests, windowSeconds);
      }
      return { success: false, limit: maxRequests, remaining: 0, reset: Date.now() + 60000 };
    }
  }

  // Local Development Fallback: In-memory sliding window
  if (process.env.NODE_ENV !== 'production') {
    return checkInMemoryRateLimit(identifier, maxRequests, windowSeconds);
  }

  // Production requires Upstash credentials — fail closed if missing
  console.error(
    '[RateLimit Error] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in production environment.'
  );
  return {
    success: false,
    limit: maxRequests,
    remaining: 0,
    reset: Date.now() + 60000,
  };
}

/**
 * In-memory sliding window rate-limiting algorithm for development/testing
 */
function checkInMemoryRateLimit(
  identifier: string,
  maxRequests: number,
  windowSeconds: number
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = inMemoryCache.get(identifier);

  if (!record || now > record.expiresAt) {
    const expiresAt = now + windowMs;
    inMemoryCache.set(identifier, { count: 1, expiresAt });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      reset: expiresAt,
    };
  }

  if (record.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      reset: record.expiresAt,
    };
  }

  record.count += 1;
  inMemoryCache.set(identifier, record);
  return {
    success: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - record.count),
    reset: record.expiresAt,
  };
}

/**
 * Helper to reset in-memory cache (primarily for unit tests and local reset)
 */
export function clearInMemoryRateLimitCache(): void {
  inMemoryCache.clear();
}
