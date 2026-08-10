'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Filter, Check, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { Category, Brand } from '@/lib/validations/product';

export interface CatalogFiltersProps {
  categories: Category[];
  brands?: Brand[];
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

export function CatalogFilters({ categories, className }: CatalogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Active state derived from URL
  const activeCategoryParam = searchParams.get('category') ?? '';
  const activeGoalParam = searchParams.get('goal') ?? '';
  const activeMinPrice = searchParams.get('minPrice') ?? '';
  const activeMaxPrice = searchParams.get('maxPrice') ?? '';
  const inStockOnly = searchParams.get('inStock') === 'true';

  const activeCategorySlugs = React.useMemo(
    () => (activeCategoryParam ? activeCategoryParam.split(',').filter(Boolean) : []),
    [activeCategoryParam]
  );

  const activeGoals = React.useMemo(
    () => (activeGoalParam ? activeGoalParam.split(',').filter(Boolean) : []),
    [activeGoalParam]
  );

  // Local state for Min/Max inputs before committing
  const [minPriceInput, setMinPriceInput] = React.useState(activeMinPrice);
  const [maxPriceInput, setMaxPriceInput] = React.useState(activeMaxPrice);

  const [prevMinPrice, setPrevMinPrice] = React.useState(activeMinPrice);
  if (prevMinPrice !== activeMinPrice) {
    setPrevMinPrice(activeMinPrice);
    setMinPriceInput(activeMinPrice);
  }

  const [prevMaxPrice, setPrevMaxPrice] = React.useState(activeMaxPrice);
  if (prevMaxPrice !== activeMaxPrice) {
    setPrevMaxPrice(activeMaxPrice);
    setMaxPriceInput(activeMaxPrice);
  }


  // Helper to push URL updates cleanly
  const updateUrlParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(targetUrl, { scroll: false });
    },
    [searchParams, pathname, router]
  );

  // Toggle category multi-select
  const handleToggleCategory = (slug: string) => {
    const isSelected = activeCategorySlugs.includes(slug);
    const updated = isSelected
      ? activeCategorySlugs.filter((s) => s !== slug)
      : [...activeCategorySlugs, slug];

    updateUrlParams({
      category: updated.length > 0 ? updated.join(',') : null,
    });
  };

  // Toggle fitness goal multi-select
  const handleToggleGoal = (goalId: string) => {
    const isSelected = activeGoals.includes(goalId);
    const updated = isSelected
      ? activeGoals.filter((g) => g !== goalId)
      : [...activeGoals, goalId];

    updateUrlParams({
      goal: updated.length > 0 ? updated.join(',') : null,
    });
  };

  // Apply custom Min/Max price inputs
  const handleApplyPriceInputs = (e: React.FormEvent) => {
    e.preventDefault();

    const parsePrice = (raw: string): number | null => {
      if (!raw || !raw.trim()) return null;
      const parsed = Number.parseInt(raw.trim(), 10);
      return Number.isFinite(parsed) ? Math.max(0, parsed) : null;
    };

    const minVal = parsePrice(minPriceInput);
    const maxVal = parsePrice(maxPriceInput);

    // Basic min <= max check
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      updateUrlParams({
        minPrice: maxVal.toString(),
        maxPrice: minVal.toString(),
      });
    } else {
      updateUrlParams({
        minPrice: minVal !== null ? minVal.toString() : null,
        maxPrice: maxVal !== null ? maxVal.toString() : null,
      });
    }
  };


  // Apply preset price pill
  const handleApplyPricePreset = (min?: number, max?: number) => {
    updateUrlParams({
      minPrice: min !== undefined ? min.toString() : null,
      maxPrice: max !== undefined ? max.toString() : null,
    });
  };

  // Toggle In-Stock Only
  const handleToggleInStock = () => {
    updateUrlParams({
      inStock: inStockOnly ? null : 'true',
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasAnyFilter =
    activeCategorySlugs.length > 0 ||
    activeGoals.length > 0 ||
    !!activeMinPrice ||
    !!activeMaxPrice ||
    inStockOnly;

  return (
    <aside
      className={cn(
        'w-full space-y-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-xs',
        className
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-900" />
          <h2 className="text-base font-semibold text-neutral-900 font-heading tracking-wide">
            Catalog Filters
          </h2>
        </div>
        {hasAnyFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs text-neutral-500 hover:text-neutral-900 h-8 px-2 min-h-11 gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </Button>
        )}
      </div>

      <Separator />

      {/* 1. Category Facet */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Categories
        </h3>
        <div className="space-y-1.5">
          {categories.map((category) => {
            const isChecked = activeCategorySlugs.includes(category.slug);
            return (
              <label
                key={category.id}
                onClick={() => handleToggleCategory(category.slug)}
                className="flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group"
              >
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
                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                  {category.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* 2. Fitness Goals Facet */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Fitness Goal
        </h3>
        <div className="space-y-1.5">
          {FITNESS_GOALS.map((goal) => {
            const isChecked = activeGoals.includes(goal.id);
            return (
              <label
                key={goal.id}
                onClick={() => handleToggleGoal(goal.id)}
                className="flex items-center gap-3 py-1.5 px-2 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group"
              >
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
                <span className="text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                  {goal.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* 3. Price Range Facet (NPR) */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Price Range (NPR)
        </h3>

        {/* Preset Range Pills */}
        <div className="grid grid-cols-2 gap-1.5">
          {PRESET_PRICE_RANGES.map((preset) => {
            const isActive =
              (preset.min === undefined
                ? !activeMinPrice
                : activeMinPrice === preset.min.toString()) &&
              (preset.max === undefined
                ? !activeMaxPrice
                : activeMaxPrice === preset.max.toString());

            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyPricePreset(preset.min, preset.max)}
                className={cn(
                  'rounded-md px-2.5 py-1.5 text-xs font-medium border text-center transition-all min-h-11 touch-manipulation',
                  isActive
                    ? 'border-neutral-900 bg-neutral-900 text-white font-semibold'
                    : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min / Max Input Form */}
        <form onSubmit={handleApplyPriceInputs} className="pt-1 space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min NPR"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className="h-10 text-xs"
              min={0}
            />
            <span className="text-neutral-400 text-xs">–</span>
            <Input
              type="number"
              placeholder="Max NPR"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className="h-10 text-xs"
              min={0}
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full text-xs font-medium h-9 min-h-11"
          >
            Apply Price Range
          </Button>
        </form>
      </div>

      <Separator />

      {/* 4. Availability Facet (In-Stock Only) */}
      <div className="pt-1">
        <label
          onClick={handleToggleInStock}
          className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-neutral-50 cursor-pointer min-h-11 touch-manipulation group"
        >
          <span className="text-sm font-medium text-neutral-800 group-hover:text-neutral-900">
            In-Stock Only
          </span>
          <div
            className={cn(
              'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              inStockOnly ? 'bg-emerald-600' : 'bg-neutral-200'
            )}
          >
            <span
              className={cn(
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                inStockOnly ? 'translate-x-5' : 'translate-x-0'
              )}
            />
          </div>
        </label>
      </div>
    </aside>
  );
}
