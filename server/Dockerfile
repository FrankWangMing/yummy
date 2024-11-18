FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN pnpm run build

# Stage 2: Create a lightweight production image
FROM node:20-alpine AS runner

# Set NODE_ENV to production
# ENV NODE_ENV=production

# Set working directory for the runner stage
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/nginx ./nginx
COPY --from=builder /app/.env ./

# Expose the port that NestJS runs on
EXPOSE 3000

# Run the application
CMD ["node", "dist/main"]
