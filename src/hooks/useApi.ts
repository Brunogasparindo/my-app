import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api.service';
import { PaginatedResponse } from '../types/auth.types';

/**
 * Custom hook to fetch user permissions
 * Caches the result and automatically refetches when needed
 */
export const useUserPermissions = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['userPermissions', user?.id],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      return await apiService.get(`/auth/permissions/${user?.id}`);
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
};

/**
 * Custom hook to fetch user roles
 */
export const useUserRoles = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['userRoles', user?.id],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      return await apiService.get(`/auth/roles/${user?.id}`);
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

/**
 * Generic hook to fetch paginated data
 */
export const useFetchPaginated = <T,>(
  key: string,
  endpoint: string,
  page: number = 0,
  size: number = 20
) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [key, page, size],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      return await apiService.get<PaginatedResponse<T>>(
        `${endpoint}?page=${page}&size=${size}`
      );
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 1, // 1 minute
    gcTime: 1000 * 60 * 5,
  });
};

/**
 * Generic hook to fetch a single resource by ID
 */
export const useFetchById = <T,>(key: string, endpoint: string, id?: string | number) => {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [key, id],
    queryFn: async () => {
      if (!isAuthenticated || !id) return null;
      return await apiService.get<T>(`${endpoint}/${id}`);
    },
    enabled: isAuthenticated && !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

/**
 * Generic hook for POST requests (mutations)
 */
export const useCreateResource = <T extends Record<string, unknown>>(endpoint: string) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (data: T) => {
      return await apiService.post(endpoint, data as Record<string, unknown>);
    },
    onSuccess: () => {
      // Invalidate all queries to refetch data
      queryClient.invalidateQueries();
    },
  });
};

/**
 * Generic hook for PUT requests (mutations)
 */
export const useUpdateResource = <T,>(endpoint: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: T & { id: string | number }) => {
      const { id, ...rest } = data;
      return await apiService.put(`${endpoint}/${id}`, rest);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

/**
 * Generic hook for DELETE requests (mutations)
 */
export const useDeleteResource = (endpoint: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string | number) => {
      return await apiService.delete(`${endpoint}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

/**
 * Hook for orders API calls
 */
export const useOrders = (page: number = 0, size: number = 20) => {
  return useFetchPaginated('orders', '/orders', page, size);
};

/**
 * Hook to fetch specific order
 */
export const useOrderById = (id?: string | number) => {
  return useFetchById('order', '/orders', id);
};

/**
 * Hook to create a new order
 */
export const useCreateOrder = () => {
  return useCreateResource('/orders');
};

/**
 * Hook to update an order
 */
export const useUpdateOrder = () => {
  return useUpdateResource('/orders');
};

/**
 * Hook to delete an order
 */
export const useDeleteOrder = () => {
  return useDeleteResource('/orders');
};
