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
│   │   └── com/example/rbac/
│   │       ├── config/          # Configuration classes
│   │       ├── controller/      # REST controllers
│   │       ├── dto/            # Data Transfer Objects
│   │       ├── exception/      # Custom exceptions
│   │       ├── model/          # Entity classes
│   │       ├── repository/     # JPA repositories
│   │       ├── security/       # Security implementations
│   │       ├── service/        # Business logic
│   │       └── util/           # Utility classes
│   └── resources/
│       ├── application.yml     # Application configuration
│       └── data.sql           # Initial data setup
```

## Setup and Installation

### Prerequisites
- JDK 17 or higher
- Maven 3.6 or higher
- Your favorite IDE (IntelliJ IDEA recommended)

### Database Configuration
The project uses H2 in-memory database by default. To use a different database:

1. Add the appropriate database dependency to `pom.xml`
2. Update `application.yml` with your database configuration:

```yaml
spring:
  datasource:
    url: jdbc:your_database_url
    username: your_username
    password: your_password
  jpa:
    hibernate:
      ddl-auto: update
```

### Running the Application

1. Clone the repository:
```bash
git clone https://github.com/atulgoel126/spring-boot-rbac.git
```

2. Navigate to the project directory:
```bash
cd spring-boot-rbac
```

3. Build the project:
```bash
mvn clean install
```

4. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## Security Implementation Details

### Role Hierarchy
```
ROLE_ADMIN
  └── ROLE_MODERATOR
       └── ROLE_USER
```

### Default Roles and Permissions
- **ADMIN**: Full system access
- **MODERATOR**: User management, content management
- **USER**: Basic application access

### Authentication Flow
1. User provides credentials
2. System validates credentials
3. JWT token is generated
4. Token is used for subsequent requests
5. Access is granted based on user roles and permissions

## API Documentation

### Authentication Endpoints
```
POST /api/auth/signup - Register new user
POST /api/auth/signin - Authenticate user
POST /api/auth/refresh - Refresh token
POST /api/auth/logout - Logout user
```

### User Management Endpoints
```
GET    /api/users - Get all users (ADMIN)
POST   /api/users - Create user (ADMIN)
GET    /api/users/{id} - Get user by ID (ADMIN, MODERATOR)
PUT    /api/users/{id} - Update user (ADMIN)
DELETE /api/users/{id} - Delete user (ADMIN)
```

### Role Management Endpoints
```
GET    /api/roles - Get all roles (ADMIN)
POST   /api/roles - Create role (ADMIN)
PUT    /api/roles/{id} - Update role (ADMIN)
DELETE /api/roles/{id} - Delete role (ADMIN)
```

## Testing

### Unit Tests
```bash
mvn test
```

### Integration Tests
```bash
mvn verify
```

## Best Practices Implemented

1. **Security**
    - Password encryption
    - Token-based authentication
    - Role-based authorization
    - Input validation
    - XSS protection
    - CSRF protection

2. **Code Quality**
    - Clean code principles
    - SOLID principles
    - Design patterns
    - Code documentation
    - Unit testing
    - Integration testing

3. **Performance**
    - Database indexing
    - Connection pooling
    - Caching strategies
    - Lazy loading
    - Pagination

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

## Acknowledgments
- Spring Boot team for the excellent framework
- Spring Security team for the robust security framework
- The open-source community for valuable feedback and contributions