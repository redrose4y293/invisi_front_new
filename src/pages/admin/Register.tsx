import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminRegister } from '@/services/adminApi';

export default function Register(){
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const set = (k: string, v: string)=> setForm(s=> ({...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault(); setError(''); setSubmitting(true);
    try{
      await adminRegister(form.name, form.email, form.password);
      setDone(true);
      setTimeout(()=> nav('/admin/login', { replace: true }), 900);
    }catch(err: any){
      const msg = err?.response?.data?.error || err?.message || 'Registration failed';
      setError(String(msg));
    }finally{ setSubmitting(false); }
  };

  return (
    <main style={{ display:'grid', placeItems:'center', minHeight:'100vh', padding:24 }}>
      <div style={{ width:'100%', maxWidth:460 }}>
        <div style={{ textAlign:'center', marginBottom:12 }}>
          <h1 style={{ margin:'0 0 4px' }}>Create account</h1>
          <p style={{ margin:0, opacity:.7 }}>Set up your admin access to manage the platform.</p>
        </div>
        <form onSubmit={onSubmit} style={{ background:'rgba(255,255,255,0.03)', padding:24, border:'1px solid #223', borderRadius:16, display:'grid', gap:12 }}>
          {error && <div style={{ color:'#FF6B6B', fontSize:12 }}>{error}</div>}
          {done && <div style={{ color:'#10B981', fontSize:12 }}>Account created. Redirecting to login…</div>}
          <label style={{ display:'grid', gap:6 }}>
            <span style={{ fontSize:12, opacity:.7 }}>Name</span>
            <input value={form.name} onChange={e=> set('name', e.target.value)} placeholder="Your full name" autoComplete="name" required style={{ padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
          </label>
          <label style={{ display:'grid', gap:6 }}>
            <span style={{ fontSize:12, opacity:.7 }}>Email</span>
            <input type="email" value={form.email} onChange={e=> set('email', e.target.value.toLowerCase().trim())} placeholder="you@company.com" autoComplete="email" required style={{ padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
          </label>
          <label style={{ display:'grid', gap:6 }}>
            <span style={{ fontSize:12, opacity:.7 }}>Password</span>
            <input type="password" value={form.password} onChange={e=> set('password', e.target.value)} placeholder="••••••" autoComplete="new-password" required style={{ padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
          </label>
          <button disabled={submitting || done} type="submit" style={{ padding:'12px 14px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, background:'linear-gradient(180deg, #1a73e8, #145fbe)', color:'white', cursor:'pointer', opacity: (submitting||done)? .7: 1 }}>{submitting? 'Creating...' : done ? 'Created' : 'Create Account'}</button>
          <div style={{ fontSize:12, opacity:.8, textAlign:'center' }}>Already have an account? <Link to="/admin/login">Log in</Link></div>
        </form>
      </div>
    </main>
  );
}
