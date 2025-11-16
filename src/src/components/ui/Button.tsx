import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'secondary'|'ghost' };

export default function Button({ variant='primary', style, ...rest }: Props){
  const base: React.CSSProperties = { padding:'10px 12px', borderRadius:8, border:'1px solid #334', cursor:'pointer', fontWeight:600 };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background:'var(--accent)', color:'#fff', borderColor:'var(--accent)' },
    secondary: { background:'#0B1117', color:'#E6E6E6' },
    ghost: { background:'transparent', color:'#E6E6E6' },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} {...rest} />;
}
