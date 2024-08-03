FROM node:16
# Set working directory
WORKDIR /usr/src/app
# Copy package.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy source code
COPY . .
# Expose port 3000
EXPOSE 7000
# Run app
CMD ["npm", "start"]
