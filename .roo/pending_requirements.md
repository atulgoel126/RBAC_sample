# Pending Requirements / Future Enhancements

This list outlines potential features, improvements, or areas that might require further development or clarification for the Spring Boot RBAC project.

## Frontend Development (React + TypeScript)

### Core Functionality
- **Component Development:**
    - Refine Dashboard page component (e.g., add summaries, better navigation).
    - Implement Create/Edit functionality for Permissions (if applicable/needed).
    - Create reusable UI components (buttons, inputs, modals, tables, etc.) to ensure consistency and reduce style duplication.
    - Implement "View" functionality for Users/Roles/Permissions (dedicated pages or modals).
- **API Integration:**
    - Implement API calls for remaining CRUD operations (e.g., Create/Delete Permissions if needed).
- **Routing:**
    - Add role-based authorization checks within `ProtectedRoute` or specific components (e.g., only ADMIN can access certain admin pages).
- **UI Styling:**
    - Refine overall application look and feel (typography, spacing, color scheme).
    - Implement responsive design for different screen sizes.
    - Extract common Tailwind styles into reusable constants or a dedicated CSS module/utility function.
- **Form Handling & Validation:**
    - Add more specific or complex validation rules as needed (e.g., password confirmation on registration).
    - Improve user feedback on validation errors (e.g., highlighting fields, better placement of error messages).
- **State Management:**
    - Enhance `AuthContext` to potentially store user details (like name or roles) fetched after login, reducing repeated API calls.
    - Consider other state management tools (Zustand, Redux Toolkit) if application complexity grows significantly.
- **Logout:** Improve placement and styling of the logout functionality (currently basic button in Layout).

### Quality & Testing
- **Frontend Testing:** Add unit and integration tests (e.g., using Vitest/React Testing Library) for components, context, forms, and API interactions.
- **Error Handling:** Implement more user-friendly global error handling (e.g., using toast notifications for API errors instead of just `alert` or console logs). Refine error display on forms.

---

## Backend Enhancements
- **CORS Configuration:** Ensure backend CORS configuration allows production frontend URL.
- **Token Blacklisting Verification:** Confirm the implementation details and effectiveness of the token blacklisting mechanism upon signout.

## Security Enhancements (Backend)
- **Token Refresh Mechanism:** Implement JWT refresh tokens for better session management.
- **Two-Factor Authentication (2FA):** Add 2FA.
- **Password Policies:** Implement stricter password policies.
- **Account Locking/Throttling:** Implement login attempt limits.
- **Audit Logging:** Implement comprehensive security event logging.
- **Verify CSRF Protection:** Confirm CSRF protection effectiveness.

## Feature Expansion (Backend)
- **Attribute-Based Access Control (ABAC):** Explore adding ABAC.
- **API Rate Limiting:** Implement API rate limiting.
- **User Group Management:** Introduce user groups.
- **Self-Service Password Reset:** Allow users to reset passwords.
- **Email Verification:** Implement email verification.

## Testing & Quality Assurance (Backend)
- **Comprehensive Test Coverage:** Increase backend unit and integration test coverage.
- **Security Testing:** Perform dedicated security testing.

## DevOps & Deployment
- **CI/CD Pipeline:** Set up a CI/CD pipeline for both backend and frontend.
- **Containerization:** Provide Docker configurations for both services.
- **Monitoring & Alerting:** Integrate monitoring for both services.

## Documentation
- **Detailed JavaDocs:** Add comprehensive JavaDocs.
- **Frontend Documentation:** Document frontend components, context, API client, and architecture.
- **Sequence Diagrams:** Create sequence diagrams for key flows (Auth, CRUD operations).
- **Role-Specific Dashboards:** Implement different dashboard views based on user role:
        - **ADMIN:** Current view (Manage Users, Roles, Permissions).
        - **MODERATOR:** View only the User List (link to `/admin/users`).
        - **USER:** Display basic user account information (e.g., username, email, role) - requires fetching user details.