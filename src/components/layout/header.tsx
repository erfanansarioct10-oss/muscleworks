import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { STORE_NAME, STORE_WHATSAPP } from "@/lib/constants";

import { SearchModal } from "@/components/catalog/search-modal";

export function Header() {
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello MuscleWorks Nepal! I'd like to order authentic supplements / check product stock."
  )}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Logotype */}
        <Link
          href="/"
          className="group flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`${STORE_NAME} Home`}
        >
          <div className="relative h-10 w-44 sm:h-12 sm:w-52 lg:h-14 lg:w-72 shrink-0">
            <Image
              src="/brnding-assets/logo.webp"
              alt={STORE_NAME}
              fill
              className="object-contain object-left transition-transform group-hover:scale-105"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navbar */}
        <Navbar />

        {/* Right Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Catalog Search Trigger Button */}
          <SearchModal>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground min-h-11 min-w-11"
              aria-label="Search supplement catalog"
            >
              <Search className="h-5 w-5" />
            </Button>
          </SearchModal>

          {/* High-Conversion WhatsApp CTA Button */}
          <Button
            asChild
            variant="whatsapp"
            size="default"
            className="hidden sm:inline-flex gap-2 font-semibold"
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
