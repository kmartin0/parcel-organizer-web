# syntax=docker/dockerfile:1

# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:16-slim as build

# Set the working directory
WORKDIR /app

# Copy the source code to the image
COPY . .

# Install all the dependencies
RUN npm install

# Get the environment profile
ARG PROFILE
ENV PROFILE $PROFILE

# Generate the build of the application (defaults to dev build if no profile is set).
# Accepts: prod-pi, dev
RUN npm run build-${PROFILE:-dev}

# Stage 2: Serve app with nginx server

# Use official nginx image
FROM nginx:latest

# Remove the default configuration and add our own.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist/parcel-organizer-web/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

//TODO: FIX
