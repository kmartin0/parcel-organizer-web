# syntax=docker/dockerfile:1

# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the source code to the image
COPY . .

# Install all the dependencies
RUN npm install

# Get the environment profile
ARG PROFILE=dev

# Get the environment properties
ARG PARCEL_ORGANIZER_API_URL=http://localhost:8080
ARG PARCEL_ORGANIZER_CLIENT_ID=parcel-organizer-web
ARG PARCEL_ORGANIZER_CLIENT_SECRET=secret

# Generate the build of the application.
# Accepts: prod, dev
RUN if [ "$PROFILE" = "prod" ] || [ "$PROFILE" = "dev" ]; then \
      npm run build-${PROFILE} -- \
        --define "PARCEL_ORGANIZER_API_URL='${PARCEL_ORGANIZER_API_URL}'" \
        --define "PARCEL_ORGANIZER_CLIENT_ID='${PARCEL_ORGANIZER_CLIENT_ID}'" \
        --define "PARCEL_ORGANIZER_CLIENT_SECRET='${PARCEL_ORGANIZER_CLIENT_SECRET}'"; \
    else \
      echo "Invalid PROFILE: $PROFILE. Expected 'dev' or 'prod'." && exit 1; \
    fi

# Stage 2: Serve app with nginx server

# Use official nginx image
FROM nginx:1.29.0-alpine

# Remove the default configuration and add our own.
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove the default nginx content and add the angular application contents.
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/parcel-organizer-web/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Command to start NGINX when the container launches.
CMD ["nginx", "-g", "daemon off;"]
