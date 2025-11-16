import React, { useEffect, useMemo, useState } from 'react';
import adminApi, { adminMe } from '@/services/adminApi';

type Lead = {
  id?: string;
  name?: string;
  contact?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: string;
  message?: string;
  createdAt?: string;
  created?: string;
  // note: deliberately omitting dealer/dealerId to keep UI relevant
};

export default function Leads(){
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Lead[]>([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Lead|null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [canDelete, setCanDelete] = useState(false);

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const load = async ()=>{
    try{
      setError(''); setLoading(true);
      const res = await adminApi.get('/leads');
      const data = (res as any)?.data || res || [];
      const arr: Lead[] = (data.items || data);
      setItems(arr);
    }catch(e:any){ setError(e?.message||'Failed'); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ (async()=>{
    await load();
    try{
      const me = await adminMe();
      const roles: string[] = (me?.roles)||[];
      setCanDelete(roles.includes('admin') || roles.includes('marketing'));
    }catch{}
  })(); },[]);

  const rows = useMemo(()=> items.map((l, idx)=> ({
    key: String(l.id ?? idx),
    company: l.company || '—',
    contact: l.name || l.contact || l.email || '—',
    status: l.status || 'New',
    created: formatDate(l.createdAt || l.created),
    raw: l,
  })),[items]);

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedRows = rows.slice(start, end);

  const exportCsv = () => {
    const headers = ['Company','Contact','Status','Created'];
    const data = rows.map(r => [r.company, r.contact, r.status, r.created]);
    const csv = [headers, ...data].map(line => line.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const deleteLead = async (lead: Lead) => {
    if (!lead?.id) return;
    const ok = window.confirm('Delete this lead permanently?');
    if (!ok) return;
    try {
      await adminApi.delete(`/leads/${lead.id}`);
      await load();
    } catch (e:any) {
      setError(e?.response?.data?.error || e?.message || 'Delete failed');
    }
  };

  return (
    <div style={{ display:'grid', gap:12 }}>
      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .row-anim { animation: fadeSlide 240ms ease both; }
        .row-anim:hover { background: rgba(26,115,232,0.05); }
        .modal-backdrop { animation: fadeSlide 180ms ease both; }
        .modal-card { animation: fadeSlide 220ms ease both; }
      `}</style>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ margin:0 }}>Leads</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <label style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, opacity:0.85 }}>
            Page size
            <select value={pageSize} onChange={e=> { setPageSize(Number(e.target.value)); setPage(1); }} style={{ padding:'6px 8px', border:'1px solid #334', borderRadius:8, background:'#0B1117', color:'#E6E6E6' }}>
              {[10,20,50,100].map(s=> <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <button onClick={exportCsv} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Export CSV</button>
          <button onClick={load} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Refresh</button>
        </div>
      </div>
      {error && <div style={{ color:'#FF6B6B' }}>{error}</div>}

      <div style={{ border:'1px solid #223', borderRadius:12, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns: canDelete? '2fr 2fr 1fr 1fr 80px' : '2fr 2fr 1fr 1fr', background:'linear-gradient(180deg, #0f1a26, #0d151f)', borderBottom:'1px solid #213042', padding:'10px 12px', fontWeight:700 }}>
          <div>Company</div>
          <div>Contact</div>
          <div>Status</div>
          <div>Created</div>
          {canDelete && <div>Actions</div>}
        </div>
        <div style={{ display:'grid' }}>
          {loading ? (
            Array.from({length:8}).map((_,i)=> (
              <div key={i} style={{ display:'grid', gridTemplateColumns: canDelete? '2fr 2fr 1fr 1fr 80px' : '2fr 2fr 1fr 1fr', padding:'12px', borderBottom:'1px solid #16202c', opacity:0.7 }}>
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
                {canDelete && <div />}
              </div>
            ))
          ) : pagedRows.length ? (
            pagedRows.map((r, idx)=> (
              <div key={r.key} className="row-anim" style={{ display:'grid', gridTemplateColumns: canDelete? '2fr 2fr 1fr 1fr 80px' : '2fr 2fr 1fr 1fr', padding:'12px', borderBottom:'1px solid #16202c', alignItems:'center', animationDelay: `${idx * 30}ms` }}>
                <button onClick={()=> setSelected(r.raw)} style={{ all:'unset', cursor:'pointer', gridColumn: canDelete? '1 / span 4' : '1 / span 4' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr', gap:12 }}>
                    <div style={{ fontWeight:600 }}>{r.company}</div>
                    <div style={{ opacity:0.9 }}>{r.contact}</div>
                    <div><span style={{ fontSize:12, padding:'3px 8px', borderRadius:999, border:'1px solid #2a3a4d' }}>{r.status}</span></div>
                    <div style={{ opacity:0.9 }}>{r.created}</div>
                  </div>
                </button>
                {canDelete && (
                  <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center' }}>
                    <button aria-label="Delete lead" title={r.raw.id? 'Delete lead':'Cannot delete (missing id)'} onClick={()=> r.raw.id && deleteLead(r.raw)} style={{ width:32, height:32, display:'grid', placeItems:'center', border:'1px solid rgba(239,68,68,0.5)', borderRadius:8, background:'#0B1117', color:'#EF4444', opacity: r.raw.id? 1: .5 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-1 0v13a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1V6h9z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding:12, textAlign:'center', color:'#9aa4af' }}>No leads found.</div>
          )}
        </div>
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
        <div style={{ fontSize:12, opacity:0.85 }}>Page {currentPage} of {totalPages} • {rows.length} total</div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={()=> setPage(p=> Math.max(1, p-1))} disabled={currentPage<=1} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8, opacity: currentPage<=1? .6: 1 }}>Previous</button>
          <button onClick={()=> setPage(p=> Math.min(totalPages, p+1))} disabled={currentPage>=totalPages} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8, opacity: currentPage>=totalPages? .6: 1 }}>Next</button>
        </div>
      </div>

      {selected && (
        <div role="dialog" aria-modal onClick={()=> setSelected(null)} className="modal-backdrop" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'grid', placeItems:'center', zIndex:50 }}>
          <div onClick={(e)=> e.stopPropagation()} className="modal-card" style={{ width:'min(720px, 92vw)', background:'#0B121B', border:'1px solid #223', borderRadius:14, padding:16, boxShadow:'0 20px 60px rgba(0,0,0,0.45)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <h3 style={{ margin:0 }}>Lead details</h3>
              <button onClick={()=> setSelected(null)} style={{ padding:'6px 10px', border:'1px solid #334', borderRadius:8 }}>Close</button>
            </div>
            <div style={{ display:'grid', gap:10, gridTemplateColumns:'1fr 1fr' }}>
              <Field label="Name" value={selected.name || selected.contact || '—'} />
              <Field label="Email" value={selected.email || '—'} />
              <Field label="Phone" value={selected.phone || '—'} />
              <Field label="Company" value={selected.company || '—'} />
              <Field label="Status" value={selected.status || 'New'} />
              <Field label="Created" value={formatDate(selected.createdAt || selected.created)} />
            </div>
            {selected.message && (
              <div style={{ marginTop:12 }}>
                <div style={{ fontSize:12, opacity:0.8, marginBottom:6 }}>Message</div>
                <div style={{ whiteSpace:'pre-wrap', lineHeight:1.5, background:'#0E1621', border:'1px solid #223', borderRadius:10, padding:12 }}>{selected.message}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value }:{ label:string; value: React.ReactNode }){
  return (
    <div style={{ display:'grid', gap:4 }}>
      <div style={{ fontSize:12, opacity:0.8 }}>{label}</div>
      <div style={{ padding:'10px 12px', border:'1px solid #223', borderRadius:10, background:'#0E1621' }}>{value}</div>
    </div>
  );
}
