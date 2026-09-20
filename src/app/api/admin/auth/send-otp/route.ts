import { NextRequest, NextResponse } from 'next/server';
import { adminAuthService } from '@/services/adminAuthService';
import { otpService } from '@/services/otpService';
import { emailService } from '@/services/emailService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const profile = await adminAuthService.getProfile();

    // Security check: only registered admin email can receive reset codes
    if (cleanEmail !== profile.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email does not match the registered administrator account.' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otpResult = otpService.createOtp(cleanEmail);
    if (!otpResult.success || !otpResult.code) {
      return NextResponse.json(
        { error: otpResult.error || 'Failed to generate verification code.' },
        { status: 429 }
      );
    }

    // Send email via SMTP (Nodemailer)
    const emailResult = await emailService.sendPasswordResetOtp({
      to: cleanEmail,
      otp: otpResult.code,
      expiryMinutes: 10,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to deliver OTP email. Please verify SMTP credentials in .env.local',
          devOtp: emailResult.devOtp,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been sent to ${cleanEmail}. Check your inbox or spam folder.`,
    });
  } catch (error: any) {
    console.error('Send OTP route error:', error);
    return NextResponse.json(
      { error: 'Server error occurred while sending verification code.' },
      { status: 500 }
    );
  }
}
