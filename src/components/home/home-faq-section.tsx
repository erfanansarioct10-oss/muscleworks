"use client";

import React from "react";
import { MessageSquare, Phone, HelpCircle } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { STORE_PHONE, STORE_PHONE_RAW } from "@/lib/constants";

import type { FAQItem } from "@/lib/validations/common";

export interface HomeFaqSectionProps {
  faqs?: FAQItem[];
}

export function HomeFaqSection({ faqs = [] }: HomeFaqSectionProps) {
  const directWhatsAppUrl = buildGeneralWhatsAppUrl(
    "Namaste MuscleWorks! I have a question about supplement authenticity, stock availability, or delivery."
  );

  return (
    <section className="relative w-full bg-background py-14 sm:py-20 lg:py-24 border-t border-border overflow-hidden">
      {/* Dynamic Background Radial Slate Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(15,23,42,0.04),transparent)]"
        aria-hidden="true"
      />

      {/* Glassmorphic Charcoal Diagonal Slice (Steep Tilt - Matching Favorite Brand Style) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
        <div className="absolute -top-64 -bottom-64 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] md:w-[850px] -skew-x-45 bg-gradient-to-b from-slate-900/8 via-slate-800/5 to-transparent backdrop-blur-[2px] border-x border-slate-900/10 shadow-2xs opacity-85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Split: Left Title & Assistance Card / Right Accordion List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading, Subtitle & Direct Assistance Card */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <h2 className="font-heading font-black tracking-tight uppercase text-3xl sm:text-4xl lg:text-5xl text-foreground">
                FREQUENTLY ASKED <span className="text-slate-500">QUESTIONS</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base font-normal mt-3 leading-relaxed">
                Need answers before buying? Here are clear details on 100% genuine authenticity, importer hologram verification, Kathmandu same-day delivery, and WhatsApp ordering.
              </p>
            </div>

            {/* Quick Consultation CTA Card */}
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-xl bg-secondary text-foreground shrink-0 mt-0.5">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-foreground text-base sm:text-lg uppercase tracking-wide">
                    Still Have Questions?
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1 leading-relaxed">
                    Can&apos;t find what you&apos;re looking for? Chat directly with our Kathmandu sports nutrition specialists for personalized stack advice.
                  </p>
                </div>
              </div>

              {/* Direct Telephone Contact */}
              <div className="flex items-center gap-3 pt-2 border-t border-border text-xs sm:text-sm">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Direct Hotline:</span>
                <a
                  href={`tel:${STORE_PHONE_RAW}`}
                  className="font-bold text-foreground hover:text-muted-foreground transition-colors"
                >
                  {STORE_PHONE}
                </a>
              </div>

              {/* Direct WhatsApp CTA Button (≥48px height) using Jet Black brand primary color */}
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm sm:text-base px-6 py-3.5 transition-all shadow-md active:scale-[0.99] min-h-[48px] uppercase tracking-wider"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Clean Minimal Accordion List */}
          <div className="lg:col-span-7">
            <Accordion
              type="single"
              collapsible
              defaultValue={faqs[0]?.id || "faq_1"}
              className="space-y-3.5 sm:space-y-4"
            >
              {faqs.map((faq, index) => {
                const faqId = faq.id || `faq_${index + 1}`;
                return (
                  <AccordionItem
                    key={faqId}
                    value={faqId}
                    className="rounded-2xl border border-border bg-card data-[state=open]:border-foreground/30 data-[state=open]:shadow-sm px-5 sm:px-6 transition-all shadow-xs overflow-hidden"
                  >
                    <AccordionTrigger className="text-foreground font-heading font-bold text-sm sm:text-base py-4 sm:py-5 min-h-[48px] hover:no-underline hover:text-muted-foreground transition-colors">
                      <span className="pr-4">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-xs sm:text-sm leading-relaxed pb-5 pt-1 border-t border-border/60">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
