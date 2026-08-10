'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/validations/product';
import { NutritionTable } from './nutrition-table';
import { AuthenticityGuaranteeBox } from './authenticity-guarantee-box';
import { Check, Dumbbell, ShieldCheck, FileText, Info } from 'lucide-react';

interface ProductSpecsProps {
  product: Product;
  className?: string;
}

type TabType = 'nutrition' | 'usage' | 'authenticity';

export function ProductSpecs({ product, className }: ProductSpecsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('nutrition');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tab Navigation Header */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <nav
          role="tablist"
          aria-label="Product Information Tabs"
          className="-mb-px flex w-full gap-2 overflow-x-auto pb-1 no-scrollbar sm:gap-4"
        >
          <button
            id="tab-nutrition"
            type="button"
            role="tab"
            aria-selected={activeTab === 'nutrition'}
            aria-controls="panel-nutrition"
            onClick={() => setActiveTab('nutrition')}
            className={cn(
              'flex h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-xs font-bold transition-all sm:text-sm',
              activeTab === 'nutrition'
                ? 'border-gold text-gold dark:text-gold'
                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            )}
          >
            <Dumbbell className="h-4 w-4" />
            Nutrition & Highlights
          </button>

          <button
            id="tab-usage"
            type="button"
            role="tab"
            aria-selected={activeTab === 'usage'}
            aria-controls="panel-usage"
            onClick={() => setActiveTab('usage')}
            className={cn(
              'flex h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-xs font-bold transition-all sm:text-sm',
              activeTab === 'usage'
                ? 'border-gold text-gold dark:text-gold'
                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            )}
          >
            <FileText className="h-4 w-4" />
            Usage & Ingredients
          </button>

          <button
            id="tab-authenticity"
            type="button"
            role="tab"
            aria-selected={activeTab === 'authenticity'}
            aria-controls="panel-authenticity"
            onClick={() => setActiveTab('authenticity')}
            className={cn(
              'flex h-11 shrink-0 items-center gap-2 border-b-2 px-4 text-xs font-bold transition-all sm:text-sm',
              activeTab === 'authenticity'
                ? 'border-gold text-gold dark:text-gold'
                : 'border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            Authenticity Seal
          </button>
        </nav>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {/* Tab 1: Nutrition & Highlights */}
        {activeTab === 'nutrition' && (
          <div
            id="panel-nutrition"
            role="tabpanel"
            aria-labelledby="tab-nutrition"
            className="space-y-6 animate-in fade-in-50 duration-200"
          >
            {/* Highlights Bullet Callouts */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/50">
                <h4 className="mb-3 font-heading text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Key Product Highlights
                </h4>
                <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {product.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold/20 text-gold">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nutrition Table Component */}
            <NutritionTable nutritionFacts={product.nutritionFacts} />
          </div>
        )}

        {/* Tab 2: Usage & Ingredients */}
        {activeTab === 'usage' && (
          <div
            id="panel-usage"
            role="tabpanel"
            aria-labelledby="tab-usage"
            className="space-y-6 animate-in fade-in-50 duration-200"
          >
            {/* Directions for Use */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h4 className="mb-2 font-heading text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                Directions & Serving Suggestions
              </h4>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {product.directions}
              </p>
            </div>

            {/* Ingredients List */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h4 className="mb-2 font-heading text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                Ingredients & Formula
              </h4>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {product.ingredients}
              </p>
            </div>

            {/* Allergen & Storage Info Notice */}
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs text-amber-800 dark:text-amber-200">
              <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <strong className="block font-semibold">Storage & Allergen Notice:</strong>
                <span>
                  Store in a cool, dry place away from direct sunlight. Contains milk and soy (lecithin) ingredients. Produced in a facility that also processes eggs, peanuts, and wheat.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Authenticity Guarantee */}
        {activeTab === 'authenticity' && (
          <div
            id="panel-authenticity"
            role="tabpanel"
            aria-labelledby="tab-authenticity"
            className="animate-in fade-in-50 duration-200"
          >
            <AuthenticityGuaranteeBox
              authenticity={product.authenticity}
              productName={product.name}
            />
          </div>
        )}
      </div>
    </div>
  );
}
