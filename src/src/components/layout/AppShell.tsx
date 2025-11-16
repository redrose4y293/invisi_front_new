import { Link, NavLink, Outlet } from 'react-router-dom';
import { ProtectedRoute, me } from '../../lib/auth';
import { useState, useEffect } from 'react';
import Drawer from '../ui/Drawer';

function Topbar({ onMenu, isMobile }:{ onMenu: ()=>void; isMobile: boolean }){
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [user, setUser] = useState<{ displayName?: string; email?: string }|null>(null);
  useEffect(()=>{
    const root = document.documentElement;
    if (dark) { root.setAttribute('data-theme', 'dark'); localStorage.setItem('theme','dark'); }
    else { root.removeAttribute('data-theme'); localStorage.setItem('theme','light'); }
  },[dark]);
  useEffect(()=>{
    (async ()=>{
      try { const u = await me(); setUser(u as any); } catch {}
    })();
  },[]);
  const title = user?.displayName || user?.email || 'Admin';
  const initial = (title?.trim()?.[0] || 'A').toUpperCase();
  return (
    <header style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', alignItems:'center', gap:12, padding:'10px 16px', borderBottom:'1px solid #223', background:'#0E1621', position:'sticky', top:0, zIndex:30 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {isMobile && (
          <button aria-label="Open menu" onClick={onMenu} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:34, height:34, borderRadius:8, border:'1px solid #233140', background:'#0B1117', color:'#C5C6C7' }}>
            ☰
          </button>
        )}
        <Link to="/app/dashboard" style={{ display:'flex', alignItems:'center', gap:8, color:'var(--accent)', fontWeight:700 }}>
          <img src="/logo.jpg" alt="InvisiShield" style={{ width:22, height:22, borderRadius:4, objectFit:'contain', background:'#0B1117' }} />
          <span>InvisiShield Admin</span>
        </Link>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <input placeholder="Search" aria-label="Search" style={{ width:'min(600px, 100%)', padding:'8px 12px', borderRadius:12, border:'1px solid #233140', background:'#0B1117', color:'#E6E6E6', boxShadow:'inset 0 1px 1px rgba(0,0,0,0.2)' }} />
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:12 }}>
        <label style={{ display:'flex', alignItems:'center', gap:6, color:'#C5C6C7', fontSize:12 }}>
          <input type="checkbox" checked={dark} onChange={()=> setDark(v=>!v)} /> Dark
        </label>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 8px', border:'1px solid #233140', borderRadius:12, background:'#0B1117' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:'#1A73E8', display:'grid', placeItems:'center', color:'#fff', fontSize:12 }}>{initial}</div>
          <span style={{ color:'#C5C6C7', fontSize:12 }}>{title}</span>
        </div>
      </div>
    </header>
  );
}

function Sidebar({ onNavigate }:{ onNavigate?: ()=>void } = {}){
  const Item = ({ to, icon, label }:{ to:string; icon:string; label:string }) => (
    <NavLink to={to}
      style={({isActive})=> ({
        color: isActive? '#fff': '#C5C6C7',
        background: isActive? '#172230':'transparent',
        border:'1px solid ' + (isActive? '#2a3a4d' : '#131b24'),
        display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12,
        boxShadow: isActive? '0 6px 14px rgba(0,0,0,0.28) inset, 0 2px 10px rgba(0,0,0,0.25)':'inset 0 0 0 1px rgba(0,0,0,0)',
        transition:'background 120ms ease, border-color 120ms ease, color 120ms ease'
      })}
      onClick={onNavigate}
    >
      <span aria-hidden style={{ width:22, height:22, display:'grid', placeItems:'center', borderRadius:6, background:'#0E1621', border:'1px solid #223' }}>{icon}</span>
      <span style={{ fontWeight:600 }}>{label}</span>
    </NavLink>
  );
  return (
    <aside style={{ width:240, borderRight:'1px solid #223', padding:14, background:'linear-gradient(180deg, #0B121B, #0a1119)', overflowY:'auto' }}>
      <div style={{ color:'#8ea0af', fontSize:11, letterSpacing:0.4, margin:'2px 0 8px 4px' }}>Navigation</div>
      <nav style={{ display:'grid', gap:6 }}>
        <Item to="/app/dashboard" icon="▦" label="Dashboard"/>
        <Item to="/app/leads" icon="▣" label="Leads"/>
        <Item to="/app/dealers" icon="👥" label="Dealers"/>
        <Item to="/app/content" icon="📦" label="Content"/>
        <Item to="/app/files" icon="📁" label="Files"/>
        {/** Settings hidden for now */}
      </nav>
    </aside>
  );
}

export default function AppShell(){
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(()=>{
    const onResize = ()=> setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', onResize);
    return ()=> window.removeEventListener('resize', onResize);
  },[]);
  return (
    <ProtectedRoute>
      <div style={{ display:'grid', gridTemplateRows:'auto 1fr', height:'100%' }}>
        <Topbar onMenu={()=> setSidebarOpen(true)} isMobile={isMobile} />
        <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '240px 1fr', minHeight:0 }}>
          {!isMobile && <Sidebar />}
          <main style={{ padding:16, minWidth:0 }}>
            <Outlet />
          </main>
        </div>
        {isMobile && (
          <Drawer open={sidebarOpen} onClose={()=> setSidebarOpen(false)} title="Menu" width={300}>
            <Sidebar onNavigate={()=> setSidebarOpen(false)} />
          </Drawer>
        )}
      </div>
    </ProtectedRoute>
  );
}
