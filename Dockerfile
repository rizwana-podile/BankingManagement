# Multi-stage Dockerfile for Aura Apex Banking System
FROM node:20-alpine AS base
WORKDIR /app

# Copy manifests
COPY package.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd backend && npm install --omit=dev
RUN cd frontend && npm install

# Copy application source
COPY . .

# Build frontend production bundle
RUN cd frontend && npm run build

# Expose ports: backend 5000, frontend 5173
EXPOSE 5000 5173

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "index.js"]