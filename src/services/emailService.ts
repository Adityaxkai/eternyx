import nodemailer from 'nodemailer';

interface SendOtpOptions {
  to: string;
  otp: string;
  expiryMinutes?: number;
}

export const emailService = {
  /**
   * Check if SMTP credentials are configured
   */
  isConfigured: (): boolean => {
    const pass = process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD;
    return Boolean(pass && pass.trim().length > 0);
  },

  /**
   * Send Password Reset OTP Email
   */
  sendPasswordResetOtp: async ({
    to,
    otp,
    expiryMinutes = 10,
  }: SendOtpOptions): Promise<{ success: boolean; error?: string; devOtp?: string }> => {
    const user = process.env.SMTP_EMAIL || process.env.ADMIN_EMAIL || 'eternyxfragrance@gmail.com';
    const pass = (process.env.SMTP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');

    // If SMTP password is not yet configured, log OTP to console for developer convenience
    if (!pass) {
      console.warn('====================================================');
      console.warn('⚠️  [EMAIL SERVICE NOTICE] SMTP_PASSWORD NOT SET in .env.local');
      console.warn(`📩  Target Email: ${to}`);
      console.warn(`🔑  TEMPORARY DEV OTP CODE: ${otp}`);
      console.warn('👉  To deliver real emails, add your 16-character Google App Password');
      console.warn('    to .env.local as: SMTP_PASSWORD=xxxx xxxx xxxx xxxx');
      console.warn('====================================================');

      return {
        success: false,
        error: 'SMTP_PASSWORD is not configured in .env.local. Please configure your Google App Password to send live emails.',
        devOtp: process.env.NODE_ENV !== 'production' ? otp : undefined,
      };
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user,
          pass,
        },
      });

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0b; color: #e5e5e5; margin: 0; padding: 0; }
            .container { max-width: 540px; margin: 40px auto; background: #141414; border: 1px solid #2a2a2a; border-radius: 8px; overflow: hidden; }
            .header { padding: 32px 24px; text-align: center; border-bottom: 1px solid #222; background: #0e0e0e; }
            .logo { font-size: 20px; font-weight: 700; letter-spacing: 4px; color: #d4af37; text-transform: uppercase; }
            .body { padding: 36px 28px; }
            .title { font-size: 20px; font-weight: 600; color: #ffffff; margin-bottom: 14px; }
            .text { font-size: 14px; line-height: 1.6; color: #a3a3a3; margin-bottom: 24px; }
            .otp-box { background: #1c1c1c; border: 1px solid #d4af37; border-radius: 6px; padding: 20px; text-align: center; margin: 28px 0; }
            .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 700; letter-spacing: 8px; color: #d4af37; }
            .warning { font-size: 12px; color: #737373; line-height: 1.5; border-top: 1px solid #222; padding-top: 20px; margin-top: 24px; }
            .footer { padding: 20px; text-align: center; font-size: 11px; color: #525252; background: #0e0e0e; border-top: 1px solid #1a1a1a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">ETERNYX</div>
            </div>
            <div class="body">
              <div class="title">Admin Password Reset</div>
              <p class="text">
                We received a request to reset the administrator password for your Eternyx account.
                Please use the verification code below to authorize your password change:
              </p>
              
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              
              <p class="text">
                This verification code will expire in <strong>${expiryMinutes} minutes</strong>.
              </p>
              
              <div class="warning">
                If you did not initiate this request, your account is still secure. You can safely ignore this email.
                Never share this code with anyone.
              </div>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Eternyx Luxury Fragrances. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: `"ETERNYX Security" <${user}>`,
        to,
        subject: `Your Eternyx Admin Password Reset Code: ${otp}`,
        text: `Your Eternyx Admin Password Reset OTP is: ${otp}. It will expire in ${expiryMinutes} minutes. If you did not request this, please ignore.`,
        html: htmlContent,
      });

      return { success: true };
    } catch (err: any) {
      console.error('Failed to send OTP email:', err);
      return { success: false, error: err.message || 'Failed to dispatch email' };
    }
  },
};
