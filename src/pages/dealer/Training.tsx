import React, { useEffect, useMemo, useState } from 'react';
import { getTrainingEvents } from '@/services/dealers';

type Event = { id: string; title: string; datetime: string; mode?: string };
type Past = { id: string; title: string; datetime: string; certificate?: string };

export default function Training() {
  const [upcoming, setUpcoming] = useState<Event[]>([]);
  const [past, setPast] = useState<Past[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    (async () => {
      const res = await getTrainingEvents();
      const data = (res as any)?.data || { upcoming: [], past: [] };
      setUpcoming(data.upcoming || []);
      setPast(data.past || []);
      if ((data.upcoming || []).length) setSelected(data.upcoming[0].id);
      else setSelected('');
    })();
  }, []);

  const selectedEvent = useMemo(() => upcoming.find(u => u.id === selected), [upcoming, selected]);

  function formatDT(input: string) {
    if (!input) return 'TBD';
    const d = new Date(input);
    if (!isNaN(d.getTime())){
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    // fallback: accept DD-MM-YYYY
    const m = String(input).trim().match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})(?:\s+(\d{2}):(\d{2}))?$/);
    if (m){
      const dd = Number(m[1]); const mm = Number(m[2]); const yyyy = Number(m[3]);
      const hh = m[4]? Number(m[4]) : 9; const min = m[5]? Number(m[5]) : 0;
      const dt = new Date(yyyy, mm-1, dd, hh, min);
      if (!isNaN(dt.getTime())){
        return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
    }
    return 'TBD';
  }

  return (
    <div className="dealer-training-root">
      <style>{css}</style>
      {toast && <div className="toast">{toast}</div>}

      <div className="grid">
        <div className="card panel">
          <h3 className="title">Upcoming Training</h3>
          <div className="list">
            {upcoming.map(ev => (
              <div key={ev.id} className={`item ${selected===ev.id?'item--active':''}`} onClick={()=> setSelected(ev.id)}>
                <div className="item-title">{ev.title}</div>
                <div className="item-meta">{formatDT(ev.datetime)} • {ev.mode || 'Online'}</div>
                <span className="pill">View only</span>
              </div>
            ))}
            {upcoming.length===0 && <div className="empty">No upcoming sessions.</div>}
          </div>
        </div>

        <div className="card panel">
          <h3 className="title">Past Sessions / Certificates</h3>
          <div className="list">
            {past.map(p => (
              <div key={p.id} className="item">
                <div className="item-title">{p.title}</div>
                <div className="item-meta">{new Date(p.datetime).toLocaleDateString()}</div>
                {p.certificate ? (
                  <a className="btn" href={p.certificate} target="_blank" rel="noreferrer">Download Certificate</a>
                ) : (
                  <span className="pill">No certificate</span>
                )}
              </div>
            ))}
            {past.length===0 && <div className="empty">No completed sessions yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

const css = `
.dealer-training-root { padding: 12px 16px; }
.grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; }
.card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border: 1px solid var(--color-border); border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
.panel { padding: 16px; }
.title { margin: 0 0 10px; }
.list { display: grid; gap: 10px; }
.item { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: center; padding: 12px; border: 1px solid var(--color-border); border-radius: 12px; background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); }
.item--active { outline: 2px solid rgba(26,115,232,0.35); }
.item-title { font-weight: 700; }
.item-meta { color: var(--color-text-dim); font-size: 12px; }
.btn, .btn-link { padding: 8px 12px; border-radius: 10px; border: 1px solid var(--color-border); text-decoration: none; color: var(--color-text); }
.btn-link { background: transparent; }
.pill { padding: 4px 8px; border-radius: 999px; background: rgba(255,255,255,0.06); font-size: 12px; }
.form { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
.field { display: grid; gap: 6px; }
.field--full { grid-column: 1 / -1; }
.field > span { font-size: 12px; color: var(--color-text-dim); }
.form input, .form select, .form textarea { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 10px 12px; }
.form input:focus, .form select:focus, .form textarea:focus { border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(26,115,232,0.15); outline: none; }
.actions { grid-column: 1 / -1; display: flex; align-items: center; gap: 12px; }
.btn-primary { background: linear-gradient(180deg, #1a73e8, #145fbe); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 18px; border-radius: 12px; cursor: pointer; }
.toast { position: fixed; top: 16px; right: 16px; background: rgba(26,115,232,0.25); border: 1px solid rgba(26,115,232,0.35); color: #dbe8ff; padding: 10px 12px; border-radius: 10px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }

@media (max-width: 900px) { 
  .grid { grid-template-columns: 1fr; } 
  .form { grid-template-columns: 1fr; }
  .item { grid-template-columns: 1fr; align-items: start; gap: 6px; }
  .btn, .btn-link { width: 100%; text-align: center; }
}
@media (max-width: 640px) {
  .panel { padding: 14px; }
}
`;
