import { NextResponse } from 'next/server';
import { bannerService } from '@/services/bannerService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const banners = await bannerService.getAll();
    // Filter to show only active banners on the homepage
    const activeBanners = banners.filter(b => b.active);
    return NextResponse.json(activeBanners);
  } catch (error) {
    console.error('Public banners fetch failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
