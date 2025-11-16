import React, { useEffect, useState } from "react";
import CTAButton from "@/components/common/CTAButton";

const items = [
  {
    name: "Clear",
    slug: "clear",
    blurb: "Crystal-clear ballistic protection.",
    specs: ["NIJ IIA", "VLT 92%"],
    img: "../../assets/logo/army.png",
  },
  {
    name: "Pro",
    slug: "pro",
    blurb: "Enhanced strength for demanding use.",
    specs: ["NIJ II", "VLT 90%"],
    img: "../../assets/logo/car.png",
  },
  {
    name: "Ultra Max",
    slug: "ultra-max",
    blurb: "Maximum protection, minimal distortion.",
    specs: ["NIJ IIIa", "VLT 88%"],
    img: "../../assets/logo/govt.png",
  },
  {
    name: "Shadow Series",
    slug: "shadow-series",
    blurb: "Tinted stealth with certified protection.",
    specs: ["NIJ II", "VLT 70%"],
    img: "../../assets/logo/mirror.png",
  },
  {
    name: "Highway (Coming Soon)",
    slug: "highway",
    blurb: "High-speed application variant.",
    specs: ["NIJ —", "VLT —"],
    img: "../../assets/logo/window.png",
  },
];

export default function ProductCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 3500);
    return () => clearInterval(t);
  }, []);

  const current = items[index];

  return (
    <div className="card" style={{ padding: 16, display: 'grid', gap: 12 }}>
      <style>{css}</style>
      <div className="carousel-head">
        <h3>Product Highlights</h3>
        <div className="dots">
          {items.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} aria-label={`Go to ${i+1}`} className={i===index? 'dot dot--active':'dot'} />
          ))}
        </div>
      </div>

      <div className="slide">
        <div className="slide__text">
          <div className="title">{current.name}</div>
          <div className="blurb">{current.blurb}</div>
          {current.specs && (
            <div className="specs">
              {current.specs.map((s) => (
                <span key={s} className="pill">{s}</span>
              ))}
            </div>
          )}
          <div className="actions">
            <CTAButton href={`/products/${current.slug}`} variant="ghost">View details</CTAButton>
          </div>
        </div>
        <div className="slide__media" aria-label="Product image area">
          <img className="slide-img" src={current.img} alt={current.name} />
        </div>
      </div>
    </div>
  );
}

const css = `
.carousel-head { display: flex; justify-content: space-between; align-items: center; }
.carousel-head h3 { margin: 0; }
.dots { display: flex; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 999px; border: none; background: rgba(255,255,255,0.25); cursor: pointer; }
.dot--active { background: var(--color-primary); }

.slide { display: grid; grid-template-columns: 1.1fr .9fr; gap: 16px; align-items: center; }
.slide__text { display: grid; gap: 10px; }
.title { font-weight: 800; font-size: 22px; }
.blurb { color: var(--color-text-dim); }
.specs { display: flex; gap: 8px; flex-wrap: wrap; }
.pill { padding: 6px 10px; border-radius: 999px; background: rgba(26,115,232,0.18); color: #cfe1ff; border: 1px solid rgba(26,115,232,0.35); font-size: 12px; }
.actions { margin-top: 6px; }

.slide__media { position: relative; width: 460px; height: 260px; border-radius: 12px; overflow: hidden; background: radial-gradient(800px 400px at 60% -20%, rgba(26,115,232,0.16), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02)); border: 1px solid var(--line); display: grid; justify-self: end; }
.slide-img { width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }

@media (max-width: 900px) {
  .slide { grid-template-columns: 1fr; }
  .slide__media { width: 100%; height: 220px; justify-self: stretch; }
}

@media (max-width: 1200px) {
  .slide__media { width: 400px; height: 240px; }
}

@media (max-width: 1024px) {
  .slide__media { width: 360px; height: 220px; }
}
`;
