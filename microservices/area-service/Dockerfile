# Use an official Node.js runtime as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Copy the .env file to the working directory
COPY . .

# Expose the port that your application will run on
EXPOSE 10000

# Command to start the application
CMD ["npm", "start"]
