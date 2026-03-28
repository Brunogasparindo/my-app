import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Forbidden Page Component
 * Displayed when user lacks required permissions/roles
 */
export const Forbidden: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8d7da',
        color: '#721c24',
      }}
    >
      <h1>403 - Forbidden</h1>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
        You don't have permission to access this resource.
      </p>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#721c24',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Return to Dashboard
      </button>
    </div>
  );
};

/**
 * Not Found Page Component
 * Displayed when route doesn't exist
 */
export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        color: '#495057',
      }}
    >
      <h1>404 - Page Not Found</h1>
      <p style={{ fontSize: '18px', marginBottom: '20px' }}>
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#495057',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Go to Home
      </button>
    </div>
  );
};

export default Forbidden;
