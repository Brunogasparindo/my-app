import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface PermissionGuardProps {
  requiredRole?: string | string[];
  requiredPermission?: string | string[];
  requiredAnyRole?: string[];
  requiredAllRoles?: string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * PermissionGuard Component
 * Declaratively wraps components that require specific roles/permissions
 *
 * Usage:
 * <PermissionGuard requiredRole="ROLE_ADMIN">
 *   <AdminDashboard />
 * </PermissionGuard>
 *
 * <PermissionGuard requiredAnyRole={["ROLE_ADMIN", "ROLE_MANAGER"]}>
 *   <ManagementPanel />
 * </PermissionGuard>
 *
 * <PermissionGuard requiredPermission="CREATE_ORDER" fallback={<AccessDenied />}>
 *   <CreateOrderForm />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredRole,
  requiredPermission,
  requiredAnyRole,
  requiredAllRoles,
  fallback = null,
  children,
}) => {
  const auth = useAuth();

  // Check role permissions
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRole = roles.length === 1 ? auth.hasRole(roles[0]) : auth.hasAnyRole(roles);
    if (!hasRole) {
      return <>{fallback}</>;
    }
  }

  // Check specific permissions
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission)
      ? requiredPermission
      : [requiredPermission];
    const hasPermission = permissions.some((perm) => auth.hasPermission(perm));
    if (!hasPermission) {
      return <>{fallback}</>;
    }
  }

  // Check any role in the list
  if (requiredAnyRole) {
    if (!auth.hasAnyRole(requiredAnyRole)) {
      return <>{fallback}</>;
    }
  }

  // Check all roles in the list
  if (requiredAllRoles) {
    if (!auth.hasAllRoles(requiredAllRoles)) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

export default PermissionGuard;
