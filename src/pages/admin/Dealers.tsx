import React, { useEffect, useMemo, useState } from 'react';
import adminApi, { adminMe } from '@/services/adminApi';

type Dealer = {
  id?: string;
  org?: string;
  contactName?: string;
  contactEmail?: string;
  phone?: string;
  region?: string;
  status?: 'Pending'|'Active'|'Suspended'|string;
  users?: number;
  createdAt?: string;
};

export default function Dealers(){
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Dealer[]>([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Dealer|null>(null);
  const [canManage, setCanManage] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [invite, setInvite] = useState({ org:'', contactName:'', email:'', region:'', message:'' });

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  };

  const load = async ()=>{
    try{
      setError(''); setLoading(true);
      const res = await adminApi.get('/dealers');
      const data = (res as any)?.data || res || [];
      setItems((data.items || data) as any[]);
    }catch(e:any){ setError(e?.message||'Failed'); }
    finally{ setLoading(false); }
  };

  const open = async (d: Dealer)=>{
    setSelected(d);
    try{
      if (d.id){
        const res = await adminApi.get(`/dealers/${d.id}/detail`);
        const info = (res as any)?.data || res || {};
        setSelected({ ...d, ...info });
      }
    }catch{}
  };

  const setStatus = async (d: Dealer, status: 'Pending'|'Active'|'Suspended')=>{
    if (!d?.id) return;
    try{
      await adminApi.patch(`/dealers/${d.id}/status`, { status });
      await load();
      setSelected(s=> s && s.id===d.id ? ({...s, status}) : s);
    }catch(e:any){ setError(e?.response?.data?.error || e?.message || 'Update failed'); }
  };

  const approve = async (d: Dealer)=>{
    if (!d?.id) return;
    try{
      await adminApi.post(`/dealers/${d.id}/approve`);
      await load();
      setSelected(s=> s && s.id===d.id ? ({...s, status:'Active'}) : s);
    }catch(e:any){ setError(e?.response?.data?.error || e?.message || 'Approve failed'); }
  };

  useEffect(()=>{ (async()=>{
    await load();
    try{
      const me = await adminMe();
      const roles: string[] = (me?.roles)||[];
      setCanManage(roles.includes('admin') || roles.includes('marketing'));
    }catch{}
  })(); },[]);

  const rows = useMemo(()=> items.map((d, idx)=> ({
    key: String(d.id ?? idx),
    org: d.org || 'Dealer',
    contact: d.contactName || d.contactEmail || '—',
    region: d.region || '—',
    users: d.users ?? 0,
    status: d.status || 'Pending',
    raw: d,
  })),[items]);

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
        <h2 style={{ margin:0 }}>Dealers</h2>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={load} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Refresh</button>
          {canManage && (
            <button onClick={()=> setInviteOpen(true)} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Invite Dealer</button>
          )}
        </div>
      </div>
      {error && <div style={{ color:'#FF6B6B' }}>{error}</div>}

      <div style={{ border:'1px solid #223', borderRadius:12, overflow:'hidden' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', background:'linear-gradient(180deg, #0f1a26, #0d151f)', borderBottom:'1px solid #213042', padding:'10px 12px', fontWeight:700 }}>
          <div>Organization</div>
          <div>Contact</div>
          <div>Region</div>
          <div>Users</div>
          <div>Status</div>
        </div>
        <div style={{ display:'grid' }}>
          {loading ? (
            Array.from({length:8}).map((_,i)=> (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', padding:'12px', borderBottom:'1px solid #16202c', opacity:0.7 }}>
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
                <div style={{ height:14, background:'#132030', borderRadius:6 }} />
              </div>
            ))
          ) : rows.length ? (
            rows.map((r, idx)=> (
              <button key={r.key} onClick={()=> open(r.raw)} className="row-anim" style={{ textAlign:'left', display:'grid', gridTemplateColumns:'2fr 2fr 1fr 1fr 1fr', padding:'12px', borderBottom:'1px solid #16202c', background:'transparent', color:'inherit', cursor:'pointer', animationDelay: `${idx * 30}ms` }}>
                <div style={{ fontWeight:600 }}>{r.org}</div>
                <div style={{ opacity:0.9 }}>{r.contact}</div>
                <div style={{ opacity:0.9 }}>{r.region}</div>
                <div style={{ opacity:0.9 }}>{r.users}</div>
                <div><span style={{ fontSize:12, padding:'3px 8px', borderRadius:999, border:'1px solid #2a3a4d' }}>{r.status}</span></div>
              </button>
            ))
          ) : (
            <div style={{ padding:12, textAlign:'center', color:'#9aa4af' }}>No dealers found.</div>
          )}
        </div>
      </div>

      {inviteOpen && (
        <div role="dialog" aria-modal onClick={()=> setInviteOpen(false)} className="modal-backdrop" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'grid', placeItems:'center', zIndex:50 }}>
          <div onClick={(e)=> e.stopPropagation()} className="modal-card" style={{ width:'min(640px, 92vw)', background:'#0B121B', border:'1px solid #223', borderRadius:14, padding:16, boxShadow:'0 20px 60px rgba(0,0,0,0.45)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <h3 style={{ margin:0 }}>Invite Dealer</h3>
              <button onClick={()=> setInviteOpen(false)} style={{ padding:'6px 10px', border:'1px solid #334', borderRadius:8 }}>Close</button>
            </div>
            <form onSubmit={async (e)=>{
              e.preventDefault();
              if (!invite.org || !invite.contactName || !invite.email || !invite.region) return;
              try{
                setCreating(true);
                await adminApi.post('/dealers', { org: invite.org, contactName: invite.contactName, email: invite.email, region: invite.region, message: invite.message });
                setInvite({ org:'', contactName:'', email:'', region:'', message:'' });
                setInviteOpen(false);
                await load();
              }catch(e:any){ setError(e?.response?.data?.error || e?.message || 'Create failed'); }
              finally{ setCreating(false); }
            }} style={{ display:'grid', gap:10 }}>
              <div style={{ display:'grid', gap:10, gridTemplateColumns:'1fr 1fr' }}>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Organization</span>
                  <input value={invite.org} onChange={e=> setInvite(s=> ({...s, org: e.target.value}))} required style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
                </label>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Region</span>
                  <input value={invite.region} onChange={e=> setInvite(s=> ({...s, region: e.target.value}))} required style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
                </label>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Contact Name</span>
                  <input value={invite.contactName} onChange={e=> setInvite(s=> ({...s, contactName: e.target.value}))} required style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
                </label>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Email</span>
                  <input type="email" value={invite.email} onChange={e=> setInvite(s=> ({...s, email: e.target.value}))} required style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
                </label>
              </div>
              <label style={{ display:'grid', gap:6 }}>
                <span style={{ fontSize:12, opacity:.8 }}>Message (optional)</span>
                <textarea value={invite.message} onChange={e=> setInvite(s=> ({...s, message: e.target.value}))} rows={4} style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
              </label>
              <button disabled={creating} type="submit" style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>{creating? 'Sending…' : 'Send Invite'}</button>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div role="dialog" aria-modal onClick={()=> setSelected(null)} className="modal-backdrop" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'grid', placeItems:'center', zIndex:50 }}>
          <div onClick={(e)=> e.stopPropagation()} className="modal-card" style={{ width:'min(760px, 92vw)', background:'#0B121B', border:'1px solid #223', borderRadius:14, padding:16, boxShadow:'0 20px 60px rgba(0,0,0,0.45)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <h3 style={{ margin:0 }}>Dealer details</h3>
              <button onClick={()=> setSelected(null)} style={{ padding:'6px 10px', border:'1px solid #334', borderRadius:8 }}>Close</button>
            </div>
            <div style={{ display:'grid', gap:10, gridTemplateColumns:'1fr 1fr' }}>
              <Field label="Organization" value={selected.org || '—'} />
              <Field label="Region" value={selected.region || '—'} />
              <Field label="Contact Name" value={selected.contactName || '—'} />
              <Field label="Contact Email" value={selected.contactEmail || '—'} />
              <Field label="Users" value={String(selected.users ?? 0)} />
              <Field label="Status" value={selected.status || 'Pending'} />
              <Field label="Created" value={formatDate(selected.createdAt)} />
            </div>
            {canManage && (
              <div style={{ marginTop:12, display:'flex', gap:8, flexWrap:'wrap' }}>
                {selected.status === 'Pending' && (
                  <button onClick={()=> approve(selected)} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Approve</button>
                )}
                <button onClick={()=> setStatus(selected, 'Active')} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Set Active</button>
                <button onClick={()=> setStatus(selected, 'Suspended')} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8, color:'#F59E0B' }}>Set Suspended</button>
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
