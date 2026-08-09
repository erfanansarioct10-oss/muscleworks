import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  STORE_NAME,
  STORE_TAGLINE,
  STORE_PHONE,
  STORE_PHONE_RAW,
  STORE_EMAIL,
  STORE_LOCATION,
  STORE_HOURS,
  SOCIAL_LINKS,
} from "@/lib/constants";

const SUPPLEMENT_CATEGORIES = [
  { label: "Whey Protein", href: "/products?category=whey-protein" },
  { label: "Creatine Monohydrate", href: "/products?category=creatine" },
  { label: "Mass Gainers", href: "/products?category=mass-gainer" },
  { label: "Pre-Workout & Energy", href: "/products?category=pre-workout" },
  { label: "BCAA & Essential Aminos", href: "/products?category=amino-bcaa" },
  { label: "Vitamins & Fish Oil", href: "/products?category=vitamins-health" },
  { label: "All Supplements", href: "/products" },
] as const;

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Delivery & Returns", href: "/delivery-returns" },
  { label: "Authenticity Disclaimer", href: "/disclaimer" },
] as const;

export function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className="border-t border-border bg-card/80 text-foreground transition-colors"
    >
      {/* Main Multi-Column Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* Column 1: Brand Manifesto & Socials */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="group flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${STORE_NAME} Home`}
            >
              <div className="relative h-14 w-72 shrink-0">
                <Image
                  src="/brnding-assets/logo.webp"
                  alt={STORE_NAME}
                  fill
                  className="object-contain object-left transition-transform group-hover:scale-105"
                />
              </div>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              {STORE_TAGLINE}. Dedicated to eliminating counterfeit sports nutrition across Nepal with 100% lab-verified, authorized importer sourced supplements.
            </p>

            <div className="pt-1">
              <Badge variant="authentic" className="gap-1.5 py-1 px-2.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Authorized Importer Partner</span>
              </Badge>
            </div>

            {/* Social Channels */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Connect With Us
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-secondary/60 px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-border-focus hover:bg-muted hover:text-foreground active:scale-95"
                    aria-label={social.label}
                  >
                    {social.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Supplement Categories */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Supplement Categories
            </h3>
            <ul className="flex flex-col space-y-2 text-xs">
              {SUPPLEMENT_CATEGORIES.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="group inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ChevronRight className="h-3 w-3 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Flagship Store & Operating Hours */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground">
              Golfutar Flagship Store
            </h3>
            <div className="flex flex-col space-y-3 text-xs text-muted-foreground">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {STORE_LOCATION.street}, {STORE_LOCATION.area}
                  </span>
                  <span>{STORE_LOCATION.city} ({STORE_LOCATION.postalCode}), Nepal</span>
                  <span className="text-[11px] text-muted-foreground/80 mt-0.5">
                    {STORE_LOCATION.landmark}
                  </span>
                  <a
                    href={STORE_LOCATION.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1 font-medium text-foreground hover:text-accent hover:underline mt-1"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">Opening Hours</span>
                  <span>{STORE_HOURS.weekdays}</span>
                  <span>{STORE_HOURS.saturday}</span>
                </div>
              </div>

              {/* Direct Contacts */}
              <div className="flex flex-col gap-1.5 pt-1">
                <a
                  href={`tel:${STORE_PHONE_RAW}`}
                  className="inline-flex min-h-12 min-w-12 items-center gap-2 font-medium text-foreground hover:text-accent"
                >
                  <Phone className="h-3.5 w-3.5 text-accent" />
                  <span>{STORE_PHONE}</span>
                </a>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{STORE_EMAIL}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <Separator className="my-8 opacity-40" />

        {/* Bottom Legal, Trust & Copyright Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {LEGAL_LINKS.map((legal) => (
              <Link
                key={legal.href}
                href={legal.href}
                className="inline-flex min-h-11 items-center transition-colors hover:text-foreground"
              >
                {legal.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
