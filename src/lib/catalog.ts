import type { Product, Category, Brand } from '@/lib/validations/product';

export type CatalogSortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'newest';

export interface CatalogFilterOptions {
  category?: string;
  brand?: string;
  goal?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  inStock?: boolean | string;
  search?: string;
  sort?: CatalogSortOption | string;
}

/**
 * Get active default variant price for a product.
 * Returns discount price if present, otherwise standard NPR price.
 */
export function getProductActivePrice(product: Product): number {
  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariantId) ??
    product.variants[0];

  if (!defaultVariant) return 0;
  return defaultVariant.discountPriceNpr ?? defaultVariant.priceNpr;
}

/**
 * Check if a product is in stock (has at least one variant immediately available).
 * Excludes out_of_stock and pre_order variants.
 */
export function isProductInStock(product: Product): boolean {
  return product.variants.some(
    (v) => v.stockStatus === 'in_stock' || v.stockStatus === 'low_stock'
  );
}

/**
 * Map fitness goal IDs to matching keywords for tag/highlight matching.
 */
const GOAL_KEYWORDS: Record<string, string[]> = {
  'muscle-gain': ['protein', 'whey', 'mass', 'gainer', 'creatine', 'muscle', 'growth', 'hypertrophy'],
  'fat-loss': ['whey-isolate', 'iso', 'lean', 'fat-burner', 'l-carnitine', 'cut', 'zero-carb'],
  'strength-power': ['creatine', 'monohydrate', 'pre-workout', 'power', 'strength', 'c4'],
  'endurance-energy': ['pre-workout', 'bcaa', 'amino', 'xtend', 'energy', 'endurance', 'stamina'],
  'wellness-recovery': ['multivitamin', 'vitamins-health', 'fish-oil', 'omega', 'pak', 'recovery', 'health'],
};

/**
 * Pure helper function to filter and sort an array of products based on query criteria.
 */
export function filterAndSortProducts(
  products: Product[],
  options: CatalogFilterOptions,
  categories: Category[] = [],
  brands: Brand[] = []
): Product[] {
  let result = [...products];

  // 1. Category Filter (supports multi-select comma separated)
  if (options.category) {
    const rawCategories = options.category.split(',').map((c) => c.trim()).filter(Boolean);
    if (rawCategories.length > 0) {
      // Resolve category slugs to category IDs if needed
      const categoryIdSet = new Set<string>();
      rawCategories.forEach((item) => {
        categoryIdSet.add(item);
        const matched = categories.find((c) => c.slug === item || c.id === item);
        if (matched) {
          categoryIdSet.add(matched.id);
          categoryIdSet.add(matched.slug);
        }
      });

      result = result.filter((p) => categoryIdSet.has(p.categoryId));
    }
  }

  // 2. Brand Filter (supports multi-select comma separated)
  if (options.brand) {
    const rawBrands = options.brand.split(',').map((b) => b.trim()).filter(Boolean);
    if (rawBrands.length > 0) {
      const brandIdSet = new Set<string>();
      rawBrands.forEach((item) => {
        brandIdSet.add(item);
        const matched = brands.find((b) => b.slug === item || b.id === item);
        if (matched) {
          brandIdSet.add(matched.id);
          brandIdSet.add(matched.slug);
        }
      });

      result = result.filter((p) => brandIdSet.has(p.brandId));
    }
  }

  // 3. Fitness Goal Filter (supports multi-select comma separated)
  if (options.goal) {
    const activeGoals = options.goal.split(',').map((g) => g.trim()).filter(Boolean);
    if (activeGoals.length > 0) {
      const keywords = activeGoals.flatMap((g) => GOAL_KEYWORDS[g] ?? [g]);
      result = result.filter((p) => {
        const searchText = [
          p.name,
          p.categoryId,
          p.shortDescription,
          ...p.tags,
          ...p.highlights,
        ]
          .join(' ')
          .toLowerCase();

        return keywords.some((kw) => searchText.includes(kw.toLowerCase()));
      });
    }
  }

  // 4. Min Price Filter
  if (options.minPrice !== undefined && options.minPrice !== '') {
    const min = Number(options.minPrice);
    if (!isNaN(min) && min >= 0) {
      result = result.filter((p) => getProductActivePrice(p) >= min);
    }
  }

  // 5. Max Price Filter
  if (options.maxPrice !== undefined && options.maxPrice !== '') {
    const max = Number(options.maxPrice);
    if (!isNaN(max) && max > 0) {
      result = result.filter((p) => getProductActivePrice(p) <= max);
    }
  }

  // 6. In-Stock Only Filter
  const isInStockOnly =
    options.inStock === true || options.inStock === 'true';
  if (isInStockOnly) {
    result = result.filter((p) => isProductInStock(p));
  }

  // 7. Text Search Query Filter
  if (options.search && options.search.trim()) {
    const query = options.search.trim().toLowerCase();
    const queryTokens = query.split(/\s+/).filter(Boolean);

    result = result.filter((p) => {
      const brandObj = brands.find((b) => b.id === p.brandId);
      const brandName = brandObj ? brandObj.name.toLowerCase() : p.brandId.toLowerCase();
      const catObj = categories.find((c) => c.id === p.categoryId);
      const catName = catObj ? catObj.name.toLowerCase() : p.categoryId.toLowerCase();
      const flavors = p.variants.map((v) => v.flavor || '').join(' ').toLowerCase();

      const targetText = `${p.name} ${brandName} ${catName} ${flavors} ${p.shortDescription} ${p.tags.join(
        ' '
      )}`.toLowerCase();

      return (
        targetText.includes(query) ||
        queryTokens.every((token) => targetText.includes(token))
      );
    });
  }

  // 8. Sorting
  const sortOption = (options.sort as CatalogSortOption) || 'featured';

  result.sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return getProductActivePrice(a) - getProductActivePrice(b);
      case 'price-desc':
        return getProductActivePrice(b) - getProductActivePrice(a);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'newest': {
        // Sort by badge new_arrival or fallback to createdAt/id
        const aIsNew = a.badges.includes('new_arrival') ? 1 : 0;
        const bIsNew = b.badges.includes('new_arrival') ? 1 : 0;
        if (aIsNew !== bIsNew) return bIsNew - aIsNew;
        return (b.createdAt ?? b.id).localeCompare(a.createdAt ?? a.id);
      }
      case 'featured':
      default: {
        // Featured products first, then standard order
        const aFeatured = a.isFeatured ? 1 : 0;
        const bFeatured = b.isFeatured ? 1 : 0;
        if (aFeatured !== bFeatured) return bFeatured - aFeatured;
        return 0;
      }
    }
  });

  return result;
}
