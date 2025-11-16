import React from 'react';

type Props = { title: string; value: string | number; trend?: 'up'|'down'|'flat'; note?: string };

export default function KpiCard({ title, value, trend='flat', note }: Props){
  const color = trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#C5C6C7';
  return (
    <div style={{ background:'#0E1621', border:'1px solid #223', borderRadius:12, padding:16, display:'grid', gap:6 }}>
      <div style={{ color:'#C5C6C7', fontSize:12 }}>{title}</div>
      <div style={{ fontSize:28, fontWeight:700 }}>{value}</div>
      {note && <div style={{ color, fontSize:12 }}>{note}</div>}
    </div>
  );
}
