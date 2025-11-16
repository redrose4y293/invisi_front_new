import React from 'react';

export default function Footer() {
  const css = `
  .foot-wrap { padding: 18px 0; display: flex; justify-content: space-between; align-items: center; gap: 12px; color: var(--color-text); }
  .links { display: flex; gap: 10px; }
  .pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px; border: 1px solid var(--color-gold); background: linear-gradient(180deg, #203a64, #1a2f52); color: #fff; text-decoration: none; box-shadow: 0 2px 0 rgba(215,163,51,0.35), 0 8px 18px rgba(0,0,0,0.25); transition: transform .12s ease, box-shadow .2s ease; }
  .pill:hover { transform: translateY(-1px); box-shadow: 0 3px 0 rgba(215,163,51,0.45), 0 12px 26px rgba(0,0,0,0.35); }
  .copy { opacity: .9; }

  @media (max-width: 640px) {
    .foot-wrap { flex-direction: column; align-items: flex-start; gap: 10px; padding: 18px 0; }
    .links { flex-wrap: wrap; }
  }
  `;

  return (
    <footer className="footer">
      <style>{css}</style>
      <div className="container foot-wrap">
        <span className="copy"> © {new Date().getFullYear()} InvisiShield</span>
        <nav className="links">
          <a className="pill" href="/legal">Legal</a>
          <a className="pill" href="/login">Login</a>
        </nav>
      </div>
    </footer>
  );
}
