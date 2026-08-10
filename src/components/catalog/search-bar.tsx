"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { searchProducts, addRecentSearch, type SearchResult } from "@/lib/search";
import { formatNprPrice, calculateDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSelectResult?: () => void;
}

export function SearchBar({
  placeholder = "Search whey, creatine, brands, flavors...",
  className = "",
  autoFocus = false,
  onSelectResult,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Debounced search effect
  React.useEffect(() => {
    let cancelled = false;
    const trimmed = query.trim();
    if (!trimmed) {
      const timer = setTimeout(() => {
        if (cancelled) return;
        setResults([]);
        setIsLoading(false);
        setIsOpen(false);
      }, 0);
      return () => {
        cancelled = true;
        clearTimeout(timer);
      };
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchRes = await searchProducts(trimmed, 6);
        if (cancelled) return;
        setResults(searchRes);
        setSelectedIndex(-1);
        setIsOpen(true);
      } catch (err) {
        if (cancelled) return;
        console.error("Search error:", err);
        setResults([]);
        setSelectedIndex(-1);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Close dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) setIsOpen(true);
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      const target = results[selectedIndex];
      addRecentSearch(query);
      if (onSelectResult) onSelectResult();
      router.push(`/products/${target.product.slug}`);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelectedIndex(-1);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = (queryTerm: string) => {
    addRecentSearch(queryTerm);
    setIsOpen(false);
    if (onSelectResult) onSelectResult();
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Container */}
      <div className="relative flex items-center">
        <Search className="absolute left-3.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim() && results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="h-11 sm:h-12 w-full rounded-xl border border-input bg-card pl-10 pr-10 text-base sm:text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent transition-all"
          aria-label="Search catalog"
        />

        {isLoading ? (
          <Loader2 className="absolute right-3.5 h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        ) : query ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-11 w-11 min-h-11 min-w-11 flex items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {/* Dropdown Results Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-xl animate-in fade-in-50 zoom-in-95">
          {results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Matches ({results.length})
              </div>

              {results.map((res, index) => {
                const product = res.product;
                const defaultVariant =
                  product.variants.find((v) => v.id === product.defaultVariantId) ??
                  product.variants[0];
                const activePrice = defaultVariant
                  ? defaultVariant.discountPriceNpr || defaultVariant.priceNpr
                  : 0;
                const discountPct = defaultVariant?.discountPriceNpr
                  ? calculateDiscountPercentage(
                      defaultVariant.priceNpr,
                      defaultVariant.discountPriceNpr
                    )
                  : 0;

                const primaryImage = product.images[0]?.url || "/images/placeholder-product.webp";
                const isSelected = index === selectedIndex;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => handleResultClick(query)}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors min-h-11 ${
                      isSelected
                        ? "bg-accent text-accent-foreground ring-1 ring-primary/40"
                        : "hover:bg-muted/70 text-card-foreground"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-neutral-900">
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-bold truncate text-foreground group-hover:text-primary">
                          {product.name}
                        </p>
                      </div>

                      <p className="text-[11px] text-muted-foreground truncate">
                        {defaultVariant
                          ? `${defaultVariant.sizeOrWeight}${
                              defaultVariant.flavor !== "Unflavored" ? ` • ${defaultVariant.flavor}` : ""
                            }`
                          : product.shortDescription}
                      </p>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-extrabold text-amber-500">
                          {formatNprPrice(activePrice)}
                        </span>
                        {defaultVariant?.discountPriceNpr && (
                          <span className="text-[11px] text-muted-foreground line-through">
                            {formatNprPrice(defaultVariant.priceNpr)}
                          </span>
                        )}
                        {discountPct > 0 && (
                          <Badge variant="discount" className="text-[10px] px-1 py-0 h-4">
                            -{discountPct}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* View All Results Link */}
              <Link
                href={`/products?search=${encodeURIComponent(query.trim())}`}
                onClick={() => handleResultClick(query)}
                className="flex items-center justify-between rounded-lg p-2.5 text-xs font-semibold text-primary hover:bg-accent/80 transition-colors mt-1 border-t border-border/50 min-h-11"
              >
                <span>View all products matching &quot;{query.trim()}&quot;</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No products found matching &quot;{query}&quot;. Try searching for &quot;Whey&quot;, &quot;Creatine&quot;, or &quot;Optimum&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
