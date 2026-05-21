import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const validEmail = process.env.ADMIN_EMAIL || 'admin@eternyx.com';
    const validPassword = process.env.ADMIN_PASSWORD || 'eternyx_admin';

    if (email === validEmail && password === validPassword) {
      const res = NextResponse.json({ ok: true });
      const session = await getIronSession<SessionData>(request, res, sessionOptions);
      session.isAdmin = true;
      await session.save();
      return res;
    }

    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
