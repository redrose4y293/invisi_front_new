import React, { useEffect, useMemo, useState } from "react";
import adminApi, { adminLogout, adminMe } from "@/services/adminApi";

function Badge({ status }: { status: string }) {
  const color =
    status === "Won" ? "#10B981" : status === "Lost" ? "#EF4444" : "#F59E0B";
  const bg =
    status === "Won"
      ? "rgba(16,185,129,0.12)"
      : status === "Lost"
      ? "rgba(239,68,68,0.12)"
      : "rgba(245,158,11,0.12)";
  return (
    <span
      style={{
        fontSize: 12,
        padding: "3px 8px",
        borderRadius: 999,
        border: `1px solid ${color}`,
        color,
        background: '#fff',
      }}
    >
      {status}
    </span>
  );
}

function Kpi({ title, value }: { title: string; value: number | string }) {
  return (
    <div
      style={{
        background: "linear-gradient(180deg, #0f1a26, #0d151f)",
        border: "1px solid #213042",
        borderRadius: 14,
        padding: 16,
        boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ opacity: 0.8, fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<{
    displayName?: string;
    email?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [kpis, setKpis] = useState<{
    totalLeads: number;
    activeDealers: number;
    proto30d: number;
    downloads30d: number;
  }>({ totalLeads: 0, activeDealers: 0, proto30d: 0, downloads30d: 0 });
  const [dealers, setDealers] = useState<
    Array<{ org: string; region?: string; users?: number }>
  >([]);
  const [leads, setLeads] = useState<
    Array<{ name: string; company?: string; status: string; created: string }>
  >([]);
  const [period, setPeriod] = useState<"today" | "week" | "month">("month");

  const startDate = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    if (period === "today") {
      start.setHours(0, 0, 0, 0);
    } else if (period === "week") {
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
    }
    return start;
  }, [period]);

  const load = async () => {
    try {
      setError("");
      setLoading(true);
      try {
        const u = await adminMe();
        setUser(u);
      } catch {}
      try {
        const stats = await adminApi.get("/admin/stats");
        const s = (stats as any)?.data || stats || {};
        setKpis({
          totalLeads: Number(s.totalLeads || 0),
          activeDealers: Number(s.activeDealers || 0),
          proto30d: Number(s.proto30d || 0),
          downloads30d: Number(s.downloads30d || 0),
        });
      } catch {}
      try {
        const res = await adminApi.get("/dealers");
        const data = (res as any)?.data || res || [];
        const items = (data.items || data)
          .slice(0, 5)
          .map((d: any) => ({
            org: d.org || d.name || d.title || "Dealer",
            region: d.region || d.location || "",
            users: d.users || d.userCount || 0,
          }));
        setDealers(items);
      } catch {}
      try {
        const res = await adminApi.get("/leads");
        const data = (res as any)?.data || res || [];
        const items = (data.items || data)
          .slice(0, 10)
          .map((l: any) => ({
            name: l.name || l.contact || "—",
            company: l.company,
            status: l.status || "New",
            created: l.createdAt || l.created || "",
          }));
        setLeads(items);
      } catch {}
    } catch (e: any) {
      setError(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
  const title = user?.displayName || user?.email || "Admin";

  const recent3 = useMemo(() => {
    const copy = [...leads]
      .filter((l) => l.created)
      .sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    return copy.slice(0, 3);
  }, [leads]);

  return (
    <main style={{ display: "grid", gap: 16, padding: 16 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <span style={{ color: "#9aa4af", fontSize: 12 }}>Overview</span>
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        }}
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "#0E1621",
                border: "1px solid #223",
                borderRadius: 12,
                padding: 20,
                height: 98,
                opacity: 0.7,
              }}
            />
          ))
        ) : error ? (
          <div
            style={{
              gridColumn: "1/-1",
              background: "#2a1515",
              border: "1px solid #442",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div style={{ marginBottom: 8 }}>Error loading KPIs.</div>
            <button
              onClick={load}
              style={{
                padding: "8px 10px",
                border: "1px solid #334",
                borderRadius: 8,
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <Kpi title="Total Leads" value={kpis.totalLeads} />
            <Kpi title="Active Dealers" value={kpis.activeDealers} />
            <Kpi title="Prototype Requests (30d)" value={kpis.proto30d} />
            <Kpi title="File Downloads (30d)" value={kpis.downloads30d} />
          </>
        )}
      </div>

      <div
        style={{
          background: "#0E1621",
          border: "1px solid #223",
          borderRadius: 12,
          padding: 16,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>Active Dealers</strong>
          <a
            href="/admin/dealers"
            style={{
              padding: "6px 10px",
              border: "1px solid #233140",
              borderRadius: 8,
              background: "#0B1117",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            View all
          </a>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {(dealers.length ? dealers : []).map((d) => (
            <div
              key={d.org + String(d.region)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #1c2a39",
                borderRadius: 10,
                padding: "10px 12px",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#1A73E8",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {d.org[0]}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{d.org}</div>
                  <div style={{ fontSize: 12, color: "#9aa4af" }}>
                    {d.region || "—"} • {d.users || 0} users
                  </div>
                </div>
              </div>
              <a
                href="/admin/dealers"
                style={{ fontSize: 12, color: "var(--accent)" }}
              >
                Open
              </a>
            </div>
          ))}
          {!dealers.length && (
            <div style={{ color: "#9aa4af" }}>No active dealers found.</div>
          )}
        </div>
      </div>

      <div
        style={{
          background: "#0E1621",
          border: "1px solid #223",
          borderRadius: 12,
          padding: 16,
          display: "grid",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong>Recent Deals</strong>
          <a
            href="/admin/leads"
            style={{
              padding: "6px 10px",
              border: "1px solid #233140",
              borderRadius: 8,
              background: "#0B1117",
              color: "var(--accent)",
              textDecoration: "none",
            }}
          >
            View all
          </a>
        </div>
        <div
          style={{
            border: "1px solid #223",
            borderRadius: 10,
            overflow: "auto",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: 10,
                    borderBottom: "1px solid #223",
                  }}
                >
                  Company
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: 10,
                    borderBottom: "1px solid #223",
                  }}
                >
                  Contact
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: 10,
                    borderBottom: "1px solid #223",
                  }}
                >
                  Stage
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: 10,
                    borderBottom: "1px solid #223",
                  }}
                >
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {recent3.map((r) => (
                <tr key={r.name + r.created}>
                  <td
                    style={{ padding: 10, borderBottom: "1px solid #16202c" }}
                  >
                    {r.company || "—"}
                  </td>
                  <td
                    style={{ padding: 10, borderBottom: "1px solid #16202c" }}
                  >
                    {r.name}
                  </td>
                  <td
                    style={{ padding: 10, borderBottom: "1px solid #16202c" }}
                  >
                    <Badge status={r.status} />
                  </td>
                  <td
                    style={{ padding: 10, borderBottom: "1px solid #16202c" }}
                  >
                    {r.created}
                  </td>
                </tr>
              ))}
              {!recent3.length && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: 12,
                      textAlign: "center",
                      color: "#9aa4af",
                    }}
                  >
                    No recent deals to show.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        style={{
          background: "#0E1621",
          border: "1px solid #223",
          borderRadius: 12,
          padding: 16,
          display: "grid",
          gap: 8,
        }}
      >
        <strong>Quick Actions</strong>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/admin/content">Add Product</a>
          <a href="/admin/files">Add File</a>
          <a href="/admin/dealers">Invite Dealer</a>
          <a href="/admin/leads">Export Leads</a>
        </div>
      </div>
    </main>
  );
}
