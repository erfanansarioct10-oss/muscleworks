import { z } from 'zod';
import {
  FAQItemSchema,
  ImageAssetSchema,
  NprPriceSchema,
  SEOMetadataSchema,
} from './common';

/**
 * Variant Stock Inventory Status Enum
 */
export const StockStatusEnum = z.enum([
  'in_stock',
  'out_of_stock',
  'low_stock',
  'pre_order',
]);

export type StockStatus = z.infer<typeof StockStatusEnum>;

/**
 * Product Promotional & Trust Badges Enum
 */
export const ProductBadgeEnum = z.enum([
  'bestseller',
  'new_arrival',
  'trending',
  'featured',
  'authenticity_guaranteed',
  'limited_deal',
]);

export type ProductBadge = z.infer<typeof ProductBadgeEnum>;

/**
 * Nutrition Facts & Micro-Nutrient Item Schemas
 */
export const NutritionFactItemSchema = z.object({
  name: z.string().min(1, 'Nutrient name is required'),
  amountPerServing: z.string().min(1, 'Amount per serving is required'),
  dailyValuePercentage: z.string().optional(),
});

export type NutritionFactItem = z.infer<typeof NutritionFactItemSchema>;

export const NutritionFactsSchema = z.object({
  servingSize: z.string().min(1, 'Serving size is required'),
  servingsPerContainer: z.number().positive('Servings must be a positive number'),
  caloriesPerServing: z.number().nonnegative().optional(),
  proteinGrams: z.number().nonnegative().optional(),
  carbsGrams: z.number().nonnegative().optional(),
  fatGrams: z.number().nonnegative().optional(),
  bcaaGrams: z.number().nonnegative().optional(),
  items: z.array(NutritionFactItemSchema).default([]),
});

export type NutritionFacts = z.infer<typeof NutritionFactsSchema>;

/**
 * Authenticity Verification Metadata Schema
 */
export const AuthenticityMetadataSchema = z.object({
  isAuthenticGuarantee: z.boolean().default(true),
  importerOrSource: z.string().min(2).optional(),
  verificationMethod: z.string().min(5).optional(),
  hologramDescription: z.string().optional(),
  batchTestingNote: z.string().optional(),
  importerSealUrl: z.string().optional(),
  trustBadgeLabel: z.string().default('100% Genuine Importer Seal'),
});

export type AuthenticityMetadata = z.infer<typeof AuthenticityMetadataSchema>;

/**
 * Product Variant Schema (Flavors, Container Sizes & NPR Prices)
 */
export const ProductVariantSchema = z
  .object({
    id: z.string().min(1, 'Variant ID is required'),
    sku: z.string().regex(/^[A-Z0-9_-]{3,30}$/, 'Invalid SKU format'),
    sizeOrWeight: z.string().min(1, 'Size or weight is required'),
    flavor: z.string().default('Unflavored'),
    priceNpr: NprPriceSchema,
    discountPriceNpr: z.number().int().positive().optional(),
    stockStatus: StockStatusEnum.default('in_stock'),
    inStockQuantity: z.number().int().nonnegative().optional(),
    image: ImageAssetSchema.optional(),
  })
  .refine(
    (data) => !data.discountPriceNpr || data.discountPriceNpr < data.priceNpr,
    {
      message: 'Discount price must be strictly less than standard price',
      path: ['discountPriceNpr'],
    }
  );

export type ProductVariant = z.infer<typeof ProductVariantSchema>;

/**
 * Top-Level Product Schema
 */
export const ProductSchema = z
  .object({
    id: z.string().min(1, 'Product ID is required'),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid URL slug format (must be lowercase kebab-case)'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(120),
    brandId: z.string().min(1, 'Brand ID is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
    shortDescription: z.string().min(20, 'Short description must be at least 20 characters').max(300),
    fullDescription: z.string().min(50, 'Full description must be at least 50 characters'),
    highlights: z.array(z.string().min(3)).min(1, 'At least one product highlight is required').max(10),
    ingredients: z.string().min(5, 'Ingredients list is required'),
    directions: z.string().min(5, 'Usage directions are required'),
    nutritionFacts: NutritionFactsSchema,
    authenticity: AuthenticityMetadataSchema,
    images: z.array(ImageAssetSchema).min(1, 'At least one product image is required'),
    defaultVariantId: z.string().min(1, 'Default variant ID is required'),
    variants: z.array(ProductVariantSchema).min(1, 'Product must have at least one variant'),
    tags: z.array(z.string()).default([]),
    badges: z.array(ProductBadgeEnum).default([]),
    isFeatured: z.boolean().default(false),
    faqs: z.array(FAQItemSchema).default([]),
    seo: SEOMetadataSchema,
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  })
  .refine(
    (data) => data.variants.some((v) => v.id === data.defaultVariantId),
    {
      message: 'defaultVariantId must match an existing variant ID in the variants array',
      path: ['defaultVariantId'],
    }
  );

export type Product = z.infer<typeof ProductSchema>;

/**
 * Supplement Category Schema
 */
export const CategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid URL slug format (must be lowercase kebab-case)'),
  name: z.string().min(2).max(60),
  shortDescription: z.string().min(20).max(250),
  longDescription: z.string().min(50).optional(),
  icon: z.string().optional(),
  heroImage: ImageAssetSchema.optional(),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().nonnegative().default(0),
  faqs: z.array(FAQItemSchema).default([]),
  seo: SEOMetadataSchema,
});

export type Category = z.infer<typeof CategorySchema>;

/**
 * Supplement Brand Schema
 */
export const BrandSchema = z.object({
  id: z.string().min(1, 'Brand ID is required'),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid URL slug format (must be lowercase kebab-case)'),
  name: z.string().min(2).max(60),
  logo: ImageAssetSchema,
  countryOfOrigin: z.string().min(2),
  officialDistributorInfo: z.string().min(5),
  verificationGuide: z.string().min(10),
  description: z.string().min(30).max(1000),
  websiteUrl: z.string().url().optional(),
  isFeatured: z.boolean().default(false),
  seo: SEOMetadataSchema,
});

export type Brand = z.infer<typeof BrandSchema>;
