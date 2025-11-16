import React, { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import AdminProtected from "@/pages/admin/Protected";
import { adminMe } from "@/services/adminApi";
import { createAdminUser } from "@/services/adminApi";

function Topbar({
  onMenu,
  isMobile,
}: {
  onMenu: () => void;
  isMobile: boolean;
}) {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  const [user, setUser] = useState<{
    displayName?: string;
    email?: string;
  } | null>(null);
  const [openReg, setOpenReg] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const set = (k: string, v: string) => setForm((s) => ({ ...s, [k]: v }));
  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);
  useEffect(() => {
    (async () => {
      try {
        const u = await adminMe();
        setUser(u);
      } catch {}
    })();
  }, []);
  const title = user?.displayName || user?.email || "Admin";
  const initial = (title?.trim()?.[0] || "A").toUpperCase();
  return (
    <header
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        borderBottom: "2px solid var(--color-gold)",
        background: "var(--color-brand-red)",
        boxShadow: "0 2px 0 rgba(215,163,51,0.35), 0 8px 18px rgba(0,0,0,0.25)",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {isMobile && (
          <button
            aria-label="Open menu"
            onClick={onMenu}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: 8,
              border: "1px solid #233140",
              background: "#0B1117",
              color: "#C5C6C7",
            }}
          >
            ☰
          </button>
        )}
        <Link
          to="/admin"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "var(--accent)",
            fontWeight: 700,
          }}
        >
          <img
            src="/logo.jpg"
            alt="InvisiShield"
            style={{
              width: 22,
              height: 22,
              borderRadius: 4,
              objectFit: "contain",
              background: "#0B1117",
            }}
          />
          <span>InvisiShield Admin</span>
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input
          placeholder="Search"
          aria-label="Search"
          style={{
            width: "min(600px, 100%)",
            padding: "8px 12px",
            borderRadius: 12,
            border: "1px solid #233140",
            background: "#0B1117",
            color: "#E6E6E6",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.2)",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 12,
        }}
      >
        <button
          onClick={() => {
            setErr("");
            setDone(false);
            setForm({ name: "", email: "", password: "" });
            setOpenReg(true);
          }}
          style={{
            padding: "8px 10px",
            border: "1px solid #233140",
            borderRadius: 10,
            background: "linear-gradient(180deg,#1a73e8,#145fbe)",
            color: "#fff",
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          Register Admin
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 8px",
            border: "1px solid #233140",
            borderRadius: 12,
            background: "#0B1117",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#1A73E8",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontSize: 12,
            }}
          >
            {initial}
          </div>
          <span style={{ color: "#C5C6C7", fontSize: 12 }}>{title}</span>
        </div>
      </div>
      {openReg && (
        <div
          role="dialog"
          aria-modal
          onClick={() => !submitting && setOpenReg(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 50,
            display: "grid",
            placeItems: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(520px, 100%)",
              background: "#0B121B",
              border: "1px solid #223",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <strong>Register a new admin..........</strong>
              <button
                aria-label="Close"
                onClick={() => !submitting && setOpenReg(false)}
                style={{ background: "transparent", border: "none", color: "#C5C6C7", cursor: "pointer", fontSize: 18 }}
              >
                ×
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setErr("");
                setSubmitting(true);
                try {
                  await createAdminUser(form.name, form.email, form.password);
                  setDone(true);
                  setTimeout(() => setOpenReg(false), 900);
                } catch (er: any) {
                  const msg = er?.response?.data?.error || er?.message || "Failed to create admin";
                  setErr(String(msg));
                } finally {
                  setSubmitting(false);
                }
              }}
              style={{ display: "grid", gap: 10 }}
            >
              {err && <div style={{ color: "#FF6B6B", fontSize: 12 }}>{err}</div>}
              {done && <div style={{ color: "#10B981", fontSize: 12 }}>Admin created successfully.</div>}
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.7 }}>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                  required
                  style={{ padding: 12, borderRadius: 10, border: "1px solid #334", background: "#0B1117", color: "#E6E6E6", outline: "none" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.7 }}>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value.toLowerCase().trim())}
                  placeholder="admin@company.com"
                  autoComplete="email"
                  required
                  style={{ padding: 12, borderRadius: 10, border: "1px solid #334", background: "#0B1117", color: "#E6E6E6", outline: "none" }}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span style={{ fontSize: 12, opacity: 0.7 }}>Temporary password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  required
                  style={{ padding: 12, borderRadius: 10, border: "1px solid #334", background: "#0B1117", color: "#E6E6E6", outline: "none" }}
                />
              </label>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => !submitting && setOpenReg(false)}
                  style={{ padding: "10px 12px", border: "1px solid #334", borderRadius: 10, background: "#0B1117", color: "#C5C6C7" }}
                >
                  Cancel
                </button>
                <button
                  disabled={submitting || done}
                  type="submit"
                  style={{ padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, background: "linear-gradient(180deg,#1a73e8,#145fbe)", color: "white", cursor: "pointer", opacity: submitting || done ? 0.7 : 1 }}
                >
                  {submitting ? "Creating..." : done ? "Created" : "Create Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const Item = ({
    to,
    icon,
    label,
  }: {
    to: string;
    icon: string;
    label: string;
  }) => (
    <NavLink
      to={to}
      end={to === "/admin"}
      style={({ isActive }) => ({
        color: isActive ? "#ffffff" : "#C5C6C7",
        background: isActive ? "#142234" : "transparent",
        border: isActive ? "2px solid var(--color-gold)" : "1px solid #131b24",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 12,
        boxShadow: isActive
          ? "0 0 0 1px rgba(215,163,51,0.45), 0 10px 22px rgba(0,0,0,0.35)"
          : "inset 0 0 0 1px rgba(0,0,0,0)",
        transition:
          "background 120ms ease, border-color 120ms ease, color 120ms ease, box-shadow 120ms ease",
      })}
      onClick={onNavigate}
    >
      <span
        aria-hidden
        style={{
          width: 22,
          height: 22,
          display: "grid",
          placeItems: "center",
          borderRadius: 6,
          background: "#0E1621",
          border: "1px solid #223",
        }}
      >
        {icon}
      </span>
      <span style={{ fontWeight: 600 }}>{label}</span>
    </NavLink>
  );
  return (
    <aside
      style={{
        width: 240,
        borderRight: "1px solid #223",
        padding: 14,
        background: "linear-gradient(180deg, #0B121B, #0a1119)",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          color: "#8ea0af",
          fontSize: 11,
          letterSpacing: 0.4,
          margin: "2px 0 8px 4px",
        }}
      >
        Navigation
      </div>
      <nav style={{ display: "grid", gap: 6 }}>
        <Item to="/admin" icon="▦" label="Dashboard" />
        <Item to="/admin/leads" icon="▣" label="Leads" />
        <Item to="/admin/dealers" icon="👥" label="Dealers" />
        <Item to="/admin/content" icon="📦" label="Content" />
        <Item to="/admin/files" icon="📁" label="Files" />
      </nav>
    </aside>
  );
}

export default function AppShell() {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth <= 1024 : false
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return (
    <AdminProtected>
      <div
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr",
          height: "100%",
        }}
      >
        <Topbar onMenu={() => setSidebarOpen(true)} isMobile={isMobile} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "240px 1fr",
            minHeight: 0,
          }}
        >
          {!isMobile && <Sidebar />}
          <main style={{ padding: 16, minWidth: 0 }}>
            <Outlet />
          </main>
        </div>
        {/* Simple mobile drawer */}
        {isMobile && sidebarOpen && (
          <div
            role="dialog"
            aria-modal
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 40,
            }}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: 300,
                background: "#0B121B",
                borderRight: "1px solid #223",
                padding: 12,
              }}
            >
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </AdminProtected>
  );
}
