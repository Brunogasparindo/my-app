import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

interface RestrictedRouteProps {
  children: React.ReactNode;
  requiredRole: string | string[];
}

/**
 * PrivateRoute Component
 * Wraps routes that require authentication
 * Redirects to /login if user is not authenticated
 *
 * Usage:
 * <PrivateRoute>
 *   <Dashboard />
 * </PrivateRoute>
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * RestrictedRoute Component
 * Wraps routes that require specific roles
 * Redirects to /login if not authenticated
 * Redirects to /forbidden if user lacks required role
 *
 * Usage:
 * <RestrictedRoute requiredRole="ROLE_ADMIN">
 *   <AdminPanel />
 * </RestrictedRoute>
 */
export const RestrictedRoute: React.FC<RestrictedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, isLoading, hasRole, hasAnyRole } = useAuth();
  const requiredRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRequiredRole =
    requiredRoles.length === 1 ? hasRole(requiredRoles[0]) : hasAnyRole(requiredRoles);

  if (!hasRequiredRole) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
