import React, { useEffect, useState } from 'react';
import adminApi from '@/services/adminApi';
import { Pencil } from 'lucide-react';

export default function Content(){
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title:'', slug:'', body:'', status:'draft' as 'draft'|'published' });
  const [canManage, setCanManage] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ id?: string; title: string; slug: string; body: string; status: 'draft' | 'published' }>({ id: undefined, title: '', slug: '', body: '', status: 'draft' });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  const load = async ()=>{
    try{
      setError(''); setLoading(true);
      const res = await adminApi.get(`/content/pages?status=${statusFilter}`);
      const data = (res as any)?.data || res || [];
      setItems((data.items || data) as any[]);
    }catch(e:any){ setError(e?.message || 'Failed'); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ load(); },[statusFilter]);
  useEffect(()=>{
    (async()=>{
      try {
        const me = await adminApi.get('/auth/me');
        const roles = (me as any)?.data?.roles || (me as any)?.roles || [];
        setCanManage(roles.includes('admin') || roles.includes('marketing'));
      } catch {}
    })();
  },[]);

  const onCreate = async (e: React.FormEvent)=>{
    e.preventDefault();
    if (!form.title || !form.slug || !form.body) return;
    try{
      setCreating(true);
      await adminApi.post('/content/pages', { ...form });
      setForm({ title:'', slug:'', body:'', status:'draft' });
      await load();
      setModalOpen(false);
    }catch(e:any){ setError(e?.response?.data?.error || e?.message || 'Create failed'); }
    finally{ setCreating(false); }
  };

  const onEdit = async (e: React.FormEvent)=>{
    e.preventDefault();
    if (!editForm.title || !editForm.slug || !editForm.body) return;
    try{
      setCreating(true);
      await adminApi.patch(`/content/pages/${editForm.id}`, { ...editForm });
      setEditForm({ id: undefined, title: '', slug: '', body: '', status: 'draft' });
      await load();
      setEditModalOpen(false);
    }catch(e:any){ setError(e?.response?.data?.error || e?.message || 'Edit failed'); }
    finally{ setCreating(false); }
  };

  const toggleStatus = async (page: any)=>{
    try{
      const next = page.status === 'published' ? 'draft' : 'published';
      await adminApi.patch(`/content/pages/${page.id}`, { status: next });
      await load();
    }catch(e:any){ setError(e?.response?.data?.error || e?.message || 'Update failed'); }
  };

  const onDelete = async (page: any)=>{
    if (!canManage) return;
    if (!confirm('Delete this page?')) return;
    try{
      setDeletingId(String(page.id));
      await adminApi.delete(`/content/pages/${page.id}`);
      await load();
    }catch(e:any){ setError(e?.response?.data?.error || e?.message || 'Delete failed'); }
    finally{ setDeletingId(null); }
  };

  return (
    <div style={{ display:'grid', gap:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ margin:0 }}>Content Pages</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <label style={{ fontSize: 12, opacity: .8 }}>Filter:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'published' | 'draft')} style={{ padding: 6, borderRadius: 8, border: '1px solid #334', background: '#0B1117', color: '#E6E6E6' }}>
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button onClick={load} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Refresh</button>
          {canManage && (
            <button onClick={()=> setModalOpen(true)} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Add Page</button>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .row-anim { animation: fadeSlide 240ms ease both; }
        .row-anim:hover { background: rgba(26,115,232,0.05); }
        .modal-backdrop { animation: fadeSlide 180ms ease both; }
        .modal-card { animation: fadeSlide 220ms ease both; }
      `}</style>
      {error && <div style={{ color:'#FF6B6B' }}>{error}</div>}
      <div style={{ border:'1px solid #223', borderRadius:10, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:680 }}>
          <thead>
            <tr>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Title</th>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Slug</th>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Status</th>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Actions</th>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:6}).map((_,i)=> (
                <tr key={i}><td colSpan={5} style={{ padding:12, opacity:0.6 }}>Loading…</td></tr>
              ))
            ) : items.length ? (
              items.map((p:any, idx:number)=> (
                <tr key={(p.id||idx)} className="row-anim">
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{p.title || 'Untitled'}</td>
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{p.slug || '—'}</td>
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{p.status || 'draft'}</td>
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>
                    <button onClick={() => { setEditForm(p); setEditModalOpen(true); }} style={{ marginRight: 8, padding: '6px 10px', border: '1px solid #334', borderRadius: 8, display:'inline-flex', alignItems:'center', gap:4 }}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => toggleStatus(p)} style={{ padding: '6px 10px', border: '1px solid #334', borderRadius: 8 }}>
                      {p.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    {canManage && (
                      <button onClick={() => onDelete(p)} disabled={deletingId === String(p.id)} style={{ marginLeft: 8, padding: '6px 10px', border: '1px solid #5a2323', background: '#231012', color: '#ff6b6b', borderRadius: 8 }}>
                        {deletingId === String(p.id) ? 'Deleting…' : 'Delete'}
                      </button>
                    )}
                  </td>
                  <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{p.updatedAt || p.updated || '—'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ padding:12, textAlign:'center', color:'#9aa4af' }}>No pages found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div role="dialog" aria-modal onClick={()=> setModalOpen(false)} className="modal-backdrop" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'grid', placeItems:'center', zIndex:50 }}>
          <div onClick={(e)=> e.stopPropagation()} className="modal-card" style={{ width:'min(720px, 92vw)', background:'#0B121B', border:'1px solid #223', borderRadius:14, padding:16, boxShadow:'0 20px 60px rgba(0,0,0,0.45)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <h3 style={{ margin:0 }}>Add Content Page</h3>
              <button onClick={()=> setModalOpen(false)} style={{ padding:'6px 10px', border:'1px solid #334', borderRadius:8 }}>Close</button>
            </div>
            <form onSubmit={onCreate} style={{ display:'grid', gap:10 }}>
              <div style={{ display:'grid', gap:10, gridTemplateColumns:'1fr 1fr' }}>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Title</span>
                  <input value={form.title} onChange={e=> setForm(s=>({...s, title:e.target.value}))} required style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
                </label>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Slug</span>
                  <input value={form.slug} onChange={e=> setForm(s=>({...s, slug:e.target.value}))} required style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
                </label>
              </div>
              <label style={{ display:'grid', gap:6 }}>
                <span style={{ fontSize:12, opacity:.8 }}>Body</span>
                <textarea value={form.body} onChange={e=> setForm(s=>({...s, body:e.target.value}))} required rows={8} style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
              </label>
              <label style={{ display:'flex', gap:8, alignItems:'center' }}>
                <span style={{ fontSize:12, opacity:.8 }}>Published</span>
                <input type="checkbox" checked={form.status==='published'} onChange={(e)=> setForm(s=>({...s, status: e.target.checked? 'published':'draft' }))} />
              </label>
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                <button type="button" onClick={()=> setModalOpen(false)} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Cancel</button>
                <button disabled={creating} type="submit" style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>{creating? 'Creating…':'Create Page'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editModalOpen && (
        <div role="dialog" aria-modal onClick={() => setEditModalOpen(false)} className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} className="modal-card" style={{ width: 'min(720px, 92vw)', background: '#0B121B', border: '1px solid #223', borderRadius: 14, padding: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Edit Content Page</h3>
              <button onClick={() => setEditModalOpen(false)} style={{ padding: '6px 10px', border: '1px solid #334', borderRadius: 8 }}>Close</button>
            </div>
            <form onSubmit={onEdit} style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 12, opacity: .8 }}>Title</span>
                  <input value={editForm.title} onChange={e => setEditForm(s => ({ ...s, title: e.target.value }))} required style={{ padding: 10, borderRadius: 8, border: '1px solid #334', background: '#0B1117', color: '#E6E6E6' }} />
                </label>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontSize: 12, opacity: .8 }}>Slug</span>
                  <input value={editForm.slug} onChange={e => setEditForm(s => ({ ...s, slug: e.target.value }))} required style={{ padding: 10, borderRadius: 8, border: '1px solid #334', background: '#0B1117', color: '#E6E6E6' }} />
                </label>
              </div>
              <label style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 12, opacity: .8 }}>Body</span>
                <textarea value={editForm.body} onChange={e => setEditForm(s => ({ ...s, body: e.target.value }))} required rows={8} style={{ padding: 10, borderRadius: 8, border: '1px solid #334', background: '#0B1117', color: '#E6E6E6' }} />
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, opacity: .8 }}>Published</span>
                <input type="checkbox" checked={editForm.status === 'published'} onChange={(e) => setEditForm(s => ({ ...s, status: e.target.checked ? 'published' : 'draft' }))} />
              </label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setEditModalOpen(false)} style={{ padding: '8px 10px', border: '1px solid #334', borderRadius: 8 }}>Cancel</button>
                <button disabled={creating} type="submit" style={{ padding: '8px 10px', border: '1px solid #334', borderRadius: 8 }}>{creating ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
