import { ProductSchema, type Product } from '@/lib/validations/product';
import productsData from '@/data/products.json';
import { getCategories, getCategoryBySlug } from './categories';
import { getBrands, getBrandBySlug } from './brands';



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
  const found = validatedProducts.find((p) => p.slug === slug);
  return found ? { ...found } : null;
}

/**
 * Get a single product by its internal ID.
 */
export async function getProductById(id: string): Promise<Product | null> {
  const found = validatedProducts.find((p) => p.id === id);
  return found ? { ...found } : null;
}

/**
 * Get all featured products marked for homepage / promotional display.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  return validatedProducts.filter((p) => p.isFeatured);
}

/**
 * Get products pre-filtered by category ID or category slug.
 */
export async function getProductsByCategory(categorySlugOrId: string): Promise<Product[]> {
  const category = await getCategoryBySlug(categorySlugOrId);
  const targetId = category ? category.id : categorySlugOrId;
  return validatedProducts.filter((p) => p.categoryId === targetId);
}

/**
 * Get products pre-filtered by brand ID or brand slug.
 */
export async function getProductsByBrand(brandSlugOrId: string): Promise<Product[]> {
  const brand = await getBrandBySlug(brandSlugOrId);
  const targetId = brand ? brand.id : brandSlugOrId;
  return validatedProducts.filter((p) => p.brandId === targetId);
}

/**
 * Get related products for a PDP based on matching category or brand, excluding the current product.
 */
export async function getRelatedProducts(
  currentProductId: string,
  limit: number = 4
): Promise<Product[]> {
  const current = validatedProducts.find((p) => p.id === currentProductId);
  if (!current) return validatedProducts.slice(0, limit);

  const sameCategory = validatedProducts.filter(
    (p) => p.categoryId === current.categoryId && p.id !== currentProductId
  );

  const sameBrand = validatedProducts.filter(
    (p) => p.brandId === current.brandId && p.id !== currentProductId && !sameCategory.some((c) => c.id === p.id)
  );

  const combined = [...sameCategory, ...sameBrand];
  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  const remaining = validatedProducts.filter(
    (p) => p.id !== currentProductId && !combined.some((c) => c.id === p.id)
  );

  return [...combined, ...remaining].slice(0, limit);
}

/**
 * Perform basic in-memory fuzzy/substring search across product names, brands, categories, tags, and highlights.
 */
export async function searchProductsInMemory(query: string): Promise<Product[]> {
  if (!query || !query.trim()) return [...validatedProducts];

  const normalized = query.trim().toLowerCase();
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  return validatedProducts.filter((product) => {
    const brand = brands.find((b) => b.id === product.brandId);
    const category = categories.find((c) => c.id === product.categoryId);

    const nameMatch = product.name.toLowerCase().includes(normalized);
    const brandIdMatch = product.brandId.toLowerCase().includes(normalized);
    const brandNameMatch = brand?.name.toLowerCase().includes(normalized) ?? false;
    const catIdMatch = product.categoryId.toLowerCase().includes(normalized);
    const catNameMatch = category?.name.toLowerCase().includes(normalized) ?? false;
    const tagMatch = product.tags.some((tag) => tag.toLowerCase().includes(normalized));
    const highlightMatch = product.highlights.some((h) => h.toLowerCase().includes(normalized));
    const flavorMatch = product.variants.some((v) => v.flavor.toLowerCase().includes(normalized));

    return (
      nameMatch ||
      brandIdMatch ||
      brandNameMatch ||
      catIdMatch ||
      catNameMatch ||
      tagMatch ||
      highlightMatch ||
      flavorMatch
    );
  });
}

