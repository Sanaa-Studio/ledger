# Development Guide

## Commit Convention

Ledger uses [Conventional Commits](https://www.conventionalcommits.org/) to keep commit history consistent and easy to understand.

### Format

```
<type>(optional-scope): <description>
```

Example:

```
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

> **Note:** Scopes are optional and are **not currently enforced** by Commitlint.

### Examples

```
feat(api): add account endpoints
feat(auth): implement login
fix(db): handle transaction rollback
refactor(api): extract transaction service
docs: add architecture overview
test(api): add account integration tests
chore: configure Docker Compose
build: update TypeScript dependencies
ci: add GitHub Actions workflow
perf(db): add transaction date index
```

---

## Development Commands

Run backend commands from the `backend/` directory.

| Command                | Purpose                                                   |
| ---------------------- | --------------------------------------------------------- |
| `npm run lint`         | Check source files with ESLint                            |
| `npm run lint:fix`     | Automatically fix eligible ESLint problems                |
| `npm run format`       | Format files with Prettier                                |
| `npm run format:check` | Verify formatting without modifying files                 |
| `npm run typecheck`    | Run TypeScript validation without producing build files   |
| `npm run validate`     | Run linting, formatting checks, and TypeScript validation |

> The `pre-commit` Git hook automatically runs `npm run validate` before every commit.

## Scripts

run `./zip-backend.sh` to zip the backend folder and copy it to the root of the project.
