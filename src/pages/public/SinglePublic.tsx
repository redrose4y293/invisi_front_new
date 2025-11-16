import React, { useEffect } from "react";
import Hero from "@/components/common/Hero";
import Section from "@/components/common/Section";
import ProductCarousel from "@/components/common/ProductCarousel";
import CTAButton from "@/components/common/CTAButton";
import LegalTabs from "@/components/legal/LegalTabs";
import VideoGallery from "@/components/testing/VideoGallery";
import FileDownloadList from "@/components/testing/FileDownloadList";
import DealerCTA from "@/components/dealers/DealerCTA";
import TrainingSchedulePreview from "@/components/dealers/TrainingSchedulePreview";
import TextBlock from "@/components/about/TextBlock";
import ProcessDiagram from "@/components/technology/ProcessDiagram";
import InteractiveLayers from "@/components/technology/InteractiveLayers";
import Charts from "@/components/technology/Charts";
import FileDownloadCard from "@/components/technology/FileDownloadCard";
import ComparisonTable from "@/components/technology/ComparisonTable";

import ApplicationSection from "@/components/applications/ApplicationSection";

/* ----------------------------- helpers ----------------------------- */
function useRevealOnScroll() {
  // Adds .in to any element with [data-animate] when scrolled into view
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-animate]"));
    if (!("IntersectionObserver" in window) || els.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ---------------------------- main view ---------------------------- */
export default function SinglePublic() {
  useRevealOnScroll();

  return (
    <div className="public-root">
      {/* Page-local styles for dark admin look + polished sections */}
      <style>{css}</style>

      {/* 1. Home / Hero */}
      <div id="home" className="anchor">
        <Hero />
      </div>

      {/* 2. About */}
      <div id="about" className="anchor">
        <Section title="About">
          <div
            className="card card--glass"
            data-animate="fade-up"
            style={{ padding: 0, overflow: "hidden" }}
          >
            <div className="split">
              <div className="split__text">
                <h3 className="h3">Our Mission</h3>
                <p className="muted">
                  InvisiShield™ advances the frontier of transparent ballistic
                  protection. Our purpose is to protect lives while preserving
                  clarity—delivering lightweight, optically superior, and
                  rigorously tested solutions for vehicles, infrastructure, and
                  tactical use.
                </p>
                <p className="muted">
                  We combine multi-layer composite engineering, optical
                  adhesion, and strict quality controls to achieve reliable,
                  field-proven performance.
                </p>
              </div>

              <div className="split__media" aria-hidden>
                <img
                  src="/assets/logo/about.png"
                  alt=""
                  className="media-img"
                />
                <div className="media-glow" />
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* 3. Technology */}
      <div id="technology" className="anchor">
        <Section title="Technology">
          <div className="stack" data-animate="fade-up">
            <TextBlock title="How It Works">
              Our stacked composite architecture dissipates impact energy across
              multiple transparent layers while preserving optical clarity and
              low haze. Bonds are formed with optically clear adhesives for
              durability and UV stability.
            </TextBlock>

            {/* Interactive layers only (full width card) */}
            <div data-animate="fade-up">
              <InteractiveLayers />
            </div>

            <div className="card card--soft" data-animate="fade-up">
              <ComparisonTable />
            </div>
          </div>
        </Section>
      </div>

      {/* 4. Products */}
      <div id="products" className="anchor">
        <Section title="Products">
          <div className="stack">
            <div data-animate="fade-up">
              <ProductCarousel />
            </div>
          </div>
        </Section>
      </div>

      {/* 5. Applications */}
      <div id="applications" className="anchor">
        <Section title="Applications">
          <div className="stack">
            <div className="app-grid">
              <div data-animate="slide-left">
                <ApplicationSection
                  title="Vehicles"
                  description="OEM and upfit solutions for civilian and security vehicles, preserving visibility with certified protection."
                  media="/assets/logo/car.png"
                  bullets={[
                    "Sedans & SUVs",
                    "VIP transport",
                    "Cash-in-transit",
                  ]}
                />
              </div>
              <div data-animate="slide-right">
                <ApplicationSection
                  title="Residential"
                  description="Discreet window retrofits and architectural panels for homes and estates."
                  media="/assets/logo/wind.png"
                  bullets={[
                    "Windows & doors",
                    "Safe rooms",
                    "Perimeter glazing",
                  ]}
                />
              </div>
              <div data-animate="slide-left">
                <ApplicationSection
                  title="Commercial / Government"
                  description="Embassy, courthouse, and critical infrastructure upgrades meeting stringent ballistic standards."
                  media="/assets/logo/govt.png"
                  bullets={["Embassies", "Courthouses", "Government fleets"]}
                />
              </div>
              <div data-animate="slide-right">
                <ApplicationSection
                  title="Tactical / Military"
                  description="Mission-ready modules and shields for tactical teams and defense vehicles."
                  media="/assets/logo/army.png"
                  bullets={["Riot shields", "Turret windows", "Vehicle kits"]}
                />
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* 6. Testing & Validation (polished styling) */}
      <div id="testing" className="anchor">
        <Section title="Testing">
          <div className="stack">
            <div
              className="card card--soft testing-summary"
              data-animate="fade-up"
            >
              <div className="test-row">
                <span className="badge" style={{ marginTop: 38 }}>
                  Ballistic
                </span>
                <TextBlock title="Ballistic Tests">
                  NIJ-compliant trials across multiple energy levels and shot
                  placements.
                </TextBlock>
              </div>
              <div className="test-row">
                <span className="badge" style={{ marginTop: 38 }}>
                  Blast
                </span>
                <TextBlock title="Blast Resistance">
                  Explosion chamber tests with pressure/time curves.
                </TextBlock>
              </div>
              <div className="test-row">
                <span className="badge" style={{ marginTop: 38 }}>
                  Blunt
                </span>
                <TextBlock title="Blunt Force Resistance">
                  Object impact tests (hammer, steel ball).
                </TextBlock>
              </div>
            </div>

            <div className="card testing-video" data-animate="fade-up" style={{color:'#fff' }}>
              <VideoGallery
                items={[
                  
                  { src: "/videos/sample1.mp4", title: "NIJ Test A"  },
                  { src: "/videos/sample2.mp4", title: "Blast Test B" },
                ]}
              />
            </div>

            {/* <div
              className="card card--soft testing-downloads"
              data-animate="fade-up"
            >
              <h4 className="downloads-title">Downloads</h4>
              <FileDownloadList
                files={[
                  {
                    title: "Testing Report (PDF)",
                    href: "../../assets/InvisiShield_Testing_Report.pdf",
                  },
                  {
                    title: "Technical Specifications (PDF)",
                    href: "../../assets/InvisiShield_Tech_Specs.pdf",
                  },
                ]}
              />
              <div className="center mt-16">
                <CTAButton href="#contact">Request a Prototype</CTAButton>
              </div>
            </div> */}
          </div>
        </Section>
      </div>

      {/* 7. Dealers & Installers */}
      <div id="dealers" className="anchor">
        <Section title="Dealers & Installers">
          <div className="stack">
            <div data-animate="fade-up">
              <DealerCTA />
            </div>
            <div data-animate="fade-up">
              <TrainingSchedulePreview />
            </div>
          </div>
        </Section>
      </div>

      {/* 8. Contact (major polish) */}
      <div id="contact" className="anchor">
        <Section title="Contact" noCard>
          <div className="contact-wrap" data-animate="fade-up">
            <div className="card contact-card">
              <form onSubmit={(e) => e.preventDefault()} className="form-grid">
                <label className="field">
                  <span>Name*</span>
                  <input placeholder="Your full name" required />
                </label>
                <label className="field">
                  <span>Email*</span>
                  <input placeholder="you@company.com" type="email" required />
                </label>
                <label className="field">
                  <span>Company</span>
                  <input placeholder="Company / Organization" />
                </label>
                <label className="field">
                  <span>Inquiry type</span>
                  <select defaultValue="General">
                    <option>General</option>
                    <option>Prototype</option>
                    <option>Dealership</option>
                  </select>
                </label>
                <label className="field field--full">
                  <span>Message</span>
                  <textarea placeholder="How can we help?" rows={5} />
                </label>
                <label className="field field--full">
                  <span>Attach specs (PDF/DOCX)</span>
                  <input
                    className="file"
                    type="file"
                    accept=".pdf,.doc,.docx"
                  />
                </label>

                <div className="actions field--full">
                  <button className="btn btn--primary">Submit</button>
                  <span className="form-note">
                    We’ll get back within 1–2 business days.
                  </span>
                </div>
              </form>
            </div>

            <div className="card contact-side">
              <h4 className="side-title">Direct Contact</h4>
              <ul className="contact-list">
                <li>
                  <span>Sales</span>
                  <a href="mailto:sales@invisishield.com">
                    sales@invisishield.com
                  </a>
                </li>
                <li>
                  <span>Support</span>
                  <a href="mailto:support@invisishield.com">
                    support@invisishield.com
                  </a>
                </li>
                <li>
                  <span>Phone</span>
                  <a href="tel:+10000000000">+1 (000) 000-0000</a>
                </li>
              </ul>
              <div className="note">
                We respond within 24–48 hours on business days.
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* 9. Legal (refined container spacing) */}
      <div id="legal" className="anchor">
        <Section title="Legal">
          <div className="card card--soft legal-wrap" data-animate="fade-up">
            <LegalTabs />
          </div>
          <div className="container center mt-24" data-animate="fade-up">
            <CTAButton href="#contact" style={{marginTop:10, marginLeft: -60,}}>Request a Prototype</CTAButton>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ------------------------------- styles ------------------------------ */
