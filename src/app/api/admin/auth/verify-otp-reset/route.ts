import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/services/adminAuthService';
import { otpService } from '@/services/otpService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, 6-digit OTP, and new password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = (otp || '').toString().trim();

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Verify OTP
    const verifyResult = otpService.verifyOtp(cleanEmail, cleanOtp);
    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.error || 'Invalid or expired verification code.' },
        { status: 400 }
      );
    }

    // Reset password in storage
    const resetResult = await adminAuthService.resetPasswordWithVerifiedEmail(
      cleanEmail,
      newPassword
    );

    if (!resetResult.success) {
      return NextResponse.json(
        { error: resetResult.error || 'Failed to update password.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successful! You can now sign in with your new password.',
    });
  } catch (error: any) {
    console.error('Verify OTP reset error:', error);
    return NextResponse.json(
      { error: 'Server error occurred during password reset.' },
      { status: 500 }
    );
  }
}
