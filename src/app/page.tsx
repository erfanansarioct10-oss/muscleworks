import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex max-w-lg flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="relative h-16 w-72 sm:h-20 sm:w-96">
          <Image
            src="/brnding-assets/nlogo.png"
            alt="MuscleWorks Supplements Nepal"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            Golfutar, Budha-Nilkantha, Kathmandu (44500) • 100% Genuine Sports Nutrition
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Sub-Phase 0.2 Active
          </span>
          <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            Tailwind v4 Theme Loaded
          </span>
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-amber-700">
            Minimal Premium Modern Luxury
          </span>
        </div>
      </div>
    </main>
  );
}
