import { NextResponse } from 'next/server';
import { readJSON } from '@/lib/dataStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = readJSON<any[]>('journal.json');
    // Return only Published articles to the public
    const publishedPosts = posts.filter((p) => p.status === 'Published');
    return NextResponse.json(publishedPosts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch journal feed' }, { status: 400 });
  }
}
