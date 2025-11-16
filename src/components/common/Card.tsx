import React from 'react';

export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="card" style={{ padding: 16 }}>{children}</div>;
}
