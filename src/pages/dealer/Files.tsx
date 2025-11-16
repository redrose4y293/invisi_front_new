import React, { useEffect, useMemo, useState } from 'react';
import { getDealerFiles } from '@/services/dealers';

export default function Files() {
  const [files, setFiles] = useState<Array<{ id: string; name: string; type: string; href: string; size: string; updatedAt: string }>>([]);
  const [q, setQ] = useState('');
  const [ftype, setFtype] = useState<'all' | 'pdf' | 'docx' | 'zip' | 'image'>('all');
  const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || '';

  const joinUrl = (base: string, path: string) => {
    if (!base) return path;
    if (base.endsWith('/') && path.startsWith('/')) return base + path.slice(1);
    if (!base.endsWith('/') && !path.startsWith('/')) return base + '/' + path;
    return base + path;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getDealerFiles();
        const payload = (res as any)?.data;
        const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.items) ? payload.items : []);
        if (mounted) setFiles(list);
      } catch {
        // Fallback demo data
        const demo = [
          { id: '1', name: 'Technical Specs', type: 'pdf', href: '/assets/docs/InvisiShield_Tech_Specs.pdf', size: '1.2 MB', updatedAt: 'Oct 15, 2025' },
          { id: '2', name: 'NDA Form', type: 'pdf', href: '/assets/docs/NDA_Form.pdf', size: '260 KB', updatedAt: 'Oct 05, 2025' },
          { id: '3', name: 'Product Images (ZIP)', type: 'zip', href: '/assets/assets_pack.zip', size: '24.7 MB', updatedAt: 'Sep 30, 2025' },
          { id: '4', name: 'Testing Report', type: 'pdf', href: '/assets/docs/InvisiShield_Testing_Report.pdf', size: '2.1 MB', updatedAt: 'Oct 10, 2025' },
          { id: '5', name: 'Marketing Brochure', type: 'docx', href: '/assets/docs/brochure.docx', size: '820 KB', updatedAt: 'Sep 12, 2025' },
          { id: '6', name: 'Hero Image', type: 'image', href: '/assets/logo/about.png', size: '340 KB', updatedAt: 'Aug 28, 2025' },
        ];
        if (mounted) setFiles(demo);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const isImageExt = (s: string) => /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(s);
    const normType = (f: typeof files[number]) => {
      const t = (f.type || '').toLowerCase();
      if (t === 'image' || isImageExt(f.href)) return 'image';
      if (t === 'doc' || t === 'docx') return 'docx';
      if (t === 'pdf') return 'pdf';
      if (t === 'zip') return 'zip';
      return t || 'other';
    };
    return files.filter(f => {
      const matchesQ = q.trim().length === 0 || f.name.toLowerCase().includes(q.toLowerCase());
      const t = normType(f);
      const matchesT = ftype === 'all' ? true : t === ftype;
      return matchesQ && matchesT;
    });
  }, [files, q, ftype]);

  async function triggerDownloadProxy(id: string, fallbackName?: string){
    const url = joinUrl(API_BASE, `/files/${encodeURIComponent(id)}/download`);
    try{
      const token = typeof window !== 'undefined' ? localStorage.getItem('dealer_token') : null;
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(url, { credentials: 'include', headers });
      if(!res.ok) throw new Error(`Download failed (${res.status})`);
      const disp = res.headers.get('content-disposition') || '';
      const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(disp || '');
      const headerName = decodeURIComponent((match?.[1] || match?.[2] || '').trim());
      const ct = res.headers.get('content-type') || '';
      // If API accidentally returns JSON error, don't save a bogus file
      if (ct.includes('application/json')) {
        const j = await res.json().catch(()=>({ error:'Download failed' }));
        throw new Error(j?.error || 'Download failed');
      }
      const blob = await res.blob();
      const a = document.createElement('a');
      const blobUrl = URL.createObjectURL(blob);
      a.href = blobUrl;
      let name = headerName || fallbackName || 'download';
      if (!/\.[a-z0-9]+$/i.test(name)) {
        // append extension based on content-type when missing
        const extMap: Record<string,string> = {
          'application/pdf': 'pdf',
          'application/zip': 'zip',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
          'application/msword': 'doc',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
          'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif'
        };
        const ext = Object.keys(extMap).find(k => ct.includes(k));
        if (ext) name += `.${extMap[ext]}`;
      }
      a.download = name;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    } catch (err: any) {
      if (err?.message?.includes('(401)')) {
        window.location.href = '/login';
        return;
      }
      // Fallback to direct navigation which lets the browser handle it
      const direct = joinUrl(API_BASE, `/files/${encodeURIComponent(id)}/download`);
      const a = document.createElement('a');
      a.href = direct;
      a.setAttribute('download', '');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  function iconFor(type: string) {
    const t = type.toLowerCase();
    const color = 'currentColor';
    if (t === 'pdf') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke={color} strokeWidth="1.8"/><path d="M14 2v6h6" stroke={color} strokeWidth="1.8"/></svg>
    );
    if (t === 'docx' || t === 'doc') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="2" width="18" height="20" rx="2" stroke={color} strokeWidth="1.8"/><path d="M7 8h10M7 12h10M7 16h6" stroke={color} strokeWidth="1.8"/></svg>
    );
    if (t === 'zip') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth="1.8"/><path d="M12 3v18M12 7h2M12 11h2M12 15h2" stroke={color} strokeWidth="1.8"/></svg>
    );
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8"/></svg>
    );
  }

  return (
    <div className="dealer-files-root">
      <style>{css}</style>
      <div className="wrap">
        <div className="bar">
          <h1 className="title">Download Center</h1>
          <div className="filters">
            <div className="search">
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search files..." />
            </div>
            <select value={ftype} onChange={e=>setFtype(e.target.value as any)}>
              <option value="all">All types</option>
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="zip">ZIP</option>
              <option value="image">Image</option>
            </select>
          </div>
        </div>

        <div className="grid">
          {filtered.map((f) => {
            return (
            <div key={f.id} className="tile card" onClick={()=> triggerDownloadProxy(f.id, f.name)} style={{ cursor:'pointer' }}>
              <div className="tile-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="tile-body">
                <div className="tile-title">{f.name}</div>
                <div className="tile-meta">{f.size} • Last updated {f.updatedAt}</div>
              </div>
              <button className="btn btn-download" aria-label={`Download ${f.name}`} onClick={(e)=> { e.stopPropagation(); triggerDownloadProxy(f.id, f.name); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 11l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>Download</span>
              </button>
            </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="empty">
              <div>No files match your filters.</div>
              <button className="btn" onClick={()=>{ setQ(''); setFtype('all'); }}>Clear filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const css = `
.dealer-files-root { padding: 12px 0; }
.wrap { width: 100%; margin: 0; padding: 0 18px; display: grid; gap: 16px; }
.title { margin: 0; font-size: 24px; font-weight: 900; line-height: 1.2; letter-spacing: .2px; }
.bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 10px 12px; background: linear-gradient(180deg, rgba(17,26,39,0.96), rgba(12,18,28,0.92)); border: 1px solid rgba(215,163,51,0.35); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.02); }
.filters { display: flex; align-items: center; gap: 10px; }
.search input { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 10px 12px; min-width: 280px; box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset; }
.filters select { background: #0b121b; border: 1px solid var(--color-border); color: var(--color-text); border-radius: 10px; padding: 10px 12px; }

.card { background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border: 1px solid var(--color-border); border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,0.35); }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; width: 100%; }
.tile { display: grid; grid-template-columns: 44px 1fr auto; gap: 12px; align-items: center; padding: 16px; color: var(--color-text); text-decoration: none; }
.tile-icon { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 12px; background: rgba(26,115,232,0.14); border: 1px solid rgba(26,115,232,0.35); color: #dbe8ff; }
.tile-title { font-weight: 700; }
.tile-meta { color: var(--color-text-dim); font-size: 12px; margin-top: 2px; }
.btn { padding: 10px 14px; border-radius: 12px; border: 1px solid var(--color-border); background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); }
.btn-download { display: inline-flex; align-items: center; gap: 8px; }

@media (max-width: 1024px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 900px) {
  .bar { position: sticky; top: 58px; z-index: 3; padding: 10px 12px; backdrop-filter: blur(6px); }
  .filters { width: 100%; flex-wrap: wrap; }
  .search { flex: 1; }
  .search input { min-width: 0; width: 100%; }
  .title { width: 100%; font-size: 22px; }
}
@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
  .tile { grid-template-columns: 40px 1fr; grid-template-areas: 'icon title' 'icon meta' 'action action'; row-gap: 8px; }
  .tile-icon { width: 40px; height: 40px; }
  .tile-body { grid-area: title; }
  .tile-meta { grid-area: meta; }
  .tile .btn { grid-area: action; justify-self: stretch; text-align: center; }
}
`;
