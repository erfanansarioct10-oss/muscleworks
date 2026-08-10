'use client';

import * as React from 'react';
import { Search, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Brand, Product } from '@/lib/validations/product';

export interface BrandFilterProps {
  brands: Brand[];
  products?: Product[];
  selectedBrandSlugs?: string[];
  onToggleBrand?: (slug: string) => void;
  className?: string;
}

// Shorthand helper for country of origin badge
function getCountryCode(countryOfOrigin: string): string {
  if (!countryOfOrigin) return '';
  if (countryOfOrigin.includes('USA') || countryOfOrigin.includes('United States')) return 'USA';
  if (countryOfOrigin.includes('UK') || countryOfOrigin.includes('United Kingdom')) return 'UK';
  if (countryOfOrigin.includes('EU') || countryOfOrigin.includes('Europe')) return 'EU';
  return countryOfOrigin.slice(0, 3).toUpperCase();
}

export function BrandFilter({
  brands,
  products = [],
  selectedBrandSlugs = [],
  onToggleBrand,
  className,
}: BrandFilterProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Calculate product counts per brand ID/slug
  const brandProductCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => {
      if (p.brandId) {
        counts.set(p.brandId, (counts.get(p.brandId) ?? 0) + 1);
      }
    });
    return counts;
  }, [products]);

  // Filter brand list based on searchQuery
  const filteredBrands = React.useMemo(() => {
    if (!searchQuery.trim()) return brands;
    const query = searchQuery.toLowerCase().trim();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.slug.toLowerCase().includes(query) ||
        b.countryOfOrigin.toLowerCase().includes(query)
    );
  }, [brands, searchQuery]);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Header with Title & Count */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Authorized Brands
        </h3>
        <span className="text-xs text-neutral-400 font-medium">
          {brands.length} {brands.length === 1 ? 'brand' : 'brands'}
        </span>
      </div>

      {/* Brand Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
        <Input
          type="text"
          placeholder="Search brand..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 pl-8 pr-8 text-xs bg-neutral-50 border-neutral-200 focus-visible:ring-gold-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center min-h-[28px] min-w-[28px] text-neutral-400 hover:text-neutral-700"
            aria-label="Clear brand search"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Brand Checkboxes List */}
      <div className="max-h-56 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
        {filteredBrands.length === 0 ? (
          <p className="text-xs text-neutral-400 py-3 text-center">No brands found matching &ldquo;{searchQuery}&rdquo;</p>
        ) : (
          filteredBrands.map((brand) => {
            const isChecked = selectedBrandSlugs.includes(brand.slug) || selectedBrandSlugs.includes(brand.id);
            const countryCode = getCountryCode(brand.countryOfOrigin);
            const count = brandProductCounts.get(brand.id) ?? brandProductCounts.get(brand.slug) ?? 0;

            return (
              <label
                key={brand.id}
                onClick={() => onToggleBrand?.(brand.slug)}
                className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
                      isChecked
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-300 bg-white group-hover:border-neutral-400'
                    )}
                  >
                    {isChecked && <Check className="h-3 w-3" />}
                  </div>
                  <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900 truncate">
                    {brand.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {countryCode && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 font-medium text-neutral-500 border-neutral-200 bg-neutral-50"
                    >
                      {countryCode}
                    </Badge>
                  )}
                  {count > 0 && (
                    <span className="text-[11px] font-medium text-neutral-400">
                      ({count})
                    </span>
                  )}
                </div>
              </label>
            );
          })
        )}
      </div>
    </div>
  );
}
