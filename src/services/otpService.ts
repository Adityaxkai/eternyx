import { randomInt } from 'crypto';

interface StoredOtp {
  code: string;
  expiresAt: number;
  attempts: number;
  lastRequestedAt: number;
}

// In-memory store for active OTP codes
const otpStore = new Map<string, StoredOtp>();

export const otpService = {
  /**
   * Generates a 6-digit cryptographic OTP code
   */
  createOtp: (
    identifier: string
  ): { success: boolean; code?: string; error?: string; retryAfterSeconds?: number } => {
    const key = identifier.trim().toLowerCase();
    const existing = otpStore.get(key);
    const now = Date.now();

    // Rate limiting: 45 seconds cooldown between new OTP generation
    if (existing && now - existing.lastRequestedAt < 45 * 1000) {
      const waitSec = Math.ceil((45 * 1000 - (now - existing.lastRequestedAt)) / 1000);
      return {
        success: false,
        error: `Please wait ${waitSec} second(s) before requesting another code.`,
        retryAfterSeconds: waitSec,
      };
    }

    // Generate secure 6-digit numeric OTP
    const code = randomInt(100000, 999999).toString();
    const expiresAt = now + 10 * 60 * 1000; // 10 minutes expiry

    otpStore.set(key, {
      code,
      expiresAt,
      attempts: 0,
      lastRequestedAt: now,
    });

    return { success: true, code };
  },

  /**
   * Verifies an OTP code for a given identifier (email or userId)
   */
  verifyOtp: (
    identifier: string,
    inputCode: string
  ): { success: boolean; error?: string } => {
    const key = identifier.trim().toLowerCase();
    const stored = otpStore.get(key);
    const now = Date.now();

    if (!stored) {
      return {
        success: false,
        error: 'No active verification code found. Please request a new code.',
      };
    }

    if (now > stored.expiresAt) {
      otpStore.delete(key);
      return {
        success: false,
        error: 'The verification code has expired. Please request a new code.',
      };
    }

    if (stored.attempts >= 5) {
      otpStore.delete(key);
      return {
        success: false,
        error: 'Too many incorrect attempts. For security, this code has been invalidated. Please request a new code.',
      };
    }

    if (stored.code !== inputCode.trim()) {
      stored.attempts += 1;
      const remaining = 5 - stored.attempts;
      return {
        success: false,
        error: `Incorrect verification code. ${remaining} attempt(s) remaining.`,
      };
    }

    // Successfully verified: remove from store
    otpStore.delete(key);
    return { success: true };
  },

  /**
   * Clear an OTP
   */
  clearOtp: (identifier: string) => {
    otpStore.delete(identifier.trim().toLowerCase());
  },
};
