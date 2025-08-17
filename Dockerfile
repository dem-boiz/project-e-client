# Stage 1: building the website
FROM node:20-alpine AS build

# Set working dir, so ./ -> /app
WORKDIR /app

# Copy package.json and package-lock.json, needed for dep tree. 
# Allows docker to reuse cached node_modules for future builds on src code changes,
# as long as the package.json and package-lock.json files are not changed.
COPY package.json package-lock.json ./

RUN npm ci

# Copy the rest of the src code
COPY . .

RUN npm run build   

# Stage 2: serve using Nginx
FROM nginx:alpine

# Copy built assets from the build stage to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to override default
COPY nginx.conf /etc/nginx/nginx.conf