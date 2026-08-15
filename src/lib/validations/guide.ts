import { z } from 'zod';
import { FAQItemSchema, ImageAssetSchema, SEOMetadataSchema } from './common';

/**
 * Educational Guide Category Enum
 */
export const GuideCategoryEnum = z.enum([
  'buying_guide',
  'supplement_education',
  'authenticity_guide',
  'beginner_fitness',
  'nutrition_science',
]);

export type GuideCategory = z.infer<typeof GuideCategoryEnum>;

/**
 * Guide Author Schema
 */
export const GuideAuthorSchema = z.object({
  name: z.string().min(2, 'Author name must be at least 2 characters'),
  role: z.string().min(2, 'Author role is required'),
  avatar: z.string().optional(),
  bio: z.string().optional(),
});

export type GuideAuthor = z.infer<typeof GuideAuthorSchema>;

function isValidCalendarDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Educational Guide Frontmatter Schema
 */
export const GuideFrontmatterSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid URL slug format'),
  excerpt: z.string().min(30, 'Excerpt must be at least 30 characters').max(300),
  category: GuideCategoryEnum,
  coverImage: ImageAssetSchema,
  author: GuideAuthorSchema,
  publishedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(isValidCalendarDate, { message: 'Must be a valid calendar date (YYYY-MM-DD)' }),
  updatedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .refine(isValidCalendarDate, { message: 'Must be a valid calendar date (YYYY-MM-DD)' })
    .optional(),
  readingTimeMinutes: z.number().int().positive().default(5),
  isFeatured: z.boolean().default(false),
  relatedProductSlugs: z.array(z.string()).default([]),
  relatedCategorySlugs: z.array(z.string()).default([]),
  faqs: z.array(FAQItemSchema).default([]),
  seo: SEOMetadataSchema,
});

export type GuideFrontmatter = z.infer<typeof GuideFrontmatterSchema>;