const css = `
/* Public root should inherit global gradient and colors */
.public-root { background: transparent; }

/* cards now use global cream panel variables */
.card {
  background: var(--color-panel);
  border: 1px solid var(--color-panel-border);
  color: var(--color-text);
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-soft);
}
.card--soft { background: var(--color-panel); }
.card--glass { background: var(--color-panel); }

/* text */
.h3 { margin: 0 0 8px; font-size: 20px; font-weight: 700; letter-spacing: 0.2px; }
.muted { color: var(--color-text-dim); }

/* layouts */
.split { display: grid; grid-template-columns: 1.15fr 1fr; min-height: 380px; }
.split__text { padding: 28px; display: grid; align-content: center; gap: 12px; }
.split__media { position: relative; min-height: 360px; overflow: hidden; }
.media-img { width: 100%; height: 100%; object-fit: cover; display: block; filter: contrast(1.05) saturate(0.9); }
.media-glow { position: absolute; inset: 0; background: radial-gradient(500px 260px at 80% 30%, rgba(26,115,232,0.22), transparent 60%); pointer-events: none; }

.stack { display: grid; gap: 16px; }

/* Technology mosaic */
.tech-mosaic { display: grid; grid-template-columns: 1.1fr 1fr; gap: 16px; }
.mosaic-section { border-radius: 14px; background: var(--color-panel); padding: 14px; box-shadow: var(--shadow-soft); border: 1px solid var(--color-panel-border); }
.chips { display: flex; flex-wrap: wrap; gap: 10px; }
.chip { background: rgba(26,115,232,0.14); border: 1px solid rgba(26,115,232,0.3); color: #dbe8ff; padding: 8px 12px; border-radius: 999px; font-size: 13px; transition: transform .12s ease, box-shadow .2s ease, background .2s ease; }
.chip:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(26,115,232,0.25); background: rgba(26,115,232,0.18); }

/* Grids */
.product-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
.download-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.app-grid { display: grid; grid-template-columns: repeat(2, minmax(520px, 1fr)); gap: 16px; align-items: stretch; }

/* Applications card layout overrides */
.app-grid section.card { height: 100%; }
.app-grid section.card > div { display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important; gap: 18px; align-items: stretch; height: 100%; }
.app-grid section.card > div > div:first-child { width: 100%; align-self: stretch; border-radius: 12px; overflow: hidden; aspect-ratio: 16 / 9; min-height: 300px; }
.app-grid section.card > div > div:first-child, .app-grid section.card > div > div:last-child { min-width: 0; }
.app-grid section.card > div > div:first-child img,
.app-grid section.card > div > div:first-child video { width: 100%; height: 100%; object-fit: cover; object-position: left center; display: block; }
.app-grid section.card > div > div:last-child { display: grid; gap: 10px; }

@media (max-width: 1024px) {
  .app-grid section.card > div { grid-template-columns: minmax(0,1fr) minmax(0,1fr) !important; gap: 16px; }
  .app-grid section.card > div > div:first-child { aspect-ratio: 4 / 3; min-height: 240px; }
}
@media (max-width: 900px) {
  .app-grid { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .app-grid section.card > div { grid-template-columns: 1fr !important; }
  .app-grid section.card > div > div:first-child { aspect-ratio: 3 / 2; min-height: 180px; }
}

/* Testing polish */
.testing-summary { display: grid; gap: 12px; }
.test-row { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; }
.badge { display: inline-flex; align-items: center; justify-content: center; height: 26px; min-width: 86px; padding: 0 10px; border-radius: 999px; background: rgba(26,115,232,.12); color: var(--color-text); border: 1px solid rgba(26,115,232,.25); font-size: 12px; text-transform: uppercase; letter-spacing: .6px; }
.testing-video { padding: 12px;  }
.testing-downloads { padding: 16px; }
.downloads-title { margin: 0 0 10px; font-size: 14px; color: var(--text); text-transform: uppercase; letter-spacing: .6px; }

/* Contact polish */
.contact-wrap { display: grid; grid-template-columns: minmax(280px, 1.5fr) minmax(240px, .9fr); gap: 18px; }
.contact-card { padding: 18px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.field { display: grid; gap: 6px; }
.field--full { grid-column: 1 / -1; }
.field > span { font-size: 12px; color: var(--muted); }
.field input, .field select, .field textarea {
  background: #0b121b; border: 1px solid var(--line); color: var(--text);
  border-radius: 10px; padding: 10px 12px; outline: none;
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,115,232,0.15); }
.file { padding: 8px; background: #0b121b; }

.actions { display: flex; align-items: center; gap: 12px; }
.form-note { color: var(--muted); font-size: 12px; }

.contact-side { display: grid; align-content: start; gap: 14px; }
.side-title { margin: 0; font-size: 14px; color: var(--muted); text-transform: uppercase; letter-spacing: .6px; }
.contact-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.contact-list li { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dashed var(--color-panel-border); padding-bottom: 8px; }
.contact-list span { color: var(--color-text-dim); }
.contact-side .note { color: var(--color-text-dim); font-size: 12px; }

/* Legal container */
.legal-wrap { padding: 16px; }

/* buttons */
.btn.btn--primary {
  background: linear-gradient(180deg, #203a64, #1a2f52);
  border: 1px solid var(--color-gold);
  color: #fff;
  padding: 10px 18px;
  border-radius: 12px;
  transition: transform .12s ease, box-shadow .2s ease;
}
.btn.btn--primary:hover { transform: translateY(-1px); box-shadow: 0 8px 26px rgba(26,115,232,.35); }

/* accessibility */
.public-root a:focus-visible, .public-root button:focus-visible, .public-root input:focus-visible, .public-root select:focus-visible, .public-root textarea:focus-visible {
  outline: 2px solid #1A73E8; outline-offset: 2px;
}

/* animations */
[data-animate] { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
[data-animate].in { opacity: 1; transform: translateY(0); }
[data-animate="fade-up"] { transform: translateY(16px); }
[data-animate="slide-left"] { transform: translateX(-18px); }
[data-animate="slide-right"] { transform: translateX(18px); }
[data-animate="slide-left"].in, [data-animate="slide-right"].in { transform: translateX(0); }

/* anchor offsets for fixed header */
.anchor { scroll-margin-top: 80px; }
@media (max-width: 900px) { .anchor { scroll-margin-top: 72px; } }

/* responsive */
@media (min-width: 1024px) {
  .app-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 1024px) {
  .contact-wrap { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .split { grid-template-columns: 1fr; }
  .split__media { min-height: 220px; }
  .form-grid { grid-template-columns: 1fr; }
  .tech-mosaic { grid-template-columns: 1fr; }
}

/* reduced motion */
@media (prefers-reduced-motion: reduce) {
  [data-animate] { opacity: 1 !important; transform: none !important; transition: none !important; }
}
`;
