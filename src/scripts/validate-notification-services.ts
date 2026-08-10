import {
  escapeMarkdownV2,
  buildTelegramMarkdownMessage,
  sendTelegramAlert,
} from '../lib/services/telegram';
import { sendInquiryEmails } from '../lib/services/resend';
import { render } from '@react-email/components';
import CustomerInquiryConfirmation from '../emails/CustomerInquiryConfirmation';
import AdminInquiryAlert from '../emails/AdminInquiryAlert';

(process.env as Record<string, string>).NODE_ENV = 'development';

async function runValidation() {
  console.log('----------------------------------------------------');
  console.log('🧪 MUSCLEWORKS SUB-PHASE 5.2 VALIDATION SUITE');
  console.log('----------------------------------------------------\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  // TEST GROUP 1: Telegram MarkdownV2 Escaping
  console.log('▶ Test Group 1: Telegram MarkdownV2 Character Escaping');
  const specialChars = 'Hello *World*! [Link](url) _test_ ~strike~ #tag +1 -2 =3 | {val} .';
  const escaped = escapeMarkdownV2(specialChars);
  assert(
    escaped.includes('\\*World\\*') && escaped.includes('\\[Link\\]') && escaped.includes('\\_test\\_'),
    'Escapes asterisks, brackets, and underscores'
  );
  assert(escaped.includes('\\.') && escaped.includes('\\!') && escaped.includes('\\+1'), 'Escapes dots, exclamations, and plus signs');

  // TEST GROUP 2: Telegram Message Formatting
  console.log('\n▶ Test Group 2: Telegram Message Payload Formatting');
  const samplePayload = {
    inquiryId: 'INQ-9901',
    fullName: 'Erfan Ansari',
    phoneNumber: '+977 9801234567',
    email: 'erfan@example.com',
    inquiryType: 'product_inquiry',
    message: 'Is Gold Standard Whey in stock at Golfutar?',
    deliveryCity: 'Kathmandu',
    productContext: {
      productName: 'Gold Standard 100% Whey Protein',
      variantSku: 'ON-WHEY-5LB-CHOC',
      variantLabel: '5 lbs / Chocolate',
      priceNpr: 11500,
    },
  };

  const telegramMsg = buildTelegramMarkdownMessage(samplePayload);
  assert(telegramMsg.includes('*🚨 NEW CUSTOMER INQUIRY — MUSCLEWORKS*'), 'Includes formatted bold title header');
  assert(telegramMsg.includes('Erfan Ansari'), 'Includes escaped customer name');
  assert(telegramMsg.includes('ON-WHEY-5LB-CHOC'), 'Includes product SKU');
  assert(telegramMsg.includes('11,500'), 'Includes formatted NPR price');

  const tgResult = await sendTelegramAlert(samplePayload);
  assert(tgResult.success === true, 'Telegram dispatcher handles dev mode without credentials gracefully');

  // TEST GROUP 3: React Email Template HTML Compilation
  console.log('\n▶ Test Group 3: React Email HTML Template Rendering');
  const customerEmailHtml = await render(
    CustomerInquiryConfirmation({
      inquiryId: 'INQ-9901',
      fullName: 'Erfan Ansari',
      phoneNumber: '+977 9801234567',
      inquiryType: 'product_inquiry',
      message: 'Checking stock at Golfutar.',
      deliveryCity: 'Kathmandu',
      productName: 'Gold Standard 100% Whey Protein',
      priceFormatted: 'NPR 11,500',
    })
  );

  assert(customerEmailHtml.includes('MUSCLEWORKS SUPPLEMENTS'), 'Customer email HTML contains brand header');
  assert(customerEmailHtml.includes('Golfutar, Budha-Nilkantha, Kathmandu'), 'Customer email HTML contains physical store address');
  assert(customerEmailHtml.includes('INQ-9901'), 'Customer email HTML contains inquiry reference ID');

  const adminEmailHtml = await render(
    AdminInquiryAlert({
      inquiryId: 'INQ-9901',
      fullName: 'Erfan Ansari',
      phoneNumber: '+977 9801234567',
      email: 'erfan@example.com',
      inquiryType: 'product_inquiry',
      message: 'Checking stock at Golfutar.',
      deliveryCity: 'Kathmandu',
      productName: 'Gold Standard 100% Whey Protein',
      priceFormatted: 'NPR 11,500',
    })
  );

  assert(adminEmailHtml.includes('HIGH-PRIORITY STORE LEAD'), 'Admin email HTML contains alert badge');
  assert(adminEmailHtml.includes('tel:+977 9801234567'), 'Admin email HTML contains direct call trigger link');

  // TEST GROUP 4: Resend Email Service Fallback
  console.log('\n▶ Test Group 4: Resend Service Dev Fallback Dispatch');
  const resendResult = await sendInquiryEmails(samplePayload);
  assert(resendResult.customerEmailSent === true, 'Customer confirmation email flag returns true in dev mode');
  assert(resendResult.adminEmailSent === true, 'Admin alert email flag returns true in dev mode');
  assert(resendResult.errors.length === 0, 'No error messages reported in dev mode execution');

  console.log('\n----------------------------------------------------');
  console.log(`RESULTS: ${passedTests} / ${totalTests} tests passed.`);
  console.log('----------------------------------------------------');

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runValidation().catch((err) => {
  console.error('Notification validation script failed:', err);
  process.exit(1);
});
