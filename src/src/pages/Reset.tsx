import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../lib/auth';

export default function Reset(){
  const [params] = useSearchParams();
  const tokenParam = params.get('token') || '';
  const nav = useNavigate();
  const [token, setToken] = useState(tokenParam);
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(()=>{ setToken(tokenParam); }, [tokenParam]);

  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault(); setError('');
    if (!token) { setError('Invalid or missing token'); return; }
    if (pass1.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (pass1 !== pass2) { setError('Passwords do not match'); return; }
    setSubmitting(true);
    try { await resetPassword(token, pass1); setDone(true); setTimeout(()=> nav('/auth/login'), 1200); }
    catch { setError('Reset failed. Please request a new link.'); }
    finally { setSubmitting(false); }
  };

  return (
    <main style={{ display:'grid', placeItems:'center', minHeight:'100vh', padding:24 }}>
      <form onSubmit={onSubmit} style={{ background:'#0E1621', padding:24, border:'1px solid #223', borderRadius:12, width:360, display:'grid', gap:12 }}>
        <h1 style={{ margin:0, color:'var(--accent)' }}>Reset Password</h1>
        {done ? (
          <div style={{ color:'#10B981' }}>Password updated. Redirecting to login…</div>
        ) : (
          <>
            {error && <div style={{ color:'#FF6B6B', fontSize:12 }}>{error}</div>}
            <label>Token<input value={token} onChange={(e)=> setToken(e.target.value)} placeholder="Paste reset token" required/></label>
            <label>New Password<input type="password" value={pass1} onChange={(e)=> setPass1(e.target.value)} required/></label>
            <label>Confirm Password<input type="password" value={pass2} onChange={(e)=> setPass2(e.target.value)} required/></label>
            <button disabled={submitting} type="submit" style={{ padding:'10px 12px', border:'1px solid #334', borderRadius:8, background:'var(--accent)', color:'white' }}>{submitting? 'Updating…' : 'Update Password'}</button>
          </>
        )}
      </form>
    </main>
  );
}
