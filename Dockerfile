# Multi-stage Dockerfile for React application

# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm install --legacy-peer-deps && npm install ajv@^8.0.0 --legacy-peer-deps

# Copy application files
COPY . .

# Build arguments for environment variables
# Note: React environment variables must be prefixed with REACT_APP_
ARG REACT_APP_GROQ_API_KEY
ENV REACT_APP_GROQ_API_KEY=$REACT_APP_GROQ_API_KEY

# Build React app
RUN npm run build

# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Install serve globally to serve the built React app
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/build ./build

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start serving the React app
CMD ["serve", "-s", "build", "-l", "3000"]


