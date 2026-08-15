"use client";

import React, { useState, useRef, useEffect } from "react";
import { Star, ChevronRight } from "lucide-react";
import reviewsData from "@/../data/reviews.json";
import { ReviewItemSchema, type ReviewItem } from "@/lib/validations/review";

// Validate reviews dataset at build time
const reviews: ReviewItem[] = ReviewItemSchema.array().parse(reviewsData);

export function CustomerReviewsSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollPosition = container.scrollLeft;
    const cardWidth = container.offsetWidth;
    const index = Math.round(scrollPosition / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), reviews.length - 1));
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToCard = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardElements = container.children;
    if (cardElements[index]) {
      (cardElements[index] as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
    setActiveIndex(index);
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 border-b border-slate-100 relative overflow-hidden">
      {/* Background Radial Slate Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(15,23,42,0.04),transparent)]"
        aria-hidden="true"
      />

      {/* Glassmorphic Charcoal Diagonal Stripe Slash (Matching Favorite Brand Slice Styling & Shifted Right) */}
      <div className="pointer-events-none absolute inset-0 max-w-full overflow-hidden select-none" aria-hidden="true">
        <div className="absolute -top-64 -bottom-64 left-[55%] sm:left-[64%] md:left-[72%] lg:left-[75%] -translate-x-1/2 w-[240px] sm:w-[550px] md:w-[750px] -skew-x-45 bg-gradient-to-b from-slate-900/8 via-slate-800/5 to-transparent backdrop-blur-[2px] border-x border-slate-900/10 shadow-2xs opacity-85" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row with Right-Aligned Static Title */}
        <div className="flex justify-end mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1 sm:gap-1.5 font-heading font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-slate-950 select-none shrink-0">
            <h2>OUR HAPPY CUSTOMERS</h2>
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF5500] stroke-[3.5]" aria-hidden="true" />
          </div>
        </div>

        {/* Reviews Container: Centered Mobile Horizontal Carousel / Desktop 3-Col Grid */}
        <div
          ref={scrollContainerRef}
          className="flex md:grid md:grid-cols-3 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory gap-5 sm:gap-6 md:gap-0 md:divide-x md:divide-slate-200/80 pb-2 md:pb-0 scroll-smooth scrollbar-none"
        >
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className={`snap-center shrink-0 w-[calc(100vw-2.5rem)] sm:w-[380px] md:w-auto flex flex-col justify-between ${
                index === 0
                  ? "md:pr-8 lg:pr-10"
                  : index === 1
                  ? "md:px-8 lg:px-10"
                  : "md:pl-8 lg:pl-10"
              }`}
            >
              <div>
                {/* 5 Orange Stars */}
                <div
                  className="flex items-center gap-1 mb-3"
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#FF5500] text-[#FF5500]"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Review Headline */}
                <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-950 tracking-tight leading-snug">
                  {review.headline}
                </h3>

                {/* Author & Role Subtitle */}
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                  <span className="text-slate-800 font-bold">{review.author}</span>{" "}
                  <span className="text-slate-400">/</span> {review.role}
                </p>

                {/* Quoted Review Body */}
                <p className="italic text-slate-600 text-sm sm:text-[15px] leading-relaxed font-normal mt-4 sm:mt-5">
                  &ldquo;{review.quote}&rdquo;
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination Indicator Dots */}
        <div
          className="flex md:hidden items-center justify-center gap-2 mt-6"
          aria-label="Customer review pagination indicators"
        >
          {reviews.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToCard(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === i
                  ? "w-6 h-2.5 bg-[#FF5500]"
                  : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to review ${i + 1}`}
              aria-current={activeIndex === i ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
