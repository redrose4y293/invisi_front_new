import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import ScrollToTop from '@/routes/ScrollToTop';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Single-page public and dealer portal
const PublicSingle = lazy(() => import('@/pages/public/SinglePublic'));
const DealerPortal = lazy(() => import('@/pages/dealer/Portal'));
const PublicLogin = lazy(() => import('@/pages/public/Login'));

// Auth pages
const Login = lazy(() => import('@/pages/dealer/Login'));
const Register = lazy(() => import('@/pages/dealer/Register'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));

// Fresh Admin screens inside user app
const AdminLogin = lazy(() => import('@/pages/admin/Login'));
const AdminRegister = lazy(() => import('@/pages/admin/Register'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminShell = lazy(() => import('@/pages/admin/AppShell'));
const AdminLeads = lazy(() => import('@/pages/admin/Leads'));
const AdminDealers = lazy(() => import('@/pages/admin/Dealers'));
const AdminContent = lazy(() => import('@/pages/admin/Content'));
const AdminFiles = lazy(() => import('@/pages/admin/Files'));
const AdminNewAdmin = lazy(() => import('@/pages/admin/NewAdmin'));

export default function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <ScrollToTop>
        <Suspense fallback={<div style={{padding:24}}>Loading...</div>}>
        <Routes>
          {/* Public single-page */}
          <Route element={<PublicLayout />}>
            <Route index element={<PublicSingle />} />
          </Route>

          {/* Dealer area (single-page, protected) + auth */}
          <Route path="/dealer/login" element={<Login />} />
          <Route path="/dealer/register" element={<Register />} />
          {/* Unified login for admin and dealer */}
          <Route path="/login" element={<PublicLogin />} />
          <Route
            path="/dealer"
            element={
              <ProtectedRoute>
                <DealerPortal />
              </ProtectedRoute>
            }
          />
          {/* Route aliases to load the same portal and let it scroll to section */}
          <Route path="/dealer/dashboard" element={<ProtectedRoute><DealerPortal /></ProtectedRoute>} />
          <Route path="/dealer/files" element={<ProtectedRoute><DealerPortal /></ProtectedRoute>} />
          <Route path="/dealer/uploads" element={<ProtectedRoute><DealerPortal /></ProtectedRoute>} />
          <Route path="/dealer/training" element={<ProtectedRoute><DealerPortal /></ProtectedRoute>} />

          {/* New Admin (local) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminDashboard />} />
            <Route path="leads" element={<AdminLeads />} />
            <Route path="dealers" element={<AdminDealers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="files" element={<AdminFiles />} />
            <Route path="admins/new" element={<AdminNewAdmin />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </ScrollToTop>
    </>
  );
}
