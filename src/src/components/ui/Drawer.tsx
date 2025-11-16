import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  width?: number;
  children?: React.ReactNode;
};

export default function Drawer({ open, onClose, title, width = 420, children }: Props){
  useEffect(()=>{
    const onKey = (e: KeyboardEvent)=> { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return ()=> document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div aria-hidden={!open} style={{
      position:'fixed', inset:0, pointerEvents: open? 'auto':'none', zIndex:40,
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', opacity: open? 1: 0, transition:'opacity 150ms' }}/>
      {/* Panel */}
      <aside role="dialog" aria-modal="true" style={{
        position:'absolute', top:0, right:0, height:'100%', width, background:'#0E1621', borderLeft:'1px solid #223',
        transform: open? 'translateX(0)':'translateX(100%)', transition:'transform 200ms', display:'grid', gridTemplateRows:'auto 1fr'
      }}>
        <header style={{ padding:16, borderBottom:'1px solid #223', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <strong>{title}</strong>
          <button onClick={onClose} style={{ background:'transparent', border:'1px solid #334', color:'#C5C6C7', borderRadius:8, padding:'6px 10px' }}>Close</button>
        </header>
        <div style={{ padding:16, overflow:'auto' }}>
          {children}
        </div>
      </aside>
    </div>
  );
}
