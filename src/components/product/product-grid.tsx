'use client';

import * as React from 'react';
import { PackageX, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/validations/product';
import { ProductCard } from './product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export interface ProductGridProps {
  products: Product[];
  brandsMap?: Record<string, string>;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onResetFilters?: () => void;
  className?: string;
  skeletonCount?: number;
}

/**
 * Skeleton Loader Grid representation while loading catalog items.
 */
export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6',
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-xl bg-neutral-900/60 border border-neutral-800 p-3.5 space-y-3"
        >
          <Skeleton className="aspect-square w-full rounded-lg bg-neutral-800/80" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-1/3 bg-neutral-800/80" />
            <Skeleton className="h-4 w-full bg-neutral-800/80" />
            <Skeleton className="h-3 w-1/2 bg-neutral-800/80" />
          </div>
          <div className="pt-2 border-t border-neutral-800/80 flex justify-between items-center">
            <Skeleton className="h-5 w-20 bg-neutral-800/80" />
            <Skeleton className="h-11 w-11 rounded-lg bg-neutral-800/80" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Fallback UI state displayed when search queries or facet filters yield zero products.
 */
export function ProductGridEmpty({
  title = 'No Supplements Found',
  message = 'We could not find any products matching your active filters. Try adjusting your search query or clear filters to view all products.',
  onReset,
  className,
}: {
  title?: string;
  message?: string;
  onReset?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-neutral-900/50 border border-neutral-800 min-h-[320px] space-y-4 my-6',
        className
      )}
    >
      <div className="p-4 rounded-full bg-neutral-800/60 border border-neutral-700 text-amber-400 shrink-0">
        <PackageX className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-wide">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          {message}
        </p>
      </div>

      {onReset && (
        <Button
          variant="gold"
          onClick={onReset}
          className="mt-2 min-h-11 min-w-11 sm:min-h-12 sm:min-w-12 text-xs sm:text-sm gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Active Filters</span>
        </Button>
      )}
    </div>
  );
}

export function ProductGrid({
  products,
  brandsMap,
  isLoading = false,
  emptyTitle,
  emptyMessage,
  onResetFilters,
  className,
  skeletonCount = 8,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={skeletonCount} className={className} />;
  }

  if (!products || products.length === 0) {
    return (
      <ProductGridEmpty
        title={emptyTitle}
        message={emptyMessage}
        onReset={onResetFilters}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6',
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          brandName={brandsMap?.[product.brandId]}
          priorityImage={index < 4}
        />
      ))}
    </div>
  );
}
