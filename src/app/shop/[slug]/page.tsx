import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import productsData from '@/data/products.json';
import { Product } from '@/lib/types';
import ProductDetailClient from '@/components/ProductDetailClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

function getSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
}

export async function generateStaticParams() {
  return (productsData as any[]).map((p) => ({
    slug: getSlug(p.name),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = (productsData as any[]).find(
    (p) => getSlug(p.name) === slug.toLowerCase().trim()
  );

  if (!product) {
    return {
      title: 'Fragrance Not Found | ETERNYX',
      description: 'The requested luxury fragrance could not be found.',
    };
  }

  const title = product.seo_title || `${product.name} Eau de Parfum | ETERNYX Luxury Fragrance`;
  const description = product.seo_description || product.description;
  const keywords = product.shopify_keywords || product.product_tags || [];
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
          alt: (product.image_alt && product.image_alt[0]) || `${product.name} by ETERNYX`,
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
  const productData = (productsData as any[]).find(
    (p) => getSlug(p.name) === slug.toLowerCase().trim()
  );

  if (!productData) {
    notFound();
  }

  const product: Product = {
    id: String(productData.id || productData.position || '1'),
    name: productData.name,
    category: productData.category || 'Eau de Parfum',
    price: Number(productData.price) || 599,
    description: productData.description || '',
    volume: '100ml',
    image_url: productData.image_url || '/images/hero.png',
    position: productData.position || 0,
    visible: true,
    badge: productData.badge || null,
    top_notes: productData.scent_notes?.top || productData.top_notes || [],
    heart_notes: productData.scent_notes?.mid || productData.heart_notes || [],
    base_notes: productData.scent_notes?.base || productData.base_notes || [],
    sizes: productData.sizes || [{ size: '100ml', stock: 50 }],
    additional_images: productData.additional_images || [],
    hook: productData.hook,
    specs: productData.specs,
    key_features: productData.key_features,
    fragrance_journey: productData.fragrance_journey,
    perfect_for: productData.perfect_for,
    faqs: productData.faqs,
    cross_sells: productData.cross_sells,
    upsell: productData.upsell,
    amazon_bullets: productData.amazon_bullets,
    emotional_points: productData.emotional_points,
    objection_handling: productData.objection_handling,
    seo_title: productData.seo_title,
    seo_description: productData.seo_description,
    shopify_keywords: productData.shopify_keywords,
    image_alt: productData.image_alt,
    product_tags: productData.product_tags,
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
      <ProductDetailClient product={product} richData={productData} />
    </>
  );
}
