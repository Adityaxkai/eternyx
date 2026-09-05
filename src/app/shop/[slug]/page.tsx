import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import productsData from '@/data/products.json';
import { productService } from '@/services/productService';
import { Product } from '@/lib/types';
import ProductDetailClient from '@/components/ProductDetailClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
}

export async function generateStaticParams() {
  try {
    const dbProducts = await productService.getAll();
    if (dbProducts && dbProducts.length > 0) {
      return dbProducts.map((p) => ({
        slug: getSlug(p.name),
      }));
    }
  } catch (e) {
    console.warn('generateStaticParams db fallback:', e);
  }

  return (productsData as any[]).map((p) => ({
    slug: getSlug(p.name),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  let dbProduct: Product | undefined;
  
  try {
    const dbProducts = await productService.getAll();
    dbProduct = dbProducts.find(
      (p) => getSlug(p.name) === slug.toLowerCase().trim() || p.id === slug
    );
  } catch (e) {
    console.warn('generateMetadata db fallback:', e);
  }

  const richData = (productsData as any[]).find(
    (p) => getSlug(p.name) === slug.toLowerCase().trim() || p.id === slug
  );

  const product = dbProduct || richData;

  if (!product) {
    return {
      title: 'Fragrance Not Found | ETERNYX',
      description: 'The requested luxury fragrance could not be found.',
    };
  }

  const title = richData?.seo_title || `${product.name} Eau de Parfum | ETERNYX Luxury Fragrance`;
  const description = richData?.seo_description || product.description;
  const keywords = richData?.shopify_keywords || richData?.product_tags || [];
  const imageUrl = product.image_url || '/images/hero.png';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://eternyx.com/shop/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1000,
          alt: (richData?.image_alt && richData.image_alt[0]) || `${product.name} by ETERNYX`,
        },
      ],
      siteName: 'ETERNYX Luxury Fragrances',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `https://eternyx.com/shop/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  let dbProduct: Product | undefined;
  try {
    const dbProducts = await productService.getAll();
    dbProduct = dbProducts.find(
      (p) => getSlug(p.name) === slug.toLowerCase().trim() || p.id === slug
    );
  } catch (e) {
    console.warn('ProductPage db fetch fallback:', e);
  }

  const richProductData = (productsData as any[]).find(
    (p) => getSlug(p.name) === slug.toLowerCase().trim() || p.id === slug
  );

  if (!dbProduct && !richProductData) {
    notFound();
  }

  const product: Product = {
    id: dbProduct ? dbProduct.id : String(richProductData?.id || richProductData?.position || '1'),
    name: dbProduct ? dbProduct.name : richProductData?.name,
    category: dbProduct?.category || richProductData?.category || 'Eau de Parfum',
    price: dbProduct ? Number(dbProduct.price) : (Number(richProductData?.price) || 599),
    description: dbProduct?.description || richProductData?.description || '',
    volume: dbProduct?.volume || '100ml',
    image_url: dbProduct?.image_url || richProductData?.image_url || '',
    position: dbProduct?.position ?? (richProductData?.position || 0),
    visible: dbProduct?.visible ?? true,
    badge: dbProduct?.badge || richProductData?.badge || null,
    top_notes: (dbProduct?.top_notes && dbProduct.top_notes.length > 0)
      ? dbProduct.top_notes
      : (richProductData?.scent_notes?.top || richProductData?.top_notes || []),
    heart_notes: (dbProduct?.heart_notes && dbProduct.heart_notes.length > 0)
      ? dbProduct.heart_notes
      : (richProductData?.scent_notes?.mid || richProductData?.heart_notes || []),
    base_notes: (dbProduct?.base_notes && dbProduct.base_notes.length > 0)
      ? dbProduct.base_notes
      : (richProductData?.scent_notes?.base || richProductData?.base_notes || []),
    sizes: (dbProduct?.sizes && dbProduct.sizes.length > 0)
      ? dbProduct.sizes
      : (richProductData?.sizes || [{ size: '100ml', stock: 50 }]),
    additional_images: (dbProduct?.additional_images && dbProduct.additional_images.length > 0)
      ? dbProduct.additional_images
      : (richProductData?.additional_images || []),
    hook: richProductData?.hook,
    specs: richProductData?.specs,
    key_features: richProductData?.key_features,
    fragrance_journey: richProductData?.fragrance_journey,
    perfect_for: richProductData?.perfect_for,
    faqs: richProductData?.faqs,
    cross_sells: richProductData?.cross_sells,
    upsell: richProductData?.upsell,
    amazon_bullets: richProductData?.amazon_bullets,
    emotional_points: richProductData?.emotional_points,
    objection_handling: richProductData?.objection_handling,
    seo_title: richProductData?.seo_title,
    seo_description: richProductData?.seo_description,
    shopify_keywords: richProductData?.shopify_keywords,
    image_alt: richProductData?.image_alt,
    product_tags: richProductData?.product_tags,
  };

  // Schema.org Product Rich Snippet
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [
      `https://eternyx.com${product.image_url}`,
      ...(product.additional_images || []).map((img) => `https://eternyx.com${img}`),
    ],
    description: product.description,
    sku: `ETX-${product.name.toUpperCase().replace(/\s+/g, '')}-100ML`,
    mpn: `ETX-100-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: 'ETERNYX',
    },
    offers: {
      '@type': 'Offer',
      url: `https://eternyx.com/shop/${slug}`,
      priceCurrency: 'INR',
      price: String(product.price),
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'ETERNYX',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '24',
      bestRating: '5',
      worstRating: '1',
    },
  };

  // Schema.org FAQPage Rich Snippet
  const faqSchema =
    product.faqs && product.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: product.faqs.map((f: any) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null;

  // Schema.org Breadcrumbs
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://eternyx.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://eternyx.com/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `https://eternyx.com/shop/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient product={product} richData={richProductData} />
    </>
  );
}
