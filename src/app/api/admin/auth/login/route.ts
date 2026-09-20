import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { adminAuthService } from '@/services/adminAuthService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identifier = body.identifier || body.email || body.username || body.userId;
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json({ message: 'User ID and Password are required' }, { status: 400 });
    }

    const isValid = await adminAuthService.verifyLogin(identifier, password);

    if (isValid) {
      const res = NextResponse.json({ ok: true });
      const session = await getIronSession<SessionData>(request, res, sessionOptions);
      session.isAdmin = true;
      await session.save();
      return res;
    }

    return NextResponse.json({ message: 'Invalid User ID or Password' }, { status: 401 });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
