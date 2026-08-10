'use client';

/**
 * MUSCLEWORKS SUPPLEMENTS — MOBILE STICKY ACTION BAR
 * Pinned bottom bar on mobile viewports (<768px / md:hidden) displaying real-time variant preview,
 * formatted NPR price, stock status, and full-width WhatsApp CTA button (≥48px touch height).
 */

import * as React from 'react';
import Image from 'next/image';
import { cn, formatNprPrice, calculateDiscountPercentage } from '@/lib/utils';
import type { Product, ProductVariant } from '@/lib/validations/product';
import { trackWhatsAppClick } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export interface ProductStickyBarProps {
  product: Product;
  selectedVariant: ProductVariant;
  whatsappUrl: string;
  className?: string;
}

/**
 * Resolves active price, original list price, and discount percentage for a variant.
 */
export function resolveVariantPricing(variant: ProductVariant) {
  const activePrice = variant.discountPriceNpr || variant.priceNpr;
  const originalPrice = variant.discountPriceNpr ? variant.priceNpr : undefined;
  const discountPercent = originalPrice
    ? calculateDiscountPercentage(originalPrice, variant.discountPriceNpr!)
    : 0;

  return { activePrice, originalPrice, discountPercent };
}

export function ProductStickyBar({
  product,
  selectedVariant,
  whatsappUrl,
  className,
}: ProductStickyBarProps) {
  const { activePrice, originalPrice, discountPercent } = resolveVariantPricing(selectedVariant);

  const thumbnail =
    selectedVariant.image?.url ||
    product.images[0]?.url ||
    '/images/products/placeholder.webp';

  const handleClick = () => {
    trackWhatsAppClick({
      source: 'pdp_sticky_bar',
      productName: product.name,
      flavor: selectedVariant.flavor,
      size: selectedVariant.sizeOrWeight,
      price: activePrice,
    });
  };

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur-md md:hidden',
        className
      )}
    >
      <div className="mx-auto flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Variant Price Summary */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={thumbnail}
              alt={product.name}
              fill
              sizes="44px"
              className="object-contain p-1"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-foreground truncate">
                {product.name}
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {selectedVariant.flavor} • {selectedVariant.sizeOrWeight}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-sm font-extrabold text-foreground tracking-tight">
                {formatNprPrice(activePrice)}
              </span>
              {originalPrice && (
                <span className="text-[10px] text-muted-foreground line-through">
                  {formatNprPrice(originalPrice)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: WhatsApp Conversion CTA Button (≥48px Touch Height) */}
        <div className="shrink-0">
          <Button
            variant="whatsapp"
            size="lg"
            className="min-h-12 px-4 shadow-sm text-xs sm:text-sm font-bold gap-2"
            asChild
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
            >
              <MessageSquare className="w-4 h-4 fill-current shrink-0" />
              <span>Order</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
