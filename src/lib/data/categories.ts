import { CategorySchema, type Category } from '@/lib/validations/product';
import categoriesData from '@/data/categories.json';

/**
 * Validated in-memory cache of static categories dataset
 */
const validatedCategories: Category[] = CategorySchema.array().parse(categoriesData);

/**
 * Get all supplement categories, sorted by displayOrder.
 */
export async function getCategories(): Promise<Category[]> {
  return [...validatedCategories].sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get a single category by its URL slug.
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!slug) return null;
  const category = validatedCategories.find((c) => c.slug === slug);
  return category ?? null;
}

/**
 * Get a single category by its unique ID.
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  if (!id) return null;
  const category = validatedCategories.find((c) => c.id === id);
  return category ?? null;
}

/**
 * Get featured categories for homepage showcases.
 */
export async function getFeaturedCategories(): Promise<Category[]> {
  return validatedCategories
    .filter((c) => c.isFeatured)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}
