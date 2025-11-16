import React from 'react';

type Column<T> = { key: keyof T; header: string; render?: (row: T) => React.ReactNode };

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  onSort?: (key: keyof T) => void;
  toolbar?: React.ReactNode;
  density?: 'compact'|'normal';
  onRowClick?: (row: T) => void;
};

export default function DataTable<T extends Record<string, any>>({ columns, rows, onSort, toolbar, density='normal', onRowClick }: Props<T>) {
  return (
    <div style={{ border:'1px solid #223', borderRadius:12, overflow:'hidden', background:'#0E1621' }}>
      {toolbar && <div style={{ padding:12, borderBottom:'1px solid #223' }}>{toolbar}</div>}
      <div style={{ overflow:'auto' }}>
        <table style={{ width:'100%', minWidth:560, borderCollapse:'collapse' }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={String(col.key)} style={{ textAlign:'left', padding:12, borderBottom:'1px solid #223', color:'#C5C6C7', cursor: onSort ? 'pointer' : 'default' }} onClick={()=> onSort?.(col.key)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={columns.length} style={{ padding:16, color:'#5E5E5E' }}>No data</td></tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} onClick={()=> onRowClick?.(row)} style={{ cursor: onRowClick? 'pointer':'default' }}>
                {columns.map(col => (
                  <td key={String(col.key)} style={{ padding: density==='compact'? 10: 12, height: density==='compact'? 44: 52, borderBottom:'1px solid #16202c' }}>
                    {col.render ? col.render(row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
