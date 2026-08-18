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

## Phase 4: PostgreSQL and Redis

- [ ] Design relational database schema
- [ ] Define account and transaction relationships
- [ ] Install Drizzle
- [ ] Configure database connection
- [ ] Create and run database migrations
- [ ] Seed local database
- [ ] Replace in-memory storage with PostgreSQL
- [ ] Add database constraints
- [ ] Add indexes where appropriate
- [ ] Update integration tests to use the PostgreSQL
- [ ] Connect backup PostgreSQL with Aiven
- [ ] Manage DB configuration with environment variables

## Phase 5: React Frontend

- [ ] Learn core React concepts
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

## Phase 6: Authentication and Authorization

- [ ] Add user model
- [ ] Register users
- [ ] Log users in
- [ ] Protect authenticated routes
- [ ] Associate accounts with users
- [ ] Enforce account and transaction ownership
- [ ] Integrate authentication with the frontend
- [ ] Add Redis to the local Docker Compose environment
- [ ] Learn Redis keys, TTLs, and expiration
- [ ] Implement API rate limiting with Redis

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
