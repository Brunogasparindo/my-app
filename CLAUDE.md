# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start                              # Dev server at http://localhost:3000
npm test                               # Run tests in watch mode
npm test -- --run                      # Run tests once (CI mode)
npm test -- --reporter=verbose MyFile  # Run a single test file
npm run build                          # Production build
npm run preview                        # Serve the production build locally
```

The dev server proxies all `/api/*` requests to `http://localhost:8080` (configured in `vite.config.ts`). The Spring Boot backend at `C:\oo\dev\myApi` must be running for any authenticated page to work.

Environment config is in `.env` (Vite prefix):
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Architecture

This is a Vite + React + TypeScript frontend for a Spring Boot backend. The key design is a layered auth + data-fetching system:

### Auth flow
`AuthContext` (`src/context/AuthContext.tsx`) is the single source of truth for auth state. On mount it calls `GET /api/auth/me` with any stored token to rehydrate the session. Login calls `POST /api/auth/login`, stores both the access token (`localStorage.authToken`) and refresh token (`localStorage.refreshToken`), then calls `/auth/me` to populate the `User` object. The `apiService` singleton injects the `Authorization: Bearer` header on every request and redirects to `/login` on 401.

### Data fetching
All server state goes through TanStack Query via hooks in `src/hooks/useApi.ts`. The pattern is: generic hooks (`useFetchPaginated`, `useFetchById`, `useCreateResource`, `useUpdateResource`, `useDeleteResource`) that are wrapped into domain-specific hooks (`useOrders`, `useCreateOrder`, etc.). Mutations call `queryClient.invalidateQueries()` on success to trigger refetches.

### Access control — two layers
1. **Route level** (`src/components/guards/PrivateRoute.tsx`): `PrivateRoute` requires any authenticated user; `RestrictedRoute` additionally requires specific roles. Both redirect during `isLoading` to avoid flashing content.
2. **UI level** (`src/components/guards/PermissionGuard.tsx`): Declarative wrapper that conditionally renders children based on `requiredRole`, `requiredPermission`, `requiredAnyRole`, or `requiredAllRoles`. Renders optional `fallback` when access is denied.

Roles and permissions come from the `User` object on `AuthContext` (`user.roles`, `user.permissions`). The backend currently returns `roles: ["ROLE_USER"]` and `permissions: []` for all users — conditional UI that gates on `ROLE_ADMIN` / `ROLE_MANAGER` / `CREATE_ORDER` etc. will be hidden until the backend adds a role system.

### Backend API contract
All requests go to `/api/*`. Key endpoints:
- `POST /api/auth/login` → `{ userId, email, token, refreshToken }`
- `POST /api/auth/refresh` — body: `{ refreshToken }` → `{ accessToken, refreshToken }`
- `GET /api/auth/me` → `User` object
- `GET /api/auth/permissions/{userId}` → `string[]`
- `GET /api/auth/roles/{userId}` → `string[]`
- `GET /api/orders?page=&size=` → `PageResponse<Order>`
- `POST/PUT/DELETE /api/orders/{id}`

`PageResponse<T>` shape: `{ content, totalElements, totalPages, currentPage, pageSize, hasMore }`.
