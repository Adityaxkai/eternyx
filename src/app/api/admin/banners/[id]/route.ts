import { NextRequest, NextResponse } from 'next/server';
import { bannerService } from '@/services/bannerService';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updatedBanner = bannerService.update(id, data);
    if (!updatedBanner) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updatedBanner);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}
