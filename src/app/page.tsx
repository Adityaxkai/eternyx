import HomeClient from '@/components/HomeClient';
import { bannerService } from '@/services/bannerService';
import { productService } from '@/services/productService';
import { reelService } from '@/services/reelService';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [banners, products, reels] = await Promise.all([
    bannerService.getAll().catch(() => []),
    productService.getAll().catch(() => []),
    reelService.getAll().catch(() => []),
  ]);

  const activeBanners = banners
    .filter(b => b.active)
    .map(b => ({
      image_url: b.image_url,
      mobile_image_url: b.mobile_image_url || b.image_url
    }));

  const visibleProducts = products
    .filter(p => p.visible)
    .map((p: any) => ({
      ...p,
      name: p.name,
      category: p.category,
      price: typeof p.price === 'number' ? `₹${p.price}` : p.price,
      image: p.image_url || '',
      badge: p.badge || null
    }));

  const activeReels = reels
    .filter(r => r.active)
    .map(r => ({
      handle: r.handle,
      likes: r.likes,
      product: r.product_tag,
      image: r.thumbnail_url || '',
      video: r.video_url || '#'
    }));

  return (
    <HomeClient
      initialBanners={activeBanners.length > 0 ? activeBanners : undefined}
      initialProducts={visibleProducts.length > 0 ? visibleProducts : undefined}
      initialReels={activeReels}
    />
  );
}
