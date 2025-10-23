import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { loading } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem('user') || 'null');

  // While loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  // Admin check
  const isAdmin = storedUser.role === 'admin';
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />; // non-admins go home
  }

  return <>{children}</>;
};

