import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '@/services/adminApi';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|undefined>();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e: React.FormEvent){
    e.preventDefault(); setError(undefined); setLoading(true);
    try {
      const ok = await adminLogin(email, password);
      if (!ok) { setError('Invalid credentials'); return; }
      nav('/admin', { replace: true });
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Login failed';
      setError(String(msg));
    } finally { setLoading(false); }
  }

  return (
    <main style={{ display:'grid', placeItems:'center', minHeight:'100vh', padding:24 }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:12 }}>
          <h1 style={{ margin:'0 0 4px' }}>Admin Login</h1>
          <p style={{ margin:0, opacity:.7 }}>Sign in to manage content and dealers.</p>
        </div>
        <form onSubmit={onSubmit} style={{ background:'rgba(255,255,255,0.03)', padding:24, border:'1px solid #223', borderRadius:16, display:'grid', gap:12 }}>
          <label style={{ display:'grid', gap:6 }}>
            <span style={{ fontSize:12, opacity:.7 }}>Email</span>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" type="email" autoComplete="email" style={{ padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
          </label>
          <label style={{ display:'grid', gap:6 }}>
            <span style={{ fontSize:12, opacity:.7 }}>Password</span>
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" type="password" autoComplete="current-password" style={{ padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
          </label>
          {error && <div style={{ color:'#FF6B6B', fontSize:12 }}>{error}</div>}
          <button disabled={loading} type="submit" style={{ padding:'12px 14px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, background:'linear-gradient(180deg, #1a73e8, #145fbe)', color:'white', opacity: loading? .7: 1 }}>{loading? 'Logging in…':'Login'}</button>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, opacity:.8 }}>
            <span>New here? <Link to="/admin/register">Create account</Link></span>
          </div>
        </form>
      </div>
    </main>
  );
}
