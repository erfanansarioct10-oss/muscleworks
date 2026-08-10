'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Flame, AlertCircle } from 'lucide-react';
import { cn, formatNprPrice, calculateDiscountPercentage } from '@/lib/utils';
import { Product, ProductVariant } from '@/lib/validations/product';
import { ProductAuthenticityBadge } from './product-authenticity-badge';
import { Badge } from '@/components/ui/badge';

import { buildProductWhatsAppUrl } from '@/lib/whatsapp';

export interface ProductCardProps {
  product: Product;
  priorityImage?: boolean;
  className?: string;
  brandName?: string;
}

/**
 * Computes unique counts of flavors and container sizes across product variants.
 */
function getVariantSummary(variants: ProductVariant[]): string {
  if (!variants || variants.length === 0) return '';
  if (variants.length === 1) {
    const v = variants[0];
    return `${v.sizeOrWeight}${v.flavor !== 'Unflavored' ? ` • ${v.flavor}` : ''}`;
  }

  const flavors = new Set(variants.map((v) => v.flavor).filter(Boolean));
  const sizes = new Set(variants.map((v) => v.sizeOrWeight).filter(Boolean));

  const flavorText = flavors.size > 0 ? `${flavors.size} Flavor${flavors.size > 1 ? 's' : ''}` : '';
  const sizeText = sizes.size > 0 ? `${sizes.size} Size${sizes.size > 1 ? 's' : ''}` : '';

  if (flavorText && sizeText) return `${flavorText} • ${sizeText}`;
  return flavorText || sizeText || `${variants.length} Options`;
}

export function ProductCard({
  product,
  priorityImage = false,
  className,
  brandName,
}: ProductCardProps) {
  // Find default variant or fallback to first
  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariantId) ||
    product.variants[0];

  const mainImage = product.images[0] || {
    url: '/images/products/placeholder.jpg',
    alt: product.name,
  };

  const isDiscounted =
    !!defaultVariant?.discountPriceNpr &&
    defaultVariant.discountPriceNpr < defaultVariant.priceNpr;

  const currentPrice = defaultVariant?.discountPriceNpr || defaultVariant?.priceNpr || 0;
  const originalPrice = defaultVariant?.priceNpr;

  const discountPercent = isDiscounted
    ? calculateDiscountPercentage(originalPrice, currentPrice)
    : 0;

  const stockStatus = defaultVariant?.stockStatus || 'in_stock';
  const variantSummary = getVariantSummary(product.variants);
  const whatsappUrl = buildProductWhatsAppUrl({
    product,
    selectedVariant: defaultVariant,
    brandName,
  });

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-xl bg-neutral-900/80 border border-neutral-800/90 hover:border-amber-500/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-amber-500/5',
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-xl"
      >
        {/* Aspect-Square Image Container */}
        <div className="relative aspect-square w-full bg-neutral-950/60 overflow-hidden rounded-t-xl">
          <Image
            src={mainImage.url}
            alt={mainImage.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priorityImage}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />

          {/* Top-Left Badges Overlay */}
          <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start max-w-[70%]">
            {isDiscounted && (
              <Badge variant="discount" className="text-[10px] sm:text-xs font-extrabold px-2 py-0.5 shadow-md">
                {discountPercent}% OFF
              </Badge>
            )}
            {product.badges.includes('bestseller') && !isDiscounted && (
              <Badge variant="authentic" className="text-[10px] sm:text-xs font-bold px-2 py-0.5 shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>Bestseller</span>
              </Badge>
            )}
            {product.authenticity?.isAuthenticGuarantee && (
              <ProductAuthenticityBadge variant="compact" trustLabel="Genuine Importer" />
            )}
          </div>

          {/* Top-Right Stock Status Indicator */}
          <div className="absolute top-2 right-2 z-10">
            {stockStatus === 'in_stock' && (
              <span className="inline-flex items-center gap-1 bg-emerald-950/80 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                In Stock
              </span>
            )}
            {stockStatus === 'low_stock' && (
              <span className="inline-flex items-center gap-1 bg-amber-950/80 backdrop-blur-sm border border-amber-500/30 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                Low Stock
              </span>
            )}
            {stockStatus === 'out_of_stock' && (
              <span className="inline-flex items-center gap-1 bg-neutral-900/90 backdrop-blur-sm border border-neutral-700 text-neutral-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Card Body Information */}
        <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between gap-3">
          <div className="space-y-1.5">
            {/* Brand Name Tag */}
            {brandName && (
              <p className="text-[11px] font-bold tracking-wider text-amber-400/90 uppercase truncate">
                {brandName}
              </p>
            )}

            {/* Product Title */}
            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>

            {/* Variant Summary Pill */}
            {variantSummary && (
              <p className="text-[11px] text-neutral-400 font-medium truncate">
                {variantSummary}
              </p>
            )}
          </div>

          {/* Pricing Row */}
          <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-2 mt-auto">
            {/* Prices */}
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold text-amber-400 tracking-tight">
                {formatNprPrice(currentPrice)}
              </span>
              {isDiscounted && originalPrice && (
                <span className="text-[11px] text-neutral-500 line-through">
                  {formatNprPrice(originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Direct WhatsApp Quick-Order Trigger (Sibling to Link to avoid nested interactive elements) */}
      <button
        type="button"
        onClick={handleWhatsAppClick}
        title="Quick Order via WhatsApp"
        aria-label={`Order ${product.name} via WhatsApp`}
        className="absolute bottom-3.5 sm:bottom-4 right-3.5 sm:right-4 z-20 inline-flex items-center justify-center h-12 w-12 min-h-12 min-w-12 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 shrink-0"
      >
        <MessageCircle className="w-5 h-5 fill-white/10 text-white" />
      </button>
    </div>
  );
}
