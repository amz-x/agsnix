### STAGE 1: Builder ###
FROM node:20-alpine as builder-api

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN mkdir -p /build/api

WORKDIR /build/api

COPY . .

## Install Node.js dependencies
RUN npm install

## Build the Nest.js API in production mode and store the artifacts in dist folder
RUN npm run build --output-path=dist

### STAGE 2: Setup ###
FROM node:20-alpine as setup-api

ENV API_DOCKER_ACTIVE=true
ENV API_CONTAINER_MOUNT_DIR='/host'

## Create Mount Directory
RUN mkdir API_CONTAINER_MOUNT_DIR

## Create Runtime Directory
RUN mkdir /api

## From ‘builder-app’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder-api /build/api /api

## From ‘scripts’ directory copy over start.sh executable
COPY ./scripts/start.sh /start.sh

## Make sure script is executable
RUN chmod 755 /start.sh

CMD ["/start.sh"]

EXPOSE 3000
