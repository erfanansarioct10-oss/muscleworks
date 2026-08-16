import fs from 'fs';
import path from 'path';

const root = path.resolve('.');

function checkUsage(symbolName, definitionFile) {
  const srcFiles = [];
  function walk(d) {
    fs.readdirSync(d).forEach(f => {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) {
        if (f !== 'node_modules' && f !== '.next' && f !== '.git' && f !== '.agents' && f !== 'graphify-out') walk(p);
      } else if (/\.(tsx?|jsx?|json|mdx?)$/.test(f)) {
        srcFiles.push(p);
      }
    });
  }
  walk(root);

  const usageInSrc = [];
  const usageInScripts = [];
  const usageInApp = [];
  const usageInComponents = [];
  const usageInActions = [];
  const usageInLib = [];

  srcFiles.forEach(f => {
    const rel = path.relative(root, f).replace(/\\/g, '/');
    if (rel === definitionFile) return;
    const content = fs.readFileSync(f, 'utf8');
    const regex = new RegExp(`\\b${symbolName}\\b`, 'g');
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      if (rel.startsWith('src/scripts/') || rel.startsWith('scripts/')) {
        usageInScripts.push({ file: rel, count: matches.length });
      } else {
        usageInSrc.push({ file: rel, count: matches.length });
        if (rel.startsWith('src/app/')) usageInApp.push(rel);
        if (rel.startsWith('src/components/')) usageInComponents.push(rel);
        if (rel.startsWith('src/actions/')) usageInActions.push(rel);
        if (rel.startsWith('src/lib/')) usageInLib.push(rel);
      }
    }
  });

  return {
    symbolName,
    definitionFile,
    totalSrcRefs: usageInSrc.length,
    totalScriptRefs: usageInScripts.length,
    usageInSrc,
    usageInScripts,
    usageInApp,
    usageInComponents,
    usageInActions,
    usageInLib
  };
}

const symbolsToCheck = [
  { sym: 'submitContactForm', file: 'src/actions/contact.ts' },
  { sym: 'submitInquiry', file: 'src/actions/inquiry.ts' },
  { sym: 'ConsultationModal', file: 'src/components/forms/consultation-modal.tsx' },
  { sym: 'ActionError', file: 'src/types/actions.ts' },
  { sym: 'ActionSuccess', file: 'src/types/actions.ts' },
  { sym: 'InquiryPayload', file: 'src/types/actions.ts' },
  { sym: 'Review', file: 'src/types/review.ts' },
  { sym: 'getGuides', file: 'src/lib/data/guides.ts' },
  { sym: 'getAllGuides', file: 'src/lib/data/guides.ts' },
  { sym: 'getRelatedGuides', file: 'src/lib/data/guides.ts' },
  { sym: 'getGuidesByCategory', file: 'src/lib/data/guides.ts' },
  { sym: 'getFAQById', file: 'src/lib/data/faqs.ts' },
  { sym: 'getFeaturedFAQs', file: 'src/lib/data/faqs.ts' },
  { sym: 'getFAQsByCategory', file: 'src/lib/data/faqs.ts' },
  { sym: 'getTodayOpeningHours', file: 'src/lib/data/store.ts' },
  { sym: 'getDeliveryPolicy', file: 'src/lib/data/store.ts' },
  { sym: 'getProductById', file: 'src/lib/data/products.ts' },
  { sym: 'getFeaturedProducts', file: 'src/lib/data/products.ts' },
  { sym: 'searchProductsInMemory', file: 'src/lib/data/products.ts' },
  { sym: 'getFeaturedBrands', file: 'src/lib/data/brands.ts' },
  { sym: 'getFeaturedCategories', file: 'src/lib/data/categories.ts' },
  { sym: 'slugify', file: 'src/lib/utils.ts' },
  { sym: 'sanitizeDigitsOnly', file: 'src/lib/utils.ts' },
  { sym: 'formatPhoneNumber', file: 'src/lib/utils.ts' },
  { sym: 'truncateText', file: 'src/lib/utils.ts' },
  { sym: 'resolveVariantPricing', file: 'src/components/product/product-sticky-bar.tsx' },
  { sym: 'ProductGridEmpty', file: 'src/components/product/product-grid.tsx' },
  { sym: 'showSuccessToast', file: 'src/components/ui/toast.tsx' },
  { sym: 'showErrorToast', file: 'src/components/ui/toast.tsx' },
  { sym: 'showInfoToast', file: 'src/components/ui/toast.tsx' },
  { sym: 'showWarningToast', file: 'src/components/ui/toast.tsx' },
  { sym: 'showWhatsAppToast', file: 'src/components/ui/toast.tsx' },
  { sym: 'trackProductView', file: 'src/lib/analytics.ts' },
  { sym: 'trackSearchQuery', file: 'src/lib/analytics.ts' },
  { sym: 'trackCategoryView', file: 'src/lib/analytics.ts' },
  { sym: 'trackLeadSubmission', file: 'src/lib/analytics.ts' },
  { sym: 'trackEvent', file: 'src/lib/analytics.ts' },
  { sym: 'buildStackConsultationWhatsAppUrl', file: 'src/lib/whatsapp.ts' },
  { sym: 'escapeMarkdownV2', file: 'src/lib/services/telegram.ts' },
  { sym: 'escapeMarkdownV2Code', file: 'src/lib/services/telegram.ts' },
  { sym: 'buildTelegramMarkdownMessage', file: 'src/lib/services/telegram.ts' },
  { sym: 'isHoneypotTriggered', file: 'src/lib/services/security.ts' },
  { sym: 'isTimingTrapTriggered', file: 'src/lib/services/security.ts' },
  { sym: 'sanitizeTextInput', file: 'src/lib/services/security.ts' },
  { sym: 'verifySecurityContext', file: 'src/lib/services/security.ts' },
  { sym: 'clearInMemoryRateLimitCache', file: 'src/lib/services/ratelimit.ts' },
  { sym: 'getClientIp', file: 'src/lib/services/ratelimit.ts' }
];

console.log('=== DETAILED USAGE ANALYSIS ===');
symbolsToCheck.forEach(item => {
  const res = checkUsage(item.sym, item.file);
  console.log(`\nSymbol: ${item.sym} (${item.file})`);
  console.log(`  Production refs: ${res.totalSrcRefs} (${res.usageInSrc.map(x => x.file).join(', ') || 'NONE'})`);
  console.log(`  Script/Test refs: ${res.totalScriptRefs} (${res.usageInScripts.map(x => x.file).join(', ') || 'NONE'})`);
});
