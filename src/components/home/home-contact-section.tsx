import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  MessageSquare,
  Clock,
  ChevronRight,
  Truck,
  Navigation,
  ExternalLink,
} from "lucide-react";

import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { STORE_PHONE, STORE_PHONE_RAW, STORE_HOURS, STORE_LOCATION } from "@/lib/constants";

export function HomeContactSection() {
  const directWhatsAppUrl = buildGeneralWhatsAppUrl();

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-14 sm:py-20 lg:py-24 border-t border-slate-800">
      {/* Responsive Background Charcoal Textures - Matching Deals & Goals Sections */}
      {/* Mobile Vertical Texture */}
      <Image
        src="/deals/charcoal-bg-mobile.webp"
        alt="Dark Charcoal Background Texture Mobile"
        fill
        sizes="(max-width: 640px) 100vw, 1px"
        className="object-cover object-center sm:hidden"
      />
      {/* Desktop & Tablet Widescreen Texture */}
      <Image
        src="/deals/charcoal-bg.webp"
        alt="Dark Charcoal Background Texture Desktop"
        fill
        sizes="(min-width: 640px) 100vw, 1px"
        className="hidden sm:block object-cover object-center"
      />

      {/* Dark Shadow Overlay - Matching Deals & Goals Sections */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 sm:mb-14">
          <h2 className="font-heading font-black tracking-tight uppercase text-3xl sm:text-4xl lg:text-5xl text-white">
            GET IN TOUCH <span className="text-slate-500">WITH US</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base font-normal mt-2.5 max-w-2xl leading-relaxed">
            Need supplement stack advice, order inquiries, or store directions? Contact our Kathmandu nutrition specialists directly or visit our Golfutar flagship store.
          </p>
        </div>

        {/* 2-Column Split: Left Store Details / Right Google Maps Location Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left Column: MuscleWorks Store Details & Quick Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            {/* Store Information */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-white shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg uppercase tracking-wide">
                    Retail Flagship Store
                  </h3>
                  <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                    Golfutar, Budha-Nilkantha, Kathmandu 44500, Nepal
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Near Golfutar Basketball Court
                  </p>
                  <Link
                    href="/location"
                    className="inline-flex min-h-[44px] items-center gap-1 text-xs font-bold text-slate-200 hover:text-white mt-1 transition-colors uppercase tracking-wider underline underline-offset-4"
                  >
                    <span>View Store Location Page</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Direct Hotline */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-white shrink-0 mt-1">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg uppercase tracking-wide">
                    Phone & WhatsApp Hotline
                  </h3>
                  <a
                    href={`tel:${STORE_PHONE_RAW}`}
                    className="text-slate-200 hover:text-white font-bold text-sm sm:text-base mt-1 block tracking-wide transition-colors"
                  >
                    {STORE_PHONE}
                  </a>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Instant WhatsApp support available daily
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-white shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg uppercase tracking-wide">
                    Opening Hours
                  </h3>
                  <p className="text-slate-300 text-sm mt-1">
                    <strong className="text-white">{STORE_HOURS.weekdays}</strong>
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {STORE_HOURS.saturday}
                  </p>
                </div>
              </div>

              {/* Delivery Guarantee */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/15 text-white shrink-0 mt-1">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-base sm:text-lg uppercase tracking-wide">
                    Fast Delivery
                  </h3>
                  <p className="text-slate-300 text-sm mt-1">
                    Same-day in Kathmandu Valley · 2-4 days nationwide Nepal
                  </p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Quick Button */}
            <div className="pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-white hover:bg-slate-200 text-black font-bold text-sm sm:text-base px-6 py-3.5 transition-all shadow-lg min-h-[48px] uppercase tracking-wider"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Google Map Location */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900/90 shadow-2xl flex flex-col lg:h-full">
              {/* Google Maps Responsive Iframe */}
              <iframe
                title="MUSCLEWORKS SUPPLEMENTS Store Location Google Map"
                src={STORE_LOCATION.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[260px] sm:h-[320px] lg:h-auto lg:min-h-[340px] lg:flex-1"
              />

              {/* Bottom Info & Directions Action Bar */}
              <div className="relative z-10 border-t border-slate-700/80 bg-slate-900/95 p-4 sm:p-5 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shrink-0">
                <div className="min-w-0 w-full sm:w-auto">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wide truncate">
                      MUSCLEWORKS SUPPLEMENTS
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Golfutar Main Road, Budha-Nilkantha, Kathmandu 44500
                  </p>
                </div>

                <a
                  href={STORE_LOCATION.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2 rounded-xl bg-white hover:bg-slate-200 px-5 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-black shadow-lg transition-all active:scale-[0.98] shrink-0"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Get Directions</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80 ml-auto sm:ml-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
