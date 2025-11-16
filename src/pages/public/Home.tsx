import React from 'react';
import Hero from '@/components/common/Hero';
import Section from '@/components/common/Section';

export default function Home() {
  return (
    <div>
      <Hero />
      <Section title="Comparison">
        <p>Comparison content and CTAs go here.</p>
      </Section>
      <Section title="Get Started">
        <p>Primary CTAs.</p>
      </Section>
    </div>
  );
}
