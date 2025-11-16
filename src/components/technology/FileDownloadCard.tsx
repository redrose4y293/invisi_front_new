import React from 'react';

export default function FileDownloadCard({ title, href, subtitle }: { title: string; href: string; subtitle?: string }) {
  const isPdf = href.toLowerCase().endsWith('.pdf');
  const base = (import.meta as any)?.env?.VITE_API_BASE || '';
  const finalHref = href.startsWith('/api/') && base ? `${base}${href}` : href;
  return (
    <a
      className="card"
      href={finalHref}
      target="_blank"
      rel="noreferrer"
      download={isPdf || undefined}
      style={{
        padding: 14,
        display: 'grid',
        gridTemplateColumns: '40px 1fr auto',
        gap: 12,
        alignItems: 'center'
      }}
    >
      <span
        aria-hidden
        style={{
          width: 40,
          height: 40,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 10,
          background: 'linear-gradient(180deg, rgba(26,115,232,0.25), rgba(26,115,232,0.08))',
          border: '1px solid rgba(26,115,232,0.35)'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M5 21h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </span>
      <div>
        <div style={{ fontWeight: 700 }}>{title}</div>
        {subtitle ? <div style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>{subtitle}</div> : null}
      </div>
      <span className="btn" style={{ padding: '6px 10px' }}>{isPdf ? 'Download' : 'Open'}</span>
    </a>
  );
}
