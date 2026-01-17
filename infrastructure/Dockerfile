# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext

# Create nginx templates directory
RUN mkdir -p /etc/nginx/templates

# Remove default nginx config to avoid conflicts
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom nginx main config (limita workers)
COPY infrastructure/nginx-main.conf /etc/nginx/nginx.conf

# Copy custom nginx server config template
COPY infrastructure/nginx.conf /etc/nginx/templates/default.conf.template

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy startup script
COPY infrastructure/start.sh /start.sh
RUN chmod +x /start.sh

# Expose port (Railway will set PORT env var)
EXPOSE 80

# Start nginx using the startup script
CMD ["/start.sh"]
