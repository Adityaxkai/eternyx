import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { reviewService } from '@/services/reviewService';

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
    const updated = await reviewService.update(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error(`Failed to update review ${id}:`, error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 400 });
  }
}
