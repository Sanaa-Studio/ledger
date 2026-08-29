# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

# Enable the pnpm version declared in package.json
RUN corepack enable

# Copy workspace manifests first for dependency caching
COPY --chown=node:node package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY --chown=node:node backend/package.json ./backend/package.json
COPY --chown=node:node database/package.json ./database/package.json
COPY --chown=node:node contracts/package.json ./contracts/package.json
COPY --chown=node:node frontend/package.json ./frontend/package.json

# Install exactly what pnpm-lock.yaml specifies
RUN pnpm install --frozen-lockfile

# Copy application source
COPY --chown=node:node backend ./backend
COPY --chown=node:node database ./database
COPY --chown=node:node contracts ./contracts

# Build workspace dependencies before backend
RUN pnpm --filter @ledger/contracts build
RUN pnpm --filter @ledger/database build
RUN pnpm --filter backend build

# Create a self-contained production backend.
# --legacy avoids requiring injectWorkspacePackages for deploy.
RUN pnpm --filter backend --prod deploy --legacy /prod/backend


# Stage 2: Production
FROM node:24-alpine

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Backend runtime code
COPY --from=builder --chown=node:node /prod/backend ./

USER node

EXPOSE 5001

CMD ["node", "dist/index.js"]