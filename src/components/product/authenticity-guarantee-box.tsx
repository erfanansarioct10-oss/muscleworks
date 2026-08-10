'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { AuthenticityMetadata } from '@/lib/validations/product';
import { buildAuthenticityInquiryWhatsAppUrl } from '@/lib/whatsapp';
import { trackWhatsAppClick } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CheckCircle2, QrCode, Lock, MessageSquare } from 'lucide-react';

interface AuthenticityGuaranteeBoxProps {
  authenticity: AuthenticityMetadata;
  productName: string;
  className?: string;
}

export function AuthenticityGuaranteeBox({
  authenticity,
  productName,
  className,
}: AuthenticityGuaranteeBoxProps) {
  const {
    trustBadgeLabel = '100% Genuine Importer Seal',
    importerOrSource = 'Authorized Nepal Importer',
    verificationMethod = 'Official Scratch Code Verification',
    hologramDescription = 'Authorized Distributor Holographic Security Seal intact',
  } = authenticity;

  const whatsappUrl = buildAuthenticityInquiryWhatsAppUrl(productName);

  const handleWhatsAppVerifyClick = () => {
    trackWhatsAppClick({
      source: 'pdp_authenticity_box',
      productName,
    });
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-neutral-900 via-black to-neutral-950 p-5 text-white shadow-xl sm:p-6',
        className
      )}
    >
      {/* Subtle Gold Ambient Glow Accent */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/10 blur-2xl" />

      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold ring-1 ring-gold/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-heading text-base font-bold tracking-tight text-white sm:text-lg">
              100% Authenticity Guaranteed
            </h3>
            <p className="text-xs text-neutral-400">
              Direct import from authorized sole Nepal distributor
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold ring-1 ring-gold/30">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {trustBadgeLabel}
        </span>
      </div>

      {/* Verified Importer Info */}
      <div className="mt-4 rounded-xl bg-white/5 p-3.5 text-xs text-neutral-300 ring-1 ring-white/10">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <span className="text-neutral-400">Authorized Source: </span>
            <strong className="text-white font-medium">{importerOrSource}</strong>
          </div>
          <div>
            <span className="text-neutral-400">Verification: </span>
            <strong className="text-white font-medium">{verificationMethod}</strong>
          </div>
        </div>
        {hologramDescription && (
          <p className="mt-2 text-2xs text-neutral-400">
            <strong className="text-gold">Hologram Seal:</strong> {hologramDescription}
          </p>
        )}
      </div>

      {/* 3-Step Scratch & Verification Steps */}
      <div className="mt-5 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
          How To Verify Product Authenticity:
        </h4>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="flex items-start gap-2.5 rounded-lg bg-black/40 p-3 ring-1 ring-white/5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              1
            </span>
            <div>
              <span className="block text-xs font-bold text-white">Check Hologram</span>
              <span className="text-2xs text-neutral-400">
                Locate the official importer sticker on container lid.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg bg-black/40 p-3 ring-1 ring-white/5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              2
            </span>
            <div>
              <span className="block text-xs font-bold text-white">Scratch Security Code</span>
              <span className="text-2xs text-neutral-400">
                Gently scratch the metallic strip to reveal unique PIN.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg bg-black/40 p-3 ring-1 ring-white/5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/20 text-xs font-bold text-gold">
              3
            </span>
            <div>
              <span className="block text-xs font-bold text-white">Verify Online or SMS</span>
              <span className="text-2xs text-neutral-400">
                Enter PIN on official importer portal or SMS verification.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Authenticity Assistance CTA */}
      <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:flex-row">
        <div className="flex items-center gap-2.5 text-xs text-neutral-300">
          <QrCode className="h-5 w-5 shrink-0 text-emerald-400" />
          <span>Need help verifying your batch code or importer seal?</span>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppVerifyClick}
          className="w-full sm:w-auto"
        >
          <Button
            variant="whatsapp"
            size="lg"
            className="h-12 w-full gap-2 text-xs font-bold sm:w-auto"
          >
            <MessageSquare className="h-4 w-4" />
            Verify via WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
