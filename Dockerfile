# Multi-stage Dockerfile for Strapi CMS
# Optimized for minimal resource usage and cost efficiency
# embracingearth.space - Enterprise-grade deployment architecture

# Stage 1: Dependencies
FROM node:20-alpine AS dependencies
WORKDIR /app

# Install build dependencies only if needed
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install production dependencies
# Using npm install instead of npm ci to handle lock file updates gracefully
# embracingearth.space - Enterprise-grade dependency management
RUN npm install --omit=dev && npm cache clean --force

# Stage 2: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
# Install all dependencies for build
# Using npm install to handle lock file updates
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Build Strapi admin panel
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001

# Copy production dependencies
COPY --from=dependencies --chown=strapi:nodejs /app/node_modules ./node_modules

# Copy built application
# Strapi creates 'build' directory (admin panel), not 'dist'
COPY --from=build --chown=strapi:nodejs /app/build ./build
COPY --from=build --chown=strapi:nodejs /app/public ./public
COPY --from=build --chown=strapi:nodejs /app/config ./config
COPY --from=build --chown=strapi:nodejs /app/database ./database
COPY --from=build --chown=strapi:nodejs /app/src ./src
COPY --from=build --chown=strapi:nodejs /app/data ./data
COPY --from=build --chown=strapi:nodejs /app/package*.json ./

# Create directories for uploads and temp data
# Create .env file with proper permissions (Strapi users-permissions plugin writes to it)
# embracingearth.space - Enterprise-grade permission handling for production
RUN mkdir -p /app/public/uploads /app/.tmp && \
    touch /app/.env && \
    chown -R strapi:nodejs /app/public/uploads /app/.tmp /app/.env && \
    chmod 666 /app/.env

# Switch to non-root user
USER strapi

# Expose port (Fly.io will set PORT env var)
EXPOSE 1337

# Health check for Fly.io
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:${PORT:-1337}/_health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start Strapi in production mode
CMD ["npm", "start"]
