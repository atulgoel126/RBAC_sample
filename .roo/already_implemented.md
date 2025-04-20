# Already Implemented Features

## Security (Backend)
- JWT-based Authentication
- Role-Based Authorization (Hierarchical: ADMIN > MODERATOR > USER)
- Permission-Based Access Control within roles
- Method-Level Security (@PreAuthorize, etc.)
- Stateless Session Management
- Password encryption using BCrypt
- Custom JWT Authentication Filter
- Token blacklisting mechanism (Implied by signout endpoint, needs verification)
- Secured REST endpoints
- Role-based endpoint access
- CORS configuration (Updated for Vite dev server)
- CSRF protection (Needs verification - Spring Security default?)
- **Bug Fix:** Updated `JwtService` to include filtered user roles (prefixed with `ROLE_`) in the JWT "roles" claim upon login.

## Core Components & Data Models (Backend)
- User Management (CRUD)
- Role Management (CRUD, Assign/Revoke Permissions)
- Permission Management (CRUD)
- Resource Management (CRUD)
- Action Management (CRUD)
- Hierarchical Role Structure
- Many-to-Many Relationship Mapping (e.g., Roles <-> Permissions)
- Data Transfer Objects (DTOs)
- Custom Exception Handling
- JPA Repositories
- Service Layer for Business Logic
- Data Seeding/Bootstrap (DataLoader, RoleSeeder - includes default admin user)
- **Bug Fix:** Resolved JSON serialization issues (infinite loop, lazy initialization) in `Permission`, `Role`, `Resource`, `Action` entities using Jackson annotations (`@JsonManagedReference`, `@JsonBackReference`, `@JsonIgnore`) to fix 500 errors when fetching permissions.

## API Endpoints (Backend)
- **Authentication**: `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`
- **User Management**: `/api/users` (GET, POST), `/api/users/{id}` (GET, PUT, DELETE)
- **Role Management**: `/api/roles` (GET, POST), `/api/roles/{id}` (GET, PUT, DELETE), `/api/roles/{roleId}/permissions/{permissionId}` (POST, DELETE)
- **Permission Management**: `/api/permissions` (GET, POST), `/api/permissions/{id}` (GET, DELETE)
- **Resource Management**: `/api/resources` (GET, POST), `/api/resources/{id}` (GET, PUT, DELETE)
- **Action Management**: `/api/actions` (GET, POST), `/api/actions/{id}` (GET, PUT, DELETE)

## Configuration & Setup
- **Backend**:
    - Multi-environment configuration (dev, test, prod) using `application.properties`
    - H2 database support (file-based for dev, in-memory for test)
    - PostgreSQL support (configured for prod)
    - Maven build process
    - API Documentation via SpringDoc OpenAPI
- **Development**:
    - `start-dev.sh` script to run backend and frontend concurrently.

## Frontend (React + TypeScript)
- **Project Structure**: Basic setup using Vite in `/frontend`.
- **API Client**: Configured `axios` instance (`apiClient.ts`) with request interceptor for automatic JWT token attachment. Basic response interceptor for error logging.
- **Styling**: Tailwind CSS (v3.4.3) installed and configured. Basic utility classes applied to Layout, Forms (Login, Register, Create/Edit User, Create/Edit Role), and Admin List Tables (User, Role, Permission).
- **Routing**: Client-side routing implemented using `react-router-dom` (`BrowserRouter`, `Routes`, `Route`, `Layout`, dynamic params).
- **State Management**: `AuthContext` created for global authentication state (token, login/logout, loading state). **Enhanced** to decode JWT and store/provide `username` and `roles`.
- **Form Handling**: `react-hook-form` implemented for Login, Register, Create/Edit User, Create/Edit Role forms, including basic client-side validation.
- **Authentication Flow**:
    - `LoginPage` component with API call and context integration.
    - `RegistrationPage` component with API call.
    - `ProtectedRoute` component implemented and used for admin routes.
    - Basic Logout functionality via `AuthContext` in `Layout`. **Enhanced** `Layout` to display logged-in user's username and roles in the format "Username: {username} Roles: {roles}".
- **UI Enhancements**:
    - Improved styling and layout for `HomePage.tsx` using Tailwind CSS.
    - Improved styling and layout for `DashboardPage.tsx` (using cards/grid) using Tailwind CSS.
- **User Management**:
    - `UserListPage` component (fetches and displays users).
    - `CreateUserPage` component (form with role selection, calls POST API).
    - `EditUserPage` component (fetches user/roles, form, calls PUT API).
    - Delete functionality implemented on `UserListPage`.
- **Role Management**:
    - `RoleListPage` component (fetches and displays roles).
    - `CreateRolePage` component (form, calls POST API).
    - `EditRolePage` component (fetches role/permissions, form for description, handles permission assignment/revocation via API).
    - Delete functionality implemented on `RoleListPage`.
- **Permission Management**:
    - `PermissionListPage` component (fetches and displays permissions).
    - Delete functionality implemented on `PermissionListPage`.