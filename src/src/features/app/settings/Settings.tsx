import { useEffect, useMemo, useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

type Branding = { brand:string; logoUrl:string; primary:string; secondary:string; email:string; phone:string; language:'en'|'es'|'ar'|'fr'; timezone:string; currency:string; langs:{ es:boolean; ar:boolean; fr:boolean } };
type UserRow = { id:string; name:string; email:string; role:'Admin'|'Marketing'|'Dealer Manager'; status:'Active'|'Invited'|'Disabled'; last:string };
type Security = { requireMfa:boolean; sessionTimeout:number; ipAllow:string };

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hexRx = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

function toast(msg:string){
  // very small toast
  const el = document.createElement('div');
  el.textContent = msg;
  Object.assign(el.style, { position:'fixed', bottom:'16px', right:'16px', background:'#0E1621', color:'#E6E6E6', border:'1px solid #223', padding:'10px 12px', borderRadius:'8px', zIndex:100 });
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 1800);
}

export default function Settings(){
  const [branding, setBranding] = useState<Branding>(()=>{
    const s = localStorage.getItem('settings.branding');
    return s ? JSON.parse(s) : { brand:'InvisiShield', logoUrl:'/logo.png', primary:'#00264D', secondary:'#1A73E8', email:'info@example.com', phone:'', language:'en', timezone:'UTC', currency:'USD', langs:{ es:true, ar:false, fr:false } };
  });
  const [users, setUsers] = useState<UserRow[]>(()=>[
    { id:'u1', name:'Admin', email:'admin@example.com', role:'Admin', status:'Active', last:'2025-10-20' },
  ]);
  const [security, setSecurity] = useState<Security>(()=>{
    const s = localStorage.getItem('settings.security');
    return s ? JSON.parse(s) : { requireMfa:false, sessionTimeout:30, ipAllow:'' };
  });

  useEffect(()=>{ localStorage.setItem('settings.branding', JSON.stringify(branding)); }, [branding]);
  useEffect(()=>{ localStorage.setItem('settings.security', JSON.stringify(security)); }, [security]);

  const saveBranding = () => {
    if (branding.email && !emailRx.test(branding.email)) return toast('Invalid email');
    if (branding.primary && !hexRx.test(branding.primary)) return toast('Invalid primary color');
    if (branding.secondary && !hexRx.test(branding.secondary)) return toast('Invalid secondary color');
    const prev = JSON.parse(localStorage.getItem('settings.branding')||'null');
    toast('Branding saved');
    // undo
    const id = setTimeout(()=>{}, 0);
    (window as any).lastUndo = () => { setBranding(prev); toast('Undo applied'); };
  };

  const inviteUser = (name:string, email:string, role:UserRow['role']) => {
    if (!emailRx.test(email)) return toast('Invalid email');
    const row: UserRow = { id:String(Date.now()), name, email, role, status:'Invited', last:new Date().toISOString().slice(0,10) };
    setUsers(prev => [row, ...prev]);
    toast('Invite sent');
  };

  const changeRole = (id:string, role:UserRow['role']) => { setUsers(prev => prev.map(u => u.id===id ? { ...u, role } : u)); toast('Role updated'); };
  const deactivate = (id:string) => { setUsers(prev => prev.map(u => u.id===id ? { ...u, status:'Disabled' } : u)); toast('User deactivated'); };

  const saveSecurity = () => { if (security.sessionTimeout <= 0) return toast('Timeout must be positive'); toast('Security saved'); };

  return (
    <div style={{ display:'grid', gap:12 }}>
      <h1>Settings</h1>

      {/* General & Branding */}
      <details open>
        <summary>General & Branding</summary>
        <div style={{ padding:12, border:'1px solid #223', borderRadius:12, display:'grid', gap:10 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <Input label="Brand Name" value={branding.brand} onChange={(e)=> setBranding({ ...branding, brand: e.target.value })} />
            <Input label="Logo URL" value={branding.logoUrl} onChange={(e)=> setBranding({ ...branding, logoUrl: e.target.value })} hint="File in /public like /logo.png" />
            <label>Primary Color<input type="text" value={branding.primary} onChange={(e)=> setBranding({ ...branding, primary: e.target.value })} /></label>
            <label>Secondary Color<input type="text" value={branding.secondary} onChange={(e)=> setBranding({ ...branding, secondary: e.target.value })} /></label>
            <Input label="Contact Email" value={branding.email} onChange={(e)=> setBranding({ ...branding, email: e.target.value })} />
            <Input label="Phone" value={branding.phone} onChange={(e)=> setBranding({ ...branding, phone: e.target.value })} />
            <label>Default Language<select value={branding.language} onChange={(e)=> setBranding({ ...branding, language: e.target.value as any })}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
            </select></label>
            <label>Timezone<input value={branding.timezone} onChange={(e)=> setBranding({ ...branding, timezone: e.target.value })} /></label>
            <label>Currency<input value={branding.currency} onChange={(e)=> setBranding({ ...branding, currency: e.target.value })} /></label>
          </div>
          <div style={{ display:'flex', gap:16, alignItems:'center' }}>
            <label style={{ display:'flex', gap:6, alignItems:'center' }}><input type="checkbox" checked={branding.langs.es} onChange={(e)=> setBranding({ ...branding, langs: { ...branding.langs, es: e.target.checked } })}/> Enable ES</label>
            <label style={{ display:'flex', gap:6, alignItems:'center' }}><input type="checkbox" checked={branding.langs.ar} onChange={(e)=> setBranding({ ...branding, langs: { ...branding.langs, ar: e.target.checked } })}/> Enable AR</label>
            <label style={{ display:'flex', gap:6, alignItems:'center' }}><input type="checkbox" checked={branding.langs.fr} onChange={(e)=> setBranding({ ...branding, langs: { ...branding.langs, fr: e.target.checked } })}/> Enable FR</label>
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button onClick={saveBranding}>Save</Button>
            <Button variant="secondary" onClick={()=> { const b = localStorage.getItem('settings.branding'); if (b) setBranding(JSON.parse(b)); }}>Undo</Button>
          </div>
        </div>
      </details>

      {/* Users & Roles */}
      <details>
        <summary>Users & Roles</summary>
        <div style={{ padding:12, border:'1px solid #223', borderRadius:12, display:'grid', gap:10 }}>
          <InviteUser onInvite={inviteUser} />
          <div style={{ border:'1px solid #223', borderRadius:10, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead><tr>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Name</th>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Email</th>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Role</th>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Status</th>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}>Last seen</th>
                <th style={{ textAlign:'left', padding:10, borderBottom:'1px solid #223' }}></th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{u.name}</td>
                    <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{u.email}</td>
                    <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>
                      <select value={u.role} onChange={(e)=> changeRole(u.id, e.target.value as any)}>
                        <option>Admin</option>
                        <option>Marketing</option>
                        <option>Dealer Manager</option>
                      </select>
                    </td>
                    <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{u.status}</td>
                    <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>{u.last}</td>
                    <td style={{ padding:10, borderBottom:'1px solid #16202c' }}>
                      <button onClick={()=> deactivate(u.id)} style={{ padding:'6px 10px', border:'1px solid #334', borderRadius:8 }}>Deactivate</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      {/* Audit & Security */}
      <details>
        <summary>Audit & Security</summary>
        <div style={{ padding:12, border:'1px solid #223', borderRadius:12, display:'grid', gap:10 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <label style={{ display:'flex', gap:6, alignItems:'center' }}><input type="checkbox" checked={security.requireMfa} onChange={(e)=> setSecurity({ ...security, requireMfa: e.target.checked })}/> Require MFA</label>
            <label>Session timeout (mins) <input type="number" min={1} value={security.sessionTimeout} onChange={(e)=> setSecurity({ ...security, sessionTimeout: Number(e.target.value) })} style={{ width:100 }}/></label>
          </div>
          <label>IP allowlist<textarea rows={4} value={security.ipAllow} onChange={(e)=> setSecurity({ ...security, ipAllow: e.target.value })} placeholder="One CIDR or IP per line"/></label>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
            <Button onClick={saveSecurity}>Save</Button>
          </div>
          <div style={{ border:'1px solid #223', borderRadius:10, padding:8 }}>Activity log table (placeholder)</div>
        </div>
      </details>
    </div>
  );
}

function InviteUser({ onInvite }:{ onInvite:(name:string, email:string, role:UserRow['role'])=>void }){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRow['role']>('Marketing');
  return (
    <div style={{ display:'flex', gap:8, alignItems:'end', flexWrap:'wrap' }}>
      <Input label="Name" value={name} onChange={(e)=> setName(e.target.value)} />
      <Input label="Email" value={email} onChange={(e)=> setEmail(e.target.value)} />
      <label style={{ display:'grid', gap:6 }}>
        <div style={{ fontSize:12, color:'#C5C6C7' }}>Role</div>
        <select value={role} onChange={(e)=> setRole(e.target.value as any)}>
          <option>Admin</option>
          <option>Marketing</option>
          <option>Dealer Manager</option>
        </select>
      </label>
      <Button onClick={()=> onInvite(name, email, role)}>Invite User</Button>
    </div>
  );
}
