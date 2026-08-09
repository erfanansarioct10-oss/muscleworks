import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary-hover hover:shadow-lg",
        whatsapp:
          "bg-success text-success-foreground shadow-md shadow-success/20 hover:bg-emerald-600 hover:shadow-lg",
        gold:
          "bg-accent text-accent-foreground shadow-md shadow-accent/20 hover:bg-amber-400 hover:shadow-lg",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90",
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-semibold",
        xl: "h-14 rounded-2xl px-8 text-lg font-bold",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
