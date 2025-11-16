import React from 'react';

export default function FileDownloadList({ files }: { files: { title: string; href: string }[] }) {
  return (
    <div className="card" style={{ padding: 12 }}>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {files.map((f) => (
          <li key={f.href} style={{ margin: '6px 0' }}>
            <a href={f.href} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>{f.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
