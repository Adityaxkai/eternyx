import { MetadataRoute } from 'next';
import productsData from '@/data/products.json';

function getSlug(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eternyx.com';
  const currentDate = new Date();

  // Static site routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bespoke`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/alchemy`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/story`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic fragrance product routes
  const productRoutes: MetadataRoute.Sitemap = (productsData as any[]).map((product) => ({
    url: `${baseUrl}/shop/${getSlug(product.name)}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.95,
  }));

  return [...staticRoutes, ...productRoutes];
}
