import React from 'react';

export default function LogoGrid({ logos }: { logos: { src: string; alt: string }[] }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, alignItems: 'center' }}>
        {logos.map((l, i) => (
          <div key={i} style={{ display: 'grid', placeItems: 'center', padding: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
            <img src={l.src} alt={l.alt} style={{ maxHeight: 42, objectFit: 'contain', filter: 'grayscale(100%) contrast(1.1)' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
