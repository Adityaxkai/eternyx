import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { readJSON, writeJSON } from '@/lib/dataStore';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const reviews = readJSON<any[]>('reviews.json');
    
    const index = reviews.findIndex((r) => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    if (body.status) {
      reviews[index].status = body.status;
    }

    writeJSON('reviews.json', reviews);
    return NextResponse.json(reviews[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 400 });
  }
}
