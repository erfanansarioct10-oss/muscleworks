/**
 * Programmatic Validation Script for Sub-Phase 4.1 (WhatsApp URL Engine & Analytics Tracker)
 */

import {
  getSanitizedWhatsAppNumber,
  getBaseWhatsAppUrl,
  buildProductWhatsAppUrl,
  buildGeneralWhatsAppUrl,
  buildAuthenticityInquiryWhatsAppUrl,
  buildStackConsultationWhatsAppUrl,
  buildStoreLocationWhatsAppUrl,
} from '../lib/whatsapp';
import { STORE_WHATSAPP } from '../lib/constants';

import {
  trackWhatsAppClick,
  trackProductView,
  trackSearchQuery,
  trackCategoryView,
  trackLeadSubmission,
} from '../lib/analytics';

import { getProducts } from '../lib/data/products';

async function runValidation() {
  console.log('🚀 Running Sub-Phase 4.1 WhatsApp & Analytics Engine Validation...');

  const expectedDigits = STORE_WHATSAPP.replace(/\D/g, '');

  // 1. Phone number sanitization
  const sanitizedNum = getSanitizedWhatsAppNumber();
  console.log(`✓ Sanitized Phone Number: ${sanitizedNum}`);
  if (sanitizedNum !== expectedDigits) {
    throw new Error(`Sanitized phone number mismatch! Expected ${expectedDigits}, got ${sanitizedNum}`);
  }

  // 2. Base WhatsApp URL
  const baseUrl = getBaseWhatsAppUrl();
  console.log(`✓ Base WhatsApp URL: ${baseUrl}`);
  if (baseUrl !== `https://wa.me/${expectedDigits}`) {
    throw new Error(`Base URL mismatch! Expected https://wa.me/${expectedDigits}, got ${baseUrl}`);
  }

  // 3. Product WhatsApp URL Generation
  const products = await getProducts();
  const sampleProduct = products[0];
  const sampleVariant = sampleProduct.variants[0];

  const productUrl = buildProductWhatsAppUrl({
    product: sampleProduct,
    selectedVariant: sampleVariant,
    brandName: 'Optimum Nutrition',
    customerCity: 'Kathmandu (Inside Ring Road)',
    customerNote: 'Please deliver after 2 PM.',
  });

  console.log(`✓ Product WhatsApp URL: ${productUrl.substring(0, 80)}...`);
  if (!productUrl.startsWith(`https://wa.me/${expectedDigits}?text=`)) {
    throw new Error('Product WhatsApp URL prefix mismatch!');
  }
  if (!productUrl.includes(encodeURIComponent(sampleProduct.name))) {
    throw new Error('Product WhatsApp URL missing encoded product name!');
  }

  // 4. Specialized Helper URLs
  const generalUrl = buildGeneralWhatsAppUrl('Custom Greeting Test');
  const authUrl = buildAuthenticityInquiryWhatsAppUrl(sampleProduct.name);
  const stackUrl = buildStackConsultationWhatsAppUrl('Lean Muscle Gain');
  const storeUrl = buildStoreLocationWhatsAppUrl();

  console.log(`✓ General WhatsApp URL: ${generalUrl.substring(0, 60)}...`);
  console.log(`✓ Authenticity Inquiry URL: ${authUrl.substring(0, 60)}...`);
  console.log(`✓ Stack Consultation URL: ${stackUrl.substring(0, 60)}...`);
  console.log(`✓ Store Location URL: ${storeUrl.substring(0, 60)}...`);

  // 5. Analytics Dispatch Testing (SSR Safety Check)
  console.log('Testing Analytics tracking dispatches in Node.js environment (SSR safety)...');
  trackWhatsAppClick({
    source: 'product_card_quick_order',
    productName: sampleProduct.name,
    price: sampleVariant.priceNpr,
  });

  trackProductView({
    productId: sampleProduct.id,
    productName: sampleProduct.name,
    brand: sampleProduct.brandId,
    price: sampleVariant.priceNpr,
  });

  trackSearchQuery({
    query: 'whey protein',
    resultsCount: 5,
  });

  trackCategoryView({
    categoryId: 'proteins',
    categoryName: 'Whey Proteins',
  });

  trackLeadSubmission({
    formName: 'inquiry_form',
    city: 'Kathmandu',
  });

  console.log('✅ ALL SUB-PHASE 4.1 VALIDATION CHECKS PASSED SUCCESSFULLY!');
}

runValidation().catch((err) => {
  console.error('❌ Validation failed:', err);
  process.exit(1);
});
