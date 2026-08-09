import { z } from 'zod';
import { NEPAL_PHONE_REGEX } from './common';

/**
 * Inquiry & Customer Communication Type Enum
 */
export const InquiryTypeEnum = z.enum([
  'general',
  'product_inquiry',
  'bulk_order',
  'delivery_status',
]);

export type InquiryType = z.infer<typeof InquiryTypeEnum>;

/**
 * Preferred Channel for Response
 */
export const PreferredContactMethodEnum = z.enum([
  'whatsapp',
  'phone',
  'email',
]);

export type PreferredContactMethod = z.infer<typeof PreferredContactMethodEnum>;

/**
 * Contextual Product Metadata Attached to Inquiry
 */
export const InquiryProductContextSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  productSlug: z.string().min(1),
  variantSku: z.string().optional(),
  variantLabel: z.string().optional(),
  priceNpr: z.number().int().positive().optional(),
});

export type InquiryProductContext = z.infer<typeof InquiryProductContextSchema>;

/**
 * Client-Side Inquiry Form Validation Schema (React Hook Form / Zod)
 * Includes anti-bot honeypot (`hp_field`) and submission timing trap (`_form_loaded_at`).
 */
export const InquiryFormClientSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name cannot exceed 80 characters'),
  phoneNumber: z
    .string()
    .trim()
    .regex(
      NEPAL_PHONE_REGEX,
      'Please enter a valid Nepal phone number (e.g. 98XXXXXXXX or +977 98XXXXXXXX)'
    ),
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  inquiryType: InquiryTypeEnum.default('general'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
  preferredContactMethod: PreferredContactMethodEnum.default('whatsapp'),
  deliveryCity: z.string().trim().max(60).optional(),
  productContext: InquiryProductContextSchema.optional(),
  hp_field: z.string().max(0, 'Bot submission detected').default(''),
  _form_loaded_at: z.number().int().positive(),
});

export type InquiryFormClientValues = z.infer<typeof InquiryFormClientSchema>;

/**
 * Server-Side Processing Payload Schema
 */
export const InquiryServerPayloadSchema = InquiryFormClientSchema.extend({
  clientIp: z.string().optional(),
  userAgent: z.string().optional(),
  submittedAt: z.string(),
});

export type InquiryServerPayload = z.infer<typeof InquiryServerPayloadSchema>;

/**
 * Standardized Server Action Envelope Result Schema
 */
export const ActionResultSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  fieldErrors: z.record(z.array(z.string())).optional(),
  data: z.unknown().optional(),
});
