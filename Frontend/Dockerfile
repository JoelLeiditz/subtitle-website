# Use an official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

# Expose the port on which the app runs (default is 3000)
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]