import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '../types/auth.types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage on initialization
    this.token = localStorage.getItem('authToken');

    // Request interceptor to add JWT to headers
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token expiration
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        // If 401 Unauthorized, token may have expired
        if (error.response?.status === 401) {
          this.clearToken();
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set the JWT token for subsequent requests
   */
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  /**
   * Get the current JWT token
   */
  getToken(): string | null {
    return this.token || localStorage.getItem('authToken');
  }

  /**
   * Clear the JWT token
   */
  clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  /**
   * Get the axios instance for custom configurations
   */
  getClient(): AxiosInstance {
    return this.axiosInstance;
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.axiosInstance.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   */
  async put<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.axiosInstance.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  async delete<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.axiosInstance.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.axiosInstance.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Handle and format API errors
   */
  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const apiError = error.response?.data as ApiError;
      return apiError || {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message,
        timestamp: new Date().toISOString(),
        path: error.config?.url,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      timestamp: new Date().toISOString(),
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
