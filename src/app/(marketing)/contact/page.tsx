import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageSquare,
  Mail,
  Building2,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

import { getStoreInfo } from '@/lib/data/store';
import { SITE_URL, STORE_PHONE } from '@/lib/constants';
import { buildGeneralWhatsAppUrl } from '@/lib/whatsapp';
import { ContactForm } from '@/components/forms/contact-form';
import { StoreHoursCard } from '@/components/location/store-hours-card';

export const metadata: Metadata = {
  title: 'Contact Us | MuscleWorks Supplements Golfutar Kathmandu',
  description:
    `Contact MuscleWorks Supplements at Golfutar, Budha-Nilkantha, Kathmandu. Phone hotline: ${STORE_PHONE}, direct WhatsApp orders, email support, and flagship store hours.`,
  openGraph: {
    title: 'Contact Us | MuscleWorks Supplements Kathmandu',
    description:
      'Get in touch with Nepal premier destination for 100% authentic supplements at Golfutar Main Road, Kathmandu.',
    url: `${SITE_URL}/contact`,
    siteName: 'MUSCLEWORKS SUPPLEMENTS',
    locale: 'en_NP',
    type: 'website',
  },
};

export default async function ContactPage() {
  const storeInfo = await getStoreInfo();
  const { address, contacts } = storeInfo;
  const whatsappUrl = buildGeneralWhatsAppUrl(
    'Namaste MuscleWorks! I have an inquiry regarding supplement products, stock availability, or store visit.'
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header Banner */}
      <section className="relative border-b border-border bg-card/50 py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-xs font-medium text-muted-foreground">
              <li>
                <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3.5 w-3.5 opacity-50" />
              </li>
              <li className="text-foreground font-bold" aria-current="page">
                Contact Us
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Kathmandu Flagship Outlet & Direct Support</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Get in Touch with MuscleWorks
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Have questions about product authenticity, stack advice, or store pickup at Golfutar? Connect with us directly via WhatsApp, phone call, or our online inquiry form.
            </p>
          </div>
        </div>
      </section>

      {/* Main 2-Column Split Content Layout */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 items-start">
            
            {/* Left Column: Direct Contact Info & Quick CTAs */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Direct WhatsApp Action Box */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                    <MessageSquare className="h-6 w-6 fill-current" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Instant WhatsApp Support
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Fastest response for stock & price checks
                    </p>
                  </div>
                </div>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <MessageSquare className="h-5 w-5 fill-current" />
                  <span>Chat on WhatsApp ({contacts.whatsappDisplay})</span>
                </a>
              </div>

              {/* Direct Telephone Call Box */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Store Hotline & Call Support
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Speak directly with our store team
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <a
                    href={`tel:${contacts.primaryPhone}`}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{contacts.primaryPhone}</span>
                  </a>

                  <a
                    href={`tel:${contacts.secondaryPhone}`}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-bold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <Building2 className="h-4 w-4" />
                    <span>{contacts.secondaryPhone}</span>
                  </a>
                </div>
              </div>

              {/* Physical Outlet Location Address Card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-heading text-base font-bold text-foreground">
                      Physical Store Outlet
                    </h3>
                    <p className="text-sm text-foreground font-medium">
                      {address.streetAddress}, {address.area}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {address.municipality}, {address.city}, {address.postalCode}, {address.country}
                    </p>
                    <p className="text-xs font-semibold text-primary pt-1">
                      📍 Landmark: {address.landmark}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Need map directions?</span>
                  <Link
                    href="/location"
                    className="inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <span>View Store Location Page</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Compact Store Hours Table */}
              <StoreHoursCard compact />

              {/* Email Support Card */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-md flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1 text-xs">
                  <span className="font-bold text-foreground block">Email Support</span>
                  <a href={`mailto:${contacts.storeEmail}`} className="inline-flex min-h-[44px] items-center text-muted-foreground hover:text-primary transition-colors truncate">
                    {contacts.storeEmail}
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form Component */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
