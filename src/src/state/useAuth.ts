import { create } from 'zustand';

interface AuthState {
  token: string | null;
  role: 'super'|'content'|'ops'|'dealer_manager'|'compliance'|'analyst'|null;
  setToken: (newToken: string|null) => void;
  setRole: (newRole: AuthState['role']) => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  role: 'super',
  setToken: (newToken) => { if (newToken) localStorage.setItem('token', newToken); else localStorage.removeItem('token'); set({ token: newToken }); },
  setRole: (newRole) => set({ role: newRole }),
}));
