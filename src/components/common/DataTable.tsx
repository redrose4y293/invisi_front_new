import React from 'react';

type Props = { columns: string[]; rows: Array<Record<string, React.ReactNode>> };

export default function DataTable({ columns, rows }: Props) {
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--color-border)' }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td key={c} style={{ padding: 12, borderBottom: '1px solid var(--color-border)' }}>{r[c]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
