# Use an official Node.js image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the app source code
COPY . .

# Expose port 3000 (or whichever port your dev server uses)
EXPOSE 3000

# Start the development server
CMD ["npm", "start"]
