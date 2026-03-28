/**
 * ENTERPRISE ARCHITECTURE SETUP GUIDE
 * ===================================
 * This file explains the structure and how to use all the components
 */

/**
 * PROJECT STRUCTURE
 * =================
 * src/
 * ├── types/                    # TypeScript type definitions
 * │   └── auth.types.ts         # Authentication and authorization types
 * │
 * ├── services/                 # API service and business logic
 * │   └── api.service.ts        # Axios instance with JWT handling
 * │
 * ├── context/                  # React Context for global state
 * │   └── AuthContext.tsx       # Authentication state management
 * │
 * ├── hooks/                    # Custom React hooks
 * │   ├── useApi.ts             # TanStack Query hooks for data fetching
 * │   └── index.ts              # Re-export all hooks
 * │
 * ├── components/               # React components
 * │   └── guards/               # Route and permission guards
 * │       ├── PermissionGuard.tsx     # Declarative permission wrapper
 * │       ├── PrivateRoute.tsx        # Private route protection
 * │       └── index.ts                # Re-export all guards
 * │
 * ├── pages/                    # Page components
 * │   ├── Login.tsx             # Login page
 * │   ├── Dashboard.tsx         # Protected dashboard
 * │   ├── AdminPanel.tsx        # Admin-only page
 * │   ├── Orders.tsx            # Example: Orders with CRUD operations
 * │   └── NotFound.tsx          # 404 and 403 error pages
 * │
 * └── App.tsx                   # Main app with routing and providers
 *
 * .env                          # Environment variables
 * package.json                  # Updated with new dependencies
 */

/**
 * KEY DEPENDENCIES ADDED
 * ======================
 * - react-router-dom: Client-side routing
 * - @tanstack/react-query: Data fetching, caching, and state management
 * - axios: HTTP client with JWT interceptors
 */

/**
 * HOW TO USE THE AUTHENTICATION SYSTEM
 * ====================================
 *
 * 1. ACCESSING AUTH IN COMPONENTS
 *    ---------------------
 *    import { useAuth } from '../hooks';
 *
 *    function MyComponent() {
 *      const { user, isAuthenticated, logout, hasRole } = useAuth();
 *
 *      return (
 *        <div>
 *          {isAuthenticated && <p>Hello, {user.username}</p>}
 *          {hasRole('ROLE_ADMIN') && <AdminSecretion />}
 *        </div>
 *      );
 *    }
 *
 * 2. USING PERMISSION GUARD (DECLARATIVE)
 *    -------------------------------------
 *    import { PermissionGuard } from '../components/guards';
 *
 *    <PermissionGuard requiredRole="ROLE_ADMIN">
 *      <AdminDashboard />
 *    </PermissionGuard>
 *
 *    <PermissionGuard requiredAnyRole={['ROLE_MANAGER', 'ROLE_ADMIN']}>
 *      <ManagementTools />
 *    </PermissionGuard>
 *
 *    <PermissionGuard requiredPermission="CREATE_ORDER" fallback={<AccessDenied />}>
 *      <CreateOrderForm />
 *    </PermissionGuard>
 *
 * 3. JWT TOKEN MANAGEMENT
 *    -------------------
 *    Tokens are automatically:
 *    - Stored in localStorage after login
 *    - Attached to all requests in the Authorization header
 *    - Cleared on logout or if expired (401)
 *
 *    The useAuth hook provides:
 *    - login(credentials)      // Login with username/password
 *    - logout()                // Clear token and user
 *    - refreshToken()          // Refresh expired token
 *
 * 4. DATA FETCHING WITH HOOKS
 *    -----------------------
 *    These hooks use TanStack Query for automatic caching and refetching:
 *
 *    // Fetch paginated data
 *    const { data, isLoading, error } = useOrders(page, size);
 *
 *    // Fetch single item
 *    const { data: order } = useOrderById(orderId);
 *
 *    // Create/Update/Delete mutations
 *    const createMutation = useCreateOrder();
 *    await createMutation.mutateAsync(orderData);
 *
 * 5. PROTECTED ROUTING
 *    ----------------
 *    Routes are protected at different levels:
 *
 *    // Public route (accessible to everyone)
 *    <Route path="/login" element={<Login />} />
 *
 *    // Private route (requires authentication)
 *    <Route path="/dashboard" element={
 *      <PrivateRoute>
 *        <Dashboard />
 *      </PrivateRoute>
 *    } />
 *
 *    // Restricted route (requires specific role)
 *    <Route path="/admin" element={
 *      <RestrictedRoute requiredRole="ROLE_ADMIN">
 *        <AdminPanel />
 *      </RestrictedRoute>
 *    } />
 */

/**
 * ENVIRONMENT VARIABLES
 * ====================
 * Create a .env file in the project root:
 *
 *   REACT_APP_API_BASE_URL=http://localhost:8080/api
 *   REACT_APP_ENV=development
 *
 * Note: In CRA, all custom variables must start with REACT_APP_
 *
 * CORS PROXY (Optional)
 * If your Spring Boot server has strict CORS, package.json includes:
 *   "proxy": "http://localhost:8080"
 *
 * This allows the dev server to forward unknown requests to the backend.
 */

/**
 * API SERVICE USAGE
 * =================
 * The ApiService is a singleton that handles:
 * - JWT token management
 * - Automatic token injection in request headers
 * - 401 error handling (auto-logout)
 * - Consistent error formatting
 *
 * Direct usage (if needed):
 * import { apiService } from '../services/api.service';
 *
 * const users = await apiService.get('/users');
 * const newUser = await apiService.post('/users', userData);
 * await apiService.put('/users/123', userData);
 * await apiService.delete('/users/123');
 */

/**
 * PERMISSION CHECKING HELPER METHODS
 * ==================================
 * const auth = useAuth();
 *
 * auth.hasRole('ROLE_ADMIN')                    // Check single role
 * auth.hasPermission('CREATE_ORDER')            // Check permission
 * auth.hasAnyRole(['ROLE_ADMIN', 'ROLE_USER']) // Check any role
 * auth.hasAllRoles(['ROLE_ADMIN', 'ROLE_SUPER'])// Check all roles
 */

/**
 * EXAMPLE: BUILDING A FEATURE WITH PERMISSIONS
 * ==============================================
 *
 * const OrdersManager = () => {
 *   const hasPermission = useAuth().hasPermission;
 *   const orders = useOrders().data;
 *   const createMutation = useCreateOrder();
 *
 *   // Shows create button only if user has CREATE_ORDER permission
 *   // Shows order items with edit/delete buttons based on permissions
 * };
 */

/**
 * NEXT STEPS
 * ==========
 * 1. Run: npm install (to install new dependencies)
 * 2. Start the dev server: npm start
 * 3. Implement your Spring Boot backend endpoints
 * 4. Create custom API hooks following the useApi.ts pattern
 * 5. Build your pages and components using these hooks and guards
 * 6. Test authentication flow with your backend
 */

export {};
