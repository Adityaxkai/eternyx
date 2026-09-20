import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/services/adminAuthService';

export const dynamic = 'force-dynamic';

// Simple in-memory rate-limiter for password recovery attempts (max 5 failed attempts per 15 minutes per IP)
const attemptsMap = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    const now = Date.now();
    const entry = attemptsMap.get(ip);

    if (entry && now < entry.resetTime && entry.count >= 5) {
      const waitMinutes = Math.ceil((entry.resetTime - now) / 60000);
      return NextResponse.json(
        { error: `Too many failed recovery attempts. Please try again in ${waitMinutes} minute(s).` },
        { status: 429 }
      );
    }

    const { identifier, recoveryKey, newPassword } = await request.json();

    if (!identifier || !recoveryKey || !newPassword) {
      return NextResponse.json(
        { error: 'Identifier (User ID or Email), Recovery Key, and New Password are required' },
        { status: 400 }
      );
    }

    const result = await adminAuthService.resetPasswordWithRecoveryKey(
      identifier,
      recoveryKey,
      newPassword
    );

    if (result.success) {
      // Clear failed attempts on success
      attemptsMap.delete(ip);
      return NextResponse.json({
        success: true,
        message: 'Password has been successfully reset. You can now sign in with your new password.',
      });
    } else {
      // Track failed attempt
      const currentAttempts = (entry && now < entry.resetTime) ? entry.count + 1 : 1;
      attemptsMap.set(ip, {
        count: currentAttempts,
        resetTime: (entry && now < entry.resetTime) ? entry.resetTime : now + 15 * 60 * 1000,
      });

      return NextResponse.json({ error: result.error || 'Password reset failed' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Forgot password API error:', error);
    return NextResponse.json({ error: 'Server error during password reset' }, { status: 500 });
  }
}
