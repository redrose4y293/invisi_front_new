import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string };

export default function Input({ label, hint, error, style, ...rest }: Props){
  return (
    <label style={{ display:'grid', gap:6 }}>
      {label && <div style={{ fontSize:12, color:'#C5C6C7' }}>{label}</div>}
      <input {...rest} style={{ 
        padding:'10px 12px', borderRadius:8, border:'1px solid ' + (error ? '#AA2E2E' : '#334'), 
        background:'#0B1117', color:'#E6E6E6', outline:'none', ...style }} />
      {hint && !error && <div style={{ fontSize:12, color:'#5E5E5E' }}>{hint}</div>}
      {error && <div style={{ fontSize:12, color:'#FF6B6B' }}>{error}</div>}
    </label>
  );
}
