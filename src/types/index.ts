/**
 * MUSCLEWORKS SUPPLEMENTS — SHARED UI & APPLICATION TYPES
 */

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

export interface SocialLink {
  platform: string;
  href: string;
  label: string;
  iconName?: string;
}

export interface TrustPillar {
  id: string;
  title: string;
  description: string;
  badge: string;
  iconName?: string;
}

export interface DeliveryCity {
  id: string;
  name: string;
  zone: "valley" | "nationwide";
  fee: number;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";

export interface FilterState {
  category?: string;
  brand?: string;
  goal?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  searchQuery?: string;
  sortBy?: SortOption;
}

export type ProductBadgeVariant =
  | "authentic"
  | "bestSeller"
  | "discount"
  | "newArrival"
  | "outOfStock";
