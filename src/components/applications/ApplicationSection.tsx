import React from 'react';
import CTAButton from '@/components/common/CTAButton';

type Props = {
  id?: string;
  title: string;
  description: string;
  media?: string; // image or video url
  bullets?: string[];
};

export default function ApplicationSection({ id, title, description, media, bullets = [] }: Props) {
  return (
    <section id={id} className="card" style={{ padding: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(240px, 460px) 1fr', gap: 16, alignItems: 'center' }}>
        <div>
          {media ? (
            media.endsWith('.mp4') ? (
              <video src={media} controls style={{ width: '100%', borderRadius: 12, background: '#000' }} />
            ) : (
              <img src={media} alt={title} style={{ width: '100%', borderRadius: 12 }} />
            )
          ) : (
            <div style={{ height: 200, borderRadius: 12, background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))' }} />
          )}
        </div>
        <div>
          <h3 style={{ marginTop: 0 }}>{title}</h3>
          <p style={{ color: 'var(--color-text)' }}>{description}</p>
          {bullets.length ? (
            <ul style={{ marginTop: 8 }}>
              {bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          ) : null}
          <div style={{ marginTop: 12 }}>
            <CTAButton href="#contact">Request a Quote</CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
