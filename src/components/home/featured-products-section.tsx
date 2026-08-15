import Image from "next/image";
import { formatNprPrice, calculateDiscountPercentage } from "@/lib/utils";
import { getBaseWhatsAppUrl } from "@/lib/whatsapp";

interface FeaturedBannerProduct {
  id: string;
  brand: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  priceNpr: number;
  originalPriceNpr: number;
  features: string[];
  whatsappMessage: string;
  buttonClass: string;
  titleColor: string;
}

const FEATURED_BANNERS: FeaturedBannerProduct[] = [
  {
    id: "biotech-pure-whey",
    brand: "BIOTECHUSA",
    title: "NITROPURE 100% WHEY",
    subtitle: "PROTEIN DRINK POWDER WITH CONCENTRATE & ISOLATE",
    imageSrc: "/feature-products/biotech-pure-whey.webp",
    priceNpr: 11500,
    originalPriceNpr: 13000,
    features: ["21G PROTEIN", "GLUTEN FREE", "PALM OIL FREE"],
    whatsappMessage: "Namaste MuscleWorks! I want to order BioTechUSA 100% Pure Whey (NPR 11,500) for Kathmandu delivery.",
    buttonClass: "bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold",
    titleColor: "text-cyan-400",
  },
  {
    id: "bpi-whey-hd",
    brand: "BPI SPORTS",
    title: "WHEY HD",
    subtitle: "ULTRA-PREMIUM WHEY PROTEIN MATRIX",
    imageSrc: "/feature-products/bpi-whey-hd.webp",
    priceNpr: 10800,
    originalPriceNpr: 12500,
    features: ["25G PROTEIN", "CHOCOLATE COOKIE", "5G BCAAS"],
    whatsappMessage: "Namaste MuscleWorks! I want to order BPI Sports WHEY HD (NPR 10,800) for Kathmandu delivery.",
    buttonClass: "bg-sky-400 hover:bg-sky-300 text-black font-extrabold",
    titleColor: "text-sky-400",
  },
  {
    id: "on-gold-isolate",
    brand: "OPTIMUM NUTRITION",
    title: "GOLD STANDARD 100% ISOLATE",
    subtitle: "HYDROLYZED & ULTRA-FILTERED WHEY ISOLATE",
    imageSrc: "/feature-products/on-gold-isolate.webp",
    priceNpr: 9500,
    originalPriceNpr: 11000,
    features: ["25G PURE ISOLATE", "5.5G BCAAS", "FAST RECOVERY"],
    whatsappMessage: "Namaste MuscleWorks! I want to order ON Gold Standard 100% Isolate (NPR 9,500) for Kathmandu delivery.",
    buttonClass: "bg-amber-400 hover:bg-amber-300 text-black font-extrabold",
    titleColor: "text-amber-300",
  },
  {
    id: "muscleblaze-biozyme",
    brand: "MUSCLEBLAZE",
    title: "BIOZYME PERFORMANCE WHEY",
    subtitle: "CLINICALLY PROVEN 50% HIGHER PROTEIN ABSORPTION",
    imageSrc: "/feature-products/muscleblaze-biozyme.webp",
    priceNpr: 6800,
    originalPriceNpr: 7800,
    features: ["PATENTED EAF™ FORMULA", "INFORMED CHOICE TESTED", "25G PROTEIN"],
    whatsappMessage: "Namaste MuscleWorks! I want to order MuscleBlaze Biozyme Performance Whey (NPR 6,800) for Kathmandu delivery.",
    buttonClass: "bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold",
    titleColor: "text-yellow-400",
  },
];

