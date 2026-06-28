import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { reviewService } from '@/services/reviewService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const reviews = await reviewService.getAll();
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Failed to get admin reviews:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
