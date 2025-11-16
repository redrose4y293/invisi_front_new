import React from 'react';
import { useParams } from 'react-router-dom';
import Section from '@/components/common/Section';

export default function ProductDetail() {
  const { slug } = useParams();
  return (
    <div>
      <Section title={`Product: ${slug}`}>
        <p>Product detail content placeholder.</p>
      </Section>
    </div>
  );
}
