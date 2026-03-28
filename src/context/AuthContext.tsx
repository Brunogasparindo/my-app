import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthCredentials, AuthContextType, AuthResponse } from '../types/auth.types';
import apiService from '../services/api.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize authentication state from localStorage on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        try {
          // Validate token and fetch user data
          const userData = await apiService.get<User>('/auth/me');
          setToken(storedToken);
          setUser(userData);
          apiService.setToken(storedToken);
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
          apiService.clearToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (credentials: AuthCredentials) => {
    try {
      setIsLoading(true);
      const response = await apiService.post<AuthResponse>('/auth/login', credentials);

      // Save token and user data
      apiService.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    apiService.clearToken();
  }, []);

  /**
   * Refresh token handler
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await apiService.post<AuthResponse>('/auth/refresh');
      apiService.setToken(response.token);
      setToken(response.token);
      setUser(response.user);
      localStorage.setItem('authToken', response.token);
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  /**
   * Check if user has a specific role
   */
  const hasRole = useCallback((role: string): boolean => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  /**
   * Check if user has a specific permission
   */
  const hasPermission = useCallback((permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  }, [user]);

  /**
   * Check if user has any of the provided roles
   */
  const hasAnyRole = useCallback((roles: string[]): boolean => {
    return roles.some((role) => user?.roles?.includes(role)) || false;
  }, [user]);

  /**
   * Check if user has all of the provided roles
   */
  const hasAllRoles = useCallback((roles: string[]): boolean => {
    return roles.every((role) => user?.roles?.includes(role)) || false;
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    token,
    login,
    logout,
    refreshToken,
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAllRoles,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use the auth context
 * Throws an error if used outside of AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
