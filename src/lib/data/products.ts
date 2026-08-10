import { ProductSchema, type Product } from '@/lib/validations/product';
import productsData from '@/data/products.json';
import { getCategoryBySlug } from './categories';
import { getBrandBySlug } from './brands';

/**
 * Validated in-memory cache of static products dataset
 */
const validatedProducts: Product[] = ProductSchema.array().parse(productsData);

/**
 * Get all active products from the static catalog dataset.
 */
export async function getProducts(): Promise<Product[]> {
  return [...validatedProducts];
}

/**
 * Get a single product by its URL slug.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;
  const product = validatedProducts.find((p) => p.slug === slug);
  return product ?? null;
}

/**
 * Get a single product by its unique ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) return null;
  const product = validatedProducts.find((p) => p.id === id);
  return product ?? null;
}

/**
 * Get featured products for homepage and promotional showcases.
 */
export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const featured = validatedProducts.filter((p) => p.isFeatured);
  return featured.slice(0, limit);
}

/**
 * Get products filtered by category ID or slug.
 */
export async function getProductsByCategory(categorySlugOrId: string): Promise<Product[]> {
  if (!categorySlugOrId) return [];

  // Direct ID match
  let matches = validatedProducts.filter((p) => p.categoryId === categorySlugOrId);

  // If no direct ID match, attempt matching by category slug
  if (matches.length === 0) {
    const category = await getCategoryBySlug(categorySlugOrId);
    if (category) {
      matches = validatedProducts.filter((p) => p.categoryId === category.id);
    }
  }

  return matches;
}

/**
 * Get products filtered by brand ID or slug.
 */
export async function getProductsByBrand(brandSlugOrId: string): Promise<Product[]> {
  if (!brandSlugOrId) return [];

  // Direct ID match
  let matches = validatedProducts.filter((p) => p.brandId === brandSlugOrId);

  // If no direct ID match, attempt matching by brand slug
  if (matches.length === 0) {
    const brand = await getBrandBySlug(brandSlugOrId);
    if (brand) {
      matches = validatedProducts.filter((p) => p.brandId === brand.id);
    }
  }

  return matches;
}

/**
 * Get related products for cross-sell recommendations on Product Detail Pages.
 * Excludes the current product and prioritizes products in the same category or brand.
 */
export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  if (!product) return [];

  const candidates = validatedProducts.filter(
    (p) => p.id !== product.id && p.slug !== product.slug
  );

  // Match same category first
  const sameCategory = candidates.filter((p) => p.categoryId === product.categoryId);

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // Combine same category and same brand, removing duplicates
  const sameBrand = candidates.filter((p) => p.brandId === product.brandId);
  const combined = Array.from(new Set([...sameCategory, ...sameBrand]));

  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  // Fill remainder with other candidates if necessary
  const remaining = candidates.filter((p) => !combined.includes(p));
  return [...combined, ...remaining].slice(0, limit);
}

/**
 * Perform basic in-memory fuzzy/substring search across product names, brands, categories, tags, and highlights.
 */
export async function searchProductsInMemory(query: string): Promise<Product[]> {
  if (!query || !query.trim()) return [];

  const normalized = query.trim().toLowerCase();

  return validatedProducts.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(normalized);
    const brandMatch = product.brandId.toLowerCase().includes(normalized);
    const catMatch = product.categoryId.toLowerCase().includes(normalized);
    const tagMatch = product.tags.some((tag) => tag.toLowerCase().includes(normalized));
    const highlightMatch = product.highlights.some((h) => h.toLowerCase().includes(normalized));
    const flavorMatch = product.variants.some((v) => v.flavor.toLowerCase().includes(normalized));

    return nameMatch || brandMatch || catMatch || tagMatch || highlightMatch || flavorMatch;
  });
}
