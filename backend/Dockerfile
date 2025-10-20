# Use official Node.js image
FROM node:22.20.0-alpine3.22

# Set working directory
WORKDIR /app

# Install build tools (for some npm packages)
RUN apk add --no-cache python3 make g++

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
