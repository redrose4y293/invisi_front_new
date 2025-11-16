import React from 'react';

type VariantMap = Record<string, { bg: string; fg: string }>;

const variants: VariantMap = {
  New: { bg: '#14324d', fg: '#60A5FA' },
  'In Review': { bg: '#37304d', fg: '#C084FC' },
  Qualified: { bg: '#123f39', fg: '#34D399' },
  Closed: { bg: '#49343b', fg: '#F87171' },
  Pending: { bg: '#3b3a2a', fg: '#FBBF24' },
  Active: { bg: '#123f39', fg: '#34D399' },
  Suspended: { bg: '#49343b', fg: '#F87171' },
};

export default function StatusBadge({ status }:{ status: string }){
  const c = variants[status] || { bg:'#2a3340', fg:'#C5C6C7' };
  return (
    <span style={{ background:c.bg, color:c.fg, border:'1px solid #223', padding:'2px 8px', borderRadius:999, fontSize:12 }}>
      {status}
    </span>
  );
}
