# Build production Node.js backend
FROM node:20-alpine

WORKDIR /app

# Install curl for container health checks
RUN apk add --no-cache curl

# Copy dependency specifications
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy source code and data assets
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["node", "src/server.js"]
