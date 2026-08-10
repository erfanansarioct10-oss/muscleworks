'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { BrandFilter } from '@/components/catalog/brand-filter';
import type { Category, Brand, Product } from '@/lib/validations/product';

export interface MobileFilterDrawerProps {
  categories: Category[];
  brands: Brand[];
  products?: Product[];
  totalCount?: number;
  className?: string;
}

const FITNESS_GOALS = [
  { id: 'muscle-gain', name: 'Muscle Gain & Growth' },
  { id: 'fat-loss', name: 'Fat Loss & Lean Muscle' },
  { id: 'strength-power', name: 'Strength & Explosive Power' },
  { id: 'endurance-energy', name: 'Endurance & Energy' },
  { id: 'wellness-recovery', name: 'Daily Health & Recovery' },
];

const PRESET_PRICE_RANGES = [
  { label: 'Under 5k', min: undefined, max: 5000 },
  { label: '5k – 10k', min: 5000, max: 10000 },
  { label: '10k – 20k', min: 10000, max: 20000 },
  { label: 'Above 20k', min: 20000, max: undefined },
];

export function MobileFilterDrawer({
  categories,
  brands,
  products = [],
  totalCount,
  className,
}: MobileFilterDrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = React.useState(false);

  // Read active filters from URL
  const activeCategoryParam = searchParams.get('category') ?? '';
  const activeBrandParam = searchParams.get('brand') ?? '';
  const activeGoalParam = searchParams.get('goal') ?? '';
  const activeMinPrice = searchParams.get('minPrice') ?? '';
  const activeMaxPrice = searchParams.get('maxPrice') ?? '';
  const activeInStock = searchParams.get('inStock') === 'true';

  const activeCategoryList = React.useMemo(
    () => (activeCategoryParam ? activeCategoryParam.split(',').filter(Boolean) : []),
    [activeCategoryParam]
  );
  const activeBrandList = React.useMemo(
    () => (activeBrandParam ? activeBrandParam.split(',').filter(Boolean) : []),
    [activeBrandParam]
  );
  const activeGoalList = React.useMemo(
    () => (activeGoalParam ? activeGoalParam.split(',').filter(Boolean) : []),
    [activeGoalParam]
  );

  const activeFilterCount =
    activeCategoryList.length +
    activeBrandList.length +
    activeGoalList.length +
    (activeMinPrice ? 1 : 0) +
    (activeMaxPrice ? 1 : 0) +
    (activeInStock ? 1 : 0);

  // Staged local filter state for the drawer
  const [stagedCategories, setStagedCategories] = React.useState<string[]>(activeCategoryList);
  const [stagedBrands, setStagedBrands] = React.useState<string[]>(activeBrandList);
  const [stagedGoals, setStagedGoals] = React.useState<string[]>(activeGoalList);
  const [stagedMinPrice, setStagedMinPrice] = React.useState<string>(activeMinPrice);
  const [stagedMaxPrice, setStagedMaxPrice] = React.useState<string>(activeMaxPrice);
  const [stagedInStock, setStagedInStock] = React.useState<boolean>(activeInStock);

  // Re-sync staged state whenever drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setStagedCategories(activeCategoryList);
      setStagedBrands(activeBrandList);
      setStagedGoals(activeGoalList);
      setStagedMinPrice(activeMinPrice);
      setStagedMaxPrice(activeMaxPrice);
      setStagedInStock(activeInStock);
    }
  }, [
    isOpen,
    activeCategoryList,
    activeBrandList,
    activeGoalList,
    activeMinPrice,
    activeMaxPrice,
    activeInStock,
  ]);

  // Toggle helpers for staged state
  const handleToggleStagedCategory = (slug: string) => {
    setStagedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleToggleStagedBrand = (slug: string) => {
    setStagedBrands((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleToggleStagedGoal = (goalId: string) => {
    setStagedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const handleApplyPresetPrice = (min?: number, max?: number) => {
    setStagedMinPrice(min !== undefined ? min.toString() : '');
    setStagedMaxPrice(max !== undefined ? max.toString() : '');
  };

  const handleClearStaged = () => {
    setStagedCategories([]);
    setStagedBrands([]);
    setStagedGoals([]);
    setStagedMinPrice('');
    setStagedMaxPrice('');
    setStagedInStock(false);
  };

  // Commit staged state to URL query params
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (stagedCategories.length > 0) {
      params.set('category', stagedCategories.join(','));
    } else {
      params.delete('category');
    }

    if (stagedBrands.length > 0) {
      params.set('brand', stagedBrands.join(','));
    } else {
      params.delete('brand');
    }

    if (stagedGoals.length > 0) {
      params.set('goal', stagedGoals.join(','));
    } else {
      params.delete('goal');
    }

    if (stagedMinPrice) {
      params.set('minPrice', stagedMinPrice);
    } else {
      params.delete('minPrice');
    }

    if (stagedMaxPrice) {
      params.set('maxPrice', stagedMaxPrice);
    } else {
      params.delete('maxPrice');
    }

    if (stagedInStock) {
      params.set('inStock', 'true');
    } else {
      params.delete('inStock');
    }

    const queryString = params.toString();
    const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(targetUrl, { scroll: false });
    setIsOpen(false);
  };

  const stagedCount =
    stagedCategories.length +
    stagedBrands.length +
    stagedGoals.length +
    (stagedMinPrice ? 1 : 0) +
    (stagedMaxPrice ? 1 : 0) +
    (stagedInStock ? 1 : 0);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button */}
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className={cn('min-h-11 gap-2 font-medium border-neutral-300 shadow-2xs', className)}
        >
          <SlidersHorizontal className="h-4 w-4 text-neutral-800" />
          <span>Filter Catalog</span>
          {activeFilterCount > 0 && (
            <Badge
              variant="default"
              className="bg-neutral-900 text-gold-400 border-gold-500/30 text-xs px-1.5 py-0.5 rounded-full"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      {/* Bottom Sheet Panel */}
      <SheetContent
        side="bottom"
        className="max-h-[85vh] h-[85vh] rounded-t-2xl p-0 flex flex-col bg-white overflow-hidden shadow-2xl border-t border-neutral-200"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b border-neutral-200 flex flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-2">
            <SheetTitle className="text-base font-semibold text-neutral-900 font-heading">
              Filter Catalog
            </SheetTitle>
            {stagedCount > 0 && (
              <Badge variant="secondary" className="text-xs bg-neutral-100 text-neutral-700">
                {stagedCount} selected
              </Badge>
            )}
          </div>
          {stagedCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearStaged}
              className="text-xs text-neutral-500 hover:text-neutral-900 h-8 px-2 min-h-11 gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          )}
        </SheetHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
          {/* Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Categories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {categories.map((category) => {
                const isChecked = stagedCategories.includes(category.slug);
                return (
                  <label
                    key={category.id}
                    onClick={() => handleToggleStagedCategory(category.slug)}
                    className="flex items-center gap-3 py-2 px-2.5 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group"
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
                        isChecked
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 bg-white'
                      )}
                    >
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm font-medium text-neutral-800">
                      {category.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Searchable Brands */}
          <BrandFilter
            brands={brands}
            products={products}
            selectedBrandSlugs={stagedBrands}
            onToggleBrand={handleToggleStagedBrand}
          />

          <Separator />

          {/* Fitness Goals */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Fitness Goal
            </h3>
            <div className="space-y-1.5">
              {FITNESS_GOALS.map((goal) => {
                const isChecked = stagedGoals.includes(goal.id);
                return (
                  <label
                    key={goal.id}
                    onClick={() => handleToggleStagedGoal(goal.id)}
                    className="flex items-center gap-3 py-2 px-2.5 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group"
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
                        isChecked
                          ? 'border-neutral-900 bg-neutral-900 text-white'
                          : 'border-neutral-300 bg-white'
                      )}
                    >
                      {isChecked && <Check className="h-3 w-3" />}
                    </div>
                    <span className="text-sm font-medium text-neutral-800">
                      {goal.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Price Range (NPR) */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Price Range (NPR)
            </h3>

            {/* Presets */}
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_PRICE_RANGES.map((preset) => {
                const isActive =
                  (preset.min === undefined
                    ? !stagedMinPrice
                    : stagedMinPrice === preset.min.toString()) &&
                  (preset.max === undefined
                    ? !stagedMaxPrice
                    : stagedMaxPrice === preset.max.toString());

                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPresetPrice(preset.min, preset.max)}
                    className={cn(
                      'rounded-md px-2.5 py-2 text-xs font-medium border text-center transition-all min-h-11 touch-manipulation',
                      isActive
                        ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Inputs */}
            <div className="flex items-center gap-2 pt-1">
              <Input
                type="number"
                placeholder="Min NPR"
                value={stagedMinPrice}
                onChange={(e) => setStagedMinPrice(e.target.value)}
                className="h-10 text-xs"
                min={0}
              />
              <span className="text-neutral-400 text-xs">–</span>
              <Input
                type="number"
                placeholder="Max NPR"
                value={stagedMaxPrice}
                onChange={(e) => setStagedMaxPrice(e.target.value)}
                className="h-10 text-xs"
                min={0}
              />
            </div>
          </div>

          <Separator />

          {/* In-Stock Only */}
          <div className="pt-1 pb-4">
            <label
              onClick={() => setStagedInStock(!stagedInStock)}
              className="flex items-center justify-between py-2 px-2.5 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group"
            >
              <span className="text-sm font-medium text-neutral-800">
                In-Stock Only
              </span>
              <div
                className={cn(
                  'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                  stagedInStock ? 'bg-emerald-600' : 'bg-neutral-200'
                )}
              >
                <span
                  className={cn(
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out',
                    stagedInStock ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </div>
            </label>
          </div>
        </div>

        {/* Sticky Footer CTA */}
        <div className="p-4 border-t border-neutral-200 bg-white shrink-0 shadow-lg">
          <Button
            type="button"
            onClick={handleApplyFilters}
            className="w-full bg-neutral-900 text-white hover:bg-neutral-800 font-semibold min-h-12 text-sm shadow-md ring-1 ring-gold-500/30"
          >
            Apply Filters {totalCount !== undefined ? `(${totalCount} Products)` : ''}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
