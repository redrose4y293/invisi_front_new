import React from 'react';

type Access = 'nda'|'portal'|'public';

export default function LockBadge({ access }:{ access: Access }){
  const map: Record<Access, { label:string; color:string }> = {
    nda: { label:'NDA', color:'#EF4444' },
    portal: { label:'Portal', color:'#F59E0B' },
    public: { label:'Public', color:'#10B981' },
  };
  const conf = map[access];
  return (
    <span style={{
      display:'inline-block', padding:'2px 8px', borderRadius:999,
      border:'1px solid #334', color: conf.color, background:'#0E1621', fontSize:12
    }}>
      {conf.label}
    </span>
  );
}
