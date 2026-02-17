FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Install serve globally for serving static files
RUN yarn global add serve

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Serve the built app on port 8080
CMD ["serve", "-s", "build", "-l", "8080"]