# Development Guide

## Commit Convention

Ledger uses [Conventional Commits](https://www.conventionalcommits.org/) to keep commit history consistent and easy to understand.

### Format

```text
<type>(optional-scope): <description>
```

Example:

```text
feat(api): add account endpoints
```

### Commit Types

| Type       | Purpose                                             |
| ---------- | --------------------------------------------------- |
| `feat`     | Introduces user-facing functionality                |
| `fix`      | Corrects a defect                                   |
| `docs`     | Changes documentation only                          |
| `test`     | Adds or updates tests                               |
| `refactor` | Restructures code without changing behavior         |
| `perf`     | Improves performance                                |
| `style`    | Changes formatting without altering behavior        |
| `build`    | Changes build tooling, dependencies, or compilation |
| `ci`       | Changes continuous integration configuration        |
| `chore`    | Performs repository maintenance                     |
| `revert`   | Reverts an earlier commit                           |

### Common Scopes

Scopes are optional and describe the part of the application affected by the commit.

| Scope          | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `api`          | API routes, controllers, services, or middleware     |
| `auth`         | Authentication and authorization                     |
| `db`           | Database schema, migrations, or queries              |
| `accounts`     | Account-related functionality                        |
| `transactions` | Transaction-related functionality                    |
| `config`       | Project or environment configuration                 |
| `frontend`     | Frontend application changes                         |
| `infra`        | Docker, AWS, Terraform, or deployment infrastructure |

> **Note:** Scopes are optional and are not currently restricted to this list by Commitlint.

### Examples

```text
feat(api): add account endpoints
feat(auth): implement login
fix(db): handle transaction rollback
refactor(api): extract transaction service
docs: add architecture overview
test(api): add account integration tests
chore: configure repository tooling
build: migrate from npm to pnpm
ci: add GitHub Actions workflow
perf(db): add transaction date index
```

## Git Hooks

Ledger uses Husky, lint-staged, Commitlint, Prettier, ESLint, TypeScript, and Jest to validate changes before they are committed.

### Pre-commit

The `pre-commit` hook runs:

```text
pnpm exec lint-staged
pnpm validate
pnpm test
```

Before a commit is created:

1. **lint-staged** runs Prettier on supported staged files and updates their staged versions.
2. **pnpm validate** checks repository formatting and runs validation across the pnpm workspace.
3. **pnpm test** starts the test PostgreSQL container, waits for it to become healthy, runs test migrations, executes the backend test suite, and removes the test container afterward.

A failure at any stage prevents the commit from being created.

### Commit Message

The `commit-msg` hook runs Commitlint against the proposed commit message.

Commit messages that do not follow the Conventional Commits format are rejected.

For example:

```text
feat(api): add account endpoint
```

passes, while:

```text
updated stuff
```

fails.

## Development Commands

Run project-level commands from the repository root.

| Command             | Purpose                                                                                        |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| `pnpm dev`          | Start the development PostgreSQL container, backend, and frontend                              |
| `pnpm build`        | Build all workspace packages                                                                   |
| `pnpm validate`     | Check formatting and run validation across all applicable workspaces                           |
| `pnpm format`       | Format repository files with Prettier                                                          |
| `pnpm format:check` | Verify repository formatting without modifying files                                           |
| `pnpm test`         | Set up the test database, run migrations and all backend tests, then remove the test container |
| `pnpm test:setup`   | Start the test database, wait for it to become healthy, and run test migrations                |
| `pnpm test:down`    | Remove the test PostgreSQL container                                                           |
| `pnpm docker:build` | Build and start the Docker Compose application                                                 |
| `pnpm docker:up`    | Start the Docker Compose application                                                           |
| `pnpm docker:down`  | Stop the Docker Compose application                                                            |
| `pnpm docker:db`    | Start the development PostgreSQL container                                                     |
| `pnpm docker:ps`    | Show Docker Compose service status                                                             |

### Build Commands

| Command               | Purpose                                  |
| --------------------- | ---------------------------------------- |
| `pnpm build`          | Build all packages with a `build` script |
| `pnpm build:backend`  | Build only the backend                   |
| `pnpm build:frontend` | Build only the frontend                  |
| `pnpm build:db`       | Build only the database package          |

### Focused Workspace Commands

pnpm filters can be used when working on a single package without running repository-wide commands.

Examples:

```bash
pnpm --filter backend dev
pnpm --filter frontend dev

pnpm --filter backend validate
pnpm --filter frontend validate

pnpm --filter backend test:service

pnpm --filter @ledger/database typecheck
pnpm --filter @ledger/contracts typecheck
```

Use the root-level commands for normal full-project verification and filtered commands for faster feedback while working within one package.

## Validation

Repository validation is split by responsibility.

The root checks formatting for the entire repository:

```text
prettier --check .
```

Each workspace then performs the checks relevant to that package:

```text
contracts
└── TypeScript

database
└── TypeScript

backend
├── ESLint
└── TypeScript

frontend
├── ESLint
└── TypeScript
```

Run the complete validation pipeline with:

```bash
pnpm validate
```

## Testing

The backend test suite contains service, database/repository, and API tests.

Run the complete suite from the repository root:

```bash
pnpm test
```

The command automatically:

```text
start postgres-test
        ↓
wait until healthy
        ↓
run test migrations
        ↓
run backend Jest suite
        ↓
remove postgres-test
```

For a faster feedback loop that does not require PostgreSQL, run only the service tests:

```bash
pnpm --filter backend test:service
```

## Scripts

Run:

```bash
./zip-backend.sh
```

to zip the backend folder and copy it to the root of the project.
