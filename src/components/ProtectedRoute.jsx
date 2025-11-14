import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { currentUser, loading, setShowLogin } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 rounded-xl bg-frame p-6 md:p-8 flex items-center justify-center neumorphic-outset">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !currentUser) {
    // Mostrar modal de login en lugar de redirigir
    setTimeout(() => setShowLogin(true), 100);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
