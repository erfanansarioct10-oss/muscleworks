import type { Metadata } from 'next';
import Link from 'next/link';
import { Layers, ArrowRight, ShieldCheck, Dumbbell } from 'lucide-react';
import { getCategories } from '@/lib/data/categories';
import { getProducts } from '@/lib/data/products';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const metadata: Metadata = {
  title: 'Supplement Categories in Nepal | Whey, Creatine, Mass Gainers | MuscleWorks',
  description:
    'Browse all authentic supplement categories at MuscleWorks Nepal. Proteins, Creatine, Mass Gainers, Pre-Workout, Vitamins & Amino Acids with 100% importer hologram seals.',
  openGraph: {
    title: 'Supplement Categories in Nepal | MuscleWorks Kathmandu',
    description:
      'Browse authentic imported supplement categories in Nepal with official importer hologram seals.',
    type: 'website',
    url: 'https://muscleworks.com.np/categories',
  },
};

export default async function CategoriesIndexPage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  // Compute product count per category
  const productCountMap: Record<string, number> = {};
  products.forEach((p) => {
    productCountMap[p.categoryId] = (productCountMap[p.categoryId] ?? 0) + 1;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Header Container */}
      <div className="border-b border-border bg-card/40 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Supplement Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                <Layers className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                <span>Supplement Categories</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                Browse our curated categories of 100% genuine imported supplements in Nepal. Formulated for muscle growth, strength, endurance, fat loss, and daily health.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="authentic" className="py-1 px-3 gap-1.5 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Importer Seal</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {categories.map((category) => {
            const count = productCountMap[category.id] ?? 0;
            return (
              <div
                key={category.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-5 sm:p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/categories/${category.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {category.name}
                      </Link>
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {category.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-primary group-hover:underline">
                    Explore Products
                  </span>
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
