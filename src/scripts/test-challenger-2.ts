import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { proxy } from '../proxy';
import nextConfig from '../../next.config';
import sitemap from '../app/sitemap';
import robots from '../app/robots';
import {
  getSearchIndex,
  searchProducts,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
} from '../lib/search';
import {
  escapeMarkdownV2,
  escapeMarkdownV2Code,
  buildTelegramMarkdownMessage,
} from '../lib/services/telegram';
import { getProducts } from '../lib/data/products';
import { getCategories } from '../lib/data/categories';
import { getBrands } from '../lib/data/brands';
import { getAllGuides } from '../lib/data/guides';
import { SITE_URL } from '../lib/constants';

let passedTests = 0;
let totalTests = 0;
const failureLog: string[] = [];

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    const errorMsg = `  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ''}`;
    console.error(errorMsg);
    failureLog.push(errorMsg);
  }
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('🛡️ CHALLENGER 2: EMPIRICAL STRESS & EDGE-CASE TEST HARNESS');
  console.log('====================================================\n');

  // =========================================================================
  // TASK 1: EDGE PROXY (src/proxy.ts) & SECURITY HEADERS
  // =========================================================================
  console.log('----------------------------------------------------');
  console.log('▶ TASK 1: Edge Proxy & Security Headers Verification');
  console.log('----------------------------------------------------');

  const blockedPaths = [
    '/.env',
    '/.env.local',
    '/.env.production',
    '/.git',
    '/.git/config',
    '/.git/HEAD',
    '/wp-admin',
    '/wp-admin/index.php',
    '/wp-login',
    '/wp-login.php',
    '/xmlrpc.php',
    '/phpmyadmin',
    '/admin.php',
  ];

  for (const p of blockedPaths) {
    const req = new NextRequest(`http://localhost:3000${p}`);
    const res = proxy(req);
    assert(
      res.status === 403,
      `Proxy blocks probe path '${p}' with 403 Forbidden`,
      `Got status: ${res.status}`
    );
  }

  const legitimatePaths = [
    '/',
    '/products',
    '/products/optimum-nutrition-gold-standard-100-whey',
    '/categories',
    '/categories/proteins',
    '/brands',
    '/brands/optimum-nutrition',
    '/guides',
    '/authenticity',
    '/location',
    '/contact',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
  ];

  for (const p of legitimatePaths) {
    const req = new NextRequest(`http://localhost:3000${p}`);
    const res = proxy(req);
    assert(
      res.status === 200,
      `Proxy allows legitimate path '${p}'`,
      `Got status: ${res.status}`
    );
    
    // Check security headers on response
    assert(
      res.headers.get('X-Frame-Options') === 'DENY',
      `Path '${p}' has X-Frame-Options: DENY`
    );
    assert(
      res.headers.get('X-Content-Type-Options') === 'nosniff',
      `Path '${p}' has X-Content-Type-Options: nosniff`
    );
    assert(
      res.headers.get('Referrer-Policy') === 'strict-origin-when-cross-origin',
      `Path '${p}' has Referrer-Policy: strict-origin-when-cross-origin`
    );
    assert(
      res.headers.get('X-XSS-Protection') === '1; mode=block',
      `Path '${p}' has X-XSS-Protection: 1; mode=block`
    );
    assert(
      Boolean(res.headers.get('Permissions-Policy')),
      `Path '${p}' has Permissions-Policy defined`
    );
    assert(
      res.headers.get('Strict-Transport-Security') === 'max-age=31536000; includeSubDomains; preload',
      `Path '${p}' has HSTS header defined`
    );
  }

  // Check next.config.ts headers configuration
  if (nextConfig.headers) {
    const configuredHeaders = await nextConfig.headers();
    assert(
      Array.isArray(configuredHeaders) && configuredHeaders.length > 0,
      'next.config.ts exports headers() configuration array'
    );
    const globalHeaderRule = configuredHeaders.find((h) => h.source === '/(.*)');
    assert(
      Boolean(globalHeaderRule),
      'next.config.ts has global "/(.*)" security headers rule'
    );
    if (globalHeaderRule) {
      const keys = globalHeaderRule.headers.map((h) => h.key);
      assert(keys.includes('X-Frame-Options'), 'next.config.ts includes X-Frame-Options');
      assert(keys.includes('X-Content-Type-Options'), 'next.config.ts includes X-Content-Type-Options');
      assert(keys.includes('Referrer-Policy'), 'next.config.ts includes Referrer-Policy');
      assert(keys.includes('Permissions-Policy'), 'next.config.ts includes Permissions-Policy');
    }
  }

  // =========================================================================
  // TASK 2: DYNAMIC XML SITEMAP & ROBOTS OUTPUT
  // =========================================================================
  console.log('\n----------------------------------------------------');
  console.log('▶ TASK 2: Dynamic XML Sitemap & Robots Output Verification');
  console.log('----------------------------------------------------');

  const sitemapEntries = await sitemap();
  const baseUrl = SITE_URL.replace(/\/$/, '');

  assert(
    Array.isArray(sitemapEntries) && sitemapEntries.length > 0,
    `sitemap() generates array of URLs (total: ${sitemapEntries.length})`
  );

  const staticRequired = [
    baseUrl,
    `${baseUrl}/products`,
    `${baseUrl}/categories`,
    `${baseUrl}/brands`,
    `${baseUrl}/guides`,
    `${baseUrl}/authenticity`,
    `${baseUrl}/location`,
    `${baseUrl}/contact`,
    `${baseUrl}/shipping`,
    `${baseUrl}/returns`,
    `${baseUrl}/privacy`,
    `${baseUrl}/terms`,
  ];

  for (const staticUrl of staticRequired) {
    const found = sitemapEntries.some((e) => e.url === staticUrl);
    assert(found, `Sitemap contains static route '${staticUrl}'`);
  }

  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  for (const product of products) {
    const productUrl = `${baseUrl}/products/${product.slug}`;
    const entry = sitemapEntries.find((e) => e.url === productUrl);
    assert(
      Boolean(entry),
      `Sitemap contains product '${product.name}' -> ${productUrl}`
    );
    if (entry) {
      assert(
        entry.changeFrequency === 'weekly',
        `Product '${product.slug}' changeFrequency is weekly`
      );
      assert(
        entry.priority === 0.8,
        `Product '${product.slug}' priority is 0.8`
      );
      assert(
        entry.lastModified instanceof Date,
        `Product '${product.slug}' lastModified is a valid Date`
      );
    }
  }

  for (const category of categories) {
    const catUrl = `${baseUrl}/categories/${category.slug}`;
    const entry = sitemapEntries.find((e) => e.url === catUrl);
    assert(
      Boolean(entry),
      `Sitemap contains category '${category.name}' -> ${catUrl}`
    );
  }

  for (const brand of brands) {
    const brandUrl = `${baseUrl}/brands/${brand.slug}`;
    const entry = sitemapEntries.find((e) => e.url === brandUrl);
    assert(
      Boolean(entry),
      `Sitemap contains brand '${brand.name}' -> ${brandUrl}`
    );
  }

  // Verify Robots.ts
  const robotsConfig = robots();
  assert(robotsConfig.rules !== undefined, 'robots() returns rules object');
  const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules[0] : robotsConfig.rules;
  assert(rules?.userAgent === '*', 'robots.txt specifies userAgent: *');
  assert(rules?.allow === '/', 'robots.txt allows root /');
  assert(
    Array.isArray(rules?.disallow) &&
      rules.disallow.includes('/api/') &&
      rules.disallow.includes('/_next/'),
    'robots.txt disallows /api/ and /_next/'
  );
  assert(
    robotsConfig.sitemap === `${baseUrl}/sitemap.xml`,
    `robots.txt sitemap points to ${baseUrl}/sitemap.xml`
  );

  // =========================================================================
  // TASK 3: SEARCH CONCURRENCY & FUSE.JS CACHING
  // =========================================================================
  console.log('\n----------------------------------------------------');
  console.log('▶ TASK 3: Search Concurrency & Fuse.js Caching Verification');
  console.log('----------------------------------------------------');

  // Concurrency test: 50 simultaneous calls to getSearchIndex()
  console.log('  Testing 50 simultaneous concurrent getSearchIndex() calls...');
  const indexPromises = Array.from({ length: 50 }, () => getSearchIndex());
  const resolvedIndexes = await Promise.all(indexPromises);

  const firstInstance = resolvedIndexes[0];
  const allIdentical = resolvedIndexes.every((inst) => inst === firstInstance);
  assert(
    allIdentical,
    'All 50 concurrent getSearchIndex() calls resolved to the exact same singleton Fuse instance'
  );

  // Concurrency test: 50 simultaneous calls to searchProducts()
  console.log('  Testing 50 simultaneous concurrent searchProducts() calls...');
  const searchQueries = [
    'whey',
    'creatine',
    'optimum',
    'dymatize',
    'gold standard',
    'chocolate',
    'protein',
    'vanilla',
    'mass gainer',
    'c4',
  ];
  const concurrentSearchPromises = Array.from({ length: 50 }, (_, i) =>
    searchProducts(searchQueries[i % searchQueries.length])
  );
  const searchResults = await Promise.all(concurrentSearchPromises);
  assert(
    searchResults.length === 50 && searchResults.every((res) => Array.isArray(res)),
    'All 50 concurrent search queries resolved successfully with array results'
  );

  // Query precision & fuzzy matching tests
  const wheyResults = await searchProducts('whey');
  assert(
    wheyResults.length > 0 &&
      wheyResults.some((r) => r.product.name.toLowerCase().includes('whey')),
    'Query "whey" returns relevant whey protein products'
  );

  const typoResults = await searchProducts('creatne');
  assert(
    typoResults.length > 0 &&
      typoResults.some((r) => r.product.name.toLowerCase().includes('creatine')),
    'Fuzzy matching finds "creatine" from typo "creatne"'
  );

  const brandSearch = await searchProducts('Dymatize');
  assert(
    brandSearch.length > 0 && brandSearch.some((r) => r.brandName === 'Dymatize'),
    'Brand search "Dymatize" finds Dymatize products'
  );

  const flavorSearch = await searchProducts('Double Rich Chocolate');
  assert(
    flavorSearch.length > 0,
    'Flavor search "Double Rich Chocolate" finds corresponding products'
  );

  // Edge cases
  const emptySearch = await searchProducts('');
  assert(emptySearch.length === 0, 'Empty query "" returns empty array');

  const whitespaceSearch = await searchProducts('    ');
  assert(whitespaceSearch.length === 0, 'Whitespace query "    " returns empty array');

  const specialCharsSearch = await searchProducts('!@#$%^&*()_+');
  assert(
    Array.isArray(specialCharsSearch),
    'Special character query does not throw error and returns array'
  );

  const limitedSearch = await searchProducts('protein', 2);
  assert(
    limitedSearch.length <= 2,
    `Limit parameter respected (requested 2, got ${limitedSearch.length})`
  );

  // Test Recent Searches in SSR and Mock Window
  assert(
    Array.isArray(getRecentSearches()) && getRecentSearches().length === 0,
    'getRecentSearches() returns [] in SSR mode (typeof window === "undefined")'
  );
  assert(
    Array.isArray(addRecentSearch('creatine')),
    'addRecentSearch() handles SSR without throwing'
  );

  // Mock window.localStorage
  const mockStorage: Record<string, string> = {};
  const mockLocalStorage = {
    getItem: (k: string) => mockStorage[k] || null,
    setItem: (k: string, v: string) => {
      mockStorage[k] = v;
    },
    removeItem: (k: string) => {
      delete mockStorage[k];
    },
    clear: () => {
      Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
    },
  };
  (global as unknown as { window: unknown }).window = {
    localStorage: mockLocalStorage,
  };
  (global as unknown as { localStorage: unknown }).localStorage = mockLocalStorage;

  addRecentSearch('Gold Standard');
  addRecentSearch('ISO 100');
  addRecentSearch('Creatine');
  addRecentSearch('C4 Pre-workout');
  addRecentSearch('Fish Oil');
  addRecentSearch('Serious Mass'); // 6th item should evict oldest

  const stored = getRecentSearches();
  assert(stored.length === 5, 'Recent searches capped at 5 items maximum');
  assert(stored[0] === 'Serious Mass', 'Most recent search is at index 0');
  assert(!stored.includes('Gold Standard'), 'Oldest search "Gold Standard" was evicted');

  // Test duplicate deduplication
  addRecentSearch('serious mass');
  const storedAfterDup = getRecentSearches();
  assert(
    storedAfterDup.length === 5 && storedAfterDup[0] === 'serious mass',
    'Duplicate search moved to front and deduplicated'
  );

  clearRecentSearches();
  assert(getRecentSearches().length === 0, 'clearRecentSearches() empties storage');

  // Clean up global mock
  delete (global as unknown as { window?: unknown }).window;
  delete (global as unknown as { localStorage?: unknown }).localStorage;

  // =========================================================================
  // TASK 4: TELEGRAM MARKDOWNV2 ENTITY ESCAPING
  // =========================================================================
  console.log('\n----------------------------------------------------');
  console.log('▶ TASK 4: Telegram MarkdownV2 Entity Escaping Verification');
  console.log('----------------------------------------------------');

  // Test escapeMarkdownV2 on normal text
  const reservedText = '_ * [ ] ( ) ~ ` > # + - = | { } . ! \\';
  const escapedText = escapeMarkdownV2(reservedText);
  const expectedText = '\\_ \\* \\[ \\] \\( \\) \\~ \\` \\> \\# \\+ \\- \\= \\| \\{ \\} \\. \\! \\\\';
  assert(
    escapedText === expectedText,
    'escapeMarkdownV2() correctly escapes all 18 Telegram MarkdownV2 reserved characters'
  );

  // Test escapeMarkdownV2Code on code blocks (only ` and \ must be escaped)
  const codeWithSpecialChars = '+977 986-1725036 | ON-WHEY-5LB-CHOC | INQ_2026-001 | 100% Whey!';
  const escapedCode = escapeMarkdownV2Code(codeWithSpecialChars);
  assert(
    escapedCode === codeWithSpecialChars,
    'escapeMarkdownV2Code() preserves +, -, _, |, !, %, spaces in code entities without backslashes'
  );

  const codeWithBacktickAndSlash = 'SKU`123\\TEST';
  const escapedCodeSpecial = escapeMarkdownV2Code(codeWithBacktickAndSlash);
  assert(
    escapedCodeSpecial === 'SKU\\`123\\\\TEST',
    'escapeMarkdownV2Code() correctly escapes ` and \\'
  );

  // Test buildTelegramMarkdownMessage formatting
  const testPayload = {
    inquiryId: 'INQ-7788',
    fullName: 'Erfan Ansari (Athlete & Trainer)',
    phoneNumber: '+977 986-1725036',
    email: 'erfan.ansari@example.com',
    inquiryType: 'product_inquiry',
    message: 'Can I get 2 tubs of ON Whey 5lb (Chocolate) + 1 Creatine? Price discount > 10%?',
    deliveryCity: 'Kathmandu (Golfutar area)',
    preferredContactMethod: 'whatsapp',
    productContext: {
      productId: 'optimum-nutrition-gold-standard-100-whey',
      productName: 'Gold Standard 100% Whey [Double Rich Choc]',
      variantSku: 'ON-WHEY-5LB-CHOC_V2',
      variantLabel: '5 lbs / Double Rich Chocolate',
      priceNpr: 11500,
    },
    submittedAt: '2026-08-15T09:30:00.000Z',
  };

  const telegramMsg = buildTelegramMarkdownMessage(testPayload);

  // Verify header and formatting
  assert(
    telegramMsg.includes('*🚨 NEW CUSTOMER INQUIRY — MUSCLEWORKS*'),
    'Header is formatted as bold Markdown'
  );
  assert(
    telegramMsg.includes('`+977 986-1725036`'),
    'Phone number is in code block without internal backslashes'
  );
  assert(
    telegramMsg.includes('`ON-WHEY-5LB-CHOC_V2`'),
    'SKU is in code block without internal backslashes'
  );
  assert(
    telegramMsg.includes('`INQ-7788`'),
    'Inquiry ID is in code block without internal backslashes'
  );
  assert(
    telegramMsg.includes('Double Rich Choc\\]'),
    'Product name in normal text has bracket escaped'
  );
  assert(
    telegramMsg.includes('Athlete & Trainer\\)'),
    'Customer name in normal text has parenthesis escaped'
  );
  assert(
    telegramMsg.includes('\\> 10%'),
    'Customer message has > escaped in normal text'
  );

  // Verify minimal payload without product context
  const minimalPayload = {
    inquiryId: 'INQ-1000',
    fullName: 'John Doe',
    phoneNumber: '9841234567',
    inquiryType: 'general',
    message: 'Store location inquiry',
  };
  const minimalMsg = buildTelegramMarkdownMessage(minimalPayload);
  assert(
    minimalMsg.includes('`9841234567`') && minimalMsg.includes('`INQ-1000`'),
    'Minimal payload builds valid Telegram message without errors'
  );

  // =========================================================================
  // TASK 5: MEDIA ASSET PRESENCE & INTEGRITY
  // =========================================================================
  console.log('\n----------------------------------------------------');
  console.log('▶ TASK 5: Media Asset Presence & Integrity Verification');
  console.log('----------------------------------------------------');

  const publicRoot = path.resolve(__dirname, '../../public');

  function checkFileExists(relPath: string, description: string) {
    const cleanPath = relPath.startsWith('/') ? relPath.slice(1) : relPath;
    const fullPath = path.join(publicRoot, cleanPath);
    const exists = fs.existsSync(fullPath);
    if (!exists) {
      assert(false, `${description}: '${relPath}' exists in public/`, `File not found at ${fullPath}`);
      return false;
    }
    const stat = fs.statSync(fullPath);
    const hasSize = stat.size > 0;
    assert(hasSize, `${description}: '${relPath}' has size > 0 bytes (${stat.size} bytes)`);
    return exists && hasSize;
  }

  // 1. Check Brands JSON
  console.log('  Checking Brand logos...');
  for (const brand of brands) {
    if (brand.logo?.url) {
      checkFileExists(brand.logo.url, `Brand '${brand.name}' logo`);
    }
  }

  // 2. Check Categories JSON
  console.log('  Checking Category hero images...');
  for (const category of categories) {
    if (category.heroImage?.url) {
      checkFileExists(category.heroImage.url, `Category '${category.name}' image`);
    }
  }

  // 3. Check Products JSON
  console.log('  Checking Product images & thumbnails...');
  for (const product of products) {
    if (Array.isArray(product.images)) {
      product.images.forEach((img, idx) => {
        if (img?.url) {
          checkFileExists(img.url, `Product '${product.name}' image [${idx}]`);
        }
      });
    }
  }

  // 4. Check Guides JSON
  console.log('  Checking Guide cover images and author avatars...');
  const guides = await getAllGuides();
  for (const guide of guides) {
    if (guide.coverImage?.url) {
      checkFileExists(guide.coverImage.url, `Guide '${guide.title}' coverImage`);
    }
    if (guide.author?.avatar) {
      checkFileExists(guide.author.avatar, `Guide '${guide.title}' author avatar`);
    }
  }

  // 5. Check Fallback placeholders and core assets
  console.log('  Checking Fallback placeholders and core branding assets...');
  checkFileExists('/images/placeholders/product-placeholder.svg', 'Product fallback placeholder');
  checkFileExists('/images/products/placeholder.svg', 'Product placeholder SVG');
  checkFileExists('/brnding-assets/logo.webp', 'Branding logo WebP');
  checkFileExists('/brnding-assets/favicon.webp', 'Branding favicon WebP');

  // =========================================================================
  // SUMMARY SCORECARD
  // =========================================================================
  console.log('\n====================================================');
  console.log(`📊 CHALLENGER 2 SUITE RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
  console.log('====================================================');

  if (failureLog.length > 0) {
    console.error('\n❌ FAILURES RECORDED:');
    failureLog.forEach((f) => console.error(f));
    process.exit(1);
  } else {
    console.log('\n🎉 ALL EMPIRICAL VERIFICATIONS PASSED WITH ZERO FAILURES!\n');
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test suite exception:', err);
  process.exit(1);
});
