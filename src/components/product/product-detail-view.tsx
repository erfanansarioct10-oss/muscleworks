'use client';

/**
 * MUSCLEWORKS SUPPLEMENTS — INTERACTIVE PRODUCT DETAIL VIEW CONTAINER
 * Client Component shell managing selected variant state, real-time price & gallery synchronization,
 * main hero WhatsApp conversion CTA, tabbed specifications, and mobile sticky action bar.
 */

import * as React from 'react';
import Link from 'next/link';
import { cn, formatNprPrice, calculateDiscountPercentage } from '@/lib/utils';
import type { Product, ProductVariant, Category, Brand } from '@/lib/validations/product';
import { buildProductWhatsAppUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductVariantSelector } from '@/components/product/product-variant-selector';
import { ProductStockStatus } from '@/components/product/product-stock-status';
import { ProductSpecs } from '@/components/product/product-specs';
import { AuthenticityGuaranteeBox } from '@/components/product/authenticity-guarantee-box';
import { ProductStickyBar } from '@/components/product/product-sticky-bar';
import {
  MessageSquare,
  ShieldCheck,
  Truck,
  MapPin,
  Clock,
} from 'lucide-react';

export interface ProductDetailViewProps {
  product: Product;
  category?: Category;
  brand?: Brand;
  relatedProductsChildren?: React.ReactNode;
  className?: string;
}

export function ProductDetailView({
  product,
  category,
  brand,
  relatedProductsChildren,
  className,
}: ProductDetailViewProps) {
  // Initial default variant resolution
  const defaultVariant =
    product.variants.find((v) => v.id === product.defaultVariantId) ||
    product.variants[0];

  const [selectedVariant, setSelectedVariant] =
    React.useState<ProductVariant>(defaultVariant);

  // Compute live price & discount
  const activePrice = selectedVariant.discountPriceNpr || selectedVariant.priceNpr;
  const originalPrice = selectedVariant.discountPriceNpr
    ? selectedVariant.priceNpr
    : undefined;
  const discountPercent = originalPrice
    ? calculateDiscountPercentage(originalPrice, selectedVariant.discountPriceNpr!)
    : 0;

  // Build live context-rich WhatsApp order URL
  const whatsappUrl = buildProductWhatsAppUrl({
    product,
    selectedVariant,
    brandName: brand?.name,
    customerCity: 'Kathmandu',
  });

  const handleWhatsAppClick = () => {
    trackWhatsAppClick({
      source: 'pdp_hero_cta',
      productName: product.name,
      brand: brand?.name,
      flavor: selectedVariant.flavor,
      size: selectedVariant.sizeOrWeight,
      price: activePrice,
    });
  };

  // Gallery images with variant image prioritization if present
  const galleryImages = React.useMemo(() => {
    if (selectedVariant.image?.url) {
      const existing = product.images.filter((img) => img.url !== selectedVariant.image?.url);
      return [
        { url: selectedVariant.image.url, alt: `${product.name} - ${selectedVariant.flavor}` },
        ...existing,
      ];
    }
    return product.images;
  }, [product.images, product.name, selectedVariant]);

  return (
    <div className={cn('min-h-screen bg-background text-foreground pb-20 md:pb-12', className)}>
      {/* Breadcrumb Header Bar */}
      <div className="border-b border-border bg-card/40 py-3.5 sm:py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/products">Catalog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {category && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={`/categories/${category.slug}`}>{category.name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="truncate max-w-[200px] sm:max-w-none">
                  {product.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery & Specs Tabs (7 Cols on Desktop) */}
          <div className="lg:col-span-7 space-y-8">
            <ProductGallery
              images={galleryImages}
              productName={product.name}
              authenticity={product.authenticity}
            />

            {/* Detailed Product Specifications & Nutrition Tabs */}
            <ProductSpecs product={product} />
          </div>

          {/* Right Column: Hero Details, Variant Selection & Conversion CTA (5 Cols on Desktop) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Brand & Category Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {brand && (
                <Link href={`/brands/${brand.slug}`}>
                  <Badge variant="outline" className="px-2.5 py-1 text-xs font-semibold hover:border-primary transition-colors">
                    {brand.name}
                  </Badge>
                </Link>
              )}
              {category && (
                <Link href={`/categories/${category.slug}`}>
                  <Badge variant="category" className="px-2.5 py-1 text-xs font-medium">
                    {category.name}
                  </Badge>
                </Link>
              )}
              <Badge variant="authentic" className="px-2.5 py-1 text-xs gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Importer Hologram Seal</span>
              </Badge>
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Price & Discount Section */}
            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Price in Nepal (NPR)
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {formatNprPrice(activePrice)}
                </span>
                {originalPrice && (
                  <span className="text-base sm:text-lg text-muted-foreground line-through">
                    {formatNprPrice(originalPrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <Badge variant="discount" className="text-xs font-bold bg-red-600 text-white border-0">
                    {discountPercent}% OFF
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground pt-1 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Free delivery inside Kathmandu Ringroad on orders above NPR 10,000</span>
              </p>
            </div>

            {/* Stock Availability Indicator */}
            <ProductStockStatus
              stockStatus={selectedVariant.stockStatus}
              inStockQuantity={selectedVariant.inStockQuantity}
            />

            {/* Interactive Flavor & Size Variant Selector */}
            <ProductVariantSelector
              variants={product.variants}
              selectedVariantId={selectedVariant.id}
              onVariantChange={setSelectedVariant}
            />

            {/* Primary WhatsApp Conversion CTA Button */}
            <div className="space-y-2 pt-2">
              <Button
                variant="whatsapp"
                size="xl"
                className="w-full min-h-12 sm:min-h-14 text-base font-bold shadow-lg gap-2.5"
                asChild
              >
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                >
                  <MessageSquare className="w-5 h-5 fill-current" />
                  <span>Order via WhatsApp ({formatNprPrice(activePrice)})</span>
                </a>
              </Button>

              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Golfutar, Kathmandu</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Same-Day Delivery</span>
                </span>
              </div>
            </div>

            {/* Authenticity Guarantee Callout Box */}
            <AuthenticityGuaranteeBox
              authenticity={product.authenticity}
              productName={product.name}
            />
          </div>
        </div>

        {/* Related Products Cross-Selling Engine */}
        {relatedProductsChildren}
      </div>

      {/* Fixed Mobile Bottom Action Bar */}
      <ProductStickyBar
        product={product}
        selectedVariant={selectedVariant}
        whatsappUrl={whatsappUrl}
      />
    </div>
  );
}
