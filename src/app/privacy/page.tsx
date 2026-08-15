import type { Metadata } from 'next';
import Link from 'next/link';
import { STORE_NAME, STORE_EMAIL, STORE_PHONE, STORE_LOCATION, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy | MUSCLEWORKS Nepal',
  description: 'Our privacy commitments and how MUSCLEWORKS protects your personal data, WhatsApp contact information, and delivery details in Nepal.',
  openGraph: {
    title: `Privacy Policy | ${STORE_NAME}`,
    description: 'Learn how your personal inquiry and delivery details are safeguarded.',
    url: `${SITE_URL}/privacy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-background py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Privacy Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-border pb-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-foreground">
            PRIVACY POLICY
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Effective Date: August 1, 2026 | Last Updated: August 15, 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              1. Overview &amp; Commitment
            </h2>
            <p>
              {STORE_NAME} (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates the website{' '}
              <strong className="text-foreground">{SITE_URL}</strong> and the physical retail store located at{' '}
              {STORE_LOCATION.street}, {STORE_LOCATION.area}, {STORE_LOCATION.city}, Nepal. We respect your personal privacy and are committed to protecting the personal information you share with us through our website, WhatsApp hotline, phone calls, and in-store consultations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              2. Information We Collect
            </h2>
            <p>When you browse our catalog or submit an inquiry, we may collect:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li><strong className="text-foreground">Contact Details:</strong> Full name, Nepal mobile phone number (+977), and optional email address.</li>
              <li><strong className="text-foreground">Delivery Information:</strong> Delivery city, recipient address, and landmark notes in Kathmandu Valley or nationwide courier locations.</li>
              <li><strong className="text-foreground">Inquiry &amp; Order Preferences:</strong> Supplement preferences, requested flavors, container sizes, and questions submitted via our forms or WhatsApp links.</li>
              <li><strong className="text-foreground">Technical Device Data:</strong> Anonymized IP addresses for rate limiting and spam defense, browser user agent, and basic analytics cookies.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              3. How We Use Your Information
            </h2>
            <p>Your information is used strictly to:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>Fulfill customer inquiries, verify stock availability, and coordinate direct WhatsApp / phone orders.</li>
              <li>Dispatch delivery riders within Kathmandu, Lalitpur, and Bhaktapur, or arrange nationwide courier delivery.</li>
              <li>Verify product authenticity hologram codes upon customer request.</li>
              <li>Prevent automated bot spam, protect server infrastructure, and enforce rate limits.</li>
            </ul>
            <p className="font-medium text-foreground">
              We NEVER sell, rent, trade, or share your personal phone number or email with third-party marketing companies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              4. WhatsApp &amp; Third-Party Services
            </h2>
            <p>
              When you initiate an inquiry via WhatsApp, communications take place across WhatsApp&apos;s end-to-end encrypted messaging infrastructure. We do not store credit card or payment credentials on our web servers. Payments in Nepal are settled upon Cash on Delivery (COD) or via direct QR transfer (eSewa / Khalti / Fonepay) during dispatch.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              5. Data Security &amp; Retention
            </h2>
            <p>
              Inquiry submissions are transmitted over encrypted HTTPS (TLS 1.3). We employ honeypot traps, timing trap validation, IP extraction filters, and automated rate limiting to protect our customer database against malicious access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              6. Your Privacy Rights &amp; Contact
            </h2>
            <p>
              You have the right to request access to, correction of, or deletion of your contact records at any time. For privacy inquiries or data removal, please contact:
            </p>
            <div className="rounded-xl border border-border bg-card p-4 space-y-1 text-xs text-muted-foreground">
              <p><strong className="text-foreground">{STORE_NAME} Privacy Desk</strong></p>
              <p>Location: {STORE_LOCATION.street}, {STORE_LOCATION.area}, {STORE_LOCATION.city}, Nepal</p>
              <p>Phone / WhatsApp: {STORE_PHONE}</p>
              <p>Email: {STORE_EMAIL}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
