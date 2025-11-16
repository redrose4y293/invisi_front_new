import React, { useEffect, useMemo, useState } from 'react';
import { uploadDealerFileJSON, getDealerUploads } from '@/services/dealers';

type Row = { name: string; type: string; date: string; status: 'Pending'|'Approved'|'Rejected' };

export default function Uploads() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Testing Report'|'Marketing'|'Certification'>('Testing Report');
  const [files, setFiles] = useState<File[]>([]);
  const [desc, setDesc] = useState('');
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState<Row[]>([]);
  const disabled = useMemo(()=> !name, [name]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDealerUploads();
        const items = (res as any)?.data?.items || [];
        const rows: Row[] = items.map((x: any) => ({ name: x.name, type: x.category, date: new Date(x.createdAt).toLocaleDateString(), status: x.status || 'Pending' }));
        setHistory(rows);
      } catch {}
    })();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    // JSON intake per backend; files are not transmitted in this simplified flow

    // mock progress
    setProgress(10);
    const t1 = setTimeout(()=> setProgress(45), 400);
    const t2 = setTimeout(()=> setProgress(80), 900);
    try {
      await uploadDealerFileJSON({ name, category, description: desc });
      setProgress(100);
      const row: Row = { name, type: category, date: new Date().toLocaleDateString(), status: 'Pending' };
      setHistory(h=> [row, ...h]);
      // reset
      setName(''); setCategory('Testing Report'); setFiles([]); setDesc('');
    } finally {
      setTimeout(()=> setProgress(0), 1200);
      clearTimeout(t1); clearTimeout(t2);
    }
  }

  return (
    <div className="dealer-uploads-root">
      <style>{css}</style>
      <div className="grid">
        <div className="card panel">
          <h3 className="title">File Submission</h3>
          <form className="form" onSubmit={onSubmit}>
            <label className="field"><span>File name*</span>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Q4 Testing Report" required />
            </label>
            <label className="field"><span>Category*</span>
              <select value={category} onChange={e=>setCategory(e.target.value as any)}>
                <option>Testing Report</option>
                <option>Marketing</option>
                <option>Certification</option>
              </select>
            </label>
            <label className="field field--full"><span>Files*</span>
              <input type="file" multiple onChange={e=> setFiles(Array.from(e.target.files||[]))} />
            </label>
            <label className="field field--full"><span>Description (optional)</span>
              <textarea rows={4} value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Notes for the admin reviewer" />
            </label>

            {progress>0 && (
              <div className="progress"><div className="bar" style={{ width: `${progress}%` }} /></div>
            )}

            <div className="actions">
              <button className="btn-primary" disabled={disabled} type="submit">Submit</button>
              <span className="note">Pending review after upload.</span>
            </div>
          </form>
        </div>

        <div className="card panel">
          <h3 className="title">Upload History</h3>
          {history.length === 0 ? (
            <div className="empty">No uploads yet.</div>
          ): (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr><th>File Name</th><th>Type</th><th>Date</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {history.map((r,i)=> (
                    <tr key={i}>
                      <td>{r.name}</td>
                      <td>{r.type}</td>
                      <td>{r.date}</td>
                      <td><span className={`status ${r.status==='Approved'?'status--approved': r.status==='Rejected'?'status--rejected':'status--pending'}`}>{r.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const css = `
.dealer-uploads-root { padding: 12px 16px; }
.grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; }
.card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border: 1px solid var(--color-border); border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
.panel { padding: 16px; }
.title { margin: 0 0 10px; }
.form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: grid; gap: 6px; }
.field--full { grid-column: 1 / -1; }
.field > span { font-size: 12px; color: var(--color-text-dim); }
.form input, .form select, .form textarea { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 10px 12px; }
.form input:focus, .form select:focus, .form textarea:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(26,115,232,0.15); outline: none; }
.progress { height: 10px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; grid-column: 1 / -1; }
.bar { height: 100%; background: linear-gradient(90deg, #1a73e8, #145fbe); }
.actions { grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.btn-primary { background: linear-gradient(180deg, #1a73e8, #145fbe); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 18px; border-radius: 12px; cursor: pointer; }
.btn-primary:disabled { opacity: .55; cursor: not-allowed; }
.note { color: var(--color-text-dim); font-size: 12px; }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--color-border); }
.status { padding: 4px 8px; border-radius: 999px; background: rgba(255,255,255,0.06); font-size: 12px; }
.status--approved { background: rgba(46, 204, 113, 0.18); color: #bff0cf; border: 1px solid rgba(46, 204, 113, 0.35); }
.status--pending { background: rgba(255, 195, 0, 0.18); color: #ffe8a6; border: 1px solid rgba(255,195,0,0.35); }
.status--rejected { background: rgba(231, 76, 60, 0.18); color: #ffd0cb; border: 1px solid rgba(231,76,60,0.35); }

@media (max-width: 900px) { 
  .grid { grid-template-columns: 1fr; }
  .form { grid-template-columns: 1fr; }
  .btn-primary { width: 100%; }
}
@media (max-width: 640px) {
  .panel { padding: 14px; }
  .table th, .table td { padding: 10px; }
}
`;
