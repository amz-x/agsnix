### STAGE 1: Build ###
FROM node:20-alpine as builder-app

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN mkdir -p /build/app

WORKDIR /build/app

COPY . .

## Install Node.js dependencies
RUN npm install

## Build the Angular App in production mode and store the artifacts in dist folder
RUN npm run build --output-path=dist


### STAGE 2: Setup ###
FROM nginx:1.25.1-alpine as setup-app

## Copy our default nginx config
COPY nginx/default.conf /etc/nginx/conf.d/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder-app’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder-app /build/app/dist/app/* /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 4200
