import React from 'react';

const rows = [
  { feature: 'NIJ Rating', clear: 'IIA', pro: 'II', ultra: 'IIIa', shadow: 'II', highway: 'Coming soon' },
  { feature: 'VLT (%)', clear: '92%', pro: '90%', ultra: '88%', shadow: '70%', highway: '-' },
  { feature: 'Thickness', clear: '10 mm', pro: '12 mm', ultra: '14 mm', shadow: '12 mm', highway: '-' },
];

export default function ComparisonTable() {
  return (
    <div className="card" style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Feature','Clear','Pro','Ultra Max','Shadow','Highway'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid var(--color-border)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.feature}>
              <td style={{ padding: 12, borderBottom: '1px solid var(--color-border)' }}>{r.feature}</td>
              <td style={{ padding: 12, borderBottom: '1px solid var(--color-border)' }}>{r.clear}</td>
              <td style={{ padding: 12, borderBottom: '1px solid var(--color-border)' }}>{r.pro}</td>
              <td style={{ padding: 12, borderBottom: '1px solid var(--color-border)' }}>{r.ultra}</td>
              <td style={{ padding: 12, borderBottom: '1px solid var(--color-border)' }}>{r.shadow}</td>
              <td style={{ padding: 12, borderBottom: '1px solid var(--color-border)' }}>{r.highway}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
