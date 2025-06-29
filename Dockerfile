FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (Railway will override this)
EXPOSE 3000

# Start the application
CMD ["node", "server.js"] 
