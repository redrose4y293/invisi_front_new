import React, { useEffect, useState } from 'react';
import adminApi from '@/services/adminApi';
import { Download, Trash2, Upload, X, Check, FileText, FileVideo, FileImage, File } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Files(){
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Array<any>>([]);
  const [error, setError] = useState('');
  const [canManage, setCanManage] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name:'', type:'PDF' as 'PDF'|'Video'|'Image'|'Other', cat:'Marketing' as 'NDA'|'Spec'|'Report'|'Marketing', vis:'Public' as 'Public'|'Dealer'|'Admin', url:'', desc:'' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');

  const load = async ()=>{
    try{
      setError(''); setLoading(true);
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      if (catFilter) params.append('cat', catFilter);
      const res = await adminApi.get(`/files?${params.toString()}`);
      const data = (res as any)?.data || res || [];
      setItems((data.items || data) as any[]);
    }catch(e:any){ setError(e?.message||'Failed'); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ load(); },[typeFilter, catFilter]);
  useEffect(()=>{
    (async()=>{
      try {
        const me = await adminApi.get('/auth/me');
        const roles = (me as any)?.data?.roles || (me as any)?.roles || [];
        setCanManage(roles.includes('admin') || roles.includes('marketing'));
      } catch {}
    })();
  },[]);

  const onUpload = async (e: React.FormEvent)=>{
    e.preventDefault();
    if (!form.name || !selectedFile) {
      toast.error('Please provide a file name and select a file');
      return;
    }
    try{
      setUploading(true);
      
      // Convert file to base64 data URL
      const reader = new FileReader();
      const fileUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
      
      // Create file record with data URL
      await adminApi.post('/files', { ...form, url: fileUrl });
      
      setForm({ name:'', type:'PDF', cat:'Marketing', vis:'Public', url:'', desc:'' });
      setSelectedFile(null);
      setUploadOpen(false);
      toast.success('File uploaded successfully!');
      await load();
    }catch(e:any){ 
      setError(e?.response?.data?.error || e?.message || 'Upload failed');
      toast.error(e?.response?.data?.error || e?.message || 'Upload failed');
    }
    finally{ setUploading(false); }
  };

  const onDelete = async (file: any)=>{
    if (!canManage) return;
    if (!confirm(`Delete ${file.name}?`)) return;
    try{
      setDeletingId(String(file.id));
      await adminApi.delete(`/files/${file.id}`);
      await load();
    }catch(e:any){ setError(e?.response?.data?.error || e?.message || 'Delete failed'); }
    finally{ setDeletingId(null); }
  };

  const onDownload = async (file: any) => {
    try {
      const url = `/files/${file.id}/download`;
      const response = await adminApi.get(url, { 
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', file.name || 'download');
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      
      toast.success('Download started!', { autoClose: 2000 });
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error?.response?.data?.error || 'Download failed', { autoClose: 3000 });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'pdf': return <FileText className="text-red-500" size={18} />;
      case 'video': return <FileVideo className="text-blue-400" size={18} />;
      case 'image': return <FileImage className="text-green-400" size={18} />;
      default: return <File className="text-gray-400" size={18} />;
    }
  };

  const formatSize = (bytes: any) => {
    if (!bytes || bytes === '-') return '—';
    const num = Number(bytes);
    if (isNaN(num)) return '—';
    if (num < 1024) return `${num} B`;
    if (num < 1024*1024) return `${(num/1024).toFixed(1)} KB`;
    return `${(num/(1024*1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ display:'grid', gap:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ margin:0 }}>Files</h2>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <label style={{ fontSize:12, opacity:.8 }}>Type:</label>
          <select value={typeFilter} onChange={(e)=> setTypeFilter(e.target.value)} style={{ padding:6, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
            <option value="">All</option>
            <option value="PDF">PDF</option>
            <option value="Video">Video</option>
            <option value="Image">Image</option>
            <option value="Other">Other</option>
          </select>
          <label style={{ fontSize:12, opacity:.8 }}>Category:</label>
          <select value={catFilter} onChange={(e)=> setCatFilter(e.target.value)} style={{ padding:6, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
            <option value="">All</option>
            <option value="NDA">NDA</option>
            <option value="Spec">Spec</option>
            <option value="Report">Report</option>
            <option value="Marketing">Marketing</option>
          </select>
          <button onClick={load} style={{ padding:'8px 10px', border:'1px solid #334', borderRadius:8 }}>Refresh</button>
          {canManage && (
            <button 
              onClick={() => setUploadOpen(true)} 
              style={{
                padding: '8px 16px',
                border: '1px solid #1e40af',
                background: '#1e40af',
                color: 'white',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
                cursor: 'pointer',
                fontWeight: 500
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              <Upload size={16} /> 
              <span>Add File</span>
            </button>
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
      <div style={{ border:'1px solid #ffffff', borderRadius:10, overflow:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', minWidth:680 }}>
          <thead>
            <tr>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #ffffff' }}>Name</th>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #ffffff' }}>Type</th>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #ffffff' }}>Category</th>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #ffffff' }}>Visibility</th>
              <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #ffffff' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({length:6}).map((_,i)=> (
                <tr key={i}><td colSpan={5} style={{ padding:12, opacity:0.6 }}>Loading…</td></tr>
              ))
            ) : items.length ? (
              items.map((f:any, idx:number)=> (
                <tr key={(f.id||idx)} className="row-anim">
                  <td style={{ padding:10, borderBottom:'1px solid #ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{getFileIcon(f.type)}</span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }} title={f.name}>
                      {f.name || 'File'}
                    </span>
                  </td>
                  <td style={{ padding:10, borderBottom:'1px solid #ffffff' }}>
                    <span style={{ fontSize:12, padding:'3px 8px', borderRadius:999, border:'1px solid #2a3a4d' }}>{f.type || '—'}</span>
                  </td>
                  <td style={{ padding:10, borderBottom:'1px solid #ffffff' }}>{f.cat || '—'}</td>
                  <td style={{ padding:10, borderBottom:'1px solid #ffffff' }}>{f.vis || '—'}</td>
                  <td style={{ padding:10, borderBottom:'1px solid #ffffff' }}>
                    <button 
                      onClick={() => onDownload(f)}
                      style={{
                        marginRight: 8,
                        padding: '6px 10px',
                        border: '1px solid #334',
                        borderRadius: 8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        transition: 'all 0.2s',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                      title="Download file"
                    >
                      <Download size={16} />
                      <span style={{ fontSize: '0.8em' }}>Download</span>
                    </button>
                    {canManage && (
                      <button 
                        onClick={() => onDelete(f)} 
                        disabled={deletingId===String(f.id)}
                        style={{
                          padding: '6px 10px',
                          border: '1px solid #5a2323',
                          background: deletingId===String(f.id) ? '#3a1a1d' : '#231012',
                          color: '#ff6b6b',
                          borderRadius: 8,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          opacity: deletingId===String(f.id) ? 0.7 : 1
                        }}
                        onMouseOver={(e) => {
                          if (deletingId!==String(f.id)) {
                            e.currentTarget.style.background = '#3a1a1d';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (deletingId!==String(f.id)) {
                            e.currentTarget.style.background = '#231012';
                          }
                        }}
                        title="Delete file"
                      >
                        <Trash2 size={16} />
                        <span style={{ fontSize: '0.8em' }}>
                          {deletingId===String(f.id) ? 'Deleting…' : 'Delete'}
                        </span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} style={{ padding:12, textAlign:'center', color:'#9aa4af' }}>No files found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {uploadOpen && (
        <div role="dialog" aria-modal onClick={()=> setUploadOpen(false)} className="modal-backdrop" style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'grid', placeItems:'center', zIndex:50 }}>
          <div onClick={(e)=> e.stopPropagation()} className="modal-card" style={{ width:'min(640px, 92vw)', background:'#0B121B', border:'1px solid #223', borderRadius:14, padding:16, boxShadow:'0 20px 60px rgba(0,0,0,0.45)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
              <h3 style={{ margin:0 }}>Add File</h3>
              <button onClick={()=> setUploadOpen(false)} style={{ padding:'6px 10px', border:'1px solid #334', borderRadius:8 }}>Close</button>
            </div>
            <form onSubmit={onUpload} style={{ display:'grid', gap:10 }}>
              <div style={{ display:'grid', gap:10, gridTemplateColumns:'1fr 1fr' }}>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>File Name</span>
                  <input value={form.name} onChange={e=> setForm(s=>({...s, name:e.target.value}))} required style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
                </label>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Type</span>
                  <select value={form.type} onChange={e=> setForm(s=>({...s, type:e.target.value as any}))} style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
                    <option value="PDF">PDF</option>
                    <option value="Video">Video</option>
                    <option value="Image">Image</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Category</span>
                  <select value={form.cat} onChange={e=> setForm(s=>({...s, cat:e.target.value as any}))} style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
                    <option value="NDA">NDA</option>
                    <option value="Spec">Spec</option>
                    <option value="Report">Report</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </label>
                <label style={{ display:'grid', gap:6 }}>
                  <span style={{ fontSize:12, opacity:.8 }}>Visibility</span>
                  <select value={form.vis} onChange={e=> setForm(s=>({...s, vis:e.target.value as any}))} style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }}>
                    <option value="Public">Public</option>
                    <option value="Dealer">Dealer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </label>
              </div>
              <label style={{ display:'grid', gap:6 }}>
                <span style={{ fontSize:12, opacity:.8 }}>Upload File</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input 
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        if (!form.name) {
                          setForm(s => ({ ...s, name: file.name }));
                        }
                      }
                    }}
                    required
                    style={{ 
                      flex: 1,
                      padding: '10px 12px', 
                      borderRadius: 8, 
                      border: '1px solid #334', 
                      background: '#0B1117', 
                      color: '#E6E6E6',
                      fontSize: '0.95em',
                      cursor: 'pointer'
                    }} 
                  />
                  {selectedFile && (
                    <button 
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        borderRadius: '50%',
                        transition: 'all 0.2s'
                      }}
                      title="Clear file"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                {selectedFile && (
                  <span style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                )}
              </label>
              <label style={{ display:'grid', gap:6 }}>
                <span style={{ fontSize:12, opacity:.8 }}>Description (optional)</span>
                <textarea value={form.desc} onChange={e=> setForm(s=>({...s, desc:e.target.value}))} rows={3} style={{ padding:10, borderRadius:8, border:'1px solid #334', background:'#0B1117', color:'#E6E6E6' }} />
              </label>
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                <button 
                type="button" 
                onClick={() => setUploadOpen(false)} 
                style={{ 
                  padding: '8px 16px', 
                  border: '1px solid #334', 
                  borderRadius: 8,
                  background: 'transparent',
                  color: '#e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.currentTarget.background = 'transparent'}
              >
                Cancel
              </button>
              <button 
                disabled={uploading} 
                type="submit" 
                style={{ 
                  padding: '8px 20px', 
                  border: '1px solid #1e40af', 
                  borderRadius: 8, 
                  background: '#1e40af',
                  color: 'white',
                  fontWeight: 500,
                  cursor: uploading ? 'not-allowed' : 'pointer',
                  opacity: uploading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => !uploading && (e.currentTarget.style.opacity = '0.9')}
                onMouseOut={(e) => !uploading && (e.currentTarget.style.opacity = '1')}
              >
                {uploading ? (
                  <>
                    <span className="animate-spin" style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></span>
                    Adding…
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Add File</span>
                  </>
                )}
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
