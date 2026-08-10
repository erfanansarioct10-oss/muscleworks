import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProducts, getProductBySlug } from '@/lib/data/products';
import { getCategoryById } from '@/lib/data/categories';
import { getBrandById } from '@/lib/data/brands';
import { formatNprPrice } from '@/lib/utils';
import type { ProductVariant } from '@/lib/validations/product';
import type { ImageAsset } from '@/lib/validations/common';
import { ProductDetailView } from '@/components/product/product-detail-view';
import { RelatedProducts } from '@/components/product/related-products';


interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | MuscleWorks Supplements',
      description: 'The requested supplement product could not be found.',
    };
  }

  const brand = await getBrandById(product.brandId);
  const defaultVariant =
    product.variants.find((v: ProductVariant) => v.id === product.defaultVariantId) ||
    product.variants[0];
  const activePrice = defaultVariant.discountPriceNpr || defaultVariant.priceNpr;
  const priceFormatted = formatNprPrice(activePrice);

  return {
    title: `Buy ${product.name} in Nepal (${priceFormatted}) | MuscleWorks Kathmandu`,
    description: `Shop 100% authentic ${product.name} ${brand ? `by ${brand.name}` : ''} in Nepal at MuscleWorks. Importer hologram seal guaranteed with same-day Kathmandu delivery.`,
    openGraph: {
      title: `${product.name} | Authentic Supplement in Nepal`,
      description: product.shortDescription,
      type: 'website',
      url: `https://muscleworks.com.np/products/${product.slug}`,
      images: product.images.map((img: ImageAsset) => ({
        url: img.url,
        alt: img.alt || product.name,
      })),
    },
  };
}

export default async function ProductDetailPage(props: PageProps) {
  // Next.js 16 requirement: await params
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [category, brand] = await Promise.all([
    getCategoryById(product.categoryId),
    getBrandById(product.brandId),
  ]);

  const defaultVariant =
    product.variants.find((v: ProductVariant) => v.id === product.defaultVariantId) ||
    product.variants[0];

  // Schema.org Product + Offer JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images.map((img: ImageAsset) => img.url),

    description: product.shortDescription,
    sku: defaultVariant.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: brand?.name || 'MuscleWorks',
    },
    offers: {
      '@type': 'Offer',
      url: `https://muscleworks.com.np/products/${product.slug}`,
      priceCurrency: 'NPR',
      price: defaultVariant.discountPriceNpr || defaultVariant.priceNpr,
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        defaultVariant.stockStatus === 'out_of_stock'
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'MuscleWorks Supplements Nepal',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Golfutar Main Road',
          addressLocality: 'Budha-Nilkantha',
          addressRegion: 'Kathmandu',
          postalCode: '44500',
          addressCountry: 'NP',
        },
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <ProductDetailView
        product={product}
        category={category || undefined}
        brand={brand || undefined}
        relatedProductsChildren={<RelatedProducts currentProduct={product} />}
      />
    </>
  );
}
