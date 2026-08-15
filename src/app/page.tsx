import { HeroSection } from "@/components/home/hero-section";
import { ShopByGoalSection } from "@/components/home/shop-by-goal-section";
import { BrandsMarquee } from "@/components/home/brands-marquee";
import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { DealsSection } from "@/components/home/deals-section";
import { FavoriteBrandSection } from "@/components/home/favorite-brand-section";
import { CustomerReviewsSection } from "@/components/home/customer-reviews-section";
import { HomeContactSection } from "@/components/home/home-contact-section";

export default function HomePage() {
  return (
    <div className="w-full flex-1 bg-background">
      <HeroSection />
      <ShopByGoalSection />
      <BrandsMarquee />
      <FeaturedProductsSection />
      <DealsSection />
      <FavoriteBrandSection />
      <CustomerReviewsSection />
      <HomeContactSection />
    </div>
  );
}





