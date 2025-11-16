import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function AdminProtected({ children }: { children: React.ReactNode }){
  const loc = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('api_access_token') : null;
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: loc }} replace />;
  }
  return <>{children}</>;
}
