import type { Metadata } from 'next';
import Link from 'next/link';
import { Award, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import { getBrands } from '@/lib/data/brands';
import { getProducts } from '@/lib/data/products';
import { SITE_URL } from '@/lib/constants';
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
  title: 'Authorized Supplement Brands in Nepal | ON, MuscleTech, Dymatize | MuscleWorks',
  description:
    'Browse authorized international supplement brands imported in Nepal at MuscleWorks. Optimum Nutrition, MuscleTech, Dymatize, MyProtein, Kevin Levrone, Rule 1, Labrada, Cellucor.',
  openGraph: {
    title: 'Authorized Supplement Brands in Nepal | MuscleWorks Kathmandu',
    description:
      'Explore official authorized supplement brands in Nepal with 100% genuine importer seals and lab-tested verification.',
    type: 'website',
    url: `${SITE_URL}/brands`,
  },
};

export default async function BrandsIndexPage() {
  const [brands, products] = await Promise.all([
    getBrands(),
    getProducts(),
  ]);

  // Compute product count per brand
  const productCountMap: Record<string, number> = {};
  products.forEach((p) => {
    productCountMap[p.brandId] = (productCountMap[p.brandId] ?? 0) + 1;
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
                <BreadcrumbPage>Authorized Brands</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
                <Award className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                <span>Authorized Importer Brands</span>
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                We partner exclusively with official authorized importers in Nepal. Every container features genuine scratch codes, holographic seals, and verified distribution channels.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="authentic" className="py-1 px-3 gap-1.5 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Official Importer Verification</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Brands Grid Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {brands.map((brand) => {
            const count = productCountMap[brand.id] ?? 0;
            return (
              <div
                key={brand.id}
                className="group relative flex flex-col justify-between rounded-2xl bg-card border border-border p-5 sm:p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-secondary border border-border text-xs font-semibold text-foreground">
                      <Globe className="w-3.5 h-3.5 text-primary" />
                      <span>{brand.countryOfOrigin ?? 'USA'}</span>
                    </div>

                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {count} {count === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      <Link href={`/brands/${brand.slug}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true" />
                        {brand.name}
                      </Link>
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                      {brand.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">{brand.officialDistributorInfo ?? 'Official Importer Seal'}</span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0">
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
