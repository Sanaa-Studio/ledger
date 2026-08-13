# Ledger Roadmap

## Phase 1: Backend Foundation

- [x] Initialize TypeScript and Node.js
- [x] Create Express server
- [x] Add health-check endpoint
- [x] Add environment configuration
- [x] Add request validation
- [x] Add centralized error handling
- [ ] Add server tests for middleware and error handling

## Phase 2: Accounts and Transactions API

- [x] Create account CRUD endpoints
- [x] Create transaction CRUD endpoints
- [x] Define consistent API responses and error handling
- [x] Add unit tests for services
- [x] Add endpoint integration tests using Supertest
- [ ] Add filtering and pagination

## Phase 3: Docker and Local Development

- [ ] Learn Docker images and containers
- [ ] Create a Dockerfile for the backend
- [ ] Add Docker Compose
- [ ] Run PostgreSQL locally with Docker
- [ ] Configure persistent database volumes
- [ ] Manage configuration with environment variables

## Phase 4: PostgreSQL Persistence

- [ ] Design relational database schema
- [ ] Define account and transaction relationships
- [ ] Add Drizzle
- [ ] Create and run database migrations
- [ ] Replace in-memory storage with PostgreSQL
- [ ] Add database seeding for development and testing
- [ ] Add database constraints
- [ ] Add indexes where appropriate
- [ ] Update integration tests to use the database
- [ ] Add Redis to the local Docker Compose environment
- [ ] Learn Redis keys, TTLs, and expiration
- [ ] Implement API rate limiting with Redis

## Phase 5: React Frontend

- [ ] Learn core React concepts
- [ ] Create the frontend application
- [ ] Build account views
- [ ] Build transaction views
- [ ] Design transfer data model
- [ ] Implement transfers between accounts
- [ ] Add forms for creating and updating data
- [ ] Add transaction filtering and pagination
- [ ] Connect the frontend to the Express API
- [ ] Add loading and error states
- [ ] Build monthly dashboard

## Phase 6: Authentication and Authorization

- [ ] Add user model
- [ ] Register users
- [ ] Log users in
- [ ] Protect authenticated routes
- [ ] Associate accounts with users
- [ ] Enforce account and transaction ownership
- [ ] Integrate authentication with the frontend

## Phase 7: Deployment and Infrastructure

- [ ] Containerize the production application
- [ ] Configure production Docker Compose where appropriate
- [ ] Add CI/CD with GitHub Actions
- [ ] Provision AWS infrastructure with Terraform
- [ ] Deploy PostgreSQL with Amazon RDS
- [ ] Deploy backend services to AWS
- [ ] Deploy frontend
- [ ] Configure production environment variables and secrets
- [ ] Add production health checks and monitoring

## Phase 8: Future Features

- [ ] Add monthly budgets
- [ ] Add recurring transactions
- [ ] Learn Redis-backed background job queues
- [ ] Add CSV transaction imports
- [ ] Add transaction categories
- [ ] Add spending analytics
- [ ] Add data visualization with D3.js
