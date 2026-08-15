"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  isInView: boolean;
}

function AnimatedCounter({ end, suffix = "", duration = 1800, isInView }: CounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, end, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function FavoriteBrandSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-white py-14 sm:py-20 lg:py-24 border-b border-slate-100 relative overflow-hidden"
    >
      {/* Dynamic Background Radial Slate Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(15,23,42,0.04),transparent)]"
        aria-hidden="true"
      />

      {/* Glassmorphic Charcoal Diagonal Slice (Steep Tilt - Matching Section 3 Style) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none" aria-hidden="true">
        <div className="absolute -top-64 -bottom-64 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] md:w-[850px] -skew-x-45 bg-gradient-to-b from-slate-900/8 via-slate-800/5 to-transparent backdrop-blur-[2px] border-x border-slate-900/10 shadow-2xs opacity-85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Direct Content Placement on Background */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Main Display Heading */}
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-black leading-[1.08]">
              MOST FAVOURITE <br />
              SUPPLEMENT BRAND
            </h2>

            {/* Brand Story Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mt-5 sm:mt-6 max-w-xl">
              MuscleWorks is Nepal&apos;s leading authentic sports nutrition retailer,
              situated at Golfutar, Budha-Nilkantha, Kathmandu. We stock the latest
              genuine international brands with verified importer hologram security seals,
              offering guaranteed authenticity and fast nationwide delivery at unbeatable prices.
            </p>

            {/* Subtle Divider Line */}
            <div className="w-full border-t border-slate-200/80 my-7 sm:my-8" />

            {/* Upward-Animated Milestone Stats Row */}
            <div className="grid grid-cols-2 gap-6 sm:gap-10">
              {/* Stat 1 */}
              <div
                className={`transform transition-all duration-700 ease-out ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "150ms" }}
              >
                <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#FF5500] tracking-tight leading-none">
                  <AnimatedCounter end={15000} suffix="+" isInView={isInView} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mt-2.5 block">
                  BOTTLES DELIVERED
                </span>
              </div>

              {/* Stat 2 */}
              <div
                className={`transform transition-all duration-700 ease-out ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: "300ms" }}
              >
                <div className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-[#FF5500] tracking-tight leading-none">
                  <AnimatedCounter end={5000} suffix="+" isInView={isInView} />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mt-2.5 block">
                  CUSTOMERS SERVED
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Creatively Styled Image Frame */}
          <div className="lg:col-span-6 relative">
            {/* Layer 1: Stylized Offset Geometric Background Frame */}
            <div
              className="absolute -inset-2 sm:-inset-3.5 rounded-3xl bg-gradient-to-tr from-slate-900/15 via-slate-800/10 to-[#FF5500]/15 -rotate-1"
              aria-hidden="true"
            />

            {/* Layer 2: Main Image Frame with Luxury Border Styling */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-200/90 shadow-2xl aspect-[16/10] sm:aspect-[16/10] lg:aspect-[16/11]">
              <Image
                src="/brand-feature/favorite-brand-new.webp"
                alt="MuscleWorks Nepal - Official BioTechUSA Athlete in Gym"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
