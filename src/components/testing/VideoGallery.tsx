import React, { useState } from 'react';
import Lightbox from '@/components/testing/Lightbox';

type Item = { thumb?: string; src: string; title?: string };

export default function VideoGallery({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        {items.map((v, i) => (
          <button key={i} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', textAlign: 'left' }} onClick={() => setOpen(i)}>
            {v.thumb ? (
              <img src={v.thumb} alt={v.title||'video'} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            ) : (
              <div style={{ height: 140, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.06)' }}>Coming soon...</div>
            )}
            <div style={{ padding: 10 }}>
              <div style={{ fontWeight: 600 }}>{v.title || 'Test Video'}</div>
            </div>
          </button>
        ))}
      </div>
      <Lightbox open={open!==null} onClose={() => setOpen(null)}>
        {open!==null ? (
          <video src={items[open].src} controls style={{ width: '100%', background: '#000' }} />
        ) : null}
      </Lightbox>
    </div>
  );
}
