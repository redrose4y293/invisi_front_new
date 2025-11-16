import React from 'react';

export default function Badge({ children, color = 'var(--color-primary)' }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 999,
      background: color,
      color: '#0b0f14',
      fontWeight: 600,
      fontSize: 12,
    }}>{children}</span>
  );
}
