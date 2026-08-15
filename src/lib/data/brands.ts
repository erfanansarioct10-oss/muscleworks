import { BrandSchema, type Brand } from '@/lib/validations/product';
import brandsData from '@/data/brands.json';

/**
 * Validated in-memory cache of static authorized brand profiles
 */
const validatedBrands: Brand[] = BrandSchema.array().parse(brandsData);

/**
 * Get all authorized supplement brands.
 */
export async function getBrands(): Promise<Brand[]> {
  return [...validatedBrands];
}

/**
 * Get a single brand profile by its URL slug.
 */
export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  if (!slug) return null;
  const brand = validatedBrands.find((b) => b.slug === slug);
  return brand ?? null;
}

/**
 * Get a single brand profile by its unique ID.
 */
export async function getBrandById(id: string): Promise<Brand | null> {
  if (!id) return null;
  const brand = validatedBrands.find((b) => b.id === id);
  return brand ?? null;
}

/**
 * Get featured international brands for homepage showcases.
 */
export async function getFeaturedBrands(): Promise<Brand[]> {
  return validatedBrands.filter((b) => b.isFeatured);
}
