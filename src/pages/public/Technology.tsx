import React from "react";
import Section from "@/components/common/Section";

export default function Technology() {
  const base = (import.meta as any)?.env?.VITE_API_BASE || '';
  return (
    <div>
      <Section title="How It Works">
        Layers diagram and description......
      </Section>
      <Section title="Performance Charts">
        Charts placeholder (CSS blocks).
      </Section>
      <Section title="Documents">
        <ul>
          <li>
            <a href={(base? base: '') + "/api/v1/docs/InvisiShield_Tech_Specs.pdf"} target="_blank">
              Tech Specs......
            </a>
          </li>
          <li>
            <a
              href={(base? base: '') + "/api/v1/docs/InvisiShield_Patent_Summary.pdf"}
              target="_blank"
            >
              Patent Summary
            </a>
          </li>
        </ul>
      </Section>
    </div>
  );
}
