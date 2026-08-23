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

## Phase 7A: Frontend Foundation

- [x] Learn core React concepts
- [x] Create Vite + React + TypeScript frontend
- [x] Add frontend to npm workspace
- [x] Make a workspace for api contracts and share types between backend and frontend
- [x] Set up env files for frontend
- [x] Replace hardcoded data with GET /api/accounts
- [x] Validate API responses with Zod

## Phase 7B: Read only Application

- [x] Fetch and render accounts
- [ ] Fetch and render transactions
- [ ] Handle account pagination
- [ ] Handle transaction pagination
- [ ] Add loading states
- [ ] Add error states
- [ ] Add empty states
- [ ] Account details page
- [ ] Add account-specific transaction filtering for account details page
- [ ] Transaction details page

## Phase 7C: CRUD UI

- [ ] Add account creation form
- [ ] Add account update form
- [ ] Add account deletion confirmation modal
- [ ] Add transaction creation form
- [ ] Add transaction update form
- [ ] Add transaction deletion confirmation modal
- [ ] Form validation with Zod
- [ ] Refresh/update UI after mutations
- [ ] Add frontend tests for critical user flows

## Phase 7D: Application Structure/Wireframes

- [ ] Finalize application navigation/sidebar
- [ ] Homepage wireframe
- [ ] Dashboard wireframe
- [x] Accounts list wireframe
- [x] Account details wireframe
- [ ] Transactions list wireframe
- [ ] Transaction details wireframe

## Phase 7E: Styling

- [ ] Establish global typography/colors/background
- [ ] Style application shell/sidebar
- [ ] Style buttons and shared controls
- [ ] Style accounts page
- [ ] Style account details page
- [ ] Style transactions page
- [ ] Style transaction details page
- [ ] Style forms
- [ ] Responsive layouts
- [ ] Loading/error/empty states styling

## Phase 8: Authentication and Authorization

- [ ] Add user model
- [ ] Register users
- [ ] Log users in
- [ ] Add frontend session/authentication state management
- [ ] Protect authenticated routes
- [ ] Associate accounts and transactions with users
- [ ] Enforce account and transaction ownership
- [ ] Add RLS to PostgreSQL for account and transaction ownership
- [ ] Integrate authentication with the frontend

## Phase 9A: Deployment and Infrastructure

- [ ] Containerize the production application
- [ ] Define production container/deployment architecture
- [ ] Add CI/CD with GitHub Actions
- [ ] Provision AWS infrastructure with Terraform
- [ ] Deploy PostgreSQL with Amazon RDS
- [ ] Deploy backend services to AWS
- [ ] Deploy frontend
- [ ] Configure production environment variables and secrets
- [ ] Implement structured application logging
- [ ] Centralize production logs
- [ ] Implement health/readiness checks
- [ ] Set up basic metrics/alerts

## Phase 9B: Infrastructure Improvements

- [ ] Add Redis to local Docker Compose
- [ ] Learn Redis keys/TTL
- [ ] Implement Redis-backed API rate limiting

## Phase 10: Product Features

- [ ] Implement transfers
- [ ] Add transaction filtering
- [ ] Build monthly dashboard
- [ ] Add monthly budgets
- [ ] Add recurring transactions
- [ ] Add CSV imports
- [ ] Add spending analytics
- [ ] Add data visualization with D3.js

## Phase 11A: Future Features - Backend Implementation

- [ ] Add email notifications for budget overspending
- [ ] Add search for transactions
- [ ] Refactor transaction GET services with cursor pagination
- [ ] Add indexes based on actual query patterns
- [ ] Learn Redis-backed background job queues
- [ ] Add transaction categories

## Phase 11B: Future Features - Frontend Implementation

- [ ] Advanced filtering UI
- [ ] Saved views
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements
- [ ] Offline/cache behavior

## Phase 12: Future Architecture Improvements
- [ ] Do University of Helsinki Docker Course
- [ ] Do University of Helsinki Kubernetes course
- [ ] Deploy with Kubernetes
