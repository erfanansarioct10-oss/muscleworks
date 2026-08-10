/**
 * Programmatic Validation Script for Interactive Form Components (`src/components/forms/`)
 * Run via: npx tsx src/scripts/validate-form-components.ts
 */

Object.assign(process.env, { NODE_ENV: 'test' });

import { InquiryForm } from '../components/forms/inquiry-form';
import { ContactForm } from '../components/forms/contact-form';
import { ConsultationModal } from '../components/forms/consultation-modal';

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

function runFormComponentsValidation(): void {
  console.log('\n======================================================');
  console.log('  MUSCLEWORKS SUPPLEMENTS — FORM COMPONENTS VALIDATOR');
  console.log('======================================================\n');

  console.log('Test Suite 1: Component Export Integrity');
  assert(typeof InquiryForm === 'function', 'InquiryForm is exported as a functional component');
  assert(typeof ContactForm === 'function', 'ContactForm is exported as a functional component');
  assert(typeof ConsultationModal === 'function', 'ConsultationModal is exported as a functional component');

  console.log('\nTest Suite 2: Component Naming Standard');
  assert(InquiryForm.name === 'InquiryForm', 'InquiryForm maintains exact display name');
  assert(ContactForm.name === 'ContactForm', 'ContactForm maintains exact display name');
  assert(ConsultationModal.name === 'ConsultationModal', 'ConsultationModal maintains exact display name');

  console.log('\n======================================================');
  console.log(`  SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runFormComponentsValidation();
