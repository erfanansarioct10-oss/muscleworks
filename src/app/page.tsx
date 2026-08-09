import Image from "next/image";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex max-w-lg flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="relative h-20 w-48 overflow-hidden">
          <Image
            src="/brnding-assets/new-logo.png"
            alt="MuscleWorks Supplements"
            fill
            className="object-contain invert"
            priority
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            MUSCLEWORKS SUPPLEMENTS
          </h1>
          <p className="text-sm text-muted-foreground">
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
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            Stealth Crimson & Obsidian
          </span>
        </div>
      </div>
    </main>
  );
}
