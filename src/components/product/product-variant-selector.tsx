'use client';

/**
 * MUSCLEWORKS SUPPLEMENTS — INTERACTIVE PRODUCT VARIANT SELECTOR
 * Flavor chips and Container Size/Weight option cards with real-time pricing and stock states.
 */

import * as React from 'react';
import { cn, formatNprPrice, calculateDiscountPercentage } from '@/lib/utils';
import type { ProductVariant } from '@/lib/validations/product';
import { Check } from 'lucide-react';

export interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string;
  onVariantChange: (variant: ProductVariant) => void;
  className?: string;
}

export function ProductVariantSelector({
  variants,
  selectedVariantId,
  onVariantChange,
  className,
}: ProductVariantSelectorProps) {
  // Active selected variant object
  const activeVariant =
    variants.find((v) => v.id === selectedVariantId) || variants[0];

  // Extract unique flavors & sizeOrWeights while preserving order
  const flavors = Array.from(new Set(variants.map((v) => v.flavor)));
  const sizes = Array.from(new Set(variants.map((v) => v.sizeOrWeight)));

  const handleFlavorSelect = (flavor: string) => {
    // Try to find a variant matching selected flavor + current size, else first variant with that flavor
    const match =
      variants.find(
        (v) => v.flavor === flavor && v.sizeOrWeight === activeVariant.sizeOrWeight
      ) || variants.find((v) => v.flavor === flavor);

    if (match) {
      onVariantChange(match);
    }
  };

  const handleSizeSelect = (sizeOrWeight: string) => {
    // Try to find a variant matching selected size + current flavor, else first variant with that size
    const match =
      variants.find(
        (v) => v.sizeOrWeight === sizeOrWeight && v.flavor === activeVariant.flavor
      ) || variants.find((v) => v.sizeOrWeight === sizeOrWeight);

    if (match) {
      onVariantChange(match);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 1. Flavor Selector Section */}
      {flavors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Flavor Option:
            </span>
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {activeVariant.flavor}
            </span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {flavors.map((flavor) => {
              const isSelected = flavor === activeVariant.flavor;
              const hasInStockVariant = variants.some(
                (v) => v.flavor === flavor && v.stockStatus === 'in_stock'
              );

              return (
                <button
                  key={flavor}
                  type="button"
                  onClick={() => handleFlavorSelect(flavor)}
                  className={cn(
                    'inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-semibold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-amber-700 shadow-sm dark:border-amber-500/80 dark:bg-amber-500/20 dark:text-amber-300'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-700',
                    !hasInStockVariant && 'opacity-60 line-through'
                  )}
                  aria-pressed={isSelected}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-amber-600 dark:text-amber-400" />}
                  <span>{flavor}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Container Size / Weight Selector Section */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">
              Container Size / Weight:
            </span>
            <span className="font-medium text-neutral-600 dark:text-neutral-400">
              {activeVariant.sizeOrWeight}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {sizes.map((size) => {
              const matchingVariant =
                variants.find(
                  (v) => v.sizeOrWeight === size && v.flavor === activeVariant.flavor
                ) || variants.find((v) => v.sizeOrWeight === size);

              if (!matchingVariant) return null;

              const isSelected = size === activeVariant.sizeOrWeight;
              const isOutOfStock = matchingVariant.stockStatus === 'out_of_stock';
              const discountPercent = matchingVariant.discountPriceNpr
                ? calculateDiscountPercentage(
                    matchingVariant.priceNpr,
                    matchingVariant.discountPriceNpr
                  )
                : 0;

              const activePrice = matchingVariant.discountPriceNpr || matchingVariant.priceNpr;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  disabled={isOutOfStock}
                  className={cn(
                    'relative flex min-h-[56px] flex-col items-start justify-center rounded-2xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-sm dark:border-amber-500/80 dark:bg-amber-500/15'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700',
                    isOutOfStock && 'cursor-not-allowed opacity-50'
                  )}
                  aria-pressed={isSelected}
                >
                  {/* Discount Badge Pill */}
                  {discountPercent > 0 && (
                    <span className="absolute -top-2 right-2 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      SAVE {discountPercent}%
                    </span>
                  )}

                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {size}
                    </span>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
                    )}
                  </div>

                  <div className="mt-1 flex items-baseline gap-1.5 text-xs">
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                      {formatNprPrice(activePrice)}
                    </span>
                    {matchingVariant.discountPriceNpr && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        {formatNprPrice(matchingVariant.priceNpr)}
                      </span>
                    )}
                  </div>

                  {isOutOfStock && (
                    <span className="mt-0.5 text-[10px] font-medium text-rose-500">
                      Out of Stock
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
