"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  Phone,
  ShieldCheck,
  MapPin,
  Sparkles,
  BookOpen,
  Flame,
  Dumbbell,
  Zap,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  STORE_NAME,
  STORE_PHONE,
  STORE_PHONE_RAW,
  STORE_WHATSAPP,
  STORE_HOURS,
} from "@/lib/constants";

const CATEGORY_ITEMS = [
  {
    label: "Whey Proteins",
    href: "/categories/proteins",
    icon: Dumbbell,
    badge: "Popular",
  },
  {
    label: "Creatine Monohydrate",
    href: "/categories/creatine",
    icon: Zap,
    badge: "Essential",
  },
  {
    label: "Mass Gainers",
    href: "/categories/mass-gainers",
    icon: Flame,
  },
  {
    label: "Pre-Workouts",
    href: "/categories/pre-workout",
    icon: Sparkles,
  },
  {
    label: "Browse All Products",
    href: "/products",
    icon: Dumbbell,
  },
];

const TRUST_NAV_ITEMS = [
  {
    label: "100% Authenticity Guarantee",
    href: "/authenticity",
    icon: ShieldCheck,
    description: "Official authorized importer holograms",
  },
  {
    label: "Golfutar Store Location",
    href: "/location",
    icon: MapPin,
    description: STORE_HOURS.displayShort,
  },
  {
    label: "Supplement & Stack Guides",
    href: "/guides",
    icon: BookOpen,
    description: "Nepal fitness & dosage guides",
  },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hello MuscleWorks Nepal! I would like to inquire about authentic supplements and stock availability."
  )}`;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open mobile navigation menu"
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-95 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full max-w-sm flex-col justify-between p-0 sm:max-w-md"
      >
        {/* Drawer Header */}
        <SheetHeader className="border-b border-border p-5 text-left">
          <div className="flex items-center pr-8">
            <div className="relative h-12 w-60 shrink-0">
              <Image
                src="/brnding-assets/nlogo.png"
                alt={STORE_NAME}
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>
          <SheetTitle className="sr-only">{STORE_NAME} Navigation</SheetTitle>
        </SheetHeader>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          {/* Supplement Categories */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Supplement Categories
            </p>
            <div className="space-y-1">
              {CATEGORY_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <Badge variant="default" className="text-[10px]">
                        {item.badge}
                      </Badge>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Trust & Store Links */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Store & Authenticity
            </p>
            <div className="space-y-1">
              {TRUST_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-accent">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {item.description}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pinned Bottom Actions */}
        <div className="space-y-2.5 border-t border-border bg-card/60 p-4">
          <Button
            asChild
            variant="whatsapp"
            size="lg"
            className="w-full justify-center gap-2 shadow-lg font-semibold"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Order on WhatsApp</span>
            </a>
          </Button>

          <Button
            asChild
            variant="outline"
            size="default"
            className="w-full justify-center gap-2"
          >
            <a href={`tel:${STORE_PHONE_RAW}`}>
              <Phone className="h-4 w-4 text-foreground" />
              <span>Call Store: {STORE_PHONE}</span>
            </a>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
