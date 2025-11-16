import React, { useState } from 'react';

const layers = [
  { name: 'Outer Coating', detail: 'Scratch-resistant, UV-stable outer protective coat.' },
  { name: 'Transparent Armor', detail: 'Multi-polymer composite for high impact absorption.' },
  { name: 'Adhesive Matrix', detail: 'Optically clear bonding layer for lamination.' },
  { name: 'Inner Film', detail: 'Shatter retention and spall control.' },
];

export default function InteractiveLayers() {
  const [active, setActive] = useState(0);
  return (
    <div className="card" style={{ padding: 16 }}>
      <style>{css}</style>
      <div className="tech-split">
        <div className="layer-list">
          {layers.map((l, i) => (
            <button
              key={l.name}
              onClick={() => setActive(i)}
              className={i===active? 'layer-btn layer-btn--active':'layer-btn'}
            >
              {l.name}
            </button>
          ))}
        </div>
        <div className="detail card">
          <div className="detail__text">
            <h4 className="detail__title">{layers[active].name}</h4>
            <p className="detail__desc">{layers[active].detail}</p>
          </div>
          <div className="detail__media" aria-label="Layer image">
            <img className="detail-img" src={imgs[active]} alt={layers[active].name} />
          </div>
        </div>
      </div>
    </div>
  );
}

const imgs = [
  '../../assets/logo/window.png',
  '../../assets/logo/car.png',
  '../../assets/logo/mirror.png',
  '../../assets/logo/govt.png',
];

const css = `
.tech-split { display: grid; grid-template-columns: minmax(220px, .9fr) 1.1fr; gap: 16px; align-items: stretch; }
.layer-list { display: grid; gap: 10px; }
.layer-btn { text-align: left; padding: 12px; border-radius: 12px; background: var(--panel); border: 1px solid var(--line); color: var(--text); cursor: pointer; transition: background .2s ease, border-color .2s ease, transform .1s ease; }
.layer-btn:hover { transform: translateY(-1px); }
.layer-btn--active { background: rgba(26,115,232,0.15); border-color: var(--accent); }

.detail { padding: 16px; display: grid; grid-template-columns: 1.2fr auto; align-items: center; gap: 16px; }
.detail__title { margin: 0; }
.detail__desc { margin: 6px 0 0; color: var(--muted); }
.detail__media { width: 260px; height: 160px; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); justify-self: end; }
.detail-img { width: 100%; height: 100%; object-fit: contain; display: block; }

@media (max-width: 900px) {
  .tech-split { grid-template-columns: 1fr; }
  .detail { grid-template-columns: 1fr; }
  .detail__media { width: 100%; height: 200px; justify-self: stretch; }
}
`;
