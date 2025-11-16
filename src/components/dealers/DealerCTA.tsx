import React from 'react';
import CTAButton from '@/components/common/CTAButton';

export default function DealerCTA() {
  return (
    <div className="card" style={{ padding: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ margin: 0 }}>Dealers & Installers</h3>
        <div style={{ color: 'var(--color-text-dim)' }}>Join our global network of certified installers.</div>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <CTAButton href="/dealer/register">Become a Dealer</CTAButton>
        <CTAButton href="/login" variant="ghost">Login</CTAButton>
      </div>
    </div>
  );
}
