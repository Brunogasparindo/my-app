/**
 * Hooks - Central export point
 */
export { useAuth } from '../context/AuthContext';
export {
  useUserPermissions,
  useUserRoles,
  useFetchPaginated,
  useFetchById,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
  useOrders,
  useOrderById,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} from './useApi';
