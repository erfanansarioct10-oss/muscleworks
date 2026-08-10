'use client';

/**
 * MUSCLEWORKS SUPPLEMENTS — PRODUCT STOCK STATUS INDICATOR
 * Multi-state inventory badge displaying real-time stock levels and Golfutar store availability.
 */

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { StockStatus } from '@/lib/validations/product';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

export interface ProductStockStatusProps {
  stockStatus: StockStatus;
  inStockQuantity?: number;
  className?: string;
  showIcon?: boolean;
}

export function ProductStockStatus({
  stockStatus,
  inStockQuantity,
  className,
  showIcon = true,
}: ProductStockStatusProps) {
  let badgeStyle = '';
  let dotStyle = '';
  let label = '';
  let Icon = CheckCircle2;

  switch (stockStatus) {
    case 'in_stock':
      badgeStyle = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40';
      dotStyle = 'bg-emerald-500 animate-pulse';
      label = 'In Stock at Golfutar Store & Warehouse';
      Icon = CheckCircle2;
      break;
    case 'low_stock':
      badgeStyle = 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40';
      dotStyle = 'bg-amber-500 animate-pulse';
      label = inStockQuantity && inStockQuantity > 0
        ? `Low Stock: Only ${inStockQuantity} left in Golfutar store`
        : 'Low Stock — Order Soon';
      Icon = AlertTriangle;
      break;
    case 'out_of_stock':
      badgeStyle = 'bg-neutral-500/10 text-neutral-600 border-neutral-300 dark:bg-neutral-900/50 dark:text-neutral-400 dark:border-neutral-800';
      dotStyle = 'bg-neutral-400';
      label = 'Out of Stock — WhatsApp for Pre-Order';
      Icon = XCircle;
      break;
    case 'pre_order':
      badgeStyle = 'bg-sky-500/10 text-sky-600 border-sky-500/20 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800/40';
      dotStyle = 'bg-sky-500 animate-pulse';
      label = 'Pre-Order Available (5–7 Days Delivery)';
      Icon = Clock;
      break;
    default:
      badgeStyle = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      dotStyle = 'bg-emerald-500';
      label = 'In Stock';
      Icon = CheckCircle2;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors',
        badgeStyle,
        className
      )}
    >
      <span className={cn('h-2 w-2 rounded-full', dotStyle)} aria-hidden="true" />
      {showIcon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
      <span>{label}</span>
    </div>
  );
}
