# Ledger Roadmap

## Phase 1: Backend Foundation

- [x] Initialize TypeScript and Node.js
- [x] Create Express server
- [x] Add health-check endpoint
- [x] Add environment configuration
- [x] Add request validation
- [x] Add centralized error handling
- [x] Add server tests for middleware and error handling

## Phase 2: Accounts and Transactions API

- [x] Create account CRUD endpoints
- [x] Create transaction CRUD endpoints
- [x] Define consistent API responses and error handling
- [x] Add unit tests for services
- [x] Add endpoint integration tests using Supertest
- [X] Add pagination for accounts
- [x] Add pagination for transactions
- [x] Add testing for pagination

## Phase 3: Docker and Local Development

- [x] Learn Docker images and containers
- [x] Create a Dockerfile for the backend
- [x] Add Docker Compose
- [x] Run PostgreSQL locally with Docker
- [x] Configure persistent database volumes

## Phase 4: PostgreSQL

- [x] Design relational database schema
- [x] Define account and transaction relationships
- [x] Install Drizzle
- [x] Configure database connection
- [x] Create and run database migrations
- [x] Add database constraints
- [x] Seed local database
- [x] Connect backup PostgreSQL with Aiven
- [x] Manage DB configuration with environment variables
- [x] Establish database connection pooling
- [x] Share/import database schema with backend
- [x] Make docker build db for backend
- [x] Make one root package-lock.json rather than independent lockfiles

## Phase 5: Refactor Services to Use Repositories

- [x] Add repository layer for database access
- [x] Refactor account GET services to use repositories
- [x] Update logic for deleting account with transactions
- [x] Standardize api responses
- [x] Change how balances are calculated to sum transactions instead of storing a balance
- [x] Implement a mapper for transactions
- [x] Refactor transaction CRUD services to use repositories
- [x] Standardize api responses for transaction services
- [x] Standardize error handling for transaction services
- [x] Use id verification middleware for transaction services
- [x] Add put and patch for transaction services

## Phase 6: DB and API Testing

- [x] Run db migations to development and beta environments
- [x] Add service unit tests with mocked repositories
- [x] Add repository/database integration tests
- [x] Update API integration tests to use a test PostgreSQL database
- [x] Reconsider ON DELETE CASCADE for the source account
- [x] Delete the in memory datastore

## Phase 7: React Frontend

- [ ] Learn core React concepts
- [ ] Add frontend to npm workspace
- [ ] Create the frontend application
- [ ] Build account views
- [ ] Build transaction views
- [ ] Design transfer data model
- [ ] Implement transfers between accounts
- [ ] Add forms for creating and updating data
- [ ] Add transaction filtering
- [ ] Test filtering
- [ ] Connect the frontend to the Express API
- [ ] Add loading and error states
- [ ] Build monthly dashboard

## Phase 8: Authentication and Authorization

- [ ] Add user model
- [ ] Register users
- [ ] Log users in
- [ ] Protect authenticated routes
- [ ] Associate accounts with users
- [ ] Enforce account and transaction ownership
- [ ] Add RLS to PostgreSQL for account and transaction ownership
- [ ] Integrate authentication with the frontend
- [ ] Add Redis to the local Docker Compose environment
- [ ] Learn Redis keys, TTLs, and expiration
- [ ] Implement API rate limiting with Redis

## Phase 9: Deployment and Infrastructure

- [ ] Containerize the production application
- [ ] Configure production Docker Compose where appropriate
- [ ] Add CI/CD with GitHub Actions
- [ ] Provision AWS infrastructure with Terraform
- [ ] Deploy PostgreSQL with Amazon RDS
- [ ] Deploy backend services to AWS
- [ ] Deploy frontend
- [ ] Configure production environment variables and secrets
- [ ] Add production health checks and monitoring

## Phase 10: Future Features

- [ ] Add monthly budgets
- [ ] Refactor transaction GET services with cursor pagination
- [ ] Add indexes based on actual query patterns
- [ ] Add recurring transactions
- [ ] Learn Redis-backed background job queues
- [ ] Add CSV transaction imports
- [ ] Add transaction categories
- [ ] Add spending analytics
- [ ] Add data visualization with D3.js
