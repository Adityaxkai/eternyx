import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { adminAuthService } from '@/services/adminAuthService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);

  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const profile = await adminAuthService.getProfile();
    return NextResponse.json({
      userId: profile.userId,
      email: profile.email,
      recoveryKey: profile.recoveryKey,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admin profile' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const session = await getIronSession<SessionData>(request, res, sessionOptions);

  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { currentPassword, newUserId, newEmail, newPassword } = await request.json();

    if (!currentPassword) {
      return NextResponse.json({ error: 'Current password is required to save changes' }, { status: 400 });
    }

    const result = await adminAuthService.updateProfile(currentPassword, {
      userId: newUserId,
      email: newEmail,
      newPassword,
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Admin credentials updated successfully' });
    } else {
      return NextResponse.json({ error: result.error || 'Failed to update credentials' }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
