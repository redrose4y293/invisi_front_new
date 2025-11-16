import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { adminLogin, adminMe } from '@/services/adminApi';
import { dealerLogin } from '@/services/dealers';
import { useAuth } from '@/hooks/useAuth';

export default function Login(){
  const nav = useNavigate();
  const loc = useLocation() as any;
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState(''); // password for admin OR phone for dealer
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    setError('');
    try{
      setLoading(true);
      // Try admin first (email + password)
      try {
        await adminLogin(email, secret);
        const me = await adminMe();
        const roles: string[] = (me?.roles)||[];
        const isAdmin = roles.includes('admin');
        const isDealer = roles.includes('dealer');
        const to = loc.state?.from?.pathname;
        if (to) { nav(to, { replace:true }); return; }
        if (isAdmin) { nav('/admin', { replace:true }); return; }
        if (isDealer) { nav('/dealer', { replace:true }); return; }
        nav('/', { replace:true });
        return;
      } catch (adminErr:any) {
        // If admin login fails, try dealer (email + phone)
        try {
          const res = await dealerLogin(email, secret);
          const token = (res as any)?.data?.accessToken;
          if (!token) throw new Error('Invalid credentials');
          authLogin(token);
          nav('/dealer', { replace:true });
          return;
        } catch (dealerErr:any) {
          const adminMsg = adminErr?.response?.data?.error;
          const dealerMsg = dealerErr?.response?.data?.error;
          setError(dealerMsg || adminMsg || 'Invalid credentials');
        }
      }
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="dealer-login-root">
      <style>{css}</style>
      <div className="wrap">
        <div className="intro">
          <h1 className="title">Login</h1>
          <p className="subtitle">Use your email and password to access your dashboard.</p>
        </div>
        <form className="card form" onSubmit={onSubmit}>
          <label className="field">
            <span>Email*</span>
            <input type="email" required placeholder="you@company.com" value={email} onChange={e=>setEmail(e.target.value)} />
          </label>
          <label className="field">
            <span>Password or Phone*</span>
            <input required placeholder="Enter password (admin) or phone (dealer)" value={secret} onChange={e=>setSecret(e.target.value)} />
          </label>
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
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
/* unified form, no tabs */
.field { display: grid; gap: 6px; }
.field > span { font-size: 12px; color: var(--color-text-dim); }
.field input { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 10px 12px; outline: none; }
.field input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(26,115,232,0.15); }

.error { color: #ff6b6b; font-size: 13px; }

.actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 6px; }
.btn-primary { background: linear-gradient(180deg, #1a73e8, #145fbe); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 18px; border-radius: 12px; cursor: pointer; transition: transform .12s ease, box-shadow .2s ease; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 26px rgba(26,115,232,.35); }
`;
