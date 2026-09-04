import { NextResponse } from 'next/server';
import { reelService } from '@/services/reelService';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reels = await reelService.getAll();
    const activeReels = reels.filter(r => r.active);

    const enrichedReels = await Promise.all(activeReels.map(async (reel) => {
      const isMockThumbnail = !reel.thumbnail_url || reel.thumbnail_url.includes('images/reel-');
      if (isMockThumbnail && reel.video_url && reel.video_url.includes('instagram.com')) {
        try {
          const response = await axios.get(reel.video_url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            },
            timeout: 5000
          });
          const html = response.data;
          const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) || html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i);
          if (ogImageMatch && ogImageMatch[1]) {
            const imageUrl = ogImageMatch[1].replace(/&amp;/g, '&');
            return { ...reel, thumbnail_url: imageUrl };
          }
        } catch (e) {
          console.error(`Failed to scrape Instagram thumbnail for ${reel.video_url}:`, (e as Error).message);
        }
      }
      return reel;
    }));

    return NextResponse.json(enrichedReels);
  } catch (error) {
    console.error('Public reels fetch failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
