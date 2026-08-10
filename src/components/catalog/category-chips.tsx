'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/validations/product';

export interface CategoryChipsProps {
  categories: Category[];
  className?: string;
}

export function CategoryChips({ categories, className }: CategoryChipsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get active categories from URL search params (supports multi-select comma separated)
  const activeCategoryParam = searchParams.get('category') ?? '';
  const activeCategorySlugs = React.useMemo(() => {
    if (!activeCategoryParam) return [];
    return activeCategoryParam.split(',').filter(Boolean);
  }, [activeCategoryParam]);

  const isAllActive = activeCategorySlugs.length === 0;

  const handleSelectCategory = React.useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!slug) {
        // "All Products" clicked - clear category param
        params.delete('category');
      } else {
        // Toggle or set category
        if (activeCategorySlugs.includes(slug)) {
          const remaining = activeCategorySlugs.filter((s) => s !== slug);
          if (remaining.length > 0) {
            params.set('category', remaining.join(','));
          } else {
            params.delete('category');
          }
        } else {
          params.set('category', [...activeCategorySlugs, slug].join(','));
        }
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [searchParams, pathname, router, activeCategorySlugs]
  );

  return (
    <nav
      aria-label="Category Quick Filters"
      className={cn('w-full overflow-x-auto scrollbar-none py-1', className)}
    >
      <div className="flex items-center gap-2 min-w-max px-0.5">
        {/* All Products Chip */}
        <button
          type="button"
          onClick={() => handleSelectCategory(null)}
          className={cn(
            'inline-flex items-center justify-center rounded-full px-4 py-2 text-xs sm:text-sm font-medium tracking-wide transition-all min-h-11 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            isAllActive
              ? 'bg-neutral-900 text-white shadow-sm ring-1 ring-primary/50'
              : 'bg-silver text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
          )}
          aria-pressed={isAllActive}
        >
          All Categories
        </button>

        {/* Category Chips */}
        {categories.map((category) => {
          const isActive = activeCategorySlugs.includes(category.slug);
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelectCategory(category.slug)}
              className={cn(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-xs sm:text-sm font-medium tracking-wide transition-all min-h-11 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isActive
                  ? 'bg-neutral-900 text-white shadow-sm ring-1 ring-primary/50'
                  : 'bg-silver text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
              )}
              aria-pressed={isActive}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
