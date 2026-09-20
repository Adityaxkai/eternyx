'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Mode: 'login' | 'forgot_otp' | 'forgot_key'
  const [mode, setMode] = useState<'login' | 'forgot_otp' | 'forgot_key'>('login');

  // OTP flow states
  const [otpStep, setOtpStep] = useState<'request' | 'verify'>('request');
  const [forgotEmail, setForgotEmail] = useState('eternyxfragrance@gmail.com');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cooldown, setCooldown] = useState(0);

  // Recovery Key flow states
  const [recoveryKey, setRecoveryKey] = useState('');
  const [keyNewPassword, setKeyNewPassword] = useState('');

  // Status & feedback
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  // Cooldown countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Invalid User ID or Password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to Admin Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotMsg('');

    try {
      const res = await fetch('/api/admin/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setForgotMsg('✓ ' + data.message);
        setOtpStep('verify');
        setCooldown(45);
      } else if (data.devOtp) {
        // SMTP not yet configured in local dev, provide dev hint
        setForgotMsg(`Notice: OTP generated: ${data.devOtp} (Configure SMTP_PASSWORD in .env.local for live email delivery)`);
        setOtpStep('verify');
        setCooldown(45);
      } else {
        setForgotError(data.error || 'Failed to send verification code.');
      }
    } catch (err) {
      setForgotError('Network error while requesting verification code.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Step 2: Verify OTP and Reset Password
  const handleVerifyOtpReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');

    if (newPassword !== confirmPassword) {
      setForgotError('New passwords do not match. Please verify both fields.');
      return;
    }

    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters long.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await fetch('/api/admin/auth/verify-otp-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: otpCode,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setForgotMsg('✓ ' + data.message);
        setIdentifier(forgotEmail);
        setPassword('');
        setTimeout(() => {
          setMode('login');
          setOtpStep('request');
          setOtpCode('');
          setNewPassword('');
          setConfirmPassword('');
          setForgotMsg('');
        }, 2500);
      } else {
        setForgotError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotError('Network error during password reset.');
    } finally {
      setForgotLoading(false);
    }
  };

  // Fallback: Reset via Emergency Recovery Key
  const handleRecoveryKeyReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotMsg('');

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotEmail,
          recoveryKey,
          newPassword: keyNewPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setForgotMsg('✓ ' + data.message);
        setIdentifier(forgotEmail);
        setPassword('');
        setTimeout(() => {
          setMode('login');
          setForgotMsg('');
          setRecoveryKey('');
          setKeyNewPassword('');
        }, 2200);
      } else {
        setForgotError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setForgotError('Network error during reset.');
    } finally {
      setForgotLoading(false);
    }
  };

  const openForgotFlow = () => {
    setMode('forgot_otp');
    setOtpStep('request');
    setForgotError('');
    setForgotMsg('');
    if (identifier.includes('@')) {
      setForgotEmail(identifier.trim());
    } else {
      setForgotEmail('eternyxfragrance@gmail.com');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>ETERNYX ADMIN</h2>

        {/* ── 1. SIGN IN FORM ── */}
        {mode === 'login' && (
          <form onSubmit={handleLogin}>
            {error && <div className="admin-error">{error}</div>}
            
            <div className="admin-input-group">
              <label>User ID or Email</label>
              <input 
                type="text" 
                value={identifier} 
                onChange={(e) => setIdentifier(e.target.value)} 
                placeholder="e.g. admin or eternyxfragrance@gmail.com"
                required 
              />
            </div>

            <div className="admin-input-group">
              <div className="label-row">
                <label>Password</label>
                <button
                  type="button"
                  onClick={openForgotFlow}
                  className="forgot-link"
                >
                  Forgot Password?
                </button>
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required 
              />
            </div>

            <button type="submit" disabled={loading} className="admin-btn-primary">
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        )}

        {/* ── 2. FORGOT PASSWORD (EMAIL OTP) ── */}
        {mode === 'forgot_otp' && (
          <div>
            <h3 className="form-subhead">Email Verification</h3>
            <p className="form-desc">
              {otpStep === 'request'
                ? 'Enter your registered administrator email to receive a 6-digit verification code.'
                : `Enter the 6-digit code sent to ${forgotEmail} to set a new password.`}
            </p>

            {forgotError && <div className="admin-error">{forgotError}</div>}
            {forgotMsg && <div className="admin-success">{forgotMsg}</div>}

            {otpStep === 'request' ? (
              <form onSubmit={handleSendOtp}>
                <div className="admin-input-group">
                  <label>Admin Email</label>
                  <input 
                    type="email" 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)} 
                    placeholder="eternyxfragrance@gmail.com"
                    required 
                  />
                  <span className="field-hint">The OTP code will only be delivered to your registered email address.</span>
                </div>

                <div className="forgot-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setForgotError('');
                      setForgotMsg('');
                    }}
                    className="cancel-btn"
                  >
                    Back to Sign In
                  </button>
                  <button type="submit" disabled={forgotLoading} className="admin-btn-primary">
                    {forgotLoading ? 'SENDING...' : 'SEND OTP'}
                  </button>
                </div>

                <div className="alternate-auth">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_key');
                      setForgotError('');
                      setForgotMsg('');
                    }}
                    className="sub-link"
                  >
                    Use Emergency Recovery Key instead
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpReset}>
                <div className="admin-input-group">
                  <div className="label-row">
                    <label>6-Digit Verification Code</label>
                    <button
                      type="button"
                      disabled={cooldown > 0 || forgotLoading}
                      onClick={() => handleSendOtp()}
                      className="resend-link"
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={otpCode} 
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    placeholder="123456"
                    maxLength={6}
                    style={{ letterSpacing: '6px', fontSize: '1.2rem', textAlign: 'center', fontFamily: 'monospace' }}
                    required 
                  />
                </div>

                <div className="admin-input-group">
                  <label>New Password (Min 6 chars)</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Create new password"
                    minLength={6}
                    required 
                  />
                </div>

                <div className="admin-input-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Repeat new password"
                    minLength={6}
                    required 
                  />
                </div>

                <div className="forgot-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpStep('request');
                      setForgotError('');
                      setForgotMsg('');
                    }}
                    className="cancel-btn"
                  >
                    Change Email
                  </button>
                  <button type="submit" disabled={forgotLoading} className="admin-btn-primary">
                    {forgotLoading ? 'RESETTING...' : 'RESET PASSWORD'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ── 3. EMERGENCY RECOVERY KEY FALLBACK ── */}
        {mode === 'forgot_key' && (
          <form onSubmit={handleRecoveryKeyReset} className="forgot-form">
            <h3 className="form-subhead">Emergency Key Recovery</h3>
            <p className="form-desc">
              Use your confidential Master Recovery Key configured in your server environment to restore access.
            </p>

            {forgotError && <div className="admin-error">{forgotError}</div>}
            {forgotMsg && <div className="admin-success">{forgotMsg}</div>}

            <div className="admin-input-group">
              <label>Admin User ID or Email</label>
              <input 
                type="text" 
                value={forgotEmail} 
                onChange={(e) => setForgotEmail(e.target.value)} 
                placeholder="eternyxfragrance@gmail.com"
                required 
              />
            </div>

            <div className="admin-input-group">
              <label>Master Recovery Key</label>
              <input 
                type="password" 
                value={recoveryKey} 
                onChange={(e) => setRecoveryKey(e.target.value)} 
                placeholder="Enter confidential recovery key"
                required 
              />
            </div>

            <div className="admin-input-group">
              <label>New Password (Min 6 chars)</label>
              <input 
                type="password" 
                value={keyNewPassword} 
                onChange={(e) => setKeyNewPassword(e.target.value)} 
                placeholder="Create new password"
                minLength={6}
                required 
              />
            </div>

            <div className="forgot-actions">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setForgotError('');
                  setForgotMsg('');
                }}
                className="cancel-btn"
              >
                Back to Sign In
              </button>
              <button type="submit" disabled={forgotLoading} className="admin-btn-primary">
                {forgotLoading ? 'RESETTING...' : 'RESET PASSWORD'}
              </button>
            </div>

            <div className="alternate-auth">
              <button
                type="button"
                onClick={() => {
                  setMode('forgot_otp');
                  setOtpStep('request');
                  setForgotError('');
                  setForgotMsg('');
                }}
                className="sub-link"
              >
                Use Email OTP verification instead
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .admin-login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          font-family: var(--font-sans);
          padding: 20px;
        }
        .admin-login-box {
          background: #111;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 40px;
          width: 100%;
          max-width: 440px;
          border-radius: 4px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
        }
        h2 {
          font-family: var(--font-serif);
          color: #d4af37;
          text-align: center;
          letter-spacing: 0.2em;
          margin-bottom: 24px;
          font-weight: 400;
          font-size: 1.4rem;
        }
        .form-subhead {
          font-size: 1.05rem;
          color: #fff;
          font-weight: 500;
          margin: 0 0 6px 0;
          text-align: center;
        }
        .form-desc {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.5);
          text-align: center;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .admin-input-group {
          margin-bottom: 18px;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        label {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        .label-row label {
          margin-bottom: 0;
        }
        .forgot-link {
          background: none;
          border: none;
          color: #d4af37;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.2s;
        }
        .forgot-link:hover {
          opacity: 0.8;
          text-decoration: underline;
        }
        .resend-link {
          background: none;
          border: none;
          color: #d4af37;
          font-size: 0.75rem;
          cursor: pointer;
          padding: 0;
          transition: opacity 0.2s;
        }
        .resend-link:disabled {
          color: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
        }
        input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          color: #fff;
          border-radius: 2px;
          box-sizing: border-box;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #d4af37;
        }
        .field-hint {
          display: block;
          margin-top: 6px;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.4;
        }
        .admin-btn-primary {
          width: 100%;
          background: #d4af37;
          color: #000;
          border: none;
          padding: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: opacity 0.2s;
        }
        .admin-btn-primary:hover:not(:disabled) {
          opacity: 0.9;
        }
        .admin-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .admin-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #ef4444;
          padding: 10px;
          font-size: 0.8rem;
          margin-bottom: 20px;
          border-radius: 2px;
          text-align: center;
        }
        .admin-success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #22c55e;
          padding: 10px;
          font-size: 0.8rem;
          margin-bottom: 20px;
          border-radius: 2px;
          text-align: center;
        }
        .forgot-actions {
          display: flex;
          gap: 10px;
          margin-top: 14px;
        }
        .cancel-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 2px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .alternate-auth {
          margin-top: 20px;
          text-align: center;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }
        .sub-link {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.75rem;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.2s;
        }
        .sub-link:hover {
          color: #d4af37;
        }
      `}</style>
    </div>
  );
}
