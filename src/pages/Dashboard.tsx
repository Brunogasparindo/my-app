import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PermissionGuard from '../components/guards/PermissionGuard';

/**
 * Dashboard Page Component
 * Protected page that show only to authenticated users
 */
export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1>Welcome, {user?.username}!</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </header>

      <section style={{ marginBottom: '30px' }}>
        <h2>Your Information</h2>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Roles:</strong> {user?.roles?.join(', ') || 'N/A'}
        </p>
        <p>
          <strong>Permissions:</strong> {user?.permissions?.join(', ') || 'N/A'}
        </p>
      </section>

      {/* This section only shows to users with ROLE_ADMIN */}
      <PermissionGuard requiredRole="ROLE_ADMIN">
        <section style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f0f0f0' }}>
          <h2>Admin Section</h2>
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Go to Admin Panel
          </button>
        </section>
      </PermissionGuard>

      {/* This section only shows to users with ROLE_MANAGER or ROLE_ADMIN */}
      <PermissionGuard requiredAnyRole={['ROLE_MANAGER', 'ROLE_ADMIN']}>
        <section style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e7f3ff' }}>
          <h2>Management Section</h2>
          <p>You have management privileges.</p>
        </section>
      </PermissionGuard>

      {/* This section only shows if user has CREATE_ORDER permission */}
      <PermissionGuard requiredPermission="CREATE_ORDER">
        <section style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#fff3cd' }}>
          <h2>Orders Management</h2>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Create New Order
          </button>
        </section>
      </PermissionGuard>
    </div>
  );
};

export default Dashboard;
