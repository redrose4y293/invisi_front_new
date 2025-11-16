import { createBrowserRouter, redirect } from 'react-router-dom';

const lazy = async (p: Promise<any>) => ({ Component: (await p).default });

export const router = createBrowserRouter([
  // Auth (public)
  { path: '/auth/login', async lazy() { return lazy(import('../pages/Login')); } },
  { path: '/auth/register', async lazy() { return lazy(import('../pages/Register')); } },
  { path: '/auth/forgot', async lazy() { return lazy(import('../pages/Forgot')); } },
  { path: '/auth/reset', async lazy() { return lazy(import('../pages/Reset')); } },
  { path: '/auth', loader: () => redirect('/auth/login') },

  // Root redirect to app dashboard
  { path: '/', loader: () => redirect('/auth/login') },

  // App (protected) shell with 6 screens
  {
    path: '/app',
    async lazy() { return lazy(import('../components/layout/AppShell')); },
    children: [
      { path: 'dashboard', async lazy() { return lazy(import('../features/app/dashboard/Dashboard')); } },
      { path: 'leads', async lazy() { return lazy(import('../features/app/leads/Leads')); } },
      { path: 'dealers', async lazy() { return lazy(import('../features/app/dealers/Dealers')); } },
      { path: 'content', async lazy() { return lazy(import('../features/app/content/Content')); } },
      { path: 'files', async lazy() { return lazy(import('../features/app/files/Files')); } },
      // { path: 'settings', async lazy() { return lazy(import('../features/app/settings/Settings')); } },
    ],
  },
], { basename: '/admin' });

