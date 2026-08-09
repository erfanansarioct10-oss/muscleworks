import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names and merges Tailwind CSS classes safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric price into the standard Nepali Rupee display format (e.g. 5500 -> "NPR 5,500").
 * Supplements in Nepal are priced in integer rupee amounts.
 */
export function formatNprPrice(price: number): string {
  if (typeof price !== "number" || isNaN(price)) {
    return "NPR 0";
  }
  const formatted = new Intl.NumberFormat("en-NP", {
    maximumFractionDigits: 0,
  }).format(Math.round(price));

  return `NPR ${formatted}`;
}

/**
 * Calculates the integer percentage discount between original (MRP) and current discounted price.
 * Returns 0 if there is no valid discount.
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountedPrice: number
): number {
  if (
    !originalPrice ||
    !discountedPrice ||
    originalPrice <= discountedPrice ||
    originalPrice <= 0
  ) {
    return 0;
  }
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Converts a string into a URL-friendly lowercase slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-"); // Replace multiple - with single -
}

/**
 * Strips all non-digit characters from a phone number for direct wa.me or tel: links.
 * E.g. "+977 980-0000000" -> "9779800000000"
 */
export function sanitizeDigitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Formats phone string for readable display.
 */
export function formatPhoneNumber(phone: string): string {
  const digits = sanitizeDigitsOnly(phone);
  if (digits.startsWith("977") && digits.length === 13) {
    return `+977 ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}

/**
 * Truncates text with an ellipsis if it exceeds maxLength.
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}
