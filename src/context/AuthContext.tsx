import React, { createContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('dealer_token'));

  const value = useMemo(
    () => ({
      isAuthenticated: !!token,
      token,
      login: (t: string) => { setToken(t); localStorage.setItem('dealer_token', t); },
      logout: () => { setToken(null); localStorage.removeItem('dealer_token'); },
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
