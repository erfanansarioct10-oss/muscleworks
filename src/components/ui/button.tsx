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
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover active:scale-[0.98]",
        whatsapp:
          "min-h-12 min-w-12 bg-primary text-primary-foreground border border-accent/40 shadow-sm hover:bg-primary-hover hover:border-accent active:scale-[0.98]",
        gold:
          "bg-accent text-accent-foreground shadow-sm hover:bg-amber-600 hover:text-white active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border/50",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-secondary hover:text-foreground",
        ghost:
          "text-foreground hover:bg-secondary hover:text-foreground",
        destructive:
          "bg-zinc-900 text-white shadow-sm hover:bg-zinc-800",
        link:
          "text-foreground underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-11 rounded-lg px-3.5 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-semibold",
        xl: "h-14 rounded-2xl px-8 text-lg font-bold",
        icon: "h-11 w-11 p-0",
        inline: "h-auto p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "link",
        className: "h-auto p-0",
      },
    ],
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
