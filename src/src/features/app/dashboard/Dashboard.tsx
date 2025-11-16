import { useEffect, useMemo, useState } from 'react';
import KpiCard from '../../../components/ui/KpiCard';
import StatusBadge from '../../../components/ui/StatusBadge';
import { api } from '../../../lib/api';

export default function Dashboard(){
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [kpis, setKpis] = useState<{ totalLeads:number; activeDealers:number; proto30d:number; downloads30d:number }>({ totalLeads:0, activeDealers:0, proto30d:0, downloads30d:0 });
  const [dealers, setDealers] = useState<Array<{ org:string; region?:string; users?:number }>>([]);
  const [leads, setLeads] = useState<Array<{ name:string; company?:string; status:string; created:string }>>([]);
  const [range, setRange] = useState<'30d'|'90d'>('30d');
  const [period, setPeriod] = useState<'today'|'week'|'month'>('month');

  const load = async ()=>{
    try{
      setError(''); setLoading(true);
      // KPIs (requires admin auth)
      try {
        const stats = await api.get<{ totalLeads?: number; activeDealers?: number; proto30d?: number; downloads30d?: number }>('/admin/stats');
        setKpis({
          totalLeads: Number(stats.totalLeads||0),
          activeDealers: Number(stats.activeDealers||0),
          proto30d: Number(stats.proto30d||0),
          downloads30d: Number(stats.downloads30d||0),
        });
      } catch(e:any){ /* keep defaults */ }
      // Active dealers list (public GET)
      try {
        const res = await api.get<any>('/dealers');
        const items = (res as any)?.items || res || [];
        const mapped = items.slice(0,5).map((d:any)=> ({ org: d.org || d.name || d.title || 'Dealer', region: d.region || d.location || '', users: d.users || d.userCount || 0 }));
        setDealers(mapped);
      } catch {}
      // Optional: recent leads if API exists
      try {
        const res = await api.get<any>('/leads');
        const items = (res as any)?.items || res || [];
        const mapped = items.slice(0,10).map((l:any)=> ({ name: l.name || l.contact || '—', company: l.company, status: l.status || 'New', created: l.createdAt || l.created || '' }));
        setLeads(mapped);
      } catch {}
    }
    catch(e:any){ setError(e.message||'Failed'); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const startDate = useMemo(()=>{
    const now = new Date();
    const start = new Date(now);
    if (period === 'today') { start.setHours(0,0,0,0); }
    else if (period === 'week') { start.setDate(now.getDate() - 7); start.setHours(0,0,0,0); }
    else { start.setDate(now.getDate() - 30); start.setHours(0,0,0,0); }
    return start;
  }, [period]);

  const recent3 = useMemo(()=> {
    const copy = [...leads].filter(l=> l.created).sort((a,b)=> new Date(b.created).getTime() - new Date(a.created).getTime());
    return copy.slice(0,3);
  }, [leads]);

  return (
    <div style={{ display:'grid', gap:16 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
          <h1 style={{ margin:0 }}>Dashboard</h1>
          <span style={{ color:'#9aa4af', fontSize:12 }}>Overview</span>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={()=> setPeriod('today')} style={{ padding:'8px 10px', border:'1px solid #233140', background: period==='today'?'var(--accent)':'#0B1117', color: period==='today'?'#fff':'#E6E6E6', borderRadius:8 }}>Today</button>
          <button onClick={()=> setPeriod('week')} style={{ padding:'8px 10px', border:'1px solid #233140', background: period==='week'?'var(--accent)':'#0B1117', color: period==='week'?'#fff':'#E6E6E6', borderRadius:8 }}>This Week</button>
          <button onClick={()=> setPeriod('month')} style={{ padding:'8px 10px', border:'1px solid #233140', background: period==='month'?'var(--accent)':'#0B1117', color: period==='month'?'#fff':'#E6E6E6', borderRadius:8 }}>This Month</button>
        </div>
      </div>
      {/* KPI Grid */}
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {loading ? (
          Array.from({length:4}).map((_,i)=> <div key={i} style={{ background:'#0E1621', border:'1px solid #223', borderRadius:12, padding:20, height:98, opacity:0.7 }}/>)
        ) : error ? (
          <div style={{ gridColumn:'1/-1', background:'#2a1515', border:'1px solid #442', borderRadius:12, padding:16 }}>
            <div style={{ marginBottom:8 }}>Error loading KPIs.</div>
            <button onClick={load} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Retry</button>
          </div>
        ) : (
          <>
            <div style={{ background:'linear-gradient(180deg, #0f1a26, #0d151f)', border:'1px solid #213042', borderRadius:14, padding:16, boxShadow:'0 6px 18px rgba(0,0,0,0.25)' }}>
              <KpiCard title="Total Leads" value={kpis.totalLeads} trend="up"/>
            </div>
            <div style={{ background:'linear-gradient(180deg, #0f1a26, #0d151f)', border:'1px solid #213042', borderRadius:14, padding:16, boxShadow:'0 6px 18px rgba(0,0,0,0.25)' }}>
              <KpiCard title="Active Dealers" value={kpis.activeDealers} trend="flat"/>
            </div>
            <div style={{ background:'linear-gradient(180deg, #0f1a26, #0d151f)', border:'1px solid #213042', borderRadius:14, padding:16, boxShadow:'0 6px 18px rgba(0,0,0,0.25)' }}>
              <KpiCard title="Prototype Requests (30d)" value={kpis.proto30d} trend="up"/>
            </div>
            <div style={{ background:'linear-gradient(180deg, #0f1a26, #0d151f)', border:'1px solid #213042', borderRadius:14, padding:16, boxShadow:'0 6px 18px rgba(0,0,0,0.25)' }}>
              <KpiCard title="File Downloads (30d)" value={kpis.downloads30d} trend="up"/>
            </div>
          </>
        )}
      </div>

      {/* Active Dealers */}
      <div style={{ background:'#0E1621', border:'1px solid #223', borderRadius:12, padding:16, display:'grid', gap:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong>Active Dealers</strong>
          <a href="/app/dealers" style={{ padding:'6px 10px', border:'1px solid #233140', borderRadius:8, background:'#0B1117', color:'var(--accent)', textDecoration:'none' }}>View all</a>
        </div>
        <div style={{ display:'grid', gap:8 }}>
          {(dealers.length? dealers : []).map((d)=> (
            <div key={d.org+String(d.region)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', border:'1px solid #1c2a39', borderRadius:10, padding:'10px 12px', flexWrap:'wrap', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'#1A73E8', color:'#fff', display:'grid', placeItems:'center' }}>{d.org[0]}</div>
                <div>
                  <div style={{ fontWeight:600 }}>{d.org}</div>
                  <div style={{ fontSize:12, color:'#9aa4af' }}>{d.region || '—'} • {d.users||0} users</div>
                </div>
              </div>
              <a href="/app/dealers" style={{ fontSize:12, color:'var(--accent)' }}>Open</a>
            </div>
          ))}
          {!dealers.length && <div style={{ color:'#9aa4af' }}>No active dealers found.</div>}
        </div>
      </div>

      {/* Recent Deals (from backend leads when available) */}
      <div style={{ background:'#0E1621', border:'1px solid #223', borderRadius:12, padding:16, display:'grid', gap:8 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong>Recent Deals</strong>
          <a href="/app/leads" style={{ padding:'6px 10px', border:'1px solid #233140', borderRadius:8, background:'#0B1117', color:'var(--accent)', textDecoration:'none' }}>View all</a>
        </div>
        <div style={{ border:'1px solid #223', borderRadius:10, overflow:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', minWidth:520 }}>
            <thead>
              <tr>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Company</th>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Contact</th>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Stage</th>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recent3.map((r)=> (
                <tr key={r.name + r.created}>
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{r.company || '—'}</td>
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{r.name}</td>
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}><StatusBadge status={r.status as any}/></td>
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{r.created}</td>
                </tr>
              ))}
              {!recent3.length && (
                <tr><td colSpan={4} style={{ padding:12, textAlign:'center', color:'#9aa4af' }}>No recent deals to show.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ background:'#0E1621', border:'1px solid #223', borderRadius:12, padding:16, display:'grid', gap:8 }}>
        <strong>Quick Actions</strong>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <a href="/app/content">Add Product</a>
          <a href="/app/files">Add File</a>
          <a href="/app/dealers">Invite Dealer</a>
          <a href="/app/leads">Export Leads</a>
        </div>
      </div>

      {/* Lead Drawer removed with table */}
    </div>
  );
}
