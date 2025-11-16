import React from 'react';
import Section from '@/components/common/Section';

export default function Dealers() {
  return (
    <div>
      <Section title="Dealers">
        <p>Join our dealer network.</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <a className="card" style={{ padding: 12 }} href="/dealer/register">Become a Dealer</a>
          <a className="card" style={{ padding: 12 }} href="/dealer/login">Dealer Login</a>
        </div>
      </Section>
    </div>
  );
}
