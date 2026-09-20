import { settingsService } from './settingsService';

export interface AdminProfile {
  userId: string;
  email: string;
  passwordHash: string; // Plain/stored password
  recoveryKey: string;
  updatedAt?: string;
}

const DEFAULT_PROFILE: AdminProfile = {
  userId: 'admin',
  email: process.env.ADMIN_EMAIL || 'eternyxfragrance@gmail.com',
  passwordHash: process.env.ADMIN_PASSWORD || 'eternyx_admin',
  recoveryKey: process.env.ADMIN_RECOVERY_KEY || 'ETX-SECURE-92F1-X7K4-2026',
};

export const adminAuthService = {
  // Get active admin credentials
  getProfile: async (): Promise<AdminProfile> => {
    try {
      const stored = await settingsService.get<AdminProfile | null>('admin_profile', null);
      if (stored && stored.passwordHash) {
        return stored;
      }
      return DEFAULT_PROFILE;
    } catch (err) {
      console.error('Failed to get admin profile:', err);
      return DEFAULT_PROFILE;
    }
  },

  // Verify credentials on login (supports User ID OR Email)
  verifyLogin: async (identifier: string, password: string): Promise<boolean> => {
    try {
      const profile = await adminAuthService.getProfile();
      const cleanIdent = (identifier || '').trim().toLowerCase();
      const matchIdent =
        cleanIdent === profile.userId.toLowerCase() ||
        cleanIdent === profile.email.toLowerCase();

      const matchPassword = password === profile.passwordHash;
      return Boolean(matchIdent && matchPassword);
    } catch (err) {
      console.error('Verify login error:', err);
      return false;
    }
  },

  // Update Admin Profile (User ID, Email, Password) with current password verification
  updateProfile: async (
    currentPassword: string,
    updates: { userId?: string; email?: string; newPassword?: string; newRecoveryKey?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const profile = await adminAuthService.getProfile();

      if (currentPassword !== profile.passwordHash) {
        return { success: false, error: 'Current password does not match.' };
      }

      const updatedProfile: AdminProfile = {
        userId: updates.userId?.trim() || profile.userId,
        email: updates.email?.trim().toLowerCase() || profile.email,
        passwordHash: updates.newPassword?.trim() ? updates.newPassword.trim() : profile.passwordHash,
        recoveryKey: updates.newRecoveryKey?.trim() || profile.recoveryKey,
        updatedAt: new Date().toISOString(),
      };

      await settingsService.set('admin_profile', updatedProfile);
      return { success: true };
    } catch (err: any) {
      console.error('Update admin profile error:', err);
      return { success: false, error: err.message || 'Failed to update credentials' };
    }
  },

  // Forgot password reset via recovery key
  resetPasswordWithRecoveryKey: async (
    identifier: string,
    recoveryKey: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const profile = await adminAuthService.getProfile();
      const cleanIdent = (identifier || '').trim().toLowerCase();
      const cleanKey = (recoveryKey || '').trim().toUpperCase();

      const matchIdent =
        cleanIdent === profile.userId.toLowerCase() ||
        cleanIdent === profile.email.toLowerCase();

      const matchKey = cleanKey === profile.recoveryKey.toUpperCase();

      if (!matchIdent || !matchKey) {
        return {
          success: false,
          error: 'Invalid User ID / Email or Recovery Key. Please check your credentials.',
        };
      }

      if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters.' };
      }

      const updatedProfile: AdminProfile = {
        ...profile,
        passwordHash: newPassword.trim(),
        updatedAt: new Date().toISOString(),
      };

      await settingsService.set('admin_profile', updatedProfile);
      return { success: true };
    } catch (err: any) {
      console.error('Reset password error:', err);
      return { success: false, error: err.message || 'Failed to reset password' };
    }
  },

  // Reset password directly after email OTP verification
  resetPasswordWithVerifiedEmail: async (
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const profile = await adminAuthService.getProfile();
      const cleanEmail = (email || '').trim().toLowerCase();

      if (cleanEmail !== profile.email.toLowerCase()) {
        return {
          success: false,
          error: 'Email address does not match admin records.',
        };
      }

      if (!newPassword || newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters.' };
      }

      const updatedProfile: AdminProfile = {
        ...profile,
        passwordHash: newPassword.trim(),
        updatedAt: new Date().toISOString(),
      };

      await settingsService.set('admin_profile', updatedProfile);
      return { success: true };
    } catch (err: any) {
      console.error('Reset password with email error:', err);
      return { success: false, error: err.message || 'Failed to update password' };
    }
  },
};
