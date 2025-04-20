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
- Permission Management (CRUD, Update Description)
- Resource Management (CRUD)
- Action Management (CRUD)
- Hierarchical Role Structure
- Many-to-Many Relationship Mapping (e.g., Roles <-> Permissions)
- Data Transfer Objects (DTOs)
- Custom Exception Handling (`GlobalExceptionHandler`)
- JPA Repositories
- Service Layer for Business Logic
- Data Seeding/Bootstrap (DataLoader, RoleSeeder - includes default admin user)
- **Bug Fix:** Resolved JSON serialization issues (infinite loop, lazy initialization) in `Permission`, `Role`, `Resource`, `Action` entities using Jackson annotations (`@JsonManagedReference`, `@JsonBackReference`, `@JsonIgnore`) to fix 500 errors when fetching permissions.

## API Endpoints (Backend)
- **Authentication**: `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`
- **User Management**: `/api/users` (GET, POST), `/api/users/{id}` (GET, PUT, DELETE)
- **Role Management**: `/api/roles` (GET, POST), `/api/roles/{id}` (GET, PUT, DELETE), `/api/roles/{roleId}/permissions/{permissionId}` (POST, DELETE)
- **Permission Management**: `/api/permissions` (GET, POST), `/api/permissions/{id}` (GET, PUT, DELETE) - PUT updates description only.
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
- **API Client**: Configured `axios` instance (`apiClient.ts`) with request interceptor for JWT token attachment. **Enhanced** response interceptor for global error handling (toast notifications, improved message extraction).
- **Styling**:
    - Tailwind CSS (v3.4.3) installed and configured.
    - Reusable UI components created (`Button`, `Input`, `Label`, `Card` in `/components/ui/`).
    - Common style constants extracted to `/styles/commonStyles.ts`.
    - Pages refactored to use reusable components and common styles (Login, User/Role/Permission Lists, Create/Edit User/Role/Permission, Dashboard).
    - Basic responsiveness added to Layout header and List page tables (horizontal scroll).
- **Routing**:
    - Client-side routing implemented using `react-router-dom`.
    - `ProtectedRoute` component implemented and **enhanced** to apply role-based authorization checks (`allowedRoles`) to admin routes in `App.tsx`.
- **State Management**: `AuthContext` created for global authentication state (token, login/logout, loading state). Decodes JWT and provides `username` and `roles`.
- **Form Handling**: `react-hook-form` implemented for Login, Register, Create/Edit User, Create/Edit Role, Create/Edit Permission forms. Password confirmation validation added to Registration.
- **Authentication Flow**:
    - `LoginPage` component with API call and context integration.
    - `RegistrationPage` component with API call.
    - Basic Logout functionality via `AuthContext` in `Layout`. **Refactored** Logout button using reusable component.
- **UI Enhancements**:
    - Improved styling and layout for `HomePage.tsx` using Tailwind CSS.
    - Improved styling and layout for `DashboardPage.tsx` (using cards/grid). **Refined** role-specific views and refactored using `Card` component.
- **User Management**:
    - `UserListPage` component (fetches and displays users, includes View/Edit/Delete actions).
    - `CreateUserPage` component (form with role selection, calls POST API).
    - `EditUserPage` component (fetches user/roles, form, calls PUT API).
    - `ViewUserPage` component (displays user details).
    - Delete functionality implemented on `UserListPage`.
- **Role Management**:
    - `RoleListPage` component (fetches and displays roles, includes View/Edit/Delete actions).
    - `CreateRolePage` component (form, calls POST API).
    - `EditRolePage` component (fetches role/permissions, form for description, handles permission assignment/revocation via API).
    - `ViewRolePage` component (displays role details and assigned permissions).
    - Delete functionality implemented on `RoleListPage`.
- **Permission Management**:
    - `PermissionListPage` component (fetches and displays permissions, includes View/Edit/Delete actions).
    - `CreatePermissionPage` component (fetches resources/actions, form, calls POST API).
    - `EditPermissionPage` component (fetches permission, allows description update via PUT API).
    - `ViewPermissionPage` component (displays permission details).
    - Delete functionality implemented on `PermissionListPage`.
## Frontend Development (React + TypeScript) - Session [Date TBD]

### Core Functionality
- **Component Development:**
    - Created reusable UI components: `Button`, `Card`, `Input`, `Label`, `Select`, `Textarea`, `Checkbox`, `Modal`, `Table`, `FormErrorMessage`.
    - Refactored `RegistrationPage`, `LoginPage`, `Create*`, `Edit*`, and `*List` pages in `/admin` to use reusable components.
- **API Integration:**
    - Implemented UI pages for CRUD operations on Resources and Actions (`ResourceListPage`, `CreateResourcePage`, `EditResourcePage`, `ActionListPage`, `CreateActionPage`, `EditActionPage`). Added necessary routes and dashboard links.
- **Form Handling & Validation:**
    - Improved validation feedback consistency by encapsulating error styling within `Input`, `Select`, `Textarea` components via an `error` prop.
    - Created `FormErrorMessage` component for displaying validation messages.
- **State Management:**
    - Enhanced `AuthContext` to fetch and store user's `fullName` upon login (assuming `/users/profile/{username}` or `/users/me` endpoint).

### Feature Expansion (Backend related)
- **Resource/Action Management UI:** Added UI pages for managing Resources and Actions.