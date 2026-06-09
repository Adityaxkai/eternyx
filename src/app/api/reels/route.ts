import { NextResponse } from 'next/server';
import { reelService } from '@/services/reelService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reels = await reelService.getAll();
    // Filter to show only active reels on the homepage
    const activeReels = reels.filter(r => r.active);
    return NextResponse.json(activeReels);
  } catch (error) {
    console.error('Public reels fetch failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
