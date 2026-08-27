# Ledger

Ledger is a full-stack personal finance application for tracking financial accounts, transactions, budgets, and spending.

The project is being built as an end-to-end, production-style application with an emphasis on backend architecture, data modeling, testing, containerization, and cloud deployment.

## Project Goal

The goal of Ledger is to build a realistic application from the database layer through deployment while developing stronger software engineering practices around:

- API design
- Relational data modeling
- Validation and type safety
- Automated testing
- Environment configuration
- Containerization
- CI/CD
- Cloud infrastructure
- Authentication and authorization
- Observability

## MVP

The initial version of Ledger will allow users to:

- Create and manage financial accounts
- Add income and expense transactions
- Edit and delete transactions
- Categorize transactions
- Filter transactions by account, category, type, and date
- View monthly income and expense summaries
- Create monthly budgets
- Authenticate and securely access their financial data

## Current Status

Ledger currently has the core backend and database foundation in place.

### Implemented

- TypeScript and Node.js backend using Express
- REST APIs for accounts and transactions
- PostgreSQL persistence
- Database schemas and migrations using Drizzle ORM
- Controller, service, and repository layers
- Shared Zod schemas for validation and type-safe contracts
- Pagination and filtering support
- Service-level and API-level automated tests
- React and TypeScript frontend foundation
- Frontend integration with backend account APIs
- Dockerized backend and PostgreSQL development environment
- Separate development, test, beta, and production environment configuration
- Dedicated PostgreSQL test database

### In Progress / Next

- Authentication and authorization
- Additional frontend account and transaction workflows
- Budget functionality
- Recurring transactions
- CI/CD
- AWS deployment
- Production observability and monitoring

## Technology Stack

### Backend

- Node.js
- TypeScript
- Express
- REST APIs
- Zod
- PostgreSQL
- Drizzle ORM

### Frontend

- React
- TypeScript
- Vite
- Axios

### Testing

- Jest
- Vitest
- Supertest

### Infrastructure & Development

- Docker
- Docker Compose
- Git
- npm workspaces
- Github Actions

## Repository Structure

Ledger is organized as a monorepo with separate packages for the application layers:

```text
ledger/
├── backend/        # Express API, business logic, repositories, and tests
├── contracts/      # Shared schemas and TypeScript contracts
├── database/       # PostgreSQL schema, migrations, and seed data
├── frontend/       # React frontend
├── docs/           # Architecture, roadmap, and project documentation
├── scripts/        # Development and project automation scripts
└── docker-compose.yml
```

## Documentation

- [Product Roadmap](/docs/roadmap.md)
- [User Stories](/docs/user-stories.md)
- [Development Guide](/docs/development.md)
