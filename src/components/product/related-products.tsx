import React from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/validations/product';
import { getRelatedProducts } from '@/lib/data/products';
import { getBrands } from '@/lib/data/brands';
import { ProductGrid } from './product-grid';
import { Sparkles } from 'lucide-react';

interface RelatedProductsProps {
  currentProduct: Product;
  className?: string;
}

export async function RelatedProducts({ currentProduct, className }: RelatedProductsProps) {
  const [relatedProducts, brands] = await Promise.all([
    getRelatedProducts(currentProduct.id, 4),
    getBrands(),
  ]);

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  // Create brand ID -> name lookup map
  const brandsMap: Record<string, string> = {};
  for (const b of brands) {
    brandsMap[b.id] = b.name;
  }

  return (
    <section className={cn('space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800', className)}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Complete Your Fitness Stack</span>
        </div>
        <h2 className="font-heading text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
          Recommended Supplements
        </h2>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
          Authentic supplements commonly paired with {currentProduct.name} for maximum gains and recovery.
        </p>
      </div>

      <ProductGrid
        products={relatedProducts}
        brandsMap={brandsMap}
      />
    </section>
  );
}
