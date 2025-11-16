import React from 'react';

export default function TrainingSchedulePreview() {
  const items = [
    { date: 'Nov 12', title: 'Installation Basics', mode: 'Online' },
    { date: 'Dec 03', title: 'Advanced Applications', mode: 'In-person' },
  ];
  return (
    <div className="card" style={{ padding: 16 }}>
      <h4 style={{ marginTop: 0 }}>Upcoming Training</h4>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map((it) => (
          <li key={it.date} style={{ margin: '6px 0' }}>
            <strong>{it.date}</strong> — {it.title} ({it.mode})
          </li>
        ))}
      </ul>
    </div>
  );
}
