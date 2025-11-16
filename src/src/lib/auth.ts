import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { api, setTokens, clearTokens } from './api';

export const AUTH_KEY = 'auth';

export function isAuthed(){
  try {
    const access = localStorage.getItem('api_access_token');
    return Boolean(access);
  } catch { return false; }
}

export async function login(email: string, password: string){
  const res = await api.post<{ accessToken?: string; refreshToken?: string }>('/auth/login', { email, password });
  setTokens({ accessToken: (res as any)?.accessToken || '', refreshToken: (res as any)?.refreshToken || '' });
  localStorage.setItem(AUTH_KEY, 'true');
  return true;
}

export function logout(){
  (async ()=>{
    try {
      // Try to notify backend (best-effort)
      const refreshToken = localStorage.getItem('api_refresh_token') || '';
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
    } catch {}
    try { clearTokens(); } catch {}
    try { localStorage.removeItem(AUTH_KEY); } catch {}
  })();
}

export function ProtectedRoute({ children }:{ children: ReactNode }){
  if (!isAuthed()) return React.createElement(Navigate as any, { to: '/auth/login', replace: true });
  return React.createElement(React.Fragment, null, children);
}

export async function me(){
  try { return await api.get('/auth/me'); } catch { return null; }
}

export async function requestPasswordReset(email: string){
  await api.post('/auth/request-password-reset', { email });
  return true;
}

export async function resetPassword(token: string, newPassword: string){
  await api.post('/auth/reset-password', { token, newPassword });
  return true;
}
