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
    <section className="relative w-full min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] overflow-hidden bg-background flex items-start md:items-center">
      {/* Mobile Hero Background (< md) */}
      <div className="absolute inset-0 z-0 md:hidden">
        <Image
          src="/hero/mobile-hero-bg.webp"
          alt="MuscleWorks Supplements Mobile Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Top-to-bottom gradient overlay for WCAG AA readability over top rocks */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* Desktop Hero Background (>= md) */}
      <div className="absolute inset-0 z-0 hidden md:block">
        <Image
          src="/hero/hero-bg.webp"
          alt="MuscleWorks Supplements Desktop Hero Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Left-to-right gradient overlay for desktop hero typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent pointer-events-none" />
      </div>

      {/* Main Container Aligned to Upper 70% Safe Zone on Mobile */}
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-start md:items-center px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-48 sm:pb-60 md:py-12">
        <div className="w-full max-w-xl lg:max-w-2xl space-y-5 sm:space-y-7">
          {/* Main Heading: Fluid Responsive Scaling across all Breakpoints */}
          <h1 className="font-heading font-black tracking-tight uppercase italic leading-[0.95] text-left select-none max-w-full">
            <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white drop-shadow-md">
              SUPPORTING YOUR
            </span>
            <span className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black drop-shadow-sm mt-1 sm:mt-2">
              BEST EVERYDAY
            </span>
          </h1>

          {/* Minimal Subheading */}
          <div className="border-l-3 border-white/80 pl-3.5 sm:pl-4">
            <p className="text-xs sm:text-sm font-bold tracking-widest text-white uppercase drop-shadow-sm leading-snug">
              PREMIUM SUPPLEMENTS. TRUSTED BRANDS. REAL RESULTS.
            </p>
          </div>

          {/* 4 Trust Badges (Responsive 2 Per Row on sm+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4 pt-1 max-w-lg">
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                  <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur-md shrink-0">
                    <Icon className="h-4 w-4 text-amber-400" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-amber-400 drop-shadow-sm truncate">
                      {badge.title}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-white/90 drop-shadow-sm truncate">
                      {badge.subtitle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimal CTA Buttons */}
          <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4 pt-2">
            {/* Primary WhatsApp Order CTA Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[46px] sm:min-h-[48px] items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 sm:px-6 py-3 text-sm sm:text-base font-bold text-white transition-colors duration-200 hover:bg-emerald-700 active:scale-[0.98]"
              aria-label="Order authentic supplements via WhatsApp"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 fill-current shrink-0" />
              <span>WhatsApp Order</span>
            </a>

            {/* Catalog Navigation Link Button */}
            <Link
              href="/products"
              className="inline-flex min-h-[46px] sm:min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/60 bg-black/40 px-5 sm:px-6 py-3 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-black/60 hover:border-white active:scale-[0.98]"
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
