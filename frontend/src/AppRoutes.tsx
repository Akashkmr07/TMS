// src/AppRoutes.tsx
import type { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AllTasks from './pages/AllTasks';
import Analytics from './pages/Analytics';
import Archive from './pages/Archive';
import Settings from './pages/Settings';
import Layout from './components/Layout';

import { useAuth } from './context/AuthContext';

// Protected Route wrapper
const ProtectedRoute: FC = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Layout />;
};

const AppRoutes: FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<AllTasks />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
