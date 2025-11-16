import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dashboard from '@/pages/dealer/Dashboard';
import Files from '@/pages/dealer/Files';
import Uploads from '@/pages/dealer/Uploads';
import Training from '@/pages/dealer/Training';
import Contact from '@/pages/dealer/Contact';

const css = `
.dealer-topnav { position: sticky; top: 0; z-index: 5; background: var(--color-brand-red); border-bottom: 2px solid var(--color-gold); box-shadow: 0 2px 0 rgba(215,163,51,0.35), 0 8px 18px rgba(0,0,0,0.25); }
.dealer-topnav__bar { display: flex; gap: 8px; padding: 12px 16px; align-items: center; }
.dealer-topnav__title { font-weight: 800; }
.dealer-topnav__nav { display: flex; gap: 8px; margin-left: auto; }
.dealer-topnav__nav .btn { padding: 8px 12px; border-radius: 10px; border: 1px solid var(--color-gold); background: linear-gradient(180deg, #203a64, #1a2f52); color: #fff; white-space: nowrap; }

@media (max-width: 900px) {
  .dealer-topnav__bar { flex-wrap: wrap; gap: 10px; }
  .dealer-topnav__nav { width: 100%; display: grid; grid-auto-flow: column; grid-auto-columns: max-content; gap: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: thin; }
  .dealer-topnav__nav::-webkit-scrollbar { height: 6px; }
  .dealer-topnav__nav::-webkit-scrollbar-thumb { background: rgba(215,163,51,0.6); border-radius: 999px; }
}

@media (max-width: 420px) {
  .dealer-topnav__title { font-size: 14px; }
}
`;

function TopNav() {
  return (
    <div className="dealer-topnav">
      <style>{css}</style>
      <div className="dealer-topnav__bar">
        <div className="dealer-topnav__title">Dealer Portal</div>
        <nav className="dealer-topnav__nav">
          <a className="btn" href="#dashboard">Dashboard</a>
          <a className="btn" href="#files">Files</a>
          <a className="btn" href="#uploads">Uploads</a>
          <a className="btn" href="#training">Training</a>
          <a className="btn" href="#contact">Contact</a>
        </nav>
      </div>
    </div>
  );
}

export default function Portal() {
  const loc = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    // If user lands on alias like /dealer/files, scroll to section and normalize URL to /dealer#files
    const path = loc.pathname.toLowerCase();
    const map: Record<string, string> = {
      '/dealer/dashboard': '#dashboard',
      '/dealer/files': '#files',
      '/dealer/uploads': '#uploads',
      '/dealer/training': '#training',
      '/dealer/contact': '#contact',
    };
    const hash = map[path];
    if (hash) {
      // normalize URL
      nav(`/dealer${hash}`, { replace: true });
      // attempt smooth scroll
      const el = document.querySelector(hash) as HTMLElement | null;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loc.pathname, nav]);

  return (
    <div>
      <TopNav />
      <div style={{ padding: '24px 16px', display: 'grid', gap: 24 }}>
        <section id="dashboard" style={{ scrollMarginTop: 90 }}>
          <Dashboard />
        </section>
        <section id="files" style={{ scrollMarginTop: 90 }}>
          <Files />
        </section>
        <section id="uploads" style={{ scrollMarginTop: 90 }}>
          <Uploads />
        </section>
        <section id="training" style={{ scrollMarginTop: 90 }}>
          <Training />
        </section>
        <section id="contact" style={{ scrollMarginTop: 90 }}>
          <Contact />
        </section>
      </div>
    </div>
  );
}
