'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotIdent, setForgotIdent] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotMsg('');

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: forgotIdent,
          recoveryKey,
          newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setForgotMsg('✓ ' + data.message);
        setIdentifier(forgotIdent);
        setPassword('');
        setTimeout(() => {
          setShowForgot(false);
          setForgotMsg('');
        }, 2200);
      } else {
        setForgotError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setForgotError('Network error during reset.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>ETERNYX ADMIN</h2>

        {!showForgot ? (
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
                  onClick={() => {
                    setShowForgot(true);
                    setForgotIdent(identifier);
                    setError('');
                  }}
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
        ) : (
          <form onSubmit={handleResetPassword} className="forgot-form">
            <h3 className="form-subhead">Password Recovery</h3>
            <p className="form-desc">
              Enter your Admin Email or User ID along with your private Recovery Key to set a new password.
            </p>

            {forgotError && <div className="admin-error">{forgotError}</div>}
            {forgotMsg && <div className="admin-success">{forgotMsg}</div>}

            <div className="admin-input-group">
              <label>User ID or Email</label>
              <input 
                type="text" 
                value={forgotIdent} 
                onChange={(e) => setForgotIdent(e.target.value)} 
                placeholder="eternyxfragrance@gmail.com"
                required 
              />
            </div>

            <div className="admin-input-group">
              <label>Admin Recovery Key</label>
              <input 
                type="password" 
                value={recoveryKey} 
                onChange={(e) => setRecoveryKey(e.target.value)} 
                placeholder="Enter confidential recovery key"
                required 
              />
              <span className="field-hint">Confidential key configured in your server environment.</span>
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

            <div className="forgot-actions">
              <button
                type="button"
                onClick={() => {
                  setShowForgot(false);
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
          max-width: 420px;
          border-radius: 4px;
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
          font-size: 1rem;
          color: #fff;
          font-weight: 400;
          margin: 0 0 6px 0;
          text-align: center;
        }
        .form-desc {
          font-size: 0.78rem;
          color: rgba(255, 255, 255, 0.45);
          text-align: center;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .admin-input-group {
          margin-bottom: 20px;
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
        input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px;
          color: #fff;
          border-radius: 2px;
          box-sizing: border-box;
          font-size: 0.9rem;
        }
        input:focus {
          outline: none;
          border-color: #d4af37;
        }
        .field-hint {
          display: block;
          margin-top: 6px;
          font-size: 0.72rem;
          color: rgba(212, 175, 55, 0.6);
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
          margin-top: 10px;
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
        }
        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
