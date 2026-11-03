# Multi-stage Dockerfile for unified backend + frontend image
FROM node:24-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:24-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Final unified image with both backend and frontend
FROM node:24-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package*.json ./backend/

# Copy frontend build (browser + SSR server)
COPY --from=frontend-builder /app/frontend/dist/frontend ./frontend/dist

# Install rsync for volume syncing
RUN apk add --no-cache rsync

# Create backup of FULL populated app (source + node_modules + dist) for volume syncing
# We copy the ALREADY POPULATED /app/backend and /app/frontend to /app/backup
# This ensures that when we sync to volume, we provide a fully working environment
RUN mkdir -p /app/backup && \
    cp -r /app/backend /app/backup/backend && \
    cp -r /app/frontend /app/backup/frontend

# Entrypoint script to generate .env and populate volumes
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 3000 4200

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["sh", "-c", "cd /app/backend && node dist/main.js & PORT=4200 BACKEND_URL=http://localhost:3000 node /app/frontend/dist/server/server.mjs"]
