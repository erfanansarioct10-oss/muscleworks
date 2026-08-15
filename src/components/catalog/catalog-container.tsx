'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Product, Category, Brand } from '@/lib/validations/product';
import { filterAndSortProducts } from '@/lib/catalog';
import { CatalogFilters } from './catalog-filters';
import { MobileFilterDrawer } from './mobile-filter-drawer';
import { ActiveFilters } from './active-filters';
import { CategoryChips } from './category-chips';
import { SortSelect } from './sort-select';
import { ProductGrid } from '@/components/product/product-grid';

export interface CatalogContainerProps {
  initialProducts: Product[];
  categories: Category[];
  brands: Brand[];
}

export function CatalogContainer({
  initialProducts,
  categories,
  brands,
}: CatalogContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create brand ID -> brand name dictionary for ProductCard rendering
  const brandsMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    brands.forEach((b) => {
      map[b.id] = b.name;
    });
    return map;
  }, [brands]);

  // Extract filter parameters from URL
  const filterOptions = React.useMemo(() => {
    return {
      category: searchParams.get('category') ?? undefined,
      brand: searchParams.get('brand') ?? undefined,
      goal: searchParams.get('goal') ?? undefined,
      minPrice: searchParams.get('minPrice') ?? undefined,
      maxPrice: searchParams.get('maxPrice') ?? undefined,
      inStock: searchParams.get('inStock') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      sort: searchParams.get('sort') ?? 'featured',
    };
  }, [searchParams]);

  // Compute filtered and sorted product list
  const filteredProducts = React.useMemo(() => {
    return filterAndSortProducts(initialProducts, filterOptions, categories, brands);
  }, [initialProducts, filterOptions, categories, brands]);

  const handleResetFilters = React.useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  return (
    <div className="space-y-6">
      {/* Category Quick Navigation Chips */}
      <CategoryChips categories={categories} />

      {/* Toolbar: Counter, Mobile Filter Drawer Trigger & Sort Select */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-b border-border">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Drawer Button (Visible on < lg viewports) */}
          <div className="lg:hidden">
            <MobileFilterDrawer
              categories={categories}
              brands={brands}
              products={initialProducts}
              totalCount={filteredProducts.length}
            />
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground font-medium">
            Showing{' '}
            <span className="font-bold text-foreground">{filteredProducts.length}</span>{' '}
            {filteredProducts.length === 1 ? 'supplement' : 'supplements'}
          </div>
        </div>

        {/* Catalog Sort Select Dropdown */}
        <SortSelect />
      </div>

      {/* Active Filter Pills Bar */}
      <ActiveFilters categories={categories} brands={brands} />

      {/* Main Catalog 2-Column Desktop Layout */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        {/* Sticky Desktop Filter Sidebar (Visible on ≥ lg viewports) */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="sticky top-24">
            <CatalogFilters categories={categories} brands={brands} />
          </div>
        </aside>

        {/* Main Product Display Grid */}
        <main className="flex-1 min-w-0 w-full">
          <ProductGrid
            products={filteredProducts}
            brandsMap={brandsMap}
            onResetFilters={handleResetFilters}
            className="grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5"
          />
        </main>
      </div>
    </div>
  );
}
