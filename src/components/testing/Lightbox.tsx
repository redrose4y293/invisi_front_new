import React from 'react';

export default function Lightbox({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div className="card" style={{ width: '90%', maxWidth: 960, padding: 0, overflow: 'hidden' }} onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
