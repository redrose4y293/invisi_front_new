import React, { useState } from "react";
import FileDownloadCard from "@/components/technology/FileDownloadCard";

const tabs = ["Patents", "Privacy Policy", "NDA / Partner Access"] as const;

type Tab = (typeof tabs)[number];

export default function LegalTabs() {
  const [active, setActive] = useState<Tab>("Patents");

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className="card"
            style={{
              padding: "8px 12px",
              color: "#fff",
              cursor: "pointer",
              background:
                active === t ? "rgba(26,115,232,0.15)" : "var(--color-surface)",
              border:
                active === t
                  ? "1px solid var(--color-primary)"
                  : "1px solid var(--color-border)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        {active === "Patents" && (
          <div style={{ display: "grid", gap: 12 }}>
            <p>
              InvisiShield™ technologies are protected by pending and granted
              patents. The following summary outlines our core claims around
              multi-layer transparent composites, adhesion systems, and
              impact-dispersion design.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 12,
              }}
            >
              <FileDownloadCard
                title="Patent Summary"
                subtitle="PDF"
                href="/api/v1/docs/InvisiShield_Patent_Summary.pdf"
              />
            </div>
          </div>
        )}

        {active === "Privacy Policy" && (
          <div className="card" style={{ padding: 16 }}>
            <h4 style={{ marginTop: 0 }}>Privacy Policy</h4>
            <p>
              We collect minimal personal data required to process inquiries and
              dealer applications. Information is used solely to provide
              requested services and is never sold. You may request access,
              correction, or deletion of your data at any time by contacting
              privacy@invisishield.com.
            </p>
            <p>
              Data may be processed by trusted vendors for email and file
              storage. We retain records only as long as necessary for legal and
              operational purposes. For full details, provide your final policy
              text and we will replace this placeholder copy.
            </p>
          </div>
        )}

        {active === "NDA / Partner Access" && (
          <div style={{ display: "grid", gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <h4 style={{ marginTop: 0 }}>NDA & Secure Materials</h4>
              <p>
                Partners may request access to detailed drawings, test reports,
                and manufacturing notes by completing our Non‑Disclosure
                Agreement (NDA). Submit the signed NDA and your company details
                to receive portal credentials.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 12,
                }}
              >
                <FileDownloadCard
                  title="NDA Form"
                  subtitle="PDF"
                  href="/api/v1/docs/NDA_Form.pdf"
                />
              </div>
              <p style={{ marginTop: 12 }}>
                After signing, email the form to partners@invisishield.com or
                upload via your dealer portal account.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
