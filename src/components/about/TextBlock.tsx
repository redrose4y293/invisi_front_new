import React from 'react';

export default function TextBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card" style={{ padding: 20 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ color: 'var(--color-text)' }}>{children}</div>
    </section>
  );
}
