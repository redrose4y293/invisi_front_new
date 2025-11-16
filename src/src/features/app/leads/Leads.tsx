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

type LeadStatus = 'New'|'In Review'|'Qualified'|'Closed';
type LeadType = 'Prototype'|'Dealer'|'Media'|'Other';
type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  type: LeadType;
  message?: string;
  tags?: string[];
  status: LeadStatus;
  owner?: string;
  createdAt: string;
};

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  type: z.enum(['Prototype','Dealer','Media','Other']),
  message: z.string().max(5000).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['New','In Review','Qualified','Closed']),
  owner: z.string().optional(),
});

function toCSV(rows: Lead[]): string {
  const headers = ['Name','Email','Company','Type','Status','Created'];
  const data = rows.map(r => [r.name, r.email, r.company||'', r.type, r.status, r.createdAt]);
  return [headers, ...data].map(line => line.map(v => '"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n');
}

const seed: Lead[] = [];

export default function Leads(){
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<LeadStatus|''>('');
  const [type, setType] = useState<LeadType|''>('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [all, setAll] = useState<Lead[]>(seed);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [current, setCurrent] = useState<Lead|null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [savedViews, setSavedViews] = useState<{name:string; filter:any}[]>([{ name:'Default', filter:{} }]);
  const [statusMenuFor, setStatusMenuFor] = useState<string|null>(null);
  const [dealerUploadsOnly, setDealerUploadsOnly] = useState(false);

  // Load leads from backend with graceful fallback
  useEffect(()=>{
    const load = async ()=>{
      try {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (status) params.set('status', status);
        if (type) params.set('type', type);
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        const res = await api.get<{ items: Lead[] }>(`/leads?${params.toString()}`);
        if (Array.isArray(res?.items)) setAll(res.items as any);
      } catch { /* keep empty */ }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, type, from, to]);

  const changeStatus = async (id: string, next: LeadStatus)=>{
    // optimistic update
    setAll(prev => prev.map(r => r.id===id ? { ...r, status: next } : r));
    if (current && current.id===id) setCurrent({ ...current, status: next });
    try { await api.patch(`/leads/${id}/status`, { status: next }); } catch { /* keep optimistic */ }
  };
  const removeLead = async (id: string)=>{
    if (!confirm('Delete this lead?')) return;
    const prevAll = all;
    setAll(prev => prev.filter(r => r.id!==id));
    try { await api.del(`/leads/${id}`); }
    catch { setAll(prevAll); alert('Failed to delete lead'); }
    if (current && current.id===id) { setDrawerOpen(false); setCurrent(null); }
  };

  const filtered = useMemo(()=>{
    let rows = [...all];
    if (q) {
      const s = q.toLowerCase();
      rows = rows.filter(r => [r.name, r.email, r.company].some(v => (v||'').toLowerCase().includes(s)));
    }
    if (status) rows = rows.filter(r => r.status === status);
    if (type) rows = rows.filter(r => r.type === type);
    // Hide Dealer applications from Leads by default; they are managed in Dealers screen
    if (!type) rows = rows.filter(r => r.type !== 'Dealer');
    if (dealerUploadsOnly) rows = rows.filter(r => Array.isArray(r.tags) && r.tags.includes('dealer_upload'));
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    if (fromDate) rows = rows.filter(r => new Date(r.createdAt) >= fromDate);
    if (toDate) { toDate.setHours(23,59,59,999); rows = rows.filter(r => new Date(r.createdAt) <= toDate); }
    return rows;
  }, [all, q, status, type, from, to]);

  const columns = [
    { key:'name', header:'Name' },
    { key:'email', header:'Email' },
    { key:'company', header:'Company' },
    { key:'type', header:'Type' },
    { key:'tags', header:'Tags', render:(r:Lead)=> (
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {(r.tags||[]).map((t,i)=> <span key={i} style={{ padding:'2px 6px', borderRadius:999, background:'rgba(255,255,255,0.06)', border:'1px solid #334', fontSize:12 }}>{t}</span>)}
        {(!r.tags||r.tags.length===0) && <span style={{ color:'#7a8a9a' }}>—</span>}
      </div>
    ) },
    { key:'status', header:'Status', render:(r:Lead)=> (
      <div style={{ position:'relative' }}>
        <button onClick={(e)=> { e.stopPropagation(); setStatusMenuFor(p => p===r.id? null : r.id); }}
          style={{ padding:'4px 8px', borderRadius:999, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <StatusBadge status={r.status}/>
        </button>
        {statusMenuFor===r.id && (
          <div style={{ position:'absolute', top:'110%', left:0, background:'#0E1621', border:'1px solid #223', borderRadius:8, padding:6, display:'grid', gap:4, zIndex:10 }}>
            {(['In Review','Qualified','Closed'] as LeadStatus[]).map(opt => (
              <button key={opt} onClick={(e)=> { e.stopPropagation(); changeStatus(r.id, opt); setStatusMenuFor(null); }}
                style={{ textAlign:'left', padding:'6px 8px', borderRadius:6, border:'1px solid #233140', background: r.status===opt?'#132030':'#0B1117', color:'#E6E6E6' }}>{opt}</button>
            ))}
          </div>
        )}
      </div>
    ) },
    { key:'createdAt', header:'Created' },
    { key:'actions', header:'', render:(r:Lead)=> (
      <div style={{ display:'flex', gap:6 }}>
        <button onClick={(e)=> { e.stopPropagation(); setCurrent(r); setEditOpen(true); }} style={{ padding:'4px 8px', border:'1px solid #334', borderRadius:8 }}>Edit</button>
        <button onClick={(e)=> { e.stopPropagation(); const next = r.status==='New'?'In Review': r.status==='In Review'?'Qualified': r.status==='Qualified'?'Closed':'New'; changeStatus(r.id, next); }} style={{ padding:'4px 8px', border:'1px solid #334', borderRadius:8 }}>Status</button>
        {r.type==='Dealer' && r.status!=='Qualified' && (
          <button
            onClick={async (e)=> {
              e.stopPropagation();
              try {
                await api.post(`/leads/${r.id}/accept-dealer`);
                setAll(prev => prev.map(x => x.id===r.id ? { ...x, status: 'Qualified', tags: Array.from(new Set([...(x.tags||[]), 'accepted'])) } as any : x));
                alert('Dealer accepted. The user can now log in with email + phone.');
              } catch {
                alert('Failed to accept dealer');
              }
            }}
            style={{ padding:'4px 8px', border:'1px solid #334', borderRadius:8 }}
          >Accept Dealer</button>
        )}
        <button onClick={(e)=> { e.stopPropagation(); removeLead(r.id); }} style={{ padding:'4px 8px', border:'1px solid #334', borderRadius:8 }}>Delete</button>
      </div>
    ) },
  ] as const;

  const openRow = (row: Lead)=> { setCurrent(row); setDrawerOpen(true); };

  const exportCSV = ()=>{
    const blob = new Blob([toCSV(filtered)], { type:'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'leads.csv'; a.click(); URL.revokeObjectURL(url);
  };
  const bulkDelete = async ()=>{
    if (selectedIds.length === 0) return alert('Select rows first');
    if (!confirm(`Delete ${selectedIds.length} lead(s)?`)) return;
    const toRemove = [...selectedIds];
    const prevAll = all;
    setAll(prev => prev.filter(r => !toRemove.includes(r.id)));
    setSelectedIds([]);
    try { await api.post('/leads/bulk-delete', { ids: toRemove }); }
    catch { setAll(prevAll); alert('Failed to bulk delete'); }
  };

  const bulkChangeStatus = (next: LeadStatus)=>{
    if (selectedIds.length === 0) return alert('Select rows first');
    if (!confirm(`Change status to ${next} for ${selectedIds.length} leads?`)) return;
    setAll(prev => prev.map(r => selectedIds.includes(r.id) ? { ...r, status: next } : r));
    setSelectedIds([]);
    alert('Status updated');
  };

  const toolbar = (
    <div style={{ display:'flex', gap:8, alignItems:'end', flexWrap:'wrap' }}>
      <Input label="Search" value={q} onChange={(e)=> setQ(e.target.value)} placeholder="Name, email, company"/>
      <label style={{ display:'grid', gap:6 }}>
        <div style={{ fontSize:12, color:'#C5C6C7' }}>Status</div>
        <select value={status} onChange={(e)=> setStatus((e.target.value||'') as any)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <option value="">All</option>
          <option>New</option>
          <option>In Review</option>
          <option>Qualified</option>
          <option>Closed</option>
        </select>
      </label>
      <label style={{ display:'grid', gap:6 }}>
        <div style={{ fontSize:12, color:'#C5C6C7' }}>Type</div>
        <select value={type} onChange={(e)=> setType((e.target.value||'') as any)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <option value="">All</option>
          <option>Prototype</option>
          <option>Dealer</option>
          <option>Media</option>
          <option>Other</option>
        </select>
      </label>
      {/* <label style={{ display:'grid', gap:6 }}>
        <div style={{ fontSize:12, color:'#C5C6C7' }}>From</div>
        <input type="date" value={from} onChange={(e)=> setFrom(e.target.value)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
      </label>
      <label style={{ display:'grid', gap:6 }}>
        <div style={{ fontSize:12, color:'#C5C6C7' }}>To</div>
        <input type="date" value={to} onChange={(e)=> setTo(e.target.value)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
      </label> */}
      {/* <label style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>
        <input type="checkbox" checked={dealerUploadsOnly} onChange={(e)=> setDealerUploadsOnly(e.target.checked)} />
        <span>Dealer Uploads</span>
      </label> */}
      <Button onClick={exportCSV} variant="secondary">Export CSV</Button>
      <Button onClick={bulkDelete} variant="ghost">Delete Selected</Button>
      <Button onClick={()=> setCreateOpen(true)}>Add Lead</Button>
    </div>
  );

  const columnsWithSelect = [
    { key:'select', header:'', render:(r:Lead)=> (
      <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={(e)=> {
        setSelectedIds(ids => e.target.checked ? [...ids, r.id] : ids.filter(id => id !== r.id));
      }} />
    ) },
    ...columns
  ];

  return (
    <div style={{ display:'grid', gap:12 }}>
      <h1>Leads</h1>
      <DataTable<any> columns={columnsWithSelect as any} rows={filtered} toolbar={toolbar} density="compact" onRowClick={openRow} />

      {/* Lead Drawer */}
      <Drawer open={drawerOpen} onClose={()=> setDrawerOpen(false)} title={current? `${current.name}` : 'Lead'}>
        {current ? (
          <div style={{ display:'grid', gap:8 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <StatusBadge status={current.status} />
              <select value={current.owner||'Unassigned'} onChange={(e)=> setAll(prev => prev.map(x => x.id===current.id ? { ...x, owner: e.target.value } : x))}>
                <option>Unassigned</option>
                <option>Admin</option>
                <option>Marketing</option>
              </select>
            </div>
            <div>Email: {current.email}</div>
            <div>Phone: {current.phone||'—'}</div>
            <div>Company: {current.company||'—'}</div>
            <div>Country: {current.country||'—'}</div>
            <div>Type: {current.type}</div>
            <div>Message: {current.message||'—'}</div>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <Button onClick={()=> setEditOpen(true)}>Edit</Button>
              <Button variant="secondary" onClick={()=> changeStatus(current.id, current.status==='New'?'In Review':'Qualified')}>Change Status</Button>
              <Button variant="ghost" onClick={()=> { if (confirm('Delete lead?')) { setAll(prev => prev.filter(x => x.id !== current.id)); setDrawerOpen(false); } }}>Delete</Button>
            </div>
            <hr style={{ borderColor:'#223' }}/>
            <strong>Timeline</strong>
            <ul>
              <li>Created • {current.createdAt}</li>
              <li>Status: {current.status}</li>
            </ul>
          </div>
        ) : 'No lead selected'}
      </Drawer>

      {/* Edit/Create Modal */}
      {editOpen && current && (
        <EditLeadModal initial={current} onClose={()=> setEditOpen(false)} onSave={async (val)=>{
          const id = current.id;
          const prevAll = all;
          setAll(prev => prev.map(x => x.id===id ? { ...x, ...val } : x));
          try { await api.patch(`/leads/${id}`, val); }
          catch { setAll(prevAll); alert('Failed to save'); }
          setEditOpen(false);
        }}/>
      )}
      {createOpen && (
        <CreateLeadModal onClose={()=> setCreateOpen(false)} onCreate={async (val)=>{
          try {
            const created = await api.post<Lead>('/leads', val);
            setAll(prev => [created as any, ...prev]);
          } catch {
            alert('Failed to create lead');
          } finally {
            setCreateOpen(false);
          }
        }}/>
      )}
    </div>
  );
}

function EditLeadModal({ initial, onClose, onSave }:{ initial: Lead; onClose: ()=>void; onSave: (val: z.infer<typeof schema>)=>void }){
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial.name,
      email: initial.email,
      phone: initial.phone,
      company: initial.company,
      country: initial.country,
      type: initial.type,
      message: initial.message,
      tags: initial.tags||[],
      status: initial.status,
      owner: initial.owner,
    }
  });

  const onSubmit = (vals: z.infer<typeof schema>)=> onSave(vals);

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center', zIndex:50 }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ background:'#0E1621', border:'1px solid #223', borderRadius:12, width:640, maxWidth:'96vw', padding:16, display:'grid', gap:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong>Edit Lead</strong>
          <button type="button" onClick={onClose} style={{ background:'transparent', border:'1px solid #334', borderRadius:8, color:'#C5C6C7', padding:'6px 10px' }}>Close</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:10 }}>
          <label>Name<InputField reg={register('name')} error={errors.name?.message}/></label>
          <label>Email<InputField type="email" reg={register('email')} error={errors.email?.message}/></label>
          <label>Phone<InputField reg={register('phone')}/></label>
          <label>Company<InputField reg={register('company')}/></label>
          <label>Country<InputField reg={register('country')}/></label>
          <label>Type<select {...register('type')}>
            <option>Prototype</option>
            <option>Dealer</option>
            <option>Media</option>
            <option>Other</option>
          </select></label>
          <label>Status<select {...register('status')}>
            <option>New</option>
            <option>In Review</option>
            <option>Qualified</option>
            <option>Closed</option>
          </select></label>
          <label>Owner<select {...register('owner')}>
            <option>Unassigned</option>
            <option>Admin</option>
            <option>Marketing</option>
          </select></label>
          <label style={{ gridColumn:'1 / -1' }}>Message<textarea rows={4} {...register('message')} /></label>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8 }}>Cancel</button>
          <button disabled={isSubmitting} type="submit" style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8, background:'var(--accent)', color:'#fff' }}>Save</button>
        </div>
      </form>
    </div>
  );
}

function CreateLeadModal({ onClose, onCreate }:{ onClose: ()=>void; onCreate: (val: z.infer<typeof schema>)=>void }){
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      country: '',
      type: 'Prototype',
      message: '',
      tags: [],
      status: 'New',
      owner: 'Unassigned',
    } as any,
  });
  const onSubmit = (vals: z.infer<typeof schema>)=> onCreate(vals);
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center', zIndex:50 }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ background:'#0E1621', border:'1px solid #223', borderRadius:12, width:640, maxWidth:'96vw', padding:16, display:'grid', gap:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong>Create Lead</strong>
          <button type="button" onClick={onClose} style={{ background:'transparent', border:'1px solid #334', borderRadius:8, color:'#C5C6C7', padding:'6px 10px' }}>Close</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:10 }}>
          <label>Name<InputField reg={register('name')} error={errors.name?.message}/></label>
          <label>Email<InputField type="email" reg={register('email')} error={errors.email?.message}/></label>
          <label>Phone<InputField reg={register('phone')}/></label>
          <label>Company<InputField reg={register('company')}/></label>
          <label>Country<InputField reg={register('country')}/></label>
          <label>Type<select {...register('type')}>
            <option>Prototype</option>
            <option>Dealer</option>
            <option>Media</option>
            <option>Other</option>
          </select></label>
          <label>Status<select {...register('status')}>
            <option>New</option>
            <option>In Review</option>
            <option>Qualified</option>
            <option>Closed</option>
          </select></label>
          <label>Owner<select {...register('owner')}>
            <option>Unassigned</option>
            <option>Admin</option>
            <option>Marketing</option>
          </select></label>
          <label style={{ gridColumn:'1 / -1' }}>Message<textarea rows={4} {...register('message')} /></label>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8 }}>Cancel</button>
          <button disabled={isSubmitting} type="submit" style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8, background:'var(--accent)', color:'#fff' }}>Create</button>
        </div>
      </form>
    </div>
  );
}

function InputField({ reg, error, type='text' }:{ reg: any; error?: string; type?: string }){
  return (
    <>
      <input type={type} {...reg} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(error?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />
      {error && <div style={{ color:'#FF6B6B', fontSize:12 }}>{error}</div>}
    </>
  );
}
