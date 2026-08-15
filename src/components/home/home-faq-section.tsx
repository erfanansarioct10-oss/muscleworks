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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const HOMEPAGE_FAQS: FaqItem[] = [
  {
    id: "faq_authenticity_1",
    question: "How can I verify that supplements bought from MUSCLEWORKS Nepal are 100% genuine?",
    answer:
      "Every product sold at MUSCLEWORKS SUPPLEMENTS comes with an official authorized importer hologram seal (such as Muscle House Nepal or Radiant Traders) and a tamper-evident scratch-and-verify security code. You can scan the QR code or enter the unique scratch code directly on the manufacturer's official verification portal to verify batch authenticity before opening.",
  },
  {
    id: "faq_authenticity_2",
    question: "What authorized importer holographic seals should I look for?",
    answer:
      "In Nepal, top global brands are imported exclusively by authorized national distributors. For instance, Optimum Nutrition and Dymatize feature Muscle House Nepal holographic seals, while MuscleTech and Kevin Levrone feature Radiant Traders seals. MUSCLEWORKS guarantees 100% authorized supply lines with zero grey-market or counterfeit tubs.",
  },
  {
    id: "faq_ordering_delivery_1",
    question: "How quickly do you deliver within Kathmandu Valley?",
    answer:
      "Orders placed before 2:00 PM are delivered same-day across Kathmandu, Lalitpur, and Bhaktapur. Orders placed after 2:00 PM are delivered next-morning. We also offer express emergency delivery within Kathmandu Valley from our Golfutar flagship retail outlet.",
  },
  {
    id: "faq_ordering_delivery_2",
    question: "Do you ship outside Kathmandu Valley to Pokhara, Chitwan, or Butwal?",
    answer:
      "Yes, we ship nationwide across Nepal including Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Itahari, Nepalgunj, and Birtamode via reliable courier partners. Outside-valley deliveries typically arrive within 2 to 4 business days with tracking.",
  },
  {
    id: "faq_ordering_delivery_3",
    question: "How does ordering via WhatsApp work?",
    answer:
      "Ordering via WhatsApp is instant and convenient! Click any 'Order via WhatsApp' button on our product pages. A pre-filled message with your selected product name, flavor, weight, and price will automatically populate. Simply send the message, share your delivery city, and our team will confirm stock and dispatch immediately.",
  },
  {
    id: "faq_payment_store_1",
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD) across Kathmandu Valley and major outside-valley cities. You can also pay seamlessly via Fonepay QR, eSewa, Khalti, or direct bank transfer upon delivery or order placement.",
  },
];

export function HomeFaqSection() {
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
              defaultValue="faq_authenticity_1"
              className="space-y-3.5 sm:space-y-4"
            >
              {HOMEPAGE_FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-2xl border border-border bg-card data-[state=open]:border-foreground/30 data-[state=open]:shadow-sm px-5 sm:px-6 transition-all shadow-xs overflow-hidden"
                >
                  <AccordionTrigger className="text-foreground font-heading font-bold text-sm sm:text-base py-4 sm:py-5 min-h-[48px] hover:no-underline hover:text-muted-foreground transition-colors">
                    <span className="pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-xs sm:text-sm leading-relaxed pb-5 pt-1 border-t border-border/60">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
