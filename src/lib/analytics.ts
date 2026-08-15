/**
 * MUSCLEWORKS SUPPLEMENTS — CLIENT ANALYTICS ENGINE
 * Safe client-side event tracking dispatcher for Google Analytics 4 (gtag), Meta Pixel (fbq),
 * and custom DOM events with development logging fallback.
 */

// Ambient declaration for browser window analytics APIs
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
    fbq?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
  }
}

export interface AnalyticsEvent {
  eventName: string;
  category?: string;
  label?: string;
  value?: number;
  params?: Record<string, unknown>;
}

export interface ProductViewParams {
  productId: string;
  productName: string;
  brand?: string;
  category?: string;
  price: number;
}

export interface WhatsAppClickParams {
  source: string;
  productName?: string;
  brand?: string;
  flavor?: string;
  size?: string;
  price?: number;
}

export interface SearchQueryParams {
  query: string;
  resultsCount: number;
}

export interface CategoryViewParams {
  categoryId: string;
  categoryName: string;
}

export interface LeadSubmissionParams {
  formName: string;
  city?: string;
  inquiryType?: string;
}

/**
 * Safely dispatches a custom analytics event to window.gtag, window.fbq, and window.dispatchEvent.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;

  const { eventName, category, label, value, params = {} } = event;

  // Log in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    // Console log for debugging
    console.log(`[Analytics Track Event]`, { eventName, category, label, value, params });
  }

  // 1. Google Analytics 4 (gtag.js)
  if (typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, {
        event_category: category,
        event_label: label,
        value: value,
        ...params,
      });
    } catch (err) {
      console.warn('GA4 dispatch failed:', err);
    }
  }

  // 2. Meta Pixel (fbq)
  if (typeof window.fbq === 'function') {
    try {
      window.fbq('trackCustom', eventName, {
        category,
        label,
        value,
        ...params,
      });
    } catch (err) {
      console.warn('Meta Pixel dispatch failed:', err);
    }
  }

  // 3. Native Browser CustomEvent
  try {
    const customEvt = new CustomEvent('mw:analytics', {
      detail: { eventName, category, label, value, params },
    });
    window.dispatchEvent(customEvt);
  } catch {
    // Ignore DOM event dispatch errors
  }
}

/**
 * Track user clicking a WhatsApp order or inquiry CTA button
 */
export function trackWhatsAppClick(params: WhatsAppClickParams): void {
  trackEvent({
    eventName: 'whatsapp_click',
    category: 'Conversion',
    label: params.productName ? `WhatsApp Order: ${params.productName}` : `WhatsApp CTA: ${params.source}`,
    value: params.price,
    params: {
      source: params.source,
      product_name: params.productName,
      brand: params.brand,
      flavor: params.flavor,
      size: params.size,
      price_npr: params.price,
    },
  });
}

/**
 * Track user viewing a specific product detail or quick preview
 */
export function trackProductView(params: ProductViewParams): void {
  trackEvent({
    eventName: 'view_item',
    category: 'Ecommerce',
    label: params.productName,
    value: params.price,
    params: {
      item_id: params.productId,
      item_name: params.productName,
      item_brand: params.brand,
      item_category: params.category,
      price_npr: params.price,
    },
  });
}

/**
 * Track user searching the catalog via search bar modal
 */
export function trackSearchQuery(params: SearchQueryParams): void {
  trackEvent({
    eventName: 'search',
    category: 'Catalog Search',
    label: params.query,
    value: params.resultsCount,
    params: {
      search_term: params.query,
      results_count: params.resultsCount,
    },
  });
}

/**
 * Track user viewing a category archive page
 */
export function trackCategoryView(params: CategoryViewParams): void {
  trackEvent({
    eventName: 'view_item_list',
    category: 'Navigation',
    label: params.categoryName,
    params: {
      item_list_id: params.categoryId,
      item_list_name: params.categoryName,
    },
  });
}

/**
 * Track user submitting a contact or inquiry form
 */
export function trackLeadSubmission(params: LeadSubmissionParams): void {
  trackEvent({
    eventName: 'generate_lead',
    category: 'Lead Generation',
    label: params.formName,
    params: {
      form_name: params.formName,
      city: params.city,
      inquiry_type: params.inquiryType,
    },
  });
}
