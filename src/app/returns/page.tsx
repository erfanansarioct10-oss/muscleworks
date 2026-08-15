import type { Metadata } from 'next';
import Link from 'next/link';
import { RotateCcw, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { STORE_NAME, STORE_PHONE, SITE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: 'Return & Refund Policy | 7-Day Sealed Product Guarantee',
  description: 'Understand MUSCLEWORKS Nepal return policy. 7-day hassle-free return on unopened supplements with intact holographic security seals, and instant replacement for damaged parcels.',
  openGraph: {
    title: `Return & Refund Policy | ${STORE_NAME}`,
    description: '7-day return guarantee on unopened, sealed supplements in Nepal.',
    url: `${SITE_URL}/returns`,
  },
};

const RETURN_CONDITIONS = [
  {
    title: '7-Day Return Window',
    description: 'You can return any unopened, sealed supplement within 7 calendar days of delivery or store purchase.',
  },
  {
    title: 'Intact Importer Hologram Seal',
    description: 'The manufacturer neck seal, plastic shrink wrap, and authorized importer holographic sticker must be completely untouched and unscratched.',
  },
  {
    title: 'Original Purchase Receipt',
    description: 'Provide your WhatsApp order confirmation, invoice, or digital receipt issued by MUSCLEWORKS.',
  },
  {
    title: 'Damaged or Tampered in Transit',
    description: 'If your parcel arrived broken or with broken seals, notify us within 24 hours with photos for immediate free replacement.',
  },
];

export default function ReturnsPage() {
  const whatsappReturnUrl = buildGeneralWhatsAppUrl(
    'Hello MuscleWorks Nepal! I would like to inquire about returning/exchanging an unopened supplement product.'
  );

  return (
    <div className="w-full bg-background py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Return Policy</span>
        </div>

        {/* Header */}
        <div className="border-b border-border pb-8 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>CUSTOMER SATISFACTION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-foreground">
            RETURN &amp; REFUND POLICY
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            Clear, transparent return guidelines for sports nutrition supplements in Nepal.
          </p>
        </div>

        {/* Return Conditions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {RETURN_CONDITIONS.map((cond) => (
            <div key={cond.title} className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <h2 className="text-sm font-bold text-foreground">{cond.title}</h2>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">{cond.description}</p>
            </div>
          ))}
        </div>

        {/* Health & Hygiene Non-Returnable Notice */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-6 space-y-3 mb-12">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>Non-Returnable Items (Health &amp; Safety Compliance)</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Due to strict sports nutrition hygiene and contamination standards, supplements with opened lids, broken inner induction seals, scratched security codes, or damaged lot numbers cannot be returned or refunded once unsealed.
          </p>
        </div>

        {/* How to Initiate a Return */}
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed mb-12">
          <h2 className="text-xl font-heading font-bold text-foreground">
            How to Request a Return or Exchange
          </h2>
          <ol className="list-decimal list-inside space-y-2 pl-2 text-xs sm:text-sm">
            <li>Take clear photos of the unopened product, neck seal, and hologram sticker.</li>
            <li>Send the photos along with your order ID to our WhatsApp support desk at <strong className="text-foreground">{STORE_PHONE}</strong>.</li>
            <li>Our team will verify the seal and authorize the return within 2 to 4 business hours.</li>
            <li>Drop off the product at our Golfutar store or hand it to our return pickup rider in Kathmandu Valley.</li>
            <li>Refunds are issued instantly via Fonepay / eSewa / Bank transfer once the item is inspected.</li>
          </ol>
        </div>

        {/* Action CTA */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-heading font-bold text-foreground">
              Need assistance with a return?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our customer service team at Golfutar is ready to help you on WhatsApp.
            </p>
          </div>

          <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto shrink-0 font-bold gap-2">
            <a href={whatsappReturnUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              <span>Message Support Desk</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
