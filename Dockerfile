FROM node:16-alpine
# Set working directory
WORKDIR /usr/src/app
# Copy package.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY . .
# Expose port 3000
EXPOSE 4000
# Run app
CMD ["npm", "start"]
