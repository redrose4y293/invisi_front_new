import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { dealerLogin } from '@/services/dealers';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await dealerLogin(email, phone);
      const token = (res as any)?.data?.accessToken;
      if (!token) throw new Error('No token');
      login(token);
      const to = loc.state?.from?.pathname || '/dealer';
      nav(to, { replace: true });
    } catch (err) {
      const status = (err as any)?.response?.status;
      const msg = (err as any)?.response?.data?.error;
      if (status === 403 && msg) {
        setError(msg);
      } else {
        setError('Login failed. Check your email/phone.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dealer-login-root">
      <style>{css}</style>
      <div className="wrap">
        <div className="intro">
          <h1 className="title">Dealer Login</h1>
          <p className="subtitle">Log in using your registered email and phone number.</p>
        </div>

        <form className="card form" onSubmit={onSubmit}>
          <label className="field">
            <span>Email*</span>
            <input
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={e=>setEmail(e.target.value)}
            />
          </label>

          <label className="field">
            <span>Phone*</span>
            <input
              placeholder="+1 (555) 000-0000"
              required
              value={phone}
              onChange={e=>setPhone(e.target.value)}
            />
          </label>

          {error && <div className="error">{error}</div>}

          <div className="actions">
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
            <a className="link" href="/dealer/register">Become a Dealer</a>
          </div>
        </form>
      </div>
    </div>
  );
}

const css = `
.dealer-login-root { min-height: 100vh; background: linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.12)); padding: 24px 16px; }
.wrap { max-width: 720px; margin: 0 auto; display: grid; gap: 16px; }
.intro { padding: 8px 2px; }
.title { margin: 0 0 6px; font-size: 28px; font-weight: 800; letter-spacing: .2px; }
.subtitle { margin: 0; color: var(--color-text-dim); }

.card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border: 1px solid var(--color-border); border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
.form { padding: 18px; display: grid; gap: 12px; }
.field { display: grid; gap: 6px; }
.field > span { font-size: 12px; color: var(--color-text-dim); }
.field input { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 10px 12px; outline: none; }
.field input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(26,115,232,0.15); }

.actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 6px; }
.btn-primary { background: linear-gradient(180deg, #1a73e8, #145fbe); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 18px; border-radius: 12px; cursor: pointer; transition: transform .12s ease, box-shadow .2s ease; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 26px rgba(26,115,232,.35); }
.link { color: var(--color-primary); text-decoration: none; }
`;
