import type { Metadata } from 'next';
import Link from 'next/link';
import { Truck, Clock, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import { STORE_NAME, SITE_URL } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Shipping & Delivery Policy | Same-Day Kathmandu Delivery',
  description: 'Fast supplement delivery across Kathmandu Valley and nationwide Nepal. Free Kathmandu delivery on orders above NPR 10,000 with tamper-evident packaging and cash on delivery.',
  openGraph: {
    title: `Shipping & Delivery Policy | ${STORE_NAME}`,
    description: 'Same-day Kathmandu delivery and express nationwide courier shipping across all 7 provinces of Nepal.',
    url: `${SITE_URL}/shipping`,
  },
};

const DELIVERY_TIERS = [
  {
    title: 'Kathmandu Valley Express',
    coverage: 'Kathmandu, Lalitpur, Bhaktapur & Budha-Nilkantha',
    timing: 'Same-Day / Within 24 Hours',
    cost: 'NPR 150 (FREE on orders above NPR 10,000)',
    payment: 'Cash on Delivery (COD), Fonepay QR, eSewa, Khalti',
    icon: Truck,
    highlight: true,
  },
  {
    title: 'Nationwide Courier Service',
    coverage: 'Pokhara, Butwal, Biratnagar, Chitwan, Dharan, Nepalgunj & All Major Cities',
    timing: '2 to 4 Business Days',
    cost: 'NPR 250 Standard Nationwide Courier',
    payment: 'Pre-payment via Fonepay / Bank QR / eSewa before courier dispatch',
    icon: MapPin,
    highlight: false,
  },
  {
    title: 'Store Pickup (Walk-In)',
    coverage: 'Golfutar Flagship Store, Budha-Nilkantha Road',
    timing: 'Instant (10:00 AM – 9:00 PM Sun–Fri)',
    cost: 'FREE',
    payment: 'Cash, Fonepay QR, Mobile Banking',
    icon: ShieldCheck,
    highlight: false,
  },
];

export default function ShippingPage() {
  return (
    <div className="w-full bg-background py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Shipping &amp; Delivery</span>
        </div>

        {/* Header */}
        <div className="flex flex-col gap-3 max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Truck className="h-3.5 w-3.5" />
            <span>NEPAL-WIDE LOGISTICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-foreground">
            SHIPPING &amp; DELIVERY POLICY
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Fast, secure, and tamper-evident supplement delivery across Kathmandu Valley and every major city in Nepal.
          </p>
        </div>

        {/* Delivery Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-14">
          {DELIVERY_TIERS.map((tier) => {
            const Icon = tier.icon;
            return (
              <div
                key={tier.title}
                className={`flex flex-col justify-between rounded-2xl border p-6 sm:p-7 transition-all ${
                  tier.highlight
                    ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/30'
                    : 'border-border bg-card'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    {tier.highlight && (
                      <Badge variant="authentic" className="text-[10px] uppercase font-bold">
                        Most Popular
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-heading font-bold text-foreground">{tier.title}</h2>
                    <p className="text-xs text-muted-foreground mt-1">{tier.coverage}</p>
                  </div>

                  <div className="space-y-2 pt-2 text-xs border-t border-border/80">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="font-medium text-foreground">{tier.timing}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground">{tier.cost}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 text-[11px] text-muted-foreground">
                  <strong className="text-foreground">Payment:</strong> {tier.payment}
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery Terms & Notes */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 text-sm text-muted-foreground leading-relaxed mb-12">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Important Delivery Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-foreground">1. Order Confirmation &amp; Dispatch</h3>
              <p>
                All orders placed before 3:00 PM (Sunday through Friday) are processed and dispatched on the same day for Kathmandu Valley deliveries.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground">2. Package Inspection</h3>
              <p>
                Please inspect outer security tape, neck band seals, and tamper-evident packaging in front of the delivery rider before accepting.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground">3. Remote &amp; Out-of-Valley Locations</h3>
              <p>
                Nationwide shipments are dispatched via leading national courier partners (e.g., Sundar Courier, Nepal Courier, Pathao Courier). Tracking details are sent via WhatsApp.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-foreground">4. Free Delivery Threshold</h3>
              <p>
                Orders totaling NPR 10,000 or above qualify for 100% free delivery across Kathmandu, Lalitpur, and Bhaktapur municipal areas.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-border bg-muted/40 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-heading font-bold text-foreground">
              Have questions about your delivery address?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Contact our dispatch desk directly on WhatsApp for real-time delivery estimates.
            </p>
          </div>

          <Button asChild variant="whatsapp" size="default" className="w-full sm:w-auto shrink-0 font-bold">
            <Link href="/contact">
              <span>Contact Dispatch Desk</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
