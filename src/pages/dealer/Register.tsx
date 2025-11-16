import React, { useState } from 'react';
import { dealerRegister } from '@/services/dealers';

export default function Register() {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', country: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle'|'ok'|'err'>('idle');
  const [error, setError] = useState('');
  return (
    <div className="dealer-register-root">
      <style>{css}</style>
      <div className="wrap">
        <div className="intro">
          <h1 className="title">Dealer Application</h1>
          <p className="subtitle">Join our certified network. Provide your company details and we’ll get back within 1–2 business days.</p>
        </div>

        <form
          className="card form"
          onSubmit={async (e)=>{
            e.preventDefault();
            setError(''); setStatus('idle'); setLoading(true);
            try {
              const payload = { name: form.name || form.company, email: form.email, phone: form.phone, company: form.company, country: form.country, message: form.message };
              await dealerRegister(payload);
              setStatus('ok');
              setForm({ name:'', company:'', email:'', phone:'', country:'', message:'' });
            } catch (err: any) {
              setStatus('err');
              setError(err?.response?.data?.error || 'Failed to submit application');
            } finally { setLoading(false); }
          }}
        >
          <label className="field">
            <span>Contact Name*</span>
            <input
              placeholder="Your full name"
              required
              value={form.name}
              onChange={e=>setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Company*</span>
            <input
              placeholder="Your company name"
              required
              value={form.company}
              onChange={e=>setForm({ ...form, company: e.target.value })}
            />
          </label>

          <div className="grid-2">
            <label className="field">
              <span>Email*</span>
              <input
                type="email"
                placeholder="you@company.com"
                required
                value={form.email}
                onChange={e=>setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label className="field">
              <span>Phone*</span>
              <input
                placeholder="+1 (555) 000-0000"
                required
                value={form.phone}
                onChange={e=>setForm({ ...form, phone: e.target.value })}
              />
            </label>
          </div>

          <div className="grid-2">
            <label className="field">
              <span>Country (Optional)</span>
              <input
                placeholder="United States"
                value={form.country}
                onChange={e=>setForm({ ...form, country: e.target.value })}
              />
            </label>
            <div />
          </div>

          <label className="field">
            <span>Message (Optional)</span>
            <textarea
              rows={4}
              placeholder="Tell us about your business and regions you serve"
              value={form.message}
              onChange={e=>setForm({ ...form, message: e.target.value })}
            />
          </label>

          {status==='ok' && <div className="success">Thanks! Your application has been received. Our team will contact you shortly.</div>}
          {status==='err' && <div className="error">{error}</div>}

          <div className="actions">
            <button className="btn-primary" type="submit" disabled={loading}>{loading?'Submitting...':'Submit Application'}</button>
            <span className="note">We’ll contact you shortly.</span>
          </div>
        </form>
      </div>
    </div>
  );
}

const css = `
.dealer-register-root { min-height: 100vh; background: linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.12)); padding: 24px 16px; }
.wrap { max-width: 920px; margin: 0 auto; display: grid; gap: 16px; }
.intro { padding: 8px 2px; }
.title { margin: 0 0 6px; font-size: 28px; font-weight: 800; letter-spacing: .2px; }
.subtitle { margin: 0; color: var(--color-text-dim); }

.card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border: 1px solid var(--color-border); border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
.form { padding: 18px; display: grid; gap: 12px; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: grid; gap: 6px; }
.field > span { font-size: 12px; color: var(--color-text-dim); }
.field input { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 10px 12px; outline: none; }
.field input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(26,115,232,0.15); }
.field textarea { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 10px 12px; outline: none; }
.success { background: rgba(22,163,74,0.1); border: 1px solid rgba(22,163,74,0.35); color: #a7f3d0; padding: 10px 12px; border-radius: 10px; }
.error { background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.35); color: #fecaca; padding: 10px 12px; border-radius: 10px; }

.actions { display: flex; align-items: center; gap: 12px; margin-top: 6px; }
.btn-primary { background: linear-gradient(180deg, #1a73e8, #145fbe); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 18px; border-radius: 12px; cursor: pointer; transition: transform .12s ease, box-shadow .2s ease; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 26px rgba(26,115,232,.35); }
.note { color: var(--color-text-dim); font-size: 12px; }

@media (max-width: 900px) {
  .grid-2 { grid-template-columns: 1fr; }
}
`;
