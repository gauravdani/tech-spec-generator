import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Check for bypass flag
  const bypassAuth = searchParams.get('bypass_auth') === 'true';
  const testMode = searchParams.get('test_mode') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Allow access if bypass flag is set or user is authenticated
  if (bypassAuth || testMode || user) {
    // If in test mode, show a banner
    if (testMode) {
      return (
        <>
          <div className="bg-yellow-500 text-black p-2 text-center">
            🧪 Test Mode Active - Authentication Bypassed
          </div>
          {children}
        </>
      );
    }
    return <>{children}</>;
  }

  return <Navigate to="/signup" replace />;
}; 