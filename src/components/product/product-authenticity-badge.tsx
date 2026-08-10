'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const authenticityBadgeVariants = cva(
  'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        compact:
          'bg-neutral-950/85 backdrop-blur-md text-amber-400 border border-amber-500/35 text-[11px] px-2 py-0.5 rounded-full shadow-sm gap-1 tracking-wide',
        default:
          'bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold px-2.5 py-1 rounded-md gap-1.5 tracking-normal',
        card: 'w-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-500/40 rounded-xl p-4 sm:p-5 shadow-md flex-col items-start gap-3 text-left',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ProductAuthenticityBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof authenticityBadgeVariants> {
  importerName?: string;
  trustLabel?: string;
  verificationMethod?: string;
}

export function ProductAuthenticityBadge({
  className,
  variant = 'default',
  importerName = 'Authorized Importer Nepal',
  trustLabel = '100% Genuine Importer Seal',
  verificationMethod = 'Scratch Code & Official Importer Sticker',
  ...props
}: ProductAuthenticityBadgeProps) {
  if (variant === 'card') {
    return (
      <div
        className={cn(authenticityBadgeVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-center gap-2.5 text-amber-400">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 shrink-0">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
              {trustLabel}
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            </h4>
            <p className="text-xs text-amber-400/90 font-medium">
              Verified Source • {importerName}
            </p>
          </div>
        </div>

        <div className="w-full pt-2 border-t border-neutral-800/80 text-xs text-neutral-300 space-y-1.5">
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Official MRP sticker with batch testing certificate</span>
          </div>
          <p className="text-[11px] text-neutral-400 pl-5 leading-relaxed">
            Method: {verificationMethod}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(authenticityBadgeVariants({ variant }), className)}
      {...props}
    >
      <ShieldCheck
        className={cn(
          'shrink-0 text-amber-400',
          variant === 'compact' ? 'w-3 h-3' : 'w-3.5 h-3.5'
        )}
      />
      <span className="truncate">{trustLabel}</span>
    </div>
  );
}
