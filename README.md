# Spring Boot RBAC Implementation

## Overview
This project demonstrates a comprehensive Role-Based Access Control (RBAC) implementation using Spring Boot 3.x. It provides a secure, scalable, and maintainable authorization framework that can be easily integrated into any Spring Boot application.

## Features

### 1. Advanced Security Implementation
- **JWT-based Authentication**: Secure token-based authentication system
- **Role-Based Authorization**: Granular access control with hierarchical roles
- **Permission-Based Access Control**: Fine-grained permissions within roles
- **Method-Level Security**: Annotated security at the API level
- **Stateless Session Management**: No server-side session storage

### 2. Core Components

#### Authentication & Authorization
- Custom JWT Authentication Filter
- Role-based access control (RBAC)
- Permission-based access control
- Password encryption using BCrypt
- Token blacklisting mechanism

#### Data Models
- User Management
- Role Management
- Permission Management
- Hierarchical Role Structure
- Many-to-Many Relationship Mapping

#### API Security
- Secured REST endpoints
- Role-based endpoint access
- Custom security annotations
- CORS configuration
- CSRF protection

## Technical Architecture

### Technology Stack
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security 6.x
- **Database**: JPA/Hibernate with H2 (configurable)
- **API Documentation**: SpringDoc OpenAPI 3.0
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Java Version**: 17 or higher

### Project Structure
```
src/
├── main/
│   ├── java/
│   │   └── org/cloven/rbac_sample/
│   │       ├── bootstrap/     # Data initialization
│   │       ├── configs/       # Configuration classes
│   │       ├── controllers/   # REST controllers
│   │       ├── dtos/          # Data Transfer Objects
│   │       ├── exceptions/    # Custom exceptions
│   │       ├── models/        # Entity classes
│   │       ├── repositories/  # JPA repositories
│   │       ├── responses/     # Models for responses
│   │       ├── security/      # Security configuration
│   │       └── services/      # Business logic
│   └── resources/
│       ├── application.properties        # Common configuration
│       ├── application-dev.properties    # Development configuration
│       ├── application-test.properties   # Test configuration
│       └── application-prod.properties   # Production configuration
```

## Setup and Installation

### Prerequisites
- JDK 17 or higher
- Maven 3.6 or higher
- Your favorite IDE (IntelliJ IDEA recommended)

### Database Configuration
The project uses H2 file-based database by default in development mode. This ensures data persistence between application restarts.

To use a different database:

1. Add the appropriate database dependency to `pom.xml` (PostgreSQL is already included)
2. Update the appropriate `application-{env}.properties` file or use environment variables

### Environment Configuration
The application supports multiple environments:

- **Development**: Uses H2 file-based database (default)
- **Test**: Uses H2 in-memory database
- **Production**: Configured for PostgreSQL

To set the active profile:
```
export SPRING_PROFILES_ACTIVE=dev
```

Or in application.properties:
```
spring.profiles.active=dev
```

### Running the Application

1. Clone the repository:
```bash
git clone https://github.com/atulgoel126/RBAC_sample.git
```

2. Navigate to the project directory:
```bash
cd RBAC_sample
```

3. Build the project:
```bash
mvn clean install
```

4. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8005`

### Default Credentials
The application is bootstrapped with a default admin user:
- Email: admin@example.com
- Password: admin123

## Security Implementation Details

### Role Hierarchy
```
ROLE_ADMIN
  └── ROLE_MODERATOR
       └── ROLE_USER
```

### Default Roles and Permissions
- **ADMIN**: Full system access
- **MODERATOR**: Read and list access to all resources
- **USER**: Read and list access to user resources only

## API Documentation

### Authentication Endpoints
```
POST /api/auth/signin - Authenticate user
POST /api/auth/signup - Register new user
POST /api/auth/signout - Logout user
```

### User Management Endpoints
```
GET    /api/users - Get all users (ADMIN, MODERATOR)
POST   /api/users - Create user (ADMIN)
GET    /api/users/{id} - Get user by ID (ADMIN, MODERATOR, Self)
PUT    /api/users/{id} - Update user (ADMIN, Self)
DELETE /api/users/{id} - Delete user (ADMIN)
```

### Role Management Endpoints
```
GET    /api/roles - Get all roles (ADMIN)
POST   /api/roles - Create role (ADMIN)
GET    /api/roles/{id} - Get role by ID (ADMIN)
PUT    /api/roles/{id} - Update role (ADMIN)
DELETE /api/roles/{id} - Delete role (ADMIN)
POST   /api/roles/{roleId}/permissions/{permissionId} - Assign permission to role (ADMIN)
DELETE /api/roles/{roleId}/permissions/{permissionId} - Revoke permission from role (ADMIN)
```

### Permission Management Endpoints
```
GET    /api/permissions - Get all permissions (ADMIN)
POST   /api/permissions - Create permission (ADMIN)
GET    /api/permissions/{id} - Get permission by ID (ADMIN)
DELETE /api/permissions/{id} - Delete permission (ADMIN)
```

### Resource Management Endpoints
```
GET    /api/resources - Get all resources (ADMIN)
POST   /api/resources - Create resource (ADMIN)
GET    /api/resources/{id} - Get resource by ID (ADMIN)
PUT    /api/resources/{id} - Update resource (ADMIN)
DELETE /api/resources/{id} - Delete resource (ADMIN)
```

### Action Management Endpoints
```
GET    /api/actions - Get all actions (ADMIN)
POST   /api/actions - Create action (ADMIN)
GET    /api/actions/{id} - Get action by ID (ADMIN)
PUT    /api/actions/{id} - Update action (ADMIN)
DELETE /api/actions/{id} - Delete action (ADMIN)
```

## Testing the API

You can use tools like Postman or curl to test the API endpoints.

### Authentication Example

```bash
# Login
curl -X POST http://localhost:8005/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# The response will contain a JWT token to use in subsequent requests
```

### Using the JWT Token

```bash
# Get all users
curl -X GET http://localhost:8005/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For support, please create an issue in the GitHub repository or contact the maintainers.