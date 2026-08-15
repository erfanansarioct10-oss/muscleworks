import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface GoalCardItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  imageSrc?: string;
  imageAlt: string;
}

const GOAL_CARDS: GoalCardItem[] = [
  {
    id: "goal_burn",
    title: "BUILD YOUR BURN",
    subtitle: "Get Cut",
    description: "Shred fat & reveal lean muscle definition",
    href: "/products?category=creatine",
    imageSrc: "/goals/get-cut.webp",
    imageAlt: "BUILD YOUR BURN - Fat loss & cut supplements stack",
  },
  {
    id: "goal_performance",
    title: "BUILD YOUR PERFORMANCE",
    subtitle: "Get Powerful",
    description: "Maximize energy, focus & workout intensity",
    href: "/products?category=pre-workout",
    imageSrc: "/goals/get-powerful.webp",
    imageAlt: "BUILD YOUR PERFORMANCE - Power & pre-workout supplements stack",
  },
  {
    id: "goal_strength",
    title: "BUILD YOUR STRENGTH",
    subtitle: "Get Muscles",
    description: "Accelerate muscle growth & heavy strength gains",
    href: "/products?category=proteins",
    imageSrc: "/goals/get-muscles.webp",
    imageAlt: "BUILD YOUR STRENGTH - Muscle building whey protein stack",
  },
];

export function ShopByGoalSection() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-950 py-12 sm:py-16 lg:py-20 border-b border-slate-800">
      {/* Responsive Background Charcoal Textures */}
      {/* Mobile Vertical Texture */}
      <Image
        src="/deals/charcoal-bg-mobile.webp"
        alt="Dark Charcoal Background Texture Mobile"
        fill
        sizes="(max-width: 640px) 100vw, 1px"
        className="object-cover object-center sm:hidden"
      />
      {/* Desktop & Tablet Widescreen Texture */}
      <Image
        src="/deals/charcoal-bg.webp"
        alt="Dark Charcoal Background Texture Desktop"
        fill
        sizes="(min-width: 640px) 100vw, 1px"
        className="hidden sm:block object-cover object-center"
      />

      {/* Dark Shadow Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subheading */}
        <div className="flex flex-col justify-center items-center text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-black tracking-tight uppercase text-white">
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 hover:text-slate-300 transition-colors duration-200"
            >
              <span>SHOP BY <span className="text-slate-500">GOAL</span></span>
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white stroke-[3] group-hover:translate-x-1 transition-transform" />
            </Link>
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium max-w-lg">
            Targeted supplement stacks engineered to fuel your specific fitness transformation
          </p>
        </div>

        {/* 3-Column Goal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {GOAL_CARDS.map((goal) => (
            <Link
              key={goal.id}
              href={goal.href}
              className="group relative flex flex-col items-center text-center rounded-xl p-2 sm:p-4 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              {/* Parallelogram Background Shape (Behind Image) */}
              <div className="relative w-full aspect-square flex items-center justify-center">
                {/* Slanted Parallelogram Card Background */}
                <div
                  className="absolute inset-x-2 sm:inset-x-4 top-8 bottom-4 -skew-x-12 rounded-lg bg-white/10 border border-white/10 group-hover:bg-white/20 transition-all duration-300 ease-out group-hover:shadow-xl group-hover:shadow-black/40 group-hover:scale-[1.02]"
                  aria-hidden="true"
                />

                {/* Transparent Goal Image (Extending above the card) */}
                {goal.imageSrc ? (
                  <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
                    <Image
                      src={goal.imageSrc}
                      alt={goal.imageAlt}
                      width={450}
                      height={450}
                      className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300 ease-out"
                    />
                  </div>
                ) : null}
              </div>

              {/* Typography Below Card */}
              <div className="mt-4 flex flex-col items-center">
                <h3 className="font-heading font-black italic tracking-tight text-xl sm:text-2xl uppercase text-white group-hover:text-slate-200 transition-colors duration-200">
                  {goal.title}
                </h3>
                <span className="mt-1 text-sm sm:text-base font-semibold text-slate-300 underline underline-offset-4 decoration-slate-600 group-hover:text-white group-hover:decoration-white transition-colors duration-200">
                  {goal.subtitle}
                </span>
                <p className="mt-1.5 text-xs sm:text-sm text-slate-400 font-normal max-w-[240px]">
                  {goal.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
