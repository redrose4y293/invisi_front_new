import React from "react";
import CTAButton from "@/components/common/CTAButton";

export default function Hero() {
  const heroVars = {
    "--hero-fit": "contain",
    "--hero-pos": "center 50%",
  } as React.CSSProperties;
  return (
    <section className="full-bleed" style={{ position: "relative" }}>
      <style>{css}</style>
      <div className="hero-wrap" style={heroVars}>
        <img
          className="hero-img"
          src={"../../assets/logo/hero3.png"}
          alt="InvisiShield Hero"
        />
        <div className="hero-overlay" />
        <div
          className="container hero-content"
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            alignItems: "center",
          }}
        >
          <div className="hero-inner">
            {/* <div className="hero-badge">Transparent Ballistic Protection</div> */}
            <p className="hero-sub">
              InvisiShield™ is the global leader in transparent ballistic
              protection. Engineered for clarity, performance, and safety.
            </p>
            <div className="hero-actions">
              <CTAButton href="#testing">See the Proof</CTAButton>
              <CTAButton href="#contact" variant="ghost">
                Request a Prototype
              </CTAButton>
              <CTAButton href="/login" variant="ghost">
                Login
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const css = `
.hero-wrap { position: relative; height: calc(100vh - 64px); min-height: 520px; }
.hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: var(--hero-fit, cover); object-position: var(--hero-pos, center 50%); display: block; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.15) 100%); }
.hero-inner { max-width: 860px; padding: 64px 16px; color: var(--color-text); }
.hero-badge { display: inline-block; padding: 8px 12px; border-radius: 999px; background: rgba(13, 28, 52, 0.45); border: 1px solid rgba(255,255,255,0.35); backdrop-filter: blur(3px); margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; font-size: 12px; }
.hero-sub { color: var(--color-text); margin-top: 300px; max-width: 720px; font-size: 18px; opacity: 0.96; text-shadow: 0 2px 10px rgba(0,0,0,0.4); }
.hero-actions { display: flex; gap: 14px; margin-top: 24px; flex-wrap: wrap; }

@media (max-width: 900px)  { .hero-wrap { height: calc(100vh - 56px); } .hero-inner { padding: 48px 16px; } }
@media (max-width: 640px)  { .hero-inner { padding: 36px 14px; } .hero-sub { font-size: 16px; } }
`;
