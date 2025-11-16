import React from 'react';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '48px 16px' }}>
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <h1 style={{ marginTop: 0, marginBottom: 6 }}>404</h1>
        <p style={{ marginTop: 0, color: 'var(--color-text-dim)' }}>Page not found.</p>
        <div style={{ marginTop: 16 }}>
          <a className="btn" href="/">Back to Home</a>
        </div>
      </div>
    </div>
  );
}
