import React, { useEffect, useMemo, useState } from 'react';
import { getDealerUploads, getDealerFiles, getTrainingEvents } from '../../services/dealers';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState<Array<{ id:string; name:string; category:string; description?:string; status:string; createdAt:string }>>([]);
  const [filesCount, setFilesCount] = useState(0);
  const [nextTraining, setNextTraining] = useState<string>('—');

  useEffect(()=>{
    const load = async ()=>{
      setLoading(true);
      try {
        // recent uploads
        const up = await getDealerUploads();
        const items = (up as any)?.data?.items || (up as any)?.items || [];
        setUploads(items.slice(0, 5));
      } catch {}
      try {
        // files available (dealer + public)
        const files = await getDealerFiles({ type: 'all' });
        const items = (files as any)?.data?.items || (files as any)?.items || [];
        setFilesCount(Array.isArray(items) ? items.length : 0);
      } catch {}
      try {
        // training
        const tr = await getTrainingEvents();
        const upcoming = (tr as any)?.data?.upcoming || (tr as any)?.upcoming || [];
        if (Array.isArray(upcoming) && upcoming.length){
          const dt = new Date(upcoming[0].datetime);
          setNextTraining(dt.toLocaleDateString());
        } else {
          setNextTraining('—');
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const stats = useMemo(()=>[
    { label: 'Uploads', value: String(uploads.length) },
    { label: 'Next Training', value: nextTraining },
    { label: 'Downloads', value: String(filesCount) },
  ], [uploads.length, nextTraining, filesCount]);

  return (
    <div className="dealer-dash-root">
      <style>{css}</style>
      <div className="wrap">
        <div className="hero">
          <div className="hero-left">
            <h1 className="title">Welcome back, Dealer</h1>
            <p className="subtitle">Here’s a quick overview of your activity and shortcuts to get things done.</p>
          </div>
          <div className="hero-right">
            <a className="btn-primary" href="#uploads" onClick={(e)=>{ e.preventDefault(); const el=document.querySelector('#uploads') as HTMLElement|null; if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); history.replaceState(null,'','#uploads'); }}>Upload New Report</a>
          </div>
        </div>

        <div className="stats">
          {stats.map((s) => (
            <div className="card stat" key={s.label}>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="grid">
          <div className="card panel">
            <h4 className="panel-title">Recent Activity</h4>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={4}>Loading…</td></tr>
                  )}
                  {!loading && uploads.length===0 && (
                    <tr><td colSpan={4}>No recent uploads</td></tr>
                  )}
                  {!loading && uploads.map((u)=> (
                    <tr key={u.id}>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>{u.name}</td>
                      <td>
                        {u.status==='Approved' && <span className="status status--approved">Approved</span>}
                        {u.status==='Pending' && <span className="status status--pending">Pending</span>}
                        {!['Approved','Pending'].includes(u.status) && <span className="status">{u.status||'—'}</span>}
                      </td>
                      <td><a href="#uploads" className="link" onClick={(e)=>{ e.preventDefault(); const el=document.querySelector('#uploads') as HTMLElement|null; if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); history.replaceState(null,'','#uploads'); }}>View</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card panel">
            <h4 className="panel-title">Quick Access</h4>
            <div className="quick-grid">
              <a className="quick" href="#uploads" onClick={(e)=>{ e.preventDefault(); const el=document.querySelector('#uploads') as HTMLElement|null; if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); history.replaceState(null,'','#uploads'); }}>Upload New Report</a>
              <a className="quick" href="#files" onClick={(e)=>{ e.preventDefault(); const el=document.querySelector('#files') as HTMLElement|null; if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); history.replaceState(null,'','#files'); }}>View Downloads</a>
              <a className="quick" href="#training" onClick={(e)=>{ e.preventDefault(); const el=document.querySelector('#training') as HTMLElement|null; if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); history.replaceState(null,'','#training'); }}>Training Schedule</a>
              <a className="quick" href="#contact" onClick={(e)=>{ e.preventDefault(); const el=document.querySelector('#contact') as HTMLElement|null; if (el) el.scrollIntoView({ behavior:'smooth', block:'start' }); history.replaceState(null,'','#contact'); }}>Contact Admin</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
.dealer-dash-root { position: relative; padding: 0; overflow: hidden; }
.dealer-dash-root::before { content: ""; position: absolute; inset: 0; background: url('../../assets/logo/hero3.png') center/cover no-repeat; filter: blur(10px) saturate(.9); opacity: .22; transform: scale(1.08); }
.dealer-dash-root::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.22), rgba(0,0,0,0.35)); pointer-events: none; }
.dealer-dash-root > .wrap, .dealer-dash-root > style + .wrap { position: relative; z-index: 1; }
.wrap { width: 100%; max-width: none; margin: 0; display: grid; gap: 16px; padding: 24px 16px; }
.hero { display: grid; grid-template-columns: 1.2fr .8fr; gap: 12px; align-items: center; }
.hero-left { padding: 8px 2px; }
.title { margin: 0 0 6px; font-size: 28px; font-weight: 800; letter-spacing: .2px; }
.subtitle { margin: 0; color: var(--color-text-dim); }

.card { background: rgba(15, 22, 34, 0.72); backdrop-filter: blur(4px); border: 1px solid var(--color-border); border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.stat { padding: 16px; display: grid; gap: 4px; }
.stat-label { color: var(--color-text-dim); font-size: 12px; }
.stat-value { font-size: 28px; font-weight: 800; }

.grid { display: grid; grid-template-columns: 1.3fr .9fr; gap: 16px; }
.panel { padding: 16px; }
.panel-title { margin: 0 0 10px; font-size: 14px; color: var(--color-text-dim); text-transform: uppercase; letter-spacing: .6px; }
.table-wrap { overflow-x: auto; }
.table { width: 100%; border-collapse: collapse; }
.table th, .table td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--color-border); }
.status { padding: 4px 8px; border-radius: 999px; background: rgba(255,255,255,0.06); font-size: 12px; }
.status--approved { background: rgba(46, 204, 113, 0.18); color: #bff0cf; border: 1px solid rgba(46, 204, 113, 0.35); }
.status--pending { background: rgba(255, 195, 0, 0.18); color: #ffe8a6; border: 1px solid rgba(255,195,0,0.35); }
.quick-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
.quick { display: block; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--color-border); background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); text-decoration: none; color: var(--color-text); transition: transform .12s ease, box-shadow .2s ease; }
.quick:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(0,0,0,.35); }
.btn-primary { background: linear-gradient(180deg, #1a73e8, #145fbe); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 18px; border-radius: 12px; text-decoration: none; display: inline-block; }

@media (max-width: 1200px) { .wrap { width: 100%; } }
@media (max-width: 900px) { 
  .grid { grid-template-columns: 1fr; } 
  .hero { grid-template-columns: 1fr; }
  .btn-primary { width: 100%; text-align: center; }
}
@media (max-width: 640px) {
  .title { font-size: 22px; }
  .stat-value { font-size: 22px; }
  .panel { padding: 14px; }
  .table th, .table td { padding: 10px; }
}
`;
