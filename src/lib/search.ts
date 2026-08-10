import Fuse, { type IFuseOptions } from 'fuse.js';
import { getProducts } from '@/lib/data/products';
import { getBrands } from '@/lib/data/brands';
import { getCategories } from '@/lib/data/categories';
import type { Product } from '@/lib/validations/product';

export interface SearchableProductItem {
  id: string;
  slug: string;
  name: string;
  brandId: string;
  brandName: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  flavorList: string[];
  tags: string[];
  highlights: string[];
  priceNpr: number;
  discountPriceNpr?: number;
  product: Product;
}

export interface SearchResult {
  product: Product;
  brandName: string;
  categoryName: string;
  score?: number;
}

let fuseInstance: Fuse<SearchableProductItem> | null = null;
let searchableItemsCache: SearchableProductItem[] | null = null;

/**
 * Build or return the cached Fuse.js search index across products, brands, categories, flavors, and tags.
 */
export async function getSearchIndex(): Promise<Fuse<SearchableProductItem>> {
  if (fuseInstance && searchableItemsCache) {
    return fuseInstance;
  }

  const [products, brands, categories] = await Promise.all([
    getProducts(),
    getBrands(),
    getCategories(),
  ]);

  const brandMap = new Map(brands.map((b) => [b.id, b.name]));
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  searchableItemsCache = products.map((product) => {
    const brandName = brandMap.get(product.brandId) ?? product.brandId;
    const categoryName = categoryMap.get(product.categoryId) ?? product.categoryId;
    const defaultVariant =
      product.variants.find((v) => v.id === product.defaultVariantId) ?? product.variants[0];

    const flavorList = Array.from(
      new Set(product.variants.map((v) => v.flavor).filter((f) => f && f !== 'Unflavored'))
    );

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      brandId: product.brandId,
      brandName,
      categoryId: product.categoryId,
      categoryName,
      shortDescription: product.shortDescription,
      flavorList,
      tags: product.tags,
      highlights: product.highlights,
      priceNpr: defaultVariant.priceNpr,
      discountPriceNpr: defaultVariant.discountPriceNpr,
      product,
    };
  });

  const fuseOptions: IFuseOptions<SearchableProductItem> = {
    includeScore: true,
    threshold: 0.3,
    minMatchCharLength: 2,
    ignoreLocation: true,
    keys: [
      { name: 'name', weight: 0.4 },
      { name: 'brandName', weight: 0.25 },
      { name: 'categoryName', weight: 0.2 },
      { name: 'flavorList', weight: 0.1 },
      { name: 'tags', weight: 0.05 },
      { name: 'highlights', weight: 0.05 },
    ],
  };

  fuseInstance = new Fuse(searchableItemsCache, fuseOptions);
  return fuseInstance;
}

/**
 * Execute fuzzy search query against the in-memory supplement catalog dataset.
 */
export async function searchProducts(
  query: string,
  limit = 8
): Promise<SearchResult[]> {
  if (!query || !query.trim()) return [];

  const fuse = await getSearchIndex();
  const rawResults = fuse.search(query.trim(), { limit });

  return rawResults.map((res) => ({
    product: res.item.product,
    brandName: res.item.brandName,
    categoryName: res.item.categoryName,
    score: res.score,
  }));
}

/* LocalStorage Recent Search Terms Utilities */
const RECENT_SEARCHES_KEY = 'MW_RECENT_SEARCHES';
const MAX_RECENT_SEARCHES = 5;

/**
 * Get saved recent search queries from localStorage (SSR-safe).
 */
export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

/**
 * Add a query term to recent searches list in localStorage.
 */
export function addRecentSearch(query: string): string[] {
  if (typeof window === 'undefined') return [];
  const clean = query.trim();
  if (!clean || clean.length < 2) return getRecentSearches();

  try {
    const existing = getRecentSearches();
    const filtered = existing.filter((item) => item.toLowerCase() !== clean.toLowerCase());
    const updated = [clean, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Clear all saved recent search history.
 */
export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    // Ignore errors
  }
}
