'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>ETERNYX ADMIN</h2>
        <form onSubmit={handleLogin}>
          {error && <div className="admin-error">{error}</div>}
          <div className="admin-input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="admin-input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" disabled={loading} className="admin-btn-primary">
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>
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
          max-width: 400px;
          border-radius: 4px;
        }
        h2 {
          font-family: var(--font-serif);
          color: #d4af37;
          text-align: center;
          letter-spacing: 0.2em;
          margin-bottom: 30px;
          font-weight: 400;
        }
        .admin-input-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }
        input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 12px;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }
        input:focus {
          outline: none;
          border-color: #d4af37;
        }
        .admin-btn-primary {
          width: 100%;
          background: #d4af37;
          color: #000;
          border: none;
          padding: 14px;
          font-family: inherit;
          font-weight: 600;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: opacity 0.3s ease;
          margin-top: 10px;
        }
        .admin-btn-primary:hover {
          opacity: 0.9;
        }
        .admin-btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .admin-error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 10px;
          font-size: 0.85rem;
          border: 1px solid rgba(239, 68, 68, 0.2);
          margin-bottom: 20px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
