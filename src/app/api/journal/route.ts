import { NextResponse } from 'next/server';
import { journalService } from '@/services/journalService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const publishedPosts = await journalService.getAll(false);
    return NextResponse.json(publishedPosts);
  } catch (error) {
    console.error('Failed to fetch public journal feed:', error);
    return NextResponse.json({ error: 'Failed to fetch journal feed' }, { status: 400 });
  }
}
