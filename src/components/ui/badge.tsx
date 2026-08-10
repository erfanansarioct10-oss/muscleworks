import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
        authentic:
          "border-amber-600/30 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/90 dark:text-amber-300 font-bold",
        discount:
          "border-primary/20 bg-primary text-primary-foreground font-bold",
        stock:
          "border-amber-600/30 bg-amber-50 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/90 dark:text-amber-300",

        category:
          "border-border bg-secondary text-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border-border text-foreground bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
