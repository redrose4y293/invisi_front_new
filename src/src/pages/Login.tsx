import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../lib/auth';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string|undefined>();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    try {
      const ok = await login(email, password);
      if (!ok){ setError('Invalid credentials'); return; }
      nav('/app/dashboard', { replace: true });
    } catch (err: any) {
      const msg = err?.body?.error || err?.message || 'Login failed';
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ display:'grid', placeItems:'center', minHeight:'100vh', padding:24, background:'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.14))' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:12 }}>
          <h1 style={{ margin:'0 0 4px', color:'var(--accent)', fontSize:28, fontWeight:800 }}>Admin Login</h1>
          <p style={{ margin:0, color:'#9aa4af' }}>Sign in to manage content and dealers.</p>
        </div>
        <form onSubmit={onSubmit} style={{ background:'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', padding:24, border:'1px solid #223', borderRadius:16, display:'grid', gap:12, boxShadow:'0 10px 30px rgba(0,0,0,0.35)' }}>
          <label style={{ display:'grid', gap:6 }}>
            <span style={{ fontSize:12, color:'#9aa4af' }}>Email</span>
            <input value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="you@company.com" type="email" autoComplete="email" style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
          </label>
          <label style={{ display:'grid', gap:6 }}>
            <span style={{ fontSize:12, color:'#9aa4af' }}>Password</span>
            <input value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="••••••" type="password" autoComplete="current-password" style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
          </label>
          {error && <div style={{ color:'#FF6B6B', fontSize:12 }}>{error}</div>}
          <button disabled={loading} type="submit" style={{ padding:'12px 14px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, background:'linear-gradient(180deg, #1a73e8, #145fbe)', color:'white', opacity: loading? 0.7: 1, cursor:'pointer' }}>{loading? 'Logging in…':'Login'}</button>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'#9aa4af' }}>
            <span>New here? <Link to="/auth/register">Create account</Link></span>
            <span><Link to="/auth/forgot">Forgot password?</Link></span>
          </div>
        </form>
      </div>
    </main>
  );
}
