import { useMemo, useState, useEffect } from 'react';
import DataTable from '../../../components/ui/DataTable';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../../lib/api';

type Product = {
  id: string;
  name: string;
  code?: string;
  variant?: 'Clear'|'Pro'|'Ultra Max'|'Shadow';
  short?: string;
  long?: string;
  bullets?: string;
  nij?: string; thickness?: string; vlt?: string; impact?: string;
  images?: string[]; datasheet?: string;
  slug: string; metaTitle?: string; metaDesc?: string;
  status: 'Draft'|'Live'|'Archived';
  updated: string;
};

type Page = { id:string; title:string; section?: string; content?: string; attachments?: string; slug:string; metaTitle?:string; metaDesc?:string; status:'Draft'|'Live'|'Archived'; updated:string; meta?: { type?: string; datetime?: string; mode?: 'Online'|'On-site'; location?: string } };

const slugRegex = /^[a-z0-9-]+$/;
const productSchema = z.object({
  name: z.string().min(1,'Name required'),
  variant: z.enum(['Clear','Pro','Ultra Max','Shadow']),
  slug: z.string().regex(slugRegex,'Use a-z 0-9 - only'),
  status: z.enum(['Draft','Live','Archived']),
  // Single optional field only
  images: z.string().optional(),
});

const pageSchema = z.object({
  title: z.string().min(1,'Title required'),
  section: z.string().optional(),
  content: z.string().min(1,'Content is required'),
  attachments: z.string().optional(),
  slug: z.string().regex(slugRegex,'Use a-z 0-9 - only'),
  metaTitle: z.string().max(120).optional(),
  metaDesc: z.string().max(160).optional(),
  status: z.enum(['Draft','Live','Archived']),
  // Training meta
  isTraining: z.boolean().optional(),
  datetime: z.string().optional(),
  mode: z.enum(['Online','On-site']).optional(),
  location: z.string().optional(),
});

const seedProducts: Product[] = [];
const seedPages: Page[] = [];

