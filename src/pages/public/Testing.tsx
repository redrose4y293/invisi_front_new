import React from 'react';
import Section from '@/components/common/Section';
import VideoLightbox from '@/components/common/VideoLightbox';

export default function Testing() {
  const base = (import.meta as any)?.env?.VITE_API_BASE || '';
  return (
    <div>
      <Section title="Test Videos">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <VideoLightbox src="/videos/sample1.mp4" />
          <VideoLightbox src="/videos/sample2.mp4" />
        </div>
      </Section>
      <Section title="Reports">
        <ul>
          <li><a href={(base? base: '') + "/api/v1/docs/InvisiShield_Testing_Report.pdf"} target="_blank">Testing Report</a></li>
        </ul>
      </Section>
    </div>
  );
}
