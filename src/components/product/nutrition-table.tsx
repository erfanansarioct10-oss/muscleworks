import React from 'react';
import { cn } from '@/lib/utils';
import type { NutritionFacts } from '@/lib/validations/product';
import { Flame, Dumbbell, PackageCheck, Zap } from 'lucide-react';

interface NutritionTableProps {
  nutritionFacts: NutritionFacts;
  className?: string;
}

export function NutritionTable({ nutritionFacts, className }: NutritionTableProps) {
  const {
    servingSize,
    servingsPerContainer,
    caloriesPerServing,
    proteinGrams,
    carbsGrams,
    fatGrams,
    bcaaGrams,
    items = [],
  } = nutritionFacts;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Top Macronutrient Metric Callout Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {proteinGrams !== undefined && (
          <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-black/5 p-4 text-center dark:border-neutral-800 dark:bg-white/5 sm:p-4">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white/10 dark:text-white">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {proteinGrams}g
            </span>
            <span className="mt-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Protein / Serving
            </span>
          </div>
        )}

        <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-black/5 p-4 text-center dark:border-neutral-800 dark:bg-white/5 sm:p-4">
          <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white/10 dark:text-white">
            <PackageCheck className="h-4 w-4" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {servingsPerContainer}
          </span>
          <span className="mt-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            Servings / Tub
          </span>
        </div>

        {caloriesPerServing !== undefined && (
          <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-black/5 p-4 text-center dark:border-neutral-800 dark:bg-white/5 sm:p-4">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white/10 dark:text-white">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {caloriesPerServing}
            </span>
            <span className="mt-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Calories / Scoop
            </span>
          </div>
        )}

        {bcaaGrams !== undefined && (
          <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-black/5 p-4 text-center dark:border-neutral-800 dark:bg-white/5 sm:p-4">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-white dark:bg-white/10 dark:text-white">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {bcaaGrams}g
            </span>
            <span className="mt-0.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
              BCAAs & EAAs
            </span>
          </div>
        )}
      </div>

      {/* Supplement Facts Detailed Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
        <div className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-850">
          <h3 className="font-heading text-base font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            Supplement Facts
          </h3>
          <div className="mt-1 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400">
            <span>
              Serving Size: <strong className="text-neutral-900 dark:text-white">{servingSize}</strong>
            </span>
            <span>
              Servings Per Container: <strong className="text-neutral-900 dark:text-white">{servingsPerContainer}</strong>
            </span>
          </div>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-xs uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
              <th scope="col" className="px-4 py-2.5 font-semibold">
                Amount Per Serving
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">
                Amount
              </th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">
                % Daily Value*
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {caloriesPerServing !== undefined && (
              <tr>
                <td className="px-4 py-2.5 font-medium">Calories</td>
                <td className="px-4 py-2.5 text-right font-medium">{caloriesPerServing} kcal</td>
                <td className="px-4 py-2.5 text-right text-neutral-500 dark:text-neutral-400">—</td>
              </tr>
            )}
            {proteinGrams !== undefined && (
              <tr>
                <td className="px-4 py-2.5 font-medium">Protein</td>
                <td className="px-4 py-2.5 text-right font-medium">{proteinGrams}g</td>
                <td className="px-4 py-2.5 text-right text-neutral-500 dark:text-neutral-400">—</td>
              </tr>
            )}
            {carbsGrams !== undefined && (
              <tr>
                <td className="px-4 py-2.5 font-medium">Total Carbohydrates</td>
                <td className="px-4 py-2.5 text-right font-medium">{carbsGrams}g</td>
                <td className="px-4 py-2.5 text-right text-neutral-500 dark:text-neutral-400">—</td>
              </tr>
            )}
            {fatGrams !== undefined && (
              <tr>
                <td className="px-4 py-2.5 font-medium">Total Fat</td>
                <td className="px-4 py-2.5 text-right font-medium">{fatGrams}g</td>
                <td className="px-4 py-2.5 text-right text-neutral-500 dark:text-neutral-400">—</td>
              </tr>
            )}

            {/* Custom Micro-Nutrient Items */}
            {items.map((item, index) => (
              <tr key={`${item.name}-${index}`}>
                <td className="px-4 py-2.5 font-medium">{item.name}</td>
                <td className="px-4 py-2.5 text-right font-medium">{item.amountPerServing}</td>
                <td className="px-4 py-2.5 text-right text-neutral-500 dark:text-neutral-400">
                  {item.dailyValuePercentage ?? '†'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-2 text-2xs text-neutral-500 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-400">
          * Percent Daily Values are based on a 2,000 calorie diet. † Daily Value not established.
        </div>
      </div>
    </div>
  );
}
