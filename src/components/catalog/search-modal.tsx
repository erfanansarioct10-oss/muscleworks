"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2, History, Trash2, Tag, ArrowRight, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  searchProducts,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  type SearchResult,
} from "@/lib/search";
import { formatNprPrice, calculateDiscountPercentage } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const POPULAR_CATEGORIES = [
  { name: "Proteins", slug: "proteins" },
  { name: "Creatine", slug: "creatine" },
  { name: "Mass Gainers", slug: "mass-gainers" },
  { name: "Pre-Workout", slug: "pre-workout" },
  { name: "Vitamins & Health", slug: "vitamins-health" },
  { name: "Amino & BCAA", slug: "amino-bcaa" },
];

interface SearchModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export function SearchModal({
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  children,
}: SearchModalProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };

  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setRecentSearches(getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
    setOpen(open);
  };

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleOpenChange(!isOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Debounced search query
  React.useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      const timer = setTimeout(() => {
        setResults([]);
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchProducts(trimmed, 8);
        setResults(res);
      } catch (err) {
        console.error("Search modal query error:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectRecentSearch = (term: string) => {
    setQuery(term);
  };

  const handleClearHistory = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const handleSelectProduct = (productSlug: string, searchTerm: string) => {
    if (searchTerm.trim()) {
      const updated = addRecentSearch(searchTerm);
      setRecentSearches(updated);
    }
    handleOpenChange(false);
  };

  return (
    <>
      {/* Trigger Slot wrapper if provided */}
      {children && (
        <span onClick={() => handleOpenChange(true)} className="inline-block cursor-pointer">
          {children}
        </span>
      )}

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden sm:max-w-2xl bg-card border-border shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Search Supplement Catalog</DialogTitle>
            <DialogDescription>
              Search authentic supplements, brands, categories, and flavors in Nepal.
            </DialogDescription>
          </DialogHeader>

          {/* Top Search Input Bar */}
          <div className="flex items-center border-b border-border px-4 py-3 bg-card">
            <Search className="h-5 w-5 shrink-0 text-muted-foreground mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Optimum, Creatine, Whey, Gold Standard..."
              className="h-10 w-full bg-transparent text-base sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {isLoading ? (
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground mr-2" />
            ) : query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="h-8 w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg mr-2"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Modal Body Container */}
          <div className="max-h-[65vh] sm:max-h-[500px] overflow-y-auto p-4 space-y-5">
            {/* Case 1: Empty Query State */}
            {!query.trim() && (
              <div className="space-y-5">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <History className="h-3.5 w-3.5" />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearHistory}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors focus-visible:outline-none"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Clear</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <button
                          key={`${term}-${i}`}
                          type="button"
                          onClick={() => handleSelectRecentSearch(term)}
                          className="flex items-center gap-1.5 px-3 py-1.5 min-h-[44px] sm:min-h-0 text-xs font-medium rounded-full border border-border bg-muted/60 text-foreground hover:bg-accent hover:border-accent transition-colors"
                        >
                          <Search className="h-3 w-3 text-muted-foreground" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Supplement Categories */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Popular Categories</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {POPULAR_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-border/80 bg-card hover:bg-accent/60 transition-colors group"
                      >
                        <span className="text-xs font-medium text-foreground group-hover:text-primary">
                          {cat.name}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Authentic Guarantee Footnote */}
                <div className="flex items-center gap-2 rounded-xl bg-muted/40 p-3 border border-border/40 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-500 shrink-0" />
                  <span>
                    All supplements indexed in MuscleWorks Nepal feature official authorized importer stickers & QR authenticity verification.
                  </span>
                </div>
              </div>
            )}

            {/* Case 2: Live Search Results */}
            {query.trim() && results.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1">
                  Matching Products ({results.length})
                </div>
                <div className="space-y-1.5">
                  {results.map((res) => {
                    const product = res.product;
                    const defaultVariant =
                      product.variants.find((v) => v.id === product.defaultVariantId) ??
                      product.variants[0];

                    const discountPct = defaultVariant.discountPriceNpr
                      ? calculateDiscountPercentage(
                          defaultVariant.priceNpr,
                          defaultVariant.discountPriceNpr
                        )
                      : 0;

                    const primaryImage =
                      product.images[0]?.url || "/images/placeholder-product.webp";

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        onClick={() => handleResultClick(query)}
                        className="flex items-center gap-3.5 p-3 rounded-xl border border-border/60 bg-card hover:bg-accent/60 hover:border-accent transition-all group"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/50 p-1">
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="56px"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground/80">{res.brandName}</span>
                            <span>•</span>
                            <span>{res.categoryName}</span>
                          </div>

                          <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                            {product.name}
                          </h4>

                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-extrabold text-foreground">
                              {formatNprPrice(defaultVariant.discountPriceNpr || defaultVariant.priceNpr)}
                            </span>
                            {defaultVariant.discountPriceNpr && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatNprPrice(defaultVariant.priceNpr)}
                              </span>
                            )}
                            {discountPct > 0 && (
                              <Badge variant="discount" className="text-[10px] px-1.5 py-0">
                                Save {discountPct}%
                              </Badge>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Case 3: Zero Match State */}
            {query.trim() && !isLoading && results.length === 0 && (
              <div className="py-8 text-center space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <Search className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground">No supplements found</h4>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    We couldn&apos;t find any products matching &quot;{query}&quot;. Try searching by brand (e.g. Optimum Nutrition, MuscleTech) or category.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    Or browse by category:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {POPULAR_CATEGORIES.slice(0, 4).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/categories/${cat.slug}`}
                        onClick={() => setOpen(false)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Bar */}
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span><kbd className="font-semibold border rounded px-1 bg-card">↑↓</kbd> navigate</span>
              <span><kbd className="font-semibold border rounded px-1 bg-card">↵</kbd> select</span>
              <span><kbd className="font-semibold border rounded px-1 bg-card">ESC</kbd> close</span>
            </div>
            <span>MuscleWorks Nepal Catalog</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
