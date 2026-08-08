# Ledger Roadmap

## Phase 1: Backend Foundation

- [x] Initialize TypeScript and Node.js
- [x] Create Express server
- [x] Add health-check endpoint
- [x] Add environment configuration
- [x] Add request validation
- [ ] Add centralized error handling
- [ ] Add tests for server behavior

## Phase 2: Accounts and Transactions API

- [x] Create account CRUD endpoints
- [x] Create transaction CRUD endpoints
- [ ] Add filtering and pagination
- [ ] Define consistent API responses and error handling
- [ ] Add unit tests for service
- [ ] Add endpoint integration tests

## Phase 3: Docker and Local Development

- [ ] Learn Docker images and containers
- [ ] Create a Dockerfile for the backend
- [ ] Run PostgreSQL locally with Docker
- [ ] Configure persistent database volumes
- [ ] Add Docker Compose
- [ ] Manage configuration with environment variables

## Phase 4: PostgreSQL Persistence

- [ ] Design relational database schema
- [ ] Define account and transaction relationships
- [ ] Add Drizzle
- [ ] Create and run database migrations
- [ ] Replace in-memory storage with PostgreSQL
- [ ] Add database constraints
- [ ] Add indexes where appropriate
- [ ] Update integration tests to use the database

## Phase 5: React Frontend

- [ ] Learn core React concepts
- [ ] Create the frontend application
- [ ] Build account views
- [ ] Build transaction views
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
