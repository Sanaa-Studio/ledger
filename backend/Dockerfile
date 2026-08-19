# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

# Copy workspace manifests first for dependency caching
COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node backend/package.json ./backend/package.json
COPY --chown=node:node database/package.json ./database/package.json

RUN npm ci

# Copy source
COPY --chown=node:node backend ./backend
COPY --chown=node:node database ./database

# Database must build first because backend imports @ledger/database/schema
RUN npm run build -w @ledger/database
RUN npm run build -w backend

# Stage 2: Production
FROM node:24-alpine

WORKDIR /usr/src/app

COPY --chown=node:node package.json package-lock.json ./
COPY --chown=node:node backend/package.json ./backend/package.json
COPY --chown=node:node database/package.json ./database/package.json

RUN npm ci --omit=dev --ignore-scripts

# Backend runtime code
COPY --from=builder --chown=node:node /usr/src/app/backend/dist ./backend/dist

# Shared database package runtime code
COPY --from=builder --chown=node:node /usr/src/app/database/dist ./database/dist

USER node

CMD ["npm", "run", "start", "-w", "backend"]