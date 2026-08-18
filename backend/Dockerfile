# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

RUN npm run build

# Stage 2: Production
FROM node:24-alpine

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder --chown=node:node /usr/src/app/dist ./dist

USER node

CMD ["npm", "start"]