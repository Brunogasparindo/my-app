# Enterprise React Architecture Setup

This document describes the enterprise-grade authentication and permissions architecture implemented in your CRA application.

## What Has Been Added

### 1. **Dependencies** (in package.json)
```json
"react-router-dom": "^6.21.0",
"@tanstack/react-query": "^5.28.0",
"axios": "^1.6.2"
```

### 2. **Proxy Configuration** (in package.json)
```json
"proxy": "http://localhost:8080"
```
This allows the dev server to forward API requests to your Spring Boot backend during development.

### 3. **Environment Variables** (.env file)
```plaintext
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_ENV=development
```

## Folder Structure

```
src/
├── types/                         # TypeScript type definitions
│   ├── auth.types.ts              # Auth, User, and API types
│   └── index.ts                   # Type exports
│
├── services/                      # API clients and business logic
│   ├── api.service.ts             # Axios with JWT interceptors
│   └── index.ts                   # Service exports
│
├── context/                       # React Context API
│   └── AuthContext.tsx            # Global auth state & useAuth hook
│
├── hooks/                         # Custom React hooks
│   ├── useApi.ts                  # TanStack Query hooks
│   └── index.ts                   # Hook exports
│
├── components/
│   └── guards/                    # Route & permission guards
│       ├── PermissionGuard.tsx    # Declarative permission wrapper
│       ├── PrivateRoute.tsx       # Private/Restricted routes
│       └── index.ts               # Guard exports
│
├── pages/                         # Page components
│   ├── Login.tsx                  # Public login page
│   ├── Dashboard.tsx              # Protected dashboard
│   ├── AdminPanel.tsx             # Admin-only page
│   ├── Orders.tsx                 # Example CRUD page
│   └── NotFound.tsx               # 403/404 error pages
│
├── App.tsx                        # Main app with routing
├── ARCHITECTURE_GUIDE.ts          # Detailed usage guide
└── ...
```

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Configure Environment
.env file is already created with:
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

## How to Use

### Authentication

#### Login
```typescript
import { useAuth } from './hooks';

function LoginForm() {
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    await login({ username: 'user', password: 'pass' });
  };

  return <button onClick={handleLogin}>{isLoading ? 'Logging in...' : 'Login'}</button>;
}
```

#### Check Permissions
```typescript
const { user, hasRole, hasPermission, logout } = useAuth();

{hasRole('ROLE_ADMIN') && <AdminPanel />}
{hasPermission('CREATE_ORDER') && <CreateButton />}
```

### Permission Guard (Declarative)

The **PermissionGuard** component is the recommended approach for handling permissions:

```typescript
import { PermissionGuard } from './components/guards';

{/* Only visible to ROLE_ADMIN */}
<PermissionGuard requiredRole="ROLE_ADMIN">
  <AdminPanel />
</PermissionGuard>

{/* Only visible if user has CREATE_ORDER permission */}
<PermissionGuard requiredPermission="CREATE_ORDER">
  <CreateOrderButton />
</PermissionGuard>

{/* Show different content based on role */}
<PermissionGuard requiredRole="ROLE_ADMIN" fallback={<AccessDenied />}>
  <AdminTools />
</PermissionGuard>
```

### Protected Routes

Routes are protected using **PrivateRoute** and **RestrictedRoute**:

```typescript
import { PrivateRoute, RestrictedRoute } from './components/guards';

<Routes>
  {/* Public route */}
  <Route path="/login" element={<Login />} />

  {/* Private route (requires login) */}
  <Route path="/dashboard" element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } />

  {/* Restricted route (requires specific role) */}
  <Route path="/admin" element={
    <RestrictedRoute requiredRole="ROLE_ADMIN">
      <AdminPanel />
    </RestrictedRoute>
  } />
</Routes>
```

### Data Fetching with TanStack Query

Use custom hooks that handle caching, loading states, and refetching:

