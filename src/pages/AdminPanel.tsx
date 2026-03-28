import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserPermissions } from '../hooks/useApi';

/**
 * Admin Panel Component
 * Only accessible to users with ROLE_ADMIN
 */
export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { data: permissions, isLoading } = useUserPermissions();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel</h1>

      <section style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e8f4f8' }}>
        <h2>System Administration</h2>
        <p>Administrative tools and system configuration options go here.</p>
      </section>

      <section style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f0f0f0' }}>
        <h2>Your Admin Permissions</h2>
        {isLoading ? (
          <p>Loading permissions...</p>
        ) : (
          <ul>
            {user?.permissions?.map((perm: string, index: number) => (
              <li key={index}>{perm}</li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2>Management Actions</h2>
        <button
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Manage Users
        </button>
        <button
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Manage Roles
        </button>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          System Settings
        </button>
      </section>
    </div>
  );
};

export default AdminPanel;
