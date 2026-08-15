/**
 * Programmatic Validation Script for Location & Contact Components (`src/components/location/`)
 * Run via: npx tsx src/scripts/validate-location-components.ts
 */

Object.assign(process.env, { NODE_ENV: 'test' });

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string): void {
  if (condition) {
    console.log(`  ✓ PASSED: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAILED: ${testName}`);
    if (detail) console.error(`    Detail: ${detail}`);
    failed++;
  }
}

async function runLocationValidation(): Promise<void> {
  const { StoreMapEmbed } = await import('../components/location/store-map-embed');
  const { StoreHoursCard } = await import('../components/location/store-hours-card');
  const { default: ContactPage, metadata: contactMetadata } = await import('../app/(marketing)/contact/page');
  const { default: LocationPage, metadata: locationMetadata } = await import('../app/(marketing)/location/page');
  const { default: rawStoreData } = await import('../../data/store-info.json');

  console.log('\n======================================================');
  console.log('  MUSCLEWORKS SUPPLEMENTS — LOCATION COMPONENTS VALIDATOR');
  console.log('======================================================\n');

  console.log('Test Suite 1: Component & Route Export Integrity');
  assert(typeof StoreMapEmbed === 'function', 'StoreMapEmbed is exported as a functional component');
  assert(typeof StoreHoursCard === 'function', 'StoreHoursCard is exported as a functional component');
  assert(typeof ContactPage === 'function', 'ContactPage is exported as a default page component');
  assert(typeof LocationPage === 'function', 'LocationPage is exported as a default page component');

  console.log('\nTest Suite 2: SEO Metadata Verification');
  assert(
    typeof contactMetadata.title === 'string' && contactMetadata.title.includes('MuscleWorks'),
    'Contact page metadata contains descriptive title'
  );
  assert(
    typeof locationMetadata.title === 'string' && locationMetadata.title.includes('Golfutar'),
    'Location page metadata contains Golfutar store title'
  );

  console.log('\nTest Suite 3: Store Data Dataset Contracts');
  assert(rawStoreData.address.area === 'Golfutar', 'Store address area is Golfutar');
  assert(rawStoreData.address.city === 'Kathmandu', 'Store address city is Kathmandu');
  assert(rawStoreData.coordinates.latitude === 27.7525222, 'Store latitude is 27.7525222');
  assert(rawStoreData.coordinates.longitude === 85.3467945, 'Store longitude is 85.3467945');

  console.log('\n======================================================');
  console.log(`  SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runLocationValidation();

export {};
