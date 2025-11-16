import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset } from '../lib/auth';

export default function Forgot(){
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault(); setSubmitting(true);
    try { await requestPasswordReset(email); } catch {}
    setDone(true); setSubmitting(false);
    setTimeout(()=> nav('/auth/login'), 1200);
  };
  return (
    <main style={{ display:'grid', placeItems:'center', minHeight:'100vh', padding:24, background:'linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.14))' }}>
      <div style={{ width:'100%', maxWidth:460 }}>
        <div style={{ textAlign:'center', marginBottom:12 }}>
          <h1 style={{ margin:'0 0 4px', color:'var(--accent)', fontSize:28, fontWeight:800 }}>Forgot password</h1>
          <p style={{ margin:0, color:'#9aa4af' }}>Enter your email to receive a password reset link.</p>
        </div>
        <form onSubmit={onSubmit} style={{ background:'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))', padding:24, border:'1px solid #223', borderRadius:16, display:'grid', gap:12, boxShadow:'0 10px 30px rgba(0,0,0,0.35)' }}>
          {done ? (
            <div style={{ color:'#10B981' }}>If that email exists, we sent reset instructions.</div>
          ) : (
            <label style={{ display:'grid', gap:6 }}>
              <span style={{ fontSize:12, color:'#9aa4af' }}>Email</span>
              <input type="email" value={email} onChange={(e)=> setEmail(e.target.value.toLowerCase().trim())} placeholder="you@company.com" autoComplete="email" required style={{ width:'100%', padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
            </label>
          )}
          <button disabled={submitting || done} type="submit" style={{ padding:'12px 14px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, background:'linear-gradient(180deg, #1a73e8, #145fbe)', color:'white', cursor:'pointer', opacity: (submitting||done)? .7: 1 }}>{submitting? 'Sending...' : done ? 'Sent' : 'Send reset link'}</button>
        </form>
      </div>
    </main>
  );
}
