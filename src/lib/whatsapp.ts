/**
 * MUSCLEWORKS SUPPLEMENTS — WHATSAPP CONVERSION & URL ENGINE
 * Central helper module for constructing context-rich, pre-filled WhatsApp order payloads.
 * Single Source of Truth for wa.me URL generation across product cards, PDP, floating CTAs, and headers.
 */

import { STORE_NAME, STORE_WHATSAPP, STORE_LOCATION } from '@/lib/constants';
import { formatNprPrice } from '@/lib/utils';
import type { Product, ProductVariant } from '@/lib/validations/product';

/**
 * Clean numeric WhatsApp phone number without leading '+' or formatting characters.
 * E.g., "+977 980-0000000" -> "9779800000000"
 */
export function getSanitizedWhatsAppNumber(): string {
  return STORE_WHATSAPP.replace(/\D/g, '');
}

/**
 * Base WhatsApp web/app link URL format
 */
export function getBaseWhatsAppUrl(): string {
  return `https://wa.me/${getSanitizedWhatsAppNumber()}`;
}

export interface ProductWhatsAppOptions {
  product: Product;
  selectedVariant?: ProductVariant;
  brandName?: string;
  customerCity?: string;
  customerNote?: string;
}

/**
 * Builds a high-converting, pre-filled WhatsApp order link for a specific product & variant.
 */
export function buildProductWhatsAppUrl(options: ProductWhatsAppOptions): string {
  const { product, selectedVariant, brandName, customerCity, customerNote } = options;

  // Resolve variant or fallback to default variant
  const variant =
    selectedVariant ||
    product.variants.find((v) => v.id === product.defaultVariantId) ||
    product.variants[0];

  const priceFormatted = formatNprPrice(variant.discountPriceNpr || variant.priceNpr);
  const flavorText = variant.flavor ? variant.flavor : 'Standard';
  const sizeText = variant.sizeOrWeight ? variant.sizeOrWeight : 'Standard';
  const deliveryLocation = customerCity ? customerCity : 'Kathmandu Valley';
  const resolvedBrand = brandName ? brandName : product.brandId;

  const lines = [
    `Namaste ${STORE_NAME}! I would like to order:`,
    ``,
    `• Product: ${product.name}`,
    `• Brand: ${resolvedBrand}`,
    `• Flavor: ${flavorText}`,
    `• Size/Weight: ${sizeText}`,
    `• Price: ${priceFormatted}`,
    `• Delivery Target: ${deliveryLocation}`,
    `• Genuine Authenticity Hologram Seal Requested`,
  ];

  if (customerNote && customerNote.trim().length > 0) {
    lines.push(`• Special Note: ${customerNote.trim()}`);
  }

  lines.push(
    ``,
    `Please confirm stock availability, store pickup/delivery timeline from ${STORE_LOCATION.area}, Kathmandu.`
  );

  const messageText = lines.join('\n');
  return `${getBaseWhatsAppUrl()}?text=${encodeURIComponent(messageText)}`;
}

/**
 * Builds a general inquiry WhatsApp URL for general store questions, stock checks, or customer support.
 */
export function buildGeneralWhatsAppUrl(customGreeting?: string): string {
  const greeting = customGreeting?.trim() || 'Namaste MuscleWorks! I have an inquiry regarding supplement products, pricing, or delivery in Nepal.';
  const lines = [
    greeting,
    ``,
    `Can you please assist me with my order?`
  ];
  return `${getBaseWhatsAppUrl()}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Builds a pre-filled WhatsApp URL for product authenticity & importer hologram verification checks.
 */
export function buildAuthenticityInquiryWhatsAppUrl(productName?: string): string {
  const target = productName ? `for ${productName}` : 'for supplements at your Golfutar store';
  const lines = [
    `Namaste MuscleWorks! I want to verify authentic importer seal & scratch code details ${target}.`,
    ``,
    `Please share details about your official importer seals (Neucrad, Authorised Importer Sticker) and 100% genuine guarantee.`
  ];
  return `${getBaseWhatsAppUrl()}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Builds a pre-filled WhatsApp URL for free expert stack consultation.
 */
export function buildStackConsultationWhatsAppUrl(fitnessGoal?: string): string {
  const goalText = fitnessGoal ? `My primary fitness goal is: ${fitnessGoal}.` : 'I need personalized guidance on choosing the right supplement stack.';
  const lines = [
    `Namaste MuscleWorks Expert Team!`,
    ``,
    goalText,
    `Can you recommend the best authentic supplement stack (Whey, Creatine, Multivitamins) tailored to my diet and workout routine?`
  ];
  return `${getBaseWhatsAppUrl()}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Builds a pre-filled WhatsApp URL for store location visits (Golfutar, Budha-Nilkantha flagship outlet).
 */
export function buildStoreLocationWhatsAppUrl(): string {
  const lines = [
    `Namaste MuscleWorks! I plan to visit your flagship physical store in ${STORE_LOCATION.street}, ${STORE_LOCATION.area}, ${STORE_LOCATION.city}.`,
    ``,
    `Please share today's store opening hours and directions.`
  ];
  return `${getBaseWhatsAppUrl()}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/**
 * Builds a pre-filled WhatsApp URL for claiming deals and limited-time discounts.
 */
export function buildDealInquiryWhatsAppUrl(productTitle: string, priceNpr: number): string {
  const formattedPrice = formatNprPrice(priceNpr);
  const lines = [
    `Namaste ${STORE_NAME}! I want to claim the Week Deal for ${productTitle} (${formattedPrice}) with Kathmandu delivery.`,
    ``,
    `Please confirm stock availability and store pickup/delivery timeline.`
  ];
  return `${getBaseWhatsAppUrl()}?text=${encodeURIComponent(lines.join('\n'))}`;
}

