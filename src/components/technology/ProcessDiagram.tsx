import React from 'react';

export default function ProcessDiagram() {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="auto-grid">
        {['Outer Coating','Transparent Armor','Adhesive Matrix','Inner Film'].map((label, i) => (
          <div key={i} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span aria-hidden style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--color-primary)' }} />
            <span style={{ fontWeight: 600 }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
