import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ShieldCheck, Dumbbell, HelpCircle } from 'lucide-react';
import { getCategories, getCategoryBySlug } from '@/lib/data/categories';
import { SITE_URL } from '@/lib/constants';
import { getProductsByCategory } from '@/lib/data/products';
import { getBrands } from '@/lib/data/brands';
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
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found | MuscleWorks Nepal',
      description: 'The requested supplement category could not be found.',
    };
  }

  return {
    title: `Buy Authentic ${category.name} in Nepal | MuscleWorks Kathmandu`,
    description: `Shop 100% genuine imported ${category.name.toLowerCase()} in Nepal at MuscleWorks. Importer hologram seal guaranteed with same-day delivery in Kathmandu.`,
    openGraph: {
      title: `Authentic ${category.name} in Nepal | MuscleWorks Kathmandu`,
      description: category.shortDescription,
      type: 'website',
      url: `${SITE_URL}/categories/${category.slug}`,
    },
  };
}

export default async function CategoryArchivePage(props: PageProps) {
  // Next.js 16 requirement: await params
  const { slug } = await props.params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [products, categories, brands] = await Promise.all([
    getProductsByCategory(category.slug),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-16">
      {/* Category Hero Banner */}
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
                  <Link href="/categories">Categories</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Dumbbell className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Supplement Category
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
                {category.name} in Nepal
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
                {category.longDescription || category.shortDescription}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="authentic" className="py-1 px-3 gap-1.5 text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Importer Hologram Seal</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Catalog Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center text-muted-foreground text-sm">Loading category catalog...</div>}>
          <CatalogContainer
            initialProducts={products}
            categories={categories}
            brands={brands}
          />
        </Suspense>
      </div>

      {/* Category Specific FAQs Section */}
      {category.faqs && category.faqs.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-10 border-t border-border">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                <HelpCircle className="w-3.5 h-3.5 text-primary" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Everything You Need to Know About {category.name}
              </h2>
            </div>

            <div className="space-y-4">
              {category.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-card border border-border p-4 sm:p-5 space-y-2"
                >
                  <h3 className="text-sm sm:text-base font-bold text-foreground">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
