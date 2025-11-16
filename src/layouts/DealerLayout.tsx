import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function DealerLayout() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)', padding: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 16 }}>Dealer Portal</div>
        <nav style={{ display: 'grid', gap: 8 }}>
          <NavLink to="/dealer/dashboard">Dashboard</NavLink>
          <NavLink to="/dealer/files">Files</NavLink>
          <NavLink to="/dealer/uploads">Uploads</NavLink>
          <NavLink to="/dealer/training">Training</NavLink>
        </nav>
      </aside>
      <section>
        <div style={{ borderBottom: '1px solid var(--color-border)', padding: 16, background: 'var(--color-surface)' }}>Dealer Topbar</div>
        <div className="container" style={{ padding: '24px 16px' }}>
          <Outlet />
        </div>
      </section>
    </div>
  );
}
