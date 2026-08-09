import { z } from 'zod';

/**
 * Nepal Phone Number Validation Regex
 * Matches:
 * - GSM Mobile (Ncell/NTC): +977-98XXXXXXXX, 98XXXXXXXX, +977-97XXXXXXXX, 97XXXXXXXX
 * - Kathmandu Landline: 01-XXXXXXX, +977-01-XXXXXXX
 */
export const NEPAL_PHONE_REGEX = /^(?:\+977[- ]?)?(?:98\d{8}|97\d{8}|01[- ]?\d{6,7})$/;
export const NepalPhoneRegex = NEPAL_PHONE_REGEX;

/**
 * Common Price in NPR Schema
 * All prices must be positive integers denominated strictly in Nepalese Rupees (NPR).
 */
export const NprPriceSchema = z
  .number()
  .int('Price must be an integer in NPR')
  .positive('Price must be greater than zero');

/**
 * SEO & OpenGraph Meta Metadata Schema
 */
export const SEOMetadataSchema = z.object({
  metaTitle: z.string().min(10, 'Title must be at least 10 characters').max(70, 'Title cannot exceed 70 characters'),
  metaDescription: z.string().min(50, 'Description must be at least 50 characters').max(160, 'Description cannot exceed 160 characters'),
  keywords: z.array(z.string()).default([]),
  canonicalUrl: z.string().url('Invalid canonical URL').optional(),
  ogImage: z.string().optional(),
});

export type SEOMetadata = z.infer<typeof SEOMetadataSchema>;

/**
 * FAQ Item Schema
 */
export const FAQItemSchema = z.object({
  id: z.string().optional(),
  question: z.string().min(5, 'Question must be at least 5 characters').max(200),
  answer: z.string().min(10, 'Answer must be at least 10 characters').max(1000),
  category: z.string().optional(),
  priority: z.number().int().optional(),
});

export type FAQItem = z.infer<typeof FAQItemSchema>;

/**
 * Image Asset Schema for Responsive Media
 */
export const ImageAssetSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  alt: z.string().min(3, 'Image alt text must be at least 3 characters').max(150),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  isPrimary: z.boolean().default(false),
});

export type ImageAsset = z.infer<typeof ImageAssetSchema>;

/**
 * Generic Pagination & Sort Query Schema
 */
export const SortOrderEnum = z.enum([
  'featured',
  'price_asc',
  'price_desc',
  'name_asc',
  'name_desc',
  'newest',
]);

export type SortOrder = z.infer<typeof SortOrderEnum>;

export const PaginationQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(12),
  sort: SortOrderEnum.default('featured'),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
