import React, { useState } from 'react';

export default function Contact(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState<string|null>(null);

  const endpoint = 'https://formspree.io/f/mgvnzqdp';

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true); setOk(null);
    try{
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, source: 'dealer-portal' })
      });
      if (res.ok){
        setOk('Message sent. We will get back to you shortly.');
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else {
        setOk('Failed to send. Please try again later.');
      }
    } catch {
      setOk('Failed to send. Please check your connection.');
    } finally { setSending(false); }
  }

  return (
    <div className="dealer-contact-root">
      <style>{css}</style>
      <div className="wrap card">
        <div className="head">
          <h3 className="title">Contact Admin</h3>
          <div className="hint">Send a quick message to the InvisiShield Admin team.</div>
        </div>
        <form className="form" onSubmit={onSubmit}>
          <label className="field"><span>Name*</span>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required />
          </label>
          <label className="field"><span>Email*</span>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" required />
          </label>
          <label className="field field--full"><span>Subject</span>
            <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Short summary" />
          </label>
          <label className="field field--full"><span>Message*</span>
            <textarea rows={5} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write your message" required />
          </label>
          {ok && <div className="note">{ok}</div>}
          <div className="actions">
            <button disabled={sending || !name || !email || !message} className="btn-primary" type="submit">{sending? 'Sending…':'Send Message'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const css = `
.dealer-contact-root { padding: 12px 0; }
.wrap { display: grid; gap: 12px; padding: 16px; border-radius: 16px; border: 1px solid var(--color-border); background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); max-width: 760px; margin: 0 auto; }
.head { display: grid; gap: 6px; }
.title { margin: 0; font-size: 18px; font-weight: 800; }
.hint { color: var(--color-text-dim); font-size: 12px; }
.form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: grid; gap: 6px; }
.field--full { grid-column: 1 / -1; }
.field > span { font-size: 12px; color: var(--color-text-dim); }
.form input, .form textarea { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 12px 14px; font-size: 15px; }
.form textarea { resize: vertical; }
.actions { grid-column: 1 / -1; display: flex; gap: 10px; justify-content: flex-end; }
.btn-primary { background: linear-gradient(180deg, #1a73e8, #145fbe); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px 18px; border-radius: 12px; cursor: pointer; }
.btn-primary:disabled { opacity: .6; cursor: not-allowed; }
.note { grid-column: 1 / -1; color: #bfe6ff; font-size: 12px; }
@media (max-width: 1024px){ .wrap { padding: 14px; } .form { gap: 10px; } }
@media (max-width: 900px){ .form { grid-template-columns: 1fr; } .actions { justify-content: stretch; } .btn-primary { width: 100%; } .title { font-size: 17px; } }
@media (max-width: 640px){ .wrap { padding: 12px; border-radius: 14px; } .form input, .form textarea { font-size: 16px; padding: 12px; } }
@media (max-width: 420px){ .title { font-size: 16px; } .hint { font-size: 11px; } }
`;
