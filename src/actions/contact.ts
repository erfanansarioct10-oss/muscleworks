'use server';

import {
  InquiryFormClientSchema,
  type InquiryFormClientValues,
} from '@/lib/validations/inquiry';
import type { ActionResult } from '@/types/actions';
import {
  isHoneypotTriggered,
  isTimingTrapTriggered,
  SILENT_SPAM_SUCCESS_RESPONSE,
  sanitizePayload,
} from '@/lib/services/security';
import { checkRateLimit } from '@/lib/services/ratelimit';
import { sendTelegramAlert, type TelegramInquiryAlertPayload } from '@/lib/services/telegram';
import { sendInquiryEmails, type InquiryEmailDispatchPayload } from '@/lib/services/resend';

/**
 * Generates a unique, compact contact inquiry reference ID.
 * Format: `inq_contact_<timestamp>_<random5>`
 */
function generateContactId(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `inq_contact_${timestamp}_${randomSuffix}`;
}

/**
 * Server Action specifically for Contact Page submissions.
 * Maintains an isolated rate limit bucket (`ratelimit:contact`, 5 req / 60 min).
 *
 * Standard 7-Step Defensive Execution Pipeline:
 * 1. Honeypot Anti-Spam Check (`hp_field`)
 * 2. Timing Trap Duration Check (`_form_loaded_at` >= 2000ms)
 * 3. Upstash / In-Memory Rate Limit Verification (`ratelimit:contact`, 5 req / 60 min)
 * 4. Zod Schema Input Validation (`InquiryFormClientSchema`)
 * 5. HTML Input & String Payload Sanitization (`sanitizePayload`)
 * 6. Concurrent Multi-Channel Notification Dispatch (Telegram & Resend via `Promise.allSettled`)
 * 7. Standardized ActionResult Envelope Return
 */
export async function submitContactAction(
  values: InquiryFormClientValues
): Promise<ActionResult<{ inquiryId: string }>> {
  try {
    // 1. Honeypot Anti-Spam Trap Check
    if (isHoneypotTriggered((values as Record<string, unknown>)?.hp_field)) {
      return SILENT_SPAM_SUCCESS_RESPONSE;
    }

    // 2. Submission Timing Trap Check (min 2000ms)
    if (isTimingTrapTriggered(values?._form_loaded_at)) {
      return SILENT_SPAM_SUCCESS_RESPONSE;
    }

    // 3. Zod Input Validation (Validate input syntax before consuming rate limit quota)
    const parsed = InquiryFormClientSchema.safeParse(values);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed. Please correct the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    // 4. Isolated Rate Limiting Check for Contact Form Scope ('contact')
    const rateLimit = await checkRateLimit('contact', 5, 3600);
    if (!rateLimit.success) {
      return {
        success: false,
        error: 'Too many contact messages sent. Please wait a while before sending another message.',
      };
    }

    // 5. Input Payload Sanitization
    const sanitizedData = sanitizePayload(parsed.data);
    const inquiryId = generateContactId();
    const submittedAt = new Date().toISOString();

    // Prepare Notification Dispatch Payloads
    const telegramPayload: TelegramInquiryAlertPayload = {
      inquiryId,
      fullName: sanitizedData.fullName,
      phoneNumber: sanitizedData.phoneNumber,
      email: sanitizedData.email || undefined,
      inquiryType: sanitizedData.inquiryType,
      message: sanitizedData.message,
      preferredContactMethod: sanitizedData.preferredContactMethod,
      deliveryCity: sanitizedData.deliveryCity,
      productContext: sanitizedData.productContext,
      submittedAt,
    };

    const emailPayload: InquiryEmailDispatchPayload = {
      inquiryId,
      fullName: sanitizedData.fullName,
      phoneNumber: sanitizedData.phoneNumber,
      email: sanitizedData.email || undefined,
      inquiryType: sanitizedData.inquiryType,
      message: sanitizedData.message,
      preferredContactMethod: sanitizedData.preferredContactMethod,
      deliveryCity: sanitizedData.deliveryCity,
      productContext: sanitizedData.productContext,
      submittedAt,
    };

    // 6. Concurrent Multi-Channel Dispatch (Best-Effort Delivery)
    const [telegramResult, emailResult] = await Promise.allSettled([
      sendTelegramAlert(telegramPayload),
      sendInquiryEmails(emailPayload),
    ]);

    const telegramSuccess =
      telegramResult.status === 'fulfilled' && telegramResult.value.success;
    const emailSuccess =
      emailResult.status === 'fulfilled' &&
      (emailResult.value.customerEmailSent || emailResult.value.adminEmailSent);

    // Log dispatch diagnostics on server if any channel failed
    if (!telegramSuccess) {
      const errReason =
        telegramResult.status === 'rejected'
          ? telegramResult.reason
          : telegramResult.value.error;
      console.warn(`[Contact Action Warning] Telegram dispatch issue for ${inquiryId}:`, errReason);
    }

    if (!emailSuccess) {
      if (emailResult.status === 'rejected') {
        console.warn(`[Contact Action Warning] Email dispatch rejected for ${inquiryId}:`, emailResult.reason);
      } else if (emailResult.status === 'fulfilled' && emailResult.value.errors.length > 0) {
        console.warn(`[Contact Action Warning] Email dispatch errors for ${inquiryId}:`, emailResult.value.errors);
      }
    }

    // If both notification channels failed, notify user to retry or call directly
    if (!telegramSuccess && !emailSuccess) {
      return {
        success: false,
        error:
          'We could not transmit your message at this moment due to a network delivery issue. Please try again or call us directly.',
      };
    }

    // 7. Standardized ActionResult Return Envelope
    return {
      success: true,
      message: 'Thank you! Your message has been sent to our Golfutar store team. We will get back to you shortly.',
      data: { inquiryId },
    };
  } catch (err) {
    console.error('[submitContactAction Exception]:', err);
    return {
      success: false,
      error: 'An unexpected server error occurred while processing your message. Please try again or call us directly.',
    };
  }
}
