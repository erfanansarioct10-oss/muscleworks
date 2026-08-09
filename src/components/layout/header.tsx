import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { STORE_NAME, STORE_WHATSAPP } from "@/lib/constants";

export function Header() {
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello MuscleWorks Nepal! I'd like to order authentic supplements / check product stock."
  )}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Logotype */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 rounded-xl py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${STORE_NAME} Home`}
        >
          <div className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden">
            <Image
              src="/brnding-assets/new-logo.png"
              alt={STORE_NAME}
              fill
              className="object-contain invert transition-transform group-hover:scale-105"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg sm:text-xl font-extrabold tracking-wider text-foreground leading-none">
              MUSCLEWORKS
            </span>
            <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase leading-tight">
              Supplements Nepal
            </span>
          </div>
        </Link>

        {/* Desktop Navbar */}
        <Navbar />

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Catalog Search Button */}
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
          >
            <Link href="/products" aria-label="Search supplement catalog">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          {/* High-Conversion WhatsApp CTA Button */}
          <Button
            asChild
            variant="whatsapp"
            size="default"
            className="hidden sm:inline-flex shadow-md shadow-success/20 gap-2 font-semibold"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Order</span>
            </a>
          </Button>

          {/* Mobile Drawer Trigger */}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
