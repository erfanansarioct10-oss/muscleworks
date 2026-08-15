import type { ActionResult } from '@/types/actions';

/**
 * Standard silent success response returned when a bot / spam submission is detected.
 * Returning success prevents automated scripts from recognizing honeypot / timing traps.
 */
export const SILENT_SPAM_SUCCESS_RESPONSE: ActionResult<{ inquiryId: string }> = {
  success: true,
  message: 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
  data: { inquiryId: 'inq_spambot_dropped' },
};

/**
 * Checks if the honeypot field (`hp_field`) has been populated by a bot script.
 * Catches empty strings, undefined, null as valid human submissions, while flagging
 * non-empty strings, arrays, objects, numbers, and booleans as automated bot evasion attempts.
 *
 * @param hpField The value of the hidden honeypot input field
 * @returns true if honeypot is triggered, false otherwise
 */
export function isHoneypotTriggered(hpField?: unknown): boolean {
  if (hpField === undefined || hpField === null || hpField === '') {
    return false;
  }
  if (typeof hpField === 'string') {
    return hpField.trim().length > 0;
  }
  return true; // Any non-empty non-string value is suspicious/bot activity
}

/**
 * Checks if the submission timing trap was triggered.
 * Human interactions on lead form take at least 2000ms. Submissions faster than minDurationMs
 * or submitted with future timestamps (> 5000ms clock skew) are flagged as automated bot scripts.
 *
 * @param formLoadedAt Unix timestamp (ms) when the form was rendered on the client
 * @param minDurationMs Minimum duration in milliseconds (default: 2000ms)
 * @returns true if timing trap is triggered (fast or invalid submission), false otherwise
 */
export function isTimingTrapTriggered(
  formLoadedAt?: number,
  minDurationMs: number = 2000
): boolean {
  if (typeof formLoadedAt !== 'number' || isNaN(formLoadedAt) || formLoadedAt <= 0) {
    return true;
  }

  const now = Date.now();
  const elapsed = now - formLoadedAt;

  // Allow realistic client clock skew tolerance (up to 120 seconds into future)
  const MAX_CLOCK_SKEW_MS = 120000;
  if (formLoadedAt > now + MAX_CLOCK_SKEW_MS) {
    return true; // Extreme future timestamp indicates automated spambot
  }

  // If elapsed time is positive, enforce minDurationMs.
  // If negative but within the clock-skew window, allow submission to avoid dropping genuine leads.
  if (elapsed >= 0 && elapsed < minDurationMs) {
    return true;
  }

  return false;
}

/**
 * Strips HTML tags, inline JavaScript schemes, and dangerous event handlers from a text string.
 * Iteratively removes HTML tags to prevent tag evasion while preserving mathematical/comparison brackets (<5kg, >30g).
 *
 * @param input Raw text string from form submission
 * @returns Sanitized text string safe for Markdown and HTML rendering
 */
export function sanitizeTextInput(input: string): string {
  if (!input) return '';

  let sanitized = input;
  // Iteratively strip valid HTML tags (including nested evasion attempts)
  const htmlTagRegex = /<(?:\/?[a-zA-Z][a-zA-Z0-9]*(?:\s+[^>]*)?|\!--[\s\S]*?--)>/gi;
  while (htmlTagRegex.test(sanitized)) {
    sanitized = sanitized.replace(htmlTagRegex, '');
  }

  return sanitized
    .replace(/javascript:/gi, '') // Strip inline js schemes
    .replace(/data:/gi, '') // Strip data URIs
    .replace(/on\w+\s*=/gi, '') // Strip inline event handlers (e.g. onerror=, onload=)
    .trim();
}

/**
 * Recursively sanitizes all string properties within a form payload object.
 *
 * @param payload Object containing form key-value pairs
 * @returns New payload object with all string values sanitized
 */
export function sanitizePayload<T extends Record<string, unknown>>(payload: T): T {
  const sanitized = { ...payload };

  for (const key of Object.keys(sanitized)) {
    const val = sanitized[key];
    if (typeof val === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeTextInput(val);
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      (sanitized as Record<string, unknown>)[key] = sanitizePayload(
        val as Record<string, unknown>
      );
    }
  }

  return sanitized;
}

/**
 * Combined security check evaluating both honeypot and timing trap.
 *
 * @param payload Security payload containing hp_field and _form_loaded_at
 * @returns Object containing isSpam boolean and optional silent success response
 */
export function verifySecurityContext(payload: {
  hp_field?: unknown;
  _form_loaded_at?: unknown;
}): { isSpam: boolean; silentResponse?: ActionResult<{ inquiryId: string }> } {
  const formLoadedAt =
    typeof payload._form_loaded_at === 'number'
      ? payload._form_loaded_at
      : typeof payload._form_loaded_at === 'string'
        ? Number(payload._form_loaded_at)
        : undefined;

  if (isHoneypotTriggered(payload.hp_field) || isTimingTrapTriggered(formLoadedAt)) {
    return {
      isSpam: true,
      silentResponse: SILENT_SPAM_SUCCESS_RESPONSE,
    };
  }

  return { isSpam: false };
}
