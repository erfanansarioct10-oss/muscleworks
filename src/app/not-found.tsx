import Link from "next/link";
import {
  SearchX,
  ArrowRight,
  MessageCircle,
  Home,
  Dumbbell,
  ShieldCheck,
  MapPin,
  Flame,
} from "lucide-react";
import {
  STORE_WHATSAPP,
  STORE_LOCATION,
} from "@/lib/constants";

const CATEGORY_SHORTCUTS = [
  { label: "Whey Proteins", href: "/categories/proteins", icon: Dumbbell },
  { label: "Creatine Monohydrate", href: "/categories/creatine", icon: Flame },
  { label: "Mass Gainers", href: "/categories/mass-gainers", icon: ShieldCheck },
  { label: "Pre-Workouts", href: "/categories/pre-workouts", icon: Flame },
  { label: "Golfutar Store", href: "/location", icon: MapPin },
] as const;

export default function NotFound() {
  const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\+/g, "")}?text=${encodeURIComponent(
    "Hi MuscleWorks, I landed on a missing page on your website and need help finding a product."
  )}`;

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl text-center">
        {/* Athletic Visual Icon Badge */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card shadow-xl ring-1 ring-primary/20 sm:h-24 sm:w-24">
          <div className="relative">
            <SearchX
              className="h-10 w-10 text-primary animate-pulse sm:h-12 sm:w-12"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Status Tag */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <span>Error 404</span>
          <span className="text-muted-foreground">•</span>
          <span>Route Not Found</span>
        </div>

        {/* Headings */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Workout Route Not Found
        </h1>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg max-w-lg mx-auto">
          The supplement, brand, or page you are looking for has been moved, renamed,
          or is temporarily out of stock in Kathmandu.
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/products"
            className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover active:scale-[0.98]"
          >
            <span>Browse Supplement Catalog</span>
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-success px-6 text-base font-semibold text-success-foreground shadow-lg shadow-success/20 transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            <span>Ask Support on WhatsApp</span>
          </a>

          <Link
            href="/"
            className="inline-flex h-12 min-h-[48px] w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-5 text-base font-semibold text-secondary-foreground transition-all hover:bg-secondary/80 active:scale-[0.98]"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </div>

        {/* Quick Jump Category Shortcuts */}
        <div className="mt-12 border-t border-border/60 pt-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular Supplement Hubs
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_SHORTCUTS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary/40 hover:bg-muted hover:text-primary active:scale-95"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Physical Store Location Reminder */}
        <div className="mt-8 text-xs text-muted-foreground">
          <span>Need immediate assistance? Visit our physical store at </span>
          <span className="font-semibold text-foreground">{STORE_LOCATION.fullAddress}</span>
        </div>
      </div>
    </div>
  );
}
