# Use official Node.js image
FROM node:22.20.0-alpine3.22

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source
COPY . .

# Expose port your backend runs on
EXPOSE 5000

# Default command
CMD ["node", "server.js"]
