import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Drawer from '../../../components/ui/Drawer';
import StatusBadge from '../../../components/ui/StatusBadge';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../../lib/api';

type DealerStatus = 'Pending'|'Active'|'Suspended';
type Dealer = {
  id: string;
  org: string;
  contactName: string;
  contactEmail: string;
  region: string;
  status: DealerStatus;
  users: number;
  last: string;
};

const seed: Dealer[] = [];

export default function Dealers(){
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<DealerStatus|''>('');
  const [region, setRegion] = useState('');
  const [rows, setRows] = useState<Dealer[]>(seed);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Dealer|null>(null);
  const [detailPhone, setDetailPhone] = useState<string>('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [statusMenuFor, setStatusMenuFor] = useState<string|null>(null);

  // Load dealers from backend on filters change
  useEffect(()=>{
    const load = async ()=>{
      try{
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (status) params.set('status', status);
        if (region) params.set('region', region);
        const res = await api.get<{ items: Dealer[] }>(`/dealers?${params.toString()}`);
        if (Array.isArray(res?.items)) setRows(res.items as any);
      }catch{}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, region]);

  const filtered = useMemo(()=>{
    let list = [...rows];
    if (q) {
      const s = q.toLowerCase();
      list = list.filter(r => [r.org, r.contactName, r.contactEmail, r.region].some(v => v.toLowerCase().includes(s)));
    }
    if (status) list = list.filter(r => r.status === status);
    if (region) list = list.filter(r => r.region === region);
    return list;
  }, [rows, q, status, region]);

  const changeStatus = async (ids: string[]|string, next: DealerStatus)=>{
    const idList = Array.isArray(ids) ? ids : [ids];
    const prevRows = rows;
    setRows(prev => prev.map(r => idList.includes(r.id) ? { ...r, status: next } : r));
    if (current && idList.includes(current.id)) setCurrent({ ...current, status: next });
    try {
      await Promise.all(idList.map(id => api.patch(`/dealers/${id}/status`, { status: next })));
      if (next === 'Active') {
        // Ensure dealer user exists and is prepared to login
        await Promise.all(idList.map(id => api.post(`/dealers/${id}/approve`)));
      }
    }
    catch (e:any) { setRows(prevRows); alert(e?.response?.data?.error || 'Failed to change status'); }
  };
  const remove = async (ids: string[])=>{
    if (!confirm(`Delete ${ids.length} dealer(s)?`)) return;
    const prevRows = rows;
    setRows(prev => prev.filter(r => !ids.includes(r.id)));
    try{
      if (ids.length===1) await api.del(`/dealers/${ids[0]}`);
      else await api.post('/dealers/bulk-delete', { ids });
    }catch{ setRows(prevRows); alert('Failed to delete'); }
  };

  const exportCSV = ()=>{
    const headers = ['Organization','Primary Contact','Region','Status','Users','Last'];
    const data = filtered.map(r => [r.org, `${r.contactName} <${r.contactEmail}>`, r.region, r.status, String(r.users), r.last]);
    const csv = [headers, ...data].map(line => line.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='dealers.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const columns = [
    { key:'org', header:'Organization' },
    { key:'contact', header:'Primary Contact', render:(r:Dealer)=> `${r.contactName} <${r.contactEmail}>` },
    { key:'region', header:'Region' },
    { key:'status', header:'Status', render:(r:Dealer)=> (
      <div style={{ position:'relative' }}>
        <button onClick={(e)=> { e.stopPropagation(); setStatusMenuFor(p => p===r.id? null : r.id); }}
          style={{ padding:'4px 8px', borderRadius:999, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <StatusBadge status={r.status}/>
        </button>
        {statusMenuFor===r.id && (
          <div style={{ position:'absolute', top:'110%', left:0, background:'#0E1621', border:'1px solid #223', borderRadius:8, padding:6, display:'grid', gap:4, zIndex:10 }}>
            {(['Pending','Active','Suspended'] as DealerStatus[]).map(opt => (
              <button key={opt} onClick={(e)=> { e.stopPropagation(); changeStatus(r.id, opt); setStatusMenuFor(null); }}
                style={{ textAlign:'left', padding:'6px 8px', borderRadius:6, border:'1px solid #233140', background: r.status===opt?'#132030':'#0B1117', color:'#E6E6E6' }}>{opt}</button>
            ))}
          </div>
        )}
      </div>
    ) },
    { key:'users', header:'Users(#)' },
    { key:'last', header:'Last Activity' },
    { key:'actions', header:'', render:(r:Dealer)=> (
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={(e)=> { e.stopPropagation(); setCurrent(r); setOpen(true); }} style={{ padding:'4px 8px', border:'1px solid #334', borderRadius:8 }}>Edit</button>
        <button onClick={(e)=> { e.stopPropagation(); remove([r.id]); }} style={{ padding:'4px 8px', border:'1px solid #334', borderRadius:8 }}>Delete</button>
      </div>
    ) },
  ] as const;

  const columnsWithSelect = [
    { key:'select', header:'', render:(r:Dealer)=> (
      <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={(e)=> setSelectedIds(ids => e.target.checked ? [...ids, r.id] : ids.filter(id => id !== r.id))} />
    ) },
    ...columns
  ];

  const toolbar = (
    <div style={{ display:'flex', gap:8, alignItems:'end', flexWrap:'wrap' }}>
      <Input label="Search" value={q} onChange={(e)=> setQ(e.target.value)} placeholder="Org, contact, email, region" />
      <label style={{ display:'grid', gap:6 }}>
        <div style={{ fontSize:12, color:'#C5C6C7' }}>Status</div>
        <select value={status} onChange={(e)=> setStatus((e.target.value||'') as any)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <option value="">All</option>
          <option>Pending</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </label>
      <label style={{ display:'grid', gap:6 }}>
        <div style={{ fontSize:12, color:'#C5C6C7' }}>Region</div>
        <select value={region} onChange={(e)=> setRegion(e.target.value)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <option value="">All</option>
          <option>NA</option>
          <option>EU</option>
          <option>APAC</option>
          <option>ME</option>
          <option>LATAM</option>
        </select>
      </label>
      <Button onClick={()=> setInviteOpen(true)}>Invite Dealer</Button>
      <Button onClick={exportCSV} variant="secondary">Export CSV</Button>
      <Button onClick={()=> remove(selectedIds)} variant="ghost">Delete</Button>
    </div>
  );

  return (
    <div style={{ display:'grid', gap:12 }}>
      <h1>Dealers</h1>
      <DataTable<Dealer> columns={columnsWithSelect as any} rows={filtered} density="compact" toolbar={toolbar} onRowClick={async (r)=> { 
        setCurrent(r); setOpen(true); setDetailPhone('');
        try { const d = await api.get<any>(`/dealers/${r.id}/detail`); setDetailPhone((d as any)?.phone || ''); } catch {}
      }} />

      {/* Drawer */}
      <Drawer open={open} onClose={()=> setOpen(false)} title={current? current.org : 'Dealer'}>
        {current && (
          <div style={{ display:'grid', gap:8 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <StatusBadge status={current.status} />
              <span>{current.region}</span>
            </div>
            <div>Primary: {current.contactName} &lt;{current.contactEmail}&gt;</div>
            {detailPhone && <div>Phone: {detailPhone}</div>}
            <div>Users: {current.users}</div>
            <div>Files Shared: 0</div>
            <hr style={{ borderColor:'#223' }}/>
            <label>Status
              <select value={current.status} onChange={(e)=> changeStatus(current.id, e.target.value as DealerStatus)} style={{ marginLeft:8 }}>
                <option>Pending</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </label>
            <strong>Users</strong>
            <div style={{ border:'1px solid #223', borderRadius:8, padding:8 }}>Sub-table stub</div>
            <strong>Notes</strong>
            <ul>
              <li>Created • {current.last}</li>
            </ul>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <Button variant="ghost" onClick={()=> remove([current.id])}>Delete</Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Invite modal */}
      {inviteOpen && (
        <InviteDealerModal onClose={()=> setInviteOpen(false)} onCreate={async (val)=>{
          try{
            const created = await api.post<Dealer>('/dealers', { org: val.org, contactName: val.contactName, email: val.email, region: val.region });
            setRows(prev => [created as any, ...prev]);
            alert(val.sendEmail ? 'Invite sent via email' : 'Dealer created');
          }catch{
            alert('Failed to create dealer');
          } finally {
            setInviteOpen(false);
          }
        }}/>
      )}
    </div>
  );
}

const inviteSchema = z.object({
  org: z.string().min(1, 'Organization is required'),
  contactName: z.string().min(1, 'Contact name is required'),
  email: z.string().email('Invalid email'),
  region: z.string().min(1, 'Region is required'),
  sendEmail: z.boolean().optional(),
});

function InviteDealerModal({ onClose, onCreate }:{ onClose: ()=>void; onCreate:(val: z.infer<typeof inviteSchema>)=>void }){
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<z.infer<typeof inviteSchema>>({ resolver: zodResolver(inviteSchema) });
  const submit = (vals: z.infer<typeof inviteSchema>)=> onCreate(vals);
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center', zIndex:60 }}>
      <form onSubmit={handleSubmit(submit)} style={{ background:'#0E1621', border:'1px solid #223', borderRadius:12, width:560, maxWidth:'96vw', padding:16, display:'grid', gap:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong>Invite Dealer</strong>
          <button type="button" onClick={onClose} style={{ background:'transparent', border:'1px solid #334', borderRadius:8, color:'#C5C6C7', padding:'6px 10px' }}>Close</button>
        </div>
        <label>Organization<input {...register('org')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.org?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />{errors.org && <div style={{ color:'#FF6B6B', fontSize:12 }}>{errors.org.message}</div>}</label>
        <label>Contact Name<input {...register('contactName')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.contactName?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />{errors.contactName && <div style={{ color:'#FF6B6B', fontSize:12 }}>{errors.contactName.message}</div>}</label>
        <label>Email<input type="email" {...register('email')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.email?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />{errors.email && <div style={{ color:'#FF6B6B', fontSize:12 }}>{errors.email.message}</div>}</label>
        <label>Region<select {...register('region')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <option value="">Select</option>
          <option>NA</option>
          <option>EU</option>
          <option>APAC</option>
          <option>ME</option>
          <option>LATAM</option>
        </select>{errors.region && <div style={{ color:'#FF6B6B', fontSize:12 }}>{errors.region.message}</div>}</label>
        <label style={{ display:'flex', alignItems:'center', gap:8 }}><input type="checkbox" {...register('sendEmail')} /> Send invite email</label>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8 }}>Cancel</button>
          <button disabled={isSubmitting} type="submit" style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8, background:'var(--accent)', color:'#fff' }}>Invite</button>
        </div>
      </form>
    </div>
  );
}
