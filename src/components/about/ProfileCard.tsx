import React from 'react';

type Props = { name: string; title: string; bio: string; photo?: string };
export default function ProfileCard({ name, title, bio, photo }: Props) {
  return (
    <div className="card" style={{ padding: 16, display: 'grid', gridTemplateColumns: '72px 1fr', gap: 12, alignItems: 'center' }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', background: 'rgba(255,255,255,0.08)' }}>
        {photo ? <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
      </div>
      <div>
        <div style={{ fontWeight: 700 }}>{name}</div>
        <div style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>{title}</div>
        <p style={{ marginTop: 8 }}>{bio}</p>
      </div>
    </div>
  );
}
