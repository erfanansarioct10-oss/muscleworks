import { Resend } from 'resend';
import { render } from '@react-email/components';
import CustomerInquiryConfirmation from '../../emails/CustomerInquiryConfirmation';
import AdminInquiryAlert from '../../emails/AdminInquiryAlert';
import { formatNprPrice } from '../utils';

export interface InquiryEmailDispatchPayload {
  inquiryId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  inquiryType: string;
  message: string;
  preferredContactMethod?: string;
  deliveryCity?: string;
  productContext?: {
    productId?: string;
    productName: string;
    productSlug?: string;
    variantSku?: string;
    variantLabel?: string;
    priceNpr?: number;
  };
  submittedAt?: string;
}

export interface EmailDispatchResult {
  customerEmailSent: boolean;
  adminEmailSent: boolean;
  errors: string[];
}

/**
 * Multi-channel email dispatcher leveraging Resend SDK to send customer receipts
 * and admin alert emails concurrently.
 */
export async function sendInquiryEmails(
  payload: InquiryEmailDispatchPayload
): Promise<EmailDispatchResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'MUSCLEWORKS <onboarding@resend.dev>';
  const adminEmail = process.env.STORE_ADMIN_EMAIL || 'admin@muscleworksnepal.com';

  const priceFormatted = payload.productContext?.priceNpr
    ? formatNprPrice(payload.productContext.priceNpr)
    : undefined;

  // Render React Email templates
  const customerEmailComponent = CustomerInquiryConfirmation({
    inquiryId: payload.inquiryId,
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
    inquiryType: payload.inquiryType,
    message: payload.message,
    deliveryCity: payload.deliveryCity,
    productName: payload.productContext?.productName,
    variantLabel: payload.productContext?.variantLabel,
    priceFormatted,
  });

  const adminEmailComponent = AdminInquiryAlert({
    inquiryId: payload.inquiryId,
    fullName: payload.fullName,
    phoneNumber: payload.phoneNumber,
    email: payload.email,
    inquiryType: payload.inquiryType,
    message: payload.message,
    preferredContactMethod: payload.preferredContactMethod,
    deliveryCity: payload.deliveryCity,
    productName: payload.productContext?.productName,
    variantLabel: payload.productContext?.variantLabel,
    priceFormatted,
    submittedAt: payload.submittedAt || new Date().toISOString(),
  });

  const hasApiKey = Boolean(apiKey);

  if (!hasApiKey) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      const customerHtml = await render(customerEmailComponent);
      const adminHtml = await render(adminEmailComponent);

      console.log('\n--- [RESEND DEV LOG: CUSTOMER CONFIRMATION EMAIL] ---');
      console.log(`Customer Email Supplied: ${payload.email ? 'Yes' : 'No'}`);
      console.log(`Length: ${customerHtml.length} chars rendered`);
      console.log('-----------------------------------------------------\n');

      console.log('--- [RESEND DEV LOG: ADMIN ALERT EMAIL] ---');
      console.log(`To: ${adminEmail}`);
      console.log(`Length: ${adminHtml.length} chars rendered`);
      console.log('-------------------------------------------\n');

      return {
        customerEmailSent: Boolean(payload.email),
        adminEmailSent: true,
        errors: [],
      };
    }

    console.error('[Resend Service Error] Missing RESEND_API_KEY in production.');
    return {
      customerEmailSent: false,
      adminEmailSent: false,
      errors: ['RESEND_API_KEY environment variable is unconfigured'],
    };
  }

  const resend = new Resend(apiKey);
  const dispatchPromises: Array<Promise<{ type: 'customer' | 'admin'; success: boolean; error?: string }>> = [];

  // Dispatch Customer Confirmation Email (if email address provided)
  if (payload.email) {
    dispatchPromises.push(
      resend.emails
        .send({
          from: fromEmail,
          to: payload.email,
          subject: `Inquiry Receipt Confirmed (#${payload.inquiryId}) — MUSCLEWORKS Nepal`,
          react: customerEmailComponent,
        })
        .then((res) => {
          if (res.error) {
            return { type: 'customer' as const, success: false, error: res.error.message };
          }
          return { type: 'customer' as const, success: true };
        })
        .catch((err) => ({
          type: 'customer' as const,
          success: false,
          error: err instanceof Error ? err.message : 'Customer email dispatch failed',
        }))
    );
  }

  // Dispatch Admin Alert Email
  dispatchPromises.push(
    resend.emails
      .send({
        from: fromEmail,
        to: adminEmail,
        subject: `🚨 Store Lead Alert (#${payload.inquiryId}): ${payload.fullName}`,
        react: adminEmailComponent,
      })
      .then((res) => {
        if (res.error) {
          return { type: 'admin' as const, success: false, error: res.error.message };
        }
        return { type: 'admin' as const, success: true };
      })
      .catch((err) => ({
        type: 'admin' as const,
        success: false,
        error: err instanceof Error ? err.message : 'Admin email dispatch failed',
      }))
  );

  const results = await Promise.allSettled(dispatchPromises);

  let customerEmailSent = false;
  let adminEmailSent = false;
  const errors: string[] = [];

  for (const res of results) {
    if (res.status === 'fulfilled') {
      if (res.value.type === 'customer') {
        customerEmailSent = res.value.success;
        if (res.value.error) errors.push(`Customer Email Error: ${res.value.error}`);
      } else if (res.value.type === 'admin') {
        adminEmailSent = res.value.success;
        if (res.value.error) errors.push(`Admin Email Error: ${res.value.error}`);
      }
    } else {
      errors.push(`Email Dispatch Rejected: ${res.reason}`);
    }
  }

  return {
    customerEmailSent,
    adminEmailSent,
    errors,
  };
}
