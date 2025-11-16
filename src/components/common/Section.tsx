import React from 'react';

type Props = {
  title: string;
  children: React.ReactNode;
  noCard?: boolean;
};

export default function Section({ title, children, noCard = false }: Props) {
  return (
    <section className="full-bleed" style={{ padding: '24px 16px' }}>
      <h2 style={{ margin: '0 0 12px' }}>{title}</h2>
      {noCard ? (
        <div>{children}</div>
      ) : (
        <div className="card" style={{ padding: 16 }}>{children}</div>
      )}
    </section>
  );
}
