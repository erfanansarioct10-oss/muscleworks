import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Guides", href: "/guides" },
] as const;


export type NavbarProps = React.HTMLAttributes<HTMLElement>;

export function Navbar({ className, ...props }: NavbarProps) {
  return (
    <nav
      aria-label="Main Navigation"
      className={cn("hidden lg:flex items-center gap-1 lg:gap-2", className)}
      {...props}
    >
      {NAV_LINKS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
