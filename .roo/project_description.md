# Project Description: Spring Boot RBAC Implementation

## Overview
This project demonstrates a comprehensive Role-Based Access Control (RBAC) implementation using Spring Boot 3.x. It provides a secure, scalable, and maintainable authorization framework designed for integration into Spring Boot applications.

## Technical Architecture

### Technology Stack
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security 6.x
- **Database**: JPA/Hibernate with H2 (configurable, PostgreSQL supported)
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
│   └── resources/             # Configuration files, static assets, templates
└── test/                      # Test code
