import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, QrCode, Lock, AlertTriangle, MessageCircle } from 'lucide-react';
import { STORE_NAME, SITE_URL } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';

export const metadata: Metadata = {
  title: '100% Authenticity Guarantee | Official Importer Holograms Nepal',
  description: 'Learn how MUSCLEWORKS guarantees 100% authentic supplements in Nepal. Sourced exclusively through authorized national importers with holographic scratch-off verification codes.',
  openGraph: {
    title: `100% Authenticity Guarantee | ${STORE_NAME}`,
    description: 'Zero counterfeit tolerance. Every tub features official national importer holographic security seals and scratch QR verification codes.',
    url: `${SITE_URL}/authenticity`,
  },
};

const VERIFICATION_PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Exclusive Authorized Importer Sourcing',
    description: 'We procure 100% of our inventory exclusively through official national distribution partners in Nepal—including Muscle House Nepal (Optimum Nutrition, Dymatize, MyProtein) and Radiant Traders (MuscleTech, Kevin Levrone). No parallel or grey market stock.',
  },
  {
    icon: QrCode,
    title: 'Holographic Scratch-Off Security Seals',
    description: 'Every supplement tub and pouch carries an intact, tamper-evident security seal with a unique scratch-off alphanumeric verification code. You can verify your unique code instantly on the importer or brand authentication website.',
  },
  {
    icon: Lock,
    title: 'Tamper-Evident Packaging & Batch Tracking',
    description: 'All neck bands, pressure seals, and inner induction linings are inspected upon arrival. We track lot numbers and expiry dates directly matching manufacturer manufacturing runs.',
  },
  {
    icon: AlertTriangle,
    title: 'Zero Counterfeit Tolerance Policy',
    description: 'If any product purchased at MUSCLEWORKS fails manufacturer or authorized importer verification, we issue an immediate 200% refund and replace the product free of charge.',
  },
];

const VERIFICATION_STEPS = [
  {
    step: '01',
    title: 'Locate Importer Hologram',
    description: 'Look for the metallic holographic seal on the neck band or cap lid (e.g. Muscle House Nepal or Radiant Traders).',
  },
  {
    step: '02',
    title: 'Gently Scratch Code',
    description: 'Use a coin to gently scratch off the security coating and reveal your 8 to 14 digit unique security verification code.',
  },
  {
    step: '03',
    title: 'Scan QR or Check Online',
    description: 'Scan the QR code with your mobile camera or visit the authorized importer portal to confirm product authenticity.',
  },
  {
    step: '04',
    title: 'Instant WhatsApp Assistance',
    description: 'If you ever have any doubt, send a photo of your tub batch number and seal to our team on WhatsApp for immediate confirmation.',
  },
];

export default function AuthenticityPage() {
  const whatsappVerifyUrl = buildGeneralWhatsAppUrl(
    'Hello MuscleWorks Nepal! I would like to verify the authenticity hologram seal on a supplement tub.'
  );

  return (
    <div className="w-full bg-background py-8 sm:py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Authenticity Guarantee</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col gap-4 text-center items-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>100% GENUINE GUARANTEED</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black uppercase tracking-tight text-foreground">
            OUR AUTHENTICITY PLEDGE
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Counterfeit supplements harm health and waste hard-earned money. At {STORE_NAME}, we eliminate fake sports nutrition from Nepal with 100% transparent, importer-certified authenticity protocols.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16">
          {VERIFICATION_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs hover:border-primary/40 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-heading font-bold text-foreground">
                  {pillar.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Step-by-Step Verification Guide */}
        <div className="rounded-3xl border border-border bg-muted/40 p-6 sm:p-10 lg:p-12 mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground uppercase tracking-tight">
              HOW TO VERIFY YOUR SUPPLEMENT IN 4 STEPS
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
              Follow these simple steps before opening your supplement container.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VERIFICATION_STEPS.map((s) => (
              <div key={s.step} className="flex flex-col gap-2 rounded-xl bg-card border border-border p-5 shadow-xs">
                <span className="text-2xl font-heading font-black text-primary">{s.step}</span>
                <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct WhatsApp Verification CTA */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg font-heading font-bold text-foreground">
              Have a seal you would like verified right now?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Send a photo of your product tub, hologram sticker, and expiry batch to our WhatsApp desk.
            </p>
          </div>

          <Button asChild variant="whatsapp" size="lg" className="w-full sm:w-auto shrink-0 font-bold gap-2">
            <a href={whatsappVerifyUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" />
              <span>Verify via WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
