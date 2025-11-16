import React from 'react';

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
  style?: React.CSSProperties;
};

export default function CTAButton({ href, children, variant = 'primary', style }: Props) {
  const base: React.CSSProperties = {
    padding: '12px 18px',
    borderRadius: 999,
    textDecoration: 'none',
    fontWeight: 600,
    display: 'inline-block',
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: 'var(--color-primary)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--color-text)', border: '1px solid rgba(255,255,255,0.25)' },
  };
  return (
    <a href={href} className="btn" style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </a>
  );
}
