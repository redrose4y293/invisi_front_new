import React from 'react';

export default function Charts() {
  return (
    <div className="card" style={{ padding: 20, textAlign: 'center' }}>
      <h4 style={{ margin: '0 0 6px' }}>Testing Data</h4>
      <div style={{ color: 'var(--color-text-dim)', fontSize: 13, marginBottom: 12 }}>Summary of key performance metrics</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, alignItems: 'stretch' }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>NIJ Compliance</div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 6px' }}>IIA–IIIa</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Multi-level certified</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Impact Resistance</div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 6px' }}>High</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Energy absorption</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Optical Clarity</div>
          <div style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 6px' }}>Low Haze</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-dim)' }}>Preserves visibility</div>
        </div>
      </div>
    </div>
  );
}
