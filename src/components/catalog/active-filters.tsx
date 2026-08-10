'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { X, RotateCcw } from 'lucide-react';
import { cn, formatNprPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Category } from '@/lib/validations/product';
import type { Brand } from '@/lib/validations/product';

export interface ActiveFiltersProps {
  totalCount?: number;
  categories?: Category[];
  brands?: Brand[];
  className?: string;
}

export function ActiveFilters({
  totalCount,
  categories = [],
  brands = [],
  className,
}: ActiveFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Active query parameters
  const categoryParam = searchParams.get('category') ?? '';
  const brandParam = searchParams.get('brand') ?? '';
  const goalParam = searchParams.get('goal') ?? '';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const inStockParam = searchParams.get('inStock');
  const searchParam = searchParams.get('q') ?? searchParams.get('searchQuery') ?? '';

  const activeCategories = React.useMemo(
    () => (categoryParam ? categoryParam.split(',').filter(Boolean) : []),
    [categoryParam]
  );
  const activeBrands = React.useMemo(
    () => (brandParam ? brandParam.split(',').filter(Boolean) : []),
    [brandParam]
  );
  const activeGoals = React.useMemo(
    () => (goalParam ? goalParam.split(',').filter(Boolean) : []),
    [goalParam]
  );

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeBrands.length > 0 ||
    activeGoals.length > 0 ||
    !!minPriceParam ||
    !!maxPriceParam ||
    inStockParam === 'true' ||
    !!searchParam;

  // Helper function to remove a single filter parameter or value
  const removeFilter = React.useCallback(
    (key: string, valueToRemove?: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!valueToRemove) {
        params.delete(key);
      } else {
        const currentValues = (params.get(key) ?? '').split(',').filter(Boolean);
        const updated = currentValues.filter((val) => val !== valueToRemove);
        if (updated.length > 0) {
          params.set(key, updated.join(','));
        } else {
          params.delete(key);
        }
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Clear all active filters
  const handleClearAll = React.useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  // Helper map for Category and Brand names
  const categoryMap = React.useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((cat) => map.set(cat.slug, cat.name));
    return map;
  }, [categories]);

  const brandMap = React.useMemo(() => {
    const map = new Map<string, string>();
    brands.forEach((b) => {
      map.set(b.slug, b.name);
      map.set(b.id, b.name);
    });
    return map;
  }, [brands]);

  if (!hasActiveFilters && totalCount === undefined) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 py-3 border-b border-neutral-200',
        className
      )}
    >
      {/* Matching product count */}
      <div className="text-xs sm:text-sm font-medium text-neutral-600">
        {totalCount !== undefined ? (
          <span>
            Showing <strong className="text-neutral-900 font-semibold">{totalCount}</strong>{' '}
            {totalCount === 1 ? 'product' : 'products'}
          </span>
        ) : (
          <span>Active Filters</span>
        )}
      </div>

      {/* Active Filter Pills & Clear All */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Query Pill */}
          {searchParam && (
            <Badge
              variant="outline"
              className="bg-neutral-100 text-neutral-800 border-neutral-300 gap-1.5 pr-1 pl-2.5 py-1 text-xs font-normal"
            >
              <span>Search: &ldquo;{searchParam}&rdquo;</span>
              <button
                type="button"
                onClick={() => {
                  removeFilter('q');
                  removeFilter('searchQuery');
                }}
                className="inline-flex items-center justify-center min-h-[32px] min-w-[32px] sm:min-h-11 sm:min-w-11 rounded-full text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
                aria-label={`Remove search query ${searchParam}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          )}

          {/* Category Pills */}
          {activeCategories.map((catSlug) => {
            const displayName = categoryMap.get(catSlug) ?? catSlug;
            return (
              <Badge
                key={`cat-${catSlug}`}
                variant="outline"
                className="bg-neutral-100 text-neutral-800 border-neutral-300 gap-1.5 pr-1 pl-2.5 py-1 text-xs font-normal"
              >
                <span>Category: {displayName}</span>
                <button
                  type="button"
                  onClick={() => removeFilter('category', catSlug)}
                  className="inline-flex items-center justify-center min-h-[32px] min-w-[32px] sm:min-h-11 sm:min-w-11 rounded-full text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
                  aria-label={`Remove category filter ${displayName}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            );
          })}

          {/* Brand Pills */}
          {activeBrands.map((brandSlug) => {
            const displayName = brandMap.get(brandSlug) ?? brandSlug;
            return (
              <Badge
                key={`brand-${brandSlug}`}
                variant="outline"
                className="bg-neutral-100 text-neutral-800 border-neutral-300 gap-1.5 pr-1 pl-2.5 py-1 text-xs font-normal"
              >
                <span>Brand: {displayName}</span>
                <button
                  type="button"
                  onClick={() => removeFilter('brand', brandSlug)}
                  className="inline-flex items-center justify-center min-h-[32px] min-w-[32px] sm:min-h-11 sm:min-w-11 rounded-full text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
                  aria-label={`Remove brand filter ${displayName}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </Badge>
            );
          })}

          {/* Goal Pills */}
          {activeGoals.map((goal) => (
            <Badge
              key={`goal-${goal}`}
              variant="outline"
              className="bg-neutral-100 text-neutral-800 border-neutral-300 gap-1.5 pr-1 pl-2.5 py-1 text-xs font-normal"
            >
              <span className="capitalize">Goal: {goal.replace(/-/g, ' ')}</span>
              <button
                type="button"
                onClick={() => removeFilter('goal', goal)}
                className="inline-flex items-center justify-center min-h-[32px] min-w-[32px] sm:min-h-11 sm:min-w-11 rounded-full text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
                aria-label={`Remove goal filter ${goal}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}

          {/* Price Range Pill */}
          {(minPriceParam || maxPriceParam) && (
            <Badge
              variant="outline"
              className="bg-neutral-100 text-neutral-800 border-neutral-300 gap-1.5 pr-1 pl-2.5 py-1 text-xs font-normal"
            >
              <span>
                Price:{' '}
                {minPriceParam && maxPriceParam
                  ? `${formatNprPrice(Number(minPriceParam))} – ${formatNprPrice(Number(maxPriceParam))}`
                  : minPriceParam
                    ? `Over ${formatNprPrice(Number(minPriceParam))}`
                    : `Under ${formatNprPrice(Number(maxPriceParam))}`}
              </span>
              <button
                type="button"
                onClick={() => {
                  removeFilter('minPrice');
                  removeFilter('maxPrice');
                }}
                className="inline-flex items-center justify-center min-h-[32px] min-w-[32px] sm:min-h-11 sm:min-w-11 rounded-full text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
                aria-label="Remove price filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          )}

          {/* In Stock Only Pill */}
          {inStockParam === 'true' && (
            <Badge
              variant="outline"
              className="bg-neutral-100 text-neutral-800 border-neutral-300 gap-1.5 pr-1 pl-2.5 py-1 text-xs font-normal"
            >
              <span>In-Stock Only</span>
              <button
                type="button"
                onClick={() => removeFilter('inStock')}
                className="inline-flex items-center justify-center min-h-[32px] min-w-[32px] sm:min-h-11 sm:min-w-11 rounded-full text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
                aria-label="Remove in-stock filter"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          )}

          {/* Clear All Action */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-neutral-600 hover:text-neutral-900 h-8 px-2 min-h-11 gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Clear All</span>
          </Button>
        </div>
      )}
    </div>
  );
}
