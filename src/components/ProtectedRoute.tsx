import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from './AppContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { currentUser } = useAppContext();
  if (!allowedRoles.includes(currentUser?.role || '')) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;