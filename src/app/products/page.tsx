import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/data/products';
import { getCategories, getCategoryBySlug } from '@/lib/data/categories';
import { getBrands } from '@/lib/data/brands';
import { CatalogContainer } from '@/components/catalog/catalog-container';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : undefined;

  let title = 'Buy Authentic Supplements in Nepal | MuscleWorks Catalog';
  let description =
    'Browse 100% genuine imported supplements in Nepal. Whey protein, creatine, mass gainers, pre-workout & vitamins with authorized importer hologram seals and fast Kathmandu Valley delivery.';

  if (categoryParam) {
    const category = await getCategoryBySlug(categoryParam);
    if (category) {
      title = `Buy Authentic ${category.name} in Nepal | MuscleWorks Kathmandu`;
      description = `Shop 100% genuine imported ${category.name.toLowerCase()} in Nepal. Direct authorized importer seal, lab-tested quality, and same-day delivery in Kathmandu.`;
    }
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://muscleworks.com.np/products',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ProductsPage(props: PageProps) {
  // Next.js 16 requirement: await searchParams
  await props.searchParams;

  // Fetch initial catalog datasets concurrently
  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Page Header & Breadcrumb Container */}
      <div className="border-b border-border bg-card/40 py-6 sm:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Accessible Breadcrumb Trail */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Supplements Catalog</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Heading & Trust Pillars */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                Authentic Supplements Catalog
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
                100% genuine imported fitness supplements in Nepal. Verified with official importer hologram seals, competitive NPR pricing, and direct physical outlet in Golfutar, Kathmandu.
              </p>
            </div>

            {/* Authenticity & Delivery Trust Micro-Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Importer Seal Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Kathmandu Same-Day Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Catalog Filter & Grid Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <CatalogContainer
          initialProducts={products}
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
}
