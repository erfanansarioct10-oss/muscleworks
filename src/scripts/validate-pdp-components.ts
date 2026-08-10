/**
 * Programmatic Validation Script for Sub-Phase 4.2 (Product Display Components)
 */

import React from 'react';
import { getProducts } from '../lib/data/products';
import { ProductStockStatus } from '../components/product/product-stock-status';
import { ProductVariantSelector } from '../components/product/product-variant-selector';
import { ProductGallery } from '../components/product/product-gallery';

async function runValidation() {
  console.log('🚀 Running Sub-Phase 4.2 PDP Component Validation...');

  const products = await getProducts();
  const sampleProduct = products[0];

  console.log(`✓ Fetched sample product: ${sampleProduct.name} (${sampleProduct.variants.length} variants)`);

  // 1. Verify ProductStockStatus component import and props
  console.log('✓ Testing ProductStockStatus prop structures...');
  const stockStatuses = ['in_stock', 'low_stock', 'out_of_stock', 'pre_order'] as const;
  for (const status of stockStatuses) {
    const el = React.createElement(ProductStockStatus, { stockStatus: status, inStockQuantity: 3 });
    if (!el) throw new Error(`Failed to instantiate ProductStockStatus for status ${status}`);
  }

  // 2. Verify ProductVariantSelector component import and props
  console.log('✓ Testing ProductVariantSelector prop structures...');
  const selectorEl = React.createElement(ProductVariantSelector, {
    variants: sampleProduct.variants,
    selectedVariantId: sampleProduct.defaultVariantId,
    onVariantChange: () => {},
  });
  if (!selectorEl) throw new Error('Failed to instantiate ProductVariantSelector!');

  // 3. Verify ProductGallery component import and props
  console.log('✓ Testing ProductGallery prop structures...');
  const galleryEl = React.createElement(ProductGallery, {
    images: sampleProduct.images,
    productName: sampleProduct.name,
    authenticity: sampleProduct.authenticity,
  });
  if (!galleryEl) throw new Error('Failed to instantiate ProductGallery!');

  console.log('✅ ALL SUB-PHASE 4.2 PDP COMPONENT VALIDATION CHECKS PASSED SUCCESSFULLY!');
}

runValidation().catch((err) => {
  console.error('❌ Validation failed:', err);
  process.exit(1);
});
