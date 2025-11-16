import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAdminUser } from '@/services/adminApi';

export default function NewAdmin(){
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const set = (k: string, v: string)=> setForm(s=> ({...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent)=>{
    e.preventDefault(); setError(''); setSubmitting(true);
    try{
      await createAdminUser(form.name, form.email, form.password);
      setDone(true);
      setTimeout(()=> nav('/admin', { replace: true }), 1000);
    }catch(err: any){
      const msg = err?.response?.data?.error || err?.message || 'Failed to create admin';
      setError(String(msg));
    }finally{ setSubmitting(false); }
  };

  return (
    <main style={{ maxWidth:520 }}>
      <h2 style={{ marginTop:0 }}>Register a new admin</h2>
      <form onSubmit={onSubmit} style={{ background:'#0B1117', padding:16, border:'1px solid #223', borderRadius:12, display:'grid', gap:12 }}>
        {error && <div style={{ color:'#FF6B6B', fontSize:12 }}>{error}</div>}
        {done && <div style={{ color:'#10B981', fontSize:12 }}>Admin created successfully.</div>}
        <label style={{ display:'grid', gap:6 }}>
          <span style={{ fontSize:12, opacity:.7 }}>Name</span>
          <input value={form.name} onChange={e=> set('name', e.target.value)} placeholder="Full name" autoComplete="name" required style={{ padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
        </label>
        <label style={{ display:'grid', gap:6 }}>
          <span style={{ fontSize:12, opacity:.7 }}>Email</span>
          <input type="email" value={form.email} onChange={e=> set('email', e.target.value.toLowerCase().trim())} placeholder="admin@company.com" autoComplete="email" required style={{ padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
        </label>
        <label style={{ display:'grid', gap:6 }}>
          <span style={{ fontSize:12, opacity:.7 }}>Temporary password</span>
          <input type="password" value={form.password} onChange={e=> set('password', e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" required style={{ padding:12, borderRadius:10, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6', outline:'none' }} />
        </label>
        <button disabled={submitting || done} type="submit" style={{ padding:'12px 14px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, background:'linear-gradient(180deg, #1a73e8, #145fbe)', color:'white', cursor:'pointer', opacity: (submitting||done)? .7: 1 }}>
          {submitting? 'Creating...' : done ? 'Created' : 'Create Admin'}
        </button>
      </form>
    </main>
  );
}
