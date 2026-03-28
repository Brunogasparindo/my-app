/**
 * Authentication and Authorization Types
 */

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  authorities: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn: number;
}

export interface RegisterApiResponse {
  userId: string;
  email: string;
}

export interface LoginApiResponse {
  userId: string;
  email: string;
  token: string;
  refreshToken: string;
}

export interface RefreshApiResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  hasAllRoles: (roles: string[]) => boolean;
}

export interface ApiError {
  code: string;
  message: string;
  timestamp: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
}
