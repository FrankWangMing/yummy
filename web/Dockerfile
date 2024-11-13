# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Install pnpm and dependencies (leverage Docker cache)
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN pnpm run build

# Stage 2: Create a lightweight production image
FROM nginx:alpine AS runner

# Set working directory for the runner stage
WORKDIR /app

# Copy the built application from the builder stage to Nginx's default HTML folder
COPY --from=builder /app/nginx/nginx.conf /etc/nginx/nginx.conf
#COPY --from=builder /app/nginx/yummy.frankwm.cn_bundle.crt /etc/nginx/ssl/yummy.frankwm.cn_bundle.crt
#COPY --from=builder /app/nginx/yummy.frankwm.cn.key /etc/nginx/ssl/yummy.frankwm.cn.key
COPY --from=builder /app/dist /usr/share/nginx/html/

# Optional: You can expose only the required port (assuming you're serving static files)
EXPOSE 80

# If your app has SSL, uncomment the following line for HTTPS (ensure you configure SSL correctly)
# EXPOSE 443

# Use the default Nginx configuration for serving static content
# Ensure your Nginx server is properly set up for NestJS (e.g., a reverse proxy if needed)
