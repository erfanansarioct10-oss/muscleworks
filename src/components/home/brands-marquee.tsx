import Image from 'next/image';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { ShieldCheck, Stamp, QrCode, Award } from 'lucide-react';
import { getBrands } from '@/lib/data/brands';

export async function BrandsMarquee() {
  const allBrands = await getBrands();

  if (!allBrands || allBrands.length === 0) {
    return null;
  }

  // Strictly filter ONLY brands that have genuine provided image logos (excluding SVG text placeholders)
  const logoBrands = allBrands.filter((brand) => {
    if (!brand.logo?.url) return false;
    if (brand.logo.url.endsWith('.svg')) return false;
    const fullPath = path.join(process.cwd(), 'public', brand.logo.url);
    return fs.existsSync(fullPath);
  });

  if (logoBrands.length === 0) {
    return null;
  }

  // Repeat the 5 brand logo marks 6 times (30 items total) to create a continuous, smooth infinite marquee loop
  const marqueeItems = [
    ...logoBrands,
    ...logoBrands,
    ...logoBrands,
    ...logoBrands,
    ...logoBrands,
    ...logoBrands,
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-14 md:py-16 border-y border-slate-100 relative overflow-hidden">
      {/* Dynamic Background Radial Slate Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(15,23,42,0.04),transparent)]"
        aria-hidden="true"
      />

      {/* Single Centered Glassmorphic Charcoal Diagonal Slice (Steep Tilt) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
        <div className="absolute -top-64 -bottom-64 left-1/2 -translate-x-1/2 w-[280px] sm:w-[550px] md:w-[750px] -skew-x-45 bg-gradient-to-b from-slate-900/8 via-slate-800/6 to-transparent backdrop-blur-[2px] border-x border-slate-900/10 shadow-2xs opacity-85" />
      </div>

      {/* Header Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center mb-6 sm:mb-10">
        {/* Heading Container */}
        <div className="flex items-center justify-center mb-2.5">
          <h2 className="font-heading font-black tracking-tight uppercase text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black">
            OFFICIAL STOCKED BRANDS
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-xs sm:text-base font-medium text-slate-600 max-w-xl mx-auto leading-relaxed px-2">
          Every product is 100% genuine, batch-verified with official importer holograms, and imported directly into Nepal.
        </p>
      </div>

      {/* Marquee Loop Track with Scoped Gradient Edge Masks */}
      <div className="relative z-10 w-full overflow-hidden flex select-none py-3">
        {/* Gradient edge masks for smooth fade edge transitions strictly for marquee track */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

        <div className="animate-marquee hover:[animation-play-state:paused] flex gap-6 sm:gap-14 min-w-full flex-shrink-0 items-center">
          {marqueeItems.map((brand, index) => {
            const isScitec = brand.slug === 'scitec-nutrition';
            const imgClass = isScitec
              ? 'max-h-[32px] sm:max-h-[40px] w-auto max-w-[120px] sm:max-w-[150px] scale-90 object-contain filter drop-shadow-xs group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-95'
              : 'max-h-[42px] sm:max-h-[55px] w-auto max-w-[140px] sm:max-w-[180px] object-contain filter drop-shadow-xs group-hover:drop-shadow-[0_10px_20px_rgba(0,0,0,0.12)] transition-all duration-300 group-hover:scale-105';

            return (
              <Link
                key={`${brand.id}-${index}`}
                href={`/brands/${brand.slug}`}
                className="group relative flex items-center justify-center min-w-[130px] sm:min-w-[180px] h-[65px] sm:h-[80px] transition-all duration-300 transform hover:-translate-y-1 flex-shrink-0 px-3 cursor-pointer"
                aria-label={`View ${brand.name} catalog`}
              >
                <Image
                  src={brand.logo.url}
                  alt={brand.logo.alt || `${brand.name} Logo`}
                  width={180}
                  height={80}
                  className={imgClass}
                />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Dynamic Trust Pillars Footer with Black & Charcoal Luxury Pills */}
      <div className="relative z-10 mt-6 sm:mt-10 max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 text-xs sm:text-sm font-bold">
          <div className="flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 backdrop-blur-xs border border-slate-200/90 hover:bg-black hover:border-black transition-all duration-300 group cursor-pointer text-center shadow-2xs">
            <div className="p-1 rounded-full bg-black/10 group-hover:bg-white transition-colors">
              <ShieldCheck className="w-3.5 h-3.5 text-black group-hover:text-black shrink-0 transition-colors" />
            </div>
            <span className="text-black group-hover:text-white transition-colors font-bold">100% Authentic</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 backdrop-blur-xs border border-slate-200/90 hover:bg-black hover:border-black transition-all duration-300 group cursor-pointer text-center shadow-2xs">
            <div className="p-1 rounded-full bg-black/10 group-hover:bg-white transition-colors">
              <Stamp className="w-3.5 h-3.5 text-black group-hover:text-black shrink-0 transition-colors" />
            </div>
            <span className="text-black group-hover:text-white transition-colors font-bold">Official Importer Seals</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 backdrop-blur-xs border border-slate-200/90 hover:bg-black hover:border-black transition-all duration-300 group cursor-pointer text-center shadow-2xs">
            <div className="p-1 rounded-full bg-black/10 group-hover:bg-white transition-colors">
              <QrCode className="w-3.5 h-3.5 text-black group-hover:text-black shrink-0 transition-colors" />
            </div>
            <span className="text-black group-hover:text-white transition-colors font-bold">Verified Holograms</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-100/80 backdrop-blur-xs border border-slate-200/90 hover:bg-black hover:border-black transition-all duration-300 group cursor-pointer text-center shadow-2xs">
            <div className="p-1 rounded-full bg-black/10 group-hover:bg-white transition-colors">
              <Award className="w-3.5 h-3.5 text-black group-hover:text-black shrink-0 transition-colors" />
            </div>
            <span className="text-black group-hover:text-white transition-colors font-bold">No Fakes. Ever.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
