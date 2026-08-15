'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CatalogSortOption } from '@/lib/catalog';

export interface SortSelectProps {
  className?: string;
}

const SORT_OPTIONS: { value: CatalogSortOption; label: string }[] = [
  { value: 'featured', label: 'Featured & Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'newest', label: 'Newest Arrivals' },
];

export function SortSelect({ className }: SortSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rawSort = searchParams.get('sort');
  const currentSort: CatalogSortOption =
    SORT_OPTIONS.find((opt) => opt.value === rawSort)?.value ?? 'featured';

  const handleSortChange = React.useCallback(
    (newSort: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (newSort === 'featured') {
        params.delete('sort');
      } else {
        params.set('sort', newSort);
      }

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className={className}>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="h-11 min-h-[44px] w-full min-w-[180px] sm:w-[210px] bg-background border-border text-sm font-medium">
          <div className="flex items-center gap-2 text-muted-foreground mr-1">
            <ArrowUpDown className="h-4 w-4 text-primary shrink-0" />
            <span className="hidden sm:inline">Sort by:</span>
          </div>
          <SelectValue placeholder="Sort supplements" />
        </SelectTrigger>
        <SelectContent align="end">
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