export function FeaturedProductsSection() {
  return (
    <section className="w-full bg-white py-10 sm:py-14 md:py-16 border-b border-slate-100 relative overflow-hidden">
      {/* Background Radial Slate Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(15,23,42,0.04),transparent)]"
        aria-hidden="true"
      />

      {/* Glassmorphic Charcoal Diagonal Stripe Slash */}
      <div className="pointer-events-none absolute inset-0 max-w-full overflow-hidden select-none" aria-hidden="true">
        <div className="absolute -top-64 -bottom-64 left-1/2 md:left-[68%] -translate-x-1/2 w-[240px] sm:w-[550px] md:w-[750px] -skew-x-45 bg-gradient-to-b from-slate-900/8 via-slate-800/6 to-transparent backdrop-blur-[2px] border-x border-slate-900/10 shadow-2xs opacity-85" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="relative z-10 max-w-7xl mx-auto text-center mb-6 sm:mb-10 px-2">
          <div className="flex items-center justify-center mb-2">
            <h2 className="font-heading font-black tracking-tight uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black">
              BEST-SELLING <span className="text-slate-500">PRODUCTS</span>
            </h2>
          </div>

          <p className="text-xs sm:text-base font-medium text-slate-600 max-w-xl mx-auto leading-relaxed">
            Every product is 100% genuine, batch-verified with official importer holograms, and imported directly into Nepal.
          </p>
        </div>

        {/* 2x2 Banner Grid (Centered & Mobile-First with Dynamic Height) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
          {FEATURED_BANNERS.map((banner) => {
            const whatsappUrl = `${getBaseWhatsAppUrl()}?text=${encodeURIComponent(banner.whatsappMessage)}`;
            const discountPercent = calculateDiscountPercentage(banner.originalPriceNpr, banner.priceNpr);

            return (
              <div
                key={banner.id}
                className="relative overflow-hidden rounded-2xl bg-slate-950 min-h-[310px] sm:min-h-[330px] md:min-h-[350px] p-5 sm:p-7 flex flex-col justify-between shadow-xs transition-transform duration-300 hover:scale-[1.01] w-full"
              >
                {/* Background Photoshoot Image */}
                <Image
                  src={banner.imageSrc}
                  alt={`${banner.title} background banner`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-right"
                />

                {/* Lightened Text Scrim / Gradient Overlay for bright product visuals */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 sm:via-black/20 to-transparent pointer-events-none" />

                {/* Banner Content (Overlay on Left Side) */}
                <div className="relative z-10 max-w-[65%] sm:max-w-[58%] h-full flex flex-col justify-between gap-4">
                  <div>
                    {/* Brand Name */}
                    <span className="block text-[10px] sm:text-xs font-black tracking-widest uppercase text-slate-300 mb-1">
                      {banner.brand}
                    </span>

                    {/* Main Title */}
                    <h3 className={`font-heading font-black tracking-tight text-lg sm:text-2xl lg:text-3xl uppercase leading-tight sm:leading-none mb-1.5 ${banner.titleColor}`}>
                      {banner.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[11px] sm:text-xs text-slate-300 font-semibold tracking-wide uppercase line-clamp-2 sm:line-clamp-1 mb-3">
                      {banner.subtitle}
                    </p>

                    {/* Key Feature Outlined Boxes */}
                    <div className="flex flex-wrap gap-1.5 mb-2 sm:mb-4">
                      {banner.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="rounded border border-white/40 bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Vertical Cross-Pricing UI & ORDER NOW Button */}
                  <div className="mt-auto pt-2">
                    <div className="flex flex-col mb-2.5">
                      <span className="text-base sm:text-lg lg:text-xl font-black tracking-tight text-white leading-tight">
                        {formatNprPrice(banner.priceNpr)}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {banner.originalPriceNpr > banner.priceNpr && (
                          <span className="text-xs sm:text-sm text-slate-400 line-through font-medium">
                            {formatNprPrice(banner.originalPriceNpr)}
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="text-[10px] sm:text-xs font-black text-red-400 uppercase tracking-wide">
                            {discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all duration-200 active:scale-95 min-h-[44px] sm:min-h-[48px] ${banner.buttonClass}`}
                      aria-label={`Order ${banner.title} via WhatsApp`}
                    >
                      ORDER NOW
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