export default function Content(){
  const [tab, setTab] = useState<'products'|'trainings'>('trainings');
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [pages, setPages] = useState<Page[]>(seedPages);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState<'Draft'|'Live'|'Archived'|''>('');
  const [modal, setModal] = useState<{ type:'product'|'page'; id?:string; training?: boolean }|null>(null);

  const filteredProducts = useMemo(()=>{
    let list = [...products];
    if (q) list = list.filter(r => [r.name, r.code, r.slug].some(v => (v||'').toLowerCase().includes(q.toLowerCase())));
    if (status) list = list.filter(r => r.status === status);
    return list;
  }, [products, q, status]);

  // Load products from backend
  useEffect(()=>{
    const load = async ()=>{
      try{
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (status) params.set('status', status);
        const res = await api.get<any>(`/products${params.toString()? ('?'+params.toString()): ''}`);
        const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
        if (Array.isArray(items)){
          const mapped: Product[] = items.map((p:any)=> ({
            id: String(p.id ?? p.slug),
            name: p.name,
            code: p.code,
            variant: p.variant,
            short: p.short,
            long: p.long,
            bullets: p.bullets,
            nij: p.nij, thickness: p.thickness, vlt: p.vlt, impact: p.impact,
            images: Array.isArray(p.images)? p.images : [],
            datasheet: p.datasheet,
            slug: p.slug,
            metaTitle: p.metaTitle,
            metaDesc: p.metaDesc,
            status: p.status as any,
            updated: (p.updatedAt || p.createdAt || new Date().toISOString()).slice(0,10),
          }));
          setProducts(mapped);
        }
      } catch {/* keep empty when error */}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status]);

  // Pages list is kept internally to derive trainings but not shown as a separate tab

  const filteredTrainings = useMemo(()=>{
    let list = pages.filter(p => (p.meta?.type||'') === 'training');
    if (q) list = list.filter(r => [r.title, r.slug].some(v => (v||'').toLowerCase().includes(q.toLowerCase())));
    if (status) list = list.filter(r => r.status === status);
    return list;
  }, [pages, q, status]);

  // Load pages from backend
  useEffect(()=>{
    const load = async ()=>{
      try {
        const params = new URLSearchParams();
        if (status) params.set('status', status === 'Live' ? 'published' : status === 'Draft' ? 'draft' : '');
        const res = await api.get<any>(`/content/pages${params.toString()? ('?'+params.toString()): ''}`);
        const items = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
        if (Array.isArray(items)){
          const mapped: Page[] = items.map((p: any) => ({
            id: String(p.id ?? p.slug),
            title: p.title,
            slug: p.slug,
            content: p.body,
            status: (p.status === 'published' ? 'Live' : 'Draft') as any,
            meta: p.meta || {},
            updated: (p.updatedAt || p.createdAt || new Date().toISOString()).slice(0,10),
          }));
          setPages(mapped);
        }
      } catch {/* keep empty when error */}
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const productColumns = [
    { key:'name', header:'Name' },
    { key:'variant', header:'Variant' },
    { key:'status', header:'Status' },
    { key:'updated', header:'Updated' },
  ] as const;

  const pageColumns = [
    { key:'title', header:'Title' },
    { key:'section', header:'Section' },
    { key:'status', header:'Status' },
    { key:'updated', header:'Updated' },
  ] as const;

  const toolbar = (
    <div style={{ display:'flex', alignItems:'end', justifyContent:'space-between', gap:12, flexWrap:'wrap', padding:12, borderBottom:'1px solid #223', background:'#0E1621' }}>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:6 }}>
          <button onClick={()=> setTab('products')} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #334', background: tab==='products'?'#1a2633':'#0B1117', color: tab==='products'?'#fff':'#E6E6E6' }}>Products</button>
          <button onClick={()=> setTab('trainings')} style={{ padding:'6px 10px', borderRadius:8, border:'1px solid #334', background: tab==='trainings'?'#1a2633':'#0B1117', color: tab==='trainings'?'#fff':'#E6E6E6' }}>Trainings</button>
        </div>
        <Input label="Search" value={q} onChange={(e)=> setQ(e.target.value)} />
        <label style={{ display:'grid', gap:6 }}>
          <div style={{ fontSize:12, color:'#C5C6C7' }}>Status</div>
          <select value={status} onChange={(e)=> setStatus((e.target.value||'') as any)} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
            <option value="">All</option>
            <option>Draft</option>
            <option>Live</option>
            <option>Archived</option>
          </select>
        </label>
      </div>
      <div>
        <div style={{ display:'flex', gap:8 }}>
          <Button onClick={()=> setModal({ type:'product' })} style={{ opacity: tab==='products'?1:0.85, outline: tab==='products'?'2px solid var(--accent)':'none' }}>Add Product</Button>
          <Button onClick={()=> setModal({ type:'page', training:true })} style={{ opacity: tab==='trainings'?1:0.85, outline: tab==='trainings'?'2px solid var(--accent)':'none' }}>Add Training</Button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display:'grid', gap:12 }}>
      <h1>Content</h1>
      <div style={{ border:'1px solid #223', borderRadius:12, overflow:'hidden', background:'#0E1621' }}>
        {toolbar}
        <div style={{ padding:12 }}>
          {tab==='products' ? (
            <DataTable<Product> columns={productColumns as any} rows={filteredProducts} density="compact" onRowClick={(r)=> setModal({ type:'product', id:r.id })} />
          ) : (
            <DataTable<Page> columns={pageColumns as any} rows={filteredTrainings} density="compact" onRowClick={(r)=> setModal({ type:'page', id:r.id, training:true })} />
          )}
        </div>
      </div>

      {modal?.type==='product' && (
        <ProductModal
          initial={products.find(p=> p.id===modal.id)}
          onClose={()=> setModal(null)}
          onSave={async (val)=>{
            const transformed = { ...val, images: val.images ? val.images.split(',').map(s=>s.trim()).filter(Boolean) : [] } as any;
            if (modal?.id){
              // optimistic update
              setProducts(prev => prev.map(p => p.id===modal.id ? { ...p, ...transformed, updated:new Date().toISOString().slice(0,10) } : p));
              try { await api.patch(`/products/${modal.id}`, { ...transformed }); } catch {/* keep optimistic */}
            } else {
              try{
                const created = await api.post<any>('/products', { ...transformed });
                const mapped: Product = { id: String(created.id ?? created.slug ?? Date.now()), updated:new Date().toISOString().slice(0,10), ...transformed } as any;
                setProducts(prev => [ mapped, ...prev ]);
              } catch {
                alert('Failed to create product');
              }
            }
            setModal(null);
          }}
        />
      )}

      {modal?.type==='page' && (
        <PageModal
          initial={pages.find(p=> p.id===modal.id)}
          trainingDefault={modal?.training}
          onClose={()=> setModal(null)}
          onSave={async (val)=>{
            const mapStatus = (s: 'Draft'|'Live'|'Archived')=> s==='Live'?'published':'draft';
            const toISO = (v?: string)=>{
              if (!v) return undefined;
              const d = new Date(v);
              return isNaN(d.getTime()) ? undefined : d.toISOString();
            };
            const meta = (val as any).isTraining ? { type:'training', datetime: toISO((val as any).datetime), mode: (val as any).mode || undefined, location: (val as any).location || undefined } : {};
            if (modal?.id){
              // optimistic update
              setPages(prev => prev.map(p => p.id===modal.id ? { ...p, ...val, meta, updated:new Date().toISOString().slice(0,10) } : p));
              try { await api.patch(`/content/pages/${modal.id}`, { title: val.title, slug: val.slug, body: val.content, status: mapStatus(val.status), meta }); } catch {}
            } else {
              try {
                const created = await api.post<any>('/content/pages', { title: val.title, slug: val.slug, body: val.content, status: mapStatus(val.status), meta });
                const mapped: Page = { id: String(created.id ?? created.slug ?? Date.now()), title: val.title, slug: val.slug, content: val.content, status: val.status, updated: new Date().toISOString().slice(0,10), meta };
                setPages(prev => [ mapped, ...prev ]);
              } catch {
                alert('Failed to create page');
              }
            }
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

function ProductModal({ initial, onClose, onSave }:{ initial?: Product; onClose: ()=>void; onSave:(v:z.infer<typeof productSchema>)=>void }){
  const { register, handleSubmit, formState:{ errors, isSubmitting }, setValue, watch } = useForm<z.infer<typeof productSchema>>({ resolver: zodResolver(productSchema) as any, defaultValues: {
    name: initial?.name ?? '',
    variant: (initial?.variant ?? 'Clear') as any,
    slug: initial?.slug ?? '',
    status: (initial?.status ?? 'Draft') as any,
    images: initial ? (initial.images||[]).join(', ') : '',
  }});
  const submit: SubmitHandler<z.infer<typeof productSchema>> = (vals)=> onSave(vals as any);
  const [previews, setPreviews] = useState<string[]>(initial?.images || []);
  const imagesStr = watch('images');
  useEffect(()=>{
    const urls = (imagesStr||'').split(',').map(s=>s.trim()).filter(Boolean);
    setPreviews(urls);
  }, [imagesStr]);
  const onFiles = (files: FileList|null)=>{
    if (!files || files.length===0) return;
    const urls = Array.from(files).map(f => URL.createObjectURL(f));
    const merged = [...previews, ...urls];
    setPreviews(merged);
    setValue('images', merged.join(', '));
  };
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center', zIndex:60 }}>
      <form onSubmit={handleSubmit(submit as any)} style={{ background:'#0E1621', border:'1px solid #223', borderRadius:16, width:720, maxWidth:'96vw', padding:18, display:'grid', gap:12, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong style={{ fontSize:16 }}>{initial? 'Edit Product':'Create Product'}</strong>
          <button type="button" onClick={onClose} style={{ background:'transparent', border:'1px solid #334', borderRadius:8, color:'#C5C6C7', padding:'6px 10px' }}>Close</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:12 }}>
          <label style={{ gridColumn:'1 / span 2' }}>Name *
            <input {...register('name')} style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.name?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />
            {errors.name && <small style={{ color:'#FF6B6B' }}>{errors.name.message}</small>}
          </label>

          <label>Variant *
            <select {...register('variant')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
              <option>Clear</option>
              <option>Pro</option>
              <option>Ultra Max</option>
              <option>Shadow</option>
            </select>
          </label>

          <label>Slug *
            <input {...register('slug')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.slug?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />
            {errors.slug && <small style={{ color:'#FF6B6B' }}>{errors.slug.message}</small>}
          </label>

          <label>Status *
            <select {...register('status')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
              <option>Draft</option>
              <option>Live</option>
              <option>Archived</option>
            </select>
          </label>

          <div style={{ gridColumn:'1 / span 2', display:'grid', gap:8 }}>
            <label>Upload Images (Optional)
              <input type="file" accept="image/*" multiple onChange={(e)=> onFiles(e.target.files)} style={{ marginTop:6 }} />
            </label>
            {previews.length>0 && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {previews.map((src, i)=> (
                  <img key={i} src={src} alt="preview" style={{ width:72, height:72, objectFit:'cover', borderRadius:8, border:'1px solid #223' }} />
                ))}
              </div>
            )}
          </div>

          <label style={{ gridColumn:'1 / span 2' }}>Image URLs (comma separated) (Optional)
            <textarea rows={3} {...register('images')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
          </label>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8 }}>Cancel</button>
          <button disabled={isSubmitting} type="submit" style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8, background:'var(--accent)', color:'#fff' }}>{initial? 'Save':'Create'}</button>
        </div>
      </form>
    </div>
  );
}

function PageModal({ initial, onClose, onSave, trainingDefault }:{ initial?: Page; onClose: ()=>void; onSave:(v:z.infer<typeof pageSchema>)=>void; trainingDefault?: boolean }){
  // Helpers to convert between ISO and input[type=datetime-local]
  const toLocalInput = (iso?: string)=>{
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    const pad = (n:number)=> String(n).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const { register, handleSubmit, formState:{ errors, isSubmitting } } = useForm<z.infer<typeof pageSchema>>({ resolver: zodResolver(pageSchema) as any, defaultValues: {
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    status: (initial?.status ?? 'Draft') as any,
    isTraining: trainingDefault || ((initial?.meta?.type||'')==='training') || false,
    datetime: toLocalInput(initial?.meta?.datetime) || '',
    mode: (initial?.meta?.mode as any) || undefined,
    location: initial?.meta?.location || '',
  }});
  const submit: SubmitHandler<z.infer<typeof pageSchema>> = (vals)=> onSave(vals as any);
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'grid', placeItems:'center', zIndex:60 }}>
      <form onSubmit={handleSubmit(submit)} style={{ background:'#0E1621', border:'1px solid #223', borderRadius:16, width:640, maxWidth:'96vw', padding:18, display:'grid', gap:12, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong style={{ fontSize:16 }}>{initial? 'Edit Page':'Create Page'}</strong>
          <button type="button" onClick={onClose} style={{ background:'transparent', border:'1px solid #334', borderRadius:8, color:'#C5C6C7', padding:'6px 10px' }}>Close</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:10 }}>
          <label>Title *<input {...register('title')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.title?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />{errors.title && <small style={{ color:'#FF6B6B' }}>{errors.title.message}</small>}</label>
          <label>Slug *<input {...register('slug')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.slug?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />{errors.slug && <small style={{ color:'#FF6B6B' }}>{errors.slug.message}</small>}</label>
          <label>Status *<select {...register('status')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
            <option>Draft</option>
            <option>Live</option>
            <option>Archived</option>
          </select></label>
          <label>Content *
            <textarea rows={6} placeholder="Description/notes" {...register('content')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid '+(errors.content?'#AA2E2E':'#334'), background:'#0B1117', color:'#E6E6E6' }} />
            {errors.content && <small style={{ color:'#FF6B6B' }}>{(errors as any).content?.message||'Content is required'}</small>}
          </label>
          <div style={{ marginTop:4, paddingTop:8, borderTop:'1px dashed #244' }}>
            <label style={{ display:'flex', alignItems:'center', gap:8 }}>
              <input type="checkbox" {...register('isTraining')} /> <span>Is Training</span>
            </label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:10, marginTop:8 }}>
              <label>Date & Time
                <input type="datetime-local" step={60} {...register('datetime')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
              </label>
              <label>Mode
                <select {...register('mode')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
                  <option value="">Select</option>
                  <option>Online</option>
                  <option>On-site</option>
                </select>
              </label>
              <label style={{ gridColumn:'1 / -1' }}>Location
                <input placeholder="Zoom" {...register('location')} style={{ padding:'10px 12px', borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
              </label>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
          <button type="button" onClick={onClose} style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8 }}>Cancel</button>
          <button disabled={isSubmitting} type="submit" style={{ padding:'8px 12px', border:'1px solid #334', borderRadius:8, background:'var(--accent)', color:'#fff' }}>{initial? 'Save':'Create'}</button>
        </div>
      </form>
    </div>
  );
}
