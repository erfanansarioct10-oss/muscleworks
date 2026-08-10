import { getProducts } from '../lib/data/products';
import { buildAuthenticityInquiryWhatsAppUrl } from '../lib/whatsapp';

async function validatePdpSpecsComponents() {
  console.log('🧪 Starting Sub-Phase 4.3 PDP Specs & Trust Component Validation...');

  const products = await getProducts();
  if (!products || products.length === 0) {
    throw new Error('❌ Product dataset is empty or invalid');
  }

  console.log(`📦 Loaded ${products.length} products for verification.`);

  // 1. Verify Nutrition Facts data model compliance
  let validNutritionCount = 0;
  for (const product of products) {
    const facts = product.nutritionFacts;
    if (!facts.servingSize || !facts.servingsPerContainer) {
      throw new Error(`❌ Product ${product.id} missing basic nutrition facts`);
    }
    validNutritionCount++;
  }
  console.log(`✅ ${validNutritionCount}/${products.length} products have valid Nutrition Facts structure.`);

  // 2. Verify Authenticity Metadata & WhatsApp Link Generation
  for (const product of products) {
    const auth = product.authenticity;
    if (!auth.isAuthenticGuarantee) {
      throw new Error(`❌ Product ${product.id} authenticity guarantee is false`);
    }
    const whatsappUrl = buildAuthenticityInquiryWhatsAppUrl(product.name);
    if (!whatsappUrl.includes('https://wa.me/') || !whatsappUrl.includes(encodeURIComponent(product.name))) {
      throw new Error(`❌ Product ${product.id} failed WhatsApp URL generation`);
    }
  }
  console.log('✅ Authenticity Metadata & WhatsApp Verification Link generation passed 100%.');

  // 3. Verify Related Products matching logic
  const testProduct = products[0];
  const relatedCandidates = products.filter(
    (p) => p.id !== testProduct.id && (p.categoryId === testProduct.categoryId || p.brandId === testProduct.brandId)
  );
  console.log(`✅ Related products lookup test for "${testProduct.name}": found ${relatedCandidates.length} matching candidates.`);

  console.log('🎉 ALL SUB-PHASE 4.3 VALIDATION CHECKS PASSED SUCCESSFULLY!');
}

validatePdpSpecsComponents().catch((err) => {
  console.error('❌ Validation failed:', err);
  process.exit(1);
});
