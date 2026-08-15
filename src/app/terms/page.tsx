import type { Metadata } from 'next';
import Link from 'next/link';
import { STORE_NAME, STORE_PHONE, STORE_EMAIL, SITE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms of Service | MUSCLEWORKS Nepal',
  description: 'Terms of service, pricing policies, authenticity representations, and order inquiry conditions for MUSCLEWORKS Nepal.',
  openGraph: {
    title: `Terms of Service | ${STORE_NAME}`,
    description: 'Terms and conditions governing supplement inquiries, authenticity guarantees, and store policies.',
    url: `${SITE_URL}/terms`,
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="w-full bg-background py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Terms of Service</span>
        </div>

        {/* Header */}
        <div className="border-b border-border pb-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-foreground">
            TERMS OF SERVICE
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Effective Date: August 1, 2026 | Last Updated: August 15, 2026
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using <strong className="text-foreground">{SITE_URL}</strong> or engaging with {STORE_NAME} via WhatsApp, telephone, email, or in our physical retail store at Golfutar, Kathmandu, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              2. Catalog Information &amp; Pricing
            </h2>
            <p>
              All supplement prices are listed in Nepalese Rupees (NPR) and include applicable national taxes. While we strive to maintain 100% real-time stock and price accuracy, pricing and variant availability may adjust due to manufacturer import tariffs, international shipping costs, and currency exchange rates. Final pricing is confirmed when our sales desk processes your order via WhatsApp or phone.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              3. 100% Authenticity Guarantee
            </h2>
            <p>
              {STORE_NAME} guarantees that all products offered are 100% genuine, sourced directly through authorized national importers in Nepal with authentic holographic security seals and scratch QR verification codes. If any sealed product purchased from our store is proven counterfeit by an authorized distributor, we honor a full refund and replacement policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              4. Dietary Supplement Disclaimer
            </h2>
            <p>
              The products sold by {STORE_NAME} are nutritional and dietary supplements intended to support athletic performance and general wellness. They are NOT intended to diagnose, treat, cure, or prevent any medical disease. Consult a certified physician or healthcare professional before beginning any new supplement regimen, especially if you have pre-existing medical conditions, are taking prescription medications, or are pregnant/nursing.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              5. Prohibited Website Use &amp; Anti-Spam
            </h2>
            <p>
              Users are prohibited from submitting automated script queries, spamming inquiry forms, injecting malicious scripts, or bypassing edge rate-limit safeguards. Violations will result in automated IP blocking and potential legal reporting under applicable Nepal cybersecurity laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              6. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms of Service are governed by and construed in accordance with the laws of Nepal. Any disputes arising in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Kathmandu, Nepal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-heading font-bold text-foreground">
              7. Contact Information
            </h2>
            <div className="rounded-xl border border-border bg-card p-4 space-y-1 text-xs text-muted-foreground">
              <p><strong className="text-foreground">{STORE_NAME} Legal Desk</strong></p>
              <p>Golfutar, Budha-Nilkantha, Kathmandu, Nepal</p>
              <p>Phone: {STORE_PHONE}</p>
              <p>Email: {STORE_EMAIL}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
