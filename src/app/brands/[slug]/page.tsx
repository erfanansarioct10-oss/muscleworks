import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Award, Globe, CheckCircle2 } from 'lucide-react';
import { getBrands, getBrandBySlug } from '@/lib/data/brands';
import { getProducts } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';
import { CatalogContainer } from '@/components/catalog/catalog-container';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((brand) => ({
    slug: brand.slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return {
      title: 'Brand Not Found | MuscleWorks Nepal',
      description: 'The requested supplement brand could not be found.',
    };
  }

  return {
    title: `Buy Authentic ${brand.name} Supplements in Nepal | MuscleWorks`,
    description: `Shop 100% genuine ${brand.name} products in Nepal with official importer hologram seals, fast Kathmandu delivery, and best NPR prices at MuscleWorks.`,
    openGraph: {
      title: `Authentic ${brand.name} Supplements in Nepal | MuscleWorks Kathmandu`,
      description: brand.description,
      type: 'website',
      url: `https://muscleworks.com.np/brands/${brand.slug}`,
    },
  };
}

export default async function BrandArchivePage(props: PageProps) {
  // Next.js 16 requirements: await params and searchParams
  const { slug } = await props.params;
  await props.searchParams;

  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const [products, categories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Brand Hero Banner */}
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
                <BreadcrumbLink asChild>
                  <Link href="/brands">Brands</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{brand.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Authorized Importer Partner
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                  {brand.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-xs font-semibold text-muted-foreground">
                  <Globe className="w-3.5 h-3.5 text-primary" />
                  <span>{brand.countryOfOrigin ?? 'USA'}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                {brand.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5">
              <Badge variant="authentic" className="py-1 px-3 gap-1.5 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Authentic Importer Seal</span>
              </Badge>
              {brand.officialDistributorInfo && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-border text-xs text-muted-foreground font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Importer: {brand.officialDistributorInfo}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Container */}
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
