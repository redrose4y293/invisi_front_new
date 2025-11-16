import React, { useState } from 'react';

export default function VideoLightbox({ src, thumbnail }: { src: string; thumbnail?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button className="card" style={{ padding: 8 }} onClick={() => setOpen(true)}>Play Video</button>
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'grid', placeItems: 'center' }} onClick={() => setOpen(false)}>
          <div style={{ width: '90%', maxWidth: 960 }}>
            <video src={src} controls style={{ width: '100%', background: '#000' }} />
          </div>
        </div>
      )}
    </div>
  );
}
