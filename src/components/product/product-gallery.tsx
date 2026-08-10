'use client';

/**
 * MUSCLEWORKS SUPPLEMENTS — INTERACTIVE PRODUCT GALLERY & LIGHTBOX
 * Aspect-square featured image, authentic importer hologram seal overlay, thumbnail carousel,
 * and Radix Dialog full-screen zoom lightbox modal.
 */

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { AuthenticityMetadata } from '@/lib/validations/product';
import { ProductAuthenticityBadge } from '@/components/product/product-authenticity-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

export interface GalleryImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ProductGalleryProps {
  images: (GalleryImage | string)[];
  productName: string;
  authenticity?: AuthenticityMetadata;
  className?: string;
}

export function ProductGallery({
  images,
  productName,
  authenticity,
  className,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);

  // Normalize image objects
  const normalizedImages: GalleryImage[] = React.useMemo(() => {
    if (!images || images.length === 0) {
      return [
        {
          url: '/images/products/placeholder.webp',
          alt: productName,
        },
      ];
    }
    return images.map((img, idx) => {
      if (typeof img === 'string') {
        return { url: img, alt: `${productName} view ${idx + 1}` };
      }
      return {
        url: img.url,
        alt: img.alt || `${productName} view ${idx + 1}`,
        width: img.width,
        height: img.height,
      };
    });
  }, [images, productName]);

  const safeIndex = selectedIndex >= normalizedImages.length ? Math.max(0, normalizedImages.length - 1) : selectedIndex;
  const activeImage = normalizedImages[safeIndex] || normalizedImages[0];


  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => {
      const current = prev >= normalizedImages.length ? 0 : prev;
      return current === 0 ? normalizedImages.length - 1 : current - 1;
    });
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => {
      const current = prev >= normalizedImages.length ? 0 : prev;
      return current === normalizedImages.length - 1 ? 0 : current + 1;
    });
  };


  return (
    <div className={cn('space-y-4', className)}>
      {/* 1. Main Featured Image Container */}
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-900 shadow-lg dark:border-neutral-800">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || productName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          priority
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />

        {/* Top-Left Authentic Importer Hologram Seal Badge */}
        <div className="absolute left-3 top-3 z-10">
          <ProductAuthenticityBadge
            variant="compact"
            trustLabel={authenticity?.trustBadgeLabel || '100% Genuine Seal'}
            importerName={authenticity?.importerOrSource}
          />
        </div>

        {/* Top-Right Lightbox Zoom Trigger Button */}
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-neutral-950/70 text-amber-400 backdrop-blur-md transition-colors hover:bg-neutral-950 hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label="Open full-screen image zoom modal"
        >
          <ZoomIn className="h-5 w-5" />
        </button>

        {/* Hover Gradient Overlay Hint */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 cursor-pointer bg-black/0 transition-colors group-hover:bg-black/10"
          aria-hidden="true"
        />
      </div>

      {/* 2. Horizontal Thumbnail Navigation Carousel */}
      {normalizedImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {normalizedImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={`${img.url}-${idx}`}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  'relative h-20 w-20 min-h-[44px] min-w-[44px] shrink-0 overflow-hidden rounded-xl border bg-neutral-900 p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/50 dark:border-amber-400'
                    : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-700'
                )}
                aria-label={`Select product image ${idx + 1} of ${normalizedImages.length}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Full-Screen Accessible Lightbox Zoom Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl border-neutral-800 bg-neutral-950 p-4 text-white sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-amber-400 sm:text-lg">
              {productName} — Authentic Importer Inspection
            </DialogTitle>
          </DialogHeader>

          {/* Lightbox Main Image Preview */}
          <div className="relative flex aspect-square w-full max-h-[70vh] items-center justify-center overflow-hidden rounded-xl bg-neutral-900">
            <Image
              src={activeImage.url}
              alt={activeImage.alt || productName}
              fill
              sizes="(max-width: 1200px) 90vw, 1000px"
              className="object-contain p-2"
            />

            {/* Navigation Arrows */}
            {normalizedImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 flex h-12 w-12 min-h-[48px] min-w-[48px] items-center justify-center rounded-xl bg-black/60 text-white backdrop-blur-md transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                  aria-label="Next Image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image Counter Badge */}
            <div className="absolute bottom-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 backdrop-blur-md">
              {selectedIndex + 1} / {normalizedImages.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
