# Pending Requirements / Future Enhancements

This list outlines potential features, improvements, or areas that might require further development or clarification for the Spring Boot RBAC project.

## Frontend Development (React + TypeScript)

### Core Functionality
- **Component Development:** (Completed - See already_implemented.md)
    - ~~Create more reusable UI components (modals, tables, select, textarea, checkbox, etc.) to ensure consistency and reduce style duplication.~~
    - ~~Refactor remaining pages/components (e.g., RegistrationPage, form pages) to use reusable components.~~
- **API Integration:**
    - ~~Implement API calls for remaining CRUD operations (e.g., Create/Delete Resources/Actions if needed via UI).~~ (UI Implemented - See already_implemented.md)
- **UI Styling:**
    - Refine overall application look and feel (typography, spacing, color scheme).
    - Further improve responsive design for different screen sizes (e.g., table layouts on mobile).
- **Form Handling & Validation:**
    - ~~Improve user feedback on validation errors (e.g., highlighting fields, better placement of error messages).~~ (Partially addressed - See already_implemented.md). Consider using a dedicated form library helper for this.
- **State Management:**
    - ~~Enhance `AuthContext` to potentially store user details (like name or full profile) fetched after login, reducing repeated API calls.~~ (Completed - See already_implemented.md)
    - Consider other state management tools (Zustand, Redux Toolkit) if application complexity grows significantly.

### Quality & Testing
- **Frontend Testing:** Add unit and integration tests (e.g., using Vitest/React Testing Library) for components, context, forms, and API interactions.
- **Error Handling:** Refine error display on forms (e.g., showing validation errors next to fields).

---

## Backend Enhancements
- **CORS Configuration:** Ensure backend CORS configuration allows production frontend URL.
- **Token Blacklisting Verification:** Confirm the implementation details and effectiveness of the token blacklisting mechanism upon signout.

## Security Enhancements (Backend)
- ~~**Token Refresh Mechanism:** Implement JWT refresh tokens for better session management. (Backend generation implemented)~~ (Backend endpoint and Frontend integration completed)
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
- **Resource/Action Management UI:** ~~Add UI pages for managing Resources and Actions if required.~~ (Completed - See already_implemented.md)

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