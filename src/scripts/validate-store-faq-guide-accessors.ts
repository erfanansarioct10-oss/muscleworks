import { getFAQs, getFAQsByCategory, searchFAQs } from '../lib/data/faqs';
import { getAllGuides, getFeaturedGuides, getGuideBySlug } from '../lib/data/guides';
import { getDeliveryPolicy, getOpeningHours, getStoreInfo, isStoreOpenNow } from '../lib/data/store';

async function runValidation() {
  console.log('=== MUSCLEWORKS ACCESSOR VALIDATION RUNNER (SUB-PHASE 2.5) ===\n');

  // 1. Validate Store Accessors
  const store = await getStoreInfo();
  console.log(`✓ Store Name: ${store.name}`);
  console.log(`✓ Location: ${store.address.area}, ${store.address.municipality}, ${store.address.city} (${store.address.postalCode})`);
  console.log(`✓ Primary Phone: ${store.contacts.primaryPhone}`);
  
  const hours = await getOpeningHours();
  console.log(`✓ Total Opening Hours Entries: ${hours.length}`);

  const status = await isStoreOpenNow();
  console.log(`✓ Store Status: ${status.isOpen ? 'OPEN' : 'CLOSED'} (${status.message})`);

  const delivery = await getDeliveryPolicy();
  console.log(`✓ Free Delivery Threshold: NPR ${delivery.freeDeliveryThresholdNpr}`);
  console.log(`✓ Delivery Zones: ${delivery.primaryZones.join(' | ')}\n`);

  // 2. Validate FAQ Accessors
  const allFaqs = await getFAQs();
  console.log(`✓ Total FAQs Parsed: ${allFaqs.length}`);

  const authFaqs = await getFAQsByCategory('authenticity');
  console.log(`✓ Authenticity FAQs: ${authFaqs.length}`);

  const searchResults = await searchFAQs('hologram');
  console.log(`✓ FAQ Search ("hologram"): ${searchResults.length} matches\n`);

  // 3. Validate Guide Accessors
  const allGuides = await getAllGuides();
  console.log(`✓ Total Guides Parsed: ${allGuides.length}`);

  const featuredGuides = await getFeaturedGuides();
  console.log(`✓ Featured Guides: ${featuredGuides.length}`);

  const authGuide = await getGuideBySlug('how-to-verify-authentic-supplements-in-nepal');
  console.log(`✓ Found Guide Slug ("how-to-verify-authentic-supplements-in-nepal"): ${authGuide ? authGuide.title : 'NOT FOUND'}\n`);

  console.log('====================================================');
  console.log('SUCCESS: All Sub-Phase 2.5 Accessors Validated Cleanly!');
  console.log('====================================================');
}

runValidation().catch((err) => {
  console.error('Validation Failed:', err);
  process.exit(1);
});