```typescript
import { useOrders, useCreateOrder } from './hooks/useApi';

function OrdersList() {
  const [page, setPage] = useState(0);
  const { data: orders, isLoading, error } = useOrders(page, 20);
  const createMutation = useCreateOrder();

  return (
    <div>
      <button onClick={() => createMutation.mutate(orderData)}>
        Create Order
      </button>

      {isLoading && <p>Loading...</p>}
      {orders?.content.map(order => (
        <OrderItem key={order.id} order={order} />
      ))}
    </div>
  );
}
```

### JWT Token Management

Tokens are automatically:
- ✅ Stored in localStorage after login
- ✅ Sent in Authorization header for all requests
- ✅ Cleared on logout or if expired (401)

Direct API calls:
```typescript
import { apiService } from './services';

const users = await apiService.get('/users');
const user = await apiService.post('/users', userData);
await apiService.put('/users/123', userData);
await apiService.delete('/users/123');
```

## Available Authentication Methods

| Method | Usage |
|--------|-------|
| `hasRole('ROLE_ADMIN')` | Check if user has a specific role |
| `hasPermission('CREATE_ORDER')` | Check for specific permission |
| `hasAnyRole(['ROLE_ADMIN', 'ROLE_USER'])` | Check if user has any of the roles |
| `hasAllRoles(['ROLE_ADMIN', 'ROLE_SUPER'])` | Check if user has all the roles |

## Available Hooks

### Authentication
- `useAuth()` - Get auth state, user data, and methods

### API Calls
- `useUserPermissions()` - Fetch user permissions
- `useUserRoles()` - Fetch user roles
- `useFetchPaginated<T>(key, endpoint, page, size)` - Fetch paginated data
- `useFetchById<T>(key, endpoint, id)` - Fetch single item
- `useCreateResource<T>(endpoint)` - Create resource mutation
- `useUpdateResource<T>(endpoint)` - Update resource mutation
- `useDeleteResource(endpoint)` - Delete resource mutation

### Pre-built Hooks
- `useOrders(page, size)` - Fetch orders
- `useOrderById(id)` - Fetch specific order
- `useCreateOrder()` - Create order mutation
- `useUpdateOrder()` - Update order mutation
- `useDeleteOrder()` - Delete order mutation

## Backend Requirements

Your Spring Boot backend should:

1. **Login Endpoint**
   - POST `/api/auth/login`
   - Request: `{ username: string, password: string }`
   - Response: `{ token: string, user: User, expiresIn: number }`

2. **Check User Endpoint**
   - GET `/api/auth/me`
   - Required header: `Authorization: Bearer {token}`
   - Response: User object with roles and permissions

3. **Refresh Token Endpoint** (optional)
   - POST `/api/auth/refresh`
   - Response: `{ token: string, user: User, expiresIn: number }`

4. **Data Endpoints**
   - GET `/api/orders?page=0&size=20`
   - POST `/api/orders`
   - PUT `/api/orders/{id}`
   - DELETE `/api/orders/{id}`

## Error Handling

All API errors are automatically formatted to:
```typescript
{
  code: string;
  message: string;
  timestamp: string;
  path?: string;
}
```

401 (Unauthorized) responses automatically trigger logout and redirect to /login.

## Troubleshooting

### "useAuth must be used within an AuthProvider"
Make sure your App is wrapped with:
```typescript
<AuthProvider>
  <Router>
    {/* Your routes */}
  </Router>
</AuthProvider>
```

### CORS Errors
If you see CORS errors, either:
1. Configure CORS on your Spring Boot backend
2. Or use the proxy in package.json (already configured)

### Token Not Persisted
Tokens are stored in localStorage. Make sure localStorage is available in your browser.

## Next Steps

1. Implement your Spring Boot backend endpoints
2. Create custom API hooks based on `useApi.ts` pattern
3. Build pages using PermissionGuard and custom hooks
4. Test the complete authentication flow
5. Style your components as needed

## File References

- See [ARCHITECTURE_GUIDE.ts](./ARCHITECTURE_GUIDE.ts) for detailed usage examples
- Check [App.tsx](./App.tsx) for complete routing setup
- Review [AuthContext.tsx](./context/AuthContext.tsx) for auth logic
- Study [useApi.ts](./hooks/useApi.ts) for data fetching patterns
