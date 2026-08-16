import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  MessageSquare,
  Car,
  Truck,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';

import { getStoreInfo } from '@/lib/data/store';
import { SITE_URL } from '@/lib/constants';
import { buildStoreLocationWhatsAppUrl } from '@/lib/whatsapp';
import { StoreMapEmbed } from '@/components/location/store-map-embed';
import { StoreHoursCard } from '@/components/location/store-hours-card';

export const metadata: Metadata = {
  title: 'Flagship Store Location | Golfutar Budha-Nilkantha Kathmandu | MuscleWorks',
  description:
    'Visit MuscleWorks Supplements flagship retail store at Golfutar Main Road, Budha-Nilkantha, Kathmandu. View Google Maps directions, parking, operating hours, and importer hologram verification.',
  openGraph: {
    title: 'Flagship Store Location | MuscleWorks Supplements Kathmandu',
    description:
      'Visit our physical retail outlet at Golfutar Main Road, Kathmandu. 100% genuine sports nutrition & fitness supplements in Nepal.',
    url: `${SITE_URL}/location`,
    siteName: 'MUSCLEWORKS SUPPLEMENTS',
    locale: 'en_NP',
    type: 'website',
  },
};

export default async function LocationPage() {
  const storeData = await getStoreInfo();
  const { name, legalName, tagline, address, coordinates, openingHours, contacts, deliveryPolicy } = storeData;

  const whatsappUrl = buildStoreLocationWhatsAppUrl();

  // Schema.org LocalBusiness JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name,
    legalName: legalName,
    description: tagline,
    url: SITE_URL,
    telephone: contacts.primaryPhone,
    email: contacts.storeEmail,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.area,
      addressRegion: address.province,
      postalCode: address.postalCode,
      addressCountry: 'NP',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
    openingHoursSpecification: openingHours
      .filter((h) => !h.isClosed && h.opens !== 'Contact Store')
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${h.label}`,
        opens: h.opens,
        closes: h.closes,
      })),
    priceRange: 'NPR',
    hasMap: coordinates.googleMapsPlaceUrl,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Schema.org LocalBusiness JSON-LD Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Hero Header Section */}
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
                Store Location
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
              <Building2 className="h-3.5 w-3.5" />
              <span>Flagship Physical Store Outlet</span>
            </div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Visit Our Store in Golfutar, Kathmandu
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Experience Nepal’s premier physical destination for 100% authentic supplements. Inspect importer hologram seals, get expert nutrition guidance, and buy genuine products directly.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content & Interactive Location Grid */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Top Section: Responsive Google Maps Embed & Quick Store Overview */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
            
            {/* Google Maps Embed Container */}
            <div className="lg:col-span-7 flex flex-col">
              <StoreMapEmbed className="h-full min-h-[400px] flex-1" storeInfo={storeData} />
            </div>

            {/* Store Information & Direct Call Actions */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">
                      Golfutar Main Road Outlet
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {address.municipality}, {address.city} {address.postalCode}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-sm border-t border-border/60 pt-4">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">Address</span>
                      <span className="text-muted-foreground text-xs">
                        {address.streetAddress}, {address.area}, {address.municipality}, {address.city}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">Landmark</span>
                      <span className="text-muted-foreground text-xs">
                        {address.landmark}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Car className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">Parking</span>
                      <span className="text-muted-foreground text-xs">
                        Dedicated customer vehicle & bike parking available in front of store.
                      </span>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Visit Notification Button (≥48px height) */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-emerald-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <MessageSquare className="h-5 w-5 fill-current" />
                  <span>Notify Store Visit via WhatsApp</span>
                </a>
              </div>

              {/* Direct Hotline Call Button */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-md flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                    Golfutar Hotline
                  </span>
                  <span className="text-base font-bold text-foreground font-mono">
                    {contacts.primaryPhone}
                  </span>
                </div>
                <a
                  href={`tel:${contacts.primaryPhone}`}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  <Phone className="h-4 w-4 mr-1.5" />
                  <span>Call Store</span>
                </a>
              </div>
            </div>

          </div>

          {/* Middle Section: Operating Hours & Delivery Policy Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            
            {/* Operating Hours Card */}
            <div className="lg:col-span-7">
              <StoreHoursCard />
            </div>

            {/* Kathmandu Delivery & Nationwide Dispatches */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      Kathmandu & Nepal Delivery
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {deliveryPolicy.coverage} Coverage
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-muted-foreground border-t border-border/60 pt-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Same-Day / Next-Day Delivery:</strong> Kathmandu, Lalitpur, and Bhaktapur Valley.
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Nationwide Express:</strong> Pokhara, Butwal, Biratnagar, Chitwan, and all major Nepal cities (2-4 business days).
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-foreground">Free Valley Delivery:</strong> On all orders above NPR 5,000 within Kathmandu Valley.
                    </span>
                  </div>
                </div>
              </div>

              {/* 100% Genuine Importer Seal Assurance */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5" />
                  <span>100% Authentic Store Guarantee</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every supplement tub sold at our Golfutar outlet features official importer hologram seals (Neucrad, Authorised Importer Stickers) and scratch-code verification.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
