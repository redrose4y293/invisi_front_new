import { useEffect, useMemo, useState } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import LockBadge from '../../../components/ui/LockBadge';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../../lib/api';

type Visibility = 'Public'|'Dealer'|'Admin';
type FileType = 'PDF'|'Video'|'Image'|'Other';
type Category = 'NDA'|'Spec'|'Report'|'Marketing';
type Item = { id:string; name:string; type:FileType; cat:Category; vis:Visibility; url:string; desc?:string; size?:string; updated:string };

const seed: Item[] = [];

const schema = z.object({
  name: z.string().min(1,'Name required'),
  type: z.enum(['PDF','Video','Image','Other']),
  cat: z.enum(['NDA','Spec','Report','Marketing']),
  vis: z.enum(['Public','Dealer','Admin']),
  url: z.string().url('Invalid URL'),
  desc: z.string().optional(),
});

function humanSize(bytes: number){
  const units = ['B','KB','MB','GB','TB'];
  let b = bytes; let i = 0;
  while (b >= 1024 && i < units.length-1){ b /= 1024; i++; }
  return `${b.toFixed(b>=10||i===0?0:1)}${units[i]}`;
}

export default function Files(){
  const [rows, setRows] = useState<Item[]>(seed);
  const [q, setQ] = useState('');
  const [type, setType] = useState<FileType|''>('');
  const [cat, setCat] = useState<Category|''>('');
  const [vis, setVis] = useState<Visibility|''>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<{ id?:string }|null>(null);

  // Load files from backend with filters
  useEffect(()=>{
    const load = async ()=>{
      try{
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (type) params.set('type', type);
        if (cat) params.set('cat', cat);
        if (vis) params.set('vis', vis);
        const res = await api.get<{ items: any[] }>(`/files?${params.toString()}`);
        if (Array.isArray(res?.items)) {
          const mapped = res.items.map((it: any) => ({
            id: String(it.id),
            name: it.name,
            type: it.type,
            cat: it.cat,
            vis: it.vis,
            url: it.url,
            desc: it.desc,
            size: typeof it.size === 'number' && it.size > 0 ? humanSize(it.size) : (it.size || '-'),
            updated: (it.updatedAt || it.createdAt || new Date().toISOString()).slice(0,10),
          })) as Item[];
          setRows(mapped);
        }
      }catch{}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, type, cat, vis]);

  const filtered = useMemo(()=>{
    let list = [...rows];
    if (q) list = list.filter(r => [r.name, r.cat, r.type, r.vis].some(v => String(v).toLowerCase().includes(q.toLowerCase())));
    if (type) list = list.filter(r => r.type === type);
    if (cat) list = list.filter(r => r.cat === cat);
    if (vis) list = list.filter(r => r.vis === vis);
    return list;
  }, [rows, q, type, cat, vis]);

  const changeVisibility = async (to: Visibility)=>{
    if (selected.length === 0) return alert('Select rows first');
    const ids = [...selected];
    const prev = rows;
    setRows(prevRows => prevRows.map(r => ids.includes(r.id) ? { ...r, vis: to } : r));
    setSelected([]);
    try { await Promise.all(ids.map(id => api.patch(`/files/${id}`, { vis: to }))); }
    catch { setRows(prev); alert('Failed to update visibility'); }
  };
  const remove = async ()=>{
    if (selected.length === 0) return alert('Select rows first');
    if (!confirm(`Delete ${selected.length} file(s)?`)) return;
    const ids = [...selected];
    const prev = rows;
    setRows(prevRows => prevRows.filter(r => !ids.includes(r.id)));
    setSelected([]);
    try {
      if (ids.length===1) await api.del(`/files/${ids[0]}`);
      else await api.post('/files/bulk-delete', { ids });
    } catch { setRows(prev); alert('Failed to delete'); }
  };
  const copyLink = (url: string)=>{ navigator.clipboard.writeText(url); alert('Link copied'); };

  const columns = [
    { key:'name', header:'File Name' },
    { key:'type', header:'Type' },
    { key:'cat', header:'Category' },
    { key:'vis', header:'Visibility', render:(r:Item)=> <LockBadge access={r.vis==='Dealer'?'portal':(r.vis==='Admin'?'nda':'public')} /> },
    { key:'size', header:'Size' },
    { key:'updated', header:'Updated' },
    { key:'actions', header:'', render:(r:Item)=> (
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={(e)=> { e.stopPropagation(); setModal({ id:r.id }); }} style={{ padding:'4px 8px' }}>Edit</button>
        <button onClick={(e)=> { e.stopPropagation(); copyLink(r.url); }} style={{ padding:'4px 8px' }}>Copy Link</button>
        <button onClick={async (e)=> { e.stopPropagation(); if (!confirm('Delete file?')) return; const prev = rows; setRows(p=> p.filter(x => x.id!==r.id)); try{ await api.del(`/files/${r.id}`); } catch { setRows(prev); alert('Failed to delete'); } }} style={{ padding:'4px 8px' }}>Delete</button>
      </div>
    ) },
  ] as const;

  const columnsWithSelect = [
    { key:'select', header:'', render:(r:Item)=> (
      <input type="checkbox" checked={selected.includes(r.id)} onChange={(e)=> setSelected(ids => e.target.checked ? [...ids, r.id] : ids.filter(id => id !== r.id))} />
    ) },
    ...columns
  ];

  const toolbar = (
    <div style={{ display:'flex', alignItems:'end', justifyContent:'space-between', gap:12, flexWrap:'wrap', padding:12, borderBottom:'1px solid #223', background:'#0E1621' }}>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <Input label="Search" value={q} onChange={(e)=> setQ(e.target.value)} placeholder="Name, type, category" />
        <label style={{ display:'grid', gap:6 }}>
          <div style={{ fontSize:12, color:'#C5C6C7' }}>Type</div>
          <select value={type} onChange={(e)=> setType((e.target.value||'') as any)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
            <option value="">All</option>
            <option>PDF</option>
            <option>Video</option>
            <option>Image</option>
            <option>Other</option>
          </select>
        </label>
        <label style={{ display:'grid', gap:6 }}>
          <div style={{ fontSize:12, color:'#C5C6C7' }}>Category</div>
          <select value={cat} onChange={(e)=> setCat((e.target.value||'') as any)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
            <option value="">All</option>
            <option>NDA</option>
            <option>Spec</option>
            <option>Report</option>
            <option>Marketing</option>
          </select>
        </label>
        <label style={{ display:'grid', gap:6 }}>
          <div style={{ fontSize:12, color:'#C5C6C7' }}>Visibility</div>
          <select value={vis} onChange={(e)=> setVis((e.target.value||'') as any)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
            <option value="">All</option>
            <option>Public</option>
            <option>Dealer</option>
            <option>Admin</option>
          </select>
        </label>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <Button onClick={()=> setModal({})}>Add File</Button>
        <Button onClick={remove} variant="ghost">Delete</Button>
      </div>
    </div>
  );

  return (
    <div style={{ display:'grid', gap:12 }}>
      <h1>Files</h1>
      <DataTable<Item> columns={columnsWithSelect as any} rows={filtered} density="compact" toolbar={toolbar} onRowClick={(r)=> setModal({ id:r.id })} />

      {modal && (
        <FileModal
          initial={modal.id ? rows.find(r => r.id===modal.id) : undefined}
          onClose={()=> setModal(null)}
          onSave={async (val)=>{
            if (modal.id){
              const id = modal.id;
              const prev = rows;
              setRows(prevRows => prevRows.map(r => r.id===id ? { ...r, ...val, updated: new Date().toISOString().slice(0,10) } : r));
              try { await api.patch(`/files/${id}`, val); }
              catch { setRows(prev); alert('Failed to save'); }
            } else {
              try{
                const created = await api.post<any>('/files', val);
                const mapped: Item = {
                  id: String(created.id),
                  name: created.name,
                  type: created.type,
                  cat: created.cat,
                  vis: created.vis,
                  url: created.url,
                  desc: created.desc,
                  size: typeof created.size === 'number' && created.size > 0 ? humanSize(created.size) : (created.size || '-'),
                  updated: (created.updatedAt || created.createdAt || new Date().toISOString()).slice(0,10)
                };
                setRows(prevRows => [mapped, ...prevRows]);
              }catch{
                alert('Failed to create file');
              }
            }
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

function FileModal({ initial, onClose, onSave }:{ initial?: Item; onClose: ()=>void; onSave: (v:z.infer<typeof schema>)=>void }){
  const { register, handleSubmit, formState:{ errors, isSubmitting }, setValue, watch } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) as any, defaultValues: {
    name: initial?.name ?? '',
    type: (initial?.type ?? 'PDF') as any,
    cat: (initial?.cat ?? 'Spec') as any,
    vis: (initial?.vis ?? 'Public') as any,
    url: initial?.url ?? '',
    desc: initial?.desc ?? '',
  }});
  const submit: SubmitHandler<z.infer<typeof schema>> = (vals)=> {
    if (String(vals.url||'').startsWith('blob:')){
      alert('Please provide a real URL (https://...) or re-upload successfully. Blob URLs cannot be saved.');
      return;
    }
    onSave(vals as any);
  };
  const urlVal = watch('url');
  const isImage = urlVal?.match(/\.(png|jpg|jpeg|gif|webp)$/i) || urlVal.startsWith('blob:');
  const onFiles = async (files: FileList|null)=>{
    if (!files || files.length===0) return;
    const file = files[0];
    const contentType = file.type || 'application/octet-stream';
    try {
      const sig = await api.post<{ uploadUrl:string; objectKey:string }>(
        '/uploads/signed-url',
        { filename: file.name, contentType, size: file.size }
      );
      await fetch(sig.uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: file });
      const asset = await api.post<any>('/uploads/complete', { objectKey: (sig as any).objectKey, metadata: { contentType, size: file.size } });
      const finalUrl = asset?.publicUrl || '';
      if (finalUrl) setValue('url', finalUrl);
      const ext = (file.name.split('.').pop()||'').toLowerCase();
      const t = ext==='pdf'?'PDF': (['mp4','mov','webm'].includes(ext)? 'Video' : (['png','jpg','jpeg','gif','webp'].includes(ext)? 'Image':'Other'));
      setValue('type', t as any);
    } catch {
      alert('Upload failed. Please try again or paste a direct URL to a hosted file. Blob URLs cannot be used.');
      const ext = (file.name.split('.').pop()||'').toLowerCase();
      const t = ext==='pdf'?'PDF': (['mp4','mov','webm'].includes(ext)? 'Video' : (['png','jpg','jpeg','gif','webp'].includes(ext)? 'Image':'Other'));
      setValue('type', t as any);
    }
  };
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center', zIndex:60 }}>
      <form onSubmit={handleSubmit(submit as any)} style={{ background:'#0E1621', border:'1px solid #223', borderRadius:16, width:600, maxWidth:'96vw', padding:18, display:'grid', gap:12, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong style={{ fontSize:16 }}>{initial? 'Edit File':'Add File'}</strong>
          <button type="button" onClick={onClose} style={{ background:'transparent', border:'1px solid #334', borderRadius:8, color:'#C5C6C7', padding:'6px 10px' }}>Close</button>
        </div>
        <label>Name<input {...register('name')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.name?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />{errors.name && <small style={{ color:'#FF6B6B' }}>{errors.name.message}</small>}</label>
        <label>Type<select {...register('type')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <option>PDF</option>
          <option>Video</option>
          <option>Image</option>
          <option>Other</option>
        </select></label>
        <label>Category<select {...register('cat')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <option>NDA</option>
          <option>Spec</option>
          <option>Report</option>
          <option>Marketing</option>
        </select></label>
        <label>Visibility<select {...register('vis')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
          <option>Public</option>
          <option>Dealer</option>
          <option>Admin</option>
        </select></label>
        <div style={{ display:'grid', gap:8 }}>
          <label>Upload File
            <input type="file" onChange={(e)=> onFiles(e.target.files)} style={{ marginTop:6 }} />
          </label>
          {isImage ? (
            <div>
              <div style={{ fontSize:12, color:'#9aa4af', marginBottom:6 }}>Preview</div>
              <img src={urlVal} alt="preview" style={{ width:120, height:120, objectFit:'cover', borderRadius:8, border:'1px solid #223' }} />
            </div>
          ) : urlVal ? (
            <div style={{ fontSize:12, color:'#9aa4af' }}>URL set: {urlVal.slice(0,60)}{urlVal.length>60?'…':''}</div>
          ) : null}
        </div>
        <label>URL<input {...register('url')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.url?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />{errors.url && <small style={{ color:'#FF6B6B' }}>{errors.url.message}</small>}</label>
        <label>Description<textarea rows={3} {...register('desc')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} /></label>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8 }}>Cancel</button>
          <button disabled={isSubmitting} type="submit" style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8, background:'var(--accent)', color:'#fff' }}>{initial? 'Save':'Create'}</button>
        </div>
      </form>
    </div>
  );
}
