// Simple API client with dummy base URL and token helpers
// Switch to a real URL later via VITE_API_BASE_URL

function normalizeBase(input?: string): string {
  let v = (input || '').toString().trim();
  if (!v) return 'http://localhost:8080/api/v1';
  // If someone put just ":8080/api/v1" or "localhost:8080/api/v1", fix it
  if (v.startsWith(':')) v = 'http://localhost' + v; // ":8080/..." -> http://localhost:8080/...
  if (!/^https?:\/\//i.test(v)) v = 'http://' + v; // prepend scheme if missing
  try { new URL(v); } catch { return 'http://localhost:8080/api/v1'; }
  return v.replace(/\/$/, '');
}

export const API_BASE_URL = normalizeBase((import.meta as any).env?.VITE_API_BASE_URL);

const ACCESS_KEY = 'api_access_token';
const REFRESH_KEY = 'api_refresh_token';

export function setTokens(tokens: { accessToken?: string; refreshToken?: string } = {}){
  if (tokens.accessToken !== undefined) localStorage.setItem(ACCESS_KEY, tokens.accessToken || '');
  if (tokens.refreshToken !== undefined) localStorage.setItem(REFRESH_KEY, tokens.refreshToken || '');
}

export function clearTokens(){
  try { localStorage.removeItem(ACCESS_KEY); localStorage.removeItem(REFRESH_KEY); } catch {}
}

export function getAccessToken(){
  try { return localStorage.getItem(ACCESS_KEY) || ''; } catch { return ''; }
}

function getRefreshToken(){
  try { return localStorage.getItem(REFRESH_KEY) || ''; } catch { return ''; }
}

let refreshing: Promise<boolean> | null = null;
async function tryRefreshToken(): Promise<boolean> {
  if (!getRefreshToken()) return false;
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(API_BASE_URL.replace(/\/$/, '') + '/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: getRefreshToken() })
        });
        if (!res.ok) { refreshing = null; return false; }
        const data = await res.json().catch(()=> ({}));
        setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        refreshing = null;
        return true;
      } catch {
        refreshing = null; return false;
      }
    })();
  }
  return refreshing;
}

export async function apiFetch<T = any>(path: string, init: RequestInit = {}): Promise<T>{
  const headers = new Headers(init.headers || {});
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const token = getAccessToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const base = API_BASE_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : 'http://localhost:8080/api/v1');
  const url = base.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
  const doFetch = () => fetch(url, {
    ...init,
    headers,
  });

  let res = await doFetch();

  if (res.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      const retryHeaders = new Headers(init.headers || {});
      if (!retryHeaders.has('Content-Type') && !(init.body instanceof FormData)) retryHeaders.set('Content-Type', 'application/json');
      const newToken = getAccessToken();
      if (newToken) retryHeaders.set('Authorization', `Bearer ${newToken}`);
      res = await fetch(url, { ...init, headers: retryHeaders });
    }
  }

  const isJson = (res.headers.get('content-type') || '').includes('application/json');
  if (!res.ok){
    const errBody = isJson ? await res.json().catch(()=>({})) : await res.text().catch(()=> '');
    throw { status: res.status, body: errBody };
  }
  return (isJson ? await res.json() : (await res.text())) as T;
}

// Convenience helpers
export const api = {
  get: <T=any>(p: string) => apiFetch<T>(p, { method: 'GET' }),
  post: <T=any>(p: string, body?: any) => apiFetch<T>(p, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: <T=any>(p: string, body?: any) => apiFetch<T>(p, { method: 'PATCH', body: JSON.stringify(body) }),
  del: <T=any>(p: string) => apiFetch<T>(p, { method: 'DELETE' }),
};
