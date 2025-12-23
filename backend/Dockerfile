# Use Node.js 20 (LTS) version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package from package.json and package-lock.json
COPY package*.json ./

# Install dependencies 
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the API port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
