# Use an official Node runtime as the parent image
FROM node:18.17.0

# The working directory for the application
WORKDIR /app

# Copy the root-level package.json and package-lock.json (if available)
COPY ./package*.json ./

# Copy API service package.json
COPY api/package.json ./api/package.json

# Install dependencies (assuming root package.json includes all necessary dependencies)
RUN npm install

# Copy all .mjs shared libraries from the root directory
COPY ./*.mjs ./
# Copy all .mjs files for the api service
COPY api/*.mjs ./api

# Expose the port your app runs on
EXPOSE 3333

WORKDIR /app/api

# Simplified command to run your app
CMD ["node", "./index.mjs"]
