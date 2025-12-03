# Use official Node.js image from Docker Hub
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code to the container
COPY . .

# Expose the application port (the port your Node.js app runs on)
EXPOSE 5000

# Command to run the app when the container starts
CMD ["node", "src/server.js"]
