# Ledger

Ledger is a full-stack personal finance application for tracking accounts,
transactions, budgets, and monthly spending.

## Project Goal

The goal of this project is to build an end-to-end production-style
application while developing stronger backend and frontend skills.

## MVP

The first version will allow a user to:

- Create financial accounts
- View their accounts
- Add income and expense transactions
- Edit and delete transactions
- Categorize transactions
- Filter transactions by account, category, type, and date
- View a monthly income and expense summary

## Initial Entities

- User
- Account
- Transaction
- Category

## Future Features

- Monthly budgets
- Recurring transactions
- CSV transaction imports
- Spending analytics
- Dockerized local development
- AWS deployment
- Terraform infrastructure

## Current Status

Ledger is currently in the backend-foundation phase. The initial Express API
and project structure are being developed before accounts and transactions are
connected to PostgreSQL.

## Technology Stack

### Current

- Node.js
- TypeScript
- Express
- REST APIs
- Vitest
- Zod
- Supertest
- node:test

### Planned for the MVP

- PostgreSQL
- Drizzle
- React
- Authentication and authorization
- Docker and Docker Compose
- GitHub Actions
- AWS
- Terraform

### Future Exploration

- Redis caching and background jobs
- Event-driven processing with Kafka
- OpenTelemetry
- Service decomposition
- Kubernetes
- Jest

## Architecture

Ledger will begin as a modular monolith with domain-oriented modules for users,
accounts, transactions, categories, and budgets. Background processing and
independent services will be introduced only when a workflow requires separate
scaling, deployment, or asynchronous execution.

## Documentation

- [Product Roadmap](/docs/roadmap.md)
- [User Stories](/docs/user-stories.md)
- [Development Guide](/docs/development.md)
