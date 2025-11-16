import React from 'react';
import { FileItem } from '@/types';

export default function FileTile({ file }: { file: FileItem }) {
  return (
    <a className="card" href={file.url} download style={{ padding: 16, display: 'block' }}>
      <div style={{ fontWeight: 600 }}>{file.name}</div>
      <div style={{ color: 'var(--color-text-dim)', fontSize: 12 }}>{file.kind}</div>
    </a>
  );
}
