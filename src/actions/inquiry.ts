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
  * Generates a unique, compact inquiry reference ID.
  * Format: `inq_<timestamp>_<random5>` (e.g. `inq_1723289400000_a8f9b`)
  */
function generateInquiryId(): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `inq_${timestamp}_${randomSuffix}`;
}

/**
  * Core Server Action for processing general lead inquiries, product consultations,
  * and WhatsApp order requests.
  *
  * Standard 7-Step Defensive Execution Pipeline:
  * 1. Honeypot Anti-Spam Check (`hp_field`)
  * 2. Timing Trap Duration Check (`_form_loaded_at` >= 2000ms)
  * 3. Upstash / In-Memory Rate Limit Verification (`ratelimit:inquiry`, 5 req / 60 min)
  * 4. Zod Schema Input Validation (`InquiryFormClientSchema`)
  * 5. HTML Input & String Payload Sanitization (`sanitizePayload`)
  * 6. Concurrent Multi-Channel Notification Dispatch (Telegram & Resend via `Promise.allSettled`)
  * 7. Standardized ActionResult Envelope Return
  */
export async function submitInquiryAction(
  values: InquiryFormClientValues
): Promise<ActionResult<{ inquiryId: string }>> {
  try {
    // 1. Honeypot Anti-Spam Trap
    if (isHoneypotTriggered(values?.hp_field)) {
      return SILENT_SPAM_SUCCESS_RESPONSE;
    }

    // 2. Submission Timing Trap Check (min 2000ms)
    if (isTimingTrapTriggered(values?._form_loaded_at)) {
      return SILENT_SPAM_SUCCESS_RESPONSE;
    }

    // 3. Upstash / In-Memory Rate Limiting Check
    const rateLimit = await checkRateLimit('inquiry', 5, 3600);
    if (!rateLimit.success) {
      return {
        success: false,
        error: 'Too many inquiry requests. Please wait a while before submitting again.',
      };
    }

    // 4. Zod Input Validation
    const parsed = InquiryFormClientSchema.safeParse(values);
    if (!parsed.success) {
      return {
        success: false,
        error: 'Validation failed. Please correct the highlighted errors.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    // 5. Input Payload Sanitization
    const sanitizedData = sanitizePayload(parsed.data);
    const inquiryId = generateInquiryId();
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

    // Log dispatch diagnostics on server if any channel failed
    if (telegramResult.status === 'rejected' || (telegramResult.status === 'fulfilled' && !telegramResult.value.success)) {
      const errReason = telegramResult.status === 'rejected' ? telegramResult.reason : telegramResult.value.error;
      console.warn(`[Inquiry Action Warning] Telegram dispatch issue for ${inquiryId}:`, errReason);
    }

    if (emailResult.status === 'rejected') {
      console.warn(`[Inquiry Action Warning] Email dispatch rejected for ${inquiryId}:`, emailResult.reason);
    } else if (emailResult.status === 'fulfilled' && emailResult.value.errors.length > 0) {
      console.warn(`[Inquiry Action Warning] Email dispatch errors for ${inquiryId}:`, emailResult.value.errors);
    }

    // 7. Standardized ActionResult Return Envelope
    return {
      success: true,
      message: 'Thank you! Your inquiry has been received. Our team will contact you shortly.',
      data: { inquiryId },
    };
  } catch (err) {
    console.error('[submitInquiryAction Exception]:', err);
    return {
      success: false,
      error: 'An unexpected server error occurred while processing your request. Please try again or contact us via WhatsApp.',
    };
  }
}
