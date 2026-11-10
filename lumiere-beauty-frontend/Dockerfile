# Use Node.js 22
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package configuration
COPY package.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose Vite port
EXPOSE 5173

# Start React development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
