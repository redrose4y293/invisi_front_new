import React, { useState } from 'react';
import CTAButton from '@/components/common/CTAButton';

type Props = {
  name: string;
  tagline: string;
  nij: string;
  vlt: string;
  slug: string;
};

export default function ProductCard({ name, tagline, nij, vlt, slug }: Props) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="card product-card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: 16,
        display: 'grid',
        gap: 10,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hover ? '0 12px 28px rgba(0,0,0,0.35)' : undefined,
        transition: 'transform .12s ease, box-shadow .2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>{name}</div>
      </div>
      <div style={{ color: 'var(--color-text-dim)', fontSize: 13 }}>{tagline}</div>

      <div style={{ display: 'flex', gap: 8, marginTop: 2, fontSize: 12, flexWrap: 'wrap' }}>
        <span className="card" style={{ padding: '6px 10px', borderRadius: 999, background: 'rgba(26,115,232,0.14)', border: '1px solid rgba(26,115,232,0.3)' }}>NIJ {nij}</span>
        <span className="card" style={{ padding: '6px 10px', borderRadius: 999 }}>{`VLT ${vlt}`}</span>
      </div>

      <div style={{ height: 1, background: 'var(--color-border)', opacity: 0.25, margin: '6px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CTAButton href={`/products/${slug}`} variant="ghost">Learn More</CTAButton>
      </div>
    </div>
  );
}
