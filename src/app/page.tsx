import { HeroSection } from "@/components/home/hero-section";
import { BrandsMarquee } from "@/components/home/brands-marquee";

export default function HomePage() {
  return (
    <div className="w-full flex-1 bg-background">
      <HeroSection />
      <BrandsMarquee />
    </div>
  );
}

