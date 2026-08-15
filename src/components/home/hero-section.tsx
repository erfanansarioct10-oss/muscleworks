import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Lock, Store, MessageCircle, ArrowRight } from "lucide-react";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function HeroSection() {
  const whatsappUrl = buildGeneralWhatsAppUrl(
    "Namaste MuscleWorks! I would like to inquire about authentic supplements and place an order."
  );

  const trustBadges = [
    {
      icon: ShieldCheck,
      title: "PREMIUM QUALITY",
      subtitle: "100% Authentic Brands",
    },
    {
      icon: Truck,
      title: "KATHMANDU DELIVERY",
      subtitle: "Same-Day Express",
    },
    {
      icon: Lock,
      title: "GENUINE HOLOGRAMS",
      subtitle: "Official Importer Seals",
    },
    {
      icon: Store,
      title: "FLAGSHIP STORE",
      subtitle: "Golfutar, Kathmandu",
    },
  ];

  return (
    <section className="relative w-full min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100svh-4rem)] overflow-hidden bg-background flex items-center justify-center">
      {/* Mobile Hero Background (< md) */}
      <div className="absolute inset-0 z-0 md:hidden select-none pointer-events-none" aria-hidden="true">
        <Image
          src="/hero/hero-new.webp"
          alt=""
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-top select-none pointer-events-none"
        />
        {/* Top-to-bottom gradient overlay for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/35 pointer-events-none select-none" />
      </div>

      {/* Desktop Hero Background (>= md) */}
      <div className="absolute inset-0 z-0 hidden md:block select-none pointer-events-none" aria-hidden="true">
        <Image
          src="/hero/hero-new.webp"
          alt=""
          fill
          priority
          quality={100}
          unoptimized
          className="object-cover object-center select-none pointer-events-none"
        />
        {/* Left-to-right gradient overlay for desktop hero typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent pointer-events-none select-none" />
      </div>

      {/* Main Container Left-Aligned on Mobile and Desktop */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center justify-start px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="w-full max-w-xl md:max-w-4xl lg:max-w-5xl space-y-5 sm:space-y-7 flex flex-col items-start text-left">
          {/* Main Heading: Left-Aligned Fluid Responsive Scaling */}
          <h1 className="font-heading font-black tracking-tight uppercase italic leading-[0.95] text-left max-w-full">
            <span className="block whitespace-nowrap text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl text-white">
              SUPPORTING YOUR
            </span>
            <span className="block whitespace-nowrap text-3xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl text-black drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)] mt-1 sm:mt-2">
              BEST EVERYDAY
            </span>
          </h1>

          {/* Left-Border Accent Subheading */}
          <div className="border-l-3 border-white/80 pl-3 sm:pl-4">
            <p className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase leading-snug text-left">
              PREMIUM SUPPLEMENTS. TRUSTED BRANDS. REAL RESULTS.
            </p>
          </div>

          {/* 4 Trust Badges (Original Hero UI with Section 2 Hover Effect) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 pt-1 w-full max-w-md sm:max-w-lg mx-0">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={idx}
                  className="group cursor-pointer flex items-center justify-start gap-2.5 sm:gap-3 p-1.5 -ml-1.5 rounded-xl transition-all duration-300 hover:bg-black/50"
                >
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-md shrink-0 transition-colors duration-300 group-hover:bg-white group-hover:border-white">
                    <Icon className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-black" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-white transition-colors duration-300 truncate">
                      {badge.title}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 transition-colors duration-300 truncate">
                      {badge.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimal CTA Buttons: Full-width on mobile (<sm), horizontal inline on desktop (>=sm) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3 sm:gap-4 pt-2 w-full max-w-md sm:max-w-none mx-0">
            {/* Primary WhatsApp Order CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 sm:px-6 py-3 text-sm sm:text-base font-bold text-white transition-colors duration-200 hover:bg-emerald-700 active:scale-[0.98]"
              aria-label="Order authentic supplements via WhatsApp"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 fill-current shrink-0" />
              <span>WhatsApp Order</span>
            </a>

            {/* Catalog Navigation Link Button */}
            <Link
              href="/products"
              className="inline-flex w-full sm:w-auto min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/60 bg-black/40 px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-black/60 hover:border-white active:scale-[0.98]"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
