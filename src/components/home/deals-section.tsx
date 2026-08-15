"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatNprPrice } from "@/lib/utils";
import { buildDealInquiryWhatsAppUrl } from "@/lib/whatsapp";
import { Star } from "lucide-react";

interface DealProduct {
  id: string;
  title: string;
  brand: string;
  imageSrc: string;
  priceNpr: number;
  originalPriceNpr: number;
  rating: number;
  reviewCount: number;
}

const DEALS_PRODUCTS: DealProduct[] = [
  {
    id: "deal-hyper-mass",
    title: "BioTechUSA Hyper Mass 4000g",
    brand: "BIOTECHUSA",
    imageSrc: "/deals/hyper-mass.png",
    priceNpr: 10500,
    originalPriceNpr: 13500,
    rating: 5,
    reviewCount: 5,
  },
  {
    id: "deal-omega-3",
    title: "BioTechUSA Mega Omega 3",
    brand: "BIOTECHUSA",
    imageSrc: "/deals/omega-3.png",
    priceNpr: 2800,
    originalPriceNpr: 3500,
    rating: 5,
    reviewCount: 9,
  },
  {
    id: "deal-impact-whey",
    title: "FuelOne Impact Whey Protein",
    brand: "FUELONE",
    imageSrc: "/deals/impact-whey.png",
    priceNpr: 5400,
    originalPriceNpr: 6800,
    rating: 5,
    reviewCount: 14,
  },
  {
    id: "deal-bpi-vortex",
    title: "BPI Sports 1.M.R Vortex Pre-Workout",
    brand: "BPI SPORTS",
    imageSrc: "/deals/bpi-1-mr-vortex.png",
    priceNpr: 4600,
    originalPriceNpr: 5800,
    rating: 5,
    reviewCount: 7,
  },
];

export function DealsSection() {
  // Target timestamp representing 30 Days, 23 Hours, 58 Minutes, 50 Seconds from component initialization
  const [targetTimestamp] = useState(() => Date.now() + (30 * 86400 + 23 * 3600 + 58 * 60 + 50) * 1000);
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 23,
    minutes: 58,
    seconds: 50,
  });

  useEffect(() => {
    const updateTimer = () => {
      const remainingMs = Math.max(0, targetTimestamp - Date.now());
      const totalSecs = Math.floor(remainingMs / 1000);
      const days = Math.floor(totalSecs / 86400);
      const hours = Math.floor((totalSecs % 86400) / 3600);
      const minutes = Math.floor((totalSecs % 3600) / 60);
      const seconds = totalSecs % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateTimer();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [targetTimestamp]);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-12 sm:py-16 lg:py-20 border-b border-slate-800">
      {/* Background Charcoal Texture Image */}
      <Image
        src="/deals/charcoal-bg.png"
        alt="Dark Charcoal Background Texture"
        fill
        sizes="100vw"
        className="object-cover object-center scale-125"
      />

      {/* Dark Shadow Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Deals Headline, Subtitle, Countdown Timer & CTA */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <h2 className="font-heading font-black tracking-tight uppercase leading-none text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-2">
              THIS WEEK DEALS
            </h2>
            <p className="font-heading font-black tracking-tight uppercase leading-none text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FF5500] mb-4">
              UP TO 50% OFF
            </p>

            <p className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-slate-300 mb-6">
              LIMITED QUANTITIES, HURRY UP!
            </p>

            {/* Countdown Boxes */}
            <div className="flex items-center gap-2 sm:gap-3 mb-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FF5500] rounded flex items-center justify-center shadow-md">
                  <span className="font-heading font-black text-xl sm:text-2xl text-white">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Days</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FF5500] rounded flex items-center justify-center shadow-md">
                  <span className="font-heading font-black text-xl sm:text-2xl text-white">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Hours</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FF5500] rounded flex items-center justify-center shadow-md">
                  <span className="font-heading font-black text-xl sm:text-2xl text-white">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Mins</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FF5500] rounded flex items-center justify-center shadow-md">
                  <span className="font-heading font-black text-xl sm:text-2xl text-white">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Secs</span>
              </div>
            </div>

            {/* View All Deals Underlined Link */}
            <div>
              <Link
                href="/products"
                className="inline-block font-semibold text-sm sm:text-base text-white underline underline-offset-4 decoration-2 decoration-[#FF5500] hover:text-[#FF5500] transition-colors min-h-[44px] leading-loose"
              >
                View All Deals
              </Link>
            </div>
          </div>

          {/* Right Column: 2x2 Product Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {DEALS_PRODUCTS.map((product) => {
                const whatsappUrl = buildDealInquiryWhatsAppUrl(product.title, product.priceNpr);

                return (
                  <a
                    key={product.id}
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3.5 sm:gap-5 p-2 sm:p-3 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Left Product Image Box */}
                    <div className="relative w-28 h-32 sm:w-36 sm:h-40 md:w-40 md:h-44 shrink-0 flex items-center justify-center">
                      <Image
                        src={product.imageSrc}
                        alt={product.title}
                        fill
                        sizes="(max-width: 640px) 120px, (max-width: 768px) 150px, 180px"
                        className="object-contain p-0 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Right Details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-white line-clamp-2 leading-snug group-hover:text-[#FF5500] transition-colors mb-2">
                        {product.title}
                      </h3>

                      {/* Rating Stars */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="flex items-center text-[#FF5500]">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#FF5500] text-[#FF5500]" />
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">
                          ({product.reviewCount})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-base sm:text-lg text-white">
                          {formatNprPrice(product.priceNpr)}
                        </span>
                        {product.originalPriceNpr > product.priceNpr && (
                          <span className="text-xs sm:text-sm text-slate-400 line-through">
                            {formatNprPrice(product.originalPriceNpr)}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

