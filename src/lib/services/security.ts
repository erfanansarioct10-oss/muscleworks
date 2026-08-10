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
 *
 * @param hpField The value of the hidden honeypot input field
 * @returns true if honeypot is triggered (non-empty string), false otherwise
 */
export function isHoneypotTriggered(hpField?: string): boolean {
  return typeof hpField === 'string' && hpField.trim().length > 0;
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

  // Triggered if submitted faster than minDurationMs or if timestamp is in future (> 5s skew)
  return elapsed < minDurationMs || elapsed < -5000 || formLoadedAt > now + 5000;
}

/**
 * Strips HTML tags, inline JavaScript schemes, and dangerous event handlers from a text string.
 *
 * @param input Raw text string from form submission
 * @returns Sanitized text string safe for Markdown and HTML rendering
 */
export function sanitizeTextInput(input: string): string {
  if (!input) return '';

  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
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
  hp_field?: string;
  _form_loaded_at?: number;
}): { isSpam: boolean; silentResponse?: ActionResult<{ inquiryId: string }> } {
  if (isHoneypotTriggered(payload.hp_field) || isTimingTrapTriggered(payload._form_loaded_at)) {
    return {
      isSpam: true,
      silentResponse: SILENT_SPAM_SUCCESS_RESPONSE,
    };
  }

  return { isSpam: false };
}
