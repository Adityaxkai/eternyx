import { NextRequest, NextResponse } from 'next/server';
import { reelService } from '@/services/reelService';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';

export async function GET(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reels = await reelService.getAll();
  return NextResponse.json(reels);
}

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const newReel = await reelService.create(data);
    return NextResponse.json(newReel, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reel' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  
  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { updates } = await request.json();
    if (updates && Array.isArray(updates)) {
      await reelService.reorder(updates);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 400 });
  }
}
