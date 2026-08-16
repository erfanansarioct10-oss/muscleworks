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

function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

const SUPPLEMENT_CATEGORIES = [
  { label: "Whey Protein", href: "/products?category=proteins" },
  { label: "Creatine Monohydrate", href: "/products?category=creatine" },
  { label: "Mass Gainers", href: "/products?category=mass-gainers" },
  { label: "Pre-Workout & Energy", href: "/products?category=pre-workout" },
  { label: "BCAA & Essential Aminos", href: "/products?category=amino-bcaa" },
  { label: "Vitamins & Fish Oil", href: "/products?category=vitamins-health" },
  { label: "All Supplements", href: "/products" },
] as const;

const LEGAL_LINKS = [
  { label: "Authenticity Guarantee", href: "/authenticity" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Return Policy", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

export function Footer() {
  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className="relative border-t border-border bg-card/80 text-foreground transition-colors overflow-hidden"
    >
      {/* Background Radial Slate Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(15,23,42,0.04),transparent)]"
        aria-hidden="true"
      />

      {/* Glassmorphic Charcoal Diagonal Slice (Shifted Farther to the Right) */}
      <div className="pointer-events-none absolute inset-0 max-w-full overflow-hidden select-none" aria-hidden="true">
        <div className="absolute -top-64 -bottom-64 left-[62%] sm:left-[66%] lg:left-[70%] -translate-x-1/2 w-[240px] sm:w-[500px] md:w-[700px] lg:w-[800px] -skew-x-45 bg-gradient-to-b from-slate-900/8 via-slate-800/5 to-transparent backdrop-blur-[2px] border-x border-slate-900/10 shadow-2xs opacity-85" />
      </div>

      {/* Main Multi-Column Content Area */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-4 sm:px-6 sm:pt-12 sm:pb-5 lg:px-8 lg:pt-14 lg:pb-6">
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
                  sizes="(max-width: 640px) 240px, 288px"
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

            {/* Official Social Channels (WhatsApp & Instagram Only) */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                {SOCIAL_LINKS.map((social) => {
                  const isWhatsApp = social.platform === "WhatsApp";
                  return (
                    <a
                      key={social.platform}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border bg-secondary/60 p-2.5 text-muted-foreground transition-all duration-200 active:scale-95 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isWhatsApp
                          ? "hover:border-emerald-500 hover:bg-emerald-600 hover:text-white"
                          : "hover:border-pink-500 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white"
                      }`}
                      aria-label={social.label}
                    >
                      {isWhatsApp ? (
                        <WhatsAppIcon className="h-5 w-5" />
                      ) : (
                        <InstagramIcon className="h-5 w-5" />
                      )}
                    </a>
                  );
                })}
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
                    className="group inline-flex min-h-11 items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
                  >
                    <ChevronRight className="h-3 w-3 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />
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
                <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" aria-hidden="true" />
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
                    className="inline-flex min-h-11 items-center gap-1 font-medium text-foreground hover:text-accent hover:underline mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-2.5 pt-1">
                <Clock className="h-4 w-4 shrink-0 text-accent mt-0.5" aria-hidden="true" />
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
                  className="inline-flex min-h-12 min-w-12 items-center gap-2 font-medium text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                >
                  <Phone className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                  <span>{STORE_PHONE}</span>
                </a>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                >
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                  <span>{STORE_EMAIL}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Massive Statement Typography ("Antigravity" Style Brandmark) */}
        <div className="w-full border-t border-border/40 select-none pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-8 lg:pb-8 flex items-center justify-center">
          <svg
            viewBox="0 0 1040 140"
            className="w-full h-auto select-none pointer-events-none overflow-visible"
            aria-hidden="true"
          >
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              className="font-heading font-black uppercase fill-foreground tracking-tighter"
              fontSize="128"
              letterSpacing="-0.035em"
            >
              MUSCLEWORKS
            </text>
          </svg>
        </div>

        {/* Separator */}
        <Separator className="mb-4 sm:mb-5 opacity-40" />

        {/* Bottom Legal, Trust & Copyright Bar */}
        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {LEGAL_LINKS.map((legal) => (
              <Link
                key={legal.href}
                href={legal.href}
                className="inline-flex min-h-[44px] items-center py-2 px-1 text-xs transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
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
